using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IMongoCollection<Appointment> _appointmentsCollection;

    public AppointmentService(IOptions<MongoDbSettings> settings)
    {
        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        var database = client.GetDatabase(mongoSettings.DatabaseName);

        var collName = string.IsNullOrEmpty(mongoSettings.AppointmentsCollectionName) ? "Appointments" : mongoSettings.AppointmentsCollectionName;
        _appointmentsCollection = database.GetCollection<Appointment>(collName);

        _ = SeedInitialAppointmentsAsync();
    }

    private async Task SeedInitialAppointmentsAsync()
    {
        try
        {
            var count = await _appointmentsCollection.CountDocumentsAsync(_ => true);
            if (count == 0)
            {
                var seedApt = new Appointment
                {
                    CustomId = "apt-1",
                    VetId = "vet-1",
                    VetName = "Dr. Emily Stone, DVM",
                    VetEmail = "vet@pethaven.com",
                    ClinicName = "Greenwood Animal Wellness Center",
                    OwnerId = "user-1",
                    OwnerName = "Alex Morgan",
                    OwnerEmail = "adopter@pethaven.com",
                    PetId = "pet-1",
                    PetName = "Luna",
                    PetSpecies = "Dog",
                    Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    Time = "10:30 AM",
                    Reason = "Annual Wellness & Rabies Booster",
                    Status = "Confirmed",
                    Fee = 75,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _appointmentsCollection.InsertOneAsync(seedApt);
            }
        }
        catch
        {
            // Fallback gracefully if Mongo temporarily unreachable
        }
    }

    public async Task<List<Appointment>> GetAppointmentsAsync(
        string? vetId = null,
        string? vetName = null,
        string? vetEmail = null,
        string? ownerId = null,
        string? status = null)
    {
        var filterBuilder = Builders<Appointment>.Filter;
        var filters = new List<FilterDefinition<Appointment>>();

        // Doctor / Veterinarian filtering: can filter by Dr. Email OR Dr. Name OR Vet ID
        var doctorFilters = new List<FilterDefinition<Appointment>>();
        if (!string.IsNullOrWhiteSpace(vetEmail))
        {
            var emailRegex = new MongoDB.Bson.BsonRegularExpression($"^{vetEmail.Trim()}$", "i");
            doctorFilters.Add(filterBuilder.Regex(a => a.VetEmail, emailRegex));
        }

        if (!string.IsNullOrWhiteSpace(vetName))
        {
            var cleanName = vetName.Trim().Replace("Dr.", "").Trim();
            var nameRegex = new MongoDB.Bson.BsonRegularExpression(cleanName, "i");
            doctorFilters.Add(filterBuilder.Regex(a => a.VetName, nameRegex));
        }

        if (!string.IsNullOrWhiteSpace(vetId))
        {
            doctorFilters.Add(filterBuilder.Or(
                filterBuilder.Eq(a => a.VetId, vetId),
                filterBuilder.Eq(a => a.CustomId, vetId)
            ));
        }

        if (doctorFilters.Count > 0)
        {
            filters.Add(filterBuilder.Or(doctorFilters));
        }

        if (!string.IsNullOrWhiteSpace(ownerId))
        {
            filters.Add(filterBuilder.Eq(a => a.OwnerId, ownerId));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusRegex = new MongoDB.Bson.BsonRegularExpression($"^{status.Trim()}$", "i");
            filters.Add(filterBuilder.Regex(a => a.Status, statusRegex));
        }

        var finalFilter = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;
        var list = await _appointmentsCollection.Find(finalFilter).SortByDescending(a => a.CreatedAt).ToListAsync();

        return list;
    }

    public async Task<Appointment?> GetByIdAsync(string id)
    {
        return await _appointmentsCollection.Find(a => a.Id == id || a.CustomId == id).FirstOrDefaultAsync();
    }

    public async Task<Appointment> BookAppointmentAsync(Appointment appointment)
    {
        appointment.CustomId ??= "apt-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        appointment.Status = string.IsNullOrWhiteSpace(appointment.Status) ? "Confirmed" : appointment.Status;
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentsCollection.InsertOneAsync(appointment);
        return appointment;
    }

    public async Task<Appointment?> CancelAppointmentAsync(string id)
    {
        return await UpdateStatusAsync(id, "Cancelled");
    }

    public async Task<Appointment?> RescheduleAppointmentAsync(string id, string date, string time)
    {
        var filter = Builders<Appointment>.Filter.Or(
            Builders<Appointment>.Filter.Eq(a => a.Id, id),
            Builders<Appointment>.Filter.Eq(a => a.CustomId, id)
        );

        var update = Builders<Appointment>.Update
            .Set(a => a.Date, date)
            .Set(a => a.Time, time)
            .Set(a => a.Status, "Confirmed")
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        await _appointmentsCollection.UpdateOneAsync(filter, update);
        return await _appointmentsCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<Appointment?> UpdateStatusAsync(string id, string status)
    {
        var filter = Builders<Appointment>.Filter.Or(
            Builders<Appointment>.Filter.Eq(a => a.Id, id),
            Builders<Appointment>.Filter.Eq(a => a.CustomId, id)
        );

        var update = Builders<Appointment>.Update
            .Set(a => a.Status, status)
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        await _appointmentsCollection.UpdateOneAsync(filter, update);
        return await _appointmentsCollection.Find(filter).FirstOrDefaultAsync();
    }
}

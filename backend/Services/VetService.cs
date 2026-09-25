using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public class VetService : IVetService
{
    private readonly IMongoCollection<Veterinarian> _vetsCollection;
    private readonly IMongoCollection<User> _usersCollection;

    public VetService(IOptions<MongoDbSettings> settings)
    {
        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        var database = client.GetDatabase(mongoSettings.DatabaseName);

        var vetCollName = string.IsNullOrEmpty(mongoSettings.VetsCollectionName) ? "Veterinarians" : mongoSettings.VetsCollectionName;
        _vetsCollection = database.GetCollection<Veterinarian>(vetCollName);

        var userCollName = string.IsNullOrEmpty(mongoSettings.UsersCollectionName) ? "Users" : mongoSettings.UsersCollectionName;
        _usersCollection = database.GetCollection<User>(userCollName);

        _ = SeedInitialVetsAsync();
    }

    private async Task SeedInitialVetsAsync()
    {
        try
        {
            var count = await _vetsCollection.CountDocumentsAsync(_ => true);
            if (count == 0)
            {
                var defaultVets = GetDefaultVets();
                await _vetsCollection.InsertManyAsync(defaultVets);
            }
        }
        catch
        {
            // Seed failure safe fallback
        }
    }

    public async Task<List<Veterinarian>> GetAllVetsAsync(string? search = null, string? specialization = null)
    {
        // First sync any self-registered users with role 'Veterinarian'
        await SyncSelfRegisteredVetUsersAsync();

        var filterBuilder = Builders<Veterinarian>.Filter;
        var filters = new List<FilterDefinition<Veterinarian>>();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim();
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(v => v.Name, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(v => v.ClinicName, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(v => v.Specialization, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(v => v.Address, new MongoDB.Bson.BsonRegularExpression(q, "i"))
            );
            filters.Add(searchFilter);
        }

        if (!string.IsNullOrWhiteSpace(specialization) && !specialization.Equals("All Specializations", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(v => v.Specialization, new MongoDB.Bson.BsonRegularExpression(specialization, "i")));
        }

        var finalFilter = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;
        var list = await _vetsCollection.Find(finalFilter).SortByDescending(v => v.CreatedAt).ToListAsync();

        // If list is empty due to initial empty DB, return default vets
        if (list.Count == 0 && string.IsNullOrWhiteSpace(search) && (string.IsNullOrWhiteSpace(specialization) || specialization == "All Specializations"))
        {
            return GetDefaultVets();
        }

        return list;
    }

    private async Task SyncSelfRegisteredVetUsersAsync()
    {
        try
        {
            var vetUsers = await _usersCollection.Find(u => u.Role == "Veterinarian").ToListAsync();
            foreach (var user in vetUsers)
            {
                var normEmail = user.Email.Trim().ToLowerInvariant();
                var exists = await _vetsCollection.Find(v => v.Email.ToLower() == normEmail).FirstOrDefaultAsync();
                if (exists == null)
                {
                    await EnsureVetProfileForUserAsync(user);
                }
            }
        }
        catch
        {
            // Database sync warning safe fallback
        }
    }

    public async Task<Veterinarian?> GetVetByIdAsync(string id)
    {
        var vet = await _vetsCollection.Find(v => v.Id == id || v.CustomId == id).FirstOrDefaultAsync();
        if (vet != null) return vet;

        return GetDefaultVets().FirstOrDefault(v => v.Id == id || v.CustomId == id);
    }

    public async Task<Veterinarian?> GetVetByEmailAsync(string email)
    {
        var normEmail = email.Trim().ToLowerInvariant();
        var vet = await _vetsCollection.Find(v => v.Email.ToLower() == normEmail).FirstOrDefaultAsync();
        if (vet != null) return vet;

        return GetDefaultVets().FirstOrDefault(v => v.Email.Equals(normEmail, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<Veterinarian> RegisterVetAsync(Veterinarian vet)
    {
        vet.CustomId ??= "vet-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        vet.IsSelfRegistered = true;
        vet.CreatedAt = DateTime.UtcNow;
        vet.UpdatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(vet.Avatar))
        {
            vet.Avatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80";
        }

        await _vetsCollection.InsertOneAsync(vet);
        return vet;
    }

    public async Task<Veterinarian?> UpdateVetAsync(string id, Veterinarian updatedVet)
    {
        var filter = Builders<Veterinarian>.Filter.Or(
            Builders<Veterinarian>.Filter.Eq(v => v.Id, id),
            Builders<Veterinarian>.Filter.Eq(v => v.CustomId, id)
        );

        var existing = await _vetsCollection.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return null;

        var update = Builders<Veterinarian>.Update
            .Set(v => v.Name, updatedVet.Name)
            .Set(v => v.ClinicName, updatedVet.ClinicName)
            .Set(v => v.Specialization, updatedVet.Specialization)
            .Set(v => v.ExperienceYears, updatedVet.ExperienceYears)
            .Set(v => v.ConsultationFee, updatedVet.ConsultationFee)
            .Set(v => v.Address, updatedVet.Address)
            .Set(v => v.Phone, updatedVet.Phone)
            .Set(v => v.Bio, updatedVet.Bio)
            .Set(v => v.UpdatedAt, DateTime.UtcNow);

        if (!string.IsNullOrWhiteSpace(updatedVet.Avatar))
        {
            update = update.Set(v => v.Avatar, updatedVet.Avatar);
        }

        await _vetsCollection.UpdateOneAsync(filter, update);
        return await _vetsCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteVetAsync(string id)
    {
        var filter = Builders<Veterinarian>.Filter.Or(
            Builders<Veterinarian>.Filter.Eq(v => v.Id, id),
            Builders<Veterinarian>.Filter.Eq(v => v.CustomId, id)
        );

        var existing = await _vetsCollection.Find(filter).FirstOrDefaultAsync();
        if (existing != null)
        {
            var result = await _vetsCollection.DeleteOneAsync(filter);
            if (!string.IsNullOrEmpty(existing.Email))
            {
                var normEmail = existing.Email.Trim().ToLowerInvariant();
                // Update matching user in Users collection so role is reset and won't auto-re-sync
                var userFilter = Builders<User>.Filter.Eq(u => u.Email, normEmail);
                var updateRole = Builders<User>.Update.Set(u => u.Role, "Adopter");
                await _usersCollection.UpdateOneAsync(userFilter, updateRole);
            }
            return result.DeletedCount > 0;
        }

        return false;
    }

    public async Task EnsureVetProfileForUserAsync(User user, string? clinicName = null, string? specialization = null, decimal? fee = null, string? bio = null)
    {
        var normEmail = user.Email.Trim().ToLowerInvariant();
        var exists = await _vetsCollection.Find(v => v.Email.ToLower() == normEmail).FirstOrDefaultAsync();
        if (exists != null) return;

        var vetName = user.Name.StartsWith("Dr.", StringComparison.OrdinalIgnoreCase) ? user.Name : $"Dr. {user.Name}";

        var newVet = new Veterinarian
        {
            CustomId = "vet-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            UserId = user.Id,
            Name = vetName,
            Email = normEmail,
            ClinicName = !string.IsNullOrWhiteSpace(clinicName) ? clinicName : $"{user.Name}'s Animal Care Clinic",
            Specialization = !string.IsNullOrWhiteSpace(specialization) ? specialization : "Small Animal Wellness & Surgery",
            ExperienceYears = 6,
            Rating = 5.0,
            ReviewCount = 1,
            ConsultationFee = fee ?? 75,
            Address = !string.IsNullOrWhiteSpace(user.Address) ? user.Address : (!string.IsNullOrWhiteSpace(user.City) ? user.City : "Main Street Veterinary Center"),
            Phone = user.Phone ?? "+1 (555) 123-4567",
            Avatar = !string.IsNullOrWhiteSpace(user.ProfileImage) ? user.ProfileImage : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
            Bio = !string.IsNullOrWhiteSpace(bio) ? bio : $"Board-certified veterinary practitioner specializing in compassionate patient care.",
            IsSelfRegistered = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _vetsCollection.InsertOneAsync(newVet);
    }

    private static List<Veterinarian> GetDefaultVets()
    {
        return new List<Veterinarian>
        {
            new Veterinarian
            {
                CustomId = "vet-1",
                Name = "Dr. Emily Stone, DVM",
                Email = "vet@pethaven.com",
                ClinicName = "Greenwood Animal Wellness Center",
                Specialization = "Small Animal Wellness & Surgery",
                ExperienceYears = 11,
                Rating = 4.95,
                ReviewCount = 142,
                ConsultationFee = 75,
                Address = "1200 4th Ave, Seattle, WA",
                Phone = "+1 (555) 567-8901",
                Avatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
                Bio = "Graduated from WSU College of Veterinary Medicine. Passionate about preventive wellness, stress-free handling, and dental care.",
                AvailableDays = new List<string> { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" },
                TimeSlots = new List<string> { "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM" }
            },
            new Veterinarian
            {
                CustomId = "vet-2",
                Name = "Dr. Marcus Vance, DVM",
                Email = "marcus@soundvets.org",
                ClinicName = "Soundview Veterinary Hospital",
                Specialization = "Canine Orthopedics & Internal Medicine",
                ExperienceYears = 16,
                Rating = 4.88,
                ReviewCount = 98,
                ConsultationFee = 85,
                Address = "450 Puget Sound Blvd, Seattle, WA",
                Phone = "+1 (555) 890-1234",
                Avatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
                Bio = "Extensive background in orthopedic reconstruction, emergency triage, and senior pet mobility therapy.",
                AvailableDays = new List<string> { "Monday", "Wednesday", "Thursday", "Friday" },
                TimeSlots = new List<string> { "09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM" }
            },
            new Veterinarian
            {
                CustomId = "vet-3",
                Name = "Dr. Sophia Patel, DVM",
                Email = "sophia@felineandalley.com",
                ClinicName = "Urban Paws Feline & Exotic Clinic",
                Specialization = "Feline Medicine & Exotic Care",
                ExperienceYears = 8,
                Rating = 4.92,
                ReviewCount = 110,
                ConsultationFee = 70,
                Address = "220 Broadway East, Seattle, WA",
                Phone = "+1 (555) 901-2345",
                Avatar = "https://images.unsplash.com/photo-1594824813590-48924b174092?w=300&auto=format&fit=crop&q=80",
                Bio = "Dedicated advocate for feline-friendly medicine and small mammal care including rabbits, guinea pigs, and avian friends.",
                AvailableDays = new List<string> { "Tuesday", "Wednesday", "Friday", "Saturday" },
                TimeSlots = new List<string> { "10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "04:30 PM" }
            }
        };
    }
}

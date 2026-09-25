using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public class LostFoundService : ILostFoundService
{
    private readonly IMongoCollection<LostFoundPet> _collection;

    public LostFoundService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        var collName = string.IsNullOrEmpty(settings.Value.LostFoundCollectionName) ? "LostFoundReports" : settings.Value.LostFoundCollectionName;
        _collection = database.GetCollection<LostFoundPet>(collName);

        // Seed initial reports if collection is empty
        _ = SeedInitialReportsAsync();
    }

    private async Task SeedInitialReportsAsync()
    {
        try
        {
            var count = await _collection.CountDocumentsAsync(_ => true);
            if (count == 0)
            {
                var starters = new List<LostFoundPet>
                {
                    new LostFoundPet
                    {
                        CustomId = "lf-1",
                        Type = "Lost",
                        PetName = "Buster",
                        Species = "Dog",
                        Breed = "Beagle Mix",
                        Gender = "Male",
                        Color = "Tri-color (Brown, Black, White)",
                        LastSeenLocation = "Green Lake Park, Seattle, WA",
                        LastSeenDate = DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd"),
                        Reward = "$250",
                        ContactName = "David Kim",
                        ContactPhone = "+1 (206) 555-0192",
                        Image = "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80",
                        Description = "Wearing a blue reflective collar with tag 'Buster'. Very friendly with people, might be skittish around loud trucks.",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow.AddDays(-2)
                    },
                    new LostFoundPet
                    {
                        CustomId = "lf-2",
                        Type = "Found",
                        PetName = "Found Tabby",
                        Species = "Cat",
                        Breed = "Domestic Shorthair",
                        Gender = "Female",
                        Color = "Orange & White Tabby",
                        LastSeenLocation = "Near 45th St & Fremont Ave, Seattle",
                        LastSeenDate = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd"),
                        ContactName = "Elena Rostov",
                        ContactPhone = "+1 (206) 555-0143",
                        Image = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
                        Description = "Found resting on front porch. No collar. Very gentle and purrs easily. Microchip scanned at local vet clinic but unregistered.",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    },
                    new LostFoundPet
                    {
                        CustomId = "lf-3",
                        Type = "Lost",
                        PetName = "Coco",
                        Species = "Dog",
                        Breed = "French Bulldog",
                        Gender = "Female",
                        Color = "Cream / Fawn",
                        LastSeenLocation = "Capitol Hill, Volunteer Park",
                        LastSeenDate = DateTime.UtcNow.AddHours(-18).ToString("yyyy-MM-dd"),
                        Reward = "$500",
                        ContactName = "Sarah Jenkins",
                        ContactPhone = "+1 (206) 555-0188",
                        Image = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80",
                        Description = "Requires daily allergy eye drops. Wearing pink floral harness with microchip ID #985141002.",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow.AddHours(-18)
                    }
                };

                await _collection.InsertManyAsync(starters);
            }
        }
        catch
        {
            // Ignore startup seed error if db temporarily busy
        }
    }

    private static FilterDefinition<LostFoundPet> GetIdFilter(string id)
    {
        var filterBuilder = Builders<LostFoundPet>.Filter;
        if (MongoDB.Bson.ObjectId.TryParse(id, out _))
        {
            return filterBuilder.Or(
                filterBuilder.Eq(p => p.Id, id),
                filterBuilder.Eq(p => p.CustomId, id)
            );
        }
        return filterBuilder.Eq(p => p.CustomId, id);
    }

    public async Task<List<LostFoundPet>> GetReportsAsync(string? type = null, string? search = null)
    {
        var filterBuilder = Builders<LostFoundPet>.Filter;
        var filters = new List<FilterDefinition<LostFoundPet>>();

        if (!string.IsNullOrWhiteSpace(type) && !type.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(p => p.Type, new MongoDB.Bson.BsonRegularExpression($"^{type}$", "i")));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim();
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(p => p.PetName, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(p => p.Breed, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(p => p.Color, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(p => p.LastSeenLocation, new MongoDB.Bson.BsonRegularExpression(q, "i")),
                filterBuilder.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(q, "i"))
            );
            filters.Add(searchFilter);
        }

        var combined = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;

        return await _collection.Find(combined)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<LostFoundPet?> GetByIdAsync(string id)
    {
        var filter = GetIdFilter(id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<LostFoundPet> CreateReportAsync(LostFoundPet report)
    {
        report.CustomId = "lf-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        report.CreatedAt = DateTime.UtcNow;
        report.UpdatedAt = DateTime.UtcNow;
        report.Status = string.IsNullOrWhiteSpace(report.Status) ? "Active" : report.Status;

        await _collection.InsertOneAsync(report);
        return report;
    }

    public async Task<bool> DeleteReportAsync(string id)
    {
        var filter = GetIdFilter(id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    public async Task<LostFoundPet?> UpdateStatusAsync(string id, string status)
    {
        var filter = GetIdFilter(id);
        var update = Builders<LostFoundPet>.Update
            .Set(p => p.Status, status)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        await _collection.UpdateOneAsync(filter, update);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }
}

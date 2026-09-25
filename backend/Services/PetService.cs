using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.DTOs;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public interface IPetService
{
    Task<PetListResponseDto> GetPetsAsync(PetListQueryParams queryParams, string? callerUserId = null, string? callerUserEmail = null);
    Task<PetResponseDto?> GetByIdAsync(string id, string? callerUserId = null, string? callerUserEmail = null);
    Task<List<PetResponseDto>> GetFeaturedPetsAsync(string? callerUserId = null, string? callerUserEmail = null);
    Task<List<PetResponseDto>> GetFavoritesAsync(string? userId, string? userEmail);
    Task<(bool isFavorite, List<string> favoriteIds)> ToggleFavoriteAsync(string petId, string? userId, string? userEmail);
    Task<PetResponseDto> CreatePetAsync(CreatePetDto dto);
    Task<PetResponseDto?> UpdatePetAsync(string id, UpdatePetDto dto);
    Task<bool> DeletePetAsync(string id);
}

public class PetService : IPetService
{
    private readonly IMongoCollection<Pet> _petsCollection;
    private readonly IMongoCollection<User> _usersCollection;

    public PetService(IOptions<MongoDbSettings> settings)
    {
        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        var database = client.GetDatabase(mongoSettings.DatabaseName);
        var collName = string.IsNullOrEmpty(mongoSettings.PetsCollectionName) ? "Pets" : mongoSettings.PetsCollectionName;
        _petsCollection = database.GetCollection<Pet>(collName);
        var usersColl = string.IsNullOrEmpty(mongoSettings.UsersCollectionName) ? "Users" : mongoSettings.UsersCollectionName;
        _usersCollection = database.GetCollection<User>(usersColl);

        // Seed initial mock pets if empty
        _ = SeedInitialPetsAsync();
    }

    private async Task SeedInitialPetsAsync()
    {
        try
        {
            var initialPets = GetDefaultSeedPets();
            foreach (var p in initialPets)
            {
                var exists = await _petsCollection.Find(x => x.CustomId == p.CustomId || x.Name == p.Name).FirstOrDefaultAsync();
                if (exists == null)
                {
                    await _petsCollection.InsertOneAsync(p);
                }
            }
        }
        catch
        {
            // Ignore seed error if connection temporarily unavailable
        }
    }

    private async Task<List<string>> GetUserFavoriteIdsAsync(string? userId, string? userEmail)
    {
        if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(userEmail))
            return new List<string>();

        var filterBuilder = Builders<User>.Filter;
        var filters = new List<FilterDefinition<User>>();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            if (MongoDB.Bson.ObjectId.TryParse(userId, out _))
            {
                filters.Add(filterBuilder.Eq(u => u.Id, userId));
            }
            filters.Add(filterBuilder.Eq(u => u.FirebaseUid, userId));
        }

        if (!string.IsNullOrWhiteSpace(userEmail))
        {
            filters.Add(filterBuilder.Eq(u => u.Email, userEmail.Trim().ToLowerInvariant()));
        }

        if (filters.Count == 0) return new List<string>();

        var user = await _usersCollection.Find(filterBuilder.Or(filters)).FirstOrDefaultAsync();
        return user?.FavoritePetIds ?? new List<string>();
    }

    public async Task<PetListResponseDto> GetPetsAsync(PetListQueryParams query, string? callerUserId = null, string? callerUserEmail = null)
    {
        var filterBuilder = Builders<Pet>.Filter;
        var filters = new List<FilterDefinition<Pet>>();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.Breed, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.ShelterLocation, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filters.Add(searchFilter);
        }

        if (!string.IsNullOrWhiteSpace(query.Species) && !query.Species.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(p => p.Species, new MongoDB.Bson.BsonRegularExpression($"^{query.Species}$", "i")));
        }

        if (!string.IsNullOrWhiteSpace(query.Size) && !query.Size.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(p => p.Size, new MongoDB.Bson.BsonRegularExpression($"^{query.Size}$", "i")));
        }

        if (!string.IsNullOrWhiteSpace(query.Gender) && !query.Gender.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(p => p.Gender, new MongoDB.Bson.BsonRegularExpression($"^{query.Gender}$", "i")));
        }

        if (!string.IsNullOrWhiteSpace(query.Status) && !query.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add(filterBuilder.Regex(p => p.Status, new MongoDB.Bson.BsonRegularExpression($"^{query.Status}$", "i")));
        }

        if (query.Vaccinated.HasValue && query.Vaccinated.Value)
        {
            filters.Add(filterBuilder.Eq(p => p.Vaccinated, true));
        }

        if (!string.IsNullOrWhiteSpace(query.OwnerEmail))
        {
            filters.Add(filterBuilder.Eq(p => p.OwnerEmail, query.OwnerEmail.Trim().ToLowerInvariant()));
        }

        var combinedFilter = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;

        var total = await _petsCollection.CountDocumentsAsync(combinedFilter);

        var page = query.Page > 0 ? query.Page : 1;
        var limit = query.Limit > 0 ? query.Limit : 20;

        var sortBuilder = Builders<Pet>.Sort;
        SortDefinition<Pet> sort = query.SortBy switch
        {
            "fee-asc" => sortBuilder.Ascending(p => p.AdoptionFee),
            "fee-desc" => sortBuilder.Descending(p => p.AdoptionFee),
            "age-asc" => sortBuilder.Ascending(p => p.AgeMonths),
            _ => sortBuilder.Descending(p => p.CreatedAt)
        };

        var pets = await _petsCollection.Find(combinedFilter)
            .Sort(sort)
            .Skip((page - 1) * limit)
            .Limit(limit)
            .ToListAsync();

        var favIds = await GetUserFavoriteIdsAsync(callerUserId, callerUserEmail);

        return new PetListResponseDto
        {
            Pets = pets.Select(p => MapToResponse(p, favIds)).ToList(),
            Total = total,
            Page = page,
            TotalPages = (int)Math.Ceiling((double)total / limit)
        };
    }

    private static FilterDefinition<Pet> GetPetFilter(string id)
    {
        if (MongoDB.Bson.ObjectId.TryParse(id, out _))
        {
            return Builders<Pet>.Filter.Or(
                Builders<Pet>.Filter.Eq(p => p.Id, id),
                Builders<Pet>.Filter.Eq(p => p.CustomId, id)
            );
        }
        return Builders<Pet>.Filter.Eq(p => p.CustomId, id);
    }

    public async Task<PetResponseDto?> GetByIdAsync(string id, string? callerUserId = null, string? callerUserEmail = null)
    {
        var filter = GetPetFilter(id);
        var pet = await _petsCollection.Find(filter).FirstOrDefaultAsync();
        if (pet == null) return null;

        var favIds = await GetUserFavoriteIdsAsync(callerUserId, callerUserEmail);
        return MapToResponse(pet, favIds);
    }

    public async Task<List<PetResponseDto>> GetFeaturedPetsAsync(string? callerUserId = null, string? callerUserEmail = null)
    {
        var pets = await _petsCollection.Find(p => p.Featured || p.Status == "Available")
            .Limit(4)
            .ToListAsync();
        var favIds = await GetUserFavoriteIdsAsync(callerUserId, callerUserEmail);
        return pets.Select(p => MapToResponse(p, favIds)).ToList();
    }

    public async Task<List<PetResponseDto>> GetFavoritesAsync(string? userId, string? userEmail)
    {
        var favIds = await GetUserFavoriteIdsAsync(userId, userEmail);
        if (favIds == null || favIds.Count == 0)
        {
            return new List<PetResponseDto>();
        }

        var filterBuilder = Builders<Pet>.Filter;
        var filters = new List<FilterDefinition<Pet>>();

        foreach (var id in favIds)
        {
            if (string.IsNullOrWhiteSpace(id)) continue;
            if (MongoDB.Bson.ObjectId.TryParse(id, out _))
            {
                filters.Add(filterBuilder.Eq(p => p.Id, id));
            }
            filters.Add(filterBuilder.Eq(p => p.CustomId, id));
        }

        if (filters.Count == 0)
        {
            return new List<PetResponseDto>();
        }

        var pets = await _petsCollection.Find(filterBuilder.Or(filters)).ToListAsync();
        return pets.Select(p => MapToResponse(p, favIds)).ToList();
    }

    public async Task<(bool isFavorite, List<string> favoriteIds)> ToggleFavoriteAsync(string petId, string? userId, string? userEmail)
    {
        if (string.IsNullOrWhiteSpace(userId) && string.IsNullOrWhiteSpace(userEmail))
        {
            return (false, new List<string>());
        }

        var filterBuilder = Builders<User>.Filter;
        var filters = new List<FilterDefinition<User>>();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            if (MongoDB.Bson.ObjectId.TryParse(userId, out _))
            {
                filters.Add(filterBuilder.Eq(u => u.Id, userId));
            }
            filters.Add(filterBuilder.Eq(u => u.FirebaseUid, userId));
        }

        if (!string.IsNullOrWhiteSpace(userEmail))
        {
            filters.Add(filterBuilder.Eq(u => u.Email, userEmail.Trim().ToLowerInvariant()));
        }

        var user = await _usersCollection.Find(filterBuilder.Or(filters)).FirstOrDefaultAsync();

        if (user == null)
        {
            user = new User
            {
                Name = !string.IsNullOrWhiteSpace(userEmail) ? userEmail.Split('@')[0] : "Adopter",
                Email = !string.IsNullOrWhiteSpace(userEmail) ? userEmail.Trim().ToLowerInvariant() : $"{userId}@pethaven.local",
                FirebaseUid = userId,
                Role = "Adopter",
                FavoritePetIds = new List<string> { petId },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _usersCollection.InsertOneAsync(user);
            return (true, user.FavoritePetIds);
        }

        user.FavoritePetIds ??= new List<string>();
        bool isFav;

        if (user.FavoritePetIds.Contains(petId, StringComparer.OrdinalIgnoreCase))
        {
            user.FavoritePetIds.RemoveAll(x => string.Equals(x, petId, StringComparison.OrdinalIgnoreCase));
            isFav = false;
        }
        else
        {
            user.FavoritePetIds.Add(petId);
            isFav = true;
        }

        user.UpdatedAt = DateTime.UtcNow;
        var update = Builders<User>.Update
            .Set(u => u.FavoritePetIds, user.FavoritePetIds)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);

        await _usersCollection.UpdateOneAsync(Builders<User>.Filter.Eq(u => u.Id, user.Id), update);
        return (isFav, user.FavoritePetIds);
    }

    public async Task<PetResponseDto> CreatePetAsync(CreatePetDto dto)
    {
        var customId = "pet-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        var pet = new Pet
        {
            CustomId = customId,
            Name = dto.Name,
            Species = string.IsNullOrWhiteSpace(dto.Species) ? "Dog" : dto.Species,
            Breed = string.IsNullOrWhiteSpace(dto.Breed) ? "Mixed Breed" : dto.Breed,
            Age = string.IsNullOrWhiteSpace(dto.Age) ? "1 year" : dto.Age,
            AgeMonths = dto.AgeMonths ?? 12,
            Gender = string.IsNullOrWhiteSpace(dto.Gender) ? "Female" : dto.Gender,
            Size = string.IsNullOrWhiteSpace(dto.Size) ? "Medium" : dto.Size,
            WeightKg = dto.WeightKg ?? 15.0,
            Color = dto.Color,
            Vaccinated = dto.Vaccinated ?? true,
            VaccinationStatus = string.IsNullOrWhiteSpace(dto.VaccinationStatus) ? "Up to date" : dto.VaccinationStatus,
            HealthStatus = string.IsNullOrWhiteSpace(dto.HealthStatus) ? "Good" : dto.HealthStatus,
            SpayedNeutered = dto.SpayedNeutered ?? true,
            MicrochipId = dto.MicrochipId ?? ("CHIP-" + Random.Shared.Next(100000, 999999)),
            AdoptionFee = dto.AdoptionFee ?? 100,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Available" : dto.Status,
            ShelterId = dto.ShelterId ?? "shelter-1",
            ShelterName = dto.ShelterName ?? "Happy Paws Rescue",
            ShelterLocation = dto.ShelterLocation ?? "Seattle, WA",
            OwnerId = dto.OwnerId,
            OwnerEmail = dto.OwnerEmail?.Trim().ToLowerInvariant(),
            OwnerName = dto.OwnerName,
            PrimaryImage = string.IsNullOrWhiteSpace(dto.PrimaryImage)
                ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
                : dto.PrimaryImage,
            GalleryImages = dto.GalleryImages ?? new List<string> { dto.PrimaryImage ?? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80" },
            Description = dto.Description ?? string.Empty,
            Temperament = dto.Temperament ?? new List<string> { "Friendly", "Playful" },
            Featured = dto.Featured ?? false,
            IntakeDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _petsCollection.InsertOneAsync(pet);
        return MapToResponse(pet);
    }

    public async Task<PetResponseDto?> UpdatePetAsync(string id, UpdatePetDto dto)
    {
        var filter = GetPetFilter(id);
        var existing = await _petsCollection.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return null;

        var update = Builders<Pet>.Update.Set(p => p.UpdatedAt, DateTime.UtcNow);

        if (!string.IsNullOrEmpty(dto.Name)) update = update.Set(p => p.Name, dto.Name);
        if (!string.IsNullOrEmpty(dto.Species)) update = update.Set(p => p.Species, dto.Species);
        if (!string.IsNullOrEmpty(dto.Breed)) update = update.Set(p => p.Breed, dto.Breed);
        if (!string.IsNullOrEmpty(dto.Age)) update = update.Set(p => p.Age, dto.Age);
        if (dto.AgeMonths.HasValue) update = update.Set(p => p.AgeMonths, dto.AgeMonths.Value);
        if (!string.IsNullOrEmpty(dto.Gender)) update = update.Set(p => p.Gender, dto.Gender);
        if (!string.IsNullOrEmpty(dto.Size)) update = update.Set(p => p.Size, dto.Size);
        if (dto.WeightKg.HasValue) update = update.Set(p => p.WeightKg, dto.WeightKg.Value);
        if (dto.Color != null) update = update.Set(p => p.Color, dto.Color);
        if (dto.Vaccinated.HasValue) update = update.Set(p => p.Vaccinated, dto.Vaccinated.Value);
        if (!string.IsNullOrEmpty(dto.VaccinationStatus)) update = update.Set(p => p.VaccinationStatus, dto.VaccinationStatus);
        if (!string.IsNullOrEmpty(dto.HealthStatus)) update = update.Set(p => p.HealthStatus, dto.HealthStatus);
        if (dto.SpayedNeutered.HasValue) update = update.Set(p => p.SpayedNeutered, dto.SpayedNeutered.Value);
        if (dto.MicrochipId != null) update = update.Set(p => p.MicrochipId, dto.MicrochipId);
        if (dto.AdoptionFee.HasValue) update = update.Set(p => p.AdoptionFee, dto.AdoptionFee.Value);
        if (!string.IsNullOrEmpty(dto.Status)) update = update.Set(p => p.Status, dto.Status);
        if (!string.IsNullOrEmpty(dto.PrimaryImage)) update = update.Set(p => p.PrimaryImage, dto.PrimaryImage);
        if (dto.GalleryImages != null) update = update.Set(p => p.GalleryImages, dto.GalleryImages);
        if (dto.Description != null) update = update.Set(p => p.Description, dto.Description);
        if (dto.Temperament != null) update = update.Set(p => p.Temperament, dto.Temperament);
        if (dto.Featured.HasValue) update = update.Set(p => p.Featured, dto.Featured.Value);

        await _petsCollection.UpdateOneAsync(filter, update);
        var updatedPet = await _petsCollection.Find(filter).FirstOrDefaultAsync();
        return updatedPet == null ? null : MapToResponse(updatedPet);
    }

    public async Task<bool> DeletePetAsync(string id)
    {
        var filter = GetPetFilter(id);
        var result = await _petsCollection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    private static PetResponseDto MapToResponse(Pet pet, List<string>? userFavorites = null)
    {
        var petId = pet.CustomId ?? pet.Id ?? string.Empty;
        var isFav = userFavorites != null && (
            userFavorites.Contains(petId, StringComparer.OrdinalIgnoreCase) ||
            (!string.IsNullOrEmpty(pet.Id) && userFavorites.Contains(pet.Id, StringComparer.OrdinalIgnoreCase)) ||
            (!string.IsNullOrEmpty(pet.CustomId) && userFavorites.Contains(pet.CustomId, StringComparer.OrdinalIgnoreCase))
        );

        return new PetResponseDto
        {
            Id = petId,
            CustomId = pet.CustomId,
            Name = pet.Name,
            Species = pet.Species,
            Breed = pet.Breed,
            Age = pet.Age,
            AgeMonths = pet.AgeMonths,
            Gender = pet.Gender,
            Size = pet.Size,
            WeightKg = pet.WeightKg,
            Color = pet.Color,
            Vaccinated = pet.Vaccinated,
            VaccinationStatus = pet.VaccinationStatus,
            HealthStatus = pet.HealthStatus,
            SpayedNeutered = pet.SpayedNeutered,
            MicrochipId = pet.MicrochipId,
            AdoptionFee = pet.AdoptionFee,
            Status = pet.Status,
            ShelterId = pet.ShelterId,
            ShelterName = pet.ShelterName,
            ShelterLocation = pet.ShelterLocation,
            OwnerId = pet.OwnerId,
            OwnerEmail = pet.OwnerEmail,
            OwnerName = pet.OwnerName,
            PrimaryImage = pet.PrimaryImage,
            GalleryImages = pet.GalleryImages,
            Description = pet.Description,
            Temperament = pet.Temperament,
            Featured = pet.Featured,
            IntakeDate = pet.IntakeDate,
            IsFavorite = isFav,
            CreatedAt = pet.CreatedAt
        };
    }

    private static List<Pet> GetDefaultSeedPets()
    {
        return new List<Pet>
        {
            new Pet
            {
                CustomId = "pet-1",
                Name = "Luna",
                Species = "Dog",
                Breed = "Golden Retriever",
                Age = "2 years",
                AgeMonths = 24,
                Gender = "Female",
                Size = "Large",
                WeightKg = 28.5,
                Color = "Golden",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141002348911",
                AdoptionFee = 150,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80" },
                Description = "Luna is a joyful, affectionate 2-year-old Golden Retriever who adores trail walks, swimming, and playing fetch.",
                Temperament = new List<string> { "Playful", "Friendly", "Affectionate", "Intelligent" },
                Featured = true,
                IntakeDate = "2025-01-10",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-2",
                Name = "Milo",
                Species = "Cat",
                Breed = "British Shorthair",
                Age = "1 year",
                AgeMonths = 14,
                Gender = "Male",
                Size = "Medium",
                WeightKg = 4.8,
                Color = "Blue-Grey",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141008741290",
                AdoptionFee = 95,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80" },
                Description = "Milo is a plush, sweet-natured British Shorthair with striking amber eyes and a very relaxed personality.",
                Temperament = new List<string> { "Calm", "Gentle", "Affectionate", "Quiet" },
                Featured = true,
                IntakeDate = "2025-01-18",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-3",
                Name = "Rocky",
                Species = "Dog",
                Breed = "German Shepherd",
                Age = "3 years",
                AgeMonths = 36,
                Gender = "Male",
                Size = "Large",
                WeightKg = 34.0,
                Color = "Black & Tan",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141009112044",
                AdoptionFee = 175,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80" },
                Description = "Rocky is a noble and loyal German Shepherd with basic obedience certification and an eagerness to please.",
                Temperament = new List<string> { "Loyal", "Protective", "Trainable", "Energetic" },
                Featured = false,
                IntakeDate = "2025-02-01",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-4",
                Name = "Bella",
                Species = "Dog",
                Breed = "Beagle",
                Age = "1.5 years",
                AgeMonths = 18,
                Gender = "Female",
                Size = "Medium",
                WeightKg = 11.2,
                Color = "Tricolor",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141006543187",
                AdoptionFee = 120,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80" },
                Description = "Bella is an inquisitive Beagle who loves sniffing out adventures and snuggling on the sofa.",
                Temperament = new List<string> { "Curious", "Friendly", "Playful", "Vocal" },
                Featured = true,
                IntakeDate = "2025-02-05",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-5",
                Name = "Oliver",
                Species = "Cat",
                Breed = "Maine Coon Mix",
                Age = "4 years",
                AgeMonths = 48,
                Gender = "Male",
                Size = "Large",
                WeightKg = 7.6,
                Color = "Tabby with White",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141007788990",
                AdoptionFee = 120,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80" },
                Description = "Oliver is a gentle giant with luxurious floof and a sweet chirping meow. He gets along with cats and calm dogs.",
                Temperament = new List<string> { "Gentle", "Fluffy", "Social", "Affectionate" },
                Featured = false,
                IntakeDate = "2025-01-05",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-6",
                Name = "Barnaby",
                Species = "Rabbit",
                Breed = "Holland Lop",
                Age = "8 months",
                AgeMonths = 8,
                Gender = "Male",
                Size = "Small",
                WeightKg = 1.8,
                Color = "Caramel & White",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141006655443",
                AdoptionFee = 50,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80" },
                Description = "Barnaby is an adorable Holland Lop with soft floppy ears. He is litterbox-trained and loves timothy hay treats.",
                Temperament = new List<string> { "Gentle", "Curious", "Quiet", "Litter-trained" },
                Featured = false,
                IntakeDate = "2025-02-05",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-7",
                Name = "Kiwi",
                Species = "Bird",
                Breed = "Cockatiel",
                Age = "1 year",
                AgeMonths = 12,
                Gender = "Female",
                Size = "Small",
                WeightKg = 0.1,
                Color = "Grey & Yellow",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = false,
                MicrochipId = "985141003344556",
                AdoptionFee = 45,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80" },
                Description = "Kiwi is a cheerful hand-tamed Cockatiel who whistles familiar tunes and loves sitting on shoulders.",
                Temperament = new List<string> { "Musical", "Friendly", "Hand-tamed", "Intelligent" },
                Featured = false,
                IntakeDate = "2025-02-08",
                CreatedAt = DateTime.UtcNow
            },
            new Pet
            {
                CustomId = "pet-8",
                Name = "Daisy",
                Species = "Dog",
                Breed = "Labrador Retriever",
                Age = "1 year",
                AgeMonths = 12,
                Gender = "Female",
                Size = "Large",
                WeightKg = 25.0,
                Color = "Yellow",
                Vaccinated = true,
                VaccinationStatus = "Up to date",
                HealthStatus = "Excellent",
                SpayedNeutered = true,
                MicrochipId = "985141001298471",
                AdoptionFee = 160,
                Status = "Available",
                ShelterId = "shelter-1",
                ShelterName = "Happy Paws Rescue",
                ShelterLocation = "Seattle, WA",
                PrimaryImage = "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?w=800&auto=format&fit=crop&q=80",
                GalleryImages = new List<string> { "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?w=800&auto=format&fit=crop&q=80" },
                Description = "Daisy is a bouncy, sweet Labrador puppy at heart who loves water, balls, and snuggling with family.",
                Temperament = new List<string> { "Friendly", "Energetic", "Gentle", "Smart" },
                Featured = true,
                IntakeDate = "2025-02-12",
                CreatedAt = DateTime.UtcNow
            }
        };
    }
}

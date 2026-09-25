using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.DTOs;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public interface IUserService
{
    Task<UserResponseDto> RegisterAsync(RegisterDto dto);
    Task<UserResponseDto> SyncProfileAsync(SyncProfileDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserResponseDto?> GetByEmailAsync(string email);
    Task<UserResponseDto?> GetByIdAsync(string id);
    Task<List<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
    Task<UserResponseDto?> UpdateUserAsync(string id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(string id);
    Task<bool> PingDatabaseAsync();
}

public class UserService : IUserService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoDatabase _database;
    private readonly IVetService _vetService;

    public UserService(IOptions<MongoDbSettings> settings, IVetService vetService)
    {
        _vetService = vetService;
        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        _database = client.GetDatabase(mongoSettings.DatabaseName);
        _usersCollection = _database.GetCollection<User>(mongoSettings.UsersCollectionName);

        // Ensure unique index on email
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        try
        {
            var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Email);
            var indexOptions = new CreateIndexOptions { Unique = true };
            _usersCollection.Indexes.CreateOne(new CreateIndexModel<User>(indexKeys, indexOptions));
        }
        catch
        {
            // Index may already exist
        }
    }

    public async Task<UserResponseDto> RegisterAsync(RegisterDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        var existingUser = await _usersCollection.Find(u => u.Email == normalizedEmail).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Name = dto.Name,
            Email = normalizedEmail,
            PasswordHash = hashedPassword,
            Phone = dto.Phone,
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Adopter" : dto.Role,
            Address = dto.Address,
            City = dto.City,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _usersCollection.InsertOneAsync(user);

        if (string.Equals(user.Role, "Veterinarian", StringComparison.OrdinalIgnoreCase))
        {
            _ = _vetService.EnsureVetProfileForUserAsync(user, dto.ClinicName, dto.Specialization, dto.ConsultationFee, dto.Bio);
        }

        return MapToResponse(user);
    }

    public async Task<UserResponseDto> SyncProfileAsync(SyncProfileDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
        var user = await _usersCollection.Find(u => u.Email == normalizedEmail).FirstOrDefaultAsync();

        if (user == null && !string.IsNullOrEmpty(dto.FirebaseUid))
        {
            user = await _usersCollection.Find(u => u.FirebaseUid == dto.FirebaseUid).FirstOrDefaultAsync();
        }

        if (user == null)
        {
            // Create new profile record
            user = new User
            {
                FirebaseUid = dto.FirebaseUid,
                Email = normalizedEmail,
                Name = dto.Name ?? normalizedEmail.Split('@')[0],
                Phone = dto.Phone,
                Role = !string.IsNullOrWhiteSpace(dto.Role) ? dto.Role : "Adopter",
                Address = dto.Address,
                City = dto.City,
                ProfileImage = dto.ProfileImage ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _usersCollection.InsertOneAsync(user);
        }
        else
        {
            // Update existing user fields if changed - preserve role
            var update = Builders<User>.Update.Set(u => u.UpdatedAt, DateTime.UtcNow);
            if (!string.IsNullOrEmpty(dto.FirebaseUid)) update = update.Set(u => u.FirebaseUid, dto.FirebaseUid);
            if (!string.IsNullOrEmpty(dto.Name)) update = update.Set(u => u.Name, dto.Name);
            if (!string.IsNullOrEmpty(dto.Phone)) update = update.Set(u => u.Phone, dto.Phone);
            if (!string.IsNullOrWhiteSpace(dto.Role) && string.IsNullOrWhiteSpace(user.Role)) update = update.Set(u => u.Role, dto.Role);
            if (!string.IsNullOrEmpty(dto.Address)) update = update.Set(u => u.Address, dto.Address);
            if (!string.IsNullOrEmpty(dto.City)) update = update.Set(u => u.City, dto.City);
            if (!string.IsNullOrEmpty(dto.ProfileImage)) update = update.Set(u => u.ProfileImage, dto.ProfileImage);

            await _usersCollection.UpdateOneAsync(u => u.Id == user.Id, update);
            user = await _usersCollection.Find(u => u.Id == user.Id).FirstOrDefaultAsync();
        }

        if (user != null && string.Equals(user.Role, "Veterinarian", StringComparison.OrdinalIgnoreCase))
        {
            _ = _vetService.EnsureVetProfileForUserAsync(user, dto.ClinicName, dto.Specialization, dto.ConsultationFee, dto.Bio);
        }

        return MapToResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
        var user = await _usersCollection.Find(u => u.Email == normalizedEmail).FirstOrDefaultAsync();

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var token = "jwt_token_" + Guid.NewGuid().ToString("N");
        return new AuthResponseDto
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            User = MapToResponse(user)
        };
    }

    public async Task<UserResponseDto?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await _usersCollection.Find(u => u.Email == normalizedEmail).FirstOrDefaultAsync();
        return user == null ? null : MapToResponse(user);
    }

    public async Task<UserResponseDto?> GetByIdAsync(string id)
    {
        var user = await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        return user == null ? null : MapToResponse(user);
    }

    public async Task<List<UserResponseDto>> GetAllAsync()
    {
        var users = await _usersCollection.Find(_ => true).ToListAsync();
        return users.Select(MapToResponse).ToList();
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
        var existing = await _usersCollection.Find(u => u.Email == normalizedEmail).FirstOrDefaultAsync();
        if (existing != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        var password = string.IsNullOrWhiteSpace(dto.Password) ? "Secret123!" : dto.Password;
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Name = dto.Name,
            Email = normalizedEmail,
            PasswordHash = hashedPassword,
            Phone = dto.Phone,
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Adopter" : dto.Role,
            Address = dto.Address,
            City = dto.City,
            ProfileImage = dto.ProfileImage ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _usersCollection.InsertOneAsync(user);
        return MapToResponse(user);
    }

    public async Task<UserResponseDto?> UpdateUserAsync(string id, UpdateUserDto dto)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var existing = await _usersCollection.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return null;

        var update = Builders<User>.Update.Set(u => u.UpdatedAt, DateTime.UtcNow);
        if (!string.IsNullOrWhiteSpace(dto.Name)) update = update.Set(u => u.Name, dto.Name);
        if (!string.IsNullOrWhiteSpace(dto.Email)) update = update.Set(u => u.Email, dto.Email.Trim().ToLowerInvariant());
        if (!string.IsNullOrWhiteSpace(dto.Phone)) update = update.Set(u => u.Phone, dto.Phone);
        if (!string.IsNullOrWhiteSpace(dto.Role)) update = update.Set(u => u.Role, dto.Role);
        if (!string.IsNullOrWhiteSpace(dto.Address)) update = update.Set(u => u.Address, dto.Address);
        if (!string.IsNullOrWhiteSpace(dto.City)) update = update.Set(u => u.City, dto.City);
        if (!string.IsNullOrWhiteSpace(dto.ProfileImage)) update = update.Set(u => u.ProfileImage, dto.ProfileImage);

        await _usersCollection.UpdateOneAsync(filter, update);
        var updated = await _usersCollection.Find(filter).FirstOrDefaultAsync();
        return updated == null ? null : MapToResponse(updated);
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var result = await _usersCollection.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    public async Task<bool> PingDatabaseAsync()
    {
        try
        {
            await _database.RunCommandAsync<MongoDB.Bson.BsonDocument>(new MongoDB.Bson.BsonDocument("ping", 1));
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static UserResponseDto MapToResponse(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id ?? string.Empty,
            FirebaseUid = user.FirebaseUid,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role,
            Address = user.Address,
            City = user.City,
            ProfileImage = user.ProfileImage,
            IsEmailVerified = user.IsEmailVerified,
            FavoritePetIds = user.FavoritePetIds ?? new List<string>(),
            CreatedAt = user.CreatedAt
        };
    }
}

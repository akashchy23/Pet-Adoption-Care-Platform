using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PetHaven.Api.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("firebaseUid")]
    public string? FirebaseUid { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("passwordHash")]
    public string? PasswordHash { get; set; }

    [BsonElement("phone")]
    public string? Phone { get; set; }

    [BsonElement("role")]
    public string Role { get; set; } = "Adopter";

    [BsonElement("address")]
    public string? Address { get; set; }

    [BsonElement("city")]
    public string? City { get; set; }

    [BsonElement("profileImage")]
    public string? ProfileImage { get; set; }

    [BsonElement("isEmailVerified")]
    public bool IsEmailVerified { get; set; } = false;

    [BsonElement("favoritePetIds")]
    public List<string> FavoritePetIds { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

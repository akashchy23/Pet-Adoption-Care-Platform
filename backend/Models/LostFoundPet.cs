using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace PetHaven.Api.Models;

[BsonIgnoreExtraElements]
public class LostFoundPet
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("customId")]
    [JsonPropertyName("customId")]
    public string? CustomId { get; set; }

    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "Lost"; // "Lost" or "Found"

    [BsonElement("petName")]
    [JsonPropertyName("petName")]
    public string PetName { get; set; } = string.Empty;

    [BsonElement("species")]
    [JsonPropertyName("species")]
    public string Species { get; set; } = "Dog";

    [BsonElement("breed")]
    [JsonPropertyName("breed")]
    public string Breed { get; set; } = string.Empty;

    [BsonElement("gender")]
    [JsonPropertyName("gender")]
    public string Gender { get; set; } = "Male";

    [BsonElement("color")]
    [JsonPropertyName("color")]
    public string Color { get; set; } = string.Empty;

    [BsonElement("lastSeenLocation")]
    [JsonPropertyName("lastSeenLocation")]
    public string LastSeenLocation { get; set; } = string.Empty;

    [BsonElement("lastSeenDate")]
    [JsonPropertyName("lastSeenDate")]
    public string LastSeenDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

    [BsonElement("reward")]
    [JsonPropertyName("reward")]
    public string? Reward { get; set; }

    [BsonElement("contactName")]
    [JsonPropertyName("contactName")]
    public string ContactName { get; set; } = string.Empty;

    [BsonElement("contactPhone")]
    [JsonPropertyName("contactPhone")]
    public string ContactPhone { get; set; } = string.Empty;

    [BsonElement("contactEmail")]
    [JsonPropertyName("contactEmail")]
    public string? ContactEmail { get; set; }

    [BsonElement("userId")]
    [JsonPropertyName("userId")]
    public string? UserId { get; set; }

    [BsonElement("userEmail")]
    [JsonPropertyName("userEmail")]
    public string? UserEmail { get; set; }

    [BsonElement("image")]
    [JsonPropertyName("image")]
    public string Image { get; set; } = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80";

    [BsonElement("description")]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("status")]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "Active"; // "Active", "Reunited", "Resolved"

    [BsonElement("createdAt")]
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

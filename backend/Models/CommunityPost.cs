using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace PetHaven.Api.Models;

[BsonIgnoreExtraElements]
public class CommunityComment
{
    [BsonElement("id")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [BsonElement("userId")]
    [JsonPropertyName("userId")]
    public string? UserId { get; set; }

    [BsonElement("userName")]
    [JsonPropertyName("userName")]
    public string UserName { get; set; } = "Community Member";

    [BsonElement("userAvatar")]
    [JsonPropertyName("userAvatar")]
    public string? UserAvatar { get; set; }

    [BsonElement("userRole")]
    [JsonPropertyName("userRole")]
    public string UserRole { get; set; } = "Adopter";

    [BsonElement("text")]
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    [BsonElement("createdAt")]
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class CommunityPost
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("userId")]
    [JsonPropertyName("userId")]
    public string? UserId { get; set; }

    [BsonElement("userEmail")]
    [JsonPropertyName("userEmail")]
    public string? UserEmail { get; set; }

    [BsonElement("userName")]
    [JsonPropertyName("userName")]
    public string UserName { get; set; } = "Community Member";

    [BsonElement("userAvatar")]
    [JsonPropertyName("userAvatar")]
    public string? UserAvatar { get; set; }

    [BsonElement("userRole")]
    [JsonPropertyName("userRole")]
    public string UserRole { get; set; } = "Adopter";

    [BsonElement("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("comment")]
    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;

    [BsonElement("category")]
    [JsonPropertyName("category")]
    public string Category { get; set; } = "General";

    [BsonElement("imageUrl")]
    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }

    [BsonElement("targetType")]
    [JsonPropertyName("targetType")]
    public string TargetType { get; set; } = "General";

    [BsonElement("targetId")]
    [JsonPropertyName("targetId")]
    public string? TargetId { get; set; }

    [BsonElement("rating")]
    [JsonPropertyName("rating")]
    public int Rating { get; set; } = 5;

    [BsonElement("likesCount")]
    [JsonPropertyName("likesCount")]
    public int LikesCount { get; set; } = 0;

    [BsonElement("likedUserIds")]
    [JsonPropertyName("likedUserIds")]
    public List<string> LikedUserIds { get; set; } = new();

    [BsonElement("comments")]
    [JsonPropertyName("comments")]
    public List<CommunityComment> Comments { get; set; } = new();

    [BsonElement("createdAt")]
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Helper client-side property indicating if caller liked the post
    [BsonIgnore]
    [JsonPropertyName("isLikedByCurrentUser")]
    public bool IsLikedByCurrentUser { get; set; } = false;
}

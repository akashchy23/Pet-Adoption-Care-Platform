using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PetHaven.Api.Models;

public class Veterinarian
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("customId")]
    public string? CustomId { get; set; }

    [BsonElement("userId")]
    public string? UserId { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("clinicName")]
    public string ClinicName { get; set; } = string.Empty;

    [BsonElement("specialization")]
    public string Specialization { get; set; } = "Small Animal Wellness & Surgery";

    [BsonElement("experienceYears")]
    public int ExperienceYears { get; set; } = 5;

    [BsonElement("rating")]
    public double Rating { get; set; } = 4.9;

    [BsonElement("reviewCount")]
    public int ReviewCount { get; set; } = 12;

    [BsonElement("consultationFee")]
    public decimal ConsultationFee { get; set; } = 75;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("avatar")]
    public string Avatar { get; set; } = string.Empty;

    [BsonElement("bio")]
    public string Bio { get; set; } = string.Empty;

    [BsonElement("availableDays")]
    public List<string> AvailableDays { get; set; } = new() { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" };

    [BsonElement("timeSlots")]
    public List<string> TimeSlots { get; set; } = new() { "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM" };

    [BsonElement("isSelfRegistered")]
    public bool IsSelfRegistered { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

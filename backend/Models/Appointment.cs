using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PetHaven.Api.Models;

public class Appointment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("customId")]
    public string? CustomId { get; set; }

    [BsonElement("vetId")]
    public string VetId { get; set; } = string.Empty;

    [BsonElement("vetName")]
    public string VetName { get; set; } = string.Empty;

    [BsonElement("vetEmail")]
    public string VetEmail { get; set; } = string.Empty;

    [BsonElement("clinicName")]
    public string ClinicName { get; set; } = string.Empty;

    [BsonElement("ownerId")]
    public string OwnerId { get; set; } = string.Empty;

    [BsonElement("ownerName")]
    public string OwnerName { get; set; } = string.Empty;

    [BsonElement("ownerEmail")]
    public string OwnerEmail { get; set; } = string.Empty;

    [BsonElement("petId")]
    public string? PetId { get; set; }

    [BsonElement("petName")]
    public string PetName { get; set; } = string.Empty;

    [BsonElement("petSpecies")]
    public string PetSpecies { get; set; } = "Dog";

    [BsonElement("date")]
    public string Date { get; set; } = string.Empty;

    [BsonElement("time")]
    public string Time { get; set; } = string.Empty;

    [BsonElement("reason")]
    public string Reason { get; set; } = string.Empty;

    [BsonElement("notes")]
    public string? Notes { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "Confirmed";

    [BsonElement("fee")]
    public decimal Fee { get; set; } = 75;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

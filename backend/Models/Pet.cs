using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PetHaven.Api.Models;

public class Pet
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("customId")]
    public string? CustomId { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("species")]
    public string Species { get; set; } = "Dog";

    [BsonElement("breed")]
    public string Breed { get; set; } = string.Empty;

    [BsonElement("age")]
    public string Age { get; set; } = "1 year";

    [BsonElement("ageMonths")]
    public int AgeMonths { get; set; } = 12;

    [BsonElement("gender")]
    public string Gender { get; set; } = "Female";

    [BsonElement("size")]
    public string Size { get; set; } = "Medium";

    [BsonElement("weightKg")]
    public double WeightKg { get; set; } = 15.0;

    [BsonElement("color")]
    public string? Color { get; set; }

    [BsonElement("vaccinated")]
    public bool Vaccinated { get; set; } = true;

    [BsonElement("vaccinationStatus")]
    public string VaccinationStatus { get; set; } = "Up to date";

    [BsonElement("healthStatus")]
    public string HealthStatus { get; set; } = "Good";

    [BsonElement("spayedNeutered")]
    public bool SpayedNeutered { get; set; } = true;

    [BsonElement("microchipId")]
    public string? MicrochipId { get; set; }

    [BsonElement("adoptionFee")]
    public decimal AdoptionFee { get; set; } = 100;

    [BsonElement("status")]
    public string Status { get; set; } = "Available"; // Available, Pending, Adopted, Registered

    [BsonElement("shelterId")]
    public string? ShelterId { get; set; }

    [BsonElement("shelterName")]
    public string? ShelterName { get; set; }

    [BsonElement("shelterLocation")]
    public string? ShelterLocation { get; set; }

    [BsonElement("ownerId")]
    public string? OwnerId { get; set; }

    [BsonElement("ownerEmail")]
    public string? OwnerEmail { get; set; }

    [BsonElement("ownerName")]
    public string? OwnerName { get; set; }

    [BsonElement("primaryImage")]
    public string PrimaryImage { get; set; } = string.Empty;

    [BsonElement("galleryImages")]
    public List<string> GalleryImages { get; set; } = new();

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("temperament")]
    public List<string> Temperament { get; set; } = new();

    [BsonElement("featured")]
    public bool Featured { get; set; } = false;

    [BsonElement("intakeDate")]
    public string? IntakeDate { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

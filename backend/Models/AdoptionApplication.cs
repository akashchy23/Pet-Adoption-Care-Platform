using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace PetHaven.Api.Models;

[BsonIgnoreExtraElements]
public class AdoptionApplication
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("customId")]
    public string? CustomId { get; set; }

    [BsonElement("petId")]
    public string PetId { get; set; } = string.Empty;

    [BsonElement("petName")]
    public string PetName { get; set; } = string.Empty;

    [BsonElement("petBreed")]
    public string PetBreed { get; set; } = string.Empty;

    [BsonElement("petImage")]
    public string PetImage { get; set; } = string.Empty;

    [BsonElement("ownerId")]
    public string? OwnerId { get; set; }

    [BsonElement("ownerEmail")]
    public string? OwnerEmail { get; set; }

    [BsonElement("ownerName")]
    public string? OwnerName { get; set; }

    [BsonElement("applicantId")]
    public string ApplicantId { get; set; } = string.Empty;

    [BsonElement("applicantName")]
    public string ApplicantName { get; set; } = string.Empty;

    [BsonElement("applicantEmail")]
    public string ApplicantEmail { get; set; } = string.Empty;

    [BsonElement("applicantPhone")]
    public string ApplicantPhone { get; set; } = string.Empty;

    [BsonElement("homeType")]
    public string HomeType { get; set; } = "House";

    [BsonElement("ownership")]
    public string Ownership { get; set; } = "Own";

    [BsonElement("familyMembers")]
    [JsonIgnore]
    public BsonValue? RawFamilyMembers { get; set; } = new BsonString("2");

    [BsonIgnore]
    [JsonPropertyName("familyMembers")]
    public string FamilyMembers
    {
        get => RawFamilyMembers?.ToString() ?? "2";
        set => RawFamilyMembers = new BsonString(value ?? "2");
    }

    [BsonElement("hasChildren")]
    [JsonIgnore]
    public BsonValue? RawHasChildren { get; set; } = new BsonString("No");

    [BsonIgnore]
    [JsonPropertyName("hasChildren")]
    public string HasChildren
    {
        get => RawHasChildren != null && RawHasChildren.IsBoolean ? (RawHasChildren.AsBoolean ? "Yes" : "No") : (RawHasChildren?.ToString() ?? "No");
        set => RawHasChildren = new BsonString(value ?? "No");
    }

    [BsonElement("hasOtherPets")]
    [JsonIgnore]
    public BsonValue? RawHasOtherPets { get; set; } = new BsonString("No");

    [BsonIgnore]
    [JsonPropertyName("hasOtherPets")]
    public string HasOtherPets
    {
        get => RawHasOtherPets != null && RawHasOtherPets.IsBoolean ? (RawHasOtherPets.AsBoolean ? "Yes" : "No") : (RawHasOtherPets?.ToString() ?? "No");
        set => RawHasOtherPets = new BsonString(value ?? "No");
    }

    [BsonElement("petExperience")]
    public string PetExperience { get; set; } = string.Empty;

    [BsonElement("monthlyBudget")]
    public string MonthlyBudget { get; set; } = "$200 - $300";

    [BsonElement("adoptionReason")]
    public string AdoptionReason { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Pending";

    [BsonElement("submittedDate")]
    public string SubmittedDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

    [BsonElement("shelterNotes")]
    public string? ShelterNotes { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

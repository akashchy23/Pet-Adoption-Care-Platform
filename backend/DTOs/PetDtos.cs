namespace PetHaven.Api.DTOs;

public class PetResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string? CustomId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = "Dog";
    public string Breed { get; set; } = string.Empty;
    public string Age { get; set; } = "1 year";
    public int AgeMonths { get; set; } = 12;
    public string Gender { get; set; } = "Female";
    public string Size { get; set; } = "Medium";
    public double WeightKg { get; set; } = 15.0;
    public string? Color { get; set; }
    public bool Vaccinated { get; set; } = true;
    public string VaccinationStatus { get; set; } = "Up to date";
    public string HealthStatus { get; set; } = "Good";
    public bool SpayedNeutered { get; set; } = true;
    public string? MicrochipId { get; set; }
    public decimal AdoptionFee { get; set; } = 100;
    public string Status { get; set; } = "Available";
    public string? ShelterId { get; set; }
    public string? ShelterName { get; set; }
    public string? ShelterLocation { get; set; }
    public string? OwnerId { get; set; }
    public string? OwnerEmail { get; set; }
    public string? OwnerName { get; set; }
    public string PrimaryImage { get; set; } = string.Empty;
    public List<string> GalleryImages { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public List<string> Temperament { get; set; } = new();
    public bool Featured { get; set; } = false;
    public string? IntakeDate { get; set; }
    public bool IsFavorite { get; set; } = false;
    public DateTime CreatedAt { get; set; }
}

public class CreatePetDto
{
    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = "Dog";
    public string Breed { get; set; } = string.Empty;
    public string? Age { get; set; }
    public int? AgeMonths { get; set; }
    public string? Gender { get; set; }
    public string? Size { get; set; }
    public double? WeightKg { get; set; }
    public string? Color { get; set; }
    public bool? Vaccinated { get; set; }
    public string? VaccinationStatus { get; set; }
    public string? HealthStatus { get; set; }
    public bool? SpayedNeutered { get; set; }
    public string? MicrochipId { get; set; }
    public decimal? AdoptionFee { get; set; }
    public string? Status { get; set; }
    public string? ShelterId { get; set; }
    public string? ShelterName { get; set; }
    public string? ShelterLocation { get; set; }
    public string? OwnerId { get; set; }
    public string? OwnerEmail { get; set; }
    public string? OwnerName { get; set; }
    public string? PrimaryImage { get; set; }
    public List<string>? GalleryImages { get; set; }
    public string? Description { get; set; }
    public List<string>? Temperament { get; set; }
    public bool? Featured { get; set; }
}

public class UpdatePetDto : CreatePetDto
{
}

public class PetListQueryParams
{
    public string? Search { get; set; }
    public string? Species { get; set; }
    public string? Size { get; set; }
    public string? Gender { get; set; }
    public string? Status { get; set; }
    public bool? Vaccinated { get; set; }
    public string? SortBy { get; set; }
    public string? OwnerEmail { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}

public class PetListResponseDto
{
    public List<PetResponseDto> Pets { get; set; } = new();
    public long Total { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
}

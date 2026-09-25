using System.ComponentModel.DataAnnotations;

namespace PetHaven.Api.DTOs;

public class SyncProfileDto
{
    public string? FirebaseUid { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Role { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? ProfileImage { get; set; }

    public string? ClinicName { get; set; }

    public string? Specialization { get; set; }

    public decimal? ConsultationFee { get; set; }

    public string? Bio { get; set; }
}

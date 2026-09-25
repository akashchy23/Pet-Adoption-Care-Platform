using System.ComponentModel.DataAnnotations;

namespace PetHaven.Api.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Role { get; set; } = "Adopter";

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? ClinicName { get; set; }

    public string? Specialization { get; set; }

    public decimal? ConsultationFee { get; set; }

    public string? Bio { get; set; }
}

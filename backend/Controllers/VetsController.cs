using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.Models;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

public class VetDto
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ClinicName { get; set; } = string.Empty;
    public string Specialization { get; set; } = "Small Animal Wellness & Surgery";
    public int ExperienceYears { get; set; } = 5;
    public double Rating { get; set; } = 4.9;
    public int ReviewCount { get; set; } = 12;
    public decimal ConsultationFee { get; set; } = 75;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public List<string> AvailableDays { get; set; } = new() { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" };
    public List<string> TimeSlots { get; set; } = new() { "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM" };
}

[ApiController]
[Route("api/[controller]")]
public class VetsController : ControllerBase
{
    private readonly IVetService _vetService;
    private readonly ILogger<VetsController> _logger;

    public VetsController(IVetService vetService, ILogger<VetsController> logger)
    {
        _vetService = vetService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetVets([FromQuery] string? search, [FromQuery] string? specialization)
    {
        try
        {
            var vets = await _vetService.GetAllVetsAsync(search, specialization);
            return Ok(vets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get veterinarians");
            return StatusCode(500, new { message = "Error loading veterinarians from database", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVetById(string id)
    {
        try
        {
            var vet = await _vetService.GetVetByIdAsync(id);
            if (vet == null) return NotFound(new { message = "Veterinarian not found" });
            return Ok(vet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get veterinarian {Id}", id);
            return StatusCode(500, new { message = "Error retrieving veterinarian", detail = ex.Message });
        }
    }

    /// <summary>
    /// Self-registration of a veterinarian profile
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> RegisterVetProfile([FromBody] VetDto dto, [FromHeader(Name = "X-User-Role")] string? userRole)
    {
        // Admin cannot add a veterinarian directly; only veterinarians can self-register
        if (!string.IsNullOrEmpty(userRole) && (userRole.Equals("Administrator", StringComparison.OrdinalIgnoreCase) || userRole.Equals("Admin", StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new
            {
                success = false,
                message = "Administrators cannot add veterinarians. Veterinarians must self-register their own profiles."
            });
        }

        try
        {
            var vet = new Veterinarian
            {
                Name = dto.Name,
                Email = dto.Email,
                ClinicName = dto.ClinicName,
                Specialization = string.IsNullOrWhiteSpace(dto.Specialization) ? "Small Animal Wellness & Surgery" : dto.Specialization,
                ExperienceYears = dto.ExperienceYears > 0 ? dto.ExperienceYears : 5,
                Rating = dto.Rating > 0 ? dto.Rating : 5.0,
                ReviewCount = dto.ReviewCount > 0 ? dto.ReviewCount : 1,
                ConsultationFee = dto.ConsultationFee > 0 ? dto.ConsultationFee : 75,
                Address = dto.Address,
                Phone = dto.Phone,
                Avatar = string.IsNullOrWhiteSpace(dto.Avatar) ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80" : dto.Avatar,
                Bio = dto.Bio,
                AvailableDays = dto.AvailableDays?.Count > 0 ? dto.AvailableDays : new List<string> { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" },
                TimeSlots = dto.TimeSlots?.Count > 0 ? dto.TimeSlots : new List<string> { "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM" }
            };

            var created = await _vetService.RegisterVetAsync(vet);
            return CreatedAtAction(nameof(GetVetById), new { id = created.Id ?? created.CustomId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to register veterinarian profile");
            return StatusCode(500, new { message = "Error registering veterinarian", detail = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVet(string id, [FromBody] VetDto dto)
    {
        try
        {
            var vet = new Veterinarian
            {
                Name = dto.Name,
                ClinicName = dto.ClinicName,
                Specialization = dto.Specialization,
                ExperienceYears = dto.ExperienceYears,
                ConsultationFee = dto.ConsultationFee,
                Address = dto.Address,
                Phone = dto.Phone,
                Avatar = dto.Avatar,
                Bio = dto.Bio
            };

            var updated = await _vetService.UpdateVetAsync(id, vet);
            if (updated == null) return NotFound(new { message = "Veterinarian not found" });
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update veterinarian {Id}", id);
            return StatusCode(500, new { message = "Error updating veterinarian", detail = ex.Message });
        }
    }

    /// <summary>
    /// Admin remove veterinarian from database directory
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVet(string id)
    {
        try
        {
            var removed = await _vetService.DeleteVetAsync(id);
            if (removed)
            {
                return Ok(new { success = true, message = "Veterinarian removed successfully from database" });
            }
            return NotFound(new { success = false, message = "Veterinarian not found or already removed" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete veterinarian {Id}", id);
            return StatusCode(500, new { success = false, message = "Error removing veterinarian", detail = ex.Message });
        }
    }
}

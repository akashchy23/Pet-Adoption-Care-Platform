using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.Models;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

public class AdoptionApplicationDto
{
    public string? Id { get; set; }
    public string PetId { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetBreed { get; set; } = string.Empty;
    public string PetImage { get; set; } = string.Empty;
    public string? OwnerId { get; set; }
    public string? OwnerEmail { get; set; }
    public string? OwnerName { get; set; }
    public string ApplicantId { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string HomeType { get; set; } = "House";
    public string Ownership { get; set; } = "Own";
    public string FamilyMembers { get; set; } = "2";
    public string HasChildren { get; set; } = "No";
    public string HasOtherPets { get; set; } = "No";
    public string PetExperience { get; set; } = string.Empty;
    public string MonthlyBudget { get; set; } = "$200 - $300";
    public string AdoptionReason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public string SubmittedDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    public string? ShelterNotes { get; set; }
}

public class UpdateApplicationStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? ShelterNotes { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AdoptionsController : ControllerBase
{
    private readonly IAdoptionService _adoptionService;
    private readonly ILogger<AdoptionsController> _logger;

    public AdoptionsController(IAdoptionService adoptionService, ILogger<AdoptionsController> logger)
    {
        _adoptionService = adoptionService;
        _logger = logger;
    }

    /// <summary>
    /// Admin & Shelter: Retrieve all adoption requests from database
    /// </summary>
    [HttpGet]
    [HttpGet("shelter")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllApplications([FromQuery] string? status, [FromQuery] string? petId)
    {
        try
        {
            var apps = await _adoptionService.GetAllApplicationsAsync(status, petId);
            return Ok(apps);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve adoption applications");
            return StatusCode(500, new { message = "Error loading adoption applications from database", detail = ex.Message });
        }
    }

    /// <summary>
    /// Pet Owner: Retrieve confirmed adoption requests for their registered pets from database
    /// </summary>
    [HttpGet("owner")]
    public async Task<IActionResult> GetOwnerApplications(
        [FromQuery] string? ownerEmail,
        [FromQuery] string? ownerId,
        [FromQuery] bool confirmedOnly = true,
        [FromHeader(Name = "X-User-Email")] string? headerEmail = null,
        [FromHeader(Name = "X-User-Id")] string? headerId = null)
    {
        try
        {
            var email = !string.IsNullOrWhiteSpace(ownerEmail) ? ownerEmail : headerEmail;
            var id = !string.IsNullOrWhiteSpace(ownerId) ? ownerId : headerId;

            var apps = await _adoptionService.GetApplicationsForOwnerAsync(email, id, confirmedOnly);
            return Ok(apps);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve owner applications");
            return StatusCode(500, new { message = "Error loading owner applications", detail = ex.Message });
        }
    }

    /// <summary>
    /// Adopter: Retrieve my submitted adoption applications
    /// </summary>
    [HttpGet("my-applications")]
    public async Task<IActionResult> GetMyApplications(
        [FromHeader(Name = "X-User-Email")] string? userEmail,
        [FromHeader(Name = "X-User-Id")] string? userId,
        [FromQuery] string? applicantEmail,
        [FromQuery] string? applicantId)
    {
        try
        {
            var email = !string.IsNullOrWhiteSpace(applicantEmail) ? applicantEmail : userEmail;
            var id = !string.IsNullOrWhiteSpace(applicantId) ? applicantId : userId;

            var apps = await _adoptionService.GetApplicationsForApplicantAsync(email, id);
            if (!apps.Any() && string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(id))
            {
                apps = await _adoptionService.GetAllApplicationsAsync();
            }
            return Ok(apps);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve applicant applications");
            return StatusCode(500, new { message = "Error loading your applications", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetApplicationById(string id)
    {
        try
        {
            var app = await _adoptionService.GetByIdAsync(id);
            if (app == null) return NotFound(new { message = "Adoption application not found" });
            return Ok(app);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve adoption application {Id}", id);
            return StatusCode(500, new { message = "Error loading application details", detail = ex.Message });
        }
    }

    /// <summary>
    /// Adopter apply for pet adoption - saves directly into database
    /// </summary>
    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromBody] AdoptionApplicationDto dto)
    {
        try
        {
            var app = new AdoptionApplication
            {
                PetId = dto.PetId,
                PetName = dto.PetName,
                PetBreed = dto.PetBreed,
                PetImage = dto.PetImage,
                OwnerId = dto.OwnerId,
                OwnerEmail = dto.OwnerEmail,
                OwnerName = dto.OwnerName,
                ApplicantId = dto.ApplicantId,
                ApplicantName = dto.ApplicantName,
                ApplicantEmail = dto.ApplicantEmail,
                ApplicantPhone = dto.ApplicantPhone,
                HomeType = dto.HomeType,
                Ownership = dto.Ownership,
                FamilyMembers = dto.FamilyMembers,
                HasChildren = dto.HasChildren,
                HasOtherPets = dto.HasOtherPets,
                PetExperience = dto.PetExperience,
                MonthlyBudget = dto.MonthlyBudget,
                AdoptionReason = dto.AdoptionReason,
                Status = "Pending",
                SubmittedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                ShelterNotes = dto.ShelterNotes ?? "Application submitted and waiting for administrator review."
            };

            var created = await _adoptionService.SubmitApplicationAsync(app);
            return CreatedAtAction(nameof(GetApplicationById), new { id = created.Id ?? created.CustomId }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to submit adoption application");
            return StatusCode(500, new { message = "Error submitting adoption application", detail = ex.Message });
        }
    }

    /// <summary>
    /// Admin Confirm or Cancel adoption application status in database
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateApplicationStatusDto dto)
    {
        try
        {
            var updated = await _adoptionService.UpdateStatusAsync(id, dto.Status, dto.ShelterNotes);
            if (updated != null)
            {
                return Ok(updated);
            }
            return NotFound(new { message = "Application not found in database" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update adoption status for {Id}", id);
            return StatusCode(500, new { message = "Error updating adoption application status", detail = ex.Message });
        }
    }
}

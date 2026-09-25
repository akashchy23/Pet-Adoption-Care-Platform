using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.Models;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

[ApiController]
[Route("api/lost-found")]
[Route("api/[controller]")]
public class LostFoundController : ControllerBase
{
    private readonly ILostFoundService _service;
    private readonly ILogger<LostFoundController> _logger;

    public LostFoundController(ILostFoundService service, ILogger<LostFoundController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Retrieve list of lost and found pet reports from MongoDB database
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetReports([FromQuery] string? type, [FromQuery] string? search)
    {
        try
        {
            var reports = await _service.GetReportsAsync(type, search);
            return Ok(reports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve lost/found pet reports");
            return StatusCode(500, new { message = "Error loading lost/found reports from database", detail = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve single lost/found report details by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReportById(string id)
    {
        try
        {
            var report = await _service.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound(new { message = "Pet report not found in database" });
            }
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve lost/found report {Id}", id);
            return StatusCode(500, new { message = "Error retrieving pet report", detail = ex.Message });
        }
    }

    /// <summary>
    /// Submit a new lost or found pet report to MongoDB
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateReport(
        [FromBody] LostFoundPet request,
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.PetName))
            {
                request.PetName = request.Type == "Lost" ? "Missing Pet" : "Found Pet";
            }

            if (string.IsNullOrWhiteSpace(request.UserId) && !string.IsNullOrWhiteSpace(headerUserId))
            {
                request.UserId = headerUserId;
            }

            if (string.IsNullOrWhiteSpace(request.UserEmail) && !string.IsNullOrWhiteSpace(headerUserEmail))
            {
                request.UserEmail = headerUserEmail;
            }

            var created = await _service.CreateReportAsync(request);
            return Ok(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to submit lost/found report");
            return StatusCode(500, new { message = "Error saving pet report to database", detail = ex.Message });
        }
    }

    /// <summary>
    /// Delete lost or found pet report from MongoDB database
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReport(string id)
    {
        try
        {
            var success = await _service.DeleteReportAsync(id);
            if (!success)
            {
                return NotFound(new { success = false, message = "Report not found or already deleted from database" });
            }
            return Ok(new { success = true, message = "Lost/Found pet report deleted successfully from database" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete lost/found report {Id}", id);
            return StatusCode(500, new { success = false, message = "Error deleting pet report", detail = ex.Message });
        }
    }

    /// <summary>
    /// Update pet status (e.g. Reunited / Resolved)
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateLostFoundStatusDto dto)
    {
        try
        {
            var updated = await _service.UpdateStatusAsync(id, dto.Status);
            if (updated == null)
            {
                return NotFound(new { message = "Pet report not found" });
            }
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update report status {Id}", id);
            return StatusCode(500, new { message = "Error updating status", detail = ex.Message });
        }
    }
}

public class UpdateLostFoundStatusDto
{
    public string Status { get; set; } = "Reunited";
}

using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.Models;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

public class AppointmentDto
{
    public string? Id { get; set; }
    public string VetId { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
    public string VetEmail { get; set; } = string.Empty;
    public string ClinicName { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string OwnerEmail { get; set; } = string.Empty;
    public string? PetId { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = "Dog";
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string Status { get; set; } = "Confirmed";
    public decimal Fee { get; set; } = 75;
}

public class RescheduleDto
{
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
}

public class UpdateStatusDto
{
    public string Status { get; set; } = "Completed";
}

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(IAppointmentService appointmentService, ILogger<AppointmentsController> logger)
    {
        _appointmentService = appointmentService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieve consults/appointments filtered by Doctor Email, Doctor Name, Vet ID, Owner ID, or Status
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAppointments(
        [FromQuery] string? vetId,
        [FromQuery] string? vetName,
        [FromQuery] string? vetEmail,
        [FromQuery] string? ownerId,
        [FromQuery] string? status)
    {
        try
        {
            var appointments = await _appointmentService.GetAppointmentsAsync(
                vetId: vetId,
                vetName: vetName,
                vetEmail: vetEmail,
                ownerId: ownerId,
                status: status
            );
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load appointments from database");
            return StatusCode(500, new { message = "Error loading appointments from database", detail = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var apt = await _appointmentService.GetByIdAsync(id);
            if (apt == null) return NotFound(new { message = "Appointment not found" });
            return Ok(apt);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve appointment {Id}", id);
            return StatusCode(500, new { message = "Error retrieving appointment", detail = ex.Message });
        }
    }

    /// <summary>
    /// Book a consult for a veterinarian from an adopter
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> BookAppointment([FromBody] AppointmentDto dto)
    {
        try
        {
            var appointment = new Appointment
            {
                VetId = dto.VetId,
                VetName = dto.VetName,
                VetEmail = dto.VetEmail,
                ClinicName = dto.ClinicName,
                OwnerId = dto.OwnerId,
                OwnerName = dto.OwnerName,
                OwnerEmail = dto.OwnerEmail,
                PetId = dto.PetId,
                PetName = dto.PetName,
                PetSpecies = string.IsNullOrWhiteSpace(dto.PetSpecies) ? "Dog" : dto.PetSpecies,
                Date = dto.Date,
                Time = dto.Time,
                Reason = dto.Reason,
                Notes = dto.Notes,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Confirmed" : dto.Status,
                Fee = dto.Fee > 0 ? dto.Fee : 75
            };

            var created = await _appointmentService.BookAppointmentAsync(appointment);
            return Ok(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to book appointment");
            return StatusCode(500, new { message = "Error booking appointment in database", detail = ex.Message });
        }
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> CancelAppointment(string id)
    {
        try
        {
            var updated = await _appointmentService.CancelAppointmentAsync(id);
            if (updated != null) return Ok(updated);
            return Ok(new { id, status = "Cancelled" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to cancel appointment {Id}", id);
            return StatusCode(500, new { message = "Error cancelling appointment", detail = ex.Message });
        }
    }

    [HttpPatch("{id}/reschedule")]
    public async Task<IActionResult> RescheduleAppointment(string id, [FromBody] RescheduleDto dto)
    {
        try
        {
            var updated = await _appointmentService.RescheduleAppointmentAsync(id, dto.Date, dto.Time);
            if (updated != null) return Ok(updated);
            return Ok(new { id, date = dto.Date, time = dto.Time, status = "Confirmed" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reschedule appointment {Id}", id);
            return StatusCode(500, new { message = "Error rescheduling appointment", detail = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
    {
        try
        {
            var updated = await _appointmentService.UpdateStatusAsync(id, dto.Status);
            if (updated != null) return Ok(updated);
            return Ok(new { id, status = dto.Status });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update appointment status {Id}", id);
            return StatusCode(500, new { message = "Error updating appointment status", detail = ex.Message });
        }
    }
}

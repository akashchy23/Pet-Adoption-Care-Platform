using Microsoft.AspNetCore.Mvc;

namespace PetHaven.Api.Controllers;

public class VaccinationRecordDto
{
    public string Id { get; set; } = string.Empty;
    public string PetId { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string VaccineName { get; set; } = string.Empty;
    public string GivenDate { get; set; } = string.Empty;
    public string DueDate { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public string Clinic { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed";
    public string ReminderNotes { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class VaccinationsController : ControllerBase
{
    private static readonly List<VaccinationRecordDto> _vaccinations = new()
    {
        new VaccinationRecordDto
        {
            Id = "vac-1",
            PetId = "pet-1",
            PetName = "Luna",
            PetSpecies = "Dog",
            VaccineName = "Rabies 3-Year",
            GivenDate = "2023-08-20",
            DueDate = "2026-08-20",
            BatchNumber = "RB-984210",
            Clinic = "Greenwood Animal Wellness Center",
            VetName = "Dr. Emily Stone, DVM",
            Status = "Upcoming",
            ReminderNotes = "Rabies vaccination booster scheduled in 5 days"
        },
        new VaccinationRecordDto
        {
            Id = "vac-2",
            PetId = "pet-1",
            PetName = "Luna",
            PetSpecies = "Dog",
            VaccineName = "DHPP (Distemper, Parvo)",
            GivenDate = "2024-02-10",
            DueDate = "2025-02-10",
            BatchNumber = "DH-771234",
            Clinic = "Greenwood Animal Wellness Center",
            VetName = "Dr. Emily Stone, DVM",
            Status = "Completed",
            ReminderNotes = "Completed during annual checkup"
        },
        new VaccinationRecordDto
        {
            Id = "vac-3",
            PetId = "pet-1",
            PetName = "Luna",
            PetSpecies = "Dog",
            VaccineName = "Bordetella (Kennel Cough)",
            GivenDate = "2024-08-15",
            DueDate = "2025-02-15",
            BatchNumber = "BT-332114",
            Clinic = "Greenwood Animal Wellness Center",
            VetName = "Dr. Emily Stone, DVM",
            Status = "Overdue",
            ReminderNotes = "Bordetella booster is overdue. Recommended for dog park visits."
        },
        new VaccinationRecordDto
        {
            Id = "vac-4",
            PetId = "pet-2",
            PetName = "Milo",
            PetSpecies = "Cat",
            VaccineName = "FVRCP (Feline Viral Rhinotracheitis)",
            GivenDate = "2024-06-12",
            DueDate = "2025-06-12",
            BatchNumber = "FV-882910",
            Clinic = "Urban Paws Feline Clinic",
            VetName = "Dr. Sophia Patel, DVM",
            Status = "Completed",
            ReminderNotes = "Annual booster up to date"
        }
    };

    [HttpGet]
    public IActionResult GetVaccinations([FromQuery] string? petId, [FromQuery] string? status)
    {
        var list = _vaccinations.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(petId))
        {
            list = list.Where(v => v.PetId.Equals(petId, StringComparison.OrdinalIgnoreCase));
        }
        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            list = list.Where(v => v.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }
        return Ok(list.ToList());
    }

    [HttpGet("reminders")]
    public IActionResult GetReminders()
    {
        var reminders = _vaccinations.Where(v => v.Status == "Upcoming" || v.Status == "Overdue").ToList();
        return Ok(reminders);
    }

    [HttpPost]
    public IActionResult CreateVaccination([FromBody] VaccinationRecordDto dto)
    {
        dto.Id = "vac-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _vaccinations.Insert(0, dto);
        return CreatedAtAction(nameof(GetVaccinations), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateVaccination(string id, [FromBody] VaccinationRecordDto dto)
    {
        var idx = _vaccinations.FindIndex(v => v.Id == id);
        if (idx != -1)
        {
            dto.Id = id;
            _vaccinations[idx] = dto;
            return Ok(dto);
        }
        return Ok(dto);
    }
}

using Microsoft.AspNetCore.Mvc;

namespace PetHaven.Api.Controllers;

public class ShelterDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ManagerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int Capacity { get; set; } = 50;
    public int CurrentPets { get; set; } = 12;
    public int AdoptionsThisYear { get; set; } = 28;
    public bool Verified { get; set; } = true;
    public double Rating { get; set; } = 4.8;
    public string Description { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class SheltersController : ControllerBase
{
    private static readonly List<ShelterDto> _shelters = new()
    {
        new ShelterDto
        {
            Id = "shelter-1",
            Name = "Happy Paws Rescue & Sanctuary",
            ManagerName = "Michael Scott",
            Email = "shelter@pethaven.com",
            Phone = "+1 (555) 456-7890",
            Address = "742 Evergreen Animal Haven, Seattle, WA",
            Capacity = 65,
            CurrentPets = 42,
            AdoptionsThisYear = 128,
            Verified = true,
            Rating = 4.9,
            Description = "Non-profit animal rescue shelter dedicated to no-kill rehabilitation and joyful pet adoptions across the Pacific Northwest."
        },
        new ShelterDto
        {
            Id = "shelter-2",
            Name = "Northwest Animal Sanctuary",
            ManagerName = "Eleanor Vance",
            Email = "info@nwanimalsanctuary.org",
            Phone = "+1 (555) 789-0123",
            Address = "890 Wildlife Way, Bellevue, WA",
            Capacity = 80,
            CurrentPets = 56,
            AdoptionsThisYear = 164,
            Verified = true,
            Rating = 4.8,
            Description = "Specializing in rescue, veterinary triage, behavioral rehabilitation, and community pet foster programs."
        }
    };

    [HttpGet]
    public IActionResult GetShelters()
    {
        return Ok(_shelters);
    }

    [HttpGet("dashboard-metrics")]
    public IActionResult GetDashboardMetrics()
    {
        var metrics = new
        {
            totalPets = 98,
            availablePets = 42,
            adoptedPets = 36,
            pendingApplications = 14,
            vaccinationCompliance = "94%",
            monthlyAdoptions = 18,
            capacityOccupancy = "65%"
        };
        return Ok(metrics);
    }

    [HttpGet("{id}")]
    public IActionResult GetShelterById(string id)
    {
        var shelter = _shelters.FirstOrDefault(s => s.Id == id) ?? _shelters.FirstOrDefault();
        if (shelter == null) return NotFound(new { message = "Shelter not found" });
        return Ok(shelter);
    }

    [HttpPost]
    public IActionResult CreateShelter([FromBody] ShelterDto dto)
    {
        dto.Id = "shelter-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _shelters.Insert(0, dto);
        return CreatedAtAction(nameof(GetShelterById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateShelter(string id, [FromBody] ShelterDto dto)
    {
        var idx = _shelters.FindIndex(s => s.Id == id);
        if (idx != -1)
        {
            dto.Id = id;
            _shelters[idx] = dto;
            return Ok(dto);
        }
        return NotFound(new { message = "Shelter not found" });
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteShelter(string id)
    {
        var item = _shelters.FirstOrDefault(s => s.Id == id);
        if (item != null)
        {
            _shelters.Remove(item);
            return Ok(new { success = true, message = "Shelter removed successfully" });
        }
        return NotFound(new { message = "Shelter not found" });
    }
}

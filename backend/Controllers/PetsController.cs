using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.DTOs;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PetsController : ControllerBase
{
    private readonly IPetService _petService;
    private readonly ILogger<PetsController> _logger;

    public PetsController(IPetService petService, ILogger<PetsController> logger)
    {
        _petService = petService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieve paginated list of pets with search and filter options
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPets(
        [FromQuery] PetListQueryParams query,
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null)
    {
        try
        {
            var result = await _petService.GetPetsAsync(query, headerUserId, headerUserEmail);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pets from MongoDB");
            return StatusCode(500, new { success = false, message = "Failed to fetch pets", detail = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve featured pets for homepage/showcase
    /// </summary>
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedPets(
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null)
    {
        try
        {
            var pets = await _petService.GetFeaturedPetsAsync(headerUserId, headerUserEmail);
            return Ok(pets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching featured pets");
            return StatusCode(500, new { success = false, message = "Failed to fetch featured pets", detail = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve favorite pets for the current user
    /// </summary>
    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites(
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null,
        [FromQuery] string? userId = null,
        [FromQuery] string? email = null)
    {
        try
        {
            var uid = !string.IsNullOrWhiteSpace(userId) ? userId : headerUserId;
            var uemail = !string.IsNullOrWhiteSpace(email) ? email : headerUserEmail;
            var pets = await _petService.GetFavoritesAsync(uid, uemail);
            return Ok(pets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve favorites");
            return StatusCode(500, new { success = false, message = "Failed to fetch favorites", detail = ex.Message });
        }
    }

    /// <summary>
    /// Toggle favorite status of a pet for the current user
    /// </summary>
    [HttpPost("{id}/favorite")]
    [HttpPost("favorites/{id}")]
    public async Task<IActionResult> ToggleFavorite(
        string id,
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null)
    {
        try
        {
            var (isFavorite, favoriteIds) = await _petService.ToggleFavoriteAsync(id, headerUserId, headerUserEmail);
            return Ok(new
            {
                success = true,
                isFavorite,
                petId = id,
                favoriteIds
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling favorite for pet {PetId}", id);
            return StatusCode(500, new { success = false, message = "Failed to toggle favorite", detail = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve pet details by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPetById(
        string id,
        [FromHeader(Name = "X-User-Id")] string? headerUserId = null,
        [FromHeader(Name = "X-User-Email")] string? headerUserEmail = null)
    {
        try
        {
            var pet = await _petService.GetByIdAsync(id, headerUserId, headerUserEmail);
            if (pet == null)
            {
                return NotFound(new { success = false, message = "Pet not found in MongoDB" });
            }
            return Ok(pet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pet {Id}", id);
            return StatusCode(500, new { success = false, message = "Failed to fetch pet", detail = ex.Message });
        }
    }

    /// <summary>
    /// Create and register a new pet in MongoDB database
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePet(
        [FromBody] CreatePetDto dto,
        [FromHeader(Name = "X-User-Email")] string? userEmail,
        [FromHeader(Name = "X-User-Id")] string? userId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.OwnerEmail) && !string.IsNullOrWhiteSpace(userEmail))
            {
                dto.OwnerEmail = userEmail;
            }
            if (string.IsNullOrWhiteSpace(dto.OwnerId) && !string.IsNullOrWhiteSpace(userId))
            {
                dto.OwnerId = userId;
            }

            var createdPet = await _petService.CreatePetAsync(dto);
            _logger.LogInformation("New pet registered in MongoDB: {PetName} (ID: {PetId})", createdPet.Name, createdPet.Id);

            return CreatedAtAction(nameof(GetPetById), new { id = createdPet.Id }, createdPet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering pet in MongoDB");
            return StatusCode(500, new { success = false, message = "Failed to register pet in database", detail = ex.Message });
        }
    }

    /// <summary>
    /// Update pet record in MongoDB
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePet(string id, [FromBody] UpdatePetDto dto)
    {
        try
        {
            var updatedPet = await _petService.UpdatePetAsync(id, dto);
            if (updatedPet == null)
            {
                return NotFound(new { success = false, message = "Pet not found to update" });
            }
            return Ok(updatedPet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pet {Id}", id);
            return StatusCode(500, new { success = false, message = "Failed to update pet", detail = ex.Message });
        }
    }

    /// <summary>
    /// Delete pet from MongoDB
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePet(string id)
    {
        try
        {
            var success = await _petService.DeletePetAsync(id);
            if (!success)
            {
                return NotFound(new { success = false, message = "Pet not found to delete" });
            }
            return Ok(new { success = true, message = "Pet removed successfully from database" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting pet {Id}", id);
            return StatusCode(500, new { success = false, message = "Failed to delete pet", detail = ex.Message });
        }
    }
}

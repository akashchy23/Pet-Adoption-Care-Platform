using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.DTOs;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user into MongoDB database
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { success = false, message = "Validation failed", errors = ModelState });
        }

        try
        {
            var user = await _userService.RegisterAsync(dto);
            _logger.LogInformation("Successfully registered user {Email} in MongoDB", dto.Email);
            return Ok(new
            {
                success = true,
                message = "User registered successfully into MongoDB!",
                user,
                token = "jwt_token_" + Guid.NewGuid().ToString("N")
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed for {Email}", dto.Email);
            return StatusCode(500, new { success = false, message = "Server error processing registration", detail = ex.Message });
        }
    }

    /// <summary>
    /// Sync profile details (called by frontend registration/auth flow) into MongoDB
    /// </summary>
    [HttpPost("sync-profile")]
    public async Task<IActionResult> SyncProfile([FromBody] SyncProfileDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email))
        {
            return BadRequest(new { success = false, message = "Email is required." });
        }

        try
        {
            var user = await _userService.SyncProfileAsync(dto);
            _logger.LogInformation("Profile synced in MongoDB for user {Email}", dto.Email);
            return Ok(new
            {
                success = true,
                message = "User profile saved to MongoDB successfully",
                data = user,
                user
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Profile sync failed for {Email}", dto.Email);
            return StatusCode(500, new { success = false, message = "Error syncing user profile", detail = ex.Message });
        }
    }

    /// <summary>
    /// Authenticate user credentials against MongoDB
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { success = false, message = "Validation failed" });
        }

        try
        {
            var result = await _userService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for {Email}", dto.Email);
            return StatusCode(500, new { success = false, message = "Error logging in", detail = ex.Message });
        }
    }

    /// <summary>
    /// Get details of current user from header or query
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser([FromHeader(Name = "X-User-Email")] string? userEmail)
    {
        if (string.IsNullOrEmpty(userEmail))
        {
            var users = await _userService.GetAllAsync();
            var firstUser = users.FirstOrDefault();
            if (firstUser != null) return Ok(firstUser);
            return NotFound(new { success = false, message = "No user found" });
        }

        var user = await _userService.GetByEmailAsync(userEmail);
        if (user == null) return NotFound(new { success = false, message = "User not found in MongoDB" });
        return Ok(user);
    }

    /// <summary>
    /// Retrieve all registered users in MongoDB
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(new { success = true, count = users.Count, data = users });
    }

    /// <summary>
    /// Admin create user (adopter, pet owner, veterinarian, admin)
    /// </summary>
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(dto);
            return Ok(new { success = true, message = "User account created successfully", data = user });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user");
            return StatusCode(500, new { success = false, message = "Error creating user", detail = ex.Message });
        }
    }

    /// <summary>
    /// Admin update user details & role
    /// </summary>
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var updated = await _userService.UpdateUserAsync(id, dto);
            if (updated == null) return NotFound(new { success = false, message = "User not found" });
            return Ok(new { success = true, message = "User account updated successfully", data = updated });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update user {Id}", id);
            return StatusCode(500, new { success = false, message = "Error updating user", detail = ex.Message });
        }
    }

    /// <summary>
    /// Admin delete user account
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound(new { success = false, message = "User not found" });
            return Ok(new { success = true, message = "User removed successfully from database" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete user {Id}", id);
            return StatusCode(500, new { success = false, message = "Error removing user", detail = ex.Message });
        }
    }

    /// <summary>
    /// Ping endpoint to verify MongoDB atlas connection
    /// </summary>
    [HttpGet("ping")]
    public async Task<IActionResult> Ping()
    {
        var isConnected = await _userService.PingDatabaseAsync();
        if (isConnected)
        {
            return Ok(new { success = true, message = "Pinged MongoDB deployment. Successfully connected to MongoDB!" });
        }
        return StatusCode(503, new { success = false, message = "Unable to connect to MongoDB deployment." });
    }
}

namespace PetHaven.Api.DTOs;

public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string? FirebaseUid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "Adopter";
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? ProfileImage { get; set; }
    public bool IsEmailVerified { get; set; }
    public List<string> FavoritePetIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class AuthResponseDto
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = null!;
}

public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Password { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "Adopter";
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? ProfileImage { get; set; }
}

public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Role { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? ProfileImage { get; set; }
}

using PetHaven.Api.Models;

namespace PetHaven.Api.Services;

public interface IVetService
{
    Task<List<Veterinarian>> GetAllVetsAsync(string? search = null, string? specialization = null);
    Task<Veterinarian?> GetVetByIdAsync(string id);
    Task<Veterinarian?> GetVetByEmailAsync(string email);
    Task<Veterinarian> RegisterVetAsync(Veterinarian vet);
    Task<Veterinarian?> UpdateVetAsync(string id, Veterinarian vet);
    Task<bool> DeleteVetAsync(string id);
    Task EnsureVetProfileForUserAsync(User user, string? clinicName = null, string? specialization = null, decimal? fee = null, string? bio = null);
}

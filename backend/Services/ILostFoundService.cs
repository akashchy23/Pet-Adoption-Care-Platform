using PetHaven.Api.Models;

namespace PetHaven.Api.Services;

public interface ILostFoundService
{
    Task<List<LostFoundPet>> GetReportsAsync(string? type = null, string? search = null);
    Task<LostFoundPet?> GetByIdAsync(string id);
    Task<LostFoundPet> CreateReportAsync(LostFoundPet report);
    Task<bool> DeleteReportAsync(string id);
    Task<LostFoundPet?> UpdateStatusAsync(string id, string status);
}

using PetHaven.Api.Models;

namespace PetHaven.Api.Services;

public interface IAdoptionService
{
    Task<List<AdoptionApplication>> GetAllApplicationsAsync(string? status = null, string? petId = null);
    Task<List<AdoptionApplication>> GetApplicationsForOwnerAsync(string? ownerEmail = null, string? ownerId = null, bool confirmedOnly = false);
    Task<List<AdoptionApplication>> GetApplicationsForApplicantAsync(string? applicantEmail = null, string? applicantId = null);
    Task<AdoptionApplication?> GetByIdAsync(string id);
    Task<AdoptionApplication> SubmitApplicationAsync(AdoptionApplication app);
    Task<AdoptionApplication?> UpdateStatusAsync(string id, string status, string? notes = null);
}

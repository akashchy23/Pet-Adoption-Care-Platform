using PetHaven.Api.Models;

namespace PetHaven.Api.Services;

public interface IAppointmentService
{
    Task<List<Appointment>> GetAppointmentsAsync(string? vetId = null, string? vetName = null, string? vetEmail = null, string? ownerId = null, string? status = null);
    Task<Appointment?> GetByIdAsync(string id);
    Task<Appointment> BookAppointmentAsync(Appointment appointment);
    Task<Appointment?> CancelAppointmentAsync(string id);
    Task<Appointment?> RescheduleAppointmentAsync(string id, string date, string time);
    Task<Appointment?> UpdateStatusAsync(string id, string status);
}

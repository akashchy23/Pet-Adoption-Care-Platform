using Microsoft.AspNetCore.Mvc;

namespace PetHaven.Api.Controllers;

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "general";
    public bool Read { get; set; } = false;
    public string CreatedAt { get; set; } = "Just now";
    public string? Link { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private static readonly List<NotificationDto> _notifications = new()
    {
        new NotificationDto
        {
            Id = "notif-1",
            UserId = "user-1",
            Title = "Adoption Application Status Updated",
            Message = "Your adoption request for Luna is now Under Review by Happy Paws Rescue.",
            Type = "adoption",
            Read = false,
            CreatedAt = "10 mins ago",
            Link = "/adopter/applications"
        },
        new NotificationDto
        {
            Id = "notif-2",
            UserId = "user-1",
            Title = "Upcoming Vaccination Alert",
            Message = "Luna is due for Rabies 3-Year booster on August 20, 2026.",
            Type = "vaccination",
            Read = false,
            CreatedAt = "2 hours ago",
            Link = "/vaccinations"
        },
        new NotificationDto
        {
            Id = "notif-3",
            UserId = "user-1",
            Title = "Appointment Confirmed",
            Message = "Vet visit with Dr. Emily Stone confirmed for Aug 20 at 10:30 AM.",
            Type = "appointment",
            Read = true,
            CreatedAt = "1 day ago",
            Link = "/appointments"
        },
        new NotificationDto
        {
            Id = "notif-4",
            UserId = "user-3",
            Title = "New Adoption Application Submitted",
            Message = "David Miller submitted an adoption application for Rocky (Shepherd Mix).",
            Type = "adoption",
            Read = false,
            CreatedAt = "3 hours ago",
            Link = "/admin/adoptions"
        }
    };

    [HttpGet]
    public IActionResult GetNotifications()
    {
        return Ok(_notifications);
    }

    [HttpPatch("{id}/read")]
    public IActionResult MarkAsRead(string id)
    {
        var item = _notifications.FirstOrDefault(n => n.Id == id);
        if (item != null)
        {
            item.Read = true;
            return Ok(item);
        }
        return Ok(new { id, read = true });
    }

    [HttpPost("mark-all-read")]
    public IActionResult MarkAllAsRead()
    {
        foreach (var n in _notifications)
        {
            n.Read = true;
        }
        return Ok(new { success = true, message = "All notifications marked as read" });
    }
}

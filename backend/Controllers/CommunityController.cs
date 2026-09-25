using Microsoft.AspNetCore.Mvc;
using PetHaven.Api.Models;
using PetHaven.Api.Services;

namespace PetHaven.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunityController : ControllerBase
{
    private readonly ICommunityService _communityService;
    private readonly ILogger<CommunityController> _logger;

    public CommunityController(ICommunityService communityService, ILogger<CommunityController> logger)
    {
        _communityService = communityService;
        _logger = logger;
    }

    private string GetCallerIdentifier()
    {
        // Check custom user headers from axiosClient
        if (Request.Headers.TryGetValue("X-User-Id", out var userId) && !string.IsNullOrWhiteSpace(userId))
            return userId.ToString();
        if (Request.Headers.TryGetValue("X-User-Email", out var userEmail) && !string.IsNullOrWhiteSpace(userEmail))
            return userEmail.ToString();
        if (Request.Headers.TryGetValue("X-Firebase-Uid", out var fUid) && !string.IsNullOrWhiteSpace(fUid))
            return fUid.ToString();

        // Fallback to IP address if guest
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous-user";
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] string? userId)
    {
        try
        {
            var callerId = !string.IsNullOrWhiteSpace(userId) ? userId : GetCallerIdentifier();
            var posts = await _communityService.GetPostsAsync(callerId);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting community posts");
            return StatusCode(500, new { message = "Failed to retrieve community posts", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPostById(string id)
    {
        try
        {
            var callerId = GetCallerIdentifier();
            var post = await _communityService.GetPostByIdAsync(id, callerId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }
            return Ok(post);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting community post {Id}", id);
            return StatusCode(500, new { message = "Failed to retrieve post", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CommunityPost request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Comment) && string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { message = "Post content or title cannot be empty." });
            }

            // Populate metadata from headers if not explicitly in body
            if (string.IsNullOrWhiteSpace(request.UserId) && Request.Headers.TryGetValue("X-User-Id", out var uid))
                request.UserId = uid.ToString();

            if (string.IsNullOrWhiteSpace(request.UserEmail) && Request.Headers.TryGetValue("X-User-Email", out var uemail))
                request.UserEmail = uemail.ToString();

            if ((string.IsNullOrWhiteSpace(request.UserRole) || request.UserRole == "Adopter") && Request.Headers.TryGetValue("X-User-Role", out var urole))
                request.UserRole = urole.ToString();

            var created = await _communityService.CreatePostAsync(request);
            return Ok(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating community post");
            return StatusCode(500, new { message = "Failed to create post", error = ex.Message });
        }
    }

    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(string id, [FromBody] CommunityComment request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest(new { message = "Comment text cannot be empty." });
            }

            if (string.IsNullOrWhiteSpace(request.UserId) && Request.Headers.TryGetValue("X-User-Id", out var uid))
                request.UserId = uid.ToString();

            if ((string.IsNullOrWhiteSpace(request.UserRole) || request.UserRole == "Adopter") && Request.Headers.TryGetValue("X-User-Role", out var urole))
                request.UserRole = urole.ToString();

            var added = await _communityService.AddCommentAsync(id, request);
            if (added == null)
            {
                return NotFound(new { message = "Target post not found to add comment." });
            }

            return Ok(added);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding comment to post {Id}", id);
            return StatusCode(500, new { message = "Failed to add comment", error = ex.Message });
        }
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> ToggleLike(string id)
    {
        try
        {
            var callerId = GetCallerIdentifier();
            var (isLiked, likesCount) = await _communityService.ToggleLikeAsync(id, callerId);

            return Ok(new
            {
                success = true,
                isLiked,
                likesCount,
                message = isLiked ? "Post liked" : "Post unliked"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like on post {Id}", id);
            return StatusCode(500, new { message = "Failed to toggle like", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(string id)
    {
        try
        {
            var deleted = await _communityService.DeletePostAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "Post not found or already deleted." });
            }
            return Ok(new { success = true, message = "Post deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting post {Id}", id);
            return StatusCode(500, new { message = "Failed to delete post", error = ex.Message });
        }
    }
}

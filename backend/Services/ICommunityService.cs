using PetHaven.Api.Models;

namespace PetHaven.Api.Services;

public interface ICommunityService
{
    Task<List<CommunityPost>> GetPostsAsync(string? currentUserIdOrEmail = null);
    Task<CommunityPost?> GetPostByIdAsync(string id, string? currentUserIdOrEmail = null);
    Task<CommunityPost> CreatePostAsync(CommunityPost post);
    Task<CommunityComment?> AddCommentAsync(string postId, CommunityComment comment);
    Task<(bool isLiked, int likesCount)> ToggleLikeAsync(string postId, string userIdOrEmail);
    Task<bool> DeletePostAsync(string id);
}

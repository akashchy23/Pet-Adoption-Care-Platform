using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PetHaven.Api.Models;
using PetHaven.Api.Settings;

namespace PetHaven.Api.Services;

public class CommunityService : ICommunityService
{
    private readonly IMongoCollection<CommunityPost> _postsCollection;

    public CommunityService(IOptions<MongoDbSettings> mongoDbSettings)
    {
        var client = new MongoClient(mongoDbSettings.Value.ConnectionString);
        var database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
        _postsCollection = database.GetCollection<CommunityPost>(mongoDbSettings.Value.CommunityCollectionName);

        // Seed initial posts if collection is completely empty
        SeedInitialPostsIfEmptyAsync().ConfigureAwait(false);
    }

    private async Task SeedInitialPostsIfEmptyAsync()
    {
        try
        {
            var count = await _postsCollection.CountDocumentsAsync(_ => true);
            if (count == 0)
            {
                var starterPosts = new List<CommunityPost>
                {
                    new CommunityPost
                    {
                        UserName = "Dr. Marcus Vance",
                        UserRole = "Veterinarian",
                        UserAvatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
                        Title = "Essential Summer Hydration & Heat Safety for Dogs",
                        Comment = "With temperatures rising, remember to keep your pets well hydrated! Avoid walking your dogs on asphalt during peak afternoon hours — if it's too hot for the back of your hand, it's too hot for their paws.",
                        Category = "Health Advice",
                        LikesCount = 12,
                        LikedUserIds = new List<string> { "demo-user-1", "demo-user-2" },
                        Comments = new List<CommunityComment>
                        {
                            new CommunityComment
                            {
                                UserName = "Sarah Jenkins",
                                UserRole = "Pet Owner",
                                UserAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                                Text = "Thank you Dr. Vance! We bring collapsible water bowls on all our morning walks now.",
                                CreatedAt = DateTime.UtcNow.AddHours(-12)
                            },
                            new CommunityComment
                            {
                                UserName = "Elena Rostov",
                                UserRole = "Adopter",
                                UserAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                                Text = "Such a great reminder for new pet parents!",
                                CreatedAt = DateTime.UtcNow.AddHours(-6)
                            }
                        },
                        CreatedAt = DateTime.UtcNow.AddDays(-2)
                    },
                    new CommunityPost
                    {
                        UserName = "Happy Tails Rescue Shelter",
                        UserRole = "Shelter Manager",
                        UserAvatar = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&auto=format&fit=crop&q=80",
                        Title = "Luna's 1-Month Adoption Anniversary Story! 🐾",
                        Comment = "One month ago, Luna the Golden Retriever found her forever family through PetHaven. Her adopter sent us this heartwarming update — she loves playing fetch at the local dog park and cuddling every evening!",
                        Category = "Adoption Story",
                        ImageUrl = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
                        LikesCount = 24,
                        LikedUserIds = new List<string> { "demo-user-1", "demo-user-3" },
                        Comments = new List<CommunityComment>
                        {
                            new CommunityComment
                            {
                                UserName = "David Kim",
                                UserRole = "Adopter",
                                UserAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                                Text = "Luna looks so happy! Congratulations to her new family!",
                                CreatedAt = DateTime.UtcNow.AddHours(-18)
                            }
                        },
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    }
                };

                await _postsCollection.InsertManyAsync(starterPosts);
            }
        }
        catch
        {
            // Seed failure should not crash app startup
        }
    }

    public async Task<List<CommunityPost>> GetPostsAsync(string? currentUserIdOrEmail = null)
    {
        var posts = await _postsCollection
            .Find(_ => true)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(currentUserIdOrEmail))
        {
            foreach (var post in posts)
            {
                post.IsLikedByCurrentUser = post.LikedUserIds != null && 
                    post.LikedUserIds.Contains(currentUserIdOrEmail, StringComparer.OrdinalIgnoreCase);
            }
        }

        return posts;
    }

    public async Task<CommunityPost?> GetPostByIdAsync(string id, string? currentUserIdOrEmail = null)
    {
        var post = await _postsCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (post != null && !string.IsNullOrWhiteSpace(currentUserIdOrEmail))
        {
            post.IsLikedByCurrentUser = post.LikedUserIds != null && 
                post.LikedUserIds.Contains(currentUserIdOrEmail, StringComparer.OrdinalIgnoreCase);
        }
        return post;
    }

    public async Task<CommunityPost> CreatePostAsync(CommunityPost post)
    {
        post.CreatedAt = DateTime.UtcNow;
        post.UpdatedAt = DateTime.UtcNow;
        post.LikedUserIds ??= new List<string>();
        post.Comments ??= new List<CommunityComment>();
        post.LikesCount = post.LikedUserIds.Count;

        await _postsCollection.InsertOneAsync(post);
        return post;
    }

    public async Task<CommunityComment?> AddCommentAsync(string postId, CommunityComment comment)
    {
        comment.Id = Guid.NewGuid().ToString();
        comment.CreatedAt = DateTime.UtcNow;

        var update = Builders<CommunityPost>.Update
            .Push(p => p.Comments, comment)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        var result = await _postsCollection.UpdateOneAsync(p => p.Id == postId, update);

        return result.ModifiedCount > 0 ? comment : null;
    }

    public async Task<(bool isLiked, int likesCount)> ToggleLikeAsync(string postId, string userIdOrEmail)
    {
        var post = await _postsCollection.Find(p => p.Id == postId).FirstOrDefaultAsync();
        if (post == null)
        {
            return (false, 0);
        }

        post.LikedUserIds ??= new List<string>();
        bool isLiked;

        if (post.LikedUserIds.Contains(userIdOrEmail, StringComparer.OrdinalIgnoreCase))
        {
            // Unlike
            post.LikedUserIds.RemoveAll(u => string.Equals(u, userIdOrEmail, StringComparison.OrdinalIgnoreCase));
            isLiked = false;
        }
        else
        {
            // Like
            post.LikedUserIds.Add(userIdOrEmail);
            isLiked = true;
        }

        post.LikesCount = post.LikedUserIds.Count;
        post.UpdatedAt = DateTime.UtcNow;

        var update = Builders<CommunityPost>.Update
            .Set(p => p.LikedUserIds, post.LikedUserIds)
            .Set(p => p.LikesCount, post.LikesCount)
            .Set(p => p.UpdatedAt, post.UpdatedAt);

        await _postsCollection.UpdateOneAsync(p => p.Id == postId, update);

        return (isLiked, post.LikesCount);
    }

    public async Task<bool> DeletePostAsync(string id)
    {
        var result = await _postsCollection.DeleteOneAsync(p => p.Id == id);
        return result.DeletedCount > 0;
    }
}

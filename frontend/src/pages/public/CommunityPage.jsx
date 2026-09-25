import React, { useState, useEffect } from 'react';
import { communityApi } from '../../api/communityApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import {
  Heart,
  MessageSquare,
  Send,
  ShieldCheck,
  Stethoscope,
  Home,
  User as UserIcon,
  Crown,
  Loader2,
  Image as ImageIcon,
  Tag,
  Trash2,
  Filter,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

// Helper to format role badge with distinct colors & icons
const getRoleBadge = (roleName) => {
  const r = (roleName || 'Adopter').toLowerCase();
  if (r.includes('admin')) {
    return {
      label: 'Admin',
      icon: Crown,
      classes: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }
  if (r.includes('vet')) {
    return {
      label: 'Veterinarian',
      icon: Stethoscope,
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
  }
  if (r.includes('shelter')) {
    return {
      label: 'Shelter Manager',
      icon: Home,
      classes: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }
  if (r.includes('owner')) {
    return {
      label: 'Pet Owner',
      icon: UserIcon,
      classes: 'bg-sky-50 text-sky-700 border-sky-200'
    };
  }
  return {
    label: 'Adopter',
    icon: ShieldCheck,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
};

const CATEGORIES = [
  'All',
  'Adoption Story',
  'Health Advice',
  'Pet Care Tips',
  'Questions',
  'General'
];

export const CommunityPage = () => {
  const { user, role, isAuthenticated } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New Post Form State
  const [submittingPost, setSubmittingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageField, setShowImageField] = useState(false);

  // Comment Inputs & States
  const [newCommentInputs, setNewCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await communityApi.getPosts({ userId: user?.id || user?.email });
      // Normalize posts
      const normalized = (Array.isArray(data) ? data : []).map((p) => ({
        id: p.id || p.Id,
        userId: p.userId,
        userEmail: p.userEmail,
        authorName: p.userName || p.authorName || 'Community Member',
        authorAvatar: p.userAvatar || p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        userRole: p.userRole || p.role || 'Adopter',
        title: p.title || '',
        content: p.comment || p.content || '',
        category: p.category || 'General',
        imageUrl: p.imageUrl || null,
        likesCount: p.likesCount ?? (p.likedUserIds ? p.likedUserIds.length : 0),
        isLiked: p.isLikedByCurrentUser || (user?.id && p.likedUserIds?.includes(user.id)) || (user?.email && p.likedUserIds?.includes(user.email)) || false,
        comments: (p.comments || []).map((c) => ({
          id: c.id || c.Id,
          userId: c.userId,
          userName: c.userName || c.user || 'Community Member',
          userRole: c.userRole || 'Adopter',
          userAvatar: c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          text: c.text || c.comment || '',
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'
        })),
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'
      }));
      setPosts(normalized);
    } catch (err) {
      console.error('Failed to load community posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setSubmittingPost(true);
      const userRoleName = user?.role || role || 'Adopter';
      const authorName = user?.name || (isAuthenticated ? 'Pet Lover' : 'Community Guest');
      const authorAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

      await communityApi.createPost({
        userId: user?.id || user?._id || null,
        userEmail: user?.email || null,
        title: newPostTitle.trim() || 'Community Story',
        content: newPostContent.trim(),
        userRole: userRoleName,
        authorName,
        authorAvatar,
        category: newPostCategory,
        imageUrl: newPostImage.trim() || null
      });

      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage('');
      setShowImageField(false);
      success('Your post has been published to the community!');
      await loadPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
      toastError(typeof err === 'string' ? err : err?.message || 'Failed to publish post to database. Please try again.');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleToggleLike = async (postId) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );

    try {
      const res = await communityApi.toggleLike(postId);
      if (res && res.likesCount !== undefined) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likesCount: res.likesCount, isLiked: res.isLiked } : p))
        );
      }
    } catch (err) {
      console.warn('Like sync notice', err);
      // Revert / re-sync on failure
      await loadPosts();
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
      const userRoleName = user?.role || role || 'Adopter';
      const userName = user?.name || (isAuthenticated ? 'Pet Guardian' : 'Guest Commenter');
      const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

      await communityApi.addComment(postId, {
        userId: user?.id || user?._id || null,
        text: text.trim(),
        userRole: userRoleName,
        userName,
        userAvatar
      });

      setNewCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      success('Comment added successfully!');
      await loadPosts();
    } catch (err) {
      console.error('Failed to add comment:', err);
      toastError(typeof err === 'string' ? err : err?.message || 'Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this community post?')) return;
    try {
      await communityApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      success('Post deleted successfully');
    } catch (err) {
      toastError('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return (p.category || 'General').toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>PetHaven Community Forum & Feed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
          Community Stories & Discussions
        </h1>
        <p className="text-sm text-slate-600">
          Share adoption journeys, post questions, discuss pet care, and connect directly with fellow adopters, veterinarians, pet owners, and shelters.
        </p>
      </div>

      {/* Post Composer Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:border-teal-200 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt="Profile"
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-teal-500/20"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{user?.name || 'Community Member'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {(() => {
                  const badge = getRoleBadge(user?.role || role || 'Adopter');
                  const Icon = badge.icon;
                  return (
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border', badge.classes)}>
                      <Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
            New Community Post
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Post Title (e.g. Luna's first week at home! / Question about puppy vaccinations)"
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition"
          />

          <textarea
            rows={3}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Write your story, question, health advice, or cute experience with your pet..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition resize-none"
          />

          {showImageField && (
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <ImageIcon className="w-4 h-4 text-teal-600 shrink-0 ml-1" />
              <input
                type="url"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              >
                <option value="General">Category: General</option>
                <option value="Adoption Story">Adoption Story</option>
                <option value="Health Advice">Health Advice</option>
                <option value="Pet Care Tips">Pet Care Tips</option>
                <option value="Questions">Questions</option>
              </select>

              <button
                type="button"
                onClick={() => setShowImageField(!showImageField)}
                className={clsx(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition',
                  showImageField
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{showImageField ? 'Image URL Added' : 'Add Photo'}</span>
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={submittingPost ? Loader2 : Send}
              disabled={submittingPost || !newPostContent.trim()}
              className="rounded-xl px-5 shadow-sm"
            >
              {submittingPost ? 'Publishing...' : 'Share Post'}
            </Button>
          </div>
        </form>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Topics:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
              selectedCategory === cat
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-xs font-semibold text-slate-500">Loading community posts from database...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 space-y-3">
          <MessageSquare className="w-10 h-10 text-teal-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No community posts found in this topic</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first to share an update, health question, or joyful adoption memory with the community!
          </p>
        </div>
      ) : (
        /* Post Feed */
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const authorBadge = getRoleBadge(post.userRole);
            const AuthorIcon = authorBadge.icon;
            const isAuthorOrAdmin =
              (user?.id && post.userId === user.id) ||
              (user?.email && post.userEmail === user.email) ||
              role === 'Administrator' ||
              user?.role === 'Administrator';

            return (
              <article
                key={post.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">{post.authorName}</h4>
                        <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border', authorBadge.classes)}>
                          <AuthorIcon className="w-3 h-3" />
                          {authorBadge.label}
                        </span>
                        {post.category && post.category !== 'General' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <Tag className="w-2.5 h-2.5" />
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{post.createdAt}</p>
                    </div>
                  </div>

                  {isAuthorOrAdmin && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Title & Post Content */}
                {post.title && (
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                )}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Post Image Attachment */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-96 bg-slate-50">
                    <img
                      src={post.imageUrl}
                      alt={post.title || 'Community Post Image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Actions Bar (Likes and Comments Count) */}
                <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={clsx(
                      'flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-xl border',
                      post.isLiked
                        ? 'text-rose-600 font-bold bg-rose-50 border-rose-200'
                        : 'text-slate-600 bg-slate-50 border-slate-200/60 hover:text-rose-600 hover:bg-rose-50/50'
                    )}
                  >
                    <Heart className={clsx('w-4 h-4', post.isLiked && 'fill-rose-600')} />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="pt-2 space-y-2.5">
                    {post.comments.map((comment) => {
                      const commentBadge = getRoleBadge(comment.userRole);
                      const CommentIcon = commentBadge.icon;

                      return (
                        <div key={comment.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={comment.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={comment.userName}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-900">{comment.userName}</span>
                              <span className={clsx('inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold border', commentBadge.classes)}>
                                <CommentIcon className="w-2.5 h-2.5" />
                                {commentBadge.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                          </div>
                          <p className="text-slate-700 pl-7 font-normal">{comment.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment with your verified role badge..."
                    value={newCommentInputs[post.id] || ''}
                    onChange={(e) =>
                      setNewCommentInputs({ ...newCommentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={submittingComment[post.id] || !newCommentInputs[post.id]?.trim()}
                    onClick={() => handleAddComment(post.id)}
                    className="rounded-xl px-4 text-xs font-bold"
                  >
                    {submittingComment[post.id] ? 'Posting...' : 'Reply'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

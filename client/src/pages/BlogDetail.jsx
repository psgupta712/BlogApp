// src/pages/BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBlogById, deleteBlog, toggleLike } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import './BlogDetail.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const readTime = (content = '') =>
  Math.max(1, Math.ceil(content.split(' ').length / 200));

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogById(id);
        setBlog(data);
        setLikeCount(data.likes?.length || 0);
        if (user) {
          setLiked(data.likes?.some((uid) => uid === user._id || uid?._id === user._id));
        }
      } catch (err) {
        setError('Blog not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [id, user]);

  const isAuthor = user && blog && (
    blog.author?._id === user._id || blog.author === user._id
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    setLikeLoading(true);
    try {
      const result = await toggleLike(id);
      setLiked(result.liked);
      setLikeCount(result.likes);
    } catch {
      // silently fail
    } finally {
      setLikeLoading(false);
    }
  };

  // Render paragraph-formatted content
  const renderContent = (content = '') =>
    content.split('\n').map((para, i) =>
      para.trim() ? <p key={i}>{para}</p> : <br key={i} />
    );

  if (loading) {
    return (
      <div className="page loading-center">
        <div className="spinner" />
        <p>Loading story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="page container">
        <div className="alert alert-error" style={{ maxWidth: 500 }}>{error || 'Blog not found.'}</div>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <article className="blog-detail fade-up">
        {/* Header */}
        <header className="blog-detail__header container">
          <div className="blog-detail__meta-top">
            <span className="badge badge-accent">{blog.category}</span>
            <span className="blog-detail__date">{formatDate(blog.createdAt)}</span>
            <span className="blog-detail__read-time">📖 {readTime(blog.content)} min read</span>
            <span className="blog-detail__views">👁 {blog.views} views</span>
          </div>

          <h1 className="blog-detail__title">{blog.title}</h1>

          {blog.excerpt && (
            <p className="blog-detail__excerpt">{blog.excerpt}</p>
          )}

          {/* Author info */}
          <div className="blog-detail__author">
            <div className="blog-detail__avatar">
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="blog-detail__author-name">{blog.author?.name || 'Anonymous'}</div>
              {blog.author?.bio && (
                <div className="blog-detail__author-bio">{blog.author.bio}</div>
              )}
            </div>

            {/* Author action buttons */}
            {isAuthor && (
              <div className="blog-detail__author-actions">
                <Link to={`/edit/${blog._id}`} className="btn btn-secondary btn-sm">
                  ✏ Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="blog-detail__tags">
              {blog.tags.map((tag, i) => (
                <span key={i} className="badge badge-muted">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="blog-detail__cover">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}

        {/* Content */}
        <div className="blog-detail__body container">
          <div className="blog-detail__content">
            {renderContent(blog.content)}
          </div>

          {/* Like Button */}
          <div className="blog-detail__reactions">
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              <span className="like-btn__icon">{liked ? '❤️' : '🤍'}</span>
              <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            </button>
            {!user && (
              <span className="like-hint">
                <Link to="/login">Sign in</Link> to like this post
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="blog-detail__footer">
            <Link to="/" className="btn btn-secondary">← Back to All Stories</Link>
            {user && !isAuthor && (
              <Link to="/create" className="btn btn-primary">✍ Write Your Own →</Link>
            )}
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this story?</h3>
            <p>This action cannot be undone. Your post will be permanently removed.</p>
            <div className="modal__actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;

// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyBlogs, deleteBlog } from '../api/blogApi';
import { updateProfile } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Profile edit
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const loadMyBlogs = async () => {
      try {
        const data = await fetchMyBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load your blogs.');
      } finally {
        setLoading(false);
      }
    };
    loadMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError('Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    try {
      const updated = await updateProfile(profileForm);
      updateUser(updated);
      setProfileSuccess('Profile updated successfully!');
      setEditingProfile(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);

  return (
    <div className="page">
      <div className="container fade-up">
        <div className="dashboard">
          {/* ── LEFT SIDEBAR ──────────────────── */}
          <aside className="dashboard__sidebar">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-card__avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="profile-card__name">{user?.name}</h3>
              <p className="profile-card__email">{user?.email}</p>
              {user?.bio && (
                <p className="profile-card__bio">{user.bio}</p>
              )}

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? '✕ Cancel' : '✏ Edit Profile'}
              </button>

              {editingProfile && (
                <form className="profile-edit-form" onSubmit={handleProfileSave}>
                  <div className="form-group">
                    <label>Display Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell readers about yourself..."
                      rows={3}
                      style={{ minHeight: 80 }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={profileSaving}
                    style={{ width: '100%', justifyContent: 'center' }}>
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {profileSuccess && (
                <div className="alert alert-success" style={{ marginTop: 12, fontSize: '0.82rem' }}>
                  {profileSuccess}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-box__number">{blogs.length}</div>
                <div className="stat-box__label">Posts</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__number">{totalViews}</div>
                <div className="stat-box__label">Views</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__number">{totalLikes}</div>
                <div className="stat-box__label">Likes</div>
              </div>
            </div>

            {/* Quick links */}
            <div className="sidebar-links">
              <Link to="/create" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                ✍ Write New Post
              </Link>
              <Link to="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                🏠 View Homepage
              </Link>
              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--error)' }}
                onClick={() => { logout(); navigate('/'); }}
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────── */}
          <main className="dashboard__main">
            <div className="dashboard__main-header">
              <h1>My Stories</h1>
              <Link to="/create" className="btn btn-primary">
                + New Post
              </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading && (
              <div className="loading-center" style={{ padding: '60px 0' }}>
                <div className="spinner" />
                <p>Loading your posts...</p>
              </div>
            )}

            {!loading && blogs.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">✍</span>
                <h3>No posts yet</h3>
                <p>Share your first story with the world!</p>
                <Link to="/create" className="btn btn-primary" style={{ marginTop: 20 }}>
                  Write Your First Post →
                </Link>
              </div>
            )}

            {!loading && blogs.length > 0 && (
              <div className="my-blogs-list">
                {blogs.map((blog) => (
                  <div key={blog._id} className="my-blog-item">
                    {blog.coverImage && (
                      <div className="my-blog-item__cover">
                        <img src={blog.coverImage} alt={blog.title} />
                      </div>
                    )}
                    <div className="my-blog-item__body">
                      <div className="my-blog-item__top">
                        <span className="badge badge-accent">{blog.category}</span>
                        <span className="my-blog-item__date">{formatDate(blog.createdAt)}</span>
                      </div>
                      <Link to={`/blog/${blog._id}`}>
                        <h3 className="my-blog-item__title">{blog.title}</h3>
                      </Link>
                      <p className="my-blog-item__excerpt">
                        {blog.excerpt || blog.content?.substring(0, 120) + '...'}
                      </p>
                      <div className="my-blog-item__stats">
                        <span>👁 {blog.views || 0} views</span>
                        <span>❤️ {blog.likes?.length || 0} likes</span>
                      </div>
                    </div>
                    <div className="my-blog-item__actions">
                      <Link to={`/blog/${blog._id}`} className="btn btn-ghost btn-sm">View</Link>
                      <Link to={`/edit/${blog._id}`} className="btn btn-secondary btn-sm">Edit</Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                      >
                        {deletingId === blog._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

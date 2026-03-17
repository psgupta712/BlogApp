// src/pages/EditBlog.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBlogById, updateBlog } from '../api/blogApi';
import './BlogForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other'];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', coverImage: '', category: 'Other', tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await fetchBlogById(id);
        setForm({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt || '',
          coverImage: blog.coverImage || '',
          category: blog.category,
          tags: blog.tags?.join(', ') || '',
        });
      } catch (err) {
        setError('Failed to load blog.');
      } finally {
        setFetching(false);
      }
    };
    loadBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 5) return setError('Title must be at least 5 characters.');
    if (form.content.trim().length < 20) return setError('Content must be at least 20 characters.');

    setLoading(true);
    setError('');
    try {
      const tagsArray = form.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
      await updateBlog(id, { ...form, tags: tagsArray });
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page loading-center">
        <div className="spinner" />
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="blog-form-container container fade-up">
        <div className="blog-form-header">
          <div>
            <p className="blog-form-eyebrow">✏ Edit Story</p>
            <h1>Update Your Post</h1>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required className="blog-form__title-input" />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Short Excerpt <span className="optional">(optional)</span></label>
            <textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} style={{ minHeight: 80 }} />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea id="content" name="content" value={form.content} onChange={handleChange} required className="blog-form__content-textarea" />
          </div>

          <div className="blog-form__row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="coverImage">Cover Image URL <span className="optional">(optional)</span></label>
              <input id="coverImage" name="coverImage" type="url" value={form.coverImage} onChange={handleChange} />
              {form.coverImage && (
                <div className="cover-preview">
                  <img src={form.coverImage} alt="Cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags <span className="optional">(comma-separated)</span></label>
            <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="e.g. react, javascript" />
            {form.tags && (
              <div className="tags-preview">
                {form.tags.split(',').map((t, i) => t.trim() ? <span key={i} className="badge badge-accent">{t.trim()}</span> : null)}
              </div>
            )}
          </div>

          <div className="blog-form__actions">
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Saving...</> : '✔ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;

// src/pages/CreateBlog.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../api/blogApi';
import './BlogForm.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other'];

const CreateBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    category: 'Other',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const tagsArray = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const blog = await createBlog({ ...form, tags: tagsArray });
      navigate(`/blog/${blog._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="page">
      <div className="blog-form-container container fade-up">
        <div className="blog-form-header">
          <div>
            <p className="blog-form-eyebrow">✍ New Story</p>
            <h1>Write Something Amazing</h1>
          </div>
          <div className="blog-form-stats">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="blog-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Write a compelling title..."
              className="blog-form__title-input"
              required
            />
            <span className="form-hint">{form.title.length}/150 characters</span>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label htmlFor="excerpt">Short Excerpt <span className="optional">(optional)</span></label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="A brief summary shown on blog cards (auto-generated if left blank)..."
              rows={3}
              style={{ minHeight: 80 }}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Tell your story... Share your ideas, experiences, knowledge. The world is ready to read."
              className="blog-form__content-textarea"
              required
            />
          </div>

          {/* Cover Image & Category in a row */}
          <div className="blog-form__row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="coverImage">Cover Image URL <span className="optional">(optional)</span></label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
              {form.coverImage && (
                <div className="cover-preview">
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags <span className="optional">(comma-separated)</span></label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. react, javascript, web development"
            />
            {form.tags && (
              <div className="tags-preview">
                {form.tags.split(',').map((t, i) =>
                  t.trim() ? (
                    <span key={i} className="badge badge-accent">{t.trim()}</span>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="blog-form__actions">
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Publishing...
                </>
              ) : (
                '🚀 Publish Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;

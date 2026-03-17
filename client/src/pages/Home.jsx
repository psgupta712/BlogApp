// src/pages/Home.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { fetchBlogs } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other'];

const Home = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchBlogs({ page, search, category });
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    loadBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadBlogs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchInput('');
    setCategory('All');
  };

  return (
    <div className="page">
      {/* ── HERO ──────────────────────────────── */}
      <section className="hero container fade-up">
        <div className="hero__content">
          <p className="hero__eyebrow">✒ A space for ideas</p>
          <h1 className="hero__title">
            Stories that
            <br />
            <em>move</em> the world.
          </h1>
          <p className="hero__subtitle">
            Discover thoughtful essays, tutorials, and perspectives from writers around the world.
          </p>
          {!user && (
            <div className="hero__cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Writing Today →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <div className="hero__cta">
              <Link to="/create" className="btn btn-primary btn-lg">
                ✍ Write a New Post
              </Link>
            </div>
          )}
        </div>
        <div className="hero__decoration" aria-hidden="true">
          <div className="hero__ring hero__ring--1" />
          <div className="hero__ring hero__ring--2" />
          <div className="hero__ring hero__ring--3" />
          <div className="hero__glyph">✒</div>
        </div>
      </section>

      {/* ── FILTERS ───────────────────────────── */}
      <section className="filters container">
        {/* Search bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-bar__icon">🔍</span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, content, or tag..."
            className="search-bar__input"
          />
          {(search || searchInput) && (
            <button type="button" className="search-bar__clear" onClick={clearSearch}>✕</button>
          )}
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        {/* Category chips */}
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="results-info">
            {search || category !== 'All'
              ? `Found ${total} post${total !== 1 ? 's' : ''}`
              : `${total} published post${total !== 1 ? 's' : ''}`
            }
            {(search || category !== 'All') && (
              <button className="clear-filters" onClick={clearSearch}>Clear filters</button>
            )}
          </p>
        )}
      </section>

      {/* ── BLOG GRID ─────────────────────────── */}
      <section className="container">
        {loading && (
          <div className="loading-center">
            <div className="spinner" />
            <p>Loading stories...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ maxWidth: 500, margin: '0 auto' }}>
            {error}
            <button className="btn btn-sm" onClick={loadBlogs} style={{ marginLeft: 12 }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No stories found</h3>
            <p>
              {search || category !== 'All'
                ? 'Try different search terms or filters.'
                : 'Be the first to publish a story!'}
            </p>
            {(search || category !== 'All') && (
              <button className="btn btn-secondary" onClick={clearSearch} style={{ marginTop: 16 }}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <div className="pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination__btn ${p === page ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

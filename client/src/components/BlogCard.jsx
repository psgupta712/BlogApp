// src/components/BlogCard.jsx
import { Link } from 'react-router-dom';
import './BlogCard.css';

const CATEGORY_COLORS = {
  Technology: '#5b9bd5',
  Lifestyle:  '#c47ab5',
  Travel:     '#4caf82',
  Food:       '#e8784e',
  Health:     '#56b88e',
  Business:   '#e8a838',
  Education:  '#7b8fe8',
  Other:      '#888',
};

// Generate a deterministic gradient based on title (for posts without images)
const getTitleGradient = (title = '') => {
  const gradients = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #3d1c6e 100%)',
    'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0d2b0d 100%)',
    'linear-gradient(135deg, #1a100a 0%, #3a2010 50%, #2a1505 100%)',
    'linear-gradient(135deg, #0a0a1a 0%, #0d0d2e 50%, #14143e 100%)',
  ];
  const index = title.length % gradients.length;
  return gradients[index];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const readTime = (content = '') => {
  const words = content.split(' ').length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogCard = ({ blog }) => {
  const categoryColor = CATEGORY_COLORS[blog.category] || '#888';

  return (
    <article className="blog-card fade-up">
      {/* Cover Image or Gradient Placeholder */}
      <Link to={`/blog/${blog._id}`} className="blog-card__image-link">
        <div
          className="blog-card__image"
          style={{
            background: blog.coverImage ? undefined : getTitleGradient(blog.title),
          }}
        >
          {blog.coverImage ? (
            <img src={blog.coverImage} alt={blog.title} loading="lazy" />
          ) : (
            <div className="blog-card__image-placeholder">
              <span className="blog-card__image-letter">
                {blog.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Category Badge */}
          <span
            className="blog-card__category"
            style={{ color: categoryColor, borderColor: `${categoryColor}40`, background: `${categoryColor}15` }}
          >
            {blog.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="blog-card__body">
        <Link to={`/blog/${blog._id}`}>
          <h3 className="blog-card__title">{blog.title}</h3>
        </Link>

        <p className="blog-card__excerpt">
          {blog.excerpt || blog.content?.substring(0, 120) + '...'}
        </p>

        {/* Meta row */}
        <div className="blog-card__meta">
          <div className="blog-card__author">
            <div className="blog-card__avatar">
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{blog.author?.name || 'Anonymous'}</span>
          </div>
          <div className="blog-card__stats">
            <span>📖 {readTime(blog.content)} min</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

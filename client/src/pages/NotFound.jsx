// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="fade-up">
      <div style={{ fontSize: '8rem', lineHeight: 1, marginBottom: 20, opacity: 0.3, fontFamily: 'Playfair Display, serif', fontWeight: 900 }}>
        404
      </div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 12 }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
    </div>
  </div>
);

export default NotFound;

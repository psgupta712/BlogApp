// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add shadow when user scrolls
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✒</span>
          <span className="navbar__logo-text">Inkwell</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/create" className={`navbar__link ${location.pathname === '/create' ? 'active' : ''}`}>
                Write
              </Link>
              <Link to="/dashboard" className={`navbar__link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__welcome">
                Hello, <strong>{user.name.split(' ')[0]}</strong>
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <Link to="/" className="navbar__mobile-link">Home</Link>
        {user ? (
          <>
            <Link to="/create" className="navbar__mobile-link">✍ Write a Post</Link>
            <Link to="/dashboard" className="navbar__mobile-link">📊 Dashboard</Link>
            <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__mobile-link">Sign In</Link>
            <Link to="/register" className="navbar__mobile-link">Get Started →</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

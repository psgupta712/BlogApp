// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#e05c5c', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: '#e8a838', width: '50%' };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { label: 'Strong', color: '#4caf82', width: '100%' };
    return { label: 'Fair', color: '#5b9bd5', width: '75%' };
  };

  const strength = passwordStrength();

  return (
    <div className="page">
      <div className="auth-container fade-up">
        {/* Decorative panel */}
        <div className="auth-panel">
          <div className="auth-panel__content">
            <span className="auth-panel__icon">✒</span>
            <h2 className="auth-panel__title">Join Inkwell today.</h2>
            <p className="auth-panel__text">
              Share your ideas with the world. Create articles, grow your audience, and connect with readers who care.
            </p>
            <div className="auth-panel__features">
              <div className="auth-feature">✔ Free to publish</div>
              <div className="auth-feature">✔ Beautiful reading experience</div>
              <div className="auth-feature">✔ No ads, ever</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Sign in →</Link></p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />
              {strength && (
                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div
                      className="password-strength__fill"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Creating account...
                </>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

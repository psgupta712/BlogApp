// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to the page user was trying to visit, or home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container fade-up">
        {/* Decorative side panel */}
        <div className="auth-panel">
          <div className="auth-panel__content">
            <span className="auth-panel__icon">✒</span>
            <h2 className="auth-panel__title">Welcome back, writer.</h2>
            <p className="auth-panel__text">
              Your stories are waiting. Sign in to continue writing, editing, and inspiring readers.
            </p>
            <div className="auth-panel__quote">
              <blockquote>
                "There is no greater agony than bearing an untold story inside you."
              </blockquote>
              <cite>— Maya Angelou</cite>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Sign In</h1>
            <p>New here? <Link to="/register">Create an account →</Link></p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className="auth-demo-hint">
            💡 <strong>Demo:</strong> Register a new account to get started instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

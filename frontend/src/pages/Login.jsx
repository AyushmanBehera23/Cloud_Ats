import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'CANDIDATE') navigate('/dashboard');
      else if (user.role === 'RECRUITER') navigate('/recruiter');
      else navigate('/analytics');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="ui-card" style={{ width: '100%', maxWidth: 440, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="brand-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', margin: '0 auto 12px' }}>🌱</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Sign in to your CloudATS account</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--status-poor-bg)', color: 'var(--status-poor)', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Demo Credentials Box - Fixed Padding & Spacing */}
        <div style={{
          padding: '16px 20px',
          background: 'var(--primary-soft)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: 'var(--primary-dark)',
          marginBottom: 24,
          lineHeight: 1.6
        }}>
          <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>🔑 Demo credentials (password: <code>Password123!</code>):</strong>
          <div>• <strong>Admin:</strong> <code>admin@cloudats.dev</code></div>
          <div>• <strong>Recruiter:</strong> <code>recruiter1@cloudats.dev</code></div>
          <div>• <strong>Candidate:</strong> <code>candidate1@example.com</code></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Email address</label>
            <input
              type="email"
              className="search-input-wrapper"
              style={{ width: '100%', paddingLeft: 16, height: 42 }}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Password</label>
            <input
              type="password"
              className="search-input-wrapper"
              style={{ width: '100%', paddingLeft: 16, height: 42 }}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-forest" style={{ width: '100%', justifyContent: 'center', height: 44, marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}

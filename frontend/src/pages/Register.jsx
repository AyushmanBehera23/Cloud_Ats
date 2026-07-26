import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'CANDIDATE') navigate('/dashboard');
      else navigate('/recruiter');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="ui-card" style={{ width: '100%', maxWidth: 480, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="brand-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', margin: '0 auto 12px' }}>🌱</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Join CloudATS and optimize your career</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--status-poor-bg)', color: 'var(--status-poor)', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>First Name</label>
              <input type="text" className="search-input-wrapper" style={{ width: '100%', paddingLeft: 14, height: 40 }} placeholder="Priya" value={form.firstName} onChange={set('firstName')} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Last Name</label>
              <input type="text" className="search-input-wrapper" style={{ width: '100%', paddingLeft: 14, height: 40 }} placeholder="Sharma" value={form.lastName} onChange={set('lastName')} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Email address</label>
            <input type="email" className="search-input-wrapper" style={{ width: '100%', paddingLeft: 14, height: 40 }} placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Password</label>
            <input type="password" className="search-input-wrapper" style={{ width: '100%', paddingLeft: 14, height: 40 }} placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Phone (optional)</label>
            <input type="tel" className="search-input-wrapper" style={{ width: '100%', paddingLeft: 14, height: 40 }} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>I am a...</label>
            <select className="btn-soft" style={{ width: '100%', height: 40 }} value={form.role} onChange={set('role')}>
              <option value="CANDIDATE">Candidate (Job Seeker)</option>
              <option value="RECRUITER">Recruiter (Hiring Manager)</option>
            </select>
          </div>

          <button type="submit" className="btn-forest" style={{ width: '100%', justifyContent: 'center', height: 44, marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { IconStar, IconBuilding, IconPin } from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export default function CandidateShortlists() {
  const { user } = useAuth();
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.recruiter.getShortlists(user.id)
        .then(res => setShortlists(res || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="page-wrapper">
      {/* Banner Header with Visible Landscape */}
      <div style={{ position: 'relative', marginBottom: 28, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        <NatureBannerIllustration height={160} />
        <div style={{ position: 'absolute', top: 20, left: 24, right: 24, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(10px)',
            padding: '14px 22px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 4px 20px rgba(20, 34, 20, 0.06)',
            maxWidth: 480
          }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#12250E', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconStar size={24} color="var(--accent-gold)" />
              Shortlisted by Recruiters
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#26421F', fontWeight: 700 }}>
              Companies and hiring managers that have shortlisted your resume profile.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
        {shortlists.map((s, i) => (
          <div key={i} className="ui-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IconStar size={20} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{s.role}</h3>
                  <span className="badge-status badge-excellent">Shortlisted</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏢 <strong>{s.company}</strong></span>
                  <span>•</span>
                  <span>Recruiter: <strong>{s.recruiter}</strong></span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{s.date}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: 12, padding: 12, background: 'var(--bg-main)', borderRadius: 8 }}>
              💬 {s.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

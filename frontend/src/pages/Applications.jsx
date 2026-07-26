import { useState } from 'react';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { CompanyLogo } from '../components/CompanyLogos.jsx';
import { IconBriefcase, IconPin } from '../components/Icons.jsx';

export default function Applications() {
  const applications = [
    { company: 'Google', role: 'Cloud Engineer', status: 'In Review', badgeClass: 'badge-fair', date: '25 May, 2026', location: 'Mountain View, CA' },
    { company: 'Microsoft', role: 'DevOps Engineer', status: 'Shortlisted', badgeClass: 'badge-excellent', date: '23 May, 2026', location: 'Redmond, WA' },
    { company: 'Amazon', role: 'SDE Intern', status: 'Applied', badgeClass: 'badge-good', date: '20 May, 2026', location: 'Seattle, WA' },
    { company: 'Infosys', role: 'System Engineer', status: 'Applied', badgeClass: 'badge-good', date: '18 May, 2026', location: 'Bangalore, India' },
  ];

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
              <IconBriefcase size={24} color="#12250E" /> My Applications
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#26421F', fontWeight: 700 }}>
              Track active job applications and interview invitations.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
        {applications.map((item, i) => (
          <div key={i} className="ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                <CompanyLogo company={item.company} size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)' }}>{item.role}</h3>
                  <span className={`badge-status ${item.badgeClass}`}>{item.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏢 <strong>{item.company}</strong></span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <IconPin size={14} color="var(--primary-green)" /> {item.location}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Submitted on {item.date}</div>
              <button className="btn-forest-outline" style={{ fontSize: '0.75rem', marginTop: 8 }}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

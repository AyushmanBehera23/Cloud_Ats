import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IconLeaf, IconSearch, IconBell, IconUser, IconCheckCircle, IconX, IconBriefcase, IconFileText, IconSparkles } from './Icons.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const searchModalRef = useRef(null);

  const notificationsList = [
    { id: 1, title: 'Resume Parsed & Scored', desc: 'Your ATS Score for Cloud Engineer is 92%', time: '10m ago', unread: true },
    { id: 2, title: 'Shortlisted by Microsoft', desc: 'Microsoft shortlisted your application for Cloud DevOps Engineer', time: '1h ago', unread: true },
    { id: 3, title: 'New Job Match Found', desc: '3 new Backend Java positions match your skill profile', time: '3h ago', unread: true },
  ];

  const searchableItems = [
    { type: 'Page', title: 'Upload Resume & Parse', path: '/upload', desc: 'Upload PDF/DOCX for AI scoring' },
    { type: 'Page', title: 'Job Matches', path: '/job-matches', desc: 'View matched job postings' },
    { type: 'Page', title: 'My Scores History', path: '/scores', desc: 'Historical ATS dimension breakdown' },
    { type: 'Page', title: 'Applications Tracker', path: '/applications', desc: 'Track job application status' },
    { type: 'Page', title: 'Shortlisted Candidates', path: '/shortlists', desc: 'Recruiter shortlisted profiles' },
    { type: 'Page', title: 'System Health & Metrics', path: '/system', desc: 'Microservices & PostgreSQL pool' },
    { type: 'Job', title: 'Senior Cloud Native Engineer', path: '/job-matches', desc: 'CloudATS Enterprise • Java, K8s, AWS' },
    { type: 'Job', title: 'DevOps Engineer (Redmond)', path: '/job-matches', desc: 'Microsoft • CI/CD, Docker, Azure' },
    { type: 'Skill', title: 'Java & Spring Boot Specialization', path: '/upload', desc: 'Score resume against Java Developer role' },
    { type: 'Skill', title: 'AWS & Kubernetes Cloud Stack', path: '/upload', desc: 'Score resume against Cloud Engineer role' },
  ];

  const filteredSearch = searchQuery.trim() === ''
    ? searchableItems
    : searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Global ⌘K keyboard listener
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (searchModalRef.current && !searchModalRef.current.contains(e.target)) {
        setShowSearchModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleSelectResult = (path) => {
    setShowSearchModal(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="navbar-custom">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <IconLeaf size={20} color="#FFFFFF" />
          </div>
          <span>Cloud<span style={{ color: 'var(--primary-green)' }}>ATS</span></span>
        </Link>

        {/* Center Navigation Pills */}
        {user ? (
          <div className="nav-pill-container">
            {user.role === 'CANDIDATE' && (
              <>
                <button className={`nav-pill-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
                <button className={`nav-pill-item ${isActive('/upload') ? 'active' : ''}`} onClick={() => navigate('/upload')}>
                  Upload Resume
                </button>
                <button className={`nav-pill-item ${isActive('/scores') ? 'active' : ''}`} onClick={() => navigate('/scores')}>
                  My Scores
                </button>
                <button className={`nav-pill-item ${isActive('/job-matches') || isActive('/jobs') ? 'active' : ''}`} onClick={() => navigate('/job-matches')}>
                  Job Matches
                </button>
                <button className={`nav-pill-item ${isActive('/applications') ? 'active' : ''}`} onClick={() => navigate('/applications')}>
                  Applications
                </button>
                <button className={`nav-pill-item ${isActive('/shortlists') ? 'active' : ''}`} onClick={() => navigate('/shortlists')}>
                  Shortlisted
                </button>
              </>
            )}

            {user.role === 'RECRUITER' && (
              <>
                <button className={`nav-pill-item ${isActive('/recruiter') ? 'active' : ''}`} onClick={() => navigate('/recruiter')}>
                  Candidates
                </button>
                <button className={`nav-pill-item ${isActive('/jobs') ? 'active' : ''}`} onClick={() => navigate('/jobs')}>
                  Job Posts
                </button>
                <button className={`nav-pill-item ${isActive('/shortlists') ? 'active' : ''}`} onClick={() => navigate('/shortlists')}>
                  Shortlists
                </button>
                <button className={`nav-pill-item ${isActive('/analytics') ? 'active' : ''}`} onClick={() => navigate('/analytics')}>
                  Analytics
                </button>
              </>
            )}

            {user.role === 'ADMIN' && (
              <>
                <button className={`nav-pill-item ${isActive('/analytics') ? 'active' : ''}`} onClick={() => navigate('/analytics')}>
                  Overview
                </button>
                <button className={`nav-pill-item ${isActive('/users') ? 'active' : ''}`} onClick={() => navigate('/users')}>
                  Users
                </button>
                <button className={`nav-pill-item ${isActive('/jobs') ? 'active' : ''}`} onClick={() => navigate('/jobs')}>
                  Jobs
                </button>
                <button className={`nav-pill-item ${isActive('/resumes') ? 'active' : ''}`} onClick={() => navigate('/resumes')}>
                  Resumes
                </button>
                <button className={`nav-pill-item ${isActive('/analytics') ? 'active' : ''}`} onClick={() => navigate('/analytics')}>
                  Analytics
                </button>
                <button className={`nav-pill-item ${isActive('/system') ? 'active' : ''}`} onClick={() => navigate('/system')}>
                  System
                </button>
              </>
            )}
          </div>
        ) : null}

        {/* Right Search & Profile Widget */}
        <div className="header-actions">
          {user ? (
            <>
              {/* Working Search Input Trigger */}
              <div className="search-input-wrapper" onClick={() => setShowSearchModal(true)} style={{ cursor: 'pointer' }}>
                <span className="search-icon-left"><IconSearch size={14} color="var(--text-light)" /></span>
                <input
                  type="text"
                  placeholder="Search candidates, skills, jobs..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearchModal(true); }}
                  onClick={() => setShowSearchModal(true)}
                />
                <span className="search-shortcut-right">⌘K</span>
              </div>

              {/* Notification Bell Button & Popover */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <div
                  className="icon-btn-circle"
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: showNotifications ? 'var(--primary-soft)' : 'var(--bg-main)' }}
                >
                  <IconBell size={18} color="var(--text-title)" />
                  <span className="badge-dot-notification">3</span>
                </div>

                {showNotifications && (
                  <div className="ui-card" style={{
                    position: 'absolute', right: 0, top: 48, width: 340, padding: 16, zIndex: 1000,
                    boxShadow: '0 10px 30px rgba(20,34,20,0.15)', border: '1px solid var(--border-strong)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-green)', cursor: 'pointer', fontWeight: 700 }}>Mark all as read</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {notificationsList.map(n => (
                        <div key={n.id} style={{ padding: 10, background: 'var(--bg-main)', borderRadius: 8, borderLeft: '3px solid var(--primary-green)' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-title)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: 4 }}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="user-profile-widget" onClick={handleLogout} title="Click to Logout">
                <div className="avatar-placeholder">
                  {user.firstName ? user.firstName[0].toUpperCase() : (user.fullName ? user.fullName[0].toUpperCase() : 'A')}
                </div>
                <div className="user-meta">
                  <span className="user-meta-name">
                    {user.firstName || user.fullName?.split(' ')[0] || 'Ayushman'} {user.lastName || user.fullName?.split(' ').slice(1).join(' ') || 'Behera'}
                  </span>
                  <span className="user-meta-role">
                    {user.role === 'ADMIN' ? 'Super Admin' : user.role === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" className="btn-forest-outline">Sign In</Link>
              <Link to="/register" className="btn-forest">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      {/* WORKING INTERACTIVE SEARCH COMMAND PALETTE MODAL */}
      {showSearchModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(20,34,20,0.4)', backdropFilter: 'blur(6px)',
          zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 100
        }}>
          <div ref={searchModalRef} className="ui-card" style={{ width: '100%', maxWidth: 580, padding: 0, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            {/* Modal Search Input Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <IconSearch size={20} color="var(--primary-green)" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search pages, skills, job postings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', marginLeft: 14, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-title)' }}
              />
              <button onClick={() => setShowSearchModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <IconX size={20} />
              </button>
            </div>

            {/* Modal Results List */}
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: 12 }}>
              {filteredSearch.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectResult(item.path)}
                    style={{
                      padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', transition: 'all 0.15s ease', marginBottom: 4
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-soft)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge-status badge-excellent" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{item.type}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-title)' }}>{item.title}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-green)' }}>Jump to →</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '10px 20px', background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Press <kbd style={{ padding: '2px 6px', background: '#fff', borderRadius: 4, border: '1px solid #ccc' }}>ESC</kbd> to close</span>
              <span>Use <kbd style={{ padding: '2px 6px', background: '#fff', borderRadius: 4, border: '1px solid #ccc' }}>⌘K</kbd> anytime</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

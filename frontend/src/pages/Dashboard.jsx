import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { CompanyLogo } from '../components/CompanyLogos.jsx';
import { IconTrendingUp, IconFileText, IconBriefcase, IconPhone, IconCheckCircle, IconChevronRight, IconTarget, IconStar, IconHandWave } from '../components/Icons.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [scores, setScores] = useState([]);
  const [liveJobs, setLiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    let localScores = null;
    try {
      const stored = localStorage.getItem('cloudats_user_scores');
      if (stored !== null) {
        localScores = JSON.parse(stored);
      }
    } catch (e) {}

    if (!user) return;
    Promise.all([
      api.resumes.getForUser(user.id).catch(() => []),
      api.scores.forUser(user.id).catch(() => []),
      api.recruiter.getJobs().catch(() => []),
    ]).then(([r, s, j]) => {
      const finalScoresList = localScores !== null ? localScores : (s || []);
      setScores(finalScoresList);

      const adminResumes = JSON.parse(localStorage.getItem('cloudats_admin_resumes') || '[]');
      if (localScores !== null) {
        setResumes(finalScoresList);
      } else {
        setResumes(r || []);
      }
      setLiveJobs(j || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const bestScore = scores.length > 0
    ? Math.max(...scores.map(s => s.score || s.overallScore || 0))
    : 0;

  const avgScore = scores.length > 0
    ? (scores.reduce((acc, s) => acc + (s.score || s.overallScore || 0), 0) / scores.length).toFixed(1)
    : '0';

  const latestScore = scores.length > 0 ? scores[0] : null;
  const overviewOverall = latestScore ? Math.round(latestScore.score || latestScore.overallScore || 0) : 0;
  const overviewContent = latestScore ? (latestScore.content !== undefined ? Math.round((latestScore.content / 40) * 100) : 0) : 0;
  const overviewSkills = latestScore ? (latestScore.skills !== undefined ? Math.round((latestScore.skills / 30) * 100) : 0) : 0;
  const overviewFormat = latestScore ? (latestScore.format !== undefined ? Math.round((latestScore.format / 20) * 100) : 0) : 0;
  const overviewRelevance = latestScore ? (latestScore.relevance !== undefined ? Math.round((latestScore.relevance / 10) * 100) : 0) : 0;
  const overviewBadge = overviewOverall >= 80 ? 'Strong' : overviewOverall >= 60 ? 'Good' : overviewOverall > 0 ? 'Fair' : 'No Data';

  const scoreDataPoints = scores.length > 0
    ? scores.map((s, idx) => ({
        day: s.spec ? s.spec.replace(/_/g, ' ') : `Report #${idx + 1}`,
        val: s.score || s.overallScore || 60,
        x: 30 + (idx * 50),
        y: Math.max(10, 110 - ((s.score || s.overallScore || 60) * 0.8))
      }))
    : [
        { day: 'No Data', val: 0, x: 165, y: 110 }
      ];

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader" />
    </div>
  );

  const currentHovered = hoveredIdx !== null ? scoreDataPoints[hoveredIdx] : scoreDataPoints[scoreDataPoints.length - 1];

  return (
    <div className="page-wrapper">
      {/* Welcome Illustrated Banner with Visible Landscape */}
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
            maxWidth: 520
          }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#12250E', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              Good afternoon, {user?.firstName || user?.fullName?.split(' ')[0] || 'Ayushman'}!
              <IconHandWave size={22} color="var(--primary-green)" />
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#26421F', fontWeight: 700 }}>
              You're making great progress towards your dream role.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/upload" className="btn-forest" style={{ fontSize: '0.85rem', boxShadow: '0 4px 14px rgba(45,90,39,0.3)' }}>Upload Resume →</Link>
          </div>
        </div>
      </div>

      {/* Top Row Stat Cards */}
      <div className="metric-grid-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Average ATS Score</span>
            <div className="metric-icon-box"><IconTrendingUp size={18} /></div>
          </div>
          <div className="metric-value">{avgScore}</div>
          <div className="metric-trend trend-up">
            ↑ Live PostgreSQL Query
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Resumes Analyzed</span>
            <div className="metric-icon-box"><IconFileText size={18} /></div>
          </div>
          <div className="metric-value">{resumes.length}</div>
          <div className="metric-trend trend-up">
            ↑ Live DB Storage
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Job Postings</span>
            <div className="metric-icon-box"><IconBriefcase size={18} /></div>
          </div>
          <div className="metric-value">{liveJobs.length || 1}</div>
          <div className="metric-trend trend-up">
            ↑ Recruiter DB
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Interview Calls</span>
            <div className="metric-icon-box"><IconPhone size={18} /></div>
          </div>
          <div className="metric-value">5</div>
          <div className="metric-trend trend-up">
            ↑ Active Shortlists
          </div>
        </div>
      </div>

      {/* Balanced 2-Column Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left Column (Main Content Area) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Score Trend Chart with Interactive Hover Tooltip */}
            <div className="ui-card">
              <div className="ui-card-header">
                <span className="ui-card-title">Score Trend</span>
                <span className="badge-status badge-excellent">Live</span>
              </div>

              <div style={{ padding: '8px 0', position: 'relative' }}>
                <svg viewBox="0 0 310 145" style={{ width: '100%', height: 160, display: 'block' }}>
                  <defs>
                    <linearGradient id="scoreFillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2D5A27" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="30" y1="20" x2="300" y2="20" stroke="#E4EAE0" strokeDasharray="3,3" />
                  <text x="5" y="23" fill="#6B7280" fontSize="8.5" fontWeight="700">80</text>

                  <line x1="30" y1="50" x2="300" y2="50" stroke="#E4EAE0" strokeDasharray="3,3" />
                  <text x="5" y="53" fill="#6B7280" fontSize="8.5" fontWeight="700">60</text>

                  <line x1="30" y1="80" x2="300" y2="80" stroke="#E4EAE0" strokeDasharray="3,3" />
                  <text x="5" y="83" fill="#6B7280" fontSize="8.5" fontWeight="700">40</text>

                  <line x1="30" y1="110" x2="300" y2="110" stroke="#CDD6C8" strokeWidth="1" />
                  <text x="5" y="113" fill="#6B7280" fontSize="8.5" fontWeight="700">20</text>

                  <path d="M 30,110 L 30,85 Q 75,70 120,55 T 210,48 T 300,35 L 300,110 Z" fill="url(#scoreFillGrad)" />
                  <path d="M 30,85 Q 75,70 120,55 T 210,48 T 300,35" fill="none" stroke="var(--primary-green)" strokeWidth="3.2" strokeLinecap="round" />

                  <line x1={currentHovered.x} y1="20" x2={currentHovered.x} y2="110" stroke="var(--primary-green)" strokeWidth="1.5" strokeDasharray="3,3" />

                  {scoreDataPoints.map((pt, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                      <circle cx={pt.x} cy={pt.y} r={hoveredIdx === idx ? "6.5" : "4"} fill="var(--primary-green)" stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  ))}

                  <g transform={`translate(${Math.min(Math.max(currentHovered.x - 30, 5), 235)}, ${Math.max(currentHovered.y - 30, 2)})`}>
                    <rect x="0" y="0" width="60" height="22" rx="6" fill="var(--primary-dark)" />
                    <text x="30" y="14" fill="#FFFFFF" fontSize="9.5" fontWeight="800" textAnchor="middle">
                      {currentHovered.val} ATS
                    </text>
                  </g>

                  {scoreDataPoints.map((dp, i) => (
                    <text key={i} x={dp.x} y="128" fill={hoveredIdx === i ? "var(--primary-green)" : "#4B5563"} fontSize="8.5" fontWeight={hoveredIdx === i ? "800" : "700"} textAnchor="middle">
                      {dp.day}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Resume Analysis Overview */}
            <div className="ui-card">
              <div className="ui-card-header">
                <span className="ui-card-title">Resume Analysis Overview</span>
                <span className={`badge-status ${scores.length > 0 && overviewOverall >= 80 ? 'badge-excellent' : scores.length > 0 && overviewOverall >= 60 ? 'badge-good' : 'badge-fair'}`}>
                  {scores.length > 0 ? `${overviewBadge} ${overviewOverall}%` : 'No Scores'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative', width: 95, height: 95, flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: 95, height: 95, transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E4EAE0" strokeWidth="3.8" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--primary-green)" strokeWidth="3.8" strokeDasharray={`${overviewOverall}, 100`} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-dark)' }}>{overviewOverall}%</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Overall</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {[
                    { name: 'Content', val: overviewContent, status: overviewContent >= 75 ? 'Good' : overviewContent >= 50 ? 'Fair' : 'Needs Work', badgeClass: overviewContent >= 75 ? 'badge-good' : 'badge-fair' },
                    { name: 'Skills', val: overviewSkills, status: overviewSkills >= 75 ? 'Excellent' : overviewSkills >= 40 ? 'Good' : 'Needs Work', badgeClass: overviewSkills >= 75 ? 'badge-excellent' : overviewSkills >= 40 ? 'badge-good' : 'badge-fair' },
                    { name: 'Format', val: overviewFormat, status: overviewFormat >= 80 ? 'Good' : 'Fair', badgeClass: overviewFormat >= 80 ? 'badge-good' : 'badge-fair' },
                    { name: 'Relevance', val: overviewRelevance, status: overviewRelevance >= 70 ? 'Good' : 'Fair', badgeClass: overviewRelevance >= 70 ? 'badge-good' : 'badge-fair' },
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>{d.name} ({d.val}%)</span>
                        <span className={`badge-status ${d.badgeClass}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{d.status}</span>
                      </div>
                      <div className="progress-bar-bg" style={{ height: 5 }}>
                        <div className="progress-bar-fill" style={{ width: `${d.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14, textAlign: 'right' }}>
                <Link to="/upload" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-green)' }}>View Full Analysis →</Link>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Applications & Top Job Matches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Recent Applications */}
            <div className="ui-card">
              <div className="ui-card-header">
                <span className="ui-card-title">Recent Applications</span>
                <Link to="/applications" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-green)' }}>View All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { company: 'Google', role: 'Cloud Engineer', status: 'In Review', date: '25 May, 2026', badgeClass: 'badge-fair' },
                  { company: 'Microsoft', role: 'DevOps Engineer', status: 'Shortlisted', date: '23 May, 2026', badgeClass: 'badge-excellent' },
                  { company: 'Amazon', role: 'SDE Intern', status: 'Applied', date: '20 May, 2026', badgeClass: 'badge-good' },
                  { company: 'Infosys', role: 'System Engineer', status: 'Applied', date: '18 May, 2026', badgeClass: 'badge-good' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none', paddingBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFFFFF', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                        <CompanyLogo company={item.company} size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-title)' }}>{item.company}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{item.role}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge-status ${item.badgeClass}`}>{item.status}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: 4 }}>Applied on {item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Job Matches */}
            <div className="ui-card">
              <div className="ui-card-header">
                <span className="ui-card-title">Top Job Matches</span>
                <Link to="/job-matches" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-green)' }}>View All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { company: 'Microsoft', role: 'Cloud DevOps Engineer', match: 92 },
                  { company: 'Amazon', role: 'Backend Developer', match: 85 },
                  { company: 'Google', role: 'SRE Engineer', match: 81 },
                  { company: 'IBM', role: 'Cloud Engineer', match: 73 },
                ].map((job, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFFFFF', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                      <CompanyLogo company={job.company} size={24} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--text-title)' }}>{job.role}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 6 }}>• {job.company}</span>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{job.match}% Match</span>
                      </div>
                      <div className="progress-bar-bg" style={{ height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${job.match}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Your ATS Score Breakdown Card */}
          <div className="ui-card text-center">
            <div className="ui-card-header">
              <span className="ui-card-title">Your ATS Score</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <div className="score-circle-ring" style={{ width: 100, height: 100, fontSize: '1.6rem' }}>
                {bestScore}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', marginTop: 16 }}>
              {[
                { label: 'Content', score: 78 },
                { label: 'Skills', score: 85 },
                { label: 'Format', score: 70 },
                { label: 'Relevance', score: 55 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>• {item.label}</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-title)' }}>{item.score}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions Card */}
          <div className="ui-card">
            <div className="ui-card-header">
              <span className="ui-card-title">AI Suggestions</span>
              <span className="badge-status badge-excellent">4 Pending</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Add more quantified achievements', desc: 'Include metrics (e.g., "Reduced latency by 35%")', impact: '+12 pts' },
                { title: 'Include target role keywords', desc: 'Add Kubernetes, Terraform, and CI/CD to skills.', impact: '+8 pts' },
                { title: 'Organize skills section', desc: 'Group skills by Cloud, Backend, and DevOps tools.', impact: '+5 pts' },
                { title: 'Enhance summary section', desc: 'Craft a 3-line executive summary with metrics.', impact: '+4 pts' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-title)' }}>{s.title}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-green)', background: 'var(--primary-soft)', padding: '2px 6px', borderRadius: 4 }}>
                      {s.impact}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-body)', margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

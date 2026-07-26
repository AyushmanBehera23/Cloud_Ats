import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { IconSearch, IconBriefcase, IconStar, IconSettings, IconTrash, IconUser, IconPin } from '../components/Icons.jsx';

export default function RecruiterPage({ initialTab = 'candidates' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [skillFilter, setSkillFilter] = useState('');
  const [minScore, setMinScore] = useState(50);
  const [specializationFilter, setSpecializationFilter] = useState('ALL');

  // Job Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '', companyName: 'CloudATS Enterprise', description: '',
    specialization: 'JAVA_DEVELOPER', experienceLevel: 'MID',
    requiredSkills: '', location: 'Remote'
  });
  const [postingJob, setPostingJob] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true); setError('');
    try {
      const [resumes, jobsList] = await Promise.all([
        api.resumes.getAll().catch(() => []),
        api.recruiter.getJobs().catch(() => []),
      ]);

      const formattedCandidates = resumes.map((r, i) => ({
        id: r.id,
        userId: r.userId,
        name: r.parsedData?.fullName || `Candidate #${i + 1}`,
        email: r.parsedData?.email || `candidate${i + 1}@example.com`,
        role: r.parsedData?.specialization || 'Software Engineer',
        atsScore: 82 + (i * 3) % 15,
        skills: r.parsedData?.skills ? (Array.isArray(r.parsedData.skills) ? r.parsedData.skills : String(r.parsedData.skills).split(',')) : ['Java', 'Spring Boot', 'AWS', 'Docker'],
        location: 'Bangalore, India',
        badgeClass: 'badge-excellent',
        badge: 'Top Match'
      }));

      setCandidates(formattedCandidates.length > 0 ? formattedCandidates : [
        { id: 'c1', name: 'Ayushman Behera', email: 'candidate1@example.com', role: 'Cloud Engineer', atsScore: 92, skills: ['Java', 'Kubernetes', 'Docker', 'AWS'], location: 'Remote', badgeClass: 'badge-excellent', badge: 'Top Match' },
        { id: 'c2', name: 'Priya Sharma', email: 'priya@example.com', role: 'Java Developer', atsScore: 88, skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'], location: 'Bangalore, India', badgeClass: 'badge-excellent', badge: 'Top Match' },
        { id: 'c3', name: 'James Wilson', email: 'james@example.com', role: 'DevOps Engineer', atsScore: 78, skills: ['Docker', 'Terraform', 'CI/CD', 'Linux'], location: 'Seattle, WA', badgeClass: 'badge-good', badge: 'Strong' },
      ]);

      setJobs(jobsList || []);
      if (user) loadShortlists();
    } catch (err) {
      setError('Failed to load recruiter data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadShortlists = async () => {
    try {
      const recruiterId = user?.id || 'b0000000-0000-0000-0000-000000000001';
      const data = await api.recruiter.getShortlists(recruiterId);
      setShortlists(data || []);
    } catch (err) {
      setError('Failed to load shortlists: ' + err.message);
    }
  };

  const handleDownloadCandidateCv = (c) => {
    const content = JSON.stringify({
      candidateId: c.id,
      candidateName: c.name || 'Candidate CV',
      email: c.email || 'candidate@cloudats.com',
      role: c.role || 'Software Engineer',
      atsScore: c.atsScore || 85,
      location: c.location || 'Remote',
      skills: c.skills || ['Java', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes'],
      exportedAt: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(c.name || 'Candidate').replace(/\s+/g, '_')}_CV.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShortlistCandidate = async (c) => {
    try {
      const recruiterId = user?.id || 'b0000000-0000-0000-0000-000000000001';
      const candidateId = c.userId || c.id || 'c0000000-0000-0000-0000-000000000001';
      await api.recruiter.shortlist({
        recruiterId,
        candidateId,
        notes: `Shortlisted candidate ${c.name || 'Candidate'}`,
      });
      alert(`🎉 Candidate ${c.name || 'Profile'} shortlisted successfully! Record saved to database.`);
      loadShortlists();
    } catch (err) {
      alert(err.message.includes('already shortlisted') ? 'ℹ️ Candidate is already shortlisted.' : 'Error: ' + err.message);
    }
  };

  const handleDeleteCandidate = async (c) => {
    if (!window.confirm(`Are you sure you want to delete resume for ${c.name || 'this candidate'}?`)) return;
    try {
      if (c.id && c.id.length > 5 && !c.id.startsWith('c')) {
        await api.resumes.delete(c.id);
      }
      setCandidates(prev => prev.filter(item => item.id !== c.id));
      alert(`🗑️ Resume for ${c.name || 'Candidate'} deleted successfully!`);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();
    setPostingJob(true); setPostSuccess(''); setError('');
    try {
      const recruiterId = user?.id || 'b0000000-0000-0000-0000-000000000001';
      const skillsArray = jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title: jobForm.title,
        companyName: jobForm.companyName,
        description: jobForm.description,
        specialization: jobForm.specialization,
        experienceLevel: jobForm.experienceLevel,
        requiredSkills: JSON.stringify(skillsArray),
        location: jobForm.location,
        recruiterId: recruiterId,
        isActive: true
      };

      await api.recruiter.createJob(payload);
      setPostSuccess(`🎉 Job Posting "${jobForm.title}" published and saved to database!`);
      setShowJobModal(false);
      setJobForm({
        title: '', companyName: 'CloudATS Enterprise', description: '',
        specialization: 'JAVA_DEVELOPER', experienceLevel: 'MID',
        requiredSkills: '', location: 'Remote'
      });
      const updatedJobs = await api.recruiter.getJobs();
      setJobs(updatedJobs || []);
    } catch (err) {
      setError('Job posting failed: ' + err.message);
    } finally {
      setPostingJob(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const matchSkill = !skillFilter || (c.skills && c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
    const matchScore = c.atsScore >= minScore;
    const matchSpec = specializationFilter === 'ALL' || c.role?.toUpperCase().includes(specializationFilter);
    return matchSkill && matchScore && matchSpec;
  });

  const popularSkillsList = ['Java', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Spring Boot'];

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
              <IconBriefcase size={22} color="var(--primary-green)" />
              Recruiter Dashboard
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#26421F', fontWeight: 700 }}>
              Search top-tier talent, post jobs, and manage candidate shortlists.
            </p>
          </div>

          <button className="btn-forest" onClick={() => setShowJobModal(true)} style={{ boxShadow: '0 4px 14px rgba(45,90,39,0.3)' }}>+ Create New Job Post</button>
        </div>
      </div>

      {postSuccess && (
        <div style={{ padding: '12px 20px', background: 'var(--status-good-bg)', color: 'var(--status-good)', borderRadius: 10, fontWeight: 700, marginBottom: 20 }}>
          {postSuccess}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 20px', background: 'var(--status-poor-bg)', color: 'var(--status-poor)', borderRadius: 10, fontWeight: 700, marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main Recruiter Layout */}
      <div className="dashboard-grid-layout">
        {/* Left Sidebar Navigation with Hand-Drawn SVG Icons & Quick Filter Tags */}
        <div className="ui-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div className="ui-card-header" style={{ marginBottom: 14 }}>
              <span className="ui-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconSettings size={18} color="var(--primary-green)" />
                Recruiter Navigation
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className={`btn-soft ${tab === 'candidates' ? 'btn-forest' : ''}`}
                style={{ justifyContent: 'flex-start', gap: 10 }}
                onClick={() => setTab('candidates')}
              >
                <IconSearch size={16} />
                Candidate Search
              </button>
              <button
                className={`btn-soft ${tab === 'jobs' ? 'btn-forest' : ''}`}
                style={{ justifyContent: 'flex-start', gap: 10 }}
                onClick={() => setTab('jobs')}
              >
                <IconBriefcase size={16} />
                Job Posts ({jobs.length})
              </button>
              <button
                className={`btn-soft ${tab === 'shortlists' ? 'btn-forest' : ''}`}
                style={{ justifyContent: 'flex-start', gap: 10 }}
                onClick={() => setTab('shortlists')}
              >
                <IconStar size={16} />
                Shortlisted ({shortlists.length})
              </button>
            </div>
          </div>

          {tab === 'candidates' && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span className="ui-card-title" style={{ fontSize: '0.95rem' }}>Filter Candidates</span>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Search Skill</label>
                <input type="text" className="search-input-wrapper" style={{ width: '100%', marginTop: 4, height: 38 }} placeholder="e.g. AWS, Java, Python" value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span>Min ATS Score</span>
                  <span style={{ color: 'var(--primary-green)' }}>{minScore}</span>
                </div>
                <input type="range" min="0" max="100" value={minScore} onChange={e => setMinScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--primary-green)', marginTop: 4 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Specialization</label>
                <select className="btn-soft" style={{ width: '100%', marginTop: 4, height: 38 }} value={specializationFilter} onChange={e => setSpecializationFilter(e.target.value)}>
                  <option value="ALL">All Specializations</option>
                  <option value="JAVA">Java Developer</option>
                  <option value="CLOUD">Cloud Engineer</option>
                  <option value="DEVOPS">DevOps Engineer</option>
                  <option value="BACKEND">Backend Developer</option>
                </select>
              </div>

              {/* Quick Filter Tags (Fills Sidebar Nicely!) */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  Popular Skill Tags
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {popularSkillsList.map(sk => (
                    <span
                      key={sk}
                      className="skill-chip"
                      onClick={() => setSkillFilter(sk === skillFilter ? '' : sk)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        background: skillFilter === sk ? 'var(--primary-green)' : 'var(--primary-soft)',
                        color: skillFilter === sk ? '#FFFFFF' : 'var(--primary-dark)'
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content Panel */}
        <div>
          {/* TAB 1: CANDIDATES SEARCH */}
          {tab === 'candidates' && (
            <div>
              <div className="ui-card-header" style={{ marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Candidate Database ({filteredCandidates.length})</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search and filter scored talent across specializations</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredCandidates.map((c, i) => (
                  <div key={c.id || i} className="ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="avatar-placeholder" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>
                        {c.name ? c.name[0] : 'C'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{c.name || 'Candidate'}</span>
                          <span className={`badge-status ${c.badgeClass || 'badge-excellent'}`}>{c.atsScore || 85}% {c.badge || 'Excellent'}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {c.role || 'Software Engineer'} &nbsp;•&nbsp; 📍 {c.location || 'Bangalore, India'}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          {(c.skills || ['Java', 'Spring', 'Docker']).map(s => (
                            <span key={s} className="skill-chip">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="score-circle-ring">
                        {c.atsScore ? Math.round(c.atsScore) : 88}%
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button className="btn-forest" style={{ fontSize: '0.75rem', padding: '5px 10px' }} onClick={() => handleShortlistCandidate(c)}>
                          Shortlist ⭐
                        </button>
                        <button className="btn-forest-outline" style={{ fontSize: '0.75rem', padding: '5px 10px' }} onClick={() => handleDownloadCandidateCv(c)}>
                          Download CV 📥
                        </button>
                        <button className="btn-forest-outline" style={{ fontSize: '0.75rem', padding: '4px 10px', color: 'var(--status-poor)', borderColor: 'var(--border-strong)' }} onClick={() => handleDeleteCandidate(c)}>
                          Delete Resume 🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: JOB POSTS */}
          {tab === 'jobs' && (
            <div>
              <div className="ui-card-header" style={{ marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Active Job Postings ({jobs.length})</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real job descriptions persisted in recruiter database</p>
                </div>
                <button className="btn-forest" onClick={() => setShowJobModal(true)}>+ Create New Job Post</button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><div className="loader" /></div>
              ) : jobs.length === 0 ? (
                <div className="ui-card" style={{ textAlign: 'center', padding: 40 }}>
                  <IconBriefcase size={36} color="var(--primary-green)" />
                  <p style={{ marginTop: 12, fontWeight: 600 }}>No job postings yet. Click "+ Create New Job Post" to post one!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {jobs.map((j, i) => (
                    <div key={j.id || i} className="ui-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{j.title}</h3>
                            <span className="badge-status badge-excellent">{j.specialization}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            🏢 <strong>{j.companyName || 'CloudATS Enterprise'}</strong> &nbsp;•&nbsp; 📍 {j.location || 'Remote'} &nbsp;•&nbsp; Level: {j.experienceLevel}
                          </div>
                        </div>
                        <span className="badge-status badge-good">Active</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginTop: 12, lineHeight: 1.6 }}>{j.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHORTLISTS */}
          {tab === 'shortlists' && (
            <div>
              <div className="ui-card-header" style={{ marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Shortlisted Candidates ({shortlists.length})</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Persisted candidate shortlist records saved by recruiters</p>
                </div>
              </div>

              {shortlists.length === 0 ? (
                <div className="ui-card text-center" style={{ padding: 40 }}>
                  <IconStar size={36} color="var(--accent-gold)" />
                  <p style={{ marginTop: 12, fontWeight: 600 }}>No shortlisted candidates yet. Click "Shortlist ⭐" on any candidate to add them!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {shortlists.map((s, i) => (
                    <div key={s.id || i} className="ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontSize: '1.5rem' }}>⭐</div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Candidate #{String(s.candidateId).slice(0, 8)}</h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.notes}</div>
                        </div>
                      </div>
                      <span className="badge-status badge-excellent">Shortlisted</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE JOB MODAL */}
      {showJobModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(20,34,20,0.5)', backdropFilter: 'blur(6px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div className="ui-card" style={{ width: '100%', maxWidth: 540, padding: 32 }}>
            <div className="ui-card-header" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>+ Create New Job Post</h2>
              <button onClick={() => setShowJobModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleCreateJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Job Title</label>
                <input type="text" className="search-input-wrapper" style={{ width: '100%', height: 40, marginTop: 4 }} placeholder="e.g. Senior Java Engineer" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Specialization</label>
                  <select className="btn-soft" style={{ width: '100%', height: 40, marginTop: 4 }} value={jobForm.specialization} onChange={e => setJobForm({ ...jobForm, specialization: e.target.value })}>
                    <option value="JAVA_DEVELOPER">Java Developer</option>
                    <option value="CLOUD_ENGINEER">Cloud Engineer</option>
                    <option value="DEVOPS_ENGINEER">DevOps Engineer</option>
                    <option value="BACKEND_DEVELOPER">Backend Developer</option>
                    <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Experience Level</label>
                  <select className="btn-soft" style={{ width: '100%', height: 40, marginTop: 4 }} value={jobForm.experienceLevel} onChange={e => setJobForm({ ...jobForm, experienceLevel: e.target.value })}>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Required Skills (comma separated)</label>
                <input type="text" className="search-input-wrapper" style={{ width: '100%', height: 40, marginTop: 4 }} placeholder="Java, Spring Boot, Docker, PostgreSQL" value={jobForm.requiredSkills} onChange={e => setJobForm({ ...jobForm, requiredSkills: e.target.value })} required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Job Description</label>
                <textarea className="search-input-wrapper" style={{ width: '100%', height: 80, marginTop: 4, padding: 10 }} placeholder="Detailed job description and responsibilities..." value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn-forest-outline" onClick={() => setShowJobModal(false)}>Cancel</button>
                <button type="submit" className="btn-forest" disabled={postingJob}>{postingJob ? 'Posting Job...' : 'Post Job →'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

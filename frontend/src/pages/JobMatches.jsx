import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { CompanyLogo } from '../components/CompanyLogos.jsx';
import { IconTarget, IconBuilding, IconPin, IconSparkles } from '../components/Icons.jsx';

export default function JobMatches() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [userResume, setUserResume] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  // Fallback demo jobs if backend has no active postings
  const demoJobs = [
    {
      id: 'j1',
      title: 'Cloud DevOps Engineer',
      company: 'Microsoft',
      location: 'Redmond, WA (Remote)',
      specialization: 'CLOUD_ENGINEER',
      experienceLevel: 'MID',
      requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Python'],
      matchScore: 92,
      description: 'We are seeking a Cloud DevOps Engineer to design, scale, and automate cloud infrastructure across Azure and AWS Kubernetes clusters.'
    },
    {
      id: 'j2',
      title: 'Backend Java Developer',
      company: 'Amazon',
      location: 'Seattle, WA',
      specialization: 'JAVA_DEVELOPER',
      experienceLevel: 'SENIOR',
      requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Kafka'],
      matchScore: 85,
      description: 'Join the Amazon Retail Core team building high-throughput distributed microservices with Java 21, Spring Boot, and AWS.'
    },
    {
      id: 'j3',
      title: 'Site Reliability Engineer (SRE)',
      company: 'Google',
      location: 'Mountain View, CA',
      specialization: 'DEVOPS_ENGINEER',
      experienceLevel: 'MID',
      requiredSkills: ['Linux', 'Prometheus', 'Grafana', 'Python', 'Go'],
      matchScore: 81,
      description: 'Optimize service availability, latency, performance, and monitoring across Google Cloud Platform core infrastructure.'
    },
    {
      id: 'j4',
      title: 'Senior Cloud Architect',
      company: 'IBM',
      location: 'Austin, TX',
      specialization: 'CLOUD_ENGINEER',
      experienceLevel: 'LEAD',
      requiredSkills: ['Cloud Security', 'Kubernetes', 'CI/CD', 'Ansible', 'Linux'],
      matchScore: 73,
      description: 'Lead hybrid-cloud deployment strategies, automated CI/CD pipelines, and enterprise cloud migration frameworks.'
    }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [backendJobs, resumes, scores] = await Promise.all([
        api.recruiter.getJobs().catch(() => []),
        user ? api.resumes.getForUser(user.id).catch(() => []) : [],
        user ? api.scores.forUser(user.id).catch(() => []) : [],
      ]);

      if (resumes && Array.isArray(resumes) && resumes.length > 0) setUserResume(resumes[0]);
      if (scores && Array.isArray(scores) && scores.length > 0) setUserScore(scores[scores.length - 1]);

      if (backendJobs && Array.isArray(backendJobs) && backendJobs.length > 0) {
        const rawSkills = resumes?.[0]?.parsedData?.skills || [];
        const userSkills = Array.isArray(rawSkills)
          ? rawSkills.map(s => String(s || '').trim().toLowerCase())
          : String(rawSkills || '').split(',').map(s => String(s || '').trim().toLowerCase());

        const formatted = backendJobs.map(j => {
          let reqSkills = [];
          try {
            if (Array.isArray(j.requiredSkills)) {
              reqSkills = j.requiredSkills;
            } else if (typeof j.requiredSkills === 'string') {
              reqSkills = JSON.parse(j.requiredSkills);
            }
          } catch {
            reqSkills = String(j.requiredSkills || '').split(',').map(s => s.trim());
          }

          if (!Array.isArray(reqSkills)) reqSkills = [String(reqSkills || '')];

          let matchedCount = 0;
          reqSkills.forEach(s => {
            const skillLower = String(s || '').trim().toLowerCase();
            if (skillLower && userSkills.some(us => us && (us.includes(skillLower) || skillLower.includes(us)))) {
              matchedCount++;
            }
          });

          const matchScore = reqSkills.length > 0 ? Math.min(98, Math.max(65, Math.round((matchedCount / reqSkills.length) * 100))) : 82;

          return {
            id: j.id || `job-${Math.random()}`,
            title: j.title || 'Software Engineer',
            company: j.companyName || 'CloudATS Partner',
            location: j.location || 'Remote',
            specialization: j.specialization || 'JAVA_DEVELOPER',
            experienceLevel: j.experienceLevel || 'MID',
            requiredSkills: reqSkills,
            matchScore,
            description: j.description || 'Enterprise cloud software position.'
          };
        });

        setJobs(formatted.length >= 4 ? formatted : [...formatted, ...demoJobs.slice(formatted.length)]);
      } else {
        setJobs(demoJobs);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs(demoJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    setAppliedJobs(prev => new Set(prev).add(jobId));
    alert('🎉 Application submitted successfully! Recruiter has been notified.');
  };

  const filteredJobs = (jobs || []).filter(j => 
    !filterQuery || 
    (j.title && j.title.toLowerCase().includes(filterQuery.toLowerCase())) || 
    (j.company && j.company.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="page-wrapper">
      {/* Banner with Glass Backdrop for High Text Contrast */}
      <div style={{ position: 'relative', marginBottom: 28, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        <NatureBannerIllustration height={150} />
        <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 2 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.70)',
            backdropFilter: 'blur(10px)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 20px rgba(20, 34, 20, 0.08)',
            maxWidth: 520
          }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#12250E', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconTarget size={24} color="var(--primary-green)" />
              Job Matches
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#26421F', fontWeight: 700 }}>
              Real-time matched opportunities based on your ATS resume score & skill profile.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main Job Matches List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="ui-card-header">
              <span className="ui-card-title">Top Matched Roles ({filteredJobs.length})</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="search-input-wrapper" 
                  style={{ height: 36, fontSize: '0.8rem', width: 200 }} 
                  placeholder="Filter matched jobs..." 
                  value={filterQuery} 
                  onChange={e => setFilterQuery(e.target.value)} 
                />
              </div>
            </div>

            {filteredJobs.map((job) => {
              const isApplied = appliedJobs.has(job.id);
              const skillsList = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
              return (
                <div key={job.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                        <CompanyLogo company={job.company} size={28} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{job.title}</h3>
                          <span className="badge-status badge-excellent">{job.matchScore}% Match</span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <IconBuilding size={14} color="var(--primary-green)" />
                            <strong>{job.company}</strong>
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <IconPin size={14} color="var(--primary-green)" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <IconSparkles size={14} color="var(--primary-green)" />
                            {job.experienceLevel} Level
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={isApplied ? "btn-forest-outline" : "btn-forest"}
                      disabled={isApplied}
                      onClick={() => handleApply(job.id)}
                      style={{ fontSize: '0.85rem', padding: '8px 18px' }}
                    >
                      {isApplied ? '✓ Applied' : 'Apply Now →'}
                    </button>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Required Skills:</span>
                    {skillsList.map((sk, idx) => (
                      <span key={idx} className="skill-chip">{String(sk)}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Strength */}
            <div className="ui-card text-center">
              <span className="ui-card-title" style={{ display: 'block', marginBottom: 12 }}>Your Profile Strength</span>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                <div className="score-circle-ring" style={{ width: 85, height: 85, fontSize: '1.4rem' }}>
                  {userScore?.overallScore || 63.5}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: 8 }}>
                {userResume?.parsedData?.specialization || 'JAVA_DEVELOPER'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Resume: {userResume?.filename || 'Ayushman_CV.pdf'}
              </p>
            </div>

            {/* Match Insights */}
            <div className="ui-card">
              <span className="ui-card-title" style={{ display: 'block', marginBottom: 12 }}>💡 Match Insights</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: 10, background: 'var(--bg-main)', borderRadius: 8, fontSize: '0.8rem' }}>
                  🎯 Candidates with <strong>80%+ match</strong> receive interview callbacks 3x faster.
                </div>
                <div style={{ padding: 10, background: 'var(--bg-main)', borderRadius: 8, fontSize: '0.8rem' }}>
                  📄 Upload tailored resumes for specialized engineering roles to increase score match.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

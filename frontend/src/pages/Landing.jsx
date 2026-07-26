import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import NatureBannerIllustration from '../components/NatureBannerIllustration.jsx';
import { IconFileText, IconTarget, IconSearch, IconBriefcase, IconUsers, IconBarChart, IconSparkles } from '../components/Icons.jsx';

const features = [
  { iconComponent: IconFileText, title: 'Smart Resume Upload', desc: 'Upload PDF or DOCX resumes. Our parser extracts name, skills, education, experience, projects, and certifications automatically.' },
  { iconComponent: IconTarget, title: 'ATS Score Analysis', desc: 'Get scored across 7 dimensions: skills, experience, education, projects, certifications, formatting, and keywords.' },
  { iconComponent: IconSearch, title: '9 Specializations', desc: 'Cloud Engineer, Java Developer, Frontend, Backend, DevOps, AI Engineer, Data Engineer, Software Engineer, and Cyber Security.' },
  { iconComponent: IconBriefcase, title: 'JD Comparison', desc: 'Compare your resume against any job description. See matched skills, missing skills, and a match percentage.' },
  { iconComponent: IconUsers, title: 'Recruiter Search', desc: 'Recruiters can search candidates by skill, ATS score, or specialization and shortlist the best matches.' },
  { iconComponent: IconBarChart, title: 'Analytics Dashboard', desc: 'Real-time insights on resume trends, popular skills, score distributions, and recruiter activity.' },
];

const specs = [
  'Cloud Engineer', 'Java Developer', 'Backend Developer',
  'Frontend Developer', 'DevOps Engineer', 'Software Engineer',
  'Data Engineer', 'AI Engineer', 'Cyber Security',
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      {/* Hero Banner Section */}
      <div style={{ position: 'relative', marginBottom: 48, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <NatureBannerIllustration height={240} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <span className="badge-status badge-excellent" style={{ fontSize: '0.85rem', padding: '6px 16px', marginBottom: 14 }}>
            ✨ Production-Grade Cloud-Native Recruitment Platform
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-title)',
            marginBottom: 14,
            textShadow: '0 1px 2px rgba(255,255,255,0.8)'
          }}>
            AI-Powered Recruitment Starts Here
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', maxWidth: 640, margin: '0 auto 24px', fontWeight: 500 }}>
            Upload your resume, get an instant ATS score across 9 engineering specializations, and match with top tech roles.
          </p>

          <div style={{ display: 'flex', gap: 14 }}>
            {user ? (
              <Link to="/dashboard" className="btn-forest" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-forest" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  Start for Free →
                </Link>
                <Link to="/login" className="btn-forest-outline" style={{ padding: '12px 28px', fontSize: '1rem', background: '#FFFFFF' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="metric-grid-4" style={{ marginBottom: 48 }}>
        {[
          ['9', 'Specializations', IconTarget],
          ['7', 'Score Dimensions', IconBarChart],
          ['3', 'User Roles', IconUsers],
          ['6', 'Microservices', IconSparkles]
        ].map(([val, label, IconComp]) => (
          <div key={label} className="metric-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <IconComp size={22} color="var(--primary-green)" />
            </div>
            <div className="metric-value">{val}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Everything you need to land your next role</h2>
          <p style={{ color: 'var(--text-muted)' }}>From resume parsing to score optimization & recruiter matching.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => {
            const IconComp = f.iconComponent;
            return (
              <div key={i} className="ui-card">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <IconComp size={24} color="var(--primary-green)" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specializations */}
      <div className="ui-card" style={{ textAlign: 'center', padding: '36px 24px', marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>9 Engineering Specializations</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Each with unique weighted scoring criteria tailored to the role.</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
          {specs.map((s) => (
            <span key={s} className="skill-chip" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

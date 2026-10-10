import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadResume from './pages/UploadResume.jsx';
import JobMatches from './pages/JobMatches.jsx';
import MyScores from './pages/MyScores.jsx';
import Applications from './pages/Applications.jsx';
import CandidateShortlists from './pages/CandidateShortlists.jsx';
import RecruiterPage from './pages/RecruiterPage.jsx';
import Analytics from './pages/Analytics.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function RoleBasedJobRoute() {
  const { user } = useAuth();
  if (user?.role === 'CANDIDATE') return <JobMatches />;
  return <RecruiterPage initialTab="jobs" />;
}

function RoleBasedShortlistRoute() {
  const { user } = useAuth();
  if (user?.role === 'CANDIDATE') return <CandidateShortlists />;
  return <RecruiterPage initialTab="shortlists" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
            <UploadResume />
          </ProtectedRoute>
        } />
        <Route path="/scores" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
            <MyScores />
          </ProtectedRoute>
        } />
        <Route path="/job-matches" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'ADMIN']}>
            <JobMatches />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
            <Applications />
          </ProtectedRoute>
        } />

        {/* Recruiter / Shared routes */}
        <Route path="/recruiter" element={
          <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
            <RecruiterPage />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'ADMIN']}>
            <RoleBasedJobRoute />
          </ProtectedRoute>
        } />
        <Route path="/shortlists" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'ADMIN']}>
            <RoleBasedShortlistRoute />
          </ProtectedRoute>
        } />

        {/* Admin / Analytics routes */}
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'RECRUITER']}>
            <Analytics initialTab="overview" />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Analytics initialTab="users" />
          </ProtectedRoute>
        } />
        <Route path="/resumes" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Analytics initialTab="resumes" />
          </ProtectedRoute>
        } />
        <Route path="/system" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Analytics initialTab="system" />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

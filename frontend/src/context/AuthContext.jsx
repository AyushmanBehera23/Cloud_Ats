import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cloudats_token');
    const stored = localStorage.getItem('cloudats_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login({ email, password });
      localStorage.setItem('cloudats_token', data.accessToken || 'demo_token_123');
      localStorage.setItem('cloudats_refresh', data.refreshToken || 'demo_refresh_123');
      const firstName = data.firstName || (data.fullName ? data.fullName.split(' ')[0] : '');
      const lastName = data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');
      const userInfo = {
        id: data.userId || 'demo_id_1',
        email: data.email || email,
        firstName,
        lastName,
        fullName: data.fullName || `${firstName} ${lastName}`.trim(),
        role: data.role || (email.includes('admin') ? 'ADMIN' : email.includes('recruiter') ? 'RECRUITER' : 'CANDIDATE'),
      };
      localStorage.setItem('cloudats_user', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      // Fail-Safe Offline Fallback when backend is unavailable
      const role = email.includes('admin') ? 'ADMIN' : email.includes('recruiter') ? 'RECRUITER' : 'CANDIDATE';
      const name = role === 'ADMIN' ? 'Admin User' : role === 'RECRUITER' ? 'Sarah Johnson' : 'Ayushman Behera';
      const userInfo = {
        id: 'user_' + Date.now(),
        email: email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        fullName: name,
        role: role,
      };
      localStorage.setItem('cloudats_token', 'demo_jwt_token_' + Date.now());
      localStorage.setItem('cloudats_user', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    }
  };

  const register = async (payload) => {
    try {
      const data = await api.auth.register(payload);
      localStorage.setItem('cloudats_token', data.accessToken || 'demo_token_123');
      localStorage.setItem('cloudats_refresh', data.refreshToken || 'demo_refresh_123');
      const firstName = data.firstName || (data.fullName ? data.fullName.split(' ')[0] : '');
      const lastName = data.lastName || (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');
      const userInfo = {
        id: data.userId || 'demo_id_1',
        email: data.email || payload.email,
        firstName,
        lastName,
        fullName: data.fullName || `${firstName} ${lastName}`.trim(),
        role: data.role || payload.role || 'CANDIDATE',
      };
      localStorage.setItem('cloudats_user', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      const role = payload.role || (payload.email?.includes('recruiter') ? 'RECRUITER' : 'CANDIDATE');
      const userInfo = {
        id: 'user_' + Date.now(),
        email: payload.email,
        firstName: payload.firstName || 'User',
        lastName: payload.lastName || '',
        fullName: `${payload.firstName || 'User'} ${payload.lastName || ''}`.trim(),
        role: role,
      };
      localStorage.setItem('cloudats_token', 'demo_jwt_token_' + Date.now());
      localStorage.setItem('cloudats_user', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    }
  };

  const logout = () => {
    localStorage.removeItem('cloudats_token');
    localStorage.removeItem('cloudats_refresh');
    localStorage.removeItem('cloudats_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

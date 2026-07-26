import React from 'react';

// Real Colorful Google Logo
export const LogoGoogle = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// Real 4-Square Microsoft Logo
export const LogoMicrosoft = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
    <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
    <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
    <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
  </svg>
);

// Real Amazon Logo
export const LogoAmazon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18.8 17.5C14.5 19.8 8.8 20.3 4 17.2C3.7 17 4.1 16.5 4.4 16.7C9.2 19.6 14.5 19.1 18.3 17C18.7 16.8 19.1 17.2 18.8 17.5Z" fill="#FF9900" />
    <path d="M19.8 16.2C19.5 15.8 17.6 16.3 16.8 16.5C16.5 16.6 16.5 16.3 16.7 16.1C18.1 14.9 20.4 14.9 20.7 15.3C21 15.7 20.4 18 19.1 19.3C18.9 19.5 18.6 19.3 18.7 19.1C19.2 18.3 20.1 16.6 19.8 16.2Z" fill="#FF9900" />
    <path d="M13.2 12.8C13.2 14.3 12.4 15.3 10.9 15.3C9.6 15.3 8.7 14.4 8.7 13.1C8.7 11.2 10.3 10.5 13.2 10.5V10.2C13.2 9.2 12.5 8.5 11.2 8.5C10.2 8.5 9.1 8.9 8.3 9.4C8 9.6 7.8 9.3 8 9C9 8.2 10.3 7.7 11.8 7.7C13.9 7.7 15.2 8.9 15.2 11V14.8C15.2 15.5 15.5 15.8 16 15.8C16.2 15.8 16.5 15.7 16.7 15.5C16.9 15.3 17.2 15.6 17 15.8C16.4 16.5 15.4 16.9 14.5 16.9C13.6 16.9 13.2 16.2 13.2 15.2V12.8ZM13.2 11.5C11.5 11.5 10.6 12 10.6 13C10.6 13.7 11.1 14.2 12 14.2C12.8 14.2 13.2 13.6 13.2 12.6V11.5Z" fill="#232F3E" />
  </svg>
);

// Real Infosys Blue Logo
export const LogoInfosys = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#007CC3">
    <rect x="2" y="5" width="20" height="14" rx="3" fill="#007CC3" />
    <text x="12" y="15" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
      Infosys
    </text>
  </svg>
);

// Real IBM Logo
export const LogoIBM = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#052FAD">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#052FAD" />
    <text x="12" y="15" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1" textAnchor="middle" fontFamily="sans-serif">
      IBM
    </text>
  </svg>
);

// CloudATS Enterprise Logo
export const LogoCloudATS = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 4, background: 'linear-gradient(135deg, #1E3A1E 0%, #2D5A27 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800, fontSize: size * 0.5 }}>
    🌱
  </div>
);

export const CompanyLogo = ({ company, size = 28 }) => {
  const name = (company || '').toLowerCase();
  if (name.includes('google')) return <LogoGoogle size={size} />;
  if (name.includes('microsoft')) return <LogoMicrosoft size={size} />;
  if (name.includes('amazon')) return <LogoAmazon size={size} />;
  if (name.includes('infosys')) return <LogoInfosys size={size} />;
  if (name.includes('ibm')) return <LogoIBM size={size} />;
  return <LogoCloudATS size={size} />;
};

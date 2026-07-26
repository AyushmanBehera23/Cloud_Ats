import React from 'react';

/* 
  Hand-Drawn Line Art Icon Collection
  Inspired by Flaticon Hand-Drawn Doodle & Sketch Aesthetic
  Features organic curves, hand-drawn stroke caps, and warm line rhythm.
*/

// Hand-drawn 🌱 Leaf Icon
export const IconLeaf = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21C12 21 10.5 16 10.5 12C10.5 8 13.5 3 20 2C19 8.5 16 11.5 12 12C8 12.5 3 14 2 20C7 21 12 21 12 21Z" />
    <path d="M12 21V12" />
    <path d="M8 15.5C10 14.5 12 14 12 14" />
  </svg>
);

// Hand-drawn 🔍 Search Icon
export const IconSearch = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" />
    <path d="M16 16L21 21" />
    <path d="M7 8C8 7 9.5 6.5 11 7" strokeWidth="1.8" />
  </svg>
);

// Hand-drawn 🔔 Bell Notification Icon
export const IconBell = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 15 3.5 17 3.5 17H20.5C20.5 17 18 15 18 9Z" />
    <path d="M13.73 21C13.3 21.6 12.7 22 12 22C11.3 22 10.7 21.6 10.27 21" />
    <path d="M12 2V3" />
  </svg>
);

// Hand-drawn 👤 User Avatar Icon
export const IconUser = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
    <path d="M4 21V19C4 16.5 7 14.5 12 14.5C17 14.5 20 16.5 20 19V21" />
  </svg>
);

// Hand-drawn 👥 Users Group Icon
export const IconUsers = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5" />
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" />
    <path d="M2 21V19.5C2 17.5 5 15.5 9 15.5C13 15.5 16 17.5 16 19.5V21" />
    <path d="M17 15.5C19.5 16.5 22 18 22 20.5V21" />
  </svg>
);

// Hand-drawn 💼 Briefcase Icon
export const IconBriefcase = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="3" />
    <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" />
    <path d="M12 12V14" />
    <path d="M3 12H21" strokeDasharray="2,2" />
  </svg>
);

// Hand-drawn 📞 Phone Icon
export const IconPhone = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Hand-drawn 📄 File / Resume Icon
export function IconFileText({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function IconUpload({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
// Hand-drawn 📈 Trending Up Chart Icon
export const IconTrendingUp = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 6L13.5 14.5L8.5 9.5L2 16" />
    <path d="M16 6H22V12" />
  </svg>
);

// Hand-drawn 🌐 Globe Icon
export const IconGlobe = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3.6 9H20.4" />
    <path d="M3.6 15H20.4" />
    <path d="M12 3C14.5 6.5 15.5 9.5 15.5 12C15.5 14.5 14.5 17.5 12 21C9.5 17.5 8.5 14.5 8.5 12C8.5 9.5 9.5 6.5 12 3Z" />
  </svg>
);

// Hand-drawn 🏢 Building / Office Icon
export const IconBuilding = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 7H10" /><path d="M14 7H15" />
    <path d="M9 11H10" /><path d="M14 11H15" />
    <path d="M9 15H10" /><path d="M14 15H15" />
    <path d="M10 21V18H14V21" />
  </svg>
);

// Hand-drawn 📍 Location Pin Icon
export const IconPin = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21C12 21 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="3" />
  </svg>
);

// Hand-drawn ✨ Sparkles Icon
export const IconSparkles = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3C12 3 13.5 7.5 15.5 9.5C17.5 11.5 22 13 22 13C22 13 17.5 14.5 15.5 16.5C13.5 18.5 12 23 12 23C12 23 10.5 18.5 8.5 16.5C6.5 14.5 2 13 2 13C2 13 6.5 11.5 8.5 9.5C10.5 7.5 12 3 12 3Z" />
  </svg>
);

// Hand-drawn ⭐ Star Doodle Icon
export const IconStar = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L14.9 8.6L22 9.2L16.7 13.9L18.3 21L12 17.3L5.7 21L7.3 13.9L2 9.2L9.1 8.6L12 2Z" />
  </svg>
);

// Hand-drawn ⚙️ Settings / Gear Icon
export const IconSettings = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3.5" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Hand-drawn 🛡️ Shield Security Icon
export const IconShield = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
    <path d="M9 12L11 14L15 10" />
  </svg>
);

// Hand-drawn 🎯 Target / Bullseye Icon
export const IconTarget = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
);

// Hand-drawn 🖥️ Server Icon
export const IconServer = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="7" rx="2" />
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <circle cx="7" cy="6.5" r="1" fill={color} />
    <circle cx="7" cy="17.5" r="1" fill={color} />
  </svg>
);

// Hand-drawn 📊 Bar Chart Icon
export const IconBarChart = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20V15" />
    <path d="M3 20H21" />
  </svg>
);

// Hand-drawn ✅ Check Circle Icon
export const IconCheckCircle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5L11 15L16 9" />
  </svg>
);

// Hand-drawn 🗑️ Trash Can Icon
export const IconTrash = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6H21" />
    <path d="M19 6V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6" />
    <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" />
    <path d="M10 11V16" /><path d="M14 11V16" />
  </svg>
);

// Hand-drawn 🔄 Refresh / Sync Icon
export const IconRefresh = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4V10H15" />
    <path d="M20.5 15C19.3 18 16 20.5 12 20.5C7.3 20.5 3.5 16.7 3.5 12C3.5 7.3 7.3 3.5 12 3.5C15.5 3.5 18.5 5.6 19.8 8.7" />
  </svg>
);

// Hand-drawn 📥 Download Icon
export const IconDownload = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" />
    <path d="M7 10L12 15L17 10" />
    <path d="M12 15V3" />
  </svg>
);

// Hand-drawn ➔ Chevron Right Icon
export const IconChevronRight = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18L15 12L9 6" />
  </svg>
);

// Hand-drawn ✕ Close Icon
export const IconX = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

// Hand-drawn 👋 Waving Hand Icon
export const IconHandWave = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M14 6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
    <path d="M10 6.5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7.5" />
    <path d="M6 12a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2c0 4.5 3.5 8 8 8h2c4 0 7-3 7-7v-2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2" />
  </svg>
);

// Hand-drawn 💻 Code Icon
export const IconCode = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// Hand-drawn 🎓 Graduation Cap Icon
export const IconGraduationCap = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 5L2 10L12 15L22 10Z" />
    <path d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12" />
  </svg>
);

// Hand-drawn 🚀 Rocket Icon
export const IconRocket = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
  </svg>
);

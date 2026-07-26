import React from 'react';

export default function NatureBannerIllustration({ height = 160 }) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', borderRadius: 'var(--radius-xl)' }}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F9F4" />
          <stop offset="60%" stopColor="#E4EFE2" />
          <stop offset="100%" stopColor="#D4E4D0" />
        </linearGradient>

        <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B4CAA0" />
          <stop offset="100%" stopColor="#9AB884" />
        </linearGradient>

        <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7E9E70" />
          <stop offset="100%" stopColor="#5E8250" />
        </linearGradient>

        <linearGradient id="hillGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4D7040" />
          <stop offset="100%" stopColor="#35562A" />
        </linearGradient>

        <linearGradient id="hillGrad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A4822" />
          <stop offset="100%" stopColor="#1A3314" />
        </linearGradient>

        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sky Canvas */}
      <rect width="1200" height="200" fill="url(#skyGrad)" />

      {/* Sun Glow */}
      <circle cx="980" cy="55" r="45" fill="#F8E5B9" opacity="0.9" />
      <circle cx="980" cy="55" r="60" fill="#FDF3D6" opacity="0.4" />

      {/* Distant Mountain Ridge 1 */}
      <path
        d="M 0,200 L 0,110 Q 200,60 450,90 T 900,70 T 1200,85 L 1200,200 Z"
        fill="url(#hillGrad1)"
        opacity="0.85"
      />

      {/* Mid Mountain Ridge 2 */}
      <path
        d="M 0,200 L 0,135 Q 300,90 600,120 T 1050,95 T 1200,115 L 1200,200 Z"
        fill="url(#hillGrad2)"
      />

      {/* Foreground Ridge 3 */}
      <path
        d="M 0,200 L 0,160 Q 350,130 750,150 T 1200,138 L 1200,200 Z"
        fill="url(#hillGrad3)"
      />

      {/* Front Edge Grass Line 4 */}
      <path
        d="M 0,200 L 0,178 Q 400,162 850,172 T 1200,168 L 1200,200 Z"
        fill="url(#hillGrad4)"
      />

      {/* Pine Tree Clusters - Center & Right */}
      <g fill="#142A0F">
        {/* Cluster Center-Right */}
        <polygon points="720,170 710,192 730,192" />
        <polygon points="720,158 713,178 727,178" />
        <polygon points="720,148 715,164 725,164" />

        <polygon points="745,172 737,192 753,192" />
        <polygon points="745,162 739,179 751,179" />

        {/* Cluster Right */}
        <polygon points="1050,165 1038,195 1062,195" />
        <polygon points="1050,152 1042,175 1058,175" />
        <polygon points="1050,142 1045,158 1055,158" />

        <polygon points="1085,168 1075,195 1095,195" />
        <polygon points="1085,156 1078,178 1092,178" />

        <polygon points="1120,160 1108,195 1132,195" />
        <polygon points="1120,148 1112,172 1128,172" />
        <polygon points="1120,138 1115,154 1125,154" />
      </g>

      {/* Pine Trees - Far Left (Subtle) */}
      <g fill="#1D3A16" opacity="0.9">
        <polygon points="80,175 72,195 88,195" />
        <polygon points="80,165 74,180 86,180" />
      </g>

      {/* Wildlife Accents: Deer Silhouette */}
      <g fill="#142A0F" opacity="0.9">
        <path d="M 880,152 C 880,152 883,147 886,147 C 889,147 891,150 893,152 L 895,152 L 896,159 L 899,166 L 897,166 L 895,160 L 891,160 L 890,166 L 888,166 L 889,157 Z" />
      </g>

      {/* Soaring Birds */}
      <g stroke="#3B5A33" strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M 640,50 Q 646,44 652,50 Q 658,44 664,50" />
        <path d="M 675,62 Q 679,57 683,62 Q 687,57 691,62" />
        <path d="M 615,68 Q 619,64 623,68 Q 627,64 631,68" />
      </g>
    </svg>
  );
}

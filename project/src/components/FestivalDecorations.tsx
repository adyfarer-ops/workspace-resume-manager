import React from 'react';
import type { FestivalType } from '../types';

interface FestivalDecorationsProps {
  festivalType: FestivalType | null;
}

/**
 * FestivalDecorations — overlays festival-specific SVG decorations on the scene
 * when a festival theme is active. Uses pointer-events-none so it never blocks
 * interaction. All decorations fade in smoothly.
 *
 * Validates: Requirement 7.8
 */
export const FestivalDecorations = ({ festivalType }: FestivalDecorationsProps) => {
  if (!festivalType) return null;

  return (
    <>
      <style>{`
        @keyframes festival-deco-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes lantern-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes flag-wave {
          0%, 100% { transform: skewX(0deg); }
          25% { transform: skewX(2deg); }
          75% { transform: skewX(-2deg); }
        }
        @keyframes ribbon-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
        style={{ animation: 'festival-deco-fade 1.2s ease-out both' }}
      >
        {festivalType === 'cny' && <CNYDecorations />}
        {festivalType === 'mid_autumn' && <MidAutumnDecorations />}
        {festivalType === 'lantern_fest' && <LanternFestDecorations />}
        {festivalType === 'national' && <NationalDecorations />}
      </div>
    </>
  );
};

/** 春节 — red lanterns hanging from top + vertical couplet strips on sides */
const CNYDecorations = () => (
  <>
    {/* Red lanterns along the top */}
    {[8, 25, 75, 92].map((left, i) => (
      <svg
        key={`lantern-${i}`}
        className="absolute"
        style={{
          top: 0,
          left: `${left}%`,
          width: 32,
          height: 72,
          animation: `lantern-sway 3s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
          transformOrigin: 'top center',
        }}
        viewBox="0 0 32 72"
        fill="none"
      >
        {/* String */}
        <line x1="16" y1="0" x2="16" y2="20" stroke="#8b0000" strokeWidth="1" />
        {/* Top cap */}
        <rect x="10" y="18" width="12" height="4" rx="1" fill="#c41e1e" />
        {/* Body */}
        <ellipse cx="16" cy="38" rx="12" ry="16" fill="#e53e3e" opacity="0.85" />
        <ellipse cx="16" cy="38" rx="8" ry="12" fill="#fc8181" opacity="0.3" />
        {/* Bottom cap */}
        <rect x="10" y="52" width="12" height="4" rx="1" fill="#c41e1e" />
        {/* Tassel */}
        <line x1="16" y1="56" x2="16" y2="68" stroke="#c41e1e" strokeWidth="1.5" />
        <line x1="14" y1="64" x2="16" y2="70" stroke="#e53e3e" strokeWidth="1" />
        <line x1="18" y1="64" x2="16" y2="70" stroke="#e53e3e" strokeWidth="1" />
      </svg>
    ))}

    {/* Left couplet strip */}
    <svg
      className="absolute left-4 top-32"
      width="32" height="160"
      viewBox="0 0 32 160"
      fill="none"
      style={{ opacity: 0.85 }}
    >
      <rect x="2" y="0" width="28" height="156" rx="2" fill="#b91c1c" opacity="0.9" />
      <rect x="4" y="2" width="24" height="152" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <text x="16" y="80" textAnchor="middle" fill="#fef3c7" fontSize="16" fontFamily="serif" fontWeight="bold"
        writingMode="vertical-rl" style={{ writingMode: 'vertical-rl' as any }}>
        春 回 大 地
      </text>
    </svg>

    {/* Right couplet strip */}
    <svg
      className="absolute right-4 top-32"
      width="32" height="160"
      viewBox="0 0 32 160"
      fill="none"
      style={{ opacity: 0.85 }}
    >
      <rect x="2" y="0" width="28" height="156" rx="2" fill="#b91c1c" opacity="0.9" />
      <rect x="4" y="2" width="24" height="152" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
      <text x="16" y="80" textAnchor="middle" fill="#fef3c7" fontSize="16" fontFamily="serif" fontWeight="bold"
        writingMode="vertical-rl" style={{ writingMode: 'vertical-rl' as any }}>
        福 满 人 间
      </text>
    </svg>
  </>
);


/** 中秋 — mooncake icons + jade rabbit silhouette */
const MidAutumnDecorations = () => (
  <>
    {/* Mooncake icons scattered subtly */}
    {[
      { x: 10, y: 15 },
      { x: 85, y: 20 },
      { x: 15, y: 70 },
      { x: 88, y: 65 },
    ].map((pos, i) => (
      <svg
        key={`mooncake-${i}`}
        className="absolute"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: 28,
          height: 28,
          animation: `float-up 4s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
          opacity: 0.5,
        }}
        viewBox="0 0 28 28"
        fill="none"
      >
        {/* Mooncake body */}
        <circle cx="14" cy="14" r="12" fill="#c49a6c" opacity="0.7" />
        <circle cx="14" cy="14" r="10" fill="#d4a574" opacity="0.5" />
        {/* Pattern lines on mooncake */}
        <path d="M8 14 Q14 8 20 14" stroke="#a0845c" strokeWidth="0.8" fill="none" />
        <path d="M8 14 Q14 20 20 14" stroke="#a0845c" strokeWidth="0.8" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke="#a0845c" strokeWidth="0.5" opacity="0.5" />
      </svg>
    ))}

    {/* Jade rabbit silhouette near top-right (moon area) */}
    <svg
      className="absolute"
      style={{
        right: '12%',
        top: '8%',
        width: 48,
        height: 48,
        opacity: 0.35,
        animation: 'float-up 5s ease-in-out infinite',
      }}
      viewBox="0 0 48 48"
      fill="none"
    >
      {/* Rabbit body */}
      <ellipse cx="24" cy="32" rx="10" ry="8" fill="#d6d3d1" opacity="0.8" />
      {/* Head */}
      <circle cx="24" cy="22" r="7" fill="#d6d3d1" opacity="0.8" />
      {/* Left ear */}
      <ellipse cx="20" cy="12" rx="2.5" ry="7" fill="#d6d3d1" opacity="0.8" transform="rotate(-10 20 12)" />
      {/* Right ear */}
      <ellipse cx="28" cy="12" rx="2.5" ry="7" fill="#d6d3d1" opacity="0.8" transform="rotate(10 28 12)" />
      {/* Eye */}
      <circle cx="22" cy="21" r="1" fill="#991b1b" opacity="0.6" />
      {/* Tail */}
      <circle cx="34" cy="32" r="2.5" fill="#e7e5e4" opacity="0.7" />
    </svg>
  </>
);

/** 元宵 — floating colorful lanterns + tangyuan shapes */
const LanternFestDecorations = () => {
  const lanternColors = ['#e53e3e', '#ed8936', '#ecc94b', '#48bb78', '#4299e1'];
  const positions = [
    { x: 6, y: 10 },
    { x: 22, y: 5 },
    { x: 50, y: 8 },
    { x: 72, y: 12 },
    { x: 90, y: 6 },
  ];

  return (
    <>
      {/* Floating colorful lanterns */}
      {positions.map((pos, i) => (
        <svg
          key={`festlantern-${i}`}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: 26,
            height: 44,
            animation: `float-up 3.5s ease-in-out infinite, glow-pulse 2.5s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
            opacity: 0.65,
          }}
          viewBox="0 0 26 44"
          fill="none"
        >
          {/* Lantern body */}
          <ellipse cx="13" cy="22" rx="10" ry="13" fill={lanternColors[i]} opacity="0.7" />
          <ellipse cx="13" cy="22" rx="6" ry="9" fill="#fffbeb" opacity="0.25" />
          {/* Top ring */}
          <rect x="9" y="8" width="8" height="3" rx="1" fill={lanternColors[i]} opacity="0.9" />
          {/* Bottom ring */}
          <rect x="9" y="34" width="8" height="3" rx="1" fill={lanternColors[i]} opacity="0.9" />
          {/* Tassel */}
          <line x1="13" y1="37" x2="13" y2="43" stroke={lanternColors[i]} strokeWidth="1" opacity="0.7" />
        </svg>
      ))}

      {/* Tangyuan shapes at bottom corners */}
      {[
        { x: 5, y: 82 },
        { x: 92, y: 85 },
      ].map((pos, i) => (
        <svg
          key={`tangyuan-${i}`}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: 36,
            height: 24,
            opacity: 0.4,
            animation: `float-up 4s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
          viewBox="0 0 36 24"
          fill="none"
        >
          {/* Bowl */}
          <path d="M4 12 Q4 22 18 22 Q32 22 32 12" stroke="#a0845c" strokeWidth="1.2" fill="#f5f0e8" opacity="0.6" />
          {/* Tangyuan balls */}
          <circle cx="12" cy="10" r="5" fill="#f5f5f4" opacity="0.8" stroke="#d6d3d1" strokeWidth="0.5" />
          <circle cx="22" cy="10" r="5" fill="#f5f5f4" opacity="0.8" stroke="#d6d3d1" strokeWidth="0.5" />
          <circle cx="17" cy="6" r="4.5" fill="#fef3c7" opacity="0.7" stroke="#d6d3d1" strokeWidth="0.5" />
        </svg>
      ))}
    </>
  );
};

/** 国庆 — small red flags + golden ribbons/streamers */
const NationalDecorations = () => (
  <>
    {/* Red flags */}
    {[
      { x: 5, y: 8 },
      { x: 20, y: 5 },
      { x: 78, y: 6 },
      { x: 93, y: 10 },
    ].map((pos, i) => (
      <svg
        key={`flag-${i}`}
        className="absolute"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: 32,
          height: 40,
          opacity: 0.6,
          animation: `flag-wave 2s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          transformOrigin: 'left top',
        }}
        viewBox="0 0 32 40"
        fill="none"
      >
        {/* Pole */}
        <line x1="4" y1="0" x2="4" y2="40" stroke="#c49a6c" strokeWidth="2" />
        {/* Flag */}
        <path d="M5 2 L30 6 L28 16 L5 14 Z" fill="#dc2626" opacity="0.85" />
        {/* Star */}
        <polygon
          points="14,6 15.2,9 18.5,9.2 16,11 16.8,14 14,12.2 11.2,14 12,11 9.5,9.2 12.8,9"
          fill="#fbbf24"
          opacity="0.9"
          transform="scale(0.7) translate(6, 2)"
        />
        {/* Pole top */}
        <circle cx="4" cy="2" r="2" fill="#c49a6c" />
      </svg>
    ))}

    {/* Golden ribbons/streamers */}
    {[
      { x: 12, y: 15, w: 120 },
      { x: 60, y: 10, w: 100 },
    ].map((r, i) => (
      <svg
        key={`ribbon-${i}`}
        className="absolute"
        style={{
          left: `${r.x}%`,
          top: `${r.y}%`,
          width: r.w,
          height: 30,
          opacity: 0.35,
        }}
        viewBox={`0 0 ${r.w} 30`}
        fill="none"
      >
        <path
          d={`M0 15 Q${r.w * 0.25} 5 ${r.w * 0.5} 15 T${r.w} 15`}
          stroke="#d4a017"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          style={{ animation: `ribbon-flow 3s linear infinite` }}
          opacity="0.8"
        />
        <path
          d={`M0 20 Q${r.w * 0.25} 28 ${r.w * 0.5} 18 T${r.w} 22`}
          stroke="#c41e1e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 6"
          style={{ animation: `ribbon-flow 4s linear infinite` }}
          opacity="0.6"
        />
      </svg>
    ))}
  </>
);

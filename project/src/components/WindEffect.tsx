import React from 'react';
import type { WindIntensity } from '../types';

interface WindEffectProps {
  intensity: WindIntensity;
}

/** Particle config per intensity level. */
const INTENSITY_CONFIG: Record<Exclude<WindIntensity, 'none'>, {
  lines: number;
  dots: number;
  leaves: number;
  durationRange: [number, number]; // seconds [min, max]
}> = {
  gentle:   { lines: 4,  dots: 3,  leaves: 0, durationRange: [8, 14] },
  moderate: { lines: 7,  dots: 5,  leaves: 0, durationRange: [5, 9] },
  strong:   { lines: 10, dots: 6,  leaves: 5, durationRange: [3, 6] },
};

/** Deterministic pseudo-random from seed (0-1). */
const seeded = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/**
 * WindEffect (西风) — horizontal drifting thin lines, dust dots, and
 * optional leaf shapes that travel right-to-left across the viewport.
 *
 * Validates: Requirements 3.3, 3.4
 */
export const WindEffect = ({ intensity }: WindEffectProps) => {
  if (intensity === 'none') return null;

  const cfg = INTENSITY_CONFIG[intensity];

  return (
    <>
      <style>{`
        @keyframes wind-drift {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(-110vw) translateY(30px); opacity: 0; }
        }
        @keyframes wind-drift-leaf {
          0%   { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          50%  { transform: translateX(-55vw) translateY(40px) rotate(180deg); opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translateX(-115vw) translateY(80px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-700"
        style={{ zIndex: -5 }}
        aria-hidden="true"
      >
        {/* Thin horizontal lines */}
        {Array.from({ length: cfg.lines }, (_, i) => {
          const s = seeded(i + 1);
          const top = 10 + s * 80;                       // 10%-90% viewport height
          const dur = cfg.durationRange[0] + seeded(i + 100) * (cfg.durationRange[1] - cfg.durationRange[0]);
          const delay = seeded(i + 200) * dur;
          const width = 30 + seeded(i + 300) * 50;       // 30-80px
          return (
            <div
              key={`line-${i}`}
              style={{
                position: 'absolute',
                top: `${top}%`,
                right: '-80px',
                width: `${width}px`,
                height: '1px',
                background: 'linear-gradient(to left, transparent, rgba(120,113,108,0.35), transparent)',
                animation: `wind-drift ${dur}s linear ${delay}s infinite`,
              }}
            />
          );
        })}

        {/* Dust dots */}
        {Array.from({ length: cfg.dots }, (_, i) => {
          const s = seeded(i + 500);
          const top = 15 + s * 70;
          const dur = cfg.durationRange[0] + seeded(i + 600) * (cfg.durationRange[1] - cfg.durationRange[0]);
          const delay = seeded(i + 700) * dur;
          const size = 2 + seeded(i + 800) * 2;          // 2-4px
          return (
            <div
              key={`dot-${i}`}
              style={{
                position: 'absolute',
                top: `${top}%`,
                right: '-10px',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: `rgba(120,113,108,${0.2 + seeded(i + 900) * 0.15})`,
                animation: `wind-drift ${dur * 1.1}s linear ${delay}s infinite`,
              }}
            />
          );
        })}

        {/* Leaf shapes — only for 'strong' intensity (autumn enhancement) */}
        {cfg.leaves > 0 && Array.from({ length: cfg.leaves }, (_, i) => {
          const s = seeded(i + 1000);
          const top = 10 + s * 75;
          const dur = cfg.durationRange[0] + seeded(i + 1100) * (cfg.durationRange[1] - cfg.durationRange[0]);
          const delay = seeded(i + 1200) * dur;
          const leafSize = 8 + seeded(i + 1300) * 6;     // 8-14px
          return (
            <svg
              key={`leaf-${i}`}
              width={leafSize}
              height={leafSize}
              viewBox="0 0 16 16"
              style={{
                position: 'absolute',
                top: `${top}%`,
                right: '-20px',
                animation: `wind-drift-leaf ${dur * 1.3}s ease-in-out ${delay}s infinite`,
              }}
            >
              <path
                d="M8,1 C12,4 14,8 12,13 C10,11 6,10 2,12 C4,8 5,4 8,1 Z"
                fill="#b45309"
                opacity="0.55"
              />
              <path
                d="M8,1 C7,5 6,9 4,12"
                fill="none"
                stroke="#92400e"
                strokeWidth="0.6"
                opacity="0.4"
              />
            </svg>
          );
        })}
      </div>
    </>
  );
};

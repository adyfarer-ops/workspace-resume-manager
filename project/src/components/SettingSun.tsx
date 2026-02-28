import React from 'react';
import type { SunConfig } from '../types';

interface SettingSunProps {
  config: SunConfig;
}

/** Map size token to pixel diameter. */
const SIZE_MAP: Record<SunConfig['size'], number> = {
  small: 128,
  medium: 192,
  large: 256,
};

/**
 * SettingSun (夕阳) — radial-gradient glow circle with a slow pulsing animation.
 * Color, size, blur, and opacity are all driven by the current theme's SunConfig.
 *
 * Validates: Requirements 4.1, 4.2, 7.3
 */
export const SettingSun = ({ config }: SettingSunProps) => {
  const diameter = SIZE_MAP[config.size];
  const radius = diameter / 2;

  return (
    <>
      <style>{`
        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); opacity: ${config.opacity}; }
          50% { transform: scale(1.08); opacity: ${Math.min(1, config.opacity + 0.08)}; }
        }
      `}</style>

      <div
        className="absolute top-12 right-8 md:top-16 md:right-32 pointer-events-none -z-10 transition-all duration-1000"
        style={{ width: diameter, height: diameter }}
      >
        {/* Outer glow halo */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
            filter: `blur(${config.blur * 1.5}px)`,
            opacity: config.opacity * 0.5,
            animation: 'sun-pulse 6s ease-in-out infinite',
          }}
        />

        {/* Core sun body */}
        <div
          className="absolute inset-0 rounded-full mix-blend-overlay transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${config.color} 0%, ${config.glowColor} 45%, transparent 75%)`,
            filter: `blur(${config.blur}px)`,
            opacity: config.opacity,
            animation: 'sun-pulse 6s ease-in-out infinite',
            animationDelay: '-0.3s',
          }}
        />
      </div>
    </>
  );
};

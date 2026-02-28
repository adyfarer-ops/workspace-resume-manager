import React from 'react';

interface LonelyTravelerProps {
  visible: boolean;
  opacity: number;
}

/**
 * LonelyTraveler (断肠人) — minimalist ink-wash silhouette of a lone traveler
 * walking along the ancient road into the far distance.
 *
 * - `visible`: when false, renders nothing
 * - `opacity`: 0 (hidden) → 0.9 (very visible); autumn/winter high, spring/summer/festival low
 *
 * Validates: Requirements 4.3, 4.4, 4.5
 */
export const LonelyTraveler = ({ visible, opacity }: LonelyTravelerProps) => {
  if (!visible || opacity <= 0) return null;

  return (
    <svg
      className="absolute bottom-32 left-[30%] md:left-[35%] w-10 md:w-14 h-auto pointer-events-none -z-10 mix-blend-multiply transition-all duration-1000 scene-transition"
      style={{ opacity }}
      viewBox="0 0 60 120"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="travelerInk">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </defs>

      <g filter="url(#travelerInk)">
        {/* Head — small circle */}
        <circle cx="28" cy="18" r="6" fill="#292524" opacity="0.9" />

        {/* Conical hat (斗笠) */}
        <path
          d="M16,18 L28,6 L40,18"
          fill="#292524"
          opacity="0.85"
        />

        {/* Body — slightly hunched torso */}
        <path
          d="M28,24 C26,36 24,50 25,62"
          fill="none"
          stroke="#292524"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Left arm holding staff */}
        <path
          d="M27,34 C20,40 16,48 14,54"
          fill="none"
          stroke="#292524"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right arm — slightly back */}
        <path
          d="M29,36 C34,42 38,48 40,52"
          fill="none"
          stroke="#292524"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Walking staff (行杖) */}
        <path
          d="M14,54 L10,105"
          fill="none"
          stroke="#292524"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Bundle on staff (包袱) */}
        <ellipse cx="12" cy="50" rx="5" ry="4" fill="#44403c" opacity="0.7" />

        {/* Left leg — forward stride */}
        <path
          d="M25,62 C22,76 18,90 16,105"
          fill="none"
          stroke="#292524"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Right leg — trailing */}
        <path
          d="M27,62 C30,78 34,92 36,105"
          fill="none"
          stroke="#292524"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Robe hem — flowing in wind */}
        <path
          d="M22,55 C18,60 16,66 20,68"
          fill="none"
          stroke="#44403c"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M30,56 C34,62 36,66 33,70"
          fill="none"
          stroke="#44403c"
          strokeWidth="1.5"
          opacity="0.45"
        />
      </g>
    </svg>
  );
};

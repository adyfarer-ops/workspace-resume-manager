import React from 'react';
import type { SeasonType } from '../utils/themeRegistry';

type CreatureType = 'swallow' | 'dragonfly' | 'crow' | 'magpie' | 'crane' | 'none';

interface CreatureProps {
  type: CreatureType;
  seasonType: SeasonType;
}

/** Single bird/creature SVG */
const CreatureSVG = ({ type }: { type: CreatureType }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" className="overflow-visible">
    {type === 'swallow' && (
      <g transform="scale(0.8)">
        <path d="M20,15 Q5,5 -10,10 L0,15 L-10,20 Q5,25 20,15" fill="currentColor" />
        <path d="M20,15 Q35,0 55,10" fill="none" stroke="currentColor" strokeWidth="2" className="animate-wing" style={{ transformOrigin: '20px 15px' }} />
        <path d="M20,15 Q35,0 45,5" fill="none" stroke="currentColor" strokeWidth="2" className="animate-wing" style={{ transformOrigin: '20px 15px', animationDelay: '0.1s' }} />
      </g>
    )}
    {type === 'dragonfly' && (
      <g className="text-cyan-800" transform="rotate(-45)">
        <path d="M30,15 L50,15" stroke="currentColor" strokeWidth="2" />
        <path d="M30,15 Q40,5 50,10" fill="none" stroke="currentColor" strokeWidth="1" className="animate-wing" />
        <path d="M30,15 Q40,25 50,20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-wing" />
      </g>
    )}
    {(type === 'crow' || type === 'magpie') && (
      <g>
        {/* Ink-wash style crow silhouette - enhanced with head, beak, tail feathers */}
        <ellipse cx="30" cy="28" rx="9" ry="5" fill="currentColor" />
        {/* Head */}
        <circle cx="22" cy="25" r="3.5" fill="currentColor" />
        {/* Beak */}
        <path d="M18.5,25 L15,24 L18,26" fill="currentColor" />
        {/* Tail feathers */}
        <path d="M39,28 Q45,26 48,22" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M39,29 Q46,28 50,25" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Wings with flap animation */}
        <path d="M28,27 Q12,8 0,18" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-wing" style={{ transformOrigin: '28px 27px' }} />
        <path d="M32,27 Q48,8 60,18" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-wing" style={{ transformOrigin: '32px 27px' }} />
      </g>
    )}
    {type === 'crane' && (
      <g className="text-stone-800" transform="scale(1.2)">
        <path d="M10,30 Q30,30 40,20 L50,10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40,20 Q20,10 0,20" fill="none" stroke="currentColor" strokeWidth="3" className="animate-wing" />
        <path d="M40,20 Q60,10 80,20" fill="none" stroke="currentColor" strokeWidth="3" className="animate-wing" />
      </g>
    )}
  </svg>
);

/**
 * Creature component - renders seasonal birds/creatures.
 * Autumn/winter: 2-3 crows with varied flight paths (low circling).
 * Spring/summer: single creature (swallow/dragonfly).
 */
export const Creature = ({ type, seasonType }: CreatureProps) => {
  if (type === 'none') return null;

  const isAutumnWinter = seasonType === 'autumn' || seasonType === 'winter';

  // Autumn/winter: multiple creatures with different flight paths
  if (isAutumnWinter && (type === 'crow' || type === 'magpie')) {
    return (
      <>
        {/* Primary crow - low flight */}
        <div className="absolute top-20 left-10 md:left-40 animate-fly-low z-0 opacity-85 text-[#1c1917] mix-blend-multiply scene-transition">
          <CreatureSVG type={type} />
        </div>
        {/* Secondary crow - curved flight, delayed */}
        <div
          className="absolute top-20 left-10 md:left-40 animate-fly-curve z-0 opacity-70 text-[#1c1917] mix-blend-multiply scene-transition"
          style={{ animationDelay: '5s' }}
        >
          <CreatureSVG type={type} />
        </div>
        {/* Third crow - high flight, further delayed (winter gets 3, autumn gets 2-3) */}
        <div
          className="absolute top-20 left-10 md:left-40 animate-fly-high z-0 opacity-55 text-[#1c1917] mix-blend-multiply scene-transition"
          style={{ animationDelay: '12s' }}
        >
          <CreatureSVG type={type} />
        </div>
      </>
    );
  }

  // Spring/summer: single creature
  return (
    <div className="absolute top-20 left-10 md:left-40 animate-fly-curve z-0 opacity-80 text-[#1c1917] mix-blend-multiply scene-transition">
      <CreatureSVG type={type} />
    </div>
  );
};

import React from 'react';
import type { WindIntensity } from '../types';
import type { TreeState } from '../utils/themeRegistry';

interface TheEternalTreeProps {
  state: TreeState;
  vineColor: string;
  windIntensity: WindIntensity;
}

/** Map wind intensity to vine swing animation duration (seconds). */
const getVineDuration = (wind: WindIntensity): number => {
  switch (wind) {
    case 'strong': return 2.5;
    case 'moderate': return 4;
    case 'gentle': return 6;
    case 'none':
    default: return 10;
  }
};

export const TheEternalTree = ({ state, vineColor, windIntensity }: TheEternalTreeProps) => {
  const vineDur = getVineDuration(windIntensity);
  const vineSwingDeg = windIntensity === 'strong' ? 6 : windIntensity === 'moderate' ? 4 : 3;

  return (
    <>
      {/* Wind-driven vine keyframes scoped via inline style */}
      <style>{`
        @keyframes vine-wind {
          0%, 100% { transform: rotate(-${vineSwingDeg}deg); }
          50% { transform: rotate(${vineSwingDeg}deg); }
        }
      `}</style>

      <svg
        className="absolute top-0 -left-10 md:left-0 h-[110vh] w-auto max-w-[80vw] text-[#1c1917] opacity-90 mix-blend-multiply transition-all duration-1000 scene-transition"
        viewBox="0 0 500 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="treeRough">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
          {/* Bark texture filter */}
          <filter id="barkTexture">
            <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="4" result="bark" />
            <feDisplacementMap in="SourceGraphic" in2="bark" scale="3" />
          </filter>
          {/* Lantern glow effect */}
          <filter id="lanternGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#treeRough)">
          {/* ===== THE TRUNK (Enhanced with bark texture) ===== */}
          {/* Main trunk */}
          <path
            d="M-20,1000 C20,900 60,800 50,700 C40,600 20,500 40,400 C60,300 100,200 180,150"
            fill="none" stroke="currentColor" strokeWidth="35" strokeLinecap="round"
          />
          {/* Secondary trunk line */}
          <path
            d="M-10,1000 C30,900 50,700 40,500"
            fill="none" stroke="#292524" strokeWidth="20" strokeLinecap="round" opacity="0.8"
          />
          {/* Bark texture strokes */}
          <path
            d="M10,850 C15,840 20,830 15,820"
            fill="none" stroke="#44403c" strokeWidth="2" opacity="0.5"
          />
          <path
            d="M30,750 C35,740 28,730 32,720"
            fill="none" stroke="#44403c" strokeWidth="2" opacity="0.4"
          />
          <path
            d="M25,650 C30,640 22,630 28,620"
            fill="none" stroke="#44403c" strokeWidth="1.5" opacity="0.45"
          />
          <path
            d="M40,550 C45,540 38,530 42,520"
            fill="none" stroke="#44403c" strokeWidth="1.5" opacity="0.4"
          />
          {/* Knot / burl detail */}
          <ellipse cx="35" cy="680" rx="8" ry="6" fill="none" stroke="#292524" strokeWidth="1.5" opacity="0.5" />
          <ellipse cx="50" cy="480" rx="6" ry="5" fill="none" stroke="#292524" strokeWidth="1" opacity="0.4" />

          {/* ===== THE VINES (Ku Teng - Enhanced with more paths) ===== */}
          <g style={{ transformOrigin: '180px 150px', animation: `vine-wind ${vineDur}s ease-in-out infinite` }}>
            {/* Main branch vines */}
            <path d="M180,150 Q250,120 320,160 T420,140" fill="none" stroke="currentColor" strokeWidth="15" />
            <path d="M180,150 Q150,100 160,50" fill="none" stroke="currentColor" strokeWidth="10" />

            {/* Hanging Vines (4 vines with varying lengths and sway) */}
            <path
              d="M320,160 C320,250 310,350 330,450"
              fill="none" stroke={vineColor} strokeWidth="3"
              style={{ transformOrigin: '320px 160px', animation: `vine-wind ${vineDur * 1.2}s ease-in-out infinite` }}
            />
            <path
              d="M220,140 C220,220 230,300 210,380"
              fill="none" stroke={vineColor} strokeWidth="2"
              style={{ transformOrigin: '220px 140px', animation: `vine-wind ${vineDur * 0.8}s ease-in-out infinite`, animationDelay: '0.5s' }}
            />
            <path
              d="M380,145 C385,220 375,310 390,400"
              fill="none" stroke={vineColor} strokeWidth="2.5"
              style={{ transformOrigin: '380px 145px', animation: `vine-wind ${vineDur * 1.1}s ease-in-out infinite`, animationDelay: '1s' }}
            />
            <path
              d="M270,155 C265,230 275,290 260,360"
              fill="none" stroke={vineColor} strokeWidth="2"
              style={{ transformOrigin: '270px 155px', animation: `vine-wind ${vineDur * 0.9}s ease-in-out infinite`, animationDelay: '1.5s' }}
            />
            {/* Thin tendril curls */}
            <path
              d="M330,450 C340,460 335,475 325,470"
              fill="none" stroke={vineColor} strokeWidth="1.5" opacity="0.7"
            />
            <path
              d="M210,380 C200,390 205,405 215,400"
              fill="none" stroke={vineColor} strokeWidth="1" opacity="0.6"
            />
          </g>

          {/* ===== FOLIAGE & DECORATION LAYERS ===== */}

          {/* Spring Sprouts / Young Leaves */}
          {(state === 'sprout' || state === 'young_leaves') && (
            <g stroke={state === 'sprout' ? '#bef264' : '#4ade80'} strokeWidth="2" fill="none">
              <path d="M160,50 Q140,200 150,400" className="animate-vine" />
              <path d="M420,140 Q400,300 430,500" className="animate-vine" style={{ animationDelay: '1s' }} />
              {state === 'young_leaves' && (
                <>
                  <circle cx="170" cy="120" r="3" fill="#4ade80" opacity="0.6" />
                  <circle cx="350" cy="170" r="2.5" fill="#4ade80" opacity="0.5" />
                </>
              )}
            </g>
          )}

          {/* Summer Lush */}
          {state === 'lush' && (
            <g fill="#14532d" opacity="0.8" filter="blur(2px)">
              <circle cx="180" cy="150" r="80" />
              <circle cx="320" cy="160" r="70" />
              <circle cx="400" cy="120" r="60" />
              <circle cx="160" cy="50" r="50" />
            </g>
          )}

          {/* Fruit state */}
          {state === 'fruit' && (
            <g>
              {/* Foliage base */}
              <g fill="#166534" opacity="0.7" filter="blur(2px)">
                <circle cx="180" cy="150" r="70" />
                <circle cx="320" cy="160" r="60" />
                <circle cx="400" cy="120" r="50" />
              </g>
              {/* Small fruits */}
              <circle cx="250" cy="170" r="5" fill="#f97316" opacity="0.85" />
              <circle cx="300" cy="140" r="4" fill="#ea580c" opacity="0.8" />
              <circle cx="370" cy="155" r="4.5" fill="#f97316" opacity="0.85" />
              <circle cx="200" cy="130" r="3.5" fill="#ea580c" opacity="0.75" />
              <circle cx="340" cy="180" r="5" fill="#f97316" opacity="0.8" />
            </g>
          )}

          {/* Autumn Red Maple */}
          {state === 'red_maple' && (
            <g fill="#b91c1c" opacity="0.7">
              <circle cx="300" cy="140" r="10" />
              <circle cx="350" cy="180" r="12" />
              <circle cx="400" cy="150" r="8" />
              <circle cx="220" cy="120" r="9" />
              <path d="M320,160 L330,180 L310,180 Z" fill="#b91c1c" className="animate-tumble" />
              <path d="M250,130 L260,150 L240,150 Z" fill="#991b1b" opacity="0.6" className="animate-tumble" style={{ animationDelay: '2s' }} />
            </g>
          )}

          {/* Withered state (sparse dead leaves) */}
          {state === 'withered' && (
            <g>
              {/* A few clinging brown leaves */}
              <ellipse cx="280" cy="145" rx="6" ry="3" fill="#78350f" opacity="0.5" transform="rotate(20 280 145)" />
              <ellipse cx="350" cy="165" rx="5" ry="2.5" fill="#92400e" opacity="0.45" transform="rotate(-15 350 165)" />
              <ellipse cx="200" cy="110" rx="4" ry="2" fill="#78350f" opacity="0.4" transform="rotate(30 200 110)" />
              {/* Bare twig ends */}
              <path d="M420,140 L440,130 L445,125" fill="none" stroke="#44403c" strokeWidth="1.5" opacity="0.6" />
              <path d="M160,50 L150,35 L145,30" fill="none" stroke="#44403c" strokeWidth="1" opacity="0.5" />
            </g>
          )}

          {/* Bare (no foliage, just the trunk and vines) */}
          {state === 'bare' && (
            <g>
              <path d="M420,140 L445,128 L450,120" fill="none" stroke="#44403c" strokeWidth="1.5" opacity="0.5" />
              <path d="M160,50 L148,32" fill="none" stroke="#44403c" strokeWidth="1" opacity="0.4" />
            </g>
          )}

          {/* ===== Winter Snow / Plum Bloom ===== */}
          {(state === 'snow_laden' || state === 'plum_bloom') && (
            <g>
              {state === 'snow_laden' && (
                <>
                  {/* Snow line along branches */}
                  <path
                    d="M180,140 Q250,110 320,150 T420,130"
                    fill="none" stroke="#f8fafc" strokeWidth="6" opacity="0.8" strokeLinecap="round"
                  />
                  {/* Snow clumps on branches */}
                  <ellipse cx="180" cy="142" rx="14" ry="6" fill="#f1f5f9" opacity="0.85" />
                  <ellipse cx="260" cy="132" rx="12" ry="5" fill="#e2e8f0" opacity="0.8" />
                  <ellipse cx="340" cy="148" rx="10" ry="5" fill="#f1f5f9" opacity="0.75" />
                  <ellipse cx="410" cy="130" rx="8" ry="4" fill="#e2e8f0" opacity="0.7" />
                  {/* Snow on trunk fork */}
                  <ellipse cx="55" cy="695" rx="10" ry="4" fill="#f1f5f9" opacity="0.6" />
                </>
              )}
              {state === 'plum_bloom' && (
                <g>
                  {/* Plum blossoms with varying sizes */}
                  <circle cx="250" cy="150" r="4" fill="#be123c" />
                  <circle cx="320" cy="160" r="5" fill="#be123c" />
                  <circle cx="160" cy="50" r="3" fill="#be123c" />
                  <circle cx="290" cy="135" r="3.5" fill="#e11d48" opacity="0.8" />
                  <circle cx="370" cy="150" r="4.5" fill="#be123c" opacity="0.9" />
                  <circle cx="200" cy="100" r="2.5" fill="#e11d48" opacity="0.7" />
                  <circle cx="340" cy="175" r="3" fill="#f43f5e" opacity="0.6" />
                  {/* Petal details (tiny inner circles) */}
                  <circle cx="250" cy="150" r="1.5" fill="#fda4af" opacity="0.5" />
                  <circle cx="320" cy="160" r="2" fill="#fda4af" opacity="0.5" />
                  <circle cx="370" cy="150" r="1.8" fill="#fda4af" opacity="0.4" />
                </g>
              )}
            </g>
          )}

          {/* ===== Festival Lanterns (Enhanced with glow) ===== */}
          {state.includes('lanterns') && (
            <g>
              {/* Lantern strings */}
              <line x1="250" y1="130" x2="250" y2="200" stroke="#78350f" strokeWidth="1" />
              <line x1="350" y1="160" x2="350" y2="220" stroke="#78350f" strokeWidth="1" />
              <line x1="190" y1="110" x2="190" y2="170" stroke="#78350f" strokeWidth="1" />

              {/* Lantern bodies with glow */}
              <g filter="url(#lanternGlow)">
                <rect x="235" y="200" width="30" height="40" rx="10"
                  fill={state === 'lanterns_gold' ? '#facc15' : '#dc2626'} opacity="0.9" />
                <rect x="335" y="220" width="30" height="40" rx="10"
                  fill={state === 'lanterns_gold' ? '#facc15' : '#dc2626'} opacity="0.9" />
                <rect x="175" y="170" width="28" height="36" rx="9"
                  fill={state === 'lanterns_gold' ? '#fbbf24' : '#ef4444'} opacity="0.85" />
              </g>

              {/* Lantern top/bottom caps */}
              <rect x="240" y="196" width="20" height="4" rx="1" fill="#78350f" />
              <rect x="240" y="240" width="20" height="4" rx="1" fill="#78350f" />
              <rect x="340" y="216" width="20" height="4" rx="1" fill="#78350f" />
              <rect x="340" y="260" width="20" height="4" rx="1" fill="#78350f" />
              <rect x="180" y="166" width="18" height="4" rx="1" fill="#78350f" />
              <rect x="180" y="206" width="18" height="4" rx="1" fill="#78350f" />

              {/* Tassels */}
              <line x1="250" y1="244" x2="250" y2="280" stroke={state === 'lanterns_gold' ? '#b45309' : '#b91c1c'} strokeWidth="2" />
              <line x1="350" y1="264" x2="350" y2="300" stroke={state === 'lanterns_gold' ? '#b45309' : '#b91c1c'} strokeWidth="2" />
              <line x1="189" y1="210" x2="189" y2="240" stroke={state === 'lanterns_gold' ? '#b45309' : '#b91c1c'} strokeWidth="1.5" />

              {/* Lantern character decoration (福 / 喜) */}
              <text x="250" y="226" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" opacity="0.7">
                {state === 'lanterns_gold' ? '庆' : '福'}
              </text>
              <text x="350" y="246" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" opacity="0.7">
                {state === 'lanterns_gold' ? '国' : '春'}
              </text>
            </g>
          )}
        </g>
      </svg>
    </>
  );
};

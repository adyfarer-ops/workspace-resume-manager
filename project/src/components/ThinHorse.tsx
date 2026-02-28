import React from 'react';
import type { HorseState } from '../types';

interface ThinHorseProps {
  state: HorseState;
  windIntensity: number;
}

/** Map wind intensity (0-1) to mane/tail swing degrees. */
const getSwingDeg = (wind: number): number => Math.max(2, wind * 12);

/** Map wind intensity to animation duration (seconds). */
const getSwingDuration = (wind: number): number => Math.max(2, 6 - wind * 4);

/**
 * ThinHorse (瘦马) — minimalist ink-wash style thin horse silhouette.
 * Poses change based on HorseState; mane & tail sway with wind.
 *
 * Validates: Requirements 3.2, 3.5, 7.1
 */
export const ThinHorse = ({ state, windIntensity }: ThinHorseProps) => {
  const swingDeg = getSwingDeg(windIntensity);
  const swingDur = getSwingDuration(windIntensity);

  return (
    <>
      <style>{`
        @keyframes mane-sway {
          0%, 100% { transform: rotate(-${swingDeg}deg); }
          50% { transform: rotate(${swingDeg}deg); }
        }
        @keyframes tail-sway {
          0%, 100% { transform: rotate(${swingDeg}deg); }
          50% { transform: rotate(-${swingDeg}deg); }
        }
      `}</style>

      <svg
        className="absolute bottom-28 left-[15%] md:left-[20%] w-40 md:w-52 h-auto pointer-events-none -z-10 opacity-75 mix-blend-multiply transition-all duration-1000 scene-transition"
        viewBox="0 0 200 220"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <filter id="horseInk">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        <g filter="url(#horseInk)">
          {/* === BODY === */}
          {/* Thin, bony torso — the defining "瘦马" shape */}
          <path
            d={state === 'summer_drinking'
              ? 'M60,100 C75,95 110,90 140,100 C155,105 160,115 145,120 C120,128 80,125 60,115 Z'
              : 'M60,105 C75,95 115,88 145,95 C160,100 162,112 148,118 C125,128 78,125 60,115 Z'}
            fill="#292524"
            opacity="0.85"
          />
          {/* Visible ribs — ink strokes for the gaunt look */}
          <path d="M80,102 C85,98 95,97 100,100" fill="none" stroke="#44403c" strokeWidth="1" opacity="0.4" />
          <path d="M90,106 C95,102 105,101 110,104" fill="none" stroke="#44403c" strokeWidth="1" opacity="0.35" />
          <path d="M100,110 C105,106 115,105 120,108" fill="none" stroke="#44403c" strokeWidth="0.8" opacity="0.3" />

          {/* === NECK & HEAD === */}
          {state === 'summer_drinking' ? (
            /* Drinking pose — neck curves down, head near ground */
            <g>
              <path
                d="M65,105 C55,110 40,130 35,155 C32,165 30,175 35,178"
                fill="none" stroke="#292524" strokeWidth="8" strokeLinecap="round"
              />
              {/* Head lowered */}
              <ellipse cx="38" cy="178" rx="12" ry="7" fill="#292524" transform="rotate(15 38 178)" />
              {/* Ear */}
              <path d="M32,172 L28,164 L34,168" fill="#292524" />
              {/* Eye */}
              <circle cx="44" cy="176" r="1.2" fill="#78716c" opacity="0.6" />
            </g>
          ) : state === 'autumn_weary' ? (
            /* Weary drooping pose — head hangs low, neck curved */
            <g>
              <path
                d="M65,105 C50,100 35,110 28,135 C24,148 26,158 30,162"
                fill="none" stroke="#292524" strokeWidth="8" strokeLinecap="round"
              />
              <ellipse cx="32" cy="162" rx="11" ry="6.5" fill="#292524" transform="rotate(25 32 162)" />
              <path d="M26,156 L22,148 L28,153" fill="#292524" />
              <circle cx="38" cy="160" r="1.2" fill="#78716c" opacity="0.6" />
            </g>
          ) : (
            /* Default upright / slightly raised head (spring, winter, festival) */
            <g>
              <path
                d={state === 'spring_flowers'
                  ? 'M65,105 C55,90 42,70 38,50 C36,42 38,35 42,32'
                  : 'M65,105 C55,92 45,75 40,58 C38,50 39,42 43,38'}
                fill="none" stroke="#292524" strokeWidth="8" strokeLinecap="round"
              />
              <ellipse
                cx={state === 'spring_flowers' ? 42 : 43}
                cy={state === 'spring_flowers' ? 32 : 38}
                rx="11" ry="6" fill="#292524"
                transform={`rotate(-20 ${state === 'spring_flowers' ? 42 : 43} ${state === 'spring_flowers' ? 32 : 38})`}
              />
              {/* Ears */}
              <path
                d={state === 'spring_flowers'
                  ? 'M38,26 L34,16 L40,22'
                  : 'M39,32 L35,22 L41,28'}
                fill="#292524"
              />
              {/* Eye */}
              <circle
                cx={state === 'spring_flowers' ? 48 : 49}
                cy={state === 'spring_flowers' ? 30 : 36}
                r="1.2" fill="#78716c" opacity="0.6"
              />
            </g>
          )}

          {/* === MANE (wind-animated) === */}
          <g style={{
            transformOrigin: state === 'summer_drinking' ? '55px 110px' : '55px 85px',
            animation: `mane-sway ${swingDur}s ease-in-out infinite`,
          }}>
            {state === 'summer_drinking' ? (
              <>
                <path d="M55,110 C48,118 42,128 38,140" fill="none" stroke="#292524" strokeWidth="2" opacity="0.6" />
                <path d="M58,112 C52,120 46,132 44,142" fill="none" stroke="#1c1917" strokeWidth="1.5" opacity="0.5" />
              </>
            ) : state === 'autumn_weary' ? (
              <>
                <path d="M55,100 C48,108 38,118 30,130" fill="none" stroke="#292524" strokeWidth="2" opacity="0.6" />
                <path d="M58,102 C50,112 42,122 36,132" fill="none" stroke="#1c1917" strokeWidth="1.5" opacity="0.5" />
              </>
            ) : (
              <>
                <path d="M55,85 C48,75 42,65 38,55" fill="none" stroke="#292524" strokeWidth="2" opacity="0.6" />
                <path d="M58,88 C50,78 44,68 40,58" fill="none" stroke="#1c1917" strokeWidth="1.5" opacity="0.5" />
                <path d="M52,82 C46,72 40,62 36,52" fill="none" stroke="#292524" strokeWidth="1" opacity="0.4" />
              </>
            )}
          </g>

          {/* === LEGS (thin, bony) === */}
          {/* Front legs */}
          <path d="M75,118 L72,165 L70,195" fill="none" stroke="#292524" strokeWidth="4" strokeLinecap="round" />
          <path d="M90,120 L88,168 L86,195" fill="none" stroke="#292524" strokeWidth="3.5" strokeLinecap="round" />
          {/* Rear legs */}
          <path d="M125,118 L128,160 L130,195" fill="none" stroke="#292524" strokeWidth="4" strokeLinecap="round" />
          <path d="M140,115 L144,158 L146,195" fill="none" stroke="#292524" strokeWidth="3.5" strokeLinecap="round" />
          {/* Hooves */}
          <ellipse cx="70" cy="197" rx="4" ry="2" fill="#1c1917" />
          <ellipse cx="86" cy="197" rx="4" ry="2" fill="#1c1917" />
          <ellipse cx="130" cy="197" rx="4" ry="2" fill="#1c1917" />
          <ellipse cx="146" cy="197" rx="4" ry="2" fill="#1c1917" />
          {/* Knee joints */}
          <circle cx="72" cy="165" r="2.5" fill="#292524" opacity="0.5" />
          <circle cx="128" cy="160" r="2.5" fill="#292524" opacity="0.5" />

          {/* === TAIL (wind-animated) === */}
          <g style={{
            transformOrigin: '148px 100px',
            animation: `tail-sway ${swingDur * 1.1}s ease-in-out infinite`,
          }}>
            <path d="M148,100 C160,95 172,100 178,115 C182,125 180,140 175,150" fill="none" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            <path d="M148,102 C158,98 168,105 174,118" fill="none" stroke="#1c1917" strokeWidth="2" opacity="0.5" />
          </g>

          {/* === STATE-SPECIFIC DECORATIONS === */}

          {/* Spring: flower decorations on the horse */}
          {state === 'spring_flowers' && (
            <g>
              {/* Small flowers on mane area */}
              <circle cx="50" cy="75" r="3" fill="#f472b6" opacity="0.8" />
              <circle cx="50" cy="75" r="1.2" fill="#fda4af" opacity="0.6" />
              <circle cx="58" cy="68" r="2.5" fill="#fb7185" opacity="0.7" />
              {/* Flower garland on back */}
              <circle cx="85" cy="92" r="3" fill="#f9a8d4" opacity="0.7" />
              <circle cx="100" cy="90" r="2.5" fill="#f472b6" opacity="0.65" />
              <circle cx="115" cy="91" r="3" fill="#fb7185" opacity="0.7" />
              <circle cx="130" cy="94" r="2.5" fill="#f9a8d4" opacity="0.65" />
              {/* Tiny petals scattered */}
              <ellipse cx="75" cy="88" rx="2" ry="1" fill="#fda4af" opacity="0.5" transform="rotate(30 75 88)" />
              <ellipse cx="110" cy="86" rx="1.5" ry="0.8" fill="#fda4af" opacity="0.45" transform="rotate(-20 110 86)" />
            </g>
          )}

          {/* Summer: water ripples near hooves (drinking) */}
          {state === 'summer_drinking' && (
            <g>
              {/* Water surface line */}
              <path d="M20,195 C40,192 60,196 80,193 C100,190 120,194 140,192" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.4" />
              {/* Ripples around front hooves */}
              <ellipse cx="70" cy="198" rx="12" ry="3" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.35" />
              <ellipse cx="70" cy="198" rx="18" ry="4" fill="none" stroke="#94a3b8" strokeWidth="0.5" opacity="0.2" />
              {/* Water drops near mouth */}
              <circle cx="40" cy="182" r="1" fill="#94a3b8" opacity="0.4" />
              <circle cx="36" cy="185" r="0.8" fill="#94a3b8" opacity="0.3" />
            </g>
          )}

          {/* Winter: snow on back and head */}
          {state === 'winter_snow' && (
            <g>
              {/* Snow layer on back */}
              <path
                d="M65,98 C80,90 115,84 145,90"
                fill="none" stroke="#f1f5f9" strokeWidth="5" strokeLinecap="round" opacity="0.8"
              />
              {/* Snow clumps */}
              <ellipse cx="90" cy="92" rx="10" ry="4" fill="#e2e8f0" opacity="0.75" />
              <ellipse cx="120" cy="89" rx="8" ry="3.5" fill="#f1f5f9" opacity="0.7" />
              {/* Snow on head */}
              <ellipse cx="43" cy="34" rx="6" ry="2.5" fill="#f1f5f9" opacity="0.7" />
              {/* Falling snowflakes nearby */}
              <circle cx="55" cy="50" r="1.5" fill="#e2e8f0" opacity="0.5" />
              <circle cx="130" cy="70" r="1" fill="#f1f5f9" opacity="0.4" />
              <circle cx="160" cy="85" r="1.2" fill="#e2e8f0" opacity="0.45" />
            </g>
          )}

          {/* Festival: red ribbons and decorations */}
          {state === 'festival_decorated' && (
            <g>
              {/* Red ribbon on neck */}
              <path d="M55,85 C50,90 45,95 42,100" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.85" />
              <path d="M42,100 C38,108 35,118 40,122" fill="none" stroke="#dc2626" strokeWidth="2.5" opacity="0.75" />
              {/* Ribbon bow */}
              <path d="M55,85 C60,80 65,82 58,88" fill="#dc2626" opacity="0.8" />
              <path d="M55,85 C50,80 48,84 53,88" fill="#ef4444" opacity="0.75" />
              {/* Red tassel on tail */}
              <circle cx="175" cy="152" r="4" fill="#dc2626" opacity="0.8" />
              <path d="M175,156 L173,168" stroke="#dc2626" strokeWidth="1.5" opacity="0.7" />
              <path d="M175,156 L177,167" stroke="#b91c1c" strokeWidth="1.5" opacity="0.65" />
              {/* Small golden bell on neck */}
              <circle cx="60" cy="98" r="3" fill="#facc15" opacity="0.8" />
              <circle cx="60" cy="98" r="1.5" fill="#eab308" opacity="0.6" />
              {/* Red forehead ornament */}
              <circle cx="43" cy="35" r="2.5" fill="#dc2626" opacity="0.8" />
            </g>
          )}
        </g>
      </svg>
    </>
  );
};

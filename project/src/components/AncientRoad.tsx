import React from 'react';

/**
 * AncientRoad (古道) — a winding dashed ink-wash path with weathered/mottled texture.
 * Renders as a background visual element using inline SVG with feTurbulence filter
 * for the classic ink-wash speckled effect.
 *
 * Validates: Requirements 3.1
 */
export const AncientRoad = () => {
  return (
    <svg
      className="absolute bottom-32 left-0 w-full h-64 pointer-events-none -z-10 opacity-70 mix-blend-multiply transition-all duration-1000 scene-transition"
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Weathered / mottled texture filter */}
        <filter id="roadTexture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="4"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter="url(#roadTexture)">
        {/* Main winding road path — dashed ink stroke */}
        <path
          d="M-20,260 C80,240 160,200 260,210 C360,220 420,180 520,170 C620,160 700,190 800,175 C900,160 960,140 1020,130"
          fill="none"
          stroke="#57534e"
          strokeWidth="8"
          strokeDasharray="18,10"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Secondary edge line — thinner, more faded */}
        <path
          d="M-10,270 C90,250 170,212 270,222 C370,232 430,192 530,182 C630,172 710,200 810,186 C910,172 970,150 1030,140"
          fill="none"
          stroke="#78716c"
          strokeWidth="3"
          strokeDasharray="12,14"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Faint worn ruts / texture marks along the road */}
        <path
          d="M60,248 C140,230 220,208 310,215"
          fill="none"
          stroke="#a8a29e"
          strokeWidth="1.5"
          strokeDasharray="4,8"
          opacity="0.3"
        />
        <path
          d="M450,178 C530,168 610,182 700,180"
          fill="none"
          stroke="#a8a29e"
          strokeWidth="1"
          strokeDasharray="3,10"
          opacity="0.25"
        />
        <path
          d="M780,180 C850,170 920,148 980,138"
          fill="none"
          stroke="#a8a29e"
          strokeWidth="1.5"
          strokeDasharray="5,9"
          opacity="0.2"
        />

        {/* Scattered ink speckles along the road for worn feel */}
        <circle cx="120" cy="245" r="2" fill="#57534e" opacity="0.25" />
        <circle cx="300" cy="215" r="1.5" fill="#78716c" opacity="0.2" />
        <circle cx="480" cy="178" r="2.5" fill="#57534e" opacity="0.2" />
        <circle cx="650" cy="175" r="1.8" fill="#78716c" opacity="0.18" />
        <circle cx="850" cy="170" r="2" fill="#57534e" opacity="0.15" />
        <circle cx="950" cy="140" r="1.5" fill="#78716c" opacity="0.2" />
      </g>
    </svg>
  );
};

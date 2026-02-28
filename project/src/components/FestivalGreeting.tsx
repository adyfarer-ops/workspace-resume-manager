import React from 'react';
import type { FestivalType } from '../types';

interface FestivalGreetingProps {
  festival: FestivalType | null;
  greeting: string;
}

/**
 * FestivalGreeting (节日祝福) — calligraphy-style greeting card shown prominently
 * during festival themes. Features a decorative Chinese-style border and fade-in
 * animation. Renders nothing when no festival is active.
 *
 * Validates: Requirements 8.4, 8.5
 */
export const FestivalGreeting = ({ festival, greeting }: FestivalGreetingProps) => {
  if (!festival) return null;

  return (
    <>
      <style>{`
        @keyframes greeting-fade-in {
          0% { opacity: 0; transform: translateY(-12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes corner-shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        className="fixed top-20 left-0 right-0 flex justify-center z-20 pointer-events-none transition-all duration-700"
        style={{ animation: 'greeting-fade-in 1.2s ease-out both' }}
      >
        <div className="relative px-6 py-8 flex items-center justify-center">
          {/* Decorative corner ornaments — Chinese-style bracket corners */}
          {/* Top-left */}
          <svg className="absolute top-0 left-0 w-8 h-8" viewBox="0 0 32 32" fill="none"
            style={{ animation: 'corner-shimmer 3s ease-in-out infinite' }}>
            <path d="M2 30 V6 Q2 2 6 2 H30" stroke="currentColor" strokeWidth="2.5"
              className="text-red-700/70" fill="none" strokeLinecap="round" />
            <circle cx="6" cy="6" r="1.5" className="fill-red-600/50" />
          </svg>
          {/* Top-right */}
          <svg className="absolute top-0 right-0 w-8 h-8" viewBox="0 0 32 32" fill="none"
            style={{ animation: 'corner-shimmer 3s ease-in-out infinite', animationDelay: '0.5s' }}>
            <path d="M30 30 V6 Q30 2 26 2 H2" stroke="currentColor" strokeWidth="2.5"
              className="text-red-700/70" fill="none" strokeLinecap="round" />
            <circle cx="26" cy="6" r="1.5" className="fill-red-600/50" />
          </svg>
          {/* Bottom-left */}
          <svg className="absolute bottom-0 left-0 w-8 h-8" viewBox="0 0 32 32" fill="none"
            style={{ animation: 'corner-shimmer 3s ease-in-out infinite', animationDelay: '1s' }}>
            <path d="M2 2 V26 Q2 30 6 30 H30" stroke="currentColor" strokeWidth="2.5"
              className="text-red-700/70" fill="none" strokeLinecap="round" />
            <circle cx="6" cy="26" r="1.5" className="fill-red-600/50" />
          </svg>
          {/* Bottom-right */}
          <svg className="absolute bottom-0 right-0 w-8 h-8" viewBox="0 0 32 32" fill="none"
            style={{ animation: 'corner-shimmer 3s ease-in-out infinite', animationDelay: '1.5s' }}>
            <path d="M30 2 V26 Q30 30 26 30 H2" stroke="currentColor" strokeWidth="2.5"
              className="text-red-700/70" fill="none" strokeLinecap="round" />
            <circle cx="26" cy="26" r="1.5" className="fill-red-600/50" />
          </svg>

          {/* Inner border line */}
          <div className="absolute inset-3 border border-red-800/20 rounded-sm" />

          {/* Greeting text — vertical calligraphy */}
          <p
            className="font-calligraphy text-lg md:text-2xl text-stone-800/90 select-none tracking-[0.3em] md:tracking-[0.4em]"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            {greeting}
          </p>
        </div>
      </div>
    </>
  );
};

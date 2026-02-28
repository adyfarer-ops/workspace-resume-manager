import React from 'react';
import { Cottage } from './Cottage';
import type { CottageState } from '../types';
import type { WaterElement } from '../utils/themeRegistry';

interface BridgeWaterSceneProps {
  waterClass: string;
  element: WaterElement;
  cottageState: CottageState;
  showSmoke: boolean;
}

/** Render dynamic water surface elements based on the current theme's waterElement. */
function WaterElements({ element }: { element: WaterElement }) {
  switch (element) {
    case 'lotus':
      return (
        <>
          {/* Pink lotus flower */}
          <div className="w-10 h-10 animate-boat" style={{ animationDelay: '0.5s' }}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <ellipse cx="20" cy="28" rx="12" ry="4" fill="#166534" opacity="0.5" />
              <path d="M20,10 Q14,18 16,24 Q20,20 20,10Z" fill="#f9a8d4" opacity="0.85" />
              <path d="M20,10 Q26,18 24,24 Q20,20 20,10Z" fill="#fda4af" opacity="0.8" />
              <path d="M20,12 Q17,20 19,24 Q20,22 20,12Z" fill="#fce7f3" opacity="0.7" />
              <circle cx="20" cy="16" r="1.5" fill="#fbbf24" opacity="0.9" />
            </svg>
          </div>
          {/* Green lily pad */}
          <div className="w-14 h-8 animate-boat" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 50 30" className="w-full h-full">
              <ellipse cx="25" cy="15" rx="20" ry="10" fill="#166534" opacity="0.45" />
              <path d="M25,5 L25,15" fill="none" stroke="#15803d" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>
          {/* Second smaller lotus */}
          <div className="w-7 h-7 animate-boat" style={{ animationDelay: '3.5s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <path d="M15,8 Q11,14 13,19 Q15,16 15,8Z" fill="#fda4af" opacity="0.7" />
              <path d="M15,8 Q19,14 17,19 Q15,16 15,8Z" fill="#f9a8d4" opacity="0.65" />
              <circle cx="15" cy="12" r="1" fill="#fbbf24" opacity="0.8" />
            </svg>
          </div>
        </>
      );

    case 'ice':
      return (
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
          {/* Ice crack lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M50,20 L80,50 L120,35 L150,60" fill="none" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
            <path d="M200,10 L230,45 L260,30 L300,55" fill="none" stroke="#93c5fd" strokeWidth="0.6" opacity="0.4" />
            <path d="M320,25 L350,50 L380,40" fill="none" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.35" />
          </svg>
        </div>
      );

    case 'river_lanterns':
      return (
        <>
          {[0, 1.8, 3.5].map((delay, i) => (
            <div key={i} className="animate-boat" style={{ animationDelay: `${delay}s` }}>
              <svg width="28" height="36" viewBox="0 0 28 36" className="overflow-visible">
                {/* Glow */}
                <circle cx="14" cy="18" r="14" fill="#fbbf24" opacity="0.15" />
                {/* Lantern body */}
                <rect x="6" y="10" width="16" height="18" rx="3" fill="#dc2626" opacity="0.85" />
                {/* Inner glow */}
                <rect x="9" y="13" width="10" height="12" rx="2" fill="#fbbf24" opacity="0.3" />
                {/* Top cap */}
                <rect x="8" y="8" width="12" height="3" rx="1" fill="#78350f" />
                {/* Bottom tassel */}
                <line x1="14" y1="28" x2="14" y2="34" stroke="#b91c1c" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </>
      );

    case 'fallen_petals':
      return (
        <>
          {[
            { x: '10%', delay: '0s', size: 'w-3 h-3' },
            { x: '30%', delay: '1.2s', size: 'w-2 h-2' },
            { x: '55%', delay: '2.5s', size: 'w-3 h-3' },
            { x: '75%', delay: '0.8s', size: 'w-2 h-2' },
            { x: '90%', delay: '3s', size: 'w-2 h-2' },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.size} animate-boat`}
              style={{ left: p.x, animationDelay: p.delay, top: '40%' }}
            >
              <svg viewBox="0 0 10 10" className="w-full h-full">
                <ellipse cx="5" cy="5" rx="4" ry="2.5" fill="#fda4af" opacity="0.7" transform="rotate(30 5 5)" />
              </svg>
            </div>
          ))}
        </>
      );

    case 'reflections':
      return (
        <div className="w-full h-full relative overflow-hidden">
          {/* Moon reflection */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-16 h-16 rounded-full bg-gradient-to-b from-white/30 to-transparent blur-[6px] animate-pulse" style={{ animationDuration: '4s' }} />
          {/* Shimmering light streaks */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <line x1="160" y1="30" x2="240" y2="30" stroke="white" strokeWidth="1" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="140" y1="50" x2="260" y2="50" stroke="white" strokeWidth="0.8" opacity="0.15">
              <animate attributeName="opacity" values="0.05;0.2;0.05" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="170" y1="70" x2="230" y2="70" stroke="white" strokeWidth="0.6" opacity="0.12">
              <animate attributeName="opacity" values="0.08;0.25;0.08" dur="3.5s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>
      );

    case 'withered_lotus':
      return (
        <>
          {/* Withered lotus leaf 1 — drooping brown */}
          <div className="w-12 h-10 animate-boat" style={{ animationDelay: '0.5s' }}>
            <svg viewBox="0 0 50 40" className="w-full h-full">
              <ellipse cx="25" cy="28" rx="18" ry="6" fill="#78350f" opacity="0.35" />
              <path d="M25,8 Q15,18 18,28 Q25,24 25,8Z" fill="#92400e" opacity="0.6" />
              <path d="M25,8 Q35,18 32,28 Q25,24 25,8Z" fill="#78350f" opacity="0.55" />
              {/* Curled edge — withered feel */}
              <path d="M18,28 Q12,22 16,16" fill="none" stroke="#57534e" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>
          {/* Broken stem */}
          <div className="w-6 h-12 animate-boat" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 20 50" className="w-full h-full">
              <line x1="10" y1="10" x2="10" y2="45" stroke="#57534e" strokeWidth="1.2" opacity="0.5" />
              <line x1="10" y1="10" x2="6" y2="5" stroke="#57534e" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          {/* Withered leaf 2 — smaller, tilted */}
          <div className="w-9 h-8 animate-boat" style={{ animationDelay: '3.5s' }}>
            <svg viewBox="0 0 40 35" className="w-full h-full">
              <ellipse cx="20" cy="24" rx="14" ry="5" fill="#78350f" opacity="0.3" />
              <path d="M20,6 Q12,14 15,24 Q20,20 20,6Z" fill="#451a03" opacity="0.5" transform="rotate(-10 20 15)" />
              <path d="M20,6 Q28,14 25,24 Q20,20 20,6Z" fill="#57534e" opacity="0.45" transform="rotate(-10 20 15)" />
            </svg>
          </div>
        </>
      );

    default:
      return null;
  }
}

/**
 * BridgeWaterScene (小桥流水人家) — the complete bridge, water, cottage, and boat scene.
 * Positioned at the bottom of the page (footer area).
 */
export const BridgeWaterScene = ({ waterClass, element, cottageState, showSmoke }: BridgeWaterSceneProps) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-0 overflow-hidden mix-blend-multiply scene-transition">
      {/* Mist layer */}
      <div className="animate-mist absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#e7e5e4] via-transparent to-transparent opacity-50 z-20" />

      {/* Cottage — positioned left of the bridge */}
      <div className="absolute bottom-16 right-[55%] md:right-[60%] z-10 opacity-85 transition-all duration-700">
        <Cottage state={cottageState} showSmoke={showSmoke} />
      </div>

      {/* The Bridge (Constant) */}
      <div className="absolute bottom-10 right-0 md:right-32 w-80 h-40 opacity-90 z-10 text-stone-800">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,100 Q100,20 200,100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M10,95 Q100,15 190,95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* The Boat — enhanced with a figure */}
      <div className="animate-boat absolute bottom-8 left-[20%] w-24 h-12 z-10 opacity-80 text-[#1c1917]">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Hull */}
          <path d="M10,30 Q50,45 90,30 L85,40 H15 Z" fill="currentColor" />
          {/* Mast */}
          <line x1="70" y1="30" x2="60" y2="10" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="10" r="2" fill="currentColor" />
          {/* Figure sitting in the boat */}
          <circle cx="45" cy="22" r="3" fill="currentColor" opacity="0.8" />
          <path d="M45,25 L45,32" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <path d="M42,28 L48,28" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {/* Fishing rod */}
          <path d="M48,26 Q60,18 72,22" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <line x1="72" y1="22" x2="74" y2="30" stroke="currentColor" strokeWidth="0.4" opacity="0.4" strokeDasharray="1,1" />
        </svg>
      </div>

      {/* Dynamic Water Elements */}
      <div className="absolute bottom-4 left-0 w-full h-32 z-10 flex justify-around items-center px-20">
        <WaterElements element={element} />
      </div>

      {/* Water wave layer 1 — slow */}
      <div className={`animate-wave-slow absolute bottom-4 w-[200%] h-32 flex opacity-30 transition-colors duration-1000 ${waterClass}`}>
        <svg width="50%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="fill-current">
          <path d="M0,50 C250,30 750,70 1000,50 V100 H0 Z" />
        </svg>
        <svg width="50%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="fill-current">
          <path d="M0,50 C250,30 750,70 1000,50 V100 H0 Z" />
        </svg>
      </div>

      {/* Water wave layer 2 — faster, darker */}
      <div className={`animate-wave absolute bottom-0 w-[200%] h-24 flex opacity-50 transition-colors duration-1000 ${waterClass} brightness-75`}>
        <svg width="50%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="fill-current">
          <path d="M0,60 C300,40 700,80 1000,60 V100 H0 Z" />
        </svg>
        <svg width="50%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="fill-current">
          <path d="M0,60 C300,40 700,80 1000,60 V100 H0 Z" />
        </svg>
      </div>
    </div>
  );
};

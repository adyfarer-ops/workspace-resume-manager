import React from 'react';
import type { ParticleType } from '../utils/themeRegistry';

interface SeasonalParticlesProps {
  type: ParticleType;
  color: string;
  festivalEffect?: string;
}

const seeded = (i: number, offset: number) => ((i * 2654435761 + offset) % 1000) / 1000;

export const SeasonalParticles = ({ type, color, festivalEffect }: SeasonalParticlesProps) => {
  return (
    <div key={type} className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {renderMainParticles(type, color)}
      {festivalEffect && renderFestivalEffect(festivalEffect)}
    </div>
  );
};

function renderMainParticles(type: ParticleType, color: string) {
  // 根据类型确定粒子数量
  const getCount = () => {
    switch (type) {
      case 'snow_heavy': return 60;
      case 'snow': return 35;
      case 'rain_heavy': return 50;
      case 'rain': return 30;
      case 'fireflies': return 25;
      case 'mist': return 15;
      case 'leaves': return 25;
      default: return 20;
    }
  };

  const count = getCount();

  return [...Array(count)].map((_, i) => {
    const size = seeded(i, 1) * 8 + 3;
    const duration = 8 + seeded(i, 2) * 12;
    const delay = seeded(i, 3) * 8;

    // ==================== 雨水系列 ====================
    if (type === 'rain' || type === 'rain_heavy') {
      const isHeavy = type === 'rain_heavy';
      return (
        <div key={i} className="absolute"
          style={{
            width: isHeavy ? '2px' : '1px',
            height: isHeavy ? (size * 4) + 'px' : (size * 3) + 'px',
            left: seeded(i, 4) * 100 + 'vw',
            top: -30 + 'px',
            background: `linear-gradient(to bottom, transparent, ${isHeavy ? '#94a3b8' : '#a8a29e'}, transparent)`,
            opacity: isHeavy ? 0.5 : 0.4,
            animation: `rain-fall ${isHeavy ? 0.6 : 1}s linear infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 雪花系列 ====================
    if (type === 'snow' || type === 'snow_heavy' || type === 'snow_drift') {
      const isHeavy = type === 'snow_heavy';
      const isDrift = type === 'snow_drift';
      return (
        <div key={i} className="absolute rounded-full"
          style={{
            width: isHeavy ? size + 'px' : (size * 0.7) + 'px',
            height: isHeavy ? size + 'px' : (size * 0.7) + 'px',
            left: seeded(i, 4) * 100 + 'vw',
            top: -20 + 'px',
            background: 'radial-gradient(circle at 30% 30%, white, #e2e8f0)',
            opacity: isHeavy ? 0.9 : 0.7,
            boxShadow: '0 0 3px rgba(255,255,255,0.5)',
            animation: isDrift ? `snow-drift ${duration}s ease-in-out infinite` : `snow-fall ${duration}s linear infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 萤火虫 ====================
    if (type === 'fireflies') {
      return (
        <div key={i} className="absolute rounded-full"
          style={{
            width: '4px',
            height: '4px',
            left: seeded(i, 4) * 100 + 'vw',
            top: seeded(i, 5) * 100 + 'vh',
            background: '#fef08a',
            boxShadow: '0 0 6px #fef08a, 0 0 12px #fde047',
            animation: `firefly-glow ${2 + seeded(i, 6) * 3}s ease-in-out infinite, firefly-float ${10 + seeded(i, 7) * 10}s ease-in-out infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 雾气 ====================
    if (type === 'mist') {
      return (
        <div key={i} className="absolute rounded-full"
          style={{
            width: (size * 10) + 'px',
            height: (size * 4) + 'px',
            left: seeded(i, 4) * 100 + 'vw',
            top: seeded(i, 5) * 70 + 20 + 'vh',
            background: 'radial-gradient(ellipse, rgba(200,200,200,0.15) 0%, transparent 70%)',
            filter: `blur(${size * 3}px)`,
            animation: `mist-drift ${duration * 2}s ease-in-out infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 金粉 ====================
    if (type === 'gold_dust') {
      const goldColors = ['#fbbf24', '#f59e0b', '#fde68a', '#facc15', '#eab308'];
      const gc = goldColors[i % goldColors.length];
      return (
        <div key={i} className="absolute rounded-full"
          style={{
            width: (seeded(i, 5) * 3 + 1) + 'px',
            height: (seeded(i, 5) * 3 + 1) + 'px',
            backgroundColor: gc,
            left: seeded(i, 4) * 100 + 'vw',
            top: seeded(i, 6) * 100 + 'vh',
            boxShadow: `0 0 4px ${gc}, 0 0 8px ${gc}`,
            animation: `gold-sparkle ${duration}s ease-in-out infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 蒲公英/柳絮 ====================
    if (type === 'dandelion' || type === 'willow_cats') {
      return (
        <svg key={i} className="absolute" width={size} height={size} viewBox="0 0 24 24"
          style={{
            left: seeded(i, 4) * 100 + 'vw',
            top: -10 + 'vh',
            animation: `dandelion-float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}>
          <circle cx="12" cy="12" r="2" fill={color} opacity="0.6" />
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <line key={j} x1="12" y1="12"
              x2={12 + 8 * Math.cos(angle * Math.PI / 180)}
              y2={12 + 8 * Math.sin(angle * Math.PI / 180)}
              stroke={color} strokeWidth="0.5" opacity="0.4" />
          ))}
        </svg>
      );
    }

    // ==================== 落叶系列 ====================
    if (type === 'leaves' || type === 'red_maple' || type === 'ginkgo') {
      const leafColors = type === 'red_maple' 
        ? ['#dc2626', '#b91c1c', '#991b1b', '#ef4444']
        : type === 'ginkgo'
        ? ['#fbbf24', '#f59e0b', '#facc15', '#eab308']
        : ['#a16207', '#ca8a04', '#d97706', '#b45309'];
      
      const lc = leafColors[i % leafColors.length];
      return (
        <svg key={i} className="absolute" width={size * 1.2} height={size * 1.2} viewBox="0 0 24 24"
          style={{
            left: seeded(i, 4) * 100 + 'vw',
            top: -10 + 'vh',
            animation: `leaf-fall ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}>
          <path d="M12 21C12 21 8 15 8 10C8 5 12 2 12 2C12 2 16 5 16 10C16 15 12 21 12 21Z" fill={lc} opacity="0.85" />
          <line x1="12" y1="21" x2="12" y2="18" stroke={lc} strokeWidth="0.8" />
        </svg>
      );
    }

    // ==================== 烟花 ====================
    if (type === 'fireworks') {
      const burstColors = ['#dc2626', '#f59e0b', '#ef4444', '#fbbf24', '#b91c1c', '#eab308'];
      const bc = burstColors[i % burstColors.length];
      return (
        <div key={i} className="absolute rounded-full"
          style={{
            width: (seeded(i, 5) * 4 + 2) + 'px',
            height: (seeded(i, 5) * 4 + 2) + 'px',
            left: seeded(i, 4) * 100 + 'vw',
            top: seeded(i, 6) * 70 + 'vh',
            backgroundColor: bc,
            boxShadow: `0 0 ${size + 4}px ${bc}, 0 0 ${size + 8}px ${color}`,
            animation: `firework-spark ${duration / 3}s ease-in-out infinite`,
            animationDelay: delay + 's'
          }} />
      );
    }

    // ==================== 梅花 ====================
    if (type === 'plum_blossom') {
      const pinkShades = ['#f472b6', '#ec4899', '#db2777', '#f9a8d4'];
      const pc = pinkShades[i % pinkShades.length];
      return (
        <svg key={i} className="absolute" width={size} height={size} viewBox="0 0 20 20"
          style={{
            left: seeded(i, 4) * 100 + 'vw',
            top: -10 + 'vh',
            animation: `blossom-fall ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}>
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse key={j} cx="10" cy="10" rx="3" ry="5"
              transform={`rotate(${angle} 10 10)`}
              fill={pc} opacity="0.7" />
          ))}
          <circle cx="10" cy="10" r="2" fill="#fbbf24" opacity="0.8" />
        </svg>
      );
    }

    // ==================== 荷花 ====================
    if (type === 'lotus_petals') {
      const lotusColors = ['#fbcfe8', '#f9a8d4', '#f472b6', '#fdf2f8'];
      const lpc = lotusColors[i % lotusColors.length];
      return (
        <svg key={i} className="absolute" width={size} height={size} viewBox="0 0 24 24"
          style={{
            left: seeded(i, 4) * 100 + 'vw',
            top: -10 + 'vh',
            animation: `petal-drift ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}>
          <ellipse cx="12" cy="12" rx="5" ry="8" fill={lpc} opacity="0.6" transform="rotate(45 12 12)" />
        </svg>
      );
    }

    // ==================== 杏花 ====================
    if (type === 'apricot_blossom') {
      return (
        <svg key={i} className="absolute" width={size} height={size} viewBox="0 0 20 20"
          style={{
            left: seeded(i, 4) * 100 + 'vw',
            top: -10 + 'vh',
            animation: `blossom-fall ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}>
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <ellipse key={j} cx="10" cy="10" rx="2" ry="4"
              transform={`rotate(${angle} 10 10)`}
              fill="#fdf2f8" opacity="0.8" />
          ))}
          <circle cx="10" cy="10" r="1.5" fill="#fbbf24" />
        </svg>
      );
    }

    // ==================== 默认花瓣 ====================
    const path = "M12 21C12 21 8 15 8 10C8 5 12 2 12 2C12 2 16 5 16 10C16 15 12 21 12 21Z";
    return (
      <svg key={i} className="absolute" width={size} height={size} viewBox="0 0 24 24"
        style={{
          left: seeded(i, 4) * 100 + 'vw',
          top: -10 + 'vh',
          animation: `petal-drift ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}>
        <path d={path} fill={color} opacity="0.8" />
      </svg>
    );
  });
}

// 节日特效保持不变
function renderFestivalEffect(effect: string) {
  switch (effect) {
    case 'fireworks':
      return renderCNYFireworks();
    case 'sky_lanterns':
      return renderSkyLanterns();
    case 'floating_lanterns':
      return renderFloatingLanterns();
    case 'gold_particles':
      return renderGoldParticles();
    default:
      return null;
  }
}

function renderCNYFireworks() {
  return (
    <>
      <style>{`
        @keyframes burst-spark {
          0% { transform: scale(0) translate(0, 0); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: scale(1) translate(var(--tx), var(--ty)); opacity: 0; }
        }
        @keyframes cracker-flash {
          0%, 100% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0.6; }
          25% { opacity: 0; }
        }
      `}</style>
      {[...Array(15)].map((_, i) => {
        const cx = seeded(i, 10) * 80 + 10;
        const cy = seeded(i, 11) * 50 + 5;
        const colors = ['#dc2626', '#f59e0b', '#fbbf24', '#ef4444', '#b91c1c'];
        const c = colors[i % colors.length];
        const tx = (seeded(i, 12) - 0.5) * 60;
        const ty = (seeded(i, 13) - 0.5) * 60;
        return (
          <div key={`fw-${i}`} className="absolute rounded-full"
            style={{
              width: '4px', height: '4px',
              left: cx + 'vw', top: cy + 'vh',
              backgroundColor: c,
              boxShadow: `0 0 6px ${c}, 0 0 12px ${c}`,
              '--tx': tx + 'px', '--ty': ty + 'px',
              animation: `burst-spark ${2 + seeded(i, 14) * 3}s ease-out infinite`,
              animationDelay: seeded(i, 15) * 4 + 's',
            } as React.CSSProperties} />
        );
      })}
      {[...Array(4)].map((_, i) => (
        <div key={`cr-${i}`} className="absolute rounded-full bg-yellow-200"
          style={{
            width: '8px', height: '8px',
            left: seeded(i, 20) * 90 + 5 + 'vw',
            top: seeded(i, 21) * 60 + 10 + 'vh',
            boxShadow: '0 0 20px #fde047, 0 0 40px #fbbf24',
            animation: `cracker-flash ${1.5 + seeded(i, 22) * 2}s ease-in-out infinite`,
            animationDelay: seeded(i, 23) * 5 + 's',
          }} />
      ))}
    </>
  );
}

function renderSkyLanterns() {
  return (
    <>
      <style>{`
        @keyframes lantern-rise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-110vh) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
      {[...Array(8)].map((_, i) => {
        const x = seeded(i, 30) * 90 + 5;
        const drift = (seeded(i, 31) - 0.5) * 80;
        const dur = 15 + seeded(i, 32) * 15;
        const w = 12 + seeded(i, 33) * 8;
        const h = w * 1.4;
        return (
          <div key={`sl-${i}`} className="absolute rounded-sm"
            style={{
              width: w + 'px', height: h + 'px',
              left: x + 'vw', bottom: '-20px',
              background: 'linear-gradient(to top, #f97316, #fbbf24, #fef3c7)',
              boxShadow: '0 0 12px #f97316, 0 0 24px #fbbf2480',
              borderRadius: '3px 3px 1px 1px',
              '--drift': drift + 'px',
              animation: `lantern-rise ${dur}s ease-in-out infinite`,
              animationDelay: seeded(i, 34) * 10 + 's',
            } as React.CSSProperties} />
        );
      })}
    </>
  );
}

function renderFloatingLanterns() {
  const lanternColors = ['#dc2626', '#ea580c', '#f59e0b', '#e11d48', '#c2410c', '#b91c1c'];
  return (
    <>
      <style>{`
        @keyframes lantern-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes lantern-flicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
      {[...Array(10)].map((_, i) => {
        const x = seeded(i, 40) * 90 + 5;
        const y = seeded(i, 41) * 70 + 10;
        const c = lanternColors[i % lanternColors.length];
        const sz = 14 + seeded(i, 42) * 10;
        return (
          <svg key={`fl-${i}`} className="absolute" width={sz} height={sz * 1.5} viewBox="0 0 20 30"
            style={{
              left: x + 'vw', top: y + 'vh',
              animation: `lantern-float ${4 + seeded(i, 43) * 4}s ease-in-out infinite, lantern-flicker ${2 + seeded(i, 44) * 2}s ease-in-out infinite`,
              animationDelay: seeded(i, 45) * 3 + 's',
              filter: `drop-shadow(0 0 6px ${c})`,
            }}>
            <ellipse cx="10" cy="15" rx="8" ry="10" fill={c} opacity="0.85" />
            <rect x="6" y="4" width="8" height="3" rx="1" fill="#7c2d12" />
            <line x1="8" y1="25" x2="8" y2="29" stroke={c} strokeWidth="0.8" opacity="0.6" />
            <line x1="10" y1="25" x2="10" y2="30" stroke={c} strokeWidth="0.8" opacity="0.6" />
            <line x1="12" y1="25" x2="12" y2="29" stroke={c} strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="10" cy="15" rx="4" ry="5" fill="#fef3c7" opacity="0.4" />
          </svg>
        );
      })}
    </>
  );
}

function renderGoldParticles() {
  return (
    <>
      <style>{`
        @keyframes gold-sparkle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { transform: translateY(-10px) scale(1); opacity: 1; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-80px) scale(0.5); opacity: 0; }
        }
        @keyframes red-accent-drift {
          0% { transform: translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translateX(-60px) rotate(180deg); opacity: 0; }
        }
      `}</style>
      {[...Array(12)].map((_, i) => {
        const goldShades = ['#fbbf24', '#f59e0b', '#fde68a', '#facc15', '#eab308'];
        const gc = goldShades[i % goldShades.length];
        return (
          <div key={`gs-${i}`} className="absolute"
            style={{
              width: '3px', height: '3px',
              left: seeded(i, 50) * 95 + 'vw',
              top: seeded(i, 51) * 80 + 10 + 'vh',
              backgroundColor: gc,
              borderRadius: '50%',
              boxShadow: `0 0 4px ${gc}, 0 0 8px ${gc}`,
              animation: `gold-sparkle ${3 + seeded(i, 52) * 4}s ease-out infinite`,
              animationDelay: seeded(i, 53) * 5 + 's',
            }} />
        );
      })}
      {[...Array(5)].map((_, i) => (
        <div key={`ra-${i}`} className="absolute rounded-full"
          style={{
            width: '5px', height: '5px',
            left: seeded(i, 60) * 90 + 5 + 'vw',
            top: seeded(i, 61) * 70 + 15 + 'vh',
            backgroundColor: '#dc2626',
            boxShadow: '0 0 6px #dc2626',
            animation: `red-accent-drift ${5 + seeded(i, 62) * 5}s ease-in-out infinite`,
            animationDelay: seeded(i, 63) * 6 + 's',
          }} />
      ))}
    </>
  );
}

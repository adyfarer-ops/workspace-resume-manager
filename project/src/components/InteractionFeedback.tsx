import { useEffect, useCallback } from 'react';
import type { SeasonType } from '../utils/themeRegistry';

interface ThemeColors {
  primary: string;
  secondary: string;
}

interface InteractionFeedbackProps {
  seasonType: SeasonType;
  themeColors: ThemeColors;
  festivalType?: string;
}

interface ParticleConfig {
  count: number;
  createParticle: (x: number, y: number, i: number) => HTMLElement;
  duration: number;
}

// --- Particle factory helpers ---

function createPetalParticle(x: number, y: number, i: number, color: string): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
  const dist = 30 + Math.random() * 40;
  const size = 6 + Math.random() * 4;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50% 0 50% 0',
    backgroundColor: color,
    opacity: '0.85',
    pointerEvents: 'none',
    zIndex: '99999',
    transition: `all 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transform: 'scale(1) rotate(0deg)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0) rotate(${180 + Math.random() * 180}deg)`;
    el.style.opacity = '0';
  });
  return el;
}

function createWaterRippleParticle(x: number, y: number, i: number, color: string): HTMLElement {
  const el = document.createElement('div');
  const size = 10 + i * 12;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    backgroundColor: 'transparent',
    opacity: '0.7',
    pointerEvents: 'none',
    zIndex: '99999',
    transition: `all ${500 + i * 100}ms ease-out`,
    transform: 'scale(0)',
  });
  requestAnimationFrame(() => {
    el.style.transform = 'scale(1)';
    el.style.opacity = '0';
  });
  return el;
}

function createLeafParticle(x: number, y: number, i: number, color: string): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
  const dist = 25 + Math.random() * 35;
  const size = 5 + Math.random() * 4;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size * 1.4}px`,
    borderRadius: '2px 50% 50% 2px',
    backgroundColor: color,
    opacity: '0.8',
    pointerEvents: 'none',
    zIndex: '99999',
    transition: `all 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transform: 'scale(1) rotate(0deg)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 20}px) scale(0) rotate(${120 + Math.random() * 240}deg)`;
    el.style.opacity = '0';
  });
  return el;
}

function createSnowflakeParticle(x: number, y: number, i: number, color: string): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
  const dist = 20 + Math.random() * 30;
  const size = 4 + Math.random() * 4;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color,
    opacity: '0.9',
    pointerEvents: 'none',
    zIndex: '99999',
    boxShadow: `0 0 ${size}px ${color}`,
    transition: `all 800ms ease-out`,
    transform: 'scale(1)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 15}px) scale(0)`;
    el.style.opacity = '0';
  });
  return el;
}

// --- Festival particle factories ---

function createFirecrackerParticle(x: number, y: number, i: number): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.6;
  const dist = 35 + Math.random() * 45;
  const size = 3 + Math.random() * 3;
  const colors = ['#ef4444', '#f59e0b', '#fbbf24', '#dc2626'];
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: colors[i % colors.length],
    opacity: '1',
    pointerEvents: 'none',
    zIndex: '99999',
    boxShadow: `0 0 ${size + 2}px ${colors[i % colors.length]}`,
    transition: `all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transform: 'scale(1)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
    el.style.opacity = '0';
  });
  return el;
}

function createMoonlightParticle(x: number, y: number, i: number): HTMLElement {
  const el = document.createElement('div');
  const size = 20 + i * 18;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(253, 230, 138, 0.5)',
    boxShadow: '0 0 8px rgba(253, 230, 138, 0.3)',
    opacity: '0.6',
    pointerEvents: 'none',
    zIndex: '99999',
    transition: `all ${600 + i * 120}ms ease-out`,
    transform: 'scale(0)',
  });
  requestAnimationFrame(() => {
    el.style.transform = 'scale(1)';
    el.style.opacity = '0';
  });
  return el;
}

function createLanternGlowParticle(x: number, y: number, i: number): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 6) * Math.PI * 2;
  const dist = 15 + Math.random() * 25;
  const size = 6 + Math.random() * 5;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: '#fb923c',
    opacity: '0.8',
    pointerEvents: 'none',
    zIndex: '99999',
    boxShadow: '0 0 8px rgba(251, 146, 60, 0.6)',
    transition: `all 650ms ease-out`,
    transform: 'scale(1)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 10}px) scale(0)`;
    el.style.opacity = '0';
  });
  return el;
}

function createGoldStarParticle(x: number, y: number, i: number): HTMLElement {
  const el = document.createElement('div');
  const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
  const dist = 30 + Math.random() * 40;
  const size = 5 + Math.random() * 4;
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: '#fbbf24',
    opacity: '0.9',
    pointerEvents: 'none',
    zIndex: '99999',
    boxShadow: '0 0 6px rgba(251, 191, 36, 0.7)',
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    transition: `all 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transform: 'scale(1) rotate(0deg)',
  });
  requestAnimationFrame(() => {
    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0) rotate(${180}deg)`;
    el.style.opacity = '0';
  });
  return el;
}

// --- Default fallback ripple ---

function createFallbackRipple(x: number, y: number, color: string): HTMLElement {
  const size = 40;
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed',
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    backgroundColor: 'transparent',
    opacity: '0.6',
    pointerEvents: 'none',
    zIndex: '99999',
    transition: 'all 500ms ease-out',
    transform: 'scale(0)',
  });
  requestAnimationFrame(() => {
    el.style.transform = 'scale(2)';
    el.style.opacity = '0';
  });
  return el;
}

// --- Config resolver ---

function getParticleConfig(
  seasonType: SeasonType,
  themeColors: ThemeColors,
  festivalType?: string
): ParticleConfig {
  // Festival-specific styles take priority
  if (festivalType) {
    switch (festivalType) {
      case 'cny':
        return {
          count: 7,
          createParticle: (x, y, i) => createFirecrackerParticle(x, y, i),
          duration: 550,
        };
      case 'mid_autumn':
        return {
          count: 5,
          createParticle: (x, y, i) => createMoonlightParticle(x, y, i),
          duration: 850,
        };
      case 'lantern_fest':
        return {
          count: 6,
          createParticle: (x, y, i) => createLanternGlowParticle(x, y, i),
          duration: 700,
        };
      case 'national':
        return {
          count: 7,
          createParticle: (x, y, i) => createGoldStarParticle(x, y, i),
          duration: 650,
        };
    }
  }

  // Season-based styles
  switch (seasonType) {
    case 'spring':
      return {
        count: 6,
        createParticle: (x, y, i) => createPetalParticle(x, y, i, themeColors.secondary),
        duration: 650,
      };
    case 'summer':
      return {
        count: 5,
        createParticle: (x, y, i) => createWaterRippleParticle(x, y, i, themeColors.primary),
        duration: 800,
      };
    case 'autumn':
      return {
        count: 6,
        createParticle: (x, y, i) => createLeafParticle(x, y, i, themeColors.secondary),
        duration: 750,
      };
    case 'winter':
      return {
        count: 6,
        createParticle: (x, y, i) => createSnowflakeParticle(x, y, i, '#e2e8f0'),
        duration: 850,
      };
    default:
      // festival type without specific match falls through to default
      return {
        count: 5,
        createParticle: (x, y, i) => createWaterRippleParticle(x, y, i, themeColors.primary),
        duration: 600,
      };
  }
}

// --- Main component ---

export function InteractionFeedback({ seasonType, themeColors, festivalType }: InteractionFeedbackProps) {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      try {
        const config = getParticleConfig(seasonType, themeColors, festivalType);
        const particles: HTMLElement[] = [];

        for (let i = 0; i < config.count; i++) {
          const particle = config.createParticle(x, y, i);
          document.body.appendChild(particle);
          particles.push(particle);
        }

        // Self-cleanup after animation
        setTimeout(() => {
          particles.forEach((p) => {
            if (p.parentNode) p.parentNode.removeChild(p);
          });
        }, config.duration + 50);
      } catch {
        // Fallback: simple ink ripple
        const ripple = createFallbackRipple(x, y, themeColors.primary);
        document.body.appendChild(ripple);
        setTimeout(() => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 550);
      }
    },
    [seasonType, themeColors, festivalType]
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  // Renders nothing — purely side-effect driven
  return null;
}

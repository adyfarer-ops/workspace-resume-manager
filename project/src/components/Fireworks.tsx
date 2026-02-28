import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
  friction: number;
}

interface FireworksProps {
  isActive: boolean;
}

// 春节主题颜色：红、金、橙、黄
const COLORS = [
  '#ff3333', // 大红
  '#ff6666', // 粉红
  '#ffd700', // 金色
  '#ffb347', // 橙黄
  '#ff8c00', // 深橙
  '#ffcc00', // 金黄
  '#ff4444', // 珊瑚红
  '#ffa500', // 橙色
];

export const Fireworks: React.FC<FireworksProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastFireworkTime = useRef<number>(0);

  const explode = useCallback((x: number, y: number, color: string) => {
    // 粒子数量：20-40个
    const particleCount = 20 + Math.floor(Math.random() * 20);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        color: Math.random() > 0.7 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
        decay: Math.random() * 0.008 + 0.012,
        size: Math.random() * 1.5 + 0.8,
        friction: 0.98,
      });
    }
  }, []);

  // 立即炸开，不需要上升
  const createInstantFirework = useCallback((x?: number, y?: number) => {
    const centerX = x ?? Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
    const centerY = y ?? Math.random() * window.innerHeight * 0.35 + 60;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    explode(centerX, centerY, color);
  }, [explode]);

  // 初始爆发：5个烟花，延迟等弹框出来后再炸开，位置在屏幕中央（弹框附近）
  useEffect(() => {
    if (!isActive) return;
    
    // 延迟1500ms等弹框完全出来后再炸开
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createInstantFirework(
            // 水平位置：屏幕中央区域
            window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4,
            // 垂直位置：屏幕中央（弹框附近）
            window.innerHeight * 0.4 + Math.random() * window.innerHeight * 0.2
          );
        }, i * 150);
      }
    }, 1500);
  }, [isActive, createInstantFirework]);

  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleClick = (e: MouseEvent) => {
      createInstantFirework(e.clientX, window.innerHeight * 0.25 + Math.random() * 80);
    };
    window.addEventListener('click', handleClick);

    const animate = (timestamp: number) => {
      // 完全清除画布（透明）
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 自动创建烟花：间隔3.5秒
      if (timestamp - lastFireworkTime.current > 3500) {
        if (Math.random() > 0.7) {
          createInstantFirework();
        }
        lastFireworkTime.current = timestamp;
      }

      // 更新和绘制粒子
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // 重力
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        
        // 发光效果
        if (p.alpha > 0.5) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, createInstantFirework]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ background: 'transparent' }}
    />
  );
};

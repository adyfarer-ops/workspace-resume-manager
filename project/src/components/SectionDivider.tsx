import React, { useEffect, useRef, useState } from 'react';

interface SectionDividerProps {
  variant?: 'default' | 'ink' | 'festival';
}

/**
 * SectionDivider — 模块分割线
 * 水墨风格的分割元素，符合"墨·码"主题，带滚动进入动画
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'default' }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3, rootMargin: "-20px" }
    );

    if (dividerRef.current) {
      observer.observe(dividerRef.current);
    }

    return () => {
      if (dividerRef.current) {
        observer.unobserve(dividerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dividerRef}
      className={`relative h-16 my-4 overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
      }`}
    >
      {/* 主分割线 - 渐变 */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px transition-all duration-1000 delay-100 ${
          isVisible ? 'w-2/3 opacity-40' : 'w-0 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--color-theme-primary, #78716c) 20%, var(--color-theme-primary, #78716c) 80%, transparent 100%)',
        }}
      />
      
      {/* 装饰元素 - 墨点/印章 */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-700 delay-300 ${
          isVisible ? 'scale-100 opacity-60' : 'scale-0 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--color-theme-primary, #78716c)',
        }}
      />
      
      {/* 两侧装饰 - 短线 */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-y-1/2 h-px transition-all duration-700 delay-500 ${
          isVisible ? 'w-8 opacity-25 -translate-x-[calc(50%+24px)]' : 'w-0 opacity-0 -translate-x-[calc(50%+12px)]'
        }`}
        style={{
          backgroundColor: 'var(--color-theme-primary, #78716c)',
        }}
      />
      <div 
        className={`absolute left-1/2 top-1/2 -translate-y-1/2 h-px transition-all duration-700 delay-500 ${
          isVisible ? 'w-8 opacity-25 translate-x-[calc(-50%+24px)]' : 'w-0 opacity-0 translate-x-[calc(-50%+12px)]'
        }`}
        style={{
          backgroundColor: 'var(--color-theme-primary, #78716c)',
        }}
      />

      {/* 节日特别装饰 */}
      {variant === 'festival' && (
        <>
          {/* 小灯笼装饰 */}
          <svg 
            className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-6 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 -translate-x-[calc(50%+48px)]' : 'opacity-0 -translate-x-[calc(50%+32px)]'
            }`}
            viewBox="0 0 16 24" 
            fill="none"
          >
            <line x1="8" y1="0" x2="8" y2="6" stroke="#c41e1e" strokeWidth="1"/>
            <rect x="4" y="6" width="8" height="10" rx="4" fill="#e53e3e" opacity="0.6"/>
            <line x1="8" y1="16" x2="8" y2="22" stroke="#c41e1e" strokeWidth="1"/>
          </svg>
          <svg 
            className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-6 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-x-[calc(-50%+48px)]' : 'opacity-0 translate-x-[calc(-50%+32px)]'
            }`}
            viewBox="0 0 16 24" 
            fill="none"
          >
            <line x1="8" y1="0" x2="8" y2="6" stroke="#c41e1e" strokeWidth="1"/>
            <rect x="4" y="6" width="8" height="10" rx="4" fill="#e53e3e" opacity="0.6"/>
            <line x1="8" y1="16" x2="8" y2="22" stroke="#c41e1e" strokeWidth="1"/>
          </svg>
        </>
      )}

      {/* 水墨风格装饰 */}
      {variant === 'ink' && (
        <>
          {/* 墨点装饰 */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-400/30 transition-all duration-500 delay-600 ${
              isVisible ? 'opacity-100 -translate-x-[calc(50%+40px)] scale-100' : 'opacity-0 -translate-x-[calc(50%+30px)] scale-0'
            }`}
          />
          <div 
            className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-stone-400/20 transition-all duration-500 delay-700 ${
              isVisible ? 'opacity-100 translate-x-[calc(-50%+40px)] scale-100' : 'opacity-0 translate-x-[calc(-50%+30px)] scale-0'
            }`}
          />
        </>
      )}
    </div>
  );
};

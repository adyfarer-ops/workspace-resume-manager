import React, { useEffect, useRef, useState } from 'react';
import { SectionDivider } from './SectionDivider';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  showDivider?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, className = "", icon, showDivider = true }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id={id} ref={sectionRef} className={`py-12 md:py-16 relative ${className}`}>
      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header as a Tablet/Inscription */}
        <div className={`flex items-center gap-4 mb-12 will-change-transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 -translate-x-10 blur-sm'}`}>
          <div className="w-1.5 h-12 bg-stone-800 rounded-sm"></div>
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-serif tracking-widest">
              {title}
            </h2>
          </div>
          {icon && <div className="ml-auto text-stone-400 opacity-20 transform scale-150">{icon}</div>}
        </div>
        
        <div className={`will-change-transform transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0 blur-0 scale-100' : 'opacity-0 translate-y-10 blur-sm scale-[0.98]'}`}>
          {children}
        </div>
        
        {/* 模块分割线 */}
        {showDivider && (
          <div className="mt-8">
            <SectionDivider />
          </div>
        )}
      </div>
    </section>
  );
};
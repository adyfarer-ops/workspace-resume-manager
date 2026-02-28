import React, { useMemo } from 'react';
import { MENU_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';
import { getSeasonalIcons } from '../utils/iconMapping';
import type { SeasonType } from '../utils/themeRegistry';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  seasonType: SeasonType;
  festivalType?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onNavigate, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  seasonType,
  festivalType,
}) => {
  // Build a map of sectionId → seasonal icon for quick lookup
  const seasonalIconMap = useMemo(() => {
    const icons = getSeasonalIcons(seasonType, festivalType);
    const map = new Map<string, typeof icons[number]['icon']>();
    for (const entry of icons) {
      map.set(entry.sectionId, entry.icon);
    }
    return map;
  }, [seasonType, festivalType]);
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#e7e5e4]/90 backdrop-blur-sm z-50 px-6 py-4 flex justify-between items-center border-b border-stone-300">
        <div className="font-calligraphy text-2xl text-stone-900">大鱼</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-stone-700">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Floating Seal Navigation */}
      <nav className={`
        fixed top-0 right-0 h-screen w-20 hidden md:flex flex-col items-center justify-center z-40
        transition-all duration-500
      `}>
        <div className="flex flex-col gap-6 p-2 bg-[#e7e5e4]/50 backdrop-blur-sm rounded-l-2xl border-l border-stone-300 shadow-xl">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            // Use seasonal icon if available, fall back to static MENU_ITEMS icon
            const IconComponent = seasonalIconMap.get(item.id) ?? item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group relative flex items-center justify-center w-12 h-12"
              >
                {/* Seal Box (Rotated Square) */}
                <div 
                  className={`
                    absolute inset-0 border-2 transition-all duration-500 transform origin-center
                    ${isActive 
                      ? 'rotate-0 scale-100 shadow-md' 
                      : 'border-stone-400 rotate-45 scale-75 group-hover:rotate-0 group-hover:scale-90'
                    }
                  `}
                  style={{
                    borderColor: isActive ? 'var(--color-theme-primary)' : (undefined),
                    backgroundColor: isActive ? 'var(--color-theme-primary)' : 'transparent',
                  }}
                >
                  <style>{`
                    .group:hover div {
                      border-color: var(--color-theme-primary);
                    }
                  `}</style>
                </div>
                
                {/* Icon (Inside the Seal) — transition-all duration-300 for smooth icon switching */}
                <div className={`
                  relative z-10 transition-all duration-300
                  ${isActive ? 'text-[#e7e5e4]' : 'text-stone-600'}
                `}
                style={{
                  color: !isActive ? undefined : '#e7e5e4'
                }}
                >
                  <span className={!isActive ? "group-hover:text-theme-primary" : ""}>
                    <IconComponent size={20} strokeWidth={isActive ? 2 : 1.5} />
                  </span>
                </div>
                
                {/* Tooltip (Name Stamp Style) */}
                <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
                  <div className="bg-stone-800 text-[#e7e5e4] text-xs py-1 px-3 rounded font-serif whitespace-nowrap shadow-lg flex items-center">
                     {item.label}
                     <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-stone-800"></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#e7e5e4] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
           {MENU_ITEMS.map((item) => {
             // Use seasonal icon if available, fall back to static MENU_ITEMS icon
             const IconComponent = seasonalIconMap.get(item.id) ?? item.icon;
             return (
               <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 text-2xl font-calligraphy text-stone-800 hover:text-theme-primary"
               >
                 <span className="transition-all duration-300 inline-flex">
                   <IconComponent size={28} />
                 </span>
                 {item.label}
               </button>
             );
           })}
        </div>
      )}
    </>
  );
};
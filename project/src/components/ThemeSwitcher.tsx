import React, { useState } from 'react';
import { Palette, X, Calendar, Sparkles } from 'lucide-react';
import { getAllThemes, ThemeConfig } from '../utils/themeRegistry';

interface ThemeSwitcherProps {
  currentThemeId: string;
  onThemeChange: (id: string) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentThemeId, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const themes = getAllThemes();
  
  // Group themes
  const springs = themes.filter(t => t.type === 'spring');
  const summers = themes.filter(t => t.type === 'summer');
  const autumns = themes.filter(t => t.type === 'autumn');
  const winters = themes.filter(t => t.type === 'winter');
  const festivals = themes.filter(t => t.type === 'festival');

  const renderThemeGroup = (title: string, groupThemes: ThemeConfig[]) => (
    <div className="mb-4">
      <h4 className="text-xs font-serif text-stone-400 mb-2 border-b border-stone-200 pb-1">{title}</h4>
      <div className="grid grid-cols-4 gap-2">
        {groupThemes.map(t => (
          <button
            key={t.id}
            onClick={() => {
              onThemeChange(t.id);
              setIsOpen(false);
            }}
            className={`
              text-xs py-1 px-1 rounded-sm font-serif transition-all
              ${currentThemeId === t.id 
                ? 'bg-stone-800 text-stone-50 shadow-md transform scale-105' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }
            `}
            style={currentThemeId === t.id ? { backgroundColor: t.colors.primary } : {}}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-full bg-[#e7e5e4] border-2 border-stone-800 shadow-xl flex items-center justify-center text-stone-800 hover:rotate-12 transition-transform duration-300 group"
        title="切换节气/主题"
      >
        <div className="absolute inset-0 border border-stone-400 rounded-full m-1 group-hover:m-0.5 transition-all"></div>
        <Palette size={20} />
      </button>

      {/* Modal/Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-[#f5f5f4] w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-2xl border border-stone-300 p-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <Sparkles size={18} className="text-amber-600" />
                 <h3 className="font-calligraphy text-2xl text-stone-900">时节 · 变换</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-stone-900">
                <X size={24} />
              </button>
            </div>

            {/* Grid */}
            <div className="space-y-2">
              {renderThemeGroup('佳节', festivals)}
              {renderThemeGroup('春生', springs)}
              {renderThemeGroup('夏长', summers)}
              {renderThemeGroup('秋收', autumns)}
              {renderThemeGroup('冬藏', winters)}
            </div>
            
            <div className="mt-6 text-center text-xs text-stone-400 font-serif">
               点击即可切换全站意境 · 此时此地 · 岁时记
            </div>
          </div>
        </div>
      )}
    </>
  );
};
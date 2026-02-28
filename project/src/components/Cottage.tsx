import React from 'react';
import type { CottageState } from '../types';

interface CottageProps {
  state: CottageState;
  showSmoke?: boolean;
}

export const Cottage: React.FC<CottageProps> = ({ state, showSmoke = false }) => {
  // 根据状态返回不同的样式
  const getCottageStyle = () => {
    switch (state) {
      case 'spring_bloom':
        return 'text-green-700';
      case 'summer_lush':
        return 'text-emerald-600';
      case 'autumn_leaves':
        return 'text-amber-700';
      case 'winter_snow':
        return 'text-stone-400';
      case 'festival_lights':
        return 'text-red-600';
      default:
        return 'text-stone-600';
    }
  };

  return (
    <div className={`absolute bottom-0 right-0 w-32 h-24 ${getCottageStyle()}`}>
      {/* 简化的茅屋 SVG */}
      <svg viewBox="0 0 128 96" className="w-full h-full" fill="currentColor">
        {/* 房屋主体 */}
        <rect x="24" y="40" width="80" height="48" fill="currentColor" opacity="0.3" />
        {/* 屋顶 */}
        <path d="M16 40 L64 16 L112 40 Z" fill="currentColor" opacity="0.5" />
        {/* 门 */}
        <rect x="56" y="64" width="16" height="24" fill="currentColor" opacity="0.4" />
        {/* 烟囱 */}
        <rect x="88" y="24" width="8" height="20" fill="currentColor" opacity="0.3" />
      </svg>
      
      {/* 炊烟效果 */}
      {showSmoke && (
        <div className="absolute top-0 right-8">
          <div className="w-2 h-2 bg-stone-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
        </div>
      )}
    </div>
  );
};

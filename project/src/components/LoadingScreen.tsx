import React from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f5f5f4] transition-opacity duration-500">
      {/* 大鱼印章 */}
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-[#2c3e50] rounded-lg flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#2c3e50] font-serif">大鱼</div>
            <div className="text-xs text-[#78716c] mt-1">简历</div>
          </div>
        </div>
        {/* 装饰圆点 */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#2a9d8f] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#2c3e50] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-[#78716c] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* 加载文字 */}
      <div className="text-center">
        <div className="text-lg font-serif text-[#2c3e50] mb-2">正在加载...</div>
        <div className="text-sm text-[#78716c]">大鱼 · 岁时记 · 二十四节气简历</div>
      </div>

      {/* 进度条 */}
      <div className="mt-6 w-48 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#2a9d8f] to-[#2c3e50] animate-[loading_1.5s_ease-in-out_infinite]" 
          style={{
            width: '30%',
            animation: 'loading 1.5s ease-in-out infinite'
          }}
        />
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

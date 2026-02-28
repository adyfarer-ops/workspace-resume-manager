import React, { useState, useEffect } from 'react';

interface NewYearGreetingProps {
  isActive: boolean;
  onShow?: () => void;
}

const GREETINGS = [
  { title: '新年快乐', subtitle: '万事如意，阖家幸福' },
  { title: '恭喜发财', subtitle: '财源广进，前程似锦' },
  { title: '身体健康', subtitle: '龙马精神，岁岁平安' },
  { title: '事业有成', subtitle: '步步高升，鹏程万里' },
  { title: '阖家欢乐', subtitle: '团团圆圆，幸福美满' },
  { title: '万事如意', subtitle: '心想事成，吉祥安康' },
  { title: '福星高照', subtitle: '好运连连，喜气洋洋' },
  { title: '大吉大利', subtitle: '顺风顺水，平安喜乐' },
];

export const NewYearGreeting: React.FC<NewYearGreetingProps> = ({ isActive, onShow }) => {
  const [show, setShow] = useState(false);
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!isActive || hasShown) return;

    // 随机选择祝福语
    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomGreeting);

    // 延迟显示弹窗
    const timer = setTimeout(() => {
      setShow(true);
      setHasShown(true);
      onShow?.();
    }, 1500);

    // 5秒后自动关闭
    const closeTimer = setTimeout(() => {
      setShow(false);
    }, 6500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [isActive, hasShown]);

  if (!isActive || !show) return null;

  return (
    <>
      <style>{`
        @keyframes greeting-pop {
          0% { 
            opacity: 0; 
            transform: scale(0.5) translateY(20px); 
          }
          60% { 
            opacity: 1; 
            transform: scale(1.05) translateY(0); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes greeting-fade-out {
          0% { 
            opacity: 1; 
            transform: scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8) translateY(-20px); 
          }
        }
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(251, 191, 36, 0.2); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.5), 0 0 60px rgba(251, 191, 36, 0.3); 
          }
        }
        .greeting-animate {
          animation: greeting-pop 0.6s ease-out forwards, glow-pulse 2s ease-in-out infinite 0.6s;
        }
        .greeting-fade-out {
          animation: greeting-fade-out 0.4s ease-in forwards;
        }
      `}</style>

      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-500"
        onClick={() => setShow(false)}
      />

      {/* 祝福弹窗 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className={`greeting-animate relative pointer-events-auto ${!show ? 'greeting-fade-out' : ''}`}
          onClick={() => setShow(false)}
        >
          {/* 外层装饰框 */}
          <div className="absolute -inset-3 border-2 border-red-600/30 rounded-lg" />
          <div className="absolute -inset-6 border border-red-500/20 rounded-xl" />
          
          {/* 四角装饰 */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-red-600" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-red-600" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-red-600" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-red-600" />

          {/* 主内容 */}
          <div className="relative bg-gradient-to-br from-red-50 to-amber-50 px-8 py-8 md:px-16 md:py-14 rounded-xl shadow-2xl w-[280px] md:w-auto md:min-w-[360px] md:scale-110">
            {/* 顶部装饰线 */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent" />
            
            {/* 标题 */}
            <h2 className="text-3xl md:text-5xl font-calligraphy text-red-700 text-center mb-3 md:mb-4 tracking-widest">
              {greeting.title}
            </h2>
            
            {/* 分隔装饰 */}
            <div className="flex items-center justify-center gap-2 my-3 md:my-4">
              <div className="w-6 md:w-8 h-px bg-red-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-6 md:w-8 h-px bg-red-300" />
            </div>
            
            {/* 副标题 */}
            <p className="text-stone-600 text-center font-serif text-base md:text-xl tracking-wider">
              {greeting.subtitle}
            </p>

            {/* 底部装饰线 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent" />

            {/* 小灯笼装饰 */}
            <div className="absolute -top-4 left-4 md:-top-5 md:left-5">
              <svg width="20" height="26" viewBox="0 0 20 28" fill="none" className="md:w-6 md:h-8">
                <line x1="10" y1="0" x2="10" y2="8" stroke="#c41e1e" strokeWidth="1.5"/>
                <rect x="4" y="8" width="12" height="14" rx="6" fill="#e53e3e"/>
                <line x1="10" y1="22" x2="10" y2="28" stroke="#c41e1e" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="absolute -top-4 right-4 md:-top-5 md:right-5">
              <svg width="20" height="26" viewBox="0 0 20 28" fill="none" className="md:w-6 md:h-8">
                <line x1="10" y1="0" x2="10" y2="8" stroke="#c41e1e" strokeWidth="1.5"/>
                <rect x="4" y="8" width="12" height="14" rx="6" fill="#e53e3e"/>
                <line x1="10" y1="22" x2="10" y2="28" stroke="#c41e1e" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          {/* 点击关闭提示 */}
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-xs whitespace-nowrap">
            点击任意处关闭
          </p>
        </div>
      </div>
    </>
  );
};

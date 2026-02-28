import React, { useState, useEffect } from 'react';

interface AtmosphericWordItem {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export const AtmosphericWords = ({ keywords }: { keywords: string[] }) => {
  const [items, setItems] = useState<AtmosphericWordItem[]>([]);

  useEffect(() => {
    const newItems = keywords.map((word, i) => {
      // 只在页面最顶部和最底部边缘显示，完全避开中间内容区域
      let y;
      if (i % 2 === 0) {
        // 顶部：0-8%
        y = Math.random() * 8;
      } else {
        // 底部：92-100%
        y = 92 + Math.random() * 8;
      }
      return {
        id: i,
        text: word,
        x: 10 + Math.random() * 80, // 水平方向 10-90% 分散
        y: y,
        duration: 20 + Math.random() * 15,
        delay: i * 2
      };
    });
    setItems(newItems);
  }, [keywords]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000">
      {items.map((item) => (
        <div
          key={item.text}
          className="absolute font-calligraphy text-8xl md:text-9xl text-stone-900/[0.04] select-none animate-mist transition-all duration-1000"
          style={{
            left: `${item.x}vw`,
            top: `${item.y}vh`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            writingMode: 'vertical-rl',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

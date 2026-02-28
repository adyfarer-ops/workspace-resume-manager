// Simplified 24 Solar Terms Logic
// Maps approx date ranges to terms. 

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SolarTermInfo {
  name: string;
  season: Season;
}

const SOLAR_TERMS: { name: string; date: [number, number] }[] = [
  { name: '小寒', date: [1, 5] },
  { name: '大寒', date: [1, 20] },
  { name: '立春', date: [2, 3] },
  { name: '雨水', date: [2, 18] },
  { name: '惊蛰', date: [3, 5] },
  { name: '春分', date: [3, 20] },
  { name: '清明', date: [4, 4] },
  { name: '谷雨', date: [4, 19] },
  { name: '立夏', date: [5, 5] },
  { name: '小满', date: [5, 20] },
  { name: '芒种', date: [6, 5] },
  { name: '夏至', date: [6, 21] },
  { name: '小暑', date: [7, 6] },
  { name: '大暑', date: [7, 22] },
  { name: '立秋', date: [8, 7] },
  { name: '处暑', date: [8, 22] },
  { name: '白露', date: [9, 7] },
  { name: '秋分', date: [9, 22] },
  { name: '寒露', date: [10, 8] },
  { name: '霜降', date: [10, 23] },
  { name: '立冬', date: [11, 7] },
  { name: '小雪', date: [11, 22] },
  { name: '大雪', date: [12, 7] },
  { name: '冬至', date: [12, 21] },
];

export const getSolarTerm = (date: Date = new Date()): SolarTermInfo => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Find the current term
  // Simple approximation: check if current date is >= term date
  // Since terms are sorted by month roughly, we iterate.
  
  let currentTerm = SOLAR_TERMS[SOLAR_TERMS.length - 1]; // Default to last one (Winter Solstice or similar) if early year
  
  for (const term of SOLAR_TERMS) {
    const [m, d] = term.date;
    if (month > m || (month === m && day >= d)) {
      currentTerm = term;
    } else {
      break;
    }
  }

  // Determine Season
  let season: Season = 'winter';
  const idx = SOLAR_TERMS.findIndex(t => t.name === currentTerm.name);
  
  if (idx >= 2 && idx < 8) season = 'spring';       // 立春 -> 谷雨
  else if (idx >= 8 && idx < 14) season = 'summer'; // 立夏 -> 大暑
  else if (idx >= 14 && idx < 20) season = 'autumn';// 立秋 -> 霜降
  else season = 'winter';                           // 立冬 -> 大寒

  return {
    name: currentTerm.name,
    season
  };
};

export const SEASON_CONFIG: Record<Season, {
  primary: string;
  secondary: string;
  poem: { title: string; line: string };
  label: string;
}> = {
  spring: {
    primary: '#059669', // Emerald 600
    secondary: '#34d399', // Emerald 400
    poem: { title: '杏雨 · 杨柳', line: '沾衣欲湿杏花雨，吹面不寒杨柳风' },
    label: '墨·码·春'
  },
  summer: {
    primary: '#0891b2', // Cyan 600
    secondary: '#22d3ee', // Cyan 400
    poem: { title: '听荷 · 蝉鸣', line: '接天莲叶无穷碧，映日荷花别样红' },
    label: '墨·码·夏'
  },
  autumn: {
    primary: '#b45309', // Amber 700 (Original Ochre)
    secondary: '#ea580c', // Orange 600
    poem: { title: '枯藤 · 昏鸦', line: '夕阳西下，断肠人在天涯' },
    label: '墨·码·秋'
  },
  winter: {
    primary: '#334155', // Slate 700
    secondary: '#94a3b8', // Slate 400
    poem: { title: '寒江 · 独钓', line: '孤舟蓑笠翁，独钓寒江雪' },
    label: '墨·码·冬'
  }
};
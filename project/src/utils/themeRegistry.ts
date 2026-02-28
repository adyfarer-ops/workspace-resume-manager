// Theme Definitions for 24 Solar Terms + Holidays

import type { HorseState, CottageState, WindIntensity, SunConfig, FestivalConfig } from '../types';

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter' | 'festival';
// Tree state represents the foliage/decoration status of the SAME old tree
export type TreeState = 'sprout' | 'young_leaves' | 'lush' | 'fruit' | 'red_maple' | 'withered' | 'bare' | 'snow_laden' | 'plum_bloom' | 'lanterns_red' | 'lanterns_gold';
export type ParticleType = 
  // 春
  | 'petals'        // 花瓣飘落
  | 'rain'          // 细雨
  | 'rain_heavy'    // 大雨
  | 'dandelion'     // 蒲公英/柳絮
  | 'apricot_blossom' // 杏花雨
  // 夏
  | 'fireflies'     // 萤火虫
  | 'lotus_petals'  // 荷花瓣
  | 'willow_cats'   // 柳绵
  // 秋
  | 'leaves'        // 落叶
  | 'red_maple'     // 红枫
  | 'ginkgo'        // 银杏
  | 'mist'          // 晨雾
  // 冬
  | 'snow'          // 小雪
  | 'snow_heavy'    // 大雪纷飞
  | 'snow_drift'    // 飘雪
  // 节日/通用
  | 'fireworks'     // 烟花
  | 'gold_dust'     // 金粉
  | 'lanterns'      // 灯笼
  | 'plum_blossom'; // 梅花
export type WaterElement = 'none' | 'lotus' | 'ice' | 'river_lanterns' | 'fallen_petals' | 'reflections' | 'withered_lotus';

export interface ThemeConfig {
  id: string;
  name: string;
  type: SeasonType;
  colors: {
    primary: string;
    secondary: string;
    bgGradient: string; 
    water: string; // Tailwind class
    vine: string; // Color of the "Withered Vine" (Ku Teng)
  };
  poem: {
    title: string;
    line: string;
  };
  visuals: {
    tree: TreeState;
    particles: ParticleType;
    waterElement: WaterElement;
    creature: 'swallow' | 'dragonfly' | 'crow' | 'magpie' | 'crane' | 'none';
    horse: HorseState;
    cottage: CottageState;
    sun: SunConfig;
    wind: WindIntensity;
    travelerOpacity: number;
  };
  keywords: string[];
  festival?: FestivalConfig;
}

export const DEFAULT_THEME_ID = 'lichun';

const THEMES: ThemeConfig[] = [
  // --- SPRING (春) - 枯藤吐绿 ---
  {
    id: 'lichun', name: '立春', type: 'spring',
    colors: { primary: '#65a30d', secondary: '#84cc16', bgGradient: 'from-yellow-50 via-green-50 to-transparent', water: 'text-green-200', vine: '#84cc16' },
    poem: { title: '枯木 · 逢春', line: '律回岁晚bug少，春到人间代码新' },
    visuals: { tree: 'sprout', particles: 'apricot_blossom', waterElement: 'none', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#f9a8d4', glowColor: '#fbcfe8', size: 'medium', blur: 40, opacity: 0.5 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['解冻', '复苏', '萌动', '东风', '草木知', '冰霜消']
  },
  {
    id: 'yushui', name: '雨水', type: 'spring',
    colors: { primary: '#059669', secondary: '#34d399', bgGradient: 'from-gray-200 via-emerald-50 to-transparent', water: 'text-emerald-300', vine: '#4ade80' },
    poem: { title: '润物 · 无声', line: '随风潜入夜，润码细无声' },
    visuals: { tree: 'sprout', particles: 'rain', waterElement: 'none', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#fda4af', glowColor: '#fecdd3', size: 'medium', blur: 45, opacity: 0.4 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['甘霖', '新绿', '滋养', '无声', '润泽', '烟雨']
  },
  {
    id: 'jingzhe', name: '惊蛰', type: 'spring',
    colors: { primary: '#16a34a', secondary: '#4ade80', bgGradient: 'from-green-100 via-yellow-50 to-transparent', water: 'text-green-300', vine: '#22c55e' },
    poem: { title: '春雷 · 乍动', line: '微雨众bug醒，一雷需求始' },
    visuals: { tree: 'young_leaves', particles: 'apricot_blossom', waterElement: 'fallen_petals', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#f0abfc', glowColor: '#f5d0fe', size: 'medium', blur: 38, opacity: 0.5 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['惊雷', '破土', '众卉', '始动', '虫鸣', '桃始华']
  },
  {
    id: 'chunfen', name: '春分', type: 'spring',
    colors: { primary: '#15803d', secondary: '#22c55e', bgGradient: 'from-green-200 via-emerald-100 to-transparent', water: 'text-emerald-400', vine: '#16a34a' },
    poem: { title: '春色 · 平分', line: '代码正中分，前后岂无痕' },
    visuals: { tree: 'young_leaves', particles: 'willow_cats', waterElement: 'fallen_petals', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#fca5a5', glowColor: '#fecaca', size: 'medium', blur: 42, opacity: 0.55 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['昼夜', '平分', '莺飞', '草长', '燕归', '花信']
  },
  {
    id: 'qingming', name: '清明', type: 'spring',
    colors: { primary: '#3f6212', secondary: '#65a30d', bgGradient: 'from-stone-200 via-green-50 to-transparent', water: 'text-green-200/50', vine: '#65a30d' },
    poem: { title: '烟雨 · 纷纷', line: '清明时节bug纷，线上行人欲断魂' },
    visuals: { tree: 'young_leaves', particles: 'rain', waterElement: 'none', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#d4d4d8', glowColor: '#e4e4e7', size: 'medium', blur: 50, opacity: 0.35 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['追远', '清净', '柳烟', '断魂', '纷纷', '踏青']
  },
  {
    id: 'guyu', name: '谷雨', type: 'spring',
    colors: { primary: '#047857', secondary: '#10b981', bgGradient: 'from-emerald-100 via-teal-50 to-transparent', water: 'text-emerald-300', vine: '#10b981' },
    poem: { title: '浮萍 · 始生', line: '杨花落尽子规啼，闻道上线又延期' },
    visuals: { tree: 'lush', particles: 'rain', waterElement: 'fallen_petals', creature: 'swallow', horse: 'spring_flowers', cottage: 'spring_bloom', sun: { color: '#fbb6ce', glowColor: '#fbcfe8', size: 'medium', blur: 36, opacity: 0.5 }, wind: 'gentle', travelerOpacity: 0.15 },
    keywords: ['生百谷', '惜春', '初夏', '子规', '杨花', '浮萍']
  },

  // --- SUMMER (夏) - 绿树阴浓 ---
  {
    id: 'lixia', name: '立夏', type: 'summer',
    colors: { primary: '#0891b2', secondary: '#22d3ee', bgGradient: 'from-cyan-100 via-blue-50 to-transparent', water: 'text-cyan-200', vine: '#22d3ee' },
    poem: { title: '万物 · 并秀', line: '绿树阴浓夏日长，代码重构入池塘' },
    visuals: { tree: 'lush', particles: 'lotus_petals', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#fde047', glowColor: '#fef08a', size: 'large', blur: 30, opacity: 0.7 }, wind: 'gentle', travelerOpacity: 0.1 },
    keywords: ['日长', '阴浓', '并秀', '初炎', '蝉噪', '池塘']
  },
  {
    id: 'xiaoman', name: '小满', type: 'summer',
    colors: { primary: '#0d9488', secondary: '#14b8a6', bgGradient: 'from-teal-100 via-cyan-50 to-transparent', water: 'text-teal-200', vine: '#14b8a6' },
    poem: { title: '小得 · 盈满', line: '夜莺啼绿柳，代码盈满仓' },
    visuals: { tree: 'lush', particles: 'willow_cats', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#fbbf24', glowColor: '#fde68a', size: 'large', blur: 32, opacity: 0.68 }, wind: 'gentle', travelerOpacity: 0.1 },
    keywords: ['盈满', '渐熟', '小得', '麦秋', '绿柳', '初满']
  },
  {
    id: 'mangzhong', name: '芒种', type: 'summer',
    colors: { primary: '#0e7490', secondary: '#06b6d4', bgGradient: 'from-yellow-50 via-cyan-50 to-transparent', water: 'text-cyan-300', vine: '#06b6d4' },
    poem: { title: '家家 · 插秧', line: '时雨及芒种，四野皆commit' },
    visuals: { tree: 'lush', particles: 'rain', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#facc15', glowColor: '#fef08a', size: 'large', blur: 35, opacity: 0.65 }, wind: 'none', travelerOpacity: 0.1 },
    keywords: ['忙种', '此时', '梅雨', '青梅', '插秧', '四野']
  },
  {
    id: 'xiazhi', name: '夏至', type: 'summer',
    colors: { primary: '#0369a1', secondary: '#38bdf8', bgGradient: 'from-blue-200 via-cyan-100 to-transparent', water: 'text-blue-300', vine: '#38bdf8' },
    poem: { title: '半夏 · 生', line: '东边debug西边bug，道是无晴却有晴' },
    visuals: { tree: 'lush', particles: 'fireflies', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#fbbf24', glowColor: '#fde68a', size: 'large', blur: 28, opacity: 0.75 }, wind: 'none', travelerOpacity: 0.1 },
    keywords: ['极阳', '蝉鸣', '扶疏', '流萤', '半夏', '荷香']
  },
  {
    id: 'xiaoshu', name: '小暑', type: 'summer',
    colors: { primary: '#1e3a8a', secondary: '#60a5fa', bgGradient: 'from-blue-100 via-orange-100 to-transparent', water: 'text-blue-200', vine: '#60a5fa' },
    poem: { title: '温风 · 至', line: '荷风送香气，代码滴清响' },
    visuals: { tree: 'lush', particles: 'fireflies', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#f59e0b', glowColor: '#fcd34d', size: 'large', blur: 25, opacity: 0.8 }, wind: 'gentle', travelerOpacity: 0.1 },
    keywords: ['温风', '静心', '伏天', '清响', '荷风', '竹露']
  },
  {
    id: 'dashu', name: '大暑', type: 'summer',
    colors: { primary: '#c2410c', secondary: '#fb923c', bgGradient: 'from-orange-200 via-red-100 to-transparent', water: 'text-orange-200', vine: '#fb923c' },
    poem: { title: '大雨 · 时行', line: 'bug几时过，清风无处寻' },
    visuals: { tree: 'lush', particles: 'gold_dust', waterElement: 'lotus', creature: 'dragonfly', horse: 'summer_drinking', cottage: 'summer_shade', sun: { color: '#ea580c', glowColor: '#fb923c', size: 'large', blur: 22, opacity: 0.85 }, wind: 'none', travelerOpacity: 0.1 },
    keywords: ['酷热', '流金', '蒸腾', '在此', '赤日', '骄阳']
  },

  // --- AUTUMN (秋) - 枯藤老树 ---
  {
    id: 'liqiu', name: '立秋', type: 'autumn',
    colors: { primary: '#b45309', secondary: '#f59e0b', bgGradient: 'from-amber-100 via-orange-50 to-transparent', water: 'text-amber-200', vine: '#d97706' },
    poem: { title: '一叶 · 知秋', line: '空山新雨后，需求晚来秋' },
    visuals: { tree: 'red_maple', particles: 'red_maple', waterElement: 'none', creature: 'magpie', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#f97316', glowColor: '#fdba74', size: 'large', blur: 35, opacity: 0.7 }, wind: 'moderate', travelerOpacity: 0.6 },
    keywords: ['新凉', '知秋', '初肃', '叶落', '空山', '晚来']
  },
  {
    id: 'chushu', name: '处暑', type: 'autumn',
    colors: { primary: '#a16207', secondary: '#eab308', bgGradient: 'from-yellow-100 via-orange-50 to-transparent', water: 'text-yellow-200', vine: '#b45309' },
    poem: { title: '秋水 · 长天', line: '落霞与孤码齐飞，秋水共长天一色' },
    visuals: { tree: 'red_maple', particles: 'ginkgo', waterElement: 'none', creature: 'crow', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#ea580c', glowColor: '#fb923c', size: 'large', blur: 32, opacity: 0.75 }, wind: 'moderate', travelerOpacity: 0.65 },
    keywords: ['止热', '天高', '云淡', '丰收', '落霞', '孤鹜']
  },
  {
    id: 'bailu', name: '白露', type: 'autumn',
    colors: { primary: '#78350f', secondary: '#b45309', bgGradient: 'from-stone-200 via-amber-50 to-transparent', water: 'text-stone-300', vine: '#78350f' },
    poem: { title: '白露 · 为霜', line: '蒹葭苍苍，白露为bug' },
    visuals: { tree: 'withered', particles: 'mist', waterElement: 'none', creature: 'crow', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#d97706', glowColor: '#f59e0b', size: 'large', blur: 38, opacity: 0.7 }, wind: 'moderate', travelerOpacity: 0.7 },
    keywords: ['凝露', '苍苍', '清冷', '归鸿', '蒹葭', '为霜']
  },
  {
    id: 'qiufen', name: '秋分', type: 'autumn',
    colors: { primary: '#9a3412', secondary: '#ea580c', bgGradient: 'from-orange-100 via-amber-100 to-transparent', water: 'text-orange-300', vine: '#9a3412' },
    poem: { title: '平分 · 秋色', line: '自古逢秋悲寂寥，我言秋日无bug朝' },
    visuals: { tree: 'withered', particles: 'red_maple', waterElement: 'reflections', creature: 'crow', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#dc2626', glowColor: '#f87171', size: 'large', blur: 30, opacity: 0.8 }, wind: 'moderate', travelerOpacity: 0.75 },
    keywords: ['均分', '明月', '桂香', '寂寥', '秋思', '悲秋']
  },
  {
    id: 'hanlu', name: '寒露', type: 'autumn',
    colors: { primary: '#7c2d12', secondary: '#c2410c', bgGradient: 'from-stone-300 via-orange-50 to-transparent', water: 'text-stone-400', vine: '#7c2d12' },
    poem: { title: '秋风 · 萧瑟', line: '萧萧梧叶送寒声，江上秋风动bug情' },
    visuals: { tree: 'bare', particles: 'leaves', waterElement: 'none', creature: 'crow', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#b91c1c', glowColor: '#ef4444', size: 'large', blur: 28, opacity: 0.8 }, wind: 'strong', travelerOpacity: 0.85 },
    keywords: ['萧瑟', '寒意', '深秋', '客情', '梧叶', '断肠']
  },
  {
    id: 'shuangjiang', name: '霜降', type: 'autumn',
    colors: { primary: '#451a03', secondary: '#9a3412', bgGradient: 'from-stone-300 via-gray-100 to-transparent', water: 'text-stone-400', vine: '#451a03' },
    poem: { title: '霜满 · 寒天', line: '月落乌啼霜满天，江枫渔火对bug眠' },
    visuals: { tree: 'bare', particles: 'mist', waterElement: 'none', creature: 'crow', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#991b1b', glowColor: '#dc2626', size: 'large', blur: 35, opacity: 0.75 }, wind: 'strong', travelerOpacity: 0.9 },
    keywords: ['凝霜', '枯草', '初寒', '愁眠', '乌啼', '渔火']
  },

  // --- WINTER (冬) - 独钓寒江 ---
  {
    id: 'lidong', name: '立冬', type: 'winter',
    colors: { primary: '#334155', secondary: '#94a3b8', bgGradient: 'from-slate-200 via-gray-100 to-transparent', water: 'text-slate-300', vine: '#1c1917' },
    poem: { title: '万物 · 收藏', line: '北风潜入悄无声，未品浓秋已封版' },
    visuals: { tree: 'bare', particles: 'snow', waterElement: 'ice', creature: 'none', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#e2e8f0', glowColor: '#f1f5f9', size: 'small', blur: 50, opacity: 0.3 }, wind: 'moderate', travelerOpacity: 0.5 },
    keywords: ['收藏', '初冬', '寂静', '潜藏', '北风', '萧条']
  },
  {
    id: 'xiaoxue', name: '小雪', type: 'winter',
    colors: { primary: '#1e293b', secondary: '#64748b', bgGradient: 'from-slate-300 via-gray-200 to-transparent', water: 'text-slate-400', vine: '#000000' },
    poem: { title: '寒炉 · 煮酒', line: '晚来天欲雪，能改一行无' },
    visuals: { tree: 'snow_laden', particles: 'snow', waterElement: 'ice', creature: 'none', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#cbd5e1', glowColor: '#e2e8f0', size: 'small', blur: 55, opacity: 0.25 }, wind: 'moderate', travelerOpacity: 0.55 },
    keywords: ['微雪', '围炉', '夜话', '欲雪', '煮酒', '寒窗']
  },
  {
    id: 'daxue', name: '大雪', type: 'winter',
    colors: { primary: '#0f172a', secondary: '#475569', bgGradient: 'from-gray-300 via-slate-200 to-transparent', water: 'text-slate-500', vine: '#000000' },
    poem: { title: '独钓 · 寒江', line: '千山bug绝，万径人踪灭' },
    visuals: { tree: 'snow_laden', particles: 'snow_heavy', waterElement: 'ice', creature: 'none', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#94a3b8', glowColor: '#cbd5e1', size: 'small', blur: 60, opacity: 0.2 }, wind: 'strong', travelerOpacity: 0.6 },
    keywords: ['银装', '素裹', '绝迹', '寒江', '千山', '独钓']
  },
  {
    id: 'dongzhi', name: '冬至', type: 'winter',
    colors: { primary: '#172554', secondary: '#60a5fa', bgGradient: 'from-blue-50 via-slate-100 to-transparent', water: 'text-blue-200', vine: '#1e3a8a' },
    poem: { title: '一阳 · 初生', line: '天时人事日相催，冬至阳生版又来' },
    visuals: { tree: 'plum_bloom', particles: 'plum_blossom', waterElement: 'ice', creature: 'magpie', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#bfdbfe', glowColor: '#dbeafe', size: 'small', blur: 45, opacity: 0.35 }, wind: 'moderate', travelerOpacity: 0.55 },
    keywords: ['极阴', '一阳', '团圆', '待春', '阳生', '冬至']
  },
  {
    id: 'xiaohan', name: '小寒', type: 'winter',
    colors: { primary: '#312e81', secondary: '#6366f1', bgGradient: 'from-indigo-100 via-slate-100 to-transparent', water: 'text-indigo-200', vine: '#312e81' },
    poem: { title: '鹊垒 · 新巢', line: '小寒连大吕，欢鹊垒新feature' },
    visuals: { tree: 'plum_bloom', particles: 'plum_blossom', waterElement: 'ice', creature: 'magpie', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#a5b4fc', glowColor: '#c7d2fe', size: 'small', blur: 50, opacity: 0.25 }, wind: 'strong', travelerOpacity: 0.65 },
    keywords: ['极寒', '坚守', '筑巢', '大吕', '梅香', '冰封']
  },
  {
    id: 'dahan', name: '大寒', type: 'winter',
    colors: { primary: '#4c1d95', secondary: '#8b5cf6', bgGradient: 'from-violet-100 via-slate-100 to-transparent', water: 'text-violet-200', vine: '#4c1d95' },
    poem: { title: '坚冰 · 深处', line: '大寒虽甚冷，过此又发版' },
    visuals: { tree: 'plum_bloom', particles: 'snow_heavy', waterElement: 'ice', creature: 'magpie', horse: 'winter_snow', cottage: 'winter_snow', sun: { color: '#c4b5fd', glowColor: '#ddd6fe', size: 'small', blur: 55, opacity: 0.2 }, wind: 'strong', travelerOpacity: 0.7 },
    keywords: ['岁末', '除旧', '迎新', '坚冰', '逢春', '大吕']
  },

  // --- FESTIVALS (节日) - 张灯结彩 ---
  {
    id: 'cny', name: '春节', type: 'festival',
    colors: { primary: '#b91c1c', secondary: '#f87171', bgGradient: 'from-red-100 via-orange-50 to-transparent', water: 'text-red-200', vine: '#7f1d1d' },
    poem: { title: '程序员 · 拜年', line: '千门万户曈曈日，总有bug待修复' },
    visuals: { tree: 'lanterns_red', particles: 'fireworks', waterElement: 'river_lanterns', creature: 'magpie', horse: 'festival_decorated', cottage: 'festival_lanterns', sun: { color: '#fbbf24', glowColor: '#fde68a', size: 'large', blur: 30, opacity: 0.7 }, wind: 'gentle', travelerOpacity: 0 },
    keywords: ['纳福', '团圆', '辞旧', '迎新', '吉祥', '爆竹'],
    festival: { greeting: '恭贺新禧', specialEffect: 'fireworks' }
  },
  {
    id: 'mid_autumn', name: '中秋', type: 'festival',
    colors: { primary: '#1e3a8a', secondary: '#fbbf24', bgGradient: 'from-blue-950 via-slate-900 to-transparent', water: 'text-blue-300', vine: '#1e3a8a' },
    poem: { title: '千里 · 婵娟', line: '但愿bug少，千里共线上' },
    visuals: { tree: 'bare', particles: 'fireflies', waterElement: 'reflections', creature: 'crane', horse: 'autumn_weary', cottage: 'autumn_smoke', sun: { color: '#fbbf24', glowColor: '#fef3c7', size: 'large', blur: 40, opacity: 0.6 }, wind: 'gentle', travelerOpacity: 0.3 },
    keywords: ['明月', '相思', '清辉', '团聚', '桂魄', '婵娟'],
    festival: { greeting: '花好月圆', specialEffect: 'sky_lanterns' }
  },
  {
    id: 'national', name: '国庆', type: 'festival',
    colors: { primary: '#991b1b', secondary: '#facc15', bgGradient: 'from-red-50 via-yellow-50 to-transparent', water: 'text-red-300', vine: '#991b1b' },
    poem: { title: '盛世 · 华诞', line: '九州代码迎新纪，四海程序乐大年' },
    visuals: { tree: 'lanterns_gold', particles: 'gold_dust', waterElement: 'none', creature: 'crane', horse: 'festival_decorated', cottage: 'festival_lanterns', sun: { color: '#dc2626', glowColor: '#fca5a5', size: 'large', blur: 25, opacity: 0.8 }, wind: 'gentle', travelerOpacity: 0 },
    keywords: ['盛世', '繁华', '锦绣', '同庆', '华夏', '龙腾'],
    festival: { greeting: '盛世华诞', specialEffect: 'gold_particles' }
  },
  {
    id: 'lantern_fest', name: '元宵', type: 'festival',
    colors: { primary: '#ea580c', secondary: '#fdba74', bgGradient: 'from-orange-100 via-red-50 to-transparent', water: 'text-orange-200', vine: '#c2410c' },
    poem: { title: '花市 · 灯如昼', line: '月上服务器，人约线上游' },
    visuals: { tree: 'lanterns_red', particles: 'fireflies', waterElement: 'river_lanterns', creature: 'magpie', horse: 'festival_decorated', cottage: 'festival_lanterns', sun: { color: '#f97316', glowColor: '#fed7aa', size: 'medium', blur: 35, opacity: 0.6 }, wind: 'gentle', travelerOpacity: 0.1 },
    keywords: ['灯火', '阑珊', '元夕', '同游', '花灯', '汤圆'],
    festival: { greeting: '灯火阑珊', specialEffect: 'floating_lanterns' }
  },
];

export const getThemeById = (id: string): ThemeConfig => {
  return THEMES.find(t => t.id === id) || THEMES[0];
};

export const getAllThemes = () => THEMES;

import { Lunar } from 'lunar-javascript';

export const calculateCurrentTheme = (): string => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();

  // 获取农历日期
  const lunar = Lunar.fromDate(now);
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  // 24节气计算
  const termDates = [
    { id: 'xiaohan', m: 1, d: 5 }, { id: 'dahan', m: 1, d: 20 },
    { id: 'lichun', m: 2, d: 3 }, { id: 'yushui', m: 2, d: 18 },
    { id: 'jingzhe', m: 3, d: 5 }, { id: 'chunfen', m: 3, d: 20 },
    { id: 'qingming', m: 4, d: 4 }, { id: 'guyu', m: 4, d: 19 },
    { id: 'lixia', m: 5, d: 5 }, { id: 'xiaoman', m: 5, d: 20 },
    { id: 'mangzhong', m: 6, d: 5 }, { id: 'xiazhi', m: 6, d: 21 },
    { id: 'xiaoshu', m: 7, d: 6 }, { id: 'dashu', m: 7, d: 22 },
    { id: 'liqiu', m: 8, d: 7 }, { id: 'chushu', m: 8, d: 22 },
    { id: 'bailu', m: 9, d: 7 }, { id: 'qiufen', m: 9, d: 22 },
    { id: 'hanlu', m: 10, d: 8 }, { id: 'shuangjiang', m: 10, d: 23 },
    { id: 'lidong', m: 11, d: 7 }, { id: 'xiaoxue', m: 11, d: 22 },
    { id: 'daxue', m: 12, d: 7 }, { id: 'dongzhi', m: 12, d: 21 },
  ];

  // 查找当前节气
  let currentTerm = 'lichun';
  let isTermDay = false;
  for (const t of termDates) {
    if (month > t.m || (month === t.m && day >= t.d)) {
      currentTerm = t.id;
      // 检查今天是否是节气当天
      if (month === t.m && day === t.d) {
        isTermDay = true;
      }
    } else {
      break;
    }
  }

  // 检查是否在节假日期间
  const isSpringFestival = lunarMonth === 1 && lunarDay >= 1 && lunarDay <= 7;
  const isNationalDay = month === 10 && day >= 1 && day <= 7;
  const isMidAutumn = lunarMonth === 8 && lunarDay === 15;
  const isLanternFestival = lunarMonth === 1 && lunarDay === 15;
  const isHoliday = isSpringFestival || isNationalDay || isMidAutumn || isLanternFestival;

  // 如果节气当天和节假日重合，12小时显示节假日，12小时显示节气
  if (isTermDay && isHoliday) {
    // 0-11点显示节假日，12-23点显示节气
    if (hour < 12) {
      if (isSpringFestival) return 'cny';
      if (isNationalDay) return 'national';
      if (isMidAutumn) return 'mid_autumn';
      if (isLanternFestival) return 'lantern_fest';
    }
    return currentTerm;
  }

  // 如果是节气当天（不重合），优先显示节气
  if (isTermDay) {
    return currentTerm;
  }

  // 节假日检查（非节气当天显示节假日）
  if (isSpringFestival) return 'cny';
  if (isNationalDay) return 'national';
  if (isMidAutumn) return 'mid_autumn';
  if (isLanternFestival) return 'lantern_fest';

  // 默认返回24节气
  return currentTerm;
};
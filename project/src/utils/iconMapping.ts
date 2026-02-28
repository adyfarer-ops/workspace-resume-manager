import type { LucideIcon } from 'lucide-react';
import type { SeasonType } from './themeRegistry';
import {
  // Spring icons
  Flower2, Sprout, Leaf, Bird, BookOpen, Send,
  // Summer icons
  Sun, Waves, Droplets, CloudSun, Palmtree, Flame,
  // Autumn icons
  Wind, CloudFog, Sunset, TreeDeciduous, Feather, MapPin,
  // Winter icons
  Snowflake, CloudSnow, Mountain, Coffee, Gem, Inbox,
  // Festival icons
  Star, Heart, Gift, Sparkles, Moon, Flag,
  // Shared across festival sets
  Palette, PenTool, Mail, Compass, Hammer,
  Wand2, FileText, MessageCircle, Scroll, Map,
  Wrench, Zap, BookOpen as Notebook, Phone
} from 'lucide-react';

export interface IconMapping {
  sectionId: string;
  label: string;
  icon: LucideIcon;
}

type IconSetKey = SeasonType | 'cny' | 'mid_autumn' | 'national' | 'lantern_fest';

const SECTION_LABELS: Record<string, string> = {
  about: '关于',
  experience: '经历',
  projects: '项目',
  skills: '背景',
  notes: '笔记',
  contact: '联系',
};

const ICON_SETS: Record<IconSetKey, Record<string, LucideIcon>> = {
  spring: {
    about: Flower2,
    experience: Sprout,
    projects: Leaf,
    skills: Bird,
    notes: BookOpen,
    contact: Send,
  },
  summer: {
    about: Sun,
    experience: Waves,
    projects: CloudSun,
    skills: Droplets,
    notes: Palmtree,
    contact: Flame,
  },
  autumn: {
    about: Wind,
    experience: TreeDeciduous,
    projects: Sunset,
    skills: CloudFog,
    notes: Feather,
    contact: MapPin,
  },
  winter: {
    about: Snowflake,
    experience: Mountain,
    projects: CloudSnow,
    skills: Coffee,
    notes: Gem,
    contact: Inbox,
  },
  festival: {
    about: Star,
    experience: Gift,
    projects: Sparkles,
    skills: Heart,
    notes: Scroll,
    contact: Mail,
  },
  cny: {
    about: Star,
    experience: Gift,
    projects: Sparkles,
    skills: Heart,
    notes: Scroll,
    contact: Mail,
  },
  mid_autumn: {
    about: Moon,
    experience: Compass,
    projects: Star,
    skills: Wand2,
    notes: Notebook,
    contact: MessageCircle,
  },
  national: {
    about: Flag,
    experience: Map,
    projects: Hammer,
    skills: Zap,
    notes: FileText,
    contact: Phone,
  },
  lantern_fest: {
    about: Sparkles,
    experience: Palette,
    projects: Wrench,
    skills: Star,
    notes: PenTool,
    contact: Send,
  },
};

/**
 * 获取当前季节/节日对应的导航图标映射
 * @param seasonType - 当前季节类型
 * @param festivalId - 可选的节日 ID（cny / mid_autumn / national / lantern_fest）
 * @returns 导航图标映射数组，每个元素对应一个导航板块
 */
export function getSeasonalIcons(
  seasonType: SeasonType,
  festivalId?: string
): IconMapping[] {
  const key: IconSetKey = festivalId && (festivalId in ICON_SETS)
    ? (festivalId as IconSetKey)
    : seasonType;

  const iconSet = ICON_SETS[key] ?? ICON_SETS[seasonType];

  return Object.entries(iconSet).map(([sectionId, icon]) => ({
    sectionId,
    label: SECTION_LABELS[sectionId] ?? sectionId,
    icon,
  }));
}

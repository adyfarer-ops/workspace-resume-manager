export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  age: number;
}

export interface Education {
  school: string;
  major: string;
  period: string;
  honors?: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  details: string[];
}

export interface SubProjectLink {
  type: 'h5' | 'miniapp';
  label: string;
  url?: string;
  qrcode?: string;
}

export interface SubProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  image?: string;
  links?: SubProjectLink[];
  techStack?: string[];
  aiTools?: string[];
  platforms?: string[];
}

export interface Project {
  name: string;
  role?: string;
  period: string;
  tags: string[];
  description: string[];
  subProjects?: SubProject[];
  link?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string[];
  source_url: string | null;
  is_imitation: boolean;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  name: string;
  title: string;
  quote: string;
  avatar: string;
  about: string;
  contact: ContactInfo;
  education: Education[];
  skills: SkillCategory[];
  skillCategories?: SkillCategory[];
  workExperience: Experience[];
  projects: Project[];
  notes: Note[];
}


// 场景元素相关类型定义

export type HorseState = 'spring_flowers' | 'summer_drinking' | 'autumn_weary' | 'winter_snow' | 'festival_decorated';

export type CottageState = 'spring_bloom' | 'summer_shade' | 'autumn_smoke' | 'winter_snow' | 'festival_lanterns' | 'spring_flowers' | 'summer_lush' | 'autumn_leaves' | 'festival_lights';

export type WindIntensity = 'none' | 'gentle' | 'moderate' | 'strong';

export type FestivalType = 'cny' | 'mid_autumn' | 'national' | 'lantern_fest';

export interface SunConfig {
  color: string;
  glowColor: string;
  size: 'small' | 'medium' | 'large';
  blur: number;
  opacity: number;
}

export interface FestivalConfig {
  greeting: string;
  specialEffect: string;
}

export interface FeedbackStyle {
  type: 'ink_ripple' | 'petals' | 'water_ripple' | 'leaves' | 'snowflakes' | 'firecracker' | 'moonlight' | 'lantern_glow' | 'gold_stars';
  color: string;
  particleCount: number;
}

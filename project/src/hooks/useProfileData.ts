import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Note } from '../types';

export interface ProfileData extends Profile {
  id: string;
  education: any[];
  workExperience: any[];
  skillCategories: any[];
  projects: any[];
  notes: Note[];
}

// 从本地 JSON 文件加载数据
async function loadLocalData() {
  try {
    const [profileRes, experienceRes, educationRes, skillsRes, projectsRes] = await Promise.all([
      fetch('/data/profile.json').catch(() => null),
      fetch('/data/experience.json').catch(() => null),
      fetch('/data/education.json').catch(() => null),
      fetch('/data/skills.json').catch(() => null),
      fetch('/data/projects.json').catch(() => null)
    ]);

    if (!profileRes || !experienceRes || !educationRes || !skillsRes || !projectsRes) {
      return null;
    }

    const [profile, experience, education, skills, projects] = await Promise.all([
      profileRes.json(),
      experienceRes.json(),
      educationRes.json(),
      skillsRes.json(),
      projectsRes.json()
    ]);

    // 转换技能数据格式
    const skillCategories = skills.skills.technical.map((cat: any) => ({
      name: cat.category,
      skills: cat.items.map((item: string) => ({ name: item }))
    }));

    // 转换工作经历格式
    const workExperience = experience.experiences.map((exp: any) => ({
      company: exp.company,
      role: exp.position,
      period: exp.period,
      details: exp.description.split('；').filter((d: string) => d.trim())
    }));

    // 转换项目格式
    const processedProjects = projects.projects.map((proj: any) => ({
      name: proj.name,
      role: proj.role,
      period: proj.period,
      tags: proj.tags,
      description: proj.description ? [proj.description] : [],
      subProjects: (proj.subProjects || []).map((sub: any) => ({
        ...sub,
        tech_stack: sub.techStack || [],
        ai_tools: sub.aiTools || [],
        project_links: sub.links || []
      })),
      highlight: proj.highlight || false
    }));

    return {
      ...profile,
      id: 'local',
      nickName: '大鱼',
      contact: {
        age: profile.contact.age,
        location: profile.contact.location,
        phone: profile.contact.phone,
        email: profile.contact.email
      },
      education: education.education,
      workExperience: workExperience,
      skillCategories: skillCategories,
      skills: skillCategories,
      projects: processedProjects,
      notes: []
    };
  } catch (error) {
    // 静默处理错误
    return null;
  }
}

// 从 Supabase 加载数据
async function loadSupabaseData() {
  try {
    // 查询 profiles 表，获取第一条记录（因为我们只有一条个人介绍记录）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (profileError) throw profileError;
    if (!profile) throw new Error('Profile not found');

    const [
      { data: education },
      { data: workExperience },
      { data: skillCategories },
      { data: projects },
      { data: notes }
    ] = await Promise.all([
      supabase.from('education').select('*').eq('profile_id', profile.id).order('sort_order'),
      supabase.from('work_experience').select('*').eq('profile_id', profile.id).order('sort_order'),
      supabase.from('skill_categories').select('*, skills(*)').eq('profile_id', profile.id).order('sort_order'),
      supabase.from('projects').select(`
        *,
        sub_projects(
          *,
          project_links(*)
        )
      `).eq('profile_id', profile.id).order('sort_order'),
      supabase.from('notes').select('*').eq('status', 'published').order('created_at', { ascending: false })
    ]);

    const processedSkillCategories = (skillCategories || []).map((cat: any) => ({
      ...cat,
      skills: cat.skills || []
    }));

    const processedProjects = (projects || []).map((proj: any) => ({
      ...proj,
      tags: proj.tags || [],
      description: proj.description || [],
      subProjects: (proj.sub_projects || []).map((sub: any) => ({
        ...sub,
        tags: sub.tags || [],
        techStack: sub.tech_stack || [],
        aiTools: sub.ai_tools || [],
        platforms: sub.platforms || [],
        image: sub.image ? (sub.image.startsWith('/ady') ? sub.image : '/ady' + sub.image) : null,
        links: (sub.project_links || []).map((link: any) => ({
          ...link,
          qrcode: link.qrcode ? (link.qrcode.startsWith('/ady') ? link.qrcode : '/ady' + link.qrcode) : null
        }))
      }))
    }));

    return {
      ...profile,
      name: '安鼎禹',
      nickName: '大鱼',
      title: profile.title || '',
      quote: profile.quote || '',
      avatar: profile.avatar || '',
      about: profile.about || '',
      contact: {
        age: profile.age || 0,
        location: profile.location || '',
        phone: profile.phone || '',
        email: profile.email || ''
      },
      education: education || [],
      workExperience: (workExperience || []).map((exp: any) => ({
        ...exp,
        details: exp.details || []
      })),
      skillCategories: processedSkillCategories,
      skills: processedSkillCategories,
      projects: processedProjects,
      notes: notes || []
    };
  } catch (error) {
    // 静默处理错误
    throw error;
  }
}

export function useProfileData() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // 首先尝试从 Supabase 加载（优先使用数据库数据）
      const supabaseData = await loadSupabaseData();
      if (supabaseData) {
        setData(supabaseData as ProfileData);
        setLoading(false);
        return;
      }
      
      // 如果 Supabase 失败，使用本地 JSON
      const localData = await loadLocalData();
      if (localData) {
        setData(localData as ProfileData);
        setLoading(false);
        return;
      }
      
      throw new Error('无法加载数据');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: loadProfileData };
}

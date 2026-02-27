const express = require('express');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3002;

const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'resume-extended.html');

// Supabase 配置
const SUPABASE_URL = 'https://riieooizyhovmgvhpcxj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjg1MCwiZXhwIjoyMDg2OTc4ODUwfQ.azMzZoioMnKKJwwwmaroxTxLnVYHMasfAxkW6lkdptk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadDataFromSupabase() {
  try {
    // 获取 profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (profileError) throw profileError;
    if (!profile) throw new Error('Profile not found');

    // 并行获取其他数据
    const [
      { data: education },
      { data: workExperience },
      { data: skillCategories },
      { data: projects }
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
      `).eq('profile_id', profile.id).order('sort_order')
    ]);

    return {
      profile: {
        name: profile.name || '安鼎禹',
        title: profile.title || '',
        quote: profile.quote || '',
        avatar: profile.avatar && !profile.avatar.includes('picsum.photos') ? profile.avatar : '/ady/avatar.png',
        about: profile.about || '',
        contact: {
          age: profile.age || 0,
          location: profile.location || '',
          phone: profile.phone || '',
          email: profile.email || ''
        }
      },
      education: education || [],
      workExperience: (workExperience || []).map(exp => ({
        company: exp.company,
        role: exp.role,
        period: exp.period,
        description: exp.description || '',
        details: exp.details || []
      })),
      skillCategories: (skillCategories || []).map(cat => ({
        title: cat.title,
        skills: (cat.skills || []).map(s => ({ name: s.name }))
      })),
      projects: (projects || []).map(proj => ({
        name: proj.name,
        role: proj.role,
        period: proj.period,
        description: proj.description || '',
        details: proj.details || [],
        achievements: proj.achievements || [],
        subProjects: (proj.sub_projects || []).map(sub => ({
          title: sub.title,
          subtitle: sub.subtitle,
          description: sub.description,
          techStack: (sub.tech_stack || []).join(' · ')
        }))
      }))
    };
  } catch (error) {
    console.error('Supabase 数据加载失败:', error);
    throw error;
  }
}

async function generatePDF() {
  const { profile, education, workExperience, skillCategories, projects } = await loadDataFromSupabase();
  
  // 处理头像 URL
  let avatarUrl = profile.avatar;
  if (avatarUrl.startsWith('/')) {
    avatarUrl = 'https://yfarer.cn' + avatarUrl;
  }
  
  // 动态生成个人介绍（与网站一致）
  let dynamicAbout = profile.about || '';
  
  // 获取最新的技能
  const skillNames = skillCategories?.flatMap(cat => 
    cat.skills?.slice(0, 3).map(s => s.name)
  ) || [];
  
  // 获取最新的项目
  const latestProjects = projects?.slice(0, 2).map(p => p.name) || [];
  
  // 添加技能描述
  if (skillNames.length > 0) {
    dynamicAbout += ` 目前专注于${skillNames.slice(0, 3).join('、')}等技术领域。`;
  }
  
  // 添加项目描述
  if (latestProjects.length > 0) {
    dynamicAbout += ` 近期正在开发${latestProjects.join('、')}等项目。`;
  }
  
  // 添加笔记描述（从数据库查询笔记数量）
  try {
    const { data: notes } = await supabase
      .from('notes')
      .select('id')
      .eq('status', 'published');
    const notesCount = notes?.length || 0;
    if (notesCount > 0) {
      dynamicAbout += ` 持续学习并记录了${notesCount}篇技术笔记。`;
    }
  } catch (e) {
    // 忽略笔记查询错误
  }
  
  const templateData = {
    name: profile.name,
    avatar: avatarUrl,
    title: profile.title,
    quote: profile.quote,
    age: profile.contact?.age,
    location: profile.contact?.location,
    phone: profile.contact?.phone,
    email: profile.contact?.email,
    about: dynamicAbout,
    skillCategories: skillCategories,
    projects: projects.map(proj => ({
      name: proj.name,
      role: proj.role,
      period: proj.period,
      description: Array.isArray(proj.description) 
        ? proj.description.map((item, index) => `${index + 1}. ${item}`).join('\n')
        : proj.description,
      details: proj.details,
      achievements: proj.achievements,
      subProjects: proj.subProjects
    })),
    experiences: workExperience.map(exp => ({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      description: exp.description,
      details: exp.details.length > 0 ? exp.details : exp.description.split('；').filter(d => d.trim())
    })),
    education: education
  };
  
  Handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });
  
  Handlebars.registerHelper('breaklines', function(text) {
    if (!text) return '';
    return new Handlebars.SafeString(text.replace(/\n/g, '<br>'));
  });
  
  const template = Handlebars.compile(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  const html = template(templateData);

  const browser = await puppeteer.launch({ 
    headless: true, 
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const height = await page.evaluate(() => document.querySelector('.resume').scrollHeight);
  const heightInMm = Math.ceil(height * 0.264583);
  
  const pdf = await page.pdf({
    width: '210mm',
    height: `${heightInMm}mm`,
    printBackground: true
  });

  await browser.close();
  return pdf;
}

app.get('/api/resume/pdf', async (req, res) => {
  try {
    const pdf = await generatePDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.send(pdf);
  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ error: 'PDF生成失败', msg: error.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'resume-pdf-api', source: 'supabase' }));

app.listen(PORT, () => console.log(`PDF API on port ${PORT} (Supabase source)`));

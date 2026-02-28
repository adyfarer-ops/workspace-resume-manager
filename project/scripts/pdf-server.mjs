import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase 客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://riieooizyhovmgvhpcxj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODI0MjMsImV4cCI6MjA1Mjk1ODQyM30.0_K1iTq7fZ7C8z8X9Y0Z1a2b3c4d5e6f7g8h9i0j1k2';

const supabase = createClient(supabaseUrl, supabaseKey);

// 读取头像
const avatarPath = path.join(__dirname, '..', 'public', 'avatar.png');
let avatarDataUrl = '';
try {
  const avatarBase64 = fs.readFileSync(avatarPath, { encoding: 'base64' });
  avatarDataUrl = `data:image/png;base64,${avatarBase64}`;
} catch (e) {
  console.log('头像读取失败，使用默认头像');
}

// 从 Supabase 获取简历数据
async function getResumeData() {
  try {
    // 获取个人资料
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (profileError) throw profileError;

    // 获取教育背景
    const { data: education, error: eduError } = await supabase
      .from('education')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (eduError) throw eduError;

    // 获取工作经历
    const { data: workExperience, error: workError } = await supabase
      .from('work_experience')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (workError) throw workError;

    // 获取技能
    const { data: skillCategories, error: skillError } = await supabase
      .from('skill_categories')
      .select('*, skills(*)')
      .order('sort_order', { ascending: true });
    
    if (skillError) throw skillError;

    // 获取项目
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('*, sub_projects(*), project_links(*)')
      .order('sort_order', { ascending: true });
    
    if (projError) throw projError;

    return {
      profile,
      education,
      workExperience,
      skillCategories,
      projects
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    return null;
  }
}

// 生成 PDF
async function generatePDF(data) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2
  });

  const profile = data.profile || {};
  const education = data.education || [];
  const workExperience = data.workExperience || [];
  const skillCategories = data.skillCategories || [];
  const projects = data.projects || [];

  // 构建 HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1f2937;
    }
    .resume {
      width: 794px;
      min-height: 1123px;
      display: flex;
      background: white;
    }
    .sidebar {
      width: 260px;
      background: #f8fafc;
      padding: 40px 25px;
    }
    .avatar-wrap {
      text-align: center;
      margin-bottom: 35px;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto;
      overflow: hidden;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .s-section { margin-bottom: 30px; }
    .s-title {
      font-size: 15px;
      font-weight: bold;
      color: #1f2937;
      padding-bottom: 8px;
      border-bottom: 2px solid #10b981;
      margin-bottom: 15px;
    }
    .s-row {
      font-size: 12px;
      color: #374151;
      margin: 10px 0;
    }
    .edu-item { margin-bottom: 15px; }
    .edu-school { font-weight: bold; font-size: 13px; margin-bottom: 3px; }
    .edu-major { font-size: 12px; color: #4b5563; }
    .edu-time { font-size: 11px; color: #9ca3af; }
    .skill-item { margin-bottom: 14px; }
    .skill-name { font-weight: bold; font-size: 12px; color: #10b981; margin-bottom: 5px; }
    .skill-desc { font-size: 11px; color: #4b5563; line-height: 1.7; }
    .about-text { font-size: 11px; color: #4b5563; line-height: 1.8; text-align: justify; }
    
    .main {
      flex: 1;
      padding: 40px 35px;
    }
    .header { margin-bottom: 35px; }
    .name { font-size: 38px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
    .title { font-size: 15px; color: #10b981; margin-bottom: 12px; }
    .quote { font-size: 13px; color: #6b7280; font-style: italic; }
    
    .m-section { margin-bottom: 30px; }
    .m-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .m-icon {
      width: 28px;
      height: 28px;
      background: #10b981;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
    .m-title { font-size: 18px; font-weight: bold; }
    
    .timeline-item {
      position: relative;
      padding-left: 20px;
      margin-bottom: 25px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 10px;
      height: 10px;
      border: 2px solid #10b981;
      border-radius: 50%;
      background: white;
    }
    .timeline-item::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 15px;
      width: 2px;
      height: calc(100% + 10px);
      background: #e5e7eb;
    }
    .timeline-item:last-child::after { display: none; }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    .item-name { font-size: 15px; font-weight: bold; }
    .item-time { font-size: 12px; color: #10b981; }
    .item-role { font-size: 13px; color: #4b5563; margin-bottom: 8px; }
    .item-detail { font-size: 12px; color: #4b5563; margin: 4px 0; line-height: 1.6; }
    
    .project-card {
      background: #f0fdf4;
      border-radius: 8px;
      padding: 15px;
      margin: 12px 0;
    }
    .card-title { font-weight: bold; font-size: 13px; margin-bottom: 6px; }
    .card-subtitle { color: #10b981; font-size: 12px; margin-left: 5px; }
    .card-desc { font-size: 12px; color: #4b5563; line-height: 1.6; margin-bottom: 4px; }
    .card-tech { font-size: 11px; color: #6b7280; }
    .tags { margin-top: 10px; }
    .tag {
      display: inline-block;
      font-size: 10px;
      background: #fef3c7;
      color: #92400e;
      padding: 3px 10px;
      border-radius: 3px;
      margin-right: 6px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="resume">
    <div class="sidebar">
      <div class="avatar-wrap"><div class="avatar">${avatarDataUrl ? `<img src="${avatarDataUrl}" alt="头像">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#3b82f6,#1e40af);display:flex;align-items:center;justify-content:center;color:white;font-size:48px;font-weight:bold;">${profile.name?.charAt(0) || '大'}</div>`}</div></div>
      
      <div class="s-section">
        <div class="s-title">基本信息</div>
        <div class="s-row"><strong>年龄：</strong>${profile.age || 27}岁</div>
        <div class="s-row"><strong>籍贯：</strong>${profile.location || '河南'}</div>
        <div class="s-row"><strong>电话：</strong>${profile.phone ? atob(profile.phone) : '17630830323'}</div>
        <div class="s-row"><strong>邮箱：</strong>${profile.email || 'yfarer@163.com'}</div>
      </div>
      
      <div class="s-section">
        <div class="s-title">教育背景</div>
        ${education.map(e => `
        <div class="edu-item">
          <div class="edu-school">${e.school}</div>
          <div class="edu-major">${e.major}</div>
          <div class="edu-time">${e.period}</div>
        </div>`).join('')}
      </div>
      
      <div class="s-section">
        <div class="s-title">专业技能</div>
        ${skillCategories.map(s => `
        <div class="skill-item">
          <div class="skill-name">${s.title}</div>
          <div class="skill-desc">${s.skills?.map(skill => skill.name).join('、') || ''}</div>
        </div>`).join('')}
      </div>
      
      <div class="s-section">
        <div class="s-title">自我评价</div>
        <div class="about-text">${profile.about || profile.bio || ''}</div>
      </div>
    </div>
    
    <div class="main">
      <div class="header">
        <div class="name">${profile.name || '大鱼'}</div>
        <div class="title">${profile.title || 'Web前端开发工程师 / AI智能体开发 / AI编程'}</div>
        <div class="quote">${profile.quote || '"偷得浮生半日闲，明天依旧打工人。"'}</div>
      </div>
      
      <div class="m-section">
        <div class="m-header">
          <div class="m-icon">工</div>
          <div class="m-title">工作经历</div>
        </div>
        ${workExperience.map(w => `
        <div class="timeline-item">
          <div class="item-header">
            <span class="item-name">${w.company}</span>
            <span class="item-time">${w.period}</span>
          </div>
          <div class="item-role">${w.role}</div>
          ${(w.details || []).map(d => `<div class="item-detail">• ${d}</div>`).join('')}
        </div>`).join('')}
      </div>
      
      <div class="m-section">
        <div class="m-header">
          <div class="m-icon">项</div>
          <div class="m-title">个人经验与项目</div>
        </div>
        ${projects.slice(0, 3).map(p => `
        <div class="timeline-item">
          <div class="item-header">
            <span class="item-name">${p.name}</span>
            <span class="item-time">${p.period}</span>
          </div>
          <div class="item-role">${p.role}</div>
          ${(p.sub_projects || []).slice(0, 2).map((s, j) => `
          <div class="project-card">
            <div class="card-title">${j + 1}. ${s.title}${s.subtitle ? `<span class="card-subtitle">(${s.subtitle})</span>` : ''}</div>
            <div class="card-desc">${s.description}</div>
            ${s.tech_stack ? `<div class="card-tech"><strong>技术栈：</strong>${s.tech_stack.join('、')}</div>` : ''}
          </div>`).join('')}
          <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);

  const pdfBuffer = await page.pdf({
    width: '794px',
    height: '1123px',
    printBackground: true,
    preferCSSPageSize: true
  });
  
  await browser.close();
  
  return pdfBuffer;
}

// API 路由
app.get('/api/generate-pdf', async (req, res) => {
  try {
    const data = await getResumeData();
    
    if (!data) {
      return res.status(500).json({ error: '无法获取简历数据' });
    }
    
    const pdfBuffer = await generatePDF(data);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="大鱼_简历.pdf"');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    res.status(500).json({ error: '生成 PDF 失败' });
  }
});

app.listen(PORT, () => {
  console.log(`PDF 生成服务运行在端口 ${PORT}`);
});

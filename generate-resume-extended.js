const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const https = require('https');
const http = require('http');

/**
 * 可延伸简历生成器 - 基于你提供的PDF样式
 * 特点：
 * 1. 复刻PDF的排版样式（左侧栏+右侧内容）
 * 2. 内容可无限延伸
 * 3. 包含头像
 */

const DATA_DIR = path.join(__dirname, 'data');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'resume-extended.html');
const OUTPUT_DIR = path.join(__dirname, 'project', 'public');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * 下载图片并转为 base64
 */
async function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const ext = path.extname(url).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
        resolve(`data:${mimeType};base64,${buffer.toString('base64')}`);
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * 加载所有数据文件
 */
function loadData() {
  const profile = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'profile.json'), 'utf8'));
  const skills = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'skills.json'), 'utf8'));
  const experience = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'experience.json'), 'utf8'));
  const projects = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'projects.json'), 'utf8'));
  const education = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'education.json'), 'utf8'));

  return { profile, skills, experience, projects, education };
}

/**
 * 准备模板数据
 */
async function prepareTemplateData(data) {
  const { profile, skills, experience, projects, education } = data;

  // 处理技能分类
  const skillCategories = skills.skills.technical.map(cat => ({
    title: cat.category,
    skills: cat.items.map(item => ({ name: item }))
  }));

  // 处理项目数据 - 包含子项目
  const processedProjects = projects.projects.map(proj => ({
    name: proj.name,
    role: proj.role,
    period: proj.period,
    tags: proj.tags || [],
    description: proj.description ? 
      (Array.isArray(proj.description) ? proj.description[0] : proj.description) : null,
    subProjects: proj.subProjects ? proj.subProjects.map(sub => ({
      title: sub.title,
      subtitle: sub.subtitle,
      description: sub.description,
      techStack: sub.techStack ? sub.techStack.join(', ') : null
    })) : null
  }));

  // 处理工作经历
  const processedExperiences = experience.experiences.map(exp => ({
    company: exp.company,
    role: exp.position,
    period: exp.period,
    description: exp.description,
    achievements: exp.achievements || []
  }));

  // 处理头像
  let avatarUrl = profile.avatar;
  if (!avatarUrl.startsWith('http')) {
    avatarUrl = 'https://yfarer.cn' + avatarUrl;
  }
  const avatarBase64 = await imageToBase64(avatarUrl);

  return {
    name: profile.name,
    avatar: avatarBase64 || avatarUrl,
    title: profile.title,
    quote: profile.quote,
    age: profile.contact.age,
    location: profile.contact.location,
    phone: profile.contact.phone,
    email: profile.contact.email,
    about: profile.about,
    skillCategories,
    projects: processedProjects,
    experiences: processedExperiences,
    education: education.education
  };
}

/**
 * 生成HTML文件
 */
function generateHTML(templateData) {
  const templateSource = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const template = Handlebars.compile(templateSource);
  const html = template(templateData);
  
  const htmlPath = path.join(OUTPUT_DIR, 'resume-extended.html');
  fs.writeFileSync(htmlPath, html);
  console.log('✓ 可延伸简历生成完成:', htmlPath);
  
  return htmlPath;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('=== 可延伸简历生成器 ===\n');
    
    console.log('加载数据...');
    const data = loadData();
    
    console.log('准备模板数据（含头像下载）...');
    const templateData = await prepareTemplateData(data);
    
    console.log('生成HTML...');
    const htmlPath = generateHTML(templateData);
    
    console.log('\n=== 生成完成 ===');
    console.log('访问地址: https://yfarer.cn/resume-extended.html');
    console.log('文件位置:', htmlPath);
    console.log('\n特点：');
    console.log('  - 复刻PDF排版样式');
    console.log('  - 左侧栏：基本信息、教育、技能');
    console.log('  - 右侧：工作经历、项目、自我评价');
    console.log('  - 内容可无限延伸');
    console.log('  - 包含头像');
    console.log('  - 点击"打印"按钮可保存为PDF');
    
    return htmlPath;
  } catch (error) {
    console.error('生成失败:', error);
    throw error;
  }
}

// 如果直接运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

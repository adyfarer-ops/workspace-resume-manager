const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// 加载JSON数据
const profile = JSON.parse(fs.readFileSync('./data/profile.json', 'utf8'));
const experience = JSON.parse(fs.readFileSync('./data/experience.json', 'utf8'));
const projects = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));
const skills = JSON.parse(fs.readFileSync('./data/skills.json', 'utf8'));
const education = JSON.parse(fs.readFileSync('./data/education.json', 'utf8'));

// 读取头像base64
const avatarBase64 = fs.readFileSync('./project/public/avatar.png').toString('base64');

// 读取HTML模板
const template = fs.readFileSync('./project/public/resume-template-seedeai.html', 'utf8');

// 生成简历HTML
function generateResume() {
  let html = template;
  
  // 替换基本信息
  html = html.replace(/{{NAME}}/g, profile.name);
  html = html.replace(/{{TITLE}}/g, profile.title);
  html = html.replace(/{{QUOTE}}/g, profile.quote.replace(/"/g, ''));
  html = html.replace(/{{AGE}}/g, profile.contact.age);
  html = html.replace(/{{LOCATION}}/g, profile.contact.location);
  html = html.replace(/{{PHONE}}/g, profile.contact.phone);
  html = html.replace(/{{EMAIL}}/g, profile.contact.email);
  html = html.replace(/{{ABOUT}}/g, profile.about);
  
  // 替换头像
  html = html.replace(/{{AVATAR_BASE64}}/g, `data:image/png;base64,${avatarBase64}`);
  
  // 替换教育背景
  const edu = education.education[0];
  html = html.replace(/{{EDU_SCHOOL}}/g, edu.school);
  html = html.replace(/{{EDU_MAJOR}}/g, edu.major);
  html = html.replace(/{{EDU_PERIOD}}/g, edu.period);
  
  // 替换技能
  const skillAI = skills.skills.technical.find(s => s.category === 'AI 智能体开发');
  const skillWeb = skills.skills.technical.find(s => s.category === 'Web 开发');
  const skillAITools = skills.skills.technical.find(s => s.category === 'AI 工具使用');
  const skillAICoding = skills.skills.technical.find(s => s.category === 'AI 编程工具');
  const skillDesign = skills.skills.technical.find(s => s.category === '设计与媒体');
  
  html = html.replace(/{{SKILL_AI}}/g, skillAI ? skillAI.items.join('、') : '');
  html = html.replace(/{{SKILL_WEB}}/g, skillWeb ? skillWeb.items.join('、') : '');
  html = html.replace(/{{SKILL_AI_TOOLS}}/g, skillAITools ? skillAITools.items.join('、') : '');
  html = html.replace(/{{SKILL_AI_CODING}}/g, skillAICoding ? skillAICoding.items.join('、') : '');
  html = html.replace(/{{SKILL_DESIGN}}/g, skillDesign ? skillDesign.items.join('、') : '');
  html = html.replace(/{{SKILL_LEARNING}}/g, '持续学习新技能，适应行业变化');
  
  // 替换工作经历
  const exp1 = experience.experiences[0];
  const exp2 = experience.experiences[1];
  
  html = html.replace(/{{EXP1_COMPANY}}/g, exp1.company);
  html = html.replace(/{{EXP1_PERIOD}}/g, exp1.period);
  html = html.replace(/{{EXP1_POSITION}}/g, exp1.position);
  html = html.replace(/{{EXP1_ACHIEVEMENTS}}/g, exp1.achievements.map(a => `• ${a}`).join('<br>'));
  
  html = html.replace(/{{EXP2_COMPANY}}/g, exp2.company);
  html = html.replace(/{{EXP2_PERIOD}}/g, exp2.period);
  html = html.replace(/{{EXP2_POSITION}}/g, exp2.position);
  html = html.replace(/{{EXP2_ACHIEVEMENTS}}/g, exp2.achievements.map(a => `• ${a}`).join('<br>'));
  
  // 替换项目经验
  const proj1 = projects.projects[0]; // AI编程工具应用
  const proj2 = projects.projects[1]; // Coze工作流
  const proj3 = projects.projects[2]; // 自媒体
  
  const zuihouyici = proj1.subProjects[1]; // 最后亿次
  
  html = html.replace(/{{PROJ1_NAME}}/g, proj1.name);
  html = html.replace(/{{PROJ1_PERIOD}}/g, proj1.period);
  html = html.replace(/{{PROJ1_SUBTITLE}}/g, `个人小程序【${zuihouyici.title}】（已上架）`);
  html = html.replace(/{{PROJ1_AI_TOOLS}}/g, zuihouyici.aiTools.join(', '));
  html = html.replace(/{{PROJ1_TECH}}/g, zuihouyici.techStack.join(', '));
  html = html.replace(/{{PROJ1_PLATFORMS}}/g, zuihouyici.platforms.join(' + '));
  html = html.replace(/{{PROJ1_DESC}}/g, proj1.subProjects[0].description);
  
  html = html.replace(/{{PROJ2_NAME}}/g, proj2.name);
  html = html.replace(/{{PROJ2_PERIOD}}/g, proj2.period);
  
  // Coze项目的5个子项
  for (let i = 0; i < 5; i++) {
    const detail = proj2.details[i] || '';
    const [title, desc] = detail.includes('：') ? detail.split('：', 2) : [detail, ''];
    html = html.replace(new RegExp(`{{PROJ2_ITEM${i+1}_TITLE}}`, 'g'), title);
    html = html.replace(new RegExp(`{{PROJ2_ITEM${i+1}_DESC}}`, 'g'), desc);
  }
  
  html = html.replace(/{{PROJ3_NAME}}/g, proj3.name);
  html = html.replace(/{{PROJ3_PERIOD}}/g, proj3.period);
  html = html.replace(/{{PROJ3_PLATFORM}}/g, `平台：${proj3.tags.join(' / ')}`);
  html = html.replace(/{{PROJ3_WORK}}/g, `工作内容：${proj3.description}`);
  html = html.replace(/{{PROJ3_RESULT}}/g, '产出效果：');
  html = html.replace(/{{PROJ3_ACHIEVEMENTS}}/g, proj3.achievements.map(a => `• ${a}`).join('<br>'));
  
  return html;
}

// API端点：生成简历
app.get('/api/resume', (req, res) => {
  const html = generateResume();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// API端点：下载简历HTML文件
app.get('/api/resume/download', (req, res) => {
  const html = generateResume();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="resume.html"');
  res.send(html);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Resume generator service running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/resume`);
});

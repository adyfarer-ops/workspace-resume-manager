const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function loadData() {
  const dataDir = './data';
  return {
    profile: JSON.parse(fs.readFileSync(`${dataDir}/profile.json`, 'utf8')),
    experience: JSON.parse(fs.readFileSync(`${dataDir}/experience.json`, 'utf8')),
    projects: JSON.parse(fs.readFileSync(`${dataDir}/projects.json`, 'utf8')),
    skills: JSON.parse(fs.readFileSync(`${dataDir}/skills.json`, 'utf8')),
    education: JSON.parse(fs.readFileSync(`${dataDir}/education.json`, 'utf8')),
    avatarBase64: fs.readFileSync('./project/public/avatar.png').toString('base64')
  };
}

function generateResumeHTML() {
  const data = loadData();
  const { profile, experience, projects, skills, education, avatarBase64 } = data;
  
  const template = fs.readFileSync('./project/public/resume-dynamic-template.html', 'utf8');
  let html = template;
  
  html = html.replace(/{{NAME}}/g, profile.name);
  html = html.replace(/{{TITLE}}/g, profile.title);
  html = html.replace(/{{QUOTE}}/g, profile.quote.replace(/"/g, ''));
  html = html.replace(/{{AGE}}/g, profile.contact.age);
  html = html.replace(/{{LOCATION}}/g, profile.contact.location);
  html = html.replace(/{{PHONE}}/g, profile.contact.phone);
  html = html.replace(/{{EMAIL}}/g, profile.contact.email);
  html = html.replace(/{{ABOUT}}/g, profile.about);
  html = html.replace(/{{AVATAR_BASE64}}/g, `data:image/png;base64,${avatarBase64}`);
  
  const edu = education.education[0];
  html = html.replace(/{{EDU_SCHOOL}}/g, edu.school);
  html = html.replace(/{{EDU_MAJOR}}/g, edu.major);
  html = html.replace(/{{EDU_PERIOD}}/g, edu.period);
  
  let skillsHtml = '';
  for (const skill of skills.skills.technical) {
    skillsHtml += `
                <div class="skill-category">
                    <div class="skill-name">${skill.category}</div>
                    <div class="skill-items">${skill.items.join('、')}</div>
                </div>
`;
  }
  html = html.replace('{{SKILLS_SECTION}}', skillsHtml);
  
  let experienceHtml = '';
  for (const exp of experience.experiences) {
    const achievementsHtml = exp.achievements.map(a => `                    <li>${a}</li>`).join('\n');
    experienceHtml += `
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-title">${exp.company}</div>
                        <div class="item-period">${exp.period}</div>
                    </div>
                    <div class="item-subtitle">${exp.position}</div>
                    <div class="item-content">
                        <ul class="achievement-list">
${achievementsHtml}
                        </ul>
                    </div>
                </div>
`;
  }
  html = html.replace('{{EXPERIENCE_SECTION}}', experienceHtml);
  
  let projectsHtml = '';
  for (const proj of projects.projects) {
    if (proj.id === 'ai-programming') {
      const subproj = proj.subProjects[1];
      projectsHtml += `
                <div class="project-item">
                    <div class="item-header">
                        <div class="item-title">${proj.name}</div>
                        <div class="item-period">${proj.period}</div>
                    </div>
                    <div class="item-subtitle">${proj.role}</div>
                    <div class="project-card">
                        <div class="project-card-title">个人小程序【${subproj.title}】（已上架）</div>
                        <div class="project-meta">
                            <div class="project-meta-item">
                                <span class="project-meta-label">AI工具：</span>
                                <span class="project-meta-value">${subproj.aiTools.join(', ')}</span>
                            </div>
                            <div class="project-meta-item">
                                <span class="project-meta-label">技术栈：</span>
                                <span class="project-meta-value">${subproj.techStack.join(', ')}</span>
                            </div>
                            <div class="project-meta-item" style="grid-column: 1 / -1;">
                                <span class="project-meta-label">适配平台：</span>
                                <span class="project-meta-value">${subproj.platforms.join(' + ')}</span>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 12px; font-size: 14px; color: #2c3e50;">
                        <strong>自动化办公：</strong>${proj.subProjects[0].description}
                    </p>
                </div>
`;
    } else if (proj.id === 'coze-workflow') {
      let cozeItemsHtml = '';
      for (let i = 0; i < proj.details.length; i++) {
        const detail = proj.details[i];
        const [title, desc] = detail.includes('：') ? detail.split('：', 2) : [detail, ''];
        cozeItemsHtml += `
                        <div class="coze-item">
                            <div class="coze-number">${String(i + 1).padStart(2, '0')}</div>
                            <div class="coze-content">
                                <div class="coze-title">${title}</div>
                                <div class="coze-desc">${desc}</div>
                            </div>
                        </div>
`;
      }
      projectsHtml += `
                <div class="project-item">
                    <div class="item-header">
                        <div class="item-title">${proj.name}</div>
                        <div class="item-period">${proj.period}</div>
                    </div>
                    <div class="item-subtitle">${proj.role}</div>
${cozeItemsHtml}
                </div>
`;
    } else if (proj.id === 'social-media') {
      const achievementsHtml = proj.achievements.map(a => `                        <li>${a}</li>`).join('\n');
      projectsHtml += `
                <div class="project-item">
                    <div class="item-header">
                        <div class="item-title">${proj.name}</div>
                        <div class="item-period">${proj.period}</div>
                    </div>
                    <div class="item-subtitle">${proj.role}</div>
                    <div class="social-card">
                        <p style="margin-bottom: 10px;"><strong>工作内容：</strong>${proj.description}</p>
                        <p style="margin-bottom: 8px;"><strong>产出效果：</strong></p>
                        <ul class="achievement-list">
${achievementsHtml}
                        </ul>
                    </div>
                </div>
`;
    }
  }
  html = html.replace('{{PROJECTS_SECTION}}', projectsHtml);
  
  return html;
}

async function generatePDF() {
  let browser = null;
  
  try {
    const chromiumPaths = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);
    
    let executablePath = null;
    for (const cp of chromiumPaths) {
      if (fs.existsSync(cp)) {
        executablePath = cp;
        break;
      }
    }
    
    if (!executablePath) {
      throw new Error('Chromium not found');
    }
    
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    const htmlContent = generateResumeHTML();
    
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
    
    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 路由
app.get('/resume', (req, res) => {
  try {
    const html = generateResumeHTML();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

app.get('/resume/download/html', (req, res) => {
  try {
    const html = generateResumeHTML();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.html"');
    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to download HTML' });
  }
});

app.get('/resume/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.get('/resume/download/pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[Resume API] Server running on port ${PORT}`);
  console.log(`[Resume API] Endpoints:`);
  console.log(`  - GET /resume              - View resume HTML`);
  console.log(`  - GET /resume/download/html - Download resume HTML`);
  console.log(`  - GET /resume/pdf          - View resume PDF`);
  console.log(`  - GET /resume/download/pdf - Download resume PDF`);
  console.log(`  - GET /health              - Health check`);
});

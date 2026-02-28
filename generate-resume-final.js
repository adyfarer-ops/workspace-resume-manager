const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const https = require('https');
const http = require('http');

/**
 * 单页无限延伸简历生成器
 * 特点：
 * 1. 复刻PDF排版样式
 * 2. 单页无限高度（所有内容在一张纸上）
 * 3. 包含头像
 */

const DATA_DIR = path.join(__dirname, 'data');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'resume-extended.html');
const OUTPUT_DIR = path.join(__dirname, 'output');

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

  // 处理项目数据
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
  // 读取模板并修改为适合截图的版本（移除打印按钮）
  let templateSource = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // 移除打印按钮
  templateSource = templateSource.replace(
    /<button class="print-btn"[^>]*>.*?<\/button>/s,
    ''
  );
  
  const template = Handlebars.compile(templateSource);
  const html = template(templateData);
  
  const htmlPath = path.join(OUTPUT_DIR, 'resume-final.html');
  fs.writeFileSync(htmlPath, html);
  console.log('✓ HTML生成完成:', htmlPath);
  
  return htmlPath;
}

/**
 * 使用 Playwright 截图并生成单页PDF
 */
async function captureAndGeneratePDF(htmlPath) {
  console.log('启动浏览器...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 加载本地HTML文件
  const fileUrl = 'file://' + htmlPath;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  
  // 等待字体和样式加载
  await page.waitForTimeout(1000);
  
  // 获取页面完整高度
  const bodyHeight = await page.evaluate(() => {
    return document.body.scrollHeight;
  });
  
  console.log(`页面高度: ${bodyHeight}px`);
  
  // 设置视口为完整页面大小
  await page.setViewportSize({
    width: 794, // A4宽度 210mm @ 96dpi
    height: bodyHeight
  });
  
  // 截图 - 完整页面
  const screenshotPath = path.join(OUTPUT_DIR, 'resume-final.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    type: 'png'
  });
  
  console.log('✓ 截图完成:', screenshotPath);
  
  await browser.close();
  
  // 将图片转换为PDF (单页)
  const pdfPath = await imageToPDF(screenshotPath, bodyHeight);
  
  return {
    html: htmlPath,
    screenshot: screenshotPath,
    pdf: pdfPath
  };
}

/**
 * 将图片转换为单页PDF
 */
async function imageToPDF(imagePath, imageHeight) {
  const pdfDoc = await PDFDocument.create();
  
  // 读取图片
  const imageBytes = fs.readFileSync(imagePath);
  const image = await pdfDoc.embedPng(imageBytes);
  
  // 计算PDF页面尺寸
  // A4宽度: 595.28 points (210mm)
  // 高度根据图片比例计算，确保单页显示
  const pageWidth = 595.28;
  const pageHeight = (image.height / image.width) * pageWidth;
  
  // 创建单页
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  
  // 绘制图片填满整个页面
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight
  });
  
  // 保存PDF
  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(OUTPUT_DIR, 'resume-final.pdf');
  fs.writeFileSync(pdfPath, pdfBytes);
  
  console.log('✓ PDF生成完成:', pdfPath);
  console.log(`  页面尺寸: ${pageWidth.toFixed(2)} x ${pageHeight.toFixed(2)} points`);
  console.log(`  约 ${(pageHeight / 841.89).toFixed(2)} 页A4高度`);
  
  return pdfPath;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('=== 单页无限延伸简历生成器 ===\n');
    
    // 1. 加载数据
    console.log('加载数据...');
    const data = loadData();
    
    // 2. 准备模板数据
    console.log('准备模板数据（含头像下载）...');
    const templateData = await prepareTemplateData(data);
    
    // 3. 生成HTML
    const htmlPath = generateHTML(templateData);
    
    // 4. 截图并生成PDF
    const result = await captureAndGeneratePDF(htmlPath);
    
    console.log('\n=== 生成完成 ===');
    console.log('文件列表:');
    console.log('  HTML:', result.html);
    console.log('  截图:', result.screenshot);
    console.log('  PDF:', result.pdf);
    console.log('\n特点：');
    console.log('  - 复刻PDF排版样式');
    console.log('  - 单页无限高度（所有内容在一张纸上）');
    console.log('  - 包含头像');
    
    return result;
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

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const https = require('https');
const http = require('http');

/**
 * 简历PDF生成器
 * 流程: 数据 → HTML → 截图 → PDF (单页无限高度)
 */

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'resume-template.html');
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

  return {
    profile,
    skills,
    experience,
    projects,
    education
  };
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

  // 处理头像 - 转为 base64
  let avatarUrl = profile.avatar;
  if (!avatarUrl.startsWith('http')) {
    avatarUrl = 'https://yfarer.cn' + avatarUrl;
  }
  const avatarBase64 = await imageToBase64(avatarUrl);

  // 处理项目数据
  const processedProjects = await Promise.all(projects.projects.map(async proj => ({
    name: proj.name,
    role: proj.role,
    period: proj.period,
    tags: proj.tags || [],
    description: proj.description ? (Array.isArray(proj.description) ? proj.description.join(' ') : proj.description) : null,
    subProjects: proj.subProjects ? await Promise.all(proj.subProjects.map(async sub => {
      let imageBase64 = null;
      if (sub.image) {
        const imageUrl = sub.image.startsWith('http') ? sub.image : 'https://yfarer.cn' + sub.image;
        imageBase64 = await imageToBase64(imageUrl);
      }
      return {
        title: sub.title,
        subtitle: sub.subtitle,
        description: sub.description,
        image: imageBase64,
        techStack: sub.techStack ? sub.techStack.join(' · ') : null,
        aiTools: sub.aiTools ? sub.aiTools.join(' · ') : null
      };
    })) : null
  })));

  // 处理工作经历
  const processedExperiences = experience.experiences.map(exp => ({
    company: exp.company,
    role: exp.position,
    period: exp.period,
    description: exp.description,
    achievements: exp.achievements || []
  }));

  return {
    name: profile.name,
    avatar: avatarBase64 || avatarUrl,
    titles: profile.title.split('/').map(t => t.trim()),
    location: profile.contact.location,
    age: profile.contact.age,
    phone: profile.contact.phone,
    email: profile.contact.email,
    quote: profile.quote,
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
  
  const htmlPath = path.join(OUTPUT_DIR, 'resume-generated.html');
  fs.writeFileSync(htmlPath, html);
  console.log('✓ HTML生成完成:', htmlPath);
  
  return htmlPath;
}

/**
 * 使用 Playwright 截图并生成PDF
 * 单页无限高度，样式完全保留
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
  
  // 等待字体、图片和样式加载
  await page.waitForTimeout(2000);
  
  // 等待所有图片加载完成
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve); // 即使加载失败也继续
        setTimeout(resolve, 3000); // 最多等3秒
      });
    }));
  });
  
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
  const screenshotPath = path.join(OUTPUT_DIR, 'resume-screenshot.png');
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
  const pdfPath = path.join(OUTPUT_DIR, 'resume.pdf');
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
    console.log('=== 简历PDF生成器 ===\n');
    
    // 1. 加载数据
    console.log('加载数据...');
    const data = loadData();
    
    // 2. 准备模板数据（包含图片下载）
    console.log('下载图片资源...');
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

module.exports = { main, loadData, prepareTemplateData, generateHTML, captureAndGeneratePDF };

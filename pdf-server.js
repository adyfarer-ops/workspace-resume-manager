const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 提供resume-print.html
app.use('/resume', express.static(path.join(__dirname, 'project/public')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 生成 PDF API
app.get('/api/generate-pdf', async (req, res) => {
  let browser = null;
  
  try {
    console.log('[PDF] Starting PDF generation...');
    
    // 检查Chromium路径
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
        console.log(`[PDF] Found Chromium at: ${cp}`);
        break;
      }
    }
    
    if (!executablePath) {
      throw new Error('Chromium not found');
    }
    
    // 启动 puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--safebrowsing-disable-auto-update'
      ]
    });
    
    const page = await browser.newPage();
    
    // 设置视口 - A4尺寸
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });
    
    // 读取本地HTML文件
    const htmlPath = path.join(__dirname, 'project/public/resume-print.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    console.log(`[PDF] Setting HTML content...`);
    
    // 直接设置HTML内容
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });
    
    // 等待页面渲染完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 生成 PDF - 支持多页A4
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    console.log(`[PDF] Generated PDF: ${pdfBuffer.length} bytes`);
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error);
    res.status(500).json({ 
      error: 'PDF generation failed',
      message: error.message
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// 直接获取HTML
app.get('/api/resume-html', (req, res) => {
  const htmlPath = path.join(__dirname, 'project/public/resume-print.html');
  res.sendFile(htmlPath);
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[Server] PDF generation service running on port ${PORT}`);
  console.log(`[Server] API endpoint: http://localhost:${PORT}/api/generate-pdf`);
  console.log(`[Server] HTML preview: http://localhost:${PORT}/api/resume-html`);
});

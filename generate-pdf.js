const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
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
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // 读取HTML文件
    const htmlPath = path.join(__dirname, 'project/public/resume-dynamic.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    console.log(`[PDF] Setting HTML content...`);
    
    // 设置HTML内容
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });
    
    // 等待字体和样式加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 生成 PDF
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
    
    // 保存PDF
    const outputPath = path.join(__dirname, 'project/public/resume-dynamic.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`[PDF] Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('[PDF] Error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePDF();

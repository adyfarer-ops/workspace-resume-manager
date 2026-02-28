const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testPDF() {
  console.log('Starting PDF test...');
  
  const htmlPath = path.resolve('./project/public/resume-single.html');
  console.log('HTML path:', htmlPath);
  console.log('Exists:', fs.existsSync(htmlPath));
  
  if (!fs.existsSync(htmlPath)) {
    console.error('File not found!');
    return;
  }
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched');
    
    const page = await browser.newPage();
    console.log('Page created');
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('HTML loaded:', htmlContent.length, 'chars');
    
    console.log('Setting content...');
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('Content set');
    
    console.log('Generating PDF...');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15px', right: '15px', bottom: '15px', left: '15px' }
    });
    console.log('PDF generated:', pdf.length, 'bytes');
    
    fs.writeFileSync('/tmp/test_output.pdf', pdf);
    console.log('PDF saved to /tmp/test_output.pdf');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

testPDF();

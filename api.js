const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Health check
app.get('/ady/api/health', (req, res) => res.json({ ok: true }));
app.get('/health', (req, res) => res.json({ ok: true }));

// PDF endpoint - sequential processing
app.get('/ady/api/resume/simple/pdf', async (req, res) => {
  console.log('PDF request received');
  
  try {
    const htmlPath = path.resolve('./project/public/resume-single.html');
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(500).json({ error: 'HTML file not found' });
    }
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    // Wait
    await new Promise(r => setTimeout(r, 500));
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15px', right: '15px', bottom: '15px', left: '15px' }
    });
    
    await browser.close();
    
    // Send response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.end(pdf);
    console.log('PDF sent:', pdf.length);
    
  } catch (error) {
    console.error('PDF error:', error.message);
    res.status(500).json({ error: 'PDF generation failed', message: error.message });
  }
});

app.listen(3001, '127.0.0.1', () => console.log('API on 3001'));

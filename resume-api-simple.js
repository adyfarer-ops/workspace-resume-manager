const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/ady/api/resume/download/pdf', async (req, res) => {
  console.log('PDF download requested');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const html = fs.readFileSync('./project/public/resume-dynamic.html', 'utf8');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdf);
    console.log('PDF sent:', pdf.length);
  } catch (e) {
    console.error('Error:', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('API Server on port', PORT);
});

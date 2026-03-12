const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3001;

const SUPABASE_URL = 'https://riieooizyhovmgvhpcxj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjg1MCwiZXhwIjoyMDg2OTc4ODUwfQ.azMzZoioMnKKJwwwmaroxTxLnVYHMasfAxkW6lkdptk';

app.use(cors());
app.use(express.json());
app.use('/resume', express.static(path.join(__dirname, 'project/public')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

async function fetchFromSupabase(endpoint) {
  return new Promise((resolve, reject) => {
    const req = https.get(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
  });
}

// 生成紧凑的中式风格 HTML
function generateResumeHTML(data) {
  const { profile, experience, education, skills } = data;
  const p = profile || {};
  
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${p.name || '简历'}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Noto Serif SC","Source Han Serif SC",serif;background:#e7e5e4;padding:20px}
.resume{max-width:794px;margin:0 auto;background:#fafaf9;padding:40px 50px;min-height:1123px}
.seal{position:absolute;top:20px;right:40px;font-size:14px;color:#d6d3d1;font-family:"KaiTi",serif}
.header{display:flex;gap:30px;margin-bottom:25px;border-bottom:2px solid #78716c;padding-bottom:20px}
.avatar{width:100px;height:100px;border-radius:50%;object-fit:cover}
.info{flex:1}
.name{font-size:28px;color:#1c1917;margin-bottom:6px;letter-spacing:4px}
.title{font-size:14px;color:#78716c;margin-bottom:12px}
.title span{margin-right:10px}
.contact{font-size:12px;color:#57534e}
.contact span{margin-right:15px}
.section{margin-bottom:18px}
.section-title{font-size:15px;color:#1c1917;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #d6d3d1;display:flex;align-items:center}
.section-icon{width:24px;height:24px;background:#1c1917;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-right:8px;font-size:12px}
.about{font-size:13px;line-height:1.8;color:#44403c;text-align:justify}
.exp{margin-bottom:14px}
.exp-header{display:flex;justify-content:space-between;margin-bottom:4px}
.exp-company{font-size:14px;font-weight:bold;color:#1c1917}
.exp-role{font-size:13px;color:#78716c}
.exp-period{font-size:12px;color:#a8a29e}
.exp-desc{font-size:12px;line-height:1.6;color:#57534e}
.edu{display:flex;justify-content:space-between;margin-bottom:8px}
.edu-school{font-size:13px;font-weight:bold;color:#1c1917}
.edu-major{font-size:13px;color:#78716c}
.edu-period{font-size:12px;color:#a8a29e}
.skills{display:flex;flex-wrap:wrap;gap:6px}
.skill{background:#f5f5f4;padding:3px 10px;font-size:11px;color:#44403c;border-radius:2px}
</style></head>
<body>
<div class="resume"><div class="seal">岁时记</div>
<div class="header"><img class="avatar" src="https://picsum.photos/200?grayscale">
<div class="info"><h1 class="name">${p.name||''}</h1>
<div class="title">${(p.title||'').split(' / ').join(' &nbsp;|&nbsp; ')}</div>
<div class="contact"><span>📍 ${p.location||'河南'}</span><span>🎂 ${p.age||27}岁</span><span>📱 ${p.phone||''}</span><span>✉️ ${p.email||''}</span></div></div></div>
<div class="section"><div class="section-title"><span class="section-icon">志</span>关于我</div><p class="about">${p.about||''}</p></div>
<div class="section"><div class="section-title"><span class="section-icon">道</span>工作经历</div>
${(experience||[]).map(e=>`<div class="exp"><div class="exp-header"><span class="exp-company">${e.company||''}</span><span class="exp-period">${e.period||''}</span></div><span class="exp-role">${e.role||''}</span><p class="exp-desc">${e.description||''}</p></div>`).join('')}
</div>
<div class="section"><div class="section-title"><span class="section-icon">学</span>教育背景</div>
${(education||[]).map(e=>`<div class="edu"><span class="edu-school">${e.school||''}</span><span class="edu-major">${e.major||''}</span><span class="edu-period">${e.period||''}</span></div>`).join('')}
</div>
<div class="section"><div class="section-title"><span class="section-icon">技</span>专业技能</div>
<div class="skills">${(skills||[]).map(s=>`<span class="skill">${s}</span>`).join('')}</div>
</div></div></body></html>`;
}

app.get('/api/generate-pdf', async (req, res) => {
  let browser = null;
  try {
    console.log('[PDF] Starting...');
    const [profile, workExp, edu, skillCats] = await Promise.all([
      fetchFromSupabase('profiles?select=*&limit=1'),
      fetchFromSupabase('work_experience?order=sort_order'),
      fetchFromSupabase('education?order=sort_order'),
      fetchFromSupabase('skill_categories?order=sort_order')
    ]);
    
    let allSkills = [];
    for (const cat of skillCats||[]) {
      const s = await fetchFromSupabase(`skills?category_id=eq.${cat.id}&select=name`);
      allSkills = allSkills.concat((s||[]).map(x=>x.name));
    }
    
    const html = generateResumeHTML({ profile: profile[0], experience: workExp, education: edu, skills: allSkills });
    
    delete process.env.http_proxy;
    delete process.env.https_proxy;
    
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdf);
  } catch (e) {
    console.error('[PDF] Error:', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => console.log(`[Server] PDF on ${PORT}`));

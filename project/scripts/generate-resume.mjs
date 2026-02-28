import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

// 完整从网站 constants.ts 提取的所有数据
const RESUME_DATA = {
  name: "安鼎禹",
  title: "Web前端开发工程师 / AI智能体开发 / AI编程",
  quote: "\"偷得浮生半日闲，明天依旧打工人。\"",
  
  basicInfo: {
    age: "27岁",
    location: "河南",
    phone: "17630830323",
    email: "yfarer@163.com"
  },
  
  education: {
    school: "漯河职业技术职业学院",
    major: "计算机应用技术",
    period: "2016.09 - 2019.06",
    honors: [
      "2017年11月 荣获国家励志奖学金",
      "有普通话等级证书",
      "有计算机等级证书"
    ]
  },
  
  // 专业技能 - 完整描述
  skills: [
    {
      category: "AI 智能体开发",
      desc: "了解n8n和dify，熟练使用Coze(扣子)，掌握Workflow编排、插件调用及JS代码节点编写。Prompt Engineering擅长风格迁移、角色扮演与任务拆解。"
    },
    {
      category: "Web 开发",
      desc: "前端技术栈：小程序、VUE、HTML、CSS、JavaScript。"
    },
    {
      category: "AI 工具使用",
      desc: "Kimi.ai、GPT、Gemini、Sora2、即梦、豆包等。"
    },
    {
      category: "AI 编程工具",
      desc: "Cursor、Trae、Kiro、Antigravity等。"
    },
    {
      category: "设计与媒体",
      desc: "UI/UX: Figma, Stitch\n视频剪辑: 熟练使用剪映\n社媒运营: 抖音、快手、小红书、视频号、B站。"
    },
    {
      category: "持续学习",
      desc: "自媒体领域不断变化，需要不断学习新技能和适应新趋势。"
    }
  ],
  
  selfEvaluation: "拥有扎实的前端开发经验，并积极拥抱AI技术变革。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。具备全栈思维与产品意识，能够利用AI工具赋能开发，实现从0到1的产品落地与流量增长。",
  
  workExperience: [
    {
      company: "上海星漫科技有限公司",
      role: "Web前端开发工程师",
      period: "2021.05 - 2023.03",
      details: [
        "负责Web、H5以及小程序页面的开发，根据UI设计图精确还原页面；",
        "负责页面的动态数据交互，与后台人员交接，测试并优化接口；",
        "完成小程序商城支付功能开发；",
        "对接腾讯云直播和云点播，使用live-pusher/live-player组件实现推拉流；",
        "优化公司原有框架，参与公共组件方案设计，提升项目易用性与开发效率；",
        "指导新人，提升团队整体技术水平。"
      ]
    },
    {
      company: "上海中圳科技有限公司",
      role: "Web前端开发工程师",
      period: "2019.07 - 2021.04",
      details: [
        "负责老项目的优化迭代与新页面开发，维护业务稳定性；",
        "对Element组件进行二次封装，提升用户体验与开发效率；",
        "使用Uni-app开发跨平台应用，主导\"芥末交友\"等社交产品的开发；",
        "根据用户需求完善页面功能，配合后端完成数据交互。"
      ]
    }
  ],
  
  // 项目经历 - 完整包含所有子项目和描述
  projects: [
    {
      name: "AI编程工具应用开发",
      role: "个人开发者",
      period: "2026年初 - 至今",
      subProjects: [
        {
          title: "个人小程序【最后亿次】",
          subtitle: "已上架",
          desc: "一款以习惯养成为核心的跨平台应用，融合AI陪伴、积分激励、成就系统等功能。以终小喵为灵伴，通过每日打卡、积分兑换奖励、AI对话鼓励等方式，帮助用户建立并坚持良好习惯。",
          aiTools: "Kiro, Antigravity, DeepSeek",
          techStack: "Uni-app, Vue3, Pinia, Supabase",
          platform: "H5 + 小程序 + App"
        },
        {
          title: "岁时记 - 二十四节气简历",
          subtitle: "开源项目",
          desc: "使用AI编程工具开发的诗意简历网站，融合二十四节气主题、动态水墨意境、节日特效等中国传统文化元素，主题随时节自动流转，呈现当下最应景的视觉氛围。",
          aiTools: "Kiro, Kimi-code",
          techStack: "React, TypeScript, Tailwind CSS, Vite",
          platform: "H5 + Web"
        }
      ],
      automation: "自动化办公：利用AI编程工具对接MCP，或使用Skills对接飞书/钉钉，实现办公流程自动化。"
    },
    {
      name: "Coze工作流与智能体开发",
      role: "智能体开发者",
      period: "2025年初 - 至今",
      subProjects: [
        {
          num: "01",
          title: "茶文化风格化文案生成智能体",
          desc: "解决文案同质化问题，降低人工模仿头部博主语气的成本。"
        },
        {
          num: "02",
          title: "\"家有大猫\"沉浸式角色扮演",
          desc: "深度定义角色（如林虎）口癖与性格，设计\"好感度\"系统，实现高拟真对话。"
        },
        {
          num: "03",
          title: "智能表格分析工具",
          desc: "利用Coze解析Excel/CSV，通过Prompt引导模型提取结构并计算数据。"
        },
        {
          num: "04",
          title: "多样化视频工作流",
          desc: "涵盖儿童故事、名人传记、教育火柴人、Sora2电商带货等方向。"
        },
        {
          num: "05",
          title: "飞书自媒体二创工作流",
          desc: "提取自媒体平台数据，进行二创写入飞书。"
        }
      ]
    },
    {
      name: "自媒体账号运营",
      role: "内容创作者",
      period: "2023.06 - 至今",
      platform: "平台：抖音 / 快手 / 小红书",
      content: "工作内容：从0到1搭建个人账号，跟进赛道热点与选题，制作发布高质量内容。",
      results: [
        "抖音：单篇阅读量破100万，涨粉2000+",
        "小红书：单篇阅读量近50万，涨粉600+"
      ]
    }
  ]
};

// 读取头像
const avatarPath = path.join(__dirname, '..', 'public', 'avatar.png');
let avatarDataUrl = '';
try {
  const avatarBase64 = fs.readFileSync(avatarPath, { encoding: 'base64' });
  avatarDataUrl = `data:image/png;base64,${avatarBase64}`;
} catch (e) {
  console.log('头像读取失败');
}

async function generatePDF() {
  console.log('启动浏览器...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2
  });

  const data = RESUME_DATA;

  // 构建 HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      font-size: 10px;
      line-height: 1.4;
      color: #1f2937;
    }
    .resume {
      width: 794px;
      height: 1123px;
      display: flex;
      background: white;
      overflow: hidden;
    }
    .sidebar {
      width: 250px;
      background: #f8fafc;
      padding: 20px 18px;
      height: 1123px;
      overflow: hidden;
    }
    .avatar-wrap {
      text-align: center;
      margin-bottom: 15px;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto;
      overflow: hidden;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .s-section { margin-bottom: 14px; }
    .s-title {
      font-size: 12px;
      font-weight: bold;
      color: #1f2937;
      padding-bottom: 5px;
      border-bottom: 2px solid #10b981;
      margin-bottom: 8px;
    }
    .s-row {
      font-size: 10px;
      color: #374151;
      margin: 5px 0;
    }
    .edu-box { margin-bottom: 8px; }
    .edu-school { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
    .edu-major { font-size: 10px; color: #4b5563; margin-bottom: 2px; }
    .edu-time { font-size: 9px; color: #9ca3af; margin-bottom: 4px; }
    .edu-honors { font-size: 9px; color: #6b7280; margin: 2px 0; padding-left: 8px; }
    .skill-box { margin-bottom: 8px; }
    .skill-cat { font-weight: bold; font-size: 10px; color: #10b981; margin-bottom: 2px; }
    .skill-desc { font-size: 9px; color: #4b5563; line-height: 1.5; white-space: pre-line; }
    .about-text { font-size: 9px; color: #4b5563; line-height: 1.5; text-align: justify; }
    
    .main {
      flex: 1;
      padding: 20px 22px;
      height: 1123px;
      overflow: hidden;
    }
    .header { margin-bottom: 15px; }
    .name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
    .title { font-size: 12px; color: #10b981; margin-bottom: 6px; }
    .quote { font-size: 10px; color: #6b7280; font-style: italic; }
    
    .m-section { margin-bottom: 14px; }
    .m-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .m-icon {
      width: 20px;
      height: 20px;
      background: #10b981;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    }
    .m-title { font-size: 14px; font-weight: bold; }
    
    .timeline-item {
      position: relative;
      padding-left: 12px;
      margin-bottom: 12px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 3px;
      width: 7px;
      height: 7px;
      border: 2px solid #10b981;
      border-radius: 50%;
      background: white;
    }
    .timeline-item::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 10px;
      width: 2px;
      height: calc(100% + 4px);
      background: #e5e7eb;
    }
    .timeline-item:last-child::after { display: none; }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .item-name { font-size: 12px; font-weight: bold; }
    .item-time { font-size: 9px; color: #10b981; }
    .item-role { font-size: 10px; color: #4b5563; margin-bottom: 3px; }
    .item-detail { font-size: 9px; color: #4b5563; margin: 1px 0; line-height: 1.3; }
    
    .project-card {
      background: #f0fdf4;
      border-radius: 4px;
      padding: 6px 8px;
      margin: 5px 0;
    }
    .card-header {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 2px;
    }
    .card-sub { color: #10b981; font-size: 9px; }
    .card-desc { font-size: 9px; color: #4b5563; line-height: 1.3; margin: 3px 0; }
    .card-row { font-size: 9px; color: #4b5563; margin: 1px 0; }
    .card-row strong { color: #1f2937; }
    .subproject-num { color: #10b981; font-weight: bold; margin-right: 3px; }
    .subproject-title { font-weight: bold; font-size: 10px; }
    .subproject-desc { font-size: 9px; color: #4b5563; line-height: 1.4; margin-top: 2px; }
    .platform-row { font-size: 10px; color: #4b5563; margin: 4px 0; }
    .content-row { font-size: 9px; color: #4b5563; margin: 4px 0; }
    .result-title { font-weight: bold; font-size: 9px; color: #1f2937; margin: 4px 0 2px; }
    .result-item { font-size: 9px; color: #4b5563; margin: 1px 0; padding-left: 8px; }
  </style>
</head>
<body>
  <div class="resume">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <div class="avatar-wrap">
        <div class="avatar">
          ${avatarDataUrl ? `<img src="${avatarDataUrl}" alt="头像">` : ''}
        </div>
      </div>
      
      <div class="s-section">
        <div class="s-title">基本信息</div>
        <div class="s-row"><strong>年龄：</strong>${data.basicInfo.age}</div>
        <div class="s-row"><strong>籍贯：</strong>${data.basicInfo.location}</div>
        <div class="s-row"><strong>电话：</strong>${data.basicInfo.phone}</div>
        <div class="s-row"><strong>邮箱：</strong>${data.basicInfo.email}</div>
      </div>
      
      <div class="s-section">
        <div class="s-title">教育背景</div>
        <div class="edu-box">
          <div class="edu-school">${data.education.school}</div>
          <div class="edu-major">${data.education.major}</div>
          <div class="edu-time">${data.education.period}</div>
          ${data.education.honors.map(h => `<div class="edu-honors">• ${h}</div>`).join('')}
        </div>
      </div>
      
      <div class="s-section">
        <div class="s-title">专业技能</div>
        ${data.skills.map(s => `
        <div class="skill-box">
          <div class="skill-cat">${s.category}</div>
          <div class="skill-desc">${s.desc}</div>
        </div>`).join('')}
      </div>
      
      <div class="s-section">
        <div class="s-title">自我评价</div>
        <div class="about-text">${data.selfEvaluation}</div>
      </div>
    </div>
    
    <!-- 右侧主内容 -->
    <div class="main">
      <div class="header">
        <div class="name">${data.name}</div>
        <div class="title">${data.title}</div>
        <div class="quote">${data.quote}</div>
      </div>
      
      <div class="m-section">
        <div class="m-header">
          <div class="m-icon">工</div>
          <div class="m-title">工作经历</div>
        </div>
        ${data.workExperience.map(w => `
        <div class="timeline-item">
          <div class="item-header">
            <span class="item-name">${w.company}</span>
            <span class="item-time">${w.period}</span>
          </div>
          <div class="item-role">${w.role}</div>
          ${w.details.map(d => `<div class="item-detail">• ${d}</div>`).join('')}
        </div>`).join('')}
      </div>
      
      <div class="m-section">
        <div class="m-header">
          <div class="m-icon">项</div>
          <div class="m-title">个人经验与项目</div>
        </div>
        
        ${data.projects.map(p => `
        <div class="timeline-item">
          <div class="item-header">
            <span class="item-name">${p.name}</span>
            <span class="item-time">${p.period}</span>
          </div>
          <div class="item-role">${p.role}</div>
          
          ${p.subProjects ? p.subProjects.map(s => `
          ${s.num ? `
          <div style="margin: 6px 0;">
            <span class="subproject-num">${s.num}</span>
            <span class="subproject-title">${s.title}</span>
            ${s.desc ? `<div class="subproject-desc">${s.desc}</div>` : ''}
          </div>` : `
          <div class="project-card">
            <div class="card-header">
              ${s.title}
              ${s.subtitle ? `<span class="card-sub">(${s.subtitle})</span>` : ''}
            </div>
            ${s.desc ? `<div class="card-desc">${s.desc}</div>` : ''}
            ${s.aiTools ? `<div class="card-row"><strong>AI工具：</strong>${s.aiTools}</div>` : ''}
            ${s.techStack ? `<div class="card-row"><strong>技术栈：</strong>${s.techStack}</div>` : ''}
            ${s.platform ? `<div class="card-row"><strong>适配平台：</strong>${s.platform}</div>` : ''}
          </div>`}
          `).join('') : ''}
          
          ${p.automation ? `<div class="content-row"><strong>${p.automation.split('：')[0]}：</strong>${p.automation.split('：')[1]}</div>` : ''}
          
          ${p.platform ? `<div class="platform-row">${p.platform}</div>` : ''}
          ${p.content ? `<div class="content-row"><strong>${p.content.split('：')[0]}：</strong>${p.content.split('：')[1]}</div>` : ''}
          
          ${p.results ? `
          <div class="result-title">产出效果：</div>
          ${p.results.map(r => `<div class="result-item">• ${r}</div>`).join('')}
          ` : ''}
        </div>`).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);

  const outputPath = path.join(__dirname, '..', 'public', 'resume.pdf');
  
  await page.pdf({
    path: outputPath,
    width: '794px',
    height: '1123px',
    printBackground: true,
    preferCSSPageSize: true
  });
  
  await browser.close();
  
  console.log('PDF 生成成功:', outputPath);
  return outputPath;
}

generatePDF().catch(err => {
  console.error('生成失败:', err);
  process.exit(1);
});

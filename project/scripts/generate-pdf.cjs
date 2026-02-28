const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 简历数据
const data = {
  name: "大鱼",
  title: "Web前端开发工程师 / AI智能体开发 / AI编程",
  quote: "\"偷得浮生半日闲，明天依旧打工人。\"",
  about: "拥有扎实的前端开发经验，并积极拥抱AI技术变革。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。具备全栈思维与产品意识，能够利用AI工具赋能开发，实现从0到1的产品落地与流量增长。",
  contact: {
    age: 27,
    location: "河南",
    phone: "17630830323",
    email: "yfarer@163.com"
  },
  education: [
    {
      school: "漯河职业技术职业学院",
      major: "计算机应用技术",
      period: "2016.09 - 2019.06"
    }
  ],
  skills: [
    {
      title: "AI 智能体开发",
      desc: "了解n8n和dify，熟练使用Coze(扣子)，掌握Workflow编排、插件调用及JS代码节点编写。Prompt Engineering擅长风格迁移、角色扮演与任务拆解。"
    },
    {
      title: "Web开发",
      desc: "前端技术栈：小程序、VUE、HTML、CSS、JavaScript。"
    },
    {
      title: "AI工具使用",
      desc: "Kimi.ai、GPT、Gemini、Sora2、即梦、豆包等。"
    }
  ],
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
  projects: [
    {
      name: "AI编程工具应用开发",
      role: "个人开发者",
      period: "2026年初 - 至今",
      subProjects: [
        {
          title: "个人小程序【最后亿次】",
          subtitle: "已上架",
          desc: "AI工具：Kiro, Antigravity, DeepSeek",
          tech: "Uni-app, Vue3, Pinia, Supabase",
          platform: "H5 + 小程序 + App"
        }
      ],
      extra: "自动化办公：利用AI编程工具对接MCP，或使用Skills对接飞书/钉钉，实现办公流程自动化。",
      tags: ["AI编程", "小程序", "Uni-app"]
    },
    {
      name: "Coze工作流与智能体开发",
      role: "AI智能体开发者",
      period: "2025年初 - 至今",
      subProjects: [
        {
          title: "茶文化风格化文案生成智能体",
          desc: "解决文案同质化问题，降低人工模仿头部博主语气的成本。"
        },
        {
          title: "\"家有大猫\"沉浸式角色扮演",
          desc: "深度定义角色（如林虎）口癖与性格，设计\"好感度\"系统，实现高拟真对话。"
        }
      ],
      tags: ["Coze", "AI智能体", "工作流"]
    }
  ]
};

// 生成 HTML
function generateHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1f2937;
    }
    .resume {
      width: 794px;
      min-height: 1123px;
      display: flex;
      background: white;
    }
    .sidebar {
      width: 260px;
      background: #f8fafc;
      padding: 40px 25px;
    }
    .avatar-wrap {
      text-align: center;
      margin-bottom: 35px;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 48px;
      font-weight: bold;
    }
    .s-section { margin-bottom: 30px; }
    .s-title {
      font-size: 15px;
      font-weight: bold;
      color: #1f2937;
      padding-bottom: 8px;
      border-bottom: 2px solid #10b981;
      margin-bottom: 15px;
    }
    .s-row {
      font-size: 12px;
      color: #374151;
      margin: 10px 0;
    }
    .edu-item { margin-bottom: 15px; }
    .edu-school { font-weight: bold; font-size: 13px; margin-bottom: 3px; }
    .edu-major { font-size: 12px; color: #4b5563; }
    .edu-time { font-size: 11px; color: #9ca3af; }
    .skill-item { margin-bottom: 14px; }
    .skill-name { font-weight: bold; font-size: 12px; color: #10b981; margin-bottom: 5px; }
    .skill-desc { font-size: 11px; color: #4b5563; line-height: 1.7; }
    .about-text { font-size: 11px; color: #4b5563; line-height: 1.8; text-align: justify; }
    
    .main {
      flex: 1;
      padding: 40px 35px;
    }
    .header { margin-bottom: 35px; }
    .name { font-size: 38px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
    .title { font-size: 15px; color: #10b981; margin-bottom: 12px; }
    .quote { font-size: 13px; color: #6b7280; font-style: italic; }
    
    .m-section { margin-bottom: 30px; }
    .m-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .m-icon {
      width: 28px;
      height: 28px;
      background: #10b981;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
    .m-title { font-size: 18px; font-weight: bold; }
    
    .timeline-item {
      position: relative;
      padding-left: 20px;
      margin-bottom: 25px;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 10px;
      height: 10px;
      border: 2px solid #10b981;
      border-radius: 50%;
      background: white;
    }
    .timeline-item::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 15px;
      width: 2px;
      height: calc(100% + 10px);
      background: #e5e7eb;
    }
    .timeline-item:last-child::after { display: none; }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    .item-name { font-size: 15px; font-weight: bold; }
    .item-time { font-size: 12px; color: #10b981; }
    .item-role { font-size: 13px; color: #4b5563; margin-bottom: 8px; }
    .item-detail { font-size: 12px; color: #4b5563; margin: 4px 0; line-height: 1.6; }
    
    .project-card {
      background: #f0fdf4;
      border-radius: 8px;
      padding: 15px;
      margin: 12px 0;
    }
    .card-title { font-weight: bold; font-size: 13px; margin-bottom: 6px; }
    .card-subtitle { color: #10b981; font-size: 12px; margin-left: 5px; }
    .card-desc { font-size: 12px; color: #4b5563; line-height: 1.6; margin-bottom: 4px; }
    .card-tech { font-size: 11px; color: #6b7280; }
    .tags { margin-top: 10px; }
    .tag {
      display: inline-block;
      font-size: 10px;
      background: #fef3c7;
      color: #92400e;
      padding: 3px 10px;
      border-radius: 3px;
      margin-right: 6px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="resume">
    <div class="sidebar">
      <div class="avatar-wrap"><div class="avatar">${data.name[0]}</div></div>
      
      <div class="s-section">
        <div class="s-title">基本信息</div>
        <div class="s-row"><strong>年龄：</strong>${data.contact.age}岁</div>
        <div class="s-row"><strong>籍贯：</strong>${data.contact.location}</div>
        <div class="s-row"><strong>电话：</strong>${data.contact.phone}</div>
        <div class="s-row"><strong>邮箱：</strong>${data.contact.email}</div>
      </div>
      
      <div class="s-section">
        <div class="s-title">教育背景</div>
        ${data.education.map(e => `
        <div class="edu-item">
          <div class="edu-school">${e.school}</div>
          <div class="edu-major">${e.major}</div>
          <div class="edu-time">${e.period}</div>
        </div>`).join('')}
      </div>
      
      <div class="s-section">
        <div class="s-title">专业技能</div>
        ${data.skills.map(s => `
        <div class="skill-item">
          <div class="skill-name">${s.title}</div>
          <div class="skill-desc">${s.desc}</div>
        </div>`).join('')}
      </div>
      
      <div class="s-section">
        <div class="s-title">自我评价</div>
        <div class="about-text">${data.about}</div>
      </div>
    </div>
    
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
        ${data.projects.map((p, i) => `
        <div class="timeline-item">
          <div class="item-header">
            <span class="item-name">${p.name}</span>
            <span class="item-time">${p.period}</span>
          </div>
          <div class="item-role">${p.role}</div>
          ${p.subProjects ? p.subProjects.map((s, j) => `
          <div class="project-card">
            <div class="card-title">${j + 1}. ${s.title}${s.subtitle ? `<span class="card-subtitle">(${s.subtitle})</span>` : ''}</div>
            ${s.desc ? `<div class="card-desc">${s.desc}</div>` : ''}
            ${s.tech ? `<div class="card-tech"><strong>技术栈：</strong>${s.tech}</div>` : ''}
            ${s.platform ? `<div class="card-tech"><strong>适配平台：</strong>${s.platform}</div>` : ''}
          </div>`).join('') : ''}
          ${p.extra ? `<div class="item-detail"><strong>${p.extra.split('：')[0]}：</strong>${p.extra.split('：')[1]}</div>` : ''}
          <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function generatePDF() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 设置视口
  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2
  });
  
  // 加载 HTML
  const html = generateHTML();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  // 等待字体加载
  await page.waitForTimeout(1000);
  
  // 生成 PDF
  await page.pdf({
    path: '大鱼_简历.pdf',
    width: '794px',
    height: '1123px',
    printBackground: true,
    preferCSSPageSize: true
  });
  
  await browser.close();
  console.log('PDF 生成成功: 大鱼_简历.pdf');
}

generatePDF().catch(console.error);

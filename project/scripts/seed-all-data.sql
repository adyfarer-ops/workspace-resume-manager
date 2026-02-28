-- ============================================
-- 岁时记 - 数据插入脚本
-- ============================================

-- 清空现有数据（谨慎使用）
-- TRUNCATE TABLE project_links, sub_projects, projects, skills, skill_categories, work_experience, education, notes, profiles CASCADE;

-- 1. 插入用户基本信息
INSERT INTO profiles (name, title, quote, avatar, about, age, location, phone, email)
VALUES (
  '大鱼',
  'Web前端开发工程师 / AI智能体开发 / AI编程',
  '偷得浮生半日闲，明天依旧打工人。',
  'https://picsum.photos/400/400?grayscale',
  '拥有扎实的前端开发经验，并积极拥抱AI技术变革。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。具备全栈思维与产品意识，能够利用AI工具赋能开发，实现从0到1的产品落地与流量增长。',
  27,
  '河南',
  'MTc2MzA4MzAzMjM=', -- Base64 encoded phone
  'yfarer@163.com'
)
RETURNING id;

-- 注意：请记录上面返回的 profile_id，替换下面的 :profile_id
-- 如果只有一条记录，可以使用子查询获取

-- 2. 插入教育背景
INSERT INTO education (profile_id, school, major, period, honors, sort_order)
SELECT 
  id as profile_id,
  '漯河职业技术职业学院',
  '计算机应用技术',
  '2016.09 - 2019.06',
  ARRAY['2017年11月 荣获国家励志奖学金', '有普通话等级证书', '有计算机等级证书'],
  0
FROM profiles WHERE name = '大鱼';

-- 3. 插入工作经历
INSERT INTO work_experience (profile_id, company, role, period, details, sort_order)
SELECT 
  id as profile_id,
  '上海星漫科技有限公司',
  'Web前端开发工程师',
  '2021.05 - 2023.03',
  ARRAY[
    '负责Web、H5以及小程序页面的开发，根据UI设计图精确还原页面；',
    '负责页面的动态数据交互，与后台人员交接，测试并优化接口；',
    '完成小程序商城支付功能开发；',
    '对接腾讯云直播和云点播，使用live-pusher/live-player组件实现推拉流；',
    '优化公司原有框架，参与公共组件方案设计，提升项目易用性与开发效率；',
    '指导新人，提升团队整体技术水平。'
  ],
  0
FROM profiles WHERE name = '大鱼';

INSERT INTO work_experience (profile_id, company, role, period, details, sort_order)
SELECT 
  id as profile_id,
  '上海中圳科技有限公司',
  'Web前端开发工程师',
  '2019.07 - 2021.04',
  ARRAY[
    '负责老项目的优化迭代与新页面开发，维护业务稳定性；',
    '对Element组件进行二次封装，提升用户体验与开发效率；',
    '使用Uni-app开发跨平台应用，主导"芥末交友"等社交产品的开发；',
    '根据用户需求完善页面功能，配合后端完成数据交互。'
  ],
  1
FROM profiles WHERE name = '大鱼';

-- 4. 插入技能分类
INSERT INTO skill_categories (profile_id, title, sort_order)
SELECT id, 'AI 智能体开发', 0 FROM profiles WHERE name = '大鱼';

INSERT INTO skill_categories (profile_id, title, sort_order)
SELECT id, 'Web 开发', 1 FROM profiles WHERE name = '大鱼';

INSERT INTO skill_categories (profile_id, title, sort_order)
SELECT id, 'AI 工具使用', 2 FROM profiles WHERE name = '大鱼';

INSERT INTO skill_categories (profile_id, title, sort_order)
SELECT id, 'AI 编程工具', 3 FROM profiles WHERE name = '大鱼';

INSERT INTO skill_categories (profile_id, title, sort_order)
SELECT id, '设计与媒体', 4 FROM profiles WHERE name = '大鱼';

-- 5. 插入技能
INSERT INTO skills (category_id, name)
SELECT sc.id, skill_name
FROM skill_categories sc
CROSS JOIN UNNEST(ARRAY['n8n', 'Dify', 'Coze(扣子)', 'Workflow编排', 'Prompt Engineering', '角色扮演', '任务拆解']) AS skill_name
WHERE sc.title = 'AI 智能体开发';

INSERT INTO skills (category_id, name)
SELECT sc.id, skill_name
FROM skill_categories sc
CROSS JOIN UNNEST(ARRAY['Vue3', 'HTML5', 'CSS3', 'JavaScript', '小程序', 'Uni-app']) AS skill_name
WHERE sc.title = 'Web 开发';

INSERT INTO skills (category_id, name)
SELECT sc.id, skill_name
FROM skill_categories sc
CROSS JOIN UNNEST(ARRAY['Kimi.ai', 'GPT-4', 'Gemini', 'Sora2', '即梦', '豆包']) AS skill_name
WHERE sc.title = 'AI 工具使用';

INSERT INTO skills (category_id, name)
SELECT sc.id, skill_name
FROM skill_categories sc
CROSS JOIN UNNEST(ARRAY['Cursor', 'Trae', 'Kiro', 'Antigravity']) AS skill_name
WHERE sc.title = 'AI 编程工具';

INSERT INTO skills (category_id, name)
SELECT sc.id, skill_name
FROM skill_categories sc
CROSS JOIN UNNEST(ARRAY['Figma', 'Stitch', '剪映', '抖音运营', '小红书运营']) AS skill_name
WHERE sc.title = '设计与媒体';

-- 6. 插入项目
INSERT INTO projects (profile_id, name, role, period, tags, description, highlight, sort_order)
SELECT 
  id as profile_id,
  'AI编程工具应用',
  'AI效能工程师',
  '2026年初 - 至今',
  ARRAY['Kiro', 'MCP', 'Skills', '飞书', '钉钉', 'DeepSeek', 'Uni-app', 'Vue3', 'Supabase'],
  ARRAY[]::TEXT[],
  true,
  0
FROM profiles WHERE name = '大鱼';

INSERT INTO projects (profile_id, name, role, period, tags, description, highlight, sort_order)
SELECT 
  id as profile_id,
  'Coze工作流与智能体开发',
  '智能体开发者',
  '2025年初 - 至今',
  ARRAY['Coze', 'LLM', 'Prompt Engineering'],
  ARRAY[
    '茶文化风格化文案生成智能体：解决文案同质化问题，降低人工模仿头部博主语气的成本。',
    '"家有大猫"沉浸式角色扮演：深度定义角色（如林虎）口癖与性格，设计"好感度"系统，实现高拟真对话。',
    '智能表格分析工具：利用Coze解析Excel/CSV，通过Prompt引导模型提取结构并计算数据。',
    '多样化视频工作流：涵盖儿童故事、名人传记、教育火柴人、Sora2电商带货等方向。',
    '飞书自媒体二创工作流：提取自媒体平台数据，进行二创写入飞书。'
  ],
  false,
  1
FROM profiles WHERE name = '大鱼';

INSERT INTO projects (profile_id, name, role, period, tags, description, highlight, sort_order)
SELECT 
  id as profile_id,
  '自媒体账号运营',
  '内容创作者',
  '2023.06 - 至今',
  ARRAY['抖音', '快手', '小红书', 'AIGC'],
  ARRAY[
    '从0到1搭建个人账号，跟进赛道热点与选题，制作发布高质量内容。',
    '抖音：单篇阅读量破100万，涨粉2000+',
    '小红书：单篇阅读量近50万，涨粉600+'
  ],
  false,
  2
FROM profiles WHERE name = '大鱼';

-- 7. 插入子项目（关联到 AI编程工具应用 项目）
INSERT INTO sub_projects (project_id, sub_id, title, subtitle, description, tags, tech_stack, ai_tools, platforms, image, sort_order)
SELECT 
  p.id as project_id,
  'automation',
  '办公自动化',
  NULL,
  '利用AI编程工具对接MCP，或使用Skills对接飞书/钉钉，实现办公流程自动化。',
  ARRAY['MCP', 'Skills', '飞书', '钉钉'],
  ARRAY['Kiro', 'Cursor', 'Trae'],
  NULL,
  NULL,
  NULL,
  0
FROM projects p WHERE p.name = 'AI编程工具应用';

INSERT INTO sub_projects (project_id, sub_id, title, subtitle, description, tags, tech_stack, ai_tools, platforms, image, sort_order)
SELECT 
  p.id as project_id,
  'zuihouyici',
  '最后亿次',
  '个人小程序（已上架）',
  '一款以习惯养成为核心的跨平台应用，融合AI陪伴、积分激励、成就系统等功能。以终小喵为灵伴，通过每日打卡、积分兑换奖励、AI对话鼓励等方式，帮助用户建立并坚持良好习惯。',
  ARRAY['全栈', '已上架'],
  ARRAY['Uni-app', 'Vue3', 'Pinia', 'Supabase'],
  ARRAY['Kiro', 'Cursor', 'DeepSeek'],
  ARRAY['H5', '小程序', 'App'],
  '/images/projects/zuihouyici-icon.png',
  1
FROM projects p WHERE p.name = 'AI编程工具应用';

INSERT INTO sub_projects (project_id, sub_id, title, subtitle, description, tags, tech_stack, ai_tools, platforms, image, sort_order)
SELECT 
  p.id as project_id,
  'solar-resume',
  '岁时记',
  '二十四节气简历',
  '使用AI编程工具开发的诗意简历网站，融合二十四节气主题、动态水墨意境、节日特效等中国传统文化元素，主题随时节自动流转，呈现当下最应景的视觉氛围。',
  ARRAY['前端', '开源'],
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  ARRAY['Kiro', 'Kimi-code'],
  ARRAY['H5', 'Web'],
  '/images/projects/ink-resume.png',
  2
FROM projects p WHERE p.name = 'AI编程工具应用';

-- 8. 插入项目链接
INSERT INTO project_links (sub_project_id, type, label, url, sort_order)
SELECT 
  sp.id as sub_project_id,
  'h5',
  'H5 网页版',
  'https://zuihouyici.example.com',
  0
FROM sub_projects sp WHERE sp.sub_id = 'zuihouyici';

INSERT INTO project_links (sub_project_id, type, label, url, qrcode, sort_order)
SELECT 
  sp.id as sub_project_id,
  'miniapp',
  '微信小程序',
  NULL,
  '/images/projects/zuihouyici-qr.png',
  1
FROM sub_projects sp WHERE sp.sub_id = 'zuihouyici';

INSERT INTO project_links (sub_project_id, type, label, url, sort_order)
SELECT 
  sp.id as sub_project_id,
  'h5',
  '在线访问',
  'https://github.com/yourname/ink-resume',
  0
FROM sub_projects sp WHERE sp.sub_id = 'solar-resume';

-- 9. 插入笔记
INSERT INTO notes (profile_id, title, content, summary, tags, source_url, is_imitation, status, created_at, updated_at)
SELECT 
  id as profile_id,
  'DeepSeek R1 在编程辅助中的最佳实践',
  '<article class="prose prose-stone"><p>探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。</p><h3>一、DeepSeek R1 的核心特性</h3><ul><li>深度推理能力</li><li>思维链展示</li><li>代码生成优势</li></ul></article>',
  '探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。',
  ARRAY['LLM', 'Coding', 'DeepSeek'],
  NULL,
  false,
  'published',
  '2024-03-15 10:00:00+00',
  '2024-03-15 10:00:00+00'
FROM profiles WHERE name = '大鱼';

INSERT INTO notes (profile_id, title, content, summary, tags, source_url, is_imitation, status, created_at, updated_at)
SELECT 
  id as profile_id,
  '从 Vue2 到 Vue3 + Pinia 的迁移指南',
  '<article class="prose prose-stone"><p>记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。</p></article>',
  '记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。',
  ARRAY['Vue3', 'Frontend', 'Refactor'],
  NULL,
  false,
  'published',
  '2024-02-10 14:30:00+00',
  '2024-02-10 14:30:00+00'
FROM profiles WHERE name = '大鱼';

INSERT INTO notes (profile_id, title, content, summary, tags, source_url, is_imitation, status, created_at, updated_at)
SELECT 
  id as profile_id,
  'Coze 智能体编排：多模态工作流实战',
  '<article class="prose prose-stone"><p>详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。</p></article>',
  '详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。',
  ARRAY['AI Agent', 'Coze', 'Workflow'],
  NULL,
  false,
  'published',
  '2024-01-22 09:00:00+00',
  '2024-01-22 09:00:00+00'
FROM profiles WHERE name = '大鱼';

-- 验证插入结果
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Education', COUNT(*) FROM education
UNION ALL
SELECT 'Work Experience', COUNT(*) FROM work_experience
UNION ALL
SELECT 'Skill Categories', COUNT(*) FROM skill_categories
UNION ALL
SELECT 'Skills', COUNT(*) FROM skills
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Sub Projects', COUNT(*) FROM sub_projects
UNION ALL
SELECT 'Project Links', COUNT(*) FROM project_links
UNION ALL
SELECT 'Notes', COUNT(*) FROM notes;

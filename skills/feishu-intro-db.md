---
name: feishu-intro-db
name_zh: 飞书个人介绍数据库版
description: 实时更新的个人介绍系统。数据存储在 Supabase 数据库，通过 API 实时获取，支持网页展示和自动同步。
metadata: {"clawdbot":{"emoji":"🌐"}}
triggers:
  - 同步介绍到数据库
  - 更新数据库介绍
  - 刷新个人介绍页面
  - 查看个人介绍页面
priority: 90
---

# Feishu 实时个人介绍系统（数据库版）

类似 qqBot 的实现方式，将个人介绍数据存储在数据库，通过 API 实时获取并在网页上展示。

---

## 🏗️ 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   简历数据文件   │────▶│  同步脚本       │────▶│  Supabase DB    │
│  (JSON files)   │     │ (sync script)   │     │ (personal_intro)│
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │   API 接口      │
                    │  /rest/v1/...   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌─────────┐    ┌─────────┐    ┌─────────┐
        │ 网页展示 │    │ 飞书Bot │    │ 第三方  │
        │  intro  │    │  发送   │    │  应用   │
        │  .html  │    │         │    │         │
        └─────────┘    └─────────┘    └─────────┘
```

---

## 📁 文件结构

```
workspace-resume-manager/
├── data/                          # 简历数据源
│   ├── profile.json              # 个人基本信息
│   ├── skills.json               # 技能标签
│   ├── experience.json           # 工作经历
│   └── projects.json             # 项目展示
├── scripts/
│   ├── sync-intro-to-db.sh       # 完整同步脚本
│   └── sync-intro-simple.sh      # 简化版同步脚本
├── sql/
│   └── create_personal_intro_table.sql  # 数据库表创建脚本
├── public/
│   └── intro.html                # 个人介绍展示页面
└── skills/
    └── feishu-intro-db.md        # 本技能文档
```

---

## 🗄️ 数据库表结构

**表名**: `personal_intro`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 固定值 "personal-intro" |
| name | TEXT | 姓名 |
| title | TEXT | 职位头衔 |
| quote | TEXT | 座右铭 |
| avatar | TEXT | 头像URL |
| about | TEXT | 个人简介 |
| contact | JSONB | 联系方式对象 |
| skills | JSONB | 技能分类对象 |
| experiences | JSONB | 工作经历数组 |
| featured_projects | JSONB | 精选项目数组 |
| updated_at | TIMESTAMP | 最后更新时间 |

---

## 🚀 使用方式

### 1. 同步数据到数据库

```bash
# 完整同步（包含所有字段）
cd /root/.openclaw/workspace-resume-manager
./scripts/sync-intro-to-db.sh

# 简化同步（基础信息）
./scripts/sync-intro-simple.sh
```

### 2. 访问个人介绍页面

打开浏览器访问：
```
file:///root/.openclaw/workspace-resume-manager/public/intro.html
```

或部署到服务器后访问：
```
https://your-domain.com/intro.html
```

### 3. 通过 API 获取数据

```bash
curl -s -X GET "https://riieooizyhovmgvhpcxj.supabase.co/rest/v1/personal_intro?id=eq.personal-intro" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 🤖 AI 指令

### 同步到数据库

**用户**: 同步介绍到数据库

**AI 执行**:
```bash
cd /root/.openclaw/workspace-resume-manager
./scripts/sync-intro-simple.sh
```

**AI 回复**:
```
🔄 正在同步个人介绍到数据库...
✅ 同步成功！

📊 同步内容：
• 姓名: 安鼎禹
• 职位: Web前端开发工程师 / AI智能体开发 / AI编程
• 更新时间: 2026-02-24 18:10:00

🔗 访问链接:
• 网页展示: public/intro.html
• API 接口: /rest/v1/personal_intro?id=eq.personal-intro
```

---

### 更新并同步

**用户**: 更新我的职位信息并同步到数据库

**AI 执行**:
1. 更新 `data/profile.json` 中的职位信息
2. 执行同步脚本
3. 发送确认消息

**AI 回复**:
```
✅ 职位信息已更新并同步到数据库！

📝 更新内容：
• 原职位: Web前端开发工程师 / AI智能体开发 / AI编程
• 新职位: 高级前端工程师 / AI技术负责人

🔄 数据库已同步
🌐 网页将自动显示最新内容
```

---

## 📊 数据流

### 更新流程

1. **修改简历数据** → 编辑 `data/*.json` 文件
2. **执行同步** → 运行 `sync-intro-simple.sh`
3. **数据入库** → 更新 Supabase `personal_intro` 表
4. **实时展示** → 网页通过 API 获取最新数据

### 自动同步（可选）

设置定时任务，每天自动同步：

```bash
openclaw cron add \
  --name "每日同步个人介绍" \
  --cron "0 8 * * *" \
  --tz "Asia/Shanghai" \
  --message "cd /root/.openclaw/workspace-resume-manager && ./scripts/sync-intro-simple.sh" \
  --deliver \
  --channel feishu \
  --to "{openid}"
```

---

## 🎨 页面特性

### 网页展示 (intro.html)

- ✅ **响应式设计** - 适配手机、平板、电脑
- ✅ **实时数据** - 从数据库 API 动态获取
- ✅ **本地备份** - 数据库不可用时显示本地数据
- ✅ **加载动画** - 优雅的数据加载体验
- ✅ **技能标签** - 彩色分类展示
- ✅ **时间显示** - 显示最后更新时间

### 页面区块

1. **Hero 区域** - 头像、姓名、职位、座右铭
2. **关于我** - 个人简介
3. **联系方式** - 地点、邮箱、电话
4. **核心技能** - 分类技能标签
5. **工作经历** - 时间线展示
6. **精选项目** - 项目卡片展示

---

## 🔧 技术栈

- **数据库**: Supabase (PostgreSQL)
- **前端**: HTML5 + Tailwind CSS + Vanilla JS
- **API**: RESTful API
- **部署**: 静态页面 + 数据库服务

---

## ⚠️ 注意事项

### 数据库表创建

首次使用需要在 Supabase 控制台执行 SQL：

```sql
-- 参见 sql/create_personal_intro_table.sql
CREATE TABLE IF NOT EXISTS public.personal_intro (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    quote TEXT,
    avatar TEXT,
    about TEXT,
    contact JSONB DEFAULT '{}'::jsonb,
    skills JSONB DEFAULT '{}'::jsonb,
    experiences JSONB DEFAULT '[]'::jsonb,
    featured_projects JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.personal_intro ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取
CREATE POLICY "Allow anonymous read access" 
ON public.personal_intro 
FOR SELECT 
TO anon 
USING (true);
```

### API Key 安全

- 当前使用 anon key，仅允许读取
- 写入操作需要通过服务端脚本（有 service_role key）
- 生产环境建议使用服务端代理

---

## 📝 更新记录

| 时间 | 更新内容 |
|------|----------|
| 2026-02-24 | 创建个人介绍数据库同步系统 |
| 2026-02-24 | 添加网页展示页面 |
| 2026-02-24 | 集成到 Feishu Bot |

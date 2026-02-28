---
name: resume-manager
description: 个人简历项目管理助手。专门用于管理、维护和展示个人简历网站项目。支持简历内容更新、项目展示管理、技能标签维护、部署状态监控等功能。当用户需要管理个人简历项目、更新简历内容、添加新项目或检查部署状态时使用此技能。项目基于岁时记二十四节气主题，融合中国传统文化元素。
---

# Resume Manager - 个人简历项目管理

## 概述

此技能用于管理「岁时记」个人简历网站项目，这是一个融合二十四节气主题、动态水墨意境的诗意简历网站。

**项目信息：**
- **项目名称**: 岁时记 - 二十四节气简历
- **App ID**: cli_a916c91c4b78dcc6
- **项目状态**: 已完成
- **技术栈**: React + TypeScript + Tailwind CSS + Vite

## 核心功能

### 1. 简历内容管理
- 更新个人信息（姓名、职位、联系方式等）
- 管理工作经历
- 维护教育背景
- 更新技能标签

### 2. 项目展示管理
- 添加新项目
- 编辑现有项目
- 删除过时项目
- 更新项目截图和描述

### 3. 协作功能 ⭐ 新增
- **调用设计助手(image-generator)** - 生成项目封面图、Logo、头像等
- **调用代码助手(code-master)** - 协助开发简历网站功能
- **调用创作助手(creator-hub)** - 撰写项目文案、优化描述
- **调用数据助手(data-analyst)** - 分析简历访问数据

**调用方式：**
```javascript
// 调用设计助手生成项目封面
sessions_spawn({
  agentId: "image-generator",
  task: "TARGET_USER: <用户ID>\n生成一张科技感简历封面图，蓝色主题"
})

// 调用创作助手优化文案
sessions_spawn({
  agentId: "creator-hub",
  task: "TARGET_USER: <用户ID>\n优化以下项目描述：[描述内容]"
})
```

### 4. 技能学习追踪管理 ⭐ 新增
- **查看技能学习记录** - 从Supabase数据库查询技能学习历史
- **按时间筛选** - 查看特定日期范围的技能学习情况
- **按Agent分类** - 查看不同Agent的技能提升情况
- **生成技能报告** - 生成周报/月报技能学习总结
- **同步到简历** - 将新学习的技能自动同步到简历技能标签

### 4. 部署与发布
- 检查部署状态
- 触发重新部署
- 管理域名配置
- 监控网站访问

### 5. 数据备份
- 每次修改自动备份
- 保留最近30个版本
- 支持手动创建快照
- 数据恢复能力

## 文件结构

```
workspace-resume-manager/
├── data/                       # 简历数据（JSON格式）
│   ├── profile.json           # 个人基本信息
│   ├── experience.json        # 工作经历
│   ├── education.json         # 教育背景
│   ├── skills.json            # 技能标签
│   ├── projects.json          # 项目展示
│   └── backups/               # 数据备份
├── project/                    # 前端项目代码
│   ├── src/                   # 源代码
│   ├── public/                # 静态资源
│   ├── config/                # 配置文件
│   ├── dist/                  # 构建输出
│   └── package.json           # 依赖配置
└── config/
    └── settings.json          # 项目配置
```

## 数据格式规范

### 个人信息 (data/profile.json)
```json
{
  "name": "姓名",
  "title": "职位头衔",
  "quote": "个人名言",
  "avatar": "头像URL",
  "about": "个人简介",
  "contact": {
    "age": 年龄,
    "location": "所在地",
    "phone": "电话",
    "email": "邮箱"
  },
  "social": {
    "github": "GitHub链接",
    "linkedin": "LinkedIn链接",
    "website": "个人网站"
  }
}
```

### 工作经历 (data/experience.json)
```json
{
  "experiences": [
    {
      "company": "公司名称",
      "position": "职位",
      "period": "时间段",
      "description": "工作描述",
      "achievements": ["成就1", "成就2"]
    }
  ]
}
```

### 项目展示 (data/projects.json)
```json
{
  "projects": [
    {
      "id": "项目ID",
      "name": "项目名称",
      "role": "担任角色",
      "period": "时间段",
      "tags": ["标签1", "标签2"],
      "description": "项目描述",
      "highlight": true,
      "subProjects": [...],
      "links": [...]
    }
  ]
}
```

### 技能学习追踪管理

**数据库连接信息：**
- **Supabase URL**: `https://riieooizyhovmgvhpcxj.supabase.co`
- **表名**: `skill_learning_logs`
- **API Key**: 使用环境变量或配置文件中设置的key

**数据表结构：**
```json
{
  "id": "UUID",
  "date": "日期 (YYYY-MM-DD)",
  "content": "学习内容描述",
  "extracted_skills": ["技能1", "技能2"],
  "related_skill_category": "技能分类",
  "confidence_score": 置信度分数,
  "created_at": "创建时间"
}
```

**技能分类映射：**
- AI 智能体开发: n8n, dify, coze, workflow, prompt, agent, 智能体, 工作流
- Web 开发: vue, react, javascript, typescript, html, css, 前端, uni-app
- AI 工具使用: kimi, gpt, gemini, sora, claude, ai工具
- AI 编程工具: cursor, trae, kiro, claude code, ai编程
- 设计与媒体: figma, stitch, 剪映, 抖音, 小红书, 运营
- 数据库: supabase, postgresql, mysql, 数据库
- DevOps: docker, nginx, linux, 部署, 服务器

**管理命令：**
```
查看技能学习记录
查看本周技能学习
查看本月技能学习
按Agent查看技能学习
generate skill report
同步技能到简历
```

**操作流程：**
1. 使用 `web_fetch` 或 `exec + curl` 查询 Supabase API
2. 解析返回的JSON数据
3. 按日期/Agent/分类筛选和排序
4. 生成技能学习报告
5. 可选：将新技能同步到 `data/skills.json`

**示例查询：**
```bash
# 查询最近7天的技能学习记录
curl -s -X GET "https://riieooizyhovmgvhpcxj.supabase.co/rest/v1/skill_learning_logs?order=created_at.desc&limit=10" \
  -H "apikey: <API_KEY>" \
  -H "Authorization: Bearer <API_KEY>"
```

---

## 使用方法

### 查看简历信息
```
查看我的简历
显示个人信息
列出所有项目
查看工作经历
```

### 更新简历内容
```
更新我的职位信息为"高级前端工程师"
添加新的工作经历
更新技能标签，添加"Next.js"
添加新项目 [项目名称]
```

### 项目管理
```
查看项目状态
备份简历数据
恢复之前版本
重新部署网站
```

### 技能学习追踪管理 ⭐ 新增
```
查看技能学习记录
查看本周技能学习情况
查看本月技能学习情况
按Agent查看技能学习
generate skill report for this week
同步新技能到简历
查看技能统计
```

## 更新操作流程

1. **读取当前数据** - 从data目录读取JSON文件
2. **应用修改** - 根据用户需求更新数据
3. **验证数据格式** - 确保JSON格式正确
4. **创建备份** - 备份原数据到backups目录
5. **保存新数据** - 写入更新后的JSON文件
6. **可选：触发部署** - 重新构建并部署

## 备份策略

- **自动备份**: 每次修改自动创建时间戳备份
- **保留策略**: 保留最近30个版本
- **手动备份**: 支持手动创建快照
- **恢复能力**: 支持从备份恢复任意版本

## 注意事项

1. **数据安全**: 所有修改都会自动备份，可放心操作
2. **版本控制**: 支持查看和恢复历史版本
3. **实时预览**: 修改后可以在开发环境预览效果
4. **部署同步**: 修改后需要手动触发部署才能生效
5. **JSON格式**: 确保所有数据文件保持有效的JSON格式

## 开发命令

```bash
# 进入项目目录
cd project

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 主题特色

- **二十四节气**: 主题随时节自动流转
- **水墨意境**: 动态水墨效果
- **节日特效**: 特殊节日视觉特效
- **传统文化**: 融入中国传统文化元素

---

*岁时记 - 记录你的技术成长之路*

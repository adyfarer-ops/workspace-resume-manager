# AGENTS.md - 简历助手 (Resume Manager)

## 基本信息

- **Agent ID**: `resume-manager`
- **名称**: 简历助手
- **职责**: 管理个人简历项目、技能学习追踪、部署监控
- **工作空间**: `/root/.openclaw/workspace-resume-manager`

## 核心能力

### 1. 简历内容管理
- 读取和更新 `data/` 目录下的 JSON 文件
- 管理个人信息、工作经历、教育背景、技能标签、项目展示
- 自动备份和版本控制

### 2. 技能学习追踪管理 ⭐
- 连接 Supabase 数据库查询 `skill_learning_logs` 表
- 按时间、Agent、分类筛选技能学习记录
- 生成技能学习周报/月报
- 将新技能同步到简历

### 3. 项目部署管理
- 检查网站部署状态
- 触发重新构建和部署
- 管理域名和配置

## 工具

- `read` - 读取简历数据文件
- `write` - 更新简历数据文件
- `edit` - 修改配置文件
- `exec` - 执行构建命令、查询 Supabase API
- `web_fetch` - 获取技能学习数据

## 数据库连接

**Supabase 配置：**
- URL: `https://riieooizyhovmgvhpcxj.supabase.co`
- 表名: `skill_learning_logs`
- 查询方式: REST API (curl 或 web_fetch)

## 文件结构

```
workspace-resume-manager/
├── data/              # 简历数据
│   ├── profile.json
│   ├── skills.json    # 技能标签（可与技能学习追踪同步）
│   └── ...
├── project/           # 前端项目代码
└── SKILL.md           # 详细技能文档
```

## 使用场景

1. **管理简历内容** - 更新个人信息、添加项目
2. **追踪技能学习** - 查看学习记录、生成报告
3. **同步技能标签** - 将新学习的技能添加到简历
4. **部署网站** - 构建和发布简历网站

---
*岁时记 - 记录你的技术成长之路*

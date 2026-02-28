# 实时个人介绍 API 系统

## 模仿 qqBot 实现

qqBot 的个人介绍系统架构：

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   前端页面       │────▶│   API 服务器     │────▶│   数据库        │
│  (Vue/React)    │◀────│  (Node/Python)  │◀────│  (Supabase)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│   实时个人介绍   │
│   动态更新       │
└─────────────────┘
```

## 实现方案

### 方案 1: 静态 JSON API（简单）
- 将 `personal_intro.json` 部署到静态服务器
- 前端通过 `fetch()` 获取
- 更新时替换 JSON 文件

### 方案 2: Supabase REST API（推荐）
- 使用 Supabase 作为后端
- 提供 RESTful API
- 支持实时订阅

### 方案 3: Node.js API 服务器（完整）
- 自建 API 服务器
- 完整的数据管理
- 支持认证和权限

## 当前进度

✅ 数据同步脚本 (`sync-profile-to-db.sh`)
✅ 前端展示页面 (`intro.html`)
✅ 完整数据结构 (`personal_intro.json`)
⏳ 部署 API 服务
⏳ 前端接入 API

## API 端点设计

```
GET  /api/profile          # 获取完整个人资料
GET  /api/profile/basic    # 获取基本信息
GET  /api/skills           # 获取技能列表
GET  /api/experiences      # 获取工作经历
GET  /api/projects         # 获取项目列表
POST /api/profile/update   # 更新个人资料（需认证）
```

## 下一步

1. 选择部署方案
2. 配置 API 服务器
3. 更新前端代码接入 API
4. 设置定时同步任务

# 岁时记简历网站

## 项目简介

基于 React + TypeScript + Tailwind CSS 开发的诗意简历网站，融合二十四节气主题、动态水墨意境、节日特效等中国传统文化元素。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式工具**: Tailwind CSS
- **构建工具**: Vite
- **数据库**: Supabase
- **PDF生成**: Puppeteer + Handlebars

## 项目结构

```
workspace-resume-manager/
├── project/                # React 前端项目
│   ├── src/               # 源代码
│   │   ├── components/    # 组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── utils/         # 工具函数
│   │   └── App.tsx        # 主应用
│   └── index.html         # HTML 模板
├── api/                    # PDF API 服务
│   └── pdf-server.js      # Puppeteer PDF 生成
├── templates/              # PDF 模板
│   └── resume-extended.html
├── data/                   # JSON 数据文件
├── scripts/                # 自动化脚本
│   ├── unified-weekly-update.sh
│   └── unified-skill-tracker.mjs
└── memory/                 # 记忆/文档
```

## 功能特性

- 🎨 二十四节气主题自动切换
- 📝 简历 PDF 生成与下载
- 🔄 每周自动更新个人介绍和技能学习
- 📱 响应式设计，支持移动端
- 🌐 部署在 https://yfarer.cn/ady/

## 开发命令

```bash
# 安装依赖
cd project && npm install

# 开发模式
npm run dev

# 构建
npm run build

# 部署
cp -r dist/* /var/www/ady/
```

## PDF API

```bash
# 启动 PDF 服务
cd api && node pdf-server.js

# 测试
http://localhost:3002/api/health
```

## 自动更新

每周一上午 9:00 自动执行：
- 更新个人介绍（从所有 Agent 会话提取）
- 更新技能学习记录
- 发送通知消息

## 许可证

MIT

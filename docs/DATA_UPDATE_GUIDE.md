# 简历数据实时更新方案

## 📋 概述

实现了从 `data/*.json` 文件实时更新简历数据的功能，无需修改代码即可更新个人介绍和技能。

## 📁 文件结构

```
workspace-resume-manager/
├── data/                          # 数据源目录
│   ├── profile.json              # 个人基本信息
│   ├── experience.json           # 工作经历
│   ├── education.json            # 教育背景
│   ├── skills.json               # 技能标签 ⭐
│   ├── projects.json             # 项目展示
│   └── backups/                  # 自动备份
├── project/
│   ├── src/
│   │   ├── dynamic-data.ts       # 动态数据加载模块
│   │   ├── profile-data.ts       # 同步生成的数据文件
│   │   └── constants.ts          # 原始数据（保留备份）
│   ├── public/
│   │   └── data -> ../data      # 软链接，使JSON可访问
│   └── package.json
└── scripts/
    └── sync-profile-data.js      # 数据同步脚本
```

## 🔄 更新方式

### 方式一：手动修改 JSON 文件（推荐）

直接编辑 `data/` 目录下的 JSON 文件：

```bash
# 编辑技能文件
data/skills.json

# 编辑个人信息
data/profile.json

# 编辑工作经历
data/experience.json

# 编辑项目
data/projects.json
```

修改后刷新页面即可看到更新（如果使用动态加载模式）。

### 方式二：使用同步脚本

将 JSON 数据同步到 TypeScript 代码：

```bash
cd project
npm run sync-data
```

这会生成 `src/profile-data.ts` 文件，包含最新的数据。

### 方式三：通过 Agent 更新

通过对话让 Agent 帮你更新：

```
@简历助手 添加新技能 "Next.js"
@简历助手 更新我的职位为 "高级前端工程师"
@简历助手 添加新的工作经历
```

## 📝 技能数据格式

### skills.json 结构

```json
{
  "skills": {
    "technical": [          // 技术技能（分类展示）
      {
        "category": "AI 智能体开发",
        "items": ["n8n", "Dify", "Coze", "Workflow编排"]
      },
      {
        "category": "Web 开发",
        "items": ["Vue3", "React", "TypeScript"]
      }
    ],
    "soft": [               // 软技能
      "全栈思维",
      "产品意识",
      "团队协作"
    ],
    "languages": [          // 语言能力
      "中文",
      "英语"
    ],
    "tools": [              // 工具使用
      "Git",
      "VS Code",
      "Figma"
    ]
  }
}
```

## 🚀 使用动态数据加载

### 在组件中使用

```typescript
import { useEffect, useState } from 'react';
import { loadProfileData, getDefaultProfile } from './dynamic-data';
import type { Profile } from './types';

function App() {
  const [profile, setProfile] = useState<Profile>(getDefaultProfile());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      {/* 技能展示 */}
      {profile.skills.map(skill => (
        <div key={skill.title}>
          <h3>{skill.title}</h3>
          <ul>
            {skill.skills.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## 💾 自动备份

每次通过 Agent 修改数据时，会自动创建备份：

```
data/backups/
├── skills.json.backup.1708790400000
├── profile.json.backup.1708790400000
└── ...
```

## 🔄 数据流向

```
用户修改
    ↓
data/*.json (JSON 数据源)
    ↓
├─→ 动态加载 (fetch API) → 实时更新
└─→ sync-data 脚本 → profile-data.ts → 编译构建
```

## 🛠️ 开发命令

```bash
# 进入项目目录
cd project

# 开发模式（支持热更新）
npm run dev

# 同步数据到 TypeScript
npm run sync-data

# 构建
npm run build

# 预览
npm run preview
```

## ⚠️ 注意事项

1. **JSON 格式**: 确保所有 JSON 文件格式正确
2. **数据备份**: 修改前会自动备份，可在 `backups/` 目录恢复
3. **缓存问题**: 动态加载时浏览器可能缓存 JSON，开发时建议禁用缓存
4. **构建部署**: 生产环境需要确保 `data/` 目录被正确复制到部署目录

## 📱 实时更新示例

### 添加新技能

1. 编辑 `data/skills.json`:
```json
{
  "skills": {
    "technical": [
      {
        "category": "Web 开发",
        "items": ["Vue3", "React", "TypeScript", "Next.js"]  // 添加 Next.js
      }
    ]
  }
}
```

2. 刷新页面即可看到更新

### 更新个人介绍

1. 编辑 `data/profile.json`:
```json
{
  "name": "安鼎禹",
  "title": "高级前端工程师 / AI智能体开发",
  "about": "新的个人介绍..."
}
```

2. 刷新页面即可看到更新

---

*数据驱动，实时更新，让简历保持最新状态！*

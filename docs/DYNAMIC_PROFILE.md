# 动态个人介绍功能实现

## ✅ 已实现的功能

### 1. 双数据源支持
应用现在支持从两个数据源加载个人介绍和技能：

- **本地 JSON 文件** (`data/*.json`) - 优先级高
- **Supabase 数据库** - 作为备选

### 2. 数据加载优先级
```
1. 首先尝试加载本地 JSON 文件
2. 如果本地文件不存在或加载失败，自动切换到 Supabase
3. 在 UI 上显示当前使用的数据源
```

### 3. 文件位置

#### 数据源文件
```
data/
├── profile.json       # 个人基本信息
├── skills.json        # 技能标签 ⭐
├── experience.json    # 工作经历
├── education.json     # 教育背景
└── projects.json      # 项目展示
```

#### 核心代码文件
```
project/src/
├── hooks/
│   └── useProfileData.ts    # 数据加载 Hook ⭐
├── App.tsx                   # 主组件，使用动态数据
└── constants.ts              # 原始硬编码数据（备份）
```

## 🔄 动态个人介绍生成

在 `App.tsx` 中，`generateDynamicAbout` 函数会：

1. **获取最新技能** - 从 skillCategories 提取前3个技能
2. **获取最新项目** - 从 projects 提取前2个项目名称
3. **获取笔记数量** - 统计 notes 数量
4. **动态拼接** - 自动生成完整的个人介绍

示例输出：
```
拥有扎实的前端开发经验，并积极拥抱AI技术变革...
目前专注于n8n、Dify、Coze等技术领域。
近期正在开发AI编程工具应用、Coze工作流与智能体开发等项目。
持续学习并记录了3篇技术笔记。
```

## 🎯 如何更新个人介绍

### 方法 1：直接修改 JSON（推荐）

编辑 `data/profile.json`：
```json
{
  "name": "安鼎禹",
  "title": "高级前端工程师 / AI智能体开发",
  "about": "新的个人介绍..."
}
```

编辑 `data/skills.json` 添加新技能：
```json
{
  "skills": {
    "technical": [
      {
        "category": "Web 开发",
        "items": ["Vue3", "React", "TypeScript", "Next.js"]  // 添加新技能
      }
    ]
  }
}
```

刷新页面即可看到更新！

### 方法 2：通过 Agent 更新

```
@简历助手 更新我的个人介绍为：...
@简历助手 添加新技能 "Next.js"
@简历助手 添加项目 "新项目名称"
```

## 📊 数据源指示器

页面右上角会显示当前使用的数据源：
- 🟢 **本地数据** - 从 JSON 文件加载
- 🔵 **云端数据** - 从 Supabase 加载

## 🛠️ 技术实现

### useProfileData Hook

```typescript
const { data, loading, error, dataSource, refetch } = useProfileData();
```

- `data` - 个人资料数据
- `loading` - 加载状态
- `error` - 错误信息
- `dataSource` - 数据来源 ('local' | 'supabase')
- `refetch` - 重新加载数据

### 数据格式转换

本地 JSON 格式 → 应用内部格式：

```typescript
// skills.json 格式
{
  "skills": {
    "technical": [
      { "category": "AI 智能体开发", "items": ["n8n", "Dify"] }
    ]
  }
}

// 转换为应用格式
{
  skillCategories: [
    { name: "AI 智能体开发", skills: [{name: "n8n"}, {name: "Dify"}] }
  ]
}
```

## 🚀 部署注意事项

### 开发环境
```bash
cd project
npm run dev
# 修改 data/*.json 后刷新页面即可
```

### 生产环境
确保 `data/` 目录被复制到部署目录：
```bash
npm run build
# data/ 目录需要复制到 dist/ 目录
cp -r data dist/
```

## 📝 更新流程

```
用户修改 data/skills.json
        ↓
浏览器刷新页面
        ↓
useProfileData 检测到本地 JSON 存在
        ↓
加载并转换 JSON 数据
        ↓
generateDynamicAbout 生成动态介绍
        ↓
UI 显示更新后的内容
```

## 🎉 优势

1. **实时更新** - 修改 JSON 后刷新即可看到效果
2. **无需构建** - 不需要重新编译代码
3. **版本控制** - JSON 文件可以提交到 git
4. **自动备份** - 通过 Agent 修改时自动备份
5. **双保险** - 本地失败自动切换到云端

---

*现在你可以通过修改 `data/` 目录下的 JSON 文件来实时更新个人介绍和技能了！*

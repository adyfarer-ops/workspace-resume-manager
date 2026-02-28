# 实时个人介绍系统 - 完整实现

## 需求理解

qqBot 的个人介绍功能：
1. ✅ 数据存储在数据库（Supabase）
2. ✅ 可以通过 Bot 命令更新数据
3. ✅ 网页实时显示最新数据
4. ✅ 数据变更后页面自动更新

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户交互层                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Feishu Bot │  │   QQ Bot     │  │   直接编辑   │      │
│  │   命令更新   │  │   命令更新   │  │   JSON 文件  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据处理层                              │
│                 scripts/sync-to-db.sh                       │
│                      Python 处理                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                              │
│                   Supabase Database                          │
│              Table: personal_intro                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API 接口层                              │
│              Supabase REST API                               │
│    GET /rest/v1/personal_intro?id=eq.personal-intro         │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│   网页展示       │ │   其他应用   │ │   Bot 回复   │
│  intro.html     │ │   调用 API   │ │   发送介绍   │
│  实时获取数据    │ │              │ │              │
└─────────────────┘ └──────────────┘ └──────────────┘
```

## 实现步骤

### 1. 创建数据库表

```sql
CREATE TABLE IF NOT EXISTS public.personal_intro (
    id TEXT PRIMARY KEY DEFAULT 'personal-intro',
    name TEXT NOT NULL,
    title TEXT,
    quote TEXT,
    avatar TEXT,
    about TEXT,
    contact JSONB DEFAULT '{}'::jsonb,
    social JSONB DEFAULT '{}'::jsonb,
    skills JSONB DEFAULT '{}'::jsonb,
    experiences JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
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

### 2. 同步脚本

`scripts/sync-to-db.sh`
- 读取本地 JSON 文件
- 处理数据格式
- 调用 Supabase API 更新数据

### 3. 前端页面

`public/intro.html`
- 使用 fetch() 从 Supabase API 获取数据
- 实时渲染个人介绍
- 显示数据来源和更新时间

### 4. Bot 命令

- `更新我的职位为xxx` → 更新数据库
- `同步个人介绍` → 手动触发同步
- `查看个人介绍` → 显示当前数据

## 与 qqBot 对比

| 功能 | qqBot 实现 | 本系统实现 |
|------|-----------|-----------|
| 数据库 | Supabase | ✅ Supabase |
| Bot 更新 | QQ Bot 命令 | ✅ Feishu Bot 命令 |
| 网页展示 | Vue + API | ✅ HTML + API |
| 实时更新 | ✅ | ✅ |

## 下一步

1. 在 Supabase 创建表
2. 运行同步脚本
3. 测试 Bot 命令
4. 部署网页

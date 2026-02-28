# 实时个人介绍系统 - 部署指南

## 🚀 快速开始

### 第一步：创建数据库表

需要在 Supabase 控制台执行以下 SQL：

```sql
-- 创建个人介绍表
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

-- 添加表注释
COMMENT ON TABLE public.personal_intro IS '个人介绍数据表，用于实时展示个人介绍页面';

-- 启用 RLS (Row Level Security)
ALTER TABLE public.personal_intro ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名读取
CREATE POLICY "Allow anonymous read access" 
ON public.personal_intro 
FOR SELECT 
TO anon 
USING (true);

-- 创建策略：允许认证用户读写
CREATE POLICY "Allow authenticated users full access" 
ON public.personal_intro 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_personal_intro_updated_at ON public.personal_intro;
CREATE TRIGGER update_personal_intro_updated_at
    BEFORE UPDATE ON public.personal_intro
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 第二步：同步数据

```bash
cd /root/.openclaw/workspace-resume-manager
./scripts/sync-intro-simple.sh
```

### 第三步：查看页面

打开浏览器访问：
```
file:///root/.openclaw/workspace-resume-manager/public/intro.html
```

---

## 📊 系统架构

```
简历数据 (JSON) → 同步脚本 → Supabase DB → API → 网页展示
     ↑                                                    ↓
     └──────────── 更新后重新同步 ←←←←←←←←←←←←←←←←←←┘
```

---

## 🔧 文件说明

| 文件 | 说明 |
|------|------|
| `scripts/sync-intro-simple.sh` | 数据同步脚本 |
| `public/intro.html` | 个人介绍展示页面 |
| `sql/create_personal_intro_table.sql` | 数据库表创建脚本 |
| `skills/feishu-intro-db.md` | 技能文档 |

---

## 📝 更新流程

1. 修改 `data/` 目录下的简历数据文件
2. 运行 `./scripts/sync-intro-simple.sh`
3. 网页自动显示最新内容

---

## ⚠️ 当前状态

**数据库表**: ❌ 未创建（需要在 Supabase 控制台执行 SQL）
**本地页面**: ✅ 已创建 (`public/intro.html`)
**同步脚本**: ✅ 已创建 (`scripts/sync-intro-simple.sh`)
**API 接口**: ⏳ 等待表创建后可用

---

## 🎯 下一步

1. 登录 Supabase 控制台
2. 进入 SQL Editor
3. 执行上面的 SQL 脚本
4. 运行同步脚本
5. 访问个人介绍页面

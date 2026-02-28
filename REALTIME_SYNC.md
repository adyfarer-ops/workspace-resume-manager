# 数据库联动方案 - 完整实现

## 🎯 目标
实现本地 JSON 与 Supabase 数据库的双向实时联动

## 🏗️ 架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   本地 JSON     │◀───▶│   同步脚本      │◀───▶│   Supabase      │
│   data/*.json   │     │   sync-to-db.sh │     │   Database      │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│   前端页面      │                           │   Realtime      │
│   useRealtime   │                           │   Subscription  │
│   Profile Hook  │                           │                 │
└─────────────────┘                           └─────────────────┘
```

## 📋 实现内容

### 1. 同步脚本
**文件**: `scripts/sync-to-database.sh`

支持三种模式：
- `push` - 本地 → 数据库
- `pull` - 数据库 → 本地
- `sync` - 双向同步（默认）

### 2. 实时 Hook
**文件**: `project/src/hooks/useRealtimeProfile.ts`

功能：
- 优先加载本地 JSON
- 订阅 Supabase 实时更新
- 数据库变化时自动更新 UI
- 提供 `syncToDatabase` 方法

### 3. 使用方式

#### 手动同步
```bash
# 本地 → 数据库
./scripts/sync-to-database.sh push

# 数据库 → 本地
./scripts/sync-to-database.sh pull

# 双向同步
./scripts/sync-to-database.sh sync
```

#### 前端使用
```typescript
import { useRealtimeProfile } from './hooks/useRealtimeProfile';

function App() {
  const { data, dataSource, syncToDatabase } = useRealtimeProfile();
  
  // 手动同步到数据库
  const handleSync = async () => {
    await syncToDatabase();
  };
  
  return (
    <div>
      <span>{dataSource === 'local' ? '🟢 本地' : '☁️ 云端'}</span>
      <button onClick={handleSync}>同步到数据库</button>
    </div>
  );
}
```

## 🔄 工作流程

### 场景 1: 修改本地数据
1. 修改 `data/skills.json`
2. 运行 `./scripts/sync-to-database.sh push`
3. 数据同步到 Supabase
4. 所有在线页面自动更新（通过 Realtime）

### 场景 2: 数据库直接更新
1. 在 Supabase 控制台修改数据
2. 所有订阅的页面自动收到更新
3. UI 实时刷新显示新数据

### 场景 3: 页面加载
1. 优先加载本地 JSON（快速）
2. 同时建立 Supabase 订阅
3. 如果数据库有更新，自动切换到云端数据

## ⚠️ 前提条件

需要在 Supabase 创建表：

```sql
CREATE TABLE IF NOT EXISTS public.personal_intro (
    id TEXT PRIMARY KEY,
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

ALTER TABLE public.personal_intro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" 
ON public.personal_intro 
FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow authenticated users full access" 
ON public.personal_intro 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```

## ✅ 状态

- [x] 同步脚本
- [x] 实时 Hook
- [ ] 数据库表创建
- [ ] 前端集成测试

-- create_personal_intro_table.sql
-- 创建个人介绍表

-- 创建表
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

-- 创建完整的简历数据库表结构
-- 与前端代码 useProfileData.ts 匹配

-- 1. profiles 表
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    quote TEXT,
    avatar TEXT,
    about TEXT,
    age INTEGER,
    location TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. education 表
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    school TEXT NOT NULL,
    major TEXT,
    degree TEXT,
    period TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- 3. work_experience 表
CREATE TABLE IF NOT EXISTS public.work_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT,
    period TEXT,
    details TEXT[],
    sort_order INTEGER DEFAULT 0
);

-- 4. skill_categories 表
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- 5. skills 表
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- 6. projects 表
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    period TEXT,
    tags TEXT[],
    description TEXT[],
    highlight BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- 7. sub_projects 表
CREATE TABLE IF NOT EXISTS public.sub_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    tags TEXT[],
    tech_stack TEXT[],
    ai_tools TEXT[],
    platforms TEXT[],
    image TEXT
);

-- 8. project_links 表
CREATE TABLE IF NOT EXISTS public.project_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_project_id UUID REFERENCES public.sub_projects(id) ON DELETE CASCADE,
    type TEXT,
    label TEXT,
    url TEXT,
    qrcode TEXT
);

-- 9. notes 表
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 创建读取策略
CREATE POLICY "Allow anonymous read" ON public.profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.education FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.work_experience FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.skill_categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.skills FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.projects FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.sub_projects FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.project_links FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read" ON public.notes FOR SELECT TO anon USING (true);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- create_personal_intro_logs_table.sql
-- 创建个人介绍更新记录表（与 skill_learning_logs 结构类似）

-- 创建表
CREATE TABLE IF NOT EXISTS public.personal_intro_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    content TEXT NOT NULL,
    generated_intro TEXT NOT NULL,
    related_projects TEXT[],
    related_skills TEXT[],
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加表注释
COMMENT ON TABLE public.personal_intro_logs IS '个人介绍更新记录表，记录每次自动生成的个人介绍';
COMMENT ON COLUMN public.personal_intro_logs.date IS '更新日期';
COMMENT ON COLUMN public.personal_intro_logs.content IS '工作/学习内容摘要';
COMMENT ON COLUMN public.personal_intro_logs.generated_intro IS '生成的个人介绍文本';
COMMENT ON COLUMN public.personal_intro_logs.related_projects IS '相关项目';
COMMENT ON COLUMN public.personal_intro_logs.related_skills IS '相关技能';
COMMENT ON COLUMN public.personal_intro_logs.confidence_score IS '置信度分数 (0-100)';

-- 启用 RLS
ALTER TABLE public.personal_intro_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名读取
CREATE POLICY "Allow anonymous read access" 
ON public.personal_intro_logs 
FOR SELECT 
TO anon 
USING (true);

-- 创建策略：允许认证用户读写
CREATE POLICY "Allow authenticated users full access" 
ON public.personal_intro_logs 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_personal_intro_logs_date 
ON public.personal_intro_logs(date DESC);

CREATE INDEX IF NOT EXISTS idx_personal_intro_logs_created_at 
ON public.personal_intro_logs(created_at DESC);

-- 示例数据（可选）
-- INSERT INTO public.personal_intro_logs (date, content, generated_intro, related_projects, related_skills, confidence_score)
-- VALUES (
--     '2026-02-24',
--     '完成了个人介绍自动更新系统的开发',
--     '拥有扎实的前端开发经验，并积极拥抱AI技术变革...',
--     ARRAY['个人介绍系统', '简历管理'],
--     ARRAY['React', 'TypeScript', 'Supabase'],
--     90
-- );

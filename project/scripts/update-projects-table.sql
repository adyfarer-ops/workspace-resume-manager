-- 更新 projects 表，添加归档相关字段
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS highlights TEXT[],
ADD COLUMN IF NOT EXISTS achievements TEXT[],
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- 创建项目归档统计视图
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  COUNT(*) as total_projects,
  COUNT(*) FILTER (WHERE is_completed = true) as completed_projects,
  COUNT(*) FILTER (WHERE archived_at IS NOT NULL) as archived_projects
FROM projects;

-- 添加项目完成时的触发器（可选）
-- 当项目标记为完成时，可以自动触发通知

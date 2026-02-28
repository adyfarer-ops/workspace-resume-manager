-- 创建技能学习记录表（使用 gen_random_uuid）
CREATE TABLE IF NOT EXISTS skill_learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  content TEXT NOT NULL,
  extracted_skills TEXT[] DEFAULT '{}',
  related_skill_category TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建技能统计视图
CREATE OR REPLACE VIEW skill_learning_stats AS
SELECT 
  related_skill_category,
  COUNT(*) as learning_count,
  ARRAY_AGG(DISTINCT unnested_skill) as skills_learned
FROM skill_learning_logs,
LATERAL UNNEST(extracted_skills) as unnested_skill
GROUP BY related_skill_category;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_skill_learning_logs_date ON skill_learning_logs(date);
CREATE INDEX IF NOT EXISTS idx_skill_learning_logs_category ON skill_learning_logs(related_skill_category);

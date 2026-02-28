-- 创建对话记录表
CREATE TABLE IF NOT EXISTS conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT,
  project_name TEXT,
  skills_involved TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_conversation_logs_created_at ON conversation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_session ON conversation_logs(session_key);

-- 添加 RLS 策略
ALTER TABLE conversation_logs ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入（用于记录）
CREATE POLICY "Allow anonymous insert" ON conversation_logs
  FOR INSERT TO anon WITH CHECK (true);

-- 允许匿名用户查询（用于总结）
CREATE POLICY "Allow anonymous select" ON conversation_logs
  FOR SELECT TO anon USING (true);

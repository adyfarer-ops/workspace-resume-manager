-- 文章采集队列表
CREATE TABLE IF NOT EXISTS article_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  title TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'imitating', 'completed', 'rejected'
  imitation_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 启用 RLS
ALTER TABLE article_queue ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public article_queue are viewable by everyone" ON article_queue
  FOR SELECT USING (true);

-- 允许匿名用户插入（用于提交链接）
CREATE POLICY "Allow anonymous insert" ON article_queue
  FOR INSERT WITH CHECK (true);

-- 允许匿名用户更新（用于确认/拒绝）
CREATE POLICY "Allow anonymous update" ON article_queue
  FOR UPDATE USING (true);

-- 创建索引
CREATE INDEX idx_article_queue_status ON article_queue(status);
CREATE INDEX idx_article_queue_created_at ON article_queue(created_at DESC);

-- 验证
SELECT 'article_queue table created' as status;

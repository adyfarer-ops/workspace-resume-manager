-- 插入新项目到 AI编程工具应用下
INSERT INTO sub_projects (
  project_id,
  title,
  subtitle,
  description,
  tags,
  tech_stack,
  ai_tools,
  platforms,
  links,
  created_at
)
VALUES (
  (SELECT id FROM projects WHERE name = 'AI编程工具应用' LIMIT 1),
  'OpenClaw 微信接入',
  '个人微信与OpenClaw打通',
  '基于企业微信官方接口，将OpenClaw接入个人微信，实现AI助手在微信端的正常使用。不走第三方协议，零封号风险。同时实现微信文章自动采集、仿写、入库的完整流程。',
  ARRAY['企业微信', '微信接入', '文章采集'],
  ARRAY['OpenClaw', 'Supabase', 'React', 'TypeScript'],
  ARRAY['Claude Code', 'Kiro'],
  ARRAY['微信', '企业微信'],
  '[
    {"type": "article", "label": "查看文章", "url": "https://yfarer.cn/notes/xxx"}
  ]'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

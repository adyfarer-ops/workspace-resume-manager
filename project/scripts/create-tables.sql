-- ============================================
-- 岁时记 - 完整数据库初始化脚本
-- 包含：用户信息、教育背景、工作经历、技能、项目、笔记
-- ============================================

-- 1. 用户基本信息表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(200),
  quote TEXT,
  avatar VARCHAR(500),
  about TEXT,
  age INTEGER,
  location VARCHAR(100),
  phone VARCHAR(100),
  email VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 教育背景表
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  school VARCHAR(200) NOT NULL,
  major VARCHAR(200),
  period VARCHAR(100),
  honors TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 工作经历表
CREATE TABLE IF NOT EXISTS work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company VARCHAR(200) NOT NULL,
  role VARCHAR(200),
  period VARCHAR(100),
  details TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 技能分类表
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 技能表
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(200),
  period VARCHAR(100),
  tags VARCHAR(100)[],
  description TEXT[],
  highlight BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 子项目表
CREATE TABLE IF NOT EXISTS sub_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sub_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  description TEXT,
  tags VARCHAR(100)[],
  tech_stack VARCHAR(100)[],
  ai_tools VARCHAR(100)[],
  platforms VARCHAR(100)[],
  image VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 项目链接表
CREATE TABLE IF NOT EXISTS project_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_project_id UUID REFERENCES sub_projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'h5', 'miniapp', etc.
  label VARCHAR(200),
  url VARCHAR(500),
  qrcode VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 笔记表 (已存在则跳过)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(300) NOT NULL,
  content TEXT,
  summary TEXT,
  tags VARCHAR(100)[],
  source_url VARCHAR(500),
  is_imitation BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft', -- 'published', 'draft', 'archived'
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public education are viewable by everyone" ON education
  FOR SELECT USING (true);

CREATE POLICY "Public work_experience are viewable by everyone" ON work_experience
  FOR SELECT USING (true);

CREATE POLICY "Public skill_categories are viewable by everyone" ON skill_categories
  FOR SELECT USING (true);

CREATE POLICY "Public skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public sub_projects are viewable by everyone" ON sub_projects
  FOR SELECT USING (true);

CREATE POLICY "Public project_links are viewable by everyone" ON project_links
  FOR SELECT USING (true);

CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (status = 'published');

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建增加浏览次数的函数
CREATE OR REPLACE FUNCTION increment_note_view(note_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notes SET view_count = view_count + 1 WHERE id = note_id;
END;
$$ LANGUAGE plpgsql;

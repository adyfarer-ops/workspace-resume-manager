#!/bin/bash
# sync-to-supabase.sh - 同步个人介绍到 Supabase 数据库
# 完全模仿 qqBot 实现方式

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

echo "🔄 开始同步个人介绍到 Supabase 数据库..."
echo ""

# 使用 Python 处理数据并上传到 Supabase
python3 <> 'EOF'
import json
import os
import sys
from datetime import datetime
import urllib.request
import urllib.error

workspace = "/root/.openclaw/workspace-resume-manager"
data_dir = f"{workspace}/data"
supabase_url = "https://riieooizyhovmgvhpcxj.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

# 读取所有数据文件
def load_json(filename):
    try:
        with open(f"{data_dir}/{filename}", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️  读取 {filename} 失败: {e}")
        return {}

print("📂 读取数据文件...")
profile = load_json("profile.json")
skills = load_json("skills.json")
experience = load_json("experience.json")
projects = load_json("projects.json")

# 构建个人介绍数据
print("🔨 构建个人介绍数据...")

# 处理 experiences，确保 achievements 字段存在
experiences_data = experience.get("experiences", [])
for exp in experiences_data:
    if "achievements" not in exp:
        exp["achievements"] = []

# 处理 projects，只保留 highlight 项目
projects_data = projects.get("projects", [])
featured_projects = [p for p in projects_data if p.get("highlight", False)]

# 构建最终数据
personal_intro = {
    "id": "personal-intro",
    "name": profile.get("name", "安鼎禹"),
    "title": profile.get("title", ""),
    "quote": profile.get("quote", ""),
    "avatar": profile.get("avatar", ""),
    "about": profile.get("about", ""),
    "contact": profile.get("contact", {}),
    "social": profile.get("social", {}),
    "skills": skills.get("skills", {}),
    "experiences": experiences_data,
    "projects": featured_projects,
    "updated_at": datetime.utcnow().isoformat() + "Z"
}

# 保存到本地文件
output_file = f"{workspace}/output/personal_intro.json"
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(personal_intro, f, ensure_ascii=False, indent=2)

print(f"💾 本地备份已保存: {output_file}")

# 上传到 Supabase
print("\n☁️  上传到 Supabase...")

try:
    # 构建请求
    url = f"{supabase_url}/rest/v1/personal_intro"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    data = json.dumps(personal_intro).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers=headers,
        method='POST'
    )
    
    with urllib.request.urlopen(req, timeout=30) as response:
        result = response.read().decode('utf-8')
        print(f"✅ 上传成功!")
        print(f"📊 响应: {result}")
        
except urllib.error.HTTPError as e:
    error_body = e.read().decode('utf-8')
    print(f"❌ 上传失败: HTTP {e.code}")
    print(f"📄 错误信息: {error_body}")
    
    if "Could not find the table" in error_body:
        print("\n⚠️  数据库表不存在!")
        print("请在 Supabase 控制台执行以下 SQL:")
        print("""
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
        """)
    sys.exit(1)
    
except Exception as e:
    print(f"❌ 上传失败: {e}")
    sys.exit(1)

# 显示数据摘要
print("\n📊 数据摘要:")
print(f"   - 姓名: {personal_intro['name']}")
print(f"   - 职位: {personal_intro['title']}")
print(f"   - 技能分类: {len(personal_intro['skills'].get('technical', []))} 个")
print(f"   - 工作经历: {len(personal_intro['experiences'])} 条")
print(f"   - 精选项目: {len(personal_intro['projects'])} 个")
print(f"   - 更新时间: {personal_intro['updated_at']}")

print("\n🌐 API 端点:")
print(f"   {supabase_url}/rest/v1/personal_intro?id=eq.personal-intro")

print("\n✅ 同步完成!")
EOF

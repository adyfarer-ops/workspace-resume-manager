#!/bin/bash
# sync-to-database.sh - 本地 JSON 与数据库双向同步

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

MODE="${1:-sync}"

echo "🔄 数据库联动同步工具"
echo "模式: $MODE"
echo ""

# 使用 Python 处理数据并上传到 Supabase
python3 - "$MODE" "$WORKSPACE" "$DATA_DIR" "$SUPABASE_URL" "$SUPABASE_KEY" << 'EOF'
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime

mode = sys.argv[1]
workspace = sys.argv[2]
data_dir = sys.argv[3]
supabase_url = sys.argv[4]
supabase_key = sys.argv[5]

def load_json(filename):
    try:
        with open(f"{data_dir}/{filename}", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取 {filename} 失败: {e}")
        return None

def fetch_from_database():
    """从数据库获取数据"""
    try:
        url = f"{supabase_url}/rest/v1/personal_intro?id=eq.personal-intro"
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Accept": "application/json"
        }
        
        req = urllib.request.Request(url, headers=headers, method='GET')
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data and len(data) > 0:
                return data[0]
            return None
    except Exception as e:
        print(f"❌ 从数据库获取数据失败: {e}")
        return None

def push_to_database(data):
    """推送数据到数据库"""
    try:
        url = f"{supabase_url}/rest/v1/personal_intro"
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        }
        
        req_data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=req_data, headers=headers, method='POST')
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = response.read().decode('utf-8')
            return True, result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return False, f"HTTP {e.code}: {error_body}"
    except Exception as e:
        return False, str(e)

def build_profile_data():
    """构建个人资料数据"""
    profile = load_json("profile.json") or {}
    skills = load_json("skills.json") or {}
    experience = load_json("experience.json") or {}
    projects = load_json("projects.json") or {}
    
    experiences_data = experience.get("experiences", [])
    for exp in experiences_data:
        if "achievements" not in exp:
            exp["achievements"] = []
    
    projects_data = projects.get("projects", [])
    
    return {
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
        "projects": projects_data,
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

# 主逻辑
if mode == "push":
    print("📤 推送本地数据到数据库...")
    data = build_profile_data()
    success, result = push_to_database(data)
    if success:
        print("✅ 推送成功!")
        print(f"📊 数据摘要: {data['name']} | {data['title']}")
    else:
        print(f"❌ 推送失败: {result}")
        if "Could not find the table" in result:
            print("\n⚠️  数据库表不存在，请先创建表!")
        sys.exit(1)

elif mode == "pull":
    print("📥 从数据库拉取数据...")
    data = fetch_from_database()
    if data:
        output_file = f"{workspace}/output/personal_intro.json"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("✅ 拉取成功!")
        print(f"💾 数据已保存到: {output_file}")
        print(f"📊 数据摘要: {data.get('name')} | {data.get('title')}")
    else:
        print("❌ 拉取失败或数据库为空")
        sys.exit(1)

elif mode == "sync":
    print("🔄 双向同步（本地 → 数据库）...")
    data = build_profile_data()
    success, result = push_to_database(data)
    if success:
        print("✅ 同步成功!")
        print(f"📊 数据摘要: {data['name']} | {data['title']}")
        print(f"🕐 更新时间: {data['updated_at']}")
    else:
        print(f"❌ 同步失败: {result}")
        sys.exit(1)

else:
    print(f"❌ 未知模式: {mode}")
    print("用法: ./sync-to-database.sh [push|pull|sync]")
    sys.exit(1)

print("\n✅ 完成!")
EOF

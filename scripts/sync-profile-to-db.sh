#!/bin/bash
# sync-profile-to-db.sh - 同步个人介绍到 profiles 表（使用 service_role key）

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjg1MCwiZXhwIjoyMDg2OTc4ODUwfQ.azMzZoioMnKKJwwwmaroxTxLnVYHMasfAxkW6lkdptk"

echo "🔄 同步个人介绍到 profiles 表（使用 service_role key）"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

python3 - "$WORKSPACE" "$DATA_DIR" "$SUPABASE_URL" "$SUPABASE_KEY" << 'EOF'
import json
import sys
import urllib.request
import urllib.error
from datetime import datetime

workspace = sys.argv[1]
data_dir = sys.argv[2]
supabase_url = sys.argv[3]
supabase_key = sys.argv[4]

def load_json(filename):
    try:
        with open(f"{data_dir}/{filename}", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取 {filename} 失败: {e}")
        return None

# 读取本地数据
print("📂 读取本地数据...")
profile = load_json("profile.json") or {}

# 直接使用本地 profile.json 中的 about 字段
about = profile.get("about", "")

# 构建更新数据
update_data = {
    "name": "安鼎禹",
    "nickname": "大鱼",
    "title": profile.get("title", ""),
    "quote": profile.get("quote", ""),
    "avatar": profile.get("avatar", ""),
    "about": about,
    "age": profile.get("contact", {}).get("age", 27),
    "location": profile.get("contact", {}).get("location", ""),
    "phone": profile.get("contact", {}).get("phone", ""),
    "email": profile.get("contact", {}).get("email", ""),
    "updated_at": datetime.utcnow().isoformat() + "Z"
}

print(f"📊 更新内容:")
print(f"   - 姓名: {update_data['name']}")
print(f"   - 昵称: {update_data['nickname']}")
print(f"   - 职位: {update_data['title']}")
print(f"   - 介绍: {update_data['about'][:80]}...")

# 更新到 profiles 表
print("\n☁️  更新到 profiles 表...")

try:
    # 先查询现有记录
    query_url = f"{supabase_url}/rest/v1/profiles?select=id&limit=1"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Accept": "application/json"
    }
    
    req = urllib.request.Request(query_url, headers=headers, method='GET')
    
    with urllib.request.urlopen(req, timeout=30) as response:
        existing = json.loads(response.read().decode('utf-8'))
        
        if existing and len(existing) > 0:
            profile_id = existing[0]['id']
            print(f"📝 找到现有记录: {profile_id}")
            
            # 更新记录
            update_url = f"{supabase_url}/rest/v1/profiles?id=eq.{profile_id}"
            update_headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            
            req_data = json.dumps(update_data).encode('utf-8')
            update_req = urllib.request.Request(update_url, data=req_data, headers=update_headers, method='PATCH')
            
            with urllib.request.urlopen(update_req, timeout=30) as update_response:
                result = update_response.read().decode('utf-8')
                print("✅ 更新成功!")
                print(f"📄 响应: {result}")
        else:
            # 插入新记录
            print("📝 创建新记录...")
            insert_url = f"{supabase_url}/rest/v1/profiles"
            insert_headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            
            req_data = json.dumps(update_data).encode('utf-8')
            insert_req = urllib.request.Request(insert_url, data=req_data, headers=insert_headers, method='POST')
            
            with urllib.request.urlopen(insert_req, timeout=30) as insert_response:
                result = insert_response.read().decode('utf-8')
                print("✅ 创建成功!")
                print(f"📄 响应: {result}")
                
except urllib.error.HTTPError as e:
    error_body = e.read().decode('utf-8')
    print(f"❌ 更新失败: HTTP {e.code}")
    print(f"📄 错误: {error_body}")
    sys.exit(1)
    
except Exception as e:
    print(f"❌ 更新失败: {e}")
    sys.exit(1)

# 保存本地备份
output_file = f"{workspace}/output/profile_synced.json"
import os
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(update_data, f, ensure_ascii=False, indent=2)

print(f"\n💾 本地备份: {output_file}")
print(f"🕐 更新时间: {update_data['updated_at']}")
print("\n✅ 同步完成!")
EOF

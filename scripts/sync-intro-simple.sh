#!/bin/bash
# sync-intro-simple.sh - 简化版个人介绍同步脚本

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

# 读取 profile.json 中的基本信息
NAME=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])" 2>/dev/null || echo "安鼎禹")
TITLE=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])" 2>/dev/null || echo "Web前端开发工程师")
QUOTE=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['quote'])" 2>/dev/null || echo "")
AVATAR=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['avatar'])" 2>/dev/null || echo "")
ABOUT=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['about'])" 2>/dev/null || echo "")
LOCATION=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['contact']['location'])" 2>/dev/null || echo "")
EMAIL=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['contact']['email'])" 2>/dev/null || echo "")
PHONE=$(cat "$DATA_DIR/profile.json" | python3 -c "import sys,json; print(json.load(sys.stdin)['contact']['phone'])" 2>/dev/null || echo "")

# 构建简洁的个人介绍 JSON
JSON_DATA=$(cat << EOF
{
    "id": "personal-intro",
    "name": "$NAME",
    "title": "$TITLE",
    "quote": "$QUOTE",
    "avatar": "$AVATAR",
    "about": "$ABOUT",
    "contact": {
        "location": "$LOCATION",
        "email": "$EMAIL",
        "phone": "$PHONE"
    },
    "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "📝 个人介绍数据:"
echo "$JSON_DATA" | python3 -m json.tool

echo ""
echo "🔄 正在同步到 Supabase..."

# 尝试插入数据
RESPONSE=$(curl -s -X POST "$SUPABASE_URL/rest/v1/personal_intro" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY" \
    -H "Content-Type: application/json" \
    -d "$JSON_DATA" 2>&1)

echo "📡 服务器响应:"
echo "$RESPONSE"

# 保存本地备份
mkdir -p "$WORKSPACE/output"
echo "$JSON_DATA" > "$WORKSPACE/output/personal_intro_simple.json"
echo ""
echo "💾 本地备份已保存"

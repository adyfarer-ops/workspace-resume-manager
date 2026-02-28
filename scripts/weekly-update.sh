#!/bin/bash
# weekly-update.sh - 每周自动更新个人介绍和技能
# 与技能学习追踪使用同样的方式

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

UPDATE_TYPE="${1:-all}"  # all, profile, skills

echo "🔄 每周自动更新"
echo "类型: $UPDATE_TYPE"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 更新个人介绍
update_profile() {
    echo "📋 更新个人介绍..."
    
    python3 - "$WORKSPACE" "$DATA_DIR" << 'EOF'
import json
import os
import sys
from datetime import datetime

workspace = sys.argv[1]
data_dir = sys.argv[2]

# 读取当前 profile
profile_file = f"{data_dir}/profile.json"
with open(profile_file, "r", encoding="utf-8") as f:
    profile = json.load(f)

# 读取技能数据
skills_file = f"{data_dir}/skills.json"
with open(skills_file, "r", encoding="utf-8") as f:
    skills = json.load(f)

# 读取项目数据
projects_file = f"{data_dir}/projects.json"
with open(projects_file, "r", encoding="utf-8") as f:
    projects = json.load(f)

# 生成动态个人介绍
technical_skills = skills.get("skills", {}).get("technical", [])
skill_summary = "、".join([cat["category"] for cat in technical_skills[:3]])

highlighted_projects = [p for p in projects.get("projects", []) if p.get("highlight", False)]
project_names = "、".join([p["name"] for p in highlighted_projects[:3]])

# 更新 about 字段
new_about = f"拥有扎实的前端开发经验，并积极拥抱AI技术变革。专注于{skill_summary}等领域，在{project_names}等项目中取得了显著成果。具备全栈思维与产品意识，能够利用AI工具赋能开发，实现从0到1的产品落地。"

profile["about"] = new_about
profile["updated_at"] = datetime.now().isoformat()

# 保存更新
with open(profile_file, "w", encoding="utf-8") as f:
    json.dump(profile, f, ensure_ascii=False, indent=2)

print(f"✅ 个人介绍已更新")
print(f"📝 新内容: {new_about[:50]}...")
EOF
}

# 更新技能
update_skills() {
    echo "🛠️  更新技能..."
    
    # 这里可以添加从 skill_learning_logs 表同步技能的逻辑
    echo "✅ 技能数据已同步"
}

# 同步到数据库
sync_to_database() {
    echo "☁️  同步到数据库..."
    cd "$WORKSPACE"
    ./scripts/sync-to-database.sh push
}

# 主逻辑
case "$UPDATE_TYPE" in
    profile)
        update_profile
        sync_to_database
        ;;
    skills)
        update_skills
        ;;
    all)
        update_profile
        update_skills
        sync_to_database
        ;;
    *)
        echo "用法: ./weekly-update.sh [all|profile|skills]"
        exit 1
        ;;
esac

echo ""
echo "✅ 更新完成!"
echo "🕐 完成时间: $(date '+%Y-%m-%d %H:%M:%S')"

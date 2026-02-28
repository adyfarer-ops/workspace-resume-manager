#!/bin/bash
# sync-intro-to-db.sh - 将个人介绍同步到 Supabase 数据库
# 岁时记 - 实时个人介绍同步脚本

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w"

# 读取所有简历数据
PROFILE=$(cat "$DATA_DIR/profile.json")
SKILLS=$(cat "$DATA_DIR/skills.json")
EXPERIENCE=$(cat "$DATA_DIR/experience.json")
PROJECTS=$(cat "$DATA_DIR/projects.json")

# 构建个人介绍 JSON 数据
build_intro_json() {
    local name=$(echo "$PROFILE" | jq -r '.name')
    local title=$(echo "$PROFILE" | jq -r '.title')
    local quote=$(echo "$PROFILE" | jq -r '.quote')
    local avatar=$(echo "$PROFILE" | jq -r '.avatar')
    local about=$(echo "$PROFILE" | jq -r '.about')
    local location=$(echo "$PROFILE" | jq -r '.contact.location')
    local email=$(echo "$PROFILE" | jq -r '.contact.email')
    local phone=$(echo "$PROFILE" | jq -r '.contact.phone')
    local age=$(echo "$PROFILE" | jq -r '.contact.age')
    
    # 提取技能数据
    local technical_skills=$(echo "$SKILLS" | jq -c '.skills.technical')
    local soft_skills=$(echo "$SKILLS" | jq -c '.skills.soft')
    local languages=$(echo "$SKILLS" | jq -c '.skills.languages')
    local tools=$(echo "$SKILLS" | jq -c '.skills.tools')
    
    # 提取工作经历
    local experiences=$(echo "$EXPERIENCE" | jq -c '.experiences')
    
    # 提取精选项目
    local featured_projects=$(echo "$PROJECTS" | jq -c '[.projects[] | select(.highlight == true)]')
    
    # 构建完整 JSON
    jq -n \
        --arg name "$name" \
        --arg title "$title" \
        --arg quote "$quote" \
        --arg avatar "$avatar" \
        --arg about "$about" \
        --arg location "$location" \
        --arg email "$email" \
        --arg phone "$phone" \
        --argjson age "$age" \
        --argjson technical_skills "$technical_skills" \
        --argjson soft_skills "$soft_skills" \
        --argjson languages "$languages" \
        --argjson tools "$tools" \
        --argjson experiences "$experiences" \
        --argjson featured_projects "$featured_projects" \
        '{
            id: "personal-intro",
            name: $name,
            title: $title,
            quote: $quote,
            avatar: $avatar,
            about: $about,
            contact: {
                age: $age,
                location: $location,
                email: $email,
                phone: $phone
            },
            skills: {
                technical: $technical_skills,
                soft: $soft_skills,
                languages: $languages,
                tools: $tools
            },
            experiences: $experiences,
            featured_projects: $featured_projects,
            updated_at: now | todate
        }'
}

# 同步到 Supabase
sync_to_supabase() {
    local json_data=$1
    
    echo "🔄 正在同步个人介绍到 Supabase..."
    
    # 使用 UPSERT 操作（插入或更新）
    local response=$(curl -s -X POST "$SUPABASE_URL/rest/v1/personal_intro" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d "$json_data")
    
    if [ $? -eq 0 ]; then
        echo "✅ 同步成功！"
        echo "📊 数据预览:"
        echo "$json_data" | jq '{
            name: .name,
            title: .title,
            updated_at: .updated_at,
            skills_count: (.skills.technical | length),
            experiences_count: (.experiences | length),
            projects_count: (.featured_projects | length)
        }'
        return 0
    else
        echo "❌ 同步失败: $response"
        return 1
    fi
}

# 主流程
main() {
    echo "📝 正在构建个人介绍数据..."
    
    # 构建 JSON 数据
    INTRO_JSON=$(build_intro_json)
    
    # 保存到本地备份
    mkdir -p "$WORKSPACE/output"
    echo "$INTRO_JSON" > "$WORKSPACE/output/personal_intro.json"
    echo "💾 本地备份已保存: output/personal_intro.json"
    
    # 同步到 Supabase
    sync_to_supabase "$INTRO_JSON"
    
    echo ""
    echo "🔗 访问链接:"
    echo "   数据 API: $SUPABASE_URL/rest/v1/personal_intro?id=eq.personal-intro"
}

# 执行
main

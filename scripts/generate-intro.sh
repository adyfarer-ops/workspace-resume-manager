#!/bin/bash
# generate-intro.sh - 生成个人介绍卡片
# 岁时记 - 实时更新的个人介绍

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
OUTPUT_DIR="$WORKSPACE/output"

# 确保输出目录存在
mkdir -p "$OUTPUT_DIR"

# 读取简历数据
PROFILE=$(cat "$DATA_DIR/profile.json")
SKILLS=$(cat "$DATA_DIR/skills.json")
EXPERIENCE=$(cat "$DATA_DIR/experience.json")
PROJECTS=$(cat "$DATA_DIR/projects.json")

# 提取关键信息
NAME=$(echo "$PROFILE" | jq -r '.name')
TITLE=$(echo "$PROFILE" | jq -r '.title')
QUOTE=$(echo "$PROFILE" | jq -r '.quote')
ABOUT=$(echo "$PROFILE" | jq -r '.about')
LOCATION=$(echo "$PROFILE" | jq -r '.contact.location')
EMAIL=$(echo "$PROFILE" | jq -r '.contact.email')
PHONE=$(echo "$PROFILE" | jq -r '.contact.phone')

# 生成个人介绍文本
 generate_intro_text() {
    cat << EOF
╔══════════════════════════════════════════════════════════════╗
║                    👤 个人介绍                                ║
╠══════════════════════════════════════════════════════════════╣
                                                                
  🎯 $NAME | $TITLE
                                                                
  💭 "$QUOTE"
                                                                
  📍 $LOCATION  📧 $EMAIL  📱 $PHONE
                                                                
  📝 关于我:
  $ABOUT
                                                                
  🛠️ 核心技能:
EOF

    # 添加技能列表
    echo "$SKILLS" | jq -r '.skills.technical[] | "    • " + .category + ": " + (.items | join(", "))'
    
    echo ""
    echo "  💼 工作经历:"
    echo "$EXPERIENCE" | jq -r '.experiences[] | "    • " + .company + " | " + .position + " (" + .period + ")"'
    
    echo ""
    echo "  🚀 精选项目:"
    echo "$PROJECTS" | jq -r '.projects[] | select(.highlight == true) | "    • " + .name + " - " + .description[:50] + "..."'
    
    cat << EOF
                                                                
╚══════════════════════════════════════════════════════════════╝

📅 更新时间: $(date '+%Y-%m-%d %H:%M:%S')
🤖 由 简历助手 自动生成
EOF
}

# 生成个人介绍
INTRO_TEXT=$(generate_intro_text)

# 保存到文件
OUTPUT_FILE="$OUTPUT_DIR/intro_$(date +%Y%m%d_%H%M%S).txt"
echo "$INTRO_TEXT" > "$OUTPUT_FILE"

# 同时更新最新版本
LATEST_FILE="$OUTPUT_DIR/latest_intro.txt"
echo "$INTRO_TEXT" > "$LATEST_FILE"

echo "✅ 个人介绍已生成: $OUTPUT_FILE"
echo "📄 最新版本: $LATEST_FILE"

# 输出生成的内容
echo "$INTRO_TEXT"

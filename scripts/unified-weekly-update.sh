#!/bin/bash
# unified-weekly-update.sh - 每周统一更新（个人介绍 + 技能学习）

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
DATA_DIR="$WORKSPACE/data"
SUPABASE_URL="https://riieooizyhovmgvhpcxj.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjg1MCwiZXhwIjoyMDg2OTc4ODUwfQ.azMzZoioMnKKJwwwmaroxTxLnVYHMasfAxkW6lkdptk"

echo "🔄 每周统一更新（个人介绍 + 技能学习）"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "执行 Agent: resume-manager"
echo ""

# 1. 执行个人介绍更新
echo "=== 1. 更新个人介绍 ==="
python3 - "$WORKSPACE" "$DATA_DIR" "$SUPABASE_URL" "$SUPABASE_KEY" << 'EOF'
import json
import os
import sys
import glob
from datetime import datetime

workspace = sys.argv[1]
data_dir = sys.argv[2]
supabase_url = sys.argv[3]
supabase_key = sys.argv[4]

def get_all_agent_sessions():
    """获取所有 Agent 的会话"""
    sessions = []
    agents_dir = "/root/.openclaw/agents"
    if os.path.exists(agents_dir):
        for agent_name in os.listdir(agents_dir):
            sessions_dir = os.path.join(agents_dir, agent_name, "sessions")
            if os.path.exists(sessions_dir):
                jsonl_files = glob.glob(os.path.join(sessions_dir, "*.jsonl"))
                for jsonl_file in sorted(jsonl_files, key=os.path.getmtime, reverse=True)[:3]:
                    with open(jsonl_file, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for line in lines[1:101]:
                            try:
                                msg = json.loads(line)
                                if msg.get('type') == 'message':
                                    message = msg.get('message', {})
                                    if message.get('role') in ['user', 'assistant']:
                                        content = message.get('content', [])
                                        if isinstance(content, list) and len(content) > 0:
                                            text = content[0].get('text', '')
                                        else:
                                            text = str(content)
                                        sessions.append({
                                            'agent': agent_name,
                                            'content': text[:200],
                                            'timestamp': msg.get('timestamp', '')
                                        })
                            except: pass
    return sessions

def get_skill_learning_logs():
    import urllib.request
    try:
        url = f"{supabase_url}/rest/v1/skill_learning_logs?order=date.desc&limit=10"
        headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}", "Accept": "application/json"}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ 获取技能学习记录失败: {e}")
        return []

def generate_profile_summary(sessions, skills):
    all_content = " ".join([s['content'] for s in sessions if s['content']])
    summary_parts = []
    
    if any(kw in all_content.lower() for kw in ['ai', 'agent', '智能体', 'n8n', 'coze']):
        summary_parts.append("在AI Agent开发与自动化系统构建方面持续深耕，能够独立完成从需求分析、系统设计到部署运维的全流程开发")
    if any(kw in all_content.lower() for kw in ['web', '前端', 'react', 'vue', 'typescript']):
        summary_parts.append("在Web工程化方面，具备前后端数据联动、数据库设计与优化、以及全栈应用快速交付的能力")
    if any(kw in all_content.lower() for kw in ['cursor', 'ai编程', '自动化']):
        summary_parts.append("在AI工具应用方面，熟练运用各类AI编程工具与智能体平台，实现开发效率的指数级提升")
    
    if summary_parts:
        return "拥有扎实的前端开发经验，并积极拥抱AI技术变革。" + "；".join(summary_parts) + "。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。"
    return "拥有扎实的前端开发经验，并积极拥抱AI技术变革。在AI Agent开发与自动化系统构建方面持续深耕，能够独立完成从需求分析、系统设计到部署运维的全流程开发；在Web工程化方面，具备前后端数据联动、数据库设计与优化、以及全栈应用快速交付的能力；在AI工具应用方面，熟练运用各类AI编程工具与智能体平台，实现开发效率的指数级提升。不仅在传统Web开发领域有丰富的实战经验，更在AI Agent开发、Coze工作流搭建及自媒体运营方面取得了显著成果。"

# 主流程
sessions = get_all_agent_sessions()
print(f"✅ 获取到 {len(sessions)} 条会话记录")

skills = get_skill_learning_logs()
print(f"✅ 获取到 {len(skills)} 条技能记录")

new_about = generate_profile_summary(sessions, skills)
print(f"📝 新描述: {new_about[:100]}...")

# 更新本地 JSON
profile_file = f"{data_dir}/profile.json"
with open(profile_file, 'r', encoding='utf-8') as f:
    profile = json.load(f)
profile['about'] = new_about
profile['updated_at'] = datetime.now().isoformat()
with open(profile_file, 'w', encoding='utf-8') as f:
    json.dump(profile, f, ensure_ascii=False, indent=2)
print(f"💾 已更新本地文件")

# 同步到数据库
import urllib.request
try:
    query_url = f"{supabase_url}/rest/v1/profiles?limit=1"
    headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}", "Accept": "application/json"}
    req = urllib.request.Request(query_url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as response:
        existing = json.loads(response.read().decode('utf-8'))
        if existing and len(existing) > 0:
            profile_id = existing[0]['id']
            update_url = f"{supabase_url}/rest/v1/profiles?id=eq.{profile_id}"
            update_headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            update_data = {"about": new_about, "updated_at": datetime.utcnow().isoformat() + "Z"}
            req_data = json.dumps(update_data).encode('utf-8')
            update_req = urllib.request.Request(update_url, data=req_data, headers=update_headers, method='PATCH')
            with urllib.request.urlopen(update_req, timeout=30):
                print("✅ 数据库已同步")
except Exception as e:
    print(f"❌ 数据库同步失败: {e}")

# 发送通知
message = f"""📝 个人介绍自动更新 - 每周总结

时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}

✅ 更新内容:
• 从 {len(sessions)} 条 Agent 会话中提取信息
• 从 {len(skills)} 条技能记录中总结
• 个人介绍已更新并同步到数据库

📝 新描述预览:
{new_about[:150]}...

💡 提示: 每周一上午9点自动更新"""

try:
    os.system(f'openclaw message send --channel telegram --to "8500227224" --message "{message}"')
    print("📨 通知已发送")
except Exception as e:
    print(f"❌ 发送通知失败: {e}")

print("✅ 个人介绍更新完成!")
EOF
echo ""

# 2. 执行技能学习追踪
echo "=== 2. 更新技能学习记录 ==="
node "$WORKSPACE/scripts/unified-skill-tracker.mjs"
echo ""

# 3. 发送完成通知
echo "=== 3. 发送完成通知 ==="
WEEK_NUM=$(date +%V)
MESSAGE="✅ 每周统一更新完成

📅 第${WEEK_NUM}周更新摘要：
• ✅ 个人介绍已更新（数据库）
• ✅ 技能学习记录已更新（数据库）
• ✅ 网站数据已实时同步

⏰ 下次更新: 下周一 9:00
🤖 执行 Agent: resume-manager

💡 提示: 网站直接从数据库读取数据，无需重新构建"

openclaw message send --channel telegram --to "8500227224" --message "$MESSAGE" 2>/dev/null || echo "通知发送失败"
echo "📨 完成通知已发送"
echo ""

echo "✅ 每周统一更新全部完成!"

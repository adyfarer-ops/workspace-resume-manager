#!/bin/bash
# 技能学习追踪 - 每日0点执行
# 这个脚本由系统 cron 调用，然后触发 OpenClaw 会话获取对话并总结

cd /root/clawd/downloads/my_project

# 获取昨天的日期
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

echo "========================================="
echo "📅 技能学习追踪 - $YESTERDAY"
echo "========================================="
echo ""
echo "请手动运行以下 OpenClaw 命令来总结昨日技能："
echo ""
echo "1. 使用 sessions_list 获取昨日会话"
echo "2. 使用 sessions_history 获取对话内容"
echo "3. 总结技能并调用 API: curl -X POST https://yfarer.cn/skill-api/api/track-skills"
echo ""
echo "或者等待 OpenClaw 定时任务自动执行..."

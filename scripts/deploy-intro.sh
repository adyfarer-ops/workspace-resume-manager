#!/bin/bash
# deploy-intro.sh - 部署实时个人介绍系统
# 模仿 qqBot 实现方式

set -e

WORKSPACE="/root/.openclaw/workspace-resume-manager"
PUBLIC_DIR="$WORKSPACE/public"
API_DIR="$PUBLIC_DIR/api"

echo "🚀 开始部署实时个人介绍系统..."
echo ""

# 1. 确保目录结构
echo "📁 创建目录结构..."
mkdir -p "$API_DIR"

# 2. 同步数据到 API
echo "🔄 同步数据到 API 目录..."
if [ -f "$WORKSPACE/output/personal_intro.json" ]; then
    cp "$WORKSPACE/output/personal_intro.json" "$API_DIR/profile.json"
    echo "✅ 数据已同步到: $API_DIR/profile.json"
else
    echo "⚠️ 未找到 personal_intro.json，运行同步脚本..."
    cd "$WORKSPACE" && ./scripts/sync-profile-to-db.sh
    cp "$WORKSPACE/output/personal_intro.json" "$API_DIR/profile.json"
fi

# 3. 验证文件
echo ""
echo "📋 验证文件..."
if [ -f "$PUBLIC_DIR/intro.html" ]; then
    echo "✅ intro.html 存在"
else
    echo "❌ intro.html 不存在"
    exit 1
fi

if [ -f "$API_DIR/profile.json" ]; then
    echo "✅ api/profile.json 存在"
    echo "📊 文件大小: $(du -h $API_DIR/profile.json | cut -f1)"
else
    echo "❌ api/profile.json 不存在"
    exit 1
fi

# 4. 显示访问信息
echo ""
echo "🌐 部署完成！"
echo ""
echo "访问方式:"
echo "  1. 本地文件: file://$PUBLIC_DIR/intro.html"
echo "  2. 本地服务器: http://localhost:8080/intro.html (需要启动服务器)"
echo ""
echo "API 端点:"
echo "  - 完整数据: file://$API_DIR/profile.json"
echo ""
echo "📖 使用说明:"
echo "  1. 直接打开 intro.html 即可查看个人介绍"
echo "  2. 页面会自动从 api/profile.json 获取数据"
echo "  3. 更新数据后重新运行此脚本即可"
echo ""
echo "🔄 更新数据:"
echo "  ./scripts/sync-profile-to-db.sh  # 同步最新数据"
echo "  ./scripts/deploy-intro.sh        # 重新部署"

#!/bin/bash

# 岁时记简历网站部署脚本
# 同时启动前端静态服务和API服务

echo "=== 岁时记简历网站部署 ==="

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 工作目录
WORK_DIR="/root/.openclaw/workspace-resume-manager"
PROJECT_DIR="$WORK_DIR/project"

echo -e "${BLUE}[1/4]${NC} 检查构建文件..."
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "错误：构建文件不存在，请先运行 npm run build"
    exit 1
fi
echo -e "${GREEN}✓${NC} 构建文件已就绪"

echo -e "${BLUE}[2/4]${NC} 检查API服务..."
API_PID=$(pgrep -f "resume-api.js" || true)
if [ -n "$API_PID" ]; then
    echo -e "${GREEN}✓${NC} API服务已在运行 (PID: $API_PID)"
else
    echo "启动API服务..."
    cd "$WORK_DIR" && node resume-api.js &
    sleep 2
    echo -e "${GREEN}✓${NC} API服务已启动"
fi

echo -e "${BLUE}[3/4]${NC} 启动前端静态服务..."
# 使用Python http.server或Node的serve
if command -v python3 &> /dev/null; then
    cd "$PROJECT_DIR/dist" && python3 -m http.server 8080 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓${NC} 前端服务已启动 (PID: $FRONTEND_PID, Port: 8080)"
elif command -v npx &> /dev/null; then
    cd "$PROJECT_DIR/dist" && npx serve -l 8080 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓${NC} 前端服务已启动 (PID: $FRONTEND_PID, Port: 8080)"
fi

echo ""
echo -e "${BLUE}[4/4]${NC} 部署完成！"
echo ""
echo "==================================="
echo -e "${GREEN}服务访问地址：${NC}"
echo ""
echo "  前端网站：   http://localhost:8080"
echo "  API服务：    http://localhost:3003"
echo ""
echo "  API端点："
echo "    - GET /api/resume              - 查看简历HTML"
echo "    - GET /api/resume/download/pdf - 下载简历PDF"
echo ""
echo "==================================="
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo ''; echo '正在停止服务...'; kill $FRONTEND_PID 2>/dev/null; exit 0" INT
wait

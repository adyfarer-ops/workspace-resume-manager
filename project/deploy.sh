#!/bin/bash
# deploy.sh - 部署脚本，自动处理版本号

PROJECT_DIR="/root/.openclaw/workspace-resume-manager/project"
DEPLOY_DIR="/ady"

# 构建
cd $PROJECT_DIR
rm -rf dist
npm run build

# 获取新的 JS 文件名
NEW_JS=$(ls dist/assets/*.js | xargs basename)

# 复制到部署目录
cp -r dist/* $DEPLOY_DIR/

# 在 HTML 中添加版本号，强制浏览器刷新
sed -i "s|/ady/assets/$NEW_JS|/ady/assets/$NEW_JS?v=$(date +%s)|g" $DEPLOY_DIR/index.html

# 重载 Nginx
nginx -s reload

echo "✅ 部署完成: $NEW_JS?v=$(date +%s)"

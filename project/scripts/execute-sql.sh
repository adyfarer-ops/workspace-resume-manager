#!/bin/bash

# Supabase SQL 执行脚本
# 需要先在环境变量中设置 SUPABASE_ACCESS_TOKEN

SUPABASE_PROJECT_REF="riieooizyhovmgvhpcxj"
SQL_FILE="$1"

if [ -z "$SQL_FILE" ]; then
  echo "用法: ./execute-sql.sh <sql-file-path>"
  echo "示例: ./execute-sql.sh ./scripts/create-tables.sql"
  exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
  echo "错误: 文件不存在: $SQL_FILE"
  exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "错误: 请设置 SUPABASE_ACCESS_TOKEN 环境变量"
  echo "获取方式:"
  echo "1. 访问 https://supabase.com/dashboard/account/tokens"
  echo "2. 生成新的访问令牌"
  echo "3. 设置环境变量: export SUPABASE_ACCESS_TOKEN=your_token"
  exit 1
fi

echo "正在执行 SQL 文件: $SQL_FILE"
echo "项目: $SUPABASE_PROJECT_REF"
echo ""

# 使用 Supabase Management API 执行 SQL
curl -X POST "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @<(cat "$SQL_FILE" | jq -Rs '{query: .}')

echo ""
echo "执行完成"

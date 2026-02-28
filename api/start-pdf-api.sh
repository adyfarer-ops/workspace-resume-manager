#!/bin/bash

# 简历PDF API服务启动脚本

API_DIR="/root/.openclaw/workspace-resume-manager/api"
PID_FILE="/tmp/resume-pdf-api.pid"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "API服务已在运行 (PID: $(cat $PID_FILE))"
      exit 0
    fi
    
    echo "启动简历PDF API服务..."
    cd "$API_DIR"
    nohup node pdf-server.js > /tmp/resume-pdf-api.log 2>&1 &
    echo $! > "$PID_FILE"
    echo "API服务已启动 (PID: $(cat $PID_FILE))"
    echo "日志: /tmp/resume-pdf-api.log"
    ;;
    
  stop)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if kill -0 "$PID" 2>/dev/null; then
        echo "停止API服务 (PID: $PID)..."
        kill "$PID"
        rm -f "$PID_FILE"
        echo "API服务已停止"
      else
        echo "API服务未运行"
        rm -f "$PID_FILE"
      fi
    else
      echo "API服务未运行"
    fi
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "API服务运行中 (PID: $(cat $PID_FILE))"
    else
      echo "API服务未运行"
    fi
    ;;
    
  *)
    echo "用法: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

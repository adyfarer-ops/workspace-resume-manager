# OMC Project Configuration for resume-manager
# 项目级配置 - 仅在此项目生效

## 项目特点
- React + TypeScript 前端
- Node.js 后端
- 简历生成和管理系统

## Team 模式配置
maxAgents: 3
defaultAgentType: executor

## 阶段路由优化
- team-plan: explore + planner (分析简历数据结构)
- team-exec: designer + executor (UI实现 + 功能开发)
- team-verify: qa-tester + verifier (测试生成和验证)

## 专用智能体
- designer: 负责简历模板和UI设计
- executor: 负责API和功能实现
- writer: 负责文档和说明

## 常用命令
/team 2:designer "implement new resume template"
/team 2:executor "add PDF export feature"
autopilot: build complete resume editor

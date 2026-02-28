# 统一更新系统 - 最终版

## 数据库表结构

### 1. skill_learning_logs（技能学习记录）
```sql
- id: UUID PRIMARY KEY
- date: DATE
- content: TEXT
- extracted_skills: TEXT[]
- related_skill_category: TEXT
- confidence_score: INTEGER
- created_at: TIMESTAMP
```

### 2. profiles（个人介绍）
```sql
- id: UUID PRIMARY KEY
- name: TEXT
- title: TEXT
- quote: TEXT
- avatar: TEXT
- about: TEXT              -- 个人介绍内容
- age: INTEGER
- location: TEXT
- phone: TEXT
- email: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## 统一更新方式

### 定时任务（每周一 09:00）

| 任务 | 数据库表 | 功能 |
|------|---------|------|
| 技能学习追踪-每周总结 | `skill_learning_logs` | 分析 Agent 会话 → 提取技能 → 插入记录 |
| 个人介绍自动更新-每周总结 | `profiles` | 分析 Agent 会话 → 生成 about → 更新记录 |

### 同步脚本

```bash
# 同步技能到 skill_learning_logs
# 由 AI 定时任务自动执行

# 同步个人介绍到 profiles
./scripts/sync-profile-to-db.sh
```

## 工作流程

```
每周一 09:00
    ↓
定时任务触发
    ↓
分析上周 Agent 会话
    ↓
生成总结
    ↓
┌─────────────┬─────────────┐
↓             ↓             ↓
skill_learning   profiles     发送报告
    ↓             ↓
  插入记录      更新 about
```

## 数据验证

刚刚已成功同步个人介绍到 profiles 表：
- ✅ 记录 ID: 72040d07-d560-440c-b3b0-796ec45ca916
- ✅ 姓名: 安鼎禹
- ✅ 职位: Web前端开发工程师 / AI智能体开发 / AI编程
- ✅ about: 已更新为动态生成内容
- ✅ 更新时间: 2026-02-24T11:42:36Z

## 状态

- [x] skill_learning_logs 表（已存在）
- [x] profiles 表（已存在）
- [x] 个人介绍同步脚本（已测试成功）
- [x] 定时任务配置（已更新）

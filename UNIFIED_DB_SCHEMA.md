# 统一数据库表结构

## 概述

技能学习记录和个人介绍更新使用**同样的表结构模式**，分别存储在不同的表中。

## 表结构对比

### 1. skill_learning_logs（技能学习记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| date | DATE | 学习日期 |
| content | TEXT | 学习内容摘要 |
| extracted_skills | TEXT[] | 提取的技能列表 |
| related_skill_category | TEXT | 相关技能分类 |
| confidence_score | INTEGER | 置信度 (0-100) |
| created_at | TIMESTAMP | 创建时间 |

### 2. personal_intro_logs（个人介绍记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| date | DATE | 更新日期 |
| content | TEXT | 工作/学习内容摘要 |
| generated_intro | TEXT | 生成的个人介绍文本 |
| related_projects | TEXT[] | 相关项目 |
| related_skills | TEXT[] | 相关技能 |
| confidence_score | INTEGER | 置信度 (0-100) |
| created_at | TIMESTAMP | 创建时间 |

## 统一特点

1. **同样的字段结构**
   - 都有 `id`, `date`, `content`, `confidence_score`, `created_at`
   - 都有数组字段存储相关数据（skills/projects）

2. **同样的更新方式**
   - 每周一 09:00 定时执行
   - AI 分析 Agent 会话历史
   - 自动生成内容
   - 插入到数据库

3. **同样的查询方式**
   ```sql
   -- 查询技能学习记录
   SELECT * FROM skill_learning_logs 
   WHERE date >= '2026-02-01' 
   ORDER BY date DESC;
   
   -- 查询个人介绍记录
   SELECT * FROM personal_intro_logs 
   WHERE date >= '2026-02-01' 
   ORDER BY date DESC;
   ```

## SQL 创建脚本

### skill_learning_logs（已存在）
```sql
CREATE TABLE skill_learning_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    content TEXT NOT NULL,
    extracted_skills TEXT[],
    related_skill_category TEXT,
    confidence_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### personal_intro_logs（需要创建）
```sql
CREATE TABLE personal_intro_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    content TEXT NOT NULL,
    generated_intro TEXT NOT NULL,
    related_projects TEXT[],
    related_skills TEXT[],
    confidence_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 使用方式

### 手动执行
```bash
# 更新技能
./scripts/unified-weekly-update.sh skills

# 更新个人介绍
./scripts/unified-weekly-update.sh intro

# 全部更新
./scripts/unified-weekly-update.sh all
```

### 定时任务
- **技能学习追踪**: 每周一 09:00 → 更新 `skill_learning_logs`
- **个人介绍更新**: 每周一 09:00 → 更新 `personal_intro_logs`

## 数据流向

```
Agent 会话历史
    ↓
AI 分析总结
    ↓
┌─────────────┬─────────────┐
↓             ↓             ↓
skill_learning  personal_intro  发送报告
    ↓             ↓
  数据表        数据表
```

## 状态

- [x] skill_learning_logs 表（已存在）
- [ ] personal_intro_logs 表（待创建）
- [x] 统一更新脚本
- [x] 定时任务配置

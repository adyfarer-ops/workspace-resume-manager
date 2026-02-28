# 实时个人介绍系统 - 模仿 qqBot 实现

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      数据源 (Data Source)                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ profile.json │ │  skills.json │ │ projects.json│        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    同步脚本 (Sync Script)                    │
│              scripts/sync-profile-to-db.sh                  │
│                    Python 数据处理                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   数据库 (Supabase)                          │
│              Table: personal_intro                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  id, name, title, quote, avatar, about, contact,    │  │
│  │  social, skills, experiences, projects, updated_at  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│   网页展示       │ │   API 接口   │ │   Feishu Bot │
│  intro.html     │ │  REST API    │ │   定时发送   │
│  实时获取数据    │ │  /rest/v1/   │ │   个人介绍   │
└─────────────────┘ └──────────────┘ └──────────────┘
```

## 数据流

1. **数据更新** → 修改 `data/*.json` 文件
2. **执行同步** → 运行 `sync-profile-to-db.sh`
3. **数据入库** → 更新 Supabase `personal_intro` 表
4. **实时获取** → 网页/API/Bot 从数据库获取最新数据

## 与 qqBot 的对比

| 功能 | qqBot 实现 | 本系统实现 |
|------|-----------|-----------|
| 数据存储 | Supabase 数据库 | ✅ Supabase 数据库 |
| 同步脚本 | Shell + Python | ✅ Shell + Python |
| API 接口 | REST API | ✅ REST API |
| 网页展示 | HTML + JS | ✅ HTML + Tailwind + JS |
| 定时更新 | Cron 任务 | ✅ Cron 任务 |
| Bot 发送 | QQ Bot | ✅ Feishu Bot |

## 使用方式

### 1. 手动同步
```bash
./scripts/sync-profile-to-db.sh
```

### 2. 定时自动同步
```bash
openclaw cron add \
  --name "同步个人介绍到数据库" \
  --cron "0 */6 * * *" \
  --tz "Asia/Shanghai" \
  --message "cd /root/.openclaw/workspace-resume-manager && ./scripts/sync-profile-to-db.sh" \
  --deliver
```

### 3. API 访问
```bash
curl -s "https://riieooizyhovmgvhpcxj.supabase.co/rest/v1/personal_intro?id=eq.personal-intro" \
  -H "apikey: YOUR_API_KEY"
```

### 4. 网页访问
打开 `public/intro.html` 或部署后的 URL

## 待完成

- [ ] 在 Supabase 创建 `personal_intro` 表
- [ ] 配置 API 权限（允许匿名读取）
- [ ] 部署网页到服务器
- [ ] 设置定时同步任务

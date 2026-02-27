#!/usr/bin/env node
/**
 * 统一技能学习追踪脚本
 * 每周一运行，总结所有 Agent 的会话，提取技能
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || 'https://riieooizyhovmgvhpcxj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjg1MCwiZXhwIjoyMDg2OTc4ODUwfQ.azMzZoioMnKKJwwwmaroxTxLnVYHMasfAxkW6lkdptk';

const supabase = createClient(supabaseUrl, supabaseKey);

// 技能关键词映射
const skillKeywords = {
  'AI 智能体开发': ['n8n', 'dify', 'coze', 'workflow', 'prompt', 'agent', '智能体', '工作流', 'mcp', 'skills'],
  'Web 开发': ['vue', 'react', 'javascript', 'typescript', 'html', 'css', '前端', 'uni-app', 'tailwind'],
  'AI 工具使用': ['kimi', 'gpt', 'gemini', 'sora', 'claude', 'ai工具', '豆包', '即梦'],
  'AI 编程工具': ['cursor', 'trae', 'kiro', 'claude code', 'ai编程', 'antigravity'],
  '设计与媒体': ['figma', 'stitch', '剪映', '抖音', '小红书', '运营', '视频剪辑'],
  '数据库': ['supabase', 'postgresql', 'mysql', '数据库', 'redis'],
  'DevOps': ['docker', 'nginx', 'linux', '部署', '服务器', 'systemd', 'sing-box', 'vless', 'xray']
};

/**
 * 从所有 Agent 的会话中提取技能
 */
async function extractSkillsFromAllAgents() {
  const allSkills = [];
  const agentsDir = "/root/.openclaw/agents";
  
  console.log('📂 扫描所有 Agent 会话...');
  
  if (!fs.existsSync(agentsDir)) {
    console.log('⚠️  Agents 目录不存在');
    return allSkills;
  }
  
  // 获取上周一到周日的日期范围
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=周日, 1=周一
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday - 7);
  lastMonday.setHours(0, 0, 0, 0);
  
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastSunday.getDate() + 7);
  lastSunday.setHours(23, 59, 59, 999);
  
  console.log(`📅 时间范围: ${lastMonday.toISOString()} - ${lastSunday.toISOString()}`);
  
  // 遍历所有 agent
  for (const agentName of fs.readdirSync(agentsDir)) {
    const sessionsDir = path.join(agentsDir, agentName, "sessions");
    if (!fs.existsSync(sessionsDir)) continue;
    
    console.log(`\n🔍 检查 Agent: ${agentName}`);
    
    // 获取上周的会话文件
    const jsonlFiles = fs.readdirSync(sessionsDir)
      .filter(f => f.endsWith('.jsonl'))
      .map(f => ({
        name: f,
        path: path.join(sessionsDir, f),
        mtime: fs.statSync(path.join(sessionsDir, f)).mtime
      }))
      .filter(f => f.mtime >= lastMonday && f.mtime <= lastSunday)
      .sort((a, b) => b.mtime - a.mtime);
    
    console.log(`  找到 ${jsonlFiles.length} 个上周会话文件`);
    
    for (const file of jsonlFiles.slice(0, 5)) {
      const content = fs.readFileSync(file.path, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());
      
      for (const line of lines.slice(1, 201)) { // 跳过第一行元数据
        try {
          const msg = JSON.parse(line);
          if (msg.type === 'message') {
            const message = msg.message || {};
            const text = Array.isArray(message.content) 
              ? message.content.map(c => c.text || '').join(' ')
              : String(message.content || '');
            
            // 提取技能
            for (const [category, keywords] of Object.entries(skillKeywords)) {
              for (const keyword of keywords) {
                if (text.toLowerCase().includes(keyword.toLowerCase())) {
                  allSkills.push({
                    skill: keyword,
                    category: category,
                    agent: agentName,
                    timestamp: msg.timestamp || new Date().toISOString()
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    }
  }
  
  return allSkills;
}

/**
 * 更新技能到数据库
 */
async function updateSkillsToDatabase(skills) {
  if (skills.length === 0) {
    console.log('ℹ️  本周没有检测到技能学习');
    return;
  }
  
  console.log(`\n✅ 提取到 ${skills.length} 个技能`);
  
  // 去重
  const uniqueSkills = [];
  const seen = new Set();
  for (const s of skills) {
    const key = `${s.skill}-${s.category}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSkills.push(s);
    }
  }
  
  console.log(`📝 去重后: ${uniqueSkills.length} 个唯一技能`);
  
  // 按分类分组
  const skillsByCategory = {};
  for (const s of uniqueSkills) {
    if (!skillsByCategory[s.category]) {
      skillsByCategory[s.category] = [];
    }
    skillsByCategory[s.category].push(s.skill);
  }
  
  // 保存到数据库
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1);
  const dateStr = weekStart.toISOString().split('T')[0];
  
  for (const [category, skillList] of Object.entries(skillsByCategory)) {
    const { error } = await supabase
      .from('skill_learning_logs')
      .insert({
        date: dateStr,
        content: `本周从所有 Agent 会话中提取技能`,
        extracted_skills: skillList,
        related_skill_category: category,
        confidence_score: 85,
        source_agents: [...new Set(skills.filter(s => s.category === category).map(s => s.agent))]
      });
    
    if (error) {
      console.error(`❌ 保存失败 (${category}):`, error);
    } else {
      console.log(`✅ 已保存: ${category} (${skillList.length} 个技能)`);
    }
  }
  
  // 发送通知
  let message = `📚 技能学习追踪 - 第${getWeekNumber(new Date())}周\n\n`;
  message += `本周从所有 Agent 会话中提取到 ${uniqueSkills.length} 个技能:\n`;
  for (const [category, skillList] of Object.entries(skillsByCategory)) {
    message += `\n【${category}】\n`;
    skillList.forEach(skill => {
      message += `  • ${skill}\n`;
    });
  }
  
  try {
    execSync(`openclaw message send --channel telegram --to "8500227224" --message "${message}"`, {
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('❌ 发送消息失败:', e.message);
  }
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// 主函数
async function main() {
  try {
    console.log('🚀 统一技能学习追踪（所有 Agent）');
    console.log('执行 Agent: resume-manager');
    console.log('');
    
    const skills = await extractSkillsFromAllAgents();
    await updateSkillsToDatabase(skills);
    
    console.log('\n✅ 技能学习追踪完成!');
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

main();

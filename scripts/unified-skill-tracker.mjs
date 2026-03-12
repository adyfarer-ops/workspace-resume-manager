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
  'AI 编程工具': ['cursor', 'trae', 'kiro', 'claude code', 'antigravity'],
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
  
  // 获取上周+本周的日期范围（周一到周日）
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=周日, 1=周一
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // 本周一
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysSinceMonday);
  thisMonday.setHours(0, 0, 0, 0);
  
  // 上周一（两周前）
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  lastMonday.setHours(0, 0, 0, 0);
  
  // 本周日
  const thisSunday = new Date(thisMonday);
  thisSunday.setDate(thisSunday.getDate() + 6);
  thisSunday.setHours(23, 59, 59, 999);
  
  console.log(`📅 时间范围: ${lastMonday.toISOString()} - ${thisSunday.toISOString()} (上周 + 本周)`);
  
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
      .filter(f => f.mtime >= lastMonday && f.mtime <= thisSunday)
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
  
  // 获取现有分类ID映射
  const { data: categories } = await supabase.from('skill_categories').select('id, title');
  const categoryIdMap = {};
  for (const cat of categories || []) {
    categoryIdMap[cat.title] = cat.id;
  }
  
  // 获取现有技能列表
  const { data: existingSkills } = await supabase.from('skills').select('name');
  const existingSkillNames = new Set((existingSkills || []).map(s => s.name.toLowerCase()));
  
    // 过滤函数：排除与分类标题重复的技能
  const filterDuplicateSkills = (category, skills) => {
    const categoryLower = category.toLowerCase();
    return skills.filter(skill => {
      const skillLower = skill.toLowerCase();
      
      // 排除与分类标题完全相同的
      if (skillLower === categoryLower) return false;
      
      // 排除与分类名称高度相似的关键词
      const excludeList = {
        'AI 智能体开发': ['ai', '智能体', '开发', 'agent', 'skills', 'prompt', 'workflow', 'coze', '工作流'],
        'Web 开发': ['web', '开发', '前端', 'html', 'css', 'javascript'],
        'AI 工具使用': ['ai', '工具', '使用', 'kimi', 'gpt', 'claude', 'sora'],
        'AI 编程工具': ['ai', '编程', '工具', 'ai编程'],
        '设计与媒体': ['设计', '媒体', '运营', '抖音', '小红书'],
        '数据库': ['数据', '库', '数据库'],
        'DevOps': ['devops', '运维', '部署', '服务器', 'sing-box', 'vless', 'xray']
      };
      
      const excludes = excludeList[category] || [];
      if (excludes.includes(skillLower)) return false;
      
      // 排除包含分类核心词的（如"数据库"类别中的"数据库"）
      if (categoryLower.includes('数据库') && skillLower === '数据库') return false;
      if (categoryLower.includes('ai工具') && (skillLower === 'ai工具' || skillLower === 'ai')) return false;
      if (categoryLower.includes('ai智能体') && skillLower === '智能体') return false;
      if (categoryLower.includes('ai编程') && skillLower === 'ai编程') return false;
      
      return true;
    });
  };

for (const [category, skillList] of Object.entries(skillsByCategory)) {
    // 过滤掉重复的技能
    const filteredSkillList = filterDuplicateSkills(category, skillList);
    console.log(`  ${category}: ${skillList.length} -> ${filteredSkillList.length} 个技能 (过滤后)`);
    // 保存学习记录
    const { error } = await supabase
      .from('skill_learning_logs')
      .insert({
        date: dateStr,
        content: `本周从所有 Agent 会话中提取技能`,
        extracted_skills: skillList,
        related_skill_category: category,
        confidence_score: 85
      });
    
    if (error) {
      console.error(`❌ 保存失败 (${category}):`, error);
    } else {
      console.log(`✅ 已保存: ${category} (${skillList.length} 个技能)`);
    }
    
    // 同步新技能到 skills 表
    const categoryId = categoryIdMap[category];
    if (categoryId) {
      for (const skillName of skillList) {
        if (!existingSkillNames.has(skillName.toLowerCase())) {
          const { error: insertError } = await supabase.from('skills').insert({
            category_id: categoryId,
            name: skillName
          });
          if (!insertError) {
            console.log(`✅ 新增技能: ${skillName} (${category})`);
            existingSkillNames.add(skillName.toLowerCase());
          }
        }
      }
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

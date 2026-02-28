#!/usr/bin/env node
/**
 * 技能学习追踪脚本
 * 每天0点运行，总结前一天对话，提取技能
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

const supabaseUrl = process.env.SUPABASE_URL || 'https://riieooizyhovmgvhpcxj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w';

const supabase = createClient(supabaseUrl, supabaseKey);

// 技能关键词映射
const skillKeywords = {
  'AI 智能体开发': ['n8n', 'dify', 'coze', 'workflow', 'prompt', 'agent', '智能体', '工作流'],
  'Web 开发': ['vue', 'react', 'javascript', 'typescript', 'html', 'css', '前端', 'uni-app'],
  'AI 工具使用': ['kimi', 'gpt', 'gemini', 'sora', 'claude', 'ai工具'],
  'AI 编程工具': ['cursor', 'trae', 'kiro', 'claude code', 'ai编程'],
  '设计与媒体': ['figma', 'stitch', '剪映', '抖音', '小红书', '运营'],
  '数据库': ['supabase', 'postgresql', 'mysql', '数据库'],
  'DevOps': ['docker', 'nginx', 'linux', '部署', '服务器']
};

/**
 * 从对话内容中提取技能
 */
function extractSkills(content) {
  const extractedSkills = [];
  const contentLower = content.toLowerCase();
  
  for (const [category, keywords] of Object.entries(skillKeywords)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        extractedSkills.push({
          skill: keyword,
          category: category
        });
        break;
      }
    }
  }
  
  return extractedSkills;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始技能学习追踪...');
    
    // 获取昨天的日期范围
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);
    
    const dateStr = yesterday.toISOString().split('T')[0];
    
    console.log(`📅 处理日期: ${dateStr}`);
    console.log(`📅 时间范围: ${yesterday.toISOString()} - ${today.toISOString()}`);
    
    // 从数据库获取昨天的对话记录
    const { data: conversations, error } = await supabase
      .from('conversation_logs')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ 获取对话记录失败:', error);
      throw error;
    }
    
    if (!conversations || conversations.length === 0) {
      console.log('ℹ️ 昨天没有对话记录');
      
      // 发送消息告知没有记录
      const message = `📚 技能学习追踪 - ${dateStr}\n\n昨天没有对话记录，无法总结技能学习情况。`;
      try {
        execSync(`openclaw message send --channel qqbot --to "570260C6B2CA984B355D4AACAAFF5542" --message "${message}"`, {
          stdio: 'inherit'
        });
      } catch (e) {
        console.error('❌ 发送消息失败:', e.message);
      }
      return;
    }
    
    console.log(`✅ 获取到 ${conversations.length} 条对话记录`);
    
    // 合并所有对话内容
    let allContent = '';
    const projects = new Set();
    
    for (const conv of conversations) {
      allContent += conv.user_message + ' ';
      if (conv.assistant_message) {
        allContent += conv.assistant_message + ' ';
      }
      if (conv.project_name) {
        projects.add(conv.project_name);
      }
    }
    
    // 提取技能
    const extractedSkills = extractSkills(allContent);
    
    if (extractedSkills.length === 0) {
      console.log('ℹ️ 昨天没有检测到技能学习');
      
      const message = `📚 技能学习追踪 - ${dateStr}\n\n昨天有 ${conversations.length} 条对话记录，但没有检测到技能学习。`;
      try {
        execSync(`openclaw message send --channel qqbot --to "570260C6B2CA984B355D4AACAAFF5542" --message "${message}"`, {
          stdio: 'inherit'
        });
      } catch (e) {
        console.error('❌ 发送消息失败:', e.message);
      }
      return;
    }
    
    console.log(`✅ 提取到 ${extractedSkills.length} 个技能:`);
    extractedSkills.forEach(s => console.log(`  - ${s.skill} (${s.category})`));
    
    // 按分类分组
    const skillsByCategory = {};
    extractedSkills.forEach(s => {
      if (!skillsByCategory[s.category]) {
        skillsByCategory[s.category] = [];
      }
      skillsByCategory[s.category].push(s.skill);
    });
    
    // 保存到 skill_learning_logs 表
    for (const [category, skills] of Object.entries(skillsByCategory)) {
      const { error: insertError } = await supabase
        .from('skill_learning_logs')
        .insert({
          date: dateStr,
          content: `昨天有 ${conversations.length} 条对话记录`,
          extracted_skills: skills,
          related_skill_category: category,
          confidence_score: 80
        });
      
      if (insertError) {
        console.error(`❌ 保存失败 (${category}):`, insertError);
      } else {
        console.log(`✅ 已保存: ${category}`);
      }
    }
    
    // 构建发送消息
    let message = `📚 技能学习追踪 - ${dateStr}\n\n`;
    message += `昨天共有 ${conversations.length} 条对话记录\n\n`;
    
    if (projects.size > 0) {
      message += `涉及项目: ${Array.from(projects).join(', ')}\n\n`;
    }
    
    message += `学习到 ${extractedSkills.length} 个技能:\n`;
    for (const [category, skills] of Object.entries(skillsByCategory)) {
      message += `\n【${category}】\n`;
      skills.forEach(skill => {
        message += `  • ${skill}\n`;
      });
    }
    
    console.log('🎉 技能学习追踪完成！');
    console.log('发送消息:', message.substring(0, 200) + '...');
    
    // 发送结果给用户
    try {
      execSync(`openclaw message send --channel qqbot --to "570260C6B2CA984B355D4AACAAFF5542" --message "${message}"`, {
        stdio: 'inherit'
      });
      console.log('✅ 消息已发送');
    } catch (e) {
      console.error('❌ 发送消息失败:', e.message);
    }
    
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

main();

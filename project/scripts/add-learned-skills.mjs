#!/usr/bin/env node
/**
 * 将学习到的技能添加到技能库
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://riieooizyhovmgvhpcxj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w'
);

const PROFILE_ID = '72040d07-d560-440c-b3b0-796ec45ca916';

// 昨天学习到的技能
const newSkills = [
  // Web 开发 - 已存在分类，添加新技能
  { category: 'Web 开发', skills: ['TypeScript', 'CSS'] },
  
  // 需要新建分类
  { category: '数据库', skills: ['Supabase', 'PostgreSQL'] },
  { category: 'DevOps', skills: ['Nginx', 'Docker', 'Linux'] },
];

async function main() {
  console.log('🚀 添加新技能到技能库...\n');
  
  // 获取现有分类
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('*');
  
  const categoryMap = {};
  categories?.forEach(cat => {
    categoryMap[cat.title] = cat.id;
  });
  
  for (const { category, skills } of newSkills) {
    let categoryId = categoryMap[category];
    
    // 如果分类不存在，创建新分类
    if (!categoryId) {
      console.log(`📁 创建新分类: ${category}`);
      const { data: newCat, error } = await supabase
        .from('skill_categories')
        .insert({
          profile_id: PROFILE_ID,
          title: category,
          sort_order: Object.keys(categoryMap).length
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ 创建分类失败: ${category}`, error);
        continue;
      }
      
      categoryId = newCat.id;
      categoryMap[category] = categoryId;
      console.log(`✅ 分类创建成功: ${category} (${categoryId})`);
    }
    
    // 获取该分类下现有技能
    const { data: existingSkills } = await supabase
      .from('skills')
      .select('name')
      .eq('category_id', categoryId);
    
    const existingNames = new Set(existingSkills?.map(s => s.name.toLowerCase()) || []);
    
    // 添加新技能
    for (const skill of skills) {
      if (existingNames.has(skill.toLowerCase())) {
        console.log(`⏭️ 技能已存在: ${skill}`);
        continue;
      }
      
      const { error } = await supabase
        .from('skills')
        .insert({
          category_id: categoryId,
          name: skill
        });
      
      if (error) {
        console.error(`❌ 添加技能失败: ${skill}`, error);
      } else {
        console.log(`✅ 添加技能: ${skill} (${category})`);
      }
    }
  }
  
  console.log('\n🎉 技能添加完成！');
}

main().catch(console.error);

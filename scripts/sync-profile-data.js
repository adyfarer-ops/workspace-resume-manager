#!/usr/bin/env node
/**
 * 简历数据同步脚本
 * 将 data/*.json 同步到项目代码中
 */

const fs = require('fs');
const path = require('path');

// 路径配置
const DATA_DIR = path.join(__dirname, '..', 'data');
const SRC_DIR = path.join(__dirname, '..', 'project', 'src');
const OUTPUT_FILE = path.join(SRC_DIR, 'profile-data.ts');

// 读取JSON文件
function loadJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 解析失败: ${filename}`, error.message);
    return null;
  }
}

// 生成TypeScript代码
function generateProfileData() {
  const profile = loadJson('profile.json');
  const experience = loadJson('experience.json');
  const education = loadJson('education.json');
  const skills = loadJson('skills.json');
  const projects = loadJson('projects.json');

  if (!profile || !experience || !education || !skills || !projects) {
    console.error('❌ 数据加载失败，终止同步');
    process.exit(1);
  }

  // 转换技能格式
  const skillsFormatted = skills.skills.technical.map(cat => ({
    title: cat.category,
    skills: cat.items
  }));

  // 转换工作经历格式
  const workExperience = experience.experiences.map(exp => ({
    company: exp.company,
    role: exp.position,
    period: exp.period,
    details: exp.description.split('；').filter(d => d.trim())
  }));

  // 转换项目格式
  const projectsFormatted = projects.projects.map(proj => ({
    name: proj.name,
    role: proj.role,
    period: proj.period,
    tags: proj.tags,
    description: proj.description ? [proj.description] : [],
    subProjects: proj.subProjects || [],
    highlight: proj.highlight || false
  }));

  const profileData = {
    name: profile.name,
    title: profile.title,
    quote: profile.quote,
    avatar: profile.avatar,
    about: profile.about,
    contact: {
      age: profile.contact.age,
      location: profile.contact.location,
      phone: `btoa("${profile.contact.phone}")`,
      email: profile.contact.email
    },
    education: education.education,
    skills: skillsFormatted,
    workExperience: workExperience,
    projects: projectsFormatted,
    notes: [] // 可以从单独文件加载
  };

  // 生成TypeScript代码
  const tsCode = `// ⚠️ 此文件由脚本自动生成，请勿手动修改
// 运行 npm run sync-data 重新生成
// 数据来源: data/*.json

import { Profile } from './types';
import { Bot, Code2, Palette, Zap, Brain, PenTool, Youtube } from 'lucide-react';

export const PROFILE_DATA: Profile = ${JSON.stringify(profileData, null, 2).replace(/"btoa\("([^"]+)"\)"/g, 'btoa("$1")')};

export const MENU_ITEMS = [
  { id: 'about', label: '关于', icon: Bot },
  { id: 'experience', label: '经历', icon: Zap },
  { id: 'skills', label: '背景', icon: Brain },
  { id: 'projects', label: '项目', icon: Code2 },
  { id: 'notes', label: '笔记', icon: PenTool },
  { id: 'contact', label: '联系', icon: Youtube },
];
`;

  return tsCode;
}

// 主函数
function main() {
  console.log('🔄 开始同步简历数据...\n');

  const tsCode = generateProfileData();
  
  // 确保目录存在
  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
  }

  // 备份原文件
  if (fs.existsSync(OUTPUT_FILE)) {
    const backupPath = `${OUTPUT_FILE}.backup.${Date.now()}`;
    fs.copyFileSync(OUTPUT_FILE, backupPath);
    console.log(`📦 已备份原文件: ${backupPath}`);
  }

  // 写入新文件
  fs.writeFileSync(OUTPUT_FILE, tsCode, 'utf-8');
  console.log(`✅ 数据已同步到: ${OUTPUT_FILE}`);

  // 更新 constants.ts 引用
  const constantsFile = path.join(SRC_DIR, 'constants.ts');
  if (fs.existsSync(constantsFile)) {
    console.log('\n⚠️  请手动更新 constants.ts:');
    console.log(`   将 import { PROFILE_DATA } from './constants'`);
    console.log(`   改为 import { PROFILE_DATA } from './profile-data'`);
  }

  console.log('\n🎉 同步完成！');
}

main();

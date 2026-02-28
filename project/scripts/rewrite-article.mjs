#!/usr/bin/env node
/**
 * 文章改写工具
 * 使用方法: node rewrite-article.mjs <article-url>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// 获取命令行参数
const articleUrl = process.argv[2];
const articleFile = process.argv[3]; // 可选：本地文件路径

if (!articleUrl && !articleFile) {
  console.log('📝 文章改写工具');
  console.log('');
  console.log('用法:');
  console.log('  方式1 - 从URL改写:');
  console.log('    node rewrite-article.mjs <article-url>');
  console.log('');
  console.log('  方式2 - 从文件改写:');
  console.log('    node rewrite-article.mjs --file <path-to-file>');
  console.log('');
  console.log('示例:');
  console.log('  node rewrite-article.mjs https://example.com/article');
  console.log('  node rewrite-article.mjs --file ./article.txt');
  process.exit(1);
}

console.log('🚀 文章改写工具');
console.log('');

// 读取文章内容
let articleContent = '';
let articleTitle = '';

if (articleFile === '--file' || process.argv[2] === '--file') {
  const filePath = articleFile === '--file' ? articleUrl : process.argv[3];
  console.log(`📄 从文件读取: ${filePath}`);
  articleContent = readFileSync(resolve(filePath), 'utf-8');
  articleTitle = filePath.split('/').pop().replace(/\.[^.]+$/, '');
} else {
  console.log(`🌐 从URL抓取: ${articleUrl}`);
  console.log('');
  console.log('⚠️  注意: 由于微信反爬机制，建议直接复制文章内容。');
  console.log('请复制文章内容保存到文件，然后使用:');
  console.log(`  node rewrite-article.mjs --file ./article.txt`);
  process.exit(1);
}

console.log('');
console.log('📊 文章统计:');
console.log(`  标题: ${articleTitle}`);
console.log(`  字数: ${articleContent.length}`);
console.log(`  行数: ${articleContent.split('\n').length}`);
console.log('');

// 输出改写提示
console.log('✍️  改写建议:');
console.log('');
console.log('1. 标题改写:');
console.log('   - 保持原标题核心意思');
console.log('   - 增加悬念或情感色彩');
console.log('   - 避免过于官方或AI化的表达');
console.log('');
console.log('2. 开头改写:');
console.log('   - 用个人经历或故事引入');
console.log('   - 制造共鸣点');
console.log('   - 避免"随着XX的发展"这类套话');
console.log('');
console.log('3. 正文改写:');
console.log('   - 加入个人观点和感受');
console.log('   - 使用口语化表达');
console.log('   - 适当使用网络流行语');
console.log('   - 增加过渡句和连接词');
console.log('');
console.log('4. 结尾改写:');
console.log('   - 总结升华主题');
console.log('   - 抛出开放性问题');
console.log('   - 引导读者互动');
console.log('');

// 保存原文到数据库的提示
console.log('💾 保存到数据库:');
console.log('改写完成后，可以使用以下SQL插入到数据库:');
console.log('');
console.log(`INSERT INTO notes (title, content, summary, tags, status, created_at)`);
console.log(`VALUES (`);
console.log(`  '改写后的标题',`);
console.log(`  '改写后的HTML内容',`);
console.log(`  '文章摘要',`);
console.log(`  ARRAY['标签1', '标签2'],`);
console.log(`  'published',`);
console.log(`  NOW()`);
console.log(`);`);
console.log('');

// 输出文章内容供参考
console.log('📋 原文内容预览 (前500字):');
console.log('─'.repeat(50));
console.log(articleContent.substring(0, 500));
console.log('─'.repeat(50));
console.log('');
console.log('请基于以上内容进行改写，然后保存到数据库。');

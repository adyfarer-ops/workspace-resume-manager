/**
 * Supabase SQL 执行工具
 * 
 * 使用方法:
 * 1. 首先在 Supabase Dashboard 执行 create-exec-sql-function.sql
 * 2. 然后使用此脚本执行任意 SQL 文件
 * 
 * 示例:
 *   node run-sql.mjs ./scripts/create-tables.sql
 *   node run-sql.mjs ./scripts/seed-all-data.sql
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = 'https://riieooizyhovmgvhpcxj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function executeSqlFile(filePath) {
  try {
    const fullPath = resolve(filePath);
    console.log(`📄 读取文件: ${fullPath}`);
    
    const sql = readFileSync(fullPath, 'utf-8');
    console.log(`📊 SQL 长度: ${sql.length} 字符`);
    console.log('');
    
    // 分割 SQL 语句（按分号分割，但忽略字符串中的分号）
    const statements = splitSqlStatements(sql);
    console.log(`🔢 共 ${statements.length} 条语句`);
    console.log('');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      process.stdout.write(`[${i + 1}/${statements.length}] 执行中... `);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: stmt + ';' 
      });
      
      if (error) {
        console.log(`❌ 失败`);
        console.error(`   错误: ${error.message}`);
        errorCount++;
      } else if (data && data.status === 'error') {
        console.log(`❌ 失败`);
        console.error(`   错误: ${data.message}`);
        errorCount++;
      } else {
        console.log(`✅ 成功`);
        successCount++;
      }
    }
    
    console.log('');
    console.log('📋 执行结果:');
    console.log(`   成功: ${successCount}`);
    console.log(`   失败: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('');
      console.log('🎉 所有 SQL 执行成功!');
    }
    
  } catch (err) {
    console.error('💥 错误:', err.message);
    process.exit(1);
  }
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    // 处理字符串
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      current += char;
    } else if (inString && char === stringChar) {
      // 检查是否是转义
      if (sql[i - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }
      current += char;
    } else if (!inString && char === ';') {
      // 语句结束
      statements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // 添加最后一条语句
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements.filter(s => s.length > 0);
}

// 主程序
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.log('🚀 Supabase SQL 执行工具');
  console.log('');
  console.log('用法:');
  console.log('  node run-sql.mjs <sql-file>');
  console.log('');
  console.log('示例:');
  console.log('  node run-sql.mjs ./scripts/create-tables.sql');
  console.log('  node run-sql.mjs ./scripts/seed-all-data.sql');
  console.log('');
  console.log('注意:');
  console.log('  首次使用前，需要在 Supabase Dashboard 执行:');
  console.log('  ./scripts/create-exec-sql-function.sql');
  process.exit(1);
}

executeSqlFile(sqlFile);

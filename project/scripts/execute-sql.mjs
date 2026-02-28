import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase 配置
const supabaseUrl = 'https://riieooizyhovmgvhpcxj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
  console.error('错误：请设置 SUPABASE_SERVICE_KEY 环境变量');
  console.error('获取方式：Supabase Dashboard → Project Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql(filePath) {
  try {
    const sql = readFileSync(filePath, 'utf-8');
    console.log(`正在执行 SQL 文件: ${filePath}`);
    console.log('SQL 内容预览:');
    console.log(sql.substring(0, 500) + '...');
    console.log('\n开始执行...\n');

    // 使用 Supabase 的 rpc 执行 SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('执行失败:', error);
      
      // 如果 exec_sql 函数不存在，尝试直接执行
      if (error.message.includes('exec_sql')) {
        console.log('\n尝试使用 REST API 直接执行...');
        
        // 分割 SQL 语句并逐条执行
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        for (const stmt of statements) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { 
            sql_query: stmt + ';' 
          });
          
          if (stmtError && !stmtError.message.includes('exec_sql')) {
            console.error('语句执行失败:', stmt.substring(0, 100), '...');
            console.error('错误:', stmtError.message);
          }
        }
      }
    } else {
      console.log('执行成功!');
      console.log('结果:', data);
    }
  } catch (err) {
    console.error('错误:', err.message);
  }
}

// 获取命令行参数
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.log('用法: node execute-sql.mjs <sql-file-path>');
  console.log('示例: node execute-sql.mjs ./scripts/create-tables.sql');
  process.exit(1);
}

const filePath = join(process.cwd(), sqlFile);
executeSql(filePath);

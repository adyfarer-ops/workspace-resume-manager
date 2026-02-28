-- ============================================
-- 创建 exec_sql 函数（在 Supabase Dashboard 执行）
-- ============================================

-- 创建执行 SQL 的函数
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_query;
  result := '{"status": "success", "message": "SQL executed successfully"}'::JSONB;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'status', 'error',
    'message', SQLERRM,
    'detail', SQLSTATE
  );
  RETURN result;
END;
$$;

-- 注释：SECURITY DEFINER 表示以函数创建者的权限执行
-- 这样可以绕过 RLS 限制执行 DDL 语句

-- 验证函数创建成功
SELECT 
  proname as function_name,
  prorettype::regtype as return_type,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname = 'exec_sql';

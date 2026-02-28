-- 在 Supabase Dashboard 中执行此 SQL，创建 exec_sql 函数
-- 创建后，就可以通过 API 调用执行任意 SQL

-- 首先，创建 exec_sql 函数（只需要执行一次）
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_query;
  result := '{"status": "success"}'::JSONB;
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

-- 授予匿名用户执行权限（仅开发环境）
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO authenticated;

-- 如果需要限制权限，可以使用 RLS 或只授予特定角色

-- 查看 sub_projects 表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sub_projects' 
ORDER BY ordinal_position;
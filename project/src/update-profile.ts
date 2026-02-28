import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://riieooizyhovmgvhpcxj.supabase.co';
// 使用 anon key，但可能需要服务角色密钥才能更新
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProfileName() {
  try {
    // 直接尝试更新 name="大鱼" 的记录
    console.log('尝试更新 name="大鱼" 为 "安鼎禹"...');
    
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({ name: '安鼎禹' })
      .eq('name', '大鱼')
      .select();
    
    if (updateError) {
      console.error('更新失败:', updateError);
      console.error('错误详情:', JSON.stringify(updateError, null, 2));
      return;
    }
    
    console.log('更新结果:', updated);
    
    // 验证更新
    const { data: verify, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', '安鼎禹')
      .single();
    
    if (verifyError) {
      console.error('验证失败:', verifyError);
    } else {
      console.log('验证结果 - 找到安鼎禹:', verify);
    }
    
    // 检查是否还有大鱼的记录
    const { data: oldRecord, error: oldError } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', '大鱼')
      .single();
    
    if (oldError) {
      console.log('大鱼记录已不存在或错误:', oldError.message);
    } else {
      console.log('大鱼记录仍存在:', oldRecord);
    }
  } catch (err) {
    console.error('错误:', err);
  }
}

updateProfileName();

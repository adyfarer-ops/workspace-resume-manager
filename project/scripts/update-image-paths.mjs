import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://riieooizyhovmgvhpcxj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWVvb2l6eWhvdm1ndmhwY3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDI4NTAsImV4cCI6MjA4Njk3ODg1MH0._ljslXTlbVvW1Ilx1uD9yHRoPDlnWklfW1TpVg-HG4w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImagePaths() {
  // 获取所有 sub_projects
  const { data: subProjects, error: fetchError } = await supabase
    .from('sub_projects')
    .select('*');
  
  if (fetchError) {
    console.error('Error fetching sub_projects:', fetchError);
    return;
  }
  
  console.log('Found sub_projects:', subProjects?.length);
  console.log('Current data:', JSON.stringify(subProjects, null, 2));
  
  for (const sub of subProjects || []) {
    let needsUpdate = false;
    let newImage = sub.image;
    
    // 修复 image 路径
    if (sub.image && !sub.image.startsWith('/ady')) {
      newImage = sub.image.startsWith('/') ? `/ady${sub.image}` : `/ady/${sub.image}`;
      needsUpdate = true;
      console.log(`Updating image for ${sub.title}: ${sub.image} -> ${newImage}`);
    }
    
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('sub_projects')
        .update({ image: newImage })
        .eq('id', sub.id);
      
      if (updateError) {
        console.error(`Error updating ${sub.title}:`, updateError);
      } else {
        console.log(`Updated ${sub.title} successfully`);
      }
    }
  }
  
  // 获取所有 project_links 中的二维码
  const { data: links, error: linksError } = await supabase
    .from('project_links')
    .select('*')
    .not('qrcode', 'is', null);
  
  if (linksError) {
    console.error('Error fetching project_links:', linksError);
    return;
  }
  
  console.log('Found project_links with qrcode:', links?.length);
  
  for (const link of links || []) {
    if (link.qrcode && !link.qrcode.startsWith('/ady')) {
      const newQrcode = link.qrcode.startsWith('/') ? `/ady${link.qrcode}` : `/ady/${link.qrcode}`;
      console.log(`Updating qrcode for ${link.label}: ${link.qrcode} -> ${newQrcode}`);
      
      const { error: updateError } = await supabase
        .from('project_links')
        .update({ qrcode: newQrcode })
        .eq('id', link.id);
      
      if (updateError) {
        console.error(`Error updating ${link.label}:`, updateError);
      } else {
        console.log(`Updated ${link.label} successfully`);
      }
    }
  }
  
  console.log('Done!');
}

updateImagePaths();

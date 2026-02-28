#!/usr/bin/env node
/**
 * 微信文章抓取工具 - 使用 Puppeteer
 * 使用方法: node scrape.mjs <article-url> [options]
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { writeFileSync } from 'fs';

// 添加 stealth 插件绕过检测
puppeteer.use(StealthPlugin());

const url = process.argv[2];
const args = process.argv.slice(3);

// 解析参数
const timeout = args.includes('--timeout') 
  ? parseInt(args[args.indexOf('--timeout') + 1]) 
  : 30000;
const output = args.includes('--output')
  ? args[args.indexOf('--output') + 1]
  : null;
const headful = args.includes('--headful');

if (!url || url.startsWith('--')) {
  console.log('🕷️  微信文章抓取工具');
  console.log('');
  console.log('用法:');
  console.log('  node scrape.mjs <article-url> [options]');
  console.log('');
  console.log('选项:');
  console.log('  --timeout <ms>    设置超时时间 (默认: 30000ms)');
  console.log('  --output <file>   保存到文件');
  console.log('  --headful          显示浏览器窗口（用于调试）');
  console.log('');
  console.log('示例:');
  console.log('  node scrape.mjs "https://mp.weixin.qq.com/s/xxxxx"');
  console.log('  node scrape.mjs "https://mp.weixin.qq.com/s/xxxxx" --output article.md');
  process.exit(1);
}

console.log('🚀 启动浏览器...');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: !headful,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // 设置 viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // 设置 user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log(`📄 正在打开: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: timeout
    });

    // 等待页面加载
    await page.waitForTimeout(3000);

    // 检查是否有验证码
    const hasCaptcha = await page.evaluate(() => {
      return document.body.textContent.includes('验证') || 
             document.body.textContent.includes('captcha') ||
             document.querySelector('.verify-form') !== null;
    });

    if (hasCaptcha) {
      console.log('');
      console.log('⚠️  检测到验证码/验证页面');
      
      if (headful) {
        console.log('📝 请在浏览器中完成验证...');
        console.log('⏳ 等待 60 秒...');
        await page.waitForTimeout(60000);
      } else {
        console.log('💡 建议: 使用 --headful 参数在本地运行');
        console.log('   node scrape.mjs "' + url + '" --headful');
        await browser.close();
        process.exit(1);
      }
    }

    console.log('🔍 提取文章内容...');

    // 提取文章数据
    const article = await page.evaluate(() => {
      const title = document.querySelector('#activity_name')?.textContent?.trim() ||
                   document.querySelector('h1')?.textContent?.trim() ||
                   document.title;
      
      const author = document.querySelector('#js_name')?.textContent?.trim() ||
                    document.querySelector('.profile_nickname')?.textContent?.trim() ||
                    '未知作者';
      
      const content = document.querySelector('#js_content')?.innerHTML ||
                     document.querySelector('.rich_media_content')?.innerHTML ||
                     document.querySelector('article')?.innerHTML ||
                     '';
      
      const publishTime = document.querySelector('#publish_time')?.textContent?.trim() ||
                         document.querySelector('.publish_time')?.textContent?.trim() ||
                         '';

      // 提取图片
      const images = [];
      document.querySelectorAll('#js_content img').forEach(img => {
        const src = img.getAttribute('data-src') || img.src;
        if (src && !src.includes('emoji')) {
          images.push(src);
        }
      });

      return { title, author, publishTime, content, images };
    });

    await browser.close();

    // 清理内容
    const cleanContent = article.content
      .replace(/<script[^>]*>.*?<\/script>/gs, '')
      .replace(/<style[^>]*>.*?<\/style>/gs, '')
      .replace(/data-src=/g, 'src=')
      .trim();

    // 构建输出
    const output_data = {
      url,
      title: article.title,
      author: article.author,
      publishTime: article.publishTime,
      content: cleanContent,
      images: article.images,
      scrapedAt: new Date().toISOString()
    };

    const markdown = `# ${article.title}

**作者:** ${article.author}  
**发布时间:** ${article.publishTime}  
**原文链接:** ${url}

---

${cleanContent}

---

**图片列表:**
${article.images.map(img => `- ${img}`).join('\n')}
`;

    if (output) {
      writeFileSync(output, markdown);
      console.log(`✅ 已保存到: ${output}`);
    } else {
      console.log('');
      console.log('📋 抓取结果:');
      console.log('─'.repeat(50));
      console.log(markdown.substring(0, 2000));
      console.log('─'.repeat(50));
      if (markdown.length > 2000) {
        console.log(`... (${markdown.length - 2000} 字符省略)`);
      }
    }

    console.log('');
    console.log('📊 统计:');
    console.log(`  标题: ${article.title}`);
    console.log(`  作者: ${article.author}`);
    console.log(`  字数: ${cleanContent.replace(/<[^\u003e]*>/g, '').length}`);
    console.log(`  图片: ${article.images.length} 张`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
})();

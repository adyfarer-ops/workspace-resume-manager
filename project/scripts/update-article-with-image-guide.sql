-- 更新文章，添加配图说明
UPDATE notes 
SET content = '<article class="prose prose-stone max-w-none">
  <p class="text-lg leading-relaxed mb-6">除夕那天，本来打算好好歇一歇，结果手痒又折腾起了新东西——把 OpenClaw 接进微信。</p>
  
  <p class="leading-relaxed mb-4">说实话，这事我惦记很久了。飞书、Discord、QQ 都接过了，就差微信这个"国民级应用"。毕竟日活 10 亿+，谁不用微信啊？</p>
  
  <p class="leading-relaxed mb-4">而且这次找的方案挺靠谱：不走第三方协议、不用 iPad 模拟器，直接上企业微信的官方接口。配置完企业微信，个人微信也能用，一举两得。</p>
  
  <p class="leading-relaxed mb-6">不过有个前提：你的 OpenClaw 得部署在有公网 IP 的服务器上。本地玩的话要搞 NAT 穿透，太麻烦了，不建议。</p>
  
  <div class="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
    <p class="text-sm text-amber-800"><strong>💡 配图建议：</strong> 这里可以放 OpenClaw 的架构图，或者企业微信 + 个人微信的关系示意图。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">第一步：把 OpenClaw 暴露到公网</h2>
  
  <p class="leading-relaxed mb-4">默认情况下，OpenClaw 的 Web 界面只监听 127.0.0.1，也就是只有本机能访问。要让它能被外网访问，得改配置。</p>
  
  <p class="leading-relaxed mb-4">打开 openclaw.json，改这几个地方：</p>
  
  <ul class="list-disc pl-6 mb-6 space-y-2">
    <li><strong>bind</strong>：从 "loopback" 改成 "lan"（监听所有网卡）</li>
    <li><strong>allowedOrigins</strong>：加上你的公网 IP</li>
    <li><strong>allowInsecureAuth</strong>：设为 true（允许 HTTP 访问）</li>
    <li><strong>dangerouslyDisableDeviceAuth</strong>：设为 true（关闭设备认证）</li>
  </ul>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">截图展示 openclaw.json 的配置修改过程，或者终端执行配置命令的界面。</p>
  </div>
  
  <p class="leading-relaxed mb-4">改完重启：</p>
  
  <pre class="bg-stone-100 p-4 rounded-lg mb-6 overflow-x-auto"><code>openclaw gateway restart</code></pre>
  
  <p class="leading-relaxed mb-4">如果报错说 systemctl 有问题，试试：</p>
  
  <pre class="bg-stone-100 p-4 rounded-lg mb-6 overflow-x-auto"><code>openclaw gateway --force</code></pre>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">终端执行重启命令的截图，以及浏览器访问公网 IP 显示 "Connected" 的页面截图。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">第二步：安装企业微信插件</h2>
  
  <p class="leading-relaxed mb-4">OpenClaw 官方有企业微信的插件，直接装：</p>
  
  <pre class="bg-stone-100 p-4 rounded-lg mb-6 overflow-x-auto"><code>openclaw plugins install @openclaw-china/wecom-app</code></pre>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">终端安装插件的截图，以及 openclaw.json 中 plugins 配置的截图。</p>
  </div>
  
  <p class="leading-relaxed mb-6">装完检查 openclaw.json，确认 plugins 里有 wecom-app。</p>
  
  <h2 class="text-xl font-bold mt-8 mb-4">第三步：企业微信后台配置（关键）</h2>
  
  <p class="leading-relaxed mb-4">这一步是整个方案的核心。思路是：用企业微信的"微信插件"功能，把企业应用的能力透传到个人微信。</p>
  
  <h3 class="text-lg font-semibold mt-6 mb-3">3.1 创建自建应用</h3>
  
  <p class="leading-relaxed mb-4">登录企业微信管理后台 → 应用管理 → 自建应用 → 创建应用。</p>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">企业微信后台创建应用的截图，包括填写应用名称、上传 Logo、设置可见范围。</p>
  </div>
  
  <h3 class="text-lg font-semibold mt-6 mb-3">3.2 配置 API 接收</h3>
  
  <p class="leading-relaxed mb-4">创建好后，记下这两个参数：</p>
  
  <ul class="list-disc pl-6 mb-4 space-y-2">
    <li><strong>AgentID</strong>：应用的唯一标识</li>
    <li><strong>Secret</strong>：调用密钥（点一下会推送到企业微信客户端）</li>
  </ul>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">应用详情页截图，显示 AgentID 和 Secret 的位置；API 接收配置页面的截图。</p>
  </div>
  
  <h3 class="text-lg font-semibold mt-6 mb-3">3.3 获取企业 ID</h3>
  
  <p class="leading-relaxed mb-6">去"我的企业"页面，复制 CorpID。</p>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">"我的企业"页面截图，标注 CorpID 的位置。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">第四步：OpenClaw 侧配置</h2>
  
  <p class="leading-relaxed mb-4">回到服务器，在 openclaw.json 的 channels 里加 wecom-app 配置...</p>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">openclaw.json 中 wecom-app 配置的截图；企业微信后台保存 API 接收 URL 成功的截图。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">第五步：绑定微信端</h2>
  
  <p class="leading-relaxed mb-4">在企业微信后台找到"微信插件"功能页，上传应用 Logo，扫二维码完成绑定。</p>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">微信插件页面截图；手机微信"我的企业"里显示 OpenClaw 应用的截图；实际对话测试的截图。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">实际应用：自动收藏公众号文章</h2>
  
  <p class="leading-relaxed mb-4">我搞了个实用功能：看到好的公众号文章，直接转发给 OpenClaw，它自动解析、总结，然后存入飞书多维表格。</p>
  
  <div class="bg-stone-100 p-4 rounded-lg mb-6">
    <p class="text-sm text-stone-600 mb-2"><strong>📸 配图建议：</strong></p>
    <p class="text-sm text-stone-600">手机微信发送文章链接给 OpenClaw 的截图；飞书多维表格中自动记录的文章列表截图。</p>
  </div>
  
  <h2 class="text-xl font-bold mt-8 mb-4">总结</h2>
  
  <p class="leading-relaxed mb-4"><strong>优势：</strong></p>
  
  <ul class="list-disc pl-6 mb-4 space-y-2">
    <li>✅ 完全合规：基于企业微信官方接口，不是协议破解</li>
    <li>✅ 零封号风险：可以用主号跑</li>
    <li>✅ 双端打通：企业微信和微信都能用</li>
  </ul>
  
  <p class="leading-relaxed mb-4"><strong>局限：</strong></p>
  
  <ul class="list-disc pl-6 mb-6 space-y-2">
    <li>❌ 不支持群聊：本质是"企业应用"，只能单聊，不能进微信群</li>
  </ul>
  
  <p class="leading-relaxed mb-4">对个人来说够用了。有问题欢迎交流！</p>
</article>'
WHERE title = '终于把 OpenClaw 塞进微信里了！踩坑实录 + 完整配置指南';

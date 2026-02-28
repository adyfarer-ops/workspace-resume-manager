-- 岁时记 - 手札随笔数据导入
-- 执行此SQL前，请确保已登录Supabase Dashboard并有相应权限

-- 插入示例笔记数据
INSERT INTO notes (title, content, summary, tags, source_url, is_imitation, status, created_at, updated_at)
VALUES 
(
  'DeepSeek R1 在编程辅助中的最佳实践',
  '<article class="prose prose-stone">
    <p>探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。</p>
    <h3>一、DeepSeek R1 的核心特性</h3>
    <p>DeepSeek R1 是一款专注于推理能力的大语言模型，其核心优势在于：</p>
    <ul>
      <li><strong>深度推理</strong>：在数学、代码等需要逻辑推理的任务上表现出色</li>
      <li><strong>思维链展示</strong>：能够展示完整的思考过程，便于理解和调试</li>
      <li><strong>代码生成</strong>：在算法实现和代码优化方面有独特优势</li>
    </ul>
    
    <h3>二、Chain-of-Thought 提示词技巧</h3>
    <p>在使用 DeepSeek R1 进行编程辅助时，以下提示词技巧可以显著提升输出质量：</p>
    <ol>
      <li>明确指定需要展示思考过程</li>
      <li>提供具体的输入输出示例</li>
      <li>要求分步骤解释算法逻辑</li>
      <li>针对边界情况进行特别说明</li>
    </ol>
    
    <h3>三、实战案例</h3>
    <p>在实际项目中，我使用 DeepSeek R1 完成了以下任务：</p>
    <ul>
      <li>动态规划算法的实现与优化</li>
      <li>复杂业务逻辑的重构</li>
      <li>代码审查与bug定位</li>
    </ul>
    
    <h3>四、与其他模型的对比</h3>
    <p>相比 GPT-4 和 Claude，DeepSeek R1 在以下场景更具优势：</p>
    <table>
      <tr><th>场景</th><th>DeepSeek R1</th><th>GPT-4</th><th>Claude</th></tr>
      <tr><td>算法实现</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td></tr>
      <tr><td>代码解释</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐⭐</td></tr>
      <tr><td>调试辅助</td><td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td></tr>
    </table>
  </article>',
  '探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。',
  ARRAY['LLM', 'Coding', 'DeepSeek'],
  NULL,
  false,
  'published',
  '2024-03-15 10:00:00+00',
  '2024-03-15 10:00:00+00'
),
(
  '从 Vue2 到 Vue3 + Pinia 的迁移指南',
  '<article class="prose prose-stone">
    <p>记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。</p>
    
    <h3>一、迁移背景</h3>
    <p>随着 Vue2 逐渐进入维护模式，将项目迁移到 Vue3 成为必然选择。本次迁移涉及：</p>
    <ul>
      <li>Vue2 → Vue3</li>
      <li>Vuex → Pinia</li>
      <li>Options API → Composition API</li>
      <li>JavaScript → TypeScript</li>
    </ul>
    
    <h3>二、Options API 到 Composition API</h3>
    <p>Composition API 带来了更好的逻辑复用能力：</p>
    <pre><code>// Vue2 Options API
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// Vue3 Composition API
import { ref } from ''vue''
export default {
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    return { count, increment }
  }
}</code></pre>
    
    <h3>三、Pinia 状态管理</h3>
    <p>Pinia 相比 Vuex 的优势：</p>
    <ol>
      <li>更简洁的 API 设计</li>
      <li>完整的 TypeScript 支持</li>
      <li>模块化设计，无需命名空间</li>
      <li>更小的体积</li>
    </ol>
    
    <h3>四、迁移经验总结</h3>
    <ul>
      <li>逐步迁移，先新后旧</li>
      <li>充分利用组合式函数（Composables）</li>
      <li>类型安全是迁移的重要目标</li>
      <li>测试覆盖是迁移的保障</li>
    </ul>
  </article>',
  '记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。',
  ARRAY['Vue3', 'Frontend', 'Refactor'],
  NULL,
  false,
  'published',
  '2024-02-10 14:30:00+00',
  '2024-02-10 14:30:00+00'
),
(
  'Coze 智能体编排：多模态工作流实战',
  '<article class="prose prose-stone">
    <p>详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。</p>
    
    <h3>一、项目背景</h3>
    <p>儿童绘本的创作涉及文字和图像两个维度。利用 AI 能力，我们可以：</p>
    <ul>
      <li>使用 LLM 生成故事情节</li>
      <li>使用文生图模型生成插图</li>
      <li>通过工作流自动化整个流程</li>
    </ul>
    
    <h3>二、Coze 工作流设计</h3>
    <p>整个工作流分为以下几个节点：</p>
    <ol>
      <li><strong>输入节点</strong>：接收主题和年龄参数</li>
      <li><strong>故事生成</strong>：使用 GPT-4 生成适合儿童的故事</li>
      <li><strong>分镜脚本</strong>：将故事转换为图像提示词</li>
      <li><strong>图像生成</strong>：调用 Stable Diffusion API</li>
      <li><strong>排版输出</strong>：整合图文生成 PDF</li>
    </ol>
    
    <h3>三、图像一致性控制</h3>
    <p>保持角色一致性是绘本生成的关键：</p>
    <ul>
      <li>使用固定的种子值</li>
      <li>定义详细的角色描述词</li>
      <li>使用 ControlNet 控制构图</li>
      <li>后处理统一画风</li>
    </ul>
    
    <h3>四、效果展示</h3>
    <p>通过这套工作流，可以在 5 分钟内生成一本 10 页的儿童绘本，包括：</p>
    <ul>
      <li>完整的故事情节</li>
      <li>风格统一的插图</li>
      <li>适合年龄的排版</li>
    </ul>
  </article>',
  '详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。',
  ARRAY['AI Agent', 'Coze', 'Workflow'],
  NULL,
  false,
  'published',
  '2024-01-22 09:00:00+00',
  '2024-01-22 09:00:00+00'
);

-- 验证插入结果
SELECT id, title, created_at FROM notes ORDER BY created_at DESC;

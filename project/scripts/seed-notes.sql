-- 插入示例笔记数据
INSERT INTO notes (title, content, summary, tags, source_url, is_imitation, status)
VALUES 
(
  'DeepSeek R1 在编程辅助中的最佳实践',
  '<p>探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。</p><p>本文将详细介绍：</p><ul><li>DeepSeek R1 的核心特性与优势</li><li>Chain-of-Thought 提示词工程技巧</li><li>复杂算法场景下的应用案例</li><li>与 GPT-4、Claude 的对比分析</li></ul>',
  '探索 DeepSeek R1 模型的推理能力，如何通过 Chain-of-Thought 提示词优化代码生成的准确性，特别是在复杂算法实现上的表现。',
  ARRAY['LLM', 'Coding', 'DeepSeek'],
  NULL,
  false,
  'published'
),
(
  '从 Vue2 到 Vue3 + Pinia 的迁移指南',
  '<p>记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。</p><p>迁移过程中的关键点：</p><ul><li>Options API 到 Composition API 的转换策略</li><li>Vuex 状态迁移到 Pinia 的最佳实践</li><li>TypeScript 集成与类型安全</li><li>性能优化与代码分割</li></ul>',
  '记录在重构老旧后台管理系统时的心得，重点分析 Composition API 带来的逻辑复用优势以及 Pinia 相比 Vuex 的轻量化特性。',
  ARRAY['Vue3', 'Frontend', 'Refactor'],
  NULL,
  false,
  'published'
),
(
  'Coze 智能体编排：多模态工作流实战',
  '<p>详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。</p><p>实战内容包括：</p><ul><li>Coze 工作流设计原理</li><li>多模态 AI 能力整合</li><li>图像生成一致性控制技巧</li><li>自动化绘本生成 pipeline</li></ul>',
  '详细复盘如何利用 Coze 搭建一个自动生成儿童绘本的工作流，包含图像生成 API 的对接与一致性控制。',
  ARRAY['AI Agent', 'Coze', 'Workflow'],
  NULL,
  false,
  'published'
);

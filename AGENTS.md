# AGENTS.md

本文档为 DeepSeek Harness（DSH）及其他编码代理在本代码库中的项目级操作指南。

## 强制行为规范

- **新增或更新任何博文前，必须读取并遵循 [博文写作与发布 SOP](docs/运维/博文写作与发布流程.md)**，完成对应阶段的验证与验收。
- 文章内容必须基于真实素材；不得编造作者经历、实验过程、数据或效果。公开前检查公司信息、运营数据、内部地址和凭据等敏感内容。
- 未得到作者明确的提交或发布确认时，不主动提交或推送。
- 写作、验证或发布流程发生变化时，同步更新 SOP；项目技术信息变化时，同步更新本文件。

## 常用命令

- **安装依赖**：`npm ci`
- **启动开发服务器**：`npm run dev`（默认 `localhost:4321`）
- **类型检查**：`npm run check`（Astro / TypeScript 与内容 Schema）
- **生产构建**：`npm run build`（输出 `dist/` 并生成 Pagefind 索引）
- **站内链接检查**：`npm run check:links`（读取 `dist/`，须先构建）
- **完整验证**：`npm run verify`（依次执行 check、build、check:links）
- **预览生产构建**：`npm run preview`
- **代码格式化**：`npm run format`（Prettier，执行后检查是否产生无关改动）
- **Astro CLI**：`npm run astro`

## 架构概览

这是一个使用 Astro 构建的个人技术博客，静态网站生成并部署到 GitHub Pages，主要记录 C++ / Qt、AI 编程工具、开发环境与真实问题排查。

### 核心技术栈

- **框架**：Astro 6（静态网站生成）
- **样式**：Tailwind CSS v4
- **UI 组件**：Shadcn UI + Radix UI
- **内容**：Markdown / MDX + Astro Content Collections
- **语法高亮**：Shiki
- **搜索**：Pagefind（只索引文章正文）
- **评论**：Giscus（基于 GitHub Discussions）
- **语言**：TypeScript（严格模式）

### 项目结构

- `src/content/blog/`：Markdown / MDX 文章，按分类存放在子目录
  - 新文章必须放入对应分类，不直接放在 `blog/` 根目录
  - 新分类和新文件名默认使用小写英文 kebab-case；存量中文文件名不批量改名
- `src/pages/`：基于文件的路由，包括首页、博客列表、动态文章页、搜索、关于和 RSS
- `src/components/`：可复用的 Astro / React 组件
- `src/components/ui/`：Shadcn UI 组件
- `src/layouts/Layout.astro`：全站布局与 SEO 元信息
- `src/lib/`：工具函数
- `public/`：静态资源
- `docs/运维/`：长期维护的项目 SOP
- `scripts/check-internal-links.mjs`：构建产物中的站内链接与资源检查
- `dist/`：构建输出，不提交到仓库

### 内容 Schema

博客文章 Frontmatter 字段：

- `title`（string，必填）：文章标题
- `description`（string，必填）：文章描述
- `date`（date，必填）：首次发布日期
- `tags`（string[]，可选）：文章标签，建议 3–5 个
- `draft`（boolean，可选，默认 false）：草稿状态
- `updated`（date，可选）：真实内容更新时间，不使用构建时间伪造

完整写作和发布规则以 SOP 为准，不在本文件复制整套流程。

### 配置文件

- `astro.config.mjs`：站点地址 `https://laoola.github.io`、Tailwind、Shiki、Sitemap 等配置
- `tsconfig.json`：TypeScript 配置，路径别名 `@/*` → `./src/*`
- `components.json`：Shadcn UI 配置
- `src/content.config.ts`：内容集合 Schema

### 主要特性

- 深色 / 浅色主题切换，支持系统检测（`src/components/ThemeToggle.astro`）
- 博客文章自动生成目录（`src/components/TOC.astro`）
- 代码块复制到剪贴板（`src/components/CopyCodeButton.astro`）
- Giscus 评论系统（`src/components/Giscus.astro`）
- 构建后通过 Pagefind 支持全文搜索，只索引文章正文
- 响应式设计，支持移动端与桌面端
- 自动生成 RSS、Sitemap、Canonical 和 Open Graph 信息
- 草稿文章仅在开发环境可见，不进入正式构建、搜索、RSS 和 Sitemap

## 重要提示

- Node.js 版本要求：`>=22.12.0`
- 包管理器：npm，使用 `package-lock.json`
- 构建输出到 `dist/`，由 GitHub Actions 部署到 GitHub Pages
- 推送到 `main` 会触发部署；已推送不等于已上线，仍须检查 Actions 和线上页面
- `src/styles/global.css` 通过 `@import "shadcn/tailwind.css"` 使用 Shadcn 样式，不能仅因没有 TypeScript import 就删除该依赖

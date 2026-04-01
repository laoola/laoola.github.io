# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在本代码库中的操作指南。

## 常用命令

- **安装依赖**: `npm install`
- **启动开发服务器**: `npm run dev` (运行在 `localhost:4321`)
- **类型检查**: `npm run check` (运行 Astro 类型检查)
- **生产构建**: `npm run build` (输出到 `dist/`，包含 PageFind 索引)
- **预览生产构建**: `npm run preview`
- **代码格式化**: `npm run format` (Prettier，包含 Astro 和 Tailwind 插件)
- **Astro CLI**: `npm run astro`

## 架构概览

这是一个使用 Astro 构建的个人技术博客，静态网站生成，部署到 GitHub Pages。

### 核心技术栈
- **框架**: Astro 6 (静态网站生成)
- **样式**: Tailwind CSS v4
- **UI 组件**: Shadcn UI + Radix UI
- **内容**: Markdown/MDX + Astro Content Collections
- **语法高亮**: Shiki
- **搜索**: PageFind (静态网站全文搜索)
- **评论**: Giscus (基于 GitHub Discussions)
- **语言**: TypeScript (严格模式)

### 项目结构
- `src/content/blog/` - Markdown/MDX 格式的博客文章
- `src/pages/` - 基于文件的路由 (首页、博客列表、动态文章页、搜索页)
- `src/components/` - 可复用的 Astro/React 组件
- `src/components/ui/` - Shadcn UI 组件
- `src/layouts/` - 页面布局模板
- `src/lib/` - 工具函数
- `public/` - 静态资源
- `dist/` - 构建输出 (生成，不提交到仓库)

### 内容 Schema
博客文章 Frontmatter 需要包含：
- `title` (string) - 文章标题
- `description` (string) - 文章描述
- `date` (date) - 发布日期
- `tags` (string[], 可选) - 文章标签
- `draft` (boolean, 可选，默认: false) - 草稿状态

### 配置文件
- `astro.config.mjs` - Astro 配置，站点地址 `https://laoola.github.io`，Tailwind 集成，Shiki 高亮
- `tsconfig.json` - TypeScript 配置，路径别名 `@/*` → `./src/*`
- `components.json` - Shadcn UI 配置
- `src/content.config.ts` - 内容集合 Schema 定义

### 主要特性
- 深色/浅色主题切换，支持系统检测 (`src/components/ThemeToggle.astro`)
- 博客文章自动生成目录 (TOC) (`src/components/TOC.astro`)
- 代码块复制到剪贴板 (`src/components/CodeBlock.astro`)
- Giscus 评论系统，基于 GitHub Discussions (`src/components/Giscus.astro`)
- 构建后通过 PageFind 支持全文搜索
- 响应式设计 (支持移动端 + 桌面端)
- 自动生成 Sitemap
- SEO 友好
- 草稿文章仅在开发环境可见

## 重要提示

- Node.js 版本要求: `>=22.12.0`
- 包管理器: npm (使用 package-lock.json)
- 构建输出到 `dist/` 目录，用于 GitHub Pages 部署
- PageFind 搜索索引在构建后自动运行

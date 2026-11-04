# 个人技术思考

玛卡巴子的个人技术博客，主要记录 C++ / Qt 桌面开发、AI 编程工具实践、开发环境配置与真实问题排查。

线上地址：<https://laoola.github.io/>

## 技术栈与功能

- Astro 6 + TypeScript，Markdown / MDX Content Collections。
- Tailwind CSS v4，支持亮色 / 暗色主题。
- Pagefind 静态全文搜索，只索引文章正文。
- 自动生成目录、代码复制、Giscus 评论、RSS 和 Sitemap。
- GitHub Actions 构建并部署到 GitHub Pages。

## 本地开发

环境要求：Node.js >= 22.12.0。

```sh
npm ci
npm run dev
```

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run check` | 检查 Astro / TypeScript 与内容 schema |
| `npm run build` | 构建 `dist/` 并生成 Pagefind 索引 |
| `npm run check:links` | 检查构建产物中的站内链接与静态资源 |
| `npm run verify` | 依次执行类型检查、构建和死链检查 |
| `npm run preview` | 本地预览生产构建 |

`check:links` 读取 `dist/`，必须先执行 `build`。

## 目录结构

```text
src/
├── components/          # 目录、评论、代码复制、主题切换等组件
├── content/blog/        # Markdown 文章，按主题分目录
├── layouts/Layout.astro # 全站布局与 SEO 元信息
├── pages/               # 首页、文章、搜索、关于、RSS 等页面
└── styles/global.css    # 全局样式与主题变量
scripts/
└── check-internal-links.mjs
.github/workflows/
└── deploy.yml           # 检查、构建、链接验证与部署
```

## 新增文章

在 `src/content/blog/<分类>/` 下新建 `.md` 文件，最小 frontmatter：

```yaml
---
title: 文章标题
description: 用于列表、搜索结果和分享卡片的简短摘要
date: 2026-11-04
tags: [Qt, Linux]
draft: false
---
```

可选字段：`updated` 表示真实内容更新时间；未填写时不展示，也不伪造修改时间。

站内文章链接使用从根目录开始的路径，例如：

```text
/blog/ecommerce/电商运营ai提效方案-01-工作诊断/
```

链接 slug 应与 Astro 构建后的文章 ID 保持一致（ASCII 字母小写）。提交前运行 `npm run verify`，避免大小写或路径变化产生死链。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会依次执行：

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run check:links`
5. 上传并部署 `dist/` 到 GitHub Pages

任何检查失败都会阻止部署。

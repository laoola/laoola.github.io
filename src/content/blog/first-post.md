---
title: 欢迎来到我的技术博客
description: 这是我的第一篇技术博客文章，介绍博客的搭建过程和技术栈。
date: 2026-03-31
tags:
  - 博客
  - Astro
  - Tailwind CSS
---

# 欢迎来到我的技术思考

你现在看到的是一个用 **Astro 6 + Tailwind CSS v4 + Shadcn UI** 搭建的静态站点。本文记录搭建过程和技术选型。

## 为什么选 Astro？

我搭建这个站的时候试过几个方案：

| 方案 | 问题 |
|------|------|
| Next.js | 太重，博客不需要SSR |
| Hexo | 生态老旧，维护不活跃 |
| Astro | 静态输出快，内容管理友好，开发体验好 |

最终选了 Astro，目前用下来感受：
- 内容就是内容，代码就是代码，分离得很干净
- 开发启动快，热更新快
- 静态输出直接扔 GitHub Pages，不用买服务器

## 技术栈清单

### 核心依赖
- **Astro 6** - 静态站点生成，内容集合 API 很好用
- **Tailwind CSS v4** - 不用写 CSS，复制粘贴就能用
- **Shadcn UI** - 拿组件直接用，不用自己造轮子

### 特色功能
- **Markdown/MDX** - 写文章就是写 Markdown，支持嵌入组件
- **Shiki** - 代码高亮，和 VS Code 效果一致
- **PageFind** - 纯静态全文搜索，不用后端
- **Giscus** - 基于 GitHub Discussions 的评论，不用自己维护
- **深色模式** - 说真的，晚上写代码还是深色舒服
- **自动 Sitemap** - SEO 友好，搜索引擎能搜到

## 从零搭建五分钟步骤

### 1. 初始化项目
```bash
npm create astro@latest
```

### 2. 添加 Tailwind CSS
```bash
npx astro add tailwind
```

### 3. 添加 Shadcn UI
```bash
npx shadcn@latest init
```

### 4. 配置内容集合

在 `src/content.config.ts` 定义 blog collection：

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog };
```

### 5. 本地开发
```bash
npm run dev  # 访问 localhost:4321
```

## 写作流程

1. 在 `src/content/blog/` 新建 `.md` 文件
2. 开头加 Frontmatter：

```markdown
---
title: 文章标题
description: 文章描述
date: 2026-03-31
tags: [标签1, 标签2]
draft: false
---
```

3. 写 Markdown 内容
4. 本地预览没问题，提交推送到 GitHub，GitHub Actions 自动部署

## 代码示例

算个斐波那契：

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

算个阶乘：

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
```

## 最后

这个站用来记录技术学习过程，遇到的问题踩过的坑，以及一些思考。如果你能从这里找到有用的信息，那很好。

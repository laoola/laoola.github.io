---
title: 欢迎来到我的技术博客
description: 这是我的第一篇技术博客文章，介绍博客的搭建过程和技术栈。
date: 2026-03-31
tags:
  - 博客
  - Astro
  - Tailwind CSS
---

# 欢迎来到我的技术博客

## 博客简介

这是一个使用Astro + Tailwind CSS + Shadcn UI搭建的个人技术博客。本文将介绍博客的技术栈和搭建过程。

## 技术栈

### 核心框架
- **Astro**：现代化的静态站点生成器，提供优秀的性能和开发体验
- **Tailwind CSS v4**：实用优先的CSS框架，快速构建响应式界面
- **Shadcn UI**：基于Tailwind的组件库，提供美观的UI组件

### 功能特性
- **Markdown + MDX**：支持标准Markdown和MDX格式的内容
- **Shiki代码高亮**：提供美观的代码语法高亮
- **PageFind搜索**：纯静态离线搜索功能
- **Giscus评论**：基于GitHub Discussions的评论系统
- **暗黑模式**：支持亮/暗色主题切换
- **SEO优化**：自动生成sitemap和robots.txt

## 搭建过程

### 环境准备
1. 安装Git和Node.js
2. 设置npm代理（如果需要）
3. 初始化Astro项目

### 集成工具
1. 添加Tailwind CSS v4
2. 集成Shadcn UI组件库
3. 配置Markdown和MDX支持
4. 添加代码高亮和搜索功能

## 写作流程

1. 在`src/content/blog`目录下创建Markdown或MDX文件
2. 添加Frontmatter元数据
3. 编写文章内容
4. 本地预览：`npm run dev`
5. 构建部署：`npm run build`

## 代码示例

以下是一个JavaScript代码示例：

```javascript
// 示例代码：计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 测试
console.log(fibonacci(10)); // 输出：55
```

以下是一个Python代码示例：

```python
# 示例代码：计算阶乘
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

# 测试
print(factorial(5))  # 输出：120
```

## 结语

希望这个博客能够记录我的技术学习和分享，也希望能为其他开发者提供有价值的内容。

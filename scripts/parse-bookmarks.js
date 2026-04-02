// 解析 Chrome 书签 HTML 文件，生成导航站 Markdown

import fs from 'fs'

// 读取书签文件
const bookmarkFile = 'C:\\Users\\zwh\\Documents\\bookmarks_2026_4_2.html'
const html = fs.readFileSync(bookmarkFile, 'utf-8')

// 更简单的解析方式：使用正则提取所有文件夹和链接
function extractStructure(html) {
  const lines = html.split('\n')
  const structure = []
  const stack = []
  let currentLevel = structure

  // 正则匹配：<DT><H3 ...>Name</H3>
  const folderRegex = /<DT><H3[^>]*>([^<]+)<\/H3>/
  // 正则匹配：<DT><A HREF="url" ...>Name</A>
  const linkRegex = /<DT><A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/
  // 匹配 DL 结束标签，表示退出当前文件夹
  const dlCloseRegex = /<\/DL>/

  for (const line of lines) {
    const folderMatch = line.match(folderRegex)
    if (folderMatch) {
      const name = folderMatch[1].trim()
      const folder = { type: 'folder', name, children: [] }
      currentLevel.push(folder)
      stack.push(currentLevel)
      currentLevel = folder.children
      continue
    }

    const linkMatch = line.match(linkRegex)
    if (linkMatch) {
      const url = linkMatch[1].trim()
      const name = linkMatch[2].trim()
      currentLevel.push({ type: 'link', name, url })
      continue
    }

    if (dlCloseRegex.test(line) && stack.length > 0) {
      currentLevel = stack.pop()
    }
  }

  return structure
}

const structure = extractStructure(html)
console.log(
  `Extracted ${countLinks(structure)} links in ${countFolders(structure)} folders`,
)

// 统计链接数量
function countLinks(nodes) {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'link') count++
    if (node.type === 'folder') count += countLinks(node.children)
  }
  return count
}

function countFolders(nodes) {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'folder') {
      count++
      count += countFolders(node.children)
    }
  }
  return count
}

// 生成 Markdown
function generateMarkdown(nodes, depth) {
  depth = depth || 0
  let md = ''
  const indent = '  '.repeat(depth)

  for (const node of nodes) {
    if (node.type === 'folder') {
      md += `${indent}- **${node.name}**\n`
      md += generateMarkdown(node.children, depth + 1)
    } else if (node.type === 'link') {
      md += `${indent}- [${node.name}](${node.url})\n`
    }
  }

  return md
}

const markdownContent = generateMarkdown(structure)

// 添加 frontmatter
const today = new Date().toISOString().split('T')[0]
const fullMarkdown = `---
title: 常用网址导航收藏
description: 整理收集的常用网址书签，按分类归纳便于快速访问
date: ${today}
tags: ["导航", "收藏", "工具"]
---

# 常用网址导航

本文整理收藏了日常使用的各类常用网址，按分类归纳便于快速访问。

${markdownContent}

> 注：本文由浏览器书签导出自动整理生成，会不定期更新。
`

// 输出到博客目录
const outputPath =
  'C:\\GitCode\\laoola.github.io\\src\\content\\blog\\bookmarks-navigation.md'
fs.writeFileSync(outputPath, fullMarkdown, 'utf-8')

console.log(`Generated: ${outputPath}`)
console.log(`Total lines: ${fullMarkdown.split('\n').length}`)

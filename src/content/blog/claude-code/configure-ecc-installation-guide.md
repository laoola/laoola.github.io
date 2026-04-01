---
title: configure-ecc 部署安装指南
description: Everything Claude Code 交互式安装向导的完整部署说明
date: 2026-04-01
tags: [Claude Code, ECC, 部署]
---

# configure-ecc 部署安装指南

`configure-ecc` 是 Everything Claude Code (ECC) 的交互式安装向导，它通过引导用户选择性安装技能和规则集，验证路径正确性，并提供可选优化，帮你快速完成 ECC 的部署配置。

## 什么是 configure-ecc

这是一个自动化安装工具，主要功能：
- 交互式问答引导选择安装位置（用户级/项目级/两者）
- 支持按分类选择安装 45+ 个技能
- 支持选择性安装不同语言的规则集
- 自动验证安装结果和交叉依赖
- 提供可选的安装后优化定制

## 前置要求

在开始安装前，你需要：

1. **Claude Code CLI** 已安装并可正常使用
2. **Git** 可用（用于克隆 ECC 仓库）
3. **网络连接**（访问 GitHub）

## 安装方式

### 方式一：通过插件市场安装（推荐）

在 Claude Code 中执行：

```
/plugin install everything-claude-code
```

插件会自动加载 `configure-ecc` 技能，安装完成后直接激活即可。

### 方式二：手动引导安装

如果你已经有 ECC 仓库或者插件安装失败，可以手动引导：

1. 将 `configure-ecc` 技能复制到你的技能目录：

```bash
mkdir -p ~/.claude/skills/configure-ecc
cp <path-to-ecc>/skills/configure-ecc/SKILL.md ~/.claude/skills/configure-ecc/
```

2. 在 Claude Code 中激活：

```
configure ecc
```

## 安装流程

安装向导会自动引导你完成以下 6 个步骤：

### 步骤 1：选择安装级别

向导会问你安装在哪里：

| 选项 | 说明 | 目标路径 |
|------|------|----------|
| 用户级 | 对所有项目生效 | `~/.claude/` |
| 项目级 | 仅对当前项目生效 | `.claude/` |
| 两者 | 公共技能规则用户级，项目特定项目级 | 两者都有 |

向导会自动创建所需目录：

```bash
mkdir -p $TARGET/skills $TARGET/rules
```

### 步骤 2：选择并安装技能

ECC 包含 45+ 个技能，分为 8 个分类：

**核心技能包（推荐新用户）** 包含：
- 工程方法：tdd, e2e, 验证, 安全评审
- 研究工作流：search-first, deep-research
- 交叉功能：article-writing, content-engine, market-research
- 质量管控：strategic-compact, 验证循环

如果你需要更多，可以选择添加特定领域/框架的技能：

| 分类 | 技能数量 | 包含内容 |
|------|----------|----------|
| Framework & Language | 21 | Django, Laravel, Spring Boot, Go, Python, Java, 前后端模式 |
| Database | 3 | PostgreSQL, ClickHouse, JPA/Hibernate |
| Workflow & Quality | 8 | TDD, 持续学习, 安全评审, 压缩策略 |
| Business & Content | 5 | 文章写作, 内容引擎, 市场研究, 投资者材料 |
| Research & APIs | 3 | 深度研究, Exa 搜索, Claude API 模式 |
| Social & Distribution | 2 | X/Twitter API, 跨平台发布 |
| Media Generation | 2 | fal.ai 媒体生成, AI 视频编辑 |
| Orchestration | 1 | dmux 多智能体编排 |

你可以选择整个分类，也可以确认单个技能安装。

### 步骤 3：选择并安装规则集

规则集是 Claude Code 遵循的编码规范和工作流指南：

| 规则集 | 文件数 | 说明 |
|--------|--------|------|
| Common rules | 8 | 语言无关通用原则：编码风格、Git 工作流、测试、安全等 |
| TypeScript/JavaScript | 5 | TS/JS 模式、Hook、Playwright 测试 |
| Python | 5 | Python 模式、pytest、black/ruff 格式化 |
| Go | 5 | Go 模式、表驱动测试、gofmt/staticcheck |

> **提示**：语言特定规则扩展通用规则，不建议只装语言规则而不装通用规则。向导会提醒你。

### 步骤 4：安装后验证

安装完成后，向导自动执行三项检查：

1. **文件存在性检查** - 确认所有文件都复制到目标位置
2. **路径引用检查** - 扫描所有文件检查路径引用正确性
3. **交叉依赖检查** - 验证技能之间的依赖关系（比如 `django-tdd` 依赖 `django-patterns`）

如果发现问题，会报告给你：
- 哪个文件有问题
- 哪一行
- 问题是什么
- 建议修复方案

### 步骤 5：可选优化

你可以选择优化已安装的文件：

- **优化技能** - 根据你的项目技术栈移除不相关章节
- **优化规则** - 调整覆盖目标、添加项目特定模式
- **两者都优化** - 全面定制
- **跳过** - 保持原样

> **重要**：优化只修改安装目标目录的文件，不会修改源 ECC 仓库。

### 步骤 6：完成安装

清理临时文件，输出安装总结：

- 安装级别和路径
- 已安装技能数量和列表
- 已安装规则列表
- 验证结果（发现/修复了几个问题）
- 应用了哪些优化

## 常见问题排查

### Q: 技能没有被 Claude Code 加载

**A:** 检查：
- 技能目录下必须有 `SKILL.md` 文件：`~/.claude/skills/<skill-name>/SKILL.md`
- 项目级安装检查：`.claude/skills/<skill-name>/SKILL.md`

### Q: 规则不生效

**A:** 检查：
- 规则是平面文件，不是嵌套目录：`$TARGET/rules/coding-style.md` 正确，`$TARGET/rules/common/coding-style.md` 错误
- 安装规则后需要重启 Claude Code

### Q: 项目级安装后路径引用错误

**A:**
- 运行步骤 4 验证找到问题，向导会帮助修复
- `continuous-learning-v2` 的 `~/.claude/homunculus/` 始终是用户级，这是预期的，不是错误

## 使用示例

最常见的完整安装流程：

```
1. 执行：configure ecc
2. 选择：用户级 (~/.claude/) - 对所有项目生效
3. 选择：Core only (推荐) - 安装核心技能包
4. 选择：Common rules + TypeScript/JavaScript - 安装通用规则 + TS 规则
5. 验证：向导自动检查发现 0 个问题
6. 优化：跳过 - 保持原样
7. 完成：重启 Claude Code 后所有技能规则生效
```

## 总结

`configure-ecc` 把原本手动复制文件的过程变成交互式引导，自动处理路径和依赖验证，确保你的 ECC 安装一次成功。安装完成后，你就可以在 Claude Code 中使用所有选中的技能和规则了。

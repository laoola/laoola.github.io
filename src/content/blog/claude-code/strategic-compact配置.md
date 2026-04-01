---
title: strategic-compact 上下文压缩配置指南
description: everything-claude-code strategic-compact 功能配置指南，帮助管理长会话上下文
date: 2026-03-31
tags: [Claude Code, everything-claude-code, 配置]
---

# strategic-compact 上下文压缩配置指南

`strategic-compact` 是 everything-claude-code 提供的**战略上下文压缩提醒**功能，帮助你在长会话中主动管理上下文窗口。

## 功能概述

| 特性 | 说明 |
|------|------|
| **触发时机** | `PreToolUse` 钩子（Edit/Write 操作后） |
| **工作方式** | 统计工具调用次数，达到阈值后**提醒压缩**，不自动执行 |
| **设计哲学** | 在逻辑任务边界手动压缩，避免中途自动压缩丢失关键上下文 |

## 阈值配置

### 默认配置

- 首次提醒：**50 次**工具调用后
- 重复提醒：达到阈值后，**每 25 次**工具调用提醒一次

### 自定义阈值

通过环境变量 `COMPACT_THRESHOLD` 设置自定义阈值。在 `~/.claude/settings.json` 中配置：

```json
{
  "env": {
    // 其他环境变量...
    "COMPACT_THRESHOLD": "30"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{
          "type": "command",
          "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
        }]
      },
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
        }]
      }
    ]
  }
}
```

### 推荐阈值

| 使用场景 | 推荐阈值 | 说明 |
|---------|---------|------|
| 小项目/短任务 | `20-30` | 更频繁提醒，避免上下文过快增长 |
| 中型项目 | `50` (默认) | 平衡提醒频率 |
| 大型项目/长会话 | `80-100` | 减少打扰，需要时手动压缩 |

## 完整配置示例

这是一个完整的 `settings.json` 配置示例：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token-here",
    "HTTP_PROXY": "http://127.0.0.1:10808",
    "HTTPS_PROXY": "http://127.0.0.1:10808",
    "COMPACT_THRESHOLD": "40"
  },
  "model": "ark-code-latest",
  "enabledPlugins": {
    "everything-claude-code@affaan-m-everything-claude-code": true
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
        }]
      }
    ]
  }
}
```

> 注意：`matcher` 使用正则表达式，`Edit|Write` 可以匹配编辑或写入操作，比分开写更简洁。

## 压缩时机推荐

根据 `strategic-compact` 设计理念，推荐在这些时机压缩：

| 阶段转换 | 是否压缩 | 原因 |
|---------|---------|------|
| 研究 → 规划 | ✅ 是 | 研究上下文庞大，规划已提炼出关键信息 |
| 规划 → 实施 | ✅ 是 | 计划已保存在 TodoWrite，释放上下文用于编码 |
| 实施 → 测试 | ⚠️ 看情况 | 如果测试引用最近代码则保留，切换焦点时压缩 |
| 调试 → 下一项功能 | ✅ 是 | 调试痕迹会污染新工作上下文 |
| 实施过程中 | ❌ 否 | 丢失变量名、文件路径代价高昂 |
| 尝试失败方法后 | ✅ 是 | 尝试新方法前清理无效推理 |

## 压缩后保留内容

`/compact` 压缩后会保留：

| ✅ 保留 | ❌ 丢失 |
|--------|--------|
| `CLAUDE.md` 项目指令 | 中间推理和分析 |
| `TodoWrite` 任务列表 | 之前读取过的文件内容 |
| 记忆文件 (`~/.claude/memory/`) | 多轮对话历史 |
| Git 状态（分支、提交） | 工具调用历史和计数 |
| 磁盘上的源代码文件 | 口头陈述的细微用户偏好 |

## 常见问题

### Q: 会自动压缩吗？

**A:** 不会。`strategic-compact` 只提供提醒，最终是否执行 `/compact` 由你决定。设计初衷就是避免在任务中途自动压缩丢失关键上下文。

### Q: 阈值和上下文 token 数有关系吗？

**A:** 没有直接关系。`strategic-compact` 统计**工具调用次数**，不是 token 数量。这是一种启发式统计，工具调用次数越多，通常上下文增长越大。

### Q: 重启会话后计数会重置吗？

**A:** 会。计数存在临时文件 `/tmp/claude-tool-count-*`，重启系统或会话后重置。

### Q: 为什么不基于 token 百分比提醒？

**A:** Claude Code 钩子系统目前无法直接获取当前剩余 token 百分比。工具调用次数是简单有效的启发式方法。

## 相关文档

- [ECC功能说明.md](./ECC功能说明.md) - everything-claude-code 完整功能
- [strategic-compact 官方文档](https://github.com/affaan-m/everything-claude-code/tree/main/docs/zh-CN/skills/strategic-compact) - 官方中文文档

---
title: Claude Code 配置复刻指南 - 从零打造完全一致的开发环境
description: 详细记录如何在另一台机器上完整复刻当前 Claude Code 的所有配置，包括 settings.json、规则文件、MCP 服务器、插件配置等
date: 2026-05-07
tags:
  - Claude Code
  - 配置指南
  - 开发环境
  - 工具配置
---

# Claude Code 配置复刻指南

用了一段时间 Claude Code 打磨出一套顺手的规则和插件配置，换机器的时候怎么完整复刻过来？本文记录完整步骤。

## 一、核心配置文件位置

Claude Code 的配置主要分布在两个位置：

| 配置类型 | 路径 | 说明 |
|---------|------|------|
| 全局配置 | `~/.claude/settings.json` | 用户级配置，所有项目共享 |
| 项目配置 | `<project>/.claude/settings.local.json` | 项目级配置，仅对当前项目生效 |
| 规则文件 | `~/.claude/rules/*.md` | 开发规范、工作流规则 |

## 二、全局配置（settings.json）

这是当前配置的核心，包含了环境变量、MCP 服务器、插件、权限等所有配置：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimaxi.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<your-api-key>",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_SMALL_FAST_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M2.7",
    "HTTP_PROXY": "http://127.0.0.1:10808",
    "HTTPS_PROXY": "http://127.0.0.1:10808"
  },
  "permissions": {
    "allow": [
      "Read(//c/GitCode/dlp5.2/**)"
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "bash -c 'plugin_dir=$(ls -d \"${HOME}/.claude/plugins/cache/claude-hud/claude-hud/\"*/ | sort -V | tail -1); exec \"/c/Program Files/nodejs/node\" \"${plugin_dir}dist/index.js\"'"
  },
  "enabledPlugins": {
    "claude-hud@claude-hud": true,
    "superpowers@claude-plugins-official": true,
    "everything-claude-code@affaan-m-everything-claude-code": true,
    "document-skills@anthropic/skills": true,
    "document-skills@anthropic-agent-skills": true
  },
  "extraKnownMarketplaces": {
    "anthropic-agent-skills": {
      "source": {
        "source": "github",
        "repo": "anthropics/skills"
      }
    }
  },
  "pluginConfigs": {
    "everything-claude-code@affaan-m-everything-claude-code": {}
  },
  "language": "中文简体",
  "effortLevel": "medium",
  "autoCompactEnabled": false,
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-coding-plan-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "<your-minimax-api-key>",
        "MINIMAX_API_HOST": "https://api.minimaxi.com"
      }
    }
  }
}
```

### 配置项说明

**环境变量**：
- `ANTHROPIC_BASE_URL` / `ANTHROPIC_AUTH_TOKEN`：API 接入配置，使用 MiniMax 代理
- `ANTHROPIC_MODEL` 系列：模型配置，当前使用 MiniMax-M2.7
- `HTTP_PROXY` / `HTTPS_PROXY`：代理配置，根据网络环境调整

**MCP 服务器**：
- 通过 `uvx` 启动，需要提前安装 `uv`（`pip install uv`）

**插件配置**：
- `claude-hud`：状态栏增强
- `superpowers`：流程管控
- `everything-claude-code`：海量预置技能和代理
- `document-skills`：文档处理技能

## 三、项目级配置（settings.local.json）

放在项目根目录 `.claude/settings.local.json`：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install:*)",
      "Bash(npm run:*)",
      "Bash(ls:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "mcp__plugin_everything-claude-code_exa__web_search_exa",
      "mcp__plugin_everything-claude-code_exa__crawling_exa",
      "Bash(node scripts/parse-bookmarks.js)",
      "Bash(claude --version)",
      "Bash(claude-code --version)",
      "Bash(npm update *)"
    ]
  }
}
```

**说明**：列出了项目常用的命令白名单，避免每次操作都弹窗确认。

## 四、规则文件（rules）

规则文件放在 `~/.claude/rules/` 目录下，采用分层结构：

### 4.1 目录结构

```
~/.claude/rules/
├── agents.md              # Agent 编排规范
├── code-review.md         # 代码审查标准
├── coding-style.md        # 编码风格指南
├── development-workflow.md # 开发流程规范
├── git-workflow.md        # Git 工作流
├── hooks.md               # Hook 系统配置
├── patterns.md            # 设计模式指南
├── performance.md         # 性能优化指南
├── security.md            # 安全检查清单
├── testing.md             # 测试要求（80% 覆盖率）
├── common/                # 通用规则
│   ├── agents.md
│   ├── code-review.md
│   ├── coding-style.md
│   ├── cpp11-dev-workflow.md  # C++11 开发工作流
│   ├── development-workflow.md
│   ├── git-workflow.md
│   ├── global.md
│   ├── hooks.md
│   ├── patterns.md
│   ├── performance.md
│   ├── security.md
│   └── testing.md
└── cpp/                   # C++ 专属规则
    ├── coding-style.md
    ├── hooks.md
    ├── patterns.md
    ├── security.md
    └── testing.md
```

### 4.2 核心规范要点

**Agent 编排策略**：

| Agent | 用途 | 使用时机 |
|-------|------|---------|
| planner | 实施规划 | 复杂功能、重构 |
| architect | 系统设计 | 架构决策 |
| tdd-guide | 测试驱动开发 | 新功能、Bug 修复 |
| code-reviewer | 代码审查 | 代码编写后 |
| security-reviewer | 安全分析 | 提交前 |
| build-error-resolver | 构建错误修复 | 构建失败时 |
| e2e-runner | 端到端测试 | 关键用户流程 |
| refactor-cleaner | 死代码清理 | 代码维护 |

**并行任务原则**：独立操作必须并行执行，避免串行等待。

**代码审查标准**：

| 级别 | 含义 | 处理方式 |
|------|------|---------|
| CRITICAL | 安全漏洞或数据丢失风险 | **阻止** - 必须修复 |
| HIGH | Bug 或重大质量问题 | **警告** - 应该修复 |
| MEDIUM | 可维护性担忧 | **建议** - 考虑修复 |
| LOW | 风格或小建议 | **可选** |

**编码风格核心**：

- **不可变性（CRITICAL）**：永远创建新对象，不修改原对象
- **KISS**：简单方案优先
- **DRY**：提取重复逻辑
- **YAGNI**：不构建未来可能需要的特性

**开发流程**：

```
0. 研究与复用（强制）
1. 计划先行（planner agent）
2. TDD 方式（tdd-guide agent）
3. 代码审查（code-reviewer agent）
4. 提交与推送
5. 预审检查
```

## 五、复刻步骤清单

在新机器上复刻配置：

### Step 1：安装 Claude Code

确保 Node.js >= 22.12.0，然后：

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2：复制全局配置

复制 `settings.json` 到 `~/.claude/settings.json`，**替换其中的敏感信息**：
- `ANTHROPIC_AUTH_TOKEN`
- `MINIMAX_API_KEY`

### Step 3：复制规则文件

```bash
# 复制整个 rules 目录
cp -r rules/ ~/.claude/rules/
```

### Step 4：安装 uv（MCP 服务器依赖）

```bash
pip install uv
```

### Step 5：验证安装

```bash
claude --version
claude-code --version
```

### Step 6：配置项目级权限（如需要）

在项目目录创建 `.claude/settings.local.json`，添加该项目的命令白名单。

## 六、配置文件模板

### settings.json 最小模板

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<your-api-key>",
    "ANTHROPIC_MODEL": "claude-sonnet-4-20250514"
  },
  "permissions": {
    "allow": []
  },
  "language": "中文简体",
  "autoCompactEnabled": false
}
```

### settings.local.json 最小模板

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install:*)",
      "Bash(npm run:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ]
  }
}
```

## 七、常见问题

**Q: MCP 服务器连接失败？**

检查 `uvx` 是否已安装：`pip install uv`

**Q: 权限不足？**

在 `settings.local.json` 中添加对应的命令白名单。

**Q: 插件无法加载？**

确认 `enabledPlugins` 配置正确，插件名称格式为 `plugin-name@namespace`。

---

本文档与[配置迁移指南](/blog/claude-code/migrate-configuration)互补，前者侧重插件市场，本文侧重完整配置复刻。

---
title: Claude Code 配置迁移部署指南
description: 将当前 Claude Code 的自定义规则、插件市场、快捷键配置完整迁移到新机器的步骤。
date: 2026-04-01
tags:
  - Claude Code
  - 配置
  - 迁移
---

# Claude Code 配置迁移部署指南

用了一段时间 Claude Code 打磨出一套顺手的规则和插件配置，换机器的时候怎么完整迁移过来？本文记录完整步骤。

## 当前配置概览

我的 Claude Code 配置结构：

```
C:\Users\zwh\.claude\
├── config.json              # 主配置
├── keybindings.json         # 自定义快捷键
├── rules/
│   ├── common/              # 全局通用规则
│   │   ├── agents.md        # 代理编排规范
│   │   ├── code-review.md  # 代码检查标准
│   │   ├── coding-style.md  # 编码风格
│   │   ├── development-workflow.md  # 开发流程
│   │   ├── git-workflow.md  # Git 提交规范
│   │   ├── global.md        # 全局操作规范
│   │   ├── hooks.md         # 钩子系统
│   │   ├── patterns.md      # 常见设计模式
│   │   ├── performance.md   # 性能优化策略
│   │   ├── security.md      # 安全检查清单
│   │   └── testing.md       # 测试覆盖率要求
│   └── cpp/                 # C++ 特定规则
│       ├── ...
├── plugins/
│   └── marketplaces/
│       └── everything-claude-code/  #  everything-claude-code 插件市场
└── projects/                # 项目级会话缓存（可忽略）
```

## 迁移步骤

### 1. 在新机器安装 Claude Code

先去官网下载安装最新版 Claude Code：

```
https://claude.ai/download
```

安装完成后，至少启动一次 Claude Code 让它创建目录结构：

```bash
claude
```

退出（`/exit`），然后开始迁移。

### 2. 迁移全局规则

全局规则是最核心的配置，我的所有操作规范都在这里。

**在旧机器**，压缩 rules 目录：

```powershell
# 从旧机器导出
Compress-Archive -Path $env:USERPROFILE\.claude\rules -DestinationPath claude-rules.zip
```

**在新机器**，解压：

```powershell
# 解压到 .claude 目录
Expand-Archive -Path claude-rules.zip -DestinationPath $env:USERPROFILE\.claude\
```

如果遇到文件被占用，关闭 Claude Code 再解压。

### 3. 迁移 everything-claude-code 插件市场

我装了 `everything-claude-code` 插件市场，里面有大量预置技能和代理，这一步也完整迁移过去。

**在旧机器**，压缩插件目录：

```powershell
Compress-Archive -Path $env:USERPROFILE\.claude\plugins -DestinationPath claude-plugins.zip
```

**在新机器**，解压：

```powershell
Expand-Archive -Path claude-plugins.zip -DestinationPath $env:USERPROFILE\.claude\
```

### 4. 迁移快捷键配置（可选）

如果自定义了快捷键，一并迁移 `keybindings.json`：

```powershell
# 复制过去就行
copy keybindings.json $env:USERPROFILE\.claude\
```

我的常用快捷键：默认已经够用，没改多少，所以这一步可以跳过。

### 5. 配置 API Key

`config.json` 内容很简单：

```json
{
  "primaryApiKey": "any"
}
```

实际的 API Key 由 Claude App 管理，这里不需要动。第一次启动 Claude Code 会自动读取。

## 项目级 CLAUDE.md 指南

每个项目根目录放一个 `CLAUDE.md`，存放项目特定指令。这是我目前的模板：

```markdown
# CLAUDE.md

本文档为 Claude Code 在本代码库中的操作指南。

## 常用命令

- 安装依赖: `npm install`
- 启动开发: `npm run dev`
- 类型检查: `npm run check`
- 生产构建: `npm run build`
- 代码格式化: `npm run format`

## 架构概览

在这里写项目技术栈、结构、Schema 要求。

## 重要提示

环境要求、依赖注意事项。
```

好处：Claude 打开项目第一时间就会读取，上下文永远正确。

## 关键规则说明

我的全局规则核心要点：

### 代理编排 (`agents.md`)

| 场景 | 使用代理 |
|------|----------|
| 复杂功能实现 | `planner` |
| 刚写完代码 | `code-reviewer` |
| 新增功能/修复 Bug | `tdd-guide` |
| 架构决策 | `architect` |

强制并行执行独立任务，不串行。

### 代码审查 (`code-review.md`)

**必须触发审查：**
- 写完/修改代码后
- 合并到共享分支前
- 安全敏感代码变更
- 架构变更

**检查清单：**
- 代码可读性良好，命名规范
- 函数 < 50 行，文件 < 800 行
- 嵌套不超过 4 层
- 错误处理显式
- 无硬编码秘钥
- 无调试 `console.log`
- 新功能有测试
- 测试覆盖率 ≥ 80%

### 编码风格 (`coding-style.md`)

- **不可变数据**：永远创建新对象，不修改原对象
- **文件组织**：多个小文件优于几个大文件，按功能领域组织
- **错误处理**：每个层级都处理，UI 给友好信息，服务端记详细日志
- **输入验证**：系统边界必须验证，失败快退

### Git 工作流 (`git-workflow.md`)

提交格式：
```
<type>: <description>
```

类型：`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

危险操作（`push -f`, `reset --hard`, `rebase`, `branch -D`）必须提示用户确认，不能自动执行。

### 安全检查 (`security.md`)

每次提交前必须检查：
- [ ] 无硬编码秘钥
- [ ] 所有用户输入都验证
- [ ] SQL 注入预防（参数化查询）
- [ ] XSS 预防（转义 HTML）
- [ ] CSRF 启用
- [ ] 认证授权验证
- [ ] 限流
- [ ] 错误信息不泄露敏感数据

## 迁移后验证

迁移完成后，启动 Claude Code 验证一切正常：

```bash
claude
```

验证插件能正常加载：输入 `/` 应该能看到 `everything-claude-code:` 前缀的各种技能。

验证规则生效：随便打开一个项目，Claude 应该会读取 `CLAUDE.md` 和全局规则。

## 备份建议

定期备份整个 `.claude` 目录（排除 `projects` 和 `telemetry`）：

```powershell
# 备份脚本示例
$exclude = @("projects", "telemetry")
Compress-Archive -Path $env:USERPROFILE\.claude\* -DestinationPath claude-backup-$(Get-Date -Format 'yyyyMMdd').zip -Exclude $exclude
```

存到云端或者U盘，换机器直接解压就能用，不用重新折腾一遍。

## 注意事项

- **权限问题**: Windows 下，如果 Claude Code 正在运行，替换文件可能会被拒绝。解决：关闭 Claude Code 再操作。
- **跨平台路径**: Windows 是 `C:\Users\<用户名>\.claude`，macOS/Linux 是 `~/.claude`，解压的时候注意对应位置。
- **API Key 不用迁移**: API Key 登录 Claude App 后会自动同步，`config.json` 只需要占位，不用从旧机器拷贝。

## 最终效果

迁移完打开 Claude Code，所有规则、插件、技能和旧机器完全一致，不用重新适应，开箱即用。

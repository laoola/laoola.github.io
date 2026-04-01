---
title: Continuous Learning v2.1 hook error 问题解决
description: 解决 Windows Git Bash 环境下 Continuous Learning 钩子脚本总是报错退出码 49 的问题
date: 2026-04-01
tags: [Claude Code, 排错, ECC, 插件]
---

# Continuous Learning v2.1 hook error 问题解决

## 问题现象

配置完 everything-claude-code 的 Continuous Learning v2.1 后，每次工具调用都会显示类似错误：

```
⎿  PreToolUse:AskUserQuestion hook error
⎿  PostToolUse:AskUserQuestion hook error
⎿  PreToolUse:Read hook error
⎿  PostToolUse:Read hook error
```

虽然不影响 Claude Code 正常工作，但每次都报错影响体验，而且观察记录也无法写入。

## 根因分析

在 Windows 环境的 Git Bash 中，`python3` 命令存在但实际运行被拦截：

```bash
$ which python3
/c/Users/zwh/AppData/Local/Programs/Python/Python313/python
$ python3 --version
Exit code: 49
```

`which python3` 能找到命令，但是实际执行 `python3` 时返回退出码 **49**，运行失败。

而 `python` 命令运行正常：

```bash
$ which python
/c/Users/zwh/AppData/Local/Programs/Python/Python313/python
$ python --version
Python 3.13.7
Exit code: 0
```

Continuous Learning 的 Python 探测逻辑会优先选择 `python3`，导致所有调用 Python 的地方都失败了。

## 解决方案

在 `~/.claude/settings.json` 的 `env` 配置中，添加一行 `CLV2_PYTHON_CMD` 强制指定 Python 命令：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token-here",
    "ANTHROPIC_BASE_URL": "https://ark.cn-beijing.volces.com/api/coding",
    "HTTP_PROXY": "http://127.0.0.1:10808",
    "HTTPS_PROXY": "http://127.0.0.1:10808",
    "CLV2_PYTHON_CMD": "python"
  }
}
```

`CLV2_PYTHON_CMD` 是 Continuous Learning v2.1 预留的环境变量，会覆盖自动探测的结果。

## 验证修复

修改保存后，下次工具调用就不会再报错了。可以手动测试验证：

```bash
$ export CLV2_PYTHON_CMD=python
$ echo '{"tool_name": "test", "cwd": "/c/GitCode/dlp5.2", "session_id": "test"}' \
  | ~/.claude/plugins/cache/affaan-m-everything-claude-code/everything-claude-code/1.9.0/skills/continuous-learning-v2/hooks/observe.sh pre
$ echo "Exit code: $?"
Exit code: 0
```

退出码为 0 说明运行成功。

## 环境差异说明

这个问题只出现在特定的 Windows 环境下：

| 环境 | 是否会遇到 |
|------|-----------|
| Linux / macOS | 通常 `python3` 可用，不会遇到 |
| Windows + WSL | 通常 `python3` 可用，不会遇到 |
| Windows + Git Bash | 可能遇到本文描述的问题 |

判断方法：

```bash
# 运行这两个命令看看退出码
python3 -c "print('ok')"
echo "python3 exit code: $?"

python -c "print('ok')"
echo "python exit code: $?"
```

如果 `python3` 返回非 0 而 `python` 返回 0，就需要本文的修复。

## 为什么会这样？

这是 Python 安装器在 Windows 上的一个历史遗留问题：

- 安装程序默认注册 `python` 命令，不强制创建 `python3` 链接
- 某些环境下即使创建了 `python3`，也会被系统拦截无法执行
- Continuous Learning 的探测逻辑遵循 *nix 习惯优先尝试 `python3`

通过环境变量覆盖是官方预留的解决方案，不需要修改脚本代码。

## 其他相关配置

Continuous Learning v2.1 完整配置示例：

```json
{
  "env": {
    "CLV2_PYTHON_CMD": "python"
  },
  "enabledPlugins": {
    "everything-claude-code@affaan-m-everything-claude-code": true
  },
  "hooks": {
    "PreToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "C:/Users/zwh/.claude/plugins/cache/affaan-m-everything-claude-code/everything-claude-code/1.9.0/skills/continuous-learning-v2/hooks/observe.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "C:/Users/zwh/.claude/plugins/cache/affaan-m-everything-claude-code/everything-claude-code/1.9.0/skills/continuous-learning-v2/hooks/observe.sh"
      }]
    }]
  }
}
```

## 总结

| 项目 | 说明 |
|------|------|
| 现象 | 所有工具调用都显示 `hook error`，退出码 49 |
| 根因 | Git Bash 中 `python3` 无法执行，`python` 正常 |
| 修复 | 添加环境变量 `CLV2_PYTHON_CMD=python` |
| 验证 | 测试钩子脚本返回退出码 0 即修复成功 |

修复完成后，Continuous Learning 会开始记录你的每次工具调用，后台自动分析提取编码模式作为本能，随着使用次数增加会越来越贴合你的习惯。

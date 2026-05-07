---
title: Claude Code Hook 报错排查实录：Windows Store Python Stub 问题
description: 记录一次 Claude Code hook 报错的完整排查过程，根因是 Windows Store Python stub 返回退出码 49，附修复方案
date: 2026-05-07
tags:
  - Claude Code
  - 故障排查
  - Python
  - Windows
---
# Claude Code Hook 报错排查实录：Windows Store Python Stub 问题

## 问题现象

在使用 Claude Code 时，每次执行命令都会看到类似的 non-blocking hook 报错：

```
PreToolUse:Bash hook error - Failed with non-blocking status code: No stderr output
PostToolUse:Bash hook error - Failed with non-blocking status code: No stderr output
```

26 hooks 加载成功，功能正常运行，但错误信息持续出现。

## 排查过程

### 1. 初步分析

错误信息 "Failed with non-blocking status code" 表明 hook 脚本返回了非零退出码，但被捕获为 non-blocking 而非阻塞。问题指向 `continuous-learning-v2` 技能的 `observe.sh` 脚本。

### 2. 直接测试

手动运行 observe.sh 检查返回值：

```bash
echo '{}' | HOOK_PHASE=pre bash ~/.claude/skills/continuous-learning-v2/hooks/observe.sh pre
# 返回: EXIT:49
```

退出码 49 异常——正常应该返回 0。

### 3. 追踪 Python 问题

检查 `python3` 的实际指向：

```bash
which python3
# /c/Users/zwh/AppData/Local/Microsoft/WindowsApps/python3
```

这个路径指向 **Windows Store stub**，不是真正的 Python 解释器。当执行 `python3 --version` 时，返回退出码 49（表示程序不可用或需要安装）。

### 4. 根因定位

脚本中的 `set -e` 会在任何命令返回非零时终止脚本。而 `resolve_python_cmd()` 函数只检查 `command -v python3`（命令是否存在），没有验证该命令是否真正可用。

```bash
# 这个检查通过了
command -v python3  # 返回 0，表示命令存在

# 但实际运行会失败
python3 -c 'print(1)'  # 退出码 49
```

### 5. 真正的 Python 路径

系统中存在可用的 Python，但不在 PATH 的前面位置：

```
/c/Users/zwh/AppData/Local/Programs/Python/Python313/python
```

## 修复方案

修改 `resolve_python_cmd()` 函数，添加实际运行验证，而不仅仅是检查命令是否存在：

```bash
resolve_python_cmd() {
  # Try python3 with verification
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c 'print(1)' >/dev/null 2>&1; then
      printf '%s\n' python3
      return 0
    fi
  fi

  # Try python with verification
  if command -v python >/dev/null 2>&1; then
    if python -c 'print(1)' >/dev/null 2>&1; then
      printf '%s\n' python
      return 0
    fi
  fi

  return 1
}
```

需要修改的文件：

- `~/.claude/skills/continuous-learning-v2/hooks/observe.sh`
- `~/.claude/skills/continuous-learning-v2/scripts/detect-project.sh`

## 验证结果

修复后测试：

```bash
echo '{}' | HOOK_PHASE=pre bash ~/.claude/skills/continuous-learning-v2/hooks/observe.sh pre
# 返回: EXIT:0 ✅

echo '{}' | HOOK_PHASE=post bash ~/.claude/skills/continuous-learning-v2/hooks/observe.sh post
# 返回: EXIT:0 ✅
```

Claude Code reload 也确认 0 errors：

```
Reloaded: 3 plugins · 70 skills · 53 agents · 26 hooks · 6 plugin MCP servers · 0 plugin LSP servers
```

## 经验总结

1. **Windows Store stub 问题**：Windows 上的 Python 可能通过 Store 重定向，stub 会返回退出码 49 表示"需要安装"而非"命令不存在"
2. **`command -v` 不可靠**：它只检查命令是否存在，不验证是否真正可用
3. **实际运行验证是必要的**：`python3 -c 'print(1)'` 这种实际执行才能确认解释器可用
4. **set -e 会放大问题**：脚本中的 `set -e` 会在任何非零退出时终止，需要在关键函数后添加 `|| true` 或修复函数逻辑

## 相关文件

- `~/.claude/settings.json` - Claude Code 全局配置
- `~/.claude/skills/continuous-learning-v2/hooks/observe.sh` - Hook 脚本
- `~/.claude/skills/continuous-learning-v2/scripts/detect-project.sh` - 项目检测脚本

## 参考

- [Claude Code 配置复刻指南](/blog/tools/claude-code-config-replicate)

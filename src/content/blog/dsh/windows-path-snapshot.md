---
title: 命令找不到，不等于没安装：Windows 环境变量快照如何骗过 AI Agent
description: 从一次 gh CLI 误排出发，拆开安装状态、进程 PATH 与父进程继承，给 AI Agent 一套不误判、不乱重启的排查顺序。
date: 2026-11-04
tags: [Windows, DSH, AI Agent, 排错]
draft: false
---

Agent 在终端里执行 `gh --version`，返回“找不到命令”。它很快得出结论：机器没有安装 GitHub CLI。

但真实情况是：`gh.exe` 已安装，用户和系统 PATH 也配置了安装目录；找不到命令的只是 Agent 当前那条进程链。

更值得注意的是，我在写这篇文章时重新检查，当前会话已经能正常解析 `gh`。进程、用户和系统 PATH 都包含真实安装目录，版本为 2.102.0。旧故障没有在今天继续复现。

所以，这篇文章讨论的不是一个永远存在的 bug，而是一种很容易误判的环境机制：**命令解析结果只代表当前进程，不等于整台机器的安装状态。**

## 先拆开三个不同的问题

“执行 `gh` 失败”至少可能对应三种情况：

| 问题 | 要检查的对象 | 典型证据 |
|---|---|---|
| 工具是否存在 | 磁盘上的可执行文件 | `Test-Path`、安装目录、包管理器记录 |
| 当前 shell 能否解析命令 | 当前进程的 PATH、PATHEXT、别名和 shim | `Get-Command`、`where.exe` |
| 持久配置是否包含目录 | 用户和系统环境变量 | User / Machine 作用域的 PATH |

如果跳过前两层，直接把“当前 shell 找不到”写成“机器未安装”，后面的修复就会走偏：重复安装、修改 PATH，甚至重启正在工作的宿主。

AI Agent 更容易踩这个坑，因为它通常不直接面对桌面，而是通过宿主启动的终端工作。它看到的 PATH，是宿主传下来的环境，不一定等同于系统设置窗口里刚保存的内容。

## PATH 改了，旧进程为什么看不到

Microsoft Learn 对 Windows 环境变量的说明有两个关键点：

- 每个进程都有自己的环境块；
- 子进程默认继承父进程的环境变量。

可以把它简化成：

```text
旧终端或旧宿主：PATH = A
└─ 新启动的 pwsh：PATH = A

注册表里的持久配置：PATH = A + B
```

安装器把目录 B 写进了用户或系统 PATH，但这不会自动重写所有已运行进程的环境块。旧宿主再启动一个新的 PowerShell，子进程默认拿到的仍然是 A。

除非程序主动刷新自己的环境，或者由已经取得新环境的父进程重新启动，否则仅修改注册表不会让旧进程链立即获得新条目。

PowerShell 也有类似的作用域区别：

```powershell
$env:Path = "$env:Path;C:\Tools"
```

这只修改当前 PowerShell 会话，并影响它之后启动的子进程；不会修改系统设置，也不会反向更新父进程。

因此，“重启终端有没有用”取决于新终端由谁启动。只重启最里面的 shell，而它的父宿主仍持有旧环境，问题可能原样出现。

## 我的排查顺序

### 1. 先确认文件，不急着修 PATH

```powershell
$toolDir = 'C:\Program Files\GitHub CLI'
$exe = Join-Path $toolDir 'gh.exe'

Test-Path $exe
& $exe --version
```

全路径能执行，至少说明文件存在，基本的启动条件也满足。此时再检查裸命令：

```powershell
Get-Command gh -ErrorAction SilentlyContinue
where.exe gh
```

在 PowerShell 里建议写 `where.exe`。单独输入 `where` 可能命中 `Where-Object` 的别名，并不是 Windows 的查找程序。

### 2. 对比三种 PATH 视图

```powershell
$normalize = {
    param($value)

    @(
        $value -split ';' |
            Where-Object { $_ } |
            ForEach-Object { $_.TrimEnd('\') }
    )
}

[pscustomobject]@{
    ProcessPath = (& $normalize $env:Path) -contains $toolDir
    UserPath = (& $normalize ([Environment]::GetEnvironmentVariable('Path', 'User'))) -contains $toolDir
    MachinePath = (& $normalize ([Environment]::GetEnvironmentVariable('Path', 'Machine'))) -contains $toolDir
}
```

这里比较的是目标目录，不需要把完整 PATH 打印到日志里。完整 PATH 可能包含私人目录或其他不适合公开的信息。

结果可以这样解释：

| 文件与全路径调用 | 当前进程 PATH | 用户/系统 PATH | 优先判断 |
|---|---|---|---|
| 文件不存在 | 任意 | 任意 | 路径记错、未安装或安装位置变化 |
| 全路径也执行失败 | 任意 | 任意 | 权限、架构、依赖或程序本身问题，不应先修 PATH |
| 全路径可用，裸命令失败 | 没有目录 | 有目录 | 当前进程环境过旧，或父进程继承链未刷新 |
| 全路径可用，裸命令失败 | 有目录 | 有目录 | 检查命令名、PATHEXT、shim、别名和实际解析结果 |
| 裸命令可用 | 有目录 | 任意 | 当前问题不能归因于 PATH 快照 |

这张表也解释了为什么这次复查很重要：当前 `Get-Command gh` 已返回真实路径，三种 PATH 视图也都包含安装目录，就不能再沿用“现在仍然找不到”的旧结论。

## 全路径直调是绕路，不是万能修复

在自动化 Agent 场景里，我现在更倾向于先维护一份本机工具清单：

| 字段 | 用途 |
|---|---|
| 工具名 | 明确要调用的程序 |
| 可执行文件全路径 | 绕过当前 PATH 解析 |
| 版本 | 判断清单是否过旧 |
| 安全验证命令 | 例如 `--version`，只做只读检查 |
| 最后验证时间 | 防止清单本身变成过期记忆 |

Agent 找不到命令时，先查清单并尝试全路径；清单没有，再检查常见安装位置和包管理器记录，最后才判断“未安装”。

这条路线有两个优点：

1. 不因为 PATH 暂时不可见就重复安装工具；
2. 不为了刷新环境随意重启宿主，中断正在执行的工作。

但全路径不是万能修复。如果程序内部还会用裸命令启动其他子工具，或者它依赖一组相关环境变量，只修复最外层调用仍然不够。这时才需要考虑从已更新的环境重新启动整条宿主进程链。

重启之前同样要确认影响范围，不能为了排查一个命令，把用户正在运行的任务一起结束。

## 还有几种情况不能混为一谈

- **宿主主动过滤环境变量**：有些工具会有意控制传给子进程的变量，这与普通 PATH 继承过旧不是同一机制。
- **命令名或 shim 错误**：文件存在，不代表裸名称一定指向它；还要检查扩展名、包管理器 shim 和命令解析顺序。
- **程序启动后仍然失败**：`--version` 只验证基本启动，不等于登录、网络或核心功能都正常。
- **清单过期**：工具可能升级、迁移或卸载，所以清单必须带验证时间，并在结果冲突时重新检查磁盘。
- **所有缺失都归因于 PATH**：权限、执行策略、依赖缺失和架构不匹配，都可能表现为命令无法运行。

这也符合我在另一篇文章里采用的原则：环境记录是历史快照，当前检查结果才是本次排障的事实来源。相关讨论见[《我给 AI Agent 设计记忆系统》](/blog/dsh/agent-memory-layers/)。

## 给 Agent 的最终检查清单

下次再遇到“命令找不到”，我会按这个顺序处理：

- 确认可执行文件是否真实存在；
- 用全路径执行一个安全的只读验证命令；
- 检查 `Get-Command` 或 `where.exe` 的实际解析结果；
- 对比 Process、User、Machine 三种 PATH 视图；
- 区分 PATH 快照、宿主变量过滤、shim 和程序自身故障；
- 优先用经过验证的工具清单直调；
- 只有确有必要时，才刷新并重启整条父进程链；
- 不把一次历史故障写成当前仍然成立的结论。

对 AI Agent 来说，这条规则比“记得重启终端”更可靠：**先确定自己看到的是哪一层环境，再决定修哪一层。**

## 参考资料

- [Microsoft Learn：Environment Variables](https://learn.microsoft.com/en-us/windows/win32/procthread/environment-variables)
- [Microsoft Learn：about_Environment_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.5)

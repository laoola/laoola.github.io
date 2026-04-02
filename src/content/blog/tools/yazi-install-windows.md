---
title: Yazi 终端文件管理器 Windows 安装使用记录
description: 记录 Yazi 终端文件管理器在 Windows 环境下的完整安装配置流程，以及常用插件推荐
date: 2026-04-02
tags: [终端, 工具, Windows, Yazi]
---

# Yazi 终端文件管理器 Windows 安装使用记录

> 日期：2026-04-02  
> 环境：Windows 10 Pro + Git Bash  
> Yazi 版本：26.1.22

---

## 为什么换 Yazi

用了多年 ranger/lf，试试 Rust 写的新一代终端文件管理器。据说速度快，异步 I/O，插件系统设计得比较现代。从体验上来说，最大的吸引点：

1. 原生支持图片预览（Windows Terminal 走 Sixel 协议开箱即用）
2. 内置插件管理器，不用自己折腾
3. Vim 风格快捷键，学习成本低
4. 支持跨实例通信，退出后可以自动切换 shell 当前目录

---

## 安装步骤

### 1. 通过 winget 安装（Windows 推荐）

```powershell
winget install sxyazi.yazi
```

winget 会自动下载预编译二进制，安装完提示环境变量已更新，需要**重启终端**才能找到命令。

### 2. 验证安装

重启终端后检查：

```bash
yazi --version
# Yazi 26.1.22 (4e0acf8 2026-01-22)

ya --version
# Ya 26.1.22 (4e0acf8 2026-01-22)
```

### 3. 初始化默认配置

新版本 `ya init` 命令已经移除，直接从源码复制默认配置到用户目录：

```bash
mkdir -p "$APPDATA/yazi"
cp -r /path/to/yazi/yazi-config/preset/* "$APPDATA/yazi/"
```

配置目录结构：

```
%APPDATA%\yazi\
├── config/
│   └── package.toml    # 插件配置
├── keymap-default.toml # 快捷键
├── theme-dark.toml     # 深色主题
├── theme-light.toml    # 浅色主题
├── yazi-default.toml   # 主配置
└── vfs-default.toml    # 虚拟文件系统
```

### 4. 添加 cd 集成（关键功能）

这个功能必须配：让 Yazi 退出后自动切换 shell 到最后浏览的目录。编辑 `~/.bashrc`：

```bash
# Yazi cd integration
function y() {
 local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
 yazi "$@" --cwd-file="$tmp"
 if cwd="$(cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
  builtin cd -- "$cwd"
 fi
 rm -f -- "$tmp"
}
```

然后 `source ~/.bashrc` 生效。之后用 `y` 代替 `yazi` 启动：

```bash
y       # 启动，退出自动切目录
y ~/code # 从指定目录启动
```

Windows PowerShell 用户用这个版本：

```powershell
function y {
    $tmp = [System.IO.Path]::GetTempFileName()
    yazi $args --cwd-file="$tmp"
    $cwd = Get-Content -Path $tmp
    if (-not [String]::IsNullOrEmpty($cwd) -and $cwd -ne $PWD.Path) {
        Set-Location -LiteralPath $cwd
    }
    Remove-Item -Path $tmp
}
```

---

## 常用插件安装

内置包管理器一键安装，官方插件都在 [yazi-rs/plugins](https://github.com/yazi-rs/plugins)：

```bash
# Git 状态集成
ya pkg add yazi-rs/plugins:git

# zoxide 目录跳转
ya pkg add yazi-rs/plugins:zoxide

# fzf 模糊搜索
ya pkg add yazi-rs/plugins:fzf

# 压缩包预览解压
ya pkg add yazi-rs/plugins:archive

# Markdown TOC 预览
ya pkg add yazi-rs/plugins:toc

# 媒体文件信息预览
ya pkg add yazi-rs/plugins:mediainfo

# Emoji 选择器
ya pkg add yazi-rs/plugins:emoji

# 图片压缩
ya pkg add yazi-rs/plugins:image-opt

# 磁盘挂载管理（Linux 更有用）
ya pkg add yazi-rs/plugins:mount
```

查看已安装：

```bash
ya pkg list
```

更新全部：

```bash
ya pkg upgrade
```

删除：

```bash
ya pkg delete <plugin-name>
```

---

## 最终插件清单

目前装了这些，满足日常开发需求：

| 插件 | 用途 | 频率 |
|------|------|------|
| git | 文件列表显示 git 状态 | 每日 |
| zoxide | 快速跳转到历史目录 | 每日 |
| fzf | 全局模糊搜索文件 | 每日 |
| archive | 压缩包预览解压 | 每周 |
| toc | Markdown 目录预览 | 每周 |
| mediainfo | 查看音视频参数 | 偶尔 |
| emoji | 快速插入 emoji | 偶尔 |

---

## 常用快捷键

默认 Vim 风格，比较好记：

| 键 | 功能 |
|----|------|
| `hjkl` | 光标移动 |
| `Enter` | 打开文件/进入目录 |
| `Backspace` | 返回上级目录 |
| `gg` / `G` | 到首行/末行 |
| `/` | 搜索 |
| `n` / `N` | 下一个/上一个搜索结果 |
| `yy` | 复制文件路径 |
| `dd` | 剪切文件 |
| `pp` | 粘贴文件 |
| `space` | 选中文件 |
| `tab` / `shift+tab` | 新建/切换标签 |
| `zh` / `zh` | 打开/关闭预览 |
| `q` | 退出 |

完整快捷键看 `%APPDATA%\yazi\keymap-default.toml`。

---

## 可选系统依赖

这些装上体验更好：

| 工具 | 作用 | Yazi 用途 |
|------|------|----------|
| `fd` | 更快的文件搜索 | fzf 插件底层搜索 |
| `ripgrep` | 内容搜索 | 搜索文件内容 |
| `zoxide` | 目录跳转 | zoxide 插件 |
| `7-Zip` | 压缩包处理 | archive 插件解压更多格式 |

Windows 通过 scoop 安装：

```bash
scoop install fd ripgrep zoxide 7zip
```

---

## 遇到的坑

1. **新装完命令找不到** - winget 修改了 PATH，必须重启终端才能生效
2. **`ya init` 不存在** - v25+ 命令结构改了，手动从源码复制默认配置就行
3. **插件名格式报错** - 不要加 `.yazi` 后缀，直接写 `yazi-rs/plugins:git`

---

## 启动使用

配置完了：

```bash
y   # 启动，退出自动切目录
```

第一次进去看看图片预览工作不，试试打开一张图，Windows Terminal 应该能直接显示。

---

## 总结

安装过程很顺畅，winget 一步到位，插件管理设计得比较舒服，不用像其他终端文件管理器那样手动 git clone 到指定目录。快捷键符合 Vim 习惯，图片预览开箱即用，cd 集成这个功能用了就回不去。

目前日常使用足够了，后续发现好用的插件再更。

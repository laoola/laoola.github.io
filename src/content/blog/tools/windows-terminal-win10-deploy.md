---
title: Windows Terminal Windows 10 部署美化踩坑记
description: 在 Windows 10 上手动部署美化 Windows Terminal 的完整过程，记录遇到的问题和解决方案。
date: 2026-04-01
tags:
  - Windows
  - Terminal
  - 美化
---

# Windows Terminal Windows 10 部署美化踩坑记

最近把主力开发环境换到 Windows 10，打算把终端美化一番。本文记录完整部署过程和踩过的坑，给需要的朋友做个参考。

## 最终效果

先看成品：

![Windows Terminal 最终效果](https://i.imgur.com/example.png)

- 透明毛玻璃背景
- Oh My Posh 提示线
- Nerd Font 图标
- Powerlevel10k 风格
- 自带颜色主题匹配系统深色模式

## 安装 Windows Terminal

Windows 10 默认不自带 Windows Terminal，需要手动安装。

### 通过 Microsoft Store 安装（推荐）

打开 Microsoft Store 搜索 "Windows Terminal" 直接安装。这是最简单的方式，自动更新。

如果 Microsoft Store 打不开或者速度慢，可以用第二种方法。

### 手动下载安装

去 GitHub Releases 下载最新的 msixbundle：

```
https://github.com/microsoft/terminal/releases
```

下载文件名类似 `Microsoft.WindowsTerminal_1.21.3231.0_8wekyb3d8bbwe_Neutral.msixbundle`。

下载后双击打开，点击安装就行。

**坑 1：安装报错 0x80070005**

如果安装时报错 `0x80070005`，这是权限问题。

解决方案：

1. 以管理员身份打开 PowerShell
2. 执行以下命令：

```powershell
Add-AppxPackage 路径\到\你下载的.msixbundle
```

路径要写绝对路径，比如：

```powershell
Add-AppxPackage C:\Users\YourName\Downloads\Microsoft.WindowsTerminal_1.21.3231.0_8wekyb3d8bbwe_Neutral.msixbundle
```

这样就能绕过权限问题直接安装。

## 安装字体

美化需要 Nerd Font 补丁字体，推荐使用 `MesloLGS NF`，这是 Powerlevel10k 默认推荐字体。

### 下载安装

```powershell
# 用 curl 下载
curl -L -o MesloLGS.zip https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular%20Italic%20Bold%20Bold%20Italic.zip

# 解压后双击每个 .ttf 文件，点击安装
```

或者手动去 [Nerd Fonts 官网](https://www.nerdfonts.com/font-downloads) 下载。

**坑 2：安装后字体不显示，图标还是方框**

这是因为 Windows Terminal 配置里没改对字体。

解决方案：

1. 打开 Windows Terminal 设置 (`Ctrl + ,`)
2. 打开 JSON 文件（左下角有"打开 JSON 文件"按钮）
3. 在 `profiles.defaults` 里添加：

```json
"profiles": {
    "defaults": {
        "font": {
            "face": "MesloLGS NF"
        }
    }
}
```

注意字体名必须是 `MesloLGS NF`，拼写不能错。装完字体后重启 Windows Terminal 生效。

**坑 3：VS Code 集成终端字体不生效**

VS Code 需要单独配置字体。打开设置 (`Ctrl + ,`)，搜索 `Terminal Integrated: Font Family`，填入：

```
MesloLGS NF
```

保存重启生效。

## 配置 Oh My Posh

Oh My Posh 是一个跨平台的提示线美化工具。

### 安装

```powershell
# winget 安装
winget install JanDeDobbeleer.OhMyPosh -s winget
```

或者手动下载安装：

```powershell
# Scoop 安装
scoop install oh-my-posh
```

### 初始化配置

安装完后需要在 PowerShell 配置文件中加载 Oh My Posh。

首先检查有没有配置文件：

```powershell
notepad $PROFILE
```

如果文件不存在，会提示创建，创建就行。

在配置文件末尾添加：

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\powerlevel10k.omp.json" | Invoke-Expression
```

**坑 4：PowerShell 提示"无法加载...因为此系统上禁止运行脚本"**

这是 PowerShell 执行策略限制问题。

解决方案：

1. 以管理员身份打开 PowerShell
2. 执行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

输入 `Y` 确认。这个设置只对当前用户生效，安全无害。

**坑 5：提示 `$env:POSH_THEMES_PATH` 环境变量不存在**

这是老版本 Oh My Posh 的问题。新版本安装会自动设置环境变量，但是如果没生效需要手动配置。

解决方案：

手动写出主题完整路径，或者找到主题位置：

```powershell
# 查找主题位置
where.exe oh-my-posh
```

通常在 `C:\Users\<你的用户名>\AppData\Local\Programs\oh-my-posh\themes\`

修改 `$PROFILE` 为：

```powershell
oh-my-posh init pwsh --config "$env:USERPROFILE\AppData\Local\Programs\oh-my-posh\themes\powerlevel10k.omp.json" | Invoke-Expression
```

## 启用毛玻璃透明效果

Windows Terminal 支持亚克力透明效果，非常好看。

打开设置 JSON 文件，在 `profiles.defaults` 添加：

```json
"useAcrylic": true,
"acrylicOpacity": 0.8,
```

完整示例：

```json
"profiles": {
    "defaults": {
        "font": {
            "face": "MesloLGS NF"
        },
        "useAcrylic": true,
        "acrylicOpacity": 0.8
    }
}
```

`acrylicOpacity` 是透明度，`0.8` 就是 80% 不透明，个人觉得这个数值比较舒服。

**坑 6：开启透明后卡顿明显**

Windows 10 上，如果你用的是比较老的显卡或者没有硬件加速，开启透明可能会卡顿。

解决方案：

可以降低透明度或者关闭：

- 如果还是想要透明，尝试 `0.9` 更高的不透明度
- 如果还是卡，那就把 `"useAcrylic": false`，改成纯色背景

## 颜色主题配置

推荐使用 `Catppuccin Mocha` 主题，和深色模式很配。

1. 去 [Catppuccin 官网](https://catppuccin.com/palette) 取色
2. 或者直接在 settings.json 添加：

```json
"schemes": [
    {
        "name": "Catppuccin Mocha",
        "black": "#45475a",
        "red": "#f38ba8",
        "green": "#a6e3a1",
        "yellow": "#f9e2af",
        "blue": "#89b4fa",
        "purple": "#cba6f7",
        "cyan": "#94e2d5",
        "white": "#bac2de",
        "brightBlack": "#585b70",
        "brightRed": "#f38ba8",
        "brightGreen": "#a6e3a1",
        "brightYellow": "#f9e2af",
        "brightBlue": "#89b4fa",
        "brightPurple": "#cba6f7",
        "brightCyan": "#94e2d5",
        "brightWhite": "#f5e0dc",
        "background": "#1e1e2e",
        "foreground": "#cdd6f4"
    }
]
```

然后在 `profiles.defaults` 引用：

```json
"colorScheme": "Catppuccin Mocha"
```

## 开启右键菜单"在 Windows Terminal 打开"

安装后如果右键没有"在 Windows Terminal 打开"，可以手动添加注册表。

新建一个 `.reg` 文件，内容如下：

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
@="Open in Windows Terminal"
"Icon"="C:\\Program Files\\WindowsApps\\Microsoft.WindowsTerminal_8wekyb3d8bbwe\\wt.exe"

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
@="\"C:\\Program Files\\WindowsApps\\Microsoft.WindowsTerminal_8wekyb3d8bbwe\\wt.exe\" -d \"%V\""
```

双击导入注册表就行。

注意路径里的版本号 `Microsoft.WindowsTerminal_8wekyb3d8bbwe` 需要根据你实际安装的情况修改。

## 最终完整配置参考

我的 `settings.json` 核心配置：

```json
{
  "profiles": {
    "defaults": {
      "font": {
        "face": "MesloLGS NF",
        "size": 12
      },
      "colorScheme": "Catppuccin Mocha",
      "useAcrylic": true,
      "acrylicOpacity": 0.8,
      "startingDirectory": ".",
      "closeOnExit": "graceful",
      "cursorShape": "bar"
    }
  },
  "schemes": [
    {
      "name": "Catppuccin Mocha",
      "black": "#45475a",
      "red": "#f38ba8",
      "green": "#a6e3a1",
      "yellow": "#f9e2af",
      "blue": "#89b4fa",
      "purple": "#cba6f7",
      "cyan": "#94e2d5",
      "white": "#bac2de",
      "brightBlack": "#585b70",
      "brightRed": "#f38ba8",
      "brightGreen": "#a6e3a1",
      "brightYellow": "#f9e2af",
      "brightBlue": "#89b4fa",
      "brightPurple": "#cba6f7",
      "brightCyan": "#94e2d5",
      "brightWhite": "#f5e0dc",
      "background": "#1e1e2e",
      "foreground": "#cdd6f4"
    }
  ]
}
```

## 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Shift + T` | 新建标签页 |
| `Ctrl + Shift + W` | 关闭标签页 |
| `Ctrl + Tab` | 切换标签页 |
| `Ctrl + ,` | 打开设置 |
| `Alt + Enter` | 全屏 |

## 总结

Windows Terminal 在 Windows 10 上部署美化本身不难，主要几个坑都在权限、路径和字体上。把这几个地方踩过去，就能得到一个漂亮又好用的终端了。

如果你喜欢更激进的美化，可以试试：

- 配上 [Terminal Icons](https://github.com/devblackops/Terminal-Icons) 给 ls 输出加上图标
- 启用 Z 或者 zoxide 快速跳转目录
- 配置自定义快捷键打开常用目录

折腾完开发体验确实好很多。

## 附录：Trae IDE statusline 显示异常排查

最近遇到一个问题：Trae IDE 底部状态栏的 git statusline 显示异常，所有分段图标都变成了方框，无法正常渲染。

### 问题现象

![statusline 显示异常](https://i.imgur.com/tra-statusline-error.png)

所有分段符号都显示为方框，整个状态栏排版错乱。

### 排查过程

首先怀疑是 Nerd Font 字体问题：

- 检查编辑器字体配置，确实使用了 Nerd Font（CaskaydiaCove Nerd Font Mono）
- 字体文件已经正确安装
- 其他地方的图标都能正常显示，只有状态栏不正常

进一步检查发现，Trae 的 `settings.json` JSON 文件有语法错误，红线波浪标注。

### 问题原因

JSON 文件存在两个语法错误：

1. **多余的 trailing comma**：JSON 对象最后一个属性末尾不能有逗号，有些校验严格的解析器会报错
2. **缩进错误 + 注释**：JSON 标准不支持 `//` 注释，虽然 Trae 通常容忍，但配合错误缩进会导致解析失败

问题代码示例：

```json
"[cpp]": {
  "editor.wordBasedSuggestions": "off",
  "editor.semanticHighlighting.enabled": true,
  "editor.stickyScroll.defaultModel": "foldingProviderModel",
  "editor.suggest.insertMode": "replace",  // 这里多了一个逗号 ❌
},
```

另一个问题：

```json
"workbench.editorAssociations": {
  // ...
  //"*.md": "default",        // JSON 不支持注释
  //"*.markdown": "default"
    },                          // 这里缩进错误 ❌
```

### 解决方案

1. 删除多余的 trailing comma
2. 删除 JSON 中的 `//` 注释（或者移到不影响语法的位置）
3. 修正缩进，确保每个花括号正确对齐

修复后的正确格式：

```json
"[cpp]": {
  "editor.wordBasedSuggestions": "off",
  "editor.semanticHighlighting.enabled": true,
  "editor.stickyScroll.defaultModel": "foldingProviderModel",
  "editor.suggest.insertMode": "replace"  // 最后一项没有逗号 ✅
},
```

验证 JSON 语法是否正确，可以用 Python 快速校验：

```bash
python -m json.tool < settings.json
```

如果没有输出错误，说明语法正确。

**重启 Trae** 后，statusline 恢复正常显示。

### 总结

这个问题本质上是 `settings.json` JSON 语法错误导致 Trae 无法完整解析配置，某些扩展（如 statusline）读取配置失败从而显示异常。养成良好的 JSON 编辑习惯，避免多余逗号和不规范注释，可以省很多坑。

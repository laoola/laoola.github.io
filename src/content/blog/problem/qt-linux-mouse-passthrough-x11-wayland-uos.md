---
title: Qt Linux 窗口鼠标穿透：从 X11 XShape 迁移到 Wayland（统信 UOS）
description: 记录 Qt Linux 悬浮窗口从 X11 XShape 迁移到 Wayland 时的鼠标穿透实现，说明 QWindow::setMask 的平台行为与常见排错方法。
date: 2026-07-29
tags:
  - Qt
  - Linux
  - Wayland
  - X11
  - 统信 UOS
---

## 前言

开发 Linux 桌面悬浮窗口时，经常需要让**窗口大部分区域支持鼠标穿透，仅保留一小块区域接收点击**。

在 X11 环境下，可以使用 XShape 扩展设置窗口的输入区域。迁移到 Wayland 后，X11 原生接口无法继续使用，需要改由 Qt 平台抽象或 Wayland 的 `wl_surface` 输入区域实现。

本文记录在统信 UOS 上迁移该功能时遇到的问题，并结合 Qt 文档和 Qt Wayland 源码，说明一套同时适用于 X11 与 Wayland 的实现思路。

## 一、X11 方案：使用 XShape 设置输入区域

X11 的 XShape 扩展可以分别控制窗口的边界区域和输入区域。通过设置 `ShapeInput`，可以让窗口只在指定区域接收鼠标事件。

下面的示例仅保留左上角 `1 × 1` px 区域接收输入：

```cpp
// Qt 5 + Qt X11 Extras
Display *display = QX11Info::display();
XRectangle inputRectangle = {0, 0, 1, 1};

XShapeCombineRectangles(
    display,
    winId(),
    ShapeInput,
    0,
    0,
    &inputRectangle,
    1,
    ShapeSet,
    YXBanded
);
```

如果传入空矩形列表，则会清空整个输入区域，窗口将完全不接收鼠标事件：

```cpp
XShapeCombineRectangles(
    display,
    winId(),
    ShapeInput,
    0,
    0,
    nullptr,
    0,
    ShapeSet,
    YXBanded
);
```

该方案在 X11 会话中简单直接，但它依赖 X11 扩展，无法在原生 Wayland 会话中使用。

> `QX11Info` 属于 Qt 5 的 Qt X11 Extras 模块，Qt 6 已将其移除。Qt 6 项目需要通过 `QNativeInterface::QX11Application` 获取 X11 Display，不能直接复制上述代码。

## 二、跨平台方案：使用 `QWindow::setMask()`

Qt 提供了公开 API `QWindow::setMask()`。根据 Qt 官方文档，窗口 Mask 会向窗口系统表明：应用不希望在指定区域之外接收鼠标或触摸输入。

对本文的局部点击需求，可以只保留左上角 `1 × 1` px 输入区域：

```cpp
void setWindowInputRegion(WId wid, const QRegion &inputRegion)
{
    QWidget *widget = QWidget::find(wid);
    if (!widget) {
        qWarning() << "setWindowInputRegion: widget not found";
        return;
    }

    QWindow *window = widget->windowHandle();
    if (!window) {
        qWarning() << "setWindowInputRegion: window handle not found";
        return;
    }

    window->setMask(inputRegion);
}
```

调用方式：

```cpp
setWindowInputRegion(this->winId(), QRegion(0, 0, 1, 1));
```

这种写法不直接依赖 XShape 或 Wayland 私有 API，由 Qt 当前使用的平台插件负责转换为底层窗口系统操作。

### 为什么它能在 Wayland 下生效

Qt Wayland 5.15 的 `QWaylandWindow::setMask()` 已经将 `QRegion` 转换为 `wl_region`，并调用 `wl_surface.set_input_region()`。因此，在使用 Qt Wayland 平台插件时，`setMask()` 映射到 Wayland 标准输入区域并不是统信 UOS 独有行为。

统信 UOS 上测试成功，说明当前 Qt Wayland 平台插件和 KWin 合成器正确处理了输入区域。除非厂商文档明确说明，否则不应直接将这一行为归因于 UOS 私有补丁。

### Mask 不等于视觉裁切

`QWindow::setMask()` 的主要语义是限制输入区域。Qt 文档同时指出，窗口管理器可以选择是否显示 Mask 之外的区域。

因此：

- 不要把 `setMask()` 当作可靠的视觉裁切接口；
- 如果窗口外观需要透明，应单独设置透明背景并正确清除透明区域；
- 输入区域和窗口最终显示效果需要分别测试。

## 三、Wayland `input_region` 的关键语义

Wayland 使用 `wl_surface.set_input_region()` 指定 Surface 接收指针和触摸事件的区域：

- 事件发生在输入区域内时，由当前 Surface 接收；
- 事件发生在输入区域外时，会继续尝试传递给 Surface 堆栈中的下一个目标；
- 输入区域使用 Surface 本地坐标；
- 修改属于双缓冲状态，需要随 `wl_surface.commit` 提交。

这里有一个容易混淆的细节：

- 向 `wl_surface.set_input_region()` 传入一个**空的 `wl_region` 对象**，表示 Surface 不接收任何输入；
- 传入 `nullptr`，表示恢复为无限输入区域，即整个 Surface 都可以接收输入。

而在 Qt 的 `QWindow::setMask()` 语义中，空 `QRegion` 用于清除 Mask，并不等同于“完全鼠标穿透”。如果需要完整窗口穿透，不要简单调用：

```cpp
window->setMask(QRegion());
```

这通常会恢复窗口的完整输入区域。

## 四、局部穿透与完全穿透如何选择

### 局部区域仍需点击

如果窗口大部分区域穿透，但仍要保留按钮或拖动区域，应使用非空 `QRegion`：

```cpp
const QRegion clickableArea(0, 0, 120, 40);
window->setMask(clickableArea);
```

如果存在多个可点击区域，可以合并多个矩形：

```cpp
const QRegion clickableArea =
    QRegion(0, 0, 120, 40) |
    QRegion(200, 0, 80, 40);

window->setMask(clickableArea);
```

### 整个窗口完全穿透

如果窗口完全不需要接收输入，可以优先评估窗口级标志 `Qt::WindowTransparentForInput`：

```cpp
window->setFlag(Qt::WindowTransparentForInput, true);
```

该标志同样依赖平台插件支持，发布前必须在目标 Qt 版本、桌面环境和合成器上回归测试。

`Qt::WA_TransparentForMouseEvents` 是 QWidget 属性，主要影响 Qt 自身向该控件及其子控件分发鼠标事件，不应将它等同于原生窗口对下层应用的系统级鼠标穿透。

## 五、常见问题与排查顺序

### 1. 确认实际使用的平台插件

先打印 Qt 当前的平台名称：

```cpp
qDebug() << "Qt platform:" << QGuiApplication::platformName();
```

常见结果包括：

- `xcb`：程序运行在 X11 或 XWayland 路径；
- `wayland`、`wayland-egl`：程序运行在原生 Wayland 路径。

不能只根据桌面会话判断程序一定使用 Wayland。即使登录的是 Wayland 会话，Qt 程序仍可能通过 XWayland 使用 `xcb` 平台插件。

### 2. 仅对顶层原生窗口设置 Mask

`QLabel`、`QPushButton` 等普通子控件通常没有独立的平台窗口。应获取顶层窗口的 `QWindow`，不要对任意子控件直接执行窗口穿透逻辑。

### 3. 在平台窗口创建后调用

部分 Qt 版本要求底层 Surface 已经创建。若调用过早，Mask 可能没有同步到平台窗口。可以在顶层窗口显示后设置，或延迟到事件循环开始后执行：

```cpp
QTimer::singleShot(0, this, [this] {
    setWindowInputRegion(winId(), QRegion(0, 0, 1, 1));
});
```

### 4. 区域随布局变化时重新计算

Mask 使用窗口本地坐标。如果保留的点击区域会随窗口尺寸或布局变化，应在 Resize 或布局更新后重新计算，而不是始终复用旧坐标。

### 5. 检查 Qt 版本与运行环境

如果相同代码在不同系统上表现不一致，应依次检查：

1. Qt 版本和 Qt Wayland 插件版本；
2. 实际加载的是 `xcb` 还是 `wayland` 平台插件；
3. 调用时底层窗口是否已经创建；
4. 发行版是否修改了 Qt Wayland 插件；
5. 运行环境中是否存在禁用输入区域处理的 Qt Wayland 配置；
6. 合成器升级后是否出现行为回归。

## 六、是否需要 Qt Wayland 私有 API

对于常规的局部输入区域，优先使用公开的 `QWindow::setMask()`，通常不需要链接 `waylandclient-private`。

Qt 没有提供可跨版本稳定使用的公开 `QWaylandSurface::setInputRegion()` 客户端 API。若项目确实需要绕过 Qt 平台抽象，直接控制原生 `wl_surface`，就必须针对目标 Qt 版本使用 QPA 私有接口或 Wayland 原生接口，并承担以下成本：

- 私有头文件路径和类结构可能变化；
- Qt 小版本升级也可能导致编译失败；
- 需要自行处理 `wl_region` 生命周期和 `wl_surface.commit`；
- 需要为 Qt 5、Qt 6、X11 和 Wayland 分别维护实现与构建配置。

除非公开 API 无法满足明确需求，否则不建议把私有 API 作为默认方案。

## 七、总结

- **X11 原生方案：**可以使用 XShape 设置 `ShapeInput`，但代码不能迁移到原生 Wayland；
- **Qt 跨平台方案：**优先使用 `QWindow::setMask()`，由 Qt 平台插件映射到底层输入区域；
- **Wayland 实现：**Qt Wayland 会将非空 `QRegion` 转换为标准的 `wl_surface` 输入区域，并非 UOS 独有能力；
- **完全穿透：**不要把空 `QRegion` 误认为空 Wayland 输入区域，应优先评估 `Qt::WindowTransparentForInput`；
- **工程验证：**分别检查 Qt 版本、平台插件、调用时机、桌面环境和合成器，不能只根据系统名称判断行为。

## 参考资料

- [Qt 6：QWindow::setMask()](https://doc.qt.io/qt-6/qwindow.html#setMask)
- [Qt Wayland 5.15：QWaylandWindow::setMask() 源码](https://github.com/qt/qtwayland/blob/5.15/src/client/qwaylandwindow.cpp)
- [Wayland 协议：wl_surface.set_input_region](https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_surface)

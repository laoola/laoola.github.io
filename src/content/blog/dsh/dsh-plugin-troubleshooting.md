---
title: "DSH 插件装了却不显示：安装、激活、更新与样式的排查顺序"
description: "从真实插件开发问题出发，梳理 bundle 装配、inject 激活、客户端更新、槽位排序和主题令牌，给出可复用的排查顺序。"
date: 2026-11-04
tags: ["DSH", "插件开发", "Web UI", "排障"]
draft: false
---

插件安装命令执行成功，页面里却没有入口；改完 `client.js`，刷新后还是旧界面；按钮终于出现了，位置和颜色又不对。

我在写 `dsh-prompt` 和 `dsh-git-graph` 时都遇到过这些问题。最开始很容易把它们统称为“插件没生效”，然后在配置文件里反复碰运气。

后来我把问题拆成四层，排查就快多了：

| 层次 | 要回答的问题 | 常见误判 |
|---|---|---|
| 安装与装配 | 插件有没有被安装并加入目标 profile？ | 包目录存在，就认为插件已装配 |
| Host 激活 | 入口模块有没有成功执行？ | 安装成功，就认为 `apply()` 已运行 |
| Client 加载 | 浏览器拿到的是不是本次代码？ | 刷新页面，就一定拿到最新模块 |
| Slot 渲染 | 组件有没有注册到已声明的槽位？ | 页面没显示，就一定是安装失败 |

这篇文章记录我在 DSH `0.2.1-rc.5` 上核对过的排查方法。插件 API 仍在演进，涉及具体行为的结论应以使用版本的类型和源码为准。

## 先确认安装，不要把包存在当成装配成功

一个包含 Web 界面的插件，通常同时有 Host 和 Client 两部分。下面是一个结构示例：

```json
{
  "exports": {
    ".": "./index.js",
    "./client": "./client.js"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  }
}
```

这里有三个不同入口：

- `exports["."]`：Host 入口；
- `exports["./client"]`：浏览器入口；
- `dsh.bundle.patch`：插件装配补丁的位置。

只在 profile 中安装依赖，不等于已经完成插件选择和激活。安装应优先走官方 CLI 或插件管理器，不要把手工修改 `dependencies` 当成完整安装流程。

安装后还要分别看两种状态：

1. **保存状态**：插件是否已安装、启用；
2. **运行状态**：是否激活成功，是否被覆盖，是否要求重启。

当前官方文档把 `failed`、`overridden` 和 `restart-required` 分开描述。这个区分很实用：它们都不是“功能已经验证成功”。

## 三种 inject 不要混在一起

我踩过最典型的一个错误是：

```text
cannot get property "tools" without inject
```

原因不是 `tools` 不存在，而是 Host 入口没有导出服务依赖：

```js
export const inject = ['tools', 'commands'];

export function apply(ctx) {
  // 注册命令、工具，并处理资源清理。
}
```

插件里还有另外两种 `inject`，它们解决的问题不同：

| 写法 | 所在位置 | 作用 |
|---|---|---|
| `export const inject = ['tools']` | Host 入口模块 | 声明 Host 侧 Cordis 服务依赖 |
| `dsh.client.inject` | `package.json` | 声明需要预载的浏览器模块包 |
| `return { inject: ['slots'], apply() {} }` | Client 模块工厂 | 声明浏览器侧服务依赖 |

把 `'tools'` 写进 `package.json` 的 `dsh.client.inject`，不能替代 Host 入口的命名导出；把浏览器模块包名写进 Host 的 `inject`，也同样不对。

如果遇到“整个插件都没有反应”，我会先检查 Host 激活日志，再检查页面。入口激活失败时，之前设想的命令、事件监听和工具注册可能都没有发生。

## 改了代码，刷新页面为什么还是旧版本

我早期记录过“link 安装时，修改 `client.js` 后刷新页面即可”。后来的实机验证推翻了这个结论：页面拿到的 combo 修订值没有变化，刷新仍然加载旧代码。

当前官方文档把两种情况分开了：

- 安装一个新 bundle，可能通过 HMR 生效；
- 替换已经安装的包，需要重启才能加载新的 JavaScript 模块代际。

所以我现在不会把“刷新后没变化”直接判断为代码没改对，也不会把“刷新后出现了”推广成所有更新都支持热刷新。

本地验证时还需要注意两点：

- 尽量使用隔离的第二实例，不要为了测试插件反复重启正在工作的宿主；
- 重启后检查真实功能或模块副作用，不要只看原来的槽位 ID 还在不在。

如果状态已经是 `restart-required`，继续刷新页面通常不会提供新的证据。

## order 不一定能决定跨插件位置

在给 Git Graph 加入口按钮时，我设置过 `order: 100`，直觉上它应该排在 order 较小的按钮后面。实际顺序却不是这样。

核对当前 `dsh-cordis-client-runner` 后，可以看到非 chain 槽的 priority 会被重新分配：

```js
if (spec === void 0 || spec.kind !== "chain") {
  priority = env.allocatePriority();
  options.priority = priority;
}
```

这意味着，仅设置 `order`，不能保证多个插件之间的最终位置。我当时还通过延迟注册调整过顺序，虽然那个版本实测有效，但它依赖注册时机和渲染方向，不适合当成长期稳定的 API 契约。

我现在会这样处理：

1. 先选用官方提供、能容纳控件的槽位；
2. 不通过读取其他插件的 DOM 或样式来猜测位置；
3. 如果顺序确实影响功能，核对当前版本的 slot 类型和 runner 实现；
4. 用实际页面顺序验收，并记录测试版本。

“某次延迟注册后排到了右边”只能算特定版本的实现观察，不能写成永久规则。

## 槽位未声明时，不要只用 spec() 现查

另一个容易误判的点是：插件执行时，目标槽位可能还没有声明。

如果先执行 `slots.spec(slot)`，发现不存在就放弃注册，那么一些由父组件稍后声明的子槽永远没有你的组件。更稳妥的方式是使用 `slots.inject(slot, factory)`，把注册挂到槽位的声明生命周期上：

```js
ctx.slots.inject('conversation.composer.dock', () =>
  ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'my-decoration',
  }, Decoration),
);
```

这样，代码关注的不是“这一刻槽位是否存在”，而是“槽位声明时完成注册”。

同时还要保留清理逻辑。样式、事件监听、定时器和槽位注册都应跟随插件生命周期释放，避免重载后出现重复组件和重复监听。

## 样式优先继承宿主主题

插件界面最容易显得突兀的地方，是亮色主题下正常，切到暗色后背景和边框仍然写死。

我现在会优先使用宿主令牌：

```css
.plugin-root {
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l2);
}

.plugin-button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
```

这样做的好处不是少写几个颜色值，而是让宿主统一处理亮暗主题。需要回退颜色时，也应明确它只是令牌缺失时的兜底。

除了颜色，还要遵守两个边界：

- 不替换应用根节点，不再向 `document.body` 挂载第二套应用；
- 优先使用已经分配空间的槽位，不用绝对定位去猜宿主布局。

最后分别切换亮色、暗色主题，检查文字、边框、悬浮态和弹层，而不是只看主容器背景。

## 我的插件排查清单

现在遇到“插件没生效”，我会按这个顺序检查：

- [ ] 目标 profile 中，插件是否已安装并启用？
- [ ] 激活状态是否为 `failed`、`overridden` 或 `restart-required`？
- [ ] Host 入口是否正确导出 `inject`，`apply()` 是否实际执行？
- [ ] `exports["./client"]` 和 `dsh.client.inject` 是否指向正确模块？
- [ ] 替换已安装包后，是否重启并加载了新的模块代际？
- [ ] 是否通过 `slots.inject()` 在槽位声明时完成注册？
- [ ] 页面中的真实功能和渲染结果是否经过验证？
- [ ] 亮色、暗色和插件卸载后的清理是否正常？

这套顺序的核心只有一句话：**先定位问题发生在哪一层，再改对应配置或代码。**

文件存在、安装成功、Host 激活、Client 加载和 Slot 渲染，是五个不同事实。把它们分开验证，比反复刷新和重启更省时间。

## 源码核对点

本文结论核对自 DSH `0.2.1-rc.5` 安装包中的以下位置：

- `dsh-agent-preset/skills/cordis-plugin-development/references/host-plugin.md`：安装、激活状态和模块更新；
- `dsh-agent-preset/skills/cordis-plugin-development/references/ui-plugin.md`：Client 模块、槽位和主题边界；
- `dsh-cordis-client-runner/lib/client.js`：非 chain 槽的 priority 分配；
- `dsh-client-ui-conversation/lib/client.js`：输入区域槽位声明。

官方项目：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。

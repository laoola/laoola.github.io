---
title: Claude Code C++ 客户端开发场景化指南
description: 详细介绍在 C++ 客户端开发日常场景中，如何正确使用 Claude Code 的 Skills 和 Agents，提升开发效率
date: 2026-05-07
tags:
  - Claude Code
  - C++
  - 开发效率
  - 工具使用
---

# Claude Code C++ 客户端开发场景化指南

作为 C++ 客户端开发工程师，日常面临各种技术挑战：内存管理、多线程、设计模式、跨平台编译等。Claude Code 提供了丰富的 Skills 和 Agents，如何在正确场景使用正确的工具，是提升效率的关键。

本文档根据实际的 C++ 开发工作流，总结构建场景化使用指南。

## 一、核心工具矩阵

### 1.1 按使用频率分类

| 优先级 | Skill/Agent | 使用场景 |
|--------|-------------|---------|
| 🔴 高频 | `cpp-build-resolver` | 编译报错、链接失败、模板错误 |
| 🔴 高频 | `cpp-reviewer` | 代码完成后必须审查 |
| 🟡 中频 | `cpp-coding-standards` | 编码时参考，避免违反规范 |
| 🟡 中频 | `tdd-guide` | 重要功能先写测试再实现 |
| 🟡 中频 | `security-reviewer` | 网络/文件/用户输入处理 |
| 🟢 低频 | `architect` | 架构设计、技术选型 |
| 🟢 低频 | `performance-optimizer` | 性能瓶颈分析 |
| 🟢 低频 | `refactor-cleaner` | 代码重构、清理死代码 |

### 1.2 按开发阶段分类

| 开发阶段 | 使用的 Skill/Agent |
|---------|-------------------|
| 需求分析 | `planner` → 拆解任务 |
| 架构设计 | `architect` → 技术选型、模块划分 |
| 编码实现 | `tdd-guide` + `cpp-coding-standards` |
| 代码审查 | `cpp-reviewer` + `security-reviewer` |
| 构建调试 | `cpp-build-resolver` |
| 性能优化 | `performance-optimizer` |
| 重构清理 | `refactor-cleaner` + `architect` |

---

## 二、典型工作流组合

### 场景 1：在现有项目上新增需求

**需求**：在已有项目基础上增加新功能，需要考虑与现有代码的兼容性

**推荐工作流**：

```
1. planner        → 拆解任务：接口设计、数据流、边界影响
2. architect      → 评估对现有架构的影响，设计扩展方案
3. tdd-guide      → 锁定 TDD 流程，先写测试
4. cpp-coding-standards → 编码时参考 C++11 规范
5. cpp-reviewer   → 审查内存安全、智能指针使用
6. security-reviewer → 检查输入验证、依赖安全性
7. cpp-test       → 全平台编译通过，覆盖率 ≥ 80%
```

**关键检查点**：
- 新增代码与现有模块的接口兼容性
- 是否影响现有功能的测试用例
- 智能指针管理生命周期，无裸指针
- 输入验证完整（防止破坏现有逻辑）
- 并发场景下对现有状态的影响

**典型 prompt 示例**：

```bash
# 启动 planner
/skill planner
# 输入：在现有 IM 客户端项目中新增文件传输功能
# - 需要复用的模块：网络层、线程池、数据库存储
# - 需要新增的模块：文件分片、断点续传、传输队列
# 输出：任务拆解、文件结构、验收标准、与现有代码的边界

# 架构评估
/skill architect
# 输入：现有架构使用观察者模式，新功能如何集成？
# 文件传输模块与其他模块的依赖关系如何处理？
```

---

### 场景 2：优化界面渲染性能

**需求**：UI 界面帧率偏低，需要定位瓶颈并优化

**推荐工作流**：

```
1. performance-optimizer → Profiling 分析，定位热点函数
2. architect            → 设计渲染架构优化方案
3. tdd-guide            → 写性能基准测试用例
4. cpp-testing          → 对比优化前后性能数据
```

**典型 prompt 示例**：

```bash
# 性能分析
/skill performance-optimizer
# 输入：分析渲染线程 CPU 占用，使用了哪些工具链（RenderDoc、VTune）
# 输出：热点函数列表、优化建议

# 架构设计
/skill architect
# 输入：当前渲染架构是单线程，主循环每帧处理 16ms 内无法完成，
# 考虑优化为双缓冲+异步命令提交，评估可行性和风险
```

---

### 场景 3：集成第三方 SDK（支付、推送、分享）

**需求**：集成微信支付 SDK，需要处理回调和结果校验

**推荐工作流**：

```
1. cpp-build-resolver  → 处理 SDK 编译、链接问题
2. security-reviewer   → 检查 SDK 接口安全性
3. code-reviewer       → 检查与现有代码的集成方式
4. cpp-reviewer        → 审查内存管理和回调生命周期
```

**典型 prompt 示例**：

```bash
# 编译问题
/skill cpp-build-resolver
# 输入：集成微信 SDK 时，Windows MSVC 报 LNK2019 未找到符号错误，
# 检查是否缺少库依赖或 ABI 不兼容

# 安全审查
/skill security-reviewer
# 输入：SDK 提供回调接口需要传递订单号和金额，如何防止中间人攻击？
```

---

### 场景 4：代码重构 - 降低模块耦合

**需求**：将一个 3000 行的类拆分为多个职责明确的模块

**推荐工作流**：

```
1. refactor-cleaner  → 识别死代码、冗余依赖
2. architect         → 设计新的模块边界和接口
3. cpp-reviewer      → 确保重构后无内存泄漏
4. tdd-guide         → 补充测试防止回归
```

**典型 prompt 示例**：

```bash
# 死代码分析
/skill refactor-cleaner
# 输入：扫描当前模块，识别未使用的函数和过度耦合的依赖

# 架构设计
/skill architect
# 输入：将 UiRenderer 类拆分为：TextureManager、RenderPipeline、DrawCallOptimizer
# 遵循单职责原则，使用 Pimpl 减少编译依赖
```

---

### 场景 5：内存泄漏排查

**需求**：使用智能指针后仍有内存泄漏，需要定位根因

**推荐工作流**：

```
1. cpp-reviewer       → 分析智能指针使用是否正确
2. refactor-cleaner   → 识别循环引用、悬空指针
3. cpp-build-resolver → 配置 AddressSanitizer 辅助定位
```

**典型 prompt 示例**：

```bash
# 代码审查
/skill cpp-reviewer
# 输入：检查以下代码是否存在智能指针循环引用或内存泄漏
# 特别关注 shared_ptr 是否形成了闭环（用 weak_ptr 打破）

# 构建工具
/skill cpp-build-resolver
# 输入：如何在 CMake 中启用 AddressSanitizer，检测 Windows/MSVC 下的内存泄漏
```

---

### 场景 6：新需求完整开发流程

**需求**：从 0 开始实现一个新功能（如：客户端需要支持文件下载管理）

**推荐工作流**：

```
1. Research & Reuse    → GitHub 搜索现有实现，查找可复用的库
2. planner             → 拆解任务，输出结构化需求文档
3. architect           → 技术选型、架构设计、模块划分
4. tdd-guide           → 锁定 TDD 流程（RED-GREEN-REFACTOR）
5. cpp-coding-standards → 编码时参考 C++11 规范
6. cpp-reviewer        → 审查内存安全、线程安全
7. security-reviewer   → 检查输入验证、错误处理
8. cpp-test            → 全平台编译通过，覆盖率 ≥ 80%
```

**典型 prompt 示例**：

```bash
# 1. 调研阶段
# 先搜索 GitHub 和现有库，避免重复造轮子
gh search repos "cpp download manager library" --limit 10
gh search code "download manager cpp" --language cpp --limit 10

# 2. 需求规划
/skill planner
# 输入：客户端需要文件下载管理功能
# - 支持断点续传
# - 多线程并发下载
# - 下载队列管理
# - 进度回调通知
# 输出：任务拆解、文件结构、验收标准

# 3. 架构设计
/skill architect
# 输入：基于以上需求，设计下载管理器的架构
# - 单例还是依赖注入
# - 线程模型（线程池数量、任务调度）
# - 持久化方案（SQLite/文件）

# 4. TDD 开发
/skill tdd-guide
# 输入：针对 DownloadManager 编写 TDD 测试
# 先写单元测试（Mock HttpClient），再实现功能

# 5. 代码审查
/skill cpp-reviewer
# 输入：审查 DownloadManager 代码
# 检查点：智能指针使用、线程安全、错误处理、资源释放

# 6. 安全审查
/skill security-reviewer
# 输入：下载链接解析、文件写入路径校验、断点续传数据一致性
```

**关键原则**：

| 阶段 | 原则 |
|------|------|
| 调研 | GitHub 搜索 → 库文档 → Exa，**禁止**直接写代码 |
| 规划 | 必须输出结构化需求文档，**禁止**直接进入编码 |
| 设计 | 先明确模块边界和数据流，**禁止**边写边改 |
| TDD | 先写测试（RED）→ 实现（GREEN）→ 重构（REFACTOR）|
| 审查 | 内存安全 + 线程安全 + 输入验证，三者缺一不可 |

---

## 三、C++11 编码铁律（必须遵守）

根据 C++11 开发规范，以下规则必须严格遵守：

### 3.1 内存管理

```
✅ 正确：所有动态内存使用智能指针
   std::unique_ptr<Config> config = std::make_unique<Config>();

❌ 错误：禁止裸指针管理内存
   Config* config = new Config(); // 禁止
```

### 3.2 循环引用避免

```
✅ 正确：使用 weak_ptr 打破循环
   class B;
   class A {
       std::weak_ptr<B> b_ptr; // 用 weak_ptr 避免循环
   };

❌ 错误：shared_ptr 循环引用导致内存泄漏
```

### 3.3 const 正确性

```
✅ 正确：成员函数不修改成员必须声明 const
   class Cache {
       bool isValid() const { return valid_; }
   private:
       mutable bool valid_ = true;
   };
```

### 3.4 禁止使用的语法

```
❌ 禁止：std::auto_ptr（已废弃）
❌ 禁止：C++14/17/20 专属语法（make_unique 在 C++11 可用，但 optional/variant 等不行）
❌ 禁止：using namespace std（在头文件中）
❌ 禁止：全局变量
```

---

## 四、安全审查检查清单

涉及以下场景时，**必须**调用 `security-reviewer`：

| 场景 | 检查重点 |
|------|---------|
| 网络通信 | 输入验证、SSL/TLS 配置、中间人攻击 |
| 文件操作 | 路径遍历、符号链接攻击、权限校验 |
| 用户输入 | XSS、注入攻击、格式化字符串 |
| 进程间通信 | 权限验证、回调校验 |
| 加密存储 | 密钥管理、算法选择 |

---

## 五、常用命令速查

```bash
# 构建报错 → 立即调用
/skill cpp-build-resolver

# 写完代码 → 必须审查
/skill cpp-reviewer

# 涉及安全 → 安全审查
/skill security-reviewer

# 重要功能 → TDD 开发
/skill tdd-guide

# 性能问题 → 性能分析
/skill performance-optimizer

# 代码重构 → 先分析
/skill refactor-cleaner

# 架构决策 → 设计模式
/skill architect
```

---

## 六、总结

合理使用 Claude Code 的 Skills 和 Agents，可以显著提升 C++ 开发效率：

- **高频工具**：`cpp-build-resolver`、`cpp-reviewer` 是每天都会用到的
- **质量保障**：`cpp-coding-standards`、`security-reviewer` 防止常见错误
- **架构支持**：`architect`、`planner` 在复杂决策时提供专业建议
- **持续优化**：`performance-optimizer`、`refactor-cleaner` 保持代码健康

记住：在复杂场景下，组合使用多个工具比单一工具更有效。
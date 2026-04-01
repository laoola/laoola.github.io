---
title: everything-claude-code 功能说明
description: everything-claude-code - Anthropic 黑客马拉松获胜者的完整 Claude Code 配置集合，包含 28+ 专业子代理和 150+ 技能
date: 2026-03-31
tags: [Claude Code, everything-claude-code, 工具]
---

# everything-claude-code 功能说明

你用 Claude Code 写代码还只靠默认配置吗？

everything-claude-code（简称 ECC）是 Anthropic 黑客马拉松获胜者开源的一整套 Claude Code 最佳实践配置集合。包含 28+ 专业子代理、150+ 技能，经过 10 多个月真实产品开发打磨。

安装之后，Claude Code 会自动按照生产级开发流程帮你写代码。

---

## 这到底是什么？

ECC 不是传统意义上的"插件"，它是：

- 一套**编码规则**：Claude 写代码自动遵循你的风格
- 一堆**预制子代理**：不同任务用专门的代理处理（规划、审查、调试、测试）
- 一堆**预制技能**：常见开发流程直接用（TDD、代码审查、构建错误修复）
- 一堆**快捷命令**：斜杠命令一键触发工作流
- 经过真实项目验证：作者用这套配置开发产品10+个月

作者：affaan-m（Anthropic 黑客马拉松 2025 获胜者）

---

## 主要功能模块

### 1. 🤖 **Agents 专业子代理 (28+ 个)**

用于特定任务的专业化子代理，可以委托处理：

| 代理名称                    | 功能描述                | 使用示例                                                 |
| --------------------------- | ----------------------- | -------------------------------------------------------- |
| `planner.md`              | 功能实现规划            | `/agent planner` 规划一个用户登录功能                  |
| `architect.md`            | 系统架构设计决策        | `/agent architect` 设计一个 RESTful API 架构           |
| `tdd-guide.md`            | 测试驱动开发引导        | `/agent tdd-guide` 帮我做 TDD 开发二叉搜索树           |
| `code-reviewer.md`        | 代码质量和安全审查      | `/agent code-reviewer` 审查这个 PR 的代码              |
| `security-reviewer.md`    | 漏洞分析                | `/agent security-reviewer` 检查这段 SQL 查询是否安全   |
| `build-error-resolver.md` | 构建错误解决            | `/agent build-error-resolver` 分析这个编译错误         |
| `e2e-runner.md`           | Playwright E2E 测试运行 | `/agent e2e-runner` 生成登录页面的 E2E 测试            |
| `refactor-cleaner.md`     | 死代码清理              | `/agent refactor-cleaner` 清理这个文件中未使用的函数   |
| `doc-updater.md`          | 文档同步更新            | `/agent doc-updater` 更新 README.md 匹配最新代码       |
| `go-reviewer.md`          | Go 代码审查             | `/agent go-reviewer` 审查这个 Go 模块                  |
| `go-build-resolver.md`    | Go 构建错误解决         | `/agent go-build-resolver` 解决这个 go build 错误      |
| `cpp-reviewer.md`         | C/C++ 代码审查          | `/agent cpp-reviewer` 审查这个 C++ 文件                |
| `cpp-build-resolver.md`   | C/C++ 构建错误解决      | `/agent cpp-build-resolver` 解决这个 CMake 构建错误    |
| `rust-reviewer.md`        | Rust 代码审查           | `/agent rust-reviewer` 审查这个 Rust 模块              |
| `rust-build-resolver`     | Rust 构建错误解决       | `/agent rust-build-resolver` 解决这个 cargo build 错误 |

---

### 2. 📚 **Skills 工作流技能 (40+ 个)**

可复用的工作流定义和领域知识，被代理和命令调用，共 **152 个技能**：

---

### 🏗️ **架构与设计**

| 技能 | 功能描述 | 使用场景 | 使用示例 |
| :--- | :------- | :------- | :------- |
| `api-design` | REST API 设计模式（资源命名、状态码、分页、过滤、错误响应、版本控制、限流） | API 设计 | 设计新的 RESTful API 端点 |
| `backend-patterns`              | API、数据库、缓存设计模式                                                   | 设计后端架构          | `/agent architect` 设计后端架构时应用 |
| `architecture-decision-records` | 架构决策记录 (ADR) 实践                                                     | 记录架构决策          | 项目重要决策文档化                      |
| `android-clean-architecture`    | Android 清洁架构模式                                                        | Android 应用开发      | Android 项目架构设计                    |
| `database-migrations`           | 数据库迁移最佳实践                                                          | 管理数据库变更        | 设计版本化数据库迁移                    |
| `deployment-patterns`           | 部署模式（蓝绿、滚动、金丝雀）                                              | 应用发布策略设计      | 设计生产环境部署流程                    |
| `design-system`                 | 设计系统组件开发规范                                                        | 构建前端设计系统      | 开发可复用 UI 组件库                    |
| `docker-patterns`               | Docker 最佳实践和模式                                                       | 容器化应用            | 编写 Dockerfile 和 docker-compose       |
| `frontend-patterns`             | React、Next.js 模式                                                         | 设计前端组件          | 设计 React 组件时推荐正确模式           |
| `mcp-server-patterns`           | MCP 服务器开发模式                                                          | 开发自定义 MCP 服务器 | 构建 Model Context Protocol 服务        |
| `patterns`                      | 常用设计模式（未单独列出时通用参考）                                        | 软件设计              | 选择合适的设计模式                      |

---

### 📋 **开发流程与工程**

| 技能                       | 功能描述                      | 使用场景                   | 使用示例                             |
| :------------------------- | :---------------------------- | :------------------------- | :----------------------------------- |
| `coding-standards`       | 各语言编码最佳实践            | 统一团队编码风格           | 新建项目时自动应用编码规范           |
| `git-workflow`           | Git 工作流最佳实践            | 团队协作                   | 规范分支和提交流程                   |
| `tdd-workflow`           | TDD 方法论完整工作流          | 测试驱动开发               | `/tdd` 实现功能时引导完整 TDD 流程 |
| `continuous-learning`    | 从会话自动提取编码模式        | 让 Claude 学习你的编码风格 | `/learn` 后提取当前项目编码习惯    |
| `continuous-learning-v2` | 基于直觉的学习+置信度评分系统 | 持续改进学习效果           | 长期项目中逐步提高编码匹配度         |
| `iterative-retrieval`    | 子代理渐进式上下文细化        | 大任务分步细化             | 大型功能分多步逐步明确需求           |
| `strategic-compact`      | 手动压缩建议策略              | 优化上下文使用             | 上下文快满时建议保留关键信息压缩     |
| `context-budget`         | 上下文预算管理                | 控制上下文使用             | 大项目上下文规划                     |
| `security-review`        | 安全检查清单                  | 代码提交前安全检查         | `/code-review` 时进行安全漏洞检查  |
| `security-scan`          | 全面安全扫描                  | 安全审计                   | 项目上线前安全检查                   |
| `eval-harness`           | 验证循环评估框架              | 持续验证迭代               | 多轮迭代中持续验证代码正确性         |
| `verification-loop`      | 持续验证循环                  | 保证代码正确性             | `/verify` 重新运行所有验证检查     |
| `e2e-testing`            | E2E 测试最佳实践              | 端到端测试                 | `/e2e` 生成 Playwright 测试        |
| `codebase-onboarding`    | 代码库快速上手                | 新项目熟悉                 | 帮助新开发者理解代码库               |
| `documentation-lookup`   | 文档查找策略                  | 查找官方文档               | 搜索库 API 文档                      |
| `prompt-optimizer`       | Prompt 优化方法               | 改进提示词效果             | 优化复杂任务提示                     |
| `search-first`           | 先搜索再编码策略              | 避免重复造轮子             | 开发前搜索现有实现                   |
| `token-budget-advisor`   | Token 预算建议                | 上下文管理                 | 优化大项目上下文使用                 |
| `rules-distill`          | 规则提炼方法                  | 从现有代码提取规范         | 将团队规范提炼为规则                 |

---

### 🏛️ **AI 与代理工程**

| 技能                           | 功能描述              | 使用场景             | 使用示例               |
| :----------------------------- | :-------------------- | :------------------- | :--------------------- |
| `agentic-engineering`        | 代理工程最佳实践      | 多代理系统开发       | 构建多代理工作流       |
| `ai-first-engineering`       | AI 优先开发方法论     | AI 原生开发          | 使用 AI 辅助全程开发   |
| `ai-regression-testing`      | AI 回归测试方法       | LLM 输出回归测试     | 测试提示词变更影响     |
| `autonomous-loops`           | 自主循环工作流        | 自动化任务循环       | 让代理自动完成多步任务 |
| `continuous-agent-loop`      | 持续代理循环          | 长任务持续执行       | 大型任务分步自动执行   |
| `agent-eval`                 | 代理评估框架          | 评估代理输出         | 测试代理工作质量       |
| `agent-harness-construction` | 代理工具集构建        | 构建代理测试工具     | 构建代理测试脚手架     |
| `cost-aware-llm-pipeline`    | 成本感知 LLM 流水线   | 控制 LLM 调用成本    | 优化模型选择降低成本   |
| `deep-research`              | 深度研究方法          | 复杂问题研究         | 系统性研究技术问题     |
| `exa-search`                 | Exa 搜索使用方法      | 网络搜索研究         | 查找最新技术信息       |
| `plankton-code-quality`      | Plankton 代码质量检查 | 代码质量保证         | 代码质量自动化检查     |
| `santa-method`               | Santa 开发方法论      | 大任务分解           | 将大型需求分解为小任务 |
| `skill-comply`               | 技能合规检查          | 确保输出符合技能规范 | 验证输出符合项目规则   |
| `skill-stocktake`            | 技能库存分析          | 分析现有技能覆盖     | 评估项目技能需求       |
| `safety-guard`               | 安全防护机制          | 安全输出保证         | 确保输出安全合规       |

---

### 🌐 **前端开发**

| 技能                          | 功能描述                   | 使用场景       | 使用示例                |
| :---------------------------- | :------------------------- | :------------- | :---------------------- |
| `frontend-patterns`         | React、Next.js 设计模式    | 前端开发       | React 组件架构设计      |
| `nextjs-turbopack`          | Next.js Turbopack 配置优化 | Next.js 项目   | 配置 Turbopack 开发环境 |
| `nuxt4-patterns`            | Nuxt 4 设计模式            | Nuxt 开发      | Nuxt 4 项目架构         |
| `liquid-glass-design`       | 液态玻璃设计风格           | UI 设计        | 实现毛玻璃效果 UI       |
| `swiftui-patterns`          | SwiftUI 设计模式           | SwiftUI 开发   | SwiftUI 应用架构        |
| `swift-actor-persistence`   | Swift Actor 持久化         | Swift 并发编程 | Actor 状态持久化        |
| `swift-concurrency-6-2`     | Swift 6.2 并发模型         | Swift 并发开发 | 使用新并发模型          |
| `swift-protocol-di-testing` | Swift 协议 DI 测试         | Swift 依赖注入 | 使用协议进行测试隔离    |

---

### ⚙️ **后端开发**

| 技能                               | 功能描述                   | 使用场景             | 使用示例                 |
| :--------------------------------- | :------------------------- | :------------------- | :----------------------- |
| `django-patterns`                | Django 设计模式            | Django 开发          | Django 项目架构          |
| `django-security`                | Django 安全最佳实践        | Django 安全          | Django 项目安全审查      |
| `django-tdd`                     | Django TDD 工作流          | Django 开发          | Django 测试驱动开发      |
| `django-verification`            | Django 验证模式            | Django 数据验证      | Django 表单验证设计      |
| `laravel-patterns`               | Laravel 设计模式           | Laravel 开发         | Laravel 项目架构         |
| `laravel-plugin-discovery`       | Laravel 插件发现机制       | Laravel 包开发       | 开发 Laravel 扩展包      |
| `laravel-security`               | Laravel 安全最佳实践       | Laravel 安全         | Laravel 安全审查         |
| `laravel-tdd`                    | Laravel TDD 工作流         | Laravel 开发         | Laravel 测试驱动开发     |
| `laravel-verification`           | Laravel 验证模式           | Laravel 数据验证     | Laravel 验证设计         |
| `springboot-patterns`            | Spring Boot 设计模式       | Spring Boot 开发     | Spring Boot 项目架构     |
| `springboot-security`            | Spring Boot 安全最佳实践   | Spring Boot 安全     | Spring Boot 安全配置     |
| `springboot-tdd`                 | Spring Boot TDD 工作流     | Spring Boot 开发     | Spring Boot 测试驱动开发 |
| `springboot-verification`        | Spring Boot 验证模式       | Spring Boot 数据验证 | Spring Boot 验证设计     |
| `kotlin-patterns`                | Kotlin 设计模式            | Kotlin 开发          | Kotlin 项目编码规范      |
| `kotlin-coroutines-flows`        | Kotlin 协程 Flow 模式      | Kotlin 并发          | 使用协程和 Flow          |
| `kotlin-exposed-patterns`        | Kotlin Exposed ORM 模式    | Kotlin 数据库        | 使用 Exposed ORM         |
| `kotlin-ktor-patterns`           | Kotlin Ktor 框架模式       | Ktor 开发            | Ktor 应用架构            |
| `kotlin-testing`                 | Kotlin 测试模式            | Kotlin 测试          | Kotlin 测试编写          |
| `jpa-patterns`                   | JPA/Hibernate 模式         | Java JPA 开发        | JPA 实体设计             |
| `java-coding-standards`          | Java 编码规范              | Java 开发            | Java 项目编码            |
| `postgres-patterns`              | PostgreSQL 设计模式        | PostgreSQL 使用      | PostgreSQL 数据库设计    |
| `bun-runtime`                    | Bun 运行时最佳实践         | Bun 项目             | 使用 Bun 包管理器        |
| `compose-multiplatform-patterns` | Compose Multiplatform 模式 | Compose 跨平台       | 跨平台 Compose 开发      |

---

### 🧩 **语言特定**

| 技能                     | 功能描述                                    | 使用场景      | 使用示例                                 |
| :----------------------- | :------------------------------------------ | :------------ | :--------------------------------------- |
| `golang-patterns`      | Go 惯用语和最佳实践                         | Go 开发       | Go 项目编码自动遵循 Go 社区规范          |
| `golang-testing`       | Go 测试模式、TDD、基准测试                  | Go 测试       | `/go-test` 引导编写符合 Go 风格的测试  |
| `rust-patterns`        | Rust 设计模式                               | Rust 开发     | Rust 项目编码规范                        |
| `rust-testing`         | Rust 测试模式                               | Rust 测试     | Rust 测试编写                            |
| `cpp-coding-standards` | C++ 编码规范                                | C++ 开发      | C++ 项目编码                             |
| `cpp-testing`          | C++ 测试模式、GoogleTest、CMake/CTest       | C++ 测试      | `/cpp-test` 用 GoogleTest 编写测试用例 |
| `python-patterns`      | Python 设计模式                             | Python 开发   | Python 项目编码                          |
| `python-testing`       | Python 测试模式                             | Python 测试   | Python 测试编写                          |
| `perl-patterns`        | 现代 Perl 5.36+ 惯用语最佳实践              | Perl 开发     | Perl 编码自动使用现代语法                |
| `perl-security`        | Perl 安全模式、污染模式、安全 I/O           | Perl 安全编码 | 处理用户输入时强制安全检查               |
| `perl-testing`         | Perl TDD (Test2::V0 + prove + Devel::Cover) | Perl 测试     | 引导使用 Test2::V0 编写测试              |
| `pytorch-patterns`     | PyTorch 设计模式                            | PyTorch 开发  | PyTorch 模型实现                         |

---

### 🗄️ **数据与机器学习**

| 技能                            | 功能描述             | 使用场景        | 使用示例                 |
| :------------------------------ | :------------------- | :-------------- | :----------------------- |
| `clickhouse-io`               | ClickHouse 最佳实践  | ClickHouse 使用 | ClickHouse 数据导入查询  |
| `pytorch-patterns`            | PyTorch 模型开发模式 | PyTorch 开发    | PyTorch 深度学习模型     |
| `foundation-models-on-device` | 端侧基础模型部署     | 端侧 AI 部署    | 在设备上运行大模型       |
| `fal-ai-media`                | Fal AI 媒体处理      | AI 媒体生成     | 使用 Fal AI 生成图片视频 |
| `data-scraper-agent`          | 数据抓取代理工作流   | 网页数据抓取    | 代理自动抓取网页数据     |

---

### 🏥 **医疗健康领域**

| 技能                          | 功能描述             | 使用场景     | 使用示例             |
| :---------------------------- | :------------------- | :----------- | :------------------- |
| `healthcare-cdss-patterns`  | 临床决策支持系统模式 | CDSS 开发    | 构建临床决策支持系统 |
| `healthcare-emr-patterns`   | 电子病历系统模式     | EMR 开发     | 电子病历数据模型设计 |
| `healthcare-eval-harness`   | 医疗系统评估框架     | 医疗 AI 评估 | 评估医疗 AI 输出     |
| `healthcare-phi-compliance` | PHI 合规性           | HIPAA 合规   | 确保患者隐私合规     |

---

### 📦 **供应链物流领域**

| 技能                               | 功能描述       | 使用场景 | 使用示例           |
| :--------------------------------- | :------------- | :------- | :----------------- |
| `logistics-exception-management` | 物流异常管理   | 物流系统 | 处理物流异常流程   |
| `returns-reverse-logistics`      | 退货逆向物流   | 电商退货 | 逆向物流流程设计   |
| `inventory-demand-planning`      | 库存需求计划   | 库存管理 | 需求预测和库存规划 |
| `production-scheduling`          | 生产计划排程   | 生产制造 | 生产计划优化       |
| `quality-nonconformance`         | 质量不合格处理 | 质量管理 | 不合格品处理流程   |

---

### 💰 **贸易金融领域**

| 技能                         | 功能描述      | 使用场景 | 使用示例          |
| :--------------------------- | :------------ | :------- | :---------------- |
| `customs-trade-compliance` | 海关贸易合规  | 贸易系统 | 确保海关申报合规  |
| `energy-procurement`       | 能源采购      | 能源交易 | 能源采购流程设计  |
| `agent-payment-x402`       | X402 支付代理 | AI 支付  | X402 协议支付处理 |

---

### ✍️ **内容创作**

| 技能                   | 功能描述               | 使用场景     | 使用示例                  |
| :--------------------- | :--------------------- | :----------- | :------------------------ |
| `article-writing`    | 技术文章写作           | 技术文档写作 | 编写技术博客文章          |
| `content-engine`     | 内容引擎工作流         | 批量内容生成 | 规模化内容创作            |
| `frontend-slides`    | 前端幻灯片设计         | 制作技术演示 | 创建前端技术幻灯片        |
| `investor-materials` | 投资者材料编写         | 融资材料     | 编写投资建议书            |
| `investor-outreach`  | 投资者外联             | 融资沟通     | 编写投资者沟通邮件        |
| `market-research`    | 市场研究               | 产品调研     | 进行市场分析研究          |
| `product-lens`       | 产品视角分析           | 产品设计     | 从产品角度分析需求        |
| `team-builder`       | 团队组建建议           | 团队建设     | 建议团队角色和结构        |
| `video-editing`      | 视频编辑工作流         | 视频编辑     | 指导视频编辑流程          |
| `videodb`            | VideoDB 视频数据库使用 | 视频数据管理 | 使用 VideoDB 管理视频数据 |
| `visa-doc-translate` | 签证文档翻译           | 签证申请     | 翻译签证申请材料          |

---

### 🔧 **工具与其他**

| 技能                                | 功能描述               | 使用场景        | 使用示例                    |
| :---------------------------------- | :--------------------- | :-------------- | :-------------------------- |
| `blueprint`                       | Blueprint 设计方法     | 项目蓝图设计    | 设计项目整体蓝图            |
| `browser-qa`                      | 浏览器 QA 测试         | 自动化 QA       | 在浏览器中进行 QA 测试      |
| `canary-watch`                    | Canary 发布监控        | Canary 发布     | 监控 Canary 版本指标        |
| `carrier-relationship-management` | 运营商关系管理         | 电信系统        | 运营商关系管理系统          |
| `ck`                              | CK 规则处理            | 规则引擎        | CK 规则引擎使用             |
| `claude-api`                      | Claude API 使用        | Claude API 开发 | 使用 Claude API 开发应用    |
| `claude-devfleet`                 | Claude DevFleet 使用   | 多代理开发      | 使用 DevFleet 并行开发      |
| `click-path-audit`                | 点击路径审计           | UX 分析         | 审计用户点击路径            |
| `configure-ecc`                   | ECC 配置               | ECC 设置        | 配置 everything-claude-code |
| `content-hash-cache-pattern`      | 内容哈希缓存模式       | 缓存设计        | 基于内容哈希的缓存策略      |
| `dmux-workflows`                  | DMux 工作流            | 多路复用工作流  | DMux 工作流配置             |
| `enterprise-agent-ops`            | 企业代理运维           | 企业级代理      | 企业代理运营维护            |
| `flutter-dart-code-review`        | Flutter Dart 代码审查  | Flutter 开发    | Flutter 代码质量审查        |
| `nanoclaw-repl`                   | Nanoclaw REPL 模式     | Nanoclaw 使用   | 交互式 Nanoclaw 开发        |
| `nutrient-document-processing`    | Nutrient 文档处理      | 文档处理        | Nutrient SDK 文档处理       |
| `product-lens`                    | 产品视角分析           | 产品设计        | 产品需求分析                |
| `project-guidelines-example`      | 项目指南示例           | 项目规范        | 作为项目指南模板            |
| `regex-vs-llm-structured-text`    | 正则 vs LLM 结构化文本 | 文本处理        | 选择合适方法提取结构化数据  |
| `repo-scan`                       | 代码仓库扫描           | 代码分析        | 扫描仓库分析代码结构        |
| `ralphinho-rfc-pipeline`          | Ralphinho RFC 流水线   | RFC 流程        | RFC 文档处理流水线          |
| `returns-reverse-logistics`       | 退货逆向物流           | 电商退货        | 逆向物流处理                |
| `x-api`                           | X API 集成             | Twitter/X 开发  | 集成 X API                  |
| `nodejobs`                        | Node jobs 处理         | 定时任务        | Node.js 定时任务处理        |

---

### 3. ⌨️ **Commands 斜杠命令 (50+ 个)**

一键执行的快捷命令：

| 命令                        | 功能                           | 使用示例                                       |
| --------------------------- | ------------------------------ | ---------------------------------------------- |
| `/tdd`                    | 测试驱动开发工作流             | `/tdd` 实现一个 AVL 树                       |
| `/plan`                   | 功能实现规划                   | `/plan "添加用户注册邮箱验证功能"`           |
| `/e2e`                    | E2E 测试生成                   | `/e2e` 生成结账流程的 Playwright 测试        |
| `/code-review`            | 代码质量审查                   | `/code-review` 请审查当前文件的 PR           |
| `/build-fix`              | 修复构建错误                   | `/build-fix` 分析这个链接错误                |
| `/refactor-clean`         | 死代码移除                     | `/refactor-clean` 清理这个文件中未使用的导入 |
| `/learn`                  | 从会话提取编码模式（持续学习） | `/learn` 学习我这个项目的编码风格            |
| `/checkpoint`             | 保存验证状态                   | `/checkpoint` 保存当前测试进度               |
| `/verify`                 | 运行验证循环                   | `/verify` 重新运行所有验证检查               |
| `/setup-pm`               | 配置包管理器                   | `/setup-pm`                                  |
| `/go-review`              | Go 代码审查                    | `/go-review` 审查这个 handler                |
| `/go-test`                | Go TDD 工作流                  | `/go-test` 给这个函数写测试                  |
| `/go-build`               | 修复 Go 构建错误               | `/go-build` 解决这个 mod 版本冲突            |
| `/cpp-review`             | C/C++ 代码审查                 | `/cpp-review` 审查这个排序算法               |
| `/cpp-test`               | C/C++ TDD 工作流               | `/cpp-test` 用 GoogleTest 给这个类写测试     |
| `/cpp-build`              | 修复 C/C++ 构建错误            | `/cpp-build` 解决这个 CMake 链接错误         |
| `/skill-create`           | 从 git 历史生成技能            | `/skill-create --instincts`                  |
| `/instinct-status`        | 查看学习的直觉（置信度）       | `/instinct-status`                           |
| `/instinct-import <file>` | 导入直觉                       | `/instinct-import ./my-instincts.json`       |
| `/instinct-export`        | 导出直觉                       | `/instinct-export`                           |
| `/evolve`                 | 将直觉聚类到技能中             | `/evolve`                                    |
| `/promote`                | 提升项目直觉到全局             | `/promote` my-project-intuition              |
| `/projects`               | 查看项目统计                   | `/projects`                                  |
| `/multi-plan`             | 多方案并行规划                 | `/multi-plan "实现缓存机制"`                 |
| `/multi-execute`          | 多方案并行执行                 | `multi-execute`                              |
| `/multi-backend`          | 多后端并行实现                 | `/multi-backend "实现存储层"`                |
| `/multi-frontend`         | 多前端并行实现                 | `/multi-frontend "实现登录页"`               |
| `/multi-workflow`         | 完整多方案工作流               | `/multi-workflow "添加深色模式"`             |

---

### 4. 📏 **Rules 编码规则（必需手动安装）**

Claude 始终遵循的编码指南，按语言分类：

| 分类                   | 规则文件                   | 功能描述                       | 使用示例                |
| ---------------------- | -------------------------- | ------------------------------ | ----------------------- |
| **通用（必装）** | `common/coding-style.md` | 不可变性、文件组织、错误处理   | 自动约束编码风格        |
|                        | `common/git-workflow.md` | 提交格式、PR 流程规范          | 自动检查提交信息格式    |
|                        | `common/testing.md`      | TDD、80% 覆盖率要求            | 强制新功能走 TDD 流程   |
|                        | `common/performance.md`  | 模型选择、上下文管理           | 智能选择模型节省成本    |
|                        | `common/patterns.md`     | 设计模式、骨架项目             | 推荐正确的设计模式      |
|                        | `common/hooks.md`        | 钩子架构、TodoWrite            | 规范 TodoWrite 最佳实践 |
|                        | `common/agents.md`       | 何时委托给子代理               | 自动提示何时使用子代理  |
|                        | `common/security.md`     | 强制性安全检查                 | 提交前自动检查安全漏洞  |
| **语言特定**     | `typescript/`            | TypeScript/JavaScript 特定规则 | TypeScript 项目自动启用 |
|                        | `python/`                | Python 特定规则                | Python 项目自动启用     |
|                        | `golang/`                | Go 特定规则                    | Go 项目自动启用         |
|                        | `perl/`                  | Perl 特定规则                  | Perl 项目自动启用       |

```
~/.claude/rules/
├── common/
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── performance.md
│   ├── patterns.md
│   ├── hooks.md
│   ├── agents.md
│   └── security.md
├── typescript/
├── python/
├── golang/
└── perl/
```

**使用示例**：

```bash
# 手动安装通用规则（必须执行）
mkdir -p ~/.claude/rules
cp -r everything-claude-code/rules/common ~/.claude/rules/

# 安装你使用的语言规则
cp -r everything-claude-code/rules/typescript ~/.claude/rules/
cp -r everything-claude-code/rules/python ~/.claude/rules/
```

**重要**：Claude Code 插件系统无法自动分发 rules，需要手动复制到 `~/.claude/rules/`。

---

### 5. 🪝 **Hooks 自动化钩子**

基于事件触发器的自动化，自动执行预设逻辑：

| 钩子                   | 功能                                        | 触发时机                          | 使用示例                             |
| ---------------------- | ------------------------------------------- | --------------------------------- | ------------------------------------ |
| `memory-persistence` | 跨会话自动保存/加载上下文（对话记忆持久化） | `SessionStart` / `SessionEnd` | 重启 Claude 后自动恢复之前的对话状态 |
| `strategic-compact`  | 智能压缩建议，帮你主动压缩上下文            | `PostToolUse`                   | 上下文占用超过阈值时自动提示压缩     |

**使用示例**：

```json
// 在 ~/.claude/settings.json 中启用钩子
{
  "hooks": [
    {
      "name": "memory-persistence",
      "enabled": true
    },
    {
      "name": "strategic-compact",
      "enabled": true
    }
  ]
}
```

钩子支持多种事件类型：`PreToolUse`、`PostToolUse`、`SessionStart`、`SessionEnd` 等。

---

### 6. 🧠 **持续学习系统**

独特的基于直觉的持续学习功能，自动学习你的编码风格：

| 命令                        | 功能描述                 | 使用示例                                         |
| --------------------------- | ------------------------ | ------------------------------------------------ |
| `/learn`                  | 从当前会话提取编码模式   | `/learn` 学习我这个项目的编码风格              |
| `/instinct-status`        | 显示带有置信度的学习直觉 | `/instinct-status`                             |
| `/instinct-import <file>` | 从文件导入他人直觉       | `/instinct-import ./my-friends-instincts.json` |
| `/instinct-export`        | 导出你的直觉分享         | `/instinct-export`                             |
| `/evolve`                 | 将相关直觉聚类到技能     | `/evolve`                                      |
| `/promote <name>`         | 项目级直觉 → 全局直觉   | `/promote my-react-patterns`                   |
| `/projects`               | 查看已识别项目统计       | `/projects`                                    |
| `/skill-create`           | 从 git 历史生成技能      | `/skill-create --instincts`                    |

**使用示例工作流**：

```bash
# 1. 开始学习当前项目
/learn

# 2. 查看已学习的直觉
/instinct-status

# 3. 聚类成技能
/evolve

# 4. 提升为全局可用
/promote my-project-patterns

# 5. 导出分享给团队成员
/instinct-export
```

**特性**：

- 自动从你的编码会话中学习编码模式
- 给学习到的模式打置信度分数
- 可以导出分享给他人，或导入他人的学习成果

---

### 7. 🔧 **Scripts 工具脚本**

跨平台 Node.js 工具脚本，由插件自动调用：

| 脚本                         | 功能描述                              | 使用场景                   |
| ---------------------------- | ------------------------------------- | -------------------------- |
| `package-manager.js`       | 包管理器自动检测（npm/pnpm/yarn/bun） | 项目启动时自动检测包管理器 |
| `session-start.js`         | 会话开始加载上下文                    | 自动加载持久化的上下文     |
| `session-end.js`           | 会话结束保存状态                      | 自动保存当前会话状态       |
| `setup-package-manager.js` | 交互式包管理器配置                    | 手动配置项目包管理器       |

**使用示例**：

```bash
# 在 Claude Code 中交互式配置包管理器
/setup-pm
```

**检测优先级**：

1. 环境变量 `CLAUDE_PACKAGE_MANAGER`
2. 项目配置 `.claude/package-manager.json`
3. `package.json` 的 `packageManager` 字段
4. 从锁文件检测（package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lockb）
5. 全局配置
6. 回退到第一个可用

---

### 8. 🌐 **MCP Configs MCP 服务器配置**

预配置好的常用 MCP 服务器配置，直接复制使用：

| 服务      | 功能                     | 配置文件           |
| --------- | ------------------------ | ------------------ |
| GitHub    | 仓库浏览、Issue、PR 操作 | `github.json`    |
| Supabase  | 数据库操作、项目管理     | `supabase.json`  |
| Vercel    | 部署管理、项目监控       | `vercel.json`    |
| Railway   | 应用部署、数据库管理     | `railway.json`   |
| GitLab    | GitLab 仓库操作          | `gitlab.json`    |
| Bitbucket | Bitbucket 仓库操作       | `bitbucket.json` |
| Jira      | Jira 问题管理            | `jira.json`      |
| Notion    | Notion 文档操作          | `notion.json`    |
| Slack     | Slack 消息发送           | `slack.json`     |
| Linear    | Linear issue 跟踪        | `linear.json`    |

**使用示例**：

```bash
# 复制预配置到 Claude MCP 配置
cp everything-claude-code/mcp/github.json ~/.claude/mcp_servers.json
```

然后编辑 `~/.claude/mcp_servers.json`，替换占位符：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

**重要提示**：

- 需要替换 `YOUR_*_HERE` 为你的实际 API 密钥
- 不要一次启用太多 MCP，会占用过多上下文
- 建议每个项目只启用 5-10 个常用 MCP
- 不用的 MCP 用 `disabledMcpServers` 禁用

---

### 9. 📊 **Contexts 动态上下文**

按场景注入不同的系统提示，让 Claude 更专注当前任务：

| 上下文文件      | 功能描述                       | 使用示例           |
| --------------- | ------------------------------ | ------------------ |
| `dev.md`      | 开发模式 - 专注代码实现        | 日常开发功能时使用 |
| `review.md`   | 代码审查模式 - 专注质量安全    | 代码审查时使用     |
| `research.md` | 研究/探索模式 - 全面探索代码库 | 分析陌生项目时使用 |
| `debug.md`    | 调试模式 - 系统化排查问题      | 解决 bug 时使用    |

**使用示例**：

```
# 在 Claude Code 中加载指定上下文
/context dev

# 或者直接通过命令自动加载
/code-review  # 自动加载 review 上下文
```

不同上下文会调整 Claude 的行为：

- **开发模式**：侧重快速实现、遵循编码规范
- **审查模式**：侧重安全检查、质量评估
- **研究模式**：侧重全面探索、输出结构化分析
- **调试模式**：侧重系统化排查、逐步验证

---

## 安装步骤

### 第一步：安装插件（Claude Code 内）

```
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

### 第二步：手动安装规则（必需）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git

# 复制规则（选择你的技术栈）
mkdir -p ~/.claude/rules
cp -r everything-claude-code/rules/common ~/.claude/rules/
cp -r everything-claude-code/rules/typescript ~/.claude/rules/
cp -r everything-claude-code/rules/python ~/.claude/rules/
cp -r everything-claude-code/rules/golang ~/.claude/rules/
```

### 第三步：开始使用

```bash
# 尝试一个命令
/everything-claude-code:plan "添加用户认证"

# 或简短形式
/plan "添加用户认证"

# 查看所有已安装命令
/plugin list everything-claude-code@everything-claude-code
```

---

## multi-\* 并行命令额外依赖

`multi-plan`、`multi-execute`、`multi-backend`、`multi-frontend`、`multi-workflow` 这些并行命令需要额外安装 `ccg-workflow` 运行时：

```bash
npx ccg-workflow
```

---

## 包管理器自动检测

插件自动检测你的首选包管理器，优先级：

1. 环境变量 `CLAUDE_PACKAGE_MANAGER`
2. 项目配置 `.claude/package-manager.json`
3. `package.json` 的 `packageManager` 字段
4. 从锁文件检测（package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lockb）
5. 全局配置
6. 回退到第一个可用的

配置命令：

```bash
/setup-pm  # 在 Claude Code 中交互式配置
```

---

## 技能创建器工具

两种从 git 历史生成 Claude Code 技能：

### 选项 A：本地分析（内置免费）

```bash
/skill-create                    # 分析当前仓库
/skill-create --instincts        # 还为 continuous-learning 生成直觉
```

### 选项 B：GitHub 应用（高级，支持 10k+ 提交）

- [安装 GitHub 应用](https://github.com/apps/skill-creator)
- 在 PR 评论中使用 `/skill-creator analyze`

---

## 跨平台支持

✅ **完全支持 Windows / macOS / Linux**
所有钩子和脚本都已用 Node.js 重写，保证最大兼容性。

---

## 统计信息

- 13 个专业子代理
- 43+ 个技能
- 24+ 个斜杠命令
- 多种语言支持：TypeScript、Python、Go、Perl、C++
- 持续学习系统
- 自动化钩子

---

## 重要提示

### 上下文窗口管理

> **关键：不要一次启用所有 MCP。如果启用了太多工具，你的 200k 上下文窗口可能会缩小到 70k。**

经验法则：

- 配置 20-30 个 MCP
- 每个项目保持启用少于 10 个
- 活动工具少于 80 个

使用 `disabledMcpServers` 禁用未使用的。

### 定制化

这些配置适合作者的工作流。你应该：

1. 从适合你的开始
2. 为你的技术栈进行修改
3. 删除你不使用的
4. 添加你自己的模式

---

## 仓库地址

https://github.com/affaan-m/everything-claude-code

---

创建时间：`2026-03-30`

# VibeCoding Experiment Log

> Wavedrom Markdown Preview — VSCode Extension
>
> Model: DeepSeek V4 | Total Cost: < 2 RMB | Human Intervention: ~0

---

## 1. 初始需求 (Initial Prompt)

```
我想做一个VSCode的插件项目，它的主要功能是将Wavedrom渲染嵌入至vscode自带的markdown preview之中。
请帮我检查reference目录下的两个文件夹，分别是mermaid for markdown和wavedrom的源代码，
你可以参考Mermaid for markdown的实现来帮助我完成任务。
我也配置了可以连接浏览器的MCP服务(playwright)，你可以调用它来查询你可能需要用到的资料。
请建立计划包括尽量在无人值守的情况下完成项目的开发和测试，直到输出vsix目标文件。
```

**意图**: 用户有两个本地参考项目目录，期望 AI 自动分析参考实现、制定计划、然后全自动完成开发到 VSIX 打包。

---

## 2. 工作流设计 (Workflow Design)

### 阶段 1: 调研与分析

用户提供两个参考目录 → AI 自动遍历分析:

| 目录 | 分析要点 |
|------|----------|
| `reference/vscode-markdown-mermaid/` | VSCode Markdown 扩展架构: `markdown.previewScripts` + `markdown.markdownItPlugins` |
| `reference/wavedrom/` | Wavedrom 渲染流水线: `renderAny()` → ONML → `onml.stringify()` → SVG |
| `reference/waveform-render-vscode/` | 独立 WebView Panel 模式，手动下载的 `wavedrom.min.js` |

**关键发现**: Mermaid 扩展使用 2 组件架构 — ① Extension Host 侧的 markdown-it 插件拦截代码块，② Preview 侧注入脚本渲染。这个模式可以直接复用到 Wavedrom。

### 阶段 2: 文档验证

用户询问是否需要浏览器查询文档 → 通过 WebFetch 验证 VSCode Markdown Extension API 文档，确认 `extendMarkdownIt` 和 `previewScripts` 使用方式正确。

### 阶段 3: 计划制定

计划文档包含:
- 架构设计（Extension Host + Preview Script 双组件）
- 文件结构
- Webpack 构建配置
- 每个组件的职责
- 兼容性目标（VSCode 1.85+ / Node 18.15.0）

用户确认计划后进入实施。

### 阶段 4: 逐步实现

```
Phase 1: 项目脚手架 (package.json, tsconfig, webpack)
Phase 2: Extension Host (markdown-it 插件)
Phase 3: Preview Script (wavedrom 渲染)
Phase 4: 安装依赖 + 构建
Phase 5: 测试 + VSIX 打包
```

### 阶段 5: 循环迭代

用户提出问题 → AI 修复/补充 → 重新构建 → 验证通过:

| 迭代 | 触发 | 变更 |
|------|------|------|
| 皮肤支持 | 用户询问补充材料 | 复制 narrow/lowkey/narrower/narrowerer 皮肤文件 |
| Icon 设计 | "你会用SVG绘图吗" | 4 轮 SVG 设计迭代 → PNG 导出 |
| 发布准备 | publisher/license 疑问 | 创建 README/CHANGELOG/GitHub CI |
| Git 推送 | "帮我放上去" | git init → commit → push |
| README 补充 | 要求加项目背景 | 添加 VibeCoding 实验说明 |

### 阶段 6: 质量保障

```
验证项             方法
─────────         ─────
Webpack 编译       npm run build
VSIX 打包          @vscode/vsce package
扩展导出确认       node -e "require('./dist/extension')"
预览脚本完整性     内容扫描 (renderAny / onml / json5)
```

---

## 3. 关键决策记录 (Key Decisions)

| 决策 | 选项 | 选择 | 理由 |
|------|------|------|------|
| 架构模式 | WebView Panel vs PreviewScript | **PreviewScript** | 直接嵌入 VSCode 原生预览，无需额外 UI |
| Wavedrom 引入 | 预构建 min.js vs npm 包 | **npm 包 + webpack** | 版本管理、与 Mermaid 扩展模式一致 |
| JSON 解析 | eval() vs JSON5 | **JSON5** | CSP 安全、支持宽松语法 |
| 构建工具 | tsc vs webpack | **webpack** | 需要为 webview 打包 wavedrom + 依赖 |
| 皮肤系统 | 从 npm 导入 vs 复制文件 | **复制文件** | npm exports 字段阻止子路径导入 |

---

## 4. 提示词序列 (Prompt Sequence)

```
[1] 初始需求 + 参考目录分析
[2] 是否需要查询文档？ (自主决策)
[3] 计划确认 (Do it / 简化 / 增加功能)
[4] 补充信息: Node 版本、VSCode 兼容性
[5] 切换到实施模式
[6] Publisher / License / 发布准备
[7] SVG Icon 设计 (4轮迭代)
[8] 更新 publisher + GitHub 仓库推送
[9] README 补充 VibeCoding 说明
[10] 本文件: 实验记录汇总
```

所有有效交互共计 **10 条用户消息**，从需求提出到 VSIX 输出 + GitHub 推送。

---

## 5. 技术栈

```
┌─────────────────────────────────────────────┐
│  VSCode Extension                           │
│  ├── markdown-it plugin (Extension Host)     │
│  └── previewScript (WebView / Browser)       │
├─────────────────────────────────────────────┤
│  Build                                       │
│  ├── Webpack 5                               │
│  ├── TypeScript 5.3                          │
│  ├── ts-loader                               │
│  └── terser-webpack-plugin                   │
├─────────────────────────────────────────────┤
│  Dependencies (bundled into preview)         │
│  ├── wavedrom 3.6.1                          │
│  ├── json5 2.x                               │
│  ├── onml (via wavedrom)                     │
│  ├── logidrom (via wavedrom)                 │
│  ├── bit-field (via wavedrom)                │
│  └── tspan (via wavedrom)                    │
├─────────────────────────────────────────────┤
│  Packaging                                   │
│  └── @vscode/vsce                            │
└─────────────────────────────────────────────┘
```

---

## 6. 成本统计

| 项目 | 花费 |
|------|------|
| API 调用 (DeepSeek V4) | < 2 RMB |
| 人工干预 | ~0 |
| 开发时间 (AI) | ~30 分钟 |
| 迭代轮次 | 10 条消息 |
| 最终产出 | 48 KB VSIX, 23 个文件 |

---

## 7. 经验总结

1. **参考代码 > 文档**: 分析 Mermaid 扩展源码比看 VSCode API 文档更高效
2. **渐进式迭代**: 先 MVP 再逐步加功能（皮肤、图标、CI）
3. **错误自愈**: Webpack 构建错误自动修复（类型声明、NodeList 迭代）
4. **最终用户零代码**: 作者完全不懂 JS，仅用自然语言描述需求

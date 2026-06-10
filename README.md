# NAGI BENCH

中文 | [English](./README.en.md)

NAGI STUDIO 的 LLM 测评案例集：同一段提示词，不同「模型 × Harness × 思考配额」组合，一次生成、不许返工，并排对比它们交出的可运行作品。

**线上站点：** https://bench.nagi.fun/

## 模型与 Harness 的关系

- **模型（Model）**：权重与推理引擎本身，如 GPT-5.5、Gemini 3.1 Pro、Claude Fable 5。
- **Harness（运行环境）**：包裹模型的产品/脚手架，如 Codex CLI、Cursor、AntiGravity、Claude 网页版——它决定工具调用、系统提示词、上下文管理与续写策略，对最终产出的影响往往不亚于模型本身。
- 因此本仓库的测评单位是**组合**：同一个模型在不同 Harness 或不同思考配额下，记为不同条目（例如 GPT-5.5 Pro 与跑在 Codex CLI 里的 GPT-5.5（xhigh）是同一模型家族的两条记录）。思考配额默认拉满（Max），未来同一组合可以追加新配额版本。

## 已测组合 / Registry

| 模型 | 厂商 | Harness 环境 | 思考配额 | 产出 |
|---|---|---|---|---|
| Claude Fable 5 | Anthropic | Claude 网页版 | Max | 02 |
| Claude Fable 5 | Anthropic | Claude Code | Max | 02 |
| GPT-5.5 Pro | OpenAI | ChatGPT 网页版 | Extended Pro | 02 |
| GPT-5.5 | OpenAI | Codex CLI（无 skill） | xhigh | 02 |
| Gemini 3.1 Pro | Google | AntiGravity | High | 02 |
| Gemini 3.1 Pro | Google | Google AI Studio | High | 01 |
| Gemini 3.5 Flash | Google | AntiGravity | High | 02 |
| Gemini 3.5 Flash | Google | Google AI Studio | High | 01 |
| Grok Build | xAI | Grok Build TUI（本地） | Max | 02 |
| Composer 2.5 | Cursor | Cursor | Max | 01 |
| DeepSeek-V4-Pro | DeepSeek | Claude Code | Max | 02 |
| Doubao Seed 2.0 Pro | ByteDance | 豆包网页版 | 超能模式 | 01 |
| Doubao Seed 2.0 Mini | ByteDance | 豆包网页版 | 快速模式 | 01 |
| MiMo v2.5 Pro | Xiaomi | Claude Code | Max | 02 |
| Kimi K2.6 | Moonshot AI | Kimi Code（本地） | Thinking | 02 |
| MiniMax M3 | MiniMax | MiniMax Code 网页版 | Thinking | 01 |

待测：Mistral Medium 3.5 · GLM-5.1 · Qwen3.7-Max（欢迎 PR 补充）

> 此表为人工维护的快照；站点上的「模型阵容」表由 `models/*.json` 实时生成，以站点为准。

## Arena 盲评与社区榜单

- 每个案例默认进入 **Arena 模式**：随机抽两份产出匿名对战（A / B / 都不好），投完票才揭晓身份；右上角可切到 **全部查看**（按模型分组浏览，同一模型多个 Harness 可单看或并排对比）。
- 在两个案例各投满 03 票后解锁**社区榜单**：按 Bradley-Terry 评分排名（LMSYS Chatbot Arena 同思路），「都不好」单独计入双败。
- 投票默认存浏览器本地；部署 `worker/`（Cloudflare Worker + D1 + Turnstile 防刷，免费档即可）后自动升级为全站众包数据，步骤见 [worker/README.md](./worker/README.md)。

## 结构 / Structure

```
outputs/<model-id>/<case-id>.<ext>   模型产出原文件（HTML / SVG），文件名 = 案例 id
models/<model-id>.json               组合登记：label / vendor / harness / effort / order / 各案例运行备注
site/                                展示站点（Vite + React + Tailwind v4 + GSAP，bun 驱动）
site/src/data/cases.json             案例定义：双语标题与提示词（维护者维护）
.github/workflows/                   deploy.yml 自动部署；ci.yml 对 PR 跑数据校验 + 构建
```

## 本地开发 / Development

```bash
cd site
bun install
bun run dev      # 同步 outputs/ 并启动 http://localhost:5173/
bun run build    # 数据校验 + 类型检查 + 产物构建（输出到 site/dist）
```

## 贡献一个模型产出 / Contributing a run

贡献**不需要改任何代码**，只涉及两类文件：

1. 产出文件：`outputs/<model-id>/<case-id>.<ext>`（如 `outputs/gpt-5-5-pro/pelican-cycling.svg`）。
2. 组合登记：`models/<model-id>.json`（新组合新建文件；已有组合在 `runs` 里加一条）：

```json
{
  "label": "GPT-5.5 Pro",
  "vendor": "OpenAI",
  "harness": "ChatGPT Web",
  "effort": "Extended Pro",
  "order": 20,
  "runs": {
    "pelican-cycling": {
      "note": {
        "zh": "在哪个 Harness 里、什么思考档位、是否一次生成、是否有修复",
        "en": "Which harness, what effort level, one-shot or fixed"
      },
      "contributor": "你的 GitHub 用户名"
    }
  }
}
```

规则（CI 自动校验，不满足会挂）：
- `model-id` 只用小写字母/数字/连字符（如 `doubao-seed-2-0-pro`），文件名与 `outputs/` 目录名一致；
- 每条 run 的 `note` **双语必填**——这是本仓库的可信度来源，必须写明产出怎么来的；
- 声明的 run 必须有对应的产出文件；
- 同一组合对同一案例可提交多个版本：`runs.<case-id>` 写成数组，第二个版本起必须用 `file` 指定不同文件名（如 `pelican-cycling-2.svg`）；
- `contributor` 填你的 GitHub 用户名，站点会在产出旁展示你的头像并链接到主页；
- 新组合的 `harness`（运行环境）与 `effort`（思考配额）请如实填写：站点会据此在测评页生成「运行环境 / 思考配额」metadata 徽章，并自动为模型、厂商、Harness 匹配品牌 icon（来自 [lobe-icons](https://github.com/lobehub/lobe-icons)），贡献者无需处理任何图标。

提 PR 后 CI 会跑数据校验 + 构建；合入 `main` 自动部署。

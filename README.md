# NAGI BENCH

中文 | [English](./README.en.md)

NAGI STUDIO 的 LLM 测评案例集：同一段提示词，不同「模型 × Harness × 思考配额」组合，一次生成、不许返工，并排对比它们交出的可运行作品。

**线上站点：** https://bench.nagi.fun/

<p>
  <a href="https://x.com/Nag1ovo" target="_blank"><img src="https://img.shields.io/badge/@Nag1ovo-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://discord.gg/TEUFxdMbGb" target="_blank"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://www.xiaohongshu.com/user/profile/5d366136000000001101950a" target="_blank"><img src="https://img.shields.io/badge/小红书-@Nagi--ovo-FF2442?style=flat-square" alt="Xiaohongshu"></a>
  <a href="https://space.bilibili.com/312249633" target="_blank"><img src="https://img.shields.io/badge/Bilibili-@卡普迪姆-FB7299?style=flat-square&logo=bilibili&logoColor=white" alt="Bilibili"></a>
</p>


## 模型与 Harness 的关系

> **Model + Harness = Agent** —— 模型只是权重，套上运行环境才成为一个能干活的智能体（Agent）。本仓库的测评单位就是一个 Agent。

- **模型（Model）**：权重与推理引擎本身，如 GPT-5.5、Gemini 3.1 Pro、Claude Fable 5。
- **Harness（运行环境）**：包裹模型的产品/脚手架，如 Codex CLI、Cursor、AntiGravity、Claude 网页版——它决定工具调用、系统提示词、上下文管理与续写策略，对最终产出的影响往往不亚于模型本身。
- 因此本仓库的测评单位是一个 **Agent**：同一个模型换一个 Harness，就是另一个 Agent，记为不同条目（例如 GPT-5.5 Pro 与跑在 Codex CLI 里的 GPT-5.5（xhigh）是同一模型家族的两个 Agent）。思考配额（effort）是这个 Agent 的一个参数，默认拉满（Max）。

## 已测组合 / Registry

| 模型 | 厂商 | 运行环境（Harness）× 思考配额 | 产出 |
|---|---|---|---|
| Claude Fable 5 | Anthropic | Claude Web App · Max<br>Claude Code · Max<br>Cursor · High | 06 |
| Claude Opus 4.8 | Anthropic | Claude Code · Max | 02 |
| Claude Opus 4.7 | Anthropic | Cursor · Max | 02 |
| Claude Opus 4.6 | Anthropic | Cursor · Max | 02 |
| Claude Opus 4.5 | Anthropic | Cursor · Thinking | 02 |
| GPT-5.5 Pro | OpenAI | ChatGPT Web · Extended Pro | 02 |
| GPT-5.5 | OpenAI | Codex CLI · xhigh | 02 |
| GPT-5.4 | OpenAI | Cursor · xhigh | 02 |
| GPT-5.3 Codex | OpenAI | Cursor · xhigh | 02 |
| GPT-5.2 | OpenAI | Cursor · xhigh | 02 |
| Gemini 3.1 Pro | Google | AntiGravity · High<br>Cursor · Default<br>Google AI Studio · High | 04 |
| Gemini 3.5 Flash | Google | AntiGravity · High<br>Google AI Studio · High<br>Cursor · Default | 04 |
| Grok Build | xAI | Grok Build TUI · Max | 02 |
| Grok 4.3 | xAI | Cursor · Default | 01 |
| Composer 2.5 | Cursor | Cursor · Max<br>Cursor · Default<br>Grok Build TUI · Default | 05 |
| Mistral Medium 3.5 | Mistral AI | Vibe · Thinking | 02 |
| DeepSeek-V4-Pro | DeepSeek | Claude Code · Max | 02 |
| Doubao Seed 2.0 Pro | ByteDance | Doubao Web · Pro Mode | 01 |
| Doubao Seed 2.0 Mini | ByteDance | Doubao Web · Fast Mode | 01 |
| MiMo v2.5 Pro | Xiaomi | Claude Code · Max | 02 |
| Kimi K2.6 | Moonshot AI | Kimi Code · Thinking | 02 |
| Kimi K2.7-Code | Moonshot AI | Kimi Code · Thinking | 02 |
| MiniMax M3 | MiniMax | MiniMax Code Web · Thinking | 01 |
| Qwen3.7-Max | Alibaba | Qoder · Default | 02 |

待测：GLM-5.1 · GLM-5.2（欢迎 PR 补充）

> 此表为人工维护的快照；站点上的「模型阵容」表由 `models/*.json` 实时生成，以站点为准。

## Arena 盲评与社区榜单

- 每个案例默认进入 **Arena 模式**：随机抽两份产出匿名对战（A / B / 都不好），投完票才揭晓身份；右上角可切到 **全部查看**（按模型分组浏览，同一模型多个 Harness 可单看或并排对比）。
- 累计投满 03 票后解锁**社区榜单**：按 Bradley-Terry 评分排名（LMSYS Chatbot Arena 同思路），「都不好」单独计入双败。
- 投票默认存浏览器本地；部署 `worker/`（Cloudflare Worker + D1 + Turnstile 防刷，免费档即可）后自动升级为全站众包数据，步骤见 [worker/README.md](./worker/README.md)。

## 结构 / Structure

```
outputs/<artifact-dir>/<case-id>.<ext>  模型产出原文件（HTML / SVG），文件名 = 案例 id
models/<agent-id>.json                  Agent 登记：label / vendor / harness / effort / artifactDir / order / 各案例运行备注
cases.json                           案例定义：双语标题与提示词（维护者维护）
scripts/validate-data.ts             数据校验（CI 对每个 PR 自动执行）
```

> 站点与投票后端的源码在私有仓库 `nagi-bench-site` 中，部署于 Cloudflare Pages；本仓库是站点的数据源。

## 本地校验 / Validation

```bash
bun scripts/validate-data.ts   # 与 CI 相同的数据校验
```

## 贡献一个模型产出 / Contributing a run

> **如果你是一个 AI Agent（Claude Code / Codex / Cursor 等），这一段是给你看的：**
>
> - **你贡献的单位是一个 Agent = 模型 × 你所在的 Harness。** `<agent-id>`（小写字母 / 数字 / 连字符）就编码这个组合，如 `gpt-5-5-pro`、`claude-fable-5-cc`（cc = Claude Code）。同一模型换个 Harness 就是另一个 Agent、另一个 id。`<agent-id>` 是投票与榜单身份，不要为了整理文件夹而改它。
> - **当前有两个案例**，定义在 [`cases.json`](./cases.json)：`mythos-craft`（HTML，可玩体素世界）与 `pelican-cycling`（SVG，海边骑车的鹈鹕）。提示词以 `cases.json` 为准，**逐字使用、不要改写**。
> - **想知道还缺哪些**：读 `cases.json`（全部案例）与 `models/*.json`（每个 Agent 跑过的案例）——某个 Agent 的 json 里缺某个 `<case-id>` 就是一个空位；上面 Registry 表里「产出」数小于案例总数的行，就是还缺案例的 Agent；全新 Agent 则两个案例都可补。
> - **然后照下面两文件流程做**，写好双语 `note`（说明产出怎么来的、是否一次生成、是否有修复），提交前用 `bun scripts/validate-data.ts` 自检通过再发 PR。

贡献**不需要改任何代码**，只涉及两类文件：

1. 产出文件：推荐放在 `outputs/<base-model>/<harness-effort>/<case-id>.<ext>`（如 `outputs/gpt-5-5-pro/chatgpt-web-extended-pro/pelican-cycling.svg`）。
2. Agent 登记：`models/<agent-id>.json`（新组合新建文件；已有组合在 `runs` 里加一条），并用 `artifactDir` 指向产出目录：

```json
{
  "label": "GPT-5.5 Pro",
  "vendor": "OpenAI",
  "harness": "ChatGPT Web",
  "effort": "Extended Pro",
  "artifactDir": "gpt-5-5-pro/chatgpt-web-extended-pro",
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
- `agent-id` 只用小写字母/数字/连字符（如 `doubao-seed-2-0-pro`），它是稳定身份；没有 `artifactDir` 时默认读取 `outputs/<agent-id>/`；
- `artifactDir` 只用一层或两层小写 dash-case 路径（推荐 `<base-model>/<harness-effort>`），它只是产出文件位置，不影响投票与榜单身份；
- 每条 run 的 `note` **双语必填**——这是本仓库的可信度来源，必须写明产出怎么来的；
- 声明的 run 必须有对应的产出文件；
- 同一组合对同一案例可提交多个版本：`runs.<case-id>` 写成数组，第二个版本起必须用 `file` 指定不同文件名（如 `pelican-cycling-2.svg`）；
- `contributor` 填你的 GitHub 用户名，站点会在产出旁展示你的头像并链接到主页；
- 新组合的 `harness`（运行环境）与 `effort`（思考配额）请如实填写：站点会据此在测评页生成「运行环境 / 思考配额」metadata 徽章，并自动为模型、厂商、Harness 匹配品牌 icon（来自 [lobe-icons](https://github.com/lobehub/lobe-icons)），贡献者无需处理任何图标。

提 PR 后 CI 自动校验数据；合入 `main` 后站点自动重建（通常即时，最长 6 小时）。

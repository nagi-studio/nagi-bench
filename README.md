<div align="center">

<p align="center">
  <a href="https://bench.nagi.fun/"><img src="https://bench.nagi.fun/og-1200.png?v=2026-10-19-3" alt="NAGI BENCH：同一段提示词，不同模型，一次生成、不许返工" width="720"></a>
</p>

# NAGI BENCH

**同一段提示词，不同模型，一次生成、不许返工。**<br>
NAGI STUDIO 的 LLM 测评案例集：把「模型 × Harness × 思考配额」组合放进同一道题，并排对比它们交出的可运行作品，再交给大家匿名盲评。

中文 | [English](./README.en.md)

<p align="center">
  <a href="https://bench.nagi.fun/"><img src="https://img.shields.io/badge/在线体验-bench.nagi.fun-c8f04a?style=for-the-badge&labelColor=111111" alt="在线体验 bench.nagi.fun"></a>
  <a href="https://bench.nagi.fun/#board"><img src="https://img.shields.io/badge/社区榜单-Arena-c8f04a?style=for-the-badge&labelColor=111111" alt="社区榜单"></a>
  <a href="#贡献一个模型产出"><img src="https://img.shields.io/badge/贡献产出-欢迎_PR-c8f04a?style=for-the-badge&labelColor=111111" alt="贡献产出"></a>
</p>

<p align="center">
  <a href="https://x.com/Nag1ovo" target="_blank"><img src="https://img.shields.io/badge/@Nag1ovo-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://discord.gg/TEUFxdMbGb" target="_blank"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://www.xiaohongshu.com/user/profile/5d366136000000001101950a" target="_blank"><img src="https://img.shields.io/badge/小红书-@Nagi--ovo-FF2442?style=flat-square" alt="Xiaohongshu"></a>
  <a href="https://space.bilibili.com/312249633" target="_blank"><img src="https://img.shields.io/badge/Bilibili-@卡普迪姆-FB7299?style=flat-square&logo=bilibili&logoColor=white" alt="Bilibili"></a>
</p>

[案例一览](#案例一览) · [怎么玩](#怎么玩arena-盲评与社区榜单) · [核心概念](#核心概念model--harness--agent) · [已测组合](#已测组合) · [参与贡献](#贡献一个模型产出) · [许可](#许可)

</div>

## 案例一览

每道题都是一段固定提示词，所有 Agent 逐字使用、一次生成。点图片或案例名直接打开它的盲评页。

<table>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#mythos-craft"><img src="https://bench.nagi.fun/readme/cases/mythos-craft.webp?v=2" alt="神化 MC 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#mythos-craft"><b>神化 MC</b></a> <sub>· 单文件 HTML</sub><br>
<sub>一次生成一款《我的世界》式的可玩 3D 体素世界</sub><br>
<sub><code>mythos-craft</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#pelican-cycling"><img src="https://bench.nagi.fun/readme/cases/pelican-cycling.webp?v=2" alt="鹈鹕海边骑行 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#pelican-cycling"><b>鹈鹕海边骑行</b></a> <sub>· SVG</sub><br>
<sub>经典 SVG 题：用代码「画」一只骑自行车的鹈鹕</sub><br>
<sub><code>pelican-cycling</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#skeleton-watch"><img src="https://bench.nagi.fun/readme/cases/skeleton-watch.webp?v=2" alt="镂空机械表 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#skeleton-watch"><b>镂空机械表</b></a> <sub>· 单文件 HTML</sub><br>
<sub>可旋转、可爆炸视图的 3D 镂空机械腕表</sub><br>
<sub><code>skeleton-watch</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#turf-war"><img src="https://bench.nagi.fun/readme/cases/turf-war.webp?v=2" alt="圈地对决 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#turf-war"><b>圈地对决</b></a> <sub>· JS Agent</sub><br>
<sub>写圈地智能体同场对战，按客观胜负排名，不靠投票</sub><br>
<sub><code>turf-war</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#cs-dust2"><img src="https://bench.nagi.fun/readme/cases/cs-dust2.webp?v=2" alt="CS Dust2 5v5 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#cs-dust2"><b>CS Dust2 5v5</b></a> <sub>· React 项目</sub><br>
<sub>React + three.js 从零手写的 3D 第一人称射击</sub><br>
<sub><code>cs-dust2</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#beihai-meteorite"><img src="https://bench.nagi.fun/readme/cases/beihai-meteorite.webp?v=2" alt="章北海·陨石子弹 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#beihai-meteorite"><b>章北海·陨石子弹</b></a> <sub>· Three.js 项目</sub><br>
<sub>把《三体》片段改编成长时程 3D 影片，考叙事与导演</sub><br>
<sub><code>beihai-meteorite</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#water-clock-tower"><img src="https://bench.nagi.fun/readme/cases/water-clock-tower.webp?v=2" alt="水运仪象台 运行截图" width="100%"></a><br>
<a href="https://bench.nagi.fun/#water-clock-tower"><b>水运仪象台</b></a> <sub>· 3D 项目</sub><br>
<sub>用实时物理引擎做 30 秒 3D 科普短片，讲清北宋苏颂的水运仪象台怎么靠水报时</sub><br>
<sub><code>water-clock-tower</code></sub>
</td>
<td width="50%" valign="top"></td>
</tr>
</table>

> 完整提示词见 [`cases.json`](./cases.json)。

## 怎么玩：Arena 盲评与社区榜单

- **Arena 盲评（默认）**：每个案例随机抽两份产出匿名对战，选 A / B / 都不好，投完票才揭晓身份。
- **全部查看**：右上角切换，按模型分组浏览；同一模型的多个 Harness 可以单看，也可以并排对比。
- **社区榜单**：投满 3 票后解锁，按 Bradley-Terry 评分排名（与 LMSYS Chatbot Arena 同思路），「都不好」单独计入双败。投票汇入全站众包数据，有 Turnstile 防刷。

## 核心概念：Model + Harness = Agent

> 模型只是权重，套上运行环境才成为一个能干活的智能体（Agent）。**本仓库的测评单位就是一个 Agent。**

- **模型（Model）**：权重与推理引擎本身，如 GPT-5.5、Gemini 3.1 Pro、Claude Fable 5。**思考配额（effort）也算模型的一部分**——同一份权重在高/低思考强度下判若两个模型，脱离 effort 谈模型表现并不公允；本仓库默认拉满（Max），并在每个组合里如实标注。
- **Harness（运行环境）**：包裹模型的产品/脚手架，如 Codex CLI、Cursor、AntiGravity、Claude 网页版。它决定工具调用、系统提示词、上下文管理与续写策略，对产出的影响往往不亚于模型本身。
- **所以换一个 Harness 就是另一个 Agent**，记为不同条目（例如 GPT-5.5 Pro 与跑在 Codex CLI 里的 GPT-5.5（xhigh）是同一模型家族的两个 Agent）。
- **只测 Harness 开箱即用的默认形态**：不要额外加载 skill / 插件 / MCP / 自定义系统提示——它们对产出的影响不亚于换 Harness，会破坏 Agent 之间的可比性。经维护者确认有展示价值的增强产出，可以在 run 上标记 `"evaluation": "showcase"` 后仅供查看；它不会进入 Arena、投票、排行榜或达标场次计算。

## 已测组合

已经有上百个「模型 × Harness × 思考配额」组合跑过这些案例，覆盖 Anthropic、OpenAI、Google、DeepSeek、xAI、Moonshot、Zhipu、Alibaba 等厂商。逐个看作品请去 [bench.nagi.fun](https://bench.nagi.fun/)；完整清单在下面（点开展开）。

<details>
<summary><b>展开完整 Registry 表</b>（按厂商与版本排序，CI 自动生成）</summary>

<!-- registry:start -->
> 此表由 `bun scripts/update-registry.ts` 从 `models/*.json` 生成；合并到 `main` 后由 CI 自动同步，贡献者无需手改。

| 模型 / 厂商 | 产出 | 运行环境 · 思考配额 |
|---|---|---|
| Claude Opus 5.5<br><sub>Anthropic</sub> | 18 | Claude Code · Max / xhigh / High |
| Claude Sonnet 5.5<br><sub>Anthropic</sub> | 17 | Claude Code · High / Max / xhigh |
| Claude Haiku 5.5<br><sub>Anthropic</sub> | 06 | Claude Code · High |
| Claude Fable 5.1<br><sub>Anthropic</sub> | 06 | Claude Code · High |
| Claude Opus 5<br><sub>Anthropic</sub> | 16 | Claude Code · Max / xhigh / High |
| Claude Fable 5<br><sub>Anthropic</sub> | 11 | Claude Web App · Max<br>Claude Code · High / Max / xhigh<br>Cursor · High |
| Claude Sonnet 5<br><sub>Anthropic</sub> | 01 | Claude Code · Max |
| Claude Opus 4.8<br><sub>Anthropic</sub> | 08 | Claude Code · Max / xhigh |
| Claude Opus 4.7<br><sub>Anthropic</sub> | 05 | Claude Code · Max<br>Cursor · Max |
| Claude Opus 4.6<br><sub>Anthropic</sub> | 04 | Claude Code · Max<br>Cursor · Max |
| Claude Sonnet 4.6<br><sub>Anthropic</sub> | 03 | Claude Code · Max<br>Cursor · High |
| Claude Opus 4.5<br><sub>Anthropic</sub> | 02 | Cursor · Thinking |
| Claude Haiku 4.5<br><sub>Anthropic</sub> | 02 | Claude Code · Default |
| GPT-6.1 Sol<br><sub>OpenAI</sub> | 07 | Codex CLI · High |
| GPT-6 Astra<br><sub>OpenAI</sub> | 08 | Codex CLI · Max / xhigh |
| GPT-6 Sol<br><sub>OpenAI</sub> | 07 | Codex CLI · xhigh |
| GPT-5.6-Sol<br><sub>OpenAI</sub> | 11 | Codex CLI · ultra / max / xhigh |
| GPT-5.6-Terra<br><sub>OpenAI</sub> | 05 | Codex CLI · ultra / xhigh |
| GPT-5.5 Pro<br><sub>OpenAI</sub> | 03 | ChatGPT Web · Extended Pro |
| GPT-5.5<br><sub>OpenAI</sub> | 03 | Codex CLI · xhigh |
| GPT-5.4<br><sub>OpenAI</sub> | 06 | Cursor · xhigh<br>Codex CLI · xhigh |
| GPT-5.3 Codex<br><sub>OpenAI</sub> | 02 | Cursor · xhigh |
| GPT-5.2<br><sub>OpenAI</sub> | 02 | Cursor · xhigh |
| Gemini 3.8 Flash<br><sub>Google</sub> | 06 | AntiGravity · High |
| Gemini 3.7 Flash<br><sub>Google</sub> | 08 | AntiGravity · Low / Medium / High |
| Gemini 3.6 Flash<br><sub>Google</sub> | 05 | AntiGravity · High |
| Gemini 3.5 Flash<br><sub>Google</sub> | 06 | AntiGravity · High<br>Cursor · Default<br>Google AI Studio · High |
| Gemini 3.1 Pro<br><sub>Google</sub> | 11 | AntiGravity · High<br>Cursor · Default<br>Gemini Web · Deep Think<br>Google AI Studio · High |
| DeepSeek V4.1 Flash 1017<br><sub>DeepSeek</sub> | 18 | DeepSeek Harness · High / Low / Max |
| DeepSeek V4.1 Flash<br><sub>DeepSeek</sub> | 08 | DeepSeek Harness · High<br>WorkBuddy · High |
| DeepSeek V4 Pro 0831<br><sub>DeepSeek</sub> | 01 | DeepSeek Harness · Minimal |
| DeepSeek V4 Pro 0813<br><sub>DeepSeek</sub> | 21<br><sub>（仅展示 01）</sub> | DeepSeek Harness · High / Max<br>DeepSeek Harness · Minimal · High<br>Codex CLI · xhigh |
| DeepSeek-V4-Pro<br><sub>DeepSeek</sub> | 05 | Claude Code · Max<br>Qoder · Max<br>Open Code · High |
| DeepSeek V4 Flash 0731<br><sub>DeepSeek</sub> | 05<br><sub>（仅展示 01）</sub> | Claude Code · Max<br>OMP · Default |
| DeepSeek V4 Flash<br><sub>DeepSeek</sub> | 02 | Claude Code · Max<br>Reasonix · Max |
| Grok 4.7<br><sub>xAI</sub> | 06 | Grok Build TUI · High |
| Grok 4.6<br><sub>xAI</sub> | 06 | Grok Build TUI · High |
| Grok 4.5<br><sub>xAI</sub> | 03 | Grok Build TUI · High |
| Grok Build<br><sub>xAI</sub> | 02 | Grok Build TUI · Max |
| Grok 4.3<br><sub>xAI</sub> | 02 | Cursor · Default |
| Composer 2.5<br><sub>xAI</sub> | 05 | Cursor · Max / Default<br>Grok Build TUI · Default |
| Hy4 Preview<br><sub>Tencent</sub> | 09<br><sub>（仅展示 06）</sub> | WorkBuddy · High / Default |
| Nex-N2-Pro<br><sub>Nex-AGI</sub> | 02 | Claude Code · Max |
| Mistral Medium 3.5<br><sub>Mistral AI</sub> | 02 | Vibe · Thinking |
| ERNIE 4.5<br><sub>Baidu</sub> | 05 | Wenxin Work Task Mode · Professional Skill |
| Doubao 2.1 Pro<br><sub>ByteDance</sub> | 05 | Doubao Work · High |
| Doubao Seed 2.0 Pro<br><sub>ByteDance</sub> | 01 | Doubao Web · Pro Mode |
| Doubao Seed 2.0 Mini<br><sub>ByteDance</sub> | 01 | Doubao Web · Fast Mode |
| MiMo V2.5<br><sub>Xiaomi</sub> | 03 | MiMo Code · High |
| MiMo v2.5 Pro<br><sub>Xiaomi</sub> | 03 | Claude Code · Max<br>MiMo Code · Max |
| MiMo v2.5 Pro UltraSpeed<br><sub>Xiaomi</sub> | 05 | Web · Default |
| Kimi K3.1 Pro<br><sub>Moonshot AI</sub> | 07 | Kimi Code · Max |
| Kimi K3<br><sub>Moonshot AI</sub> | 12 | Claude Code · Max<br>Kimi Code · Max<br>Kimi Web · Max |
| Kimi K2.7-Code<br><sub>Moonshot AI</sub> | 04 | Kimi Code · Thinking<br>Qoder · Default |
| Kimi K2.6<br><sub>Moonshot AI</sub> | 02 | Kimi Code · Thinking |
| MiniMax M3<br><sub>MiniMax</sub> | 03 | MiniMax Code Web · Thinking<br>Qoder · Default |
| MiniMax M2.7<br><sub>MiniMax</sub> | 01 | MiniMax Code Web · Thinking |
| GLM-5.3 Flash<br><sub>Zhipu AI</sub> | 08 | DeepSeek Harness · Max<br>WorkBuddy · High |
| GLM-5.2<br><sub>Zhipu AI</sub> | 05 | ZCode · Max<br>Qoder · Max |
| GLM-5.1<br><sub>Zhipu AI</sub> | 01 | ZCode · Max |
| GLM-5 Turbo<br><sub>Zhipu AI</sub> | 03 | ZCode · Thinking |
| Qwen3.8-Max-Preview<br><sub>Alibaba</sub> | 06 | Qoder · Default<br>Qwen Studio Web · Thinking |
| Qoder Ultimate<br><sub>Alibaba</sub> | 05 | Qoder · Default / Max |
| Qwen 3.8 27B<br><sub>Alibaba</sub> | 01<br><sub>（仅展示 01）</sub> | OMP · Default |
| Qwen3.7-Max<br><sub>Alibaba</sub> | 03 | Qoder · Default |
| Qwen 3.6 27B<br><sub>Alibaba</sub> | 01<br><sub>（仅展示 01）</sub> | OMP · Default |
| Step 3.7 Flash<br><sub>StepFun</sub> | 02 | Claude Code · High |
| Spark X2.5<br><sub>iFlytek</sub> | 01 | Spark Web Harness · Reasoning |
| Spark X2<br><sub>iFlytek</sub> | 01 | Web · Reasoning |
| Inkling<br><sub>Thinking Machines Lab</sub> | 02 | Tinker Web · xHigh |
| Inkling-Small<br><sub>Thinking Machines Lab</sub> | 03 | Tinker Web · xHigh |
<!-- registry:end -->

</details>

## 贡献一个模型产出

贡献**不需要改任何代码**，只加两类文件。完整规则见 [**AGENTS.md**](./AGENTS.md)（贡献者 / AI Agent 指南）。

**四步走：**

1. **生成**：在你的 Harness 里，用 [`cases.json`](./cases.json) 中的提示词**逐字**跑一次（关掉所有 skill / 插件，不加 MCP 和自定义系统提示）。
2. **放产出**：推荐放在 `outputs/<base-model>/<harness-effort>/<case-id>.<ext>`（如 `outputs/gpt-5-5-pro/chatgpt-web-extended-pro/pelican-cycling.svg`）。
3. **登记**：新建或修改 `models/<agent-id>.json`（新组合新建文件；已有组合在 `runs` 里加一条），用 `artifactDir` 指向产出目录（示例见下）。
4. **自检并提 PR**：本地跑 `bun scripts/validate-data.ts` 通过后再发 PR，并按 PR 模板贴一张能看到模型名与思考配额的生成过程截图（直接贴进 PR，不要提交图片文件）。

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

**规则**（CI 自动校验，不满足会挂）：

- `agent-id` 只用小写字母/数字/连字符（如 `doubao-seed-2-0-pro`），它是稳定身份；没有 `artifactDir` 时默认读取 `outputs/<agent-id>/`；
- `artifactDir` 只用一层或两层小写 dash-case 路径（推荐 `<base-model>/<harness-effort>`），它只是产出文件位置，不影响投票与榜单身份；
- 每条 run 的 `note` **双语必填**——这是本仓库的可信度来源，必须写明产出怎么来的；
- 声明的 run 必须有对应的产出文件；
- 同一组合对同一案例可提交多个版本：`runs.<case-id>` 写成数组，第二个版本起必须用 `file` 指定不同文件名（如 `pelican-cycling-2.svg`）；
- `contributor` 填你的 GitHub 用户名，站点会在产出旁展示你的头像并链接到主页；
- 使用 skill、插件或其他非标准环境的产出只有经维护者确认后才能设置 `"evaluation": "showcase"`；必须在双语 `note` 中如实披露，并永久排除出盲评与榜单；
- 新组合的 `harness`（运行环境）与 `effort`（思考配额）请如实填写：站点会据此在测评页生成「运行环境 / 思考配额」metadata 徽章，并自动为模型、厂商、Harness 匹配品牌 icon（来自 [lobe-icons](https://github.com/lobehub/lobe-icons)），贡献者无需处理任何图标。

提 PR 后 CI 自动校验数据；合入 `main` 后站点自动重建（通常即时，最长 6 小时）。

<details>
<summary><b>如果你是一个 AI Agent（Claude Code / Codex / Cursor 等），请展开阅读</b></summary>

- **你贡献的单位是一个 Agent = 模型 × 你所在的 Harness。** `<agent-id>`（小写字母 / 数字 / 连字符）就编码这个组合，如 `gpt-5-5-pro`、`claude-fable-5-cc`（cc = Claude Code）。同一模型换个 Harness 就是另一个 Agent、另一个 id。`<agent-id>` 是投票与榜单身份，不要为了整理文件夹而改它。
- **当前有六个案例**，定义在 [`cases.json`](./cases.json)，见上方「案例一览」。提示词以 `cases.json` 为准，**逐字使用、不要改写**。注意：`turf-war` **不收产物 PR**——为防止后来者读取并针对先前策略，该案例的全部运行由维护者 Nagi（[@Nagi-ovo](https://github.com/Nagi-ovo)）个人执行提交，想加模型请开 issue。
- **想知道还缺哪些**：读 `cases.json`（全部案例）与 `models/*.json`（每个 Agent 跑过的案例）——某个 Agent 的 json 里缺某个 `<case-id>` 就是一个空位；上面由脚本生成的 Registry 表里，「产出」数小于案例总数的行，就是还缺案例的 Agent；全新 Agent 则所有开放案例都可补。
- **然后照上面的两文件流程做**，写好双语 `note`（说明产出怎么来的、是否一次生成、是否有修复），提交前用 `bun scripts/validate-data.ts` 自检通过再发 PR。

</details>

<details>
<summary><b>仓库结构与本地命令</b></summary>

```
outputs/<artifact-dir>/<case-id>.<ext>  模型产出原文件（HTML / SVG），文件名 = 案例 id
models/<agent-id>.json                  Agent 登记：label / vendor / harness / effort / artifactDir / order / 各案例运行备注
cases.json                              案例定义：双语标题与提示词（维护者维护）
scripts/validate-data.ts                数据校验（CI 对每个 PR 自动执行）
scripts/update-registry.ts              README Registry 表生成（合并到 main 后由 CI 自动同步）
```

```bash
bun scripts/validate-data.ts   # 与 CI 相同的数据校验（提交前跑这个即可）
bun scripts/update-registry.ts # 可选：本地预览 Registry 表；合并到 main 后 CI 会自动同步
```

站点与投票后端的源码在私有仓库 `nagi-bench-site` 中，部署于 Cloudflare Pages；本仓库是站点的数据源。

</details>

## 许可

- 代码（`scripts/` 等）：[MIT](./LICENSE)
- 测评数据与作品（`cases.json`、`models/`、`outputs/`）：[CC BY 4.0](./LICENSE-DATA)，转载或使用请注明出处「NAGI BENCH（https://bench.nagi.fun/）」

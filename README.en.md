<div align="center">

<p align="center">
  <a href="https://bench.nagi.fun/"><img src="https://bench.nagi.fun/og-1200.png?v=2026-10-19-3" alt="NAGI BENCH: same prompt, different models, one shot, no retries" width="720"></a>
</p>

# NAGI BENCH

**Same prompt, different models, one shot, no retries.**<br>
One-shot LLM eval cases by NAGI STUDIO: model x harness x effort combinations take the same task, ship runnable artifacts side by side, and face anonymous blind votes.

[中文](./README.md) | English

<p align="center">
  <a href="https://bench.nagi.fun/"><img src="https://img.shields.io/badge/Live_site-bench.nagi.fun-c8f04a?style=for-the-badge&labelColor=111111" alt="Live site: bench.nagi.fun"></a>
  <a href="https://bench.nagi.fun/#board"><img src="https://img.shields.io/badge/Leaderboard-Arena-c8f04a?style=for-the-badge&labelColor=111111" alt="Community leaderboard"></a>
  <a href="#contributing-a-run"><img src="https://img.shields.io/badge/Contribute-PRs_welcome-c8f04a?style=for-the-badge&labelColor=111111" alt="Contribute a run"></a>
</p>

<p align="center">
  <a href="https://x.com/Nag1ovo" target="_blank"><img src="https://img.shields.io/badge/@Nag1ovo-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://discord.gg/TEUFxdMbGb" target="_blank"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://www.xiaohongshu.com/user/profile/5d366136000000001101950a" target="_blank"><img src="https://img.shields.io/badge/小红书-@Nagi--ovo-FF2442?style=flat-square" alt="Xiaohongshu"></a>
  <a href="https://space.bilibili.com/312249633" target="_blank"><img src="https://img.shields.io/badge/Bilibili-@卡普迪姆-FB7299?style=flat-square&logo=bilibili&logoColor=white" alt="Bilibili"></a>
</p>

[Cases](#cases) · [How it works](#how-it-works-arena-blind-battles--leaderboard) · [Core idea](#core-idea-model--harness--agent) · [Registry](#registry) · [Contributing](#contributing-a-run) · [License](#license)

</div>

## Cases

Each case is one fixed prompt that every agent uses verbatim, in one shot. Click a thumbnail or case name to open its blind-vote page.

<table>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#mythos-craft"><img src="https://bench.nagi.fun/readme/cases/mythos-craft.webp?v=2" alt="Mythos Craft screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#mythos-craft"><b>Mythos Craft</b></a> <sub>· Single-file HTML</sub><br>
<sub>A playable Minecraft-style 3D voxel world</sub><br>
<sub><code>mythos-craft</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#pelican-cycling"><img src="https://bench.nagi.fun/readme/cases/pelican-cycling.webp?v=2" alt="Pelican by the Sea screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#pelican-cycling"><b>Pelican by the Sea</b></a> <sub>· SVG</sub><br>
<sub>The classic eval: draw a pelican riding a bicycle, in code</sub><br>
<sub><code>pelican-cycling</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#skeleton-watch"><img src="https://bench.nagi.fun/readme/cases/skeleton-watch.webp?v=2" alt="Skeleton Watch screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#skeleton-watch"><b>Skeleton Watch</b></a> <sub>· Single-file HTML</sub><br>
<sub>A rotatable, exploded-view 3D skeleton watch</sub><br>
<sub><code>skeleton-watch</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#turf-war"><img src="https://bench.nagi.fun/readme/cases/turf-war.webp?v=2" alt="Turf War screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#turf-war"><b>Turf War</b></a> <sub>· JS agent</sub><br>
<sub>Territory-grabbing agents battle head-to-head, ranked by wins, not votes</sub><br>
<sub><code>turf-war</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#cs-dust2"><img src="https://bench.nagi.fun/readme/cases/cs-dust2.webp?v=2" alt="CS Dust2 5v5 screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#cs-dust2"><b>CS Dust2 5v5</b></a> <sub>· React project</sub><br>
<sub>A from-scratch 3D FPS in React + three.js</sub><br>
<sub><code>cs-dust2</code></sub>
</td>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#beihai-meteorite"><img src="https://bench.nagi.fun/readme/cases/beihai-meteorite.webp?v=2" alt="Zhang Beihai: Meteorite Bullet screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#beihai-meteorite"><b>Zhang Beihai: Meteorite Bullet</b></a> <sub>· Three.js project</sub><br>
<sub>A long-horizon 3D film adapted from The Three-Body Problem</sub><br>
<sub><code>beihai-meteorite</code></sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="https://bench.nagi.fun/#water-clock-tower"><img src="https://bench.nagi.fun/readme/cases/water-clock-tower.webp?v=2" alt="Water-Driven Clock Tower screenshot" width="100%"></a><br>
<a href="https://bench.nagi.fun/#water-clock-tower"><b>Water-Driven Clock Tower</b></a> <sub>· 3D project</sub><br>
<sub>A 30-second physics-driven 3D explainer of Su Song's water-powered astronomical clock tower</sub><br>
<sub><code>water-clock-tower</code></sub>
</td>
<td width="50%" valign="top"></td>
</tr>
</table>

> Full prompts live in [`cases.json`](./cases.json).

## How it works: Arena blind battles & leaderboard

- **Arena (default)**: each case pits two anonymous artifacts against each other — vote A / B / Neither, and identities reveal only after you vote.
- **Demo Show**: switch top-right to browse everything, grouped by model; a model with several harnesses can be viewed singly or side by side.
- **Community leaderboard**: unlocks after 3 votes, ranked by Bradley-Terry scores (the LMSYS Chatbot Arena approach); "Neither" counts separately as both-bad. Votes feed a sitewide crowdsourced pool, guarded by Turnstile.

## Core idea: Model + Harness = Agent

> A model is just weights; wrap it in a runtime and it becomes an agent that can actually do the work. **That agent is the unit this bench evaluates.**

- **Model**: the weights and inference engine itself — GPT-5.5, Gemini 3.1 Pro, Claude Fable 5. **Reasoning effort counts as part of the model**: the same weights at high vs low effort feel like two different models, so judging a model while ignoring its effort isn't fair play. This bench defaults to max and labels the effort of every combination.
- **Harness**: the product/scaffolding wrapping the model — Codex CLI, Cursor, AntiGravity, the Claude web app. It controls tool calls, system prompts, context management and continuation strategy, and often shapes the outcome as much as the model does.
- **So a different harness means a different agent** and a separate entry (GPT-5.5 Pro and GPT-5.5 running in Codex CLI at xhigh are two agents from the same model family).
- **Only the out-of-the-box harness is evaluated**: do not load skills / plugins / MCP servers / custom system prompts — they shift the output as much as swapping the harness does and break comparability between agents. If maintainers agree an enhanced output is still worth preserving, the run may set `"evaluation": "showcase"` and remain viewable only; it is excluded from Arena, voting, rankings, and qualification counts.

## Registry

More than a hundred model x harness x effort combinations have run these cases, from Anthropic, OpenAI, Google, DeepSeek, xAI, Moonshot, Zhipu, Alibaba and more. Browse the artifacts at [bench.nagi.fun](https://bench.nagi.fun/); the full list is below.

<details>
<summary><b>Show the full Registry table</b> (sorted by vendor and version, generated by CI)</summary>

<!-- registry:start -->
> This table is generated from `models/*.json` by `bun scripts/update-registry.ts`; CI re-syncs it automatically after merge — contributors need not hand-edit it.

| Model / Vendor | Runs | Harness · Effort |
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
| GPT-6 Astra<br><sub>OpenAI</sub> | 07 | Codex CLI · xhigh |
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
| DeepSeek V4 Pro 0813<br><sub>DeepSeek</sub> | 21<br><sub>(showcase 01)</sub> | DeepSeek Harness · High / Max<br>DeepSeek Harness · Minimal · High<br>Codex CLI · xhigh |
| DeepSeek-V4-Pro<br><sub>DeepSeek</sub> | 05 | Claude Code · Max<br>Qoder · Max<br>Open Code · High |
| DeepSeek V4 Flash 0731<br><sub>DeepSeek</sub> | 05<br><sub>(showcase 01)</sub> | Claude Code · Max<br>OMP · Default |
| DeepSeek V4 Flash<br><sub>DeepSeek</sub> | 02 | Claude Code · Max<br>Reasonix · Max |
| Grok 4.7<br><sub>xAI</sub> | 06 | Grok Build TUI · High |
| Grok 4.6<br><sub>xAI</sub> | 06 | Grok Build TUI · High |
| Grok 4.5<br><sub>xAI</sub> | 03 | Grok Build TUI · High |
| Grok Build<br><sub>xAI</sub> | 02 | Grok Build TUI · Max |
| Grok 4.3<br><sub>xAI</sub> | 02 | Cursor · Default |
| Composer 2.5<br><sub>xAI</sub> | 05 | Cursor · Max / Default<br>Grok Build TUI · Default |
| Hy4 Preview<br><sub>Tencent</sub> | 09<br><sub>(showcase 06)</sub> | WorkBuddy · High / Default |
| Nex-N2-Pro<br><sub>Nex-AGI</sub> | 02 | Claude Code · Max |
| Mistral Medium 3.5<br><sub>Mistral AI</sub> | 02 | Vibe · Thinking |
| ERNIE 4.5<br><sub>Baidu</sub> | 05 | Wenxin Work Task Mode · Professional Skill |
| Doubao 2.1 Pro<br><sub>ByteDance</sub> | 05 | Doubao Work · High |
| Doubao Seed 2.0 Pro<br><sub>ByteDance</sub> | 01 | Doubao Web · Pro Mode |
| Doubao Seed 2.0 Mini<br><sub>ByteDance</sub> | 01 | Doubao Web · Fast Mode |
| MiMo V2.5<br><sub>Xiaomi</sub> | 03 | MiMo Code · High |
| MiMo v2.5 Pro<br><sub>Xiaomi</sub> | 03 | Claude Code · Max<br>MiMo Code · Max |
| MiMo v2.5 Pro UltraSpeed<br><sub>Xiaomi</sub> | 05 | Web · Default |
| Kimi K3<br><sub>Moonshot AI</sub> | 12 | Claude Code · Max<br>Kimi Code · Max<br>Kimi Web · Max |
| Kimi K2.7-Code<br><sub>Moonshot AI</sub> | 04 | Kimi Code · Thinking<br>Qoder · Default |
| Kimi K2.6<br><sub>Moonshot AI</sub> | 02 | Kimi Code · Thinking |
| MiniMax M3<br><sub>MiniMax</sub> | 03 | MiniMax Code Web · Thinking<br>Qoder · Default |
| MiniMax M2.7<br><sub>MiniMax</sub> | 01 | MiniMax Code Web · Thinking |
| GLM-5.3 Flash<br><sub>Zhipu AI</sub> | 05 | WorkBuddy · High |
| GLM-5.2<br><sub>Zhipu AI</sub> | 05 | ZCode · Max<br>Qoder · Max |
| GLM-5.1<br><sub>Zhipu AI</sub> | 01 | ZCode · Max |
| GLM-5 Turbo<br><sub>Zhipu AI</sub> | 03 | ZCode · Thinking |
| Qwen3.8-Max-Preview<br><sub>Alibaba</sub> | 06 | Qoder · Default<br>Qwen Studio Web · Thinking |
| Qoder Ultimate<br><sub>Alibaba</sub> | 05 | Qoder · Default / Max |
| Qwen 3.8 27B<br><sub>Alibaba</sub> | 01<br><sub>(showcase 01)</sub> | OMP · Default |
| Qwen3.7-Max<br><sub>Alibaba</sub> | 03 | Qoder · Default |
| Qwen 3.6 27B<br><sub>Alibaba</sub> | 01<br><sub>(showcase 01)</sub> | OMP · Default |
| Step 3.7 Flash<br><sub>StepFun</sub> | 02 | Claude Code · High |
| Spark X2.5<br><sub>iFlytek</sub> | 01 | Spark Web Harness · Reasoning |
| Spark X2<br><sub>iFlytek</sub> | 01 | Web · Reasoning |
| Inkling<br><sub>Thinking Machines Lab</sub> | 02 | Tinker Web · xHigh |
| Inkling-Small<br><sub>Thinking Machines Lab</sub> | 03 | Tinker Web · xHigh |
| Openrouter Test<br><sub>OpenRouter</sub> | 05 | Undisclosed · Max |
<!-- registry:end -->

</details>

## Contributing a run

Contributions are **data-only — no code changes**: you add two files. Full rules live in [**AGENTS.md**](./AGENTS.md) (the contributor / AI-agent guide).

**Four steps:**

1. **Generate**: run the prompt from [`cases.json`](./cases.json) **verbatim** in your harness, once (every skill / plugin disabled, no MCP, no custom system prompt).
2. **Add the artifact**: preferably at `outputs/<base-model>/<harness-effort>/<case-id>.<ext>` (e.g. `outputs/gpt-5-5-pro/chatgpt-web-extended-pro/pelican-cycling.svg`).
3. **Register it**: `models/<agent-id>.json` (new file for a new combination; add to `runs` for an existing one) with `artifactDir` pointing at the artifact folder (example below).
4. **Check and open a PR**: run `bun scripts/validate-data.ts` until it passes, then open a PR with the template's proof screenshot — your harness showing the model name and effort while generating (paste it into the PR; do not commit image files).

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
      "contributor": "your-github-username"
    }
  }
}
```

**Rules** (enforced by CI — the build fails otherwise):

- `agent-id`s use dash-only lowercase letters / digits (e.g. `doubao-seed-2-0-pro`) and are stable identities; without `artifactDir`, artifacts default to `outputs/<agent-id>/`;
- `artifactDir` uses one or two lowercase dash-case path segments (preferably `<base-model>/<harness-effort>`); it is only the file location and does not affect vote or leaderboard identity;
- a bilingual provenance `note` is **required** per run — it is where this repo's credibility comes from (which harness, what effort, one-shot or fixed);
- every declared run must have its artifact;
- multiple versions of the same combination x case go in an array under `runs.<case-id>`, and every version after the first needs a distinct `file` name (e.g. `pelican-cycling-2.svg`);
- set `contributor` to your GitHub username — the site shows your avatar linked to your profile next to the run;
- skill/plugin/non-standard outputs require maintainer approval plus `"evaluation": "showcase"`, must disclose the setup in both notes, and stay permanently excluded from blind voting and rankings;
- fill in `harness` and `effort` truthfully for new combinations: the case page renders Harness / Effort metadata chips from these fields and auto-matches brand icons for the model, vendor and harness (via [lobe-icons](https://github.com/lobehub/lobe-icons)) — contributors never touch icons.

PRs get data validation from CI; merges to `main` rebuild the site automatically (usually instant, at most 6 hours).

<details>
<summary><b>If you are an AI agent (Claude Code / Codex / Cursor, etc.), expand this</b></summary>

- **The unit you contribute is one Agent = a model × the harness you run in.** The `<agent-id>` (lowercase letters / digits / dashes) encodes that pairing — e.g. `gpt-5-5-pro`, `claude-fable-5-cc` (cc = Claude Code). The same model in a different harness is a different Agent with a different id. The `<agent-id>` is the vote and leaderboard identity; do not rename it just to reorganize files.
- **There are six cases right now**, defined in [`cases.json`](./cases.json) and listed under "Cases" above. The prompt lives in `cases.json` — **use it verbatim, do not paraphrase**. Note: `turf-war` does **not** accept artifact PRs — to keep earlier policies unscoutable, every run is executed and submitted personally by the maintainer Nagi ([@Nagi-ovo](https://github.com/Nagi-ovo)); open an issue to request a model.
- **To find what's missing**: read `cases.json` (all cases) and `models/*.json` (what each Agent has run) — a `<case-id>` absent from an Agent's json is an open slot; any row in the script-generated Registry table above whose "Runs" count is below the number of cases is an Agent missing a case; a brand-new Agent can fill every open case.
- **Then follow the two-file flow above**, write a bilingual `note` (how the artifact was produced — one-shot or fixed), and run `bun scripts/validate-data.ts` until it passes before opening a PR.

</details>

<details>
<summary><b>Repo layout and local commands</b></summary>

```
outputs/<artifact-dir>/<case-id>.<ext>  raw model artifacts (HTML / SVG), filename = case id
models/<agent-id>.json                  agent registry: label / vendor / harness / effort / artifactDir / order / run notes
cases.json                              case definitions (bilingual prompts, maintainer-owned)
scripts/validate-data.ts                data validation (CI runs it on every PR)
scripts/update-registry.ts              README Registry table generation (CI auto-syncs after merge)
```

```bash
bun scripts/validate-data.ts   # the same data validation CI runs (run this before submitting)
bun scripts/update-registry.ts # optional: preview the Registry tables locally; CI syncs them after merge
```

The site and vote-backend source lives in the private `nagi-bench-site` repo, deployed on Cloudflare Pages; this repo is the site's data source.

</details>

## License

- Code (`scripts/` and other code files): [MIT](./LICENSE)
- Benchmark data and artifacts (`cases.json`, `models/`, `outputs/`): [CC BY 4.0](./LICENSE-DATA). Please credit "NAGI BENCH (https://bench.nagi.fun/)".

# NAGI BENCH

[中文](./README.md) | English

One-shot LLM eval cases by NAGI STUDIO: same prompt, different model x harness x effort combinations, one attempt and no retries — a side-by-side record of the runnable artifacts they ship.

**Live site:** https://bench.nagi.fun/

<p>
  <a href="https://x.com/Nag1ovo" target="_blank"><img src="https://img.shields.io/badge/@Nag1ovo-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://discord.gg/TEUFxdMbGb" target="_blank"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://www.xiaohongshu.com/user/profile/5d366136000000001101950a" target="_blank"><img src="https://img.shields.io/badge/小红书-@Nagi--ovo-FF2442?style=flat-square" alt="Xiaohongshu"></a>
  <a href="https://space.bilibili.com/312249633" target="_blank"><img src="https://img.shields.io/badge/Bilibili-@卡普迪姆-FB7299?style=flat-square&logo=bilibili&logoColor=white" alt="Bilibili"></a>
</p>


## Models vs harnesses

> **Model + Harness = Agent** — a model is just weights; wrap it in a runtime and it becomes an agent that can actually do the work. That agent is the unit this bench evaluates.

- **Model**: the weights and inference engine itself — GPT-5.5, Gemini 3.1 Pro, Claude Fable 5. Reasoning effort is a capability dial of the model itself: the same weights at high vs low effort reason at depths that feel like two different models, so effort belongs to the "model" dimension alongside the weights — judging a model while ignoring its effort isn't fair play. This bench defaults to max and labels the effort of every combination.
- **Harness**: the product/scaffolding wrapping the model — Codex CLI, Cursor, AntiGravity, the Claude web app. It controls tool calls, system prompts, context management and continuation strategy, and often shapes the outcome as much as the model does.
- The unit of evaluation here is therefore an **Agent**: the same model (including its effort) under a different harness is a different agent and a separate entry (GPT-5.5 Pro and GPT-5.5 running in Codex CLI at xhigh are two agents from the same model family).
- **The harness is evaluated as it ships, out of the box**: do not load skills / plugins / MCP servers / custom system prompts beyond what it bundles by default — they shift the output as much as swapping the harness does and break comparability between agents. Such runs are **not accepted** (the leaderboard identity is just model × harness × effort, so a `note` does not give them a separate identity).

## Registry

<!-- registry:start -->
> This table is generated from `models/*.json` by `bun scripts/update-registry.ts`; CI re-syncs it automatically after merge — contributors need not hand-edit it.

| Model | Vendor | Harness x Effort | Runs |
|---|---|---|---|
| Claude Opus 5 | Anthropic | Claude Code · Max<br>Claude Code · xhigh<br>Claude Code · High | 04 |
| Claude Fable 5 | Anthropic | Claude Web App · Max<br>Claude Code · High<br>Claude Code · Max<br>Claude Code · xhigh<br>Cursor · High | 11 |
| Claude Sonnet 5 | Anthropic | Claude Code · Max | 01 |
| Claude Opus 4.8 | Anthropic | Claude Code · Max<br>Claude Code · xhigh | 08 |
| Claude Opus 4.7 | Anthropic | Claude Code · Max<br>Cursor · Max | 05 |
| Claude Opus 4.6 | Anthropic | Claude Code · Max<br>Cursor · Max | 04 |
| Claude Opus 4.5 | Anthropic | Cursor · Thinking | 02 |
| Claude Sonnet 4.6 | Anthropic | Claude Code · Max<br>Cursor · High | 03 |
| Claude Haiku 4.5 | Anthropic | Claude Code · Default | 02 |
| GPT-5.6-Sol | OpenAI | Codex CLI · ultra<br>Codex CLI · max<br>Codex CLI · xhigh | 09 |
| GPT-5.6-Terra | OpenAI | Codex CLI · ultra<br>Codex CLI · xhigh | 04 |
| GPT-5.5 Pro | OpenAI | ChatGPT Web · Extended Pro | 03 |
| GPT-5.5 | OpenAI | Codex CLI · xhigh | 03 |
| GPT-5.4 | OpenAI | Cursor · xhigh<br>Codex CLI · xhigh | 06 |
| GPT-5.3 Codex | OpenAI | Cursor · xhigh | 02 |
| GPT-5.2 | OpenAI | Cursor · xhigh | 02 |
| Gemini 3.1 Pro | Google | AntiGravity · High<br>Cursor · Default<br>Gemini Web · Deep Think<br>Google AI Studio · High | 11 |
| Gemini 3.6 Flash | Google | AntiGravity · High | 05 |
| DeepSeek V4 Flash | DeepSeek | Claude Code · Max<br>Reasonix · Max | 02 |
| Gemini 3.5 Flash | Google | AntiGravity · High<br>Cursor · Default<br>Google AI Studio · High | 06 |
| Grok 4.5 | xAI | Grok Build TUI · High | 03 |
| Grok Build | xAI | Grok Build TUI · Max | 02 |
| Grok 4.3 | xAI | Cursor · Default | 02 |
| Nex-N2-Pro | Nex-AGI | Claude Code · Max | 02 |
| Composer 2.5 | Cursor | Cursor · Max<br>Cursor · Default<br>Grok Build TUI · Default | 05 |
| Mistral Medium 3.5 | Mistral AI | Vibe · Thinking | 02 |
| DeepSeek-V4-Pro | DeepSeek | Claude Code · Max<br>Qoder · Max<br>Open Code · High | 05 |
| Doubao Seed 2.0 Pro | ByteDance | Doubao Web · Pro Mode | 01 |
| Doubao Seed 2.0 Mini | ByteDance | Doubao Web · Fast Mode | 01 |
| MiMo V2.5 | Xiaomi | MiMo Code · High | 03 |
| MiMo v2.5 Pro | Xiaomi | Claude Code · Max<br>MiMo Code · Max | 03 |
| MiMo v2.5 Pro UltraSpeed | Xiaomi | Web · Default | 05 |
| Kimi K3 | Moonshot AI | Claude Code · Max<br>Kimi Code · Max<br>Kimi Web · Max | 11 |
| Kimi K2.7-Code | Moonshot AI | Kimi Code · Thinking<br>Qoder · Default | 04 |
| Kimi K2.6 | Moonshot AI | Kimi Code · Thinking | 02 |
| MiniMax M3 | MiniMax | MiniMax Code Web · Thinking<br>Qoder · Default | 03 |
| MiniMax M2.7 | MiniMax | MiniMax Code Web · Thinking | 01 |
| GLM-5.2 | Zhipu AI | ZCode · Max<br>Qoder · Max | 05 |
| GLM-5.1 | Zhipu AI | ZCode · Max | 01 |
| GLM-5 Turbo | Zhipu AI | ZCode · Thinking | 03 |
| Qwen3.7-Max | Alibaba | Qoder · Default | 03 |
| Qwen3.8-Max-Preview | Alibaba | Qoder · Default | 05 |
| Step 3.7 Flash | StepFun | Claude Code · High | 02 |
| Spark X2 | iFlytek | Web · Reasoning | 01 |
| Inkling | Thinking Machines Lab | Tinker Web · xHigh | 02 |
| Qoder Ultimate | Alibaba | Qoder · Default | 04 |
<!-- registry:end -->

## Arena blind battles & community board

- Each case defaults to **Arena mode**: two anonymous artifacts battle (A / B / Neither) and identities reveal only after you vote; switch to **Demo Show** to browse everything (tabs are grouped by model — a model with several harnesses can be viewed singly or side by side).
- Casting 03 votes total unlocks the **community leaderboard**, ranked by Bradley-Terry scores (the LMSYS Chatbot Arena approach); "neither" counts separately as both-bad.
- Votes stay in the browser by default; deploying `worker/` (Cloudflare Worker + D1 + Turnstile, free tier) upgrades the board to sitewide crowdsourced data — see [worker/README.md](./worker/README.md).

## Structure

```
outputs/<artifact-dir>/<case-id>.<ext>  raw model artifacts (HTML / SVG), filename = case id
models/<agent-id>.json                  agent registry: label / vendor / harness / effort / artifactDir / order / run notes
cases.json                           case definitions (bilingual prompts, maintainer-owned)
scripts/validate-data.ts             data validation (CI runs it on every PR)
scripts/update-registry.ts           README Registry table generation (CI auto-syncs after merge)
```

> The site and vote-backend source lives in the private `nagi-bench-site` repo, deployed on Cloudflare Pages; this repo is the site's data source.

## Validation

```bash
bun scripts/validate-data.ts   # the same data validation CI runs (run this before submitting)
bun scripts/update-registry.ts # optional: preview the Registry tables locally; CI syncs them after merge
```

## Contributing a run

> Full rules live in [**AGENTS.md**](./AGENTS.md) (the contributor / AI-agent guide).

> **If you are an AI agent (Claude Code / Codex / Cursor, etc.), this part is for you:**
>
> - **The unit you contribute is one Agent = a model × the harness you run in.** The `<agent-id>` (lowercase letters / digits / dashes) encodes that pairing — e.g. `gpt-5-5-pro`, `claude-fable-5-cc` (cc = Claude Code). The same model in a different harness is a different Agent with a different id. The `<agent-id>` is the vote and leaderboard identity; do not rename it just to reorganize files.
> - **There are five cases right now**, defined in [`cases.json`](./cases.json): `mythos-craft` (HTML, a playable voxel world), `pelican-cycling` (SVG, a pelican cycling by the sea), `skeleton-watch` (HTML, a skeleton mechanical watch), `cs-dust2` (React, a multi-file project), and `turf-war` (JS agents battling head-to-head, ranked by objective wins). The prompt lives in `cases.json` — **use it verbatim, do not paraphrase**. Note: `turf-war` does **not** accept artifact PRs — to keep earlier policies unscoutable, every run is executed and submitted personally by the maintainer Nagi ([@Nagi-ovo](https://github.com/Nagi-ovo)); open an issue to request a model.
> - **To find what's missing**: read `cases.json` (all cases) and `models/*.json` (what each Agent has run) — a `<case-id>` absent from an Agent's json is an open slot; any row in the script-generated Registry table above whose "Runs" count is below the number of cases is an Agent missing a case; a brand-new Agent can fill them.
> - **Then follow the two-file flow below**, write a bilingual `note` (how the artifact was produced — one-shot or fixed), and run `bun scripts/validate-data.ts` until it passes before opening a PR.

Contributions are data-only — no code changes needed:

1. Artifact: preferably `outputs/<base-model>/<harness-effort>/<case-id>.<ext>` (e.g. `outputs/gpt-5-5-pro/chatgpt-web-extended-pro/pelican-cycling.svg`).
2. Registration: `models/<agent-id>.json` (new file for a new combination; add to `runs` for an existing one) with `artifactDir` pointing at the artifact folder — see the schema example in the Chinese README.

CI-enforced rules: dash-only lowercase `agent-id`s as stable identities; without `artifactDir`, artifacts default to `outputs/<agent-id>/`; with `artifactDir`, use one or two lowercase dash-case path segments, preferably `<base-model>/<harness-effort>`. A bilingual provenance `note` is required per run (which harness, what effort, one-shot or fixed); every declared run must have its artifact; multiple versions of the same combination x case go in an array with distinct `file` names (e.g. `pelican-cycling-2.svg`). Set `contributor` to your GitHub username — the site shows your avatar linked to your profile next to the run. Fill in `harness` and `effort` truthfully for new combinations: the case page renders Harness / Effort metadata chips from these fields and auto-matches brand icons for the model, vendor and harness (via [lobe-icons](https://github.com/lobehub/lobe-icons)) — contributors never touch icons.

PRs get data validation from CI; merges to `main` rebuild the site automatically (usually instant, at most 6 hours).

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

- **Model**: the weights and inference engine itself — GPT-5.5, Gemini 3.1 Pro, Claude Fable 5.
- **Harness**: the product/scaffolding wrapping the model — Codex CLI, Cursor, AntiGravity, the Claude web app. It controls tool calls, system prompts, context management and continuation strategy, and often shapes the outcome as much as the model does.
- The unit of evaluation here is therefore an **Agent**: the same model under a different harness is a different agent and a separate entry (GPT-5.5 Pro and GPT-5.5 running in Codex CLI at xhigh are two agents from the same model family). Effort is a parameter of that agent, defaulting to max.

## Registry

| Model | Vendor | Harness x Effort | Runs |
|---|---|---|---|
| Claude Fable 5 | Anthropic | Claude Web App · Max<br>Claude Code · Max<br>Cursor · High | 06 |
| Claude Opus 4.8 | Anthropic | Claude Code · Max | 02 |
| GPT-5.5 Pro | OpenAI | ChatGPT Web · Extended Pro | 02 |
| GPT-5.5 | OpenAI | Codex CLI · xhigh | 02 |
| Gemini 3.1 Pro | Google | AntiGravity · High<br>Google AI Studio · High | 03 |
| Gemini 3.5 Flash | Google | AntiGravity · High<br>Google AI Studio · High | 03 |
| Grok Build | xAI | Grok Build TUI · Max | 02 |
| Composer 2.5 | Cursor | Cursor · Max<br>Cursor · Default<br>Grok Build TUI · Default | 05 |
| Mistral Medium 3.5 | Mistral AI | Vibe · Thinking | 02 |
| DeepSeek-V4-Pro | DeepSeek | Claude Code · Max | 02 |
| Doubao Seed 2.0 Pro | ByteDance | Doubao Web · Pro Mode | 01 |
| Doubao Seed 2.0 Mini | ByteDance | Doubao Web · Fast Mode | 01 |
| MiMo v2.5 Pro | Xiaomi | Claude Code · Max | 02 |
| Kimi K2.6 | Moonshot AI | Kimi Code · Thinking | 02 |
| MiniMax M3 | MiniMax | MiniMax Code Web · Thinking | 01 |
| Qwen3.7-Max | Alibaba | Qoder · Default | 02 |

Pending: GLM-5.1 (PRs welcome)

> This table is a hand-maintained snapshot; the site's registry section is generated live from `models/*.json` and is authoritative.

## Arena blind battles & community board

- Each case defaults to **Arena mode**: two anonymous artifacts battle (A / B / Neither) and identities reveal only after you vote; switch to **Demo Show** to browse everything (tabs are grouped by model — a model with several harnesses can be viewed singly or side by side).
- Casting 03 votes total unlocks the **community leaderboard**, ranked by Bradley-Terry scores (the LMSYS Chatbot Arena approach); "neither" counts separately as both-bad.
- Votes stay in the browser by default; deploying `worker/` (Cloudflare Worker + D1 + Turnstile, free tier) upgrades the board to sitewide crowdsourced data — see [worker/README.md](./worker/README.md).

## Structure

```
outputs/<model-id>/<case-id>.<ext>   raw model artifacts (HTML / SVG), filename = case id
models/<model-id>.json               combination registry: label / vendor / harness / effort / order / run notes
cases.json                           case definitions (bilingual prompts, maintainer-owned)
scripts/validate-data.ts             data validation (CI runs it on every PR)
```

> The site and vote-backend source lives in the private `nagi-bench-site` repo, deployed on Cloudflare Pages; this repo is the site's data source.

## Validation

```bash
bun scripts/validate-data.ts   # the same data validation CI runs
```

## Contributing a run

> **If you are an AI agent (Claude Code / Codex / Cursor, etc.), this part is for you:**
>
> - **The unit you contribute is one Agent = a model × the harness you run in.** The `<agent-id>` (lowercase letters / digits / dashes) encodes that pairing — e.g. `gpt-5-5-pro`, `claude-fable-5-cc` (cc = Claude Code). The same model in a different harness is a different Agent with a different id.
> - **There are two cases right now**, defined in [`cases.json`](./cases.json): `mythos-craft` (HTML, a playable voxel world) and `pelican-cycling` (SVG, a pelican cycling by the sea). The prompt lives in `cases.json` — **use it verbatim, do not paraphrase**.
> - **To find what's missing**: read `cases.json` (all cases) and `models/*.json` (what each Agent has run) — a `<case-id>` absent from an Agent's json is an open slot; any row in the Registry table above whose "Runs" count is below the number of cases is an Agent missing a case; a brand-new Agent can fill both.
> - **Then follow the two-file flow below**, write a bilingual `note` (how the artifact was produced — one-shot or fixed), and run `bun scripts/validate-data.ts` until it passes before opening a PR.

Contributions are data-only — no code changes needed:

1. Artifact: `outputs/<model-id>/<case-id>.<ext>` (e.g. `outputs/gpt-5-5-pro/pelican-cycling.svg`).
2. Registration: `models/<model-id>.json` (new file for a new combination; add to `runs` for an existing one) — see the schema example in the Chinese README.

CI-enforced rules: dash-only lowercase ids matching the `outputs/` folder name; a **required bilingual provenance `note`** per run (which harness, what effort, one-shot or fixed); every declared run must have its artifact; multiple versions of the same combination x case go in an array with distinct `file` names (e.g. `pelican-cycling-2.svg`). Set `contributor` to your GitHub username — the site shows your avatar linked to your profile next to the run. Fill in `harness` and `effort` truthfully for new combinations: the case page renders Harness / Effort metadata chips from these fields and auto-matches brand icons for the model, vendor and harness (via [lobe-icons](https://github.com/lobehub/lobe-icons)) — contributors never touch icons.

PRs get data validation from CI; merges to `main` rebuild the site automatically (usually instant, at most 6 hours).

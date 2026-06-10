# NAGI BENCH

[中文](./README.md) | English

One-shot LLM eval cases by NAGI STUDIO: same prompt, different model x harness x effort combinations, one attempt and no retries — a side-by-side record of the runnable artifacts they ship.

**Live site:** https://bench.nagi.fun/

## Models vs harnesses

- **Model**: the weights and inference engine itself — GPT-5.5, Gemini 3.1 Pro, Claude Fable 5.
- **Harness**: the product/scaffolding wrapping the model — Codex CLI, Cursor, AntiGravity, the Claude web app. It controls tool calls, system prompts, context management and continuation strategy, and often shapes the outcome as much as the model does.
- The unit of evaluation here is therefore the **combination**: the same model under a different harness or effort level is a separate entry (GPT-5.5 Pro and GPT-5.5 Codex are two records of the same model family). Effort defaults to max; new effort variants of an existing combination can be added later.

## Registry

| Model | Vendor | Harness | Effort | Runs |
|---|---|---|---|---|
| Claude Fable 5 | Anthropic | Claude Web App | Max | 02 |
| GPT-5.5 Pro | OpenAI | ChatGPT Web | Extended Pro | 01 |
| GPT-5.5 Codex | OpenAI | Codex CLI (no skills) | xhigh | 02 |
| Gemini 3.1 Pro | Google | AntiGravity | High | 03 |
| Gemini 3.5 Flash | Google | AntiGravity | High | 03 |
| Grok Build | xAI | Grok Build TUI (local) | Max | 01 |
| Composer 2.5 | Cursor | Cursor | Max | 01 |
| DeepSeek-V4-Pro | DeepSeek | Claude Code | Max | 02 |
| Doubao Seed 2.0 Pro | ByteDance | Doubao Web | Pro Mode | 01 |
| Doubao Seed 2.0 Mini | ByteDance | Doubao Web | Fast Mode | 01 |
| MiMo v2.5 Pro | Xiaomi | Claude Code | Max | 02 |

Pending: Mistral Medium 3.5 · Kimi K2.6 · MiniMax M3 · GLM-5.1 · Qwen3.7-Max (PRs welcome)

> This table is a hand-maintained snapshot; the site's registry section is generated live from `models/*.json` and is authoritative.

## Structure

```
outputs/<model-id>/<case-id>.<ext>   raw model artifacts (HTML / SVG), filename = case id
models/<model-id>.json               combination registry: label / vendor / harness / effort / order / run notes
site/                                showcase app (Vite + React + Tailwind v4 + GSAP, bun)
site/src/data/cases.json             case definitions (bilingual prompts, maintainer-owned)
.github/workflows/                   deploy.yml deploys; ci.yml validates data + builds on PRs
```

## Development

```bash
cd site
bun install
bun run dev      # syncs outputs/ and serves http://localhost:5173/
bun run build    # data validation + type-check + build (site/dist)
```

## Contributing a run

Contributions are data-only — no code changes needed:

1. Artifact: `outputs/<model-id>/<case-id>.<ext>` (e.g. `outputs/gpt-5-5-pro/pelican-cycling.svg`).
2. Registration: `models/<model-id>.json` (new file for a new combination; add to `runs` for an existing one) — see the schema example in the Chinese README.

CI-enforced rules: dash-only lowercase ids matching the `outputs/` folder name; a **required bilingual provenance `note`** per run (which harness, what effort, one-shot or fixed); every declared run must have its artifact; multiple versions of the same combination x case go in an array with distinct `file` names (e.g. `pelican-cycling-2.svg`). Set `contributor` to your GitHub username — the site shows your avatar linked to your profile next to the run.

PRs get data validation + a build from CI; merges to `main` deploy automatically.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

One-shot LLM eval showcase (NAGI BENCH): `outputs/` holds raw model-generated artifacts (single-file HTML games, SVGs) served verbatim; `site/` is the bilingual (zh/EN) showcase app. Pushing to `main` deploys via GitHub Actions to GitHub Pages at https://bench.nagi.fun/ (Vite `base: '/'`; old `nagi-studio.github.io/nagi-bench/*` URLs 301 there).

## Commands

Always bun, never npm. Everything runs from `site/`:

```bash
bun install
bun run dev          # syncs outputs/ into public/ and serves localhost:5173
bun run build        # sync-outputs + tsc --noEmit + vite build → dist/
bun scripts/snap.ts [url] [out.png] [light|dark]      # real-Chrome smoke check: hero animation + console errors
bun scripts/fullpage.ts [url] [out.png] [light|dark]  # scroll-through full-page screenshot (triggers reveals)
bun scripts/og.ts    # re-render public/og.png from scripts/og.html (update after lineup changes)
```

There are no tests; verification is the snap/fullpage scripts against `vite preview` (they need local Chrome at the default macOS path). Note: headless Chrome `--virtual-time-budget` screenshots show GSAP intros frozen — that's an artifact, use snap.ts.

## Architecture

**Data is contribution-friendly config, not code.** Sources of truth:
- `models/<model-id>.json` (repo root) — one file per **model x harness x effort combination**: `label`, `vendor`, `harness`, `effort`, `order` (display sort), and `runs.<case-id>` (one run or an array of variants, each `{note, file?}`; extra variants need distinct `file` names). The filename IS the entry id (dash-only, doubles as the `outputs/` folder name). The same model under a different harness is a separate entry (GPT-5.5 Pro vs GPT-5.5 Codex). Having runs = "ran" status; per-case tab dots key off run presence.
- `site/src/data/cases.json` — case definitions (bilingual title/tagline/prompt), maintainer-owned. The hero typewriter feeds off prompts automatically.
- `site/src/data/cases.ts` only derives `MODELS`/`RUNS` from those files via `import.meta.glob` — contributors never touch it.

`site/scripts/validate-data.ts` runs inside `bun run build` (and PR CI): dash-only ids, required bilingual provenance `note` per run, declared artifacts must exist, no orphan `outputs/` dirs. Adding a run = drop `outputs/<model-id>/<case-id>.<ext>` + edit `models/<model-id>.json` + push.

**Artifact fix policy.** Model outputs may receive surgical, line-level fixes (originals stay in git history). Every fix must be documented in the run `note` as: where the bug is / pre-fix behavior / root cause / "this page shows the fixed build (N lines)". Notes also carry provenance (which tool/effort produced the run). Recurring trap in these artifacts: canvas-atlas `flipY` mismatches and camera `-Z` convention sign errors.

**i18n** (`src/i18n.tsx`): a `STRINGS` dict plus `Bilingual` fields picked via `useLang()`. Anything user-visible needs both languages; the provider also syncs `document.title` and `<html lang>`. **Theme** (`src/theme.tsx` + `index.css`): colors are CSS vars under `@theme` with a `[data-theme="light"]` override block — use `accent` (theme-aware) for text/borders/dots, `acid`/`night` (constant) for the marquee/badge surfaces.

**GSAP** (`src/lib/gsap.ts` registers ScrollTrigger/TextPlugin/SplitText + useGSAP): always `useGSAP` with a `scope` ref; gate loops and pointer effects behind `prefersReducedMotion()` / `hasFinePointer()`; perpetual animations live in isolated `memo` components (Typewriter terminal, marquee, cursor glow). Language switches re-run lang-dependent hooks via `dependencies: [lang]` + `revertOnUpdate`, and `App.tsx` calls `ScrollTrigger.refresh()` on lang change.

**Viewers** (`CaseSection.tsx`): HTML artifacts load in an iframe only after an explicit Run click (capped at `100dvh - 10rem` because the games consume wheel events for hotbar switching — a taller frame traps page scroll), with fullscreen via `requestFullscreen`. Deep links: `#<case-id>` or `#<case-id>:<model-id>` (tab clicks `replaceState` the hash).

## Conventions

- No emojis anywhere in UI text or code (hard design rule); lucide-react or inline SVG for icons.
- Brand icons (model/vendor/harness) are `@lobehub/icons-static-svg` raw imports mapped in `site/src/lib/brands.tsx` via regex on the strings in `models/*.json`. Never add the `@lobehub/icons` React package — its peer deps pull in antd/@lobehub/ui. New vendor/harness = one import + one rule in brands.tsx.
- `.agents/`, `.claude/`, `skills-lock.json` are local tooling — gitignored and purged from history; never commit them.
- Commit messages are plain English; the site copy defaults to zh with en translations. README.md is Chinese-first with README.en.md mirroring it — keep both registry tables in sync with models/*.json when combinations change.

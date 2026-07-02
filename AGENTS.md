# AGENTS.md

Guidance for humans and coding agents contributing to **NAGI BENCH** data
(https://bench.nagi.fun/). Read this before opening a PR. 中文说明见每节。

## What this repo is / 这个仓库是什么

The **public data repo**: community-contributed *one-shot* LLM eval artifacts.
You add a model's raw output for a case; the site renders it verbatim. This repo
holds **data only** — no site code, no build of the page you see.

公开**数据仓库**：社区贡献的「一次生成」LLM 测评产物。你提交某模型在某个 case 上的
原始输出，站点会原样渲染。这里只有**数据**，没有站点代码。

## A contribution is exactly two files / 一次贡献就两个文件

1. **The artifact** — the raw model output, dropped at
   `outputs/<artifactDir>/<case-id>.<ext>` (e.g. a single-file `.html` or `.svg`).
2. **The registration** — `models/<model-id>.json` declaring it.

Do **not** touch anything else. In particular:

- **Do not edit `README.md` / `README.en.md`.** The Registry tables are
  generated from `models/*.json` and synced automatically after merge. Hand
  edits are overwritten. （**不要改 README**，注册表是自动生成并在合并后自动同步的。）
- **Do not edit `cases.json`.** Cases are maintainer-owned.（case 由维护者管理。）

## `models/<model-id>.json` schema

```jsonc
{
  "label": "DeepSeek V4 Flash",   // human-facing model name (required)
  "vendor": "DeepSeek",            // who makes the model (required)
  "harness": "Reasonix",           // the tool/agent/UI you ran it in (required)
  "effort": "Max",                 // thinking budget / effort level (required)
  "artifactDir": "deepseek-v4-flash/reasonix-max", // optional; defaults to <model-id>
  "order": 50,                      // optional display sort
  "runs": {
    "skeleton-watch": {
      "note": {                     // REQUIRED, bilingual, zh first, no emojis
        "zh": "在 Reasonix 中以 DeepSeek V4 Flash（Max）一次生成，未修改。",
        "en": "One-shot by DeepSeek V4 Flash (Max effort) in Reasonix, unmodified."
      },
      "contributor": "your-github-username"
    }
  }
}
```

### Naming rules / 命名规则

- **The filename IS the entry id** — lowercase letters, digits and dashes only
  (`deepseek-v4-flash-reasonix`). It is the **stable voting key** and the default
  `outputs/` folder, so name it after the **model**, not the harness. Bad:
  `reasonix-reasonix-max`. Good: `deepseek-v4-flash-reasonix`.
  （文件名即条目 id，是稳定投票主键——按**模型**命名，别按 harness 命名。）
- `artifactDir` may be one or two dash-case segments
  (`deepseek-v4-flash/reasonix-max`); set it when several entries share a model
  folder. Leave it out to default to the id.

### One entry per (model × harness × effort) / 一个组合一个条目

The same model under a different **harness** or **effort** is a **separate**
`models/*.json` file, not an extra variant inside an existing one. "Codex",
"Cursor", "Claude Code", "AntiGravity" name the **harness**, never the model.
（同一模型换 harness 或 effort = **新建** JSON，不要塞进现有条目。）

### The `note` is required and bilingual / note 必须双语

Every run needs `note.zh` + `note.en` documenting provenance: which harness,
which effort, one-shot or fixed. If you applied any fix, say where the bug was
and what you changed. **No emojis anywhere** (hard rule). zh first.

### Run the harness as it ships / 用 harness 开箱即用的默认形态

Use the harness in its **default, out-of-the-box** configuration: no extra
skills, plugins, MCP servers or custom system prompts beyond what it bundles.
These shift the output as much as swapping the harness does, so such a run is
not comparable to others under the same harness and **will not be accepted**.
Disclosing it in `note` does not fix this: the leaderboard identity is only
model × harness × effort, so a note gives the modified setup no separate
identity — it would still be mixed into an Agent row it is not comparable with.
（用 harness 的**默认形态**：不要额外加载 harness 自带以外的 skill / 插件 /
MCP / 自定义系统提示——它们对产出的影响不亚于换 harness，这类 run 与同一
harness 下其它条目不可比，**不予收录**。在 `note` 里写明也没用：榜单身份只看
模型 × harness × effort，note 不另立身份，它仍会混进本不该可比的那一行。）

## Review guidelines

NAGI BENCH stores raw benchmark artifacts. Reviewers, including Codex Review,
must **not** request fixes for gameplay, rendering, animation, JavaScript
correctness, UX, visual quality, performance, accessibility, or any other
internal behavior of files under `outputs/`. Broken or low-quality artifacts are
valid benchmark data when their provenance is documented.

Only flag:

- visible model, vendor, harness, contributor, or other identity leaks inside
  `outputs/` that would break blind Arena review;
- contribution format or schema issues that violate this file or would fail
  `bun scripts/validate-data.ts`.

Do not ask contributors to improve or repair the submitted artifacts themselves.
If an artifact bug matters, mention it only as optional context for maintainers,
not as required PR feedback.

## Before you open the PR / 提交前

```bash
bun scripts/validate-data.ts   # the exact schema check CI runs
```

This enforces: dash-only ids, required bilingual `note`, declared artifacts
exist and are non-empty, no orphan files under `outputs/`. Green here = green CI.

You do **not** need to run `update-registry.ts` — README is synced for you after
merge.（不需要手动跑 update-registry，README 合并后自动同步。）

### Attach a screenshot / 附一张截图

The PR template asks for a **screenshot of the generation** — your harness/IDE
showing the model name + effort while producing this artifact. It is the proof
that the declared `harness` / `model` / `effort` are real. Paste it into the PR
body (GitHub hosts it); **do not commit image files** into the repo.
（PR 里贴一张**生成过程截图**作为「确实用了这套 harness + 模型 + effort」的凭证，
直接贴进 PR 正文，不要把图片提交进仓库。）

## Conventions / 约定

- No emojis in any data, note, or UI-bound text.
- `outputs/` files are served verbatim in a sandboxed iframe. Keep them
  self-contained; external resources should be well-known CDNs only.

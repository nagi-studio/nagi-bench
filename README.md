# NAGI BENCH

NAGI STUDIO 的 LLM 测评案例集：同一段提示词，不同模型，一次生成、不许返工，并排对比它们交出的可运行作品。

One-shot LLM eval cases by NAGI STUDIO: same prompt, different models, one attempt and no retries — a side-by-side record of the runnable artifacts they ship.

**Live site:** https://bench.nagi.fun/

## 结构 / Structure

```
outputs/<model-id>/<case-id>.<ext>   模型产出原文件（HTML / SVG），文件名 = 案例 id
models/<model-id>.json               模型登记：label / vendor / order / 各案例运行备注
site/                                展示站点（Vite + React + Tailwind v4 + GSAP，bun 驱动）
site/src/data/cases.json             案例定义：双语标题与提示词（维护者维护）
.github/workflows/                   deploy.yml 自动部署；ci.yml 对 PR 跑数据校验 + 构建
```

## URL 规则 / URL scheme

| URL | 含义 / Meaning |
| --- | --- |
| `https://bench.nagi.fun/` | 站点首页 / Home |
| `https://bench.nagi.fun/#<case-id>` | 定位到某个案例 / Anchor to a case (e.g. `#mythos-craft`) |
| `https://bench.nagi.fun/#<case-id>:<model-id>` | 定位案例并选中模型 / Case + preselected model tab |
| `https://bench.nagi.fun/outputs/<model-id>/<case-id>.<ext>` | 产物直链 / Raw artifact |

切换模型标签时地址栏自动更新（`replaceState`），当前视图随时可直接分享。旧域名链接（`https://nagi-studio.github.io/nagi-bench/*`）由 GitHub Pages 自动 301 重定向到 `https://bench.nagi.fun/*`，路径保留。

Switching a model tab updates the address bar in place, so the current view is always shareable. Legacy `nagi-studio.github.io/nagi-bench/*` links are 301-redirected by GitHub Pages to `bench.nagi.fun/*` with the path preserved.

## 本地开发 / Development

```bash
cd site
bun install
bun run dev      # 同步 outputs/ 并启动 http://localhost:5173/
bun run build    # 类型检查 + 产物构建（输出到 site/dist）
```

## 贡献一个模型产出 / Contributing a run

贡献**不需要改任何代码**，只涉及两类文件：

1. 产出文件：`outputs/<model-id>/<case-id>.<ext>`（如 `outputs/gpt-5-5-pro/pelican-cycling.svg`）。
2. 模型登记：`models/<model-id>.json`（新模型新建文件；已有模型在 `runs` 里加一条）：

```json
{
  "label": "GPT-5.5 Pro",
  "vendor": "OpenAI",
  "order": 20,
  "runs": {
    "pelican-cycling": {
      "note": {
        "zh": "在哪个工具/产品里、什么思考档位、是否一次生成、是否有修复",
        "en": "Which tool, what effort level, one-shot or fixed"
      }
    }
  }
}
```

规则（CI 自动校验，不满足会挂）：
- `model-id` 只用小写字母/数字/连字符（如 `doubao-seed-2-0-pro`），文件名与 `outputs/` 目录名一致；
- 每条 run 的 `note` **双语必填**——这是本仓库的可信度来源，必须写明产出怎么来的；
- 声明的 run 必须有对应的产出文件。

提 PR 后 CI 会跑数据校验 + 构建；合入 `main` 自动部署。

Contributions are data-only — no code changes needed. Drop the artifact into `outputs/<model-id>/<case-id>.<ext>` and register it in `models/<model-id>.json` (schema above). CI enforces: dash-only ids matching the folder name, a required bilingual provenance `note` per run, and that every declared run has its artifact. Merges to `main` deploy automatically.

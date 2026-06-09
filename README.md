# NAGI BENCH

NAGI STUDIO 的 LLM 测评案例集：同一段提示词，不同模型，一次生成、不许返工，并排对比它们交出的可运行作品。

One-shot LLM eval cases by NAGI STUDIO: same prompt, different models, one attempt and no retries — a side-by-side record of the runnable artifacts they ship.

**Live site:** https://nagi-studio.github.io/nagi-bench/

## 结构 / Structure

```
outputs/<model-id>/<artifact>   模型产出原文件（HTML / SVG），按模型分目录
site/                           展示站点（Vite + React + Tailwind v4 + GSAP，bun 驱动）
site/src/data/cases.ts          案例定义：双语提示词、模型列表、产出文件映射
.github/workflows/deploy.yml    GitHub Pages 自动部署
```

## 本地开发 / Development

```bash
cd site
bun install
bun run dev      # 同步 outputs/ 并启动 http://localhost:5173/nagi-bench/
bun run build    # 类型检查 + 产物构建（输出到 site/dist）
```

## 添加案例或模型 / Adding a case or model

1. 把产出文件放进 `outputs/<model-id>/`。
2. 在 `site/src/data/cases.ts` 里登记：
   - 新模型：加入 `MODELS`（`status: 'ran' | 'pending'`）。
   - 新案例：加入 `CASES`（中英双语 `title` / `tagline` / `prompt`）。
   - 产出映射：在 `OUTPUTS` 里把案例 id 对应到模型 id 与文件路径。
3. 推送到 `main`，GitHub Actions 自动构建并部署。

Drop the artifact into `outputs/<model-id>/`, register it in `site/src/data/cases.ts` (model in `MODELS`, case in `CASES` with bilingual prompts, file path in `OUTPUTS`), then push to `main` — GitHub Actions deploys automatically.

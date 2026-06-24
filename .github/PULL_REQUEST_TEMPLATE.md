<!-- 感谢贡献！只需两类文件：outputs/<artifactDir>/<case-id>.<ext> + models/<model-id>.json -->
<!-- Thanks for contributing! Only two kinds of files: the artifact + the JSON registration. 详见 AGENTS.md -->

## 产出说明 / Run info

- 模型 / Model:
- 厂商 / Vendor:
- 运行环境 / Harness（如 ChatGPT Web、Claude Code、Codex CLI、AntiGravity…，这是工具不是模型）:
- 思考配额 / Thinking effort（如 Max、High、xhigh、Extended Pro、Thinking…）:
- 是否一次生成 / One-shot?（是/否；若有修复请在 note 里说明 / if fixed, document it in the note）

## 生成凭证截图 / Proof screenshot **(required)**

<!-- 直接把图片拖进下面，GitHub 会托管它。不要把图片文件提交进仓库。 -->
<!-- Drag the image in below; GitHub hosts it. Do NOT commit image files into the repo. -->

请贴一张**生成过程截图**：你的 harness / IDE 中能看到**模型名 + 思考配额**正在产出本产物，
作为「确实用了这套 harness + 模型 + effort」的凭证。
Please attach a screenshot of the generation showing the **model name + effort** in your harness/IDE.

## 自查 / Checklist

- [ ] 只改了两类文件：`outputs/<artifactDir>/<case-id>.<ext>` + `models/<model-id>.json` / only the artifact + its JSON
- [ ] **没有**手改 `README.md` / `README.en.md`（注册表合并后由 CI 自动同步）/ did **not** hand-edit the README registry (auto-synced after merge)
- [ ] 模型 id 用短横线、以**模型**命名（非 harness），如 `deepseek-v4-flash-reasonix` / dash-case id named after the model, not the harness
- [ ] `harness` 与 `effort` 如实填写（站点据此生成 metadata 与品牌 icon）/ `harness` and `effort` are accurate
- [ ] 用 harness **默认形态**生成，未额外加载自带以外的 skill / 插件 / MCP / 自定义系统提示 / ran the harness as it ships — no extra skills / plugins / MCP / custom prompts
- [ ] 每条 run 的 `note` 双语（zh + en，zh 先，无 emoji）填了来历 / bilingual `note`, zh first, no emojis
- [ ] 同一模型换 Harness 或思考配额是**新建一个 JSON 条目** / a different harness or effort = a NEW json entry
- [ ] `contributor` 是我的 GitHub 用户名 / `contributor` is my GitHub username
- [ ] 已贴生成凭证截图 / attached the proof screenshot above
- [ ] 本地 `bun scripts/validate-data.ts` 通过 / `bun scripts/validate-data.ts` passes locally

<!-- 规则详见 AGENTS.md。CI 只跑数据校验；README Registry 在合并到 main 后由 CI 自动重生成。 -->

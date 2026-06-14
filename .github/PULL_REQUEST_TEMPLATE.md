<!-- 感谢贡献！只需两类文件：outputs/<model-id>/<case-id>.<ext> + models/<model-id>.json -->
<!-- Thanks for contributing! Only two kinds of files: the artifact + the JSON registration. -->

## 产出说明 / Run info

- 模型 / Model:
- 运行环境 / Harness（如 ChatGPT Web、Claude Code、Google AI Studio、本地 CLI…）:
- 思考配额 / Thinking effort（如 Max、High、Extended Pro、Thinking…）:
- 是否一次生成 / One-shot? （是/否；若有修复请在 note 里说明 / if fixed, document it in the note）

## 自查 / Checklist

- [ ] `models/<model-id>.json` 中 `harness` 与 `effort` 已如实填写（站点据此生成 metadata 与品牌 icon）
- [ ] 每条 run 的 `note` 双语（zh + en）填写了上面的来历信息 / bilingual `note` documents the provenance above
- [ ] `contributor` 是我的 GitHub 用户名 / `contributor` is my GitHub username
- [ ] 同一模型在不同 Harness 或思考配额下是**新建一个 JSON 条目**，不是塞进现有条目 / a different harness or effort = a NEW json entry, not a variant
- [ ] 已运行 `bun scripts/update-registry.ts` 更新 README Registry 表 / ran `bun scripts/update-registry.ts` to refresh the README Registry tables

<!-- CI 会跑数据校验 + 构建；规则详见 README「贡献一个模型产出」。 -->

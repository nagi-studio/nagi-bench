# 《尘世之重》

一部 228 秒的程序化 Three.js 体素电影。项目不使用外部模型、贴图、字体、音频或 CDN；画面由代码建模，非语言声音由浏览器 Web Audio API 实时合成。

```bash
bun install --offline
bun run dev
bun run build
```

构建结果为可直接打开的单文件 `dist/index.html`。播放器支持播放、暂停、拖动时间轴、音量与全屏；首次点击画面会解锁浏览器音频。

完整待配音清单位于 `src/voiceCues.js`，每条 cue 仅包含 `id`、`kind`、`speaker`、`text`、`delivery`、`start`、`end` 七个字段。字幕由该清单直接驱动。

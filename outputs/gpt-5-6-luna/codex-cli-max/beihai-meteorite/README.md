# 潮汐之后 · Tidal After

一个 180 秒的程序化 Three.js 体素短片。所有人物、场景、灯光、镜头、字幕和基础音效都在代码中生成；没有外部贴图、模型、音频或 CDN 运行时资源。

## 运行

```bash
bun run build
bun run start
```

构建结果位于 `dist/main.js`；`bun run start` 会启动一个仅使用 Bun 内置 API 的本地静态服务器。打开 `http://localhost:3000` 即可播放。首个点击会解锁浏览器的 Web Audio API。

## 导演结构

影片总时长固定为 180 秒，分为十个镜头段落：地面信标 → 地下加工 → 远端求救 → 留门 → 井笼下降 → 真空作业 → 取回芯片 → 点灯抉择 → 地面收到回信 → 潮汐后的余韵。

## 配音接口

`src/main.js` 中的 `voiceCues` 是唯一的语言内容清单。每条 cue 固定包含 `id`、`kind`、`speaker`、`text`、`delivery`、`start`、`end` 七个字段；当前字幕直接由该清单驱动，后期可以按 `id` 接入真正配音。

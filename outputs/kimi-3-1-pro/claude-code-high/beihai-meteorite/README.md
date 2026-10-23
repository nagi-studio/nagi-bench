# 陨石雨 · Meteor Rain

一部 336 秒（5 分 36 秒）的程序化 3D 体素电影。所有人物、场景、道具、行星、贴图、动画与声音均由代码生成；不包含外部美术资产、音频文件、录音或第三方音效库。

## 运行

```bash
bun run dev
```

构建标准 Vite 产物：

```bash
bun run build
bun run preview
```

`dist/index.html` 保留对 `dist/assets/` 本地资源的相对引用，也可直接作为静态页面打开。浏览器的 Web Audio 会在用户点击播放后解锁。

## 操作

- 播放 / 暂停：播放按钮或空格键
- 跳转：底部时间轴
- 逐段快退 / 快进：左右方向键（5 秒）
- 音量与全屏：底部控制器

## 结构

- `src/cues.js`：唯一完整 `voiceCues` 清单，以及全部 `soundCues` 和 30 次击发时间。每条语音 cue 固定包含 `id`、`kind`、`speaker`、`text`、`delivery`、`start`、`end`。
- `src/film.js`：21 个绝对时间镜头、摄影机、表演、场面调度、剪辑和屏幕视觉节奏。
- `src/worlds.js`：老宅、车间、地下室、轨道四套程序化场景。
- `src/figures.js`：Voxel Kit 人物装配、64×64 身体/服装贴图和体素道具。
- `src/audio.js`：36 种 Web Audio 运行时合成器。地下室枪声包含早期反射与程序生成的混响脉冲；太空枪声仅为服内低频闷震。
- `src/main.js`：CinematicPlayer、ThreeStage、字幕/控制器和音频总线。

## 检查

```bash
bun run test
```

检查完整镜头覆盖、七字段语音清单、声音工厂注册、30 次击发、关键剧情状态与正反向跳转。总时长硬上限为 336 秒，片头、片尾均包含在内。

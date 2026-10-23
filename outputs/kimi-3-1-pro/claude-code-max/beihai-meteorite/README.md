# 陨石雨 · The Meteorite Rain

一部完全由代码生成的 Three.js 体素电影。总时长 **342 秒（05:42）**，包含片头、正片和片尾，使用一个主 `CinematicPlayer` 驱动 20 个绝对时间分镜。

## 运行

```bash
bun run dev
bun run build
bun run preview
```

`dist/` 是标准 Vite 构建产物，`dist/index.html` 使用本地 `./assets/` 引用。运行时不请求外部资源，不需要联网。

## 制作约束

- 所有人物通过 `@agentbench/voxel-kit` 的 `createFigure` 装配；面部、服装、航天服面罩和裂纹均为 64×64 贴图像素。
- 地球、陨石、机械、空间站和道具使用体素几何；没有游戏资产、图片素材或 CDN。
- `src/cues.ts` 中的 `voiceCues` 是唯一语音清单，每条保留 `id`、`kind`、`speaker`、`text`、`delivery`、`start`、`end` 七项。播放器统一以 `【说话者】文本` 在底部居中显示字幕，没有合成或录制人声。
- 同文件中的 `soundCues` 由 `WebAudioCueBus` 调度；`src/audio.ts` 只使用浏览器原生 Web Audio 节点和运行时生成的噪声/混响脉冲。地下室枪声有反射混响，太空枪击只表现为航天服内的闷震，没有外部枪声传播。
- 播放、暂停、音量、全屏和 seek 使用统一播放器。镜头和表演由绝对时间计算，跳转到任意时刻会重建当前状态。

## 文件

- `src/main.ts`：剪辑、镜头、表演、界面与播放器装配
- `src/world.ts`：六个程序化环境、人物调度和太空道具
- `src/art.ts`：体素材料、角色贴图、模型与纹理生成
- `src/audio.ts`：程序化声场、机械、枪声、无线电与合成配乐
- `src/cues.ts`：完整语音与声音时间码清单

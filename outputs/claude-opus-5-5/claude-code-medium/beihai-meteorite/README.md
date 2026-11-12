# 陨石 · 程序化体素短片（Three.js）

改编自《三体Ⅱ·黑暗森林》中章北海制作陨石子弹并在同步轨道行刺的段落。全片时长 358 秒，所有画面、贴图和声音都在运行时由代码生成。

## 运行

```
bun run build      # 产出 dist/index.html + dist/assets/
bun run dev        # 本地开发
```

用平台预览或任意静态服务器打开 `dist/index.html`，点击底部 ▶ 播放。

## 结构

| 文件 | 内容 |
| --- | --- |
| `src/cues.ts` | **`voiceCues`：完整语音清单**（id/kind/speaker/text/delivery/start/end，供后期按 id 配音）以及全部音效 cue |
| `src/audio.ts` | 57 个 Web Audio 合成器（呼吸、无线电、车床、地下室枪声与混响、真空中的传导闷震、配乐等） |
| `src/shots.ts` | 78 个镜头（绝对时间轴），机位、景别和调色 |
| `src/blocking.ts` | 各场景的演员调度、道具状态和粒子，全部是绝对时间的纯函数，可任意跳转 |
| `src/world.ts`, `characters.ts`, `props.ts`, `interiors.ts`, `space.ts` | Voxel Kit 人物、服装贴图、道具、各场景以及地球/黄河站 |
| `src/post.ts` | 泛光、2.39:1 遮幅、瞄准镜/显微镜光学遮罩、颗粒、淡入淡出 |

## 无头检查工具（不参与构建）

```
bun tools/check.ts sweep              # 以 0.2 秒步长 seek 整条时间轴，检查镜头覆盖和异常
bun tools/check.ts 24,205.1,329 out.png   # 软件光栅化预览帧（用于检查构图）
bun tools/audio-check.ts              # 每个声音工厂在模拟 AudioContext 下运行
bun tools/play-check.ts               # 实时播放 / 暂停 / 跳转 / 字幕
```

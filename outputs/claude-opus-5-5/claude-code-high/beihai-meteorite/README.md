# 陨石 · 体素短片

根据《三体Ⅱ·黑暗森林》中章北海“陨石子弹”一节改编的程序化 Three.js 体素电影，时长 358 秒（≤ 360 秒硬上限）。

## 运行

```bash
bun run build      # 产出 dist/index.html + dist/assets/
bun run dev        # 本地开发
```

`dist/index.html` 通过相对路径引用 `dist/assets/` 中的 JS/CSS，音效以 `?inline` 内联进 bundle，无任何外部请求。
点击底部 ▶ 开始（同时解锁 Web Audio）；空格键暂停/继续，←/→ 跳转 5 秒。

## 结构

| 文件 | 内容 |
| --- | --- |
| `src/voice.ts` | **全部语音 cue 的唯一清单**（`id/kind/speaker/text/delivery/start/end`），字幕直接由它驱动，可按 `id` 接入配音 |
| `src/sound.ts` | 选用的 CC0 采样注册、程序化/滤波声层、全部 `SoundCue` 时间线 |
| `src/shots.ts` | 61 个镜头：场景切换与摄影机，均为绝对时间的纯函数 |
| `src/sets/*.ts` | 五个场景（轨道、胡同、收藏者老宅、模型车间、地下室），状态由绝对时间推导，可任意跳转 |
| `src/characters.ts` | 用 Voxel Kit `createFigure` 装配的全部角色；五官/表情画在 64×64 身体贴图上，服装为独立贴图层 |
| `src/props.ts` | `voxelModel` / `buildVoxelGeometry` 构建的道具 |
| `src/overlay.ts` | 遮幅、淡入淡出、片名/地点字卡、瞄准镜遮罩 |

## 结构取舍

冷开场在同步轨道等待日落 → 闪回老宅买陨石（“就算表示我对要送的人的尊重吧”）→ 硬切回太空，太阳触及地平线 →
车间加工、地下室试射（逐步揭示：7.62 口径、航天服面料、碎得看不出加工痕迹）→ 回到太空完成狙击 → 尾声：收藏者在收音机里听到“陨石雨”。
太阳下沉程度是贯穿全片的时钟。真空中的枪声不传播：只有经手臂和航天服传导的闷震、呼吸、心跳与无线电。

## 自测工具（不参与构建）

`test/` 下为无浏览器环境使用的检查脚本：
`harness.ts`（全片 seek/step 扫描、镜头覆盖、主体入画检查）、`audio-smoke.ts`（严格的假 AudioContext 驱动全片音频）、
`render.ts` + `raster.ts`（软件光栅化预览静帧）。运行方式：`bun --preload ./test/shim.ts test/harness.ts`。

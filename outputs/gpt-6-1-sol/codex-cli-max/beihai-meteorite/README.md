# 尘外 / OUTSIDE THE DUST

一部 **5 分 18 秒**的 Three.js 程序化体素电影。34 个镜头，片头和片尾均已计入 318 秒总时间轴。

## 放映

```sh
bun run build
bun run preview
```

打开 `http://localhost:4178/`，点击「开始放映」。标准构建入口是 `dist/index.html`，其脚本和样式保留在 `dist/assets/`，可以由静态服务器或平台预览直接托管。开发使用 `bun run dev`。

项目使用平台离线工具链，无需安装依赖。Vite 使用原生配置加载器，以兼容只读的预装 `node_modules`。

播放栏提供暂停、时间轴跳转、音量与全屏。空格切换播放，左右方向键前后跳转 10 秒，F 进入全屏。结尾可以重新放映。声音只在用户的播放手势后解锁。

## 文件

| 文件 | 内容 |
| --- | --- |
| `src/timeline.js` | 318 秒主时间轴、34 个绝对时间镜头、摄影与表演 |
| `src/voice-cues.js` | 唯一的完整语音清单，导出 `voiceCues` |
| `src/sound.js` | 声音事件与原生 Web Audio 合成器 |
| `src/cast.js` | Voxel Kit 人物、分离的身体与服装贴图、道具挂点 |
| `src/world.js` | 代码生成的旧宅、车间、地下室、电梯、空间站与体素地球 |
| `src/main.js` | Cinematic Player、ThreeStage 与播放界面 |
| `DIRECTOR.md` | 改编结构、视觉动机与声音设计 |
| `inspection/verification.json` | 实际浏览器播放、暂停、跳转与连续播放检查记录 |

## 后期配音

`src/voice-cues.js` 中每条 cue 都只有 `id`、`kind`、`speaker`、`text`、`delivery`、`start`、`end` 七个字段，时间单位为秒。字幕直接由这份清单和播放器驱动，格式统一为 `【说话者】文本`。按 `id` 录制即可逐条接入；此版本没有生成、合成或加载任何人声。

所有环境声、机械声、撞击、枪声、无线电底噪、航天服呼吸、警报与配乐均在运行时用 Web Audio 节点及计算生成的噪声缓冲合成。没有音频文件、录音采样、音效库、外部模型、外部贴图或 CDN。

所有人物由 `createFigure` 装配，使用统一骨架与比例；身份、表情、服装标识和面罩损伤均画在贴图上。身体与服装保持独立。地球、陨石、地形与道具使用 Voxel Kit 的体素几何。

## 检查

已执行 `bun run build`。浏览器检查通过真实鼠标点击解锁音频并播放，验证时间连续推进、暂停保持不动、原生进度条跳转后继续播放、完整时间轴到达结束，以及往返跳转后场景状态一致。检查脚本位于 `inspection/`，仅使用 Bun 原生 WebSocket 连接浏览器 DevTools，不增加项目依赖。

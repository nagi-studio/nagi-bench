# DUST II // Procedural FPS

一个完全由代码生成的 Dust2 风格 5v5 第一人称射击原型。使用 React 18、TypeScript、three.js 和 Vite；无需下载模型、贴图或音频文件。

## 启动

```bash
npm install
npm run dev
```

打开终端显示的本地地址，选择 T / CT 阵营与手枪局 / 完整武装，然后点击“部署至战场”。建议使用桌面版 Chrome、Edge 或 Firefox，并允许页面锁定鼠标。

## 操作

| 按键 | 功能 |
| --- | --- |
| WASD / 鼠标 | 移动 / 瞄准 |
| 左键 / 右键 | 开火 / AWP 开镜 |
| 空格 / Shift | 跳跃 / 慢走 |
| R | 换弹 |
| 1 / 2 / 3 | 主武器 / 副武器 / 刀 |
| E | 拾取 C4；在包点按住下包；靠近已安放 C4 按住拆除 |
| B | 打开武器库（完整武装模式） |
| 阵亡后空格 / F | 切换观战队友 / 接管该队友 |
| Esc | 释放鼠标；点击画面重新锁定 |

手枪局中所有角色只有阵营默认手枪和刀，护甲为 0。完整武装模式下可从武器库选择 AK-47、M4A4、AWP、Glock-18、USP-S 和 Desert Eagle。十名角色由一名玩家与九名 AI 组成；AI 自主寻路、交火、下包和拆包。

## 代码结构

- `src/map.ts`：地图几何、碰撞体、导航网格与 A* 路径。
- `src/actors.ts`：类人角色和武器模型的程序化几何体。
- `src/weapons.ts`：可扩展武器数据。
- `src/engine.ts`：主循环、输入、物理、AI、命中分区、C4 与回合状态。
- `src/audio.ts`：Web Audio 合成音效。
- `src/main.tsx`、`src/style.css`：菜单、HUD、小地图与瞄准镜覆盖层。

生产构建：`npm run build`。

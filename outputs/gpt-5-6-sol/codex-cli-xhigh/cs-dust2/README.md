# DUST // II — 5v5 浏览器 FPS 原型

一个完全由代码生成内容的 React 18 + TypeScript + three.js 第一人称射击原型。地图、角色、武器和声音均不依赖外部资产。

## 运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址，选择阵营与回合协议后点击 `DEPLOY`。建议使用桌面版 Chromium 浏览器与耳机。

## 操作

- `WASD`：移动
- 鼠标：观察；左键射击；持 AWP 时右键开镜
- `Space`：跳跃
- `R`：换弹
- `E`：下包、拆包；阵亡后接管存活队友
- `Q`：阵亡后切换队友视角
- `1 / 2 / 3`：主武器、副武器、刀
- Full Buy 中 `4 / 5 / 6 / 7`：快速装备 AK-47、M4A4、AWP、Desert Eagle
- `Esc`：释放鼠标；点击暂停面板继续

## 实现结构

- `src/game/Game.ts`：游戏循环、输入、物理、AI、命中与 C4 回合状态机
- `src/game/map.ts`：程序化 Dust2 地图、碰撞体、区域和 A* 导航图
- `src/game/character.ts`：分部位人形角色、第三/第一人称武器模型
- `src/game/weapons.ts`：可扩展武器数据与装备系统
- `src/game/audio.ts`：Web Audio 程序化音效
- `src/App.tsx`：部署界面、HUD、击杀播报、瞄准镜与小地图

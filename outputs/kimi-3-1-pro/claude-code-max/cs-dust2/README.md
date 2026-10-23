# Sandline Strike

一个完全由代码生成的 Dust2 核心区域 5v5 FPS 原型。使用 React 18、TypeScript 和 three.js；没有外部模型、贴图、音频或游戏引擎。

## 运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址（默认 `http://localhost:5173`）。需要支持 WebGL 2 和 Pointer Lock 的桌面浏览器。

```bash
npm run build
npm run preview
```

## 操作

- `WASD` 移动，鼠标瞄准，左键开火，`Space` 跳跃，`Shift` 静步
- `1 / 2 / 3` 切换主武器、副武器、近战，`Q` 或滚轮快速切换
- `R` 换弹，AWP 右键开镜
- `E` 按住安放或拆除 C4；T 靠近掉落的 C4 自动拾取
- `B` 在出生点购买阶段打开购买菜单
- 阵亡后 `F` 切换队友视角，`G` 接管当前队友
- `M` 静音，`Esc` 释放鼠标并暂停

## 对局

第一回合为标准手枪局：默认阵营手枪、无主武器、无初始护甲。可用起始资金购买沙鹰或护甲；后续回合通过胜负与击杀奖励购买步枪、AWP 和护甲。

C4 安放需 3.2 秒，爆炸倒计时 40 秒；CT 拆包需 5 秒。T 全歼 CT 或引爆 C4 获胜；CT 在未安放时全歼 T 或成功拆包获胜，回合时间耗尽也使 CT 获胜。

## 实现结构

- `src/game/map.ts`：Dust2 区域、几何体、碰撞盒、坡面与自动中门
- `src/game/navigation.ts`：八方向 A*、防切角、路径拉直
- `src/game/physics.ts`：角色碰撞、重力、射线、坡面和分区 Hitbox
- `src/game/weapons.ts`：可扩展武器数据与伤害/后坐力参数
- `src/game/ai.ts`：索敌、交战、推进、下包、回防与拆包状态机
- `src/game/engine.ts`：固定步长仿真、回合、C4、输入、经济和 React 快照
- `src/game/renderer.ts`：世界/第一人称双场景渲染、特效和相机
- `src/game/characters.ts`：程序化类人角色与武器模型
- `src/game/audio.ts`：Web Audio 程序化音效
- `src/components/`：HUD 与实时小地图

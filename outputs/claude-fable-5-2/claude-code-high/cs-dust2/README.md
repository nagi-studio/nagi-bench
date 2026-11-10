# 潮汐货场 · Tidal Yard — 浏览器 5v5 爆破 FPS 原型

React 18 + TypeScript + three.js（Vite）。没有任何外部资产：地图、角色、武器全部由代码生成，贴图用 Canvas 现场绘制，声音用 Web Audio 合成。寻路、AI 状态机、物理、渲染循环均为自研，第三方运行时依赖只有 `three / react / react-dom`。

```bash
npm install
npm run dev      # 打开终端里提示的地址（默认 http://localhost:5173）
```

> 地图是**原创**的三路爆破图「潮汐货场」（集装箱码头），不是任何现有游戏关卡的复刻。
> 它具备同类地图的完整结构：攻/守出生点、长道（码头长廊）、A 点、中路 + 可穿过的中门、高架栈桥、暗道、B 点，各区域互相连通。

## 操作

| 按键 | 功能 |
| --- | --- |
| `W A S D` / 鼠标 | 移动 / 视角（点击画面锁定指针） |
| `空格` / `Ctrl`·`C` / `Shift` | 跳跃 / 蹲下 / 静步（无脚步声） |
| 鼠标左键 | 开火（刀：轻击） |
| 鼠标右键 | AWP 开镜（两段）/ 刀重击 |
| `R` | 换弹 |
| `1` `2` `3` · `Q` · 滚轮 | 主武器 / 副武器 / 刀 · 上一把 · 轮换 |
| `E`（按住） | 在包点安放 C4 / 拆除 C4 |
| `G` | 丢弃 C4 |
| `B` | 准备时间内选择装备（步枪局） |
| `Tab` | 计分板 |
| 阵亡后 左/右键 · `F` | 切换队友第一人称视角 · 接管该队友（bot） |
| `Esc` | 暂停（可调灵敏度、音量） |

## 玩法

- 10 人：你 + 4 名 AI 队友 vs 5 名 AI 敌人。主菜单可选阵营（攻方 / 守方）、模式、难度。
- **标准比赛**：第 1 回合是手枪局（只有默认手枪：攻方 Glock-18、守方 USP，无护甲无拆弹钳），之后为步枪局（满甲 + 头盔，守方带拆弹钳），先赢 7 回合获胜。另有「纯手枪局」「步枪局」模式。
- 回合开始 C4 随机交给一名攻方；持包者阵亡 C4 掉落，其他攻方走过即可拾取。
- 攻方在 A / B 包点按住 `E` 3.2 秒安放，40 秒后引爆；守方在 C4 旁按住 `E` 拆除（10 秒，有拆弹钳 5 秒）。
- 胜负：攻方清空守方或 C4 爆炸 → 攻方胜；守方清空攻方（未下包）、拆包成功或时间耗尽 → 守方胜。

### 武器（`src/sim/weapons.ts`，纯数据驱动）

| 武器 | 伤害 | 射速 | 弹匣 | 特点 |
| --- | --- | --- | --- | --- |
| AK-47 | 38 | 600 | 30 | 高伤害；连射时视角明显上扬、准星大幅扩散 |
| M4A1 | 31 | 700 | 30 | 中等伤害，后坐力低，射速高 |
| AWP | 135 | 41 | 5 | 躯干一枪致命；栓动；右键两段开镜，不开镜极不准 |
| Glock-18 / USP | 19 / 22 | 400 / 352 | 20 / 12 | 默认手枪 |
| Desert Eagle | 28 | 220 | 7 | 伤害介于手枪与步枪之间，穿甲高，后坐力大 |
| 战术刀 | 40 / 65 | — | — | 左键轻击 / 右键重击，持刀移动最快 |

Hitbox 分区倍率：头 ×2.0、胸 ×1.0、腹 ×0.9、手臂 ×0.75、腿 ×0.65。护甲覆盖头（需头盔）/胸/腹/臂，只让 `armorPen` 比例的伤害穿透，其余一半由护甲吸收；腿不受保护。

## 架构

```
src/
  sim/        纯 TypeScript 模拟层 —— 不依赖 three / DOM，可无头运行
    map.ts        地图：1 m 网格雕刻可行走区域 → 贪心合并成建筑体 + 手摆掩体，战术点位
    collision.ts  AABB 碰撞世界：空间哈希、collide-and-slide、上台阶、射线（子弹/视线）
    nav.ts        从碰撞世界自动生成 0.5 m 寻路网格（高度、连通位、贴墙惩罚），A* + 拉直
    actor.ts      角色状态、Quake 式地面/空中加速、分区 Hitbox 射线检测
    weapons.ts    武器数据表、护甲模型
    sim.ts        固定步长 tick：开火/散布/后坐力/伤害、可见性矩阵、事件队列
    round.ts      回合阶段机 + C4（携带/掉落/安放/拆除/爆炸）与胜负判定
    tactics.ts    队伍战术：进攻包点与路线分配、守点、回防轮转、捡包人/拆包人
    bot.ts        Bot 状态机：idle/advance/hold/engage/hunt/plant/defuse/fetch/guard/retake
  render/     three.js 渲染层（只读模拟状态）
    textures.ts / mapMesh.ts / character.ts / weaponModels.ts / viewModel.ts / effects.ts / GameRenderer.ts
  audio/      AudioEngine.ts —— Web Audio 程序化音效（枪声、换弹、脚步、开镜、命中、C4、击杀…）
  game/       Game.ts（主循环与胶水）、Input.ts（键鼠 / 指针锁定）、minimap.ts（雷达绘制）
  state/      store.ts —— 外部状态仓库（useSyncExternalStore）+ 每帧直写的 DOM ref 通道
  ui/         Menu / GameView / Hud（React 覆盖层）
```

**三条时间线如何同步**

- **物理帧**：`Game.frame` 用累加器以固定 1/60 s 推进 `Simulation.tick`（最多补 5 帧），与显示器刷新率解耦。
- **渲染帧**：每个 rAF 渲染一次，角色位置在最近两次 tick 之间插值；本地玩家的视角直接由 `mousemove` 写入，瞄准零延迟。
- **React**：引擎不在 React state 里。低频数据（血量、弹药、比分、击杀播报…）约 12 Hz 浅比较后写入 store，组件用 selector 订阅，只有选中的值变化才重渲染；高频视觉（准星扩散、命中标记、受伤方向、小地图）由引擎每帧直接写 DOM ref。`Game` 在 `useEffect` 中创建并自带 `<canvas>`，卸载时完整释放，兼容 StrictMode 双挂载。
- 模拟层通过事件队列（`shot / hit / kill / bomb / round …`）向渲染、音频、HUD 单向广播，三者互不耦合。

**AI**：每个 bot 与玩家走同一套输入 → 模拟代码（只写 `ActorInput` 和视角）。视野 = 朝向锥 + 眼睛到敌人头/胸的射线（被墙挡住看不见），另有听觉（枪声/脚步）与中弹警觉；交战时有反应时间、瞄准误差收敛、点射节奏、压枪、扫射间横移；架点的守方会躲在齐胸掩体后只露头。攻方按路线分路推进并安放 C4，掉包后最近的人去捡；守方 2-2-1 布防、发现主攻方向后回防，下包后最近者拆包、其余掩护。

## 测试脚本（可选，需要 [bun](https://bun.sh)）

模拟层不依赖浏览器，可以直接跑整场 bot 对局：

```bash
bun run scripts/unittest.ts          # 规则断言：伤害/护甲/Hitbox/后坐力/开镜/换弹/碰撞模糊测试
bun run scripts/simtest.ts 8 42      # 10 个 bot 无头打 8 回合，检查寻路可达性与卡死
bun run scripts/balance.ts 10 rifle  # 多种子攻守胜率统计
bun run --tsconfig-override=scripts/tsconfig.smoke.json scripts/smoke.ts def 30000
                                     # 用 three/DOM 测试替身驱动真实的 Game 主循环（含输入、HUD 同步、接管队友）
```

## 已知取舍

- 没有经济系统：步枪局装备免费，准备时间按 `B` 选择。
- 没有队友伤害、穿墙和投掷物；不换边。
- Bot 不会跳箱子，只走寻路网格（玩家可以跳上 1 m 左右的箱子）。

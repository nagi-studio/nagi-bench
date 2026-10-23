# DUSTLINE // PROTOCOL

一个完全由代码生成的 3D 第一人称 5v5 战术射击原型。地图、人物、武器、特效和音效均不使用外部资产；运行时依赖只有 React、ReactDOM 和 three.js。

## 启动

```bash
npm install
npm run dev
```

打开终端显示的地址（默认 `http://localhost:5173`），选择 CT 或 T，然后点击 3D 画面锁定鼠标。

```bash
npm run build    # TypeScript 检查 + 生产构建
npm run preview # 预览生产构建
```

需要支持 WebGL、Pointer Lock 和 Web Audio 的现代桌面浏览器。

## 操作

| 按键 | 功能 |
| --- | --- |
| WASD / 空格 | 移动 / 跳跃 |
| 鼠标 | 转动视角；左键开火；AWP 右键开镜 |
| 1 / 2 / 3 / 滚轮 | 主武器 / 副武器 / 近战切换 |
| R | 换弹 |
| E（按住） | 在包点安放 C4，或靠近已安放 C4 拆除 |
| B | 购买阶段打开/关闭装备菜单 |
| 空格（阵亡后） | 切换存活队友视角 |
| F（阵亡后） | 接管当前观战的 AI 队友 |
| Esc | 释放鼠标 |

T 靠近掉落 C4 会自动拾取。第一回合为无甲默认手枪局；后续回合可通过经济购买步枪、AWP、沙鹰和护甲。

## 已实现系统

- **Dust2 核心区域**：T/CT 出生点、A 大、A 点、中门、猫道、B 洞、B 点；实体墙体、门体、木箱及射线遮挡。
- **5v5**：1 名玩家、4 名 AI 队友和 5 名敌方 AI；阵营配色、独立头/躯干/双臂/双腿和持枪动画。
- **AI**：网格 A*、路径平滑、卡墙重寻路、视锥与墙体视线检测、反应时间、交战走位、进攻/守点/捡包/下包/回防拆包。
- **武器**：AK-47、M4A4、AWP、Glock、USP-S、Desert Eagle、战术刀；数据驱动射速、伤害、弹匣、后坐力、扩散、换弹和开镜。
- **命中**：头、胸、腹、手臂、腿分区 OBB Hitbox；爆头为基础胸部伤害两倍；护甲减伤和耐久损耗。
- **回合**：手枪局、购买与经济、掉包/拾包、3 秒下包、5 秒拆包、40 秒 C4 引爆、歼灭/超时/拆包/爆炸结算。
- **HUD**：动态准星、生命/护甲、弹药/换弹、比分/计时、击杀播报、实时小地图、敌人可见标记、C4 标记、观战与购买界面。
- **程序化音频**：各武器开火、换弹、脚步、开镜、命中/击杀、C4 安放/拆除/蜂鸣/爆炸。

## 架构

```text
src/
├── components/
│   ├── GameView.tsx   # Canvas 与引擎生命周期、useSyncExternalStore 订阅
│   ├── HUD.tsx        # React 战术 HUD
│   └── Minimap.tsx    # 从真实碰撞数据绘制俯视图
├── game/
│   ├── engine.ts      # 固定 60 Hz 状态机、回合、输入、渲染同步
│   ├── map.ts         # 程序化 Dust2 几何与碰撞数据
│   ├── models.ts      # 人型角色及第一/第三人称武器模型
│   ├── navigation.ts  # 二叉堆 A*、半径膨胀网格、路径拉直
│   ├── physics.ts     # 碰撞移动、重力、AABB/OBB 射线与 Hitbox
│   ├── weapons.ts     # 可扩展武器数据和购买配置
│   ├── audio.ts       # Web Audio 振荡器/噪声合成
│   └── types.ts       # 引擎与 HUD 数据契约
└── styles.css
```

React 不参与逐帧世界计算。引擎持有可变游戏状态，以约 16 Hz 发布不可变 HUD 快照；three.js 渲染循环和 60 Hz 物理/AI 更新独立于 React 生命周期，组件卸载时释放事件、GPU 资源和 AudioContext。

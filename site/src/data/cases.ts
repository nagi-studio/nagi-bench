import type { Bilingual } from '../i18n'

export type ModelStatus = 'ran' | 'pending'

export type ModelDef = {
  id: string
  label: string
  vendor: string
  status: ModelStatus
}

export type CaseKind = 'html' | 'svg'

export type CaseDef = {
  id: string
  index: string
  kind: CaseKind
  title: Bilingual
  tagline: Bilingual
  prompt: Bilingual
  tags: string[]
}

// A model's artifact for one case, plus run-specific notes. By convention the
// artifact lives at outputs/<model-id>/<case-id>.<kind>; set `file` only when
// the filename deviates from that.
export type RunDef = {
  note?: Bilingual
  file?: string
}

export const REPO_URL = 'https://github.com/nagi-studio/nagi-bench'

// Flagship lineup verified 2026-06: GPT-5.5 (Apr 23), Gemini 3.1 Pro
// (Feb 19, still the Pro flagship), Grok 4.3 (late Apr), Mistral Medium 3.5
// (Apr 28), DeepSeek-V4-Pro (Apr 24), Kimi K2.6 (Apr 20; K2.7 does not
// exist), MiniMax M3 (Jun 1), GLM-5.1 (Mar 27), Qwen3.7-Max (May 20).
// Ids are dash-only so they double as outputs/ folder names.
export const MODELS: ModelDef[] = [
  { id: 'claude-fable-5', label: 'Claude Fable 5', vendor: 'Anthropic', status: 'ran' },
  { id: 'gpt-5-5-pro', label: 'GPT-5.5 Pro', vendor: 'OpenAI', status: 'ran' },
  { id: 'gpt-5-5-xhigh', label: 'GPT-5.5 xhigh', vendor: 'OpenAI', status: 'ran' },
  { id: 'gemini-3-1-pro', label: 'Gemini 3.1 Pro', vendor: 'Google', status: 'ran' },
  { id: 'gemini-3-5-flash', label: 'Gemini 3.5 Flash', vendor: 'Google', status: 'ran' },
  { id: 'grok-build', label: 'Grok Build', vendor: 'xAI', status: 'ran' },
  { id: 'composer-2-5', label: 'Composer 2.5', vendor: 'Cursor', status: 'ran' },
  { id: 'mistral-medium-3-5', label: 'Mistral Medium 3.5', vendor: 'Mistral AI', status: 'pending' },
  { id: 'deepseek-v4-pro', label: 'DeepSeek-V4-Pro', vendor: 'DeepSeek', status: 'pending' },
  { id: 'xiaomi-mimo-v2-5-pro', label: 'MiMo v2.5 Pro', vendor: 'Xiaomi', status: 'ran' },
  { id: 'kimi-k2-6', label: 'Kimi K2.6', vendor: 'Moonshot AI', status: 'pending' },
  { id: 'minimax-m3', label: 'MiniMax M3', vendor: 'MiniMax', status: 'pending' },
  { id: 'glm-5-1', label: 'GLM-5.1', vendor: 'Zhipu AI', status: 'pending' },
  { id: 'qwen3-7-max', label: 'Qwen3.7-Max', vendor: 'Alibaba', status: 'pending' },
]

export const CASES: CaseDef[] = [
  {
    id: 'mythos-craft',
    index: '01',
    kind: 'html',
    title: { zh: '神话境界', en: 'Mythos Craft' },
    tagline: {
      zh: '单个 HTML 文件，一次生成一款《我的世界》式的可玩 3D 体素世界。',
      en: 'A playable Minecraft-style 3D voxel world, generated as a single HTML file in one shot.',
    },
    prompt: {
      zh: '你是一个顶级的资深游戏开发者。请为我使用单 HTML5 和 Canvas（或 Three.js）编写一个《我的世界》克隆版。请包含以下核心功能：\n\n1. 一个基于柏林噪声（Perlin Noise）生成的无限或可滚动的 3D 地形。\n2. 第一人称视角，支持使用 WASD 移动和鼠标环视。\n3. 支持至少 3 种方块类型（如：泥土、草地、石头等），并支持鼠标左键破坏方块，右键放置方块。材质要尽可能还原。\n4. 要有一个内置的、极其丰富的神话幻想中的建筑和地形等，由你自行设计。',
      en: 'You are a top-tier veteran game developer. Build me a Minecraft clone using a single HTML5 file and Canvas (or Three.js). Include the following core features:\n\n1. An infinite or scrollable 3D terrain generated from Perlin noise.\n2. A first-person view with WASD movement and mouse look.\n3. At least 3 block types (e.g. dirt, grass, stone), with left-click to break and right-click to place blocks. Keep the textures as faithful as possible.\n4. A built-in, extremely rich set of mythic-fantasy buildings and terrain, designed at your own discretion.',
    },
    tags: ['HTML', '3D', 'GAME', 'ONE-SHOT'],
  },
  {
    id: 'pelican-cycling',
    index: '02',
    kind: 'svg',
    title: { zh: '鹈鹕海边骑行', en: 'Pelican by the Sea' },
    tagline: {
      zh: '经典 SVG 测评题：让模型用代码「画」出一只骑自行车的鹈鹕。',
      en: 'The classic SVG eval: make the model "draw" a pelican riding a bicycle, in code.',
    },
    prompt: {
      zh: '制作一个逼真的、生动的、在海边骑着自行车的鹈鹕 svg',
      en: 'Create a realistic, lively SVG of a pelican riding a bicycle by the sea.',
    },
    tags: ['SVG', 'ILLUSTRATION', 'ONE-SHOT'],
  },
]

// case id -> model id -> run (per-model run notes; artifact path is derived)
export const RUNS: Record<string, Record<string, RunDef>> = {
  'mythos-craft': {
    'claude-fable-5': {
      note: {
        zh: '在 Claude 网页版以 Fable 5 Max（最高思考强度）运行，过程中触发一次 auto compact 与工具调用上限，手动输入「继续」后完成；ID 水印与英文支持为事后在 Cursor 中用 Composer 2.5 Fast 一条提示词补加，其余均为一次生成。已知小问题：开局可能卡在一棵树里，按一下 G 即可脱身。',
        en: 'Run in the Claude web app on Fable 5 Max (max thinking effort); hit one auto-compact and the tool-call limit mid-run, finished after a manual "continue". The ID watermark and English support were patched in afterwards with a single prompt via Composer 2.5 Fast in Cursor; everything else is one-shot. Known quirk: you may spawn stuck inside a tree - press G once to get free.',
      },
    },
    'gpt-5-5-pro': {
      note: {
        zh: '以 GPT-5.5 Pro（开启 Extended Pro）生成；本页为修复版（仅改 1 行）。问题：14 张贴图排成 8×2 图集、第二行只画了 6 格，UV 按左上原点计算却未设 flipY=false，两行贴图上下互换采样。修复前：草地顶面显示成黑曜石（地面全黑），树叶、沙子采到未绘制的空格（大片纯黑），放置方块的贴图互相串行、颜色诡异似反色。原因：CanvasTexture 默认 flipY=true，与自上而下的图集布局不匹配。加上 flipY=false 后地形与方块颜色全部正常。',
        en: 'Generated with GPT-5.5 Pro (Extended Pro enabled); fixed build (1 line changed). Bug: 14 tiles in an 8x2 atlas with only 6 slots drawn in row two, UVs computed from a top-left origin without flipY=false, so the two rows swapped on sampling. Before the fix: grass tops rendered as obsidian (black ground), leaves and sand hit undrawn slots (large black patches), and placed blocks wore each other\'s textures with inverted-looking colors. Cause: CanvasTexture defaults to flipY=true, mismatching the top-down atlas layout. With flipY=false everything renders correctly.',
      },
    },
    'gpt-5-5-xhigh': {
      note: {
        zh: '全程在 Codex CLI 中生成（未使用任何 skill）；本页为修复版（仅改 1 行）。问题：移动向量的 Z 分量整体差一个负号（第 979 行，正确应为 -strafe*sin - forward*cos）。修复前：运动被沿 X 轴镜像——面朝 ±X 方向时按 A/D 左右颠倒，面朝 ±Z 时 W/S 前后颠倒，体感「左右移动方向不对」。原因：Three.js 相机在 yaw=0 时朝 -Z，推导前进/侧移向量时把这个约定弄反了。给 Z 分量取负后，任意朝向下八方向移动全部正确。',
        en: 'Generated entirely in Codex CLI (no skills); fixed build (1 line changed). Bug: the movement vector\'s Z component had its sign flipped (line 979; correct form is -strafe*sin - forward*cos). Before the fix movement was mirrored across the X axis — A/D swapped when facing +-X, W/S swapped when facing +-Z, i.e. "strafing goes the wrong way". Cause: a Three.js camera faces -Z at yaw 0, and the forward/right derivation inverted that convention. Negating Z makes all eight directions correct at any heading.',
      },
    },
    'gemini-3-1-pro': {
      note: {
        zh: '通过 AntiGravity 生成（thinking effort: high）；一次生成，未发现需要修复的问题，原样展示。',
        en: 'Generated via AntiGravity (thinking effort: high); one shot, no fixes needed — shown as-is.',
      },
    },
    'gemini-3-5-flash': {
      note: {
        zh: '通过 AntiGravity 生成（thinking effort: high）；本页为修复版（仅改 1 行）。问题：16 张贴图按「上为原点」的行序画进 4×4 图集，UV 坐标表也按同一行序编写，但 CanvasTexture 默认 flipY=true 把采样行上下镜像（第 r 行实际采到第 3-r 行）。修复前：草地顶面显示成紫水晶、侧面采到带透明孔洞的传送门/树叶贴图，配合 alphaTest 出现大量「透明方块」，放置的方块贴图与名称完全对不上。原因：flipY 与图集行序约定不一致。加上 flipY=false 后行序对齐，地形与方块全部正常。',
        en: 'Generated via AntiGravity (thinking effort: high); fixed build (1 line changed). Bug: 16 tiles drawn into a 4x4 atlas with top-origin rows, and the UV table uses the same convention, but CanvasTexture\'s default flipY=true mirrors the rows on sampling (row r actually reads row 3-r). Before the fix: grass tops rendered as purple crystal, sides sampled the portal/leaves tiles with alpha holes — hence the many "transparent blocks" — and placed blocks never matched their names. Cause: flipY disagreeing with the atlas row convention. With flipY=false everything lines up.',
      },
    },
    'grok-build': {
      note: {
        zh: '在本地通过 Grok Build（TUI）开发实现；本页为修复版（共改 3 行）。问题一：第 82 行 const WORLD_SEED = 0xAETHER，T/H/R 不是十六进制字符，整段脚本解析即抛 SyntaxError——修复前画面纯黑，只剩 HTML 文字。问题二：贴图集画在 canvas 顶部两行、UV 按左上原点计算，却未设 flipY=false，所有面采样到未绘制的黑色区域——修复前进入世界后近处地形全黑。问题三：forward 向量已指向相机朝向，按键却写成 W 减、S 加——修复前按 W 后退、按 S 前进（A/D 正常）。三处均为一行级修正，其余保持 Grok 原样。',
        en: 'Built locally with the Grok Build TUI; fixed build (3 lines changed). Bug 1: line 82 const WORLD_SEED = 0xAETHER — T/H/R are not hex digits, so the whole script threw a SyntaxError at parse time; before the fix the screen was pure black with only HTML text. Bug 2: the atlas is drawn in the top canvas rows with top-left-origin UVs but no flipY=false, so every face sampled the undrawn black region; before the fix nearby terrain rendered solid black. Bug 3: the forward vector already points where the camera looks, but W subtracted and S added — W walked backward (A/D were fine). One line each; everything else is Grok as-is.',
      },
    },
    'composer-2-5': {
      note: {
        zh: '在 Cursor 中以 Composer 2.5 生成；本页为修复版（改 1 行）+ 补一个小功能。问题：第 1152 行水平速度先乘 speed*dt，位移时又乘一次 dt，实际步速只有设计值（5 格/秒）的约 1/60。修复前：走路如蜗牛、跳跃下落却正常；沙漠雪地等群系与神话建筑实际走不到，体感像「切换不了场景」——游戏本无传送功能，群系需步行抵达。原因：X/Z 轴把「每帧位移」当「每秒速度」存入 velocity，与 Y 轴语义不一致。去掉一次 dt 后步行恢复 5 格/秒。另外它确实生成了精灵螺旋塔、龙神殿、天空遗迹三处景点（也画在小地图上），但原版只能徒步抵达——已补加按 G 依次瞬移到三处景点的功能，开屏说明里也加了一行。',
        en: 'Generated with Composer 2.5 in Cursor; fixed build (1 line changed) plus one small addition. Bug: line 1152 multiplied horizontal velocity by speed*dt, then displacement multiplied by dt again, leaving walking at ~1/60 of the designed 5 blocks/s. Before the fix: walking crawled while jumping/falling felt normal, and biomes or mythic structures were effectively unreachable — which read as "scene switching is broken" (there is no teleport; biomes are reached on foot). Cause: X/Z stored per-frame displacement in a per-second velocity field, inconsistent with the Y axis. With one dt removed walking is back to 5 blocks/s. It does generate three landmarks (Elven Spiral Tower, Dragon Temple, Sky Ruins — also drawn on the minimap) that were only reachable on foot, so a G-key cycle-teleport to them was added, with a line in the start screen.',
      },
    },
    'xiaomi-mimo-v2-5-pro': {
      note: {
        zh: '在 Claude Code 中以 MiMo v2.5 Pro（最高思考强度）一次生成，未修复。包含 Perlin 噪声地形、WASD + 鼠标第一人称操控、12 种方块类型（含水、黑曜石、水晶、金块等）、程序化材质纹理、四种神话建筑（水晶塔、石环阵、龙骨遗迹、天空遗迹），按 G 可依次传送至神话建筑，小地图显示玩家位置和地标。',
        en: 'Generated in one shot via Claude Code with MiMo v2.5 Pro (max thinking effort), no fixes. Features Perlin noise terrain, WASD + mouse first-person controls, 12 block types (including water, obsidian, crystal, gold), procedural textures, and four mythic structures (Crystal Tower, Stone Circle, Dragon Skeleton, Sky Ruins). Press G to cycle-teleport between landmarks; minimap shows player position and landmarks.',
      },
    },
  },
  'pelican-cycling': {
    'claude-fable-5': {
      note: {
        zh: '在 Claude 网页版以 Fable 5 Max（最高思考强度）一次生成。',
        en: 'Generated in one shot in the Claude web app on Fable 5 Max (max thinking effort).',
      },
    },
    'xiaomi-mimo-v2-5-pro': {
      note: {
        zh: '在 Claude Code 中以 MiMo v2.5 Pro（最高思考强度）一次生成。场景包含渐变天空、太阳、云朵、海洋波浪、沙滩、棕榈树、海鸥、完整自行车细节（辐条、链条、齿轮、脚踏）以及鹈鹕（长喙、喉囊、羽翼、踩踏姿态），海滩上有海星和贝壳装饰。',
        en: 'Generated in one shot via Claude Code with MiMo v2.5 Pro (max thinking effort). Scene includes gradient sky, sun, clouds, ocean waves, beach, palm trees, seagulls, detailed bicycle (spokes, chain, gears, pedals), and a pelican (beak, gular pouch, wings, pedaling pose), with starfish and shell decorations on the beach.',
      },
    },
  },
}

export const runPath = (caseDef: CaseDef, modelId: string, run: RunDef) =>
  `outputs/${modelId}/${run.file ?? `${caseDef.id}.${caseDef.kind}`}`

export const outputUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

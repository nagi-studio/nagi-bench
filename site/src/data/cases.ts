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

// A model's artifact for one case, plus run-specific notes.
export type RunDef = {
  path: string // relative to the site root
  note?: Bilingual
}

export const REPO_URL = 'https://github.com/nagi-studio/nagi-bench'

export const MODELS: ModelDef[] = [
  { id: 'claude-fable-5', label: 'Claude Fable 5', vendor: 'Anthropic', status: 'ran' },
  { id: 'gpt-5.1', label: 'GPT-5.1', vendor: 'OpenAI', status: 'pending' },
  { id: 'gemini-3-pro', label: 'Gemini 3 Pro', vendor: 'Google', status: 'pending' },
  { id: 'deepseek-v3.2', label: 'DeepSeek V3.2', vendor: 'DeepSeek', status: 'pending' },
  { id: 'qwen3-max', label: 'Qwen3 Max', vendor: 'Alibaba', status: 'pending' },
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
      zh: '你是一个顶级的资深游戏开发者。请为我使用 HTML5 和 Canvas（或 Three.js）编写一个《我的世界》克隆版。请包含以下核心功能：\n\n1. 一个基于柏林噪声（Perlin Noise）生成的无限或可滚动的 3D 地形。\n2. 第一人称视角，支持使用 WASD 移动和鼠标环视。\n3. 支持至少 3 种方块类型（如：泥土、草地、石头等），并支持鼠标左键破坏方块，右键放置方块。材质要尽可能还原。\n4. 要有一个内置的、极其丰富的神话幻想中的建筑和地形等，由你自行设计。',
      en: 'You are a top-tier veteran game developer. Build me a Minecraft clone using HTML5 and Canvas (or Three.js). Include the following core features:\n\n1. An infinite or scrollable 3D terrain generated from Perlin noise.\n2. A first-person view with WASD movement and mouse look.\n3. At least 3 block types (e.g. dirt, grass, stone), with left-click to break and right-click to place blocks. Keep the textures as faithful as possible.\n4. A built-in, extremely rich set of mythic-fantasy buildings and terrain, designed at your own discretion.',
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

// case id -> model id -> run (artifact path + per-model run notes)
export const RUNS: Record<string, Record<string, RunDef>> = {
  'mythos-craft': {
    'claude-fable-5': {
      path: 'outputs/claude-fable-5/mythos-craft.html',
      note: {
        zh: '在 Claude 网页版以 Fable 5 Max（最高思考强度）运行，过程中触发一次 auto compact 与工具调用上限，手动输入「继续」后完成；ID 水印与英文支持为事后在 Cursor 中用 Composer 2.5 Fast 一条提示词补加，其余均为一次生成。',
        en: 'Run in the Claude web app on Fable 5 Max (max thinking effort); hit one auto-compact and the tool-call limit mid-run, finished after a manual "continue". The ID watermark and English support were patched in afterwards with a single prompt via Composer 2.5 Fast in Cursor; everything else is one-shot.',
      },
    },
  },
  'pelican-cycling': {
    'claude-fable-5': {
      path: 'outputs/claude-fable-5/pelican_cycling_by_the_sea.svg',
      note: {
        zh: '在 Claude 网页版以 Fable 5 Max（最高思考强度）一次生成。',
        en: 'Generated in one shot in the Claude web app on Fable 5 Max (max thinking effort).',
      },
    },
  },
}

export const outputUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

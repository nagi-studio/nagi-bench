// Brand icons for models, vendors and harnesses, mapped from the plain
// strings contributors already fill in models/<id>.json — no icon work needed
// on the contribution side.
//
// We deliberately depend on @lobehub/icons-static-svg (zero-dependency static
// assets) instead of the @lobehub/icons React package, whose peer deps
// (antd, @lobehub/ui) would dwarf this site. The mono SVGs are 1em-sized and
// fill="currentColor", so they follow font size and theme like text.
import alibaba from '@lobehub/icons-static-svg/icons/alibaba.svg?raw'
import anthropic from '@lobehub/icons-static-svg/icons/anthropic.svg?raw'
import antigravity from '@lobehub/icons-static-svg/icons/antigravity.svg?raw'
import bytedance from '@lobehub/icons-static-svg/icons/bytedance.svg?raw'
import chatglm from '@lobehub/icons-static-svg/icons/chatglm.svg?raw'
import claude from '@lobehub/icons-static-svg/icons/claude.svg?raw'
import claudecode from '@lobehub/icons-static-svg/icons/claudecode.svg?raw'
import codex from '@lobehub/icons-static-svg/icons/codex.svg?raw'
import cursor from '@lobehub/icons-static-svg/icons/cursor.svg?raw'
import deepseek from '@lobehub/icons-static-svg/icons/deepseek.svg?raw'
import doubao from '@lobehub/icons-static-svg/icons/doubao.svg?raw'
import gemini from '@lobehub/icons-static-svg/icons/gemini.svg?raw'
import google from '@lobehub/icons-static-svg/icons/google.svg?raw'
import grok from '@lobehub/icons-static-svg/icons/grok.svg?raw'
import kimi from '@lobehub/icons-static-svg/icons/kimi.svg?raw'
import minimax from '@lobehub/icons-static-svg/icons/minimax.svg?raw'
import mistral from '@lobehub/icons-static-svg/icons/mistral.svg?raw'
import moonshot from '@lobehub/icons-static-svg/icons/moonshot.svg?raw'
import openai from '@lobehub/icons-static-svg/icons/openai.svg?raw'
import qwen from '@lobehub/icons-static-svg/icons/qwen.svg?raw'
import xai from '@lobehub/icons-static-svg/icons/xai.svg?raw'
import xiaomimimo from '@lobehub/icons-static-svg/icons/xiaomimimo.svg?raw'
import zhipu from '@lobehub/icons-static-svg/icons/zhipu.svg?raw'

const ICONS: Record<string, string> = {
  alibaba,
  anthropic,
  antigravity,
  bytedance,
  chatglm,
  claude,
  claudecode,
  codex,
  cursor,
  deepseek,
  doubao,
  gemini,
  google,
  grok,
  kimi,
  minimax,
  mistral,
  moonshot,
  openai,
  qwen,
  xai,
  xiaomimimo,
  zhipu,
}

type Rule = [RegExp, string]

// Order matters where prefixes overlap (claude code before claude).
const MODEL_RULES: Rule[] = [
  [/claude/i, 'claude'],
  [/composer/i, 'cursor'],
  [/deepseek/i, 'deepseek'],
  [/doubao|豆包/i, 'doubao'],
  [/gemini/i, 'gemini'],
  [/glm/i, 'chatglm'],
  [/gpt/i, 'openai'],
  [/grok/i, 'grok'],
  [/kimi/i, 'kimi'],
  [/minimax/i, 'minimax'],
  [/mistral/i, 'mistral'],
  [/qwen|通义/i, 'qwen'],
  [/mimo/i, 'xiaomimimo'],
]

const VENDOR_RULES: Rule[] = [
  [/anthropic/i, 'anthropic'],
  [/cursor/i, 'cursor'],
  [/deepseek/i, 'deepseek'],
  [/bytedance|字节/i, 'bytedance'],
  [/google/i, 'google'],
  [/zhipu|智谱/i, 'zhipu'],
  [/openai/i, 'openai'],
  [/xai/i, 'xai'],
  [/moonshot|月之暗面/i, 'moonshot'],
  [/minimax/i, 'minimax'],
  [/mistral/i, 'mistral'],
  [/alibaba|阿里/i, 'alibaba'],
  [/xiaomi|小米/i, 'xiaomimimo'],
]

const HARNESS_RULES: Rule[] = [
  [/claude\s*code/i, 'claudecode'],
  [/claude/i, 'claude'],
  [/chatgpt/i, 'openai'],
  [/codex/i, 'codex'],
  [/antigravity/i, 'antigravity'],
  [/cursor/i, 'cursor'],
  [/doubao|豆包/i, 'doubao'],
  [/grok/i, 'grok'],
]

const match = (rules: Rule[], value?: string) =>
  value ? rules.find(([re]) => re.test(value))?.[1] : undefined

export const modelIcon = (label?: string) => match(MODEL_RULES, label)
export const vendorIcon = (vendor?: string) => match(VENDOR_RULES, vendor)
export const harnessIcon = (harness?: string) => match(HARNESS_RULES, harness)

export function BrandIcon({ icon, className = '' }: { icon?: string; className?: string }) {
  const svg = icon ? ICONS[icon] : undefined
  if (!svg) return null
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

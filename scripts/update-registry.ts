// Generates the README Registry tables from models/*.json. CI runs this in
// --check mode so the public README cannot drift from the source data.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const modelsDir = join(root, 'models')
const checkOnly = process.argv.includes('--check')

const START = '<!-- registry:start -->'
const END = '<!-- registry:end -->'

type RunJson = { file?: unknown; evaluation?: unknown }
type ModelJson = {
  label?: unknown
  vendor?: unknown
  harness?: unknown
  effort?: unknown
  order?: unknown
  runs?: Record<string, RunJson | RunJson[]>
}

type HarnessEntry = {
  label: string
  order: number
}

type RegistryGroup = {
  label: string
  vendor: string
  order: number
  runs: number
  showcases: number
  harnesses: Map<string, HarnessEntry>
}

function requiredString(value: unknown, field: string, file: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`models/${file}: "${field}" is required`)
  return value.trim()
}

function runCounts(runs: ModelJson['runs']): { total: number; showcases: number } {
  return Object.values(runs ?? {}).reduce(
    (counts, run) => {
      const variants = Array.isArray(run) ? run : [run]
      counts.total += variants.length
      counts.showcases += variants.filter((variant) => variant.evaluation === 'showcase').length
      return counts
    },
    { total: 0, showcases: 0 },
  )
}

function harnessLabel(def: ModelJson): string {
  const harness = typeof def.harness === 'string' ? def.harness.trim() : ''
  const effort = typeof def.effort === 'string' ? def.effort.trim() : ''
  if (!harness && !effort) return 'Default'
  if (!harness) return effort
  return effort ? `${harness} · ${effort}` : harness
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function registryGroups(): RegistryGroup[] {
  const groups = new Map<string, RegistryGroup>()
  for (const file of readdirSync(modelsDir).filter((name) => name.endsWith('.json')).sort()) {
    const def = JSON.parse(readFileSync(join(modelsDir, file), 'utf8')) as ModelJson
    const label = requiredString(def.label, 'label', file)
    const vendor = requiredString(def.vendor, 'vendor', file)
    const order = typeof def.order === 'number' ? def.order : Number.MAX_SAFE_INTEGER
    const key = `${label}\0${vendor}`
    let group = groups.get(key)
    if (!group) {
      group = { label, vendor, order, runs: 0, showcases: 0, harnesses: new Map() }
      groups.set(key, group)
    }

    group.order = Math.min(group.order, order)
    const counts = runCounts(def.runs)
    group.runs += counts.total
    group.showcases += counts.showcases
    const harness = harnessLabel(def)
    const existing = group.harnesses.get(harness)
    if (!existing || order < existing.order) group.harnesses.set(harness, { label: harness, order })
  }

  return [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
}

function table(lang: 'zh' | 'en'): string {
  const groups = registryGroups()
  const tested = groups.filter((group) => group.runs > 0)
  const pending = groups.filter((group) => group.runs === 0).map((group) => escapeCell(group.label))
  const note =
    lang === 'zh'
      ? '> 此表由 `bun scripts/update-registry.ts` 从 `models/*.json` 生成；合并到 `main` 后由 CI 自动同步，贡献者无需手改。'
      : '> This table is generated from `models/*.json` by `bun scripts/update-registry.ts`; CI re-syncs it automatically after merge — contributors need not hand-edit it.'
  const header =
    lang === 'zh'
      ? '| 模型 | 厂商 | 运行环境（Harness）× 思考配额 | 产出 |'
      : '| Model | Vendor | Harness x Effort | Runs |'

  const rows = tested.map((group) => {
    const harnesses = [...group.harnesses.values()]
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
      .map((entry) => escapeCell(entry.label))
      .join('<br>')
    const runs = String(group.runs).padStart(2, '0')
    const runLabel = group.showcases
      ? lang === 'zh'
        ? `${runs}（仅展示 ${String(group.showcases).padStart(2, '0')}）`
        : `${runs} (showcase ${String(group.showcases).padStart(2, '0')})`
      : runs
    return `| ${escapeCell(group.label)} | ${escapeCell(group.vendor)} | ${harnesses} | ${runLabel} |`
  })

  const lines = [START, note, '', header, '|---|---|---|---|', ...rows]
  if (pending.length) {
    lines.push(
      '',
      lang === 'zh'
        ? `待测：${pending.join(' · ')}（欢迎 PR 补充）`
        : `Pending: ${pending.join(' · ')} (PRs welcome)`,
    )
  }
  lines.push(END)
  return lines.join('\n')
}

function replaceRegistry(path: string, generated: string): boolean {
  const original = readFileSync(path, 'utf8')
  const start = original.indexOf(START)
  const end = original.indexOf(END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${path.replace(`${root}/`, '')}: missing ${START} / ${END} markers`)
  }
  const next = `${original.slice(0, start)}${generated}${original.slice(end + END.length)}`
  if (next === original) return false
  if (!checkOnly) writeFileSync(path, next)
  return true
}

const changed = [
  replaceRegistry(join(root, 'README.md'), table('zh')),
  replaceRegistry(join(root, 'README.en.md'), table('en')),
].some(Boolean)

if (checkOnly && changed) {
  console.error('Registry tables are stale. Run: bun scripts/update-registry.ts')
  process.exit(1)
}

console.log(changed ? 'Registry tables updated' : 'Registry tables OK')

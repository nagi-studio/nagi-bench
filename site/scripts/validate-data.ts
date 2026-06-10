// Validates the contribution data: models/<model-id>.json registrations and
// their artifacts under outputs/. Runs as part of `bun run build` and in CI,
// so a malformed or undocumented contribution fails before it can deploy.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const modelsDir = join(root, 'models')
const outputsDir = join(root, 'outputs')

const cases = JSON.parse(
  readFileSync(join(root, 'site', 'src', 'data', 'cases.json'), 'utf8'),
) as Array<{ id: string; kind: string }>
const caseKind = new Map(cases.map((c) => [c.id, c.kind]))

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const errors: string[] = []

const isBilingual = (v: unknown): boolean => {
  if (!v || typeof v !== 'object') return false
  const { zh, en } = v as { zh?: unknown; en?: unknown }
  return typeof zh === 'string' && zh.trim() !== '' && typeof en === 'string' && en.trim() !== ''
}

const modelIds = new Set<string>()
for (const f of readdirSync(modelsDir).filter((f) => f.endsWith('.json'))) {
  const id = f.replace(/\.json$/, '')
  modelIds.add(id)
  if (!ID_RE.test(id)) {
    errors.push(`models/${f}: id "${id}" must be lowercase letters/digits/dashes only (it doubles as the outputs/ folder name)`)
  }

  let def: { label?: unknown; vendor?: unknown; order?: unknown; runs?: Record<string, { note?: unknown; file?: unknown }> }
  try {
    def = JSON.parse(readFileSync(join(modelsDir, f), 'utf8'))
  } catch (e) {
    errors.push(`models/${f}: invalid JSON (${e})`)
    continue
  }

  if (typeof def.label !== 'string' || !def.label.trim()) errors.push(`models/${f}: "label" is required`)
  if (typeof def.vendor !== 'string' || !def.vendor.trim()) errors.push(`models/${f}: "vendor" is required`)
  if (def.order !== undefined && typeof def.order !== 'number') errors.push(`models/${f}: "order" must be a number`)

  for (const [caseId, run] of Object.entries(def.runs ?? {})) {
    if (!caseKind.has(caseId)) {
      errors.push(`models/${f}: unknown case "${caseId}" (known: ${[...caseKind.keys()].join(', ')})`)
      continue
    }
    if (!isBilingual(run?.note)) {
      errors.push(`models/${f}: runs.${caseId} needs a bilingual "note" ({ "zh", "en" }) documenting provenance (tool, effort level, one-shot or fixed)`)
    }
    if (run?.file !== undefined && typeof run.file !== 'string') {
      errors.push(`models/${f}: runs.${caseId}.file must be a string`)
    }
    const file = (typeof run?.file === 'string' && run.file) || `${caseId}.${caseKind.get(caseId)}`
    if (!existsSync(join(outputsDir, id, file))) {
      errors.push(`models/${f}: runs.${caseId} declared but artifact missing: outputs/${id}/${file}`)
    }
  }
}

for (const entry of readdirSync(outputsDir, { withFileTypes: true })) {
  if (entry.isDirectory() && !modelIds.has(entry.name)) {
    errors.push(`outputs/${entry.name}/ exists but models/${entry.name}.json is missing`)
  }
}

if (errors.length) {
  console.error(`Data validation failed (${errors.length}):\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Data OK: ${modelIds.size} models, ${caseKind.size} cases validated`)

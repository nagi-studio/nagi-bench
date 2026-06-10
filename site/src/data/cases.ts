import type { Bilingual } from '../i18n'
import casesData from './cases.json'

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

export const CASES = casesData as unknown as CaseDef[]

// Models and runs are contributed as repo-root models/<model-id>.json files —
// the filename is the model id (dash-only, doubling as the outputs/ folder
// name). `scripts/validate-data.ts` enforces the schema during the build.
type ModelFile = {
  label: string
  vendor: string
  order?: number
  runs?: Record<string, RunDef>
}

const modelFiles = import.meta.glob<ModelFile>('../../../models/*.json', {
  eager: true,
  import: 'default',
})

const modelEntries = Object.entries(modelFiles)
  .map(([path, def]) => ({ id: path.split('/').pop()!.replace(/\.json$/, ''), def }))
  .sort((a, b) => (a.def.order ?? 999) - (b.def.order ?? 999) || a.id.localeCompare(b.id))

export const MODELS: ModelDef[] = modelEntries.map(({ id, def }) => ({
  id,
  label: def.label,
  vendor: def.vendor,
  status: def.runs && Object.keys(def.runs).length > 0 ? 'ran' : 'pending',
}))

// case id -> model id -> run (per-model run notes; artifact path is derived)
export const RUNS: Record<string, Record<string, RunDef>> = {}
for (const { id, def } of modelEntries) {
  for (const [caseId, run] of Object.entries(def.runs ?? {})) {
    ;(RUNS[caseId] ??= {})[id] = run
  }
}

export const runPath = (caseDef: CaseDef, modelId: string, run: RunDef) =>
  `outputs/${modelId}/${run.file ?? `${caseDef.id}.${caseDef.kind}`}`

export const outputUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

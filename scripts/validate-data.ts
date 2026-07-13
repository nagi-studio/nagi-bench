// Validates the contribution data: models/<model-id>.json registrations and
// their artifacts under outputs/. Runs in CI for every PR and push, so a
// malformed or undocumented contribution fails before it can ship.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const modelsDir = join(root, 'models')
const outputsDir = join(root, 'outputs')

const cases = JSON.parse(readFileSync(join(root, 'cases.json'), 'utf8')) as Array<{
  id: string
  kind: string
}>
const caseKind = new Map(cases.map((c) => [c.id, c.kind]))

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const ARTIFACT_DIR_RE = /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)?$/
const errors: string[] = []

const isBilingual = (v: unknown): boolean => {
  if (!v || typeof v !== 'object') return false
  const { zh, en } = v as { zh?: unknown; en?: unknown }
  return typeof zh === 'string' && zh.trim() !== '' && typeof en === 'string' && en.trim() !== ''
}

const modelIds = new Set<string>()
const artifactDirs = new Map<string, string>()
const declaredArtifacts = new Set<string>()
// React cases declare a whole project directory (built to a single file at
// deploy time), not one artifact file — track those so the loose-file scan
// below skips their subtree.
const declaredDirs = new Set<string>()
for (const f of readdirSync(modelsDir).filter((f) => f.endsWith('.json'))) {
  const id = f.replace(/\.json$/, '')
  modelIds.add(id)
  if (!ID_RE.test(id)) {
    errors.push(`models/${f}: id "${id}" must be lowercase letters/digits/dashes only (it is the stable voting key and default outputs folder)`)
  }

  type RunJson = { note?: unknown; file?: unknown; contributor?: unknown }
  let def: {
    label?: unknown
    vendor?: unknown
    artifactDir?: unknown
    order?: unknown
    runs?: Record<string, RunJson | RunJson[]>
  }
  try {
    def = JSON.parse(readFileSync(join(modelsDir, f), 'utf8'))
  } catch (e) {
    errors.push(`models/${f}: invalid JSON (${e})`)
    continue
  }

  if (typeof def.label !== 'string' || !def.label.trim()) errors.push(`models/${f}: "label" is required`)
  if (typeof def.vendor !== 'string' || !def.vendor.trim()) errors.push(`models/${f}: "vendor" is required`)
  if (def.order !== undefined && typeof def.order !== 'number') errors.push(`models/${f}: "order" must be a number`)
  if (def.artifactDir !== undefined && typeof def.artifactDir !== 'string') {
    errors.push(`models/${f}: "artifactDir" must be a string`)
  }
  const artifactDir = typeof def.artifactDir === 'string' && def.artifactDir.trim() ? def.artifactDir.trim() : id
  if (!ARTIFACT_DIR_RE.test(artifactDir)) {
    errors.push(`models/${f}: artifactDir "${artifactDir}" must be one or two lowercase dash-case path segments, e.g. "claude-fable-5/claude-code-max"`)
  }
  const dirOwner = artifactDirs.get(artifactDir)
  if (dirOwner) {
    errors.push(`models/${f}: artifactDir "${artifactDir}" is already used by models/${dirOwner}.json`)
  } else {
    artifactDirs.set(artifactDir, id)
  }

  for (const [caseId, runRaw] of Object.entries(def.runs ?? {})) {
    if (!caseKind.has(caseId)) {
      errors.push(`models/${f}: unknown case "${caseId}" (known: ${[...caseKind.keys()].join(', ')})`)
      continue
    }
    const variants = Array.isArray(runRaw) ? runRaw : [runRaw]
    if (!variants.length) errors.push(`models/${f}: runs.${caseId} is an empty array`)
    const seenFiles = new Set<string>()
    variants.forEach((run, i) => {
      const where = variants.length > 1 ? `runs.${caseId}[${i}]` : `runs.${caseId}`
      if (!isBilingual(run?.note)) {
        errors.push(`models/${f}: ${where} needs a bilingual "note" ({ "zh", "en" }) documenting provenance (tool, effort level, one-shot or fixed)`)
      }
      if (run?.file !== undefined && typeof run.file !== 'string') {
        errors.push(`models/${f}: ${where}.file must be a string`)
      }
      if (
        typeof run?.file === 'string' &&
        (run.file.includes('/') || run.file.includes('\\') || run.file.includes('..'))
      ) {
        errors.push(`models/${f}: ${where}.file must be a filename, not a path`)
      }
      if (run?.contributor !== undefined && (typeof run.contributor !== 'string' || !run.contributor.trim())) {
        errors.push(`models/${f}: ${where}.contributor must be a non-empty GitHub username`)
      }
      if (caseKind.get(caseId) === 'react') {
        // React case: the artifact is a full project directory, not a file.
        const dirName = (typeof run?.file === 'string' && run.file) || caseId
        if (seenFiles.has(dirName)) {
          errors.push(`models/${f}: ${where} resolves to the same project dir "${dirName}" as another variant`)
        }
        seenFiles.add(dirName)
        const relDir = `${artifactDir}/${dirName}`
        declaredDirs.add(relDir)
        const dirPath = join(outputsDir, artifactDir, dirName)
        if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
          errors.push(`models/${f}: ${where} declares a React project but directory missing: outputs/${relDir}/`)
        } else if (!existsSync(join(dirPath, 'package.json'))) {
          errors.push(`models/${f}: ${where}: outputs/${relDir}/ must contain a package.json (a full project)`)
        }
        return
      }
      const file = (typeof run?.file === 'string' && run.file) || `${caseId}.${caseKind.get(caseId)}`
      if (seenFiles.has(file)) {
        errors.push(`models/${f}: ${where} resolves to the same artifact "${file}" as another variant — extra variants must set a distinct "file"`)
      }
      seenFiles.add(file)
      const artifact = `${artifactDir}/${file}`
      declaredArtifacts.add(artifact)
      const artifactPath = join(outputsDir, artifactDir, file)
      if (!existsSync(artifactPath)) {
        errors.push(`models/${f}: ${where} declared but artifact missing: outputs/${artifact}`)
      } else if (statSync(artifactPath).size === 0) {
        errors.push(`models/${f}: ${where} artifact is empty: outputs/${artifact}`)
      }
    })
  }
}

// Every file under outputs/ must be declared by a run — loose artifacts would
// otherwise ship without provenance.
// `artifactDir` can be one or two path segments, so scan recursively and compare
// against the concrete paths declared above.
function walkOutputs(dir: string, prefix = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      if (declaredDirs.has(rel)) continue // React project dir — declared wholesale
      walkOutputs(join(dir, entry.name), rel)
    } else if (!declaredArtifacts.has(rel)) {
      errors.push(`outputs/${rel} is not declared by any run in models/*.json`)
    }
  }
}
if (existsSync(outputsDir)) walkOutputs(outputsDir)

if (errors.length) {
  console.error(`Data validation failed (${errors.length}):\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Data OK: ${modelIds.size} models, ${caseKind.size} cases validated`)

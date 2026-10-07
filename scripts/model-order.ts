// Display order for model entries, shared by the README registry and (as a
// mirrored copy) the site's src/data/cases.ts — keep the two in sync.
//
// 1. Vendors keep their block position: a vendor ranks by the smallest
//    `order` among its entries (vendors without any `order` go last).
// 2. Inside a vendor, the newer version comes first, parsed from the first
//    number in the label ("Claude Fable 5.1" -> 5.1, "GPT-6 Sol" -> 6), so a
//    new release never has to be slotted in by hand.
// 3. Same version: flagship tiers before light ones (Haiku / Flash / Mini / Lite /
//    Nano / Small sort after Pro / Max / unmarked), then a trailing MMDD
//    snapshot newest first ("DeepSeek V4 Pro 0813" > "DeepSeek-V4-Pro").
// 4. Otherwise: hand-set `order`, then id.

export interface OrderedModel {
  id: string
  label: string
  vendor: string
  order?: number
}

export function labelVersion(label: string): number | null {
  const match = label.match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

const LIGHT_TIER = /(?<![a-z])(flash|mini|lite|nano|small|haiku)(?![a-z])/i

export function labelTier(label: string): number {
  return LIGHT_TIER.test(label) ? 1 : 0
}

export function labelSnapshot(label: string): number {
  const match = label.match(/\s(\d{4})$/)
  return match ? Number(match[1]) : 0
}

export function vendorRanks(models: OrderedModel[]): Map<string, number> {
  const ranks = new Map<string, number>()
  for (const model of models) {
    if (typeof model.order !== 'number') continue
    ranks.set(model.vendor, Math.min(ranks.get(model.vendor) ?? Infinity, model.order))
  }
  return ranks
}

export function compareModels(ranks: Map<string, number>) {
  const rank = (m: OrderedModel) => ranks.get(m.vendor) ?? Number.MAX_SAFE_INTEGER
  const handOrder = (m: OrderedModel) => (typeof m.order === 'number' ? m.order : rank(m) + 0.99)
  return (a: OrderedModel, b: OrderedModel): number => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b)
    const va = labelVersion(a.label)
    const vb = labelVersion(b.label)
    if (va !== null && vb !== null && va !== vb) return vb - va
    const tier = labelTier(a.label) - labelTier(b.label)
    if (tier) return tier
    const snapshot = labelSnapshot(b.label) - labelSnapshot(a.label)
    if (va !== null && va === vb && snapshot) return snapshot
    return handOrder(a) - handOrder(b) || a.id.localeCompare(b.id)
  }
}

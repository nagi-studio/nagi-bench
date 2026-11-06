/* ============================================================================
   Weapon system — an extensible data-driven definition. Each weapon carries its
   own damage model, fire cadence, recoil profile, magazine and a synthesised
   sound signature. Hit detection is by body zone with headshots at 2x.
   ========================================================================== */

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'

export type Slot = 'primary' | 'secondary' | 'melee'

export interface WeaponDef {
  id: WeaponId
  name: string
  slot: Slot
  damage: number          // base body damage
  headMult: number        // headshot multiplier (2x per spec)
  rpm: number             // rounds per minute (fire cadence)
  auto: boolean
  magSize: number
  reserve: number
  reloadTime: number      // seconds
  recoilY: number         // vertical view kick per shot (radians)
  recoilX: number         // horizontal spread amplitude (radians)
  spread: number          // base inaccuracy cone (radians) at hip
  moveSpeed: number       // multiplier applied to the player's walk speed
  zoom?: number           // fov multiplier when scoped (AWP)
  scoped?: boolean        // right-click scopes
  melee?: boolean
  range: number           // effective range before damage falloff
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, headMult: 2, rpm: 600, auto: true, magSize: 30, reserve: 90,
    reloadTime: 2.5, recoilY: 0.030, recoilX: 0.022, spread: 0.010,
    moveSpeed: 0.90, range: 60,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 31, headMult: 2, rpm: 700, auto: true, magSize: 30, reserve: 90,
    reloadTime: 2.6, recoilY: 0.017, recoilX: 0.012, spread: 0.008,
    moveSpeed: 0.93, range: 58,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, headMult: 2, rpm: 41, auto: false, magSize: 10, reserve: 30,
    reloadTime: 3.6, recoilY: 0.09, recoilX: 0.02, spread: 0.0008,
    moveSpeed: 0.78, zoom: 0.28, scoped: true, range: 200,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 22, headMult: 2, rpm: 400, auto: false, magSize: 20, reserve: 120,
    reloadTime: 2.2, recoilY: 0.012, recoilX: 0.010, spread: 0.012,
    moveSpeed: 1.0, range: 34,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 26, headMult: 2, rpm: 360, auto: false, magSize: 12, reserve: 60,
    reloadTime: 2.1, recoilY: 0.010, recoilX: 0.008, spread: 0.009,
    moveSpeed: 1.0, range: 34,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 46, headMult: 2, rpm: 267, auto: false, magSize: 7, reserve: 35,
    reloadTime: 2.3, recoilY: 0.042, recoilX: 0.020, spread: 0.014,
    moveSpeed: 0.97, range: 44,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 55, headMult: 2, rpm: 120, auto: false, magSize: Infinity, reserve: 0,
    reloadTime: 0, recoilY: 0, recoilX: 0, spread: 0,
    moveSpeed: 1.06, range: 2.2, melee: true,
  },
}

// Default loadouts per team and round type.
export function defaultLoadout(team: 'CT' | 'T', pistolRound: boolean): {
  primary: WeaponId | null
  secondary: WeaponId
} {
  return {
    primary: pistolRound ? null : team === 'CT' ? 'm4a4' : 'ak47',
    secondary: team === 'CT' ? 'usp' : 'glock',
  }
}

// Damage after armour and range falloff.
export function computeDamage(def: WeaponDef, zone: BodyZone, armour: number, dist: number): number {
  let dmg = def.damage
  if (zone === 'head') dmg *= def.headMult
  else if (zone === 'leg') dmg *= 0.75
  else if (zone === 'arm') dmg *= 0.85
  // range falloff beyond effective range
  if (dist > def.range) {
    const over = (dist - def.range) / def.range
    dmg *= Math.max(0.4, 1 - over * 0.5)
  }
  // armour absorbs part of the damage (helmets protect the head)
  if (armour > 0) dmg *= zone === 'head' ? 0.6 : 0.72
  return dmg
}

export type BodyZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg'

// Recoil pattern: vertical climb with a horizontal weave that grows with the
// shot index, so sustained fire climbs and drifts like the real guns.
export function recoilFor(def: WeaponDef, shotIndex: number): { x: number; y: number } {
  const i = shotIndex
  const climb = Math.min(1, i / 6) // first shots kick hardest upward ramp
  const y = def.recoilY * (0.6 + 0.6 * climb)
  const phase = i * 0.9
  const x = def.recoilX * Math.sin(phase) * (0.5 + 0.7 * Math.min(1, i / 8))
  return { x, y }
}

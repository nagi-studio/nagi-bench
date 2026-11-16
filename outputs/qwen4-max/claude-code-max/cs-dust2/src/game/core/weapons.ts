import type { Slot, WeaponDef, WeaponId, WeaponState } from './types.ts';
import { CFG } from './config.ts';

// Extensible weapon table. Add a new entry here and it flows through combat,
// AI, economy, viewmodels and audio automatically.
export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 50, rpm: 600, mag: 30, reserve: 90, reloadTime: 2.5, auto: true,
    spreadBase: 0.35, spreadMove: 2.4, bloomPerShot: 0.42, bloomMax: 3.4, bloomRecover: 5.0,
    recoilPitch: 1.05, recoilYaw: 0.42, armorPen: 0.72, moveSpeed: 5.4,
    scoped: false, zoomFov: 75, price: 2700, killReward: 300, range: 200, pellets: 1,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 44, rpm: 666, mag: 30, reserve: 90, reloadTime: 3.1, auto: true,
    spreadBase: 0.28, spreadMove: 2.0, bloomPerShot: 0.3, bloomMax: 2.6, bloomRecover: 5.5,
    recoilPitch: 0.6, recoilYaw: 0.26, armorPen: 0.7, moveSpeed: 5.5,
    scoped: false, zoomFov: 75, price: 3100, killReward: 300, range: 200, pellets: 1,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, rpm: 41, mag: 5, reserve: 30, reloadTime: 3.7, auto: false,
    spreadBase: 4.0, spreadMove: 7.0, bloomPerShot: 0.0, bloomMax: 0.0, bloomRecover: 0.0,
    recoilPitch: 2.2, recoilYaw: 0.3, armorPen: 0.975, moveSpeed: 4.7,
    scoped: true, zoomFov: 20, price: 4750, killReward: 100, range: 300, pellets: 1,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 28, rpm: 400, mag: 20, reserve: 120, reloadTime: 2.2, auto: false,
    spreadBase: 0.6, spreadMove: 1.8, bloomPerShot: 0.4, bloomMax: 2.4, bloomRecover: 6,
    recoilPitch: 0.55, recoilYaw: 0.3, armorPen: 0.47, moveSpeed: 6.1,
    scoped: false, zoomFov: 75, price: 200, killReward: 300, range: 120, pellets: 1,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 32, rpm: 352, mag: 12, reserve: 24, reloadTime: 2.2, auto: false,
    spreadBase: 0.5, spreadMove: 1.6, bloomPerShot: 0.38, bloomMax: 2.2, bloomRecover: 6,
    recoilPitch: 0.5, recoilYaw: 0.24, armorPen: 0.5, moveSpeed: 6.1,
    scoped: false, zoomFov: 75, price: 200, killReward: 300, range: 120, pellets: 1,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 45, rpm: 267, mag: 7, reserve: 35, reloadTime: 2.2, auto: false,
    spreadBase: 0.7, spreadMove: 2.6, bloomPerShot: 0.9, bloomMax: 3.5, bloomRecover: 5,
    recoilPitch: 1.4, recoilYaw: 0.5, armorPen: 0.93, moveSpeed: 6.0,
    scoped: false, zoomFov: 75, price: 700, killReward: 300, range: 150, pellets: 1,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 40, rpm: 120, mag: 1, reserve: 0, reloadTime: 0, auto: false,
    spreadBase: 0, spreadMove: 0, bloomPerShot: 0, bloomMax: 0, bloomRecover: 0,
    recoilPitch: 0, recoilYaw: 0, armorPen: 0.85, moveSpeed: 6.4,
    scoped: false, zoomFov: 75, price: 0, killReward: 1500, range: 2.2, pellets: 1,
  },
};

export function makeWeapon(id: WeaponId): WeaponState {
  const d = WEAPONS[id];
  return {
    id, ammo: d.mag, reserve: d.reserve, reloading: false, reloadT: 0,
    nextFire: 0, spray: 0, lastShot: -10, bloom: 0,
  };
}

export function fireInterval(id: WeaponId): number {
  return 60 / WEAPONS[id].rpm;
}

export function defaultSecondary(team: 'CT' | 'T'): WeaponId {
  return team === 'CT' ? 'usp' : 'glock';
}

export function slotWeapon(inv: { primary: WeaponState | null; secondary: WeaponState; melee: WeaponState }, slot: Slot): WeaponState | null {
  if (slot === 'primary') return inv.primary;
  if (slot === 'secondary') return inv.secondary;
  return inv.melee;
}

export function bestSlot(inv: { primary: WeaponState | null; secondary: WeaponState; melee: WeaponState }): Slot {
  if (inv.primary) return 'primary';
  return 'secondary';
}

// Armor-aware damage. Head ignores armor (helmet cosmetic) so headshot stays 2x body.
export function computeDamage(def: WeaponDef, region: 'head' | 'chest' | 'stomach' | 'arm' | 'leg', armor: number): { hp: number; armorLost: number } {
  const mult =
    region === 'head' ? CFG.headMult :
    region === 'chest' ? CFG.chestMult :
    region === 'stomach' ? CFG.stomachMult :
    region === 'arm' ? CFG.armMult : CFG.legMult;
  let dmg = def.damage * mult;
  let armorLost = 0;
  if (region !== 'head' && armor > 0) {
    const absorbed = dmg * CFG.armorAbsorb * (1 - def.armorPen);
    armorLost = Math.min(armor, absorbed * CFG.armorDamageFactor);
    dmg -= absorbed;
  }
  return { hp: Math.max(0, dmg), armorLost };
}

export const BUY_ITEMS: { id: WeaponId | 'kevlar' | 'helmet' | 'kit'; label: string; price: number; kind: 'weapon' | 'gear' }[] = [
  { id: 'glock', label: 'Glock-18', price: 200, kind: 'weapon' },
  { id: 'usp', label: 'USP-S', price: 200, kind: 'weapon' },
  { id: 'deagle', label: 'Desert Eagle', price: 700, kind: 'weapon' },
  { id: 'ak47', label: 'AK-47', price: 2700, kind: 'weapon' },
  { id: 'm4a4', label: 'M4A4', price: 3100, kind: 'weapon' },
  { id: 'awp', label: 'AWP', price: 4750, kind: 'weapon' },
  { id: 'kevlar', label: 'Kevlar Vest', price: 650, kind: 'gear' },
  { id: 'helmet', label: 'Kevlar + Helmet', price: 1000, kind: 'gear' },
  { id: 'kit', label: 'Defuse Kit (CT)', price: 400, kind: 'gear' },
];

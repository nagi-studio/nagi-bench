import type { WeaponDef, WeaponId, Slot } from './types';

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary', damage: 36, headMult: 2,
    fireInterval: 0.1, magSize: 30, reloadTime: 2.4, reserve: 90,
    spreadBase: 0.004, spreadPerShot: 0.014, spreadMax: 0.085, spreadDecay: 0.5,
    recoilPitch: 0.028, recoilRandom: 0.02, auto: true, zoom: 1, scope: false,
    range: 100, pen: 0.7, price: 2700, rpm: 600, switchTime: 1.0,
    moveSpeedMult: 0.95, bullets: 1, tracer: true,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary', damage: 33, headMult: 2,
    fireInterval: 0.09, magSize: 30, reloadTime: 2.1, reserve: 90,
    spreadBase: 0.003, spreadPerShot: 0.008, spreadMax: 0.05, spreadDecay: 0.6,
    recoilPitch: 0.012, recoilRandom: 0.008, auto: true, zoom: 1, scope: false,
    range: 100, pen: 0.7, price: 3100, rpm: 667, switchTime: 0.85,
    moveSpeedMult: 0.97, bullets: 1, tracer: true,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary', damage: 115, headMult: 2,
    fireInterval: 1.55, magSize: 5, reloadTime: 3.7, reserve: 30,
    spreadBase: 0.0004, spreadPerShot: 0.02, spreadMax: 0.02, spreadDecay: 0.4,
    recoilPitch: 0.06, recoilRandom: 0.02, auto: false, zoom: 4, scope: true,
    range: 200, pen: 0.95, price: 4750, rpm: 39, switchTime: 1.2,
    moveSpeedMult: 0.6, bullets: 1, tracer: true,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary', damage: 28, headMult: 2,
    fireInterval: 0.14, magSize: 20, reloadTime: 2.2, reserve: 120,
    spreadBase: 0.008, spreadPerShot: 0.01, spreadMax: 0.055, spreadDecay: 0.7,
    recoilPitch: 0.012, recoilRandom: 0.01, auto: false, zoom: 1, scope: false,
    range: 60, pen: 0.45, price: 200, rpm: 400, switchTime: 0.55,
    moveSpeedMult: 1.0, bullets: 1, tracer: true,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary', damage: 35, headMult: 2,
    fireInterval: 0.17, magSize: 12, reloadTime: 2.1, reserve: 48,
    spreadBase: 0.006, spreadPerShot: 0.008, spreadMax: 0.045, spreadDecay: 0.75,
    recoilPitch: 0.014, recoilRandom: 0.008, auto: false, zoom: 1, scope: false,
    range: 70, pen: 0.5, price: 200, rpm: 352, switchTime: 0.55,
    moveSpeedMult: 1.0, bullets: 1, tracer: true,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 53, headMult: 2,
    fireInterval: 0.25, magSize: 7, reloadTime: 2.4, reserve: 35,
    spreadBase: 0.01, spreadPerShot: 0.03, spreadMax: 0.09, spreadDecay: 0.55,
    recoilPitch: 0.035, recoilRandom: 0.018, auto: false, zoom: 1, scope: false,
    range: 90, pen: 0.8, price: 700, rpm: 240, switchTime: 0.6,
    moveSpeedMult: 1.0, bullets: 1, tracer: true,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee', damage: 55, headMult: 2,
    fireInterval: 0.4, magSize: Infinity, reloadTime: 0.01, reserve: Infinity,
    spreadBase: 0, spreadPerShot: 0, spreadMax: 0, spreadDecay: 0,
    recoilPitch: 0, recoilRandom: 0, auto: false, zoom: 1, scope: false,
    range: 1.9, pen: 1, price: 0, rpm: 150, switchTime: 0.25,
    moveSpeedMult: 1.05, bullets: 1, tracer: false,
  },
};

export function slotOf(id: WeaponId): Slot {
  return WEAPONS[id].slot;
}

// 默认负载：T 带 AK 或手枪局只有 Glock；CT 带 M4A4 或手枪局只有 USP
export function defaultLoadout(team: 0 | 1, pistolRound: boolean): WeaponId[] {
  if (pistolRound) {
    return team === 1 ? ['glock', 'knife'] : ['usp', 'knife'];
  }
  return team === 1 ? ['ak47', 'glock', 'knife'] : ['m4a4', 'usp', 'knife'];
}

// 手枪局可捡起 AWP 等（用 key 切换购买——简化：开局按数字 5 切换主武器模式）
export const PISTOL_ONLY_IDS: WeaponId[] = ['glock', 'usp', 'deagle'];

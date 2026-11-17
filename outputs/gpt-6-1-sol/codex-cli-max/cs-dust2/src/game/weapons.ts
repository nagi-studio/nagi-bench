import type { HitZone, Slot, WeaponId } from "./types";

export interface WeaponDefinition {
  id: WeaponId;
  name: string;
  label: string;
  slot: Slot;
  damage: number;
  interval: number;
  magazine: number;
  reserve: number;
  reload: number;
  recoil: number;
  spread: number;
  armorPenetration: number;
  range: number;
  automatic: boolean;
  speed: number;
  color: string;
  description: string;
}

export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  ak47: {
    id: "ak47",
    name: "AK-47",
    label: "突击步枪",
    slot: "primary",
    damage: 42,
    interval: 0.105,
    magazine: 30,
    reserve: 90,
    reload: 2.35,
    recoil: 0.039,
    spread: 0.0045,
    armorPenetration: 0.76,
    range: 115,
    automatic: true,
    speed: 4.8,
    color: "#c49b60",
    description: "高伤害 · 强劲后坐力",
  },
  m4a4: {
    id: "m4a4",
    name: "M4A4",
    label: "突击步枪",
    slot: "primary",
    damage: 36,
    interval: 0.083,
    magazine: 30,
    reserve: 90,
    reload: 2.15,
    recoil: 0.019,
    spread: 0.0028,
    armorPenetration: 0.72,
    range: 110,
    automatic: true,
    speed: 4.9,
    color: "#9ebcaa",
    description: "高射速 · 稳定控制",
  },
  awp: {
    id: "awp",
    name: "AWP",
    label: "狙击步枪",
    slot: "primary",
    damage: 145,
    interval: 1.55,
    magazine: 5,
    reserve: 25,
    reload: 3.1,
    recoil: 0.082,
    spread: 0.026,
    armorPenetration: 0.9,
    range: 160,
    automatic: false,
    speed: 4.1,
    color: "#adba82",
    description: "致命单发 · 右键开镜",
  },
  glock: {
    id: "glock",
    name: "Glock-18",
    label: "半自动手枪",
    slot: "secondary",
    damage: 21,
    interval: 0.18,
    magazine: 20,
    reserve: 100,
    reload: 1.8,
    recoil: 0.016,
    spread: 0.0055,
    armorPenetration: 0.5,
    range: 70,
    automatic: false,
    speed: 5.25,
    color: "#c8b699",
    description: "T 默认 · 20 发弹匣",
  },
  usp: {
    id: "usp",
    name: "USP-S",
    label: "消音手枪",
    slot: "secondary",
    damage: 24,
    interval: 0.205,
    magazine: 12,
    reserve: 72,
    reload: 1.9,
    recoil: 0.014,
    spread: 0.0035,
    armorPenetration: 0.55,
    range: 75,
    automatic: false,
    speed: 5.25,
    color: "#a9b7b4",
    description: "CT 默认 · 精准消音",
  },
  deagle: {
    id: "deagle",
    name: "Desert Eagle",
    label: "大口径手枪",
    slot: "secondary",
    damage: 32,
    interval: 0.36,
    magazine: 7,
    reserve: 35,
    reload: 2.15,
    recoil: 0.044,
    spread: 0.004,
    armorPenetration: 0.8,
    range: 90,
    automatic: false,
    speed: 5.1,
    color: "#d2cbc0",
    description: "高单发伤害 · 7 发弹匣",
  },
  knife: {
    id: "knife",
    name: "战术匕首",
    label: "近战武器",
    slot: "melee",
    damage: 48,
    interval: 0.48,
    magazine: 0,
    reserve: 0,
    reload: 0,
    recoil: 0.012,
    spread: 0,
    armorPenetration: 0.85,
    range: 2.5,
    automatic: false,
    speed: 6.1,
    color: "#c7ceca",
    description: "快速移动 · 近身突刺",
  },
};

export const HIT_MULTIPLIERS: Record<HitZone, number> = {
  head: 2,
  chest: 1,
  abdomen: 1.12,
  arm: 0.72,
  leg: 0.62,
};
export const weaponOf = (a: {
  loadout: Partial<Record<Slot, WeaponId>>;
  slot: Slot;
}) => a.loadout[a.slot] ?? a.loadout.secondary ?? "knife";

export function damageFor(
  weapon: WeaponId,
  zone: HitZone,
  armor: number,
  distance: number,
) {
  const w = WEAPONS[weapon];
  const raw =
    w.damage *
    HIT_MULTIPLIERS[zone] *
    (weapon === "knife" ? 1 : Math.max(0.78, 1 - (distance / w.range) * 0.15));
  const absorbed =
    zone === "leg" ? 0 : Math.min(armor * 2, raw * (1 - w.armorPenetration));
  return { health: Math.round(raw - absorbed), armor: Math.ceil(absorbed / 2) };
}

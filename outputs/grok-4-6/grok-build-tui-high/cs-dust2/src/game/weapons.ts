import type { WeaponDef, WeaponId, WeaponState, HitPart } from "./types";

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: "ak47",
    name: "AK-47",
    slot: "primary",
    damage: 36,
    headMul: 2,
    chestMul: 1,
    stomachMul: 0.9,
    armMul: 0.75,
    legMul: 0.7,
    armorPen: 0.77,
    rpm: 600,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.4,
    spread: 0.012,
    moveSpread: 0.045,
    recoilPitch: 0.042,
    recoilYaw: 0.018,
    recoilKick: 1.35,
    range: 120,
    isAuto: true,
    isSniper: false,
    melee: false,
    meleeRange: 0,
    color: 0x3a3328,
  },
  m4a4: {
    id: "m4a4",
    name: "M4A4",
    slot: "primary",
    damage: 31,
    headMul: 2,
    chestMul: 1,
    stomachMul: 0.9,
    armMul: 0.75,
    legMul: 0.7,
    armorPen: 0.7,
    rpm: 666,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.1,
    spread: 0.008,
    moveSpread: 0.03,
    recoilPitch: 0.022,
    recoilYaw: 0.008,
    recoilKick: 0.72,
    range: 120,
    isAuto: true,
    isSniper: false,
    melee: false,
    meleeRange: 0,
    color: 0x2a2e28,
  },
  awp: {
    id: "awp",
    name: "AWP",
    slot: "primary",
    damage: 115,
    headMul: 2,
    chestMul: 1,
    stomachMul: 1,
    armMul: 0.85,
    legMul: 0.75,
    armorPen: 0.97,
    rpm: 41,
    magSize: 10,
    reserve: 30,
    reloadTime: 3.7,
    spread: 0.002,
    moveSpread: 0.08,
    recoilPitch: 0.08,
    recoilYaw: 0.01,
    recoilKick: 2.2,
    range: 200,
    isAuto: false,
    isSniper: true,
    melee: false,
    meleeRange: 0,
    color: 0x1a2420,
  },
  glock: {
    id: "glock",
    name: "Glock-18",
    slot: "secondary",
    damage: 26,
    headMul: 2,
    chestMul: 1,
    stomachMul: 0.9,
    armMul: 0.7,
    legMul: 0.65,
    armorPen: 0.47,
    rpm: 400,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    spread: 0.018,
    moveSpread: 0.04,
    recoilPitch: 0.02,
    recoilYaw: 0.01,
    recoilKick: 0.55,
    range: 70,
    isAuto: false,
    isSniper: false,
    melee: false,
    meleeRange: 0,
    color: 0x4a4a48,
  },
  usp: {
    id: "usp",
    name: "USP-S",
    slot: "secondary",
    damage: 33,
    headMul: 2,
    chestMul: 1,
    stomachMul: 0.9,
    armMul: 0.7,
    legMul: 0.65,
    armorPen: 0.5,
    rpm: 352,
    magSize: 12,
    reserve: 24,
    reloadTime: 2.2,
    spread: 0.012,
    moveSpread: 0.035,
    recoilPitch: 0.016,
    recoilYaw: 0.008,
    recoilKick: 0.48,
    range: 75,
    isAuto: false,
    isSniper: false,
    melee: false,
    meleeRange: 0,
    color: 0x3a3e42,
  },
  deagle: {
    id: "deagle",
    name: "Desert Eagle",
    slot: "secondary",
    damage: 53,
    headMul: 2,
    chestMul: 1,
    stomachMul: 0.95,
    armMul: 0.8,
    legMul: 0.7,
    armorPen: 0.93,
    rpm: 267,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    spread: 0.02,
    moveSpread: 0.07,
    recoilPitch: 0.055,
    recoilYaw: 0.02,
    recoilKick: 1.6,
    range: 90,
    isAuto: false,
    isSniper: false,
    melee: false,
    meleeRange: 0,
    color: 0x6a5a30,
  },
  knife: {
    id: "knife",
    name: "Knife",
    slot: "melee",
    damage: 55,
    headMul: 1.2,
    chestMul: 1,
    stomachMul: 1,
    armMul: 0.8,
    legMul: 0.7,
    armorPen: 0.85,
    rpm: 120,
    magSize: 1,
    reserve: 0,
    reloadTime: 0,
    spread: 0,
    moveSpread: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilKick: 0.2,
    range: 2.1,
    isAuto: false,
    isSniper: false,
    melee: true,
    meleeRange: 2.1,
    color: 0x889099,
  },
};

export function makeWeapon(id: WeaponId): WeaponState {
  const d = WEAPONS[id];
  return {
    id,
    mag: d.magSize,
    reserve: d.reserve,
    nextFire: 0,
    reloading: false,
    reloadEnd: 0,
  };
}

export function hitMultiplier(def: WeaponDef, part: HitPart): number {
  switch (part) {
    case "head":
      return def.headMul;
    case "chest":
      return def.chestMul;
    case "stomach":
      return def.stomachMul;
    case "arm":
      return def.armMul;
    case "leg":
      return def.legMul;
  }
}

export function applyArmor(
  raw: number,
  part: HitPart,
  armor: number,
  helmet: boolean,
  pen: number
): { hp: number; armorLost: number } {
  if (raw <= 0) return { hp: 0, armorLost: 0 };
  if (part === "head") {
    if (!helmet) return { hp: raw, armorLost: 0 };
    const absorbed = raw * (1 - pen) * 0.55;
    return { hp: Math.max(1, raw - absorbed), armorLost: Math.min(armor, 15) };
  }
  if (part === "leg") return { hp: raw, armorLost: 0 };
  if (armor <= 0) return { hp: raw, armorLost: 0 };
  const reduction = (1 - pen) * 0.55;
  const absorbed = raw * reduction;
  const armorLost = Math.min(armor, Math.max(5, absorbed * 0.65));
  return { hp: Math.max(1, raw - absorbed), armorLost };
}
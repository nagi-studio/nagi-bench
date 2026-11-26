import { HitboxZone, WeaponConfig, WeaponId } from './types';

/**
 * Hitbox zone damage multipliers:
 * - Headshot is strictly 2.0x body (chest) damage.
 * - Every zone (head / chest / stomach / arm / leg) has a distinct multiplier.
 */
export const HITBOX_MULTIPLIERS: Record<HitboxZone, number> = {
  head: 2.0,
  stomach: 1.2,
  chest: 1.0,
  arm: 0.8,
  leg: 0.75,
};

export const HITBOX_LABELS: Record<HitboxZone, string> = {
  head: '爆头',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    shortName: 'AK-47',
    slot: 'primary',
    price: 2700,
    baseDamage: 48,
    armorPenetration: 0.78,
    fireInterval: 0.1, // 600 RPM
    automatic: true,
    magSize: 30,
    reserveMax: 90,
    reloadTime: 2.4,
    moveSpeedMultiplier: 0.88,
    baseSpread: 0.004,
    moveSpread: 0.042,
    recoilSpreadPerShot: 0.017,
    maxSpread: 0.1,
    recoilPitch: 0.036,
    recoilYaw: 0.016,
    range: 140,
    killReward: 300,
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    shortName: 'M4A4',
    slot: 'primary',
    price: 3100,
    baseDamage: 38,
    armorPenetration: 0.72,
    fireInterval: 0.088, // 682 RPM
    automatic: true,
    magSize: 30,
    reserveMax: 90,
    reloadTime: 2.15,
    moveSpeedMultiplier: 0.9,
    baseSpread: 0.003,
    moveSpread: 0.032,
    recoilSpreadPerShot: 0.009,
    maxSpread: 0.056,
    recoilPitch: 0.017,
    recoilYaw: 0.007,
    range: 140,
    killReward: 300,
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    shortName: 'AWP',
    slot: 'primary',
    price: 4750,
    baseDamage: 120,
    armorPenetration: 0.96,
    fireInterval: 1.48, // Slow bolt-action
    automatic: false,
    magSize: 5,
    reserveMax: 30,
    reloadTime: 3.1,
    moveSpeedMultiplier: 0.8,
    baseSpread: 0.052, // Unscoped noscope inaccuracy; scoped uses 0.0006
    moveSpread: 0.065,
    recoilSpreadPerShot: 0.05,
    maxSpread: 0.12,
    recoilPitch: 0.075,
    recoilYaw: 0.012,
    range: 200,
    canScope: true,
    killReward: 100,
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    shortName: 'Glock',
    slot: 'secondary',
    price: 200,
    baseDamage: 28,
    armorPenetration: 0.5,
    fireInterval: 0.15,
    automatic: false,
    magSize: 20,
    reserveMax: 120,
    reloadTime: 1.95,
    moveSpeedMultiplier: 0.97,
    baseSpread: 0.007,
    moveSpread: 0.022,
    recoilSpreadPerShot: 0.011,
    maxSpread: 0.055,
    recoilPitch: 0.014,
    recoilYaw: 0.006,
    range: 95,
    killReward: 300,
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    shortName: 'USP-S',
    slot: 'secondary',
    price: 200,
    baseDamage: 35,
    armorPenetration: 0.54,
    fireInterval: 0.17,
    automatic: false,
    magSize: 12,
    reserveMax: 24,
    reloadTime: 2.05,
    moveSpeedMultiplier: 0.97,
    baseSpread: 0.0045,
    moveSpread: 0.024,
    recoilSpreadPerShot: 0.011,
    maxSpread: 0.05,
    recoilPitch: 0.015,
    recoilYaw: 0.005,
    range: 105,
    suppressed: true,
    killReward: 300,
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    shortName: '沙鹰',
    slot: 'secondary',
    price: 700,
    baseDamage: 56,
    armorPenetration: 0.91,
    fireInterval: 0.24,
    automatic: false,
    magSize: 7,
    reserveMax: 35,
    reloadTime: 2.2,
    moveSpeedMultiplier: 0.94,
    baseSpread: 0.005,
    moveSpread: 0.044,
    recoilSpreadPerShot: 0.032,
    maxSpread: 0.095,
    recoilPitch: 0.045,
    recoilYaw: 0.016,
    range: 120,
    killReward: 300,
  },
  knife: {
    id: 'knife',
    name: '战术匕首',
    shortName: '刀',
    slot: 'melee',
    price: 0,
    baseDamage: 35,
    heavyDamage: 65,
    armorPenetration: 0.85,
    fireInterval: 0.42,
    heavyInterval: 0.85,
    automatic: false,
    magSize: 0,
    reserveMax: 0,
    reloadTime: 0,
    moveSpeedMultiplier: 1.08,
    baseSpread: 0,
    moveSpread: 0,
    recoilSpreadPerShot: 0,
    maxSpread: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    range: 2.55,
    isMelee: true,
    killReward: 1500,
  },
  c4: {
    id: 'c4',
    name: 'C4 炸弹',
    shortName: 'C4',
    slot: 'c4',
    price: 0,
    baseDamage: 0,
    armorPenetration: 0,
    fireInterval: 0.5,
    automatic: false,
    magSize: 0,
    reserveMax: 0,
    reloadTime: 0,
    moveSpeedMultiplier: 1.04,
    baseSpread: 0,
    moveSpread: 0,
    recoilSpreadPerShot: 0,
    maxSpread: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    range: 0,
    isUtility: true,
    killReward: 0,
  },
};

export interface DamageResult {
  hpDamage: number;
  armorDamage: number;
  rawDamage: number;
  zone: HitboxZone;
  armorMitigated: boolean;
}

/**
 * Computes exact hitbox & armor mitigated damage.
 * - Headshot multiplier is strictly 2.0x body (chest).
 * - Armor mitigates chest, stomach, arm, and head (when helmet is equipped). Legs are unarmored.
 */
export function calculateHitDamage(
  weapon: WeaponConfig,
  zone: HitboxZone,
  targetArmor: number,
  targetHasHelmet: boolean,
  distance: number,
  overrideBaseDamage?: number
): DamageResult {
  const base = overrideBaseDamage ?? weapon.baseDamage;
  // Mild realistic distance falloff (minimal for AWP, slightly more for pistols)
  const falloffRate =
    weapon.id === 'awp'
      ? 0.001
      : weapon.slot === 'primary'
      ? 0.003
      : weapon.slot === 'secondary'
      ? 0.0065
      : 0;
  const distFactor = Math.max(0.55, 1 - Math.max(0, distance - 12) * falloffRate);

  const rawDamage = base * HITBOX_MULTIPLIERS[zone] * distFactor;

  const isArmoredZone =
    targetArmor > 0 &&
    (zone === 'chest' ||
      zone === 'stomach' ||
      zone === 'arm' ||
      (zone === 'head' && targetHasHelmet));

  if (isArmoredZone) {
    const mitigated = rawDamage * weapon.armorPenetration;
    const absorbed = rawDamage - mitigated;
    const armorDamage = Math.min(targetArmor, Math.max(1, Math.round(absorbed * 0.55)));
    return {
      hpDamage: Math.max(1, Math.round(mitigated)),
      armorDamage,
      rawDamage: Math.round(rawDamage),
      zone,
      armorMitigated: true,
    };
  }

  return {
    hpDamage: Math.max(1, Math.round(rawDamage)),
    armorDamage: 0,
    rawDamage: Math.round(rawDamage),
    zone,
    armorMitigated: false,
  };
}

export function getDefaultPistolForTeam(team: 'CT' | 'T'): WeaponId {
  return team === 'CT' ? 'usp' : 'glock';
}

export function getDefaultRifleForTeam(team: 'CT' | 'T'): WeaponId {
  return team === 'CT' ? 'm4a4' : 'ak47';
}

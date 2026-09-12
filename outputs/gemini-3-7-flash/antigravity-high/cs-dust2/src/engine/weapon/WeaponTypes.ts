export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';

export type WeaponSlot = 'primary' | 'secondary' | 'melee' | 'bomb';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  price: number;
  damage: number; // Base body damage
  headshotMultiplier: number;
  armorPenetration: number; // 0.0 to 1.0 (how much damage ignores armor)
  fireRate: number; // Seconds per shot
  magazineSize: number;
  maxReserveAmmo: number;
  reloadTime: number; // Seconds
  recoilClimb: number; // Vertical kick
  recoilSpread: number; // Horizontal spread
  recoilRecovery: number; // Rate of recoil recovery
  spreadMovingPenalty: number;
  scopedFov?: number; // For AWP
  killReward: number;
  isAutomatic: boolean;
  teamExclusive?: 'CT' | 'T';
}

export const WEAPON_REGISTRY: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    price: 2700,
    damage: 36,
    headshotMultiplier: 4.0, // 144 damage -> 1-tap headshot kill through helmet
    armorPenetration: 0.775,
    fireRate: 0.1, // 600 RPM
    magazineSize: 30,
    maxReserveAmmo: 90,
    reloadTime: 2.4,
    recoilClimb: 0.045, // Heavy kick
    recoilSpread: 0.025,
    recoilRecovery: 4.5,
    spreadMovingPenalty: 0.04,
    killReward: 300,
    isAutomatic: true,
    teamExclusive: 'T'
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    price: 2900,
    damage: 33,
    headshotMultiplier: 4.0, // 132 raw -> ~92 with helmet
    armorPenetration: 0.70,
    fireRate: 0.09, // 666 RPM
    magazineSize: 30,
    maxReserveAmmo: 90,
    reloadTime: 2.2,
    recoilClimb: 0.032, // Controlled kick
    recoilSpread: 0.015,
    recoilRecovery: 5.2,
    spreadMovingPenalty: 0.03,
    killReward: 300,
    isAutomatic: true,
    teamExclusive: 'CT'
  },
  awp: {
    id: 'awp',
    name: 'AWP Sniper',
    slot: 'primary',
    price: 4750,
    damage: 115, // 1-shot body/chest kill
    headshotMultiplier: 4.0,
    armorPenetration: 0.975,
    fireRate: 1.4, // Bolt action
    magazineSize: 5,
    maxReserveAmmo: 30,
    reloadTime: 3.2,
    recoilClimb: 0.12,
    recoilSpread: 0.01,
    recoilRecovery: 3.0,
    spreadMovingPenalty: 0.15, // Blurry when running
    scopedFov: 20, // 4x optical zoom
    killReward: 100,
    isAutomatic: false
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    price: 200,
    damage: 28,
    headshotMultiplier: 4.0,
    armorPenetration: 0.47,
    fireRate: 0.15,
    magazineSize: 20,
    maxReserveAmmo: 120,
    reloadTime: 1.9,
    recoilClimb: 0.018,
    recoilSpread: 0.012,
    recoilRecovery: 6.0,
    spreadMovingPenalty: 0.015, // Good running accuracy
    killReward: 300,
    isAutomatic: false,
    teamExclusive: 'T'
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    price: 200,
    damage: 35,
    headshotMultiplier: 4.0,
    armorPenetration: 0.505,
    fireRate: 0.17,
    magazineSize: 12,
    maxReserveAmmo: 24,
    reloadTime: 2.0,
    recoilClimb: 0.02,
    recoilSpread: 0.008, // Laser precision
    recoilRecovery: 6.5,
    spreadMovingPenalty: 0.02,
    killReward: 300,
    isAutomatic: false,
    teamExclusive: 'CT'
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    price: 700,
    damage: 63, // 2-shot body kill, 1-tap headshot
    headshotMultiplier: 4.0,
    armorPenetration: 0.85,
    fireRate: 0.25,
    magazineSize: 7,
    maxReserveAmmo: 35,
    reloadTime: 2.2,
    recoilClimb: 0.08, // Massive hand cannon kick
    recoilSpread: 0.04,
    recoilRecovery: 3.2,
    spreadMovingPenalty: 0.08,
    killReward: 300,
    isAutomatic: false
  },
  knife: {
    id: 'knife',
    name: 'Tactical Knife',
    slot: 'melee',
    price: 0,
    damage: 40, // 55 backstab
    headshotMultiplier: 1.0,
    armorPenetration: 0.85,
    fireRate: 0.4,
    magazineSize: 1,
    maxReserveAmmo: 0,
    reloadTime: 0,
    recoilClimb: 0,
    recoilSpread: 0,
    recoilRecovery: 10,
    spreadMovingPenalty: 0,
    killReward: 1500,
    isAutomatic: false
  },
  c4: {
    id: 'c4',
    name: 'C4 Explosive',
    slot: 'bomb',
    price: 0,
    damage: 500,
    headshotMultiplier: 1.0,
    armorPenetration: 1.0,
    fireRate: 1.0,
    magazineSize: 1,
    maxReserveAmmo: 0,
    reloadTime: 0,
    recoilClimb: 0,
    recoilSpread: 0,
    recoilRecovery: 10,
    spreadMovingPenalty: 0,
    killReward: 300,
    isAutomatic: false,
    teamExclusive: 'T'
  }
};

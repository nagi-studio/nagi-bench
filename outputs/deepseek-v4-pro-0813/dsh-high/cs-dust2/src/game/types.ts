export type Team = 'T' | 'CT';
export type WeaponSlot = 'primary' | 'secondary' | 'knife';
export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface Vec2 {
  x: number;
  z: number;
}

export interface WeaponDef {
  id: string;
  name: string;
  slot: WeaponSlot;
  /** base damage against an unarmored body hit */
  damage: number;
  /** seconds between shots */
  fireInterval: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  /** base spread in radians (cone half-angle) */
  spreadBase: number;
  /** max spread reached while spraying / moving */
  spreadMax: number;
  /** spread added per shot */
  spreadPerShot: number;
  /** spread added while moving */
  spreadMove: number;
  /** camera pitch kick per shot (radians) */
  recoilPitch: number;
  /** camera yaw kick per shot (radians, random +/-) */
  recoilYaw: number;
  /** how fast recoil/spread recover (per second multiplier) */
  recoilRecovery: number;
  automatic: boolean;
  scoped: boolean;
  zoomFov: number;
  /** movement speed in units / second */
  moveSpeed: number;
  /** effective range before damage falloff starts */
  range: number;
  /** 0..1 fraction of armor reduction that is ignored (AWP = 1) */
  armorPierce?: number;
  /** category used for sound synthesis */
  soundGroup: 'rifle' | 'smg' | 'sniper' | 'pistol' | 'knife';
}

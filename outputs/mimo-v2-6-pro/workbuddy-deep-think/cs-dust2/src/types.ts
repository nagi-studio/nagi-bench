/** Data-driven weapon table + shared match constants. */

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  kind: 'primary' | 'secondary' | 'melee';
  damage: number;          // base body damage at point blank
  fireDelay: number;       // seconds between shots
  mag: number;
  reload: number;          // seconds
  recoil: number;          // view/crosshair kick per shot
  spread: number;          // radians
  auto: boolean;
  zoom: boolean;           // AWP scope
  armorPen: number;        // 0..1
  range: number;           // falloff start
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47:   { id: 'ak47',   name: 'AK-47',     kind: 'primary',   damage: 34, fireDelay: 0.1,  mag: 30, reload: 2.4, recoil: 0.9,  spread: 0.012, auto: true,  zoom: false, armorPen: 0.72, range: 26 },
  m4a4:   { id: 'm4a4',   name: 'M4A4',      kind: 'primary',   damage: 27, fireDelay: 0.085, mag: 30, reload: 3.0, recoil: 0.55, spread: 0.01,  auto: true,  zoom: false, armorPen: 0.68, range: 28 },
  awp:    { id: 'awp',    name: 'AWP',       kind: 'primary',   damage: 115, fireDelay: 1.45, mag: 10, reload: 3.6, recoil: 1.7,  spread: 0.002, auto: false, zoom: true,  armorPen: 0.95, range: 60 },
  glock:  { id: 'glock',  name: 'Glock-18',  kind: 'secondary', damage: 26, fireDelay: 0.15, mag: 20, reload: 2.1, recoil: 0.5,  spread: 0.018, auto: false, zoom: false, armorPen: 0.42, range: 16 },
  usp:    { id: 'usp',    name: 'USP-S',     kind: 'secondary', damage: 33, fireDelay: 0.17, mag: 12, reload: 2.1, recoil: 0.55, spread: 0.014, auto: false, zoom: false, armorPen: 0.5,  range: 18 },
  deagle: { id: 'deagle', name: 'Desert Eagle', kind: 'secondary', damage: 52, fireDelay: 0.35, mag: 7, reload: 2.3, recoil: 1.15, spread: 0.02, auto: false, zoom: false, armorPen: 0.62, range: 22 },
  knife:  { id: 'knife',  name: 'Knife',     kind: 'melee',     damage: 42, fireDelay: 0.45, mag: 1,  reload: 0,   recoil: 0.2,  spread: 0,     auto: false, zoom: false, armorPen: 0.85, range: 2.2 }
};

export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export const ZONE_MULT: Record<HitZone, number> = {
  head: 2.0, chest: 1.0, stomach: 1.15, arm: 0.85, leg: 0.72
};

export const TEAM = { CT: 0, T: 1 } as const;
export type TeamId = typeof TEAM[keyof typeof TEAM];

export const MATCH = {
  freezeTime: 3,
  roundTime: 115,
  plantTime: 3.2,
  fuseTime: 40,
  defuseTime: 10,
  defuseHelmetTime: 5,
  playersPerTeam: 5
};

export interface PlayerState {
  id: number;
  team: TeamId;
  isHuman: boolean;
  x: number; y: number; z: number;      // z = up
  yaw: number; pitch: number;
  hp: number; armor: number; helmet: boolean;
  alive: boolean;
  weapon: WeaponId;
  ammo: Record<string, number>;
  hasC4: boolean;
  respawnAt: number;
  killCount: number; deathCount: number;
}

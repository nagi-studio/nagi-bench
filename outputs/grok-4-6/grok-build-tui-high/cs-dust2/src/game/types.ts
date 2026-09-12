export type Team = "T" | "CT";
export type HitPart = "head" | "chest" | "stomach" | "arm" | "leg";
export type WeaponSlot = "primary" | "secondary" | "melee";
export type WeaponId =
  | "ak47"
  | "m4a4"
  | "awp"
  | "glock"
  | "usp"
  | "deagle"
  | "knife";

export type GamePhase =
  | "freezetime"
  | "live"
  | "planted"
  | "roundend";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number;
  headMul: number;
  chestMul: number;
  stomachMul: number;
  armMul: number;
  legMul: number;
  armorPen: number;
  rpm: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  spread: number;
  moveSpread: number;
  recoilPitch: number;
  recoilYaw: number;
  recoilKick: number;
  range: number;
  isAuto: boolean;
  isSniper: boolean;
  melee: boolean;
  meleeRange: number;
  color: number;
}

export interface WeaponState {
  id: WeaponId;
  mag: number;
  reserve: number;
  nextFire: number;
  reloading: boolean;
  reloadEnd: number;
}

export interface KillEvent {
  id: number;
  t: number;
  attacker: string;
  victim: string;
  weapon: WeaponId;
  headshot: boolean;
  attackerTeam: Team;
}

export interface MinimapBlip {
  id: string;
  x: number;
  z: number;
  yaw: number;
  team: Team;
  self: boolean;
  bomb: boolean;
  seen: boolean;
}

export interface HudSnapshot {
  hp: number;
  armor: number;
  helmet: boolean;
  alive: boolean;
  team: Team;
  weapon: WeaponId;
  weaponName: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  holdingBomb: boolean;
  bombDropped: boolean;
  bombPlanted: boolean;
  bombTime: number;
  plantProgress: number;
  defuseProgress: number;
  roundTime: number;
  phase: GamePhase;
  freezeLeft: number;
  scoreT: number;
  scoreCT: number;
  round: number;
  pistolRound: boolean;
  killfeed: KillEvent[];
  message: string;
  hint: string;
  spectating: string | null;
  canTakeover: boolean;
  aliveTeammates: { id: string; name: string }[];
  minimap: {
    walls: { x1: number; z1: number; x2: number; z2: number }[];
    floors: { x: number; z: number; w: number; d: number }[];
    sites: { name: "A" | "B"; x: number; z: number; r: number }[];
    blips: MinimapBlip[];
    bomb: { x: number; z: number; carried: boolean } | null;
    yaw: number;
  };
  hitMarker: number;
  damageFlash: number;
  names: { id: string; name: string; team: Team; hp: number; alive: boolean; weapon: WeaponId }[];
}

export interface MatchOptions {
  team: Team;
  pistolRound: boolean;
}
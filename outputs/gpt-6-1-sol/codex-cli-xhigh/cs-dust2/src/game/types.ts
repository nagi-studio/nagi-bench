import type * as THREE from "three";
export type Team = "T" | "CT";
export type WeaponId =
  | "ak47"
  | "m4a4"
  | "awp"
  | "glock"
  | "usp"
  | "deagle"
  | "knife";
export type HitZone = "head" | "chest" | "abdomen" | "arm" | "leg";
export type AIState =
  | "advance"
  | "engage"
  | "plant"
  | "defuse"
  | "recover"
  | "guard";
export interface WeaponDef {
  id: WeaponId;
  name: string;
  short: string;
  slot: 1 | 2 | 3;
  damage: number;
  interval: number;
  magazine: number;
  reserve: number;
  reload: number;
  recoil: number;
  spread: number;
  automatic: boolean;
  range: number;
  penetration: number;
}
export interface Gun {
  id: WeaponId;
  ammo: number;
  reserve: number;
}
export interface Actor {
  id: number;
  name: string;
  team: Team;
  pos: THREE.Vector3;
  yaw: number;
  hp: number;
  armor: number;
  alive: boolean;
  velY: number;
  guns: Gun[];
  slot: 1 | 2 | 3;
  shotAt: number;
  reloadEnd: number;
  kills: number;
  deaths: number;
  model: THREE.Group;
  hitboxes: THREE.Mesh[];
  limbs: THREE.Group[];
  weapon: THREE.Group;
  state: AIState;
  path: { x: number; z: number }[];
  target: number | null;
  thinkAt: number;
  pathAt: number;
  stepAt: number;
  lastSeen: number;
  reactionAt: number;
  objective: { x: number; z: number };
  route: { x: number; z: number }[];
  routeIndex: number;
  action: number;
  moving: boolean;
}
export interface Bomb {
  state: "carried" | "dropped" | "planted" | "defused" | "exploded";
  carrier: number | null;
  x: number;
  z: number;
  time: number;
  progress: number;
  actor: number | null;
  site: string;
}
export interface Kill {
  id: number;
  killer: string;
  victim: string;
  team: Team;
  weapon: WeaponId;
  head: boolean;
  time: number;
}
export interface Settings {
  team: Team;
  pistol: boolean;
  primary: WeaponId;
  secondary: WeaponId;
}
export interface Snapshot {
  phase: "menu" | "playing" | "ended";
  locked: boolean;
  team: Team;
  round: number;
  clock: number;
  score: { T: number; CT: number };
  hp: number;
  armor: number;
  ammo: number;
  reserve: number;
  weapon: WeaponId;
  guns: WeaponId[];
  slot: number;
  reload: number;
  alive: boolean;
  ctAlive: number;
  tAlive: number;
  kills: Kill[];
  bomb: Bomb;
  action: number;
  actionLabel: string;
  location: string;
  spread: number;
  scoped: boolean;
  hit: number;
  headshot: boolean;
  hurt: number;
  winner: Team | null;
  reason: string;
  endTime: number;
  carrier: boolean;
  actors: {
    id: number;
    name: string;
    team: Team;
    x: number;
    z: number;
    yaw: number;
    alive: boolean;
    seen: boolean;
    kills: number;
    deaths: number;
    hp: number;
  }[];
  playerId: number;
  fps: number;
  notice: string;
  elapsed: number;
}

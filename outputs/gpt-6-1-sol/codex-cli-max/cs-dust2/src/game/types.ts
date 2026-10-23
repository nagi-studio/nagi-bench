import type * as THREE from "three";
import type { CharacterModel } from "./models";

export type Team = "T" | "CT";
export type WeaponId =
  | "ak47"
  | "m4a4"
  | "awp"
  | "glock"
  | "usp"
  | "deagle"
  | "knife";
export type Slot = "primary" | "secondary" | "melee";
export type HitZone = "head" | "chest" | "abdomen" | "arm" | "leg";
export type BrainState =
  | "advance"
  | "patrol"
  | "engage"
  | "investigate"
  | "recover"
  | "plant"
  | "defuse"
  | "guard";
export interface Vec2 {
  x: number;
  z: number;
}
export interface Collider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
  kind: "wall" | "crate" | "door" | "roof";
}
export interface Magazine {
  ammo: number;
  reserve: number;
}
export interface Actor {
  id: number;
  name: string;
  team: Team;
  position: THREE.Vector3;
  yaw: number;
  pitch: number;
  velocityY: number;
  grounded: boolean;
  health: number;
  armor: number;
  alive: boolean;
  controlled: boolean;
  loadout: Partial<Record<Slot, WeaponId>>;
  slot: Slot;
  magazines: Partial<Record<WeaponId, Magazine>>;
  cooldown: number;
  reloadTime: number;
  reloadTotal: number;
  heat: number;
  recoil: number;
  kills: number;
  deaths: number;
  model: CharacterModel;
  moving: boolean;
  walkCycle: number;
  stepDistance: number;
  seenUntil: number;
  hasBomb: boolean;
  actionProgress: number;
  brain: {
    state: BrainState;
    targetId: number | null;
    thinkIn: number;
    reaction: number;
    path: Vec2[];
    pathIndex: number;
    repathIn: number;
    goal: Vec2 | null;
    route: Vec2[];
    routeIndex: number;
    lastSeen: Vec2 | null;
    stuckTime: number;
    previous: Vec2;
    burst: number;
    pause: number;
  };
}
export interface MatchConfig {
  team: Team;
  primary: WeaponId;
  secondary: WeaponId;
  pistolStart: boolean;
}
export interface BombState {
  state: "carried" | "dropped" | "planted" | "defused" | "exploded";
  carrierId: number | null;
  position: THREE.Vector3;
  site: "A" | "B" | null;
  timer: number;
  beepIn: number;
  defuserId: number | null;
}
export interface KillEvent {
  id: number;
  killer: string;
  victim: string;
  team: Team;
  weapon: WeaponId;
  headshot: boolean;
  at: number;
  player: boolean;
}
export interface PlayerInfo {
  id: number;
  name: string;
  team: Team;
  health: number;
  armor: number;
  alive: boolean;
  kills: number;
  deaths: number;
  weapon: WeaponId;
  bomb: boolean;
  controlled: boolean;
}
export interface GameSnapshot {
  screen: "menu" | "game";
  locked: boolean;
  phase: "freeze" | "live" | "ended";
  round: number;
  timer: number;
  scoreT: number;
  scoreCT: number;
  aliveT: number;
  aliveCT: number;
  team: Team;
  name: string;
  health: number;
  armor: number;
  alive: boolean;
  spectating: string;
  weapon: WeaponId;
  slot: Slot;
  ammo: number;
  reserve: number;
  reloading: number;
  loadout: Partial<Record<Slot, WeaponId>>;
  scoped: boolean;
  heat: number;
  hitAt: number;
  killAt: number;
  damageAt: number;
  action: string;
  actionProgress: number;
  notice: string;
  noticeUntil: number;
  bombState: BombState["state"];
  bombTimer: number;
  hasBomb: boolean;
  location: string;
  killfeed: KillEvent[];
  roster: PlayerInfo[];
  winner: Team | null;
  winReason: string;
  time: number;
  fps: number;
  muted: boolean;
  pistolRound: boolean;
  armory: boolean;
  scoreboard: boolean;
}

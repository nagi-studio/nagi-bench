import type { Team, WeaponId, WeaponState } from "./types";
import { makeWeapon } from "./weapons";
import type { CharacterRig } from "./render/CharacterMesh";

export interface Actor {
  id: string;
  name: string;
  team: Team;
  bot: boolean;
  controlled: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  yaw: number;
  pitch: number;
  hp: number;
  armor: number;
  helmet: boolean;
  alive: boolean;
  onGround: boolean;
  crouch: boolean;
  weapons: WeaponState[];
  slot: number;
  spread: number;
  recoilP: number;
  recoilY: number;
  hasBomb: boolean;
  plantProg: number;
  defuseProg: number;
  lastShot: number;
  scoped: boolean;
  lastHurt: number;
  targetId: string | null;
  path: number[];
  pathI: number;
  destX: number;
  destZ: number;
  site: "A" | "B" | "mid";
  strafe: number;
  strafeT: number;
  stuckT: number;
  lastX: number;
  lastZ: number;
  visibleToTeam: boolean;
  seenByPlayerTeam: boolean;
  nextPath: number;
  nextShotCheck: number;
  walkPhase: number;
  muzzle: number;
  mesh: CharacterRig;
  weaponId: WeaponId;
}

export function currentWeapon(a: Actor): WeaponState {
  return a.weapons[a.slot] ?? a.weapons[a.weapons.length - 1];
}

export function giveLoadout(team: Team, pistol: boolean, awp: boolean): WeaponState[] {
  const knife = makeWeapon("knife");
  const pistolW = makeWeapon(team === "T" ? "glock" : "usp");
  if (pistol) return [pistolW, makeWeapon("deagle"), knife];
  const primary = makeWeapon(awp ? "awp" : team === "T" ? "ak47" : "m4a4");
  return [primary, pistolW, knife];
}

export const T_NAMES = ["Rebel", "Havoc", "Furia", "Phoenix", "Inferno"];
export const CT_NAMES = ["Seal", "Crash", "Officer", "Guardian", "Sentinel"];
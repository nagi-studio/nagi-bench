export type Team = 'CT' | 'T';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type WeaponId = 'ak47'|'m4a4'|'awp'|'glock'|'usp'|'deagle'|'knife';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: 'primary'|'secondary'|'melee';
  damage: number;
  headMul: number;
  fireRate: number;
  mag: number;
  reserve: number;
  recoil: number;
  spread: number;
  range: number;
  ads?: boolean;
}

export interface PlayerState {
  id: number;
  team: Team;
  pos: {x:number,y:number,z:number};
  yaw: number; pitch:number;
  hp:number; armor:number; alive:boolean;
  weapon: WeaponId; ammo:number; reserve:number;
  hasBomb:boolean;
  isBot:boolean;
}

export interface BombState {
  pos:{x:number,y:number,z:number}|null;
  carrier:number|null;
  planted:boolean;
  plantPos:{x:number,y:number}|null;
  plantTime:number;
  defuseProg:number;
  timer:number;
}

export interface KillEvent { t:number; killer:string; victim:string; weapon:WeaponId; headshot:boolean }

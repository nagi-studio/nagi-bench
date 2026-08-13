export type Team = 'CT' | 'T';

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife';

export type WeaponSlot = 'primary' | 'secondary' | 'melee';

export type HitPart = 'head' | 'chest' | 'stomach' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';

export type PlayerPhase =
  | 'loading'
  | 'menu'
  | 'playing'
  | 'planting'
  | 'defusing'
  | 'roundEnd';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number;
  rpm: number;
  magSize: number;
  reserveMax: number;
  reloadTime: number;
  spreadBase: number;
  spreadMove: number;
  spreadFire: number;
  recoilPitch: number;
  recoilYaw: number;
  auto: boolean;
  pellets: number;
  scoped?: boolean;
  penetration?: number;
  sound: 'rifle' | 'sniper' | 'pistol' | 'deagle' | 'knife';
}

export interface AmmoState {
  mag: number;
  reserve: number;
}

export interface CharacterView {
  id: string;
  team: Team;
  alive: boolean;
  hp: number;
  armor: number;
  x: number;
  z: number;
  yaw: number;
  weapon: WeaponId;
  hasBomb: boolean;
  visibleToPlayer: boolean;
  planting: boolean;
  defusing: boolean;
}

export interface KillfeedItem {
  id: number;
  text: string;
  team: Team | 'system';
  time: number;
}

export interface MinimapEntity {
  id: string;
  team: Team | 'c4';
  x: number;
  z: number;
  visible: boolean;
  hasBomb?: boolean;
}

export interface HudState {
  ready: boolean;
  locked: boolean;
  started: boolean;
  phase: PlayerPhase;
  roundNumber: number;
  scoreCT: number;
  scoreT: number;
  playerTeam: Team;
  playerId: string;
  health: number;
  armor: number;
  weaponId: WeaponId;
  weaponName: string;
  slot: WeaponSlot;
  mag: number;
  reserve: number;
  reloading: boolean;
  fireCooldown: number;
  crosshairSpread: number;
  scopeLevel: number;
  bombPlanted: boolean;
  bombProgress: number;
  bombCarrier: string | null;
  roundTime: number;
  message: string;
  canPlant: boolean;
  canDefuse: boolean;
  buyMenu: boolean;
  roundWinner: Team | null;
  killfeed: KillfeedItem[];
  minimap: MinimapEntity[];
  bombPos: [number, number] | null;
}

export const DEFAULT_HUD_STATE: HudState = {
  ready: false,
  locked: false,
  started: false,
  phase: 'loading',
  roundNumber: 1,
  scoreCT: 0,
  scoreT: 0,
  playerTeam: 'CT',
  playerId: 'ct-0',
  health: 100,
  armor: 0,
  weaponId: 'usp',
  weaponName: 'USP-S',
  slot: 'secondary',
  mag: 12,
  reserve: 24,
  reloading: false,
  fireCooldown: 0,
  crosshairSpread: 0.25,
  scopeLevel: 0,
  bombPlanted: false,
  bombProgress: 0,
  bombCarrier: null,
  roundTime: 115,
  message: '点击画面进入战斗',
  canPlant: false,
  canDefuse: false,
  buyMenu: false,
  roundWinner: null,
  killfeed: [],
  minimap: [],
  bombPos: null,
};

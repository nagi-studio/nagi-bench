export type Team = 'CT' | 'T';

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife'
  | 'c4';

export type WeaponSlot = 'primary' | 'secondary' | 'melee' | 'c4';

export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export type RoundPhase =
  | 'warmup'
  | 'freeze'
  | 'live'
  | 'bomb_planted'
  | 'round_end';

export type GameMode = 'competitive' | 'full_buy';

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  shortName: string;
  slot: WeaponSlot;
  teamRestriction?: Team;
  price: number;
  damage: number; // Base chest damage
  armorPenetration: number; // 0..1 ratio of damage penetrating armor
  fireRate: number; // Rounds per minute
  automatic: boolean;
  magSize: number;
  reserveAmmo: number;
  reloadTime: number; // seconds
  moveSpeedMult: number; // multiplier of base move speed
  baseSpread: number; // radians standing still
  moveSpread: number; // extra radians when running
  jumpSpread: number; // extra radians when airborne
  recoilPitch: number; // radians per shot vertical kick
  recoilYaw: number; // radians per shot horizontal kick amplitude
  recoilSpreadGain: number; // crosshair/bloom increase per shot
  recoilRecovery: number; // recovery rate per second
  range: number; // max effective range in meters
  canScope?: boolean;
  scopeFovs?: number[]; // e.g. [32, 16]
  isMelee?: boolean;
  isBomb?: boolean;
  killReward: number;
}

export interface WeaponInstance {
  id: WeaponId;
  ammoInMag: number;
  reserveAmmo: number;
}

export interface KillFeedEntry {
  id: number;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weaponName: string;
  headshot: boolean;
  timestamp: number;
}

export interface MinimapAgent {
  id: string;
  team: Team;
  x: number;
  z: number;
  yaw: number;
  alive: boolean;
  isPlayer: boolean;
  isSpectated: boolean;
  hasC4: boolean;
  spotted: boolean;
  lastSpottedAlpha: number;
}

export interface MinimapBomb {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  x: number;
  z: number;
  site?: 'A' | 'B';
  visible: boolean;
}

export interface ScoreboardEntry {
  id: string;
  name: string;
  team: Team;
  alive: boolean;
  isHuman: boolean;
  kills: number;
  deaths: number;
  assists: number;
  money: number;
  hp: number;
  hasC4: boolean;
  weaponShort: string;
}

export interface DamageIndicator {
  id: number;
  angle: number; // radians relative to player look direction
  timestamp: number;
}

export interface HudState {
  started: boolean;
  paused: boolean;
  pointerLocked: boolean;
  buyMenuOpen: boolean;
  scoreboardOpen: boolean;

  playerTeam: Team;
  controlledName: string;
  isSpectating: boolean;
  spectateTargetName: string;
  canTakeoverBot: boolean;

  roundNumber: number;
  isPistolRound: boolean;
  roundPhase: RoundPhase;
  phaseTimer: number;
  ctScore: number;
  tScore: number;
  ctAlive: number;
  tAlive: number;
  roundBanner: {
    title: string;
    subtitle: string;
    team?: Team;
  } | null;

  hp: number;
  armor: number;
  hasHelmet: boolean;
  money: number;
  alive: boolean;
  callout: string;

  activeWeapon: WeaponId;
  activeWeaponName: string;
  ammoInMag: number;
  reserveAmmo: number;
  reloading: boolean;
  reloadProgress: number;
  scopeLevel: number; // 0 = unscoped, 1 = zoom1, 2 = zoom2
  crosshairSpread: number; // pixel gap
  slots: {
    primary: WeaponId | null;
    secondary: WeaponId | null;
    melee: WeaponId | null;
    c4: boolean;
  };

  inBuyZone: boolean;
  canBuy: boolean;
  inPlantZone: 'A' | 'B' | null;
  bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  bombPlantedSite: 'A' | 'B' | null;
  bombTimeRemaining: number;
  actionProgress: {
    label: string;
    progress: number; // 0..1
  } | null;
  interactionPrompt: string | null;

  hitMarker: {
    active: boolean;
    headshot: boolean;
    kill: boolean;
    seq: number;
  };
  damageFlash: number; // 0..1
  damageIndicators: DamageIndicator[];
  killFeed: KillFeedEntry[];
  minimapAgents: MinimapAgent[];
  minimapBomb: MinimapBomb;
  scoreboard: ScoreboardEntry[];
  announcement: string | null;
}

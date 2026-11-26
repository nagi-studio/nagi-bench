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

export type RoundPhase = 'freezetime' | 'live' | 'round_end';

export type GameMode = 'standard' | 'pistol_only' | 'full_buy';

export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export type AIState =
  | 'PATROL'
  | 'ADVANCE_SITE'
  | 'PLANT_BOMB'
  | 'DEFEND_BOMB'
  | 'ENGAGE'
  | 'HUNT_BOMB'
  | 'ROTATE_DEFUSE'
  | 'DEFUSE_BOMB'
  | 'HOLD_ANGLE';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  tag?: string;
  material?: 'sandstone' | 'wood' | 'metal' | 'ground' | 'door' | 'crate';
  blocksVision?: boolean;
}

export interface RampBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  yStart: number;
  yEnd: number;
  /** Direction along which elevation increases from yStart to yEnd */
  axis: '+x' | '-x' | '+z' | '-z';
}

export interface BombsiteZone {
  id: 'A' | 'B';
  label: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  center: Vec3;
}

export interface CalloutZone {
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  priority?: number;
}

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  shortName: string;
  slot: WeaponSlot;
  teamRestriction?: Team;
  price: number;
  baseDamage: number;
  armorPenetration: number; // 0..1 (higher = ignores more armor)
  fireInterval: number; // seconds between shots
  automatic: boolean;
  magSize: number;
  reserveMax: number;
  reloadTime: number;
  moveSpeedMultiplier: number;
  /** Base angular spread in radians */
  baseSpread: number;
  /** Additional spread when moving */
  moveSpread: number;
  /** Spread added per shot */
  recoilSpreadPerShot: number;
  /** Max accumulated spread */
  maxSpread: number;
  /** Vertical camera pitch kick in radians per shot */
  recoilPitch: number;
  /** Horizontal yaw kick amplitude in radians */
  recoilYaw: number;
  /** Range in meters */
  range: number;
  /** Sniper scope capability */
  canScope?: boolean;
  /** Secondary attack (knife heavy stab) */
  heavyDamage?: number;
  heavyInterval?: number;
  isMelee?: boolean;
  isUtility?: boolean;
  suppressed?: boolean;
  killReward: number;
}

export interface WeaponAmmoState {
  mag: number;
  reserve: number;
}

export interface KillfeedEntry {
  id: number;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
  timestamp: number;
}

export interface MinimapActor {
  id: string;
  team: Team;
  x: number;
  z: number;
  yaw: number;
  alive: boolean;
  isControlled: boolean;
  hasBomb: boolean;
  visible: boolean;
}

export interface ScoreboardAgent {
  id: string;
  name: string;
  team: Team;
  isHuman: boolean;
  alive: boolean;
  hp: number;
  armor: number;
  hasHelmet: boolean;
  kills: number;
  deaths: number;
  money: number;
  weapon: WeaponId;
  hasBomb: boolean;
}

export interface HudSnapshot {
  started: boolean;
  paused: boolean;
  pointerLocked: boolean;
  buyMenuOpen: boolean;
  scoreboardOpen: boolean;
  gameMode: GameMode;
  playerTeam: Team;
  roundNumber: number;
  isPistolRound: boolean;
  roundPhase: RoundPhase;
  roundTimer: number;
  scoreCT: number;
  scoreT: number;
  roundWinner: Team | null;
  roundWinReason: string;

  // Controlled/Spectated actor state
  controlledId: string;
  controlledName: string;
  isSpectating: boolean;
  canTakeover: boolean;
  alive: boolean;
  hp: number;
  armor: number;
  hasHelmet: boolean;
  money: number;
  callout: string;

  // Weapon state
  activeSlot: WeaponSlot;
  activeWeapon: WeaponId;
  activeWeaponName: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  reloadProgress: number;
  scopeLevel: 0 | 1 | 2;
  crosshairSpread: number;
  slots: {
    primary: WeaponId | null;
    secondary: WeaponId | null;
    melee: WeaponId;
    c4: boolean;
  };

  // Bomb state
  bombState: BombState;
  bombSite: 'A' | 'B' | null;
  bombTimer: number;
  bombPos: Vec3 | null;
  bombVisibleToPlayer: boolean;
  inBombsite: 'A' | 'B' | null;
  canPlant: boolean;
  canDefuse: boolean;
  actionType: 'none' | 'planting' | 'defusing';
  actionProgress: number;

  // Feedback
  hitmarkerTime: number;
  hitmarkerHeadshot: boolean;
  hitmarkerKill: boolean;
  damageIndicatorAngle: number | null;
  damageFlashAlpha: number;
  lastHitZone: HitboxZone | null;
  lastHitDamage: number;
  announcement: string;

  // World rosters
  killfeed: KillfeedEntry[];
  minimapActors: MinimapActor[];
  scoreboard: ScoreboardAgent[];
  ctAliveCount: number;
  tAliveCount: number;
  ctRosterAlive: boolean[];
  tRosterAlive: boolean[];

  // Settings
  sensitivity: number;
  volume: number;
}

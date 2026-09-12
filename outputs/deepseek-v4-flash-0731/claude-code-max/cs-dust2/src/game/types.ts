// 共享类型与常量

export type Team = 0 | 1; // 0 = CT, 1 = T

export const TEAM_CT: Team = 0;
export const TEAM_T: Team = 1;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife';

export type Slot = 'primary' | 'secondary' | 'melee';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  damage: number; // 身体伤害
  headMult: number; // 头部倍率（爆头 = body * headMult）
  fireInterval: number; // 秒 / 发
  magSize: number;
  reloadTime: number;
  reserve: number; // 备弹（初始）
  spreadBase: number; // 基础散布（弧度）
  spreadPerShot: number; // 每发增加散布
  spreadMax: number;
  spreadDecay: number; // 每秒恢复
  recoilPitch: number; // 视角上扬（弧度/发）
  recoilRandom: number;
  auto: boolean; // 是否全自动
  zoom: number; // 开镜倍率（1 = 无）
  scope: boolean; // 是否有瞄准镜（AWP）
  range: number; // 有效射程（米）
  pen: number; // 护甲穿透系数（1 = 完全穿透）
  price: number;
  rpm: number; // 仅展示
  switchTime: number; // 切换到此武器的时间
  moveSpeedMult: number; // 手持时的移动速度倍率
  bullets: number; // 每发子弹数量（霰弹等用，这里统一 1）
  tracer: boolean;
}

export interface HitZone {
  name: string;
  mult: number; // 伤害倍率（头 = headMult，其余 1 或更小）
  armor: boolean; // 是否受护甲保护
}

export interface HitResult {
  target: number; // entity index
  weapon: WeaponId;
  zone: string;
  damage: number; // 最终扣血
  fatal: boolean;
  killer: number;
  victim: number;
}

// 玩家 3D 碰撞体（AABB，x/z 为半宽，y 为全高）
export const PLAYER_RADIUS = 0.38;
export const PLAYER_HEIGHT = 1.82;
export const EYE_HEIGHT = 1.62;

export const GRAVITY = 24;
export const JUMP_SPEED = 8.2;
export const RUN_SPEED = 5.4;
export const WALK_SPEED = 2.6;

export const ROUND_TIME = 110; // 回合秒数
export const PLANT_TIME = 3.4; // 安放时长
export const DEFUSE_TIME = 5.0; // 拆除时长
export const BOMB_FUSE = 40; // 爆炸倒计时

export const MAX_PLAYERS = 10; // 5v5
export const TEAM_SIZE = 5;

export interface KillEvent {
  id: number;
  time: number;
  killer: number;
  victim: number;
  weapon: WeaponId;
  headshot: boolean;
  killerName: string;
  victimName: string;
  weaponName: string;
}

export interface HudState {
  phase: 'intro' | 'freeze' | 'live' | 'over';
  roundNum: number;
  roundTime: number;
  roundTimeMax: number;
  freezeTime: number;
  scoreCT: number;
  scoreT: number;
  lastRoundWinner: Team | -1;
  lastRoundReason: string;
  // 玩家视角实体（可能接管 bot）
  camIndex: number;
  spectating: boolean;
  aliveCT: number;
  aliveT: number;
  playerAlive: boolean;
  // 玩家自身
  hp: number;
  armor: number;
  slot: Slot;
  weapons: { id: WeaponId; name: string; slot: Slot }[];
  ammoMag: number;
  ammoReserve: number;
  reloading: boolean;
  spread: number;
  zooming: boolean;
  hasBomb: boolean;
  bombPlanted: boolean;
  bombTime: number; // 剩余爆炸时间
  plantProgress: number; // -1 = 未在安放/拆除
  defuseProgress: number;
  actionLabel: string;
  weaponName: string;
  killfeed: KillEvent[];
  hitmark: number; // 命中反馈剩余显示时间
  damageFlash: number; // 受击红屏剩余时间
  // 小地图
  minimap: MinimapData;
}

export interface MinimapData {
  // 世界坐标 -> 小地图像素坐标映射由组件完成
  self: { x: number; z: number; yaw: number; alive: boolean };
  allies: { x: number; z: number; alive: boolean }[];
  enemies: { x: number; z: number; alive: boolean }[]; // 仅被看见的
  bomb: { x: number; z: number; state: 'carried' | 'dropped' | 'planted' } | null;
}

export type GameEvent =
  | { type: 'kill'; killer: number; victim: number; weapon: WeaponId; headshot: boolean }
  | { type: 'roundStart'; roundNum: number; pistol: boolean }
  | { type: 'roundEnd'; winner: Team; reason: string }
  | { type: 'plant' }
  | { type: 'defuse' }
  | { type: 'explode' }
  | { type: 'bombDropped' }
  | { type: 'bombPicked' }
  | { type: 'playerTakeover'; index: number }
  | { type: 'hit'; fatal: boolean; headshot: boolean };

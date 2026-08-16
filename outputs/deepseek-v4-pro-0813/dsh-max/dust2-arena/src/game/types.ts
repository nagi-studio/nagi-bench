// ---- 全局共享类型（纯 TS，无 three / DOM 依赖，可在 Node 中验证）----

export type Team = 'T' | 'CT';
export type Slot = 1 | 2 | 3 | 5; // 1 主武器 2 副武器 3 近战 5 C4
export type WeaponId = 'knife' | 'glock' | 'usp' | 'deagle' | 'ak47' | 'm4a4' | 'awp' | 'c4';

export type HitRegion = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  killName: string;
  slot: 1 | 2 | 3 | 4;
  auto: boolean;
  rpm: number;            // 射速 发/分
  mag: number;            // 弹匣容量
  reserve: number;        // 备弹
  damage: number;         // 基础伤害（胸部）
  range: number;          // 近战距离
  recoilPitch: number;    // 每发视角上抬（度）
  recoilYaw: number;      // 每发随机水平抖动（度）
  bloomPerShot: number;   // 每发扩散增量（rad）
  bloomMax: number;
  bloomRecovery: number;  // 扩散恢复 rad/s
  baseSpread: number;     // 静止基础散布（rad）
  moveSpread: number;     // 全速移动散布
  crouchSpreadMul: number;
  reloadTime: number;     // 秒
  deployTime: number;     // 切枪时间
  moveSpeedMul: number;
  zoomFovs: number[];     // 开镜 FOV（空 = 不能开镜）
  zoomOnly: boolean;      // AWP：不开镜无准星、散布极大
  zoomSpread: number;     // 开镜散布
  price: number;
  team: 'T' | 'CT' | 'both';
}

export interface WeaponState {
  def: WeaponDef;
  mag: number;
  reserve: number;
}

export interface Rect { x: number; z: number; w: number; d: number; }

export interface FlatRect extends Rect { h: number; }
export interface RampRect extends Rect { axis: 'x' | 'z'; h0: number; h1: number; }
/** AABB 碰撞体（世界坐标，y 为绝对高度） */
export interface AABB { minX: number; maxX: number; minZ: number; maxZ: number; minY: number; maxY: number; }

export interface NavNode { x: number; z: number; h: number; idx: number; edges: number[]; }

export interface MapData {
  bounds: Rect;
  flats: FlatRect[];
  ramps: RampRect[];
  colliders: AABB[];      // 阻挡移动 / 子弹 / 视线
  doors: AABB[];          // 可被子弹穿过（伤害衰减），阻挡视线，不阻挡移动
  floorBoxes: AABB[];     // 仅阻挡子弹（地板薄片）
  sites: { A: Rect; B: Rect };
  plantSpots: { A: [number, number][]; B: [number, number][] };
  spawns: { T: [number, number][]; CT: [number, number][] };
  waypoints: Record<string, [number, number][]>;
  wallLines: [number, number, number, number][]; // 小地图描边
  crateList: AABB[];      // 渲染用（木箱等，含 y）
}

// ---- 战斗 ----

export const HITBOX_MULT: Record<HitRegion, number> = {
  head: 2.0, chest: 1.0, abdomen: 1.25, arm: 1.0, leg: 0.75,
};

export const ARMOR_ABSORB = 0.5;      // 护甲减伤：伤害减半
export const ARMOR_DRAIN = 0.25;      // 护甲耐久消耗系数
export const DOOR_PEN_MULT = 0.55;    // 穿过一扇门的伤害系数

// ---- 玩家 / 物理 ----

export const EYE_STAND = 1.62;
export const EYE_CROUCH = 1.12;
export const PLAYER_RADIUS = 0.34;
export const MAX_STEP = 0.55;
export const GRAVITY = 15;
export const JUMP_VEL = 4.9;
export const RUN_SPEED = 4.7;
export const WALK_MUL = 0.52;
export const CROUCH_MUL = 0.6;
export const FOV_BASE = 75;

// ---- 回合 ----

export const ROUND_TIME = 115;
export const FREEZE_TIME_FIRST = 8;
export const FREEZE_TIME = 6;
export const ROUND_END_DELAY = 4.2;
export const BOMB_TIMER = 35;
export const PLANT_TIME = 3.0;
export const DEFUSE_TIME = 6.0;
export const MATCH_WIN_ROUNDS = 8;
export const KILL_REWARD = 300;
export const WIN_REWARD = 3250;
export const LOSS_REWARD_BASE = 1400;
export const LOSS_REWARD_STEP = 500;
export const LOSS_REWARD_CAP = 3400;
export const PLANT_REWARD = 300;
export const DEFUSE_REWARD = 300;

export type Phase = 'menu' | 'freeze' | 'live' | 'ended' | 'matchover';

export interface KillfeedEntry {
  id: number;
  time: number;
  killer: string;
  victim: string;
  weapon: string;
  hs: boolean;
}

export interface MinimapPlayer {
  name: string;
  team: Team;
  alive: boolean;
  x: number;
  z: number;
  yaw: number;
  visible: boolean;     // 敌人：最近 2 秒内被队友看见
  isSelf: boolean;
  isSpectate: boolean;
  isCarrier: boolean;
}

export interface HudState {
  version: number;
  phase: Phase;
  phaseTimeLeft: number;
  round: number;
  roundTimeLeft: number;
  bombState: 'none' | 'carried' | 'dropped' | 'planted';
  bombTimer: number;
  bombCarrierTeam: Team | null;
  bombWorld: { x: number; z: number } | null;
  self: {
    team: Team; alive: boolean;
    hp: number; armor: number;
    weaponName: string; slot: number; mag: number; reserve: number;
    hasPrimary: boolean; hasBomb: boolean;
    money: number;
    zoomed: boolean; zoomLevel: number;
    crosshairGap: number;
    reloading: boolean;
  };
  spectating: { name: string; team: Team; hp: number } | null;
  killfeed: KillfeedEntry[];
  scores: { t: number; ct: number };
  banner: { text: string; sub: string } | null;
  players: MinimapPlayer[];
  pistolRound: boolean;
  buyOpen: boolean;
  buyLocked: boolean;
  hitmarker: number;   // timestamp
  damageFlash: number; // timestamp
  damageDir: number;   // 相对视角方向（rad）
  lockHint: boolean;   // 指针未锁定提示
  matchWinner: Team | null;
  defusing: number;    // 拆包进度 0..1
  planting: number;    // 安包进度 0..1
  selfIndex: number;   // 接管对象索引
  scoreboard: boolean; // Tab 记分板
}

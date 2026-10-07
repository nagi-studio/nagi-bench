// 全局常量。单位：米 / 秒 / 弧度。

/** 地图格子边长（米）。整张地图由 COLS x ROWS 个格子描述，见 map/layout.ts */
export const CELL = 2
export const COLS = 52
export const ROWS = 48

export const WALL_HEIGHT = 3.4
export const CRATE_HEIGHT = 1
export const LOW_WALL_HEIGHT = 1

// 物理
export const GRAVITY = 20
export const JUMP_SPEED = 7.2
/** 可直接踏上的台阶高度，高于此值视为墙体 */
export const STEP_HEIGHT = 0.5
export const BODY_RADIUS = 0.4
export const STAND_HEIGHT = 1.8
export const EYE_HEIGHT = 1.62
export const RUN_SPEED = 5.2
export const FIXED_DT = 1 / 120

// AI
export const BRAIN_HZ = 30
/** AI 视角转动上限（rad/s） */
export const TURN_RATE = 9
export const SIGHT_RANGE = 70
export const SIGHT_HALF_FOV = (65 * Math.PI) / 180
export const SPOT_TIME = 1.5

// 伤害
export const ARMOR_ABSORB = 0.5
export const ARMOR_NORMAL = 100
export const ARMOR_PISTOL = 50
/** 命中部位倍率（相对于身体基准伤害）。爆头 = 身体的两倍 */
export const HITGROUP_MULT = {
  head: 2,
  chest: 1,
  stomach: 0.9,
  arms: 0.75,
  legs: 0.7,
} as const

// 回合规则
export const FREEZE_TIME = 3
export const ROUND_TIME = 115
export const ROUND_END_DELAY = 4
export const BOMB_TIMER = 40
export const PLANT_TIME = 3.2
export const DEFUSE_TIME = 5
export const EXPLOSION_RADIUS = 22
export const PICKUP_RADIUS = 1.6
export const WIN_SCORE = 8
export const TEAM_SIZE = 5
export const BANNER_TIME = 2.5

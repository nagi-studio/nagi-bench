// Tunable simulation constants. Units: meters, seconds, degrees (converted where needed).

export const CFG = {
  // physics
  gravity: 16,
  jumpVel: 5.4,
  playerHeight: 1.8,
  eyeHeight: 1.62,
  playerHalf: 0.34, // horizontal half-extent of the movement AABB
  stepHeight: 0.5,
  groundAccel: 60,
  airAccel: 12,
  friction: 9,
  maxSpeed: 6.4, // knife base; weapons scale this
  walkFactor: 0.52,
  // combat
  headMult: 2.0, // headshot = 2x body (requirement)
  chestMult: 1.0,
  stomachMult: 0.85,
  armMult: 0.75,
  legMult: 0.75,
  armorAbsorb: 0.4, // fraction of damage redirected to armor when armored
  armorDamageFactor: 0.5, // armor lost per absorbed point
  friendlyFire: false,
  // rounds
  freezeTime: 4,
  roundTime: 115,
  bombTimer: 40,
  plantTime: 3.0,
  defuseTime: 5.0,
  defuseTimeKit: 3.0,
  roundEndTime: 4.5,
  winScore: 5,
  startMoney: 800,
  maxMoney: 16000,
  winReward: 3250,
  lossBase: 1900,
  lossStep: 500,
  lossMax: 3400,
  plantReward: 300,
  // AI
  aiThinkInterval: 0.2,
  aiFov: 105, // degrees half? full cone handled in code
  aiViewDist: 70,
  aiReactionMin: 0.22,
  aiReactionMax: 0.5,
  // audio/render
  hudHz: 20,
  fixedDt: 1 / 60,
} as const;

export const DEG = Math.PI / 180;

export const BOT_NAMES_CT = ['Hawk', 'Viper', 'Sable', 'Rook', 'Titan'];
export const BOT_NAMES_T = ['Ghost', 'Cobra', 'Jackal', 'Ember', 'Wraith'];
export const PLAYER_NAME = 'You';

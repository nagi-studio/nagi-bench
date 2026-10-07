/** Fixed simulation rate (CS-style 64 tick). Rendering interpolates between ticks. */
export const TICK_RATE = 64;
export const TICK_DT = 1 / TICK_RATE;

/** Player hull & movement tuning (meters / seconds). Values follow Source-engine proportions. */
export const PHYS = {
  gravity: 20.3,
  jumpSpeed: 6.75,
  stepHeight: 0.45,
  airStepHeight: 0.22,
  snapDown: 0.55,
  radius: 0.4,
  height: 1.8,
  crouchHeight: 1.36,
  eyeHeight: 1.64,
  crouchEyeHeight: 1.2,
  friction: 5.2,
  stopSpeed: 1.9,
  accelerate: 5.5,
  airAccelerate: 12,
  airWishCap: 0.8,
  walkFactor: 0.52,
  crouchFactor: 0.34,
  /** Speeds below this fraction of max speed count as "standing still" for accuracy. */
  accurateSpeedFraction: 0.34,
} as const;

export const RULES = {
  freezeTime: 5,
  roundTime: 115,
  postRoundTime: 6,
  bombTimer: 40,
  plantTime: 3.2,
  defuseTime: 10,
  defuseKitTime: 5,
  bombMaxDamage: 500,
  bombSigma: 12,
  useDistance: 1.7,
  pickupDistance: 1.4,
} as const;

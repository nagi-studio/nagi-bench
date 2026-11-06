import { Body, makeBody, World } from '../physics/engine'

/**
 * Su Song's 水运仪象台 as a physical mechanism.
 *
 *   upper reservoir -> jet of water -> water wheel (砚轮) -> gear train ->
 *   escape wheel -> pawl held by the pendulum -> going train -> hands
 *
 * Every rotation below is produced by the rigid body solver: the water wheel is
 * pushed by the jet's torque, the train reacts through gear constraints, the
 * escape wheel is only allowed to advance one tooth at a time while the pendulum's
 * pawl is lifted, and the hands are geared down from the escape wheel.
 */
export interface ClockParts {
  world: World
  waterWheel: Body
  gearA: Body
  escapeWheel: Body
  minuteWheel: Body
  hourWheel: Body
  pendulum: Body
  bucket: Body
  bell: Body
  bucketPinned: boolean
  reservoir: number
  lowerTank: number
  bucketFill: number
  escaped: boolean
  tooth: number
  bellHit: number
  wheelAngle: number
  escapeAngle: number
  minuteAngle: number
  hourAngle: number
  pendulumAngle: number
  bucketAngle: number
  bellAngle: number
  bucketReleased: boolean
}

const TEETH = 15
const TOOTH = (Math.PI * 2) / TEETH
const RELEASE_ANGLE = 0.16

export function buildClock(): ClockParts {
  const w = new World()
  w.gravity = -9.81
  w.substeps = 10

  // --- water wheel (砚轮) driven by the jet ---
  const waterWheel = w.add(makeBody({ x: -3.4, y: 6.4, m: 6, I: 6 * 0.5 * 0.95 * 0.95, r: 0.95, shape: 'circle' }))
  w.pin(waterWheel, null, 0, 0)

  // --- first gear on the same shaft ---
  const gearA = w.add(makeBody({ x: -3.4, y: 4.6, m: 1.4, I: 0.25, r: 0.62 }))
  w.pin(gearA, null, 0, 0)
  w.ratio(waterWheel, gearA, -1, 0)          // coaxial: same shaft, opposite sign convention

  // --- escape wheel, meshed with gear A ---
  const escapeWheel = w.add(makeBody({ x: -1.55, y: 4.6, m: 1.1, I: 0.16, r: 0.42 }))
  w.pin(escapeWheel, null, 0, 0)
  w.ratio(gearA, escapeWheel, -0.62 / 0.42, 0)   // external gear mesh

  // --- pendulum with the anchor fork ---
  const pendulum = w.add(makeBody({ x: 0.9, y: 5.9, m: 3.2, I: 3.2 * 0.5 * 2.1 * 2.1, r: 1.6, shape: 'box', w2: 0.06, h2: 1.05 }))
  w.pin(pendulum, null, 0, 0)

  // --- going train: escape wheel -> minute wheel -> hour wheel ---
  const minuteWheel = w.add(makeBody({ x: -1.55, y: 2.2, m: 1.0, I: 0.5, r: 0.8 }))
  w.pin(minuteWheel, null, 0, 0)
  w.ratio(escapeWheel, minuteWheel, -1 / 20, 0)

  const hourWheel = w.add(makeBody({ x: 0.35, y: 2.2, m: 0.9, I: 0.45, r: 0.68 }))
  w.pin(hourWheel, null, 0, 0)
  w.ratio(minuteWheel, hourWheel, -12, 0)

  // --- reporting bucket that fills with water and finally tips over ---
  const bucket = w.add(makeBody({ x: 2.9, y: 5.6, m: 0.25, I: 0.02, r: 0.42, shape: 'box', w2: 0.36, h2: 0.3 }))
  w.pin(bucket, null, 0, 0)

  // --- bell that the bucket rope pulls ---
  const bell = w.add(makeBody({ x: 2.9, y: 7.4, m: 0.5, I: 0.06, r: 0.3 }))
  w.pin(bell, null, 0, 0)

  return {
    world: w, waterWheel, gearA, escapeWheel, minuteWheel, hourWheel,
    pendulum, bucket, bell,
    bucketPinned: true,
    reservoir: 1, lowerTank: 0, bucketFill: 0,
    escaped: false, tooth: 0, bellHit: 0,
    wheelAngle: 0, escapeAngle: 0, minuteAngle: 0, hourAngle: 0,
    pendulumAngle: 0, bucketAngle: 0, bellAngle: 0, bucketReleased: false,
  }
}

export interface ClockEnv {
  /** how long the main demonstration runs, seconds */
  duration: number
  /** scale of the water flow */
  flow: number
}

export function stepClock(p: ClockParts, dt: number, env: ClockEnv) {
  const w = p.world
  const t = p.world.bodies.length // unused, keeps the shape explicit

  // --- water ---
  const flow = env.flow * (p.reservoir > 0.02 ? 1 : 0)
  p.reservoir = Math.max(0, p.reservoir - dt * 0.035)
  p.lowerTank = Math.min(1, p.lowerTank + dt * 0.05)
  p.bucketFill = Math.min(1, p.bucketFill + dt * 0.06)

  // the jet pushes the water wheel: torque proportional to the flow rate
  p.waterWheel.torque += flow * 2.4

  // --- the bucket fills, so it grows heavier and eventually tips ---
  if (p.bucketPinned) {
    p.bucket.m = 0.25 + p.bucketFill * 2.6
    p.bucket.I = 0.02 + p.bucketFill * 0.22
    // the water sits off-centre, so the load makes the bucket lean
    p.bucket.torque += p.bucketFill * 1.15
    if (Math.abs(p.bucket.a) > 0.42) {
      // the rope pays out: the pin is released and the bucket falls under gravity
      p.bucketPinned = false
      p.bucketReleased = true
      p.bucket.invM = 1 / p.bucket.m
      p.bucket.invI = 1 / p.bucket.I
    }
  } else {
    // the falling bucket drags on the bell rope
    const stretch = p.bucket.y - 3.2
    if (stretch < 0.6) {
      const impulse = Math.min(0.9, Math.abs(p.bucket.vy) * p.bucket.m * 0.12)
      w.applyImpulse(p.bell, 0, -impulse * 0.4, p.bell.x, p.bell.y - 0.2)
      if (impulse > 0.02) p.bellHit = 1
    }
  }

  // --- escapement: the pawl lifts while the pendulum swings out ---
  const pendAngle = p.pendulum.a
  p.pendulumAngle = pendAngle
  const pawlOut = Math.abs(pendAngle) > RELEASE_ANGLE

  if (pawlOut) {
    p.escaped = true
  } else if (p.escaped) {
    // the pawl drops back in: the wheel must not have passed the next tooth
    const next = (Math.floor(p.escapeWheel.a / TOOTH) + 1) * TOOTH
    if (p.escapeWheel.a >= next - 1e-3 || p.escapeWheel.w < 0) {
      p.escapeWheel.a = next
      p.escapeWheel.w = 0
      p.escaped = false
      p.tooth++
    }
  }
  if (!pawlOut && !p.escaped) {
    // locked: the wheel may not advance past its tooth boundary
    const next = (Math.floor(p.escapeWheel.a / TOOTH) + 1) * TOOTH
    if (p.escapeWheel.a > next) {
      p.escapeWheel.a = next
      p.escapeWheel.w = 0
    }
  }

  w.step(dt)

  p.wheelAngle = p.waterWheel.a
  p.escapeAngle = p.escapeWheel.a
  p.minuteAngle = p.minuteWheel.a
  p.hourAngle = p.hourWheel.a
  p.bucketAngle = p.bucket.a
  p.bellAngle = p.bell.a
  p.bellHit = Math.max(0, p.bellHit - dt * 2)
  void t
}

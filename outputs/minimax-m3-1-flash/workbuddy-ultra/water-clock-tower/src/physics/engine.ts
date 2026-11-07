// A small impulse-based rigid body engine for planar mechanisms.
// Bodies live in the XY plane and rotate about Z, which is exactly the shape of
// a clock's gear train seen in cross-section. Everything the tower does is
// computed here: nothing in the film is keyframed.

export interface Body {
  id: number
  x: number; y: number; a: number
  vx: number; vy: number; w: number
  m: number; invM: number
  I: number; invI: number
  fixed: boolean
  /** extra torque applied this step (Nm) */
  torque: number
  /** radius used for point collisions */
  r: number
  shape: 'circle' | 'box'
  w2: number; h2: number
}

export interface Pin {
  a: Body
  b: Body | null
  ax: number; ay: number
  bx: number; by: number
}

export interface Ratio {
  a: Body
  b: Body
  /** a.a * ratio + b.a = offset */
  ratio: number
  offset: number
}

export interface AngularLimit {
  body: Body
  min: number
  max: number
  /** limits are relative to the body's reference angle */
  ref: number
}

let nextId = 1

export function makeBody(opts: {
  x?: number; y?: number; a?: number; m?: number; I?: number
  fixed?: boolean; r?: number; shape?: 'circle' | 'box'; w2?: number; h2?: number
}): Body {
  const fixed = !!opts.fixed
  const m = opts.m ?? 1
  const I = opts.I ?? m * 0.5
  return {
    id: nextId++,
    x: opts.x ?? 0, y: opts.y ?? 0, a: opts.a ?? 0,
    vx: 0, vy: 0, w: 0,
    m, invM: fixed ? 0 : 1 / m,
    I, invI: fixed ? 0 : 1 / I,
    fixed,
    torque: 0,
    r: opts.r ?? 0.3,
    shape: opts.shape ?? 'circle',
    w2: opts.w2 ?? 0.2, h2: opts.h2 ?? 0.2,
  }
}

export class World {
  bodies: Body[] = []
  pins: Pin[] = []
  ratios: Ratio[] = []
  limits: AngularLimit[] = []
  gravity = -9.81
  substeps = 8

  add(b: Body) { this.bodies.push(b); return b }
  pin(a: Body, b: Body | null, ax: number, ay: number, bx = 0, by = 0) {
    this.pins.push({ a, b, ax, ay, bx, by })
  }
  ratio(a: Body, b: Body, ratio: number, offset = 0) {
    this.ratios.push({ a, b, ratio, offset })
  }
  limit(body: Body, min: number, max: number, ref = 0) {
    this.limits.push({ body, min, max, ref })
  }

  step(dt: number) {
    const h = dt / this.substeps
    for (let s = 0; s < this.substeps; s++) this.substep(h)
  }

  private substep(h: number) {
    // integrate forces
    for (const b of this.bodies) {
      if (b.fixed) { b.vx = b.vy = b.w = 0; continue }
      b.vy += this.gravity * h
      b.vx += 0
      b.vy += 0
      b.w += b.torque * b.invI * h
      b.torque = 0
      b.x += b.vx * h
      b.y += b.vy * h
      b.a += b.w * h
    }
    // solve constraints a few times for stability
    for (let it = 0; it < 6; it++) {
      this.solvePins(h)
      this.solveRatios()
      this.solveLimits()
    }
    // damping
    for (const b of this.bodies) {
      if (b.fixed) continue
      b.vx *= 0.9995
      b.vy *= 0.9995
      b.w *= 0.9996
    }
  }

  private solvePins(h: number) {
    for (const p of this.pins) {
      const A = p.a
      const B = p.b
      // world anchors
      const cA = Math.cos(A.a), sA = Math.sin(A.a)
      const rax = p.ax * cA - p.ay * sA
      const ray = p.ax * sA + p.ay * cA
      const px = A.x + rax
      const py = A.y + ray
      let rbx = 0, rby = 0, qx = px, qy = py
      if (B) {
        const cB = Math.cos(B.a), sB = Math.sin(B.a)
        rbx = p.bx * cB - p.by * sB
        rby = p.bx * sB + p.by * cB
        qx = B.x + rbx
        qy = B.y + rby
      }
      // relative velocity at the anchors
      const vpx = A.vx - A.w * ray
      const vpy = A.vy + A.w * rax
      let vqx = vpx, vqy = vpy
      if (B) {
        vqx = B.vx - B.w * rby
        vqy = B.vy + B.w * rbx
      }
      const rvx = vqx - vpx
      const rvy = vqy - vpy
      const ex = qx - px
      const ey = qy - py
      const beta = 0.2 / h
      const cx = rvx + beta * ex
      const cy = rvy + beta * ey
      const k11 = A.invM + (B ? B.invM : 0) + A.invI * ray * ray + (B ? B.invI * rby * rby : 0)
      const k12 = -A.invI * rax * ray - (B ? B.invI * rbx * rby : 0)
      const k22 = A.invM + (B ? B.invM : 0) + A.invI * rax * rax + (B ? B.invI * rbx * rbx : 0)
      const det = k11 * k22 - k12 * k12
      if (Math.abs(det) < 1e-12) continue
      const inv = 1 / det
      const lx = -(k22 * cx - k12 * cy) * inv
      const ly = -(-k12 * cx + k11 * cy) * inv
      if (!A.fixed) {
        A.vx += A.invM * lx
        A.vy += A.invM * ly
        A.w += A.invI * (rax * ly - ray * lx)
      }
      if (B && !B.fixed) {
        B.vx -= B.invM * lx
        B.vy -= B.invM * ly
        B.w -= B.invI * (rbx * ly - rby * lx)
      }
    }
  }

  private solveRatios() {
    for (const r of this.ratios) {
      const cdot = r.ratio * r.a.w + r.b.w
      const denom = r.ratio * r.ratio * r.a.invI + r.b.invI
      if (Math.abs(denom) < 1e-12) continue
      const lambda = -cdot / denom
      r.a.w += r.a.invI * lambda * r.ratio
      r.b.w += r.b.invI * lambda
    }
  }

  private solveLimits() {
    for (const l of this.limits) {
      const b = l.body
      const rel = b.a - l.ref
      if (rel < l.min) {
        const cdot = b.w
        const lambda = -cdot / (b.invI || 1)
        b.w += b.invI * lambda
      } else if (rel > l.max) {
        const cdot = b.w
        const lambda = -cdot / (b.invI || 1)
        b.w += b.invI * lambda
      }
    }
  }

  /** apply an impulse at a world point */
  applyImpulse(body: Body, jx: number, jy: number, px: number, py: number) {
    if (body.fixed) return
    const rx = px - body.x
    const ry = py - body.y
    body.vx += body.invM * jx
    body.vy += body.invM * jy
    body.w += body.invI * (rx * jy - ry * jx)
  }
}

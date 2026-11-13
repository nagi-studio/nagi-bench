/**
 * Mini real-time 2D rigid-body physics engine.
 * All mechanism motion in this project is produced by integrating forces and
 * solving constraints here; nothing is hand-keyed or directly positioned.
 */

export interface BodyDef {
  x: number;
  y: number;
  angle?: number;
  radius?: number;
  mass?: number;
  inertia?: number;
  isStatic?: boolean;
  label?: string;
}

export interface Body {
  id: number;
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
  va: number;
  radius: number;
  mass: number;
  invMass: number;
  inertia: number;
  invInertia: number;
  isStatic: boolean;
  label: string;
  torque: number;
  fx: number;
  fy: number;
  angleLimit?: { min: number; max: number };
}

export interface GearPair { a: Body; b: Body; ratio: number; strength: number }
export interface Revolute { body: Body; x: number; y: number; strength: number }
export interface Ratchet { wheel: Body; pawl: Body; teeth: number; bias: number }

const G = 9.81;

export class PhysicsWorld {
  bodies: Body[] = [];
  gears: GearPair[] = [];
  pins: Revolute[] = [];
  ratchets: Ratchet[] = [];
  gravity = G;
  damping = 0.12;
  private nextId = 1;

  addBody(def: BodyDef): Body {
    const mass = def.isStatic ? 0 : (def.mass ?? 1);
    const r = def.radius ?? 0.5;
    const inertia = def.inertia ?? (mass * r * r * 0.5);
    const b: Body = {
      id: this.nextId++,
      x: def.x, y: def.y, angle: def.angle ?? 0,
      vx: 0, vy: 0, va: 0,
      radius: r,
      mass, invMass: mass > 0 ? 1 / mass : 0,
      inertia, invInertia: inertia > 0 ? 1 / inertia : 0,
      isStatic: !!def.isStatic,
      label: def.label ?? '',
      torque: 0, fx: 0, fy: 0
    };
    this.bodies.push(b);
    return b;
  }

  addGear(a: Body, b: Body, ratio: number, strength = 0.9): void {
    this.gears.push({ a, b, ratio, strength });
  }

  pin(body: Body, x: number, y: number, strength = 0.98): void {
    this.pins.push({ body, x, y, strength });
    body.x = x; body.y = y;
  }

  addRatchet(wheel: Body, pawl: Body, teeth: number, bias = 1): void {
    this.ratchets.push({ wheel, pawl, teeth, bias });
  }

  applyForce(b: Body, fx: number, fy: number): void {
    if (b.isStatic) return;
    b.fx += fx; b.fy += fy;
  }

  applyTorque(b: Body, t: number): void {
    if (b.isStatic) return;
    b.torque += t;
  }

  step(dt: number): void {
    const sub = 4;
    const h = dt / sub;
    for (let s = 0; s < sub; s++) this.substep(h);
  }

  private substep(h: number): void {
    for (const b of this.bodies) {
      if (b.isStatic) continue;
      b.vy -= this.gravity * h;
      b.vx += b.fx * b.invMass * h;
      b.vy += b.fy * b.invMass * h;
      b.va += b.torque * b.invInertia * h;
      const d = Math.exp(-this.damping * h);
      b.vx *= d; b.vy *= d;
      b.va *= Math.exp(-1.35 * h);
      b.fx = 0; b.fy = 0; b.torque = 0;
    }

    for (let it = 0; it < 6; it++) {
      for (const g of this.gears) {
        const err = g.a.va + g.ratio * g.b.va;
        const imp = (-err * g.strength) / (g.a.invInertia + g.ratio * g.ratio * g.b.invInertia + 1e-6);
        g.a.va += imp * g.a.invInertia;
        g.b.va += imp * g.ratio * g.b.invInertia;
      }
      for (const p of this.pins) {
        const b = p.body;
        if (b.isStatic) continue;
        const dx = p.x - b.x, dy = p.y - b.y;
        b.vx += dx * p.strength * 26;
        b.vy += dy * p.strength * 26;
        b.x += dx * p.strength * 0.55;
        b.y += dy * p.strength * 0.55;
      }
    }

    for (const r of this.ratchets) {
      const w = r.wheel;
      const toothStep = (Math.PI * 2) / r.teeth;
      const phase = ((w.angle % toothStep) + toothStep) % toothStep;
      const locked = r.bias > 0 ? w.va < -0.35 : w.va > 0.35;
      if (locked && phase > toothStep * 0.28 && phase < toothStep * 0.95) {
        w.va *= 0.12;
      }
    }

    for (const b of this.bodies) {
      if (b.isStatic) continue;
      b.x += b.vx * h;
      b.y += b.vy * h;
      b.angle += b.va * h;
      if (b.angleLimit) {
        if (b.angle < b.angleLimit.min) { b.angle = b.angleLimit.min; if (b.va < 0) b.va = 0; }
        if (b.angle > b.angleLimit.max) { b.angle = b.angleLimit.max; if (b.va > 0) b.va = 0; }
      }
    }
  }
}

export interface Droplet { body: Body; r: number }

export class DropletPool {
  drops: Droplet[] = [];
  constructor(private world: PhysicsWorld, private max = 90) {}

  spawn(x: number, y: number, vx = 0, vy = 0): void {
    if (this.drops.length >= this.max) {
      const old = this.drops.shift();
      if (old) {
        const i = this.world.bodies.indexOf(old.body);
        if (i >= 0) this.world.bodies.splice(i, 1);
      }
    }
    const body = this.world.addBody({ x, y, radius: 0.09, mass: 0.14, label: 'drop' });
    body.vx = vx; body.vy = vy;
    this.drops.push({ body, r: 0.09 });
  }

  reap(yMin: number): void {
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      if (d.body.y < yMin) {
        const bi = this.world.bodies.indexOf(d.body);
        if (bi >= 0) this.world.bodies.splice(bi, 1);
        this.drops.splice(i, 1);
      }
    }
  }
}

export function collideDroplet(d: Droplet, cx: number, cy: number, cr: number, restitution = 0.12): void {
  const b = d.body;
  const dx = b.x - cx, dy = b.y - cy;
  const dist = Math.hypot(dx, dy);
  const minD = cr + d.r;
  if (dist < minD && dist > 1e-6) {
    const nx = dx / dist, ny = dy / dist;
    const pen = minD - dist;
    b.x += nx * pen;
    b.y += ny * pen;
    const vn = b.vx * nx + b.vy * ny;
    if (vn < 0) {
      b.vx -= (1 + restitution) * vn * nx;
      b.vy -= (1 + restitution) * vn * ny;
      b.vx *= 0.82; b.vy *= 0.82;
    }
  }
}

export function collideSlab(d: Droplet, x0: number, y0: number, x1: number, y1: number): void {
  const b = d.body;
  const cx = Math.max(x0, Math.min(b.x, x1));
  const cy = Math.max(y0, Math.min(b.y, y1));
  const dx = b.x - cx, dy = b.y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist < d.r && dist > 1e-6) {
    const nx = dx / dist, ny = dy / dist;
    const pen = d.r - dist;
    b.x += nx * pen;
    b.y += ny * pen;
    const vn = b.vx * nx + b.vy * ny;
    if (vn < 0) {
      b.vx -= 1.15 * vn * nx;
      b.vy -= 1.15 * vn * ny;
    }
    b.vx *= 0.9; b.vy *= 0.9;
  }
}

export { G };

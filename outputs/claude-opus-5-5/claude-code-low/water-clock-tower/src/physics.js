// A small planar rigid-body engine (sequential-impulse / projected Gauss-Seidel).
// Every moving part of the clock is a Body integrated here; parts only move
// through forces, gravity, joints, gears and contacts — never by assigning poses.

export class Body {
  constructor(o) {
    this.name = o.name || '';
    this.x = o.x || 0; this.y = o.y || 0; this.a = o.a || 0;
    this.vx = 0; this.vy = 0; this.w = 0;
    this.pivoted = !!o.pivoted;           // rotates about a fixed axle at (x,y)
    this.mass = o.mass ?? 1;
    this.inertia = o.inertia ?? 1;        // about the COM (free) or the axle (pivoted)
    this.com = o.com || [0, 0];           // COM offset from axle in body frame (pivoted only)
    this.damping = o.damping ?? 0;        // viscous bearing damping (1/s)
    this.gravity = o.gravity ?? true;
    this.torque = 0;
    this.refresh();
  }
  refresh() {
    this.invM = this.pivoted ? 0 : 1 / this.mass;
    this.invI = 1 / this.inertia;
  }
  // world position of a local point
  wp(lx, ly) {
    const c = Math.cos(this.a), s = Math.sin(this.a);
    return [this.x + c * lx - s * ly, this.y + s * lx + c * ly];
  }
  // world-rotated offset of a local point (relative to body origin)
  wr(lx, ly) {
    const c = Math.cos(this.a), s = Math.sin(this.a);
    return [c * lx - s * ly, s * lx + c * ly];
  }
}

const ZERO = { invM: 0, invI: 0, vx: 0, vy: 0, w: 0, x: 0, y: 0, a: 0, isWorld: true };

function makeRow(a, b, ja, jb, bias, lo, hi, tag) {
  a = a || ZERO; b = b || ZERO;
  const k = (ja[0] * ja[0] + ja[1] * ja[1]) * a.invM + ja[2] * ja[2] * a.invI +
            (jb[0] * jb[0] + jb[1] * jb[1]) * b.invM + jb[2] * jb[2] * b.invI;
  return { a, b, ja, jb, bias, lo, hi, lambda: 0, m: k > 1e-12 ? 1 / k : 0, tag };
}

export class World {
  constructor() {
    this.bodies = [];
    this.constraints = [];   // objects with build(world, dt, rows)
    this.g = 9.81;
    this.iterations = 30;
    this.beta = 0.2;
    this.events = [];
    this.time = 0;
  }
  add(b) { this.bodies.push(b); return b; }
  addC(c) { this.constraints.push(c); return c; }

  step(dt) {
    const g = this.g;
    for (const b of this.bodies) {
      if (b.pivoted) {
        let t = b.torque;
        if (b.gravity) {
          const [rx] = b.wr(b.com[0], b.com[1]);
          t += rx * (-b.mass * g);
        }
        b.w += t * b.invI * dt;
      } else {
        if (b.gravity) b.vy -= g * dt;
        b.w += b.torque * b.invI * dt;
      }
    }
    const rows = [];
    for (const c of this.constraints) c.build(this, dt, rows);
    for (let it = 0; it < this.iterations; it++) {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r.m === 0) continue;
        const a = r.a, b = r.b, ja = r.ja, jb = r.jb;
        const jv = ja[0] * a.vx + ja[1] * a.vy + ja[2] * a.w + jb[0] * b.vx + jb[1] * b.vy + jb[2] * b.w;
        let d = r.m * (r.bias - jv);
        const old = r.lambda;
        let nl = old + d;
        if (nl < r.lo) nl = r.lo; else if (nl > r.hi) nl = r.hi;
        d = nl - old; r.lambda = nl;
        if (!a.isWorld) { a.vx += ja[0] * d * a.invM; a.vy += ja[1] * d * a.invM; a.w += ja[2] * d * a.invI; }
        if (!b.isWorld) { b.vx += jb[0] * d * b.invM; b.vy += jb[1] * d * b.invM; b.w += jb[2] * d * b.invI; }
      }
    }
    for (const c of this.constraints) if (c.after) c.after(this, dt);
    this.lastRows = rows;
    for (const b of this.bodies) {
      if (b.damping) b.w *= Math.exp(-b.damping * dt);
      if (!b.pivoted) { b.x += b.vx * dt; b.y += b.vy * dt; }
      b.a += b.w * dt;
    }
    this.time += dt;
  }
}

// Revolute joint: free body B hinged to (pivoted or free) body A at A-local point.
export class Hinge {
  constructor(A, B, aLocal, bLocal) { this.A = A; this.B = B; this.la = aLocal; this.lb = bLocal; }
  build(w, dt, rows) {
    const A = this.A, B = this.B;
    const ra = A.wr(this.la[0], this.la[1]), rb = B.wr(this.lb[0], this.lb[1]);
    const cx = (B.x + rb[0]) - (A.x + ra[0]);
    const cy = (B.y + rb[1]) - (A.y + ra[1]);
    const k = w.beta / dt;
    rows.push(makeRow(A, B, [-1, 0, ra[1]], [1, 0, -rb[1]], -k * cx, -Infinity, Infinity));
    rows.push(makeRow(A, B, [0, -1, -ra[0]], [0, 1, rb[0]], -k * cy, -Infinity, Infinity));
  }
}

// Relative angle limit: lo <= (B.a - A.a - offset) <= hi   (A may be null = world)
export class AngleLimit {
  constructor(A, B, offset, lo, hi) { this.A = A; this.B = B; this.off = offset; this.lo = lo; this.hi = hi; }
  build(w, dt, rows) {
    const aa = this.A ? this.A.a : 0;
    const rel = this.B.a - aa - this.off;
    const k = w.beta / dt;
    const m = 0.02;
    if (rel < this.lo + m) {
      const pen = this.lo - rel;
      rows.push(makeRow(this.A, this.B, [0, 0, -1], [0, 0, 1], pen > 0 ? k * pen : pen / dt, 0, Infinity));
    }
    if (rel > this.hi - m) {
      const pen = rel - this.hi;
      rows.push(makeRow(this.A, this.B, [0, 0, 1], [0, 0, -1], pen > 0 ? k * pen : pen / dt, 0, Infinity));
    }
  }
}

// Gear mesh: wB = ratio * wA (holonomic, with drift correction).
export class Gear {
  constructor(A, B, ratio) { this.A = A; this.B = B; this.r = ratio; this.a0 = A.a; this.b0 = B.a; this.load = 0; }
  build(w, dt, rows) {
    const C = (this.B.a - this.b0) - this.r * (this.A.a - this.a0);
    this.row = makeRow(this.A, this.B, [0, 0, -this.r], [0, 0, 1], -0.3 * C / dt, -Infinity, Infinity);
    rows.push(this.row);
  }
  after(w, dt) { this.load = this.row.lambda / dt; }
}

// Rigid rod between two body points (bilateral distance constraint).
export class Rod {
  constructor(A, B, la, lb) {
    this.A = A; this.B = B; this.la = la; this.lb = lb;
    const pa = A.wp(la[0], la[1]), pb = B.wp(lb[0], lb[1]);
    this.len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  }
  ends() { return [this.A.wp(this.la[0], this.la[1]), this.B.wp(this.lb[0], this.lb[1])]; }
  build(w, dt, rows) {
    const A = this.A, B = this.B;
    const ra = A.wr(this.la[0], this.la[1]), rb = B.wr(this.lb[0], this.lb[1]);
    const dx = (B.x + rb[0]) - (A.x + ra[0]), dy = (B.y + rb[1]) - (A.y + ra[1]);
    const L = Math.hypot(dx, dy) || 1e-9, nx = dx / L, ny = dy / L;
    const C = L - this.len;
    rows.push(makeRow(A, B, [-nx, -ny, -(ra[0] * ny - ra[1] * nx)], [nx, ny, rb[0] * ny - rb[1] * nx],
      -w.beta * C / dt, -Infinity, Infinity));
  }
}

// Contact between circles carried by body P and a segment carried by body S (S may be null = ground).
// Emits impact events (with the normal impulse) for sound.
export class CircleSegContact {
  constructor(o) {
    Object.assign(this, { restitution: 0, margin: 0.03, thick: 0, minEvent: 0.02 }, o);
    // o: P, circles: [[lx,ly,r],...], S, seg: [x1,y1,x2,y2], tag
    this.touching = new Array(this.circles.length).fill(false);
    this.rowsByCircle = new Array(this.circles.length).fill(null);
    this.approach = new Array(this.circles.length).fill(0);
  }
  segWorld() {
    const s = this.seg;
    if (!this.S) return [s[0], s[1], s[2], s[3]];
    const p1 = this.S.wp(s[0], s[1]), p2 = this.S.wp(s[2], s[3]);
    return [p1[0], p1[1], p2[0], p2[1]];
  }
  build(w, dt, rows) {
    const P = this.P, S = this.S;
    const [x1, y1, x2, y2] = this.segWorld();
    const ex = x2 - x1, ey = y2 - y1, el2 = ex * ex + ey * ey;
    for (let i = 0; i < this.circles.length; i++) {
      this.rowsByCircle[i] = null;
      const c = this.circles[i];
      const cw = P.wp(c[0], c[1]);
      let t = ((cw[0] - x1) * ex + (cw[1] - y1) * ey) / el2;
      t = Math.max(0, Math.min(1, t));
      const qx = x1 + ex * t, qy = y1 + ey * t;
      let nx = cw[0] - qx, ny = cw[1] - qy;
      const d = Math.hypot(nx, ny) || 1e-9;
      nx /= d; ny /= d;
      const gap = d - c[2] - this.thick;
      if (gap > this.margin) { this.touching[i] = false; continue; }
      const rp = [cw[0] - nx * c[2] - P.x, cw[1] - ny * c[2] - P.y];
      const sb = S || ZERO;
      const rs = [qx - sb.x, qy - sb.y];
      const ja = [nx, ny, rp[0] * ny - rp[1] * nx];
      const jb = [-nx, -ny, -(rs[0] * ny - rs[1] * nx)];
      // current approach velocity
      const vn = ja[0] * P.vx + ja[1] * P.vy + ja[2] * P.w + jb[0] * sb.vx + jb[1] * sb.vy + jb[2] * sb.w;
      let bias;
      if (gap < 0) bias = Math.min(w.beta * (-gap - 0.001) / dt, 2);
      else bias = -gap / dt;
      if (this.restitution > 0 && vn < -0.15 && gap < 0.004) bias = Math.max(bias, -this.restitution * vn);
      if (bias < 0 && gap <= 0) bias = 0;
      const r = makeRow(P, S, ja, jb, bias, 0, Infinity);
      this.approach[i] = vn;
      this.rowsByCircle[i] = r;
      rows.push(r);
    }
  }
  after(w, dt) {
    for (let i = 0; i < this.circles.length; i++) {
      const r = this.rowsByCircle[i];
      const imp = r ? r.lambda : 0;
      const hit = imp > 1e-6;
      if (hit && !this.touching[i] && imp > this.minEvent) {
        w.events.push({ tag: this.tag, impulse: imp, speed: -this.approach[i], index: i, time: w.time });
      }
      if (hit) this.touching[i] = true;
    }
  }
}

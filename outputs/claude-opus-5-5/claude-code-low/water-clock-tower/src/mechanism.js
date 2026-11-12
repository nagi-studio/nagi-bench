// The water-driven clockwork, built from physics bodies. No three.js here so it
// can be run and tuned headlessly.
import { World, Body, Hinge, AngleLimit, Gear, Rod, CircleSegContact } from './physics.js';

const D = Math.PI / 180;

export const GEO = {
  R: 1.5,               // bucket hinge radius on the scoop wheel
  N: 12,
  station: 70 * D,      // angle of the filling station
  pegR: 1.15,
  pegOffset: 25 * D,
  bucketW: 0.36, bucketH: 0.30,
  bucketCom: [-0.15, 0.12], // bucket centre relative to its hinge (upright frame)
  forkPivot: [0.733, 1.34],
  beamPivot: [1.583, 1.17],
  toothX: -0.028,
  tank1: { x0: 1.35, x1: 2.35, y0: 3.0, y1: 3.85 },
  tank2: { x0: 0.45, x1: 0.97, y0: 2.35, y1: 2.78, hmax: 0.32 },
  spout2: [0.36, 2.28],
  sump: { x0: -2.3, x1: 2.6, y0: -2.4, y1: -2.08 },
  strikeCamR: 0.35,
};

export class Clockwork {
  constructor(opts = {}) {
    const w = this.world = new World();
    w.iterations = 60;
    const G = GEO;
    this.beamMass = opts.beamMass ?? 0.3;
    // ---------------- scoop wheel (枢轮)
    this.wheel = w.add(new Body({ name: 'wheel', pivoted: true, mass: 40, inertia: 22, damping: 0.25, gravity: false }));
    this.buckets = [];
    for (let k = 0; k < G.N; k++) {
      const ak = G.station + k * 2 * Math.PI / G.N;
      const hx = G.R * Math.cos(ak), hy = G.R * Math.sin(ak);
      const phi = ak - G.station;
      const c = Math.cos(phi), s = Math.sin(phi);
      const [ox, oy] = G.bucketCom;
      const b = w.add(new Body({ name: 'bucket' + k, x: hx + c * ox - s * oy, y: hy + s * ox + c * oy, a: phi, mass: 0.5, inertia: 0.02 }));
      b.water = 0; b.empty = 0.5; b.k = k; b.phi = phi; b.hinge = [hx, hy];
      w.addC(new Hinge(this.wheel, b, [hx, hy], [-ox, -oy]));
      w.addC(new AngleLimit(this.wheel, b, phi, 0, 0.10));
      this.buckets.push(b);
    }
    // pegs (on the front ring) that the stop-tooth catches
    this.pegs = [];
    for (let k = 0; k < G.N; k++) {
      const a = G.station + G.pegOffset + k * 2 * Math.PI / G.N;
      this.pegs.push([G.pegR * Math.cos(a), G.pegR * Math.sin(a), 0.06]);
    }
    // ---------------- weighing fork (格叉)
    const [fx, fy] = G.forkPivot;
    this.fork = w.add(new Body({ name: 'fork', pivoted: true, x: fx, y: fy, mass: 0.5, inertia: 0.12, com: [0.1, 0], damping: 1 }));
    this.forkRoller = [-0.5, 0, 0.04];
    w.addC(new AngleLimit(null, this.fork, 0, -0.06, 0.13));
    for (const b of this.buckets) {
      const hw = G.bucketW / 2, hh = G.bucketH / 2;
      w.addC(new CircleSegContact({ P: this.fork, circles: [this.forkRoller], S: b, seg: [-hw, -hh, hw, -hh], tag: 'fork', minEvent: 0.05 }));
    }
    // ---------------- balance beam (天衡) with stop tooth (天关)
    const [bx, by] = G.beamPivot;
    const bm = this.beamMass;
    this.beam = w.add(new Body({ name: 'beam', pivoted: true, x: bx, y: by, mass: bm, inertia: 0.25 + bm * 0.7, com: [-0.65, 0.12], damping: 0.5 }));
    this.toothLocal = [G.toothX - bx, 0.78, G.toothX - bx, -0.095];
    w.addC(new AngleLimit(null, this.beam, 0, -0.17, 0));
    this.toothContact = w.addC(new CircleSegContact({ P: this.wheel, circles: this.pegs, S: this.beam, seg: this.toothLocal, thick: 0.012, tag: 'tooth', minEvent: 0.03 }));
    // ---------------- link rod (天条) between fork tail and beam
    this.rod = w.addC(new Rod(this.fork, this.beam, [0.5, 0], [-0.35, 0.78]));

    // ---------------- drive train
    this.shaft = w.add(new Body({ name: 'shaft', pivoted: true, inertia: 0.4, damping: 0.4, gravity: false }));
    this.lay = w.add(new Body({ name: 'lay', pivoted: true, inertia: 0.15, damping: 0.4, gravity: false }));
    this.camAxle = w.add(new Body({ name: 'camAxle', pivoted: true, inertia: 0.2, damping: 0.4, gravity: false }));
    this.globe = w.add(new Body({ name: 'globe', pivoted: true, inertia: 0.5, damping: 0.4, gravity: false }));
    this.armillary = w.add(new Body({ name: 'armillary', pivoted: true, inertia: 0.5, damping: 0.4, gravity: false }));
    this.gears = [
      w.addC(new Gear(this.wheel, this.shaft, 0.5)),
      w.addC(new Gear(this.shaft, this.lay, 1.0)),
      w.addC(new Gear(this.lay, this.camAxle, 2.0)),
      w.addC(new Gear(this.shaft, this.globe, 0.5)),
      w.addC(new Gear(this.shaft, this.armillary, 0.5)),
    ];
    // ---------------- strikers: cam pegs trip a bell-crank; hammer falls on bell / drum
    const Rc = G.strikeCamR;
    const mkPegs = (n, phase) => Array.from({ length: n }, (_, i) => {
      const a = phase + i * 2 * Math.PI / n; return [Rc * Math.cos(a), Rc * Math.sin(a), 0.045];
    });
    this.bellPegs = mkPegs(12, 150 * D);
    this.drumPegs = mkPegs(3, 330 * D);
    this.strikers = {};
    const mkStriker = (name, pegs, tag) => {
      const lever = w.add(new Body({ name, pivoted: true, x: -0.62, y: 0.24, mass: 0.35, inertia: 0.06, com: [0.17, 0.22], damping: 0.3 }));
      const tail = [0, 0, 0.37, 0];
      w.addC(new CircleSegContact({ P: this.camAxle, circles: pegs, S: lever, seg: tail, thick: 0.015, tag: name + 'Cam', minEvent: 0.5 }));
      const hammer = [0, 0.72, 0.065];
      const target = [-0.62 + 0.075, 0.76, -0.62 + 0.075, 1.2];
      w.addC(new CircleSegContact({ P: lever, circles: [hammer], S: null, seg: target, tag, restitution: 0.55, minEvent: 0.004 }));
      w.addC(new AngleLimit(null, lever, 0, -0.05, 0.5));
      this.strikers[name] = { lever, tail, hammer, target, pegs };
    };
    mkStriker('bell', this.bellPegs, 'bell');
    mkStriker('drum', this.drumPegs, 'drum');

    // ---------------- water
    this.particles = [];
    this.h1 = 0.62; this.h2 = 0.30;
    this.A1 = (G.tank1.x1 - G.tank1.x0) * 0.6 * 1000; // kg per metre of level
    this.A2 = (G.tank2.x1 - G.tank2.x0) * 0.5 * 1000;
    this.q = 0.01;              // kg per droplet
    this.acc1 = 0; this.acc2 = 0; this.accO = 0;
    this.sumpWater = 0;
    this.flow2 = 0; this.overflowRate = 0; this.flow1 = 0;
    this.spill = 0;
    this.splashes = 0;
    this.seed = 12345;
    // pre-load a running state: a little water already in the buckets past the station
    this.buckets[0].water = 0.35;
    this.buckets[11].water = 1.0;
    this.buckets[10].water = 0.4;
    for (const b of this.buckets) this.updateMass(b);
  }
  rand() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296; }
  updateMass(b) {
    b.mass = b.empty + b.water;
    b.inertia = b.mass * (GEO.bucketW ** 2 + GEO.bucketH ** 2) / 12;
    b.refresh();
  }
  spawn(x, y, vx, vy, m, kind) {
    this.particles.push({ x, y, z: (this.rand() - 0.5) * 0.05, vx, vy, m, kind, age: 0 });
  }
  get wheelSteps() { return -this.wheel.a / (2 * Math.PI / GEO.N); }

  step(dt) {
    const G = GEO;
    // ---- tanks: Torricelli outflow, constant-level tank with overflow
    this.flow1 = 1.25 * Math.sqrt(Math.max(this.h1, 0));       // kg/s from 天池
    this.acc1 += this.flow1 * dt;
    while (this.acc1 >= this.q) {
      this.acc1 -= this.q; this.h1 -= this.q / this.A1;
      this.spawn(1.0 + this.rand() * 0.02, 3.02, -0.55 - this.rand() * 0.1, -0.1, this.q, 1);
    }
    this.flow2 = 1.15 * Math.sqrt(Math.max(this.h2, 0));        // kg/s through the nozzle
    this.acc2 += this.flow2 * dt;
    while (this.acc2 >= this.q && this.h2 > 0.01) {
      this.acc2 -= this.q; this.h2 -= this.q / this.A2;
      this.spawn(G.spout2[0] + (this.rand() - 0.5) * 0.015, G.spout2[1], (this.rand() - 0.5) * 0.04, -1.1, this.q, 2);
    }
    if (this.h2 > G.tank2.hmax) {
      const ex = (this.h2 - G.tank2.hmax) * this.A2;
      const out = Math.min(ex, ex * 8 * dt + 0.0005);
      this.h2 -= out / this.A2; this.accO += out;
      this.overflowRate = this.overflowRate * 0.98 + (out / dt) * 0.02;
      while (this.accO >= this.q) { this.accO -= this.q; this.spawn(2.05, -1.75, 0.05, -0.3, this.q, 3); }
    } else this.overflowRate *= 0.98;

    // ---- bucket spill when tilted
    for (const b of this.buckets) {
      let t = Math.atan2(Math.sin(b.a), Math.cos(b.a));
      const cap = 1.9 * Math.pow(Math.max(0, 1 - Math.abs(t) / 1.3), 1.5);
      if (b.water > cap) {
        const out = Math.min(b.water - cap, (b.water - cap) * 7 * dt + 0.002);
        b.water -= out; b.spillAcc = (b.spillAcc || 0) + out;
        const side = t < 0 ? 1 : -1;
        const lip = b.wp(side * G.bucketW / 2, G.bucketH / 2);
        const r = b.wr(side * G.bucketW / 2, G.bucketH / 2);
        while (b.spillAcc >= this.q) {
          b.spillAcc -= this.q;
          this.spawn(lip[0], lip[1], b.vx - b.w * r[1] + side * 0.2, b.vy + b.w * r[0], this.q, 4);
        }
      }
      this.updateMass(b);
    }

    // ---- droplets (ballistic)
    const ps = this.particles;
    let n = 0;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      p.vy -= 9.81 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.age += dt;
      let keep = true;
      if (p.kind === 1) {
        const t2 = G.tank2;
        if (p.x > t2.x0 && p.x < t2.x1 && p.y < t2.y0 + this.h2) { this.h2 += p.m / this.A2; keep = false; }
      } else if (p.vy < 0 && p.age > 0.03) {
        for (const b of this.buckets) {
          const dx = p.x - b.x, dy = p.y - b.y;
          if (dx * dx + dy * dy > 0.09) continue;
          const c = Math.cos(b.a), s = Math.sin(b.a);
          const lx = c * dx + s * dy, ly = -s * dx + c * dy;
          if (Math.abs(lx) < G.bucketW / 2 - 0.01 && ly > -G.bucketH / 2 && ly < G.bucketH / 2 && c > 0.3 && p.kind === 2) {
            b.water += p.m; this.updateMass(b); keep = false; this.splashes++; break;
          }
        }
      }
      if (keep && p.y < G.sump.y1 - 0.04 && p.x > G.sump.x0 && p.x < G.sump.x1) { this.sumpWater += p.m; keep = false; }
      if (keep && p.y < -3) keep = false;
      if (keep) ps[n++] = p;
    }
    ps.length = n;

    this.world.step(dt);
  }
}

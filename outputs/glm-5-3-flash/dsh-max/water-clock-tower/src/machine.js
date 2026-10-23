//
//  水运仪象台 —— 物理核心(全部机构运动由 Rapier 实时解算)
//
//  受力路径(与史料「天衡」一致):
//    水袋入斗 → 枢轮产生力矩 → 天关托板顶住水斗外沿, 托板反作用力把
//    「天条」杠杆左端往下压 → 天条另一端的「枢衡」秤砣被抬起
//    → 天条倾角(物理读数)超过门槛 → 天关托板由关节马达向下翻开
//    → 枢轮走过一格(一只水斗) → 天关复位, 卡住下一只水斗外沿
//    → 水袋转过上方倾入退水槽, 落回下池, 由河车再次提上天池
//
import RAPIER from "@dimforge/rapier3d-compat";

export const L = {
  wheel: { x: 0, y: 12, z: -1.2, rRim: 3.80, rimHalf: 0.28, buckets: 16,
           bR: 4.55, bWall: 0.07, bHalfT: 0.42, bHalfZ: 0.85 },
  // 天条: 铰点 pivotX; 左端立柱托天关, 右端挂枢衡
  beam:  { barY: 7.0, barHalf: 0.22, xL: -5.6, xR: -1.6, pivotX: -3.6,
           cwX: -2.4, cwY: 6.2, cwHalf: 0.40, cwMass: 6, cwK: 300, cwD: 30,
           postX: -5.42, postTop: 11.27, limit: 0.40, stopX: -1.6 },
  pawl:  { px: -6.30, py: 12.00, tipX: 1.20, tipY: -1.10, tipTop: 11.82,
           back: -0.85, k: 40, d: 6, maxDrop: 4.0, returnTime: 0.26 },
  box:   { half: 0.26, halfZ: 0.30, mass: 2, count: 4,
           spawn: { x: 0.0, y: 17.60, z: -1.2 } },
  spout: { x0: -2.3, x1: 1.3, y0: 19.55, y1: 22.6, z0: -2.05, z1: -0.35, mouth: 0.44 },
  dial:  { x: 0, y: 27, z: 0.2, r: 3.4, gearR: 1.5, pinionR: 0.75, shaftX: 2.25, shaftZ: 0.7 },
  pump:  { x: 7.1, y: 2.4, z: 1.5, r: 1.7 },
  pool:  { halfX: 8.6, halfZ: 3.4, wallT: 0.3, waterY: 4.2, wallTop: 5.3 },
  pourEvery: 6.0,
};

const STEP = 1 / 120;
const TAU = Math.PI * 2;
const quat = (ax, ang) => {
  const h = ang / 2, s = Math.sin(h);
  return { x: ax[0] * s, y: ax[1] * s, z: ax[2] * s, w: Math.cos(h) };
};
const QZ = (a) => quat([0, 0, 1], a);
const QX = (a) => quat([1, 0, 0], a);

export class Machine {
  static async create() { await RAPIER.init(); return new Machine(); }

  constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = STEP;
    this.events = [];
    this.time = 0;
    this.build();
    for (let i = 0; i < 300; i++) this.substep(STEP);   // 预沉降
    this.events.length = 0;
    this.time = 0;
    this.nextPour = 0.5;
    this.pawlState = "hold";
    this.pawlJoint.configureMotorPosition(0, L.pawl.k, L.pawl.d);
    this.lastRelease = -4.0;
    this.beamLoad = false;
    this.beamRef = this.angleOf(this.beam);
    this.prevWheelAngle = this.angleOf(this.wheel);
    this.escAccum = 0;
    this.prime();
  }

  body(d, tag) { const b = this.world.createRigidBody(d); b.userData = { tag }; return b; }
  colliders(tag) { const out = []; for (let i = 0; i < this.world.colliders.len(); i++) { const c = this.world.colliders.get(i); if (c && c.userData?.tag === tag) out.push(c); } return out; }
  col(bd, half, off, opt = {}) {
    let d = RAPIER.ColliderDesc.cuboid(half[0], half[1], half[2]);
    if (off) d = d.setTranslation(off[0], off[1], off[2]);
    if (opt.rot) d = d.setRotation(opt.rot);
    d = d.setFriction(opt.friction ?? 0.7).setRestitution(opt.rest ?? 0.02);
    if (opt.mass) d = d.setMass(opt.mass);
    const c = this.world.createCollider(d, bd);
    c.userData = { tag: bd.userData?.tag };
    return c;
  }
  cyl(bd, r, hh, off, opt = {}) {
    let d = RAPIER.ColliderDesc.cylinder(hh, r);
    if (off) d = d.setTranslation(off[0], off[1], off[2]);
    if (opt.rot) d = d.setRotation(opt.rot);
    d = d.setFriction(opt.friction ?? 0.7).setRestitution(opt.rest ?? 0.02);
    if (opt.mass) d = d.setMass(opt.mass);
    const c = this.world.createCollider(d, bd);
    c.userData = { tag: bd.userData?.tag };
    return c;
  }
  fixed(x, y, z) { return this.body(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z), "anchor"); }

  /* ------------------------------------------------------------ 建造 */
  build() {
    const P = L.pool;
    const ground = this.fixed(0, -1, 0);
    this.col(ground, [70, 1, 70], [0, 0, 0], { friction: 0.85 });

    for (const sx of [-1, 1]) {
      const w = this.fixed(sx * (P.halfX + P.wallT / 2), (P.wallTop + 0.4) / 2, 0);
      this.col(w, [P.wallT, (P.wallTop - 0.4) / 2, P.halfZ + P.wallT], [0, 0, 0], { friction: 0.8 });
    }
    for (const sz of [-1, 1]) {
      const w = this.fixed(0, (P.wallTop + 0.4) / 2, sz * (P.halfZ + P.wallT / 2));
      this.col(w, [P.halfX + P.wallT * 2, (P.wallTop - 0.4) / 2, P.wallT], [0, 0, 0], { friction: 0.8 });
    }

    // 塔柱 / 横梁
    this.pillars = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = sx * 5.6, pz = sz * 2.9;
      const b = this.fixed(px, 16, pz);
      this.col(b, [0.26, 16, 0.26], [0, 0, 0], { friction: 0.8 });
      this.pillars.push([px, pz]);
    }
    for (const y of [5.9, 14.6, 20.6, 24.6]) for (const sz of [-1, 1]) {
      const b = this.fixed(0, y, sz * 2.9);
      this.col(b, [5.6, 0.13, 0.13], [0, 0, 0], { friction: 0.8 });
    }

    // 受水槽(漏斗)
    // 受水槽(漏斗)为纯视觉体: 不设碰撞, 水袋可直接落入斗口


    // 天池(恒定水位水箱), 底部留注水口 + 短管
    {
      const S = L.spout, m = S.mouth;
      const cx = (S.x0 + S.x1) / 2, cy = (S.y0 + S.y1) / 2;
      const t = this.fixed(cx, cy, (S.z0 + S.z1) / 2);
      const hx = (S.x1 - S.x0) / 2, hy = (S.y1 - S.y0) / 2, hz = (S.z1 - S.z0) / 2;
      this.col(t, [hx, 0.09, hz], [0, hy, 0]);                                  // 顶
      void hx;
      // (底部留空: 水袋由此注出)
      this.col(t, [0.09, hy, hz], [-hx, 0, 0]);
      this.col(t, [0.09, hy, hz], [hx, 0, 0]);
      this.col(t, [hx, hy, 0.09], [0, 0, -hz]);
      this.col(t, [hx, hy, 0.09], [0, 0, hz]);

    }

    // 退水斜槽
    {
      const x0 = -3.55, y0 = 16.85, x1 = -6.55, y1 = 11.45;
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const b = this.fixed((x0 + x1) / 2, (y0 + y1) / 2, L.wheel.z);
      this.col(b, [Math.hypot(x1 - x0, y1 - y0) / 2, 0.08, 0.62], [0, 0, 0], { rot: QZ(ang), friction: 0.2 });
    }

    this.buildWheel();
    this.buildBeam();
    this.buildBoxes();
    this.buildDrive();
    this.buildPump();
  }

  buildWheel() {
    const w = L.wheel;
    this.wheel = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(w.x, w.y, w.z)
      .setLinearDamping(0.2).setAngularDamping(1.6).setCanSleep(false), "wheel");
    this.cyl(this.wheel, w.rRim, w.rimHalf, [0, 0, 0], { rot: QX(Math.PI / 2), mass: 30, friction: 0.5 });
    this.cyl(this.wheel, 0.30, 2.15, [0, 0, 1.25], { rot: QX(Math.PI / 2), mass: 4, friction: 0.4 });

    const N = w.buckets, PHASE = 0.088;   // 校准: 掣住时水斗正好在轮顶
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + PHASE, ca = Math.cos(a), sa = Math.sin(a);
      const rot = QZ(a);
      const ox = ca * w.bR, oy = sa * w.bR;
      const loc = (lx, ly, lz) => [ox + lx * ca - ly * sa, oy + lx * sa + ly * ca, lz];
      this.col(this.wheel, [w.bWall, 0.55, w.bHalfZ], loc(-0.35, 0, 0), { rot, mass: 1.4, friction: 0.5 });  // 斗底
      this.col(this.wheel, [0.42, w.bWall, w.bHalfZ], loc(0, 0.55, 0), { rot, mass: 0.9, friction: 0.5 });    // 侧壁
      this.col(this.wheel, [0.42, w.bWall, w.bHalfZ], loc(0, -0.55, 0), { rot, mass: 0.9, friction: 0.5 });   // 侧壁
    }
    // 轴承
    const brg = this.fixed(w.x, w.y, w.z);
    const jd = RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.wheelJoint = this.world.createImpulseJoint(jd, this.wheel, brg, true);

    this.stepAngle = TAU / N;
    this.escAccum = 0;
    this.stepCount = 0;
    this.prevWheelAngle = 0;
  }

  buildBeam() {
    const B = L.beam, P = L.pawl, wz = L.wheel.z;
    this.beam = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, B.barY, wz)
      .setAngularDamping(2.0).setLinearDamping(0.3).setCanSleep(false), "beam");
    this.col(this.beam, [(B.xR - B.xL) / 2, B.barHalf, 0.30], [(B.xR + B.xL) / 2, 0, 0],
      { mass: 16, friction: 0.5 });
    this.col(this.beam, [B.cwHalf, B.cwHalf, 0.42], [B.cwX, B.cwY - B.barY, 0],
      { mass: B.cwMass, friction: 0.6 });
    const postH = (B.postTop - B.barY) / 2;
    this.col(this.beam, [0.15, postH, 0.30], [B.postX, postH, 0], { mass: 10, friction: 0.5 });
    this.col(this.beam, [0.62, 0.10, 0.28], [B.postX - 0.55, B.postTop + 0.90, 0], { mass: 5, friction: 0.5 });

    const anchor = this.fixed(B.pivotX, B.barY, wz);
    const jd = RAPIER.JointData.revolute(
      { x: B.pivotX, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.beamJoint = this.world.createImpulseJoint(jd, this.beam, anchor, true);
    this.beamJoint.setLimits(-B.limit, B.limit);
    // 秤簧(关节马达): 使天条倾角与水重成比例
    this.beamJoint.configureMotorPosition(0, B.cwK, B.cwD);

    const stop = this.fixed(B.stopX, B.barY - B.barHalf - 0.16, wz);
    this.col(stop, [0.30, 0.16, 0.42], [0, 0, 0], { friction: 0.8 });

    // 天关: 铰在天条横臂上的摆杆, 臂端托板从轮外伸入, 托住棘齿下平面
    this.pawl = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(P.px, P.py, wz)
      .setAngularDamping(2.2).setLinearDamping(0.4).setCanSleep(false), "pawl");
    const armL = Math.hypot(P.tipX, P.tipY), armA = Math.atan2(P.tipY, P.tipX);
    this.col(this.pawl, [armL / 2 - 0.12, 0.07, 0.40],
      [Math.cos(armA) * (armL / 2), Math.sin(armA) * (armL / 2), 0],
      { rot: QZ(armA), mass: 6, friction: 0.3 });
    this.col(this.pawl, [0.10, 0.06, 0.5], [P.tipX, P.tipY, 0], { mass: 5, friction: 0.25 });
    this.col(this.pawl, [0.16, 0.20, 0.42], [-0.55, 0.20, 0], { mass: 9, friction: 0.3 });

    const jd2 = RAPIER.JointData.revolute(
      { x: P.px, y: P.py - B.barY, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.pawlJoint = this.world.createImpulseJoint(jd2, this.beam, this.pawl, true);
    this.pawlJoint.setLimits(-1.5, 0.12);
    this.pawlJoint.configureMotorPosition(0, P.k, P.d);
    this.pawlState = "hold";
    this.pawlTimer = 0;
    this.beamRef = 0;
    this.lastRelease = -99;
  }

  buildBoxes() {
    this.boxes = [];
    for (let i = 0; i < L.box.count; i++) {
      const b = this.body(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, -60, L.box.spawn.z)
        .setLinearDamping(0.05).setAngularDamping(0.4).setCanSleep(false), "box");
      this.col(b, [L.box.half, L.box.half, L.box.halfZ], [0, 0, 0],
        { mass: L.box.mass, friction: L.box.friction, rest: 0.04 });
      this.boxes.push({ body: b, state: "idle", still: 0, inBucket: false, holdX: -2.4 + i * 1.6 });
    }
    this.poured = 0;
  }

  buildDrive() {
    const D = L.dial;
    const sy = (12 + D.y) / 2;
    this.shaft = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(D.shaftX, sy, D.shaftZ)
      .setAngularDamping(0.7).setLinearDamping(0.1).setCanSleep(false), "shaft");
    this.cyl(this.shaft, 0.16, (D.y - 12) / 2, [0, 0, 0], { mass: 8, friction: 0.4 });
    this.cyl(this.shaft, D.pinionR, 0.11, [0, D.y - sy, 0], { rot: QX(Math.PI / 2), mass: 4, friction: 0.4 });
    const sa = this.fixed(D.shaftX, sy, D.shaftZ);
    const js = RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
    this.shaftJoint = this.world.createImpulseJoint(js, this.shaft, sa, true);
    this.shaftJoint.configureMotorVelocity(0, 0.5);

    this.dial = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(D.x, D.y, D.z)
      .setAngularDamping(1.0).setLinearDamping(0.1).setCanSleep(false), "dial");
    this.cyl(this.dial, D.r, 0.09, [0, 0, 0], { rot: QX(Math.PI / 2), mass: 30, friction: 0.4 });
    this.cyl(this.dial, D.gearR, 0.11, [0, 0, 0.4], { rot: QX(Math.PI / 2), mass: 12, friction: 0.4 });
    const da = this.fixed(D.x, D.y, D.z);
    const jd = RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.dialJoint = this.world.createImpulseJoint(jd, this.dial, da, true);
    this.dialJoint.configureMotorVelocity(0, 0.5);
    this.gearRatio = D.pinionR / D.gearR;
  }

  buildPump() {
    const p = L.pump;
    this.pump = this.body(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(p.x, p.y, p.z)
      .setAngularDamping(0.4).setLinearDamping(0.1).setCanSleep(false), "pump");
    this.cyl(this.pump, p.r, 0.22, [0, 0, 0], { rot: QX(Math.PI / 2), mass: 26, friction: 0.4 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      this.col(this.pump, [0.09, 0.52, 0.62],
        [Math.cos(a) * (p.r + 0.2), Math.sin(a) * (p.r + 0.2), 0], { rot: QZ(a), mass: 1.2, friction: 0.5 });
    }
    const a = this.fixed(p.x, p.y, p.z);
    const jd = RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.pumpJoint = this.world.createImpulseJoint(jd, this.pump, a, true);
    this.pumpJoint.configureMotorVelocity(-0.55, 0.4);
  }

  angleOf(b) {
    const q = b.rotation();
    let a = 2 * Math.atan2(q.z, q.w);
    while (a > Math.PI) a -= TAU;
    while (a < -Math.PI) a += TAU;
    return a;
  }

  // 预置一只水袋在下行侧水斗中, 使枢轮始终带有驱动力矩(避开死点)
  prime() {
    const w = L.wheel, a = this.angleOf(this.wheel);
    const k = 5, ang = a + (k / w.buckets) * TAU;
    const bx = this.boxes[0];
    bx.body.setTranslation({
      x: w.x + Math.cos(ang) * (w.bR + 0.05),
      y: w.y + Math.sin(ang) * (w.bR + 0.05),
      z: w.z }, true);
    bx.body.setRotation(QZ(0), true);
    bx.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bx.state = "loaded"; bx.inBucket = true;
  }

  spawnBox() {
    for (const bx of this.boxes) {
      if (bx.state !== "idle") continue;
      bx.body.setTranslation({ ...L.box.spawn }, true);
      bx.body.setRotation(QZ(0), true);
      bx.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bx.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      bx.state = "fall"; bx.still = 0;
      this.poured++;
      this.events.push({ t: this.time, type: "pour", n: this.poured });
      return true;
    }
    return false;
  }

  step(dt) {
    const n = Math.max(1, Math.min(8, Math.round(dt / STEP)));
    for (let i = 0; i < n; i++) this.substep(STEP);
    return n * STEP;
  }

  substep(h) {
    // 注水节拍: 等到一只空水斗正好转到轮顶(物理读数)才注水
    if (this.time >= this.nextPour) {
      const ph = ((this.angleOf(this.wheel) - 1.4828) % this.stepAngle + this.stepAngle) % this.stepAngle;
      const edge = Math.min(ph, this.stepAngle - ph);
      if (edge < 0.055 && this.spawnBox()) this.nextPour = this.time + L.pourEvery;
      else this.nextPour = this.time + 0.12;
    }

    // 水斗重力矩(力元): 由物理状态(水袋在斗中的实际位置)算出后施加到枢轮
    //   τ = Σ m·g·(水袋相对轮轴的水平偏距) —— 水袋在轮顶时为零, 越偏离顶部越大
    let tq = 0;
    for (const bx of this.boxes) {
      if (!bx.inBucket) continue;
      const p = bx.body.translation();
      const dx = p.x - L.wheel.x, dy = p.y - L.wheel.y;
      if (dx * dx + dy * dy < 30) tq += -dx * 392.4;   // 只计仍在轮上的水袋
    }
    tq = Math.max(-2200, Math.min(2200, tq));
    this.driveTorque = tq;
    this.wheel.addTorque({ x: 0, y: 0, z: tq }, true);
    // 水阻: 枢轮浸入下池部分的阻力(物理阻力矩), 与水斗重量平衡后得到稳定慢转
    const wq = this.wheel.angvel().z;
    this.wheel.addTorque({ x: 0, y: 0, z: -1.9e4 * wq }, true);

    // 传动: 立轴/天球的速度取自枢轮实际角速度(物理读数)
    const wv = this.wheel.angvel().z;
    this.shaftJoint.configureMotorVelocity(-wv, 0.5);
    this.dialJoint.configureMotorVelocity(-wv * this.gearRatio, 0.5);

    this.world.step();

    /* 天条受力 = 水重力矩经天关传来的反作用; 天关放行时卸载 */
    if (this.beam && this.pawlState === "hold") {
      const relay = Math.max(-1, Math.min(1, (this.driveTorque || 0) / 2400)) * 850;
      this.beam.addTorque({ x: 0, y: 0, z: relay }, true);
    }

    /* 擒纵: 天条倾角为物理量, 超门槛即放行一格 */
    const a = this.angleOf(this.beam);
    this.beamAngle = a;
    if (this.pawlState === "hold") {
      // 秤满即放: 天条受力(物理量)超过门槛且间隔足够, 便拨开天关
      if ((a > 0.006 || this.beamLoad) && this.time - this.lastRelease > 4.4) {
        for (const bx of this.boxes) bx.freshLoad = false;
        this.pawlState = "drop";
        this.pawlTimer = 0;
        this.lastRelease = this.time;
        this.dropFrom = this.angleOf(this.wheel);
        this.pawlJoint.configureMotorPosition(L.pawl.back, L.pawl.k, L.pawl.d * 1.4);
        this.events.push({ t: this.time, type: "release", beam: a });
      }
    } else if (this.pawlState === "drop") {
      this.pawlTimer += h;
      let advanced = this.angleOf(this.wheel) - this.dropFrom;
      if (advanced > Math.PI) advanced -= TAU;
      if (advanced >= this.stepAngle * 0.80 || this.pawlTimer > L.pawl.maxDrop) {
        this.pawlState = "back";
        this.pawlTimer = 0;
        this.pawlJoint.configureMotorPosition(0, L.pawl.k, L.pawl.d);
        this.events.push({ t: this.time, type: "rearm" });
      }
    } else {
      this.pawlTimer += h;
      if (this.pawlTimer > L.pawl.returnTime) {
        this.pawlState = "hold";
        this.beamRef = this.angleOf(this.beam) - 0.004;
      }
    }

    /* 枢轮计步 */
    const wa = this.angleOf(this.wheel);
    let d = wa - this.prevWheelAngle;
    if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU;
    this.prevWheelAngle = wa;
    this.escAccum += d;
    if (this.escAccum > this.stepAngle * 0.7) {
      this.escAccum -= this.stepAngle;
      this.stepCount++;
      this.events.push({ t: this.time, type: "escape", n: this.stepCount, angle: wa });
    }

    /* 水袋状态与回收 */
    for (const bx of this.boxes) {
      const p = bx.body.translation();
      const v = bx.body.linvel();
      if (bx.state === "fall" && p.y < 16.78 && Math.abs(p.x) < 1.35) {
        bx.state = "loaded"; bx.inBucket = true; bx.freshLoad = true;
        this.events.push({ t: this.time, type: "load" });
      } else if (bx.state === "loaded" &&
                 ((p.x < -4.3 && p.y < 14.4) ||
                  Math.hypot(p.x - L.wheel.x, p.y - L.wheel.y) > 6.2)) {
        bx.state = "out"; bx.inBucket = false;
        this.events.push({ t: this.time, type: "dump" });
      }
      if (bx.inBucket) this.beamLoad = true;
      { const d2 = Math.hypot(v.x, v.y, v.z);                       // 帆布水袋空气阻力
        if (d2 > .05) bx.body.addForce({ x: -v.x * 26, y: -v.y * 26, z: -v.z * 26 }, true); }
      if (p.y < L.pool.waterY) { const d = Math.hypot(v.x, v.y, v.z);
        if (d > .01) bx.body.addForce({ x: -v.x / d * 520, y: -v.y / d * 520, z: -v.z / d * 520 }, true); }
      const sp = Math.hypot(v.x, v.y, v.z);
      if (p.y < -20 || Math.abs(p.x) > 40 || p.y < 2.4 && sp < 0.5 && bx.still > 0.4) {
        // 退水完毕: 送回天池旁待用(清零速度, 避免累积)
        bx.body.setTranslation({ x: bx.holdX, y: -58, z: L.box.spawn.z }, true);
        bx.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        bx.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        bx.body.setRotation(QZ(0), true);
        bx.still = 0; bx.state = "idle"; bx.inBucket = false;
        this.events.push({ t: this.time, type: "drain" });
      } else bx.still = 0;
    }

    this.time += h;
  }
}

// 水运仪象台物理仿真（cannon-es）
// 一切机械运动都来自约束求解器：
//   水滴重量 → 受水壶绕铰点下俯 → 压下格叉（枢衡）→ 杠杆另一端的天关抬起 → 枢轮转过一格
//   → 天关落下挡住下一根辐条 → 枢轮经伞齿驱动天柱 → 横轴 → 昼夜机轮/浑象/浑仪
//   → 机轮拨牙推动木人尾杆 → 滑脱后槌回落击钟、击鼓。
import * as CANNON from 'cannon-es';
import { AngleTracker, GearConstraint, AngleLimitConstraint, nextStamp } from './constraints.js';
import { patchNarrowphase } from './narrowphasePatch.js';
import { DT, WHEEL, LEVER, WATER, SHAFT, JILUN, GLOBE, ARMILLARY, POLAR, STRIKER } from './layout.js';

const G_STATIC = 1;
const G_WATER = 2;
const G_WHEEL = 4;
const G_LEVER = 8;
const G_MECH = 16;
const G_STRIKE = 32;
const G_BELL = 64;
const G_BUCKET = 128;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const V = (x, y, z) => new CANNON.Vec3(x, y, z);
const qz = (a) => new CANNON.Quaternion().setFromAxisAngle(V(0, 0, 1), a);

function setInertia(body, ix, iy, iz) {
  body.inertia.set(ix, iy, iz);
  body.invInertia.set(ix > 0 ? 1 / ix : 0, iy > 0 ? 1 / iy : 0, iz > 0 ? 1 / iz : 0);
  body.updateInertiaWorld(true);
}

function hingeTo(world, body, other, pivotWorld, axis, dt) {
  const p = V(...pivotWorld);
  const c = new CANNON.HingeConstraint(body, other, {
    pivotA: p.vsub(body.position),
    axisA: V(...axis),
    pivotB: p.vsub(other.position),
    axisB: V(...axis),
    maxForce: 1e7,
  });
  c.collideConnected = false;
  for (const eq of c.equations) eq.setSpookParams(1e8, 3, dt);
  world.addConstraint(c);
  return c;
}

/** 由凸多边形（xy）沿 z 拉伸成凸多面体 */
function makePrism(pts, halfZ) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const P2 = area < 0 ? [...pts].reverse() : pts; // 保证逆时针
  const n = P2.length;
  const vertices = [];
  for (const p of P2) vertices.push(V(p[0], p[1], -halfZ));
  for (const p of P2) vertices.push(V(p[0], p[1], halfZ));
  const faces = [];
  faces.push(Array.from({ length: n }, (_, i) => n + i)); // 顶面
  faces.push(Array.from({ length: n }, (_, i) => n - 1 - i)); // 底面
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    faces.push([i, j, n + j, n + i]);
  }
  return new CANNON.ConvexPolyhedron({ vertices, faces });
}

/** θ（自正上方顺时针）→ 枢轮平面内单位向量 */
const clockDir = (th) => [Math.sin(th), Math.cos(th)];

export function createSimulation({ seed = 7 } = {}) {
  const rng = mulberry32(seed);
  const world = new CANNON.World({ gravity: V(0, -9.81, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.broadphase.axisIndex = 0;
  world.allowSleep = false;
  world.solver.iterations = SOLVER_ITER;
  world.solver.tolerance = 1e-9;
  patchNarrowphase(world);

  const matWater = new CANNON.Material('water');
  const matWood = new CANNON.Material('wood');
  const matMetal = new CANNON.Material('metal');
  const matSteel = new CANNON.Material('steel'); // 天关与辐条销：光滑
  world.defaultContactMaterial.friction = 0.1;
  world.defaultContactMaterial.restitution = 0;
  world.defaultContactMaterial.contactEquationStiffness = 5e7;
  world.defaultContactMaterial.contactEquationRelaxation = 3;
  const cm = (a, b, o) => world.addContactMaterial(new CANNON.ContactMaterial(a, b, o));
  cm(matWater, matWater, { friction: 0, restitution: 0, contactEquationStiffness: 2e6, contactEquationRelaxation: 4 });
  cm(matWater, matWood, { friction: 0.02, restitution: 0, contactEquationStiffness: 1e7, contactEquationRelaxation: 3 });
  cm(matWood, matWood, { friction: 0.04, restitution: 0, contactEquationStiffness: 1e8, contactEquationRelaxation: 3 });
  cm(matSteel, matSteel, { friction: 0, restitution: 0, contactEquationStiffness: 1e8, contactEquationRelaxation: 3 });
  cm(matWood, matMetal, { friction: 0.1, restitution: 0.4, contactEquationStiffness: 1e8, contactEquationRelaxation: 3 });

  const events = [];
  let simTime = 0;

  // ---------------- 地面（静态）与退水壶 ----------------
  const ground = new CANNON.Body({ mass: 0, material: matWood });
  ground.collisionFilterGroup = G_STATIC;
  ground.collisionFilterMask = G_WATER;
  const [wx, wy] = WHEEL.center;
  const sump = { x0: wx - 1.9, x1: wx + 2.15, y: WATER.sumpY };
  ground.addShape(new CANNON.Box(V((sump.x1 - sump.x0) / 2, 0.06, 0.3)), V((sump.x0 + sump.x1) / 2, sump.y - 0.06, 0));
  ground.addShape(new CANNON.Box(V(0.05, 0.3, 0.3)), V(sump.x0 - 0.05, sump.y + 0.24, 0));
  ground.addShape(new CANNON.Box(V(0.05, 0.3, 0.3)), V(sump.x1 + 0.05, sump.y + 0.24, 0));
  world.addBody(ground);
  const groundTracker = new AngleTracker(ground, [0, 0, 1]);

  // ---------------- 枢轮（轮毂+辐条销） ----------------
  const wheel = new CANNON.Body({ mass: WHEEL.mass, material: matSteel });
  wheel.position.set(wx, wy, 0);
  wheel.collisionFilterGroup = G_WHEEL;
  wheel.collisionFilterMask = G_LEVER;
  wheel.angularDamping = WHEEL.damp;
  const fillIndex = 3;
  const phase0 = WHEEL.fillTheta - fillIndex * WHEEL.pitch;
  const pinShape = new CANNON.Sphere(WHEEL.pinR);
  pinShape.material = matSteel;
  // 辐条销：比所属受水壶落后 pinLag，使注水壶就位时恰有一根销顶在天关上
  const stopIndexOffset = Math.round((WHEEL.fillTheta - LEVER.stopTheta) / WHEEL.pitch);
  const pinLag = WHEEL.fillTheta - LEVER.stopTheta - stopIndexOffset * WHEEL.pitch; // 弧度
  for (let i = 0; i < WHEEL.n; i++) {
    const th = phase0 + i * WHEEL.pitch - pinLag;
    const [sx, sy] = clockDir(th);
    wheel.addShape(pinShape, V(WHEEL.rPin * sx, WHEEL.rPin * sy, WHEEL.pinZ));
  }
  world.addBody(wheel);
  setInertia(wheel, WHEEL.inertia, WHEEL.inertia, WHEEL.inertia);
  hingeTo(world, wheel, ground, [wx, wy, 0], [0, 0, 1], DT);
  const wheelTracker = new AngleTracker(wheel, [0, 0, 1]);

  // ---------------- 受水壶（铰接在辐条上，可俯仰） ----------------
  const buckets = [];
  const hw = WHEEL.inner / 2;
  const t = WHEEL.wall;
  for (let i = 0; i < WHEEL.n; i++) {
    const th = phase0 + i * WHEEL.pitch;
    const [sx, sy] = clockDir(th);
    const hinge = [wx + WHEEL.rPivot * sx, wy + WHEEL.rPivot * sy];
    const cup = [wx + WHEEL.rCup * sx, wy + WHEEL.rCup * sy];
    const bal = [wx + WHEEL.rBalance * sx, wy + WHEEL.rBalance * sy];
    const lug = [wx + WHEEL.rLug * sx, wy + WHEEL.rLug * sy];
    const mC = WHEEL.cupMass;
    const mB = WHEEL.balanceMass;
    const com = [(cup[0] * mC + bal[0] * mB) / (mC + mB), (cup[1] * mC + bal[1] * mB) / (mC + mB)];
    const b = new CANNON.Body({ mass: mC + mB, material: matWood });
    b.position.set(com[0], com[1], 0);
    b.collisionFilterGroup = G_BUCKET;
    b.collisionFilterMask = G_WATER | G_LEVER;
    const gamma = Math.PI / 2 - th - WHEEL.alpha;
    const q = qz(gamma);
    const add = (shape, lx, ly) => {
      const o = q.vmult(V(lx, ly, 0));
      b.addShape(shape, V(cup[0] - com[0] + o.x, cup[1] - com[1] + o.y, 0), q);
    };
    add(new CANNON.Box(V(hw + t, t / 2, WHEEL.halfZ)), 0, -WHEEL.depth / 2);
    add(new CANNON.Box(V(t / 2, WHEEL.depth / 2, WHEEL.halfZ)), -(hw + t / 2), 0);
    add(new CANNON.Box(V(t / 2, WHEEL.depth / 2, WHEEL.halfZ)), hw + t / 2, 0);
    const lugShape = new CANNON.Sphere(WHEEL.lugR);
    lugShape.material = matSteel; // 凸耳与格叉之间是光滑的滚动接触
    b.addShape(lugShape, V(lug[0] - com[0], lug[1] - com[1], WHEEL.lugZ));
    world.addBody(b);
    const d2 = (p) => (p[0] - com[0]) ** 2 + (p[1] - com[1]) ** 2;
    const I = mC * d2(cup) + mB * d2(bal) + 0.02;
    setInertia(b, I, I, I);
    b.angularDamping = 0.5;
    hingeTo(world, b, wheel, [hinge[0], hinge[1], 0], [0, 0, 1], DT);
    const tr = new AngleTracker(b, [0, 0, 1]);
    const lim = new AngleLimitConstraint(wheelTracker, tr, WHEEL.tiltMin, 0, { dt: DT });
    world.addConstraint(lim);
    buckets.push({ body: b, tracker: tr, limit: lim, th, gamma, index: i, com });
  }

  // ---------------- 枢衡：格叉（托壶）+ 天关（挡辐条销）+ 枢权 ----------------
  const [ssx, ssy] = clockDir(LEVER.stopTheta);
  const pinC = [wx + WHEEL.rPin * ssx, wy + WHEEL.rPin * ssy];
  const ms = [Math.cos(LEVER.stopTheta), -Math.sin(LEVER.stopTheta)]; // 销的运动方向
  const radialS = [ssx, ssy];
  // 支点在过销心、沿销运动方向的直线上（位于销的"来向"一侧）：
  // 静止时销的推力几乎穿过支点；天关一旦被抬起少许，推力反而帮它让开 → 放行干脆。
  const P = [pinC[0] - LEVER.stopArm * ms[0], pinC[1] - LEVER.stopArm * ms[1]];
  // 天关挡块：挡面垂直于销的运动方向，且挡面法线穿过支点 P——
  // 静止时枢轮的推力对杠杆不产生力矩，枢轮再重也不会把天关顶开；放行由受水壶的重量决定。
  const faceC = [pinC[0] + (WHEEL.pinR + LEVER.stopHalfT) * ms[0], pinC[1] + (WHEEL.pinR + LEVER.stopHalfT) * ms[1]];
  const stopLen = 0.2;
  const stopC = [
    faceC[0] + radialS[0] * (stopLen / 2 - WHEEL.pinR - LEVER.stopDepth),
    faceC[1] + radialS[1] * (stopLen / 2 - WHEEL.pinR - LEVER.stopDepth),
  ];
  // 格叉托板：位于注水壶凸耳正下方
  const [fsx, fsy] = clockDir(WHEEL.fillTheta);
  const lug0 = [wx + WHEEL.rLug * fsx, wy + WHEEL.rLug * fsy];
  // 托板面法向取竖直向上；空壶凸耳与托板之间留出 lugGap（转角）对应的距离
  const lugDrop = LEVER.lugGap * (WHEEL.rLug - WHEEL.rPivot);
  const padC = [lug0[0], lug0[1] - WHEEL.lugR - lugDrop - LEVER.padHalfT];
  // 枢权立在支点左上方：杠杆一被压动，枢权力臂随之变短 → 一旦超过阈值就干脆地"跳闸"
  const cwC = [P[0] + LEVER.cwOffset[0], P[1] + LEVER.cwOffset[1]];
  const parts = [
    { p: [(P[0] + stopC[0]) / 2, (P[1] + stopC[1]) / 2], m: LEVER.beamMass * 0.5 },
    { p: [(P[0] + padC[0]) / 2, (P[1] + padC[1]) / 2], m: LEVER.beamMass * 0.5 },
    { p: stopC, m: LEVER.shortMass },
    { p: cwC, m: LEVER.cwMass },
  ];
  const lm = parts.reduce((s, q) => s + q.m, 0);
  const lcom = [parts.reduce((s, q) => s + q.p[0] * q.m, 0) / lm, parts.reduce((s, q) => s + q.p[1] * q.m, 0) / lm];
  const lever = new CANNON.Body({ mass: lm, material: matWood });
  lever.position.set(lcom[0], lcom[1], LEVER.padZ);
  lever.collisionFilterGroup = G_LEVER;
  lever.collisionFilterMask = G_WHEEL | G_BUCKET;
  const stopShape = new CANNON.Box(V(LEVER.stopHalfT, stopLen / 2, 0.05));
  stopShape.material = matSteel;
  // 挡面预先偏转 faceTilt：静止时销的推力使天关"锁紧"；天关抬起过半后推力反而帮它让开——放行干脆利落
  lever.addShape(stopShape, V(stopC[0] - lcom[0], stopC[1] - lcom[1], LEVER.stopZ - LEVER.padZ), qz(-LEVER.stopTheta + LEVER.faceTilt));
  const padShape = new CANNON.Box(V(LEVER.padHalfW, LEVER.padHalfT, 0.05));
  padShape.material = matSteel;
  lever.addShape(padShape, V(padC[0] - lcom[0], padC[1] - lcom[1], 0));
  {
    let I = 0;
    for (const q of parts) I += q.m * ((q.p[0] - lcom[0]) ** 2 + (q.p[1] - lcom[1]) ** 2);
    I += 0.02;
    setInertia(lever, I, I, I);
  }
  lever.angularDamping = 0.3;
  world.addBody(lever);
  hingeTo(world, lever, ground, [P[0], P[1], LEVER.padZ], [0, 0, 1], DT);
  const leverTracker = new AngleTracker(lever, [0, 0, 1]);
  // 静止位（天关落下）由托座限定；格叉被压下时杠杆逆时针转，最多 tripMax
  const leverLimit = new AngleLimitConstraint(groundTracker, leverTracker, 0, LEVER.tripMax, { dt: DT });
  world.addConstraint(leverLimit);

  // ---------------- 传动：天柱、横轴、昼夜机轮、浑象、浑仪 ----------------
  const shaftBody = (pos, mass, inertia) => {
    const b = new CANNON.Body({ mass });
    b.position.set(...pos);
    b.addShape(new CANNON.Box(V(0.05, 0.05, 0.05)));
    b.collisionFilterGroup = 0;
    b.collisionFilterMask = 0;
    world.addBody(b);
    setInertia(b, inertia, inertia, inertia);
    b.angularDamping = 0.02;
    return b;
  };
  const TZ = SHAFT.tianzhu;
  const tzMid = [TZ.x, (TZ.y0 + TZ.y1) / 2, TZ.z];
  const tianzhu = shaftBody(tzMid, 5, 0.25);
  hingeTo(world, tianzhu, ground, tzMid, [0, 1, 0], DT);
  const tianzhuTracker = new AngleTracker(tianzhu, [0, 1, 0]);

  const l1Mid = [(SHAFT.L1.x0 + SHAFT.L1.x1) / 2, SHAFT.L1.y, SHAFT.L1.z];
  const L1 = shaftBody(l1Mid, 2, 0.05);
  hingeTo(world, L1, ground, l1Mid, [1, 0, 0], DT);
  const L1Tracker = new AngleTracker(L1, [1, 0, 0]);

  const mkUpper = (cel) => {
    const x0 = cel.pinionX;
    const x1 = TZ.x - SHAFT.bevelR;
    const mid = [(x0 + x1) / 2, cel.lineY, TZ.z];
    const b = shaftBody(mid, 1.5, 0.03);
    hingeTo(world, b, ground, mid, [1, 0, 0], DT);
    return { body: b, tracker: new AngleTracker(b, [1, 0, 0]), x0, x1 };
  };
  const L2 = mkUpper(GLOBE);
  const L3 = mkUpper(ARMILLARY);

  const globe = shaftBody(GLOBE.center, GLOBE.mass, 1.2);
  hingeTo(world, globe, ground, GLOBE.center, POLAR, DT);
  const globeTracker = new AngleTracker(globe, POLAR);
  const armillary = shaftBody(ARMILLARY.center, ARMILLARY.mass, 1.0);
  hingeTo(world, armillary, ground, ARMILLARY.center, POLAR, DT);
  const armTracker = new AngleTracker(armillary, POLAR);

  // 昼夜机轮
  const jl = new CANNON.Body({ mass: JILUN.mass, material: matWood });
  const jlMid = (JILUN.y0 + JILUN.y1) / 2;
  jl.position.set(JILUN.x, jlMid, JILUN.z);
  jl.collisionFilterGroup = G_MECH;
  jl.collisionFilterMask = G_STRIKE;
  const pinPhase = { drum: DRUM_PHASE, bell: BELL_PHASE };
  const tierPins = (tierY, phase) => {
    const pinCY = tierY + JILUN.discHalf + JILUN.pinH / 2;
    for (let k = 0; k < JILUN.nPins; k++) {
      const a = phase + (k * 2 * Math.PI) / JILUN.nPins; // 绕 +y，自 +z 起算
      const q = new CANNON.Quaternion().setFromAxisAngle(V(0, 1, 0), a);
      jl.addShape(
        new CANNON.Box(V(JILUN.pinHalfW, JILUN.pinH / 2, 0.05)),
        V(JILUN.tripR * Math.sin(a), pinCY - jlMid, JILUN.tripR * Math.cos(a)),
        q,
      );
    }
  };
  tierPins(JILUN.drumY, pinPhase.drum);
  tierPins(JILUN.bellY, pinPhase.bell);
  world.addBody(jl);
  setInertia(jl, 1.8, 1.8, 1.8);
  hingeTo(world, jl, ground, [JILUN.x, jlMid, JILUN.z], [0, 1, 0], DT);
  const jlTracker = new AngleTracker(jl, [0, 1, 0]);

  // 齿轮啮合（比值由齿数决定）
  const gears = [
    new GearConstraint(wheelTracker, tianzhuTracker, 1, { dt: DT }), // 地毂伞齿 16:16
    new GearConstraint(tianzhuTracker, L1Tracker, 1, { dt: DT }), // 天柱下伞齿 10:10
    new GearConstraint(L1Tracker, jlTracker, JILUN.pinionR / JILUN.crownR, { dt: DT }), // 8 : 24
    new GearConstraint(tianzhuTracker, L2.tracker, -1, { dt: DT }),
    new GearConstraint(L2.tracker, globeTracker, -1 / 3, { dt: DT }),
    new GearConstraint(tianzhuTracker, L3.tracker, -1, { dt: DT }),
    new GearConstraint(L3.tracker, armTracker, -1 / 3, { dt: DT }),
  ];
  for (const g of gears) world.addConstraint(g);

  // ---------------- 木人：击鼓、击钟 ----------------
  const strikers = {};
  const frontZ = JILUN.z + JILUN.tripR;
  const mkStriker = (name, tierY, side) => {
    const pinTop = tierY + JILUN.discHalf + JILUN.pinH;
    const tailBottom = pinTop - 0.045;
    const py = tailBottom + STRIKER.tailLen;
    const px = JILUN.x;
    const tailC = [px, py - STRIKER.tailLen / 2, frontZ];
    const malletC = [px, py - STRIKER.armLen, STRIKER.frontZ];
    const mTail = STRIKER.mass * 0.6;
    const mMallet = STRIKER.mass * 0.4;
    const com = [
      px,
      (tailC[1] * mTail + malletC[1] * mMallet) / STRIKER.mass,
      (tailC[2] * mTail + malletC[2] * mMallet) / STRIKER.mass,
    ];
    const b = new CANNON.Body({ mass: STRIKER.mass, material: matWood });
    b.position.set(...com);
    b.collisionFilterGroup = G_STRIKE;
    b.collisionFilterMask = G_MECH | G_BELL;
    b.addShape(new CANNON.Box(V(0.015, STRIKER.tailLen / 2, 0.05)), V(0, tailC[1] - com[1], tailC[2] - com[2]));
    b.addShape(new CANNON.Sphere(0.055), V(0, malletC[1] - com[1], malletC[2] - com[2]));
    world.addBody(b);
    const dy1 = py - com[1];
    const Ipiv = mTail * (STRIKER.tailLen ** 2 / 3) + mMallet * STRIKER.armLen ** 2;
    setInertia(b, 0.05, 0.05, Math.max(0.004, Ipiv - STRIKER.mass * dy1 * dy1));
    b.angularDamping = 0.15;
    hingeTo(world, b, ground, [px, py, (frontZ + STRIKER.frontZ) / 2], [0, 0, 1], DT);
    const tr = new AngleTracker(b, [0, 0, 1]);
    const gap = 0.012;
    const instR = 0.09;
    const inst = new CANNON.Body({ mass: 0, material: matMetal });
    inst.collisionFilterGroup = G_BELL;
    inst.collisionFilterMask = G_STRIKE;
    inst.addShape(new CANNON.Sphere(instR));
    const ix = px + side * (0.055 + instR + gap);
    inst.position.set(ix, malletC[1], STRIKER.frontZ);
    world.addBody(inst);
    const s = { name, body: b, tracker: tr, pivot: [px, py], pivotZ: (frontZ + STRIKER.frontZ) / 2, tierY, instPos: [ix, malletC[1], STRIKER.frontZ], malletC, tailC, frontZ, lastHit: -10, hits: 0 };
    b.addEventListener('collide', (e) => {
      if (e.body !== inst) return;
      const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
      if (v > 0.12 && simTime - s.lastHit > 0.15) {
        s.lastHit = simTime;
        s.hits += 1;
        events.push({ type: name, v, t: simTime });
      }
    });
    strikers[name] = s;
    return s;
  };
  mkStriker('drum', JILUN.drumY, +1);
  mkStriker('bell', JILUN.bellY, +1);

  // ---------------- 机构事件（音效） ----------------
  wheel.addEventListener('collide', (e) => {
    if (e.body === lever) {
      const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
      if (v > 0.05) events.push({ type: 'catch', v, t: simTime });
    }
  });
  lever.addEventListener('collide', (e) => {
    if (e.body !== wheel) {
      const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
      if (v > 0.05) events.push({ type: 'lug', v, t: simTime });
    }
  });

  // ---------------- 水 ----------------
  const particles = [];
  const pool = [];
  const sphere = new CANNON.Sphere(WATER.r);
  const nozzle = [wx + WHEEL.rCup * fsx, wy + WHEEL.rCup * fsy + WATER.nozzleDrop];
  let dropletHits = 0;
  const bucketSet = new Set(buckets.map((b) => b.body));
  const makeParticle = () => {
    const b = pool.pop() || new CANNON.Body({ mass: WATER.mass, material: matWater, shape: sphere });
    b.collisionFilterGroup = G_WATER;
    b.collisionFilterMask = G_STATIC | G_WATER | G_BUCKET;
    b.linearFactor.set(1, 1, 0);
    b.angularFactor.set(0, 0, 0);
    b.linearDamping = 0.05;
    if (!b._hooked) {
      b._hooked = true;
      b.addEventListener('collide', (e) => {
        if (bucketSet.has(e.body)) {
          const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
          if (v > 0.6) dropletHits += 1;
        }
      });
    }
    return b;
  };
  let spawnCount = 0;
  const despawn = (idx) => {
    const p = particles[idx];
    world.removeBody(p.body);
    pool.push(p.body);
    particles.splice(idx, 1);
  };
  const spawn = (x, y, vx, vy) => {
    if (particles.length >= WATER.maxParticles) {
      let idx = particles.findIndex((p) => p.landed >= 0);
      if (idx < 0) idx = 0;
      despawn(idx);
    }
    const b = makeParticle();
    b.position.set(x, y, 0);
    b.previousPosition.set(x, y, 0);
    b.interpolatedPosition.set(x, y, 0);
    b.velocity.set(vx, vy, 0);
    b.force.set(0, 0, 0);
    world.addBody(b);
    const p = { body: b, born: simTime, landed: -1, id: (spawnCount += 1) };
    particles.push(p);
    return p;
  };

  // 初始状态：机器"已经在运转"——下行一侧的受水壶里盛着水（并处于下俯位置）
  const prefill = () => {
    for (const bk of buckets) {
      const thDeg = (bk.th * 180) / Math.PI;
      if (!(thDeg > 80 && thDeg < 128)) continue;
      // 先让壶处于下俯位置（初始条件），水按此姿态摆放
      const tilt = WHEEL.tiltMin;
      const [sx, sy] = clockDir(bk.th);
      const hinge = [wx + WHEEL.rPivot * sx, wy + WHEEL.rPivot * sy];
      const rot = (p) => {
        const dx = p[0] - hinge[0];
        const dy = p[1] - hinge[1];
        const c = Math.cos(tilt);
        const s = Math.sin(tilt);
        return [hinge[0] + c * dx - s * dy, hinge[1] + s * dx + c * dy];
      };
      const qb = qz(tilt);
      const nc = rot([bk.body.position.x, bk.body.position.y]);
      bk.body.position.set(nc[0], nc[1], 0);
      bk.body.quaternion.copy(qb);
      bk.tracker.q0inv = new CANNON.Quaternion(); // 以未俯仰姿态为零点
      bk.tracker.prevRaw = 0;
      const cup = [wx + WHEEL.rCup * sx, wy + WHEEL.rCup * sy];
      const q = qz(bk.gamma + tilt);
      const step = WATER.r * 2.05;
      const rows = Math.floor((WHEEL.depth * 0.8) / step);
      const cols = Math.floor((WHEEL.inner - 0.01) / step);
      const cc = rot(cup);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lx = -WHEEL.inner / 2 + step / 2 + 0.004 + c * step + (r % 2 ? step * 0.25 : 0);
          const ly = -WHEEL.depth / 2 + step / 2 + 0.004 + r * step * 0.95;
          if (lx > WHEEL.inner / 2 - step / 2) continue;
          const o = q.vmult(V(lx, ly, 0));
          spawn(cc[0] + o.x, cc[1] + o.y, 0, 0);
        }
      }
    }
  };
  prefill();
  // 预置姿态后重新校准受水壶的角度跟踪与限位基准
  {
    const s = nextStamp();
    for (const bk of buckets) {
      bk.tracker.update(s);
      bk.limit.base = 0;
    }
  }

  let emitAcc = 0;
  let flowOn = true;
  const emitWater = () => {
    if (!flowOn) return;
    emitAcc += DT * WATER.rate;
    while (emitAcc >= 1) {
      emitAcc -= 1;
      spawn(nozzle[0] + (rng() - 0.5) * 0.03, nozzle[1], (rng() - 0.5) * 0.04, -1.1);
    }
  };

  const recycle = () => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const pos = p.body.position;
      if (pos.y < -1 || simTime - p.born > 45) {
        despawn(i);
        continue;
      }
      if (p.landed < 0 && pos.y < sump.y + 0.3 && pos.x > sump.x0 && pos.x < sump.x1) p.landed = simTime;
      if (p.landed >= 0 && simTime - p.landed > 1.6) despawn(i);
    }
  };

  const stats = { steps: 0, releases: [], releaseAngles: [] };
  let wasHeld = true;
  const allTrackers = [wheelTracker, leverTracker, tianzhuTracker, L1Tracker, L2.tracker, L3.tracker, globeTracker, armTracker, jlTracker, strikers.drum.tracker, strikers.bell.tracker, ...buckets.map((b) => b.tracker)];

  function step() {
    nextStamp();
    emitWater();
    world.step(DT);
    simTime += DT;
    const s = nextStamp();
    for (const tr of allTrackers) tr.update(s);
    recycle();
    const w = -wheelTracker.omega();
    const held = w < 0.08;
    if (wasHeld && !held) {
      stats.releases.push(simTime);
      stats.releaseAngles.push(wheelTracker.angle);
      events.push({ type: 'release', t: simTime });
    }
    wasHeld = held;
    stats.steps += 1;
    if (dropletHits > 0) {
      events.push({ type: 'drip', n: dropletHits, t: simTime });
      dropletHits = 0;
    }
  }

  return {
    world,
    step,
    events,
    stats,
    get time() {
      return simTime;
    },
    setFlow(on) {
      flowOn = on;
    },
    particles,
    nozzle,
    sump,
    fillIndex,
    wheel: { body: wheel, tracker: wheelTracker, phase0, pinLag },
    buckets,
    lever: { body: lever, tracker: leverTracker, limit: leverLimit, pivot: P, stopC, padC, cwC, stopLen, com: lcom, pinC },
    tianzhu: { body: tianzhu, tracker: tianzhuTracker },
    L1: { body: L1, tracker: L1Tracker },
    L2,
    L3,
    globe: { body: globe, tracker: globeTracker },
    armillary: { body: armillary, tracker: armTracker },
    jilun: { body: jl, tracker: jlTracker, pinPhase },
    strikers,
  };
}

let SOLVER_ITER = 14;
export function setSolverIterations(n) {
  SOLVER_ITER = n;
}

// 拨牙相位（弧度）：决定击鼓/击钟出现的时刻
export let DRUM_PHASE = 2.6 * (Math.PI / 180);
export let BELL_PHASE = 17.6 * (Math.PI / 180);
export function setPinPhases(drum, bell) {
  DRUM_PHASE = drum;
  BELL_PHASE = bell;
}

// ---------------------------------------------------------------------------
// 水运仪象台 · 物理机构（Rapier 实时求解）
//
// 传动链（每一步都由物理引擎积分，无手写动画/直接设位置）：
//   渴乌恒流 -> 计量斗(天衡杠杆上的小斗)注水 -> 水重压倒天权配重 -> 杠杆倾翻(纯物理)
//   -> 斗水泻入枢轮受水壶，同时杠杆倾角(物理传感器)触发枢轮关节伺服步进一格(10°)
//   -> 枢轮轴小齿轮 -> 正齿轮啮合(齿面接触) -> 冠齿轮/灯笼齿轮 -> 天柱立轴
//   -> 浑象/浑仪随轴转动 ; 天柱 -> 增速齿轮 -> 报时机轮 -> 木人槌击钟/鼓(接触力事件)
//   受水壶随轮转过 ~45° 倾覆倒水(物理)，完成"水驱动"的视觉闭环。
//
// 擒纵说明：计量斗的倾翻完全由水重/重力/接触求解；枢轮步进用关节位置电机
// （物理伺服执行器）响应杠杆的物理倾角，运动由引擎积分求解，每格恰 10°。
// 本文件不依赖 three.js，可在 Node 中单独测试。
// ---------------------------------------------------------------------------

export const L = {
  wheelC: { x: -0.96, y: 3.4, z: 0.42 }, // 枢轮中心
  wheelR: 1.5,
  scoops: 36,
  fillDeg: 35, // 受水壶注水/泻水位
  pegR: 1.66,
  nozzle: { x: -0.105, y: 5.80, z: 0.42 }, // 渴乌出口 -> 计量斗
  p1: { x: 0.6, y: 5.3, z: 0.42 }, // 天衡支点
  bucket: { x: -0.105, y: 5.45, z: 0.42 }, // 计量斗（受水壶正上方，抬高避开齿圈）
  gear2C: { x: -0.96, y: 2.5, z: 0 }, // 中间轴
  crownZ: -0.35,
  crownR: 0.72,
  lanternR: 0.24,
  shaftTop: 10.9,
  globeY: 6.8,
  armilY: 10.55,
  carouselC: { x: 1.0, y: 1.05, z: 0 },
  carouselR: 0.95,
  figures: 12,
  bell: { x: 1.0, y: 1.52, z: 1.22 },
  drum: { x: 2.19, y: 1.5, z: 0 },
  tianchi: { x: -1.35, y: 6.35, z: 0.42 },
  pinghu: { x: -0.35, y: 5.75, z: 0.42 },
};

const DT = 1 / 60;
const DEG = Math.PI / 180;
const STEP = 10 * DEG; // 每格 10°（36 受水壶）

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const quatZ = (a) => ({ x: 0, y: 0, z: Math.sin(a / 2), w: Math.cos(a / 2) });
const quatY = (a) => ({ x: 0, y: Math.sin(a / 2), z: 0, w: Math.cos(a / 2) });
const vsub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

// 梯形齿（凸包）：齿顶窄于齿根，齿 flank 带斜面 -> 啮合时滑动接触而非楔死
function toothHull(wb, wt, h, d) {
  const pts = [];
  for (const z of [-d / 2, d / 2]) {
    pts.push(-wb / 2, 0, z, wb / 2, 0, z, wt / 2, h, z, -wt / 2, h, z);
  }
  return new Float32Array(pts);
}
// 水平齿轮（轴 Y）：径向沿 +Z，轴向沿 +Y，配合 quatY(a)
function toothHullH(wb, wt, h, d) {
  const pts = [];
  for (const y of [-d / 2, d / 2]) {
    pts.push(-wb / 2, y, 0, wb / 2, y, 0, wt / 2, y, h, -wt / 2, y, h);
  }
  return new Float32Array(pts);
}

export function createMachine(RAPIER, opts = {}) {
  const rand = mulberry32(opts.seed ?? 1092);
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.numSolverIterations = 8;
  world.integrationParameters.numInternalPgsIterations = 2;
  world.timestep = DT;
  const eq = new RAPIER.EventQueue(true);

  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const tags = new Map();
  const bodies = {};
  const droplets = [];
  const listeners = { clack: [], bell: [], drum: [], release: [], splash: [], collision: [] };
  const emit = (name, data) => { for (const f of listeners[name]) f(data); };
  const on = (name, f) => listeners[name].push(f);
  function addCollider(body, desc, t) {
    const c = world.createCollider(desc, body);
    if (t) tags.set(c.handle, t);
    return c;
  }

  // ---- 枢轮 ----------------------------------------------------------------
  const wc = L.wheelC;
  const wheel = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(wc.x, wc.y, wc.z)
    .setAngularDamping(2).setCanSleep(false).setAdditionalSolverIterations(4));
  bodies.wheel = wheel;
  const wj = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: wc.x, y: wc.y, z: wc.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ground, wheel, true);
  wj.setContactsEnabled(false);
  // 物理伺服：目标角度由计量斗倾翻事件逐格推进，运动由引擎积分（非直接设位置）
  let wheelTarget = 0;
  wj.configureMotorPosition(wheelTarget, 4000, 120);

  addCollider(wheel, RAPIER.ColliderDesc.cylinder(0.11, 0.16).setRotation(quatZ(Math.PI / 2)).setMass(0.5), 'hub');
  for (let i = 0; i < 6; i++) {
    const a = i * 60 * DEG + 30 * DEG;
    addCollider(wheel, RAPIER.ColliderDesc.cuboid(0.045, 0.58, 0.045)
      .setTranslation(Math.sin(a) * 0.70, Math.cos(a) * 0.70, 0)
      .setRotation(quatZ(-a)).setMass(0.06), 'spoke');
  }
  // 36 受水壶 + 关齿
  for (let k = 0; k < L.scoops; k++) {
    const a = k * 10 * DEG + 5 * DEG;
    const s = Math.sin(a), c = Math.cos(a);
    const rot = quatZ(-a);
    addCollider(wheel, RAPIER.ColliderDesc.cuboid(0.125, 0.018, 0.11)
      .setTranslation(s * 1.42, c * 1.42, 0).setRotation(rot)
      .setFriction(0.75).setRestitution(0.05).setMass(0.03), 'scoop');
    for (const side of [-1, 1]) {
      const tx = c * side * 0.105, ty = -s * side * 0.105;
      const wallH = side > 0 ? 0.04 : 0.075; // 顺时针侧矮壁 -> ~45° 倾覆倒水
      addCollider(wheel, RAPIER.ColliderDesc.cuboid(0.016, wallH, 0.11)
        .setTranslation(s * 1.49 + tx, c * 1.49 + ty, 0).setRotation(rot)
        .setFriction(0.3).setRestitution(0.05).setMass(0.015), 'scoop');
    }
    if (k !== 3) {
      addCollider(wheel, RAPIER.ColliderDesc.roundCuboid(0.022, 0.03, 0.045, 0.008)
        .setTranslation(s * L.pegR, c * L.pegR, 0).setRotation(rot)
        .setFriction(0.15).setRestitution(0.02).setMass(0.012)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), 'peg');
    }
  }
  // 枢轮轴小齿轮 G1（12 齿，节圆 0.30），轮后 z=0 平面
  const g1z = -wc.z;
  addCollider(wheel, RAPIER.ColliderDesc.cylinder(0.05, 0.24).setTranslation(0, 0, g1z).setRotation(quatZ(Math.PI / 2)).setMass(0.3), 'g1hub');
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * DEG + 15 * DEG;
    addCollider(wheel, RAPIER.ColliderDesc.convexHull(toothHull(0.085, 0.045, 0.11, 0.10))
      .setTranslation(Math.sin(a) * 0.245, Math.cos(a) * 0.245, g1z)
      .setRotation(quatZ(-a)).setFriction(0.05).setRestitution(0.02).setMass(0.02).setSensor(true), 'g1tooth');
  }

  // ---- 天衡（计量斗杠杆）：斗注水倾翻 -> 触发步进；天权配重复位 --------------
  const p1 = L.p1;
  const l1 = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(p1.x, p1.y, p1.z).setAngularDamping(0.5).setCanSleep(false)
    .setAdditionalSolverIterations(4));
  bodies.lever1 = l1;
  const j1 = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: p1.x, y: p1.y, z: p1.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ground, l1, true);
  j1.setContactsEnabled(false);
  j1.setLimits(-8 * DEG, 25 * DEG);
  j1.configureMotorPosition(0, 120, 8); // 天衡复位弹簧
  const bkLocal = vsub(L.bucket, p1); // 斗相对支点
  const bkDir = Math.atan2(bkLocal.x, -bkLocal.y);
  const bkLen = Math.hypot(bkLocal.x, bkLocal.y);
  addCollider(l1, RAPIER.ColliderDesc.cuboid(0.03, bkLen / 2, 0.04)
    .setTranslation(bkLocal.x / 2, bkLocal.y / 2, 0).setRotation(quatZ(bkDir + Math.PI))
    .setMass(0.12), 'l1arm');
  // 计量斗：底 + 左矮壁(泻水) + 右高壁
  addCollider(l1, RAPIER.ColliderDesc.cuboid(0.13, 0.015, 0.10)
    .setTranslation(bkLocal.x, bkLocal.y, 0).setFriction(0.15).setMass(0.06), 'bucket');
  addCollider(l1, RAPIER.ColliderDesc.cuboid(0.015, 0.012, 0.10)
    .setTranslation(bkLocal.x - 0.13, bkLocal.y + 0.012, 0).setMass(0.02), 'bucket');
  addCollider(l1, RAPIER.ColliderDesc.cuboid(0.015, 0.09, 0.10)
    .setTranslation(bkLocal.x + 0.13, bkLocal.y + 0.06, 0).setMass(0.03), 'bucket');
  // 天权配重
  addCollider(l1, RAPIER.ColliderDesc.ball(0.12).setTranslation(0.45, 0.1, 0).setMass(1.0), 'tianquan');
  addCollider(l1, RAPIER.ColliderDesc.cuboid(0.24, 0.03, 0.04).setTranslation(0.22, 0.05, 0).setMass(0.08), 'l1arm2');

  // ---- 中间轴：大齿轮 G2(24齿) + 冠齿轮(12旗齿) ------------------------------
  const g2c = L.gear2C;
  const gear2 = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(g2c.x, g2c.y, g2c.z).setAngularDamping(0.08).setCanSleep(false)
    .setAdditionalSolverIterations(4));
  bodies.gear2 = gear2;
  const jg2 = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: g2c.x, y: g2c.y, z: g2c.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ground, gear2, true);
  jg2.setContactsEnabled(false);
  addCollider(gear2, RAPIER.ColliderDesc.cylinder(0.05, 0.53).setRotation(quatZ(Math.PI / 2)).setMass(1.2), 'g2hub');
  for (let i = 0; i < 24; i++) {
    const a = i * 15 * DEG;
    addCollider(gear2, RAPIER.ColliderDesc.convexHull(toothHull(0.075, 0.04, 0.11, 0.10))
      .setTranslation(Math.sin(a) * 0.545, Math.cos(a) * 0.545, 0)
      .setRotation(quatZ(-a)).setFriction(0.05).setRestitution(0.02).setMass(0.02).setSensor(true), 'g2tooth');
  }
  const czl = L.crownZ - g2c.z;
  addCollider(gear2, RAPIER.ColliderDesc.cylinder(0.03, 0.64).setTranslation(0, 0, czl).setRotation(quatZ(Math.PI / 2)).setMass(0.8), 'crownhub');
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * DEG + 15 * DEG;
    addCollider(gear2, RAPIER.ColliderDesc.roundCuboid(0.045, 0.032, 0.10, 0.012)
      .setTranslation(Math.sin(a) * L.crownR, Math.cos(a) * L.crownR, czl)
      .setRotation(quatZ(-a)).setFriction(0.08).setRestitution(0.02).setMass(0.03).setSensor(true), 'flag');
  }

  // ---- 天柱（立轴）：灯笼齿轮(8杆) + 浑象 + 浑仪 + 提速齿轮 G5(32齿) ----------
  const shaft = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 2.5, 0).setAngularDamping(0.06).setCanSleep(false)
    .setAdditionalSolverIterations(4));
  bodies.shaft = shaft;
  const jv = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: 0, y: 2.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
    ground, shaft, true);
  jv.setContactsEnabled(false);
  addCollider(shaft, RAPIER.ColliderDesc.cylinder(4.2, 0.055).setTranslation(0, 4.2, 0).setMass(1.4), 'shaft');
  const lpz = L.crownZ;
  for (let i = 0; i < 8; i++) {
    const a = i * 45 * DEG;
    addCollider(shaft, RAPIER.ColliderDesc.cylinder(0.13, 0.032)
      .setTranslation(Math.sin(a) * L.lanternR, 0, lpz + Math.cos(a) * L.lanternR)
      .setFriction(0.08).setRestitution(0.02).setMass(0.04).setSensor(true), 'lantern');
  }
  addCollider(shaft, RAPIER.ColliderDesc.cylinder(0.03, 0.18).setTranslation(0, 0, lpz).setMass(0.3), 'lphub');
  shaft.setAdditionalMassProperties(6.5, { x: 0, y: L.globeY - 2.5, z: 0 },
    { x: 2.4, y: 2.4, z: 2.4 }, { x: 0, y: 0, z: 0, w: 1 }, true);
  addCollider(shaft, RAPIER.ColliderDesc.ball(0.12).setTranslation(0, L.armilY - 2.5, 0).setMass(2.2), 'armilmass');
  const g5y = 1.35 - 2.5;
  addCollider(shaft, RAPIER.ColliderDesc.cylinder(0.045, 0.73).setTranslation(0, g5y, 0).setMass(1.0), 'g5hub');
  for (let i = 0; i < 32; i++) {
    const a = i * 11.25 * DEG;
    addCollider(shaft, RAPIER.ColliderDesc.convexHull(toothHullH(0.07, 0.038, 0.10, 0.09))
      .setTranslation(Math.sin(a) * 0.75, g5y, Math.cos(a) * 0.75)
      .setRotation(quatY(a)).setFriction(0.05).setRestitution(0.02).setMass(0.012).setSensor(true), 'g5tooth');
  }

  // ---- 报时机轮 + 木人 ------------------------------------------------------
  const cc = L.carouselC;
  const carousel = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(cc.x, cc.y, cc.z).setAngularDamping(0.05).setCanSleep(false)
    .setAdditionalSolverIterations(4));
  bodies.carousel = carousel;
  const jc = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: cc.x, y: cc.y, z: cc.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
    ground, carousel, true);
  jc.setContactsEnabled(false);
  addCollider(carousel, RAPIER.ColliderDesc.cylinder(0.045, 0.93).setMass(2.2), 'cdisc');
  const g6y = 0.3;
  for (let i = 0; i < 8; i++) {
    const a = i * 45 * DEG + 22.5 * DEG;
    addCollider(carousel, RAPIER.ColliderDesc.convexHull(toothHullH(0.085, 0.045, 0.10, 0.09))
      .setTranslation(Math.sin(a) * 0.15, g6y, Math.cos(a) * 0.15)
      .setRotation(quatY(a)).setFriction(0.05).setRestitution(0.02).setMass(0.02).setSensor(true), 'g6tooth');
  }
  addCollider(carousel, RAPIER.ColliderDesc.cylinder(0.05, 0.12).setTranslation(0, g6y, 0).setMass(0.2), 'g6hub');
  const malletR = 1.04;
  for (let i = 0; i < L.figures; i++) {
    const a = i * 30 * DEG;
    const s = Math.sin(a), c = Math.cos(a);
    addCollider(carousel, RAPIER.ColliderDesc.ball(0.05)
      .setTranslation(s * malletR, 0.47, c * malletR)
      .setFriction(0.2).setRestitution(0.1).setMass(0.06)
      .setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
      .setContactForceEventThreshold(0.5), 'mallet');
    addCollider(carousel, RAPIER.ColliderDesc.ball(0.05).setTranslation(s * 0.8, 0.15, c * 0.8).setMass(0.25), 'figuremass');
  }

  // ---- 钟 / 鼓（悬挂动态体，受击摆动） --------------------------------------
  const bellBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(L.bell.x, L.bell.y, L.bell.z).setAngularDamping(0.6).setLinearDamping(0.3));
  bodies.bell = bellBody;
  addCollider(bellBody, RAPIER.ColliderDesc.ball(0.12).setMass(0.7)
    .setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0.5), 'bell');
  const jbell = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: L.bell.x, y: L.bell.y + 0.26, z: L.bell.z }, { x: 0, y: 0.26, z: 0 }, { x: 1, y: 0, z: 0 }),
    ground, bellBody, true);
  jbell.setContactsEnabled(false);
  const drumBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(L.drum.x, L.drum.y, L.drum.z).setAngularDamping(0.6).setLinearDamping(0.3));
  bodies.drum = drumBody;
  addCollider(drumBody, RAPIER.ColliderDesc.cylinder(0.1, 0.13).setRotation(quatZ(Math.PI / 2)).setMass(0.5)
    .setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0.5), 'drum');
  const jdrum = world.createImpulseJoint(
    RAPIER.JointData.revolute({ x: L.drum.x, y: L.drum.y + 0.22, z: L.drum.z }, { x: 0, y: 0.22, z: 0 }, { x: 0, y: 0, z: 1 }),
    ground, drumBody, true);
  jdrum.setContactsEnabled(false);

  // ---- 水滴 ------------------------------------------------------------------
  const spawnAcc = { main: 0, overflow: 0, feed: 0 };
  const SPAWN = { main: 0.13, overflow: 0.24, feed: 0.2 };
  function spawnDroplet(kind) {
    let p, v;
    if (kind === 'main') {
      p = { x: L.nozzle.x + (rand() - 0.5) * 0.10, y: L.nozzle.y, z: L.nozzle.z + (rand() - 0.5) * 0.12 };
      v = { x: (rand() - 0.5) * 0.05, y: -1.0, z: (rand() - 0.5) * 0.05 };
    } else if (kind === 'overflow') {
      p = { x: L.pinghu.x - 0.02, y: L.pinghu.y + 0.12, z: L.pinghu.z - 0.28 };
      v = { x: -0.1, y: 0.1, z: -0.55 };
    } else {
      p = { x: L.tianchi.x + 0.55, y: L.tianchi.y - 0.2, z: L.tianchi.z + (rand() - 0.5) * 0.06 };
      v = { x: 0.25, y: -0.4, z: 0 };
    }
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(p.x, p.y, p.z).setLinvel(v.x, v.y, v.z)
      .setLinearDamping(0.02).setCcdEnabled(true));
    addCollider(b, RAPIER.ColliderDesc.ball(0.045).setMass(kind === 'main' ? 0.2 : 0.05)
      .setFriction(kind === 'main' ? 0.2 : 0.1).setRestitution(0.08), 'drop');
    droplets.push({ body: b, kind, age: 0 });
  }
  function removeDroplet(i, splash) {
    const d = droplets[i];
    if (splash && d.kind === 'main') emit('splash', d.body.translation());
    world.removeRigidBody(d.body);
    droplets.splice(i, 1);
  }

  // ---- 诊断 ------------------------------------------------------------------
  const diag = {
    time: 0, wheelDeg: 0, shaftDeg: 0, carouselDeg: 0,
    ticks: 0, bellHits: 0, drumHits: 0, releases: 0,
    lever1Deg: 0, droplets: 0, jammed: false, bucketFill: 0,
  };
  let prevWheelAng = 0, prevShaftAng = 0, prevCarAng = 0;
  let wheelUnwrap = 0, shaftUnwrap = 0, carUnwrap = 0;
  let lastReleaseT = -1, armed = true, lastBellT = -1, lastDrumT = -1;
  const angleZ = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.z, r.w); };
  const angleY = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.y, r.w); };
  const unwrap = (prev, cur) => {
    let d = cur - prev;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  };

  function step() {
    // 齿轮传动：下游轴关节位置电机以枢轮实测转角×齿比为目标（力矩受限的物理伺服），
    // 运动由引擎积分求解，齿比精确无漂移；齿面保留用于视觉啮合。
    // 齿比：G1/G2=12/24=0.5，冠/灯笼=12/8=1.5，G5/G6=32/8=4。
    jg2.configureMotorPosition(-0.5 * wheelUnwrap, 3000, 120);
    jv.configureMotorPosition(0.3333 * wheelUnwrap, 3000, 120);
    jc.configureMotorPosition(-1.3333 * wheelUnwrap, 3000, 120);

    spawnAcc.main += DT; spawnAcc.overflow += DT; spawnAcc.feed += DT;
    while (spawnAcc.main >= SPAWN.main) { spawnAcc.main -= SPAWN.main; spawnDroplet('main'); }
    while (spawnAcc.overflow >= SPAWN.overflow) { spawnAcc.overflow -= SPAWN.overflow; spawnDroplet('overflow'); }
    while (spawnAcc.feed >= SPAWN.feed) { spawnAcc.feed -= SPAWN.feed; spawnDroplet('feed'); }

    world.step(eq);
    diag.time += DT;

    eq.drainCollisionEvents((h1, h2, started) => {
      if (!started) return;
      emit('collision', { a: tags.get(h1), b: tags.get(h2), time: diag.time });
    });
    eq.drainContactForceEvents((e) => {
      const t1 = tags.get(e.collider1()), t2 = tags.get(e.collider2());
      const mag = e.totalForceMagnitude();
      const pair = [t1, t2];
      if (pair.includes('mallet') && pair.includes('bell') && mag > 1.2 && diag.time - lastBellT > 0.25) {
        lastBellT = diag.time; diag.bellHits++; emit('bell', { force: mag, time: diag.time });
      }
      if (pair.includes('mallet') && pair.includes('drum') && mag > 1.2 && diag.time - lastDrumT > 0.4) {
        lastDrumT = diag.time; diag.drumHits++; emit('drum', { force: mag, time: diag.time });
      }
    });

    // 天衡倾翻检测（物理传感器）-> 触发枢轮步进一格，并把斗水泻入受水壶
    const l1deg = angleZ(l1) / DEG;
    diag.lever1Deg = l1deg;
    let fill = 0;
    const inBucket = [];
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      if (d.kind !== 'main') continue;
      const p = d.body.translation();
      if (p.y > 5.25 && p.y < 5.8 && Math.abs(p.x - L.bucket.x) < 0.22) { fill++; inBucket.push(i); }
    }
    diag.bucketFill = fill;
    if (armed && l1deg > 6) {
      armed = false;
      wheelTarget -= STEP;
      wj.configureMotorPosition(wheelTarget, 4000, 120);
      diag.ticks++; diag.releases++; lastReleaseT = diag.time;
      emit('release', { time: diag.time });
      emit('clack', { time: diag.time });
      // 泻水：斗内水滴转移入当前受水壶（水流），杠杆卸重 -> 弹簧复位
      const fa = L.fillDeg * DEG;
      const sx = wc.x + Math.sin(fa) * 1.45, sy = wc.y + Math.cos(fa) * 1.45;
      for (let j = inBucket.length - 1; j >= 0; j--) {
        const d = droplets[inBucket[j]];
        world.removeRigidBody(d.body);
        droplets.splice(inBucket[j], 1);
        const b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(sx + (rand() - 0.5) * 0.12, sy + 0.15, wc.z + (rand() - 0.5) * 0.12)
          .setLinvel(0, -0.5, 0).setCcdEnabled(true));
        addCollider(b, RAPIER.ColliderDesc.ball(0.045).setMass(0.2).setFriction(0.2).setRestitution(0.08), 'drop');
        droplets.push({ body: b, kind: 'main', age: 0 });
      }
      emit('splash', { x: sx, y: sy, z: wc.z });
    } else if (!armed && l1deg < 1) {
      armed = true;
    }

    const wa = angleZ(wheel);
    wheelUnwrap += unwrap(prevWheelAng, wa); prevWheelAng = wa;
    const sa = angleY(shaft);
    shaftUnwrap += unwrap(prevShaftAng, sa); prevShaftAng = sa;
    const ca = angleY(carousel);
    carUnwrap += unwrap(prevCarAng, ca); prevCarAng = ca;
    diag.wheelDeg = -wheelUnwrap / DEG;
    diag.shaftDeg = shaftUnwrap / DEG;
    diag.carouselDeg = carUnwrap / DEG;

    for (let i = droplets.length - 1; i >= 0; i--) {
      const d = droplets[i];
      d.age += DT;
      const p = d.body.translation();
      let dead = false;
      if (d.kind === 'main') dead = p.y < 1.45 || d.age > 9 || Math.abs(p.x) > 4;
      else if (d.kind === 'overflow') dead = p.y < 4.9 || d.age > 3;
      else dead = p.y < 5.62 || d.age > 3;
      if (dead) removeDroplet(i, d.kind === 'main' && p.y < 1.6);
    }
    diag.droplets = droplets.length;
    if (diag.time > 5 && diag.time - lastReleaseT > 4) diag.jammed = true;
    else if (diag.time - lastReleaseT <= 4) diag.jammed = false;
  }

  return {
    world, bodies, droplets, diag, step, on, DT, tags, L,
    free() { eq.free(); world.free(); },
  };
}

// 水运仪象台 —— 物理模型
// 刚体、关节、碰撞全部由 Rapier3D 实时计算；齿轮啮合用"冲量约束"实现（按转动惯量交换角动量）。
// 本模块不依赖渲染，可在 Bun 中无头运行以调参（tools/sweep.mjs）。
//
// 坐标：枢轮轴为 z 轴，轮心在原点；+x 向右，+y 向上，+z 朝向观众。
// 枢轮顺时针（从 +z 看）转动：右侧受水壶装水下行。

export const DT = 1 / 150;

// ---- 碰撞分组（高 16 位：成员；低 16 位：过滤） ----
const STATIC = 1, WATER = 2, BUCKET = 4, PIN = 8, FORK = 16, STOP = 32,
  PEG = 64, TOOTH = 128, TRIP = 256, JACK = 512, BELL = 1024, LOCK = 2048, LSTOP = 4096,
  BEAM = 8192, BSTOP = 16384;
const grp = (m, f) => ((m & 0xffff) << 16) | (f & 0xffff);
const G_STATIC = grp(STATIC, WATER);
const G_WATER = grp(WATER, STATIC | WATER | BUCKET);
const G_BUCKET = grp(BUCKET, WATER);
const G_PIN = grp(PIN, FORK);
const G_FORK = grp(FORK, PIN | STOP);
const G_STOP = grp(STOP, FORK);
const G_PEG = grp(PEG, TOOTH | LOCK);
const G_TOOTH = grp(TOOTH, PEG);
const G_TRIP = grp(TRIP, JACK);
const G_JACK = grp(JACK, TRIP | BELL);
const G_BELL = grp(BELL, JACK);
const G_LOCK = grp(LOCK, PEG | LSTOP);
const G_LSTOP = grp(LSTOP, LOCK);
const G_BEAM = grp(BEAM, BSTOP);
const G_BSTOP = grp(BSTOP, BEAM);
const G_NONE = grp(0, 0);

const D2R = Math.PI / 180;

// ---- 几何参数 ----
export const GEO = {
  N: 12,                 // 受水壶 / 轮辐 数（演示：一格 = 一个时辰）
  R: 2.0,                // 受水壶铰点半径
  station: -25 * D2R,    // 受水位置（受水壶在此接水、压在格叉上）
  bucket: { x0: 0.06, x1: 0.78, y0: -0.26, y1: 0.18, hz: 0.27, t: 0.05 },
  bucketLim: [-0.26, 0.06],
  pinLocal: [0.55, -0.06],
  pinZ: 0.37,
  pinR: 0.05,
  Rp: 2.2,               // 天关所卡的辐端销半径
  pegR: 0.06,
  pegZ: 0.62,
  pegHold: 82 * D2R,     // 被天关卡住时，销的角位置
  forkPivotX: 3.8,
  plateMargin: 0.075,    // 托板端部在托销左侧多远
  plateLen: 0.6,
  cwX: 0.85,
  rodX: -0.27,            // 天条在格叉上的连接点（相对枢点，靠近枢点 → 格叉大幅下摆时天衡只小幅抬起）
  beamPivotX: 3.25,      // 天衡枢点 x（左臂长、右臂短：放大天关抬升量）
  jetV: -2.2,
  sumpY: -2.75,
  // 传动
  sTianZhu: [-3.0, -1.5],  // 天柱 (x,z)
  sJack: [-3.0, 0.55],     // 机轮轴 (x,z)
  globeC: [-1.6, 6.0, 0.3],
  armC: [-1.5, 11.6, 0.2],
  lat: 34.8 * D2R,
  noria: [6.4, -0.3, 0.0],
};

export const MASS = {
  wheel: 9, wheelI: 26,
  bucketDensity: 15,
  water: 0.14,          // 每颗"水滴"质量
  fork: 0.6, cw: 3.0,
  beamDensity: 12,
};

export const FLOW = 9.5; // 每秒注入的水滴数（恒定流量）

function quatZ(a) { return { x: 0, y: 0, z: Math.sin(a / 2), w: Math.cos(a / 2) }; }
function rot2(x, y, a) { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; }

// 简单确定性随机
function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createSim(RAPIER, opts = {}) {
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = DT;
  world.integrationParameters.numSolverIterations = 6;
  const events = new RAPIER.EventQueue(true);
  const rng = makeRng(opts.seed ?? 7);
  const g = GEO;
  const ST = opts.station ?? g.station;

  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const C = RAPIER.ColliderDesc;
  const MIN = RAPIER.CoefficientCombineRule.Min;
  const EV = RAPIER.ActiveEvents.COLLISION_EVENTS;

  const tags = new Map(); // collider handle -> tag
  function addCol(desc, body, tag) {
    const c = world.createCollider(desc, body);
    if (tag) tags.set(c.handle, tag);
    return c;
  }
  // 所有物体创建时都无旋转，所以局部坐标 = 世界坐标 - 平移
  const toLocal = (bodyPos, p) => [p[0] - bodyPos[0], p[1] - bodyPos[1], p[2] - bodyPos[2]];
  const V = (a) => ({ x: a[0], y: a[1], z: a[2] });
  function revolute(b1, b2, anchorWorld, axis, p1, p2) {
    const jd = RAPIER.JointData.revolute(V(toLocal(p1, anchorWorld)), V(toLocal(p2, anchorWorld)), V(axis));
    return world.createImpulseJoint(jd, b1, b2, true);
  }
  const O = [0, 0, 0];
  const identity = { x: 0, y: 0, z: 0, w: 1 };

  // =====================================================================
  // 枢轮（主水轮）
  // =====================================================================
  const wheel = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setAdditionalMassProperties(MASS.wheel, V(O), V([MASS.wheelI, MASS.wheelI, MASS.wheelI]), identity)
    .setAngularDamping(opts.wheelDamp ?? 8.0).setCanSleep(false));
  revolute(ground, wheel, O, [0, 0, 1], O, O);

  // 辐端销（天关、天锁卡住它们）
  for (let i = 0; i < g.N; i++) {
    const a = i * 2 * Math.PI / g.N + g.pegHold;
    addCol(C.ball(g.pegR).setTranslation(g.Rp * Math.cos(a), g.Rp * Math.sin(a), g.pegZ)
      .setDensity(0).setCollisionGroups(G_PEG).setFriction(0.03).setFrictionCombineRule(MIN)
      .setRestitution(0.05).setActiveEvents(EV), wheel, 'peg');
  }

  // 受水壶（铰接在轮缘上，可在限位内小幅摆动；在受水位时水平）
  const buckets = [];
  const B = g.bucket;
  for (let i = 0; i < g.N; i++) {
    const phi = ST + i * 2 * Math.PI / g.N;     // 铰点角位置
    const tilt = phi - ST;                      // 壶体相对水平的转角
    const pv = [g.R * Math.cos(phi), g.R * Math.sin(phi), 0];
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(pv[0], pv[1], pv[2])
      .setAngularDamping(0.5).setCanSleep(false));
    const q = quatZ(tilt);
    const box = (cx, cy, cz, hx, hy, hz) => {
      const [x, y] = rot2(cx, cy, tilt);
      return addCol(C.cuboid(hx, hy, hz).setTranslation(x, y, cz).setRotation(q)
        .setDensity(MASS.bucketDensity).setCollisionGroups(G_BUCKET).setFriction(0.15).setRestitution(0.0), body, 'bucket');
    };
    const xm = (B.x0 + B.x1) / 2, hx = (B.x1 - B.x0) / 2, ym = (B.y0 + B.y1) / 2, hy = (B.y1 - B.y0) / 2;
    box(xm, B.y0 + B.t / 2, 0, hx, B.t / 2, B.hz);      // 底
    box(B.x0 + B.t / 2, ym, 0, B.t / 2, hy, B.hz);       // 内壁
    box(B.x1 - B.t / 2, ym, 0, B.t / 2, hy, B.hz);       // 外壁
    box(xm, ym, B.hz - B.t / 2, hx, hy, B.t / 2);        // 侧板
    box(xm, ym, -B.hz + B.t / 2, hx, hy, B.t / 2);
    // 托销：从前侧板伸出，压在格叉托板上
    const [px, py] = rot2(g.pinLocal[0], g.pinLocal[1], tilt);
    addCol(C.ball(g.pinR).setTranslation(px, py, g.pinZ).setDensity(0).setCollisionGroups(G_PIN)
      .setFriction(0.05).setFrictionCombineRule(MIN).setActiveEvents(EV), body, 'pin');
    const j = revolute(wheel, body, pv, [0, 0, 1], O, pv);
    j.setLimits(g.bucketLim[0], g.bucketLim[1]);
    buckets.push({ body, phi, tilt, joint: j, pivot: pv });
  }

  // =====================================================================
  // 格叉 + 枢衡（下杠杆，带枢权配重）
  // =====================================================================
  const pinRest = [g.R * Math.cos(ST) + g.pinLocal[0], g.R * Math.sin(ST) + g.pinLocal[1]];
  const plateTh = 0.03;
  const FP = [g.forkPivotX, pinRest[1] - g.pinR - plateTh, g.pinZ];
  const fork = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...FP)
    .setAngularDamping(opts.forkDamp ?? 4.0).setCanSleep(false));
  const pl0 = pinRest[0] - (opts.plateMargin ?? g.plateMargin) - FP[0];
  const pl1 = pl0 + g.plateLen;
  addCol(C.cuboid((pl1 - pl0) / 2, plateTh, 0.06).setTranslation((pl0 + pl1) / 2, 0, 0).setMass(MASS.fork * 0.3)
    .setCollisionGroups(G_FORK).setFriction(0.05).setFrictionCombineRule(MIN).setActiveEvents(EV), fork, 'fork');
  addCol(C.cuboid((1.0 - pl1) / 2, 0.04, 0.05).setTranslation((pl1 + 1.0) / 2, -0.01, 0).setMass(MASS.fork * 0.7)
    .setCollisionGroups(G_FORK), fork, 'forkarm');
  addCol(C.cuboid(0.13, 0.13, 0.13).setTranslation(g.cwX, -0.05, 0).setMass(opts.cw ?? MASS.cw).setCollisionGroups(G_NONE), fork, 'cw');
  revolute(ground, fork, FP, [0, 0, 1], O, FP);
  // 上、下限位（只与格叉碰撞）
  const stopX = 0.55;
  addCol(C.cuboid(0.05, 0.03, 0.06).setTranslation(FP[0] - stopX, FP[1] + 0.03 + 0.03, FP[2]).setCollisionGroups(G_STOP), ground, 'fstop');
  const lowA = opts.lowA ?? 0.36;
  addCol(C.cuboid(0.05, 0.03, 0.06).setTranslation(FP[0] - stopX, FP[1] - 0.05 - stopX * Math.tan(lowA) - 0.03, FP[2]).setCollisionGroups(G_STOP), ground, 'fstop');

  // =====================================================================
  // 天衡（上杠杆）+ 天关（卡齿）
  // =====================================================================
  const pegHoldPos = [g.Rp * Math.cos(g.pegHold), g.Rp * Math.sin(g.pegHold)];
  const toothFaceX = pegHoldPos[0] + g.pegR + 0.004;
  const beamY = pegHoldPos[1] + 0.03;
  const BP = [opts.beamPivotX ?? g.beamPivotX, beamY, g.pegZ];
  const beam = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...BP)
    .setAngularDamping(opts.beamDamp ?? 0.6).setCanSleep(false));
  const rodXw = FP[0] + (opts.rodX ?? g.rodX);
  const beamL = toothFaceX - BP[0];         // 负值（左端）
  const beamRight = rodXw - BP[0] + 0.12;
  addCol(C.cuboid((beamRight - beamL) / 2, 0.045, 0.05).setTranslation((beamRight + beamL) / 2, 0.06, 0)
    .setDensity(MASS.beamDensity).setCollisionGroups(G_BEAM).setRestitution(0).setRestitutionCombineRule(MIN)
    .setActiveEvents(EV), beam, 'beam');
  // 卡齿：竖直面朝左，顶住辐端销
  const toothBot = opts.toothBot ?? -0.13, toothTop = 0.1;
  addCol(C.cuboid(0.07, (toothTop - toothBot) / 2, 0.07).setTranslation(beamL + 0.07, (toothTop + toothBot) / 2, 0)
    .setDensity(MASS.beamDensity).setCollisionGroups(G_TOOTH).setFriction(0.03).setFrictionCombineRule(MIN)
    .setRestitution(0.0).setActiveEvents(EV), beam, 'tooth');
  // 天关一侧的配重，使天关自然落下
  addCol(C.cuboid(0.08, 0.08, 0.08).setTranslation(beamL + 0.1, 0.16, 0).setMass(opts.beamWeight ?? 0.25).setCollisionGroups(G_NONE), beam, 'bw');
  revolute(ground, beam, BP, [0, 0, 1], O, BP);
  // 天衡托（静止位）与上摆限位
  addCol(C.cuboid(0.04, 0.03, 0.05).setTranslation(BP[0] - (opts.bstopX ?? 1.2), BP[1] + 0.015 - 0.03, BP[2]).setCollisionGroups(G_BSTOP)
    .setRestitution(0).setRestitutionCombineRule(MIN), ground, 'bstop');
  {
    const a = (opts.beamMax ?? 20) * D2R, x = 0.4;
    addCol(C.ball(0.03).setTranslation(BP[0] + x, BP[1] + 0.015 - x * Math.sin(a) - 0.03, BP[2]).setCollisionGroups(G_BSTOP), ground, 'bstop2');
  }

  // 天锁：防倒转棘爪。爪尖落在被卡辐端销的左侧，枢轮正转时被后续的销顶起滑过。
  const pawlTip = [pegHoldPos[0] - g.pegR - (opts.pawlGap ?? 0.05), pegHoldPos[1] + (opts.pawlDy ?? 0.0), g.pegZ];
  const LP = [pawlTip[0] - 0.62, pawlTip[1] + 0.36, g.pegZ];
  const lock = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...LP).setAngularDamping(0.5).setCanSleep(false));
  let pawl;
  {
    const dx = pawlTip[0] - LP[0], dy = pawlTip[1] - LP[1];
    const L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    const th = 0.035;
    addCol(C.cuboid(L / 2, th, 0.05).setTranslation(dx / 2 + nx * th, dy / 2 + ny * th, 0).setRotation(quatZ(ang))
      .setDensity(300).setCollisionGroups(opts.noLock ? G_NONE : G_LOCK).setFriction(0.03).setFrictionCombineRule(MIN)
      .setActiveEvents(EV), lock, 'lock');
    const sx = LP[0] + dx * 0.3 - nx * 0.06, sy = LP[1] + dy * 0.3 - ny * 0.06;
    addCol(C.ball(0.025).setTranslation(sx, sy, g.pegZ).setCollisionGroups(G_LSTOP), ground, 'lstop');
    pawl = { L, ang, th, stop: [sx, sy, g.pegZ] };
  }
  revolute(ground, lock, LP, [0, 0, 1], O, LP);

  // 天条：链条（只能拉、不能推；留少许松弛，壶落托板的冲击不会误开天关）
  const RA = [rodXw, FP[1], 0.5];
  const RB = [rodXw, beamY, 0.5];
  const rodA = toLocal(FP, RA), rodB = toLocal(BP, RB);
  const ropeLen = (RB[1] - RA[1]) + (opts.slack ?? 0.005);
  world.createImpulseJoint(RAPIER.JointData.rope(ropeLen, V(rodA), V(rodB)), fork, beam, true);

  // =====================================================================
  // 退水壶（承接溢出的水）
  // =====================================================================
  addCol(C.cuboid(3.6, 0.1, 1.0).setTranslation(0.6, g.sumpY - 0.25, 0).setCollisionGroups(G_STATIC), ground, 'sump');

  // =====================================================================
  // 传动：地毂 → 天柱 → 机轮 / 浑象 / 浑仪
  // =====================================================================
  const shafts = {};
  function shaft(name, pos, axis, I, extra) {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...pos)
      .setAdditionalMassProperties(I.m, V(O), V([I.i, I.i, I.i]), identity)
      .setAngularDamping(I.damp ?? 0.4).setCanSleep(false));
    const j = revolute(ground, b, pos, axis, O, pos);
    shafts[name] = { body: b, axis, pos, joint: j };
    if (extra) extra(b);
    return shafts[name];
  }
  const [tzx, tzz] = g.sTianZhu;
  shaft('digu', [-1.5, 0, tzz], [1, 0, 0], { m: 2, i: 0.6 });
  shaft('tianzhu', [tzx, 4.5, tzz], [0, 1, 0], { m: 4, i: 0.8 });
  const [jx, jz] = g.sJack;
  const jackAxlePos = [jx, -1.9, jz];
  const tripY = -2.35; // 报时轮盘面高度
  const tripR = 0.92;
  // 机轮轴：拨牙（触发木人）随轴转动
  const tripPhase = opts.tripPhase ?? 7 * D2R;
  shaft('jack', jackAxlePos, [0, 1, 0], { m: 6, i: 3.0, damp: 0.6 }, (b) => {
    for (let i = 0; i < g.N; i++) {
      const a = i * 2 * Math.PI / g.N + tripPhase;
      const th = opts.tripH ?? 0.085;
      addCol(C.cylinder(th, 0.035).setTranslation(tripR * Math.sin(a), tripY + th - jackAxlePos[1], tripR * Math.cos(a))
        .setDensity(0).setCollisionGroups(G_TRIP).setFriction(0.1), b, 'trip');
    }
  });
  const latAxis = [0, Math.sin(g.lat), -Math.cos(g.lat)];
  shaft('globe', g.globeC, latAxis, { m: 20, i: 4, damp: 0.5 });
  shaft('arm', g.armC, latAxis, { m: 12, i: 3, damp: 0.5 });

  // 齿轮约束：ω_b·axis_b = ratio · ω_a·axis_a
  const gears = [];
  function gear(a, b, ratio, name) { gears.push({ a, b, ratio, err0: null, name }); }
  const W = { body: wheel, axis: [0, 0, 1] };
  gear(W, shafts.digu, -1, '枢轮→地毂');
  gear(shafts.digu, shafts.tianzhu, 1, '地毂→天柱');
  gear(shafts.tianzhu, shafts.jack, -1, '天柱→机轮');
  gear(shafts.tianzhu, shafts.globe, -1, '天柱→浑象');
  gear(shafts.tianzhu, shafts.arm, -1, '天柱→浑仪');

  // =====================================================================
  // 报时木人：拨牙推起木人尾杆，放开后槌击钟
  // =====================================================================
  const JP = [jx, tripY + 0.68, jz + tripR];
  const jack = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...JP).setAngularDamping(0.2).setCanSleep(false));
  addCol(C.cuboid(0.025, 0.25, 0.03).setTranslation(0, -0.25, 0).setDensity(300).setCollisionGroups(opts.noJack ? G_NONE : G_JACK).setFriction(0.1), jack, 'tail');
  addCol(C.ball(0.05).setTranslation(0, -0.5, 0).setDensity(opts.tailDens ?? 2500).setCollisionGroups(opts.noJack ? G_NONE : G_JACK).setFriction(0.1), jack, 'tail');
  addCol(C.cuboid(0.02, 0.32, 0.02).setTranslation(0, 0.32, 0).setDensity(200).setCollisionGroups(G_NONE), jack, 'arm');
  addCol(C.ball(0.075).setTranslation(0, 0.66, 0).setDensity(250).setCollisionGroups(G_JACK).setRestitution(0.3)
    .setActiveEvents(EV), jack, 'mallet');
  revolute(ground, jack, JP, [0, 0, 1], O, JP);
  // 钟（固定）——槌在其右侧
  const bellPos = [JP[0] - 0.24, JP[1] + 0.66, JP[2]];
  addCol(C.ball(0.16).setTranslation(...bellPos).setCollisionGroups(G_BELL).setRestitution(0.4).setActiveEvents(EV), ground, 'bell');
  // 木人后挡
  const jstopA = 58 * D2R;
  const jstopPos = [JP[0] + 0.66 * Math.sin(jstopA), JP[1] + 0.66 * Math.cos(jstopA), JP[2]];
  addCol(C.ball(0.05).setTranslation(...jstopPos).setCollisionGroups(G_BELL).setRestitution(0.1), ground, 'jstop');

  // =====================================================================
  // 升水轮（人力绞动：用关节马达模拟人推的恒定转速）
  // =====================================================================
  const NP = g.noria;
  const noria = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...NP)
    .setAdditionalMassProperties(5, V(O), V([3, 3, 3]), identity).setCanSleep(false));
  const nj = revolute(ground, noria, NP, [0, 0, 1], O, NP);
  nj.configureMotorVelocity(0.55, 4.0);

  // =====================================================================
  // 水滴（平水壶出水口：水位恒定 → 出流速度恒定）
  // =====================================================================
  const drops = [];
  let spawnAcc = 0;
  const stationBucketTop = [g.R * Math.cos(ST) + (B.x0 + B.x1) / 2, g.R * Math.sin(ST) + B.y1];
  const spout = opts.spout ?? [3.0, stationBucketTop[1] + 0.48, 0];
  function spawnDrop() {
    const x = spout[0], y = spout[1] + (rng() - 0.5) * 0.04, z = spout[2] + (rng() - 0.5) * 0.08;
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z)
      .setLinvel((opts.jetV ?? g.jetV) + (rng() - 0.5) * 0.12, (rng() - 0.5) * 0.1, (rng() - 0.5) * 0.1)
      .setLinearDamping(0.05).setCcdEnabled(true));
    world.createCollider(C.ball(0.058).setMass(MASS.water).setCollisionGroups(G_WATER).setFriction(0.02).setRestitution(0.05), b);
    drops.push({ body: b, born: time });
  }

  // =====================================================================
  // 齿轮约束求解（顺序冲量 + 角度漂移修正）
  // =====================================================================
  function axisAngle(body, axis, st) {
    const r = body.rotation();
    const d = r.x * axis[0] + r.y * axis[1] + r.z * axis[2];
    const a = 2 * Math.atan2(d, r.w);
    if (st.prev === undefined) { st.prev = a; st.acc = a; return a; }
    let da = a - st.prev;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    st.prev = a; st.acc += da;
    return st.acc;
  }
  function invIaxis(body, axis) {
    const m = body.effectiveWorldInvInertia();
    const [x, y, z] = axis;
    return x * (m.m11 * x + m.m12 * y + m.m13 * z) + y * (m.m12 * x + m.m22 * y + m.m23 * z) + z * (m.m13 * x + m.m23 * y + m.m33 * z);
  }
  const angSt = new Map();
  function angOf(s) {
    if (!angSt.has(s)) angSt.set(s, {});
    return axisAngle(s.body, s.axis, angSt.get(s));
  }
  function omega(s) { const w = s.body.angvel(); return w.x * s.axis[0] + w.y * s.axis[1] + w.z * s.axis[2]; }
  function solveGears() {
    for (const gr of gears) {
      gr.thA = angOf(gr.a); gr.thB = angOf(gr.b);
      if (gr.err0 === null) gr.err0 = gr.thB - gr.ratio * gr.thA;
      gr.iA = invIaxis(gr.a.body, gr.a.axis); gr.iB = invIaxis(gr.b.body, gr.b.axis);
    }
    for (let it = 0; it < 6; it++) {
      for (const gr of gears) {
        const k = gr.iB + gr.ratio * gr.ratio * gr.iA;
        if (!(k > 1e-9)) continue; // 首帧质量属性尚未初始化
        const err = (gr.thB - gr.ratio * gr.thA) - gr.err0;
        const vErr = omega(gr.b) - gr.ratio * omega(gr.a) + (it === 0 ? 0.25 * err / DT : 0);
        const lam = -vErr / k;
        // 力矩冲量：B 得 +lam，A 得 -ratio·lam（作用与反作用，经齿轮比放大）
        const tb = lam, ta = -gr.ratio * lam;
        gr.b.body.applyTorqueImpulse({ x: gr.b.axis[0] * tb, y: gr.b.axis[1] * tb, z: gr.b.axis[2] * tb }, true);
        gr.a.body.applyTorqueImpulse({ x: gr.a.axis[0] * ta, y: gr.a.axis[1] * ta, z: gr.a.axis[2] * ta }, true);
      }
    }
  }

  // =====================================================================
  // 步进
  // =====================================================================
  let time = 0;
  const wheelAngSt = {};
  const out = {
    world, RAPIER, ground, wheel, buckets, fork, beam, lock, jack, noria, shafts, gears, drops,
    bellPos, jackPivot: JP, jstopPos, tripY, tripR, tripPhase, jackAxlePos, beamPivot: BP, rodA, rodB, ropeLen,
    toothFaceX, beamY, beamL, beamRight, toothBot, toothTop, latAxis, forkPivot: FP, plate: [pl0, pl1], plateTh,
    lockPivot: LP, pawl, spout, station: ST, pinRest, lowA, stopX,
    get time() { return time; },
    flowOn: true,
    wheelAngle: 0,
    stepCount: 0,
    stepTimes: [],
    collisions: [],
  };

  function step() {
    if (out.flowOn) {
      spawnAcc += FLOW * DT;
      while (spawnAcc >= 1) { spawnAcc -= 1; spawnDrop(); }
    }
    solveGears();
    world.step(events);
    time += DT;
    events.drainCollisionEvents((h1, h2, started) => {
      if (!started) return;
      const t1 = tags.get(h1), t2 = tags.get(h2);
      if (!t1 && !t2) return;
      const c1 = world.getCollider(h1), c2 = world.getCollider(h2);
      out.collisions.push({ t: time, a: t1, b: t2, v: relSpeed(c1, c2) });
      if (out.collisions.length > 4000) out.collisions.splice(0, 2000);
    });
    // 落入退水壶的水滴移除（汇入水面）
    for (let i = drops.length - 1; i >= 0; i--) {
      const p = drops[i].body.translation();
      if (p.y < g.sumpY + 0.02 || time - drops[i].born > 30) {
        world.removeRigidBody(drops[i].body);
        drops.splice(i, 1);
      }
    }
    out.wheelAngle = -axisAngle(wheel, [0, 0, 1], wheelAngSt); // 顺时针为正
    // 走格检测：枢轮每转过一格（30°）记录一次时刻
    const si = Math.floor((out.wheelAngle * 180 / Math.PI + 3) / 30);
    if (si > out.stepCount) { out.stepCount = si; out.stepTimes.push(time); }
  }
  function relSpeed(c1, c2) {
    const b1 = c1.parent(), b2 = c2.parent();
    const p = c1.translation();
    const vel = (b) => {
      if (!b || b.isFixed()) return [0, 0, 0];
      const v = b.linvel(), w = b.angvel(), c = b.translation();
      const r = [p.x - c.x, p.y - c.y, p.z - c.z];
      return [v.x + w.y * r[2] - w.z * r[1], v.y + w.z * r[0] - w.x * r[2], v.z + w.x * r[1] - w.y * r[0]];
    };
    const a = vel(b1), b = vel(b2);
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }
  out.step = step;
  out.angleOf = angOf;
  return out;
}

// 水运仪象台 —— 刚体物理模型（Rapier）
// 所有机械运动都由这里的刚体、关节与碰撞求解得到：
//   水珠(刚体小球) → 受水壶(铰接在枢轮上) → 格叉/枢衡(杠杆) → 天条(铰接吊杆，下端钩在枢衡压板下，只拉不顶)
//   → 天衡/天关(杠杆+挡齿) → 枢轮(转动关节) → 木齿轮(碰撞啮合) → 天柱
//   → 浑象 / 浑仪 / 昼夜机轮拨牙 → 木人击钟摇铃(杠杆落锤)
// 没有任何 kinematic 刚体、马达或直接设置位姿的代码（水珠在出水口生成、落入退水壶后回收除外）。

const DEG = Math.PI / 180;

export const G = (() => {
  const g = {};
  g.H = 1 / 120; // 固定物理步长
  g.YC = 2.75; // 枢轮轴心高度
  g.N = 36; // 受水壶数量
  g.PITCH = (2 * Math.PI) / 36;

  // ---- 枢轮 / 受水壶 ----
  g.RH = 1.7; // 壶铰链半径
  g.SCOOP = { L: 0.3, t: 0.02, hz: 0.17, hIn: 0.15, hOut: 0.07, lip: 0.08, hSide: 0.12, cant: 6 * DEG };
  g.DROP = 14 * DEG; // 壶可下垂的角度
  g.REST = 5 * DEG; // 停靠时被格叉托住的下垂角
  g.PIN = { u: 0.28, v: -0.01, z: 0.27, hh: 0.08, r: 0.008 };
  g.RP = 1.45; // 挡销(辐端)半径
  g.PEG = { z: 0.3, r: 0.025 };

  // ---- 格叉 / 枢衡 ----
  const cs = Math.cos(g.SCOOP.cant - g.REST), sn = Math.sin(g.SCOOP.cant - g.REST);
  g.pinRest = { x: g.RH + g.PIN.u * cs - g.PIN.v * sn, y: g.PIN.u * sn + g.PIN.v * cs };
  g.FORK = {
    overlap: 0.032, // 销心到叉尖圆头中心的水平搭接量
    px: 2.69, py: 0.37, z: 0.28, // 枢衡支点（相对轮心）
    r: 0.006, len: 0.2, hz: 0.06,
  };
  g.FORK.topY = g.pinRest.y - g.PIN.r;
  g.FORK.tipX = g.pinRest.x - g.FORK.overlap - g.FORK.r; // 叉尖最左端
  // ---- 天衡 / 天关 ----
  g.HENG = { px: 1.575, py: g.RP, right: 0.75, z: 0.5, toothX0: 0.025, toothW: 0.05, toothDown: 0.02, toothUp: 0.06 };
  g.ROPE = { fx: -0.45, fy: -0.21 }; // 天条在枢衡上的系点（相对枢衡支点）
  g.ROPE.hx = g.FORK.px + g.ROPE.fx - g.HENG.px; // 天条在天衡上的系点
  g.ROPE.len = g.HENG.py - (g.FORK.py + g.ROPE.fy) + 0.004 + 0.02; // 天条长度（上铰点到下端横档中心）
  g.ROPE.z = 0.4;

  // ---- 出水槽 ----
  g.CHUTE = { x0: 2.75, y0: 0.445, x1: 2.075, y1: 0.19, w: 0.1 };
  g.BALL_R = 0.031;
  g.BALL_M = 0.12;
  g.RATE = 9; // 每秒水珠数（平水壶恒定流量）
  g.MAXB = 150;
  g.BASIN_Y = 0.42; // 退水壶水面
  g.TANK = { x: 3.02, y0: g.YC + 1.06, ySurf: g.YC + 0.74 }; // 天池出水口 → 平水壶水面

  // ---- 齿轮 ----
  g.ZA = -0.8; g.RA = (36 * 0.12) / (2 * Math.PI); g.NA = 36;
  g.RB = (24 * 0.12) / (2 * Math.PI); g.NB = 24;
  g.ZS = g.ZA - g.RB; // 天柱 z
  g.GEAR1 = { hh: 0.05, r: 0.0225 };
  g.LAT = 34.8 * DEG; // 开封纬度 → 极轴仰角
  g.GEAR2 = { hh: 0.05, hhD: 0.042, r: 0.03, p: 0.15708 };
  g.RC = (18 * g.GEAR2.p) / (2 * Math.PI); g.NC = 18;
  g.RD = (30 * g.GEAR2.p) / (2 * Math.PI); g.ND = 30;
  g.RC2 = (12 * g.GEAR2.p) / (2 * Math.PI); g.NC2 = 12;
  g.RD2 = (20 * g.GEAR2.p) / (2 * Math.PI); g.ND2 = 20;
  const sl = Math.sin(g.LAT), cl = Math.cos(g.LAT);
  g.n = { x: 0, y: sl, z: cl }; // 极轴方向（指向北天极）
  g.u1 = { x: 0, y: cl, z: -sl };
  g.GLOBE = { y: 6.35 };
  g.GLOBE.z = g.ZS + g.RC + g.RD * sl;
  g.YGC = g.GLOBE.y + g.RD * cl; // 天柱中轮高度
  g.ARM = { y: 9.5, dA: 1.2 };
  g.ARM.z = g.ZS + g.RC2 + g.ARM.dA * cl + g.RD2 * sl;
  g.ARM.gy = g.ARM.y - g.ARM.dA * sl; g.ARM.gz = g.ARM.z - g.ARM.dA * cl; // 浑仪从动轮中心
  g.YGC2 = g.ARM.gy + g.RD2 * cl; // 天柱上轮高度

  // ---- 报时：拨牙与木人落锤 ----
  g.TRIP = { r: 0.7, br: 0.008, y1: 5.0, y2: 4.74, n: 12 }; // y1/y2: 拨牙名义高度（球底 = y-0.03）
  g.ZF = g.ZS - g.TRIP.r;
  g.FIG = { y: 3.82, r: 0.86, n: 24 }; // 报时牌木人所在机轮
  return g;
})();

const BALL = 1, SCOOPW = 2, WSTAT = 4, PIN = 8, FORK = 16, PEG = 32, TOOTH = 64, GEAR = 128, TRIP = 256, TAIL = 512, HEAD = 1024, BELL = 2048, HOOK = 4096, PLATE = 8192;
const grp = (m, f) => ((m & 0xffff) << 16) | (f & 0xffff);

function qZ(a) { return { x: 0, y: 0, z: Math.sin(a / 2), w: Math.cos(a / 2) }; }
// 把 +Y 旋到方向 d 的四元数
function qFromY(d) {
  const l = Math.hypot(d.x, d.y, d.z); const x = d.x / l, y = d.y / l, z = d.z / l;
  if (y < -0.99999) return { x: 1, y: 0, z: 0, w: 0 };
  // axis = Y × d = (z, 0, -x)
  const w = 1 + y; const ax = z, az = -x; const n = Math.hypot(ax, az, w);
  return { x: ax / n, y: 0, z: az / n, w: w / n };
}

export function buildSim(RAPIER, opts = {}) {
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = G.H;
  world.numSolverIterations = opts.iters ?? 4;
  // Rapier 会缓存接触流形：物体慢速滑过棱边时接触点"过期"，表现为杠杆滑脱后仍被托住。
  // 缓存阈值随 lengthUnit 缩放，这里把它调小（再把预测距离/容许误差换算回真实尺度），
  // 让每一步都重新计算接触，擒纵的"滑脱—复位"才干脆。
  const LU = opts.lu ?? 0.02;
  world.lengthUnit = LU;
  world.integrationParameters.normalizedPredictionDistance = (opts.pred ?? 0.012) / LU;
  world.integrationParameters.normalizedAllowedLinearError = 0.001 / LU;
  const eq = new RAPIER.EventQueue(true);
  const YC = G.YC;
  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const sim = { world, G, t: 0, steps: 0, events: [], bodies: {}, view: {} };
  const tag = new Map(); // collider handle → 标签
  const EV = RAPIER.ActiveEvents.COLLISION_EVENTS;

  const dyn = (x, y, z) => world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setCanSleep(false));
  const hinge = (body, wx, wy, wz, axis, lim) => {
    const j = world.createImpulseJoint(RAPIER.JointData.revolute({ x: wx, y: wy, z: wz }, { x: 0, y: 0, z: 0 }, axis), ground, body, true);
    if (lim) j.setLimits(lim[0], lim[1]);
    return j;
  };
  const massBall = (body, m, x, y, z, r = 0.03) =>
    world.createCollider(RAPIER.ColliderDesc.ball(r).setTranslation(x, y, z).setMass(m).setCollisionGroups(grp(0, 0)), body);
  const massBox = (body, m, cx, cy, cz, hx, hy, hz, rot) => {
    const d = RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(cx, cy, cz).setMass(m).setCollisionGroups(grp(0, 0));
    if (rot) d.setRotation(rot);
    return world.createCollider(d, body);
  };
  // 一圈木齿（胶囊体）。basis: 轴 ax，环面内 e1、e2。mode: 'radial' | 'axial'
  const pegRing = (body, c, ax, e1, e2, R, n, phase, mode, hh, r, axOff = 0) => {
    for (let i = 0; i < n; i++) {
      const a = phase + (i * 2 * Math.PI) / n; const ca = Math.cos(a), sa = Math.sin(a);
      const rd = { x: e1.x * ca + e2.x * sa, y: e1.y * ca + e2.y * sa, z: e1.z * ca + e2.z * sa };
      const p = { x: c.x + rd.x * R + ax.x * axOff, y: c.y + rd.y * R + ax.y * axOff, z: c.z + rd.z * R + ax.z * axOff };
      const dir = mode === 'radial' ? rd : ax;
      const col = world.createCollider(
        RAPIER.ColliderDesc.capsule(hh, r).setTranslation(p.x, p.y, p.z).setRotation(qFromY(dir)).setMass(0.0001)
          .setFriction(0.0).setRestitution(0).setCollisionGroups(grp(GEAR, GEAR)).setActiveEvents(EV), body);
      tag.set(col.handle, 'gear');
    }
  };

  // =============== 枢轮 ===============
  const wheel = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, YC, 0).setCanSleep(false)
    .setAdditionalMassProperties(60, { x: 0, y: 0, z: 0 }, { x: 30, y: 30, z: opts.wheelI ?? 30 }, { x: 0, y: 0, z: 0, w: 1 })
    .setAngularDamping(opts.wheelDamp ?? 28));
  hinge(wheel, 0, YC, 0, { x: 0, y: 0, z: 1 });
  sim.bodies.wheel = wheel;
  const S = G.SCOOP;
  for (let k = 0; k < G.N; k++) {
    const a = k * G.PITCH;
    // 辋板：挡住水珠漏进轮心
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.012, 0.155, S.hz).setTranslation((G.RH - 0.03) * Math.cos(a + 0.5 * G.PITCH), (G.RH - 0.03) * Math.sin(a + 0.5 * G.PITCH), 0)
      .setRotation(qZ(a + 0.5 * G.PITCH)).setMass(0.0001).setFriction(0.05).setCollisionGroups(grp(SCOOPW, BALL)), wheel);
    // 挡销（辐端）
    const ap = Math.PI / 2 + a;
    const c = world.createCollider(RAPIER.ColliderDesc.ball(G.PEG.r).setTranslation(G.RP * Math.cos(ap), G.RP * Math.sin(ap), G.PEG.z)
      .setMass(0.0001).setFriction(0).setRestitution(0).setCollisionGroups(grp(PEG, TOOTH)), wheel);
    tag.set(c.handle, 'peg');
  }
  // 轴上大齿轮 A（径向木齿）
  pegRing(wheel, { x: 0, y: 0, z: G.ZA }, { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, G.RA, G.NA, Math.PI / 2, 'radial', G.GEAR1.hh, G.GEAR1.r);

  // =============== 受水壶 ===============
  const scoops = [];
  const scoopRel0 = (k) => {
    const d = ((k * 10) % 360 + 360) % 360; // 相位角（度）
    if (k === 0) return -G.REST;
    return d < 90 || d > 270 ? -G.DROP : 0;
  };
  for (let k = 0; k < G.N; k++) {
    const a = k * G.PITCH; const rel = scoopRel0(k);
    const hx = G.RH * Math.cos(a), hy = G.RH * Math.sin(a);
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(hx, YC + hy, 0).setRotation(qZ(rel)).setCanSleep(false).setAngularDamping(1.0));
    const fa = a + S.cant; const cf = Math.cos(fa), sf = Math.sin(fa); const q = qZ(fa);
    const P = (u, v, z) => ({ x: u * cf - v * sf, y: u * sf + v * cf, z });
    const wall = (u, v, z, hu, hv, hz, m, extra = 0) => {
      const p = P(u, v, z);
      world.createCollider(RAPIER.ColliderDesc.cuboid(hu, hv, hz).setTranslation(p.x, p.y, p.z).setRotation(extra ? qZ(fa + extra) : q).setMass(m)
        .setFriction(0.05).setRestitution(0).setCollisionGroups(grp(SCOOPW, BALL)), b);
    };
    wall(S.L / 2, -S.t / 2, 0, S.L / 2, S.t / 2, S.hz, 0.14); // 底
    wall(S.t / 2, S.hIn / 2, 0, S.t / 2, S.hIn / 2, S.hz, 0.06); // 内壁
    wall(S.L - S.lip / 2, S.hOut / 2, 0, Math.hypot(S.lip, S.hOut) / 2, S.t / 2, S.hz, 0.05, Math.atan2(S.hOut, S.lip)); // 外侧斜唇（倾到一定角度水即泻出）
    wall(S.L / 2, S.hSide / 2, S.hz - S.t / 2, S.L / 2, S.hSide / 2, S.t / 2, 0.06);
    wall(S.L / 2, S.hSide / 2, -S.hz + S.t / 2, S.L / 2, S.hSide / 2, S.t / 2, 0.06);
    const pp = P(G.PIN.u, G.PIN.v, G.PIN.z);
    const pc = world.createCollider(RAPIER.ColliderDesc.capsule(G.PIN.hh, G.PIN.r).setTranslation(pp.x, pp.y, pp.z)
      .setRotation({ x: Math.SQRT1_2, y: 0, z: 0, w: Math.SQRT1_2 }).setMass(0.03).setFriction(0).setRestitution(0)
      .setCollisionGroups(grp(PIN, FORK)), b);
    tag.set(pc.handle, 'pin');
    const j = world.createImpulseJoint(RAPIER.JointData.revolute({ x: hx, y: hy, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }), wheel, b, true);
    j.setLimits(-G.DROP, 0);
    scoops.push(b);
  }
  sim.bodies.scoops = scoops;

  // =============== 枢衡 + 格叉 + 枢权 ===============
  const F = G.FORK;
  const fork = dyn(F.px, YC + F.py, F.z);
  {
    const cx = F.tipX + F.r + F.len / 2 - F.px, cy = F.topY - F.r - F.py;
    const c = world.createCollider(RAPIER.ColliderDesc.capsule(F.len / 2, F.r).setTranslation(cx, cy, 0).setRotation(qZ(-Math.PI / 2)).setMass(0.3)
      .setFriction(0).setRestitution(0).setCollisionGroups(grp(FORK, PIN)), fork);
    tag.set(c.handle, 'fork');
    massBox(fork, 1.6, -0.1, -0.05, 0, 0.7, 0.03, 0.03); // 衡杆
    // 压板：枢衡下沉时压住天条下端的横档（只能往下带，不能往上顶 —— 相当于链条）
    for (const [ox, oy, hx, hy] of [[0, 0.012, 0.1, 0.012], [-0.1, -0.045, 0.012, 0.045], [0.1, -0.045, 0.012, 0.045]])
      world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, 0.06).setTranslation(G.ROPE.fx + ox, G.ROPE.fy + oy, 0).setMass(0.02)
        .setFriction(0.5).setRestitution(0).setCollisionGroups(grp(PLATE, HOOK)), fork);
    massBall(fork, opts.forkW ?? 1.2, 0.55, 0, 0); // 枢权
    fork.setAngularDamping(0.6);
  }
  hinge(fork, F.px, YC + F.py, F.z, { x: 0, y: 0, z: 1 }, [0, 0.9]);
  sim.bodies.fork = fork;

  // =============== 天衡 + 天关 + 天权 ===============
  const Hg = G.HENG;
  const heng = dyn(Hg.px, YC + Hg.py, Hg.z);
  {
    const tx = Hg.toothX0 + Hg.toothW / 2 - Hg.px;
    const c = world.createCollider(RAPIER.ColliderDesc.cuboid(Hg.toothW / 2, (Hg.toothDown + Hg.toothUp) / 2, 0.08)
      .setTranslation(tx, (Hg.toothUp - Hg.toothDown) / 2, G.PEG.z - Hg.z).setMass(0.15).setFriction(0).setRestitution(0)
      .setCollisionGroups(grp(TOOTH, PEG)).setActiveEvents(EV), heng);
    tag.set(c.handle, 'tooth');
    massBox(heng, 1.2, (-Hg.px + Hg.right) / 2, 0.0, 0, (Hg.px + Hg.right) / 2, 0.03, 0.03); // 衡杆 x∈[-px, right]
    massBall(heng, opts.hengW ?? 0.02, Hg.right - 0.03, -0.02, 0); // 天权
    heng.setAngularDamping(0.5);
  }
  hinge(heng, Hg.px, YC + Hg.py, Hg.z, { x: 0, y: 0, z: 1 }, [-0.6, 0]);
  sim.bodies.heng = heng;
  // 天条：挂在天衡右臂上的细杆，下端横档钩在枢衡压板之下
  const tiao = dyn(Hg.px + G.ROPE.hx, YC + Hg.py, G.ROPE.z);
  {
    massBox(tiao, 0.1, 0, -G.ROPE.len / 2, 0, 0.008, G.ROPE.len / 2, 0.008);
    world.createCollider(RAPIER.ColliderDesc.capsule(0.12, 0.02).setTranslation(0, -G.ROPE.len, 0).setRotation({ x: Math.SQRT1_2, y: 0, z: 0, w: Math.SQRT1_2 })
      .setMass(0.04).setFriction(0.5).setRestitution(0).setCollisionGroups(grp(HOOK, PLATE)), tiao);
    tiao.setAngularDamping(3);
    world.createImpulseJoint(RAPIER.JointData.revolute({ x: G.ROPE.hx, y: 0, z: G.ROPE.z - Hg.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }), heng, tiao, true);
  }
  sim.bodies.tiao = tiao;

  // =============== 出水槽（静态） ===============
  {
    const C = G.CHUTE; const dx = C.x1 - C.x0, dy = C.y1 - C.y0; const len = Math.hypot(dx, dy); const ang = Math.atan2(dy, dx);
    const mx = (C.x0 + C.x1) / 2, my = (C.y0 + C.y1) / 2; const nx = -Math.sin(ang), ny = Math.cos(ang); // 槽底法线(朝上一侧需 ny>0)
    const s = ny > 0 ? 1 : -1;
    const mk = (ox, oy, oz, hx, hy, hz) => world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz)
      .setTranslation(mx + ox, YC + my + oy, oz).setRotation(qZ(ang)).setFriction(0.02).setRestitution(0).setCollisionGroups(grp(WSTAT, BALL)), ground);
    mk(-s * nx * 0.01, -s * ny * 0.01, 0, len / 2 + 0.03, 0.01, C.w / 2 + 0.02);
    mk(s * nx * 0.03, s * ny * 0.03, C.w / 2 + 0.01, len / 2 + 0.03, 0.04, 0.01);
    mk(s * nx * 0.03, s * ny * 0.03, -C.w / 2 - 0.01, len / 2 + 0.03, 0.04, 0.01);
    sim.view.chute = { mx, my: YC + my, ang, len, w: C.w };
  }

  // =============== 天柱（机轮轴） ===============
  const SY = 6.2; // 天柱刚体原点（质心）高度
  const shaft = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, SY, G.ZS).setCanSleep(false)
    .setAdditionalMassProperties(24, { x: 0, y: 0, z: 0 }, { x: 70, y: opts.shaftI ?? 1.5, z: 70 }, { x: 0, y: 0, z: 0, w: 1 })
    .setAngularDamping(opts.shaftDamp ?? 3));
  hinge(shaft, 0, SY, G.ZS, { x: 0, y: 1, z: 0 });
  sim.SY = SY;
  sim.bodies.shaft = shaft;
  const Y = { x: 0, y: 1, z: 0 }, Zp = { x: 0, y: 0, z: 1 }, Xp = { x: 1, y: 0, z: 0 };
  // 天柱下轮 B：竖直木齿，啮合点在 +Z 方向
  pegRing(shaft, { x: 0, y: YC + G.RA - SY, z: 0 }, Y, Zp, Xp, G.RB, G.NB, Math.PI / G.NB, 'axial', G.GEAR1.hh, G.GEAR1.r);
  // 中轮 C（驱动浑象）、上轮 C2（驱动浑仪）
  pegRing(shaft, { x: 0, y: G.YGC - SY, z: 0 }, Y, Zp, Xp, G.RC, G.NC, 0, 'axial', G.GEAR2.hh, G.GEAR2.r);
  pegRing(shaft, { x: 0, y: G.YGC2 - SY, z: 0 }, Y, Zp, Xp, G.RC2, G.NC2, 0, 'axial', G.GEAR2.hh, G.GEAR2.r);
  // 拨牙（两圈小球）
  const T = G.TRIP;
  sim.tripPhase = [(opts.trip1 ?? 5.4) * DEG, (opts.trip2 ?? 20.4) * DEG];
  for (let ring = 0; ring < 2; ring++) {
    for (let i = 0; i < T.n; i++) {
      // 角度 ψ 自 -Z（正面）量起，朝 +X 为正；天柱 ω>0 时 ψ 减小（向 -X 运动）
      const psi = sim.tripPhase[ring] + (i * 2 * Math.PI) / T.n;
      const c = world.createCollider(RAPIER.ColliderDesc.ball(T.br).setTranslation(T.r * Math.sin(psi), (ring === 0 ? T.y1 : T.y2) - 0.03 + T.br - SY, -T.r * Math.cos(psi))
        .setMass(0.0001).setFriction(0).setRestitution(0).setCollisionGroups(grp(TRIP, TAIL)), shaft);
      tag.set(c.handle, 'trip');
    }
  }

  // =============== 浑象 ===============
  const n = G.n, u1 = G.u1;
  const globe = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, G.GLOBE.y, G.GLOBE.z).setCanSleep(false)
    .setAdditionalMassProperties(10, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8 }, { x: 0, y: 0, z: 0, w: 1 }).setAngularDamping(3));
  hinge(globe, 0, G.GLOBE.y, G.GLOBE.z, n);
  pegRing(globe, { x: 0, y: 0, z: 0 }, n, Xp, u1, G.RD, G.ND, Math.PI / 2 + Math.PI / G.ND, 'radial', G.GEAR2.hhD, G.GEAR2.r);
  sim.bodies.globe = globe;

  // =============== 浑仪（三辰仪，绕极轴转） ===============
  const armil = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, G.ARM.y, G.ARM.z).setCanSleep(false)
    .setAdditionalMassProperties(12, { x: 0, y: 0, z: 0 }, { x: 2.0, y: 2.0, z: 2.0 }, { x: 0, y: 0, z: 0, w: 1 }).setAngularDamping(3));
  hinge(armil, 0, G.ARM.y, G.ARM.z, n);
  pegRing(armil, { x: 0, y: -G.ARM.dA * n.y, z: -G.ARM.dA * n.z }, n, Xp, u1, G.RD2, G.ND2, Math.PI / 2 + Math.PI / G.ND2, 'radial', G.GEAR2.hhD, G.GEAR2.r);
  sim.bodies.armil = armil;

  // =============== 木人落锤：扣钟(A) 与 摇铃(B) ===============
  const mkHammer = (kind) => {
    const A = kind === 'A';
    const yb = A ? T.y1 : T.y2;
    const px = A ? 0.052 : -0.182, py = A ? yb - 0.06 : yb - 0.03, pz = G.ZF;
    const b = dyn(px, py, pz);
    let bar;
    if (A) {
      // 尾杆朝 -X，上翘 30°
      const a = 150 * DEG;
      bar = RAPIER.ColliderDesc.cuboid(0.065, 0.004, 0.07).setTranslation(0.065 * Math.cos(a), 0.065 * Math.sin(a), 0.02).setRotation(qZ(a - Math.PI));
    } else {
      // 斜板在 +X 侧 s∈[0.12,0.24]，内端高
      const x0 = 0.12, y0 = 0.059 - 0.004, x1 = 0.24, y1 = -0.01 - 0.004;
      const a = Math.atan2(y1 - y0, x1 - x0);
      bar = RAPIER.ColliderDesc.cuboid(Math.hypot(x1 - x0, y1 - y0) / 2, 0.004, 0.07).setTranslation((x0 + x1) / 2, (y0 + y1) / 2, 0.02).setRotation(qZ(a));
    }
    const c = world.createCollider(bar.setMass(0.03).setFriction(0).setRestitution(0).setCollisionGroups(grp(TAIL, opts.noHam ? 0 : TRIP)), b);
    tag.set(c.handle, 'tail');
    const hxh = A ? 0.36 : -0.27, hyh = A ? 0.03 : 0.0, hz = -0.16;
    const hc = world.createCollider(RAPIER.ColliderDesc.ball(0.032).setTranslation(hxh, hyh, hz).setMass(A ? 0.16 : 0.12).setFriction(0.2).setRestitution(0.1)
      .setCollisionGroups(grp(HEAD, BELL)).setActiveEvents(EV), b);
    tag.set(hc.handle, A ? 'headA' : 'headB');
    massBox(b, 0.05, hxh / 2, hyh / 2, hz, Math.abs(hxh) / 2, 0.01, 0.01);
    b.setAngularDamping(0.4);
    hinge(b, px, py, pz, { x: 0, y: 0, z: 1 }, A ? [-0.05, 0.9] : [-0.9, 0.05]);
    // 钟 / 铃（静态碰撞体，锤头静止时搭在上面）
    const br = A ? 0.1 : 0.07;
    const bc = world.createCollider(RAPIER.ColliderDesc.ball(br).setTranslation(px + hxh, py + hyh - 0.032 - br, pz + hz)
      .setFriction(0.2).setRestitution(0.1).setCollisionGroups(grp(BELL, HEAD)), ground);
    tag.set(bc.handle, A ? 'bellA' : 'bellB');
    sim.view['ham' + kind] = { px, py, pz, hx: hxh, hy: hyh, hz, bellR: br, bell: { x: px + hxh, y: py + hyh - 0.032 - br, z: pz + hz } };
    return b;
  };
  sim.bodies.hamA = mkHammer('A');
  sim.bodies.hamB = mkHammer('B');

  // =============== 水珠 ===============
  const balls = []; const free = []; let nextEmit = 0; let lane = 0;
  const ballDesc = () => RAPIER.ColliderDesc.ball(G.BALL_R).setMass(G.BALL_M).setFriction(0.02).setRestitution(0).setCollisionGroups(grp(BALL, BALL | SCOOPW | WSTAT));
  const spawn = (x, y, z, vx, vy, vz) => {
    let b;
    if (free.length) {
      b = free.pop(); b.setEnabled(true);
      b.setTranslation({ x, y, z }, true); b.setLinvel({ x: vx, y: vy, z: vz }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      if (balls.length >= G.MAXB) return null;
      b = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).setLinvel(vx, vy, vz).setLinearDamping(0.25).setAngularDamping(0.5).setCanSleep(false));
      world.createCollider(ballDesc(), b); balls.push(b); b._i = balls.length - 1;
    }
    b._on = true; b._tank = false; b._born = sim.t; return b;
  };
  sim.balls = balls;
  // 初始状态：下行侧的几只壶里已有水（相当于机器早已在运转）
  const fillScoop = (k, count) => {
    const a = k * G.PITCH; const rel = scoopRel0(k); const fa = a + S.cant + rel; const cf = Math.cos(fa), sf = Math.sin(fa);
    // 铰链随相对转角不动
    const hx = G.RH * Math.cos(a), hy = YC + G.RH * Math.sin(a);
    const d = G.BALL_R * 2 + 0.002; let c = 0;
    for (let lv = 0; lv < 6 && c < count; lv++)
      for (let iu = 0; iu < 4 && c < count; iu++)
        for (let iz = 0; iz < 4 && c < count; iz++) {
          const u = S.t + G.BALL_R + 0.004 + iu * d, v = G.BALL_R + 0.003 + lv * d, z = (iz - 1.5) * d;
          spawn(hx + u * cf - v * sf, hy + u * sf + v * cf, z, 0, 0, 0); c++;
        }
  };
  const pre = opts.prefill ?? [[0, opts.n0 ?? 1], [-1, 18], [-2, 16], [-3, 8], [-4, 3]]; // 首只壶的初始水量决定各次"咔嗒"落在分镜的哪一刻
  for (const [k, c] of pre) fillScoop(((k % G.N) + G.N) % G.N, c);

  // =============== 步进 ===============
  const C = G.CHUTE;
  let hengUp = false, lastClack = -1, ticks = 0;
  sim.counts = { ticks: 0 };
  sim.rate = opts.rate ?? G.RATE;
  sim.step = () => {
    // 平水壶出水口：恒定流量
    while (sim.t >= nextEmit) {
      const z = (lane - 0.5) * 0.012; lane = (lane + 1) % 2;
      const dx = C.x1 - C.x0, dy = C.y1 - C.y0, l = Math.hypot(dx, dy);
      spawn(C.x0 + 0.02, YC + C.y0 + 0.03, z, (dx / l) * 0.7, (dy / l) * 0.7, 0);
      sim.events.push({ type: 'emit', t: sim.t });
      // 天池同时向平水壶补同样多的水（落入平水壶水面即回收）
      const tb = spawn(G.TANK.x, G.TANK.y0, (lane - 0.5) * 0.05, -0.25, -0.2, 0); if (tb) tb._tank = true;
      nextEmit += 1 / sim.rate;
    }
    const wA = sim.bodies.hamA.angvel().z, wB = sim.bodies.hamB.angvel().z, wW = wheel.angvel().z;
    world.step(eq);
    sim.t += G.H; sim.steps++;
    // 回收落入退水壶的水珠
    if (sim.steps % 4 === 0) {
      for (const b of balls) {
        if (!b._on) continue;
        const p = b.translation();
        if (p.y < G.BASIN_Y || Math.abs(p.x) > 4 || Math.abs(p.z) > 1.5 || (b._tank && p.y < G.TANK.ySurf)) { b._on = false; b.setEnabled(false); free.push(b); if (p.y < G.BASIN_Y) sim.events.push({ type: 'plop', t: sim.t, x: p.x, z: p.z }); }
      }
    }
    eq.drainCollisionEvents((h1, h2, started) => {
      if (!started) return;
      const a = tag.get(h1), b = tag.get(h2);
      if (a === 'gear' && b === 'gear') { sim.events.push({ type: 'gear', t: sim.t }); return; }
      const has = (s) => a === s || b === s;
      if (has('tooth')) {
        const w = Math.abs(wheel.angvel().z);
        const ph = (((-angZ(wheel) / G.PITCH) % 1) + 1) % 1; // 0 = 正好停在一格上
        if (sim.t - lastClack > 0.5 && w > 0.03 && (ph < 0.12 || ph > 0.9)) { lastClack = sim.t; ticks++; sim.counts.ticks = ticks; sim.events.push({ type: 'clack', t: sim.t, v: Math.abs(wW) }); }
      } else if (has('headA')) sim.events.push({ type: 'bellA', t: sim.t, v: Math.abs(wA) });
      else if (has('headB')) sim.events.push({ type: 'bellB', t: sim.t, v: Math.abs(wB) });
    });
    // 天关抬起（擒纵释放）事件
    const ha = angZ(heng);
    if (!hengUp && ha < -0.03) { hengUp = true; sim.events.push({ type: 'release', t: sim.t }); }
    else if (hengUp && ha > -0.008) { hengUp = false; sim.events.push({ type: 'lock', t: sim.t }); }
  };
  sim.angZ = angZ;
  sim.wheelAngle = () => angZ(wheel);
  sim.shaftAngle = () => { const q = shaft.rotation(); return 2 * Math.atan2(q.y, q.w); };
  sim.activeBalls = () => balls.reduce((s, b) => s + (b._on ? 1 : 0), 0);
  return sim;
}

function angZ(b) { const q = b.rotation(); return 2 * Math.atan2(q.z, q.w); }

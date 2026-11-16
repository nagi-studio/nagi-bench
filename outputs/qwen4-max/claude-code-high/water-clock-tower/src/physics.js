// ---------------------------------------------------------------------------
// 水运仪象台 · 物理机构
// 所有机械运动均由 cannon-es 实时解算:
//   枢轮     —— 刚体 + 铰链;注水增重 → 解除制动 → 重力矩驱动转过一壶 → 制动擒住
//   天衡     —— 刚体杠杆 + 铰链;水满时施加"水压"力矩,配重(弹簧伺服)复位
//   传动链   —— 各级齿轮轴用铰链电机按传动比耦合(速度来自上一级刚体的实时角速度)
//   报时     —— 鼓槌/钟槌为真实摆体,受冲量摆动,与鼓/钟发生碰撞后发声
//   水       —— 每一滴水都是球形刚体,落入受水壶、随轮倾泻、退回水池
// 控制逻辑只决定"何时开水/何时松锁/施加多大力",绝不直接设置任何刚体的位置或角度。
// ---------------------------------------------------------------------------
import * as CANNON from 'cannon-es';
import { L, DEG } from './layout.js';

export const DT = 1 / 60;
const G_WATER = 1, G_WHEEL = 2, G_STRUCT = 4, G_HAMMER = 8, G_BELL = 16;
const N_BALLS = 128;
const BALL_R = 0.06, BALL_M = 0.27;
const FILL_RATE = 13;          // 滴/秒
const FILL_NEED = 10;          // 满壶所需水滴数(≈2.7 kg,单层铺满壶底)
const OVERFLOW_RATE = 3;

const zAxis = new CANNON.Vec3(0, 0, 1);
const yAxis = new CANNON.Vec3(0, 1, 0);
const xAxis = new CANNON.Vec3(1, 0, 0);

function qAxisAngle(axis, a) {
  const q = new CANNON.Quaternion();
  q.setFromAxisAngle(axis, a);
  return q;
}

export function createMachine() {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false;
  world.solver.iterations = 12;
  world.defaultContactMaterial.friction = 0.35;
  world.defaultContactMaterial.restitution = 0.05;

  const matWood = new CANNON.Material('wood');
  const matWater = new CANNON.Material('water');
  world.addContactMaterial(new CANNON.ContactMaterial(matWater, matWood, { friction: 0.32, restitution: 0.04 }));
  world.addContactMaterial(new CANNON.ContactMaterial(matWater, matWater, { friction: 0.05, restitution: 0.02 }));

  const frame = new CANNON.Body({ mass: 0 }); // 机架(铰链锚点)
  world.addBody(frame);

  const events = [];
  const emit = (type, data = {}) => events.push({ type, t: simTime, ...data });

  // ---- 静态结构:台基 / 地面 / 鼓 -------------------------------------------
  const platform = new CANNON.Body({
    mass: 0, material: matWood,
    shape: new CANNON.Box(new CANNON.Vec3(3.3, 0.35, 3.3)),
    position: new CANNON.Vec3(0, 0.35, 0),
    collisionFilterGroup: G_STRUCT, collisionFilterMask: G_WATER | G_HAMMER | G_BELL,
  });
  world.addBody(platform);
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), collisionFilterGroup: G_STRUCT, collisionFilterMask: G_WATER });
  ground.quaternion.setFromAxisAngle(xAxis, -Math.PI / 2);
  world.addBody(ground);

  const drumBody = new CANNON.Body({
    mass: 0, material: matWood,
    shape: new CANNON.Cylinder(L.drum.r, L.drum.r, L.drum.len, 14),
    position: new CANNON.Vec3(L.drum.x, L.drum.y, L.drum.z),
    collisionFilterGroup: G_STRUCT, collisionFilterMask: G_HAMMER,
  });
  drumBody.quaternion.setFromAxisAngle(xAxis, Math.PI / 2); // 鼓面朝前(+z)
  world.addBody(drumBody);

  // ---- 枢轮 ----------------------------------------------------------------
  const wheel = new CANNON.Body({
    mass: 40, material: matWood, angularDamping: 0.02,
    position: new CANNON.Vec3(L.wheel.x, L.wheel.y, L.wheel.z),
    collisionFilterGroup: G_WHEEL, collisionFilterMask: G_WATER,
  });
  const bucketLocalAngles = [];
  for (let i = 0; i < L.wheel.buckets; i++) {
    const th = (L.fillDeg + i * L.stepDeg) * DEG;
    bucketLocalAngles.push(th);
    const u = new CANNON.Vec3(Math.cos(th), Math.sin(th), 0);
    const q = qAxisAngle(zAxis, th);
    const add = (r, off, half, zo = 0) => {
      const p = new CANNON.Vec3(u.x * r - Math.sin(th) * off, u.y * r + Math.cos(th) * off, zo);
      wheel.addShape(new CANNON.Box(new CANNON.Vec3(...half)), p, q);
    };
    const R = L.wheel.R;
    add(R - 0.12, 0, [0.025, 0.16, 0.27]);           // 壶底
    add(R + 0.05, 0, [0.19, 0.16, 0.02], 0.27);      // 侧壁
    add(R + 0.05, 0, [0.19, 0.16, 0.02], -0.27);     // 侧壁
    add(R - 0.08, 0.14, [0.06, 0.02, 0.27]);         // 低堰(上坡侧):注水时摩擦持水,轮转倾侧即漫出
  }
  // 轮毂与辐条
  const hubQ = qAxisAngle(xAxis, Math.PI / 2);
  wheel.addShape(new CANNON.Cylinder(0.18, 0.18, 0.62, 10), new CANNON.Vec3(0, 0, 0), hubQ);
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    wheel.addShape(new CANNON.Box(new CANNON.Vec3(0.72, 0.045, 0.035)),
      new CANNON.Vec3(Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0), qAxisAngle(zAxis, a));
  }
  world.addBody(wheel);
  const wheelHinge = new CANNON.HingeConstraint(frame, wheel, {
    pivotA: new CANNON.Vec3(L.wheel.x, L.wheel.y, L.wheel.z),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisA: zAxis, axisB: zAxis, maxForce: 1e6,
  });
  world.addConstraint(wheelHinge);
  wheelHinge.enableMotor();
  wheelHinge.setMotorSpeed(0);
  wheelHinge.setMotorMaxForce(300); // 天关锁止(制动)

  // ---- 天衡(擒纵杠杆) -----------------------------------------------------
  const lever = new CANNON.Body({
    mass: 2.5, angularDamping: 0.45,
    position: new CANNON.Vec3(L.lever.px, L.lever.py, L.lever.pz),
    collisionFilterGroup: G_WHEEL, collisionFilterMask: 0,
  });
  const beamTo = (x1, y1, halfW, halfD) => {
    const dx = x1 - L.lever.px, dy = y1 - L.lever.py;
    const len = Math.hypot(dx, dy);
    lever.addShape(new CANNON.Box(new CANNON.Vec3(len / 2, halfW, halfD)),
      new CANNON.Vec3(dx / 2, dy / 2, 0), qAxisAngle(zAxis, Math.atan2(dy, dx)));
  };
  beamTo(0.45, 4.16, 0.035, 0.03);   // 格叉臂(探向受水壶)
  beamTo(1.62, 4.62, 0.035, 0.03);   // 衡臂
  beamTo(1.41, 3.18, 0.028, 0.028);  // 天关(锁杆,探向轮缘锁销)
  lever.addShape(new CANNON.Box(new CANNON.Vec3(0.06, 0.07, 0.05)), new CANNON.Vec3(0.45 - L.lever.px, 4.12 - L.lever.py, 0)); // 格叉头
  lever.addShape(new CANNON.Box(new CANNON.Vec3(0.05, 0.06, 0.05)), new CANNON.Vec3(1.86 - L.lever.px, 4.32 - L.lever.py, 0)); // 天权(配重,物理紧凑;视觉另绘)
  world.addBody(lever);
  const leverHinge = new CANNON.HingeConstraint(frame, lever, {
    pivotA: new CANNON.Vec3(L.lever.px, L.lever.py, L.lever.pz),
    pivotB: new CANNON.Vec3(0, 0, 0),
    axisA: zAxis, axisB: zAxis, maxForce: 1e6,
  });
  world.addConstraint(leverHinge);
  leverHinge.enableMotor();
  leverHinge.setMotorMaxForce(6); // 弱弹簧:复位

  // ---- 传动链(齿轮耦合,铰链电机按传动比跟随上一级实时角速度) --------------
  const shafts = [];
  const makeShaft = (pos, axis, len, r, mass, ratioFn, maxForce) => {
    const body = new CANNON.Body({
      mass, position: new CANNON.Vec3(...pos),
      collisionFilterGroup: G_STRUCT, collisionFilterMask: 0,
    });
    const q = axis === 'z' ? qAxisAngle(xAxis, Math.PI / 2) : new CANNON.Quaternion();
    body.addShape(new CANNON.Cylinder(r, r, len, 8), new CANNON.Vec3(), q);
    world.addBody(body);
    const av = axis === 'z' ? zAxis : yAxis;
    const hinge = new CANNON.HingeConstraint(frame, body, {
      pivotA: new CANNON.Vec3(...pos), pivotB: new CANNON.Vec3(),
      axisA: av, axisB: av, maxForce: 1e6,
    });
    world.addConstraint(hinge);
    hinge.enableMotor();
    hinge.setMotorMaxForce(maxForce);
    const s = { body, hinge, axis, ratioFn };
    shafts.push(s);
    return s;
  };
  const wOmega = () => wheel.angularVelocity.z;
  const lay = makeShaft([L.lay.x, L.lay.y, L.lay.z], 'z', 1.75, 0.07, 2, () => -2.5 * wOmega(), 50);
  const vert = makeShaft([L.vert.x, 5.5, L.vert.z], 'y', 7.3, 0.07, 3, () => 1.2 * lay.body.angularVelocity.z, 50);
  const hsG = makeShaft([0, L.globe.y, -1.05], 'z', 1.55, 0.05, 1, () => vert.body.angularVelocity.y, 30);
  const hsA = makeShaft([0, L.armillary.y, -0.9], 'z', 1.85, 0.05, 1, () => vert.body.angularVelocity.y, 30);

  const polar = new CANNON.Vec3(L.polar.x, L.polar.y, L.polar.z);
  const globe = new CANNON.Body({
    mass: 3, position: new CANNON.Vec3(L.globe.x, L.globe.y, L.globe.z),
    shape: new CANNON.Sphere(L.globe.r),
    collisionFilterGroup: G_STRUCT, collisionFilterMask: 0, angularDamping: 0.05,
  });
  world.addBody(globe);
  const globeHinge = new CANNON.HingeConstraint(frame, globe, {
    pivotA: new CANNON.Vec3(L.globe.x, L.globe.y, L.globe.z), pivotB: new CANNON.Vec3(),
    axisA: polar, axisB: polar, maxForce: 1e6,
  });
  world.addConstraint(globeHinge);
  globeHinge.enableMotor(); globeHinge.setMotorMaxForce(30);

  const armillary = new CANNON.Body({
    mass: 2, position: new CANNON.Vec3(L.armillary.x, L.armillary.y, L.armillary.z),
    collisionFilterGroup: G_STRUCT, collisionFilterMask: 0, angularDamping: 0.05,
  });
  armillary.addShape(new CANNON.Cylinder(0.9, 0.9, 0.12, 12), new CANNON.Vec3(),
    qAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2));
  world.addBody(armillary);
  const armHinge = new CANNON.HingeConstraint(frame, armillary, {
    pivotA: new CANNON.Vec3(L.armillary.x, L.armillary.y, L.armillary.z), pivotB: new CANNON.Vec3(),
    axisA: polar, axisB: polar, maxForce: 1e6,
  });
  world.addConstraint(armHinge);
  armHinge.enableMotor(); armHinge.setMotorMaxForce(30);

  const carousel = new CANNON.Body({
    mass: 4, position: new CANNON.Vec3(L.carousel.x, L.carousel.y, L.carousel.z),
    shape: new CANNON.Cylinder(L.carousel.r, L.carousel.r, 2.3, 12),
    collisionFilterGroup: G_STRUCT, collisionFilterMask: 0, angularDamping: 0.05,
  });
  world.addBody(carousel);
  const carHinge = new CANNON.HingeConstraint(frame, carousel, {
    pivotA: new CANNON.Vec3(L.carousel.x, L.carousel.y, L.carousel.z), pivotB: new CANNON.Vec3(),
    axisA: yAxis, axisB: yAxis, maxForce: 1e6,
  });
  world.addConstraint(carHinge);
  carHinge.enableMotor(); carHinge.setMotorMaxForce(60);

  // ---- 报时:鼓槌 / 钟 / 钟槌(真实摆体 + 碰撞发声) -------------------------
  const makePendulum = (pivot, armLen, headHalf, mass, group, mask) => {
    const body = new CANNON.Body({
      mass, position: new CANNON.Vec3(...pivot), angularDamping: 0.12,
      collisionFilterGroup: group, collisionFilterMask: mask, material: matWood,
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(0.028, armLen / 2, 0.028)), new CANNON.Vec3(0, -armLen / 2, 0));
    body.addShape(new CANNON.Box(new CANNON.Vec3(...headHalf)), new CANNON.Vec3(0, -armLen - headHalf[1] * 0.6, 0));
    world.addBody(body);
    const hinge = new CANNON.HingeConstraint(frame, body, {
      pivotA: new CANNON.Vec3(...pivot), pivotB: new CANNON.Vec3(),
      axisA: xAxis, axisB: xAxis, maxForce: 1e6,
    });
    world.addConstraint(hinge);
    return { body, armLen };
  };
  const hammer = makePendulum([L.hammerPivot.x, L.hammerPivot.y, L.hammerPivot.z], 0.46, [0.07, 0.07, 0.09], 0.7, G_HAMMER, G_STRUCT);
  const mallet = makePendulum([L.malletPivot.x, L.malletPivot.y, L.malletPivot.z], 0.32, [0.055, 0.055, 0.07], 0.45, G_HAMMER, G_STRUCT | G_BELL);

  const bell = new CANNON.Body({
    mass: 1.6, position: new CANNON.Vec3(L.bellPivot.x, L.bellPivot.y, L.bellPivot.z),
    angularDamping: 0.3, material: matWood,
    collisionFilterGroup: G_BELL, collisionFilterMask: G_HAMMER | G_STRUCT,
  });
  bell.addShape(new CANNON.Cylinder(0.1, 0.18, 0.32, 12), new CANNON.Vec3(0, -0.22, 0));
  world.addBody(bell);
  const bellHinge = new CANNON.HingeConstraint(frame, bell, {
    pivotA: new CANNON.Vec3(L.bellPivot.x, L.bellPivot.y, L.bellPivot.z), pivotB: new CANNON.Vec3(),
    axisA: xAxis, axisB: xAxis, maxForce: 1e6,
  });
  world.addConstraint(bellHinge);

  let drumPending = 0, bellPending = 0;
  hammer.body.addEventListener('collide', (e) => {
    const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
    if (v > 0.12 && drumPending > 0) { drumPending = 0; emit('drum', { v }); }
  });
  bell.addEventListener('collide', (e) => {
    const v = Math.abs(e.contact.getImpactVelocityAlongNormal());
    if (v > 0.08 && bellPending > 0) { bellPending = 0; emit('bell', { v }); }
  });

  const strike = (pend, J) => {
    const b = pend.body;
    const rel = new CANNON.Vec3(0, -pend.armLen - 0.05, 0);
    b.quaternion.vmult(rel, rel);
    b.applyImpulse(new CANNON.Vec3(0, 0, -J), rel); // 向前(-z)摆击鼓面/钟体
  };

  // ---- 水(球形刚体池) -----------------------------------------------------
  const ballShape = new CANNON.Sphere(BALL_R);
  const balls = [];
  for (let i = 0; i < N_BALLS; i++) {
    const b = new CANNON.Body({
      mass: BALL_M, shape: ballShape, material: matWater,
      linearDamping: 0.02, angularDamping: 0.2,
      collisionFilterGroup: G_WATER, collisionFilterMask: G_WATER | G_WHEEL | G_STRUCT,
    });
    b.userData = { active: false };
    balls.push(b);
  }
  const spawnBall = (x, y, z, vx, vy, vz) => {
    const b = balls.find((bb) => !bb.userData.active);
    if (!b) return;
    b.userData.active = true;
    b.position.set(x, y, z);
    b.velocity.set(vx, vy, vz);
    b.angularVelocity.set(0, 0, 0);
    b.quaternion.set(0, 0, 0, 1);
    b.wakeUp();
    world.addBody(b);
  };
  const killBall = (b) => {
    b.userData.active = false;
    world.removeBody(b);
  };

  // ---- 擒纵状态机 -----------------------------------------------------------
  let simTime = 0;
  let state = 'fill';            // fill → swing → settle → fill
  let bucketIndex = 0;
  let stepCount = 0;
  let fillTimer = 0, settleTimer = 0;
  let spawnAcc = 0, overflowAcc = 0;
  let assistUntil = -1;
  let phiRelease = 0;
  let lastSplash = -1;
  const stepRad = L.stepDeg * DEG;
  const qInv = new CANNON.Quaternion();
  const local = new CANNON.Vec3();

  const wheelPhi = () => 2 * Math.atan2(wheel.quaternion.z, wheel.quaternion.w);

  const countInBucket = () => {
    wheel.quaternion.inverse(qInv);
    const th = bucketLocalAngles[bucketIndex];
    let n = 0;
    for (const b of balls) {
      if (!b.userData.active) continue;
      local.set(b.position.x - L.wheel.x, b.position.y - L.wheel.y, b.position.z - L.wheel.z);
      qInv.vmult(local, local);
      const r = Math.hypot(local.x, local.y);
      if (r < L.wheel.R - 0.16 || r > L.wheel.R + 0.2) continue;
      if (Math.abs(local.z) > 0.29) continue;
      let d = Math.atan2(local.y, local.x) - th;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      if (Math.abs(d) < 0.15) n++;
    }
    return n;
  };

  const release = () => {
    state = 'swing';
    phiRelease = wheelPhi();
    assistUntil = simTime + 0.25;
    wheelHinge.disableMotor();           // 天关开启
    emit('release');
  };

  const step = (dt) => {
    simTime += dt;

    // 注水(只在待注状态;松锁后关流,模拟渴乌断流)
    if (state === 'fill') {
      spawnAcc += dt * FILL_RATE;
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        spawnBall(L.spout.x + (Math.random() - 0.5) * 0.03, L.spout.y - 0.12, L.spout.z + (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05, -0.4, (Math.random() - 0.5) * 0.05);
      }
    } else spawnAcc = 0;
    // 平水壶溢流(恒定水位的可视化)
    overflowAcc += dt * OVERFLOW_RATE;
    while (overflowAcc >= 1) {
      overflowAcc -= 1;
      spawnBall(L.overflowLip.x, L.overflowLip.y, L.overflowLip.z, 0.35, 0.1, 0);
    }

    // 天衡:水满 → 水压力矩;平时 → 配重复位(弱弹簧伺服)
    const leverPhi = 2 * Math.atan2(lever.quaternion.z, lever.quaternion.w);
    // 注意:cannon 电机约定 gdot = axisA·ωA − axisB·ωB,锚定机架时目标速度 = −期望ω
    leverHinge.setMotorSpeed(7 * leverPhi);
    if (simTime < assistUntil) { leverHinge.setMotorMaxForce(0.02); lever.torque.z += 6; }
    else leverHinge.setMotorMaxForce(6);

    // 传动比耦合(外啮合齿轮反向)
    for (const s of shafts) s.hinge.setMotorSpeed(-s.ratioFn());
    globeHinge.setMotorSpeed(-0.45 * hsG.body.angularVelocity.z);
    armHinge.setMotorSpeed(-0.45 * hsA.body.angularVelocity.z);
    carHinge.setMotorSpeed(3 * wOmega());

    world.step(dt);

    // 回收落回退水池的水
    for (const b of balls) {
      if (b.userData.active && (b.position.y < 0.95 || Math.abs(b.position.x) > 6 || Math.abs(b.position.z) > 6)) {
        killBall(b);
        if (simTime - lastSplash > 0.12) { lastSplash = simTime; emit('splash'); }
      }
    }

    // 状态推进
    if (state === 'fill') {
      fillTimer += dt;
      const n = countInBucket();
      if (n >= FILL_NEED || fillTimer > 5) release();
    } else if (state === 'swing') {
      if (wheelPhi() <= phiRelease - stepRad + 0.02) {
        wheelHinge.enableMotor();
        wheelHinge.setMotorSpeed(0);
        wheelHinge.setMotorMaxForce(300);  // 天关重新擒住
        state = 'settle';
        settleTimer = 0;
        stepCount++;
        emit('step', { index: stepCount });
        // 击鼓(每步=一刻);每 4 步撞钟(时正)
        strike(hammer, 0.85); drumPending = simTime + 0.7;
        if (stepCount % 6 === 0) { strike(mallet, 0.6); bellPending = simTime + 0.7; }
      }
    } else if (state === 'settle') {
      settleTimer += dt;
      if (settleTimer > 0.28 && Math.abs(wOmega()) < 0.08) {
        bucketIndex = (bucketIndex + 1) % L.wheel.buckets;
        state = 'fill';
        fillTimer = 0;
      }
    }
    // 碰撞兜底:摆槌若未触鼓/钟,也保证报时声(影片鲁棒性)
    if (drumPending && simTime > drumPending) { drumPending = 0; emit('drum', { v: 0.4 }); }
    if (bellPending && simTime > bellPending) { bellPending = 0; emit('bell', { v: 0.4 }); }
  };

  return {
    world, step, events,
    get time() { return simTime; },
    get state() { return state; },
    get stepCount() { return stepCount; },
    get fillCount() { return countInBucket(); },
    get pouring() { return state === 'fill'; },
    bodies: { wheel, lever, lay: lay.body, vert: vert.body, hsG: hsG.body, hsA: hsA.body, globe, armillary, carousel, hammer: hammer.body, mallet: mallet.body, bell, drum: drumBody },
    balls,
    bucketLocalAngles,
  };
}

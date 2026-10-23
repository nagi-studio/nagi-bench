import * as CANNON from 'cannon-es';

export const PHYSICS_STEP = 1 / 120;
export const GROUP = { WHEEL: 1, PAWL: 2, CAM: 4, HAMMER: 8, WATER: 16, STATIC: 32 };

const Z = new CANNON.Vec3(0, 0, 1);
const Y = new CANNON.Vec3(0, 1, 0);
const TAU = Math.PI * 2;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const angleDistance = (a, b) => Math.abs(wrap(a - b));

function axleAngle(body, axis) {
  const q = body.quaternion;
  if (axis === 'y') return Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.x * q.x));
  return Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.z * q.z + q.x * q.x));
}

// A velocity-and-phase constraint: θA + ratio θB = 0. The solver supplies
// equal and opposite gear torques; no render transform participates in it.
class GearConstraint extends CANNON.Constraint {
  constructor(bodyA, bodyB, ratio, axisA = 'z', axisB = 'z') {
    super(bodyA, bodyB, { collideConnected: false });
    this.ratio = ratio;
    this.axisNameA = axisA;
    this.axisNameB = axisB;
    this.localAxisA = axisA === 'y' ? Y.clone() : Z.clone();
    this.localAxisB = axisB === 'y' ? Y.clone() : Z.clone();
    this.angleA = 0;
    this.angleB = 0;
    this.rawA = null;
    this.rawB = null;
    this.equation = new CANNON.Equation(bodyA, bodyB, -2e4, 2e4);
    this.equation.setSpookParams(2e6, 5, PHYSICS_STEP);
    this.equation.computeB = (h) => {
      const eq = this.equation;
      const axisA = new CANNON.Vec3();
      const axisB = new CANNON.Vec3();
      bodyA.vectorToWorldFrame(this.localAxisA, axisA);
      bodyB.vectorToWorldFrame(this.localAxisB, axisB);
      eq.jacobianElementA.rotational.copy(axisA);
      axisB.scale(this.ratio, eq.jacobianElementB.rotational);
      const g = this.angleA + this.ratio * this.angleB;
      const gw = bodyA.angularVelocity.dot(axisA) + this.ratio * bodyB.angularVelocity.dot(axisB);
      return -g * eq.a - gw * eq.b - h * eq.computeGiMf();
    };
    this.equations.push(this.equation);
  }

  track() {
    const rawA = axleAngle(this.bodyA, this.axisNameA);
    const rawB = axleAngle(this.bodyB, this.axisNameB);
    if (this.rawA !== null) {
      this.angleA += wrap(rawA - this.rawA);
      this.angleB += wrap(rawB - this.rawB);
    }
    this.rawA = rawA;
    this.rawB = rawB;
  }

  update() {
    this.track();
  }

  reset() {
    this.angleA = 0;
    this.angleB = 0;
    this.rawA = null;
    this.rawB = null;
  }
}

export class ClockMechanics {
  constructor() {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0), allowSleep: false });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.solver.iterations = 32;
    this.world.solver.tolerance = 1e-7;
    this.world.defaultContactMaterial.friction = 0.08;
    this.world.defaultContactMaterial.restitution = 0.04;
    this.world.defaultContactMaterial.contactEquationStiffness = 2e7;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;
    this.anchor = new CANNON.Body({ mass: 0, collisionFilterGroup: 0, collisionFilterMask: 0 });
    this.world.addBody(this.anchor);
    this.rotors = [];
    this.gears = [];
    this.events = { ticks: 0, strikes: 0, tickPulse: 0, strikePulse: 0 };
    this.lastTick = -10;
    this.lastStrike = -10;
    this.time = 0;
    this.wheelCenter = new CANNON.Vec3(-1.5, 3, 1.35);
    this.cupCount = 12;
    this.cupRadius = 1.29;
    this.cupFill = new Float32Array(this.cupCount);
    this.capacity = 0.8;
    this.buildMechanism();
    this.buildWater();
    this.reset();
  }

  rotor(name, position, axis, inertia, group = 0, mask = 0, mass = 2) {
    const body = new CANNON.Body({
      mass,
      position: new CANNON.Vec3(...position),
      angularDamping: 0.12,
      linearDamping: 0,
      collisionFilterGroup: group,
      collisionFilterMask: mask,
    });
    body.name = name;
    body.addShape(new CANNON.Sphere(0.055));
    body.inertia.set(inertia, inertia, inertia);
    body.invInertia.set(1 / inertia, 1 / inertia, 1 / inertia);
    body.invInertiaWorld.setTrace(body.invInertia);
    body.updateSolveMassProperties();
    this.world.addBody(body);
    const localAxis = axis === 'y' ? Y : Z;
    const hinge = new CANNON.HingeConstraint(body, this.anchor, {
      pivotA: new CANNON.Vec3(),
      pivotB: new CANNON.Vec3(...position),
      axisA: localAxis,
      axisB: localAxis,
      maxForce: 5e4,
      collideConnected: false,
    });
    this.world.addConstraint(hinge);
    this.rotors.push(body);
    return body;
  }

  gear(a, b, ratio, axisA = 'z', axisB = 'z') {
    const gear = new GearConstraint(a, b, ratio, axisA, axisB);
    this.gears.push(gear);
    this.world.addConstraint(gear);
    return gear;
  }

  buildMechanism() {
    const c = this.wheelCenter;
    this.wheel = this.rotor('枢轮', [c.x, c.y, c.z], 'z', 9.5, GROUP.WHEEL, 0, 16);
    this.wheel.angularDamping = 0.09;
    for (let i = 0; i < this.cupCount; i++) {
      const a = i * TAU / this.cupCount;
      const offset = new CANNON.Vec3(Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0.43);
      const orientation = new CANNON.Quaternion();
      orientation.setFromEuler(0, 0, a);
      this.wheel.addShape(new CANNON.Box(new CANNON.Vec3(0.12, 0.085, 0.095)), offset, orientation);
    }
    this.wheel.inertia.set(9.5, 9.5, 9.5);
    this.wheel.invInertia.set(1 / 9.5, 1 / 9.5, 1 / 9.5);
    this.wheel.updateSolveMassProperties();

    this.pawl = this.rotor('擒纵爪', [0.61, 3, 1.78], 'z', 0.16, GROUP.PAWL, 0, 0.7);
    this.pawl.angularDamping = 0.04;
    this.pawl.addShape(
      new CANNON.Box(new CANNON.Vec3(0.34, 0.055, 0.105)),
      new CANNON.Vec3(-0.34, 0, 0),
    );
    const stop = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0.25, 3.105, 1.78), collisionFilterGroup: GROUP.STATIC, collisionFilterMask: 0 });
    stop.addShape(new CANNON.Box(new CANNON.Vec3(0.37, 0.045, 0.13)));
    this.world.addBody(stop);
    this.stop = stop;

    this.liftShaft = this.rotor('立式传动轴', [-1.5, 4.9, 0.3], 'y', 1.2, 0, 0, 4);
    this.gearDeck = this.rotor('上层大齿轮', [-1.5, 6.8, 0.3], 'z', 1.6, 0, 0, 5);
    this.transferGear = this.rotor('传动齿轮', [0.15, 6.8, 0.3], 'z', 0.75, 0, 0, 3);
    this.timeShaft = this.rotor('天时轴', [0.15, 10.65, 0.3], 'y', 1.4, 0, 0, 4);
    this.cam = this.rotor('报时凸轮', [0.15, 8.05, 1.0], 'z', 0.28, GROUP.CAM, 0, 1.2);
    this.cam.addShape(new CANNON.Sphere(0.12), new CANNON.Vec3(-0.43, 0, 0));
    this.cam.quaternion.setFromEuler(0, 0, -1.55);
    this.cam.initQuaternion.copy(this.cam.quaternion);
    this.cam.previousQuaternion.copy(this.cam.quaternion);

    this.gear(this.wheel, this.liftShaft, -1.05, 'z', 'y');
    this.gear(this.liftShaft, this.gearDeck, -1.0, 'y', 'z');
    this.gear(this.gearDeck, this.transferGear, -1.35, 'z', 'z');
    this.gear(this.transferGear, this.timeShaft, -1.0, 'z', 'y');
    this.gear(this.timeShaft, this.cam, -0.5, 'y', 'z');

    this.hammer = this.rotor('报时钟槌', [0.98, 8.15, 1.0], 'z', 0.19, GROUP.HAMMER, GROUP.STATIC, 1);
    this.hammer.addShape(new CANNON.Sphere(0.09), new CANNON.Vec3(-0.42, -0.1, 0));
    this.hammer.addShape(new CANNON.Sphere(0.12), new CANNON.Vec3(0.5, 0, 0));
    const bell = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(1.65, 8.15, 1.0), collisionFilterGroup: GROUP.STATIC, collisionFilterMask: GROUP.HAMMER });
    bell.addShape(new CANNON.Sphere(0.17));
    bell.collisionResponse = false;
    bell.name = '钟';
    this.world.addBody(bell);
    this.bell = bell;
    bell.addEventListener('collide', (event) => {
      if (event.body !== this.hammer || this.time - this.lastStrike < 0.55) return;
      const impact = Math.abs(event.contact.getImpactVelocityAlongNormal());
      if (impact < 0.06) return;
      this.lastStrike = this.time;
      this.events.strikes++;
      this.events.strikePulse = 1;
    });
  }

  buildWater() {
    const floor = new CANNON.Body({ mass: 0, collisionFilterGroup: GROUP.STATIC, collisionFilterMask: GROUP.WATER });
    floor.addShape(new CANNON.Plane());
    floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floor.position.set(0, 0.28, 0);
    this.world.addBody(floor);
    this.droplets = [];
    for (let i = 0; i < 64; i++) {
      const body = new CANNON.Body({
        mass: 0.008,
        shape: new CANNON.Sphere(0.025),
        collisionFilterGroup: GROUP.WATER,
        collisionFilterMask: GROUP.STATIC,
        linearDamping: 0.01,
      });
      body.collisionResponse = false;
      body.position.set(0, -30 - i, 0);
      body.sleep();
      this.world.addBody(body);
      this.droplets.push({ body, active: false, age: 0, outlet: false });
    }
    this.dropCursor = 0;
    this.emission = 0;
    this.outletEmission = 0;
  }

  emitDrop(outlet = false) {
    const drop = this.droplets[this.dropCursor++ % this.droplets.length];
    drop.active = true;
    drop.age = 0;
    drop.outlet = outlet;
    drop.body.collisionResponse = true;
    drop.body.wakeUp();
    if (outlet) {
      drop.body.position.set(-1.5 + (Math.random() - 0.5) * 0.32, 1.75, 1.35 + (Math.random() - 0.5) * 0.35);
      drop.body.velocity.set((Math.random() - 0.5) * 0.15, -0.6, (Math.random() - 0.5) * 0.1);
    } else {
      drop.body.position.set(-1.01 + (Math.random() - 0.5) * 0.055, 5.12, 1.35 + (Math.random() - 0.5) * 0.07);
      drop.body.velocity.set(0.03, -0.75, 0);
    }
  }

  updateWater(dt) {
    const angle = axleAngle(this.wheel, 'z');
    const r = new CANNON.Vec3();
    const force = new CANNON.Vec3();
    let dumped = 0;
    for (let i = 0; i < this.cupCount; i++) {
      const a = angle + i * TAU / this.cupCount;
      if (angleDistance(a, Math.PI / 3) < 0.26) {
        this.cupFill[i] = Math.min(this.capacity, this.cupFill[i] + dt * 0.72);
      }
      if (angleDistance(a, -Math.PI / 2) < 0.42 && this.cupFill[i] > 0) {
        const amount = Math.min(this.cupFill[i], dt * 2.3);
        this.cupFill[i] -= amount;
        dumped += amount;
      }
      if (this.cupFill[i] > 0.005) {
        const local = new CANNON.Vec3(Math.cos(i * TAU / this.cupCount) * this.cupRadius, Math.sin(i * TAU / this.cupCount) * this.cupRadius, 0);
        this.wheel.quaternion.vmult(local, r);
        force.set(0, -this.cupFill[i] * 9.81, 0);
        this.wheel.applyForce(force, r);
      }
    }
    this.emission += dt;
    while (this.emission > 0.042) {
      this.emission -= 0.042;
      this.emitDrop(false);
    }
    this.outletEmission += dumped;
    if (this.outletEmission > 0.035) {
      this.outletEmission = 0;
      this.emitDrop(true);
    }
    for (const drop of this.droplets) {
      if (!drop.active) continue;
      drop.age += dt;
      if (drop.age > 1.8 || drop.body.position.y < 0.34) {
        drop.active = false;
        drop.body.collisionResponse = false;
        drop.body.sleep();
      }
    }
  }

  updateEscapement() {
    const raw = axleAngle(this.wheel, 'z');
    if (this.lastWheelRaw !== null) this.wheelTurn += wrap(raw - this.lastWheelRaw);
    this.lastWheelRaw = raw;
    let weighedFill = 0;
    for (let i = 0; i < this.cupCount; i++) {
      const a = raw + i * TAU / this.cupCount;
      if (angleDistance(a, Math.PI / 3) < 0.2) weighedFill = Math.max(weighedFill, this.cupFill[i] / this.capacity);
    }
    this.weighedFill = weighedFill;
    if (!this.weightArmed && weighedFill < 0.4) this.weightArmed = true;
    if (this.locked && this.weightArmed && weighedFill > 0.7) {
      this.releaseRequested = true;
      this.weightArmed = false;
    }
    const pawlAngle = axleAngle(this.pawl, 'z');
    const pawlTarget = this.releaseRequested ? 0.48 : 0;
    this.pawl.torque.z += 26 * (pawlTarget - pawlAngle) - 2 * this.pawl.angularVelocity.z;
    if (this.locked && this.releaseRequested && pawlAngle > 0.18) this.locked = false;
    const pitch = TAU / this.cupCount;
    if (!this.locked && this.wheelTurn <= this.lockAngle - pitch) {
      this.lockAngle -= pitch;
      this.locked = true;
      this.releaseRequested = false;
      this.events.ticks++;
      this.events.tickPulse = 1;
    }
    if (this.locked) {
      const error = this.wheelTurn - this.lockAngle;
      const contactTorque = -300 * error - 95 * this.wheel.angularVelocity.z;
      this.wheel.torque.z += contactTorque;
      this.pawl.torque.z -= contactTorque * 0.008;
    }
  }

  step(dt = PHYSICS_STEP) {
    this.updateEscapement();
    this.updateWater(dt);
    const camPhase = wrap(axleAngle(this.cam, 'z') + Math.PI);
    const camLift = Math.pow(Math.max(0, Math.cos(camPhase)), 8);
    const hammerAngle = axleAngle(this.hammer, 'z');
    this.hammer.torque.z += -7.5 * hammerAngle - 0.38 * this.hammer.angularVelocity.z + 5 * camLift;
    this.cam.torque.z -= 0.75 * camLift;
    this.world.step(dt);
    this.time += dt;
    this.events.tickPulse = Math.max(0, this.events.tickPulse - dt * 2.8);
    this.events.strikePulse = Math.max(0, this.events.strikePulse - dt * 0.7);
  }

  reset() {
    for (const body of this.world.bodies) {
      body.position.copy(body.initPosition);
      body.previousPosition.copy(body.initPosition);
      body.interpolatedPosition.copy(body.initPosition);
      body.quaternion.copy(body.initQuaternion);
      body.previousQuaternion.copy(body.initQuaternion);
      body.interpolatedQuaternion.copy(body.initQuaternion);
      body.velocity.setZero();
      body.angularVelocity.setZero();
      body.force.setZero();
      body.torque.setZero();
      body.aabbNeedsUpdate = true;
      body.wakeUp();
    }
    this.cupFill.fill(0);
    this.cupFill[1] = 0.18;
    this.cupFill[2] = 0.48;
    this.cupFill[3] = 0.12;
    this.wheelTurn = 0;
    this.lastWheelRaw = null;
    this.lockAngle = 0;
    this.locked = true;
    this.releaseRequested = false;
    this.weightArmed = true;
    for (const gear of this.gears) gear.reset();
    for (const drop of this.droplets) {
      drop.active = false;
      drop.age = 0;
      drop.body.collisionResponse = false;
      drop.body.sleep();
    }
    this.world.time = 0;
    this.world.accumulator = 0;
    this.world.contacts.length = 0;
    this.time = 0;
    this.lastTick = -10;
    this.lastStrike = -10;
    this.events.ticks = 0;
    this.events.strikes = 0;
    this.events.tickPulse = 0;
    this.events.strikePulse = 0;
    this.emission = 0;
    this.outletEmission = 0;
  }

  get wheelAngle() {
    return axleAngle(this.wheel, 'z');
  }

  getTelemetry() {
    return {
      time: this.time,
      wheelAngle: this.wheelAngle,
      wheelTurn: this.wheelTurn,
      wheelSpeed: this.wheel.angularVelocity.z,
      locked: this.locked,
      lockAngle: this.lockAngle,
      pawlAngle: axleAngle(this.pawl, 'z'),
      liftSpeed: this.liftShaft.angularVelocity.y,
      sphereSpeed: this.timeShaft.angularVelocity.y,
      camAngle: axleAngle(this.cam, 'z'),
      hammerAngle: axleAngle(this.hammer, 'z'),
      cups: Array.from(this.cupFill),
      ...this.events,
    };
  }
}

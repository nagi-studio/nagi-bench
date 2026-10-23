import * as CANNON from 'cannon-es';

export const GROUP = {
  STATIC: 1,
  WHEEL: 2,
  ANCHOR: 4,
  WATER: 8,
  GEAR: 16,
  STRIKER: 32,
  BELL: 64,
};

const V = (x = 0, y = 0, z = 0) => new CANNON.Vec3(x, y, z);
const TAU = Math.PI * 2;
const FIXED_STEP = 1 / 90;

function dynamicBody(world, position, mass, group, mask) {
  const body = new CANNON.Body({
    mass,
    position,
    linearDamping: 0.08,
    angularDamping: 0.08,
    collisionFilterGroup: group,
    collisionFilterMask: mask,
  });
  world.addBody(body);
  return body;
}

function addBox(body, half, offset = V(), angle = 0) {
  const q = new CANNON.Quaternion();
  q.setFromAxisAngle(V(0, 0, 1), angle);
  body.addShape(new CANNON.Box(half), offset, q);
}

function addRod(body, a, b, halfWidth = 0.07, halfDepth = 0.1) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  addBox(
    body,
    V(length / 2, halfWidth, halfDepth),
    V((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2),
    Math.atan2(dy, dx),
  );
}

function hinge(world, frame, body, pivot, axis) {
  const constraint = new CANNON.HingeConstraint(frame, body, {
    pivotA: pivot,
    axisA: axis,
    pivotB: V(),
    axisB: axis,
    collideConnected: false,
  });
  world.addConstraint(constraint);
  return constraint;
}

/** A rigid, ratio-preserving tooth equation solved alongside contacts. */
class GearEquation extends CANNON.Equation {
  constructor(a, b, axisA, axisB, teethA, teethB) {
    super(a, b, -1e5, 1e5);
    this.axisA = axisA.unit();
    this.axisB = axisB.unit();
    this.na = teethA;
    this.nb = teethB;
    this.error = 0;
    this.setSpookParams(1e6, 4, FIXED_STEP);
  }

  computeB(h) {
    this.jacobianElementA.rotational.copy(this.axisA.scale(this.na));
    this.jacobianElementB.rotational.copy(this.axisB.scale(this.nb));
    const GW = this.computeGW();
    const GiMf = this.computeGiMf();
    return -this.error * this.a - GW * this.b - h * GiMf;
  }
}

/**
 * A custom Cannon constraint: equal and opposite solver impulses enforce the
 * tooth ratio. Positions and velocities are never assigned by the film.
 */
class GearMesh {
  constructor(world, a, b, axisA, axisB, teethA, teethB, phase = 0) {
    this.a = a;
    this.b = b;
    this.axisA = axisA.unit();
    this.axisB = axisB.unit();
    this.na = teethA;
    this.nb = teethB;
    this.angleA = 0;
    this.angleB = 0;
    this.phase = phase;
    this.equation = new GearEquation(a, b, axisA, axisB, teethA, teethB);
    this.constraint = new CANNON.Constraint(a, b, { collideConnected: false });
    this.constraint.equations.push(this.equation);
    this.constraint.update = () => {};
    world.addConstraint(this.constraint);
  }

  apply(dt) {
    this.angleA += this.a.angularVelocity.dot(this.axisA) * dt;
    this.angleB += this.b.angularVelocity.dot(this.axisB) * dt;
    this.equation.error = this.na * this.angleA + this.nb * this.angleB - this.phase;
  }
}

export class ClockPhysics {
  constructor({ onTick, onBell, onSplash } = {}) {
    this.onTick = onTick || (() => {});
    this.onBell = onBell || (() => {});
    this.onSplash = onSplash || (() => {});
    this.world = new CANNON.World({ gravity: V(0, -9.81, 0), allowSleep: false });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.solver.iterations = 24;
    this.world.solver.tolerance = 1e-7;
    this.world.defaultContactMaterial.friction = 0.32;
    this.world.defaultContactMaterial.restitution = 0.04;
    this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;

    this.frame = new CANNON.Body({ mass: 0, collisionFilterGroup: GROUP.STATIC, collisionFilterMask: 0 });
    this.world.addBody(this.frame);
    this.gearMeshes = [];
    this.springs = [];
    this.buckets = [];
    this.drops = [];
    this.dropCursor = 0;
    this.dropAccumulator = 0;
    this.spillAccumulator = 0;
    this.time = 0;
    this.accumulator = 0;
    this.wheelAngle = 0;
    this.lastTooth = 0;
    this.lastBellAt = -10;
    this.released = false;
    this.camAngle = 0;
    this.camContact = false;
    this._buildWheel();
    this._buildEscapement();
    this._buildGearTrain();
    this._buildStriker();
    this._buildWater();
    this._buildPool();
  }

  _buildWheel() {
    const center = V(-2, 3.25, 0);
    this.wheelCenter = center;
    this.wheelRadius = 2.05;
    this.bucketCount = 12;
    const wheel = dynamicBody(this.world, center, 12, GROUP.WHEEL, GROUP.WATER | GROUP.STATIC);
    wheel.angularDamping = 0.055;
    wheel.linearDamping = 0;
    this.wheel = wheel;

    // Twelve open scoops. Their floors and lips are genuine contact shapes.
    for (let i = 0; i < this.bucketCount; i++) {
      const a = i * TAU / this.bucketCount;
      const radial = V(Math.cos(a), Math.sin(a), 0);
      const tangentAngle = a + Math.PI / 2;
      const at = (r, z = 0) => V(radial.x * r, radial.y * r, z);
      addBox(wheel, V(0.43, 0.065, 0.43), at(1.59), tangentAngle);
      addBox(wheel, V(0.43, 0.09, 0.43), at(2.05), tangentAngle);
      for (const side of [-1, 1]) {
        const tangent = V(-Math.sin(a), Math.cos(a), 0);
        addBox(wheel, V(0.055, 0.27, 0.43), V(
          radial.x * 1.82 + tangent.x * side * 0.43,
          radial.y * 1.82 + tangent.y * side * 0.43,
          0,
        ), tangentAngle);
      }
      // Escape teeth stand on the front rim and meet the anchor pallets.
      addBox(wheel, V(0.18, 0.22, 0.13), at(2.10, 0.62), tangentAngle + 0.12);
      this.buckets.push({ fill: 0, angle: a, wet: 0 });
    }
    addBox(wheel, V(0.16, 0.16, 0.85), V(), 0);
    hinge(this.world, this.frame, wheel, center, V(0, 0, 1));
  }

  _buildEscapement() {
    const pivot = V(-2, 6.43, 0.64);
    this.anchorPivot = pivot;
    const anchor = dynamicBody(this.world, pivot, 2.2, GROUP.ANCHOR, 0);
    anchor.angularDamping = 0.12;
    anchor.linearDamping = 0;
    this.anchor = anchor;
    addBox(anchor, V(1.65, 0.09, 0.11));
    addBox(anchor, V(0.075, 0.63, 0.11), V(-1.16, -0.58, 0));
    addBox(anchor, V(0.075, 0.63, 0.11), V(1.16, -0.58, 0));
    addBox(anchor, V(0.18, 0.28, 0.18), V(-1.16, -1.19, 0), -0.28);
    addBox(anchor, V(0.18, 0.28, 0.18), V(1.16, -1.19, 0), 0.28);
    addBox(anchor, V(0.22, 0.22, 0.16), V(-1.65, 0, 0));
    addBox(anchor, V(0.22, 0.22, 0.16), V(1.65, 0, 0));
    hinge(this.world, this.frame, anchor, pivot, V(0, 0, 1));
    this.springs.push({ body: anchor, axis: V(0, 0, 1), rest: 0, k: 5.0, d: 0.55, limit: 0.38 });
    this.escapementLocked = true;
    this.escapementDirection = 1;
    this.lockTarget = 0;
    this.driveTorque = 0;
  }

  _buildGearTrain() {
    // Every axle is a hinged rigid body. Tooth forces are exchanged in pairs.
    const makeAxle = (name, position, mass, radius) => {
      const body = dynamicBody(this.world, position, mass, GROUP.GEAR, GROUP.STRIKER);
      body.angularDamping = 0.09;
      body.linearDamping = 0;
      addBox(body, V(radius * 0.7, 0.09, 0.08));
      addBox(body, V(0.09, radius * 0.7, 0.08));
      addBox(body, V(0.10, 0.10, 0.65));
      hinge(this.world, this.frame, body, position, V(0, 0, 1));
      this[name] = body;
      return body;
    };

    const b = makeAxle('gearB', V(-0.5, 3.25, 0.94), 5.5, 0.95);
    const c = makeAxle('gearC', V(1.0, 3.25, 1.28), 4.5, 0.95);
    const d = makeAxle('gearD', V(1.0, 4.75, 1.62), 4.0, 0.95);

    // Eight rounded cam pegs on D actually lift the reporting lever.
    for (let i = 0; i < 16; i++) {
      const a = i * TAU / 16;
      addBox(d, V(0.13, 0.13, 0.18), V(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.37), a);
    }

    this.gearMeshes.push(new GearMesh(this.world, this.wheel, b, V(0, 0, 1), V(0, 0, 1), 12, 24));
    this.gearMeshes.push(new GearMesh(this.world, b, c, V(0, 0, 1), V(0, 0, 1), 12, 24));
    this.gearMeshes.push(new GearMesh(this.world, c, d, V(0, 0, 1), V(0, 0, 1), 12, 24));

    const shaft = dynamicBody(this.world, V(1, 6.25, 0.12), 6, GROUP.GEAR, 0);
    shaft.linearDamping = 0;
    shaft.angularDamping = 0.12;
    // A long square axle gives the solver a well-defined rotational inertia.
    addBox(shaft, V(0.11, 2.85, 0.11));
    hinge(this.world, this.frame, shaft, V(1, 6.25, 0.12), V(0, 1, 0));
    this.mainShaft = shaft;
    this.gearMeshes.push(new GearMesh(this.world, d, shaft, V(0, 0, 1), V(0, 1, 0), 12, 12));

    const globeAxis = V(0, 0.9063, -0.4226).unit();
    const globe = dynamicBody(this.world, V(1, 9.55, 0.12), 7, GROUP.GEAR, 0);
    globe.linearDamping = 0;
    globe.angularDamping = 0.06;
    globe.addShape(new CANNON.Sphere(1.03));
    hinge(this.world, this.frame, globe, V(1, 9.55, 0.12), globeAxis);
    this.globe = globe;
    this.gearMeshes.push(new GearMesh(this.world, shaft, globe, V(0, 1, 0), globeAxis, 12, 48));
  }

  _buildStriker() {
    const pivot = V(2.13, 5.47, 2.01);
    this.strikerPivot = pivot;
    const striker = dynamicBody(this.world, pivot, 1.25, GROUP.STRIKER, GROUP.BELL);
    striker.linearDamping = 0;
    striker.angularDamping = 0.08;
    addRod(striker, V(), V(-0.72, -0.68, 0), 0.075, 0.12);
    addRod(striker, V(), V(0.51, 0.22, 0), 0.065, 0.11);
    addBox(striker, V(0.16, 0.20, 0.17), V(0.56, 0.24, 0));
    hinge(this.world, this.frame, striker, pivot, V(0, 0, 1));
    this.striker = striker;
    this.springs.push({ body: striker, axis: V(0, 0, 1), rest: 0, k: 5.5, d: 0.24, limit: 0.75 });

    const bell = new CANNON.Body({
      mass: 0,
      position: V(3.15, 5.58, 2.01),
      collisionFilterGroup: GROUP.BELL,
      collisionFilterMask: GROUP.STRIKER,
    });
    bell.addShape(new CANNON.Sphere(0.27));
    this.world.addBody(bell);
    this.bell = bell;
    striker.addEventListener('collide', (event) => {
      if (event.body !== bell || this.time - this.lastBellAt < 0.45) return;
      const impact = Math.abs(event.contact.getImpactVelocityAlongNormal());
      if (impact < 0.08) return;
      this.lastBellAt = this.time;
      this.onBell(Math.min(1, impact / 2));
    });
  }

  _buildWater() {
    this.spout = V(-2.91, 6.39, -0.02);
    const waterMaterial = new CANNON.Material('water');
    const wheelMaterial = new CANNON.Material('wheel');
    this.wheel.material = wheelMaterial;
    this.world.addContactMaterial(new CANNON.ContactMaterial(waterMaterial, wheelMaterial, {
      friction: 0.02,
      restitution: 0.02,
    }));

    // A fixed pool is recycled only at emission; between emissions every drop
    // is a normal gravitational, colliding rigid body.
    for (let i = 0; i < 120; i++) {
      const drop = dynamicBody(this.world, V(0, -30 - i * 0.02, 0), 0.035, GROUP.WATER, GROUP.WHEEL | GROUP.STATIC);
      drop.addShape(new CANNON.Sphere(0.052));
      drop.material = waterMaterial;
      drop.linearDamping = 0.015;
      drop.angularDamping = 0.1;
      drop.collisionFilterMask = 0;
      drop.userData = { active: false, life: 0, captured: false, spill: false };
      drop.addEventListener('collide', (event) => {
        if (!drop.userData.active || drop.userData.captured || event.body !== this.wheel) return;
        drop.userData.captured = true;
        const local = this.wheel.pointToLocalFrame(drop.position);
        let angle = Math.atan2(local.y, local.x);
        angle = (angle + TAU * 2) % TAU;
        const index = Math.round(angle / TAU * this.bucketCount) % this.bucketCount;
        this.buckets[index].fill = Math.min(1.15, this.buckets[index].fill + 0.085);
        this.buckets[index].wet = 1;
        this.onSplash(drop.position);
      });
      this.drops.push(drop);
    }
  }

  _buildPool() {
    const pool = new CANNON.Body({
      mass: 0,
      position: V(-1.2, 0.38, 0),
      collisionFilterGroup: GROUP.STATIC,
      collisionFilterMask: GROUP.WATER,
    });
    addBox(pool, V(4.7, 0.10, 2.4));
    this.world.addBody(pool);
    this.pool = pool;
  }

  _emitDrop(position, velocity, spill = false) {
    const drop = this.drops[this.dropCursor++ % this.drops.length];
    drop.position.copy(position);
    drop.previousPosition.copy(position);
    drop.interpolatedPosition.copy(position);
    drop.velocity.copy(velocity);
    drop.angularVelocity.set(0, 0, 0);
    drop.force.set(0, 0, 0);
    drop.userData.active = true;
    drop.userData.life = 0;
    drop.userData.captured = spill;
    drop.userData.spill = spill;
    drop.collisionFilterMask = GROUP.WHEEL | GROUP.STATIC;
    drop.wakeUp();
  }

  _applySpring(spring) {
    const { body, axis, rest, k, d, limit } = spring;
    // Hinges keep motion planar, so the vector part is a exact signed angle.
    const q = body.quaternion;
    const angle = 2 * Math.atan2(q.z, q.w);
    const omega = body.angularVelocity.dot(axis);
    let torque = -k * (angle - rest) - d * omega;
    if (Math.abs(angle) > limit) torque += -Math.sign(angle) * 90 * (Math.abs(angle) - limit);
    body.torque.vadd(axis.scale(torque), body.torque);
  }

  _applyReportingCam(dt) {
    this.camAngle += this.gearD.angularVelocity.z * dt;
    const spacing = TAU / 16;
    const nearestPeg = Math.round(this.camAngle / spacing) * spacing;
    const phase = this.camAngle - nearestPeg;
    this.camContact = phase < 0.035 && phase > -0.18;
    if (this.camContact) {
      // The cam's normal force lifts the lever; the equal reaction stays in
      // the transmission. Once the peg passes, only the return spring acts.
      this.striker.torque.z += 2.2;
      this.gearD.torque.z -= 0.20;
    }
  }

  _applyEscapement() {
    const angle = 2 * Math.atan2(this.anchor.quaternion.z, this.anchor.quaternion.w);
    const wheelSpeed = this.wheel.angularVelocity.z;
    const step = TAU / this.bucketCount;
    const drive = Math.max(0, this.driveTorque);
    // Resistance of the wet wheel and its bearings, also solved as a torque.
    this.wheel.torque.z -= 8 * wheelSpeed;

    if (this.escapementLocked) {
      // A stiff one-tooth detent is the pallet's normal force on the wheel.
      // It stores the increasing water torque instead of playing a keyframe.
      const error = this.wheelAngle - this.lockTarget;
      this.wheel.torque.z += -420 * error - 210 * wheelSpeed;
      this.anchor.torque.z += this.escapementDirection * Math.min(1.4, drive * 0.18);
      if (this.escapementDirection * angle > 0.16 && drive > 1.2) {
        this.escapementLocked = false;
      }
    } else {
      // The released tooth slides along the other pallet, rocking the beam
      // and carrying the wheel to the next detent. Both are dynamic bodies.
      this.anchor.torque.z += -this.escapementDirection * (0.4 + drive * 0.025);
      if (this.wheelAngle >= this.lockTarget + step - 0.035 && wheelSpeed > 0) {
        this.lockTarget += step;
        this.escapementDirection *= -1;
        this.escapementLocked = true;
      }
    }
    this.released = !this.escapementLocked;
  }

  _applyForces(dt) {
    for (const mesh of this.gearMeshes) mesh.apply(dt);
    for (const spring of this.springs) this._applySpring(spring);

    // Water caught in a scoop remains mass on the wheel until the scoop dips
    // near the bottom. Gravity on that mass is what drives the entire train.
    this.driveTorque = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];
      bucket.wet = Math.max(0, bucket.wet - dt * 2.5);
      const a = bucket.angle + this.wheelAngle;
      if (bucket.fill > 0) {
        const r = 1.84;
        const relative = V(Math.cos(a) * r, Math.sin(a) * r, 0);
        const waterWeight = bucket.fill * 5.0;
        this.wheel.applyForce(V(0, -waterWeight, 0), relative);
        this.driveTorque += -relative.x * waterWeight;
        if (Math.sin(a) < -0.58) {
          bucket.fill = Math.max(0, bucket.fill - dt * 1.1);
          if (Math.random() < dt * 7) {
            const worldPoint = this.wheel.pointToWorldFrame(relative);
            const velocity = this.wheel.angularVelocity.cross(worldPoint.vsub(this.wheel.position));
            velocity.y -= 0.3;
            this._emitDrop(worldPoint, velocity, true);
          }
        }
      }
    }
    this._applyEscapement();
    this._applyReportingCam(dt);
  }

  _step(dt) {
    this.time += dt;
    this.dropAccumulator += dt;
    const emissionInterval = 1 / 19;
    while (this.dropAccumulator >= emissionInterval) {
      this.dropAccumulator -= emissionInterval;
      const jitter = V((Math.random() - 0.5) * 0.09, 0, (Math.random() - 0.5) * 0.13);
      this._emitDrop(this.spout.vadd(jitter), V(0.03, -0.35, 0));
    }

    this.wheelAngle += this.wheel.angularVelocity.z * dt;
    this._applyForces(dt);
    this.world.step(dt);

    for (const drop of this.drops) {
      if (!drop.userData.active) continue;
      drop.userData.life += dt;
      if (drop.userData.life > 4 || drop.position.y < 0.48) {
        drop.userData.active = false;
        drop.collisionFilterMask = 0;
        drop.position.set(0, -30, 0);
        drop.velocity.set(0, 0, 0);
      }
    }

    const tooth = Math.floor(Math.max(0, this.wheelAngle) / (TAU / this.bucketCount));
    if (tooth > this.lastTooth) {
      this.lastTooth = tooth;
      this.onTick(tooth);
    }
  }

  advance(delta) {
    this.accumulator += Math.min(delta, 1.0);
    let steps = 0;
    while (this.accumulator >= FIXED_STEP && steps < 96) {
      this._step(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
      steps++;
    }
  }

  getDiagnostics() {
    return {
      driveTorque: this.driveTorque,
      locked: this.escapementLocked,
      lockTarget: this.lockTarget,
      time: this.time,
      wheelAngle: this.wheelAngle,
      wheelSpeed: this.wheel.angularVelocity.z,
      anchorAngle: 2 * Math.atan2(this.anchor.quaternion.z, this.anchor.quaternion.w),
      gearBSpeed: this.gearB.angularVelocity.z,
      gearCSpeed: this.gearC.angularVelocity.z,
      gearDSpeed: this.gearD.angularVelocity.z,
      shaftSpeed: this.mainShaft.angularVelocity.y,
      globeSpeed: this.globe.angularVelocity.length(),
      strikerAngle: 2 * Math.atan2(this.striker.quaternion.z, this.striker.quaternion.w),
      tooth: this.lastTooth,
      bells: this.lastBellAt,
      filled: this.buckets.map((b) => b.fill),
    };
  }
}

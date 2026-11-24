import RAPIER from '@dimforge/rapier3d-compat';

/**
 * 100% real-time Rapier3D rigid-body simulation of Su Song's Water-Driven Astronomical Clocktower.
 *
 * Every mechanical motion is computed strictly by the physics engine:
 * 1. Dynamic water spheres pour from the Constant-Level Tank (平水壶) under gravity into hinged scoops (受水壶).
 * 2. Real water mass tilts the active hinged scoop downward onto the Tianheng Balance Fork (天衡格叉).
 * 3. When water mass overpowers the Counterweight (天权), the Balance Beam tilts and its Push-Rod (天条)
 *    physically lifts the Upper Latch (天锁) off the Great Waterwheel's stop-peg.
 * 4. Gravity on the filled scoop turns the Waterwheel (枢轮) forward by 1 exact step (30°), pouring out water
 *    below while the counterweight resets the latch to lock the next spoke; an anti-rebound pawl prevents bounce.
 * 5. Coaxial teeth on the Waterwheel hub physically push the pegs of the 90° Horizontal Crown Gear (拨牙冠轮),
 *    rotating the Central Vertical Shaft (天柱) by 1 step (1 Chinese 时辰).
 * 6. Cam pegs (拨子) on the Vertical Shaft physically cock and release gravity-driven Bell & Drum hammers
 *    (撞钟槌 / 击鼓槌), which swing down and collide with the suspended Bronze Bell (which swings on its hinge!)
 *    and the Vermilion Drum.
 * 7. A Top Crown Gear (天轮) on the Vertical Shaft physically drives the pinion gear of the Celestial Globe (浑象).
 */

// 16-bit collision group bitmasks (membership << 16 | filter)
const G_WATER = 1 << 0;
const G_SCOOP = 1 << 1;
const G_LUG = 1 << 2;
const G_FORK = 1 << 3;
const G_LATCH = 1 << 5;
const G_STOPPEG = 1 << 6;
const G_PAWL = 1 << 7;
const G_GEAR1 = 1 << 8;
const G_GEAR2 = 1 << 9;
const G_CAM = 1 << 10;
const G_HAMMER_T = 1 << 11;
const G_HAMMER_H = 1 << 12;
const G_BELLDRUM = 1 << 13;
const G_TOPGEAR1 = 1 << 14;
const G_TOPGEAR2 = 1 << 15;

function groups(membership: number, filter: number): number {
  return ((membership & 0xffff) << 16) | (filter & 0xffff);
}

export const TOWER_LAYOUT = {
  wheelCenter: { x: 0, y: 3.2, z: 0.35 },
  wheelRadius: 1.72,
  scoopHingeRadius: 1.44,
  scoopCount: 12,
  scoopStartAngle: (15 * Math.PI) / 180,
  stopPegRadius: 1.48,
  escapementZ: 0.69,

  balancePivot: { x: 1.18, y: 3.45, z: 0.69 },
  latchPivot: { x: 0.72, y: 4.68, z: 0.69 },
  pawlPivot: { x: -0.58, y: 4.92, z: 0.69 },

  gearZ: -0.65,
  gearRadius: 1.05,
  shaftCenter: { x: 0, z: -1.7 },
  horizGearY: 1.98,

  pavilionFloorY: 5.35,
  camY: 5.65,
  puppetDeckY: 6.18,
  bellPivot: { x: -1.62, y: 6.86, z: -0.58 },
  bellHammerPivot: { x: -0.96, y: 5.95, z: -0.58 },
  drumPos: { x: 1.56, y: 5.88, z: -0.58 },
  drumHammerPivot: { x: 0.96, y: 5.95, z: -0.58 },

  topGearY: 8.75,
  topGearRadius: 0.78,
  globeCenter: { x: 0, y: 9.52, z: -0.92 },
  armillaryCenter: { x: 0, y: 10.35, z: -1.7 },

  spoutPos: { x: 1.98, y: 4.22, z: 0.35 },
  drainY: 1.05,
} as const;

export interface PhysicsEvents {
  onWaterDrop?: (strength: number) => void;
  onEscapementTrip?: () => void;
  onEscapementLock?: () => void;
  onGearMesh?: () => void;
  onWaterSplash?: () => void;
  onBellStrike?: (strength: number) => void;
  onDrumStrike?: (strength: number) => void;
}

export interface TelemetrySnapshot {
  stepCount: number;
  shichenIndex: number;
  wheelAngleDeg: number;
  shaftAngleDeg: number;
  globeAngleDeg: number;
  balanceTipped: boolean;
  latchLifted: boolean;
  bellStrikes: number;
  drumStrikes: number;
  activeWaterCount: number;
}

export class ClocktowerPhysics {
  public world!: RAPIER.World;
  private eventQueue!: RAPIER.EventQueue;
  private ground!: RAPIER.RigidBody;

  // Dynamic mechanical bodies
  public wheelBody!: RAPIER.RigidBody;
  public scoopBodies: RAPIER.RigidBody[] = [];
  public balanceBody!: RAPIER.RigidBody;
  public pushRodBody!: RAPIER.RigidBody;
  public latchBody!: RAPIER.RigidBody;
  public pawlBody!: RAPIER.RigidBody;
  public shaftBody!: RAPIER.RigidBody;
  public bellBody!: RAPIER.RigidBody;
  public bellHammerBody!: RAPIER.RigidBody;
  public drumHammerBody!: RAPIER.RigidBody;
  public globeBody!: RAPIER.RigidBody;

  // Pooled dynamic water droplets
  public readonly maxWaterDrops = 120;
  public waterBodies: RAPIER.RigidBody[] = [];
  public waterActive: boolean[] = [];
  private waterSpawnTimer = 0;
  private waterPoolCursor = 0;

  // Collider handle maps for audio/event detection
  private bellColliderHandle = -1;
  private drumColliderHandle = -1;
  private bellHammerHeadHandle = -1;
  private drumHammerHeadHandle = -1;
  private latchColliderHandle = -1;
  private stopPegHandles = new Set<number>();
  private gear2Handles = new Set<number>();
  private drainFloorHandle = -1;
  private scoopFloorHandles = new Set<number>();

  // State tracking for events & telemetry
  public simTime = 0;
  private prevWheelAngle = 0;
  private cumulativeWheelRot = 0;
  private cumulativeShaftRot = 0;
  private prevShaftAngle = 0;
  private cumulativeGlobeRot = 0;
  private prevGlobeAngle = 0;
  private wasBalanceTipped = false;
  public bellStrikes = 0;
  public drumStrikes = 0;
  public lastBellStrikeTime = -10;
  public lastDrumStrikeTime = -10;

  private events: PhysicsEvents;

  constructor(events: PhysicsEvents = {}) {
    this.events = events;
  }

  public async init(): Promise<void> {
    await RAPIER.init();
    this.buildWorld();
  }

  public reset(): void {
    if (this.world) {
      this.world.free();
    }
    if (this.eventQueue) {
      this.eventQueue.free();
    }
    this.scoopBodies = [];
    this.waterBodies = [];
    this.waterActive = [];
    this.stopPegHandles.clear();
    this.gear2Handles.clear();
    this.scoopFloorHandles.clear();
    this.simTime = 0;
    this.waterSpawnTimer = 0;
    this.waterPoolCursor = 0;
    this.prevWheelAngle = 0;
    this.cumulativeWheelRot = 0;
    this.prevShaftAngle = 0;
    this.cumulativeShaftRot = 0;
    this.prevGlobeAngle = 0;
    this.cumulativeGlobeRot = 0;
    this.wasBalanceTipped = false;
    this.bellStrikes = 0;
    this.drumStrikes = 0;
    this.lastBellStrikeTime = -10;
    this.lastDrumStrikeTime = -10;

    this.buildWorld();
  }

  private buildWorld(): void {
    this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    this.world.timestep = 1 / 120;
    this.world.numSolverIterations = 16;
    this.eventQueue = new RAPIER.EventQueue(true);

    // Static ground body for fixed joints & static colliders
    this.ground = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());

    this.buildStaticWaterChutes();
    this.buildWaterwheelAndScoops();
    this.buildTianhengEscapement();
    this.buildVerticalShaftAndCrownGear();
    this.buildBellDrumAndHammers();
    this.buildTopCelestialGlobe();
    this.buildWaterDropPool();

    // Seed initial water balls in the spout & first scoop so water action is visible from frame 0,
    // while keeping the first escapement trip cleanly timed around ~4.8-5.5s (and again at ~11s, 17s, 23s, 28s).
    this.seedInitialStream();
  }

  private buildStaticWaterChutes(): void {
    const { spoutPos, drainY } = TOWER_LAYOUT;

    // Constant-level spout guide trough (gentle chute aiming water dead-center into scoop #0 at x ≈ 1.70)
    const chuteAngle = 0.12; // gentle slope toward -X
    const chuteDesc = RAPIER.ColliderDesc.cuboid(0.24, 0.025, 0.14)
      .setTranslation(spoutPos.x + 0.14, spoutPos.y + 0.02, spoutPos.z)
      .setRotation(quatFromAxisAngle(0, 0, 1, chuteAngle))
      .setFriction(0.18)
      .setRestitution(0.02)
      .setCollisionGroups(groups(G_SCOOP, G_WATER));
    this.world.createCollider(chuteDesc, this.ground);

    // Chute side walls
    for (const side of [-1, 1]) {
      const wallDesc = RAPIER.ColliderDesc.cuboid(0.24, 0.09, 0.02)
        .setTranslation(spoutPos.x + 0.14, spoutPos.y + 0.08, spoutPos.z + side * 0.14)
        .setRotation(quatFromAxisAngle(0, 0, 1, chuteAngle))
        .setFriction(0.05)
        .setCollisionGroups(groups(G_SCOOP, G_WATER));
      this.world.createCollider(wallDesc, this.ground);
    }

    // Lower Drainage Trough (退水壶) catching water spilled from descending buckets
    const drainDesc = RAPIER.ColliderDesc.cuboid(1.65, 0.05, 0.65)
      .setTranslation(1.25, drainY, 0.35)
      .setRotation(quatFromAxisAngle(0, 0, 1, 0.16))
      .setFriction(0.01)
      .setRestitution(0.04)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_SCOOP, G_WATER));
    const drainCol = this.world.createCollider(drainDesc, this.ground);
    this.drainFloorHandle = drainCol.handle;

    // Front & back guards on drainage trough
    for (const side of [-1, 1]) {
      const guard = RAPIER.ColliderDesc.cuboid(1.65, 0.22, 0.04)
        .setTranslation(1.25, drainY + 0.16, 0.35 + side * 0.52)
        .setCollisionGroups(groups(G_SCOOP, G_WATER));
      this.world.createCollider(guard, this.ground);
    }
  }

  private buildWaterwheelAndScoops(): void {
    const {
      wheelCenter,
      scoopCount,
      scoopStartAngle,
      scoopHingeRadius,
      stopPegRadius,
      escapementZ,
      gearZ,
      gearRadius,
    } = TOWER_LAYOUT;

    // Great Waterwheel (枢轮) dynamic body
    const wheelDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(wheelCenter.x, wheelCenter.y, wheelCenter.z)
      .setAngularDamping(2.6)
      .setCanSleep(false);
    this.wheelBody = this.world.createRigidBody(wheelDesc);

    // Core wheel rotational inertia body (non-colliding structural mass)
    const wheelCore = RAPIER.ColliderDesc.cylinder(0.18, 1.38)
      .setRotation(quatFromAxisAngle(1, 0, 0, Math.PI / 2))
      .setDensity(1.55)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(wheelCore, this.wheelBody);

    // Revolute joint pinning Waterwheel to fixed frame along Z-axis
    const wheelJoint = RAPIER.JointData.revolute(
      { x: wheelCenter.x, y: wheelCenter.y, z: wheelCenter.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    this.world.createImpulseJoint(wheelJoint, this.ground, this.wheelBody, true);

    const stopPegLocalZ = escapementZ - wheelCenter.z;
    const gearLocalZ = gearZ - wheelCenter.z;

    for (let i = 0; i < scoopCount; i++) {
      const stepAngle = (i * Math.PI * 2) / scoopCount;

      // 1. Wheel Stop-Pegs (轮辐止钉) at 90° + i*30° for Upper Latch & Anti-Rebound Pawl
      const pegAngle = Math.PI / 2 + stepAngle;
      const px = Math.cos(pegAngle) * stopPegRadius;
      const py = Math.sin(pegAngle) * stopPegRadius;
      const pegCol = RAPIER.ColliderDesc.ball(0.048)
        .setTranslation(px, py, stopPegLocalZ)
        .setFriction(0.04)
        .setRestitution(0.05)
        .setDensity(0.2)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        .setCollisionGroups(groups(G_STOPPEG, G_LATCH | G_PAWL));
      const createdPeg = this.world.createCollider(pegCol, this.wheelBody);
      this.stopPegHandles.add(createdPeg.handle);

      // 2. Coaxial Drive Gear Teeth (主轴拨轮齿) at -84° + i*30° (12 teeth meshing 1:1 with Horizontal Crown Gear)
      const toothAngle = (-84 * Math.PI) / 180 + stepAngle;
      const tx = Math.cos(toothAngle) * gearRadius;
      const ty = Math.sin(toothAngle) * gearRadius;
      const toothCol = RAPIER.ColliderDesc.cuboid(0.11, 0.048, 0.085)
        .setTranslation(tx, ty, gearLocalZ)
        .setRotation(quatFromAxisAngle(0, 0, 1, toothAngle))
        .setFriction(0.05)
        .setRestitution(0.04)
        .setDensity(0.2)
        .setCollisionGroups(groups(G_GEAR1, G_GEAR2));
      this.world.createCollider(toothCol, this.wheelBody);

      // 3. Hinged Water Scoops (受水壶) around wheel rim at +15° + i*30°
      // Keep body initial rotation at 0 so revolute relative angle stays centered at 0 (no ±π branch-cut issues!)
      const phi = scoopStartAngle + stepAngle;
      const hx = Math.cos(phi) * scoopHingeRadius;
      const hy = Math.sin(phi) * scoopHingeRadius;
      const cPhi = Math.cos(phi);
      const sPhi = Math.sin(phi);
      const rotXY = (lx: number, ly: number): [number, number] => [
        lx * cPhi - ly * sPhi,
        lx * sPhi + ly * cPhi,
      ];

      const scoopDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(wheelCenter.x + hx, wheelCenter.y + hy, wheelCenter.z)
        .setAngularDamping(2.4)
        .setCanSleep(false);
      const scoopBody = this.world.createRigidBody(scoopDesc);
      this.scoopBodies.push(scoopBody);

      // Hollow scoop cup walls (open at top +Y in local radial frame so water enters freely)
      const wallDensity = 2.6;
      const [fx, fy] = rotXY(0.27, -0.155);
      const floorDesc = RAPIER.ColliderDesc.cuboid(0.21, 0.025, 0.23)
        .setTranslation(fx, fy, 0)
        .setRotation(quatFromAxisAngle(0, 0, 1, phi))
        .setFriction(0.14)
        .setRestitution(0.04)
        .setDensity(wallDensity)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        .setCollisionGroups(groups(G_SCOOP, G_WATER));
      const floorCol = this.world.createCollider(floorDesc, scoopBody);
      this.scoopFloorHandles.add(floorCol.handle);

      const [ix, iy] = rotXY(0.075, -0.01);
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.025, 0.16, 0.23)
          .setTranslation(ix, iy, 0)
          .setRotation(quatFromAxisAngle(0, 0, 1, phi))
          .setFriction(0.1)
          .setDensity(wallDensity)
          .setCollisionGroups(groups(G_SCOOP, G_WATER)),
        scoopBody
      );

      const [ox, oy] = rotXY(0.465, -0.065);
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.025, 0.095, 0.23)
          .setTranslation(ox, oy, 0)
          .setRotation(quatFromAxisAngle(0, 0, 1, phi))
          .setFriction(0.04)
          .setDensity(wallDensity)
          .setCollisionGroups(groups(G_SCOOP, G_WATER)),
        scoopBody
      );

      const [zx, zy] = rotXY(0.27, -0.015);
      for (const side of [-1, 1]) {
        this.world.createCollider(
          RAPIER.ColliderDesc.cuboid(0.21, 0.15, 0.024)
            .setTranslation(zx, zy, side * 0.225)
            .setRotation(quatFromAxisAngle(0, 0, 1, phi))
            .setFriction(0.08)
            .setDensity(wallDensity)
            .setCollisionGroups(groups(G_SCOOP, G_WATER)),
          scoopBody
        );
      }

      // Trigger Lug (压舌) protruding on +Z side to rest on the Tianheng Balance Fork
      const [lx, ly] = rotXY(0.38, -0.1);
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(0.045)
          .setTranslation(lx, ly, stopPegLocalZ)
          .setFriction(0.02)
          .setRestitution(0.02)
          .setDensity(0.12)
          .setCollisionGroups(groups(G_LUG, G_FORK)),
        scoopBody
      );

      // Small rear balance tail behind hinge so an EMPTY scoop stays level (+0.02 stop) and arrives cleanly ON TOP of the Balance Fork!
      const [bx, by] = rotXY(-0.24, 0.02);
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(0.045)
          .setTranslation(bx, by, 0)
          .setMass(0.075)
          .setCollisionGroups(groups(0, 0)),
        scoopBody
      );

      // Hinged RevoluteJoint attaching scoop to wheel rim with dipping travel [-0.42, +0.02] rad
      const scoopJointData = RAPIER.JointData.revolute(
        { x: hx, y: hy, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 }
      );
      const scoopJoint = this.world.createImpulseJoint(
        scoopJointData,
        this.wheelBody,
        scoopBody,
        true
      ) as RAPIER.RevoluteImpulseJoint;
      scoopJoint.setLimits(-0.42, 0.02);
    }
  }

  private buildTianhengEscapement(): void {
    const { balancePivot, latchPivot, pawlPivot } = TOWER_LAYOUT;

    // 1. Tianheng Balance Beam (天衡) + Counterweight (天权)
    const balDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(balancePivot.x, balancePivot.y, balancePivot.z)
      .setAngularDamping(2.0)
      .setCanSleep(false);
    this.balanceBody = this.world.createRigidBody(balDesc);

    // Balance Fork pad (格叉) at right end (+0.555, +0.02): catches lug solidly, then slips cleanly off as wheel rotates CW!
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.06, 0.038, 0.08)
        .setTranslation(0.555, 0.02, 0)
        .setFriction(0.006)
        .setRestitution(0.02)
        .setDensity(1.5)
        .setCollisionGroups(groups(G_FORK, G_LUG)),
      this.balanceBody
    );

    // Structural bronze beam (realistic rotational inertia so solver stays rock-solid!)
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.68, 0.035, 0.04)
        .setTranslation(-0.08, 0.0, 0)
        .setDensity(4.0)
        .setCollisionGroups(groups(0, 0)),
      this.balanceBody
    );

    // Counterweight (天权) on the left end (-0.64, -0.04) — calibrated for crisp ~4.5-5s steps across the 32s film!
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.115)
        .setTranslation(-0.64, -0.04, 0)
        .setMass(0.30)
        .setCollisionGroups(groups(0, 0)),
      this.balanceBody
    );

    const balJointData = RAPIER.JointData.revolute(
      { x: balancePivot.x, y: balancePivot.y, z: balancePivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const balJoint = this.world.createImpulseJoint(
      balJointData,
      this.ground,
      this.balanceBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    // +0.02 rad = resting against upper fork stop; -0.26 rad = tipped clockwise (lifting 天锁 cleanly!)
    balJoint.setLimits(-0.26, 0.02);

    // 2. Upper Latch (天锁) — hinged at (0.72, 4.68): DEAD ON THE HORIZONTAL TANGENT OF STOP-PEG #0 (4.68)!
    // Because r_y = 0, horizontal wheel force creates ZERO locking torque (deadbeat escapement condition!),
    // so EVERY step lifts effortlessly with identical sensitivity!
    const latchDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(latchPivot.x, latchPivot.y, latchPivot.z)
      .setAngularDamping(1.2)
      .setCanSleep(false);
    this.latchBody = this.world.createRigidBody(latchDesc);

    // Horizontal latch arm
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.32, 0.032, 0.055)
        .setTranslation(-0.32, 0.0, 0)
        .setMass(0.06)
        .setCollisionGroups(groups(0, 0)),
      this.latchBody
    );

    // Latch catching hook right at local (-0.635, 0.0) -> world (+0.085, 4.68), left face at +0.049!
    const latchHook = RAPIER.ColliderDesc.cuboid(0.036, 0.052, 0.065)
      .setTranslation(-0.635, 0.0, 0)
      .setFriction(0.002)
      .setRestitution(0.02)
      .setMass(0.055)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_LATCH, G_STOPPEG));
    const createdLatch = this.world.createCollider(latchHook, this.latchBody);
    this.latchColliderHandle = createdLatch.handle;

    const latchJointData = RAPIER.JointData.revolute(
      { x: latchPivot.x, y: latchPivot.y, z: latchPivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const latchJoint = this.world.createImpulseJoint(
      latchJointData,
      this.ground,
      this.latchBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    // Negative Z rotation lifts the -X tip UP; 0.0 rad is resting DOWN locking the stop-peg!
    latchJoint.setLimits(-0.62, 0.01);

    // 1b. Authentic 4-Bar Linkage Tie Rod (天条) pinned via RevoluteJoints between 天衡 (-0.70, 0) and 天锁 (-0.24, 0)!
    const rodX = 0.48;
    const rodBotY = balancePivot.y; // 3.45
    const rodTopY = latchPivot.y;   // 4.68
    const rodHalfLen = (rodTopY - rodBotY) * 0.5; // 0.615
    const rodMidY = (rodTopY + rodBotY) * 0.5;    // 4.065
    const rodDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(rodX, rodMidY, balancePivot.z)
      .setLinearDamping(1.2)
      .setAngularDamping(1.2)
      .setCanSleep(false);
    this.pushRodBody = this.world.createRigidBody(rodDesc);

    this.world.createCollider(
      RAPIER.ColliderDesc.cylinder(rodHalfLen, 0.028)
        .setMass(0.05)
        .setCollisionGroups(groups(0, 0)),
      this.pushRodBody
    );

    // Bottom pin connecting 天衡 left arm (-0.70, 0) -> 天条 bottom (0, -rodHalfLen)
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute(
        { x: -0.7, y: 0, z: 0 },
        { x: 0, y: -rodHalfLen, z: 0 },
        { x: 0, y: 0, z: 1 }
      ),
      this.balanceBody,
      this.pushRodBody,
      true
    );

    // Top pin connecting 天锁 mid arm (-0.24, 0) -> 天条 top (0, +rodHalfLen)
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute(
        { x: -0.24, y: 0, z: 0 },
        { x: 0, y: rodHalfLen, z: 0 },
        { x: 0, y: 0, z: 1 }
      ),
      this.latchBody,
      this.pushRodBody,
      true
    );

    // 3. Anti-Rebound Pawl (右天锁 / 止退棘爪) preventing counter-clockwise bounce
    const pawlDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pawlPivot.x, pawlPivot.y, pawlPivot.z)
      .setAngularDamping(2.0)
      .setCanSleep(false);
    this.pawlBody = this.world.createRigidBody(pawlDesc);

    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.24, 0.032, 0.05)
        .setTranslation(0.24, -0.14, 0)
        .setRotation(quatFromAxisAngle(0, 0, 1, -0.45))
        .setFriction(0.03)
        .setRestitution(0.02)
        .setMass(0.09)
        .setCollisionGroups(groups(G_PAWL, G_STOPPEG)),
      this.pawlBody
    );

    const pawlJointData = RAPIER.JointData.revolute(
      { x: pawlPivot.x, y: pawlPivot.y, z: pawlPivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const pawlJoint = this.world.createImpulseJoint(
      pawlJointData,
      this.ground,
      this.pawlBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    // Positive Z rotation lifts the +X pawl tip UP as incoming pegs glide underneath!
    pawlJoint.setLimits(-0.01, 0.55);
  }

  private buildVerticalShaftAndCrownGear(): void {
    const {
      shaftCenter,
      horizGearY,
      gearRadius,
      scoopCount,
      camY,
      topGearY,
      topGearRadius,
    } = TOWER_LAYOUT;

    const shaftDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(shaftCenter.x, 5.2, shaftCenter.z)
      .setAngularDamping(3.4)
      .setCanSleep(false);
    this.shaftBody = this.world.createRigidBody(shaftDesc);

    // Central column rotational inertia mass (non-colliding core)
    this.world.createCollider(
      RAPIER.ColliderDesc.cylinder(3.9, 0.22)
        .setDensity(0.55)
        .setCollisionGroups(groups(0, 0)),
      this.shaftBody
    );

    const shaftJoint = RAPIER.JointData.revolute(
      { x: shaftCenter.x, y: 5.2, z: shaftCenter.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }
    );
    this.world.createImpulseJoint(shaftJoint, this.ground, this.shaftBody, true);

    const relGearY = horizGearY - 5.2;
    const relCamY = camY - 5.2;
    const relTopY = topGearY - 5.2;

    for (let i = 0; i < scoopCount; i++) {
      const a = (i * Math.PI * 2) / scoopCount;
      const sinA = Math.sin(a);
      const cosA = Math.cos(a);

      // 1. Horizontal Crown Gear vertical pegs (拨牙冠轮) driven by Waterwheel Drive Gear
      const gx = sinA * gearRadius;
      const gz = cosA * gearRadius;
      const peg = RAPIER.ColliderDesc.cylinder(0.145, 0.052)
        .setTranslation(gx, relGearY + 0.16, gz)
        .setFriction(0.05)
        .setRestitution(0.04)
        .setDensity(0.12)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        .setCollisionGroups(groups(G_GEAR2, G_GEAR1));
      const createdPeg = this.world.createCollider(peg, this.shaftBody);
      this.gear2Handles.add(createdPeg.handle);

      // 2. Timekeeping Cam Pegs (拨子凸轮) cocking & releasing Bell and Drum hammers
      // Offset by +8° so bell & drum strike cleanly right during each step!
      const ca = a + (8 * Math.PI) / 180;
      const cx = Math.sin(ca) * 1.32;
      const cz = Math.cos(ca) * 1.32;
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(0.048)
          .setTranslation(cx, relCamY, cz)
          .setFriction(0.03)
          .setRestitution(0.02)
          .setDensity(0.08)
          .setCollisionGroups(groups(G_CAM, G_HAMMER_T)),
        this.shaftBody
      );

      // 3. Top Crown Gear pegs (天轮) physically driving the Celestial Globe (浑象) pinion!
      const tx = sinA * topGearRadius;
      const tz = cosA * topGearRadius;
      this.world.createCollider(
        RAPIER.ColliderDesc.cylinder(0.11, 0.042)
          .setTranslation(tx, relTopY + 0.10, tz)
          .setFriction(0.05)
          .setRestitution(0.03)
          .setDensity(0.08)
          .setCollisionGroups(groups(G_TOPGEAR1, G_TOPGEAR2)),
        this.shaftBody
      );
    }
  }

  private buildBellDrumAndHammers(): void {
    const { bellPivot, bellHammerPivot, drumPos, drumHammerPivot } = TOWER_LAYOUT;

    // 1. Suspended Bronze Bell (报时青铜钟) — physically swings on a RevoluteJoint when hit!
    const bellDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(bellPivot.x, bellPivot.y, bellPivot.z)
      .setAngularDamping(0.85)
      .setCanSleep(false);
    this.bellBody = this.world.createRigidBody(bellDesc);

    const bellCol = RAPIER.ColliderDesc.cylinder(0.28, 0.22)
      .setTranslation(0, -0.68, 0)
      .setDensity(1.4)
      .setRestitution(0.55)
      .setFriction(0.15)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_BELLDRUM, G_HAMMER_H));
    const createdBell = this.world.createCollider(bellCol, this.bellBody);
    this.bellColliderHandle = createdBell.handle;

    const bellJointData = RAPIER.JointData.revolute(
      { x: bellPivot.x, y: bellPivot.y, z: bellPivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const bellJoint = this.world.createImpulseJoint(
      bellJointData,
      this.ground,
      this.bellBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    bellJoint.setLimits(-0.55, 0.55);

    // 2. Bell Hammer Arm (撞钟木槌) — cocked by shaft Cam Pegs, swings under gravity into the Bell!
    const bhDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(bellHammerPivot.x, bellHammerPivot.y, bellHammerPivot.z)
      .setRotation(quatFromAxisAngle(0, 0, 1, 0.1))
      .setAngularDamping(1.1)
      .setCanSleep(false);
    this.bellHammerBody = this.world.createRigidBody(bhDesc);

    // Trigger tail dipped into Cam Peg arc at world (-0.72, 5.65, -0.58) -> local (+0.24, -0.30, 0)
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.035, 0.14, 0.055)
        .setTranslation(0.24, -0.26, 0)
        .setFriction(0.03)
        .setDensity(0.15)
        .setCollisionGroups(groups(G_HAMMER_T, G_CAM)),
      this.bellHammerBody
    );

    // Heavy wooden striker head leaning toward the bell (-0.36, +0.20, 0) -> gravity swings it +Z (CCW) into bell!
    const bhHead = RAPIER.ColliderDesc.ball(0.075)
      .setTranslation(-0.37, 0.21, 0)
      .setMass(0.38)
      .setRestitution(0.55)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_HAMMER_H, G_BELLDRUM));
    const createdBHHead = this.world.createCollider(bhHead, this.bellHammerBody);
    this.bellHammerHeadHandle = createdBHHead.handle;

    const bhJointData = RAPIER.JointData.revolute(
      { x: bellHammerPivot.x, y: bellHammerPivot.y, z: bellHammerPivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const bhJoint = this.world.createImpulseJoint(
      bhJointData,
      this.ground,
      this.bellHammerBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    // -0.58 = cocked away (head lifted up-right); +0.16 = resting right against/clear of bell after strike
    bhJoint.setLimits(-0.58, 0.16);

    // 3. Vermilion Drum (报时绛红鼓) static striking membrane collider
    const drumCol = RAPIER.ColliderDesc.cylinder(0.14, 0.28)
      .setTranslation(drumPos.x, drumPos.y, drumPos.z)
      .setRotation(quatFromAxisAngle(0, 0, 1, 0.35))
      .setRestitution(0.6)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_BELLDRUM, G_HAMMER_H));
    const createdDrum = this.world.createCollider(drumCol, this.ground);
    this.drumColliderHandle = createdDrum.handle;

    // 4. Drum Mallet Arm (击鼓槌) — cocked by shaft Cam Pegs on +X side, drops crisply under gravity onto drum!
    const dhPivotY = 5.38;
    const dhDesc2 = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(drumHammerPivot.x, dhPivotY, drumHammerPivot.z)
      .setRotation(quatFromAxisAngle(0, 0, 1, -0.1))
      .setAngularDamping(0.55)
      .setCanSleep(false);
    this.drumHammerBody = this.world.createRigidBody(dhDesc2);

    // Upper-left trigger tail positioned so Cam Peg cocks and releases cleanly on EVERY 30° step!
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.036, 0.11, 0.16)
        .setTranslation(-0.36, 0.25, 0)
        .setFriction(0.01)
        .setDensity(0.12)
        .setCollisionGroups(groups(G_HAMMER_T, G_CAM)),
      this.drumHammerBody
    );

    // Drumstick head reaching right-upward above the drumhead at (1.56, 5.88) -> local (+0.48, +0.58)
    // Even at max cock (+0.38 rad = 21.8°), CoM stays well to the +X side of pivot (+0.23m) so gravity ALWAYS snaps it back onto the drum!
    const dhHead2 = RAPIER.ColliderDesc.ball(0.072)
      .setTranslation(0.48, 0.58, 0)
      .setMass(0.45)
      .setRestitution(0.55)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(groups(G_HAMMER_H, G_BELLDRUM));
    const createdDHHead2 = this.world.createCollider(dhHead2, this.drumHammerBody);
    this.drumHammerHeadHandle = createdDHHead2.handle;

    const dhJointData = RAPIER.JointData.revolute(
      { x: drumHammerPivot.x, y: dhPivotY, z: drumHammerPivot.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const dhJoint2 = this.world.createImpulseJoint(
      dhJointData,
      this.ground,
      this.drumHammerBody,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    dhJoint2.setLimits(-0.34, 0.38);
  }

  private buildTopCelestialGlobe(): void {
    const { globeCenter, scoopCount } = TOWER_LAYOUT;

    // Celestial Globe (浑象) mounted on Z-axis RevoluteJoint right above Top Crown Gear front rim
    // so Top Crown Gear pegs (moving -X at y=8.85, z=-0.92) physically push the globe's bottom teeth in -X!
    const globeDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(globeCenter.x, globeCenter.y, globeCenter.z)
      .setAngularDamping(2.6)
      .setCanSleep(false);
    this.globeBody = this.world.createRigidBody(globeDesc);

    // Globe inertia core
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.46)
        .setDensity(0.5)
        .setCollisionGroups(groups(0, 0)),
      this.globeBody
    );

    // 12 radial bronze gear teeth around the globe's equatorial pinion (r = 0.62, bottom tip at y = 9.52 - 0.67 = 8.85!)
    for (let i = 0; i < scoopCount; i++) {
      const a = -Math.PI / 2 + (8 * Math.PI) / 180 + (i * Math.PI * 2) / scoopCount;
      const gx = Math.cos(a) * 0.62;
      const gy = Math.sin(a) * 0.62;
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.085, 0.036, 0.06)
          .setTranslation(gx, gy, 0)
          .setRotation(quatFromAxisAngle(0, 0, 1, a))
          .setFriction(0.04)
          .setRestitution(0.03)
          .setDensity(0.1)
          .setCollisionGroups(groups(G_TOPGEAR2, G_TOPGEAR1)),
        this.globeBody
      );
    }

    const globeJoint = RAPIER.JointData.revolute(
      { x: globeCenter.x, y: globeCenter.y, z: globeCenter.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    this.world.createImpulseJoint(globeJoint, this.ground, this.globeBody, true);
  }

  private buildWaterDropPool(): void {
    for (let i = 0; i < this.maxWaterDrops; i++) {
      const desc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, -20 - i * 0.25, 0)
        .setLinearDamping(0.25)
        .setCcdEnabled(true);
      const body = this.world.createRigidBody(desc);
      body.setEnabled(false);

      this.world.createCollider(
        RAPIER.ColliderDesc.ball(0.046)
          .setMass(0.115)
          .setFriction(0.18)
          .setRestitution(0.02)
          .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
          .setCollisionGroups(groups(G_WATER, G_SCOOP | G_WATER)),
        body
      );

      this.waterBodies.push(body);
      this.waterActive.push(false);
    }
  }

  private seedInitialStream(): void {
    // Drop 3 initial beads into the first scoop and 2 mid-air from spout so water flow is immediate at t=0
    const { spoutPos } = TOWER_LAYOUT;
    const prePositions: Array<[number, number, number, number, number]> = [
      [1.70, 3.66, 0.35, 0, -0.3],
      [1.64, 3.74, 0.31, 0, -0.3],
      [1.75, 3.74, 0.39, 0, -0.3],
      [spoutPos.x - 0.14, spoutPos.y - 0.12, spoutPos.z, -0.45, -0.6],
      [spoutPos.x + 0.04, spoutPos.y + 0.08, spoutPos.z, -0.38, -0.2],
    ];
    for (const [x, y, z, vx, vy] of prePositions) {
      this.spawnWaterDropAt(x, y, z, vx, vy);
    }
  }

  private spawnWaterDropAt(x: number, y: number, z: number, vx: number, vy: number): void {
    // Pick next available (or oldest recycled) droplet from pool
    let idx = -1;
    for (let tries = 0; tries < this.maxWaterDrops; tries++) {
      const candidate = (this.waterPoolCursor + tries) % this.maxWaterDrops;
      if (!this.waterActive[candidate]) {
        idx = candidate;
        this.waterPoolCursor = (candidate + 1) % this.maxWaterDrops;
        break;
      }
    }
    if (idx === -1) {
      idx = this.waterPoolCursor;
      this.waterPoolCursor = (this.waterPoolCursor + 1) % this.maxWaterDrops;
    }

    const body = this.waterBodies[idx];
    body.setEnabled(true);
    body.setTranslation({ x, y, z }, true);
    body.setLinvel({ x: vx, y: vy, z: (Math.random() - 0.5) * 0.06 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.waterActive[idx] = true;
  }

  /** Advance the physics simulation by 1 fixed substep (1/120s) */
  public stepFixed(): void {
    const dt = 1 / 120;
    this.simTime += dt;

    // 1. Steady constant-head water supply from 平水壶
    this.waterSpawnTimer += dt;
    const spawnInterval = 0.215;
    if (this.waterSpawnTimer >= spawnInterval) {
      this.waterSpawnTimer -= spawnInterval;
      const { spoutPos } = TOWER_LAYOUT;
      const jitterZ = (Math.random() - 0.5) * 0.08;
      this.spawnWaterDropAt(
        spoutPos.x + 0.14,
        spoutPos.y + 0.11,
        spoutPos.z + jitterZ,
        -0.22,
        -0.08
      );
    }

    // 2. Step Rapier3D world
    this.world.step(this.eventQueue);

    // 3. Drain real rigid-body collision events -> trigger procedural audio & metrics
    this.eventQueue.drainCollisionEvents((h1, h2, started) => {
      if (!started) return;

      // Bell strike! (require genuine impact angular velocity so gentle resting contact doesn't false-trigger)
      if (
        (h1 === this.bellColliderHandle && h2 === this.bellHammerHeadHandle) ||
        (h2 === this.bellColliderHandle && h1 === this.bellHammerHeadHandle)
      ) {
        const impactVel = Math.abs(this.bellHammerBody.angvel().z);
        if (this.simTime > 0.5 && impactVel > 0.2 && this.simTime - this.lastBellStrikeTime > 0.65) {
          this.lastBellStrikeTime = this.simTime;
          this.bellStrikes++;
          this.events.onBellStrike?.(Math.min(1.0, 0.6 + impactVel * 0.15));
        }
        return;
      }

      // Drum strike!
      if (
        (h1 === this.drumColliderHandle && h2 === this.drumHammerHeadHandle) ||
        (h2 === this.drumColliderHandle && h1 === this.drumHammerHeadHandle)
      ) {
        const impactVel = Math.abs(this.drumHammerBody.angvel().z);
        if (this.simTime > 0.5 && impactVel > 0.2 && this.simTime - this.lastDrumStrikeTime > 0.65) {
          this.lastDrumStrikeTime = this.simTime;
          this.drumStrikes++;
          this.events.onDrumStrike?.(Math.min(1.0, 0.6 + impactVel * 0.15));
        }
        return;
      }

      // Stop-peg hitting Upper Latch (escaping lock sound!)
      if (
        (h1 === this.latchColliderHandle && this.stopPegHandles.has(h2)) ||
        (h2 === this.latchColliderHandle && this.stopPegHandles.has(h1))
      ) {
        this.events.onEscapementLock?.();
        return;
      }

      // Gear teeth meshing
      if (this.gear2Handles.has(h1) || this.gear2Handles.has(h2)) {
        this.events.onGearMesh?.();
        return;
      }

      // Water hitting drainage trough
      if (h1 === this.drainFloorHandle || h2 === this.drainFloorHandle) {
        this.events.onWaterSplash?.();
        return;
      }

      // Water dropping into scoop
      if (this.scoopFloorHandles.has(h1) || this.scoopFloorHandles.has(h2)) {
        this.events.onWaterDrop?.(0.5);
      }
    });

    // 4. Recycle water droplets once they have flowed down the lower drainage basin
    for (let i = 0; i < this.maxWaterDrops; i++) {
      if (!this.waterActive[i]) continue;
      const pos = this.waterBodies[i].translation();
      if (pos.y < 1.15 || (pos.y < 1.45 && pos.x < 0.75) || pos.x < -0.55 || pos.x > 3.2) {
        this.waterBodies[i].setEnabled(false);
        this.waterBodies[i].setTranslation({ x: 0, y: -20 - i * 0.25, z: 0 }, false);
        this.waterActive[i] = false;
      }
    }

    // 5. Track cumulative rotations & escapement state transitions
    const wAngle = getZAngle(this.wheelBody.rotation());
    const dW = wrapAngleDelta(wAngle - this.prevWheelAngle);
    this.cumulativeWheelRot += -dW; // clockwise is positive progress
    this.prevWheelAngle = wAngle;

    const sAngle = getYAngle(this.shaftBody.rotation());
    const dS = wrapAngleDelta(sAngle - this.prevShaftAngle);
    this.cumulativeShaftRot += -dS;
    this.prevShaftAngle = sAngle;

    const gAngle = getZAngle(this.globeBody.rotation());
    const dG = wrapAngleDelta(gAngle - this.prevGlobeAngle);
    this.cumulativeGlobeRot += -dG;
    this.prevGlobeAngle = gAngle;

    const balAngle = getZAngle(this.balanceBody.rotation());
    const isTipped = balAngle < -0.11;
    if (isTipped && !this.wasBalanceTipped) {
      this.events.onEscapementTrip?.();
    }
    this.wasBalanceTipped = isTipped;
  }

  public getTelemetry(): TelemetrySnapshot {
    const stepCount = Math.max(0, Math.floor((this.cumulativeWheelRot + 0.12) / (Math.PI / 6)));
    let activeWaterCount = 0;
    for (let i = 0; i < this.maxWaterDrops; i++) {
      if (this.waterActive[i]) activeWaterCount++;
    }
    return {
      stepCount,
      shichenIndex: stepCount % 12,
      wheelAngleDeg: (this.cumulativeWheelRot * 180) / Math.PI,
      shaftAngleDeg: (this.cumulativeShaftRot * 180) / Math.PI,
      globeAngleDeg: (this.cumulativeGlobeRot * 180) / Math.PI,
      balanceTipped: getZAngle(this.balanceBody.rotation()) < -0.1,
      latchLifted: getZAngle(this.latchBody.rotation()) < -0.12,
      bellStrikes: this.bellStrikes,
      drumStrikes: this.drumStrikes,
      activeWaterCount,
    };
  }
}

function quatFromAxisAngle(
  ax: number,
  ay: number,
  az: number,
  angle: number
): { x: number; y: number; z: number; w: number } {
  const half = angle * 0.5;
  const s = Math.sin(half);
  return { x: ax * s, y: ay * s, z: az * s, w: Math.cos(half) };
}

function getZAngle(q: { x: number; y: number; z: number; w: number }): number {
  return Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));
}

function getYAngle(q: { x: number; y: number; z: number; w: number }): number {
  return Math.atan2(2 * (q.w * q.y + q.z * q.x), 1 - 2 * (q.y * q.y + q.x * q.x));
}

function wrapAngleDelta(d: number): number {
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

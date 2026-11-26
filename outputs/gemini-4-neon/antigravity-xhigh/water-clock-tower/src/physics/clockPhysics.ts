import RAPIER from '@dimforge/rapier3d-compat';

/**
 * Complete real-time rigid-body physics simulation of Northern Song Su Song's
 * Water-Driven Astronomical Clock Tower (水运仪象台) using Rapier3D.
 *
 * Every mechanical motion in the tower is solved solely by Rapier3D rigid-body
 * dynamics, gravity, revolute joints, and real collider contacts:
 *   1. Dynamic water droplets fall under gravity from the constant-head spout (平水壶)
 *      into the hinged wooden scoops (受水壶) on the waterwheel rim.
 *   2. Accumulated water weight overcomes the bronze counterweights (枢权 / 天权),
 *      tipping the lower weighbridge lever (枢衡).
 *   3. A pinned vertical pull-rod (天条) transfers that tilt to the upper balance
 *      beam (天衡), lifting the bronze upper stop-latch (左天锁) off the 12 o'clock spoke.
 *   4. Gravitational torque from the water-loaded right-side scoops rotates the
 *      waterwheel (枢轮) clockwise by one pitch (30°), while the scoop slides off
 *      the weighbridge so counterweights drop 左天锁 back down to catch the next spoke;
 *      the anti-rebound pawl (右天锁) prevents backward bounce.
 *   5. 12 wooden pegs on the horizontal axle pinwheel (拨牙机轮) physically mesh with
 *      12 vertical crown-gear pegs at the base of the vertical shaft (天柱), rotating
 *      天柱 by 30° per tick.
 *   6. Rotating cam-pegs on 天柱's timekeeping carousel (昼夜机轮) physically cock
 *      and release pivoted Bell & Drum striker mallet arms, which physically collide
 *      with the suspended swinging bronze bell (铜钟) and ceremonial red drum (红鼓).
 *   7. An upper pinwheel on 天柱 physically meshes with a tilted crown gear driving
 *      the Celestial Globe (浑象), while the Armillary Sphere (浑仪) turns atop 天柱.
 */

// 16 collision groups (bits 0..15)
const G_WATER = 1 << 0;
const G_SCOOP_WALL = 1 << 1;
const G_BASIN = 1 << 2;
const G_TRIGGER_PIN = 1 << 3;
const G_WEIGHBRIDGE = 1 << 4;
const G_SPOKE = 1 << 5;
const G_UPPER_LOCK = 1 << 6;
const G_ANTI_REBOUND = 1 << 7;
const G_DRIVE_GEAR = 1 << 8;
const G_CROWN_GEAR = 1 << 9;
const G_CAM_PEG = 1 << 10;
const G_STRIKER_FOLLOWER = 1 << 11;
const G_MALLET_HEAD = 1 << 12;
const G_INSTRUMENT = 1 << 13;
const G_UPPER_DRIVE = 1 << 14;
const G_GLOBE_GEAR = 1 << 15;

function groups(membership: number, filter: number): number {
  return ((membership & 0xffff) << 16) | (filter & 0xffff);
}

export const LAYOUT = {
  // Waterwheel (枢轮) in XY plane, rotating around Z (clockwise = -Z angular velocity)
  WHEEL_CENTER: { x: 0.55, y: 2.55, z: 0.45 },
  WHEEL_SCOOP_COUNT: 12,
  WHEEL_RIM_RADIUS: 1.48,
  WHEEL_SPOKE_RADIUS: 1.76,
  SCOOP_Z_OFFSET: 0.27, // Scoops sit on front side of wheel at z = 0.72
  SCOOP_HINGE_RADIUS: 1.24,
  SCOOP_CAVITY_LOCAL_X: 0.28, // Radially outward from hinge
  SCOOP_TRIGGER_Z: 1.00,

  // Constant-head spout (平水壶出水口) positioned above the 30° (2 o'clock) scoop
  SPOUT_TIP: { x: 1.94, y: 3.92, z: 0.72 },

  // Escapement parallelogram linkage (枢衡 - 天条 - 天衡)
  // Upper beam pivot at y = 4.24 (just below spoke tip y = 4.34) eliminates arc self-locking!
  WEIGHBRIDGE_PIVOT: { x: 1.50, y: 3.04, z: 1.00 },
  UPPER_BEAM_PIVOT: { x: 1.50, y: 4.24, z: 1.00 },
  PULL_ROD_DX: 0.36, // Attachment X offset right of pivots -> x = 1.86
  ANTI_REBOUND_PIVOT: { x: 0.16, y: 4.54, z: 0.45 },

  // Horizontal driving pinwheel on rear of main waterwheel axle
  DRIVE_GEAR_Z: -0.82,
  GEAR_PITCH_RADIUS: 0.58,

  // Vertical Main Shaft (天柱)
  TIANZHU_X: 0.55,
  TIANZHU_Z: -1.40,
  CROWN_GEAR_Y: 1.84,

  // Timekeeping Pagoda Carousel (昼夜机轮) on 天柱
  CAROUSEL_Y: 5.55,
  CAROUSEL_RADIUS: 1.04,

  // Bell (left) and Drum (right) assemblies (pivots at R = 1.24m, ±45° from 天柱)
  BELL_PIVOT: { x: -0.59, y: 6.32, z: -0.34 },
  BELL_STRIKER_PIVOT: { x: -0.33, y: 5.56, z: -0.52 },
  DRUM_POS: { x: 1.69, y: 5.76, z: -0.70 },
  DRUM_STRIKER_PIVOT: { x: 1.43, y: 5.56, z: -0.52 },

  // Celestial Globe (浑象) & Armillary Sphere (浑仪)
  UPPER_GEAR_Y: 7.20,
  GLOBE_CENTER: { x: -0.36, y: 7.72, z: -1.40 },
  ARMILLARY_Y: 9.18,
} as const;

export const SHICHEN_NAMES = [
  '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
  '午时', '未时', '申时', '酉时', '戌时', '亥时',
] as const;

export interface PhysicsEvent {
  type: 'droplet' | 'latch_lift' | 'latch_catch' | 'gear_engage' | 'bell_strike' | 'drum_strike';
  intensity: number;
  position: { x: number; y: number; z: number };
}

export interface DropletState {
  body: RAPIER.RigidBody;
  active: boolean;
  age: number;
  inScoopIndex: number;
  hitNotified: boolean;
}

export class SuSongClockPhysics {
  public world: RAPIER.World;
  public eventQueue: RAPIER.EventQueue;

  // Fixed anchor body
  public groundBody: RAPIER.RigidBody;

  // Dynamic mechanical rigid bodies
  public waterwheelBody: RAPIER.RigidBody;
  public scoopBodies: RAPIER.RigidBody[] = [];
  public weighbridgeBody: RAPIER.RigidBody;
  public pullRodBody: RAPIER.RigidBody;
  public upperBeamBody: RAPIER.RigidBody;
  public antiReboundBody: RAPIER.RigidBody;
  public tianZhuBody: RAPIER.RigidBody;
  public bellStrikerBody: RAPIER.RigidBody;
  public bellBody: RAPIER.RigidBody;
  public drumStrikerBody: RAPIER.RigidBody;
  public globeBody: RAPIER.RigidBody;

  // Droplet pool (real dynamic rigid bodies!)
  public droplets: DropletState[] = [];
  public scoopFillCount: number[] = new Array(LAYOUT.WHEEL_SCOOP_COUNT).fill(0);
  public readonly maxDroplets = 110;

  // Collider handle lookup for collision event routing
  private colliderTags = new Map<number, string>();

  // Telemetry & state tracking (derived strictly from physical rigid-body state!)
  public simTime = 0;
  public tickCount = 0;
  public wheelAngleAccum = 0;
  private prevWheelAngle = 0;
  public tianZhuAngleAccum = 0;
  private prevTianZhuAngle = 0;
  public globeAngleAccum = 0;
  private prevGlobeAngle = 0;

  // Debounced audio/FX event tracking
  private lastBellStrikeTime = -10;
  private lastDrumStrikeTime = -10;
  private lastCatchTime = -10;
  private lastLiftTime = -10;
  private lastGearTime = -10;
  private lastDropletSoundTime = -10;
  private wasLatchLifted = false;
  private spawnAccum = 0;
  private nextDropletCursor = 0;
  private rngState = 10880719; // Deterministic seed (Northern Song 1088)

  public pendingEvents: PhysicsEvent[] = [];

  constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.integrationParameters.dt = 1 / 120;
    this.world.integrationParameters.numSolverIterations = 12;
    this.world.integrationParameters.numInternalPgsIterations = 2;

    this.eventQueue = new RAPIER.EventQueue(true);

    // 1. Static Ground / Tower Frame + Drainage Basin
    this.groundBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    this.buildStaticBasinAndDrum();

    // 2. Waterwheel (枢轮) + Horizontal Axle + 12 Spokes + Driving Pinwheel
    this.waterwheelBody = this.buildWaterwheel();

    // 3. 12 Hinged Scoops (受水壶) mounted on wheel rim via RevoluteJoints
    this.buildScoops();

    // 4. Escapement Linkage: 枢衡 (Lower Weighbridge), 天条 (Pull-Rod), 天衡 (Upper Beam + 左天锁), 右天锁
    const esc = this.buildEscapement();
    this.weighbridgeBody = esc.weighbridge;
    this.pullRodBody = esc.pullRod;
    this.upperBeamBody = esc.upperBeam;
    this.antiReboundBody = esc.antiRebound;

    // 5. Vertical Main Shaft (天柱) + Lower Crown Pin-Gear + Timekeeping Carousel + Cam Pegs + Upper Pin-Gear
    this.tianZhuBody = this.buildTianZhu();

    // 6. Bell Striker, Swinging Bronze Bell (铜钟), Drum Striker
    const strikers = this.buildBellAndDrumMechanisms();
    this.bellStrikerBody = strikers.bellStriker;
    this.bellBody = strikers.bell;
    this.drumStrikerBody = strikers.drumStriker;

    // 7. Tilted Celestial Globe (浑象) driven by real upper pin-gear meshing
    this.globeBody = this.buildCelestialGlobe();

    // 8. Pre-allocate pool of real dynamic water droplet rigid bodies
    this.initDropletPool();

    // Warm-start physics so water is already streaming smoothly into the active scoop at t = 0
    this.warmStart(1.45);
  }

  private rand(): number {
    this.rngState = (this.rngState * 1664525 + 1013904223) >>> 0;
    return this.rngState / 4294967296;
  }

  private buildStaticBasinAndDrum(): void {
    // Drainage pool floor & walls catching emptied droplets from lower scoops
    const basinFloor = RAPIER.ColliderDesc.cuboid(2.4, 0.12, 1.4)
      .setTranslation(0.95, 0.44, 0.72)
      .setFriction(0.15)
      .setRestitution(0.05)
      .setCollisionGroups(groups(G_BASIN, G_WATER));
    this.world.createCollider(basinFloor, this.groundBody);

    // Static Ceremonial Red Drum (红鼓) collider receiving mallet hits on its left face (x = 1.69 - 0.17 = 1.52)
    const drumCol = RAPIER.ColliderDesc.cylinder(0.17, 0.24)
      .setTranslation(LAYOUT.DRUM_POS.x, LAYOUT.DRUM_POS.y, LAYOUT.DRUM_POS.z)
      .setRotation(this.quatFromAxisAngle(0, 0, 1, Math.PI / 2))
      .setRestitution(0.55)
      .setCollisionGroups(groups(G_INSTRUMENT, G_MALLET_HEAD))
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const dc = this.world.createCollider(drumCol, this.groundBody);
    this.colliderTags.set(dc.handle, 'drum');
  }

  private buildWaterwheel(): RAPIER.RigidBody {
    const wc = LAYOUT.WHEEL_CENTER;
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(wc.x, wc.y, wc.z)
      .setAngularDamping(1.35)
      .setCanSleep(false);
    const body = this.world.createRigidBody(bodyDesc);

    // Core wheel inertia carrier (no collisions — purely provides authentic timber wheel mass/inertia)
    const inertiaCol = RAPIER.ColliderDesc.cylinder(0.12, 1.38)
      .setRotation(this.quatFromAxisAngle(1, 0, 0, Math.PI / 2))
      .setMass(26.0)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(inertiaCol, body);

    // 12 Radial Spokes / Arrestor Pegs (辐条) colliding with 左天锁 & 右天锁
    // k = 0 sits at 90° (12 o'clock), going clockwise by 30° steps
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const alpha = Math.PI / 2 - (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const rMid = 1.62;
      const cx = Math.cos(alpha) * rMid;
      const cy = Math.sin(alpha) * rMid;
      // Capsule aligned radially along alpha (default capsule is along Y -> rotate around Z by alpha - PI/2)
      const spokeCol = RAPIER.ColliderDesc.capsule(0.14, 0.036)
        .setTranslation(cx, cy, 0)
        .setRotation(this.quatFromAxisAngle(0, 0, 1, alpha - Math.PI / 2))
        .setDensity(0.1)
        .setFriction(0.08)
        .setRestitution(0.05)
        .setCollisionGroups(groups(G_SPOKE, G_UPPER_LOCK | G_ANTI_REBOUND))
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
      const sc = this.world.createCollider(spokeCol, body);
      this.colliderTags.set(sc.handle, 'spoke');
    }

    // 12 Wooden Peg-Teeth on Horizontal Driving Pinwheel (拨牙机轮) at rear of axle (z = DRIVE_GEAR_Z)
    const dz = LAYOUT.DRIVE_GEAR_Z - wc.z; // -1.27
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      // Peg k=0 straight DOWN (-PI/2) so it meshes cleanly at the bottom with the vertical 天柱 crown gear
      const alpha = -Math.PI / 2 - (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const rPeg = LAYOUT.GEAR_PITCH_RADIUS; // 0.58
      const px = Math.cos(alpha) * rPeg;
      const py = Math.sin(alpha) * rPeg;
      const pegCol = RAPIER.ColliderDesc.capsule(0.085, 0.046)
        .setTranslation(px, py, dz)
        .setRotation(this.quatFromAxisAngle(0, 0, 1, alpha - Math.PI / 2))
        .setDensity(0.05)
        .setFriction(0.06)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_DRIVE_GEAR, G_CROWN_GEAR))
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
      const pc = this.world.createCollider(pegCol, body);
      this.colliderTags.set(pc.handle, 'drive_peg');
    }

    // Revolute joint pinning waterwheel to fixed tower frame around Z axis
    const jointData = RAPIER.JointData.revolute(
      { x: wc.x, y: wc.y, z: wc.z },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    this.world.createImpulseJoint(jointData, this.groundBody, body, true);

    return body;
  }

  private buildScoops(): void {
    const wc = LAYOUT.WHEEL_CENTER;
    const zScoop = wc.z + LAYOUT.SCOOP_Z_OFFSET; // 0.72
    const triggerZRel = LAYOUT.SCOOP_TRIGGER_Z - zScoop; // +0.28

    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      // k = 0 is at 90° (12 o'clock), k = 2 is at 30° (2 o'clock = filling station!)
      const alpha = Math.PI / 2 - (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      // Local wheel orientation so that at alpha = 30° (PI/6), the scoop's local +Y faces STRAIGHT UP (+Y world)!
      // Angle delta from 30°: rotZ = alpha - PI/6
      const initRot = alpha - Math.PI / 6;

      const hx = Math.cos(alpha) * LAYOUT.SCOOP_HINGE_RADIUS;
      const hy = Math.sin(alpha) * LAYOUT.SCOOP_HINGE_RADIUS;

      const scoopDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(wc.x + hx, wc.y + hy, zScoop)
        .setRotation(this.quatFromAxisAngle(0, 0, 1, initRot))
        .setAngularDamping(2.0)
        .setLinearDamping(0.5)
        .setCanSleep(false);
      const scoop = this.world.createRigidBody(scoopDesc);

      // Hollow open-top wooden trough made of 5 thick cuboid walls (local frame: +X outward, +Y open mouth!)
      // Cavity center sits at local (0.28, 0.04, 0), inner size ~0.36(X) x 0.30(Y) x 0.30(Z)
      const wallOpts = (hxW: number, hyW: number, hzW: number, tx: number, ty: number, tz: number) =>
        RAPIER.ColliderDesc.cuboid(hxW, hyW, hzW)
          .setTranslation(tx, ty, tz)
          .setMass(0.05)
          .setFriction(0.65)
          .setRestitution(0.02)
          .setCollisionGroups(groups(G_SCOOP_WALL, G_WATER))
          .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

      // Floor
      const floor = this.world.createCollider(wallOpts(0.22, 0.035, 0.19, 0.28, -0.11, 0), scoop);
      this.colliderTags.set(floor.handle, `scoop_${k}`);
      // Inner wall (left at 30°)
      this.world.createCollider(wallOpts(0.035, 0.16, 0.19, 0.08, 0.03, 0), scoop);
      // Outer lip wall (right at 30°, slightly lower for clean pouring at bottom)
      this.world.createCollider(wallOpts(0.035, 0.145, 0.19, 0.48, 0.015, 0), scoop);
      // Front wall (+Z)
      this.world.createCollider(wallOpts(0.22, 0.16, 0.035, 0.28, 0.03, 0.175), scoop);
      // Back wall (-Z)
      this.world.createCollider(wallOpts(0.22, 0.16, 0.035, 0.28, 0.03, -0.175), scoop);

      // Brass Trigger Pin protruding forward (+Z) near outer edge of scoop to rest on 枢衡
      // At alpha = 30° (initRot = 0), local (0.42, -0.10, +0.28) is at world (2.044, 3.070, 1.00)
      const trigCol = RAPIER.ColliderDesc.capsule(0.08, 0.036)
        .setTranslation(0.42, -0.10, triggerZRel)
        .setRotation(this.quatFromAxisAngle(1, 0, 0, Math.PI / 2))
        .setMass(0.03)
        .setFriction(0.02)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_TRIGGER_PIN, G_WEIGHBRIDGE));
      this.world.createCollider(trigCol, scoop);

      // Revolute hinge joint attaching scoop to waterwheel rim!
      const jClean = RAPIER.JointData.revolute(
        { x: hx, y: hy, z: LAYOUT.SCOOP_Z_OFFSET },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 }
      );
      const rj = this.world.createImpulseJoint(jClean, this.waterwheelBody, scoop, true) as RAPIER.RevoluteImpulseJoint;
      // Allow scoop to droop clockwise by up to 0.50 rad below initRot so trigger pin travels 0.20m down!
      rj.setLimits(initRot - 0.50, initRot + 0.02);
      // Light wooden flexure reed keeps empty scoops neatly held against their upper stop
      rj.configureMotorPosition(initRot, 1.8, 0.45);
      rj.setMotorMaxForce(1.1);

      this.scoopBodies.push(scoop);
    }
  }

  private buildEscapement(): {
    weighbridge: RAPIER.RigidBody;
    pullRod: RAPIER.RigidBody;
    upperBeam: RAPIER.RigidBody;
    antiRebound: RAPIER.RigidBody;
  } {
    const wp = LAYOUT.WEIGHBRIDGE_PIVOT; // (1.28, 3.16, 1.00)
    const up = LAYOUT.UPPER_BEAM_PIVOT;  // (1.28, 4.78, 1.00)
    const rodDx = LAYOUT.PULL_ROD_DX;    // +0.36

    // --- 1. Lower Weighbridge Lever (枢衡 + 枢权 Counterweight) ---
    const weighbridge = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(wp.x, wp.y, wp.z)
        .setAngularDamping(2.2)
        .setCanSleep(false)
    );

    // Right cradle pad receiving the 30° scoop's trigger pin
    // Trigger pin at alpha=30° (empty) sits at world (2.044, 3.070, 1.00) -> local (+0.544, +0.030, 0)
    // Bottom of trigger pin (r=0.036) is at local y = -0.006 -> place pad top right at local y = -0.008!
    // Pad right edge reaches local x = +0.585 (world x = 2.085), so within ~5° of wheel turn the pin slips cleanly off!
    const padCol = RAPIER.ColliderDesc.cuboid(0.11, 0.028, 0.07)
      .setTranslation(0.49, -0.036, 0)
      .setMass(0.10)
      .setFriction(0.02)
      .setRestitution(0.02)
      .setCollisionGroups(groups(G_WEIGHBRIDGE, G_TRIGGER_PIN));
    this.world.createCollider(padCol, weighbridge);

    // Bronze Counterweight (枢权) hanging on the LEFT arm (Δx = -0.58m)
    const lowerWeightCol = RAPIER.ColliderDesc.ball(0.105)
      .setTranslation(-0.58, -0.08, 0)
      .setMass(0.58)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(lowerWeightCol, weighbridge);

    const wbJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: wp.x, y: wp.y, z: wp.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      this.groundBody,
      weighbridge,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    wbJoint.setLimits(-0.36, 0.01);

    // --- 2. Upper Balance Beam (天衡 + 左天锁 Upper Stop-Latch + 天权 Counterweight) ---
    const upperBeam = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(up.x, up.y, up.z)
        .setAngularDamping(2.0)
        .setCanSleep(false)
    );

    // Left bronze counterweight (天权) assisting crisp snap-down reset of 左天锁
    const upperWeightCol = RAPIER.ColliderDesc.ball(0.088)
      .setTranslation(-0.78, -0.05, -0.22)
      .setMass(0.20)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(upperWeightCol, upperBeam);

    // Upper Bronze Stop-Latch (左天锁) extending back to spoke plane z = 0.45 (local z = -0.55)
    // Pivot is at y = 4.24; top spoke tip reaches y = 2.55 + 1.796 = 4.346 at x = 0.55.
    // Place 左天锁 center at local (-0.865, +0.06, -0.55) -> world (0.635, 4.30, 0.45), half-height 0.11 -> y in [4.19, 4.41]!
    // Because center is ABOVE pivot (Δy = +0.06), lifting swings slightly +X AWAY from spoke -> ZERO self-locking!
    const latchCol = RAPIER.ColliderDesc.cuboid(0.036, 0.11, 0.065)
      .setTranslation(-0.865, 0.06, LAYOUT.WHEEL_CENTER.z - up.z)
      .setMass(0.11)
      .setFriction(0.02)
      .setRestitution(0.03)
      .setCollisionGroups(groups(G_UPPER_LOCK, G_SPOKE))
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const lc = this.world.createCollider(latchCol, upperBeam);
    this.colliderTags.set(lc.handle, 'upper_lock');

    const ubJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: up.x, y: up.y, z: up.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      this.groundBody,
      upperBeam,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    ubJoint.setLimits(-0.36, 0.01);

    // --- 3. Vertical Bronze Pull-Rod (天条) completing the exact parallelogram linkage ---
    const rodLen = up.y - wp.y; // 1.62m
    const pullRod = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(wp.x + rodDx, (wp.y + up.y) * 0.5, wp.z)
        .setLinearDamping(0.5)
        .setAngularDamping(1.0)
        .setCanSleep(false)
    );
    const rodCol = RAPIER.ColliderDesc.capsule(rodLen * 0.45, 0.022)
      .setMass(0.14)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(rodCol, pullRod);

    // Bottom pin joint: 枢衡 right arm (+rodDx, 0, 0) <-> 天条 bottom (0, -rodLen/2, 0)
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute(
        { x: rodDx, y: 0, z: 0 },
        { x: 0, y: -rodLen * 0.5, z: 0 },
        { x: 0, y: 0, z: 1 }
      ),
      weighbridge,
      pullRod,
      true
    );

    // Top pin joint: 天衡 right arm (+rodDx, 0, 0) <-> 天条 top (0, +rodLen/2, 0)
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute(
        { x: rodDx, y: 0, z: 0 },
        { x: 0, y: rodLen * 0.5, z: 0 },
        { x: 0, y: 0, z: 1 }
      ),
      upperBeam,
      pullRod,
      true
    );

    // --- 4. Anti-Rebound Pawl (右天锁 / 止回爪) ---
    const ap = LAYOUT.ANTI_REBOUND_PIVOT; // (0.16, 4.54, 0.45)
    const antiRebound = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(ap.x + 0.08, ap.y, ap.z)
        .setAngularDamping(2.0)
        .setCanSleep(false)
    );
    // Angled bronze catch finger drops snugly right behind the 12 o'clock spoke (x = 0.55) to eliminate rebound!
    const pawlCol = RAPIER.ColliderDesc.capsule(0.18, 0.028)
      .setTranslation(0.19, -0.15, 0)
      .setRotation(this.quatFromAxisAngle(0, 0, 1, Math.PI * 0.29))
      .setMass(0.18)
      .setFriction(0.05)
      .setRestitution(0.01)
      .setCollisionGroups(groups(G_ANTI_REBOUND, G_SPOKE));
    this.world.createCollider(pawlCol, antiRebound);

    const pawlJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: ap.x + 0.08, y: ap.y, z: ap.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      this.groundBody,
      antiRebound,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    pawlJoint.setLimits(-0.04, 0.95);

    return { weighbridge, pullRod, upperBeam, antiRebound };
  }

  private buildTianZhu(): RAPIER.RigidBody {
    const tx = LAYOUT.TIANZHU_X; // 0.55
    const tz = LAYOUT.TIANZHU_Z; // -1.40

    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(tx, 0, tz)
        .setAngularDamping(2.2)
        .setCanSleep(false)
    );

    // Core vertical shaft inertia carrier
    const shaftInertia = RAPIER.ColliderDesc.cylinder(4.2, 0.24)
      .setTranslation(0, 4.9, 0)
      .setMass(6.5)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(shaftInertia, body);

    // 1. Lower Crown Pin-Gear (天柱下轮) at y = CROWN_GEAR_Y (1.84)
    // 12 vertical wooden pegs rising from y = 1.84 to 2.08 at radius 0.58m.
    // Front peg at z = -1.40 + 0.58 = -0.82 (EXACT match with driving pinwheel z = -0.82!).
    // Offset by +15° (PI/12) so the driving bottom peg at x=0 sits neatly between two crown pegs!
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const phi = (k + 0.5) * ((Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT);
      const px = Math.sin(phi) * LAYOUT.GEAR_PITCH_RADIUS;
      const pz = Math.cos(phi) * LAYOUT.GEAR_PITCH_RADIUS;
      const crownPeg = RAPIER.ColliderDesc.capsule(0.09, 0.044)
        .setTranslation(px, LAYOUT.CROWN_GEAR_Y + 0.11, pz)
        .setDensity(0.05)
        .setFriction(0.06)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_CROWN_GEAR, G_DRIVE_GEAR))
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
      const cp = this.world.createCollider(crownPeg, body);
      this.colliderTags.set(cp.handle, 'crown_peg');
    }

    // 2. Timekeeping Carousel (昼夜机轮) Cam-Pegs at y = CAROUSEL_Y (5.55)
    // When waterwheel turns clockwise (ω_z < 0), bottom drive peg pushes crown gear along -X,
    // making 天柱 rotate CLOCKWISE from above (ω_y < 0)!
    // 12 Bell cam-pegs (lower ring, y = 5.42) & 12 Drum cam-pegs (upper ring, y = 5.70, offset by +11°)
    // so EVERY 30° waterwheel tick cocks & releases Drum (咚) then Bell (当)!
    const camR = 1.05;
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      // Bell cam pegs (y = 5.42): phased to release cleanly at ~22° of every 30° step!
      const phiBell = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT + 0.04;
      const bx = Math.sin(phiBell) * camR;
      const bz = Math.cos(phiBell) * camR;
      const bellCam = RAPIER.ColliderDesc.capsule(0.055, 0.036)
        .setTranslation(bx, LAYOUT.CAROUSEL_Y - 0.13, bz)
        .setDensity(0.02)
        .setFriction(0.01)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_CAM_PEG, G_STRIKER_FOLLOWER));
      this.world.createCollider(bellCam, body);

      // Drum cam pegs (y = 5.70): phased to release at ~15° of every 30° step (咚 right before 当!)
      const phiDrum = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT + 0.45;
      const dx = Math.sin(phiDrum) * camR;
      const dz = Math.cos(phiDrum) * camR;
      const drumCam = RAPIER.ColliderDesc.capsule(0.055, 0.036)
        .setTranslation(dx, LAYOUT.CAROUSEL_Y + 0.15, dz)
        .setDensity(0.02)
        .setFriction(0.01)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_CAM_PEG, G_STRIKER_FOLLOWER));
      this.world.createCollider(drumCam, body);
    }

    // 3. Upper Horizontal Crown Pin-Gear at y = UPPER_GEAR_Y (7.20) driving the Celestial Globe (浑象)
    const upperR = 0.44;
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const phi = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const ux = Math.sin(phi) * upperR;
      const uz = Math.cos(phi) * upperR;
      const uPeg = RAPIER.ColliderDesc.capsule(0.075, 0.036)
        .setTranslation(ux, LAYOUT.UPPER_GEAR_Y + 0.09, uz)
        .setDensity(0.02)
        .setFriction(0.05)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_UPPER_DRIVE, G_GLOBE_GEAR));
      this.world.createCollider(uPeg, body);
    }

    // Revolute joint pinning vertical shaft 天柱 around Y axis
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: tx, y: 0, z: tz }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
      this.groundBody,
      body,
      true
    );

    return body;
  }

  private buildBellAndDrumMechanisms(): {
    bellStriker: RAPIER.RigidBody;
    bell: RAPIER.RigidBody;
    drumStriker: RAPIER.RigidBody;
  } {
    // --- 1. Hanging Bronze Temple Bell (铜钟) on real RevoluteJoint so mallet impact swings it! ---
    const bp = LAYOUT.BELL_PIVOT; // (-0.58, 6.32, -0.60)
    const bell = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(bp.x, bp.y, bp.z)
        .setAngularDamping(0.85)
        .setCanSleep(false)
    );
    // Bell skirt sits 0.54m below suspension hook -> world (-0.59, 5.78, -0.34), right lip at x = -0.41
    const bellCol = RAPIER.ColliderDesc.cylinder(0.22, 0.18)
      .setTranslation(0, -0.54, 0)
      .setMass(0.55)
      .setRestitution(0.75)
      .setCollisionGroups(groups(G_INSTRUMENT, G_MALLET_HEAD))
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const bc = this.world.createCollider(bellCol, bell);
    this.colliderTags.set(bc.handle, 'bell');

    // Swings around Z axis (left-right away from/toward the striker!)
    const bellJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: bp.x, y: bp.y, z: bp.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      this.groundBody,
      bell,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    bellJoint.setLimits(-0.55, 0.55);

    // --- 2. Bell Striker Mallet Arm (击钟木臂) on vertical Y-axis RevoluteJoint ---
    // Pivot at (-0.26, 5.56, -0.60).
    // Check geometry relative to 天柱 (0.55, -1.40):
    //   Vector from 天柱 to pivot = (-0.81, +0.80), distance = 1.138m (just outside camR = 1.07m!).
    //   When 天柱 rotates clockwise from above (ω_y < 0), cam pegs at front-left move toward (-X, -Z) (tangent = (-0.70, -0.71))!
    //   Follower tail extends inward toward 天柱 along (+0.11, -0.14, -0.10) so cam-peg pushes tail toward (-X, -Z)
    //   -> rotates striker arm CLOCKWISE from above (-θ_y), cocking the mallet head (at local -X = -0.20) BACKWARD (+Z)!
    //   When cam-peg releases the tail, wooden leaf spring snaps mallet forward (-Z -> into the bell at (-0.58, 5.78, -0.60))!
    const bsp = LAYOUT.BELL_STRIKER_PIVOT;
    const bellStriker = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(bsp.x, bsp.y, bsp.z)
        .setAngularDamping(0.16)
        .setCanSleep(false)
    );
    // Compact rounded follower tip at R = 1.04m from 天柱 when resting -> slips cleanly off at ~50° (R = 1.13m)!
    const bellFollower = RAPIER.ColliderDesc.ball(0.032)
      .setTranslation(0.14, -0.14, -0.14)
      .setMass(0.04)
      .setFriction(0.01)
      .setCollisionGroups(groups(G_STRIKER_FOLLOWER, G_CAM_PEG));
    this.world.createCollider(bellFollower, bellStriker);

    // Mallet head at local (0.0, +0.22, +0.18) -> world (-0.33, 5.78, -0.34):
    // +Y cocking swings x' = +0.18 sin(θ) STRAIGHT AWAY (+X) from the bell at x = -0.41!
    // -Y spring snap swings x' STRAIGHT HEAD-ON (-X) into the bronze bell!
    const bellMallet = RAPIER.ColliderDesc.ball(0.058)
      .setTranslation(0.0, 0.22, 0.18)
      .setMass(0.22)
      .setRestitution(0.68)
      .setCollisionGroups(groups(G_MALLET_HEAD, G_INSTRUMENT))
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const bm = this.world.createCollider(bellMallet, bellStriker);
    this.colliderTags.set(bm.handle, 'bell_mallet');

    const bsJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: bsp.x, y: bsp.y, z: bsp.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
      this.groundBody,
      bellStriker,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    bsJoint.setLimits(-0.42, 1.25);
    // Snappy bamboo leaf-spring easily cocked (+Y) by 天柱 cam-pegs, then whips mallet (-Y) head-on into the bronze bell!
    bsJoint.configureMotorPosition(-0.20, 18.0, 0.10);
    bsJoint.setMotorMaxForce(1.4);

    // --- 3. Drum Striker Mallet Arm (击鼓木臂) on right side ---
    const dsp = LAYOUT.DRUM_STRIKER_PIVOT;
    const drumStriker = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(dsp.x, dsp.y, dsp.z)
        .setAngularDamping(0.16)
        .setCanSleep(false)
    );
    const drumFollower = RAPIER.ColliderDesc.ball(0.032)
      .setTranslation(-0.14, 0.14, -0.14)
      .setMass(0.04)
      .setFriction(0.01)
      .setCollisionGroups(groups(G_STRIKER_FOLLOWER, G_CAM_PEG));
    this.world.createCollider(drumFollower, drumStriker);

    // Mallet head at local (0.0, +0.20, -0.18) -> world (+1.43, 5.76, -0.70):
    // +Y cocking swings x' = -0.18 sin(θ) STRAIGHT AWAY (-X) from the red drum at x = +1.52!
    // -Y spring snap swings x' STRAIGHT HEAD-ON (+X) into the red ceremonial drum!
    const drumMallet = RAPIER.ColliderDesc.ball(0.058)
      .setTranslation(0.0, 0.20, -0.18)
      .setMass(0.20)
      .setRestitution(0.65)
      .setCollisionGroups(groups(G_MALLET_HEAD, G_INSTRUMENT))
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    const dm = this.world.createCollider(drumMallet, drumStriker);
    this.colliderTags.set(dm.handle, 'drum_mallet');

    const dsJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: dsp.x, y: dsp.y, z: dsp.z }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
      this.groundBody,
      drumStriker,
      true
    ) as RAPIER.RevoluteImpulseJoint;
    dsJoint.setLimits(-0.42, 1.25);
    dsJoint.configureMotorPosition(-0.28, 15.0, 0.12);
    dsJoint.setMotorMaxForce(1.4);

    return { bellStriker, bell, drumStriker };
  }

  private buildCelestialGlobe(): RAPIER.RigidBody {
    // Celestial Globe (浑象) mounted on left of 天柱 at (-0.36, 7.72, -1.40),
    // rotating around X axis (with an equatorial pinwheel at x = +0.11 = world +0.11? Wait:
    // Upper pinwheel on 天柱 is at (0.55, 7.20, -1.40), radius 0.44 -> left-most peg sits at x = 0.55 - 0.44 = +0.11, y = 7.29!
    // So mount the Celestial Globe centered at (-0.36, 7.72, -1.40) with its driven pinwheel at local x = +0.47 (world x = +0.11!),
    // radius 0.44 -> bottom peg reaches y = 7.72 - 0.44 = 7.28 (EXACT match with upper drive gear y = 7.29!!)!
    const gc = LAYOUT.GLOBE_CENTER;
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(gc.x, gc.y, gc.z)
        .setAngularDamping(2.0)
        .setCanSleep(false)
    );

    const sphereInertia = RAPIER.ColliderDesc.ball(0.40)
      .setMass(1.2)
      .setCollisionGroups(groups(0, 0));
    this.world.createCollider(sphereInertia, body);

    const gearLocalX = LAYOUT.TIANZHU_X - 0.44 - gc.x; // 0.55 - 0.44 - (-0.36) = +0.47
    const rGlobeGear = 0.44;
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      // Offset by +15° around X axis so bottom peg straddles the upper drive peg cleanly!
      const theta = -Math.PI / 2 + (k + 0.5) * ((Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT);
      const py = Math.sin(theta) * rGlobeGear;
      const pz = Math.cos(theta) * rGlobeGear;
      // Radial peg in YZ plane pointing radially outward from X axis
      const peg = RAPIER.ColliderDesc.capsule(0.065, 0.036)
        .setTranslation(gearLocalX, py, pz)
        .setRotation(this.quatFromAxisAngle(1, 0, 0, Math.PI / 2 - theta))
        .setDensity(0.02)
        .setFriction(0.05)
        .setRestitution(0.02)
        .setCollisionGroups(groups(G_GLOBE_GEAR, G_UPPER_DRIVE));
      this.world.createCollider(peg, body);
    }

    // Revolute joint around X axis (celestial globe rotates smoothly on every tick!)
    this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: gc.x, y: gc.y, z: gc.z }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }),
      this.groundBody,
      body,
      true
    );

    return body;
  }

  private initDropletPool(): void {
    for (let i = 0; i < this.maxDroplets; i++) {
      const body = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(0, -10 - i * 0.2, 0)
          .setLinearDamping(0.35)
          .setAngularDamping(1.5)
          .setCcdEnabled(true)
          .setEnabled(false)
      );
      const col = RAPIER.ColliderDesc.ball(0.048)
        .setMass(0.185)
        .setFriction(0.55)
        .setRestitution(0.03)
        .setCollisionGroups(groups(G_WATER, G_SCOOP_WALL | G_BASIN))
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
      const c = this.world.createCollider(col, body);
      this.colliderTags.set(c.handle, `drop_${i}`);

      this.droplets.push({
        body,
        active: false,
        age: 0,
        inScoopIndex: -1,
        hitNotified: false,
      });
    }
  }

  private spawnDroplet(): void {
    const slot = this.droplets[this.nextDropletCursor];
    this.nextDropletCursor = (this.nextDropletCursor + 1) % this.maxDroplets;

    const jitterX = (this.rand() - 0.5) * 0.028;
    const jitterZ = (this.rand() - 0.5) * 0.028;
    slot.body.setEnabled(true);
    slot.body.setTranslation(
      {
        x: LAYOUT.SPOUT_TIP.x + jitterX,
        y: LAYOUT.SPOUT_TIP.y,
        z: LAYOUT.SPOUT_TIP.z + jitterZ,
      },
      true
    );
    // Constant-head horizontal efflux velocity out of the bronze dragon spout into the 30° scoop
    slot.body.setLinvel({ x: -0.05 + jitterX * 0.6, y: -0.45, z: jitterZ * 0.6 }, true);
    slot.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    slot.active = true;
    slot.age = 0;
    slot.inScoopIndex = -1;
    slot.hitNotified = false;
  }

  private warmStart(seconds: number): void {
    const dt = 1 / 120;
    const steps = Math.round(seconds / dt);
    for (let i = 0; i < steps; i++) {
      this.stepInternal(dt, false);
    }
    // Reset external narrative clock & event queue so t=0 begins seamlessly with water already flowing!
    this.simTime = 0;
    this.pendingEvents.length = 0;
    this.lastBellStrikeTime = -10;
    this.lastDrumStrikeTime = -10;
    this.lastCatchTime = -10;
    this.lastLiftTime = -10;
    this.lastGearTime = -10;
    this.lastDropletSoundTime = -10;
  }

  public step(dt: number): void {
    this.stepInternal(dt, true);
  }

  private stepInternal(dt: number, emitEvents: boolean): void {
    this.simTime += dt;

    // 1. Constant-rate water droplet emission from 平水壶 (~3.4 droplets/sec -> majestic ~3.6s rhythm!)
    const spawnInterval = 0.295;
    this.spawnAccum += dt;
    while (this.spawnAccum >= spawnInterval) {
      this.spawnAccum -= spawnInterval;
      this.spawnDroplet();
    }

    // 2. Step Rapier3D physics world!
    this.world.integrationParameters.dt = dt;
    this.world.step(this.eventQueue);

    // 3. Process real Rapier3D collision events for procedural audio & visual effects
    if (emitEvents) {
      this.eventQueue.drainCollisionEvents((h1, h2, started) => {
        if (!started) return;
        const t1 = this.colliderTags.get(h1);
        const t2 = this.colliderTags.get(h2);
        if (!t1 || !t2) return;

        // Bell strike (Mallet <-> Hanging Bronze Bell)
        if ((t1 === 'bell' && t2 === 'bell_mallet') || (t2 === 'bell' && t1 === 'bell_mallet')) {
          if (this.simTime - this.lastBellStrikeTime > 0.45) {
            this.lastBellStrikeTime = this.simTime;
            const v = this.bellStrikerBody.angvel();
            const intensity = Math.min(1, Math.max(0.35, Math.abs(v.y) * 0.22));
            this.pendingEvents.push({
              type: 'bell_strike',
              intensity,
              position: { x: LAYOUT.BELL_PIVOT.x, y: LAYOUT.BELL_PIVOT.y - 0.52, z: LAYOUT.BELL_PIVOT.z },
            });
          }
          return;
        }

        // Drum strike (Mallet <-> Red Ceremonial Drum)
        if ((t1 === 'drum' && t2 === 'drum_mallet') || (t2 === 'drum' && t1 === 'drum_mallet')) {
          if (this.simTime - this.lastDrumStrikeTime > 0.45) {
            this.lastDrumStrikeTime = this.simTime;
            const v = this.drumStrikerBody.angvel();
            const intensity = Math.min(1, Math.max(0.4, Math.abs(v.y) * 0.22));
            this.pendingEvents.push({
              type: 'drum_strike',
              intensity,
              position: { ...LAYOUT.DRUM_POS },
            });
          }
          return;
        }

        // Escapement Lock Catch (Spoke <-> 左天锁)
        if ((t1 === 'spoke' && t2 === 'upper_lock') || (t2 === 'spoke' && t1 === 'upper_lock')) {
          const wSpeed = Math.abs(this.waterwheelBody.angvel().z);
          if (wSpeed > 0.14 && this.simTime - this.lastCatchTime > 0.7) {
            this.lastCatchTime = this.simTime;
            this.pendingEvents.push({
              type: 'latch_catch',
              intensity: Math.min(1, wSpeed * 0.9),
              position: { x: 0.62, y: 4.30, z: 0.45 },
            });
          }
          return;
        }

        // Gear Engagement (Driving Pinwheel <-> 天柱 Crown Gear)
        if ((t1 === 'drive_peg' && t2 === 'crown_peg') || (t2 === 'drive_peg' && t1 === 'crown_peg')) {
          const wSpeed = Math.abs(this.waterwheelBody.angvel().z);
          if (wSpeed > 0.18 && this.simTime - this.lastGearTime > 0.85) {
            this.lastGearTime = this.simTime;
            this.pendingEvents.push({
              type: 'gear_engage',
              intensity: Math.min(1, wSpeed * 0.7),
              position: { x: LAYOUT.TIANZHU_X, y: LAYOUT.CROWN_GEAR_Y + 0.12, z: LAYOUT.DRIVE_GEAR_Z },
            });
          }
          return;
        }

        // Water Droplet landing inside Scoop
        if (
          (t1.startsWith('drop_') && t2.startsWith('scoop_')) ||
          (t2.startsWith('drop_') && t1.startsWith('scoop_'))
        ) {
          if (this.simTime - this.lastDropletSoundTime > 0.16) {
            this.lastDropletSoundTime = this.simTime;
            this.pendingEvents.push({
              type: 'droplet',
              intensity: 0.35 + this.rand() * 0.35,
              position: { x: 1.88, y: 3.30, z: 0.72 },
            });
          }
        }
      });
    } else {
      this.eventQueue.clear();
    }

    // 4. Track real upper beam lift event (for crisp wooden latch-release click sound)
    const upperAngle = this.getBodyAngleZ(this.upperBeamBody);
    const isLifted = upperAngle < -0.14;
    if (isLifted && !this.wasLatchLifted && emitEvents && this.simTime - this.lastLiftTime > 1.2) {
      this.lastLiftTime = this.simTime;
      this.pendingEvents.push({
        type: 'latch_lift',
        intensity: 0.7,
        position: { x: 0.65, y: 4.42, z: 0.45 },
      });
    }
    this.wasLatchLifted = isLifted;

    // 5. Update cumulative rotation angles & scoop fill counters (purely observational!)
    const wrapDelta = (d: number): number => {
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    };
    const curWheel = this.getBodyAngleZ(this.waterwheelBody);
    this.wheelAngleAccum += -wrapDelta(curWheel - this.prevWheelAngle);
    this.prevWheelAngle = curWheel;
    this.tickCount = Math.max(0, Math.round(this.wheelAngleAccum / (Math.PI / 6)));

    const curTZ = this.getBodyAngleY(this.tianZhuBody);
    this.tianZhuAngleAccum += -wrapDelta(curTZ - this.prevTianZhuAngle);
    this.prevTianZhuAngle = curTZ;

    const curGlobe = this.getBodyAngleX(this.globeBody);
    this.globeAngleAccum += wrapDelta(curGlobe - this.prevGlobeAngle);
    this.prevGlobeAngle = curGlobe;

    // 6. Recycle droplets that emptied into the lower drainage basin & count real droplets per scoop
    this.scoopFillCount.fill(0);
    for (let i = 0; i < this.droplets.length; i++) {
      const d = this.droplets[i];
      if (!d.active) continue;
      d.age += dt;
      const p = d.body.translation();
      // Recycle once settled in drainage pool or escaped far away
      if (p.y < 0.72 || p.y > 5.0 || Math.abs(p.x - 1.0) > 4.2 || d.age > 24.0) {
        if (p.y < 0.64 && d.age > 0.6) {
          d.active = false;
          d.body.setEnabled(false);
          d.body.setTranslation({ x: 0, y: -10 - i * 0.1, z: 0 }, false);
          continue;
        }
        if (d.age > 24.0 || p.y < 0.2) {
          d.active = false;
          d.body.setEnabled(false);
          continue;
        }
      }

      // Check which scoop cavity currently contains this real droplet (for visual meniscus shader!)
      let bestScoop = -1;
      let bestDistSq = 0.085; // ~0.29m radius around scoop cavity center
      for (let s = 0; s < this.scoopBodies.length; s++) {
        const sb = this.scoopBodies[s];
        const sp = sb.translation();
        const sq = sb.rotation();
        // Cavity center is local (0.28, 0.02, 0) rotated by sq
        const angle = 2 * Math.atan2(sq.z, sq.w);
        const cx = sp.x + Math.cos(angle) * 0.28 - Math.sin(angle) * 0.02;
        const cy = sp.y + Math.sin(angle) * 0.28 + Math.cos(angle) * 0.02;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dz = p.z - sp.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < bestDistSq) {
          bestDistSq = distSq;
          bestScoop = s;
        }
      }
      d.inScoopIndex = bestScoop;
      if (bestScoop >= 0) {
        this.scoopFillCount[bestScoop]++;
      }
    }
  }

  public getCurrentShichen(): string {
    const idx = ((this.tickCount % 12) + 12) % 12;
    return SHICHEN_NAMES[idx];
  }

  public getBodyAngleZ(body: RAPIER.RigidBody): number {
    const q = body.rotation();
    return 2 * Math.atan2(q.z, q.w);
  }

  public getBodyAngleY(body: RAPIER.RigidBody): number {
    const q = body.rotation();
    return 2 * Math.atan2(q.y, q.w);
  }

  public getBodyAngleX(body: RAPIER.RigidBody): number {
    const q = body.rotation();
    return 2 * Math.atan2(q.x, q.w);
  }

  private quatFromAxisAngle(ax: number, ay: number, az: number, angle: number): RAPIER.Rotation {
    const half = angle * 0.5;
    const s = Math.sin(half);
    return { x: ax * s, y: ay * s, z: az * s, w: Math.cos(half) };
  }

  public dispose(): void {
    this.eventQueue.free();
    this.world.free();
  }
}

import * as THREE from 'three';
import { box, roundBox, cylinder, torus, tube, mesh, anchor, bakeGroup, makeDialMaterial } from './scene.js';

const Z = { x: 0, y: 0, z: 1 };
const Y = { x: 0, y: 1, z: 0 };
const ZERO = { x: 0, y: 0, z: 0 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const qz = a => ({ x: 0, y: 0, z: Math.sin(a / 2), w: Math.cos(a / 2) });
const qx = a => ({ x: Math.sin(a / 2), y: 0, z: 0, w: Math.cos(a / 2) });

/**
 * Every moving mechanical mesh below is bound to a dynamic Rapier body.
 * Meshes are assembled once, then only read transforms from the physics world.
 * Rapier has no gear joint: meshing gears and the right-angle drive use a
 * velocity-constraint impulse (with reaction on both bodies), never an angle.
 */
export class Clockwork {
  constructor(RAPIER, scene, M) {
    this.R = RAPIER;
    this.scene = scene;
    this.M = M;
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = 1 / 60;
    this.events = new RAPIER.EventQueue(true);
    this.support = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    this.bindings = [];
    this.drops = [];
    this.dropCapacity = 96;
    this.simTime = 0;
    this.spawnClock = 0;
    this.lastStrike = -10;
    this.lastTick = -10;
    this.strikes = 0;
    this.ticks = 0;
    this.anchors = {};
    this.colliderTags = new Map();
    this.staticGroup = new THREE.Group();
    scene.add(this.staticGroup);

    this.buildWaterSupply();
    this.buildWheel();
    this.buildEscapement();
    this.buildGearTrain();
    this.buildReporting();
    this.buildArmillary();
    bakeGroup(this.staticGroup);
    for (const b of this.bindings) bakeGroup(b.mesh);
    this.buildDrops();
  }

  body(x, y, z, damping = 0.1) {
    const desc = this.R.RigidBodyDesc.dynamic()
      .setTranslation(x, y, z)
      .setAngularDamping(damping)
      .setLinearDamping(0.1)
      .setCanSleep(false)
      .setCcdEnabled(false);
    const body = this.world.createRigidBody(desc);
    const group = new THREE.Group();
    this.scene.add(group);
    this.bindings.push({ body, mesh: group });
    return { body, group };
  }

  hinge(body, x, y, z, axis = Z, limits = null) {
    const data = this.R.JointData.revolute({ x, y, z }, ZERO, axis);
    const joint = this.world.createImpulseJoint(data, this.support, body, true);
    joint.setContactsEnabled(false);
    if (limits) joint.setLimits(limits[0], limits[1]);
    return joint;
  }

  cuboid(body, size, pos = ZERO, rotation = null, density = 1, sensor = false) {
    const d = this.R.ColliderDesc.cuboid(size[0] / 2, size[1] / 2, size[2] / 2)
      .setTranslation(pos.x, pos.y, pos.z)
      .setDensity(density)
      .setFriction(0.55)
      .setRestitution(0.02)
      .setSensor(sensor);
    if (rotation) d.setRotation(rotation);
    return this.world.createCollider(d, body);
  }

  cylinderCollider(body, radius, halfHeight, pos = ZERO, rotation = null, density = 1) {
    const d = this.R.ColliderDesc.cylinder(halfHeight, radius)
      .setTranslation(pos.x, pos.y, pos.z)
      .setDensity(density)
      .setFriction(0.5);
    if (rotation) d.setRotation(rotation);
    return this.world.createCollider(d, body);
  }

  buildWaterSupply() {
    const g = this.staticGroup, M = this.M;
    // Elevated constant-head tank and an open wooden spout.
    for (const x of [-2.82, -2.1]) for (const z of [-0.43, 0.43]) {
      box(g, 0.11, 3.25, 0.11, M.woodDark, x, 2.23, z);
      box(g, 0.19, 0.09, 0.19, M.bronze, x, 3.83, z);
    }
    roundBox(g, 1.18, 0.16, 1.12, M.woodDark, -2.46, 3.91, 0, 0.035);
    box(g, 1.16, 0.52, 0.09, M.wood, -2.46, 4.22, -0.52);
    box(g, 0.09, 0.52, 1.12, M.wood, -3.0, 4.22, 0);
    box(g, 0.09, 0.52, 1.12, M.wood, -1.92, 4.22, 0);
    box(g, 1.18, 0.33, 0.09, M.woodLight, -2.46, 4.12, 0.52);
    box(g, 1.01, 0.035, 0.91, M.water, -2.46, 4.4, 0);
    for (const y of [4.02, 4.37]) {
      box(g, 1.24, 0.045, 1.18, M.bronze, -2.46, y, 0);
    }
    // A narrow overflow lip communicates the constant water level.
    tube(g, [[-2.97, 4.35, -0.22], [-3.14, 4.31, -0.22], [-3.17, 3.85, -0.22]], 0.045, M.copper, 12);
    tube(g, [[-1.96, 4.15, 0], [-1.79, 4.1, 0], [-1.76, 3.98, 0]], 0.095, M.woodLight, 12);
    cylinder(g, 0.115, 0.12, M.bronze, -1.76, 4.03, 0, 16);

    this.streamMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x73e4d8) } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: 'uniform float uTime;uniform vec3 uColor;varying vec2 vUv;void main(){float a=.32+.18*sin((vUv.y-uTime*1.8)*55.0);gl_FragColor=vec4(uColor,a);}',
    });
    const stream = mesh(g, new THREE.CylinderGeometry(0.032, 0.055, 0.72, 10, 1, true), this.streamMaterial, -1.76, 3.63, 0);
    stream.userData.noBake = true;
    stream.castShadow = false;
    this.anchors.tank = anchor(this.scene, -2.48, 4.43, 0.55);
    this.anchors.cup = anchor(this.scene, -1.83, 3.23, 0.35);
  }

  buildWheel() {
    const { body, group } = this.body(-0.95, 2.1, 0, 0.16);
    this.wheel = body; this.wheelMesh = group;
    const M = this.M;
    // Bronze axle and two wooden rims.
    const axle = cylinder(group, 0.16, 1.25, M.bronze, 0, 0, 0.18, 32);
    axle.rotation.x = Math.PI / 2;
    this.cylinderCollider(body, 0.17, 0.32, ZERO, qx(Math.PI / 2), 4);
    for (const z of [-0.25, 0.25]) {
      torus(group, 1.25, 0.075, M.woodLight, 0, 0, z, 8, 72);
      torus(group, 0.31, 0.045, M.bronze, 0, 0, z, 6, 32);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        box(group, 0.085, 1.08, 0.09, i % 3 === 0 ? M.bronze : M.wood, Math.cos(a) * 0.67, Math.sin(a) * 0.67, z, a - Math.PI / 2);
      }
    }
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      this.cuboid(body, [0.1, 1.1, 0.42], { x: Math.cos(a) * 0.65, y: Math.sin(a) * 0.65, z: 0 }, qz(a - Math.PI / 2), 2.2);
    }
    // Eighteen real cup/paddle colliders receive the falling water parcels.
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2;
      const r = 1.37;
      const part = new THREE.Group();
      part.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      part.rotation.z = a - Math.PI / 2;
      group.add(part);
      box(part, 0.4, 0.09, 0.58, M.woodLight, 0, 0, 0);
      box(part, 0.055, 0.22, 0.58, M.wood, -0.18, 0.07, 0);
      box(part, 0.055, 0.22, 0.58, M.wood, 0.18, 0.07, 0);
      box(part, 0.4, 0.15, 0.055, M.copper, 0, 0.08, -0.27);
      this.cuboid(body, [0.4, 0.11, 0.58], { x: Math.cos(a) * r, y: Math.sin(a) * r, z: 0 }, qz(a - Math.PI / 2), 2.2);
      for (const t of [-0.18, 0.18]) {
        const tangentX = Math.sin(a) * t, tangentY = -Math.cos(a) * t;
        this.cuboid(body, [0.055, 0.22, 0.58], { x: Math.cos(a) * r + tangentX, y: Math.sin(a) * r + tangentY, z: 0 }, qz(a - Math.PI / 2), 1.2);
      }
    }
    this.hinge(body, -0.95, 2.1, 0);
    this.addGear(body, group, 18, 0.765, 0.65, 0, this.M.bronze);
    this.anchors.axle = anchor(group, 0, 0, 0.82);

    // Fixed axle bearings remain behind the cutaway.
    const bearing = cylinder(this.staticGroup, 0.25, 0.18, this.M.woodDark, -0.95, 2.1, -0.62, 16);
    bearing.rotation.x = Math.PI / 2;
  }

  buildEscapement() {
    const { body, group } = this.body(-0.85, 4.22, 1.12, 0.36);
    this.escape = body; this.escapeMesh = group;
    const M = this.M;
    roundBox(group, 2.12, 0.11, 0.16, M.woodLight, 0, 0, 0, 0.025);
    box(group, 0.13, 0.57, 0.28, M.bronze, 0.78, -0.28, 0);
    box(group, 0.19, 0.12, 0.34, M.red, 0.78, -0.56, 0);
    roundBox(group, 0.35, 0.38, 0.35, M.gold, 0.89, 0.25, 0, 0.045);
    cylinder(group, 0.11, 0.42, M.bronze, -0.86, 0.14, 0, 16);
    const pivot = cylinder(group, 0.14, 0.42, M.gold, 0, 0, 0, 20);
    pivot.rotation.x = Math.PI / 2;
    this.cuboid(body, [2.12, 0.11, 0.16], ZERO, null, 1.8);
    this.cuboid(body, [0.14, 0.62, 0.3], { x: 0.78, y: -0.3, z: 0 }, null, 2.2, true);
    const roundedPawl = this.R.ColliderDesc.ball(0.14).setTranslation(0.78, -0.48, 0).setDensity(2.2).setFriction(0.24).setRestitution(0.03).setSensor(true);
    this.world.createCollider(roundedPawl, body);
    this.cuboid(body, [0.35, 0.38, 0.35], { x: 0.89, y: 0.25, z: 0 }, null, 6);
    this.hinge(body, -0.85, 4.22, 1.12, Z, [-0.17, 0.42]);
    this.anchors.escape = anchor(group, -0.35, 0.05, 0.15);
    this.anchors.pawl = anchor(group, 0.78, -0.47, 0.16);
    this.anchors.weight = anchor(group, 0.89, 0.25, 0.15);

    const support = box(this.staticGroup, 0.16, 0.8, 0.2, M.woodDark, -0.85, 4.5, 0.87);
    support.rotation.z = 0;
  }

  addGear(body, group, teeth, radius, z, phase = 0, material = this.M.bronze) {
    const depth = 0.16;
    const root = cylinder(group, radius * 0.86, depth, material, 0, 0, z, 48);
    root.rotation.x = Math.PI / 2;
    this.cylinderCollider(body, radius * 0.82, depth / 2, { x: 0, y: 0, z }, qx(Math.PI / 2), 3.2);
    torus(group, radius * 0.69, 0.018, this.M.gold, 0, 0, z + depth / 2 + 0.006, 5, 48);
    torus(group, radius * 0.25, 0.025, this.M.copper, 0, 0, z + depth / 2 + 0.01, 5, 32);
    const toothWidth = Math.PI * 2 * radius / teeth * 0.44;
    for (let i = 0; i < teeth; i++) {
      const a = phase + i / teeth * Math.PI * 2;
      const r = radius + 0.025;
      box(group, toothWidth, 0.14, depth + 0.015, material, Math.cos(a) * r, Math.sin(a) * r, z, a - Math.PI / 2);
      // Sensor teeth contribute inertia but do not fight the ideal gear joint.
      this.cuboid(body, [toothWidth, 0.14, depth], { x: Math.cos(a) * r, y: Math.sin(a) * r, z }, qz(a - Math.PI / 2), 0.35, true);
    }
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      box(group, 0.055, radius * 1.3, 0.025, this.M.gold, 0, 0, z + depth / 2 + 0.018, a);
    }
    const hub = cylinder(group, 0.11, depth + 0.13, this.M.copper, 0, 0, z, 20);
    hub.rotation.x = Math.PI / 2;
  }

  gearPair(a, b, teethA, teethB, axisA = 'z', axisB = 'z') {
    this.gearPairs.push({ a, b, teethA, teethB, axisA, axisB });
  }

  buildGearTrain() {
    this.gearPairs = [];
    const gears = [];
    const specs = [
      ['B', 0.37, 2.1, 0.65],
      ['C', 0.37, 3.42, 0.97],
      ['D', 0.37, 4.74, 0.65],
      ['E', 0.37, 6.06, -0.05],
    ];
    for (const [name, x, y, z] of specs) {
      const { body, group } = this.body(x, y, z, 0.075);
      this.hinge(body, x, y, z);
      gears.push({ name, body, group });
    }
    const [B, C, D, E] = gears;
    this.gearB = B.body; this.gearC = C.body; this.timing = D.body; this.gearE = E.body;
    this.timingMesh = D.group;

    this.addGear(B.body, B.group, 12, 0.51, 0, Math.PI + Math.PI / 12, this.M.copper);
    this.addGear(B.body, B.group, 12, 0.51, 0.32, Math.PI / 2, this.M.bronze);
    this.addGear(C.body, C.group, 18, 0.765, 0, -Math.PI / 2 + Math.PI / 18, this.M.bronze);
    this.addGear(C.body, C.group, 12, 0.51, -0.32, Math.PI / 2, this.M.copper);
    this.addGear(D.body, D.group, 18, 0.765, 0, -Math.PI / 2 + Math.PI / 18, this.M.bronze);
    this.addGear(D.body, D.group, 12, 0.51, -0.70, Math.PI / 2, this.M.copper);
    this.addGear(E.body, E.group, 18, 0.765, 0, -Math.PI / 2 + Math.PI / 18, this.M.bronze);

    this.gearPair(this.wheel, B.body, 18, 12);
    this.gearPair(B.body, C.body, 12, 18);
    this.gearPair(C.body, D.body, 12, 18);
    this.gearPair(D.body, E.body, 12, 18);

    // Twelve visible timing pegs. Their cam contact is solved as a torque below.
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const x = Math.cos(a) * 1.04, y = Math.sin(a) * 1.04;
      const peg = cylinder(D.group, 0.048, 0.25, i === 6 ? this.M.red : this.M.gold, x, y, 0.28, 12);
      peg.rotation.x = Math.PI / 2;
      this.cuboid(D.body, [0.1, 0.1, 0.24], { x, y, z: 0.28 }, qz(a), 0.5, true);
    }
    const dial = mesh(D.group, new THREE.CircleGeometry(0.98, 72), makeDialMaterial(), 0, 0, 0.14);
    dial.castShadow = false;
    torus(D.group, 1.0, 0.035, this.M.gold, 0, 0, 0.15, 8, 72);
    const center = cylinder(D.group, 0.13, 0.65, this.M.gold, 0, 0, 0.28, 24);
    center.rotation.x = Math.PI / 2;

    this.anchors.gears = anchor(C.group, 0, 0, 0.25);
    this.anchors.timing = anchor(D.group, -0.25, 0.32, 0.35);
    this.anchors.timingContact = anchor(this.scene, 1.32, 4.74, 1.0);
  }

  buildReporting() {
    const M = this.M, g = this.staticGroup;
    // Drum and its actual collision surface.
    const drumBody = this.world.createRigidBody(this.R.RigidBodyDesc.fixed().setTranslation(2.28, 4.48, 0.93));
    const drumCollider = this.world.createCollider(this.R.ColliderDesc.cylinder(0.21, 0.34).setActiveEvents(this.R.ActiveEvents.COLLISION_EVENTS), drumBody);
    this.colliderTags.set(drumCollider.handle, 'drum');
    cylinder(g, 0.34, 0.4, M.red, 2.28, 4.48, 0.93, 32);
    cylinder(g, 0.355, 0.035, M.cream, 2.28, 4.695, 0.93, 32);
    cylinder(g, 0.36, 0.04, M.bronze, 2.28, 4.27, 0.93, 32);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      cylinder(g, 0.018, 0.025, M.gold, 2.28 + Math.cos(a) * 0.29, 4.72, 0.93 + Math.sin(a) * 0.29, 8);
    }
    box(g, 0.75, 0.09, 0.72, M.woodDark, 2.28, 3.94, 0.93);
    for (const x of [2.02, 2.54]) box(g, 0.07, 0.38, 0.07, M.wood, x, 4.05, 0.93, x < 2.28 ? -0.35 : 0.35);

    // A small wooden automaton behind the drum.
    const robe = mesh(g, new THREE.CylinderGeometry(0.14, 0.25, 0.65, 12), M.red, 2.28, 4.35, 0.15);
    robe.castShadow = true;
    roundBox(g, 0.34, 0.36, 0.25, M.woodLight, 2.28, 4.78, 0.15, 0.06);
    mesh(g, new THREE.SphereGeometry(0.17, 20, 14), M.cream, 2.28, 5.1, 0.15);
    cylinder(g, 0.19, 0.08, M.ink, 2.28, 5.27, 0.15, 16);
    box(g, 0.26, 0.13, 0.18, M.ink, 2.28, 5.34, 0.15);
    for (const x of [2.2, 2.36]) mesh(g, new THREE.SphereGeometry(0.014, 8, 6), M.ink, x, 5.13, 0.307);

    const { body, group } = this.body(1.62, 4.87, 0.93, 0.12);
    this.reportLever = body; this.reportLeverMesh = group;
    roundBox(group, 1.32, 0.075, 0.12, M.woodLight, 0.04, 0, 0, 0.018);
    box(group, 0.11, 0.25, 0.18, M.bronze, -0.52, -0.035, 0);
    box(group, 0.28, 0.16, 0.2, M.red, 0.35, 0, 0);
    const mallet = mesh(group, new THREE.SphereGeometry(0.125, 20, 14), M.woodDark, 0.66, 0, 0);
    mallet.castShadow = true;
    cylinder(group, 0.09, 0.32, M.gold, 0, 0, 0, 16).rotation.x = Math.PI / 2;
    this.cuboid(body, [1.32, 0.075, 0.12], { x: 0.04, y: 0, z: 0 }, null, 1.4);
    this.cuboid(body, [0.11, 0.25, 0.18], { x: -0.52, y: -0.035, z: 0 }, null, 1.2);
    const mc = this.world.createCollider(this.R.ColliderDesc.ball(0.125).setTranslation(0.66, 0, 0).setDensity(28).setActiveEvents(this.R.ActiveEvents.COLLISION_EVENTS), body);
    this.colliderTags.set(mc.handle, 'mallet');
    this.hinge(body, 1.62, 4.87, 0.93, Z, [-0.5, 0.4]);
    this.anchors.hammer = anchor(group, 0.62, 0.02, 0.1);
    this.anchors.drum = anchor(this.scene, 2.28, 4.7, 0.96);
    const bearing = cylinder(g, 0.14, 0.45, M.woodDark, 1.62, 4.87, 0.68, 16);
    bearing.rotation.x = Math.PI / 2;
  }

  buildArmillary() {
    const M = this.M, g = this.staticGroup;
    // Upper pavilion pedestal and the fixed outer meridian ring.
    cylinder(g, 0.78, 0.16, M.woodDark, 0.37, 6.99, 0.65, 48);
    cylinder(g, 0.59, 0.28, M.bronze, 0.37, 7.19, 0.65, 40);
    cylinder(g, 0.43, 0.18, M.ink, 0.37, 7.42, 0.65, 40);
    for (const x of [-0.43, 0.43]) {
      tube(g, [[0.37 + x, 7.35, 0.65], [0.37 + x * 1.4, 7.66, 0.65], [0.37 + x * 1.5, 8.02, 0.65]], 0.055, M.bronze, 18);
    }
    torus(g, 1.34, 0.045, M.bronze, 0.37, 8.65, 0.65, 8, 96);
    torus(g, 1.4, 0.018, M.gold, 0.37, 8.65, 0.65, 6, 96);
    cylinder(g, 0.1, 0.35, M.gold, 0.37, 10.08, 0.65, 16);

    // One rigid vertical shaft carries the bevel wheel and inner sphere.
    const { body, group } = this.body(0.37, 7.3, 0.65, 0.09);
    this.shaft = body; this.shaftMesh = group;
    this.hinge(body, 0.37, 7.3, 0.65, Y);
    cylinder(group, 0.065, 2.72, M.bronze, 0, 0, 0, 20);
    for (const y of [-0.85, -0.25, 0.35]) cylinder(group, 0.105, 0.1, M.gold, 0, y, 0, 16);
    this.cylinderCollider(body, 0.075, 1.36, ZERO, null, 3.5);
    const lowerBevel = mesh(group, new THREE.CylinderGeometry(0.12, 0.48, 0.3, 24), M.copper, 0, -1.24, 0);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      box(group, 0.09, 0.12, 0.09, M.gold, Math.cos(a) * 0.38, -1.36, Math.sin(a) * 0.38, -a);
    }
    this.cylinderCollider(body, 0.4, 0.12, { x: 0, y: -1.24, z: 0 }, null, 2.2);

    const sphere = new THREE.Group(); sphere.position.y = 1.35; group.add(sphere);
    const equator = torus(sphere, 1.13, 0.035, M.gold); equator.rotation.x = Math.PI / 2;
    const ecliptic = torus(sphere, 1.19, 0.047, M.bronze); ecliptic.rotation.x = Math.PI / 2 - 0.408; ecliptic.rotation.z = 0.408;
    const meridian = torus(sphere, 1.09, 0.032, M.gold); meridian.rotation.y = Math.PI / 2;
    const diagonal = torus(sphere, 0.93, 0.027, M.copper); diagonal.rotation.set(0.72, 0.3, 0.408);
    const sight = cylinder(sphere, 0.055, 2.75, M.copper, 0, 0, 0, 16); sight.rotation.z = -0.408;
    for (const y of [-1.38, 1.38]) mesh(sphere, new THREE.SphereGeometry(0.095, 16, 10), M.gold, Math.sin(-0.408) * -y, Math.cos(-0.408) * y, 0);
    mesh(sphere, new THREE.SphereGeometry(0.19, 20, 14), M.ink, 0, 0, 0);
    const globeRing = torus(sphere, 0.22, 0.018, M.gold); globeRing.rotation.x = Math.PI / 2;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      mesh(sphere, new THREE.SphereGeometry(0.034, 8, 6), i % 3 === 0 ? M.red : M.gold, Math.cos(a) * 1.13, 0, Math.sin(a) * 1.13);
    }
    // Inertia of the observing instrument, approximated by a compact hub.
    this.cylinderCollider(body, 0.24, 0.18, { x: 0, y: 1.35, z: 0 }, null, 4);

    const eMount = this.bindings.find(b => b.body === this.gearE).mesh;
    const eAxle = cylinder(eMount, 0.07, 0.78, M.bronze, 0, 0, 0.35, 16);
    eAxle.rotation.x = Math.PI / 2;
    const eBevel = mesh(eMount, new THREE.CylinderGeometry(0.12, 0.46, 0.3, 24), M.copper, 0, 0, 0.70);
    eBevel.rotation.x = Math.PI / 2;
    this.gearPair(this.gearE, this.shaft, 1, 1, 'z', 'y');
    this.anchors.shaft = anchor(group, 0, -0.15, 0.12);
    this.anchors.bevel = anchor(this.scene, 0.37, 6.06, 0.65);
    this.anchors.armillary = anchor(group, 0, 1.35, 0.2);
  }

  buildDrops() {
    this.dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), this.M.waterDrop, this.dropCapacity);
    this.dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dropMesh.count = 0;
    this.dropMesh.castShadow = false;
    this.dropMesh.frustumCulled = false;
    this.scene.add(this.dropMesh);
  }

  spawnDrop() {
    if (this.drops.length >= this.dropCapacity) return;
    const i = this.drops.length + Math.floor(this.simTime * 13);
    const jitter = Math.sin(i * 12.9898) * 0.035;
    const body = this.world.createRigidBody(this.R.RigidBodyDesc.dynamic()
      .setTranslation(-1.76 + jitter, 3.98, Math.cos(i * 4.13) * 0.045)
      .setLinvel(0.06, -0.35, 0)
      .setLinearDamping(0.03)
      .setCcdEnabled(true)
      .setCanSleep(false));
    this.world.createCollider(this.R.ColliderDesc.ball(0.061)
      .setDensity(0.65)
      .setFriction(0.35)
      .setRestitution(0.08), body);
    this.drops.push({ body, radius: 0.052 + (i % 4) * 0.007 });
  }

  solveGear(pair) {
    const { a, b, teethA, teethB, axisA, axisB } = pair;
    const va = a.angvel(), vb = b.angvel();
    const c = va[axisA] * teethA + vb[axisB] * teethB;
    const inertiaA = a.effectiveWorldInvInertia(), inertiaB = b.effectiveWorldInvInertia();
    const diagonalA = axisA === 'x' ? 'm11' : axisA === 'y' ? 'm22' : 'm33';
    const diagonalB = axisB === 'x' ? 'm11' : axisB === 'y' ? 'm22' : 'm33';
    const ia = inertiaA[diagonalA], ib = inertiaB[diagonalB];
    const denom = teethA * teethA * ia + teethB * teethB * ib;
    if (denom < 1e-8) return;
    const impulse = -c / denom;
    const ta = { x: 0, y: 0, z: 0 }, tb = { x: 0, y: 0, z: 0 };
    ta[axisA] = impulse * teethA;
    tb[axisB] = impulse * teethB;
    a.applyTorqueImpulse(ta, true);
    b.applyTorqueImpulse(tb, true);
  }

  step(dt) {
    this.simTime += dt;
    this.spawnClock += dt;
    while (this.spawnClock >= 0.072) {
      this.spawnClock -= 0.072;
      this.spawnDrop();
    }
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const p = this.drops[i].body.translation();
      if (p.y < 0.7 || Math.abs(p.x) > 4.5 || Math.abs(p.z) > 2.5) {
        this.world.removeRigidBody(this.drops[i].body);
        this.drops.splice(i, 1);
      }
    }

    this.wheel.resetTorques(true);
    this.escape.resetTorques(true);
    this.reportLever.resetTorques(true);
    this.timing.resetTorques(true);
    let feed = 0;
    for (const d of this.drops) if (d.body.translation().y > 2.75) feed++;
    const wheelSpeed = this.wheel.angvel().z;
    // Continuous head-water torque complements the discrete drop collisions.
    // It falls with rim speed, just as the relative water/rim velocity does.
    const head = clamp(feed / 3, 0, 1);
    const hydraulicTorque = head * 5.5 * (1 - wheelSpeed / 0.68);
    this.wheel.addTorque({ x: 0, y: 0, z: hydraulicTorque }, true);

    // A conservative 18-detent cam potential models the locking pallets.
    // Its mate torque rocks the weighted lever; both are integrated by Rapier.
    const wq = this.wheel.rotation();
    const wa = 2 * Math.atan2(wq.z, wq.w);
    const camPhase = Math.sin(wa * 18);
    const lift = Math.max(0, camPhase);
    this.wheel.addTorque({ x: 0, y: 0, z: -3.8 * camPhase - 0.35 * lift }, true);
    this.escape.addTorque({ x: 0, y: 0, z: 18.0 * lift }, true);

    // The return spring is a torque law, never a positional animation.
    const rq = this.reportLever.rotation();
    const ra = 2 * Math.atan2(rq.z, rq.w);
    this.reportLever.addTorque({ x: 0, y: 0, z: -ra * 10 - this.reportLever.angvel().z * 0.85 }, true);
    const tq = this.timing.rotation();
    const ta = 2 * Math.atan2(tq.z, tq.w);
    const timingCam = Math.pow(Math.max(0, Math.sin(-ta * 12)), 2);
    this.reportLever.addTorque({ x: 0, y: 0, z: 7.0 * timingCam }, true);
    this.timing.addTorque({ x: 0, y: 0, z: 0.08 * timingCam }, true);

    // Sequential impulses propagate load both up and down the complete train.
    for (let iteration = 0; iteration < 10; iteration++) {
      for (const pair of this.gearPairs) this.solveGear(pair);
      for (let i = this.gearPairs.length - 1; i >= 0; i--) this.solveGear(this.gearPairs[i]);
    }
    this.world.step(this.events);

    this.events.drainCollisionEvents((h1, h2, started) => {
      if (!started) return;
      const pair = `${this.colliderTags.get(h1) ?? ''}/${this.colliderTags.get(h2) ?? ''}`;
      if ((pair.includes('drum') && pair.includes('mallet')) && this.simTime - this.lastStrike > 0.38) {
        this.lastStrike = this.simTime;
        this.strikes++;
        this.onStrike?.(clamp(Math.abs(this.reportLever.angvel().z) / 4, 0.35, 1));
      }
    });
    const eq = this.escape.rotation();
    const ea = 2 * Math.atan2(eq.z, eq.w);
    if (ea > -0.04 && (this.previousEscapeAngle ?? -1) <= -0.04 && this.simTime - this.lastTick > 0.24) {
      this.lastTick = this.simTime;
      this.ticks++;
      this.onTick?.();
    }
    this.previousEscapeAngle = ea;
    this.events.clear();
  }

  sync(time) {
    for (const { body, mesh } of this.bindings) {
      const p = body.translation(), q = body.rotation();
      mesh.position.set(p.x, p.y, p.z);
      mesh.quaternion.set(q.x, q.y, q.z, q.w);
    }
    const matrix = new THREE.Matrix4(), scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    this.dropMesh.count = Math.min(this.drops.length, this.dropCapacity);
    for (let i = 0; i < this.dropMesh.count; i++) {
      const d = this.drops[i], p = d.body.translation();
      scale.set(d.radius, d.radius * 1.45, d.radius);
      matrix.compose(new THREE.Vector3(p.x, p.y, p.z), quaternion, scale);
      this.dropMesh.setMatrixAt(i, matrix);
    }
    this.dropMesh.instanceMatrix.needsUpdate = true;
    this.streamMaterial.uniforms.uTime.value = time;
  }

  getStats() {
    const q = this.wheel.rotation(), tq = this.timing.rotation(), sq = this.shaft.rotation();
    return {
      simTime: this.simTime,
      bodies: this.world.bodies.len(),
      drops: this.drops.length,
      wheelSpeed: this.wheel.angvel().z,
      timingSpeed: this.timing.angvel().z,
      shaftSpeed: this.shaft.angvel().y,
      wheelAngle: 2 * Math.atan2(q.z, q.w),
      timingAngle: 2 * Math.atan2(tq.z, tq.w),
      shaftAngle: 2 * Math.atan2(sq.y, sq.w),
      strikes: this.strikes,
      ticks: this.ticks,
      escapeAngle: this.previousEscapeAngle ?? 0,
      reportAngle: 2 * Math.atan2(this.reportLever.rotation().z, this.reportLever.rotation().w),
      reportSpeed: this.reportLever.angvel().z,
    };
  }
}

import * as THREE from "three";
import { applyPose, idle, lerpPose, walk, type Pose } from "@agentbench/voxel-kit";
import { Actor, makeCollector, makeZhang, performFace } from "../characters";
import { CubeField } from "../particles";
import { ironMeteoriteGeo, magnifierGeo, mesh, microscopeGeo, stoneGeo, teacupGeo, teapotGeo, VM, VM_GLOSS } from "../props";
import { box, clamp, easeInOut, hash, lerp, rng, seg, smooth, std } from "../util";
import { activeSpeakers } from "./space";
import { planks, slab } from "./common";

const STONE_PALETTES = [
  [0x6a625a, 0x7a7068, 0x544c46, 0x8a8076],
  [0x2e2a28, 0x3a3532, 0x24211f, 0x4a443e],
  [0x5a6a3a, 0x7a8a4a, 0x3a3a30, 0x9a8a50],
  [0x1a1a1e, 0x2a2a30, 0x121216],
  [0x6a3a2a, 0x4a2a22, 0x7a4a36, 0x3a2420],
];

const TEA_TABLE = new THREE.Vector3(-0.8, 0, 0.4);
const COLLECTOR_SEAT = new THREE.Vector3(-1.8, 0, 0.4);
const ZHANG_SEAT = new THREE.Vector3(0.2, 0, 0.4);
const BENCH = new THREE.Vector3(2.5, 0, -2.15);

export class RoomSet {
  readonly group = new THREE.Group();
  readonly zhang: Actor;
  readonly collector: Actor;
  readonly irons: THREE.Mesh[] = [];
  private readonly shelfIrons: THREE.Mesh[] = [];
  private readonly teapot: THREE.Mesh;
  private readonly cupZ: THREE.Mesh;
  private readonly cupZHand: THREE.Mesh;
  private readonly cupC: THREE.Mesh;
  private readonly stoneHand: THREE.Mesh;
  private readonly ironHand: THREE.Mesh;
  private readonly phone: THREE.Mesh;
  private readonly pendant: THREE.PointLight;
  private readonly pendantBulb: THREE.MeshBasicMaterial;
  private readonly windowLight: THREE.DirectionalLight;
  private readonly hemi: THREE.HemisphereLight;
  private readonly radioDial: THREE.MeshBasicMaterial;
  private readonly radioLight: THREE.PointLight;
  private readonly fx: CubeField;
  private readonly windowGlow: THREE.MeshBasicMaterial;
  private readonly velvet: THREE.Mesh;

  constructor() {
    this.group.name = "set:room";
    const g = this.group;
    // Floor and walls.
    const floor = slab(28, 1, 22, 0.25, (x, _y, z) => planks(x, z));
    floor.position.set(-3.5, -0.25, -2.75);
    g.add(floor);
    const plaster = (x: number, y: number) => (y < 4 ? (x % 6 === 0 ? 0x4a3424 : 0x5a3e2a) : hash(Math.floor(x / 3), Math.floor(y / 3)) > 0.85 ? 0x9a8e7a : 0xb0a48e);
    const back = slab(28, 13, 1, 0.25, (x, y) => (x % 9 === 0 ? 0x3a2618 : plaster(x, y)));
    back.position.set(-3.5, 0, -3.0);
    g.add(back);
    const left = slab(1, 13, 22, 0.25, (_x, y, z) => {
      if (z >= 13 && z <= 19 && y >= 5 && y <= 10) return (z % 2 === 0 || y % 2 === 1) ? 0x3a2618 : null; // lattice window
      return z % 9 === 0 ? 0x3a2618 : plaster(z, y);
    });
    left.position.set(-3.75, 0, -2.75);
    g.add(left);
    const right = slab(1, 13, 22, 0.25, (_x, y, z) => (z % 9 === 0 ? 0x3a2618 : plaster(z, y)));
    right.position.set(3.5, 0, -2.75);
    g.add(right);
    const front = slab(28, 13, 1, 0.25, (x, y) => {
      if (x >= 21 && x <= 25 && y < 9) return null; // door opening
      if (x >= 4 && x <= 12 && y >= 5 && y <= 10) return (x % 2 === 0 || y % 2 === 1) ? 0x3a2618 : null;
      return x % 9 === 0 ? 0x3a2618 : plaster(x, y);
    });
    front.position.set(-3.5, 0, 2.75);
    g.add(front);
    const ceiling = slab(28, 1, 22, 0.25, (x, _y, z) => (z % 4 === 0 ? 0x2a1c12 : x % 2 ? 0x3a2a1c : 0x342518), false);
    ceiling.position.set(-3.5, 3.25, -2.75);
    g.add(ceiling);
    // Dusk behind the paper lattice.
    this.windowGlow = new THREE.MeshBasicMaterial({ color: 0x4a6a9a });
    box(0.05, 1.5, 1.75, this.windowGlow, [-3.85, 1.95, 1.65], g, false);
    box(2.2, 1.5, 0.05, this.windowGlow, [-1.5, 1.95, 3.1], g, false);

    // Glass cabinets.
    const r = rng(303);
    const cab = (x: number, z: number, rotY: number, seed: number, irons = false) => {
      const c = new THREE.Group();
      c.position.set(x, 0, z);
      c.rotation.y = rotY;
      g.add(c);
      const frame = slab(5, 9, 2, 0.25, (fx, fy, fz) => {
        if (fx === 0 || fx === 4 || fy === 0 || fy === 8) return 0x3a2416;
        if (fz === 0) return 0x2a1410; // back panel
        return null;
      });
      frame.position.set(-0.625, 0, -0.25);
      frame.scale.set(1, 1, 1);
      c.add(frame);
      const shelfMat = std(0x4a3020, { roughness: 0.6 });
      const stripMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0 });
      for (let s = 0; s < 3; s++) {
        const y = 0.55 + s * 0.52;
        box(0.75, 0.03, 0.4, shelfMat, [0, y, 0], c);
        box(0.7, 0.015, 0.02, stripMat, [0, y + 0.47, 0.17], c, false);
        const count = irons && s === 1 ? 3 : 3;
        for (let k = 0; k < count; k++) {
          const sx = -0.24 + k * 0.24;
          box(0.1, 0.025, 0.08, std(0x1a1a1a), [sx, y + 0.028, 0], c);
          if (irons && s === 1) {
            const m = mesh(ironMeteoriteGeo(500 + k, 12, 0.09), VM_GLOSS);
            m.position.set(sx, y + 0.09, 0);
            c.add(m);
            this.shelfIrons.push(m);
            // Tiny label card.
            box(0.05, 0.03, 0.005, std(0xe8e0cc), [sx, y + 0.03, 0.06], c, false);
            continue;
          }
          const pal = STONE_PALETTES[Math.floor(r() * STONE_PALETTES.length)];
          const sz = 0.05 + r() * 0.07;
          const m = mesh(stoneGeo(seed * 10 + s * 3 + k, sz, pal, 7), VM);
          m.position.set(sx, y + 0.04 + sz * 0.35, 0);
          m.rotation.y = r() * 3;
          c.add(m);
        }
      }
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.95, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xb8d0dc, transparent: true, opacity: 0.1, roughness: 0.05, metalness: 0.2, depthWrite: false }),
      );
      glass.position.set(0, 1.12, 0.24);
      c.add(glass);
      return c;
    };
    cab(-2.4, -2.5, 0, 1);
    cab(-1.05, -2.5, 0, 2);
    cab(0.3, -2.5, 0, 3, true);
    cab(-3.25, -1.0, Math.PI / 2, 4);
    cab(-3.25, 0.35, Math.PI / 2, 5);

    // Workbench, lamp, magnifier, microscope, specimens.
    box(1.5, 0.06, 0.75, std(0x5a3a22, { roughness: 0.7 }), [BENCH.x, 0.86, BENCH.z + 0.65], g);
    for (const [dx, dz] of [[-0.68, -0.3], [0.68, -0.3], [-0.68, 0.3], [0.68, 0.3]]) box(0.06, 0.86, 0.06, std(0x3a2616), [BENCH.x + dx, 0.43, BENCH.z + 0.65 + dz], g);
    const lampBase = box(0.14, 0.03, 0.14, std(0x1e2a22), [BENCH.x + 0.5, 0.905, BENCH.z + 0.5], g);
    void lampBase;
    box(0.025, 0.45, 0.025, std(0x2a2a2a), [BENCH.x + 0.5, 1.12, BENCH.z + 0.5], g);
    box(0.26, 0.08, 0.16, std(0x1f5a36, { roughness: 0.4, metalness: 0.2 }), [BENCH.x + 0.38, 1.33, BENCH.z + 0.62], g);
    box(0.2, 0.01, 0.1, new THREE.MeshBasicMaterial({ color: 0xfff0c8 }), [BENCH.x + 0.38, 1.285, BENCH.z + 0.62], g, false);
    const lamp = new THREE.SpotLight(0xffd8a0, 9, 4, 0.8, 0.5, 0);
    lamp.position.set(BENCH.x + 0.38, 1.28, BENCH.z + 0.62);
    lamp.target.position.set(BENCH.x + 0.1, 0.8, BENCH.z + 0.8);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.bias = -0.0005;
    g.add(lamp, lamp.target);
    const mag = mesh(magnifierGeo(), VM_GLOSS);
    mag.position.set(BENCH.x - 0.1, 0.9, BENCH.z + 0.75);
    mag.rotation.y = 0.5;
    g.add(mag);
    const micro = mesh(microscopeGeo(), VM);
    micro.position.set(BENCH.x - 0.6, 0.89, BENCH.z + 0.45);
    g.add(micro);
    for (let k = 0; k < 5; k++) {
      const m = mesh(stoneGeo(900 + k, 0.035 + k * 0.006, STONE_PALETTES[k % 5], 6), VM);
      m.position.set(BENCH.x - 0.2 + k * 0.1, 0.915, BENCH.z + 0.9);
      g.add(m);
    }
    // A steel safe and an old valve radio.
    const safe = slab(3, 4, 3, 0.2, (x, y, z) => (z === 2 && x === 1 && y === 2 ? 0x8a8e94 : 0x3a3e44));
    safe.position.set(2.9, 0, 1.4);
    g.add(safe);
    box(0.7, 0.7, 0.45, std(0x3a2616), [3.1, 0.35, -0.4], g);
    const radio = slab(9, 5, 4, 0.05, (x, y, z) => {
      if (z === 3 && y >= 1 && y <= 3 && x >= 1 && x <= 4) return (x + y) % 2 ? 0x2a1a10 : 0x6a4a2a;
      if (z === 3 && y === 2 && x >= 6 && x <= 7) return 0xd8b060;
      return 0x6a3a1e;
    });
    const radioPivot = new THREE.Group();
    radioPivot.position.set(2.95, 0.7, -0.45);
    radioPivot.rotation.y = 0.46;
    radio.position.set(-0.225, 0, -0.1);
    radioPivot.add(radio);
    g.add(radioPivot);
    this.radioLight = new THREE.PointLight(0xffa850, 0, 3.2, 0);
    this.radioLight.position.set(2.75, 0.95, -0.3);
    g.add(this.radioLight);
    this.radioDial = new THREE.MeshBasicMaterial({ color: 0x3a2a10 });
    box(0.08, 0.05, 0.01, this.radioDial, [0.12, 0.125, 0.105], radioPivot, false);

    // Tea table, two chairs, tea set.
    box(0.62, 0.05, 0.62, std(0x3a2214, { roughness: 0.5 }), [TEA_TABLE.x, 0.4, TEA_TABLE.z], g);
    for (const [dx, dz] of [[-0.27, -0.27], [0.27, -0.27], [-0.27, 0.27], [0.27, 0.27]]) box(0.05, 0.4, 0.05, std(0x2a180e), [TEA_TABLE.x + dx, 0.2, TEA_TABLE.z + dz], g);
    const chair = (p: THREE.Vector3, face: number) => {
      const c = new THREE.Group();
      c.position.copy(p);
      c.rotation.y = face;
      box(0.46, 0.05, 0.46, std(0x4a2a18), [0, 0.43, 0], c);
      box(0.46, 0.6, 0.05, std(0x4a2a18), [0, 0.75, -0.21], c);
      for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) box(0.04, 0.43, 0.04, std(0x2a180e), [dx, 0.215, dz], c);
      g.add(c);
    };
    chair(COLLECTOR_SEAT, Math.PI / 2);
    chair(ZHANG_SEAT, -Math.PI / 2);
    this.teapot = mesh(teapotGeo(), VM);
    g.add(this.teapot);
    this.cupZ = mesh(teacupGeo(), VM);
    this.cupZ.position.set(TEA_TABLE.x + 0.17, 0.425, TEA_TABLE.z + 0.16);
    g.add(this.cupZ);
    this.cupC = mesh(teacupGeo(), VM);
    this.cupC.position.set(TEA_TABLE.x - 0.27, 0.425, TEA_TABLE.z - 0.25);
    g.add(this.cupC);
    // Black velvet tray for the three irons.
    this.velvet = slab(18, 1, 8, 0.025, (x, _y, z) => ((x + z) % 7 === 0 ? 0x16131a : 0x0c0a0e));
    this.velvet.position.set(TEA_TABLE.x - 0.225, 0.425, TEA_TABLE.z - 0.1);
    g.add(this.velvet);
    for (let k = 0; k < 3; k++) {
      const m = mesh(ironMeteoriteGeo(500 + k, 12, 0.09), VM_GLOSS);
      m.position.set(TEA_TABLE.x - 0.13 + k * 0.13, 0.49, TEA_TABLE.z);
      m.rotation.y = k * 0.9;
      g.add(m);
      this.irons.push(m);
    }
    // Pendant lamp over the tea table.
    const shade = slab(4, 3, 4, 0.08, (x, y, z) => (y === 0 && x > 0 && x < 3 && z > 0 && z < 3 ? null : 0xd8b890), false);
    shade.position.set(TEA_TABLE.x - 0.16, 1.9, TEA_TABLE.z - 0.16);
    g.add(shade);
    this.pendantBulb = new THREE.MeshBasicMaterial({ color: 0xffe0a0 });
    box(0.1, 0.06, 0.1, this.pendantBulb, [TEA_TABLE.x, 1.9, TEA_TABLE.z], g, false);
    box(0.01, 1.1, 0.01, std(0x111111), [TEA_TABLE.x, 2.7, TEA_TABLE.z], g, false);
    this.pendant = new THREE.PointLight(0xffc888, 4, 5, 0);
    this.pendant.position.set(TEA_TABLE.x, 1.8, TEA_TABLE.z);
    g.add(this.pendant);

    // Cabinet lights and ambient.
    for (const [x, z, tx, tz] of [[-1.7, -1.0, -1.7, -2.6], [0.2, -1.0, 0.2, -2.6], [-2.2, -0.3, -3.3, -0.3]]) {
      const s = new THREE.SpotLight(0xfff0dc, 5, 5, 0.75, 0.6, 0);
      s.position.set(x, 3.0, z);
      s.target.position.set(tx, 1.0, tz);
      g.add(s, s.target);
    }
    this.hemi = new THREE.HemisphereLight(0x8a7a6a, 0x2a1a10, 0.35);
    g.add(this.hemi);
    this.windowLight = new THREE.DirectionalLight(0x8aa4d0, 0.8);
    this.windowLight.position.set(-6, 4, 6);
    this.windowLight.castShadow = true;
    this.windowLight.shadow.mapSize.set(1024, 1024);
    this.windowLight.shadow.camera.left = -5;
    this.windowLight.shadow.camera.right = 5;
    this.windowLight.shadow.camera.top = 5;
    this.windowLight.shadow.camera.bottom = -5;
    g.add(this.windowLight);

    // Cast.
    this.zhang = makeZhang();
    this.zhang.dress("coat");
    this.collector = makeCollector();
    g.add(this.zhang.root, this.collector.root);
    this.cupZHand = mesh(teacupGeo(), VM);
    this.cupZHand.scale.setScalar(1 / this.zhang.root.scale.x);
    this.cupZHand.position.set(-0.8, -0.6, 0.2);
    this.zhang.fig.anchors.handR.add(this.cupZHand);
    this.stoneHand = mesh(stoneGeo(77, 0.06, STONE_PALETTES[0], 7), VM);
    this.stoneHand.scale.setScalar(1 / this.collector.root.scale.x);
    this.stoneHand.position.set(0, 0.6, 1.0);
    this.collector.fig.anchors.handR.add(this.stoneHand);
    this.ironHand = mesh(ironMeteoriteGeo(502, 12, 0.09), VM_GLOSS);
    this.ironHand.scale.setScalar(1 / this.collector.root.scale.x);
    this.ironHand.position.set(0, 0.2, 1.4);
    this.collector.fig.anchors.handR.add(this.ironHand);
    this.phone = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 2.4), [std(0x111114), std(0x111114), new THREE.MeshBasicMaterial({ color: 0x9ad0ff }), std(0x111114), std(0x111114), std(0x111114)]);
    this.phone.position.set(0, 0.6, 1.2);
    this.zhang.fig.anchors.handR.add(this.phone);

    this.fx = new CubeField(300, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }), 1);
    g.add(this.fx.mesh);
  }

  update(t: number): void {
    const coda = t >= 336;
    const talk = activeSpeakers(t);
    this.updateLights(t, coda);
    this.updateCollector(t, coda, talk);
    this.updateZhang(t, coda, talk);
    this.updateProps(t, coda);
  }

  private updateLights(t: number, coda: boolean): void {
    this.pendant.intensity = coda ? 0 : 4;
    this.pendantBulb.color.setHex(coda ? 0x2a2218 : 0xffe0a0);
    this.windowLight.intensity = coda ? 0.25 : 0.8;
    this.windowLight.color.setHex(coda ? 0x3a4a80 : 0x8aa4d0);
    this.windowGlow.color.setHex(coda ? 0x0e1830 : 0x4a6a9a);
    this.hemi.intensity = coda ? 0.12 : 0.35;
    this.radioDial.color.setHex(coda ? 0xffb050 : 0x3a2a10);
    this.radioLight.intensity = coda ? 1.6 + Math.sin(t * 7) * 0.05 : 0;
  }

  private seated(t: number, lean = 0): Pose {
    const b = idle(t);
    return {
      hips: [lean, 0, 0],
      neck: [b.neck![0], b.neck![1] * 0.3, 0],
      armR: [-0.55, 0, 0.12],
      armL: [-0.55, 0, -0.12],
      legR: [-1.35, 0, 0.06],
      legL: [-1.35, 0, -0.06],
      lift: -3.2,
    };
  }

  private updateCollector(t: number, coda: boolean, talk: Set<string>): void {
    const c = this.collector;
    let pose: Pose;
    let base: "neutral" | "smile" = "neutral";
    if (coda) {
      // At the microscope, then turning toward the radio.
      c.root.position.set(BENCH.x - 0.55, 0, BENCH.z + 0.05);
      const turn = easeInOut(seg(t, 346.6, 348.2));
      c.root.rotation.set(0, lerp(0, 0.6, turn), 0);
      const bend: Pose = { ...idle(t), hips: [0.35, 0, 0], neck: [0.45, 0, 0], armR: [-0.9, 0, 0.3], armL: [-0.9, 0, -0.3] };
      const up: Pose = { ...idle(t), hips: [0.1, 0, 0], neck: [0.05, 0.4, 0], armR: [-0.4, 0, 0.1], armL: [-0.3, 0, -0.1] };
      pose = lerpPose(bend, up, turn);
      applyPose(c.fig, pose);
      performFace(c, t, talk.has("收藏者"), "neutral");
      return;
    }
    if (t < 57) {
      c.root.position.copy(BENCH);
      c.root.rotation.set(0, 0, 0);
      const bend: Pose = { ...idle(t), hips: [0.38, 0, 0], neck: [0.5, 0, 0], armR: [-1.0, 0, 0.35], armL: [-0.9, 0, -0.3] };
      const greet: Pose = { ...idle(t), hips: [0.05, 0, 0], neck: [-0.05, 0.35, 0], armR: [-1.1, 0, -0.35], armL: [-0.2, 0, -0.1] };
      pose = lerpPose(bend, greet, easeInOut(seg(t, 52.4, 53.4)));
      base = "smile";
    } else if (t < 61.6) {
      // Walk to his chair.
      const k = easeInOut(seg(t, 57, 61.4));
      const a = BENCH, b = COLLECTOR_SEAT.clone().add(new THREE.Vector3(-0.05, 0, 0));
      c.root.position.set(lerp(a.x, b.x, k), 0, lerp(a.z, b.z, k) + Math.sin(k * Math.PI) * 0.8);
      const dir = Math.atan2(b.x - a.x, b.z - a.z + 1.2 * Math.cos(k * Math.PI));
      c.root.rotation.set(0, lerp(dir, Math.PI / 2, smooth(seg(t, 60.6, 61.6))), 0);
      pose = lerpPose(walk(t, 1.1), this.seated(t), smooth(seg(t, 61.0, 61.6)));
    } else {
      c.root.position.copy(COLLECTOR_SEAT);
      c.root.rotation.set(0, Math.PI / 2, 0);
      pose = this.seated(t, 0.08);
      // Pour tea.
      const pour = Math.sin(Math.PI * seg(t, 62.2, 65.2));
      pose.armR = [lerp(-0.55, -1.25, pour), 0, lerp(0.12, -0.2, pour)];
      // Holding a stone up to the lamp.
      const hold = Math.sin(Math.PI * seg(t, 79.4, 87.2));
      if (hold > 0) {
        pose.armR = [lerp(-0.55, -2.45, clamp(hold * 1.4)), 0, lerp(0.12, -0.12, hold)];
        pose.neck = [lerp(0, -0.15, hold), -0.08 * hold, 0];
      }
      // Points at Zhang, laughing.
      const point = Math.sin(Math.PI * seg(t, 96.8, 100.2));
      if (point > 0) {
        pose.armR = [lerp(-0.55, -1.5, clamp(point * 1.5)), 0, 0.05];
        pose.hips = [0.08 - Math.abs(Math.sin(t * 9)) * 0.06 * point, 0, 0];
        base = "smile";
      }
      // Places an iron meteorite on the velvet.
      const place = Math.sin(Math.PI * seg(t, 114.6, 118.4));
      if (place > 0) pose.armR = [lerp(-0.55, -1.45, clamp(place * 1.3)), 0, lerp(0.12, -0.1, place)];
      if (t > 104 && t < 112) pose.neck = [0.05, 0, 0];
      if (t > 122 && t < 127.2) pose.neck = [0.35 * Math.sin(Math.PI * seg(t, 122, 127.2)), 0, 0];
      if (t > 134.4 && t < 140.4) base = "smile";
      if (t > 140.4) pose.neck = [0.12, 0, 0];
    }
    applyPose(c.fig, pose);
    performFace(c, t, talk.has("收藏者"), base);
  }

  private updateZhang(t: number, coda: boolean, talk: Set<string>): void {
    const z = this.zhang;
    z.root.visible = !coda;
    if (coda) return;
    let pose: Pose;
    if (t < 56) {
      // Enters through the door and stops, taking in the cabinets.
      const a = new THREE.Vector3(2.4, 0, 3.6), b = new THREE.Vector3(1.2, 0, 0.9);
      const k = easeInOut(seg(t, 50, 54.4));
      z.root.position.copy(a).lerp(b, k);
      z.root.rotation.set(0, Math.PI + lerp(0.4, -0.2, k), 0);
      pose = lerpPose(walk(t, 1.0), idle(t), smooth(seg(t, 54.0, 54.6)));
      pose.neck = [0, lerp(0, 0.6, smooth(seg(t, 51.5, 53.5))) * (t < 55 ? 1 : 0.5), 0];
    } else if (t < 61.8) {
      const a = new THREE.Vector3(1.2, 0, 0.9), b = new THREE.Vector3(-0.9, 0, -1.3);
      const k = seg(t, 56, 60.2);
      z.root.position.copy(a).lerp(b, k);
      z.root.rotation.set(0, Math.PI + 0.75, 0);
      pose = lerpPose(walk(t, 0.8), idle(t), smooth(seg(t, 60, 60.5)));
      pose.neck = [0.05, -0.75, 0];
      if (t > 60.5) {
        const k2 = easeInOut(seg(t, 60.5, 61.8));
        z.root.position.copy(b).lerp(ZHANG_SEAT, k2);
        z.root.rotation.set(0, lerp(Math.PI + 0.75, -Math.PI / 2 + Math.PI * 2, 0) , 0);
        z.root.rotation.y = lerp(Math.PI + 0.75, Math.PI * 1.5, k2);
        pose = lerpPose(walk(t, 1), this.seated(t), smooth(seg(t, 61.2, 61.8)));
      }
    } else {
      z.root.position.copy(ZHANG_SEAT);
      z.root.rotation.set(0, -Math.PI / 2, 0);
      pose = this.seated(t, 0.02);
      // Teacup raised for the joke.
      const cup = seg(t, 89.4, 90.2) * (1 - seg(t, 97.2, 98.2));
      if (cup > 0) {
        const lift = Math.sin(Math.PI * seg(t, 93.2, 95.8)) * 0.35;
        pose.armR = [lerp(-0.55, -1.25 - lift, easeInOut(cup)), 0, lerp(0.12, 0.35, cup)];
      }
      // Phone out to pay.
      const ph = seg(t, 131.2, 132.0) * (1 - seg(t, 141.0, 142.0));
      if (ph > 0) {
        pose.armR = [lerp(-0.55, -1.15, easeInOut(ph)), 0, lerp(0.12, 0.3, ph)];
        pose.neck = [0.35 * ph, 0, 0];
      }
      if (t > 122 && t < 126) pose.neck = [0.4, 0, 0];
      if (t > 142.4) pose.neck = [lerp(0.1, 0.42, smooth(seg(t, 142.4, 144.5))), 0, 0];
    }
    applyPose(z.fig, pose);
    performFace(z, t, talk.has("章北海"), "neutral");
  }

  private updateProps(t: number, coda: boolean): void {
    // Teapot: lifted, poured over Zhang's cup, returned.
    const pour = Math.sin(Math.PI * seg(t, 62.4, 65.0));
    const home = new THREE.Vector3(TEA_TABLE.x + 0.08, 0.425, TEA_TABLE.z - 0.3);
    const over = new THREE.Vector3(TEA_TABLE.x + 0.05, 0.55, TEA_TABLE.z + 0.15);
    this.teapot.position.copy(home).lerp(over, clamp(pour * 1.6));
    this.teapot.rotation.set(0, 0, -clamp(pour * 1.6 - 0.4) * 0.7);
    // Cups.
    const cupInHand = t > 89.9 && t < 97.6 && !coda;
    this.cupZ.visible = !cupInHand;
    this.cupZHand.visible = cupInHand;
    this.stoneHand.visible = t > 79.8 && t < 87.0 && !coda;
    const placing = t > 114.8 && t < 117.0;
    this.ironHand.visible = placing && !coda;
    // Irons: on the shelf before the deal, on the velvet after; gone from the house by the coda.
    const onTable = t >= 117.0 && !coda;
    this.irons.forEach((m, k) => (m.visible = onTable && (k !== 2 || t >= 117.0)));
    this.velvet.visible = t >= 114.6 && !coda;
    this.shelfIrons.forEach((m) => (m.visible = t < 114.8));
    this.phone.visible = t > 131.8 && t < 141.2 && !coda;
    // Tea stream and steam.
    const fx = this.fx;
    fx.begin();
    if (t > 63.0 && t < 64.4) {
      const cx = TEA_TABLE.x + 0.215, cz = TEA_TABLE.z + 0.205;
      for (let k = 0; k < 14; k++) {
        const f = ((t * 3 + k / 14) % 1);
        fx.add(cx, lerp(0.6, 0.47, f), cz, 0.008, 0xb07a30);
      }
    }
    if (!coda) {
      for (const cup of [this.cupZ, this.cupC]) {
        if (!cup.visible) continue;
        for (let k = 0; k < 10; k++) {
          const age = ((t * 0.35 + k / 10) % 1);
          const p = cup.position;
          fx.add(p.x + 0.045 + Math.sin(age * 6 + k) * 0.02, p.y + 0.1 + age * 0.3, p.z + 0.045 + Math.cos(age * 5 + k) * 0.015, 0.012 * (1 - age), 0xffffff);
        }
      }
    }
    fx.end();
    void hash;
  }
}

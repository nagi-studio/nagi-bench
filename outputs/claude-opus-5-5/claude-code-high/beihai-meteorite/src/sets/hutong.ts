import * as THREE from "three";
import { applyPose, lerpPose, walk, idle, type Pose } from "@agentbench/voxel-kit";
import { Actor, makeZhang, performFace } from "../characters";
import { mesh, VM } from "../props";
import { box, easeInOut, hash, seg, std, rng, smooth } from "../util";
import { brick, slab } from "./common";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";

/** A grey-brick alley at dusk, ending in the collector's red gate. */
export class HutongSet {
  readonly group = new THREE.Group();
  readonly zhang: Actor;
  private readonly doorL: THREE.Object3D;
  private readonly doorR: THREE.Object3D;
  private readonly spill: THREE.SpotLight;
  readonly gatePos = new THREE.Vector3(0, 0, -14);

  constructor() {
    this.group.name = "set:hutong";
    const g = this.group;
    // Ground: worn stone paving.
    const ground = slab(40, 1, 88, 0.25, (x, _y, z) => {
      const k = hash(Math.floor(x / 2), Math.floor(z / 2));
      if (x % 4 === 0 || z % 4 === 0) return 0x3a3b3e;
      return k > 0.6 ? 0x5b5c60 : k > 0.3 ? 0x525357 : 0x4a4b4f;
    });
    ground.position.set(-5, -0.25, -20);
    g.add(ground);
    // Two long grey walls with tiled copings.
    for (const side of [-1, 1]) {
      const wall = slab(2, 26, 176, 0.125, (_x, y, z) => (y >= 23 ? (z % 3 ? 0x2c2e33 : 0x3a3c42) : y < 3 ? 0x4a4b50 : brick(z, y)));
      wall.position.set(side * 1.9 - (side > 0 ? 0 : 0.25), 0, -20);
      g.add(wall);
      const cap = slab(3, 2, 88, 0.25, (x, y, z) => (y === 1 && x === 1 ? 0x24262a : (z + x) % 2 ? 0x33353a : 0x2a2c30));
      cap.position.set(side * 1.9 - 0.375 - (side > 0 ? 0 : 0.25), 3.25, -20);
      g.add(cap);
    }
    // Rooflines of courtyard houses beyond the walls.
    const r = rng(12);
    for (let i = 0; i < 8; i++) {
      for (const side of [-1, 1]) {
        const roof = slab(20, 6, 18, 0.3, (x, y, z) => {
          const ridge = Math.abs(z - 8.5);
          if (y > 5 - ridge / 2 + 0.5) return null;
          return (x + y) % 2 ? 0x2a2c30 : 0x34363b;
        }, false);
        roof.position.set(side * (2.2 + 3 * 0.3) + (side < 0 ? -6 : 0), 2.8 + r() * 0.6, -60 + i * 7.5);
        g.add(roof);
      }
    }
    // The gate: a recessed red double door with brass studs, a small roof and step.
    const gate = new THREE.Group();
    gate.position.copy(this.gatePos);
    g.add(gate);
    const frame = slab(14, 14, 2, 0.25, (x, y) => (x <= 1 || x >= 12 || y >= 12 ? 0x4a2a1a : null));
    frame.position.set(-1.75, 0, 0);
    gate.add(frame);
    const doorGeo = () => buildVoxelGeometry({
      size: [5, 12, 1],
      at: (x, y) => (x === 4 && y === 6 ? 0x8a6a2a : y === 11 || y === 0 || x === 0 ? 0x6a1410 : (y % 4 === 2 ? 0x861c14 : 0x9a2218)),
    }, { voxel: 0.25, anchor: "min" });
    const hingeL = new THREE.Group();
    hingeL.position.set(-1.25, 0, 0.1);
    const dl = mesh(doorGeo(), VM);
    hingeL.add(dl);
    gate.add(hingeL);
    const hingeR = new THREE.Group();
    hingeR.position.set(1.25, 0, 0.1);
    const dr = mesh(doorGeo(), VM);
    dr.position.x = -1.25;
    hingeR.add(dr);
    gate.add(hingeR);
    this.doorL = hingeL;
    this.doorR = hingeR;
    const lintel = slab(18, 3, 4, 0.25, (x, y) => (y === 2 ? 0x2a2c30 : x % 3 === 0 ? 0x3a4a5a : 0x7a2a1a));
    lintel.position.set(-2.25, 3.5, -0.25);
    gate.add(lintel);
    const step = slab(14, 1, 4, 0.25, () => 0x6a6a6e);
    step.position.set(-1.75, 0, 0.5);
    gate.add(step);
    // Warm courtyard light behind the gate.
    const glow = box(2.4, 3, 0.05, new THREE.MeshBasicMaterial({ color: 0xffb070 }), [0, 1.5, -0.4], gate, false);
    glow.visible = true;
    // A lantern over the gate.
    const lantern = box(0.35, 0.45, 0.35, new THREE.MeshBasicMaterial({ color: 0xff5a30 }), [0, 3.3, 0.55], gate, false);
    void lantern;
    const lanternLight = new THREE.PointLight(0xff8a50, 2.5, 7, 0);
    lanternLight.position.set(0, 3.1, 0.9);
    gate.add(lanternLight);
    this.spill = new THREE.SpotLight(0xffb070, 0, 12, 0.8, 0.7, 0);
    this.spill.position.set(0, 2.2, -0.8);
    this.spill.target.position.set(0, 0, 4);
    gate.add(this.spill, this.spill.target);
    // Overhead cables and a bare jujube tree reaching over the wall.
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x15161a });
    for (let i = 0; i < 3; i++) box(3.8, 0.03, 0.03, cableMat, [0, 4.6 + i * 0.25, -4 - i * 9], g, false);
    const tree = slab(9, 12, 9, 0.25, (x, y, z) => {
      if (y < 7) return x === 4 && z === 4 ? 0x2a1d14 : null;
      const d = Math.abs(x - 4) + Math.abs(z - 4) + (y - 7);
      if (d < 7 && hash(x, y, z) > 0.62) return 0x24180f;
      return null;
    }, false);
    tree.position.set(1.4, 2.5, -10);
    g.add(tree);
    // Distant lit windows at the alley end.
    for (let i = 0; i < 4; i++) box(0.6, 0.5, 0.05, new THREE.MeshBasicMaterial({ color: 0xffc080 }), [-1.2 + i * 0.8, 1.8 + (i % 2) * 0.5, -60], g, false);

    // Dusk light.
    const hemi = new THREE.HemisphereLight(0x5a6a9a, 0x2a2420, 0.55);
    g.add(hemi);
    const sky = new THREE.DirectionalLight(0xffa870, 0.9);
    sky.position.set(-3, 8, -12);
    sky.castShadow = true;
    sky.shadow.mapSize.set(1024, 1024);
    sky.shadow.camera.left = -6;
    sky.shadow.camera.right = 6;
    sky.shadow.camera.top = 10;
    sky.shadow.camera.bottom = -10;
    sky.shadow.camera.near = 1;
    sky.shadow.camera.far = 40;
    sky.target.position.set(0, 0, -8);
    g.add(sky, sky.target);

    this.zhang = makeZhang();
    this.zhang.dress("coat");
    g.add(this.zhang.root);
    void std;
  }

  update(t: number): void {
    const z = this.zhang;
    // Walk 40.0 → 46.0 up the alley toward the gate, then knock.
    const start = new THREE.Vector3(0.35, 0, -2);
    const end = new THREE.Vector3(0.1, 0, this.gatePos.z + 1.5);
    const k = seg(t, 40, 46.2);
    z.root.position.copy(start).lerp(end, k);
    z.root.rotation.set(0, Math.PI, 0);
    let pose: Pose = walk(t, 1.25);
    if (t > 46.0) {
      const knock: Pose = { ...idle(t), armR: [-1.6 + Math.max(0, Math.sin((t - 46.4) * 12)) * 0.25 * (t < 47.6 ? 1 : 0), 0, 0.25] };
      pose = lerpPose(walk(t, 1.25), knock, easeInOut(seg(t, 46.0, 46.4)));
      if (t > 47.8) pose = lerpPose(knock, idle(t), easeInOut(seg(t, 47.8, 48.4)));
    }
    applyPose(z.fig, pose);
    performFace(z, t, false);
    const open = easeInOut(seg(t, 48.3, 49.6));
    this.doorL.rotation.y = open * 1.4;
    this.doorR.rotation.y = -open * 1.4;
    this.spill.intensity = open * 3;
    void smooth;
  }
}

import * as THREE from "three";
import { applyPose, buildVoxelGeometry, idle, lerpPose, walk, type Pose } from "@agentbench/voxel-kit";
import { Actor, makeZhang, performFace } from "../characters";
import { CubeField } from "../particles";
import { ironMeteoriteGeo, mesh, slugGeo, VM, VM_GLOSS } from "../props";
import { box, canvasTex, clamp, easeInOut, hash, lerp, seg, smooth, std } from "../util";
import { slab } from "./common";

export const LATHE_AXIS_Y = 1.3;
export const CHUCK_X = -0.62;
export const TRAY = new THREE.Vector3(2.25, 0.93, 0.35);

export const segmentDrops = [176.6, 177.7, 178.8, 179.9];

export class ShopSet {
  readonly group = new THREE.Group();
  readonly zhang: Actor;
  private readonly chuck = new THREE.Group();
  private readonly lump: THREE.Mesh;
  private readonly rod: THREE.Mesh;
  private readonly tool = new THREE.Group();
  private readonly slugs: THREE.Mesh[] = [];
  private readonly drops: THREE.Mesh[] = [];
  private readonly cutterHand: THREE.Mesh;
  private readonly screen: THREE.CanvasTexture;
  private screenKey = "";
  private readonly workLight: THREE.PointLight;
  private readonly overhead: THREE.SpotLight;
  private readonly tubes: THREE.MeshBasicMaterial;
  private readonly sparks: CubeField;
  private readonly bag: THREE.Mesh;

  constructor() {
    this.group.name = "set:shop";
    const g = this.group;
    const floor = slab(64, 1, 48, 0.25, (x, _y, z) => ((x % 8 === 0 || z % 8 === 0) ? 0x2c2e30 : hash(x >> 1, z >> 1) > 0.7 ? 0x3e4042 : 0x38393b));
    floor.position.set(-8, -0.25, -6);
    g.add(floor);
    const wall = slab(64, 20, 1, 0.25, (x, y) => {
      if (y >= 10 && y <= 17 && x % 12 >= 2 && x % 12 <= 9) return null;
      return (x + y) % 11 === 0 ? 0x2a2c30 : 0x32353a;
    });
    wall.position.set(-8, 0, -6);
    g.add(wall);
    const nightMat = new THREE.MeshBasicMaterial({ color: 0x1a2a4a });
    for (let i = 0; i < 5; i++) box(2.0, 2.0, 0.05, nightMat, [-8 + (i * 12 + 6) * 0.25, 3.4, -6.1], g, false);

    // Silhouettes of idle machines in the dark.
    const machineMat = std(0x2a3230, { roughness: 0.7 });
    for (const [x, z, w, h, d] of [[-5, -3.5, 1.8, 1.6, 1.2], [-6.5, 1.5, 1.4, 2.0, 1.4], [4.8, -3.5, 2.2, 1.4, 1.0], [5.5, 2.5, 1.2, 1.8, 1.2], [-3, 3.8, 2, 1.2, 1]] as number[][]) {
      box(w, h, d, machineMat, [x, h / 2, z], g);
    }

    // CNC lathe: cabinet, enclosure with a window, headstock, chuck, turret, tailstock.
    const body = slab(26, 19, 10, 0.1, (x, y, z) => {
      if (y < 9) return y === 0 ? 0x1a1e1c : x % 13 === 0 ? 0x3c4a44 : 0x4a5a52;
      const inside = x >= 1 && x <= 20 && y >= 9 && y <= 17 && z >= 1 && z <= 8;
      const windowCut = z === 9 && x >= 3 && x <= 18 && y >= 10 && y <= 16;
      if (inside || windowCut) return null;
      if (y === 18) return 0x3c4a44;
      return x >= 21 ? 0x55665e : 0x4a5a52;
    });
    body.position.set(-1.3, 0, -0.5);
    g.add(body);
    box(1.55, 0.68, 0.01, new THREE.MeshStandardMaterial({ color: 0x9ab0c0, transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false }), [-0.2, 1.35, 0.46], g, false);
    // Headstock block.
    box(0.35, 0.55, 0.6, std(0x3c4a44), [-1.0, 1.2, -0.05], g);
    this.chuck.position.set(CHUCK_X, LATHE_AXIS_Y, -0.05);
    g.add(this.chuck);
    const chuckGeo = buildVoxelGeometry({
      size: [2, 9, 9],
      at(x, y, z) {
        const d = Math.hypot(y - 4, z - 4);
        if (d > 4.4) return null;
        if (x === 1 && (Math.abs(y - 4) < 1 || Math.abs(z - 4) < 1) && d > 1.2) return 0x8a9098;
        return d < 1.3 ? 0x222428 : 0x6a7078;
      },
    }, { voxel: 0.035, anchor: "center" });
    this.chuck.add(mesh(chuckGeo, VM_GLOSS));
    this.lump = mesh(ironMeteoriteGeo(501, 12, 0.09), VM_GLOSS);
    this.lump.position.set(0.075, 0, 0);
    this.chuck.add(this.lump);
    this.rod = mesh(buildVoxelGeometry({
      size: [40, 3, 3],
      at: (x, y, z) => ((y === 0 || y === 2) && (z === 0 || z === 2) ? null : (x + y) % 3 ? 0x7a8086 : 0x5a6066),
    }, { voxel: 0.0032, anchor: "min" }), VM_GLOSS);
    this.rod.position.set(0.035, -0.0048, -0.0048);
    this.chuck.add(this.rod);
    // Tool turret on its cross-slide.
    this.tool.position.set(0, LATHE_AXIS_Y, 0.25);
    g.add(this.tool);
    box(0.22, 0.12, 0.2, std(0x5a6068, { metalness: 0.5, roughness: 0.4 }), [0, -0.06, 0.1], this.tool);
    box(0.02, 0.02, 0.16, std(0xd8c070, { metalness: 0.7, roughness: 0.3 }), [0, 0, -0.06], this.tool);
    // Tailstock.
    box(0.25, 0.4, 0.4, std(0x3c4a44), [0.55, 1.18, -0.05], g);
    // Control pendant with the NC screen.
    const panel = new THREE.Group();
    panel.position.set(1.45, 1.35, 0.52);
    g.add(panel);
    box(0.48, 0.7, 0.1, std(0x2a302e), [0, 0, 0], panel);
    this.screen = canvasTex(256, 160, () => {});
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.225), new THREE.MeshBasicMaterial({ map: this.screen, toneMapped: false }));
    scr.position.set(0, 0.13, 0.052);
    panel.add(scr);
    const btnCols = [0x2ab050, 0xd03020, 0xd8b030, 0x7a8088, 0x7a8088, 0x7a8088];
    btnCols.forEach((c, i) => box(0.05, 0.04, 0.02, new THREE.MeshBasicMaterial({ color: c }), [-0.14 + (i % 3) * 0.14, -0.14 - Math.floor(i / 3) * 0.08, 0.06], panel, false));

    // Side worktable with the parts tray.
    box(1.2, 0.05, 0.7, std(0x5a5a5a, { metalness: 0.4, roughness: 0.5 }), [TRAY.x, 0.9, TRAY.z], g);
    for (const [dx, dz] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) box(0.05, 0.9, 0.05, std(0x3a3a3a), [TRAY.x + dx, 0.45, TRAY.z + dz], g);
    box(0.3, 0.015, 0.22, std(0x8a9096, { metalness: 0.6, roughness: 0.35 }), [TRAY.x, TRAY.y, TRAY.z], g);
    const sg = slugGeo();
    for (let i = 0; i < 36; i++) {
      const m = mesh(sg, VM_GLOSS, false);
      m.position.set(TRAY.x - 0.1 + (i % 6) * 0.04, TRAY.y + 0.015, TRAY.z - 0.08 + Math.floor(i / 6) * 0.032);
      m.rotation.set(Math.PI / 2, 0, 0);
      g.add(m);
      this.slugs.push(m);
    }
    for (let i = 0; i < segmentDrops.length; i++) {
      const m = mesh(sg, VM_GLOSS, false);
      g.add(m);
      this.drops.push(m);
    }
    this.bag = mesh(buildVoxelGeometry({ size: [4, 5, 3], at: (x, y) => (y === 4 && x % 3 === 0 ? null : 0xc8c0a8) }, { voxel: 0.03, anchor: "min" }), VM);
    this.bag.position.set(TRAY.x + 0.3, TRAY.y, TRAY.z - 0.05);
    g.add(this.bag);

    // Lights: one cold fixture over the lathe, a work lamp inside, the rest of the shop asleep.
    const tubeGroup = new THREE.Group();
    g.add(tubeGroup);
    this.tubes = new THREE.MeshBasicMaterial({ color: 0xe8f0ff });
    box(1.6, 0.05, 0.12, this.tubes, [0.3, 3.2, 0.4], tubeGroup, false);
    for (const x of [-4.5, 4.5]) box(1.6, 0.05, 0.12, new THREE.MeshBasicMaterial({ color: 0x20242a }), [x, 3.2, 0.4], tubeGroup, false);
    this.overhead = new THREE.SpotLight(0xdfe8ff, 9, 9, 0.9, 0.55, 0);
    this.overhead.position.set(0.3, 3.15, 0.6);
    this.overhead.target.position.set(0.4, 0.8, 0.2);
    this.overhead.castShadow = true;
    this.overhead.shadow.mapSize.set(1024, 1024);
    this.overhead.shadow.bias = -0.0005;
    g.add(this.overhead, this.overhead.target);
    this.workLight = new THREE.PointLight(0xcfe0ff, 2.5, 1.6, 0);
    this.workLight.position.set(-0.3, 1.62, 0.1);
    g.add(this.workLight);
    g.add(new THREE.HemisphereLight(0x2a3450, 0x0a0a0c, 0.3));

    this.sparks = new CubeField(500, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), 1);
    g.add(this.sparks.mesh);

    this.zhang = makeZhang();
    this.zhang.dress("sweater");
    g.add(this.zhang.root);
    this.cutterHand = mesh(buildVoxelGeometry({ size: [1, 1, 6], at: (_x, _y, z) => (z >= 4 ? 0xd8c070 : 0x5a6068) }, { voxel: 0.6, anchor: "center" }), VM_GLOSS);
    this.cutterHand.position.set(0, 0.5, 1.5);
    this.zhang.fig.anchors.handR.add(this.cutterHand);
  }

  private drawScreen(t: number): void {
    const n = t < 176 ? 0 : t < 181 ? 14 + Math.floor(seg(t, 176, 181) * 18) : Math.min(36, 32 + Math.floor(seg(t, 181, 184) * 4));
    const running = t > 166.6 && t < 181;
    const key = `${n}|${running}|${t > 164 ? 1 : 0}`;
    if (key === this.screenKey) return;
    this.screenKey = key;
    const cv = this.screen.image as HTMLCanvasElement;
    const c = cv.getContext("2d")!;
    c.fillStyle = "#04100a";
    c.fillRect(0, 0, 256, 160);
    c.fillStyle = "#3aff8a";
    c.font = "bold 15px monospace";
    c.fillText("NC-2  O0762  特殊刀具 T07", 10, 22);
    c.fillStyle = "#2ad070";
    c.font = "14px monospace";
    c.fillText(`主轴  S ${running ? "2400" : "   0"} rpm`, 10, 50);
    c.font = "bold 26px monospace";
    c.fillStyle = "#b8ffd0";
    c.fillText("Φ 7.62 mm", 10, 86);
    c.font = "14px monospace";
    c.fillStyle = "#2ad070";
    c.fillText("段长 L  9.00 mm", 10, 112);
    c.fillText(`件数  ${String(n).padStart(2, "0")} / 36`, 10, 136);
    if (running) {
      c.fillStyle = "#ffb030";
      c.fillText("● 运行", 180, 136);
    }
    this.screen.needsUpdate = true;
  }

  update(t: number): void {
    this.drawScreen(t);
    const running = t > 166.6 && t < 181.2;
    // Spindle rotation from absolute time (2400 rpm reads as a blur; show a slower apparent speed).
    this.chuck.rotation.x = running ? (t - 166.6) * 22 : 0;
    this.lump.visible = t < 174.9;
    this.rod.visible = t >= 174.9 && t < 181.2;
    const cuts = segmentDrops.filter((d) => t >= d).length;
    this.rod.scale.x = 1 - cuts * 0.12;
    // Turret: approach, turning pass, retract; then parting passes.
    let tx = 0.3, tz = 0.25;
    if (t > 169.5 && t < 175) {
      tx = lerp(0.18, 0.02, seg(t, 170.5, 174.6));
      tz = lerp(0.25, 0.06, easeInOut(seg(t, 169.5, 170.5)));
    } else if (t >= 175 && t < 181.2) {
      const cut = segmentDrops.find((d) => t < d + 0.2) ?? 181;
      tx = 0.035 + 0.12 * (1 - cuts * 0.12) - 0.01;
      tz = 0.02 + 0.05 * (1 - Math.sin(Math.PI * clamp((t - (cut - 0.8)) / 0.9)));
    }
    this.tool.position.set(CHUCK_X + tx, LATHE_AXIS_Y, tz);
    // Dropped segments fall into the chip pan.
    this.drops.forEach((m, i) => {
      const d = segmentDrops[i];
      m.visible = t >= d && t < 181.2;
      const u = t - d;
      m.position.set(CHUCK_X + 0.035 + 0.128 * (1 - i * 0.12), LATHE_AXIS_Y - Math.min(0.42, 4.9 * u * u), -0.02 + Math.min(0.05, u * 0.1));
      m.rotation.set(u * 6, 0, Math.PI / 2 + u * 3);
    });
    // Parts tray fills.
    const placed = t < 181 ? 0 : Math.floor(seg(t, 181.3, 185.2) * 36);
    this.slugs.forEach((m, i) => (m.visible = i < placed || t >= 185.2));
    // Sparks where the tool meets metal.
    const sp = this.sparks;
    sp.begin();
    const contact = (t > 170.6 && t < 174.6) || segmentDrops.some((d) => t > d - 0.7 && t < d);
    if (contact) {
      const cx = CHUCK_X + tx, cy = LATHE_AXIS_Y, cz = tz - 0.02;
      for (let k = 0; k < 90; k++) {
        const born = Math.floor(t * 30) / 30 - (k % 15) / 30;
        const age = t - born;
        const h1 = hash(born * 30, k), h2 = hash(k, born * 30, 2), h3 = hash(k, 7, born * 30);
        const vx = (h1 - 0.5) * 1.6, vy = -0.3 + h2 * 1.8, vz = 0.4 + h3 * 1.4;
        const x = cx + vx * age, y = cy + vy * age - 4.9 * age * age, z = cz + vz * age;
        sp.add(x, y, z, 0.004 * (1 - age * 1.5), h1 > 0.6 ? 0xffe0a0 : 0xff8a30);
      }
    }
    sp.end();
    // Lights.
    const lightsOut = t > 189.3;
    this.overhead.intensity = lightsOut ? 0 : 9;
    this.tubes.color.setHex(lightsOut ? 0x15181c : 0xe8f0ff);
    this.workLight.intensity = lightsOut ? 0 : running ? 2.5 : 1.2;

    // Zhang.
    const z = this.zhang;
    let pose: Pose = idle(t);
    this.cutterHand.visible = t > 187.4 && t < 190;
    if (t < 168.2) {
      z.root.position.set(1.5, 0, 1.05);
      z.root.rotation.set(0, Math.PI - 0.12, 0);
      const typing = seg(t, 163.2, 163.8) * (1 - seg(t, 167.2, 167.8));
      pose = { ...idle(t), neck: [0.25, 0, 0], armR: [-1.15 + Math.sin(t * 13) * 0.06 * typing, 0, 0.15], armL: [-1.1 + Math.cos(t * 11) * 0.05 * typing, 0, -0.2] };
      pose = lerpPose(idle(t), pose, typing);
    } else if (t < 181) {
      const k = easeInOut(seg(t, 168.2, 170));
      z.root.position.set(lerp(1.5, 0.2, k), 0, 1.0);
      z.root.rotation.set(0, Math.PI, 0);
      pose = lerpPose(walk(t, 1.1), { ...idle(t), neck: [0.3, 0, 0] }, smooth(seg(t, 169.4, 170.2)));
      if (t < 169.4) pose = walk(t, 1.1);
    } else if (t < 186) {
      const k = easeInOut(seg(t, 181, 181.6));
      z.root.position.set(lerp(0.2, TRAY.x, k), 0, lerp(1.0, 0.95, k));
      z.root.rotation.set(0, Math.PI, 0);
      const place = Math.sin((t - 181.3) * 9.2);
      pose = { ...idle(t), neck: [0.6, 0, 0], hips: [0.25, 0, 0], armR: [-1.0 + place * 0.08, 0.1, 0.2], armL: [-0.85, 0, -0.3] };
      if (t > 185.2) pose.armL = [-1.1, 0.3, -0.5];
    } else {
      const k = easeInOut(seg(t, 186, 186.6));
      const out = seg(t, 188.2, 190);
      z.root.position.set(lerp(TRAY.x, 0.25, k) + out * 3.2, 0, lerp(0.95, 0.85, k) + out * 0.6);
      z.root.rotation.set(0, lerp(Math.PI, Math.PI / 2, smooth(seg(t, 188, 188.4))), 0);
      pose = { ...idle(t), neck: [0.3, 0, 0], armR: [-1.4, 0, 0.1], armL: [-0.3, 0, -0.1] };
      if (t > 187.4) pose = { ...idle(t), neck: [0.35, 0.2, 0], armR: [-1.2, 0.3, -0.2], armL: [-0.2, 0, -0.1] };
      if (t > 188.2) pose = walk(t, 1.2);
    }
    applyPose(z.fig, pose);
    performFace(z, t, false);
    void smooth;
  }
}

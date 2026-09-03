import * as THREE from 'three';
import { SHOTS, TOTAL } from './cues';
import { box, figure, house, lighthouse, boat, meteorite, stars, type Figure, type Lighthouse } from './voxel';
import type { FilmSound } from './sound';

interface CamKey { t: number; pos: [number, number, number]; look: [number, number, number]; }

const CAMS: CamKey[] = [
  { t: 0, pos: [-34, 8, 22], look: [-26, 2, 0] },
  { t: 14, pos: [-26, 2.6, 7], look: [-19, 2, -3] },
  { t: 30, pos: [-13, 10, -14], look: [-20, 8, -25] },
  { t: 48, pos: [0, 6, 30], look: [20, 18, -10] },
  { t: 60, pos: [17, 4, 18], look: [28, 2, 6] },
  { t: 78, pos: [15, 5, 21], look: [28, 2, 6] },
  { t: 95, pos: [23, 2.6, 13], look: [28, 1.5, 6] },
  { t: 112, pos: [25.5, 2.1, 9.5], look: [28.5, 1.5, 6] },
  { t: 138, pos: [-14, 3, 11], look: [-3, 1, 8] },
  { t: 155, pos: [-2, 2.6, 13], look: [12, 1, 8] },
  { t: 172, pos: [21, 2.6, 13], look: [28, 1.5, 6] },
  { t: 190, pos: [23.5, 2.4, 11.5], look: [28, 2, 6] },
  { t: 206, pos: [29.6, 1.7, 7.6], look: [28, 1.0, 6] },
  { t: 222, pos: [25.5, 2.2, 9.5], look: [28, 1.2, 6] },
  { t: 238, pos: [0, 4, 24], look: [10, 2, 10] },
  { t: 256, pos: [-12, 6, -8], look: [-20, 9, -25] },
  { t: 268, pos: [0, 3, 16], look: [-10, 2, 4] },
  { t: 276, pos: [-18.6, 10.6, -23.4], look: [-20, 9.9, -25] },
  { t: 290, pos: [-10, 14, 10], look: [0, 4, 0] },
  { t: 300, pos: [-10, 14, 10], look: [0, 4, 0] },
];

function smooth(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

const NIGHT = new THREE.Color(0x060a18);
const DAWN = new THREE.Color(0xe8a06a);
const DAY = new THREE.Color(0x9fc3e0);
const STORM = new THREE.Color(0x3a4250);

function skyAt(t: number, out: THREE.Color): THREE.Color {
  if (t < 70) return out.copy(NIGHT);
  if (t < 95) return out.copy(NIGHT).lerp(DAY, smooth(70, 95, t));
  if (t < 112) return out.copy(DAY);
  if (t < 120) return out.copy(DAY).lerp(DAWN, smooth(112, 120, t) * 0.4);
  if (t < 238) return out.copy(DAY);
  if (t < 246) return out.copy(DAY).lerp(STORM, smooth(238, 246, t));
  if (t < 272) return out.copy(STORM);
  if (t < 284) return out.copy(STORM).lerp(NIGHT, smooth(272, 284, t));
  return out.copy(NIGHT);
}

export class Director {
  private beamAngle = 0;
  private prevT = -1;
  private fired = new Set<number>();
  private sky = new THREE.Color();
  private starPts: THREE.Points;
  private sea!: THREE.Mesh;
  private island!: THREE.Group;
  private stone!: { g: THREE.Group; glow: THREE.PointLight; cracks: THREE.Mesh[] };
  private lampStone!: THREE.Mesh;
  private fireball!: THREE.Mesh;
  private flash!: THREE.PointLight;
  private ring!: THREE.Mesh;
  private boatG!: THREE.Group;
  private girl!: Figure;
  private keeper!: Figure;
  private chief!: Figure;
  private folks: Figure[] = [];
  private light!: Lighthouse;
  private rain!: THREE.Points;
  private sun!: THREE.DirectionalLight;

  constructor(private scene: THREE.Scene, private camera: THREE.PerspectiveCamera, private sound: FilmSound) {
    scene.add(new THREE.AmbientLight(0x8a94b0, 0.7));
    this.sun = new THREE.DirectionalLight(0xfff0d5, 1.1);
    this.sun.position.set(30, 40, 20);
    scene.add(this.sun);
    this.sea = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshLambertMaterial({ color: 0x1f5f8a }),
    );
    this.sea.rotation.x = -Math.PI / 2;
    this.sea.position.set(0, 0, 0);
    scene.add(this.sea);
    const cliff = new THREE.Mesh(
      new THREE.BoxGeometry(26, 4, 40),
      new THREE.MeshLambertMaterial({ color: 0x5a5a52 }),
    );
    cliff.position.set(-30, 1, 2);
    scene.add(cliff);
    const groundV = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.3, 40),
      new THREE.MeshLambertMaterial({ color: 0x7a7a5e }),
    );
    groundV.position.set(-30, 3.1, 2);
    scene.add(groundV);
    house(scene, -34, -6, 0xcbb89a, 0x7a4a30, true);
    house(scene, -28, 2, 0xbfb49e, 0x6b4230, true);
    house(scene, -35, 10, 0xc4b498, 0x7a4a30, false);
    box(scene, 2, 0.4, 10, 0x6b4a2c, -15, 0.4, 10);
    const rock = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 7, 4, 8),
      new THREE.MeshLambertMaterial({ color: 0x4a4a44 }),
    );
    rock.position.set(-20, 1, -25);
    scene.add(rock);
    this.light = lighthouse(scene, -20, -25);
    this.island = new THREE.Group();
    this.island.position.set(28, 0, 6);
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 11, 3, 12),
      new THREE.MeshLambertMaterial({ color: 0x3a3632 }),
    );
    disc.position.y = 0.4;
    this.island.add(disc);
    box(this.island, 3, 1.6, 2.4, 0x2e2a28, -3, 1.6, -2);
    box(this.island, 2.2, 1.2, 2, 0x2e2a28, 3.4, 1.4, 2.6);
    this.stone = meteorite(this.island, 1.1);
    this.stone.g.position.set(0, 2.6, 0);
    this.island.visible = false;
    scene.add(this.island);
    this.lampStone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.45, 0),
      new THREE.MeshBasicMaterial({ color: 0xff9a3c }),
    );
    this.lampStone.position.set(-20, 9.9, -25);
    this.lampStone.visible = false;
    scene.add(this.lampStone);
    this.fireball = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0xffd27a }),
    );
    this.fireball.visible = false;
    scene.add(this.fireball);
    this.flash = new THREE.PointLight(0xfff2d0, 0, 120);
    this.flash.position.set(28, 6, 6);
    scene.add(this.flash);
    this.ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.5, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.set(28, 0.6, 6);
    this.ring.visible = false;
    scene.add(this.ring);
    this.boatG = boat(scene);
    this.girl = figure(0xb03a30);
    this.girl.g.position.set(0, 0.5, -0.6);
    this.boatG.add(this.girl.g);
    this.keeper = figure(0x2e5fa3, 0xd8b08c, 0x3a3a44);
    this.keeper.g.position.set(-18.4, 3.2, -22.5);
    this.keeper.g.rotation.y = Math.PI;
    scene.add(this.keeper.g);
    this.chief = figure(0x5a5a52);
    this.chief.g.position.set(24, 0, 12);
    scene.add(this.chief.g);
    for (let i = 0; i < 3; i++) {
      const f = figure([0x6b5a42, 0x4a5a6b, 0x70706a][i]);
      f.g.position.set(22.5 + i * 1.6, 0, 13.5 - i);
      scene.add(f.g);
      this.folks.push(f);
    }
    this.starPts = stars(scene, 400, 200);
    const rn = 900;
    const rp = new Float32Array(rn * 3);
    for (let i = 0; i < rn; i++) {
      rp[i * 3] = (Math.random() - 0.5) * 120;
      rp[i * 3 + 1] = Math.random() * 30;
      rp[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
    this.rain = new THREE.Points(rg, new THREE.PointsMaterial({ color: 0xaac4dd, size: 0.18 }));
    this.rain.visible = false;
    scene.add(this.rain);
  }

  setTime(t: number): void {
    this.prevT = t;
  }

  update(dt: number, t: number): void {
    const forward = t >= this.prevT;
    this.fireTriggers(t, forward);
    this.prevT = t;
    skyAt(t, this.sky);
    this.scene.background = this.sky;
    if (this.scene.fog) (this.scene.fog as THREE.Fog).color.copy(this.sky);
    else this.scene.fog = new THREE.Fog(this.sky.getHex(), 60, 220);
    const nightK = t < 70 || t > 276 ? 1 : t < 95 ? 1 - smooth(70, 95, t) : 0;
    const sm = this.starPts.material as THREE.PointsMaterial;
    sm.opacity = nightK;
    sm.transparent = true;
    this.starPts.visible = nightK > 0.02;
    this.sun.intensity = 1.1 * (1 - nightK) + 0.12;
    this.island.visible = t >= 64;
    if (this.island.visible) {
      const k = smooth(64, 78, t);
      this.island.scale.set(1, Math.max(0.02, k), 1);
      this.island.position.y = -2.5 * (1 - k);
    }
    const fb = t >= 50 && t < 66;
    this.fireball.visible = fb;
    if (fb) {
      const k = (t - 50) / 16;
      this.fireball.position.set(lerp(-45, 28, k * k), lerp(38, 1.5, k * k), lerp(-32, 6, k));
    }
    const flashK = t >= 66 && t < 73 ? Math.max(0, 1 - (t - 66) / 7) : 0;
    this.flash.intensity = flashK * 30;
    this.ring.visible = t >= 66 && t < 74;
    if (this.ring.visible) {
      const k = (t - 66) / 8;
      this.ring.scale.setScalar(1 + k * 22);
      (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
    }
    if (this.island.visible) {
      const excite = t >= 206 && t < 238 ? 1.6 : 1;
      this.stone.glow.intensity = (1.6 + Math.sin(t * 3) * 0.7) * excite;
    }
    this.lampStone.visible = t >= 276;
    this.beamAngle += dt * 0.7;
    this.light.beam.rotation.y = this.beamAngle;
    this.placeBoat(t);
    this.placePeople(t);
    const raining = t >= 238 && t < 276;
    this.rain.visible = raining;
    if (raining) {
      const attr = this.rain.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] -= dt * 22;
        if (arr[i + 1] < 0) arr[i + 1] = 30;
      }
      attr.needsUpdate = true;
    }
    this.placeCamera(t);
  }

  private boatPos(t: number): [number, number, number] {
    if (t < 138) return [-15, 0, 10];
    if (t < 170) { const k = smooth(138, 170, t); return [lerp(-15, 24, k), 0, 10]; }
    if (t < 240) return [24, 0, 10];
    if (t < 270) { const k = smooth(240, 270, t); return [lerp(24, -15, k), 0, 10]; }
    return [-15, 0, 10];
  }

  private placeBoat(t: number): void {
    const bp = this.boatPos(t);
    const storm = t >= 238 && t < 276;
    this.boatG.position.set(bp[0], Math.sin(t * (storm ? 5 : 1.6)) * (storm ? 0.5 : 0.18), bp[2]);
    this.boatG.rotation.z = Math.sin(t * 1.4) * (storm ? 0.12 : 0.03);
    this.boatG.rotation.y = t >= 240 ? -Math.PI / 2 : Math.PI / 2;
  }

  private placePeople(t: number): void {
    if (t >= 170 && t < 240) {
      if (this.girl.g.parent !== this.scene) this.scene.add(this.girl.g);
      const k = smooth(170, 178, t);
      this.girl.g.position.set(lerp(24, 26.4, k), 0, lerp(10, 7.6, k));
      this.girl.g.rotation.y = -0.6 + Math.sin(t * 0.8) * 0.1;
      this.girl.g.visible = true;
    } else {
      if (this.girl.g.parent !== this.boatG) this.boatG.add(this.girl.g);
      this.girl.g.position.set(0, 0.5, -0.6);
      this.girl.g.rotation.set(0, 0, 0);
      this.girl.g.visible = true;
    }
    const shore = t >= 78 && t < 138;
    this.chief.g.visible = shore;
    this.folks.forEach((f) => { f.g.visible = shore; });
    if (shore) {
      const n = Math.sin(t * 0.9) * 0.06;
      this.chief.armR.rotation.x = -0.9 + n;
      this.folks[0].armL.rotation.x = -0.4 - n;
    }
    if (t >= 238 && t < 276) this.keeper.armR.rotation.x = -2.4 + Math.sin(t * 6) * 0.3;
    else this.keeper.armR.rotation.x = 0;
  }

  private placeCamera(t: number): void {
    let a = CAMS[0], b = CAMS[CAMS.length - 1];
    for (let i = 0; i < CAMS.length - 1; i++) {
      if (t >= CAMS[i].t && t <= CAMS[i + 1].t) { a = CAMS[i]; b = CAMS[i + 1]; break; }
    }
    const span = Math.max(0.001, b.t - a.t);
    const kk = smooth(0, 1, (t - a.t) / span);
    const pos = lerp3(a.pos, b.pos, kk);
    const look = lerp3(a.look, b.look, kk);
    const storm = t >= 238 && t < 276 ? 1 : 0;
    const sh = storm * 0.25;
    this.camera.position.set(
      pos[0] + Math.sin(t * 13) * sh,
      pos[1] + Math.sin(t * 17) * sh,
      pos[2],
    );
    this.camera.lookAt(look[0], look[1], look[2]);
  }

  private fireTriggers(t: number, forward: boolean): void {
    if (!forward) return;
    const S = this.sound;
    const fire = (key: number, at: number, fn: () => void) => {
      if (this.prevT < at && t >= at && !this.fired.has(key)) { this.fired.add(key); fn(); }
    };
    fire(1, 0.5, () => { S.startBeds(); S.setBeds(0.04, 0.12); });
    fire(2, 20, () => S.radioStatic(4));
    fire(3, 50, () => S.rumble(14));
    fire(4, 66, () => { S.boom(); });
    fire(5, 67.5, () => S.splash());
    fire(6, 80, () => S.setBeds(0.05, 0.15));
    fire(7, 85, () => S.gull());
    fire(8, 93, () => S.gull());
    fire(9, 140, () => S.splash());
    fire(10, 150, () => S.splash());
    fire(11, 155, () => S.breath());
    fire(12, 160, () => S.splash());
    fire(13, 175, () => S.breath());
    fire(14, 182, () => S.radioStatic(3));
    fire(15, 192, () => S.radioStatic(3));
    fire(16, 208, () => S.chime());
    fire(17, 216, () => S.heartbeat());
    fire(18, 226, () => S.heartbeat());
    fire(19, 238, () => S.setBeds(0.5, 0.4));
    fire(20, 242, () => S.thunder());
    fire(21, 246, () => S.alarm());
    fire(22, 248, () => S.splash());
    fire(23, 250, () => S.alarm());
    fire(24, 252, () => S.thunder());
    fire(25, 254, () => S.alarm());
    fire(26, 258, () => S.splash());
    fire(27, 264, () => S.thunder());
    fire(28, 268, () => S.splash());
    fire(29, 276, () => { S.setBeds(0.05, 0.1); S.chime(); });
  }
}

export function fmtTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export { SHOTS, TOTAL };

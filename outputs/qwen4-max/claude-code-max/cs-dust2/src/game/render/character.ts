import * as THREE from 'three';
import type { Entity, Team, WeaponId } from '../core/types.ts';
import { clamp } from '../core/vecmath.ts';

const box = (w: number, h: number, d: number, mat: THREE.Material): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  m.receiveShadow = false;
  return m;
};

export function buildGun(id: WeaponId, mat: THREE.Material, accent: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  if (id === 'knife') {
    const blade = box(0.03, 0.02, 0.28, accent);
    blade.position.set(0, 0, -0.18);
    const handle = box(0.035, 0.05, 0.12, mat);
    handle.position.set(0, -0.01, 0.02);
    g.add(blade, handle);
    return g;
  }
  const isRifle = id === 'ak47' || id === 'm4a4' || id === 'awp';
  const isPistol = id === 'glock' || id === 'usp' || id === 'deagle';
  const len = id === 'awp' ? 0.95 : isRifle ? 0.72 : 0.26;
  const body = box(0.06, 0.1, len * 0.6, mat);
  body.position.set(0, 0, -len * 0.25);
  const barrel = box(0.035, 0.035, len * 0.5, accent);
  barrel.position.set(0, 0.01, -len * 0.7);
  g.add(body, barrel);
  if (isRifle) {
    const mag = box(0.05, 0.18, 0.08, accent);
    mag.position.set(0, -0.13, -0.12);
    mag.rotation.x = 0.2;
    const stock = box(0.05, 0.09, 0.22, mat);
    stock.position.set(0, -0.02, 0.16);
    const grip = box(0.04, 0.1, 0.05, mat);
    grip.position.set(0, -0.09, 0.02);
    g.add(mag, stock, grip);
    if (id === 'awp') {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.24, 10), accent);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.09, -0.18);
      scope.castShadow = true;
      g.add(scope);
    }
    if (id === 'ak47') {
      const wood = box(0.055, 0.07, 0.2, new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.7 }));
      wood.position.set(0, -0.01, -0.3);
      g.add(wood);
    }
  } else if (isPistol) {
    const grip = box(0.045, 0.12, 0.06, mat);
    grip.position.set(0, -0.09, 0.02);
    grip.rotation.x = 0.25;
    g.add(grip);
  }
  return g;
}

interface Palette {
  cloth: number;
  pants: number;
  vest: number;
  skin: number;
  head: number;
  accent: number;
}

const CT_PALETTE: Palette = { cloth: 0x3c4c5e, pants: 0x2c3540, vest: 0x20262e, skin: 0xd9a37a, head: 0x2b323a, accent: 0x4a5a6a };
const T_PALETTE: Palette = { cloth: 0x9a7b4f, pants: 0x5a4632, vest: 0x6b563a, skin: 0xc98a5a, head: 0x8a3b2a, accent: 0x7a5a34 };

export class CharacterRig {
  root: THREE.Group;
  body: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  gunMount: THREE.Group;
  gun: THREE.Group | null = null;
  private mats: THREE.MeshStandardMaterial[] = [];
  private gunMat: THREE.MeshStandardMaterial;
  private gunAccent: THREE.MeshStandardMaterial;
  private currentGun: WeaponId | null = null;
  team: Team;

  constructor(team: Team) {
    this.team = team;
    const p = team === 'CT' ? CT_PALETTE : T_PALETTE;
    const mat = (color: number, rough = 0.8) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
      this.mats.push(m);
      return m;
    };
    const cloth = mat(p.cloth);
    const pants = mat(p.pants);
    const vest = mat(p.vest, 0.6);
    const skin = mat(p.skin, 0.6);
    const headMat = mat(p.head, 0.7);
    const accent = mat(p.accent, 0.6);
    this.gunMat = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.5, metalness: 0.4 });
    this.gunAccent = new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.4, metalness: 0.5 });

    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);

    // pelvis + torso
    const pelvis = box(0.4, 0.22, 0.24, pants);
    pelvis.position.y = 0.9;
    const torso = box(0.44, 0.55, 0.26, cloth);
    torso.position.y = 1.24;
    const vestMesh = box(0.46, 0.34, 0.29, vest);
    vestMesh.position.y = 1.3;
    this.body.add(pelvis, torso, vestMesh);
    // vest pouches
    for (let i = -1; i <= 1; i++) {
      const pouch = box(0.1, 0.12, 0.06, accent);
      pouch.position.set(i * 0.13, 1.2, -0.16);
      this.body.add(pouch);
    }

    // head
    this.head = new THREE.Group();
    this.head.position.y = 1.5;
    const neck = box(0.12, 0.1, 0.12, skin);
    neck.position.y = 0.02;
    const skull = box(0.24, 0.26, 0.24, skin);
    skull.position.y = 0.2;
    this.head.add(neck, skull);
    if (team === 'CT') {
      const helmet = box(0.27, 0.16, 0.27, headMat);
      helmet.position.y = 0.3;
      const visor = box(0.25, 0.06, 0.04, new THREE.MeshStandardMaterial({ color: 0x11151a, roughness: 0.2, metalness: 0.6 }));
      visor.position.set(0, 0.22, -0.13);
      this.head.add(helmet, visor);
    } else {
      const wrap = box(0.26, 0.12, 0.26, headMat);
      wrap.position.y = 0.3;
      const scarf = box(0.2, 0.1, 0.22, headMat);
      scarf.position.set(0, 0.12, -0.02);
      const tail = box(0.08, 0.22, 0.04, headMat);
      tail.position.set(0.1, 0.1, 0.12);
      this.head.add(wrap, scarf, tail);
    }
    // eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    for (const sx of [-0.06, 0.06]) {
      const eye = box(0.04, 0.03, 0.02, eyeMat);
      eye.position.set(sx, 0.2, -0.125);
      this.head.add(eye);
    }
    this.body.add(this.head);

    // arms (shoulder pivots)
    const makeArm = (side: number): THREE.Group => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.27, 1.44, 0);
      const upper = box(0.14, 0.34, 0.16, cloth);
      upper.position.y = -0.17;
      const elbow = new THREE.Group();
      elbow.position.y = -0.34;
      const fore = box(0.12, 0.3, 0.14, cloth);
      fore.position.y = -0.15;
      const hand = box(0.11, 0.11, 0.12, skin);
      hand.position.y = -0.32;
      elbow.add(fore, hand);
      shoulder.add(upper, elbow);
      return shoulder;
    };
    this.armL = makeArm(-1);
    this.armR = makeArm(1);
    this.body.add(this.armL, this.armR);

    // legs (hip pivots)
    const makeLeg = (side: number): THREE.Group => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.11, 0.86, 0);
      const thigh = box(0.2, 0.42, 0.22, pants);
      thigh.position.y = -0.21;
      const knee = new THREE.Group();
      knee.position.y = -0.42;
      const shin = box(0.17, 0.42, 0.2, pants);
      shin.position.y = -0.21;
      const foot = box(0.18, 0.1, 0.28, new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.9 }));
      foot.position.set(0, -0.45, -0.04);
      knee.add(shin, foot);
      hip.add(thigh, knee);
      return hip;
    };
    this.legL = makeLeg(-1);
    this.legR = makeLeg(1);
    this.body.add(this.legL, this.legR);

    // weapon mount in front of chest
    this.gunMount = new THREE.Group();
    this.gunMount.position.set(0.12, 1.3, -0.34);
    this.body.add(this.gunMount);

    this.setPose();
  }

  private setPose(): void {
    // Both arms raised forward, holding the weapon.
    this.armR.rotation.set(-1.25, 0.15, 0.1);
    this.armL.rotation.set(-1.35, -0.35, -0.25);
    this.armR.children[1].rotation.x = -0.5;
    this.armL.children[1].rotation.x = -0.7;
  }

  setWeapon(id: WeaponId): void {
    if (this.currentGun === id) return;
    this.currentGun = id;
    if (this.gun) this.gunMount.remove(this.gun);
    this.gun = buildGun(id, this.gunMat, this.gunAccent);
    this.gunMount.add(this.gun);
  }

  update(e: Entity, time: number): void {
    this.root.position.set(e.pos.x, e.pos.y, e.pos.z);
    this.root.rotation.y = -e.yaw;
    this.setWeapon(e.inv.primary && e.activeSlot === 'primary' ? e.inv.primary.id : e.activeSlot === 'secondary' ? e.inv.secondary.id : 'knife');

    if (!e.alive) {
      const fall = clamp((time - e.deathT) / 0.5, 0, 1);
      this.body.rotation.x = -fall * Math.PI * 0.5;
      this.body.position.y = -fall * 0.1;
      this.legL.rotation.x = 0.2;
      this.legR.rotation.x = -0.1;
      this.armL.rotation.x = -0.4;
      this.armR.rotation.x = -0.4;
      this.root.visible = true;
      return;
    }
    this.body.rotation.x = 0;
    this.body.position.y = 0;
    const move = clamp(e.speed / 5, 0, 1);
    const swing = Math.sin(e.walkPhase) * 0.6 * move;
    this.legL.rotation.x = swing;
    this.legR.rotation.x = -swing;
    this.body.position.y = Math.abs(Math.sin(e.walkPhase)) * 0.03 * move;
    // arms stay in aim pose with subtle motion
    this.armR.rotation.x = -1.25 + swing * 0.06;
    this.armL.rotation.x = -1.35 - swing * 0.06;
    this.head.rotation.x = clamp(e.pitch, -0.6, 0.6) * 0.4;
    this.head.rotation.y = 0;

    // hit flash
    const flash = e.hitFlash > 0 ? 0.6 : 0;
    for (const m of this.mats) {
      m.emissive.setRGB(flash, 0, 0);
    }
  }

  dispose(): void {
    this.root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    });
    for (const m of this.mats) m.dispose();
    this.gunMat.dispose();
    this.gunAccent.dispose();
  }
}

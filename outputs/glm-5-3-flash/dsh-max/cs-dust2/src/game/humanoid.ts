/**
 * humanoid.ts — fully procedural humanoid character rig (no external models).
 * Independent head, torso, two arms (shoulder+elbow), two legs (hip+knee),
 * plus a third-person weapon model that follows the body aim.
 */

import * as THREE from 'three';
import { WEAPONS } from './weapons';

export type Team = 'T' | 'CT';

const geoCache = new Map<string, THREE.BoxGeometry>();
function boxGeo(w: number, h: number, d: number): THREE.BoxGeometry {
  const k = `${w}|${h}|${d}`;
  let g = geoCache.get(k);
  if (!g) { g = new THREE.BoxGeometry(w, h, d); geoCache.set(k, g); }
  return g;
}

export interface Palette {
  skin: number; shirt: number; pants: number; boots: number;
  accent: number; vest: number; gear: number;
}

export const PALETTES: Record<Team, Palette> = {
  T: { skin: 0xcaa06a, shirt: 0xb08c4e, pants: 0x7d6845, boots: 0x40372a, accent: 0xb0382a, vest: 0x6f5c40, gear: 0x332d24 },
  CT: { skin: 0xd0a583, shirt: 0x4f6280, pants: 0x3a4459, boots: 0x22252d, accent: 0x2e3d5c, vest: 0x27324a, gear: 0x1d222c },
};

export function mat(color: number, opts: { flat?: boolean; emissive?: number } = {}): THREE.MeshLambertMaterial {
  const m = new THREE.MeshLambertMaterial({ color });
  if (opts.emissive !== undefined) m.emissive = new THREE.Color(opts.emissive);
  return m;
}

function part(parent: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(boxGeo(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}

/* ------------------------------------------------------------------ */
/* third-person weapon models                                          */
/* ------------------------------------------------------------------ */

const gunCache = new Map<string, THREE.Group>();

export function buildGunModel(model: string): THREE.Group {
  const hit = gunCache.get(model);
  if (hit) return hit.clone(true);
  const g = new THREE.Group();
  const dark = mat(0x22242a);
  const metal = mat(0x4a4d55);
  const wood = mat(0x7a4f2a);
  const green = mat(0x3f4a3a);
  const blade = mat(0xb9c0c9);
  const grip = mat(0x17181c);

  switch (model) {
    case 'rifle_t': { // AK-47-ish
      part(g, 0.07, 0.11, 0.72, dark, 0, 0, 0.16);          // receiver + barrel shroud
      part(g, 0.05, 0.05, 0.34, metal, 0, 0.005, 0.62);     // barrel
      part(g, 0.06, 0.10, 0.26, wood, 0, -0.015, 0.44);     // handguard
      part(g, 0.07, 0.14, 0.26, wood, 0, -0.05, -0.14);     // stock
      part(g, 0.05, 0.16, 0.09, dark, 0, -0.12, 0.02);      // magazine (curved feel)
      part(g, 0.045, 0.12, 0.06, grip, 0, -0.11, -0.08);    // pistol grip
      part(g, 0.02, 0.05, 0.02, dark, 0, 0.075, -0.02);     // front sight
      break;
    }
    case 'rifle_ct': { // M4A4-ish
      part(g, 0.07, 0.11, 0.66, dark, 0, 0, 0.14);
      part(g, 0.05, 0.05, 0.36, metal, 0, 0.005, 0.6);
      part(g, 0.065, 0.065, 0.28, dark, 0, -0.005, 0.42);   // round handguard box
      part(g, 0.06, 0.12, 0.22, dark, 0, -0.04, -0.16);     // stock
      part(g, 0.05, 0.15, 0.08, grip, 0, -0.12, 0.04);      // mag
      part(g, 0.045, 0.11, 0.055, grip, 0, -0.10, -0.06);
      part(g, 0.03, 0.045, 0.22, dark, 0, 0.085, 0.1);      // carry handle / rail
      break;
    }
    case 'awp': {
      part(g, 0.075, 0.12, 0.95, green, 0, 0, 0.22);
      part(g, 0.05, 0.05, 0.5, dark, 0, 0.01, 0.85);
      part(g, 0.07, 0.16, 0.3, green, 0, -0.05, -0.2);      // stock
      part(g, 0.05, 0.1, 0.26, green, 0, -0.09, 0.14);      // bottom rail
      part(g, 0.055, 0.055, 0.34, dark, 0, 0.11, 0.2);      // scope tube
      part(g, 0.07, 0.07, 0.05, dark, 0, 0.11, 0.02);       // scope objective
      part(g, 0.05, 0.13, 0.07, grip, 0, -0.11, -0.02);
      break;
    }
    case 'pistol_t': case 'pistol_ct': {
      const c = model === 'pistol_t' ? 0x2b2e33 : 0x35383f;
      part(g, 0.05, 0.09, 0.3, mat(c), 0, 0, 0.1);
      part(g, 0.045, 0.13, 0.06, grip, 0, -0.09, -0.03);
      part(g, 0.02, 0.03, 0.05, dark, 0, 0.05, 0.24);
      break;
    }
    case 'deagle': {
      part(g, 0.055, 0.1, 0.34, metal, 0, 0.01, 0.1);
      part(g, 0.05, 0.13, 0.06, grip, 0, -0.1, -0.02);
      break;
    }
    case 'knife': {
      part(g, 0.035, 0.05, 0.3, blade, 0, 0.01, 0.2);
      part(g, 0.03, 0.09, 0.12, grip, 0, -0.01, -0.02);
      break;
    }
    default: {
      part(g, 0.06, 0.1, 0.5, dark, 0, 0, 0.2);
    }
  }
  gunCache.set(model, g);
  const c = g.clone(true);
  return c;
}

/* ------------------------------------------------------------------ */
/* the rig                                                             */
/* ------------------------------------------------------------------ */

export class Humanoid {
  root = new THREE.Group();
  body = new THREE.Group();     // yaw carrier (== root rotation, keeps hierarchy tidy)
  upper = new THREE.Group();    // torso + head + arms, pitches with aim
  legL = new THREE.Group();
  legR = new THREE.Group();
  kneeL = new THREE.Group();
  kneeR = new THREE.Group();
  armL = new THREE.Group();
  armR = new THREE.Group();
  elbowL = new THREE.Group();
  elbowR = new THREE.Group();
  head = new THREE.Group();
  gunMount = new THREE.Group();
  gun: THREE.Group | null = null;
  gunModel = '';
  mats: THREE.MeshLambertMaterial[] = [];
  palette: Palette;
  team: Team;

  constructor(team: Team) {
    this.team = team;
    this.palette = PALETTES[team];
    const p = this.palette;
    const skin = mat(p.skin), shirt = mat(p.shirt), pants = mat(p.pants), boots = mat(p.boots);
    const accent = mat(p.accent), vest = mat(p.vest), gear = mat(p.gear);
    this.mats = [skin, shirt, pants, boots, accent, vest, gear];

    // hips / legs -----------------------------------------------------
    this.root.add(this.body);
    this.body.position.y = 0.92;
    this.body.add(this.legL, this.legR);
    this.legL.position.set(-0.115, 0, 0);
    this.legR.position.set(0.115, 0, 0);
    for (const [hip, knee, side] of [[this.legL, this.kneeL, -1], [this.legR, this.kneeR, 1]] as const) {
      part(hip, 0.18, 0.46, 0.2, pants, 0, -0.23, 0);
      knee.position.set(0, -0.46, 0);
      hip.add(knee);
      part(knee, 0.15, 0.42, 0.17, pants, 0, -0.21, 0);
      part(knee, 0.16, 0.1, 0.29, boots, 0, -0.42, 0.05);
      part(hip, 0.2, 0.16, 0.24, pants, 0, 0.02, 0);   // hip pad
      void side;
    }

    // upper body ------------------------------------------------------
    this.upper.position.y = 0.0;
    this.body.add(this.upper);
    part(this.upper, 0.44, 0.52, 0.25, shirt, 0, 0.27, 0);          // torso
    part(this.upper, 0.47, 0.32, 0.3, vest, 0, 0.26, 0.0);          // vest
    part(this.upper, 0.14, 0.3, 0.1, gear, -0.16, 0.3, 0.16);       // pouches
    part(this.upper, 0.14, 0.3, 0.1, gear, 0.16, 0.3, 0.16);
    part(this.upper, 0.46, 0.1, 0.27, pants, 0, 0.01, 0);           // belt

    // head ------------------------------------------------------------
    this.head.position.set(0, 0.56, 0);
    this.upper.add(this.head);
    part(this.head, 0.22, 0.24, 0.23, skin, 0, 0.12, 0);            // skull
    part(this.head, 0.19, 0.11, 0.02, gear, 0, 0.1, 0.115);         // face / shades
    if (team === 'CT') {
      part(this.head, 0.25, 0.13, 0.26, accent, 0, 0.22, -0.005);   // helmet
      part(this.head, 0.24, 0.05, 0.05, accent, 0, 0.16, 0.1);      // brim
    } else {
      part(this.head, 0.235, 0.08, 0.245, accent, 0, 0.2, -0.005);  // bandana
      part(this.head, 0.06, 0.1, 0.05, accent, 0.1, 0.15, -0.09);   // knot
      part(this.head, 0.2, 0.16, 0.06, mat(0x2c2419), 0, 0.13, -0.1); // hair
    }

    // arms ------------------------------------------------------------
    this.armL.position.set(-0.28, 0.46, 0);
    this.armR.position.set(0.28, 0.46, 0);
    this.upper.add(this.armL, this.armR);
    for (const [shoulder, elbow, s] of [[this.armL, this.elbowL, -1], [this.armR, this.elbowR, 1]] as const) {
      part(shoulder, 0.13, 0.34, 0.14, shirt, 0, -0.17, 0);
      elbow.position.set(0, -0.34, 0);
      shoulder.add(elbow);
      part(elbow, 0.115, 0.3, 0.12, shirt, 0, -0.14, 0.02);
      part(elbow, 0.1, 0.1, 0.1, skin, 0, -0.3, 0.03);              // hand
      void s;
    }

    // weapon mount ----------------------------------------------------
    this.gunMount.position.set(0.13, 0.33, 0.3);
    this.upper.add(this.gunMount);
  }

  setWeapon(model: string) {
    if (this.gunModel === model) return;
    this.gunModel = model;
    if (this.gun) { this.gunMount.remove(this.gun); this.gun = null; }
    if (!model) return;
    const g = buildGunModel(model);
    g.rotation.set(0, 0, 0);
    this.gun = g;
    this.gunMount.add(g);
  }

  /**
   * animation driver
   * speed : horizontal speed in m/s     phase : walk cycle time
   * crouch: 0..1                        air   : airborne
   * pitch : aim pitch (radians, positive = looking up)
   */
  animate(phase: number, speed: number, crouch: number, air: boolean, pitch: number, dead: number, planting: number) {
    if (dead > 0) {
      const t = Math.min(1, dead / 0.55);
      const ease = 1 - Math.pow(1 - t, 3);
      this.root.rotation.z = ease * 1.45;
      this.root.position.y = -0.62 * ease;
      this.upper.rotation.x = ease * 0.35;
      this.head.rotation.x = ease * 0.5;
      this.armL.rotation.x = ease * -0.6;
      this.armR.rotation.x = ease * -0.4;
      this.legL.rotation.x = ease * 0.4;
      this.legR.rotation.x = ease * -0.25;
      this.gunMount.rotation.x = ease * -0.7;
      return;
    }
    this.root.rotation.z = 0;

    const sp = Math.min(1, speed / 5.6);
    const swing = sp * 0.75;
    const s = Math.sin(phase * 9);

    // legs
    if (air) {
      this.legL.rotation.x = -0.35; this.legR.rotation.x = 0.25;
      this.kneeL.rotation.x = 0.5; this.kneeR.rotation.x = 0.35;
    } else {
      this.legL.rotation.x = s * swing;
      this.legR.rotation.x = -s * swing;
      this.kneeL.rotation.x = Math.max(0, -s) * swing * 1.3;
      this.kneeR.rotation.x = Math.max(0, s) * swing * 1.3;
    }

    // body bob + crouch
    const bob = air ? 0 : Math.abs(Math.sin(phase * 9)) * 0.045 * sp;
    this.body.position.y = 0.92 - crouch * 0.34 + bob;
    this.upper.rotation.x = THREE.MathUtils.lerp(0.02, 0.35, crouch) + pitch * 0.55 + (planting > 0 ? 0.5 : 0);
    this.upper.rotation.y = Math.sin(phase * 4.5) * 0.03 * sp;

    // head follows aim a bit
    this.head.rotation.x = pitch * 0.35 + (planting > 0 ? 0.35 : 0);

    // arms hold the weapon forward
    const hold = this.gunModel === 'knife' ? 0.9 : 1.0;
    const plantDrop = planting > 0 ? 0.9 : 0;
    this.armL.rotation.x = -1.15 * hold + pitch * 0.4 - plantDrop + s * 0.05 * sp;
    this.armR.rotation.x = -1.05 * hold + pitch * 0.4 - plantDrop - s * 0.05 * sp;
    this.armL.rotation.z = 0.42 + (this.gunModel === 'knife' ? 0.2 : 0);
    this.armR.rotation.z = -0.34;
    this.elbowL.rotation.x = -0.85 * hold;
    this.elbowR.rotation.x = -1.15 * hold;
    this.gunMount.rotation.x = pitch * 0.9;
    this.gunMount.position.set(0.13 - plantDrop * 0.05, 0.33 - plantDrop * 0.16, 0.3 - plantDrop * 0.16);
  }

  /** flash the model red/white briefly when hit */
  flash(color: number, ms: number) {
    for (const m of this.mats) m.emissive.setHex(color);
    if (this.gun) return;
    void ms;
  }
  clearFlash() {
    for (const m of this.mats) m.emissive.setHex(0x000000);
  }
}

/** weapon model key used for the third person view of a held weapon */
export function worldModelFor(weaponId: string | null): string {
  if (!weaponId) return '';
  return WEAPONS[weaponId]?.model ?? '';
}

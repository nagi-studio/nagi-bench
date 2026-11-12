/**
 * Procedural geometry: textures (canvas-generated), humanoid characters, weapon models.
 */
import * as THREE from 'three';
import type { Team } from './weapons';

// ------------------------------------------------------------------ textures

function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function speckle(g: CanvasRenderingContext2D, s: number, n: number, colors: string[], maxR: number) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[(Math.random() * colors.length) | 0];
    g.globalAlpha = 0.15 + Math.random() * 0.35;
    const r = Math.random() * maxR + 0.5;
    g.fillRect(Math.random() * s, Math.random() * s, r, r);
  }
  g.globalAlpha = 1;
}

export const Textures = {
  sand: () =>
    canvasTex(256, (g, s) => {
      g.fillStyle = '#c9a96e';
      g.fillRect(0, 0, s, s);
      speckle(g, s, 5000, ['#b8955a', '#d8bb84', '#a98850', '#e2c893'], 3);
    }),
  wall: () =>
    canvasTex(256, (g, s) => {
      g.fillStyle = '#d4b483';
      g.fillRect(0, 0, s, s);
      speckle(g, s, 3500, ['#c2a06c', '#e0c595', '#b49260'], 4);
      g.strokeStyle = 'rgba(120,90,50,0.35)';
      g.lineWidth = 2;
      const rows = 4;
      for (let r = 0; r <= rows; r++) {
        const y = (r * s) / rows;
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(s, y);
        g.stroke();
        const off = r % 2 ? s / 4 : 0;
        for (let x = off; x < s; x += s / 2) {
          g.beginPath();
          g.moveTo(x, y);
          g.lineTo(x, y + s / rows);
          g.stroke();
        }
      }
    }),
  crate: () =>
    canvasTex(128, (g, s) => {
      g.fillStyle = '#8a6237';
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 6; i++) {
        g.fillStyle = i % 2 ? '#7d5730' : '#936a3e';
        g.fillRect(0, (i * s) / 6, s, s / 6 - 2);
      }
      speckle(g, s, 600, ['#5e4022', '#a37a4a'], 2);
      g.strokeStyle = '#4a3218';
      g.lineWidth = 8;
      g.strokeRect(4, 4, s - 8, s - 8);
      g.beginPath();
      g.moveTo(4, 4);
      g.lineTo(s - 4, s - 4);
      g.stroke();
    }),
  door: () =>
    canvasTex(128, (g, s) => {
      g.fillStyle = '#5b4126';
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#4f381f' : '#664a2c';
        g.fillRect((i * s) / 8, 0, s / 8 - 1, s);
      }
      g.fillStyle = '#2b2b2b';
      g.fillRect(0, s * 0.2, s, 6);
      g.fillRect(0, s * 0.75, s, 6);
    }),
};

// ------------------------------------------------------------------ helpers

const boxGeoCache = new Map<string, THREE.BoxGeometry>();
function boxGeo(w: number, h: number, d: number) {
  const k = `${w}|${h}|${d}`;
  let g = boxGeoCache.get(k);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    boxGeoCache.set(k, g);
  }
  return g;
}
const matCache = new Map<number, THREE.MeshStandardMaterial>();
export function mat(color: number, rough = 0.8, metal = 0.05) {
  const k = color * 1000 + Math.round(rough * 10) * 10 + Math.round(metal * 10);
  let m = matCache.get(k);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    matCache.set(k, m);
  }
  return m;
}

function box(w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0, rough = 0.8, metal = 0.05) {
  const m = new THREE.Mesh(boxGeo(w, h, d), mat(color, rough, metal));
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

/** a box stretched between two points (for limbs) */
function limb(a: THREE.Vector3, b: THREE.Vector3, thick: number, color: number) {
  const len = a.distanceTo(b);
  const m = new THREE.Mesh(boxGeo(thick, thick, len), mat(color));
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.lookAt(b);
  m.castShadow = true;
  return m;
}

// ------------------------------------------------------------------ weapons

/** Weapon model; origin at the grip, barrel pointing -Z. */
export function buildGun(id: string): THREE.Group {
  const g = new THREE.Group();
  const black = 0x1d1d1f, dark = 0x2e3035, wood = 0x7a4a22, metal = 0x55585e;
  switch (id) {
    case 'ak47':
      g.add(box(0.06, 0.08, 0.42, black, 0, 0.05, -0.12, 0.5, 0.6)); // receiver
      g.add(box(0.05, 0.05, 0.22, wood, 0, 0.04, -0.42)); // handguard
      g.add(box(0.025, 0.025, 0.28, metal, 0, 0.07, -0.62, 0.4, 0.8)); // barrel
      g.add(box(0.02, 0.05, 0.02, black, 0, 0.11, -0.72)); // front sight
      g.add(box(0.055, 0.1, 0.28, wood, 0, 0.0, 0.2)); // stock
      g.add(box(0.04, 0.1, 0.05, wood, 0, -0.04, 0.0)); // grip
      {
        const mag = box(0.045, 0.2, 0.07, 0x3a2a1a, 0, -0.08, -0.2);
        mag.rotation.x = -0.35;
        g.add(mag);
      }
      break;
    case 'm4a4':
      g.add(box(0.06, 0.09, 0.4, dark, 0, 0.05, -0.1, 0.5, 0.5));
      g.add(box(0.065, 0.065, 0.24, black, 0, 0.045, -0.42));
      g.add(box(0.022, 0.022, 0.24, metal, 0, 0.05, -0.64, 0.4, 0.8));
      g.add(box(0.03, 0.05, 0.16, black, 0, 0.12, -0.08)); // carry handle
      g.add(box(0.05, 0.09, 0.24, black, 0, 0.02, 0.2)); // stock
      g.add(box(0.04, 0.1, 0.05, black, 0, -0.04, 0.0));
      g.add(box(0.04, 0.18, 0.065, dark, 0, -0.08, -0.18));
      break;
    case 'awp':
      g.add(box(0.07, 0.1, 0.5, 0x3e5b39, 0, 0.04, -0.1));
      g.add(box(0.03, 0.03, 0.5, black, 0, 0.06, -0.6, 0.4, 0.8));
      g.add(box(0.035, 0.035, 0.06, black, 0, 0.06, -0.86)); // muzzle brake
      g.add(box(0.07, 0.13, 0.32, 0x3e5b39, 0, 0.0, 0.3)); // stock
      g.add(box(0.04, 0.1, 0.05, black, 0, -0.05, 0.02));
      g.add(box(0.045, 0.12, 0.08, black, 0, -0.07, -0.14));
      {
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.32, 10), mat(black, 0.4, 0.6));
        scope.rotation.x = Math.PI / 2;
        scope.position.set(0, 0.15, -0.1);
        g.add(scope);
        g.add(box(0.02, 0.05, 0.02, black, 0, 0.11, -0.02));
        g.add(box(0.02, 0.05, 0.02, black, 0, 0.11, -0.18));
      }
      break;
    case 'glock':
      g.add(box(0.035, 0.04, 0.19, 0x2a2a2a, 0, 0.05, -0.06, 0.6));
      g.add(box(0.032, 0.11, 0.05, 0x1f1f1f, 0, -0.02, 0.0));
      break;
    case 'usp':
      g.add(box(0.035, 0.04, 0.2, 0x3a3a3a, 0, 0.05, -0.06, 0.5, 0.4));
      g.add(box(0.03, 0.03, 0.12, black, 0, 0.05, -0.21)); // suppressor
      g.add(box(0.032, 0.11, 0.05, 0x222222, 0, -0.02, 0.0));
      break;
    case 'deagle':
      g.add(box(0.045, 0.06, 0.26, 0xa0a0a6, 0, 0.055, -0.08, 0.3, 0.9));
      g.add(box(0.04, 0.12, 0.06, 0x202020, 0, -0.02, 0.0));
      break;
    case 'knife':
    default: {
      g.add(box(0.03, 0.035, 0.11, 0x1a1a1a, 0, 0, 0.0));
      const blade = box(0.006, 0.04, 0.2, 0xd0d4d8, 0, 0.005, -0.15, 0.2, 1);
      g.add(blade);
      g.add(box(0.05, 0.05, 0.015, 0x444444, 0, 0, -0.055));
    }
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true;
  });
  return g;
}

/** Muzzle offset (in gun-local space, metres) */
export function muzzleOffset(id: string) {
  switch (id) {
    case 'ak47': return -0.78;
    case 'm4a4': return -0.78;
    case 'awp': return -0.9;
    case 'usp': return -0.28;
    case 'deagle': return -0.22;
    case 'glock': return -0.16;
    default: return -0.2;
  }
}

// ------------------------------------------------------------------ characters

export interface CharacterRig {
  root: THREE.Group;
  body: THREE.Group; // rotates for death fall
  upper: THREE.Group; // pitches to aim
  legL: THREE.Group;
  legR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  gunMount: THREE.Group;
  gun: THREE.Group | null;
  gunId: string;
  bomb: THREE.Mesh;
}

const TEAM_STYLE: Record<Team, { shirt: number; pants: number; vest: number; head: number; accent: number; skin: number }> = {
  T: { shirt: 0xb48a52, pants: 0x5c4a35, vest: 0x6b5a3c, head: 0x1a1a1a, accent: 0xc0392b, skin: 0xc79a74 },
  CT: { shirt: 0x2d4a7c, pants: 0x34404f, vest: 0x1f2a38, head: 0x26354d, accent: 0x4fa3ff, skin: 0xd8ad8a },
};

export function buildCharacter(team: Team): CharacterRig {
  const st = TEAM_STYLE[team];
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // ---- legs (pivot at hip)
  const mkLeg = (side: number) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.11, 0.92, 0);
    hip.add(box(0.17, 0.46, 0.19, st.pants, 0, -0.23, 0));
    const knee = new THREE.Group();
    knee.position.set(0, -0.46, 0);
    knee.add(box(0.15, 0.42, 0.17, st.pants, 0, -0.21, 0));
    knee.add(box(0.16, 0.08, 0.27, 0x2a2018, 0, -0.42, -0.04)); // boot
    if (team === 'CT') knee.add(box(0.17, 0.12, 0.05, 0x111111, 0, -0.02, -0.1)); // knee pad
    hip.add(knee);
    body.add(hip);
    return { hip, knee };
  };
  const L = mkLeg(-1);
  const R = mkLeg(1);

  // ---- upper body (pivot at waist)
  const upper = new THREE.Group();
  upper.position.set(0, 0.95, 0);
  body.add(upper);
  upper.add(box(0.38, 0.14, 0.22, st.pants, 0, 0.05, 0)); // pelvis/belt
  upper.add(box(0.44, 0.52, 0.25, st.shirt, 0, 0.36, 0)); // torso
  upper.add(box(0.46, 0.38, 0.29, st.vest, 0, 0.4, 0, 0.9)); // vest
  upper.add(box(0.2, 0.12, 0.04, st.accent, 0, 0.5, -0.15)); // chest patch (team colour)
  // neck & head
  upper.add(box(0.1, 0.08, 0.1, st.skin, 0, 0.66, 0));
  const head = new THREE.Group();
  head.position.set(0, 0.8, 0);
  upper.add(head);
  head.add(box(0.21, 0.24, 0.23, team === 'T' ? st.head : st.skin, 0, 0, 0)); // head / balaclava
  if (team === 'T') {
    head.add(box(0.215, 0.05, 0.2, st.skin, 0, 0.03, -0.03)); // eye slit
    head.add(box(0.225, 0.06, 0.235, st.accent, 0, 0.1, 0)); // red bandana
    head.add(box(0.06, 0.04, 0.04, st.accent, 0, 0.09, 0.13)); // knot
  } else {
    head.add(box(0.25, 0.12, 0.27, st.head, 0, 0.1, 0.01, 0.5, 0.3)); // helmet dome
    head.add(box(0.26, 0.03, 0.29, st.head, 0, 0.04, 0.0, 0.5, 0.3)); // helmet brim
    head.add(box(0.18, 0.05, 0.03, 0x0d0d0d, 0, 0.0, -0.12, 0.2, 0.5)); // goggles
  }
  // shoulders → arms in a rifle-holding pose (static relative to upper body)
  const sh = 0.58;
  const rShoulder = new THREE.Vector3(0.25, sh, 0);
  const rElbow = new THREE.Vector3(0.27, sh - 0.25, -0.14);
  const rHand = new THREE.Vector3(0.11, sh - 0.22, -0.34);
  const lShoulder = new THREE.Vector3(-0.25, sh, 0);
  const lElbow = new THREE.Vector3(-0.17, sh - 0.24, -0.3);
  const lHand = new THREE.Vector3(0.05, sh - 0.17, -0.58);
  upper.add(box(0.13, 0.12, 0.2, st.vest, 0.25, sh + 0.02, 0)); // shoulder pads
  upper.add(box(0.13, 0.12, 0.2, st.vest, -0.25, sh + 0.02, 0));
  upper.add(limb(rShoulder, rElbow, 0.11, st.shirt));
  upper.add(limb(rElbow, rHand, 0.095, st.shirt));
  upper.add(limb(lShoulder, lElbow, 0.11, st.shirt));
  upper.add(limb(lElbow, lHand, 0.095, st.shirt));
  upper.add(box(0.09, 0.09, 0.09, 0x222222, rHand.x, rHand.y, rHand.z)); // gloves
  upper.add(box(0.09, 0.09, 0.09, 0x222222, lHand.x, lHand.y, lHand.z));
  upper.add(box(0.06, 0.06, 0.06, st.accent, -0.25, sh - 0.1, 0.0)); // armband

  const gunMount = new THREE.Group();
  gunMount.position.set(0.1, sh - 0.16, -0.36);
  upper.add(gunMount);

  // backpack bomb (visible when carrier)
  const bomb = box(0.26, 0.2, 0.12, 0x3a3a2a, 0, 0.38, 0.19);
  bomb.add(box(0.08, 0.05, 0.02, 0xff2a2a, 0.05, 0.04, 0.065));
  bomb.visible = false;
  upper.add(bomb);

  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      (o as THREE.Mesh).castShadow = true;
      (o as THREE.Mesh).receiveShadow = false;
    }
  });

  return { root, body, upper, legL: L.hip, legR: R.hip, kneeL: L.knee, kneeR: R.knee, gunMount, gun: null, gunId: '', bomb };
}

export function setRigWeapon(rig: CharacterRig, id: string) {
  if (rig.gunId === id) return;
  if (rig.gun) rig.gunMount.remove(rig.gun);
  rig.gun = buildGun(id);
  rig.gunMount.add(rig.gun);
  rig.gunId = id;
}

// ------------------------------------------------------------------ first-person view model

export interface ViewModel {
  root: THREE.Group;
  gunHolder: THREE.Group;
  gun: THREE.Group | null;
  gunId: string;
  flash: THREE.Mesh;
  flashLight: THREE.PointLight;
}

export function buildViewModel(team: Team): ViewModel {
  const st = TEAM_STYLE[team];
  const root = new THREE.Group();
  const gunHolder = new THREE.Group();
  root.add(gunHolder);
  // arms: from bottom of screen to the gun
  const sleeve = st.shirt;
  const rArm = limb(new THREE.Vector3(0.22, -0.32, 0.25), new THREE.Vector3(0.02, -0.04, -0.02), 0.085, sleeve);
  const lArm = limb(new THREE.Vector3(-0.2, -0.35, 0.1), new THREE.Vector3(-0.01, -0.0, -0.3), 0.08, sleeve);
  const rGlove = box(0.075, 0.08, 0.09, 0x1c1c1c, 0.0, -0.03, 0.0);
  const lGlove = box(0.075, 0.07, 0.09, 0x1c1c1c, -0.01, 0.01, -0.32);
  root.add(rArm, lArm, rGlove, lGlove);
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 6, 4),
    new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.95 })
  );
  flash.visible = false;
  root.add(flash);
  const flashLight = new THREE.PointLight(0xffb050, 0, 6);
  root.add(flashLight);
  return { root, gunHolder, gun: null, gunId: '', flash, flashLight };
}

export function setViewModelWeapon(vm: ViewModel, id: string) {
  if (vm.gunId === id) return;
  if (vm.gun) vm.gunHolder.remove(vm.gun);
  vm.gun = buildGun(id);
  vm.gun.traverse((o) => ((o as THREE.Mesh).castShadow = false));
  vm.gunHolder.add(vm.gun);
  vm.gunId = id;
  const z = muzzleOffset(id);
  vm.flash.position.set(0, 0.06, z - 0.05);
  vm.flashLight.position.copy(vm.flash.position);
}

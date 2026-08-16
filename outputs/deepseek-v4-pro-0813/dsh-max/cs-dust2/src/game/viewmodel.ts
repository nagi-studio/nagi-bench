// 第一人称手持模型（程序化）
import * as THREE from 'three';
import { WeaponId } from './config';

export interface Viewmodel {
  group: THREE.Group;
  muzzle: THREE.Object3D;
  flash: THREE.Mesh;
  magGroup?: THREE.Group;
  parts: { name: string; obj: THREE.Object3D }[];
}

function mat(color: number) {
  return new THREE.MeshLambertMaterial({ color });
}

function add(g: THREE.Group, name: string, w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  m.name = name;
  g.add(m);
  return m;
}

/** 构建第一人称武器模型。原点大致在握把处，-Z 为枪口方向。 */
export function buildViewmodel(id: WeaponId): Viewmodel {
  const g = new THREE.Group();
  const parts: { name: string; obj: THREE.Object3D }[] = [];
  const track = (name: string, obj: THREE.Object3D) => {
    parts.push({ name, obj });
    return obj;
  };
  const muzzle = new THREE.Object3D();
  const flash = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
  );
  flash.visible = false;
  g.add(muzzle);
  muzzle.add(flash);

  if (id === 'ak47') {
    track('receiver', add(g, 'receiver', 0.07, 0.1, 0.4, 0x3a3f46, 0, 0.02, 0.05));
    track('barrel', add(g, 'barrel', 0.035, 0.035, 0.3, 0x2a2e33, 0, 0.075, -0.3));
    track('wood', add(g, 'wood', 0.06, 0.09, 0.18, 0x8a5a34, 0, -0.01, -0.24));
    track('stock', add(g, 'stock', 0.06, 0.1, 0.18, 0x8a5a34, 0, -0.04, 0.33));
    const mag = new THREE.Group();
    mag.position.set(0, -0.09, 0.02);
    track('mag', add(mag, 'magmesh', 0.05, 0.14, 0.09, 0x5a4632, 0, 0, 0.02));
    track('maggroup', mag);
    track('sight', add(g, 'sight', 0.03, 0.05, 0.02, 0x22262a, 0, 0.1, -0.32));
    muzzle.position.set(0, 0.075, -0.45);
  } else if (id === 'm4a4') {
    track('receiver', add(g, 'receiver', 0.07, 0.1, 0.42, 0x33383f, 0, 0.02, 0.03));
    track('barrel', add(g, 'barrel', 0.035, 0.035, 0.28, 0x2a2e33, 0, 0.075, -0.28));
    track('hand', add(g, 'hand', 0.06, 0.09, 0.2, 0x1c1f23, 0, -0.01, -0.22));
    track('stock', add(g, 'stock', 0.06, 0.08, 0.22, 0x1c1f23, 0, -0.03, 0.32));
    const mag = new THREE.Group();
    mag.position.set(0, -0.09, 0.02);
    track('mag', add(mag, 'magmesh', 0.05, 0.15, 0.08, 0x1c1f23, 0, 0, 0.02));
    track('maggroup', mag);
    track('carry', add(g, 'carry', 0.05, 0.04, 0.09, 0x1c1f23, 0, 0.11, -0.08));
    muzzle.position.set(0, 0.075, -0.43);
  } else if (id === 'awp') {
    track('receiver', add(g, 'receiver', 0.07, 0.1, 0.48, 0x3c4a3a, 0, 0.02, 0.02));
    track('barrel', add(g, 'barrel', 0.04, 0.04, 0.4, 0x2a2e33, 0, 0.075, -0.4));
    track('stock', add(g, 'stock', 0.06, 0.08, 0.2, 0x22261f, 0, -0.03, 0.34));
    track('scope', add(g, 'scope', 0.05, 0.05, 0.18, 0x111318, 0, 0.12, -0.05));
    const mag = new THREE.Group();
    mag.position.set(0, -0.09, 0.04);
    track('mag', add(mag, 'magmesh', 0.05, 0.1, 0.08, 0x22261f, 0, 0, 0.02));
    track('maggroup', mag);
    muzzle.position.set(0, 0.075, -0.62);
  } else if (id === 'glock' || id === 'usp') {
    const dark = id === 'glock' ? 0x2c2f33 : 0x3a3f46;
    track('slide', add(g, 'slide', 0.055, 0.07, 0.24, dark, 0, 0.06, 0));
    track('frame', add(g, 'frame', 0.06, 0.12, 0.1, dark, 0, -0.045, 0.06));
    track('barrel', add(g, 'barrel', 0.035, 0.035, 0.05, 0x22262a, 0, 0.06, -0.15));
    muzzle.position.set(0, 0.06, -0.16);
  } else if (id === 'deagle') {
    track('slide', add(g, 'slide', 0.065, 0.08, 0.3, 0x555b63, 0, 0.06, 0));
    track('frame', add(g, 'frame', 0.07, 0.14, 0.1, 0x33383f, 0, -0.05, 0.06));
    track('barrel', add(g, 'barrel', 0.04, 0.04, 0.08, 0x22262a, 0, 0.06, -0.2));
    muzzle.position.set(0, 0.06, -0.22);
  } else {
    // knife
    track('blade', add(g, 'blade', 0.03, 0.06, 0.22, 0xb8bcc2, 0, 0.08, -0.1));
    track('guard', add(g, 'guard', 0.08, 0.02, 0.02, 0x2c2f33, 0, 0.05, 0.02));
    track('handle', add(g, 'handle', 0.04, 0.04, 0.12, 0x3a2f22, 0, 0.05, 0.08));
    muzzle.position.set(0, 0.08, -0.22);
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = false;
  });
  return { group: g, muzzle, flash, magGroup: parts.find((p) => p.name === 'maggroup')?.obj as THREE.Group | undefined, parts };
}

/** C4 手持模型 */
export function buildBombViewmodel(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.42), mat(0x4a5a3a));
  g.add(body);
  const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.02), mat(0x1c1f23));
  keypad.position.set(0, 0.12, 0.1);
  g.add(keypad);
  const light = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    new THREE.MeshLambertMaterial({ color: 0xff3333, emissive: 0xff2222, emissiveIntensity: 1 })
  );
  light.position.set(0.1, 0.1, 0.15);
  g.add(light);
  return g;
}

// Procedural weapon meshes. The same silhouette serves the third-person world
// model (parented to a character's hands) and the first-person viewmodel
// (parented to the camera). Barrels point down -Z; a `muzzle` empty marks the
// tip for flash + tracer spawning.

import * as THREE from 'three';
import { WeaponId } from '../types';

export interface WeaponMesh {
  group: THREE.Group;
  muzzle: THREE.Object3D;
}

function part(
  g: THREE.Group, w: number, h: number, d: number, color: number,
  x: number, y: number, z: number, rotX = 0, metal = 0.4, rough = 0.5,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough }),
  );
  mesh.position.set(x, y, z);
  mesh.rotation.x = rotX;
  mesh.castShadow = true;
  g.add(mesh);
  return mesh;
}

const BLACK = 0x1c1d1f;
const STEEL = 0x9aa0a6;
const WOOD = 0x6b4a2a;
const TAN = 0x8a7a55;

function buildRifle(id: WeaponId): WeaponMesh {
  const g = new THREE.Group();
  const accent = id === 'ak47' ? WOOD : TAN;
  part(g, 0.07, 0.11, 0.52, BLACK, 0, 0, -0.03); // receiver
  part(g, 0.032, 0.032, 0.5, BLACK, 0, 0.03, -0.4, 0, 0.7, 0.35); // barrel
  part(g, 0.06, 0.2, 0.1, accent, 0, -0.14, 0.0, 0.25); // magazine
  part(g, 0.05, 0.1, 0.24, accent, 0, -0.01, 0.24); // stock
  part(g, 0.045, 0.13, 0.055, BLACK, 0, -0.1, 0.09, 0.15); // grip
  part(g, 0.02, 0.04, 0.12, BLACK, 0, 0.075, -0.18); // front sight/handguard top
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.03, -0.66);
  g.add(muzzle);
  return { group: g, muzzle };
}

function buildAwp(): WeaponMesh {
  const g = new THREE.Group();
  const green = 0x384231;
  part(g, 0.07, 0.12, 0.72, green, 0, 0, 0.0);
  part(g, 0.03, 0.03, 0.72, BLACK, 0, 0.02, -0.62, 0, 0.7, 0.35); // long barrel
  part(g, 0.06, 0.13, 0.09, BLACK, 0, -0.11, -0.05, 0.1); // mag
  part(g, 0.055, 0.11, 0.32, green, 0, -0.02, 0.36); // stock
  part(g, 0.045, 0.14, 0.05, BLACK, 0, -0.1, 0.1, 0.1); // grip
  // scope
  part(g, 0.055, 0.055, 0.3, BLACK, 0, 0.12, -0.02, 0, 0.6, 0.3);
  part(g, 0.02, 0.06, 0.02, BLACK, 0, 0.07, -0.14);
  part(g, 0.02, 0.06, 0.02, BLACK, 0, 0.07, 0.1);
  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(0.026, 12),
    new THREE.MeshStandardMaterial({ color: 0x224466, metalness: 0.9, roughness: 0.1, emissive: 0x113355 }),
  );
  lens.position.set(0, 0.12, 0.14);
  lens.rotation.y = Math.PI;
  g.add(lens);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.02, -0.98);
  g.add(muzzle);
  return { group: g, muzzle };
}

function buildPistol(id: WeaponId): WeaponMesh {
  const g = new THREE.Group();
  const scale = id === 'deagle' ? 1.28 : 1.0;
  const bodyColor = id === 'deagle' ? 0xb8a44e : id === 'usp' ? 0x26282b : BLACK;
  const s = (v: number) => v * scale;
  part(g, s(0.05), s(0.07), s(0.24), bodyColor, 0, s(0.02), s(-0.03), 0, 0.6, 0.35); // slide
  part(g, s(0.045), s(0.17), s(0.08), 0x222327, 0, s(-0.1), s(0.05), 0.28); // grip
  part(g, s(0.028), s(0.028), s(0.06), BLACK, 0, s(0.02), s(-0.16)); // barrel tip
  let muzZ = s(-0.18);
  if (id === 'usp') {
    part(g, s(0.05), s(0.05), s(0.16), 0x2a2c2f, 0, s(0.02), s(-0.26), 0, 0.5, 0.4); // suppressor
    muzZ = s(-0.36);
  }
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, s(0.02), muzZ);
  g.add(muzzle);
  return { group: g, muzzle };
}

function buildKnife(): WeaponMesh {
  const g = new THREE.Group();
  part(g, 0.028, 0.045, 0.14, 0x1a1a1a, 0, -0.02, 0.07, 0.05); // handle
  part(g, 0.012, 0.06, 0.24, STEEL, 0, 0.03, -0.12, -0.03, 0.95, 0.15); // blade
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.03, -0.24);
  g.add(muzzle);
  return { group: g, muzzle };
}

export function buildWeaponMesh(id: WeaponId): WeaponMesh {
  switch (id) {
    case 'ak47':
    case 'm4a4':
      return buildRifle(id);
    case 'awp':
      return buildAwp();
    case 'glock':
    case 'usp':
    case 'deagle':
      return buildPistol(id);
    case 'knife':
      return buildKnife();
  }
}

// Two simple gripping hands for the first-person viewmodel.
export function addViewHands(g: THREE.Group): void {
  const skin = 0xc99a76;
  const mk = (x: number, y: number, z: number) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.09, 0.12),
      new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 }),
    );
    m.position.set(x, y, z);
    g.add(m);
  };
  mk(0.02, -0.08, 0.08); // rear hand at grip
  mk(0.0, -0.05, -0.16); // front hand on handguard
}

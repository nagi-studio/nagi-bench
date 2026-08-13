import * as THREE from 'three';
import { WeaponId } from './types';

function std(color: number, roughness = 0.52, metalness = 0.46) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

function cylinder(
  radius: number,
  length: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  axis: 'x' | 'y' | 'z' = 'z',
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), material);
  if (axis === 'z') mesh.rotation.x = Math.PI / 2;
  if (axis === 'x') mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

function createRifle(kind: 'ak' | 'm4' | 'awp'): THREE.Group {
  const group = new THREE.Group();
  const dark = std(0x252a2e);
  const metal = std(0x6e6d67);
  const wood = std(0x805e3d, 0.74, 0.1);
  const black = std(0x111417, 0.42, 0.55);

  if (kind === 'awp') {
    const body = box(0.115, 0.13, 0.92, black, 0, 0.02, -0.16);
    body.rotation.z = -0.02;
    const stock = box(0.09, 0.11, 0.38, std(0x315b38, 0.5, 0.24), 0, -0.015, 0.36);
    stock.rotation.x = 0.08;
    const barrel = cylinder(0.025, 0.72, metal, 0, 0.03, -0.66);
    const scope = cylinder(0.055, 0.34, std(0x101316, 0.3, 0.68), 0, 0.11, -0.04);
    const scopeRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.052, 0.012, 8, 18),
      std(0x3b4045, 0.36, 0.72),
    );
    scopeRing1.position.set(0, 0.11, -0.12);
    scopeRing1.rotation.y = Math.PI / 2;
    const scopeRing2 = scopeRing1.clone();
    scopeRing2.position.z = 0.04;
    const magazine = box(0.07, 0.18, 0.06, std(0x3a3e42), 0, -0.12, -0.08);
    magazine.rotation.x = 0.08;
    group.add(body, stock, barrel, scope, scopeRing1, scopeRing2, magazine);
  } else {
    const body = box(0.11, 0.13, 0.58, kind === 'ak' ? wood : dark, 0, 0.025, -0.02);
    const receiver = box(0.09, 0.09, 0.42, std(0x3d4144), 0, 0.055, -0.08);
    const barrel = cylinder(0.026, 0.36, metal, 0, 0.055, -0.34);
    const frontSight = box(0.025, 0.08, 0.025, std(0x272b2d), 0, 0.12, -0.43);
    const magazine = box(0.055, 0.16, 0.085, kind === 'ak' ? std(0x704b2c) : std(0x3a3e42), 0, -0.12, -0.01);
    magazine.rotation.x = kind === 'ak' ? 0.22 : 0.02;
    const stock = box(0.085, 0.1, 0.28, kind === 'ak' ? wood : dark, 0, -0.01, 0.31);
    const grip = box(0.06, 0.14, 0.06, std(0x24282b), 0, -0.07, 0.13);
    grip.rotation.x = -0.18;
    group.add(body, receiver, barrel, frontSight, magazine, stock, grip);
    if (kind === 'm4') {
      const verticalGrip = box(0.045, 0.12, 0.05, std(0x25292b), 0, -0.12, -0.24);
      group.add(verticalGrip);
    }
  }

  return group;
}

function createPistol(kind: 'glock' | 'usp' | 'deagle'): THREE.Group {
  const group = new THREE.Group();
  const black = std(0x1c2023, 0.38, 0.62);
  const metal = std(0x777a7b, 0.3, 0.78);
  const slide = box(0.065, 0.07, 0.24, kind === 'deagle' ? metal : black, 0, 0.055, -0.02);
  const frame = box(0.058, 0.07, 0.19, black, 0, -0.01, -0.01);
  const barrel = cylinder(0.022, 0.18, metal, 0, 0.045, -0.13);
  const grip = box(0.055, 0.16, 0.07, black, 0, -0.13, 0.03);
  grip.rotation.x = -0.22;
  group.add(slide, frame, barrel, grip);
  if (kind === 'deagle') {
    group.add(box(0.018, 0.025, 0.08, std(0x303438), 0, 0.095, -0.1));
  } else if (kind === 'usp') {
    group.add(cylinder(0.052, 0.055, std(0x2c3135, 0.28, 0.68), 0, 0.1, -0.03));
  }
  return group;
}

function createKnife(): THREE.Group {
  const group = new THREE.Group();
  const steel = std(0xaab0b3, 0.22, 0.82);
  const dark = std(0x25282a);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.055, 0.26), steel);
  blade.position.set(0, 0.02, -0.2);
  const guard = box(0.09, 0.025, 0.04, dark, 0, -0.04, -0.05);
  const handle = box(0.045, 0.045, 0.19, dark, 0, -0.035, 0.08);
  group.add(blade, guard, handle);
  return group;
}

export function createWeaponModel(id: WeaponId): THREE.Group {
  const group = (() => {
    switch (id) {
      case 'ak47':
        return createRifle('ak');
      case 'm4a4':
        return createRifle('m4');
      case 'awp':
        return createRifle('awp');
      case 'glock':
        return createPistol('glock');
      case 'usp':
        return createPistol('usp');
      case 'deagle':
        return createPistol('deagle');
      case 'knife':
        return createKnife();
    }
  })();
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) child.castShadow = true;
  });
  return group;
}

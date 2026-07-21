import * as THREE from 'three';
import { WeaponId } from '../types';

function part(
  w: number,
  h: number,
  d: number,
  color: number,
  metal = 0.5,
  rough = 0.5
): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough })
  );
}

/** Build a first-person weapon model (viewmodel). Faces -Z (camera forward). */
export function buildViewModel(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const add = (m: THREE.Mesh, x: number, y: number, z: number) => {
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  switch (id) {
    case 'ak47': {
      add(part(0.09, 0.12, 0.9, 0x6b4b2a, 0.3, 0.6), 0, 0, -0.5);
      add(part(0.07, 0.16, 0.12, 0x2a1d0e, 0.2, 0.7), 0, -0.14, -0.35); // mag
      add(part(0.05, 0.05, 0.5, 0x111111, 0.7, 0.3), 0, 0.06, -0.95); // barrel
      add(part(0.06, 0.14, 0.14, 0x2a1d0e, 0.2, 0.7), 0, -0.1, -0.02); // grip
      break;
    }
    case 'm4a4': {
      add(part(0.08, 0.1, 0.95, 0x2f3a3f, 0.4, 0.5), 0, 0, -0.5);
      add(part(0.06, 0.14, 0.1, 0x1a1a1a, 0.3, 0.6), 0, -0.12, -0.3);
      add(part(0.05, 0.05, 0.55, 0x111111, 0.7, 0.3), 0, 0.05, -1.0);
      add(part(0.06, 0.06, 0.2, 0x111111, 0.6, 0.4), 0, 0.09, -0.7); // sight
      break;
    }
    case 'awp': {
      add(part(0.1, 0.12, 1.15, 0x22331f, 0.3, 0.6), 0, 0, -0.55);
      add(part(0.05, 0.05, 0.7, 0x0a0a0a, 0.8, 0.2), 0, 0.05, -1.2); // long barrel
      add(part(0.08, 0.12, 0.28, 0x0a0a0a, 0.6, 0.3), 0, 0.12, -0.6); // scope body
      const scopeLens = add(part(0.06, 0.06, 0.04, 0x223355, 0.9, 0.1), 0, 0.12, -0.46);
      (scopeLens.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x112244);
      break;
    }
    case 'deagle': {
      add(part(0.08, 0.14, 0.42, 0x8a8f96, 0.8, 0.25), 0, -0.02, -0.28);
      add(part(0.05, 0.05, 0.2, 0x777777, 0.85, 0.2), 0, 0.03, -0.5);
      add(part(0.07, 0.16, 0.1, 0x333333, 0.4, 0.5), 0, -0.16, -0.12); // grip
      break;
    }
    case 'glock':
    case 'usp': {
      const c = id === 'glock' ? 0x1a1a1e : 0x14141a;
      add(part(0.06, 0.11, 0.34, c, 0.4, 0.5), 0, -0.02, -0.24);
      add(part(0.04, 0.04, 0.14, 0x222222, 0.6, 0.4), 0, 0.02, -0.42);
      add(part(0.06, 0.14, 0.09, 0x0c0c0c, 0.3, 0.6), 0, -0.14, -0.1);
      if (id === 'usp') add(part(0.05, 0.05, 0.16, 0x111111, 0.5, 0.4), 0, 0.0, -0.5); // suppressor
      break;
    }
    case 'knife': {
      const blade = add(part(0.03, 0.14, 0.34, 0xcfd4da, 0.95, 0.1), 0.02, 0, -0.3);
      blade.rotation.x = 0.2;
      add(part(0.05, 0.05, 0.16, 0x222222, 0.3, 0.6), 0.02, -0.06, -0.05);
      break;
    }
  }

  // hands
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd8a678, roughness: 0.7 });
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.16), skinMat);
  hand.position.set(0.02, -0.14, -0.1);
  g.add(hand);

  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.renderOrder = 999;
  });
  return g;
}

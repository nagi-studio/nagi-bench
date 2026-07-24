/**
 * Procedural weapon models.
 *
 * Every gun is a handful of boxes assembled so the silhouette reads correctly: the AK has
 * its wooden furniture and banana magazine, the M4 its carry handle, the AWP its scope and
 * bolt, the USP a suppressor and the Deagle a fat slab slide. The same builder is used for
 * both the first person view model and the guns in other players' hands.
 */

import * as THREE from 'three';
import type { WeaponId } from '../game/weapons.ts';

const MAT = {
  gunmetal: 0x33383d,
  black: 0x1b1e21,
  wood: 0x6d4522,
  woodDark: 0x54341a,
  awp: 0x3d4a3a,
  steel: 0x8d959c,
  brass: 0xa8863f,
  scope: 0x14171a,
  blade: 0xc3cbd2,
};

// Materials are shared across every instance of a weapon.
const cache = new Map<number, THREE.MeshLambertMaterial>();
function mat(color: number): THREE.MeshLambertMaterial {
  let m = cache.get(color);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color });
    cache.set(color, m);
  }
  return m;
}

function part(
  group: THREE.Group,
  color: number,
  sx: number,
  sy: number,
  sz: number,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat(color));
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
  return mesh;
}

/**
 * Builds a weapon pointing down -Z with the grip near the origin, ready to be parented to
 * a hand or to the view model rig.
 */
export function buildWeaponModel(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  g.name = `weapon_${id}`;

  switch (id) {
    case 'ak47': {
      part(g, MAT.gunmetal, 0.075, 0.11, 0.46, 0, 0.02, -0.08); // receiver
      part(g, MAT.wood, 0.078, 0.085, 0.26, 0, 0.025, -0.36); // handguard
      part(g, MAT.gunmetal, 0.032, 0.032, 0.34, 0, 0.055, -0.62); // barrel
      part(g, MAT.gunmetal, 0.05, 0.05, 0.1, 0, 0.055, -0.8); // muzzle brake
      part(g, MAT.wood, 0.06, 0.1, 0.3, 0, -0.01, 0.26, -0.06); // stock
      part(g, MAT.wood, 0.05, 0.13, 0.07, 0, -0.09, 0.09, 0.32); // grip
      // Curved magazine from three angled blocks.
      part(g, MAT.woodDark, 0.05, 0.16, 0.09, 0, -0.11, -0.1, 0.18);
      part(g, MAT.woodDark, 0.05, 0.13, 0.085, 0, -0.23, -0.16, 0.55);
      part(g, MAT.gunmetal, 0.022, 0.05, 0.05, 0, 0.095, -0.28); // front sight
      part(g, MAT.gunmetal, 0.03, 0.035, 0.06, 0, 0.09, 0.02); // rear sight
      break;
    }
    case 'm4a4': {
      part(g, MAT.black, 0.07, 0.1, 0.4, 0, 0.02, -0.06);
      part(g, MAT.black, 0.075, 0.08, 0.3, 0, 0.02, -0.38); // handguard
      part(g, MAT.gunmetal, 0.028, 0.028, 0.32, 0, 0.045, -0.66); // barrel
      part(g, MAT.black, 0.042, 0.042, 0.08, 0, 0.045, -0.84); // flash hider
      part(g, MAT.black, 0.05, 0.06, 0.3, 0, 0.03, 0.26); // buffer tube / stock
      part(g, MAT.black, 0.06, 0.08, 0.14, 0, 0.005, 0.3);
      part(g, MAT.black, 0.05, 0.12, 0.07, 0, -0.08, 0.08, 0.3); // grip
      part(g, MAT.black, 0.048, 0.19, 0.085, 0, -0.13, -0.06, 0.05); // straight magazine
      part(g, MAT.black, 0.05, 0.055, 0.24, 0, 0.095, -0.02); // carry handle
      part(g, MAT.gunmetal, 0.02, 0.04, 0.04, 0, 0.085, -0.3);
      break;
    }
    case 'awp': {
      part(g, MAT.awp, 0.07, 0.1, 0.5, 0, 0.0, -0.1); // receiver
      part(g, MAT.awp, 0.09, 0.11, 0.34, 0, -0.01, 0.3); // thumbhole stock
      part(g, MAT.awp, 0.05, 0.14, 0.08, 0, -0.09, 0.1, 0.25); // grip
      part(g, MAT.gunmetal, 0.03, 0.03, 0.62, 0, 0.04, -0.68); // long barrel
      part(g, MAT.gunmetal, 0.045, 0.045, 0.12, 0, 0.04, -1.02); // muzzle
      part(g, MAT.scope, 0.052, 0.052, 0.34, 0, 0.12, -0.14); // scope tube
      part(g, MAT.scope, 0.07, 0.07, 0.06, 0, 0.12, -0.31); // objective bell
      part(g, MAT.black, 0.02, 0.05, 0.03, 0, 0.075, -0.05); // scope mounts
      part(g, MAT.black, 0.02, 0.05, 0.03, 0, 0.075, -0.24);
      part(g, MAT.steel, 0.03, 0.022, 0.1, 0.05, 0.02, 0.06, 0, 0, -0.3); // bolt handle
      part(g, MAT.awp, 0.05, 0.1, 0.12, 0, -0.09, -0.16); // magazine
      break;
    }
    case 'glock': {
      part(g, MAT.black, 0.045, 0.085, 0.24, 0, 0.03, -0.06); // slide
      part(g, MAT.black, 0.04, 0.06, 0.16, 0, -0.03, -0.02); // frame
      part(g, MAT.black, 0.042, 0.14, 0.06, 0, -0.11, 0.05, 0.16); // grip
      part(g, MAT.gunmetal, 0.02, 0.02, 0.05, 0, 0.03, -0.19); // muzzle
      part(g, MAT.gunmetal, 0.02, 0.022, 0.02, 0, 0.075, -0.15); // sight
      break;
    }
    case 'usp': {
      part(g, MAT.black, 0.048, 0.088, 0.24, 0, 0.03, -0.06);
      part(g, MAT.black, 0.042, 0.062, 0.16, 0, -0.03, -0.02);
      part(g, MAT.black, 0.045, 0.145, 0.062, 0, -0.115, 0.05, 0.16);
      part(g, MAT.gunmetal, 0.05, 0.05, 0.22, 0, 0.03, -0.29); // suppressor
      part(g, MAT.gunmetal, 0.022, 0.024, 0.02, 0, 0.078, -0.15);
      break;
    }
    case 'deagle': {
      part(g, MAT.steel, 0.055, 0.105, 0.3, 0, 0.035, -0.08); // slab slide
      part(g, MAT.brass, 0.05, 0.05, 0.06, 0, 0.035, -0.24); // muzzle
      part(g, MAT.black, 0.045, 0.07, 0.18, 0, -0.03, -0.02);
      part(g, MAT.black, 0.048, 0.155, 0.07, 0, -0.12, 0.06, 0.18); // grip
      part(g, MAT.gunmetal, 0.024, 0.03, 0.024, 0, 0.095, -0.2);
      break;
    }
    case 'knife':
    default: {
      part(g, MAT.black, 0.035, 0.045, 0.13, 0, -0.01, 0.06); // handle
      part(g, MAT.gunmetal, 0.05, 0.02, 0.03, 0, 0.005, -0.01); // guard
      const blade = part(g, MAT.blade, 0.018, 0.05, 0.24, 0, 0.015, -0.14);
      blade.rotation.z = 0.02;
      part(g, MAT.blade, 0.02, 0.03, 0.07, 0, 0.03, -0.28, 0.35); // tip
      break;
    }
  }

  return g;
}

/** Scale used when the weapon sits in another player's hands. */
export function worldWeaponScale(id: WeaponId): number {
  return id === 'knife' ? 0.9 : 0.82;
}

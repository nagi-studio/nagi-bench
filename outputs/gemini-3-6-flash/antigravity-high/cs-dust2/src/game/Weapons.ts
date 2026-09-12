import * as THREE from 'three';
import { WeaponData, WeaponType, HitboxZone } from '../types/game';

export const WEAPON_DEFINITIONS: Record<WeaponType, WeaponData> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    category: 'primary',
    damage: 36, // Headshot = 72 * 2 = 144
    fireRate: 10, // 600 RPM
    recoil: 0.8,
    spread: 0.02,
    clipSize: 30,
    maxReserve: 90,
    reloadTime: 2.2,
    teams: ['T']
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    category: 'primary',
    damage: 31,
    fireRate: 11, // 666 RPM
    recoil: 0.45,
    spread: 0.015,
    clipSize: 30,
    maxReserve: 90,
    reloadTime: 2.1,
    teams: ['CT']
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    category: 'primary',
    damage: 115,
    fireRate: 0.7, // Slow bolt action
    recoil: 1.2,
    spread: 0.005,
    clipSize: 5,
    maxReserve: 30,
    reloadTime: 3.2,
    hasScope: true,
    teams: ['CT', 'T']
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    category: 'secondary',
    damage: 28,
    fireRate: 6.5,
    recoil: 0.3,
    spread: 0.025,
    clipSize: 20,
    maxReserve: 120,
    reloadTime: 1.8,
    teams: ['T']
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    category: 'secondary',
    damage: 35,
    fireRate: 5.5,
    recoil: 0.25,
    spread: 0.012,
    clipSize: 12,
    maxReserve: 100,
    reloadTime: 1.9,
    teams: ['CT']
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    category: 'secondary',
    damage: 54, // One tap headshot potential
    fireRate: 3.5,
    recoil: 0.9,
    spread: 0.018,
    clipSize: 7,
    maxReserve: 35,
    reloadTime: 2.2,
    teams: ['CT', 'T']
  },
  knife: {
    id: 'knife',
    name: 'Knife',
    category: 'melee',
    damage: 55,
    fireRate: 2.2,
    recoil: 0,
    spread: 0,
    clipSize: 1,
    maxReserve: 0,
    reloadTime: 0.1,
    teams: ['CT', 'T']
  }
};

export const HITBOX_MULTIPLIERS: Record<HitboxZone, number> = {
  head: 2.0,
  chest: 1.0,
  abdomen: 1.1,
  arm: 0.8,
  leg: 0.75
};

export class WeaponMeshBuilder {
  /**
   * Generates procedural 3D model for first person view model / bot third person weapon.
   */
  public static createWeaponMesh(type: WeaponType): THREE.Group {
    const group = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x22252a, metalness: 0.8, roughness: 0.3 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.6 });
    const oliveMat = new THREE.MeshStandardMaterial({ color: 0x3d4a34, roughness: 0.5 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

    if (type === 'ak47') {
      // Body receiver
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.45), darkMetal);
      group.add(body);
      // Wooden stock
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.3), woodMat);
      stock.position.set(0, -0.02, 0.35);
      group.add(stock);
      // Barrel
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), darkMetal);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.02, -0.38);
      group.add(barrel);
      // Curved magazine
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.1), darkMetal);
      mag.rotation.x = 0.3;
      mag.position.set(0, -0.15, -0.05);
      group.add(mag);
      // Wooden handguard
      const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.22), woodMat);
      handguard.position.set(0, 0, -0.2);
      group.add(handguard);
    } else if (type === 'm4a4') {
      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.45), darkMetal);
      group.add(body);
      // Collapsible stock
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.25), darkMetal);
      stock.position.set(0, -0.01, 0.32);
      group.add(stock);
      // Quad rail handguard
      const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.25), darkMetal);
      handguard.position.set(0, 0.01, -0.22);
      group.add(handguard);
      // Barrel
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.35), darkMetal);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.01, -0.38);
      group.add(barrel);
      // Straight magazine
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.09), darkMetal);
      mag.position.set(0, -0.14, -0.05);
      group.add(mag);
    } else if (type === 'awp') {
      // Green polymer chassis body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.75), oliveMat);
      group.add(body);
      // Long heavy barrel
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7), darkMetal);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.04, -0.65);
      group.add(barrel);
      // Scope assembly
      const scopeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.32), darkMetal);
      scopeBody.rotation.x = Math.PI / 2;
      scopeBody.position.set(0, 0.15, -0.1);
      group.add(scopeBody);
      const scopeMount = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.12), darkMetal);
      scopeMount.position.set(0, 0.09, -0.1);
      group.add(scopeMount);
      // Heavy stock
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.35), oliveMat);
      stock.position.set(0, -0.02, 0.45);
      group.add(stock);
    } else if (type === 'deagle') {
      // Big silver slide
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.28), silverMat);
      slide.position.set(0, 0.04, -0.04);
      group.add(slide);
      // Handle grip
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.09), darkMetal);
      grip.rotation.x = -0.25;
      grip.position.set(0, -0.08, 0.04);
      group.add(grip);
    } else if (type === 'knife') {
      // Knife blade
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.22), silverMat);
      blade.position.set(0, 0.02, -0.12);
      group.add(blade);
      // Handle
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.14), darkMetal);
      handle.position.set(0, 0, 0.05);
      group.add(handle);
    } else {
      // Glock / USP pistol
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.22), darkMetal);
      slide.position.set(0, 0.03, -0.04);
      group.add(slide);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.08), darkMetal);
      grip.rotation.x = -0.2;
      grip.position.set(0, -0.07, 0.03);
      group.add(grip);
    }

    return group;
  }
}

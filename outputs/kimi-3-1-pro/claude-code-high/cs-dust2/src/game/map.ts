import * as THREE from 'three';
import type { Collider, Team, Zone } from './types';

export interface MapData {
  colliders: Collider[];
  spawns: Record<Team, THREE.Vector3[]>;
  sites: Record<'A' | 'B', Zone>;
  regions: { name: string; x: number; z: number }[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  bombSite: THREE.Group;
}

const SAND = 0xb99a6a;
const SAND_LIGHT = 0xc9ad7e;
const SAND_DARK = 0x8d744f;

function textTexture(text: string, color = '#e8d5a6', background = 'rgba(0,0,0,0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = color;
  ctx.font = '900 176px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 138);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createDustMap(scene: THREE.Scene): MapData {
  const colliders: Collider[] = [];
  const root = new THREE.Group();
  root.name = 'DUST2_PROCEDURAL_MAP';
  scene.add(root);

  const wallMat = new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.96 });
  const lightMat = new THREE.MeshStandardMaterial({ color: SAND_LIGHT, roughness: 1 });
  const darkMat = new THREE.MeshStandardMaterial({ color: SAND_DARK, roughness: 1 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x745035, roughness: 0.9 });
  const woodLight = new THREE.MeshStandardMaterial({ color: 0x9b7047, roughness: 0.9 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x4e4a40, roughness: 0.7, metalness: 0.25 });

  function box(x: number, y: number, z: number, w: number, h: number, d: number,
    material: THREE.Material = wallMat, solid = true, kind: Collider['kind'] = 'wall') {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = solid && h < 5;
    mesh.receiveShadow = true;
    root.add(mesh);
    if (solid) colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, minY: y, maxY: y + h, kind });
    return mesh;
  }

  function wall(x: number, z: number, w: number, d: number, h = 4.5, material = wallMat) {
    const mesh = box(x, 0, z, w, h, d, material);
    if (w > d * 2) {
      box(x, h - 0.25, z, w + 0.08, 0.25, d + 0.12, lightMat, false);
    } else if (d > w * 2) {
      box(x, h - 0.25, z, w + 0.12, 0.25, d + 0.08, lightMat, false);
    }
    return mesh;
  }

  function crate(x: number, z: number, size = 1.8, height = size, y = 0) {
    box(x, y, z, size, height, size, woodMat, true, 'crate');
    const slat = 0.09;
    for (const side of [-1, 1]) {
      box(x + side * (size / 2 + 0.015), y + 0.1, z, slat, height - 0.2, size - 0.18, woodLight, false);
      box(x, y + 0.1, z + side * (size / 2 + 0.015), size - 0.18, height - 0.2, slat, woodLight, false);
    }
    box(x, y + height - 0.12, z, size + 0.05, 0.12, size + 0.05, woodLight, false);
  }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(94, 106),
    new THREE.MeshStandardMaterial({ color: 0xa88b60, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.025;
  ground.receiveShadow = true;
  root.add(ground);

  // Large ground slabs and seams provide scale without texture assets.
  const seamMat = new THREE.MeshBasicMaterial({ color: 0x927750, transparent: true, opacity: 0.34 });
  for (let x = -40; x <= 40; x += 8) box(x, 0.002, 0, 0.025, 0.008, 100, seamMat, false);
  for (let z = -48; z <= 48; z += 8) box(0, 0.003, z, 88, 0.008, 0.025, seamMat, false);

  // Perimeter and the major Dust2 lane dividers.
  wall(0, -52, 94, 1.2, 6);
  wall(0, 52, 94, 1.2, 6);
  wall(-46, 0, 1.2, 104, 6);
  wall(46, 0, 1.2, 104, 6);
  wall(-39.5, 12, 1, 80, 5);
  wall(39.5, 10, 1, 82, 5.5);

  // Mid / T ramp.
  wall(-5.5, 23.5, 1, 25, 4.2);
  wall(5.5, 23.5, 1, 25, 4.2);
  wall(-5.5, 4.5, 1, 13, 4.2);
  wall(-5.5, -20.5, 1, 17, 4.5);
  wall(5.5, -19.5, 1, 25, 4.5);
  wall(-13, 35, 14, 1, 4);
  wall(17, 35, 22, 1, 4);

  // Mid double doors: solid timber leaves with a wide traversable center opening.
  wall(-3.65, 8, 2.7, 0.34, 3.5, woodMat);
  wall(3.65, 8, 2.7, 0.34, 3.5, woodMat);
  colliders[colliders.length - 1].kind = 'door';
  colliders[colliders.length - 2].kind = 'door';
  box(-3.65, 0.22, 7.79, 2.25, 0.12, 0.05, metalMat, false);
  box(3.65, 0.22, 7.79, 2.25, 0.12, 0.05, metalMat, false);
  box(0, 3.55, 8, 11, 0.45, 0.75, darkMat, false);
  for (const x of [-5.15, 5.15]) box(x, 0, 8, 0.35, 3.7, 0.7, darkMat, false);

  // Long A corridor and its open double doors.
  wall(28.5, 8.5, 1, 41, 5);
  wall(31.1, 17, 3.1, 0.35, 3.5, woodMat);
  wall(37.0, 17, 3.1, 0.35, 3.5, woodMat);
  colliders[colliders.length - 1].kind = 'door';
  colliders[colliders.length - 2].kind = 'door';
  box(34, 3.55, 17, 11, 0.45, 0.7, darkMat, false);

  // Catwalk: mid -> short -> A, with a clear drop-in to site.
  wall(5.5, -11, 1, 8, 3.8);
  wall(13.5, -1.5, 1, 13, 4.2);
  wall(19.5, 4.5, 17, 1, 4.4);
  wall(23.5, -11.5, 11, 1, 4.4);
  wall(12.5, -25, 1, 18, 4.8);
  wall(29, -34.5, 20, 1, 5);
  box(9.3, 0.015, -4, 6.4, 0.12, 16, darkMat, false);
  for (let z = 1; z > -12; z -= 1.5) box(9.3, 0.14, z, 6.2, 0.06, 0.07, lightMat, false);

  // B tunnels, exit and the mid/B connector.
  wall(-36.5, 11.5, 1, 45, 4.5);
  wall(-24.5, 17.5, 1, 25, 4.5);
  wall(-35, 31, 4, 1, 4.2);
  wall(-26, 31, 4, 1, 4.2);
  wall(-36, -9.5, 7, 1, 4.5);
  wall(-39.5, -21, 1, 23, 5);
  wall(-34.5, -30.5, 9, 1, 5);
  wall(-19, -30.5, 7, 1, 5);
  wall(-16.5, -22.5, 1, 15, 4.8);
  wall(-14, -2.5, 18, 1, 4.3);
  wall(-10, -9.5, 10, 1, 4.3);
  // Tunnel turn lintels make the corridors read as interiors while remaining open below.
  box(-30.5, 3.7, 28, 12, 0.5, 5, darkMat, false);
  box(-30.5, 3.7, -5, 12, 0.5, 4, darkMat, false);

  // Architectural breaks, barrels and site cover.
  crate(31.5, -26.5, 2.1);
  crate(34.0, -26.5, 2.1);
  crate(34.0, -26.5, 2.1, 2.1, 2.1);
  crate(29.5, -31, 1.7);
  crate(19.5, -19.5, 1.8);
  crate(35.5, 26, 1.8);
  crate(-34, -25, 2);
  crate(-34, -22.5, 2);
  crate(-20, -20, 1.8);
  crate(-31.5, -14, 1.65);
  crate(2.6, 20, 1.55);
  crate(-2.8, 29, 1.4);
  crate(-30, 20, 1.8);

  function barrel(x: number, z: number, color = 0x586052) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.25 });
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.15, 12), mat);
    mesh.position.set(x, 0.575, z);
    mesh.castShadow = true;
    root.add(mesh);
    colliders.push({ minX: x - 0.4, maxX: x + 0.4, minZ: z - 0.4, maxZ: z + 0.4, minY: 0, maxY: 1.15, kind: 'crate' });
  }
  barrel(37.5, -16);
  barrel(36.4, -16.3);
  barrel(-37.5, -13, 0x6d5540);
  barrel(7.5, -38, 0x4e6268);

  // Spawn gates and small visual landmarks.
  wall(-9, 47.5, 1, 7, 5, darkMat);
  wall(9, 47.5, 1, 7, 5, darkMat);
  box(0, 4.2, 48.5, 18, 0.65, 1, darkMat, false);
  wall(-8, -46, 1, 8, 5, darkMat);
  wall(9, -46, 1, 8, 5, darkMat);

  const sites: Record<'A' | 'B', Zone> = {
    A: { name: 'A', x: 25, z: -23, radius: 7.4 },
    B: { name: 'B', x: -28, z: -21, radius: 6.5 },
  };
  for (const site of Object.values(sites)) {
    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 5.5),
      new THREE.MeshBasicMaterial({ map: textTexture(site.name, '#b64735'), transparent: true, depthWrite: false, opacity: 0.75 }),
    );
    decal.rotation.x = -Math.PI / 2;
    decal.position.set(site.x, 0.018, site.z);
    root.add(decal);
  }

  const regions = [
    { name: 'T SPAWN', x: 0, z: 43 }, { name: 'CT SPAWN', x: 0, z: -41 },
    { name: 'A LONG', x: 34, z: 9 }, { name: 'A SITE', x: 25, z: -23 },
    { name: 'MID', x: 0, z: 17 }, { name: 'CATWALK', x: 9, z: -6 },
    { name: 'B TUNNELS', x: -30.5, z: 15 }, { name: 'B SITE', x: -28, z: -21 },
  ];

  const bombSite = new THREE.Group();
  const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.36), new THREE.MeshStandardMaterial({ color: 0x373c35, roughness: 0.65 }));
  caseMesh.position.y = 0.12;
  bombSite.add(caseMesh);
  const light = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.035, 0.07), new THREE.MeshBasicMaterial({ color: 0xff321d }));
  light.position.set(0.14, 0.225, 0);
  light.name = 'bombLight';
  bombSite.add(light);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), metalMat);
  antenna.position.set(-0.18, 0.32, 0);
  bombSite.add(antenna);
  bombSite.visible = false;
  scene.add(bombSite);

  return {
    colliders,
    spawns: {
      CT: [new THREE.Vector3(0, 0, -41), new THREE.Vector3(-3, 0, -40), new THREE.Vector3(3, 0, -40), new THREE.Vector3(-5, 0, -43), new THREE.Vector3(5, 0, -43)],
      T: [new THREE.Vector3(0, 0, 43), new THREE.Vector3(-3, 0, 42), new THREE.Vector3(3, 0, 42), new THREE.Vector3(-5, 0, 45), new THREE.Vector3(5, 0, 45)],
    },
    sites,
    regions,
    bounds: { minX: -46, maxX: 46, minZ: -52, maxZ: 52 },
    bombSite,
  };
}

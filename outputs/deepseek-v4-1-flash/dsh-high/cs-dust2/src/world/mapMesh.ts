import * as THREE from 'three';
import { COLORS } from '../engine/constants';
import type { MapData } from './mapLayout';

export interface MapVisuals {
  group: THREE.Group;
  dispose: () => void;
}

function siteDecal(rect: { minX: number; minZ: number; maxX: number; maxZ: number }, color: number, letter: string): THREE.Group {
  const g = new THREE.Group();
  const w = rect.maxX - rect.minX;
  const d = rect.maxZ - rect.minZ;
  const cx = (rect.minX + rect.maxX) / 2;
  const cz = (rect.minZ + rect.maxZ) / 2;

  const mat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.22,
    roughness: 0.9,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(cx, 0.02, cz);
  g.add(plane);

  // Procedural canvas letter, no external asset.
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 70);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  const spriteMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.55, depthWrite: false });
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.5), spriteMat);
  sprite.rotation.x = -Math.PI / 2;
  sprite.position.set(cx, 0.05, cz);
  g.add(sprite);
  return g;
}

export function buildMapVisuals(map: MapData): MapVisuals {
  const group = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // Floor.
  const floorGeo = new THREE.PlaneGeometry(240, 240);
  const floorMat = new THREE.MeshStandardMaterial({ color: COLORS.floor, roughness: 0.98, metalness: 0.0 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = false;
  group.add(floor);
  disposables.push(floorGeo, floorMat);

  const dummy = new THREE.Object3D();

  // Walls as one instanced mesh.
  const wallBoxes = map.boxes.filter((b) => b.kind === 'wall');
  const wallGeo = new THREE.BoxGeometry(1, 1, 1);
  const wallMat = new THREE.MeshStandardMaterial({ color: COLORS.wall, roughness: 0.95, metalness: 0.02 });
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallBoxes.length);
  walls.instanceMatrix.setUsage(THREE.StaticDrawUsage);
  wallBoxes.forEach((b, i) => {
    dummy.position.set(b.x, b.y, b.z);
    dummy.scale.set(b.w, b.h, b.d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    walls.setMatrixAt(i, dummy.matrix);
  });
  walls.instanceMatrix.needsUpdate = true;
  group.add(walls);
  disposables.push(wallGeo, wallMat);

  // Crate tops / trim as a second instanced mesh (same shapes, wood colour).
  const crateBoxes = map.boxes.filter((b) => b.kind === 'crate');
  const crateGeo = new THREE.BoxGeometry(1, 1, 1);
  const crateMat = new THREE.MeshStandardMaterial({ color: COLORS.crate, roughness: 0.85, metalness: 0.05 });
  const crates = new THREE.InstancedMesh(crateGeo, crateMat, Math.max(1, crateBoxes.length));
  crateBoxes.forEach((b, i) => {
    dummy.position.set(b.x, b.y, b.z);
    dummy.scale.set(b.w, b.h, b.d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    crates.setMatrixAt(i, dummy.matrix);
  });
  crates.instanceMatrix.needsUpdate = true;
  group.add(crates);
  disposables.push(crateGeo, crateMat);

  // Site decals.
  const aDecal = siteDecal(map.sites.A, COLORS.siteA, 'A');
  const bDecal = siteDecal(map.sites.B, COLORS.siteB, 'B');
  group.add(aDecal, bDecal);
  aDecal.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) disposables.push(m.geometry, m.material as THREE.Material);
  });
  bDecal.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) disposables.push(m.geometry, m.material as THREE.Material);
  });

  // Sky dome (procedural gradient via vertex colours is overkill; use a simple dome).
  const skyGeo = new THREE.SphereGeometry(180, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({ color: 0x9fc4e0, side: THREE.BackSide, fog: false });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  group.add(sky);
  disposables.push(skyGeo, skyMat);

  // --- Mid doors: a visible double-door frame over the passable gap at z=0 ---
  const doorGroup = new THREE.Group();
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x6a4c2e, roughness: 0.8, metalness: 0.05 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 0.9 });
  const addPart = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
  ) => {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    doorGroup.add(m);
    disposables.push(g);
    return m;
  };
  // Lintel + side posts around the 4m opening.
  addPart(4.6, 0.4, 0.7, 0, 3.0, 0, frameMat);
  addPart(0.35, 3.0, 0.7, -2.05, 1.5, 0, frameMat);
  addPart(0.35, 3.0, 0.7, 2.05, 1.5, 0, frameMat);
  // Two leaves hinged at the posts, swung open into the corridor.
  const leafGeo = new THREE.BoxGeometry(1.7, 2.5, 0.12);
  disposables.push(leafGeo);
  const leftHinge = new THREE.Group();
  leftHinge.position.set(-1.85, 1.28, 0);
  leftHinge.rotation.y = 1.28;
  const leftLeaf = new THREE.Mesh(leafGeo, doorMat);
  leftLeaf.position.set(0.85, 0, 0);
  leftHinge.add(leftLeaf);
  const rightHinge = new THREE.Group();
  rightHinge.position.set(1.85, 1.28, 0);
  rightHinge.rotation.y = -1.28;
  const rightLeaf = new THREE.Mesh(leafGeo, doorMat);
  rightLeaf.position.set(-0.85, 0, 0);
  rightHinge.add(rightLeaf);
  doorGroup.add(leftHinge, rightHinge);
  disposables.push(doorMat, frameMat);
  group.add(doorGroup);

  // Lighting.
  const hemi = new THREE.HemisphereLight(0xcfe3ff, 0x8a7a5c, 1.15);
  group.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1cf, 1.65);
  sun.position.set(50, 90, 30);
  group.add(sun);
  const fill = new THREE.DirectionalLight(0x8fb4e0, 0.4);
  fill.position.set(-40, 40, -30);
  group.add(fill);

  return {
    group,
    dispose: () => {
      walls.dispose();
      crates.dispose();
      for (const d of disposables) d.dispose();
    },
  };
}

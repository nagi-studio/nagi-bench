// Static world geometry: sky/fog, lights, floor, instanced walls (only cells
// bordering walkable space), crates, bomb-site markers and the passable mid
// doors. Returns the scene plus a few references the simulation needs.

import * as THREE from 'three';
import { COLORS } from './constants';
import { Dust2, WALL_HEIGHT } from './dust2';
import { Region } from './grid';

export interface SceneRefs {
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
}

function labelTexture(letter: string, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = color;
  ctx.font = 'bold 110px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

export function buildScene(d: Dust2): SceneRefs {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky);
  scene.fog = new THREE.Fog(COLORS.sky, 60, 170);

  // lighting
  const hemi = new THREE.HemisphereLight(0xdfeaf5, 0x6b5f47, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.1);
  sun.position.set(50, 90, 30);
  scene.add(sun);
  const amb = new THREE.AmbientLight(0xffffff, 0.18);
  scene.add(amb);

  const g = d.grid;
  const { minX, maxX, minZ, maxZ } = d.bounds;

  // floor
  const floorGeo = new THREE.PlaneGeometry(maxX - minX, maxZ - minZ);
  const floorMat = new THREE.MeshStandardMaterial({ color: COLORS.floor, roughness: 0.97, metalness: 0 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
  scene.add(floor);

  // walls: only cells that border a floor cell are visible
  const borderCells: { cx: number; cz: number }[] = [];
  for (let cz = 0; cz < g.rows; cz++) {
    for (let cx = 0; cx < g.cols; cx++) {
      if (!g.isWall(cx, cz)) continue;
      if (
        g.isFloor(cx + 1, cz) || g.isFloor(cx - 1, cz) ||
        g.isFloor(cx, cz + 1) || g.isFloor(cx, cz - 1)
      ) {
        borderCells.push({ cx, cz });
      }
    }
  }
  const wallGeo = new THREE.BoxGeometry(g.cell, WALL_HEIGHT, g.cell);
  // Per-instance tint comes from setColorAt (instanceColor); no vertexColors flag
  // (the box geometry has no color attribute, which would render black).
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0.02, flatShading: true });
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, borderCells.length);
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  const base = new THREE.Color(COLORS.wall);
  const dark = new THREE.Color(COLORS.wallDark);
  for (let i = 0; i < borderCells.length; i++) {
    const { cx, cz } = borderCells[i];
    const c = g.centerOf(cx, cz);
    m.makeTranslation(c.x, WALL_HEIGHT / 2, c.z);
    walls.setMatrixAt(i, m);
    col.copy(base).lerp(dark, Math.random() * 0.6);
    walls.setColorAt(i, col);
  }
  walls.instanceMatrix.needsUpdate = true;
  if (walls.instanceColor) walls.instanceColor.needsUpdate = true;
  scene.add(walls);

  // crates
  for (const cr of d.crates) {
    const geo = new THREE.BoxGeometry(cr.hx * 2, cr.height, cr.hz * 2);
    const mat = new THREE.MeshStandardMaterial({ color: COLORS.crate, roughness: 0.8, metalness: 0.05, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cr.x, cr.height / 2, cr.z);
    scene.add(mesh);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: COLORS.crateEdge }),
    );
    edges.position.copy(mesh.position);
    scene.add(edges);
  }

  // bomb-site markers
  const marker = (x: number, z: number, letter: string, color: number, hex: string) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(5.2, 6, 40),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.05, z);
    scene.add(ring);
    const lbl = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({ map: labelTexture(letter, hex), transparent: true, opacity: 0.7 }),
    );
    lbl.rotation.x = -Math.PI / 2;
    lbl.position.set(x, 0.06, z);
    scene.add(lbl);
  };
  marker(d.sites.A.center.x, d.sites.A.center.z, 'A', COLORS.siteA, '#e0745f');
  marker(d.sites.B.center.x, d.sites.B.center.z, 'B', COLORS.siteB, '#5fb4e0');

  // passable mid doors (visual only, no collision)
  for (const dc of d.doorCells) {
    const c = g.centerOf(dc.cx, dc.cz);
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(g.cell * 0.96, 2.6, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x7a6a4a, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.92 }),
    );
    door.position.set(c.x, 1.3, c.z);
    scene.add(door);
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(g.cell * 0.98, 2.9, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x4a3f2c, roughness: 0.8 }),
    );
    frame.position.set(c.x, 1.45, c.z);
    scene.add(frame);
  }

  return { scene, sun };
}

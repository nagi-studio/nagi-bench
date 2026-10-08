/**
 * Turns the occupancy grid + prop list into renderable three.js geometry.
 * Walls and ceilings are InstancedMeshes; the floor is a single merged mesh.
 */

import * as THREE from 'three';
import type { NavGrid } from '../game/map/grid';
import { PROPS, type PropDef } from '../game/map/dust2';
import { worldTextures } from './textures';

export interface WorldMeshes {
  group: THREE.Group;
  floor: THREE.Mesh;
  walls: THREE.InstancedMesh;
  ceilings: THREE.InstancedMesh;
  props: THREE.Mesh[];
}

const PROP_STYLE: Record<PropDef['kind'], { color: number; map: 'crate' | 'metal' | 'concrete' }> = {
  crate: { color: 0xffffff, map: 'crate' },
  barrel: { color: 0x7a6a3f, map: 'metal' },
  platform: { color: 0xa89470, map: 'concrete' },
  door: { color: 0x6b4c2a, map: 'crate' },
  car: { color: 0x8a4a3c, map: 'metal' },
  sandbag: { color: 0xb5a173, map: 'concrete' },
};

export function buildWorld(grid: NavGrid): WorldMeshes {
  const group = new THREE.Group();
  const tex = worldTextures();

  // ---------------------------------------------------------------- floor
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  let v = 0;
  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] !== 1) continue;
      const x0 = grid.minXOf(cx);
      const z0 = grid.minZOf(cz);
      const x1 = x0 + grid.cell;
      const z1 = z0 + grid.cell;
      pos.push(x0, 0, z0, x1, 0, z0, x1, 0, z1, x0, 0, z1);
      for (let k = 0; k < 4; k++) norm.push(0, 1, 0);
      uv.push(x0 / 4, z0 / 4, x1 / 4, z0 / 4, x1 / 4, z1 / 4, x0 / 4, z1 / 4);
      idx.push(v, v + 2, v + 1, v, v + 3, v + 2);
      v += 4;
    }
  }
  const floorGeo = new THREE.BufferGeometry();
  floorGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  floorGeo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  floorGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  floorGeo.setIndex(idx);
  floorGeo.computeBoundingSphere();

  const floorMat = new THREE.MeshStandardMaterial({
    map: tex.sand,
    roughness: 0.97,
    metalness: 0.0,
    color: 0xffffff,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  floor.name = 'floor';
  group.add(floor);

  // ---------------------------------------------------------------- walls
  const wallCells: number[] = [];
  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] === 1) continue;
      // only walls that actually border playable space
      let visible = false;
      for (let dz = -1; dz <= 1 && !visible; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!grid.inBounds(cx + dx, cz + dz)) continue;
          if (grid.walkable[grid.idx(cx + dx, cz + dz)] === 1) { visible = true; break; }
        }
      }
      if (visible) wallCells.push(i);
    }
  }

  const wallGeo = new THREE.BoxGeometry(1, 1, 1);
  const wallMat = new THREE.MeshStandardMaterial({
    map: tex.concrete,
    roughness: 0.95,
    metalness: 0.0,
  });
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallCells.length);
  walls.castShadow = true;
  walls.receiveShadow = true;
  walls.name = 'walls';
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  const p = new THREE.Vector3();
  wallCells.forEach((cellIndex, n) => {
    const cx = cellIndex % grid.cols;
    const cz = (cellIndex - cx) / grid.cols;
    const h = grid.height[cellIndex] as number;
    p.set(grid.centerX(cx), h / 2, grid.centerZ(cz));
    scl.set(grid.cell + 0.02, h, grid.cell + 0.02);
    m.compose(p, q, scl);
    walls.setMatrixAt(n, m);
  });
  walls.instanceMatrix.needsUpdate = true;
  group.add(walls);

  // ---------------------------------------------------------------- ceilings
  const roofCells: number[] = [];
  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] !== 1 || grid.roof[i] !== 1) continue;
      roofCells.push(i);
    }
  }
  const ceilGeo = new THREE.BoxGeometry(1, 1, 1);
  const ceilMat = new THREE.MeshStandardMaterial({
    map: tex.wall,
    roughness: 0.96,
    metalness: 0.0,
    color: 0xb9b0a0,
  });
  const ceilings = new THREE.InstancedMesh(ceilGeo, ceilMat, roofCells.length);
  ceilings.castShadow = false;
  ceilings.receiveShadow = true;
  ceilings.name = 'ceilings';
  roofCells.forEach((cellIndex, n) => {
    const cx = cellIndex % grid.cols;
    const cz = (cellIndex - cx) / grid.cols;
    const h = grid.height[cellIndex] as number;
    p.set(grid.centerX(cx), h - 0.17, grid.centerZ(cz));
    scl.set(grid.cell + 0.02, 0.34, grid.cell + 0.02);
    m.compose(p, q, scl);
    ceilings.setMatrixAt(n, m);
  });
  ceilings.instanceMatrix.needsUpdate = true;
  group.add(ceilings);

  // ---------------------------------------------------------------- props
  const props: THREE.Mesh[] = [];
  for (const def of PROPS) {
    const style = PROP_STYLE[def.kind];
    const map = (def.kind === 'crate' || def.kind === 'door')
      ? tex.crate
      : style.map === 'metal' ? tex.metal : tex.concrete;
    const geo = def.kind === 'barrel'
      ? new THREE.CylinderGeometry(def.w / 2, def.w / 2, def.h, 14)
      : new THREE.BoxGeometry(def.w, def.h, def.d);
    const mat = new THREE.MeshStandardMaterial({
      map,
      color: def.kind === 'crate' || def.kind === 'door' ? 0xffffff : style.color,
      roughness: def.kind === 'barrel' || def.kind === 'car' ? 0.55 : 0.92,
      metalness: def.kind === 'barrel' || def.kind === 'car' ? 0.35 : 0.0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(def.x, def.y + def.h / 2, def.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = def.id;
    group.add(mesh);
    props.push(mesh);

    // sandbags get a softer, slightly different top cap
    if (def.kind === 'sandbag') {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(def.w * 0.92, def.h * 0.22, def.d * 0.92),
        new THREE.MeshStandardMaterial({ map: tex.concrete, color: 0xc0ab7e, roughness: 1.0 }),
      );
      cap.position.set(def.x, def.y + def.h + 0.02, def.z);
      cap.castShadow = true;
      group.add(cap);
      props.push(cap);
    }
  }

  return { group, floor, walls, ceilings, props };
}

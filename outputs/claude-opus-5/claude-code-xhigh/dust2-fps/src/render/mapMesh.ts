/**
 * 把碰撞世界里的 AABB 直接烘成渲染网格。
 * 关键点：
 *  - 按材质合批（每种材质一个 BufferGeometry），整张地图只有 8 个 draw call；
 *  - UV 按世界尺寸生成，所以不管盒子多大，砖块/木纹的密度都是一致的，
 *    不会出现拉伸变形；
 *  - 手写六个面（而不是用 BoxGeometry 再合并），既能控制 UV 也顺手剔掉看不见的底面。
 */

import * as THREE from 'three';
import type { CollisionWorld, Box } from '../map/collision.ts';
import type { SurfaceKind } from '../map/dust2.ts';
import { surfaceTextures } from './textures.ts';

/** 每种材质多少米重复一次贴图 */
const TILE: Record<SurfaceKind, number> = {
  sand: 3.0,
  stone: 2.2,
  wall: 2.6,
  plaster: 3.0,
  crate: 1.1,
  metal: 1.6,
  concrete: 2.0,
  barrel: 1.1,
};

interface Buffers {
  pos: number[];
  nor: number[];
  uv: number[];
}

function pushQuad(
  b: Buffers,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
  dx: number, dy: number, dz: number,
  nx: number, ny: number, nz: number,
  u: number,
  v: number,
  uOff: number,
  vOff: number,
): void {
  // 两个三角形 a-b-c, a-c-d
  const p = b.pos;
  p.push(ax, ay, az, bx, by, bz, cx, cy, cz, ax, ay, az, cx, cy, cz, dx, dy, dz);
  const n = b.nor;
  for (let i = 0; i < 6; i++) n.push(nx, ny, nz);
  const t = b.uv;
  t.push(
    uOff, vOff,
    uOff + u, vOff,
    uOff + u, vOff + v,
    uOff, vOff,
    uOff + u, vOff + v,
    uOff, vOff + v,
  );
}

function addBox(b: Buffers, box: Box, tile: number): void {
  const { minX, minY, minZ, maxX, maxY, maxZ } = box;
  const w = maxX - minX;
  const h = maxY - minY;
  const d = maxZ - minZ;
  const su = w / tile;
  const sv = h / tile;
  const sd = d / tile;
  // 让相邻盒子的贴图对得上：UV 起点按世界坐标偏移
  const ou = minX / tile;
  const ov = minY / tile;
  const od = minZ / tile;

  // +X
  pushQuad(b, maxX, minY, maxZ, maxX, minY, minZ, maxX, maxY, minZ, maxX, maxY, maxZ, 1, 0, 0, sd, sv, od, ov);
  // -X
  pushQuad(b, minX, minY, minZ, minX, minY, maxZ, minX, maxY, maxZ, minX, maxY, minZ, -1, 0, 0, sd, sv, od, ov);
  // +Y（顶面）
  pushQuad(b, minX, maxY, maxZ, maxX, maxY, maxZ, maxX, maxY, minZ, minX, maxY, minZ, 0, 1, 0, su, sd, ou, od);
  // -Y（底面）：地板/台阶的底面永远看不到，省掉
  if (box.role !== 'floor' && box.role !== 'step') {
    pushQuad(b, minX, minY, minZ, maxX, minY, minZ, maxX, minY, maxZ, minX, minY, maxZ, 0, -1, 0, su, sd, ou, od);
  }
  // +Z
  pushQuad(b, minX, minY, maxZ, maxX, minY, maxZ, maxX, maxY, maxZ, minX, maxY, maxZ, 0, 0, 1, su, sv, ou, ov);
  // -Z
  pushQuad(b, maxX, minY, minZ, minX, minY, minZ, minX, maxY, minZ, maxX, maxY, minZ, 0, 0, -1, su, sv, ou, ov);
}

export interface MapMeshes {
  group: THREE.Group;
  dispose: () => void;
}

export function buildMapMeshes(world: CollisionWorld): MapMeshes {
  const textures = surfaceTextures();
  const buffers = new Map<SurfaceKind, Buffers>();

  for (const box of world.boxes) {
    let buf = buffers.get(box.kind);
    if (!buf) {
      buf = { pos: [], nor: [], uv: [] };
      buffers.set(box.kind, buf);
    }
    addBox(buf, box, TILE[box.kind]);
  }

  const group = new THREE.Group();
  group.name = 'map';
  const disposables: Array<{ dispose: () => void }> = [];

  for (const [kind, buf] of buffers) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(buf.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(buf.nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(buf.uv, 2));
    geo.computeBoundingSphere();

    const mat = new THREE.MeshLambertMaterial({
      map: textures[kind],
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `map-${kind}`;
    mesh.castShadow = kind !== 'sand';
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
    disposables.push(geo, mat);
  }

  return {
    group,
    dispose: () => {
      for (const d of disposables) d.dispose();
    },
  };
}

/** 地图之外的远景地面 + 天空盒，避免从高处看到"虚空"。 */
export function buildEnvironment(skyTex: THREE.Texture): THREE.Group {
  const group = new THREE.Group();

  const groundGeo = new THREE.PlaneGeometry(900, 900);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xb59a6f });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  ground.receiveShadow = false;
  group.add(ground);

  const skyGeo = new THREE.SphereGeometry(420, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.renderOrder = -1;
  group.add(sky);

  // 远处的城墙轮廓，让地平线不那么空
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xa08654 });
  const shapes = new THREE.Group();
  for (let i = 0; i < 26; i++) {
    const ang = (i / 26) * Math.PI * 2;
    const r = 140 + ((i * 37) % 40);
    const w = 22 + ((i * 13) % 26);
    const h = 10 + ((i * 7) % 16);
    const geo = new THREE.BoxGeometry(w, h, 14);
    const m = new THREE.Mesh(geo, wallMat);
    m.position.set(Math.cos(ang) * r, h / 2 - 1.6, Math.sin(ang) * r);
    m.rotation.y = -ang;
    shapes.add(m);
  }
  group.add(shapes);

  return group;
}

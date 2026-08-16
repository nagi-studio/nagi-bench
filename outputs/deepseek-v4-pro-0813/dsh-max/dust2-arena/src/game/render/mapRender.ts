// ============================================================================
// 地图 3D 渲染 —— 由 MapData 生成合并几何体（按材质分组，一材质一 mesh）
// ============================================================================
import * as THREE from 'three';
import { MAP } from '../map/dust2';
import type { RampRect } from '../types';

const MAT = {
  floor: new THREE.MeshLambertMaterial({ color: 0xc9b285 }),
  floorDark: new THREE.MeshLambertMaterial({ color: 0xa8986f }),
  wall: new THREE.MeshLambertMaterial({ color: 0xd9c9a3 }),
  wallTrim: new THREE.MeshLambertMaterial({ color: 0xb7a67f }),
  crate: new THREE.MeshLambertMaterial({ color: 0x9c7248 }),
  crateTop: new THREE.MeshLambertMaterial({ color: 0x8a6240 }),
  door: new THREE.MeshLambertMaterial({ color: 0x7d6a3a }),
  doorLong: new THREE.MeshLambertMaterial({ color: 0x6e5a30 }),
  car: new THREE.MeshLambertMaterial({ color: 0x4a5d43 }),
  carDark: new THREE.MeshLambertMaterial({ color: 0x33422f }),
};

function boxGeom(w: number, h: number, d: number): THREE.BoxGeometry {
  return new THREE.BoxGeometry(w, h, d);
}

/** 坡道楔形几何（沿 x 或 z 方向抬升） */
function rampGeom(r: RampRect): THREE.BufferGeometry {
  const { x, z, w, d } = r;
  const hAt = (t: number) => r.h0 + (r.h1 - r.h0) * t;
  const positions: number[] = [];
  const normals: number[] = [];
  const up = [0, 1, 0];
  // 底四角 + 顶四角（沿 axis 线性）
  const corner = (cx: number, cz: number): [number, number, number] => {
    const t = r.axis === 'x' ? cx : cz;
    return [r.axis === 'x' ? x + cx * w : x + cx * w, hAt(t), r.axis === 'z' ? z + cz * d : z + cz * d];
  };
  const b00 = [x, 0, z] as const, b10 = [x + w, 0, z] as const, b01 = [x, 0, z + d] as const, b11 = [x + w, 0, z + d] as const;
  const t00 = corner(0, 0), t10 = corner(1, 0), t01 = corner(0, 1), t11 = corner(1, 1);
  const pushQuad = (a: readonly number[], b: readonly number[], c: readonly number[], d2: readonly number[], n: readonly number[]) => {
    const tri = (p1: readonly number[], p2: readonly number[], p3: readonly number[]) => {
      positions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
      for (let i = 0; i < 3; i++) normals.push(n[0], n[1], n[2]);
    };
    tri(a, b, c); tri(a, c, d2);
  };
  // 顶面
  pushQuad(t00, t10, t11, t01, [0, 1, 0]);
  // 底面
  pushQuad(b00, b01, b11, b10, [0, -1, 0]);
  // 侧面（四边，法线按斜边）
  if (r.axis === 'x') {
    pushQuad(t00, b00, b01, t01, [0, 0, -1]);
    pushQuad(t10, t11, b11, b10, [0, 0, 1]);
    const nx = Math.cos(Math.atan2(r.h1 - r.h0, w));
    pushQuad(b00, t00, t10, b10, [-nx, Math.sin(Math.atan2(r.h1 - r.h0, w)), 0]);
    pushQuad(b01, b11, t11, t01, [nx, Math.sin(Math.atan2(r.h1 - r.h0, w)), 0]);
  } else {
    pushQuad(t00, t10, b10, b00, [-1, 0, 0]);
    pushQuad(t01, b01, b11, t11, [1, 0, 0]);
    const nz = Math.cos(Math.atan2(r.h1 - r.h0, d));
    pushQuad(b00, b01, t01, t00, [0, Math.sin(Math.atan2(r.h1 - r.h0, d)), -nz]);
    pushQuad(b10, t10, t11, b11, [0, Math.sin(Math.atan2(r.h1 - r.h0, d)), nz]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.computeBoundingSphere();
  return g;
}

export function buildMapMeshes(scene: THREE.Scene): void {
  // ---- 地面 ----
  {
    const geos: THREE.BufferGeometry[] = [];
    for (const f of MAP.flats) {
      const g = boxGeom(f.w, 0.3, f.d);
      g.translate(f.x + f.w / 2, f.h - 0.15, f.z + f.d / 2);
      geos.push(g);
    }
    const merged = mergeGeos(geos);
    scene.add(new THREE.Mesh(merged, MAT.floor));
    geos.forEach((g) => g.dispose());
  }
  // ---- 坡道 ----
  for (const r of MAP.ramps) {
    scene.add(new THREE.Mesh(rampGeom(r), MAT.floorDark));
  }
  // ---- 墙（自动 + 手动） ----
  {
    const geos: THREE.BufferGeometry[] = [];
    for (const b of MAP.colliders) {
      const w = b.maxX - b.minX, h = b.maxY - b.minY, d = b.maxZ - b.minZ;
      const g = boxGeom(w, h, d);
      g.translate((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
      geos.push(g);
    }
    const merged = mergeGeos(geos);
    scene.add(new THREE.Mesh(merged, MAT.wall));
    geos.forEach((g) => g.dispose());
  }
  // ---- 门体 ----
  for (const b of MAP.doors) {
    const w = b.maxX - b.minX, h = b.maxY - b.minY, d = b.maxZ - b.minZ;
    const g = boxGeom(w, h, d);
    g.translate((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
    scene.add(new THREE.Mesh(g, d > w ? MAT.doorLong : MAT.door));
  }
  // ---- 箱子 / 车 ----
  for (let i = 0; i < MAP.crateList.length; i++) {
    const b = MAP.crateList[i];
    const w = b.maxX - b.minX, h = b.maxY - b.minY, d = b.maxZ - b.minZ;
    const isCar = w > 3.5;
    const g = boxGeom(w, h, d);
    g.translate((b.minX + b.maxX) / 2, b.minY + h / 2, (b.minZ + b.maxZ) / 2);
    scene.add(new THREE.Mesh(g, isCar ? MAT.car : (i % 2 === 0 ? MAT.crate : MAT.crateTop)));
    if (isCar) {
      const cab = boxGeom(1.6, 0.55, d * 0.9);
      cab.translate((b.minX + b.maxX) / 2 - w * 0.18, b.minY + h + 0.27, (b.minZ + b.maxZ) / 2);
      scene.add(new THREE.Mesh(cab, MAT.carDark));
    }
  }
  // ---- 下包区地面标记 ----
  const siteMark = (sx: number, sz: number, sw: number, sd: number, color: number) => {
    const g = new THREE.PlaneGeometry(sw, sd);
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false }));
    m.position.set(sx + sw / 2, 0.03, sz + sd / 2);
    scene.add(m);
  };
  siteMark(MAP.sites.A.x, MAP.sites.A.z, MAP.sites.A.w, MAP.sites.A.d, 0xff5533);
  siteMark(MAP.sites.B.x, MAP.sites.B.z, MAP.sites.B.w, MAP.sites.B.d, 0xff5533);
  // A / B 地面字母
  const letter = (ch: string, x: number, z: number, size: number, color: number) => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#00000000';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 110px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillText(ch, 64, 68);
    const tex = new THREE.CanvasTexture(c);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.55, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.05, z);
    scene.add(m);
  };
  letter('A', 28, -20, 6, 0xcc3300);
  letter('B', -24, -19, 6, 0xcc3300);
}

function mergeGeos(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  for (const g of geos) {
    const p = g.getAttribute('position') as THREE.BufferAttribute;
    const n = g.getAttribute('normal') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      positions.push(p.getX(i), p.getY(i), p.getZ(i));
      normals.push(n.getX(i), n.getY(i), n.getZ(i));
    }
  }
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return merged;
}

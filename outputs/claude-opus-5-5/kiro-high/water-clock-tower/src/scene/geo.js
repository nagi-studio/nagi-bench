// 几何辅助：组合/合并网格、齿轮造型、朝向
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const UP = new THREE.Vector3(0, 1, 0);

/** 按材质收集几何体，最后合并为少量网格（降低绘制调用） */
export class Builder {
  constructor() {
    this.parts = new Map(); // material -> geometry[]
  }
  add(geometry, material, matrix) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    if (matrix) g.applyMatrix4(matrix);
    // 统一属性，便于合并
    if (!g.attributes.uv) {
      const n = g.attributes.position.count;
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    }
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!this.parts.has(material)) this.parts.set(material, []);
    this.parts.get(material).push(g);
    return this;
  }
  box(sx, sy, sz, material, pos, quat) {
    return this.add(new THREE.BoxGeometry(sx, sy, sz), material, mat(pos, quat));
  }
  cyl(rTop, rBot, h, material, pos, quat, seg = 24) {
    return this.add(new THREE.CylinderGeometry(rTop, rBot, h, seg), material, mat(pos, quat));
  }
  sphere(r, material, pos, seg = 16) {
    return this.add(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2)), material, mat(pos));
  }
  /** 两点之间的圆柱（杆） */
  rod(a, b, r, material, seg = 10) {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const d = B.clone().sub(A);
    const len = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
    return this.add(new THREE.CylinderGeometry(r, r, len, seg), material, mat(A.clone().add(B).multiplyScalar(0.5), q));
  }
  /** 两点之间的方木 */
  beam(a, b, w, h, material, up = [0, 0, 1]) {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const d = B.clone().sub(A);
    const len = d.length();
    const x = d.clone().normalize();
    let z = new THREE.Vector3(...up);
    const y = z.clone().cross(x).normalize();
    if (y.lengthSq() < 1e-6) y.set(0, 1, 0);
    z = x.clone().cross(y).normalize();
    const m4 = new THREE.Matrix4().makeBasis(x, y, z);
    m4.setPosition(A.clone().add(B).multiplyScalar(0.5));
    return this.add(new THREE.BoxGeometry(len, w, h), material, m4);
  }
  torus(R, r, material, pos, quat, seg = 64, arc = Math.PI * 2) {
    return this.add(new THREE.TorusGeometry(R, r, 8, seg, arc), material, mat(pos, quat));
  }
  merge(group, { cast = true, receive = true } = {}) {
    for (const [material, list] of this.parts) {
      const g = mergeGeometries(list, false);
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, material);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      group.add(mesh);
    }
    this.parts.clear();
    return group;
  }
}

export function mat(pos = [0, 0, 0], quat) {
  const m = new THREE.Matrix4();
  const p = Array.isArray(pos) ? new THREE.Vector3(...pos) : pos;
  m.compose(p, quat || new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
  return m;
}

export function quatFromY(axis) {
  return new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...axis).normalize());
}

/**
 * 齿轮（局部轴为 +Y，齿沿 XZ 平面分布），直接加入 Builder。
 * kind: 'spur' 圆柱齿轮 | 'crown' 冠齿（齿朝 +Y）| 'bevel' 45° 伞齿（齿面朝 +Y 外斜）
 * meshDir：世界坐标中指向啮合点的方向；gap=true 表示该处应是齿槽。
 */
export function addGear(builder, { kind = 'spur', teeth, r, width = 0.06, toothH = 0.05, center, axis, meshDir, gap = false, material, hubMat }) {
  const q = quatFromY(axis);
  const qi = q.clone().invert();
  const local = new THREE.Vector3(...meshDir).applyQuaternion(qi);
  const pitch = (Math.PI * 2) / teeth;
  const phi0 = Math.atan2(local.z, local.x) + (gap ? pitch / 2 : 0);
  const c = new THREE.Vector3(...center);
  const place = (geom, lpos, lquat) => {
    const m = new THREE.Matrix4().compose(lpos, lquat || new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
    const world = new THREE.Matrix4().compose(c, q, new THREE.Vector3(1, 1, 1)).multiply(m);
    builder.add(geom, material, world);
  };
  const tw = ((2 * Math.PI * r) / teeth) * 0.5;
  if (kind === 'spur') {
    place(new THREE.CylinderGeometry(r, r, width, Math.max(16, teeth * 2)), new THREE.Vector3());
    const tg = new THREE.BoxGeometry(toothH, width, tw);
    for (let k = 0; k < teeth; k++) {
      const a = phi0 + k * pitch;
      place(tg, new THREE.Vector3((r + toothH / 2) * Math.cos(a), 0, (r + toothH / 2) * Math.sin(a)), new THREE.Quaternion().setFromAxisAngle(UP, -a));
    }
  } else if (kind === 'crown') {
    place(new THREE.CylinderGeometry(r + toothH * 0.3, r + toothH * 0.3, width, Math.max(24, teeth * 2)), new THREE.Vector3(0, -toothH / 2 - width / 2, 0));
    const tg = new THREE.BoxGeometry(toothH * 1.2, toothH, tw);
    for (let k = 0; k < teeth; k++) {
      const a = phi0 + k * pitch;
      place(tg, new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)), new THREE.Quaternion().setFromAxisAngle(UP, -a));
    }
  } else if (kind === 'bevel') {
    // 节锥 45°：齿位于半径 r 处，向 -Y 方向收拢
    place(new THREE.CylinderGeometry(r * 0.55, r, width * 1.3, Math.max(16, teeth * 2)), new THREE.Vector3(0, -width * 0.65, 0));
    const tg = new THREE.BoxGeometry(toothH * 1.3, toothH, tw);
    for (let k = 0; k < teeth; k++) {
      const a = phi0 + k * pitch;
      const qa = new THREE.Quaternion().setFromAxisAngle(UP, -a);
      const tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);
      place(tg, new THREE.Vector3((r - toothH * 0.25) * Math.cos(a), -toothH * 0.25, (r - toothH * 0.25) * Math.sin(a)), qa.multiply(tilt));
    }
  }
  if (hubMat) place(new THREE.CylinderGeometry(r * 0.28, r * 0.28, width * 2.2, 12), new THREE.Vector3(0, -width * 0.3, 0));
}

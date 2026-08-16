// 基础数学工具：向量、AABB、射线检测（无 three 依赖，供引擎与测试共用）

export interface V3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  penetrable?: boolean; // 可被子弹穿透（中门）
  step?: boolean; // 楼梯台阶（不阻挡寻路网格，用于爬升）
}

export const v3 = (x = 0, y = 0, z = 0): V3 => ({ x, y, z });

export function dist2D(ax: number, az: number, bx: number, bz: number): number {
  const dx = ax - bx;
  const dz = az - bz;
  return Math.hypot(dx, dz);
}

export function dist3D(a: V3, b: V3): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 角度差（-PI..PI） */
export function angleDelta(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** 朝目标角度旋转（有限速率） */
export function turnToward(cur: number, target: number, maxDelta: number): number {
  return cur + clamp(angleDelta(target, cur), -maxDelta, maxDelta);
}

/** 射线与 AABB 求交（slab 法），返回进入距离或 -1 */
export function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  b: AABB
): number {
  let tmin = 0;
  let tmax = Infinity;
  // X
  if (Math.abs(dx) < 1e-9) {
    if (ox < b.minX || ox > b.maxX) return -1;
  } else {
    let t1 = (b.minX - ox) / dx;
    let t2 = (b.maxX - ox) / dx;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  // Y
  if (Math.abs(dy) < 1e-9) {
    if (oy < b.minY || oy > b.maxY) return -1;
  } else {
    let t1 = (b.minY - oy) / dy;
    let t2 = (b.maxY - oy) / dy;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  // Z
  if (Math.abs(dz) < 1e-9) {
    if (oz < b.minZ || oz > b.maxZ) return -1;
  } else {
    let t1 = (b.minZ - oz) / dz;
    let t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  return tmin;
}

/** 点是否在 AABB 内 */
export function pointInAABB(x: number, y: number, z: number, b: AABB): boolean {
  return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY && z >= b.minZ && z <= b.maxZ;
}

/** 移动的 AABB（半宽 hw，高 h，y 为脚底）与静态 AABB 的碰撞解算（轴分离）。
 *  传入移动前位置 prev 与移动后位置 next；只在该轴“新进入”的盒上解算，避免侧向弹出。
 *  返回是否触地。next 会被修改为解算后的位置。 */
export function resolveMove(
  prev: V3,
  next: V3,
  hw: number,
  h: number,
  colliders: AABB[],
  opts?: { skip?: (b: AABB) => boolean; stepMax?: number }
): { grounded: boolean; hitWallX: boolean; hitWallZ: boolean } {
  const skip = opts?.skip;
  const stepMax = opts?.stepMax ?? 0.56;
  let grounded = false;
  let hitWallX = false;
  let hitWallZ = false;
  for (let iter = 0; iter < 2; iter++) {
    // X 轴
    for (const b of colliders) {
      if (skip && skip(b)) continue;
      if (next.y + h <= b.minY + 1e-4 || next.y >= b.maxY - 1e-4) continue;
      if (b.step && b.maxY - next.y <= stepMax + 1e-4) continue; // 低台阶：不推出，交给地面吸附抬升
      if (next.x + hw > b.minX && next.x - hw < b.maxX && next.z + hw > b.minZ && next.z - hw < b.maxZ) {
        // 移动前 X 已重叠（沿墙走）：不在 X 轴弹出
        if (prev.x + hw > b.minX && prev.x - hw < b.maxX) continue;
        const pushL = next.x + hw - b.minX;
        const pushR = b.maxX - (next.x - hw);
        if (Math.abs(pushL) < Math.abs(pushR)) next.x -= pushL + 0.002;
        else next.x += pushR + 0.002;
        hitWallX = true;
      }
    }
    // Z 轴
    for (const b of colliders) {
      if (skip && skip(b)) continue;
      if (next.y + h <= b.minY + 1e-4 || next.y >= b.maxY - 1e-4) continue;
      if (b.step && b.maxY - next.y <= stepMax + 1e-4) continue; // 低台阶：不推出，交给地面吸附抬升
      if (next.z + hw > b.minZ && next.z - hw < b.maxZ && next.x + hw > b.minX && next.x - hw < b.maxX) {
        if (prev.z + hw > b.minZ && prev.z - hw < b.maxZ) continue;
        const pushF = next.z + hw - b.minZ;
        const pushB = b.maxZ - (next.z - hw);
        if (Math.abs(pushF) < Math.abs(pushB)) next.z -= pushF + 0.002;
        else next.z += pushB + 0.002;
        hitWallZ = true;
      }
    }
  }
  // Y 轴（要求 XZ 至少 0.03 的实际压入，避免边界擦碰导致“落在”台阶上）
  for (const b of colliders) {
    if (skip && skip(b)) continue;
    const xov = next.x + hw > b.minX + 0.03 && next.x - hw < b.maxX - 0.03;
    const zov = next.z + hw > b.minZ + 0.03 && next.z - hw < b.maxZ - 0.03;
    if (!xov || !zov) continue;
    if (next.y < b.maxY && next.y + h > b.minY) {
      // 从上方落下着地
      if (prev.y >= b.maxY - 1e-4) {
        next.y = b.maxY;
        grounded = true;
      } else if (next.y >= b.maxY - 0.55 && next.y < b.maxY && prev.y > next.y) {
        next.y = b.maxY;
        grounded = true;
      } else if (prev.y + h <= b.minY + 1e-4 && next.y + h > b.minY) {
        next.y = b.minY - h; // 上升顶头
      }
    }
  }
  return { grounded, hitWallX, hitWallZ };
}

/** 脚下支撑检测：返回支撑面高度，无支撑返回 -Infinity */
export function groundHeight(
  x: number, z: number, hw: number, feetY: number, colliders: AABB[],
  skip?: (b: AABB) => boolean, allowStepUp = false
): number {
  let best = -Infinity;
  for (const b of colliders) {
    if (skip && skip(b)) continue;
    if (b.maxY > feetY + 0.01) {
      // 仅对台阶盒允许一步内抬升（供移动时的地面吸附）
      if (!(allowStepUp && b.step && b.maxY <= feetY + 0.57)) continue;
    }
    if (x + hw > b.minX && x - hw < b.maxX && z + hw > b.minZ && z - hw < b.maxZ) {
      if (b.maxY > best) best = b.maxY;
    }
  }
  return best;
}

/** XZ 平面线段与 AABB（视作立柱）是否相交 */
export function segHitsAABB2D(
  ax: number, az: number, bx: number, bz: number, box: AABB, inflate = 0
): boolean {
  const minX = box.minX - inflate, maxX = box.maxX + inflate;
  const minZ = box.minZ - inflate, maxZ = box.maxZ + inflate;
  // 快速排除
  if (Math.max(ax, bx) < minX || Math.min(ax, bx) > maxX) return false;
  if (Math.max(az, bz) < minZ || Math.min(az, bz) > maxZ) return false;
  // 端点在内
  if ((ax >= minX && ax <= maxX && az >= minZ && az <= maxZ)) return true;
  if ((bx >= minX && bx <= maxX && bz >= minZ && bz <= maxZ)) return true;
  // 线段与四条边相交
  const dx = bx - ax, dz = bz - az;
  const t = (p: number, q: number, r: number, s: number): number => {
    // 与边 (p,q)-(r,s) 相交参数
    const ex = r - p, ez = s - q;
    const denom = dx * ez - dz * ex;
    if (Math.abs(denom) < 1e-12) return -1;
    const t = ((p - ax) * ez - (q - az) * ex) / denom;
    if (t < 0 || t > 1) return -1;
    const u = ((p - ax) * dz - (q - az) * dx) / denom;
    return u >= 0 && u <= 1 ? t : -1;
  };
  const edges: [number, number, number, number][] = [
    [minX, minZ, maxX, minZ], [maxX, minZ, maxX, maxZ],
    [maxX, maxZ, minX, maxZ], [minX, maxZ, minX, minZ],
  ];
  for (const [p, q, r, s] of edges) if (t(p, q, r, s) >= 0) return true;
  return false;
}

/** 生成在锥形（或圆）内均匀分布的随机方向偏移（spread 为锥半角弧度） */
export function spreadDir(
  dx: number, dy: number, dz: number, spread: number, rng: () => number = Math.random
): V3 {
  // 建立正交基
  let ux: number, uy: number, uz: number;
  const ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz);
  if (ax < ay && ax < az) {
    ux = 0; uy = -dz; uz = dy;
  } else if (ay < az) {
    ux = -dz; uy = 0; uz = dx;
  } else {
    ux = -dy; uy = dx; uz = 0;
  }
  const ul = Math.hypot(ux, uy, uz) || 1;
  ux /= ul; uy /= ul; uz /= ul;
  const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
  const vl = Math.hypot(vx, vy, vz) || 1;
  const theta = rng() * Math.PI * 2;
  const r = Math.tan(spread) * Math.sqrt(rng());
  const ua = Math.cos(theta) * r, va = Math.sin(theta) * r;
  const rx = dx + ux * ua + vx / vl * va;
  const ry = dy + uy * ua + vy / vl * va;
  const rz = dz + uz * ua + vz / vl * va;
  const l = Math.hypot(rx, ry, rz) || 1;
  return { x: rx / l, y: ry / l, z: rz / l };
}

/** 简易随机 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

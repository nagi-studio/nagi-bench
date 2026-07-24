/**
 * 纯数学工具层：不依赖 three.js，因此整个模拟核心（地图 / 物理 / AI / 回合）
 * 都可以在 Node 中无渲染地跑起来测试。渲染层再把这些结构映射到 THREE.Vector3。
 *
 * 角度约定（与 three.js 相机 rotation.order = 'YXZ' 一致）：
 *   yaw = 0 时朝向 -Z；yaw 增大时向左（+X 一侧）转。
 *   pitch > 0 表示抬头。
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export function v3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

export function vset(o: Vec3, x: number, y: number, z: number): Vec3 {
  o.x = x;
  o.y = y;
  o.z = z;
  return o;
}

export function vcopy(o: Vec3, a: Vec3): Vec3 {
  o.x = a.x;
  o.y = a.y;
  o.z = a.z;
  return o;
}

export function vclone(a: Vec3): Vec3 {
  return { x: a.x, y: a.y, z: a.z };
}

export function vadd(o: Vec3, a: Vec3, b: Vec3): Vec3 {
  o.x = a.x + b.x;
  o.y = a.y + b.y;
  o.z = a.z + b.z;
  return o;
}

export function vsub(o: Vec3, a: Vec3, b: Vec3): Vec3 {
  o.x = a.x - b.x;
  o.y = a.y - b.y;
  o.z = a.z - b.z;
  return o;
}

export function vscale(o: Vec3, a: Vec3, s: number): Vec3 {
  o.x = a.x * s;
  o.y = a.y * s;
  o.z = a.z * s;
  return o;
}

export function vaddScaled(o: Vec3, a: Vec3, b: Vec3, s: number): Vec3 {
  o.x = a.x + b.x * s;
  o.y = a.y + b.y * s;
  o.z = a.z + b.z * s;
  return o;
}

export function vlenSq(a: Vec3): number {
  return a.x * a.x + a.y * a.y + a.z * a.z;
}

export function vlen(a: Vec3): number {
  return Math.sqrt(vlenSq(a));
}

export function vdistSq(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

export function vdist(a: Vec3, b: Vec3): number {
  return Math.sqrt(vdistSq(a, b));
}

/** 水平面距离（忽略高度），AI 与小地图大量使用。 */
export function vdist2D(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function vdist2DSq(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

export function vnormalize(o: Vec3, a: Vec3): Vec3 {
  const l = vlen(a);
  if (l < 1e-9) return vset(o, 0, 0, 0);
  return vscale(o, a, 1 / l);
}

export function vdot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vcross(o: Vec3, a: Vec3, b: Vec3): Vec3 {
  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  return vset(o, x, y, z);
}

export function vlerp(o: Vec3, a: Vec3, b: Vec3, t: number): Vec3 {
  o.x = a.x + (b.x - a.x) * t;
  o.y = a.y + (b.y - a.y) * t;
  o.z = a.z + (b.z - a.z) * t;
  return o;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 与帧率无关的指数趋近，rate 越大越快。 */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-rate * dt));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function sign(x: number): number {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}

/** 把角度归一化到 (-PI, PI]。 */
export function wrapAngle(a: number): number {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

/** 两角之间的最短差值 b - a。 */
export function angleDelta(a: number, b: number): number {
  return wrapAngle(b - a);
}

/** 以最大步长把角度 a 转向 b。 */
export function turnToward(a: number, b: number, maxStep: number): number {
  const d = angleDelta(a, b);
  if (Math.abs(d) <= maxStep) return wrapAngle(b);
  return wrapAngle(a + sign(d) * maxStep);
}

/** yaw/pitch -> 单位方向向量。 */
export function anglesToDir(o: Vec3, yaw: number, pitch: number): Vec3 {
  const cp = Math.cos(pitch);
  return vset(o, -Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp);
}

/** 方向向量 -> yaw。 */
export function dirToYaw(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz);
}

/** 方向向量 -> pitch。 */
export function dirToPitch(dx: number, dy: number, dz: number): number {
  const horiz = Math.sqrt(dx * dx + dz * dz);
  return Math.atan2(dy, horiz);
}

/** yaw 对应的“右方向”（用于 A/D 平移）。 */
export function yawRight(o: Vec3, yaw: number): Vec3 {
  return vset(o, Math.cos(yaw), 0, -Math.sin(yaw));
}

/** yaw 对应的水平前进方向。 */
export function yawForward(o: Vec3, yaw: number): Vec3 {
  return vset(o, -Math.sin(yaw), 0, -Math.cos(yaw));
}

/** 构造一组与 dir 正交的基（用于弹道扩散）。 */
export function basisFromDir(dir: Vec3, right: Vec3, up: Vec3): void {
  // dir 近似竖直时换一个参考轴，避免退化
  if (Math.abs(dir.y) > 0.99) {
    vset(right, 1, 0, 0);
  } else {
    vset(right, dir.z, 0, -dir.x);
    vnormalize(right, right);
  }
  vcross(up, right, dir);
  vnormalize(up, up);
}

export interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export function rectContains(r: Rect, x: number, z: number, pad = 0): boolean {
  return x >= r.x0 - pad && x <= r.x1 + pad && z >= r.z0 - pad && z <= r.z1 + pad;
}

export function rectCenterX(r: Rect): number {
  return (r.x0 + r.x1) * 0.5;
}

export function rectCenterZ(r: Rect): number {
  return (r.z0 + r.z1) * 0.5;
}

export function rectsOverlap(a: Rect, b: Rect, eps = 1e-6): boolean {
  return a.x0 < b.x1 - eps && b.x0 < a.x1 - eps && a.z0 < b.z1 - eps && b.z0 < a.z1 - eps;
}

/** 区间求交，返回 null 表示不相交。 */
export function intervalOverlap(
  a0: number,
  a1: number,
  b0: number,
  b1: number,
): [number, number] | null {
  const lo = Math.max(a0, b0);
  const hi = Math.min(a1, b1);
  return hi - lo > 1e-6 ? [lo, hi] : null;
}

/** 从区间集合中挖掉一段（用于在墙上开门洞）。 */
export function subtractInterval(
  segments: Array<[number, number]>,
  lo: number,
  hi: number,
): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const [a, b] of segments) {
    if (hi <= a || lo >= b) {
      out.push([a, b]);
      continue;
    }
    if (lo > a) out.push([a, lo]);
    if (hi < b) out.push([hi, b]);
  }
  return out.filter(([a, b]) => b - a > 1e-4);
}

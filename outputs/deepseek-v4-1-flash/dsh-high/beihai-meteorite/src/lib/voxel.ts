import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { surface } from "./materials";

/**
 * Voxel construction kit.
 *
 * The film's geometry is built almost entirely from boxes and low-segment
 * cylinders. To keep the "one texture tile = one voxel step" look, every box
 * carries UVs scaled by its world dimensions, so a shared material tiles
 * consistently across wildly different sizes.
 */

export type MatLike = THREE.Material | string;

export function resolveMat(m: MatLike): THREE.Material {
  return typeof m === "string" ? surface(m) : m;
}

/** Scale a BoxGeometry's per-face UVs so the map tiles once per `scale` units. */
export function tileBoxUV(geom: THREE.BoxGeometry, w: number, h: number, d: number, scale = 1): void {
  const uv = geom.attributes.uv as THREE.BufferAttribute;
  const su = [d / scale, d / scale, w / scale, w / scale, w / scale, w / scale];
  const sv = [h / scale, h / scale, d / scale, d / scale, h / scale, h / scale];
  for (let f = 0; f < 6; f++) {
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, uv.getX(k) * su[f], uv.getY(k) * sv[f]);
    }
  }
  uv.needsUpdate = true;
}

export interface BoxOpts {
  scale?: number;
  rot?: [number, number, number];
  name?: string;
  cast?: boolean;
  receive?: boolean;
  renderOrder?: number;
}

export function box(
  w: number,
  h: number,
  d: number,
  mat: MatLike,
  x = 0,
  y = 0,
  z = 0,
  opts: BoxOpts = {}
): THREE.Mesh {
  const g = new THREE.BoxGeometry(w, h, d);
  tileBoxUV(g, w, h, d, opts.scale ?? 1);
  const m = new THREE.Mesh(g, resolveMat(mat));
  m.position.set(x, y, z);
  if (opts.rot) m.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.receive ?? true;
  if (opts.renderOrder !== undefined) m.renderOrder = opts.renderOrder;
  if (opts.name) m.name = opts.name;
  return m;
}

/** Blocky cylinder (low radial segments, hard edges). */
export function cyl(
  rTop: number,
  rBot: number,
  h: number,
  mat: MatLike,
  x = 0,
  y = 0,
  z = 0,
  segments = 10,
  opts: BoxOpts = {}
): THREE.Mesh {
  const g = new THREE.CylinderGeometry(rTop, rBot, h, segments, 1, false);
  // tile the side UVs roughly by circumference
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const circ = Math.PI * (rTop + rBot);
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (circ / (opts.scale ?? 1)), uv.getY(i) * (h / (opts.scale ?? 1)));
  uv.needsUpdate = true;
  const m = new THREE.Mesh(g, resolveMat(mat));
  m.position.set(x, y, z);
  if (opts.rot) m.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.receive ?? true;
  if (opts.name) m.name = opts.name;
  return m;
}

/** Axis-aligned plane (for floors / ceilings / decals). */
export function plane(
  w: number,
  h: number,
  mat: MatLike,
  x = 0,
  y = 0,
  z = 0,
  opts: BoxOpts = {}
): THREE.Mesh {
  const g = new THREE.PlaneGeometry(w, h);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (w / (opts.scale ?? 1)), uv.getY(i) * (h / (opts.scale ?? 1)));
  uv.needsUpdate = true;
  const m = new THREE.Mesh(g, resolveMat(mat));
  m.position.set(x, y, z);
  if (opts.rot) m.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  m.castShadow = opts.cast ?? false;
  m.receiveShadow = opts.receive ?? true;
  return m;
}

/** Convenience: a Group with position set. */
export function group(x = 0, y = 0, z = 0, name?: string): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  if (name) g.name = name;
  return g;
}

export function add<T extends THREE.Object3D>(parent: THREE.Object3D, ...children: T[]): T {
  for (const c of children) parent.add(c);
  return children[children.length - 1];
}

/* --------------------------------------------------------------- merging */

function attrSignature(g: THREE.BufferGeometry): string {
  return Object.keys(g.attributes).sort().join(",");
}

/**
 * Collapse a static hierarchy into a handful of merged meshes (one per
 * material / attribute signature). Lights, points and transparent meshes are
 * left in place. This is what lets us put tens of thousands of blocks in a
 * room without thousands of draw calls.
 */
export function mergeStatic(root: THREE.Object3D, skipNames: Set<string> = new Set()): THREE.Group {
  root.updateMatrixWorld(true);

  interface Bucket {
    mat: THREE.Material;
    sig: string;
    geoms: THREE.BufferGeometry[];
    renderOrder: number;
  }
  const buckets = new Map<string, Bucket>();
  const keep: THREE.Object3D[] = [];

  root.traverse((o) => {
    if (o === root) return;
    const mesh = o as THREE.Mesh;
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh || !mesh.geometry) return;
    if (skipNames.has(mesh.name)) return;
    const mat = mesh.material as THREE.Material;
    if (Array.isArray(mesh.material) || mat.transparent) {
      keep.push(mesh);
      return;
    }
    const sig = attrSignature(mesh.geometry);
    const key = `${mat.uuid}|${sig}|${mesh.renderOrder}`;
    let b = buckets.get(key);
    if (!b) {
      b = { mat, sig, geoms: [], renderOrder: mesh.renderOrder };
      buckets.set(key, b);
    }
    const g = mesh.geometry.clone();
    // Bake world transform; normalise to non-indexed to guarantee mergeability.
    g.applyMatrix4(mesh.matrixWorld);
    const ng = g.index ? g.toNonIndexed() : g;
    if (ng !== g) g.dispose();
    b.geoms.push(ng);
  });

  const out = new THREE.Group();
  out.name = `${root.name || "static"}:merged`;
  for (const b of buckets.values()) {
    if (!b.geoms.length) continue;
    const merged = mergeGeometries(b.geoms, false);
    if (!merged) {
      // fall back: keep originals
      continue;
    }
    for (const g of b.geoms) g.dispose();
    const m = new THREE.Mesh(merged, b.mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.renderOrder = b.renderOrder;
    out.add(m);
  }
  // preserve non-mergeable meshes with their world transform baked
  for (const k of keep) {
    const kk = k.clone();
    kk.matrix.copy(k.matrixWorld);
    kk.matrix.decompose(kk.position, kk.quaternion, kk.scale);
    out.add(kk);
  }
  return out;
}

/** Recursively dispose geometries of a subtree (materials are shared). */
export function disposeTree(root: THREE.Object3D): void {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if ((m as unknown as { isMesh?: boolean }).isMesh && m.geometry) m.geometry.dispose();
  });
}

/* ----------------------------------------------------------- primitives */

export interface StepOpts {
  mat: MatLike;
  scale?: number;
  cast?: boolean;
  receive?: boolean;
}

/** A single voxel step. */
export function voxel(size: number, mat: MatLike, x: number, y: number, z: number, opts: Partial<StepOpts> = {}): THREE.Mesh {
  return box(size, size, size, mat, x, y, z, { scale: opts.scale ?? size, cast: opts.cast, receive: opts.receive });
}

/** A wall of voxels (used sparingly — merged geometry is cheaper). */
export function voxelWall(
  cols: number,
  rows: number,
  size: number,
  mat: MatLike,
  origin: THREE.Vector3,
  axis: "x" | "z",
  jitter = 0
): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const y = origin.y + j * size;
      const o = origin.x + i * size;
      const x = axis === "x" ? o : origin.z;
      const z = axis === "x" ? origin.z : o;
      const m = voxel(size, mat, x, y, z);
      if (jitter > 0) {
        m.scale.setScalar(1 - Math.random() * jitter);
      }
      g.add(m);
    }
  }
  return g;
}

import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, type VoxelOptions } from "@agentbench/voxel-kit";

/**
 * Shared voxel vocabulary for the film.
 *
 * Everything that is not a block figure is still built out of blocks: walls,
 * cabinets, machines, planets and debris. These helpers keep one hand on the
 * whole world so a courtyard wall and an orbital shipyard read as the same
 * material system — same voxel grid, same face-culled geometry, same grain.
 */

/** Deterministic value noise. Every dressing decision must survive a seek. */
export function rng(seed: number): () => number {
  let a = (seed * 1_664_525 + 1_013_904_223) >>> 0;
  return () => {
    a = (Math.imul(a ^ (a >>> 15), 1 | a) + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function hash3(x: number, y: number, z: number, seed = 0): number {
  let h = (x * 374_761_393 + y * 668_265_263 + z * 2_147_483_647 + seed * 97) | 0;
  h = Math.imul(h ^ (h >>> 13), 1_274_126_177);
  return ((h ^ (h >>> 16)) >>> 0) / 4_294_967_296;
}

/** Multiply a packed hex colour by a scalar, the cheap way to shade a voxel. */
export function shade(hex: number, amount: number): number {
  const r = Math.min(255, Math.max(0, Math.round(((hex >> 16) & 255) * amount)));
  const g = Math.min(255, Math.max(0, Math.round(((hex >> 8) & 255) * amount)));
  const b = Math.min(255, Math.max(0, Math.round((hex & 255) * amount)));
  return (r << 16) | (g << 8) | b;
}

export function mixHex(a: number, b: number, t: number): number {
  const k = Math.min(1, Math.max(0, t));
  const r = Math.round(((a >> 16) & 255) * (1 - k) + ((b >> 16) & 255) * k);
  const g = Math.round(((a >> 8) & 255) * (1 - k) + ((b >> 8) & 255) * k);
  const c = Math.round((a & 255) * (1 - k) + (b & 255) * k);
  return (r << 16) | (g << 8) | c;
}

/** Per-voxel grain so a flat wall never reads as a flat plane. */
export function grainy(hex: number, x: number, y: number, z: number, amount = 0.07, seed = 0): number {
  return shade(hex, 1 + (hash3(x, y, z, seed) - 0.5) * 2 * amount);
}

export interface SlabOptions extends VoxelOptions {
  /** Lightness swing applied per voxel. */
  grain?: number;
  seed?: number;
  /** Optional per-voxel override; return null to carve a hole. */
  carve?: (x: number, y: number, z: number) => number | null | undefined;
}

/** A rectangular block of voxels — the workhorse for walls, slabs and crates. */
export function slab(
  size: [number, number, number],
  colour: number,
  options: SlabOptions = {},
): THREE.BufferGeometry {
  const { grain = 0.06, seed = 1, carve } = options;
  return buildVoxelGeometry(
    {
      size,
      at(x, y, z) {
        if (carve) {
          const override = carve(x, y, z);
          if (override === null) return null;
          if (typeof override === "number") return grainy(override, x, y, z, grain, seed);
        }
        return grainy(colour, x, y, z, grain, seed);
      },
    },
    options,
  );
}

/** A hollow shell: four walls, floor and ceiling, with the inside carved out. */
export function room(
  size: [number, number, number],
  wall: number,
  floor: number,
  ceiling: number,
  options: SlabOptions & { thickness?: number } = {},
): THREE.BufferGeometry {
  const [sx, sy, sz] = size;
  const t = options.thickness ?? 1;
  const { grain = 0.07, seed = 3 } = options;
  return buildVoxelGeometry(
    {
      size,
      at(x, y, z) {
        const inside = x >= t && x < sx - t && z >= t && z < sz - t && y >= t && y < sy - t;
        if (inside) return null;
        const custom = options.carve?.(x, y, z);
        if (custom === null) return null;
        if (typeof custom === "number") return grainy(custom, x, y, z, grain, seed);
        if (y < t) return grainy(floor, x, y, z, grain * 1.4, seed);
        if (y >= sy - t) return grainy(ceiling, x, y, z, grain, seed + 5);
        return grainy(wall, x, y, z, grain, seed + 11);
      },
    },
    options,
  );
}

const MATERIAL_CACHE = new Map<string, THREE.MeshStandardMaterial>();

/** Shared voxel materials, keyed so the whole film reuses a handful. */
export function voxMat(
  key: string,
  params: THREE.MeshStandardMaterialParameters = {},
): THREE.MeshStandardMaterial {
  const existing = MATERIAL_CACHE.get(key);
  if (existing) return existing;
  const created = voxelMaterial(params);
  MATERIAL_CACHE.set(key, created);
  return created;
}

export interface MeshOptions {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  material?: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
  name?: string;
}

export function mesh(
  geometry: THREE.BufferGeometry,
  parent: THREE.Object3D,
  options: MeshOptions = {},
): THREE.Mesh {
  const item = new THREE.Mesh(geometry, options.material ?? voxMat("solid"));
  if (options.position) item.position.set(...options.position);
  if (options.rotation) item.rotation.set(...options.rotation);
  if (options.scale !== undefined) item.scale.setScalar(options.scale);
  item.castShadow = options.castShadow ?? false;
  item.receiveShadow = options.receiveShadow ?? false;
  if (options.name) item.name = options.name;
  parent.add(item);
  return item;
}

/** An unlit emissive block, for lamps, indicators, muzzle flash and stars. */
export function glowMat(colour: number, opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: colour,
    transparent: opacity < 1,
    opacity,
    toneMapped: false,
    fog: false,
  });
}

/** A lumpy iron-nickel meteorite: the object the whole film turns on. */
export function meteoriteGeometry(radius: number, voxel: number, seed = 7): THREE.BufferGeometry {
  const span = Math.ceil(radius) * 2 + 2;
  const c = span / 2;
  return buildVoxelGeometry(
    {
      size: [span, span, span],
      at(x, y, z) {
        const dx = x + 0.5 - c;
        const dy = y + 0.5 - c;
        const dz = z + 0.5 - c;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const wobble =
          (hash3(Math.floor(x / 2), Math.floor(y / 2), Math.floor(z / 2), seed) - 0.5) * 1.9 +
          (hash3(x, y, z, seed + 3) - 0.5) * 0.5;
        if (d > radius + wobble) return null;
        const pit = hash3(x, y, z, seed + 21);
        // Iron meteorite: dark grey-brown crust, with brighter nickel-iron flecks.
        let base = 0x3b3833;
        if (pit > 0.93) base = 0x8a8b8f;
        else if (pit > 0.82) base = 0x59554d;
        else if (pit < 0.08) base = 0x241f1b;
        const rim = d / (radius + 0.001);
        return shade(base, 0.82 + rim * 0.3);
      },
    },
    { voxel, anchor: "center" },
  );
}

/** Star field. Points, not blocks — the only thing in the film smaller than a voxel. */
export function starField(count: number, radius: number, seed = 11): THREE.Points {
  const random = rng(seed);
  const positions = new Float32Array(count * 3);
  const colours = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colour = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = u * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    const warm = random();
    colour.setHSL(warm > 0.85 ? 0.09 : 0.58, warm > 0.85 ? 0.35 : 0.22, 0.55 + random() * 0.45);
    colours[i * 3] = colour.r;
    colours[i * 3 + 1] = colour.g;
    colours[i * 3 + 2] = colour.b;
    sizes[i] = radius * (0.0012 + random() * 0.0035);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: radius * 0.0035,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

/** Free-floating voxel debris: construction material, offcuts and rubbish. */
export function debrisField(
  count: number,
  spread: number,
  seed = 23,
): { group: THREE.Group; tumble: (time: number) => void } {
  const random = rng(seed);
  const group = new THREE.Group();
  const parts: Array<{ object: THREE.Object3D; axis: THREE.Vector3; rate: number; phase: number }> = [];
  const palette = [0x8d9199, 0x5f6672, 0xb8b2a4, 0x3f444c, 0x6f5f4b];
  for (let i = 0; i < count; i += 1) {
    const w = 1 + Math.floor(random() * 3);
    const h = 1 + Math.floor(random() * 4);
    const d = 1 + Math.floor(random() * 2);
    const colour = palette[Math.floor(random() * palette.length)]!;
    const geometry = slab([w, h, d], colour, {
      voxel: 0.25 + random() * 0.5,
      anchor: "center",
      grain: 0.16,
      seed: i + 3,
    });
    const item = new THREE.Mesh(geometry, voxMat("debris", { roughness: 0.9 }));
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const r = Math.pow(random(), 0.42) * spread;
    const rr = Math.sqrt(1 - u * u);
    item.position.set(Math.cos(theta) * rr * r, u * r * 0.55, Math.sin(theta) * rr * r);
    group.add(item);
    parts.push({
      object: item,
      axis: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
      rate: 0.04 + random() * 0.22,
      phase: random() * Math.PI * 2,
    });
  }
  return {
    group,
    tumble(time: number) {
      for (const part of parts) {
        part.object.quaternion.setFromAxisAngle(part.axis, part.phase + time * part.rate);
      }
    },
  };
}

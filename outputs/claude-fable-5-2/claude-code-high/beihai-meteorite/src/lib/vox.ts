import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";

/**
 * A paintable voxel grid. Sets are authored by filling and carving boxes in grid
 * coordinates, then merged into one face-culled geometry by the voxel kit.
 */
export type VoxColour = number | ((x: number, y: number, z: number) => number | null);

export class Vox {
  readonly data: Int32Array;

  constructor(readonly sx: number, readonly sy: number, readonly sz: number) {
    this.data = new Int32Array(sx * sy * sz).fill(-1);
  }

  private idx(x: number, y: number, z: number): number {
    return (y * this.sz + z) * this.sx + x;
  }

  inside(x: number, y: number, z: number): boolean {
    return x >= 0 && y >= 0 && z >= 0 && x < this.sx && y < this.sy && z < this.sz;
  }

  set(x: number, y: number, z: number, colour: number | null): this {
    x = Math.floor(x); y = Math.floor(y); z = Math.floor(z);
    if (this.inside(x, y, z)) this.data[this.idx(x, y, z)] = colour === null ? -1 : colour;
    return this;
  }

  get(x: number, y: number, z: number): number | null {
    if (!this.inside(x, y, z)) return null;
    const v = this.data[this.idx(x, y, z)]!;
    return v < 0 ? null : v;
  }

  /** Fill [x0,x1) × [y0,y1) × [z0,z1). A colour function may return null to skip a cell. */
  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, colour: VoxColour): this {
    const ax = Math.max(0, Math.floor(Math.min(x0, x1))), bx = Math.min(this.sx, Math.ceil(Math.max(x0, x1)));
    const ay = Math.max(0, Math.floor(Math.min(y0, y1))), by = Math.min(this.sy, Math.ceil(Math.max(y0, y1)));
    const az = Math.max(0, Math.floor(Math.min(z0, z1))), bz = Math.min(this.sz, Math.ceil(Math.max(z0, z1)));
    for (let y = ay; y < by; y++) {
      for (let z = az; z < bz; z++) {
        for (let x = ax; x < bx; x++) {
          const c = typeof colour === "function" ? colour(x, y, z) : colour;
          if (c !== null) this.data[this.idx(x, y, z)] = c;
        }
      }
    }
    return this;
  }

  carve(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): this {
    const ax = Math.max(0, Math.floor(Math.min(x0, x1))), bx = Math.min(this.sx, Math.ceil(Math.max(x0, x1)));
    const ay = Math.max(0, Math.floor(Math.min(y0, y1))), by = Math.min(this.sy, Math.ceil(Math.max(y0, y1)));
    const az = Math.max(0, Math.floor(Math.min(z0, z1))), bz = Math.min(this.sz, Math.ceil(Math.max(z0, z1)));
    for (let y = ay; y < by; y++) {
      for (let z = az; z < bz; z++) {
        for (let x = ax; x < bx; x++) this.data[this.idx(x, y, z)] = -1;
      }
    }
    return this;
  }

  /** Visit every cell; return a colour to fill, null to clear, undefined to leave untouched. */
  each(fn: (x: number, y: number, z: number, current: number | null) => number | null | undefined): this {
    for (let y = 0; y < this.sy; y++) {
      for (let z = 0; z < this.sz; z++) {
        for (let x = 0; x < this.sx; x++) {
          const i = this.idx(x, y, z);
          const cur = this.data[i]!;
          const r = fn(x, y, z, cur < 0 ? null : cur);
          if (r === undefined) continue;
          this.data[i] = r === null ? -1 : r;
        }
      }
    }
    return this;
  }

  geometry(voxel = 1, anchor: "min" | "center" = "min"): THREE.BufferGeometry {
    const { sx, sz, data } = this;
    return buildVoxelGeometry(
      {
        size: [this.sx, this.sy, this.sz],
        at: (x, y, z) => {
          const v = data[(y * sz + z) * sx + x]!;
          return v < 0 ? null : v;
        },
      },
      { voxel, anchor },
    );
  }

  mesh(
    voxel = 1,
    options: { anchor?: "min" | "center"; material?: THREE.Material; shadow?: boolean; receive?: boolean } = {},
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometry(voxel, options.anchor ?? "min"), options.material ?? voxelMaterial());
    mesh.castShadow = options.shadow ?? true;
    mesh.receiveShadow = options.receive ?? true;
    return mesh;
  }
}

/** One-off solid block as voxel geometry (a single cell scaled to size). */
export function block(
  w: number,
  h: number,
  d: number,
  colour: number,
  material?: THREE.Material,
): THREE.Mesh {
  const geometry = buildVoxelGeometry({ size: [1, 1, 1], at: () => colour }, { voxel: 1, anchor: "center" });
  geometry.scale(w, h, d);
  const mesh = new THREE.Mesh(geometry, material ?? voxelMaterial());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** An irregular voxel lump: the base shape for every meteorite in the film. */
export function lumpVox(
  rx: number,
  ry: number,
  rz: number,
  seed: number,
  colour: (x: number, y: number, z: number, edge: number) => number,
  rough = 0.35,
): Vox {
  const sx = Math.ceil(rx * 2) + 2, sy = Math.ceil(ry * 2) + 2, sz = Math.ceil(rz * 2) + 2;
  const v = new Vox(sx, sy, sz);
  const hash = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 3.17) * 43758.5453;
    return s - Math.floor(s);
  };
  v.each((x, y, z) => {
    const dx = (x + 0.5 - sx / 2) / rx, dy = (y + 0.5 - sy / 2) / ry, dz = (z + 0.5 - sz / 2) / rz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const bump =
      (hash(Math.floor(x / 2), Math.floor(y / 2), Math.floor(z / 2)) - 0.5) * rough +
      (hash(x, y, z) - 0.5) * rough * 0.4;
    if (d + bump > 1) return null;
    return colour(x, y, z, d);
  });
  return v;
}

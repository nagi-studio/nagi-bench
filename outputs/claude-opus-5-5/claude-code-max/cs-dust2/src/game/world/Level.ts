import { hash01 } from '../core/math';
import type { SiteId, SurfaceMaterial } from '../core/types';
import { Collider, CollisionWorld, MASK_ALL } from './Collision';
import type { BombsiteDef, BoxDef, DoorLeafDef, FloorDef, MapDef } from './MapData';
import { NavGrid } from './NavGrid';

export interface WallRect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  bottom: number;
  top: number;
  /** For window cells: the opening. */
  window?: { sill: number; top: number };
}

export const RASTER_RES = 0.5;
export const WORLD_BOTTOM = -4;

const BOX_MATERIAL: Record<BoxDef['kind'], SurfaceMaterial> = {
  crate: 'wood',
  crateBig: 'wood',
  container: 'metal',
  lintel: 'stone',
  ceiling: 'wood',
  beam: 'wood',
  barrel: 'metal',
  car: 'metal',
  pillar: 'stone',
};

/**
 * Compiled level: rasterises the designer floor plan, derives closed wall geometry by greedy
 * rectangle merging, creates every collider and the navigation grid. Pure data (no rendering),
 * so it also runs headless for simulation tests.
 */
export class Level {
  readonly collision = new CollisionWorld();
  readonly nav: NavGrid;
  readonly walls: WallRect[] = [];
  readonly cols: number;
  readonly rows: number;
  /** Designer floor height per raster cell, NaN where solid. */
  readonly floorHeight: Float32Array;
  readonly doorLeaves: DoorLeafDef[];

  constructor(readonly def: MapDef) {
    const b = def.bounds;
    this.cols = Math.round((b.x1 - b.x0) / RASTER_RES);
    this.rows = Math.round((b.z1 - b.z0) / RASTER_RES);
    this.floorHeight = new Float32Array(this.cols * this.rows).fill(NaN);
    this.doorLeaves = def.doors;

    this.rasterizeFloors(def.floors);
    this.buildWalls();
    this.buildColliders();
    this.collision.build();

    const seeds = [...def.spawns.T, ...def.spawns.CT].map(([x, z]) => ({ x, z }));
    this.nav = new NavGrid(b.x0, b.z0, RASTER_RES, this.cols, this.rows, this.floorHeight, this.collision, seeds);
  }

  // ------------------------------------------------------------------ build steps

  private rasterizeFloors(floors: FloorDef[]): void {
    const b = this.def.bounds;
    for (const f of floors) {
      const i0 = Math.max(0, Math.round((f.x0 - b.x0) / RASTER_RES));
      const i1 = Math.min(this.cols, Math.round((f.x1 - b.x0) / RASTER_RES));
      const j0 = Math.max(0, Math.round((f.z0 - b.z0) / RASTER_RES));
      const j1 = Math.min(this.rows, Math.round((f.z1 - b.z0) / RASTER_RES));
      for (let j = j0; j < j1; j++) {
        for (let i = i0; i < i1; i++) {
          const cx = b.x0 + (i + 0.5) * RASTER_RES;
          const cz = b.z0 + (j + 0.5) * RASTER_RES;
          const h = floorHeightAt(f, cx, cz);
          const idx = j * this.cols + i;
          const cur = this.floorHeight[idx];
          if (Number.isNaN(cur) || h > cur) this.floorHeight[idx] = h;
        }
      }
    }
  }

  private buildWalls(): void {
    const { cols, rows } = this;
    const b = this.def.bounds;
    // 0 = floor, 1 = wall, 2+ = window index + 2
    const type = new Int16Array(cols * rows);
    for (let i = 0; i < type.length; i++) type[i] = Number.isNaN(this.floorHeight[i]) ? 1 : 0;
    this.def.windows.forEach((w, wi) => {
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cx = b.x0 + (i + 0.5) * RASTER_RES;
          const cz = b.z0 + (j + 0.5) * RASTER_RES;
          if (cx > w.x0 && cx < w.x1 && cz > w.z0 && cz < w.z1 && type[j * cols + i] === 1) type[j * cols + i] = 2 + wi;
        }
      }
    });

    // Greedy rectangle merge per cell type.
    const used = new Uint8Array(cols * rows);
    const [hMin, hMax] = this.def.wallHeight;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const t = type[idx];
        if (t === 0 || used[idx]) continue;
        let w = 1;
        while (i + w < cols && type[j * cols + i + w] === t && !used[j * cols + i + w] && w < 48) w++;
        let h = 1;
        outer: while (j + h < rows && h < 48) {
          for (let k = 0; k < w; k++) {
            const n = (j + h) * cols + i + k;
            if (type[n] !== t || used[n]) break outer;
          }
          h++;
        }
        for (let dj = 0; dj < h; dj++) for (let k = 0; k < w; k++) used[(j + dj) * cols + i + k] = 1;
        const x0 = b.x0 + i * RASTER_RES;
        const z0 = b.z0 + j * RASTER_RES;
        const x1 = x0 + w * RASTER_RES;
        const z1 = z0 + h * RASTER_RES;
        // Quantised, position-hashed skyline so neighbouring blocks read as separate buildings.
        const hv = hash01(Math.floor((x0 + x1) / 8), Math.floor((z0 + z1) / 8));
        const top = Math.round((hMin + (hMax - hMin) * hv) / 0.4) * 0.4;
        const rect: WallRect = { x0, z0, x1, z1, bottom: WORLD_BOTTOM, top };
        if (t >= 2) {
          const win = this.def.windows[t - 2];
          rect.window = { sill: win.sill, top: win.top };
        }
        this.walls.push(rect);
      }
    }
  }

  private buildColliders(): void {
    const col = this.collision;
    // floors
    for (const f of this.def.floors) {
      if (f.y2 !== undefined && f.axis) {
        const rise: 1 | -1 = f.y2 > f.y ? 1 : -1;
        const yLow = Math.min(f.y, f.y2);
        const yHigh = Math.max(f.y, f.y2);
        col.add(new Collider(f.x0, WORLD_BOTTOM, f.z0, f.x1, yHigh, f.z1, MASK_ALL, 'sand', { axis: f.axis, rise, yLow, yHigh }));
      } else {
        col.addBox(f.x0, WORLD_BOTTOM, f.z0, f.x1, f.y, f.z1, MASK_ALL, f.tex === 'tiles' || f.tex === 'stone' ? 'stone' : 'sand');
      }
    }
    // walls & windows
    for (const w of this.walls) {
      if (w.window) {
        col.addBox(w.x0, w.bottom, w.z0, w.x1, w.window.sill, w.z1, MASK_ALL, 'stone');
        col.addBox(w.x0, w.window.top, w.z0, w.x1, w.top, w.z1, MASK_ALL, 'stone');
      } else {
        col.addBox(w.x0, w.bottom, w.z0, w.x1, w.top, w.z1, MASK_ALL, 'stone');
      }
    }
    // props
    for (const bx of this.def.boxes) {
      if (bx.solid === false) continue;
      col.addBox(bx.x0, bx.y0, bx.z0, bx.x1, bx.y1, bx.z1, MASK_ALL, BOX_MATERIAL[bx.kind]);
    }
    // door leaves: rotated slabs approximated by a chain of small boxes
    for (const d of this.def.doors) {
      for (const c of doorLeafBoxes(d)) {
        col.addBox(c[0], d.y0, c[1], c[2], d.y0 + d.height, c[3], MASK_ALL, 'wood');
      }
    }
  }

  // ------------------------------------------------------------------ queries

  /** Callout name of the zone containing (x,z). */
  zoneAt(x: number, z: number): string {
    for (const zn of this.def.zones) {
      if (x >= zn.x0 && x <= zn.x1 && z >= zn.z0 && z <= zn.z1) return zn.name;
    }
    return '';
  }

  bombsiteAt(x: number, z: number): BombsiteDef | null {
    for (const s of this.def.bombsites) {
      if (x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1) return s;
    }
    return null;
  }

  site(id: SiteId): BombsiteDef {
    return this.def.bombsites.find((s) => s.id === id)!;
  }

  point(name: string): { x: number; z: number } {
    const p = this.def.points[name];
    if (!p) throw new Error(`Unknown map point ${name}`);
    return { x: p[0], z: p[1] };
  }

  /** Ground height under (x,z) (walkable surfaces only). */
  groundAt(x: number, z: number, fromY = 50): number {
    const g = this.collision.groundHeight(x, z, fromY, 0.05);
    return Number.isFinite(g) ? g : this.nav.heightAt(x, z);
  }
}

export function floorHeightAt(f: FloorDef, x: number, z: number): number {
  if (f.y2 === undefined || !f.axis) return f.y;
  const t = f.axis === 'x' ? (x - f.x0) / (f.x1 - f.x0) : (z - f.z0) / (f.z1 - f.z0);
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return f.y + (f.y2 - f.y) * c;
}

/** Axis-aligned boxes approximating a rotated door leaf: [x0, z0, x1, z1][]. */
export function doorLeafBoxes(d: DoorLeafDef): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  const dx = Math.cos(d.angle);
  const dz = Math.sin(d.angle);
  const axisAligned = Math.abs(dx) < 1e-3 || Math.abs(dz) < 1e-3;
  const half = d.thickness / 2;
  if (axisAligned) {
    const ex = d.hx + dx * d.length;
    const ez = d.hz + dz * d.length;
    out.push([Math.min(d.hx, ex) - half, Math.min(d.hz, ez) - half, Math.max(d.hx, ex) + half, Math.max(d.hz, ez) + half]);
    return out;
  }
  const seg = 0.25;
  const n = Math.ceil(d.length / seg);
  for (let i = 0; i < n; i++) {
    const a = (i * d.length) / n;
    const b2 = ((i + 1) * d.length) / n;
    const ax = d.hx + dx * a;
    const az = d.hz + dz * a;
    const bx = d.hx + dx * b2;
    const bz = d.hz + dz * b2;
    out.push([Math.min(ax, bx) - half, Math.min(az, bz) - half, Math.max(ax, bx) + half, Math.max(az, bz) + half]);
  }
  return out;
}

/** Dust2-style blockout: areas, collision, line-of-sight, navigation grid. */

export interface Wall { x: number; z: number; w: number; d: number; h?: number }

export const AREAS = {
  tspawn: { x: 22, z: 22, r: 12, name: 'T 出生点' },
  ctspawn: { x: 98, z: 98, r: 12, name: 'CT 出生点' },
  along: { x: 62, z: 14, r: 12, name: 'A 大' },
  asite: { x: 98, z: 26, r: 12, name: 'A 点' },
  mid: { x: 60, z: 56, r: 10, name: '中门' },
  cat: { x: 78, z: 44, r: 9, name: '猫道' },
  btun: { x: 18, z: 62, r: 10, name: 'B 洞' },
  bsite: { x: 24, z: 98, r: 12, name: 'B 点' }
} as const;

// outer bounds + interior blocks forming the eight connected areas
export const WALLS: Wall[] = [
  // world boundary
  { x: 60, z: -2, w: 130, d: 4 },
  { x: 60, z: 122, w: 130, d: 4 },
  { x: -2, z: 60, w: 4, d: 130 },
  { x: 122, z: 60, w: 4, d: 130 },
  // T spawn room
  { x: 22, z: 8, w: 30, d: 3 }, { x: 6, z: 22, w: 3, d: 26 },
  // Long A corridor (north strip) walls
  { x: 62, z: 5, w: 76, d: 3 },
  { x: 62, z: 23, w: 30, d: 3 },       // south wall of long A (west of A site)
  // A site walls
  { x: 112, z: 14, w: 3, d: 26 },
  { x: 98, z: 36, w: 26, d: 3 },
  { x: 84, z: 22, w: 3, d: 14 },
  // A boxes (cover)
  { x: 92, z: 20, w: 5, d: 5 },
  { x: 104, z: 30, w: 5, d: 5 },
  // Mid corridor
  { x: 52, z: 56, w: 3, d: 106 },
  { x: 68, z: 30, w: 3, d: 46 },       // upper mid east wall (doors live in the gap z 52..60)
  { x: 68, z: 88, w: 3, d: 62 },
  // Mid doors (two leaves, passable, at x 52..68, z 52..60)
  { x: 55, z: 52, w: 5, d: 2 },
  { x: 65, z: 60, w: 5, d: 2 },
  // Catwalk (mid -> A)
  { x: 78, z: 34, w: 22, d: 3 },
  { x: 88, z: 50, w: 22, d: 3 },
  // B tunnels (T -> B along the west)
  { x: 10, z: 46, w: 3, d: 34 },
  { x: 30, z: 46, w: 3, d: 22 },
  { x: 30, z: 80, w: 3, d: 22 },
  // B site
  { x: 8, z: 112, w: 28, d: 3 },
  { x: 36, z: 96, w: 3, d: 28 },
  // B site cover
  { x: 18, z: 92, w: 5, d: 5 },
  { x: 30, z: 106, w: 5, d: 5 },
  // connective blocks (CT side inner)
  { x: 90, z: 70, w: 22, d: 3 },
  { x: 110, z: 80, w: 3, d: 22 },
  // crates along long A
  { x: 74, z: 12, w: 6, d: 5 },
  { x: 86, z: 16, w: 5, d: 5 },
  // mid crates
  { x: 58, z: 74, w: 5, d: 5 },
  { x: 62, z: 40, w: 5, d: 5 }
];

export const DOOR_GAPS: Array<{ x: number; z: number; w: number; d: number }> = [
  { x: 60, z: 56, w: 16, d: 8 }
];

function pointInWall(x: number, z: number): boolean {
  for (const w of WALLS) {
    if (x > w.x - w.w / 2 && x < w.x + w.w / 2 && z > w.z - w.d / 2 && z < w.z + w.d / 2) return true;
  }
  return false;
}

export function resolveCollision(_x: number, z: number, r: number, nx: number, nz: number): { x: number; z: number } {
  // axis-separated slide against every wall AABB
  let px = nx, pz = z;
  for (const w of WALLS) {
    const minX = w.x - w.w / 2 - r, maxX = w.x + w.w / 2 + r;
    const minZ = w.z - w.d / 2 - r, maxZ = w.z + w.d / 2 + r;
    if (px > minX && px < maxX && pz > minZ && pz < maxZ) {
      const dx = px < w.x ? px - minX : maxX - px;
      const dz = pz < w.z ? pz - minZ : maxZ - pz;
      if (dx < dz) px = px < w.x ? minX : maxX;
    }
  }
  pz = nz;
  for (const w of WALLS) {
    const minX = w.x - w.w / 2 - r, maxX = w.x + w.w / 2 + r;
    const minZ = w.z - w.d / 2 - r, maxZ = w.z + w.d / 2 + r;
    if (px > minX && px < maxX && pz > minZ && pz < maxZ) {
      const dx = px < w.x ? px - minX : maxX - px;
      const dz = pz < w.z ? pz - minZ : maxZ - pz;
      if (dz <= dx) pz = pz < w.z ? minZ : maxZ;
    }
  }
  return { x: px, z: pz };
}

/** sampled line-of-sight: true when the segment is not blocked by walls */
export function los(x0: number, z0: number, x1: number, z1: number): boolean {
  const dist = Math.hypot(x1 - x0, z1 - z0);
  const steps = Math.ceil(dist / 0.7);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const z = z0 + (z1 - z0) * t;
    if (pointInWall(x, z)) return false;
    // mid door leaves block sight but not movement when "closed" — always passable here
  }
  return true;
}

/* ---------------- navigation grid (A*) ---------------- */
export const NAV = {
  cell: 2,
  w: 62,
  h: 62,
  blocked: new Uint8Array(0)
};
NAV.blocked = new Uint8Array(NAV.w * NAV.h);
for (let gz = 0; gz < NAV.h; gz++) {
  for (let gx = 0; gx < NAV.w; gx++) {
    const x = gx * NAV.cell + 1;
    const z = gz * NAV.cell + 1;
    if (pointInWall(x, z)) NAV.blocked[gz * NAV.w + gx] = 1;
  }
}

export function worldToGrid(x: number, z: number): { gx: number; gz: number } {
  return {
    gx: Math.max(0, Math.min(NAV.w - 1, Math.floor(x / NAV.cell))),
    gz: Math.max(0, Math.min(NAV.h - 1, Math.floor(z / NAV.cell)))
  };
}
export function gridToWorld(gx: number, gz: number): { x: number; z: number } {
  return { x: gx * NAV.cell + 1, z: gz * NAV.cell + 1 };
}

export function findPath(x0: number, z0: number, x1: number, z1: number): Array<{ x: number; z: number }> {
  const a = worldToGrid(x0, z0);
  const b = worldToGrid(x1, z1);
  const start = a.gz * NAV.w + a.gx;
  const goal = b.gz * NAV.w + b.gx;
  if (start === goal) return [{ x: x1, z: z1 }];
  const open = [start];
  const g = new Float32Array(NAV.w * NAV.h).fill(Infinity);
  const from = new Int32Array(NAV.w * NAV.h).fill(-1);
  const seen = new Uint8Array(NAV.w * NAV.h);
  g[start] = 0;
  const h = (i: number): number => {
    const gx = i % NAV.w, gz = (i / NAV.w) | 0;
    return Math.hypot(gx - b.gx, gz - b.gz);
  };
  let guard = 0;
  while (open.length && guard++ < 6000) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (g[open[i]] + h(open[i]) < g[open[bi]] + h(open[bi])) bi = i;
    const cur = open.splice(bi, 1)[0];
    if (cur === goal) break;
    if (seen[cur]) continue;
    seen[cur] = 1;
    const cx = cur % NAV.w, cz = (cur / NAV.w) | 0;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
      const nxi = cx + dx, nzi = cz + dz;
      if (nxi < 0 || nzi < 0 || nxi >= NAV.w || nzi >= NAV.h) continue;
      const ni = nzi * NAV.w + nxi;
      if (NAV.blocked[ni] || seen[ni]) continue;
      const cost = g[cur] + (dx !== 0 && dz !== 0 ? 1.41 : 1);
      if (cost < g[ni]) {
        g[ni] = cost;
        from[ni] = cur;
        open.push(ni);
      }
    }
  }
  if (from[goal] === -1 && goal !== start) return [{ x: x1, z: z1 }];
  const out: Array<{ x: number; z: number }> = [];
  let cur = goal;
  while (cur !== -1 && cur !== start && out.length < 220) {
    const gx = cur % NAV.w, gz = (cur / NAV.w) | 0;
    out.push(gridToWorld(gx, gz));
    cur = from[cur];
  }
  out.reverse();
  out.push({ x: x1, z: z1 });
  return out;
}

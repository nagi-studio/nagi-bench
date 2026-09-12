import * as THREE from 'three';
import { Team, V } from '../types';

export const CELL = 2;
export const WALL = 0;
export const FLOOR = 1;
export const CRATE = 2;

export interface Rect {
  name: string;
  xmin: number;
  xmax: number;
  zmin: number;
  zmax: number;
}

// Walkable rectangles that together form the connected Dust2 topology.
// Coord system: +X east, +Z south. T spawn south, CT spawn north.
export const WALKABLE: Rect[] = [
  { name: 'tSpawn', xmin: -14, xmax: 14, zmin: 40, zmax: 54 },
  { name: 'tExitWest', xmin: -34, xmax: -14, zmin: 42, zmax: 52 },
  { name: 'long', xmin: -40, xmax: -26, zmin: -34, zmax: 52 },
  { name: 'aSite', xmin: -44, xmax: -14, zmin: -34, zmax: -14 },
  { name: 'catwalk', xmin: -20, xmax: 4, zmin: -16, zmax: 6 },
  { name: 'mid', xmin: 2, xmax: 18, zmin: -22, zmax: 42 },
  { name: 'midCT', xmin: 2, xmax: 18, zmin: -40, zmax: -22 },
  { name: 'ctSpawn', xmin: -18, xmax: 20, zmin: -54, zmax: -40 },
  { name: 'ctToA', xmin: -22, xmax: -8, zmin: -40, zmax: -30 },
  { name: 'tExitEast', xmin: 14, xmax: 40, zmin: 42, zmax: 52 },
  { name: 'bTunnel', xmin: 26, xmax: 44, zmin: -8, zmax: 52 },
  { name: 'bSite', xmin: 20, xmax: 46, zmin: -34, zmax: -8 },
  { name: 'ctToB', xmin: 14, xmax: 28, zmin: -40, zmax: -30 },
];

// Crates (cover) — world-space rectangles, marked as blockers.
const CRATES: Rect[] = [
  { name: 'aBox1', xmin: -34, xmax: -28, zmin: -26, zmax: -20 },
  { name: 'aBox2', xmin: -26, xmax: -22, zmin: -30, zmax: -26 },
  { name: 'aBox3', xmin: -40, xmax: -36, zmin: -22, zmax: -18 },
  { name: 'bBox1', xmin: 30, xmax: 36, zmin: -24, zmax: -18 },
  { name: 'bBox2', xmin: 24, xmax: 28, zmin: -30, zmax: -26 },
  { name: 'bBox3', xmin: 38, xmax: 42, zmin: -16, zmax: -12 },
  { name: 'longBox', xmin: -38, xmax: -34, zmin: 8, zmax: 12 },
  { name: 'midBox', xmin: 4, xmax: 8, zmin: 4, zmax: 8 },
  { name: 'catBox', xmin: -12, xmax: -8, zmin: -6, zmax: -2 },
];

export interface NamedPoint {
  name: string;
  pos: THREE.Vector3;
}

export class GameMap {
  cell = CELL;
  cols: number;
  rows: number;
  originX = -56;
  originZ = -58;
  grid: Uint8Array;
  wallHeight = 6;

  // key locations
  aSite = V(-24, 0, -22);
  bSite = V(30, 0, -14);
  siteRadius = 12;
  midDoors = V(10, 0, 10);

  constructor() {
    this.cols = Math.ceil((56 - this.originX) / CELL);
    this.rows = Math.ceil((58 - this.originZ) / CELL);
    this.grid = new Uint8Array(this.cols * this.rows); // 0 = wall by default
    for (const r of WALKABLE) this.fillRect(r, FLOOR);
    for (const c of CRATES) this.fillRect(c, CRATE);
  }

  private fillRect(r: Rect, val: number) {
    const c0 = this.toCol(r.xmin);
    const c1 = this.toCol(r.xmax - 0.001);
    const r0 = this.toRow(r.zmin);
    const r1 = this.toRow(r.zmax - 0.001);
    for (let cz = r0; cz <= r1; cz++)
      for (let cx = c0; cx <= c1; cx++) {
        if (cx < 0 || cz < 0 || cx >= this.cols || cz >= this.rows) continue;
        this.grid[cz * this.cols + cx] = val;
      }
  }

  toCol(x: number) {
    return Math.floor((x - this.originX) / CELL);
  }
  toRow(z: number) {
    return Math.floor((z - this.originZ) / CELL);
  }
  cellCenterX(cx: number) {
    return this.originX + cx * CELL + CELL / 2;
  }
  cellCenterZ(cz: number) {
    return this.originZ + cz * CELL + CELL / 2;
  }
  at(cx: number, cz: number) {
    if (cx < 0 || cz < 0 || cx >= this.cols || cz >= this.rows) return WALL;
    return this.grid[cz * this.cols + cx];
  }
  isWalkable(cx: number, cz: number) {
    return this.at(cx, cz) === FLOOR;
  }
  isBlocked(cx: number, cz: number) {
    return this.at(cx, cz) !== FLOOR;
  }

  isFloorWorld(x: number, z: number) {
    return this.isWalkable(this.toCol(x), this.toRow(z));
  }

  /** Resolve a circle (player) against blocked cells; returns adjusted x,z. */
  resolveCircle(x: number, z: number, radius: number): [number, number] {
    for (let iter = 0; iter < 3; iter++) {
      const c0 = this.toCol(x - radius);
      const c1 = this.toCol(x + radius);
      const r0 = this.toRow(z - radius);
      const r1 = this.toRow(z + radius);
      for (let cz = r0; cz <= r1; cz++) {
        for (let cx = c0; cx <= c1; cx++) {
          if (!this.isBlocked(cx, cz)) continue;
          const minX = this.originX + cx * CELL;
          const maxX = minX + CELL;
          const minZ = this.originZ + cz * CELL;
          const maxZ = minZ + CELL;
          const nearX = Math.max(minX, Math.min(x, maxX));
          const nearZ = Math.max(minZ, Math.min(z, maxZ));
          const dx = x - nearX;
          const dz = z - nearZ;
          const d2 = dx * dx + dz * dz;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 0.0001;
            const push = radius - d;
            if (d2 > 0.00001) {
              x += (dx / d) * push;
              z += (dz / d) * push;
            } else {
              // center inside cell: push along smallest axis
              const overlaps = [
                { a: 'x', v: x - minX, s: -1 },
                { a: 'x', v: maxX - x, s: 1 },
                { a: 'z', v: z - minZ, s: -1 },
                { a: 'z', v: maxZ - z, s: 1 },
              ].sort((p, q) => p.v - q.v)[0];
              if (overlaps.a === 'x') x += overlaps.s * (radius + overlaps.v);
              else z += overlaps.s * (radius + overlaps.v);
            }
          }
        }
      }
    }
    return [x, z];
  }

  /** 2D line-of-sight via grid DDA. Returns true if unobstructed. */
  lineOfSight(ax: number, az: number, bx: number, bz: number): boolean {
    let cx = this.toCol(ax);
    let cz = this.toRow(az);
    const tx = this.toCol(bx);
    const tz = this.toRow(bz);
    const dx = bx - ax;
    const dz = bz - az;
    const stepX = Math.sign(dx);
    const stepZ = Math.sign(dz);
    const invDx = dx !== 0 ? 1 / Math.abs(dx) : Infinity;
    const invDz = dz !== 0 ? 1 / Math.abs(dz) : Infinity;
    // distance to first boundary
    const nextX =
      this.originX + (cx + (stepX > 0 ? 1 : 0)) * CELL;
    const nextZ =
      this.originZ + (cz + (stepZ > 0 ? 1 : 0)) * CELL;
    let tMaxX = dx !== 0 ? (nextX - ax) / dx : Infinity;
    let tMaxZ = dz !== 0 ? (nextZ - az) / dz : Infinity;
    const tDeltaX = CELL * invDx;
    const tDeltaZ = CELL * invDz;
    let guard = 0;
    while (guard++ < 400) {
      if (this.isBlocked(cx, cz)) return false;
      if (cx === tx && cz === tz) return true;
      if (tMaxX < tMaxZ) {
        tMaxX += tDeltaX;
        cx += stepX;
      } else {
        tMaxZ += tDeltaZ;
        cz += stepZ;
      }
    }
    return true;
  }

  randomFloorInRect(name: string): THREE.Vector3 {
    const r = WALKABLE.find((w) => w.name === name)!;
    for (let i = 0; i < 60; i++) {
      const x = r.xmin + Math.random() * (r.xmax - r.xmin);
      const z = r.zmin + Math.random() * (r.zmax - r.zmin);
      if (this.isFloorWorld(x, z)) return V(x, 0, z);
    }
    return V((r.xmin + r.xmax) / 2, 0, (r.zmin + r.zmax) / 2);
  }

  spawnPoints(team: Team): THREE.Vector3[] {
    const src = team === 'T' ? 'tSpawn' : 'ctSpawn';
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 5; i++) pts.push(this.randomFloorInRect(src));
    return pts;
  }

  /** All floor cell centers used for AI patrol targets. */
  patrolTargets(): THREE.Vector3[] {
    const names = [
      'aSite',
      'bSite',
      'mid',
      'long',
      'catwalk',
      'bTunnel',
      'midCT',
      'ctSpawn',
      'tSpawn',
    ];
    return names.map((n) => this.randomFloorInRect(n));
  }

  siteContains(site: Team | 'A' | 'B', x: number, z: number): boolean {
    const c = site === 'A' ? this.aSite : this.bSite;
    const dx = x - c.x;
    const dz = z - c.z;
    return dx * dx + dz * dz <= this.siteRadius * this.siteRadius;
  }

  nearestSite(x: number, z: number): 'A' | 'B' {
    const da =
      (x - this.aSite.x) ** 2 + (z - this.aSite.z) ** 2;
    const db =
      (x - this.bSite.x) ** 2 + (z - this.bSite.z) ** 2;
    return da < db ? 'A' : 'B';
  }

  build(scene: THREE.Scene) {
    // ground
    const floorGeo = new THREE.PlaneGeometry(160, 170);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xc2a878,
      roughness: 0.95,
      metalness: 0,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -2);
    floor.receiveShadow = true;
    scene.add(floor);

    // collect boundary wall cells (walls adjacent to floor/crate)
    const wallCells: [number, number][] = [];
    for (let cz = 0; cz < this.rows; cz++) {
      for (let cx = 0; cx < this.cols; cx++) {
        if (this.at(cx, cz) !== WALL) continue;
        const nb =
          this.at(cx + 1, cz) !== WALL ||
          this.at(cx - 1, cz) !== WALL ||
          this.at(cx, cz + 1) !== WALL ||
          this.at(cx, cz - 1) !== WALL;
        if (nb) wallCells.push([cx, cz]);
      }
    }
    const wallGeo = new THREE.BoxGeometry(CELL, this.wallHeight, CELL);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xb08d57,
      roughness: 0.9,
    });
    const wallMesh = new THREE.InstancedMesh(
      wallGeo,
      wallMat,
      wallCells.length
    );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    const m = new THREE.Matrix4();
    wallCells.forEach(([cx, cz], i) => {
      m.makeTranslation(
        this.cellCenterX(cx),
        this.wallHeight / 2,
        this.cellCenterZ(cz)
      );
      wallMesh.setMatrixAt(i, m);
    });
    wallMesh.instanceMatrix.needsUpdate = true;
    scene.add(wallMesh);

    // crates
    const crateCells: [number, number][] = [];
    for (let cz = 0; cz < this.rows; cz++)
      for (let cx = 0; cx < this.cols; cx++)
        if (this.at(cx, cz) === CRATE) crateCells.push([cx, cz]);
    const crateH = 2.6;
    const crateGeo = new THREE.BoxGeometry(CELL, crateH, CELL);
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x8a5a2b,
      roughness: 0.8,
    });
    const crateMesh = new THREE.InstancedMesh(
      crateGeo,
      crateMat,
      crateCells.length
    );
    crateMesh.castShadow = true;
    crateCells.forEach(([cx, cz], i) => {
      m.makeTranslation(
        this.cellCenterX(cx),
        crateH / 2,
        this.cellCenterZ(cz)
      );
      crateMesh.setMatrixAt(i, m);
    });
    crateMesh.instanceMatrix.needsUpdate = true;
    scene.add(crateMesh);

    // site markers (colored floor discs)
    for (const [c, color] of [
      [this.aSite, 0xff5533],
      [this.bSite, 0x33aaff],
    ] as [THREE.Vector3, number][]) {
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(this.siteRadius, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.18,
        })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(c.x, 0.05, c.z);
      scene.add(disc);
    }

    // passable mid double-doors (visual only — no collision)
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x9a7b45,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    for (const [dx, ang] of [
      [-3.6, 0.5],
      [3.6, -0.5],
    ] as [number, number][]) {
      const door = new THREE.Mesh(new THREE.BoxGeometry(6, 3.4, 0.25), doorMat);
      door.position.set(10 + dx, 1.7, this.midDoors.z);
      door.rotation.y = ang;
      door.castShadow = true;
      scene.add(door);
    }
  }
}

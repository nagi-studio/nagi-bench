import * as THREE from 'three';
import { GameMap } from '../map/dust2';

interface Node {
  cx: number;
  cz: number;
  g: number;
  f: number;
  parent: Node | null;
}

/** A* pathfinding on the map grid, with line-of-sight smoothing. */
export class Navigation {
  constructor(private map: GameMap) {}

  findPath(
    sx: number,
    sz: number,
    tx: number,
    tz: number
  ): THREE.Vector3[] {
    const map = this.map;
    let scx = map.toCol(sx);
    let scz = map.toRow(sz);
    let tcx = map.toCol(tx);
    let tcz = map.toRow(tz);
    if (!map.isWalkable(scx, scz)) {
      const n = this.nearestWalkable(scx, scz);
      if (n) [scx, scz] = n;
    }
    if (!map.isWalkable(tcx, tcz)) {
      const n = this.nearestWalkable(tcx, tcz);
      if (n) [tcx, tcz] = n;
    }
    const open: Node[] = [];
    const startKey = scz * map.cols + scx;
    const gScore = new Map<number, number>();
    const closed = new Set<number>();
    const h = (cx: number, cz: number) =>
      Math.abs(cx - tcx) + Math.abs(cz - tcz);
    const start: Node = {
      cx: scx,
      cz: scz,
      g: 0,
      f: h(scx, scz),
      parent: null,
    };
    open.push(start);
    gScore.set(startKey, 0);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    let guard = 0;
    while (open.length && guard++ < 8000) {
      // pop lowest f
      let bi = 0;
      for (let i = 1; i < open.length; i++)
        if (open[i].f < open[bi].f) bi = i;
      const cur = open.splice(bi, 1)[0];
      const curKey = cur.cz * map.cols + cur.cx;
      if (cur.cx === tcx && cur.cz === tcz) {
        return this.reconstruct(cur);
      }
      closed.add(curKey);
      for (const [dx, dz] of dirs) {
        const nx = cur.cx + dx;
        const nz = cur.cz + dz;
        if (!map.isWalkable(nx, nz)) continue;
        if (dx !== 0 && dz !== 0) {
          // prevent cutting corners
          if (!map.isWalkable(cur.cx + dx, cur.cz) || !map.isWalkable(cur.cx, cur.cz + dz))
            continue;
        }
        const nKey = nz * map.cols + nx;
        if (closed.has(nKey)) continue;
        const cost = dx !== 0 && dz !== 0 ? 1.414 : 1;
        const ng = cur.g + cost;
        if (gScore.has(nKey) && ng >= gScore.get(nKey)!) continue;
        gScore.set(nKey, ng);
        open.push({
          cx: nx,
          cz: nz,
          g: ng,
          f: ng + h(nx, nz),
          parent: cur,
        });
      }
    }
    return [];
  }

  private reconstruct(end: Node): THREE.Vector3[] {
    const cells: [number, number][] = [];
    let n: Node | null = end;
    while (n) {
      cells.unshift([n.cx, n.cz]);
      n = n.parent;
    }
    const pts = cells.map(([cx, cz]) =>
      new THREE.Vector3(
        this.map.cellCenterX(cx),
        0,
        this.map.cellCenterZ(cz)
      )
    );
    return this.smooth(pts);
  }

  /** String-pulling: drop waypoints that have direct line of sight. */
  private smooth(pts: THREE.Vector3[]): THREE.Vector3[] {
    if (pts.length <= 2) return pts;
    const out: THREE.Vector3[] = [pts[0]];
    let anchor = 0;
    for (let i = 2; i < pts.length; i++) {
      if (
        !this.map.lineOfSight(
          pts[anchor].x,
          pts[anchor].z,
          pts[i].x,
          pts[i].z
        )
      ) {
        out.push(pts[i - 1]);
        anchor = i - 1;
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  private nearestWalkable(cx: number, cz: number): [number, number] | null {
    for (let r = 1; r < 12; r++) {
      for (let dz = -r; dz <= r; dz++)
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          if (this.map.isWalkable(cx + dx, cz + dz))
            return [cx + dx, cz + dz];
        }
    }
    return null;
  }
}

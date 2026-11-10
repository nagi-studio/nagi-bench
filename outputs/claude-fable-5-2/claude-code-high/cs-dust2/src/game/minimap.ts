// Radar painter. The static top-down layout is rasterised once from the map grid; actors and
// the bomb are drawn on top every few frames.

import type { Actor, Team } from '../sim/actor';
import { CELL, MapData } from '../sim/map';
import type { Simulation } from '../sim/sim';

const TEAM_COLOR: Record<Team, string> = { atk: '#ff9a3d', def: '#5cb8ff' };

export class MinimapPainter {
  private base: HTMLCanvasElement;
  private scale = 1;
  private w = 0;
  private h = 0;

  constructor(private map: MapData) {
    this.base = document.createElement('canvas');
  }

  /** (Re)builds the static layer for the given backing-store size. */
  private buildBase(w: number, h: number): void {
    const map = this.map;
    this.w = w;
    this.h = h;
    this.base.width = w;
    this.base.height = h;
    const ctx = this.base.getContext('2d');
    if (!ctx) return;
    const s = Math.min(w / (map.maxX - map.minX), h / (map.maxZ - map.minZ));
    this.scale = s;
    ctx.clearRect(0, 0, w, h);
    const colors: Record<number, string> = {
      [CELL.Asphalt]: '#59626b',
      [CELL.Interior]: '#444c56',
      [CELL.Concrete]: '#6a747d',
      [CELL.Dock]: '#667078',
      [CELL.Gravel]: '#5f6660',
      [CELL.Water]: 'rgba(46,111,138,0.55)',
    };
    for (let r = 0; r < map.rows; r++) {
      for (let c = 0; c < map.cols; c++) {
        const k = map.cells[r * map.cols + c];
        if (k === CELL.Solid) continue;
        ctx.fillStyle = colors[k] ?? '#59626b';
        ctx.fillRect(Math.floor(c * s), Math.floor(r * s), Math.ceil(s), Math.ceil(s));
      }
    }
    // outline: draw wall edges where walkable meets solid
    ctx.fillStyle = 'rgba(210,225,235,0.55)';
    const solid = (c: number, r: number) => c < 0 || r < 0 || c >= map.cols || r >= map.rows || map.cells[r * map.cols + c] === CELL.Solid;
    const lw = Math.max(1, s * 0.3);
    for (let r = 0; r < map.rows; r++) {
      for (let c = 0; c < map.cols; c++) {
        if (solid(c, r) || map.cells[r * map.cols + c] === CELL.Water) continue;
        if (solid(c - 1, r)) ctx.fillRect(c * s - lw / 2, r * s, lw, s);
        if (solid(c + 1, r)) ctx.fillRect((c + 1) * s - lw / 2, r * s, lw, s);
        if (solid(c, r - 1)) ctx.fillRect(c * s, r * s - lw / 2, s, lw);
        if (solid(c, r + 1)) ctx.fillRect(c * s, (r + 1) * s - lw / 2, s, lw);
      }
    }
    // props and raised structures
    for (const b of map.boxes) {
      if (b.mat.startsWith('bld') || b.mat === 'roof' || b.mat === 'clip' || b.mat === 'parapet') continue;
      const hgt = b.max.y - b.min.y;
      if (b.min.y > 2.5) continue;
      const raised = b.mat === 'platform' || b.mat === 'stairs';
      if (!raised && hgt < 0.9) continue;
      ctx.fillStyle = raised ? 'rgba(150,170,185,0.5)' : 'rgba(25,30,36,0.75)';
      ctx.fillRect((b.min.x - map.minX) * s, (b.min.z - map.minZ) * s, Math.max(1, (b.max.x - b.min.x) * s), Math.max(1, (b.max.z - b.min.z) * s));
    }
    // bomb sites
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const id of ['A', 'B'] as const) {
      const site = map.tac.sites[id];
      const r = site.rect;
      ctx.fillStyle = 'rgba(240,200,60,0.13)';
      ctx.strokeStyle = 'rgba(240,200,60,0.6)';
      ctx.lineWidth = Math.max(1, s * 0.25);
      const x = (r.x0 - map.minX) * s;
      const y = (r.z0 - map.minZ) * s;
      ctx.fillRect(x, y, (r.x1 - r.x0) * s, (r.z1 - r.z0) * s);
      ctx.strokeRect(x, y, (r.x1 - r.x0) * s, (r.z1 - r.z0) * s);
      ctx.fillStyle = 'rgba(255,220,90,0.9)';
      ctx.font = `bold ${Math.round(s * 9)}px Arial, sans-serif`;
      ctx.fillText(id, (site.center[0] - map.minX) * s, (site.center[1] - map.minZ) * s);
    }
  }

  draw(canvas: HTMLCanvasElement, sim: Simulation, viewer: Actor | null, team: Team, now: number): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(canvas.clientWidth * dpr);
    const ch = Math.round(canvas.clientHeight * dpr);
    if (cw === 0 || ch === 0) return;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    if (this.w !== cw || this.h !== ch) this.buildBase(cw, ch);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const map = this.map;
    const s = this.scale;
    const X = (x: number) => (x - map.minX) * s;
    const Z = (z: number) => (z - map.minZ) * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(this.base, 0, 0);
    const R = Math.max(3, s * 1.5);

    // --- bomb
    const bomb = sim.round.bomb;
    const blink = Math.floor(now * 3) % 2 === 0;
    const showBomb = bomb.status === 'planted' || bomb.status === 'defused' || (bomb.status === 'dropped' && team === 'atk');
    if (showBomb) {
      const bx = X(bomb.pos.x);
      const bz = Z(bomb.pos.z);
      ctx.fillStyle = bomb.status === 'planted' ? (blink ? '#ff3b30' : '#7a1a15') : bomb.status === 'defused' ? '#5cff8a' : '#ffb020';
      ctx.fillRect(bx - R * 0.9, bz - R * 0.9, R * 1.8, R * 1.8);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1, s * 0.3);
      ctx.strokeRect(bx - R * 0.9, bz - R * 0.9, R * 1.8, R * 1.8);
      if (bomb.status === 'planted') {
        const pulse = (now * 1.2) % 1;
        ctx.strokeStyle = `rgba(255,60,48,${1 - pulse})`;
        ctx.beginPath();
        ctx.arc(bx, bz, R * (1 + pulse * 4), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // --- actors
    for (const a of sim.actors) {
      const mate = a.team === team;
      const x = X(a.pos.x);
      const z = Z(a.pos.z);
      if (!a.alive) {
        if (!mate) continue;
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = Math.max(1, s * 0.35);
        ctx.beginPath();
        ctx.moveTo(x - R * 0.7, z - R * 0.7);
        ctx.lineTo(x + R * 0.7, z + R * 0.7);
        ctx.moveTo(x + R * 0.7, z - R * 0.7);
        ctx.lineTo(x - R * 0.7, z + R * 0.7);
        ctx.stroke();
        continue;
      }
      if (!mate && a.spottedUntil < now) continue;
      const self = viewer !== null && a.id === viewer.id;
      // forward on the map: (-sin yaw, -cos yaw)
      const fx = -Math.sin(a.yaw);
      const fz = -Math.cos(a.yaw);
      if (self) {
        // view cone
        const coneLen = R * 9;
        const half = 0.6;
        const ang = Math.atan2(fz, fx);
        const grad = ctx.createRadialGradient(x, z, 0, x, z, coneLen);
        grad.addColorStop(0, 'rgba(255,255,255,0.32)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, z);
        ctx.arc(x, z, coneLen, ang - half, ang + half);
        ctx.closePath();
        ctx.fill();
        // arrow
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0b0f14';
        ctx.lineWidth = Math.max(1, s * 0.3);
        ctx.beginPath();
        ctx.moveTo(x + fx * R * 1.7, z + fz * R * 1.7);
        ctx.lineTo(x - fx * R - fz * R, z - fz * R + fx * R);
        ctx.lineTo(x - fx * R * 0.4, z - fz * R * 0.4);
        ctx.lineTo(x - fx * R + fz * R, z - fz * R - fx * R);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = mate ? TEAM_COLOR[a.team] : '#ff4b3e';
        ctx.strokeStyle = '#0b0f14';
        ctx.lineWidth = Math.max(1, s * 0.3);
        ctx.beginPath();
        ctx.arc(x, z, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = mate ? '#ffffff' : '#ffd0cc';
        ctx.beginPath();
        ctx.moveTo(x, z);
        ctx.lineTo(x + fx * R * 1.9, z + fz * R * 1.9);
        ctx.stroke();
      }
      // bomb carrier marker (visible to attackers, or when the carrier is spotted)
      if (a.hasBomb) {
        ctx.strokeStyle = '#ffb020';
        ctx.lineWidth = Math.max(1.5, s * 0.45);
        ctx.beginPath();
        ctx.arc(x, z, R * 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}

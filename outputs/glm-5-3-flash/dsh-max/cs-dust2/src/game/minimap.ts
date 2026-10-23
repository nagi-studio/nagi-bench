/**
 * minimap.ts — 2D radar drawn from the world grid: static Dust2 outline +
 * live dots for self / teammates / spotted enemies / the C4.
 */

import { World } from './world';
import { SITE_A, SITE_B } from './mapdata';
import type { Game } from './engine';

export class MinimapRenderer {
  private ctx: CanvasRenderingContext2D;
  private base: HTMLCanvasElement;
  private scale: number;
  private world: World;
  private frame = 0;

  constructor(private canvas: HTMLCanvasElement, world: World) {
    this.world = world;
    this.ctx = canvas.getContext('2d')!;
    const w = world.gx * 1.5, h = world.gz * 1.5;
    this.scale = canvas.width / Math.max(w, h * (canvas.width / canvas.height));
    // build static base image
    this.base = document.createElement('canvas');
    this.base.width = canvas.width;
    this.base.height = canvas.height;
    const b = this.base.getContext('2d')!;
    b.fillStyle = 'rgba(12,14,18,0.82)';
    b.fillRect(0, 0, canvas.width, canvas.height);
    const s = this.scale;
    for (let cz = 0; cz < world.gz; cz++) {
      for (let cx = 0; cx < world.gx; cx++) {
        const i = cz * world.gx + cx;
        if (world.solid[i]) continue;
        const hgt = world.height[i];
        const zone = world.zone[i];
        let col = hgt > 0.3 ? '#c7ab74' : '#d8c193';
        if (zone === 1) col = '#cbb87a';
        if (zone === 2) col = '#c2b478';
        b.fillStyle = col;
        b.fillRect(cx * 1.5 * s - 0.4, cz * 1.5 * s - 0.4, 1.5 * s + 0.8, 1.5 * s + 0.8);
      }
    }
    // site letters
    b.font = `bold ${Math.round(9 * s)}px Arial`;
    b.textAlign = 'center';
    b.textBaseline = 'middle';
    b.fillStyle = 'rgba(40,30,10,0.75)';
    for (const site of [SITE_A, SITE_B]) {
      const p = this.toCanvas(site.cx, site.cz);
      b.fillText(site.name, p.x, p.y);
    }
  }

  private toCanvas(x: number, z: number) {
    return { x: (x - this.world.minX) * this.scale, y: (z - this.world.minZ) * this.scale };
  }

  draw(game: Game) {
    if ((this.frame++ & 1) === 1) return; // 30fps is plenty
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.base, 0, 0);

    const s = this.scale;
    const dot = (x: number, z: number, color: string, r = 3.4, stroke = false) => {
      const p = this.toCanvas(x, z);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      if (stroke) { ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.stroke(); }
      else { ctx.fillStyle = color; ctx.fill(); }
    };

    const now = game.time;
    const myTeam = game.controlled.team;

    // C4
    const bomb = game.bomb;
    if (bomb.state === 'dropped') dot(bomb.x, bomb.z, '#ff9d2e', 3.2, true);
    if (bomb.state === 'planted') {
      const pulse = 0.5 + 0.5 * Math.sin(now * 8);
      dot(bomb.x, bomb.z, `rgba(255,120,40,${0.5 + pulse * 0.5})`, 4.5 + pulse * 2, true);
    }

    // characters
    for (const c of game.characters) {
      if (!c.alive) continue;
      const friendly = c.team === myTeam;
      if (!friendly && now - c.spottedAt > 2.5) continue;
      if (c === game.controlled) continue;
      dot(c.x, c.z, friendly ? (c.team === 'CT' ? '#5aa9ff' : '#ffd35c') : '#ff5545', 3.2, true);
    }

    // self arrow (or spectated teammate)
    const self = game.controlled;
    if (self.alive) {
      const p = this.toCanvas(self.x, self.z);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(Math.sin(self.yaw), Math.cos(self.yaw)));
      // triangle points north by default; canvas x = world x, canvas y = world z
      ctx.rotate(Math.PI - self.yaw);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.4, 5);
      ctx.lineTo(0, 2.6);
      ctx.lineTo(-4.4, 5);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

  }
}

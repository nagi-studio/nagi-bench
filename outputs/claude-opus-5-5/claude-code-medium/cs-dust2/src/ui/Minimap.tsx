import { useEffect, useRef } from 'react';
import type { Game } from '../game/client/Game.ts';
import { BOMBSITES, CELL, CELL_CRATE, CELL_FLOOR, COLS, ORIGIN_X, ORIGIN_Z, REGIONS, ROWS } from '../game/core/map.ts';

const SCALE = 2.0; // px per metre
const W = COLS * CELL * SCALE;
const H = ROWS * CELL * SCALE;

const LABELS: Record<string, string> = {
  t_spawn: 'T',
  ct_spawn: 'CT',
  long_a: 'A大',
  mid: '中路',
  mid_doors: '中门',
  catwalk: '猫道',
  b_tunnels: 'B洞',
};

/** Static top-down rendering of the map grid (drawn once). */
function renderBase(game: Game): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  const grid = game.sim.map.grid;
  const roof = game.sim.map.roofedCells;
  const s = CELL * SCALE;
  ctx.fillStyle = 'rgba(20,18,16,0.0)';
  ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < ROWS; r++)
    for (let col = 0; col < COLS; col++) {
      const v = grid[r * COLS + col];
      if (v === CELL_FLOOR) ctx.fillStyle = roof[r * COLS + col] ? '#8f7c5f' : '#c9ad7f';
      else if (v === CELL_CRATE) ctx.fillStyle = '#7a5d38';
      else continue;
      ctx.fillRect(col * s, r * s, s + 0.5, s + 0.5);
    }
  // wall outlines: draw edges between floor and wall
  ctx.strokeStyle = 'rgba(40,30,20,0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  const isOpen = (cc: number, rr: number) => cc >= 0 && rr >= 0 && cc < COLS && rr < ROWS && grid[rr * COLS + cc] !== 0;
  for (let r = 0; r < ROWS; r++)
    for (let col = 0; col < COLS; col++) {
      if (!isOpen(col, r)) continue;
      const x = col * s;
      const y = r * s;
      if (!isOpen(col, r - 1)) (ctx.moveTo(x, y), ctx.lineTo(x + s, y));
      if (!isOpen(col, r + 1)) (ctx.moveTo(x, y + s), ctx.lineTo(x + s, y + s));
      if (!isOpen(col - 1, r)) (ctx.moveTo(x, y), ctx.lineTo(x, y + s));
      if (!isOpen(col + 1, r)) (ctx.moveTo(x + s, y), ctx.lineTo(x + s, y + s));
    }
  ctx.stroke();
  // bombsites
  for (const [k, rect] of Object.entries(BOMBSITES)) {
    ctx.fillStyle = 'rgba(200,40,30,0.18)';
    ctx.fillRect(rect.c0 * s, rect.r0 * s, (rect.c1 - rect.c0 + 1) * s, (rect.r1 - rect.r0 + 1) * s);
    ctx.fillStyle = 'rgba(220,50,40,0.95)';
    ctx.font = 'bold 26px Impact, Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(k, ((rect.c0 + rect.c1 + 1) / 2) * s, ((rect.r0 + rect.r1 + 1) / 2) * s);
  }
  // region labels
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(30,22,14,0.85)';
  for (const reg of REGIONS) {
    const label = LABELS[reg.id];
    if (!label) continue;
    ctx.fillText(label, ((reg.c0 + reg.c1 + 1) / 2) * s, ((reg.r0 + reg.r1 + 1) / 2) * s);
  }
  return c;
}

export function Minimap({ game }: { game: Game }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const base = renderBase(game);
    let raf = 0;
    const toPx = (x: number, z: number): [number, number] => [(x - ORIGIN_X) * SCALE, (z - ORIGIN_Z) * SCALE];

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const sim = game.sim;
      const myTeam = sim.cfg.playerTeam;
      const view = game.viewEntity();
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0);

      // bomb
      const b = sim.bomb;
      const bombVisible = myTeam === 'T' || b.state === 'planted' || b.state === 'defused' || (b.state === 'carried' && (sim.byId.get(b.carrierId)?.spottedUntil[myTeam] ?? 0) > sim.time);
      if (bombVisible && b.state !== 'exploded') {
        const [bx, by] = toPx(b.pos.x, b.pos.z);
        const blink = b.state !== 'planted' || Math.floor(sim.time * 4) % 2 === 0;
        if (blink) {
          ctx.fillStyle = b.state === 'planted' ? '#ff3b2f' : '#ffb020';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.5;
          ctx.fillRect(bx - 5, by - 4, 10, 8);
          ctx.strokeRect(bx - 5, by - 4, 10, 8);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('C4', bx, by + 0.5);
        }
      }

      for (const e of sim.entities) {
        const ally = e.team === myTeam;
        const [x, y] = toPx(e.pos.x, e.pos.z);
        if (!e.alive) {
          if (!ally) continue;
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 4, y - 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.moveTo(x + 4, y - 4);
          ctx.lineTo(x - 4, y + 4);
          ctx.stroke();
          continue;
        }
        if (!ally && e.spottedUntil[myTeam] < sim.time) continue;
        const isView = view && e.id === view.id;
        const color = !ally ? '#ff4040' : e.team === 'CT' ? '#5fa8ff' : '#f0b030';
        // facing direction
        const fx = -Math.sin(e.yaw);
        const fz = -Math.cos(e.yaw);
        if (isView) {
          // view cone
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          const a0 = Math.atan2(fz, fx);
          ctx.arc(x, y, 40, a0 - 0.6, a0 + 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(x + fx * 9, y + fz * 9);
          ctx.lineTo(x - fz * 5 - fx * 4, y + fx * 5 - fz * 4);
          ctx.lineTo(x + fz * 5 - fx * 4, y - fx * 5 - fz * 4);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + fx * 4, y + fz * 4);
          ctx.lineTo(x + fx * 9, y + fz * 9);
          ctx.stroke();
          if (e.hasBomb && ally) {
            ctx.fillStyle = '#ffb020';
            ctx.fillRect(x - 2, y - 2, 4, 4);
          }
        }
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [game]);

  return <canvas ref={ref} width={W} height={H} className="minimap" />;
}

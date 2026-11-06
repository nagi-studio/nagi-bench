// Radar: pre-rendered top-down Dust2 silhouette + live markers drawn every animation
// frame straight from engine state (no React re-render per frame).

import { useEffect, useRef } from 'react';
import { useGame } from './context';
import type { Game } from '../game/Game';

const SIZE = 236;

function buildBackground(game: Game, scale: number, ox: number, oz: number): HTMLCanvasElement {
  const map = game.map;
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgba(20,16,12,0.78)';
  ctx.fillRect(0, 0, SIZE, SIZE);
  const walk = (i: number, j: number) => i >= 0 && j >= 0 && i < map.W && j < map.D && !Number.isNaN(map.height[j * map.W + i]);
  for (let j = 0; j < map.D; j++)
    for (let i = 0; i < map.W; i++) {
      const x = (i - ox) * scale, y = (j - oz) * scale;
      if (walk(i, j)) {
        const h = map.height[j * map.W + i];
        const k = map.kind[j * map.W + i];
        const l = 46 + h * 9 + (k === 1 ? 6 : 0);
        ctx.fillStyle = `hsl(36, ${k === 2 ? 12 : 26}%, ${l}%)`;
        ctx.fillRect(x, y, scale + 0.6, scale + 0.6);
      }
    }
  // outline
  ctx.fillStyle = 'rgba(15,12,9,0.95)';
  for (let j = 0; j < map.D; j++)
    for (let i = 0; i < map.W; i++) {
      if (walk(i, j)) continue;
      if (walk(i + 1, j) || walk(i - 1, j) || walk(i, j + 1) || walk(i, j - 1)) {
        ctx.fillRect((i - ox) * scale, (j - oz) * scale, scale + 0.6, scale + 0.6);
      }
    }
  // crates / doors
  for (const b of map.boxes) {
    if (b.mat === 'wall' || b.mat === 'platform' || b.mat === 'ceiling' || b.mat === 'lintel') continue;
    ctx.fillStyle = b.mat === 'door' ? 'rgba(80,120,125,0.95)' : 'rgba(70,52,30,0.9)';
    ctx.fillRect((b.minX - ox) * scale, (b.minZ - oz) * scale, Math.max(1, (b.maxX - b.minX) * scale), Math.max(1, (b.maxZ - b.minZ) * scale));
  }
  // bomb sites
  for (const s of ['A', 'B'] as const) {
    const r = map.sites[s];
    ctx.strokeStyle = 'rgba(255,90,70,0.55)';
    ctx.setLineDash([3, 3]);
    ctx.strokeRect((r.x0 - ox) * scale, (r.z0 - oz) * scale, (r.x1 - r.x0) * scale, (r.z1 - r.z0) * scale);
  }
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const l of map.labels) {
    const big = /^[A-Z]+$/.test(l.text);
    ctx.font = big ? 'bold 20px system-ui, sans-serif' : '10px system-ui, sans-serif';
    ctx.fillStyle = big ? (l.text === 'A' || l.text === 'B' ? 'rgba(255,110,90,0.9)' : 'rgba(255,255,255,0.55)') : 'rgba(255,255,255,0.6)';
    ctx.fillText(l.text, (l.pos.x - ox) * scale, (l.pos.z - oz) * scale);
  }
  return c;
}

export function Minimap() {
  const game = useGame();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const ox = 2, oz = 2;
    const scale = SIZE / Math.max(game.map.W - 4, game.map.D - 4);
    const bg = buildBackground(game, scale, ox, oz);
    let raf = 0;
    const P = (x: number, z: number): [number, number] => [(x - ox) * scale, (z - oz) * scale];

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(bg, 0, 0);
      const team = game.playerTeam;
      const view = game.viewSoldier;
      const t = game.time;

      // bomb
      const b = game.round.bomb;
      if (game.bombVisibleOnRadar() && b.state !== 'carried') {
        const [x, y] = P(b.pos.x, b.pos.z);
        const blink = b.state !== 'planted' || Math.floor(t * 4) % 2 === 0;
        ctx.fillStyle = b.state === 'planted' ? (blink ? '#ff3b30' : '#7a1a14') : b.state === 'defused' ? '#4cd964' : '#ffae2a';
        ctx.fillRect(x - 4, y - 3, 8, 6);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 4, y - 3, 8, 6);
      }

      for (const s of game.soldiers) {
        const [x, y] = P(s.pos.x, s.pos.z);
        const friendly = s.team === team;
        if (!s.alive) {
          if (friendly && t - s.deathTime < 8) {
            ctx.strokeStyle = 'rgba(200,200,200,0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x - 3, y - 3);
            ctx.lineTo(x + 3, y + 3);
            ctx.moveTo(x + 3, y - 3);
            ctx.lineTo(x - 3, y + 3);
            ctx.stroke();
          }
          continue;
        }
        if (!friendly && !game.isSpotted(s)) continue;
        const dirX = -Math.sin(s.yaw), dirZ = -Math.cos(s.yaw);
        if (s === view) {
          // self: arrow
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.atan2(dirZ, dirX) + Math.PI / 2);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(5, 5);
          ctx.lineTo(0, 2);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        } else {
          const col = friendly ? (s.team === 'CT' ? '#5aa8ff' : '#ffc23a') : '#ff3b30';
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x, y, 3.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.8)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + dirX * 8, y + dirZ * 8);
          ctx.stroke();
        }
        if (s.hasBomb && game.bombVisibleOnRadar()) {
          ctx.fillStyle = '#ffae2a';
          ctx.fillRect(x + 4, y - 7, 6, 5);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [game]);

  return <canvas ref={ref} className="minimap" width={SIZE} height={SIZE} />;
}

/**
 * Radar: pre-renders the walkable area from the occupancy grid once, then
 * blits it and plots live positions every frame.
 */

import { useEffect, useMemo, useRef } from 'react';
import type { NavGrid } from '../game/map/grid';
import { REGIONS, SITES } from '../game/map/dust2';
import type { Bomb, Combatant } from '../game/types';

const MM_W = 208;
const MM_H = 166;

interface Props {
  grid: NavGrid;
  combatants: Combatant[];
  bomb: Bomb;
  /** id of the combatant the camera follows */
  cameraId: number | null;
  cameraTeam: 'CT' | 'T';
  yaw: number;
}

const REGION_TINT: Record<string, string> = {
  T_SPAWN: '#6d5b42',
  CT_SPAWN: '#3d4d61',
  A_SITE: '#7a5f42',
  B_SITE: '#7a5f42',
  A_LONG: '#5f5340',
  MID: '#574c3b',
  MID_DOORS: '#6a5a44',
  CATWALK: '#655442',
  TOP_MID: '#5b5140',
  CT_MID: '#49505e',
  B_DOORS: '#5a5348',
  B_TUNNEL: '#544936',
  TUNNEL_BEND: '#544936',
  UPPER_TUNNEL: '#544936',
};

function buildBackground(grid: NavGrid): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = MM_W;
  c.height = MM_H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#14171c';
  ctx.fillRect(0, 0, MM_W, MM_H);

  const sx = MM_W / (grid.cols * grid.cell);
  const sy = MM_H / (grid.rows * grid.cell);

  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] !== 1) continue;
      const rid = grid.region[i] as number;
      const id = rid > 0 ? REGIONS[rid - 1]!.id : '';
      ctx.fillStyle = REGION_TINT[id] ?? '#5a5140';
      const x = (grid.minXOf(cx) - grid.ox) * sx;
      const y = (grid.minZOf(cz) - grid.oz) * sy;
      ctx.fillRect(x, y, grid.cell * sx + 0.6, grid.cell * sy + 0.6);
    }
  }

  // bombsite outlines
  for (const s of SITES) {
    ctx.strokeStyle = s.id === 'A' ? 'rgba(230,110,70,0.85)' : 'rgba(90,170,230,0.85)';
    ctx.lineWidth = 1.4;
    const x = (s.x0 - grid.ox) * sx;
    const y = (s.z0 - grid.oz) * sy;
    ctx.strokeRect(x, y, (s.x1 - s.x0) * sx, (s.z1 - s.z0) * sy);
    ctx.fillStyle = s.id === 'A' ? 'rgba(230,110,70,0.13)' : 'rgba(90,170,230,0.13)';
    ctx.fillRect(x, y, (s.x1 - s.x0) * sx, (s.z1 - s.z0) * sy);
  }

  // region labels
  ctx.font = '7px Segoe UI, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.textAlign = 'center';
  const labels: { x: number; z: number; t: string }[] = [
    { x: -44, z: -34, t: 'A' },
    { x: 39, z: -8, t: 'B' },
    { x: -33, z: 30, t: 'T' },
    { x: 40, z: -36, t: 'CT' },
    { x: -50, z: 0, t: 'A大' },
    { x: -7, z: 0, t: '中' },
    { x: -28, z: -33, t: '猫' },
  ];
  for (const l of labels) {
    ctx.fillText(l.t, (l.x - grid.ox) * sx, (l.z - grid.oz) * sy + 2.5);
  }

  return c;
}

export function Minimap({ grid, combatants, bomb, cameraId, cameraTeam, yaw }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const bg = useMemo(() => buildBackground(grid), [grid]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const sx = MM_W / (grid.cols * grid.cell);
    const sy = MM_H / (grid.rows * grid.cell);
    const tx = (x: number) => (x - grid.ox) * sx;
    const tz = (z: number) => (z - grid.oz) * sy;

    ctx.clearRect(0, 0, MM_W, MM_H);
    ctx.drawImage(bg, 0, 0);

    // bomb
    if (bomb.state === 'planted' || bomb.state === 'dropped') {
      const bx = tx(bomb.x);
      const bz = tz(bomb.z);
      if (bomb.state === 'planted') {
        const r = 4 + (Math.sin(performance.now() / 110) * 1.6 + 1.6);
        ctx.fillStyle = '#ff3b2e';
        ctx.beginPath();
        ctx.arc(bx, bz, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,190,60,0.95)';
        ctx.fillRect(bx - 2.5, bz - 2.5, 5, 5);
      }
    }

    // players
    for (const c of combatants) {
      if (!c.alive) continue;
      const px = tx(c.body.x);
      const pz = tz(c.body.z);
      const mate = c.team === cameraTeam;
      const isSelf = c.id === cameraId;

      if (isSelf) {
        // view cone
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.beginPath();
        ctx.moveTo(px, pz);
        const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
        const half = 0.55;
        ctx.lineTo(px + (fx * Math.cos(half) - fz * Math.sin(half)) * 26,
          pz + (fz * Math.cos(half) + fx * Math.sin(half)) * 26);
        ctx.lineTo(px + (fx * Math.cos(-half) - fz * Math.sin(-half)) * 26,
          pz + (fz * Math.cos(-half) + fx * Math.sin(-half)) * 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(px + fx * 4.6, pz + fz * 4.6);
        ctx.lineTo(px - fz * 2.8 - fx * 2.0, pz + fx * 2.8 - fz * 2.0);
        ctx.lineTo(px + fz * 2.8 - fx * 2.0, pz - fx * 2.8 - fz * 2.0);
        ctx.closePath();
        ctx.fill();
        continue;
      }

      // only enemies that are currently spotted are drawn — information
      // is gated by the engine's line-of-sight test
      const known = c.__spotted;
      if (!mate && !known) continue;

      ctx.fillStyle = mate ? (c.team === 'CT' ? '#6fa8dc' : '#e0a04a') : '#ff5a4a';
      ctx.beginPath();
      ctx.arc(px, pz, isSelf ? 3.4 : 3.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (c.hasBomb && mate) {
        ctx.strokeStyle = '#ffb020';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, pz, 5.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  });

  return (
    <div className="minimap">
      <div className="mm-title">DUST2</div>
      <canvas ref={ref} width={MM_W} height={MM_H} />
    </div>
  );
}

export { MM_W, MM_H };

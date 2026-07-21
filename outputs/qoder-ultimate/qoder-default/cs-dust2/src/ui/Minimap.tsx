import { useEffect, useRef } from 'react';
import { WALKABLE } from '../game/map/dust2';
import { HudState } from '../store';

const X_MIN = -48;
const X_MAX = 48;
const Z_MIN = -58;
const Z_MAX = 56;
const W = 190;
const H = (W * (Z_MAX - Z_MIN)) / (X_MAX - X_MIN);

const LABELS: { name: string; x: number; z: number }[] = [
  { name: 'T', x: 0, z: 47 },
  { name: 'CT', x: 0, z: -47 },
  { name: 'A', x: -29, z: -24 },
  { name: 'B', x: 33, z: -20 },
  { name: 'MID', x: 10, z: 12 },
  { name: 'LONG', x: -33, z: 20 },
  { name: 'CAT', x: -9, z: -6 },
  { name: 'TUN', x: 35, z: 20 },
];

export function Minimap({ hud }: { hud: HudState }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const tx = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * W;
  const tz = (z: number) => ((z - Z_MIN) / (Z_MAX - Z_MIN)) * H;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);

    // walkable areas
    ctx.fillStyle = 'rgba(60,55,40,0.75)';
    for (const r of WALKABLE) {
      const x = tx(r.xmin);
      const z = tz(r.zmin);
      ctx.fillRect(x, z, tx(r.xmax) - x, tz(r.zmax) - z);
    }
    // outline
    ctx.strokeStyle = 'rgba(220,200,150,0.5)';
    ctx.lineWidth = 1;
    for (const r of WALKABLE) {
      const x = tx(r.xmin);
      const z = tz(r.zmin);
      ctx.strokeRect(x, z, tx(r.xmax) - x, tz(r.zmax) - z);
    }

    // labels
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    for (const l of LABELS) ctx.fillText(l.name, tx(l.x), tz(l.z));

    // bomb
    if (hud.bombPos) {
      ctx.fillStyle = hud.bombPlanted ? '#ff3030' : '#ffcc00';
      ctx.beginPath();
      ctx.arc(tx(hud.bombPos.x), tz(hud.bombPos.z), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('C4', tx(hud.bombPos.x), tz(hud.bombPos.z) + 2.5);
    }

    // actors
    for (const d of hud.minimap) {
      if (!d.alive) continue;
      if (!d.visible && !d.isPlayer) continue;
      const px = tx(d.x);
      const pz = tz(d.z);
      if (d.isPlayer) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, pz, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
      } else {
        ctx.fillStyle = d.team === 'CT' ? '#4a9fe0' : '#e0a94a';
        ctx.beginPath();
        ctx.arc(px, pz, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [hud]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 4,
        background: 'rgba(10,12,16,0.55)',
      }}
    />
  );
}

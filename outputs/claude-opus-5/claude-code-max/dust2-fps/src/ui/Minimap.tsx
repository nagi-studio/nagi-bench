import { useEffect, useMemo, useRef } from 'react';
import { SECTORS, BOMB_SITES, mapBounds } from '../game/map/dust2.ts';
import type { HudSnapshot } from './store.ts';

const SIZE = 200;
const PADDING = 8;

interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

function makeTransform(): Transform {
  const b = mapBounds();
  const w = b.maxX - b.minX;
  const h = b.maxZ - b.minZ;
  const scale = (SIZE - PADDING * 2) / Math.max(w, h);
  return {
    scale,
    offsetX: PADDING - b.minX * scale + (SIZE - PADDING * 2 - w * scale) / 2,
    offsetY: PADDING - b.minZ * scale + (SIZE - PADDING * 2 - h * scale) / 2,
  };
}

/**
 * Pre-renders the static Dust2 outline once; the live layer only draws the moving dots.
 * North (-Z) is up, matching the real radar.
 */
function buildBackground(t: Transform): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(10, 14, 20, 0.72)';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Walkable area.
  ctx.fillStyle = 'rgba(206, 180, 130, 0.30)';
  for (const s of SECTORS) {
    ctx.fillRect(
      s.x0 * t.scale + t.offsetX,
      s.z0 * t.scale + t.offsetY,
      (s.x1 - s.x0) * t.scale,
      (s.z1 - s.z0) * t.scale,
    );
  }

  // Outline each sector so corridors stay readable.
  ctx.strokeStyle = 'rgba(233, 214, 176, 0.45)';
  ctx.lineWidth = 1;
  for (const s of SECTORS) {
    ctx.strokeRect(
      Math.round(s.x0 * t.scale + t.offsetX) + 0.5,
      Math.round(s.z0 * t.scale + t.offsetY) + 0.5,
      Math.round((s.x1 - s.x0) * t.scale),
      Math.round((s.z1 - s.z0) * t.scale),
    );
  }

  // Bomb sites.
  for (const site of BOMB_SITES) {
    const x = site.x0 * t.scale + t.offsetX;
    const y = site.z0 * t.scale + t.offsetY;
    const w = (site.x1 - site.x0) * t.scale;
    const h = (site.z1 - site.z0) * t.scale;
    ctx.fillStyle = site.id === 'A' ? 'rgba(200, 70, 55, 0.22)' : 'rgba(60, 120, 200, 0.22)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = site.id === 'A' ? 'rgba(230, 110, 90, 0.8)' : 'rgba(110, 170, 235, 0.8)';
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = site.id === 'A' ? 'rgba(255, 150, 130, 0.95)' : 'rgba(150, 200, 255, 0.95)';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(site.id, x + w / 2, y + h / 2);
  }

  return canvas;
}

export function Minimap({ snap }: { snap: HudSnapshot }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transform = useMemo(makeTransform, []);
  // The Dust2 outline never changes, so it is rasterised once and blitted every frame.
  const background = useMemo(() => buildBackground(transform), [transform]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !background) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(background, 0, 0);

    const toX = (x: number) => x * transform.scale + transform.offsetX;
    const toY = (z: number) => z * transform.scale + transform.offsetY;

    // --- the bomb -----------------------------------------------------------
    if (snap.bombKnown && snap.bombState !== 'exploded') {
      const bx = toX(snap.bombX);
      const by = toY(snap.bombZ);
      const planted = snap.bombState === 'planted';
      const blink = planted ? 0.55 + 0.45 * Math.sin(Date.now() * 0.012) : 1;
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.fillStyle = snap.bombState === 'defused' ? '#54d98c' : '#ff9f43';
      ctx.strokeStyle = '#1b1005';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(bx - 4, by - 4, 8, 8);
      ctx.fill();
      ctx.stroke();
      if (planted) {
        ctx.strokeStyle = 'rgba(255, 90, 60, 0.9)';
        ctx.beginPath();
        ctx.arc(bx, by, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- players ------------------------------------------------------------
    for (const actor of snap.minimap) {
      if (!actor.known) continue;
      const isFriendly = actor.team === snap.playerTeam;
      const px = toX(actor.x);
      const py = toY(actor.z);

      if (!actor.alive) {
        ctx.strokeStyle = isFriendly ? 'rgba(110, 160, 220, 0.45)' : 'rgba(220, 110, 90, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px - 3, py - 3);
        ctx.lineTo(px + 3, py + 3);
        ctx.moveTo(px + 3, py - 3);
        ctx.lineTo(px - 3, py + 3);
        ctx.stroke();
        continue;
      }

      // View cone for the player being controlled.
      if (actor.isSelf) {
        ctx.save();
        ctx.translate(px, py);
        // yaw 0 looks towards -Z (up on the radar).
        ctx.rotate(-actor.yaw);
        const cone = ctx.createLinearGradient(0, 0, 0, -26);
        cone.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        cone.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = cone;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-13, -26);
        ctx.lineTo(13, -26);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(px, py, actor.isSelf ? 4.5 : 3.4, 0, Math.PI * 2);
      ctx.fillStyle = actor.isSelf ? '#ffffff' : isFriendly ? '#54a0ff' : '#ff5a4d';
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(0,0,0,0.75)';
      ctx.stroke();

      if (actor.hasBomb) {
        ctx.beginPath();
        ctx.arc(px, py, 6.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff9f43';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }
  }, [snap, transform, background]);

  return (
    <div className="minimap">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} />
      <div className="minimap-label">{snap.areaLabel}</div>
    </div>
  );
}

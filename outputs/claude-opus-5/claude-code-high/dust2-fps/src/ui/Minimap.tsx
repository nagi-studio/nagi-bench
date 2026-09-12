import { useEffect, useRef } from 'react';
import { dist2D } from '../core/math.ts';
import type { GameEngine } from '../game/engine.ts';
import { eyePos, chestPos } from '../game/actor.ts';

const SIZE = 224;

/**
 * Top-down radar. The static level image is rasterised once from the
 * collision grid; every frame we only stamp the live blips on top.
 *
 * It reads the engine directly instead of going through React state — at
 * 60 fps a React re-render per frame would be pure waste.
 */
export function Minimap({ engine }: { engine: GameEngine }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const grid = engine.world.grid;
    const scale = Math.min(SIZE / grid.nx, SIZE / grid.nz);
    const offX = (SIZE - grid.nx * scale) / 2;
    const offZ = (SIZE - grid.nz * scale) / 2;

    // ---- static layer ----------------------------------------------------
    const base = document.createElement('canvas');
    base.width = SIZE;
    base.height = SIZE;
    const bx = base.getContext('2d')!;
    bx.fillStyle = 'rgba(8, 11, 16, 0.85)';
    bx.fillRect(0, 0, SIZE, SIZE);
    for (let j = 0; j < grid.nz; j++) {
      for (let i = 0; i < grid.nx; i++) {
        if (grid.isSolidCell(i, j)) continue;
        const h = grid.floorCell(i, j);
        bx.fillStyle = h > 0.9 ? '#b6a077' : h > 0.2 ? '#96825e' : '#6f6146';
        bx.fillRect(offX + i * scale, offZ + j * scale, scale + 0.6, scale + 0.6);
      }
    }
    // Bomb sites.
    for (const [name, zone] of Object.entries(engine.world.bombsites)) {
      const x1 = offX + (zone.x1 - grid.minX) * scale;
      const z1 = offZ + (zone.z1 - grid.minZ) * scale;
      const w = (zone.x2 - zone.x1) * scale;
      const h = (zone.z2 - zone.z1) * scale;
      bx.strokeStyle = 'rgba(255, 90, 60, 0.8)';
      bx.lineWidth = 1;
      bx.strokeRect(x1, z1, w, h);
      bx.fillStyle = 'rgba(255, 120, 80, 0.85)';
      bx.font = 'bold 13px monospace';
      bx.textAlign = 'center';
      bx.fillText(name, x1 + w / 2, z1 + h / 2 + 5);
    }
    const toX = (wx: number) => offX + (wx - grid.minX) * scale;
    const toZ = (wz: number) => offZ + (wz - grid.minZ) * scale;

    let raf = 0;
    let visTimer = 0;
    let last = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const view = engine.viewActor;
      const me = engine.localActor;
      const myTeam = me ? me.team : engine.config.playerTeam;

      // Recompute enemy visibility a few times a second, not every frame.
      visTimer -= dt;
      if (visTimer <= 0) {
        visTimer = 0.12;
        const vis = new Set<number>();
        for (const enemy of engine.actors) {
          if (!enemy.alive || enemy.team === myTeam) continue;
          for (const mate of engine.actors) {
            if (!mate.alive || mate.team !== myTeam) continue;
            if (dist2D(mate.pos, enemy.pos) > 70) continue;
            if (engine.world.losClear(eyePos(mate), chestPos(enemy))) {
              vis.add(enemy.id);
              break;
            }
          }
        }
        visibleRef.current = vis;
      }

      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(base, 0, 0);

      // ---- C4 -------------------------------------------------------------
      const bomb = engine.bomb;
      if (bomb.phase === 'planted' || bomb.phase === 'dropped') {
        const bx2 = toX(bomb.pos.x);
        const bz2 = toZ(bomb.pos.z);
        const blink = bomb.phase === 'planted' && Math.floor(engine.time * 4) % 2 === 0;
        ctx.fillStyle = blink ? '#ff3b28' : '#ff9d3b';
        ctx.beginPath();
        ctx.arc(bx2, bz2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('C4', bx2, bz2 - 6);
      } else if (bomb.phase === 'carried') {
        const carrier = engine.actorById(bomb.carrierId);
        if (carrier && carrier.alive && carrier.team === myTeam) {
          ctx.fillStyle = 'rgba(255,157,59,0.85)';
          ctx.beginPath();
          ctx.arc(toX(carrier.pos.x), toZ(carrier.pos.z), 6.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- actors ---------------------------------------------------------
      for (const a of engine.actors) {
        if (!a.alive) continue;
        const isMate = a.team === myTeam;
        const isMe = view && a.id === view.id;
        if (!isMate && !visibleRef.current.has(a.id)) continue;

        const x = toX(a.pos.x);
        const z = toZ(a.pos.z);
        ctx.save();
        ctx.translate(x, z);
        // Triangle pointing where the actor is looking (yaw 0 == -Z == up).
        ctx.rotate(-a.yaw);
        ctx.beginPath();
        ctx.moveTo(0, -5.5);
        ctx.lineTo(4, 4);
        ctx.lineTo(0, 1.8);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        if (isMe) ctx.fillStyle = '#ffffff';
        else if (isMate) ctx.fillStyle = a.team === 'CT' ? '#4a9eff' : '#f0a038';
        else ctx.fillStyle = '#ff3b28';
        ctx.fill();
        if (isMe) {
          ctx.strokeStyle = 'rgba(0,0,0,0.8)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        if (isMate && a.hasBomb) {
          ctx.strokeStyle = '#ff9d3b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(x, z, 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  return (
    <div className="minimap panel">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} />
      <div className="legend">
        <span>
          <b style={{ color: '#fff' }}>▲</b> 你
        </span>
        <span>
          <b style={{ color: '#4a9eff' }}>▲</b> 队友
        </span>
        <span>
          <b style={{ color: '#ff3b28' }}>▲</b> 敌人
        </span>
        <span>
          <b style={{ color: '#ff9d3b' }}>●</b> C4
        </span>
      </div>
    </div>
  );
}

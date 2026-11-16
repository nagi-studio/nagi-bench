import React, { useEffect, useRef, useState } from 'react';
import { Game, type Hud } from './game/engine';
import { GRID, W, H, CELL, AREAS } from './game/map';

const emptyHud: Hud = {
  hp: 100, armor: 100, ammo: 12, reserve: 96, weapon: 'USP-S', phase: 'freeze', timer: 4,
  ct: 0, t: 0, alive: true, feed: [], bomb: null, message: '', spots: [], scope: false, defusing: 0
};

export default function App() {
  const host = useRef<HTMLDivElement | null>(null);
  const map = useRef<HTMLCanvasElement | null>(null);
  const game = useRef<Game | null>(null);
  const [hud, setHud] = useState<Hud>(emptyHud);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!host.current || game.current) return;
    game.current = new Game(host.current, setHud);
    (window as any).__game = game.current;
    const onResize = () => game.current?.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      game.current?.dispose();
      game.current = null;
    };
  }, []);

  const start = () => {
    setStarted(true);
    const el = game.current?.renderer.domElement;
    if (el) el.requestPointerLock?.();
  };

  useEffect(() => {
    const onChange = () => {
      const g = game.current;
      if (g) g.locked = document.pointerLockElement === g.renderer.domElement;
    };
    document.addEventListener('pointerlockchange', onChange);
    return () => document.removeEventListener('pointerlockchange', onChange);
  }, []);

  // minimap
  useEffect(() => {
    const c = map.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const S = c.width / (W * CELL);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#1b1d21';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#3a3f46';
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        if (GRID[z * W + x] !== 0) continue;
        ctx.fillRect(x * CELL * S, z * CELL * S, CELL * S + 0.6, CELL * S + 0.6);
      }
    }
    const site = (r: { x0: number; z0: number; x1: number; z1: number }, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(r.x0 * CELL * S, r.z0 * CELL * S, (r.x1 - r.x0 + 1) * CELL * S, (r.z1 - r.z0 + 1) * CELL * S);
    };
    site(AREAS.asite, 'rgba(214,150,70,0.22)');
    site(AREAS.bsite, 'rgba(214,150,70,0.22)');
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.strokeRect(0.5, 0.5, c.width - 1, c.height - 1);

    for (const s of hud.spots) {
      if (!s.alive) continue;
      if (s.me) {
        ctx.fillStyle = '#8ef0c4';
        ctx.beginPath();
        ctx.arc(s.x * S, s.z * S, 3.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (s.team === 'CT') {
        ctx.fillStyle = 'rgba(110,160,235,0.85)';
        ctx.fillRect(s.x * S - 2, s.z * S - 2, 4, 4);
      } else {
        // enemies only show when a teammate can see them (approximate: close range)
        const seen = hud.spots.some((o) => o.me && Math.hypot(o.x - s.x, o.z - s.z) < 26);
        if (seen) {
          ctx.fillStyle = 'rgba(235,110,90,0.9)';
          ctx.fillRect(s.x * S - 2, s.z * S - 2, 4, 4);
        }
      }
    }
    if (hud.bomb) {
      ctx.fillStyle = '#ff5b4a';
      ctx.beginPath();
      ctx.arc(hud.bomb.x * S, hud.bomb.z * S, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [hud]);

  const mm = Math.floor(hud.timer / 60);
  const ss = Math.floor(hud.timer % 60).toString().padStart(2, '0');

  return (
    <div className="wrap">
      <div ref={host} className="viewport" />

      <div className="hud">
        <div className="mm">
          <canvas ref={map} width={190} height={190} />
          <div className="mmLabel">DUST2 · 雷达</div>
        </div>

        <div className="topbar">
          <span className="ct">CT {hud.ct}</span>
          <span className="clock">{hud.phase === 'planted' ? `C4 ${Math.max(0, Math.ceil(hud.timer))}` : `${mm}:${ss}`}</span>
          <span className="t">{hud.t} T</span>
        </div>

        <div className="feed">
          {hud.feed.map((f, i) => (
            <div key={i}>
              <b>{f.k}</b> <span>›</span> {f.w}
            </div>
          ))}
        </div>

        <div className="vitals">
          <div><span className="k">HP</span><b>{hud.hp}</b></div>
          <div><span className="k">ARMOR</span><b>{hud.armor}</b></div>
        </div>

        <div className="ammo">
          <div className="wname">{hud.weapon}</div>
          <div><b>{hud.ammo < 0 ? '∞' : hud.ammo}</b><span> / {hud.reserve}</span></div>
        </div>

        {hud.defusing > 0 && <div className="defuse">拆包 {Math.round(hud.defusing * 100)}%</div>}
        {hud.message && <div className="banner">{hud.message}</div>}
        {!hud.alive && <div className="dead">已阵亡 · 観战中</div>}

        {hud.scope ? <div className="scope" /> : <div className="cross" />}
      </div>

      {!started && (
        <div className="start">
          <div className="card">
            <h1>DUST2 · 5v5</h1>
            <p>进攻方已在 A 大与 B 洞集结。你是防守方之一，与 4 名 AI 队友守住 A/B 两个包点。</p>
            <div className="keys">
              <b>WASD</b><span>移动</span>
              <b>鼠标</b><span>瞄准 · 左键射击 · 右键开镜（AWP）</span>
              <b>R</b><span>换弹</span>
              <b>1 / 2 / 3</b><span>主武器 / 副武器 / 刀</span>
              <b>E</b><span>拆除炸弹（贴近 C4）</span>
            </div>
            <button onClick={start}>进入战场</button>
          </div>
        </div>
      )}
    </div>
  );
}

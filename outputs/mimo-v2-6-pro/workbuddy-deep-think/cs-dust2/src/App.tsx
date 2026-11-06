import { useEffect, useRef, useState } from 'react';
import { Game, type HudModel } from './game';
import { Sfx } from './audio';

const EMPTY: HudModel = {
  hp: 100, armor: 0, helmet: false, weapon: 'Glock-18', ammo: 20, mag: 20,
  alive: true, scoped: false, spread: 0, phase: '冻结期', roundTime: 3,
  scoreCT: 0, scoreT: 0, kills: [], c4: { planted: false, carrier: null, timer: 0 },
  defusing: 0, planting: 0, minimap: [], spectator: '—'
};

function Minimap({ hud }: { hud: HudModel }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    if (!g) return;
    const S = 180;
    const w2m = (v: number) => (v / 120) * S;
    g.clearRect(0, 0, S, S);
    g.fillStyle = '#20262e';
    g.fillRect(0, 0, S, S);
    g.fillStyle = '#39424c';
    // wall footprint (simplified strokes)
    for (const r of [
      [10, 6, 30, 3], [6, 22, 3, 26], [62, 5, 76, 3], [62, 23, 30, 3],
      [112, 14, 3, 26], [98, 36, 26, 3], [52, 56, 3, 106], [68, 30, 3, 46], [68, 88, 3, 62],
      [10, 46, 3, 34], [30, 46, 3, 22], [30, 80, 3, 22], [8, 112, 28, 3], [36, 96, 3, 28],
      [78, 34, 22, 3], [88, 50, 22, 3]
    ] as const) {
      g.fillRect(w2m(r[0]), w2m(r[1]), Math.max(2, w2m(r[2])), Math.max(2, w2m(r[3])));
    }
    // site pads
    g.fillStyle = 'rgba(210,120,70,0.5)';
    g.beginPath(); g.arc(w2m(98), w2m(26), 10, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(w2m(24), w2m(98), 10, 0, Math.PI * 2); g.fill();
    // players
    for (const p of hud.minimap) {
      if (!p.alive) continue;
      g.fillStyle = p.human ? '#ffd76a' : p.team === 0 ? '#6fb2ff' : '#ff9a5c';
      g.beginPath();
      g.arc(w2m(p.x), w2m(p.z), p.human ? 4 : 3, 0, Math.PI * 2);
      g.fill();
    }
    // C4
    if (hud.c4.planted) {
      g.fillStyle = '#ff4040';
      g.fillRect(w2m(98) - 3, w2m(26) - 3, 6, 6);
    }
  }, [hud]);
  return <canvas ref={ref} width={180} height={180} style={{ borderRadius: 8, border: '1px solid #4a5560' }} />;
}

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hud, setHud] = useState<HudModel>(EMPTY);
  const [started, setStarted] = useState(() => new URLSearchParams(window.location.search).has('autoplay'));

  useEffect(() => {
    if (!started || !mountRef.current) return;
    const sfx = new Sfx();
    sfx.start();
    const game = new Game(mountRef.current, sfx, setHud);
    game.start();
    return () => game.dispose();
  }, [started]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#12161c', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {!started && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(10,13,18,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16, color: '#e8eef6', fontFamily: 'Segoe UI, sans-serif'
        }}>
          <div style={{ fontSize: 34, letterSpacing: 6 }}>CS DUST2 · 5v5</div>
          <div style={{ fontSize: 13, color: '#93a2b4', letterSpacing: 2 }}>
            WASD 移动 · 空格 跳跃 · 左键 开火 · 右键 AWP 开镜 · 1/2/3 切枪 · R 换弹
          </div>
          <button
            onClick={() => setStarted(true)}
            style={{ marginTop: 12, padding: '12px 46px', fontSize: 15, letterSpacing: 4, borderRadius: 8, border: '1px solid #d8a24a', background: 'rgba(216,162,74,0.16)', color: '#ffd76a', cursor: 'pointer' }}
          >
            进入对局
          </button>
          <div style={{ fontSize: 11, color: '#64707e' }}>进入后点击画面锁定鼠标 · 首回合为手枪局</div>
        </div>
      )}

      {started && (
        <>
          {/* AWP scope overlay */}
          {hud.scoped && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 26%, rgba(0,0,0,0.96) 27%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.4)' }} />
            </div>
          )}

          {/* crosshair */}
          {!hud.scoped && (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 7, pointerEvents: 'none' }}>
              {[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy], i) => {
                const gap = 6 + hud.spread * 260;
                return (
                  <div key={i} style={{
                    position: 'absolute', width: 2, height: 8, background: '#e8f2e8',
                    left: dx * gap, top: dy * gap,
                    transform: `translate(-50%,-50%) rotate(${i * 90}deg)`,
                    boxShadow: '0 0 2px #000'
                  }} />
                );
              })}
            </div>
          )}

          {/* bottom-left: health / armor */}
          <div style={{ position: 'absolute', left: 22, bottom: 22, zIndex: 7, display: 'flex', gap: 14, fontFamily: 'Consolas, monospace' }}>
            <div style={{ background: 'rgba(12,18,26,0.72)', border: '1px solid #38424c', borderRadius: 8, padding: '10px 18px', color: '#8ef0a2', fontSize: 30 }}>{hud.hp}</div>
            <div style={{ background: 'rgba(12,18,26,0.72)', border: '1px solid #38424c', borderRadius: 8, padding: '10px 18px', color: '#7ec8ff', fontSize: 30 }}>{hud.armor}{hud.helmet ? 'H' : ''}</div>
          </div>

          {/* bottom-right: ammo */}
          <div style={{ position: 'absolute', right: 22, bottom: 22, zIndex: 7, background: 'rgba(12,18,26,0.72)', border: '1px solid #38424c', borderRadius: 8, padding: '10px 20px', fontFamily: 'Consolas, monospace' }}>
            <div style={{ color: '#c6d2de', fontSize: 12, letterSpacing: 2 }}>{hud.weapon}</div>
            <div style={{ color: '#ffd76a', fontSize: 32 }}>{hud.ammo} <span style={{ color: '#7c8894', fontSize: 18 }}>/ {hud.mag}</span></div>
          </div>

          {/* top-center: round state */}
          <div style={{ position: 'absolute', left: '50%', top: 18, transform: 'translateX(-50%)', zIndex: 7, background: 'rgba(12,18,26,0.72)', border: '1px solid #38424c', borderRadius: 8, padding: '8px 26px', textAlign: 'center' }}>
            <div style={{ color: '#dce6f0', fontSize: 15, letterSpacing: 3 }}>{hud.phase}</div>
            <div style={{ color: '#ffd76a', fontSize: 22, fontFamily: 'Consolas, monospace' }}>{hud.roundTime}s</div>
            <div style={{ color: '#9db8d8', fontSize: 12 }}>CT {hud.scoreCT} : {hud.scoreT} T</div>
          </div>

          {/* killfeed top-right */}
          <div style={{ position: 'absolute', right: 22, top: 18, zIndex: 7, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            {hud.kills.map((k, i) => (
              <div key={i} style={{ background: 'rgba(12,18,26,0.7)', border: '1px solid #38424c', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#cfd8e2' }}>
                <span style={{ color: '#ff9a5c' }}>{k.killer}</span>
                <span style={{ margin: '0 8px', color: '#8fa0b0' }}>{k.weapon}{k.headshot ? ' (爆头)' : ''}</span>
                <span style={{ color: '#6fb2ff' }}>{k.victim}</span>
              </div>
            ))}
          </div>

          {/* minimap top-left */}
          <div style={{ position: 'absolute', left: 22, top: 18, zIndex: 7 }}>
            <Minimap hud={hud} />
            <div style={{ color: '#8fa0b0', fontSize: 11, marginTop: 6, letterSpacing: 2 }}>
              DUST2 · {hud.alive ? '存活' : `观战 ${hud.spectator}`}
            </div>
          </div>

          {/* C4 / progress prompts */}
          {(hud.planting > 0.1 || hud.defusing > 0.1 || hud.c4.planted) && (
            <div style={{ position: 'absolute', left: '50%', bottom: 110, transform: 'translateX(-50%)', zIndex: 7, background: 'rgba(20,16,12,0.82)', border: '1px solid #d8a24a', borderRadius: 8, padding: '10px 22px', color: '#ffd76a', fontSize: 14 }}>
              {hud.planting > 0.1 && `安放 C4 中 ${(hud.planting / 3.2 * 100).toFixed(0)}%`}
              {hud.defusing > 0.1 && `拆除中 ${(hud.defusing / 10 * 100).toFixed(0)}%`}
              {hud.c4.planted && hud.planting <= 0.1 && hud.defusing <= 0.1 && `C4 已安放 · 剩余 ${hud.c4.timer.toFixed(1)}s`}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Engine } from './game/engine';
import { WALLS, SITE_A, SITE_B } from './game/map';
import type { HudState } from './game/types';

const INIT: HudState = {
  hp: 100, armor: 0, mag: 0, reserve: 0, weapon: '', slot: '',
  round: 1, scoreCT: 0, scoreT: 0, phase: '准备中', bomb: '',
  scoped: false, dead: false, kills: [], c4x: null, c4z: null,
  actors: [], msg: '',
};

function Minimap({ hud }: { hud: HudState }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    if (!g) return;
    const S = 168 / 64;
    g.clearRect(0, 0, 168, 168);
    g.fillStyle = '#1c2230';
    g.fillRect(0, 0, 168, 168);
    g.fillStyle = '#3a4358';
    for (const w of WALLS) {
      const x = Math.min(w.x1, w.x2) * S, z = Math.min(w.z1, w.z2) * S;
      const ww = Math.max(Math.abs(w.x2 - w.x1) * S, 1.5);
      const hh = Math.max(Math.abs(w.z2 - w.z1) * S, 1.5);
      g.fillRect(x, z, ww, hh);
    }
    g.strokeStyle = '#3fae5f';
    g.strokeRect(SITE_A.x1 * S, SITE_A.z1 * S, (SITE_A.x2 - SITE_A.x1) * S, (SITE_A.z2 - SITE_A.z1) * S);
    g.strokeRect(SITE_B.x1 * S, SITE_B.z1 * S, (SITE_B.x2 - SITE_B.x1) * S, (SITE_B.z2 - SITE_B.z1) * S);
    g.fillStyle = '#3fae5f';
    g.font = '9px sans-serif';
    g.fillText('A', SITE_A.x1 * S + 2, SITE_A.z1 * S + 10);
    g.fillText('B', SITE_B.x1 * S + 2, SITE_B.z1 * S + 10);
    if (hud.c4x !== null && hud.c4z !== null) {
      g.fillStyle = '#ffcf3f';
      g.beginPath();
      g.arc(hud.c4x * S, hud.c4z * S, 4, 0, Math.PI * 2);
      g.fill();
    }
    for (const a of hud.actors) {
      if (!a.seen) continue;
      g.fillStyle = a.me ? '#ffffff' : a.team === 'CT' ? '#4da3ff' : '#ff5f4d';
      g.beginPath();
      g.arc(a.x * S, a.z * S, a.me ? 3.4 : 2.6, 0, Math.PI * 2);
      g.fill();
    }
  }, [hud]);
  return <canvas ref={ref} width={168} height={168} />;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState<HudState>(INIT);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || !canvasRef.current) return;
    const eng = new Engine(canvasRef.current, setHud);
    return () => eng.destroy();
  }, [started]);

  if (!started) {
    return (
      <div className="menu">
        <h1>Dust2 5v5 原型</h1>
        <p>第一回合为手枪局。你出生在 CT 阵营，带 USP。按 E 在包点下包 / 拆包（T 阵营接管后可用）。</p>
        <p className="keys">WASD 移动 · 空格 跳跃 · 鼠标 视角 · 左键 开火 · 右键 AWP 开镜 · 1/2/3 切换武器 · R 换弹 · E 交互</p>
        <button onClick={() => setStarted(true)}>进入战场</button>
      </div>
    );
  }

  return (
    <div className="wrap">
      <canvas ref={canvasRef} className="game" />
      {hud.scoped && <div className="scope" />}
      {!hud.scoped && <div className="cross">+</div>}
      <div className="top-left">
        <div className="score">CT {hud.scoreCT} : {hud.scoreT} T</div>
        <div className="phase">回合 {hud.round} · {hud.phase}</div>
        {hud.msg && <div className="msg">{hud.msg}</div>}
        {hud.dead && <div className="dead">你已阵亡 · 已切换视角</div>}
      </div>
      <div className="top-right">
        <Minimap hud={hud} />
        <div className="kills">
          {hud.kills.map((k, i) => (
            <div key={i} className="kill">
              <span className="k">{k.killer}</span>
              <span className="w"> [{k.weapon}{k.headshot ? ' 爆头' : ''}] </span>
              <span className="v">{k.victim}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-left">
        <div className="hp">生命 {hud.hp} · 护甲 {hud.armor}</div>
        <div className="ammo">{hud.weapon} {hud.mag === Infinity ? '--' : hud.mag} / {hud.reserve === Infinity ? '--' : hud.reserve}</div>
        {hud.bomb && <div className="bomb">{hud.bomb}</div>}
      </div>
      <div className="bottom-right">点击画面锁定鼠标后操作</div>
    </div>
  );
}

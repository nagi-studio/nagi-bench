import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Game, type HUDState } from './game';
import './style.css';

const initial: HUDState = {
  health: 100, armor: 100, ammo: 12, reserve: 48, weapon: 'USP-S', weaponKind: 'pistol',
  round: 1, roundTime: 115, phase: '准备中', team: 'CT', controlledName: 'YOU', alive: true,
  bomb: 'T 已持包', bombTimer: 0, feed: [], players: [], message: '点击进入战场', scope: false, bombPoint: { x: 50, z: 9 },
  minimap: [], visibleEnemies: [], crosshair: 0, objective: '阻止 T 安放 C4', reload: 0,
};

export default function App() {
  const mount = useRef<HTMLDivElement>(null);
  const game = useRef<Game | null>(null);
  const [hud, setHud] = useState<HUDState>(initial);

  useEffect(() => {
    if (!mount.current) return;
    const instance = new Game(mount.current, setHud);
    game.current = instance;
    return () => instance.dispose();
  }, []);

  const enter = () => game.current?.lock();
  return <main onClick={enter}>
    <div ref={mount} className="viewport" />
    <div className={`overlay ${hud.scope ? 'scoped' : ''}`}>
      {hud.scope && <div className="scope"><i /><b /><em /></div>}
      <div className="topbar">
        <div className="brand">DUST//PROTOCOL <span>PROCEDURAL ARENA</span></div>
        <div className="round"><strong>ROUND {hud.round}</strong><span>{formatTime(hud.roundTime)}</span><small>{hud.phase}</small></div>
        <div className="feed">{hud.feed.map((x, i) => <div key={`${x.text}${i}`} className={x.team}>{x.text}</div>)}</div>
      </div>
      <div className="radar">
        <div className="radar-title">DUST2 // TACTICAL MAP</div>
        <div className="radar-map">
          <span className="map-zone t">T SPAWN</span><span className="map-zone a">A SITE</span><span className="map-zone m">MID / DOORS</span><span className="map-zone b">B SITE</span><span className="map-zone c">CT SPAWN</span>
          {hud.minimap.map(p => <i key={p.id} className={`dot ${p.team.toLowerCase()} ${p.isSelf ? 'self' : ''}`} style={{ left: `${p.x}%`, top: `${p.z}%` }} />)}
          {hud.visibleEnemies.map(p => <i key={p.id} className="dot enemy" style={{ left: `${p.x}%`, top: `${p.z}%` }} />)}
          {hud.bombPoint && <i className="bomb-dot" style={{ left: `${hud.bombPoint.x}%`, top: `${hud.bombPoint.z}%` }}>C4</i>}
        </div>
      </div>
      <div className="objective"><b>OBJECTIVE</b><span>{hud.objective}</span>{hud.bombTimer > 0 && <progress max="40" value={hud.bombTimer} />}</div>
      <div className="crosshair" style={{ transform: `scale(${1 + hud.crosshair / 24})` }}><i /><i /><i /><i /></div>
      <div className="bottom">
        <div className="vitals"><div><small>HEALTH</small><b>{Math.max(0, hud.health)}</b></div><div><small>ARMOR</small><b>{hud.armor}</b></div></div>
        <div className="status"><span>{hud.controlledName}{!hud.alive && ' // SPECTATING'}</span><b>{hud.team}</b></div>
        <div className="weapon"><div className="ammo"><b>{hud.ammo}</b><span>/ {hud.reserve}</span></div><strong>{hud.weapon}</strong><small>{hud.reload ? 'RELOADING…' : hud.weaponKind.toUpperCase()}</small></div>
      </div>
      <div className="team-panel">{hud.players.map(p => <div className={`${p.team.toLowerCase()} ${!p.alive ? 'dead' : ''}`} key={p.id}><i />{p.name}<span>{p.hp}</span></div>)}</div>
      <div className="help">CLICK: LOCK AIM &nbsp; · &nbsp; WASD MOVE &nbsp; SPACE JUMP &nbsp; LMB FIRE &nbsp; RMB SCOPE &nbsp; R RELOAD &nbsp; 1 / 2 / 3 SWITCH &nbsp; 4 AWP &nbsp; 5 DEAGLE &nbsp; E PLANT / DEFUSE &nbsp; Q TAKE OVER</div>
      {hud.message && <div className="message">{hud.message}</div>}
    </div>
  </main>;
}
function formatTime(seconds: number) { const s = Math.max(0, Math.ceil(seconds)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

createRoot(document.getElementById('root')!).render(<App />);

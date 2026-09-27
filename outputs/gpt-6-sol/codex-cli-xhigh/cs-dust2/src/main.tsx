import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GameEngine } from './engine';
import { A_SITE, B_SITE, ROOMS } from './map';
import type { Snapshot, Team, WeaponId } from './types';
import { WEAPONS } from './weapons';
import './style.css';

function clock(seconds: number) {
  const whole = Math.ceil(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function MiniMap({ data }: { data: Snapshot }) {
  return <div className="minimap panel">
    <div className="minimap-heading"><span className="eyebrow">TACTICAL MAP</span><span className="minimap-region">{data.region}</span></div>
    <svg className="map-svg" viewBox="-58 -54 104 96" preserveAspectRatio="xMidYMid meet" aria-label="Dust2 小地图">
      <defs><pattern id="mapGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="#b9a988" strokeOpacity=".07" strokeWidth=".25" /></pattern></defs>
      {ROOMS.map((r, i) => <rect key={i} x={r.x1} y={r.z1} width={r.x2-r.x1} height={r.z2-r.z1} className="map-room" />)}
      <rect x="-58" y="-54" width="104" height="96" fill="url(#mapGrid)" />
      <circle cx={A_SITE.x} cy={A_SITE.z} r="6" className="map-site" /><text x={A_SITE.x} y={A_SITE.z+1.7} className="map-letter">A</text>
      <circle cx={B_SITE.x} cy={B_SITE.z} r="6" className="map-site" /><text x={B_SITE.x} y={B_SITE.z+1.7} className="map-letter">B</text>
      <text x="-47" y="-42" className="map-route">LONG</text><text x="-2" y="16" className="map-route">MID</text>
      <text x="-37" y="-16" className="map-route">TUNNELS</text><text x="7" y="-18" className="map-route">CAT</text>
      {data.bomb.mode !== 'none' && <g transform={`translate(${data.bomb.x} ${data.bomb.z})`}>
        <circle r="3.8" className="map-bomb-ring" /><rect x="-1.3" y="-1.3" width="2.6" height="2.6" className="map-bomb" transform="rotate(45)" />
      </g>}
      {data.actors.filter(a => a.alive && a.visible).map(a => <g key={a.id} transform={`translate(${a.x} ${a.z})`}>
        {a.controlled && <circle r="3.1" className="map-self-ring" />}
        <circle r={a.controlled ? 1.7 : 1.45} className={a.team === 'T' ? 'map-player-t' : 'map-player-ct'} />
      </g>)}
    </svg>
    <div className="map-legend"><span><i className="legend-self" />你</span><span><i className={data.team === 'T' ? 'legend-t' : 'legend-ct'} />队友</span><span><i className={data.team === 'T' ? 'legend-ct' : 'legend-t'} />已发现敌人</span><span><i className="legend-bomb" />C4</span></div>
  </div>;
}

function App() {
  const mount = useRef<HTMLDivElement>(null);
  const engine = useRef<GameEngine | null>(null);
  const [data, setData] = useState<Snapshot | null>(null);
  const [team, setTeam] = useState<Team>('T');
  const [mode, setMode] = useState<'pistol' | 'full'>('pistol');
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    if (!mount.current) return;
    const game = new GameEngine(mount.current, setData);
    engine.current = game;
    const buyHandler = (e: Event) => setBuyOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener('dust-buy', buyHandler);
    return () => { window.removeEventListener('dust-buy', buyHandler); game.dispose(); engine.current = null; };
  }, []);

  const start = () => engine.current?.start(mode, team);
  const aliveTeam = data?.team === 'T' ? data?.tAlive : data?.ctAlive;
  const deadTeam = data?.team === 'T' ? data?.ctAlive : data?.tAlive;
  const weaponIsKnife = data?.weapon === 'knife';

  return <div className="app">
    <div ref={mount} className="game-canvas" />
    {data && data.phase !== 'menu' && <div className="hud">
      <MiniMap data={data} />
      <div className="scoreboard panel">
        <div className="team-score t"><span className="team-label">TERRORISTS</span><b>{data.scoreT}</b><small>{data.tAlive} ALIVE</small></div>
        <div className="round-center"><span>ROUND {String(data.round).padStart(2, '0')}</span><strong className={data.bomb.mode === 'planted' ? 'danger-time' : ''}>{data.bomb.mode === 'planted' ? clock(data.bomb.timer) : clock(data.time)}</strong><span>{data.mode === 'pistol' ? 'PISTOL ROUND' : 'FULL BUY'}</span></div>
        <div className="team-score ct"><span className="team-label">CT FORCES</span><b>{data.scoreCT}</b><small>{data.ctAlive} ALIVE</small></div>
      </div>
      <div className="right-top">
        <div className="status-chip"><span className="status-dot" /> {data.bomb.mode === 'planted' ? `C4 已安放 · ${data.bomb.site} 点` : data.bomb.mode === 'dropped' ? 'C4 已掉落' : data.bomb.mode === 'carried' ? 'C4 移动中' : 'C4 已拆除'}</div>
        <div className="killfeed">{data.feed.map(item => <div className="kill-item" key={item.id}><span className={item.team === 'T' ? 'text-t' : 'text-ct'}>{item.killer}</span><span className="kill-weapon">{item.weapon}{item.headshot ? ' ✦' : ''}</span><span>{item.victim}</span></div>)}</div>
      </div>
      {!data.scoped && <div className="crosshair" style={{ '--gap': `${Math.min(18, 5 + data.spread * 170)}px` } as React.CSSProperties}><i className="cross top"/><i className="cross bottom"/><i className="cross left"/><i className="cross right"/><i className="cross dot"/></div>}
      {data.scoped && <div className="scope-overlay"><div className="scope-circle"><i className="scope-h"/><i className="scope-v"/><span className="scope-center"/></div></div>}
      {data.action && <div className="action-prompt"><b>{data.action}</b>{data.actionProgress > 0 && <div className="action-track"><i style={{ width: `${Math.min(100, data.actionProgress / (data.action.includes('拆除') ? 5 : 3) * 100)}%` }} /></div>}</div>}
      <div className="bottom-left panel"><div className="health"><span className="metric-icon">＋</span><div><small>HEALTH</small><strong>{data.hp}</strong></div></div><div className="health"><span className="metric-icon armor-icon">◇</span><div><small>ARMOR</small><strong>{data.armor}</strong></div></div></div>
      <div className="bottom-center"><div className="squad-count"><span>{aliveTeam} ALLIES</span><i /> <span>{deadTeam} ENEMIES</span></div><div className="controls-note">WASD 移动 · SPACE 跳跃 · R 换弹 · 1/2/3 切枪 · E 互动{data.mode === 'full' ? ' · B 武器库' : ''}</div></div>
      <div className="ammo-panel panel"><div className="ammo-top"><span className="eyebrow">EQUIPPED / {data.weapon === 'knife' ? 'MELEE' : data.weapon === 'glock' || data.weapon === 'usp' || data.weapon === 'deagle' ? 'SECONDARY' : 'PRIMARY'}</span><span className="weapon-id">{data.weapon.toUpperCase()}</span></div><div className="weapon-name">{data.weaponName}</div><div className="ammo-row"><strong>{weaponIsKnife ? '∞' : String(data.ammo).padStart(2, '0')}</strong><span>{weaponIsKnife ? '近战' : `/ ${data.reserve}`}</span></div>{data.reloading && <div className="reload-label">正在换弹...</div>}</div>
      {data.spectating && data.phase === 'live' && <div className="spectator-banner"><span>观战 {data.name}</span><b>SPACE 切换队友　·　F 接管操控</b></div>}
      {data.phase === 'ended' && <div className="round-banner"><span>ROUND COMPLETE</span><strong>{data.message}</strong><small>下一回合即将开始</small></div>}
      {!data.pointerLocked && data.phase === 'live' && !buyOpen && <div className="pause-tip">点击画面锁定鼠标并继续游戏</div>}
    </div>}
    {data?.phase === 'menu' && <div className="menu-screen">
      <div className="menu-grid" />
      <div className="menu-content">
        <div className="menu-overline"><span className="live-dot"/> TACTICAL SHOOTER PROTOTYPE <span className="menu-version">BUILD 01 / PROCEDURAL</span></div>
        <div className="hero-kicker">5 V 5 · FIRST PERSON COMBAT</div>
        <h1>DUST<span>II</span></h1>
        <p className="hero-description">经典沙漠战场，完整双包点路线。十名战斗员、真实遮挡交火与 C4 攻防，在浏览器里即时展开。</p>
        <div className="menu-selection"><div><label>选择阵营</label><div className="segmented"><button className={team === 'T' ? 'selected t-option' : ''} onClick={() => setTeam('T')}>T 恐怖分子</button><button className={team === 'CT' ? 'selected ct-option' : ''} onClick={() => setTeam('CT')}>CT 反恐精英</button></div></div><div><label>回合配置</label><div className="segmented"><button className={mode === 'pistol' ? 'selected' : ''} onClick={() => setMode('pistol')}>手枪局</button><button className={mode === 'full' ? 'selected' : ''} onClick={() => setMode('full')}>完整武装</button></div></div></div>
        <button className="deploy-button" onClick={start}><span>部署至战场</span><strong>→</strong></button>
        <div className="menu-footer"><span>无需下载资产 · 程序化 3D 地图与音效</span><span>WASD / 鼠标 / E / R / 1-3</span></div>
      </div>
      <div className="menu-aside"><span>MISSION BRIEFING</span><strong>DE_DUST2</strong><p>T 方：突破防线，在 A 或 B 点安放 C4。<br/>CT 方：守住包点，拆除已安放的 C4。</p><div className="brief-line"/><div>地图区域<span>09 / CONNECTED</span></div><div>对战编制<span>05 VS 05</span></div><div>回合时长<span>02:10</span></div></div>
    </div>}
    {buyOpen && data?.phase === 'live' && <div className="buy-screen"><div className="buy-panel"><div className="buy-head"><span>FIELD ARMORY</span><button onClick={() => { setBuyOpen(false); engine.current?.closeBuy(); }}>关闭 ×</button></div><h2>选择武器</h2><p>原型武器库：可在完整武装模式中随时更换，便于体验不同手感。</p><div className="buy-grid">{(['ak','m4','awp','glock','usp','deagle'] as WeaponId[]).map(id => <button key={id} onClick={() => { engine.current?.buyWeapon(id); setBuyOpen(false); engine.current?.closeBuy(); }}><span>{WEAPONS[id].slot === 'primary' ? '主武器' : '副武器'}</span><strong>{WEAPONS[id].name}</strong><small>{WEAPONS[id].magazine} 发弹匣 · {WEAPONS[id].damage} 基础伤害</small></button>)}</div></div></div>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);

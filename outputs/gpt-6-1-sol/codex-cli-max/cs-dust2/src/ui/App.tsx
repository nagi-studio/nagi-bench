import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Engine, DEFAULT_SETTINGS } from '../game/engine';
import type { Settings, Snapshot, Team } from '../game/types';
import { WEAPONS } from '../game/weapons';
import { Icon, Mark, WeaponIcon } from './Icons';
import Minimap from './Minimap';

declare global { interface Window { __DUST__?: Engine } }
const timeLabel = (seconds: number) => `${Math.floor(Math.ceil(seconds) / 60)}:${String(Math.ceil(seconds) % 60).padStart(2, '0')}`;
function savedSettings(): Settings {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('dust-settings') || '{}') }; } catch { return { ...DEFAULT_SETTINGS }; }
}
const CONTROLS = [['W A S D', '移动'], ['鼠标', '观察 / 瞄准'], ['鼠标左键', '射击 / 挥刀'], ['鼠标右键', 'AWP 开镜'], ['SPACE', '跳跃'], ['SHIFT', '缓慢移动'], ['1 / 2 / 3', '主武器 / 手枪 / 刀'], ['滚轮 / Q', '切换武器'], ['R', '换弹'], ['长按 E', '安放 / 拆除 C4'], ['E · 阵亡后', '接管存活队友'], ['[ / ]', '切换观战队友'], ['TAB', '查看记分板'], ['ESC', '暂停 / 释放鼠标']];

export default function App() {
  const viewport = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!viewport.current) return;
    let game: Engine;
    try { game = new Engine(viewport.current); setEngine(game); if (import.meta.env.DEV) window.__DUST__ = game; }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); return; }
    return () => { game.dispose(); delete window.__DUST__; };
  }, []);
  return <main className="app"><div ref={viewport} className="viewport" />{engine ? <Interface game={engine} /> : <div className="loading-screen"><Mark /><span>{error ? '无法初始化 3D 画面' : 'BUILDING THE BATTLEFIELD'}</span>{error && <p>{error}<br/>请使用支持 WebGL 2 的桌面浏览器。</p>}</div>}</main>;
}
function Interface({ game }: { game: Engine }) {
  const s = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const [settings, setSettings] = useState<Settings>(savedSettings);
  const [manual, setManual] = useState(false);
  const [scoreboard, setScoreboard] = useState(false);
  useEffect(() => { try { localStorage.setItem('dust-settings', JSON.stringify(settings)); } catch { /* Storage is optional. */ } }, [settings]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.code === 'Tab' && s.started) { e.preventDefault(); setScoreboard(true); } };
    const up = (e: KeyboardEvent) => { if (e.code === 'Tab' || e.code === 'Escape') setScoreboard(false); };
    const blur = () => setScoreboard(false);
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [s.started]);
  if (!s.started) return <div className="briefing">
    <header className="main-nav"><a className="brand" href="#" onClick={e => { e.preventDefault(); setManual(false); }}><Mark /><span>DUST<span className="brand-two">II</span><small>FIELD OPERATIONS</small></span></a><nav><button className={!manual ? 'active' : ''} onClick={() => setManual(false)}>行动简报<span>BRIEFING</span></button><button className={manual ? 'active' : ''} onClick={() => setManual(true)}>操作手册<span>FIELD MANUAL</span></button></nav><div className="connection"><i /> LOCAL SESSION <span>V.01</span></div></header>
    <div className="briefing-main"><section className={`hero ${manual ? 'manual-hero' : ''}`}>
      <div className="eyebrow"><span className="tiny-line"/> 5V5 TACTICAL EXPERIENCE</div>
      {manual ? <><h1 className="manual-title">掌握每一个<br/><em>战术细节。</em></h1><div className="manual-controls">{CONTROLS.map(([key, label]) => <div key={key}><kbd>{key}</kbd><span>{label}</span></div>)}</div><p className="manual-note">爆头造成胸部伤害的 2 倍；护甲可吸收部分伤害。持包者阵亡后，其他 T 可靠近拾取 C4。安放需 3.2 秒，全装拆包需 5 秒，手枪局需 10 秒。</p></> : <><div className="hero-map-label">DE_DUST2 <span>32° 25′ N &nbsp; 03° 42′ E</span></div><h1>DUST<span>II</span><span className="title-outline">FIELD OPS.</span></h1><p className="hero-line">每一个转角，都是新的战场。</p><p className="hero-description">重返烈日下的经典战场。穿过中门，控制猫道，<br className="desktop-br"/>与小队一起夺取下一个决定胜负的角落。</p><div className="hero-metrics"><div><strong>5 <span>vs</span> 5</strong><small>战术小队</small></div><div><strong>02</strong><small>爆破目标</small></div><div><strong>115<span>s</span></strong><small>每回合时限</small></div></div><div className="field-tag"><Icon name="sun" size={16}/><span>DUST II, NORTH AFRICA</span><i/> CLEAR · 34°C</div></>}
    </section>
    <aside className="deployment-panel"><div className="panel-top"><span><i/> OPERATION / 01</span><Icon name="target" size={18}/></div><div className="map-heading"><h2>行动区域</h2><span>DUST II</span></div><div className="briefing-map-wrap"><Minimap game={game} snapshot={s} briefing/><span className="map-scale">0 ━━ 20 m</span><span className="map-caption">BOMB DEFUSAL / ACTIVE DUTY</span></div>
      <div className="setup-section"><div className="section-label"><span>01</span> 选择阵营 <small>YOUR SIDE</small></div><div className="team-options"><button aria-pressed={settings.team === 'CT'} className={settings.team === 'CT' ? 'selected ct-choice' : ''} onClick={() => setSettings(v => ({ ...v, team: 'CT', primary: 'm4a4' }))}><Icon name="shield"/><span>反恐精英<small>COUNTER-TERRORISTS</small></span>{settings.team === 'CT' && <span className="selection-dot"/>}</button><button aria-pressed={settings.team === 'T'} className={settings.team === 'T' ? 'selected t-choice' : ''} onClick={() => setSettings(v => ({ ...v, team: 'T', primary: 'ak47' }))}><Icon name="target"/><span>恐怖分子<small>TERRORISTS</small></span>{settings.team === 'T' && <span className="selection-dot"/>}</button></div></div>
      <div className="setup-section"><div className="section-label"><span>02</span> 开局模式 <small>ROUND TYPE</small></div><div className="mode-options"><button aria-pressed={!settings.pistolOpening} className={!settings.pistolOpening ? 'selected' : ''} onClick={() => setSettings(v => ({ ...v, pistolOpening: false }))}>全装对抗 <small>FULL LOADOUT</small></button><button aria-pressed={settings.pistolOpening} className={settings.pistolOpening ? 'selected' : ''} onClick={() => setSettings(v => ({ ...v, pistolOpening: true }))}>手枪开局 <small>PISTOL ROUND</small></button></div></div>
      <div className="loadout-row"><div><label htmlFor="primary">主武器</label><select id="primary" value={settings.primary} disabled={settings.pistolOpening} onChange={e => setSettings(v => ({ ...v, primary: e.target.value as Settings['primary'] }))}><option value="m4a4">M4A4</option><option value="ak47">AK-47</option><option value="awp">AWP</option></select></div><div><label htmlFor="sidearm">副武器</label><select id="sidearm" value={settings.sidearm} disabled={settings.pistolOpening} onChange={e => setSettings(v => ({ ...v, sidearm: e.target.value as Settings['sidearm'] }))}><option value="default">{settings.team === 'CT' ? 'USP-S' : 'GLOCK-18'}</option><option value="deagle">DESERT EAGLE</option></select></div></div>
      <p className="loadout-note">{settings.pistolOpening ? '首回合全员仅默认手枪、无护甲；次回合恢复全装。' : '100 生命 · 100 护甲 · 主副武器 · 战术刀'}</p>
      <button className="deploy-button" onClick={() => game.start(settings)}><span>进入战场<small>DEPLOY TO DUST II</small></span><Icon name="arrow" size={25}/></button><div className="deployment-foot"><i/> 1 名玩家 + 9 名 AI <span>点击后锁定鼠标</span></div>
    </aside></div><footer className="briefing-footer"><span><i/> ALL OPERATORS READY</span><span>控制路线。相信队友。完成目标。</span><span>DESKTOP EXPERIENCE <kbd>WASD</kbd> <Icon name="target" size={14}/></span></footer>
  </div>;
  return <>
    <HUD game={game} s={s}/>
    {scoreboard && !s.paused && <Scoreboard s={s}/>}
    {s.paused && <div className="pause-overlay"><div className="pause-panel"><div className="pause-eyebrow"><Mark small/> FIELD OPERATIONS <span>PAUSED</span></div><h2>稍作停留。<br/><em>战场等你归来。</em></h2><p>模拟已暂停。继续后将重新锁定鼠标。</p><button className="deploy-button" onClick={() => game.resume()}><span>继续行动<small>BACK TO THE FIELD</small></span><Icon name="arrow" size={24}/></button><div className="pause-settings"><label><Icon name="target" size={17}/>鼠标灵敏度 <input aria-label="鼠标灵敏度" type="range" min="0.3" max="2" step="0.1" value={settings.sensitivity} onChange={e => { const v = { ...settings, sensitivity: Number(e.target.value) }; setSettings(v); game.updateSettings(v); }}/><span>{settings.sensitivity.toFixed(1)}</span></label><label><Icon name="volume" size={17}/>主音量 <input aria-label="主音量" type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={e => { const v = { ...settings, volume: Number(e.target.value) }; setSettings(v); game.updateSettings(v); }}/><span>{Math.round(settings.volume * 100)}%</span></label></div><div className="pause-controls">{CONTROLS.slice(0, 10).map(([key, label]) => <div key={key}><kbd>{key}</kbd><span>{label}</span></div>)}</div><button className="restart-button" onClick={() => game.restartRound()}>重新开始本局 <span>↻</span></button><button className="briefing-return" onClick={() => { game.returnToMenu(); setScoreboard(false); }}>返回行动简报</button></div></div>}
  </>;
}

function HUD({ game, s }: { game: Engine; s: Snapshot }) {
  const p = s.player, w = WEAPONS[p.weapon];
  return <div className="hud">
    <div className="damage-vignette" style={{ opacity: s.hurt * 1.7 }}/>
    <section className="radar-panel"><div className="radar-title"><span className="radar-dot"/>{p.zone}<span className="radar-level">DUST II</span></div><Minimap game={game} snapshot={s}/><div className="radar-bottom"><span className={s.team === 'CT' ? 'ct-text' : 't-text'}>{s.team === 'CT' ? '反恐精英' : '恐怖分子'}</span><span>▲ 你 &nbsp; ● 队友</span></div></section>
    <section className="match-header"><div className="match-meta">DUST II <span>/</span> ROUND {String(s.round).padStart(2, '0')} <span>/</span> {s.pistol ? 'PISTOL ROUND' : 'BOMB DEFUSAL'}</div><div className="match-status"><TeamStatus team="CT" actors={s.actors}/><div className="team-score ct-text">{String(s.scoreCT).padStart(2, '0')}</div><div className={`round-clock ${s.bomb.state === 'planted' ? 'bomb-clock' : ''}`}><span>{s.bomb.state === 'planted' ? <><Icon name="bomb" size={12}/> C4 ACTIVE</> : s.phase === 'freeze' ? 'PREPARE' : s.phase === 'over' ? 'NEXT ROUND' : 'ROUND TIME'}</span><strong>{timeLabel(s.timer)}</strong></div><div className="team-score t-text">{String(s.scoreT).padStart(2, '0')}</div><TeamStatus team="T" actors={s.actors}/></div></section>
    <div className="hud-top-right"><span className="live-indicator"><i/> LIVE EXERCISE</span><span>{s.fps} FPS</span></div>
    <section className="killfeed" aria-label="实时击杀播报">{s.feed.map(f => <div key={f.id} className={f.player ? 'feed-row involved' : 'feed-row'}><b className={f.team === 'CT' ? 'ct-text' : 't-text'}>{f.killer}</b>{f.weapon === 'c4' ? <Icon name="bomb" size={18}/> : <WeaponIcon id={f.weapon}/>} {f.headshot && <Icon name="head" size={15}/>}<span className={f.team === 'CT' ? 't-text' : 'ct-text'}>{f.victim}</span></div>)}</section>
    {p.scoped ? <div className="scope"><div className="scope-ring"><div className="scope-h"/><div className="scope-v"/><div className="scope-dot"/><span>10 × 42</span><small>RANGE &nbsp; 100 m</small></div></div> : <div className={`crosshair ${p.weapon === 'awp' ? 'sniper-crosshair' : ''}`} style={{ '--spread': `${6 + p.spread}px` } as React.CSSProperties}><i className="cross-top"/><i className="cross-bottom"/><i className="cross-left"/><i className="cross-right"/><b/></div>}
    {s.hitMarker > 0 && <div className={`hit-marker ${s.headshot ? 'headshot' : ''}`}><svg width="34" height="34" viewBox="0 0 34 34"><path d="m5 5 7 7m10 10 7 7M5 29l7-7M22 12l7-7" stroke="currentColor" strokeWidth="2.5"/></svg>{s.headshot && <span>HEADSHOT</span>}</div>}
    {s.phase === 'freeze' && <div className="freeze-banner"><span>ROUND {String(s.round).padStart(2, '0')}</span><h2>{s.pistol ? '手枪局' : s.team === 'CT' ? '守住阵地。' : '夺取目标。'}</h2><p>{s.pistol ? '全员默认手枪 · 无主武器 · 无护甲' : s.team === 'CT' ? '阻止安放 C4，或在爆炸前完成拆除。' : '掩护持包队友，在 A 或 B 点安放 C4。'}</p><b>{Math.ceil(s.timer)}</b></div>}
    {s.phase === 'over' && <div className={`round-result ${s.winner === 'CT' ? 'ct-result' : ''}`}><Icon name={s.winner === 'CT' ? 'shield' : 'target'} size={28}/><span>ROUND {String(s.round).padStart(2, '0')} COMPLETE</span><h2>{s.winner === 'CT' ? '反恐精英获胜' : '恐怖分子获胜'}</h2><p>{s.reason}</p><small>下一回合 {Math.ceil(s.timer)}s</small></div>}
    {s.action && <div className="action-progress"><Icon name="bomb" size={22}/><span>{s.action.label}<small>保持按住 E</small></span><strong>{Math.round(s.action.progress * 100)}%</strong><div><i style={{ width: `${s.action.progress * 100}%` }}/></div></div>}
    {s.spectating && s.phase === 'live' && <div className="spectator"><span>OPERATOR DOWN</span><h3>正在观战 <b>{p.name}</b></h3><p><kbd>[</kbd><kbd>]</kbd> 切换队友 <i/> <kbd>E</kbd> 接管存活队友</p></div>}
    {s.hint && !s.action && !s.spectating && <div className="interaction-hint"><Icon name="bomb" size={16}/>{s.hint}</div>}
    <section className="vitals"><div className={`health ${p.hp < 30 ? 'low-health' : ''}`}><div className="vital-icon"><Icon name="cross" size={24}/></div><strong>{String(p.hp).padStart(3, '0')}</strong><span>HEALTH<small><i style={{ width: `${p.hp}%` }}/></small></span></div><div className="armor"><Icon name="shield" size={20}/><strong>{p.armor}</strong><span>ARMOR{!s.pistol && s.team === 'CT' && <small>+ DEFUSE KIT</small>}</span></div></section>
    <section className="equipment">{([{ slot: 'primary', id: p.primary, key: '1' }, { slot: 'secondary', id: p.secondary, key: '2' }, { slot: 'melee', id: 'knife', key: '3' }] as const).map(item => <div key={item.slot} className={`equipment-slot ${p.slot === item.slot ? 'equipped' : ''} ${!item.id ? 'empty-slot' : ''}`}><kbd>{item.key}</kbd>{item.id ? <WeaponIcon id={item.id}/> : <span>NO PRIMARY</span>}<small>{item.id ? WEAPONS[item.id].name : '—'}</small></div>)}{p.hasBomb && <div className="c4-slot"><Icon name="bomb" size={25}/><span>C4</span></div>}</section>
    <section className="ammo-panel"><div className="weapon-title"><span>{w.label}</span><b>{w.name}</b></div><div className="ammo-count">{p.weapon === 'knife' ? <strong className="knife-label">MELEE</strong> : <><strong className={p.mag === 0 ? 'empty-mag' : ''}>{String(p.mag).padStart(2, '0')}</strong><i>/</i><span>{String(p.reserve).padStart(3, '0')}</span></>}</div><div className="ammo-meta"><span>{p.reloading ? 'RELOADING' : w.category === 'knife' ? 'CLOSE QUARTERS' : w.automatic ? 'FULL AUTO' : 'SEMI AUTO'}</span><span>{p.reloading ? `${Math.round(p.reloadProgress * 100)}%` : <><kbd>R</kbd> 换弹</>}</span></div><div className="ammo-line"><i style={{ width: `${p.reloading ? p.reloadProgress * 100 : p.weapon === 'knife' ? 100 : p.mag / w.magazine * 100}%` }}/></div></section>
    <div className="hud-bottom"><span><i/> LOCAL SERVER <b>0 ms</b></span><span><kbd>WASD</kbd> 移动 <kbd>SPACE</kbd> 跳跃 <kbd>TAB</kbd> 战绩 <kbd>ESC</kbd> 暂停</span><span>FIELD OPERATIONS <Mark small/></span></div>
  </div>;
}
function TeamStatus({ team, actors }: { team: Team; actors: Snapshot['actors'] }) {
  const alive = actors.filter(a => a.team === team && a.alive).length;
  return <div className={`team-status team-${team.toLowerCase()}`}><span>{team === 'CT' ? 'CT' : 'T'} <b>{alive} ALIVE</b></span><div>{actors.filter(a => a.team === team).map(a => <i key={a.id} className={a.alive ? 'operator-alive' : 'operator-dead'}>{a.alive ? <svg viewBox="0 0 12 16"><circle cx="6" cy="4" r="3"/><path d="M1 9h10v7H1z"/></svg> : '×'}</i>)}</div></div>;
}
function Scoreboard({ s }: { s: Snapshot }) {
  return <div className="scoreboard-overlay"><div className="scoreboard"><div className="scoreboard-heading"><Mark small/><h2>DUST II <span>FIELD OPERATIONS</span></h2><span>ROUND {s.round}</span></div>{(['CT', 'T'] as const).map(team => <section key={team}><header className={team === 'CT' ? 'ct-text' : 't-text'}><Icon name={team === 'CT' ? 'shield' : 'target'} size={18}/><strong>{team === 'CT' ? '反恐精英' : '恐怖分子'}</strong><b>{team === 'CT' ? s.scoreCT : s.scoreT}</b></header><div className="scoreboard-cols"><span>OPERATOR</span><span>LOADOUT</span><span>HP</span><span>K</span><span>D</span></div>{s.actors.filter(a => a.team === team).sort((a, b) => b.kills - a.kills).map(a => <div className={`scoreboard-row ${!a.alive ? 'dead-row' : ''} ${a.id === s.player.id ? 'current-row' : ''}`} key={a.id}><span><i/>{a.name}{a.id === s.player.id && <small>VIEW</small>}</span><WeaponIcon id={a.weapon}/><span>{a.alive ? a.hp : <Icon name="skull" size={15}/>}</span><b>{a.kills}</b><span>{a.deaths}</span></div>)}</section>)}<footer>按住 TAB 查看战绩 · 阵亡后按 E 接管队友</footer></div></div>;
}

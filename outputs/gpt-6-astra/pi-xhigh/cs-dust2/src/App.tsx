import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/engine';
import { WEAPONS } from './game/weapons';
import type { Settings, Snapshot, Team, WeaponId } from './game/types';
import { Minimap } from './components/Minimap';
import { Arrow, BombIcon, Cross, GunIcon, Mark, Shield, Skull } from './components/Icons';
import './styles.css';

const DEFAULT: Settings = { team: 'T', pistol: true, primary: 'ak', secondary: 'glock', volume: .55, sensitivity: 1 };
const clock = (s: number) => { const t = Math.ceil(s); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
const weaponNotes: Record<WeaponId, string> = { ak: '高伤害 / 强后坐', m4: '高射速 / 精准压制', awp: '栓动狙击 / 右键开镜', glock: '20 发 / T 标配', usp: '12 发 / CT 标配', deagle: '7 发 / 高威力', knife: '近距离 / 高机动' };

function TeamSelect({ team, onChange }: { team: Team; onChange: (team: Team) => void }) {
  return <div className="team-select">
    <button className={`team-option t ${team === 'T' ? 'selected' : ''}`} onClick={() => onChange('T')}><span className="team-symbol">↗</span><span><strong>进攻方</strong><small>TERRORISTS</small></span><span className="radio" /></button>
    <button className={`team-option ct ${team === 'CT' ? 'selected' : ''}`} onClick={() => onChange('CT')}><Shield size={24} /><span><strong>防守方</strong><small>COUNTER-TERRORISTS</small></span><span className="radio" /></button>
  </div>;
}
function Loadout({ settings, setSettings }: { settings: Settings; setSettings: (settings: Settings) => void }) {
  return <>
    <div className="field-heading"><span>02 / 开局配置</span><span className="small-muted">ROUND PROTOCOL</span></div>
    <div className="mode-select"><button className={settings.pistol ? 'active' : ''} onClick={() => setSettings({ ...settings, pistol: true })}>手枪局 <span>CLASSIC</span></button><button className={!settings.pistol ? 'active' : ''} onClick={() => setSettings({ ...settings, pistol: false })}>全装局 <span>FULL BUY</span></button></div>
    {settings.pistol ? <div className="pistol-loadout"><GunIcon id={settings.team === 'T' ? 'glock' : 'usp'} /><div><strong>{settings.team === 'T' ? 'GLOCK-18' : 'USP-S'} <span>+ 战术刀</span></strong><p>全员默认手枪 · 无主武器 · 无护甲</p></div><span className="loadout-tag">R01</span></div> : <div className="weapon-grid">{(['ak', 'm4', 'awp'] as WeaponId[]).map(id => <button key={id} className={settings.primary === id ? 'selected' : ''} onClick={() => setSettings({ ...settings, primary: id })}><GunIcon id={id} /><strong>{WEAPONS[id].name}</strong><small>{weaponNotes[id]}</small></button>)}</div>}
    {!settings.pistol && <div className="secondary-choice"><span>副武器</span>{(['glock', 'usp', 'deagle'] as WeaponId[]).map(id => <button key={id} className={settings.secondary === id ? 'active' : ''} onClick={() => setSettings({ ...settings, secondary: id })}>{WEAPONS[id].name}</button>)}</div>}
  </>;
}
function Controls({ compact = false }: { compact?: boolean }) {
  return <div className={`control-list ${compact ? 'compact' : ''}`}>
    <span><kbd>W A S D</kbd> 移动</span><span><kbd>鼠标</kbd> 瞄准 / 开火</span><span><kbd>SPACE</kbd> 跳跃</span><span><kbd>SHIFT</kbd> 静步</span><span><kbd>R</kbd> 换弹</span><span><kbd>1 2 3</kbd> 切换武器</span><span><kbd>E</kbd> 下包 / 拆包</span><span><kbd>右键</kbd> AWP 开镜</span><span><kbd>V</kbd> 接管队友</span><span><kbd>TAB</kbd> 战绩</span>{!compact && <span><kbd>B</kbd> 出生点军械库</span>}
  </div>;
}
function Briefing({ settings, setSettings, deploy, help, setHelp }: { settings: Settings; setSettings: (settings: Settings) => void; deploy: () => void; help: boolean; setHelp: (value: boolean) => void }) {
  return <div className="briefing">
    <header className="topbar"><a className="brand" href="#" onClick={e => e.preventDefault()}><Mark /><span>DUSTLINE<span className="brand-sub">TACTICAL PROTOCOL</span></span></a><div className="top-nav"><span className="active">作战部署</span><button onClick={() => setHelp(!help)}>操作指南 <span>↗</span></button></div><div className="build-badge"><i /> SYSTEM ONLINE <span>BUILD 01.00</span></div></header>
    <main className="briefing-content">
      <section className="deployment">
        <div className="eyebrow"><span className="live-dot" /> FIELD OPERATIONS <span className="slash">/</span> SECTOR 02</div>
        <h1>DUST <span>II</span><span className="title-dot">.</span></h1>
        <div className="mission-subtitle"><span>沙尘之下，每一步都算数。</span><div className="tag">5 <span>VS</span> 5</div></div>
        <p className="mission-copy">经典双点爆破战场。选择阵营，与小队并肩推进。<br />零外部资产，纯程序化构建的第一人称战术体验。</p>
        <div className="deployment-panel">
          <div className="field-heading"><span>01 / 选择阵营</span><span className="small-muted">YOUR SIDE</span></div>
          <TeamSelect team={settings.team} onChange={team => setSettings({ ...settings, team, primary: team === 'T' ? 'ak' : 'm4', secondary: team === 'T' ? 'glock' : 'usp' })} />
          <Loadout settings={settings} setSettings={setSettings} />
          <div className="squad-status"><span className="squad-dots"><b /><b /><b /><b /><b /></span><span>你 + 4 名 AI 队友</span><span className="status-ready"><i /> READY</span></div>
          <button className="deploy-button" onClick={deploy}><span><small>ENTER THE FIELD</small>进入战场</span><Arrow size={30} /></button>
          <p className="pointer-note"><span>⌖</span> 点击后锁定鼠标 · ESC 暂停并释放光标</p>
        </div>
      </section>
      <aside className="recon-panel">
        <div className="recon-heading"><span><i /> LIVE RECON</span><span>36.8° N / 10.2° E</span></div>
        <div className="recon-map"><Minimap large /><span className="corner tl"/><span className="corner tr"/><span className="corner bl"/><span className="corner br"/></div>
        <div className="recon-footer"><div><strong>DUST II</strong><span>双目标爆破 / DE_DUST2</span></div><span className="map-version">02<span>SECTOR</span></span></div>
        <div className="mission-objectives"><span><BombIcon /> T <small>安放 C4，守住爆破点</small></span><span><Shield /> CT <small>阻止安放，及时拆除</small></span></div>
      </aside>
    </main>
    <div className="scene-caption"><span className="caption-line"/><div><small>PROCEDURAL ENVIRONMENT</small><strong>A LONG <span>/</span> 黄昏的长廊</strong></div><span className="scene-coordinate">+045 / −012</span></div>
    <footer className="briefing-footer"><span>NO ASSETS. JUST CODE.</span><div><span>WEBGL 2</span><i/><span>SPATIAL AUDIO</span><i/><span>60 HZ SIMULATION</span></div><button onClick={() => setHelp(true)}>查看操作指南 <Arrow size={15}/></button></footer>
  </div>;
}
function TeamStrip({ snapshot, team }: { snapshot: Snapshot; team: Team }) {
  return <div className={`team-strip ${team.toLowerCase()}`}>{snapshot.actors.filter(a => a.team === team).map(a => <div key={a.id} className={`operator ${a.alive ? '' : 'dead'} ${a.id === snapshot.playerId ? 'self' : ''}`} title={`${a.name} · ${a.hp} HP`}><span>{a.alive ? (team === 'CT' ? <Shield size={17}/> : <Mark size={19}/>) : <Skull size={16}/>}</span><i style={{ width: `${a.hp}%` }}/>{a.id === snapshot.playerId && <b>YOU</b>}</div>)}</div>;
}
function Scoreboard({ s, team }: { s: Snapshot; team: Team }) {
  return <div className="scoreboard"><div className="scoreboard-title"><div className="brand"><Mark/><span>DUSTLINE</span></div><span>DUST II / ROUND {String(s.round).padStart(2, '0')}</span></div>{(['T', 'CT'] as Team[]).map(t => <section key={t}><div className={`table-header ${t.toLowerCase()}`}><strong>{t === 'T' ? '进攻方' : '防守方'} <small>{t}</small></strong><span>{s.scores[t]}</span></div><div className="score-row labels"><span>OPERATOR</span><span>状态</span><span>K</span><span>D</span></div>{s.actors.filter(a => a.team === t).map(a => <div className={`score-row ${a.id === s.playerId ? 'current' : ''}`} key={a.id}><span>{a.name} {a.id === s.playerId && <small>YOU</small>}</span><span>{a.alive ? (a.team === team ? `${a.hp} HP` : 'ACTIVE') : 'KIA'}</span><span>{a.kills}</span><span>{a.deaths}</span></div>)}</section>)}<p>按住 TAB 查看 · 无友军伤害 · 阵亡后 V 接管存活队友</p></div>;
}
function Hud({ s, team, showScore, takeover }: { s: Snapshot; team: Team; showScore: boolean; takeover: () => void }) {
  const dead = s.hp <= 0, aliveTeammates = s.actors.filter(a => a.alive && a.team === team);
  return <div className={`hud ${dead ? 'is-dead' : ''}`}>
    <div className="hud-vignette"/>
    <div className="radar-panel"><div className="radar-heading"><span><i/> {s.location.replaceAll(' ', ' / ')}</span><span>⌖</span></div><Minimap snapshot={s} team={team}/><div className="radar-legend"><span><i className="friendly"/>友军</span><span><i className="enemy"/>目视敌人</span><span><i className="c4"/>C4</span></div></div>
    <div className="match-header"><TeamStrip snapshot={s} team="T"/><div className="match-score"><div><span className="t-color">{String(s.scores.T).padStart(2, '0')}</span><span className={`round-clock ${s.bomb.state === 'planted' ? 'danger' : ''}`}>{s.bomb.state === 'planted' ? <><BombIcon size={16}/>{clock(s.bomb.remaining)}</> : clock(s.timeLeft)}</span><span className="ct-color">{String(s.scores.CT).padStart(2, '0')}</span></div><small>ROUND {String(s.round).padStart(2, '0')} <span>/</span> 5V5</small></div><TeamStrip snapshot={s} team="CT"/></div>
    <div className="killfeed">{s.feed.map(f => <div className={f.killer === s.actors[s.playerId]?.name ? 'own-kill' : ''} key={f.id}><strong className={f.team === 'T' ? 't-color' : 'ct-color'}>{f.killer}</strong><span>{f.weapon}</span>{f.head && <span className="headshot">⌖</span>}<Skull size={13}/><strong className={f.team === 'T' ? 'ct-color' : 't-color'}>{f.victim}</strong></div>)}</div>
    {s.scoped && <div className="scope-overlay"><div className="scope-circle"><i className="scope-h"/><i className="scope-v"/><b/><span className="scope-distance">8× OPTICAL / AWP</span></div></div>}
    {!s.scoped && !dead && !s.result && <div className={`crosshair ${s.hit ? 'hit' : ''}`} style={{ '--gap': `${s.spread}px` } as React.CSSProperties}><i/><i/><i/><i/><b/></div>}
    {s.hit > 0 && <div className="hit-marker">×</div>}
    {s.hurt > 0 && <div className="damage-overlay" style={{ opacity: s.hurt }}/ >}
    {s.bomb.state === 'planted' && !s.result && <div className="bomb-alert"><span className="live-dot"/><BombIcon size={16}/><span>C4 已安放 / {s.bomb.site} 点</span><b>{s.bomb.remaining.toFixed(1)}s</b></div>}
    {s.bomb.progress > 0 && !s.result && <div className="interaction"><BombIcon size={24}/><div><span>{s.bomb.action}</span><div className="progress-track"><i style={{ width: `${s.bomb.progress * 100}%` }}/></div></div><b>{Math.round(s.bomb.progress * 100)}%</b></div>}
    {s.prompt && !s.result && !dead && <div className="interaction-prompt"><BombIcon size={15}/>{s.prompt}</div>}
    {s.result && <div className={`round-result ${s.result.winner === team ? 'win' : 'loss'}`}><div className="result-icon">{s.result.winner === 'CT' ? <Shield size={36}/> : <Mark size={42}/>}</div><small>ROUND {String(s.round).padStart(2, '0')} COMPLETE</small><h2>{s.result.winner === team ? '回合胜利' : '回合失利'}<span>{s.result.winner === 'T' ? 'TERRORISTS WIN' : 'COUNTER-TERRORISTS WIN'}</span></h2><p>{s.result.reason}</p><div className="round-countdown">下一回合 <b>{Math.ceil(s.nextRound)}</b></div></div>}
    {dead && !s.result && <div className="spectator"><Skull size={25}/><div><strong>你已阵亡 <span>观战模式</span></strong><p>{aliveTeammates.length ? '战斗还在继续。接管一名存活队友，重返战场。' : '小队已阵亡，等待回合结束。'}</p></div>{!!aliveTeammates.length && <button onClick={takeover}><kbd>V</kbd> 接管队友 <Arrow size={17}/></button>}</div>}
    <div className="bottom-hud">
      <div className="vitals"><div className={`health ${s.hp <= 30 ? 'low' : ''}`}><Cross size={21}/><strong>{Math.ceil(s.hp).toString().padStart(2, '0')}</strong><span>HEALTH</span></div><div className="armor"><Shield size={19}/><strong>{Math.ceil(s.armor).toString().padStart(2, '0')}</strong><span>ARMOR</span></div><div className="health-track"><i style={{ width: `${s.hp}%` }}/></div><div className="operator-label"><span className={team === 'T' ? 't-color' : 'ct-color'}>{team}</span> {s.actors[s.playerId]?.name} <span> / {s.kills} K</span></div></div>
      <div className="bottom-controls"><span><kbd>R</kbd> 换弹</span><span><kbd>1 2 3</kbd> 武器</span><span><kbd>E</kbd> 交互</span><span><kbd>ESC</kbd> 暂停</span>{s.buyAllowed && <span className="buy-hint"><kbd>B</kbd> 军械库</span>}</div>
      <div className="weapon-hud"><div className="weapon-current"><div className="weapon-name"><span>{WEAPONS[s.weapon].slot.toUpperCase()}</span><strong>{WEAPONS[s.weapon].name}</strong></div><GunIcon id={s.weapon}/></div><div className="ammo"><div className="ammo-bars">{Array.from({ length: Math.min(WEAPONS[s.weapon].magazine, 30) }, (_, i) => <i key={i} className={i < s.ammo ? 'filled' : ''}/>)}</div><strong className={s.ammo < 4 ? 'low' : ''}>{s.weapon === 'knife' ? '∞' : s.ammo.toString().padStart(2, '0')}</strong><span>/ {s.reserve.toString().padStart(2, '0')}</span></div>{s.reload > 0 && <div className="reload-status"><span>RELOADING</span><i style={{ width: `${s.reload * 100}%` }}/></div>}<div className="inventory-slots">{(['primary', 'secondary', 'melee'] as const).map((slot, i) => <div key={slot} className={`${s.inventory[slot]?.id === s.weapon ? 'selected' : ''} ${!s.inventory[slot] ? 'empty' : ''}`}><kbd>{i + 1}</kbd>{s.inventory[slot] ? WEAPONS[s.inventory[slot]!.id].name : '—'}</div>)}</div></div>
    </div>
    <div className="telemetry"><i/> {s.fps} FPS <span>LOCAL SIM / 60 TICK</span></div>
    {showScore && <div className="scoreboard-overlay"><Scoreboard s={s} team={team}/></div>}
  </div>;
}

export default function App() {
  const viewport = useRef<HTMLDivElement>(null), engine = useRef<GameEngine | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null), [settings, setSettings] = useState<Settings>(DEFAULT);
  const [error, setError] = useState(''), [help, setHelp] = useState(false), [showScore, setShowScore] = useState(false), [armory, setArmory] = useState(false);
  useEffect(() => {
    if (!viewport.current) return;
    try {
      const game = new GameEngine(viewport.current, setSnapshot); engine.current = game;
      if (import.meta.env.DEV) (window as Window & { dustline?: GameEngine }).dustline = game;
      return () => { game.dispose(); engine.current = null; delete (window as Window & { dustline?: GameEngine }).dustline; };
    } catch (e) { setError(e instanceof Error ? e.message : 'WebGL 初始化失败'); }
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (snapshot?.mode !== 'playing') return;
      if (e.code === 'Tab') { e.preventDefault(); setShowScore(true); }
      if (e.code === 'KeyB' && !e.repeat && snapshot.buyAllowed && snapshot.locked) { setArmory(true); engine.current?.pause(); }
      if (e.code === 'Escape') { setHelp(false); setArmory(false); setShowScore(false); }
    };
    const up = (e: KeyboardEvent) => { if (e.code === 'Tab') setShowScore(false); };
    const blur = () => setShowScore(false);
    document.addEventListener('keydown', down); document.addEventListener('keyup', up); window.addEventListener('blur', blur);
    return () => { document.removeEventListener('keydown', down); document.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
  }, [snapshot?.mode, snapshot?.buyAllowed, snapshot?.locked]);
  const playing = snapshot?.mode === 'playing';
  return <div className="app-shell">
    <div className="viewport" ref={viewport}/>
    {!playing && <Briefing settings={settings} setSettings={setSettings} deploy={() => { setHelp(false); engine.current?.start(settings); }} help={help} setHelp={setHelp}/ >}
    {playing && snapshot && <Hud s={snapshot} team={settings.team} showScore={showScore} takeover={() => engine.current?.takeover()}/ >}
    {playing && !snapshot?.locked && !armory && !help && <div className="modal-backdrop pause-backdrop"><section className="pause-panel"><div className="eyebrow"><Mark size={21}/> OPERATION ON HOLD</div><h2>战场已暂停<span>TAKE A BREATH.</span></h2><p>回合与 AI 已冻结，准备好后继续行动。</p><button className="deploy-button" onClick={() => engine.current?.lock()}><span>继续行动</span><Arrow/></button><div className="pause-actions"><button onClick={() => setHelp(true)}>操作与设置</button><button onClick={() => { engine.current?.menu(); setShowScore(false); }}>返回部署</button></div><Controls compact/></section></div>}
    {armory && <div className="modal-backdrop"><section className="armory-panel"><div className="field-heading"><span>FIELD ARMORY / 战地军械库</span><button className="close-button" onClick={() => { setArmory(false); engine.current?.lock(); }}>×</button></div><h2>选择你的装备<span>BUY ZONE ACTIVE</span></h2><p>全装回合开始 20 秒内，仅在己方出生点可更换装备。</p><div className="weapon-grid">{(['ak', 'm4', 'awp', 'glock', 'usp', 'deagle'] as WeaponId[]).map(id => <button key={id} className={snapshot?.weapon === id ? 'selected' : ''} onClick={() => engine.current?.buy(id)}><GunIcon id={id}/><strong>{WEAPONS[id].name}</strong><small>{weaponNotes[id]}</small></button>)}</div><button className="deploy-button" onClick={() => { setArmory(false); engine.current?.lock(); }}><span>装备就绪 · 返回战场</span><Arrow/></button></section></div>}
    {help && <div className="modal-backdrop"><section className="help-panel"><div className="field-heading"><span>FIELD MANUAL / 作战手册</span><button className="close-button" onClick={() => setHelp(false)}>×</button></div><h2>先了解，再出击。<span>KNOW YOUR PROTOCOL.</span></h2><Controls/><div className="manual-notes"><p><BombIcon/> <span><strong>爆破目标</strong>T 持包进入 A/B 点后静止按住 E，3.2 秒完成安放；CT 靠近 C4 后按住 E，5 秒拆除。爆炸倒计时 40 秒。</span></p><p><Skull/> <span><strong>战斗规则</strong>爆头为躯干基础伤害的 2 倍，四肢减伤，护甲吸收 32% 伤害。手枪局全员无护甲。阵亡后按 V 接管队友。</span></p><p><Shield/> <span><strong>小队情报</strong>小地图只显示队友及小队最近目视的敌人。AI 会自主推进、交战、回收 C4、安放和拆除。无人类联网对战。</span></p></div><div className="settings-sliders"><label>主音量 <span>{Math.round(settings.volume * 100)}%</span><input aria-label="主音量" type="range" min="0" max="1" step=".05" value={settings.volume} onChange={e => { const volume = +e.target.value; setSettings({ ...settings, volume }); engine.current?.updateSettings(volume, settings.sensitivity); }}/></label><label>鼠标灵敏度 <span>{settings.sensitivity.toFixed(1)}</span><input aria-label="鼠标灵敏度" type="range" min=".3" max="2" step=".1" value={settings.sensitivity} onChange={e => { const sensitivity = +e.target.value; setSettings({ ...settings, sensitivity }); engine.current?.updateSettings(settings.volume, sensitivity); }}/></label></div><button className="deploy-button" onClick={() => { setHelp(false); if (playing) engine.current?.lock(); }}><span>{playing ? '返回战场' : '了解 · 返回部署'}</span><Arrow/></button></section></div>}
    {error && <div className="modal-backdrop"><section className="help-panel"><h2>无法启动 3D 场景</h2><p>请使用支持 WebGL 2 的桌面浏览器，并开启硬件加速。</p><pre>{error}</pre></section></div>}
    {!snapshot && !error && <div className="loading-screen"><Mark size={48}/><span>BUILDING THE BATTLEFIELD</span><i/></div>}
  </div>;
}

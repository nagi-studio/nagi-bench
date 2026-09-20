import { useEffect,useRef,useState,useSyncExternalStore } from 'react';
import { GameEngine } from './game/engine';
import type { GameConfig, GameSnapshot, Team } from './game/types';
import type { WeaponId } from './game/weapons';
import { WEAPONS } from './game/weapons';
import { Icon, WeaponIcon } from './ui/Icons';
import Minimap from './ui/Minimap';

declare global { interface Window { __DUST2__?:GameEngine } }
const clock=(n:number)=>`${Math.floor(Math.max(0,n)/60)}:${Math.floor(Math.max(0,n)%60).toString().padStart(2,'0')}`;

export default function App() {
  const mount=useRef<HTMLDivElement>(null);const [engine,setEngine]=useState<GameEngine|null>(null);const [error,setError]=useState('');
  useEffect(()=>{
    let game:GameEngine|undefined;
    try {game=new GameEngine(mount.current!);setEngine(game);if(import.meta.env.DEV)window.__DUST2__=game;}
    catch(e){setError(e instanceof Error?e.message:'WebGL could not start');}
    return()=>{game?.dispose();delete window.__DUST2__;};
  },[]);
  return <main className="app"><div className="world" ref={mount}/>{engine?<Interface engine={engine}/>:<div className="loading"><div className="brand-mark">Ⅱ</div><h1>DUST II</h1><p>{error||'PREPARING THE BATTLEFIELD'}</p>{error&&<button onClick={()=>location.reload()}>RETRY</button>}</div>}</main>;
}

function Interface({engine}:{engine:GameEngine}) {
  const s=useSyncExternalStore(engine.subscribe,engine.getSnapshot);
  const [config,setConfig]=useState<GameConfig>({team:'CT',pistolRound:false,primary:'m4a4',secondary:'default'});
  const [guide,setGuide]=useState(false),[settings,setSettings]=useState(false),[scoreboard,setScoreboard]=useState(false);
  const [quality,setQuality]=useState('1.65');
  const menu=!s.started||s.paused;
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{if(e.code==='Tab'&&engine.started&&!engine.paused){e.preventDefault();setScoreboard(true);}};
    const up=(e:KeyboardEvent)=>{if(e.code==='Tab')setScoreboard(false);};
    const blur=()=>setScoreboard(false);
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};
  },[engine]);
  const selectTeam=(team:Team)=>setConfig(c=>({...c,team,primary:team==='CT'?'m4a4':'ak47'}));
  return <div className={`interface ${menu?'is-menu':'is-playing'}`}>
    <div className="screen-grain"/><div className="screen-vignette"/>
    <header className="topbar">
      <div className="identity"><div className="brand-mark"><span/> <span/></div><div><strong>STRIKE<span> / </span>PROTOCOL</strong><small>TACTICAL OPERATIONS</small></div><span className="prototype-tag">PROTOTYPE</span></div>
      {menu&&<nav><button className={!guide&&!settings?'active':''} onClick={()=>{setGuide(false);setSettings(false);}}>PLAY</button><button className={guide?'active':''} onClick={()=>{setGuide(true);setSettings(false);}}>FIELD GUIDE</button></nav>}
      <div className="server-status"><span className="server-name"><i className="live-dot"/>LOCAL SESSION <b>5V5</b></span><button title={s.muted?'Enable sound':'Mute sound'} aria-label={s.muted?'Enable sound':'Mute sound'} onClick={engine.toggleSound}><Icon name={s.muted?'muted':'sound'} size={18}/></button><button className="settings-button" onClick={()=>{if(s.started&&!s.paused)engine.pause();setSettings(v=>!v);setGuide(false);}} aria-label="Settings"><span>☷</span></button></div>
    </header>
    <div className="top-match"><div className="squad ct">{s.actors.filter(a=>a.team==='CT').map(a=><div key={a.id} className={`agent-chip ${!a.alive?'dead':''} ${a.id===s.playerId?'self':''}`} title={`${a.name} · ${a.hp} HP`}><Icon name={a.alive?'person':'skull'} size={19}/><span/></div>)}</div><div className="match-score"><b className="ct-text">{s.score.CT}</b><div><span>{!s.started?'COMPETITIVE':s.phase==='freeze'?'GET READY':s.bomb.state==='planted'?'C4 ACTIVE':`ROUND ${String(s.round).padStart(2,'0')}`}</span><strong className={s.bomb.state==='planted'?'danger-text':''}>{!s.started?'5 VS 5':s.bomb.state==='planted'?clock(s.bomb.timer):clock(s.timer)}</strong></div><b className="t-text">{s.score.T}</b></div><div className="squad t">{s.actors.filter(a=>a.team==='T').map(a=><div key={a.id} className={`agent-chip ${!a.alive?'dead':''} ${a.id===s.playerId?'self':''}`} title={`${a.name} · ${a.hp} HP`}><Icon name={a.alive?'person':'skull'} size={19}/><span/></div>)}</div></div>
    <aside className="map-wrapper"><Minimap snapshot={s}/><div className="map-legend"><span><i className="legend-dot self"/>YOU</span><span><i className="legend-dot ally"/>SQUAD</span><span><i className="legend-dot enemy"/>CONTACT</span></div></aside>
    {menu&&!guide&&!settings&&<>
      <section className="deployment">
        <div className="eyebrow"><span className="tiny-cross">+</span> ACTIVE DUTY <span className="eyebrow-line"/> DE_DUST2</div>
        <h1>DUST <span>II</span><sup>02</sup></h1>
        <p className="map-description">Same dust. New fight.<br/><span>A classic battleground. Every angle matters.</span></p>
        <div className="deploy-card">
          <div className="card-heading"><span>{s.started?'SESSION PAUSED':'CHOOSE YOUR SIDE'}</span><span className="card-index">01 / 03</span></div>
          <div className="team-selector"><button className={config.team==='CT'?'selected ct-choice':''} onClick={()=>selectTeam('CT')}><Icon name="shield" size={22}/><span>COUNTER-TERRORIST<small>DEFEND & DEFUSE</small></span>{config.team==='CT'&&<span className="selection-dot"/>}</button><button className={config.team==='T'?'selected t-choice':''} onClick={()=>selectTeam('T')}><Icon name="cross" size={22}/><span>TERRORIST<small>PLANT & PROTECT</small></span>{config.team==='T'&&<span className="selection-dot"/>}</button></div>
          <div className="loadout-heading"><span>STARTING LOADOUT</span><div className="mode-toggle"><button className={!config.pistolRound?'selected':''} onClick={()=>setConfig(c=>({...c,pistolRound:false}))}>FULL BUY</button><button className={config.pistolRound?'selected':''} onClick={()=>setConfig(c=>({...c,pistolRound:true}))}>PISTOL ROUND</button></div></div>
          {!config.pistolRound?<div className="weapon-selection">{(['ak47','m4a4','awp'] as const).map(id=><button key={id} onClick={()=>setConfig(c=>({...c,primary:id}))} className={config.primary===id?'selected':''}><WeaponIcon id={id}/><span>{WEAPONS[id].name}</span>{config.primary===id&&<i/>}</button>)}</div>:<div className="pistol-loadout"><WeaponIcon id={config.team==='CT'?'usp':'glock'}/><div><b>{config.team==='CT'?'USP-S':'GLOCK-18'}</b><span>DEFAULT SIDEARM · 25 ARMOR · NO PRIMARY</span></div></div>}
          {!config.pistolRound&&<div className="secondary-picker"><span>SIDEARM</span><button className={config.secondary==='default'?'selected':''} onClick={()=>setConfig(c=>({...c,secondary:'default'}))}>{config.team==='CT'?'USP-S':'GLOCK-18'}</button><button className={config.secondary==='deagle'?'selected':''} onClick={()=>setConfig(c=>({...c,secondary:'deagle'}))}>DESERT EAGLE</button></div>}
          <button className="deploy-button" onClick={()=>s.started?engine.resume():engine.start(config)}><span><Icon name="cross" size={20}/>{s.started?'RETURN TO ACTION':'DEPLOY TO DUST II'}</span><Icon name="arrow" size={22}/></button>
          {s.started&&<button className="restart-button" onClick={()=>engine.start(config)}>START NEW MATCH WITH THIS LOADOUT <Icon name="arrow" size={12}/></button>}
          <div className="deploy-footnote"><i className="live-dot"/>{s.started?'SIMULATION PAUSED':'1 PLAYER + 9 BOTS'}<span>NO DOWNLOADS. JUST PLAY.</span></div>
        </div>
        {s.error&&<p className="error-message">{s.error}</p>}
      </section>
      <aside className="briefing"><div className="briefing-label"><span className="tiny-cross">+</span> THE OBJECTIVE</div><h2>One team.<br/>One mission.</h2><p>Take the site. Hold your ground.<br/>Make every round count.</p><div className="briefing-rule"/><div className="mission-type"><Icon name="bomb" size={28}/><div><strong>BOMB DEFUSAL</strong><small>2 SITES <i/> 115 SECONDS <i/> 10 OPERATORS</small></div></div><div className="region-tag"><span>35° 14′ N &nbsp; 01° 35′ E</span><strong>DUST II <span> / </span> NORTH AFRICA</strong></div></aside>
      <footer className="menu-footer"><span><i className="live-dot"/> ALL SYSTEMS READY</span><div><kbd>W A S D</kbd> MOVE <kbd>MOUSE</kbd> AIM <kbd>R</kbd> RELOAD <kbd>E</kbd> INTERACT</div><span>BUILT FOR THE BROWSER <b>↗</b></span></footer>
    </>}
    {s.started&&!menu&&<>
      <div className="location-tag"><span className="tiny-cross">+</span> {s.location}<small>{s.team==='CT'?'COUNTER-TERRORIST':'TERRORIST'}</small></div>
      {s.scoped?<div className="scope"><div className="scope-lens"><div className="scope-horizontal"/><div className="scope-vertical"/><span className="scope-center"/><span className="scope-range">PRECISION &nbsp; / &nbsp; 4×</span></div></div>:<Crosshair s={s}/>}
      {s.hit>0&&<div className={`hitmarker ${s.headshot?'headshot':''}`}>×</div>}
      <div className="damage-overlay" style={{opacity:s.hurt}}/>
      <div className="killfeed">{s.kills.map(k=><div key={k.id} className={k.attacker==='YOU'?'your-kill':''}><span className={k.team==='CT'?'ct-text':'t-text'}>{k.attacker}</span><WeaponIcon id={k.weapon}/>{k.headshot&&<Icon name="cross" size={12}/>}<span className={k.team==='CT'?'t-text':'ct-text'}>{k.victim}</span></div>)}</div>
      {s.phase==='freeze'&&<div className="center-announcement"><span>ROUND {String(s.round).padStart(2,'0')}</span><h2>READY UP</h2><p>{s.team==='CT'?'DEFEND THE BOMB SITES':'TAKE A SITE AND PLANT THE C4'}</p></div>}
      {s.phase==='over'&&<div className="round-result"><Icon name={s.winner==='CT'?'shield':'cross'} size={38}/><span>ROUND {s.round} COMPLETE</span><h2>{s.winner===s.team?'ROUND WON':'ROUND LOST'}</h2><p>{s.result}</p><small>NEXT ROUND IN {Math.ceil(s.timer)}s</small></div>}
      {s.bomb.state==='planted'&&s.phase!=='over'&&<div className="bomb-alert"><Icon name="bomb" size={17}/><span>C4 PLANTED AT {s.bomb.site}</span><b>{clock(s.bomb.timer)}</b>{s.bomb.progress>0&&<span className="defuse-status">DEFUSING {Math.round(s.bomb.progress*100)}%</span>}</div>}
      {s.interaction&&s.alive&&s.phase!=='over'&&<div className="interaction"><div><kbd>E</kbd><span>{s.interaction}</span></div>{s.progress>0&&<div className="interaction-bar"><i style={{width:`${s.progress*100}%`}}/></div>}</div>}
      {!s.alive&&s.phase!=='over'&&<div className="spectator-panel"><span>YOU WERE ELIMINATED</span><h3>SPECTATING {s.spectator}</h3><p><kbd>Q</kbd> NEXT TEAMMATE <kbd>E</kbd> TAKE CONTROL</p></div>}
      <div className="player-vitals"><div className="player-id"><span className="operator-badge"><Icon name={s.team==='CT'?'shield':'cross'} size={21}/></span><div><strong>{s.alive?'YOU':s.spectator}</strong><small>{s.team==='CT'?'COUNTER-TERRORIST':'TERRORIST'}</small></div><span className="money">${s.round===1&&engine.config.pistolRound?'800':'3,200'}</span></div><div className="vitals-row"><div className="health-value"><span>+</span><strong>{s.hp}</strong><small>HP</small></div><div className="armor-value"><Icon name="shield" size={22}/><strong>{s.armor}</strong><small>ARMOR</small></div></div><div className="health-track"><i style={{width:`${s.hp}%`}}/></div></div>
      <div className="ammo-panel"><div className="weapon-slots">{(['primary','secondary','melee'] as const).map((slot,i)=>s.slots[slot]&&<button key={slot} className={s.slots[slot]===s.weapon?'active':''} onClick={()=>engine.switchSlot(slot)}><kbd>{i+1}</kbd><WeaponIcon id={s.slots[slot]!}/></button>)}</div><div className="ammo-main"><div><span>{WEAPONS[s.weapon].name}</span><small>{s.reload>0?'RELOADING':s.weapon==='knife'?'MELEE':s.weapon==='awp'?'BOLT ACTION':WEAPONS[s.weapon].automatic?'AUTOMATIC':'SEMI-AUTOMATIC'}</small></div><strong className={s.ammo<=WEAPONS[s.weapon].magazine*.2?'low-ammo':''}>{s.weapon==='knife'?'∞':String(s.ammo).padStart(2,'0')}</strong><span className="reserve">/ {s.weapon==='knife'?'—':s.reserve}</span></div>{s.reload>0&&<div className="reload-track"><i style={{width:`${(1-s.reload/WEAPONS[s.weapon].reload)*100}%`}}/></div>}</div>
      <div className="game-controls"><span><kbd>1–3</kbd> WEAPONS</span><span><kbd>R</kbd> RELOAD</span><span><kbd>E</kbd> C4</span><span><kbd>TAB</kbd> SCORE</span><span><kbd>ESC</kbd> PAUSE</span></div>
      <div className="telemetry"><i className="live-dot"/> {s.fps} FPS <span>LOCAL SIMULATION</span></div>
    </>}
    {guide&&<div className="modal-shade"><section className="guide-panel"><button className="modal-close" onClick={()=>setGuide(false)} aria-label="Close field guide"><Icon name="close"/></button><div className="eyebrow">KNOW YOUR BATTLEGROUND</div><h2>FIELD GUIDE<span> / 01</span></h2><p>Two sites. Three approaches. No second chances—unless a teammate is still standing.</p><div className="guide-columns"><div><h3>MOVE & FIGHT</h3><Control keycap="W A S D" text="Move · 移动"/><Control keycap="MOUSE" text="Look · 鼠标转向"/><Control keycap="SPACE" text="Jump · 跳跃"/><Control keycap="SHIFT" text="Walk quietly · 慢行"/><Control keycap="LMB" text="Fire / knife · 开火"/><Control keycap="RMB" text="AWP scope · 开镜"/><Control keycap="R" text="Reload · 换弹"/><Control keycap="1 / 2 / 3" text="Primary / pistol / knife"/></div><div><h3>PLAY THE OBJECTIVE</h3><Control keycap="HOLD E" text="Plant 3.2s / defuse 5s · 下包 / 拆包"/><Control keycap="Q" text="When dead: spectate teammate"/><Control keycap="E" text="When dead: take over teammate"/><Control keycap="TAB" text="Scoreboard · 计分板"/><Control keycap="ESC" text="Pause / loadout · 暂停"/><p className="guide-note">T: carry C4 to A or B and hold E while stationary. Dropped C4 is picked up by walking over it. CT: defend both sites and defuse within 40 seconds. A planted bomb stays active when all terrorists are eliminated.</p></div></div><div className="guide-bottom"><Icon name="info" size={17}/><span>Headshots deal 2× base damage. Armor reduces damage. Allies block shots; friendly fire is disabled.</span></div><button className="deploy-button" onClick={()=>setGuide(false)}>UNDERSTOOD <Icon name="arrow"/></button></section></div>}
    {settings&&<div className="modal-shade"><section className="settings-panel"><button className="modal-close" onClick={()=>setSettings(false)} aria-label="Close settings"><Icon name="close"/></button><div className="eyebrow">FIELD EQUIPMENT</div><h2>SETTINGS</h2><div className="setting-row"><div><b>PROCEDURAL AUDIO</b><small>Weapons, footsteps & objective cues</small></div><button className="toggle-button" onClick={engine.toggleSound}>{s.muted?'OFF':'ON'}<Icon name={s.muted?'muted':'sound'}/></button></div><div className="setting-row"><div><b>RENDER QUALITY</b><small>Pixel resolution · applies immediately</small></div><select value={quality} onChange={e=>{setQuality(e.target.value);engine.renderer.setPixelRatio(Math.min(devicePixelRatio,Number(e.target.value)));engine.renderer.setSize(innerWidth,innerHeight);}}><option value="1">PERFORMANCE</option><option value="1.65">BALANCED</option><option value="2">HIGH</option></select></div><p className="guide-note">Mouse sensitivity: 0.12° / pixel. Scoped sensitivity is reduced automatically. The game pauses when you release the mouse or leave this window.</p><button className="deploy-button" onClick={()=>setSettings(false)}>BACK TO OPERATIONS <Icon name="arrow"/></button></section></div>}
    {scoreboard&&<Scoreboard s={s}/>}
  </div>;
}
function Crosshair({s}:{s:GameSnapshot}) {const gap=5+s.spread*400;return <div className="crosshair" style={{'--gap':`${gap}px`} as React.CSSProperties}><i/><i/><i/><i/><b/></div>;}
function Control({keycap,text}:{keycap:string;text:string}){return <div className="control-row"><kbd>{keycap}</kbd><span>{text}</span></div>;}
function Scoreboard({s}:{s:GameSnapshot}) {return <div className="scoreboard-shade"><div className="scoreboard"><div className="scoreboard-heading"><div className="eyebrow">COMPETITIVE / DUST II</div><h2>MATCH OVERVIEW</h2><span>ROUND {s.round}</span></div>{(['CT','T'] as const).map(team=><div className="score-team" key={team}><div className={`score-team-heading ${team==='CT'?'ct-text':'t-text'}`}><Icon name={team==='CT'?'shield':'cross'}/><strong>{team==='CT'?'COUNTER-TERRORISTS':'TERRORISTS'}</strong><b>{s.score[team]}</b></div><table><thead><tr><th>OPERATOR</th><th>STATUS</th><th>LOADOUT</th><th>K</th><th>D</th></tr></thead><tbody>{s.actors.filter(a=>a.team===team).map(a=><tr key={a.id} className={a.id===s.playerId?'you':''}><td>{a.name}{a.bomb&&<Icon name="bomb" size={13}/>}</td><td>{a.alive?`${a.hp} HP`:'ELIMINATED'}</td><td><WeaponIcon id={a.weapon as WeaponId}/></td><td>{a.kills}</td><td>{a.deaths}</td></tr>)}</tbody></table></div>)}<div className="scoreboard-footer">LOCAL SERVER <span>HOLD TAB TO VIEW</span></div></div></div>;}

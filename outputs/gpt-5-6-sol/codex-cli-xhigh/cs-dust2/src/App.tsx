import { useEffect, useRef, useState } from 'react'
import { DustGame } from './game/Game'
import type { GameSnapshot, RoundMode, Team } from './game/types'

const initial: GameSnapshot = {
  phase:'ready', mode:'pistol', team:'CT', round:1, time:120, scoreT:0, scoreCT:0, hp:100, armor:0,
  weapon:'usp', weaponName:'USP-S', ammo:12, reserve:48, reloading:false, spread:0, scoped:false, agents:[], kills:[],
  bomb:{state:'carried',x:0,z:54,site:null,timer:40,carrierName:null}, actionLabel:'', actionProgress:0, banner:'', location:'TACTICAL MAP', spectator:false,
}

const pad = (v: number) => String(Math.max(0, Math.floor(v))).padStart(2, '0')

function MiniMap({ game }: { game: GameSnapshot }) {
  const mx = (x: number) => (x + 52) / 104 * 100
  const my = (z: number) => (z + 48) / 110 * 100
  const walls = [
    [-48,54,10,3],[-41,36,3,31],[-17,39,3,24],[-12,27,3,26],[9,27,3,25],[-10,4,18,3],[13,4,13,3],[-26,-4,3,25],
    [16,51,3,19],[34,51,3,18],[20,34,12,3],[42,34,16,3],[29,20,3,25],[48,13,3,43],[44,-5,3,13],
    [19,-18,3,24],[45,-27,3,25],[32,-41,29,3],[-42,-34,3,19],[-26,-39,28,3],[4,-29,12,3],
  ]
  return <div className="minimap-shell">
    <div className="map-heading"><span>LIVE MAP</span><span>{game.location}</span></div>
    <svg className="minimap" viewBox="0 0 100 100" role="img" aria-label="Dust2 小地图">
      <path className="map-route" d="M49 93 L47 70 L50 51 L48 36 L35 35 L25 17 L18 40 L15 72 M51 50 L50 36 L68 57 L83 60 L81 20 M50 50 L50 36 L56 9 M35 35 L19 19 M50 9 L31 10 M56 9 L81 18" />
      {walls.map((w,i) => <rect className="map-wall" key={i} x={mx(w[0]-w[2]/2)} y={my(w[1]-w[3]/2)} width={w[2]/104*100} height={w[3]/110*100} rx=".5" />)}
      <circle className="site-ring" cx={mx(-32)} cy={my(-27)} r="6.4"/><text className="site-label" x={mx(-32)} y={my(-27)+2}>A</text>
      <circle className="site-ring" cx={mx(32)} cy={my(-28)} r="6.4"/><text className="site-label" x={mx(32)} y={my(-28)+2}>B</text>
      {game.agents.filter(a => a.alive && (a.team === game.team || a.visible)).map(a => <g key={a.id} transform={`translate(${mx(a.x)} ${my(a.z)}) rotate(${-a.yaw*180/Math.PI})`}>
        <path className={`player-dot ${a.team === 'CT' ? 'ct' : 't'} ${a.controlled ? 'self' : ''}`} d="M0 -3.2 L2.4 2 L0 1.3 L-2.4 2 Z" />
        {a.hasBomb && <circle className="carrier-ring" r="3.7"/>}
      </g>)}
      {game.bomb.state !== 'carried' && game.bomb.state !== 'defused' && game.bomb.state !== 'exploded' && <g transform={`translate(${mx(game.bomb.x)} ${my(game.bomb.z)})`}><rect className="bomb-dot" x="-2" y="-2" width="4" height="4" rx=".5"/><text className="bomb-letter" y="-3.5">C4</text></g>}
    </svg>
    <div className="map-legend"><span><i className="dot ct"/>CT</span><span><i className="dot t"/>T</span><span><i className="diamond"/>C4</span></div>
  </div>
}

function StartScreen({ onStart }: { onStart: (mode: RoundMode, team: Team) => void }) {
  const [mode, setMode] = useState<RoundMode>('pistol')
  const [team, setTeam] = useState<Team>('CT')
  return <div className="start-screen">
    <div className="start-grid"/>
    <section className="start-copy">
      <div className="eyebrow"><span>5 VS 5</span><span>PROCEDURAL COMBAT SIM</span></div>
      <h1>DUST<span>//</span>II</h1>
      <p className="lead">穿过中门。守住包点。别让你的队伍少一个人。</p>
      <div className="feature-line"><span>10 名作战单位</span><span>全局物理碰撞</span><span>C4 回合规则</span><span>空间音频反馈</span></div>
    </section>
    <section className="deployment">
      <div className="panel-title"><span>01</span><div><b>SELECT FORCE</b><small>选择你的阵营</small></div></div>
      <div className="choice-row">
        <button className={`choice team-ct ${team==='CT'?'active':''}`} onClick={() => setTeam('CT')}><i>CT</i><span><b>COUNTER-TERRORISTS</b><small>从 CT 出生点部署 · M4A4 / USP-S</small></span></button>
        <button className={`choice team-t ${team==='T'?'active':''}`} onClick={() => setTeam('T')}><i>T</i><span><b>TERRORISTS</b><small>从 T 出生点部署 · AK-47 / Glock</small></span></button>
      </div>
      <div className="panel-title"><span>02</span><div><b>ROUND PROTOCOL</b><small>选择装备规则</small></div></div>
      <div className="mode-row">
        <button className={mode==='pistol'?'active':''} onClick={() => setMode('pistol')}><span>PISTOL ROUND</span><small>标准第一回合 · 默认手枪 · 无主武器 / 无护甲</small></button>
        <button className={mode==='rifle'?'active':''} onClick={() => setMode('rifle')}><span>FULL BUY</span><small>步枪、狙击与护甲 · 4—7 快速测试全武器</small></button>
      </div>
      <button className="deploy" onClick={() => onStart(mode, team)}><span>DEPLOY</span><small>点击进入 · 锁定鼠标</small><i>↗</i></button>
      <p className="controls">WASD 移动　·　鼠标瞄准 / 射击　·　右键开镜　·　E 互动　·　R 换弹　·　1—3 切枪</p>
    </section>
    <div className="build-tag">BUILD 02.5 // BROWSER TACTICAL PROTOTYPE</div>
  </div>
}

function Hud({ game, locked, onResume }: { game: GameSnapshot, locked: boolean, onResume: () => void }) {
  const crossGap = 7 + game.spread * 210
  return <div className="hud">
    <header className="scorebar">
      <div className="team-score ct"><span>CT</span><b>{game.scoreCT}</b></div>
      <div className="round-clock"><small>ROUND {pad(game.round)} · {game.mode === 'pistol' ? 'PISTOL' : 'FULL BUY'}</small><strong>{pad(game.time/60)}:{pad(game.time%60)}</strong><span className={`bomb-status ${game.bomb.state}`}>{game.bomb.state === 'planted' ? `C4 ${Math.ceil(game.bomb.timer)}s · ${game.bomb.site}` : game.bomb.state === 'dropped' ? 'C4 DROPPED' : game.bomb.carrierName ? `C4 · ${game.bomb.carrierName}` : 'OBJECTIVE LIVE'}</span></div>
      <div className="team-score t"><b>{game.scoreT}</b><span>T</span></div>
    </header>
    <MiniMap game={game}/>
    <div className="killfeed">{game.kills.map(k => <div key={k.id} className="kill"><b className={k.team==='CT'?'blue':'amber'}>{k.killer}</b><span className="kill-weapon">{k.weapon}{k.headshot?' ◉':''}</span><b>{k.victim}</b></div>)}</div>
    <div className="squad-list">
      {game.agents.filter(a => a.team === game.team).map(a => <div key={a.id} className={`${a.alive?'':'dead'} ${a.controlled?'controlled':''}`}><i>{a.id<5?'T':'CT'}</i><span><b>{a.name}{a.controlled?' // YOU':''}</b><small>{a.alive ? `${a.hp} HP${a.hasBomb?' · C4':''}` : 'KIA'}</small></span></div>)}
    </div>
    {!game.scoped && <div className="crosshair" style={{'--gap':`${crossGap}px`} as React.CSSProperties}><i className="ch top"/><i className="ch right"/><i className="ch bottom"/><i className="ch left"/><i className="center"/></div>}
    {game.scoped && <div className="scope"><i className="scope-h"/><i className="scope-v"/><span className="scope-ring"/></div>}
    {game.actionLabel && <div className="action"><b>{game.actionLabel}</b><div><i style={{width:`${game.actionProgress*100}%`}}/></div><small>保持 E 键</small></div>}
    {game.banner && <div className={`banner ${game.phase==='roundEnd'?'round-end':''}`}><span>{game.phase==='roundEnd'?'ROUND COMPLETE':'COMBAT NOTICE'}</span><b>{game.banner}</b>{game.spectator&&<small>E 接管下一名存活队友 · Q 切换观察</small>}</div>}
    <div className="vitals">
      <div className="vital"><span>+</span><div><small>HEALTH</small><b>{pad(game.hp)}</b></div></div>
      <div className="vital armor"><span>◇</span><div><small>ARMOR</small><b>{pad(game.armor)}</b></div></div>
    </div>
    <div className="ammo-panel">
      <div className="weapon-index">{game.weapon==='knife'?'03':game.weapon==='glock'||game.weapon==='usp'||game.weapon==='deagle'?'02':'01'}</div>
      <div className="weapon-name"><small>{game.reloading?'RELOADING…':'ACTIVE WEAPON'}</small><b>{game.weaponName}</b></div>
      <div className="ammo"><strong>{game.weapon==='knife'?'—':pad(game.ammo)}</strong><span>/ {game.weapon==='knife'?'—':game.reserve}</span></div>
      <div className="slots"><span className={['ak47','m4a4','awp'].includes(game.weapon)?'active':''}>1 PRIMARY</span><span className={['glock','usp','deagle'].includes(game.weapon)?'active':''}>2 SIDEARM</span><span className={game.weapon==='knife'?'active':''}>3 KNIFE</span></div>
    </div>
    <div className="objective-hint">{game.team==='T'?'携带 C4 进入 A / B 点并按住 E 下包':'阻止下包；靠近已安放 C4 按住 E 拆除'}{game.mode==='rifle'&&<span> · 4 AK　5 M4　6 AWP　7 DEAGLE</span>}</div>
    {!locked && <button className="pause-card" onClick={onResume}><span>TACTICAL LINK PAUSED</span><b>点击继续作战</b><small>鼠标将重新锁定 · ESC 可释放</small></button>}
  </div>
}

export default function App() {
  const mount = useRef<HTMLDivElement>(null)
  const engine = useRef<DustGame | null>(null)
  const [game, setGame] = useState<GameSnapshot>(initial)
  const [started, setStarted] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!mount.current) return
    const instance = new DustGame(mount.current, setGame); engine.current = instance
    const onLock = () => setLocked(!!document.pointerLockElement)
    document.addEventListener('pointerlockchange', onLock)
    return () => { document.removeEventListener('pointerlockchange', onLock); instance.dispose(); engine.current = null }
  }, [])

  const start = (mode: RoundMode, team: Team) => { setStarted(true); engine.current?.start({ mode, team }) }
  return <main className="app">
    <div className="game-mount" ref={mount}/>
    {!started ? <StartScreen onStart={start}/> : <Hud game={game} locked={locked} onResume={() => engine.current?.requestLock()}/>} 
  </main>
}

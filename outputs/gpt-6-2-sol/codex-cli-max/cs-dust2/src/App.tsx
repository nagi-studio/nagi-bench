import { useEffect, useRef, useState } from 'react'
import { DEFAULT_PISTOL, DEFAULT_PRIMARY, TEAM_NAMES, WEAPONS, type Primary, type Team } from './game/arsenal'
import { BrowserGame, type Snapshot } from './game/client'
import type { Config, RoundMode } from './game/match'
import { Hud, Key } from './ui/Hud'
import { Icon, WeaponGlyph } from './ui/icons'

const INITIAL: Snapshot = { screen: 'menu', hud: null, fps: 0 }
const PRIMARIES: Primary[] = ['ak', 'm4', 'awp']

function Gear({ config, setConfig }: { config: Config; setConfig: (config: Config) => void }) {
  const pistol = config.opening === 'pistol'
  const defaultPistol = DEFAULT_PISTOL[config.team]
  const sidearm = !pistol && config.sidearm === 'deagle' ? 'deagle' : defaultPistol

  return (
    <div className="gear">
      <label>
        <span>主武器</span>
        <div className="select-shell">
          {pistol ? <Icon name="layers" size={17} /> : <WeaponGlyph id={config.primary} />}
          <select aria-label="主武器" disabled={pistol} value={pistol ? 'empty' : config.primary}
            onChange={event => setConfig({ ...config, primary: event.target.value as Primary })}>
            <option value="empty" hidden>无主武器</option>
            {PRIMARIES.map(id => <option value={id} key={id}>{WEAPONS[id].name}</option>)}
          </select>
          <Icon name="down" size={16} />
        </div>
      </label>
      <label>
        <span>副武器</span>
        <div className="select-shell">
          <WeaponGlyph id={sidearm} />
          <select aria-label="副武器" disabled={pistol} value={pistol ? 'default' : config.sidearm}
            onChange={event => setConfig({ ...config, sidearm: event.target.value as Config['sidearm'] })}>
            <option value="default">{WEAPONS[defaultPistol].name}</option>
            <option value="deagle">沙鹰</option>
          </select>
          <Icon name="down" size={16} />
        </div>
      </label>
    </div>
  )
}

function Deployment({ config, setConfig, deploy, ready, error }: {
  config: Config
  setConfig: (config: Config) => void
  deploy: () => void
  ready: boolean
  error: boolean
}) {
  const teamButton = (team: Team) => {
    const selected = team === config.team
    return <button key={team} className={'team-choice ' + team.toLowerCase() + (selected ? ' selected' : '')}
      aria-pressed={selected} type="button" onClick={() => { if (!selected) setConfig({ ...config, team, primary: DEFAULT_PRIMARY[team] }) }}>
      <span className="team-choice-icon"><Icon name={team === 'CT' ? 'shield' : 'strike'} size={22} /></span>
      <span className="team-choice-label"><b>{TEAM_NAMES[team]}</b><small>{team}</small></span>
      {selected && <Icon name="check" size={15} className="choice-check" />}
    </button>
  }

  const modeButton = (mode: RoundMode, label: string) => <button type="button"
    className={config.opening === mode ? 'selected' : ''} aria-pressed={config.opening === mode}
    onClick={() => setConfig({ ...config, opening: mode })}>{label}</button>

  return (
    <section className="deployment" aria-label="部署配置">
      <div className="panel-kicker"><Icon name="reticle" size={16} /> 战术爆破</div>
      <h2>准备出战</h2>
      <div className="deployment-fields">
        <fieldset><legend>选择阵营</legend><div className="teams">{(['CT', 'T'] as const).map(teamButton)}</div></fieldset>
        <fieldset><legend>回合类型</legend><div className="segments">{modeButton('standard', '标准回合')}{modeButton('pistol', '手枪开局')}</div></fieldset>
        <fieldset><legend>初始装备</legend><Gear config={config} setConfig={setConfig} /></fieldset>
      </div>
      {error && <div className="error-notice" role="alert">3D 初始化失败。请在支持 WebGL 2 的浏览器中打开。</div>}
      <button type="button" className="deploy-button" onClick={deploy} disabled={!ready}>
        <Icon name="play" size={18} /><span>开始对局</span><Icon name="arrow" size={19} className="deploy-arrow" />
      </button>
    </section>
  )
}

const GUIDE_KEYS = [
  { caps: ['W', 'A', 'S', 'D'], label: '移动' },
  { caps: ['鼠标'], label: '转动视角' },
  { caps: ['Space'], label: '跳跃' },
  { caps: ['Shift'], label: '慢走' },
  { caps: ['左键'], label: '开火 / 挥刀' },
  { caps: ['右键'], label: 'AWP 开镜' },
  { caps: ['R'], label: '换弹' },
  { caps: ['1', '2', '3'], label: '主武器 / 副武器 / 战术刀' },
  { caps: ['Q'], label: '上一件武器' },
  { caps: ['E'], label: '按住安放或拆除 C4' },
  { caps: ['G'], label: '丢弃携带的 C4' },
  { caps: ['Tab'], label: '查看记分板' },
  { caps: ['←', '→'], label: '切换观战队友' },
  { caps: ['E'], label: '观战时接管队友' },
  { caps: ['Esc'], label: '暂停并释放指针' },
]

function Guide({ close }: { close: () => void }) {
  return <div className="modal-backdrop guide-backdrop" onClick={close}>
    <section className="guide modal-panel" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={event => event.stopPropagation()}>
      <div className="modal-heading"><Icon name="keyboard" size={23} /><h2 id="guide-title">操作指南</h2><button className="icon-button" type="button" onClick={close} aria-label="关闭操作指南" autoFocus><Icon name="close" size={19} /></button></div>
      <div className="guide-grid">
        {GUIDE_KEYS.map(({ caps, label }) => <div className="guide-row" key={label}><span>{label}</span><span>{caps.map(key => <Key key={key}>{key}</Key>)}</span></div>)}
      </div>
    </section>
  </div>
}

function Footer({ snapshot }: { snapshot: Snapshot }) {
  return (
    <footer className="footer">
      <div className="keys-heading"><Icon name="keyboard" size={19} /><span>默认键位</span></div>
      <div className="footer-keys">
        <span><Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key><b>移动</b></span>
        <span><Key>Space</Key><b>跳跃</b></span>
        <span><Icon name="mouse" size={17} /><b>瞄准 / 开火</b></span>
        <span><Key>R</Key><b>换弹</b></span>
        <span><Key>E</Key><b>C4 交互</b></span>
        <span><Key>Tab</Key><b>记分板</b></span>
      </div>
      <div className="footer-status">
        {snapshot.screen === 'paused' ? '已暂停' : snapshot.hud?.fallback ? '窗口内瞄准 · Alt 移回光标' : snapshot.screen === 'menu' ? '键盘与鼠标' : <><i />{snapshot.fps || '—'} FPS</>}
      </div>
    </footer>
  )
}

export default function App() {
  const mount = useRef<HTMLDivElement>(null)
  const game = useRef<BrowserGame | null>(null)
  const [snapshot, setSnapshot] = useState(INITIAL)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [guide, setGuide] = useState(false)
  const [muted, setMuted] = useState(false)
  const [config, setConfig] = useState<Config>({ team: 'CT', opening: 'standard', primary: 'm4', sidearm: 'default' })

  useEffect(() => {
    if (!mount.current) return
    try {
      const session = new BrowserGame(mount.current, setSnapshot)
      game.current = session
      setReady(true)
      return () => {
        game.current = null
        session.dispose()
      }
    } catch (err) {
      console.error('3D viewport initialization:', err)
      setError(true)
    }
  }, [])

  useEffect(() => {
    if (!guide) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGuide(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [guide])

  const showGuide = () => {
    game.current?.pause()
    setGuide(true)
  }

  const toggleSound = () => {
    game.current?.mute(!muted)
    setMuted(!muted)
  }

  return (
    <div className={'app ' + (snapshot.screen === 'menu' ? 'menu' : 'match')}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol"><Icon name="mark" size={27} /></div>
          <div className="wordmark">DUST<span>LINE</span></div>
          <div className="brand-caption">尘线行动</div>
        </div>
        <div className="topbar-actions">
          <div className="connection"><i /><span>离线训练</span></div>
          <button type="button" className="icon-button" onClick={toggleSound} aria-pressed={muted} aria-label={muted ? '打开声音' : '静音'} title={muted ? '打开声音' : '静音'}>
            <Icon name={muted ? 'muted' : 'sound'} size={20} />
          </button>
          <button type="button" className="icon-button help-button" onClick={showGuide} aria-label="操作指南">
            <Icon name="help" size={18} /><span>操作指南</span>
          </button>
          {snapshot.screen === 'playing' && snapshot.hud?.fallback && <button type="button" className="icon-button" onClick={() => game.current?.retryPointer()} aria-label="锁定鼠标" title="锁定鼠标"><Icon name="mouse" size={18} /></button>}
          {snapshot.screen === 'playing' && <button type="button" className="icon-button" onClick={() => game.current?.pause()} aria-label="暂停" title="暂停"><Icon name="pause" size={18} /></button>}
        </div>
      </header>

      <main className={'stage stage-' + snapshot.screen}>
        <div ref={mount} className="viewport" />
        {snapshot.screen === 'menu' && <>
          <div className="scene-shade" />
          <span className="view-corner top-left" /><span className="view-corner bottom-left" />
          <div className="map-badge"><Icon name="pin" size={16} /><span>原创沙漠战区</span></div>
          <div className="deployment-layout">
            <section className="map-intro" aria-label="地图">
              <div className="map-label"><i /> 砂脊关口</div>
              <h1>SUNSCAR<br /><span>PASS</span></h1>
              <div className="map-features">
                <span><Icon name="users" size={17} />5 对 5</span>
                <span><Icon name="target" size={17} />双包点</span>
              </div>
            </section>
            <Deployment config={config} setConfig={setConfig} deploy={() => game.current?.start(config)} ready={ready} error={error} />
          </div>
        </>}
        {snapshot.hud && <Hud hud={snapshot.hud} />}
        {snapshot.screen === 'paused' && <div className="modal-backdrop pause-backdrop">
          <section className="pause-menu modal-panel" role="dialog" aria-modal={!guide} aria-labelledby="pause-title">
            <div className="panel-kicker"><Icon name="pause" size={17} /> 砂脊关口</div>
            <h2 id="pause-title">对局已暂停</h2>
            <button type="button" onClick={() => game.current?.resume()} className="deploy-button"><Icon name="play" size={18} /><span>继续对局</span><Icon name="arrow" size={19} className="deploy-arrow" /></button>
            <button type="button" onClick={() => game.current?.leave()} className="secondary-button">返回部署</button>
          </section>
        </div>}
      </main>
      <Footer snapshot={snapshot} />
      {guide && <Guide close={() => setGuide(false)} />}
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Arena } from './game/arena'
import { DEFAULTS, Match } from './game/match'
import { WEAPONS, SLOT_NAMES, SLOT_EN } from './game/weapons'
import type { Options, Slot, Snapshot, Team, WeaponId } from './game/types'
import { Brand, GunArt, Icon, TeamMark } from './ui/Art'
import Radar from './ui/Radar'

type Panel = 'settings' | 'guide' | 'primary' | 'sidearm' | 'mode' | null
const fmt = (n: number) =>
  Math.floor(Math.ceil(n) / 60) + ':' + String(Math.ceil(n) % 60).padStart(2, '0')
function saved(): Options {
  try {
    const p = JSON.parse(localStorage.getItem('dustline.preferences') ?? '{}')
    return {
      ...DEFAULTS,
      volume: Math.max(0, Math.min(1, Number(p.volume ?? DEFAULTS.volume))),
      sensitivity: Math.max(0.25, Math.min(2.2, Number(p.sensitivity ?? 1))),
      muted: !!p.muted,
    }
  } catch {
    return { ...DEFAULTS }
  }
}
const Key = ({ children }: { children: React.ReactNode }) => <kbd>{children}</kbd>
const controls = [
  ['W A S D', '移动'],
  ['鼠标', '转动视角'],
  ['左键', '开火 / 挥刀'],
  ['右键', 'AWP 开镜'],
  ['空格', '跳跃'],
  ['Shift', '静步移动'],
  ['1 / 2 / 3', '切换武器'],
  ['R', '装填弹药'],
  ['长按 E', '安放 / 拆除 C4'],
  ['E / G', '接过 / 丢下 C4'],
  ['Tab', '查看计分板'],
  ['Esc', '暂停并释放鼠标'],
  ['Q / Enter', '切换观战 / 接管队友'],
  ['H', '战场指南'],
]
const LOCATIONS: Record<string, string> = {
  'T 出生点': 'T SPAWN',
  'CT 出生点': 'CT SPAWN',
  'A 大门': 'LONG DOORS',
  'A 大道': 'LONG A',
  'A 点': 'BOMBSITE A',
  'B 点': 'BOMBSITE B',
  中门: 'MID DOORS',
  猫道: 'CATWALK',
  'B 洞': 'UPPER TUNNELS',
  'B 洞下层': 'LOWER TUNNELS',
  中路: 'MID',
  'A 小道': 'SHORT A',
  'A 坡道': 'A RAMP',
  'B 门': 'B DOORS',
}
function App() {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => new Match(saved()).snapshot())
  const [panel, setPanel] = useState<Panel>(null),
    [board, setBoard] = useState(false),
    [guideTab, setGuideTab] = useState<'controls' | 'map'>('controls')
  const [error, setError] = useState(''),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState('')
  const game = useRef<Arena | null>(null),
    host = useRef<HTMLDivElement>(null),
    labels = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDivElement>(null),
    returnFocus = useRef<HTMLElement | null>(null)
  const displayNotice = useRef(0)
  const open = useCallback((next: Panel) => {
    const arena = game.current
    if (!arena) return
    if (next) {
      returnFocus.current = document.activeElement as HTMLElement
      arena.panelOpen = true
      arena.pause()
      setBoard(false)
    } else arena.panelOpen = false
    setPanel(next)
  }, [])
  useEffect(() => {
    if (!host.current || !labels.current) return
    try {
      const arena = new Arena(host.current, labels.current, saved(), {
        status: setSnapshot,
        board: setBoard,
        guide: () => open('guide'),
      })
      game.current = arena
      setReady(true)
    } catch (e) {
      console.error(e)
      setError('浏览器未能启动 WebGL 2。请启用硬件加速后重新载入。')
    }
    return () => {
      game.current?.dispose()
      game.current = null
      clearTimeout(displayNotice.current)
    }
  }, [open])
  useEffect(() => {
    if (!panel) return
    const first = dialog.current?.querySelector<HTMLElement>('button,input')
    first?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        open(null)
      }
      if (e.key === 'Tab') {
        const els = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, select'
        )
        if (!els?.length) return
        const first = els[0],
          last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      returnFocus.current?.focus({ preventScroll: true })
    }
  }, [panel, open])
  function config(patch: Partial<Options>) {
    game.current?.configure(patch)
    try {
      localStorage.setItem('dustline.preferences', JSON.stringify(game.current?.match.options))
    } catch {
      /* Storage is optional in private sessions. */
    }
  }
  function toast(s: string) {
    setNotice(s)
    clearTimeout(displayNotice.current)
    displayNotice.current = window.setTimeout(() => setNotice(''), 2500)
  }
  function launch() {
    open(null)
    game.current?.start()
  }
  function slot(n: Slot) {
    const g = game.current
    if (!g) return
    if (snapshot.phase === 'paused') {
      g.start()
      g.match.slot(n)
      return
    }
    g.match.slot(n)
    if (snapshot.phase === 'ready' && n !== 2) open(n === 0 ? 'primary' : 'sidearm')
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      toast('当前窗口限制全屏显示，可使用浏览器全屏快捷键。')
    }
  }
  const s = snapshot,
    a = s.actor,
    ammo = a.inventory[a.slot]!,
    w = WEAPONS[ammo.id],
    lobby = s.phase === 'ready',
    live = s.phase === 'live',
    inRound = live || s.phase === 'paused'
  const bombPlanted = s.bomb.state === 'planted',
    mine = s.bomb.carrier === a.id
  const objective = bombPlanted
    ? s.team === 'T'
      ? '守住已安放的 C4'
      : '拆除 C4 炸弹'
    : s.team === 'T'
      ? '安放 C4 炸弹'
      : '守卫爆破点'
  const currentTime = s.elapsed
  const radar = { actors: s.actors, actor: a, team: s.team, bomb: s.bomb, time: currentTime }
  const headerTitle =
    panel === 'settings'
      ? '对局设置'
      : panel === 'guide'
        ? '战场指南'
        : panel === 'mode'
          ? '开局配置'
          : panel === 'primary'
            ? '选择主武器'
            : '选择副武器'
  function scoreSide(t: Team) {
    return (
      <div className={'score-side ' + t.toLowerCase()}>
        <TeamMark team={t} />
        <b>{s.scores[t]}</b>
      </div>
    )
  }
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Brand />
          <span>DUSTLINE</span>
        </div>
        <span className="header-rule" />
        <span className="brand-sub">TACTICAL FPS</span>
        <div className="top-actions">
          <span className="local-status">
            <i />
            LOCAL SESSION
          </span>
          <span className="tool-rule" />
          <button
            className={'icon-btn ' + (s.options.muted ? 'muted' : '')}
            aria-label={s.options.muted ? '开启声音' : '关闭声音'}
            title={s.options.muted ? '开启声音' : '关闭声音'}
            onClick={() => {
              game.current?.synth.unlock()
              config({ muted: !s.options.muted })
            }}
          >
            <Icon name={s.options.muted ? 'mute' : 'sound'} />
          </button>
          <button
            className="icon-btn"
            aria-label="对局设置"
            title="对局设置"
            onClick={() => open('settings')}
          >
            <Icon name="settings" />
          </button>
          <button className="icon-btn" aria-label="全屏显示" title="全屏显示" onClick={fullscreen}>
            <Icon name="fullscreen" />
          </button>
        </div>
      </header>
      <main className={'battlefield ' + (inRound ? 'playing' : '')}>
        <div ref={host} className="world-canvas" />
        <div className="world-vignette" />
        <div className="world-tags" ref={labels} />
        {!s.scope && (
          <div className="radar-block">
            <div className="radar-frame">
              <Radar {...radar} />
              <span className="radar-corner tl" />
              <span className="radar-corner br" />
            </div>
            <div className="radar-location">
              <Icon name="pin" size={13} />
              <strong>{s.area}</strong>
              <small>{LOCATIONS[s.area] ?? 'DUST II'}</small>
            </div>
          </div>
        )}
        <div className={'scoreboard-hud ' + (bombPlanted ? 'planted' : '')}>
          <div className="score-row">
            {scoreSide('T')}
            <div className="round-clock">
              {bombPlanted && <Icon name="bomb" size={17} />}
              <strong>{fmt(s.time)}</strong>
            </div>
            {scoreSide('CT')}
          </div>
          <div className="score-under">
            <div className="alive-bars t" aria-label={s.alive.T + ' 名 T 存活'}>
              {[0, 1, 2, 3, 4].map((i) => (
                <i className={i < s.alive.T ? 'up' : ''} key={i} />
              ))}
            </div>
            <span>
              ROUND <b>{String(s.round).padStart(2, '0')}</b>
            </span>
            <div className="alive-bars ct" aria-label={s.alive.CT + ' 名 CT 存活'}>
              {[0, 1, 2, 3, 4].map((i) => (
                <i className={i < s.alive.CT ? 'up' : ''} key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="upper-right">
          <div className={'objective ' + (bombPlanted ? 'urgent' : '')}>
            <div className="objective-icon">
              <Icon name={bombPlanted ? 'clock' : s.team === 'T' ? 'bomb' : 'shield'} size={24} />
            </div>
            <div>
              <span className="micro">ROUND OBJECTIVE</span>
              <strong>{objective}</strong>
            </div>
          </div>
          <div className="killfeed">
            {s.feed.map((f) => (
              <div key={f.id}>
                <b className={f.team.toLowerCase()}>{f.killer}</b>
                <GunArt id={f.weapon} />
                {f.head && <Icon name="head" size={13} />}
                <span>{f.victim}</span>
              </div>
            ))}
          </div>
        </div>
        {s.scope && (
          <div className="scope-mask">
            <div className="optic">
              <i />
              <b />
            </div>
          </div>
        )}
        {!s.scope && !board && (
          <div
            aria-label="准星"
            className={'crosshair ' + (s.hit > 0 ? 'hit' : '')}
            style={
              {
                '--gap': 4 + a.spread * 157 + (a.moving > 0.4 ? 2 : 0) + 'px',
              } as React.CSSProperties
            }
          >
            <i />
            <i />
            <i />
            <i />
            <b />
          </div>
        )}
        {s.hit > 0 && <div className="hitmark">×</div>}
        {s.damage > 0 && <div className="hurt-overlay" style={{ opacity: s.damage * 1.65 }} />}
        {s.flash > 0 && <div className="flash-overlay" style={{ opacity: s.flash * 0.85 }} />}
        <div className="vital-hud">
          <div className="vital health">
            <Icon name="heart" size={24} />
            <div>
              <strong>{Math.ceil(a.hp)}</strong>
              <small>HEALTH</small>
            </div>
          </div>
          <i />
          <div className="vital armor">
            <Icon name="shield" size={23} />
            <div>
              <strong>{Math.ceil(a.armor)}</strong>
              <small>ARMOR</small>
            </div>
          </div>
        </div>
        <div className="ammo-hud">
          <div className="ammo-identity">
            <span>{w.name}</span>
            <small>
              <i />
              {w.automatic ? 'AUTO' : w.slot === 2 ? 'MELEE' : w.id === 'awp' ? 'BOLT' : 'SEMI'}
            </small>
          </div>
          <i className="ammo-divider" />
          <div className="ammo-amount">
            <div>
              {w.slot === 2 ? (
                <strong>∞</strong>
              ) : (
                <>
                  <strong className={ammo.ammo <= 3 ? 'low' : ''}>{ammo.ammo}</strong>
                  <em>/</em>
                  <b>{ammo.reserve}</b>
                </>
              )}
            </div>
            <small>
              {a.reloadLeft > 0 ? '换弹中 ' + a.reloadLeft.toFixed(1) + 's' : 'AMMUNITION'}
            </small>
          </div>
        </div>
        {live && !s.spectating && (s.prompt || a.reloadLeft > 0 || mine) && (
          <div className={'interaction ' + (s.progress ? 'working' : '')}>
            <Icon name={a.reloadLeft > 0 ? 'bullets' : 'bomb'} size={15} />
            {a.reloadLeft > 0 ? '正在更换弹匣' : s.prompt || '携带 C4'}
            {(s.progress > 0 || a.reloadLeft > 0) && (
              <i
                style={{
                  width: 100 * (a.reloadLeft ? 1 - a.reloadLeft / w.reload : s.progress) + '%',
                }}
              />
            )}
          </div>
        )}
        {live && s.spectating && !board && (
          <div className="spectator">
            <Icon name="eye" />
            <div>
              <small>队友观战</small>
              <strong>{a.name}</strong>
            </div>
            <button onClick={() => game.current?.match.cycle()}>
              <Key>Q</Key> 切换
            </button>
            <button className="accent-link" onClick={() => game.current?.match.takeover()}>
              <Key>↵</Key> 接管队友
            </button>
          </div>
        )}
        {live && !s.spectating && (
          <div className="touch-controls">
            <div className="touch-pad">
              {[
                ['W', '▲'],
                ['A', '◀'],
                ['S', '▼'],
                ['D', '▶'],
              ].map(([k, label]) => (
                <button
                  key={k}
                  aria-label={'移动 ' + k}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    game.current?.match.key('Key' + k, true)
                  }}
                  onPointerUp={() => game.current?.match.key('Key' + k, false)}
                  onPointerCancel={() => game.current?.match.key('Key' + k, false)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="touch-act">
              {['跳', 'E', '瞄', '火'].map((k) => (
                <button
                  key={k}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    const m = game.current!.match
                    if (k === '火') {
                      m.tapped = true
                      m.trigger = true
                    } else if (k === '瞄') {
                      m.scope()
                    } else m.key(k === '跳' ? 'Space' : 'KeyE', true)
                  }}
                  onPointerUp={() => {
                    const m = game.current!.match
                    m.trigger = false
                    m.key(k === '跳' ? 'Space' : 'KeyE', false)
                  }}
                  onPointerCancel={() => game.current?.match.clearInput()}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}
        {s.phase === 'paused' && !panel && !board && (
          <div className="center-layer">
            <div className="pause-panel">
              <span className="micro">
                <i className="amber-dash" /> MATCH PAUSED
              </span>
              <h2>对局已暂停</h2>
              <button className="primary-btn" onClick={launch}>
                <Icon name="play" size={16} />
                继续对局
                <Icon name="enter" size={17} />
              </button>
              <button className="text-btn" onClick={() => game.current?.lobby()}>
                返回准备区
              </button>
            </div>
          </div>
        )}
        {(s.phase === 'roundEnd' || s.phase === 'matchEnd') && !board && (
          <div className="round-result">
            <TeamMark team={s.winner ?? 'T'} />
            <div>
              <span className="micro">
                {s.phase === 'matchEnd' ? 'MATCH COMPLETE' : 'ROUND COMPLETE'}
              </span>
              <h2>
                {s.phase === 'matchEnd' && s.scores.T === s.scores.CT
                  ? '对局平局'
                  : (s.winner === 'T' ? '进攻方' : '防守方') + '胜利'}
              </h2>
              <p>
                {s.reason} · {s.scores.T} – {s.scores.CT}
              </p>
            </div>
            {s.phase === 'roundEnd' ? (
              <small>{Math.ceil(s.endIn)}s 后下一回合</small>
            ) : (
              <button className="primary-btn" onClick={() => game.current?.lobby()}>
                返回准备区
              </button>
            )}
          </div>
        )}
        {(!ready || error) && (
          <div className="center-layer">
            <div className="pause-panel">
              {error ? (
                <>
                  <h2>渲染器未就绪</h2>
                  <p>{error}</p>
                  <button className="primary-btn" onClick={() => location.reload()}>
                    重新载入
                  </button>
                </>
              ) : (
                <span>正在构建战场…</span>
              )}
            </div>
          </div>
        )}
        {board && (
          <div className="center-layer board-layer">
            <div className="match-board">
              <div className="board-heading">
                <div>
                  <span className="micro">SCOREBOARD</span>
                  <h2>对局计分板</h2>
                </div>
                <strong>
                  {s.scores.T} <em>:</em> {s.scores.CT}
                </strong>
              </div>
              <div className="board-teams">
                {(['T', 'CT'] as Team[]).map((t) => (
                  <div key={t}>
                    <div className={'board-team ' + t.toLowerCase()}>
                      <TeamMark team={t} />
                      {t === 'T' ? '进攻方' : '防守方'}
                      <small>{s.alive[t]} / 5</small>
                    </div>
                    <div className="roster-row legend">
                      <span>队员</span>
                      <span>K</span>
                      <span>D</span>
                      <span>HP</span>
                    </div>
                    {s.actors
                      .filter((a) => a.team === t)
                      .map((p) => (
                        <div className={'roster-row ' + (p.alive ? '' : 'dead')} key={p.id}>
                          <span>
                            {p.name}
                            {p.id === s.playerId && <i>你</i>}
                            {s.bomb.carrier === p.id && <Icon name="bomb" size={13} />}
                          </span>
                          <span>{p.kills}</span>
                          <span>{p.deaths}</span>
                          <span>{Math.ceil(p.hp)}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <section className="loadout-deck" aria-label="地图与作战配装">
        <div className="map-card">
          <div className="deck-label">
            <i className="amber-dash" />
            战区地图 <span>/ MAP</span>
          </div>
          <h1>DUST II</h1>
          <div className="map-meta">
            <Icon name="crosshair" size={14} />
            爆破模式
            <i />5 VS 5
          </div>
        </div>
        <div className="equipment">
          <div className="deck-topline">
            <div className="deck-label">
              作战配装 <span>/ LOADOUT</span>
            </div>
            <span className="team-label">
              <i className={s.team.toLowerCase()} />
              {s.team === 'T' ? 'T · 进攻方' : 'CT · 防守方'}
            </span>
          </div>
          <div className="slot-row">
            {([0, 1, 2] as Slot[]).map((n) => {
              const m = a.inventory[n],
                active = a.slot === n
              return (
                <button
                  key={n}
                  className={'weapon-card ' + (active ? 'selected ' : '') + (!m ? 'empty' : '')}
                  disabled={!m || s.spectating}
                  aria-label={m ? SLOT_NAMES[n] + ' ' + WEAPONS[m.id].name : SLOT_NAMES[n] + ' 空'}
                  onClick={() => slot(n)}
                >
                  <span className="slot-heading">
                    <kbd>{n + 1}</kbd>
                    {SLOT_EN[n]}
                  </span>
                  {m ? (
                    <>
                      <GunArt id={m.id} />
                      <span className="slot-name">{WEAPONS[m.id].name}</span>
                      {active && <i className="selection-dot" />}
                    </>
                  ) : (
                    <>
                      <Icon name="lock" />
                      <span className="slot-name">手枪局</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="deploy-area">
          {lobby ? (
            <>
              <button className="mode-pick" onClick={() => open('mode')}>
                <i />
                {s.options.pistolRound ? '手枪局开局' : '步枪局开局'}
                <Icon name="chevron" size={13} />
              </button>
              <button className="primary-btn deploy" disabled={!ready} onClick={launch}>
                <Icon name="play" size={15} />
                <span>进入战局</span>
                <Icon name="arrow" size={20} />
              </button>
            </>
          ) : (
            <>
              <span className="session-state">
                <i />
                {s.phase === 'paused'
                  ? '对局已暂停'
                  : s.phase === 'live'
                    ? '对局进行中'
                    : '回合结算'}
              </span>
              <button
                className="secondary-btn deploy"
                onClick={() => {
                  if (s.phase === 'paused') launch()
                  else if (live) game.current?.pause()
                  else if (s.phase === 'roundEnd') game.current?.match.nextRound()
                  else game.current?.lobby()
                }}
              >
                <Icon name={live ? 'pause' : 'play'} size={16} />
                <span>
                  {live
                    ? '暂停对局'
                    : s.phase === 'paused'
                      ? '继续对局'
                      : s.phase === 'roundEnd'
                        ? '下一回合'
                        : '返回准备区'}
                </span>
              </button>
            </>
          )}
        </div>
      </section>
      <footer className="input-strip">
        <div className="key-hints">
          <span>
            <Key>W</Key>
            <Key>A</Key>
            <Key>S</Key>
            <Key>D</Key>
            <label>移动</label>
          </span>
          <span>
            <Icon name="mouse" size={14} />
            <label>视角 / 射击</label>
          </span>
          <span>
            <Key>SPACE</Key>
            <label>跳跃</label>
          </span>
          <span>
            <Key>R</Key>
            <label>换弹</label>
          </span>
          <span>
            <Key>E</Key>
            <label>交互</label>
          </span>
          <span>
            <Key>TAB</Key>
            <label>计分板</label>
          </span>
        </div>
        <button className="guide-link" onClick={() => open('guide')}>
          <Icon name="keyboard" size={16} />
          操作指南<Key>H</Key>
        </button>
      </footer>
      {notice && (
        <div className="notice-toast" role="status">
          {notice}
        </div>
      )}
      {panel && (
        <div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) open(null)
          }}
        >
          <div
            className={'dialog ' + (panel === 'guide' ? 'guide-dialog' : '')}
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-header">
              <div>
                <div className="micro">
                  <i className="amber-dash" />
                  {panel === 'guide'
                    ? 'FIELD MANUAL'
                    : panel === 'settings'
                      ? 'SETTINGS'
                      : panel === 'mode'
                        ? 'MATCH SETUP'
                        : 'ARMORY'}
                </div>
                <h2 id="dialog-title">{headerTitle}</h2>
              </div>
              <button className="icon-btn" aria-label="关闭" onClick={() => open(null)}>
                <Icon name="close" />
              </button>
            </div>
            {panel === 'settings' && (
              <div className="settings-body">
                <div className="setting-row">
                  <label htmlFor="sensitivity">鼠标灵敏度</label>
                  <output>{s.options.sensitivity.toFixed(2)}×</output>
                  <input
                    id="sensitivity"
                    type="range"
                    min=".25"
                    max="2.2"
                    step=".05"
                    value={s.options.sensitivity}
                    onChange={(e) => config({ sensitivity: +e.target.value })}
                  />
                </div>
                <div className="setting-row">
                  <label htmlFor="volume">音效音量</label>
                  <output>{Math.round(s.options.volume * 100)}%</output>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="1"
                    step=".01"
                    value={s.options.volume}
                    onChange={(e) => {
                      game.current?.synth.unlock()
                      config({ volume: +e.target.value, muted: false })
                    }}
                    onPointerUp={() => game.current?.synth.play('equip')}
                  />
                </div>
                {lobby && (
                  <>
                    <div className="setting-section">
                      <strong>选择阵营</strong>
                      <div className="segmented">
                        {(['T', 'CT'] as Team[]).map((t) => (
                          <button
                            key={t}
                            className={s.team === t ? 'on' : ''}
                            onClick={() => config({ team: t })}
                          >
                            <TeamMark team={t} />
                            {t === 'T' ? 'T 进攻方' : 'CT 防守方'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="setting-section">
                      <strong>首回合配置</strong>
                      <div className="segmented">
                        <button
                          className={!s.options.pistolRound ? 'on' : ''}
                          onClick={() => config({ pistolRound: false })}
                        >
                          步枪局
                        </button>
                        <button
                          className={s.options.pistolRound ? 'on' : ''}
                          onClick={() => config({ pistolRound: true })}
                        >
                          手枪局
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <button className="primary-btn dialog-finish" onClick={() => open(null)}>
                  完成
                  <Icon name="check" size={16} />
                </button>
              </div>
            )}
            {panel === 'mode' && (
              <div className="mode-options">
                {[false, true].map((p) => (
                  <button
                    key={Number(p)}
                    className={'mode-option ' + (s.options.pistolRound === p ? 'chosen' : '')}
                    onClick={() => {
                      config({ pistolRound: p })
                      open(null)
                    }}
                  >
                    <GunArt id={p ? (s.team === 'T' ? 'glock' : 'usp') : s.options.primary} />
                    <div>
                      <strong>{p ? '手枪局' : '步枪局'}</strong>
                      <p>
                        {p
                          ? '首轮全员仅配阵营手枪、匕首，护甲为 0。'
                          : '全员配备主武器、副武器、匕首与满护甲。'}
                      </p>
                    </div>
                    {s.options.pistolRound === p && <Icon name="check" />}
                  </button>
                ))}
              </div>
            )}
            {(panel === 'primary' || panel === 'sidearm') && (
              <div className="armory-options">
                {(panel === 'primary'
                  ? ['ak', 'm4', 'awp']
                  : s.options.pistolRound && s.round === 1
                    ? [s.team === 'T' ? 'glock' : 'usp']
                    : ['glock', 'usp', 'deagle']
                ).map((code) => {
                  const id = code as WeaponId,
                    gun = WEAPONS[id],
                    equipped = a.inventory[gun.slot]?.id === id
                  return (
                    <button
                      key={id}
                      className={'armory-weapon ' + (equipped ? 'chosen' : '')}
                      onClick={() => {
                        config(gun.slot === 0 ? { primary: id } : { pistol: id })
                        game.current?.match.slot(gun.slot)
                        open(null)
                      }}
                    >
                      <div className="weapon-preview">
                        <GunArt id={id} />
                      </div>
                      <div>
                        <strong>{gun.name}</strong>
                        <span>
                          {id === 'awp'
                            ? '栓动狙击步枪'
                            : gun.automatic
                              ? '全自动步枪'
                              : '半自动手枪'}
                        </span>
                        <small>
                          伤害 {gun.damage} <i /> 弹匣 {gun.capacity}
                        </small>
                      </div>
                      {equipped && <Icon name="check" size={16} />}
                    </button>
                  )
                })}
              </div>
            )}
            {panel === 'guide' && (
              <>
                <div className="guide-tabs">
                  <button
                    className={guideTab === 'controls' ? 'on' : ''}
                    onClick={() => setGuideTab('controls')}
                  >
                    <Icon name="keyboard" size={16} />
                    操作键位
                  </button>
                  <button
                    className={guideTab === 'map' ? 'on' : ''}
                    onClick={() => setGuideTab('map')}
                  >
                    <Icon name="map" size={16} />
                    地图与任务
                  </button>
                </div>
                {guideTab === 'controls' ? (
                  <div className="control-list">
                    {controls.map(([key, name]) => (
                      <div key={key}>
                        <span>{name}</span>
                        <Key>{key}</Key>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="guide-map">
                    <Radar {...radar} large />
                    <div>
                      <h3>Dust II · 爆破任务</h3>
                      <p>
                        T 可经 A 大门进入 A 大道，或从中路登上猫道抵达 A 点。B 洞连通 T
                        侧通道、中路与 B 点。
                      </p>
                      <p>CT 出生点通过中门接入中路，两侧分别通往 A 坡道与 B 门。</p>
                      <p>
                        持包者在爆破点长按 E 3 秒安放 C4。引爆倒计时为 40 秒，CT 靠近后长按 E 5
                        秒完成拆除。
                      </p>
                      <div className="map-legend">
                        <span>
                          <i />
                          自己
                        </span>
                        <span>
                          <i />
                          队友
                        </span>
                        <span>
                          <i />
                          敌人
                        </span>
                        <span>
                          <i />
                          C4
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default App

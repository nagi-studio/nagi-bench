import { useEffect, useRef, useState } from 'react'
import type { HudState, KillEntry, Team } from '../game/types.ts'
import { Minimap } from './Minimap.tsx'
import { clamp } from '../game/core/mathUtil.ts'

interface Props {
  hud: HudState
  onExit: () => void
}

const TEAM_TEXT: Record<Team, string> = { T: 'T', CT: 'CT' }

/** 计数器变化时返回一个递增的 key，用来重新触发 CSS 动画 */
function useBump(counter: number): number {
  const [key, setKey] = useState(0)
  const prev = useRef(counter)
  useEffect(() => {
    if (counter !== prev.current) {
      prev.current = counter
      setKey((k) => k + 1)
    }
  }, [counter])
  return key
}

function fmtTime(sec: number): string {
  const s = Math.ceil(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function Hud({ hud, onExit }: Props) {
  const me = hud.me
  const alive = !!me && me.alive
  const scoped = alive && !!me && me.scoped
  const teamColor = hud.playerTeam === 'T' ? '#ffb347' : '#5aa8ff'
  const hitKey = useBump(hud.hitCount)
  const dmgKey = useBump(hud.damageCount)

  return (
    <div className="hud">
      {scoped && <div className="scope" />}
      {alive && !scoped && me && <Crosshair spread={me.spread} />}
      {hitKey > 0 && <div key={`hit${hitKey}`} className="hitmarker" />}
      {dmgKey > 0 && (
        <div key={`dmg${dmgKey}`} className="dmg-flash">
          <div className="dmg-dir" style={{ transform: `rotate(${-(hud.lastDamageAngle * 180) / Math.PI}deg)` }} />
        </div>
      )}

      <Minimap hud={hud} teamColor={teamColor} />
      <TeamPanel hud={hud} />
      <RoundPanel hud={hud} />
      <Killfeed items={hud.killfeed} />
      {hud.banner && (
        <div key={hud.banner.id} className="banner">
          {hud.banner.text}
        </div>
      )}
      {hud.phase === 'freeze' && (
        <div className="freeze">
          <div className="freeze-num">{Math.ceil(hud.freezeLeft)}</div>
          <div>回合即将开始</div>
        </div>
      )}

      {alive && me && (
        <>
          <div className="vitals">
            <Bar label="生命" value={me.hp} max={100} color="#e5484d" />
            <Bar label="护甲" value={me.armor} max={100} color="#4aa3ff" />
          </div>
          <AmmoPanel hud={hud} />
          {me.action && (
            <div className="action">
              <div>{me.action.kind === 'plant' ? '正在安放 C4…' : '正在拆除 C4…'}</div>
              <div className="bar">
                <i style={{ width: `${clamp(me.action.progress, 0, 1) * 100}%` }} />
              </div>
            </div>
          )}
        </>
      )}
      {!alive && hud.phase !== 'matchOver' && (
        <div className="spectate">
          {hud.spectateName
            ? `观察：${hud.spectateName}  ·  左键 / 滚轮切换  ·  F 接管操控`
            : '你已阵亡 · 等待下一回合'}
        </div>
      )}
      {hud.phase === 'matchOver' && (
        <div className="endcard">
          <h2>比赛结束</h2>
          <p>
            胜者：{hud.winner ? TEAM_TEXT[hud.winner] : '—'}（T {hud.scores.T} : {hud.scores.CT} CT）
          </p>
          <button onClick={onExit}>返回菜单</button>
        </div>
      )}
    </div>
  )
}

function Crosshair({ spread }: { spread: number }) {
  const gap = clamp(6 + spread * 700, 6, 60)
  const len = 9
  return (
    <div className="crosshair">
      <i style={{ width: 2, height: len, transform: `translate(-1px, ${-gap - len}px)` }} />
      <i style={{ width: 2, height: len, transform: `translate(-1px, ${gap}px)` }} />
      <i style={{ width: len, height: 2, transform: `translate(${-gap - len}px, -1px)` }} />
      <i style={{ width: len, height: 2, transform: `translate(${gap}px, -1px)` }} />
      <b />
    </div>
  )
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <div className="bar">
        <i style={{ width: `${clamp(value / max, 0, 1) * 100}%`, background: color }} />
      </div>
      <b>{Math.round(value)}</b>
    </div>
  )
}

function RoundPanel({ hud }: { hud: HudState }) {
  const b = hud.bomb
  let bombText = ''
  if (b.state === 'carried') bombText = b.visible ? 'C4 携带中' : ''
  else if (b.state === 'dropped') bombText = 'C4 掉落在地'
  else if (b.state === 'planted') bombText = `C4 已安放 · ${b.site} 点 · ${b.timeLeft.toFixed(1)}s`
  else if (b.state === 'defused') bombText = 'C4 已拆除'
  else if (b.state === 'exploded') bombText = 'C4 已爆炸'
  return (
    <div className="round">
      <div className="score">
        <span className="t">T {hud.scores.T}</span>
        <b>{fmtTime(hud.roundTimeLeft)}</b>
        <span className="ct">{hud.scores.CT} CT</span>
      </div>
      <div className="sub">
        第 {hud.round} 回合{hud.pistol ? ' · 手枪局' : ''}
      </div>
      {bombText && <div className={`bomb-state ${b.state}`}>{bombText}</div>}
    </div>
  )
}

function TeamPanel({ hud }: { hud: HudState }) {
  return (
    <div className="team">
      {hud.mates.map((m) => (
        <div key={m.id} className={`mate ${m.alive ? '' : 'dead'} ${m.isHuman ? 'me' : ''}`}>
          <span className="name">
            {m.name}
            {m.hasBomb ? ' 💣' : ''}
          </span>
          <div className="bar small">
            <i style={{ width: `${clamp(m.hp / 100, 0, 1) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Killfeed({ items }: { items: KillEntry[] }) {
  return (
    <div className="killfeed">
      {items.map((k) => (
        <div key={k.id} className="kf-item">
          <span className={k.killerTeam === 'T' ? 't' : 'ct'}>{k.killer}</span>
          <span className="kf-w">{k.headshot ? '🎯' : ''} {k.weapon}</span>
          <span className="victim">{k.victim}</span>
        </div>
      ))}
    </div>
  )
}

function AmmoPanel({ hud }: { hud: HudState }) {
  const me = hud.me
  if (!me) return null
  const melee = me.weaponId === 'knife'
  return (
    <div className="ammo">
      <div className="wname">{me.weaponName}{me.scoped ? ' · 开镜' : ''}</div>
      {melee ? (
        <div className="mag">∞</div>
      ) : (
        <div className="mag">
          <b className={me.mag === 0 ? 'empty' : ''}>{me.mag}</b>
          <span> / {me.reserve}</span>
        </div>
      )}
      {me.reloading && (
        <div className="reload">
          换弹中
          <div className="bar small">
            <i style={{ width: `${clamp(me.reloadProgress, 0, 1) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import type { GameState, Entity } from '../game/types'
import { WEAPONS } from '../game/weapons'

// 2D HUD overlay: crosshair, health/armour, ammo panel, killfeed, bomb status,
// round info. Pure React reading the snapshot; no three.js here.
export default function Hud({ s, player }: { s: GameState; player: Entity }) {
  const def = WEAPONS[player.current]
  const mag = player.ammoMag[player.current] ?? 0
  const reserve = player.ammoReserve[player.current] ?? 0
  const reloading = s.time < player.reloadUntil

  // last 5 killfeed entries, newest last
  const feed = s.kills.slice(-5).reverse()

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5, fontFamily: 'inherit' }}>
      {/* crosshair (dynamic spread) */}
      {!player.scoped && player.alive && <Crosshair spread={def.spread + Math.min(0.04, player.shotIndex * 0.003)} />}

      {/* top-centre: round score + timer */}
      <div style={styles.topBar}>
        <div style={styles.teamScore}>
          <span style={{ color: '#66c2ff' }}>CT {s.scoreCT}</span>
          <span style={styles.roundNo}>R{s.roundNumber}</span>
          <span style={{ color: '#ffb347' }}>{s.scoreT} T</span>
        </div>
        <div style={styles.timer}>
          {s.bomb.planted ? (
            <span style={{ color: '#ff5b4a' }}>
              C4 {fmt(Math.max(0, s.bomb.fuseSeconds - (s.time - s.bomb.plantedAt)))}
            </span>
          ) : (
            <span>{fmt(Math.max(0, s.phaseEndsAt - s.time))}</span>
          )}
        </div>
        {s.phase === 'over' && (
          <div style={styles.roundOver}>
            <span style={{ color: s.winner === 'CT' ? '#66c2ff' : '#ffb347' }}>
              {s.winner === 'CT' ? 'CT WIN' : 'T WIN'}
            </span>
            <span style={styles.winReason}>{s.winReason}</span>
          </div>
        )}
        {s.time < s.freezeUntil && s.phase === 'live' && (
          <div style={styles.freeze}>冻结时间 · 回合开始</div>
        )}
      </div>

      {/* killfeed top-right */}
      <div style={styles.killfeed}>
        {feed.map((k, i) => {
          const killer = s.entities.find((e) => e.id === k.killerId)
          const victim = s.entities.find((e) => e.id === k.victimId)
          if (!killer || !victim) return null
          return (
            <div key={s.kills.length - i} style={styles.feedRow}>
              <span style={{ color: killer.team === 'CT' ? '#66c2ff' : '#ffb347' }}>{killer.name}</span>
              <span style={styles.feedIcon}>[{WEAPONS[k.weapon as keyof typeof WEAPONS]?.name ?? k.weapon}{k.headshot ? ' HS' : ''}]</span>
              <span style={{ color: victim.team === 'CT' ? '#66c2ff' : '#ffb347' }}>{victim.name}</span>
            </div>
          )
        })}
      </div>

      {/* bottom-left: health + armour */}
      <div style={styles.vitals}>
        <div style={styles.vitalRow}>
          <span style={styles.vitalIcon}>+</span>
          <span style={styles.vitalNum}>{Math.ceil(player.health)}</span>
        </div>
        <div style={styles.vitalRow}>
          <span style={{ ...styles.vitalIcon, color: '#66c2ff' }}>{player.hasHelmet ? 'H' : 'A'}</span>
          <span style={styles.vitalNum}>{Math.ceil(player.armour)}</span>
        </div>
      </div>

      {/* bottom-right: ammo + held weapon */}
      <div style={styles.ammo}>
        <div style={styles.ammoWeapon}>{def.name}</div>
        <div style={styles.ammoNums}>
          <span style={styles.ammoMag}>{reloading ? '--' : def.melee ? '∞' : mag}</span>
          {!def.melee && <span style={styles.ammoRes}> / {reserve}</span>}
        </div>
        {player.hasBomb && <div style={styles.hasBomb}>持有 C4 · 右键下包</div>}
      </div>

      {/* bomb defuse progress */}
      {s.bomb.planted && s.bomb.defuserId === player.id && (
        <div style={styles.defuseWrap}>
          <div style={{ ...styles.defuseBar, width: `${s.bomb.defuseProgress * 100}%` }} />
          <span style={styles.defuseLabel}>拆包中 · 按住 E</span>
        </div>
      )}
    </div>
  )
}

function Crosshair({ spread }: { spread: number }) {
  const gap = 6 + spread * 900
  const len = 9
  const t = 2
  const c = 'rgba(80,255,120,0.9)'
  const line = (style: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute', background: c, boxShadow: '0 0 2px rgba(0,0,0,0.8)', ...style,
  })
  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
      <div style={line({ width: t, height: len, left: -t / 2, top: -gap - len })} />
      <div style={line({ width: t, height: len, left: -t / 2, top: gap })} />
      <div style={line({ width: len, height: t, top: -t / 2, left: -gap - len })} />
      <div style={line({ width: len, height: t, top: -t / 2, left: gap })} />
      <div style={line({ width: t, height: t, left: -t / 2, top: -t / 2, background: 'rgba(80,255,120,0.6)' })} />
    </div>
  )
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const styles: Record<string, React.CSSProperties> = {
  topBar: { position: 'absolute', left: '50%', top: 14, transform: 'translateX(-50%)', textAlign: 'center' },
  teamScore: { display: 'flex', gap: 14, alignItems: 'center', fontSize: 15, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' },
  roundNo: { fontSize: 11, color: '#c8ced6', letterSpacing: '0.1em' },
  timer: { fontSize: 22, fontWeight: 700, color: '#eef1f4', fontVariantNumeric: 'tabular-nums', textShadow: '0 2px 6px rgba(0,0,0,0.85)', marginTop: 2 },
  roundOver: { marginTop: 4, fontSize: 15, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 2 },
  winReason: { fontSize: 11, color: '#b6bdc6', fontWeight: 400 },
  freeze: { marginTop: 6, fontSize: 12, color: '#ffd27a', letterSpacing: '0.08em' },
  killfeed: { position: 'absolute', right: 16, top: 14, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' },
  feedRow: { display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, padding: '3px 8px', borderRadius: 6, background: 'rgba(10,14,20,0.55)', textShadow: '0 1px 2px rgba(0,0,0,0.7)' },
  feedIcon: { color: '#c8ced6', fontSize: 10.5 },
  vitals: { position: 'absolute', left: 20, bottom: 20, display: 'flex', gap: 18 },
  vitalRow: { display: 'flex', alignItems: 'center', gap: 7, textShadow: '0 1px 3px rgba(0,0,0,0.85)' },
  vitalIcon: { fontSize: 20, color: '#7dffa0', fontWeight: 700, lineHeight: 1 },
  vitalNum: { fontSize: 26, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' },
  ammo: { position: 'absolute', right: 20, bottom: 20, textAlign: 'right', textShadow: '0 1px 3px rgba(0,0,0,0.85)' },
  ammoWeapon: { fontSize: 12, color: '#c8ced6', letterSpacing: '0.08em' },
  ammoNums: { display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' },
  ammoMag: { fontSize: 30, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' },
  ammoRes: { fontSize: 16, color: '#9aa3ad', fontVariantNumeric: 'tabular-nums' },
  hasBomb: { marginTop: 4, fontSize: 11, color: '#ffb347', fontWeight: 600 },
  defuseWrap: { position: 'absolute', left: '50%', bottom: 120, transform: 'translateX(-50%)', width: 220, height: 20, background: 'rgba(10,14,20,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' },
  defuseBar: { height: '100%', background: 'linear-gradient(90deg,#66c2ff,#8fe0ff)', transition: 'width 0.08s linear' },
  defuseLabel: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, color: '#fff', fontWeight: 600 },
}

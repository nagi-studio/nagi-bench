// HUD：准星、生命/护甲、弹药、击杀播报、回合信息、小地图
import React from 'react'
import type { GameStatus } from '../game/types'
import { WORLD, FLOORS } from '../game/map'

interface Props {
  status: GameStatus
  /** minimap 需要实时位置，每帧由 App 注入 */
  me: { x: number; z: number; yaw: number }
  allies: { x: number; z: number; id: number }[]
  bomb: { x: number; y: number; z: number } | null
}

export function Hud({ status, me, allies, bomb }: Props): React.ReactElement {
  const h = status.hud

  return (
    <div style={rootStyle}>
      {/* 准星 */}
      {h.alive && h.slot !== 'melee' && (
        <div style={crosshairBox}>
          <i style={{ ...crossV, top: 0, left: '50%', marginLeft: -1 }} />
          <i style={{ ...crossV, bottom: 0, left: '50%', marginLeft: -1 }} />
          <i style={{ ...crossH, left: 0, top: '50%', marginTop: -1 }} />
          <i style={{ ...crossH, right: 0, top: '50%', marginTop: -1 }} />
        </div>
      )}

      {/* AWP 开镜遮罩 */}
      {h.scoped && <div style={scopeOverlay} />}

      {/* 顶部比分与时间 */}
      <div style={topBar}>
        <div style={scoreBox}>
          <span style={{ color: '#6fa8dc' }}>CT {h.scoreCT}</span>
          <span style={timerStyle}>{formatTime(h.roundTime)}</span>
          <span style={{ color: '#e0a850' }}>{h.scoreT} T</span>
        </div>
        <div style={aliveRow}>
          <span style={{ color: '#6fa8dc' }}>存活 {status.alive.CT}</span>
          <span style={{ color: '#e0a850' }}>{status.alive.T} 存活</span>
        </div>
        {h.bombPlanted && (
          <div style={bombTimer}>C4 已安放 · {formatTime(h.roundTime)}</div>
        )}
      </div>

      {/* 击杀播报 */}
      <div style={killfeed}>
        {status.killfeed.map((k) => (
          <div key={k.id} style={killRow}>
            <span style={{ color: k.killerTeam === 'CT' ? '#6fa8dc' : '#e0a850' }}>
              {k.killer}
            </span>
            <span style={{ color: '#8b8f96', margin: '0 7px' }}>
              {k.headshot ? '◎' : '›'}
            </span>
            <span style={{ color: k.weapon }}>{k.weapon}</span>
            <span style={{ color: '#8b8f96', margin: '0 7px' }}>›</span>
            <span style={{ color: k.victimTeam === 'CT' ? '#6fa8dc' : '#e0a850' }}>
              {k.victim}
            </span>
          </div>
        ))}
      </div>

      {/* 左下：生命 / 护甲 */}
      <div style={bottomLeft}>
        {h.alive ? (
          <>
            <div style={statRow}>
              <span style={statLabel}>HP</span>
              <span style={{ ...statVal, color: h.hp > 50 ? '#e8eef5' : '#e05a4a' }}>
                {h.hp}
              </span>
            </div>
            <div style={statRow}>
              <span style={statLabel}>护甲</span>
              <span style={{ ...statVal, color: '#8fb4d8' }}>{h.armor}</span>
            </div>
          </>
        ) : (
          <div style={{ color: '#e05a4a', fontSize: 14 }}>已阵亡 · 观战中</div>
        )}
      </div>

      {/* 右下：弹药 */}
      <div style={bottomRight}>
        {h.alive && (
          <>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '0.04em' }}>
              {h.slot === 'melee' ? '∞' : h.ammo}
              {h.slot !== 'melee' && (
                <span style={reserveVal}> / {h.magSize}</span>
              )}
            </div>
            <div style={weaponName}>{h.weaponName}</div>
          </>
        )}
      </div>

      {/* 小地图 */}
      <div style={minimapBox}>
        <MiniMap me={me} allies={allies} bomb={bomb} />
      </div>

      {/* 回合横幅 */}
      {h.banner && (
        <div style={banner}>{h.banner}</div>
      )}

      {/* 操作提示 */}
      {h.alive && (
        <div style={hintRow}>
          WASD 移动 · 空格 跳 · 左键射击 · 右键开镜 · R 换弹 · 1/2/3 换枪 · 滚轮切换
        </div>
      )}
    </div>
  )
}

function MiniMap({
  me,
  allies,
  bomb
}: {
  me: { x: number; z: number; yaw: number }
  allies: { x: number; z: number; id: number }[]
  bomb: { x: number; y: number; z: number } | null
}): React.ReactElement {
  const W = WORLD.maxX - WORLD.minX
  const D = WORLD.maxZ - WORLD.minZ
  const S = 168
  const px = (x: number): number => ((x - WORLD.minX) / W) * S
  const pz = (z: number): number => ((z - WORLD.minZ) / D) * S

  return (
    <svg width={S} height={S} style={{ display: 'block' }}>
      <rect x={0} y={0} width={S} height={S} fill="rgba(12,14,18,0.78)" />
      {/* 可行走面 */}
      {FLOORS.map((f, i) => (
        <rect
          key={i}
          x={px(f.minX)}
          y={pz(f.minZ)}
          width={((f.maxX - f.minX) / W) * S}
          height={((f.maxZ - f.minZ) / D) * S}
          fill="rgba(120,134,150,0.28)"
          stroke="rgba(160,175,192,0.34)"
          strokeWidth={0.6}
        />
      ))}
      {/* 炸弹 */}
      {bomb && (
        <circle cx={px(bomb.x)} cy={pz(bomb.z)} r={3.4} fill="#ff3b30">
          <animate attributeName="opacity" values="1;0.25;1" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      {/* 队友 */}
      {allies.map((a) => (
        <circle key={a.id} cx={px(a.x)} cy={pz(a.z)} r={2.6} fill="#5fa8e8" opacity={0.9} />
      ))}
      {/* 自己 */}
      <g transform={`translate(${px(me.x)},${pz(me.z)}) rotate(${(me.yaw * 180) / Math.PI + 180})`}>
        <polygon points="0,-6 4.2,5 0,2.6 -4.2,5" fill="#8ff0a8" stroke="#0b0d10" strokeWidth={0.8} />
      </g>
    </svg>
  )
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/* ---------------- 样式 ---------------- */
const rootStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  fontFamily: "'Segoe UI', 'PingFang SC', sans-serif",
  color: '#e8eef5',
  userSelect: 'none'
}

const crosshairBox: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 26,
  height: 26,
  transform: 'translate(-50%,-50%)'
}

const crossV: React.CSSProperties = {
  position: 'absolute',
  width: 2,
  height: 8,
  background: 'rgba(126,255,166,.92)',
  boxShadow: '0 0 3px rgba(0,0,0,.9)'
}

const crossH: React.CSSProperties = {
  position: 'absolute',
  height: 2,
  width: 8,
  background: 'rgba(126,255,166,.92)',
  boxShadow: '0 0 3px rgba(0,0,0,.9)'
}

const scopeOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 46%, rgba(0,0,0,.97) 62%)',
  pointerEvents: 'none'
}

const topBar: React.CSSProperties = {
  position: 'absolute',
  top: 14,
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center'
}

const scoreBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  fontSize: 19,
  fontWeight: 600,
  background: 'rgba(10,12,16,.62)',
  padding: '6px 18px',
  border: '1px solid rgba(255,255,255,.12)',
  letterSpacing: '0.05em'
}

const timerStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', Consolas, monospace",
  fontSize: 21,
  minWidth: 62,
  textAlign: 'center',
  color: '#f0f3f6'
}

const aliveRow: React.CSSProperties = {
  marginTop: 5,
  fontSize: 11.5,
  display: 'flex',
  gap: 14,
  justifyContent: 'center',
  letterSpacing: '0.05em'
}

const bombTimer: React.CSSProperties = {
  marginTop: 5,
  fontSize: 11.5,
  color: '#ff6b57',
  letterSpacing: '0.08em'
}

const killfeed: React.CSSProperties = {
  position: 'absolute',
  top: 96,
  right: 24,
  textAlign: 'right',
  fontSize: 12,
  lineHeight: 1.85
}

const killRow: React.CSSProperties = {
  display: 'block',
  background: 'rgba(10,12,16,.5)',
  padding: '2px 9px',
  marginBottom: 2
}

const bottomLeft: React.CSSProperties = {
  position: 'absolute',
  left: 26,
  bottom: 24
}

const statRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 10
}

const statLabel: React.CSSProperties = {
  fontFamily: "'SF Mono', Consolas, monospace",
  fontSize: 11,
  color: '#8b8f96',
  width: 30
}

const statVal: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  textShadow: '0 2px 6px rgba(0,0,0,.8)'
}

const bottomRight: React.CSSProperties = {
  position: 'absolute',
  right: 26,
  bottom: 24,
  textAlign: 'right'
}

const reserveVal: React.CSSProperties = {
  fontSize: 14,
  color: '#8b8f96',
  fontWeight: 400
}

const weaponName: React.CSSProperties = {
  fontSize: 11.5,
  color: '#a8b0ba',
  letterSpacing: '0.1em',
  marginTop: 2
}

const minimapBox: React.CSSProperties = {
  position: 'absolute',
  right: 24,
  top: 14,
  border: '1px solid rgba(255,255,255,.14)',
  background: 'rgba(10,12,16,.7)',
  lineHeight: 0
}

const banner: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '38%',
  transform: 'translate(-50%,-50%)',
  fontSize: 38,
  fontWeight: 700,
  letterSpacing: '0.24em',
  textShadow: '0 3px 14px rgba(0,0,0,.9)'
}

const hintRow: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: 8,
  transform: 'translateX(-50%)',
  fontSize: 10.5,
  color: 'rgba(232,238,245,.42)',
  letterSpacing: '0.08em'
}

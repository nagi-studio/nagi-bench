import { useId } from 'react'
import { regions, crates, walls, gates } from '../game/map'
import type { HudActor, Bomb, Team } from '../game/types'
const floorPlan = regions.map((r) => r.rect)
export default function Radar({
  actors,
  actor,
  team,
  bomb,
  time,
  large = false,
}: {
  actors: HudActor[]
  actor: HudActor
  team: Team
  bomb: Bomb
  time: number
  large?: boolean
}) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={'radar-graphic ' + (large ? 'large' : '')}
      viewBox="-55 -43 110 95"
      role="img"
      aria-label="Dust II 实时战术地图"
    >
      <defs>
        <pattern id={'grid' + id} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M6 0H0V6" fill="none" stroke="#849090" strokeOpacity=".12" strokeWidth=".28" />
        </pattern>
        <linearGradient id={'cone' + id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffbf70" stopOpacity=".7" />
          <stop offset="100%" stopColor="#ffbf70" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-55" y="-43" width="110" height="95" fill={'url(#grid' + id + ')'} />
      {floorPlan.map(([x, u, z, v], i) => (
        <rect key={i} x={x} y={z} width={u - x} height={v - z} fill="#536064" />
      ))}
      {walls.map((e, i) => (
        <path
          key={i}
          d={`M${e.x - (e.nz * e.length) / 2} ${e.z + (e.nx * e.length) / 2}l${e.nz * e.length} ${-e.nx * e.length}`}
          stroke="#bcc2b7"
          strokeOpacity=".84"
          strokeWidth=".8"
        />
      ))}
      {crates
        .filter((c) => !c.level)
        .map((c, i) => (
          <rect
            key={i}
            x={c.x - c.w / 2}
            y={c.z - c.d / 2}
            width={c.w}
            height={c.d}
            fill="#303b3d"
            stroke="#89918a"
            strokeWidth=".34"
          />
        ))}
      {gates.map((g) => (
        <g key={g.style} stroke="#aaa998" strokeWidth="1.5">
          <path
            d={`M${g.x - g.span / 2} ${g.z}h${g.span / 2 - g.r}m${g.r * 2} 0h${g.span / 2 - g.r}`}
          />
        </g>
      ))}
      <g fontFamily="Arial,sans-serif" fontWeight="900" fontSize="8.7" textAnchor="middle">
        <text x="35" y="-21" fill="#eaba82">
          A
        </text>
        <text x="-37.4" y="-21" fill="#eaba82">
          B
        </text>
      </g>
      {actors
        .filter((a) => a.alive && a.id !== actor.id && (a.team === team || time - a.seen < 1.6))
        .map((a) => (
          <circle
            key={a.id}
            cx={a.team === team ? a.x : a.seenPosition.x}
            cy={a.team === team ? a.z : a.seenPosition.z}
            r="1.22"
            fill={a.team === team ? '#9de2da' : '#fb665d'}
            stroke="#253333"
            strokeWidth=".38"
          />
        ))}
      {bomb.state !== 'defused' && bomb.state !== 'exploded' && (
        <rect
          x={bomb.x - 1.4}
          y={bomb.z - 1.4}
          width="2.8"
          height="2.8"
          fill="#ff8744"
          stroke="#542f1c"
          strokeWidth=".6"
          transform={`rotate(45 ${bomb.x} ${bomb.z})`}
        />
      )}
      <g transform={`translate(${actor.x} ${actor.z}) rotate(${(-actor.yaw * 180) / Math.PI})`}>
        <path d="M0 0-9-16Q0-20 9-16z" fill={'url(#cone' + id + ')'} />
        <path
          d="m0-3.75 2.65 5.95L0 1.1l-2.65 1.1z"
          fill="#fff2ca"
          stroke="#443a25"
          strokeWidth=".7"
        />
      </g>
      <text
        x="49"
        y="-36.8"
        fill="#c8cbbd"
        fontSize="4.7"
        textAnchor="middle"
        fontFamily="monospace"
      >
        N
      </text>
      <path d="m49-35.5-1.65 3.4h3.3z" fill="#bcbfb2" />
    </svg>
  )
}

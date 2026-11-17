import type { WeaponId } from '../game/types'

export function Brand() {
  return (
    <svg viewBox="0 0 48 38" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 31.5 14.9 6h17.5l10.3 11.6L35.8 32H16.4l4.4-9.3h9.1l2.6-5.1-3.5-4.1h-8.3L12.1 32z"
      />
      <path fill="currentColor" d="m1 32 7.4-16h4.2L5.2 32z" />
    </svg>
  )
}
export function TeamMark({ team }: { team: 'T' | 'CT' }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">
      {team === 'T' ? (
        <>
          <path d="m20 3 2.5 6.5 7 .4-5.5 4.4 1.8 6.6-5.8-3.8-5.8 3.8 1.8-6.6-5.5-4.4 7-.4z" />
          <path d="M3 13.5c-.5 10 6.1 18.7 15.4 21.2l.7-3.2C10.7 29.5 5.3 22.8 3 13.5Zm34 0c.5 10-6.1 18.7-15.4 21.2l-.7-3.2c8.4-2 13.8-8.7 16.1-18Z" />
          <path d="m4 20-.8-8.3L8 19.1l-.7-8.2 4.1 9.3-.1 4.6zm32 0 .8-8.3-4.8 7.4.7-8.2-4.1 9.3.1 4.6zM8 26l-4.9-4.2 7.7 2.9 3 3.8zm24 0 4.9-4.2-7.7 2.9-3 3.8zM16.4 27l3.6-5.4 3.6 5.4-3.6 3.3z" />
        </>
      ) : (
        <>
          <path d="m20 3 10 4.1v9.5c0 5.6-4.5 11-10 14.9-5.5-3.9-10-9.3-10-14.9V7.1zm0 4.1-6.6 2.6v6.7c0 3.9 3.1 8.5 6.6 11.2 3.5-2.7 6.6-7.3 6.6-11.2V9.7z" />
          <path d="m20 10.8 2.8 5.8-2.8 7.7-2.8-7.7zM8.1 10 1.5 8.1l2.6 5.4 4.1.7zm-.1 6L4.6 15l2.7 4.7 2.1.4zm23.9-6 6.6-1.9-2.6 5.4-4.1.7zm.1 6 3.4-1-2.7 4.7-2.1.4zM9 24l10.2 11L20 38 7.4 27.8zm22 0 1.6 3.8L20 38l.8-3z" />
        </>
      )}
    </svg>
  )
}
type IconName =
  | 'sound'
  | 'mute'
  | 'settings'
  | 'fullscreen'
  | 'map'
  | 'pin'
  | 'crosshair'
  | 'shield'
  | 'heart'
  | 'bomb'
  | 'chevron'
  | 'arrow'
  | 'enter'
  | 'keyboard'
  | 'mouse'
  | 'guide'
  | 'close'
  | 'check'
  | 'volume'
  | 'swap'
  | 'pause'
  | 'play'
  | 'people'
  | 'flag'
  | 'clock'
  | 'lock'
  | 'signal'
  | 'head'
  | 'eye'
  | 'bullets'
  | 'return'
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, React.ReactNode> = {
    sound: (
      <>
        <path d="M3 9h4l5-4v14l-5-4H3z" />
        <path d="M15.5 8.2a5.2 5.2 0 0 1 0 7.6M18.5 5.5a9.2 9.2 0 0 1 0 13" />
      </>
    ),
    mute: (
      <>
        <path d="M3 9h4l5-4v14l-5-4H3z" />
        <path d="m16 9 6 6m0-6-6 6" />
      </>
    ),
    settings: (
      <>
        <path d="m10 3-.7 2.3-2 .9-2.1-.7-1.9 3.3L5 10.6v2.7l-1.6 1.8 1.8 3.3 2.3-.6 1.8 1 .7 2.2h4l.7-2.2 1.8-1 2.3.6 1.8-3.3-1.6-1.8v-2.7l1.7-1.8-1.9-3.3-2.1.7-2-.9L14 3z" />
        <circle cx="12" cy="12" r="3.1" />
      </>
    ),
    fullscreen: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    map: <path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zm6-2v15m6-12v15" />,
    pin: (
      <>
        <path d="M18 9c0 4.4-6 11-6 11s-6-6.6-6-11a6 6 0 1 1 12 0Z" />
        <circle cx="12" cy="9" r="2" />
      </>
    ),
    crosshair: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 1v6m0 10v6M1 12h6m10 0h6" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 3v6c0 5-4.6 8.7-8 11-3.4-2.3-8-6-8-11V5z" />
        <path d="m8 11 2.6 2.6 5.4-5.3" />
      </>
    ),
    heart: (
      <path
        fill="currentColor"
        stroke="none"
        d="M9.1 2h5.8v7.1H22v5.8h-7.1V22H9.1v-7.1H2V9.1h7.1z"
      />
    ),
    bomb: (
      <>
        <rect x="4" y="8" width="16" height="13" rx="2" />
        <path d="M8 8V5.8C8 3.1 12 2.1 13 5l1 3m-6 4h4m-4 3h3m4-3h1m-1 3h1m-1 3h1" />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    enter: <path d="M20 5v10H5m5-5-5 5 5 5" />,
    keyboard: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M5 9h1m3 0h1m3 0h1m3 0h1M5 12h1m3 0h1m3 0h1m3 0h1m-10 3h8" />
      </>
    ),
    mouse: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="6" />
        <path d="M12 2v8m-6 0h12" />
      </>
    ),
    guide: (
      <>
        <path d="M3 4.5c3.5-.9 6 .1 9 2.1 3-2 5.5-3 9-2.1v14c-3.6-1-6.4.4-9 2-2.6-1.6-5.4-3-9-2zM12 6.6v13.9" />
      </>
    ),
    close: <path d="m5 5 14 14M5 19 19 5" />,
    check: <path d="m4 12 5 5L20 6" />,
    volume: <path d="M4 17v4m5-9v9m5-14v14m5-19v19" />,
    swap: <path d="M3 8h17m-4-4 4 4-4 4M21 16H4m4-4-4 4 4 4" />,
    pause: (
      <>
        <path d="M7 4v16m10-16v16" strokeWidth="4" />
      </>
    ),
    play: <path fill="currentColor" stroke="none" d="m6 3 14 9-14 9z" />,
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 20v-3a6 6 0 0 1 12 0v3m1-16a3.7 3.7 0 0 1 0 7m1 2c3 .3 4 2.5 4 5v2" />
      </>
    ),
    flag: (
      <>
        <path d="M5 22V3c5-3 9 4 15 0v11c-6 4-10-3-15 0" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    signal: (
      <>
        <path d="M3.5 14v5m5-8v8m5-12v12m5-16v16" strokeWidth="2.7" />
      </>
    ),
    head: (
      <>
        <circle cx="12" cy="10" r="6.3" />
        <path d="m8.6 15.5.8 4.5h5.2l.8-4.5M2 10h5m10 0h5M12 1v4" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
    bullets: (
      <>
        <path d="M4 20V8l2-5 2 5v12zm8 0V8l2-5 2 5v12z" />
      </>
    ),
    return: <path d="M20 18v-5a5 5 0 0 0-5-5H4m5-5L4 8l5 5" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  )
}
export function GunArt({ id, className = '' }: { id: WeaponId; className?: string }) {
  const rifle = id === 'ak' || id === 'awp' || id === 'm4'
  return (
    <svg
      className={'gun-art ' + className}
      viewBox={rifle ? '0 0 184 56' : id === 'knife' ? '0 0 148 48' : '0 0 99 64'}
      aria-hidden="true"
    >
      {id === 'ak' ? (
        <g fill="currentColor">
          <path d="m3 23 32-1 8-4 38 1 3-4 24 1 6 4h26l7-2 2-8h4l1 10h19v-2h7v7h-39l-9 3h-22l-5 3-22-1-2 6-6 2-11-1-4 11-8-2 4-14-12-2-4 3-28 13-4-1z" />
          <path d="m82 27 9-1c1 9 6 16 15 21l-7 8c-9-5-16-14-20-24zM67 19l2-5 8 1 3 5zM117 20l4-7h12l4 7h-5l-2-3h-6l-2 3z" />
          <g fill="none" stroke="#191e22" strokeWidth="1.5" opacity=".8">
            <path d="M47 22h33m-32 5 21 .5m14 4c3 7 8 14 15 19M88 30c3 7 8 12 14 16m9-27-1 6m5-6-1 6m5-6-1 6m5-6-1 6M36 24l-2 6" />
            <path d="M62 31h10l-2 4h-9" />
          </g>
        </g>
      ) : id === 'm4' ? (
        <g fill="currentColor">
          <path d="m4 21 29 1 8-3 12 2 3-4 34 1 4-1h35l5 5h15l4-12h4l1 11h16v-2h8v8h-50l-5 4H90l3 18-11 2-6-21H65l-5 14-10-3 6-13-13-1-9 2-26 11-5-1z" />
          <path d="M56 18v-8h24l8 8h-6l-5-5H62v5z" />
          <g stroke="#202325" strokeWidth="2">
            <path d="M99 20v7m6-7v7m6-7v7m6-7v7m6-7v7M12 25v10m5-10v8M83 34l3 12" />
          </g>
        </g>
      ) : id === 'awp' ? (
        <g fill="currentColor">
          <path d="m3 25 36 2 11-3 44 1 14-2h56v-2h15v7h-77l-6 6-28 1-1 10-12-1 1-10-8-1-11 10H30l9-13-12 1-20 13H3z" />
          <path d="M42 12h8v3h36l5-3h9v10h-10l-6-3H51l-3 3h-8zm22-3h8v8h-8zm-11 9h4v8h-4zm29 0h4v7h-4z" />
        </g>
      ) : id === 'knife' ? (
        <g fill="currentColor">
          <path d="m4 31 39-9 4-10 5-1 3 8c26-3 59-7 87-13-13 15-38 27-88 28l-2 8-5 1-4-9-36 9-4-3z" />
          <path fill="#1e2429" d="m58 26 67-14c-19 9-40 14-67 17z" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              stroke="#202629"
              strokeWidth="2.5"
              d={'m' + (11 + i * 6) + ' ' + (31 - i * 1.3) + ' 3 8'}
            />
          ))}
        </g>
      ) : (
        <g fill="currentColor">
          <path
            d={
              id === 'usp'
                ? 'm5 15 48-1 7 4h30v9H60l-4 4-19-1-4 13-9 3-3 13-16-3 7-26-6-2z'
                : id === 'deagle'
                  ? 'm6 14 63-2 16 5v11l-12 2H45l-6 11-14 2-6 16-15-3 9-28-8-3z'
                  : 'm8 15 62-1 5 4-1 11-29 1-5 13-13 1-5 15-17-3 8-28-7-2z'
            }
          />
          <path fill="#202528" d="m29 32 11-.3-3.5 8-9 .5z" />
          <path d="M13 12h5v5h-5zm48 0h4v4h-4z" />
          <g fill="none" stroke="#1e2529" strokeWidth="1.5">
            <path d="m13 18-1.5 7m5.5-7-1.5 7m5.5-7-1.5 7m5.5-7-1.5 7M9 49l13 3m-11-7 12 3m-11-7 12 3" />
            <path d="m31 23 37-.5" />
          </g>
        </g>
      )}
    </svg>
  )
}

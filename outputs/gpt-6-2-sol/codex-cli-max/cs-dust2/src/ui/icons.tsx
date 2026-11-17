import type { ReactNode } from 'react'
import type { WeaponId } from '../game/arsenal'

const paths = {
  mark: <><path d="M2.7 18.1 10.65 5h4.25L6.96 18.1Z" fill="currentColor" stroke="none" /><path d="M10.7 18.1 18.65 5h2.67l-7.95 13.1Z" fill="currentColor" stroke="none" /></>,
  sound: <><path d="M3 9v6h4l5 4V5L7 9H3Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7m2.7-9.7a8.7 8.7 0 0 1 0 12.4" /></>,
  muted: <><path d="M3 9v6h4l5 4V5L7 9H3Zm13 1 5 5m0-5-5 5" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 .3c0 1.7-2.5 2-2.5 3.7m0 3h.01" /></>,
  pin: <><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></>,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-14a3 3 0 0 1 0 6m2 2a4 4 0 0 1 3 4v2" /></>,
  target: <><circle cx="12" cy="12" r="7.2" /><circle cx="12" cy="12" r="3.4" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /></>,
  shield: <><path d="M12 3 4.6 6v5.1c0 4.3 3 7.5 7.4 9.9 4.4-2.4 7.4-5.6 7.4-9.9V6Z" /><path d="M8.7 12.1l2.2 2.3 4.4-4.5" /></>,
  strike: <><path d="m12 3 9 9-9 9-9-9 9-9Z" /><path d="m13 7-4 5h3l-1 5 4-5h-3l1-5Z" /></>,
  arrow: <path d="M4.5 12h14m-5-5 5 5-5 5" />,
  down: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  play: <path d="M8 5.5 19 12 8 18.5V5.5Z" fill="currentColor" stroke="none" />,
  pause: <><path d="M8 5v14m8-14v14" /></>,
  keyboard: <><rect x="2.5" y="5.5" width="19" height="13" rx="2" /><path d="M6.5 9h.01M10 9h.01m4 0h.01m3.5 0h.01M6.5 12h.01m3.5 0h.01m4 0h.01m3.5 0h.01M7.5 15h9" /></>,
  mouse: <><rect x="6" y="2.5" width="12" height="19" rx="6" /><path d="M12 3v6" /></>,
  health: <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />,
  armor: <><path d="M12 3 5 6v5c0 4.4 2.7 7.3 7 10 4.3-2.7 7-5.6 7-10V6l-7-3Z" /><path d="M12 7v9m-4-5h8" /></>,
  bomb: <><rect x="4" y="6.5" width="16" height="13" rx="2" /><path d="M8 6.5V3m8 3.5V4M8 10h8m-8 5h.01M12 15h.01M16 15h.01" /></>,
  skull: <><path d="M5 10a7 7 0 0 1 14 0v3a3 3 0 0 1-3 3v3H8v-3a3 3 0 0 1-3-3v-3Zm4 1h.01m5.99 0h.01M11 16h2" /></>,
  clock: <><circle cx="12" cy="13" r="8" /><path d="M9 2h6m-3 6v5l3 2" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5" /></>,
  reticle: <><circle cx="12" cy="12" r="6.4" /><path d="M12 2v5m0 10v5M2 12h5m10 0h5m-5 0h.01" /></>,
  eye: <><path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.6" /></>,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const silhouettes: Record<WeaponId, string> = {
  ak: 'M2 7h12l6 2h18l4 1h10v2h10v1h8v2H52v-1H38l-3 2 2 4 3 3-3 2-4-4-3-6h-3l-1 5h-4l1-6h-7L2 18zM50 8h2v4h-2zM24 6h7v2h-7z',
  m4: 'M2 8h8l3 2h10l1-3h15v2h8v2h9v2h14v2H49v1H37l1 7-5 1-3-8h-4l-2 5h-4l2-6h-9l-2 3H2zM42 7h2v3h-2zM54 8h2v5h-2z',
  awp: 'M2 9h16l2-1h20l7 3h22v2H47l-4 3H29l-3 5h-4l2-5h-5l-1 5h-5l-1-4-10 2zM22 3h6l2 1h8l3-2h5v5H23zM27 7h2v3h-2zm11 0h2v3h-2zM34 15h5v5h-5z',
  glock: 'M19 6h31v6h-6v3l-5 1-4-1-4 9h-9l3-12h-6zm18 6-1 2h4v-2zM22 4h4v2h-4zm24 0h2v2h-2z',
  usp: 'M15 6h26v2h5V7h17v5H41v4h-8l-3 8h-9l4-12H15zm20 6-1 2h4v-2zM19 4h4v2h-4z',
  deagle: 'M14 5h39l2 2v5H43v5h-9l-2 7h-10l3-12H14zm22 7-1 3h6v-3zM19 3h3v2h-3zm29 0h2v2h-2z',
  knife: 'M4 12h18v-3h3v2h22l18 3-16 4H25v2h-3v-3H4z',
}

export function WeaponGlyph({ id, className }: { id: WeaponId; className?: string }) {
  return <svg viewBox="0 0 72 27" className={className} fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d={silhouettes[id]} /></svg>
}

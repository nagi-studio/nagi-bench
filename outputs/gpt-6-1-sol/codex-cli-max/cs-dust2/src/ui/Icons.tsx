import type { CSSProperties } from 'react';
import type { WeaponId } from '../game/types';

export function Mark({ small = false }: { small?: boolean }) {
  return <svg width={small ? 25 : 33} height={small ? 25 : 33} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 6h13l10 14-10 14H5l10-14L5 6Z" fill="currentColor"/><path d="m24 6 10 14-10 14h7l9-14-9-14h-7Z" fill="currentColor" opacity=".48"/></svg>;
}
export function Icon({ name, size = 20, style }: { name: 'arrow' | 'shield' | 'cross' | 'target' | 'volume' | 'skull' | 'bomb' | 'head' | 'check' | 'pause' | 'sun'; size?: number; style?: CSSProperties }) {
  const paths: Record<typeof name, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7"/></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="M12 7v9"/></>,
    cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/>,
    target: <><circle cx="12" cy="12" r="7"/><path d="M12 1v7m0 8v7M1 12h7m8 0h7"/></>,
    volume: <><path d="M3 9h4l5-4v14l-5-4H3V9ZM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></>,
    skull: <><path d="M6 16C-2 4 22-4 21 11c0 3-2 5-4 6v4H8v-4l-2-1Z"/><path d="M9 19v3m4-3v3m3-3v3"/><circle cx="8" cy="11" r="1.4"/><circle cx="16" cy="11" r="1.4"/></>,
    bomb: <><rect x="5" y="8" width="14" height="13" rx="2"/><path d="M9 8V4h7V1M9 12h6m-6 4h1m4 0h1"/></>,
    head: <><path d="M8 21v-5C1 8 8 1 14 3c7 2 5 9 3 11v7M4 8h17M12 1v20"/></>,
    check: <path d="m5 12 4 4L20 5"/>,
    pause: <><path d="M8 5v14M16 5v14"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{paths[name]}</svg>;
}
export function WeaponIcon({ id, className = '' }: { id: WeaponId; className?: string }) {
  const pistol = ['glock', 'usp', 'deagle'].includes(id), knife = id === 'knife', awp = id === 'awp';
  return <svg className={`weapon-icon ${className}`} viewBox="0 0 150 42" fill="currentColor" aria-hidden="true">
    {knife ? <><path d="m12 23 5-7h39v-5h6v19h-6v-5H12v-2Zm53-7h71l-18 13H65V16Z"/><path d="M22 18v5m8-5v5m8-5v5" stroke="#18211f" strokeWidth="2"/></> : pistol ? <><path d={id === 'usp' ? 'M28 9h65v3h30v8H91v4H63l-5 15H40l6-21H28V9Z' : 'M35 7h64v13H69l-8 19H42l6-23H35V7Z'}/><path d="M66 21h17v10H63v-4h12v-3h-9"/></> : <><path d="m9 14 24 4 7-6h55v3h34v3h14v4h-44v5H70l-2 8H53l3-11-14-2-8 12H16l-7-3V14Z"/><path d={id === 'ak47' ? 'm72 24 5 15h14l-8-15H72Z' : 'M73 24h14v14H73z'}/>{awp && <><path d="M58 5h41v7H58zM65 11h5v6h-5zm22 0h5v6h-5z"/><path d="M124 23v13h3V23z"/></>}</>}
  </svg>;
}

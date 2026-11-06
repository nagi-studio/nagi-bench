import type { CSSProperties } from 'react';
import type { WeaponId } from '../game/types';

export function Mark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 6h16l10 10-10 10H3l10-10L3 6Z" fill="currentColor"/><path d="m15 8 8 8-8 8" stroke="#16201c" strokeWidth="3"/></svg>;
}
export function Shield({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.7"/><path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.7"/></svg>;
}
export function Cross({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" fill="currentColor"/></svg>;
}
export function Skull({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14a9 9 0 1 1 14 0v4h-4v3H9v-3H5v-4Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10h2m4 0h2m-5 5 1-2 1 2" stroke="currentColor" strokeWidth="2"/></svg>;
}
export function BombIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14v13H5V8Zm3-4h8v4H8V4Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12h8M8 16h3m2 0h3M12 4V1h6v3" stroke="currentColor" strokeWidth="1.6"/></svg>;
}
export function Arrow({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8"/></svg>;
}
export function GunIcon({ id, style }: { id: WeaponId; style?: CSSProperties }) {
  const pistol = ['glock', 'usp', 'deagle'].includes(id);
  return <svg viewBox="0 0 140 50" fill="currentColor" className="gun-icon" style={style} aria-hidden="true">
    {id === 'knife' ? <><path d="M14 27h43v9H14zM56 22h5v20h-5zM62 24h64l-19 12H62z"/><path d="M20 24v15m8-15v15m8-15v15" stroke="#18201c" strokeWidth="2"/></> : pistol ? <><path d="M36 14h63v12H68l-6 22H43l7-22H36z"/><path d="M67 28h14v9H65" fill="none" stroke="currentColor" strokeWidth="3"/>{id === 'usp' && <path d="M99 17h28v7H99z"/>}</> : <><path d="m6 24 26-6 9 5h41V14h7v9h28v5H86l-7 5H52l-4 13H38l3-14-8-3-27 6z"/><path d={id === 'ak' ? 'M62 31h13l5 15-11 3z' : 'M61 31h12v14H61z'}/><path d="M86 24h46v4H86z"/>{id === 'awp' && <><path d="M48 10h35v7H48zM57 16h4v8h-4zM72 16h4v8h-4z"/><path d="M131 22h8v7h-8z"/></>}</>}
  </svg>;
}

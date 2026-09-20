import type { CSSProperties } from 'react';
import type { WeaponId } from '../game/weapons';

export function Icon({name,size=20,className='',style}:{name:string;size?:number;className?:string;style?:CSSProperties}) {
  const paths:Record<string,React.ReactNode>={
    shield:<><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/></>,
    cross:<><path d="M12 3v5m0 8v5M3 12h5m8 0h5"/><circle cx="12" cy="12" r="6"/></>,
    sound:<><path d="m11 4-6 5H2v6h3l6 5V4Z"/><path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></>,
    muted:<><path d="m11 4-6 5H2v6h3l6 5V4Z"/><path d="m16 9 6 6m0-6-6 6"/></>,
    arrow:<><path d="M3 12h17m-6-6 6 6-6 6"/></>,
    bolt:<path d="m14 2-9 12h6l-1 8 9-13h-6l1-7Z"/>,
    bomb:<><rect x="5" y="8" width="14" height="13" rx="2"/><path d="M10 8V5h5V2m-7 10h8m-8 4h2m4 0h2"/></>,
    skull:<><path d="M5 14a9 9 0 1 1 14 0v5h-4v3H9v-3H5v-5Z"/><circle cx="8" cy="11" r="1.5"/><circle cx="16" cy="11" r="1.5"/><path d="m11 15 1-2 1 2"/></>,
    person:<><circle cx="12" cy="7" r="3"/><path d="M5 21v-4c0-4 14-4 14 0v4M8 21v-4m8 4v-4"/></>,
    flag:<><path d="M5 22V3m0 1c5-5 9 5 15 0v10c-6 5-10-5-15 0"/></>,
    close:<path d="m5 5 14 14M5 19 19 5"/>,
    info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v2"/></>,
    chevron:<path d="m9 5 7 7-7 7"/>,
    check:<path d="m4 12 5 5L20 6"/>,
    globe:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">{paths[name]??paths.cross}</svg>;
}
export function WeaponIcon({id,className=''}:{id:WeaponId;className?:string}) {
  return <svg className={`weapon-icon ${className}`} viewBox="0 0 160 46" fill="currentColor" aria-hidden="true">
    {id==='knife'?<><path d="m8 29 48-6 12-10 78-5-22 20-55 3-9 9-7-9-42 8z"/><path d="m57 12 7 28 5-1-7-28z"/></>:
    ['glock','usp','deagle'].includes(id)?<><path d="m32 12 68-2 4 4-2 9-34 1-7 20-17-4 5-18H32z"/><path d="M65 21h18l-3 10H65v-3h12l2-4H65z"/>{id==='usp'&&<path d="M99 12h44v9H99z"/>}{id==='deagle'&&<path d="m100 10 17 2v10h-18z"/>}</>:
    <><path d="m4 20 28 1 9-8h44l5 4h35v5h30v3h-35l-4 3H77l-3 5-9-1-3 12-9-3 3-16H34L7 34z"/>
    <path d={id==='ak47'?'m77 27 5 14 13 4 4-6-10-4-3-9z':'m77 27 2 15h13l-3-15z'}/>
    {id==='awp'?<><path d="M49 6h41v6H49zm3-2h7v10h-7zm30 0h9v10h-9z"/><path d="M150 19h9v8h-9z"/></>:<path d="M104 13h4v8h-4zM43 9h6v8h-6z"/>}</>}
  </svg>;
}

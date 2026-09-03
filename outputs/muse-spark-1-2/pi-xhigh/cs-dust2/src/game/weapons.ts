import type { WeaponDef, WeaponId } from './types';

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47:  { id:'ak47',  name:'AK-47', slot:'primary', damage:36, headMul:2, fireRate:600, mag:30, reserve:90, recoil:1.8, spread:0.018, range:80 },
  m4a4:  { id:'m4a4',  name:'M4A4',  slot:'primary', damage:29, headMul:2, fireRate:666, mag:30, reserve:90, recoil:0.95, spread:0.012, range:80 },
  awp:   { id:'awp',   name:'AWP',   slot:'primary', damage:115, headMul:1, fireRate:41, mag:10, reserve:30, recoil:2.6, spread:0.001, range:120, ads:true },
  glock: { id:'glock', name:'Glock-18', slot:'secondary', damage:21, headMul:2, fireRate:400, mag:20, reserve:120, recoil:0.6, spread:0.016, range:45 },
  usp:   { id:'usp',   name:'USP-S',   slot:'secondary', damage:23, headMul:2, fireRate:352, mag:12, reserve:24, recoil:0.55, spread:0.014, range:45 },
  deagle:{ id:'deagle',name:'Desert Eagle', slot:'secondary', damage:47, headMul:2, fireRate:260, mag:7, reserve:35, recoil:1.4, spread:0.022, range:55 },
  knife: { id:'knife', name:'Knife', slot:'melee', damage:42, headMul:1, fireRate:80, mag:0, reserve:0, recoil:0, spread:0, range:2.2 },
};

export function defaultLoadout(team:'CT'|'T', pistolRound:boolean): WeaponId[] {
  if(pistolRound) return [team==='T'?'glock':'usp'];
  if(team==='T') return ['ak47','glock'];
  return ['m4a4','usp'];
}

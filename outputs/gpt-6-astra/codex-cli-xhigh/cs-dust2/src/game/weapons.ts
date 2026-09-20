export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type HitZone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';
export type Slot = 'primary' | 'secondary' | 'melee';
export interface WeaponDefinition {
  id: WeaponId; name: string; slot: Slot; damage: number; interval: number;
  magazine: number; reserve: number; reload: number; spread: number;
  recoil: number; automatic: boolean; range: number; penetration: number;
}
export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  ak47: { id:'ak47', name:'AK-47', slot:'primary', damage:40, interval:.105, magazine:30, reserve:90, reload:2.35, spread:.007, recoil:.028, automatic:true, range:115, penetration:.7 },
  m4a4: { id:'m4a4', name:'M4A4', slot:'primary', damage:34, interval:.085, magazine:30, reserve:90, reload:2.1, spread:.005, recoil:.012, automatic:true, range:110, penetration:.66 },
  awp: { id:'awp', name:'AWP', slot:'primary', damage:120, interval:1.55, magazine:5, reserve:30, reload:3.2, spread:.028, recoil:.05, automatic:false, range:180, penetration:.95 },
  glock: { id:'glock', name:'GLOCK-18', slot:'secondary', damage:23, interval:.19, magazine:20, reserve:100, reload:1.8, spread:.01, recoil:.011, automatic:false, range:65, penetration:.4 },
  usp: { id:'usp', name:'USP-S', slot:'secondary', damage:26, interval:.21, magazine:12, reserve:60, reload:1.9, spread:.006, recoil:.009, automatic:false, range:75, penetration:.5 },
  deagle: { id:'deagle', name:'DESERT EAGLE', slot:'secondary', damage:32, interval:.38, magazine:7, reserve:35, reload:2.2, spread:.009, recoil:.032, automatic:false, range:85, penetration:.8 },
  knife: { id:'knife', name:'FIELD KNIFE', slot:'melee', damage:55, interval:.55, magazine:1, reserve:0, reload:0, spread:0, recoil:.025, automatic:false, range:2.4, penetration:.95 },
};
export const ZONE_MULTIPLIER: Record<HitZone, number> = { head:2, chest:1, abdomen:1.12, arm:.78, leg:.65 };
export function damageFor(weapon: WeaponDefinition, zone: HitZone, armor: number) {
  const raw = weapon.damage * ZONE_MULTIPLIER[zone];
  const absorbed = zone === 'leg' ? 0 : Math.min(armor, raw * (1 - weapon.penetration) * .65);
  return { health: Math.round(raw - absorbed), armor: Math.ceil(absorbed * .5) };
}
export interface WeaponState { id: WeaponId; ammo: number; reserve: number }
export const makeWeapon = (id: WeaponId): WeaponState => ({ id, ammo: WEAPONS[id].magazine, reserve: WEAPONS[id].reserve });

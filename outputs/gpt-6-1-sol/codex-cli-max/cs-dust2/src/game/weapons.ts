import type { Actor, HitZone, WeaponId } from './types';

export interface WeaponDefinition {
  id: WeaponId; name: string; label: string; category: 'rifle' | 'sniper' | 'pistol' | 'knife';
  damage: number; armorPen: number; magazine: number; reserve: number;
  interval: number; reload: number; spread: number; recoil: number;
  automatic: boolean; range: number; speed: number; color: number;
}
export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  ak47: { id: 'ak47', name: 'AK-47', label: '突击步枪', category: 'rifle', damage: 40, armorPen: .76, magazine: 30, reserve: 90, interval: .1, reload: 2.45, spread: .004, recoil: .033, automatic: true, range: 100, speed: 5, color: 0xa56d39 },
  m4a4: { id: 'm4a4', name: 'M4A4', label: '突击步枪', category: 'rifle', damage: 33, armorPen: .7, magazine: 30, reserve: 90, interval: .082, reload: 2.25, spread: .0028, recoil: .016, automatic: true, range: 100, speed: 5.2, color: 0x465252 },
  awp: { id: 'awp', name: 'AWP', label: '狙击步枪', category: 'sniper', damage: 160, armorPen: .92, magazine: 5, reserve: 30, interval: 1.65, reload: 3.1, spread: .045, recoil: .055, automatic: false, range: 160, speed: 4.2, color: 0x64744a },
  glock: { id: 'glock', name: 'GLOCK-18', label: '半自动手枪', category: 'pistol', damage: 22, armorPen: .48, magazine: 20, reserve: 120, interval: .18, reload: 1.8, spread: .007, recoil: .017, automatic: false, range: 65, speed: 5.8, color: 0x515153 },
  usp: { id: 'usp', name: 'USP-S', label: '消音手枪', category: 'pistol', damage: 26, armorPen: .52, magazine: 12, reserve: 72, interval: .19, reload: 1.95, spread: .004, recoil: .014, automatic: false, range: 70, speed: 5.8, color: 0x333b3d },
  deagle: { id: 'deagle', name: 'DESERT EAGLE', label: '重型手枪', category: 'pistol', damage: 30, armorPen: .8, magazine: 7, reserve: 35, interval: .31, reload: 2.2, spread: .0055, recoil: .043, automatic: false, range: 90, speed: 5.5, color: 0xa5aeb1 },
  knife: { id: 'knife', name: 'FIELD KNIFE', label: '近战武器', category: 'knife', damage: 55, armorPen: .85, magazine: 0, reserve: 0, interval: .48, reload: 0, spread: 0, recoil: .01, automatic: true, range: 2.6, speed: 6.8, color: 0xbac5c4 },
};
export const ZONE_DAMAGE: Record<HitZone, number> = { head: 2, chest: 1, abdomen: 1.15, arm: .72, leg: .65 };
export function equipped(actor: Actor): WeaponId {
  return actor.slot === 'primary' && actor.primary ? actor.primary : actor.slot === 'melee' ? 'knife' : actor.secondary;
}
export function calculateDamage(weapon: WeaponDefinition, zone: HitZone, armor: number): { damage: number; armorDamage: number } {
  const raw = weapon.damage * ZONE_DAMAGE[zone];
  const absorbed = zone === 'leg' ? 0 : Math.min(armor, raw * (1 - weapon.armorPen));
  return { damage: Math.round(raw - absorbed), armorDamage: Math.ceil(absorbed) };
}

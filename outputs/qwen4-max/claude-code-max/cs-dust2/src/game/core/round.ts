import type { Entity, Team, WeaponId } from './types.ts';
import { CFG } from './config.ts';
import { giveWeapon } from './entities.ts';
import { WEAPONS } from './weapons.ts';

export function lossReward(streak: number): number {
  return Math.min(CFG.lossMax, CFG.lossBase + CFG.lossStep * Math.max(0, streak - 1));
}

export function clampMoney(m: number): number {
  return Math.max(0, Math.min(CFG.maxMoney, Math.round(m)));
}

// Auto-equip bots. Round 1 is the pistol round; later rounds full-buy.
export function botBuy(e: Entity, pistol: boolean, awpSlot: boolean): void {
  if (pistol) {
    // Pistol round: default pistol only; most bots grab kevlar.
    e.armor = 0;
    e.helmet = false;
    if (e.money >= 650 && Math.random() < 0.8) {
      e.money -= 650;
      e.armor = 100;
    }
    e.kit = false;
    return;
  }
  // Full round: ensure a rifle and armor.
  const rifle: WeaponId = e.team === 'T' ? 'ak47' : 'm4a4';
  if (awpSlot && e.money >= WEAPONS.awp.price + 1000) {
    giveWeapon(e, 'awp');
    e.money -= WEAPONS.awp.price;
  } else if (!e.inv.primary || e.inv.primary.id === 'glock' || e.inv.primary.id === 'usp') {
    if (e.money >= WEAPONS[rifle].price) {
      giveWeapon(e, rifle);
      e.money -= WEAPONS[rifle].price;
    }
  }
  if (e.armor < 50 && e.money >= 1000) {
    e.money -= 1000;
    e.armor = 100;
    e.helmet = true;
  } else if (e.armor < 50 && e.money >= 650) {
    e.money -= 650;
    e.armor = 100;
  }
  if (e.team === 'CT' && !e.kit && e.money >= 400 && Math.random() < 0.6) {
    e.money -= 400;
    e.kit = true;
  }
  e.money = clampMoney(e.money);
}

export function canBuy(e: Entity, phase: string, inSpawn: boolean): boolean {
  return phase === 'freeze' && e.alive && inSpawn;
}

export function buyItem(e: Entity, id: WeaponId | 'kevlar' | 'helmet' | 'kit'): boolean {
  if (id === 'kevlar') {
    if (e.money < 650 || e.armor >= 100) return false;
    e.money -= 650;
    e.armor = 100;
    return true;
  }
  if (id === 'helmet') {
    if (e.money < 1000) return false;
    e.money -= 1000;
    e.armor = 100;
    e.helmet = true;
    return true;
  }
  if (id === 'kit') {
    if (e.team !== 'CT' || e.money < 400 || e.kit) return false;
    e.money -= 400;
    e.kit = true;
    return true;
  }
  const def = WEAPONS[id];
  if (e.money < def.price) return false;
  // Pistol round forbids primaries.
  e.money -= def.price;
  giveWeapon(e, id);
  return true;
}

export function teamAlive(entities: Entity[], team: Team): number {
  let n = 0;
  for (const e of entities) if (e.team === team && e.alive) n++;
  return n;
}

import type { Agent, InventoryItem, Team, WeaponId, WeaponSlot, WeaponSpec } from './types'

export const WEAPONS: Record<WeaponId, WeaponSpec> = {
  ak47: { id: 'ak47', name: 'AK-47', shortName: 'AK', slot: 'primary', damage: 36, fireInterval: .102, magazine: 30, reserve: 90, reloadTime: 2.35, spread: .011, recoil: .024, range: 90, automatic: true, color: 0x6a341d, sound: 'ak' },
  m4a4: { id: 'm4a4', name: 'M4A4', shortName: 'M4', slot: 'primary', damage: 31, fireInterval: .087, magazine: 30, reserve: 90, reloadTime: 2.25, spread: .008, recoil: .014, range: 90, automatic: true, color: 0x29343a, sound: 'm4' },
  awp: { id: 'awp', name: 'AWP', shortName: 'AWP', slot: 'primary', damage: 112, fireInterval: 1.42, magazine: 10, reserve: 30, reloadTime: 3.35, spread: .0012, recoil: .046, range: 150, automatic: false, color: 0x536c35, sound: 'awp' },
  glock: { id: 'glock', name: 'Glock-18', shortName: 'GLOCK', slot: 'secondary', damage: 23, fireInterval: .155, magazine: 20, reserve: 120, reloadTime: 1.95, spread: .018, recoil: .012, range: 55, automatic: false, color: 0x34383a, sound: 'pistol' },
  usp: { id: 'usp', name: 'USP-S', shortName: 'USP', slot: 'secondary', damage: 27, fireInterval: .17, magazine: 12, reserve: 48, reloadTime: 2.05, spread: .009, recoil: .009, range: 65, automatic: false, color: 0x25292a, sound: 'pistol' },
  deagle: { id: 'deagle', name: 'Desert Eagle', shortName: 'DEAGLE', slot: 'secondary', damage: 54, fireInterval: .32, magazine: 7, reserve: 35, reloadTime: 2.15, spread: .013, recoil: .032, range: 75, automatic: false, color: 0xa4a5a0, sound: 'deagle' },
  knife: { id: 'knife', name: 'Tactical Knife', shortName: 'KNIFE', slot: 'melee', damage: 58, fireInterval: .58, magazine: 1, reserve: 0, reloadTime: 0, spread: .04, recoil: .004, range: 2.15, automatic: false, color: 0xaeb8bb, sound: 'knife' },
}

export const makeItem = (id: WeaponId): InventoryItem => ({
  id,
  ammo: WEAPONS[id].magazine,
  reserve: WEAPONS[id].reserve,
})

export function giveLoadout(agent: Agent, pistolOnly: boolean, awper = false) {
  const sidearm: WeaponId = agent.team === 'T' ? 'glock' : 'usp'
  agent.inventory = {
    secondary: makeItem(sidearm),
    melee: makeItem('knife'),
  }
  if (!pistolOnly) agent.inventory.primary = makeItem(awper ? 'awp' : agent.team === 'T' ? 'ak47' : 'm4a4')
  agent.activeSlot = pistolOnly ? 'secondary' : 'primary'
  agent.armor = pistolOnly ? 0 : 100
}

export function equipPracticeWeapon(agent: Agent, id: WeaponId) {
  const spec = WEAPONS[id]
  agent.inventory[spec.slot] = makeItem(id)
  agent.activeSlot = spec.slot
}

export function activeItem(agent: Agent) {
  return agent.inventory[agent.activeSlot] ?? agent.inventory.secondary ?? agent.inventory.melee!
}

export function switchSlot(agent: Agent, slot: WeaponSlot) {
  if (agent.inventory[slot]) agent.activeSlot = slot
}

export const teamLabel = (team: Team) => team === 'T' ? 'TERRORISTS' : 'COUNTER-TERRORISTS'

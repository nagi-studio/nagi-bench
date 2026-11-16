import type { Entity, Inventory, Slot, Team, Vec3, WeaponId } from './types.ts';
import { CFG, PLAYER_NAME, BOT_NAMES_CT, BOT_NAMES_T } from './config.ts';
import { bestSlot, defaultSecondary, makeWeapon } from './weapons.ts';
import { clone, v3 } from './vecmath.ts';

let nextId = 1;
export function resetIds(): void {
  nextId = 1;
}

export function makeInventory(team: Team, pistol: boolean): Inventory {
  const secondary = makeWeapon(defaultSecondary(team));
  const melee = makeWeapon('knife');
  let primary = null;
  if (!pistol) {
    primary = makeWeapon(team === 'T' ? 'ak47' : 'm4a4');
  }
  return { primary, secondary, melee };
}

export function createEntity(opts: {
  name: string;
  team: Team;
  isPlayerSlot: boolean;
  bot: boolean;
  spawn: Vec3;
  spawnYaw: number;
  pistol: boolean;
}): Entity {
  const inv = makeInventory(opts.team, opts.pistol);
  const e: Entity = {
    id: nextId++,
    name: opts.name,
    team: opts.team,
    isPlayerSlot: opts.isPlayerSlot,
    bot: opts.bot,
    pos: clone(opts.spawn),
    vel: v3(),
    yaw: opts.spawnYaw,
    pitch: 0,
    onGround: true,
    hp: 100,
    armor: 0,
    helmet: false,
    kit: false,
    alive: true,
    money: CFG.startMoney,
    kills: 0,
    deaths: 0,
    inv,
    activeSlot: bestSlot(inv),
    prevSlot: 'secondary',
    switchT: 0,
    action: null,
    bombCarrier: false,
    scoped: false,
    ai: null,
    walkPhase: 0,
    speed: 0,
    deathT: -100,
    hitFlash: 0,
    lastDamageFrom: null,
    footAccum: 0,
    recoilRecover: 0,
    spawnYaw: opts.spawnYaw,
  };
  return e;
}

export function activeWeapon(e: Entity) {
  if (e.activeSlot === 'primary' && e.inv.primary) return e.inv.primary;
  if (e.activeSlot === 'secondary') return e.inv.secondary;
  return e.inv.melee;
}

export function respawn(e: Entity, spawn: Vec3, spawnYaw: number, pistol: boolean, keepMoney: boolean): void {
  e.pos = clone(spawn);
  e.vel = v3();
  e.yaw = spawnYaw;
  e.spawnYaw = spawnYaw;
  e.pitch = 0;
  e.onGround = true;
  e.hp = 100;
  e.alive = true;
  e.action = null;
  e.scoped = false;
  e.bombCarrier = false;
  e.hitFlash = 0;
  e.deathT = -100;
  e.lastDamageFrom = null;
  e.footAccum = 0;
  e.recoilRecover = 0;
  e.inv = makeInventory(e.team, pistol);
  e.activeSlot = bestSlot(e.inv);
  e.prevSlot = 'secondary';
  e.switchT = 0;
  if (!keepMoney) e.money = CFG.startMoney;
  // pistol round armor is not free; full rounds grant kevlar via buy logic elsewhere.
  e.armor = 0;
  e.helmet = false;
  e.kit = false;
}

export function buildTeams(playerTeam: Team, pistol: boolean, spawns: { CT: Vec3[]; T: Vec3[] }, spawnYaw: { CT: number; T: number }): Entity[] {
  const entities: Entity[] = [];
  const enemyTeam: Team = playerTeam === 'CT' ? 'T' : 'CT';
  // Player team: 1 human slot + 4 bots.
  const mateNames = playerTeam === 'CT' ? BOT_NAMES_CT : BOT_NAMES_T;
  const enemyNames = enemyTeam === 'CT' ? BOT_NAMES_CT : BOT_NAMES_T;
  let mateIdx = 0;
  for (let i = 0; i < 5; i++) {
    const isPlayerSlot = i === 0;
    entities.push(createEntity({
      name: isPlayerSlot ? PLAYER_NAME : mateNames[mateIdx++ % mateNames.length],
      team: playerTeam,
      isPlayerSlot,
      bot: !isPlayerSlot,
      spawn: spawns[playerTeam][i],
      spawnYaw: spawnYaw[playerTeam],
      pistol,
    }));
  }
  for (let i = 0; i < 5; i++) {
    entities.push(createEntity({
      name: enemyNames[i % enemyNames.length],
      team: enemyTeam,
      isPlayerSlot: false,
      bot: true,
      spawn: spawns[enemyTeam][i],
      spawnYaw: spawnYaw[enemyTeam],
      pistol,
    }));
  }
  return entities;
}

export function giveWeapon(e: Entity, id: WeaponId): void {
  const slot = id === 'knife' ? 'melee' : (id === 'ak47' || id === 'm4a4' || id === 'awp') ? 'primary' : 'secondary';
  const w = makeWeapon(id);
  if (slot === 'primary') e.inv.primary = w;
  else if (slot === 'secondary') e.inv.secondary = w;
  else e.inv.melee = w;
}

export function switchSlot(e: Entity, slot: Slot, time: number): boolean {
  if (slot === 'primary' && !e.inv.primary) return false;
  if (slot === e.activeSlot) return false;
  e.prevSlot = e.activeSlot;
  e.activeSlot = slot;
  e.switchT = time + 0.45;
  e.scoped = false;
  const w = activeWeapon(e);
  w.reloading = false;
  w.reloadT = 0;
  return true;
}

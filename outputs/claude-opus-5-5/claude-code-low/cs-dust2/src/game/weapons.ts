/**
 * Data-driven weapon system. Adding a weapon = adding an entry in WEAPONS.
 */

export type Slot = 'primary' | 'secondary' | 'melee';
export type SoundProfile = 'ak' | 'm4' | 'awp' | 'pistol' | 'deagle' | 'knife';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface WeaponDef {
  id: string;
  name: string;
  slot: Slot;
  damage: number;
  /** seconds between shots */
  fireInterval: number;
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  /** fraction of damage that goes through armour (0..1) */
  armorPen: number;
  range: number;
  /** radians of cone half-angle when standing still and fresh */
  spreadBase: number;
  /** extra spread while moving at full speed */
  spreadMove: number;
  /** spread added per shot, decays at spreadRecovery rad/s */
  spreadPerShot: number;
  spreadMax: number;
  spreadRecovery: number;
  /** view punch (radians) per shot; pitch up and random yaw */
  recoilPitch: number;
  recoilYaw: number;
  moveSpeed: number; // multiplier
  scope?: { fov: number; spreadScoped: number };
  sound: SoundProfile;
  price: number;
  /** pellets per shot (for future shotguns) */
  pellets?: number;
  /** melee reach in metres */
  reach?: number;
  /** extra damage multipliers per hitzone (overrides defaults) */
  zoneMult?: Partial<Record<HitZone, number>>;
  /** ai preferred engagement: how many shots per burst */
  aiBurst: number;
  color: number;
}

export const ZONE_MULT: Record<HitZone, number> = {
  head: 2.0, // head = 2x body (chest)
  chest: 1.0,
  stomach: 1.15,
  arm: 0.85,
  leg: 0.7,
};

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary', damage: 36, fireInterval: 0.1, auto: true,
    magSize: 30, reserve: 90, reloadTime: 2.4, armorPen: 0.775, range: 200,
    spreadBase: 0.004, spreadMove: 0.07, spreadPerShot: 0.011, spreadMax: 0.09, spreadRecovery: 0.12,
    recoilPitch: 0.022, recoilYaw: 0.012, moveSpeed: 0.86, sound: 'ak', price: 2700, aiBurst: 4,
    color: 0x6b4a2b,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary', damage: 28, fireInterval: 0.088, auto: true,
    magSize: 30, reserve: 90, reloadTime: 3.1, armorPen: 0.7, range: 200,
    spreadBase: 0.003, spreadMove: 0.06, spreadPerShot: 0.0055, spreadMax: 0.05, spreadRecovery: 0.14,
    recoilPitch: 0.010, recoilYaw: 0.006, moveSpeed: 0.9, sound: 'm4', price: 3100, aiBurst: 5,
    color: 0x2b2e33,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary', damage: 115, fireInterval: 1.45, auto: false,
    magSize: 5, reserve: 30, reloadTime: 3.6, armorPen: 0.97, range: 300,
    spreadBase: 0.06, spreadMove: 0.18, spreadPerShot: 0.05, spreadMax: 0.2, spreadRecovery: 0.2,
    recoilPitch: 0.05, recoilYaw: 0.01, moveSpeed: 0.8, sound: 'awp', price: 4750, aiBurst: 1,
    scope: { fov: 20, spreadScoped: 0.0008 }, color: 0x3e5b39,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary', damage: 24, fireInterval: 0.15, auto: false,
    magSize: 20, reserve: 120, reloadTime: 2.2, armorPen: 0.47, range: 120,
    spreadBase: 0.008, spreadMove: 0.04, spreadPerShot: 0.012, spreadMax: 0.06, spreadRecovery: 0.15,
    recoilPitch: 0.012, recoilYaw: 0.006, moveSpeed: 1.0, sound: 'pistol', price: 200, aiBurst: 3,
    color: 0x222222,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary', damage: 30, fireInterval: 0.17, auto: false,
    magSize: 12, reserve: 24, reloadTime: 2.2, armorPen: 0.505, range: 120,
    spreadBase: 0.005, spreadMove: 0.035, spreadPerShot: 0.012, spreadMax: 0.06, spreadRecovery: 0.15,
    recoilPitch: 0.014, recoilYaw: 0.005, moveSpeed: 1.0, sound: 'pistol', price: 200, aiBurst: 2,
    color: 0x3a3a3a,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 53, fireInterval: 0.25, auto: false,
    magSize: 7, reserve: 35, reloadTime: 2.2, armorPen: 0.93, range: 150,
    spreadBase: 0.006, spreadMove: 0.08, spreadPerShot: 0.035, spreadMax: 0.1, spreadRecovery: 0.12,
    recoilPitch: 0.04, recoilYaw: 0.012, moveSpeed: 0.95, sound: 'deagle', price: 700, aiBurst: 1,
    color: 0x9a9a9a,
  },
  knife: {
    id: 'knife', name: '匕首', slot: 'melee', damage: 40, fireInterval: 0.45, auto: true,
    magSize: 0, reserve: 0, reloadTime: 0, armorPen: 0.85, range: 2,
    spreadBase: 0, spreadMove: 0, spreadPerShot: 0, spreadMax: 0, spreadRecovery: 1,
    recoilPitch: 0, recoilYaw: 0, moveSpeed: 1.1, sound: 'knife', price: 0, aiBurst: 1, reach: 2.0,
    zoneMult: { head: 1.6, chest: 1, stomach: 1, arm: 1, leg: 1 }, color: 0xcccccc,
  },
};

export class WeaponState {
  mag: number;
  reserve: number;
  nextFire = 0;
  reloadUntil = 0;
  spread = 0; // accumulated recoil spread
  shotsInSpray = 0;
  constructor(public def: WeaponDef) {
    this.mag = def.magSize;
    this.reserve = def.reserve;
  }
  get reloading() {
    return this.reloadUntil > 0;
  }
  canFire(now: number) {
    if (this.def.slot === 'melee') return now >= this.nextFire;
    return now >= this.nextFire && this.mag > 0 && !this.reloading;
  }
  startReload(now: number) {
    if (this.def.slot === 'melee' || this.reloading) return false;
    if (this.mag >= this.def.magSize || this.reserve <= 0) return false;
    this.reloadUntil = now + this.def.reloadTime;
    return true;
  }
  update(now: number, dt: number) {
    if (this.reloading && now >= this.reloadUntil) {
      const need = this.def.magSize - this.mag;
      const take = Math.min(need, this.reserve);
      this.mag += take;
      this.reserve -= take;
      this.reloadUntil = 0;
    }
    this.spread = Math.max(0, this.spread - this.def.spreadRecovery * dt);
    if (now > this.nextFire + 0.25) this.shotsInSpray = 0;
  }
  /** current cone half-angle */
  currentSpread(moveFrac: number, airborne: boolean, scoped: boolean) {
    const d = this.def;
    let s = d.spreadBase + d.spreadMove * moveFrac + this.spread;
    if (airborne) s += 0.12;
    if (d.scope) s = scoped ? d.scope.spreadScoped + d.spreadMove * moveFrac * 1.2 + this.spread * 0.2 : s;
    return s;
  }
  /** Called when a shot is fired. */
  onFire(now: number) {
    this.nextFire = now + this.def.fireInterval;
    if (this.def.slot !== 'melee') this.mag--;
    this.spread = Math.min(this.def.spreadMax, this.spread + this.def.spreadPerShot);
    this.shotsInSpray++;
  }
}

export class Inventory {
  slots: Partial<Record<Slot, WeaponState>> = {};
  current: Slot = 'secondary';
  lastSlot: Slot = 'melee';
  switchUntil = 0;

  give(id: string) {
    const def = WEAPONS[id];
    this.slots[def.slot] = new WeaponState(def);
  }
  has(slot: Slot) {
    return !!this.slots[slot];
  }
  get weapon(): WeaponState {
    return (this.slots[this.current] ?? this.slots.melee)!;
  }
  select(slot: Slot, now: number) {
    if (!this.slots[slot] || slot === this.current) return false;
    const w = this.weapon;
    w.reloadUntil = 0; // cancel reload
    this.lastSlot = this.current;
    this.current = slot;
    this.switchUntil = now + (slot === 'melee' ? 0.35 : 0.6);
    return true;
  }
  best(): Slot {
    if (this.slots.primary) return 'primary';
    if (this.slots.secondary) return 'secondary';
    return 'melee';
  }
  /** apply armor + hitzone, returns [healthDamage, armorDamage] */
  static computeDamage(def: WeaponDef, zone: HitZone, dist: number, armor: number, helmet: boolean): [number, number] {
    const mult = def.zoneMult?.[zone] ?? ZONE_MULT[zone];
    const falloff = def.slot === 'melee' ? 1 : Math.pow(0.985, dist / 10);
    let dmg = def.damage * mult * falloff;
    let armorDmg = 0;
    const protectedZone = zone === 'head' ? helmet : zone !== 'leg';
    if (armor > 0 && protectedZone) {
      const reduced = dmg * def.armorPen;
      armorDmg = Math.min(armor, (dmg - reduced) * 0.5);
      dmg = reduced;
    }
    return [Math.round(dmg), Math.round(armorDmg)];
  }
}

// ---------------------------------------------------------------- loadouts

export type Team = 'T' | 'CT';

export interface LoadoutConfig {
  primary?: string;
  secondary: string;
  armor: number;
  helmet: boolean;
}

/** Pistol round: default pistol only; no primary; armour as configured. */
export const PISTOL_ROUND: Record<Team, LoadoutConfig> = {
  T: { secondary: 'glock', armor: 0, helmet: false },
  CT: { secondary: 'usp', armor: 0, helmet: false },
};

/** Gun rounds: rifles + full armour */
export const GUN_ROUND: Record<Team, LoadoutConfig> = {
  T: { primary: 'ak47', secondary: 'glock', armor: 100, helmet: true },
  CT: { primary: 'm4a4', secondary: 'usp', armor: 100, helmet: true },
};

export const BUY_MENU: { key: string; id: string }[] = [
  { key: '7', id: 'ak47' },
  { key: '8', id: 'm4a4' },
  { key: '9', id: 'awp' },
  { key: '0', id: 'deagle' },
];

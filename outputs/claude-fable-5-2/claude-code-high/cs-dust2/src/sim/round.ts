// Round flow and the C4 objective: freeze time -> live -> (planted) -> over -> next round.

import type { Actor, Team } from './actor';
import { Vec3, dist2D, dist3D, v3 } from './math';
import { siteAt } from './map';
import type { Simulation } from './sim';
import { WeaponId } from './weapons';

export type Phase = 'freeze' | 'live' | 'planted' | 'over' | 'matchover';
export type WinReason = 'elim' | 'time' | 'bomb' | 'defuse';
export type BombStatus = 'none' | 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export const RULES = {
  freezeTime: 5,
  roundTime: 115,
  bombTime: 40,
  postTime: 6,
  plantTime: 3.2,
  defuseTime: 10,
  defuseKitTime: 5,
  winScore: 7,
  blastRadius: 20,
};

export interface BombState {
  status: BombStatus;
  carrier: number;
  pos: Vec3;
  site: 'A' | 'B' | null;
  explodeAt: number;
  plantedAt: number;
  nextBeep: number;
  planter: number;
  defuser: number;
  dropTime: number;
  dropper: number;
}

export class RoundManager {
  phase: Phase = 'freeze';
  phaseEnd = 0;
  num = 0;
  score: Record<Team, number> = { atk: 0, def: 0 };
  winner: Team | null = null;
  reason: WinReason | null = null;
  pistol = true;
  bomb: BombState = {
    status: 'none',
    carrier: -1,
    pos: v3(),
    site: null,
    explodeAt: 0,
    plantedAt: 0,
    nextBeep: 0,
    planter: -1,
    defuser: -1,
    dropTime: -100,
    dropper: -1,
  };

  constructor(private sim: Simulation) {}

  /** Seconds left on the visible clock (round timer, or bomb timer once planted). */
  timeLeft(): number {
    const now = this.sim.time;
    if (this.phase === 'planted') return Math.max(0, this.bomb.explodeAt - now);
    if (this.phase === 'freeze' || this.phase === 'live') return Math.max(0, this.phaseEnd - now);
    return 0;
  }

  defuseNeeded(a: Actor): number {
    return a.hasKit ? RULES.defuseKitTime : RULES.defuseTime;
  }

  startRound(): void {
    const sim = this.sim;
    const now = sim.time;
    this.num++;
    this.pistol = sim.options.mode === 'pistol' || (sim.options.mode === 'match' && this.num === 1);
    this.winner = null;
    this.reason = null;
    this.phase = 'freeze';
    this.phaseEnd = now + RULES.freezeTime;

    sim.restoreHuman();
    const spawnIdx: Record<Team, number[]> = {
      atk: sim.rng.shuffle([0, 1, 2, 3, 4]),
      def: sim.rng.shuffle([0, 1, 2, 3, 4]),
    };
    const counters: Record<Team, number> = { atk: 0, def: 0 };
    for (const a of sim.actors) {
      const k = spawnIdx[a.team][counters[a.team]++ % 5];
      const sp = sim.pts.spawns[a.team][k];
      a.pos.x = sp.x;
      a.pos.y = sp.y;
      a.pos.z = sp.z;
      a.prevPos.x = sp.x;
      a.prevPos.y = sp.y;
      a.prevPos.z = sp.z;
      a.vel.x = a.vel.y = a.vel.z = 0;
      a.yaw = a.prevYaw = sim.map.tac.spawnYaw[a.team];
      a.pitch = a.prevPitch = 0;
      a.onGround = true;
      a.crouch = 0;
      a.hp = 100;
      a.alive = true;
      a.hasBomb = false;
      a.useTime = 0;
      a.zoom = 0;
      a.rezoomAt = 0;
      a.spread = 0;
      a.punchPitch = a.punchYaw = 0;
      a.shotsFired = 0;
      a.nextFire = 0;
      a.reloadEnd = 0;
      a.spottedUntil = -100;
      a.lastDamageTime = -100;
      a.stepDist = 0;
      this.giveLoadout(a);
    }
    // hand the C4 to a random attacker
    const attackers = sim.actors.filter((a) => a.team === 'atk');
    const carrier = sim.rng.pick(attackers);
    carrier.hasBomb = true;
    this.bomb.status = 'carried';
    this.bomb.carrier = carrier.id;
    this.bomb.site = null;
    this.bomb.planter = -1;
    this.bomb.defuser = -1;
    this.bomb.dropper = -1;
    this.bomb.dropTime = -100;

    sim.tactics.atk.plan();
    sim.tactics.def.plan();
    for (const b of sim.brains) b.reset();
    sim.emit({ type: 'round', kind: 'start' });
  }

  giveLoadout(a: Actor): void {
    const sim = this.sim;
    a.weapons.primary = null;
    a.weapons.secondary = null;
    const defaultPistol: WeaponId = a.team === 'atk' ? 'glock' : 'usp';
    if (this.pistol) {
      // Pistol round: default sidearm only, no kevlar, no helmet, no defuse kit.
      a.give(defaultPistol);
      a.armor = 0;
      a.helmet = false;
      a.hasKit = false;
    } else {
      let primary: WeaponId = a.team === 'atk' ? 'ak47' : 'm4a1';
      let secondary: WeaponId = defaultPistol;
      if (a.isHuman) {
        const lo = sim.loadout;
        primary = lo.primary ?? primary;
        secondary = lo.secondary ?? secondary;
      } else {
        // one designated marksman per team, a few bots upgrade their sidearm
        const teamIdx = a.id % 5;
        if (teamIdx === 3 && sim.rng.chance(0.6)) primary = 'awp';
        if (sim.rng.chance(0.3)) secondary = 'deagle';
      }
      a.give(primary);
      a.give(secondary);
      a.armor = 100;
      a.helmet = true;
      a.hasKit = a.team === 'def';
    }
    a.active = a.bestSlot();
    a.lastSlot = a.weapons.secondary && a.active !== 'secondary' ? 'secondary' : 'melee';
    a.drawStart = sim.time;
    a.drawEnd = sim.time + 0.3;
  }

  /** Phase timers and the bomb clock. Runs before actors are simulated. */
  preUpdate(): void {
    const sim = this.sim;
    const now = sim.time;
    const bomb = this.bomb;
    switch (this.phase) {
      case 'freeze':
        if (now >= this.phaseEnd) {
          this.phase = 'live';
          this.phaseEnd = now + RULES.roundTime;
          sim.emit({ type: 'round', kind: 'live' });
        }
        break;
      case 'live':
        if (now >= this.phaseEnd && bomb.planter < 0) this.end('def', 'time');
        break;
      case 'planted': {
        if (now >= bomb.explodeAt) {
          this.explode();
          break;
        }
        if (now >= bomb.nextBeep) {
          const left = bomb.explodeAt - now;
          bomb.nextBeep = now + Math.max(0.11, Math.min(1.0, 0.08 + (left / RULES.bombTime) * 1.0));
          sim.emit({ type: 'bomb', kind: 'beep', actor: -1, x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z });
        }
        break;
      }
      case 'over':
        if (now >= this.phaseEnd) {
          if (this.score.atk >= RULES.winScore || this.score.def >= RULES.winScore) {
            this.phase = 'matchover';
            sim.emit({ type: 'round', kind: 'match', winner: this.score.atk > this.score.def ? 'atk' : 'def' });
          } else {
            this.startRound();
          }
        }
        break;
      default:
        break;
    }
  }

  /**
   * Plant / defuse handling for one actor. Returns true while the actor is busy with the bomb
   * (movement and shooting are locked).
   */
  handleUse(a: Actor, dt: number): boolean {
    const sim = this.sim;
    const bomb = this.bomb;
    // --- planting
    if (this.phase === 'live' && a.team === 'atk' && a.hasBomb && a.input.use && a.onGround) {
      const site = siteAt(sim.map, a.pos.x, a.pos.z);
      if (site) {
        if (bomb.planter !== a.id) {
          bomb.planter = a.id;
          a.useTime = 0;
          sim.emit({ type: 'bomb', kind: 'plantStart', actor: a.id, x: a.pos.x, y: a.pos.y, z: a.pos.z });
        }
        a.useTime += dt;
        if (a.useTime >= RULES.plantTime) this.plant(a, site);
        return true;
      }
    }
    if (bomb.planter === a.id) {
      bomb.planter = -1;
      a.useTime = 0;
    }
    // --- defusing
    if (
      this.phase === 'planted' &&
      a.team === 'def' &&
      a.input.use &&
      (bomb.defuser < 0 || bomb.defuser === a.id) &&
      dist2D(a.pos, bomb.pos) < 1.5 &&
      Math.abs(a.pos.y - bomb.pos.y) < 1.3
    ) {
      if (bomb.defuser !== a.id) {
        bomb.defuser = a.id;
        a.useTime = 0;
        sim.emit({ type: 'bomb', kind: 'defuseStart', actor: a.id, x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z });
      }
      a.useTime += dt;
      if (a.useTime >= this.defuseNeeded(a)) {
        bomb.status = 'defused';
        bomb.defuser = -1;
        a.useTime = 0;
        sim.emit({ type: 'bomb', kind: 'defused', actor: a.id, x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z });
        this.end('def', 'defuse');
      }
      return true;
    }
    if (bomb.defuser === a.id) {
      bomb.defuser = -1;
      a.useTime = 0;
    }
    // --- dropping the bomb on request
    if (a.input.drop && a.hasBomb && (this.phase === 'live' || this.phase === 'freeze')) this.dropBomb(a, true);
    return false;
  }

  private plant(a: Actor, site: 'A' | 'B'): void {
    const sim = this.sim;
    const bomb = this.bomb;
    a.hasBomb = false;
    a.useTime = 0;
    bomb.status = 'planted';
    bomb.carrier = -1;
    bomb.planter = -1;
    bomb.site = site;
    // place it slightly in front of the planter, on the floor
    const fx = a.pos.x - Math.sin(a.yaw) * 0.45;
    const fz = a.pos.z - Math.cos(a.yaw) * 0.45;
    const ok = sim.world.bodyFits(fx, a.pos.y + 0.05, fz, 0.15, 0.3);
    bomb.pos.x = ok ? fx : a.pos.x;
    bomb.pos.z = ok ? fz : a.pos.z;
    bomb.pos.y = sim.world.floorBelow(bomb.pos.x, a.pos.y + 0.3, bomb.pos.z);
    bomb.plantedAt = sim.time;
    bomb.explodeAt = sim.time + RULES.bombTime;
    bomb.nextBeep = sim.time + 1;
    this.phase = 'planted';
    sim.emit({ type: 'bomb', kind: 'planted', actor: a.id, x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z });
  }

  dropBomb(a: Actor, thrown: boolean): void {
    const sim = this.sim;
    const bomb = this.bomb;
    if (!a.hasBomb) return;
    a.hasBomb = false;
    bomb.status = 'dropped';
    bomb.carrier = -1;
    bomb.planter = -1;
    bomb.dropTime = sim.time;
    bomb.dropper = thrown ? a.id : -1;
    let x = a.pos.x;
    let z = a.pos.z;
    if (thrown) {
      const tx = x - Math.sin(a.yaw) * 1.6;
      const tz = z - Math.cos(a.yaw) * 1.6;
      const eye = a.eye();
      if (sim.world.clearLine(eye, { x: tx, y: eye.y, z: tz })) {
        x = tx;
        z = tz;
      }
    }
    bomb.pos.x = x;
    bomb.pos.z = z;
    bomb.pos.y = sim.world.floorBelow(x, a.pos.y + 0.6, z);
    sim.emit({ type: 'bomb', kind: 'drop', actor: a.id, x, y: bomb.pos.y, z });
  }

  private explode(): void {
    const sim = this.sim;
    const bomb = this.bomb;
    bomb.status = 'exploded';
    bomb.defuser = -1;
    sim.emit({ type: 'bomb', kind: 'exploded', actor: -1, x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z });
    for (const a of sim.actors) {
      if (!a.alive) continue;
      const d = dist3D(a.pos, bomb.pos);
      if (d >= RULES.blastRadius) continue;
      const dmg = Math.round(500 * Math.pow(1 - d / RULES.blastRadius, 1.6));
      if (dmg <= 0) continue;
      a.hp -= dmg;
      sim.emit({ type: 'hit', victim: a.id, attacker: -1, zone: 'chest', damage: dmg, killed: a.hp <= 0, x: a.pos.x, y: a.pos.y + 1, z: a.pos.z });
      if (a.hp <= 0) sim.kill(a, null, 'c4', false);
    }
    this.end('atk', 'bomb');
  }

  /** Bomb pick-up and win conditions. Runs after actors are simulated. */
  postUpdate(): void {
    const sim = this.sim;
    const bomb = this.bomb;
    if (bomb.planter >= 0 && !sim.actors[bomb.planter].alive) bomb.planter = -1;
    if (bomb.defuser >= 0 && !sim.actors[bomb.defuser].alive) bomb.defuser = -1;

    if (bomb.status === 'dropped' && (this.phase === 'live' || this.phase === 'freeze')) {
      for (const a of sim.actors) {
        if (!a.alive || a.team !== 'atk') continue;
        if (a.id === bomb.dropper && sim.time - bomb.dropTime < 1.5) continue;
        if (dist2D(a.pos, bomb.pos) < 1.0 && Math.abs(a.pos.y - bomb.pos.y) < 1.5) {
          a.hasBomb = true;
          bomb.status = 'carried';
          bomb.carrier = a.id;
          sim.emit({ type: 'bomb', kind: 'pickup', actor: a.id, x: a.pos.x, y: a.pos.y, z: a.pos.z });
          break;
        }
      }
    }

    if (this.phase !== 'live' && this.phase !== 'planted') return;
    let atk = 0;
    let def = 0;
    for (const a of sim.actors) {
      if (!a.alive) continue;
      if (a.team === 'atk') atk++;
      else def++;
    }
    if (def === 0) this.end('atk', 'elim');
    else if (atk === 0 && this.phase === 'live') this.end('def', 'elim');
  }

  end(winner: Team, reason: WinReason): void {
    if (this.phase === 'over' || this.phase === 'matchover') return;
    const sim = this.sim;
    this.winner = winner;
    this.reason = reason;
    this.score[winner]++;
    this.phase = 'over';
    this.phaseEnd = sim.time + RULES.postTime;
    this.bomb.planter = -1;
    this.bomb.defuser = -1;
    sim.emit({ type: 'round', kind: 'end', winner, reason });
  }
}

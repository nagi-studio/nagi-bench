// Team-level coordination: which site to hit, who walks which route, who holds which angle,
// who fetches a dropped bomb, who defuses, and when defenders rotate.

import type { Actor, Team } from './actor';
import { Vec3, dist2D } from './math';
import type { Simulation } from './sim';

export interface Spot {
  pos: Vec3;
  look: Vec3;
}

export interface Assignment {
  role: 'attack' | 'defend';
  /** Target site for attackers; guarded area for defenders. */
  area: 'A' | 'B' | 'mid';
  routeName: string;
  route: Vec3[];
  /** Index into the relevant hold/post list. */
  spotIdx: number;
}

interface Sighting {
  t: number;
  x: number;
  z: number;
  carrier: boolean;
}

export class TeamTactics {
  /** Site the attackers are executing on this round. */
  site: 'A' | 'B' = 'A';
  assignments = new Map<number, Assignment>();
  fetcher = -1;
  defuser = -1;
  rotate: 'A' | 'B' | null = null;
  private pressure = 0;
  private rotateUntil = 0;
  private sightings = new Map<number, Sighting>();

  constructor(
    private sim: Simulation,
    readonly team: Team,
  ) {}

  private bots(): Actor[] {
    return this.sim.actors.filter((a) => a.team === this.team);
  }

  plan(): void {
    const sim = this.sim;
    const rng = sim.rng;
    this.assignments.clear();
    this.sightings.clear();
    this.fetcher = -1;
    this.defuser = -1;
    this.rotate = null;
    this.pressure = 0;
    this.rotateUntil = 0;
    const members = this.bots();
    if (this.team === 'atk') {
      this.site = rng.chance(0.5) ? 'A' : 'B';
      this.assignAttack(this.site, true);
    } else {
      // 2 on A, 2 on B, 1 watching mid. The human (if on this team) takes whatever slot is left.
      const order: ('A' | 'B' | 'mid')[] = ['A', 'B', 'A', 'B', 'mid'];
      const count: Record<string, number> = { A: 0, B: 0, mid: 0 };
      let k = 0;
      for (const a of members) {
        if (a.isHuman) continue;
        const area = order[k++ % order.length];
        this.assignments.set(a.id, { role: 'defend', area, routeName: 'hold', route: [], spotIdx: count[area]++ });
      }
    }
  }

  private assignAttack(site: 'A' | 'B', withRoutes: boolean): void {
    const sim = this.sim;
    const names = site === 'A' ? ['long', 'gantry', 'long', 'gantry', 'long'] : ['tunnel', 'connector', 'tunnel', 'mid', 'tunnel'];
    const members = this.bots();
    // the bomb carrier always takes the main route
    members.sort((a, b) => (a.hasBomb ? -1 : 0) - (b.hasBomb ? -1 : 0) || a.id - b.id);
    let k = 0;
    for (const a of members) {
      if (a.isHuman) continue;
      const name = names[k % names.length];
      const routes = sim.pts.routes[site];
      this.assignments.set(a.id, {
        role: 'attack',
        area: site,
        routeName: name,
        route: withRoutes ? routes[name] : [],
        spotIdx: k,
      });
      k++;
    }
    this.site = site;
  }

  /** Bots follow a human bomb carrier who commits to the other site. */
  retarget(site: 'A' | 'B'): void {
    if (this.team !== 'atk' || this.site === site) return;
    this.assignAttack(site, false);
  }

  get(id: number): Assignment | undefined {
    return this.assignments.get(id);
  }

  report(enemy: Actor): void {
    this.sightings.set(enemy.id, { t: this.sim.time, x: enemy.pos.x, z: enemy.pos.z, carrier: enemy.hasBomb });
  }

  /** Current defensive spot for a bot, honouring rotations. */
  holdSpot(a: Actor, offset: number): Spot {
    const sim = this.sim;
    const asg = this.assignments.get(a.id);
    const area = asg ? asg.area : 'mid';
    const idx = asg ? asg.spotIdx : 0;
    let target: 'A' | 'B' | 'mid' = area;
    let extra = 0;
    if (this.rotate && area !== this.rotate) {
      // the mid player rotates on first contact; the second anchor of the other site follows
      // once the push looks committed (several attackers or the bomb carrier spotted)
      if (area === 'mid' || (idx === 1 && this.pressure >= 2)) {
        target = this.rotate;
        extra = 2;
      }
    }
    if (target === 'mid') {
      const list = sim.pts.midHolds;
      return list[(idx + offset) % list.length];
    }
    const list = sim.pts.sites[target].holds;
    return list[(idx + extra + offset) % list.length];
  }

  update(): void {
    const sim = this.sim;
    const now = sim.time;
    const bomb = sim.round.bomb;
    const members = this.bots().filter((a) => a.alive && !a.isHuman);
    if (this.team === 'atk') {
      // --- nearest bot recovers a dropped bomb
      if (bomb.status === 'dropped') {
        const cur = this.fetcher >= 0 ? sim.actors[this.fetcher] : null;
        if (!cur || !cur.alive || cur.isHuman) {
          let best = -1;
          let bd = Infinity;
          for (const a of members) {
            const d = dist2D(a.pos, bomb.pos);
            if (d < bd) {
              bd = d;
              best = a.id;
            }
          }
          this.fetcher = best;
        }
      } else {
        this.fetcher = -1;
      }
      // --- follow a human carrier's lead
      if (bomb.status === 'carried' && bomb.carrier >= 0 && sim.actors[bomb.carrier].isHuman) {
        const h = sim.actors[bomb.carrier];
        const dA = dist2D(h.pos, sim.pts.sites.A.center);
        const dB = dist2D(h.pos, sim.pts.sites.B.center);
        if (dA < 42 && dA + 12 < dB) this.retarget('A');
        else if (dB < 42 && dB + 12 < dA) this.retarget('B');
      }
    } else {
      // --- defuser: closest living bot, sticky once chosen
      if (bomb.status === 'planted') {
        const cur = this.defuser >= 0 ? sim.actors[this.defuser] : null;
        if (!cur || !cur.alive || cur.isHuman) {
          let best = -1;
          let bd = Infinity;
          for (const a of members) {
            const d = dist2D(a.pos, bomb.pos);
            if (d < bd) {
              bd = d;
              best = a.id;
            }
          }
          this.defuser = best;
        }
      } else {
        this.defuser = -1;
        // --- rotation: where is the attack coming from?
        let sa = 0;
        let sb = 0;
        this.sightings.forEach((s) => {
          if (now - s.t > 7) return;
          const w = s.carrier ? 2 : 1;
          if (s.z < -10 && s.x > -24) sa += w;
          else if (s.z > 10 && s.x > -14) sb += w;
        });
        this.pressure = Math.max(sa, sb);
        if (sa >= 1 && sa > sb) {
          this.rotate = 'A';
          this.rotateUntil = now + 14;
        } else if (sb >= 1 && sb > sa) {
          this.rotate = 'B';
          this.rotateUntil = now + 14;
        } else if (now > this.rotateUntil) {
          this.rotate = null;
          this.pressure = 0;
        }
      }
    }
  }
}

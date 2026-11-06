// Team-level strategy: per-round T execute (A long / A short split or B rush), CT setup
// (2 A / 1 mid / 2 B), bomb fetching after the carrier dies, and CT rotations when Ts are
// spotted on a site.

import type { Game } from '../Game';
import type { Soldier } from '../entities/Soldier';
import type { SiteId, Team } from '../types';
import { pick, shuffle } from '../math';
import { rectContains, type HoldSpot } from '../world/MapData';
import type { BotGoal } from './BotBrain';

export class TeamPlanner {
  tSite: SiteId = 'A';
  private alerts: Record<SiteId, number> = { A: -100, B: -100 };
  private rotated = new Set<number>();
  private nextUpdate = 0;

  constructor(private game: Game) {}

  planRound() {
    const g = this.game;
    const map = g.map;
    this.alerts = { A: -100, B: -100 };
    this.rotated.clear();
    this.tSite = Math.random() < 0.5 ? 'A' : 'B';

    // ---- T execute
    const ts = g.soldiers.filter((s) => s.team === 'T');
    const routes =
      this.tSite === 'A'
        ? shuffle(['A_long', 'A_long', 'A_short', 'A_short', Math.random() < 0.5 ? 'A_long' : 'A_short'])
        : shuffle(['B_tunnels', 'B_tunnels', 'B_tunnels', 'B_mid', Math.random() < 0.6 ? 'B_tunnels' : 'B_mid']);
    // bomb carrier takes the main route
    const carrierIdx = ts.findIndex((s) => s.hasBomb);
    if (carrierIdx >= 0) {
      const main = this.tSite === 'A' ? 'A_long' : 'B_tunnels';
      const mi = routes.indexOf(main);
      if (mi >= 0) [routes[carrierIdx], routes[mi]] = [routes[mi], routes[carrierIdx]];
    }
    ts.forEach((s, i) => {
      const r = map.routes[routes[i]];
      this.assign(s, { kind: 'route', route: r.points, site: r.site });
    });

    // ---- CT setup
    const cts = g.soldiers.filter((s) => s.team === 'CT');
    const spot = (name: string) => map.holdSpots.find((h) => h.name === name)!;
    const aPair = shuffle(['A Long', 'A Short', 'A Site']).slice(0, 2);
    const bPair = shuffle(['B Site', 'B Plat', 'B Doors']).slice(0, 2);
    const plan = shuffle([...aPair, 'Mid', ...bPair]);
    // AWPers prefer long angles
    const awper = cts.find((s) => s.weapons.primary?.def.id === 'awp');
    if (awper) {
      const idx = cts.indexOf(awper);
      const want = Math.random() < 0.6 ? 'A Long' : 'Mid';
      const wi = plan.indexOf(want);
      if (wi >= 0) [plan[idx], plan[wi]] = [plan[wi], plan[idx]];
      else plan[idx] = want;
    }
    cts.forEach((s, i) => this.assign(s, { kind: 'hold', spot: spot(plan[i]) }));
  }

  private assign(s: Soldier, goal: BotGoal) {
    s.brain?.resetForRound(goal);
  }

  reportSighting(observerTeam: Team, enemy: Soldier) {
    if (observerTeam !== 'CT') return;
    const map = this.game.map;
    for (const site of ['A', 'B'] as SiteId[]) {
      const r = map.sites[site];
      if (rectContains(r, enemy.pos.x, enemy.pos.z, 14)) this.alerts[site] = this.game.time;
    }
  }

  update() {
    const g = this.game;
    const t = g.time;
    if (t < this.nextUpdate) return;
    this.nextUpdate = t + 0.5;
    const b = g.round.bomb;

    // bomb fetch: nearest alive T bot
    const tBots = g.soldiers.filter((s) => s.team === 'T' && s.alive && s.brain);
    for (const s of tBots) s.brain!.fetchBomb = false;
    if (b.state === 'dropped') {
      let best: Soldier | null = null;
      let bd = Infinity;
      for (const s of tBots) {
        if (s.human) continue;
        const d = s.pos.distanceTo(b.pos);
        if (d < bd) {
          bd = d;
          best = s;
        }
      }
      if (best) best.brain!.fetchBomb = true;
    }

    // CT rotations
    if (b.state !== 'planted') {
      for (const site of ['A', 'B'] as SiteId[]) {
        if (t - this.alerts[site] > 6) continue;
        const cts = g.soldiers.filter((s) => s.team === 'CT' && s.alive && s.brain && !s.human);
        const onSite = cts.filter((s) => this.holdSite(s) === site).length;
        if (onSite >= 3) continue;
        const candidates = cts.filter((s) => this.holdSite(s) !== site && !this.rotated.has(s.id));
        if (!candidates.length) continue;
        // prefer mid player, then closest
        candidates.sort((a, c) => (this.holdSite(a) === 'MID' ? -1 : 0) - (this.holdSite(c) === 'MID' ? -1 : 0));
        const r = candidates[0];
        this.rotated.add(r.id);
        const spots = g.map.holdSpots.filter((h) => h.site === site);
        const spot: HoldSpot = pick(spots);
        if (r.brain!.goal?.kind === 'hold') r.brain!.goal = { kind: 'hold', spot };
      }
    }
  }

  private holdSite(s: Soldier): SiteId | 'MID' | null {
    const goal = s.brain?.goal;
    return goal?.kind === 'hold' ? goal.spot.site : null;
  }
}

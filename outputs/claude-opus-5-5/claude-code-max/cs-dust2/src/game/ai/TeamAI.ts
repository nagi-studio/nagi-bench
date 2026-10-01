import type { SiteId, Team } from '../core/types';
import type { Actor } from '../sim/Actor';
import type { World } from '../sim/World';
import type { HoldSpot } from '../world/MapData';
import type { NavPoint } from '../world/NavGrid';
import type { BotTask } from './BotBrain';

const A_ZONES = new Set(['A 大', 'A 门外', 'A 大门', 'A 坑', 'A 斜坡', 'A 点', '猫道', 'A 小']);
const B_ZONES = new Set(['B 洞', 'B 洞外', '下 B 洞', 'B 点', 'B 门']);

/** Where attackers enter each site from — retake guards face these. */
const SITE_THREATS: Record<SiteId, [number, number][]> = {
  A: [
    [93, 31],
    [78, 28],
    [74, 13],
  ],
  B: [
    [20, 31.5],
    [33, 14.5],
  ],
};

/** Route index where the group regroups before executing onto the site. */
const STAGE_POINT: Record<string, string> = {
  long: 'longCorner',
  short: 'catTop',
  tunnels: 'upperTunnels',
  midToB: 'upperTunnels',
  midDoors: 'midDoorsT',
};

const CT_PLANS: string[][] = [
  ['aLong', 'bSite', 'mid', 'aShort', 'bDoors'],
  ['aGoose', 'bCar', 'midBox', 'aCt', 'bPlat'],
  ['aLong', 'bPlat', 'mid', 'aShort', 'bSite'],
  ['aShort', 'bDoors', 'mid', 'aLong', 'bCar'],
];

/**
 * Team-level tactics ("commander"). T: picks a site, splits bots across real Dust2 routes
 * (long / catwalk / mid / tunnels), regroups at staging points, executes, plants, then holds
 * post-plant angles; recovers dropped bombs; rushes late. CT: default setup across A / mid / B,
 * patrols holds, rotates on intel, retakes and defuses after a plant.
 */
export class TeamAI {
  private nextThink = 0;
  site: SiteId = 'A';
  private released = false;
  private planted = false;
  private lateRush = false;
  private rotatedTo: SiteId | null = null;
  private readonly roles = new Map<number, SiteId | 'mid'>();

  constructor(
    private readonly world: World,
    readonly team: Team,
  ) {}

  private bots(): Actor[] {
    return this.world.actors.filter((a) => a.team === this.team && a.alive && a.isBot && a.brain);
  }

  private jitter(p: NavPoint, r: number): NavPoint {
    const rng = this.world.rng;
    const q = { x: p.x + rng.range(-r, r), z: p.z + rng.range(-r, r) };
    return this.world.nav.nearestWalkable(q.x, q.z, 3) ?? p;
  }

  private holdTask(h: HoldSpot, patrolRadius = 2.5): BotTask {
    const dest = this.world.nav.nearestWalkable(h.pos[0], h.pos[1], 3) ?? { x: h.pos[0], z: h.pos[1] };
    const patrol: NavPoint[] = [dest];
    for (let i = 0; i < 2; i++) patrol.push(this.jitter(dest, patrolRadius));
    return { kind: 'hold', dest, look: { x: h.look[0], z: h.look[1] }, patrol };
  }

  onRoundStart(): void {
    this.released = false;
    this.planted = false;
    this.lateRush = false;
    this.rotatedTo = null;
    this.roles.clear();
    this.nextThink = 0;
    if (this.team === 'T') this.planT();
    else this.planCT();
  }

  update(): void {
    const w = this.world;
    if (w.phase !== 'live' || w.time < this.nextThink) return;
    this.nextThink = w.time + 0.25;
    if (this.team === 'T') this.thinkT();
    else this.thinkCT();
  }

  // ================================================================== T side

  private planT(): void {
    const w = this.world;
    const r = w.rng;
    this.site = r.chance(0.5) ? 'A' : 'B';
    const carrier = w.bomb.carrier;
    const bots = r.shuffle(this.bots()).sort((a, b) => (a === carrier ? -1 : b === carrier ? 1 : 0));
    let routes: string[];
    if (this.site === 'A') {
      routes = r.chance(0.55) ? ['long', 'long', 'short', 'long', 'midToA'] : ['long', 'short', 'long', 'short', 'midToA'];
    } else {
      routes = r.chance(0.6) ? ['tunnels', 'tunnels', 'tunnels', 'midDoors', 'tunnels'] : ['tunnels', 'tunnels', 'midToB', 'midDoors', 'tunnels'];
    }
    bots.forEach((bot, i) => this.assignRoute(bot, routes[i % routes.length]));
  }

  private assignRoute(bot: Actor, routeName: string): void {
    const level = this.world.level;
    const names = level.def.routes[routeName];
    const points = names.map((n) => this.jitter(level.point(n), 0.9));
    const stageName = STAGE_POINT[routeName];
    const holdAt = stageName ? names.indexOf(stageName) : undefined;
    let then: BotTask;
    if (routeName === 'midToA') {
      // mid lurker: hold mid doors, watching CT mid
      then = this.holdTask({ id: 'lurk', pos: [47.5, 30], look: [48, 18], area: 'mid' }, 1.5);
    } else {
      then = this.siteTask(bot);
    }
    bot.brain!.setTask({
      kind: 'route',
      points,
      index: 1,
      holdAt: holdAt !== undefined && holdAt >= 0 ? holdAt : undefined,
      released: false,
      group: routeName === 'midToA' ? 'lurk' : 'main',
      then,
    });
  }

  private plantTask(): BotTask {
    const s = this.world.level.site(this.site);
    return { kind: 'plant', site: this.site, dest: this.jitter({ x: s.plant[0], z: s.plant[1] }, 1.0) };
  }

  private siteTask(bot: Actor): BotTask {
    if (bot.hasBomb) return this.plantTask();
    const spots = this.world.level.def.postPlant[this.site];
    const idx = bot.id % spots.length;
    return this.holdTask(spots[idx], 2);
  }

  private thinkT(): void {
    const w = this.world;
    const b = w.bomb;
    const bots = this.bots();
    if (!bots.length) return;

    if (b.state === 'planted') {
      if (!this.planted) {
        this.planted = true;
        this.site = b.site ?? this.site;
        const spots = w.rng.shuffle([...w.level.def.postPlant[this.site]]);
        bots.forEach((bot, i) => {
          if (bot.brain!.task.kind !== 'hold' || i < spots.length) bot.brain!.setTask(this.holdTask(spots[i % spots.length], 2));
        });
      }
      return;
    }

    // recover a dropped bomb with the closest bot
    if (b.state === 'dropped' && !bots.some((x) => x.brain!.task.kind === 'pickup')) {
      let best: Actor | null = null;
      let bestD = Infinity;
      for (const bot of bots) {
        const d = bot.pos.distanceToSquared(b.pos);
        if (d < bestD) {
          bestD = d;
          best = bot;
        }
      }
      best?.brain!.setTask({ kind: 'pickup' });
    }

    // the carrier always ends up planting
    if (b.state === 'carried' && b.carrier?.isBot && b.carrier.brain) {
      const t = b.carrier.brain.task;
      if (t.kind === 'route') {
        if (t.then?.kind !== 'plant') t.then = this.plantTask();
      } else if (t.kind !== 'plant') {
        b.carrier.brain.setTask(this.plantTask());
      }
    }

    // regroup at staging, then execute together
    if (!this.released) {
      const main = bots.filter((x) => x.brain!.task.kind === 'route' && x.brain!.task.group === 'main');
      const waiting = main.filter((x) => {
        const t = x.brain!.task;
        if (t.holdAt === undefined || t.index !== t.holdAt) return false;
        const p = t.points![t.holdAt];
        return Math.hypot(x.pos.x - p.x, x.pos.z - p.z) < 2.6;
      });
      const enough = waiting.length >= Math.min(2, main.length) && main.length > 0;
      if (enough || w.roundElapsed > 38 || main.length === 0) this.releaseAll();
    }

    if (!this.lateRush && w.roundTimeLeft < 32) {
      this.lateRush = true;
      this.releaseAll();
      for (const bot of bots) {
        const t = bot.brain!.task;
        if (t.kind === 'hold' && !bot.hasBomb) bot.brain!.setTask(this.siteTask(bot));
      }
    }

    for (const bot of bots) {
      if (bot.brain!.task.kind === 'idle') bot.brain!.setTask(this.siteTask(bot));
    }
  }

  private releaseAll(): void {
    this.released = true;
    for (const bot of this.bots()) {
      const t = bot.brain!.task;
      if (t.kind === 'route') t.released = true;
    }
  }

  // ================================================================== CT side

  private planCT(): void {
    const w = this.world;
    const plan = w.rng.pick(CT_PLANS);
    const bots = w.rng.shuffle(this.bots());
    bots.forEach((bot, i) => this.assignHold(bot, plan[i % plan.length]));
  }

  private assignHold(bot: Actor, holdId: string): void {
    const h = this.world.level.def.ctHolds.find((x) => x.id === holdId)!;
    bot.brain!.setTask(this.holdTask(h, 2.2));
    this.roles.set(bot.id, h.area);
  }

  private thinkCT(): void {
    const w = this.world;
    const b = w.bomb;
    const bots = this.bots();
    if (!bots.length) return;

    if (b.state === 'planted') {
      if (!this.planted) {
        this.planted = true;
        this.assignRetake(bots);
      }
      if (!bots.some((x) => x.brain!.task.kind === 'defuse')) {
        const closest = bots.slice().sort((p, q) => p.pos.distanceToSquared(b.pos) - q.pos.distanceToSquared(b.pos))[0];
        closest.brain!.setTask({ kind: 'defuse' });
      }
      return;
    }

    // rotate on fresh intel
    let nA = 0;
    let nB = 0;
    for (const e of w.intel.CT.values()) {
      if (w.time - e.time > 5) continue;
      const zone = w.level.zoneAt(e.x, e.z);
      if (A_ZONES.has(zone)) nA++;
      else if (B_ZONES.has(zone)) nB++;
    }
    if (nA >= 2 && nA > nB && this.rotatedTo !== 'A') this.rotate('A', bots);
    else if (nB >= 2 && nB > nA && this.rotatedTo !== 'B') this.rotate('B', bots);

    for (const bot of bots) {
      if (bot.brain!.task.kind === 'idle') {
        const area = this.roles.get(bot.id) ?? 'mid';
        const holds = w.level.def.ctHolds.filter((h) => h.area === area);
        if (holds.length) bot.brain!.setTask(this.holdTask(w.rng.pick(holds), 2.2));
      }
    }
  }

  private rotate(site: SiteId, bots: Actor[]): void {
    const w = this.world;
    this.rotatedTo = site;
    const holds = w.level.def.ctHolds.filter((h) => h.area === site);
    const target = w.level.site(site);
    const movers = bots
      .filter((x) => this.roles.get(x.id) !== site && !x.brain!.hasRecentContact)
      .sort(
        (p, q) =>
          (p.pos.x - target.plant[0]) ** 2 + (p.pos.z - target.plant[1]) ** 2 - ((q.pos.x - target.plant[0]) ** 2 + (q.pos.z - target.plant[1]) ** 2),
      )
      .slice(0, 2);
    movers.forEach((bot, i) => {
      const h = holds[(i + 2) % holds.length];
      bot.brain!.setTask(this.holdTask(h, 2));
      this.roles.set(bot.id, site);
    });
  }

  private assignRetake(bots: Actor[]): void {
    const w = this.world;
    const b = w.bomb;
    const site = b.site ?? 'A';
    const threats = SITE_THREATS[site];
    const sorted = bots.slice().sort((p, q) => p.pos.distanceToSquared(b.pos) - q.pos.distanceToSquared(b.pos));
    sorted.forEach((bot, i) => {
      if (i === 0) {
        bot.brain!.setTask({ kind: 'defuse' });
        return;
      }
      const ang = (i / Math.max(1, sorted.length - 1)) * Math.PI * 2;
      const p = w.nav.nearestWalkable(b.pos.x + Math.cos(ang) * 4.5, b.pos.z + Math.sin(ang) * 4.5, 4) ?? { x: b.pos.x, z: b.pos.z };
      const look = threats[i % threats.length];
      bot.brain!.setTask({ kind: 'hold', dest: p, look: { x: look[0], z: look[1] }, patrol: [p] });
    });
  }
}

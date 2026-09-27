// Round flow: freeze -> live -> over, loadouts (pistol round vs gun round), win conditions.

import { SPAWNS } from './mapData.ts';
import type { Character, Team } from './character.ts';
import type { RoundEndReason } from './events.ts';
import type { WeaponId } from './weapons.ts';
import { WEAPONS } from './weapons.ts';
import { shuffle } from './math.ts';
import type { Sim } from './sim.ts';

export type RoundPhase = 'freeze' | 'live' | 'over' | 'matchover';

export const ROUND_CFG = {
  freezeTime: 5,
  roundTime: 115,
  postTime: 5.5,
  bombTime: 40,
  plantTime: 3.2,
  defuseTime: 10,
  kitDefuseTime: 5,
  buyTime: 20,
};

export interface TeamLoadout {
  primary: WeaponId | null;
  secondary: WeaponId;
}

export interface RoundLoadout {
  name: string;
  T: TeamLoadout;
  CT: TeamLoadout;
  armor: number;
  helmet: boolean;
  ctKits: boolean;
  /** extra weapons randomly handed to bots */
  awpPerTeam: number;
  deagleChance: number;
}

/** Pistol round = standard CS first round: default pistol + knife, kevlar without helmet, no kits. */
export const LOADOUTS: Record<'pistol' | 'gun', RoundLoadout> = {
  pistol: {
    name: '手枪局',
    T: { primary: null, secondary: 'glock' },
    CT: { primary: null, secondary: 'usp' },
    armor: 100,
    helmet: false,
    ctKits: false,
    awpPerTeam: 0,
    deagleChance: 0,
  },
  gun: {
    name: '长枪局',
    T: { primary: 'ak47', secondary: 'glock' },
    CT: { primary: 'm4a4', secondary: 'usp' },
    armor: 100,
    helmet: true,
    ctKits: true,
    awpPerTeam: 1,
    deagleChance: 0.3,
  },
};

export interface PlayerBuy {
  primary: WeaponId | null;
  secondary: WeaponId | null;
}

export class RoundManager {
  phase: RoundPhase = 'freeze';
  number = 0;
  isPistol = true;
  phaseEnd = 0;
  liveEnd = 0;
  liveStart = 0;
  score: Record<Team, number> = { T: 0, CT: 0 };
  lastWinner: Team | null = null;
  lastReason: RoundEndReason | null = null;
  matchWinner: Team | null = null;
  /** buy-menu selection of the human player (applies on gun rounds) */
  playerBuy: PlayerBuy = { primary: null, secondary: null };
  history: { winner: Team; reason: RoundEndReason }[] = [];
  /** bombsite the T bots execute on this round */
  tPlan: 'A' | 'B' = 'A';

  private sim: Sim;

  constructor(sim: Sim) {
    this.sim = sim;
  }

  get loadout(): RoundLoadout {
    return this.isPistol ? LOADOUTS.pistol : LOADOUTS.gun;
  }

  timeLeft(): number {
    const t = this.sim.time;
    if (this.phase === 'freeze') return this.phaseEnd - t;
    if (this.phase === 'live') return Math.max(0, this.liveEnd - t);
    return 0;
  }

  canBuy(c: Character): boolean {
    if (this.isPistol) return false;
    if (this.phase === 'freeze') return true;
    return this.phase === 'live' && this.sim.time - this.liveStart < ROUND_CFG.buyTime && this.sim.inBuyZone(c);
  }

  startRound() {
    const sim = this.sim;
    this.number++;
    this.isPistol = this.number === 1 || sim.config.allPistolRounds;
    const lo = this.loadout;
    sim.resetRoundState();
    this.tPlan = Math.random() < 0.5 ? 'A' : 'B';

    for (const team of ['T', 'CT'] as Team[]) {
      const members = sim.chars.filter((c) => c.team === team);
      const spawns = shuffle(SPAWNS[team].slice());
      const bots = shuffle(members.filter((c) => c.id !== sim.playerId));
      const awpers = new Set(bots.slice(0, lo.awpPerTeam).map((c) => c.id));
      members.forEach((c, i) => {
        c.resetForRound();
        const [sx, sz] = spawns[i % spawns.length];
        c.body.pos.x = sx + (Math.random() - 0.5) * 0.6;
        c.body.pos.z = sz + (Math.random() - 0.5) * 0.6;
        c.body.pos.y = sim.world.floorAt(c.body.pos.x, c.body.pos.z) ?? 0;
        c.yaw = team === 'T' ? 0 : Math.PI;
        c.pitch = 0;
        const tl = lo[team];
        c.give('knife');
        c.give(tl.secondary);
        if (tl.primary) c.give(tl.primary);
        if (awpers.has(c.id)) c.give('awp');
        if (!this.isPistol && c.id !== sim.playerId && Math.random() < lo.deagleChance) c.give('deagle');
        if (c.id === sim.playerId && !this.isPistol) this.applyPlayerBuy(c);
        c.armor = lo.armor;
        c.helmet = lo.helmet;
        c.hasKit = team === 'CT' && lo.ctKits;
        c.active = c.bestSlot();
        c.lastSlot = c.weapons.secondary && c.active !== 'secondary' ? 'secondary' : 'melee';
        c.deployEnd = sim.time + 0.3;
      });
    }

    // Hand the C4 to a random terrorist
    const ts = sim.chars.filter((c) => c.team === 'T');
    const carrier = ts[Math.floor(Math.random() * ts.length)];
    sim.giveBomb(carrier);

    this.phase = 'freeze';
    this.phaseEnd = sim.time + ROUND_CFG.freezeTime;
    sim.emit({ type: 'round_start', round: this.number, pistol: this.isPistol });
    for (const b of sim.brains) b?.onRoundStart();
  }

  applyPlayerBuy(c: Character) {
    const b = this.playerBuy;
    if (b.primary && (!WEAPONS[b.primary].team || WEAPONS[b.primary].team === c.team)) c.give(b.primary);
    if (b.secondary && (!WEAPONS[b.secondary].team || WEAPONS[b.secondary].team === c.team)) c.give(b.secondary);
  }

  update() {
    const t = this.sim.time;
    if (this.phase === 'freeze' && t >= this.phaseEnd) {
      this.phase = 'live';
      this.liveStart = t;
      this.liveEnd = t + ROUND_CFG.roundTime;
      this.sim.emit({ type: 'freeze_end' });
    }
    if (this.phase === 'live') {
      this.checkWin();
      if (this.phase === 'live' && t >= this.liveEnd && this.sim.bomb.state !== 'planted') {
        this.endRound('CT', 'time');
      }
    }
    if (this.phase === 'over' && t >= this.phaseEnd) {
      if (this.matchWinner) {
        this.phase = 'matchover';
        this.sim.emit({ type: 'match_end', winner: this.matchWinner });
      } else this.startRound();
    }
  }

  checkWin() {
    if (this.phase !== 'live') return;
    let aliveT = 0;
    let aliveCT = 0;
    for (const c of this.sim.chars) {
      if (!c.alive) continue;
      if (c.team === 'T') aliveT++;
      else aliveCT++;
    }
    const planted = this.sim.bomb.state === 'planted';
    if (aliveCT === 0) this.endRound('T', 'elimination');
    else if (aliveT === 0 && !planted) this.endRound('CT', 'elimination');
  }

  endRound(winner: Team, reason: RoundEndReason) {
    if (this.phase !== 'live') return;
    this.phase = 'over';
    this.phaseEnd = this.sim.time + ROUND_CFG.postTime;
    this.score[winner]++;
    this.lastWinner = winner;
    this.lastReason = reason;
    this.history.push({ winner, reason });
    if (this.score[winner] >= this.sim.config.winsToMatch) this.matchWinner = winner;
    this.sim.emit({ type: 'round_end', winner, reason });
  }
}

// Round / match state machine + C4 lifecycle (carry, drop, pick up, plant, defuse, explode).

import * as THREE from 'three';
import type { Game } from '../Game';
import type { Soldier } from '../entities/Soldier';
import type { SiteId, Team } from '../types';
import { TEAM_LABEL } from '../types';
import {
  BOMB_DAMAGE_RADIUS,
  BOMB_KILL_RADIUS,
  BOMB_TIMER,
  DEFUSE_KIT_TIME,
  DEFUSE_TIME,
  FREEZE_TIME,
  PLANT_TIME,
  ROUND_END_DELAY,
  ROUND_TIME,
  WIN_ROUNDS,
} from '../config';
import { ROUND_LOADOUT, ROUND_TYPE_LABEL, type RoundType } from '../weapons/WeaponDefs';
import { rectContains } from '../world/MapData';
import { pick, yawToward } from '../math';

export type Phase = 'freeze' | 'live' | 'post' | 'over';
export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface Bomb {
  state: BombState;
  carrier: Soldier | null;
  pos: THREE.Vector3;
  site: SiteId | null;
  timer: number;
  nextBeep: number;
  defuser: Soldier | null;
}

export class RoundManager {
  phase: Phase = 'freeze';
  phaseTimer = FREEZE_TIME;
  roundTime = ROUND_TIME;
  round = 0;
  roundType: RoundType = 'pistol';
  score: Record<Team, number> = { T: 0, CT: 0 };
  winner: Team | null = null;
  matchWinner: Team | null = null;
  liveSince = 0;
  pistolFirst = true;
  readonly bomb: Bomb = {
    state: 'carried',
    carrier: null,
    pos: new THREE.Vector3(),
    site: null,
    timer: 0,
    nextBeep: 0,
    defuser: null,
  };
  private plantKeyAt = 0;
  private defuseTickAt = 0;

  constructor(private game: Game) {}

  startMatch(pistolFirst: boolean) {
    this.pistolFirst = pistolFirst;
    this.score = { T: 0, CT: 0 };
    this.round = 0;
    this.matchWinner = null;
    for (const s of this.game.soldiers) {
      s.kills = 0;
      s.deaths = 0;
      s.headshots = 0;
    }
    this.startRound();
  }

  siteAt(x: number, z: number): SiteId | null {
    const sites = this.game.map.sites;
    if (rectContains(sites.A, x, z)) return 'A';
    if (rectContains(sites.B, x, z)) return 'B';
    return null;
  }

  startRound() {
    const g = this.game;
    this.round++;
    this.roundType = this.round === 1 && this.pistolFirst ? 'pistol' : 'full';
    this.phase = 'freeze';
    this.phaseTimer = FREEZE_TIME;
    this.roundTime = ROUND_TIME;
    this.winner = null;

    for (const team of ['T', 'CT'] as Team[]) {
      const members = g.soldiers.filter((s) => s.team === team);
      const spawns = g.map.spawns[team];
      members.forEach((s, i) => {
        const sp = spawns[i % spawns.length];
        const y = g.world.floorAt(sp.x, sp.z);
        const facing = team === 'T' ? yawToward(0, -1) : yawToward(0, 1);
        const survivedWithPrimary = this.roundType === 'full' && s.alive && !!s.weapons.primary && this.round > 1;
        s.resetForRound(sp.x, Number.isNaN(y) ? 0 : y, sp.z, facing);
        s.applyLoadout(ROUND_LOADOUT[this.roundType][team], survivedWithPrimary);
        s.drawEnd = 0;
      });
    }
    // AI loadout variety in full-buy rounds: occasional AWP / deagle
    if (this.roundType === 'full') {
      for (const team of ['T', 'CT'] as Team[]) {
        const bots = g.soldiers.filter((s) => s.team === team && s !== g.playerSoldier);
        if (bots.length && Math.random() < (team === 'CT' ? 0.6 : 0.4)) {
          const b = pick(bots);
          b.give('awp');
          b.current = 'primary';
        }
        for (const b of bots) if (Math.random() < 0.2) b.give('deagle');
      }
    }

    // C4 to a random T
    const ts = g.soldiers.filter((s) => s.team === 'T');
    const carrier = pick(ts);
    carrier.hasBomb = true;
    Object.assign(this.bomb, { state: 'carried', carrier, site: null, timer: 0, defuser: null });

    g.onRoundStart();
    g.message(`第 ${this.round} 回合 · ${ROUND_TYPE_LABEL[this.roundType]}`, this.roundType === 'pistol' ? '全员仅默认手枪 · 无护甲' : '冻结时间可按 B 购买', '#ffd479');
  }

  get bombPlanted(): boolean {
    return this.bomb.state === 'planted';
  }

  alive(team: Team): number {
    let n = 0;
    for (const s of this.game.soldiers) if (s.team === team && s.alive) n++;
    return n;
  }

  dropBomb(s: Soldier, toss: THREE.Vector3 | null) {
    if (!s.hasBomb) return;
    s.hasBomb = false;
    const b = this.bomb;
    b.state = 'dropped';
    b.carrier = null;
    const p = toss ?? s.pos;
    const y = this.game.world.groundHeight(p.x, p.z, 0.1, s.pos.y + 0.5);
    b.pos.set(p.x, y, p.z);
    this.game.onBombDropped(s);
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase === 'post' || this.phase === 'over') return;
    const g = this.game;
    this.winner = winner;
    this.score[winner]++;
    this.phase = 'post';
    this.phaseTimer = ROUND_END_DELAY;
    if (this.score[winner] >= WIN_ROUNDS) {
      this.matchWinner = winner;
      this.phase = 'over';
    }
    g.onRoundEnd(winner, reason);
    g.message(`${TEAM_LABEL[winner]}获胜`, reason, winner === 'CT' ? '#7fb6ff' : '#ffc46b');
  }

  checkElimination() {
    if (this.phase !== 'live' && this.phase !== 'freeze') return;
    const t = this.alive('T');
    const ct = this.alive('CT');
    if (ct === 0) this.endRound('T', '反恐精英全部阵亡');
    else if (t === 0 && !this.bombPlanted) this.endRound('CT', '恐怖分子全部阵亡');
  }

  update(dt: number) {
    const g = this.game;
    const b = this.bomb;
    if (this.phase === 'freeze') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        this.phase = 'live';
        this.liveSince = g.time;
        g.audio.roundStart();
      }
    } else if (this.phase === 'live') {
      if (!this.bombPlanted) {
        this.roundTime -= dt;
        if (this.roundTime <= 0) {
          this.roundTime = 0;
          this.endRound('CT', '时间耗尽，炸弹未安放');
        }
      }
    } else if (this.phase === 'post') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) this.startRound();
      // bomb keeps ticking visually only if planted & not resolved
    }

    // ---- C4 ----
    if (b.state === 'carried' && b.carrier && !b.carrier.alive) this.dropBomb(b.carrier, null);
    if (b.state === 'dropped' && this.phase !== 'over') {
      for (const s of g.soldiers) {
        if (!s.alive || s.team !== 'T') continue;
        const d = Math.hypot(s.pos.x - b.pos.x, s.pos.z - b.pos.z);
        if (d < 1.1 && Math.abs(s.pos.y - b.pos.y) < 1.4 && g.time > s.pickupBlockedUntil) {
          s.hasBomb = true;
          b.state = 'carried';
          b.carrier = s;
          g.onBombPickup(s);
          break;
        }
      }
    }
    if (b.state === 'carried' && b.carrier && this.phase === 'live') this.updatePlanting(b.carrier, dt);
    if (b.state === 'planted') {
      if (this.phase === 'live' || this.phase === 'post') {
        b.timer -= dt;
        // accelerating beeps
        if (g.time >= b.nextBeep) {
          const frac = Math.max(0, b.timer / BOMB_TIMER);
          const interval = b.timer < 2 ? 0.1 : 0.12 + 0.88 * frac;
          b.nextBeep = g.time + interval;
          g.audio.c4Beep(b.pos);
          g.onBombBeep();
        }
        if (b.timer <= 0) this.explode();
      }
      if (this.phase === 'live') this.updateDefusing(dt);
    }
    // reset plant progress for non-carriers
    for (const s of g.soldiers) if (!s.hasBomb) s.plantProgress = 0;
  }

  private updatePlanting(s: Soldier, dt: number) {
    const g = this.game;
    const site = this.siteAt(s.pos.x, s.pos.z);
    if (s.alive && s.intent.use && site && s.onGround) {
      s.plantProgress += dt;
      if (g.time >= this.plantKeyAt) {
        this.plantKeyAt = g.time + 0.38;
        if (g.isControlled(s)) g.audio.c4Key();
        else g.audio.c4Beep(s.pos);
      }
      if (s.plantProgress >= PLANT_TIME) {
        s.hasBomb = false;
        s.plantProgress = 0;
        const b = this.bomb;
        b.state = 'planted';
        b.carrier = null;
        b.site = site;
        b.timer = BOMB_TIMER;
        b.nextBeep = g.time + 1;
        const y = g.world.groundHeight(s.pos.x, s.pos.z, 0.1, s.pos.y + 0.5);
        b.pos.set(s.pos.x, y, s.pos.z);
        g.onBombPlanted(s, site);
      }
    } else {
      s.plantProgress = 0;
    }
  }

  private updateDefusing(dt: number) {
    const g = this.game;
    const b = this.bomb;
    // current defuser must keep holding use in range
    if (b.defuser) {
      const s = b.defuser;
      const near = Math.hypot(s.pos.x - b.pos.x, s.pos.z - b.pos.z) < 1.7 && Math.abs(s.pos.y - b.pos.y) < 1.6;
      if (!s.alive || !s.intent.use || !near) {
        s.defuseProgress = 0;
        b.defuser = null;
      }
    }
    if (!b.defuser) {
      for (const s of g.soldiers) {
        if (!s.alive || s.team !== 'CT' || !s.intent.use) continue;
        const near = Math.hypot(s.pos.x - b.pos.x, s.pos.z - b.pos.z) < 1.7 && Math.abs(s.pos.y - b.pos.y) < 1.6;
        if (near) {
          b.defuser = s;
          s.defuseProgress = 0;
          g.onDefuseStart(s);
          break;
        }
      }
    }
    if (b.defuser) {
      const s = b.defuser;
      s.defuseProgress += dt;
      if (g.time >= this.defuseTickAt) {
        this.defuseTickAt = g.time + 0.5;
        g.audio.defuseTick(g.isControlled(s) ? null : b.pos);
      }
      if (s.defuseProgress >= this.defuseTime(s)) {
        b.state = 'defused';
        b.defuser = null;
        s.defuseProgress = 0;
        g.onBombDefused(s);
        this.endRound('CT', `${s.name} 拆除了炸弹`);
      }
    }
  }

  defuseTime(s: Soldier): number {
    return s.kit ? DEFUSE_KIT_TIME : DEFUSE_TIME;
  }

  private explode() {
    const g = this.game;
    const b = this.bomb;
    b.state = 'exploded';
    b.defuser = null;
    g.onBombExploded();
    for (const s of g.soldiers) {
      if (!s.alive) continue;
      const d = s.pos.distanceTo(b.pos);
      if (d > BOMB_DAMAGE_RADIUS) continue;
      const dmg = d < BOMB_KILL_RADIUS ? 500 : 120 * (1 - (d - BOMB_KILL_RADIUS) / (BOMB_DAMAGE_RADIUS - BOMB_KILL_RADIUS));
      g.combat.applyDamage(s, null, dmg, 1, 'chest', 'C4', null, false);
    }
    if (this.phase === 'live') this.endRound('T', '炸弹已爆炸');
  }

  /** Buy menu availability for a soldier. */
  buyStatus(): { allowed: boolean; reason: string } {
    if (this.roundType === 'pistol') return { allowed: false, reason: '手枪局：仅限默认手枪，禁止购买' };
    if (this.phase === 'freeze') return { allowed: true, reason: '' };
    if (this.phase === 'live' && this.game.time - this.liveSince < 20) return { allowed: true, reason: '' };
    return { allowed: false, reason: '购买时间已结束' };
  }
}

/**
 * Round and match flow.
 *
 * freeze -> live -> ended -> (next round | matchOver)
 *
 * Win conditions follow CS: kill the other side, explode the bomb or defuse it. Note that
 * eliminating every T does *not* win the round if the bomb is already ticking.
 */

import type { Team } from '../constants.ts';
import { FREEZE_TIME, MATCH_ROUNDS, ROUND_END_DELAY, ROUND_TIME } from '../constants.ts';
import type { RoundEndReason } from '../events.ts';
import type { GameWorld } from '../world.ts';

export type RoundPhase = 'freeze' | 'live' | 'ended' | 'matchOver';

export class RoundManager {
  phase: RoundPhase = 'freeze';
  round = 1;
  timeLeft = FREEZE_TIME;
  scoreCT = 0;
  scoreT = 0;
  winner: Team | null = null;
  reason: RoundEndReason | null = null;
  pistolRound = true;
  /** Site the T side committed to this round — surfaced for debugging / spectator info. */
  attackSite: 'A' | 'B' = 'A';

  update(world: GameWorld, dt: number): void {
    this.timeLeft -= dt;

    switch (this.phase) {
      case 'freeze':
        if (this.timeLeft <= 0) {
          this.phase = 'live';
          this.timeLeft = ROUND_TIME;
        }
        break;

      case 'live':
        this.checkWinConditions(world);
        break;

      case 'ended':
        if (this.timeLeft <= 0) {
          if (this.scoreCT >= MATCH_ROUNDS || this.scoreT >= MATCH_ROUNDS) {
            this.phase = 'matchOver';
            const winner: Team = this.scoreCT > this.scoreT ? 'CT' : 'T';
            world.events.push({ type: 'matchEnd', winner });
          } else {
            this.round++;
            world.beginRound();
          }
        }
        break;

      case 'matchOver':
        break;
    }
  }

  private checkWinConditions(world: GameWorld): void {
    const bomb = world.bomb;

    if (bomb.state === 'exploded') {
      this.endRound(world, 'T', 'bombExploded');
      return;
    }
    if (bomb.state === 'defused') {
      this.endRound(world, 'CT', 'bombDefused');
      return;
    }

    const tAlive = world.actors.some((a) => a.team === 'T' && a.alive);
    const ctAlive = world.actors.some((a) => a.team === 'CT' && a.alive);

    if (!ctAlive) {
      this.endRound(world, 'T', 'ctEliminated');
      return;
    }
    // A planted bomb keeps the round alive even with the whole T side dead.
    if (!tAlive && bomb.state !== 'planted') {
      this.endRound(world, 'CT', 'tEliminated');
      return;
    }
    if (this.timeLeft <= 0 && bomb.state !== 'planted') {
      this.endRound(world, 'CT', 'timeout');
    }
  }

  endRound(world: GameWorld, winner: Team, reason: RoundEndReason): void {
    if (this.phase === 'ended' || this.phase === 'matchOver') return;
    this.phase = 'ended';
    this.timeLeft = ROUND_END_DELAY;
    this.winner = winner;
    this.reason = reason;
    if (winner === 'CT') this.scoreCT++;
    else this.scoreT++;
    world.events.push({
      type: 'roundEnd',
      winner,
      reason,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
    });
  }

  resetForRound(pistolRound: boolean): void {
    this.phase = 'freeze';
    this.timeLeft = FREEZE_TIME;
    this.winner = null;
    this.reason = null;
    this.pistolRound = pistolRound;
  }
}

export const ROUND_END_TEXT: Record<RoundEndReason, string> = {
  tEliminated: '恐怖分子被全部消灭',
  ctEliminated: '反恐精英被全部消灭',
  bombExploded: 'C4 爆炸',
  bombDefused: 'C4 被拆除',
  timeout: '时间耗尽',
};

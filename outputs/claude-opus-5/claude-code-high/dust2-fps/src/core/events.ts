import type { Vec3 } from './math.ts';
import type { HitboxGroup, Team } from './types.ts';

/**
 * Typed event bus. The simulation never touches THREE or WebAudio directly —
 * it emits events, and the renderer / audio layers subscribe to them.
 * This keeps the engine runnable in a head-less Node process.
 */
export interface GameEventMap {
  shot: {
    actorId: number;
    weaponId: string;
    origin: Vec3;
    end: Vec3;
    /** true when the shot came from the actor the local player is looking through */
    firstPerson: boolean;
  };
  impact: { point: Vec3; normal: Vec3; surface: 'world' | 'flesh' };
  hit: {
    attackerId: number;
    victimId: number;
    damage: number;
    group: HitboxGroup;
    point: Vec3;
    fatal: boolean;
  };
  death: { actorId: number; killerId: number; pos: Vec3; team: Team };
  reload: { actorId: number; weaponId: string; pos: Vec3; firstPerson: boolean };
  emptyClick: { actorId: number; firstPerson: boolean };
  footstep: { actorId: number; pos: Vec3; firstPerson: boolean };
  jump: { actorId: number; pos: Vec3 };
  land: { actorId: number; pos: Vec3; hard: boolean };
  scope: { actorId: number; on: boolean; firstPerson: boolean };
  switchWeapon: { actorId: number; weaponId: string; firstPerson: boolean };
  knifeSwing: { actorId: number; pos: Vec3; firstPerson: boolean };
  bombPickup: { actorId: number };
  bombDropped: { pos: Vec3 };
  bombPlanted: { pos: Vec3; site: 'A' | 'B' };
  bombBeep: { pos: Vec3 };
  bombDefuseStart: { actorId: number; pos: Vec3 };
  bombDefused: { pos: Vec3 };
  bombExploded: { pos: Vec3 };
  roundStart: { round: number; pistolRound: boolean };
  roundEnd: { winner: Team; reason: string };
  kill: { killerId: number; victimId: number; headshot: boolean; byPlayer: boolean };
  playerHurt: { amount: number; fromDir: number };
}

export type GameEventName = keyof GameEventMap;
type Handler<K extends GameEventName> = (payload: GameEventMap[K]) => void;

export class EventBus {
  private handlers = new Map<GameEventName, Set<(p: never) => void>>();

  on<K extends GameEventName>(name: K, fn: Handler<K>): () => void {
    let set = this.handlers.get(name);
    if (!set) {
      set = new Set();
      this.handlers.set(name, set);
    }
    set.add(fn as (p: never) => void);
    return () => this.off(name, fn);
  }

  off<K extends GameEventName>(name: K, fn: Handler<K>): void {
    this.handlers.get(name)?.delete(fn as (p: never) => void);
  }

  emit<K extends GameEventName>(name: K, payload: GameEventMap[K]): void {
    const set = this.handlers.get(name);
    if (!set) return;
    for (const fn of set) (fn as Handler<K>)(payload);
  }

  clear(): void {
    this.handlers.clear();
  }
}

import type { Team } from './entity.ts';
import type { HitGroup } from './hitbox.ts';
import type { SiteId } from './map.ts';
import type { V3 } from './math.ts';
import type { RoundType, SoundProfile, WeaponId } from './weapons.ts';

/** Events produced by the simulation and consumed by renderer / audio / HUD. */
export type SimEvent =
  | {
      type: 'shot';
      shooter: number;
      weapon: WeaponId;
      sound: SoundProfile;
      origin: V3;
      end: V3;
      hitEntity: number | null;
      wallNormal: V3 | null;
    }
  | { type: 'knife'; shooter: number; hit: boolean; stab: boolean }
  | { type: 'damage'; attacker: number; victim: number; amount: number; group: HitGroup; armorHit: boolean; point: V3 }
  | { type: 'kill'; killer: number; victim: number; weapon: string; headshot: boolean }
  | { type: 'reload'; id: number; weapon: WeaponId; time: number }
  | { type: 'reloadDone'; id: number }
  | { type: 'dryfire'; id: number }
  | { type: 'switch'; id: number; weapon: WeaponId }
  | { type: 'scope'; id: number; level: number }
  | { type: 'footstep'; id: number; pos: V3; loud: number }
  | { type: 'land'; id: number; pos: V3 }
  | { type: 'plantStart'; id: number; pos: V3 }
  | { type: 'planted'; id: number; pos: V3; site: SiteId }
  | { type: 'defuseStart'; id: number; pos: V3 }
  | { type: 'defused'; id: number; pos: V3 }
  | { type: 'bombBeep'; pos: V3; urgency: number }
  | { type: 'explode'; pos: V3 }
  | { type: 'bombDrop'; pos: V3 }
  | { type: 'bombPickup'; id: number }
  | { type: 'roundStart'; round: number; roundType: RoundType }
  | { type: 'roundLive' }
  | { type: 'roundEnd'; winner: Team; reason: string }
  | { type: 'matchOver'; winner: Team }
  | { type: 'takeover'; id: number };

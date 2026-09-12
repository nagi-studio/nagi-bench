import { WEAPONS } from '../game/weapons.ts';
import type { HudSnapshot, KillFeedEntry } from './store.ts';

function weaponLabel(weapon: KillFeedEntry['weapon']): string {
  if (weapon === 'bomb') return 'C4';
  if (weapon === 'world') return '—';
  return WEAPONS[weapon].name;
}

/** Live kill notifications, newest at the top right. */
export function KillFeed({ snap }: { snap: HudSnapshot }) {
  return (
    <div className="killfeed">
      {snap.killFeed
        .slice()
        .reverse()
        .map((k) => (
          <div key={k.id} className={`killfeed-row ${k.involvesPlayer ? 'killfeed-row--player' : ''}`}>
            <span className={`kf-name kf-${k.attackerTeam}`}>{k.attacker}</span>
            <span className="kf-weapon">
              {weaponLabel(k.weapon)}
              {k.headshot && <span className="kf-hs" title="爆头">HS</span>}
            </span>
            <span className={`kf-name kf-${k.victimTeam}`}>{k.victim}</span>
          </div>
        ))}
    </div>
  );
}

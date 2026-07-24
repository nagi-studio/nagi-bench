import type { KillEvent } from '../core/types.ts';

/** Top-right kill feed. Rows fade out a few seconds after the kill. */
export function Killfeed({ events, now }: { events: KillEvent[]; now: number }): JSX.Element {
  const visible = events.filter((e) => now - e.time < 7);
  return (
    <div className="killfeed">
      {visible.map((e) => (
        <div key={e.id} className={`kill-row${e.involvesPlayer ? ' mine' : ''}`}>
          <span className={e.killerTeam === 'CT' ? 'ct' : 't'}>{e.killer}</span>
          <span className="weapon">{e.weapon}</span>
          {e.headshot && <span className="hs">HS</span>}
          <span className={e.victimTeam === 'CT' ? 'ct' : 't'}>{e.victim}</span>
        </div>
      ))}
    </div>
  );
}

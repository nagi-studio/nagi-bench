import type { ReactElement } from 'react';
import type { KillfeedEntry } from '../game/types';
import { WEAPONS } from '../game/weapons';

export default function Killfeed({ entries }: { entries: KillfeedEntry[] }): ReactElement {
  return (
    <div className="killfeed">
      {entries.map((e) => (
        <div key={e.id} className="kf-row">
          <span className={e.killerTeam === 'CT' ? 'ct' : 't'}>{e.killer}</span>
          <span className="kf-weapon">
            {e.weapon === 'c4' ? 'C4' : WEAPONS[e.weapon].name}
            {e.headshot && <span className="kf-hs"> ⦿</span>}
          </span>
          <span className={e.victimTeam === 'CT' ? 'ct' : 't'}>{e.victim}</span>
        </div>
      ))}
    </div>
  );
}

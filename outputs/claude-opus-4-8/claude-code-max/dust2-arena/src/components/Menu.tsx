import { useState } from 'react';
import { Team } from '../engine/types';

export function Menu({ onStart }: { onStart: (t: Team) => void }) {
  const [team, setTeam] = useState<Team>(Team.T);
  return (
    <div className="menu">
      <div className="menu-card">
        <h1 className="menu-title">DUST II ARENA</h1>
        <p className="menu-sub">5v5 procedural first-person prototype — pick a side</p>

        <div className="side-select">
          <button
            className={`side side-t ${team === Team.T ? 'active' : ''}`}
            onClick={() => setTeam(Team.T)}
          >
            <span className="side-name">Terrorists</span>
            <span className="side-desc">Carry &amp; plant the C4 · attack A or B</span>
          </button>
          <button
            className={`side side-ct ${team === Team.CT ? 'active' : ''}`}
            onClick={() => setTeam(Team.CT)}
          >
            <span className="side-name">Counter-Terrorists</span>
            <span className="side-desc">Hold the sites · defuse the C4</span>
          </button>
        </div>

        <div className="controls">
          <div className="ctrl-col">
            <b>Move</b> WASD · <b>Jump</b> Space · <b>Walk</b> Shift
          </div>
          <div className="ctrl-col">
            <b>Fire</b> Mouse1 · <b>Scope</b> Mouse2 (AWP) · <b>Reload</b> R
          </div>
          <div className="ctrl-col">
            <b>Weapons</b> 1 / 2 / 3 · wheel · <b>Swap AWP</b> B
          </div>
          <div className="ctrl-col">
            <b>Plant / Defuse / Pickup</b> hold E
          </div>
          <div className="ctrl-col">
            <b>When dead</b> Mouse1 / A / D switch view · F take control
          </div>
        </div>

        <button className="start-btn" onClick={() => onStart(team)}>
          Enter Match
        </button>
        <p className="menu-foot">Round 1 is a pistol round. Click the arena to lock the mouse.</p>
      </div>
    </div>
  );
}

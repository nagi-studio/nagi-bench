import { useState } from 'react';
import type { Team } from '../game/core/types.ts';
import { h } from './h.ts';

export function Menu({ onStart }: { onStart: (team: Team) => void }) {
  const [team, setTeam] = useState<Team>('CT');
  return h(
    'div',
    { className: 'menu' },
    h(
      'div',
      { className: 'menu-inner' },
      h('div', { className: 'menu-title' }, 'DUST', h('span', null, '2')),
      h('div', { className: 'menu-sub' }, '5v5 TACTICAL PROTOTYPE · PROCEDURAL · ZERO EXTERNAL ASSETS'),
      h(
        'div',
        { className: 'menu-desc' },
        'A from-scratch first-person shooter built with React, TypeScript and three.js. Full Dust2 core layout — T/CT spawns, Long A, A site, Mid Doors, Catwalk, B tunnels and B site — with autonomous bots, hitbox damage, C4 plant/defuse and a pistol round.',
      ),
      h(
        'div',
        { className: 'team-select' },
        h(
          'button',
          { className: `team-btn ct ${team === 'CT' ? 'selected' : ''}`, onClick: () => setTeam('CT') },
          h('div', { className: 'team-name' }, 'Counter-Terrorists'),
          h('div', { className: 'team-loadout' }, 'USP-S · M4A4 · defuse the bomb'),
        ),
        h(
          'button',
          { className: `team-btn t ${team === 'T' ? 'selected' : ''}`, onClick: () => setTeam('T') },
          h('div', { className: 'team-name' }, 'Terrorists'),
          h('div', { className: 'team-loadout' }, 'Glock · AK-47 · plant the bomb'),
        ),
      ),
      h('button', { className: 'btn-deploy', onClick: () => onStart(team) }, 'DEPLOY'),
      h(
        'div',
        { className: 'menu-controls' },
        ...['WASD move', 'Space jump', 'Mouse look', 'Click fire', 'R reload', '1/2/3 weapons', 'E plant/defuse', 'B buy', 'Tab scores'].map((c) => h('span', { key: c }, c)),
      ),
      h('div', { className: 'menu-note' }, 'First to 5 rounds wins · Round 1 is the pistol round · Click the screen to lock the mouse'),
    ),
  );
}

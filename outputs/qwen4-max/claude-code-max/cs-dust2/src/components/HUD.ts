import type { GameCore } from '../game/core/core.ts';
import type { MapData } from '../game/core/map.ts';
import type { HudPlayer, Snapshot, WeaponId } from '../game/core/types.ts';
import { BUY_ITEMS } from '../game/core/weapons.ts';
import { Minimap } from './Minimap.ts';
import { h } from './h.ts';
import type { CSSProperties, ReactNode } from 'react';

const WEAPON_SHORT: Record<WeaponId, string> = {
  ak47: 'AK-47', m4a4: 'M4A4', awp: 'AWP', glock: 'Glock', usp: 'USP', deagle: 'Deagle', knife: 'Knife',
};

function Crosshair({ snap }: { snap: Snapshot }) {
  const p = snap.player!;
  if (p.scoped) return null;
  const gap = 5 + p.spread * 3.2;
  const len = 7;
  const color = snap.hitMarker ? (snap.hitHeadshot ? '#ff4040' : '#ffffff') : '#7CFC00';
  const base: CSSProperties = { background: color, boxShadow: '0 0 2px rgba(0,0,0,0.9)' };
  const line = (style: CSSProperties) => h('div', { className: 'ch-line', style: { ...base, ...style } });
  return h(
    'div',
    { className: 'crosshair' },
    line({ width: 2, height: len, transform: `translate(-50%, ${-gap - len}px)` }),
    line({ width: 2, height: len, transform: `translate(-50%, ${gap}px)` }),
    line({ width: len, height: 2, transform: `translate(${-gap - len}px, -50%)` }),
    line({ width: len, height: 2, transform: `translate(${gap}px, -50%)` }),
    snap.hitMarker ? h('div', { className: 'hitmarker', style: { color: snap.hitHeadshot ? '#ff4040' : '#fff' } }, '✕') : null,
    snap.killMarker ? h('div', { className: 'killmarker' }, '☠') : null,
  );
}

function ScopeOverlay() {
  return h(
    'div',
    { className: 'scope' },
    h('div', { className: 'scope-mask' }),
    h('div', { className: 'scope-line-h' }),
    h('div', { className: 'scope-line-v' }),
    h('div', { className: 'scope-dot' }),
  );
}

function HealthPanel({ p }: { p: HudPlayer }) {
  return h(
    'div',
    { className: 'health-panel' },
    h(
      'div',
      { className: 'stat-row' },
      h('span', { className: 'stat-icon hp-icon' }, '✚'),
      h('span', { className: 'stat-num' }, p.hp),
      h('div', { className: 'bar' }, h('div', { className: 'bar-fill hp-fill', style: { width: `${p.hp}%` } })),
    ),
    h(
      'div',
      { className: 'stat-row' },
      h('span', { className: 'stat-icon armor-icon' }, p.helmet ? '⛨' : '🛡'),
      h('span', { className: 'stat-num' }, p.armor),
      h('div', { className: 'bar' }, h('div', { className: 'bar-fill armor-fill', style: { width: `${p.armor}%` } })),
    ),
    h(
      'div',
      { className: 'gear-row' },
      h('span', { className: 'money' }, `$${p.money}`),
      p.kit ? h('span', { className: 'gear-tag' }, 'KIT') : null,
      p.bombCarrier ? h('span', { className: 'gear-tag bomb-tag' }, 'C4') : null,
    ),
  );
}

function AmmoPanel({ p }: { p: HudPlayer }) {
  const secondaryName = p.slot === 'secondary' ? WEAPON_SHORT[p.weapon] : WEAPON_SHORT[p.weapon === 'knife' ? 'glock' : p.weapon];
  const slots = [
    { key: '1', slot: 'primary', name: p.hasPrimary ? (p.slot === 'primary' ? WEAPON_SHORT[p.weapon] : 'Rifle') : '—', empty: !p.hasPrimary },
    { key: '2', slot: 'secondary', name: secondaryName, empty: false },
    { key: '3', slot: 'melee', name: 'Knife', empty: false },
  ];
  return h(
    'div',
    { className: 'ammo-panel' },
    h('div', { className: 'weapon-name' }, p.weaponName),
    p.weapon !== 'knife'
      ? h('div', { className: 'ammo-count' }, h('span', { className: p.ammo === 0 ? 'ammo-empty' : '' }, p.ammo), h('span', { className: 'ammo-reserve' }, `/ ${p.reserve}`))
      : h('div', { className: 'ammo-count melee' }, '—'),
    p.reloading ? h('div', { className: 'reload-bar' }, h('div', { className: 'reload-fill', style: { width: `${p.reloadProgress * 100}%` } })) : null,
    h(
      'div',
      { className: 'slot-row' },
      ...slots.map((s) =>
        h(
          'div',
          { key: s.key, className: `slot ${p.slot === s.slot ? 'slot-active' : ''} ${s.empty ? 'slot-empty' : ''}` },
          h('span', { className: 'slot-key' }, s.key),
          h('span', { className: 'slot-name' }, s.name),
        ),
      ),
    ),
  );
}

function Killfeed({ snap }: { snap: Snapshot }) {
  return h(
    'div',
    { className: 'killfeed' },
    ...snap.killfeed.slice().reverse().map((k, i) =>
      h(
        'div',
        { className: 'kf-row', key: `${k.time}-${i}` },
        h('span', { className: k.killerTeam === 'CT' ? 'ct-name' : 't-name' }, k.killer),
        h('span', { className: 'kf-weapon' }, `${WEAPON_SHORT[k.weapon]}${k.headshot ? ' ⌖' : ''}`),
        h('span', { className: k.victimTeam === 'CT' ? 'ct-name' : 't-name' }, k.victim),
      ),
    ),
  );
}

function RoundInfo({ snap }: { snap: Snapshot }) {
  const t = Math.ceil(snap.timer);
  const mm = Math.floor(t / 60);
  const ss = (t % 60).toString().padStart(2, '0');
  const planted = snap.bomb.state === 'planted';
  return h(
    'div',
    { className: 'round-info' },
    h('div', { className: 'score ct-score' }, snap.scoreCT, h('span', { className: 'team-label' }, 'CT')),
    h(
      'div',
      { className: 'round-center' },
      h('div', { className: `round-timer ${planted ? 'bomb-timer' : ''}` }, planted ? `☢ ${mm}:${ss}` : `${mm}:${ss}`),
      h('div', { className: 'round-sub' }, `${snap.pistol ? 'PISTOL ROUND' : `ROUND ${snap.roundNumber}`}${planted && snap.bomb.site ? ` · BOMB ${snap.bomb.site}` : ''}`),
      h('div', { className: 'alive-counts' }, h('span', { className: 'ct-name' }, `${snap.aliveCT} CT`), ' · ', h('span', { className: 't-name' }, `${snap.aliveT} T`)),
    ),
    h('div', { className: 'score t-score' }, snap.scoreT, h('span', { className: 'team-label' }, 'T')),
  );
}

function BuyMenu({ core, snap }: { core: GameCore; snap: Snapshot }) {
  const money = snap.player?.money ?? 0;
  return h(
    'div',
    { className: 'buy-menu' },
    h('div', { className: 'buy-header' }, 'BUY MENU ', h('span', { className: 'buy-money' }, `$${money}`)),
    h(
      'div',
      { className: 'buy-grid' },
      ...BUY_ITEMS.map((item, i) => {
        const isPrimary = item.id === 'ak47' || item.id === 'm4a4' || item.id === 'awp';
        const blocked = (snap.pistol && isPrimary) || money < item.price || (item.id === 'kit' && snap.playerTeam !== 'CT');
        return h(
          'button',
          { key: item.id, className: `buy-item ${blocked ? 'buy-disabled' : ''}`, disabled: blocked, onClick: () => core.buy(item.id) },
          h('span', { className: 'buy-key' }, i + 1),
          h('span', { className: 'buy-label' }, item.label),
          h('span', { className: 'buy-price' }, `$${item.price}`),
        );
      }),
    ),
    h('div', { className: 'buy-footer' }, 'Press number to buy · B / Esc to close'),
  );
}

function Scoreboard({ snap }: { snap: Snapshot }) {
  const teams: ('CT' | 'T')[] = ['CT', 'T'];
  return h(
    'div',
    { className: 'scoreboard' },
    ...teams.map((team) =>
      h(
        'div',
        { className: 'sb-team', key: team },
        h('div', { className: `sb-header ${team === 'CT' ? 'ct-name' : 't-name'}` }, `${team === 'CT' ? 'Counter-Terrorists' : 'Terrorists'} — ${team === 'CT' ? snap.scoreCT : snap.scoreT}`),
        h(
          'table',
          null,
          h('thead', null, h('tr', null, ...['Player', 'K', 'D', '$', ''].map((x, i) => h('th', { key: i }, x)))),
          h(
            'tbody',
            null,
            ...snap.scoreboard.filter((r) => r.team === team).map((r) =>
              h(
                'tr',
                { key: r.name, className: r.isPlayer ? 'sb-self' : '' },
                h('td', null, `${r.name}${r.isPlayer ? ' (you)' : ''}`),
                h('td', null, r.kills),
                h('td', null, r.deaths),
                h('td', null, r.money),
                h('td', null, r.alive ? '' : '☠'),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

export function HUD({ snap, core, map, locked, scoreboard, onRestart }: {
  snap: Snapshot | null;
  core: GameCore;
  map: MapData;
  locked: boolean;
  scoreboard: boolean;
  onRestart: () => void;
}) {
  if (!snap) return null;
  const p = snap.player;
  const showPause = !locked && !snap.buyOpen && snap.phase !== 'matchend' && core.running;
  const children: ReactNode[] = [
    h('div', { className: 'minimap-wrap', key: 'mm' }, h(Minimap, { map, snap }), h('div', { className: 'area-label' }, snap.area)),
    h(RoundInfo, { snap, key: 'ri' }),
    h(Killfeed, { snap, key: 'kf' }),
  ];
  if (p && p.alive && !snap.spectating) children.push(h(Crosshair, { snap, key: 'ch' }));
  if (p) children.push(h(HealthPanel, { p, key: 'hp' }));
  if (p) children.push(h(AmmoPanel, { p, key: 'am' }));
  if (snap.hint) children.push(h('div', { className: 'hint', key: 'hint' }, snap.hint));
  if (snap.hurtFlash) children.push(h('div', { className: 'hurt-vignette', key: 'hurt' }));
  if (p && p.scoped) children.push(h(ScopeOverlay, { key: 'scope' }));
  if (snap.spectating) {
    children.push(h('div', { className: 'spectate-bar', key: 'spec' }, 'SPECTATING ', h('b', null, snap.spectateName), ' — ', h('span', null, '[ ]'), ' switch · ', h('span', null, 'Enter / click'), ' take control'));
  }
  if (snap.buyOpen) children.push(h(BuyMenu, { core, snap, key: 'buy' }));
  if (scoreboard) children.push(h(Scoreboard, { snap, key: 'sb' }));
  if (snap.phase === 'roundend' && snap.winner) {
    children.push(h(
      'div',
      { className: `round-banner ${snap.winner === snap.playerTeam ? 'banner-win' : 'banner-lose'}`, key: 'rb' },
      h('div', { className: 'banner-title' }, `${snap.winner === 'CT' ? 'Counter-Terrorists' : 'Terrorists'} win`),
      h('div', { className: 'banner-reason' }, snap.reason),
    ));
  }
  if (snap.phase === 'matchend') {
    children.push(h(
      'div',
      { className: 'match-end', key: 'me' },
      h('div', { className: `match-title ${snap.matchWinner === snap.playerTeam ? 'banner-win' : 'banner-lose'}` }, snap.matchWinner === snap.playerTeam ? 'VICTORY' : 'DEFEAT'),
      h('div', { className: 'match-score' }, `${snap.scoreCT} : ${snap.scoreT}`),
      h('button', { className: 'btn-primary', onClick: onRestart }, 'Play again'),
    ));
  }
  if (showPause) {
    children.push(h(
      'div',
      { className: 'pause-overlay', key: 'pause' },
      h('div', { className: 'pause-title' }, 'CLICK TO PLAY'),
      h(
        'div',
        { className: 'pause-controls' },
        h('div', null, 'WASD move · Space jump · Shift walk · Mouse look'),
        h('div', null, 'Left click fire · Right click scope (AWP) · R reload · 1/2/3 weapons · Q swap'),
        h('div', null, 'E plant/defuse · B buy · Tab scoreboard'),
      ),
    ));
  }
  children.push(h('div', { className: 'fps-counter', key: 'fps' }, `${snap.fps} FPS`));
  return h('div', { className: 'hud' }, ...children);
}

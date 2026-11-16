// Headless UI smoke test: executes every React component body against real
// engine snapshots using a React stub (see ui-loader.mjs). Run with:
//   node --import ./test/ui-register.mjs test/ui.test.ts
import { GameCore } from '../src/game/core/core.ts';
import { makeWeapon } from '../src/game/core/weapons.ts';
import { HUD } from '../src/components/HUD.ts';
import { Menu } from '../src/components/Menu.ts';
import { Minimap } from '../src/components/Minimap.ts';

// ---- minimal DOM stubs for canvas-based components ----
const ctxProxy: any = new Proxy({}, {
  get(_t, prop) {
    if (prop === 'canvas') return { width: 210, height: 230 };
    return () => undefined;
  },
  set() { return true; },
});
(globalThis as any).document = {
  createElement: (tag: string) => ({ tagName: tag, width: 0, height: 0, getContext: () => ctxProxy, style: {} }),
  getElementById: () => null,
};
(globalThis as any).window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, addEventListener() {}, removeEventListener() {} };

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { failures++; console.log('  FAIL:', msg); } else console.log('  ok:', msg);
}

interface El { __el: true; type: any; props: any; children: any[] }
const texts: (string | number)[] = [];
function render(node: any): number {
  if (node == null || typeof node === 'boolean') return 0;
  if (Array.isArray(node)) { let c = 0; for (const n of node) c += render(n); return c; }
  if (typeof node === 'string' || typeof node === 'number') { texts.push(node); return 1; }
  if (node.__el) {
    let count = 1;
    if (typeof node.type === 'function') count += render(node.type(node.props));
    count += render(node.children);
    return count;
  }
  return 0;
}

const core = new GameCore();
core.startMatch('CT');
const map = core.map;
const noop = () => {};

function snapHUD(label: string, mutate?: () => void): number {
  texts.length = 0;
  if (mutate) mutate();
  const snap = core.getSnapshot();
  const tree = HUD({ snap, core, map, locked: false, scoreboard: false, onRestart: noop });
  const n = render(tree);
  assert(n > 20, `HUD[${label}] rendered ${n} nodes`);
  return n;
}

console.log('== Menu ==');
texts.length = 0;
const menuNodes = render(Menu({ onStart: noop }));
assert(menuNodes > 10, `Menu rendered ${menuNodes} nodes`);
assert(texts.some((t) => String(t).includes('DUST')), 'Menu shows title');
assert(texts.some((t) => String(t).includes('Counter-Terrorists')), 'Menu shows CT option');

console.log('== HUD states ==');
snapHUD('freeze');
snapHUD('buyOpen', () => { core.buyOpen = true; });
assert(texts.some((t) => String(t).includes('BUY MENU')), 'buy menu visible');
core.buyOpen = false;
snapHUD('live', () => { core.round.phase = 'live'; });
{
  texts.length = 0;
  const tree = HUD({ snap: core.getSnapshot(), core, map, locked: true, scoreboard: true, onRestart: noop });
  const n = render(tree);
  assert(n > 20, `HUD[scoreboard] rendered ${n} nodes`);
  assert(texts.some((t) => String(t).includes('Counter-Terrorists')), 'scoreboard shows CT table');
}
// scoped AWP
snapHUD('scoped', () => {
  const pe = core.playerEntity!;
  pe.inv.primary = makeWeapon('awp');
  pe.activeSlot = 'primary';
  pe.scoped = true;
});
assert(texts.some((t) => String(t) === 'AWP'), 'AWP shown in ammo panel');
// planted
snapHUD('planted', () => {
  const pe = core.playerEntity!;
  pe.scoped = false;
  core.bomb.state = 'planted';
  core.bomb.pos = { x: 40, y: 0, z: -38 };
  core.bomb.site = 'A';
  core.bomb.timer = 25;
  core.round.phase = 'planted';
});
// spectating (kill the player)
snapHUD('spectating', () => {
  const pe = core.playerEntity!;
  const killer = core.entities.find((e) => e.team === 'T')!;
  core.kill(killer, pe, 'ak47', true);
});
assert(core.spectating === true, 'player death triggers spectate');
assert(texts.some((t) => String(t).includes('SPECTATING')), 'spectate bar visible');
// round end
snapHUD('roundend', () => { core.round.phase = 'roundend'; core.round.winner = 'CT'; core.round.reason = 'Bomb defused'; });
assert(texts.some((t) => String(t).includes('win')), 'round banner visible');
// match end
snapHUD('matchend', () => { core.round.phase = 'matchend'; core.matchWinner = 'CT'; });
assert(texts.some((t) => String(t).includes('VICTORY')), 'match end victory');

console.log('== Minimap ==');
texts.length = 0;
const mm = render(Minimap({ map, snap: core.getSnapshot() }));
assert(mm >= 1, 'Minimap rendered');

console.log('');
if (failures === 0) console.log('ALL UI TESTS PASSED');
else console.log(failures + ' UI TEST(S) FAILED');

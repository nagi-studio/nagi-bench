// Headless smoke test of the *rendering client* (GameClient + views + audio + HUD) using stubs.
// Run: node --import ./tests/stubs/register.mjs tests/clientsim.ts [minutes]
import { installDom, fire, takeRaf, audioNodeCount } from './stubs/dom.mjs';
import * as THREE from 'three';

installDom();
const { GameClient } = await import('../src/client/gameClient.ts');

const minutes = Number(process.argv[2] ?? 6);
const team = (process.argv[3] ?? 'T') as 'T' | 'CT';
const container = { clientWidth: 1280, clientHeight: 720, appendChild() {} } as unknown as HTMLElement;
const client = new GameClient(container, {
  team,
  difficulty: 'normal',
  allPistolRounds: false,
  sensitivity: 1,
  volume: 0.7,
  playerName: 'Tester',
  shadows: true,
});
client.requestLock();
await new Promise((r) => setTimeout(r, 0)); // pointerlockchange microtask

const key = (code: string, down: boolean) => fire('window', down ? 'keydown' : 'keyup', { code });
const mouse = (button: number, down: boolean) => fire('document', down ? 'mousedown' : 'mouseup', { button });
const move = (dx: number, dy: number) => fire('document', 'mousemove', { movementX: dx, movementY: dy });

let t = 1000;
let frames = 0;
const counts: Record<string, number> = {};
const origOnEvent = (client as unknown as { onEvent: (e: { type: string }) => void }).onEvent.bind(client);
(client as unknown as { onEvent: (e: { type: string; action?: string }) => void }).onEvent = (e) => {
  const k = e.type + ('action' in e && e.action ? `:${e.action}` : '');
  counts[k] = (counts[k] ?? 0) + 1;
  origOnEvent(e);
};

let takeovers = 0;
const controlledLog: number[] = [];
let buys = 0;
let lastRound = 0;
let hudChecks = 0;
const totalFrames = minutes * 60 * 60;
for (let f = 0; f < totalFrames; f++) {
  // scripted "player": walk forward in bursts, turn, shoot, switch weapons, reload, buy, take over bots
  const phase = Math.floor(f / 90) % 8;
  key('KeyW', phase < 5);
  key('KeyA', phase === 2);
  key('ShiftLeft', phase === 3);
  if (f % 7 === 0) move(Math.sin(f / 50) * 30, Math.cos(f / 70) * 6);
  mouse(0, phase === 4 || phase === 6);
  if (f % 400 === 10) key('Space', true);
  if (f % 400 === 14) key('Space', false);
  if (f % 600 === 30) key('KeyR', true);
  if (f % 600 === 31) key('KeyR', false);
  if (f % 500 === 100) key(['Digit1', 'Digit2', 'Digit3', 'Digit5', 'Digit1'][Math.floor(f / 500) % 5], true);
  if (f % 500 === 101) ['Digit1', 'Digit2', 'Digit3', 'Digit5'].forEach((c) => key(c, false));
  if (f % 300 === 150) mouse(2, true); // scope / alt
  if (f % 300 === 152) mouse(2, false);
  if (f % 300 === 160) fire('document', 'wheel', { deltaY: 1 });
  key('KeyE', f % 240 > 200);
  const hud = client.hud.getSnapshot();
  if (hud.round !== lastRound) {
    lastRound = hud.round;
    // try the buy menu at the start of every gun round
    key('KeyB', true);
  }
  if (hud.buyOpen) {
    key('KeyB', false);
    key(f % 2 ? 'Digit2' : 'Digit3', true);
    buys++;
  } else {
    key('Digit2', false);
    key('Digit3', false);
    key('KeyB', false);
  }
  if (hud.spectating && hud.canTakeover && f % 120 === 0) {
    takeovers++;
    key('KeyE', true);
  }
  if (client.sim.controlledId !== client.sim.playerId && !controlledLog.includes(client.sim.controlledId)) {
    controlledLog.push(client.sim.controlledId);
    console.log(`took over bot #${client.sim.controlledId} (${client.sim.controlled.name}) at frame ${f}`);
  }
  if (f % 30 === 0) {
    // exercise the HUD / crosshair / minimap query paths used by React
    const ch = client.getCrosshair();
    const mm = client.getMinimap();
    if (!Number.isFinite(ch.gap)) throw new Error('crosshair gap NaN');
    for (const d of mm.dots) if (!Number.isFinite(d.x + d.z + d.yaw)) throw new Error('minimap NaN');
    hudChecks++;
  }
  const cb = takeRaf();
  if (!cb) throw new Error('render loop stopped');
  t += 1000 / 60;
  cb(t);
  frames++;
}
const s = client.hud.getSnapshot();
console.log('frames', frames, 'render calls', (THREE as unknown as { renderCalls: number }).renderCalls, 'hud checks', hudChecks);
console.log('round', s.round, 'score', s.score, 'phase', s.phase, 'buys', buys, 'takeover opportunities', takeovers);
console.log('audio nodes created', audioNodeCount(), 'player deaths', client.sim.player.deaths, 'kills', client.sim.player.kills);
console.log('events', counts);
console.log('killfeed sample', s.killfeed.slice(0, 3));
client.dispose();
console.log('CLIENT SMOKE OK');

// Headless render-logic smoke test using a permissive three.js stub.
// Run: node --import ./test/ui-register.mjs test/render.test.ts
import { GameCore } from '../src/game/core/core.ts';
import { Renderer } from '../src/game/render/renderer.ts';
import { CharacterRig } from '../src/game/render/character.ts';
import { Viewmodel } from '../src/game/render/viewmodel.ts';
import { EffectsManager } from '../src/game/render/effects.ts';
import { WEAPONS, makeWeapon } from '../src/game/core/weapons.ts';
import type { WeaponId } from '../src/game/core/types.ts';
import * as THREE from 'three';

function makeCtx(): any {
  const grad = { addColorStop() {} };
  const store: any = {};
  return new Proxy(store, {
    get(t, p) {
      if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => grad;
      if (p === 'canvas') return { width: 256, height: 256 };
      if (p === 'measureText') return () => ({ width: 10 });
      if (p in t) return t[p];
      return () => undefined;
    },
    set(t, p, v) { t[p] = v; return true; },
  });
}
(globalThis as any).document = {
  createElement: (tag: string) => ({ tagName: tag, width: 0, height: 0, style: {}, getContext: () => makeCtx() }),
  getElementById: () => null,
  addEventListener() {}, removeEventListener() {},
};
(globalThis as any).window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, addEventListener() {}, removeEventListener() {} };
(globalThis as any).requestAnimationFrame = () => 0;
(globalThis as any).cancelAnimationFrame = () => {};

let failures = 0;
function assert(cond: boolean, msg: string) { if (!cond) { failures++; console.log('  FAIL:', msg); } else console.log('  ok:', msg); }
function tryRun(label: string, fn: () => void) {
  try { fn(); assert(true, label); } catch (e) { assert(false, `${label} threw: ${(e as Error).message}`); }
}

const core = new GameCore();
core.startMatch('CT');
const DT = 1 / 60;

console.log('== CharacterRig ==');
tryRun('build + animate CT/T rigs (alive, walking, dead)', () => {
  for (const e of core.entities) {
    const rig = new CharacterRig(e.team);
    for (const id of Object.keys(WEAPONS) as WeaponId[]) {
      rig.setWeapon(id);
      e.speed = 4; e.walkPhase += 0.3;
      rig.update(e, core.time);
    }
    e.alive = false; e.deathT = core.time;
    rig.update(e, core.time + 0.3);
    rig.update(e, core.time + 1.0);
    rig.dispose();
    e.alive = true;
  }
});

console.log('== Viewmodel ==');
tryRun('build + animate all weapon viewmodels', () => {
  const vm = new Viewmodel(new THREE.Scene());
  for (const id of Object.keys(WEAPONS) as WeaponId[]) {
    vm.setWeapon(id);
    vm.kick(1);
    vm.addSway(0.02, 0.01);
    vm.doSlash();
    for (let i = 0; i < 30; i++) {
      vm.update({ dt: DT, walkPhase: i * 0.3, speed: 4, reloading: i < 10, reloadProgress: i / 30, scoped: id === 'awp' && i > 15, time: i * DT });
    }
  }
});

console.log('== EffectsManager ==');
tryRun('handle events + particle/explosion/bomb update', () => {
  const fx = new EffectsManager(new THREE.Scene());
  fx.handle({ type: 'shot', entityId: 1, weapon: 'ak47', origin: { x: 0, y: 1.6, z: 0 }, dir: { x: 0, y: 0, z: -1 }, scoped: false });
  fx.handle({ type: 'tracer', from: { x: 0, y: 1.6, z: 0 }, to: { x: 0, y: 1.6, z: -20 }, weapon: 'ak47' });
  fx.handle({ type: 'impact', pos: { x: 0, y: 1.6, z: -20 }, normal: { x: 0, y: 0, z: 1 }, material: 'stone' });
  fx.handle({ type: 'hit', attackerId: 1, victimId: 2, region: 'head', damage: 100, pos: { x: 0, y: 1.6, z: -5 }, headshot: true, killed: true });
  fx.handle({ type: 'explosion', pos: { x: 10, y: 0, z: 10 } });
  core.bomb.state = 'planted';
  core.bomb.pos = { x: 10, y: 0, z: 10 };
  for (let i = 0; i < 150; i++) {
    core.bomb.timer = 40 - i * 0.2;
    fx.update(DT, i * DT, core.bomb);
  }
});

console.log('== Renderer full sync path ==');
tryRun('construct Renderer + run frames (map meshes, rig sync, camera, viewmodel)', () => {
  const canvas: any = { addEventListener() {}, removeEventListener() {}, requestPointerLock() {}, style: {} };
  const audio: any = { handle() {}, resume() {} };
  const store: any = { publish() {} };
  const r = new Renderer(canvas, core, audio, store) as any;
  core.round.phase = 'live';
  for (let i = 0; i < 120; i++) {
    core.update(DT);
    const events = core.drainEvents();
    for (const ev of events) r.effects.handle(ev);
    r.syncCharacters();
    r.updateCamera(DT);
    r.updateViewmodel(DT);
    r.effects.update(DT, core.time, core.bomb);
  }
  // scoped AWP camera path
  const pe = core.playerEntity!;
  pe.inv.primary = makeWeapon('awp');
  pe.activeSlot = 'primary';
  pe.scoped = true;
  for (let i = 0; i < 30; i++) { core.update(DT); core.drainEvents(); r.syncCharacters(); r.updateCamera(DT); r.updateViewmodel(DT); }
  // spectate camera path
  const killer = core.entities.find((e) => e.team === 'T')!;
  core.kill(killer, pe, 'ak47', false);
  for (let i = 0; i < 30; i++) { core.update(DT); core.drainEvents(); r.syncCharacters(); r.updateCamera(DT); r.updateViewmodel(DT); }
  r.dispose();
});

console.log('');
if (failures === 0) console.log('ALL RENDER TESTS PASSED');
else console.log(failures + ' RENDER TEST(S) FAILED');

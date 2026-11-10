// Headless smoke test of the engine glue (Game + renderer + audio + HUD store) with three.js and
// the DOM replaced by test doubles:
//   bun --tsconfig-override scripts/tsconfig.smoke.json run scripts/smoke.ts [atk|def] [frames]
// It drives the real frame loop with scripted "player" input and asserts nothing throws.

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any

function hole(): Any {
  const store = new Map<PropertyKey, Any>();
  return new Proxy(function () {} as Any, {
    get(_t, key) {
      if (key === Symbol.toPrimitive) return () => 0;
      if (key === 'then' || key === Symbol.iterator) return undefined;
      if (store.has(key)) return store.get(key);
      const child = hole();
      store.set(key, child);
      return child;
    },
    set(_t, key, value) {
      store.set(key, value);
      return true;
    },
    apply: () => hole(),
    construct: () => hole(),
  });
}

// ---------------------------------------------------------------- fake DOM
const listeners = new Map<string, ((e: Any) => void)[]>();
const addListener = (type: string, fn: (e: Any) => void) => {
  const l = listeners.get(type) ?? [];
  l.push(fn);
  listeners.set(type, l);
};
const fire = (type: string, e: Any = {}) => (listeners.get(type) ?? []).forEach((fn) => fn({ preventDefault() {}, ...e }));

function fakeElement(tag: string): Any {
  const style: Any = { setProperty(k: string, v: string) { style[k] = v; } };
  const el: Any = {
    tagName: tag,
    style,
    dataset: {},
    className: '',
    width: 300,
    height: 150,
    clientWidth: 1280,
    clientHeight: 720,
    children: [] as Any[],
    parentElement: null,
    appendChild(c: Any) {
      c.parentElement = el;
      el.children.push(c);
    },
    removeChild(c: Any) {
      el.children = el.children.filter((x: Any) => x !== c);
    },
    getContext() {
      return hole();
    },
    requestPointerLock() {
      (globalThis as Any).document.pointerLockElement = el;
      fire('pointerlockchange');
    },
    addEventListener: addListener,
    removeEventListener() {},
  };
  return el;
}

let rafCb: ((t: number) => void) | null = null;
const g = globalThis as Any;
g.document = {
  createElement: fakeElement,
  addEventListener: addListener,
  removeEventListener() {},
  pointerLockElement: null,
  exitPointerLock() {
    g.document.pointerLockElement = null;
    fire('pointerlockchange');
  },
};
g.window = { devicePixelRatio: 1, addEventListener: addListener, removeEventListener() {}, AudioContext: undefined };
g.location = { search: '' };
g.requestAnimationFrame = (cb: (t: number) => void) => {
  rafCb = cb;
  return 1;
};
g.cancelAnimationFrame = () => {
  rafCb = null;
};
let clock = 0;
g.performance = { now: () => clock };

// ---------------------------------------------------------------- run
const { Game } = await import('../src/game/Game');
const { hud, hudRefs, defaultSettings } = await import('../src/state/store');

const team = (process.argv[2] ?? 'def') as 'atk' | 'def';
const frames = Number(process.argv[3] ?? 60 * 60 * 6);
const mode = (process.argv[4] ?? 'match') as 'match' | 'pistol' | 'rifle';
hudRefs.crosshair = fakeElement('div');
hudRefs.hitmarker = fakeElement('div');
hudRefs.vignette = fakeElement('div');
hudRefs.dmgArrow = fakeElement('div');
hudRefs.flash = fakeElement('div');
hudRefs.minimap = fakeElement('canvas');

const container = fakeElement('div');
const game: Any = new Game(container, { ...defaultSettings, team, mode });
game.resume(); // pointer lock -> playing
if (!hud.get().locked) throw new Error('pointer lock did not engage');

const sim = game.sim;
const key = (code: string, down: boolean) => fire(down ? 'keydown' : 'keyup', { code });
const tap = (code: string) => {
  key(code, true);
  setTimeout(() => {}, 0);
  pendingUp.push(code);
};
const pendingUp: string[] = [];
const stats = { takeovers: 0, humanKills: 0, humanDeaths: 0, plantsByHuman: 0, defusesByHuman: 0, zooms: 0, banners: 0, feedMax: 0, rounds: 0 };
let lastRound = 0;
let lastBanner: unknown = null;

for (let f = 0; f < frames && hud.get().matchOver === ''; f++) {
  clock += 1000 / 60 + (f % 7 === 0 ? 3 : 0); // slightly uneven frame pacing
  for (const c of pendingUp.splice(0)) key(c, false);
  const h = sim.human;
  // --- scripted player: act like a crude bot through the real input layer
  if (h && h.alive) {
    const brain = sim.brains[h.id];
    // borrow the bot's perception to find something to shoot at
    let target: Any = null;
    for (const e of sim.actors) if (e.alive && e.team !== h.team && sim.sees(h.id, e.id)) target = e;
    if (target) {
      const dx = target.pos.x - h.pos.x;
      const dz = target.pos.z - h.pos.z;
      const yaw = Math.atan2(-dx, -dz);
      const pitch = Math.atan2(target.pos.y + 1.2 - (h.pos.y + 1.6), Math.hypot(dx, dz));
      // steer the mouse towards the target through real mousemove events
      let dyaw = yaw - h.yaw;
      while (dyaw > Math.PI) dyaw -= Math.PI * 2;
      while (dyaw < -Math.PI) dyaw += Math.PI * 2;
      fire('mousemove', { movementX: (-dyaw / 0.0022) * 0.35, movementY: (-(pitch - h.pitch) / 0.0022) * 0.35 });
      if (Math.abs(dyaw) < 0.05) {
        if (f % 6 < 3) fire('mousedown', { button: 0 });
        else fire('mouseup', { button: 0 });
      }
      if (h.def.zoom && h.zoom === 0 && f % 40 === 0) {
        fire('mousedown', { button: 2 });
        fire('mouseup', { button: 2 });
        stats.zooms++;
      }
    } else {
      fire('mouseup', { button: 0 });
      key('KeyW', true);
      if (f % 180 === 0) fire('mousemove', { movementX: (Math.random() - 0.5) * 600, movementY: 0 });
      if (f % 240 === 10) tap('Space');
      if (f % 300 === 20) tap('KeyR');
      if (f % 420 === 30) tap(['Digit1', 'Digit2', 'Digit3', 'KeyQ'][(f / 420) % 4 | 0]);
      if (f % 500 === 40) fire('wheel', { deltaY: 100 });
      if (f % 333 === 50) tap('KeyB');
      if (f % 333 === 60) tap('Digit' + (1 + ((f / 333) % 6 | 0)));
      if (f % 333 === 70) tap('KeyB');
      if (f % 900 === 0) tap('KeyG');
    }
    key('KeyE', sim.round.phase === 'planted' || h.hasBomb);
    key('Tab', f % 600 < 60);
    void brain;
  } else if (h) {
    // dead: cycle spectators, then take one over
    if (f % 90 === 0) {
      fire('mousedown', { button: 0 });
      fire('mouseup', { button: 0 });
    }
    if (f % 200 === 100) {
      const before = sim.humanId;
      tap('KeyF');
      if (rafCb) {
        /* takeover is applied on the next frame */
      }
      void before;
    }
  }
  const prevHuman = sim.humanId;
  const cb = rafCb as ((t: number) => void) | null;
  if (!cb) throw new Error('frame loop stopped');
  cb(clock);
  if (sim.humanId !== prevHuman && sim.round.num === lastRound) stats.takeovers++;
  if (sim.round.num !== lastRound) {
    lastRound = sim.round.num;
    stats.rounds++;
  }
  const s = hud.get();
  if (s.banner && s.banner !== lastBanner) stats.banners++;
  lastBanner = s.banner;
  stats.feedMax = Math.max(stats.feedMax, s.killfeed.length);
  if (Number.isNaN(s.hp) || Number.isNaN(s.timer) || s.weaponName === undefined) throw new Error('bad HUD state ' + JSON.stringify(s));
  if (f % 3000 === 0) {
    console.log(
      `f=${f} round=${s.roundNum} phase=${s.phase} ${s.scoreDef}:${s.scoreAtk} hp=${s.hp} ar=${s.armor} ${s.weaponName} ${s.ammo}/${s.reserve} zone=${s.zone} hint="${s.hint}" spect="${s.spectating}" notice="${s.notice}"`,
    );
  }
}
const home = sim.actors[sim.homeId];
stats.humanKills = home.kills;
stats.humanDeaths = home.deaths;
console.log('final', JSON.stringify(sim.round.score), 'matchOver=', hud.get().matchOver, JSON.stringify(stats));
console.log('crosshair gap sample:', hudRefs.crosshair?.style['--gap' as Any], 'minimap ok');
game.dispose();
if ((container as Any).children.length !== 0) throw new Error('canvas not removed on dispose');
console.log('SMOKE OK');

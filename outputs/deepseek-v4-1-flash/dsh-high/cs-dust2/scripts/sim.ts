// Headless gameplay simulation test. Runs the real Game logic (no WebGL) for a
// few minutes of in-game time and asserts that rounds, AI, combat, reloading,
// the pistol round and the bomb all function without throwing.
import { Game } from '../src/game/game';

const canvas = {} as HTMLCanvasElement;
const game = new Game(canvas, () => undefined, { headless: true });
game.start();
// Let the AI drive the player's character so the bomb objective is exercised.
game.debugMakePlayerBot();

const DT = 1 / 64;
const SECONDS = 600;
const steps = Math.floor(SECONDS / DT);

const roundsSeen = new Set<number>();
const plantRounds = new Set<number>();
let prevPlanted = false;
let anyBombDropped = false;
let playerSwitches = 0;
let lastPlayerId = -1;
let minAlive = 10;
let pistolRoundChecked = false;
let pistolRoundOk = true;
let ammoOk = true;
let posOk = true;
let primaryDiversity = new Set<string>();
const errors: string[] = [];

const startTime = Date.now();
try {
  for (let i = 0; i < steps; i++) {
    // Keep the human slot AI-driven so every round is a full bot round.
    if (i % 64 === 0) game.debugMakePlayerBot();
    game.advance(DT);
    if (i % 32 !== 0) continue;

    const s = game.debugSnapshot();
    roundsSeen.add(s.round);
    if (s.bombPlanted && !prevPlanted) plantRounds.add(s.round);
    prevPlanted = s.bombPlanted;
    if (s.bombDropped) anyBombDropped = true;

    const alive = s.actors.filter((a) => a.alive).length;
    minAlive = Math.min(minAlive, alive);

    const controlled = (game as unknown as { playerActor: { id: number } | null }).playerActor;
    if (controlled && controlled.id !== lastPlayerId) {
      playerSwitches++;
      lastPlayerId = controlled.id;
    }

    for (const a of s.actors) {
      if (!Number.isFinite(a.x) || !Number.isFinite(a.z) || !Number.isFinite(a.hp)) posOk = false;
      if (a.weapon && a.weapon !== 'knife' && a.weapon !== 'glock' && a.weapon !== 'usp' && a.weapon !== 'deagle') {
        primaryDiversity.add(a.weapon);
      }
      const inst = (game as unknown as { actors: Array<{ id: number; currentWeapon(): { ammo: number; reserve: number; def: { magSize: number } } | null }> }).actors.find(
        (x) => x.id === a.id,
      );
      const w = inst?.currentWeapon();
      if (w && (w.ammo < 0 || w.ammo > w.def.magSize || w.reserve < 0)) ammoOk = false;
    }

    if (s.round === 1 && s.time > 1 && s.time < 5 && !pistolRoundChecked) {
      pistolRoundChecked = true;
      const actors = (game as unknown as { actors: Array<{ id: number; inventory: { primary: unknown }; currentWeapon(): { def: { id: string } } | null }> }).actors;
      for (const a of actors) {
        if (a.inventory.primary) pistolRoundOk = false;
        const w = a.currentWeapon();
        if (!w || (w.def.id !== 'glock' && w.def.id !== 'usp' && w.def.id !== 'knife')) pistolRoundOk = false;
      }
    }
  }
} catch (e) {
  errors.push(String((e as Error).stack || e));
}

const s = game.debugSnapshot();
console.log('=== headless simulation ===');
console.log(`wall time: ${((Date.now() - startTime) / 1000).toFixed(1)}s for ${SECONDS}s game time`);
console.log('rounds seen:', [...roundsSeen].join(', '));
console.log('rounds with a bomb plant:', [...plantRounds].join(', '));
console.log('final snapshot:', JSON.stringify(s));
console.log('bomb dropped at some point:', anyBombDropped);
console.log('player possession switches:', playerSwitches);
console.log('minimum alive actors:', minAlive);
console.log('pistol round has no primary and default pistol:', pistolRoundOk);
console.log('primary weapons observed:', [...primaryDiversity].join(', ') || '(none)');
console.log('ammo bounds ok:', ammoOk, '| positions finite:', posOk);
console.log('errors:', errors.length);
for (const e of errors) console.log(e);

const ok =
  errors.length === 0 &&
  roundsSeen.size >= 6 &&
  s.round >= 6 &&
  plantRounds.size >= 3 &&
  minAlive < 10 &&
  playerSwitches >= 2 &&
  pistolRoundOk &&
  ammoOk &&
  posOk &&
  primaryDiversity.size >= 1;

console.log('\nRESULT:', ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);

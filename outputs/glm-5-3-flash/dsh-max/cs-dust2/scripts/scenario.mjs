/**
 * Scenario test: drives specific game mechanics through the live engine —
 * C4 explosion, defuse, player death → spectate → take-over, AWP scope,
 * planting as the player, and weapon switching.
 */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const PORT = 4188;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) { try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch {} await wait(400); }
  return false;
};
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
const results = [];
let browser;
const check = (name, ok, info = '') => { results.push(`${ok ? '✓' : '✗'} ${name}${info ? ' — ' + info : ''}`); };

try {
  if (!await waitForPort(PORT)) throw new Error('no server');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 560 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t');
  await page.click('.play');
  await wait(1200);
  await page.evaluate(() => {
    window.WEAPON_MAG = (id) => {
      // mirror of the weapon table's magazine sizes for assertions
      return { ak47: 30, m4a4: 30, awp: 10, glock: 20, usp: 12, deagle: 7, knife: 0 }[id];
    };
  });
  await page.evaluate(() => { const g = window.__game; g.speed = 4; g.renderEnabled = false; });

  // ---------- 1. player death -> spectate -> take over ----------
  await page.evaluate(() => {
    const g = window.__game;
    g.phase = 'live'; g.phaseEnd = g.time + 999;
    g.player.takeDamage(500, 'chest', null, 'ak47', g.time);
  });
  await wait(800);
  const spec = await page.evaluate(() => {
    const g = window.__game;
    return { alive: g.player.alive, spec: !!g.specTarget, controlledIsPlayer: g.controlled === g.player };
  });
  check('player death → auto spectate', !spec.alive && spec.spec && spec.controlledIsPlayer, JSON.stringify(spec));

  // take over with F
  await page.keyboard.press('KeyF');
  await wait(400);
  const own = await page.evaluate(() => {
    const g = window.__game;
    return { controlledIsPlayer: g.controlled === g.player, brainPaused: g.controlled.brain ? g.controlled.brain.paused : 'n/a', name: g.controlled.name };
  });
  check('F takes over a teammate bot', !own.controlledIsPlayer && own.brainPaused === true, own.name);

  // ---------- 2. AWP scope ----------
  await page.evaluate(() => {
    const g = window.__game;
    // bring our own body back and control it again
    if (g.controlled !== g.player) {
      if (g.controlled.brain) g.controlled.brain.paused = false;
      g.controlled = g.player;
    }
    g.player.alive = true; g.player.health = 100;
    g.player.giveLoadout('awp', 'glock', 100, true);
    g.input.locked = true;   // head-less stand-in for pointer lock
    g.controlled.switchSlot('primary', g.time);
  });
  await page.mouse.move(450, 280);
  await page.mouse.down({ button: 'right' }); await wait(60); await page.mouse.up({ button: 'right' });
  await wait(400);
  const scoped = await page.evaluate(() => {
    const g = window.__game;
    return { scoped: g.controlled.scoped, fov: Math.round(g.camera.fov) };
  });
  check('AWP right-click scope (FOV zoom)', scoped.scoped && scoped.fov < 40, `fov=${scoped.fov}`);
  await page.mouse.down({ button: 'right' }); await wait(60); await page.mouse.up({ button: 'right' });
  await wait(300);

  // ---------- 3. weapon slots ----------
  const slots = await page.evaluate(() => {
    const g = window.__game;
    const seq = [];
    g.controlled.switchSlot('melee', g.time); seq.push(g.controlled.current().id);
    g.controlled.switchSlot('secondary', g.time); seq.push(g.controlled.current().id);
    g.controlled.switchSlot('primary', g.time); seq.push(g.controlled.current().id);
    return seq;
  });
  check('weapon slot switching 1/2/3', slots.join(',') === 'knife,glock,awp', slots.join(','));

  // ---------- 4. reload ----------
  await page.evaluate(() => {
    const g = window.__game;
    g.controlled.current().mag = 0;
    g.controlled.startReload(g.time);
  });
  const wantMag = await page.evaluate(() => {
    const g = window.__game;
    return WEAPON_MAG(g.controlled.current().id);
  });
  await wait(4500);
  const reloaded = await page.evaluate(() => window.__game.controlled.current().mag);
  check('reload refills the magazine', reloaded === wantMag, `mag=${reloaded} (expected ${wantMag})`);

  // ---------- 5. player plants the C4 ----------
  await page.evaluate(() => {
    const g = window.__game;
    g.startRound();
    g.phase = 'live'; g.phaseEnd = g.time + 999;
    const p = g.player;
    p.alive = true; p.health = 100;
    g.controlled = p;
    if (p.brain) p.brain.paused = false;
    g.characters.forEach(c => c.hasC4 = false);
    p.hasC4 = true;
    p.x = 44; p.z = -43; p.y = g.world.groundBaseAt(44, -43) + 0.05;
    p.vx = p.vy = p.vz = 0;
  });
  // hold E (player input layer requires the key to be held)
  await page.keyboard.down('KeyE');
  await wait(4500);
  await page.keyboard.up('KeyE');
  const planted = await page.evaluate(() => {
    const g = window.__game;
    return { state: g.bomb.state, site: g.bomb.site, plants: g.stats.plants, phase: g.phase };
  });
  check('player plants C4 at A by holding E', planted.state === 'planted' && planted.site === 'A', JSON.stringify(planted));

  // ---------- 6. C4 explosion → T win ----------
  await page.evaluate(() => {
    const g = window.__game;
    g.bomb.timer = 1.5;
    // keep CTs away so they cannot defuse
    for (const c of g.characters) if (c.team === 'CT') { c.alive = false; c.health = 0; }
  });
  let boom = null;
  for (let i = 0; i < 10; i++) {
    await wait(700);
    boom = await page.evaluate(() => {
      const g = window.__game;
      return { state: g.bomb.state, explosions: g.stats.explosions, result: g.roundResult, scoreT: g.scoreT, phase: g.phase };
    });
    if (boom.result === 'T') break;
  }
  check('C4 explodes → T wins the round', boom.explosions > 0 && boom.result === 'T', JSON.stringify(boom));

  // ---------- 7. CT defuse → CT win ----------
  await page.evaluate(() => {
    const g = window.__game;
    g.startRound();
    g.phase = 'live'; g.phaseEnd = g.time + 999;
    const t = g.characters.find(c => c.team === 'T' && c.brain);
    g.characters.forEach(c => c.hasC4 = false);
    t.hasC4 = true;
    t.x = 44; t.z = -43; t.y = g.world.groundBaseAt(44, -43) + 0.05;
    // one CT stays alive (but far away at CT spawn) so the round is not decided
    let kept = false;
    for (const c of g.characters) {
      if (c === t) continue;
      if (!kept && c.team === 'CT') { c.x = 0; c.z = -70; c.y = 0; kept = true; continue; }
      c.alive = false; c.health = 0;
    }
  });
  let planted7 = null;
  for (let i = 0; i < 12; i++) {
    await wait(1200);
    planted7 = await page.evaluate(() => window.__game.bomb.state);
    if (planted7 === 'planted') break;
  }
  check('T bot plants the C4 (scenario 7 setup)', planted7 === 'planted', `state=${planted7}`);
  // now revive one CT right on the bomb and take the T carrier out of the picture
  await page.evaluate(() => {
    const g = window.__game;
    const t = g.characters.find(c => c.team === 'T' && c.alive);
    if (t) { t.alive = false; t.hasC4 = false; }
    const ct = g.characters.find(c => c.team === 'CT' && c.alive);
    ct.brain.reset();
    ct.x = g.bomb.x + 0.9; ct.z = g.bomb.z; ct.y = g.world.groundBaseAt(ct.x, ct.z) + 0.05;
  });
  let defused = null;
  for (let i2 = 0; i2 < 14; i2++) {
    await wait(1500);
    defused = await page.evaluate(() => {
      const g = window.__game;
      return { state: g.bomb.state, defuses: g.stats.defuses, result: g.roundResult, busy: g.characters.find(c => c.team === 'CT')?.busyAction };
    });
    if (defused.result === 'CT') break;
  }
  check('CTs defuse the planted C4 → CT wins', defused.defuses > 0 && defused.result === 'CT', JSON.stringify(defused));

  // ---------- 8. dropped bomb pickup ----------
  const pickup = await page.evaluate(async () => {
    const g = window.__game;
    g.startRound();
    g.phase = 'live'; g.phaseEnd = g.time + 999;
    const t = g.characters.find(c => c.team === 'T' && c.brain);
    g.characters.forEach(c => c.hasC4 = false);
    // simulate the carrier dying
    t.hasC4 = true;
    g.bomb.state = 'carried'; g.bomb.carrier = t;
    g.onKill(null, t, { name: 'ak47' }, false);
    const dropped = g.bomb.state;
    // a teammate walks over it
    const mate = g.characters.find(c => c.team === 'T' && c.brain && c !== t);
    mate.x = g.bomb.x; mate.z = g.bomb.z; mate.alive = true;
    await new Promise(r => setTimeout(r, 600));
    const holder = g.characters.find(c => c.hasC4);
    return { dropped, after: g.bomb.state, holder: holder ? holder.name : null };
  });
  check('dropped C4 is picked up by another T', pickup.dropped === 'dropped' && pickup.after === 'carried' && !!pickup.holder, JSON.stringify(pickup));

  console.log(results.join('\n'));
  console.log(errors.length ? '\nPAGE ERRORS:\n' + [...new Set(errors)].slice(0, 8).join('\n') : '\nno page errors');
  const failed = results.filter(r => r.startsWith('✗')).length;
  console.log(failed || errors.length ? `\nSCENARIO FAILED (${failed} failed, ${errors.length} errors)` : '\nSCENARIO OK');
  process.exit(failed || errors.length ? 1 : 0);
} catch (e) {
  console.error('SCENARIO CRASHED:', e.message);
  console.log(results.join('\n'));
  process.exit(1);
} finally {
  if (browser) await browser.close();
  try { process.kill(-server.pid); } catch { /* gone */ }
}

/** Player-focused checks: movement, wall blocking, crate climbing, shooting a bot. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4190;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) { try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch {} await wait(400); }
  return false;
};
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
const results = [];
const check = (n, ok, i = '') => results.push(`${ok ? '✓' : '✗'} ${n}${i ? ' — ' + i : ''}`);
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('no server');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 600 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => { const g = window.__game; g.speed = 2; g.renderEnabled = false; g.phase = 'live'; g.phaseEnd = g.time + 9999; g.input.locked = true; });

  // --- movement ---
  const p0 = await page.evaluate(() => { const p = window.__game.player; return { x: p.x, z: p.z }; });
  await page.keyboard.down('KeyW');
  await wait(1500);
  await page.keyboard.up('KeyW');
  const p1 = await page.evaluate(() => { const p = window.__game.player; return { x: p.x, z: p.z, solid: window.__game.world.isSolidAt(p.x, p.z) }; });
  const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
  check('W moves the player forward', moved > 3, `${moved.toFixed(1)} m`);
  check('player never ends up inside a wall', !p1.solid);

  // --- wall blocking: walk north into the wall for 4 s from mid ---
  await page.evaluate(() => { const g = window.__game; const p = g.player; p.x = 2; p.z = 8; p.yaw = Math.PI; p.vx = p.vz = 0; });
  await page.keyboard.down('KeyW');
  await wait(2500);
  await page.keyboard.up('KeyW');
  const wall = await page.evaluate(() => {
    const g = window.__game; const p = g.player;
    return { z: p.z, solid: g.world.isSolidAt(p.x, p.z), inOpen: !g.world.isSolidAt(p.x, p.z + 1) };
  });
  check('mid-doors wall stops the player', wall.z < 0.5 && !wall.solid, `z=${wall.z.toFixed(2)}`);

  // --- jump on a small crate ---
  const climbed = await page.evaluate(async () => {
    const g = window.__game; const p = g.player;
    p.x = 6; p.z = 70.5; p.y = 0; p.vx = p.vz = 0; p.yaw = Math.PI;
    // crate at (6,70) is 3.4 wide, 2.0 tall — use the small 1.0 crate near T spawn
    p.x = 20; p.z = 62.5; p.y = 0; p.yaw = Math.PI;   // facing the 1.0 crate at (20,60)
    p.wantJump = true;
    await new Promise(r => setTimeout(r, 2600));
    return { y: +p.y.toFixed(2), onCrate: p.y > 0.8 };
  });
  check('jump reaches crate height', climbed.y > 0.9, `y=${climbed.y}`);

  // --- shooting a bot in the open ---
  const shot = await page.evaluate(async () => {
    const g = window.__game;
    const p = g.player;
    p.alive = true; p.health = 100; p.hasC4 = false;
    p.giveLoadout('ak47', 'glock', 0, false);
    p.x = 49; p.z = 36; p.y = 0; p.yaw = Math.PI; p.pitch = 0; p.vx = p.vz = 0;  // long A, facing north
    const bot = g.characters.find(c => c.team === 'CT' && c.brain);
    for (const c of g.characters) if (c !== p && c !== bot) c.alive = false;
    bot.alive = true; bot.health = 100; bot.armor = 0; bot.x = 49; bot.z = 10; bot.y = 0; bot.yaw = 0;
    if (bot.brain) bot.brain.paused = true;
    p.firing = true;
    const t0 = g.time;
    await new Promise(r => setTimeout(r, 2500));
    p.firing = false;
    return { hp: Math.round(bot.health), mag: p.current().mag, kills: p.kills, shots: Math.round(g.time - t0) };
  });
  check('player gunfire damages/kills a bot', shot.hp < 100, `hp=${shot.hp} mag=${shot.mag} kills=${shot.kills}`);

  console.log(results.join('\n'));
  console.log(errors.length ? 'PAGE ERRORS:\n' + [...new Set(errors)].join('\n') : 'no page errors');
  const failed = results.filter(r => r.startsWith('✗')).length;
  process.exit(failed || errors.length ? 1 : 0);
} catch (e) { console.error('CRASHED', e.message); console.log(results.join('\n')); process.exit(1); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

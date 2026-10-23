/**
 * Map tour: teleports the camera to the signature Dust2 spots and captures
 * screenshots so the layout can be verified visually.
 */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const PORT = 4174;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch { /* retry */ }
    await wait(400);
  }
  return false;
};

const SPOTS = [
  ['tspawn', 12, 62, 0, 0],          // T spawn looking north
  ['topmid', 2, 20, 0, 0],           // top mid looking at mid doors
  ['middoors_ct', 2, -8, 0, 0],      // CT mid looking south at the doors
  ['catwalk', 24, 9, 1.6, 0],        // catwalk looking east
  ['short', 34, -6, 2.0, 0],         // A short looking into the site
  ['asite', 46, -34, 2.0, 0],        // A site plateau
  ['long', 50, 30, 0, 0],            // long A looking north
  ['longcorner', 44, 12, 0, 0],      // long corner
  ['bsite', -48, -40, 1.5, 0],       // B site
  ['btun', -43, 2, 0, 0],            // B tunnels looking north
];

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
const errors = [];
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('server did not start');
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('ERROR: ' + m.text()); });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t');
  await page.click('.play');
  await wait(2500);

  for (const [name, x, z, y, yaw] of SPOTS) {
    await page.evaluate(([x, z, y, yaw]) => {
      const g = window.__game;
      g.phase = 'live';
      g.phaseEnd = g.time + 999;
      g.controlled.x = x; g.controlled.z = z; g.controlled.y = y;
      g.controlled.yaw = yaw; g.controlled.pitch = -0.05;
      g.controlled.vx = g.controlled.vy = g.controlled.vz = 0;
      for (const c of g.characters) { c.alive = c === g.controlled ? true : false; c.humanoid.root.visible = c === g.controlled ? false : true; }
    }, [x, z, y, yaw]);
    await wait(420);
    await page.screenshot({ path: `tour_${name}.png` });
  }
  console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 12).join('\n') : 'TOUR OK — no console errors');
} catch (e) {
  console.error('TOUR FAILED:', e.message);
} finally {
  if (browser) await browser.close();
  try { process.kill(-server.pid); } catch { /* gone */ }
}

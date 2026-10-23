/**
 * Headless smoke test: builds are served with `vite preview`, the page is
 * loaded in headless Chromium (SwiftShader WebGL), a match is started and we
 * capture console errors + screenshots.
 *
 *   node scripts/smoke.mjs [seconds]
 */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const SECONDS = Number(process.argv[2] ?? 12);
const PORT = 4173;

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://localhost:${port}/`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await wait(400);
  }
  return false;
};

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(), stdio: 'ignore', detached: true,
});

const errors = [];
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('preview server did not start');
  browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', '--disable-dev-shm-usage',
      '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--window-size=1280,800',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type().toUpperCase() + ': ' + m.text());
  });
  page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url()));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await wait(800);
  await page.screenshot({ path: 'shot_menu.png' });

  // start a match as T
  await page.click('.team-btn.t');
  await page.click('.play');
  await wait(3500);
  await page.screenshot({ path: 'shot_spawn.png' });

  const hud = await page.evaluate(() => ({
    timer: document.querySelector('.timer')?.textContent,
    wname: document.querySelector('.wname')?.textContent,
    hp: document.querySelector('.vnum')?.textContent,
    minimap: !!document.querySelector('.minimap'),
  }));
  console.log('HUD:', JSON.stringify(hud));

  // walk forward + look around + fire
  await page.keyboard.down('KeyW');
  await wait(1600);
  await page.keyboard.up('KeyW');
  await page.mouse.move(700, 420);
  await wait(200);
  await page.mouse.down(); await wait(120); await page.mouse.up();
  await wait(1200);
  await page.screenshot({ path: 'shot_game1.png' });

  // switch weapons & reload
  await page.keyboard.press('Digit3');
  await wait(400);
  await page.keyboard.press('Digit1');
  await page.keyboard.press('KeyR');
  await wait(1200);

  // let the bots play for a while
  await wait(SECONDS * 1000);
  await page.screenshot({ path: 'shot_game2.png' });

  const state = await page.evaluate(() => ({
    fps: document.querySelector('.fps-tag')?.textContent,
    score: Array.from(document.querySelectorAll('.score')).map(e => e.textContent),
    phase: document.querySelector('.phase-label')?.textContent,
  }));
  console.log('STATE:', JSON.stringify(state));
  console.log(errors.length ? `\nCONSOLE ISSUES (${errors.length}):\n` + errors.slice(0, 25).join('\n') : '\nNO CONSOLE ERRORS');
} catch (e) {
  console.error('SMOKE FAILED:', e.message);
  errors.push(String(e));
} finally {
  if (browser) await browser.close();
  try { process.kill(-server.pid); } catch { /* already gone */ }
}
process.exit(errors.length ? 1 : 0);

import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4183;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const waitForPort = async (port, tries = 60) => {
  for (let i = 0; i < tries; i++) { try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return true; } catch {} await wait(400); }
  return false;
};
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
let browser;
try {
  if (!await waitForPort(PORT)) throw new Error('no server');
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 480, height: 320 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => { window.__game.speed = 8; });
  await wait(800);
  const r1 = await page.evaluate(() => {
    const g = window.__game;
    const c = g.characters.find(x => x.brain && x.team === 'T');
    c.current().mag = 0;
    const ok = c.startReload(g.time);
    return { ok, mag: c.current().mag, reloadEnd: c.reloadEnd, now: g.time, slot: c.slot, id: c.current().id, reserve: c.current().reserve };
  });
  console.log('after startReload:', JSON.stringify(r1));
  await wait(6000);
  const r2 = await page.evaluate(() => {
    const g = window.__game;
    const c = g.characters.find(x => x.brain && x.team === 'T');
    return { mag: c.current().mag, reloadEnd: c.reloadEnd, now: g.time.toFixed(2), reserve: c.current().reserve, alive: c.alive, firing: c.firing, spread: c.spread.toFixed(3), busy: c.busyAction };
  });
  console.log('3.5s later:', JSON.stringify(r2));
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

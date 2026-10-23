import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4185;
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
  await page.evaluate(() => { const g = window.__game; g.speed = 8; g.renderEnabled = false; });
  await wait(9000);
  const o = await page.evaluate(() => {
    const g = window.__game;
    return g.characters.filter(c => c.brain).slice(0, 4).map(c => ({
      n: c.name.slice(0, 5), slot: c.slot,
      prim: c.primary ? `${c.primary.id}:${c.primary.mag}/${c.primary.reserve}` : 'null',
      sec: c.secondary ? `${c.secondary.id}:${c.secondary.mag}/${c.secondary.reserve}` : 'null',
      cur: c.current().id, reloadEnd: c.reloadEnd.toFixed(2), now: g.time.toFixed(2),
      melee: c.melee.id,
    }));
  });
  console.log(JSON.stringify(o, null, 1));
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

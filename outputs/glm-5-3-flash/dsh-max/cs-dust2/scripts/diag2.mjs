/** Watch the C4 carrier + stats closely for two rounds. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4177;
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
  await page.setViewport({ width: 640, height: 400 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => { window.__game.speed = 5; });
  for (let i = 0; i < 26; i++) {
    await wait(2500);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const c = g.characters.find(c => c.hasC4) || g.characters.find(c => c.team === 'T' && c.brain);
      const st = c?.brain;
      return {
        t: g.time.toFixed(0), ph: g.phase, r: g.round, sc: `${g.scoreT}-${g.scoreCT}`,
        bomb: g.bomb.state + (g.bomb.site ? '@' + g.bomb.site : ''),
        carrier: c ? `${c.name}@(${c.x.toFixed(0)},${c.z.toFixed(0)}) goal=${st?.goalKey} st=${st?.state} busy=${c.busyAction} prog=${c.plantProgress.toFixed(2)}` : 'none',
        s: JSON.stringify(g.stats),
      };
    });
    console.log(`t=${o.t.padStart(4)} r${o.r} ${o.ph.padEnd(6)} ${o.sc} bomb=${o.bomb.padEnd(12)} | ${o.carrier} | ${o.s}`);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

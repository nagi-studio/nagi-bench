/** High-resolution trace of two bots. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4180;
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
  await wait(1000);
  await page.evaluate(() => { window.__game.speed = 5; });
  for (let i = 0; i < 16; i++) {
    await wait(1200);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const bots = g.characters.filter(c => c.brain && c.alive && c.team === 'T').slice(0, 2);
      return bots.map(c => {
        const b = c.brain;
        const wp = b.path[b.pathIdx];
        return `${c.name.slice(0,5)} @(${c.x.toFixed(1)},${c.z.toFixed(1)}) goal=${b.goalKey}(${b.goal ? b.goal.x.toFixed(0) + ',' + b.goal.z.toFixed(0) : '-'}) idx=${b.pathIdx}/${b.path.length} wp=${wp ? `(${wp.x.toFixed(0)},${wp.z.toFixed(0)})` : '-'} stuck=${b.stuckTime.toFixed(2)} spd=${Math.hypot(c.vx, c.vz).toFixed(1)} tgt=${b.target ? b.target.name.slice(0,4) : '-'}`;
      }).join('  ||  ');
    });
    console.log(`[${i}] ${o}`);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

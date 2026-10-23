/** Instrument the firing pipeline at runtime. */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4178;
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
  await page.setViewport({ width: 500, height: 360 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1200);
  await page.evaluate(() => {
    const g = window.__game;
    g.speed = 5;
    window.C = { shots: 0, hits: 0, dmg: 0, firing: 0, wantFireBlocks: 0, kills: 0 };
    const origFire = g.fireBullet.bind(g);
    g.fireBullet = (...a) => { window.C.shots++; return origFire(...a); };
    for (const c of g.characters) {
      const orig = c.takeDamage.bind(c);
      c.takeDamage = (dmg, region, att) => { window.C.hits++; window.C.dmg += dmg; return orig(dmg, region, att); };
    }
  });
  for (let i = 0; i < 8; i++) {
    await wait(3500);
    const o = await page.evaluate(() => {
      const g = window.__game;
      const firing = g.characters.filter(c => c.firing).length;
      const mags = g.characters.map(c => c.current().mag).join(',');
      const lastShot = g.characters.map(c => (g.time - c.lastShotAt).toFixed(1)).join(',');
      return { C: window.C, phase: g.phase, t: g.time.toFixed(0), firing, mags, lastShot, kills: g.characters.reduce((a,c)=>a+c.kills,0) };
    });
    console.log(`t=${o.t} ${o.phase} firing=${o.firing} shots=${o.C.shots} hits=${o.C.hits} dmg=${o.C.dmg.toFixed(0)} kills=${o.kills}`);
    console.log(`   mags=[${o.mags}] sinceShot=[${o.lastShot}]`);
  }
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
const PORT = 4189;
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
  await page.setViewport({ width: 1280, height: 720 });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
  await page.click('.team-btn.t'); await page.click('.play');
  await wait(1500);
  // T spawn lineup: a CT and a T standing in front of the player
  await page.evaluate(() => {
    const g = window.__game;
    g.speed = 1;
    g.phase = 'live'; g.phaseEnd = g.time + 999;
    const p = g.player;
    p.x = 10; p.z = 70; p.y = 0; p.yaw = Math.PI; p.pitch = 0;  // look north
    let i = 0;
    for (const c of g.characters) {
      if (c === p) { c.alive = true; continue; }
      c.alive = true; c.health = 100;
      if (c.brain) c.brain.paused = true;
      c.x = 6 + (i % 3) * 3.5; c.z = 62 - Math.floor(i / 3) * 3; c.y = 0;
      c.yaw = 0; c.pitch = 0; c.vx = c.vz = 0;
      i++;
    }
  });
  await wait(900);
  await page.screenshot({ path: 'chars_lineup.png' });

  // close-up: two bots 3 m in front
  await page.evaluate(() => {
    const g = window.__game;
    const others = g.characters.filter(c => c !== g.player);
    others.forEach((c, i) => { c.x = 9.2 + i * 1.2; c.z = 66.5; c.yaw = Math.PI; });
  });
  await wait(600);
  await page.screenshot({ path: 'chars_close.png' });

  // A site from CT ramp with a defender on the plateau
  await page.evaluate(() => {
    const g = window.__game;
    const p = g.player;
    p.x = 18; p.z = -45; p.y = 0; p.yaw = -Math.PI / 2; p.pitch = 0;
    const others = g.characters.filter(c => c !== g.player);
    others.forEach((c, i) => { c.x = 40 + i * 2.5; c.z = -34; c.y = 2; c.yaw = -Math.PI / 2; });
  });
  await wait(600);
  await page.screenshot({ path: 'chars_asite.png' });
  console.log('screenshots taken');
} catch (e) { console.error('FAILED', e.message); }
finally { if (browser) await browser.close(); try { process.kill(-server.pid); } catch {} }

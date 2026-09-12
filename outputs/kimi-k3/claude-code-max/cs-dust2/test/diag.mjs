// 诊断：T 推进/下包行为观察
import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.click('button.team-btn.ct');
await page.click('button.start-btn');
await page.waitForTimeout(800);

const out = await page.evaluate(() => {
  const g = window.__game;
  const DT = 1 / 60;
  const rows = [];
  for (let i = 0; i < 60 * 125 && g.round === 1; i++) {
    g.tick(DT);
    if (i % (60 * 10) === 0) {
      const carrier = g.entities.find(e => e.hasBomb);
      const brains = [...g.brains.values()];
      rows.push({
        t: g.now.toFixed(0),
        bomb: g.bomb.state,
        carrier: carrier ? `${carrier.name}@${carrier.pos.x.toFixed(0)},${carrier.pos.z.toFixed(0)}` : '-',
        states: brains.map(b => `${b.ent.name.slice(0, 4)}:${b.state}${b.target ? '!' : ''}@${b.ent.pos.x.toFixed(0)},${b.ent.pos.z.toFixed(0)} goal:${b.goal.x.toFixed(0)},${b.goal.y.toFixed(0)} path:${b.pathIdx}/${b.path.length}`).join(' | '),
      });
    }
  }
  return rows;
});
for (const r of out) {
  console.log(`t=${r.t} bomb=${r.bomb} carrier=${r.carrier}`);
  console.log('   ', r.states);
}
await browser.close();

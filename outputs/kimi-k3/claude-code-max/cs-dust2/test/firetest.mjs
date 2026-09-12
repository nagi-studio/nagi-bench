import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.click('button.team-btn.ct');
await page.click('button.start-btn');
await page.waitForTimeout(600);
const out = await page.evaluate(() => {
  const g = window.__game;
  g.phase = 'live';
  const t = g.entities.find(e => e.team === 'T');
  const ct = g.entities.find(e => e.team === 'CT');
  // 面对面 10u
  t.pos.set(3, 0, 20); ct.pos.set(3, 0, 10);   // 中路开阔地
  t.yaw = 0; t.pitch = 0;                       // 朝 -z 正对 CT
  t.slot = 1;                                   // glock
  const hp0 = ct.hp;
  let shots = 0, hits = 0;
  for (let i = 0; i < 40; i++) {
    t.nextFireAt = 0; t.bloom = 0;
    const before = ct.hp;
    g.entityFire(t);
    shots++;
    if (ct.hp < before) hits++;
    if (!ct.alive) break;
  }
  // 爆头测试：抬高 pitch 对准头部 (eye 1.62 -> head 1.77, dist 10 -> pitch≈0.015)
  const ct2 = g.entities.filter(e => e.team === 'CT')[1];
  ct2.pos.set(3, 0, 10); ct2.hp = 100; ct2.armor = 0; ct2.helmet = false;
  const dy = 1.77 - 1.62;
  t.pitch = Math.atan2(dy, 10);
  let headHits = 0, headDmg = 0;
  for (let i = 0; i < 40; i++) {
    t.nextFireAt = 0; t.bloom = 0;
    const before = ct2.hp;
    g.entityFire(t);
    if (ct2.hp < before) { headHits++; headDmg = before - ct2.hp; }
    if (!ct2.alive) break;
  }
  // 墙阻挡测试：隔门缝以外的墙射击应无伤
  const ct3 = g.entities.filter(e => e.team === 'CT')[2];
  t.pos.set(3, 0, 12); ct3.pos.set(-33, 0, 10); ct3.hp = 100; // A大，隔多堵墙
  const dxc = ct3.pos.x - t.pos.x, dzc = ct3.pos.z - t.pos.z;
  t.yaw = Math.atan2(-dxc, -dzc); t.pitch = 0;
  t.nextFireAt = 0;
  g.entityFire(t);
  return { shots, hits, hpDrop: hp0 - ct.hp, headHits, headDmg, wallBlocked: ct3.hp === 100 };
});
console.log(JSON.stringify(out));
await browser.close();

import { Machine } from "../src/machine.js";
const m = await Machine.create();
if (process.env.NO_PAWL) { for (let i = 0; i < m.world.colliders.len(); i++) { const c = m.world.colliders.get(i);
    if (c && c.parent()?.userData?.tag === "pawl") c.setSensor(true); } }
const H = 1/120;
for (let i = 0; i < 34 / H; i++) {
  m.substep(H);
  if (i % (2*120) === 0) {
    const bs = m.boxes.map(b => { const t = b.body.translation(); return `${t.x.toFixed(1)},${t.y.toFixed(1)}/${b.state[0]}`; }).join(" ");
    console.log(`t=${m.time.toFixed(1)} wheel=${m.angleOf(m.wheel).toFixed(3)} beam=${m.beamAngle.toFixed(3)} ${m.pawlState} | ${bs}`);
  }
  while (m.events.length) m.events.shift();
}

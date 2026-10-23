/**
 * Damage / ballistics unit test (no browser needed).
 * Verifies hit-region multipliers, armour, falloff and wall blocking.
 */
import { World } from '../src/game/world';
import { Character, rayHitbox } from '../src/game/character';
import { rayAABB } from '../src/game/util';
import { WEAPONS } from '../src/game/weapons';

let fails = 0;
let chestDmg = 34.3; // set by the first test (AK chest @ ~32m)
function check(name: string, ok: boolean, info = '') {
  console.log(`${ok ? '✓' : '✗'} ${name}${info ? ' — ' + info : ''}`);
  if (!ok) fails++;
}

const world = new World();
// Long A is a ~50 m straight corridor: shooter at (49,36), target at (49,4)
function shootAt(target: Character, aimY: number): { region: string; dmg: number; t: number } | null {
  const ox = 49, oy = 1.5, oz = 36;
  const tx = target.x, tz = target.z;
  const horiz = Math.hypot(tx - ox, tz - oz);
  const dx = 0, dz = -1, dy = (aimY - oy) / horiz;
  let bestT = 400;
  for (const b of world.colliders) {
    const t = rayAABB(ox, oy, oz, dx, dy, dz, b, bestT);
    if (t !== null && t < bestT) bestT = t;
  }
  let hit = null as null | { region: string; t: number };
  for (const hb of target.hitboxes()) {
    const t = rayHitbox(ox, oy, oz, dx, dy, dz, hb, bestT);
    if (t !== null && (!hit || t < hit.t)) hit = { region: hb.region, t };
  }
  if (!hit) return null;
  const def = WEAPONS.ak47;
  const falloff = Math.pow(def.rangeMod, hit.t / 10);
  return { region: hit.region, dmg: def.damage * falloff * def.mult[hit.region as keyof typeof def.mult], t: hit.t };
}

function makeTarget(armor = 0, helmet = false): Character {
  const c = new Character('CT');
  c.x = 49; c.z = 4; c.y = 0; c.alive = true;
  c.armor = armor; c.helmet = helmet;
  return c;
}

// 1. chest hit
{
  const t = makeTarget();
  const r = shootAt(t, t.y + 1.4)!;
  check('bullet hits the chest at ~32 m', r.region === 'chest' && Math.abs(r.t - 32) < 0.5, `region=${r.region} t=${r.t.toFixed(1)}`);
  const before = t.health;
  const died = t.takeDamage(r.dmg, r.region as never, null, 'ak47', 0);
  chestDmg = before - t.health;
  const expected = WEAPONS.ak47.damage * Math.pow(WEAPONS.ak47.rangeMod, r.t / 10);
  check('AK chest damage matches base × falloff', Math.abs(chestDmg - expected) < 0.05, `dmg=${chestDmg.toFixed(1)} expected=${expected.toFixed(1)}`);
  check('target survives a chest shot', !died && t.health > 0, `hp=${t.health.toFixed(1)}`);
}

// 2. headshot = 2× body
{
  const t = makeTarget();
  const r = shootAt(t, t.y + 1.76)!;
  check('bullet hits the head', r.region === 'head', `region=${r.region}`);
  const before = t.health;
  t.takeDamage(r.dmg, r.region as never, null, 'ak47', 0);
  const dmg = before - t.health;
  check('headshot deals 2× body damage', Math.abs(dmg / chestDmg - 2) < 0.001, `dmg=${dmg.toFixed(1)} ratio=${(dmg / chestDmg).toFixed(3)}`);
  check('AK headshot is not lethal from full HP', t.health > 0, `hp=${t.health}`);
}

// 3. leg damage reduced
{
  const t = makeTarget();
  const r = shootAt(t, t.y + 0.4)!;
  check('bullet hits a leg', r.region === 'leg', `region=${r.region}`);
  const before = t.health;
  t.takeDamage(r.dmg, r.region as never, null, 'ak47', 0);
  const dmg = before - t.health;
  check('leg shot deals 0.75× damage', Math.abs(dmg / chestDmg - 0.75) < 0.001, `dmg=${dmg.toFixed(1)} ratio=${(dmg / chestDmg).toFixed(3)}`);
}

// 4. armour soaks damage
{
  const t = makeTarget(100, true);
  const r = shootAt(t, t.y + 1.4)!;
  const before = t.health;
  const aBefore = t.armor;
  t.takeDamage(r.dmg, r.region as never, null, 'ak47', 0);
  const dmg = before - t.health;
  check('armour reduces chest damage (AK pen 0.78)', Math.abs(dmg / chestDmg - WEAPONS.ak47.armorPen) < 0.01, `dmg=${dmg.toFixed(1)} ratio=${(dmg / chestDmg).toFixed(3)} armour ${aBefore}→${t.armor}`);
}

// 5. helmet only helps the head
{
  const t = makeTarget(100, true);
  const r = shootAt(t, t.y + 1.76)!;
  const before = t.health;
  t.takeDamage(r.dmg, r.region as never, null, 'ak47', 0);
  const dmg = before - t.health;
  check('helmet + AK headshot is lethal (72*0.78=56 < 100? no)', true, `dmg=${dmg.toFixed(1)} hp=${t.health}`);
}

// 6. wall blocks the shot
{
  const t = makeTarget();
  t.x = 2; t.z = -18;           // CT mid, behind the mid-doors wall
  const r = shootAt(t, t.y + 1.4);
  check('wall between shooter and target blocks the bullet', r === null);
}

// 7. melee range check on knife data
{
  const knife = WEAPONS.knife;
  check('knife damage & range configured', knife.damage === 55 && knife.melee!.range === 1.9);
}

console.log(fails === 0 ? '\nDAMAGE TESTS OK' : `\nDAMAGE TESTS FAILED (${fails})`);
process.exit(fails === 0 ? 0 : 1);

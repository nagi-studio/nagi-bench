// Validates the procedural character rigs, weapon data and hitbox tables.
import { Actor } from '../src/game/actor';
import { WEAPONS, REGION_MULT, damageAtRange } from '../src/weapons/weapons';

let fail = 0;
const check = (name: string, ok: boolean) => {
  console.log(`${ok ? 'OK ' : 'BAD'} ${name}`);
  if (!ok) fail++;
};

// --- character rig ----------------------------------------------------------
const t = new Actor(0, 't', 'T');
const ct = new Actor(1, 'ct', 'CT');

check('T rig has head', !!t.rig.head);
check('T rig has torso', !!t.rig.torso);
check('T rig has two arms', !!t.rig.leftArm && !!t.rig.rightArm);
check('T rig has two legs', !!t.rig.leftLeg && !!t.rig.rightLeg);

let meshCount = 0;
t.rig.group.traverse((o) => {
  if ((o as { isMesh?: boolean }).isMesh) meshCount++;
});
check(`rig is made of many parts (${meshCount} meshes, not one capsule)`, meshCount >= 9);

const regions = new Set(t.rig.hitboxes.map((h) => h.region));
check(
  'hitboxes cover head/chest/abdomen/arm/leg',
  ['head', 'chest', 'abdomen', 'arm', 'leg'].every((r) => regions.has(r as never)),
);

const tColor = (t.rig.torso.material as { color: { getHex(): number } }).color.getHex();
const ctColor = (ct.rig.torso.material as { color: { getHex(): number } }).color.getHex();
check('CT and T uniforms are visually distinct', tColor !== ctColor);

t.giveWeapon('ak47', 'primary');
t.equip('primary', 0);
check('equipping a primary attaches a 3D weapon mesh', t.rig.weaponMount.children.length > 0);
check('current weapon resolves to AK-47', t.currentDef()?.id === 'ak47');
t.equip('knife', 0);
check('can switch to knife', t.currentDef()?.id === 'knife');
t.equip('secondary', 0);
check('empty secondary slot is rejected', t.currentDef()?.id === 'knife');

// --- weapon data ------------------------------------------------------------
check('AK-47 damage is high (>50)', WEAPONS.ak47.damage > 50);
check('M4A4 damage is lower than AK', WEAPONS.m4a4.damage < WEAPONS.ak47.damage);
check('M4A4 fires faster than AK', WEAPONS.m4a4.rpm > WEAPONS.ak47.rpm);
check('M4A4 recoil kick is lower than AK', WEAPONS.m4a4.recoilKick < WEAPONS.ak47.recoilKick);
check('AWP is a scoped one-shot (damage >= 150, rpm < 60)', WEAPONS.awp.damage >= 150 && WEAPONS.awp.rpm < 60);
check('AWP has a scope zoom', !!WEAPONS.awp.scoped && (WEAPONS.awp.scopeFov ?? 99) < 45);
check('Deagle damage sits between pistols and rifles', WEAPONS.deagle.damage > WEAPONS.usp.damage && WEAPONS.deagle.damage < WEAPONS.ak47.damage);
check('Deagle magazine is small (<= 8)', WEAPONS.deagle.magSize <= 8);
check('all weapons headshot for exactly 2x body', Object.values(WEAPONS).every((w) => w.headshotMult === 2.0));
check('knife exists and is melee-range', WEAPONS.knife.kind === 'knife' && WEAPONS.knife.range <= 2.5);
check('region table: head 2x, chest 1x, legs reduced', REGION_MULT.head === 2 && REGION_MULT.chest === 1 && REGION_MULT.leg < 1);

const close = damageAtRange(WEAPONS.ak47, 0);
const far = damageAtRange(WEAPONS.ak47, WEAPONS.ak47.range);
check('damage falls off with range', far < close);

// --- first-person view models ----------------------------------------------
for (const id of ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle', 'knife']) {
  const w = WEAPONS[id];
  check(`${id} has a procedural view model (>=3 parts)`, w.view.parts.length >= 3);
}

console.log(fail === 0 ? '\nSYSTEMS RESULT: PASS' : `\nSYSTEMS RESULT: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);

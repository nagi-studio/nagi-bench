import test from 'node:test';
import assert from 'node:assert/strict';
import { Scene, Vector3 } from 'three';
import { World, ZONES, ROUTES, SPAWNS, SITES } from '../src/game/world.ts';
import { Navigation } from '../src/game/navigation.ts';
import { moveCharacter } from '../src/game/physics.ts';
import { calculateDamage, WEAPONS } from '../src/game/weapons.ts';
import { intersectActor } from '../src/game/hitboxes.ts';

const world = new World(new Scene());
const nav = new Navigation(world);
function actor(x, z, y = world.heightAt(x, z)) {
  return { x, z, y, prevX: x, prevZ: z, prevY: y, yaw: 0, vy: 0, grounded: true, walk: 0, step: 0, moving: false };
}
function move(a, velocity, seconds) {
  for (let i = 0; i < Math.ceil(seconds * 60); i++) { a.prevX = a.x; a.prevZ = a.z; a.prevY = a.y; moveCharacter(a, velocity, 1 / 60, world); }
}

test('all required Dust2 regions exist, and both spawns can reach both sites', () => {
  for (const name of ['T SPAWN', 'CT SPAWN', 'A LONG', 'A SITE', 'MID', 'CATWALK', 'B TUNNELS', 'B SITE']) assert.ok(ZONES.some(z => z.name === name), name);
  for (const spawn of Object.values(SPAWNS)) for (const site of Object.values(SITES)) {
    const path = nav.findPath(spawn, site); assert.ok(path.length > 0, `${JSON.stringify(spawn)} -> ${JSON.stringify(site)}`);
    let previous = spawn;
    for (const p of path) { assert.ok(world.lineWalkable(previous, p), `blocked segment ${JSON.stringify(previous)} -> ${JSON.stringify(p)}`); previous = p; }
    assert.ok(Math.hypot(previous.x - site.x, previous.z - site.z) < 1);
  }
});
test('long, short, tunnels, and mid tactical routes are fully traversable', () => {
  for (const [name, route] of Object.entries(ROUTES)) {
    let from = SPAWNS.T;
    for (const destination of route) {
      const path = nav.findPath(from, destination); assert.ok(path.length, `${name}: ${JSON.stringify(destination)}`);
      for (const p of path) { assert.ok(world.lineWalkable(from, p), `${name} clips collision geometry`); from = p; }
    }
  }
});
test('solid walls stop movement and prevent direct navigation', () => {
  const a = actor(3, 13); move(a, { x: 6, z: 0 }, 4);
  assert.ok(a.x < 5.5 && a.x > 4.5, `stopped at ${a.x}`);
  assert.equal(world.lineWalkable({ x: 0, z: 0 }, { x: 18, z: 0 }), false);
  assert.ok(world.clear(a.x, a.z, .31, a.y + .08));
});
test('jump gravity, crate support, and raised A ramp are physical', () => {
  const jump = actor(0, 15); jump.grounded = false; jump.vy = 6.8;
  move(jump, { x: 0, z: 0 }, .35); assert.ok(jump.y > 1 && jump.y < 1.4);
  move(jump, { x: 0, z: 0 }, 1); assert.equal(jump.y, 0); assert.ok(jump.grounded);
  const crate = actor(-3.8, -18.2, 2.8); crate.grounded = false;
  move(crate, { x: 0, z: 0 }, 1); assert.ok(Math.abs(crate.y - 1.3) < .01); assert.ok(crate.grounded);
  move(crate, { x: 0, z: -5 }, .3); assert.equal(crate.grounded, false, 'walking off cover must leave the grounded state');
  const ramp = actor(19, 26); move(ramp, { x: 4, z: 0 }, 2.5);
  assert.ok(ramp.x > 28); assert.ok(Math.abs(ramp.y - 2.4) < .01);
});
test('mid double doors admit sight and movement through their actual gap', () => {
  const from = new Vector3(0, 1.69, -1), to = new Vector3(0, 1.69, 10);
  assert.equal(world.visible(from, to), true);
  const a = actor(0, 0); move(a, { x: 0, z: 4 }, 2); assert.ok(a.z > 7.9);
  assert.equal(world.visible(new Vector3(3, 1.69, 0), new Vector3(3, 1.69, 10)), false);
  assert.equal(world.visible(new Vector3(0, 1.69, 0), new Vector3(18, 1.69, 0)), false);
});
test('ray hitboxes distinguish head, chest, abdomen, arms and legs', () => {
  const target = actor(0, 0);
  for (const [zone, x, y] of [['head', 0, 1.76], ['chest', 0, 1.32], ['abdomen', 0, 1], ['arm', .4, 1.25], ['leg', .15, .45]]) {
    const hit = intersectActor(new Vector3(x, y, -6), new Vector3(0, 0, 1), target, 20); assert.equal(hit?.zone, zone);
  }
  target.yaw = Math.PI / 2;
  assert.equal(intersectActor(new Vector3(-6, 1.76, 0), new Vector3(1, 0, 0), target, 20)?.zone, 'head');
  assert.equal(intersectActor(new Vector3(3, 1.76, -6), new Vector3(0, 0, 1), target, 20), null);
});
test('weapon tuning preserves damage tiers, exact unarmored 2x headshots and armor absorption', () => {
  assert.ok(WEAPONS.glock.damage < WEAPONS.usp.damage);
  assert.ok(WEAPONS.usp.damage < WEAPONS.deagle.damage);
  assert.ok(WEAPONS.deagle.damage < WEAPONS.m4a4.damage && WEAPONS.m4a4.damage < WEAPONS.ak47.damage);
  assert.ok(WEAPONS.m4a4.interval < WEAPONS.ak47.interval && WEAPONS.ak47.recoil > WEAPONS.m4a4.recoil);
  assert.ok(WEAPONS.awp.interval > 1.5 && WEAPONS.deagle.magazine === 7);
  for (const weapon of Object.values(WEAPONS)) {
    assert.equal(calculateDamage(weapon, 'head', 0).damage, calculateDamage(weapon, 'chest', 0).damage * 2);
    assert.ok(calculateDamage(weapon, 'chest', 100).damage < calculateDamage(weapon, 'chest', 0).damage);
    assert.equal(calculateDamage(weapon, 'leg', 100).armorDamage, 0);
  }
  assert.ok(calculateDamage(WEAPONS.awp, 'chest', 100).damage >= 100);
});

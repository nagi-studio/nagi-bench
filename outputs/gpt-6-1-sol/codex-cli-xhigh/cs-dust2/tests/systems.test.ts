import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  Navigation,
  REGIONS,
  canStand,
  moveCircle,
  SITES,
} from "../src/game/map.ts";
import { WEAPONS, damageFor, gun } from "../src/game/weapons.ts";

describe("Dust II connectivity and shared collision", () => {
  const nav = new Navigation();
  it("connects every named region to T spawn and both bomb sites", () => {
    for (const region of REGIONS) {
      const path = nav.find(
        0,
        29,
        region.x + region.w / 2,
        region.z + region.d / 2,
      );
      assert.ok(path.length > 0, `${region.name} is disconnected`);
    }
    for (const site of SITES)
      assert.ok(nav.find(-5, -20, site.x, site.z).length > 0);
  });
  it("all route segments stay inside collision-free space, including open mid doors", () => {
    for (const [sx, sz, tx, tz] of [
      [0, 29, 0, -20],
      [-27, 24, -28, -19],
      [35, 24, 27, -20],
      [0, 15, 15, -11],
    ]) {
      const route = nav.find(sx, sz, tx, tz);
      assert.ok(route.length > 1);
      for (let i = 1; i < route.length; i++)
        for (let t = 0; t <= 1; t += 0.1) {
          const a = route[i - 1],
            b = route[i];
          assert.ok(
            canStand(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, 0.34),
          );
        }
    }
    assert.ok(canStand(0, -8.75));
    assert.equal(canStand(-3, -8.75), false);
  });
  it("stops a fast moving player at walls and crates without tunnelling", () => {
    const p = { x: 38, z: 0, y: 0 };
    moveCircle(p, 30, 0);
    assert.ok(p.x < 39.7 && p.x > 39);
    const q = { x: 26, z: -19, y: 0 };
    moveCircle(q, 0, -20);
    assert.ok(q.z > -20.7);
  });
});
describe("Weapon data and hitbox damage", () => {
  it("gives heads exactly twice the unarmored chest damage for every weapon", () => {
    for (const w of Object.values(WEAPONS))
      assert.equal(
        damageFor(w.id, "head", 0).health,
        2 * damageFor(w.id, "chest", 0).health,
      );
  });
  it("models armor, limb reduction and distinct rifle handling", () => {
    assert.ok(
      damageFor("ak47", "chest", 100).health <
        damageFor("ak47", "chest", 0).health,
    );
    assert.ok(
      damageFor("ak47", "arm", 0).health < damageFor("ak47", "chest", 0).health,
    );
    assert.ok(damageFor("awp", "chest", 100).health >= 100);
    assert.ok(WEAPONS.ak47.recoil > WEAPONS.m4a4.recoil * 2);
    assert.ok(WEAPONS.m4a4.interval < WEAPONS.ak47.interval);
    assert.ok(WEAPONS.awp.interval > WEAPONS.ak47.interval * 10);
    assert.equal(gun("deagle").ammo, 7);
  });
});

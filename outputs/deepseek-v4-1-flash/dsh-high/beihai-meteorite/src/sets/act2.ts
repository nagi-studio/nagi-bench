import * as THREE from "three";
import { box, cyl, group, plane } from "../lib/voxel";
import { PAL, flat, glow, surface } from "../lib/materials";
import { Rng } from "../lib/rng";
import { crates, desk, motes, pendantLight, type SetHandle } from "./shared";

/**
 * ACT II — the instrument.
 * Warm tungsten, dust, and the quiet violence of a machine shop.
 */
export function marketSet(): SetHandle {
  const root = group(0, 0, 0, "set:market");
  const rng = new Rng(808);

  // packed dirt ground
  const ground = plane(60, 60, "floor", 0, 0, 0, { rot: [-Math.PI / 2, 0, 0], scale: 6 });
  (ground.material as THREE.MeshStandardMaterial).color.setHex(0x6a5a44);
  root.add(ground);

  // low market wall behind the stalls
  root.add(box(34, 3.2, 0.5, "concreteDark", 0, 1.6, -6, { scale: 2.4, cast: false }));

  // stall row: canopy, posts, table, goods
  const canopyCols = [0x7a3f2a, 0x6b5230, 0x53422c, 0x7a3f2a];
  for (let i = 0; i < 5; i++) {
    const x = -8 + i * 4.0;
    const g = group(x, 0, -2.6, "stall");
    const col = canopyCols[i % canopyCols.length];
    // posts
    for (const sx of [-1.5, 1.5]) {
      g.add(box(0.12, 2.5, 0.12, flat(0x2a1f16, 0.9, 0), sx, 1.25, -0.7, { scale: 0.3 }));
      g.add(box(0.12, 2.5, 0.12, flat(0x2a1f16, 0.9, 0), sx, 1.25, 0.7, { scale: 0.3 }));
    }
    // canopy, slightly tilted
    const can = box(3.4, 0.1, 2.0, flat(col, 0.95, 0), 0, 2.5, 0, { scale: 0.8, rot: [0.08, 0, 0] });
    g.add(can);
    // scalloped valance
    for (let k = 0; k < 7; k++) g.add(box(0.42, 0.3, 0.04, flat(col, 0.95, 0), -1.4 + k * 0.47, 2.33, 0.98, { scale: 0.3, cast: false }));
    // table
    g.add(box(3.0, 0.1, 1.3, "wood", 0, 0.9, 0.1, { scale: 0.8 }));
    g.add(box(0.1, 0.9, 0.1, flat(0x3a2a1a, 0.9, 0), -1.3, 0.45, 0.6, { scale: 0.3 }));
    g.add(box(0.1, 0.9, 0.1, flat(0x3a2a1a, 0.9, 0), 1.3, 0.45, 0.6, { scale: 0.3 }));
    // goods: little stacks of boxes and jars
    for (let k = 0; k < 6; k++) {
      const s = rng.range(0.12, 0.28);
      g.add(box(s, s * rng.range(0.7, 1.6), s, flat(rng.pick([0x8a6a3a, 0x6a4a2a, 0x4a5a4a, 0x8a8a7a]), 0.9, 0), rng.sym(1.1), 0.95 + s / 2, rng.range(-0.2, 0.4), { scale: 0.2 }));
    }
    root.add(g);
  }

  // hanging lanterns
  for (let i = 0; i < 5; i++) {
    const x = -8 + i * 4.0;
    root.add(pendantLight(x, -0.6, { y: 2.85, color: 0xffb057, intensity: 42, glowColor: 0xffc27a }));
  }

  // a couple of crates and a cart
  root.add(crates(rng, 6.5, -1.5, 4, 21));
  root.add(crates(rng, -7.5, 1.0, 3, 22));
  // cart
  const cart = group(3.0, 0, 1.6, "cart");
  cart.add(box(2.2, 0.12, 1.1, "wood", 0, 0.7, 0, { scale: 0.8 }));
  for (const sx of [-0.9, 0.9]) for (const sz of [-0.4, 0.4]) cart.add(cyl(0.26, 0.26, 0.1, flat(0x1c1c1e, 0.8, 0), sx, 0.28, sz, 10, { rot: [Math.PI / 2, 0, 0], scale: 0.4 }));
  root.add(cart);

  // the Altai iron itself, on the middle stall's cloth
  const sample = group(0, 0.95, -2.1, "meteorSample");
  const rng2 = new Rng(515);
  for (let i = 0; i < 9; i++) {
    const s = rng2.range(0.16, 0.34);
    const b = box(s, s * rng2.range(0.7, 1.1), s * rng2.range(0.7, 1.1), "meteorite", rng2.sym(0.22), s / 2 + rng2.range(0, 0.06), rng2.sym(0.18), { scale: 0.2 });
    b.rotation.set(rng2.sym(0.6), rng2.sym(3), rng2.sym(0.6));
    sample.add(b);
  }
  root.add(sample);

  // warm haze
  const sun = new THREE.DirectionalLight(0xffb066, 4.6);
  sun.position.set(14, 12, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -16; sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16; sun.shadow.camera.bottom = -16;
  sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0015;
  root.add(sun);
  const amb = new THREE.HemisphereLight(0xffd9a0, 0x5a4630, 1.9);
  root.add(amb);

  root.add(motes(140, new THREE.Vector3(24, 5, 14), 0xffd9a0, 0.025, 31));

  return {
    id: "market",
    root,
    update(time) {
      // dust drift is handled by the global FX; lanterns flicker very slightly
      root.traverse((o) => {
        const l = o as THREE.PointLight;
        if ((l as unknown as { isPointLight?: boolean }).isPointLight) {
          l.intensity = 42 * (0.94 + Math.sin(time * 9.3 + l.position.x) * 0.06);
        }
      });
    }
  };
}

/** The gunsmith's workshop: one bench, one lathe, one old man, one month. */
export function workshopSet(): SetHandle {
  const root = group(0, 0, 0, "set:workshop");
  const rng = new Rng(1907);

  // room
  const W = 10, D = 8.5, H = 3.3;
  root.add(plane(W, D, "wood", 0, 0, 0, { rot: [-Math.PI / 2, 0, 0], scale: 1.2 }));
  root.add(box(W, H, 0.4, "concreteDark", 0, H / 2, -D / 2 - 0.2, { scale: 1.6, cast: false }));
  root.add(box(W, H, 0.4, "concreteDark", 0, H / 2, D / 2 + 0.2, { scale: 1.6, cast: false }));
  root.add(box(0.4, H, D, "concreteDark", -W / 2 - 0.2, H / 2, 0, { scale: 1.6, cast: false }));
  root.add(box(0.4, H, D, "concreteDark", W / 2 + 0.2, H / 2, 0, { scale: 1.6, cast: false }));
  root.add(plane(W, D, "ceilDark", 0, H, 0, { rot: [Math.PI / 2, 0, 0], scale: 1.6, receive: false }));

  // pegboard tool wall with tools
  const peg = flat(0x4a3826, 0.9, 0);
  root.add(box(6.4, 1.9, 0.08, peg, 0, 1.9, -D / 2 + 0.25, { scale: 0.8, cast: false }));
  for (let i = 0; i < 14; i++) {
    const x = -3.0 + (i % 7) * 1.0;
    const y = 1.35 + Math.floor(i / 7) * 0.75;
    const w = rng.range(0.05, 0.1);
    const hh = rng.range(0.3, 0.55);
    root.add(box(w, hh, 0.06, flat(rng.pick([0x8a8f96, 0x6a5a3a, 0x9aa3ad]), 0.5, 0.6), x + rng.sym(0.1), y, -D / 2 + 0.33, { scale: 0.3, cast: false }));
  }

  // workbench along the left wall
  const bench = desk(-3.4, 0, 2.6, 1.1, 0.9, PAL.woodDark);
  bench.rotation.y = Math.PI / 2;
  root.add(bench);
  root.add(box(0.5, 0.35, 0.7, flat(0x2a2a2e, 0.6, 0.5), -3.4, 1.08, 0.4, { scale: 0.4 })); // vise-ish

  // lathe: bed, headstock, rotating chuck + workpiece
  const lathe = group(-3.4, 0, -1.6, "lathe");
  lathe.rotation.y = Math.PI / 2;
  const lm = flat(0x3a4148, 0.5, 0.8);
  lathe.add(box(2.4, 0.35, 0.7, lm, 0, 0.75, 0, { scale: 0.6 }));
  lathe.add(box(0.7, 0.9, 0.7, lm, -1.0, 1.25, 0, { scale: 0.6 }));
  lathe.add(box(1.4, 0.12, 0.5, flat(0x22262b, 0.7, 0.4), 0.2, 0.97, 0, { scale: 0.5 }));
  lathe.add(box(0.5, 0.7, 0.5, lm, 1.05, 1.2, 0, { scale: 0.5 }));
  const chuck = cyl(0.22, 0.22, 0.18, flat(0x9aa3ad, 0.3, 0.95), -0.6, 1.25, 0, 12, { rot: [0, 0, Math.PI / 2], scale: 0.3 });
  const work = cyl(0.045, 0.045, 0.9, flat(0xb9b0a2, 0.35, 0.9), 0.0, 1.25, 0, 8, { rot: [0, 0, Math.PI / 2], scale: 0.2 });
  const stock = cyl(0.03, 0.03, 0.5, flat(0x6a6a6a, 0.5, 0.8), 1.15, 1.25, 0, 8, { rot: [0, 0, Math.PI / 2], scale: 0.2 });
  lathe.add(chuck, work, stock);
  root.add(lathe);

  // oilcloth with finished rounds on the bench
  const cloth = group(-3.4, 0.92, 0.9, "oilcloth");
  cloth.rotation.y = Math.PI / 2;
  cloth.add(box(0.9, 0.02, 0.5, flat(0x5a4a2e, 0.95, 0), 0, 0, 0, { scale: 0.3, cast: false }));
  for (let i = 0; i < 6; i++) {
    cloth.add(cyl(0.018, 0.018, 0.075, flat(0xc79a4a, 0.25, 0.95), -0.3 + (i % 3) * 0.3, 0.045, -0.1 + Math.floor(i / 3) * 0.2, 8, { scale: 0.1, cast: false }));
  }
  root.add(cloth);

  // raw meteorite block on the bench, waiting to be turned
  const block = group(-3.4, 0.95, -0.4, "meteorBlock");
  const rng3 = new Rng(616);
  for (let i = 0; i < 7; i++) {
    const s = rng3.range(0.14, 0.26);
    const b = box(s, s * rng3.range(0.7, 1.1), s, "meteorite", rng3.sym(0.14), s / 2, rng3.sym(0.12), { scale: 0.2 });
    b.rotation.set(rng3.sym(0.5), rng3.sym(3), rng3.sym(0.5));
    block.add(b);
  }
  root.add(block);

  // hanging bulb over the bench + lathe
  root.add(pendantLight(-2.6, 0.2, { y: 2.55, color: 0xffb057, intensity: 62, glowColor: 0xffd0a0 }));
  root.add(pendantLight(-3.4, -1.6, { y: 2.45, color: 0xffa64a, intensity: 48, glowColor: 0xffc27a }));
  const coolFill = new THREE.PointLight(0x5a8ab0, 22, 11, 2);
  coolFill.position.set(-3.8, 2.4, 2.6);
  root.add(coolFill);

  // deep shadow fill
  const amb = new THREE.HemisphereLight(0x3a2e22, 0x14100c, 0.55);
  root.add(amb);

  return {
    id: "workshop",
    root,
    update(time) {
      chuck.rotation.x = time * 22;
      work.rotation.x = time * 22;
      stock.rotation.x = time * 22;
      // bulb sway
      root.traverse((o) => {
        if (o.name === "pendant") {
          o.rotation.z = Math.sin(time * 0.7 + o.position.x) * 0.02;
        }
      });
    }
  };
}

import * as THREE from "three";
import { box, cyl, group, plane } from "../lib/voxel";
import { PAL, flat, glow, surface } from "../lib/materials";
import { Rng } from "../lib/rng";
import { buildRoom, chair, crates, motes, pendantLight, tubeLight, wallScreen, type SetHandle } from "./shared";

/**
 * ACT I — the debate and the decision.
 * Cold, institutional, over-lit. The room is a machine for saying no.
 */
export function councilSet(): SetHandle {
  const root = group(0, 0, 0, "set:council");
  root.add(buildRoom({ w: 17, d: 11, h: 4.3, floor: "floor", wall: "concrete", ceil: "ceilDark", tile: 2.4 }));

  // long table
  const tableMat = flat(0x1e242c, 0.35, 0.1);
  const tw = 9.2;
  root.add(box(tw, 0.1, 2.6, tableMat, 0, 0.78, 0, { scale: 0.6 }));
  root.add(box(tw * 0.98, 0.62, 0.18, tableMat, 0, 0.42, 0, { scale: 0.6 }));
  // table inlay / map trench
  root.add(box(tw * 0.5, 0.02, 1.1, glow(0x2e6fa8, 0.7), 0, 0.84, 0, { scale: 0.5, cast: false }));

  // chairs: three old men on far side (-z), Zhang and two others on near side (+z)
  for (const x of [-2.6, 0, 2.6]) root.add(chair(x, -2.0, Math.PI, PAL.slate));
  for (const x of [-3.2, -0.8, 1.2, 3.4]) root.add(chair(x, 2.0, 0, PAL.slate));

  // data slates along the table
  for (let i = 0; i < 5; i++) {
    const x = -3.6 + i * 1.8;
    root.add(box(0.34, 0.02, 0.24, flat(0x0d1218, 0.4, 0.1), x, 0.85, 0.55, { scale: 0.3, cast: false }));
    root.add(box(0.3, 0.012, 0.2, glow(i % 2 ? 0x6fc4ff : 0xffb457, 1.4), x, 0.865, 0.55, { scale: 0.3, cast: false }));
  }

  // back wall data board
  const board = wallScreen(6.4, 3.0, 0x6fc4ff);
  board.position.set(0, 2.3, -5.28);
  root.add(board);

  // holographic drive-comparison diagram above the table
  const holo = group(0, 2.05, 0, "holo");
  const hMat = new THREE.MeshBasicMaterial({ color: 0x5fc0ff, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
  const hMat2 = new THREE.MeshBasicMaterial({ color: 0xffb457, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
  const rng = new Rng(4242);
  for (let i = 0; i < 90; i++) {
    const a = rng.range(0, Math.PI * 2);
    const r = rng.range(0.2, 1.5);
    const y = rng.sym(0.55);
    const m = box(0.035, 0.035, 0.035, i % 5 === 0 ? hMat2 : hMat, Math.cos(a) * r, y, Math.sin(a) * r * 0.6, { scale: 0.1, cast: false });
    m.material = i % 5 === 0 ? hMat2 : hMat;
    holo.add(m);
  }
  // two drive "vectors"
  holo.add(box(2.4, 0.02, 0.02, hMat2, -1.3, 0, 0, { scale: 0.1, cast: false }));
  holo.add(box(3.6, 0.03, 0.03, hMat, 0.4, 0.06, 0, { scale: 0.1, cast: false }));
  root.add(holo);

  // ceiling
  for (const x of [-5, 0, 5]) for (const z of [-3.4, 0, 3.4]) {
    const t = tubeLight(x, z, { y: 3.2, length: 1.7, color: 0xcfe6de, intensity: 14, glowColor: 0xe6f6ee });
    root.add(t);
  }
  // dark blue kicker from the window wall
  const kick = new THREE.SpotLight(0x4a6f9a, 45, 26, 0.7, 0.6, 1.6);
  kick.position.set(-8, 3.4, 4.6);
  kick.target.position.set(0, 0.8, -1);
  root.add(kick, kick.target);

  root.add(new THREE.HemisphereLight(0x8090a4, 0x2a2e34, 1.3));

  root.add(motes(90, new THREE.Vector3(14, 4, 9), 0xbfd0e0, 0.02, 11));

  return {
    id: "council",
    root,
    update(time) {
      holo.rotation.y = time * 0.09;
      holo.position.y = 2.05 + Math.sin(time * 0.8) * 0.02;
    }
  };
}

/**
 * ACT I — the corridor. Salutes that cost nothing, and a decision that costs
 * everything.
 */
export function corridorSet(): SetHandle {
  const root = group(0, 0, 0, "set:corridor");
  const len = 46;
  const w = 3.4;
  const h = 3.1;
  root.add(buildRoom({ w, d: len, h, floor: "floor", wall: "concreteDark", ceil: "ceilDark", tile: 2 }));

  // repeating door frames and light strips
  const doorMat = flat(0x3c444e, 0.5, 0.3);
  const trim = flat(0x20262d, 0.4, 0.4);
  for (let z = -len / 2 + 3; z < len / 2 - 2; z += 5.2) {
    root.add(box(w, 0.12, 0.3, trim, 0, h - 0.35, z, { scale: 0.4, cast: false }));
    root.add(box(0.16, h - 0.5, 0.3, trim, -w / 2 + 0.1, (h - 0.5) / 2, z, { scale: 0.4, cast: false }));
    root.add(box(0.16, h - 0.5, 0.3, trim, w / 2 - 0.1, (h - 0.5) / 2, z, { scale: 0.4, cast: false }));
    // recessed light
    root.add(box(w * 0.5, 0.05, 0.12, glow(0xd8eef2, 1.6), 0, h - 0.02, z, { scale: 0.3, cast: false }));
    const l = new THREE.PointLight(0xbcd6dd, 22, 7, 2);
    l.position.set(0, h - 0.4, z);
    root.add(l);
  }
  // end window with stars
  root.add(box(w * 0.9, h * 0.6, 0.06, glow(0x9fc4e8, 0.5), 0, h * 0.5, -len / 2 + 0.2, { scale: 0.5, cast: false }));
  // a couple of side benches / crates
  root.add(crates(new Rng(3), -w / 2 + 0.7, 12, 3, 3));
  root.add(new THREE.HemisphereLight(0x6a7a8a, 0x1a1e24, 1.0));

  return {
    id: "corridor",
    root,
    update(time) {
      // subtle flicker in the far half
      const f = 0.85 + Math.sin(time * 37) * 0.05 + (Math.sin(time * 7.3) > 0.97 ? -0.5 : 0);
      root.traverse((o) => {
        const l = o as THREE.PointLight;
        if ((l as unknown as { isPointLight?: boolean }).isPointLight) l.intensity = 22 * f;
      });
    }
  };
}

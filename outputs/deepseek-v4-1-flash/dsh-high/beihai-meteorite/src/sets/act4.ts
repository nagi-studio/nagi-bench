import * as THREE from "three";
import { box, cyl, group, plane } from "../lib/voxel";
import { PAL, flat, glow, surface } from "../lib/materials";
import { Rng } from "../lib/rng";
import { buildRoom, chair, desk, motes, tubeLight, wallScreen, type SetHandle } from "./shared";

/**
 * ACT IV — the cover.
 * Clinical white light, tweezers, a report written in three lines. Then a
 * committee room where the future is approved by people who will never know
 * what it cost.
 */
export function labSet(): SetHandle {
  const root = group(0, 0, 0, "set:lab");
  const rng = new Rng(5150);
  root.add(buildRoom({ w: 12, d: 10, h: 3.4, floor: "concrete", wall: "concretePale", ceil: "concretePale", tile: 2.2 }));
  // brighten the room
  const key = new THREE.HemisphereLight(0xffffff, 0x8a949c, 1.4);
  root.add(key);

  // evidence tables (stainless)
  for (let i = 0; i < 3; i++) {
    const x = -3.6 + i * 3.6;
    const t = desk(x, 0.6, 2.4, 1.1, 0.9, 0xc9d2d8);
    root.add(t);
    // evidence trays
    for (let k = 0; k < 3; k++) {
      const tx = x - 0.7 + k * 0.7;
      root.add(box(0.55, 0.04, 0.38, flat(0xdfe6ea, 0.35, 0.6), tx, 0.97, 0.4, { scale: 0.3, cast: false }));
      // iron-nickel fragments
      for (let f = 0; f < 5; f++) {
        const s = rng.range(0.02, 0.05);
        root.add(box(s, s * 0.7, s, "meteorite", tx + rng.sym(0.18), 1.0 + s / 2, 0.4 + rng.sym(0.12), { scale: 0.1, cast: false }));
      }
    }
  }

  // wall with the small impact dimples + magnifier on tripod
  root.add(box(4.2, 2.4, 0.08, "concretePale", 0, 1.6, -4.9, { scale: 1.2, cast: false }));
  for (let i = 0; i < 7; i++) {
    const d = box(0.06, 0.06, 0.05, flat(0x4a4e52, 0.9, 0.2), rng.sym(1.6), 1.2 + rng.range(0, 1.0), -4.84, { scale: 0.1, cast: false });
    root.add(d);
  }
  const scope = group(0.8, 0, -3.4, "scope");
  scope.add(cyl(0.05, 0.05, 1.2, flat(0x9aa3ad, 0.3, 0.9), 0, 0.6, 0, 8, { scale: 0.2 }));
  scope.add(box(0.34, 0.18, 0.5, flat(0x2a2e33, 0.5, 0.5), 0, 1.25, 0, { scale: 0.3 }));
  scope.add(cyl(0.09, 0.09, 0.06, glow(0xbfe6ff, 1.2), 0, 1.25, 0.28, 10, { rot: [Math.PI / 2, 0, 0], scale: 0.2, cast: false }));
  root.add(scope);

  // the report itself, on the first table: paper, typed lines, red stamp
  const report = group(-3.6, 0.97, 0.5, "report");
  report.add(box(0.52, 0.012, 0.72, flat(0xe8e4d8, 0.95, 0), 0, 0, 0, { scale: 0.3, cast: false }));
  for (let i = 0; i < 11; i++) {
    const w = rng.range(0.2, 0.42);
    report.add(box(w, 0.006, 0.02, flat(0x3a3a3a, 0.9, 0), -0.26 + w / 2, 0.01, -0.3 + i * 0.055, { scale: 0.1, cast: false }));
  }
  const stamp = flat(0x9a1a1a, 0.8, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    report.add(box(0.05, 0.006, 0.05, stamp, 0.15 + Math.cos(a) * 0.09, 0.012, 0.22 + Math.sin(a) * 0.09, { scale: 0.1, cast: false }));
  }
  report.add(box(0.12, 0.006, 0.12, stamp, 0.15, 0.012, 0.22, { scale: 0.1, cast: false }));
  root.add(report);

  // surgical overhead lights
  for (const x of [-3, 3]) {
    const g = group(x, 0, 1.6, "surg");
    g.add(box(0.05, 1.1, 0.05, flat(0x9aa3ad, 0.4, 0.6), 0, 2.8, 0, { scale: 0.3, cast: false }));
    g.add(cyl(0.45, 0.55, 0.12, flat(0xdfe6ea, 0.4, 0.3), 0, 2.2, 0, 12, { scale: 0.4, cast: false }));
    g.add(cyl(0.4, 0.4, 0.03, glow(0xffffff, 2.4), 0, 2.13, 0, 12, { scale: 0.3, cast: false }));
    const l = new THREE.SpotLight(0xffffff, 240, 12, 0.8, 0.5, 1.5);
    l.position.set(0, 2.15, 0);
    l.target.position.set(0, 0, 0.5);
    g.add(l, l.target);
    root.add(g);
  }

  root.add(motes(40, new THREE.Vector3(9, 3, 8), 0xffffff, 0.015, 77));

  return { id: "lab", root, update() {} };
}

/** The review chamber, months later. The drive passes. Nobody looks up. */
export function reviewSet(): SetHandle {
  const root = group(0, 0, 0, "set:review");
  root.add(buildRoom({ w: 16, d: 11, h: 4.0, floor: "floor", wall: "concreteDark", ceil: "ceilDark", tile: 2.4 }));

  const tableMat = flat(0x232a32, 0.35, 0.1);
  root.add(box(9.6, 0.1, 2.8, tableMat, 0, 0.78, 0, { scale: 0.6 }));
  root.add(box(9.4, 0.6, 0.2, tableMat, 0, 0.42, 0, { scale: 0.6 }));
  root.add(box(4.6, 0.02, 1.2, glow(0x2e6fa8, 0.8), 0, 0.84, 0, { scale: 0.5, cast: false }));

  // delegates
  for (const x of [-3.4, -1.4, 0.6, 2.6, 4.2]) root.add(chair(x, -2.1, Math.PI, PAL.slate));
  for (const x of [-3.4, -1.4, 0.6, 2.6, 4.2]) root.add(chair(x, 2.1, 0, PAL.slate));

  // big approval screen
  const board = wallScreen(7.4, 3.0, 0x6fc4ff);
  board.position.set(0, 2.35, -5.28);
  root.add(board);
  // a simple bar graph of the two drive programmes on the screen
  const bars = group(0, 2.35, -5.16, "bars");
  const barMat = new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.75 });
  const barMat2 = new THREE.MeshBasicMaterial({ color: 0x3f5f7a, transparent: true, opacity: 0.6 });
  for (let i = 0; i < 5; i++) bars.add(box(0.5, 0.2 + i * 0.34, 0.04, i >= 2 ? barMat : barMat2, -1.8 + i * 0.9, -1.0 + (0.2 + i * 0.34) / 2, 0, { scale: 0.3, cast: false }));
  root.add(bars);

  for (const x of [-5, 0, 5]) root.add(tubeLight(x, 0, { y: 3.8, length: 1.8, color: 0xcfe6de, intensity: 30, glowColor: 0xe6f6ee }));
  root.add(new THREE.HemisphereLight(0x7084a0, 0x20242a, 1.2));
  root.add(motes(60, new THREE.Vector3(13, 3.6, 9), 0xbfd0e0, 0.018, 88));

  return { id: "review", root, update() {} };
}

import * as THREE from "three";
import { box, group, plane } from "../lib/voxel";
import { PAL, flat, glow, surface } from "../lib/materials";
import { Rng } from "../lib/rng";

/** A built, disposable set. */
export interface SetHandle {
  id: string;
  root: THREE.Group;
  update?(time: number, dt: number): void;
  /** extra lights are children of root already; kept for convenience */
  dispose?(): void;
}

export interface RoomOpts {
  w: number;
  d: number;
  h: number;
  floor?: string;
  wall?: string;
  ceil?: string;
  wallT?: number;
  tile?: number;
  ceiling?: boolean;
}

/** A simple inward-facing box room. */
export function buildRoom(o: RoomOpts): THREE.Group {
  const g = group(0, 0, 0, "room");
  const t = o.wallT ?? 0.35;
  const tile = o.tile ?? 2;
  g.add(plane(o.w, o.d, o.floor ?? "floor", 0, 0, 0, { rot: [-Math.PI / 2, 0, 0], scale: tile, receive: true }));
  g.add(box(o.w + t * 2, o.h, t, o.wall ?? "concrete", 0, o.h / 2, -o.d / 2 - t / 2, { scale: tile, cast: false }));
  g.add(box(o.w + t * 2, o.h, t, o.wall ?? "concrete", 0, o.h / 2, o.d / 2 + t / 2, { scale: tile, cast: false }));
  g.add(box(t, o.h, o.d + t * 2, o.wall ?? "concrete", -o.w / 2 - t / 2, o.h / 2, 0, { scale: tile, cast: false }));
  g.add(box(t, o.h, o.d + t * 2, o.wall ?? "concrete", o.w / 2 + t / 2, o.h / 2, 0, { scale: tile, cast: false }));
  if (o.ceiling !== false) g.add(plane(o.w, o.d, o.ceil ?? "concrete", 0, o.h, 0, { rot: [Math.PI / 2, 0, 0], scale: tile, receive: false }));
  return g;
}

export interface LampOpts {
  color?: number;
  intensity?: number;
  length?: number;
  glowColor?: number;
  intensityGlow?: number;
  y?: number;
  rotY?: number;
}

/** A fluorescent tube fixture: emissive bar + a point light just below it. */
export function tubeLight(x: number, z: number, o: LampOpts = {}): THREE.Group {
  const g = group(x, o.y ?? 2.7, z, "tubeLight");
  const len = o.length ?? 1.4;
  const col = o.glowColor ?? 0xdff2e8;
  const fixture = flat(0x2a2f35, 0.6, 0.3);
  g.add(box(0.12, 0.06, len, fixture, 0, 0.05, 0, { scale: 0.3, cast: false }));
  const bar = box(0.09, 0.045, len * 0.94, glow(col, 2.6), 0, -0.01, 0, { scale: 0.3, cast: false });
  g.add(bar);
  const l = new THREE.PointLight(o.color ?? 0xd6f0e2, o.intensity ?? 30, 12, 2);
  l.position.set(0, -0.25, 0);
  g.add(l);
  return g;
}

/** A hanging industrial pendant lamp. */
export function pendantLight(x: number, z: number, o: LampOpts = {}): THREE.Group {
  const g = group(x, 0, z, "pendant");
  const y = o.y ?? 2.5;
  const shade = flat(0x2b2b2e, 0.6, 0.4);
  g.add(box(0.02, 0.9, 0.02, flat(0x101214, 0.8, 0.2), 0, y + 0.55, 0, { scale: 0.2, cast: false }));
  const sh = box(0.46, 0.16, 0.46, shade, 0, y, 0, { scale: 0.3, cast: false });
  g.add(sh);
  const bulb = box(0.22, 0.06, 0.22, glow(o.glowColor ?? 0xffb057, 3.2), 0, y - 0.1, 0, { scale: 0.2, cast: false });
  g.add(bulb);
  const l = new THREE.PointLight(o.color ?? 0xffb057, o.intensity ?? 45, 11, 2);
  l.position.set(0, y - 0.35, 0);
  g.add(l);
  return g;
}

/** Floating dust / embers as a Points cloud. */
export function motes(count: number, bounds: THREE.Vector3, color = 0xcfd8e6, size = 0.03, seed = 1): THREE.Points {
  const rng = new Rng(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rng.sym(bounds.x / 2);
    pos[i * 3 + 1] = rng.range(0.05, bounds.y);
    pos[i * 3 + 2] = rng.sym(bounds.z / 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  return new THREE.Points(g, m);
}

/** A framed data board / wall screen. */
export function wallScreen(w: number, h: number, tint = 0x6fc4ff): THREE.Group {
  const g = group();
  g.add(box(w + 0.08, h + 0.08, 0.06, flat(0x14181e, 0.7, 0.3), 0, 0, 0, { scale: 0.4, cast: false }));
  const s = box(w, h, 0.02, surface(tint === 0x6fc4ff ? "screen" : "screenWarm"), 0, 0, 0.04, { scale: 0.5, cast: false });
  g.add(s);
  const l = new THREE.PointLight(tint, 1.6, 5, 2);
  l.position.set(0, 0, 0.5);
  g.add(l);
  return g;
}

/** An old CRT-like monitor stack. */
export function crt(x: number, y: number, z: number, rotY = 0, tint = 0x6fc4ff): THREE.Group {
  const g = group(x, y, z, "crt");
  g.rotation.y = rotY;
  g.add(box(0.5, 0.42, 0.44, flat(0x2a2e33, 0.8, 0.2), 0, 0.21, 0, { scale: 0.4 }));
  g.add(box(0.4, 0.3, 0.02, surface(tint === 0x6fc4ff ? "screen" : "screenWarm"), 0, 0.24, 0.23, { scale: 0.4, cast: false }));
  return g;
}

/** Loose papers on a desk. */
export function papers(rng: Rng, n: number, x: number, y: number, z: number, spread = 0.3): THREE.Group {
  const g = group(x, y, z, "papers");
  const paper = flat(0xd9d4c6, 0.95, 0);
  for (let i = 0; i < n; i++) {
    const m = box(0.21, 0.004, 0.3, paper, rng.sym(spread), i * 0.004, rng.sym(spread * 0.6), { scale: 0.2, cast: false });
    m.rotation.y = rng.sym(0.4);
    g.add(m);
  }
  return g;
}

/** A voxel chair (office / folding). */
export function chair(x: number, z: number, rotY = 0, color: number = PAL.slate): THREE.Group {
  const g = group(x, 0, z, "chair");
  g.rotation.y = rotY;
  const m = flat(color, 0.85, 0.02);
  g.add(box(0.44, 0.06, 0.44, m, 0, 0.46, 0, { scale: 0.3 }));
  g.add(box(0.44, 0.5, 0.06, m, 0, 0.72, -0.19, { scale: 0.3 }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.05, 0.46, 0.05, flat(0x22262b, 0.7, 0.3), sx * 0.18, 0.23, sz * 0.18, { scale: 0.2 }));
  return g;
}

export function desk(x: number, z: number, w = 1.8, d = 0.8, h = 0.76, color: number = PAL.woodDark): THREE.Group {
  const g = group(x, 0, z, "desk");
  const m = flat(color, 0.8, 0.02);
  g.add(box(w, 0.06, d, m, 0, h, 0, { scale: 0.4 }));
  g.add(box(0.08, h, d * 0.9, m, -w / 2 + 0.1, h / 2, 0, { scale: 0.4 }));
  g.add(box(0.08, h, d * 0.9, m, w / 2 - 0.1, h / 2, 0, { scale: 0.4 }));
  g.add(box(w * 0.9, 0.05, d * 0.9, m, 0, h * 0.5, 0, { scale: 0.4 }));
  return g;
}

/** A stack of storage crates. */
export function crates(rng: Rng, x: number, z: number, n: number, seed = 1): THREE.Group {
  const g = group(x, 0, z, "crates");
  const cols = [0x5a4a32, 0x4a4438, 0x3d4436];
  for (let i = 0; i < n; i++) {
    const s = rng.range(0.5, 0.8);
    const m = box(s, s * 0.72, s, flat(rng.pick(cols), 0.9, 0.02), rng.sym(0.6), s * 0.36 + (i % 3) * 0.02, rng.sym(0.6), { scale: 0.3 });
    m.rotation.y = rng.sym(0.5);
    g.add(m);
  }
  return g;
}

export const SET_CENTER = new THREE.Vector3(0, 0, 0);

import * as THREE from "three";
import {
  voxelModel,
  voxelSphere,
  voxelMaterial,
  buildVoxelGeometry,
} from "@agentbench/voxel-kit";
import { mulberry32 } from "./util";

/* ------------------------------------------------------------------ */
/* materials                                                           */
/* ------------------------------------------------------------------ */

const mat = voxelMaterial();
const matGlow = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xfff2d8,
  emissiveIntensity: 1.6,
  roughness: 1,
});

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material = mat): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  return m;
}

/* ------------------------------------------------------------------ */
/* small props                                                         */
/* ------------------------------------------------------------------ */

/** 2010-style caseless pistol. Barrel along +Z (fist direction). */
export function makePistol(): THREE.Mesh {
  const g = voxelModel({
    palette: {
      k: 0x1b1f26, // frame
      K: 0x2a303a, // slide
      g: 0x4a3421, // grip
      m: 0x14161a, // muzzle
    },
    layers: [
      [
        "....kkkkkkk...",
        "...kKKKKKKkk..",
        "...kKKKKKKKKk.",
        "gg.kKkKKKKKKmm",
        "gggkKkKKKKKmm.",
        "ggggkKkKKKKk..",
        "ggggg.........",
      ],
      [
        "....kkkkkkk...",
        "...kKKKKKKkk..",
        "...kKKKKKKKKk.",
        "gg.kKkKKKKKKmm",
        "gggkKkKKKKKmm.",
        "ggggkKkKKKKk..",
        "ggggg.........",
      ],
      [
        "....kkkkkkk...",
        "...kKKKKKKkk..",
        "...kKKKKKKKKk.",
        "gg.kKkKKKKKKmm",
        "gggkKkKKKKKmm.",
        "ggggkKkKKKKk..",
        "ggggg.........",
      ],
    ],
    axis: "x",
    voxel: 0.3,
  });
  const m = mesh(g);
  m.name = "pistol";
  return m;
}

/** rifle scope converted to a magnetic pistol mount */
export function makeScope(): THREE.Mesh {
  const g = voxelModel({
    palette: { k: 0x1b1f26, K: 0x2a303a, L: 0x9fd8ff, l: 0x3d4a5a },
    layers: [
      [
        ".ll.",
        ".kk.",
        ".KLK",
        ".KLK",
        ".kk.",
      ],
      [
        ".ll.",
        ".kk.",
        ".KLK",
        ".KLK",
        ".kk.",
      ],
      [
        ".ll.",
        ".kk.",
        ".KLK",
        ".KLK",
        ".kk.",
      ],
    ],
    axis: "x",
    voxel: 0.32,
  });
  return mesh(g);
}

export function makeMagazine(): THREE.Mesh {
  const g = voxelModel({
    palette: { k: 0x1b1f26, K: 0x2f3642 },
    layers: [
      [".KK", ".KK", ".kk", ".kk", ".kk"],
      [".KK", ".KK", ".kk", ".kk", ".kk"],
      [".KK", ".KK", ".kk", ".kk", ".kk"],
    ],
    axis: "x",
    voxel: 0.35,
  });
  return mesh(g);
}

/** caseless pistol round: steel tip + propellant block */
export function makeRound(): THREE.Mesh {
  const g = voxelModel({
    palette: { T: 0x8a7a55, B: 0x3a3f4a, D: 0x20242c },
    layers: [
      ["TTTBB", "TTTTD"],
      ["TTTBB", "TTTTD"],
    ],
    axis: "x",
    voxel: 0.5,
  });
  return mesh(g);
}

/** the meteorite cylinder (陨石段) */
export function makeMeteorSegment(len = 6): THREE.Mesh {
  const g = voxelModel({
    palette: { m: 0x4a443c, s: 0x5c554a, k: 0x35302a },
    layers: [
      ["kkkkkk".slice(0, len), "mmmmmm".slice(0, len)],
      ["kkkkkk".slice(0, len), "mmmmmm".slice(0, len)],
    ],
    axis: "x",
    voxel: 0.55,
  });
  return mesh(g);
}

/** display meteorite: an irregular metallic rock */
export function makeMeteorRock(seed = 1, size = 0.16): THREE.Mesh {
  const rng = mulberry32(seed);
  const g = voxelSphere(
    5,
    (x, y, z) => {
      const r = rng();
      if (r < 0.12) return 0x2c2822; // pits
      if (r < 0.35) return 0x55504a;
      if (r < 0.7) return 0x6b6258;
      return 0x4d4640;
    },
    { voxel: size },
  );
  return mesh(g);
}

/** Mars achondrite, tiny, under the magnifier */
export function makeMarsGrain(): THREE.Mesh {
  const g = voxelSphere(3, (x, y, z, d) => (d < 0.55 ? 0x8a5a44 : 0x5c3a2e), { voxel: 0.02 });
  return mesh(g);
}

export function makeTeapot(): THREE.Mesh {
  const g = voxelModel({
    palette: { w: 0xd8d2c4, W: 0xc2bbaa, k: 0x8a8272 },
    layers: [
      [
        ".ww..",
        ".www.",
        ".wwww",
        "wwwww",
        "wwwww",
        ".www.",
        ".www.",
      ],
      [
        "..w..",
        ".www.",
        ".wwww",
        "wwwww",
        "wwwww",
        ".www.",
        ".www.",
      ],
      [
        ".ww..",
        ".www.",
        ".wwww",
        "wwwww",
        "wwwww",
        ".www.",
        ".www.",
      ],
    ],
    axis: "x",
    voxel: 0.16,
  });
  return mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.05 }));
}

export function makeTeacup(): THREE.Mesh {
  const g = voxelModel({
    palette: { w: 0xe6e0d2, k: 0x9a907e },
    layers: [
      ["kkk", "kwk", "kwk", "kkk"],
      ["kkk", "kwk", "kwk", "kkk"],
      ["kkk", "kwk", "kwk", "kkk"],
    ],
    axis: "x",
    voxel: 0.13,
  });
  return mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
}

export function makePliers(): THREE.Mesh {
  const g = voxelModel({
    palette: { s: 0x8a8f98, S: 0x5c616a, r: 0x6b3228 },
    layers: [
      [
        ".ss.",
        ".ss.",
        ".ss.",
        ".ss.",
        "rrs.",
        "rrr.",
      ],
      [
        ".ss.",
        ".ss.",
        ".ss.",
        ".ss.",
        "rrs.",
        "rrr.",
      ],
    ],
    axis: "x",
    voxel: 0.3,
  });
  return mesh(g);
}

export function makeGlueTube(): THREE.Mesh {
  const g = voxelModel({
    palette: { w: 0xe8e4da, b: 0x3a6ea5, t: 0xc9c4b8 },
    layers: [
      ["..w", "bbw", "bbw", "..w"],
      ["..w", "bbw", "bbw", "..w"],
      ["..w", "bbw", "bbw", "..w"],
    ],
    axis: "x",
    voxel: 0.3,
  });
  return mesh(g);
}

export function makeKnife(): THREE.Mesh {
  const g = voxelModel({
    palette: { s: 0xb9bfc8, h: 0x4a3421 },
    layers: [
      ["..sssss", ".ssssss", "sssssss"],
      ["..sssss", ".ssssss", "sssssss"],
    ],
    axis: "x",
    voxel: 0.3,
  });
  return mesh(g);
}

export function makeClothBundle(): THREE.Mesh {
  const g = voxelModel({
    palette: { t: 0x9a8a6c, T: 0xb3a27f, d: 0x6e6048 },
    layers: [
      ["ttttttttt", "ttttttttt", "ttttttttt"],
      ["ttttttttt", "ttttttttt", "ttttttttt"],
      ["ttttttttt", "ttttttttt", "ttttttttt"],
    ],
    axis: "x",
    voxel: 0.34,
  });
  return mesh(g);
}

export function makeBeefChunk(): THREE.Mesh {
  const g = voxelModel({
    palette: { r: 0x7a3028, R: 0x8e4034, f: 0xd8c8b0 },
    layers: [
      ["rrRrr", "rRRRr", "rrRrr", "rrrrr"],
      ["rrRrr", "rRRRr", "rrRrr", "rrrrr"],
      ["rrRrr", "rRRRr", "rrRrr", "rrrrr"],
      ["rrrrr", "ffrrr", "rrrrr", "rrrrr"],
    ],
    axis: "x",
    voxel: 0.3,
  });
  return mesh(g);
}

export function makePositioningUnit(): THREE.Mesh {
  const g = voxelModel({
    palette: { k: 0x242a34, K: 0x39424e, b: 0x3a6ea5 },
    layers: [
      ["kkkk", "kKKk", "kKKk", "kkkk"],
      ["kkkk", "kKbk", "kKKk", "kkkk"],
      ["kkkk", "kKKk", "kKKk", "kkkk"],
    ],
    axis: "x",
    voxel: 0.28,
  });
  return mesh(g);
}

export function makeCamera(): THREE.Mesh {
  const g = voxelModel({
    palette: { k: 0x242a34, K: 0x39424e, L: 0x9fd8ff },
    layers: [
      [".kkkk.", "kKKKKk", "kKLLKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKLLKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKLLKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKLLKk", ".kkkk."],
    ],
    axis: "x",
    voxel: 0.3,
  });
  return mesh(g);
}

/* ------------------------------------------------------------------ */
/* celestial bodies                                                    */
/* ------------------------------------------------------------------ */

export interface EarthOpts {
  radius?: number;
  voxel?: number;
  centerY?: number;
}

/**
 * The Earth as a partial voxel sphere: only the sunlit cap above the horizon
 * is built, so it stays cheap while reading as a curved planet below the
 * camera. Surface colour comes from deterministic noise; a pale band hugs the
 * limb as an atmosphere.
 */
export function makeEarthCap(opts: EarthOpts = {}): THREE.Mesh {
  const radius = opts.radius ?? 22000;
  const voxel = opts.voxel ?? 380;
  const centerY = opts.centerY ?? -23400;
  const half = Math.ceil(radius / voxel) + 1;
  const span = half * 2;
  const yTop = centerY + radius; // sphere top in world y
  const horizonY = centerY + Math.cos(Math.acos(radius / -centerY)) * radius; // tangent circle
  const yMinWorld = Math.max(horizonY - 3000, yTop - radius * 0.72);
  const yVox = Math.ceil((yTop + 100 - yMinWorld) / voxel) + 2;
  const rng = mulberry32(90210);

  const g = buildVoxelGeometry(
    {
      size: [span, yVox, span],
      at(x, y, z) {
        const wx = (x + 0.5 - span / 2) * voxel;
        const wy = yMinWorld + (y + 0.5) * voxel;
        const wz = (z + 0.5 - span / 2) * voxel;
        const cy = wy - centerY;
        const r2 = wx * wx + wz * wz;
        const dist = Math.sqrt(cy * cy + r2);
        const shellMin = radius - 2.1 * voxel;
        if (dist < shellMin || dist > radius + 0.2 * voxel) return null;
        // thin atmosphere band just inside the limb
        if (dist > radius - 1.2 * voxel) return 0x6fa8d8;
        const n1 = Math.sin(wx * 0.0009) * Math.cos(wz * 0.0011) + Math.sin((wx + wz) * 0.00042);
        const n2 = Math.sin(wx * 0.00036 + 1.7) * Math.sin(wz * 0.0005);
        const land = n1 > 0.28 && n2 > -0.25;
        let base = land ? (n2 > 0.4 ? 0x5f7044 : 0x6e6044) : n2 < -0.55 ? 0x0a2c50 : 0x0d3a6e;
        const cloud = Math.sin(wx * 0.0031 + wz * 0.0027) * Math.sin(wx * 0.0017 - wz * 0.0023);
        if (cloud > 0.78 && n1 < 0.55) base = 0xd8e2ea;
        let r = (base >> 16) & 255;
        let gg = (base >> 8) & 255;
        let b = base & 255;
        // sunlit toward -Z, darker toward +Z (terminator)
        const sunK = 0.38 + 0.28 * ((-wz / radius) * 0.5 + 0.5) + 0.08 * (cy / radius);
        const k = Math.max(0.14, Math.min(0.74, sunK));
        r = Math.min(255, r * k);
        gg = Math.min(255, gg * k);
        b = Math.min(255, b * k);
        if (rng() < 0.05) {
          const dk = 0.85;
          r *= dk; gg *= dk; b *= dk;
        }
        return (r << 16) | (gg << 8) | b;
      },
    },
    { voxel, anchor: "min" },
  );
  const m = mesh(g);
  m.position.set(-half * voxel, yMinWorld, -half * voxel);
  m.name = "earth";
  return m;
}

export function makeSunDisc(radius = 1400, voxel = 130): THREE.Mesh {
  const span = Math.ceil(radius / voxel) * 2 + 2;
  const g = buildVoxelGeometry(
    {
      size: [span, span, 2],
      at(x, y, z) {
        const cx = (x - span / 2 + 0.5) * voxel;
        const cy = (y - span / 2 + 0.5) * voxel;
        const d = Math.sqrt(cx * cx + cy * cy);
        if (d > radius) return null;
        const k = 1 - d / radius;
        if (k < 0.12) return 0xffb25e;
        if (k < 0.35) return 0xffd9a0;
        return 0xfff4dc;
      },
    },
    { voxel, anchor: "center" },
  );
  const m = new THREE.Mesh(
    g,
    new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, side: THREE.DoubleSide }),
  );
  m.rotation.x = -Math.PI / 2; // disc faces the scene above
  m.name = "sun";
  return m;
}

/* ------------------------------------------------------------------ */
/* stations                                                            */
/* ------------------------------------------------------------------ */

const STATION_WHITE = new THREE.MeshStandardMaterial({ color: 0x9db2c8, roughness: 0.85, metalness: 0.25 });
const STATION_GRAY = new THREE.MeshStandardMaterial({ color: 0x66748a, roughness: 0.9, metalness: 0.3 });
const STATION_DARK = new THREE.MeshStandardMaterial({ color: 0x3c4654, roughness: 0.9, metalness: 0.3 });
const STATION_EMIS = new THREE.MeshStandardMaterial({
  color: 0xdfe8f2,
  emissive: 0xbcd4ee,
  emissiveIntensity: 1.1,
  roughness: 0.8,
});
const PANEL_BLUE = new THREE.MeshStandardMaterial({ color: 0x1c3a6e, roughness: 0.8, metalness: 0.4 });
const PANEL_EMIS = new THREE.MeshStandardMaterial({
  color: 0x24448a,
  emissive: 0x16295a,
  emissiveIntensity: 0.6,
  roughness: 0.8,
  metalness: 0.4,
});

function addBox(parent: THREE.Object3D, mat3: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat3);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

/** 黄河空间站 — wheel-shaped counterweight of the space elevator */
export function makeYellowRiverStation(): { group: THREE.Group; rim: THREE.Group; exitDoor: THREE.Group } {
  const group = new THREE.Group();
  const hub = new THREE.Group();
  // central hub
  addBox(hub, STATION_WHITE, 16, 16, 16, 0, 0, 0);
  addBox(hub, STATION_GRAY, 18, 3, 18, 0, -6, 0);
  addBox(hub, STATION_GRAY, 18, 3, 18, 0, 6, 0);
  addBox(hub, STATION_EMIS, 4, 2, 4, 0, 8.5, 0);
  group.add(hub);

  const rim = new THREE.Group();
  const R = 56;
  const segs = 24;
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const seg = new THREE.Group();
    seg.position.set(x, 0, z);
    seg.rotation.y = -a + Math.PI / 2;
    addBox(seg, STATION_WHITE, 8.5, 6.5, 14, 0, 0, 0);
    addBox(seg, STATION_EMIS, 0.4, 1.2, 9, 4.3, 0, 0);
    rim.add(seg);
  }
  // spokes
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = Math.cos(a) * (R - 8);
    const z = Math.sin(a) * (R - 8);
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, R - 8), STATION_GRAY);
    spoke.position.set(x / 2, 0, z / 2);
    spoke.rotation.y = -a;
    rim.add(spoke);
  }
  group.add(rim);

  // exit airlock on the hub, facing the sun side (-Z)
  const exitDoor = new THREE.Group();
  exitDoor.position.set(0, 0, 8.6);
  const exitPanel = addBox(exitDoor, STATION_DARK, 3.6, 3.6, 0.7, 0, 0, 0.3);
  exitPanel.name = "exit-panel";
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xff5a48,
    emissive: 0xff3a28,
    emissiveIntensity: 2.0,
    roughness: 1,
  });
  const lamp = addBox(exitDoor, lampMat, 0.5, 0.5, 0.2, 0, 1.6, 0.7);
  lamp.name = "exit-lamp";
  group.add(exitDoor);
  group.name = "yellow-river";
  return { group, rim, exitDoor };
}

/** 一号基地 — first space-force base */
export function makeBaseOne(): THREE.Group {
  const group = new THREE.Group();
  addBox(group, STATION_GRAY, 60, 3, 3, 0, 0, 0); // truss
  addBox(group, STATION_GRAY, 3, 3, 60, 0, 0, 0);
  addBox(group, STATION_WHITE, 22, 6, 6, -16, 3, 0);
  addBox(group, STATION_WHITE, 16, 6, 6, 14, 3, 12);
  addBox(group, STATION_EMIS, 3, 1, 1, -10, 0, 0);
  // solar wings
  for (const sx of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(30, 0.4, 16), PANEL_BLUE);
    wing.position.set(0, 2.4, sx * 46);
    group.add(wing);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(30, 0.6, 16.6), STATION_DARK);
    frame.position.set(0, 2.4, sx * 46);
    group.add(frame);
  }
  // beacon
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xff8a5a,
    emissive: 0xff5a28,
    emissiveIntensity: 2.2,
    roughness: 1,
  });
  const beacon = addBox(group, beaconMat, 0.8, 0.8, 0.8, 0, 5, 0);
  beacon.name = "base-one-beacon";
  group.name = "base-one";
  return group;
}

/** 在建的太空船坞 — a giant skeleton of trusses */
export function makeShipyardSkeleton(): THREE.Group {
  const group = new THREE.Group();
  const L = 1500;
  const W = 420;
  const H = 320;
  const beam = (w: number, h: number, d: number, x: number, y: number, z: number) =>
    addBox(group, STATION_DARK, w, h, d, x, y, z);
  for (let i = 0; i < 5; i++) {
    const x = -L / 2 + (i / 4) * L;
    for (const z of [-W / 2, W / 2]) {
      beam(2, 2, 2, x, H / 2, z);
      beam(2, 2, 2, x, -H / 2, z);
      beam(2, H + 4, 2, x, 0, z);
    }
    for (const y of [-H / 2, H / 2]) beam(2, 2, W + 4, x, y, 0);
  }
  for (const y of [-H / 2, H / 2]) {
    beam(L, 2, 2, 0, y, -W / 2);
    beam(L, 2, 2, 0, y, W / 2);
  }
  for (let i = 0; i < 9; i++) {
    const z = -W / 2 + (i / 8) * W;
    beam(L, 2, 2, 0, H / 2, z);
    beam(L, 2, 2, 0, -H / 2, z);
  }
  for (let i = 0; i < 4; i++) {
    const y = -H / 2 + (i / 3) * H;
    beam(2, 2, W + 4, -L / 2, y, 0);
    beam(2, 2, W + 4, L / 2, y, 0);
  }
  group.name = "shipyard";
  return group;
}

/** small scattered facilities — “草原上的帐篷” */
export function makeSmallStations(count: number, seed = 7): THREE.Group {
  const rng = mulberry32(seed);
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const g = new THREE.Group();
    addBox(g, STATION_WHITE, 6 + rng() * 10, 3, 4, 0, 0, 0);
    addBox(g, PANEL_BLUE, 3 + rng() * 5, 0.3, 3, 0, 1.6, 4 + rng() * 3);
    const a = rng() * Math.PI * 2;
    const r = 2400 + rng() * 2200;
    g.position.set(Math.cos(a) * r, -1600 + rng() * 1200, -5200 + Math.sin(a) * r);
    g.rotation.y = rng() * Math.PI;
    group.add(g);
  }
  return group;
}

/** space debris around the waiting point */
export function makeDebris(count = 70, seed = 11): THREE.Group {
  const rng = mulberry32(seed);
  const group = new THREE.Group();
  const mats = [STATION_GRAY, STATION_DARK, PANEL_BLUE];
  for (let i = 0; i < count; i++) {
    const m = addBox(
      group,
      mats[Math.floor(rng() * mats.length)]!,
      0.3 + rng() * 1.6,
      0.3 + rng() * 0.9,
      0.3 + rng() * 1.2,
      0, 0, 0,
    );
    m.position.set((rng() - 0.5) * 520, (rng() - 0.5) * 320, (rng() - 0.5) * 520);
    m.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
  }
  return group;
}

/** elevator cable: hub down to the earth limb */
export function makeCable(fromY: number, toY: number, z: number): THREE.Mesh {
  const len = fromY - toY;
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, len, 1.4), STATION_DARK);
  m.position.set(0, (fromY + toY) / 2, z);
  m.name = "elevator-cable";
  return m;
}

/** starfield */
export function makeStars(count = 900, seed = 42): THREE.Points {
  const rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 60000 + rng() * 40000;
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    positions[i * 3 + 2] = Math.cos(phi) * r;
    const warm = rng();
    c.setHSL(0.58 + warm * 0.1, 0.25 + warm * 0.3, 0.55 + rng() * 0.4);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const starTex = (() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const m = new THREE.PointsMaterial({
    size: 90,
    map: starTex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(g, m);
  points.name = "stars";
  return points;
}

export function makeThrusterPack(): THREE.Mesh {
  const g = voxelModel({
    palette: { k: 0x242a34, K: 0x39424e, n: 0x161a20 },
    layers: [
      [".kkkk.", "kKKKKk", "kKnnKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKnnKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKnnKk", ".kkkk."],
      [".kkkk.", "kKKKKk", "kKnnKk", ".kkkk."],
    ],
    axis: "x",
    voxel: 0.35,
  });
  return mesh(g);
}

/** glow sprite helper */
export function makeGlowSprite(colorInner: string, colorOuter: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, colorInner);
  grad.addColorStop(0.3, colorInner.replace(/[\d.]+\)$/, "0.5)"));
  grad.addColorStop(1, colorOuter);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  return sprite;
}

import * as THREE from "three";
import {
  buildVoxelGeometry,
  createFigure,
  createSkin,
  voxelMaterial,
  voxelModel,
  voxelSphere,
  type Figure,
  type Skin,
  type SkinPainter,
} from "@agentbench/voxel-kit";

export const palette = {
  ink: 0x091018,
  night: 0x101c2a,
  steel: 0x394752,
  steelLight: 0x7f9197,
  brass: 0xc59b61,
  amber: 0xffb66e,
  cyan: 0x76d3d2,
  ice: 0xd9f4f0,
  rust: 0x754c3e,
  wood: 0x3e2b24,
  woodLight: 0x71503a,
  paper: 0xd5c5a5,
  olive: 0x3f514b,
  navy: 0x1e3447,
  suit: 0xd5e0df,
  visor: 0x122b3d,
  red: 0xc85b4e,
};

export function material(color: number, options: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.82, ...options });
}

export function basic(color: number, options: THREE.MeshBasicMaterialParameters = {}): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({ color, ...options });
}

export function box(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  mat: THREE.Material,
  rotation?: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function voxelMesh(geometry: THREE.BufferGeometry, options: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, voxelMaterial(options));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function textTexture(title: string, subtitle = "", accent = "#d4a76a", width = 512, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0b131b";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, width - 24, height - 24);
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.font = `600 ${Math.round(height * 0.17)}px sans-serif`;
  ctx.fillText(title, 30, height * 0.46);
  if (subtitle) {
    ctx.fillStyle = "#a9b6bb";
    ctx.font = `${Math.round(height * 0.085)}px monospace`;
    ctx.fillText(subtitle, 32, height * 0.72);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function sign(parent: THREE.Object3D, title: string, subtitle: string, position: [number, number, number], size: [number, number], accent = "#d4a76a"): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size[0], size[1]),
    new THREE.MeshBasicMaterial({ map: textTexture(title, subtitle, accent), transparent: true, side: THREE.DoubleSide }),
  );
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function makeMeteorite(radius = 0.22, seed = 1, iron = true): THREE.Mesh {
  const random = seeded(seed);
  const tones = iron ? [0x252c31, 0x374149, 0x4c4b43, 0x6b5848, 0x8b6c4f] : [0x514841, 0x736353, 0x96806a, 0x3e3b3b];
  const geometry = voxelSphere(4, (x, y, z, distance) => {
    const n = Math.sin(x * 4.7 + seed) * Math.cos(y * 3.1 - z * 2.8) + random() * 0.22;
    if (distance > 0.82 && n < -0.35) return null;
    return tones[Math.floor(random() * tones.length)]!;
  }, { voxel: radius / 4 });
  const mesh = voxelMesh(geometry, { roughness: iron ? 0.5 : 0.94, metalness: iron ? 0.7 : 0.05 });
  mesh.rotation.set(random() * 0.7, random() * 2, random() * 0.6);
  return mesh;
}

export function makeEarth(): { planet: THREE.Mesh; atmosphere: THREE.Mesh } {
  const radius = 18;
  const geometry = voxelSphere(radius, (x, y, z) => {
    const nx = (x - radius) / radius;
    const ny = (y - radius) / radius;
    const nz = (z - radius) / radius;
    const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
    const land = Math.sin(nx * 5.2 + nz * 2.3) + Math.cos(nz * 6.1 - ny * 3.4) + Math.sin((nx + ny) * 10.5) * 0.28;
    const cloud = Math.sin(nx * 15 + nz * 7) * Math.cos(ny * 13 - nz * 4);
    if (Math.abs(lat) > 1.18) return 0xd7e5e0;
    if (cloud > 0.72 && land < 0.9) return 0xc4dcda;
    if (land > 0.78) return ny > 0.2 ? 0x54745c : 0x7d8057;
    if (land > 0.4) return 0x315e66;
    return ny < -0.25 ? 0x173f69 : 0x1c5b83;
  }, { voxel: 0.48 });
  const planet = voxelMesh(geometry, { roughness: 0.9, metalness: 0.02 });
  const atmosphere = new THREE.Mesh(
    voxelSphere(19, (x, y, z, d) => d > 0.9 ? 0x4aafd0 : null, { voxel: 0.48 }),
    new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.13, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  return { planet, atmosphere };
}

export function makeStars(count = 900, seed = 12, spread = 150): THREE.Points {
  const random = seeded(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const r = 35 + random() * spread;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.cos(phi) * r;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r - 35;
    color.setHSL(0.52 + random() * 0.12, 0.25 + random() * 0.35, 0.42 + random() * 0.5);
    colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.105, vertexColors: true, transparent: true, opacity: 0.82, sizeAttenuation: true }));
}

function paintFace(paint: SkinPainter, role: string, variant: number): void {
  const skin = role === "collector" ? "#b88768" : ["#bd8e71", "#a9755e", "#d0a17d", "#8e6657"][variant % 4]!;
  const hair = role === "collector" ? "#6e7370" : ["#1b2025", "#302b29", "#4a3830", "#20282a"][variant % 4]!;
  paint.fill("head", "all", skin);
  paint.fill("head", "top", hair);
  paint.fill("head", "back", hair);
  paint.rect("head", "front", 0, 0, 8, 2, hair);
  paint.rect("head", "left", 0, 0, 8, 2, hair);
  paint.rect("head", "right", 0, 0, 8, 2, hair);
  const brow = role === "collector" ? "#514641" : hair;
  paint.rect("head", "front", 1, 3, 2, 1, brow);
  paint.rect("head", "front", 5, 3, 2, 1, brow);
  paint.rect("head", "front", 2, 4, 1, 1, "#172027");
  paint.rect("head", "front", 5, 4, 1, 1, "#172027");
  paint.px("head", "front", 3, 5, "#9b6b59");
  if (role === "collector") {
    paint.rect("head", "front", 2, 6, 4, 1, "#694b43");
    paint.px("head", "front", 1, 6, skin);
    paint.px("head", "front", 6, 6, skin);
    paint.px("head", "front", 1, 4, "#d1a083");
  } else if (role === "zhang") {
    paint.rect("head", "front", 3, 6, 2, 1, "#633f3c");
    paint.px("head", "front", 1, 2, hair);
    paint.px("head", "front", 6, 2, hair);
  } else {
    paint.rect("head", "front", 3, 6, 2, 1, "#754b47");
  }
}

export function bodySkin(role: "zhang" | "collector" | "crew", variant = 0): Skin {
  return createSkin((paint) => {
    for (const part of ["head", "torso", "armR", "armL", "legR", "legL"] as const) paint.fill(part, "all", "#ae8067");
    paintFace(paint, role, variant);
    paint.grain("head", "all", 0.045, variant + 4);
  });
}

export function uniformSkin(role: "zhang" | "collector" | "work" | "base"): Skin {
  return createSkin((paint) => {
    if (role === "collector") {
      paint.fill("torso", "all", "#70533e").fill("armR", "all", "#70533e").fill("armL", "all", "#70533e");
      paint.fill("legR", "all", "#343b3c").fill("legL", "all", "#343b3c");
      paint.rect("torso", "front", 3, 0, 2, 8, "#c3ab84");
      paint.rect("torso", "front", 1, 3, 1, 1, "#bf9a63").rect("torso", "front", 6, 3, 1, 1, "#bf9a63");
      paint.rect("torso", "front", 0, 10, 8, 1, "#4b3a31");
    } else if (role === "work") {
      paint.fill("torso", "all", "#36464b").fill("armR", "all", "#36464b").fill("armL", "all", "#36464b");
      paint.fill("legR", "all", "#242e35").fill("legL", "all", "#242e35");
      paint.rect("torso", "front", 0, 0, 8, 2, "#59645f");
      paint.rect("torso", "front", 6, 3, 1, 2, "#d5a365");
      paint.rect("torso", "front", 0, 10, 8, 1, "#161e24");
    } else if (role === "base") {
      paint.fill("torso", "all", "#263e50").fill("armR", "all", "#263e50").fill("armL", "all", "#263e50");
      paint.fill("legR", "all", "#1c2d3c").fill("legL", "all", "#1c2d3c");
      paint.rect("torso", "front", 0, 0, 8, 2, "#65818a");
      paint.rect("torso", "front", 1, 3, 2, 2, "#bf5149");
      paint.rect("torso", "front", 0, 10, 8, 1, "#101c29");
    } else {
      paint.fill("torso", "all", "#3d504a").fill("armR", "all", "#3d504a").fill("armL", "all", "#3d504a");
      paint.fill("legR", "all", "#293c3d").fill("legL", "all", "#293c3d");
      paint.rect("torso", "front", 0, 0, 8, 2, "#263b3a");
      paint.rect("torso", "front", 1, 3, 2, 2, "#bb5c4d");
      paint.rect("torso", "front", 6, 3, 1, 1, "#d3b477");
      paint.rect("torso", "front", 0, 10, 8, 1, "#202d2f");
      paint.rect("legR", "front", 0, 0, 4, 2, "#314547").rect("legL", "front", 0, 0, 4, 2, "#314547");
    }
    paint.grain("torso", "all", 0.06, role.length * 13);
  }, { transparent: true });
}

export function spaceSuitSkin(accent = "#c99b5d", clearVisor = false, cracked = false): Skin {
  return createSkin((paint) => {
    paint.fill("head", "all", "#d5dfdd");
    paint.fill("torso", "all", "#d5dfdd").fill("armR", "all", "#d5dfdd").fill("armL", "all", "#d5dfdd");
    paint.fill("legR", "all", "#c2d0cf").fill("legL", "all", "#c2d0cf");
    if (clearVisor && !cracked) {
      paint.clear("head", "front");
      paint.rect("head", "front", 0, 0, 8, 1, "#71878a").rect("head", "front", 0, 7, 8, 1, "#71878a");
      paint.rect("head", "front", 0, 0, 1, 8, "#71878a").rect("head", "front", 7, 0, 1, 8, "#71878a");
      paint.px("head", "front", 1, 1, "#d8f1e9");
    } else {
      paint.fill("head", "front", "#142d3d");
      paint.rect("head", "front", 1, 1, 6, 1, "#355365");
      paint.rect("head", "front", 2, 2, 3, 1, "#52717a");
      if (cracked) {
        const cracks: Array<[number, number]> = [[3, 1], [3, 2], [4, 3], [4, 4], [5, 5], [4, 5], [3, 6], [2, 4], [1, 4], [5, 3], [6, 2], [5, 6], [6, 6]];
        for (const [x, y] of cracks) paint.px("head", "front", x, y, "#b8d6d2");
        paint.px("head", "front", 4, 4, "#9d4c48");
        paint.px("head", "front", 5, 4, "#b65c51");
      }
    }
    paint.rect("torso", "front", 0, 0, 8, 2, "#aabcbc");
    paint.rect("torso", "front", 2, 3, 4, 3, "#344b55");
    paint.rect("torso", "front", 3, 4, 2, 1, accent);
    paint.rect("torso", "front", 0, 9, 8, 1, accent);
    paint.rect("armR", "front", 0, 4, 4, 1, accent).rect("armL", "front", 0, 4, 4, 1, accent);
    paint.rect("legR", "front", 0, 4, 4, 1, "#8d9e9e").rect("legL", "front", 0, 4, 4, 1, "#8d9e9e");
    paint.rect("torso", "back", 2, 2, 4, 5, "#9cadae");
    paint.grain("torso", "all", 0.035, 51);
  }, { transparent: true });
}

export function makeFigure(role: "zhang" | "collector" | "work" | "base", heightM = 1.8): Figure {
  return createFigure({ body: bodySkin(role === "work" || role === "base" ? "zhang" : role).texture, clothes: uniformSkin(role).texture, heightM });
}

export function makeSpaceFigure(variant = 0, accent = "#c99b5d", clearVisor = false): Figure {
  return createFigure({ body: bodySkin("crew", variant).texture, clothes: spaceSuitSkin(accent, clearVisor).texture, heightM: 1.8, castShadow: true });
}

export function makePistol(): THREE.Group {
  const group = new THREE.Group();
  const side = [
    "............",
    "...######...",
    "..########..",
    "..##########",
    "....##......",
    "....##......",
    "...###......",
    "...###......",
  ];
  const geometry = voxelModel({ palette: { "#": 0x20272d }, layers: [side, side, side], axis: "x", voxel: 0.045 });
  group.add(voxelMesh(geometry, { roughness: 0.36, metalness: 0.82 }));
  const grip = box(group, [0.12, 0.22, 0.13], [0, -0.18, -0.08], material(0x44372f, { roughness: 0.72 }));
  grip.rotation.x = -0.16;
  return group;
}

export function makeScope(): THREE.Group {
  const group = new THREE.Group();
  const rows = ["..####..", ".######.", ".######.", "..####.."];
  group.add(voxelMesh(voxelModel({ palette: { "#": 0x28383f }, layers: [rows, rows, rows], axis: "x", voxel: 0.035 }), { roughness: 0.28, metalness: 0.78 }));
  box(group, [0.1, 0.1, 0.025], [0, 0, 0.15], basic(0x83c8c0));
  return group;
}

export function makeCartridge(meteorite = false): THREE.Group {
  const group = new THREE.Group();
  box(group, [0.07, 0.07, 0.25], [0, 0, 0], material(0x343b3c, { metalness: 0.45, roughness: 0.56 }));
  const tip = box(group, [0.078, 0.078, 0.095], [0, 0, 0.17], material(meteorite ? 0x62594e : 0xb27a4e, { metalness: 0.65, roughness: 0.43 }));
  tip.name = meteorite ? "meteorite-tip" : "copper-tip";
  group.userData.tip = tip;
  return group;
}

export function makeBackpack(): THREE.Group {
  const group = new THREE.Group();
  box(group, [0.65, 0.82, 0.3], [0, 0, 0], material(0x8d9c9d, { metalness: 0.35, roughness: 0.7 }));
  box(group, [0.42, 0.18, 0.04], [0, 0.12, 0.17], basic(0x263e4a));
  box(group, [0.07, 0.07, 0.04], [-0.12, 0.12, 0.2], basic(0x7de0d0));
  box(group, [0.07, 0.07, 0.04], [0.12, 0.12, 0.2], basic(0xd6a45e));
  return group;
}

export function makeCameraProp(): THREE.Group {
  const group = new THREE.Group();
  box(group, [0.28, 0.18, 0.22], [0, 0, 0], material(0x242c33, { metalness: 0.65, roughness: 0.35 }));
  box(group, [0.16, 0.16, 0.08], [0, 0, 0.14], material(0x111a22, { metalness: 0.8, roughness: 0.2 }));
  box(group, [0.07, 0.07, 0.02], [0, 0, 0.19], basic(0x7cb5b4));
  box(group, [0.05, 0.2, 0.05], [0, 0.16, 0], material(0x38484e));
  return group;
}

export function makeFlash(): THREE.Group {
  const group = new THREE.Group();
  const glow = basic(0xffd18a, { transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  box(group, [0.09, 0.09, 0.6], [0, 0, 0.28], glow);
  box(group, [0.38, 0.06, 0.12], [0, 0, 0.11], glow);
  box(group, [0.06, 0.38, 0.12], [0, 0, 0.11], glow);
  group.visible = false;
  return group;
}

export function makeThruster(): THREE.Group {
  const group = new THREE.Group();
  const glow = basic(0xb8eff0, { transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false });
  box(group, [0.09, 0.09, 0.8], [-0.22, 0, 0.36], glow);
  box(group, [0.09, 0.09, 0.65], [0.22, 0, 0.3], glow);
  group.visible = false;
  return group;
}

export function makePixelParticles(count: number, color: number, size = 0.06): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.8, sizeAttenuation: true }));
  return points;
}

export function makeVoxelPanel(width: number, height: number, color: number, grid = 4): THREE.Group {
  const group = new THREE.Group();
  box(group, [width, height, 0.08], [0, 0, 0], material(color, { metalness: 0.45, roughness: 0.5 }));
  const line = basic(0x5d8f99, { transparent: true, opacity: 0.48 });
  for (let i = 1; i < grid; i++) {
    box(group, [0.012, height, 0.095], [-width / 2 + (width * i) / grid, 0, 0.01], line);
    box(group, [width, 0.012, 0.095], [0, -height / 2 + (height * i) / grid, 0.01], line);
  }
  return group;
}

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
    else if (mesh.material) mesh.material.dispose();
  });
}

import * as THREE from "three";
import {
  buildVoxelGeometry,
  voxelMaterial,
  voxelModel,
  voxelSphere,
  type VoxelModelSpec,
} from "@agentbench/voxel-kit";

export const matte = voxelMaterial({ roughness: 0.94, metalness: 0.02 });
export const metal = voxelMaterial({ roughness: 0.55, metalness: 0.18 });
export const sunMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
export const atmoMat = voxelMaterial({
  transparent: true,
  opacity: 0.32,
  depthWrite: false,
  roughness: 1,
});

export function hash3(x: number, y: number, z: number): number {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function shade(hex: number, x: number, y: number, z: number, amount = 0.07): number {
  const k = 1 + (hash3(x, y, z) - 0.5) * 2 * amount;
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
}

export function block(
  parent: THREE.Object3D,
  size: [number, number, number],
  pos: [number, number, number],
  color: number,
  voxel = 0.22,
  material: THREE.Material = matte,
  vary = 0.06,
): THREE.Mesh {
  const [w, h, d] = size;
  const nx = Math.max(1, Math.round(w / voxel));
  const ny = Math.max(1, Math.round(h / voxel));
  const nz = Math.max(1, Math.round(d / voxel));
  const geo = buildVoxelGeometry(
    {
      size: [nx, ny, nz],
      at: (x, y, z) => shade(color, x + Math.round(pos[0] * 7), y, z + Math.round(pos[2] * 5), vary),
    },
    { voxel, anchor: "min" },
  );
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function pane(
  parent: THREE.Object3D,
  w: number,
  h: number,
  pos: [number, number, number],
  rotY = 0,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({
      color: 0xb7ccc4,
      transparent: true,
      opacity: 0.08,
      roughness: 0.08,
      metalness: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.y = rotY;
  parent.add(mesh);
  return mesh;
}

export function rockGeo(seed: number, radius = 3, voxel = 0.03): THREE.BufferGeometry {
  const palette = [0x5a5148, 0x7a6854, 0x3e4a44, 0x8a7058, 0x2c2926, 0x6a5344, 0x4d5a62];
  return voxelSphere(
    radius,
    (x, y, z, dist) => {
      const n = hash3(x + seed * 3, y, z + seed);
      if (dist > 0.72 && n > 0.82) return null;
      const pick = palette[(hash3(x, y + seed, z) * palette.length) | 0] ?? palette[0]!;
      return shade(pick, x, y, z + seed, 0.1);
    },
    { voxel },
  );
}

export function ironGeo(seed: number, radius = 3.1, voxel = 0.016): THREE.BufferGeometry {
  return voxelSphere(
    radius,
    (x, y, z) => {
      const stripe = Math.abs((x * 2 + y - z * 2 + seed * 3) % 5) <= 1;
      return shade(stripe ? 0xd2c2a4 : 0x3a3734, x + seed, y, z, stripe ? 0.05 : 0.07);
    },
    { voxel },
  );
}

export function heroIronGeo(): THREE.BufferGeometry {
  return voxelSphere(
    4.2,
    (x, y, z) => {
      const stripe = Math.abs((x + y * 2 - z) % 4) === 0;
      return shade(stripe ? 0xe0d0b0 : 0x2e2c2a, x, y, z, 0.06);
    },
    { voxel: 0.038 },
  );
}

export function earthGeo(): THREE.BufferGeometry {
  return voxelSphere(
    13,
    (x, y, z, dist) => {
      const nx = x / 13;
      const ny = y / 13;
      const nz = z / 13;
      const land =
        Math.sin(nx * 5.4 + 1.2) * Math.cos(nz * 4.6) +
        Math.sin(ny * 3.3 + nx * 2.4) +
        Math.cos(nz * 6.1 - ny * 2) * 0.6;
      if (ny > 0.62 || ny < -0.68) return shade(0xd5e4ee, x, y, z, 0.04);
      if (land > 0.55) return shade(0x3f6b46, x, y, z, 0.1);
      if (land > 0.22) return shade(0x6d5b3e, x, y, z, 0.08);
      if (land > 0.05 && dist < 0.9) return shade(0x2f6a4a, x, y, z, 0.08);
      return shade(dist > 0.86 ? 0x1d5684 : 0x143858, x, y, z, 0.05);
    },
    { voxel: 1.02 },
  );
}

export function cloudGeo(): THREE.BufferGeometry {
  return voxelSphere(
    14.15,
    (x, y, z, dist) => {
      if (dist < 0.9) return null;
      const n = Math.sin(x * 0.55) + Math.cos(z * 0.48 + y * 0.2) + Math.sin(y * 0.35 + x * 0.4);
      if (n < 1.25) return null;
      return shade(0xf3f7fb, x, y, z, 0.03);
    },
    { voxel: 1.02 },
  );
}

export function atmoGeo(): THREE.BufferGeometry {
  return voxelSphere(
    15.1,
    (x, y, z, dist) => {
      if (dist < 0.9) return null;
      const n = hash3(x, y, z);
      if (n > 0.42) return null;
      return 0x8ec0ea;
    },
    { voxel: 1.05 },
  );
}

export function sunGeo(): THREE.BufferGeometry {
  return voxelSphere(3.2, () => 0xffc56a, { voxel: 0.55 });
}

export function wheelGeo(): THREE.BufferGeometry {
  const span = 40;
  const radius = 16;
  const tube = 2;
  return buildVoxelGeometry(
    {
      size: [span, span, 7],
      at(x, y, z) {
        const dx = x + 0.5 - span / 2;
        const dy = y + 0.5 - span / 2;
        const dz = z + 0.5 - 3.5;
        const radial = Math.hypot(dx, dy);
        if (Math.hypot(radial - radius, dz) <= tube) {
          const panel = ((x + y) & 3) === 0;
          return panel ? 0x8b97a4 : 0xd5dce4;
        }
        const spoke =
          (Math.abs(dx) < 0.8 && radial < radius && radial > 3.2 && Math.abs(dz) < 0.8) ||
          (Math.abs(dy) < 0.8 && radial < radius && radial > 3.2 && Math.abs(dz) < 0.8);
        if (spoke) return 0x9aa6b2;
        if (radial < 2.4 && Math.abs(dz) < 1.6) return 0xc5ced6;
        return null;
      },
    },
    { voxel: 0.34, anchor: "center" },
  );
}

function model(spec: VoxelModelSpec): THREE.BufferGeometry {
  return voxelModel(spec);
}

export function pistolGeo(): THREE.BufferGeometry {
  const mid = [
    "    =======   ",
    "    =======   ",
    "    =====++   ",
    "     ####     ",
    "    t###      ",
    "     ###      ",
    "     ###      ",
    "      ##      ",
  ];
  const side = [
    "    =======   ",
    "    =======   ",
    "    =====++   ",
    "     ###      ",
    "     ###      ",
    "     ###      ",
    "     ##       ",
    "      #       ",
  ];
  const geo = model({
    palette: {
      "=": 0x3e4650,
      "+": 0xb7c0ca,
      "#": 0x2a2e33,
      t: 0x141618,
    },
    layers: [side, mid, side],
    axis: "x",
    voxel: 0.32,
  });
  geo.translate(0, 0.85, 0.35);
  return geo;
}

export function scopeGeo(): THREE.BufferGeometry {
  const ring = ["  ######  ", " ######## ", " ######## ", "  ######  "];
  const geo = model({
    palette: { "#": 0x2c3138 },
    layers: [ring, ring, ring],
    axis: "x",
    voxel: 0.28,
  });
  geo.translate(0, 0, 0.2);
  return geo;
}

export function gloveGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [4, 4, 5],
      at: (x, y, z) => {
        if (z > 3 && (x === 0 || x === 3 || y === 0 || y === 3)) return null;
        return z === 0 ? 0x8e979f : 0xd5d8d2;
      },
    },
    { voxel: 0.34, anchor: "center" },
  );
}

export function phoneGeo(): THREE.BufferGeometry {
  return model({
    palette: { "#": 0x1a1e24, "=": 0x163028, s: 0x8fd0a2 },
    axis: "z",
    voxel: 0.26,
    layers: [
      ["###", "===", "===", "=s=", "===", "###"],
      ["###", "===", "===", "===", "===", "###"],
    ],
  });
}

export function cupGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [4, 5, 4],
      at: (x, y, z) => {
        const rim = x === 0 || x === 3 || z === 0 || z === 3;
        if (!rim && y < 4) return null;
        if (!rim && y === 4) return 0xc4a070;
        return y > 2 ? 0xd8c4a4 : 0xe6d2b0;
      },
    },
    { voxel: 0.22, anchor: "center" },
  );
}

export function stoneHandGeo(): THREE.BufferGeometry {
  return voxelSphere(
    2.4,
    (x, y, z) => (Math.abs(x + y) % 3 === 0 ? 0xb7a88c : 0x4a453f),
    { voxel: 0.28 },
  );
}

export function magnifierGeo(): THREE.BufferGeometry {
  return model({
    palette: { "#": 0x8a929c, "=": 0x5c5348 },
    axis: "x",
    voxel: 0.28,
    layers: [
      [" #### ", "#    #", "# ## #", "#    #", " #### ", "  ==  ", "  ==  ", "  ==  "],
      [" #### ", "#    #", "# ## #", "#    #", " #### ", "  ==  ", "  ==  ", "  ==  "],
    ],
  });
}

export function knifeGeo(): THREE.BufferGeometry {
  return model({
    palette: { "#": 0xd5d8de, "=": 0x6a5438 },
    axis: "x",
    voxel: 0.24,
    layers: [
      [" # ", " # ", " # ", " # ", "=#=", " = "],
      [" # ", " # ", " # ", " # ", "=#=", " = "],
    ],
  });
}

export function cameraGeo(): THREE.BufferGeometry {
  return model({
    palette: { "#": 0x23272d, "+": 0x101318, "=": 0x3a4048 },
    axis: "z",
    voxel: 0.3,
    layers: [
      ["####", "#++#", "#++#", "####", " == "],
      ["####", "#++#", "#++#", "####", " == "],
    ],
  });
}

export function packGeo(): THREE.BufferGeometry {
  return model({
    palette: { "#": 0xd5dbe3, "=": 0x1b2740, "+": 0x8e99a4, o: 0x2a3038 },
    axis: "x",
    voxel: 0.58,
    layers: [
      [" ###### ", " #====# ", " #====# ", " ###### ", "  oooo  "],
      [" ###### ", " #++++# ", " #++++# ", " ###### ", "  oooo  "],
      [" ###### ", " ###### ", " ###### ", " ###### ", "        "],
    ],
  });
}

export function cylinderGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [4, 4, 8],
      at: (x, y, z) => {
        const dx = x - 1.5;
        const dy = y - 1.5;
        if (dx * dx + dy * dy > 2.4) return null;
        return z > 5 ? 0xcbb892 : 0x2a2826;
      },
    },
    { voxel: 0.012, anchor: "center" },
  );
}

export function roundGeo(tipped: boolean): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [3, 3, 7],
      at: (x, y, z) => {
        if (x === 2 || y === 2) return null;
        if (!tipped) return z > 4 ? 0x8a8478 : 0x5d6a48;
        return z > 4 ? 0x3a3632 : 0x5d6a48;
      },
    },
    { voxel: 0.014, anchor: "center" },
  );
}

export function beefGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [8, 5, 7],
      at: (x, y, z) => {
        const fat = hash3(x, y, z) > 0.78;
        return fat ? 0xead3c4 : 0x7a2430;
      },
    },
    { voxel: 0.032, anchor: "center" },
  );
}

export function crumbGeo(): THREE.BufferGeometry {
  return voxelSphere(2.1, (x, y, z) => shade(0x6a645c, x, y, z, 0.14), { voxel: 0.3 });
}

export function plumeGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [3, 4, 3],
      at: (x, y, z) => ((x + y + z) & 1) === 0 ? 0xf4f7fb : 0xd5e6f2,
    },
    { voxel: 0.4, anchor: "center" },
  );
}

export function labelTexture(lines: string[]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f0e2cc";
  ctx.font = "460 168px 'Noto Serif CJK SC', 'Noto Sans CJK SC', serif";
  ctx.fillText(lines[0] ?? "", 512, 230);
  if (lines[1]) {
    ctx.font = "400 42px 'Noto Sans CJK SC', 'Noto Serif CJK SC', sans-serif";
    ctx.fillStyle = "#cbb892";
    ctx.fillText(lines[1], 512, 360);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

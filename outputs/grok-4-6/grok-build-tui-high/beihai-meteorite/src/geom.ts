import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";

export function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export function noise3(x: number, y: number, z: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const k = Math.floor(z);
  const fx = x - i;
  const fy = y - j;
  const fz = z - k;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);
  const n000 = hash(i + j * 57 + k * 131);
  const n100 = hash(i + 1 + j * 57 + k * 131);
  const n010 = hash(i + (j + 1) * 57 + k * 131);
  const n110 = hash(i + 1 + (j + 1) * 57 + k * 131);
  const n001 = hash(i + j * 57 + (k + 1) * 131);
  const n101 = hash(i + 1 + j * 57 + (k + 1) * 131);
  const n011 = hash(i + (j + 1) * 57 + (k + 1) * 131);
  const n111 = hash(i + 1 + (j + 1) * 57 + (k + 1) * 131);
  const nx00 = n000 + (n100 - n000) * ux;
  const nx10 = n010 + (n110 - n010) * ux;
  const nx01 = n001 + (n101 - n001) * ux;
  const nx11 = n011 + (n111 - n011) * ux;
  const nxy0 = nx00 + (nx10 - nx00) * uy;
  const nxy1 = nx01 + (nx11 - nx01) * uy;
  return nxy0 + (nxy1 - nxy0) * uz;
}

export function voxelBox(
  w: number,
  h: number,
  d: number,
  colour: number | ((x: number, y: number, z: number) => number | null),
  options: { voxel?: number; anchor?: "center" | "min" } = {},
): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [w, h, d],
      at(x, y, z) {
        return typeof colour === "function" ? colour(x, y, z) : colour;
      },
    },
    options,
  );
}

export function meshOf(
  geometry: THREE.BufferGeometry,
  material?: THREE.Material,
): THREE.Mesh {
  return new THREE.Mesh(geometry, material ?? voxelMaterial({ roughness: 0.86, metalness: 0.04 }));
}

export function brickColour(x: number, y: number, z: number, base = 0x6a5344): number {
  const n = hash(x * 13 + y * 31 + z * 17);
  const c = new THREE.Color(base);
  c.offsetHSL(0, 0, (n - 0.5) * 0.12);
  if (y % 2 === 0 && x % 4 === 0) c.offsetHSL(0, 0, -0.05);
  return c.getHex();
}

export function woodColour(x: number, y: number, z: number, base = 0x5a3a24): number {
  const n = noise3(x * 0.35, y * 0.08, z * 0.35);
  const c = new THREE.Color(base);
  c.offsetHSL(0.02 * n, 0, (n - 0.5) * 0.16);
  return c.getHex();
}

export function makeStars(count = 1600): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 180 + hash(i * 3.1) * 220;
    const theta = hash(i * 7.7) * Math.PI * 2;
    const phi = Math.acos(2 * hash(i * 5.3) - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const t = hash(i * 9.1);
    const c = new THREE.Color().setHSL(0.08 + t * 0.12, 0.15, 0.55 + t * 0.4);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return points;
}

export function makeEarth(): THREE.Mesh {
  const geo = voxelSphere(
    14,
    (x, y, z, d) => {
      if (d > 0.98) return 0xd8e6ea;
      const nx = (x - 14) * 0.13;
      const ny = (y - 14) * 0.13;
      const nz = (z - 14) * 0.13;
      const n = noise3(nx + 8, ny, nz + 3);
      const n2 = noise3(nx * 2.2, ny * 2.2, nz * 2.2);
      if (Math.abs(ny) > 0.78) return 0xe8eef2;
      if (n > 0.55 + n2 * 0.08) {
        return n2 > 0.62 ? 0x6a7a48 : 0x3d6a46;
      }
      return n2 > 0.7 ? 0x2a5a78 : 0x1f4a72;
    },
    { voxel: 1.15 },
  );
  return meshOf(geo, voxelMaterial({ roughness: 0.78, metalness: 0.08 }));
}

export function makeSun(): THREE.Mesh {
  const geo = voxelSphere(5, (x, y, z, d) => {
    if (d > 0.86) return 0xffe7a0;
    return hash(x + y * 9 + z * 13) > 0.5 ? 0xffd56a : 0xfff1c0;
  }, { voxel: 0.55 });
  return new THREE.Mesh(
    geo,
    voxelMaterial({
      roughness: 0.4,
      metalness: 0,
      emissive: 0xffd27a,
      emissiveIntensity: 1.4,
    }),
  );
}

export function makeMeteorite(radius = 5, voxel = 0.08, seed = 1): THREE.Mesh {
  const geo = voxelSphere(
    radius,
    (x, y, z, d) => {
      const n = noise3(x * 0.4 + seed, y * 0.4, z * 0.4 + seed * 2);
      if (d + n * 0.22 > 1) return null;
      const stripe = Math.sin(x * 0.9 + y * 0.45 + seed) * Math.sin(z * 0.55);
      if (stripe > 0.25) return 0x8a7360;
      if (n > 0.62) return 0x3a2e28;
      return 0x5a4a40;
    },
    { voxel },
  );
  return meshOf(geo, voxelMaterial({ roughness: 0.42, metalness: 0.72 }));
}

export function makeStation(): THREE.Mesh {
  const span = 40;
  const geo = buildVoxelGeometry(
    {
      size: [span, 7, span],
      at(x, y, z) {
        const cx = x - span / 2 + 0.5;
        const cz = z - span / 2 + 0.5;
        const cy = y - 3.5;
        const r = Math.sqrt(cx * cx + cz * cz);
        const metal = hash(x * 2 + z * 5 + y) > 0.5 ? 0x8a93a0 : 0x6a7380;
        const dark = 0x3a424c;
        if (r < 3.2 && Math.abs(cy) < 2.6) return metal;
        if (Math.abs(cy) < 0.7 && r < 16 && (Math.abs(cx) < 1.1 || Math.abs(cz) < 1.1)) return dark;
        if (Math.abs(r - 16.2) < 1.7 && Math.abs(cy) < 2.4) {
          if (Math.abs(cy) > 1.2 && (Math.floor(x + z) % 3 === 0)) return 0xc9d6e0;
          return metal;
        }
        if (Math.abs(r - 16.2) < 2.4 && Math.abs(cy) < 1.1 && Math.abs(cz + 16) < 2.4 && cx * cx < 4) {
          return 0x9aa4b0;
        }
        return null;
      },
    },
    { voxel: 0.42, anchor: "center" },
  );
  return meshOf(geo, voxelMaterial({ roughness: 0.38, metalness: 0.55 }));
}

export function makeShipyard(): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [28, 16, 40],
      at(x, y, z) {
        const onBeam =
          (x % 7 === 0 && (y % 4 === 0 || z % 5 === 0)) ||
          (z % 8 === 0 && (x % 4 === 0 || y % 5 === 0)) ||
          (y === 0 && x % 3 === 0) ||
          (y === 15 && z % 3 === 0);
        if (!onBeam) return null;
        if (x > 2 && x < 26 && y > 2 && y < 14 && z > 4 && z < 36 && x % 7 !== 0 && z % 8 !== 0) return null;
        return hash(x + y * 8 + z) > 0.45 ? 0x6a7380 : 0x4a5560;
      },
    },
    { voxel: 0.55, anchor: "center" },
  );
  return meshOf(geo, voxelMaterial({ roughness: 0.5, metalness: 0.4 }));
}

export function makeBase(): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [12, 8, 12],
      at(x, y, z) {
        const cx = x - 6;
        const cz = z - 6;
        const r = Math.sqrt(cx * cx + cz * cz);
        if (y < 3 && r < 5.5) return 0x7a8490;
        if (y >= 3 && y < 6 && r < 3.2) return 0x5a6570;
        if (y >= 6 && r < 1.6) return 0x9aa6b0;
        return null;
      },
    },
    { voxel: 0.38, anchor: "center" },
  );
  return meshOf(geo, voxelMaterial({ roughness: 0.4, metalness: 0.5 }));
}

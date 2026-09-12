import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";

/**
 * 程序化体素道具与环境：岩石、陨石、子弹、手枪、机床、展柜、
 * 工作台、地球、太阳、黄河站巨轮、基地、星空与弹道特效。
 */

export function mat(color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, ...opts });
}

export function boxMesh(w: number, h: number, d: number, color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
  return mesh;
}

/** 确定性哈希，用于岩石与星球着色。 */
function hash3(x: number, y: number, z: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

function vnoise(x: number, y: number, z: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const c = (a: number, b: number, d: number) => hash3(a, b, d, seed);
  return (
    c(xi, yi, zi) * (1 - u) * (1 - v) * (1 - w) +
    c(xi + 1, yi, zi) * u * (1 - v) * (1 - w) +
    c(xi, yi + 1, zi) * (1 - u) * v * (1 - w) +
    c(xi + 1, yi + 1, zi) * u * v * (1 - w) +
    c(xi, yi, zi + 1) * (1 - u) * (1 - v) * w +
    c(xi + 1, yi, zi + 1) * u * (1 - v) * w +
    c(xi, yi + 1, zi + 1) * (1 - u) * v * w +
    c(xi + 1, yi + 1, zi + 1) * u * v * w
  );
}

function fbm(x: number, y: number, z: number, seed: number): number {
  let sum = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 4; i += 1) {
    sum += amp * vnoise(x * freq, y * freq, z * freq, seed + i * 17);
    amp *= 0.5;
    freq *= 2;
  }
  return sum;
}

/** 不规则陨石块。 */
export function voxelRock(sizeVox: number, seed: number, voxel = 0.06): THREE.Mesh {
  const span = Math.ceil(sizeVox);
  const c = span / 2;
  const geometry = buildVoxelGeometry(
    {
      size: [span, span, span],
      at(x, y, z) {
        const dx = (x + 0.5 - c) / c;
        const dy = (y + 0.5 - c) / c;
        const dz = (z + 0.5 - c) / c;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const bump = 0.82 + 0.22 * vnoise(x * 0.55, y * 0.55, z * 0.55, seed);
        if (r > bump) return null;
        const rust = hash3(x, y, z, seed + 5);
        if (rust > 0.86) return 0x6e3b26;
        if (rust > 0.72) return 0x4a4e52;
        return 0x2c2f33;
      },
    },
    { voxel, anchor: "center" },
  );
  const mesh = new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.7, metalness: 0.35 }));
  return mesh;
}

/** 圆柱体素（沿 Z 轴），用于陨石段与子弹。 */
export function voxelCylinder(radius: number, length: number, colour: number | ((x: number, y: number, z: number) => number), voxel = 0.05): THREE.Mesh {
  const span = Math.ceil(radius) * 2 + 1;
  const len = Math.ceil(length);
  const geometry = buildVoxelGeometry(
    {
      size: [span, span, len],
      at(x, y, z) {
        const dx = x + 0.5 - span / 2;
        const dy = y + 0.5 - span / 2;
        if (Math.sqrt(dx * dx + dy * dy) > radius) return null;
        return typeof colour === "function" ? colour(x, y, z) : colour;
      },
    },
    { voxel, anchor: "center" },
  );
  return new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
}

/** 星空。 */
export function stars(count: number, spread: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  const rand = (() => {
    let s = 1234567;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  })();
  for (let i = 0; i < count; i += 1) {
    // 均匀分布在球壳上，避免中心空洞。
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const rr = spread * (0.6 + rand() * 0.4);
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = rr * s * Math.cos(phi);
    positions[i * 3 + 1] = rr * u;
    positions[i * 3 + 2] = rr * s * Math.sin(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(220,230,255,0.8)");
  grad.addColorStop(1, "rgba(200,220,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const material = new THREE.PointsMaterial({
    size: 1.6,
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    color: 0xffffff,
  });
  const points = new THREE.Points(geo, material);
  points.renderOrder = -10;
  return points;
}

/** 体素地球：海洋、大陆、极地与云。 */
export function earthGeometry(radiusVox: number, voxel: number): THREE.BufferGeometry {
  return voxelSphere(
    radiusVox,
    (x, y, z, d) => {
      // 归一化到 [-1,1]。
      const nx = x / radiusVox - 1;
      const ny = y / radiusVox - 1;
      const nz = z / radiusVox - 1;
      const lat = Math.abs(ny);
      const cont = fbm(nx * 2.1, ny * 2.1, nz * 2.1, 3);
      const cloud = fbm(nx * 4.3 + 40, ny * 4.3, nz * 4.3, 7);
      const base = lat > 0.78 ? 0xeef2f6 : cont > 0.53 ? (cont > 0.62 ? 0x5d8a4e : 0x7ba05a) : lat > 0.5 ? 0x2e6d94 : 0x1d4f79;
      if (cloud > 0.62 && lat < 0.72) return 0xf2f5f7;
      return base;
    },
    { voxel, anchor: "center" },
  );
}

/** 体素环（在 XZ 平面内绕 Y 轴），用于黄河站巨轮。 */
export function voxelTorus(majorR: number, minorR: number, colour: number | ((x: number, y: number, z: number) => number), voxel = 0.5): THREE.BufferGeometry {
  const span = Math.ceil(majorR + minorR) * 2 + 1;
  const c = span / 2;
  return buildVoxelGeometry(
    {
      size: [span, span, span],
      at(x, y, z) {
        const dx = x + 0.5 - c;
        const dy = y + 0.5 - c;
        const dz = z + 0.5 - c;
        const r = Math.sqrt(dx * dx + dz * dz);
        const tube = Math.sqrt((r - majorR) * (r - majorR) + dy * dy);
        if (tube > minorR) return null;
        return typeof colour === "function" ? colour(x, y, z) : colour;
      },
    },
    { voxel, anchor: "center" },
  );
}

/** 枪口火光：发光的体素小星。 */
export function muzzleFlash(): THREE.Group {
  const g = new THREE.Group();
  const core = voxelSphere(2.2, (x, y, z, d) => {
    if (d > 0.75) return 0xffd27a;
    if (d > 0.4) return 0xfff2c0;
    return 0xffffff;
  }, { voxel: 0.03 });
  const m = new THREE.Mesh(core, voxelMaterial({ emissive: 0xffa640, emissiveIntensity: 2.4, roughness: 0.4 }));
  g.add(m);
  const light = new THREE.PointLight(0xffb45e, 0, 8, 2);
  g.add(light);
  g.name = "muzzle-flash";
  return g;
}

/** 手枪道具（枪管沿 +Z，握把在原点附近；世界单位米）。 */
export function pistolProp(): THREE.Group {
  const voxel = 0.017;
  const w = 15;
  const h = 8;
  const cells: Array<[number, number, number, number, string]> = [
    [4, 0, 12, 1, "B"],
    [5, 0, 6, 0, "S"],
    [3, 1, 14, 2, "B"],
    [2, 2, 13, 2, "S"],
    [3, 3, 6, 7, "G"],
  ];
  const g0: string[][] = Array.from({ length: h }, () => Array.from({ length: w }, () => "."));
  for (const [x0, y0, x1, y1, ch] of cells) {
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        if (x >= 0 && x < w && y >= 0 && y < h) g0[y]![x] = ch;
      }
    }
  }
  const layers = [g0.map((r) => r.join("")), g0.map((r) => r.join("")), g0.map((r) => r.join(""))];
  const geometry = buildVoxelGeometry(
    {
      size: [3, h, w],
      at(x, y, z) {
        const row = h - 1 - y;
        const ch = g0[row]![z]!;
        if (ch === ".") return null;
        if (ch === "B") return 0x24282e;
        if (ch === "S") return 0x3a4048;
        return 0x4a3524;
      },
    },
    { voxel, anchor: "center" },
  );
  const mesh = new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.5, metalness: 0.5 }));
  const group = new THREE.Group();
  // 让握把中心落在原点：握把约在 cols3..6（中心 4.5）、rows3..7（中心 5）。
  mesh.position.set(0, 1.5 * voxel, 2.5 * voxel);
  group.add(mesh);
  group.name = "pistol";
  return group;
}

/** 简易展柜（带玻璃与内部灯光）。 */
export function cabinet(w: number, h: number, d: number): THREE.Group {
  const g = new THREE.Group();
  const wood = 0x5a3c28;
  const frame = boxMesh(w, h, d, wood, { roughness: 0.9 });
  frame.position.y = h / 2;
  g.add(frame);
  // 玻璃前脸（略薄的体素板，用 box 表示）。
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.96, h * 0.96, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xbfd4e0, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.28 }),
  );
  glass.position.set(0, h / 2, d / 2 + 0.02);
  g.add(glass);
  const light = new THREE.PointLight(0xcfe0ea, 26, w * 2.4, 1.5);
  light.position.set(0, h / 2, d * 0.3);
  g.add(light);
  return g;
}

/** 展示台。 */
export function pedestal(color = 0x3c3832): THREE.Group {
  const g = new THREE.Group();
  const top = boxMesh(0.5, 0.1, 0.5, color);
  top.position.y = 1.0;
  const post = boxMesh(0.2, 1.0, 0.2, color);
  post.position.y = 0.5;
  const base = boxMesh(0.42, 0.1, 0.42, color);
  base.position.y = 0.05;
  g.add(top, post, base);
  return g;
}

/** 显微镜。 */
export function microscope(): THREE.Group {
  const g = new THREE.Group();
  const base = boxMesh(0.34, 0.06, 0.26, 0x2a2d31);
  base.position.y = 0.03;
  const arm = boxMesh(0.08, 0.34, 0.08, 0x2a2d31);
  arm.position.y = 0.23;
  const head = boxMesh(0.12, 0.12, 0.18, 0x3a4048);
  head.position.y = 0.44;
  head.position.z = -0.04;
  const tube = boxMesh(0.08, 0.16, 0.08, 0x2a2d31);
  tube.position.y = 0.2;
  tube.position.z = -0.06;
  g.add(base, arm, head, tube);
  return g;
}

/** 工作台。 */
export function workbench(w: number, h: number, d: number, topColor = 0x6b5740): THREE.Group {
  const g = new THREE.Group();
  const top = boxMesh(w, 0.08, d, topColor, { roughness: 0.85 });
  top.position.y = h;
  for (const sx of [-1, 1]) {
    const leg = boxMesh(0.14, h, 0.14, 0x3a332c);
    leg.position.set(sx * (w / 2 - 0.12), h / 2, 0);
    g.add(leg);
  }
  g.add(top);
  return g;
}

/** 数控车床。 */
export function lathe(): THREE.Group {
  const g = new THREE.Group();
  const bodyColor = 0x3f4a55;
  const body = boxMesh(2.6, 1.0, 0.9, bodyColor, { roughness: 0.6, metalness: 0.2 });
  body.position.y = 0.5;
  const panel = boxMesh(0.5, 0.3, 0.06, 0x1e242a);
  panel.position.set(0.6, 1.06, 0.46);
  const headstock = boxMesh(0.7, 0.7, 0.7, 0x2e353d);
  headstock.position.set(-0.95, 1.15, 0);
  const chuck = new THREE.Group();
  const chuckBody = boxMesh(0.34, 0.34, 0.34, 0x22262b, { metalness: 0.5, roughness: 0.4 });
  chuckBody.position.z = 0.34;
  chuck.add(chuckBody);
  chuck.position.set(-0.5, 1.15, 0);
  const tailstock = boxMesh(0.3, 0.6, 0.4, 0x2e353d);
  tailstock.position.set(0.9, 0.9, 0);
  g.add(body, panel, headstock, chuck, tailstock);
  return g;
}

/** 门。 */
export function doorFrame(color = 0x4a3728): THREE.Group {
  const g = new THREE.Group();
  const door = boxMesh(1.6, 2.6, 0.12, color, { roughness: 0.9 });
  door.position.y = 1.3;
  const knob = boxMesh(0.08, 0.16, 0.08, 0xc9a94c, { metalness: 0.6, roughness: 0.35 });
  knob.position.set(0.6, 1.3, 0.1);
  g.add(door, knob);
  return g;
}

/** 牛肉靶：包在航天服布料夹层里的生牛肉块。 */
export function beefTarget(): THREE.Group {
  const g = new THREE.Group();
  const bundle = boxMesh(0.5, 0.5, 0.42, 0xb9c0c8, { roughness: 0.9 });
  bundle.position.y = 0.9;
  const strap1 = boxMesh(0.54, 0.08, 0.46, 0x7d8791);
  strap1.position.y = 0.78;
  const strap2 = boxMesh(0.54, 0.08, 0.46, 0x7d8791);
  strap2.position.y = 1.02;
  const stand = boxMesh(0.08, 0.9, 0.08, 0x2c2f33);
  stand.position.y = 0.45;
  const base = boxMesh(0.4, 0.06, 0.4, 0x2c2f33);
  base.position.y = 0.03;
  g.add(bundle, strap1, strap2, stand, base);
  return g;
}

/** 悬挂灯泡。 */
export function bulb(color = 0xffd9a0, intensity = 3): THREE.Group {
  const g = new THREE.Group();
  const shade = boxMesh(0.24, 0.18, 0.24, 0x7d4a2c);
  const glass = boxMesh(0.16, 0.12, 0.16, 0xfff0cf, { emissive: 0xffc97a, emissiveIntensity: 1.2 });
  glass.position.y = -0.12;
  const light = new THREE.PointLight(color, intensity, 9, 1.5);
  light.position.y = -0.2;
  g.add(shade, glass, light);
  return g;
}

/** 小行星 / 太空碎片。 */
export function spaceDebris(seed: number): THREE.Mesh {
  return voxelRock(2 + (seed % 3), seed, 0.16);
}

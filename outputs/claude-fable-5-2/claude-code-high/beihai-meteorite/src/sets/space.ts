import * as THREE from "three";
import { voxelSphere, voxelMaterial } from "@agentbench/voxel-kit";
import { Vox } from "../lib/vox";
import { CubeFX, makeGlow, ringTexture } from "../lib/fx";
import { clamp, fbm3, hash1, hash3, jit, lerp, mixHex, mulberry, sstep, type V3 } from "../lib/util";
import { slugGeometry, slugMaterial } from "../cast/props";

/**
 * Geostationary orbit. Zhang Beihai floats at the origin facing +Z, toward the
 * Yellow River station five (stage-scaled) kilometres away; the Earth and the
 * setting sun are behind him. The sky (stars, Earth, sun) is carried with the
 * camera so it behaves as if at infinity.
 */

const EARTH_DIST = 3200;
const EARTH_R = 672;
const SUN_DIST = 4200;

const dE = new THREE.Vector3(-0.27, -0.2, -0.94).normalize();
// Direction on the sky, perpendicular to dE, toward the limb where the sun sets.
const limbUp = (() => {
  const u = new THREE.Vector3(0.62, 0.78, 0);
  return u.sub(dE.clone().multiplyScalar(u.dot(dE))).normalize();
})();
// The Earth is lit for the picture, not for the almanac: a broad warm terminator.
const earthSun = limbUp.clone().multiplyScalar(0.9).add(dE.clone().multiplyScalar(-0.5)).normalize();

export const SPACE = {
  dE,
  limbUp,
  hatch: [-8, -3, 888] as V3,
  wheelCentre: [-95, 80, 900] as V3,
  group: [0, 0, 850] as V3,
  photographer: [3.4, -2.7, 838.5] as V3,
  /** Formation slot for crew member i (three rows of ten, facing -Z). */
  slot(i: number): V3 {
    const row = Math.floor(i / 10), col = i % 10;
    return [(col - 4.5) * 1.55 + (row === 1 ? 0.3 : 0), -1.0 + row * 1.38, 850 + row * 1.5];
  },
  /** Unit direction of the sun on the sky for sunset progress k (0 high, 1 gone). */
  sunDir(k: number, out = new THREE.Vector3()): THREE.Vector3 {
    const theta = THREE.MathUtils.degToRad(14.9 - k * 4.9);
    return out.copy(dE).multiplyScalar(Math.cos(theta)).addScaledVector(limbUp, Math.sin(theta)).normalize();
  },
  /** Where Base One hangs: a point of light he must get back to. */
  baseDir: new THREE.Vector3(0.52, 0.3, -0.8).normalize(),
};

export interface SpaceSet {
  group: THREE.Group;
  sky: THREE.Group;
  earthMat: THREE.MeshBasicMaterial;
  sunLight: THREE.DirectionalLight;
  earthLight: THREE.DirectionalLight;
  frontFill: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;
  hatchDoor: THREE.Mesh;
  lamp: THREE.MeshBasicMaterial;
  lampGlow: THREE.Sprite;
  airlockGlow: THREE.Sprite;
  muzzle: THREE.PointLight;
  muzzleGlow: THREE.Sprite;
  slugs: THREE.InstancedMesh;
  gas: CubeFX;
  puffs: CubeFX;
  blood: CubeFX;
  flash: CubeFX;
  baseGlow: THREE.Sprite;
  /** Carry the sky with the camera and set the sunset state. Call once per frame. */
  update(camera: THREE.Camera, sunK: number, time: number): void;
  /** Aim the sun's shadow frustum at a region of interest. */
  focusShadow(centre: V3, radius: number): void;
}

function buildEarth(): THREE.Mesh {
  const R = 46;
  const span = Math.ceil(R) * 2, c = span / 2;
  const s = earthSun;
  const geometry = voxelSphere(R, (x, y, z, dist) => {
    if (dist < 0.9) return 0x05070c;
    const dx = x + 0.5 - c, dy = y + 0.5 - c, dz = z + 0.5 - c;
    const l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    const nx = dx / l, ny = dy / l, nz = dz / l;
    const cloud = fbm3(nx * 3.1 + 7.3, ny * 5.2 + 1.1, nz * 3.1 + 4.2, 4) + Math.sin(ny * 9 + nx * 3) * 0.03;
    const isCloudLayer = dist > 0.958;
    if (isCloudLayer && cloud < 0.57) return null;
    const L = nx * s.x + ny * s.y + nz * s.z;
    const day = sstep((L + 0.12) / 0.55);
    const warm = Math.exp(-Math.pow((L - 0.12) / 0.3, 2));
    const grain = hash3(x, y, z);
    let dayC: number, duskC: number, nightC: number;
    if (isCloudLayer || cloud > 0.62) {
      dayC = 0xe6ebf2; duskC = 0xf0a39a; nightC = 0x141a2a;
    } else {
      const land = fbm3(nx * 2.1 + 3.7, ny * 2.1 + 9.1, nz * 2.1 + 5.5, 4) + Math.abs(ny) * 0.02;
      if (Math.abs(ny) > 0.9) {
        dayC = 0xdfe8f0; duskC = 0xf2b8a8; nightC = 0x121826;
      } else if (land > 0.54) {
        const dry = fbm3(nx * 5 + 1, ny * 5 + 2, nz * 5 + 3, 2);
        dayC = dry > 0.5 ? 0x8a7448 : 0x3d6a3a; duskC = 0xa85c34; nightC = grain > 0.94 ? 0xffc46a : 0x06070b;
      } else {
        dayC = mixHex(0x16438c, 0x1f5aa6, land * 1.6); duskC = 0xe0702c; nightC = 0x04070f;
      }
    }
    let col = mixHex(nightC, dayC, day);
    col = mixHex(col, duskC, warm * 0.78 * (0.35 + 0.65 * day));
    return jit(col, x, y, z, 0.05);
  });
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(EARTH_R / R);
  mesh.position.copy(dE).multiplyScalar(EARTH_DIST);
  mesh.frustumCulled = false;
  return mesh;
}

function buildStars(): THREE.Points {
  const rng = mulberry(4242);
  const n = 2600;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rng() * 2 - 1, a = rng() * Math.PI * 2, r = Math.sqrt(1 - u * u);
    pos[i * 3] = Math.cos(a) * r * 5200; pos[i * 3 + 1] = u * 5200; pos[i * 3 + 2] = Math.sin(a) * r * 5200;
    const b = Math.pow(rng(), 3.2) * 0.9 + 0.1, tint = rng();
    col[i * 3] = b * (tint > 0.8 ? 1 : 0.86); col[i * 3 + 1] = b * 0.9; col[i * 3 + 2] = b * (tint < 0.25 ? 1 : 0.88);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const points = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.8, sizeAttenuation: false, vertexColors: true, fog: false, depthWrite: false }));
  points.frustumCulled = false;
  return points;
}

function buildStation(group: THREE.Group): { hatchDoor: THREE.Mesh; lamp: THREE.MeshBasicMaterial; lampGlow: THREE.Sprite; airlockGlow: THREE.Sprite } {
  const [cx, cy] = [SPACE.wheelCentre[0], SPACE.wheelCentre[1]];
  const hull = voxelMaterial({ roughness: 0.85, metalness: 0.1 });
  const lumeMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false });

  // Coarse wheel: ring, spokes, hub. 3 m voxels.
  const V = 3, N = 100;
  const wheel = new Vox(N, N, 14), wheelLume = new Vox(N, N, 14);
  wheel.each((x, y, z) => {
    const dx = (x + 0.5 - N / 2) * V, dy = (y + 0.5 - N / 2) * V;
    const r = Math.sqrt(dx * dx + dy * dy);
    const ang = Math.atan2(dy, dx);
    const inRing = r > 109 && r < 139 && z >= 2 && z < 11;
    const inHub = r < 24;
    const spoke = r < 112 && (Math.abs(dx) < 4.6 || Math.abs(dy) < 4.6) && z >= 4 && z < 9;
    if (!inRing && !inHub && !spoke) return null;
    let c = 0xb4b8bf;
    if (inRing) {
      const seg = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 24);
      c = seg % 2 === 0 ? 0xb9bdc4 : 0xa9adb5;
      if (r > 133 || r < 115) c = 0x8f949c;
      if (seg % 6 === 0 && r > 119 && r < 129) c = 0x6f7681;
    } else if (inHub) c = r < 9 ? 0x5d636d : 0x9fa4ac;
    else c = 0x8a8f98;
    return jit(c, x, y, z, 0.05);
  });
  wheelLume.each((x, y, z) => {
    if (z !== 2) return undefined;
    const dx = (x + 0.5 - N / 2) * V, dy = (y + 0.5 - N / 2) * V;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r > 121 && r < 127 && hash3(x, y, 3) > 0.62) return hash3(x, y, 8) > 0.5 ? 0xffd9a0 : 0xbfe0ff;
    return undefined;
  });
  wheel.each((x, y, z, cur) => (cur !== null && wheelLume.get(x, y, z) !== null ? null : undefined));
  const wheelMesh = wheel.mesh(V, { anchor: "center", material: hull, shadow: false });
  wheelMesh.position.set(cx, cy, 888.2 - 6 + 21);
  group.add(wheelMesh);
  const wl = new THREE.Mesh(wheelLume.geometry(V, "center"), lumeMat);
  wl.position.copy(wheelMesh.position);
  group.add(wl);

  // Fine hull around the hatch: 0.5 m voxels following the same ring.
  const F = 0.25, W = 336, H = 240;
  const [hx, hy] = [SPACE.hatch[0], SPACE.hatch[1]];
  const patch = new Vox(W, H, 4), patchLume = new Vox(W, H, 4);
  patch.each((x, y, z) => {
    const px = (x + 0.5 - W / 2) * F, py = (y + 0.5 - H / 2) * F; // relative to the hatch
    const dx = px + hx - cx, dy = py + hy - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r < 109 || r > 139) return null;
    const hr = Math.sqrt(px * px + py * py);
    if (hr < 1.5) return null;
    if (hr < 2.0) return z === 0 ? (Math.floor(Math.atan2(py, px) * 2.6 + 12) % 2 === 0 ? 0xd9a520 : 0x2a2c30) : 0x4a4e57;
    if (z > 0) return 0x7d828b;
    const ang = Math.atan2(dy, dx);
    const u = (ang * 124) / 3, w = r / 3;
    const seam = Math.abs(u - Math.round(u)) < 0.045 || Math.abs(w - Math.round(w)) < 0.045;
    if (seam) return 0x6c717a;
    const plate = hash3(Math.round(u), Math.round(w), 2);
    let c = plate > 0.8 ? 0x9da2aa : plate < 0.15 ? 0xc6c9ce : 0xb3b7be;
    if (r > 136.5 || r < 111.5) c = 0x8a8f98;
    // Handrails either side of the hatch.
    if ((Math.abs(px) > 2.5 && Math.abs(px) < 2.8 && Math.abs(py) < 1.9) || (Math.abs(py + 2.7) < 0.14 && Math.abs(px) < 1.9)) c = 0xe0c040;
    return jit(c, x >> 1, y >> 1, z, 0.03);
  });
  patchLume.each((x, y, z) => {
    if (z !== 0) return undefined;
    const px = (x + 0.5 - W / 2) * F, py = (y + 0.5 - H / 2) * F;
    const dx = px + hx - cx, dy = py + hy - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const ang = Math.atan2(dy, dx);
    const u = (ang * 124) / 6;
    const cell = Math.floor(u);
    const inSlot = r > 121.8 && r < 124.2 && u - cell > 0.25 && u - cell < 0.75;
    if (inSlot && hash1(cell * 3.1) > 0.45 && Math.sqrt(px * px + py * py) > 6) return hash1(cell) > 0.5 ? 0xffd9a0 : 0xcfe6ff;
    return undefined;
  });
  // Lume cells replace hull cells so the two meshes never z-fight.
  patch.each((x, y, z, cur) => (cur !== null && patchLume.get(x, y, z) !== null ? null : undefined));
  // (patch voxels behind a removed front cell still close the hull)
  const patchMesh = patch.mesh(F, { anchor: "center", material: hull, shadow: false });
  patchMesh.position.set(hx, hy, 887.5);
  group.add(patchMesh);
  const pl = new THREE.Mesh(patchLume.geometry(F, "center"), lumeMat);
  pl.position.copy(patchMesh.position);
  group.add(pl);

  // Airlock interior, door, status lamp.
  const lock = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.4, 5), new THREE.MeshBasicMaterial({ color: 0x06070a, side: THREE.BackSide }));
  lock.position.set(hx, hy, 890.6);
  group.add(lock);
  const airlockGlow = makeGlow(0xffb060, 4.5, 0.5);
  airlockGlow.position.set(hx, hy, 889.2);
  group.add(airlockGlow);
  const door = new Vox(15, 15, 1);
  door.each((x, y) => {
    const dx = x - 7, dy = y - 7;
    if (dx * dx + dy * dy > 50) return null;
    if (dy % 4 === 0) return 0x70757e;
    return jit(0x9499a1, x, y, 0, 0.05);
  });
  const hatchDoor = door.mesh(F, { anchor: "center", material: hull });
  hatchDoor.position.set(hx, hy, 887.6);
  group.add(hatchDoor);
  const lamp = new THREE.MeshBasicMaterial({ color: 0xff2a1a });
  const lampMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.3), lamp);
  lampMesh.position.set(hx, hy + 2.7, 886.8);
  group.add(lampMesh);
  const lampGlow = makeGlow(0xff2a1a, 3.6, 0.9);
  lampGlow.position.set(hx, hy + 2.7, 886.5);
  group.add(lampGlow);

  // The elevator tether: from the hub down toward the Earth.
  const tether = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 3600), new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.9, emissive: 0x20242c }));
  const hub = new THREE.Vector3(cx, cy, 909);
  tether.position.copy(hub).addScaledVector(dE, 1800);
  tether.lookAt(hub.clone().addScaledVector(dE, 4000));
  group.add(tether);
  const car = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 12), new THREE.MeshStandardMaterial({ color: 0xb4b8bf, roughness: 0.9 }));
  car.position.copy(hub).addScaledVector(dE, 260);
  car.quaternion.copy(tether.quaternion);
  group.add(car);
  const carGlow = makeGlow(0xffe2b0, 18, 0.8);
  carGlow.position.copy(car.position);
  group.add(carGlow);

  return { hatchDoor, lamp, lampGlow, airlockGlow };
}

function buildOutposts(group: THREE.Group): THREE.Sprite {
  const hull = voxelMaterial({ roughness: 0.9 });
  // The dock: for now only a scaffold, like the skeleton of some huge animal.
  const dock = new Vox(40, 14, 14);
  dock.each((x, y, z) => {
    const ex = x % 13 === 0, ey = y % 13 === 0, ez = z % 13 === 0;
    const edges = (ex ? 1 : 0) + (ey ? 1 : 0) + (ez ? 1 : 0);
    if (edges < 2) return null;
    if (x > 27 && y > 6 && hash3(x, y, z) > 0.4) return null; // unfinished end
    return jit(0x8d8f93, x, y, z, 0.1);
  });
  const dockMesh = dock.mesh(11, { anchor: "center", material: hull, shadow: false });
  dockMesh.position.set(620, 300, 1500);
  dockMesh.rotation.set(0.3, 0.7, 0.15);
  group.add(dockMesh);
  for (let i = 0; i < 4; i++) {
    const b = makeGlow(0xff3a2a, 26, 0.9);
    b.position.set(620 + (i - 1.5) * 110, 300 + (i % 2) * 60, 1500 + (i - 1.5) * 60);
    group.add(b);
  }
  // Scattered small stations: tents on a prairie.
  const rng = mulberry(91);
  for (let i = 0; i < 7; i++) {
    const v = new Vox(6, 3, 3);
    v.box(1, 1, 1, 5, 2, 2, 0xa9adb5).box(0, 1, 1, 6, 2, 2, (x) => (x === 0 || x === 5 ? 0x33507a : 0xa9adb5)).box(2, 0, 0, 4, 3, 3, 0xbfc3ca);
    const m = v.mesh(8 + rng() * 6, { anchor: "center", material: hull, shadow: false });
    const a = rng() * Math.PI * 2;
    m.position.set(Math.cos(a) * (900 + rng() * 900), (rng() - 0.5) * 700, 600 + rng() * 1500);
    m.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    group.add(m);
    const gl = makeGlow(rng() > 0.5 ? 0xffe0b0 : 0xbfe0ff, 30, 0.7);
    gl.position.copy(m.position);
    group.add(gl);
  }
  // Base One: eighty kilometres off, a dot with almost no shape.
  const baseGlow = makeGlow(0xcfe2ff, 26, 0.9);
  baseGlow.position.copy(SPACE.baseDir).multiplyScalar(2600);
  group.add(baseGlow);
  return baseGlow;
}

export function buildSpace(): SpaceSet {
  const group = new THREE.Group();
  group.name = "set:space";
  const sky = new THREE.Group();
  group.add(sky);

  sky.add(buildStars());
  const earth = buildEarth();
  sky.add(earth);
  const earthMat = earth.material as THREE.MeshBasicMaterial;

  // Atmosphere: a thin ring of scattered light hugging the limb.
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: ringTexture(), color: 0x4f8dff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  }));
  atmo.position.copy(earth.position);
  atmo.scale.setScalar((EARTH_R * 2) / 0.9);
  sky.add(atmo);

  // Sun: a hot voxel disc with two layers of glow, all depth-tested so the Earth eats it.
  const sunMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5.2, 3.8), fog: false });
  const sun = new THREE.Mesh(voxelSphere(5, 0xffffff), sunMat);
  sun.scale.setScalar(64 / 5);
  sky.add(sun);
  const sunGlowA = makeGlow(0xfff0cc, 900, 1);
  const sunGlowB = makeGlow(0xff9a4a, 3000, 0.35);
  const limbGlow = makeGlow(0xff7a30, 700, 0, true);
  sky.add(sunGlowA, sunGlowB, limbGlow);

  const sunLight = new THREE.DirectionalLight(0xfff0dc, 3.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.bias = -0.0015;
  sunLight.shadow.normalBias = 0.04;
  group.add(sunLight, sunLight.target);
  const earthLight = new THREE.DirectionalLight(0x4a6cb0, 0.55);
  group.add(earthLight, earthLight.target);
  const frontFill = new THREE.DirectionalLight(0x8f9bc0, 0.3);
  group.add(frontFill, frontFill.target);
  const ambient = new THREE.AmbientLight(0x30384c, 0.35);
  group.add(ambient);

  const station = buildStation(group);
  const baseGlow = buildOutposts(group);

  // Drifting construction debris around the watcher.
  const rng = mulberry(17);
  const debrisN = 46;
  const debris = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.9 }), debrisN);
  const dParams: Array<{ p: THREE.Vector3; s: THREE.Vector3; a: THREE.Vector3; w: THREE.Vector3 }> = [];
  const col = new THREE.Color();
  for (let i = 0; i < debrisN; i++) {
    const far = i > 9;
    const dir = new THREE.Vector3(rng() - 0.5, (rng() - 0.5) * 0.7, rng() - 0.3).normalize();
    const dist = far ? 60 + rng() * 420 : 14 + rng() * 26;
    const beam = rng() > 0.5;
    dParams.push({
      p: dir.multiplyScalar(dist),
      s: beam ? new THREE.Vector3(0.25 + rng() * 0.3, 0.25 + rng() * 0.3, 2 + rng() * 6) : new THREE.Vector3(1 + rng() * 2.5, 0.12, 1 + rng() * 2),
      a: new THREE.Vector3(rng() * 6, rng() * 6, rng() * 6),
      w: new THREE.Vector3((rng() - 0.5) * 0.12, (rng() - 0.5) * 0.12, (rng() - 0.5) * 0.12),
    });
    debris.setColorAt(i, col.setHex([0x9aa0a8, 0x7d828b, 0xb9a060, 0x5f646d][i % 4]!));
  }
  debris.frustumCulled = false;
  group.add(debris);

  const slugs = new THREE.InstancedMesh(slugGeometry(0.05, 3), slugMaterial(), 30);
  slugs.frustumCulled = false;
  slugs.count = 0;
  group.add(slugs);

  const gas = new CubeFX(700, { opacity: 0.38 });
  const puffs = new CubeFX(520, { opacity: 0.4 });
  const blood = new CubeFX(220);
  const flash = new CubeFX(40, { additive: true });
  group.add(gas.mesh, puffs.mesh, blood.mesh, flash.mesh);
  const muzzle = new THREE.PointLight(0xffd9a0, 0, 12, 1.6);
  group.add(muzzle);
  const muzzleGlow = makeGlow(0xffe2b0, 1.6, 0);
  group.add(muzzleGlow);

  const dummy = new THREE.Object3D();
  const sunDir = new THREE.Vector3();
  const tmp = new THREE.Color();

  const update = (camera: THREE.Camera, k: number, time: number): void => {
    sky.position.copy(camera.position);
    SPACE.sunDir(k, sunDir);
    sun.position.copy(sunDir).multiplyScalar(SUN_DIST);
    sunGlowA.position.copy(sun.position);
    sunGlowB.position.copy(sun.position);
    // 0 while the disc is clear of the limb, 1 once it is gone.
    const sink = clamp((k - 0.38) / 0.4);
    const gone = clamp((k - 0.78) / 0.22);
    (sunGlowA.material as THREE.SpriteMaterial).opacity = lerp(1, 0.55, sink) * (1 - gone);
    (sunGlowA.material as THREE.SpriteMaterial).color.setHex(mixHex(0xfff0cc, 0xff9a50, sink));
    sunGlowA.scale.setScalar(lerp(900, 620, sink));
    (sunGlowB.material as THREE.SpriteMaterial).opacity = lerp(0.3, 0.5, sink) * (1 - gone * 0.92);
    (sunGlowB.material as THREE.SpriteMaterial).color.setHex(mixHex(0xffa860, 0xff5a20, sink));
    sunMat.color.setRGB(lerp(6, 5, sink), lerp(5.2, 2.6, sink), lerp(3.8, 0.9, sink));
    // Limb fire where the disc goes under.
    limbGlow.position.copy(dE).multiplyScalar(Math.cos(0.2135)).addScaledVector(limbUp, Math.sin(0.2135)).multiplyScalar(3100);
    (limbGlow.material as THREE.SpriteMaterial).opacity = sstep(sink) * 0.55 * (1 - gone * 0.85);
    limbGlow.scale.setScalar(lerp(500, 1100, sink));
    // The planet itself cools as the light leaves it.
    tmp.setRGB(lerp(1, 0.42, sstep(sink)) * (1 - gone * 0.8), lerp(1, 0.44, sstep(sink)) * (1 - gone * 0.76), lerp(1, 0.6, sstep(sink)) * (1 - gone * 0.6));
    earthMat.color.copy(tmp);
    (atmo.material as THREE.SpriteMaterial).opacity = lerp(0.85, 0.5, gone);
    (atmo.material as THREE.SpriteMaterial).color.setHex(mixHex(0x4f8dff, 0x2f55c0, gone));

    sunLight.color.setHex(mixHex(mixHex(0xfff0dc, 0xffa660, sstep(sink)), 0xff5a30, gone));
    sunLight.intensity = lerp(3.3, 2.1, sink) * (1 - gone) + 0.02;
    earthLight.intensity = lerp(0.6, 0.42, gone);
    ambient.intensity = lerp(0.35, 0.28, gone);

    for (let i = 0; i < debrisN; i++) {
      const d = dParams[i]!;
      dummy.position.copy(d.p).addScaledVector(d.w, time * 2);
      dummy.rotation.set(d.a.x + d.w.x * time, d.a.y + d.w.y * time, d.a.z + d.w.z * time);
      dummy.scale.copy(d.s);
      dummy.updateMatrix();
      debris.setMatrixAt(i, dummy.matrix);
    }
    debris.instanceMatrix.needsUpdate = true;
    (baseGlow.material as THREE.SpriteMaterial).opacity = 0.75 + Math.sin(time * 2.2) * 0.2;
  };

  const focusShadow = (centre: V3, radius: number): void => {
    SPACE.sunDir(0.5, sunDir);
    sunLight.target.position.set(centre[0], centre[1], centre[2]);
    sunLight.position.set(centre[0], centre[1], centre[2]).addScaledVector(sunLight.userData.dir ?? sunDir, radius * 3);
    const cam = sunLight.shadow.camera;
    cam.left = -radius; cam.right = radius; cam.top = radius; cam.bottom = -radius;
    cam.near = radius * 0.5; cam.far = radius * 6.5;
    cam.updateProjectionMatrix();
    earthLight.target.position.copy(sunLight.target.position);
    earthLight.position.copy(sunLight.target.position).addScaledVector(dE, 100);
    frontFill.target.position.copy(sunLight.target.position);
    frontFill.position.copy(sunLight.target.position).add(new THREE.Vector3(30, 20, 100));
  };
  // Keep the light direction in step with the visible sun.
  const baseUpdate = update;
  const updateAll = (camera: THREE.Camera, k: number, time: number): void => {
    baseUpdate(camera, k, time);
    sunLight.userData.dir = SPACE.sunDir(Math.min(k, 0.7), new THREE.Vector3());
  };
  sunLight.userData.dir = SPACE.sunDir(0.2, new THREE.Vector3());
  focusShadow([0, 0, 0], 12);

  return {
    group, sky, earthMat, sunLight, earthLight, frontFill, ambient,
    hatchDoor: station.hatchDoor, lamp: station.lamp, lampGlow: station.lampGlow, airlockGlow: station.airlockGlow,
    muzzle, muzzleGlow, slugs, gas, puffs, blood, flash, baseGlow,
    update: updateAll, focusShadow,
  };
}

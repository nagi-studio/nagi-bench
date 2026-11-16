import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";
import { mesh, glowSprite, slugGeo } from "../props";
import { glowTexture, starTexture } from "../textures";
import { Burst, Trails, Dust } from "../particles";
import { mulberry32, clamp01, easeInOut, v3 } from "../../util";
import type { Cast } from "../cast";
import type { Figure } from "@agentbench/voxel-kit";

// ---- Absolute-time choreography constants (seconds) ----
export const T = {
  spaceIn: 204,
  sunsetStart: 240,
  exitStart: 246,
  formStart: 253,
  visorClear: 260,
  holdEnd: 304,
  impact: 304.4,
  returnStart: 308,
  returnEnd: 320,
  fireStart: 278,
  flightStart: 292,
};

export interface SpaceSet {
  group: THREE.Group;
  earth: THREE.Mesh;
  atmo: THREE.Sprite;
  sun: THREE.Mesh;
  sunGlow: THREE.Sprite;
  sunFlare: THREE.Sprite;
  station: THREE.Group;
  wheel: THREE.Mesh;
  airlockDoor: THREE.Mesh;
  airlockLight: THREE.Mesh;
  airlockGlow: THREE.Sprite;
  ribbon: THREE.Mesh;
  shipyard: THREE.Mesh;
  baseOne: THREE.Group;
  baseBeacon: THREE.Sprite;
  stars: THREE.Points;
  debris: THREE.Group;
  delegateGroup: THREE.Group;
  impacts: Burst[];
  ice: Burst[];
  trails: Trails;
  flash: THREE.Sprite;
  flashLight: THREE.PointLight;
  bullet: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  earthShine: THREE.DirectionalLight;
}

const HUB = v3(0, 6, -90);
const STATION_C = v3(0, 6, -95);

// Photo formation: 3 rows x 10; targets (delegates 0,1,2) front-centre.
const FRONT_X = [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9];
const SLOTS: THREE.Vector3[] = [];
for (let row = 0; row < 3; row++) {
  for (let c = 0; c < 10; c++) {
    const y = 4 + row * 1.5 + Math.sin(c * 1.7 + row) * 0.35;
    SLOTS.push(v3(FRONT_X[c]!, y, -52 - row * 4.5));
  }
}
const SLOT_INDEX = [4, 5, 6, 0, 1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
export const HIT = [0, 1, 2, 13, 21]; // three targets + two behind

export function delegateSlot(i: number): THREE.Vector3 {
  return SLOTS[SLOT_INDEX[i]!]!;
}

/** Pure position of delegate i at absolute time t (exit → form → hold → return). */
export function delegatePos(i: number, t: number, out = new THREE.Vector3()): THREE.Vector3 {
  const slot = delegateSlot(i);
  const hit = HIT.includes(i);
  const delay = (i % 10) * 0.13;
  if (t < T.exitStart) return out.copy(HUB);
  if (t < T.formStart) {
    const x = easeInOut(clamp01((t - T.exitStart - delay) / (T.formStart - T.exitStart - 0.5)));
    return out.lerpVectors(HUB, slot, x);
  }
  if (t < T.returnStart) {
    // held formation with a tiny zero-g drift; a jolt when struck
    const drift = Math.sin(t * 0.6 + i) * 0.06;
    out.copy(slot);
    out.y += drift;
    out.x += Math.cos(t * 0.4 + i * 2) * 0.05;
    if (hit && t > T.impact) {
      const j = Math.exp(-(t - T.impact) * 1.5) * 0.5;
      out.z += j * 0.6; out.y += j * 0.3;
    }
    return out;
  }
  if (t < T.returnEnd) {
    const lag = hit ? 2.2 : 0; // the struck are dragged back, lagging
    const x = easeInOut(clamp01((t - T.returnStart - lag - delay * 0.5) / (T.returnEnd - T.returnStart - 2.5)));
    return out.lerpVectors(slot, HUB, x);
  }
  return out.copy(HUB);
}

export function delegateVisible(t: number): boolean {
  return t >= T.exitStart - 0.2 && t <= T.returnEnd + 0.3;
}

/** Sun direction as it sinks behind Earth's limb. */
export function sunDir(t: number, out = new THREE.Vector3()): THREE.Vector3 {
  const e = THREE.MathUtils.degToRad(-5.5 - clamp01((t - T.sunsetStart) / 62) * 11.5);
  const az = 0.085;
  return out.set(Math.sin(az) * Math.cos(e), Math.sin(e), -Math.cos(az) * Math.cos(e)).normalize();
}

function earthColor(x: number, y: number, z: number, d: number): number {
  // normalized direction for latitude/longitude
  const nx = x - 65, ny = y - 65, nz = z - 65;
  const len = Math.hypot(nx, ny, nz) || 1;
  const lat = ny / len;
  const lon = Math.atan2(nx, nz);
  const rng = mulberry32(Math.floor((lon + 4) * 40) * 131 + Math.floor((lat + 1) * 40) * 977);
  const n = rng();
  const continent = Math.sin(lon * 3.1 + 1.3) * Math.cos(lat * 4.2) + Math.sin(lon * 6.3) * 0.4 + Math.cos(lat * 9.1 + lon * 2) * 0.3;
  if (Math.abs(lat) > 0.82) return n > 0.5 ? 0xe8eef2 : 0xd2dce4; // ice caps
  if (continent > 0.35) {
    if (Math.abs(lat) > 0.55) return n > 0.6 ? 0x4a6a42 : 0x3e5a38; // taiga
    return n > 0.7 ? 0x6a7a4a : (n > 0.4 ? 0x4e6e3e : 0x8a7a52); // land / desert
  }
  if (continent > 0.1) return 0x3a5a7a; // shallow
  return n > 0.85 ? 0x2e5a8a : (n > 0.5 ? 0x24507e : 0x1e4670); // ocean
}

export function buildSpace(cast: Cast): SpaceSet {
  const group = new THREE.Group();
  group.visible = false;

  // ---- Earth ----
  const earth = new THREE.Mesh(voxelSphere(65, earthColor, { voxel: 8 }), voxelMaterial({ roughness: 0.95 }));
  earth.position.set(0, -560, -180);
  earth.receiveShadow = false; earth.castShadow = false;
  group.add(earth);
  // atmosphere limb glow
  const atmo = glowSprite(glowTexture("rgba(120,180,255,1)"), 0x6ab0ff, 260);
  atmo.position.set(20, -40, -360);
  atmo.material.opacity = 0.0;
  group.add(atmo);

  // ---- Sun ----
  const sun = new THREE.Mesh(new THREE.BoxGeometry(26, 26, 26),
    new THREE.MeshBasicMaterial({ color: 0xfff4e0 }));
  group.add(sun);
  const sunGlow = glowSprite(glowTexture("rgba(255,236,200,1)"), 0xffe8c0, 220);
  group.add(sunGlow);
  const sunFlare = glowSprite(starTexture(), 0xfff0d0, 420);
  sunFlare.material.opacity = 0.5;
  group.add(sunFlare);

  // ---- Yellow River wheel station ----
  const station = new THREE.Group();
  station.position.copy(STATION_C);
  group.add(station);
  const wheelGeo = buildVoxelGeometry({
    size: [38, 38, 8],
    at(x, y, z) {
      const cx = x - 19, cy = y - 19, cz = z - 4;
      const rr = Math.hypot(cx, cy);
      if (Math.abs(rr - 16) < 3 && Math.abs(cz) < 3) {
        const panel = (Math.floor(Math.atan2(cy, cx) * 8) % 2 === 0);
        return panel ? 0x8a9098 : 0x5e646a;
      }
      return null;
    },
  }, { voxel: 1.2, anchor: "center" });
  const wheel = new THREE.Mesh(wheelGeo, voxelMaterial({ metalness: 0.35, roughness: 0.55 }));
  station.add(wheel);
  // rim lights
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const gl = glowSprite(glowTexture("rgba(160,220,255,1)"), 0x9fd6ff, 2.4);
    gl.position.set(Math.cos(a) * 19.2, Math.sin(a) * 19.2, 3.6);
    gl.material.opacity = 0.7;
    wheel.add(gl);
  }
  // static de-spun hub + airlock
  const hub = mesh(buildVoxelGeometry({
    size: [9, 9, 12],
    at(x, y, z) {
      const cx = x - 4.5, cy = y - 4.5;
      if (Math.hypot(cx, cy) < 4.2) return z % 3 === 0 ? 0x6e747a : 0x8a9098;
      return null;
    },
  }, { voxel: 1.1, anchor: "center" }), { metalness: 0.4, roughness: 0.5 });
  station.add(hub);
  // spokes (static, connect hub to wheel visually)
  for (let s = 0; s < 4; s++) {
    const a = (s / 4) * Math.PI * 2;
    const spoke = mesh(buildVoxelGeometry({
      size: [16, 2, 2],
      at: (x, y, z) => (y === 0 && z === 0 ? 0x5e646a : null),
    }, { voxel: 1.0, anchor: "min" }), { metalness: 0.3, roughness: 0.6 });
    spoke.position.set(0, 0, 0);
    spoke.rotation.z = a;
    spoke.translateX(4);
    station.add(spoke);
  }
  // airlock on hub front (+Z toward Zhang)
  const airlockRing = mesh(buildVoxelGeometry({ size: [7, 7, 2], at: (x, y, z) => (Math.hypot(x - 3, y - 3) < 3.2 && Math.hypot(x - 3, y - 3) > 2.2 ? 0x4a5058 : null) }, { voxel: 0.5 }), { metalness: 0.4 });
  airlockRing.position.set(0, 0, 6.4);
  station.add(airlockRing);
  const airlockDoor = mesh(buildVoxelGeometry({ size: [5, 5, 1], at: (x, y, z) => (Math.hypot(x - 2, y - 2) < 2.3 ? 0x6e747a : null) }, { voxel: 0.5 }), { metalness: 0.5, roughness: 0.4 });
  airlockDoor.position.set(0, 0, 6.5);
  station.add(airlockDoor);
  const airlockLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xff4040, emissive: 0xff2020, emissiveIntensity: 2 }));
  airlockLight.position.set(3.2, 2.6, 6.6);
  station.add(airlockLight);
  const airlockGlow = glowSprite(glowTexture("rgba(255,80,60,1)"), 0xff4030, 2.0);
  airlockGlow.position.copy(airlockLight.position);
  station.add(airlockGlow);

  // ---- Elevator ribbon from Earth up past the station ----
  const ribbon = mesh(buildVoxelGeometry({
    size: [2, 260, 2],
    at(x, y, z) {
      const taper = 1 - y / 320;
      return Math.abs(x - 0.5) < taper && Math.abs(z - 0.5) < taper ? (y % 10 === 0 ? 0x9aa0a6 : 0x565c62) : null;
    },
  }, { voxel: 1.6, anchor: "min" }), { metalness: 0.3, roughness: 0.6 });
  ribbon.position.set(-2, -120, -150);
  ribbon.rotation.x = 0.12;
  group.add(ribbon);

  // ---- Shipyard skeleton (a beast's bones) ----
  const shipyard = mesh(buildVoxelGeometry({
    size: [30, 20, 16],
    at(x, y, z) {
      const beam = (x % 6 === 0 && (y % 5 === 0 || z % 5 === 0)) || (y % 5 === 0 && z % 5 === 0) || (x % 6 === 0 && y % 5 === 0 && z % 4 === 0);
      const edge = x < 2 || x > 27 || y < 1 || y > 18;
      if (beam && edge) return 0x4a5058;
      if (beam && (x + y + z) % 3 === 0) return 0x3e444c;
      return null;
    },
  }, { voxel: 2.2, anchor: "center" }), { metalness: 0.3, roughness: 0.7 });
  shipyard.position.set(78, 24, -210);
  shipyard.rotation.y = -0.4;
  group.add(shipyard);
  for (let i = 0; i < 4; i++) {
    const gl = glowSprite(glowTexture("rgba(255,180,90,1)"), 0xffb060, 3);
    gl.position.set(78 + (i - 1.5) * 12, 24 + (i % 2) * 10, -200);
    gl.material.opacity = 0.6;
    group.add(gl);
  }

  // ---- Base One (tiny, 80 km away, the way home) ----
  const baseOne = new THREE.Group();
  baseOne.position.set(-150, 16, 70);
  group.add(baseOne);
  const baseCore = mesh(buildVoxelGeometry({ size: [6, 4, 6], at: (x, y, z) => (Math.hypot(x - 2.5, z - 2.5) < 2.6 ? 0x6e747a : null) }, { voxel: 1.4 }), { metalness: 0.4 });
  baseOne.add(baseCore);
  const basePanel = mesh(buildVoxelGeometry({ size: [12, 1, 4], at: (x, y, z) => (y === 0 ? 0x2e4a6a : null) }, { voxel: 1.2 }), { metalness: 0.3 });
  basePanel.position.x = 0; baseOne.add(basePanel);
  const baseBeacon = glowSprite(glowTexture("rgba(120,255,180,1)"), 0x7fd6a0, 4);
  baseBeacon.position.set(0, 3, 0);
  baseOne.add(baseBeacon);

  // ---- Stars ----
  const starGeo = new THREE.BufferGeometry();
  const rng = mulberry32(7);
  const N = 2200;
  const sp = new Float32Array(N * 3);
  const sc = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = rng() * 2 - 1, th = rng() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    const r = 1800 + rng() * 400;
    sp[i * 3] = s * Math.cos(th) * r;
    sp[i * 3 + 1] = u * r;
    sp[i * 3 + 2] = s * Math.sin(th) * r;
    const b = 0.3 + rng() * 0.7;
    const warm = rng() > 0.8;
    sc[i * 3] = b * (warm ? 1 : 0.85);
    sc[i * 3 + 1] = b * 0.9;
    sc[i * 3 + 2] = b * (warm ? 0.7 : 1);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(sc, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 2.4, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: false }));
  stars.frustumCulled = false;
  group.add(stars);

  // ---- Debris field (human-sized floaters) ----
  const debris = new THREE.Group();
  group.add(debris);
  const drng = mulberry32(99);
  for (let i = 0; i < 44; i++) {
    const kind = drng();
    const g = kind > 0.6
      ? buildVoxelGeometry({ size: [3, 2, 2], at: () => (drng() > 0.3 ? 0x5e646a : null) }, { voxel: 0.5 })
      : voxelSphere(1.4, () => (drng() > 0.5 ? 0x4a453d : 0x6e747a), { voxel: 0.4 });
    const m = new THREE.Mesh(g, voxelMaterial({ metalness: 0.3, roughness: 0.8 }));
    const ang = drng() * Math.PI * 2;
    const rad = 24 + drng() * 110;
    m.position.set(Math.cos(ang) * rad, (drng() - 0.5) * 50, Math.sin(ang) * rad - 40);
    m.rotation.set(drng() * 3, drng() * 3, drng() * 3);
    m.userData.spin = (drng() - 0.5) * 0.2;
    m.castShadow = false;
    debris.add(m);
  }

  // ---- Delegates ----
  const delegateGroup = new THREE.Group();
  group.add(delegateGroup);
  for (const fig of cast.delegates) {
    fig.root.visible = false;
    delegateGroup.add(fig.root);
  }

  // ---- Effects ----
  const impacts: Burst[] = [];
  const ice: Burst[] = [];
  for (let i = 0; i < HIT.length; i++) {
    const b = new Burst(60, 0xeaf2f6, 0.3, 400 + i, 0.32);
    group.add(b.points);
    impacts.push(b);
    const ic = new Burst(80, i === 0 ? 0xffd0d0 : 0xe8f0ff, 0.16, 500 + i, 0.26);
    group.add(ic.points);
    ice.push(ic);
  }
  // thruster trails for the return burn (representative subset of the group)
  const trailPaths = [] as ((t: number) => THREE.Vector3)[];
  for (let i = 0; i < 30; i += 2) trailPaths.push((t: number) => delegatePos(i, t));
  const trails = new Trails(trailPaths, v3(0, 0, -1), 26, 0xdfeaf2, 0.25, 0.05, 7, 13);
  group.add(trails.points);

  const flash = glowSprite(starTexture(), 0xffe0a0, 1.0);
  flash.material.opacity = 0;
  group.add(flash);
  const flashLight = new THREE.PointLight(0xffd090, 0, 6, 2);
  group.add(flashLight);

  const bullet = new THREE.Mesh(slugGeo(), voxelMaterial({ metalness: 0.7, roughness: 0.35 }));
  bullet.scale.setScalar(2.2);
  bullet.visible = false;
  group.add(bullet);

  // ---- Lighting: hard sun + faint earthshine ----
  const sunLight = new THREE.DirectionalLight(0xfff2e0, 3.0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 200;
  sunLight.shadow.camera.left = -40;
  sunLight.shadow.camera.right = 40;
  sunLight.shadow.camera.top = 40;
  sunLight.shadow.camera.bottom = -40;
  sunLight.shadow.bias = -0.001;
  group.add(sunLight, sunLight.target);
  const earthShine = new THREE.DirectionalLight(0x4a7ab0, 0.6);
  earthShine.position.set(0, -40, -20);
  group.add(earthShine);
  // Soft camera-side fill (earthshine reflected off the suit / station) so the
  // backlit delegates and Zhang still read against the sun.
  const faceFill = new THREE.DirectionalLight(0x9fc0e0, 1.3);
  faceFill.position.set(0, 10, 45);
  faceFill.target.position.set(0, 4, -55);
  group.add(faceFill, faceFill.target);
  const amb = new THREE.AmbientLight(0x243448, 0.7);
  group.add(amb);

  return {
    group, earth, atmo, sun, sunGlow, sunFlare, station, wheel, airlockDoor, airlockLight,
    airlockGlow, ribbon, shipyard, baseOne, baseBeacon, stars, debris, delegateGroup,
    impacts, ice, trails, flash, flashLight, bullet, sunLight, earthShine,
  };
}

/** Update delegate transforms + visor state from absolute time (seek-safe). */
export function updateDelegates(cast: Cast, t: number, tmp = new THREE.Vector3()): void {
  const vis = delegateVisible(t);
  const clear = t >= T.visorClear;
  for (let i = 0; i < cast.delegates.length; i++) {
    const fig = cast.delegates[i]!;
    fig.root.visible = vis;
    if (!vis) continue;
    delegatePos(i, t, tmp);
    fig.root.position.copy(tmp);
    // face the photographer (+Z), slight individual yaw drift
    fig.root.rotation.set(0, Math.sin(t * 0.3 + i) * 0.08, Math.sin(t * 0.25 + i * 2) * 0.04);
    // visor state
    const isTarget = i < 3;
    const cracked = i === 0 && t >= T.impact + 0.4;
    let desired: THREE.Texture;
    if (cracked) desired = cast.tex.suitCracked;
    else if (clear) desired = isTarget ? cast.tex.rankUp : cast.tex.suitUp;
    else desired = isTarget ? cast.tex.rankDown : cast.tex.suitDown;
    const mat = fig.clothing.torso.material as THREE.MeshStandardMaterial;
    if (mat.map !== desired) fig.setClothes(desired);
    // zero-g float pose
    const sway = Math.sin(t * 0.5 + i);
    fig.joints.hips.rotation.set(-0.15 + sway * 0.04, 0, 0);
    fig.joints.armR.rotation.set(-0.7 + Math.sin(t * 0.6 + i) * 0.12, 0, 0.25);
    fig.joints.armL.rotation.set(-0.5 + Math.cos(t * 0.5 + i) * 0.12, 0, -0.3);
    fig.joints.legR.rotation.set(-0.35 + sway * 0.08, 0, 0.1);
    fig.joints.legL.rotation.set(-0.2 - sway * 0.08, 0, -0.1);
    fig.joints.neck.rotation.set(0.05, Math.sin(t * 0.4 + i) * 0.1, 0);
  }
}

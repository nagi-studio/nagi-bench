import * as THREE from "three";
import { applyPose, buildVoxelGeometry, float, lerpPose, voxelSphere, type Pose } from "@agentbench/voxel-kit";
import { Actor, makeParticipant, makeTarget, makeZhang, performFace } from "../characters";
import { CubeField } from "../particles";
import { gloveGeo, magazineGeo, mesh, packGeo, pistolGeo, scopeGeo, cameraGeo, slugGeo, VM, VM_GLOSS } from "../props";
import { DEG, clamp, easeIn, easeInOut, easeOut, fbm, glowTex, hash, keyed, lerp, mixHex, rng, seg, smooth } from "../util";
import { voiceCues } from "../voice";

// ------------------------------------------------------------------ layout

export const dirAE = (az: number, el: number) =>
  new THREE.Vector3(Math.sin(az * DEG) * Math.cos(el * DEG), Math.sin(el * DEG), -Math.cos(az * DEG) * Math.cos(el * DEG));

export const EARTH_DIR = dirAE(-12, -16).normalize();
const EARTH_DIST = 60000;
const EARTH_ANG = 13 * DEG;
const EARTH_R = EARTH_DIST * Math.sin(EARTH_ANG);
const SUN_DIST = 85000;
const SUN_ANG = 0.6 * DEG;
const SUN_W = (() => {
  const s0 = dirAE(-6, -8);
  return s0.clone().sub(EARTH_DIR.clone().multiplyScalar(s0.dot(EARTH_DIR))).normalize();
})();
export const BASE1_DIR = dirAE(150, 6).normalize();

/** Sun offset from the limb in sun radii: +1 touching, 0 half set, -1 gone. */
export function sunK(t: number): number {
  return keyed([
    [0, 2.7], [40, 2.3], [148, 1.08], [162, 0.85], [232, 0.04], [246, -0.2], [256, -0.36],
    [284, -0.62], [298, -0.8], [308, -0.95], [324, -1.25], [336, -1.6],
  ], t, (x) => x);
}
export function sunDir(t: number): THREE.Vector3 {
  const th = EARTH_ANG + sunK(t) * SUN_ANG;
  return EARTH_DIR.clone().multiplyScalar(Math.cos(th)).add(SUN_W.clone().multiplyScalar(Math.sin(th))).normalize();
}
export const sunVisible = (t: number) => clamp((sunK(t) + 1) / 2);

// Station and group geometry (metres, world space). Zhang floats at the origin.
export const STATION_C = new THREE.Vector3(0, -800, -5150);
const RIM_R = 150;
export const HATCH = new THREE.Vector3(0, -800, -4995.6);
const GROUP_Z = -4962;

export const FRONT = 7, MID = 10, BACK = 13;
export function slot(i: number): THREE.Vector3 {
  if (i < FRONT) return new THREE.Vector3((i - (FRONT - 1) / 2) * 0.95, -801.25, GROUP_Z + 0.6);
  if (i < FRONT + MID) return new THREE.Vector3((i - FRONT - (MID - 1) / 2) * 0.9, -800.05, GROUP_Z);
  return new THREE.Vector3((i - FRONT - MID - (BACK - 1) / 2) * 0.84, -798.85, GROUP_Z - 0.6);
}
export const TARGETS = [2, 3, 4];
/** Victims: index → hit time. */
export const HITS: Record<number, number> = { 2: 307.6, 1: 307.8, 3: 308.0, 12: 308.2, 4: 308.4 };
const RESCUER: Record<number, number> = { 2: 9, 1: 8, 3: 10, 12: 20, 4: 11 };
export const PHOTOG = new THREE.Vector3(2.6, -801.6, -4944);

// Firing schedule (film time).
export const SHOTS: number[] = [
  ...Array.from({ length: 10 }, (_, i) => 288.6 + i * 0.2),
  ...Array.from({ length: 10 }, (_, i) => 292.2 + i * 0.2),
  ...Array.from({ length: 10 }, (_, i) => 295.6 + i * 0.2),
];
export const MAG_CHANGES: Array<[number, number]> = [[290.5, 291.5], [294.15, 295.2]];

function exitTime(i: number): number {
  return 240.6 + ((i * 7) % 30) * 0.19;
}

// ------------------------------------------------------------------- Earth

const EARTH_VERT = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vCol; varying vec3 vN; varying vec3 vF; varying vec3 vW; varying vec3 vO;
void main() {
  vCol = color; vN = normalize(position); vF = normal; vO = position;
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  #include <logdepthbuf_vertex>
}`;
const EARTH_FRAG = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uSun; uniform float uGlow; uniform float uVox;
varying vec3 vCol; varying vec3 vN; varying vec3 vF; varying vec3 vW; varying vec3 vO;
void main() {
  #include <logdepthbuf_fragment>
  vec3 N = normalize(vN);
  vec3 n = normalize(N * 0.7 + vF * 0.3);
  float d = dot(N, uSun);
  float day = smoothstep(-0.06, 0.28, d);
  vec3 base = vCol;
  bool ocean = base.b > base.r * 1.6 && base.b > base.g;
  bool cloud = base.r > 0.55 && base.g > 0.55 && base.b > 0.55;
  float lam = clamp(dot(n, uSun) * 0.85 + 0.2, 0.0, 1.0);
  vec3 col = base * (0.012 + lam * day * 1.25);
  float band = exp(-pow((d + 0.02) / 0.2, 2.0));
  vec3 bandCol = cloud ? vec3(1.0, 0.52, 0.62) : ocean ? vec3(1.0, 0.36, 0.08) : vec3(0.8, 0.38, 0.16);
  col += bandCol * band * (cloud ? 0.95 : 0.6) * uGlow;
  // Twilight scattered onto the night side next to the setting sun.
  col += vec3(0.5, 0.18, 0.1) * exp(-pow((d + 0.2) / 0.22, 2.0)) * 0.22 * uGlow;
  vec3 V = normalize(cameraPosition - vW);
  vec3 R = reflect(-uSun, N);
  float spec = pow(max(dot(R, V), 0.0), 14.0);
  if (ocean) col += vec3(1.0, 0.5, 0.2) * spec * 1.6 * smoothstep(-0.12, 0.08, d) * uGlow;
  if (!ocean && !cloud) {
    vec3 cell = floor(vO / uVox + 0.5);
    float r = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    col += vec3(1.0, 0.72, 0.38) * step(0.9, r) * (1.0 - smoothstep(-0.25, 0.02, d)) * 0.55;
  }
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  col += vec3(0.22, 0.45, 1.0) * fres * (0.06 + day * 0.5);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function buildEarth(): { mesh: THREE.Mesh; mat: THREE.ShaderMaterial } {
  const R = 58;
  const vox = EARTH_R / R;
  const geo = voxelSphere(R + 2, (x, y, z, dist) => {
    const c = R + 2;
    const px = (x + 0.5 - c) / R, py = (y + 0.5 - c) / R, pz = (z + 0.5 - c) / R;
    const r = dist * (R + 2) / R;
    const lat = Math.abs(py);
    if (r > 1.0) {
      // Cloud shell: floating blocks one voxel above the surface.
      if (r > 1.035 || r < 1.0) return null;
      const cl = fbm(px * 3.2 + 7, py * 5.5, pz * 3.2, 4, 3);
      return cl > 0.6 ? 0xf2f2f4 : null;
    }
    if (r < 0.95) return 0x0a1422;
    if (lat > 0.9) return 0xe6ecf2;
    const h = fbm(px * 2.2, py * 2.2, pz * 2.2, 5, 11);
    if (h > 0.53) {
      const dry = fbm(px * 4 + 3, py * 4, pz * 4, 3, 21);
      if (h > 0.66) return 0x8a7a66;
      return dry > 0.52 ? 0xa88a5a : mixHex(0x3f6a3a, 0x5a7a44, dry);
    }
    return h > 0.49 ? 0x2a6a94 : mixHex(0x0f2f66, 0x163f7c, fbm(px * 6, py * 6, pz * 6, 2, 5));
  }, { voxel: vox });
  const mat = new THREE.ShaderMaterial({
    vertexShader: EARTH_VERT,
    fragmentShader: EARTH_FRAG,
    vertexColors: true,
    uniforms: { uSun: { value: new THREE.Vector3(0, 0, 1) }, uGlow: { value: 1 }, uVox: { value: vox } },
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(EARTH_DIR).multiplyScalar(EARTH_DIST);
  m.frustumCulled = false;
  return { mesh: m, mat };
}

function starField(): THREE.Group {
  const g = new THREE.Group();
  const r = rng(4242);
  const layer = (count: number, size: number, band: boolean) => {
    const pos: number[] = [], col: number[] = [];
    for (let i = 0; i < count; i++) {
      let v: THREE.Vector3;
      if (band) {
        const a = r() * Math.PI * 2;
        const off = (r() + r() + r() - 1.5) * 0.18;
        v = new THREE.Vector3(Math.cos(a), off, Math.sin(a)).normalize().applyAxisAngle(new THREE.Vector3(1, 0, 0.3).normalize(), 1.0);
      } else {
        v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize();
      }
      v.multiplyScalar(150000);
      pos.push(v.x, v.y, v.z);
      const k = 0.35 + r() * 0.65;
      const warm = r();
      col.push(k * (warm > 0.8 ? 1 : 0.85), k * 0.9, k * (warm < 0.3 ? 1 : 0.85));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size, sizeAttenuation: false, vertexColors: true, depthWrite: false }));
    pts.frustumCulled = false;
    g.add(pts);
  };
  layer(2600, 1.4, false);
  layer(350, 2.4, false);
  layer(2400, 1.0, true);
  return g;
}

// ------------------------------------------------------------------ station

function buildStation(): THREE.Group {
  const g = new THREE.Group();
  const v = 2.5;
  const N = Math.ceil((RIM_R + 4) * 2 / v);
  const H = Math.ceil(40 / v);
  const winCells: Array<[number, number, number]> = [];
  const hull = buildVoxelGeometry({
    size: [N, H, N],
    at(x, y, z) {
      const px = (x + 0.5) * v - N * v / 2, py = (y + 0.5) * v - H * v / 2, pz = (z + 0.5) * v - N * v / 2;
      const r = Math.hypot(px, pz);
      const ang = Math.atan2(pz, px);
      // Rim torus (rectangular section).
      if (r > RIM_R - 20 && r <= RIM_R && Math.abs(py) < 7) {
        const outer = r > RIM_R - v;
        const seam = Math.floor((ang + Math.PI) * 40) % 6 === 0;
        if (outer && Math.abs(py) < 3 && Math.floor((ang + Math.PI) * 90) % 4 === 1) {
          winCells.push([x, y, z]);
          return 0x1a1f26;
        }
        return seam ? 0x9aa0a6 : (Math.floor(py) + Math.floor(ang * 60)) % 7 === 0 ? 0xc4c8cc : 0xb3b8bd;
      }
      // Spokes.
      const spoke = (Math.abs(px) < 3 || Math.abs(pz) < 3) && r > 16 && r <= RIM_R - 19 && Math.abs(py) < 3;
      if (spoke) return 0x8e949a;
      // Hub.
      if (r < 18 && Math.abs(py) < 18) return Math.abs(py) > 15 ? 0x7d838a : 0xa4a9ae;
      return null;
    },
  }, { voxel: v });
  g.add(mesh(hull, VM, false));
  // Window strip: emissive voxels sitting just outside the hull cells above.
  const winSet = new Set(winCells.map((c) => c.join(",")));
  const wins = buildVoxelGeometry({
    size: [N, H, N],
    at(x, y, z) {
      return winSet.has(`${x},${y},${z}`) ? (hash(x, z) > 0.3 ? 0xffd89a : 0x8ab4ff) : null;
    },
  }, { voxel: v });
  const winMesh = new THREE.Mesh(wins, new THREE.MeshBasicMaterial({ vertexColors: true }));
  winMesh.scale.setScalar(1.004);
  g.add(winMesh);
  // Solar wings on a mast above the hub.
  const wing = buildVoxelGeometry({
    size: [48, 1, 10],
    at(x, _y, z) {
      if (x >= 22 && x <= 25) return z >= 4 && z <= 5 ? 0x7a8088 : null;
      return (x % 4 === 0 || z % 5 === 0) ? 0x3a4a5a : 0x1d3a66;
    },
  }, { voxel: 5 });
  const w = mesh(wing, VM_GLOSS, false);
  w.position.set(0, 34, 0);
  g.add(w);
  // Tilt the wheel toward Zhang about the airlock point, so the rim at the
  // airlock stays where the photo group is staged while the ring reads as a ring.
  const pivot = new THREE.Group();
  pivot.position.set(0, STATION_C.y, STATION_C.z + RIM_R);
  pivot.rotation.x = STATION_TILT;
  g.position.set(0, 0, -RIM_R);
  pivot.add(g);
  return pivot;
}

const STATION_TILT = 0.42;
/** World position of the hub after the tilt. */
export const STATION_HUB = new THREE.Vector3(0, STATION_C.y + RIM_R * Math.sin(STATION_TILT), STATION_C.z + RIM_R - RIM_R * Math.cos(STATION_TILT));

/** Airlock module on the rim, facing Zhang (+Z). Local origin at the rim surface. */
function buildHatchModule(): { group: THREE.Group; door: THREE.Mesh; lamp: THREE.Mesh; lampMat: THREE.MeshBasicMaterial } {
  const g = new THREE.Group();
  const v = 0.25;
  const geo = buildVoxelGeometry({
    size: [52, 40, 18],
    at(x, y, z) {
      const px = (x + 0.5) * v - 6.5, py = (y + 0.5) * v - 5, pz = (z + 0.5) * v;
      const dr = Math.hypot(px, py + 0.2);
      if (pz > 4.25) return null;
      if (dr < 1.85 && pz > 3.2) return null; // door recess
      if (dr < 1.85) return 0x07090c;
      if (dr < 2.15 && pz > 4.0) return 0x4a5058;
      if (pz > 4.0 && Math.abs(py + 0.2) > 2.6 && Math.abs(px) < 2.4 && Math.abs(py + 0.2) < 3.2) {
        return (Math.floor(px * 4) + Math.floor(py * 4)) % 2 === 0 ? 0xd8b030 : 0x1c1c1c; // hazard band
      }
      const panel = Math.abs(px % 2.0) < 0.13 || Math.abs(py % 2.0) < 0.13;
      return panel ? 0x8f959c : (hash(Math.floor(px), Math.floor(py)) > 0.8 ? 0xcfd3d7 : 0xbfc4c9);
    },
  }, { voxel: v });
  const body = mesh(geo, VM, false);
  body.position.set(0, 0, 0);
  g.add(body);
  const doorGeo = buildVoxelGeometry({
    size: [15, 15, 2],
    at(x, y, z) {
      const d = Math.hypot(x - 7, y - 7);
      if (d > 7.2) return null;
      if (z === 1 && d < 2) return 0x5a6068;
      return d > 6.2 ? 0x6a7078 : 0xa9aeb4;
    },
  }, { voxel: 0.25, anchor: "center" });
  const door = mesh(doorGeo, VM, false);
  door.position.set(0, -0.2, 3.95);
  g.add(door);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xff2a1a });
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.3), lampMat);
  lamp.position.set(2.8, 2.2, 4.3);
  g.add(lamp);
  for (const sx of [-5.6, 5.6]) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.3), new THREE.MeshBasicMaterial({ color: 0xeef4ff }));
    f.position.set(sx, 4.3, 4.3);
    g.add(f);
  }
  g.position.set(0, -800, STATION_C.z + RIM_R - 0.6);
  return { group: g, door, lamp, lampMat };
}

function buildShipyard(): THREE.Group {
  const g = new THREE.Group();
  const geo = buildVoxelGeometry({
    size: [52, 22, 26],
    at(x, y, z) {
      const ex = x === 0 || x === 51 || x % 10 === 0, ey = y === 0 || y === 21, ez = z === 0 || z === 25;
      const edges = (ex && ey) || (ey && ez) || (ex && ez);
      const brace = ez && ex === false && (x + y) % 10 === 0 && y > 0 && y < 21;
      if (edges || brace) return (x + y + z) % 5 === 0 ? 0x6a6f76 : 0x4a4f56;
      if (x > 30 && ey && z % 5 === 0) return 0x3d4248;
      return null;
    },
  }, { voxel: 14 });
  g.add(mesh(geo, VM, false));
  const lights = new THREE.Group();
  const lm = new THREE.MeshBasicMaterial({ color: 0xffa040 });
  const r = rng(9);
  for (let i = 0; i < 18; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), lm);
    b.position.set((r() - 0.5) * 700, (r() > 0.5 ? 1 : -1) * 150, (r() - 0.5) * 360);
    lights.add(b);
  }
  g.add(lights);
  g.position.set(2600, -1300, -8600);
  g.rotation.y = -0.5;
  return g;
}

function debrisField(): THREE.Group {
  const g = new THREE.Group();
  const r = rng(77);
  const kinds = [
    () => buildVoxelGeometry({ size: [6, 1, 3], at: () => (r() > 0.2 ? 0x9aa0a6 : 0x5a6068) }, { voxel: 0.4, anchor: "center" }),
    () => buildVoxelGeometry({ size: [1, 1, 9], at: (_x, _y, z) => (z % 3 === 0 ? 0x6a5a40 : 0x8a7a5a) }, { voxel: 0.35, anchor: "center" }),
    () => buildVoxelGeometry({ size: [3, 3, 3], at: (x, y) => ((x + y) % 2 ? 0xd8d8d0 : 0xb8b8b0) }, { voxel: 0.3, anchor: "center" }),
    () => buildVoxelGeometry({ size: [4, 2, 4], at: () => 0x3a4a6a }, { voxel: 0.5, anchor: "center" }),
  ];
  for (let i = 0; i < 26; i++) {
    const m = mesh(kinds[i % kinds.length](), VM, false);
    const dist = 25 + Math.pow(r(), 1.5) * 500;
    const dir = new THREE.Vector3(r() - 0.5, (r() - 0.5) * 0.6, r() - 0.5).normalize();
    m.position.copy(dir.multiplyScalar(dist));
    m.userData.spin = [(r() - 0.5) * 0.3, (r() - 0.5) * 0.3, (r() - 0.5) * 0.3];
    m.userData.drift = [(r() - 0.5) * 0.4, (r() - 0.5) * 0.2, (r() - 0.5) * 0.4];
    m.userData.p0 = m.position.clone();
    g.add(m);
  }
  return g;
}

// -------------------------------------------------------------------- set

interface Flyer {
  a: THREE.Vector3;
  b: THREE.Vector3;
  t0: number;
  dur: number;
}

export class SpaceSet {
  readonly group = new THREE.Group();
  readonly sky = new THREE.Group();
  readonly zhang: Actor;
  readonly zhangHolder = new THREE.Group();
  readonly people: Actor[] = [];
  readonly photographer: Actor;
  readonly station: THREE.Group;
  private readonly hatch: ReturnType<typeof buildHatchModule>;
  private readonly earth: ReturnType<typeof buildEarth>;
  private readonly sunMesh: THREE.Mesh;
  private readonly sunGlow: THREE.Sprite;
  private readonly sunCorona: THREE.Sprite;
  private readonly flare: THREE.Sprite;
  private readonly limb: THREE.Mesh;
  private readonly halo: THREE.Sprite;
  private readonly base1: THREE.Sprite;
  private readonly sunLight: THREE.DirectionalLight;
  private readonly fill: THREE.HemisphereLight;
  private readonly flood: THREE.SpotLight[] = [];
  private readonly muzzleLight: THREE.PointLight;
  private readonly thrustLight: THREE.PointLight;
  private readonly cable: THREE.Line;
  private readonly debris: THREE.Group;
  private readonly flyers: Flyer[] = [];
  private readonly flyerMeshes: THREE.Mesh[] = [];
  private readonly flyerTrails: THREE.Mesh[] = [];
  // Props.
  private readonly scopeHand: THREE.Mesh;
  private readonly scopeFloat: THREE.Mesh;
  private readonly scopeGun: THREE.Mesh;
  private readonly pistol: THREE.Mesh;
  private readonly muzzle = new THREE.Object3D();
  private readonly muzzleFlash: THREE.Sprite;
  readonly firefly: THREE.Sprite;
  private readonly magL: THREE.Mesh;
  private readonly glove: THREE.Mesh;
  readonly bullet: THREE.Mesh;
  readonly bulletLight: THREE.PointLight;
  private readonly packFlames: THREE.Mesh[] = [];
  // Particles.
  private readonly gas: CubeField;
  private readonly blood: CubeField;
  private readonly trails: CubeField;
  private readonly plume: CubeField;
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly m4 = new THREE.Matrix4();

  constructor() {
    this.group.name = "set:space";
    this.group.add(this.sky);

    // Sky ----------------------------------------------------------------
    this.sky.add(starField());
    this.earth = buildEarth();
    this.earth.mesh.renderOrder = -5;
    this.sky.add(this.earth.mesh);
    this.sunMesh = new THREE.Mesh(
      voxelSphere(6, (_x, _y, _z, d) => (d > 0.8 ? 0xffc27a : 0xfff4dc), { voxel: (SUN_DIST * Math.tan(SUN_ANG)) / 6 }),
      new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
    );
    this.sky.add(this.sunMesh);
    this.sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,240,210,1)"], [0.12, "rgba(255,200,140,0.55)"], [0.4, "rgba(255,140,60,0.12)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false,
    }));
    this.sky.add(this.sunGlow);
    this.sunCorona = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,250,235,1)"], [0.3, "rgba(255,230,190,0.6)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false,
    }));
    this.sky.add(this.sunCorona);
    this.flare = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,210,160,0.9)"], [0.25, "rgba(255,150,80,0.25)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, toneMapped: false,
    }));
    this.flare.renderOrder = 50;
    this.sky.add(this.flare);
    const limbTex = glowTex([[0, "rgba(255,170,90,0.95)"], [0.25, "rgba(255,110,60,0.45)"], [0.6, "rgba(200,80,120,0.12)"], [1, "rgba(0,0,0,0)"]]);
    this.limb = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      map: limbTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false,
    }));
    this.sky.add(this.limb);
    const haloTex = (() => {
      const size = 256;
      const cv = document.createElement("canvas");
      cv.width = cv.height = size;
      const c = cv.getContext("2d")!;
      const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.86, "rgba(0,0,0,0)");
      g.addColorStop(0.9, "rgba(90,150,255,0.55)");
      g.addColorStop(0.93, "rgba(60,110,230,0.25)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    })();
    this.halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    this.sky.add(this.halo);
    this.base1 = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,255,255,1)"], [0.3, "rgba(255,120,100,0.6)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, sizeAttenuation: false,
    }));
    this.base1.scale.setScalar(0.012);
    this.base1.position.copy(BASE1_DIR).multiplyScalar(40000);
    this.sky.add(this.base1);

    // Lights ---------------------------------------------------------------
    this.sunLight = new THREE.DirectionalLight(0xffe0b0, 3);
    this.group.add(this.sunLight);
    this.fill = new THREE.HemisphereLight(0x33405a, 0x05070a, 0.35);
    this.group.add(this.fill);
    // Cool starlight/earthshine fill from behind Zhang so silhouettes keep their shape.
    const rim = new THREE.DirectionalLight(0x7890c8, 1.1);
    rim.position.set(0.35, 0.55, 1);
    this.group.add(rim);
    // Faint earthshine and city glow from the planet's night side.
    const earthshine = new THREE.DirectionalLight(0x4a6090, 0.9);
    earthshine.position.copy(EARTH_DIR).add(new THREE.Vector3(-0.3, 0.2, 0));
    this.group.add(earthshine);
    for (const sx of [-5.6, 5.6]) {
      const s = new THREE.SpotLight(0xe8f0ff, 1.6, 90, 0.5, 0.6, 0);
      s.position.set(sx, -795.7, STATION_C.z + RIM_R + 4.2);
      s.target.position.set(sx * 0.2, -800, GROUP_Z);
      this.group.add(s, s.target);
      this.flood.push(s);
    }
    // Photo lights on two booms reaching out from the airlock: key light on the faces.
    const boomMat = new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.6, metalness: 0.3 });
    const headMat = new THREE.MeshBasicMaterial({ color: 0xfff6e8 });
    for (const [sx, sy] of [[-7.5, -795.2], [7.5, -796.4]]) {
      const zStart = STATION_C.z + RIM_R + 3, zEnd = -4947;
      const boom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, zEnd - zStart), boomMat);
      boom.position.set(sx, sy + 0.45, (zStart + zEnd) / 2);
      this.group.add(boom);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.4), headMat);
      head.position.set(sx, sy, zEnd);
      this.group.add(head);
      const s = new THREE.SpotLight(0xfff0dc, 4.6, 70, 0.62, 0.5, 0);
      s.position.set(sx, sy, zEnd - 0.3);
      s.target.position.set(sx * 0.12, -800.4, GROUP_Z);
      this.group.add(s, s.target);
    }
    this.muzzleLight = new THREE.PointLight(0xffc070, 0, 4, 0);
    this.group.add(this.muzzleLight);
    this.thrustLight = new THREE.PointLight(0x9ac8ff, 0, 6, 0);
    this.group.add(this.thrustLight);

    // World ----------------------------------------------------------------
    this.station = buildStation();
    this.group.add(this.station);
    this.hatch = buildHatchModule();
    this.group.add(this.hatch.group);
    this.group.add(buildShipyard());
    const cableGeo = new THREE.BufferGeometry().setFromPoints([
      STATION_HUB.clone(),
      STATION_HUB.clone().add(EARTH_DIR.clone().multiplyScalar(EARTH_DIST - EARTH_R * 1.02)),
    ]);
    this.cable = new THREE.Line(cableGeo, new THREE.LineBasicMaterial({ color: 0x9aa6b8, transparent: true, opacity: 0.22 }));
    this.cable.frustumCulled = false;
    this.group.add(this.cable);
    this.debris = debrisField();
    this.group.add(this.debris);

    const fr = rng(55);
    for (let i = 0; i < 7; i++) {
      const a = STATION_C.clone().add(new THREE.Vector3((fr() - 0.5) * 3000, (fr() - 0.5) * 900, (fr() - 0.5) * 2600));
      const b = STATION_C.clone().add(new THREE.Vector3((fr() - 0.5) * 3000, (fr() - 0.5) * 900, (fr() - 0.5) * 2600));
      this.flyers.push({ a, b, t0: fr() * 30, dur: a.distanceTo(b) / 140 });
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), new THREE.MeshBasicMaterial({ color: 0xdfe6ee }));
      const trail = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1), new THREE.MeshBasicMaterial({ color: 0x9ab8e8, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
      this.group.add(m, trail);
      this.flyerMeshes.push(m);
      this.flyerTrails.push(trail);
    }

    // Zhang ---------------------------------------------------------------
    this.zhang = makeZhang();
    this.zhang.dress("suit");
    this.zhangHolder.add(this.zhang.root);
    this.group.add(this.zhangHolder);
    this.zhang.fig.anchors.back.add(mesh(packGeo(0xc2c7cd), VM, false));
    for (const sx of [-2.5, 2.5]) {
      const fl = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.6), new THREE.MeshBasicMaterial({ color: 0xbfe0ff, toneMapped: false }));
      fl.position.set(sx, -5.5, -4.6);
      this.zhang.fig.anchors.back.add(fl);
      this.packFlames.push(fl);
    }
    const hipPouch = mesh(buildVoxelGeometry({ size: [3, 4, 5], at: (x, y) => (y === 3 ? 0x6a7078 : 0x8a9098) }, { voxel: 1, anchor: "center" }), VM, false);
    hipPouch.position.set(-1.2, -1.5, 0);
    this.zhang.fig.anchors.hipR.add(hipPouch);

    const sGeo = scopeGeo();
    this.scopeHand = mesh(sGeo, VM_GLOSS, false);
    this.zhang.fig.anchors.handR.add(this.scopeHand);
    this.scopeFloat = mesh(sGeo, VM_GLOSS, false);
    this.scopeFloat.scale.setScalar(this.zhang.root.scale.x);
    this.group.add(this.scopeFloat);
    this.pistol = mesh(pistolGeo(), VM_GLOSS, false);
    this.pistol.geometry.translate(0, 1.5, 0.6);
    this.zhang.fig.anchors.handR.add(this.pistol);
    this.scopeGun = mesh(sGeo, VM_GLOSS, false);
    this.scopeGun.position.set(0, 3.0, 1.2);
    this.pistol.add(this.scopeGun);
    this.muzzle.position.set(0, 2.1, 4.3);
    this.pistol.add(this.muzzle);
    this.muzzleFlash = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,255,230,1)"], [0.2, "rgba(255,200,110,0.8)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false,
    }));
    this.muzzleFlash.scale.setScalar(3.2);
    this.muzzle.add(this.muzzleFlash);
    this.firefly = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex([[0, "rgba(255,250,220,1)"], [0.35, "rgba(255,190,90,0.5)"], [1, "rgba(0,0,0,0)"]]),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, sizeAttenuation: false, toneMapped: false,
    }));
    this.firefly.scale.setScalar(0.02);
    this.group.add(this.firefly);
    this.magL = mesh(magazineGeo(), VM, false);
    this.magL.position.set(0, 0.5, 0.5);
    this.zhang.fig.anchors.handL.add(this.magL);
    this.glove = mesh(gloveGeo(), VM, false);
    this.group.add(this.glove);
    this.bullet = mesh(slugGeo(), VM_GLOSS, false);
    this.group.add(this.bullet);
    // Warm kicker for the bullet close-up; always in the scene so light counts never change.
    this.bulletLight = new THREE.PointLight(0xffb070, 0, 0.5, 0);
    this.group.add(this.bulletLight);

    // The photo group -----------------------------------------------------
    let tIndex = 0;
    for (let i = 0; i < FRONT + MID + BACK; i++) {
      const isTarget = TARGETS.includes(i);
      const a = isTarget ? makeTarget(tIndex++) : makeParticipant(i);
      a.dress("tint");
      a.fig.anchors.back.add(mesh(packGeo(), VM, false));
      this.group.add(a.root);
      this.people.push(a);
    }
    this.photographer = makeParticipant(99, { accent: "#2f6fd0", visorDefault: "clear" });
    this.photographer.fig.anchors.back.add(mesh(packGeo(), VM, false));
    const cam = mesh(cameraGeo(), VM, false);
    cam.position.set(0, 0.5, 1.2);
    this.photographer.fig.anchors.handR.add(cam);
    this.group.add(this.photographer.root);

    // Particles.
    const lit = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.gas = new CubeField(2600, lit, 1);
    this.blood = new CubeField(500, new THREE.MeshLambertMaterial({ color: 0xffffff }), 1);
    this.trails = new CubeField(2400, new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }), 1);
    this.plume = new CubeField(600, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }), 1);
    this.group.add(this.gas.mesh, this.blood.mesh, this.trails.mesh, this.plume.mesh);
  }

  /** Called before each render: keep the sky centred on the camera. */
  follow(camera: THREE.Camera): void {
    this.sky.position.copy(camera.position);
    // onBeforeRender runs after the renderer's matrix update, so refresh the dome here.
    this.sky.updateMatrixWorld(true);
  }

  // --------------------------------------------------------------- update

  update(t: number, cam: THREE.PerspectiveCamera): void {
    this.bullet.visible = false;
    this.bulletLight.intensity = 0;
    this.updateSky(t, cam);
    this.updateZhang(t);
    this.updateStation(t);
    this.updateGroup(t);
    this.updateParticles(t);
    this.updateTraffic(t);
  }

  private updateSky(t: number, cam: THREE.PerspectiveCamera): void {
    const sd = sunDir(t);
    const k = sunK(t);
    const vis = sunVisible(t);
    this.sunMesh.position.copy(sd).multiplyScalar(SUN_DIST);
    this.sunGlow.position.copy(this.sunMesh.position);
    this.sunCorona.position.copy(this.sunMesh.position);
    const glowScale = SUN_DIST * Math.tan(SUN_ANG) * 2;
    this.sunGlow.scale.setScalar(glowScale * 16);
    this.sunCorona.scale.setScalar(glowScale * 4);
    (this.sunGlow.material as THREE.SpriteMaterial).opacity = 0.35 + 0.65 * vis;
    // Screen-space anamorphic streak, strongest while the sun is a ring on the limb.
    this.flare.position.copy(sd).multiplyScalar(40000);
    const ring = Math.exp(-Math.pow(k / 0.9, 2));
    this.flare.scale.set(40000 * (0.4 + ring), 700, 1);
    (this.flare.material as THREE.SpriteMaterial).opacity = clamp(vis * 1.4) * (0.25 + ring * 0.75);
    // Limb glow plane: in front of the Earth, oriented along the limb tangent.
    const L = EARTH_DIR.clone().multiplyScalar(Math.cos(EARTH_ANG)).add(SUN_W.clone().multiplyScalar(Math.sin(EARTH_ANG))).normalize();
    const tangent = new THREE.Vector3().crossVectors(EARTH_DIR, SUN_W).normalize();
    const zAxis = L.clone().negate();
    const yAxis = new THREE.Vector3().crossVectors(zAxis, tangent).normalize();
    this.m4.makeBasis(tangent, yAxis, zAxis);
    this.limb.quaternion.setFromRotationMatrix(this.m4);
    this.limb.position.copy(L).multiplyScalar(47000);
    const limbAmt = clamp(0.35 + vis * 0.9) * (k > -1 ? 1 : Math.max(0.25, 1 + (k + 1) * 1.2));
    this.limb.scale.set(47000 * 0.42 * (0.7 + (1 - vis) * 0.6), 47000 * 0.05 * (0.6 + vis), 1);
    (this.limb.material as THREE.MeshBasicMaterial).opacity = limbAmt;
    this.halo.position.copy(EARTH_DIR).multiplyScalar(47000);
    const angR = Math.tan(EARTH_ANG) * 47000;
    this.halo.scale.setScalar(angR * 2 / 0.89);
    this.earth.mat.uniforms.uSun.value.copy(sd);
    this.earth.mat.uniforms.uGlow.value = 0.35 + 0.65 * clamp(vis * 1.6);
    // Sunlight on the world.
    this.sunLight.position.copy(sd).multiplyScalar(100);
    this.sunLight.target.position.set(0, 0, 0);
    this.sunLight.intensity = 3.4 * Math.pow(vis, 0.8);
    this.sunLight.color.setHex(mixHex(0xff7a30, 0xfff0d8, clamp(k / 2.5)));
    // Base One beacon blinks.
    const blink = (t % 1.6) < 0.18 ? 1 : 0.35;
    (this.base1.material as THREE.SpriteMaterial).opacity = blink;
    void cam;
  }

  /** Zhang's performance as a pure function of time. */
  private zhangState(t: number): { pose: Pose; yaw: number; pitch: number; roll: number; pos: THREE.Vector3 } {
    const drift = float(t * 0.8);
    const calm: Pose = lerpPose(drift, { armR: [-0.3, 0, 0.35], armL: [-0.25, 0, -0.35], legR: [-0.2, 0, 0.05], legL: [-0.1, 0, -0.05] }, 0.5);
    let pose: Pose = calm;
    let yaw = Math.PI + Math.sin(t * 0.05) * 0.12;
    let pitch = 0.05, roll = Math.sin(t * 0.07) * 0.05;
    const pos = new THREE.Vector3(0, Math.sin(t * 0.3) * 0.05, 0);

    if (t < 100) {
      yaw = Math.PI * 0.72 + Math.sin(t * 0.05) * 0.1;
      roll = 0.12 + Math.sin(t * 0.07) * 0.05;
    }
    if (t >= 148 && t < 232) {
      const look = smooth(seg(t, 152, 157));
      pose = { ...calm, neck: [0.1 + look * 0.05, -0.25 * look, 0] };
    }
    const scopeUp: Pose = {
      ...calm,
      neck: [0.16, 0, 0],
      armR: [-2.3, 0.1, 0.45],
      armL: [-0.7, 0, -0.35],
    };
    if (t >= 232 && t < 266) {
      const k = easeInOut(seg(t, 233, 236.5));
      pose = lerpPose(calm, scopeUp, k);
      pose.armR![0] += Math.sin(t * 1.7) * 0.01;
    }
    const twist: Pose = { ...calm, neck: [0.45, 0, 0], armR: [-1.25, 0, 0.3], armL: [-1.2, 0.2, -0.7] };
    const reach: Pose = { ...calm, neck: [0.2, -0.3, 0], armR: [-1.35, 0.3, -0.25], armL: [-0.4, 0, -0.4] };
    const pouch: Pose = { ...calm, neck: [0.55, 0.3, 0], armR: [0.35, 0, 0.35], armL: [-0.5, 0, -0.3] };
    const assemble: Pose = { ...calm, neck: [0.4, 0, 0], armR: [-1.2, 0, 0.25], armL: [-1.25, 0.1, -0.6] };
    const aimP = 0.155;
    const aimPose: Pose = {
      hips: [0, 0, 0], neck: [aimP * 0.6, 0.12, 0],
      armR: [-Math.PI / 2 + aimP, 0.02, 0.08], armL: [-Math.PI / 2 + aimP + 0.08, 0, -0.42],
      legR: [-0.2, 0, 0.05], legL: [-0.12, 0, -0.05],
    };
    if (t >= 266 && t < 284) {
      if (t < 268.8) pose = lerpPose(scopeUp, twist, easeInOut(seg(t, 266, 267.2)));
      else if (t < 272.5) pose = lerpPose(twist, reach, easeInOut(seg(t, 268.8, 270)));
      else if (t < 276) pose = lerpPose(reach, pouch, easeInOut(seg(t, 272.5, 273.8)));
      else if (t < 281.8) pose = lerpPose(pouch, assemble, easeInOut(seg(t, 275.4, 276.8)));
      else pose = lerpPose(assemble, aimPose, easeInOut(seg(t, 281.8, 283.6)));
      if (t >= 266.8 && t < 268.6) pose.armL![1] += Math.sin((t - 266.8) * 9) * 0.12;
      yaw = Math.PI + 0.3 * smooth(seg(t, 269, 271.5)) * (1 - smooth(seg(t, 280, 283)));
    }
    if (t >= 284 && t < 310) {
      pose = { ...aimPose, armR: [...aimPose.armR!] as any, armL: [...aimPose.armL!] as any };
      let kick = 0;
      for (const s of SHOTS) if (t >= s) kick += Math.exp(-(t - s) * 16) * 0.09;
      pose.armR![0] -= kick;
      pose.armL![0] -= kick * 0.8;
      for (const [a, b] of MAG_CHANGES) {
        const m = Math.sin(Math.PI * seg(t, a, b));
        pose.armL![0] = lerp(pose.armL![0], -0.9, m);
        pose.armL![2] = lerp(pose.armL![2], -0.25, m);
      }
      pose.neck = [aimP * 0.6 + 0.02, 0.1, 0];
      yaw = Math.PI;
    }
    if (t >= 310 && t < 324) {
      const lower: Pose = { ...calm, neck: [0.12, 0, 0], armR: [-0.9, 0, 0.2], armL: [-0.5, 0, -0.3] };
      const grab: Pose = { ...calm, neck: [0.3, -0.2, 0], armR: [-1.1, 0.4, -0.1], armL: [-1.25, -0.2, -0.5] };
      pose = lerpPose(aimPose, lower, easeInOut(seg(t, 311, 315)));
      if (t > 320) pose = lerpPose(pose, grab, Math.sin(Math.PI * seg(t, 320.5, 323.5)));
      yaw = Math.PI;
    }
    if (t >= 324) {
      const k = easeInOut(seg(t, 324.3, 327.5));
      const flyPose: Pose = { hips: [0.1, 0, 0], neck: [-0.35, 0, 0], armR: [0.25, 0, 0.18], armL: [0.25, 0, -0.18], legR: [0.12, 0, 0.04], legL: [0.08, 0, -0.04] };
      pose = lerpPose(calm, flyPose, k);
      // Turn to face Base One (azimuth 150°), then lean into the burn.
      const baseYaw = Math.atan2(BASE1_DIR.x, BASE1_DIR.z);
      yaw = lerp(Math.PI, baseYaw, k);
      pitch = lerp(0.05, 0.9, easeInOut(seg(t, 327, 329)));
      const burn = Math.max(0, t - 327.5);
      pos.copy(BASE1_DIR).multiplyScalar(0.5 * 7 * burn * burn);
    }
    return { pose, yaw, pitch, roll, pos };
  }

  private updateZhang(t: number): void {
    const z = this.zhang;
    const s = this.zhangState(t);
    applyPose(z.fig, s.pose);
    this.zhangHolder.position.copy(s.pos);
    this.zhangHolder.rotation.set(0, s.yaw, 0, "YXZ");
    this.zhangHolder.rotateX(s.pitch);
    this.zhangHolder.rotateZ(s.roll);
    performFace(z, t, false);
    z.dress(t >= 268.6 && t < 323.2 ? "suitBare" : "suit");

    this.scopeHand.visible = t >= 232 && t < 266;
    this.pistol.visible = t >= 275.4 && t < 323.4;
    this.scopeGun.visible = t >= 281.6;
    let magVis = false;
    for (const [a, b] of MAG_CHANGES) if (t >= a - 0.1 && t < b - 0.3) magVis = true;
    if (t >= 276 && t < 281) magVis = true;
    this.magL.visible = magVis;
    for (const f of this.packFlames) f.visible = t >= 327.5;

    this.zhangHolder.updateMatrixWorld(true);
    // Hand-held scope looks where Zhang looks: straight at the hatch.
    if (this.scopeHand.visible) {
      this.scopeHand.parent!.getWorldQuaternion(this.q).invert();
      this.m4.lookAt(HATCH, this.scopeHand.getWorldPosition(this.tmp), new THREE.Vector3(0, 1, 0));
      const want = new THREE.Quaternion().setFromRotationMatrix(this.m4);
      this.scopeHand.quaternion.copy(this.q.multiply(want));
      this.scopeHand.position.set(0, 0.2, 0.6);
    }
    // Released scope drifts in front of him until the left hand fixes it on the gun.
    this.scopeFloat.visible = t >= 266 && t < 281.6;
    if (this.scopeFloat.visible) {
      const u = t - 266;
      const k = easeInOut(seg(t, 279.6, 281.5));
      const free = new THREE.Vector3(0.1 + u * 0.004, 1.52 + u * 0.003, -0.48 - u * 0.006);
      const gunPos = this.scopeGun.getWorldPosition(this.tmp2).clone();
      this.scopeFloat.position.copy(free).lerp(gunPos, t >= 276 ? k : 0);
      this.scopeFloat.rotation.set(0.2 + u * 0.03, Math.PI + u * 0.05, u * 0.02);
      if (k > 0 && t >= 276) this.scopeFloat.quaternion.slerp(this.scopeGun.getWorldQuaternion(this.q), k);
    }
    // The removed glove floats away slowly, then is recovered.
    this.glove.visible = t >= 268.6 && t < 323.2;
    if (this.glove.visible) {
      const u = t - 268.6;
      const back = easeInOut(seg(t, 320.8, 322.4));
      const drift = new THREE.Vector3(-0.28 - u * 0.012, 1.25 + u * 0.004, -0.55 - u * 0.004);
      const hand = z.fig.anchors.handL.getWorldPosition(this.tmp2).clone();
      this.glove.position.copy(drift).lerp(hand, back);
      this.glove.rotation.set(u * 0.4, u * 0.25, u * 0.1);
    }
    // Muzzle flash + light.
    let flash = 0;
    for (const s2 of SHOTS) if (t >= s2 && t < s2 + 0.06) flash = 1 - (t - s2) / 0.06;
    this.muzzleFlash.visible = flash > 0 && this.pistol.visible;
    this.muzzleFlash.material.opacity = flash;
    this.muzzle.getWorldPosition(this.tmp);
    this.muzzleLight.position.copy(this.tmp);
    this.muzzleLight.intensity = flash * 30;
    this.firefly.position.copy(this.tmp);
    this.firefly.visible = flash > 0;
    // Thruster.
    this.thrustLight.intensity = t >= 327.5 ? 14 : 0;
    this.zhang.fig.anchors.back.getWorldPosition(this.thrustLight.position);
  }

  private updateStation(t: number): void {
    const green = t >= 238.6;
    this.hatch.lampMat.color.setHex(green ? 0x2aff6a : 0xff2a1a);
    const open = easeInOut(seg(t, 239.0, 240.4));
    this.hatch.door.position.x = open * 3.9;
    for (const s of this.flood) s.intensity = 1.6;
  }

  /** Where participant i is at time t (world). */
  private personPos(i: number, t: number, out: THREE.Vector3): { inside: boolean; moving: number } {
    const te = exitTime(i);
    const home = slot(i);
    // The photographer's "move in a little" adjustment.
    const squeeze = 1.12 - 0.12 * smooth(seg(t, 247.5, 252.5));
    home.x *= squeeze;
    const b = hash(i, 3) * 6.28;
    home.x += Math.sin(t * 0.37 + b) * 0.03;
    home.y += Math.sin(t * 0.29 + b) * 0.04;
    if (t < te) {
      out.copy(HATCH);
      return { inside: true, moving: 0 };
    }
    const k = easeOut(seg(t, te, te + 5.2));
    out.copy(HATCH).lerp(home, k);
    out.y -= 0.9;
    let moving = k < 1 ? 1 - k : 0;

    // Evacuation.
    const hit = HITS[i];
    if (t > 310) {
      if (hit !== undefined) {
        // Dragged by a rescuer.
        const r = RESCUER[i];
        const rp = new THREE.Vector3();
        this.personPos(r, t, rp);
        const leave = seg(t, 311.8, 312.6);
        const knocked = out.clone().add(this.kickback(i, t));
        out.copy(knocked).lerp(rp.add(new THREE.Vector3(0.5, -0.2, 0.3)), smooth(leave));
        return { inside: t > this.evacEnd(r), moving: 0 };
      }
      const s0 = 310.2 + hash(i, 9) * 1.4;
      const e = this.evacEnd(i);
      const k2 = easeIn(seg(t, s0, e));
      const target = HATCH.clone().add(new THREE.Vector3(0, -0.9, 0));
      out.lerp(target, k2);
      moving = t > s0 && t < e ? 1 : 0;
      return { inside: t >= e, moving };
    }
    if (hit !== undefined && t > hit) out.add(this.kickback(i, t));
    return { inside: false, moving };
  }

  private evacEnd(i: number): number {
    const rescuing = Object.values(RESCUER).includes(i);
    return rescuing ? 318.4 + hash(i, 4) * 2.2 : 313.2 + hash(i, 5) * 3.8;
  }

  private kickback(i: number, t: number): THREE.Vector3 {
    const hit = HITS[i];
    const u = Math.max(0, t - hit);
    const d = new THREE.Vector3(0, -800, GROUP_Z).normalize();
    return d.multiplyScalar(0.55 * (1 - Math.exp(-u * 3)) + u * 0.06);
  }

  private updateGroup(t: number): void {
    const talkers = activeSpeakers(t);
    for (let i = 0; i < this.people.length; i++) {
      const a = this.people[i];
      const st = this.personPos(i, t, a.root.position);
      a.root.visible = !st.inside && t >= 238;
      if (!a.root.visible) continue;
      const seed = hash(i, 1) * 10;
      const idle = float(t * 0.6 + seed);
      const posed: Pose = {
        neck: [0.05, Math.sin(t * 0.3 + seed) * 0.12, 0],
        armR: [0.05, 0, 0.12 + Math.sin(t * 0.5 + seed) * 0.03],
        armL: [0.05, 0, -0.12],
        legR: [0, 0, 0.03], legL: [0, 0, -0.03],
      };
      let pose = lerpPose(idle, posed, t > exitTime(i) + 4 ? 0.8 : 0.2);
      a.root.rotation.set(0, 0, 0);
      const hit = HITS[i];
      if (hit !== undefined && t >= hit) {
        const u = t - hit;
        const limp: Pose = { hips: [0.3, 0, 0.2], neck: [0.5, 0.3, 0.2], armR: [-1.8, 0, 0.9], armL: [-1.4, 0, -1.1], legR: [-0.6, 0, 0.2], legL: [-0.3, 0, -0.2] };
        pose = lerpPose(pose, limp, easeOut(seg(u, 0, 0.8)));
        a.root.rotation.set(-u * 0.35 - 0.3 * easeOut(seg(u, 0, 0.4)), u * 0.1 * (i % 2 ? 1 : -1), u * 0.15 * (i % 2 ? -1 : 1));
      } else if (t > 308.6 && t < 322) {
        // Startle, then flee toward the hatch face-first.
        const startle: Pose = { neck: [-0.3, 0, 0], armR: [-2.4, 0, 0.6], armL: [-2.3, 0, -0.6], legR: [-0.5, 0, 0.1], legL: [-0.2, 0, -0.1] };
        const flee: Pose = { neck: [-0.5, 0, 0], armR: [0.3, 0, 0.2], armL: [0.3, 0, -0.2], legR: [0.2, 0, 0], legL: [0.1, 0, 0] };
        pose = lerpPose(pose, startle, easeOut(seg(t, 308.7 + hash(i, 2) * 0.6, 309.4 + hash(i, 2) * 0.6)));
        if (t > 310.2) {
          pose = lerpPose(pose, flee, easeInOut(seg(t, 310.3, 311.2)));
          a.root.rotation.set(-0.9 * easeInOut(seg(t, 310.3, 311.2)), Math.PI, 0);
        }
      }
      applyPose(a.fig, pose);
      // Visors turn clear at dusk; one visor shatters.
      const clearAt = 254.3 + hash(i, 7) * 1.6;
      let outfit = t >= clearAt ? "clear" : "tint";
      if (i === TARGETS[0] && t >= HITS[i]) outfit = "crack";
      a.dress(outfit);
      const name = i === TARGETS[1] ? "与会者甲" : i === TARGETS[0] ? "与会者乙" : "";
      const screaming = t > 309.2 && t < 316 && hit === undefined;
      performFace(a, t, name !== "" && talkers.has(name), screaming ? "scream" : hit !== undefined && t >= hit ? "blink" : TARGETS.includes(i) && t > 256 && t < 308 ? "smile" : "neutral");
    }
    // Photographer.
    const p = this.photographer;
    const pt = 240.1;
    const pk = easeOut(seg(t, pt, pt + 4.5));
    p.root.position.copy(HATCH).add(new THREE.Vector3(0, -0.9, 0)).lerp(PHOTOG, pk);
    p.root.visible = t >= pt && t < 315.5;
    const flee = easeIn(seg(t, 310.6, 315.5));
    p.root.position.lerp(HATCH, flee);
    p.root.rotation.set(0, Math.PI + 0.12, 0);
    const shoot: Pose = { neck: [0.05, 0, 0], armR: [-1.45, 0.1, 0.15], armL: [-1.4, -0.1, -0.35], legR: [-0.1, 0, 0], legL: [0.05, 0, 0] };
    const wave: Pose = { neck: [0, 0, 0], armR: [-1.45, 0.1, 0.15], armL: [-2.6 + Math.sin(t * 5) * 0.25, 0, -0.5], legR: [-0.1, 0, 0], legL: [0.05, 0, 0] };
    let pp = t > 247 && t < 256 ? lerpPose(shoot, wave, Math.sin(Math.PI * seg(t, 247, 256))) : shoot;
    pp = lerpPose(float(t), pp, pk * 0.85);
    applyPose(p.fig, pp);
    performFace(p, t, talkers.has("摄影师"), t > 309 ? "scream" : "neutral");
  }

  private updateParticles(t: number): void {
    const gas = this.gas, blood = this.blood, trails = this.trails, plume = this.plume;
    gas.begin(); blood.begin(); trails.begin(); plume.begin();
    const tmp = this.tmp;
    const bulletDir = new THREE.Vector3(0, -800, GROUP_Z).normalize();

    // Thruster puffs while the group manoeuvres into rows.
    for (let i = 0; i < this.people.length; i++) {
      const a = this.people[i];
      if (!a.root.visible) continue;
      const te = exitTime(i);
      if (t > te && t < te + 6) {
        for (let k = 0; k < 10; k++) {
          const born = te + k * 0.45;
          const age = t - born;
          if (age < 0 || age > 1.6) continue;
          this.personPos(i, born, tmp);
          tmp.y += 1.1;
          tmp.z -= 0.35 + age * 0.6;
          tmp.x += (hash(i, k) - 0.5) * age;
          gas.add(tmp.x, tmp.y, tmp.z, 0.14 * (1 - age / 1.6) + 0.02, 0xe8ecf0);
        }
      }
    }
    // Leaks, the pierced thruster, blood turning to ice.
    for (const key of Object.keys(HITS)) {
      const i = Number(key);
      const hit = HITS[i];
      if (t < hit) continue;
      const a = this.people[i];
      const origin = a.root.position.clone().add(new THREE.Vector3(0, 1.15, 0));
      const leakDur = 9;
      for (let k = 0; k < 160; k++) {
        const born = hit + (k / 160) * leakDur * Math.pow(k / 160, 0.6);
        const age = t - born;
        if (age < 0 || age > 2.4) continue;
        const r = hash(i, k);
        const r2 = hash(k, i, 3);
        const out = k % 2 === 0 ? 1 : -1;
        const sp = 1.2 + r * 2.2;
        tmp.copy(bulletDir).multiplyScalar(out * sp * age);
        tmp.x += (r2 - 0.5) * age * 1.4;
        tmp.y += (hash(k, 7) - 0.5) * age * 1.4;
        tmp.add(origin);
        const fade = 1 - age / 2.4;
        gas.add(tmp.x, tmp.y, tmp.z, (0.05 + age * 0.12) * fade, 0xf4f6f8, age * 3, r * 4, 0);
      }
      if (i === TARGETS[1]) {
        // Pierced propellant tank: one large, fast-expanding cloud.
        const bt = hit + 0.25;
        for (let k = 0; k < 260; k++) {
          const born = bt + (k % 40) * 0.02;
          const age = t - born;
          if (age < 0 || age > 4.5) continue;
          const dir = new THREE.Vector3(hash(k, 1) - 0.5, hash(k, 2) - 0.5, hash(k, 3) - 0.5).normalize();
          const sp = 1.8 + hash(k, 4) * 3;
          const slow = (1 - Math.exp(-age * 1.4)) / 1.4;
          tmp.copy(dir).multiplyScalar(sp * slow).add(origin).add(new THREE.Vector3(0, 0, -0.35));
          gas.add(tmp.x, tmp.y, tmp.z, 0.18 + age * 0.12 * (1 - age / 4.5), 0xffffff, age, k, 0);
        }
      }
      if (i === TARGETS[0]) {
        const head = a.root.position.clone().add(new THREE.Vector3(0, 1.55, 0));
        for (let k = 0; k < 140; k++) {
          const born = hit + 0.1 + (k / 140) * 2.2;
          const age = t - born;
          if (age < 0 || age > 6) continue;
          const dir = new THREE.Vector3(hash(k, 11) - 0.5, hash(k, 12) * 0.6, hash(k, 13) * 0.9 + 0.1).normalize();
          const sp = 0.4 + hash(k, 14) * 1.2;
          tmp.copy(dir).multiplyScalar(sp * age).add(head);
          const freeze = seg(age, 0.15, 1.1);
          const col = mixHex(0x8a0a10, 0xeaf4ff, freeze);
          blood.add(tmp.x, tmp.y, tmp.z, 0.028 + freeze * 0.012, col, age * 5, age * 3, k);
        }
      }
    }
    // Evacuation trails: streams behind every fleeing pack.
    if (t > 310) {
      for (let i = 0; i < this.people.length; i++) {
        if (HITS[i] !== undefined) continue;
        const s0 = 310.2 + hash(i, 9) * 1.4;
        const e = this.evacEnd(i);
        if (t < s0) continue;
        for (let k = 0; k < 40; k++) {
          const born = s0 + k * 0.16;
          if (born > e) break;
          const age = t - born;
          if (age < 0 || age > 3.2) continue;
          this.personPos(i, born, tmp);
          tmp.y += 1.0;
          tmp.z += 0.4 + age * 0.9;
          const f = 1 - age / 3.2;
          trails.add(tmp.x, tmp.y, tmp.z, (0.1 + age * 0.14) * f, 0xe6ecf2, age, k, 0);
        }
      }
    }
    // Zhang's burn home.
    if (t > 327.5) {
      const back = BASE1_DIR.clone().negate();
      for (let k = 0; k < 220; k++) {
        const born = 327.5 + k * 0.04;
        const age = t - born;
        if (age < 0 || age > 2.2) continue;
        const burn = Math.max(0, born - 327.5);
        const p = BASE1_DIR.clone().multiplyScalar(0.5 * 7 * burn * burn);
        const off = back.clone().multiplyScalar(0.5 + age * 6).add(new THREE.Vector3((hash(k, 1) - 0.5) * age * 0.8, 1.0 + (hash(k, 2) - 0.5) * age * 0.8, (hash(k, 3) - 0.5) * age * 0.8));
        p.add(off);
        plume.add(p.x, p.y, p.z, (0.08 + age * 0.2) * (1 - age / 2.2), mixHex(0xcfe6ff, 0x5a7aa8, age / 2.2), age, k, 0);
      }
    }
    gas.end(); blood.end(); trails.end(); plume.end();
  }

  private updateTraffic(t: number): void {
    for (let i = 0; i < this.flyers.length; i++) {
      const f = this.flyers[i];
      const u = ((t + f.t0) % (f.dur + 4)) / f.dur;
      const m = this.flyerMeshes[i];
      const tr = this.flyerTrails[i];
      m.visible = tr.visible = u <= 1;
      if (!m.visible) continue;
      m.position.copy(f.a).lerp(f.b, u);
      const dir = f.b.clone().sub(f.a).normalize();
      tr.position.copy(m.position).addScaledVector(dir, -30);
      tr.lookAt(m.position);
      tr.scale.set(1, 1, 60);
    }
    for (const d of this.debris.children) {
      const s = d.userData.spin, dr = d.userData.drift, p0 = d.userData.p0;
      d.rotation.set(s[0] * t, s[1] * t, s[2] * t);
      d.position.set(p0.x + dr[0] * t, p0.y + dr[1] * t, p0.z + dr[2] * t);
    }
  }

  /** The hero bullet for the tracking shot: travels from muzzle to target 0. */
  bulletAt(t: number, out: THREE.Vector3): THREE.Vector3 {
    const target = slot(TARGETS[0]).add(new THREE.Vector3(0, 0.6, 0));
    const start = new THREE.Vector3(0.15, 1.25, -0.5);
    const hit = HITS[TARGETS[0]];
    const flight = start.distanceTo(target) / 500;
    const u = clamp((t - (hit - flight)) / flight);
    out.copy(start).lerp(target, u);
    return out;
  }

  headOf(a: Actor, out: THREE.Vector3): THREE.Vector3 {
    a.root.updateMatrixWorld(true);
    return a.fig.anchors.head.getWorldPosition(out).add(new THREE.Vector3(0, -0.2, 0));
  }
}

/** Speakers with an active voice cue at t (for lip flap). */
export function activeSpeakers(t: number): Set<string> {
  const s = new Set<string>();
  for (const c of voiceCues) if (t >= c.start && t < c.end) s.add(c.speaker);
  return s;
}

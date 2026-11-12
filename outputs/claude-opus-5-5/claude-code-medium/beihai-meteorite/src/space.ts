import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { canvasTexture, fbm, hash3, glowTexture, rng } from "./util";
import { voxMesh } from "./props";
import type { SetDef } from "./context";

export const EARTH_CENTER = new THREE.Vector3(0, -9500, 34000);
export const EARTH_VOX = 170;
export const EARTH_R = 48;
export const HUB = new THREE.Vector3(0, 0, -1215);
export const HATCH = new THREE.Vector3(0, 0, -1000);
export const BASE1 = new THREE.Vector3(-7000, 2600, 9000);
export const SUN_DIST = 70000;

/* ---------------- Earth ---------------- */

const EARTH_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vCol; varying vec3 vW;
  #include <common>
  #include <logdepthbuf_pars_vertex>
  void main(){
    vCol = color;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position,1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
    #include <logdepthbuf_vertex>
  }
`;
const EARTH_FRAG = /* glsl */ `
  uniform vec3 uSun; uniform vec3 uCenter; uniform float uWarm; uniform float uCloud; uniform float uDim;
  varying vec3 vN; varying vec3 vCol; varying vec3 vW;
  #include <logdepthbuf_pars_fragment>
  void main(){
    #include <logdepthbuf_fragment>
    // smooth spherical normal for the terminator, voxel normal for block shading
    vec3 sn = normalize(vW - uCenter);
    float d = dot(sn, uSun);
    float block = 0.78 + 0.22 * max(dot(vN, uSun), 0.0);
    float day = smoothstep(-0.10, 0.35, d);
    float band = exp(-pow((d - 0.02) / 0.14, 2.0));
    vec3 col = vCol;
    vec3 warm = vec3(1.0, 0.45, 0.18);
    vec3 pink = vec3(1.0, 0.62, 0.62);
    vec3 lit = col * (0.25 + 0.95 * day) * block;
    lit = mix(lit, lit * warm * 2.0, band * uWarm * (1.0 - uCloud));
    lit = mix(lit, col * pink * 1.15, band * uWarm * uCloud);
    // ocean mirror glint near the terminator
    vec3 V = normalize(cameraPosition - vW);
    vec3 H = normalize(V + uSun);
    float isOcean = step(col.b, 0.7) * step(col.r, 0.25) * step(col.g, 0.5) * (1.0 - uCloud);
    float glint = pow(max(dot(sn, H), 0.0), 60.0) * isOcean;
    lit += vec3(1.0, 0.55, 0.25) * glint * 2.2 * uWarm;
    vec3 night = col * vec3(0.02, 0.03, 0.06);
    vec3 outc = mix(night, lit, day + band * 0.25);
    gl_FragColor = vec4(outc * uDim, 1.0);
  }
`;

export function earthMaterial(cloud: boolean) {
  return new THREE.ShaderMaterial({
    vertexShader: EARTH_VERT,
    fragmentShader: EARTH_FRAG,
    vertexColors: true,
    uniforms: {
      uSun: { value: new THREE.Vector3(0, 1, 0) },
      uCenter: { value: EARTH_CENTER.clone() },
      uWarm: { value: 1 },
      uCloud: { value: cloud ? 1 : 0 },
      uDim: { value: 1 },
    },
  });
}

function earthColour(nx: number, ny: number, nz: number): number {
  const lat = Math.abs(ny);
  const n = fbm(nx * 2.3 + 10, ny * 2.3, nz * 2.3, 5, 4);
  if (lat > 0.86 + (n - 0.5) * 0.1) return 0xe6edf2;
  if (n > 0.53) {
    const dry = fbm(nx * 4, ny * 4, nz * 4, 3, 9);
    if (lat < 0.45 && dry > 0.55) return 0xb3955c;
    if (n > 0.66) return 0x5e6b45;
    return dry > 0.5 ? 0x5c7a3e : 0x416b35;
  }
  if (n > 0.5) return 0x2d6fa8;
  return n > 0.42 ? 0x1c4f8c : 0x143c74;
}

export function buildEarth() {
  const R = EARTH_R;
  const span = R * 2 + 4;
  const c = span / 2;
  const ground = buildVoxelGeometry({
    size: [span, span, span],
    at(x, y, z) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c, dz = z + 0.5 - c;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > R) return null;
      if (d < R - 2.2) return 0x101820;
      return earthColour(dx / d, dy / d, dz / d);
    },
  }, { voxel: EARTH_VOX });
  const clouds = buildVoxelGeometry({
    size: [span, span, span],
    at(x, y, z) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c, dz = z + 0.5 - c;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > R + 1.6 || d < R + 0.6) return null;
      const n = fbm(dx / d * 3.1 + 40, dy / d * 5.0, dz / d * 3.1, 4, 31);
      return n > 0.56 ? 0xf4f4f6 : null;
    },
  }, { voxel: EARTH_VOX });
  const group = new THREE.Group();
  const gm = earthMaterial(false);
  const cm = earthMaterial(true);
  const g = new THREE.Mesh(ground, gm);
  const cl = new THREE.Mesh(clouds, cm);
  group.add(g, cl);
  group.position.copy(EARTH_CENTER);
  group.rotation.set(0.35, 2.2, 0.15);

  // night-side city lights (shader fades them on the day side)
  const cityPos: number[] = [];
  const r = rng(77);
  for (let i = 0; i < 2600; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const nx = s * Math.cos(th), ny = u, nz = s * Math.sin(th);
    const n = fbm(nx * 2.3 + 10, ny * 2.3, nz * 2.3, 5, 4);
    if (n < 0.55 || Math.abs(ny) > 0.75 || r() > 0.55) continue;
    const rr = (R + 0.05) * EARTH_VOX;
    cityPos.push(nx * rr, ny * rr, nz * rr);
  }
  const cg = new THREE.BufferGeometry();
  cg.setAttribute("position", new THREE.Float32BufferAttribute(cityPos, 3));
  const cityMat = new THREE.ShaderMaterial({
    uniforms: { uSun: gm.uniforms.uSun, uCenter: gm.uniforms.uCenter, uAmt: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform vec3 uSun; uniform vec3 uCenter; varying float vA;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main(){
        vec4 w = modelMatrix * vec4(position,1.0);
        vec3 n = normalize(w.xyz - uCenter);
        vA = smoothstep(0.02, -0.25, dot(n, uSun)) * step(0.0, dot(n, normalize(cameraPosition - w.xyz)));
        gl_PointSize = 2.0;
        gl_Position = projectionMatrix * viewMatrix * w;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAmt; varying float vA;
      #include <logdepthbuf_pars_fragment>
      void main(){
        #include <logdepthbuf_fragment>
        if (vA * uAmt < 0.01) discard;
        gl_FragColor = vec4(vec3(1.0,0.72,0.36) * vA * uAmt * 1.6, 1.0);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const cities = new THREE.Points(cg, cityMat);
  group.add(cities);

  // atmosphere limb: a ring sprite centred on Earth, occluded by the planet itself
  const ringTex = canvasTexture(256, 256, (ctx) => {
    const img = ctx.createImageData(256, 256);
    const rEarth = 0.80;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const dx = (x - 127.5) / 128, dy = (y - 127.5) / 128;
      const d = Math.sqrt(dx * dx + dy * dy);
      let a = 0;
      if (d >= rEarth - 0.02) a = Math.exp(-Math.pow((d - rEarth) / 0.035, 2)) * 0.9 + Math.exp(-(d - rEarth) / 0.08) * 0.25;
      if (d > 1) a = 0;
      const i = (y * 256 + x) * 4;
      img.data[i] = 120; img.data[i + 1] = 180; img.data[i + 2] = 255; img.data[i + 3] = Math.min(255, a * 255);
    }
    ctx.putImageData(img, 0, 0);
  });
  const atmoMat = new THREE.SpriteMaterial({ map: ringTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 });
  const atmo = new THREE.Sprite(atmoMat);
  atmo.scale.setScalar((R * EARTH_VOX * 1.035) / 0.8 * 2);
  atmo.position.copy(EARTH_CENTER);

  return { group, ground: g, clouds: cl, gm, cm, cityMat, atmo, atmoMat };
}

/* ---------------- Sun ---------------- */

export function buildSun() {
  const tex = canvasTexture(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,250,1)");
    g.addColorStop(0.22, "rgba(255,250,235,1)");
    g.addColorStop(0.26, "rgba(255,210,150,0.75)");
    g.addColorStop(0.45, "rgba(255,160,90,0.22)");
    g.addColorStop(1, "rgba(255,120,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  core.scale.setScalar(SUN_DIST * Math.tan(THREE.MathUtils.degToRad(0.75)) / 0.24 * 2);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff9a50, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(SUN_DIST * Math.tan(THREE.MathUtils.degToRad(7)) * 2);
  const group = new THREE.Group();
  group.add(halo, core);
  return { group, core, halo };
}

export const earthDir = EARTH_CENTER.clone().normalize();
// tangent on the sky: "up and slightly to screen-left" when looking toward +Z
const tangent = new THREE.Vector3(0.32, 1, 0).sub(earthDir.clone().multiplyScalar(new THREE.Vector3(0.32, 1, 0).dot(earthDir))).normalize();
export const EARTH_ANG = Math.asin((EARTH_R * EARTH_VOX) / EARTH_CENTER.length());

/** Sun direction (from the origin) at a given angular offset (deg) of its centre from the Earth's limb. */
export function sunDirection(limbOffsetDeg: number, out = new THREE.Vector3()) {
  const ang = EARTH_ANG + THREE.MathUtils.degToRad(limbOffsetDeg);
  return out.copy(earthDir).multiplyScalar(Math.cos(ang)).addScaledVector(tangent, Math.sin(ang)).normalize();
}

/* ---------------- Huanghe station ---------------- */

export function buildStation() {
  const group = new THREE.Group();
  const V = 3;
  const Ro = 215, Ri = 185, H = 30;
  const n = Math.ceil((Ro * 2) / V);
  const hull = buildVoxelGeometry({
    size: [n, H / V, n],
    at(x, y, z) {
      const px = (x + 0.5) * V - Ro, pz = (z + 0.5) * V - Ro;
      const d = Math.sqrt(px * px + pz * pz);
      if (d > Ro || d < Ri) return null;
      const a = Math.atan2(pz, px);
      const seg = Math.floor((a / (Math.PI * 2)) * 48 + 48) % 2;
      if (y === 0 || y === H / V - 1) return seg ? 0x8d939a : 0x9aa1a8;
      return hash3(x, y, z, 2) > 0.92 ? 0x6e747b : seg ? 0xb9bec4 : 0xc8ccd0;
    },
  }, { voxel: V });
  const hullMesh = voxMesh(hull, voxelMaterial({ roughness: 0.7, metalness: 0.15 }), false);
  hullMesh.receiveShadow = true;
  group.add(hullMesh);

  // windows: rows of warm lights around the rim
  const winPos: number[] = [];
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    for (const yy of [-6, 0, 6]) {
      if (hash3(i, yy, 4) > 0.75) continue;
      winPos.push(Math.cos(a) * (Ro + 0.6), yy, Math.sin(a) * (Ro + 0.6));
    }
  }
  const wg = new THREE.BufferGeometry();
  wg.setAttribute("position", new THREE.Float32BufferAttribute(winPos, 3));
  const windows = new THREE.Points(wg, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.9, sizeAttenuation: true }));
  group.add(windows);

  // spokes + hub
  const spokeMat = voxelMaterial({ roughness: 0.75, metalness: 0.2 });
  for (let k = 0; k < 6; k++) {
    const spoke = buildVoxelGeometry({
      size: [Math.ceil(Ri / 3), 3, 3],
      at(x, y, z) {
        return (x % 6 === 0) ? 0x8a9097 : (y === 1 && z === 1 ? 0x6a7077 : 0xa7adb3);
      },
    }, { voxel: 3, anchor: "min" });
    const m = new THREE.Mesh(spoke, spokeMat);
    const piv = new THREE.Group();
    m.position.set(0, -4.5, -4.5);
    piv.add(m);
    piv.rotation.y = (k / 6) * Math.PI * 2 + 0.26;
    group.add(piv);
  }
  const hub = buildVoxelGeometry({
    size: [20, 30, 20],
    at(x, y, z) {
      const dx = x - 9.5, dz = z - 9.5;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d > 10) return null;
      if (y < 3 || y > 26) return d < 7 ? 0x7d838a : null;
      return y % 6 === 0 ? 0x8a9097 : 0xbfc4c9;
    },
  }, { voxel: 3 });
  group.add(new THREE.Mesh(hub, spokeMat));
  // solar wings on the hub
  const panel = buildVoxelGeometry({
    size: [60, 1, 14],
    at(x, _y, z) {
      if (x < 3) return 0x777d84;
      return (x % 5 === 0 || z % 7 === 0) ? 0x3a4a63 : 0x1d2d4a;
    },
  }, { voxel: 3, anchor: "min" });
  const pm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.6 });
  for (const s of [1, -1]) {
    const p = new THREE.Mesh(panel, pm);
    p.position.set(0, 60, -21);
    p.rotation.set(0, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0.2);
    group.add(p);
  }

  group.position.copy(HUB);

  // hull detail patch around the hatch (finer voxels, faces +Z), world-space
  const patchGroup = new THREE.Group();
  const patch = buildVoxelGeometry({
    size: [64, 40, 1],
    at(x, y) {
      const px = x - 31.5, py = y - 19.5;
      if (Math.sqrt(px * px + py * py) < 7.6) return null;
      if (x % 12 === 0 || y % 10 === 0) return 0x8c9298;
      if ((x + 3) % 12 === 0 && y % 3 === 0) return 0x6d737a;
      return hash3(x, y, 1, 6) > 0.95 ? 0xaab0b6 : 0xc9cdd1;
    },
  }, { voxel: 0.5 });
  const patchMesh = voxMesh(patch, voxelMaterial({ roughness: 0.7, metalness: 0.1 }), false);
  patchMesh.receiveShadow = true;
  patchMesh.position.set(0, 0, HATCH.z + 0.25);
  patchGroup.add(patchMesh);

  // hatch frame ring
  const ring = buildVoxelGeometry({
    size: [18, 18, 2],
    at(x, y, z) {
      const dx = x - 8.5, dy = y - 8.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 8.8 || d < 7.4) return null;
      return z === 1 ? ((x + y) % 4 === 0 ? 0xd8b23a : 0x2a2c30) : 0x5d6369;
    },
  }, { voxel: 0.5 });
  const ringMesh = voxMesh(ring, voxelMaterial({ roughness: 0.6 }), false);
  ringMesh.position.set(0, 0, HATCH.z + 0.6);
  patchGroup.add(ringMesh);

  // the door panel (slides along +X)
  const door = buildVoxelGeometry({
    size: [16, 16, 1],
    at(x, y) {
      const dx = x - 7.5, dy = y - 7.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 7.6) return null;
      if (Math.abs(dx) < 0.6 || d > 6.6) return 0x7a8087;
      return (Math.abs(dy) < 0.6) ? 0x8a9097 : 0xa9afb5;
    },
  }, { voxel: 0.5 });
  const doorMesh = voxMesh(door, voxelMaterial({ roughness: 0.5, metalness: 0.3 }), false);
  doorMesh.position.set(0, 0, HATCH.z + 0.35);
  patchGroup.add(doorMesh);
  // airlock interior glow behind the door
  const inner = new THREE.Mesh(new THREE.CircleGeometry(3.7, 8), new THREE.MeshBasicMaterial({ color: 0x9fb4c8 }));
  inner.position.set(0, 0, HATCH.z - 0.4);
  patchGroup.add(inner);

  // indicator lamp
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xff2a20 });
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.4), lampMat);
  lamp.position.set(5.6, 3.2, HATCH.z + 0.6);
  patchGroup.add(lamp);
  const lampGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff3020, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  lampGlow.scale.setScalar(4);
  lampGlow.position.copy(lamp.position).add(new THREE.Vector3(0, 0, 0.3));
  patchGroup.add(lampGlow);
  // painted "3" exit marking
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshStandardMaterial({
    map: canvasTexture(30, 16, (ctx) => {
      ctx.fillStyle = "#c9cdd1"; ctx.fillRect(0, 0, 30, 16);
      ctx.fillStyle = "#b02a22"; ctx.fillRect(0, 0, 30, 3); ctx.fillRect(0, 13, 30, 3);
      ctx.fillStyle = "#1d1f22"; ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.fillText("3", 15, 12);
    }, true),
  }));
  mark.position.set(-6, 3.2, HATCH.z + 0.52);
  mark.receiveShadow = true;
  patchGroup.add(mark);

  patchGroup.position.z = 1.5;
  return { group, patchGroup, doorMesh, lamp, lampMat, lampGlow };
}

/* ---------------- Elevator, shipyard, base, debris, stars ---------------- */

export function buildSurroundings() {
  const group = new THREE.Group();
  // elevator cable from hub toward Earth
  const from = HUB.clone();
  const to = EARTH_CENTER.clone();
  const len = from.distanceTo(to);
  const cable = new THREE.Mesh(new THREE.BoxGeometry(3, 3, len), new THREE.MeshBasicMaterial({ color: 0x9ea6b0 }));
  cable.position.copy(from).lerp(to, 0.5);
  cable.lookAt(to);
  group.add(cable);
  // climber cars along it
  for (const f of [0.08, 0.21]) {
    const car = voxMesh(buildVoxelGeometry({ size: [6, 6, 10], at: (x, y, z) => ((x + y + z) % 3 ? 0xbfc4c9 : 0xd04030) }, { voxel: 4 }), voxelMaterial(), false);
    car.position.copy(from).lerp(to, f);
    car.lookAt(to);
    group.add(car);
  }

  // shipyard skeleton
  const yard = buildVoxelGeometry({
    size: [80, 22, 22],
    at(x, y, z) {
      const ex = x % 10 === 0, ey = y === 0 || y === 21, ez = z === 0 || z === 21;
      const edges = (ey && ez) || (ex && (ey || ez)) || (ex && ((y === z) || (y === 21 - z)) && x < 60);
      if (!edges) return null;
      if (x > 62 && (y > 0 && y < 21) && !(ey && ez)) return null;
      return hash3(x, y, z, 8) > 0.9 ? 0xd89a3a : 0x8f959c;
    },
  }, { voxel: 18 });
  const yardMesh = new THREE.Mesh(yard, voxelMaterial({ roughness: 0.8 }));
  yardMesh.position.set(-1900, 420, 700);
  yardMesh.rotation.set(0.12, 0.9, 0.05);
  group.add(yardMesh);
  const yardLights: number[] = [];
  const rr = rng(5);
  for (let i = 0; i < 60; i++) yardLights.push((rr() - 0.5) * 1440, (rr() - 0.5) * 396, (rr() - 0.5) * 396);
  const ylg = new THREE.BufferGeometry();
  ylg.setAttribute("position", new THREE.Float32BufferAttribute(yardLights, 3));
  const yl = new THREE.Points(ylg, new THREE.PointsMaterial({ color: 0xffcf70, size: 3, sizeAttenuation: false }));
  yl.position.copy(yardMesh.position);
  yl.rotation.copy(yardMesh.rotation);
  group.add(yl);

  // Base 1: a small station far away
  const base = new THREE.Group();
  const baseGeo = buildVoxelGeometry({
    size: [14, 5, 5],
    at(x, y, z) {
      if (x > 3 && x < 10 && (y === 0 || y === 4) && z > 0 && z < 4) return null;
      return (x % 4 === 0) ? 0x9aa1a8 : 0xc7cbd0;
    },
  }, { voxel: 12 });
  base.add(new THREE.Mesh(baseGeo, voxelMaterial()));
  const beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9fd0ff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  beacon.scale.setScalar(260);
  base.add(beacon);
  base.position.copy(BASE1);
  group.add(base);

  // debris and building material
  const debrisGeo = new THREE.BoxGeometry(1, 1, 1);
  const debrisMat = new THREE.MeshStandardMaterial({ color: 0xb0b4b8, roughness: 0.7, metalness: 0.3 });
  const count = 260;
  const debris = new THREE.InstancedMesh(debrisGeo, debrisMat, count);
  const dr = rng(19);
  const debrisData: Array<{ p: THREE.Vector3; s: THREE.Vector3; r: THREE.Vector3; w: THREE.Vector3 }> = [];
  for (let i = 0; i < count; i++) {
    const dir = new THREE.Vector3(dr() - 0.5, (dr() - 0.5) * 0.5, dr() - 0.5).normalize();
    const dist = 60 + Math.pow(dr(), 1.6) * 2600;
    const p = dir.multiplyScalar(dist);
    p.z -= 500 * dr();
    const big = dr();
    const s = new THREE.Vector3(0.4 + big * 4, 0.3 + dr() * 1.5, 0.4 + dr() * (big > 0.8 ? 14 : 3));
    debrisData.push({ p, s, r: new THREE.Vector3(dr() * 6, dr() * 6, dr() * 6), w: new THREE.Vector3((dr() - 0.5) * 0.2, (dr() - 0.5) * 0.2, (dr() - 0.5) * 0.2) });
    debris.setColorAt(i, new THREE.Color().setHSL(0.58, 0.05, 0.35 + dr() * 0.45));
  }
  group.add(debris);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const updateDebris = (t: number) => {
    for (let i = 0; i < count; i++) {
      const d = debrisData[i]!;
      e.set(d.r.x + d.w.x * t, d.r.y + d.w.y * t, d.r.z + d.w.z * t);
      q.setFromEuler(e);
      m4.compose(d.p, q, d.s);
      debris.setMatrixAt(i, m4);
    }
    debris.instanceMatrix.needsUpdate = true;
  };
  updateDebris(0);

  // stars
  const starPos: number[] = [];
  const starCol: number[] = [];
  const sr = rng(3);
  const band = new THREE.Vector3(0.3, 0.8, -0.5).normalize();
  for (let i = 0; i < 9000; i++) {
    let v = new THREE.Vector3(sr() * 2 - 1, sr() * 2 - 1, sr() * 2 - 1);
    if (v.lengthSq() > 1 || v.lengthSq() < 0.01) continue;
    v.normalize();
    if (i % 2 === 0) {
      // milky way: pull toward the band plane
      const off = v.dot(band);
      if (Math.abs(off) > 0.18 * sr()) continue;
    }
    v = v.multiplyScalar(150000);
    starPos.push(v.x, v.y, v.z);
    const b = 0.35 + Math.pow(sr(), 3) * 0.9;
    const warm = sr();
    starCol.push(b * (0.85 + warm * 0.2), b * 0.92, b * (1.05 - warm * 0.2));
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  sg.setAttribute("color", new THREE.Float32BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false });
  const stars = new THREE.Points(sg, starMat);
  stars.renderOrder = -10;
  group.add(stars);

  return { group, updateDebris, starMat, base, beacon };
}

export function makeSpaceSet(): SetDef {
  const group = new THREE.Group();
  group.name = "space";
  return { name: "space", group, background: new THREE.Color(0x000000), fog: null, exposure: 1.0 };
}

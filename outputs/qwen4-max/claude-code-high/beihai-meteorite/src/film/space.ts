import * as THREE from "three";
import { buildVoxelGeometry, voxelSphere, voxelMaterial } from "@agentbench/voxel-kit";
import { mulberry, hash } from "./helpers";
import { box, voxMesh } from "./sets";
import { ParticleBurst, makeGasJet, makeIceCrystals, makeThrusterTrail } from "./fx";

export interface SpaceSet {
  group: THREE.Group;
  earth: THREE.Mesh;
  earthGlow: THREE.Mesh;
  sun: THREE.Mesh;
  sunGlare: THREE.Sprite;
  sunLight: THREE.DirectionalLight;
  earthshine: THREE.DirectionalLight;
  stars: THREE.Points;
  station: THREE.Group;
  exitDoor: THREE.Mesh;
  exitLight: THREE.Mesh;
  elevator: THREE.Group;
  climber: THREE.Mesh;
  shipyard: THREE.Group;
  baseOne: THREE.Group;
  debris: THREE.Group;
  bullets: THREE.Mesh[];
  gasJets: ParticleBurst[];
  ice: ParticleBurst[];
  trails: ParticleBurst[];
  photoCenter: THREE.Vector3;
  zhangHome: THREE.Vector3;
}

export const STATION_POS = new THREE.Vector3(0, 10, -180);
export const PHOTO_CENTER = new THREE.Vector3(0, 6, -104);
export const EARTH_POS = new THREE.Vector3(0, -640, -860);
export const EARTH_R = 470;

export function buildSpace(): SpaceSet {
  const group = new THREE.Group();
  group.name = "space";

  /* ---- Earth: a blocky blue marble ---- */
  const earthGeo = voxelSphere(30, (x, y, z, d) => {
    const n = hash(x * 1.3 + y * 2.7 + z * 0.9);
    const lat = Math.abs(y - 30) / 30;
    if (lat > 0.86) return 0xeef3f8; // poles
    if (d > 0.97) {
      // surface: land vs ocean
      const cont = hash(Math.floor(x / 3) * 7.1 + Math.floor(z / 3) * 3.3 + Math.floor(y / 3) * 1.7);
      if (cont > 0.62) return n > 0.5 ? 0x3f7a4a : 0x6a7a4a; // land
      return n > 0.7 ? 0x2f6fa8 : 0x255f96; // ocean
    }
    return 0x255f96;
  }, { voxel: 15.5 });
  const earth = new THREE.Mesh(earthGeo, voxelMaterial({ roughness: 1 }));
  earth.position.copy(EARTH_POS);
  group.add(earth);
  // clouds shell
  const clouds = new THREE.Mesh(voxelSphere(30.6, (x, y, z, d) => {
    if (d < 0.9) return null;
    const c = hash(Math.floor(x / 2) * 5.1 + Math.floor(z / 2) * 2.9 + Math.floor(y / 2) * 4.3);
    return c > 0.72 ? 0xf4f8fc : null;
  }, { voxel: 15.5 }), new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.85, roughness: 1 }));
  clouds.position.copy(EARTH_POS);
  group.add(clouds);
  // atmosphere rim glow
  const earthGlow = new THREE.Mesh(voxelSphere(31.4, 0x6ab0ff, { voxel: 15.5 }),
    new THREE.MeshBasicMaterial({ color: 0x5a9aff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false }));
  earthGlow.position.copy(EARTH_POS);
  group.add(earthGlow);

  /* ---- Sun ---- */
  const sun = new THREE.Mesh(voxelSphere(6, 0xfff4d0, { voxel: 6 }),
    new THREE.MeshBasicMaterial({ color: 0xfff6dc }));
  sun.position.set(-520, 320, -1250);
  group.add(sun);
  const sunGlare = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffe9b0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  sunGlare.scale.set(420, 420, 1);
  sunGlare.position.copy(sun.position);
  group.add(sunGlare);
  const sunLight = new THREE.DirectionalLight(0xfff2dc, 3.2);
  sunLight.position.copy(sun.position);
  sunLight.target.position.set(0, 0, -120);
  group.add(sunLight, sunLight.target);
  // blue earthshine fill from below
  const earthshine = new THREE.DirectionalLight(0x4a7ab0, 0.7);
  earthshine.position.set(0, -400, -200);
  earthshine.target.position.set(0, 0, -120);
  group.add(earthshine, earthshine.target);
  group.add(new THREE.AmbientLight(0x1a2030, 0.5));

  /* ---- Stars ---- */
  const starGeo = new THREE.BufferGeometry();
  const sn = 3000, sp = new Float32Array(sn * 3), sc = new Float32Array(sn * 3);
  const rng = mulberry(7);
  for (let i = 0; i < sn; i++) {
    const theta = rng() * Math.PI * 2, phi = Math.acos(2 * rng() - 1), r = 1500 + rng() * 200;
    sp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    sp[i * 3 + 1] = r * Math.cos(phi);
    sp[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const b = 0.4 + rng() * 0.6;
    const warm = rng() > 0.8;
    sc[i * 3] = b; sc[i * 3 + 1] = b * (warm ? 0.85 : 0.95); sc[i * 3 + 2] = b * (warm ? 0.7 : 1);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(sc, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, sizeAttenuation: false }));
  group.add(stars);

  /* ---- Huanghe wheel station ---- */
  const station = new THREE.Group();
  station.position.copy(STATION_POS);
  const wheelGeo = buildVoxelGeometry({
    size: [50, 50, 10],
    at(x, y, z) {
      const dx = x - 25, dy = y - 25, dz = z - 5;
      const rxy = Math.sqrt(dx * dx + dy * dy);
      // rim
      if (Math.abs(rxy - 22) < 3 && Math.abs(dz) < 4) {
        return hash(x + y * 3) > 0.85 ? 0x8a9098 : 0x5a626c;
      }
      // hub
      if (rxy < 7 && Math.abs(dz) < 6) return 0x6a727c;
      // spokes
      const ang = Math.atan2(dy, dx);
      const nearSpoke = Math.abs(Math.sin(ang * 2)) < 0.12;
      if (nearSpoke && rxy >= 7 && rxy < 22 && Math.abs(dz) < 2) return 0x4a525c;
      return null;
    },
  }, { voxel: 2, anchor: "center" });
  station.add(voxMesh(wheelGeo));
  // hub core cylinder along Z
  station.add(box(10, 10, 26, 0x6a727c, 0, 0, 0, { metalness: 0.3, roughness: 0.6 }));
  // solar arrays
  for (const sx of [-1, 1]) {
    const panel = voxMesh(buildVoxelGeometry({
      size: [16, 1, 8], at: (x, y, z) => (x + z) % 2 === 0 ? 0x2a3a5a : 0x1f2f4f,
    }, { voxel: 2, anchor: "min" }), sx * 14, -2, -8);
    station.add(panel);
    station.add(box(12, 0.6, 0.6, 0x4a525c, sx * 12, 0, 0));
  }
  // exit module on the front (+Z) of the hub
  const exitModule = box(8, 7, 6, 0x7a828c, 0, -3, 15, { metalness: 0.3, roughness: 0.6 });
  station.add(exitModule);
  const exitDoor = box(3.4, 4.4, 0.4, 0x3a4048, 0, -3, 18.2, { metalness: 0.5, roughness: 0.4 });
  station.add(exitDoor);
  const exitLight = box(0.6, 0.6, 0.3, 0xd04a3a, 2.6, -1, 18.3, { emissive: 0xd04a3a, emissiveIntensity: 2 });
  station.add(exitLight);
  // station name band + running lights
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    station.add(box(0.8, 0.8, 0.8, 0xffd9a0, Math.cos(a) * 44, Math.sin(a) * 44, 4, { emissive: 0xffc07a, emissiveIntensity: 1.4 }));
  }
  group.add(station);

  /* ---- Space elevator ribbon + climber ---- */
  const elevator = new THREE.Group();
  const ribbon = box(1.2, 520, 1.2, 0x8a9098, 0, 60, -300, { metalness: 0.4, roughness: 0.5, emissive: 0x2a3040, emissiveIntensity: 0.4 });
  elevator.add(ribbon);
  const climber = box(3, 4, 3, 0xffd9a0, 0, 0, -300, { emissive: 0xffc07a, emissiveIntensity: 1.6 });
  elevator.add(climber);
  group.add(elevator);

  /* ---- Shipyard skeleton (a巨兽的骨骼) ---- */
  const shipyard = new THREE.Group();
  shipyard.position.set(250, 60, -360);
  const beam = 0x4a525c;
  const W = 130, H = 90, D = 70;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    shipyard.add(box(3, H, 3, beam, sx * W / 2, 0, sz * D / 2));
  }
  for (const sy of [-1, 1]) for (const sz of [-1, 1]) shipyard.add(box(W, 3, 3, beam, 0, sy * H / 2, sz * D / 2));
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) shipyard.add(box(3, 3, D, beam, sx * W / 2, sy * H / 2, 0));
  // ribs
  for (let i = 0; i < 5; i++) {
    const rx = -W / 2 + (i + 1) * (W / 6);
    shipyard.add(box(2, H, 2, 0x3a424c, rx, 0, -D / 2));
    shipyard.add(box(2, H, 2, 0x3a424c, rx, 0, D / 2));
    shipyard.add(box(2, 2, D, 0x3a424c, rx, H / 2, 0));
  }
  // a few construction lights
  for (let i = 0; i < 6; i++) shipyard.add(box(1.4, 1.4, 1.4, 0xffb060, -W / 2 + hash(i) * W, -H / 2 + hash(i * 3) * H, D / 2, { emissive: 0xffa050, emissiveIntensity: 1.5 }));
  group.add(shipyard);

  /* ---- Base One (small military station) ---- */
  const baseOne = new THREE.Group();
  baseOne.position.set(-270, 40, -400);
  baseOne.add(box(20, 12, 12, 0x5a626c, 0, 0, 0, { metalness: 0.3, roughness: 0.6 }));
  baseOne.add(box(8, 8, 20, 0x6a727c, 14, 0, 0));
  baseOne.add(box(30, 1, 8, 0x2a3a5a, 0, 10, 0));
  for (let i = 0; i < 5; i++) baseOne.add(box(1, 1, 1, 0xffd9a0, -8 + i * 4, 6.5, 6.2, { emissive: 0xffc07a, emissiveIntensity: 1.4 }));
  baseOne.add(box(1.2, 1.2, 1.2, 0xd04a3a, 0, 7, 0, { emissive: 0xd04a3a, emissiveIntensity: 1.6 }));
  group.add(baseOne);

  /* ---- scattered debris / facilities ---- */
  const debris = new THREE.Group();
  const drng = mulberry(13);
  for (let i = 0; i < 46; i++) {
    const a = drng() * Math.PI * 2, r = 70 + drng() * 200, yy = -40 + drng() * 120;
    const s = 0.6 + drng() * 3;
    const blk = box(s, s, s * (0.5 + drng()), drng() > 0.5 ? 0x4a525c : 0x3a424c,
      Math.cos(a) * r, yy, -120 + Math.sin(a) * r * 0.6);
    blk.rotation.set(drng() * 3, drng() * 3, drng() * 3);
    debris.add(blk);
  }
  group.add(debris);

  /* ---- bullets (30 meteorite segments) ---- */
  const bullets: THREE.Mesh[] = [];
  const bulletGeo = buildVoxelGeometry({
    size: [2, 2, 5], at: () => 0x4a4d52,
  }, { voxel: 0.05, anchor: "center" });
  for (let i = 0; i < 30; i++) {
    const b = new THREE.Mesh(bulletGeo, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
    b.visible = false;
    group.add(b);
    bullets.push(b);
  }

  /* ---- impact effects ---- */
  const gasJets: ParticleBurst[] = [];
  const ice: ParticleBurst[] = [];
  const trails: ParticleBurst[] = [];
  for (let i = 0; i < 5; i++) { gasJets.push(makeGasJet(110)); ice.push(makeIceCrystals(80)); }
  for (let i = 0; i < 12; i++) trails.push(makeThrusterTrail(50));
  for (const p of [...gasJets, ...ice, ...trails]) group.add(p.points);

  return {
    group, earth, earthGlow, sun, sunGlare, sunLight, earthshine, stars, station,
    exitDoor, exitLight, elevator, climber, shipyard, baseOne, debris, bullets,
    gasJets, ice, trails,
    photoCenter: PHOTO_CENTER.clone(), zhangHome: new THREE.Vector3(0, 0, 0),
  };
}

/** Place the sun at a given elevation angle for the sunset progression. */
export function setSunElevation(space: SpaceSet, k: number): void {
  // k: 0 = high sun, 1 = fully set below the limb
  const high = new THREE.Vector3(-520, 320, -1250);
  const low = new THREE.Vector3(-760, -180, -1180);
  const p = high.clone().lerp(low, k);
  space.sun.position.copy(p);
  space.sunGlare.position.copy(p);
  space.sunLight.position.copy(p);
  // warm the light as it sets
  const c = new THREE.Color(0xfff2dc).lerp(new THREE.Color(0xff9a4a), k);
  space.sunLight.color.copy(c);
  space.sunLight.intensity = 3.2 * (1 - k * 0.55);
  space.sunGlare.material.opacity = 0.5 * (1 - k * 0.4);
  (space.sun.material as THREE.MeshBasicMaterial).color.copy(new THREE.Color(0xfff6dc).lerp(new THREE.Color(0xffb060), k));
  space.earthshine.intensity = 0.7 + k * 0.3;
}
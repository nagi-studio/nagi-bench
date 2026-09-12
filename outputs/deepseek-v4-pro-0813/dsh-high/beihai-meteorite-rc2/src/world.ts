import * as THREE from "three";
import { voxelSphere, voxelMaterial, buildVoxelGeometry, voxelModel } from "@agentbench/voxel-kit";
import { solidBox, glassMaterial, mulberry32 } from "./util";
import { meteoriteMesh } from "./props";

export interface World {
  house: THREE.Group;
  houseDoor: THREE.Group;
  shop: THREE.Group;
  latheSpindle: THREE.Group;
  basement: THREE.Group;
  beefBundle: THREE.Group;
  beefTarget: THREE.Mesh;
  space: THREE.Group;
  earth: THREE.Mesh;
  sun: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  station: THREE.Group;
  stationHub: THREE.Group;
  photoAnchor: THREE.Group;
  stars: THREE.Points;
  muzzleFlash: THREE.Group;
  muzzleLight: THREE.PointLight;
}

const EARTH_POS = new THREE.Vector3(0, -4, -170);
const STATION_POS = new THREE.Vector3(175, 0, 26);

// ---------------------------------------------------------------------------
// small builders
// ---------------------------------------------------------------------------

function wood(color = 0x4a3728): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05 });
}

function concrete(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0x3c4148, roughness: 0.95, metalness: 0.05 });
}

function displayRock(seed: number, x: number, y: number, z: number): THREE.Mesh {
  const rock = meteoriteMesh(0.06 + mulberry32(seed)() * 0.07, seed);
  rock.position.set(x, y, z);
  rock.rotation.set(
    mulberry32(seed + 1)() * Math.PI,
    mulberry32(seed + 2)() * Math.PI,
    mulberry32(seed + 3)() * Math.PI,
  );
  return rock;
}

function buildCabinet(
  width: number,
  height: number,
  depth: number,
  interiorLight: number,
): THREE.Group {
  const g = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x2e2118, roughness: 0.7, metalness: 0.15 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x1f1711, roughness: 0.8 });

  // carcass
  const back = solidBox(width, height, 0.06, 0x1b1410);
  back.position.set(0, height / 2, -depth / 2);
  g.add(back);
  const top = solidBox(width, 0.08, depth, 0x2e2118);
  top.position.set(0, height, 0);
  g.add(top);
  const bottom = solidBox(width, 0.1, depth, 0x2e2118);
  bottom.position.set(0, 0, 0);
  g.add(bottom);
  const left = solidBox(0.08, height, depth, 0x2e2118);
  left.position.set(-width / 2, height / 2, 0);
  g.add(left);
  const right = solidBox(0.08, height, depth, 0x2e2118);
  right.position.set(width / 2, height / 2, 0);
  g.add(right);

  // glass front
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.3, height - 0.4, 0.03),
    glassMaterial(0.22, 0xbcd6e6),
  );
  glass.position.set(0, height / 2, depth / 2 - 0.02);
  g.add(glass);

  // shelves with meteorites
  const shelfCount = 3;
  for (let s = 0; s < shelfCount; s++) {
    const sy = 0.25 + ((s + 0.5) / shelfCount) * (height - 0.6);
    const shelf = solidBox(width - 0.4, 0.06, depth - 0.2, 0x241a12);
    shelf.position.set(0, sy, 0);
    g.add(shelf);
    const rng = mulberry32(70 + s);
    for (let i = 0; i < 5; i++) {
      const rock = displayRock(
        100 + s * 7 + i,
        (rng() - 0.5) * (width - 0.8),
        sy + 0.09,
        (rng() - 0.5) * (depth - 0.5),
      );
      g.add(rock);
    }
  }

  // interior light
  const light = new THREE.PointLight(interiorLight, 2.4, width + 2, 1.6);
  light.position.set(0, height - 0.15, -depth / 4);
  g.add(light);
  return g;
}

// ---------------------------------------------------------------------------
// House (hutong siheyuan — a dim private geological museum)
// ---------------------------------------------------------------------------

function buildHouse(): { house: THREE.Group; houseDoor: THREE.Group } {
  const house = new THREE.Group();
  house.name = "set-house";

  const room = 8.4;
  const wallH = 3.6;
  const floor = solidBox(room, 0.2, room, 0x2c2117, { roughness: 0.95 });
  floor.position.y = -0.1;
  house.add(floor);

  const wallMat = wood(0x3a2b1c);
  const mkWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = solidBox(w, h, d, 0x3a2b1c, { roughness: 0.95 });
    m.position.set(x, y, z);
    house.add(m);
  };
  mkWall(room, wallH, 0.3, 0, wallH / 2, -room / 2);
  mkWall(room, wallH, 0.3, 0, wallH / 2, room / 2);
  mkWall(0.3, wallH, room, -room / 2, wallH / 2, 0);
  mkWall(0.3, wallH, room, room / 2, wallH / 2, 0);

  // ceiling with exposed beam
  const ceil = solidBox(room, 0.16, room, 0x241a11);
  ceil.position.y = wallH;
  house.add(ceil);
  const beam = solidBox(room, 0.24, 0.3, 0x1c130c);
  beam.position.set(0, wallH - 0.05, 0);
  house.add(beam);

  // doorway on the right wall (open gap visual)
  const houseDoor = new THREE.Group();
  houseDoor.name = "house-door";
  houseDoor.position.set(room / 2 - 0.15, 0, 1.2);
  house.add(houseDoor);

  // perimeter display cabinets
  const cab1 = buildCabinet(3.2, 2.5, 0.7, 0xcfe4ff);
  cab1.position.set(-1.7, 0, -room / 2 + 0.45);
  cab1.rotation.y = Math.PI; // face into room (+z)
  house.add(cab1);

  const cab2 = buildCabinet(2.2, 2.5, 0.7, 0xcfe4ff);
  cab2.position.set(1.9, 0, -room / 2 + 0.45);
  cab2.rotation.y = Math.PI;
  house.add(cab2);

  const cab3 = buildCabinet(2.6, 2.3, 0.6, 0xd8e8f6);
  cab3.position.set(-room / 2 + 0.45, 0, -1.0);
  cab3.rotation.y = Math.PI / 2;
  house.add(cab3);

  // workbench
  const tableTop = solidBox(1.7, 0.1, 0.9, 0x2e2118);
  tableTop.position.set(0, 0.86, -1.3);
  house.add(tableTop);
  for (const sx of [-0.7, 0.7]) {
    for (const sz of [-1.7, -0.9]) {
      const leg = solidBox(0.09, 0.86, 0.09, 0x241a12);
      leg.position.set(sx, 0.43, sz);
      house.add(leg);
    }
  }
  // magnifier lamp on the workbench
  const lampArm = solidBox(0.05, 0.5, 0.05, 0x1d1d20);
  lampArm.position.set(0.55, 1.1, -1.3);
  house.add(lampArm);
  const lampHead = solidBox(0.28, 0.12, 0.2, 0x222227);
  lampHead.position.set(0.55, 1.38, -1.28);
  house.add(lampHead);

  // warm work light
  const key = new THREE.PointLight(0xffc080, 26, 7, 1.8);
  key.position.set(0.55, 1.5, -1.25);
  house.add(key);
  const fill = new THREE.PointLight(0x8fb0d0, 8, 9, 1.8);
  fill.position.set(-2.4, 2.2, 1.6);
  house.add(fill);

  // dim overhead chandelier
  const chan = new THREE.PointLight(0xffd9a0, 6, 9, 1.6);
  chan.position.set(0, wallH - 0.4, 0);
  house.add(chan);

  return { house, houseDoor };
}

// ---------------------------------------------------------------------------
// Machine shop (CNC lathe)
// ---------------------------------------------------------------------------

function buildShop(): { shop: THREE.Group; latheSpindle: THREE.Group } {
  const shop = new THREE.Group();
  shop.name = "set-shop";

  const floor = solidBox(9, 0.2, 8, 0x33383f, { roughness: 0.95 });
  floor.position.y = -0.1;
  shop.add(floor);
  const back = solidBox(9, 4, 0.3, 0x2c3036);
  back.position.set(0, 2, -4);
  shop.add(back);
  const left = solidBox(0.3, 4, 8, 0x2c3036);
  left.position.set(-4.5, 2, 0);
  shop.add(left);
  const right = solidBox(0.3, 4, 8, 0x2c3036);
  right.position.set(4.5, 2, 0);
  shop.add(right);
  const ceil = solidBox(9, 0.2, 8, 0x262a30);
  ceil.position.y = 4;
  shop.add(ceil);

  // lathe body
  const body = solidBox(2.2, 1.1, 1.1, 0x1f6f6a, { roughness: 0.5, metalness: 0.4 });
  body.position.set(0, 0.7, -1.5);
  shop.add(body);
  const head = solidBox(0.9, 1.3, 1.3, 0x164d49, { roughness: 0.4, metalness: 0.5 });
  head.position.set(-0.7, 1.0, -1.5);
  shop.add(head);

  // rotating spindle + chuck
  const latheSpindle = new THREE.Group();
  latheSpindle.position.set(-0.9, 1.0, -1.5);
  const chuck = solidBox(0.42, 0.42, 0.42, 0x8a8f96, { roughness: 0.35, metalness: 0.7 });
  latheSpindle.add(chuck);
  const stock = solidBox(0.09, 0.09, 0.9, 0x343940, { roughness: 0.6, metalness: 0.4 });
  stock.position.set(0, 0, 0.35);
  latheSpindle.add(stock);
  shop.add(latheSpindle);

  // tool post
  const toolpost = solidBox(0.3, 0.4, 0.3, 0x5a5f66, { roughness: 0.4, metalness: 0.6 });
  toolpost.position.set(-0.9, 1.05, -0.9);
  shop.add(toolpost);

  // coolant / work lamp
  const workLight = new THREE.PointLight(0xd8f0ff, 20, 8, 1.8);
  workLight.position.set(0, 2.4, -1.5);
  shop.add(workLight);
  const amb = new THREE.PointLight(0x9fb8d0, 7, 12, 1.8);
  amb.position.set(0, 3, 2);
  shop.add(amb);

  return { shop, latheSpindle };
}

// ---------------------------------------------------------------------------
// Basement (bullet crafting + test fire)
// ---------------------------------------------------------------------------

function buildBasement(): { basement: THREE.Group; beefBundle: THREE.Group; beefTarget: THREE.Mesh } {
  const basement = new THREE.Group();
  basement.name = "set-basement";

  const floor = solidBox(5.2, 0.2, 5.2, 0x2b2f35, { roughness: 0.95 });
  floor.position.y = -0.1;
  basement.add(floor);
  const mk = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = solidBox(w, h, d, 0x23262c);
    m.position.set(x, y, z);
    basement.add(m);
  };
  mk(5.2, 3, 0.3, 0, 1.5, -2.6);
  mk(5.2, 3, 0.3, 0, 1.5, 2.6);
  mk(0.3, 3, 5.2, -2.6, 1.5, 0);
  mk(0.3, 3, 5.2, 2.6, 1.5, 0);
  const ceil = solidBox(5.2, 0.2, 5.2, 0x1c1f24);
  ceil.position.y = 3;
  basement.add(ceil);

  // hanging lamp
  const cord = solidBox(0.04, 0.9, 0.04, 0x14161a);
  cord.position.set(0, 2.55, 0);
  basement.add(cord);
  const shade = solidBox(0.34, 0.2, 0.34, 0x2e343c);
  shade.position.set(0, 2.05, 0);
  basement.add(shade);
  const lamp = new THREE.PointLight(0xffc27a, 22, 6, 1.8);
  lamp.position.set(0, 1.95, 0);
  basement.add(lamp);

  // workbench
  const top = solidBox(1.8, 0.1, 0.8, 0x4a4036);
  top.position.set(0, 0.9, -1.2);
  basement.add(top);
  for (const sx of [-0.8, 0.8]) {
    const leg = solidBox(0.08, 0.9, 0.08, 0x3a332b);
    leg.position.set(sx, 0.45, -1.2);
    basement.add(leg);
  }

  // craft table props: a few cartridges, machined slugs and a glue bottle
  const cartridgeGeo = new THREE.BoxGeometry(0.055, 0.2, 0.055);
  const cartMat = new THREE.MeshStandardMaterial({ color: 0x9a6b2e, roughness: 0.5, metalness: 0.4 });
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(cartridgeGeo, cartMat);
    c.position.set(-0.55 + i * 0.24, 0.95, -1.05);
    basement.add(c);
  }
  const slugGeo = new THREE.BoxGeometry(0.08, 0.16, 0.08);
  const slugMat = new THREE.MeshStandardMaterial({ color: 0x343940, roughness: 0.5, metalness: 0.5 });
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(slugGeo, slugMat);
    c.position.set(-0.55 + i * 0.24, 0.95, -1.35);
    basement.add(c);
  }
  const glue = solidBox(0.16, 0.22, 0.16, 0xb8a06a);
  glue.position.set(0.55, 0.95, -1.3);
  basement.add(glue);

  // beef bundle in the corner (cloth-wrapped target)
  const beefBundle = new THREE.Group();
  beefBundle.name = "beef-bundle";
  beefBundle.position.set(1.7, 0.9, 1.5);
  const cloth = solidBox(0.9, 0.7, 0.9, 0x6b6f78, { roughness: 0.95 });
  cloth.position.y = 0;
  beefBundle.add(cloth);
  const strap = solidBox(0.95, 0.1, 0.95, 0x8a4a2a);
  strap.position.y = 0.1;
  beefBundle.add(strap);
  beefBundle.add(strap);
  const beefTarget = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.5, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x8a3b35, roughness: 0.9 }),
  );
  beefTarget.position.y = 0;
  beefBundle.add(beefTarget);
  basement.add(beefBundle);

  return { basement, beefBundle, beefTarget };
}

// ---------------------------------------------------------------------------
// Space (Earth, sun, wheel station, stars)
// ---------------------------------------------------------------------------

function valueNoise3(seed: number): (x: number, y: number, z: number) => number {
  const rng = mulberry32(seed);
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm.push(i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const hash = (x: number, y: number, z: number) => {
    return perm[(perm[(perm[(x & 255)] + (y & 255)) & 255] + (z & 255)) & 255] / 255;
  };
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;
    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);
    const c000 = hash(xi, yi, zi);
    const c100 = hash(xi + 1, yi, zi);
    const c010 = hash(xi, yi + 1, zi);
    const c110 = hash(xi + 1, yi + 1, zi);
    const c001 = hash(xi, yi, zi + 1);
    const c101 = hash(xi + 1, yi, zi + 1);
    const c011 = hash(xi, yi + 1, zi + 1);
    const c111 = hash(xi + 1, yi + 1, zi + 1);
    const x00 = c000 + (c100 - c000) * u;
    const x10 = c010 + (c110 - c010) * u;
    const x01 = c001 + (c101 - c001) * u;
    const x11 = c011 + (c111 - c011) * u;
    const y0 = x00 + (x10 - x00) * v;
    const y1 = x01 + (x11 - x01) * v;
    return y0 + (y1 - y0) * w;
  };
}

function buildSpace(): {
  space: THREE.Group;
  earth: THREE.Mesh;
  sun: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  station: THREE.Group;
  stationHub: THREE.Group;
  photoAnchor: THREE.Group;
  stars: THREE.Points;
} {
  const space = new THREE.Group();
  space.name = "set-space";

  // stars
  const starCount = 2600;
  const starPos = new Float32Array(starCount * 3);
  const rng = mulberry32(99);
  for (let i = 0; i < starCount; i++) {
    const r = 320 + rng() * 320;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xdfe8f5,
    size: 0.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  });
  const stars = new THREE.Points(starGeo, starMat);
  space.add(stars);

  // Earth — voxel sphere with noise continents + clouds
  const n3 = valueNoise3(1234);
  const earthGeo = voxelSphere(
    26,
    (x, y, z, d) => {
      // sample noise octaves across the voxel grid for coherent continents
      const nx = x * 0.13;
      const ny = y * 0.13;
      const nz = z * 0.13;
      const land = n3(nx, ny, nz) + 0.5 * n3(nx * 2.1 + 9, ny * 2.1, nz * 2.1 + 3);
      const cloud = n3(nx * 3.3 + 40, ny * 3.3, nz * 3.3 + 7);
      const lat = Math.abs(y - 26) / 26; // 0 equator, 1 pole
      if (lat > 0.88) return 0xeaf2f7; // polar ice
      if (land > 0.62) {
        if (cloud > 0.72) return 0xf2f4f6;
        return land > 0.74 ? 0x4a7a4e : 0x6a915a;
      }
      return land > 0.5 ? 0x2f6b8f : 0x1f4f74;
    },
    { voxel: 1.65 },
  );
  const earth = new THREE.Mesh(earthGeo, voxelMaterial({ roughness: 0.9 }));
  earth.position.copy(EARTH_POS);
  space.add(earth);

  // sun glow disk near Earth's limb
  const sunGeo = voxelSphere(
    6,
    (x, y, z, d) => (d > 0.62 ? 0xffd9a0 : 0xfff6d8),
    { voxel: 1.1 },
  );
  const sun = new THREE.Mesh(
    sunGeo,
    new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, toneMapped: false }),
  );
  sun.position.set(-52, 6, -168);
  space.add(sun);

  const sunLight = new THREE.DirectionalLight(0xffd9b0, 2.6);
  sunLight.position.copy(sun.position);
  space.add(sunLight);

  // soft key light from the camera side so Earth / station / figures stay readable
  const keyLight = new THREE.DirectionalLight(0xe8eef7, 1.25);
  keyLight.position.set(0, 60, 120);
  keyLight.target.position.set(0, 0, -90);
  space.add(keyLight);
  space.add(keyLight.target);

  // Wheel station — torus ring in YZ plane (axis along X), plus hub and spokes
  const station = new THREE.Group();
  station.name = "station";
  const R = 26; // ring radius
  const tube = 5;
  const voxel = 1.15;
  const span = Math.ceil(R + tube) * 2 + 2;
  const ringGeo = buildVoxelGeometry(
    {
      size: [span, span, span],
      at(x, y, z) {
        const cx = x - span / 2;
        const cy = y - span / 2;
        const cz = z - span / 2;
        const radial = Math.sqrt(cy * cy + cz * cz);
        const tubeDist = Math.sqrt((radial - R) * (radial - R) + cx * cx);
        if (tubeDist > tube) return null;
        // module detailing
        const ang = Math.atan2(cz, cy);
        const ring = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 12);
        if (Math.abs(cx) < 1.2) return ring % 2 === 0 ? 0x9aa2ad : 0xc6cad1;
        return ring % 2 === 0 ? 0x767d88 : 0xa8adb6;
      },
    },
    { voxel, anchor: "min" },
  );
  const ringMesh = new THREE.Mesh(ringGeo, voxelMaterial({ roughness: 0.8, metalness: 0.3 }));
  ringMesh.position.set(0, 0, 0);
  station.add(ringMesh);

  // hub
  const hubGeo = voxelSphere(6, (x, y, z, d) => (d > 0.55 ? 0xb9bec7 : 0xd7dbe2), { voxel: 1.15 });
  const stationHub = new THREE.Mesh(hubGeo, voxelMaterial({ roughness: 0.7, metalness: 0.35 }));
  station.add(stationHub);

  // spokes
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.4, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x9aa2ad, roughness: 0.8, metalness: 0.3 }),
    );
    spoke.position.set(0, Math.cos(ang) * (R / 2), Math.sin(ang) * (R / 2));
    spoke.rotation.x = ang;
    station.add(spoke);
  }

  // photo platform on the rim (near side, facing -X toward Zhang)
  const photoAnchor = new THREE.Group();
  photoAnchor.position.set(2.5, R, 0); // on the rim at top, slightly +x side
  station.add(photoAnchor);

  station.position.copy(STATION_POS);
  station.rotation.y = 0; // ring already face-on to -X
  space.add(station);

  return { space, earth, sun, sunLight, station, stationHub, photoAnchor, stars };
}

// ---------------------------------------------------------------------------
// Muzzle flash
// ---------------------------------------------------------------------------

function buildMuzzleFlash(): { muzzleFlash: THREE.Group; muzzleLight: THREE.PointLight } {
  const muzzleFlash = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.09, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xffe6b0, toneMapped: false }),
  );
  muzzleFlash.add(core);
  const spikes: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xffc46a, toneMapped: false }),
    );
    s.position.z = 0.1;
    s.rotation.z = (i / 6) * Math.PI * 2;
    muzzleFlash.add(s);
    spikes.push(s);
  }
  const muzzleLight = new THREE.PointLight(0xffc46a, 0, 6, 1.6);
  muzzleFlash.add(muzzleLight);
  muzzleFlash.visible = false;
  return { muzzleFlash, muzzleLight };
}

export function buildWorld(): World {
  const { house, houseDoor } = buildHouse();
  const { shop, latheSpindle } = buildShop();
  const { basement, beefBundle, beefTarget } = buildBasement();
  const { space, earth, sun, sunLight, station, stationHub, photoAnchor, stars } = buildSpace();
  const { muzzleFlash, muzzleLight } = buildMuzzleFlash();

  const world: World = {
    house,
    houseDoor,
    shop,
    latheSpindle,
    basement,
    beefBundle,
    beefTarget,
    space,
    earth,
    sun,
    sunLight,
    station,
    stationHub,
    photoAnchor,
    stars,
    muzzleFlash,
    muzzleLight,
  };

  for (const set of [house, shop, basement, space]) {
    set.visible = false;
  }

  return world;
}

export { EARTH_POS, STATION_POS };

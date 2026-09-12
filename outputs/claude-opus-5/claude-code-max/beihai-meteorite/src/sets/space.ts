import * as THREE from "three";
import { buildVoxelGeometry, voxelSphere } from "@agentbench/voxel-kit";

import { debrisField, glowMat, grainy, hash3, mesh, meteoriteGeometry, mixHex, rng, shade, slab, starField, voxMat } from "../lib/vox";
import { meteoriteSlugGeometry } from "../art/props";
import type { Cast } from "../cast";
import { CROWD_COUNT } from "../cast";

/**
 * 轨道。
 *
 * 这一半的规矩是：没有天，没有地，没有回声。所有硬表面都是体素，
 * 所有光只有一个来源 —— 那颗正在沉下去的太阳。等它沉完，画面里就
 * 只剩地球边缘的一道橘线和三十次谁也听不见的闪光。
 */

const HULL = 0xb4b6b0;
const HULL_DARK = 0x6d7076;
const HULL_DEEP = 0x43474d;

/** 站体外壳的通用花纹：板缝、加强筋、编号色块。 */
function hullColour(x: number, y: number, z: number, seed: number): number {
  const seam = (x + y * 3) % 9 === 0 || (z + y) % 11 === 0;
  const patch = hash3(Math.floor(x / 5), Math.floor(y / 5), Math.floor(z / 5), seed);
  let base = seam ? HULL_DARK : HULL;
  if (patch > 0.9) base = 0x8b8f96;
  else if (patch < 0.12) base = 0x9aa0a6;
  return grainy(base, x, y, z, 0.05, seed);
}

/** 车轮形的黄河空间站。轮缘 + 轮毂 + 六根辐条，外加一圈舷窗。 */
function wheelStation(
  majorRadius: number,
  minorRadius: number,
  voxel: number,
  seed: number,
): { hull: THREE.BufferGeometry; lights: THREE.BufferGeometry } {
  const span = Math.ceil((majorRadius + minorRadius) * 2) + 4;
  const c = span / 2;
  const height = Math.ceil(minorRadius * 2) + 4;
  const hc = height / 2;

  const sample = (x: number, y: number, z: number, wantLights: boolean): number | null => {
    const dx = x + 0.5 - c;
    const dy = y + 0.5 - hc;
    const dz = z + 0.5 - c;
    const planar = Math.sqrt(dx * dx + dz * dz);
    const ring = Math.sqrt((planar - majorRadius) ** 2 + dy * dy);
    const angle = Math.atan2(dz, dx);
    const isWindow = ring > minorRadius - 1.2 && Math.abs(dy) < 1.2 &&
      Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 96) % 2 === 0;
    if (ring <= minorRadius) {
      if (isWindow) return wantLights ? 0xffe2ae : null;
      return wantLights ? null : hullColour(x, y, z, seed);
    }
    // 轮毂
    const hub = Math.sqrt(planar * planar + dy * dy * 2.2);
    if (hub <= majorRadius * 0.2) return wantLights ? null : hullColour(x, y, z, seed + 3);
    // 辐条
    const spokeIndex = ((angle + Math.PI) / (Math.PI * 2)) * 6;
    const nearSpoke = Math.abs(spokeIndex - Math.round(spokeIndex)) < 0.055;
    if (nearSpoke && planar < majorRadius && Math.abs(dy) < 1.4) {
      return wantLights ? null : shade(hullColour(x, y, z, seed + 7), 0.85);
    }
    return null;
  };

  return {
    hull: buildVoxelGeometry(
      { size: [span, height, span], at: (x, y, z) => sample(x, y, z, false) },
      { voxel, anchor: "center" },
    ),
    lights: buildVoxelGeometry(
      { size: [span, height, span], at: (x, y, z) => sample(x, y, z, true) },
      { voxel, anchor: "center" },
    ),
  };
}

/** 太空船坞：只有一副施工框架，像一架巨兽的骨骼。 */
function shipyardSkeleton(voxel: number): { hull: THREE.BufferGeometry; lights: THREE.BufferGeometry } {
  const sx = 60;
  const sy = 26;
  const sz = 26;
  const sample = (x: number, y: number, z: number, wantLights: boolean): number | null => {
    const onY = y === 0 || y === sy - 1;
    const onZ = z === 0 || z === sz - 1;
    const edge = (onY ? 1 : 0) + (onZ ? 1 : 0);
    const rib = x % 7 === 0;
    const spine = (y === Math.floor(sy / 2) && onZ) || (z === Math.floor(sz / 2) && onY);
    const keel = y === 0 && z === Math.floor(sz / 2);
    let solid = false;
    if (edge === 2) solid = true;                                   // 四条大梁
    else if (rib && (onY || onZ)) solid = true;                     // 肋
    else if (rib && (y === 0 || z === 0)) solid = true;
    else if (spine || keel) solid = true;
    // 肋骨的竖向部分
    if (!solid && rib && (x % 14 === 0) && (z === 0 || z === sz - 1)) solid = true;
    if (!solid) return null;
    const beacon = rib && x % 21 === 0 && edge === 2;
    if (wantLights) return beacon ? 0xff5f4a : null;
    if (beacon) return null;
    return grainy(mixHex(0x7d7f84, 0x4a4d52, ((x * 7 + y * 3 + z) % 5) / 5), x, y, z, 0.08, 71);
  };
  return {
    hull: buildVoxelGeometry({ size: [sx, sy, sz], at: (x, y, z) => sample(x, y, z, false) }, { voxel, anchor: "center" }),
    lights: buildVoxelGeometry({ size: [sx, sy, sz], at: (x, y, z) => sample(x, y, z, true) }, { voxel, anchor: "center" }),
  };
}

/** 一个小站：圆筒 + 两片太阳翼。规模只有黄河站的五分之一。 */
function moduleStation(seed: number, voxel: number): { hull: THREE.BufferGeometry; lights: THREE.BufferGeometry } {
  const sx = 26;
  const sy = 12;
  const sz = 12;
  const sample = (x: number, y: number, z: number, wantLights: boolean): number | null => {
    const dy = y + 0.5 - sy / 2;
    const dz = z + 0.5 - sz / 2;
    const r = Math.sqrt(dy * dy + dz * dz);
    const body = x > 4 && x < sx - 5 && r < 4.6;
    if (body) {
      const window_ = r > 3.6 && x % 4 === 1 && Math.abs(dz) > 3;
      if (window_) return wantLights ? 0xffdca8 : null;
      return wantLights ? null : hullColour(x, y, z, seed);
    }
    const panel = Math.abs(dy) < 0.6 && (x <= 4 || x >= sx - 5) && r < 5.6;
    if (panel) return wantLights ? null : grainy(0x27406b, x, y, z, 0.12, seed + 2);
    return null;
  };
  return {
    hull: buildVoxelGeometry({ size: [sx, sy, sz], at: (x, y, z) => sample(x, y, z, false) }, { voxel, anchor: "center" }),
    lights: buildVoxelGeometry({ size: [sx, sy, sz], at: (x, y, z) => sample(x, y, z, true) }, { voxel, anchor: "center" }),
  };
}

function particleCloud(count: number, seed: number, colour: number, size: number): THREE.Points {
  const random = rng(seed);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.userData.data = Array.from({ length: count }, () => [random(), random(), random(), random()]);
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: colour,
      size,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    }),
  );
  points.frustumCulled = false;
  return points;
}

export interface SpaceSet {
  root: THREE.Group;
  stars: THREE.Points;
  earth: THREE.Mesh;
  nightLights: THREE.Mesh;
  atmosphere: THREE.Mesh;
  bulletCloseup: THREE.Group;
  /** 片头那块还没有被切开的铁陨石。 */
  heroStone: THREE.Mesh;
  sun: THREE.Mesh;
  sunGlow: THREE.Sprite;
  sunLight: THREE.DirectionalLight;
  earthFill: THREE.HemisphereLight;
  elevator: THREE.Mesh;
  wheel: THREE.Group;
  wheelLights: THREE.Mesh;
  shipyard: THREE.Group;
  baseOne: THREE.Group;
  debris: { group: THREE.Group; tumble: (time: number) => void };
  /** 远景里代表合影队伍的一小簇白点。 */
  distantCrowd: THREE.Points;
  /** 近景舞台：站体外壁、闸门、三十个人。只在瞄准镜视点里出现。 */
  stage: THREE.Group;
  hatch: THREE.Group;
  hatchDoor: THREE.Object3D;
  hatchLamp: THREE.Mesh;
  stageKey: THREE.PointLight;
  stageRim: THREE.PointLight;
  crowdAnchor: THREE.Group;
  thrusterMist: THREE.Points;
  ventGas: THREE.Points;
  iceCrystals: THREE.Points;
  /** 三十枚正在飞行的陨石弹头。 */
  bullets: THREE.Points;
  dispose(): void;
}

export const STAGE_ORIGIN = new THREE.Vector3(2600, 0, 0);

/**
 * 太阳的高度角。整部太空戏就是这一个数从 -9 度走到 -25 度的过程：
 * 光越来越低、越来越红，最后只剩地球边缘的一道戒指。
 */
export function setSun(space: SpaceSet, elevationDeg: number): void {
  // 方位角贴着地球中心那条子午线，太阳才会真的沉进地球的边缘：
  // 从章北海那里看，地球的角半径约 30 度，上边缘在 -15 度高度角上。
  const e = THREE.MathUtils.degToRad(elevationDeg);
  const az = THREE.MathUtils.degToRad(-13);
  const distance = 900;
  const dir = new THREE.Vector3(
    Math.sin(az) * Math.cos(e),
    Math.sin(e),
    -Math.cos(az) * Math.cos(e),
  );
  space.sun.position.copy(dir).multiplyScalar(distance);
  space.sunGlow.position.copy(space.sun.position);
  space.sunLight.position.copy(dir).multiplyScalar(600);
  space.sunLight.target.position.set(0, 0, 0);
  space.sunLight.target.updateMatrixWorld();

  // 从章北海那里看，太阳在高度角约 -11.5 度时开始接触地球的边缘，
  // 到 -18 度已经完全沉下去，只剩边缘上的一道戒指。
  const set = THREE.MathUtils.clamp((elevationDeg + 18) / 8, 0, 1);
  space.sunLight.intensity = 0.18 + set * 3.3;
  space.sunLight.color.setRGB(1, 0.42 + set * 0.53, 0.16 + set * 0.72);
  space.sunGlow.scale.setScalar(220 + (1 - set) * 210);
  (space.sunGlow.material as THREE.SpriteMaterial).opacity = 0.35 + set * 0.55;
  (space.sunGlow.material as THREE.SpriteMaterial).color.setRGB(1, 0.5 + set * 0.45, 0.22 + set * 0.6);
  space.earthFill.intensity = 0.08 + set * 0.34;
  space.stageKey.intensity = 340 + set * 420;
  space.stageKey.color.setRGB(1, 0.5 + set * 0.36, 0.24 + set * 0.5);
  space.stageRim.intensity = 110 + set * 90;
  (space.atmosphere.material as THREE.MeshBasicMaterial).opacity = 0.05 + set * 0.13;
  (space.nightLights.material as THREE.MeshBasicMaterial).opacity = 0.95 - set * 0.45;
}

export function buildSpace(cast: Cast): SpaceSet {
  const root = new THREE.Group();
  const owned: Array<{ dispose(): void }> = [];
  const keep = <G extends { dispose(): void }>(g: G): G => {
    owned.push(g);
    return g;
  };
  const hullMat = voxMat("hull", { roughness: 0.82, metalness: 0.15 });
  const lampMat = glowMat(0xffffff);
  lampMat.vertexColors = true;
  keep(lampMat);

  const stars = starField(2600, 5200, 17);
  root.add(stars);

  // ── 地球 ────────────────────────────────────────────────────────────
  const earthGeometry = keep(
    voxelSphere(
      34,
      (x, y, z) => {
        const nx = x - 34;
        const ny = y - 34;
        const nz = z - 34;
        const lat = Math.asin(Math.max(-1, Math.min(1, ny / 34)));
        const continent =
          hash3(Math.floor(x / 5), Math.floor(y / 5), Math.floor(z / 5), 3) * 0.6 +
          hash3(Math.floor(x / 11), Math.floor(y / 11), Math.floor(z / 11), 9) * 0.55;
        const cloud = hash3(Math.floor((x + nz) / 3), Math.floor(y / 6), Math.floor((z - nx) / 3), 21);
        const ice = Math.abs(lat) > 1.16;
        if (ice) return 0xdfe6ea;
        if (cloud > 0.79) return 0xd8dee2;
        if (continent > 0.66) return mixHex(0x3f6b3c, 0x6d6a3f, hash3(x, y, z, 33));
        if (continent > 0.61) return 0x7d7a52;
        return mixHex(0x1c3f68, 0x2b5c86, hash3(x, y, z, 41) * 0.8);
      },
      { voxel: 3.6, anchor: "center" },
    ),
  );
  const earth = new THREE.Mesh(earthGeometry, voxMat("earth-globe", { roughness: 1, metalness: 0 }));
  earth.position.set(0, -150, -150);
  earth.rotation.y = 0.7;
  root.add(earth);

  // 夜面的城市灯。加性混合，所以只在背光的那一半看得见。
  const nightLights = new THREE.Mesh(
    keep(
      voxelSphere(
        34,
        (x, y, z, distance) => {
          if (distance < 0.985) return null;
          const lat = Math.abs((y - 34) / 34);
          if (lat > 0.82) return null;
          const land =
            hash3(Math.floor(x / 5), Math.floor(y / 5), Math.floor(z / 5), 3) * 0.6 +
            hash3(Math.floor(x / 11), Math.floor(y / 11), Math.floor(z / 11), 9) * 0.55;
          if (land < 0.63) return null;
          if (hash3(x, y, z, 101) < 0.86) return null;
          return hash3(x, y, z, 103) > 0.7 ? 0xffd9a0 : 0xffb15e;
        },
        { voxel: 3.6, anchor: "center" },
      ),
    ),
    keep(
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        fog: false,
      }),
    ),
  );
  nightLights.position.copy(earth.position);
  nightLights.rotation.copy(earth.rotation);
  root.add(nightLights);

  const atmosphere = new THREE.Mesh(
    keep(voxelSphere(36, () => 0x5aa0e6, { voxel: 3.6, anchor: "center" })),
    keep(
      new THREE.MeshBasicMaterial({
        color: 0x6fb2f0,
        transparent: true,
        opacity: 0.13,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        fog: false,
      }),
    ),
  );
  atmosphere.position.copy(earth.position);
  root.add(atmosphere);

  // ── 太阳 ────────────────────────────────────────────────────────────
  const sun = new THREE.Mesh(
    keep(slab([5, 5, 5], 0xfff6e2, { voxel: 5.4, anchor: "center", grain: 0 })),
    keep(glowMat(0xfff4dc)),
  );
  root.add(sun);

  // 落日的光晕。用 ImageData 逐像素画，而不是 createRadialGradient ——
  // 这样这张图在任何 2D 画布实现上都是同一张。
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = 128;
  glowCanvas.height = 128;
  const glowCtx = glowCanvas.getContext("2d")!;
  const glowImage = glowCtx.createImageData(128, 128);
  for (let y = 0; y < 128; y += 1) {
    for (let x = 0; x < 128; x += 1) {
      const dx = (x + 0.5 - 64) / 64;
      const dy = (y + 0.5 - 64) / 64;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const core = Math.pow(Math.max(0, 1 - r / 0.18), 2);
      const halo = Math.pow(Math.max(0, 1 - r), 3.1);
      const alpha = Math.min(1, core + halo * 0.62);
      const at = (y * 128 + x) * 4;
      glowImage.data[at] = 255;
      glowImage.data[at + 1] = Math.round(180 + core * 66 - r * 60);
      glowImage.data[at + 2] = Math.round(90 + core * 134 - r * 70);
      glowImage.data[at + 3] = Math.round(alpha * 255);
    }
  }
  glowCtx.putImageData(glowImage, 0, 0);
  const glowTexture = keep(new THREE.CanvasTexture(glowCanvas));
  const sunGlow = new THREE.Sprite(
    keep(
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        fog: false,
      }),
    ),
  );
  sunGlow.scale.setScalar(340);
  sunGlow.position.copy(sun.position);
  root.add(sunGlow);

  const sunLight = new THREE.DirectionalLight(0xfff2dc, 3.4);
  root.add(sunLight);
  root.add(sunLight.target);
  const earthFill = new THREE.HemisphereLight(0x2a4f78, 0x05070c, 0.5);
  root.add(earthFill);
  // 电梯、站体和地球日面的反光。太阳是硬的逆光，全靠这一层把人从黑里捞出来 ——
  // 只作用在第 1 层，也就是只作用在人身上，免得把本该是夜面的地球一起照亮。
  const bounce = new THREE.DirectionalLight(0x9dc2e8, 1.15);
  bounce.position.set(240, 150, 620);
  bounce.layers.set(1);
  root.add(bounce, bounce.target);

  // ── 太空电梯 ────────────────────────────────────────────────────────
  // 一根从地表升上来、穿过站体、继续伸出画面的细线。
  const elevatorPivot = new THREE.Group();
  elevatorPivot.position.copy(earth.position);
  elevatorPivot.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(-0.036, 0.975, -0.219).normalize(),
  );
  root.add(elevatorPivot);
  const elevator = new THREE.Mesh(
    keep(
      buildVoxelGeometry(
        {
          size: [2, 220, 2],
          at(x, y, z) {
            if (y % 17 === 0) return grainy(0xa8aab0, x, y, z, 0.1, 61);
            return grainy(0x83868c, x, y, z, 0.08, 62);
          },
        },
        { voxel: 1.2, anchor: "center" },
      ),
    ),
    hullMat,
  );
  elevator.position.set(0, 160, 0);
  elevatorPivot.add(elevator);

  // ── 黄河空间站 ──────────────────────────────────────────────────────
  const wheelParts = wheelStation(30, 5.2, 1.5, 51);
  keep(wheelParts.hull);
  keep(wheelParts.lights);
  const wheel = new THREE.Group();
  wheel.position.set(-6, 10, -186);
  wheel.rotation.set(0.34, 0.2, 0.12);
  root.add(wheel);
  mesh(wheelParts.hull, wheel, { material: hullMat });
  const wheelLights = mesh(wheelParts.lights, wheel, { material: lampMat });

  // ── 太空船坞 ────────────────────────────────────────────────────────
  const yardParts = shipyardSkeleton(2.6);
  keep(yardParts.hull);
  keep(yardParts.lights);
  const shipyard = new THREE.Group();
  shipyard.position.set(-420, -70, -190);
  shipyard.rotation.set(0.1, 1.02, -0.16);
  root.add(shipyard);
  mesh(yardParts.hull, shipyard, { material: hullMat });
  mesh(yardParts.lights, shipyard, { material: lampMat });

  // ── 周围零星的小站 ──────────────────────────────────────────────────
  const random = rng(83);
  for (let i = 0; i < 5; i += 1) {
    const parts = moduleStation(90 + i, 0.9 + random() * 0.5);
    keep(parts.hull);
    keep(parts.lights);
    const unit = new THREE.Group();
    unit.position.set(-320 + random() * 640, -110 + random() * 190, -560 + random() * 330);
    unit.rotation.set(random() * 3, random() * 3, random() * 3);
    root.add(unit);
    mesh(parts.hull, unit, { material: hullMat });
    mesh(parts.lights, unit, { material: lampMat });
  }

  // ── 太空军一号基地 ──────────────────────────────────────────────────
  const baseParts = moduleStation(120, 1.15);
  keep(baseParts.hull);
  keep(baseParts.lights);
  const baseOne = new THREE.Group();
  baseOne.position.set(150, 26, 96);
  baseOne.rotation.set(0.2, -0.9, 0.1);
  root.add(baseOne);
  mesh(baseParts.hull, baseOne, { material: hullMat });
  mesh(baseParts.lights, baseOne, { material: lampMat });

  const debris = debrisField(150, 210, 29);
  root.add(debris.group);

  // 远景里，闸门口那一小簇白点就是三十个人
  const distantCrowd = particleCloud(30, 55, 0xf0f2ee, 1.9);
  distantCrowd.position.set(6, 6, -150);
  (distantCrowd.material as THREE.PointsMaterial).opacity = 0;
  {
    const data = distantCrowd.geometry.userData.data as number[][];
    const positions = distantCrowd.geometry.attributes.position as THREE.BufferAttribute;
    data.forEach((d, i) => {
      positions.setXYZ(i, (i % 10) * 2.1 - 9.5, Math.floor(i / 10) * 2.0 - 2 + d[0]! * 0.4, d[1]! * 1.5);
    });
    positions.needsUpdate = true;
  }
  root.add(distantCrowd);

  // ── 近景舞台 ────────────────────────────────────────────────────────
  // 五公里在画面上无法既看清人又看清站，所以合影单独搭一个台：站体外壁的
  // 一段弧、圆形闸门，和三十个人。观众永远不会在同一格里看到两套坐标。
  const stage = new THREE.Group();
  stage.position.copy(STAGE_ORIGIN);
  root.add(stage);

  const wallGeometry = keep(
    buildVoxelGeometry(
      {
        size: [120, 46, 8],
        at(x, y, z) {
          const dy = y - 23;
          const bulge = Math.round(3 - (dy * dy) / 190 - ((x - 60) * (x - 60)) / 1500);
          if (z > bulge + 4) return null;
          const port = Math.abs(dy) < 3 && x % 13 === 3 && z === bulge + 4;
          if (port) return 0x2a3a4a;
          return hullColour(x, y, z, 131);
        },
      },
      { voxel: 0.62, anchor: "center" },
    ),
  );
  mesh(wallGeometry, stage, { material: hullMat, position: [0, 0, -26] });

  const hatch = new THREE.Group();
  hatch.position.set(0, 1.5, -23.6);
  stage.add(hatch);
  mesh(
    keep(
      buildVoxelGeometry(
        {
          size: [26, 26, 3],
          at(x, y, z) {
            const dx = x + 0.5 - 13;
            const dy = y + 0.5 - 13;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 13 || d < 9.6) return null;
            return grainy(z === 2 ? 0x9ba0a6 : HULL_DEEP, x, y, z, 0.07, 141);
          },
        },
        { voxel: 0.34, anchor: "center" },
      ),
    ),
    hatch,
    { material: hullMat },
  );
  const hatchDoor = new THREE.Group();
  hatch.add(hatchDoor);
  mesh(
    keep(
      buildVoxelGeometry(
        {
          size: [22, 22, 2],
          at(x, y, z) {
            const dx = x + 0.5 - 11;
            const dy = y + 0.5 - 11;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 10.6) return null;
            const spoke = Math.abs(Math.atan2(dy, dx) % (Math.PI / 3)) < 0.13 && d > 3;
            return grainy(spoke ? 0x6f747a : 0x8d9298, x, y, z, 0.06, 142);
          },
        },
        { voxel: 0.34, anchor: "center" },
      ),
    ),
    hatchDoor,
    { material: hullMat },
  );
  const hatchLamp = mesh(keep(slab([2, 2, 2], 0xff3b2f, { voxel: 0.22, anchor: "center" })), hatch, {
    position: [2.6, 2.4, 0.5],
    material: glowMat(0xff3b2f),
  });

  // 舞台自己的光。五公里外的合影必须看得见脸，所以给这一块空间一盏
  // 有限距离的落日光 —— 它够不到八十公里外的主坐标系，不会污染别的镜头。
  const stageFill = new THREE.HemisphereLight(0x2c4a66, 0x06080d, 0.55);
  stage.add(stageFill);
  const stageKey = new THREE.PointLight(0xffc089, 520, 120, 2);
  stageKey.position.set(9, 7, 6);
  stage.add(stageKey);
  const stageRim = new THREE.PointLight(0x6f9ec8, 150, 120, 2);
  stageRim.position.set(-12, -4, -34);
  stage.add(stageRim);

  const crowdAnchor = new THREE.Group();
  crowdAnchor.position.set(0, 0.6, -12);
  stage.add(crowdAnchor);
  cast.crowd.forEach((figure, index) => {
    const row = Math.floor(index / 7);
    const column = index % 7;
    // 面朝 +Z：摄影师在他们和章北海之间，所以他们正对着瞄准镜。
    figure.root.position.set((column - 3) * 1.42 + row * 0.22, -row * 0.34, -row * 1.55);
    figure.root.rotation.y = 0;
    figure.root.visible = true;
    crowdAnchor.add(figure.root);
  });
  // 摄影师在队伍和瞄准镜之间，偏右下 —— 他挡不住任何一个目标。
  cast.photographer.root.position.set(2.9, -1.35, 8.6);
  cast.photographer.root.rotation.y = Math.PI;
  crowdAnchor.add(cast.photographer.root);
  void CROWD_COUNT;

  const thrusterMist = particleCloud(220, 61, 0xe6ecf2, 0.34);
  crowdAnchor.add(thrusterMist);
  const ventGas = particleCloud(180, 67, 0xf2f6fa, 0.2);
  crowdAnchor.add(ventGas);
  const iceCrystals = particleCloud(140, 71, 0xffd8d8, 0.13);
  crowdAnchor.add(iceCrystals);

  // 三十枚正在飞行的弹头。远景里它们是一串几乎看不见的点……
  const bullets = particleCloud(30, 73, 0xd6d2c8, 0.55);
  root.add(bullets);

  // 片头那块石头：还没有被切开，还只是一块来自尘世之外的铁陨石。
  const heroStone = new THREE.Mesh(
    keep(meteoriteGeometry(7, 0.022, 313)),
    voxMat("meteorite", { roughness: 0.72, metalness: 0.28 }),
  );
  heroStone.visible = false;
  root.add(heroStone);
  const heroKey = new THREE.PointLight(0xffd8a8, 6, 12, 2);
  heroKey.position.set(-1.1, 0.85, 1.3);
  heroStone.add(heroKey);
  const heroRim = new THREE.PointLight(0x7fb0e0, 3.2, 12, 2);
  heroRim.position.set(1.4, -0.4, -1.2);
  heroStone.add(heroRim);

  // ……近景里它们是五段还带着车床痕迹的陨石圆柱，在绝对的寂静里翻滚。
  const bulletCloseup = new THREE.Group();
  bulletCloseup.visible = false;
  root.add(bulletCloseup);
  const slugGeometry = keep(meteoriteSlugGeometry(0.1));
  const slugMaterial = voxMat("meteorite", { roughness: 0.72, metalness: 0.28 });
  const slugRandom = rng(211);
  for (let i = 0; i < 5; i += 1) {
    const slug = new THREE.Mesh(slugGeometry, slugMaterial);
    slug.position.set((slugRandom() - 0.5) * 2.6, (slugRandom() - 0.5) * 1.5, -i * 1.9 - slugRandom());
    slug.userData.spin = [slugRandom() * 2 - 1, slugRandom() * 2 - 1, slugRandom() * 2 - 1];
    slug.userData.rate = 0.6 + slugRandom() * 1.4;
    bulletCloseup.add(slug);
  }

  root.visible = false;
  const result: SpaceSet = {
    root,
    nightLights,
    bulletCloseup,
    heroStone,
    stars,
    earth,
    atmosphere,
    sun,
    sunGlow,
    sunLight,
    earthFill,
    elevator,
    wheel,
    wheelLights,
    shipyard,
    baseOne,
    debris,
    distantCrowd,
    stage,
    hatch,
    hatchDoor,
    hatchLamp,
    stageKey,
    stageRim,
    crowdAnchor,
    thrusterMist,
    ventGas,
    iceCrystals,
    bullets,
    dispose() {
      for (const item of owned) item.dispose();
    },
  };
  setSun(result, -9);
  return result;
}

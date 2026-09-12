import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";
import type { Cast } from "./characters";
import {
  beefTarget, boxMesh, bulb, cabinet, doorFrame, earthGeometry, lathe as latheProp,
  mat, microscope, muzzleFlash, pedestal, pistolProp, spaceDebris, stars,
  voxelCylinder, voxelRock, voxelTorus,
} from "./props";

export interface World {
  sets: Record<"shop" | "office" | "workshop" | "basement" | "space" | "memory", THREE.Group>;
  /** 店内关键物。 */
  shopDoor: THREE.Group;
  shopLamp: THREE.Group;
  shopRocks: THREE.Mesh[];
  /** 车间。 */
  lathe: THREE.Group;
  latheChuck: THREE.Group;
  workpiece: THREE.Mesh;
  cylTray: THREE.Group;
  /** 地下室。 */
  basementBullets: THREE.Mesh[];
  beef: THREE.Group;
  gun: THREE.Group;
  /** 太空。 */
  spaceStars: THREE.Points;
  earth: THREE.Mesh;
  sun: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  station: THREE.Group;
  baseStation: THREE.Group;
  elevatorCable: THREE.Mesh;
  debris: THREE.Mesh[];
  muzzle: THREE.Group;
  tracers: THREE.Mesh[];
  impactPuffs: THREE.Group[];
  bloodParticles: THREE.Mesh[];
  /** 记忆。 */
  fatherChair: THREE.Group;
  fatherLamp: THREE.Group;
}

function receive(group: THREE.Object3D, enabled: boolean): void {
  group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.receiveShadow = enabled;
    }
  });
}

function buildShop(): { group: THREE.Group; door: THREE.Group; lamp: THREE.Group; rocks: THREE.Mesh[] } {
  const group = new THREE.Group();
  group.name = "set-shop";
  const ambient = new THREE.AmbientLight(0xffe6c4, 0.5);
  group.add(ambient);

  const floor = boxMesh(13, 0.12, 10, 0x2e2118, { roughness: 0.95 });
  floor.position.y = -0.06;
  floor.receiveShadow = true;
  const back = boxMesh(13, 4.4, 0.2, 0x2a2018);
  back.position.set(0, 2.2, -5);
  back.receiveShadow = true;
  const left = boxMesh(0.2, 4.4, 10, 0x33261c);
  left.position.set(-6.5, 2.2, 0);
  left.receiveShadow = true;
  const right = boxMesh(0.2, 4.4, 10, 0x33261c);
  right.position.set(6.5, 2.2, 0);
  right.receiveShadow = true;
  const ceiling = boxMesh(13, 0.16, 10, 0x201812);
  ceiling.position.y = 4.4;
  group.add(floor, back, left, right, ceiling);

  // 玻璃展柜 + 展柜里的陨石。
  const rocks: THREE.Mesh[] = [];
  const cabinetPositions: Array<[number, number, number, number]> = [
    [-4.4, 0, -3.9, 0],
    [0, 0, -4.55, 0],
    [4.4, 0, -3.9, 0],
    [-5.9, 0, -1.2, Math.PI / 2],
  ];
  for (const [x, , z, ry] of cabinetPositions) {
    const cab = cabinet(1.9, 1.9, 0.6);
    cab.position.set(x, 0, z);
    cab.rotation.y = ry;
    group.add(cab);
    const rock = voxelRock(4 + (Math.abs(x) % 3), Math.floor(x * 100) + 9, 0.05);
    rock.position.set(x, 1.05, z + (ry === 0 ? 0.18 : 0));
    rocks.push(rock);
    group.add(rock);
  }

  // 展台与陨石。
  const pedPositions: Array<[number, number]> = [[-2.2, -2.4], [2.2, -2.4], [0.0, -3.0]];
  for (const [x, z] of pedPositions) {
    const ped = pedestal();
    ped.position.set(x, 0, z);
    group.add(ped);
    const rock = voxelRock(4, Math.floor(x * 37) + 3, 0.055);
    rock.position.set(x, 1.14, z);
    rocks.push(rock);
    group.add(rock);
  }

  // 工作台与显微镜。
  const bench = new THREE.Group();
  const tb = boxMesh(2.2, 0.08, 1.0, 0x4a3a28, { roughness: 0.9 });
  tb.position.y = 0.95;
  for (const sx of [-1, 1]) {
    const leg = boxMesh(0.12, 0.95, 0.12, 0x33291e);
    leg.position.set(sx * 0.98, 0.475, 0);
    bench.add(leg);
  }
  bench.add(tb);
  bench.position.set(4.6, 0, 1.2);
  bench.rotation.y = -0.5;
  const mic = microscope();
  mic.position.set(4.6, 0.99, 1.2);
  mic.rotation.y = -0.5;
  group.add(bench, mic);

  // 门（右墙）。
  const door = doorFrame();
  door.position.set(6.35, 0, 1.8);
  door.rotation.y = -Math.PI / 2;
  group.add(door);

  // 主灯。
  const lamp = bulb(0xffd9a0, 40);
  lamp.position.set(0, 4.0, 0);
  group.add(lamp);

  // 阴影主光。
  const key = new THREE.SpotLight(0xffd7a8, 45, 18, 0.9, 0.5, 1.2);
  key.position.set(0, 3.9, 0.6);
  key.target.position.set(0, 0, -1);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0004;
  group.add(key, key.target);
  receive(group, true);

  return { group, door, lamp, rocks };
}

function buildOffice(): THREE.Group {
  const group = new THREE.Group();
  group.name = "set-office";
  group.add(new THREE.AmbientLight(0xdfe6ee, 0.6));
  const floor = boxMesh(10, 0.1, 8, 0x20262e);
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  const back = boxMesh(10, 4.2, 0.2, 0x1a2027);
  back.position.set(0, 2.1, -4);
  const left = boxMesh(0.2, 4.2, 8, 0x1e252d);
  left.position.set(-5, 2.1, 0);
  const right = boxMesh(0.2, 4.2, 8, 0x1e252d);
  right.position.set(5, 2.1, 0);
  group.add(floor, back, left, right);

  // 背后的全息星图。
  const map = boxMesh(6, 2.6, 0.06, 0x0b1420, { emissive: 0x1d3c5c, emissiveIntensity: 0.9 });
  map.position.set(0, 2.1, -3.86);
  group.add(map);
  const grid = new THREE.Group();
  for (let i = -3; i <= 3; i += 1) {
    const line = boxMesh(5.6, 0.02, 0.02, 0x3f7ca6, { emissive: 0x2b5c86, emissiveIntensity: 0.8 });
    line.position.set(0, 2.1 + i * 0.34, -3.8);
    grid.add(line);
  }
  for (let i = -8; i <= 8; i += 1) {
    const line = boxMesh(0.02, 2.4, 0.02, 0x3f7ca6, { emissive: 0x2b5c86, emissiveIntensity: 0.6 });
    line.position.set(i * 0.34, 2.1, -3.8);
    grid.add(line);
  }
  group.add(grid);

  // 办公桌。
  const desk = boxMesh(3.2, 0.08, 1.3, 0x3a4148);
  desk.position.set(0, 0.86, 1.4);
  desk.receiveShadow = true;
  for (const sx of [-1, 1]) {
    const leg = boxMesh(0.12, 0.86, 0.12, 0x242a30);
    leg.position.set(sx * 1.44, 0.43, 1.4);
    group.add(leg);
  }
  group.add(desk);

  const key = new THREE.SpotLight(0xbfd2e0, 40, 16, 0.9, 0.5, 1.2);
  key.position.set(0, 3.8, 2.2);
  key.target.position.set(0, 0, 1);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  group.add(key, key.target);
  receive(group, true);
  return group;
}

function buildWorkshop(): { group: THREE.Group; lathe: THREE.Group; chuck: THREE.Group; workpiece: THREE.Mesh; tray: THREE.Group } {
  const group = new THREE.Group();
  group.name = "set-workshop";
  group.add(new THREE.AmbientLight(0xbfd6e6, 0.7));
  const floor = boxMesh(11, 0.1, 9, 0x2a2e33);
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  const back = boxMesh(11, 4.2, 0.2, 0x343a42);
  back.position.set(0, 2.1, -4.5);
  const left = boxMesh(0.2, 4.2, 9, 0x3a4149);
  left.position.set(-5.5, 2.1, 0);
  const right = boxMesh(0.2, 4.2, 9, 0x3a4149);
  right.position.set(5.5, 2.1, 0);
  const ceiling = boxMesh(11, 0.16, 9, 0x22262b);
  ceiling.position.y = 4.2;
  group.add(floor, back, left, right, ceiling);

  const lathe = latheProp();
  lathe.position.set(0, 0, 0.4);
  group.add(lathe);
  const chuck = lathe.children.find((c) => c.type === "Group") as THREE.Group;
  const workpiece = voxelCylinder(0.5, 3, (x, y, z) => (y % 2 === 0 ? 0x3a3f45 : 0x2c3035), 0.12);
  workpiece.position.set(-0.5, 1.15, 0.36);
  workpiece.rotation.y = Math.PI / 2;
  group.add(workpiece);

  // 侧边工作台与陨石。
  const side = boxMesh(2.2, 0.08, 1.0, 0x4a5158);
  side.position.set(3.6, 0.9, -1.2);
  group.add(side);
  for (let i = 0; i < 3; i += 1) {
    const rock = voxelRock(5, i + 40, 0.06);
    rock.position.set(3.6 + (i - 1) * 0.4, 0.96, -1.2);
    group.add(rock);
  }

  const tray = new THREE.Group();
  const trayBase = boxMesh(1.0, 0.04, 0.6, 0x4a5158);
  tray.add(trayBase);
  for (let i = 0; i < 8; i += 1) {
    const cyl = voxelCylinder(0.3, 0.5, 0x3a3f45, 0.06);
    cyl.position.set((i % 4 - 1.5) * 0.14, 0.06, Math.floor(i / 4) * 0.2 - 0.1);
    tray.add(cyl);
  }
  tray.position.set(-2.4, 0.9, -1.2);
  group.add(tray);

  const key = new THREE.SpotLight(0xcfe4f2, 50, 18, 0.9, 0.45, 1.2);
  key.position.set(0, 4.0, 2.2);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  group.add(key, key.target);
  receive(group, true);
  return { group, lathe, chuck, workpiece, tray };
}

function buildBasement(): { group: THREE.Group; bullets: THREE.Mesh[]; beef: THREE.Group; gun: THREE.Group } {
  const group = new THREE.Group();
  group.name = "set-basement";
  group.add(new THREE.AmbientLight(0xffd9a8, 0.28));
  const floor = boxMesh(7, 0.1, 6, 0x28292c);
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  const back = boxMesh(7, 3.2, 0.2, 0x303136);
  back.position.set(0, 1.6, -3);
  const left = boxMesh(0.2, 3.2, 6, 0x333438);
  left.position.set(-3.5, 1.6, 0);
  const right = boxMesh(0.2, 3.2, 6, 0x333438);
  right.position.set(3.5, 1.6, 0);
  const ceiling = boxMesh(7, 0.14, 6, 0x1c1d20);
  ceiling.position.y = 3.2;
  group.add(floor, back, left, right, ceiling);

  const bench = boxMesh(2.4, 0.08, 1.1, 0x4a4d52);
  bench.position.set(0, 0.95, -1.8);
  bench.receiveShadow = true;
  group.add(bench);

  // 三十六发子弹（示意若干排）。
  const bullets: THREE.Mesh[] = [];
  for (let i = 0; i < 24; i += 1) {
    const b = voxelCylinder(0.32, 0.8, (x, y, z) => (z < 0 ? 0x8a5a2c : 0xc9a24a), 0.05);
    b.position.set((i % 6 - 2.5) * 0.16, 1.0, -1.8 + Math.floor(i / 6) * 0.2);
    b.rotation.x = Math.PI / 2;
    bullets.push(b);
    group.add(b);
  }

  const beef = beefTarget();
  beef.position.set(2.6, 0, -0.4);
  group.add(beef);

  const gun = pistolProp();
  gun.position.set(-1.4, 1.0, -1.8);
  gun.rotation.y = 0.4;
  group.add(gun);

  const lamp = bulb(0xffd9a0, 34);
  lamp.position.set(0, 3.0, -0.6);
  group.add(lamp);

  const key = new THREE.SpotLight(0xffd7a8, 28, 10, 0.95, 0.55, 1.2);
  key.position.set(0, 2.9, -0.2);
  key.target.position.set(0, 0, -1.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0005;
  group.add(key, key.target);
  receive(group, true);
  return { group, bullets, beef, gun };
}

function buildStation(): THREE.Group {
  const group = new THREE.Group();
  group.name = "huanghe-station";
  const majorR = 14;
  const minorR = 3.4;
  const voxel = 0.5;
  // 环（绕 Y 轴的 XZ 环），转成竖直面向 +Z。
  const ring = new THREE.Mesh(
    voxelTorus(majorR, minorR, (x, y, z) => {
      const grey = Math.abs((x + z) % 4) < 1 ? 0x9aa4ae : 0x6f7a86;
      return grey;
    }, voxel),
    voxelMaterial({ roughness: 0.7, metalness: 0.25 }),
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // 中央轮毂（沿 Z 轴）。
  const hub = voxelCylinder(2.6, 6, 0x7c8791, voxel);
  hub.material = voxelMaterial({ roughness: 0.6, metalness: 0.3 });
  group.add(hub);

  // 辐条。
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const spoke = boxMesh(0.6, (majorR - 3) * voxel, 0.6, 0x8a94a0);
    spoke.position.set(Math.cos(a) * (majorR * voxel * 0.5), Math.sin(a) * (majorR * voxel * 0.5), 0);
    spoke.rotation.z = a;
    group.add(spoke);
  }

  // 环上舷窗。
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2;
    const win = boxMesh(0.7, 0.5, 0.3, 0xffe6b0, { emissive: 0xffcf80, emissiveIntensity: 1.4 });
    win.position.set(Math.cos(a) * majorR * voxel, Math.sin(a) * majorR * voxel, (minorR - 0.4) * voxel);
    group.add(win);
  }
  group.rotation.z = 0.15;
  return group;
}

function buildBaseStation(): THREE.Group {
  const g = new THREE.Group();
  const body = boxMesh(4, 3, 7, 0x6f7a86);
  body.position.y = 1.5;
  const solar = boxMesh(7, 0.2, 3, 0x2a3f5e);
  solar.position.set(3.2, 2.4, 0);
  const dish = boxMesh(1.2, 1.2, 0.2, 0xb9c0c8);
  dish.position.set(0, 3.6, -2.6);
  const win = boxMesh(0.6, 0.5, 0.1, 0xffe6b0, { emissive: 0xffcf80, emissiveIntensity: 1.2 });
  win.position.set(0, 1.6, 3.56);
  g.add(body, solar, dish, win);
  return g;
}

function buildSpace(): {
  group: THREE.Group; spaceStars: THREE.Points; earth: THREE.Mesh; sun: THREE.Mesh;
  sunLight: THREE.DirectionalLight; station: THREE.Group; baseStation: THREE.Group;
  cable: THREE.Mesh; debris: THREE.Mesh[]; muzzle: THREE.Group; tracers: THREE.Mesh[];
  impactPuffs: THREE.Group[]; blood: THREE.Mesh[];
} {
  const group = new THREE.Group();
  group.name = "set-space";

  const spaceStars = stars(2600, 900);
  group.add(spaceStars);

  group.add(new THREE.AmbientLight(0x101a24, 0.08));

  // 地球（微弱自发光，保证暗处也能辨认大陆海洋）。
  const earthGeo = earthGeometry(40, 2.0);
  const earth = new THREE.Mesh(earthGeo, voxelMaterial({ roughness: 0.9, emissive: 0x24445e, emissiveIntensity: 0.4 }));
  earth.position.set(0, -30, -320);
  group.add(earth);

  // 太阳与日照（日落角度）。
  const sunGeo = voxelSphere(5, (x, y, z, d) => (d > 0.6 ? 0xfff4d0 : 0xffd27a), { voxel: 0.8 });
  const sun = new THREE.Mesh(sunGeo, voxelMaterial({ emissive: 0xffb84a, emissiveIntensity: 2.2, roughness: 0.4 }));
  sun.position.set(0, -8, -240);
  group.add(sun);

  const sunLight = new THREE.DirectionalLight(0xffc98a, 2.4);
  sunLight.position.copy(sun.position);
  sunLight.target.position.set(0, 0, 0);
  group.add(sunLight, sunLight.target);

  const rim = new THREE.PointLight(0x8fb4d6, 6, 14, 1.5);
  rim.position.set(0, -2, 10);
  group.add(rim);

  // 黄河站。
  const station = buildStation();
  station.position.set(0, 6, 260);
  group.add(station);

  // 一号基地。
  const baseStation = buildBaseStation();
  baseStation.position.set(-180, 60, 150);
  baseStation.rotation.y = 0.7;
  group.add(baseStation);

  // 太空电梯缆绳（从黄河站向下延伸，指向地球）。
  const cable = boxMesh(0.5, 200, 0.5, 0x4a5560, { roughness: 0.8, metalness: 0.4 });
  cable.position.set(0, -94, 260);
  group.add(cable);

  // 碎片。
  const debris: THREE.Mesh[] = [];
  for (let i = 0; i < 16; i += 1) {
    const d = spaceDebris(i + 5);
    const a = (i / 16) * Math.PI * 2;
    d.position.set(Math.cos(a) * (30 + i * 5), Math.sin(a) * (14 + i * 2), 60 + i * 12);
    d.rotation.set(i, i * 2, i * 0.5);
    debris.push(d);
    group.add(d);
  }

  // 枪口火光与弹道。
  const muzzle = muzzleFlash();
  muzzle.visible = false;
  group.add(muzzle);

  const tracers: THREE.Mesh[] = [];
  const tracerGeo = new THREE.BoxGeometry(0.06, 0.06, 1.4);
  for (let i = 0; i < 30; i += 1) {
    const t = new THREE.Mesh(tracerGeo, mat(0xffb45e, { emissive: 0xff9a3c, emissiveIntensity: 1.6 }));
    t.visible = false;
    tracers.push(t);
    group.add(t);
  }

  // 命中喷汽与血冰。
  const impactPuffs: THREE.Group[] = [];
  const blood: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i += 1) {
    const puff = new THREE.Group();
    const p = voxelSphere(2.4, (x, y, z, d) => (d > 0.55 ? 0xdfe8ee : 0xffffff), { voxel: 0.16 });
    const pm = new THREE.Mesh(p, voxelMaterial({ roughness: 0.9 }));
    pm.material.transparent = true;
    pm.material.opacity = 0.9;
    puff.add(pm);
    puff.visible = false;
    impactPuffs.push(puff);
    group.add(puff);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), mat(0xff6b5a, { emissive: 0x7a1f16, emissiveIntensity: 0.6 }));
    b.visible = false;
    blood.push(b);
    group.add(b);
  }

  return { group, spaceStars, earth, sun, sunLight, station, baseStation, cable, debris, muzzle, tracers, impactPuffs, blood };
}

function buildMemory(): { group: THREE.Group; chair: THREE.Group; lamp: THREE.Group } {
  const group = new THREE.Group();
  group.name = "set-memory";
  group.add(new THREE.AmbientLight(0xffe0b0, 0.3));
  const floor = boxMesh(5, 0.08, 5, 0x241c14);
  floor.position.y = -0.04;
  floor.receiveShadow = true;
  group.add(floor);

  const chair = new THREE.Group();
  const seat = boxMesh(1.0, 0.12, 0.9, 0x5a4a38);
  seat.position.y = 0.55;
  const back = boxMesh(1.0, 1.2, 0.12, 0x5a4a38);
  back.position.set(0, 1.2, -0.42);
  for (const sx of [-1, 1]) {
    const arm = boxMesh(0.12, 0.3, 0.8, 0x4a3a2c);
    arm.position.set(sx * 0.5, 0.72, 0);
    chair.add(arm);
  }
  chair.add(seat, back);
  chair.position.set(0, 0, 0.4);
  group.add(chair);

  const lamp = bulb(0xffcf8e, 26);
  lamp.position.set(1.6, 2.2, 1.0);
  group.add(lamp);
  receive(group, true);
  return { group, chair, lamp };
}

export function buildWorld(scene: THREE.Scene, cast: Cast): World {
  const shop = buildShop();
  const office = buildOffice();
  const workshop = buildWorkshop();
  const basement = buildBasement();
  const space = buildSpace();
  const memory = buildMemory();

  for (const s of [shop.group, office, workshop.group, basement.group, space.group, memory.group]) {
    s.visible = false;
    scene.add(s);
  }

  return {
    sets: {
      shop: shop.group,
      office,
      workshop: workshop.group,
      basement: basement.group,
      space: space.group,
      memory: memory.group,
    },
    shopDoor: shop.door,
    shopLamp: shop.lamp,
    shopRocks: shop.rocks,
    lathe: workshop.lathe,
    latheChuck: workshop.chuck,
    workpiece: workshop.workpiece,
    cylTray: workshop.tray,
    basementBullets: basement.bullets,
    beef: basement.beef,
    gun: basement.gun,
    spaceStars: space.spaceStars,
    earth: space.earth,
    sun: space.sun,
    sunLight: space.sunLight,
    station: space.station,
    baseStation: space.baseStation,
    elevatorCable: space.cable,
    debris: space.debris,
    muzzle: space.muzzle,
    tracers: space.tracers,
    impactPuffs: space.impactPuffs,
    bloodParticles: space.blood,
    fatherChair: memory.chair,
    fatherLamp: memory.lamp,
  };
}

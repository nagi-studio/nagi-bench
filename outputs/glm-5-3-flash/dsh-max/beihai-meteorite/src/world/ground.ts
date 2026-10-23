import * as THREE from "three";
import { applyPose, idle, walk, voxelMaterial, type Figure, type Pose } from "@agentbench/voxel-kit";
import type { Cast } from "../core/cast";
import {
  makeAmmoBox,
  makeCup,
  makeMagnifier,
  makeMagazine,
  makeMeteorRound,
  makePhone,
  makePliers,
  makePistol,
  makeScope,
  makeTeapot,
  makeTweezers,
  mesh,
  vbox,
  voxelRock,
  voxelUnion,
  type BoxSpec,
} from "../core/props";
import { clamp01, easeInOutCubic, hash3, lerp, mixHex, segmentProgress, smoothstep } from "../core/util";

export interface Env {
  group: THREE.Group;
  update: (t: number) => void;
  zb?: Figure;
  collector?: Figure;
}

const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];
const _v1 = new THREE.Vector3();

function glowCanvas(inner: string, mid: string, outer: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.3, mid);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return canvas;
}

function track<T extends THREE.BufferGeometry | THREE.Material | THREE.Object3D>(x: T): T {
  if (x instanceof THREE.BufferGeometry || x instanceof THREE.Material) disposables.push(x);
  return x;
}

function brick(x: number, y: number, z: number): number {
  const row = Math.floor(y / 2);
  const offset = row % 2 === 0 ? 0 : 1;
  const joint = (x + offset) % 3 === 0 || y % 2 === 0;
  const tone = 0.86 + hash3(x, y, z, 11) * 0.28;
  return mixHex(joint ? 0x6f6a60 : 0x8d867a, 0x000000, 0);
}

/* ------------------------------------------------------------------ */
/* 胡同                                                                */
/* ------------------------------------------------------------------ */

export function makeAlley(cast: Cast): Env {
  const group = new THREE.Group();
  const V = 0.3;
  const boxes: BoxSpec[] = [];
  // 地面
  boxes.push({ from: [-17, -2, -40], to: [17, 0, 80], color: (x, y, z) => mixHex(0x7b7568, 0x4d4a42, hash3(x, y, z, 3) * 0.5) });
  // 两堵砖墙（左 x<0，右 x>0），巷道留 5.2 m 宽
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -13 : 9;
    boxes.push({ from: [x0, 0, -27], to: [x0 + 4, 14, 74], color: brick });
    boxes.push({ from: [x0 - (side < 0 ? 0 : 0), 14, -27], to: [x0 + 4, 16, 74], color: (x, y, z) => mixHex(0x55524c, 0x3d3b36, hash3(x, y, z, 5) * 0.4) });
  }
  // 墙头以上的屋脊剪影
  for (let i = 0; i < 7; i++) {
    const z = -24 + i * 14;
    const h = 5 + hash3(i, 1, 2, 8) * 5;
    boxes.push({ from: [-19, 16, Math.floor(z)], to: [-13, 16 + Math.floor(h), Math.floor(z) + 40], color: 0x3a3733 });
    boxes.push({ from: [13, 16, Math.floor(z) + 6], to: [19, 16 + Math.floor(h), Math.floor(z) + 40], color: 0x35322e });
  }
  const structure = track(mesh(track(voxelUnion(boxes, V)), track(voxelMaterial({ roughness: 1 }))));
  group.add(structure);

  // 大门（红门、木框、铜钉），铰链在 z=19.8 一侧
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-2.95, 0, 19.8);
  const doorGeo = track(vbox(1, 8, 1, (x, y) => ((x === 0 || x === 7 || y === 0 || y === 7 ? 0x3a2c22 : 0x8c2f26)), 0.16));
  const door = mesh(doorGeo, track(voxelMaterial({ roughness: 0.85 })));
  door.position.set(0, 0, -0.15);
  doorPivot.add(door);
  const knob = mesh(track(vbox(1, 1, 1, 0xc9a24a, 0.05)));
  knob.position.set(0.12, 1.05, -0.35);
  doorPivot.add(knob);
  const knob2 = mesh(track(vbox(1, 1, 1, 0xc9a24a, 0.05)));
  knob2.position.set(0.12, 1.5, -0.35);
  doorPivot.add(knob2);
  group.add(doorPivot);
  // 门内一块黑，制造"进屋"的洞口
  const dark = mesh(track(vbox(6, 10, 2, 0x060504, 0.3)));
  dark.position.set(-4.4, 1.5, 19.2);
  group.add(dark);

  // 门灯
  const lampMat = track(new THREE.MeshBasicMaterial({ color: 0xffb45e }));
  const lamp = mesh(track(vbox(2, 3, 2, 0xffb45e, 0.05)), lampMat);
  lamp.position.set(-2.5, 2.55, 17.4);
  group.add(lamp);
  const lampLight = new THREE.PointLight(0xffb26a, 0, 9, 2);
  lampLight.position.set(-2.4, 2.5, 17.4);
  group.add(lampLight);

  // 晾衣绳与衣服
  const wire = mesh(track(vbox(60, 1, 1, 0x2a2a2a, 0.02)));
  wire.position.set(0, 3.3, 5.5);
  group.add(wire);
  const clothes: THREE.Mesh[] = [];
  const clothColors = [0xa8574a, 0x5b7a8c, 0xc8b98a, 0x7a8a6a];
  for (let i = 0; i < 4; i++) {
    const c = mesh(track(vbox(8, 12, 1, clothColors[i]!, 0.02)), track(voxelMaterial({ roughness: 1 })));
    c.position.set(-1.8 + i * 1.15, 2.75, 5.5);
    group.add(c);
    clothes.push(c);
  }

  // 电线杆与横线
  const pole = mesh(track(vbox(2, 30, 2, 0x4a4038, 0.1)));
  pole.position.set(2.9, 2.4, 11);
  group.add(pole);
  const crosswire = mesh(track(vbox(1, 1, 90, 0x242424, 0.03)));
  crosswire.position.set(0.4, 4.6, 11);
  group.add(crosswire);

  // 灰尘微粒
  const dustGeo = track(new THREE.BufferGeometry());
  const dustN = 140;
  const dustPos = new Float32Array(dustN * 3);
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, track(new THREE.PointsMaterial({ color: 0xd8c9a8, size: 0.02, transparent: true, opacity: 0.5, depthWrite: false })));
  group.add(dust);

  // 灯光
  const sun = new THREE.DirectionalLight(0xffd9a0, 2.6);
  sun.position.set(-14, 10, -20);
  sun.target.position.set(0, 0, 14);
  group.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(0xcfd8e8, 0x6b5f52, 0.6);
  group.add(hemi);
  const bounce = new THREE.PointLight(0xffcf9a, 24, 22, 2);
  bounce.position.set(1.5, 2.5, 17.5);
  group.add(bounce);

  // 章北海（地面装束）
  const zb = cast.makeZbGround();
  group.add(zb.root);

  const update = (t: number): void => {
    // 行走路径：从巷口走向大门
    const p1 = segmentProgress(t, 13.4, 21.2);
    const p2 = segmentProgress(t, 21.2, 22.9);
    const p3 = segmentProgress(t, 23.3, 24.9);
    const x = p1 < 1 ? lerp(0.2, -0.7, p1) : lerp(-0.7, -2.05, easeInOutCubic(p2));
    const z = p1 < 1 ? lerp(-7.5, 14.6, p1) : lerp(14.6, 17.6, easeInOutCubic(p2));
    zb.root.position.set(x + (p3 > 0 ? lerp(0, -0.7, p3) : 0), 0, z + (p3 > 0 ? lerp(0, 1.4, p3) : 0));
    const moving = t > 13.4 && t < 22.7;
    const heading = t < 21.2 ? Math.PI : lerp(Math.PI, Math.PI * 0.72, easeInOutCubic(clamp01((t - 21.2) / 1.4)));
    zb.root.rotation.y = heading;
    if (moving) {
      applyPose(zb, walk(t * 1.55, 0.85));
    } else {
      const stand = idle(t);
      applyPose(zb, {
        ...stand,
        armR: [lerp(0, -1.1, smoothstep(segmentProgress(t, 22.8, 23.6))), 0, 0.12],
      });
    }
    // 门扇开启
    doorPivot.rotation.y = lerp(0, -1.85, smoothstep(segmentProgress(t, 22.8, 23.8)));
    // 门灯呼吸
    const flicker = 0.82 + hash3(Math.floor(t * 7), 0, 0, 21) * 0.18;
    lampLight.intensity = 14 * flicker;
    lampMat.color.setHex(0xffb45e).multiplyScalar(0.7 + flicker * 0.4);
    // 晾晒的衣服轻摆
    for (let i = 0; i < clothes.length; i++) {
      clothes[i]!.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.07;
      clothes[i]!.rotation.x = Math.sin(t * 0.55 + i) * 0.04;
    }
    // 尘埃
    for (let i = 0; i < dustN; i++) {
      const seed = i * 0.618;
      dustPos[i * 3] = -2.5 + hash3(i, 1, 0, 31) * 5 + Math.sin(t * 0.2 + seed * 9) * 0.4;
      dustPos[i * 3 + 1] = 0.3 + ((hash3(i, 2, 0, 32) * 4 + t * 0.05) % 3.8);
      dustPos[i * 3 + 2] = -6 + hash3(i, 3, 0, 33) * 26;
    }
    dustGeo.attributes.position.needsUpdate = true;
  };
  return { group, update, zb };
}

/* ------------------------------------------------------------------ */
/* 收藏者的老宅                                                        */
/* ------------------------------------------------------------------ */

export function makeRoom(cast: Cast): Env {
  const group = new THREE.Group();
  const V = 0.1;
  const boxes: BoxSpec[] = [];
  // 地板（木条纹沿 x）
  boxes.push({
    from: [-37, 0, -28],
    to: [37, 1, 28],
    color: (x, y, z) => {
      const plank = Math.floor((z + 100) / 2.4) % 5;
      const tone = 0.85 + hash3(x, y, z, 41) * 0.3;
      return mixHex([0x7d6446, 0x715a3e, 0x846a4c, 0x77603f, 0x6d5738][plank]!, 0x000000, 1 - tone);
    },
  });
  // 四面墙（白灰砖），后墙留窗洞
  const wallColor = (x: number, y: number, z: number): number => {
    const grime = hash3(x, Math.floor(y / 5), z, 43) * 0.3 + (y < 3 ? 0.2 : 0);
    return mixHex(0xa89f8e, 0x241f18, grime);
  };
  boxes.push({ from: [-40, 0, -31], to: [40, 34, -28], color: wallColor });
  boxes.push({ from: [-40, 0, 28], to: [40, 34, 31], color: wallColor });
  boxes.push({ from: [-40, 0, -28], to: [-37, 34, 28], color: wallColor });
  boxes.push({ from: [37, 0, -28], to: [40, 34, 28], color: wallColor });
  // 后墙窗洞 (x 8..22, y 22..30)
  boxes.push({ from: [-37, 0, -28], to: [8, 34, -25], color: wallColor });
  boxes.push({ from: [22, 0, -28], to: [37, 34, -25], color: wallColor });
  boxes.push({ from: [8, 0, -28], to: [22, 22, -25], color: wallColor });
  boxes.push({ from: [8, 30, -28], to: [22, 34, -25], color: wallColor });
  // 天花板与梁
  boxes.push({ from: [-40, 34, -31], to: [40, 37, 31], color: 0x3a2f22 });
  for (const z of [-20, -7, 6, 19]) {
    boxes.push({ from: [-40, 30, z - 2], to: [40, 34, z + 2], color: (x, y, zz) => mixHex(0x4a3826, 0x2e2317, hash3(x, y, zz, 44) * 0.5) });
  }
  const structure = track(mesh(track(voxelUnion(boxes, V)), track(voxelMaterial({ roughness: 0.95 }))));
  group.add(structure);

  // 窗：外头一片暖光
  const outside = mesh(track(vbox(16, 10, 1, 0xffe6b8, 0.1)), track(new THREE.MeshBasicMaterial({ color: 0xffe2ae })));
  outside.position.set(1.5, 2.6, -2.95);
  group.add(outside);
  const frame = mesh(track(vbox(18, 2, 2, 0x4a3826, 0.1)));
  frame.position.set(1.5, 2.55, -2.7);
  group.add(frame);
  const mullion = mesh(track(vbox(1, 10, 2, 0x4a3826, 0.1)));
  mullion.position.set(1.5, 2.6, -2.7);
  group.add(mullion);
  // 光柱
  const shaft = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.9, 2.1, 6.4, 4, 1, true)),
    track(new THREE.MeshBasicMaterial({ color: 0xffdca0, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })),
  );
  shaft.position.set(0.9, 1.6, 0.4);
  shaft.rotation.z = 0.42;
  shaft.rotation.y = 0.3;
  group.add(shaft);

  // 玻璃展柜：左墙三座，右墙两座
  const cabinetSpots: Array<{ pos: [number, number]; along: "z" | "x"; light: boolean }> = [
    { pos: [-3.25, -1.9], along: "z", light: true },
    { pos: [-3.25, 0.2], along: "z", light: false },
    { pos: [-3.25, 2.1], along: "z", light: false },
    { pos: [3.25, 0.4], along: "z", light: true },
    { pos: [3.25, 2.2], along: "z", light: false },
  ];
  const glassMat = track(new THREE.MeshStandardMaterial({ color: 0xbcd8e2, transparent: true, opacity: 0.16, roughness: 0.08, metalness: 0.1, depthWrite: false }));
  const stripMat = track(new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  for (const spot of cabinetSpots) {
    const cab = new THREE.Group();
    cab.position.set(spot.pos[0], 0, spot.pos[1]);
    const sgn = spot.pos[0] < 0 ? 1 : -1;
    const body = mesh(track(vbox(13, 38, 34, (x, y, z) => mixHex(0x4a3826, 0x2f2418, hash3(x, y, z, 45) * 0.4), 0.1)));
    body.position.set(sgn * 0.05, 0.95, 0);
    cab.add(body);
    const inner = mesh(track(vbox(10, 30, 30, 0x171310, 0.1)));
    inner.position.set(sgn * 0.35, 0.95, 0);
    cab.add(inner);
    // 玻璃面
    const glass = new THREE.Mesh(track(new THREE.BoxGeometry(0.02, 1.7, 1.5)), glassMat);
    glass.position.set(sgn * 0.62, 0.95, 0);
    cab.add(glass);
    // 顶部灯条
    const strip = mesh(track(vbox(6, 1, 26, 0xffd9a0, 0.05)), stripMat);
    strip.position.set(sgn * 0.45, 1.82, 0);
    cab.add(strip);
    // 隔板与陨石
    for (const shelfY of [0.62, 1.18]) {
      const shelf = mesh(track(vbox(11, 2, 30, 0x5a4630, 0.1)));
      shelf.position.set(sgn * 0.35, shelfY, 0);
      cab.add(shelf);
      for (let i = 0; i < 3; i++) {
        const rock = mesh(track(voxelRock(9, spot.pos[1] * 97 + shelfY * 13 + i, [0x555a5e, 0x3c4045, 0x6e6257, 0x4a4038], 0.028)));
        rock.position.set(sgn * 0.3, shelfY + 0.13, -0.5 + i * 0.5);
        rock.rotation.y = i * 1.3;
        cab.add(rock);
      }
    }
    if (spot.light) {
      const pl = new THREE.PointLight(0xffcf96, 7, 3, 2);
      pl.position.set(spot.pos[0] + sgn * 0.45, 1.7, spot.pos[1]);
      group.add(pl);
    }
    group.add(cab);
  }

  // 工作台
  const bench = new THREE.Group();
  bench.position.set(1.5, 0, -1.55);
  const top = mesh(track(vbox(44, 4, 20, (x, y, z) => mixHex(0x66523a, 0x463524, hash3(x, y, z, 46) * 0.4), 0.05)));
  top.position.y = 0.93;
  bench.add(top);
  for (const [lx, lz] of [[-1.0, -0.35], [1.0, -0.35], [-1.0, 0.35], [1.0, 0.35]] as const) {
    const leg = mesh(track(vbox(3, 18, 3, 0x4a3620, 0.05)));
    leg.position.set(lx, 0.45, lz);
    bench.add(leg);
  }
  // 台灯（放大镜灯）
  const lampArm = mesh(track(vbox(2, 26, 2, 0x3c4650, 0.04)));
  lampArm.position.set(-0.85, 1.55, -0.35);
  bench.add(lampArm);
  const lampHead = mesh(track(vbox(8, 3, 6, 0x3c4650, 0.04)));
  lampHead.position.set(-0.6, 2.05, -0.1);
  bench.add(lampHead);
  const lensGlow = mesh(track(vbox(5, 1, 3, 0xffe9bd, 0.03)), track(new THREE.MeshBasicMaterial({ color: 0xffe9bd })));
  lensGlow.position.set(-0.6, 2.0, 0.06);
  bench.add(lensGlow);
  // 台面上的托盘、岩石、工具
  const tray = mesh(track(vbox(26, 1, 14, 0x353b41, 0.05)));
  tray.position.set(0.25, 0.97, -0.45);
  bench.add(tray);
  for (let i = 0; i < 4; i++) {
    const rock = mesh(track(voxelRock(8, 500 + i, [0x4c5156, 0x383c41, 0x5f5548], 0.024)));
    rock.position.set(-0.35 + i * 0.28, 1.02, -0.48);
    rock.rotation.y = i;
    bench.add(rock);
  }
  const tweezers = mesh(track(makeTweezers()));
  tweezers.position.set(0.55, 1.0, -0.6);
  tweezers.rotation.y = 0.5;
  bench.add(tweezers);
  const magnifier = mesh(track(makeMagnifier()));
  magnifier.position.set(-0.4, 1.0, -0.55);
  magnifier.rotation.z = Math.PI / 2;
  bench.add(magnifier);
  group.add(bench);

  // 茶几与茶具
  const teaTable = new THREE.Group();
  teaTable.position.set(0.3, 0, 0.75);
  const tableTop = mesh(track(vbox(14, 3, 14, (x, y, z) => mixHex(0x5b4a36, 0x40321f, hash3(x, y, z, 47) * 0.4), 0.05)));
  tableTop.position.y = 0.44;
  teaTable.add(tableTop);
  const tableLeg = mesh(track(vbox(6, 9, 6, 0x43301e, 0.05)));
  tableLeg.position.y = 0.2;
  teaTable.add(tableLeg);
  const teapot = mesh(track(makeTeapot()));
  teapot.position.set(0.02, 0.49, 0.02);
  teaTable.add(teapot);
  for (const [cx, cz] of [[-0.12, 0.14], [0.16, -0.1]] as const) {
    const cup = mesh(track(makeCup()));
    cup.position.set(cx, 0.48, cz);
    teaTable.add(cup);
  }
  group.add(teaTable);
  for (const [sx, sz] of [[0.3, 1.5], [0.35, -0.1]] as const) {
    const stool = mesh(track(vbox(9, 9, 9, 0x4a3826, 0.05)));
    stool.position.set(sx, 0.22, sz);
    group.add(stool);
  }

  // 保险柜
  const safe = mesh(track(vbox(15, 15, 15, (x, y, z) => mixHex(0x2f4038, 0x1f2c26, hash3(x, y, z, 48) * 0.4), 0.05)));
  safe.position.set(3.15, 0.37, -2.25);
  group.add(safe);
  const dial = mesh(track(vbox(1, 3, 3, 0xc9c2b4, 0.04)));
  dial.position.set(2.76, 0.42, -2.25);
  group.add(dial);

  // 挂历（墙上一点生活的颜色）
  const calendar = mesh(track(vbox(14, 20, 1, (x, y) => (y > 16 ? 0xb03a2e : (x + y) % 3 === 0 ? 0xe8e2d4 : 0xf2ede0), 0.02)));
  calendar.position.set(-1.6, 2.0, 2.72);
  group.add(calendar);

  // 灯光
  const key = new THREE.PointLight(0xffc98a, 26, 11, 2);
  key.position.set(1.2, 2.4, -0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.002;
  group.add(key);
  const bulb = mesh(track(vbox(2, 3, 2, 0xffe9c0, 0.03)), track(new THREE.MeshBasicMaterial({ color: 0xffe9c0 })));
  bulb.position.set(1.2, 2.75, -0.9);
  group.add(bulb);
  const cord = mesh(track(vbox(1, 6, 1, 0x2a2118, 0.02)));
  cord.position.set(1.2, 3.1, -0.9);
  group.add(cord);
  const frontFill = new THREE.PointLight(0xffe2c0, 30, 10, 2);
  frontFill.position.set(-1.0, 2.1, 2.5);
  group.add(frontFill);
  const winLight = new THREE.SpotLight(0xffd9a0, 110, 14, 0.5, 0.6, 1.8);
  winLight.position.set(1.5, 2.7, -2.6);
  winLight.target.position.set(-0.5, 0, 1.4);
  group.add(winLight, winLight.target);
  const hemi = new THREE.HemisphereLight(0x4a4238, 0x191410, 0.5);
  group.add(hemi);

  // 人物
  const zb = cast.makeZbGround();
  const collector = cast.makeCollector();
  group.add(zb.root, collector.root);
  collector.root.position.set(1.5, 0, -2.35);
  collector.root.rotation.y = 0;

  // 手中道具
  const collectorPot = mesh(track(makeTeapot()));
  collectorPot.visible = false;
  collector.anchors.handR.add(collectorPot);
  const zbCup = mesh(track(makeCup()));
  zbCup.visible = false;
  zb.anchors.handL.add(zbCup);
  const zbPhone = mesh(track(makePhone()));
  zbPhone.visible = false;
  zb.anchors.handR.add(zbPhone);

  // 章北海入场的起点
  zb.root.position.set(-2.1, 0, 2.5);
  zb.root.rotation.y = -Math.PI / 2;

  const update = (t: number): void => {
    // 章北海入场
    const enter = segmentProgress(t, 25.4, 28.4);
    zb.root.position.set(lerp(-2.1, 0.3, easeInOutCubic(enter)), 0, lerp(2.5, 1.55, easeInOutCubic(enter)));
    zb.root.rotation.y = lerp(-Math.PI / 2, Math.PI, easeInOutCubic(enter));
    const zbIdle = idle(t + 3);
    let zbPose: Pose = { ...zbIdle };
    // 举杯（"我这杯茶也是陨石"）
    const cupUp = smoothstep(segmentProgress(t, 51.6, 52.6)) * (1 - smoothstep(segmentProgress(t, 58.0, 59.2)));
    zbCup.visible = t > 44;
    if (cupUp > 0) {
      const raised: Pose = {
        armL: [-1.98, 0, -0.28],
        neck: [0.1, 0, 0],
      };
      zbPose = { ...zbPose, armL: [lerp(zbPose.armL![0]!, -1.7, cupUp), 0.12 * cupUp, lerp(zbPose.armL![2]!, -0.3, cupUp)], neck: [0.1 * cupUp, 0, 0] };
      void raised;
    }
    // 拿手机付款
    const phoneUp = smoothstep(segmentProgress(t, 78.3, 79.1)) * (1 - smoothstep(segmentProgress(t, 81.9, 82.9)));
    zbPhone.visible = phoneUp > 0.01;
    if (phoneUp > 0) {
      zbPose = { ...zbPose, armR: [lerp(zbPose.armR![0]!, -1.45, phoneUp), -0.35 * phoneUp, 0.1], neck: [0.32 * phoneUp, -0.3 * phoneUp, 0] };
    }
    // 离场转身
    const leave = segmentProgress(t, 93.6, 96.6);
    if (leave > 0) {
      zb.root.position.set(lerp(0.3, -1.9, easeInOutCubic(leave)), 0, lerp(1.55, 2.45, easeInOutCubic(leave)));
      zb.root.rotation.y = lerp(Math.PI, Math.PI * 0.62, easeInOutCubic(leave));
      zbPose = { ...zbPose, ...walk(t * 1.5, 0.8) };
    }
    applyPose(zb, zbPose);

    // 收藏者：招呼、介绍、大笑、尴尬
    const c = idle(t + 9);
    let cPose: Pose = { ...c };
    const greet = smoothstep(segmentProgress(t, 28.6, 30.2)) * (1 - smoothstep(segmentProgress(t, 33.4, 34.4)));
    const introduce = smoothstep(segmentProgress(t, 38.6, 40.2)) * (1 - smoothstep(segmentProgress(t, 50.2, 51.4)));
    const laugh = smoothstep(segmentProgress(t, 59.4, 60.2)) * (1 - smoothstep(segmentProgress(t, 62.0, 62.8)));
    const awkward = smoothstep(segmentProgress(t, 82.8, 83.8)) * (1 - smoothstep(segmentProgress(t, 85.6, 86.6)));
    const pour = smoothstep(segmentProgress(t, 33.8, 34.6)) * (1 - smoothstep(segmentProgress(t, 36.2, 37.2)));
    collectorPot.visible = pour > 0.01;
    const armR = c.armR!;
    if (greet > 0) {
      cPose.armR = [lerp(armR[0]!, -1.2, greet), -0.5 * greet, 0.15];
      cPose.neck = [0.05, 0.2 * greet, 0];
    }
    if (introduce > 0) {
      cPose.armR = [lerp(armR[0]!, -0.9, introduce), -0.9 * introduce, 0.1];
      cPose.armL = [lerp(c.armL![0]!, -0.5, introduce * 0.6), 0.6 * introduce, -0.1];
    }
    if (laugh > 0) {
      cPose.neck = [-0.24 * laugh, Math.sin(t * 9) * 0.05 * laugh, 0];
      cPose.hips = [-0.08 * laugh, 0, 0];
      cPose.armR = [lerp(armR[0]!, -0.5, laugh), 0, 0.5 * laugh];
      cPose.armL = [lerp(c.armL![0]!, -0.5, laugh), 0, -0.5 * laugh];
    }
    if (awkward > 0) {
      cPose.armR = [lerp(armR[0]!, -0.85, awkward), 0.5 * awkward, 0.3];
      cPose.armL = [lerp(c.armL![0]!, -0.85, awkward), -0.5 * awkward, -0.3];
      cPose.neck = [0.3 * awkward, 0, 0];
    }
    if (pour > 0) {
      cPose.armR = [lerp(armR[0]!, -1.35, pour), -0.3, 0.1];
      cPose.neck = [0.34 * pour, 0, 0];
    }
    applyPose(collector, cPose);

    // 灯光微闪（老宅的电流声）
    const wobble = 0.94 + hash3(Math.floor(t * 5), 3, 0, 51) * 0.06;
    key.intensity = 26 * wobble;
  };
  return { group, update, zb, collector };
}

/* ------------------------------------------------------------------ */
/* 模型车间                                                            */
/* ------------------------------------------------------------------ */

export function makeShop(cast: Cast): Env {
  const group = new THREE.Group();
  const V = 0.25;
  const boxes: BoxSpec[] = [];
  boxes.push({
    from: [-32, -2, -24],
    to: [32, 0, 24],
    color: (x, y, z) => {
      const wear = hash3(x, y, z, 61) * 0.3;
      const line = Math.abs(z - 2) < 1 ? 1 : 0;
      return mixHex(0x494f56, line ? 0xb09b3a : 0x2c3138, line ? 0.7 : wear);
    },
  });
  boxes.push({ from: [-32, 0, -24], to: [32, 20, -20], color: (x, y, z) => mixHex(0x3d434b, 0x23272d, hash3(x, y, z, 62) * 0.4) });
  boxes.push({ from: [-32, 0, 20], to: [32, 20, 24], color: (x, y, z) => mixHex(0x3d434b, 0x23272d, hash3(x, y, z, 63) * 0.4) });
  boxes.push({ from: [-32, 0, -20], to: [-28, 20, 20], color: (x, y, z) => mixHex(0x3d434b, 0x23272d, hash3(x, y, z, 64) * 0.4) });
  boxes.push({ from: [28, 0, -20], to: [32, 20, 20], color: (x, y, z) => mixHex(0x3d434b, 0x23272d, hash3(x, y, z, 65) * 0.4) });
  boxes.push({ from: [-32, 20, -24], to: [32, 22, 24], color: 0x1d2126 });
  // 立柱
  for (const [px, pz] of [[-16, -12], [16, -12], [-16, 12], [16, 12]] as const) {
    boxes.push({ from: [px, 0, pz], to: [px + 2, 20, pz + 2], color: 0x31363d });
  }
  // 深处货架剪影
  for (let i = 0; i < 4; i++) {
    boxes.push({ from: [-24 + i * 12, 0, -19], to: [-14 + i * 12, 12, -20.5], color: 0x23272c });
  }
  const structure = track(mesh(track(voxelUnion(boxes, V)), track(voxelMaterial({ roughness: 1 }))));
  group.add(structure);

  // 数控机床
  const machine = new THREE.Group();
  machine.position.set(0.6, 0, -1.3);
  const base = mesh(track(vbox(36, 14, 24, (x, y, z) => mixHex(0x2f353c, 0x20242a, hash3(x, y, z, 66) * 0.4), 0.05)));
  base.position.y = 0.35;
  machine.add(base);
  const table = mesh(track(vbox(28, 3, 18, 0x59616a, 0.05)));
  table.position.y = 0.78;
  machine.add(table);
  // 龙门与主轴
  const column = mesh(track(vbox(6, 34, 20, 0x383f47, 0.05)));
  column.position.set(-1.0, 1.7, -0.2);
  machine.add(column);
  const rail = mesh(track(vbox(4, 4, 22, 0x59616a, 0.05)));
  rail.position.set(-0.7, 3.0, -0.2);
  machine.add(rail);
  const spindle = mesh(track(vbox(7, 9, 7, 0x24282e, 0.05)));
  spindle.position.set(-0.35, 2.35, -0.2);
  machine.add(spindle);
  const bit = mesh(track(vbox(1, 5, 1, 0xc9a24a, 0.015)));
  bit.position.set(-0.35, 1.86, -0.2);
  machine.add(bit);
  // 工件：一块铁陨石固定在台上
  const workpiece = mesh(track(voxelRock(7, 77, [0x4c5156, 0x3a3e43, 0x5a5044], 0.03)));
  workpiece.position.set(-0.35, 1.0, -0.2);
  machine.add(workpiece);
  // 防护罩四柱与顶
  for (const [px, pz] of [[-1.5, -1.1], [1.5, -1.1], [-1.5, 0.7], [1.5, 0.7]] as const) {
    const post = mesh(track(vbox(2, 36, 2, 0x7d858d, 0.05)));
    post.position.set(px, 1.8, pz);
    machine.add(post);
  }
  const roofFrame = mesh(track(vbox(34, 2, 22, 0x7d858d, 0.05)));
  roofFrame.position.set(0, 3.6, -0.2);
  machine.add(roofFrame);
  // 控制屏
  const panel = mesh(track(vbox(2, 12, 16, 0x24282e, 0.05)));
  panel.position.set(2.1, 1.35, 0.3);
  panel.rotation.y = -0.5;
  machine.add(panel);
  const screenMat = track(new THREE.MeshBasicMaterial({ color: 0x6fc9de }));
  const screen = mesh(track(vbox(1, 8, 12, 0x6fc9de, 0.04)), screenMat);
  screen.position.set(2.2, 1.45, 0.3);
  screen.rotation.y = -0.5;
  machine.add(screen);
  group.add(machine);

  // 火花
  const sparkCount = 90;
  const sparkGeo = track(new THREE.BufferGeometry());
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkCol = new Float32Array(sparkCount * 3);
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkCol, 3));
  const sparks = new THREE.Points(sparkGeo, track(new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  group.add(sparks);

  // 工作台与 36 根圆柱
  const workbench = new THREE.Group();
  workbench.position.set(3.8, 0, 2.0);
  const wtop = mesh(track(vbox(30, 3, 18, 0x59616a, 0.05)));
  wtop.position.y = 0.9;
  workbench.add(wtop);
  for (const [lx, lz] of [[-1.1, -0.6], [1.1, -0.6], [-1.1, 0.6], [1.1, 0.6]] as const) {
    const leg = mesh(track(vbox(3, 18, 3, 0x31363d, 0.05)));
    leg.position.set(lx, 0.45, lz);
    workbench.add(leg);
  }
  const cloth = mesh(track(vbox(26, 1, 15, 0x3a4046, 0.02)));
  cloth.position.y = 0.925;
  workbench.add(cloth);
  const rounds: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const r = mesh(track(makeMeteorRound(1)));
    r.position.set(-0.55 + (i % 6) * 0.22, 0.99, -0.42 + Math.floor(i / 6) * 0.16);
    r.rotation.y = hash3(i, 0, 0, 71) * 0.8;
    r.visible = false;
    workbench.add(r);
    rounds.push(r);
  }
  const jar = mesh(track(vbox(6, 9, 6, 0x8fa3ad, 0.02)));
  jar.position.set(0.6, 0.99, -0.5);
  workbench.add(jar);
  const cutter = mesh(track(vbox(2, 8, 2, 0xc9a24a, 0.02)));
  cutter.position.set(0.7, 0.97, -0.2);
  workbench.add(cutter);
  group.add(workbench);

  // 灯光：冷色灯带，可开关
  const stripMat = track(new THREE.MeshBasicMaterial({ color: 0xcfe4f2 }));
  for (const sx of [-3.2, 3.2]) {
    const strip = mesh(track(vbox(50, 2, 6, 0xcfe4f2, 0.1)), stripMat);
    strip.position.set(sx, 4.7, -0.5);
    group.add(strip);
  }
  const cool1 = new THREE.PointLight(0xcfe4f2, 0, 18, 2);
  cool1.position.set(-3.2, 4.4, -0.5);
  const cool2 = new THREE.PointLight(0xcfe4f2, 0, 18, 2);
  cool2.position.set(3.2, 4.4, 1.5);
  group.add(cool1, cool2);
  const screenLight = new THREE.PointLight(0x6fc9de, 8, 5, 2);
  screenLight.position.set(2.2, 1.5, 0.5);
  group.add(screenLight);
  const machineGlow = new THREE.PointLight(0xffc27a, 0, 4, 2);
  machineGlow.position.set(-0.35, 1.75, -0.2);
  group.add(machineGlow);
  const hemi = new THREE.HemisphereLight(0x2e3844, 0x0b0d10, 0.35);
  group.add(hemi);

  const zb = cast.makeZbGround();
  group.add(zb.root);

  const update = (t: number): void => {
    // 灯带启动（微闪后亮起）
    const on = segmentProgress(t, 97.9, 98.7);
    const flick = on < 1 ? (hash3(Math.floor(t * 30), 0, 0, 72) > 0.5 ? 1 : 0.2) : 1;
    const level = on <= 0 ? 0 : Math.max(flick * smoothstep(on), 0.12);
    cool1.intensity = 70 * level;
    cool2.intensity = 56 * level * 0.8;
    stripMat.color.setHex(0xcfe4f2).multiplyScalar(0.15 + level * 0.85);
    screenMat.color.setHex(0x6fc9de).multiplyScalar(0.3 + level * 0.7);

    // 人物动线：门口 → 机床 → 工作台
    const walkIn = segmentProgress(t, 97.6, 100.6);
    const toTable = segmentProgress(t, 110.6, 112.4);
    const toBench = segmentProgress(t, 116.8, 118.2);
    let px: number;
    let pz: number;
    let heading: number;
    if (toBench > 0) {
      px = lerp(0.6, 3.1, easeInOutCubic(toBench));
      pz = lerp(-0.1, 3.1, easeInOutCubic(toBench));
      heading = Math.PI;
    } else if (toTable > 0) {
      px = lerp(1.6, 2.6, easeInOutCubic(toTable));
      pz = lerp(0.6, 3.1, easeInOutCubic(toTable));
      heading = Math.PI;
    } else {
      px = lerp(-4.4, 1.6, easeInOutCubic(walkIn));
      pz = lerp(3.6, 0.55, easeInOutCubic(walkIn));
      heading = Math.PI * 0.86;
    }
    zb.root.position.set(px, 0, pz);
    zb.root.rotation.y = heading;
    const walking = (t > 97.6 && t < 100.8) || (t > 110.6 && t < 112.6) || (t > 116.8 && t < 118.4);
    let pose: Pose = walking ? walk(t * 1.5, 0.85) : idle(t + 5);
    if (!walking && toBench >= 1) {
      // 拆刀 → 关灯
      const unbolt = smoothstep(segmentProgress(t, 119.6, 121.2));
      pose = {
        ...pose,
        armR: [lerp(pose.armR![0]!, -1.15, unbolt), -0.4 * unbolt, 0.1],
        neck: [0.35 * unbolt, 0, 0],
      };
    } else if (!walking && toTable > 0) {
      // 摆放圆柱
      const place = Math.sin(t * 3.1) * 0.5 + 0.5;
      pose = {
        ...pose,
        armR: [lerp(pose.armR![0]!, -1.0, 0.5 + place * 0.4), -0.35, 0.12],
        neck: [0.3, 0.25, 0],
      };
    } else if (!walking) {
      // 机床前操作
      const work = t > 103.2 && t < 112.2;
      pose = {
        ...pose,
        armR: [work ? -0.9 + Math.sin(t * 7) * 0.12 : -0.35, -0.45, 0.12],
        armL: [work ? -0.75 + Math.cos(t * 5.3) * 0.1 : -0.2, -0.4, -0.12],
        neck: [work ? 0.4 : 0.2, 0.3, 0],
        hips: [0, 0.15, 0],
      };
    }
    applyPose(zb, pose);

    // 切削：主轴下降、火花、切削热光
    const cutting = t > 103.4 && t < 112.2;
    const depth = cutting ? Math.min(1, (t - 103.4) / 2) : 0;
    spindle.position.y = 2.35 - depth * 0.5;
    bit.position.y = 1.86 - depth * 0.5;
    machineGlow.intensity = cutting ? 12 : 0;
    workpiece.scale.setScalar(cutting ? 1 - depth * 0.18 : 1);
    for (let i = 0; i < sparkCount; i++) {
      if (!cutting) {
        sparkPos[i * 3 + 1] = -50;
        continue;
      }
      const life = (t * 2.2 + hash3(i, 1, 0, 73) * 10) % 1;
      const a = hash3(i, 2, 0, 74) * Math.PI * 2;
      const r = life * (0.5 + hash3(i, 3, 0, 75) * 1.4);
      sparkPos[i * 3] = 0.25 + Math.cos(a) * r;
      sparkPos[i * 3 + 1] = 1.62 - depth * 0.5 - life * life * 0.9;
      sparkPos[i * 3 + 2] = -0.2 + Math.sin(a) * r * 0.6;
      const heat = 1 - life;
      sparkCol[i * 3] = heat;
      sparkCol[i * 3 + 1] = heat * 0.55;
      sparkCol[i * 3 + 2] = heat * 0.12;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;

    // 圆柱逐根出现（110.8–114.4）
    for (let i = 0; i < rounds.length; i++) {
      rounds[i]!.visible = t > 110.8 + (i / 36) * 3.6;
    }
  };
  return { group, update, zb };
}

/* ------------------------------------------------------------------ */
/* 地下室                                                              */
/* ------------------------------------------------------------------ */

export function makeBase(cast: Cast): Env {
  const group = new THREE.Group();
  const V = 0.1;
  const boxes: BoxSpec[] = [];
  boxes.push({
    from: [-25, -1, -20],
    to: [25, 0, 20],
    color: (x, y, z) => mixHex(0x45413b, 0x2a2724, hash3(x, y, z, 81) * 0.45),
  });
  const conc = (x: number, y: number, z: number): number => mixHex(0x565049, 0x332f2b, hash3(x, Math.floor(y / 4), z, 82) * 0.5);
  boxes.push({ from: [-25, 0, -20], to: [25, 26, -17], color: conc });
  boxes.push({ from: [-25, 0, 17], to: [25, 26, 20], color: conc });
  boxes.push({ from: [-25, 0, -17], to: [-22, 26, 17], color: conc });
  boxes.push({ from: [22, 0, -17], to: [25, 26, 17], color: conc });
  boxes.push({ from: [-25, 26, -20], to: [25, 28, 20], color: 0x2e2b28 });
  for (const z of [-12, 0, 12]) {
    boxes.push({ from: [-25, 23, z - 2], to: [25, 26, z + 2], color: 0x3a3630 });
  }
  // 墙角的水管与架子
  boxes.push({ from: [-24, 2, -16], to: [-23, 4, 16], color: 0x4a4e52 });
  boxes.push({ from: [-21, 0, -16], to: [-16, 10, -15], color: 0x3c3833 });
  const structure = track(mesh(track(voxelUnion(boxes, V)), track(voxelMaterial({ roughness: 1 }))));
  group.add(structure);

  // 吊灯（可摆动）
  const lampPivot = new THREE.Group();
  lampPivot.position.set(0, 2.55, 0.15);
  const cord = mesh(track(vbox(1, 14, 1, 0x1c1a17, 0.02)));
  cord.position.y = -0.35;
  lampPivot.add(cord);
  const bulbMat = track(new THREE.MeshBasicMaterial({ color: 0xffdba6 }));
  const bulb = mesh(track(vbox(3, 4, 3, 0xffdba6, 0.03)), bulbMat);
  bulb.position.y = -0.72;
  lampPivot.add(bulb);
  group.add(lampPivot);
  const keyLight = new THREE.PointLight(0xffcf9a, 7.5, 9, 2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.002;
  keyLight.position.set(0, 1.85, 0.15);
  group.add(keyLight);
  // 光锥
  const cone = new THREE.Mesh(
    track(new THREE.ConeGeometry(1.7, 2.6, 6, 1, true)),
    track(new THREE.MeshBasicMaterial({ color: 0xffcf9a, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })),
  );
  cone.position.set(0, 1.6, 0.15);
  group.add(cone);
  const fill = new THREE.PointLight(0x4a5a6e, 20, 9, 2);
  fill.position.set(-1.6, 1.2, 1.2);
  group.add(fill);
  const cornerLamp = new THREE.PointLight(0xffc890, 4, 6, 2);
  cornerLamp.position.set(1.6, 1.5, -1.1);
  group.add(cornerLamp);

  // 桌子
  const table = new THREE.Group();
  table.position.set(0.05, 0, -0.45);
  const ttop = mesh(track(vbox(32, 3, 16, (x, y, z) => mixHex(0x5b4a36, 0x3d3120, hash3(x, y, z, 83) * 0.4), 0.05)));
  ttop.position.y = 0.9;
  table.add(ttop);
  for (const [lx, lz] of [[-1.35, -0.55], [1.35, -0.55], [-1.35, 0.55], [1.35, 0.55]] as const) {
    const leg = mesh(track(vbox(3, 18, 3, 0x40301e, 0.05)));
    leg.position.set(lx, 0.45, lz);
    table.add(leg);
  }
  group.add(table);

  // 弹药箱、钳子、胶、弹匣、手枪、铁盒
  const ammoBox = mesh(track(makeAmmoBox()));
  ammoBox.position.set(-0.85, 1.03, -0.55);
  ammoBox.rotation.y = 0.2;
  group.add(ammoBox);
  const pliers = mesh(track(makePliers()));
  pliers.position.set(-0.35, 0.97, -0.25);
  group.add(pliers);
  const gluePot = mesh(track(vbox(3, 4, 3, 0x9a8a6a, 0.02)));
  gluePot.position.set(0.75, 0.97, -0.7);
  group.add(gluePot);
  const mag = mesh(track(makeMagazine()));
  mag.position.set(0.35, 0.96, -0.2);
  mag.rotation.y = -0.4;
  group.add(mag);
  const tin = mesh(track(vbox(8, 3, 6, 0x767d84, 0.02)));
  tin.position.set(0.85, 0.97, -0.1);
  group.add(tin);

  // 待加工子弹（逐发出现）与成品陨石子弹
  const rawRounds: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const r = mesh(track(makeMeteorRound(0.8)));
    r.position.set(-0.62 + (i % 4) * 0.07, 0.99, -0.36 + Math.floor(i / 4) * 0.06);
    r.rotation.y = 0.4;
    r.visible = false;
    group.add(r);
    rawRounds.push(r);
  }
  const doneRounds: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const r = mesh(track(makeMeteorRound(0.8)));
    r.position.set(-0.5 + (i % 6) * 0.062, 0.99, -0.14 + Math.floor(i / 6) * 0.05);
    r.rotation.y = 0.4;
    r.visible = false;
    group.add(r);
    doneRounds.push(r);
  }

  // 角落布包（靶子）
  const bundle = new THREE.Group();
  bundle.position.set(1.95, 0, -1.55);
  const sack = mesh(track(vbox(11, 10, 11, (x, y, z) => mixHex(0x8a8174, 0x5f574c, hash3(x, y, z, 84) * 0.4), 0.05)));
  sack.position.y = 0.28;
  bundle.add(sack);
  const strap = mesh(track(vbox(12, 2, 12, 0x3a342c, 0.05)));
  strap.position.y = 0.3;
  bundle.add(strap);
  // 弹孔
  for (let i = 0; i < 5; i++) {
    const hole = mesh(track(vbox(1, 1, 1, 0x14100c, 0.03)));
    hole.position.set(-0.2 + hash3(i, 5, 0, 85) * 0.4, 0.24 + hash3(i, 6, 0, 86) * 0.3, 0.29);
    bundle.add(hole);
  }
  const beef = mesh(track(vbox(9, 7, 8, (x, y, z) => mixHex(0x5c1b18, 0x3c1210, hash3(x, y, z, 87) * 0.5), 0.03)));
  beef.position.set(0, 0.62, 0);
  beef.visible = false;
  bundle.add(beef);
  group.add(bundle);

  // 硝烟
  const smokeCount = 70;
  const smokeGeo = track(new THREE.BufferGeometry());
  const smokePos = new Float32Array(smokeCount * 3);
  smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
  const smoke = new THREE.Points(smokeGeo, track(new THREE.PointsMaterial({ color: 0xbfb9ae, size: 0.09, transparent: true, opacity: 0.32, depthWrite: false })));
  group.add(smoke);

  // 章北海（本场景独立实例）
  const zb = cast.makeZbGround();
  group.add(zb.root);

  const handPliers = mesh(track(makePliers()));
  handPliers.visible = false;
  zb.anchors.handR.add(handPliers);
  handPliers.position.set(0.01, 0.03, 0.05);

  const muzzleFlashMat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(glowCanvas("rgba(255,240,200,1)", "rgba(255,180,80,0.6)", "rgba(255,120,30,0)")),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const muzzleFlash = new THREE.Sprite(muzzleFlashMat);
  muzzleFlash.scale.setScalar(0.001);
  group.add(muzzleFlash);
  const muzzleFlashLight = new THREE.PointLight(0xffc27a, 0, 6, 2);
  group.add(muzzleFlashLight);

  // 手枪、瞄准镜与掌心碎片挂在手上
  const pistol = mesh(track(makePistol()));
  pistol.visible = false;
  zb.anchors.handR.add(pistol);
  pistol.position.set(0.02, 0.05, 0.02);
  const scope = mesh(track(makeScope()));
  scope.visible = false;
  zb.anchors.handR.add(scope);
  scope.position.set(0.02, 0.11, 0.06);
  const fragments = mesh(track(voxelRock(5, 91, [0x6b6f74, 0x4c5054, 0x7d7168], 0.02)));
  fragments.visible = false;
  zb.anchors.handR.add(fragments);
  fragments.position.set(0.02, 0.06, 0.1);

  const update = (t: number): void => {
    // 吊灯微摆
    lampPivot.rotation.z = Math.sin(t * 0.9) * 0.045;
    lampPivot.rotation.x = Math.sin(t * 0.63 + 1) * 0.03;
    keyLight.position.set(lampPivot.rotation.z * -1.6, 1.85, 0.15 + lampPivot.rotation.x * -1.6);
    const off = t > 159.85;
    const dim = off ? 0 : 0.9 + hash3(Math.floor(t * 6), 0, 0, 88) * 0.1;
    keyLight.intensity = 7.5 * dim;
    bulbMat.color.setHex(0xffdba6).multiplyScalar(off ? 0.05 : 0.85 + dim * 0.2);
    (cone.material as THREE.MeshBasicMaterial).opacity = off ? 0 : 0.045 * dim;

    // 动线
    let px = -0.15;
    let pz = 0.75;
    let heading = Math.PI;
    const toCorner = segmentProgress(t, 148.8, 150.4);
    const back = segmentProgress(t, 153.4, 154.6);
    if (toCorner > 0 && back === 0) {
      px = lerp(-0.15, 1.15, easeInOutCubic(toCorner));
      pz = lerp(0.75, -0.55, easeInOutCubic(toCorner));
      heading = lerp(Math.PI, 2.5, easeInOutCubic(toCorner));
    } else if (back > 0) {
      px = lerp(1.15, -0.15, easeInOutCubic(back));
      pz = lerp(-0.55, 0.75, easeInOutCubic(back));
      heading = lerp(2.5, Math.PI, easeInOutCubic(back));
    }
    zb.root.position.set(px, 0, pz);
    zb.root.rotation.y = heading;
    const walking = (t > 148.8 && t < 150.5) || (t > 153.4 && t < 154.7);
    let pose: Pose = walking ? walk(t * 1.5, 0.8) : idle(t + 11);

    pliers.visible = t < 127.2 && !walking;
    handPliers.visible = t >= 127.4 && t < 139.6 && !walking;
    pistol.visible = t > 139.6;
    scope.visible = false;
    fragments.visible = t > 154.4 && t < 158.4;

    // 枪口火光（145.8 击发后的两个瞬间）
    const flashT = t - 145.8;
    const flashOn = flashT >= 0 && flashT < 0.14;
    if (flashOn) {
      pistol.getWorldPosition(_v1);
      muzzleFlash.position.copy(_v1);
      muzzleFlash.scale.setScalar(0.5 + (0.09 - Math.min(flashT, 0.22 - flashT)) * 18);
      muzzleFlashMat.opacity = 0.95;
      muzzleFlashLight.position.copy(_v1);
      muzzleFlashLight.intensity = 60;
    } else {
      muzzleFlash.scale.setScalar(0.001);
      muzzleFlashMat.opacity = 0;
      muzzleFlashLight.intensity = 0;
    }

    if (!walking) {
      const pulling = t >= 127.4 && t < 134.8;
      const gluing = t >= 135.0 && t < 139.6;
      const loading = t >= 140.0 && t < 143.0;
      const aiming = t >= 144.0 && t < 149.0;
      if (aiming) {
        const fireKick = Math.max(0, 1 - ((t - 145.8) * 6) % 1) * (t > 145.8 && t < 146.4 ? 1 : 0);
        pose = {
          ...pose,
          hips: [0, -0.5, 0],
          neck: [0.1, -0.3, 0],
          armR: [-Math.PI / 2 + 0.08 - fireKick * 0.3, -0.2, 0.09],
          armL: [-Math.PI / 2 + 0.15, -0.5, -0.3],
          legR: [0.1, 0, 0],
          legL: [-0.1, 0, 0],
        };
      } else if (loading) {
        pose = { ...pose, armR: [-1.1 + Math.sin(t * 6) * 0.15, -0.4, 0.1], neck: [0.42, -0.2, 0] };
      } else if (gluing) {
        pose = { ...pose, armR: [-1.25 + Math.sin(t * 3.4) * 0.2, -0.3, 0.1], neck: [0.45, 0.1, 0] };
      } else if (pulling) {
        pose = { ...pose, armR: [-1.2 + Math.sin(t * 5) * 0.18, -0.35, 0.12], armL: [-0.7, 0.35, -0.15], neck: [0.42, 0.2, 0] };
      } else if (t >= 149.4 && t < 153.6) {
        // 查看布包与牛肉
        pose = { ...pose, hips: [0, 0.4, 0], neck: [0.55, 0, 0], armR: [-0.6, 0.2, 0.1] };
      } else if (t >= 154.4 && t < 158.4) {
        // 掌心碎石
        pose = { ...pose, armR: [-1.35, -0.15, 0.12], neck: [0.5, -0.1, 0] };
      } else if (t >= 158.6) {
        // 收尾：合上箱子，拉灯绳
        const cordPull = smoothstep(segmentProgress(t, 159.5, 160.1));
        pose = { ...pose, armR: [lerp(-0.5, -2.4, cordPull), 0.3, 0.1], neck: [lerp(0.2, -0.4, cordPull), 0.2, 0] };
      }
    }
    applyPose(zb, pose);

    // 原料子弹与成品逐渐出现
    for (let i = 0; i < rawRounds.length; i++) {
      rawRounds[i]!.visible = t > 128.0 + i * 0.35 && t < 139.0 + i * 0.2;
    }
    for (let i = 0; i < doneRounds.length; i++) {
      doneRounds[i]!.visible = t > 135.6 + i * 0.28;
    }
    beef.visible = t > 150.6;
    sack.visible = true;
    strap.visible = true;
    sack.position.y = t > 150.6 ? -0.06 : 0;

    // 硝烟：枪响后升起、飘散
    const smokeLife = segmentProgress(t, 145.8, 154.0);
    for (let i = 0; i < smokeCount; i++) {
      if (smokeLife <= 0 || smokeLife >= 1) {
        smokePos[i * 3 + 1] = -50;
        continue;
      }
      const lx = lerp(0.55, 1.75, easeInOutCubic(toCorner));
      const lz = lerp(0.1, -1.35, easeInOutCubic(toCorner));
      const k = hash3(i, 1, 0, 89);
      smokePos[i * 3] = lx + (k - 0.5) * (0.4 + smokeLife * 2.4);
      smokePos[i * 3 + 1] = 1.35 + smokeLife * 1.9 + hash3(i, 2, 0, 90) * 0.5;
      smokePos[i * 3 + 2] = lz + (hash3(i, 3, 0, 92) - 0.5) * (0.4 + smokeLife * 2.0);
    }
    smokeGeo.attributes.position.needsUpdate = true;
    (smoke.material as THREE.PointsMaterial).opacity = 0.34 * Math.sin(Math.PI * clamp01(smokeLife));
  };
  return { group, update, zb };
}

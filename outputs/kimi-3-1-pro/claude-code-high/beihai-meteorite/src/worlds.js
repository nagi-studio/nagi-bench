import * as THREE from "three";
import { buildVoxelGeometry, voxelSphere } from "@agentbench/voxel-kit";
import {
  createCast, mesh, makeMeteor, makeCylinder, makePistol, makeScope, makeMug,
  makeMagnifier, makePhone, makeBackpack, makeThrusterPlume, makeMuzzleFlash,
} from "./figures.js";

const materialCache = new Map();
function material(colour, roughness = .82, metalness = .04) {
  const key = `${colour}/${roughness}/${metalness}`;
  if (!materialCache.has(key)) materialCache.set(key, new THREE.MeshStandardMaterial({ color: colour, roughness, metalness }));
  return materialCache.get(key);
}
export function box(parent, size, position, colour, options = {}) {
  const result = new THREE.Mesh(new THREE.BoxGeometry(...size), options.material ?? material(colour, options.roughness, options.metalness));
  result.position.set(...position); result.castShadow = options.castShadow ?? true; result.receiveShadow = options.receiveShadow ?? true;
  if (options.rotation) result.rotation.set(...options.rotation);
  parent.add(result); return result;
}
function lightRoot(root, ambient, ground = 0x17202a) {
  const hemi = new THREE.HemisphereLight(ambient, ground, .72); root.add(hemi); return hemi;
}
function seeded(seed = 1) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function canvasLabel(text, width = 512, height = 160, options = {}) {
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  const draw = (value = text) => {
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = options.background ?? "#10191a"; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = options.border ?? "#61706a"; ctx.lineWidth = 5; ctx.strokeRect(4, 4, width - 8, height - 8);
    ctx.fillStyle = options.colour ?? "#c6d3bd"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${options.fontSize ?? 44}px ui-monospace, monospace`;
    const lines = String(value).split("\n"); lines.forEach((line, i) => ctx.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * (options.fontSize ?? 44) * 1.25));
    texture.needsUpdate = true;
  };
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.magFilter = THREE.NearestFilter;
  draw(text); return { texture, draw };
}
function labelMesh(parent, text, size, position, options = {}) {
  const label = canvasLabel(text, 512, 192, options);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ map: label.texture, transparent: false, toneMapped: false }));
  plane.position.set(...position); parent.add(plane); return { plane, draw: label.draw };
}

function cabinet(parent, x, z, rotation, seed) {
  const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
  box(group, [1.65, .16, .65], [0, .08, 0], 0x30251d);
  box(group, [1.65, .13, .65], [0, 2.35, 0], 0x33271e);
  box(group, [.11, 2.3, .65], [-.78, 1.2, 0], 0x392b20); box(group, [.11, 2.3, .65], [.78, 1.2, 0], 0x392b20);
  box(group, [1.5, 2.15, .06], [0, 1.23, -.29], 0x211d19);
  for (const y of [.75, 1.45]) box(group, [1.48, .055, .58], [0, y, 0], 0x4a3829);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 2.05), new THREE.MeshPhysicalMaterial({ color: 0xb8d0c8, transparent: true, opacity: .12, roughness: .18, metalness: 0, depthWrite: false }));
  glass.position.set(0, 1.25, .34); group.add(glass);
  const rng = seeded(seed);
  for (let shelf = 0; shelf < 3; shelf++) for (let col = 0; col < 3; col++) {
    const rock = makeMeteor(seed + shelf * 7 + col, 2, .038); rock.scale.set(1 + rng() * .5, .65 + rng() * .35, .8 + rng() * .5);
    rock.position.set((col - 1) * .43, .42 + shelf * .7, .04); group.add(rock);
    box(group, [.28, .05, .25], [(col - 1) * .43, .25 + shelf * .7, .02], 0x777164);
  }
  const lamp = new THREE.PointLight(0xffd69a, 2.2, 2.6, 2); lamp.position.set(0, 2.12, .25); group.add(lamp);
  box(group, [1.25, .025, .08], [0, 2.17, .15], 0xd7b678, { material: new THREE.MeshBasicMaterial({ color: 0xffd99c }) });
  return group;
}

function makeHome(cast) {
  const root = new THREE.Group(); root.name = "OLD HOUSE";
  lightRoot(root, 0x9c8061, 0x211a18).intensity = .48;
  for (let i = 0; i < 14; i++) box(root, [.7, .12, 9], [-4.55 + i * .7, -.06, 0], i % 2 ? 0x372820 : 0x402e23);
  box(root, [10, 4.8, .25], [0, 2.4, -4.5], 0x5a5143);
  box(root, [.25, 4.8, 9], [-5, 2.4, 0], 0x4d483e); box(root, [.25, 4.8, 9], [5, 2.4, 0], 0x4d483e);
  for (const y of [3.75, 4.5]) box(root, [10, .18, .25], [0, y, -4.25], 0x30251e);
  for (const x of [-3.6, 0, 3.6]) box(root, [.2, .2, 9], [x, 4.45, 0], 0x2b231e);
  cabinet(root, -3.55, -4.05, 0, 2); cabinet(root, -1.55, -4.05, 0, 8); cabinet(root, 3.35, -4.05, 0, 19);
  cabinet(root, -4.55, -.9, Math.PI / 2, 29); cabinet(root, 4.55, -1.1, -Math.PI / 2, 42);
  box(root, [3.4, .16, 1.35], [0, .93, -1.65], 0x5b3b27);
  for (const x of [-1.45, 1.45]) for (const z of [-2.12, -1.18]) box(root, [.14, .9, .14], [x, .45, z], 0x3a291f);
  box(root, [1.2, .07, .7], [0, 1.05, -1.65], 0x31342e);
  // Block-built desk lamp and its warm pool.
  box(root, [.35, .08, .35], [-1.25, 1.07, -1.65], 0x403d32, { metalness: .5 });
  box(root, [.06, .85, .06], [-1.25, 1.48, -1.65], 0x5a5848, { metalness: .6 });
  box(root, [.55, .18, .4], [-1.25, 1.89, -1.55], 0x5d674f);
  const deskLight = new THREE.SpotLight(0xffc985, 32, 8, .7, .55, 1.6); deskLight.position.set(-1.25, 1.82, -1.45); deskLight.target.position.set(0, .7, -1.4); deskLight.castShadow = true; deskLight.shadow.mapSize.set(1024, 1024); root.add(deskLight, deskLight.target);
  const doorLight = new THREE.DirectionalLight(0xd9b789, 1.25); doorLight.position.set(2, 3, 5); root.add(doorLight);
  const scroll = labelMesh(root, "星  尘", [1.25, .48], [1.05, 3.1, -4.35], { background: "#b8a882", colour: "#3e382e", border: "#4b3c2c", fontSize: 70 }).plane;
  scroll.material.side = THREE.DoubleSide;
  const collector = cast.collector(); collector.root.position.set(.35, 0, -2.75); root.add(collector.root);
  const zhang = cast.zhangEarth(); zhang.root.position.set(-.4, 0, 1.35); zhang.root.rotation.y = Math.PI; root.add(zhang.root);
  const magnifier = makeMagnifier(); magnifier.position.set(0, 0, 1.1); collector.anchors.handL.add(magnifier);
  const collectorMug = makeMug(0x9a8d76); collectorMug.position.z = 1.1; collector.anchors.handR.add(collectorMug); collectorMug.visible = false;
  const zhangMug = makeMug(0x879187); zhangMug.position.z = 1.1; zhang.anchors.handR.add(zhangMug); zhangMug.visible = false;
  const phone = makePhone(); phone.position.z = .6; zhang.anchors.handL.add(phone); phone.visible = false;
  const benchMeteors = [-1, 0, 1].map((i) => { const rock = makeMeteor(60 + i, 3, .026); rock.position.set(i * .48, 1.17, -1.25); root.add(rock); rock.visible = false; return rock; });
  const radio = new THREE.Group(); box(radio, [.58, .32, .25], [0, 0, 0], 0x313a36); box(radio, [.34, .13, .015], [0, .04, .134], 0x708477, { material: new THREE.MeshBasicMaterial({ color: 0x627d6c }) }); box(radio, [.04, .5, .04], [.22, .36, 0], 0x656e66, { metalness: .6 });
  radio.position.set(1.15, 1.23, -1.7); radio.visible = false; root.add(radio);
  const endMug = makeMug(0x879187); endMug.scale.setScalar(.05625); endMug.position.set(.2, 1.1, -1.25); endMug.visible = false; root.add(endMug);
  // Square dust motes catch the cabinet light without introducing another visual language.
  const rng = seeded(95); const dustGeo = new THREE.BufferGeometry(); const dust = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i++) { dust[i * 3] = (rng() - .5) * 8; dust[i * 3 + 1] = rng() * 3.6 + .2; dust[i * 3 + 2] = (rng() - .5) * 7; }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3)); const motes = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xe7c997, size: .012, transparent: true, opacity: .36, depthWrite: false })); root.add(motes);
  return { root, collector, zhang, magnifier, collectorMug, zhangMug, phone, benchMeteors, radio, endMug, motes, deskLight, doorLight };
}

function makeWorkshop(cast) {
  const root = new THREE.Group(); root.name = "CNC WORKSHOP"; lightRoot(root, 0x78999d, 0x142022).intensity = .44;
  box(root, [12, .15, 11], [0, -.075, 0], 0x394245); box(root, [12, 5.5, .25], [0, 2.75, -4.5], 0x526063);
  box(root, [.25, 5.5, 10], [-5.5, 2.75, 0], 0x465358); box(root, [.25, 5.5, 10], [5.5, 2.75, 0], 0x465358);
  for (let x = -4; x <= 4; x += 2) box(root, [.035, .01, 10], [x, .012, 0], 0x242e31, { castShadow: false });
  for (let z = -4; z <= 4; z += 2) box(root, [11, .01, .035], [0, .012, z], 0x242e31, { castShadow: false });
  const machine = new THREE.Group(); machine.position.set(0, 0, -1.2); root.add(machine);
  box(machine, [4.2, .75, 2.7], [0, .38, 0], 0x3f5459, { metalness: .45 });
  box(machine, [.65, 2.8, 2.7], [-1.78, 1.65, 0], 0x607176, { metalness: .4 }); box(machine, [.65, 2.8, 2.7], [1.78, 1.65, 0], 0x607176, { metalness: .4 });
  box(machine, [3.1, .58, 2.7], [0, 2.75, 0], 0x596c70, { metalness: .4 }); box(machine, [3.2, .18, 1.6], [0, .92, 0], 0x242f33, { metalness: .7 });
  box(machine, [3.0, 1.7, .12], [0, 1.8, -1.25], 0x2d3c40);
  const spindle = new THREE.Group(); box(spindle, [.52, .65, .52], [0, 0, 0], 0x7f8c8b, { metalness: .8 }); const cutter = box(spindle, [.11, .7, .11], [0, -.62, 0], 0x9a9c91, { metalness: .9 });
  spindle.position.set(0, 2.25, .15); machine.add(spindle);
  const table = new THREE.Group(); table.position.set(0, 1.08, .25); machine.add(table);
  const stocks = [-1, 0, 1].map((i) => { const r = makeMeteor(80 + i, 3, .034); r.position.set(i * .55, .1, 0); table.add(r); return r; });
  const rods = Array.from({ length: 6 }, (_, i) => { const r = makeCylinder(0x4a504b, 2, 20, .014); r.rotation.z = Math.PI / 2; r.position.set((i % 3 - 1) * .4, .12 + Math.floor(i / 3) * .09, 0); table.add(r); r.visible = false; return r; });
  const tray = new THREE.Group(); tray.position.set(2.85, .94, .25); root.add(tray); box(tray, [1.55, .08, 1.4], [0, 0, 0], 0x536165, { metalness: .55 });
  const pieces = Array.from({ length: 36 }, (_, i) => { const p = makeCylinder(); p.position.set((i % 6 - 2.5) * .17, .1, (Math.floor(i / 6) - 2.5) * .17); tray.add(p); p.visible = false; return p; });
  const screen = labelMesh(machine, "N 00 / 36\nφ 7.62  L 11.0", [1.22, .46], [1.77, 2.15, 1.36], { background: "#0d1c1d", colour: "#9bc3ad", border: "#324b49", fontSize: 43 }); screen.plane.rotation.y = -.12;
  const zhang = cast.zhangEarth(); zhang.root.position.set(2.15, 0, 1.65); zhang.root.rotation.y = Math.PI * .82; root.add(zhang.root);
  const key = new THREE.SpotLight(0xb9e1dc, 48, 14, .82, .5, 1.4); key.position.set(1, 4.7, 3); key.target.position.set(0, 1, -1); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); root.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x587d88, 1.1); rim.position.set(-4, 2, -3); root.add(rim);
  const workLamps = [];
  for (const x of [-3, 0, 3]) { const lamp = box(root, [1.5, .08, .35], [x, 4.35, -.5], 0xc0d6cc, { material: new THREE.MeshBasicMaterial({ color: 0x91aaa5 }) }); workLamps.push(lamp); }
  const coolantGeo = new THREE.BufferGeometry(); const coolantPositions = new Float32Array(90 * 3); coolantGeo.setAttribute("position", new THREE.BufferAttribute(coolantPositions, 3));
  const coolant = new THREE.Points(coolantGeo, new THREE.PointsMaterial({ color: 0xa8d4cd, size: .022, transparent: true, opacity: .55, depthWrite: false })); machine.add(coolant);
  const shavingBag = new THREE.Group(); box(shavingBag, [.65, .5, .55], [0, 0, 0], 0x6f746a); shavingBag.position.set(-2.7, .35, .5); shavingBag.visible = false; root.add(shavingBag);
  return { root, machine, spindle, cutter, table, stocks, rods, pieces, screen, zhang, key, coolant, coolantPositions, shavingBag };
}

function makeBasement(cast) {
  const root = new THREE.Group(); root.name = "BASEMENT"; lightRoot(root, 0x7d6851, 0x161514).intensity = .28;
  box(root, [5.5, .14, 5.5], [0, -.07, 0], 0x3e3b34); box(root, [5.5, 3.1, .2], [0, 1.55, -2.75], 0x504b40); box(root, [.2, 3.1, 5.5], [-2.75, 1.55, 0], 0x49463e); box(root, [.2, 3.1, 5.5], [2.75, 1.55, 0], 0x49463e);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 9; col++) box(root, [.56, .28, .035], [-2.35 + col * .58 + (row % 2) * .25, .2 + row * .34, -2.63], (row + col) % 3 ? 0x5c5547 : 0x514b40, { castShadow: false });
  box(root, [2.5, .13, 1.45], [0, .91, 0], 0x4c3d30); for (const x of [-1.05, 1.05]) for (const z of [-.55, .55]) box(root, [.13, .88, .13], [x, .44, z], 0x352d27);
  box(root, [.025, .65, .025], [0, 2.77, 0], 0x252525); const bulb = box(root, [.16, .2, .16], [0, 2.4, 0], 0xe6c994, { material: new THREE.MeshBasicMaterial({ color: 0xffd79a }) });
  const lamp = new THREE.PointLight(0xffc987, 22, 7, 1.8); lamp.position.set(0, 2.3, 0); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); root.add(lamp);
  const zhang = cast.zhangEarth(); zhang.root.position.set(0, 0, 1.55); zhang.root.rotation.y = Math.PI; root.add(zhang.root);
  const rounds = Array.from({ length: 36 }, (_, i) => {
    const group = new THREE.Group(); const x = (i % 6 - 2.5) * .22, z = (Math.floor(i / 6) - 2.5) * .18; group.position.set(x, 1.05, z); root.add(group);
    const charge = box(group, [.055, .08, .055], [0, 0, 0], 0x4a4a40, { roughness: .65 });
    const original = makeCylinder(0x8b7350, 2, 5, .011); original.position.y = .07; group.add(original);
    const meteor = makeCylinder(0x3f4541, 2, 5, .011); meteor.position.y = .07; meteor.visible = false; group.add(meteor);
    return { group, charge, original, meteor };
  });
  const pistol = makePistol(); pistol.position.z = .5; zhang.anchors.handR.add(pistol); pistol.visible = false;
  const flash = makeMuzzleFlash(); flash.position.set(0, .35, 2.65); pistol.add(flash);
  const flashLight = new THREE.PointLight(0xffb76a, 0, 5, 2); flashLight.position.set(0, 1.6, .4); root.add(flashLight);
  const target = new THREE.Group(); target.position.set(0, 1.32, -2.15); root.add(target);
  const cloth = box(target, [.95, 1.0, .28], [0, 0, 0], 0x9b9786); box(target, [.13, 1.25, .13], [0, -.95, 0], 0x4a453d);
  const meat = box(target, [.77, .8, .2], [0, 0, .02], 0x743c35, { roughness: .9 }); meat.visible = false;
  const holes = Array.from({ length: 4 }, (_, i) => { const h = box(target, [.045, .045, .015], [(i % 2 - .5) * .25, (Math.floor(i / 2) - .5) * .25, .151], 0x211e1b, { castShadow: false }); h.visible = false; return h; });
  const fragments = new THREE.Group(); fragments.position.set(.45, 1.13, .15); root.add(fragments);
  const rng = seeded(202); for (let i = 0; i < 18; i++) { const f = makeMeteor(i, 1, .017); f.position.set((rng() - .5) * .28, rng() * .04, (rng() - .5) * .25); f.rotation.set(rng() * 3, rng() * 3, rng() * 3); fragments.add(f); } fragments.visible = false;
  const knife = new THREE.Group(); box(knife, [.04, .025, .55], [0, 0, 0], 0xa4aaa5, { metalness: .9 }); box(knife, [.08, .06, .24], [0, 0, .36], 0x342b25); knife.position.set(-.55, 1.11, .1); knife.visible = false; root.add(knife);
  return { root, zhang, rounds, pistol, flash, flashLight, target, cloth, meat, holes, fragments, knife, lamp, bulb };
}

function earthColour(x, y, z, radius) {
  const nx = (x + .5 - radius) / radius, ny = (y + .5 - radius) / radius, nz = (z + .5 - radius) / radius;
  const n = Math.sin(nx * 9 + Math.sin(nz * 5) * 1.7) + Math.cos(nz * 8 - ny * 4) * .7 + Math.sin((nx + ny + nz) * 13) * .36;
  if (Math.abs(ny) > .82) return 0xc4d8d4;
  const cloud = Math.sin(nx * 17 + nz * 8) + Math.cos(ny * 23 - nz * 5) + Math.sin((nx - nz) * 11);
  if (cloud > 2.05) return 0xd6ded6;
  if (n > .67) return ny > .25 ? 0x7d8865 : (n > 1.25 ? 0x9a8a64 : 0x4f765f);
  return n < -.8 ? 0x0a385c : 0x105477;
}

function makeStation() {
  const radius = 22, span = radius * 2;
  const geometry = buildVoxelGeometry({ size: [span, span, 5], at(x, y, z) {
    const dx = x + .5 - radius, dy = y + .5 - radius, r = Math.hypot(dx, dy);
    const ring = r > 17.2 && r < 21.4;
    const spoke = r < 18 && r > 3.5 && (Math.abs(dx) < .8 || Math.abs(dy) < .8 || Math.abs(dx - dy) < .7 || Math.abs(dx + dy) < .7) && z === 2;
    const hub = r < 4;
    if (!ring && !spoke && !hub) return null;
    if (ring && ((Math.floor(Math.atan2(dy, dx) * 7) + z) % 5 === 0)) return 0x8b806b;
    return z === 0 || z === 4 ? 0x52666c : 0x8b9a97;
  } }, { voxel: .34 });
  return mesh(geometry, { roughness: .58, metalness: .62, castShadow: false, receiveShadow: false });
}

function makeSpace(cast) {
  const root = new THREE.Group(); root.name = "GEOSTATIONARY ORBIT";
  const ambient = new THREE.HemisphereLight(0x7c9eb5, 0x07101b, .44); root.add(ambient);
  const sunlight = new THREE.DirectionalLight(0xffe0ae, 3.4); sunlight.position.set(-25, 16, 12); root.add(sunlight);
  const earthshine = new THREE.DirectionalLight(0x4d8fb7, .9); earthshine.position.set(-20, -15, -20); root.add(earthshine);
  const rng = seeded(701); const starGeo = new THREE.BufferGeometry(); const starPos = new Float32Array(2200 * 3); const starColours = new Float32Array(2200 * 3);
  for (let i = 0; i < 2200; i++) {
    const theta = rng() * Math.PI * 2, u = rng() * 2 - 1, r = 145 + rng() * 35, s = Math.sqrt(1 - u * u);
    starPos[i * 3] = Math.cos(theta) * s * r; starPos[i * 3 + 1] = u * r; starPos[i * 3 + 2] = Math.sin(theta) * s * r;
    const c = .55 + rng() * .45; starColours.set([c * .85, c * .92, c], i * 3);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3)); starGeo.setAttribute("color", new THREE.BufferAttribute(starColours, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: .18, vertexColors: true, sizeAttenuation: true, depthWrite: false, transparent: true, opacity: .9 })); root.add(stars);
  const earth = mesh(voxelSphere(30, (x, y, z) => earthColour(x, y, z, 30), { voxel: .62 }), { roughness: .96, metalness: 0, castShadow: false, receiveShadow: false }); earth.position.set(-17, -11, -56); root.add(earth);
  const atmosphere = mesh(voxelSphere(31, (x, y, z, d) => d > .945 ? 0x5bafe0 : null, { voxel: .62 }), { basic: true, transparent: true, opacity: .1, side: THREE.BackSide, depthWrite: false, castShadow: false, receiveShadow: false }); atmosphere.position.copy(earth.position); root.add(atmosphere);
  const sun = mesh(voxelSphere(5, 0xffd79a, { voxel: .58 }), { basic: true, castShadow: false, receiveShadow: false }); sun.position.set(-3, -3, -78); root.add(sun);
  const station = makeStation(); station.position.set(12, 5, -34); root.add(station);
  const hub = new THREE.Group(); hub.position.copy(station.position); root.add(hub);
  box(hub, [2.3, 1.4, 1.3], [0, -3.6, 1.1], 0x74868a, { metalness: .55, castShadow: false });
  const hatch = box(hub, [1.0, 1.1, .16], [0, -3.55, 1.8], 0x26383f, { metalness: .65, castShadow: false });
  const signalMaterial = new THREE.MeshStandardMaterial({ color: 0x6e3029, emissive: 0x6e130d, emissiveIntensity: 2 });
  const signal = box(hub, [.15, .15, .12], [.68, -3.15, 1.86], 0x6e3029, { material: signalMaterial, castShadow: false });
  box(root, [.055, 63, .055], [12, -26.5, -34], 0x5f7378, { metalness: .65, castShadow: false });
  labelMesh(hub, "黄 河 站", [2.4, .55], [0, 4.6, 1.0], { background: "#31434a", colour: "#d3d4bf", border: "#7f8f8c", fontSize: 58 });
  const drydock = new THREE.Group(); drydock.position.set(-22, 10, -68); root.add(drydock);
  for (let z = -6; z <= 6; z += 4) {
    box(drydock, [14, .25, .25], [0, -5, z], 0x4f646d, { castShadow: false }); box(drydock, [14, .25, .25], [0, 5, z], 0x4f646d, { castShadow: false });
    box(drydock, [.25, 10, .25], [-7, 0, z], 0x4f646d, { castShadow: false }); box(drydock, [.25, 10, .25], [7, 0, z], 0x4f646d, { castShadow: false });
  }
  for (const x of [-7, 7]) for (const y of [-5, 5]) box(drydock, [.2, .2, 12], [x, y, 0], 0x6c7a7b, { castShadow: false });
  const base = new THREE.Group(); base.position.set(-28, 14, -76); root.add(base); box(base, [4, 2, 2], [0, 0, 0], 0x6e7e82, { castShadow: false }); box(base, [12, .15, 3], [0, 0, 0], 0x344f62, { castShadow: false });
  const debris = new THREE.Group(); root.add(debris);
  for (let i = 0; i < 36; i++) { const d = box(debris, [.12 + rng() * .35, .08 + rng() * .3, .1 + rng() * .45], [(rng() - .5) * 65, (rng() - .5) * 35, -20 - rng() * 65], 0x53636a, { castShadow: false }); d.rotation.set(rng() * 3, rng() * 3, rng() * 3); }
  const zhang = cast.zhangSpace(); zhang.root.rotation.y = Math.PI; root.add(zhang.root);
  const backpack = makeBackpack(); backpack.position.set(0, 0, -.8); zhang.anchors.back.add(backpack);
  const pistol = makePistol(); pistol.position.z = .45; zhang.anchors.handR.add(pistol); pistol.visible = false;
  const scope = makeScope(); scope.position.z = .5; zhang.anchors.handL.add(scope);
  const mountedScope = makeScope(); mountedScope.position.set(0, 1.25, .2); pistol.add(mountedScope); mountedScope.visible = false;
  const floatingScope = makeScope(); floatingScope.position.set(-.35, 1.45, -.55); root.add(floatingScope); floatingScope.visible = false;
  const flash = makeMuzzleFlash(); flash.position.set(0, .35, 2.65); pistol.add(flash);
  const flashLight = new THREE.PointLight(0xffc276, 0, 4, 2); flashLight.position.set(0, 1.5, -.5); root.add(flashLight);
  const thruster = makeThrusterPlume(); thruster.position.z = -1.2; zhang.anchors.back.add(thruster); thruster.visible = false;
  const attendees = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 8; col++) {
    const i = row * 8 + col; const target = row === 0 && col >= 2 && col <= 4 ? col - 2 : -1;
    const figure = cast.attendee(i, target); root.add(figure.root);
    const pack = makeBackpack(); pack.position.z = -.8; figure.anchors.back.add(pack);
    const plume = makeThrusterPlume(); plume.position.z = -1.1; figure.anchors.back.add(plume); plume.visible = false;
    const form = new THREE.Vector3(8 + (col - 3.5) * 1.04, -1 + row * 1.58 + (i % 2) * .07, -20 - row * .38);
    const start = new THREE.Vector3(12 + (i % 3 - 1) * .12, 1.45 + (i % 4) * .08, -31.6);
    const hit = target >= 0 || (row === 0 && col === 1) || (row === 1 && col === 5);
    figure.root.visible = false; attendees.push({ figure, plume, form, start, target, hit, index: i, row, col });
  }
  const puffs = attendees.filter(a => a.hit).map((a, puffIndex) => {
    const count = 64; const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: puffIndex === 1 ? 0xe1ddd2 : 0xe1f0ec, size: .11, transparent: true, opacity: 0, depthWrite: false })); root.add(points);
    const random = seeded(900 + puffIndex); const directions = Array.from({ length: count }, () => new THREE.Vector3((random() - .5) * 2, (random() - .5) * 2, (random() - .5) * 2).normalize().multiplyScalar(.3 + random() * 1.3));
    return { points, directions, attendee: a };
  });
  const bullets = new THREE.Group(); root.add(bullets); bullets.visible = false;
  const bulletMeshes = Array.from({ length: 30 }, (_, i) => { const b = makeCylinder(0x62685d, 2, 7, .014); b.rotation.x = Math.PI / 2; b.scale.setScalar(3.2); bullets.add(b); return b; });
  return { root, stars, earth, atmosphere, sun, station, hub, hatch, signal, signalMaterial, drydock, base, debris, zhang, pistol, scope, mountedScope, floatingScope, flash, flashLight, thruster, attendees, puffs, bullets, bulletMeshes, sunlight };
}

export function createWorlds(scene) {
  const cast = createCast();
  const home = makeHome(cast); const workshop = makeWorkshop(cast); const basement = makeBasement(cast); const space = makeSpace(cast);
  const worlds = { home, workshop, basement, space };
  for (const world of Object.values(worlds)) { world.root.visible = false; scene.add(world.root); }
  return { cast, ...worlds, roots: Object.values(worlds).map(world => world.root) };
}

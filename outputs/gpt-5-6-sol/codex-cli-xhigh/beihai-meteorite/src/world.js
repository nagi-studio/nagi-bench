import * as THREE from "three";

const materialCache = new Map();
const Y_AXIS = new THREE.Vector3(0, 1, 0);

function seeded(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function material(color, options = {}) {
  const key = `${color}|${options.metalness ?? 0}|${options.roughness ?? 0.78}|${options.emissive ?? 0}|${options.transparent ?? false}|${options.opacity ?? 1}`;
  if (!options.unique && materialCache.has(key)) return materialCache.get(key);
  const result = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.78,
    metalness: options.metalness ?? 0,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    depthWrite: options.depthWrite ?? true,
    side: options.side ?? THREE.FrontSide,
  });
  if (!options.unique) materialCache.set(key, result);
  return result;
}

function box(parent, size, color, position = [0, 0, 0], options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    options.material ?? material(color, options),
  );
  mesh.position.set(...position);
  mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, radius, length, color, position = [0, 0, 0], options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * (options.taper ?? 1), length, options.segments ?? 8),
    options.material ?? material(color, options),
  );
  mesh.position.set(...position);
  mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

function addLighting(root, ambient, key, keyPos, intensity = 3) {
  const hemi = new THREE.HemisphereLight(ambient, 0x07090d, 0.8);
  root.add(hemi);
  const light = new THREE.DirectionalLight(key, intensity);
  light.position.set(...keyPos);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -20;
  light.shadow.camera.right = 20;
  light.shadow.camera.top = 20;
  light.shadow.camera.bottom = -20;
  root.add(light);
  return light;
}

function meteorite(parent, scale = 1, position = [0, 0, 0], seed = 2, color = 0x272522) {
  const root = new THREE.Group();
  root.position.set(...position);
  root.scale.setScalar(scale);
  parent.add(root);
  const random = seeded(seed);
  const core = box(root, [1.25, 1.05, 1.15], color, [0, 0, 0], { metalness: 0.54, roughness: 0.64 });
  core.rotation.set(0.2, 0.3, -0.12);
  for (let i = 0; i < 13; i += 1) {
    const a = random() * Math.PI * 2;
    const y = (random() - 0.5) * 1.15;
    const r = 0.54 + random() * 0.22;
    const pebble = box(
      root,
      [0.25 + random() * 0.35, 0.22 + random() * 0.35, 0.22 + random() * 0.38],
      i % 4 === 0 ? 0x3a3732 : color,
      [Math.cos(a) * r, y, Math.sin(a) * r],
      { metalness: 0.52, roughness: 0.67 },
    );
    pebble.rotation.set(random(), random(), random());
  }
  return root;
}

function makeEyes(head, astronaut = false) {
  const z = astronaut ? 0.465 : 0.515;
  box(head, [0.15, 0.11, 0.035], 0x171b1d, [-0.22, 0.07, z], { castShadow: false });
  box(head, [0.15, 0.11, 0.035], 0x171b1d, [0.22, 0.07, z], { castShadow: false });
}

function figure(parent, palette = {}, astronaut = false) {
  const colors = {
    skin: palette.skin ?? 0xb88b6b,
    cloth: palette.cloth ?? 0x263d4a,
    cloth2: palette.cloth2 ?? 0x1b2c35,
    hair: palette.hair ?? 0x161719,
    boot: palette.boot ?? 0x101317,
  };
  const root = new THREE.Group();
  parent.add(root);
  const hips = new THREE.Group();
  root.add(hips);
  const torso = box(hips, [1.45, 1.65, 0.78], astronaut ? 0xe4e7e2 : colors.cloth, [0, 2.45, 0]);
  if (astronaut) {
    box(hips, [1.6, 0.3, 0.9], 0xb9c0bc, [0, 1.72, 0]);
    box(hips, [1.1, 1.35, 0.42], 0xaeb7b5, [0, 2.45, -0.62]);
    box(hips, [0.18, 0.18, 0.12], palette.accent ?? 0xd15d49, [0.42, 2.45, 0.46], { emissive: palette.accent ?? 0xd15d49, emissiveIntensity: 0.35 });
  }
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 3.63, 0);
  hips.add(headPivot);
  const head = box(headPivot, astronaut ? [0.88, 0.88, 0.78] : [0.92, 0.92, 0.92], colors.skin, [0, 0, 0]);
  makeEyes(headPivot, astronaut);
  if (!astronaut) {
    box(headPivot, [0.96, 0.23, 0.96], colors.hair, [0, 0.44, -0.01]);
  } else {
    const visorMat = material(0xa9d4d6, { unique: true, transparent: true, opacity: 0.28, metalness: 0.2, roughness: 0.15, depthWrite: false });
    box(headPivot, [1.23, 0.12, 1.05], 0xf1f2ed, [0, 0.57, 0]);
    box(headPivot, [1.23, 0.12, 1.05], 0xdde2df, [0, -0.57, 0]);
    box(headPivot, [0.12, 1.02, 1.05], 0xe5e8e4, [-0.555, 0, 0]);
    box(headPivot, [0.12, 1.02, 1.05], 0xe5e8e4, [0.555, 0, 0]);
    box(headPivot, [1.02, 0.98, 0.045], 0x84bac0, [0, 0, 0.55], { material: visorMat, castShadow: false });
  }
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-0.91, 3.0, 0);
  rightArm.position.set(0.91, 3.0, 0);
  hips.add(leftArm, rightArm);
  box(leftArm, [0.48, 1.6, 0.52], astronaut ? 0xdce1de : colors.cloth2, [0, -0.74, 0]);
  box(rightArm, [0.48, 1.6, 0.52], astronaut ? 0xdce1de : colors.cloth2, [0, -0.74, 0]);
  box(leftArm, [0.52, 0.45, 0.56], astronaut ? 0xbac1be : colors.skin, [0, -1.63, 0]);
  box(rightArm, [0.52, 0.45, 0.56], astronaut ? 0xbac1be : colors.skin, [0, -1.63, 0]);
  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  leftLeg.position.set(-0.4, 1.62, 0);
  rightLeg.position.set(0.4, 1.62, 0);
  hips.add(leftLeg, rightLeg);
  box(leftLeg, [0.58, 1.65, 0.64], astronaut ? 0xcfd5d2 : colors.cloth2, [0, -0.77, 0]);
  box(rightLeg, [0.58, 1.65, 0.64], astronaut ? 0xcfd5d2 : colors.cloth2, [0, -0.77, 0]);
  box(leftLeg, [0.62, 0.35, 0.86], astronaut ? 0xaeb6b3 : colors.boot, [0, -1.68, 0.11]);
  box(rightLeg, [0.62, 0.35, 0.86], astronaut ? 0xaeb6b3 : colors.boot, [0, -1.68, 0.11]);
  return { root, hips, torso, headPivot, head, leftArm, rightArm, leftLeg, rightLeg };
}

function setPose(rig, pose = {}) {
  rig.hips.rotation.set(...(pose.hips ?? [0, 0, 0]));
  rig.headPivot.rotation.set(...(pose.head ?? [0, 0, 0]));
  rig.leftArm.rotation.set(...(pose.leftArm ?? [0, 0, 0]));
  rig.rightArm.rotation.set(...(pose.rightArm ?? [0, 0, 0]));
  rig.leftLeg.rotation.set(...(pose.leftLeg ?? [0, 0, 0]));
  rig.rightLeg.rotation.set(...(pose.rightLeg ?? [0, 0, 0]));
}

function tileFloor(parent, width, depth, colorA, colorB, y = 0) {
  for (let x = -width / 2; x < width / 2; x += 1) {
    for (let z = -depth / 2; z < depth / 2; z += 1) {
      box(parent, [0.96, 0.12, 0.96], (Math.floor(x + width / 2) + Math.floor(z + depth / 2)) % 2 ? colorA : colorB, [x + 0.5, y, z + 0.5], { receiveShadow: true, castShadow: false });
    }
  }
}

function makeStars(parent, count = 420, radius = 260, seed = 9) {
  const random = seeded(seed);
  const geometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const mat = new THREE.MeshBasicMaterial({ color: 0xdce7ee });
  const stars = new THREE.InstancedMesh(geometry, mat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const r = radius * (0.55 + random() * 0.45);
    dummy.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    const s = 0.35 + random() * 1.5;
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    stars.setMatrixAt(i, dummy.matrix);
  }
  stars.frustumCulled = false;
  parent.add(stars);
  return stars;
}

function makeEarth(parent, radius, position, seed = 77) {
  const root = new THREE.Group();
  root.position.set(...position);
  parent.add(root);
  const ocean = new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius, 5),
    new THREE.MeshStandardMaterial({ color: 0x184c78, roughness: 0.72, metalness: 0.04, emissive: 0x061524, emissiveIntensity: 0.25 }),
  );
  ocean.receiveShadow = true;
  root.add(ocean);
  const atmosphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius * 1.025, 4),
    new THREE.MeshBasicMaterial({ color: 0x75cbea, transparent: true, opacity: 0.14, side: THREE.BackSide, depthWrite: false }),
  );
  root.add(atmosphere);
  const random = seeded(seed);
  for (let i = 0; i < 160; i += 1) {
    const lon = random() * Math.PI * 2;
    const lat = Math.asin(random() * 2 - 1);
    const landSignal = Math.sin(lon * 2.1 + Math.cos(lat * 5)) + Math.sin(lat * 6 - lon) * 0.65;
    if (landSignal < 0.5) continue;
    const normal = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
    const patch = box(root, [radius * (0.07 + random() * 0.07), radius * 0.026, radius * (0.05 + random() * 0.07)], i % 5 === 0 ? 0xb49d55 : 0x3c704d, normal.clone().multiplyScalar(radius * 1.012).toArray(), { castShadow: false });
    patch.quaternion.setFromUnitVectors(Y_AXIS, normal);
    patch.rotation.z += random() * Math.PI;
  }
  for (let i = 0; i < 54; i += 1) {
    const lon = random() * Math.PI * 2;
    const lat = Math.asin(random() * 2 - 1);
    const normal = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
    const cloud = box(root, [radius * (0.05 + random() * 0.1), radius * 0.012, radius * 0.025], 0xdbe7e9, normal.clone().multiplyScalar(radius * 1.04).toArray(), { transparent: true, opacity: 0.66, depthWrite: false, castShadow: false });
    cloud.quaternion.setFromUnitVectors(Y_AXIS, normal);
    cloud.rotation.z += random() * Math.PI;
  }
  return root;
}

function makeStation(parent, radius = 14, position = [0, 0, 0], detailed = true) {
  const root = new THREE.Group();
  root.position.set(...position);
  parent.add(root);
  const segments = 48;
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const ringBlock = box(root, [1.95, 1.25, 2.25], i % 6 === 0 ? 0xcac5b8 : 0x8f9899, [Math.cos(a) * radius, Math.sin(a) * radius, 0], { metalness: 0.65, roughness: 0.38 });
    ringBlock.rotation.z = a;
    if (i % 3 === 0) box(ringBlock, [0.72, 0.45, 0.08], 0x82b9cf, [0, 0, 1.16], { emissive: 0x3d778a, emissiveIntensity: 0.45, castShadow: false });
  }
  box(root, [6.4, 4.2, 6.0], 0xaeb2ad, [0, 0, 0], { metalness: 0.56 });
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const spoke = box(root, [radius - 4, 0.42, 0.45], 0x747e7f, [Math.cos(a) * (radius / 2 + 1.5), Math.sin(a) * (radius / 2 + 1.5), 0], { metalness: 0.7 });
    spoke.rotation.z = a;
  }
  if (detailed) {
    box(root, [7.5, 0.55, 2.8], 0x293a4d, [-8, 0, -3.8], { metalness: 0.5 });
    box(root, [7.5, 0.55, 2.8], 0x293a4d, [8, 0, -3.8], { metalness: 0.5 });
    box(root, [2.2, 2.2, 0.7], 0xbebbb2, [0, -14, 1.2], { metalness: 0.4 });
    const hatch = cylinder(root, 0.78, 0.24, 0x425958, [0, -14, 1.58], { rotation: [Math.PI / 2, 0, 0], metalness: 0.7, segments: 16 });
    root.userData.hatch = hatch;
  }
  return root;
}

function buildPrologue() {
  const root = new THREE.Group();
  makeStars(root, 260, 110, 12);
  const stone = meteorite(root, 3.2, [0, 0, 0], 73, 0x252722);
  const rim = new THREE.PointLight(0xd8e0cf, 14, 38, 1.5);
  rim.position.set(7, 4, 9);
  root.add(rim);
  const amber = new THREE.PointLight(0xb86e35, 8, 30, 1.7);
  amber.position.set(-8, -3, -4);
  root.add(amber);
  return { root, stone, stars: root.children[0] };
}

function buildAlley() {
  const root = new THREE.Group();
  addLighting(root, 0x62707d, 0xe5b56e, [5, 9, 5], 2.3);
  tileFloor(root, 12, 22, 0x3c3f3d, 0x343735);
  for (let z = -10; z <= 10; z += 1.4) {
    box(root, [0.65, 1.12, 1.32], z % 2 ? 0x52514b : 0x484944, [-6.2, 1.0, z]);
    box(root, [0.65, 1.12, 1.32], z % 2 ? 0x52514b : 0x484944, [6.2, 1.0, z]);
    box(root, [0.65, 1.12, 1.32], 0x4b4b46, [-6.2, 2.16, z]);
    box(root, [0.65, 1.12, 1.32], 0x4b4b46, [6.2, 2.16, z]);
  }
  box(root, [8.5, 5.4, 0.75], 0x55534d, [0, 2.7, -11]);
  box(root, [2.8, 4.5, 0.25], 0x783c30, [0, 2.25, -10.58]);
  for (let y = 0.65; y < 4.1; y += 0.75) box(root, [2.5, 0.1, 0.16], 0x9b4b3b, [0, y, -10.38]);
  const lantern = box(root, [0.55, 0.75, 0.55], 0x9d3d2b, [2.35, 4.15, -10.1], { emissive: 0x8b2719, emissiveIntensity: 1.2 });
  const glow = new THREE.PointLight(0xe66f3a, 6, 10, 2);
  glow.position.copy(lantern.position);
  root.add(glow);
  const zhang = figure(root, { cloth: 0x1f3948, cloth2: 0x172a35, hair: 0x111417 });
  zhang.root.position.set(0, 0.2, 7);
  return { root, zhang, lantern };
}

function buildCollectorRoom() {
  const root = new THREE.Group();
  addLighting(root, 0x544535, 0xf0bd75, [2, 8, 3], 3.0);
  tileFloor(root, 16, 15, 0x3a2c24, 0x403027);
  box(root, [16, 7, 0.45], 0x4f4034, [0, 3.5, -7.3]);
  box(root, [0.45, 7, 15], 0x463a31, [-8, 3.5, 0]);
  box(root, [0.45, 7, 15], 0x463a31, [8, 3.5, 0]);
  const stones = [];
  for (let side = -1; side <= 1; side += 2) {
    for (let bay = 0; bay < 3; bay += 1) {
      const x = side * 6.25;
      const z = -4.9 + bay * 4.6;
      box(root, [2.6, 5.4, 1.15], 0x231c19, [x, 2.72, z]);
      for (let shelf = 0; shelf < 3; shelf += 1) {
        box(root, [2.35, 0.12, 1.0], 0x756350, [x, 1.0 + shelf * 1.55, z]);
        const item = meteorite(root, 0.34 + shelf * 0.035, [x, 1.35 + shelf * 1.55, z], bay * 20 + shelf + (side > 0 ? 40 : 1));
        stones.push(item);
        const spot = new THREE.PointLight(0xe8c68d, 1.2, 3.5, 2);
        spot.position.set(x, 2.3 + shelf * 1.55, z + 0.4);
        root.add(spot);
      }
      const glassMat = material(0xa5c0bd, { unique: true, transparent: true, opacity: 0.11, roughness: 0.1, depthWrite: false });
      box(root, [2.42, 5.0, 0.04], 0x8aa8a4, [x, 2.8, z + 0.59], { material: glassMat, castShadow: false });
    }
  }
  const table = box(root, [5.6, 0.42, 3.2], 0x5a3e2c, [0, 2.1, -0.7]);
  for (const x of [-2.2, 2.2]) for (const z of [-1.1, 1.1]) box(root, [0.32, 2.1, 0.32], 0x3b2920, [x, 1.05, -0.7 + z]);
  const lamp = box(root, [1.5, 0.18, 1.0], 0xc59e5c, [-1.5, 5.6, -0.8], { emissive: 0xb57f38, emissiveIntensity: 0.7 });
  const lampLight = new THREE.PointLight(0xffc979, 8, 9, 2);
  lampLight.position.copy(lamp.position);
  root.add(lampLight);
  const collector = figure(root, { cloth: 0x59604b, cloth2: 0x414936, hair: 0x9c9b90, skin: 0xc29473 });
  collector.root.position.set(-2.1, 0.2, 1.2);
  collector.root.rotation.y = -0.35;
  const zhang = figure(root, { cloth: 0x203946, cloth2: 0x172b35, hair: 0x121519 });
  zhang.root.position.set(2.35, 0.2, 2.1);
  zhang.root.rotation.y = 2.68;
  const cupA = cylinder(root, 0.34, 0.58, 0xc8c1aa, [-1.1, 2.62, 0.25], { segments: 8 });
  const cupB = cylinder(root, 0.34, 0.58, 0xc8c1aa, [1.2, 2.62, 0.1], { segments: 8 });
  const treasure = meteorite(root, 0.25, [-0.2, 2.55, -0.8], 199, 0x363a38);
  const three = [
    meteorite(root, 0.72, [-1.2, 2.78, -0.15], 301),
    meteorite(root, 0.74, [0, 2.78, -0.15], 302),
    meteorite(root, 0.71, [1.2, 2.78, -0.15], 303),
  ];
  three.forEach((item) => { item.visible = false; });
  return { root, collector, zhang, table, cupA, cupB, treasure, three, stones };
}

function buildWorkshop() {
  const root = new THREE.Group();
  addLighting(root, 0x1c3540, 0xaed7df, [-5, 9, 5], 3.2);
  tileFloor(root, 18, 16, 0x243038, 0x202930);
  box(root, [18, 8, 0.5], 0x2d3b42, [0, 4, -8]);
  const lathe = new THREE.Group();
  lathe.position.set(0, 1.6, -1);
  root.add(lathe);
  box(lathe, [10, 2.1, 3.4], 0x43535a, [0, 0, 0], { metalness: 0.55 });
  box(lathe, [9.3, 0.42, 1.1], 0xa6b1ae, [0, 1.22, 0], { metalness: 0.8, roughness: 0.28 });
  const chuck = cylinder(lathe, 1.02, 1.12, 0x676e6e, [-3.55, 1.15, 0], { rotation: [0, 0, Math.PI / 2], metalness: 0.9 });
  const stock = cylinder(lathe, 0.68, 4.6, 0x353632, [-0.85, 1.15, 0], { rotation: [0, 0, Math.PI / 2], metalness: 0.72 });
  const cutter = box(lathe, [0.52, 1.15, 0.55], 0xd3c3a1, [0.6, 2.0, 0], { metalness: 0.88, roughness: 0.22 });
  const screen = box(lathe, [1.8, 1.35, 0.22], 0x163843, [3.65, 1.6, 1.8], { emissive: 0x1c6873, emissiveIntensity: 0.8 });
  const zhang = figure(root, { cloth: 0x203946, cloth2: 0x172b35 });
  zhang.root.position.set(4.8, 0.15, 2.3);
  zhang.root.rotation.y = -2.25;
  const rods = [];
  for (let i = 0; i < 12; i += 1) {
    const rod = cylinder(root, 0.12, 1.1, 0x3d3d39, [-2.8 + (i % 6) * 0.55, 3.15 + Math.floor(i / 6) * 0.36, 2.6], { rotation: [0, 0, Math.PI / 2], metalness: 0.72 });
    rod.visible = false;
    rods.push(rod);
  }
  const pellets = [];
  for (let i = 0; i < 36; i += 1) {
    const pellet = cylinder(root, 0.09, 0.34, 0x3f403c, [-3.0 + (i % 9) * 0.5, 2.15 + Math.floor(i / 9) * 0.33, 3.0], { rotation: [Math.PI / 2, 0, 0], metalness: 0.78 });
    pellet.visible = false;
    pellets.push(pellet);
  }
  const chips = [];
  const random = seeded(802);
  for (let i = 0; i < 60; i += 1) {
    const chip = box(root, [0.035, 0.035, 0.1], 0xb99b65, [0, 0, 0], { metalness: 0.9, roughness: 0.2, castShadow: false });
    chip.userData.seed = [random(), random(), random()];
    chips.push(chip);
  }
  return { root, lathe, chuck, stock, cutter, screen, zhang, rods, pellets, chips };
}

function makeGun(parent) {
  const root = new THREE.Group();
  parent.add(root);
  box(root, [1.25, 0.42, 0.46], 0x24292b, [0, 0, 0], { metalness: 0.84, roughness: 0.28 });
  box(root, [0.48, 1.0, 0.38], 0x171b1d, [0.35, -0.65, 0], { rotation: [0, 0, -0.18], metalness: 0.55 });
  cylinder(root, 0.12, 1.15, 0x181d1f, [-1.05, 0.03, 0], { rotation: [0, 0, Math.PI / 2], metalness: 0.86 });
  return root;
}

function buildBasement() {
  const root = new THREE.Group();
  addLighting(root, 0x2b3031, 0xd7c08a, [0, 7, 2], 2.4);
  tileFloor(root, 14, 18, 0x2a2c2c, 0x242626);
  box(root, [14, 7, 0.5], 0x343636, [0, 3.5, -9]);
  box(root, [0.5, 7, 18], 0x303232, [-7, 3.5, 0]);
  box(root, [0.5, 7, 18], 0x303232, [7, 3.5, 0]);
  const pipe = cylinder(root, 0.19, 14, 0x676967, [-5.7, 5.7, -1], { rotation: [Math.PI / 2, 0, 0], metalness: 0.7 });
  const bulb = box(root, [0.4, 0.22, 0.4], 0xe3d9b9, [0, 6.1, 0], { emissive: 0xffd88c, emissiveIntensity: 2 });
  const bulbLight = new THREE.PointLight(0xffce83, 8, 15, 2);
  bulbLight.position.copy(bulb.position);
  root.add(bulbLight);
  box(root, [7, 0.36, 3.5], 0x49372e, [0, 2.05, 1.2]);
  for (const x of [-2.7, 2.7]) for (const z of [-0.1, 2.3]) box(root, [0.34, 2.0, 0.34], 0x382923, [x, 1, z]);
  const zhang = figure(root, { cloth: 0x1f3845, cloth2: 0x152832 });
  zhang.root.position.set(3.8, 0.15, 4.4);
  zhang.root.rotation.y = -2.55;
  const bullets = [];
  for (let i = 0; i < 36; i += 1) {
    const holder = new THREE.Group();
    holder.position.set(-2.7 + (i % 12) * 0.46, 2.43, 0.15 + Math.floor(i / 12) * 0.48);
    root.add(holder);
    cylinder(holder, 0.095, 0.38, 0x8b6c3d, [0, 0, 0], { metalness: 0.8, segments: 8 });
    cylinder(holder, 0.073, 0.28, 0x393b37, [0, 0.28, 0], { metalness: 0.72, segments: 8 });
    bullets.push(holder);
  }
  const gun = makeGun(root);
  gun.position.set(0, 2.65, 2.3);
  gun.rotation.y = -Math.PI / 2;
  const bag = box(root, [4.8, 4.0, 1.0], 0x807565, [0, 2.15, -8.2], { roughness: 1 });
  const suitLayers = [
    box(root, [4.3, 3.45, 0.12], 0xc9c6b8, [0, 2.15, -7.63], { roughness: 0.92 }),
    box(root, [3.8, 3.0, 0.11], 0xb2b5ae, [0, 2.15, -7.53], { roughness: 0.92 }),
  ];
  const holes = [];
  for (let i = 0; i < 5; i += 1) {
    const hole = box(root, [0.18, 0.18, 0.035], 0x111313, [-0.7 + (i % 3) * 0.65, 2.3 + Math.floor(i / 3) * 0.55, -7.45], { castShadow: false });
    hole.visible = false;
    holes.push(hole);
  }
  const fragments = [];
  const random = seeded(909);
  for (let i = 0; i < 22; i += 1) {
    const frag = box(root, [0.05 + random() * 0.1, 0.05 + random() * 0.08, 0.05 + random() * 0.08], 0x3a3a36, [0, 0, 0], { metalness: 0.35 });
    frag.visible = false;
    frag.userData.seed = [random(), random(), random()];
    fragments.push(frag);
  }
  const flash = new THREE.PointLight(0xffb14a, 0, 12, 2);
  flash.position.set(-1.2, 3.0, -0.5);
  root.add(flash);
  return { root, zhang, bullets, gun, bag, suitLayers, holes, fragments, flash, pipe };
}

function buildSpaceEstablish() {
  const root = new THREE.Group();
  makeStars(root, 520, 430, 1002);
  const earth = makeEarth(root, 72, [78, -63, -180], 42);
  const station = makeStation(root, 18, [-16, 10, -86], true);
  station.rotation.set(0.45, 0.25, -0.25);
  box(root, [0.18, 280, 0.18], 0xb9d3d2, [76, -130, -183], { emissive: 0x5b8c90, emissiveIntensity: 0.35, castShadow: false });
  const dock = new THREE.Group();
  dock.position.set(58, 18, -125);
  dock.rotation.set(0.15, -0.2, -0.1);
  root.add(dock);
  for (let x = -20; x <= 20; x += 5) {
    box(dock, [0.4, 16, 0.4], 0x657374, [x, 0, 0], { metalness: 0.7 });
    box(dock, [0.4, 16, 0.4], 0x657374, [x, 0, -14], { metalness: 0.7 });
    box(dock, [0.4, 0.4, 14], 0x657374, [x, 7.8, -7], { metalness: 0.7 });
    box(dock, [0.4, 0.4, 14], 0x657374, [x, -7.8, -7], { metalness: 0.7 });
  }
  const sunlight = new THREE.DirectionalLight(0xffd6a2, 4.5);
  sunlight.position.set(-80, 30, 50);
  root.add(sunlight);
  root.add(new THREE.HemisphereLight(0x34536d, 0x020306, 0.35));
  return { root, earth, station, dock };
}

function buildSpaceAction() {
  const root = new THREE.Group();
  const stars = makeStars(root, 640, 520, 707);
  const earth = makeEarth(root, 86, [110, -76, -250], 98);
  const station = makeStation(root, 23, [0, 4, -175], true);
  station.rotation.set(0.05, 0.12, -0.12);
  const base = makeStation(root, 4.5, [-80, 19, -212], false);
  base.scale.setScalar(0.7);
  const sun = new THREE.DirectionalLight(0xffd09a, 5.2);
  sun.position.set(-95, 12, 35);
  root.add(sun);
  root.add(new THREE.HemisphereLight(0x31485b, 0x000102, 0.22));
  const shooter = figure(root, { skin: 0xa98164, accent: 0x3c7383 }, true);
  shooter.root.position.set(0, 0, 0);
  shooter.root.rotation.y = Math.PI;
  shooter.root.scale.setScalar(1.12);
  const shooterGun = makeGun(shooter.root);
  shooterGun.position.set(0.15, 3.05, -1.1);
  shooterGun.rotation.y = Math.PI / 2;
  shooterGun.visible = false;
  const sight = cylinder(shooterGun, 0.16, 0.85, 0x202628, [-0.25, 0.4, 0], { rotation: [0, 0, Math.PI / 2], metalness: 0.82 });
  const targetRoot = new THREE.Group();
  targetRoot.position.set(0, 0, -153);
  root.add(targetRoot);
  const attendees = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const isTarget = row === 0 && [3, 4, 5].includes(col);
      const rig = figure(targetRoot, { skin: 0x9d725c + (col % 3) * 0x090604, accent: isTarget ? 0xc54d3d : 0x39788c }, true);
      rig.root.scale.setScalar(0.82);
      rig.root.position.set((col - 4.5) * 2.15, (1 - row) * 4.25, row * 1.4);
      rig.root.rotation.y = Math.PI;
      rig.root.userData.base = rig.root.position.clone();
      rig.root.userData.row = row;
      rig.root.userData.col = col;
      rig.root.userData.target = isTarget;
      attendees.push(rig);
    }
  }
  const targets = attendees.filter((rig) => rig.root.userData.target);
  const collateral = [attendees[14], attendees[16]];
  const impacted = [...targets, ...collateral];
  const leaks = [];
  const random = seeded(1440);
  impacted.forEach((rig, rigIndex) => {
    const leak = new THREE.Group();
    leak.position.copy(rig.root.position).add(new THREE.Vector3(rigIndex % 2 ? 0.4 : -0.25, 2.45, 0));
    targetRoot.add(leak);
    for (let i = 0; i < 24; i += 1) {
      const ice = box(leak, [0.055 + random() * 0.09, 0.055 + random() * 0.09, 0.055 + random() * 0.09], i % 7 === 0 ? 0xb24b48 : 0xe5f1ee, [0, 0, 0], { emissive: i % 7 === 0 ? 0x4a0808 : 0x7b9c9c, emissiveIntensity: 0.15, castShadow: false });
      ice.userData.seed = [random(), random(), random()];
      ice.visible = false;
    }
    leaks.push(leak);
  });
  const bullets = [];
  for (let i = 0; i < 30; i += 1) {
    const bullet = cylinder(root, 0.025, 0.34, 0x6b6657, [0, 0, 0], { rotation: [Math.PI / 2, 0, 0], metalness: 0.82, castShadow: false });
    bullet.visible = false;
    bullet.userData.index = i;
    bullets.push(bullet);
  }
  const muzzle = box(root, [0.17, 0.17, 0.9], 0xffd078, [0, 3.0, -1.9], { emissive: 0xff8b32, emissiveIntensity: 5, castShadow: false });
  muzzle.visible = false;
  const hatchGlow = new THREE.PointLight(0x79d7bd, 7, 22, 2);
  hatchGlow.position.set(0, -19, -166);
  root.add(hatchGlow);
  return { root, stars, earth, station, base, shooter, shooterGun, sight, targetRoot, attendees, targets, impacted, leaks, bullets, muzzle, hatchGlow };
}

export function createWorld(scene) {
  const world = {
    prologue: buildPrologue(),
    alley: buildAlley(),
    collector: buildCollectorRoom(),
    workshop: buildWorkshop(),
    basement: buildBasement(),
    establish: buildSpaceEstablish(),
    space: buildSpaceAction(),
  };
  Object.values(world).forEach(({ root }) => {
    root.visible = false;
    scene.add(root);
  });
  return world;
}

export function showOnly(world, key) {
  Object.entries(world).forEach(([name, value]) => { value.root.visible = name === key; });
}

export function setCamera(camera, position, target, fov = 42, roll = 0) {
  camera.position.set(...position);
  camera.fov = fov;
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...target);
  camera.updateProjectionMatrix();
}

export function lerp3(a, b, t) {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  ];
}

export function ease(t) {
  const value = THREE.MathUtils.clamp(t, 0, 1);
  return value * value * (3 - 2 * value);
}

export { setPose };

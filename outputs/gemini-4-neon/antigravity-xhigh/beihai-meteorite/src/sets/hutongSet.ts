import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelModel } from "@agentbench/voxel-kit";
import { createMeteoriteMesh, createTeacupMesh, createTeapotMesh } from "../props/voxelProps";

export interface HutongSet {
  root: THREE.Group;
  doorPivot: THREE.Group;
  pendulumPivot: THREE.Group;
  benchMeteorites: THREE.Mesh[];
  teapot: THREE.Mesh;
  benchCupZhang: THREE.Mesh;
  benchCupCollector: THREE.Mesh;
  update(time: number, doorOpen: number, meteoritesShown: number, teaSteaming: boolean): void;
}

function createVoxelCabinet(seed: number): THREE.Group {
  const group = new THREE.Group();
  const woodMat = voxelMaterial({ roughness: 0.85 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xdbeeff,
    transparent: true,
    opacity: 0.16,
    roughness: 0.12,
    metalness: 0.2,
  });

  // Wooden base & frame built as voxel slab
  const frameGeo = buildVoxelGeometry(
    {
      size: [14, 22, 6],
      at(x, y, z) {
        // Lower solid wood cabinet base
        if (y < 7) {
          return (x === 0 || x === 13 || y === 6) ? 0x3b2417 : 0x4f3220;
        }
        // Top cornice
        if (y >= 20) return 0x3b2417;
        // Back wall lined in deep museum burgundy-charcoal velvet
        if (z === 0) return (x + y) % 3 === 0 ? 0x2c1b1d : 0x362124;
        // Corner pillars
        if ((x === 0 || x === 13) && (z === 0 || z === 5)) return 0x3b2417;
        // Shelf at y = 13
        if (y === 13 && z > 0 && z < 5) return 0x4a2f1e;
        return null;
      },
    },
    { voxel: 0.1, anchor: "min" },
  );
  const frameMesh = new THREE.Mesh(frameGeo, woodMat);
  frameMesh.position.set(-0.7, 0, -0.3);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  group.add(frameMesh);

  // Subtle translucent glass front pane
  const pane = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.28, 0.02), glassMat);
  pane.position.set(0, 1.35, 0.26);
  group.add(pane);

  // Warm museum strip light inside cabinet top
  const lightBar = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.04, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xffd594 }),
  );
  lightBar.position.set(0, 1.96, 0.05);
  group.add(lightBar);

  // Display meteorites on velvet stands inside cabinet
  const shelfYs = [0.76, 1.46];
  shelfYs.forEach((sy, sIdx) => {
    for (let i = 0; i < 3; i++) {
      const m = createMeteoriteMesh(0.022 + ((i + seed) % 2) * 0.005, seed * 7 + sIdx * 5 + i);
      m.position.set(-0.4 + i * 0.4, sy + 0.06, 0.0);
      group.add(m);
    }
  });

  return group;
}

export function createHutongSet(): HutongSet {
  const root = new THREE.Group();
  root.name = "set:hutong";
  root.visible = false;

  const mat = voxelMaterial({ roughness: 0.9, metalness: 0.04 });

  // 1. Voxel wooden floor & gray courtyard brick walls + timber ceiling beams
  const floorGeo = buildVoxelGeometry(
    {
      size: [34, 1, 32],
      at(x, _y, z) {
        const plank = (x % 4 === 0 || z % 8 === 0) ? 0x3b271a : 0x4c3424;
        return (x + z) % 5 === 0 ? 0x432d1f : plank;
      },
    },
    { voxel: 0.25 },
  );
  const floor = new THREE.Mesh(floorGeo, mat);
  floor.position.set(0, -0.125, 0);
  floor.receiveShadow = true;
  root.add(floor);

  // Back wall (z = -3.8) with doorway opening on the right (x in [1.4, 2.8])
  const backWallGeo = buildVoxelGeometry(
    {
      size: [34, 16, 2],
      at(x, y, _z) {
        // Door cutout: x from 22..27, y from 0..9
        if (x >= 22 && x <= 27 && y < 10) return null;
        if (y === 14 || y === 15) return 0x352116; // timber roof beam
        if (x === 0 || x === 33 || x === 21 || x === 28) return 0x3b2417; // wood columns
        return (x + y * 2) % 3 === 0 ? 0x575654 : 0x646360; // old gray courtyard brick
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const backWall = new THREE.Mesh(backWallGeo, mat);
  backWall.position.set(-4.25, 0, -4.0);
  backWall.receiveShadow = true;
  root.add(backWall);

  // Left wall (x = -4.0) with traditional Beijing lattice window pouring golden sunset light!
  const leftWallGeo = buildVoxelGeometry(
    {
      size: [2, 16, 32],
      at(_x, y, z) {
        // Window opening z in [10..22], y in [4..12]
        if (z >= 10 && z <= 22 && y >= 4 && y <= 12) {
          // Traditional Chinese lattice wooden mullions
          if (y === 4 || y === 12 || z === 10 || z === 22) return 0x3d2417;
          if (y === 8 || z === 14 || z === 18) return 0x4d2e1e;
          return null;
        }
        if (y >= 14) return 0x352116;
        return (z + y) % 3 === 0 ? 0x565553 : 0x62605d;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const leftWall = new THREE.Mesh(leftWallGeo, mat);
  leftWall.position.set(-4.25, 0, -4.0);
  leftWall.receiveShadow = true;
  root.add(leftWall);

  // Warm sunset sky glow outside the lattice window
  const windowGlow = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.3, 3.2),
    new THREE.MeshBasicMaterial({ color: 0xffc987 }),
  );
  windowGlow.position.set(-4.38, 2.0, 0.0);
  root.add(windowGlow);

  // Right wall (x = 4.0)
  const rightWallGeo = buildVoxelGeometry(
    {
      size: [2, 16, 32],
      at(_x, y, z) {
        if (y >= 14) return 0x352116;
        if (z % 10 === 0) return 0x3b2417;
        return (z + y) % 3 === 0 ? 0x555452 : 0x615f5c;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const rightWall = new THREE.Mesh(rightWallGeo, mat);
  rightWall.position.set(3.75, 0, -4.0);
  rightWall.receiveShadow = true;
  root.add(rightWall);

  // Ceiling rafters
  const ceilingGeo = buildVoxelGeometry(
    {
      size: [34, 2, 32],
      at(x, y, z) {
        if (y === 0 && (z % 6 === 0 || x % 11 === 0)) return 0x331f14;
        if (y === 1) return 0x24160e;
        return null;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const ceiling = new THREE.Mesh(ceilingGeo, mat);
  ceiling.position.set(-4.25, 3.75, -4.0);
  root.add(ceiling);

  // Hinged traditional wooden study door
  const doorPivot = new THREE.Group();
  doorPivot.position.set(1.25, 0, -3.75);
  const doorGeo = buildVoxelGeometry(
    {
      size: [6, 10, 1],
      at(x, y, _z) {
        if (x === 0 || x === 5 || y === 0 || y === 9 || y === 5) return 0x382014;
        return 0x543321;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const doorMesh = new THREE.Mesh(doorGeo, mat);
  doorMesh.castShadow = true;
  doorPivot.add(doorMesh);
  root.add(doorPivot);

  // 2. Museum glass display cabinets lining the walls
  const cabBackLeft = createVoxelCabinet(1);
  cabBackLeft.position.set(-2.3, 0, -3.35);
  root.add(cabBackLeft);

  const cabBackCenter = createVoxelCabinet(2);
  cabBackCenter.position.set(-0.5, 0, -3.35);
  root.add(cabBackCenter);

  const cabRight1 = createVoxelCabinet(3);
  cabRight1.position.set(3.35, 0, -1.6);
  cabRight1.rotation.y = -Math.PI / 2;
  root.add(cabRight1);

  const cabRight2 = createVoxelCabinet(4);
  cabRight2.position.set(3.35, 0, 0.4);
  cabRight2.rotation.y = -Math.PI / 2;
  root.add(cabRight2);

  // Antique wall clock with animated pendulum on back wall
  const clockCase = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [4, 7, 2],
        at(x, y, z) {
          if (z === 1 && y >= 4 && y <= 5 && x >= 1 && x <= 2) return 0xefe2c2; // clock face
          return 0x3c2214;
        },
      },
      { voxel: 0.1 },
    ),
    mat,
  );
  clockCase.position.set(0.75, 2.35, -3.5);
  root.add(clockCase);

  const pendulumPivot = new THREE.Group();
  pendulumPivot.position.set(0.75, 2.2, -3.45);
  const pendulum = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.34, 0.04),
    voxelMaterial({ color: 0xd4a448, roughness: 0.4, metalness: 0.6 }),
  );
  pendulum.position.y = -0.17;
  pendulumPivot.add(pendulum);
  root.add(pendulumPivot);

  // 3. Central Hardwood Collector's Workbench (y top = 0.86m)
  const tableGeo = buildVoxelGeometry(
    {
      size: [20, 9, 10],
      at(x, y, z) {
        if (y === 8) return (x + z) % 4 === 0 ? 0x5c3a24 : 0x6b452c; // tabletop
        if (y === 7 && (x === 1 || x === 18 || z === 1 || z === 8)) return 0x452b1b;
        // 4 sturdy timber legs
        if ((x <= 1 || x >= 18) && (z <= 1 || z >= 8)) return 0x3d2517;
        return null;
      },
    },
    { voxel: 0.095, anchor: "min" },
  );
  const table = new THREE.Mesh(tableGeo, mat);
  table.position.set(-0.95, 0, -0.475);
  table.castShadow = true;
  table.receiveShadow = true;
  root.add(table);

  const tableTopY = 0.855;

  // Vintage Brass Voxel Desk Lamp on left edge of workbench
  const lampGeo = voxelModel({
    palette: {
      b: 0xb88b3a,
      s: 0x265c3e, // classic green banker/museum glass shade
      g: 0xffe4a1,
    },
    layers: [
      [
        "....ssss...",
        "...ssssss..",
        "....g..b...",
        ".......b...",
        ".......b...",
        "......bb...",
        ".....bbbb..",
      ],
      [
        "...ssssss..",
        "..ssggggss.",
        "...gg..b...",
        ".......b...",
        ".......b...",
        "......bb...",
        ".....bbbb..",
      ],
      [
        "....ssss...",
        "...ssssss..",
        "....g..b...",
        ".......b...",
        ".......b...",
        "......bb...",
        ".....bbbb..",
      ],
    ],
    axis: "x",
    voxel: 0.065,
  });
  const deskLamp = new THREE.Mesh(lampGeo, voxelMaterial({ roughness: 0.45, metalness: 0.45 }));
  deskLamp.position.set(-0.68, tableTopY + 0.22, -0.18);
  deskLamp.rotation.y = Math.PI * 0.3;
  deskLamp.castShadow = true;
  root.add(deskLamp);

  // Small velvet specimen tray & antique microscope on workbench
  const specimenStone = createMeteoriteMesh(0.018, 77);
  specimenStone.position.set(-0.34, tableTopY + 0.05, -0.05);
  root.add(specimenStone);

  // Tea service on workbench
  const teapot = createTeapotMesh(0.036);
  teapot.position.set(0.32, tableTopY + 0.11, -0.06);
  root.add(teapot);

  const benchCupCollector = createTeacupMesh(0.026);
  benchCupCollector.position.set(0.08, tableTopY + 0.055, -0.22);
  root.add(benchCupCollector);

  const benchCupZhang = createTeacupMesh(0.026);
  benchCupZhang.position.set(0.14, tableTopY + 0.055, 0.24);
  root.add(benchCupZhang);

  // The THREE apple-sized Iron Meteorites (appear deterministically during Shot 05!)
  const benchMeteorites = [
    createMeteoriteMesh(0.032, 101),
    createMeteoriteMesh(0.033, 202),
    createMeteoriteMesh(0.031, 303),
  ];
  benchMeteorites[0]!.position.set(-0.24, tableTopY + 0.08, 0.12);
  benchMeteorites[1]!.position.set(0.0, tableTopY + 0.085, 0.06);
  benchMeteorites[2]!.position.set(0.24, tableTopY + 0.08, 0.14);
  for (const m of benchMeteorites) {
    m.visible = false;
    root.add(m);
  }

  // 4. Floating Golden Dust Motes & Rising Voxel Tea Steam (InstancedMesh, deterministic!)
  const dustCount = 72;
  const dustMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.022, 0.022, 0.022),
    new THREE.MeshBasicMaterial({ color: 0xffdfaa, transparent: true, opacity: 0.45 }),
    dustCount,
  );
  root.add(dustMesh);

  const steamCount = 24;
  const steamMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.024, 0.024, 0.024),
    new THREE.MeshBasicMaterial({ color: 0xfff7eb, transparent: true, opacity: 0.34 }),
    steamCount,
  );
  root.add(steamMesh);

  // 5. Warm Chiaroscuro Museum Lighting
  const ambient = new THREE.HemisphereLight(0xffddb0, 0x261810, 0.48);
  root.add(ambient);

  const deskPoolLight = new THREE.PointLight(0xffb45c, 4.4, 7.5, 1.5);
  deskPoolLight.position.set(-0.42, 1.48, 0.05);
  deskPoolLight.castShadow = true;
  deskPoolLight.shadow.mapSize.set(1024, 1024);
  deskPoolLight.shadow.bias = -0.001;
  root.add(deskPoolLight);

  // Slanting late-afternoon golden sun through the lattice window
  const windowSun = new THREE.DirectionalLight(0xffc37a, 2.2);
  windowSun.position.set(-6.5, 4.2, 1.2);
  windowSun.target.position.set(0.5, 0.6, -0.2);
  windowSun.castShadow = true;
  windowSun.shadow.mapSize.set(1024, 1024);
  root.add(windowSun);
  root.add(windowSun.target);

  // Warm museum cabinet gallery fill lights
  const cabLight1 = new THREE.PointLight(0xffd48f, 2.4, 6.2, 1.6);
  cabLight1.position.set(-1.3, 1.85, -2.55);
  root.add(cabLight1);

  const cabLight2 = new THREE.PointLight(0xffd48f, 2.2, 6.2, 1.6);
  cabLight2.position.set(2.5, 1.85, -0.6);
  root.add(cabLight2);

  // Subtle cool fill opposite the window for rich shadow separation
  const coolFill = new THREE.PointLight(0x7ca2c9, 0.85, 9, 1.5);
  coolFill.position.set(2.2, 2.6, 2.8);
  root.add(coolFill);

  const dummy = new THREE.Object3D();

  return {
    root,
    doorPivot,
    pendulumPivot,
    benchMeteorites,
    teapot,
    benchCupZhang,
    benchCupCollector,
    update(time, doorOpen, meteoritesShown, teaSteaming) {
      doorPivot.rotation.y = -doorOpen * 1.15;
      pendulumPivot.rotation.z = Math.sin(time * Math.PI) * 0.22;

      for (let i = 0; i < benchMeteorites.length; i++) {
        benchMeteorites[i]!.visible = i < meteoritesShown;
      }

      // Deterministic floating sunlit dust motes
      for (let i = 0; i < dustCount; i++) {
        const s = i * 17.31;
        const x = -3.4 + ((s * 0.71) % 6.2) + Math.sin(time * 0.35 + s) * 0.14;
        const y = 0.55 + (((s * 0.43) + time * 0.04) % 2.6);
        const z = -2.4 + ((s * 0.91) % 4.8) + Math.cos(time * 0.28 + s) * 0.14;
        const sc = 0.6 + 0.5 * Math.sin(time * 1.4 + s);
        dummy.position.set(x, y, z);
        dummy.rotation.set(time * 0.4 + s, time * 0.3, 0);
        dummy.scale.setScalar(sc);
        dummy.updateMatrix();
        dustMesh.setMatrixAt(i, dummy.matrix);
      }
      dustMesh.instanceMatrix.needsUpdate = true;

      // Deterministic voxel tea steam rising gently from cups & teapot
      steamMesh.visible = teaSteaming;
      if (teaSteaming) {
        for (let i = 0; i < steamCount; i++) {
          const origin = i % 2 === 0 ? benchCupZhang.position : benchCupCollector.position;
          const phase = ((time * 0.45 + i / steamCount) % 1);
          const x = origin.x + Math.sin(phase * 6 + i) * 0.035;
          const y = origin.y + 0.06 + phase * 0.42;
          const z = origin.z + Math.cos(phase * 5 + i) * 0.035;
          const sc = (1 - phase) * (0.65 + 0.45 * Math.sin(i));
          dummy.position.set(x, y, z);
          dummy.rotation.set(phase * 2, phase * 1.5, 0);
          dummy.scale.setScalar(Math.max(0.01, sc));
          dummy.updateMatrix();
          steamMesh.setMatrixAt(i, dummy.matrix);
        }
        steamMesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

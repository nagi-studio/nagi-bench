import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { createAmmoCaseMesh, createCartridgeMesh } from "../props/voxelProps";

export interface BasementSet {
  root: THREE.Group;
  bulbPivot: THREE.Group;
  muzzleFlashGroup: THREE.Group;
  muzzleFlashLight: THREE.PointLight;
  targetBundleGroup: THREE.Group;
  bulletHoles: THREE.Mesh[];
  beefInspectGroup: THREE.Group;
  cartridgesCopper: THREE.Mesh[];
  cartridgesMeteor: THREE.Mesh[];
  ammoCase: THREE.Mesh;
  update(
    time: number,
    convertedCount: number,
    shotFlashIntensity: number,
    holesCount: number,
    smokeAge: number,
    showBeefInspection: boolean,
  ): void;
}

export function createBasementSet(): BasementSet {
  const root = new THREE.Group();
  root.name = "set:basement";
  root.visible = false;

  const concreteMat = voxelMaterial({ roughness: 0.96, metalness: 0.02 });
  const metalMat = voxelMaterial({ roughness: 0.5, metalness: 0.5 });

  // 1. Tight, claustrophobic concrete bunker walls & floor
  const bunkerGeo = buildVoxelGeometry(
    {
      size: [24, 14, 30],
      at(x, y, z) {
        // Interior hollow volume
        const isWall =
          y === 0 || y === 13 || x === 0 || x === 23 || z === 0 || z === 29;
        if (!isWall) return null;
        // Concrete slab seams & damp stains
        const hash = (x * 7 + y * 13 + z * 11) % 7;
        if (y === 0) return hash === 0 ? 0x32363b : 0x3b4046;
        if (y <= 2) return 0x383d43; // damp lower band
        return hash === 0 ? 0x454b52 : 0x4f555d;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const bunker = new THREE.Mesh(bunkerGeo, concreteMat);
  bunker.position.set(-3.0, -0.25, -4.5);
  bunker.receiveShadow = true;
  root.add(bunker);

  // Concrete pipes running along left wall for stark realism
  const pipe = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 6.8),
    voxelMaterial({ color: 0x3b4249, roughness: 0.6, metalness: 0.5 }),
  );
  pipe.position.set(-2.65, 2.55, -0.8);
  root.add(pipe);

  // 2. Dangling Bare Overhead Tungsten Bulb on cord
  const bulbPivot = new THREE.Group();
  bulbPivot.position.set(0, 3.0, -0.6);

  const cord = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.85, 0.025),
    voxelMaterial({ color: 0x16181c }),
  );
  cord.position.y = -0.425;
  bulbPivot.add(cord);

  const shade = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.07, 0.28),
    metalMat,
  );
  shade.position.y = -0.85;
  bulbPivot.add(shade);

  const bulbMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.12, 0.1),
    new THREE.MeshBasicMaterial({ color: 0xffe4ad }),
  );
  bulbMesh.position.y = -0.94;
  bulbPivot.add(bulbMesh);

  const bulbLight = new THREE.PointLight(0xffcf82, 5.2, 9.5, 1.6);
  bulbLight.position.set(0, -1.04, 0);
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(1024, 1024);
  bulbLight.shadow.bias = -0.001;
  bulbPivot.add(bulbLight);
  root.add(bulbPivot);

  // 3. Stark Small Steel-and-Wood Work Table (tabletop y = 0.82m)
  const tableGeo = buildVoxelGeometry(
    {
      size: [14, 9, 8],
      at(x, y, z) {
        if (y === 8) return (x + z) % 3 === 0 ? 0x4d4338 : 0x5c5043;
        if ((x === 0 || x === 13) && (z === 0 || z === 7)) return 0x2c3238;
        return null;
      },
    },
    { voxel: 0.092, anchor: "min" },
  );
  const table = new THREE.Mesh(tableGeo, concreteMat);
  table.position.set(-0.64, 0, -1.05);
  table.castShadow = true;
  table.receiveShadow = true;
  root.add(table);

  const tableTopY = 0.828;

  // 36 Caseless 7.62mm Cartridges arranged in crisp 6x6 rows (swap copper -> meteorite!)
  const cartridgesCopper: THREE.Mesh[] = [];
  const cartridgesMeteor: THREE.Mesh[] = [];
  const copperProto = createCartridgeMesh(false, 0.009);
  const meteorProto = createCartridgeMesh(true, 0.009);

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const px = -0.34 + c * 0.072;
      const pz = -0.82 + r * 0.068;
      const cop = copperProto.clone();
      cop.position.set(px, tableTopY, pz);
      root.add(cop);
      cartridgesCopper.push(cop);

      const met = meteorProto.clone();
      met.position.set(px, tableTopY, pz);
      met.visible = false;
      root.add(met);
      cartridgesMeteor.push(met);
    }
  }

  // Silver aerospace hull-grade adhesive tube
  const glueTube = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [7, 2, 2],
        at(x, _y, _z) {
          if (x === 6) return 0x2c333b;
          if (x === 3 || x === 4) return 0x4bc8f0;
          return 0xc6d0db;
        },
      },
      { voxel: 0.02 },
    ),
    metalMat,
  );
  glueTube.position.set(0.24, tableTopY + 0.025, -0.78);
  glueTube.rotation.y = 0.42;
  root.add(glueTube);

  // Military ammo carrying case for the remaining 32 rounds
  const ammoCase = createAmmoCaseMesh(0.032);
  ammoCase.position.set(0.2, tableTopY, -0.58);
  ammoCase.rotation.y = -0.22;
  root.add(ammoCase);

  // 4. Far Concrete Wall Target: Spacesuit-Cloth Layered Bundle Wrapping Raw Beef!
  const targetBundleGroup = new THREE.Group();
  targetBundleGroup.position.set(0.0, 1.38, -3.95);

  const bundleGeo = buildVoxelGeometry(
    {
      size: [10, 11, 5],
      at(x, y, z) {
        // Exposed cross-section edges showing yellow thermal foam & blue cooling tubing inside white spacesuit fabric!
        if (x === 0 || x === 9) {
          if (z === 2 && y % 3 === 0) return 0x4ba3d9; // plastic cooling tube
          if (z === 2) return 0xd9c26c; // yellow thermal foam
        }
        return (x + y + z) % 4 === 0 ? 0xcfd6de : 0xe0e6ed;
      },
    },
    { voxel: 0.068 },
  );
  const bundleMesh = new THREE.Mesh(bundleGeo, concreteMat);
  bundleMesh.castShadow = true;
  bundleMesh.receiveShadow = true;
  targetBundleGroup.add(bundleMesh);

  // Four crisp dark bullet entry holes (appear deterministically as each test shot hits!)
  const bulletHoles: THREE.Mesh[] = [];
  const holeCoords: Array<[number, number]> = [
    [-0.1, 0.11],
    [0.09, 0.06],
    [-0.04, -0.09],
    [0.07, -0.11],
  ];
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x120e0e });
  for (const [hx, hy] of holeCoords) {
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.036, 0.04), holeMat);
    hole.position.set(hx, hy, 0.175);
    hole.visible = false;
    targetBundleGroup.add(hole);
    bulletHoles.push(hole);
  }
  root.add(targetBundleGroup);

  // 5. Shot 10 Inspection Prop: Cut-open Spacesuit Cloth + Raw Crimson Beef + Shattered Meteorite Gravel!
  const beefInspectGroup = new THREE.Group();
  beefInspectGroup.position.set(-0.08, tableTopY + 0.02, -0.68);
  beefInspectGroup.visible = false;

  // Spread white spacesuit cloth & yellow thermal foam mat
  const clothMat = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [14, 1, 10],
        at(x, _y, z) {
          if (x === 1 || x === 12) return 0xd8c16c; // foam edge
          return (x + z) % 3 === 0 ? 0xd0d7e0 : 0xe3e8ef;
        },
      },
      { voxel: 0.038 },
    ),
    concreteMat,
  );
  beefInspectGroup.add(clothMat);

  // Deep crimson raw beef slab with pale fat marbling
  const beefSlab = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [8, 3, 6],
        at(x, y, z) {
          if ((x === 3 && z === 2) || (x === 5 && z === 4)) return 0x26090b; // bullet tracks
          if ((x + y * 2 + z) % 7 === 0) return 0xe8d5cc; // fat marbling
          return (x + z) % 2 === 0 ? 0x8f1d24 : 0x7a161d;
        },
      },
      { voxel: 0.035, anchor: "min" },
    ),
    voxelMaterial({ roughness: 0.55 }),
  );
  beefSlab.position.set(-0.18, 0.015, -0.11);
  beefInspectGroup.add(beefSlab);

  // Small heap of shattered dark iron meteorite gravel on a piece of white cloth!
  const gravelMat = voxelMaterial({ color: 0x4c5563, roughness: 0.42, metalness: 0.65 });
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = (i % 4) * 0.014;
    const shard = new THREE.Mesh(
      new THREE.BoxGeometry(0.013, 0.011, 0.015),
      gravelMat,
    );
    shard.position.set(0.18 + Math.cos(a) * r, 0.026 + (i % 2) * 0.006, 0.02 + Math.sin(a) * r);
    shard.rotation.set(i * 0.5, i * 0.9, i * 0.4);
    beefInspectGroup.add(shard);
  }
  root.add(beefInspectGroup);

  // 6. Violent Basement Muzzle Flash & Billowing Voxel Gunsmoke!
  const muzzleFlashGroup = new THREE.Group();
  muzzleFlashGroup.visible = false;
  const flashCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.34),
    new THREE.MeshBasicMaterial({ color: 0xfff4c2 }),
  );
  const flashCross1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.09, 0.14),
    new THREE.MeshBasicMaterial({ color: 0xff9a2e }),
  );
  const flashCross2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.42, 0.14),
    new THREE.MeshBasicMaterial({ color: 0xff9a2e }),
  );
  muzzleFlashGroup.add(flashCore, flashCross1, flashCross2);
  root.add(muzzleFlashGroup);

  const muzzleFlashLight = new THREE.PointLight(0xffa438, 0, 11, 1.3);
  root.add(muzzleFlashLight);

  const smokeCount = 86;
  const smokeMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.16, 0.16, 0.16),
    new THREE.MeshStandardMaterial({
      color: 0xc2c8d0,
      transparent: true,
      opacity: 0.24,
      roughness: 1,
    }),
    smokeCount,
  );
  root.add(smokeMesh);

  // Subtle dark ambient so basement remains moody Noir
  const ambient = new THREE.AmbientLight(0x2d323b, 0.45);
  root.add(ambient);

  const dummy = new THREE.Object3D();

  return {
    root,
    bulbPivot,
    muzzleFlashGroup,
    muzzleFlashLight,
    targetBundleGroup,
    bulletHoles,
    beefInspectGroup,
    cartridgesCopper,
    cartridgesMeteor,
    ammoCase,
    update(time, convertedCount, shotFlashIntensity, holesCount, smokeAge, showBeefInspection) {
      // Gentle claustrophobic bulb sway (kicks slightly stronger when shots fire!)
      const swayAmp = 0.035 + (smokeAge > 0 && smokeAge < 8 ? 0.06 * Math.exp(-smokeAge * 0.3) : 0);
      bulbPivot.rotation.z = Math.sin(time * 1.65) * swayAmp;
      bulbPivot.rotation.x = Math.cos(time * 1.1) * swayAmp * 0.5;

      for (let i = 0; i < 36; i++) {
        cartridgesCopper[i]!.visible = !showBeefInspection && i >= convertedCount;
        cartridgesMeteor[i]!.visible = !showBeefInspection && i < convertedCount;
      }

      for (let i = 0; i < bulletHoles.length; i++) {
        bulletHoles[i]!.visible = i < holesCount;
      }

      beefInspectGroup.visible = showBeefInspection;
      muzzleFlashGroup.visible = shotFlashIntensity > 0.05;
      muzzleFlashGroup.scale.setScalar(0.6 + shotFlashIntensity * 0.8);
      muzzleFlashGroup.rotation.z = time * 42;
      muzzleFlashLight.intensity = shotFlashIntensity * 16.0;

      // Deterministic drifting voxel gunsmoke filling the concrete bunker after shots
      smokeMesh.visible = smokeAge > 0;
      if (smokeAge > 0) {
        const fade = Math.min(1, smokeAge * 0.8) * Math.max(0.25, 1 - smokeAge * 0.03);
        for (let i = 0; i < smokeCount; i++) {
          const s = i * 23.17;
          const age = Math.max(0, smokeAge - (i % 4) * 1.3);
          const spread = Math.min(2.6, age * 0.34);
          const x = Math.sin(s * 1.7) * spread * 0.85;
          const y = 1.25 + ((age * 0.14 + (s % 1.2)) % 1.55);
          const z = -1.2 - ((i % 9) * 0.28) + Math.cos(s * 2.1) * spread * 0.5;
          const sc = age <= 0 ? 0.001 : (0.55 + Math.min(2.1, age * 0.25)) * fade;
          dummy.position.set(x, y, z);
          dummy.rotation.set(time * 0.15 + s, time * 0.12 + s, 0);
          dummy.scale.setScalar(sc);
          dummy.updateMatrix();
          smokeMesh.setMatrixAt(i, dummy.matrix);
        }
        smokeMesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

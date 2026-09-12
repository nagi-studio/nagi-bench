import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, type VoxelSource } from "@agentbench/voxel-kit";
import { buildZhangBeihaiFigure } from "../characters";
import {
  createPistolMesh,
  createSniperScopeMesh,
  createBallisticTargetMesh,
  createPliersMesh,
  createAmmoTrayMesh,
} from "../props";

export interface BasementSceneHandle {
  root: THREE.Group;
  zhang: ReturnType<typeof buildZhangBeihaiFigure>;
  pistol: THREE.Mesh;
  scope: THREE.Mesh;
  targetIntact: THREE.Mesh;
  targetPenetrated: THREE.Mesh;
  muzzleFlash: THREE.PointLight;
  smoke: THREE.Points;
  bulbLight: THREE.PointLight;
}

export function createBasementScene(): BasementSceneHandle {
  const root = new THREE.Group();
  root.name = "scene:secret-basement";

  // 1. Concrete Bunker Architecture
  const bunkerSource: VoxelSource = {
    size: [36, 18, 54],
    at(x, y, z) {
      // Floor: Rough pitted concrete
      if (y === 0) return (x + z) % 4 === 0 ? 0x27272a : 0x1f1f23;
      // Back target wall (z = 0) with heavy sandbag / steel plate backing
      if (z === 0) {
        if (x >= 10 && x <= 26 && y >= 2 && y <= 14) return 0x3f3f46; // Steel backstop
        return 0x18181b;
      }
      // Left and right concrete block walls
      if (x === 0 || x === 35) {
        return (x + y * 2) % 3 === 0 ? 0x27272a : 0x18181b;
      }
      return null;
    },
  };

  const bunkerGeo = buildVoxelGeometry(bunkerSource, { voxel: 0.25, anchor: "min" });
  const bunkerMesh = new THREE.Mesh(bunkerGeo, voxelMaterial({ roughness: 0.95, metalness: 0.05 }));
  bunkerMesh.position.set(-4.5, 0, -6.5);
  root.add(bunkerMesh);

  // 2. Hanging Single Bare Bulb Lamp Fixture
  const lampGeo = buildVoxelGeometry({
    size: [2, 6, 2],
    at(x, y, z) {
      if (y > 2) return 0x09090b; // Black cord
      return 0xfef08a; // Glowing bulb
    },
  }, { voxel: 0.06, anchor: "center" });
  const lampMesh = new THREE.Mesh(lampGeo, voxelMaterial({ roughness: 0.2 }));
  lampMesh.position.set(0, 3.2, 0.5);
  root.add(lampMesh);

  const bulbLight = new THREE.PointLight(0xffedd5, 2.2, 8, 1.2);
  bulbLight.position.set(0, 3.0, 0.5);
  root.add(bulbLight);

  // 3. Assembly Workbench
  const benchGeo = buildVoxelGeometry({
    size: [18, 9, 12],
    at(x, y, z) {
      if (y >= 7) return 0x3e2723;
      if ((x <= 1 || x >= 16) && (z <= 1 || z >= 10)) return 0x1f1712;
      return null;
    },
  }, { voxel: 0.08, anchor: "center" });
  const benchMesh = new THREE.Mesh(benchGeo, voxelMaterial({ roughness: 0.8, metalness: 0.1 }));
  benchMesh.position.set(0, 0.4, 0.8);
  root.add(benchMesh);

  // 4. Props on Bench
  const pliers = createPliersMesh();
  pliers.position.set(-0.35, 0.8, 0.8);
  pliers.rotation.x = -Math.PI / 2;
  root.add(pliers);

  const ammoTray = createAmmoTrayMesh();
  ammoTray.position.set(0.3, 0.8, 0.85);
  root.add(ammoTray);

  // 5. Ballistics Targets at 5 meters backstop (z = -4.5)
  const targetIntact = createBallisticTargetMesh(false);
  targetIntact.position.set(0, 1.4, -4.5);
  root.add(targetIntact);

  const targetPenetrated = createBallisticTargetMesh(true);
  targetPenetrated.position.set(0, 1.4, -4.5);
  targetPenetrated.visible = false;
  root.add(targetPenetrated);

  // Target Stand Frame
  const standGeo = buildVoxelGeometry({
    size: [14, 18, 4],
    at(x, y, z) {
      if (x === 0 || x === 13 || y === 0 || y === 17) return 0x27272a;
      return null;
    },
  }, { voxel: 0.1, anchor: "center" });
  const standMesh = new THREE.Mesh(standGeo, voxelMaterial({ roughness: 0.7, metalness: 0.4 }));
  standMesh.position.set(0, 1.0, -4.5);
  root.add(standMesh);

  // 6. Zhang Beihai Figure
  const zhang = buildZhangBeihaiFigure();
  zhang.root.position.set(0, 0, 1.6);
  root.add(zhang.root);

  // Weapon props attached to right hand
  const pistol = createPistolMesh();
  zhang.anchors.handR.add(pistol);

  const scope = createSniperScopeMesh();
  pistol.add(scope);

  // 7. Muzzle Flash & Smoke FX
  const muzzleFlash = new THREE.PointLight(0xffa500, 0, 8);
  muzzleFlash.position.set(0, 1.3, 0.5);
  root.add(muzzleFlash);

  const smokeCount = 48;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePos = new Float32Array(smokeCount * 3);
  for (let i = 0; i < smokeCount; i++) {
    smokePos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
    smokePos[i * 3 + 1] = Math.random() * 0.5 + 1.2;
    smokePos[i * 3 + 2] = (Math.random() - 0.5) * 0.6 - 1.0;
  }
  smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
  const smokeMat = new THREE.PointsMaterial({
    color: 0xa1a1aa,
    size: 0.15,
    transparent: true,
    opacity: 0,
  });
  const smoke = new THREE.Points(smokeGeo, smokeMat);
  root.add(smoke);

  // Ambient lighting: Dark claustrophobic shadow
  const ambient = new THREE.AmbientLight(0x18181b, 0.4);
  root.add(ambient);

  return {
    root,
    zhang,
    pistol,
    scope,
    targetIntact,
    targetPenetrated,
    muzzleFlash,
    smoke,
    bulbLight,
  };
}

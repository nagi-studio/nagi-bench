import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { createMeteoriteSlugMesh } from "../props/voxelProps";

export interface WorkshopSet {
  root: THREE.Group;
  chuckGroup: THREE.Group;
  cutterCarriage: THREE.Group;
  shavingsGroup: THREE.Group;
  slugTrayGroup: THREE.Group;
  update(time: number, localTime: number): void;
}

export function createWorkshopSet(): WorkshopSet {
  const root = new THREE.Group();
  root.name = "set:workshop";
  root.visible = false;

  const mat = voxelMaterial({ roughness: 0.78, metalness: 0.18 });
  const metalMat = voxelMaterial({ roughness: 0.45, metalness: 0.58 });

  // 1. Cold concrete industrial floor & dark steel-ribbed walls
  const floorGeo = buildVoxelGeometry(
    {
      size: [36, 1, 28],
      at(x, _y, z) {
        // Subtle safety stripe around machine zone
        if ((x === 10 || x === 25) && z >= 6 && z <= 18) return 0x8f7a30;
        return (x + z) % 4 === 0 ? 0x2a313a : 0x323a44;
      },
    },
    { voxel: 0.25 },
  );
  const floor = new THREE.Mesh(floorGeo, mat);
  floor.position.set(0, -0.125, 0);
  floor.receiveShadow = true;
  root.add(floor);

  const backWallGeo = buildVoxelGeometry(
    {
      size: [36, 18, 2],
      at(x, y, _z) {
        if (x % 9 === 0) return 0x1c232c; // vertical steel I-beam columns
        if (y === 6) return 0x24303d; // dado stripe
        return (x + y) % 5 === 0 ? 0x27303b : 0x2e3845;
      },
    },
    { voxel: 0.25, anchor: "min" },
  );
  const backWall = new THREE.Mesh(backWallGeo, mat);
  backWall.position.set(-4.5, 0, -3.5);
  backWall.receiveShadow = true;
  root.add(backWall);

  // Overhead cold fluorescent ceiling fixtures
  for (const fx of [-2.0, 0.5, 3.0]) {
    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.12, 0.32),
      voxelMaterial({ color: 0x26303c }),
    );
    housing.position.set(fx, 3.85, -0.6);
    root.add(housing);

    const tube = new THREE.Mesh(
      new THREE.BoxGeometry(1.68, 0.06, 0.18),
      new THREE.MeshBasicMaterial({ color: 0xd6f0ff }),
    );
    tube.position.set(fx, 3.77, -0.6);
    root.add(tube);
  }

  // 2. Industrial Voxel CNC Lathe Machine (centerpiece!)
  const cncBaseGeo = buildVoxelGeometry(
    {
      size: [28, 16, 12],
      at(x, y, z) {
        // Open illuminated machining bay in upper center (x: 7..22, y: 8..14, z: 3..11)
        if (x >= 7 && x <= 22 && y >= 8 && y <= 14 && z >= 3) return null;
        // Control console panel face on left front (x: 1..5, y: 9..13, z: 11)
        if (x >= 1 && x <= 5 && y >= 9 && y <= 13 && z === 11) {
          if (y >= 11 && x >= 2 && x <= 4) return 0x1be892; // glowing emerald CNC CRT readout
          return (x + y) % 2 === 0 ? 0x526173 : 0x2a3542;
        }
        // Dark industrial teal-steel machine body
        if (y === 0 || y === 15) return 0x1a222b;
        if (y === 7 && z >= 2) return 0x3b4857; // stainless machine drip tray
        return (x + y) % 6 === 0 ? 0x243340 : 0x2b3d4c;
      },
    },
    { voxel: 0.1, anchor: "min" },
  );
  const cncBody = new THREE.Mesh(cncBaseGeo, metalMat);
  cncBody.position.set(-1.3, 0, -1.6);
  cncBody.castShadow = true;
  cncBody.receiveShadow = true;
  root.add(cncBody);

  // Rotating CNC Lathe Chuck + clamped Iron Meteorite Rod!
  const chuckGroup = new THREE.Group();
  chuckGroup.position.set(-0.46, 1.12, -0.95);

  const chuckGeo = buildVoxelGeometry(
    {
      size: [4, 5, 5],
      at(x, y, z) {
        if ((y === 0 || y === 4) && (z === 0 || z === 4)) return null;
        if (x === 3 && (y === 2 || z === 2)) return 0x9aa8b8; // chuck jaws
        return 0x546273;
      },
    },
    { voxel: 0.055 },
  );
  const chuckMesh = new THREE.Mesh(chuckGeo, metalMat);
  chuckGroup.add(chuckMesh);

  // Clamped dark iron meteorite cylinder rod spinning along +X!
  const rodGeo = buildVoxelGeometry(
    {
      size: [14, 3, 3],
      at(x, y, z) {
        if ((y === 0 || y === 2) && (z === 0 || z === 2)) return null;
        return x % 3 === 0 ? 0x778394 : 0x454e5c;
      },
    },
    { voxel: 0.032, anchor: "min" },
  );
  const rodMesh = new THREE.Mesh(rodGeo, metalMat);
  rodMesh.position.set(0.1, -0.048, -0.048);
  chuckGroup.add(rodMesh);
  root.add(chuckGroup);

  // Animated Carbide Cutting Carriage traveling along the meteorite rod
  const cutterCarriage = new THREE.Group();
  cutterCarriage.position.set(-0.08, 1.12, -0.95);
  const cutterGeo = buildVoxelGeometry(
    {
      size: [4, 5, 5],
      at(x, y, z) {
        if (y === 2 && x === 0 && z === 2) return 0xffaa44; // hot glowing carbide tip!
        return y > 2 ? 0x3b4654 : 0x677587;
      },
    },
    { voxel: 0.045 },
  );
  const cutterMesh = new THREE.Mesh(cutterGeo, metalMat);
  cutterMesh.position.set(0.08, 0.06, -0.14);
  cutterCarriage.add(cutterMesh);
  root.add(cutterCarriage);

  // 3. Side Stainless Inspection Bench + 36 Gleaming Machined Meteorite Slugs + Shavings!
  const sideBench = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [12, 9, 8],
        at(x, y, z) {
          if (y === 8) return 0x627080;
          if ((x === 0 || x === 11) && (z === 0 || z === 7)) return 0x35404d;
          return null;
        },
      },
      { voxel: 0.1, anchor: "min" },
    ),
    metalMat,
  );
  sideBench.position.set(1.65, 0, -1.2);
  sideBench.castShadow = true;
  sideBench.receiveShadow = true;
  root.add(sideBench);

  const slugTrayGroup = new THREE.Group();
  slugTrayGroup.position.set(2.05, 0.9, -0.82);
  const trayMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.03, 0.44),
    voxelMaterial({ color: 0x8695a6, roughness: 0.35, metalness: 0.6 }),
  );
  slugTrayGroup.add(trayMesh);

  // Populate 36 neatly lined up voxel meteorite bullet slugs (6 x 6)!
  const slugTemplate = createMeteoriteSlugMesh(0.0085, 6);
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const s = slugTemplate.clone();
      s.position.set(-0.22 + c * 0.086, 0.04, -0.15 + r * 0.06);
      s.rotation.z = Math.PI / 2;
      slugTrayGroup.add(s);
    }
  }
  root.add(slugTrayGroup);

  // Tiny iron shavings brushed cleanly away at end of Shot 07
  const shavingsGroup = new THREE.Group();
  shavingsGroup.position.set(0.0, 0.82, -0.88);
  const shavingMat = voxelMaterial({ color: 0x5c6675, roughness: 0.4, metalness: 0.7 });
  for (let i = 0; i < 22; i++) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 0.025), shavingMat);
    chip.position.set(-0.4 + ((i * 0.19) % 0.9), 0.01, -0.12 + ((i * 0.13) % 0.28));
    chip.rotation.y = i * 0.7;
    shavingsGroup.add(chip);
  }
  root.add(shavingsGroup);

  // 4. Blazing Incandescent Voxel Cutting Sparks (InstancedMesh, 100% deterministic!)
  const sparkCount = 130;
  const sparkMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.022, 0.022, 0.055),
    new THREE.MeshBasicMaterial({ color: 0xffb84d }),
    sparkCount,
  );
  root.add(sparkMesh);

  // 5. Cold Fluorescent + Emerald Console + Blazing Spark Point Lighting
  const ambient = new THREE.HemisphereLight(0xa3d4f5, 0x16212e, 0.78);
  root.add(ambient);

  const fluoroKey = new THREE.DirectionalLight(0xd4eeff, 2.6);
  fluoroKey.position.set(0.5, 4.2, 1.8);
  fluoroKey.castShadow = true;
  fluoroKey.shadow.mapSize.set(1024, 1024);
  root.add(fluoroKey);

  const bayLight = new THREE.PointLight(0xd9f2ff, 2.8, 5.5, 1.6);
  bayLight.position.set(0.1, 1.48, -0.72);
  root.add(bayLight);

  const consoleGlow = new THREE.PointLight(0x28f09c, 1.4, 3.2, 2.0);
  consoleGlow.position.set(-0.95, 1.25, -0.35);
  root.add(consoleGlow);

  const sparkLight = new THREE.PointLight(0xff8e2b, 0, 5.0, 1.6);
  sparkLight.position.set(-0.15, 1.15, -0.82);
  root.add(sparkLight);

  const dummy = new THREE.Object3D();

  return {
    root,
    chuckGroup,
    cutterCarriage,
    shavingsGroup,
    slugTrayGroup,
    update(time, localTime) {
      // Spindle runs actively until localTime = 14.2s, then decelerates cleanly
      const spinning = localTime < 14.2 ? 1 : Math.max(0, 1 - (localTime - 14.2) / 2.2);
      chuckGroup.rotation.x = time * 26 * (0.25 + 0.75 * spinning);

      // Cutting passes sync directly with `cnc-cut-sparks` cues (2.2-6.0s, 7.0-10.6s, 11.3-13.9s)
      const inPass1 = localTime >= 2.2 && localTime <= 6.0;
      const inPass2 = localTime >= 7.0 && localTime <= 10.6;
      const inPass3 = localTime >= 11.3 && localTime <= 13.9;
      const cutting = inPass1 || inPass2 || inPass3;

      const cutX = inPass1
        ? -0.22 + ((localTime - 2.2) / 3.8) * 0.28
        : inPass2
          ? -0.18 + ((localTime - 7.0) / 3.6) * 0.26
          : inPass3
            ? -0.1 + ((localTime - 11.3) / 2.6) * 0.22
            : 0.14;

      cutterCarriage.position.x = cutX;
      cutterCarriage.position.z = cutting ? -0.91 : -0.82;
      sparkLight.position.set(cutX, 1.12, -0.86);
      sparkLight.intensity = cutting ? 3.8 + Math.sin(time * 58) * 1.4 : 0;

      // Shavings sweep away neatly after localTime = 16.0s
      const sweepP = Math.max(0, Math.min(1, (localTime - 16.0) / 1.6));
      shavingsGroup.scale.setScalar(Math.max(0.01, 1 - sweepP));
      shavingsGroup.visible = sweepP < 0.98;

      // Deterministic ballistic voxel sparks!
      sparkMesh.visible = cutting;
      if (cutting) {
        for (let i = 0; i < sparkCount; i++) {
          const seed = i * 31.7;
          const life = (localTime * 2.8 + (seed % 1)) % 1;
          const vx = Math.sin(seed * 3.1) * 0.85 + 0.2;
          const vy = 0.65 + (seed % 0.95);
          const vz = 0.75 + Math.cos(seed * 2.3) * 0.55;
          const x = cutX + vx * life * 0.85;
          const y = Math.max(0.76, 1.12 + vy * life * 0.55 - 2.4 * life * life * 0.45);
          const z = -0.92 + vz * life * 0.85;
          dummy.position.set(x, y, z);
          dummy.rotation.set(vx * 2, vy * 2, vz * 2);
          const sc = Math.max(0.05, (1 - life) * (0.7 + (i % 3) * 0.25));
          dummy.scale.set(sc, sc, sc * 1.8);
          dummy.updateMatrix();
          sparkMesh.setMatrixAt(i, dummy.matrix);
        }
        sparkMesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

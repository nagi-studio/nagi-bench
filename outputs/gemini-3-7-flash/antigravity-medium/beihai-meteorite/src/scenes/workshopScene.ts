import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, type VoxelSource } from "@agentbench/voxel-kit";
import { buildZhangBeihaiFigure } from "../characters";
import { createLatheMesh, createAmmoTrayMesh } from "../props";

export interface WorkshopSceneHandle {
  root: THREE.Group;
  zhang: ReturnType<typeof buildZhangBeihaiFigure>;
  lathe: THREE.Group;
  tray: THREE.Mesh;
  spindle: THREE.Object3D;
  sparks: THREE.Points;
}

export function createWorkshopScene(): WorkshopSceneHandle {
  const root = new THREE.Group();
  root.name = "scene:workshop";

  // 1. Industrial Workshop Walls & Floor
  const workshopSource: VoxelSource = {
    size: [40, 20, 36],
    at(x, y, z) {
      // Floor: Polished industrial epoxy floor with yellow hazard lines
      if (y === 0) {
        if (z === 8 || z === 28 || x === 8 || x === 32) return 0xeab308; // Yellow line
        return 0x334155; // Slate floor
      }
      // Back wall with electrical conduit panels & warning signs
      if (z === 0) {
        if (y >= 8 && y <= 14 && x >= 14 && x <= 26) {
          if ((x + y) % 3 === 0) return 0x1e293b;
          return 0x0284c7; // Tool board
        }
        return 0x1e293b;
      }
      if (x === 0 || x === 39) return 0x1e293b;
      return null;
    },
  };

  const workshopGeo = buildVoxelGeometry(workshopSource, { voxel: 0.25, anchor: "min" });
  const workshopMesh = new THREE.Mesh(workshopGeo, voxelMaterial({ roughness: 0.7, metalness: 0.2 }));
  workshopMesh.position.set(-5, 0, -4);
  root.add(workshopMesh);

  // 2. CNC Lathe in Center
  const lathe = createLatheMesh();
  lathe.position.set(0, 0.7, 0);
  root.add(lathe);

  const spindle = lathe.getObjectByName("lathe:spindle") || lathe;

  // 3. Ammo tray on workbench holding cut meteorite cylinders
  const tray = createAmmoTrayMesh();
  tray.position.set(1.4, 0.95, 0.2);
  root.add(tray);

  // Tool bench beside lathe
  const benchGeo = buildVoxelGeometry({
    size: [14, 10, 10],
    at(x, y, z) {
      if (y >= 8) return 0x475569;
      if ((x <= 1 || x >= 12) && (z <= 1 || z >= 8)) return 0x1e293b;
      return null;
    },
  }, { voxel: 0.1, anchor: "center" });
  const benchMesh = new THREE.Mesh(benchGeo, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
  benchMesh.position.set(1.4, 0.45, 0.2);
  root.add(benchMesh);

  // 4. Spark Particle Effect for Lathe Machining
  const sparkCount = 36;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    sparkPos[i * 3 + 0] = (Math.random() - 0.5) * 0.3 - 0.4;
    sparkPos[i * 3 + 1] = Math.random() * 0.3 + 0.7;
    sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  root.add(sparks);

  // 5. Zhang Beihai Character in Officer Uniform
  const zhang = buildZhangBeihaiFigure();
  zhang.root.position.set(-0.2, 0, 1.1);
  zhang.root.rotation.y = 0.1;
  root.add(zhang.root);

  // 6. Lighting: Deep midnight cold blue ambient + intense overhead neon white light + cyan screen glow
  const ambient = new THREE.AmbientLight(0x0f172a, 0.8);
  root.add(ambient);

  const overheadLight = new THREE.SpotLight(0xf8fafc, 2.5, 9, Math.PI / 4, 0.3);
  overheadLight.position.set(0, 4.2, 0.5);
  overheadLight.target.position.set(0, 0.8, 0);
  root.add(overheadLight);
  root.add(overheadLight.target);

  const screenLight = new THREE.PointLight(0x38bdf8, 1.8, 3.5);
  screenLight.position.set(-0.3, 1.6, 0.4);
  root.add(screenLight);

  return { root, zhang, lathe, tray, spindle, sparks };
}

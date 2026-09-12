import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, type VoxelSource } from "@agentbench/voxel-kit";
import { buildZhangBeihaiFigure, buildCollectorFigure } from "../characters";
import { createMeteoriteMesh, createTeacupMesh } from "../props";

export interface CourtyardSceneHandle {
  root: THREE.Group;
  zhang: ReturnType<typeof buildZhangBeihaiFigure>;
  collector: ReturnType<typeof buildCollectorFigure>;
  meteorite1: THREE.Mesh;
  meteorite2: THREE.Mesh;
  meteorite3: THREE.Mesh;
  spotlight: THREE.SpotLight;
}

export function createCourtyardScene(): CourtyardSceneHandle {
  const root = new THREE.Group();
  root.name = "scene:courtyard-museum";

  // 1. Room Architecture (Siheyuan Old Parlor / Geological Museum)
  const roomSource: VoxelSource = {
    size: [48, 24, 40],
    at(x, y, z) {
      // Floor: Dark weathered wood / brick pavers
      if (y === 0) {
        return (x + z) % 2 === 0 ? 0x3d3025 : 0x2e231a;
      }
      // Back wall (z = 0) with traditional brick pattern
      if (z === 0) {
        // High window with wooden lattice
        if (y >= 14 && y <= 20 && x >= 16 && x <= 32) {
          if (x % 4 === 0 || y % 3 === 0) return 0x3e2723; // Dark wood lattice
          return null; // Open glass / window light
        }
        return (x + y) % 2 === 0 ? 0x52525b : 0x3f3f46; // Grey brick
      }
      // Left wall (x = 0)
      if (x === 0) return 0x475569;
      // Right wall (x = 47)
      if (x === 47) return 0x475569;
      return null;
    },
  };

  const roomGeo = buildVoxelGeometry(roomSource, { voxel: 0.25, anchor: "min" });
  const roomMesh = new THREE.Mesh(roomGeo, voxelMaterial({ roughness: 0.9, metalness: 0.1 }));
  roomMesh.position.set(-6, 0, -5);
  root.add(roomMesh);

  // 2. Glass Display Cabinets along walls with illuminated specimens
  const cabinetSource: VoxelSource = {
    size: [10, 16, 4],
    at(x, y, z) {
      // Frame
      if (x === 0 || x === 9 || y === 0 || y === 15 || z === 0 || z === 3) return 0x271e16;
      // Interior shelves
      if (y === 5 || y === 10) return 0x3a2c20;
      // Glass panes
      if (z === 3 && (y > 0 && y < 15) && (x > 0 && x < 9)) return 0x94a3b8;
      // Specimen stones on shelves
      if ((y === 6 || y === 11) && (x === 3 || x === 6) && z === 1) return 0x475569;
      return null;
    },
  };
  const cabinetGeo = buildVoxelGeometry(cabinetSource, { voxel: 0.18, anchor: "center" });

  const cab1 = new THREE.Mesh(cabinetGeo, voxelMaterial({ roughness: 0.4, metalness: 0.2 }));
  cab1.position.set(-3.5, 1.4, -3.5);
  root.add(cab1);

  const cab2 = new THREE.Mesh(cabinetGeo, voxelMaterial({ roughness: 0.4, metalness: 0.2 }));
  cab2.position.set(3.5, 1.4, -3.5);
  root.add(cab2);

  // 3. Central Solid Wood Workbench
  const tableSource: VoxelSource = {
    size: [24, 10, 14],
    at(x, y, z) {
      // Tabletop
      if (y >= 8) return (x + z) % 3 === 0 ? 0x4a3424 : 0x3d281a;
      // Four sturdy legs
      const isLegX = x <= 2 || x >= 21;
      const isLegZ = z <= 2 || z >= 11;
      if (isLegX && isLegZ) return 0x2b1b11;
      return null;
    },
  };
  const tableGeo = buildVoxelGeometry(tableSource, { voxel: 0.1, anchor: "center" });
  const tableMesh = new THREE.Mesh(tableGeo, voxelMaterial({ roughness: 0.7, metalness: 0.1 }));
  tableMesh.position.set(0, 0.5, 0);
  root.add(tableMesh);

  // 4. Props on table
  const teacup = createTeacupMesh();
  teacup.position.set(-0.6, 1.05, 0.2);
  root.add(teacup);

  const teacup2 = createTeacupMesh();
  teacup2.position.set(0.6, 1.05, 0.2);
  root.add(teacup2);

  // 3 Iron Meteorites on Table (Widmanstätten pattern rocks)
  const meteorite1 = createMeteoriteMesh(1.2);
  meteorite1.position.set(-0.2, 1.15, -0.1);
  root.add(meteorite1);

  const meteorite2 = createMeteoriteMesh(1.1);
  meteorite2.position.set(0.1, 1.14, -0.15);
  root.add(meteorite2);

  const meteorite3 = createMeteoriteMesh(1.3);
  meteorite3.position.set(0.35, 1.16, -0.05);
  root.add(meteorite3);

  // 5. Characters
  const zhang = buildZhangBeihaiFigure();
  zhang.root.position.set(-0.8, 0, 1.2);
  zhang.root.rotation.y = 0.35;
  root.add(zhang.root);

  const collector = buildCollectorFigure();
  collector.root.position.set(0.8, 0, 1.1);
  collector.root.rotation.y = -0.45;
  root.add(collector.root);

  // 6. Lighting: Warm ambient + dusty golden shaft through window + desk spotlight
  const ambient = new THREE.AmbientLight(0xffecd6, 0.55);
  root.add(ambient);

  const sunShaft = new THREE.DirectionalLight(0xffddaa, 1.6);
  sunShaft.position.set(2, 6, -6);
  sunShaft.target.position.set(0, 1, 0);
  root.add(sunShaft);
  root.add(sunShaft.target);

  const spotlight = new THREE.SpotLight(0xfff1cf, 2.2, 8, Math.PI / 5, 0.35);
  spotlight.position.set(0, 3.2, 0.5);
  spotlight.target.position.set(0, 1, 0);
  root.add(spotlight);
  root.add(spotlight.target);

  return { root, zhang, collector, meteorite1, meteorite2, meteorite3, spotlight };
}

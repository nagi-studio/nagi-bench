import * as THREE from "three";
import { buildVoxelGeometry, voxelSphere, voxelMaterial } from "@agentbench/voxel-kit";

// ==========================================
// 1. COURTYARD HOUSE INTERIOR (老宅四合院)
// ==========================================

export function createCourtyardScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = "scene:courtyard";

  // 1. Floor & Walls
  const roomGeom = buildVoxelGeometry({
    size: [24, 16, 24],
    at(x, y, z) {
      // Floor (y = 0)
      if (y === 0) {
        return (x + z) % 2 === 0 ? 0x3e2723 : 0x4e342e; // Deep wood parquet
      }
      // Ceiling (y = 15)
      if (y === 15) return 0x271a15;
      // Back wall (z = 0)
      if (z === 0) return 0x5d4037;
      // Left wall (x = 0)
      if (x === 0) return 0x4e342e;
      // Right wall (x = 23)
      if (x === 23) return 0x4e342e;
      return null;
    },
  }, { voxel: 0.3, anchor: "center" });

  const roomMesh = new THREE.Mesh(roomGeom, voxelMaterial({ roughness: 0.9 }));
  roomMesh.receiveShadow = true;
  root.add(roomMesh);

  // 2. Glowing Meteorite Display Cabinets (四壁立着玻璃柜子，里面专业的灯光照着一块块石头)
  const cabinetGeom = buildVoxelGeometry({
    size: [18, 12, 3],
    at(x, y, z) {
      // Outer frame
      const isBorder = x === 0 || x === 17 || y === 0 || y === 11 || z === 0;
      if (isBorder) return 0x1f1610; // Dark rosewood frame
      // Shelves at y = 4 and y = 8
      if ((y === 4 || y === 8) && z > 0) return 0x3e2723;
      // Specimens on shelves
      if ((y === 5 || y === 9) && z === 1 && (x % 4 === 2)) {
        // Diverse mineral specimens: olivine green, iron black, chondrite red
        if (x === 2) return 0x4d7c0f; // Pallasite olivine
        if (x === 6) return 0x27272a; // Iron meteorite
        if (x === 10) return 0xb45309; // Chondrite
        if (x === 14) return 0x0284c7; // Rare glass tektite
      }
      return null;
    },
  }, { voxel: 0.25, anchor: "center" });

  const cabinetMesh = new THREE.Mesh(cabinetGeom, voxelMaterial({ roughness: 0.6 }));
  cabinetMesh.position.set(0, 0.4, -2.8);
  cabinetMesh.castShadow = true;
  root.add(cabinetMesh);

  // 3. Central Solid Wood Workbench
  const benchGeom = buildVoxelGeometry({
    size: [14, 6, 8],
    at(x, y, z) {
      // Table top (y = 5)
      if (y === 5) return 0x5c3826;
      // Legs at 4 corners
      if (y < 5) {
        const isCorner = (x <= 1 || x >= 12) && (z <= 1 || z >= 6);
        if (isCorner) return 0x3d2417;
      }
      return null;
    },
  }, { voxel: 0.2, anchor: "center" });

  const benchMesh = new THREE.Mesh(benchGeom, voxelMaterial({ roughness: 0.8 }));
  benchMesh.position.set(0, -0.6, 0.2);
  benchMesh.castShadow = true;
  benchMesh.receiveShadow = true;
  root.add(benchMesh);

  // Lighting for courtyard
  const warmCeilingLight = new THREE.PointLight(0xffb74d, 1.8, 12);
  warmCeilingLight.position.set(0, 2.8, 0.5);
  warmCeilingLight.castShadow = true;
  root.add(warmCeilingLight);

  const cabinetAccentLight = new THREE.PointLight(0xffecd2, 1.2, 8);
  cabinetAccentLight.position.set(0, 1.2, -2.0);
  root.add(cabinetAccentLight);

  return root;
}

// ==========================================
// 2. CNC LATHE WORKSHOP (数控机床车间)
// ==========================================

export function createWorkshopScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = "scene:workshop";

  // 1. Industrial Workshop Floor & Wall
  const workshopGeom = buildVoxelGeometry({
    size: [24, 16, 24],
    at(x, y, z) {
      if (y === 0) {
        // Concrete floor with yellow safety hazard stripes
        if (z === 8 && x > 4 && x < 20) return 0xfacc15;
        return (x + z) % 4 === 0 ? 0x334155 : 0x1e293b;
      }
      if (z === 0) return 0x0f172a; // Industrial back wall
      if (x === 0 || x === 23) return 0x1e293b;
      return null;
    },
  }, { voxel: 0.3, anchor: "center" });

  const workshopMesh = new THREE.Mesh(workshopGeom, voxelMaterial({ roughness: 0.9 }));
  workshopMesh.receiveShadow = true;
  root.add(workshopMesh);

  // 2. High-Tech CNC Lathe Machine Unit
  const latheGeom = buildVoxelGeometry({
    size: [18, 12, 10],
    at(x, y, z) {
      // Heavy lathe bed
      if (y <= 4) return 0x1e293b;
      // Headstock & chuck on left (x <= 5)
      if (x <= 5 && y <= 9) return 0x334155;
      // Spinning chuck ring
      if (x === 5 && y >= 5 && y <= 7 && z >= 3 && z <= 6) return 0x94a3b8;
      // Meteorite cylindrical workpiece in chuck (x = 6..11)
      if (x >= 6 && x <= 11 && y === 6 && z === 4) return 0x24272c;
      // Tool carriage & turret (x = 9, y = 5..7, z = 5..7)
      if (x === 9 && y >= 5 && y <= 7 && z >= 5) return 0x64748b;
      // Special carbide cutting tool tip touching workpiece
      if (x === 9 && y === 6 && z === 4) return 0xf59e0b;
      // Tailstock on right
      if (x >= 14 && y <= 8) return 0x334155;
      // Top protective guard enclosure
      if (y === 11) return 0x0f172a;
      // Operator CNC monitor display on top-right
      if (x >= 13 && x <= 16 && y >= 9 && y <= 11 && z === 8) return 0x0284c7;
      return null;
    },
  }, { voxel: 0.22, anchor: "center" });

  const latheMesh = new THREE.Mesh(latheGeom, voxelMaterial({ roughness: 0.5, metalness: 0.4 }));
  latheMesh.position.set(0, -0.2, 0);
  latheMesh.castShadow = true;
  root.add(latheMesh);

  // Industrial cyan/blue overhead light
  const industrialLight = new THREE.PointLight(0x7dd3fc, 2.0, 14);
  industrialLight.position.set(0, 3.2, 0.8);
  industrialLight.castShadow = true;
  root.add(industrialLight);

  // CNC display screen glow
  const screenGlow = new THREE.PointLight(0x38bdf8, 1.2, 4);
  screenGlow.position.set(1.6, 1.2, 1.2);
  root.add(screenGlow);

  return root;
}

// ==========================================
// 3. UNDERGROUND BASEMENT (隐蔽地下室靶场)
// ==========================================

export function createBasementScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = "scene:basement";

  // 1. Concrete Vault Structure
  const basementGeom = buildVoxelGeometry({
    size: [20, 14, 24],
    at(x, y, z) {
      if (y === 0) return 0x1f2937; // Raw concrete slab
      if (y === 13) return 0x111827; // Ceiling
      if (z === 0) return 0x374151; // Target wall
      if (x === 0 || x === 19) return 0x1f2937;
      return null;
    },
  }, { voxel: 0.3, anchor: "center" });

  const basementMesh = new THREE.Mesh(basementGeom, voxelMaterial({ roughness: 0.95 }));
  basementMesh.receiveShadow = true;
  root.add(basementMesh);

  // 2. Concrete Worktable for ammo assembly
  const tableGeom = buildVoxelGeometry({
    size: [10, 6, 6],
    at(x, y, z) {
      if (y === 5) return 0x4b5563;
      if (y < 5 && (x <= 1 || x >= 8) && (z <= 1 || z >= 4)) return 0x374151;
      return null;
    },
  }, { voxel: 0.22, anchor: "center" });

  const tableMesh = new THREE.Mesh(tableGeom, voxelMaterial({ roughness: 0.9 }));
  tableMesh.position.set(-0.8, -0.6, 1.8);
  tableMesh.castShadow = true;
  root.add(tableMesh);

  // Single dangling bulb with warm filament
  const bulbLight = new THREE.PointLight(0xffedd5, 2.2, 12);
  bulbLight.position.set(0, 2.2, 0.5);
  bulbLight.castShadow = true;
  root.add(bulbLight);

  return root;
}

// ==========================================
// 4. GEOSTATIONARY ORBIT & HUANGHE STATION (地球同步轨道 & 黄河站)
// ==========================================

export function createOrbitScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = "scene:orbit";

  // 1. Voxel Earth
  // Uses voxelSphere with procedural continental noise and glowing sunset terminator
  const earthRadius = 26;
  const earthGeom = voxelSphere(earthRadius, (x, y, z, distRatio) => {
    // Spherical coordinates
    const phi = Math.acos(y / earthRadius);
    const theta = Math.atan2(z, x);

    // Continental landmass generation
    const continentNoise = Math.sin(phi * 4.2) * Math.cos(theta * 3.5) + Math.sin(theta * 6.0 + phi * 2.0) * 0.4;
    const isLand = continentNoise > 0.15;
    const isMountain = continentNoise > 0.6;
    const isCloud = Math.sin(phi * 7.0 + theta * 4.0) > 0.72 && distRatio > 0.96;

    // Sunset rim (Terminator line along x ~ 0.2)
    const sunsetFactor = 1.0 - Math.abs(x / earthRadius - 0.25);
    const isSunsetGlow = sunsetFactor > 0.88;

    if (isCloud) return 0xf8fafc; // Swirling white clouds
    if (isSunsetGlow && isLand) return 0xf97316; // Blazing orange sunset on land
    if (isSunsetGlow && !isLand) return 0xc2410c; // Sunset orange on ocean
    if (isMountain) return 0xd6d3d1; // Snowy mountains
    if (isLand) return 0x15803d; // Green continents
    // Ocean
    return distRatio > 0.97 ? 0x0284c7 : 0x1e3a8a; // Deep blue ocean
  }, { voxel: 18.0, anchor: "center" });

  const earthMesh = new THREE.Mesh(earthGeom, voxelMaterial({ roughness: 0.85, metalness: 0.1 }));
  // Place massive Earth below
  earthMesh.position.set(-60, -560, -220);
  earthMesh.rotation.z = 0.35;
  root.add(earthMesh);

  // 2. Voxel Sun (Golden radiant star at Earth's limb)
  const sunGeom = voxelSphere(4, 0xffedd5, { voxel: 6.0, anchor: "center" });
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
  const sunMesh = new THREE.Mesh(sunGeom, sunMat);
  sunMesh.position.set(-180, -260, -450);
  root.add(sunMesh);

  // Directional sunlight casting long, dramatic zero-G shadows
  const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
  sunLight.position.set(-180, -260, -450);
  sunLight.target.position.set(0, 0, 0);
  root.add(sunLight);
  root.add(sunLight.target);

  // Ambient starlight
  const ambientLight = new THREE.AmbientLight(0x0a1128, 0.4);
  root.add(ambientLight);

  // 3. Huanghe Space Station (Wheel structure with airlock)
  const huangheGroup = new THREE.Group();
  huangheGroup.name = "huanghe-station";

  // Massive outer habitation ring + spoke struts + central hub
  const stationGeom = buildVoxelGeometry({
    size: [48, 48, 16],
    at(x, y, z) {
      const cx = x - 24;
      const cy = y - 24;
      const r = Math.sqrt(cx * cx + cy * cy);

      // Outer wheel ring (r ~ 20..23)
      if (r >= 19.5 && r <= 23.5 && z >= 4 && z <= 12) {
        // Habitation modules with observation window strips
        if (z === 8 && Math.sin(r * 2.0 + cx) > 0.4) return 0xfacc15; // Golden warm windows
        return 0xe2e8f0; // White thermal plating
      }

      // 4 Radial Spokes connecting rim to hub
      const isSpoke = (Math.abs(cx) <= 1 || Math.abs(cy) <= 1) && r <= 20;
      if (isSpoke && z >= 6 && z <= 10) return 0x94a3b8;

      // Central Hub Cylinder (r <= 6)
      if (r <= 6 && z >= 2 && z <= 14) {
        // Circular EVA airlock hatch on face z = 14
        if (z === 14 && r <= 3) return 0x22c55e; // Green airlock hatch
        if (z === 14 && r <= 5) return 0x475569; // Airlock outer seal collar
        return 0xcbd5e1;
      }

      // Space Elevator Cable attachment beam running down along -Y
      if (Math.abs(cx) <= 1 && Math.abs(z - 8) <= 1 && cy < -6 && cy > -24) {
        return 0x334155;
      }

      return null;
    },
  }, { voxel: 1.8, anchor: "center" });

  const stationMesh = new THREE.Mesh(stationGeom, voxelMaterial({ roughness: 0.6, metalness: 0.3 }));
  stationMesh.castShadow = true;
  huangheGroup.add(stationMesh);

  // Space Elevator Cable extending downward to infinity
  const elevatorCableGeom = buildVoxelGeometry({
    size: [2, 120, 2],
    at: () => 0x64748b,
  }, { voxel: 1.6, anchor: "center" });
  const elevatorCable = new THREE.Mesh(elevatorCableGeom, voxelMaterial({ roughness: 0.4, metalness: 0.8 }));
  elevatorCable.position.set(0, -120, 0);
  huangheGroup.add(elevatorCable);

  // Place Huanghe Station in distance (5km = ~50 units in camera scale)
  huangheGroup.position.set(0, 15, -65);
  root.add(huangheGroup);

  // 4. Distant Shipyard Framework (太空船坞 - 巨兽的骨骼)
  const shipyardGeom = buildVoxelGeometry({
    size: [60, 24, 24],
    at(x, y, z) {
      // Giant structural scaffold ribs
      const isRib = x % 6 === 0 && (y === 0 || y === 23 || z === 0 || z === 23);
      const isLongeron = (y === 0 || y === 23) && (z === 0 || z === 23);
      if (isRib || isLongeron) return 0xd97706; // Industrial shipyard orange
      return null;
    },
  }, { voxel: 2.2, anchor: "center" });

  const shipyardMesh = new THREE.Mesh(shipyardGeom, voxelMaterial({ roughness: 0.7, metalness: 0.3 }));
  shipyardMesh.position.set(120, 45, -180);
  shipyardMesh.rotation.y = 0.5;
  shipyardMesh.rotation.x = 0.2;
  root.add(shipyardMesh);

  // 5. Starfield Dust (Blocky twinkling stars)
  const starCount = 350;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 350 + Math.random() * 150;
    starPositions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2,
    sizeAttenuation: false,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  root.add(starPoints);

  return root;
}

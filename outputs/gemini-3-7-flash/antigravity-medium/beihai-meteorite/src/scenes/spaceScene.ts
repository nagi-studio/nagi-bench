import * as THREE from "three";
import {
  buildVoxelGeometry,
  voxelMaterial,
  voxelSphere,
  type VoxelSource,
} from "@agentbench/voxel-kit";
import { buildAstronautFigure } from "../characters";
import { createPistolMesh, createSniperScopeMesh } from "../props";

export interface SpaceSceneHandle {
  root: THREE.Group;
  zhang: ReturnType<typeof buildAstronautFigure>;
  stationGroup: THREE.Group;
  stationWheel: THREE.Mesh;
  astronauts: ReturnType<typeof buildAstronautFigure>[];
  pistol: THREE.Mesh;
  scope: THREE.Mesh;
  muzzleSparks: THREE.Points;
  bulletTracers: THREE.LineSegments;
  impactGas: THREE.Points;
  bloodCrystals: THREE.Points;
  earthMesh: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  earthGlow: THREE.Mesh;
}

export function createSpaceScene(): SpaceSceneHandle {
  const root = new THREE.Group();
  root.name = "scene:synchronic-orbit";

  // 1. Deep Space Starfield (Voxel stars)
  const starCount = 360;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 80 + Math.random() * 40;
    starPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);

    const c = 0.7 + Math.random() * 0.3;
    starCol[i * 3 + 0] = c;
    starCol[i * 3 + 1] = c;
    starCol[i * 3 + 2] = c + (Math.random() - 0.5) * 0.15;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const stars = new THREE.Points(starGeo, starMat);
  root.add(stars);

  // 2. Voxel Earth Sphere (voxelSphere)
  const earthRadius = 18;
  const earthGeo = voxelSphere(earthRadius, (x, y, z) => {
    // Noise-based continents and clouds
    const nx = x / earthRadius;
    const ny = y / earthRadius;
    const nz = z / earthRadius;
    const cont = Math.sin(nx * 3.5 + nz * 2.5) + Math.cos(ny * 4.0);
    const cloud = Math.sin(nx * 6.0 + ny * 6.0 + nz * 4.0);

    if (cloud > 1.25) return 0xffffff; // White cloud swirl
    if (cont > 0.3) return 0x22c55e; // Green landmass
    if (cont > -0.1) return 0xb45309; // Desert / mountain brown
    return 0x1d4ed8; // Deep blue ocean
  }, { voxel: 0.8, anchor: "center" });

  const earthMesh = new THREE.Mesh(earthGeo, voxelMaterial({ roughness: 0.8, metalness: 0.1 }));
  earthMesh.position.set(0, -32, -45);
  root.add(earthMesh);

  // Earth Atmosphere Sunset Glow Arc (Golden orange sunset terminator)
  const glowGeo = new THREE.RingGeometry(18.2 * 0.8, 19.8 * 0.8, 36);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  });
  const earthGlow = new THREE.Mesh(glowGeo, glowMat);
  earthGlow.position.set(0, -32, -44.5);
  earthGlow.rotation.z = Math.PI / 4;
  root.add(earthGlow);

  // 3. Giant Wheel-Shaped Yellow River Space Station (黄河空间站)
  const stationGroup = new THREE.Group();
  stationGroup.name = "station:yellow-river";
  stationGroup.position.set(0, 4, -28); // 5km aesthetic distance
  root.add(stationGroup);

  // Outer Habitat Ring (Wheel)
  const wheelSource: VoxelSource = {
    size: [48, 8, 48],
    at(x, y, z) {
      const dx = x - 23.5;
      const dz = z - 23.5;
      const dist = Math.sqrt(dx * dx + dz * dz);
      // Ring with radius 20..24
      if (dist >= 19 && dist <= 24) {
        // Module seams & illuminated observation windows
        if ((x + z) % 6 === 0) return 0x38bdf8; // Blue window
        if ((x + z) % 12 === 0) return 0xe2e8f0; // White hull
        return 0x94a3b8; // Metallic grey panel
      }
      // 4 Connecting Spokes to Central Hub
      const onSpokeX = Math.abs(dx) <= 1.5 && dist < 20;
      const onSpokeZ = Math.abs(dz) <= 1.5 && dist < 20;
      if (onSpokeX || onSpokeZ) return 0x64748b;

      // Central Hub & Space Elevator passage
      if (dist <= 5) {
        if (dist <= 2) return 0x0f172a; // Hollow elevator shaft
        return 0xe2e8f0;
      }
      return null;
    },
  };
  const wheelGeo = buildVoxelGeometry(wheelSource, { voxel: 0.4, anchor: "center" });
  const stationWheel = new THREE.Mesh(wheelGeo, voxelMaterial({ roughness: 0.5, metalness: 0.4 }));
  stationWheel.rotation.x = Math.PI / 6;
  stationGroup.add(stationWheel);

  // Space Elevator Cable Ribbon passing through station center
  const cableSource: VoxelSource = {
    size: [2, 120, 2],
    at: () => 0x38bdf8,
  };
  const cableGeo = buildVoxelGeometry(cableSource, { voxel: 0.4, anchor: "center" });
  const cableMesh = new THREE.Mesh(cableGeo, voxelMaterial({ roughness: 0.2, metalness: 0.9 }));
  stationGroup.add(cableMesh);

  // Space Dock Construction Framework in distant background (Skeletal giant)
  const dockSource: VoxelSource = {
    size: [60, 30, 20],
    at(x, y, z) {
      // Truss beam skeleton
      const edgeX = x % 10 === 0;
      const edgeY = y % 10 === 0;
      const edgeZ = z % 10 === 0;
      if ((edgeX && edgeY) || (edgeY && edgeZ) || (edgeX && edgeZ)) {
        return 0xf59e0b; // Industrial hazard orange/yellow construction truss
      }
      return null;
    },
  };
  const dockGeo = buildVoxelGeometry(dockSource, { voxel: 0.6, anchor: "center" });
  const dockMesh = new THREE.Mesh(dockGeo, voxelMaterial({ roughness: 0.8, metalness: 0.5 }));
  dockMesh.position.set(25, 12, -55);
  dockMesh.rotation.y = -0.4;
  root.add(dockMesh);

  // 4. Spacewalking Officials & Photographers (~12 visible block figures outside airlock)
  const astronauts: ReturnType<typeof buildAstronautFigure>[] = [];
  const astronautGroup = new THREE.Group();
  astronautGroup.name = "group:spacewalkers";
  stationGroup.add(astronautGroup);

  for (let i = 0; i < 12; i++) {
    const astro = buildAstronautFigure(i);
    const row = Math.floor(i / 6); // 2 rows
    const col = (i % 6) - 2.5;
    astro.root.position.set(col * 1.2, 2.5 - row * 1.4, 8.5);
    astro.root.scale.setScalar(0.7);
    astronautGroup.add(astro.root);
    astronauts.push(astro);
  }

  // 5. Zhang Beihai Sniper Figure (Floating at origin / front)
  const zhang = buildAstronautFigure(99);
  zhang.root.position.set(0, -0.4, 2.0);
  zhang.root.rotation.y = Math.PI; // Facing toward station (-Z)
  root.add(zhang.root);

  const pistol = createPistolMesh();
  zhang.anchors.handR.add(pistol);

  const scope = createSniperScopeMesh();
  pistol.add(scope);

  // 6. Visual Effects:
  // (a) Muzzle Flash Sparks (30 shots)
  const muzzleCount = 30;
  const muzzleGeo = new THREE.BufferGeometry();
  const muzzlePos = new Float32Array(muzzleCount * 3);
  for (let i = 0; i < muzzleCount; i++) {
    muzzlePos[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
    muzzlePos[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
    muzzlePos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  muzzleGeo.setAttribute("position", new THREE.BufferAttribute(muzzlePos, 3));
  const muzzleMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.18,
    transparent: true,
    opacity: 0,
  });
  const muzzleSparks = new THREE.Points(muzzleGeo, muzzleMat);
  muzzleSparks.position.set(0, 0.4, 1.2);
  root.add(muzzleSparks);

  // (b) Bullet Trajectory Line Segments
  const tracerCount = 15;
  const tracerPos = new Float32Array(tracerCount * 6);
  for (let i = 0; i < tracerCount; i++) {
    const idx = i * 6;
    tracerPos[idx + 0] = (Math.random() - 0.5) * 0.3;
    tracerPos[idx + 1] = (Math.random() - 0.5) * 0.3;
    tracerPos[idx + 2] = 2.0;
    tracerPos[idx + 3] = (Math.random() - 0.5) * 2.0;
    tracerPos[idx + 4] = 4.0 + (Math.random() - 0.5) * 1.5;
    tracerPos[idx + 5] = -20.0;
  }
  const tracerGeo = new THREE.BufferGeometry();
  tracerGeo.setAttribute("position", new THREE.BufferAttribute(tracerPos, 3));
  const tracerMat = new THREE.LineBasicMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0,
  });
  const bulletTracers = new THREE.LineSegments(tracerGeo, tracerMat);
  root.add(bulletTracers);

  // (c) Venting Gas & Frozen Blood Ice Crystal Particles
  const gasCount = 80;
  const gasGeo = new THREE.BufferGeometry();
  const gasPos = new Float32Array(gasCount * 3);
  for (let i = 0; i < gasCount; i++) {
    gasPos[i * 3 + 0] = (Math.random() - 0.5) * 2.5;
    gasPos[i * 3 + 1] = (Math.random() - 0.5) * 2.5 + 4.0;
    gasPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5 - 20.0;
  }
  gasGeo.setAttribute("position", new THREE.BufferAttribute(gasPos, 3));
  const gasMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.35,
    transparent: true,
    opacity: 0,
  });
  const impactGas = new THREE.Points(gasGeo, gasMat);
  root.add(impactGas);

  const bloodCount = 60;
  const bloodGeo = new THREE.BufferGeometry();
  const bloodPos = new Float32Array(bloodCount * 3);
  for (let i = 0; i < bloodCount; i++) {
    bloodPos[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
    bloodPos[i * 3 + 1] = (Math.random() - 0.5) * 1.5 + 4.0;
    bloodPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5 - 20.0;
  }
  bloodGeo.setAttribute("position", new THREE.BufferAttribute(bloodPos, 3));
  const bloodMat = new THREE.PointsMaterial({
    color: 0xef4444, // Crimson blood crystals
    size: 0.25,
    transparent: true,
    opacity: 0,
  });
  const bloodCrystals = new THREE.Points(bloodGeo, bloodMat);
  root.add(bloodCrystals);

  // 7. Space Lighting: Fiery low sunset sun on Earth's rim + deep black shadows
  const ambient = new THREE.AmbientLight(0x0f172a, 0.35);
  root.add(ambient);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 2.8);
  sunLight.position.set(-15, -12, -30);
  sunLight.target.position.set(0, 0, 0);
  root.add(sunLight);
  root.add(sunLight.target);

  return {
    root,
    zhang,
    stationGroup,
    stationWheel,
    astronauts,
    pistol,
    scope,
    muzzleSparks,
    bulletTracers,
    impactGas,
    bloodCrystals,
    earthMesh,
    sunLight,
    earthGlow,
  };
}

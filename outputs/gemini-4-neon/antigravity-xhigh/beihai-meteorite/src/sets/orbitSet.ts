import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";
import type { OrbitalAstronaut } from "../characters/cast";
import { createMagazineMesh, createMeteoriteSlugMesh, createScopeMesh } from "../props/voxelProps";

export interface OrbitSet {
  root: THREE.Group;
  earthGroup: THREE.Group;
  sunGroup: THREE.Group;
  sunLight: THREE.DirectionalLight;
  earthBounceLight: THREE.DirectionalLight;
  stationHeroGroup: THREE.Group;
  stationWheel: THREE.Group;
  airlockDoorL: THREE.Mesh;
  airlockDoorR: THREE.Mesh;
  airlockBeaconMat: THREE.MeshBasicMaterial;
  spaceDockGroup: THREE.Group;
  floatingScope: THREE.Mesh;
  floatingGlove: THREE.Mesh;
  spentMags: THREE.Mesh[];
  heroBulletsGroup: THREE.Group;
  zhangMuzzleFlash: THREE.Group;
  zhangMuzzleLight: THREE.PointLight;
  zhangThrusterPlumes: THREE.Group;
  crewGroup: THREE.Group;
  crew: OrbitalAstronaut[];
  update(params: {
    time: number;
    sunDrop: number; // 0 = high above Earth rim, 0.5 = half dipped (diamond ring!), 0.85 = nearly set
    airlockGreen: boolean;
    airlockOpen: number; // 0..1
    muzzleFlash: number; // 0..1
    muzzleWorldPos?: THREE.Vector3;
    zhangThrust: number; // 0..1
    zhangPos: THREE.Vector3;
    zhangQuat: THREE.Quaternion;
    impactTime: number; // < 0 before impact, >= 0 seconds since impact at t = 234.0s
    evacProgress: number; // 0..1 crew rushing back to airlock
    heroBulletProgress: number; // < 0 hidden, 0..1 flying across frame in Shot 16
  }): void;
}

function hash3(x: number, y: number, z: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 0.21 + z * 0.17) * 0.45 +
    Math.cos(y * 0.29 - x * 0.19) * 0.35 +
    Math.sin((x + y + z) * 0.14) * 0.25
  );
}

/** Build the iconic Yellow River Space Station rotating wheel counterweight in crisp voxels. */
function createYellowRiverWheel(): THREE.Group {
  const wheel = new THREE.Group();
  const mat = voxelMaterial({ roughness: 0.55, metalness: 0.45 });

  // Outer rotating wheel ring + 6 spokes + central hub
  const ringRadius = 18;
  const wheelGeo = buildVoxelGeometry(
    {
      size: [41, 41, 7],
      at(x, y, z) {
        const dx = x - 20;
        const dy = y - 20;
        const dz = z - 3;
        const r = Math.sqrt(dx * dx + dy * dy);

        // Central docking hub
        if (r <= 4.2 && Math.abs(dz) <= 3) {
          if (Math.abs(dz) === 3 && r < 2.2) return 0x4bc5e8;
          return (x + y) % 2 === 0 ? 0xb8c4d1 : 0x8e9bab;
        }
        // 6 structural spokes
        const angle = Math.atan2(dy, dx);
        const spokeDist = Math.abs(Math.sin(angle * 3)) * r;
        if (r > 3.5 && r < ringRadius && spokeDist < 0.85 && Math.abs(dz) <= 1) {
          return (Math.floor(r) % 3 === 0) ? 0x677688 : 0x9aa8b8;
        }
        // Main toroidal habitation wheel rim
        if (r >= ringRadius - 2.2 && r <= ringRadius + 1.6 && Math.abs(dz) <= 2) {
          if (Math.abs(dz) === 2 && (Math.abs(dx) + Math.abs(dy)) % 4 === 0) {
            return 0xffe09e; // warm illuminated station viewport windows!
          }
          if (r > ringRadius + 0.8) return 0x6f7e90;
          return (x + y) % 5 === 0 ? 0xa3b0bf : 0xd5dee8;
        }
        return null;
      },
    },
    { voxel: 1.55 },
  );
  const wheelMesh = new THREE.Mesh(wheelGeo, mat);
  wheel.add(wheelMesh);

  // Solar radiator wings protruding from central axle
  const wingGeo = buildVoxelGeometry(
    {
      size: [3, 22, 10],
      at(x, y, z) {
        if (y === 10 || y === 11) return 0x7b8999;
        if (x === 1 && z % 2 === 0) return 0x224a85;
        return 0x1a3866;
      },
    },
    { voxel: 1.4 },
  );
  const wingL = new THREE.Mesh(wingGeo, mat);
  wingL.position.set(0, 0, -14);
  wheel.add(wingL);

  return wheel;
}

/** Build the colossal unfinished skeletal Space Dock ("like the bones of a giant beast"). */
function createSpaceDockSkeleton(): THREE.Group {
  const dock = new THREE.Group();
  const mat = voxelMaterial({ roughness: 0.62, metalness: 0.55 });

  const geo = buildVoxelGeometry(
    {
      size: [36, 16, 16],
      at(x, y, z) {
        // Longitudinal keel spines
        const onCorner =
          (y === 0 || y === 15) && (z === 0 || z === 15);
        const onMidSpine =
          (y === 7 || y === 8) && (z === 0 || z === 15);
        // Periodic giant skeletal rib cages every 5 voxels
        const onRib =
          x % 5 === 0 &&
          (y === 0 || y === 15 || z === 0 || z === 15);
        if (onCorner || onMidSpine || onRib) {
          return x % 10 === 0 ? 0xd99b38 : 0x566475; // occasional amber construction frame markers
        }
        return null;
      },
    },
    { voxel: 2.2 },
  );
  dock.add(new THREE.Mesh(geo, mat));

  // Tiny amber orbital warning lights along the skeletal dock ribs
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffaa3b });
  for (let i = -3; i <= 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), beaconMat);
    b.position.set(i * 11, 17, 17);
    dock.add(b);
  }
  return dock;
}

export function createOrbitSet(crew: OrbitalAstronaut[]): OrbitSet {
  const root = new THREE.Group();
  root.name = "set:orbit";
  root.visible = false;

  // =========================================================================
  // 1. DEEP VOXEL STARFIELD (1,600 crisp tiny cubic stars)
  // =========================================================================
  const starCount = 1600;
  const starGeo = new THREE.BoxGeometry(1, 1, 1);
  const starMesh = new THREE.InstancedMesh(
    starGeo,
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    starCount,
  );
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const starPalette = [0xffffff, 0xd8ecff, 0xffe8c4, 0xb8d4ff, 0xfff5e0];
  for (let i = 0; i < starCount; i++) {
    const u = hash3(i, 1, 7);
    const v = hash3(i, 3, 13);
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const dist = 420 + hash3(i, 9, 2) * 180;
    dummy.position.set(
      dist * Math.sin(phi) * Math.cos(theta),
      dist * Math.cos(phi),
      dist * Math.sin(phi) * Math.sin(theta),
    );
    const s = 0.45 + Math.pow(hash3(i, 5, 19), 3) * 1.65;
    dummy.scale.setScalar(s);
    dummy.rotation.set(u * 3, v * 3, 0);
    dummy.updateMatrix();
    starMesh.setMatrixAt(i, dummy.matrix);
    color.setHex(starPalette[i % starPalette.length]!);
    starMesh.setColorAt(i, color);
  }
  starMesh.instanceMatrix.needsUpdate = true;
  if (starMesh.instanceColor) starMesh.instanceColor.needsUpdate = true;
  root.add(starMesh);

  // =========================================================================
  // 2. COLOSSAL VOXEL EARTH (Half deep sapphire, half blazing sunset orange + pink feather clouds!)
  // =========================================================================
  const earthGroup = new THREE.Group();
  earthGroup.position.set(-18, -118, -195);

  const earthGeo = voxelSphere(
    26,
    (x, y, z) => {
      const cx = x - 26;
      const cy = y - 26;
      const cz = z - 26;
      const lat = Math.abs(cy) / 26;
      if (lat > 0.85) return 0xe8f0f7; // polar ice cap
      const continent = fbm(cx * 0.52, cy * 0.52, cz * 0.52);
      // Sunset tangerine glint along the sunlit upper-back rim!
      const rimSun = cy > 11 && cz < 6;
      if (continent > 0.24) {
        if (rimSun) return continent > 0.42 ? 0xd98a52 : 0x8f6b47;
        return continent > 0.44 ? 0x6e8554 : 0x3b6e4c;
      }
      // Deep sapphire ocean shifting to sunset mirror-tangerine near horizon!
      if (rimSun && cx > -6 && cx < 14) return 0xe67e3e;
      if (cy > 6 && cz < 10) return 0x2b5d9e;
      return 0x16386b;
    },
    { voxel: 4.1 },
  );
  const earthMesh = new THREE.Mesh(
    earthGeo,
    voxelMaterial({ roughness: 0.86, metalness: 0.08 }),
  );
  earthGroup.add(earthMesh);

  // Outer hollow Voxel Cloud Shell ("pink feather clouds" catching sunset!)
  const cloudGeo = voxelSphere(
    28,
    (x, y, z, distNorm) => {
      if (distNorm < 0.945) return null;
      const cx = x - 28;
      const cy = y - 28;
      const cz = z - 28;
      const wisp = fbm(cx * 0.72 + 12, cy * 0.9, cz * 0.72 - 5);
      if (wisp < 0.28) return null;
      // Sunset-soaked pink feather clouds near Earth's sunlit rim!
      if (cy > 8 && cz < 8) return 0xf7b29c;
      return 0xedf4fa;
    },
    { voxel: 4.02 },
  );
  const cloudMesh = new THREE.Mesh(
    cloudGeo,
    voxelMaterial({ roughness: 1, transparent: true, opacity: 0.82 }),
  );
  earthGroup.add(cloudMesh);
  root.add(earthGroup);

  // =========================================================================
  // 3. VOXEL SUN & BLAZING SOLAR RING CORONA (sinks behind Earth's rim!)
  // =========================================================================
  const sunGroup = new THREE.Group();
  const sunCore = new THREE.Mesh(
    voxelSphere(5, 0xfff8dc, { voxel: 1.9 }),
    new THREE.MeshBasicMaterial({ color: 0xfff9e2 }),
  );
  sunGroup.add(sunCore);

  const sunCorona = new THREE.Mesh(
    voxelSphere(7, 0xffaa44, { voxel: 2.15 }),
    new THREE.MeshBasicMaterial({
      color: 0xffa63d,
      transparent: true,
      opacity: 0.34,
    }),
  );
  sunGroup.add(sunCorona);

  const sunOuterHalo = new THREE.Mesh(
    voxelSphere(9, 0xff6e2b, { voxel: 2.4 }),
    new THREE.MeshBasicMaterial({
      color: 0xff6d2a,
      transparent: true,
      opacity: 0.14,
    }),
  );
  sunGroup.add(sunOuterHalo);
  root.add(sunGroup);

  // =========================================================================
  // 4. YELLOW RIVER SPACE STATION + SPACE ELEVATOR TETHER + HERO AIRLOCK
  // =========================================================================
  const stationHeroGroup = new THREE.Group();
  // Positioned across the orbital void along -Z so Zhang Beihai aims down -Z toward the station!
  stationHeroGroup.position.set(0, 2, -135);

  const stationWheel = createYellowRiverWheel();
  stationWheel.position.set(0, 14, -28);
  stationHeroGroup.add(stationWheel);

  // Vertical Space Elevator Tether plunging down toward Earth!
  const tether = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 280, 0.55),
    new THREE.MeshBasicMaterial({ color: 0x99b4cc }),
  );
  tether.position.set(0, -110, -28);
  stationHeroGroup.add(tether);

  // Detailed Hero Airlock Bulkhead facing +Z (where the 25 astronauts exit for the group photo!)
  const bulkheadMat = voxelMaterial({ roughness: 0.6, metalness: 0.45 });
  const bulkheadGeo = buildVoxelGeometry(
    {
      size: [36, 20, 4],
      at(x, y, z) {
        // Circular/octagonal airlock doorway cutout in center (x: 14..21, y: 6..13)
        const dx = x - 17.5;
        const dy = y - 9.5;
        if (Math.sqrt(dx * dx + dy * dy) < 4.1) return null;
        // Yellow-black hazard border around hatch frame
        if (Math.sqrt(dx * dx + dy * dy) < 5.1 && z === 3) {
          return (x + y) % 2 === 0 ? 0xd9a832 : 0x262c34;
        }
        // Hull panel seams
        if (x % 6 === 0 || y % 5 === 0) return 0x647385;
        return (x + y) % 7 === 0 ? 0xb4c0ce : 0xcbd5e0;
      },
    },
    { voxel: 0.65 },
  );
  const bulkhead = new THREE.Mesh(bulkheadGeo, bulkheadMat);
  bulkhead.position.set(0, 0, -10);
  stationHeroGroup.add(bulkhead);

  // Dark interior airlock chamber behind sliding doors
  const airlockChamber = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 6.2, 5.0),
    voxelMaterial({ color: 0x161e29, roughness: 0.9 }),
  );
  airlockChamber.position.set(0, 0, -13.5);
  stationHeroGroup.add(airlockChamber);

  const airlockInteriorLight = new THREE.PointLight(0x88d4ff, 2.5, 16, 1.4);
  airlockInteriorLight.position.set(0, 0.5, -11.2);
  stationHeroGroup.add(airlockInteriorLight);

  // Two sliding voxel airlock doors
  const doorGeo = buildVoxelGeometry(
    {
      size: [4, 8, 2],
      at(x, y, _z) {
        if (x === 0 || x === 3) return 0x455161;
        return y % 3 === 0 ? 0x6f7e90 : 0x9aa8b8;
      },
    },
    { voxel: 0.66 },
  );
  const airlockDoorL = new THREE.Mesh(doorGeo, bulkheadMat);
  const airlockDoorR = new THREE.Mesh(doorGeo, bulkheadMat);
  airlockDoorL.position.set(-1.35, 0, -9.4);
  airlockDoorR.position.set(1.35, 0, -9.4);
  stationHeroGroup.add(airlockDoorL, airlockDoorR);

  // Iconic Airlock Status Beacon (switches RED -> GREEN when transition chamber is vacuumed!)
  const airlockBeaconMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
  const airlockBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.45), airlockBeaconMat);
  airlockBeacon.position.set(4.5, 2.4, -8.5);
  stationHeroGroup.add(airlockBeacon);

  root.add(stationHeroGroup);

  // =========================================================================
  // 5. UNFINISHED SPACE DOCK LEVIATHAN & DISTANT BASE ONE
  // =========================================================================
  const spaceDockGroup = createSpaceDockSkeleton();
  spaceDockGroup.position.set(-92, 34, -210);
  spaceDockGroup.rotation.set(0.18, 0.42, -0.14);
  root.add(spaceDockGroup);

  // Distant Base One pinprick in the opposite sky (+Z/+X)
  const baseOne = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshBasicMaterial({ color: 0xb8e6ff }),
  );
  baseOne.position.set(95, 42, 165);
  root.add(baseOne);

  // =========================================================================
  // 6. GROUP PHOTO ASTRONAUT FORMATION (25 Voxel Kit Figures!)
  // =========================================================================
  const crewGroup = new THREE.Group();
  // Positioned right in front of Yellow River Station's airlock
  crewGroup.position.set(0, 2, -124);
  for (const member of crew) {
    crewGroup.add(member.figure.root);
  }
  root.add(crewGroup);

  // =========================================================================
  // 7. ORBITAL MICRO-PROPS & DETERMINISTIC EFFECTS
  // =========================================================================
  // Floating free scope & removed EVA glove during Shot 14
  const floatingScope = createScopeMesh(0.022);
  floatingScope.visible = false;
  root.add(floatingScope);

  const floatingGlove = new THREE.Mesh(
    buildVoxelGeometry(
      {
        size: [4, 4, 5],
        at(_x, _y, z) {
          return z === 0 ? 0x9aa6b5 : 0x566273;
        },
      },
      { voxel: 0.032 },
    ),
    voxelMaterial({ roughness: 0.7 }),
  );
  floatingGlove.visible = false;
  root.add(floatingGlove);

  // Two tumbling spent magazines drifting away in zero-G during Shot 15
  const spentMags = [createMagazineMesh(false, 0.02), createMagazineMesh(false, 0.02)];
  for (const m of spentMags) {
    m.visible = false;
    root.add(m);
  }

  // Zhang Beihai silent vacuum muzzle flash ("a lone firefly against the abyss")
  const zhangMuzzleFlash = new THREE.Group();
  zhangMuzzleFlash.visible = false;
  const fCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xfff7d1 }),
  );
  const fCrossA = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.04, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xffb347 }),
  );
  const fCrossB = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.22, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xffb347 }),
  );
  zhangMuzzleFlash.add(fCore, fCrossA, fCrossB);
  root.add(zhangMuzzleFlash);

  const zhangMuzzleLight = new THREE.PointLight(0xffb84d, 0, 7, 1.8);
  root.add(zhangMuzzleLight);

  // Zhang Beihai twin backpack cold-gas thruster vapor plumes (Shot 18/19!)
  const zhangThrusterPlumes = new THREE.Group();
  const plumeCount = 36;
  const zhangPlumeInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.14),
    new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.6 }),
    plumeCount,
  );
  zhangThrusterPlumes.add(zhangPlumeInst);
  root.add(zhangThrusterPlumes);

  // Shot 16 Hero Flying Meteorite Bullets (tight gleaming swarm slicing straight across void!)
  const heroBulletsGroup = new THREE.Group();
  heroBulletsGroup.visible = false;
  const bulletMat = voxelMaterial({ color: 0x9aa8ba, roughness: 0.3, metalness: 0.85 });
  const glintMat = new THREE.MeshBasicMaterial({
    color: 0xffdf9e,
    transparent: true,
    opacity: 0.45,
  });
  for (let i = 0; i < 12; i++) {
    const slug = createMeteoriteSlugMesh(0.022, 7);
    slug.material = bulletMat;
    slug.rotation.x = -Math.PI / 2;
    const ox = ((i % 4) - 1.5) * 0.28 + Math.sin(i * 3.1) * 0.08;
    const oy = (Math.floor(i / 4) - 1) * 0.22 + Math.cos(i * 2.7) * 0.06;
    const oz = -i * 1.15;
    slug.position.set(ox, oy, oz);
    heroBulletsGroup.add(slug);

    // Thin sunlit motion-glint streak behind each meteorite bullet
    const trail = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 2.2), glintMat);
    trail.position.set(ox, oy, oz + 1.25);
    heroBulletsGroup.add(trail);
  }
  root.add(heroBulletsGroup);

  // Shot 17 Pressurized White Suit-Gas Geysers & Backpack Explosion Cloud!
  const vaporCount = 220;
  const vaporMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.095, 0.095, 0.095),
    new THREE.MeshBasicMaterial({ color: 0xf0f7ff, transparent: true, opacity: 0.68 }),
    vaporCount,
  );
  vaporMesh.visible = false;
  crewGroup.add(vaporMesh);

  // Shot 17 Frozen Crimson Blood-Snow Ice Crystals glittering in sunset!
  const bloodCount = 150;
  const bloodMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.044, 0.044, 0.044),
    new THREE.MeshBasicMaterial({ color: 0xf22e42 }),
    bloodCount,
  );
  bloodMesh.visible = false;
  crewGroup.add(bloodMesh);

  // Crew Evacuation White Thruster Trails
  const evacPlumeCount = 140;
  const evacPlumeMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.16, 0.16, 0.28),
    new THREE.MeshBasicMaterial({ color: 0xe6f4ff, transparent: true, opacity: 0.56 }),
    evacPlumeCount,
  );
  evacPlumeMesh.visible = false;
  crewGroup.add(evacPlumeMesh);

  // =========================================================================
  // 8. HIGH-CONTRAST ORBITAL CINEMATIC LIGHTING (Solar Rim + Earth Bounce!)
  // =========================================================================
  const spaceAmbient = new THREE.AmbientLight(0x18253d, 0.36);
  root.add(spaceAmbient);

  // Blazing directional Sun shifting from white to sunset amber as sun dips!
  const sunLight = new THREE.DirectionalLight(0xfff0d4, 3.6);
  sunLight.position.set(-14, 32, -160);
  root.add(sunLight);

  // Luminous sapphire-and-orange Earthshine bounce light from below!
  const earthBounceLight = new THREE.DirectionalLight(0x5292e6, 1.35);
  earthBounceLight.position.set(-10, -80, -40);
  root.add(earthBounceLight);

  // Subtle rim light behind Zhang Beihai for silhouette separation against pitch-black cosmos
  const rimLight = new THREE.DirectionalLight(0x88c4ff, 0.85);
  rimLight.position.set(22, 18, 40);
  root.add(rimLight);

  const tmpColor = new THREE.Color();
  const sunHighColor = new THREE.Color(0xfff2d9);
  const sunSunsetColor = new THREE.Color(0xff8436);
  const earthBlue = new THREE.Color(0x4786db);
  const earthSunset = new THREE.Color(0xe67a45);

  return {
    root,
    earthGroup,
    sunGroup,
    sunLight,
    earthBounceLight,
    stationHeroGroup,
    stationWheel,
    airlockDoorL,
    airlockDoorR,
    airlockBeaconMat,
    spaceDockGroup,
    floatingScope,
    floatingGlove,
    spentMags,
    heroBulletsGroup,
    zhangMuzzleFlash,
    zhangMuzzleLight,
    zhangThrusterPlumes,
    crewGroup,
    crew,
    update(params) {
      const {
        time,
        sunDrop,
        airlockGreen,
        airlockOpen,
        muzzleFlash,
        muzzleWorldPos,
        zhangThrust,
        zhangPos,
        zhangQuat,
        impactTime,
        evacProgress,
        heroBulletProgress,
      } = params;

      // Gentle cosmic rotation of Earth & Yellow River Space Station wheel
      earthGroup.rotation.y = time * 0.004;
      cloudMesh.rotation.y = time * 0.0065;
      stationWheel.rotation.z = time * 0.095;

      // Sun smoothly descends into Earth's upper horizon -> diamond-ring sunset!
      // Offset cleanly left-of-station so the blinding solar ring shines unobstructed beside Yellow River Station!
      const sunY = 38 - sunDrop * 44;
      sunGroup.position.set(-48, sunY, -285);
      sunLight.position.set(-48, sunY + 12, -160);
      tmpColor.copy(sunHighColor).lerp(sunSunsetColor, Math.min(1, sunDrop * 1.15));
      sunLight.color.copy(tmpColor);
      sunLight.intensity = 3.7 - sunDrop * 1.1;

      tmpColor.copy(earthBlue).lerp(earthSunset, Math.min(1, sunDrop * 0.72));
      earthBounceLight.color.copy(tmpColor);

      // Airlock beacon & sliding hatch doors
      airlockBeaconMat.color.setHex(airlockGreen ? 0x2eff88 : 0xff3b30);
      airlockDoorL.position.x = -1.35 - airlockOpen * 2.55;
      airlockDoorR.position.x = 1.35 + airlockOpen * 2.55;

      // Zhang Beihai silent vacuum muzzle flash
      zhangMuzzleFlash.visible = muzzleFlash > 0.05;
      if (muzzleWorldPos) {
        zhangMuzzleFlash.position.copy(muzzleWorldPos);
        zhangMuzzleLight.position.copy(muzzleWorldPos);
      }
      zhangMuzzleFlash.scale.setScalar(0.55 + muzzleFlash * 0.85);
      zhangMuzzleFlash.rotation.z = time * 55;
      zhangMuzzleLight.intensity = muzzleFlash * 9.0;

      // Zhang Beihai backpack thruster plumes
      zhangThrusterPlumes.visible = zhangThrust > 0.02;
      if (zhangThrust > 0.02) {
        zhangThrusterPlumes.position.copy(zhangPos);
        zhangThrusterPlumes.quaternion.copy(zhangQuat);
        for (let i = 0; i < plumeCount; i++) {
          const nozzleX = i % 2 === 0 ? -0.15 : 0.15;
          const phase = ((time * 3.4 + (i / plumeCount)) % 1);
          const spread = phase * 0.24 * zhangThrust;
          dummy.position.set(
            nozzleX + Math.sin(i * 4.1) * spread,
            1.02 + Math.cos(i * 3.7) * spread,
            -0.38 - phase * 2.6 * zhangThrust,
          );
          dummy.rotation.set(phase * 2, i, 0);
          const sc = (1 - phase) * (0.45 + 0.9 * zhangThrust);
          dummy.scale.setScalar(Math.max(0.02, sc));
          dummy.updateMatrix();
          zhangPlumeInst.setMatrixAt(i, dummy.matrix);
        }
        zhangPlumeInst.instanceMatrix.needsUpdate = true;
      }

      // Shot 16 Hero Flying Meteorite Bullets
      heroBulletsGroup.visible = heroBulletProgress >= 0 && heroBulletProgress <= 1;
      if (heroBulletsGroup.visible) {
        heroBulletsGroup.position.set(0, 1.4, -18 - heroBulletProgress * 74);
      }

      // Shot 17 Pressurized Vapor Geysers & Frozen Crimson Blood-Snow Crystals!
      const showImpact = impactTime >= 0;
      vaporMesh.visible = showImpact;
      bloodMesh.visible = showImpact;
      if (showImpact) {
        // Locate the 5 struck astronauts in crewGroup space
        const struck = crew.filter(
          (c) =>
            c.role === "leaderA" ||
            c.role === "leaderB" ||
            c.role === "leaderC" ||
            c.role === "bystanderHit",
        );

        // Pressurized white vapor spraying violently from suits + huge backpack explosion between row 1 & 2!
        for (let i = 0; i < vaporCount; i++) {
          const isBackpackBlast = i >= 125;
          if (isBackpackBlast) {
            const blastAge = Math.max(0, impactTime - 0.55);
            const idx = i - 125;
            const s = idx * 19.7;
            const theta = hash3(idx, 1, 2) * Math.PI * 2;
            const phi = hash3(idx, 3, 4) * Math.PI;
            const speed = 0.6 + hash3(idx, 5, 6) * 2.2;
            const r = Math.min(5.2, blastAge * speed);
            dummy.position.set(
              0.2 + Math.sin(phi) * Math.cos(theta) * r,
              0.5 + Math.cos(phi) * r * 0.75,
              -0.8 + Math.sin(phi) * Math.sin(theta) * r,
            );
            const fade = Math.max(0.05, 1 - blastAge * 0.065);
            const sc = blastAge <= 0 ? 0.001 : (0.7 + Math.min(2.4, blastAge * 0.45)) * fade;
            dummy.rotation.set(s, time * 0.5 + s, 0);
            dummy.scale.setScalar(sc);
          } else {
            const target = struck[i % struck.length]!;
            const hitDelay = (i % struck.length) * 0.18;
            const age = Math.max(0, impactTime - hitDelay);
            const phase = (age * 1.4 + (i * 0.17)) % 1.4;
            // Vent sideways & downward from chest/shoulder breaches so Leader A's shattered visor reads cleanly!
            const sideSign = i % 2 === 0 ? 1 : -1;
            const dirX = sideSign * (0.45 + Math.abs(Math.sin(i * 7.3)) * 0.65);
            const dirY = -0.18 + Math.cos(i * 5.1) * 0.35;
            const dirZ = 0.35 + Math.sin(i * 2.9) * 0.25;
            dummy.position.set(
              target.figure.root.position.x + dirX * phase * 1.55,
              target.figure.root.position.y + 0.96 + dirY * phase * 1.1,
              target.figure.root.position.z + dirZ * phase * 1.25,
            );
            const sc = age <= 0 ? 0.001 : Math.max(0.04, (1.4 - phase) * 0.85);
            dummy.rotation.set(phase * 3, i, 0);
            dummy.scale.setScalar(sc);
          }
          dummy.updateMatrix();
          vaporMesh.setMatrixAt(i, dummy.matrix);
        }
        vaporMesh.instanceMatrix.needsUpdate = true;

        // Frozen crimson blood-snow crystals venting out & glittering in sunset light!
        const centerLeader = crew.find((c) => c.role === "leaderA")!;
        for (let i = 0; i < bloodCount; i++) {
          const origin = i % 3 === 0 ? centerLeader : struck[i % struck.length]!;
          const age = Math.max(0, impactTime - 0.35);
          const s = i * 11.3;
          const vx = (hash3(i, 2, 9) - 0.5) * 1.65;
          const vy = (hash3(i, 4, 7) - 0.35) * 1.45;
          const vz = 0.35 + hash3(i, 6, 5) * 1.55;
          const travel = Math.min(3.8, age * 0.48);
          dummy.position.set(
            origin.figure.root.position.x + vx * travel,
            origin.figure.root.position.y + 1.45 + vy * travel,
            origin.figure.root.position.z + 0.18 + vz * travel,
          );
          dummy.rotation.set(time * 1.8 + s, time * 1.4 + s, s);
          const twinkle = 0.65 + 0.45 * Math.sin(time * 7 + s);
          dummy.scale.setScalar(age <= 0 ? 0.001 : twinkle);
          dummy.updateMatrix();
          bloodMesh.setMatrixAt(i, dummy.matrix);
        }
        bloodMesh.instanceMatrix.needsUpdate = true;
      }

      // Panicked crew full-power thruster streaks returning to Yellow River airlock!
      evacPlumeMesh.visible = evacProgress > 0.01 && evacProgress < 0.98;
      if (evacPlumeMesh.visible) {
        for (let i = 0; i < evacPlumeCount; i++) {
          const member = crew[i % crew.length]!;
          const phase = ((time * 3.8 + i * 0.09) % 1);
          dummy.position.set(
            member.figure.root.position.x + Math.sin(i * 3.1) * 0.25,
            member.figure.root.position.y + 1.0 + Math.cos(i * 2.3) * 0.25,
            member.figure.root.position.z + 0.6 + phase * 3.4,
          );
          dummy.rotation.set(0, 0, i);
          const sc = (1 - phase) * 1.15;
          dummy.scale.setScalar(Math.max(0.02, sc));
          dummy.updateMatrix();
          evacPlumeMesh.setMatrixAt(i, dummy.matrix);
        }
        evacPlumeMesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

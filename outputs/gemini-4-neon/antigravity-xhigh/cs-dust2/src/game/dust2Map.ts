import * as THREE from 'three';
import { AABB, BombsiteZone, CalloutZone, RampBox, Vec3 } from './types';
import { createDust2Textures, Dust2Textures } from './textures';

export interface MinimapRect {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  kind: 'wall' | 'crate' | 'elevated' | 'tunnel' | 'door' | 'ramp' | 'site';
}

export interface Dust2MapData {
  group: THREE.Group;
  colliders: AABB[];
  ramps: RampBox[];
  bombsites: BombsiteZone[];
  callouts: CalloutZone[];
  spawnsCT: Vec3[];
  spawnsT: Vec3[];
  minimapRects: MinimapRect[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export function buildDust2Map(): Dust2MapData {
  const group = new THREE.Group();
  const colliders: AABB[] = [];
  const ramps: RampBox[] = [];
  const minimapRects: MinimapRect[] = [];
  const tex: Dust2Textures = createDust2Textures();

  // Shared materials
  const matGround = new THREE.MeshStandardMaterial({
    map: tex.sandGround,
    roughness: 0.94,
    metalness: 0.02,
  });

  const makeWallMat = (w: number, h: number, tunnel = false) => {
    const t = (tunnel ? tex.tunnelStone : tex.sandstoneWall).clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(Math.max(1, w / 5), Math.max(1, h / 5));
    return new THREE.MeshStandardMaterial({
      map: t,
      roughness: 0.88,
      metalness: 0.03,
    });
  };

  const matTrim = new THREE.MeshStandardMaterial({
    map: tex.sandstoneTrim,
    roughness: 0.9,
  });

  const matCrateWood = new THREE.MeshStandardMaterial({
    map: tex.woodCrate,
    roughness: 0.82,
  });

  const matCrateMil = new THREE.MeshStandardMaterial({
    map: tex.militaryCrate,
    roughness: 0.68,
    metalness: 0.25,
  });

  const matMidDoor = new THREE.MeshStandardMaterial({
    map: tex.midDoorWood,
    roughness: 0.78,
    metalness: 0.12,
  });

  const matBlueMetal = new THREE.MeshStandardMaterial({
    map: tex.blueMetal,
    roughness: 0.55,
    metalness: 0.45,
  });

  const matDarkMetal = new THREE.MeshStandardMaterial({
    color: 0x3b4046,
    roughness: 0.5,
    metalness: 0.6,
  });

  const matRamp = new THREE.MeshStandardMaterial({
    map: tex.stairsTex,
    roughness: 0.9,
  });

  // Helper: add solid AABB + visual mesh
  const addBox = (
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    opts: {
      material?: AABB['material'];
      customMat?: THREE.Material;
      tunnel?: boolean;
      mapKind?: MinimapRect['kind'] | null;
      castShadow?: boolean;
      receiveShadow?: boolean;
      blocksVision?: boolean;
      trimCap?: boolean;
    } = {}
  ) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    const w = maxX - minX;
    const h = maxY - minY;
    const d = maxZ - minZ;

    colliders.push({
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
      material: opts.material ?? 'sandstone',
      blocksVision: opts.blocksVision ?? true,
    });

    const span = Math.max(w, d);
    const mat =
      opts.customMat ??
      (opts.material === 'crate'
        ? matCrateWood
        : opts.material === 'door'
        ? matMidDoor
        : opts.material === 'metal'
        ? matCrateMil
        : opts.material === 'ground'
        ? matTrim
        : makeWallMat(span, h, opts.tunnel));

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set((minX + maxX) * 0.5, (minY + maxY) * 0.5, (minZ + maxZ) * 0.5);
    mesh.castShadow = opts.castShadow ?? h > 0.3;
    mesh.receiveShadow = opts.receiveShadow ?? true;
    group.add(mesh);

    // Architectural sandstone parapet coping on tall walls
    if (opts.trimCap && h >= 3.5) {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, 0.22, d + 0.16), matTrim);
      cap.position.set((minX + maxX) * 0.5, maxY + 0.11, (minZ + maxZ) * 0.5);
      cap.receiveShadow = true;
      group.add(cap);
    }

    if (opts.mapKind !== null) {
      minimapRects.push({
        x1: minX,
        z1: minZ,
        x2: maxX,
        z2: maxZ,
        kind: opts.mapKind ?? (opts.material === 'crate' || opts.material === 'metal' ? 'crate' : 'wall'),
      });
    }
  };

  // Helper: add walkable ramp/stairs with sloped visual wedge
  const addRamp = (
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    yStart: number,
    yEnd: number,
    axis: RampBox['axis'],
    steps = 0
  ) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);

    ramps.push({ minX, maxX, minZ, maxZ, yStart, yEnd, axis });
    minimapRects.push({ x1: minX, z1: minZ, x2: maxX, z2: maxZ, kind: 'ramp' });

    // Build solid sloped wedge geometry (no physics box needed; ramp physics handles floor + walls)
    const shape = new THREE.Shape();
    const len = axis === '+x' || axis === '-x' ? maxX - minX : maxZ - minZ;
    const width = axis === '+x' || axis === '-x' ? maxZ - minZ : maxX - minX;
    const y0 = Math.max(0, yStart);
    const y1 = Math.max(0, yEnd);

    shape.moveTo(0, 0);
    shape.lineTo(len, 0);
    shape.lineTo(len, y1);
    shape.lineTo(0, y0);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
    const mesh = new THREE.Mesh(geo, matRamp);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (axis === '+x') {
      mesh.position.set(minX, 0, minZ);
    } else if (axis === '-x') {
      mesh.rotation.y = Math.PI;
      mesh.position.set(maxX, 0, maxZ);
    } else if (axis === '+z') {
      mesh.rotation.y = -Math.PI / 2;
      mesh.position.set(maxX, 0, minZ);
    } else {
      // -z
      mesh.rotation.y = Math.PI / 2;
      mesh.position.set(minX, 0, maxZ);
    }
    group.add(mesh);

    // Optional visual stair risers along slope (non-colliding purely decorative steps)
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        const t = (i + 0.5) / steps;
        const h = yStart + (yEnd - yStart) * t;
        const stepThick = len / steps;
        const sx = axis === '+x' || axis === '-x' ? stepThick : width;
        const sz = axis === '+x' || axis === '-x' ? width : stepThick;
        const step = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.14, sz), matTrim);
        if (axis === '+x') {
          step.position.set(minX + t * len, h - 0.05, (minZ + maxZ) * 0.5);
        } else if (axis === '-x') {
          step.position.set(maxX - t * len, h - 0.05, (minZ + maxZ) * 0.5);
        } else if (axis === '+z') {
          step.position.set((minX + maxX) * 0.5, h - 0.05, minZ + t * len);
        } else {
          step.position.set((minX + maxX) * 0.5, h - 0.05, maxZ - t * len);
        }
        step.receiveShadow = true;
        group.add(step);
      }
    }
  };

  // Helper: add decorative barrel (with small square collider)
  const addBarrel = (cx: number, baseY: number, cz: number, color = 0x7c3329) => {
    const r = 0.42;
    const h = 1.15;
    colliders.push({
      minX: cx - r,
      maxX: cx + r,
      minY: baseY,
      maxY: baseY + h,
      minZ: cz - r,
      maxZ: cz + r,
      material: 'metal',
      blocksVision: true,
    });
    const barrelMat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.45 });
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 14), barrelMat);
    mesh.position.set(cx, baseY + h * 0.5, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    for (const ry of [-0.32, 0.32]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r + 0.01, 0.025, 8, 16), matDarkMetal);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(cx, baseY + h * 0.5 + ry, cz);
      group.add(ring);
    }
  };

  // Helper: procedural desert car cover prop (B Car / A Long Car)
  const addCarProp = (cx: number, baseY: number, cz: number, rotY: number, bodyColor: number) => {
    // Simple aligned bounding box collider around car hull
    const isEastWest = Math.abs(Math.sin(rotY)) > 0.7;
    const hx = isEastWest ? 2.1 : 1.05;
    const hz = isEastWest ? 1.05 : 2.1;
    colliders.push({
      minX: cx - hx,
      maxX: cx + hx,
      minY: baseY,
      maxY: baseY + 1.45,
      minZ: cz - hz,
      maxZ: cz + hz,
      material: 'metal',
      blocksVision: true,
    });
    minimapRects.push({ x1: cx - hx, z1: cz - hz, x2: cx + hx, z2: cz + hz, kind: 'crate' });

    const car = new THREE.Group();
    car.position.set(cx, baseY, cz);
    car.rotation.y = rotY;

    const paint = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5, metalness: 0.4 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x263540, roughness: 0.2, metalness: 0.7 });
    const tire = new THREE.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.9 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 4.0), paint);
    chassis.position.set(0, 0.62, 0);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    car.add(chassis);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.62, 2.0), paint);
    cabin.position.set(0, 1.2, -0.15);
    cabin.castShadow = true;
    car.add(cabin);

    const windows = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.44, 1.75), glass);
    windows.position.set(0, 1.22, -0.15);
    car.add(windows);

    for (const [wx, wz] of [[-0.92, -1.25], [0.92, -1.25], [-0.92, 1.25], [0.92, 1.25]]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 12), tire);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.36, wz);
      car.add(wheel);
    }
    group.add(car);
  };

  // =========================================================================
  // 1. BASE GROUND & OUTER PERIMETER WALLS
  // =========================================================================
  const groundMesh = new THREE.Mesh(new THREE.BoxGeometry(104, 1, 108), matGround);
  groundMesh.position.set(2, -0.5, 6);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);
  colliders.push({
    minX: -50,
    maxX: 54,
    minY: -1,
    maxY: 0,
    minZ: -48,
    maxZ: 60,
    material: 'ground',
    blocksVision: true,
  });

  // Outer Dust2 compound walls (West x=-44, East x=46, North z=-40, South z=54)
  addBox(-45, 0, -41, -43, 7.5, 55, { trimCap: true }); // West perimeter
  addBox(46, 0, -41, 48, 7.5, 55, { trimCap: true }); // East perimeter
  addBox(-45, 0, -41, 48, 7.5, -39, { trimCap: true }); // North perimeter
  addBox(-45, 0, 53, 48, 7.5, 55, { trimCap: true }); // South perimeter

  // Distant Tunisian desert skyline silhouettes outside perimeter (visual immersion)
  const skylineMat = new THREE.MeshStandardMaterial({ color: 0xc9ab7f, roughness: 0.95 });
  const skylineDefs: [number, number, number, number, number, number][] = [
    [-58, 0, -30, 10, 14, 14],
    [-56, 0, 10, 8, 12, 16],
    [56, 0, -25, 10, 16, 16],
    [58, 0, 20, 12, 13, 18],
    [-20, 0, -54, 16, 15, 10],
    [22, 0, -56, 18, 17, 12],
    [0, 0, 68, 22, 14, 10],
  ];
  for (const [bx, by, bz, bw, bh, bd] of skylineDefs) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), skylineMat);
    b.position.set(bx, by + bh * 0.5, bz);
    group.add(b);
  }

  // =========================================================================
  // 2. T SPAWN (T 出生点) — Elevated South Terrace (y = 2.0)
  // =========================================================================
  addBox(-16, 0, 36, 18, 2.0, 53, {
    material: 'ground',
    mapKind: 'elevated',
    castShadow: false,
  });
  // T Spawn sniper balcony parapet overlooking Mid (keeps center Suicide open x:-4..4)
  addBox(-16, 2.0, 35.4, -4.2, 3.15, 36.2, { trimCap: false });
  addBox(4.2, 2.0, 35.4, 18, 3.15, 36.2, { trimCap: false });
  // T Spawn cover crates & archway decor
  addBox(-12, 2.0, 46, -9.5, 3.6, 48.5, { material: 'crate' });
  addBox(10, 2.0, 47, 12.5, 3.5, 49.5, { material: 'crate' });
  addBarrel(13.2, 2.0, 48.2, 0x355c7d);

  // 3 Ramps descending from T Spawn (y=2.0 -> y=0.0):
  // (a) Center Suicide Ramp into Top Mid (z: 28..36)
  addRamp(-4, 28, 4, 36, 0.0, 2.0, '+z', 8);
  // (b) East Ramp toward Outside Long / Long Doors (x: 18..24, z: 36..48)
  addRamp(18, 36, 24, 48, 2.0, 0.0, '+x', 0);
  // (c) West Ramp toward Outside B Tunnels (x: -24..-16, z: 36..48)
  addRamp(-24, 36, -16, 48, 0.0, 2.0, '+x', 0);

  // Wall separating South-West & South-East outer dead corners cleanly
  addBox(-43, 0, 47, -24, 5.5, 53, { trimCap: true });
  addBox(36, 0, 47, 46, 5.5, 53, { trimCap: true });

  // =========================================================================
  // 3. MIDDLE & MID DOORS (中路 & 中门)
  // =========================================================================
  // West wall of Mid (between Mid x=-6 and B Tunnels / Lower Tunnels)
  // Gap at z: [-2, 6] connects directly to Lower B Tunnels!
  addBox(-7.2, 0, 6, -6, 6.2, 36, { trimCap: true });
  addBox(-7.2, 0, -11.5, -6, 6.2, -2, { trimCap: true });
  // Lintel arch over Lower B Tunnels exit into Mid
  addBox(-7.2, 3.8, -2, -6, 6.2, 6, { mapKind: null });

  // East wall of Top Mid (separating Top Mid from Long Doors Room / Catwalk base)
  // Gap at z: [26, 35] lets T players cut from Top Mid <-> Outside Long!
  addBox(12, 0, 12, 13.5, 6.0, 26, { trimCap: true });
  // Low palm/mid divider block near Top Mid
  addBox(4.5, 0, 18.5, 7.2, 1.5, 21.0, { material: 'crate' });
  addBox(-4.2, 0, 14.5, -2.0, 1.4, 16.8, { material: 'crate' });

  // Iconic Dust2 XBOX crate in Mid (right by Lower Tunnel / Catwalk view)
  addBox(2.0, 0, -5.8, 4.8, 1.55, -3.0, { material: 'crate' });
  // Small step box beside Xbox
  addBox(4.8, 0, -5.2, 6.0, 0.78, -3.8, { material: 'crate' });

  // MID DOORS WALL (z = -12.6 .. -11.4) spanning from B Side (-16) to Catwalk (+14)
  // Solid wall flanks around the 9m Mid Doorway (x: [-4.5, 4.5])
  addBox(-16, 0, -12.8, -4.5, 6.5, -11.4, { trimCap: true });
  addBox(4.5, 0, -12.8, 14, 6.5, -11.4, { trimCap: true });
  // Lintel wall above Mid Doors opening
  addBox(-4.5, 4.1, -12.8, 4.5, 6.5, -11.4, { mapKind: null });

  // ICONIC DOUBLE MID DOORS (可穿过的中门门体):
  // Left wooden door leaf: x: [-4.5, -1.25], z: [-12.35, -11.75], y: 0..4.05
  // Right wooden door leaf (ajar slightly northward): x: [1.25, 4.5], z: [-13.0, -12.4], y: 0..4.05
  // Leaves a generous 2.5m passable gap (x: [-1.25, 1.25]) for smooth player/AI traversal + iconic Mid sniper crack!
  addBox(-4.5, 0, -12.35, -1.25, 4.05, -11.75, {
    material: 'door',
    mapKind: 'door',
  });
  addBox(1.25, 0, -13.0, 4.5, 4.05, -12.4, {
    material: 'door',
    mapKind: 'door',
  });
  // Door jamb pillars
  addBox(-4.7, 0, -12.9, -4.3, 4.2, -11.3, { customMat: matDarkMetal, mapKind: null });
  addBox(4.3, 0, -12.9, 4.7, 4.2, -11.3, { customMat: matDarkMetal, mapKind: null });

  // CT Mid cover crate (classic Mid-to-B cover box)
  addBox(-7.5, 0, -17.5, -5.2, 1.45, -15.2, { material: 'crate' });

  // =========================================================================
  // 4. CATWALK / SHORT A (猫道) — Elevated Walkway (y = 2.4)
  // =========================================================================
  // Catwalk Stairs climbing Eastward from Mid (x: 8 -> 14, z: 6..12, y: 0 -> 2.4)
  addRamp(8, 6, 14, 12, 0.0, 2.4, '+x', 10);
  // Solid side skirt walls framing Catwalk stairs
  addBox(8, 0, 12, 14, 3.2, 12.6, { mapKind: 'wall' });
  addBox(8, 0, 5.4, 14, 2.6, 6.0, { mapKind: 'wall' });

  // Main Catwalk Elevated Platform: x: [14, 19.5], z: [-26, 12], y = 2.4
  addBox(14, 0, -26, 19.5, 2.4, 12, {
    material: 'ground',
    mapKind: 'elevated',
    castShadow: true,
  });

  // East wall along Catwalk (separates Catwalk from A Long / Long Doors)
  // Open at z: [-26, -20] where A Short Ramp enters A Site!
  addBox(19.5, 0, -20, 22, 6.2, 12, { trimCap: true });

  // West wall/parapet of Catwalk (overlooking Mid and CT Mid)
  // Full wall along lower Catwalk (z: -4..6)
  addBox(13.3, 2.4, -4, 14.0, 5.2, 6, { mapKind: 'wall' });
  // Waist-high parapet overlooking Mid Doors & Xbox (z: -16..-4)
  addBox(13.4, 2.4, -16, 14.0, 3.45, -4, { mapKind: 'wall' });
  // North-West short section z: [-26, -16] left open/low curb so players can drop down to CT Spawn/CT Mid!
  // Small Catwalk cover box (Short stairs corner)
  addBox(16.8, 2.4, -14.5, 19.2, 3.8, -12.2, { material: 'crate' });

  // A Short Ramp connecting Catwalk (x=19.5, y=2.4) -> A Site (x=22.5, y=2.8) along z: [-26, -20]
  addRamp(19.5, -26, 22.5, -20, 2.4, 2.8, '+x', 4);

  // =========================================================================
  // 5. CT SPAWN (CT 出生点) & CT RAMP TO A SITE
  // =========================================================================
  // CT Spawn sits at x: [-2, 14], z: [-39, -26], y = 0.0
  // Wall dividing CT Ramp from Short/Catwalk overlook
  addBox(14, 0, -30, 22, 4.8, -26, { trimCap: true });
  // CT Ramp climbing directly from CT Spawn (x=14, y=0) up to A Site (x=22.5, y=2.8) along z: [-37, -30]
  addRamp(14, -37, 22.5, -30, 0.0, 2.8, '+x', 11);
  // Wall along North side of CT Ramp
  addBox(14, 0, -39, 22.5, 5.8, -37, { trimCap: true });

  // CT Spawn tactical crates
  addBox(3.5, 0, -36.5, 5.8, 1.5, -34.2, { material: 'metal' });
  addBarrel(6.5, 0, -35.8, 0x3b5949);

  // =========================================================================
  // 6. A SITE (A点) — Elevated North-East Bombsite (y = 2.8)
  // =========================================================================
  addBox(22.5, 0, -39, 46, 2.8, -20, {
    material: 'ground',
    mapKind: 'elevated',
    castShadow: true,
  });

  // Parapet along South edge of A Site (between Short x=22.5 and A Ramp x=31)
  addBox(22.5, 2.8, -20.6, 31, 4.1, -19.8, { mapKind: 'wall' });
  // Parapet East of A Ramp (x: 41..46)
  addBox(41, 2.8, -20.6, 46, 5.6, -19.8, { trimCap: false });

  // Goose alcove pillar (iconic NE corner of A Site)
  addBox(38.5, 2.8, -34, 40.5, 6.2, -32, { trimCap: false });

  // Iconic A Site Default Crates (stacked cover around plant zone)
  addBox(28.0, 2.8, -30.5, 30.6, 4.8, -27.9, { material: 'crate' });
  addBox(28.3, 4.8, -30.2, 30.3, 6.3, -28.2, { material: 'crate' }); // top stacked crate
  addBox(30.6, 2.8, -29.8, 32.8, 4.3, -27.6, { material: 'metal' }); // green military crate
  addBox(25.0, 2.8, -25.0, 27.2, 4.2, -23.0, { material: 'crate' }); // Short side box
  addBarrel(35.2, 2.8, -24.2, 0x7c3329);
  addBarrel(36.1, 2.8, -23.7, 0x355c7d);

  // A Site painted wall stencil & floor marking
  const decalA = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({ map: tex.siteADecal, transparent: true, depthWrite: false })
  );
  decalA.position.set(32, 5.1, -38.92);
  group.add(decalA);

  const floorA = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 10),
    new THREE.MeshBasicMaterial({ map: tex.siteFloorA, transparent: true, depthWrite: false })
  );
  floorA.rotation.x = -Math.PI / 2;
  floorA.position.set(30.5, 2.82, -28.5);
  group.add(floorA);
  minimapRects.push({ x1: 25, z1: -34, x2: 36, z2: -22, kind: 'site' });

  // =========================================================================
  // 7. A LONG (A大) & LONG DOORS (A大门 / 蓝门房)
  // =========================================================================
  // A Ramp climbing North from A Long (z=-10, y=0) -> A Site (z=-20, y=2.8)
  addRamp(31, -20, 41, -10, 0.0, 2.8, '-z', 0);
  // Retaining wall West of A Ramp (separating A Long from Catwalk/CT under-wall)
  addBox(22, 0, -20, 31, 5.4, -10, { trimCap: true });
  // Wall separating A Long (x>32) from Mid/Catwalk corridor (x<22)
  addBox(22, 0, -10, 32, 6.2, 24, { trimCap: true });

  // LONG DOORS HOUSE (蓝门房): x: [22, 32], z: [24, 36]
  // West wall of Long Doors House (gap z: [26, 34] allows Top Mid <-> Long Doors flow)
  addBox(21.4, 0, 24, 22.4, 5.2, 26.5, { mapKind: 'wall' });
  addBox(21.4, 0, 34, 22.4, 5.2, 36, { mapKind: 'wall' });
  // South wall of Long Doors House (doorway x: [24, 30] from Outside Long)
  addBox(22, 0, 35.5, 24.2, 5.2, 36.5, { mapKind: 'wall' });
  addBox(29.8, 0, 35.5, 32.5, 5.2, 36.5, { mapKind: 'wall' });
  // East wall of Long Doors House — iconic Long Doors exit onto A Long (gap z: [26.5, 33.0])!
  addBox(31.5, 0, 24, 32.5, 5.2, 26.5, { mapKind: 'wall' });
  addBox(31.5, 0, 33.0, 32.5, 5.2, 36.5, { mapKind: 'wall' });
  // Blue door panels flanking Long Doors opening
  addBox(31.7, 0, 26.5, 32.3, 3.6, 28.0, { customMat: matBlueMetal, material: 'door', mapKind: 'door' });
  addBox(31.7, 0, 31.5, 32.3, 3.6, 33.0, { customMat: matBlueMetal, material: 'door', mapKind: 'door' });
  // Roof over Long Doors Room
  addBox(21.4, 4.6, 24, 32.5, 5.3, 36.5, { mapKind: 'tunnel', castShadow: true });

  // Iconic A Long props: Blue Bin, A Long Car, Pit cover crates
  addBox(32.5, 0, 14.5, 35.2, 1.85, 18.2, { customMat: matBlueMetal, material: 'metal' }); // Blue Bin!
  addCarProp(42.5, 0, -2.5, 0.05, 0x9b4534); // A Long Car!
  addBox(39.5, 0, 29.0, 42.2, 1.45, 31.5, { material: 'crate' }); // Pit cover crate
  addBox(42.5, 0, 32.5, 45.2, 1.9, 35.0, { material: 'crate' });
  addBox(32.5, 0, -2.0, 34.8, 1.5, 0.5, { material: 'crate' }); // Long Mid cover

  // =========================================================================
  // 8. B TUNNELS (B洞 — Upper & Lower B Tunnels)
  // =========================================================================
  // Wall separating Upper B Tunnels from Mid/Outside
  // Upper B Tunnels interior: x: [-40, -22], z: [-12, 28], vaulted ceiling at y = 4.6
  // South entrance wall at z = 28 (doorway x: [-34, -27])
  addBox(-43, 0, 27.5, -34, 5.8, 29.0, { tunnel: true });
  addBox(-27, 0, 27.5, -21, 5.8, 29.0, { tunnel: true });
  addBox(-34, 3.8, 27.5, -27, 5.8, 29.0, { tunnel: true, mapKind: null });

  // East wall of Upper B Tunnels (x: -22.5..-21.0)
  // Open at z: [-2, 6] into Lower B Tunnels!
  addBox(-22.5, 0, 6, -21.0, 5.8, 28.5, { tunnel: true });
  addBox(-22.5, 0, -12, -21.0, 5.8, -2, { tunnel: true });
  addBox(-22.5, 3.8, -2, -21.0, 5.8, 6, { tunnel: true, mapKind: null });

  // B Tunnel North exit wall into B Site (at z = -12, doorway x: [-34, -26])
  addBox(-43, 0, -12.8, -34, 6.2, -11.4, { tunnel: true });
  addBox(-26, 0, -12.8, -15.5, 6.2, -11.4, { tunnel: true });
  addBox(-34, 3.8, -12.8, -26, 6.2, -11.4, { tunnel: true, mapKind: null });

  // Upper B Tunnels vaulted stone ceiling (y: 4.6..5.6)
  addBox(-43, 4.6, -12.5, -21, 5.6, 28.5, { tunnel: true, mapKind: 'tunnel' });

  // Interior pillars & crates inside Upper B Tunnels (iconic Dust2 B Tunnels architecture!)
  addBox(-31.5, 0, 12.0, -29.0, 4.6, 14.5, { tunnel: true }); // Central stone pillar
  addBox(-39.5, 0, 16.0, -37.0, 1.5, 18.5, { material: 'crate' });
  addBox(-25.5, 0, 20.0, -23.0, 1.5, 22.5, { material: 'crate' });
  addBox(-38.0, 0, 2.0, -35.6, 1.5, 4.5, { material: 'crate' });

  // LOWER B TUNNELS (x: [-21, -7.2], z: [-2, 6]) connecting Upper Tunnels directly to Mid!
  addBox(-21, 0, 6.0, -7.2, 5.4, 7.2, { tunnel: true }); // South wall of Lower Tunnels
  addBox(-21, 0, -3.2, -7.2, 5.4, -2.0, { tunnel: true }); // North wall of Lower Tunnels
  addBox(-21, 4.4, -3.0, -7.2, 5.4, 7.0, { tunnel: true, mapKind: 'tunnel' }); // Lower Tunnels ceiling

  // Outside B Tunnels cover box
  addBox(-36, 0, 35, -33.5, 1.5, 37.5, { material: 'crate' });

  // =========================================================================
  // 9. B SITE (B点) — North-West Courtyard (x: [-43, -16], z: [-39, -12])
  // =========================================================================
  // East wall separating B Site from CT Mid (x = -16.2 .. -15.0, z: [-39, -12])
  // Features BOTH iconic B Doors (z: [-23, -17]) AND B Window (z: [-33, -29])!
  addBox(-16.2, 0, -17.0, -15.0, 6.5, -12.0, { trimCap: true });
  addBox(-16.2, 0, -29.0, -15.0, 6.5, -23.0, { trimCap: true });
  addBox(-16.2, 0, -39.0, -15.0, 6.5, -33.0, { trimCap: true });
  // Lintels over B Doors and B Window
  addBox(-16.2, 3.9, -23.0, -15.0, 6.5, -17.0, { mapKind: null });
  addBox(-16.2, 3.6, -33.0, -15.0, 6.5, -29.0, { mapKind: null });

  // B Doors wooden double-door leaves (generous 2.6m passable center gap z: [-21.3, -18.7])
  addBox(-16.0, 0, -23.0, -15.3, 3.85, -21.3, { material: 'door', mapKind: 'door' });
  addBox(-16.0, 0, -18.7, -15.3, 3.85, -17.0, { material: 'door', mapKind: 'door' });

  // B Window low sill (y: 0..0.95) + smooth rubble ramps on both sides so players & bots can climb through!
  addBox(-16.2, 0, -33.0, -15.0, 0.85, -29.0, { mapKind: null });
  addRamp(-18.2, -33.0, -16.2, -29.0, 0.0, 0.85, '+x', 3);
  addRamp(-15.0, -33.0, -13.0, -29.0, 0.85, 0.0, '+x', 3);

  // B Back Platform (slightly elevated NW corner, y = 0.9)
  addBox(-43, 0, -39, -34, 0.9, -27, { material: 'ground', mapKind: 'elevated' });
  addRamp(-34, -36, -30.5, -28, 0.9, 0.0, '+x', 4);

  // Iconic B Site Cover: Double Stack Crates, Default Box, B Car, Scaffolding crates
  addBox(-31.0, 0, -26.5, -28.4, 2.0, -24.0, { material: 'crate' }); // Double Stack bottom
  addBox(-30.7, 2.0, -26.2, -28.7, 3.5, -24.3, { material: 'crate' }); // Double Stack top
  addBox(-28.4, 0, -25.8, -26.2, 1.45, -23.8, { material: 'metal' }); // Default military crate
  addBox(-38.0, 0.9, -34.0, -35.6, 2.5, -31.6, { material: 'crate' }); // Back Plat crate
  addCarProp(-21.5, 0, -15.8, Math.PI * 0.42, 0x526b5c); // B Car!
  addBarrel(-39.5, 0, -19.0, 0x7c3329);
  addBarrel(-38.6, 0, -18.4, 0x455a64);

  // B Site painted wall stencil & floor marking
  const decalB = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({ map: tex.siteBDecal, transparent: true, depthWrite: false })
  );
  decalB.position.set(-29, 3.8, -38.92);
  group.add(decalB);

  const floorB = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 12),
    new THREE.MeshBasicMaterial({ map: tex.siteFloorB, transparent: true, depthWrite: false })
  );
  floorB.rotation.x = -Math.PI / 2;
  floorB.position.set(-28.5, 0.03, -25.5);
  group.add(floorB);
  minimapRects.push({ x1: -34, z1: -32, x2: -22, z2: -19, kind: 'site' });

  // Warm interior lamps inside B Tunnels & Long Doors Room for crisp contrast
  const lampPositions: [number, number, number][] = [
    [-31, 4.1, 20],
    [-31, 4.1, 4],
    [-30, 4.1, -6],
    [-14, 3.9, 2],
    [27, 4.1, 30],
  ];
  const lampBulbMat = new THREE.MeshBasicMaterial({ color: 0xffe4aa });
  for (const [lx, ly, lz] of lampPositions) {
    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.16, 0.6), lampBulbMat);
    bulb.position.set(lx, ly, lz);
    group.add(bulb);
    const pt = new THREE.PointLight(0xffd28a, 14, 22, 1.4);
    pt.position.set(lx, ly - 0.3, lz);
    group.add(pt);
  }

  // =========================================================================
  // BOMBSITES, CALLOUTS, AND 5v5 SPAWN POINTS
  // =========================================================================
  const bombsites: BombsiteZone[] = [
    {
      id: 'A',
      label: 'A 点',
      minX: 24.5,
      maxX: 37.5,
      minY: 2.0,
      maxY: 6.0,
      minZ: -35.0,
      maxZ: -21.5,
      center: { x: 30.8, y: 2.8, z: -26.2 },
    },
    {
      id: 'B',
      label: 'B 点',
      minX: -35.5,
      maxX: -21.5,
      minY: -0.5,
      maxY: 3.5,
      minZ: -33.0,
      maxZ: -18.5,
      center: { x: -27.2, y: 0.0, z: -28.0 },
    },
  ];

  const callouts: CalloutZone[] = [
    { name: 'A 点 (Bombsite A)', minX: 22, maxX: 46, minZ: -39, maxZ: -20, priority: 3 },
    { name: 'B 点 (Bombsite B)', minX: -43, maxX: -16, minZ: -39, maxZ: -12, priority: 3 },
    { name: 'CT 出生点', minX: -1, maxX: 15, minZ: -39, maxZ: -25, priority: 3 },
    { name: 'T 出生点', minX: -18, maxX: 20, minZ: 36, maxZ: 53, priority: 3 },
    { name: '猫道 (Catwalk / Short)', minX: 12, maxX: 22, minZ: -26, maxZ: 13, priority: 3 },
    { name: 'A 大 (A Long)', minX: 31, maxX: 46, minZ: -20, maxZ: 38, priority: 2 },
    { name: 'A 大门 (Long Doors)', minX: 21, maxX: 33, minZ: 24, maxZ: 37, priority: 3 },
    { name: '中门 (Mid Doors)', minX: -7, maxX: 8, minZ: -16, maxZ: -7, priority: 4 },
    { name: '中路 (Middle)', minX: -7, maxX: 13, minZ: -12, maxZ: 36, priority: 1 },
    { name: 'CT 中路 (CT Mid)', minX: -16, maxX: 13, minZ: -28, maxZ: -12, priority: 2 },
    { name: 'B 洞下层 (Lower Tunnels)', minX: -22, maxX: -6, minZ: -3, maxZ: 7, priority: 3 },
    { name: 'B 洞 (B Tunnels)', minX: -43, maxX: -21, minZ: -12, maxZ: 30, priority: 2 },
    { name: 'B 洞外 (Outside Tunnels)', minX: -43, maxX: -16, minZ: 28, maxZ: 48, priority: 1 },
    { name: 'A 大外 (Outside Long)', minX: 18, maxX: 46, minZ: 36, maxZ: 48, priority: 1 },
  ];

  // 5 spacious CT spawn positions in CT Spawn (facing South/West)
  const spawnsCT: Vec3[] = [
    { x: 6.5, y: 0.0, z: -31.5 },
    { x: 9.5, y: 0.0, z: -32.0 },
    { x: 3.5, y: 0.0, z: -30.5 },
    { x: 11.5, y: 0.0, z: -33.5 },
    { x: 7.5, y: 0.0, z: -28.5 },
  ];

  // 5 spacious T spawn positions on elevated T Spawn platform (y = 2.0, facing North)
  const spawnsT: Vec3[] = [
    { x: 0.0, y: 2.0, z: 44.0 },
    { x: -4.5, y: 2.0, z: 45.0 },
    { x: 4.5, y: 2.0, z: 45.0 },
    { x: -8.0, y: 2.0, z: 42.5 },
    { x: 8.0, y: 2.0, z: 42.5 },
  ];

  return {
    group,
    colliders,
    ramps,
    bombsites,
    callouts,
    spawnsCT,
    spawnsT,
    minimapRects,
    bounds: { minX: -45, maxX: 48, minZ: -41, maxZ: 55 },
  };
}

export function getCalloutAt(x: number, z: number, callouts: CalloutZone[]): string {
  let best: CalloutZone | null = null;
  for (const c of callouts) {
    if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) {
      if (!best || (c.priority ?? 0) > (best.priority ?? 0)) {
        best = c;
      }
    }
  }
  return best ? best.name : 'Dust2';
}

import * as THREE from 'three';
import { ProceduralTextures } from '../procedural/textures';
import { BoundingBox } from '../types/game';

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export class Dust2Map {
  public scene: THREE.Scene;
  public collisionBoxes: CollisionBox[] = [];
  public mapGroup: THREE.Group;

  // Plant site trigger zones
  public plantZoneA: CollisionBox;
  public plantZoneB: CollisionBox;

  // Spawn positions
  public ctSpawns: THREE.Vector3[] = [];
  public tSpawns: THREE.Vector3[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.mapGroup = new THREE.Group();
    this.mapGroup.name = 'dust2_map';
    this.scene.add(this.mapGroup);

    // Initialize plant zones
    this.plantZoneA = {
      min: new THREE.Vector3(30, 0, -66),
      max: new THREE.Vector3(50, 4, -48),
    };

    this.plantZoneB = {
      min: new THREE.Vector3(-72, 0, -45),
      max: new THREE.Vector3(-52, 4, -25),
    };

    this.initSpawns();
    this.buildMap();
  }

  private initSpawns() {
    // 5 CT Spawns in CT Spawn courtyard
    this.ctSpawns = [
      new THREE.Vector3(20, 0, -76),
      new THREE.Vector3(25, 0, -78),
      new THREE.Vector3(15, 0, -80),
      new THREE.Vector3(28, 0, -74),
      new THREE.Vector3(22, 0, -82),
    ];

    // 5 T Spawns in T Spawn area
    this.tSpawns = [
      new THREE.Vector3(0, 0, 75),
      new THREE.Vector3(6, 0, 77),
      new THREE.Vector3(-6, 0, 76),
      new THREE.Vector3(12, 0, 74),
      new THREE.Vector3(-12, 0, 75),
    ];
  }

  private buildMap() {
    const texWall = ProceduralTextures.getSandstoneTexture('#d6b88d');
    const texWallDark = ProceduralTextures.getSandstoneTexture('#be9e75');
    const texFloor = ProceduralTextures.getFloorTexture();
    const texCrate = ProceduralTextures.getCrateTexture();
    const texMilCrate = ProceduralTextures.getMilitaryCrateTexture();
    const texDoor = ProceduralTextures.getMidDoorTexture();
    const texSignA = ProceduralTextures.getSiteSignTexture('A');
    const texSignB = ProceduralTextures.getSiteSignTexture('B');

    const matWall = new THREE.MeshStandardMaterial({ map: texWall, roughness: 0.9 });
    const matWallDark = new THREE.MeshStandardMaterial({ map: texWallDark, roughness: 0.9 });
    const matFloor = new THREE.MeshStandardMaterial({ map: texFloor, roughness: 0.85 });
    const matCrate = new THREE.MeshStandardMaterial({ map: texCrate, roughness: 0.7 });
    const matMilCrate = new THREE.MeshStandardMaterial({ map: texMilCrate, roughness: 0.6 });
    const matDoor = new THREE.MeshStandardMaterial({ map: texDoor, roughness: 0.5, metalness: 0.4 });
    const matSignA = new THREE.MeshBasicMaterial({ map: texSignA, transparent: true });
    const matSignB = new THREE.MeshBasicMaterial({ map: texSignB, transparent: true });

    // Sky & Lighting
    this.setupAtmosphere();

    // Helper: add solid wall / block with collision
    const addBlock = (
      x: number, y: number, z: number,
      w: number, h: number, d: number,
      mat: THREE.Material = matWall,
      hasCollision: boolean = true
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y + h / 2, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.mapGroup.add(mesh);

      if (hasCollision) {
        this.collisionBoxes.push({
          min: new THREE.Vector3(x - w / 2, y, z - d / 2),
          max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
        });
      }
      return mesh;
    };

    // Helper: add crate
    const addCrate = (x: number, y: number, z: number, s: number = 1.6, isMilitary: boolean = false) => {
      return addBlock(x, y, z, s, s, s, isMilitary ? matMilCrate : matCrate, true);
    };

    // 1. MAIN GROUND FLOORS
    // Ground planes covering the map
    const mainFloor = addBlock(0, -0.5, 0, 180, 1, 200, matFloor, false);
    // Floor collision
    this.collisionBoxes.push({
      min: new THREE.Vector3(-90, -1, -100),
      max: new THREE.Vector3(90, 0, 100),
    });

    // 2. PERIMETER BOUNDARY WALLS (Keep players inside Dust2)
    const wallH = 9;
    addBlock(0, 0, 95, 180, wallH, 4, matWallDark); // South outer wall
    addBlock(0, 0, -95, 180, wallH, 4, matWallDark); // North outer wall
    addBlock(-88, 0, 0, 4, wallH, 190, matWallDark); // West outer wall
    addBlock(75, 0, 0, 4, wallH, 190, matWallDark);  // East outer wall

    // 3. T SPAWN AREA (Z ≈ 65 to 90, X ≈ -25 to 25)
    // T Spawn West wall (separates from Upper Tunnel)
    addBlock(-24, 0, 75, 4, wallH, 30);
    // T Spawn East wall (path to Long)
    addBlock(24, 0, 75, 4, wallH, 30);
    // T Spawn cover boxes
    addCrate(4, 0, 78, 1.6);
    addCrate(-6, 0, 80, 1.6);
    addCrate(14, 0, 70, 1.8);

    // 4. LONG A PATHWAY (T Spawn -> Long Doors -> Long Pit -> A Long Street)
    // Long Doors Building (X ≈ 35, Z ≈ 55)
    addBlock(36, 0, 68, 24, wallH, 4); // South Long entrance wall
    // Long Doors entrance archway opening
    addBlock(48, 0, 52, 4, wallH, 28); // East wall of Long Doors building
    addBlock(24, 0, 52, 4, wallH, 28); // West wall of Long Doors building
    // Roof over Long Doors
    addBlock(36, 6, 52, 24, 1.5, 28, matWallDark, false);

    // Long Pit Area (X ≈ 52 to 68, Z ≈ 25 to 40)
    // Sunken pit floor
    addBlock(60, -1.2, 32, 14, 1.2, 16, matFloor, true);
    // Long Corner Wall
    addBlock(36, 0, 36, 4, wallH, 20); // Corner angle wall

    // Long A Straight Street (X ≈ 42 to 58, Z ≈ 30 to -35)
    addBlock(64, 0, -5, 4, wallH, 70); // East Long wall
    addBlock(36, 0, 0, 4, wallH, 45);  // West Long wall (separates Long from Catwalk/A short)

    // Long Blue/Military Cargo Box
    addBlock(46, 0, 10, 2.5, 2.2, 5.0, matMilCrate);
    addCrate(58, 0, -15, 1.6);
    addCrate(58, 1.6, -15, 1.6); // Double crate

    // 5. A SITE ELEVATED PLATFORM (X ≈ 28 to 55, Z ≈ -45 to -68, Y ≈ 1.5)
    // Platform base
    addBlock(42, 0, -58, 28, 1.5, 24, matFloor, true);

    // Long to A Ramp (ramp up from Z = -35 to Z = -46)
    const rampSteps = 6;
    for (let i = 0; i < rampSteps; i++) {
      const stepZ = -36 - i * 1.6;
      const stepY = i * (1.5 / rampSteps);
      addBlock(44, 0, stepZ, 12, stepY + 0.25, 1.6, matFloor, true);
    }

    // A Site Back Wall (Goose)
    addBlock(42, 1.5, -70, 28, wallH, 4, matWall);
    // A Site West Wall
    addBlock(28, 1.5, -60, 4, wallH, 20, matWall);

    // Famous A Site Triple Boxes
    addCrate(46, 1.5, -55, 1.6);
    addCrate(47.6, 1.5, -55, 1.6);
    addCrate(46.8, 3.1, -55, 1.6);

    // Default Plant Box (C4 cover on A)
    addCrate(38, 1.5, -58, 1.8);
    addCrate(38, 3.3, -58, 1.5);
    addCrate(36.2, 1.5, -58, 1.6);

    // A Site Sign on wall
    const signAMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), matSignA);
    signAMesh.position.set(42, 3.8, -67.9);
    this.mapGroup.add(signAMesh);

    // 6. CATWALK / SHORT A (猫道 / A小道)
    // Catwalk corridor (Y ≈ 2.0, X ≈ 16 to 28, Z ≈ -10 to -45)
    addBlock(20, 0, -25, 8, 2.0, 35, matFloor, true);

    // Catwalk stairs from Lower Mid (X ≈ 10 to 18, Z ≈ -5)
    for (let i = 0; i < 8; i++) {
      const stepX = 12 + i * 1.0;
      const stepY = i * (2.0 / 8);
      addBlock(stepX, 0, -6, 1.1, stepY + 0.25, 8, matFloor, true);
    }

    // Short A Corner connecting to A Site Platform
    addBlock(24, 0, -45, 12, 1.8, 10, matFloor, true);
    // Short A ledge half-wall / railing
    addBlock(15.5, 2.0, -25, 0.8, 1.1, 35, matWall);

    // 7. MID ROAD & MID DOORS (中路 & 中门)
    // Top Mid (X ≈ -12 to 12, Z ≈ 35 to 55)
    addBlock(-16, 0, 45, 4, wallH, 25); // West wall of Top Mid
    addBlock(16, 0, 45, 4, wallH, 25);  // East wall of Top Mid

    // Mid Suicide / slope down (Z ≈ 30 to 5)
    addCrate(6, 0, 20, 1.6);

    // Lower Mid (Z ≈ 5 to -25)
    addBlock(-18, 0, -10, 4, wallH, 35); // West wall of Lower Mid (connects to Lower Tunnel)
    
    // MID DOORS STRUCTURE (Z ≈ -28)
    // Wall flanking the left of doors
    addBlock(-10, 0, -28, 12, wallH, 3, matWall);
    // Wall flanking the right of doors
    addBlock(10, 0, -28, 12, wallH, 3, matWall);
    // Lintel above mid doors
    addBlock(0, 4.5, -28, 8, wallH - 4.5, 3, matWall);

    // Mid Doors: Double steel doors angled open with classic sniper crack gap!
    // Left Door (angled open into CT Mid)
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.5, 0.2), matDoor);
    doorL.position.set(-2.2, 2.25, -28.6);
    doorL.rotation.y = -0.38; // angled open
    this.mapGroup.add(doorL);
    this.collisionBoxes.push({
      min: new THREE.Vector3(-3.5, 0, -29.6),
      max: new THREE.Vector3(-1.0, 4.5, -27.6),
    });

    // Right Door (angled open into Mid)
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.5, 0.2), matDoor);
    doorR.position.set(2.2, 2.25, -27.4);
    doorR.rotation.y = -0.32; // angled open
    this.mapGroup.add(doorR);
    this.collisionBoxes.push({
      min: new THREE.Vector3(1.0, 0, -28.4),
      max: new THREE.Vector3(3.5, 4.5, -26.4),
    });

    // Notice: Center gap from X = -1.0 to X = 1.0 is completely open for passing through and sniping!

    // CT Mid (Z ≈ -30 to -65)
    addBlock(-16, 0, -45, 4, wallH, 30); // Wall separating CT Mid from B path
    addCrate(-8, 0, -42, 1.6);

    // 8. CT SPAWN AREA (X ≈ 10 to 35, Z ≈ -72 to -90, Y = 0)
    addBlock(5, 0, -78, 4, wallH, 26);  // West CT Spawn wall
    addBlock(38, 0, -82, 4, wallH, 20); // East CT Spawn wall
    addCrate(18, 0, -84, 1.8, true);    // Military supplies

    // CT Ramp up to A Site
    for (let i = 0; i < 7; i++) {
      const stepZ = -70 + i * 1.6;
      const stepY = (6 - i) * (1.5 / 7);
      addBlock(24, 0, stepZ, 6, stepY + 0.25, 1.6, matFloor, true);
    }

    // 9. B TUNNELS (Upper & Lower Tunnels)
    // Upper Tunnel (X ≈ -30 to -55, Z ≈ 60 to 10)
    addBlock(-26, 0, 40, 4, wallH, 40); // East wall of Upper Tunnel
    addBlock(-56, 0, 40, 4, wallH, 40); // West wall of Upper Tunnel
    // Upper Tunnel ceiling
    addBlock(-41, 5.5, 40, 30, 1.5, 40, matWallDark, false);

    // Tunnel Support Arches / Pillars
    addBlock(-38, 0, 48, 2, 5.5, 2, matWallDark);
    addBlock(-44, 0, 48, 2, 5.5, 2, matWallDark);
    addBlock(-38, 0, 30, 2, 5.5, 2, matWallDark);
    addBlock(-44, 0, 30, 2, 5.5, 2, matWallDark);

    // Lower Tunnel connecting Upper Tunnel to Lower Mid (X ≈ -20 to -35, Z ≈ 0)
    addBlock(-35, 0, 2, 4, wallH, 18);
    addBlock(-20, 0, 6, 12, wallH, 4);

    // Upper Tunnel exit into B Site
    addBlock(-40, 0, 12, 16, wallH, 4);
    // Doorway opening at X ≈ -50, Z ≈ 12

    // 10. B SITE AREA (X ≈ -45 to -78, Z ≈ -15 to -55)
    // B Site Platform (Y ≈ 0.8)
    addBlock(-62, 0, -36, 24, 0.8, 22, matFloor, true);

    // B Site Perimeter Walls
    addBlock(-42, 0, -30, 4, wallH, 30); // East wall of B Site
    addBlock(-78, 0, -35, 4, wallH, 40); // West outer wall of B
    addBlock(-60, 0, -56, 36, wallH, 4); // North back wall of B

    // B Doors (connecting CT/Mid to B Site at X ≈ -42, Z ≈ -38)
    // Door opening with door mesh
    const bDoor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 2.6), matDoor);
    bDoor.position.set(-42.8, 2.1, -38);
    bDoor.rotation.y = 0.45;
    this.mapGroup.add(bDoor);
    this.collisionBoxes.push({
      min: new THREE.Vector3(-44, 0, -40),
      max: new THREE.Vector3(-42, 4.2, -36),
    });

    // B Window (X ≈ -42, Z ≈ -22, Y = 1.4)
    addBlock(-42, 0, -22, 3, 1.4, 5, matWall); // Window ledge
    addCrate(-39, 0, -22, 1.2); // Box to jump up to window from outside

    // B Site Crates & Cover
    addCrate(-62, 0.8, -34, 1.8);
    addCrate(-62, 2.6, -34, 1.6); // Double box
    addCrate(-56, 0.8, -40, 1.8);
    addCrate(-70, 0.8, -30, 1.6);
    addCrate(-68, 0, -20, 1.8, true); // Car / back boxes

    // B Site Sign on wall
    const signBMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), matSignB);
    signBMesh.position.set(-60, 3.8, -53.9);
    this.mapGroup.add(signBMesh);
  }

  // Setup atmospheric lighting & warm Moroccan sky
  private setupAtmosphere() {
    // Hemisphere light (Warm sun + desert bounce)
    const hemiLight = new THREE.HemisphereLight(0xfff4e6, 0x9e8568, 0.7);
    this.scene.add(hemiLight);

    // Directional Sun Light casting sharp CS shadows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    sunLight.position.set(60, 100, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    const d = 110;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Sky Dome
    const skyGeo = new THREE.SphereGeometry(180, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x87ceeb, // Sky blue
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  // Physics collision detection & resolution
  // Uses cylinder vs AABB sweep with sliding response and step-up capability
  public resolveCollision(
    pos: THREE.Vector3,
    radius: number = 0.45,
    height: number = 1.8,
    stepHeight: number = 0.4
  ): { position: THREE.Vector3; onGround: boolean } {
    let resolved = pos.clone();
    let onGround = false;

    // Check against all collision boxes
    for (const box of this.collisionBoxes) {
      // Check vertical overlap
      const topY = resolved.y + height;
      const botY = resolved.y;

      if (topY < box.min.y || botY > box.max.y) {
        continue;
      }

      // Check step-up: if collision is below step height, allow standing on top
      if (botY >= box.max.y - stepHeight && botY <= box.max.y + 0.1) {
        // Horizontally inside box?
        if (
          resolved.x >= box.min.x - radius &&
          resolved.x <= box.max.x + radius &&
          resolved.z >= box.min.z - radius &&
          resolved.z <= box.max.z + radius
        ) {
          resolved.y = box.max.y;
          onGround = true;
          continue;
        }
      }

      // Horizontal AABB vs Circle
      const closestX = Math.max(box.min.x, Math.min(resolved.x, box.max.x));
      const closestZ = Math.max(box.min.z, Math.min(resolved.z, box.max.z));

      const dx = resolved.x - closestX;
      const dz = resolved.z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius && distSq > 0.000001) {
        const dist = Math.sqrt(distSq);
        const overlap = radius - dist;
        // Push out along collision normal
        resolved.x += (dx / dist) * overlap;
        resolved.z += (dz / dist) * overlap;
      } else if (distSq === 0) {
        // Center is inside box, push out along shortest axis
        const toMinX = Math.abs(resolved.x - box.min.x);
        const toMaxX = Math.abs(resolved.x - box.max.x);
        const toMinZ = Math.abs(resolved.z - box.min.z);
        const toMaxZ = Math.abs(resolved.z - box.max.z);

        const minOverlap = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
        if (minOverlap === toMinX) resolved.x = box.min.x - radius;
        else if (minOverlap === toMaxX) resolved.x = box.max.x + radius;
        else if (minOverlap === toMinZ) resolved.z = box.min.z - radius;
        else resolved.z = box.max.z + radius;
      }
    }

    // Ground check
    if (resolved.y <= 0) {
      resolved.y = 0;
      onGround = true;
    }

    return { position: resolved, onGround };
  }

  // Raycast Line-of-sight check against walls
  public checkLineOfSight(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const dir = new THREE.Vector3().subVectors(to, from);
    const dist = dir.length();
    dir.normalize();

    const ray = new THREE.Ray(from, dir);

    for (const box of this.collisionBoxes) {
      // Ignore ground boxes or very low boxes
      if (box.max.y <= 0.2) continue;

      const aabb = new THREE.Box3(box.min, box.max);
      const hitPoint = ray.intersectBox(aabb, new THREE.Vector3());
      if (hitPoint) {
        const hitDist = from.distanceTo(hitPoint);
        if (hitDist < dist - 0.2) {
          return false; // Obstructed by wall
        }
      }
    }

    return true; // Clear line of sight
  }

  // Check if a 3D position is inside Site A or Site B plant zones
  public getPlantSiteAt(pos: THREE.Vector3): 'A' | 'B' | null {
    if (
      pos.x >= this.plantZoneA.min.x && pos.x <= this.plantZoneA.max.x &&
      pos.z >= this.plantZoneA.min.z && pos.z <= this.plantZoneA.max.z
    ) {
      return 'A';
    }
    if (
      pos.x >= this.plantZoneB.min.x && pos.x <= this.plantZoneB.max.x &&
      pos.z >= this.plantZoneB.min.z && pos.z <= this.plantZoneB.max.z
    ) {
      return 'B';
    }
    return null;
  }
}

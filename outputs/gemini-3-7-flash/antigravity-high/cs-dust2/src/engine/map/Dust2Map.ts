import * as THREE from 'three';
import {
  getSandstoneWallTexture,
  getGroundTexture,
  getWoodCrateTexture,
  getMetalDoorTexture,
  getSiteSignTexture
} from '../procedural/textures';

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  type?: 'wall' | 'crate' | 'door' | 'ramp' | 'step';
}

export interface PlantZone {
  site: 'A' | 'B';
  min: THREE.Vector3;
  max: THREE.Vector3;
  center: THREE.Vector3;
}

export interface Waypoint {
  id: number;
  name: string;
  pos: THREE.Vector3;
  connections: number[];
  teamPriority?: 'CT' | 'T' | 'BOTH';
  siteTag?: 'A' | 'B' | 'MID' | 'TUNNEL' | 'LONG' | 'SPAWN';
}

export class Dust2Map {
  public scene: THREE.Group;
  public collisionBoxes: CollisionBox[] = [];
  public plantZones: PlantZone[] = [];
  public waypoints: Waypoint[] = [];
  public spawnCT: THREE.Vector3[] = [];
  public spawnT: THREE.Vector3[] = [];

  constructor() {
    this.scene = new THREE.Group();
    this.buildMap();
    this.buildWaypoints();
  }

  private addAABB(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, type: 'wall' | 'crate' | 'door' | 'ramp' = 'wall') {
    this.collisionBoxes.push({
      min: new THREE.Vector3(Math.min(minX, maxX), Math.min(minY, maxY), Math.min(minZ, maxZ)),
      max: new THREE.Vector3(Math.max(minX, maxX), Math.max(minY, maxY), Math.max(minZ, maxZ)),
      type
    });
  }

  private createWall(
    x: number, y: number, z: number,
    width: number, height: number, depth: number,
    wallMat: THREE.Material
  ) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(x, y + height / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.addAABB(
      x - width / 2, y, z - depth / 2,
      x + width / 2, y + height, z + depth / 2,
      'wall'
    );
    return mesh;
  }

  private createCrate(
    x: number, y: number, z: number,
    size: number = 2.0,
    siteTag?: string
  ) {
    const crateMat = new THREE.MeshStandardMaterial({
      map: getWoodCrateTexture(siteTag),
      roughness: 0.8,
      metalness: 0.1
    });
    const geo = new THREE.BoxGeometry(size, size, size);
    const mesh = new THREE.Mesh(geo, crateMat);
    mesh.position.set(x, y + size / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.addAABB(
      x - size / 2, y, z - size / 2,
      x + size / 2, y + size, z + size / 2,
      'crate'
    );
    return mesh;
  }

  private createDoubleCrate(x: number, y: number, z: number, siteTag?: string) {
    this.createCrate(x, y, z, 2.0, siteTag);
    this.createCrate(x, y + 2.0, z, 2.0, siteTag);
  }

  private createRamp(
    startX: number, startY: number, startZ: number,
    endX: number, endY: number, endZ: number,
    width: number,
    wallMat: THREE.Material
  ) {
    const length = Math.hypot(endX - startX, endZ - startZ);
    const heightDiff = endY - startY;
    const geo = new THREE.BoxGeometry(width, 0.4, length);
    const mesh = new THREE.Mesh(geo, wallMat);

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const midZ = (startZ + endZ) / 2;

    mesh.position.set(midX, midY, midZ);
    const angleY = Math.atan2(endX - startX, endZ - startZ);
    const angleX = Math.atan2(heightDiff, length);

    mesh.rotation.y = angleY;
    mesh.rotation.x = -angleX;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    // Collision stepped AABBs for ramp
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const stepX = startX + (endX - startX) * t;
      const stepY = startY + (endY - startY) * t;
      const stepZ = startZ + (endZ - startZ) * t;
      const stepH = (heightDiff / steps) + 0.3;
      this.addAABB(
        stepX - width / 2, stepY - 0.2, stepZ - (length / steps) / 2,
        stepX + width / 2, stepY + stepH, stepZ + (length / steps) / 2,
        'ramp'
      );
    }
  }

  private buildMap() {
    const wallTex = getSandstoneWallTexture();
    wallTex.repeat.set(4, 2);
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.85,
      metalness: 0.05
    });

    const groundTex = getGroundTexture();
    groundTex.repeat.set(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.9,
      metalness: 0.02
    });

    // 1. GROUND PLANE (Sand & desert pavement)
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Sky / Atmosphere Dome
    const skyGeo = new THREE.SphereGeometry(150, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xc8ddf0,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);

    // Outer Boundary Walls (Keeps players inside Dust2)
    this.createWall(0, 0, -55, 140, 12, 4, wallMat);  // North wall
    this.createWall(0, 0, 60, 140, 12, 4, wallMat);   // South wall
    this.createWall(-55, 0, 0, 4, 12, 120, wallMat);  // West wall
    this.createWall(60, 0, 0, 4, 12, 120, wallMat);   // East wall

    // ==========================================
    // 2. T SPAWN (South Area: x: -30 to 10, z: 40 to 55)
    // ==========================================
    this.createWall(-10, 0, 45, 2, 7, 20, wallMat); // T spawn divider
    this.createWall(-30, 0, 38, 20, 7, 2, wallMat);
    // T Spawn Spawns
    this.spawnT = [
      new THREE.Vector3(-25, 1.0, 50),
      new THREE.Vector3(-20, 1.0, 52),
      new THREE.Vector3(-15, 1.0, 50),
      new THREE.Vector3(-10, 1.0, 52),
      new THREE.Vector3(-5, 1.0, 50)
    ];

    // ==========================================
    // 3. MID & MID DOORS (Central corridor: x: -5 to 8, z: -25 to 35)
    // ==========================================
    // West wall of Mid (separating Mid from B Lower/Tunnels)
    this.createWall(-8, 0, 10, 2, 8, 36, wallMat);
    this.createWall(-8, 0, -18, 2, 8, 16, wallMat);

    // East wall of Mid (separating Mid from Catwalk & Long)
    this.createWall(8, 0, 20, 2, 8, 24, wallMat);

    // XBOX Crate in Mid (Allows jumping to Catwalk)
    this.createCrate(5.5, 0, 8, 2.4);

    // MID DOORS (Iconic angled steel doors with sniper crack)
    const doorMat = new THREE.MeshStandardMaterial({
      map: getMetalDoorTexture('mid_door'),
      roughness: 0.6,
      metalness: 0.3
    });
    // Left Door
    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.5, 0.4), doorMat);
    leftDoor.position.set(-3.6, 3.25, -6);
    leftDoor.rotation.y = 0.22;
    leftDoor.castShadow = true;
    this.scene.add(leftDoor);
    this.addAABB(-5.8, 0, -6.8, -1.4, 6.5, -5.2, 'door');

    // Right Door
    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.5, 0.4), doorMat);
    rightDoor.position.set(3.6, 3.25, -6);
    rightDoor.rotation.y = -0.22;
    rightDoor.castShadow = true;
    this.scene.add(rightDoor);
    this.addAABB(1.4, 0, -6.8, 5.8, 6.5, -5.2, 'door');

    // ==========================================
    // 4. CATWALK & SHORT A (x: 8 to 28, z: 5 to -25, y: 3.5)
    // ==========================================
    // Elevated Catwalk Floor
    const catwalkGeo = new THREE.BoxGeometry(6, 0.6, 26);
    const catwalkMesh = new THREE.Mesh(catwalkGeo, wallMat);
    catwalkMesh.position.set(11, 3.2, 2);
    catwalkMesh.receiveShadow = true;
    this.scene.add(catwalkMesh);
    this.addAABB(8, 0, -11, 14, 3.5, 15, 'wall');

    // Catwalk stairs from Mid (Top Mid to Catwalk)
    this.createRamp(7, 0, 16, 11, 3.5, 12, 4, wallMat);

    // Short A Elbow & Wall
    this.createWall(14, 3.5, -12, 2, 5, 14, wallMat);
    this.createWall(20, 3.5, -18, 12, 5, 2, wallMat);

    // ==========================================
    // 5. LONG A (A大, Long Doors, Pit, Corner, Ramp: x: 32 to 55, z: 45 to -20)
    // ==========================================
    // Long A West Wall
    this.createWall(32, 0, 15, 2, 8, 38, wallMat);

    // Long Doors (A门 structure)
    this.createWall(38, 0, 32, 10, 8, 2, wallMat);
    this.createWall(38, 0, 24, 10, 8, 2, wallMat);
    // Double door boxes at Long Doors
    this.createDoubleCrate(36, 0, 28, 'A');

    // Pit (大坑) - Lowered area in corner
    this.createWall(54, 0, 25, 2, 7, 22, wallMat);
    this.createCrate(46, 0, 18, 2.0);

    // Blue Shipping Container at Long A Corner
    const containerMat = new THREE.MeshStandardMaterial({
      map: getMetalDoorTexture('container'),
      roughness: 0.5,
      metalness: 0.4
    });
    const container = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 8), containerMat);
    container.position.set(44, 1.75, -5);
    container.castShadow = true;
    this.scene.add(container);
    this.addAABB(42.25, 0, -9, 45.75, 3.5, -1, 'crate');

    // Long A Ramp to A Site
    this.createRamp(42, 0, -12, 34, 2.8, -22, 6, wallMat);

    // ==========================================
    // 6. BOMBSITE A (A点: x: 18 to 36, z: -20 to -35, y: 2.8)
    // ==========================================
    // A Site Platform
    const aSiteFloor = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 16), wallMat);
    aSiteFloor.position.set(26, 2.5, -27);
    aSiteFloor.receiveShadow = true;
    this.scene.add(aSiteFloor);
    this.addAABB(17, 0, -35, 35, 2.8, -19, 'wall');

    // A Site Boxes (Default Triple boxes & Ninja corner)
    this.createDoubleCrate(24, 2.8, -26, 'A');
    this.createCrate(26, 2.8, -26, 2.0, 'A');
    this.createCrate(24, 2.8, -28, 2.0, 'A');

    // Goose Wall / Back of A
    this.createWall(26, 2.8, -35, 18, 6, 2, wallMat);
    this.createWall(35, 2.8, -27, 2, 6, 16, wallMat);

    // Ramp from A Site down to CT Spawn
    this.createRamp(20, 2.8, -32, 14, 0, -38, 5, wallMat);

    // A Site Decal on Box
    const signAGeo = new THREE.PlaneGeometry(3, 3);
    const signAMat = new THREE.MeshBasicMaterial({
      map: getSiteSignTexture('A'),
      transparent: true,
      depthWrite: false
    });
    const signAMesh = new THREE.Mesh(signAGeo, signAMat);
    signAMesh.position.set(26, 4.5, -33.9);
    this.scene.add(signAMesh);

    // A Plant Zone Definition
    this.plantZones.push({
      site: 'A',
      min: new THREE.Vector3(18, 2.0, -32),
      max: new THREE.Vector3(32, 5.0, -22),
      center: new THREE.Vector3(25, 2.8, -27)
    });

    // ==========================================
    // 7. B TUNNELS (B洞: Upper B & Lower B: x: -45 to -12, z: -18 to 25)
    // ==========================================
    // Lower B Tunnels (connects Mid to Upper B)
    this.createWall(-18, 0, 18, 16, 7, 2, wallMat);
    this.createWall(-22, 0, 8, 20, 7, 2, wallMat);
    this.createRamp(-14, 0, 12, -26, 2.8, 4, 5, wallMat);

    // Upper B Tunnels (corridor leading to B Site)
    this.createWall(-44, 0, 5, 2, 7, 26, wallMat);
    this.createWall(-32, 0, 2, 2, 7, 18, wallMat);
    // Tunnel Roof for immersive tunnel atmosphere
    const tunnelRoof = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 24), wallMat);
    tunnelRoof.position.set(-38, 6.8, 5);
    this.scene.add(tunnelRoof);

    // B Tunnel Exit to B Site
    this.createWall(-38, 0, -14, 8, 7, 2, wallMat);

    // ==========================================
    // 8. BOMBSITE B (B点: x: -48 to -18, z: -18 to -44)
    // ==========================================
    // B Platform (Elevated platform near tunnel exit)
    const bPlatform = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 12), wallMat);
    bPlatform.position.set(-40, 1.8, -22);
    bPlatform.receiveShadow = true;
    this.scene.add(bPlatform);
    this.addAABB(-47, 0, -28, -33, 2.1, -16, 'wall');

    // B Site Crates (Default double stack & Big Box)
    this.createDoubleCrate(-30, 0, -28, 'B');
    this.createCrate(-32, 0, -28, 2.0, 'B');
    this.createCrate(-28, 0, -32, 2.0, 'B');

    // Back of B (暗角 & Car area)
    this.createWall(-48, 0, -35, 2, 8, 20, wallMat);
    this.createWall(-35, 0, -44, 26, 8, 2, wallMat);

    // B Doors & B Window (Connecting B site to CT Mid)
    this.createWall(-18, 0, -32, 2, 8, 12, wallMat); // B Door frame
    this.createWall(-18, 0, -40, 2, 5, 6, wallMat);  // B Window ledge (crouch/jumpable)
    this.addAABB(-19, 0, -43, -17, 2.2, -37, 'wall');

    // B Site Decal
    const signBGeo = new THREE.PlaneGeometry(3, 3);
    const signBMat = new THREE.MeshBasicMaterial({
      map: getSiteSignTexture('B'),
      transparent: true,
      depthWrite: false
    });
    const signBMesh = new THREE.Mesh(signBGeo, signBMat);
    signBMesh.position.set(-35, 4.5, -42.9);
    this.scene.add(signBMesh);

    // B Plant Zone Definition
    this.plantZones.push({
      site: 'B',
      min: new THREE.Vector3(-38, 0, -36),
      max: new THREE.Vector3(-24, 4.0, -22),
      center: new THREE.Vector3(-30, 0.5, -28)
    });

    // ==========================================
    // 9. CT SPAWN (CT出生点: x: 0 to 22, z: -35 to -50)
    // ==========================================
    this.createWall(5, 0, -44, 24, 7, 2, wallMat);
    this.createCrate(2, 0, -40, 2.0);
    this.createCrate(12, 0, -42, 2.0);

    // CT Spawn Points
    this.spawnCT = [
      new THREE.Vector3(6, 1.0, -46),
      new THREE.Vector3(10, 1.0, -46),
      new THREE.Vector3(14, 1.0, -46),
      new THREE.Vector3(2, 1.0, -46),
      new THREE.Vector3(18, 1.0, -46)
    ];

    // Tactical Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.65);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.1);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    this.scene.add(sunLight);
  }

  // Waypoints for Bot Navigation (Graph covering all Dust2 paths)
  private buildWaypoints() {
    this.waypoints = [
      // T Spawn area (0-4)
      { id: 0, name: 'T Spawn Main', pos: new THREE.Vector3(-15, 0, 48), connections: [1, 2, 3], teamPriority: 'T', siteTag: 'SPAWN' },
      { id: 1, name: 'T Spawn to Long', pos: new THREE.Vector3(10, 0, 46), connections: [0, 4], teamPriority: 'T', siteTag: 'LONG' },
      { id: 2, name: 'T Spawn to Mid', pos: new THREE.Vector3(-2, 0, 38), connections: [0, 6], teamPriority: 'T', siteTag: 'MID' },
      { id: 3, name: 'T Spawn to Tunnels', pos: new THREE.Vector3(-30, 0, 35), connections: [0, 18], teamPriority: 'T', siteTag: 'TUNNEL' },

      // Long A Route (4-10)
      { id: 4, name: 'Long Doors Outside', pos: new THREE.Vector3(36, 0, 38), connections: [1, 5], teamPriority: 'T', siteTag: 'LONG' },
      { id: 5, name: 'Long Doors Inside', pos: new THREE.Vector3(36, 0, 20), connections: [4, 7, 8], teamPriority: 'BOTH', siteTag: 'LONG' },
      { id: 6, name: 'Top Mid', pos: new THREE.Vector3(0, 0, 22), connections: [2, 11, 12, 19], teamPriority: 'BOTH', siteTag: 'MID' },
      { id: 7, name: 'Pit', pos: new THREE.Vector3(48, 0, 18), connections: [5, 8], teamPriority: 'BOTH', siteTag: 'LONG' },
      { id: 8, name: 'Long Alley', pos: new THREE.Vector3(42, 0, 2), connections: [5, 7, 9], teamPriority: 'BOTH', siteTag: 'LONG' },
      { id: 9, name: 'Long Corner / Car', pos: new THREE.Vector3(40, 0, -8), connections: [8, 10], teamPriority: 'BOTH', siteTag: 'LONG' },
      { id: 10, name: 'Long Ramp to A', pos: new THREE.Vector3(34, 1.5, -16), connections: [9, 15], teamPriority: 'BOTH', siteTag: 'LONG' },

      // Mid & Catwalk Route (11-14)
      { id: 11, name: 'Mid Xbox', pos: new THREE.Vector3(0, 0, 4), connections: [6, 13, 14], teamPriority: 'BOTH', siteTag: 'MID' },
      { id: 12, name: 'Mid Catwalk Stairs', pos: new THREE.Vector3(10, 2.5, 14), connections: [6, 13], teamPriority: 'BOTH', siteTag: 'MID' },
      { id: 13, name: 'Catwalk', pos: new THREE.Vector3(11, 3.5, 0), connections: [11, 12, 14], teamPriority: 'BOTH', siteTag: 'A' },
      { id: 14, name: 'Short A Stairs', pos: new THREE.Vector3(18, 3.5, -14), connections: [13, 16], teamPriority: 'BOTH', siteTag: 'A' },

      // Bombsite A (15-17)
      { id: 15, name: 'A Site Platform', pos: new THREE.Vector3(25, 2.8, -26), connections: [10, 16, 17, 26], teamPriority: 'BOTH', siteTag: 'A' },
      { id: 16, name: 'A Short Entrance', pos: new THREE.Vector3(22, 3.5, -20), connections: [14, 15], teamPriority: 'BOTH', siteTag: 'A' },
      { id: 17, name: 'Goose / Back of A', pos: new THREE.Vector3(26, 2.8, -32), connections: [15, 27], teamPriority: 'CT', siteTag: 'A' },

      // B Tunnels Route (18-21)
      { id: 18, name: 'Outside Tunnels', pos: new THREE.Vector3(-36, 0, 22), connections: [3, 19, 20], teamPriority: 'T', siteTag: 'TUNNEL' },
      { id: 19, name: 'Lower B Tunnels', pos: new THREE.Vector3(-20, 0, 14), connections: [6, 18, 20], teamPriority: 'BOTH', siteTag: 'TUNNEL' },
      { id: 20, name: 'Upper B Tunnels', pos: new THREE.Vector3(-38, 2.0, 4), connections: [18, 19, 21], teamPriority: 'BOTH', siteTag: 'TUNNEL' },
      { id: 21, name: 'Upper B Exit', pos: new THREE.Vector3(-38, 2.0, -16), connections: [20, 22], teamPriority: 'BOTH', siteTag: 'TUNNEL' },

      // Bombsite B (22-25)
      { id: 22, name: 'B Platform', pos: new THREE.Vector3(-38, 2.0, -24), connections: [21, 23, 24], teamPriority: 'BOTH', siteTag: 'B' },
      { id: 23, name: 'B Site Center (Plant)', pos: new THREE.Vector3(-28, 0, -28), connections: [22, 24, 25], teamPriority: 'BOTH', siteTag: 'B' },
      { id: 24, name: 'Back of B / Car', pos: new THREE.Vector3(-42, 0, -36), connections: [22, 23], teamPriority: 'CT', siteTag: 'B' },
      { id: 25, name: 'B Doors / Window', pos: new THREE.Vector3(-18, 0, -34), connections: [23, 28], teamPriority: 'BOTH', siteTag: 'B' },

      // CT Spawn & CT Mid Connectors (26-29)
      { id: 26, name: 'CT Mid Doors', pos: new THREE.Vector3(0, 0, -14), connections: [11, 27, 28], teamPriority: 'BOTH', siteTag: 'MID' },
      { id: 27, name: 'CT Spawn Main', pos: new THREE.Vector3(8, 0, -42), connections: [15, 17, 26, 28], teamPriority: 'CT', siteTag: 'SPAWN' },
      { id: 28, name: 'CT to B Ramp', pos: new THREE.Vector3(-10, 0, -36), connections: [25, 26, 27], teamPriority: 'CT', siteTag: 'B' }
    ];
  }
}

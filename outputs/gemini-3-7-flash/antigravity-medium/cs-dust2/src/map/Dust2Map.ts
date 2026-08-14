import * as THREE from 'three';
import { ProceduralTextures } from '../textures/ProceduralTextures';

export interface MapCollider {
  box: THREE.Box3;
  type: 'wall' | 'crate' | 'door' | 'ground' | 'slope';
  materialType?: 'concrete' | 'wood' | 'metal';
  mesh?: THREE.Object3D;
}

export class Dust2Map {
  public group: THREE.Group;
  public colliders: MapCollider[] = [];
  public siteAZone: THREE.Box3;
  public siteBZone: THREE.Box3;

  private sandMat: THREE.MeshStandardMaterial;
  private wallMat: THREE.MeshStandardMaterial;
  private crateMat: THREE.MeshStandardMaterial;
  private doorMat: THREE.MeshStandardMaterial;
  private darkTunnelMat: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();

    // Setup materials with procedural textures
    const sandTex = ProceduralTextures.getSandGround();
    sandTex.repeat.set(24, 24);
    this.sandMat = new THREE.MeshStandardMaterial({
      map: sandTex,
      roughness: 0.9,
      metalness: 0.05,
    });

    const wallTex = ProceduralTextures.getSandstoneWall();
    wallTex.repeat.set(4, 2);
    this.wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.85,
      metalness: 0.1,
    });

    const crateTex = ProceduralTextures.getWoodCrate();
    this.crateMat = new THREE.MeshStandardMaterial({
      map: crateTex,
      roughness: 0.75,
      metalness: 0.1,
    });

    const doorTex = ProceduralTextures.getMetalDoor();
    this.doorMat = new THREE.MeshStandardMaterial({
      map: doorTex,
      roughness: 0.5,
      metalness: 0.6,
    });

    this.darkTunnelMat = new THREE.MeshStandardMaterial({
      color: 0x3d352b,
      roughness: 0.95,
      metalness: 0.05,
    });

    // Bomb site bounding boxes
    this.siteAZone = new THREE.Box3(
      new THREE.Vector3(15, 0, -50),
      new THREE.Vector3(35, 6, -30)
    );

    this.siteBZone = new THREE.Box3(
      new THREE.Vector3(-55, 0, -45),
      new THREE.Vector3(-35, 6, -25)
    );

    this.buildMap();
  }

  // Helper to add a block / wall with automatic collider
  private addBlock(
    x: number, y: number, z: number,
    w: number, h: number, d: number,
    material: THREE.Material,
    matType: 'concrete' | 'wood' | 'metal' = 'concrete',
    repeatU = 1, repeatV = 1
  ): THREE.Mesh {
    const geom = new THREE.BoxGeometry(w, h, d);
    // Custom UV repeat if needed
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    const halfW = w / 2;
    const halfH = h / 2;
    const halfD = d / 2;
    const box = new THREE.Box3(
      new THREE.Vector3(x - halfW, y, z - halfD),
      new THREE.Vector3(x + halfW, y + h, z + halfD)
    );

    this.colliders.push({
      box,
      type: matType === 'wood' ? 'crate' : matType === 'metal' ? 'door' : 'wall',
      materialType: matType,
      mesh,
    });

    return mesh;
  }

  // Build the complete Dust2 layout
  private buildMap() {
    // 1. Ground Floor (Large foundation)
    const groundGeom = new THREE.PlaneGeometry(240, 240);
    const groundMesh = new THREE.Mesh(groundGeom, this.sandMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, 0, 0);
    groundMesh.receiveShadow = true;
    this.group.add(groundMesh);

    // Ground collider
    this.colliders.push({
      box: new THREE.Box3(new THREE.Vector3(-120, -10, -120), new THREE.Vector3(120, 0, 120)),
      type: 'ground',
      materialType: 'concrete',
    });

    // Outer Boundary Walls (Perimeter)
    const wallHeight = 8;
    this.addBlock(0, 0, 75, 140, wallHeight, 4, this.wallMat); // South perimeter
    this.addBlock(0, 0, -75, 140, wallHeight, 4, this.wallMat); // North perimeter
    this.addBlock(70, 0, 0, 4, wallHeight, 150, this.wallMat); // East perimeter
    this.addBlock(-70, 0, 0, 4, wallHeight, 150, this.wallMat); // West perimeter

    // ==========================================
    // 2. T SPAWN & SUICIDE / T MID
    // ==========================================
    // T Spawn back structure & walls
    this.addBlock(-20, 0, 60, 4, wallHeight, 26, this.wallMat);
    this.addBlock(20, 0, 60, 4, wallHeight, 26, this.wallMat);
    // T Spawn crates
    this.addBlock(-8, 0, 58, 2.5, 2.5, 2.5, this.crateMat, 'wood');
    this.addBlock(10, 0, 55, 3, 2, 2, this.crateMat, 'wood');

    // T Mid / Suicide ramp walls
    this.addBlock(-6, 0, 35, 2, wallHeight, 25, this.wallMat);
    this.addBlock(6, 0, 35, 2, wallHeight, 25, this.wallMat);

    // ==========================================
    // 3. LONG A (A大), LONG DOORS, PIT (大坑)
    // ==========================================
    // Wall separating T-Spawn to Long Outside
    this.addBlock(32, 0, 55, 20, wallHeight, 4, this.wallMat);
    // T-to-Long Double Doors
    this.addBlock(28, 0, 42, 3, wallHeight, 1, this.doorMat, 'metal');
    this.addBlock(36, 0, 42, 3, wallHeight, 1, this.doorMat, 'metal');
    // Long House / Doors Room Walls
    this.addBlock(22, 0, 35, 2, wallHeight, 20, this.wallMat);
    this.addBlock(42, 0, 35, 2, wallHeight, 20, this.wallMat);
    this.addBlock(32, wallHeight - 1, 35, 20, 2, 20, this.wallMat); // roof

    // Long Corner to Long A Roadway
    this.addBlock(42, 0, 0, 4, wallHeight, 50, this.wallMat); // East wall of Long A
    this.addBlock(26, 0, 10, 4, wallHeight, 30, this.wallMat); // West wall of Long A

    // Long A Pit (大坑) - Lower ground & pit ramp
    this.addBlock(48, 0, 25, 12, 1.5, 14, this.wallMat); // Pit wall border
    this.addBlock(45, 0, 28, 6, 1.2, 4, this.crateMat, 'wood'); // Pit crate

    // Long A Blue Container / Long Crates
    this.addBlock(36, 0, 2, 3, 3, 6, this.doorMat, 'metal');
    this.addBlock(38, 0, -15, 3.5, 3, 3.5, this.crateMat, 'wood'); // Long Car/Crate corner

    // Long A Ramp up to A Site
    this.addBlock(30, 0, -28, 8, 1.5, 10, this.wallMat); // Ramp foundation

    // ==========================================
    // 4. A SITE (A点), GOOSE, ELEVATOR & CT RAMP
    // ==========================================
    // A Site elevated platform (y = 1.6)
    this.addBlock(24, 0, -42, 20, 1.6, 22, this.wallMat);

    // Site A Decal
    this.addSiteDecal(24, 1.65, -42, 'A');

    // Default Plant Boxes (CS double box & ninja corner)
    this.addBlock(22, 1.6, -42, 2.5, 2.5, 2.5, this.crateMat, 'wood');
    this.addBlock(22, 4.1, -42, 2.2, 2.2, 2.2, this.crateMat, 'wood');
    this.addBlock(25, 1.6, -42, 2.5, 2.5, 2.5, this.crateMat, 'wood');
    this.addBlock(20, 1.6, -38, 2.2, 2.2, 2.2, this.crateMat, 'wood'); // Triple box

    // Goose Corner & North Wall
    this.addBlock(24, 0, -56, 24, wallHeight, 4, this.wallMat);
    this.addBlock(38, 0, -42, 4, wallHeight, 26, this.wallMat);

    // CT Ramp down to CT Spawn
    this.addBlock(14, 0, -46, 6, 0.8, 12, this.wallMat);

    // ==========================================
    // 5. MID / MID DOORS / XBOX / CATWALK
    // ==========================================
    // Mid Courtyard walls
    this.addBlock(10, 0, 12, 4, wallHeight, 28, this.wallMat); // East Mid wall
    this.addBlock(-8, 0, 15, 4, wallHeight, 24, this.wallMat); // West Mid wall

    // Xbox (Classic jump crate at Mid)
    this.addBlock(4, 0, 4, 3.2, 3.2, 3.2, this.crateMat, 'wood');

    // Mid Double Doors (Mid Doors with playable gap)
    // Left door (slightly ajar)
    this.addBlock(-2.8, 0, -12, 3.6, wallHeight, 0.8, this.doorMat, 'metal');
    // Right door (slightly ajar)
    this.addBlock(3.2, 0, -11.5, 3.4, wallHeight, 0.8, this.doorMat, 'metal');
    // Mid door archway top
    this.addBlock(0, 5.5, -12, 12, 2.5, 2, this.wallMat);

    // Catwalk / Short A (Stairs from lower mid to A short)
    // Catwalk Ledge (y = 3.5)
    this.addBlock(11, 0, -10, 5, 3.5, 22, this.wallMat);
    // Catwalk stairs
    this.addBlock(8, 0, 2, 4, 1.8, 4, this.wallMat);
    // Short A Path connecting Catwalk to A Site
    this.addBlock(14, 0, -26, 8, 3.5, 12, this.wallMat);
    // Short A stairs to A site platform
    this.addBlock(16, 0, -32, 6, 2.2, 6, this.wallMat);

    // Wall separating Short A from Mid
    this.addBlock(6, 3.5, -22, 2, 5, 20, this.wallMat);

    // ==========================================
    // 6. B TUNNELS (Upper & Lower)
    // ==========================================
    // Lower B Tunnel (from Mid to Upper Tunnel)
    this.addBlock(-18, 0, 10, 16, wallHeight, 4, this.darkTunnelMat);
    this.addBlock(-18, 0, 2, 16, wallHeight, 4, this.darkTunnelMat);
    this.addBlock(-18, wallHeight - 1, 6, 16, 2, 12, this.darkTunnelMat); // roof

    // Upper B Tunnel (Long corridor with vaulted arches)
    this.addBlock(-32, 0, 15, 4, wallHeight, 35, this.darkTunnelMat); // East wall
    this.addBlock(-46, 0, 15, 4, wallHeight, 35, this.darkTunnelMat); // West wall
    this.addBlock(-39, wallHeight - 1, 15, 16, 2, 35, this.darkTunnelMat); // roof
    // Tunnel stairs to B site
    this.addBlock(-39, 0, -3, 12, 1.5, 8, this.darkTunnelMat);

    // ==========================================
    // 7. B SITE (B点), B DOORS, B WINDOW & PLATFORM
    // ==========================================
    // B Site enclosed perimeter
    this.addBlock(-30, 0, -20, 4, wallHeight, 18, this.wallMat); // East wall
    this.addBlock(-62, 0, -35, 4, wallHeight, 34, this.wallMat); // West wall
    this.addBlock(-45, 0, -52, 36, wallHeight, 4, this.wallMat); // North wall

    // B Platform (y = 1.5)
    this.addBlock(-50, 0, -38, 16, 1.5, 18, this.wallMat);

    // Site B Decal
    this.addSiteDecal(-44, 1.55, -34, 'B');

    // B Site Crates & Plant Cover
    this.addBlock(-45, 0, -32, 2.5, 2.5, 2.5, this.crateMat, 'wood');
    this.addBlock(-45, 2.5, -32, 2.2, 2.2, 2.2, this.crateMat, 'wood');
    this.addBlock(-42, 0, -32, 2.5, 2.5, 2.5, this.crateMat, 'wood');
    this.addBlock(-52, 1.5, -42, 3, 2.5, 3, this.crateMat, 'wood'); // Back plat crates
    this.addBlock(-38, 0, -42, 2.5, 2.5, 2.5, this.crateMat, 'wood'); // Car/door crate

    // B Window (elevated opening from Mid/CT)
    this.addBlock(-28, 2.5, -28, 4, 3, 4, this.wallMat); // Window sill
    this.addBlock(-28, 0, -28, 4, 2.5, 4, this.wallMat); // Lower wall under window

    // B Doors (Metal door frame leading to CT Mid)
    this.addBlock(-30, 0, -38, 1, wallHeight, 3.5, this.doorMat, 'metal');

    // ==========================================
    // 8. CT SPAWN & CT MID
    // ==========================================
    // CT Spawn Area
    this.addBlock(0, 0, -60, 30, wallHeight, 4, this.wallMat);
    this.addBlock(-15, 0, -50, 4, wallHeight, 20, this.wallMat);
    this.addBlock(0, 0, -48, 4, 2.5, 4, this.crateMat, 'wood'); // CT Spawn boxes

    // Pathway from CT to Mid
    this.addBlock(-6, 0, -30, 4, wallHeight, 22, this.wallMat);
  }

  // Paint Bomb site decal onto ground
  private addSiteDecal(x: number, y: number, z: number, site: 'A' | 'B') {
    const decalTex = ProceduralTextures.getSiteDecal(site);
    const mat = new THREE.MeshBasicMaterial({
      map: decalTex,
      transparent: true,
      depthWrite: false,
    });
    const geom = new THREE.PlaneGeometry(6, 6);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y + 0.02, z);
    this.group.add(mesh);
  }

  // Raycast against all map colliders for bullet impact / line of sight
  public raycast(origin: THREE.Vector3, direction: THREE.Vector3, maxDist: number = 200): {
    hit: boolean;
    distance: number;
    point: THREE.Vector3;
    normal: THREE.Vector3;
    materialType: 'concrete' | 'wood' | 'metal';
  } | null {
    const ray = new THREE.Ray(origin, direction.clone().normalize());
    let closestDist = maxDist;
    let closestHit: {
      distance: number;
      point: THREE.Vector3;
      normal: THREE.Vector3;
      materialType: 'concrete' | 'wood' | 'metal';
    } | null = null;

    const intersectionPoint = new THREE.Vector3();

    for (const collider of this.colliders) {
      if (ray.intersectBox(collider.box, intersectionPoint)) {
        const dist = origin.distanceTo(intersectionPoint);
        if (dist < closestDist) {
          closestDist = dist;

          // Calculate box surface normal
          const normal = new THREE.Vector3();
          const center = collider.box.getCenter(new THREE.Vector3());
          const size = collider.box.getSize(new THREE.Vector3());
          const rel = intersectionPoint.clone().sub(center);
          rel.x /= size.x / 2;
          rel.y /= size.y / 2;
          rel.z /= size.z / 2;

          const absX = Math.abs(rel.x);
          const absY = Math.abs(rel.y);
          const absZ = Math.abs(rel.z);

          if (absX > absY && absX > absZ) {
            normal.set(Math.sign(rel.x), 0, 0);
          } else if (absY > absX && absY > absZ) {
            normal.set(0, Math.sign(rel.y), 0);
          } else {
            normal.set(0, 0, Math.sign(rel.z));
          }

          closestHit = {
            distance: dist,
            point: intersectionPoint.clone(),
            normal,
            materialType: collider.materialType || 'concrete',
          };
        }
      }
    }

    if (closestHit) {
      return { hit: true, ...closestHit };
    }
    return null;
  }

  // Resolve player / entity box collisions against world
  public checkEntityCollision(
    pos: THREE.Vector3,
    radius = 0.5,
    height = 1.8
  ): { position: THREE.Vector3; isGrounded: boolean; collidedWithWall: boolean } {
    const nextPos = pos.clone();
    let isGrounded = false;
    let collidedWithWall = false;

    const playerBox = new THREE.Box3(
      new THREE.Vector3(nextPos.x - radius, nextPos.y, nextPos.z - radius),
      new THREE.Vector3(nextPos.x + radius, nextPos.y + height, nextPos.z + radius)
    );

    for (const collider of this.colliders) {
      if (playerBox.intersectsBox(collider.box)) {
        // Calculate overlap on all axes
        const overlapX1 = collider.box.max.x - playerBox.min.x;
        const overlapX2 = playerBox.max.x - collider.box.min.x;
        const overlapX = Math.min(overlapX1, overlapX2);

        const overlapZ1 = collider.box.max.z - playerBox.min.z;
        const overlapZ2 = playerBox.max.z - collider.box.min.z;
        const overlapZ = Math.min(overlapZ1, overlapZ2);

        const overlapY1 = collider.box.max.y - playerBox.min.y; // standing on top
        const overlapY2 = playerBox.max.y - collider.box.min.y; // hitting ceiling

        // Step up / ground check
        if (overlapY1 < 0.6 && pos.y >= collider.box.max.y - 0.4) {
          nextPos.y = collider.box.max.y;
          isGrounded = true;
          playerBox.min.y = nextPos.y;
          playerBox.max.y = nextPos.y + height;
          continue;
        }

        // Push out horizontally along smallest penetration axis
        if (overlapX < overlapZ) {
          if (overlapX1 < overlapX2) {
            nextPos.x += overlapX;
          } else {
            nextPos.x -= overlapX;
          }
          collidedWithWall = true;
        } else {
          if (overlapZ1 < overlapZ2) {
            nextPos.z += overlapZ;
          } else {
            nextPos.z -= overlapZ;
          }
          collidedWithWall = true;
        }

        // Update player box
        playerBox.min.x = nextPos.x - radius;
        playerBox.max.x = nextPos.x + radius;
        playerBox.min.z = nextPos.z - radius;
        playerBox.max.z = nextPos.z + radius;
      }
    }

    if (nextPos.y <= 0) {
      nextPos.y = 0;
      isGrounded = true;
    }

    return { position: nextPos, isGrounded, collidedWithWall };
  }

  // Check if position is inside Bomb Site A or B
  public getBombSiteAt(pos: THREE.Vector3): 'A' | 'B' | null {
    if (this.siteAZone.containsPoint(pos)) return 'A';
    if (this.siteBZone.containsPoint(pos)) return 'B';
    return null;
  }
}

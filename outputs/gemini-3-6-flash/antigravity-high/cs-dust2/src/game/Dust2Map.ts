import * as THREE from 'three';
import { proceduralTextures } from './ProceduralTextures';
import { PhysicsEngine } from './Physics';

export class Dust2Map {
  public sceneGroup: THREE.Group = new THREE.Group();
  public plantZoneA: THREE.Box3;
  public plantZoneB: THREE.Box3;

  constructor() {
    PhysicsEngine.clearColliders();

    // Plant zones definition
    this.plantZoneA = new THREE.Box3(
      new THREE.Vector3(34, 0, -22),
      new THREE.Vector3(46, 4, -10)
    );

    this.plantZoneB = new THREE.Box3(
      new THREE.Vector3(-46, 0, -32),
      new THREE.Vector3(-34, 4, -20)
    );

    this.buildGroundAndSky();
    this.buildMapStructures();
    this.buildCoverCrates();
    this.buildLighting();
  }

  private buildGroundAndSky() {
    // Ground
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorTex = proceduralTextures.getFloorTexture();
    floorTex.repeat.set(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.9,
      metalness: 0.1
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    this.sceneGroup.add(floorMesh);

    // Sky Dome / Sky background box
    const skyGeo = new THREE.BoxGeometry(200, 100, 200);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x7eb5e6,
      side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.y = 45;
    this.sceneGroup.add(skyMesh);
  }

  private addWall(x: number, y: number, z: number, w: number, h: number, d: number, color?: number) {
    const wallGeo = new THREE.BoxGeometry(w, h, d);
    const sandTex = proceduralTextures.getSandWallTexture();
    const wallMat = new THREE.MeshStandardMaterial({
      map: sandTex,
      color: color || 0xffffff,
      roughness: 0.85
    });

    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(x, y, z);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    this.sceneGroup.add(wallMesh);

    // Physics bounding box
    const box = new THREE.Box3().setFromObject(wallMesh);
    PhysicsEngine.addCollider(box);
    return wallMesh;
  }

  private addCrate(x: number, y: number, z: number, w: number, h: number, d: number) {
    const crateGeo = new THREE.BoxGeometry(w, h, d);
    const woodTex = proceduralTextures.getWoodBoxTexture();
    const crateMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.7
    });

    const crateMesh = new THREE.Mesh(crateGeo, crateMat);
    crateMesh.position.set(x, y + h / 2, z);
    crateMesh.castShadow = true;
    crateMesh.receiveShadow = true;
    this.sceneGroup.add(crateMesh);

    const box = new THREE.Box3().setFromObject(crateMesh);
    PhysicsEngine.addCollider(box);
    return crateMesh;
  }

  private buildMapStructures() {
    const wallH = 6;
    const wallY = wallH / 2;

    // 1. Outer Boundaries
    this.addWall(0, wallY, 70, 160, wallH, 4); // South (Behind T Spawn)
    this.addWall(0, wallY, -70, 160, wallH, 4); // North (Behind CT Spawn)
    this.addWall(70, wallY, 0, 4, wallH, 140); // East (Long A outer)
    this.addWall(-70, wallY, 0, 4, wallH, 140); // West (B outer)

    // 2. Long A Corridor & Wall Dividers
    this.addWall(30, wallY, 35, 4, wallH, 50); // Long A Inner Wall dividing Mid & Long A
    this.addWall(55, wallY, 15, 26, wallH, 4); // Long A Doors / Corner divider

    // 3. A Site Platform & Goose Area
    this.addWall(40, 1, -16, 16, 2, 16, 0xdfd2b5); // A Site Raised Platform
    this.addWall(55, wallY, -16, 4, wallH, 30); // A Site back wall
    this.addWall(40, wallY, -32, 30, wallH, 4); // A Ramp / Goose back wall

    // 4. Catwalk / Short A
    this.addWall(20, wallY, 10, 4, wallH, 20); // Catwalk outer rail wall
    this.addWall(20, 1.5, 0, 14, 3, 10, 0xdfd2b5); // Raised catwalk ledge

    // 5. Mid Doors & Suicide
    this.addWall(-15, wallY, 25, 4, wallH, 40); // Mid West Wall (separating Mid & B Tunnels)
    this.addWall(15, wallY, 25, 4, wallH, 40); // Mid East Wall

    // Mid Double Doors (with gap in center for shooting/traversing)
    const doorTex = proceduralTextures.getMetalDoorTexture();
    const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.5 });
    
    // Left Door
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 0.4), doorMat);
    doorL.position.set(-3.5, 2.5, 2);
    doorL.rotation.y = 0.3; // Slightly open
    this.sceneGroup.add(doorL);
    PhysicsEngine.addCollider(new THREE.Box3().setFromObject(doorL));

    // Right Door
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 0.4), doorMat);
    doorR.position.set(3.5, 2.5, 1);
    doorR.rotation.y = -0.4;
    this.sceneGroup.add(doorR);
    PhysicsEngine.addCollider(new THREE.Box3().setFromObject(doorR));

    // 6. B Tunnels / Upper B
    this.addWall(-45, wallY, 30, 24, wallH, 4); // Upper B south tunnel wall
    this.addWall(-55, wallY, 10, 4, wallH, 36); // Upper B west wall
    this.addWall(-35, wallY, 10, 4, wallH, 36); // Tunnel east divider wall

    // Tunnel Ceiling (Upper B Tunnel roof)
    const tunnelRoof = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.5, 36),
      new THREE.MeshStandardMaterial({ color: 0x9e8b70, roughness: 0.9 })
    );
    tunnelRoof.position.set(-45, wallH, 20);
    this.sceneGroup.add(tunnelRoof);

    // 7. B Site & B Platform
    this.addWall(-40, 1, -26, 18, 2, 18, 0xdfd2b5); // B Site Raised Platform
    this.addWall(-55, wallY, -26, 4, wallH, 30); // B Site West Wall
    this.addWall(-40, wallY, -40, 30, wallH, 4); // B Back Wall
    this.addWall(-25, wallY, -26, 4, wallH, 24); // B Doors / Window Divider Wall

    // B Doors
    const bDoor = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 0.4), doorMat);
    bDoor.position.set(-25, 2.5, -15);
    bDoor.rotation.y = 0.5;
    this.sceneGroup.add(bDoor);
    PhysicsEngine.addCollider(new THREE.Box3().setFromObject(bDoor));

    // 8. CT Spawn & CT Mid Connector
    this.addWall(0, wallY, -45, 30, wallH, 4); // CT Spawn Back Wall
    this.addWall(-15, wallY, -35, 4, wallH, 16); // CT Ramp to B
    this.addWall(15, wallY, -35, 4, wallH, 16); // CT Ramp to A
  }

  private buildCoverCrates() {
    // A Site Crates (Default plant spots & Goose boxes)
    this.addCrate(40, 2, -15, 2, 2, 2); // Plant box A
    this.addCrate(42, 2, -15, 2, 2, 2);
    this.addCrate(40, 4, -15, 1.8, 1.8, 1.8);
    this.addCrate(36, 0, -10, 2.5, 2.5, 2.5); // A Ramp cover box
    this.addCrate(48, 0, -28, 2.5, 2.5, 2.5); // Goose box

    // Long A Crates
    this.addCrate(42, 0, 35, 2.5, 2.5, 2.5);
    this.addCrate(44, 0, 35, 2.5, 2.5, 2.5);
    this.addCrate(43, 2.5, 35, 2.2, 2.2, 2.2);
    this.addCrate(48, 0, 10, 2, 2, 2); // Pit box

    // Mid Crates (Xbox & Mid doors cover)
    this.addCrate(10, 0, 8, 3, 3, 3); // X-Box at Catwalk entrance!
    this.addCrate(-4, 0, -10, 2.5, 2.5, 2.5); // CT Mid box

    // B Site Crates (Default plant spots & B Car)
    this.addCrate(-40, 2, -25, 2.2, 2.2, 2.2); // Plant box B
    this.addCrate(-42, 2, -25, 2.2, 2.2, 2.2);
    this.addCrate(-40, 4, -25, 2, 2, 2);
    this.addCrate(-32, 0, -20, 2.5, 2.5, 2.5); // B Doors stack
    this.addCrate(-48, 0, -15, 2.5, 2.5, 2.5); // B Back plat box

    // T Spawn Crates
    this.addCrate(-5, 0, 58, 2, 2, 2);
    this.addCrate(5, 0, 58, 2, 2, 2);
  }

  private buildLighting() {
    // Sunlight (Directional)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(60, 90, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const d = 80;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.sceneGroup.add(sunLight);

    // Ambient desert fill light
    const ambLight = new THREE.AmbientLight(0xdbe6ff, 0.6);
    this.sceneGroup.add(ambLight);

    // Hemisphere light for ground bounce
    const hemiLight = new THREE.HemisphereLight(0xfff5e6, 0x6e6252, 0.4);
    this.sceneGroup.add(hemiLight);
  }

  public isPositionInPlantZone(pos: THREE.Vector3): 'A' | 'B' | null {
    if (this.plantZoneA.containsPoint(pos)) return 'A';
    if (this.plantZoneB.containsPoint(pos)) return 'B';
    return null;
  }
}

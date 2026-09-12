import * as THREE from 'three';
import { AABB, Vec3 } from '../types';

export interface MapCollider {
  box: AABB;
  mesh?: THREE.Mesh;
}

export interface SiteZone {
  name: 'A' | 'B';
  center: Vec3;
  radius: number;
}

// Dust2 map layout - all coordinates in meters
// X: east(+)/west(-), Z: south(+ T side)/north(- CT side), Y: up
export class Dust2Map {
  colliders: MapCollider[] = [];
  siteZones: SiteZone[] = [];
  spawnPoints: { CT: Vec3[]; T: Vec3[] } = { CT: [], T: [] };
  navPoints: Vec3[] = [];
  private scene: THREE.Scene;
  private materials: Record<string, THREE.MeshLambertMaterial> = {};

  // Key positions for AI navigation
  readonly POSITIONS = {
    T_SPAWN: { x: 0, y: 0, z: 42 },
    CT_SPAWN: { x: 18, y: 0, z: -22 },
    A_SITE: { x: 28, y: 0, z: -22 },
    A_LONG: { x: 35, y: 0, z: 5 },
    A_LONG_DOORS: { x: 33, y: 0, z: 15 },
    MID: { x: 5, y: 0, z: 12 },
    MID_DOORS: { x: 5, y: 0, z: 2 },
    CATWALK: { x: 18, y: 0, z: -8 },
    B_TUNNELS: { x: -18, y: 0, z: 25 },
    B_SITE: { x: -22, y: 0, z: -18 },
    B_DOORS: { x: -15, y: 0, z: -10 },
    UPPER_MID: { x: 8, y: 0, z: -5 },
    LOWER_TUNNELS: { x: -12, y: 0, z: 32 },
    A_SHORT: { x: 20, y: 0, z: -5 },
    PIT: { x: 30, y: 0, z: -15 },
    GOOSE: { x: 25, y: 0, z: -18 },
    PLATFORM: { x: 28, y: 0, z: -25 },
    CAR: { x: -18, y: 0, z: -15 },
    BACK_SITE_B: { x: -25, y: 0, z: -22 },
  };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initMaterials();
    this.buildMap();
    this.setupSpawnPoints();
    this.setupSiteZones();
    this.setupNavPoints();
  }

  private initMaterials() {
    this.materials = {
      wall: new THREE.MeshLambertMaterial({ color: 0xc2a36e }),
      wallDark: new THREE.MeshLambertMaterial({ color: 0x8b7355 }),
      floor: new THREE.MeshLambertMaterial({ color: 0xd4b896 }),
      crate: new THREE.MeshLambertMaterial({ color: 0x6b8e23 }),
      crateDark: new THREE.MeshLambertMaterial({ color: 0x556b2f }),
      metal: new THREE.MeshLambertMaterial({ color: 0x708090 }),
      concrete: new THREE.MeshLambertMaterial({ color: 0xa0a0a0 }),
      sand: new THREE.MeshLambertMaterial({ color: 0xe8d5a3 }),
      door: new THREE.MeshLambertMaterial({ color: 0x4a6741 }),
      siteMarker: new THREE.MeshLambertMaterial({ color: 0xff4444, transparent: true, opacity: 0.3 }),
    };
  }

  private addBox(x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.MeshLambertMaterial, collide = true): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    if (collide) {
      this.colliders.push({
        box: {
          min: { x: x - w / 2, y: y, z: z - d / 2 },
          max: { x: x + w / 2, y: y + h, z: z + d / 2 }
        },
        mesh
      });
    }
    return mesh;
  }

  private buildMap() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const ground = new THREE.Mesh(groundGeo, this.materials.sand);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const W = this.materials.wall;
    const WD = this.materials.wallDark;
    const C = this.materials.crate;
    const M = this.materials.metal;
    const CON = this.materials.concrete;
    const DOOR = this.materials.door;

    // ============ OUTER BOUNDARIES ============
    // North wall
    this.addBox(0, 0, -35, 100, 5, 1, W);
    // South wall
    this.addBox(0, 0, 50, 100, 5, 1, W);
    // East wall
    this.addBox(45, 0, 7, 1, 5, 86, W);
    // West wall
    this.addBox(-35, 0, 7, 1, 5, 86, W);

    // ============ T SPAWN AREA (south center) ============
    // T spawn walls
    this.addBox(-12, 0, 38, 1, 4, 16, W);  // west wall of T spawn
    this.addBox(12, 0, 38, 1, 4, 16, W);   // east wall of T spawn
    this.addBox(0, 0, 48, 25, 4, 1, W);    // south wall

    // ============ A LONG (east corridor from T to A) ============
    // A long walls - runs along east side
    this.addBox(28, 0, 35, 1, 4, 20, W);   // west wall of A long lower
    this.addBox(42, 0, 35, 1, 4, 20, W);   // east wall of A long lower
    this.addBox(28, 0, 10, 1, 4, 20, W);   // west wall of A long upper
    this.addBox(42, 0, 10, 1, 4, 20, W);   // east wall of A long upper
    // A long doors (double doors that can be passed through gap)
    this.addBox(33, 0, 22, 4, 3.5, 0.4, DOOR);  // door frame left
    this.addBox(38, 0, 22, 4, 3.5, 0.4, DOOR);  // door frame right
    // Gap between doors at x=35.5 allows passage

    // A long corner/pit area
    this.addBox(28, 0, -5, 1, 4, 12, W);
    this.addBox(42, 0, -8, 1, 4, 8, W);

    // ============ A SITE (northeast) ============
    // A site platform
    this.addBox(28, 0, -22, 16, 0.4, 14, CON);
    // A site walls
    this.addBox(20, 0, -28, 1, 4, 14, W);   // west wall
    this.addBox(38, 0, -28, 1, 4, 14, W);   // east wall  
    this.addBox(28, 0, -34, 18, 4, 1, W);   // north wall
    // A site boxes (goose, default plant spot)
    this.addBox(25, 0.4, -20, 2, 1.5, 2, C);   // goose box
    this.addBox(30, 0.4, -25, 2.5, 1.2, 2.5, C); // default box
    this.addBox(32, 0.4, -19, 1.5, 1.8, 1.5, C); // elevated box
    // A ramp from long to site
    this.addBox(35, 0, -12, 8, 0.4, 6, CON);

    // ============ MID (center corridor) ============
    // Mid walls
    this.addBox(-2, 0, 20, 1, 4, 20, W);   // west mid wall
    this.addBox(12, 0, 20, 1, 4, 20, W);   // east mid wall
    // Mid doors (the famous double doors - passable through gap)
    this.addBox(2, 0, 5, 3, 3.5, 0.5, DOOR);  // left door
    this.addBox(8, 0, 5, 3, 3.5, 0.5, DOOR);  // right door
    // Gap at x=5 allows passage through mid doors
    // Mid to CT spawn connector
    this.addBox(-2, 0, -2, 1, 4, 10, W);
    this.addBox(12, 0, -2, 1, 4, 10, W);

    // ============ CATWALK / A SHORT (mid to A connector) ============
    // Catwalk elevated path
    this.addBox(17, 0, -5, 10, 0.6, 4, CON);  // catwalk platform
    this.addBox(13, 0, -5, 1, 3, 4, W);       // catwalk west wall
    this.addBox(22, 0, -8, 1, 3, 8, W);       // catwalk east wall
    // Steps up to catwalk from mid
    this.addBox(12, 0, 0, 3, 0.3, 3, CON);
    this.addBox(14, 0, -2, 3, 0.5, 3, CON);

    // ============ B TUNNELS (west side from T to B) ============
    // Lower tunnels
    this.addBox(-25, 0, 35, 1, 4, 16, W);  // west tunnel wall
    this.addBox(-10, 0, 35, 1, 4, 16, W);  // east tunnel wall
    this.addBox(-17, 0, 44, 14, 4, 1, W);  // south tunnel wall
    // Upper tunnels / B doors area
    this.addBox(-25, 0, 15, 1, 4, 16, W);
    this.addBox(-10, 0, 15, 1, 4, 16, W);
    // B tunnel turn
    this.addBox(-20, 0, 8, 12, 4, 1, W);
    this.addBox(-28, 0, 2, 1, 4, 12, W);
    this.addBox(-14, 0, 2, 1, 4, 12, W);

    // ============ B SITE (northwest) ============
    // B site area
    this.addBox(-30, 0, -18, 1, 4, 16, W);  // west wall
    this.addBox(-12, 0, -18, 1, 4, 16, W);  // east wall
    this.addBox(-21, 0, -28, 18, 4, 1, W);  // north wall
    // B site boxes
    this.addBox(-22, 0, -18, 2.5, 1.5, 2.5, C);  // back box
    this.addBox(-17, 0, -15, 2, 1.2, 2, C);      // front box
    this.addBox(-25, 0, -22, 2, 1.8, 2, C);      // corner box
    // B doors (entrance from mid)
    this.addBox(-14, 0, -8, 3, 3.5, 0.5, DOOR);
    this.addBox(-9, 0, -8, 3, 3.5, 0.5, DOOR);
    // B platform
    this.addBox(-21, 0, -18, 14, 0.3, 12, CON);

    // ============ CT SPAWN (northeast, between A and mid) ============
    this.addBox(10, 0, -25, 1, 4, 12, W);   // west wall
    this.addBox(20, 0, -30, 1, 4, 8, W);    // divider
    this.addBox(15, 0, -33, 12, 4, 1, W);   // south wall of CT

    // ============ CONNECTOR AREAS ============
    // T spawn to A long connector
    this.addBox(15, 0, 32, 1, 4, 10, W);
    this.addBox(25, 0, 32, 1, 4, 10, W);
    // T spawn to B tunnels connector
    this.addBox(-15, 0, 32, 1, 4, 10, W);
    this.addBox(-5, 0, 32, 1, 4, 10, W);
    // T spawn to mid connector
    this.addBox(-2, 0, 32, 1, 4, 6, W);
    this.addBox(12, 0, 32, 1, 4, 6, W);

    // Mid to B connector
    this.addBox(-8, 0, -5, 8, 4, 1, W);
    this.addBox(-8, 0, 5, 8, 4, 1, W);

    // ============ ADDITIONAL COVER BOXES ============
    // Mid boxes
    this.addBox(5, 0, 15, 2, 1.2, 2, C);
    this.addBox(3, 0, 25, 1.5, 1.0, 1.5, C);
    // A long boxes
    this.addBox(35, 0, 30, 2, 1.5, 2, C);
    this.addBox(33, 0, 8, 1.5, 1.2, 1.5, C);
    // CT spawn boxes
    this.addBox(15, 0, -25, 2, 1.2, 2, C);
    // B tunnels boxes
    this.addBox(-17, 0, 30, 2, 1.2, 2, C);
    this.addBox(-20, 0, 18, 1.5, 1.0, 1.5, C);
  }

  private setupSpawnPoints() {
    // T spawn points (south)
    for (let i = 0; i < 5; i++) {
      this.spawnPoints.T.push({
        x: -6 + i * 3,
        y: 0,
        z: 42 + (i % 2) * 2
      });
    }
    // CT spawn points (north)
    for (let i = 0; i < 5; i++) {
      this.spawnPoints.CT.push({
        x: 12 + i * 2,
        y: 0,
        z: -24 - (i % 2) * 2
      });
    }
  }

  private setupSiteZones() {
    this.siteZones = [
      { name: 'A', center: { x: 28, y: 0, z: -22 }, radius: 6 },
      { name: 'B', center: { x: -21, y: 0, z: -18 }, radius: 6 }
    ];
  }

  private setupNavPoints() {
    const P = this.POSITIONS;
    this.navPoints = [
      P.T_SPAWN, P.CT_SPAWN, P.A_SITE, P.A_LONG, P.A_LONG_DOORS,
      P.MID, P.MID_DOORS, P.CATWALK, P.B_TUNNELS, P.B_SITE,
      P.B_DOORS, P.UPPER_MID, P.LOWER_TUNNELS, P.A_SHORT,
      P.PIT, P.GOOSE, P.PLATFORM, P.CAR, P.BACK_SITE_B,
      // Additional intermediate nav points
      { x: 0, y: 0, z: 35 },   // T spawn exit
      { x: 35, y: 0, z: 25 },  // A long mid
      { x: 35, y: 0, z: 0 },   // A long upper
      { x: 5, y: 0, z: 25 },   // mid lower
      { x: 5, y: 0, z: -2 },   // mid upper
      { x: -17, y: 0, z: 38 }, // B tunnels lower
      { x: -17, y: 0, z: 20 }, // B tunnels mid
      { x: -17, y: 0, z: 5 },  // B tunnels upper
      { x: 15, y: 0, z: -15 }, // CT to A
      { x: -5, y: 0, z: -12 }, // mid to B
      { x: 25, y: 0, z: 30 },  // T to A long
      { x: -10, y: 0, z: 35 }, // T to B tunnels
    ];
  }

  isInSite(pos: Vec3): 'A' | 'B' | null {
    for (const zone of this.siteZones) {
      const dx = pos.x - zone.center.x;
      const dz = pos.z - zone.center.z;
      if (Math.sqrt(dx * dx + dz * dz) < zone.radius) {
        return zone.name;
      }
    }
    return null;
  }

  checkCollision(pos: Vec3, radius: number, height: number): Vec3 {
    const result = { ...pos };
    const playerBox: AABB = {
      min: { x: result.x - radius, y: result.y, z: result.z - radius },
      max: { x: result.x + radius, y: result.y + height, z: result.z + radius }
    };

    for (const col of this.colliders) {
      if (this.aabbOverlap(playerBox, col.box)) {
        // Find minimum penetration axis
        const overlapX1 = playerBox.max.x - col.box.min.x;
        const overlapX2 = col.box.max.x - playerBox.min.x;
        const overlapZ1 = playerBox.max.z - col.box.min.z;
        const overlapZ2 = col.box.max.z - playerBox.min.z;
        const overlapY1 = playerBox.max.y - col.box.min.y;
        const overlapY2 = col.box.max.y - playerBox.min.y;

        const minX = Math.min(overlapX1, overlapX2);
        const minZ = Math.min(overlapZ1, overlapZ2);
        const minY = Math.min(overlapY1, overlapY2);

        if (minY <= minX && minY <= minZ) {
          // Resolve vertically
          if (overlapY1 < overlapY2) {
            result.y = col.box.min.y - height;
          } else {
            result.y = col.box.max.y;
          }
        } else if (minX < minZ) {
          if (overlapX1 < overlapX2) {
            result.x = col.box.min.x - radius;
          } else {
            result.x = col.box.max.x + radius;
          }
        } else {
          if (overlapZ1 < overlapZ2) {
            result.z = col.box.min.z - radius;
          } else {
            result.z = col.box.max.z + radius;
          }
        }
        // Update player box
        playerBox.min = { x: result.x - radius, y: result.y, z: result.z - radius };
        playerBox.max = { x: result.x + radius, y: result.y + height, z: result.z + radius };
      }
    }
    return result;
  }

  private aabbOverlap(a: AABB, b: AABB): boolean {
    return a.min.x < b.max.x && a.max.x > b.min.x &&
           a.min.y < b.max.y && a.max.y > b.min.y &&
           a.min.z < b.max.z && a.max.z > b.min.z;
  }

  // Raycast against colliders for bullet/visibility checks
  raycast(origin: Vec3, direction: Vec3, maxDist: number): { hit: boolean; distance: number; point: Vec3 } {
    let closest = maxDist;
    let hitPoint: Vec3 = { x: origin.x + direction.x * maxDist, y: origin.y + direction.y * maxDist, z: origin.z + direction.z * maxDist };
    let hit = false;

    for (const col of this.colliders) {
      const t = this.rayAABB(origin, direction, col.box);
      if (t !== null && t < closest && t > 0) {
        closest = t;
        hit = true;
        hitPoint = {
          x: origin.x + direction.x * t,
          y: origin.y + direction.y * t,
          z: origin.z + direction.z * t
        };
      }
    }
    return { hit, distance: closest, point: hitPoint };
  }

  private rayAABB(origin: Vec3, dir: Vec3, box: AABB): number | null {
    let tmin = 0;
    let tmax = Infinity;

    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    for (const axis of axes) {
      if (Math.abs(dir[axis]) < 1e-8) {
        if (origin[axis] < box.min[axis] || origin[axis] > box.max[axis]) return null;
      } else {
        const invD = 1.0 / dir[axis];
        let t1 = (box.min[axis] - origin[axis]) * invD;
        let t2 = (box.max[axis] - origin[axis]) * invD;
        if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
        tmin = Math.max(tmin, t1);
        tmax = Math.min(tmax, t2);
        if (tmin > tmax) return null;
      }
    }
    return tmin;
  }

  hasLineOfSight(from: Vec3, to: Vec3): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 0.1) return true;
    const dir = { x: dx / dist, y: dy / dist, z: dz / dist };
    const result = this.raycast(from, dir, dist);
    return !result.hit || result.distance >= dist - 0.5;
  }
}

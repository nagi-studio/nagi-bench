import * as THREE from 'three';
import { PHYSICS } from '../config';
import { Dust2MapData, MapBox, MapRamp } from '../map/dust2Data';

export interface WorldRayHit {
  distance: number;
  point: THREE.Vector3;
  normal: THREE.Vector3;
  materialKind: string;
}

export class PhysicsWorld {
  private solidBoxes: MapBox[];
  private ramps: MapRamp[];

  constructor(mapData: Dust2MapData) {
    this.solidBoxes = mapData.boxes.filter((b) => b.solid);
    this.ramps = mapData.ramps;
  }

  /**
   * Computes ramp surface height at (x, z) if (x, z) falls inside the ramp footprint (with optional margin).
   */
  public getRampHeight(ramp: MapRamp, x: number, z: number): number {
    if (ramp.axis === 'x') {
      const t = Math.max(0, Math.min(1, (x - ramp.x1) / (ramp.x2 - ramp.x1)));
      return ramp.yStart + t * (ramp.yEnd - ramp.yStart);
    } else {
      const t = Math.max(0, Math.min(1, (z - ramp.z1) / (ramp.z2 - ramp.z1)));
      return ramp.yStart + t * (ramp.yEnd - ramp.yStart);
    }
  }

  /**
   * Moves an upright cylinder/AABB body with smooth wall sliding, ramp climbing, step-up, and gravity.
   */
  public moveCharacter(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    dt: number,
    height: number,
    radius = PHYSICS.PLAYER_RADIUS
  ): { grounded: boolean } {
    // 1. Horizontal movement with sub-stepping to prevent tunneling
    const dx = vel.x * dt;
    const dz = vel.z * dt;
    const maxStep = 0.22;
    const horizDist = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(horizDist / maxStep));
    const stepX = dx / steps;
    const stepZ = dz / steps;

    for (let s = 0; s < steps; s++) {
      // Try X axis
      pos.x += stepX;
      this.resolveHorizontal(pos, vel, radius, height, 'x');
      // Try Z axis
      pos.z += stepZ;
      this.resolveHorizontal(pos, vel, radius, height, 'z');
    }

    // 2. Vertical movement & floor snapping (boxes + ramps)
    const prevY = pos.y;
    pos.y += vel.y * dt;

    let floorY = -999;

    // Check solid boxes as floor & ceiling
    for (const b of this.solidBoxes) {
      if (pos.x + radius <= b.x1 || pos.x - radius >= b.x2) continue;
      if (pos.z + radius <= b.z1 || pos.z - radius >= b.z2) continue;

      // Floor candidate: box top is near or below feet + stepHeight
      if (b.y2 <= prevY + PHYSICS.STEP_HEIGHT + 0.05 && b.y2 > floorY) {
        floorY = b.y2;
      }

      // Ceiling collision when moving upward
      if (vel.y > 0 && prevY + height <= b.y1 + 0.08 && pos.y + height > b.y1) {
        pos.y = b.y1 - height;
        vel.y = 0;
      }
    }

    // Check ramps as smooth walkable floors
    for (const r of this.ramps) {
      if (pos.x + radius * 0.65 < r.x1 || pos.x - radius * 0.65 > r.x2) continue;
      if (pos.z + radius * 0.65 < r.z1 || pos.z - radius * 0.65 > r.z2) continue;

      const ry = this.getRampHeight(r, pos.x, pos.z);
      if (ry <= prevY + PHYSICS.STEP_HEIGHT + 0.35 && ry > floorY) {
        floorY = ry;
      }
    }

    let grounded = false;
    if (floorY > -900) {
      // Snap down gently on ramps when walking downhill, or land when falling
      const downhillSnap = vel.y <= 0 && prevY - floorY <= 0.32 && prevY >= floorY - 0.05;
      if (pos.y <= floorY || downhillSnap) {
        pos.y = floorY;
        if (vel.y < 0) vel.y = 0;
        grounded = true;
      }
    }

    return { grounded };
  }

  private resolveHorizontal(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    radius: number,
    height: number,
    axis: 'x' | 'z'
  ): void {
    const feetY = pos.y;
    const headY = pos.y + height;

    for (const b of this.solidBoxes) {
      // Skip boxes that are walkable floors below step height, or ceilings above head
      if (b.y2 <= feetY + PHYSICS.STEP_HEIGHT) continue;
      if (b.y1 >= headY - 0.05) continue;

      if (pos.x + radius <= b.x1 || pos.x - radius >= b.x2) continue;
      if (pos.z + radius <= b.z1 || pos.z - radius >= b.z2) continue;

      // Check if standing on a ramp elevates feet above this wall (e.g., smoothly walking off ramp onto floor)
      if (axis === 'x') {
        const pushLeft = b.x1 - radius;
        const pushRight = b.x2 + radius;
        const distLeft = Math.abs(pos.x - pushLeft);
        const distRight = Math.abs(pos.x - pushRight);
        if (distLeft < distRight) {
          pos.x = pushLeft;
        } else {
          pos.x = pushRight;
        }
        vel.x = 0;
      } else {
        const pushBack = b.z1 - radius;
        const pushFront = b.z2 + radius;
        const distBack = Math.abs(pos.z - pushBack);
        const distFront = Math.abs(pos.z - pushFront);
        if (distBack < distFront) {
          pos.z = pushBack;
        } else {
          pos.z = pushFront;
        }
        vel.z = 0;
      }
    }
  }

  /**
   * Fast analytical slab raycast against all solid map boxes and ramps.
   */
  public raycastMap(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxDist: number
  ): WorldRayHit | null {
    let bestT = maxDist;
    let bestNormal: THREE.Vector3 | null = null;
    let bestMat = 'wall_sandstone';

    const invX = Math.abs(dir.x) > 1e-8 ? 1 / dir.x : 1e12;
    const invY = Math.abs(dir.y) > 1e-8 ? 1 / dir.y : 1e12;
    const invZ = Math.abs(dir.z) > 1e-8 ? 1 / dir.z : 1e12;

    for (const b of this.solidBoxes) {
      let tx1 = (b.x1 - origin.x) * invX;
      let tx2 = (b.x2 - origin.x) * invX;
      let nx = -1;
      if (tx1 > tx2) {
        const tmp = tx1; tx1 = tx2; tx2 = tmp;
        nx = 1;
      }

      let ty1 = (b.y1 - origin.y) * invY;
      let ty2 = (b.y2 - origin.y) * invY;
      let ny = -1;
      if (ty1 > ty2) {
        const tmp = ty1; ty1 = ty2; ty2 = tmp;
        ny = 1;
      }

      let tz1 = (b.z1 - origin.z) * invZ;
      let tz2 = (b.z2 - origin.z) * invZ;
      let nz = -1;
      if (tz1 > tz2) {
        const tmp = tz1; tz1 = tz2; tz2 = tmp;
        nz = 1;
      }

      const tmin = Math.max(tx1, ty1, tz1);
      const tmax = Math.min(tx2, ty2, tz2);

      if (tmax >= Math.max(0.001, tmin) && tmin < bestT && tmin >= 0.001) {
        bestT = tmin;
        bestMat = b.material;
        if (tmin === tx1) bestNormal = new THREE.Vector3(nx, 0, 0);
        else if (tmin === ty1) bestNormal = new THREE.Vector3(0, ny, 0);
        else bestNormal = new THREE.Vector3(0, 0, nz);
      }
    }

    // Also test ray vs ramp top planes so bullets & LOS don't pass through ramps
    for (const r of this.ramps) {
      const hit = this.raycastRampPlane(origin, dir, r, bestT);
      if (hit && hit.t < bestT) {
        bestT = hit.t;
        bestNormal = hit.normal;
        bestMat = r.material;
      }
    }

    if (!bestNormal) return null;

    return {
      distance: bestT,
      point: origin.clone().addScaledVector(dir, bestT),
      normal: bestNormal,
      materialKind: bestMat,
    };
  }

  private raycastRampPlane(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    r: MapRamp,
    maxDist: number
  ): { t: number; normal: THREE.Vector3 } | null {
    // Plane equation: y = yStart + slope * (coord - coord1)
    let slope = 0;
    let denom = 0;
    let num = 0;
    let normal: THREE.Vector3;

    if (r.axis === 'x') {
      slope = (r.yEnd - r.yStart) / (r.x2 - r.x1);
      denom = dir.y - slope * dir.x;
      if (Math.abs(denom) < 1e-6) return null;
      num = r.yStart + slope * (origin.x - r.x1) - origin.y;
      normal = new THREE.Vector3(-slope, 1, 0).normalize();
    } else {
      slope = (r.yEnd - r.yStart) / (r.z2 - r.z1);
      denom = dir.y - slope * dir.z;
      if (Math.abs(denom) < 1e-6) return null;
      num = r.yStart + slope * (origin.z - r.z1) - origin.y;
      normal = new THREE.Vector3(0, 1, -slope).normalize();
    }

    const t = num / denom;
    if (t < 0.001 || t >= maxDist) return null;

    const hx = origin.x + dir.x * t;
    const hz = origin.z + dir.z * t;
    if (hx >= r.x1 && hx <= r.x2 && hz >= r.z1 && hz <= r.z2) {
      return { t, normal };
    }
    return null;
  }

  /**
   * Checks unobstructed line of sight between two 3D points.
   */
  public hasLineOfSight(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const diff = to.clone().sub(from);
    const dist = diff.length();
    if (dist < 0.05) return true;
    const dir = diff.divideScalar(dist);
    const hit = this.raycastMap(from, dir, dist - 0.12);
    return hit === null;
  }
}

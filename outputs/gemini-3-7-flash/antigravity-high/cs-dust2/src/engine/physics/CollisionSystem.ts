import * as THREE from 'three';
import { CollisionBox, Dust2Map } from '../map/Dust2Map';

export interface RayHit {
  hit: boolean;
  distance: number;
  point: THREE.Vector3;
  normal: THREE.Vector3;
}

export class CollisionSystem {
  private map: Dust2Map;

  constructor(map: Dust2Map) {
    this.map = map;
  }

  /**
   * Resolves player/AI entity collision against all map AABBs.
   * Returns updated position and grounded state.
   */
  public moveEntity(
    pos: THREE.Vector3,
    velocity: THREE.Vector3,
    delta: number,
    radius: number = 0.35,
    height: number = 1.8
  ): { pos: THREE.Vector3; velocity: THREE.Vector3; isGrounded: boolean } {
    let isGrounded = false;

    // Apply gravity
    velocity.y -= 22 * delta;

    // Projected next position
    const nextPos = pos.clone();

    // 1. Move X axis and resolve collision
    nextPos.x += velocity.x * delta;
    for (const box of this.map.collisionBoxes) {
      if (this.checkEntityAABBOverlap(nextPos, box, radius, height)) {
        // Test step climb
        if (box.max.y - pos.y <= 0.5 && box.max.y >= pos.y) {
          nextPos.y = box.max.y;
          isGrounded = true;
        } else {
          // Slide along wall
          if (velocity.x > 0) {
            nextPos.x = box.min.x - radius;
          } else if (velocity.x < 0) {
            nextPos.x = box.max.x + radius;
          }
          velocity.x = 0;
        }
      }
    }

    // 2. Move Z axis and resolve collision
    nextPos.z += velocity.z * delta;
    for (const box of this.map.collisionBoxes) {
      if (this.checkEntityAABBOverlap(nextPos, box, radius, height)) {
        if (box.max.y - pos.y <= 0.5 && box.max.y >= pos.y) {
          nextPos.y = box.max.y;
          isGrounded = true;
        } else {
          if (velocity.z > 0) {
            nextPos.z = box.min.z - radius;
          } else if (velocity.z < 0) {
            nextPos.z = box.max.z + radius;
          }
          velocity.z = 0;
        }
      }
    }

    // 3. Move Y axis and resolve vertical collision (Floor & Ceilings)
    nextPos.y += velocity.y * delta;
    for (const box of this.map.collisionBoxes) {
      if (this.checkEntityAABBOverlap(nextPos, box, radius, height)) {
        if (velocity.y < 0) {
          // Landed on surface
          nextPos.y = box.max.y;
          velocity.y = 0;
          isGrounded = true;
        } else if (velocity.y > 0) {
          // Hit ceiling
          nextPos.y = box.min.y - height;
          velocity.y = 0;
        }
      }
    }

    // Ground floor fallback (y = 0)
    if (nextPos.y <= 0) {
      nextPos.y = 0;
      velocity.y = 0;
      isGrounded = true;
    }

    // Apply Ground Friction
    if (isGrounded) {
      const friction = 10;
      velocity.x -= velocity.x * friction * delta;
      velocity.z -= velocity.z * friction * delta;
      if (Math.abs(velocity.x) < 0.01) velocity.x = 0;
      if (Math.abs(velocity.z) < 0.01) velocity.z = 0;
    } else {
      // Air drag
      velocity.x *= 0.98;
      velocity.z *= 0.98;
    }

    return { pos: nextPos, velocity, isGrounded };
  }

  private checkEntityAABBOverlap(pos: THREE.Vector3, box: CollisionBox, radius: number, height: number): boolean {
    const minX = pos.x - radius;
    const maxX = pos.x + radius;
    const minY = pos.y;
    const maxY = pos.y + height;
    const minZ = pos.z - radius;
    const maxZ = pos.z + radius;

    return (
      minX < box.max.x &&
      maxX > box.min.x &&
      minY < box.max.y &&
      maxY > box.min.y &&
      minZ < box.max.z &&
      maxZ > box.min.z
    );
  }

  /**
   * Raycast against map collision boxes (walls, crates, doors).
   * Used for bullet hits, wall impacts, and AI line-of-sight checks.
   */
  public raycastMap(rayOrigin: THREE.Vector3, rayDir: THREE.Vector3, maxDist: number = 150): RayHit {
    let closestDist = maxDist;
    let hitPoint = new THREE.Vector3();
    let hitNormal = new THREE.Vector3(0, 1, 0);
    let didHit = false;

    const ray = new THREE.Ray(rayOrigin, rayDir.clone().normalize());

    // 1. Check Floor Plane (y = 0)
    if (rayDir.y < -0.001) {
      const t = -rayOrigin.y / rayDir.y;
      if (t > 0 && t < closestDist) {
        closestDist = t;
        hitPoint = rayOrigin.clone().add(rayDir.clone().multiplyScalar(t));
        hitNormal = new THREE.Vector3(0, 1, 0);
        didHit = true;
      }
    }

    // 2. Check Map AABB Boxes
    const box3 = new THREE.Box3();
    const tempPoint = new THREE.Vector3();

    for (const box of this.map.collisionBoxes) {
      box3.set(box.min, box.max);
      const intersection = ray.intersectBox(box3, tempPoint);
      if (intersection) {
        const dist = rayOrigin.distanceTo(intersection);
        if (dist < closestDist) {
          closestDist = dist;
          hitPoint.copy(intersection);
          didHit = true;

          // Determine hit normal
          const eps = 0.05;
          if (Math.abs(hitPoint.x - box.min.x) < eps) hitNormal.set(-1, 0, 0);
          else if (Math.abs(hitPoint.x - box.max.x) < eps) hitNormal.set(1, 0, 0);
          else if (Math.abs(hitPoint.y - box.min.y) < eps) hitNormal.set(0, -1, 0);
          else if (Math.abs(hitPoint.y - box.max.y) < eps) hitNormal.set(0, 1, 0);
          else if (Math.abs(hitPoint.z - box.min.z) < eps) hitNormal.set(0, 0, -1);
          else if (Math.abs(hitPoint.z - box.max.z) < eps) hitNormal.set(0, 0, 1);
          else hitNormal.set(0, 1, 0);
        }
      }
    }

    return {
      hit: didHit,
      distance: closestDist,
      point: hitPoint,
      normal: hitNormal
    };
  }

  /**
   * Check if direct line-of-sight between two points is clear (not blocked by walls/crates)
   */
  public hasLineOfSight(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const dir = to.clone().sub(from);
    const dist = dir.length();
    if (dist < 0.1) return true;

    dir.normalize();
    const hit = this.raycastMap(from, dir, dist);
    return !hit.hit || hit.distance >= dist - 0.2;
  }
}

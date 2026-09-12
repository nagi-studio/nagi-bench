import * as THREE from 'three';

export interface BoundingBox3D {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export class PhysicsEngine {
  private static colliders: THREE.Box3[] = [];

  public static addCollider(box: THREE.Box3) {
    this.colliders.push(box);
  }

  public static clearColliders() {
    this.colliders = [];
  }

  public static getColliders(): THREE.Box3[] {
    return this.colliders;
  }

  /**
   * Resolves collision between an entity cylinder (pos, radius, height) and scene AABB boxes.
   * Returns corrected position.
   */
  public static collideAndSlide(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    radius: number = 0.45,
    height: number = 1.8
  ): THREE.Vector3 {
    const nextPos = position.clone().add(velocity);

    const minX = nextPos.x - radius;
    const maxX = nextPos.x + radius;
    const minZ = nextPos.z - radius;
    const maxZ = nextPos.z + radius;
    const minY = nextPos.y;
    const maxY = nextPos.y + height;

    const actorBox = new THREE.Box3(
      new THREE.Vector3(minX, minY, minZ),
      new THREE.Vector3(maxX, maxY, maxZ)
    );

    for (const box of this.colliders) {
      if (actorBox.intersectsBox(box)) {
        // Find overlap depth on X and Z axes
        const overlapX1 = box.max.x - actorBox.min.x;
        const overlapX2 = actorBox.max.x - box.min.x;
        const overlapX = Math.min(overlapX1, overlapX2);

        const overlapZ1 = box.max.z - actorBox.min.z;
        const overlapZ2 = actorBox.max.z - box.min.z;
        const overlapZ = Math.min(overlapZ1, overlapZ2);

        // Slide out on the smallest overlap direction
        if (overlapX < overlapZ) {
          if (overlapX1 < overlapX2) {
            nextPos.x += overlapX;
          } else {
            nextPos.x -= overlapX;
          }
        } else {
          if (overlapZ1 < overlapZ2) {
            nextPos.z += overlapZ;
          } else {
            nextPos.z -= overlapZ;
          }
        }

        // Re-update actor box for subsequent collisions
        actorBox.min.set(nextPos.x - radius, nextPos.y, nextPos.z - radius);
        actorBox.max.set(nextPos.x + radius, nextPos.y + height, nextPos.z + radius);
      }
    }

    return nextPos;
  }

  /**
   * Raycast line of sight check from origin to target.
   * Returns true if clear (unobstructed by scene walls/boxes).
   */
  public static checkLineOfSight(origin: THREE.Vector3, target: THREE.Vector3): boolean {
    const direction = target.clone().sub(origin);
    const distance = direction.length();
    if (distance < 0.1) return true;
    direction.normalize();

    const ray = new THREE.Ray(origin, direction);
    const hitPoint = new THREE.Vector3();

    for (const box of this.colliders) {
      if (ray.intersectBox(box, hitPoint)) {
        const hitDistance = hitPoint.distanceTo(origin);
        if (hitDistance < distance - 0.2) {
          return false; // Obstructed by wall/box
        }
      }
    }

    return true;
  }
}

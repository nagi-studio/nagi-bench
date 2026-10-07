import * as THREE from "three";

// ==========================================
// 1. DYNAMIC PARTICLE SYSTEM HELPERS
// ==========================================

export interface ParticleEmitter {
  group: THREE.Group;
  emit(origin: THREE.Vector3, velocity: THREE.Vector3, count: number): void;
  update(time: number, dt: number): void;
  reset(): void;
}

export function createGasPlumeEffect(color = 0xf8fafc, maxParticles = 60): ParticleEmitter {
  const group = new THREE.Group();
  group.name = "vfx:gas-plume";

  const geom = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
  });

  const meshes: THREE.Mesh[] = [];
  const velocities: THREE.Vector3[] = [];
  const life: number[] = [];

  for (let i = 0; i < maxParticles; i++) {
    const mesh = new THREE.Mesh(geom, mat.clone());
    mesh.visible = false;
    group.add(mesh);
    meshes.push(mesh);
    velocities.push(new THREE.Vector3());
    life.push(0);
  }

  let head = 0;

  return {
    group,
    emit(origin, baseVel, count) {
      for (let i = 0; i < count; i++) {
        const idx = (head + i) % maxParticles;
        const mesh = meshes[idx]!;
        mesh.position.copy(origin);
        mesh.visible = true;
        mesh.scale.setScalar(0.6 + Math.random() * 0.8);

        velocities[idx]!.copy(baseVel)
          .add(new THREE.Vector3(
            (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 1.8,
          ));
        life[idx] = 1.0; // full life
      }
      head = (head + count) % maxParticles;
    },
    update(_time, dt) {
      for (let i = 0; i < maxParticles; i++) {
        if (life[i]! <= 0) {
          meshes[i]!.visible = false;
          continue;
        }
        life[i]! -= dt * 0.8;
        const mesh = meshes[i]!;
        mesh.position.addScaledVector(velocities[i]!, dt);
        mesh.scale.addScalar(dt * 0.6); // expands
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, life[i]!);
      }
    },
    reset() {
      for (let i = 0; i < maxParticles; i++) {
        life[i] = 0;
        meshes[i]!.visible = false;
      }
    },
  };
}

// Crimson blood ice crystals glinting in sunset (血花状冰晶)
export function createBloodCrystalEffect(maxParticles = 50): ParticleEmitter {
  const group = new THREE.Group();
  group.name = "vfx:blood-crystals";

  const geom = new THREE.BoxGeometry(0.04, 0.04, 0.04);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x991b1b,
    transparent: true,
    opacity: 0.9,
  });

  const meshes: THREE.Mesh[] = [];
  const velocities: THREE.Vector3[] = [];
  const life: number[] = [];

  for (let i = 0; i < maxParticles; i++) {
    const mesh = new THREE.Mesh(geom, mat.clone());
    mesh.visible = false;
    group.add(mesh);
    meshes.push(mesh);
    velocities.push(new THREE.Vector3());
    life.push(0);
  }

  let head = 0;

  return {
    group,
    emit(origin, baseVel, count) {
      for (let i = 0; i < count; i++) {
        const idx = (head + i) % maxParticles;
        const mesh = meshes[idx]!;
        mesh.position.copy(origin);
        mesh.visible = true;

        velocities[idx]!.copy(baseVel)
          .add(new THREE.Vector3(
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2,
          ));
        life[idx] = 1.0;
      }
      head = (head + count) % maxParticles;
    },
    update(_time, dt) {
      for (let i = 0; i < maxParticles; i++) {
        if (life[i]! <= 0) {
          meshes[i]!.visible = false;
          continue;
        }
        life[i]! -= dt * 0.5;
        const mesh = meshes[i]!;
        mesh.position.addScaledVector(velocities[i]!, dt);
        // glinting rotation
        mesh.rotation.x += dt * 3;
        mesh.rotation.y += dt * 4;
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, life[i]!);
      }
    },
    reset() {
      for (let i = 0; i < maxParticles; i++) {
        life[i] = 0;
        meshes[i]!.visible = false;
      }
    },
  };
}

// Muzzle Flash Effect (枪口闪光 - 室内强光 / 太空萤火)
export function createMuzzleFlashEffect(): {
  group: THREE.Group;
  trigger(position: THREE.Vector3, direction: THREE.Vector3, isSpace?: boolean): void;
  update(dt: number): void;
} {
  const group = new THREE.Group();
  group.name = "vfx:muzzle-flash";

  const light = new THREE.PointLight(0xffedd5, 0, 10);
  group.add(light);

  const geom = new THREE.BoxGeometry(0.12, 0.12, 0.18);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0 });
  const mesh = new THREE.Mesh(geom, mat);
  group.add(mesh);

  let timer = 0;

  return {
    group,
    trigger(pos, dir, isSpace = false) {
      mesh.position.copy(pos).addScaledVector(dir, 0.12);
      light.position.copy(mesh.position);
      light.intensity = isSpace ? 1.5 : 8.0;
      light.distance = isSpace ? 5 : 16;
      mesh.scale.setScalar(isSpace ? 0.7 : 1.4);
      mat.opacity = 1.0;
      timer = 0.08;
    },
    update(dt) {
      if (timer > 0) {
        timer -= dt;
        if (timer <= 0) {
          light.intensity = 0;
          mat.opacity = 0;
        }
      }
    },
  };
}

import * as THREE from 'three';

export interface BulletInstance {
  mesh: THREE.Mesh;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  exitPos: THREE.Vector3;
  trail: THREE.Line;
  trailPoints: THREE.Vector3[];
  speed: number;
  rotationSpeed: THREE.Vector3;
  offset: THREE.Vector3;
}

export class MeteoriteBulletManager {
  public group: THREE.Group;
  public bullets: BulletInstance[] = [];
  public impactDebris: THREE.Points;
  public decompressionMist: THREE.Points;
  public isImpacted: boolean = false;
  
  private debrisPositions: Float32Array;
  private debrisVelocities: THREE.Vector3[] = [];
  private mistPositions: Float32Array;
  private mistVelocities: THREE.Vector3[] = [];
  private readonly debrisCount = 180;
  private readonly mistCount = 350;

  constructor() {
    this.group = new THREE.Group();
    this.createImpactDebrisSystem();
    this.createDecompressionMistSystem();
  }

  public initBullets(muzzlePos: THREE.Vector3, targetPos: THREE.Vector3): void {
    // Clean up existing bullets
    this.bullets.forEach((b) => {
      this.group.remove(b.mesh);
      this.group.remove(b.trail);
    });
    this.bullets = [];

    // In Chapter 14, Zhang Beihai fires a salvo of 3 meteorite bullets (陨石子弹)
    // crafted from ancient stony-iron meteorites (石铁陨石) with metallic chondrules
    const bulletOffsets = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.4, 0.3, -0.2),
      new THREE.Vector3(-0.35, -0.25, 0.3)
    ];

    bulletOffsets.forEach((offset, idx) => {
      // Procedural irregular chondrite meteorite geometry
      const bulletGeo = new THREE.DodecahedronGeometry(0.35 + idx * 0.05, 1);
      const posAttr = bulletGeo.attributes.position;
      // Perturb vertices to create pitted, fusion-crusted stony-iron meteorite surface
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = posAttr.getZ(i);
        const noise = 1.0 + (Math.sin(vx * 10 + idx) * Math.cos(vy * 10) * 0.22);
        posAttr.setXYZ(i, vx * noise, vy * noise, vz * noise);
      }
      bulletGeo.computeVertexNormals();

      // Stony-iron meteorite material: dark fusion crust with shiny iron-nickel inclusions
      const bulletMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.8,
        metalness: 0.7,
      });

      const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);
      
      // Calculate penetration vector: enters at targetPos, punches completely through and exits
      const dir = new THREE.Vector3().subVectors(targetPos, muzzlePos).normalize();
      const exitPos = targetPos.clone().add(dir.clone().multiplyScalar(40));

      // Hypervelocity kinetic wake ribbon / ion trail
      const maxTrailLength = 24;
      const trailPoints: THREE.Vector3[] = [];
      for (let i = 0; i < maxTrailLength; i++) {
        trailPoints.push(muzzlePos.clone());
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
      const trailMat = new THREE.LineBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.85,
        linewidth: 2
      });
      const trail = new THREE.Line(trailGeo, trailMat);

      this.group.add(bulletMesh);
      this.group.add(trail);

      this.bullets.push({
        mesh: bulletMesh,
        startPos: muzzlePos.clone().add(offset),
        targetPos: targetPos.clone().add(offset),
        exitPos: exitPos.add(offset),
        trail,
        trailPoints,
        speed: 1.0,
        rotationSpeed: new THREE.Vector3(
          3.0 + idx * 1.5,
          4.0 + idx * 2.0,
          2.5 + idx * 1.0
        ),
        offset
      });
    });
  }

  private createImpactDebrisSystem(): void {
    // Ejected hull shards, shattered titanium fragments & meteorite pulverization dust
    this.debrisPositions = new Float32Array(this.debrisCount * 3);
    const pGeo = new THREE.BufferGeometry();

    for (let i = 0; i < this.debrisCount; i++) {
      this.debrisPositions[i * 3 + 0] = 0;
      this.debrisPositions[i * 3 + 1] = -1000;
      this.debrisPositions[i * 3 + 2] = 0;
      this.debrisVelocities.push(new THREE.Vector3());
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(this.debrisPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xff8800,
      size: 0.45,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.impactDebris = new THREE.Points(pGeo, pMat);
    this.group.add(this.impactDebris);
  }

  private createDecompressionMistSystem(): void {
    // Air escaping from conference room instantly freezing into micro-ice crystals in space vacuum
    this.mistPositions = new Float32Array(this.mistCount * 3);
    const pGeo = new THREE.BufferGeometry();

    for (let i = 0; i < this.mistCount; i++) {
      this.mistPositions[i * 3 + 0] = 0;
      this.mistPositions[i * 3 + 1] = -1000;
      this.mistPositions[i * 3 + 2] = 0;
      this.mistVelocities.push(new THREE.Vector3());
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(this.mistPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.8,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.decompressionMist = new THREE.Points(pGeo, pMat);
    this.group.add(this.decompressionMist);
  }

  public triggerImpactExplosion(impactPoint: THREE.Vector3): void {
    this.isImpacted = true;

    // Explode debris shards outwards
    for (let i = 0; i < this.debrisCount; i++) {
      const idx = i * 3;
      this.debrisPositions[idx + 0] = impactPoint.x;
      this.debrisPositions[idx + 1] = impactPoint.y;
      this.debrisPositions[idx + 2] = impactPoint.z;

      // Cone directional ejection matching bullet momentum + radial dispersion
      const spread = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.8,
        -(Math.random() * 2.2 + 0.8)
      );
      this.debrisVelocities[i].copy(spread);
    }
    this.impactDebris.geometry.attributes.position.needsUpdate = true;

    // Vent decompression mist (ice crystals expanding rapidly into vacuum)
    for (let i = 0; i < this.mistCount; i++) {
      const idx = i * 3;
      this.mistPositions[idx + 0] = impactPoint.x + (Math.random() - 0.5) * 2;
      this.mistPositions[idx + 1] = impactPoint.y + (Math.random() - 0.5) * 2;
      this.mistPositions[idx + 2] = impactPoint.z + (Math.random() - 0.5) * 2;

      const mistVel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 1.4
      ).normalize().multiplyScalar(Math.random() * 1.8 + 0.5);
      this.mistVelocities[i].copy(mistVel);
    }
    this.decompressionMist.geometry.attributes.position.needsUpdate = true;
  }

  public update(bulletProgress: number, deltaTime: number): void {
    // bulletProgress ranges from 0.0 (at muzzle) to 1.0 (at impact) to 1.3 (punched through)
    const isVisible = bulletProgress > 0.0 && bulletProgress < 1.4;

    this.bullets.forEach((b) => {
      b.mesh.visible = isVisible;
      b.trail.visible = isVisible;

      if (!isVisible) return;

      // Current position along trajectory
      const currentPos = new THREE.Vector3();
      if (bulletProgress <= 1.0) {
        currentPos.lerpVectors(b.startPos, b.targetPos, bulletProgress);
      } else {
        const exitProgress = (bulletProgress - 1.0) / 0.4;
        currentPos.lerpVectors(b.targetPos, b.exitPos, Math.min(1.0, exitProgress));
      }

      b.mesh.position.copy(currentPos);
      b.mesh.rotation.x += b.rotationSpeed.x * deltaTime;
      b.mesh.rotation.y += b.rotationSpeed.y * deltaTime;
      b.mesh.rotation.z += b.rotationSpeed.z * deltaTime;

      // Update trailing kinetic wake
      b.trailPoints.unshift(currentPos.clone());
      b.trailPoints.pop();
      b.trail.geometry.setFromPoints(b.trailPoints);
    });

    // Update kinetic impact particles
    if (this.isImpacted) {
      // Debris physics in vacuum (no air resistance, constant velocity)
      const debrisPosAttr = this.impactDebris.geometry.attributes.position;
      for (let i = 0; i < this.debrisCount; i++) {
        const idx = i * 3;
        this.debrisPositions[idx + 0] += this.debrisVelocities[i].x * deltaTime * 30;
        this.debrisPositions[idx + 1] += this.debrisVelocities[i].y * deltaTime * 30;
        this.debrisPositions[idx + 2] += this.debrisVelocities[i].z * deltaTime * 30;
      }
      debrisPosAttr.needsUpdate = true;

      // Decompression mist expansion
      const mistPosAttr = this.decompressionMist.geometry.attributes.position;
      for (let i = 0; i < this.mistCount; i++) {
        const idx = i * 3;
        this.mistPositions[idx + 0] += this.mistVelocities[i].x * deltaTime * 25;
        this.mistPositions[idx + 1] += this.mistVelocities[i].y * deltaTime * 25;
        this.mistPositions[idx + 2] += this.mistVelocities[i].z * deltaTime * 25;
      }
      mistPosAttr.needsUpdate = true;
    }
  }

  public reset(): void {
    this.isImpacted = false;
    for (let i = 0; i < this.debrisCount; i++) {
      this.debrisPositions[i * 3 + 1] = -1000;
      this.debrisVelocities[i].set(0, 0, 0);
    }
    this.impactDebris.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < this.mistCount; i++) {
      this.mistPositions[i * 3 + 1] = -1000;
      this.mistVelocities[i].set(0, 0, 0);
    }
    this.decompressionMist.geometry.attributes.position.needsUpdate = true;
  }
}

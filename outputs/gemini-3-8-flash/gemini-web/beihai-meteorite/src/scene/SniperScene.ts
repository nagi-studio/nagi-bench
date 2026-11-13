import * as THREE from 'three';

export class SniperScene {
  public group: THREE.Group;
  public rifleGroup: THREE.Group;
  public muzzlePoint: THREE.Vector3;
  public reticleGroup: THREE.Group;
  public thrusterParticles: THREE.Points;
  public helmetVisor: THREE.Mesh;
  public zhangBeihaiPos: THREE.Vector3;

  private thrusterPositions: Float32Array;
  private thrusterVelocities: THREE.Vector3[] = [];
  private reticleRing: THREE.Line;
  private reticleBrackets: THREE.LineSegments;
  private rangeTextCanvas: HTMLCanvasElement;
  private rangeTextTexture: THREE.CanvasTexture;
  private rangeTextMesh: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.rifleGroup = new THREE.Group();
    this.reticleGroup = new THREE.Group();
    this.muzzlePoint = new THREE.Vector3();

    // Position of Zhang Beihai: 3,000 meters in fictional scaled units (e.g. at [0, 80, 520])
    this.zhangBeihaiPos = new THREE.Vector3(0, 75, 480);
    this.group.position.copy(this.zhangBeihaiPos);

    this.buildAstronaut();
    this.buildMeteoriteSniperRifle();
    this.buildTargetingReticle();
    this.buildThrusters();

    // Initial look direction towards the Space Station conference dome (0, 50, 0)
    this.group.lookAt(0, 50, 0);
  }

  private buildAstronaut(): void {
    const stealthSuitMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Dark carbon-fiber stealth composite (microwave and radar absorbing)
      roughness: 0.85,
      metalness: 0.15,
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.6,
      metalness: 0.4,
    });

    // Helmet
    const helmetGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const helmet = new THREE.Mesh(helmetGeo, stealthSuitMat);
    helmet.position.set(0, 3.8, 0);
    this.group.add(helmet);

    // Dark Gold Anti-Reflective Visor (reflecting stars and distant Earth)
    const visorGeo = new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI, 0, Math.PI / 1.6);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      roughness: 0.05,
      metalness: 0.95,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    this.helmetVisor = new THREE.Mesh(visorGeo, visorMat);
    this.helmetVisor.rotation.x = Math.PI / 2;
    this.helmetVisor.position.set(0, 3.8, 0.4);
    this.group.add(this.helmetVisor);

    // Torso (Modular EVA Chest Armor)
    const torsoGeo = new THREE.BoxGeometry(2.8, 3.6, 2.0);
    const torso = new THREE.Mesh(torsoGeo, stealthSuitMat);
    torso.position.set(0, 1.2, 0);
    this.group.add(torso);

    // Life-Support Backpack (Oxygen, CO2 scrubbers, Cold-gas propellant tanks)
    const packGeo = new THREE.BoxGeometry(2.6, 3.2, 1.4);
    const packMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.6,
      roughness: 0.4
    });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 1.4, -1.3);
    this.group.add(backpack);

    // Twin Cold-Gas High-Pressure Nitrogen Cylinders on backpack
    [-0.8, 0.8].forEach((xOffset) => {
      const tankGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.6, 12);
      const tank = new THREE.Mesh(tankGeo, jointMat);
      tank.position.set(xOffset, 1.4, -2.1);
      this.group.add(tank);
    });

    // Shoulders and Arms in firing posture holding the rifle
    // Left arm (supporting rifle barrel)
    const leftArmGeo = new THREE.CylinderGeometry(0.55, 0.45, 2.8, 12);
    const leftArm = new THREE.Mesh(leftArmGeo, stealthSuitMat);
    leftArm.position.set(-1.8, 1.8, 1.2);
    leftArm.rotation.x = Math.PI / 3;
    leftArm.rotation.z = -Math.PI / 5;
    this.group.add(leftArm);

    // Right arm (trigger hand)
    const rightArmGeo = new THREE.CylinderGeometry(0.55, 0.45, 2.6, 12);
    const rightArm = new THREE.Mesh(rightArmGeo, stealthSuitMat);
    rightArm.position.set(1.6, 1.6, 0.8);
    rightArm.rotation.x = Math.PI / 2.6;
    rightArm.rotation.z = Math.PI / 6;
    this.group.add(rightArm);

    // Floating legs in microgravity
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 3.2, 12), stealthSuitMat);
    leftLeg.position.set(-0.9, -2.0, -0.4);
    leftLeg.rotation.x = -Math.PI / 12;
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 3.2, 12), stealthSuitMat);
    rightLeg.position.set(0.9, -1.8, -0.2);
    rightLeg.rotation.x = Math.PI / 16;
    this.group.add(rightLeg);
  }

  private buildMeteoriteSniperRifle(): void {
    // Custom non-magnetic stealth sniper rifle for hypervelocity meteorite sabot launch
    const gunMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7,
      metalness: 0.3
    });

    // Rifle Receiver and Action
    const receiverGeo = new THREE.BoxGeometry(0.8, 1.0, 3.2);
    const receiver = new THREE.Mesh(receiverGeo, gunMetalMat);
    this.rifleGroup.add(receiver);

    // Extended High-Speed Launch Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.2, 0.22, 6.5, 16);
    const barrel = new THREE.Mesh(barrelGeo, gunMetalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.2, 4.2);
    this.rifleGroup.add(barrel);

    // Cryogenic cooling shrouds along barrel
    const shroudGeo = new THREE.BoxGeometry(0.6, 0.6, 3.8);
    const shroud = new THREE.Mesh(shroudGeo, carbonMat);
    shroud.position.set(0, 0.2, 2.8);
    this.rifleGroup.add(shroud);

    // Optical Holographic Scope
    const scopeGeo = new THREE.CylinderGeometry(0.25, 0.28, 2.4, 16);
    const scope = new THREE.Mesh(scopeGeo, gunMetalMat);
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.85, 0.8);
    this.rifleGroup.add(scope);

    // Scope objective lens glow
    const lensGeo = new THREE.CircleGeometry(0.26, 16);
    const lensMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0.85, 2.01);
    this.rifleGroup.add(lens);

    // Muzzle brake with gas-expansion ports (suppresses visual flash in vacuum)
    const muzzleGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
    const muzzle = new THREE.Mesh(muzzleGeo, gunMetalMat);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, 0.2, 7.6);
    this.rifleGroup.add(muzzle);

    // Position rifle relative to astronaut
    this.rifleGroup.position.set(0.6, 2.6, 1.2);
    this.group.add(this.rifleGroup);

    // Calculate muzzle world coordinate
    this.updateMuzzlePoint();
  }

  private buildTargetingReticle(): void {
    // 3D holographic sniper targeting reticle positioned down the scope axis
    const cyanLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5
    });

    // Central circular mil-dot ring
    const ringRadius = 1.2;
    const ringPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * ringRadius, Math.sin(theta) * ringRadius, 0));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    this.reticleRing = new THREE.Line(ringGeo, cyanLineMat);
    this.reticleGroup.add(this.reticleRing);

    // Corner targeting lock brackets
    const bracketPoints: THREE.Vector3[] = [];
    const s = 2.4;
    const l = 0.6;
    // Top-Left
    bracketPoints.push(new THREE.Vector3(-s, s - l, 0), new THREE.Vector3(-s, s, 0));
    bracketPoints.push(new THREE.Vector3(-s, s, 0), new THREE.Vector3(-s + l, s, 0));
    // Top-Right
    bracketPoints.push(new THREE.Vector3(s - l, s, 0), new THREE.Vector3(s, s, 0));
    bracketPoints.push(new THREE.Vector3(s, s, 0), new THREE.Vector3(s, s - l, 0));
    // Bottom-Left
    bracketPoints.push(new THREE.Vector3(-s, -s + l, 0), new THREE.Vector3(-s, -s, 0));
    bracketPoints.push(new THREE.Vector3(-s, -s, 0), new THREE.Vector3(-s + l, -s, 0));
    // Bottom-Right
    bracketPoints.push(new THREE.Vector3(s - l, -s, 0), new THREE.Vector3(s, -s, 0));
    bracketPoints.push(new THREE.Vector3(s, -s, 0), new THREE.Vector3(s, -s + l, 0));

    // Crosshairs
    bracketPoints.push(new THREE.Vector3(-3.2, 0, 0), new THREE.Vector3(-1.4, 0, 0));
    bracketPoints.push(new THREE.Vector3(1.4, 0, 0), new THREE.Vector3(3.2, 0, 0));
    bracketPoints.push(new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0, -1.4, 0));
    bracketPoints.push(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, 3.2, 0));

    const bracketGeo = new THREE.BufferGeometry().setFromPoints(bracketPoints);
    this.reticleBrackets = new THREE.LineSegments(bracketGeo, cyanLineMat);
    this.reticleGroup.add(this.reticleBrackets);

    // Real-time canvas telemetry text badge
    this.rangeTextCanvas = document.createElement('canvas');
    this.rangeTextCanvas.width = 512;
    this.rangeTextCanvas.height = 128;
    this.updateReticleCanvas(3124, 7.82, 0.0);

    this.rangeTextTexture = new THREE.CanvasTexture(this.rangeTextCanvas);
    const textMat = new THREE.MeshBasicMaterial({
      map: this.rangeTextTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.rangeTextMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), textMat);
    this.rangeTextMesh.position.set(0, -2.2, 0);
    this.reticleGroup.add(this.rangeTextMesh);

    // Place reticle 14 units ahead in scope direction
    this.reticleGroup.position.set(0.6, 3.45, 14);
    this.group.add(this.reticleGroup);
  }

  private updateReticleCanvas(range: number, vel: number, dev: number): void {
    const ctx = this.rangeTextCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 128);
    
    // Background pill
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 8);
    ctx.fill();
    ctx.stroke();

    // Telemetry text
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`TGT LOCK: TERMINAL VIP MODULE`, 24, 42);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '20px monospace';
    ctx.fillText(`DIST: ${range.toFixed(0)}m | V_REL: ${vel.toFixed(2)} km/s`, 24, 74);
    ctx.fillText(`SABOT: CHONDRITE METEORITE #3`, 24, 102);
  }

  private buildThrusters(): void {
    // Cold-Gas Attitude Control Micro-Thrusters (Nitrogen gas jets)
    const pCount = 60;
    this.thrusterPositions = new Float32Array(pCount * 3);
    const pGeo = new THREE.BufferGeometry();

    for (let i = 0; i < pCount; i++) {
      this.thrusterPositions[i * 3 + 0] = 0;
      this.thrusterPositions[i * 3 + 1] = 0;
      this.thrusterPositions[i * 3 + 2] = 0;
      this.thrusterVelocities.push(new THREE.Vector3());
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(this.thrusterPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.thrusterParticles = new THREE.Points(pGeo, pMat);
    this.group.add(this.thrusterParticles);
  }

  public fireThrusterPuff(): void {
    const pCount = this.thrusterPositions.length / 3;
    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      // Emit from backpack thruster nozzle
      this.thrusterPositions[idx + 0] = (Math.random() - 0.5) * 0.4;
      this.thrusterPositions[idx + 1] = 1.4 + (Math.random() - 0.5) * 0.4;
      this.thrusterPositions[idx + 2] = -2.2;

      this.thrusterVelocities[i].set(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        -0.8 - Math.random() * 0.8
      );
    }
    this.thrusterParticles.geometry.attributes.position.needsUpdate = true;
  }

  public updateMuzzlePoint(): void {
    const muzzleLocal = new THREE.Vector3(0, 0.2, 7.8);
    this.muzzlePoint.copy(muzzleLocal);
    this.rifleGroup.localToWorld(this.muzzlePoint);
  }

  public update(time: number, isAiming: boolean): void {
    // Gentle microgravity breathing and floating sway
    const floatY = Math.sin(time * 0.8) * 0.15;
    const floatRoll = Math.cos(time * 0.6) * 0.02;
    this.group.position.y = this.zhangBeihaiPos.y + floatY;
    this.group.rotation.z = floatRoll;

    // Reticle animation
    if (this.reticleRing) {
      this.reticleRing.rotation.z = time * 0.2;
    }
    if (this.reticleBrackets) {
      const scale = isAiming ? 1.0 + Math.sin(time * 6) * 0.05 : 1.2;
      this.reticleBrackets.scale.set(scale, scale, 1);
    }

    // Update thruster particles
    const posAttr = this.thrusterParticles.geometry.attributes.position;
    for (let i = 0; i < this.thrusterVelocities.length; i++) {
      const idx = i * 3;
      this.thrusterPositions[idx + 0] += this.thrusterVelocities[i].x;
      this.thrusterPositions[idx + 1] += this.thrusterVelocities[i].y;
      this.thrusterPositions[idx + 2] += this.thrusterVelocities[i].z;
      this.thrusterVelocities[i].multiplyScalar(0.96);
    }
    posAttr.needsUpdate = true;

    this.updateMuzzlePoint();
  }
}

import * as THREE from 'three';
import { ClocktowerPhysics, TOWER_LAYOUT } from '../physics/ClocktowerPhysics';
import { createProceduralTextures, ProceduralTextures } from '../textures';

interface AcousticRipple {
  mesh: THREE.Mesh;
  age: number;
  maxAge: number;
  baseScale: number;
}

export class ClocktowerScene {
  public scene: THREE.Scene;
  private textures: ProceduralTextures;

  // Dynamic visual groups synced 1:1 to Rapier3D rigid bodies
  private wheelGroup!: THREE.Group;
  private scoopGroups: THREE.Group[] = [];
  private balanceGroup!: THREE.Group;
  private pushRodGroup!: THREE.Group;
  private latchGroup!: THREE.Group;
  private pawlGroup!: THREE.Group;
  private shaftGroup!: THREE.Group;
  private bellGroup!: THREE.Group;
  private bellHammerGroup!: THREE.Group;
  private drumHammerGroup!: THREE.Group;
  private globeGroup!: THREE.Group;

  // Instanced water spheres synced 1:1 to Rapier3D water rigid bodies
  private waterInstanced!: THREE.InstancedMesh;
  private readonly dummyMatrix = new THREE.Matrix4();
  private readonly hiddenMatrix = new THREE.Matrix4().makeTranslation(0, -100, 0);

  // Subtle stage accent spotlight + emissive highlight materials
  private focusLight!: THREE.PointLight;
  private bronzeHighlightMat!: THREE.MeshStandardMaterial;
  private gearHighlightMat!: THREE.MeshStandardMaterial;
  private bellMat!: THREE.MeshStandardMaterial;
  private waterPoolMat!: THREE.MeshStandardMaterial;

  // Visual acoustic shockwaves triggered ONLY on real Rapier bell/drum collisions
  private ripples: AcousticRipple[] = [];
  private lastSeenBellCount = 0;
  private lastSeenDrumCount = 0;

  constructor(private physics: ClocktowerPhysics) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c1220');
    this.scene.fog = new THREE.FogExp2('#0c1220', 0.022);

    this.textures = createProceduralTextures();

    this.setupLighting();
    this.buildEnvironment();
    this.buildArchitecturalTower();
    this.buildWaterSupplySystem();
    this.buildDynamicMechanisms();
    this.buildWaterInstances();
  }

  private setupLighting(): void {
    // Soft ambient indigo-warm balance
    const hemi = new THREE.HemisphereLight('#c4d9f5', '#2a1d14', 0.85);
    this.scene.add(hemi);

    // Warm golden museum key light from front-right-high
    const keyLight = new THREE.DirectionalLight('#ffdfb8', 2.25);
    keyLight.position.set(8.5, 13.5, 9.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 13;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0008;
    this.scene.add(keyLight);

    // Cool moonlight rim light from back-left to carve silhouettes
    const rimLight = new THREE.DirectionalLight('#6da0e0', 1.15);
    rimLight.position.set(-9, 9, -7);
    this.scene.add(rimLight);

    // Warm Song lantern light illuminating the Timekeeping Pavilion interior
    const pavilionLantern = new THREE.PointLight('#ffb15e', 3.4, 9, 1.5);
    pavilionLantern.position.set(0, 6.7, 0.7);
    this.scene.add(pavilionLantern);

    // Soft jade-cyan fill near the waterwheel & constant-head spout
    const waterFill = new THREE.PointLight('#55d0de', 2.2, 7.5, 1.6);
    waterFill.position.set(2.3, 4.1, 1.8);
    this.scene.add(waterFill);

    // Dynamic stage-focus accent light moved gently by the FilmDirector
    this.focusLight = new THREE.PointLight('#ffe0a3', 2.6, 8.5, 1.4);
    this.focusLight.position.set(1.2, 4.2, 2.2);
    this.scene.add(this.focusLight);
  }

  private buildEnvironment(): void {
    // Dark lacquered museum floor
    const floorGeo = new THREE.CircleGeometry(28, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#111826',
      roughness: 0.72,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle concentric bronze compass inlays on gallery floor
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#5a4932',
      transparent: true,
      opacity: 0.35,
    });
    for (const r of [4.8, 6.6, 9.2]) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.025, r + 0.025, 64), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      this.scene.add(ring);
    }

    // Subtle starry night sky dome (Song observatory ambiance)
    const starCount = 420;
    const positions = new Float32Array(starCount * 3);
    let seed = 10881;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < starCount; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI * 0.48;
      const r = 34 + rand() * 8;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 2 + r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#e8dcc4',
      size: 0.18,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    this.scene.add(new THREE.Points(starGeo, starMat));
  }

  private buildArchitecturalTower(): void {
    const stoneMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      roughness: 0.85,
      metalness: 0.05,
    });
    const walnutMat = new THREE.MeshStandardMaterial({
      map: this.textures.darkWalnut,
      roughness: 0.68,
      metalness: 0.08,
    });
    const cinnabarMat = new THREE.MeshStandardMaterial({
      map: this.textures.cinnabarLacquer,
      roughness: 0.42,
      metalness: 0.06,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      map: this.textures.roofTile,
      roughness: 0.62,
      metalness: 0.16,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: '#dfb25b',
      roughness: 0.35,
      metalness: 0.82,
    });

    const group = new THREE.Group();

    // 1. Carved Stone Plinth (须弥座)
    const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.36, 5.4), stoneMat);
    plinth1.position.set(0.3, 0.18, -0.65);
    plinth1.receiveShadow = true;
    plinth1.castShadow = true;
    group.add(plinth1);

    const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.42, 4.8), stoneMat);
    plinth2.position.set(0.3, 0.57, -0.65);
    plinth2.receiveShadow = true;
    plinth2.castShadow = true;
    group.add(plinth2);

    // 2. Cutaway Song Timber Columns (Open front +Z so every gear & escapement is unobstructed!)
    const colPositions: Array<[number, number, number, number]> = [
      // Rear main structural columns (full height to terrace y=8.4)
      [-2.35, 4.6, -2.75, 7.6],
      [2.35, 4.6, -2.75, 7.6],
      [-2.35, 4.6, -0.55, 7.6],
      [2.35, 4.6, -0.55, 7.6],
      // Front-side pavilion pillars (upper pavilion framing only: y=5.3 to 8.3)
      [-2.15, 6.85, 0.45, 3.0],
      [2.15, 6.85, 0.45, 3.0],
      // Inner doorway pillars framing the active Wooden Puppet (时辰门)
      [-0.56, 6.65, 0.12, 2.45],
      [0.56, 6.65, 0.12, 2.45],
    ];
    for (const [x, y, z, h] of colPositions) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, h, 14), cinnabarMat);
      col.position.set(x, y, z);
      col.castShadow = true;
      col.receiveShadow = true;
      group.add(col);

      // Stone column base drum (柱础)
      if (y < 5.5) {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.18, 14), stoneMat);
        base.position.set(x, 0.87, z);
        group.add(base);
      }
    }

    // Rear open lattice screen wall (soft backdrop contrasting bright bronze & water)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(4.7, 7.4, 0.1),
      new THREE.MeshStandardMaterial({ color: '#1b1d28', roughness: 0.9 })
    );
    backWall.position.set(0, 4.5, -2.82);
    backWall.receiveShadow = true;
    group.add(backWall);

    // Waterwheel A-frame timber trestle (supports the main axle cleanly without blocking view)
    const axleBearingBack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.75, 0.24), walnutMat);
    axleBearingBack.position.set(0, 2.15, -0.15);
    axleBearingBack.castShadow = true;
    group.add(axleBearingBack);

    const axleBearingFront = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.65, 0.18), walnutMat);
    axleBearingFront.position.set(-1.35, 2.08, 0.35);
    axleBearingFront.rotation.z = -0.32;
    group.add(axleBearingFront);

    // Escapement support bracket post (holding Tianheng, Upper Latch & Pawl pivots)
    const escFrameTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.14, 0.22), walnutMat);
    escFrameTop.position.set(0.1, 5.08, 0.69);
    group.add(escFrameTop);

    const escPostRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.85, 0.16), walnutMat);
    escPostRight.position.set(1.08, 4.18, 0.56);
    group.add(escPostRight);

    // Pivot pins for Balance Beam, Latch, Pawl
    const pinGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.28, 12);
    pinGeo.rotateX(Math.PI / 2);
    for (const p of [TOWER_LAYOUT.balancePivot, TOWER_LAYOUT.latchPivot, TOWER_LAYOUT.pawlPivot]) {
      const pin = new THREE.Mesh(pinGeo, goldTrimMat);
      pin.position.set(p.x, p.y, p.z);
      group.add(pin);
    }

    // 3. Level 2 Pavilion Deck Floor (木阁台面, y = 5.32) — cutout front-center so shaft & wheel read cleanly
    const deckBack = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.18, 2.45), walnutMat);
    deckBack.position.set(0, 5.3, -1.62);
    deckBack.receiveShadow = true;
    deckBack.castShadow = true;
    group.add(deckBack);

    // Front pavilion balcony wings (left & right holding Bell & Drum frames)
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 1.1), walnutMat);
      wing.position.set(side * 1.48, 5.3, -0.05);
      wing.receiveShadow = true;
      group.add(wing);
    }

    // Pavilion Arch Lintel (时辰门匾额)
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.24, 0.22), cinnabarMat);
    lintel.position.set(0, 7.92, 0.12);
    group.add(lintel);

    // Bell hanging beam & Drum carved stand
    const bellBeam = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.16), walnutMat);
    bellBeam.position.set(TOWER_LAYOUT.bellPivot.x, TOWER_LAYOUT.bellPivot.y + 0.08, TOWER_LAYOUT.bellPivot.z);
    group.add(bellBeam);

    // Static Vermilion Drum (报时绛红鼓) resting on carved wood cradle at right pavilion wing
    const drumGroup = new THREE.Group();
    drumGroup.position.set(TOWER_LAYOUT.drumPos.x, TOWER_LAYOUT.drumPos.y, TOWER_LAYOUT.drumPos.z);
    drumGroup.rotation.z = 0.35;

    const drumShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.26, 24, 1, true),
      cinnabarMat
    );
    drumShell.castShadow = true;
    drumGroup.add(drumShell);

    const drumHeadMat = new THREE.MeshStandardMaterial({
      map: this.textures.drumHead,
      roughness: 0.65,
    });
    const drumTop = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), drumHeadMat);
    drumTop.rotation.x = -Math.PI / 2;
    drumTop.position.y = 0.132;
    drumGroup.add(drumTop);

    const drumBot = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), drumHeadMat);
    drumBot.rotation.x = Math.PI / 2;
    drumBot.position.y = -0.132;
    drumGroup.add(drumBot);

    // Brass drum rivets
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), goldTrimMat);
      rivet.position.set(Math.cos(a) * 0.285, 0.1, Math.sin(a) * 0.285);
      drumGroup.add(rivet);
    }
    group.add(drumGroup);

    const drumStand = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 0.32), walnutMat);
    drumStand.position.set(TOWER_LAYOUT.drumPos.x + 0.05, 5.56, TOWER_LAYOUT.drumPos.z);
    group.add(drumStand);

    // 4. Pavilion Roof Eaves & Top Astronomical Terrace (顶层观象台, y = 8.35)
    const terraceDeck = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.24, 3.2), walnutMat);
    terraceDeck.position.set(0, 8.36, -1.32);
    terraceDeck.receiveShadow = true;
    terraceDeck.castShadow = true;
    group.add(terraceDeck);

    // Sloped Song blue-grey tile eaves on left, right, and rear sides (front stays open!)
    const eaveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 3.6), roofMat);
    eaveLeft.position.set(-2.85, 8.15, -1.32);
    eaveLeft.rotation.z = 0.34;
    eaveLeft.castShadow = true;
    group.add(eaveLeft);

    const eaveRight = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 3.6), roofMat);
    eaveRight.position.set(2.85, 8.15, -1.32);
    eaveRight.rotation.z = -0.34;
    eaveRight.castShadow = true;
    group.add(eaveRight);

    const eaveBack = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.14, 0.9), roofMat);
    eaveBack.position.set(0, 8.18, -3.15);
    eaveBack.rotation.x = 0.32;
    group.add(eaveBack);

    // Terrace decorative balustrade rails (宋式寻杖栏杆)
    const railMat = cinnabarMat;
    for (const side of [-1, 1]) {
      const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.9), railMat);
      sideRail.position.set(side * 2.45, 8.85, -1.32);
      group.add(sideRail);
      for (let z = -2.6; z <= 0.1; z += 0.9) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.48, 0.1), railMat);
        post.position.set(side * 2.45, 8.66, z);
        group.add(post);
      }
    }
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.08, 0.08), railMat);
    backRail.position.set(0, 8.85, -2.76);
    group.add(backRail);

    // 5. Stationary outer bronze Armillary Sphere frame (浑仪外环: 地平环 + 子午环) at summit
    const armFrame = new THREE.Group();
    armFrame.position.set(
      TOWER_LAYOUT.armillaryCenter.x,
      TOWER_LAYOUT.armillaryCenter.y,
      TOWER_LAYOUT.armillaryCenter.z
    );
    const frameBronze = new THREE.MeshStandardMaterial({
      map: this.textures.bronze,
      roughnessMap: this.textures.bronzeRoughness,
      metalness: 0.78,
      roughness: 0.4,
    });
    const horizonRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.036, 12, 48), frameBronze);
    horizonRing.rotation.x = Math.PI / 2;
    armFrame.add(horizonRing);

    const meridianRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.032, 12, 48), frameBronze);
    armFrame.add(meridianRing);

    // 4 sculpted dragon-pillar legs supporting Armillary Sphere on terrace
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 1.9, 10), frameBronze);
      leg.position.set(Math.cos(a) * 0.74, -0.95, Math.sin(a) * 0.74);
      leg.rotation.z = Math.cos(a) * 0.12;
      leg.rotation.x = -Math.sin(a) * 0.12;
      armFrame.add(leg);
    }
    group.add(armFrame);

    // Celestial Globe bearing yoke (浑象支架)
    const globeStand = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.03, 10, 36, Math.PI), frameBronze);
    globeStand.position.set(
      TOWER_LAYOUT.globeCenter.x,
      TOWER_LAYOUT.globeCenter.y,
      TOWER_LAYOUT.globeCenter.z
    );
    globeStand.rotation.z = Math.PI;
    group.add(globeStand);

    this.scene.add(group);
  }

  private buildWaterSupplySystem(): void {
    const walnutMat = new THREE.MeshStandardMaterial({
      map: this.textures.darkWalnut,
      roughness: 0.65,
    });
    const bronzeMat = new THREE.MeshStandardMaterial({
      map: this.textures.bronze,
      roughnessMap: this.textures.bronzeRoughness,
      metalness: 0.76,
      roughness: 0.42,
    });
    this.waterPoolMat = new THREE.MeshStandardMaterial({
      color: '#46d4e3',
      emissive: '#145866',
      emissiveIntensity: 0.55,
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: 0.86,
    });

    const g = new THREE.Group();

    // Support trestle on right side for 天池 & 平水壶
    const stand1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.9, 0.14), walnutMat);
    stand1.position.set(2.55, 2.75, 0.02);
    g.add(stand1);
    const stand2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.9, 0.14), walnutMat);
    stand2.position.set(2.55, 2.75, 0.68);
    g.add(stand2);
    const stand3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 4.55, 0.14), walnutMat);
    stand3.position.set(3.45, 3.05, 0.35);
    g.add(stand3);

    // 1. Upper Reservoir (天池) at (3.35, 5.15, 0.35)
    const upperTank = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.56, 0.82), bronzeMat);
    upperTank.position.set(3.35, 5.15, 0.35);
    upperTank.castShadow = true;
    g.add(upperTank);

    const upperWater = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.08, 0.74), this.waterPoolMat);
    upperWater.position.set(3.35, 5.4, 0.35);
    g.add(upperWater);

    // Connecting waterfall jet from 天池 -> 平水壶
    const feedStream = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.55, 10), this.waterPoolMat);
    feedStream.position.set(2.85, 4.92, 0.35);
    feedStream.rotation.z = 0.42;
    g.add(feedStream);

    // 2. Constant-Level Tank (平水壶) at (2.56, 4.52, 0.35) — front glass-cutaway so water level is clearly visible!
    const tankBack = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.64, 0.06), bronzeMat);
    tankBack.position.set(2.56, 4.52, -0.04);
    g.add(tankBack);
    const tankBottom = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.06, 0.78), bronzeMat);
    tankBottom.position.set(2.56, 4.22, 0.35);
    g.add(tankBottom);
    const tankRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.56, 0.78), bronzeMat);
    tankRight.position.set(2.97, 4.48, 0.35);
    g.add(tankRight);
    const tankLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.64, 0.78), bronzeMat);
    tankLeft.position.set(2.15, 4.52, 0.35);
    g.add(tankLeft);

    // Constant-height luminous water block inside 平水壶
    const constWater = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.42, 0.68), this.waterPoolMat);
    constWater.position.set(2.56, 4.46, 0.35);
    g.add(constWater);

    // Overflow weir lip + return pipe (visually explains constant head!)
    const overflowPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.45, 10), this.waterPoolMat);
    overflowPipe.position.set(3.04, 2.95, 0.35);
    g.add(overflowPipe);

    // Bronze Spout Chute matching physics static chute
    const spoutChute = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.28), bronzeMat);
    spoutChute.position.set(TOWER_LAYOUT.spoutPos.x + 0.12, TOWER_LAYOUT.spoutPos.y + 0.03, TOWER_LAYOUT.spoutPos.z);
    spoutChute.rotation.z = 0.24;
    g.add(spoutChute);

    // Laminar water ribbon flowing inside spout chute
    const spoutWater = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.05, 0.16), this.waterPoolMat);
    spoutWater.position.set(TOWER_LAYOUT.spoutPos.x + 0.12, TOWER_LAYOUT.spoutPos.y + 0.08, TOWER_LAYOUT.spoutPos.z);
    spoutWater.rotation.z = 0.24;
    g.add(spoutWater);

    // 3. Lower Drainage Basin (退水壶) catching poured water
    const basinFloor = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 1.25), walnutMat);
    basinFloor.position.set(1.25, TOWER_LAYOUT.drainY - 0.04, 0.35);
    basinFloor.rotation.z = 0.08;
    basinFloor.receiveShadow = true;
    g.add(basinFloor);

    const basinWater = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.05, 1.05), this.waterPoolMat);
    basinWater.position.set(1.25, TOWER_LAYOUT.drainY + 0.03, 0.35);
    basinWater.rotation.z = 0.08;
    g.add(basinWater);

    for (const side of [-1, 1]) {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.34, 0.08), walnutMat);
      sideWall.position.set(1.25, TOWER_LAYOUT.drainY + 0.12, 0.35 + side * 0.58);
      sideWall.rotation.z = 0.08;
      g.add(sideWall);
    }

    this.scene.add(g);
  }

  private buildDynamicMechanisms(): void {
    const cedarMat = new THREE.MeshStandardMaterial({
      map: this.textures.cedarWood,
      roughness: 0.62,
      metalness: 0.05,
    });
    const walnutMat = new THREE.MeshStandardMaterial({
      map: this.textures.darkWalnut,
      roughness: 0.68,
      metalness: 0.08,
    });
    const cinnabarMat = new THREE.MeshStandardMaterial({
      map: this.textures.cinnabarLacquer,
      roughness: 0.42,
      metalness: 0.06,
    });
    this.bronzeHighlightMat = new THREE.MeshStandardMaterial({
      map: this.textures.bronze,
      roughnessMap: this.textures.bronzeRoughness,
      color: '#e5bc6e',
      emissive: '#3a2408',
      emissiveIntensity: 0.12,
      metalness: 0.84,
      roughness: 0.32,
    });
    this.gearHighlightMat = new THREE.MeshStandardMaterial({
      map: this.textures.cedarWood,
      color: '#d8a66a',
      emissive: '#2e1b06',
      emissiveIntensity: 0.08,
      roughness: 0.48,
      metalness: 0.22,
    });
    this.bellMat = new THREE.MeshStandardMaterial({
      map: this.textures.bronze,
      roughnessMap: this.textures.bronzeRoughness,
      color: '#d6ac60',
      emissive: '#3b2608',
      emissiveIntensity: 0.12,
      metalness: 0.88,
      roughness: 0.28,
    });

    const {
      scoopCount,
      stopPegRadius,
      escapementZ,
      wheelCenter,
      gearZ,
      gearRadius,
      horizGearY,
      camY,
      puppetDeckY,
      topGearY,
      topGearRadius,
    } = TOWER_LAYOUT;

    // --- 1. Great Waterwheel (枢轮) + Coaxial Drive Gear ---
    this.wheelGroup = new THREE.Group();
    const stopPegLocalZ = escapementZ - wheelCenter.z;
    const gearLocalZ = gearZ - wheelCenter.z;

    // Twin hardwood rims
    for (const zOff of [-0.22, 0.22]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.072, 12, 48), cedarMat);
      rim.position.z = zOff;
      rim.castShadow = true;
      rim.receiveShadow = true;
      this.wheelGroup.add(rim);
    }

    // Main hub + bronze axle shaft connecting forward to wheel & rearward to coaxial drive gear
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 1.75, 18),
      walnutMat
    );
    axle.rotation.x = Math.PI / 2;
    axle.position.z = -0.35;
    axle.castShadow = true;
    this.wheelGroup.add(axle);

    const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.56, 18), this.bronzeHighlightMat);
    hubCap.rotation.x = Math.PI / 2;
    this.wheelGroup.add(hubCap);

    // 12 radial spokes + 12 gilded Stop-Pegs (轮辐止钉)
    for (let i = 0; i < scoopCount; i++) {
      const stepAngle = (i * Math.PI * 2) / scoopCount;

      const spoke = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.075, 0.14), cedarMat);
      spoke.position.set(Math.cos(stepAngle) * 0.72, Math.sin(stepAngle) * 0.72, 0);
      spoke.rotation.z = stepAngle;
      spoke.castShadow = true;
      this.wheelGroup.add(spoke);

      // Stop-Peg matching Rapier collider exactly at 90° + i*30°
      const pegAngle = Math.PI / 2 + stepAngle;
      const peg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.044, 0.36, 12),
        this.bronzeHighlightMat
      );
      peg.rotation.x = Math.PI / 2;
      peg.position.set(
        Math.cos(pegAngle) * stopPegRadius,
        Math.sin(pegAngle) * stopPegRadius,
        stopPegLocalZ - 0.1
      );
      this.wheelGroup.add(peg);
    }

    // Coaxial Rear Drive Gear (主轴拨轮) at z = gearLocalZ
    const driveGearDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(gearRadius - 0.08, gearRadius - 0.08, 0.14, 24),
      this.gearHighlightMat
    );
    driveGearDisc.rotation.x = Math.PI / 2;
    driveGearDisc.position.z = gearLocalZ;
    driveGearDisc.castShadow = true;
    this.wheelGroup.add(driveGearDisc);

    for (let i = 0; i < scoopCount; i++) {
      const toothAngle = (-84 * Math.PI) / 180 + (i * Math.PI * 2) / scoopCount;
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.095, 0.16),
        this.bronzeHighlightMat
      );
      tooth.position.set(
        Math.cos(toothAngle) * gearRadius,
        Math.sin(toothAngle) * gearRadius,
        gearLocalZ
      );
      tooth.rotation.z = toothAngle;
      this.wheelGroup.add(tooth);
    }
    this.scene.add(this.wheelGroup);

    // --- 2. 12 Hinged Scoops (受水壶) ---
    for (let i = 0; i < scoopCount; i++) {
      const phi = TOWER_LAYOUT.scoopStartAngle + (i * Math.PI * 2) / scoopCount;
      const sg = new THREE.Group();
      const inner = new THREE.Group();
      inner.rotation.z = phi;
      sg.add(inner);

      // Hollow 5-wall wooden scoop matching physics walls
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.045, 0.46), cedarMat);
      bottom.position.set(0.27, -0.155, 0);
      bottom.castShadow = true;
      inner.add(bottom);

      const innerW = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.46), cedarMat);
      innerW.position.set(0.075, -0.01, 0);
      inner.add(innerW);

      const outerW = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.25, 0.46), cedarMat);
      outerW.position.set(0.465, -0.04, 0);
      inner.add(outerW);

      for (const side of [-1, 1]) {
        const zWall = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.042), cedarMat);
        zWall.position.set(0.27, -0.015, side * 0.225);
        inner.add(zWall);
      }

      // Bronze hinge pin & front trigger lug (压舌)
      const lug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.24, 10),
        this.bronzeHighlightMat
      );
      lug.rotation.x = Math.PI / 2;
      lug.position.set(0.38, -0.1, stopPegLocalZ - 0.06);
      inner.add(lug);

      this.scoopGroups.push(sg);
      this.scene.add(sg);
    }

    // --- 3. Tianheng Balance Beam (天衡) + Counterweight (天权) ---
    this.balanceGroup = new THREE.Group();
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.072, 0.08), this.bronzeHighlightMat);
    beam.position.set(-0.08, 0, 0);
    beam.castShadow = true;
    this.balanceGroup.add(beam);

    // Balance Fork pad (格叉) at right end (+0.53, +0.02)
    const forkPad = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.075, 0.14), this.bronzeHighlightMat);
    forkPad.position.set(0.53, 0.02, 0);
    this.balanceGroup.add(forkPad);

    // Hanging Counterweight (天权) at left end (-0.64, -0.04)
    const cwBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.13, 0.24, 16),
      this.bronzeHighlightMat
    );
    cwBody.position.set(-0.64, -0.14, 0);
    cwBody.castShadow = true;
    this.balanceGroup.add(cwBody);
    this.scene.add(this.balanceGroup);

    // --- 3b. Vertical Tie Rod (天条) ---
    this.pushRodGroup = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 1.23, 10), this.bronzeHighlightMat);
    rod.castShadow = true;
    this.pushRodGroup.add(rod);
    const rodTop = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), this.bronzeHighlightMat);
    rodTop.position.y = 0.615;
    this.pushRodGroup.add(rodTop);
    const rodBot = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), this.bronzeHighlightMat);
    rodBot.position.y = -0.615;
    this.pushRodGroup.add(rodBot);
    this.scene.add(this.pushRodGroup);

    // --- 4. Upper Latch (天锁) ---
    this.latchGroup = new THREE.Group();
    const latchArm = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.11), this.bronzeHighlightMat);
    latchArm.position.set(-0.33, 0.0, 0);
    latchArm.castShadow = true;
    this.latchGroup.add(latchArm);

    const latchHook = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.12), this.bronzeHighlightMat);
    latchHook.position.set(-0.635, 0.0, 0);
    this.latchGroup.add(latchHook);
    this.scene.add(this.latchGroup);

    // --- 5. Anti-Rebound Pawl (右天锁) ---
    this.pawlGroup = new THREE.Group();
    const pawlArm = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.064, 0.09), this.bronzeHighlightMat);
    pawlArm.position.set(0.24, -0.14, 0);
    pawlArm.rotation.z = -0.45;
    this.pawlGroup.add(pawlArm);
    this.scene.add(this.pawlGroup);

    // --- 6. Central Vertical Shaft (天柱) + Crown Gears + 12 Wooden Puppets + Cam Pegs + Armillary Inner Rings ---
    this.shaftGroup = new THREE.Group();

    // Central timber pillar (y = 1.65 to 10.35 -> relative to shaft y=5.2: -3.55 to +5.15)
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 8.2, 18), walnutMat);
    pillar.position.y = 0.4;
    pillar.castShadow = true;
    this.shaftGroup.add(pillar);

    // Decorative bronze collar bands along the vertical shaft
    for (const yRel of [-2.4, -0.8, 0.8, 2.6, 3.6]) {
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.21, 0.21, 0.12, 18),
        this.bronzeHighlightMat
      );
      collar.position.y = yRel;
      this.shaftGroup.add(collar);
    }

    // Horizontal Crown Gear (拨牙冠轮) at y = horizGearY
    const relGearY = horizGearY - 5.2;
    const hGearDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(gearRadius + 0.08, gearRadius + 0.08, 0.14, 28),
      this.gearHighlightMat
    );
    hGearDisc.position.y = relGearY;
    hGearDisc.castShadow = true;
    hGearDisc.receiveShadow = true;
    this.shaftGroup.add(hGearDisc);

    // Timekeeping Turntable (司辰轮) at y = puppetDeckY
    const relDeckY = puppetDeckY - 5.2;
    const puppetDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.48, 1.48, 0.12, 32),
      walnutMat
    );
    puppetDisc.position.y = relDeckY - 0.18;
    puppetDisc.receiveShadow = true;
    this.shaftGroup.add(puppetDisc);

    // Gold decorative rim on turntable
    const puppetRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.035, 10, 48),
      this.bronzeHighlightMat
    );
    puppetRim.rotation.x = Math.PI / 2;
    puppetRim.position.y = relDeckY - 0.12;
    this.shaftGroup.add(puppetRim);

    // Top Crown Gear (天轮) at y = topGearY
    const relTopY = topGearY - 5.2;
    const topDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(topGearRadius + 0.07, topGearRadius + 0.07, 0.12, 24),
      this.gearHighlightMat
    );
    topDisc.position.y = relTopY;
    this.shaftGroup.add(topDisc);

    const relCamY = camY - 5.2;
    const robeColors = ['#a62b22', '#2f6d5d', '#b8822e'];

    for (let i = 0; i < scoopCount; i++) {
      const a = (i * Math.PI * 2) / scoopCount;
      const sinA = Math.sin(a);
      const cosA = Math.cos(a);

      // Horizontal Crown Gear vertical pegs
      const gPeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.055, 0.3, 12),
        this.bronzeHighlightMat
      );
      gPeg.position.set(sinA * gearRadius, relGearY + 0.16, cosA * gearRadius);
      this.shaftGroup.add(gPeg);

      // Cam Pegs (拨子)
      const ca = a + (8 * Math.PI) / 180;
      const camArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.32, 8),
        this.bronzeHighlightMat
      );
      camArm.rotation.z = Math.PI / 2;
      camArm.rotation.y = Math.PI / 2 - ca;
      camArm.position.set(Math.sin(ca) * 0.66, relCamY, Math.cos(ca) * 0.66);
      this.shaftGroup.add(camArm);

      const camTip = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), this.bronzeHighlightMat);
      camTip.position.set(Math.sin(ca) * 1.32, relCamY, Math.cos(ca) * 1.32);
      this.shaftGroup.add(camTip);

      // Top Crown Gear pegs
      const tPeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.044, 0.22, 10),
        this.bronzeHighlightMat
      );
      tPeg.position.set(sinA * topGearRadius, relTopY + 0.1, cosA * topGearRadius);
      this.shaftGroup.add(tPeg);

      // Song Dynasty Painted Wooden Puppet (报时木人) holding Hour Plaque (子..亥)
      const puppet = this.createWoodenPuppet(robeColors[i % robeColors.length], i);
      puppet.position.set(sinA * 1.24, relDeckY - 0.12, cosA * 1.24);
      puppet.rotation.y = a;
      this.shaftGroup.add(puppet);
    }

    // Rotating inner gilded rings of the Armillary Sphere (浑仪内环) coupled to the top of the shaft
    const innerArmillary = new THREE.Group();
    innerArmillary.position.y = TOWER_LAYOUT.armillaryCenter.y - 5.2;
    const eqRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.028, 12, 42),
      this.bronzeHighlightMat
    );
    eqRing.rotation.x = Math.PI / 2 - 0.42;
    innerArmillary.add(eqRing);

    const eclipticRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.024, 12, 42),
      cinnabarMat
    );
    eclipticRing.rotation.x = Math.PI / 2 + 0.32;
    eclipticRing.rotation.z = 0.25;
    innerArmillary.add(eclipticRing);

    const sightingTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 1.36, 12),
      this.bronzeHighlightMat
    );
    sightingTube.rotation.z = 0.58;
    innerArmillary.add(sightingTube);
    this.shaftGroup.add(innerArmillary);

    this.scene.add(this.shaftGroup);

    // --- 7. Hanging Bronze Bell (青铜报时钟) ---
    this.bellGroup = new THREE.Group();
    const bellChain = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.44, 8), this.bellMat);
    bellChain.position.y = -0.22;
    this.bellGroup.add(bellChain);

    // Lathe bell profile (Song temple bronze bell silhouette)
    const bellPts = [
      new THREE.Vector2(0.04, 0.28),
      new THREE.Vector2(0.14, 0.24),
      new THREE.Vector2(0.17, 0.1),
      new THREE.Vector2(0.21, -0.14),
      new THREE.Vector2(0.26, -0.28),
      new THREE.Vector2(0.23, -0.3),
    ];
    const bellGeo = new THREE.LatheGeometry(bellPts, 24);
    const bellMesh = new THREE.Mesh(bellGeo, this.bellMat);
    bellMesh.position.y = -0.68;
    bellMesh.castShadow = true;
    this.bellGroup.add(bellMesh);
    this.scene.add(this.bellGroup);

    // --- 8. Bell Hammer (撞钟木槌) ---
    this.bellHammerGroup = new THREE.Group();
    const bhTail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.07), cedarMat);
    bhTail.position.set(0.14, -0.16, 0);
    bhTail.rotation.z = 0.65;
    this.bellHammerGroup.add(bhTail);

    const bhArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.055, 0.055), cedarMat);
    bhArm.position.set(-0.19, 0.11, 0);
    bhArm.rotation.z = -0.52;
    this.bellHammerGroup.add(bhArm);

    const bhHead = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.16, 12), cinnabarMat);
    bhHead.rotation.z = Math.PI / 2;
    bhHead.position.set(-0.37, 0.21, 0);
    bhHead.castShadow = true;
    this.bellHammerGroup.add(bhHead);
    this.scene.add(this.bellHammerGroup);

    // --- 9. Drum Mallet (击鼓槌) ---
    this.drumHammerGroup = new THREE.Group();
    const dhTail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.08), cedarMat);
    dhTail.position.set(-0.2, 0.14, 0);
    dhTail.rotation.z = 0.85;
    this.drumHammerGroup.add(dhTail);

    const dhArm = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.74, 0.052), cedarMat);
    dhArm.position.set(0.24, 0.29, 0);
    dhArm.rotation.z = -0.68;
    this.drumHammerGroup.add(dhArm);

    const dhHead = new THREE.Mesh(new THREE.SphereGeometry(0.074, 12, 12), cinnabarMat);
    dhHead.position.set(0.48, 0.58, 0);
    dhHead.castShadow = true;
    this.drumHammerGroup.add(dhHead);
    this.scene.add(this.drumHammerGroup);

    // --- 10. Celestial Globe (浑象) ---
    this.globeGroup = new THREE.Group();
    const globeMat = new THREE.MeshStandardMaterial({
      map: this.textures.celestialGlobe,
      roughness: 0.42,
      metalness: 0.45,
    });
    const globeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24), globeMat);
    globeSphere.castShadow = true;
    this.globeGroup.add(globeSphere);

    // Engraved bronze equatorial band + 12 pinion gear teeth meshing with Top Crown Gear
    const globeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.54, 0.022, 10, 42),
      this.bronzeHighlightMat
    );
    this.globeGroup.add(globeRing);

    for (let i = 0; i < scoopCount; i++) {
      const a = -Math.PI / 2 + (8 * Math.PI) / 180 + (i * Math.PI * 2) / scoopCount;
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.065, 0.095),
        this.bronzeHighlightMat
      );
      tooth.position.set(Math.cos(a) * 0.61, Math.sin(a) * 0.61, 0);
      tooth.rotation.z = a;
      this.globeGroup.add(tooth);
    }
    this.scene.add(this.globeGroup);
  }

  private createWoodenPuppet(robeColor: string, index: number): THREE.Group {
    const p = new THREE.Group();
    const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.55 });
    const skinMat = new THREE.MeshStandardMaterial({ color: '#e9c89f', roughness: 0.6 });
    const hatMat = new THREE.MeshStandardMaterial({ color: '#1b1d24', roughness: 0.7 });

    // Song official robe (cone/cylinder)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.52, 12), robeMat);
    body.position.y = 0.26;
    body.castShadow = true;
    p.add(body);

    // Sleeves
    const sleeves = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.14), robeMat);
    sleeves.position.set(0, 0.36, 0.06);
    p.add(sleeves);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 10), skinMat);
    head.position.y = 0.61;
    p.add(head);

    // Song Futou official cap (宋代长翅幞头!)
    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 0.09, 10), hatMat);
    hatCrown.position.y = 0.71;
    p.add(hatCrown);

    const hatWings = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.026, 0.03), hatMat);
    hatWings.position.set(0, 0.7, -0.02);
    p.add(hatWings);

    // Vertical Calligraphy Hour Plaque held forward (子时..亥时)
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: this.textures.hourPlaques[index],
      roughness: 0.45,
      emissive: '#331c08',
      emissiveIntensity: 0.25,
    });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.03), plaqueMat);
    plaque.position.set(0, 0.42, 0.18);
    p.add(plaque);

    return p;
  }

  private buildWaterInstances(): void {
    const geo = new THREE.SphereGeometry(0.056, 10, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: '#5ce8f5',
      emissive: '#177586',
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.1,
    });
    this.waterInstanced = new THREE.InstancedMesh(geo, mat, this.physics.maxWaterDrops);
    this.waterInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.waterInstanced.frustumCulled = false;
    this.scene.add(this.waterInstanced);
  }

  private spawnAcousticRipple(pos: THREE.Vector3, colorHex: string): void {
    const geo = new THREE.RingGeometry(0.22, 0.27, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);
    this.ripples.push({ mesh, age: 0, maxAge: 1.15, baseScale: 1.0 });
  }

  /**
   * Synchronize every single visual mesh strictly 1:1 from Rapier3D rigid body transforms!
   * Zero hand-keyframed mechanical animations.
   */
  public syncFromPhysics(dt: number, activeStage: number): void {
    syncBody(this.wheelGroup, this.physics.wheelBody);
    for (let i = 0; i < this.scoopGroups.length; i++) {
      syncBody(this.scoopGroups[i], this.physics.scoopBodies[i]);
    }
    syncBody(this.balanceGroup, this.physics.balanceBody);
    syncBody(this.pushRodGroup, this.physics.pushRodBody);
    syncBody(this.latchGroup, this.physics.latchBody);
    syncBody(this.pawlGroup, this.physics.pawlBody);
    syncBody(this.shaftGroup, this.physics.shaftBody);
    syncBody(this.bellGroup, this.physics.bellBody);
    syncBody(this.bellHammerGroup, this.physics.bellHammerBody);
    syncBody(this.drumHammerGroup, this.physics.drumHammerBody);
    syncBody(this.globeGroup, this.physics.globeBody);

    // Sync instanced water spheres 1:1 from Rapier3D water rigid bodies
    for (let i = 0; i < this.physics.maxWaterDrops; i++) {
      if (this.physics.waterActive[i]) {
        const p = this.physics.waterBodies[i].translation();
        this.dummyMatrix.makeTranslation(p.x, p.y, p.z);
        this.waterInstanced.setMatrixAt(i, this.dummyMatrix);
      } else {
        this.waterInstanced.setMatrixAt(i, this.hiddenMatrix);
      }
    }
    this.waterInstanced.instanceMatrix.needsUpdate = true;

    // Trigger subtle visual acoustic ripple on real Rapier bell/drum impact
    if (this.physics.bellStrikes > this.lastSeenBellCount) {
      this.lastSeenBellCount = this.physics.bellStrikes;
      this.spawnAcousticRipple(
        new THREE.Vector3(TOWER_LAYOUT.bellPivot.x, TOWER_LAYOUT.bellPivot.y - 0.68, TOWER_LAYOUT.bellPivot.z + 0.15),
        '#ffd980'
      );
    }
    if (this.physics.drumStrikes > this.lastSeenDrumCount) {
      this.lastSeenDrumCount = this.physics.drumStrikes;
      this.spawnAcousticRipple(
        new THREE.Vector3(TOWER_LAYOUT.drumPos.x, TOWER_LAYOUT.drumPos.y + 0.12, TOWER_LAYOUT.drumPos.z + 0.15),
        '#ff8566'
      );
    }
    if (this.physics.bellStrikes < this.lastSeenBellCount) {
      this.lastSeenBellCount = this.physics.bellStrikes;
    }
    if (this.physics.drumStrikes < this.lastSeenDrumCount) {
      this.lastSeenDrumCount = this.physics.drumStrikes;
    }

    // Update acoustic ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.age += dt;
      if (r.age >= r.maxAge) {
        this.scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
        this.ripples.splice(i, 1);
      } else {
        const u = r.age / r.maxAge;
        const s = r.baseScale + u * 3.2;
        r.mesh.scale.set(s, s, s);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.78;
      }
    }

    // Subtle visual lighting emphasis for the active narrative stage
    const stageTargets: Array<[number, number, number]> = [
      [1.2, 5.2, 3.5],   // 0: Hero establishing
      [2.2, 4.1, 2.0],   // 1: Constant-head water
      [0.9, 4.2, 2.2],   // 2: Tianheng escapement
      [0.2, 2.4, 0.8],   // 3: 90° Crown gear train
      [0.0, 6.4, 1.4],   // 4: Timekeeping pavilion (puppets, bell, drum)
      [0.0, 9.6, 1.2],   // 5: Celestial globe & armillary
    ];
    const target = stageTargets[Math.min(activeStage, stageTargets.length - 1)];
    this.focusLight.position.lerp(new THREE.Vector3(target[0], target[1], target[2]), Math.min(1, dt * 3));

    const bronzeEmissive = activeStage === 2 ? 0.34 : 0.12;
    this.bronzeHighlightMat.emissiveIntensity += (bronzeEmissive - this.bronzeHighlightMat.emissiveIntensity) * Math.min(1, dt * 4);
    const gearEmissive = activeStage === 3 ? 0.34 : 0.08;
    this.gearHighlightMat.emissiveIntensity += (gearEmissive - this.gearHighlightMat.emissiveIntensity) * Math.min(1, dt * 4);
  }
}

function syncBody(obj: THREE.Object3D, body: { translation: () => { x: number; y: number; z: number }; rotation: () => { x: number; y: number; z: number; w: number } }): void {
  const t = body.translation();
  const r = body.rotation();
  obj.position.set(t.x, t.y, t.z);
  obj.quaternion.set(r.x, r.y, r.z, r.w);
}

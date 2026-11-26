import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import { LAYOUT, SHICHEN_NAMES, type SuSongClockPhysics } from '../physics/clockPhysics';
import type { TowerMaterials } from '../materials';

export type HighlightTarget = 'none' | 'water' | 'escapement' | 'gears' | 'pagoda' | 'celestial';

interface SoundRipple {
  mesh: THREE.Mesh;
  age: number;
  maxAge: number;
  active: boolean;
}

export class TowerVisuals {
  public scene: THREE.Scene;
  public materials: TowerMaterials;

  // Dynamic mechanical visual groups synced 1-to-1 to Rapier3D rigid bodies
  public waterwheelGroup = new THREE.Group();
  public scoopGroups: THREE.Group[] = [];
  public scoopWaterMeshes: THREE.Mesh[] = [];
  public weighbridgeGroup = new THREE.Group();
  public pullRodGroup = new THREE.Group();
  public upperBeamGroup = new THREE.Group();
  public antiReboundGroup = new THREE.Group();
  public tianZhuGroup = new THREE.Group();
  public bellStrikerGroup = new THREE.Group();
  public bellGroup = new THREE.Group();
  public drumStrikerGroup = new THREE.Group();
  public globeGroup = new THREE.Group();

  // Instanced real-physics water droplets
  private dropletInstanced: THREE.InstancedMesh;
  private dummyMatrix = new THREE.Matrix4();
  private dummyPos = new THREE.Vector3();
  private dummyQuat = new THREE.Quaternion();
  private dummyScale = new THREE.Vector3(1, 1, 1);

  // Water surfaces & atmospheric accents (non-mechanical)
  private streamMeshes: THREE.Mesh[] = [];
  private basinWaterMesh!: THREE.Mesh;
  private dustPoints!: THREE.Points;
  private ripples: SoundRipple[] = [];

  // Key anchor objects for 3D-tracked callout labels
  public anchors: Record<string, THREE.Object3D> = {};

  // Highlightable material clones / accents
  private escapementAccentMat: THREE.MeshStandardMaterial;
  private gearAccentMat: THREE.MeshStandardMaterial;
  private waterAccentMat: THREE.MeshPhysicalMaterial;
  private pagodaLanternLight!: THREE.PointLight;

  constructor(scene: THREE.Scene, materials: TowerMaterials, maxDroplets: number) {
    this.scene = scene;
    this.materials = materials;
    this.scene.environment = materials.envMap;

    // Cloned highlight-capable materials for active-chapter diegetic emphasis
    this.escapementAccentMat = materials.brightBronze.clone();
    this.gearAccentMat = materials.lightPineWood.clone();
    this.waterAccentMat = materials.waterStream.clone();

    this.setupAtmosphereAndLights();
    this.buildArchitecturalTower();
    this.buildWaterSupplyTower();

    this.buildWaterwheelVisual();
    this.buildScoopsVisual();
    this.buildEscapementVisual();
    this.buildTianZhuVisual();
    this.buildBellAndDrumVisual();
    this.buildCelestialGlobeVisual();

    // Instanced mesh for all real-physics dynamic water droplets
    const dropGeo = new THREE.SphereGeometry(0.056, 12, 10);
    this.dropletInstanced = new THREE.InstancedMesh(dropGeo, materials.waterGloss, maxDroplets);
    this.dropletInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dropletInstanced.frustumCulled = false;
    this.scene.add(this.dropletInstanced);

    // Pre-allocate acoustic ripple rings for Bell & Drum strikes
    this.initSoundRipples();
  }

  private setupAtmosphereAndLights(): void {
    // Rich museum twilight atmospheric sky dome (indigo zenith -> warm horizon ochre)
    const skyGeo = new THREE.SphereGeometry(48, 24, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#0c1322') },
        midColor: { value: new THREE.Color('#1c2536') },
        bottomColor: { value: new THREE.Color('#2c2427') },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.22, 0.14, h));
          col = mix(col, topColor, smoothstep(0.14, 0.72, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));

    // Subtle distance fog blending into exhibition floor
    this.scene.fog = new THREE.FogExp2('#181f2c', 0.017);

    // Exhibition dark slate floor plane with subtle warm center glow
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(32, 48),
      new THREE.MeshStandardMaterial({
        color: '#1b202b',
        roughness: 0.85,
        metalness: 0.12,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Warm golden key directional sunlight casting soft shadows
    const keyLight = new THREE.DirectionalLight('#ffdfb4', 2.75);
    keyLight.position.set(8.5, 13.5, 9.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -7.5;
    keyLight.shadow.camera.right = 7.5;
    keyLight.shadow.camera.top = 11.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.025;
    this.scene.add(keyLight);

    // Cool Song celadon-sky hemisphere fill so wood & shadows stay sculpted & readable
    const hemi = new THREE.HemisphereLight('#9bc3e2', '#4a3524', 1.05);
    this.scene.add(hemi);

    // Warm golden rim light from back-left to outline bronze gears, spokes, and eaves
    const rimLight = new THREE.DirectionalLight('#ffd194', 1.15);
    rimLight.position.set(-7.5, 8.5, -8.5);
    this.scene.add(rimLight);

    // Dedicated warm accent light on the lower escapement & gear train cutaway
    const mechLight = new THREE.PointLight('#ffcf8c', 3.2, 9.5, 1.4);
    mechLight.position.set(1.6, 3.8, 3.2);
    this.scene.add(mechLight);

    // Warm interior lantern glow inside the 报时木阁 pavilion window
    this.pagodaLanternLight = new THREE.PointLight('#ffad4a', 5.2, 6.2, 1.4);
    this.pagodaLanternLight.position.set(LAYOUT.TIANZHU_X, 6.15, -0.30);
    this.scene.add(this.pagodaLanternLight);

    // Subtle cool cyan bounce light from the water tanks & basin
    const waterGlow = new THREE.PointLight('#6ce7f0', 2.2, 5.5, 1.6);
    waterGlow.position.set(2.3, 3.6, 1.6);
    this.scene.add(waterGlow);

    // Floating warm lantern dust motes (gentle atmospheric depth)
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 * 3.7;
      const r = 2.6 + (i % 9) * 0.65;
      positions[i * 3] = Math.cos(a) * r + 0.6;
      positions[i * 3 + 1] = 0.6 + ((i * 1.37) % 10.2);
      positions[i * 3 + 2] = Math.sin(a) * r - 0.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: '#ffe5b0',
      size: 0.055,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    this.dustPoints = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustPoints);
  }

  private buildArchitecturalTower(): void {
    const m = this.materials;
    const arch = new THREE.Group();
    const cx = LAYOUT.TIANZHU_X; // 0.55
    const cz = LAYOUT.TIANZHU_Z; // -1.40

    // --- 1. Stepped Song Carved Stone Plinth (青石台基) ---
    const baseLower = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.28, 5.8), m.carvedStone);
    baseLower.position.set(0.75, 0.14, -0.45);
    baseLower.receiveShadow = true;
    baseLower.castShadow = true;
    arch.add(baseLower);

    const baseUpper = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.26, 5.2), m.carvedStone);
    baseUpper.position.set(0.75, 0.41, -0.45);
    baseUpper.receiveShadow = true;
    baseUpper.castShadow = true;
    arch.add(baseUpper);

    // Carved stone curb framing the lower Drainage Basin (退水池) under the waterwheel
    const basinCurbMat = m.carvedStone;
    const addCurb = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basinCurbMat);
      b.position.set(x, y, z);
      b.castShadow = true;
      b.receiveShadow = true;
      arch.add(b);
    };
    addCurb(3.8, 0.22, 0.16, 1.05, 0.64, 1.48); // front curb
    addCurb(3.8, 0.22, 0.16, 1.05, 0.64, -0.08); // back curb
    addCurb(0.16, 0.22, 1.56, -0.78, 0.64, 0.70); // left curb
    addCurb(0.16, 0.22, 1.56, 2.88, 0.64, 0.70); // right curb

    // Shimmering water surface inside 退水池
    this.basinWaterMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.52, 1.42), m.waterGloss);
    this.basinWaterMesh.rotation.x = -Math.PI / 2;
    this.basinWaterMesh.position.set(1.05, 0.61, 0.70);
    arch.add(this.basinWaterMesh);

    // --- 2. Open Cutaway Song Timber Structural Columns (朱漆立柱 + 斗拱) ---
    // Positioned cleanly AROUND the cutaway zone so front/side cameras have 100% unobstructed sightlines!
    const colPositions: Array<[number, number, number]> = [
      [-1.35, 8.45, -2.75], // rear-left tall tower corner
      [2.45, 8.45, -2.75],  // rear-right tall tower corner
      [-1.35, 8.45, -0.05], // mid-front-left tall corner (frames pagoda left)
      [2.45, 8.45, -0.05],  // mid-front-right tall corner (frames pagoda right)
    ];

    for (const [px, topY, pz] of colPositions) {
      const h = topY - 0.54;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.125, h, 14), m.cinnabarLacquer);
      col.position.set(px, 0.54 + h * 0.5, pz);
      col.castShadow = true;
      col.receiveShadow = true;
      arch.add(col);

      // Carved stone column plinth (柱础)
      const drumBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.14, 14), m.carvedStone);
      drumBase.position.set(px, 0.61, pz);
      arch.add(drumBase);

      // Song Dougong bracket capital (斗拱) at middle tier (5.12), upper tier (7.02), and eaves (8.42)
      for (const by of [5.12, 7.02, 8.42]) {
        const cap = this.createDougongCluster();
        cap.position.set(px, by, pz);
        arch.add(cap);
      }
    }

    // Rear ornate carved Song lattice backdrop screen (behind 天柱 at z = -2.75) for museum depth & contrast
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(3.75, 7.8, 0.08), m.walnutWood);
    rearWall.position.set(cx, 4.45, -2.78);
    rearWall.receiveShadow = true;
    arch.add(rearWall);

    // Decorative gold-trimmed Song timber lattice mullions on rear backdrop
    for (let x = -1.1; x <= 2.25; x += 0.55) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.05, 7.6, 0.11), m.cinnabarLacquer);
      mullion.position.set(x, 4.45, -2.74);
      arch.add(mullion);
    }
    for (const y of [2.4, 5.15, 7.05]) {
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.16, 0.18), m.cinnabarLacquer);
      lintel.position.set(cx, y, -2.74);
      arch.add(lintel);
    }

    // --- 3. Lower Mechanical Bearing Supports (枢轮轴架 & 擒纵支座) ---
    // Rear bearing pedestal supporting horizontal 枢轴 at z = -0.35 (clear of wheel & pinwheel!)
    const addTimberSupport = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m.walnutWood);
      b.position.set(x, y, z);
      b.castShadow = true;
      b.receiveShadow = true;
      arch.add(b);
    };
    // Twin diagonal A-frame legs supporting waterwheel axle behind the rim (z = -0.22)
    addTimberSupport(0.15, 2.15, 0.16, 0.55, 1.56, -0.24);
    addTimberSupport(0.16, 2.05, 0.16, 0.55, 1.50, -1.06); // rear end of 枢轴 bearing
    // Brass journal bearing caps
    const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16), m.agedBronze);
    cap1.rotation.x = Math.PI / 2;
    cap1.position.set(0.55, LAYOUT.WHEEL_CENTER.y, -0.24);
    arch.add(cap1);

    // Front-right slender wooden fulcrum post for Escapement pivots (枢衡 y=3.04 & 天衡 y=4.24 at x=1.50, z=1.00)
    // Offset slightly forward to z = 1.12 with horizontal bronze pivot pins reaching back to z = 1.00!
    addTimberSupport(0.11, 4.15, 0.11, 1.50, 2.60, 1.15);
    // Small bracket for 右天锁 anti-rebound pawl pivot at (0.24, 4.54, 0.45)
    addTimberSupport(0.09, 0.09, 0.65, 0.24, 4.54, 0.15);
    addTimberSupport(0.10, 4.10, 0.10, -1.05, 2.55, 0.45);
    addTimberSupport(1.38, 0.10, 0.10, -0.40, 4.54, 0.45);

    // Bronze footstep thrust bearing at bottom of 天柱 (y = 0.62)
    const thrustBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.40, 0.20, 18), m.agedBronze);
    thrustBase.position.set(cx, 0.64, cz);
    arch.add(thrustBase);

    // --- 4. Middle Tier Floor & Glowing 报时木阁 (Timekeeping Pagoda, y = 5.15..6.95) ---
    // Cutaway deck with circular opening for 天柱
    const midDeck = new THREE.Mesh(new THREE.BoxGeometry(3.95, 0.14, 2.85), m.walnutWood);
    midDeck.position.set(cx, 5.15, cz);
    midDeck.castShadow = true;
    midDeck.receiveShadow = true;
    arch.add(midDeck);

    // Ornate 报时木阁 front arch frame around the front window (x = 0.55, z = -0.14)
    const archLeftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.072, 1.72, 12), m.cinnabarLacquer);
    archLeftPillar.position.set(cx - 0.56, 6.08, -0.14);
    arch.add(archLeftPillar);
    const archRightPillar = archLeftPillar.clone();
    archRightPillar.position.set(cx + 0.56, 6.08, -0.14);
    arch.add(archRightPillar);

    // Top lintel & inscribed 「報時木閣」 plaque above the central puppet window
    const windowLintel = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.14, 0.16), m.cinnabarLacquer);
    windowLintel.position.set(cx, 6.84, -0.14);
    arch.add(windowLintel);

    const pavilionPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.28, 0.05), m.plaquePavilion);
    pavilionPlaque.position.set(cx, 6.96, -0.04);
    arch.add(pavilionPlaque);

    // Glowing hanging Song palace lanterns flanking the pagoda window
    for (const lx of [cx - 0.56, cx + 0.56]) {
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.18, 8), m.lanternGlow);
      lantern.position.set(lx, 6.62, 0.02);
      arch.add(lantern);
      const capTop = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.06, 8), m.cinnabarLacquer);
      capTop.position.set(lx, 6.73, 0.02);
      arch.add(capTop);
    }

    // Carved wooden gallows bracket holding the hanging bronze temple bell (left)
    addTimberSupport(0.55, 0.09, 0.09, -0.78, LAYOUT.BELL_PIVOT.y + 0.06, LAYOUT.BELL_PIVOT.z);
    addTimberSupport(0.09, 1.18, 0.09, -1.04, 5.78, LAYOUT.BELL_PIVOT.z);
    // Support posts for Bell & Drum striker vertical pivots
    const bellPivotPost = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.65, 10), m.darkIron);
    bellPivotPost.position.set(LAYOUT.BELL_STRIKER_PIVOT.x, 5.48, LAYOUT.BELL_STRIKER_PIVOT.z);
    arch.add(bellPivotPost);
    const drumPivotPost = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.65, 10), m.darkIron);
    drumPivotPost.position.set(LAYOUT.DRUM_STRIKER_PIVOT.x, 5.48, LAYOUT.DRUM_STRIKER_PIVOT.z);
    arch.add(drumPivotPost);

    // Ornate wooden stand & Ceremonial Red Drum (红漆大鼓) on right side of pagoda
    const drumGroup = new THREE.Group();
    drumGroup.position.set(LAYOUT.DRUM_POS.x, LAYOUT.DRUM_POS.y, LAYOUT.DRUM_POS.z);
    // Barrel body (orient along X)
    const drumShell = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.34, 24), m.cinnabarLacquer);
    drumShell.rotation.z = Math.PI / 2;
    drumShell.castShadow = true;
    drumGroup.add(drumShell);
    // Left & right rawhide drumheads
    const leftHead = new THREE.Mesh(new THREE.CircleGeometry(0.242, 24), m.drumSkin);
    leftHead.rotation.y = -Math.PI / 2;
    leftHead.position.x = -0.172;
    drumGroup.add(leftHead);
    const rightHead = new THREE.Mesh(new THREE.CircleGeometry(0.242, 24), m.drumSkin);
    rightHead.rotation.y = Math.PI / 2;
    rightHead.position.x = 0.172;
    drumGroup.add(rightHead);
    // Golden drum tacks around both rims
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      for (const sx of [-0.155, 0.155]) {
        const tack = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), m.brightBronze);
        tack.position.set(sx, Math.cos(a) * 0.25, Math.sin(a) * 0.25);
        drumGroup.add(tack);
      }
    }
    // Carved cradle stand beneath drum
    const drumStand = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.32), m.walnutWood);
    drumStand.position.set(0, -0.36, 0);
    drumGroup.add(drumStand);
    arch.add(drumGroup);

    // Sweeping Mid-Tier Song Glazed Roof Eaves (腰檐) framing sides & rear
    const midEave = this.createSongEaveRoof(4.7, 3.3, 0.36);
    midEave.position.set(cx, 7.12, cz);
    arch.add(midEave);

    // --- 5. Upper Gallery Floor (浑象层 y = 7.08) & Rooftop Terrace (露台 y = 8.50) ---
    const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.12, 2.8), m.walnutWood);
    upperDeck.position.set(cx, 7.08, cz);
    upperDeck.receiveShadow = true;
    arch.add(upperDeck);

    // Fixed bronze meridian frame cradling the spinning 浑象 Celestial Globe
    const meridianRing = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.025, 10, 40), m.brightBronze);
    meridianRing.position.set(LAYOUT.GLOBE_CENTER.x, LAYOUT.GLOBE_CENTER.y, LAYOUT.GLOBE_CENTER.z);
    meridianRing.rotation.y = Math.PI / 2;
    arch.add(meridianRing);
    const horizonRing = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.028, 10, 40), m.agedBronze);
    horizonRing.position.set(LAYOUT.GLOBE_CENTER.x, LAYOUT.GLOBE_CENTER.y, LAYOUT.GLOBE_CENTER.z);
    horizonRing.rotation.x = Math.PI / 2;
    arch.add(horizonRing);
    // Support legs for celestial globe horizon frame
    for (const [dx, dz] of [[-0.45, -0.30], [-0.45, 0.30], [0.45, -0.30], [0.45, 0.30]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.62, 8), m.agedBronze);
      leg.position.set(LAYOUT.GLOBE_CENTER.x + dx, 7.40, LAYOUT.GLOBE_CENTER.z + dz);
      arch.add(leg);
    }

    // Rooftop Platform (露台) & Sweeping Main Song Eave Roof + Balustrades
    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, 2.9), m.walnutWood);
    topDeck.position.set(cx, 8.50, cz);
    topDeck.castShadow = true;
    topDeck.receiveShadow = true;
    arch.add(topDeck);

    const topEave = this.createSongEaveRoof(5.05, 3.65, 0.44);
    topEave.position.set(cx, 8.56, cz);
    arch.add(topEave);

    // Grand inscribed main tower plaque 「水運儀象臺」 on top front eaves!
    const mainPlaque = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.44, 0.07), m.plaqueMain);
    mainPlaque.position.set(cx, 8.42, 0.18);
    arch.add(mainPlaque);

    // Carved Song rooftop balustrades (寻杖望柱栏杆) surrounding 浑仪
    const railY = 8.84;
    const addRail = (w: number, d: number, x: number, z: number) => {
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.055, d), m.cinnabarLacquer);
      topBar.position.set(x, railY, z);
      arch.add(topBar);
      const midBar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.035, d), m.cinnabarLacquer);
      midBar.position.set(x, railY - 0.14, z);
      arch.add(midBar);
    };
    addRail(3.7, 0.06, cx, -0.05);
    addRail(3.7, 0.06, cx, -2.75);
    addRail(0.06, 2.7, cx - 1.85, cz);
    addRail(0.06, 2.7, cx + 1.85, cz);
    for (let x = cx - 1.85; x <= cx + 1.86; x += 0.74) {
      for (const z of [-0.05, -2.75]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.44, 0.075), m.cinnabarLacquer);
        post.position.set(x, 8.74, z);
        arch.add(post);
        const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), m.brightBronze);
        lotus.position.set(x, 8.99, z);
        arch.add(lotus);
      }
    }

    // Fixed Outer Horizon Ring supporting the Rooftop Armillary Sphere (浑仪地平环)
    const armHorizon = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.036, 12, 48), m.agedBronze);
    armHorizon.rotation.x = Math.PI / 2;
    armHorizon.position.set(cx, LAYOUT.ARMILLARY_Y, cz);
    arch.add(armHorizon);
    // Four dragon-scroll bronze legs anchoring horizon ring to rooftop terrace
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.046, 0.68, 10), m.agedBronze);
      leg.position.set(cx + Math.cos(a) * 0.68, 8.84, cz + Math.sin(a) * 0.68);
      arch.add(leg);
    }

    this.scene.add(arch);
  }

  private createDougongCluster(): THREE.Group {
    const g = new THREE.Group();
    const m = this.materials;
    const cap1 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), m.cinnabarLacquer);
    g.add(cap1);
    const armX = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.075, 0.14), m.walnutWood);
    armX.position.y = 0.07;
    g.add(armX);
    const armZ = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.075, 0.52), m.walnutWood);
    armZ.position.y = 0.07;
    g.add(armZ);
    const topBlock = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.36), m.brightBronze);
    topBlock.position.y = 0.13;
    g.add(topBlock);
    return g;
  }

  private createSongEaveRoof(w: number, d: number, h: number): THREE.Group {
    const g = new THREE.Group();
    const m = this.materials;
    // Open hollow eave skirt (4 sloping roof sides so center stays open!)
    const slopeAngle = 0.32;
    const eaveThick = 0.07;
    const bandW = 0.62;

    const frontEave = new THREE.Mesh(new THREE.BoxGeometry(w, eaveThick, bandW), m.songRoofTile);
    frontEave.position.set(0, -h * 0.15, d * 0.5 - bandW * 0.35);
    frontEave.rotation.x = slopeAngle;
    frontEave.castShadow = true;
    g.add(frontEave);

    const backEave = new THREE.Mesh(new THREE.BoxGeometry(w, eaveThick, bandW), m.songRoofTile);
    backEave.position.set(0, -h * 0.15, -(d * 0.5 - bandW * 0.35));
    backEave.rotation.x = -slopeAngle;
    g.add(backEave);

    const leftEave = new THREE.Mesh(new THREE.BoxGeometry(bandW, eaveThick, d), m.songRoofTile);
    leftEave.position.set(-(w * 0.5 - bandW * 0.35), -h * 0.15, 0);
    leftEave.rotation.z = -slopeAngle;
    g.add(leftEave);

    const rightEave = new THREE.Mesh(new THREE.BoxGeometry(bandW, eaveThick, d), m.songRoofTile);
    rightEave.position.set(w * 0.5 - bandW * 0.35, -h * 0.15, 0);
    rightEave.rotation.z = slopeAngle;
    g.add(rightEave);

    // Golden upturned corner wing tips (飞檐翘角)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.36, 6), m.brightBronze);
        horn.position.set(sx * (w * 0.5 + 0.04), -h * 0.02, sz * (d * 0.5 + 0.04));
        horn.rotation.z = -sx * 0.95;
        horn.rotation.x = sz * 0.72;
        g.add(horn);
      }
    }

    return g;
  }

  private buildWaterSupplyTower(): void {
    const m = this.materials;
    const g = new THREE.Group();
    const zW = LAYOUT.SPOUT_TIP.z; // 0.72

    // Sturdy carved timber water-tower trestle on the right side (x = 2.45..3.45)
    for (const [px, pz] of [[2.38, zW - 0.36], [2.38, zW + 0.36], [3.46, zW - 0.36], [3.46, zW + 0.36]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 4.45, 0.11), m.walnutWood);
      post.position.set(px, 2.75, pz);
      post.castShadow = true;
      g.add(post);
    }
    // Cross braces
    for (const y of [1.8, 3.62, 4.82]) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.09, 0.88), m.nanmuWood);
      shelf.position.set(2.92, y, zW);
      shelf.receiveShadow = true;
      g.add(shelf);
    }

    // --- 1. Upper Reservoir (天池) at (3.12, 5.18, zW) ---
    const tianChi = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.56, 0.72), m.agedBronze);
    tianChi.position.set(3.12, 5.16, zW);
    tianChi.castShadow = true;
    g.add(tianChi);
    const tcWater = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.64), m.waterGloss);
    tcWater.rotation.x = -Math.PI / 2;
    tcWater.position.set(3.12, 5.45, zW);
    g.add(tcWater);

    // Feed pipe from 天池 down into 平水壶
    const feedSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.36, 10), m.brightBronze);
    feedSpout.rotation.z = Math.PI / 2;
    feedSpout.position.set(2.68, 4.98, zW);
    g.add(feedSpout);

    // Continuous shimmering water stream from 天池 -> 平水壶
    const upperStream = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.036, 0.62, 10), this.waterAccentMat);
    upperStream.position.set(2.54, 4.66, zW);
    g.add(upperStream);
    this.streamMeshes.push(upperStream);

    // --- 2. Constant-Head Tank (平水壶) with overflow weir at (2.56, 4.08, zW) ---
    const pingShui = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.66, 0.68), m.agedBronze);
    pingShui.position.set(2.56, 4.02, zW);
    pingShui.castShadow = true;
    g.add(pingShui);
    // Decorative gold rim band showing constant water level mark!
    const levelBand = new THREE.Mesh(new THREE.BoxGeometry(0.81, 0.04, 0.71), m.brightBronze);
    levelBand.position.set(2.56, 4.24, zW);
    g.add(levelBand);
    const psWater = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.60), m.waterGloss);
    psWater.rotation.x = -Math.PI / 2;
    psWater.position.set(2.56, 4.36, zW);
    g.add(psWater);

    // Side overflow weir spout (溢水口) visibly demonstrating constant water head!
    const overflowSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.24, 8), m.brightBronze);
    overflowSpout.rotation.z = Math.PI / 2;
    overflowSpout.position.set(3.04, 4.24, zW);
    g.add(overflowSpout);
    const overflowStream = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, 3.60, 8), this.waterAccentMat);
    overflowStream.position.set(3.15, 2.44, zW);
    g.add(overflowStream);
    this.streamMeshes.push(overflowStream);

    // Main Bronze Dragon-Head Outflow Nozzle (龙头注口) pouring into the 30° scoop!
    const mainNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.056, 0.44, 12), m.brightBronze);
    mainNozzle.rotation.z = Math.PI / 2;
    mainNozzle.position.set(2.12, LAYOUT.SPOUT_TIP.y + 0.03, zW);
    g.add(mainNozzle);
    // Sculpted bronze dragon mouth collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 16), m.brightBronze);
    collar.rotation.y = Math.PI / 2;
    collar.position.set(1.94, LAYOUT.SPOUT_TIP.y + 0.03, zW);
    g.add(collar);

    // Translucent liquid ribbon bridging spout tip down toward the filling scoop (while real physics droplets fall along it!)
    const spoutRibbon = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.62, 10), this.waterAccentMat);
    spoutRibbon.position.set(LAYOUT.SPOUT_TIP.x - 0.02, LAYOUT.SPOUT_TIP.y - 0.30, zW);
    g.add(spoutRibbon);
    this.streamMeshes.push(spoutRibbon);

    // Callout anchor for 平水壶
    const anchorPing = new THREE.Object3D();
    anchorPing.position.set(2.56, 4.42, zW);
    g.add(anchorPing);
    this.anchors['pingshuihu'] = anchorPing;

    const anchorSpout = new THREE.Object3D();
    anchorSpout.position.set(LAYOUT.SPOUT_TIP.x, LAYOUT.SPOUT_TIP.y + 0.08, zW);
    g.add(anchorSpout);
    this.anchors['spout'] = anchorSpout;

    this.scene.add(g);
  }

  private buildWaterwheelVisual(): void {
    const m = this.materials;
    const g = this.waterwheelGroup;

    // Double timber rims (front & back cheeks) + cross tie bars
    for (const rz of [-0.10, 0.10]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(LAYOUT.WHEEL_RIM_RADIUS, 0.068, 12, 48), m.nanmuWood);
      rim.position.z = rz;
      rim.castShadow = true;
      rim.receiveShadow = true;
      g.add(rim);

      // Inner structural strengthening ring
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.042, 10, 36), m.walnutWood);
      innerRing.position.z = rz * 0.7;
      g.add(innerRing);
    }

    // Iron outer rim reinforcement band
    const ironBand = new THREE.Mesh(new THREE.TorusGeometry(LAYOUT.WHEEL_RIM_RADIUS + 0.062, 0.016, 8, 48), m.darkIron);
    g.add(ironBand);

    // Central carved timber hub & brass end-boss
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.42, 18), m.walnutWood);
    hub.rotation.x = Math.PI / 2;
    hub.castShadow = true;
    g.add(hub);
    const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 16), m.brightBronze);
    hubCap.rotation.x = Math.PI / 2;
    hubCap.position.z = 0.22;
    g.add(hubCap);

    // 12 Radial Spokes (辐条) extending out to R_spoke = 1.76m with gleaming bronze arrestor tips!
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const alpha = Math.PI / 2 - (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.048, LAYOUT.WHEEL_SPOKE_RADIUS, 10), m.nanmuWood);
      spoke.position.set(Math.cos(alpha) * (LAYOUT.WHEEL_SPOKE_RADIUS * 0.5), Math.sin(alpha) * (LAYOUT.WHEEL_SPOKE_RADIUS * 0.5), 0);
      spoke.rotation.z = alpha - Math.PI / 2;
      spoke.castShadow = true;
      g.add(spoke);

      // Bronze arrestor ferrule tip that physically strikes 左天锁 & 右天锁!
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.26, 10), this.escapementAccentMat);
      tip.position.set(Math.cos(alpha) * 1.65, Math.sin(alpha) * 1.65, 0);
      tip.rotation.z = alpha - Math.PI / 2;
      g.add(tip);

      // Hinge bracket peg supporting scoop k on front side (+Z)
      const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.34, 8), m.darkIron);
      hingePin.rotation.x = Math.PI / 2;
      hingePin.position.set(
        Math.cos(alpha) * LAYOUT.SCOOP_HINGE_RADIUS,
        Math.sin(alpha) * LAYOUT.SCOOP_HINGE_RADIUS,
        LAYOUT.SCOOP_Z_OFFSET * 0.55
      );
      g.add(hingePin);
    }

    // Main Horizontal Axle (枢轴) extending back along -Z to the Driving Pinwheel
    const dz = LAYOUT.DRIVE_GEAR_Z - LAYOUT.WHEEL_CENTER.z; // -1.27
    const axleLen = Math.abs(dz) + 0.42;
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, axleLen, 16), m.walnutWood);
    axle.rotation.x = Math.PI / 2;
    axle.position.z = dz * 0.5 - 0.06;
    axle.castShadow = true;
    g.add(axle);

    // Horizontal Driving Pinwheel (拨牙机轮) at local z = dz (-1.27)
    const driveDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 24), m.nanmuWood);
    driveDisc.rotation.x = Math.PI / 2;
    driveDisc.position.z = dz;
    driveDisc.castShadow = true;
    g.add(driveDisc);

    // 12 Stout Wooden Radial Peg-Teeth matching the Rapier3D capsule colliders 1-to-1!
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const alpha = -Math.PI / 2 - (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const peg = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.16, 6, 10), this.gearAccentMat);
      peg.position.set(
        Math.cos(alpha) * LAYOUT.GEAR_PITCH_RADIUS,
        Math.sin(alpha) * LAYOUT.GEAR_PITCH_RADIUS,
        dz
      );
      peg.rotation.z = alpha - Math.PI / 2;
      peg.castShadow = true;
      g.add(peg);
    }

    // Callout anchors
    const wheelAnchor = new THREE.Object3D();
    wheelAnchor.position.set(-0.85, 0.85, 0.25);
    g.add(wheelAnchor);
    this.anchors['waterwheel'] = wheelAnchor;

    const gearAnchor = new THREE.Object3D();
    gearAnchor.position.set(0.0, -0.58, dz);
    g.add(gearAnchor);
    this.anchors['drive_gear'] = gearAnchor;

    this.scene.add(g);
  }

  private buildScoopsVisual(): void {
    const m = this.materials;
    const triggerZRel = LAYOUT.SCOOP_TRIGGER_Z - (LAYOUT.WHEEL_CENTER.z + LAYOUT.SCOOP_Z_OFFSET);

    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const g = new THREE.Group();

      // Open-top wooden scoop trough matching Rapier3D 5-wall hollow collider geometry
      const addWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m.nanmuWood);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        g.add(mesh);
      };
      addWall(0.44, 0.045, 0.36, 0.28, -0.11, 0);    // floor
      addWall(0.045, 0.30, 0.36, 0.08, 0.03, 0);     // inner wall
      addWall(0.045, 0.27, 0.36, 0.48, 0.015, 0);    // outer pour lip
      addWall(0.44, 0.30, 0.045, 0.28, 0.03, 0.175); // front wall
      addWall(0.44, 0.30, 0.045, 0.28, 0.03, -0.175);// back wall

      // Decorative dark-iron reinforcement corner straps
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.455, 0.03, 0.375), m.darkIron);
      strap.position.set(0.28, -0.04, 0);
      g.add(strap);

      // Hinge knuckle around local origin
      const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.28, 10), m.darkIron);
      knuckle.rotation.x = Math.PI / 2;
      g.add(knuckle);

      // Gleaming Brass Trigger Pin protruding forward (+Z) onto 枢衡
      const trigPin = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.24, 10), this.escapementAccentMat);
      trigPin.rotation.x = Math.PI / 2;
      trigPin.position.set(0.42, -0.10, triggerZRel - 0.02);
      g.add(trigPin);

      // Dynamic water meniscus block inside scoop (scaled strictly from real Rapier3D droplet count!)
      const waterFill = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.30), m.waterGloss);
      waterFill.position.set(0.28, -0.08, 0);
      waterFill.scale.set(1, 0.01, 1);
      waterFill.visible = false;
      g.add(waterFill);

      this.scoopGroups.push(g);
      this.scoopWaterMeshes.push(waterFill);
      this.scene.add(g);
    }

    // Fixed world anchor hovering cleanly by the filling scoop station
    const scoopAnchor = new THREE.Object3D();
    scoopAnchor.position.set(1.94, 3.45, 0.92);
    this.scene.add(scoopAnchor);
    this.anchors['filling_scoop'] = scoopAnchor;
  }

  private buildEscapementVisual(): void {
    const m = this.materials;
    const rodDx = LAYOUT.PULL_ROD_DX; // 0.36

    // --- 1. Lower Weighbridge Lever (枢衡 + 枢权 Bronze Counterweight) ---
    const wb = this.weighbridgeGroup;
    const wbBeam = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.075, 0.085), m.walnutWood);
    wbBeam.position.set(-0.04, 0, 0);
    wbBeam.castShadow = true;
    wb.add(wbBeam);

    // Fulcrum brass pivot hub
    const wbHub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.26, 12), m.darkIron);
    wbHub.rotation.x = Math.PI / 2;
    wbHub.position.z = 0.07;
    wb.add(wbHub);

    // Right brass cradle fork (格叉) receiving the filling scoop trigger pin
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.048, 0.14), this.escapementAccentMat);
    cradle.position.set(0.49, -0.036, 0);
    wb.add(cradle);

    // Left hanging sculpted Bronze Counterweight (枢权)
    const lowerCord = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.14, 8), this.escapementAccentMat);
    lowerCord.position.set(-0.58, -0.07, 0);
    wb.add(lowerCord);
    const lowerWeight = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 14), this.escapementAccentMat);
    lowerWeight.scale.set(1.0, 1.22, 1.0);
    lowerWeight.position.set(-0.58, -0.17, 0);
    lowerWeight.castShadow = true;
    wb.add(lowerWeight);
    const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.016, 8, 18), m.agedBronze);
    lowerRing.rotation.x = Math.PI / 2;
    lowerRing.position.set(-0.58, -0.17, 0);
    wb.add(lowerRing);

    const wbAnchor = new THREE.Object3D();
    wbAnchor.position.set(-0.58, -0.22, 0.12);
    wb.add(wbAnchor);
    this.anchors['weighbridge'] = wbAnchor;
    this.scene.add(wb);

    // --- 2. Vertical Bronze Pull-Rod (天条) ---
    const rodLen = LAYOUT.UPPER_BEAM_PIVOT.y - LAYOUT.WEIGHBRIDGE_PIVOT.y; // 1.20
    const rodMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, rodLen, 10), this.escapementAccentMat);
    rodMesh.castShadow = true;
    this.pullRodGroup.add(rodMesh);
    for (const ey of [-rodLen * 0.5, rodLen * 0.5]) {
      const eye = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.012, 8, 14), this.escapementAccentMat);
      eye.position.y = ey;
      this.pullRodGroup.add(eye);
    }
    const rodAnchor = new THREE.Object3D();
    rodAnchor.position.set(0.08, 0, 0.08);
    this.pullRodGroup.add(rodAnchor);
    this.anchors['pull_rod'] = rodAnchor;
    this.scene.add(this.pullRodGroup);

    // --- 3. Upper Balance Beam (天衡 + 左天锁 + 天权) ---
    const ub = this.upperBeamGroup;
    const zToWheel = LAYOUT.WHEEL_CENTER.z - LAYOUT.UPPER_BEAM_PIVOT.z; // -0.55

    // Front rocker arm connecting to 天条 at (+rodDx, 0, 0)
    const frontArm = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.075, 0.085), m.walnutWood);
    frontArm.position.set(-0.22, 0, 0);
    frontArm.castShadow = true;
    ub.add(frontArm);

    // Transverse rocker axle connecting front lever plane (z=0) back to spoke plane (z=-0.55)
    const crossAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, Math.abs(zToWheel) + 0.22, 12), m.darkIron);
    crossAxle.rotation.x = Math.PI / 2;
    crossAxle.position.set(0, 0, zToWheel * 0.5);
    ub.add(crossAxle);

    // Rear lever arm in spoke plane (z = -0.55) carrying 左天锁!
    const rearArm = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.08, 0.085), m.walnutWood);
    rearArm.position.set(-0.46, 0.04, zToWheel);
    rearArm.castShadow = true;
    ub.add(rearArm);

    // Sculpted Bronze Upper Stop-Latch (左天锁) catching the 12 o'clock spoke!
    const latchMesh = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.22, 0.13), this.escapementAccentMat);
    latchMesh.position.set(-0.865, 0.06, zToWheel);
    latchMesh.castShadow = true;
    ub.add(latchMesh);

    // Hanging Bronze Counterweight (天权)
    const upperWeight = new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 12), this.escapementAccentMat);
    upperWeight.scale.set(1.0, 1.18, 1.0);
    upperWeight.position.set(-0.78, -0.09, -0.22);
    ub.add(upperWeight);

    const latchAnchor = new THREE.Object3D();
    latchAnchor.position.set(-0.865, 0.18, zToWheel + 0.10);
    ub.add(latchAnchor);
    this.anchors['upper_lock'] = latchAnchor;
    this.scene.add(ub);

    // --- 4. Anti-Rebound Pawl (右天锁 / 止回爪) ---
    const pawlArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.34, 6, 10), this.escapementAccentMat);
    pawlArm.position.set(0.19, -0.15, 0);
    pawlArm.rotation.z = Math.PI * 0.29;
    this.antiReboundGroup.add(pawlArm);
    const pawlPin = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.12, 10), m.darkIron);
    pawlPin.rotation.x = Math.PI / 2;
    this.antiReboundGroup.add(pawlPin);
    this.scene.add(this.antiReboundGroup);
  }

  private buildTianZhuVisual(): void {
    const m = this.materials;
    const g = this.tianZhuGroup;

    // 1. Tall Central Vertical Shaft (天柱) rising from y = 0.72 up to y = 8.95!
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.115, 8.25, 12), m.walnutWood);
    shaft.position.y = 4.84;
    shaft.castShadow = true;
    g.add(shaft);

    // Ornamental bronze shaft collars along 天柱
    for (const cy of [1.45, 2.35, 3.70, 5.28, 6.95, 8.58]) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.12, 14), m.brightBronze);
      collar.position.y = cy;
      g.add(collar);
    }

    // 2. Lower Crown Pin-Gear (天柱下轮) at y = CROWN_GEAR_Y (1.84)
    const crownDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.11, 24), m.nanmuWood);
    crownDisc.position.y = LAYOUT.CROWN_GEAR_Y - 0.04;
    crownDisc.castShadow = true;
    g.add(crownDisc);
    // 12 Vertical Wooden Peg-Teeth matching Rapier3D crown pegs 1-to-1!
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const phi = (k + 0.5) * ((Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT);
      const peg = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.16, 6, 10), this.gearAccentMat);
      peg.position.set(
        Math.sin(phi) * LAYOUT.GEAR_PITCH_RADIUS,
        LAYOUT.CROWN_GEAR_Y + 0.11,
        Math.cos(phi) * LAYOUT.GEAR_PITCH_RADIUS
      );
      peg.castShadow = true;
      g.add(peg);
    }

    // 3. Timekeeping Carousel (昼夜机轮) at y = CAROUSEL_Y (5.55)
    const wheelDisc = new THREE.Mesh(new THREE.CylinderGeometry(LAYOUT.CAROUSEL_RADIUS, LAYOUT.CAROUSEL_RADIUS, 0.08, 32), m.nanmuWood);
    wheelDisc.position.y = LAYOUT.CAROUSEL_Y;
    wheelDisc.castShadow = true;
    wheelDisc.receiveShadow = true;
    g.add(wheelDisc);
    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(LAYOUT.CAROUSEL_RADIUS, 0.04, 8, 36), m.cinnabarLacquer);
    wheelRim.rotation.x = Math.PI / 2;
    wheelRim.position.y = LAYOUT.CAROUSEL_Y;
    g.add(wheelRim);

    // 12 Hand-crafted Painted Song Wooden Timekeeper Puppets (司辰木人) holding inscribed 时牌!
    const robes = [m.robeRed, m.robeJade, m.robeIndigo];
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      // Positioned so at tick k (天柱 rotated -k*30°), puppet k swings straight to front window (+Z)!
      const phi = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const puppet = this.createSichenPuppet(robes[k % 3], m.shichenTablets[k]);
      puppet.position.set(Math.sin(phi) * 0.90, LAYOUT.CAROUSEL_Y + 0.04, Math.cos(phi) * 0.90);
      puppet.rotation.y = phi;
      g.add(puppet);
    }

    // 24 Gleaming Brass Cam-Pegs (拨牙) matching Rapier3D Bell & Drum cam colliders 1-to-1!
    const camR = 1.05;
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const phiBell = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT + 0.04;
      const bCam = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.10, 6, 8), m.brightBronze);
      bCam.position.set(Math.sin(phiBell) * camR, LAYOUT.CAROUSEL_Y - 0.13, Math.cos(phiBell) * camR);
      g.add(bCam);

      const phiDrum = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT + 0.45;
      const dCam = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.10, 6, 8), m.brightBronze);
      dCam.position.set(Math.sin(phiDrum) * camR, LAYOUT.CAROUSEL_Y + 0.15, Math.cos(phiDrum) * camR);
      g.add(dCam);
    }

    // 4. Upper Pinwheel at y = UPPER_GEAR_Y (7.20) driving the Celestial Globe (浑象)
    const upperDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 24), m.nanmuWood);
    upperDisc.position.y = LAYOUT.UPPER_GEAR_Y - 0.02;
    g.add(upperDisc);
    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const phi = (k * Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT;
      const peg = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.13, 6, 8), this.gearAccentMat);
      peg.position.set(Math.sin(phi) * 0.44, LAYOUT.UPPER_GEAR_Y + 0.09, Math.cos(phi) * 0.44);
      g.add(peg);
    }

    // 5. Crowning Bronze Armillary Sphere (浑仪) atop 天柱 at y = ARMILLARY_Y (9.18)!
    const arm = new THREE.Group();
    arm.position.y = LAYOUT.ARMILLARY_Y;
    // Equatorial ring (赤道环) tilted at Kaifeng latitude ~35°
    const eqRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.028, 12, 48), m.brightBronze);
    eqRing.rotation.x = Math.PI / 2 - 0.61;
    arm.add(eqRing);
    // Ecliptic ring (黄道环) tilted 23.5° relative to equator
    const ecRing = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.024, 12, 48), m.brightBronze);
    ecRing.rotation.x = Math.PI / 2 - 0.61 + 0.41;
    ecRing.rotation.z = 0.25;
    arm.add(ecRing);
    // Meridian ring (子午环)
    const merRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.03, 12, 48), m.brightBronze);
    arm.add(merRing);
    // Colure ring perpendicular
    const colRing = new THREE.Mesh(new THREE.TorusGeometry(0.60, 0.022, 10, 44), m.brightBronze);
    colRing.rotation.y = Math.PI / 2;
    arm.add(colRing);
    // Central bronze polar axis & sighting tube (窥管)
    const polarAxis = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.32, 10), m.agedBronze);
    polarAxis.rotation.z = 0.61;
    arm.add(polarAxis);
    const sightTube = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.96, 12), m.brightBronze);
    sightTube.rotation.x = 0.55;
    sightTube.rotation.z = -0.35;
    arm.add(sightTube);
    const centerOrb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), m.brightBronze);
    arm.add(centerOrb);
    g.add(arm);

    // Callout anchors
    const tzAnchor = new THREE.Object3D();
    tzAnchor.position.set(0.16, 3.25, 0.16);
    g.add(tzAnchor);
    this.anchors['tianzhu'] = tzAnchor;

    const armAnchor = new THREE.Object3D();
    armAnchor.position.set(0, LAYOUT.ARMILLARY_Y + 0.72, 0);
    g.add(armAnchor);
    this.anchors['armillary'] = armAnchor;

    const puppetWindowAnchor = new THREE.Object3D();
    puppetWindowAnchor.position.set(LAYOUT.TIANZHU_X, 6.38, -0.35);
    this.scene.add(puppetWindowAnchor);
    this.anchors['puppet_window'] = puppetWindowAnchor;

    this.scene.add(g);
  }

  private createSichenPuppet(robeMat: THREE.MeshStandardMaterial, tabletMat: THREE.MeshStandardMaterial): THREE.Group {
    const p = new THREE.Group();
    const m = this.materials;

    // Flowing Song official robe body
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.115, 0.42, 10), robeMat);
    robe.position.y = 0.21;
    robe.castShadow = true;
    p.add(robe);

    // Golden official sash belt
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.092, 0.045, 10), m.brightBronze);
    belt.position.y = 0.24;
    p.add(belt);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.066, 12, 10), m.skinWood);
    head.position.y = 0.48;
    p.add(head);

    // Iconic Northern Song winged official cap (展脚幞头)!
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.068, 0.07, 10), m.darkIron);
    cap.position.y = 0.54;
    p.add(cap);
    const wings = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.018, 0.022), m.darkIron);
    wings.position.set(0, 0.545, -0.01);
    p.add(wings);

    // Inscribed vertical hour plaque (时牌) held prominently forward!
    const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, 0.026), tabletMat);
    tablet.position.set(0, 0.34, 0.125);
    p.add(tablet);

    return p;
  }

  private buildBellAndDrumVisual(): void {
    const m = this.materials;

    // --- 1. Hanging Sculpted Song Bronze Temple Bell (铜钟) ---
    const bell = this.bellGroup;
    // Suspension chain & dragon loop (蒲牢) from pivot (0,0,0) down to bell crown (-0.34)
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 8), m.agedBronze);
    chain.position.y = -0.16;
    bell.add(chain);
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.016, 8, 14), m.brightBronze);
    loop.position.y = -0.32;
    bell.add(loop);

    // Classic Song bell profile via LatheGeometry
    const bellProfile = [
      new THREE.Vector2(0.0, -0.33),
      new THREE.Vector2(0.11, -0.35),
      new THREE.Vector2(0.135, -0.45),
      new THREE.Vector2(0.155, -0.58),
      new THREE.Vector2(0.195, -0.71),
      new THREE.Vector2(0.205, -0.75),
      new THREE.Vector2(0.178, -0.75),
    ];
    const bellGeo = new THREE.LatheGeometry(bellProfile, 24);
    const bellMesh = new THREE.Mesh(bellGeo, m.brightBronze);
    bellMesh.castShadow = true;
    bell.add(bellMesh);

    // Decorative raised bronze waist rings on the bell
    for (const ry of [-0.46, -0.60, -0.70]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(ry < -0.65 ? 0.192 : ry < -0.55 ? 0.158 : 0.136, 0.012, 8, 24), m.agedBronze);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = ry;
      bell.add(ring);
    }

    const bellAnchor = new THREE.Object3D();
    bellAnchor.position.set(-0.08, -0.45, 0.16);
    bell.add(bellAnchor);
    this.anchors['bell'] = bellAnchor;
    this.scene.add(bell);

    // --- 2. Bell Striker Mallet Arm (击钟木臂) ---
    const bs = this.bellStrikerGroup;
    const bsHub = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.34, 12), m.nanmuWood);
    bsHub.position.y = 0.04;
    bs.add(bsHub);
    // Follower finger reaching inward to local (+0.14, -0.14, -0.14)
    const bfArm = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.04, 0.21), m.walnutWood);
    bfArm.position.set(0.07, -0.14, -0.07);
    bfArm.rotation.y = -Math.PI * 0.25;
    bs.add(bfArm);
    const bfTip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), m.brightBronze);
    bfTip.position.set(0.14, -0.14, -0.14);
    bs.add(bfTip);
    // Upper mallet shaft & rounded wooden hammer head at local (0, +0.22, +0.18)
    const bmShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.20, 8), m.cinnabarLacquer);
    bmShaft.rotation.x = Math.PI / 2;
    bmShaft.position.set(0, 0.22, 0.09);
    bs.add(bmShaft);
    const bmHead = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), m.lightPineWood);
    bmHead.scale.set(1.2, 0.95, 0.95);
    bmHead.position.set(0, 0.22, 0.18);
    bs.add(bmHead);
    this.scene.add(bs);

    // --- 3. Drum Striker Mallet Arm (击鼓木臂) ---
    const ds = this.drumStrikerGroup;
    const dsHub = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.34, 12), m.nanmuWood);
    dsHub.position.y = 0.08;
    ds.add(dsHub);
    const dfArm = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.04, 0.21), m.walnutWood);
    dfArm.position.set(-0.07, 0.14, -0.07);
    dfArm.rotation.y = Math.PI * 0.25;
    ds.add(dfArm);
    const dfTip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), m.brightBronze);
    dfTip.position.set(-0.14, 0.14, -0.14);
    ds.add(dfTip);
    const dmShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.20, 8), m.cinnabarLacquer);
    dmShaft.rotation.x = Math.PI / 2;
    dmShaft.position.set(0, 0.20, -0.09);
    ds.add(dmShaft);
    const dmHead = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), m.lightPineWood);
    dmHead.scale.set(1.2, 0.95, 0.95);
    dmHead.position.set(0, 0.20, -0.18);
    ds.add(dmHead);
    this.scene.add(ds);

    const drumAnchor = new THREE.Object3D();
    drumAnchor.position.set(LAYOUT.DRUM_POS.x, LAYOUT.DRUM_POS.y + 0.32, LAYOUT.DRUM_POS.z + 0.12);
    this.scene.add(drumAnchor);
    this.anchors['drum'] = drumAnchor;
  }

  private buildCelestialGlobeVisual(): void {
    const m = this.materials;
    const g = this.globeGroup;

    // Star-studded Song Celestial Globe (浑象)
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), m.celestialGlobe);
    sphere.castShadow = true;
    g.add(sphere);

    // Raised golden bronze equatorial band hugging the globe
    const eqBand = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.012, 8, 36), m.brightBronze);
    eqBand.rotation.y = Math.PI / 2;
    g.add(eqBand);

    // Axle & Driven 12-Peg Pinwheel on right side (local x = +0.47) meshing with 天柱 upper gear!
    const gearLocalX = LAYOUT.TIANZHU_X - 0.44 - LAYOUT.GLOBE_CENTER.x; // +0.47
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.96, 12), m.darkIron);
    axle.rotation.z = Math.PI / 2;
    axle.position.x = 0.08;
    g.add(axle);

    const gearDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.075, 24), m.nanmuWood);
    gearDisc.rotation.z = Math.PI / 2;
    gearDisc.position.x = gearLocalX;
    g.add(gearDisc);

    for (let k = 0; k < LAYOUT.WHEEL_SCOOP_COUNT; k++) {
      const theta = -Math.PI / 2 + (k + 0.5) * ((Math.PI * 2) / LAYOUT.WHEEL_SCOOP_COUNT);
      const peg = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.12, 6, 8), this.gearAccentMat);
      peg.position.set(gearLocalX, Math.sin(theta) * 0.44, Math.cos(theta) * 0.44);
      peg.rotation.x = Math.PI / 2 - theta;
      g.add(peg);
    }

    const globeAnchor = new THREE.Object3D();
    globeAnchor.position.set(0, 0.52, 0.12);
    g.add(globeAnchor);
    this.anchors['globe'] = globeAnchor;

    this.scene.add(g);
  }

  private initSoundRipples(): void {
    const geo = new THREE.RingGeometry(0.18, 0.24, 32);
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: '#ffd978',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.ripples.push({ mesh, age: 0, maxAge: 1.15, active: false });
    }
  }

  public spawnSoundRipple(pos: { x: number; y: number; z: number }, colorHex: string): void {
    const slot = this.ripples.find((r) => !r.active) ?? this.ripples[0];
    slot.active = true;
    slot.age = 0;
    slot.mesh.visible = true;
    slot.mesh.position.set(pos.x, pos.y, pos.z + 0.14);
    slot.mesh.scale.setScalar(0.5);
    const mat = slot.mesh.material as THREE.MeshBasicMaterial;
    mat.color.set(colorHex);
    mat.opacity = 0.85;
  }

  public setHighlight(target: HighlightTarget, time: number): void {
    const pulse = 0.5 + 0.5 * Math.sin(time * 4.5);

    this.waterAccentMat.emissiveIntensity = target === 'water' ? 0.65 + pulse * 0.45 : 0.45;
    this.escapementAccentMat.emissive.set(target === 'escapement' ? '#b86c14' : '#000000');
    this.escapementAccentMat.emissiveIntensity = target === 'escapement' ? 0.35 + pulse * 0.35 : 0;
    this.gearAccentMat.emissive.set(target === 'gears' ? '#a65c14' : '#000000');
    this.gearAccentMat.emissiveIntensity = target === 'gears' ? 0.32 + pulse * 0.35 : 0;
    this.pagodaLanternLight.intensity = target === 'pagoda' ? 6.8 + pulse * 1.4 : 4.8;
    this.materials.celestialGlobe.emissiveIntensity = target === 'celestial' ? 0.65 + pulse * 0.35 : 0.32;
  }

  private copyTransform(body: RAPIER.RigidBody, obj: THREE.Object3D): void {
    const t = body.translation();
    const r = body.rotation();
    obj.position.set(t.x, t.y, t.z);
    obj.quaternion.set(r.x, r.y, r.z, r.w);
  }

  /**
   * Synchronizes EVERY single mechanical visual mesh strictly 1-to-1 from Rapier3D rigid bodies.
   * Zero hand-coded mechanical positions or rotations!
   */
  public syncFromPhysics(phys: SuSongClockPhysics, dt: number, elapsedTime: number): void {
    this.copyTransform(phys.waterwheelBody, this.waterwheelGroup);
    this.copyTransform(phys.weighbridgeBody, this.weighbridgeGroup);
    this.copyTransform(phys.pullRodBody, this.pullRodGroup);
    this.copyTransform(phys.upperBeamBody, this.upperBeamGroup);
    this.copyTransform(phys.antiReboundBody, this.antiReboundGroup);
    this.copyTransform(phys.tianZhuBody, this.tianZhuGroup);
    this.copyTransform(phys.bellStrikerBody, this.bellStrikerGroup);
    this.copyTransform(phys.bellBody, this.bellGroup);
    this.copyTransform(phys.drumStrikerBody, this.drumStrikerGroup);
    this.copyTransform(phys.globeBody, this.globeGroup);

    // 12 hinged scoops + water meniscus reflecting real Rapier3D water sphere count in each scoop
    for (let k = 0; k < phys.scoopBodies.length; k++) {
      this.copyTransform(phys.scoopBodies[k], this.scoopGroups[k]);
      const count = phys.scoopFillCount[k];
      const fillFrac = Math.min(1, count / 10);
      const waterMesh = this.scoopWaterMeshes[k];
      if (fillFrac > 0.05) {
        waterMesh.visible = true;
        waterMesh.scale.set(1, fillFrac, 1);
        waterMesh.position.y = -0.095 + fillFrac * 0.11;
      } else {
        waterMesh.visible = false;
      }
    }

    // Update InstancedMesh of all real dynamic water droplets directly from Rapier3D!
    let visibleCount = 0;
    for (let i = 0; i < phys.droplets.length; i++) {
      const d = phys.droplets[i];
      if (!d.active) continue;
      const p = d.body.translation();
      const v = d.body.linvel();
      this.dummyPos.set(p.x, p.y, p.z);
      // Slight velocity stretch for falling water beads (purely visual shading of real physics body)
      const speed = Math.hypot(v.x, v.y, v.z);
      const stretchY = 1 + Math.min(0.65, speed * 0.12);
      const squashXZ = 1 / Math.sqrt(stretchY);
      this.dummyQuat.identity();
      this.dummyScale.set(squashXZ, stretchY, squashXZ);
      this.dummyMatrix.compose(this.dummyPos, this.dummyQuat, this.dummyScale);
      this.dropletInstanced.setMatrixAt(visibleCount++, this.dummyMatrix);
    }
    this.dropletInstanced.count = visibleCount;
    this.dropletInstanced.instanceMatrix.needsUpdate = true;

    // Gentle non-mechanical shimmer on static liquid streams & basin surface
    const shimmer = 0.94 + 0.08 * Math.sin(elapsedTime * 15);
    for (const sm of this.streamMeshes) {
      sm.scale.set(shimmer, 1, shimmer);
    }
    this.basinWaterMesh.position.y = 0.61 + Math.sin(elapsedTime * 3.1) * 0.004;

    // Gentle drift on atmospheric dust motes
    this.dustPoints.rotation.y = elapsedTime * 0.018;

    // Update acoustic soundwave ripples
    for (const r of this.ripples) {
      if (!r.active) continue;
      r.age += dt;
      if (r.age >= r.maxAge) {
        r.active = false;
        r.mesh.visible = false;
      } else {
        const u = r.age / r.maxAge;
        r.mesh.scale.setScalar(0.6 + u * 3.8);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - u) * (1 - u) * 0.85;
      }
    }
  }
}

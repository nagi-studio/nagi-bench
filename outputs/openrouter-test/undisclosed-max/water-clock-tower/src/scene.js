import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const V3 = THREE.Vector3;

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function compact(group) {
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert();
  const buckets = new Map();
  const preserved = [];
  group.traverse((object) => {
    if (!object.isMesh) return;
    const matrix = inverse.clone().multiply(object.matrixWorld);
    if (object.isInstancedMesh) {
      preserved.push({ object, matrix });
      return;
    }
    if (object.userData.noMerge || object.material.map || object.material.transparent) {
      preserved.push({ object, matrix });
      return;
    }
    let geometry = object.geometry.clone();
    if (geometry.index) geometry = geometry.toNonIndexed();
    for (const key of Object.keys(geometry.attributes)) {
      if (key !== 'position' && key !== 'normal') geometry.deleteAttribute(key);
    }
    geometry.applyMatrix4(matrix);
    if (!buckets.has(object.material)) buckets.set(object.material, []);
    buckets.get(object.material).push(geometry);
  });
  group.clear();
  for (const [material, geometries] of buckets) {
    const geometry = mergeGeometries(geometries, false);
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    geometries.forEach((g) => g.dispose());
  }
  for (const { object, matrix } of preserved) {
    matrix.decompose(object.position, object.quaternion, object.scale);
    group.add(object);
  }
}

function mesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function box(parent, size, position, material, rotation = [0, 0, 0]) {
  return mesh(parent, new THREE.BoxGeometry(...size), material, position, rotation);
}

function cylinder(parent, radius, length, position, material, axis = 'y', segments = 20, radiusTop = radius) {
  const rotation = axis === 'z' ? [Math.PI / 2, 0, 0] : axis === 'x' ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return mesh(parent, new THREE.CylinderGeometry(radiusTop, radius, length, segments), material, position, rotation);
}

function torus(parent, radius, tube, position, material, rotation = [0, 0, 0], segments = 64) {
  return mesh(parent, new THREE.TorusGeometry(radius, tube, 8, segments), material, position, rotation);
}

function beam(parent, from, to, width, material, depth = width) {
  const a = new V3(...from);
  const b = new V3(...to);
  const object = box(parent, [width, a.distanceTo(b), depth], a.clone().add(b).multiplyScalar(0.5).toArray(), material);
  object.quaternion.setFromUnitVectors(new V3(0, 1, 0), b.sub(a).normalize());
  return object;
}

function tube(parent, points, radius, material) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new V3(...p)));
  return mesh(parent, new THREE.TubeGeometry(curve, 24, radius, 7, false), material);
}

function plaqueTexture(text, subtitle = '') {
  return canvasTexture(768, 256, (ctx, w, h) => {
    ctx.fillStyle = '#102d2c';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#b79758';
    ctx.lineWidth = 5;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.strokeRect(22, 22, w - 44, h - 44);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e0bd78';
    ctx.font = '82px "Noto Serif CJK SC", "AR PL UMing CN", serif';
    ctx.fillText(text, w / 2, subtitle ? h * 0.42 : h / 2);
    if (subtitle) {
      ctx.fillStyle = '#91aaa0';
      ctx.font = '24px sans-serif';
      ctx.fillText(subtitle, w / 2, h * 0.79);
    }
  });
}

function createMaterials() {
  const woodMap = canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d7c6aa';
    ctx.fillRect(0, 0, w, h);
    let seed = 17;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 170; i++) {
      const y = random() * h;
      ctx.strokeStyle = `rgba(70,45,28,${0.025 + random() * 0.08})`;
      ctx.lineWidth = 0.5 + random();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + random() * 6, w * 0.65, y - random() * 5, w, y + random() * 3);
      ctx.stroke();
    }
  });
  woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;
  woodMap.repeat.set(1, 3);
  return {
    wood: new THREE.MeshStandardMaterial({ color: '#73513a', map: woodMap, roughness: 0.73 }),
    woodLight: new THREE.MeshStandardMaterial({ color: '#b58a59', map: woodMap, roughness: 0.68 }),
    woodDark: new THREE.MeshStandardMaterial({ color: '#3b3329', map: woodMap, roughness: 0.8 }),
    bronze: new THREE.MeshStandardMaterial({ color: '#c79a52', metalness: 0.67, roughness: 0.32 }),
    bronzeDark: new THREE.MeshStandardMaterial({ color: '#796339', metalness: 0.72, roughness: 0.4 }),
    gold: new THREE.MeshStandardMaterial({ color: '#e4bc73', metalness: 0.62, roughness: 0.27 }),
    stone: new THREE.MeshStandardMaterial({ color: '#879087', roughness: 0.95 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: '#455e59', roughness: 0.94 }),
    roof: new THREE.MeshStandardMaterial({ color: '#174d4c', metalness: 0.22, roughness: 0.42, side: THREE.DoubleSide }),
    roofEdge: new THREE.MeshStandardMaterial({ color: '#437a6b', metalness: 0.35, roughness: 0.4 }),
    red: new THREE.MeshStandardMaterial({ color: '#7d3329', roughness: 0.75 }),
    redLight: new THREE.MeshStandardMaterial({ color: '#b45e41', roughness: 0.65 }),
    jade: new THREE.MeshStandardMaterial({ color: '#4bb9a8', metalness: 0.2, roughness: 0.25 }),
    globe: new THREE.MeshStandardMaterial({ color: '#153f46', metalness: 0.25, roughness: 0.48 }),
    water: new THREE.MeshStandardMaterial({ color: '#43c7bd', emissive: '#0e5555', emissiveIntensity: 0.32, transparent: true, opacity: 0.68, roughness: 0.12, metalness: 0.05, depthWrite: false }),
    waterBright: new THREE.MeshBasicMaterial({ color: '#83eee0', transparent: true, opacity: 0.8, depthWrite: false }),
    dark: new THREE.MeshStandardMaterial({ color: '#102b2c', roughness: 0.88 }),
    skin: new THREE.MeshStandardMaterial({ color: '#d3aa78', roughness: 0.85 }),
  };
}

export class ClockScene {
  constructor(container, mechanics) {
    this.container = container;
    this.mechanics = mechanics;
    this.materials = createMaterials();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a2226');
    this.scene.fog = new THREE.FogExp2('#0a2226', 0.019);
    this.camera = new THREE.PerspectiveCamera(37, innerWidth / innerHeight, 0.08, 130);
    this.camera.position.set(14, 10, 20);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.45));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    container.appendChild(this.renderer.domElement);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(room, 0.04).texture;
    this.scene.environmentIntensity = 0.48;
    room.dispose();
    pmrem.dispose();
    this.addLights();
    this.architecture = new THREE.Group();
    this.scene.add(this.architecture);
    this.buildBase();
    this.buildTower();
    this.buildWaterSystem();
    this.buildGears();
    this.buildPuppet();
    this.buildArmillary();
    compact(this.architecture);
    this.buildDroplets();
    this.buildDust();
    this.bindings = [
      [this.mechanics.wheel, this.wheel],
      [this.mechanics.pawl, this.pawl],
      [this.mechanics.liftShaft, this.liftShaft],
      [this.mechanics.gearDeck, this.gearDeck],
      [this.mechanics.transferGear, this.transferGear],
      [this.mechanics.timeShaft, this.timeShaft],
      [this.mechanics.cam, this.cam],
      [this.mechanics.hammer, this.hammer],
    ];
    this.sync();
    this.resize = () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.45));
    };
    window.addEventListener('resize', this.resize);
  }

  addLights() {
    this.scene.add(new THREE.HemisphereLight('#b5ddd0', '#182725', 1.75));
    const key = new THREE.DirectionalLight('#ffe0a6', 4.2);
    key.position.set(-7, 15, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -10;
    key.shadow.camera.right = 10;
    key.shadow.camera.top = 15;
    key.shadow.camera.bottom = -5;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.normalBias = 0.035;
    key.shadow.bias = -0.00025;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#62d5ca', 2.4);
    rim.position.set(8, 10, -8);
    this.scene.add(rim);
    const front = new THREE.DirectionalLight('#d5e4ce', 0.8);
    front.position.set(3, 5, 12);
    this.scene.add(front);
    this.bellLight = new THREE.PointLight('#ffcc73', 0, 4, 2);
    this.bellLight.position.set(1.65, 8.55, 1.4);
    this.scene.add(this.bellLight);
    this.pawlLight = new THREE.PointLight('#8cebd5', 0, 2.8, 2);
    this.pawlLight.position.set(0.2, 3.1, 2.1);
    this.scene.add(this.pawlLight);
  }

  buildBase() {
    const m = this.materials;
    const ground = mesh(this.scene, new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ color: '#0b2427', roughness: 1 }), [0, -0.16, 0], [-Math.PI / 2, 0, 0]);
    ground.castShadow = false;
    cylinder(this.architecture, 7.3, 0.13, [0, -0.05, 0], m.dark, 'y', 96, 7.3);
    torus(this.architecture, 7.05, 0.018, [0, 0.035, 0], m.bronzeDark, [Math.PI / 2, 0, 0], 96);
    torus(this.architecture, 6.75, 0.008, [0, 0.035, 0], m.bronzeDark, [Math.PI / 2, 0, 0], 96);
    box(this.architecture, [8.0, 0.35, 5.5], [0, 0.18, 0], m.stoneDark);
    box(this.architecture, [7.65, 0.27, 5.18], [0, 0.47, 0], m.stone);
    box(this.architecture, [7.9, 0.11, 5.42], [0, 0.65, 0], m.stoneDark);
    box(this.architecture, [7.3, 0.16, 4.8], [0, 0.76, 0], m.woodDark);
    for (let x = -3.35; x <= 3.36; x += 0.67) {
      box(this.architecture, [0.018, 0.24, 0.012], [x, 0.46, 2.602], m.stoneDark);
    }
    for (const x of [-3.45, 3.45]) {
      for (const z of [-2.1, 2.1]) {
        box(this.architecture, [0.56, 0.24, 0.56], [x, 0.83, z], m.stone);
        box(this.architecture, [0.65, 0.09, 0.65], [x, 0.99, z], m.stoneDark);
      }
    }
    const shadowTexture = canvasTexture(256, 256, (ctx, w, h) => {
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, w / 2);
      gradient.addColorStop(0, 'rgba(0,0,0,.65)');
      gradient.addColorStop(0.55, 'rgba(0,0,0,.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    });
    const shadow = mesh(this.scene, new THREE.PlaneGeometry(17, 14), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }), [0, -0.14, 0], [-Math.PI / 2, 0, 0]);
    shadow.castShadow = false;
  }

  buildTower() {
    const m = this.materials;
    const posts = [
      [-3.15, -1.45, 8.2], [2.65, -1.45, 8.2], [2.65, 1.05, 8.2], [-3.15, 1.05, 4.85],
    ];
    for (const [x, z, height] of posts) {
      box(this.architecture, [0.28, height, 0.28], [x, 0.85 + height / 2, z], m.wood);
      box(this.architecture, [0.37, 0.15, 0.37], [x, 1.02, z], m.bronzeDark);
      for (const y of [2.1, 5.75, 7.25, 8.85]) {
        if (y < height + 0.7) box(this.architecture, [0.34, 0.12, 0.34], [x, y, z], m.woodLight);
      }
    }
    for (const y of [5.75, 7.22, 8.9]) {
      box(this.architecture, [6.1, 0.23, 0.26], [-0.25, y, -1.45], m.wood);
      box(this.architecture, [0.25, 0.23, 2.75], [2.65, y, -0.2], m.wood);
      box(this.architecture, [0.25, 0.23, 2.75], [-3.15, y, -0.2], m.wood);
    }
    box(this.architecture, [6.1, 0.26, 0.26], [-0.25, 8.9, 1.05], m.woodLight);
    box(this.architecture, [6.15, 0.18, 3.0], [-0.25, 7.18, -0.18], m.woodDark);
    for (let x = -3; x < 2.7; x += 0.34) box(this.architecture, [0.28, 0.07, 2.9], [x, 7.31, -0.18], m.woodLight);
    box(this.architecture, [6.0, 0.14, 2.7], [-0.25, 5.68, -0.2], m.woodDark);
    for (const x of [-3.15, 2.65]) {
      for (let z = -1.35; z < 1.0; z += 0.42) {
        box(this.architecture, [0.075, 0.66, 0.075], [x, 6.15, z], m.woodLight);
      }
      box(this.architecture, [0.12, 0.11, 2.5], [x, 6.5, -0.2], m.woodLight);
      box(this.architecture, [0.09, 0.08, 2.5], [x, 5.91, -0.2], m.wood);
    }
    for (let x = -2.95; x < 2.6; x += 0.45) {
      box(this.architecture, [0.075, 0.7, 0.075], [x, 6.15, -1.45], m.woodLight);
    }
    box(this.architecture, [5.8, 0.12, 0.12], [-0.25, 6.52, -1.45], m.woodLight);
    for (const x of [-2.7, -1.7, -0.7, 0.3, 1.3, 2.2]) {
      beam(this.architecture, [x - 0.25, 8.88, 1.05], [x, 9.25, 1.05], 0.12, m.woodLight);
      beam(this.architecture, [x + 0.25, 8.88, 1.05], [x, 9.25, 1.05], 0.12, m.woodLight);
    }
    box(this.architecture, [5.6, 1.42, 0.11], [-0.25, 8.02, -1.38], m.red);
    for (const x of [-2.2, -1.2, -0.2, 0.8, 1.8]) {
      box(this.architecture, [0.055, 1.25, 0.05], [x, 8.02, -1.3], m.gold);
    }
    const plaque = new THREE.MeshStandardMaterial({ map: plaqueTexture('水 運 儀 象 臺'), roughness: 0.6 });
    mesh(this.architecture, new THREE.PlaneGeometry(2.25, 0.58), plaque, [-0.25, 9.04, 1.205]);
    this.buildRoof();
    for (const x of [-3.15, 2.65]) {
      beam(this.architecture, [x, 5.65, -1.45], [x + (x < 0 ? 1.25 : -1.25), 3.95, -1.45], 0.14, m.woodDark);
    }
  }

  buildRoof() {
    const m = this.materials;
    const y0 = 9.38;
    const halfX = 3.55;
    const halfZ = 2.25;
    const ridge = 0.82;
    const makeFace = (side) => {
      const positions = [];
      const indices = [];
      const n = 24;
      const rows = 7;
      for (let j = 0; j <= rows; j++) {
        const v = j / rows;
        for (let i = 0; i <= n; i++) {
          const u = i / n * 2 - 1;
          let x;
          let z;
          if (side === 'front' || side === 'back') {
            x = u * THREE.MathUtils.lerp(halfX, ridge, v);
            z = (side === 'front' ? 1 : -1) * halfZ * (1 - v);
          } else {
            x = (side === 'right' ? 1 : -1) * THREE.MathUtils.lerp(halfX, ridge, v);
            z = u * halfZ * (1 - v);
          }
          const y = y0 + v * 1.0 + 0.24 * Math.pow(Math.abs(u), 5) * Math.pow(1 - v, 2);
          positions.push(x - 0.25, y, z - 0.15);
          if (j < rows && i < n) {
            const a = j * (n + 1) + i;
            indices.push(a, a + 1, a + n + 1, a + 1, a + n + 2, a + n + 1);
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      mesh(this.architecture, geometry, m.roof);
    };
    ['front', 'back', 'left', 'right'].forEach(makeFace);
    for (let i = -10; i <= 10; i++) {
      const u = i / 10;
      for (const sign of [-1, 1]) {
        const points = [];
        for (let j = 0; j <= 7; j++) {
          const v = j / 7;
          points.push([
            u * THREE.MathUtils.lerp(halfX, ridge, v) - 0.25,
            y0 + v + 0.24 * Math.pow(Math.abs(u), 5) * Math.pow(1 - v, 2) + 0.025,
            sign * halfZ * (1 - v) - 0.15,
          ]);
        }
        tube(this.architecture, points, 0.018, m.roofEdge);
      }
    }
    for (const sign of [-1, 1]) {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const u = i / 10 - 1;
        points.push([u * halfX - 0.25, y0 + 0.24 * Math.pow(Math.abs(u), 5), sign * halfZ - 0.15]);
      }
      tube(this.architecture, points, 0.07, m.roofEdge);
    }
    beam(this.architecture, [-1.18, 10.42, -0.15], [0.68, 10.42, -0.15], 0.12, m.roofEdge);
    for (const x of [-3.8, 3.3]) {
      for (const z of [-2.4, 2.1]) {
        mesh(this.architecture, new THREE.SphereGeometry(0.095, 10, 8), m.gold, [x, 9.66, z]);
      }
    }
  }

  buildWaterSystem() {
    const m = this.materials;
    this.wheel = new THREE.Group();
    this.scene.add(this.wheel);
    for (const z of [-0.24, 0.24]) {
      torus(this.wheel, 1.4, 0.095, [0, 0, z], m.woodLight, [0, 0, 0], 64);
      torus(this.wheel, 1.49, 0.025, [0, 0, z], m.bronze, [0, 0, 0], 64);
      cylinder(this.wheel, 0.24, 0.12, [0, 0, z], m.bronze, 'z', 24);
    }
    cylinder(this.wheel, 0.11, 1.25, [0, 0, -0.2], m.bronzeDark, 'z', 20);
    this.cupWaters = [];
    for (let i = 0; i < this.mechanics.cupCount; i++) {
      const a = i * TAU / this.mechanics.cupCount;
      beam(this.wheel, [0, 0, -0.23], [Math.cos(a) * 1.35, Math.sin(a) * 1.35, -0.23], 0.075, m.woodLight, 0.075);
      beam(this.wheel, [0, 0, 0.23], [Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0.23], 0.06, m.wood, 0.06);
      const cup = new THREE.Group();
      cup.position.set(Math.cos(a) * 1.29, Math.sin(a) * 1.29, 0);
      cup.rotation.z = a;
      this.wheel.add(cup);
      box(cup, [0.32, 0.065, 0.64], [0, -0.15, 0], m.woodLight);
      box(cup, [0.32, 0.28, 0.055], [0, 0, -0.295], m.wood);
      box(cup, [0.32, 0.28, 0.055], [0, 0, 0.295], m.wood);
      box(cup, [0.055, 0.29, 0.64], [-0.16, 0, 0], m.woodLight);
      box(cup, [0.055, 0.29, 0.64], [0.16, 0, 0], m.woodLight);
      for (const z of [-0.325, 0.325]) box(cup, [0.38, 0.035, 0.025], [0, 0.03, z], m.bronze);
      compact(cup);
      const water = box(cup, [0.255, 0.18, 0.52], [0, -0.06, 0], m.water);
      water.castShadow = false;
      this.cupWaters.push(water);
      const pin = box(this.wheel, [0.24, 0.17, 0.19], [Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0.43], m.bronze, [0, 0, a]);
      pin.castShadow = true;
    }
    compact(this.wheel);
    for (let i = 0; i < this.cupWaters.length; i++) {
      const a = i * TAU / this.mechanics.cupCount;
      const water = this.cupWaters[i];
      water.userData.anchor = new V3(Math.cos(a) * 1.29, Math.sin(a) * 1.29, 0);
      water.userData.orientation = new THREE.Quaternion().setFromAxisAngle(new V3(0, 0, 1), a);
      water.userData.offset = new V3();
    }
    this.pawl = new THREE.Group();
    this.scene.add(this.pawl);
    box(this.pawl, [0.68, 0.11, 0.21], [-0.34, 0, 0], m.bronze);
    box(this.pawl, [0.24, 0.21, 0.26], [-0.62, 0, 0], m.gold);
    cylinder(this.pawl, 0.12, 0.34, [0, 0, 0], m.bronzeDark, 'z', 20);
    beam(this.pawl, [0, 0, 0], [0.24, 0.3, 0], 0.07, m.bronze);
    box(this.pawl, [0.28, 0.25, 0.3], [0.25, 0.32, 0], m.redLight);
    compact(this.pawl);
    box(this.architecture, [0.75, 0.09, 0.26], [0.25, 3.105, 1.78], m.bronzeDark);
    beam(this.architecture, [0.61, 3.0, 1.51], [0.61, 3.0, 0.7], 0.1, m.bronzeDark);
    box(this.architecture, [1.45, 0.13, 1.25], [-2.58, 5.12, 1.02], m.woodDark);
    for (const x of [-3.24, -1.92]) box(this.architecture, [0.11, 0.87, 1.18], [x, 5.54, 1.02], m.woodLight);
    for (const z of [0.48, 1.56]) box(this.architecture, [1.4, 0.87, 0.1], [-2.58, 5.54, z], m.wood);
    for (const y of [5.25, 5.78]) {
      for (const z of [0.42, 1.62]) box(this.architecture, [1.52, 0.06, 0.06], [-2.58, y, z], m.bronzeDark);
      for (const x of [-3.3, -1.86]) box(this.architecture, [0.06, 0.06, 1.25], [x, y, 1.02], m.bronzeDark);
    }
    const surface = box(this.architecture, [1.26, 0.025, 1.0], [-2.58, 5.86, 1.02], m.water);
    surface.castShadow = false;
    tube(this.architecture, [[-1.95, 5.69, 1.35], [-1.55, 5.65, 1.35], [-1.24, 5.4, 1.35], [-1.01, 5.15, 1.35]], 0.105, m.bronzeDark);
    tube(this.architecture, [[-1.94, 5.69, 1.35], [-1.54, 5.64, 1.35], [-1.23, 5.39, 1.35], [-1.01, 5.14, 1.35]], 0.057, m.water);
    tube(this.architecture, [[-3.3, 5.8, 0.76], [-3.55, 5.75, 0.76], [-3.62, 4.4, 0.76]], 0.075, m.bronzeDark);
    for (const x of [-3.05, -2.12]) beam(this.architecture, [x, 5.1, 0.63], [x, 4.3, 0.63], 0.12, m.woodDark);
    box(this.architecture, [3.65, 0.34, 1.55], [-1.5, 0.94, 1.35], m.stoneDark);
    box(this.architecture, [3.3, 0.06, 1.22], [-1.5, 1.14, 1.35], m.water);
    for (const x of [-3.26, 0.26]) box(this.architecture, [0.15, 0.52, 1.55], [x, 1.18, 1.35], m.stone);
    for (const z of [0.64, 2.06]) box(this.architecture, [3.6, 0.52, 0.14], [-1.5, 1.18, z], m.stone);
    tube(this.architecture, [[0.15, 1.06, 1.4], [0.65, 0.97, 1.4], [1.04, 0.83, 1.4]], 0.11, m.bronzeDark);
  }

  makeGear(radius, teeth, material = this.materials.bronze) {
    const group = new THREE.Group();
    cylinder(group, radius * 0.72, 0.13, [0, 0, 0], this.materials.bronzeDark, 'z', 32);
    torus(group, radius * 0.77, radius * 0.09, [0, 0, 0.08], material, [0, 0, 0], 48);
    cylinder(group, radius * 0.19, 0.28, [0, 0, 0.04], material, 'z', 20);
    for (let i = 0; i < 6; i++) {
      const a = i * TAU / 6;
      beam(group, [Math.cos(a) * radius * 0.15, Math.sin(a) * radius * 0.15, 0.08], [Math.cos(a) * radius * 0.73, Math.sin(a) * radius * 0.73, 0.08], radius * 0.085, material, 0.09);
    }
    const toothGeometry = new THREE.BoxGeometry(radius * 0.19, TAU * radius / teeth * 0.58, 0.21);
    const instanced = new THREE.InstancedMesh(toothGeometry, material, teeth);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < teeth; i++) {
      const a = i * TAU / teeth;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0.04);
      dummy.rotation.z = a;
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.castShadow = true;
    group.add(instanced);
    compact(group);
    return group;
  }

  buildGears() {
    const m = this.materials;
    this.liftShaft = new THREE.Group();
    this.scene.add(this.liftShaft);
    cylinder(this.liftShaft, 0.075, 3.9, [0, 0, 0], m.bronzeDark, 'y', 16);
    for (const y of [-1.9, 1.9]) {
      cylinder(this.liftShaft, 0.44, 0.14, [0, y, 0], m.bronze, 'y', 24, 0.18);
      torus(this.liftShaft, 0.37, 0.035, [0, y, 0], m.gold, [Math.PI / 2, 0, 0], 32);
    }
    compact(this.liftShaft);
    this.gearDeck = this.makeGear(0.82, 32);
    this.scene.add(this.gearDeck);
    this.transferGear = this.makeGear(0.6, 24, m.gold);
    this.scene.add(this.transferGear);
    for (const [x, y, z] of [[-1.5, 3, 0.3], [-1.5, 6.8, 0.3], [0.15, 6.8, 0.3], [0.15, 8.05, 1]]) {
      cylinder(this.architecture, 0.14, 0.5, [x, y, z - 0.34], m.woodDark, 'z', 16);
      torus(this.architecture, 0.14, 0.025, [x, y, z - 0.05], m.bronzeDark, [0, 0, 0], 20);
    }
    beam(this.architecture, [-2.25, 6.25, -0.1], [-1.5, 6.8, -0.1], 0.13, m.woodDark);
    beam(this.architecture, [0.85, 6.25, -0.1], [0.15, 6.8, -0.1], 0.13, m.woodDark);
    this.cam = new THREE.Group();
    this.scene.add(this.cam);
    cylinder(this.cam, 0.4, 0.13, [0, 0, 0], m.redLight, 'z', 32);
    torus(this.cam, 0.32, 0.035, [0, 0, 0.09], m.gold, [0, 0, 0], 32);
    cylinder(this.cam, 0.1, 0.3, [0, 0, 0], m.bronze, 'z', 16);
    cylinder(this.cam, 0.12, 0.25, [-0.43, 0, 0.02], m.gold, 'z', 16);
    compact(this.cam);
  }

  buildPuppet() {
    const m = this.materials;
    const x = 0.98;
    const z = 1.0;
    cylinder(this.architecture, 0.34, 0.12, [x, 7.4, z], m.stoneDark, 'y', 24);
    mesh(this.architecture, new THREE.ConeGeometry(0.3, 0.78, 12), m.redLight, [x, 7.85, z]);
    box(this.architecture, [0.36, 0.43, 0.24], [x, 8.18, z], m.red);
    mesh(this.architecture, new THREE.SphereGeometry(0.18, 16, 12), m.skin, [x, 8.53, z]);
    cylinder(this.architecture, 0.19, 0.11, [x, 8.69, z], m.dark, 'y', 16, 0.13);
    box(this.architecture, [0.23, 0.055, 0.23], [x, 8.63, z], m.dark);
    for (const dx of [-0.06, 0.06]) mesh(this.architecture, new THREE.SphereGeometry(0.013, 6, 6), m.dark, [x + dx, 8.56, z + 0.17]);
    this.hammer = new THREE.Group();
    this.scene.add(this.hammer);
    beam(this.hammer, [0, 0, 0], [-0.42, -0.1, 0], 0.065, m.woodLight);
    beam(this.hammer, [0, 0, 0], [0.5, 0, 0], 0.075, m.woodLight);
    cylinder(this.hammer, 0.14, 0.27, [0.5, 0, 0], m.bronze, 'z', 16);
    cylinder(this.hammer, 0.09, 0.32, [0, 0, 0], m.bronzeDark, 'z', 16);
    compact(this.hammer);
    const bellGroup = new THREE.Group();
    bellGroup.position.set(1.65, 8.02, 1.0);
    this.architecture.add(bellGroup);
    const profile = [
      new THREE.Vector2(0.06, 0.52), new THREE.Vector2(0.16, 0.44), new THREE.Vector2(0.22, 0.28),
      new THREE.Vector2(0.28, 0.05), new THREE.Vector2(0.35, -0.15), new THREE.Vector2(0.36, -0.2),
      new THREE.Vector2(0.29, -0.22), new THREE.Vector2(0.23, -0.12),
    ];
    mesh(bellGroup, new THREE.LatheGeometry(profile, 32), m.bronze);
    torus(bellGroup, 0.35, 0.025, [0, -0.18, 0], m.gold, [Math.PI / 2, 0, 0], 32);
    torus(bellGroup, 0.09, 0.025, [0, 0.55, 0], m.bronzeDark, [0, 0, 0], 20);
    beam(this.architecture, [1.65, 9.36, 1], [1.65, 8.98, 1], 0.035, m.bronzeDark);
    cylinder(this.architecture, 0.24, 0.08, [-0.55, 7.42, 0.85], m.stoneDark, 'y', 20);
    mesh(this.architecture, new THREE.ConeGeometry(0.25, 0.65, 12), m.jade, [-0.55, 7.78, 0.85]);
    mesh(this.architecture, new THREE.SphereGeometry(0.16, 14, 10), m.skin, [-0.55, 8.2, 0.85]);
    cylinder(this.architecture, 0.18, 0.12, [-0.55, 8.35, 0.85], m.dark, 'y', 16, 0.1);
    const timePlaque = new THREE.MeshStandardMaterial({ map: plaqueTexture('時 正', 'KE · TIME'), roughness: 0.7 });
    mesh(this.architecture, new THREE.PlaneGeometry(0.65, 0.32), timePlaque, [-0.55, 7.85, 1.13]);
    beam(this.architecture, [-0.82, 8.0, 0.9], [-0.72, 7.86, 1.12], 0.06, m.skin);
    beam(this.architecture, [-0.28, 8.0, 0.9], [-0.38, 7.86, 1.12], 0.06, m.skin);
  }

  buildArmillary() {
    const m = this.materials;
    this.timeShaft = new THREE.Group();
    this.scene.add(this.timeShaft);
    cylinder(this.timeShaft, 0.07, 3.75, [0, -1.87, 0], m.bronzeDark, 'y', 16);
    cylinder(this.timeShaft, 0.38, 0.18, [0, -0.63, 0], m.bronzeDark, 'y', 24);
    cylinder(this.timeShaft, 0.17, 0.75, [0, -0.33, 0], m.bronze, 'y', 20);
    const starMap = canvasTexture(1024, 512, (ctx, w, h) => {
      ctx.fillStyle = '#123a40';
      ctx.fillRect(0, 0, w, h);
      let seed = 1092;
      const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
      for (let i = 0; i < 210; i++) {
        const x = random() * w;
        const y = random() * h;
        const r = 0.5 + random() * 1.7;
        ctx.fillStyle = random() > 0.85 ? '#f4d797' : '#98b8a8';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
      ctx.strokeStyle = '#8ba98933';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += w / 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = h / 6; y < h; y += h / 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    });
    const globeMaterial = new THREE.MeshStandardMaterial({ map: starMap, color: '#b7d2c3', metalness: 0.25, roughness: 0.52 });
    mesh(this.timeShaft, new THREE.SphereGeometry(0.56, 40, 28), globeMaterial);
    torus(this.timeShaft, 0.63, 0.025, [0, 0, 0], m.gold, [Math.PI / 2, 0, 0], 64);
    const ecliptic = new THREE.Group();
    ecliptic.rotation.z = -0.409;
    this.timeShaft.add(ecliptic);
    torus(ecliptic, 1.12, 0.045, [0, 0, 0], m.gold, [Math.PI / 2, 0, 0], 80);
    torus(ecliptic, 1.19, 0.018, [0, 0, 0], m.bronze, [Math.PI / 2, 0, 0], 80);
    mesh(ecliptic, new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshStandardMaterial({ color: '#ffdb86', emissive: '#b57020', emissiveIntensity: 0.8 }), [1.12, 0, 0]);
    for (let i = 0; i < 24; i++) {
      const a = i * TAU / 24;
      box(ecliptic, [0.025, 0.1, 0.025], [Math.cos(a) * 1.12, 0, Math.sin(a) * 1.12], m.bronzeDark, [0, -a, 0]);
    }
    compact(this.timeShaft);
    const fixed = new THREE.Group();
    fixed.position.set(0.15, 10.65, 0.3);
    this.architecture.add(fixed);
    torus(fixed, 1.35, 0.038, [0, 0, 0], m.bronze, [0, 0.22, -0.22], 96);
    torus(fixed, 1.28, 0.024, [0, 0, 0], m.gold, [0, Math.PI / 2, 0.22], 96);
    torus(fixed, 1.34, 0.026, [0, 0, 0], m.bronzeDark, [Math.PI / 2, 0, 0], 96);
    for (let i = 0; i < 60; i++) {
      const a = i * TAU / 60;
      const length = i % 5 === 0 ? 0.11 : 0.055;
      box(fixed, [0.018, length, 0.025], [Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0.02], m.gold, [0, 0, a - Math.PI / 2]);
    }
    cylinder(this.architecture, 0.58, 0.18, [0.15, 10.03, 0.3], m.bronzeDark, 'y', 32);
    cylinder(this.architecture, 0.42, 0.18, [0.15, 10.16, 0.3], m.bronze, 'y', 32, 0.32);
  }

  buildDroplets() {
    this.dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 6, 5), this.materials.waterBright, this.mechanics.droplets.length);
    this.dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dropMesh.frustumCulled = false;
    this.scene.add(this.dropMesh);
    this.dropDummy = new THREE.Object3D();
  }

  buildDust() {
    const count = 170;
    const positions = new Float32Array(count * 3);
    let seed = 71;
    const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 30;
      positions[i * 3 + 1] = random() * 16;
      positions[i * 3 + 2] = (random() - 0.5) * 22;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: '#b8c7a7', size: 0.017, transparent: true, opacity: 0.33, depthWrite: false });
    this.scene.add(new THREE.Points(geometry, material));
  }

  sync() {
    for (const [body, object] of this.bindings) {
      object.position.copy(body.position);
      object.quaternion.copy(body.quaternion);
    }
    for (let i = 0; i < this.cupWaters.length; i++) {
      const fraction = this.mechanics.cupFill[i] / this.mechanics.capacity;
      const water = this.cupWaters[i];
      water.visible = fraction > 0.015;
      water.scale.y = Math.max(0.02, fraction);
      water.quaternion.copy(water.userData.orientation);
      water.userData.offset.set(0, -0.105 + fraction * 0.09, 0).applyQuaternion(water.userData.orientation);
      water.position.copy(water.userData.anchor).add(water.userData.offset);
    }
    for (let i = 0; i < this.mechanics.droplets.length; i++) {
      const drop = this.mechanics.droplets[i];
      this.dropDummy.position.copy(drop.body.position);
      this.dropDummy.scale.setScalar(drop.active ? (drop.outlet ? 0.85 : 1) : 0);
      this.dropDummy.updateMatrix();
      this.dropMesh.setMatrixAt(i, this.dropDummy.matrix);
    }
    this.dropMesh.instanceMatrix.needsUpdate = true;
    this.bellLight.intensity = this.mechanics.events.strikePulse * 7;
    this.pawlLight.intensity = this.mechanics.events.tickPulse * 3.5;
  }

  render() {
    this.sync();
    this.renderer.render(this.scene, this.camera);
  }
}

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const palette = {
  ink: 0x07191b,
  wood: 0x6f3526,
  woodLight: 0xa05b38,
  woodDark: 0x351d19,
  brass: 0xc89a52,
  brassLight: 0xf0cf83,
  bronze: 0x806035,
  jade: 0x174d4b,
  jadeLight: 0x2d7068,
  water: 0x55d9d2,
  lapis: 0x123c50,
  ivory: 0xf2e5c5,
};

function mesh(geometry, material, parent, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function box(parent, material, size, position, rotation = [0, 0, 0], rounded = false) {
  const geometry = rounded
    ? new RoundedBoxGeometry(...size, 2, Math.min(...size) * 0.12)
    : new THREE.BoxGeometry(...size);
  return mesh(geometry, material, parent, position, rotation);
}

function cylinder(parent, material, radius, length, position, rotation = [0, 0, 0], segments = 24, radiusTop = radius) {
  return mesh(new THREE.CylinderGeometry(radiusTop, radius, length, segments), material, parent, position, rotation);
}

function torus(parent, material, radius, tube, position = [0, 0, 0], rotation = [0, 0, 0], arc = TAU) {
  return mesh(new THREE.TorusGeometry(radius, tube, 8, 80, arc), material, parent, position, rotation);
}

function rodBetween(parent, material, a, b, radius = 0.04, segments = 8) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = end.clone().sub(start);
  const object = cylinder(parent, material, radius, direction.length(), start.clone().add(end).multiplyScalar(0.5).toArray(), [0, 0, 0], segments);
  object.quaternion.setFromUnitVectors(Y_AXIS, direction.normalize());
  return object;
}

function gearGeometry(radius, teeth, depth) {
  const shape = new THREE.Shape();
  const root = radius * 0.88;
  for (let i = 0; i < teeth * 4; i++) {
    const angle = i / (teeth * 4) * TAU;
    const r = (i % 4 === 0 || i % 4 === 3) ? root : radius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, radius * 0.15, 0, TAU, true);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function createGear(parent, materials, radius, teeth, depth, z = 0) {
  const group = new THREE.Group();
  group.position.z = z;
  parent.add(group);
  mesh(gearGeometry(radius, teeth, depth), materials.brass, group);
  cylinder(group, materials.bronze, radius * 0.67, depth + 0.025, [0, 0, 0], [Math.PI / 2, 0, 0], 48);
  torus(group, materials.brassLight, radius * 0.69, 0.018, [0, 0, depth * 0.55]);
  cylinder(group, materials.brassLight, radius * 0.18, depth + 0.13, [0, 0, 0], [Math.PI / 2, 0, 0], 20);
  for (let i = 0; i < 6; i++) {
    const a = i * TAU / 6;
    cylinder(group, materials.brassLight, 0.026, 0.035,
      [Math.cos(a) * radius * 0.48, Math.sin(a) * radius * 0.48, depth * 0.65],
      [Math.PI / 2, 0, 0], 8);
  }
  return group;
}

export class ClockScene {
  constructor(container, physics) {
    this.physics = physics;
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(palette.ink);
    this.scene.fog = new THREE.FogExp2(palette.ink, 0.018);
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    const gl = this.renderer.getContext();
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : '';
    this.softwareRenderer = /swiftshader|llvmpipe|software/i.test(rendererName);
    this.renderer.setPixelRatio(this.softwareRenderer ? 0.72 : Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = !this.softwareRenderer;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    container.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(room, 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    room.dispose();
    pmrem.dispose();

    this.materials = this._materials();
    this.bindings = [];
    this.dynamicRoots = [];
    this.bucketFills = [];
    this.bellFlash = 0;
    this.elapsed = 0;
    this._lights();
    this._plinth();
    this._tower();
    this._wheel();
    this._escapement();
    this._gears();
    this._waterSystem();
    this._globe();
    this._reporting();
    this._drops();
    this._atmosphere();
    this._optimizeGeometry();
    this.resize();
  }

  _materials() {
    const standard = (color, roughness = 0.6, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
    return {
      wood: standard(palette.wood, 0.68),
      woodLight: standard(palette.woodLight, 0.58),
      woodDark: standard(palette.woodDark, 0.78),
      brass: standard(palette.brass, 0.29, 0.78),
      brassLight: standard(palette.brassLight, 0.25, 0.72),
      bronze: standard(palette.bronze, 0.42, 0.7),
      jade: standard(palette.jade, 0.36, 0.35),
      jadeLight: standard(palette.jadeLight, 0.4, 0.25),
      stone: standard(0x183133, 0.88, 0.1),
      stoneEdge: standard(0x28494a, 0.72, 0.15),
      lapis: standard(palette.lapis, 0.3, 0.5),
      ivory: standard(palette.ivory, 0.62),
      water: new THREE.MeshStandardMaterial({
        color: palette.water,
        emissive: 0x1b7b79,
        emissiveIntensity: 0.38,
        transparent: true,
        opacity: 0.78,
        roughness: 0.12,
        metalness: 0.12,
        depthWrite: false,
      }),
      star: new THREE.MeshBasicMaterial({ color: 0xffd88a, toneMapped: false }),
    };
  }

  _lights() {
    this.scene.add(new THREE.HemisphereLight(0xa9d7cf, 0x17211f, 1.65));
    const key = new THREE.DirectionalLight(0xffd6a0, 3.2);
    key.position.set(-6, 13, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -9;
    key.shadow.camera.right = 9;
    key.shadow.camera.top = 14;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 35;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.025;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x59b9b2, 2.2);
    rim.position.set(7, 9, -7);
    this.scene.add(rim);
    const front = new THREE.PointLight(0xffbd71, 32, 18, 2);
    front.position.set(0, 5.5, 6);
    this.scene.add(front);
    const waterGlow = new THREE.PointLight(0x3fd6cd, 13, 7, 2);
    waterGlow.position.set(-2.8, 4.5, 1.8);
    this.scene.add(waterGlow);
  }

  _plinth() {
    const m = this.materials;
    cylinder(this.scene, m.stone, 6.25, 0.42, [0, 0.05, 0], [0, 0, 0], 96);
    cylinder(this.scene, m.stoneEdge, 6.05, 0.10, [0, 0.30, 0], [0, 0, 0], 96);
    torus(this.scene, m.brass, 5.72, 0.018, [0, 0.365, 0], [Math.PI / 2, 0, 0]);
    torus(this.scene, m.bronze, 4.85, 0.012, [0, 0.368, 0], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 60; i++) {
      const a = i * TAU / 60;
      const length = i % 5 === 0 ? 0.32 : 0.15;
      box(this.scene, m.brass, [0.025, 0.015, length],
        [Math.sin(a) * 5.7, 0.37, Math.cos(a) * 5.7], [0, a, 0]);
    }
    const ground = mesh(new THREE.CircleGeometry(38, 96), new THREE.MeshStandardMaterial({ color: 0x071517, roughness: 1 }), this.scene, [0, -0.18, 0], [-Math.PI / 2, 0, 0]);
    ground.castShadow = false;
    // A catch basin makes clear that the water has somewhere to go.
    box(this.scene, m.woodDark, [8.5, 0.26, 3.6], [-1.1, 0.48, 0], [0, 0, 0], true);
    box(this.scene, m.water, [8.1, 0.035, 3.25], [-1.1, 0.625, 0]);
    for (const x of [-5.35, 3.15]) box(this.scene, m.woodLight, [0.16, 0.42, 3.65], [x, 0.65, 0]);
    for (const z of [-1.75, 1.75]) box(this.scene, m.woodLight, [8.65, 0.42, 0.15], [-1.1, 0.65, z]);
  }

  _tower() {
    const m = this.materials;
    const post = (x, z, bottom, top, width = 0.26) => {
      box(this.scene, m.wood, [width, top - bottom, width], [x, (top + bottom) / 2, z], [0, 0, 0], true);
      box(this.scene, m.brass, [width + 0.07, 0.14, width + 0.07], [x, bottom + 0.25, z]);
      box(this.scene, m.brass, [width + 0.06, 0.12, width + 0.06], [x, top - 0.18, z]);
    };
    for (const x of [-4.35, 4.35]) {
      for (const z of [-1.45, 1.45]) post(x, z, 0.72, 8.35, 0.30);
    }
    for (const y of [0.92, 4.02, 7.72, 8.25]) {
      for (const z of [-1.45, 1.45]) {
        if (y === 4.02 && z === 1.45) continue; // open the cutaway in front of the wheel
        box(this.scene, m.woodLight, [9.15, 0.24, 0.26], [0, y, z], [0, 0, 0], true);
      }
      for (const x of [-4.35, 4.35]) box(this.scene, m.wood, [0.26, 0.24, 3.2], [x, y, 0]);
    }
    // Dougong-inspired stacked brackets, left open so no mechanism is hidden.
    for (const x of [-4.35, 4.35]) {
      for (const z of [-1.45, 1.45]) {
        for (let i = 0; i < 3; i++) {
          box(this.scene, m.woodLight, [0.65 + i * 0.35, 0.12, 0.22], [x, 7.93 + i * 0.14, z]);
          box(this.scene, m.wood, [0.22, 0.12, 0.65 + i * 0.28], [x, 8.0 + i * 0.14, z]);
        }
      }
    }
    // Side balconies and railings suggest the original multi-storey tower.
    for (const side of [-1, 1]) {
      const x = side * 3.65;
      box(this.scene, m.woodDark, [1.45, 0.15, 3.05], [x, 4.12, 0]);
      for (let i = 0; i < 6; i++) box(this.scene, m.woodLight, [0.18, 0.055, 2.9], [x - 0.56 + i * 0.225, 4.22, 0]);
      for (const z of [-1.3, 1.3]) {
        for (const dx of [-0.55, 0, 0.55]) post(x + dx, z, 4.18, 5.02, 0.07);
        box(this.scene, m.woodLight, [1.35, 0.09, 0.09], [x, 4.96, z]);
      }
    }
    // Upper observatory, deliberately cut away at the front.
    for (const x of [-1.25, 3.25]) {
      for (const z of [-1.25, 1.25]) post(x, z, 7.78, 11.35, 0.20);
    }
    box(this.scene, m.woodDark, [5.3, 0.18, 3.35], [1, 7.84, 0]);
    for (let i = 0; i < 13; i++) box(this.scene, m.woodLight, [0.28, 0.06, 3.2], [-1.35 + i * 0.39, 7.96, 0]);
    for (const z of [-1.35, 1.35]) {
      box(this.scene, m.woodLight, [5.15, 0.20, 0.22], [1, 11.30, z], [0, 0, 0], true);
    }
    for (const x of [-1.45, 3.45]) box(this.scene, m.woodLight, [0.22, 0.20, 3.0], [x, 11.30, 0]);
    this._roof();
    // Discreet bronze name plate on the front beam.
    box(this.scene, m.bronze, [2.25, 0.54, 0.06], [0.7, 7.69, 1.61], [0, 0, 0], true);
    for (let i = 0; i < 5; i++) box(this.scene, m.brassLight, [0.045, 0.28, 0.025], [0.12 + i * 0.29, 7.69, 1.655]);
  }

  _roof() {
    const m = this.materials;
    const apex = new THREE.Vector3(1, 12.55, 0);
    const corners = [
      new THREE.Vector3(-2.0, 11.32, -1.95),
      new THREE.Vector3(4.0, 11.32, -1.95),
      new THREE.Vector3(4.0, 11.32, 1.95),
      new THREE.Vector3(-2.0, 11.32, 1.95),
    ];
    for (let side = 0; side < 4; side++) {
      const a = corners[side];
      const b = corners[(side + 1) % 4];
      const vertices = [];
      const indices = [];
      const rows = 7;
      const cols = 16;
      for (let r = 0; r <= rows; r++) {
        const t = r / rows;
        for (let c = 0; c <= cols; c++) {
          const u = c / cols;
          const edge = a.clone().lerp(b, u);
          const p = apex.clone().lerp(edge, t);
          p.y += Math.pow(t, 5) * 0.24 + Math.pow(Math.abs(u - 0.5) * 2, 7) * t * 0.16;
          vertices.push(p.x, p.y, p.z);
        }
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * (cols + 1) + c;
          indices.push(i, i + 1, i + cols + 1, i + 1, i + cols + 2, i + cols + 1);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const roof = mesh(geometry, m.jade, this.scene);
      roof.material.side = THREE.DoubleSide;
      rodBetween(this.scene, m.brass, apex.toArray(), a.clone().add(new THREE.Vector3(0, 0.25, 0)).toArray(), 0.045, 8);
      rodBetween(this.scene, m.woodLight, a.clone().add(new THREE.Vector3(0, 0.17, 0)).toArray(), b.clone().add(new THREE.Vector3(0, 0.17, 0)).toArray(), 0.075, 8);
      for (let c = 1; c < 12; c++) {
        const edge = a.clone().lerp(b, c / 12);
        const mid = apex.clone().lerp(edge, 0.58);
        mid.y += 0.06;
        const end = edge.clone();
        end.y += 0.26;
        rodBetween(this.scene, m.jadeLight, apex.clone().lerp(edge, 0.10).toArray(), mid.toArray(), 0.025, 6);
        rodBetween(this.scene, m.jadeLight, mid.toArray(), end.toArray(), 0.025, 6);
      }
    }
    cylinder(this.scene, m.brass, 0.11, 0.65, [1, 12.75, 0], [0, 0, 0], 12, 0.05);
    mesh(new THREE.OctahedronGeometry(0.18), m.brassLight, this.scene, [1, 13.12, 0]);
  }

  _bind(body, group) {
    this.bindings.push({ body, group });
    this.dynamicRoots.push(group);
    this.scene.add(group);
    return group;
  }

  _wheel() {
    const m = this.materials;
    const group = this._bind(this.physics.wheel, new THREE.Group());
    for (const z of [-0.38, 0.38]) {
      torus(group, m.woodLight, 1.83, 0.105, [0, 0, z]);
      torus(group, m.brass, 1.83, 0.025, [0, 0, z + 0.08]);
    }
    for (let i = 0; i < 12; i++) {
      const a = i * TAU / 12;
      for (const z of [-0.27, 0.27]) {
        box(group, m.wood, [1.72, 0.105, 0.12], [Math.cos(a) * 0.88, Math.sin(a) * 0.88, z], [0, 0, a]);
      }
      const bucket = new THREE.Group();
      bucket.rotation.z = a;
      group.add(bucket);
      box(bucket, m.wood, [0.13, 0.84, 0.84], [1.59, 0, 0]);
      box(bucket, m.woodLight, [0.17, 0.86, 0.86], [2.05, 0, 0]);
      for (const side of [-1, 1]) box(bucket, m.wood, [0.52, 0.10, 0.84], [1.82, side * 0.43, 0]);
      box(bucket, m.brass, [0.035, 0.88, 0.89], [2.145, 0, 0]);
      box(bucket, m.brassLight, [0.34, 0.25, 0.25], [2.10, 0, 0.62], [0, 0, 0.12], true);
      const fillGeometry = new THREE.BoxGeometry(1, 0.70, 0.70);
      fillGeometry.translate(0.5, 0, 0);
      const fill = mesh(fillGeometry, m.water, bucket, [1.65, 0, 0]);
      fill.castShadow = false;
      this.bucketFills.push(fill);
    }
    cylinder(group, m.bronze, 0.19, 2.55, [0, 0, 0.25], [Math.PI / 2, 0, 0], 24);
    cylinder(group, m.brassLight, 0.31, 0.24, [0, 0, 0.70], [Math.PI / 2, 0, 0], 24);
    createGear(group, m, 0.50, 12, 0.14, 0.94);
  }

  _escapement() {
    const m = this.materials;
    const group = this._bind(this.physics.anchor, new THREE.Group());
    box(group, m.woodLight, [3.35, 0.18, 0.22], [0, 0, 0], [0, 0, 0], true);
    for (const x of [-1.16, 1.16]) {
      box(group, m.wood, [0.15, 1.30, 0.22], [x, -0.58, 0], [0, 0, 0], true);
      box(group, m.brassLight, [0.36, 0.56, 0.34], [x, -1.19, 0], [0, 0, x < 0 ? -0.28 : 0.28], true);
    }
    for (const x of [-1.65, 1.65]) {
      cylinder(group, m.bronze, 0.24, 0.30, [x, 0, 0], [Math.PI / 2, 0, 0], 16);
      torus(group, m.brassLight, 0.24, 0.025, [x, 0, 0.16]);
    }
    cylinder(group, m.brass, 0.15, 0.65, [0, 0, 0], [Math.PI / 2, 0, 0], 20);
    // Fixed bearing behind the moving balance.
    const p = this.physics.anchorPivot;
    box(this.scene, m.woodDark, [0.30, 1.0, 0.30], [p.x, p.y + 0.35, p.z - 0.38]);
    cylinder(this.scene, m.brass, 0.23, 0.16, [p.x, p.y, p.z - 0.25], [Math.PI / 2, 0, 0], 24);
  }

  _gears() {
    const m = this.materials;
    const b = this._bind(this.physics.gearB, new THREE.Group());
    createGear(b, m, 1.0, 24, 0.15, 0);
    createGear(b, m, 0.5, 12, 0.14, 0.34);
    const c = this._bind(this.physics.gearC, new THREE.Group());
    createGear(c, m, 1.0, 24, 0.15, 0);
    createGear(c, m, 0.5, 12, 0.14, 0.34);
    const d = this._bind(this.physics.gearD, new THREE.Group());
    createGear(d, m, 1.0, 24, 0.15, 0);
    cylinder(d, m.bronze, 0.11, 1.85, [0, 0, -0.72], [Math.PI / 2, 0, 0], 16);
    cylinder(d, m.brass, 0.62, 0.12, [0, 0, 0.34], [Math.PI / 2, 0, 0], 48);
    for (let i = 0; i < 16; i++) {
      const a = i * TAU / 16;
      cylinder(d, m.brassLight, 0.09, 0.28, [Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.40], [Math.PI / 2, 0, 0], 10);
    }
    cylinder(d, m.brass, 0.34, 0.30, [0, 0, -1.50], [Math.PI / 2, 0, 0], 24, 0.56);

    const shaft = this._bind(this.physics.mainShaft, new THREE.Group());
    box(shaft, m.woodLight, [0.20, 5.7, 0.20], [0, 0, 0], [0, 0, 0], true);
    for (const y of [-2.65, -1.5, 0, 1.45, 2.65]) {
      cylinder(shaft, m.brass, 0.20, 0.16, [0, y, 0], [0, 0, 0], 16);
    }
    for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
      box(shaft, m.brassLight, [0.028, 5.25, 0.028], [Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12]);
    }
    cylinder(shaft, m.brass, 0.55, 0.28, [0, -1.50, 0], [0, 0, 0], 24, 0.34);
    cylinder(shaft, m.brass, 0.36, 0.28, [0, 2.55, 0], [0, 0, 0], 24, 0.52);
    // Static axle bearings make the transmission route legible.
    for (const y of [3.55, 6.85, 8.75]) {
      box(this.scene, m.woodDark, [0.75, 0.18, 0.65], [1, y, 0.12]);
      torus(this.scene, m.brass, 0.23, 0.04, [1, y + 0.10, 0.12], [Math.PI / 2, 0, 0]);
    }
  }

  _waterSystem() {
    const m = this.materials;
    const tank = new THREE.Group();
    tank.position.set(-3.12, 6.95, -0.42);
    this.scene.add(tank);
    box(tank, m.woodDark, [2.35, 0.16, 1.55], [0, -0.48, 0]);
    for (const x of [-1.12, 1.12]) {
      box(tank, m.wood, [0.14, 0.88, 1.55], [x, -0.06, 0]);
      box(tank, m.brass, [0.17, 0.09, 1.62], [x, 0.30, 0]);
    }
    for (const z of [-0.72, 0.72]) {
      box(tank, m.woodLight, [2.35, 0.88, 0.13], [0, -0.06, z]);
      for (const y of [-0.30, 0.25]) box(tank, m.brass, [2.4, 0.065, 0.16], [0, y, z]);
    }
    box(tank, m.water, [2.12, 0.035, 1.31], [0, 0.23, 0]);
    // A sight strip on the cutaway wall keeps the constant head visible even
    // from the low establishing camera.
    box(tank, m.water, [2.10, 0.055, 0.025], [0, 0.23, 0.795]);
    // Constant-head overflow and the downspout are procedural tubes.
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.30, 6.74, -0.02),
      new THREE.Vector3(-2.18, 6.58, -0.02),
      new THREE.Vector3(-2.52, 6.48, -0.02),
      new THREE.Vector3(-2.91, 6.40, -0.02),
    ]);
    mesh(new THREE.TubeGeometry(spoutCurve, 32, 0.10, 12, false), m.brass, this.scene);
    torus(this.scene, m.brassLight, 0.12, 0.025, [-2.91, 6.39, -0.02], [Math.PI / 2, 0, 0]);
    const overflow = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.18, 7.12, -0.45),
      new THREE.Vector3(-4.48, 7.02, -0.45),
      new THREE.Vector3(-4.48, 6.58, -0.45),
    ]);
    mesh(new THREE.TubeGeometry(overflow, 20, 0.075, 10, false), m.bronze, this.scene);
    // Water-level marks, deliberately unanimated: the head remains constant.
    for (let i = 0; i < 5; i++) box(this.scene, m.brassLight, [0.18 + i * 0.025, 0.018, 0.02], [-3.75 + i * 0.17, 7.18, 0.325]);
  }

  _globe() {
    const m = this.materials;
    const center = new THREE.Vector3(1, 9.55, 0.12);
    const axis = new THREE.Vector3(0, 0.9063, -0.4226).normalize();
    const orientation = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, axis);
    const fixed = new THREE.Group();
    fixed.position.copy(center);
    fixed.quaternion.copy(orientation);
    this.scene.add(fixed);
    torus(fixed, m.brass, 1.38, 0.055);
    torus(fixed, m.brassLight, 1.48, 0.025, [0, 0, 0], [0, Math.PI / 2, 0]);
    torus(fixed, m.brass, 1.31, 0.04, [0, 0, 0], [Math.PI / 2, 0, 0.32]);
    for (const y of [-1.52, 1.52]) {
      cylinder(fixed, m.brassLight, 0.10, 0.30, [0, y, 0], [0, 0, 0], 16);
    }
    const horizon = new THREE.Group();
    horizon.position.copy(center);
    this.scene.add(horizon);
    torus(horizon, m.bronze, 1.65, 0.075, [0, -0.20, 0], [Math.PI / 2, 0, 0]);
    torus(horizon, m.brassLight, 1.65, 0.018, [0, -0.12, 0], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 24; i++) {
      const a = i * TAU / 24;
      box(horizon, m.brassLight, [0.025, 0.025, i % 2 ? 0.09 : 0.17], [Math.sin(a) * 1.65, -0.10, Math.cos(a) * 1.65], [0, a, 0]);
    }
    cylinder(this.scene, m.bronze, 0.40, 0.32, [1, 7.99, 0.12], [0, 0, 0], 32, 0.55);
    for (const x of [0.45, 1.55]) rodBetween(this.scene, m.brass, [x, 8.08, 0.12], [1, 8.70, 0.12], 0.055, 10);

    const globe = this._bind(this.physics.globe, new THREE.Group());
    const celestial = new THREE.Group();
    celestial.quaternion.copy(orientation);
    globe.add(celestial);
    mesh(new THREE.SphereGeometry(1.02, 48, 32), m.lapis, celestial);
    // Longitude, latitude, ecliptic and star markers all rotate with the body.
    for (let i = 0; i < 6; i++) {
      torus(celestial, m.brass, 1.035, 0.009, [0, 0, 0], [0, i * Math.PI / 6, 0]);
    }
    for (const latitude of [-0.72, -0.36, 0, 0.36, 0.72]) {
      const r = Math.sqrt(1.045 * 1.045 - latitude * latitude);
      torus(celestial, latitude === 0 ? m.brassLight : m.brass, r, 0.009, [0, latitude, 0], [Math.PI / 2, 0, 0]);
    }
    torus(celestial, m.brassLight, 1.12, 0.025, [0, 0, 0], [Math.PI / 2 + 0.409, 0, 0]);
    const starPositions = [];
    for (let i = 0; i < 42; i++) {
      const y = 1 - (i / 41) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963;
      const p = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(1.045);
      starPositions.push(p);
      mesh(new THREE.SphereGeometry(i % 7 === 0 ? 0.036 : 0.022, 6, 5), m.star, celestial, p.toArray());
    }
    const constellationMaterial = new THREE.LineBasicMaterial({ color: 0xd7b76d, transparent: true, opacity: 0.65 });
    for (const start of [2, 11, 23]) {
      const points = [];
      for (let i = start; i < start + 5; i++) points.push(starPositions[i]);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), constellationMaterial);
      celestial.add(line);
    }
  }

  _reporting() {
    const m = this.materials;
    const striker = this._bind(this.physics.striker, new THREE.Group());
    rodBetween(striker, m.woodLight, [0, 0, 0], [-0.72, -0.68, 0], 0.085, 8);
    rodBetween(striker, m.woodLight, [0, 0, 0], [0.51, 0.22, 0], 0.075, 8);
    box(striker, m.brassLight, [0.32, 0.40, 0.34], [0.56, 0.24, 0], [0, 0, -0.18], true);
    mesh(new THREE.SphereGeometry(0.13, 12, 8), m.ivory, striker, [0, 0, 0.03]);
    cylinder(striker, m.brass, 0.12, 0.50, [0, 0, 0], [Math.PI / 2, 0, 0], 16);

    // The wooden time-announcement figure; only its arm is articulated.
    cylinder(this.scene, m.ivory, 0.28, 0.92, [2.20, 4.66, 2.01], [0, 0, 0], 12, 0.40);
    box(this.scene, m.woodLight, [0.65, 0.12, 0.48], [2.20, 4.18, 2.01], [0, 0, 0], true);
    mesh(new THREE.SphereGeometry(0.24, 20, 14), m.ivory, this.scene, [2.20, 5.28, 2.01]);
    cylinder(this.scene, m.woodDark, 0.26, 0.18, [2.20, 5.47, 2.01], [0, 0, 0], 16, 0.19);
    box(this.scene, m.brass, [0.48, 0.09, 0.06], [2.20, 4.82, 2.29]);

    const bellPosition = this.physics.bell.position;
    const profile = [
      new THREE.Vector2(0.07, 0.48), new THREE.Vector2(0.17, 0.44),
      new THREE.Vector2(0.22, 0.25), new THREE.Vector2(0.27, -0.05),
      new THREE.Vector2(0.36, -0.29), new THREE.Vector2(0.46, -0.38),
      new THREE.Vector2(0.46, -0.44), new THREE.Vector2(0.36, -0.46),
    ];
    this.bellMaterial = m.brass.clone();
    this.bellMaterial.emissive = new THREE.Color(0x8a5b18);
    this.bellMaterial.emissiveIntensity = 0;
    this.bellMesh = mesh(new THREE.LatheGeometry(profile, 40), this.bellMaterial, this.scene, [bellPosition.x, bellPosition.y, bellPosition.z]);
    torus(this.scene, m.brassLight, 0.45, 0.035, [bellPosition.x, bellPosition.y - 0.40, bellPosition.z], [Math.PI / 2, 0, 0]);
    cylinder(this.scene, m.bronze, 0.045, 0.65, [bellPosition.x, bellPosition.y + 0.79, bellPosition.z], [0, 0, 0], 10);
    box(this.scene, m.woodLight, [1.65, 0.16, 0.22], [2.75, 6.71, 2.01], [0, 0, 0], true);
    for (const x of [2.02, 3.50]) box(this.scene, m.wood, [0.15, 1.65, 0.18], [x, 5.88, 2.01]);

    this.soundRings = [];
    for (let i = 0; i < 3; i++) {
      const material = new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
      const ring = torus(this.scene, material, 0.52, 0.012, [bellPosition.x, bellPosition.y, bellPosition.z + 0.06]);
      ring.castShadow = false;
      this.soundRings.push(ring);
    }
  }

  _drops() {
    this.dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 7, 6), this.materials.water, this.physics.drops.length);
    this.dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dropMesh.frustumCulled = false;
    this.dropMesh.castShadow = false;
    this.scene.add(this.dropMesh);
    this.dropMatrix = new THREE.Matrix4();
    this.dropPosition = new THREE.Vector3();
    this.dropScale = new THREE.Vector3();
    this.dropQuaternion = new THREE.Quaternion();
  }

  _atmosphere() {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 16;
      const angle = Math.random() * TAU;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 15 - 1;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x8fb5a8, size: 0.025, transparent: true, opacity: 0.42, depthWrite: false }));
    this.scene.add(points);
  }

  _mergeMeshes(root, candidates, relativeToRoot) {
    root.updateWorldMatrix(true, true);
    const inverse = relativeToRoot ? root.matrixWorld.clone().invert() : null;
    const batches = new Map();
    for (const object of candidates) {
      const key = `${object.material.uuid}:${object.castShadow}`;
      if (!batches.has(key)) batches.set(key, { material: object.material, castShadow: object.castShadow, objects: [], geometries: [] });
      const batch = batches.get(key);
      let geometry = object.geometry.clone();
      if (geometry.index) {
        const expanded = geometry.toNonIndexed();
        geometry.dispose();
        geometry = expanded;
      }
      if (!geometry.getAttribute('uv')) {
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometry.getAttribute('position').count * 2), 2));
      }
      geometry.clearGroups();
      const transform = relativeToRoot
        ? inverse.clone().multiply(object.matrixWorld)
        : object.matrixWorld;
      geometry.applyMatrix4(transform);
      batch.objects.push(object);
      batch.geometries.push(geometry);
    }
    for (const batch of batches.values()) {
      const geometry = mergeGeometries(batch.geometries, false);
      if (!geometry) continue;
      const combined = new THREE.Mesh(geometry, batch.material);
      combined.castShadow = batch.castShadow;
      combined.receiveShadow = true;
      root.add(combined);
      for (const object of batch.objects) object.removeFromParent();
      for (const part of batch.geometries) part.dispose();
    }
  }

  _optimizeGeometry() {
    // Merge only objects that share a rigid body (or are fully static). Their
    // parent bodies still receive every transform from Cannon each frame.
    for (const root of this.dynamicRoots) {
      const candidates = [];
      root.traverse((object) => {
        if (object.isMesh && !this.bucketFills.includes(object)) candidates.push(object);
      });
      this._mergeMeshes(root, candidates, true);
    }
    this.scene.updateMatrixWorld(true);
    const candidates = [];
    const excluded = new Set(this.soundRings);
    this.scene.traverse((object) => {
      if (!object.isMesh || object.isInstancedMesh || excluded.has(object)) return;
      let parent = object;
      while (parent) {
        if (this.dynamicRoots.includes(parent)) return;
        parent = parent.parent;
      }
      candidates.push(object);
    });
    this._mergeMeshes(this.scene, candidates, false);
  }

  notifyBell() {
    this.bellFlash = 1;
  }

  sync() {
    for (const { body, group } of this.bindings) {
      group.position.copy(body.position);
      group.quaternion.copy(body.quaternion);
    }
    for (let i = 0; i < this.bucketFills.length; i++) {
      this.bucketFills[i].scale.x = Math.max(0.006, this.physics.buckets[i].fill / 1.15 * 0.34);
    }
    for (let i = 0; i < this.physics.drops.length; i++) {
      const drop = this.physics.drops[i];
      if (drop.userData.active) {
        this.dropPosition.copy(drop.position);
        this.dropScale.set(0.9, 1 + Math.min(1.5, Math.abs(drop.velocity.y) * 0.10), 0.9);
      } else {
        this.dropPosition.set(0, -50, 0);
        this.dropScale.setScalar(0.001);
      }
      this.dropMatrix.compose(this.dropPosition, this.dropQuaternion, this.dropScale);
      this.dropMesh.setMatrixAt(i, this.dropMatrix);
    }
    this.dropMesh.instanceMatrix.needsUpdate = true;
  }

  updateEffects(dt) {
    this.elapsed += dt;
    this.bellFlash = Math.max(0, this.bellFlash - dt * 1.25);
    this.bellMaterial.emissiveIntensity = this.bellFlash * 1.8;
    for (let i = 0; i < this.soundRings.length; i++) {
      const phase = (1 - this.bellFlash) * 2.2 - i * 0.18;
      const ring = this.soundRings[i];
      if (phase > 0 && phase < 1 && this.bellFlash > 0) {
        ring.visible = true;
        ring.scale.setScalar(1 + phase * 2.8);
        ring.material.opacity = (1 - phase) * 0.55;
      } else {
        ring.visible = false;
      }
    }
  }

  updateCamera(time) {
    const shots = [
      { start: 0, end: 4, from: [10.8, 8.0, 20.6], to: [9.8, 7.7, 19.6], target: [-0.85, 5.60, 0], fov: 40 },
      { start: 4, end: 9.5, from: [-8.4, 8.8, 12.3], to: [-7.5, 8.2, 11.2], target: [-2.35, 5.10, 0], fov: 40 },
      { start: 9.5, end: 15.5, from: [-5.3, 7.6, 8.8], to: [-4.6, 7.15, 8.0], target: [-1.95, 5.55, 0.40], fov: 39 },
      { start: 15.5, end: 21, from: [8.8, 8.3, 17.0], to: [7.8, 8.6, 15.8], target: [-0.05, 6.10, 0.50], fov: 40 },
      { start: 21, end: 27, from: [6.4, 6.25, 8.9], to: [5.8, 5.95, 8.1], target: [1.80, 5.15, 1.60], fov: 39 },
      { start: 27, end: 31, from: [9.7, 7.7, 19.6], to: [10.7, 8.2, 20.8], target: [-0.70, 5.55, 0], fov: 40 },
    ];
    let shot = shots[shots.length - 1];
    for (const candidate of shots) if (time >= candidate.start && time < candidate.end) { shot = candidate; break; }
    const raw = THREE.MathUtils.clamp((time - shot.start) / (shot.end - shot.start), 0, 1);
    const t = raw * raw * (3 - 2 * raw);
    this.camera.position.set(
      THREE.MathUtils.lerp(shot.from[0], shot.to[0], t),
      THREE.MathUtils.lerp(shot.from[1], shot.to[1], t),
      THREE.MathUtils.lerp(shot.from[2], shot.to[2], t),
    );
    this.camera.lookAt(...shot.target);
    if (this.camera.fov !== shot.fov) {
      this.camera.fov = shot.fov;
      this.camera.updateProjectionMatrix();
    }
    this.camera.updateMatrixWorld();
  }

  project(position) {
    const p = new THREE.Vector3(...position).project(this.camera);
    return {
      x: (p.x * 0.5 + 0.5) * this.container.clientWidth,
      y: (-p.y * 0.5 + 0.5) * this.container.clientHeight,
      visible: p.z > -1 && p.z < 1,
    };
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

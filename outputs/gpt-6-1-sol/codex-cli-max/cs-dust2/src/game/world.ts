import * as THREE from "three";
import { CELL, GRID_SIZE, MAP_MIN, MapData, PROPS, groundHeight } from "./map";
import { box, cylinder, material } from "./models";

export function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function letter(
  parent: THREE.Group,
  id: "A" | "B",
  x: number,
  y: number,
  z: number,
  rotation = 0,
) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotation;
  parent.add(g);
  const color = 0xa5432b;
  if (id === "A") {
    const a = box(g, 0.16, 1.8, 0.035, -0.36, 0, 0, color);
    a.rotation.z = -0.35;
    const b = box(g, 0.16, 1.8, 0.035, 0.36, 0, 0, color);
    b.rotation.z = 0.35;
    box(g, 0.7, 0.14, 0.035, 0, -0.1, 0, color);
  } else {
    box(g, 0.17, 1.65, 0.035, -0.43, 0, 0, color);
    box(g, 0.7, 0.15, 0.035, -0.05, 0.75, 0, color);
    box(g, 0.7, 0.15, 0.035, -0.05, 0, 0, color);
    box(g, 0.7, 0.15, 0.035, -0.05, -0.75, 0, color);
    const upper = box(g, 0.16, 0.7, 0.035, 0.34, 0.38, 0, color);
    upper.rotation.z = 0.12;
    const lower = box(g, 0.16, 0.7, 0.035, 0.34, -0.38, 0, color);
    lower.rotation.z = -0.12;
  }
  box(g, 1.3, 0.11, 0.035, 0, -1.22, 0, color);
  const arrow = box(g, 0.45, 0.11, 0.035, 0.5, -1.08, 0, color);
  arrow.rotation.z = -0.7;
}

export class WorldView {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(80, 1, 0.045, 250);
  readonly handsScene = new THREE.Scene();
  readonly handsCamera = new THREE.PerspectiveCamera(65, 1, 0.01, 8);
  readonly renderer: THREE.WebGLRenderer;
  readonly mapGroup = new THREE.Group();
  private resizeObserver: ResizeObserver;
  private dust: THREE.Points;
  private tunnelLamps: THREE.PointLight[] = [];
  private geometrySet = new Set<THREE.BufferGeometry>();
  private materialSet = new Set<THREE.Material>();
  constructor(
    readonly container: HTMLElement,
    readonly map: MapData,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    const context = this.renderer.getContext(),
      debug = context.getExtension("WEBGL_debug_renderer_info");
    const gpu = debug
      ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))
      : "";
    const software =
      /swiftshader|llvmpipe|software/i.test(gpu) ||
      new URLSearchParams(location.search).get("quality") === "low";
    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio, software ? 0.85 : 1.5),
    );
    this.renderer.shadowMap.enabled = !software;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = "game-canvas";
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Dust II 3D 第一人称战场",
    );
    container.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0xbfcfcd);
    this.scene.fog = new THREE.Fog(0xc9ccba, 46, 145);
    this.scene.add(this.mapGroup);
    this.scene.add(new THREE.HemisphereLight(0xd9ecf2, 0x8e7857, 2.5));
    const sunlight = new THREE.DirectionalLight(0xffe4b2, 3.2);
    sunlight.position.set(-30, 55, 20);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(sunlight.shadow.camera, {
      left: -65,
      right: 65,
      top: 65,
      bottom: -65,
      near: 1,
      far: 150,
    });
    sunlight.shadow.normalBias = 0.045;
    sunlight.shadow.bias = -0.00015;
    this.scene.add(sunlight);
    this.handsScene.add(new THREE.HemisphereLight(0xe5f1ef, 0x70573c, 3));
    const handLight = new THREE.DirectionalLight(0xffe4bc, 3);
    handLight.position.set(-3, 5, 2);
    this.handsScene.add(handLight);
    this.buildFloor();
    this.buildArchitecture();
    this.buildProps();
    this.buildSkyline();
    this.batchStaticGeometry();
    const random = seeded(22),
      positions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      positions[i * 3] = (random() - 0.5) * 100;
      positions[i * 3 + 1] = random() * 12 + 1;
      positions[i * 3 + 2] = (random() - 0.5) * 100;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xffe6ae,
        size: 0.035,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    this.scene.add(this.dust);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }
  private resize() {
    const width = this.container.clientWidth,
      height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.handsCamera.aspect = width / height;
    this.handsCamera.updateProjectionMatrix();
  }
  private buildFloor() {
    const random = seeded(12),
      vertices: number[] = [],
      colors: number[] = [],
      color = new THREE.Color();
    for (let iz = 0; iz < GRID_SIZE; iz++)
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        if (!this.map.cell(ix, iz)) continue;
        const x = MAP_MIN + ix * CELL,
          z = MAP_MIN + iz * CELL;
        const points = [
          [x, z],
          [x, z + CELL],
          [x + CELL, z],
          [x + CELL, z],
          [x, z + CELL],
          [x + CELL, z + CELL],
        ];
        const tunnel =
          (x < -24 && z > -22 && z < 32) || (x < -6 && z >= 2 && z < 12);
        color
          .set(tunnel ? 0x8b8170 : 0xc7b68e)
          .multiplyScalar(0.94 + random() * 0.1);
        for (const [xx, zz] of points) {
          vertices.push(xx, groundHeight(xx, zz) - 0.015, zz);
          colors.push(color.r, color.g, color.b);
        }
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    );
    mesh.receiveShadow = true;
    this.mapGroup.add(mesh);
    box(this.mapGroup, 260, 0.3, 260, 0, -0.8, 0, 0xb6a27c);
    // Procedural stone seams and scuffs, batched into a single instanced mesh.
    const seamGeo = new THREE.BoxGeometry(1, 1, 1),
      seamMat = material(0xa89674),
      seams = new THREE.InstancedMesh(seamGeo, seamMat, 650),
      dummy = new THREE.Object3D();
    let n = 0;
    for (let i = 0; i < 1500 && n < 650; i++) {
      const x = (random() - 0.5) * 86,
        z = (random() - 0.5) * 86;
      if (!this.map.onFloor(x, z)) continue;
      dummy.position.set(x, groundHeight(x, z) + 0.003, z);
      dummy.scale.set(0.05 + random() * 0.4, 0.006, 0.018);
      dummy.rotation.y = random() * Math.PI;
      dummy.updateMatrix();
      seams.setMatrixAt(n++, dummy.matrix);
    }
    seams.count = n;
    seams.receiveShadow = true;
    this.mapGroup.add(seams);
    for (const [x, z] of [
      [32, -25],
      [-30, -29],
    ]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(5.7, 5.79, 64),
        new THREE.MeshBasicMaterial({
          color: 0xb58c43,
          transparent: true,
          opacity: 0.56,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, groundHeight(x, z) + 0.022, z);
      this.mapGroup.add(ring);
    }
  }
  private buildArchitecture() {
    const random = seeded(45),
      wallColors = [0xcdb68c, 0xc6ab7f, 0xd1bc97, 0xc4ae89, 0xd9c5a2];
    for (const w of this.map.walls) {
      const width = w.maxX - w.minX,
        depth = w.maxZ - w.minZ,
        x = (w.minX + w.maxX) / 2,
        z = (w.minZ + w.maxZ) / 2,
        height = w.maxY;
      const color = wallColors[(random() * wallColors.length) | 0];
      box(this.mapGroup, width, height, depth, x, height / 2 - 0.1, z, color);
      box(
        this.mapGroup,
        width + 0.16,
        0.22,
        depth + 0.16,
        x,
        height - 0.12,
        z,
        0xbfa67d,
      );
      box(
        this.mapGroup,
        width + 0.07,
        0.14,
        depth + 0.07,
        x,
        1.12,
        z,
        0xb29a75,
      );
      box(
        this.mapGroup,
        width + 0.05,
        0.62,
        depth + 0.05,
        x,
        0.32,
        z,
        0xb9a17c,
      );
      const horizontal = width > depth,
        length = horizontal ? width : depth;
      if (length < 3.5) continue;
      const details = new THREE.Group();
      details.position.set(x, 0, z);
      const side = horizontal
        ? this.map.onFloor(x, z + 0.9)
          ? 1
          : -1
        : this.map.onFloor(x + 0.9, z)
          ? 1
          : -1;
      if (horizontal) details.rotation.y = side === 1 ? 0 : Math.PI;
      else details.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
      this.mapGroup.add(details);
      for (
        let u = -length / 2 + 2;
        u < length / 2 - 1.2;
        u += 4.6 + random() * 1.5
      ) {
        const yy = 3.7 + random() * 0.3;
        box(details, 1.08, 1.45, 0.045, u, yy, 0.3, 0x4e554c);
        box(details, 0.095, 1.7, 0.09, u - 0.59, yy, 0.34, 0xb59b71);
        box(details, 0.095, 1.7, 0.09, u + 0.59, yy, 0.34, 0xb59b71);
        box(details, 1.35, 0.12, 0.16, u, yy - 0.82, 0.35, 0xb49b76);
        box(details, 1.3, 0.12, 0.12, u, yy + 0.82, 0.34, 0xbba27b);
        for (let j = -1; j <= 1; j++)
          box(details, 0.025, 1.43, 0.035, u + j * 0.3, yy, 0.345, 0x8c8b71);
        if (random() > 0.45)
          box(details, 1.05, 0.65, 0.07, u, yy - 0.35, 0.37, 0x66746b);
      }
      // Sparse exposed stone blocks give the plaster a weathered base.
      for (let j = 0; j < Math.min(7, length / 2); j++) {
        const u = (random() - 0.5) * (length - 0.6),
          yy = 0.5 + random() * 0.9;
        box(details, 0.4 + random() * 0.5, 0.18, 0.025, u, yy, 0.303, 0xab9371);
      }
      if (length > 9 && random() > 0.5) {
        const wirePoints = [
          new THREE.Vector3(-length * 0.4, 5.6, 0.5),
          new THREE.Vector3(0, 5.1, 0.9),
          new THREE.Vector3(length * 0.4, 5.5, 0.5),
        ];
        const curve = new THREE.CatmullRomCurve3(wirePoints);
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
          new THREE.LineBasicMaterial({ color: 0x504e3e }),
        );
        details.add(line);
      }
    }
    // Mid double-door arch, tunnel vaults, and exposed lintels.
    box(this.mapGroup, 12, 2.35, 2, 0, 4.73, -15.5, 0xb9a17a);
    for (const x of [-5.55, 5.55])
      box(this.mapGroup, 0.6, 3.55, 1.1, x, 1.77, -15.5, 0xc9b18a);
    for (const z of [-16, -8, 0, 8, 16, 24]) {
      box(this.mapGroup, 12, 0.34, 0.5, -30, 3.91, z, 0x6f6856);
      box(this.mapGroup, 0.3, 3.8, 0.5, -35.65, 1.9, z, 0xa38e6a);
      box(this.mapGroup, 0.3, 3.8, 0.5, -24.35, 1.9, z, 0xa38e6a);
    }
    box(this.mapGroup, 12, 0.35, 50, -30, 4.28, 5, 0x9a8c70);
    box(this.mapGroup, 20, 0.35, 10, -16, 4.28, 7, 0x9a8c70);
    for (const z of [-12, 7, 27]) {
      const light = new THREE.PointLight(0xffcf7f, 16, 14, 2);
      light.position.set(-30, 3.4, z);
      this.scene.add(light);
      this.tunnelLamps.push(light);
      box(this.mapGroup, 0.5, 0.07, 0.3, -30, 3.9, z, 0x383f35);
      box(this.mapGroup, 0.28, 0.04, 0.17, -30, 3.85, z, 0xe0c390);
    }
    letter(this.mapGroup, "A", 31, 3.2, -37.67);
    letter(this.mapGroup, "B", -30, 3.05, -39.67);
    letter(this.mapGroup, "A", 33.67, 2.8, 7, -Math.PI / 2);
    letter(this.mapGroup, "B", -35.67, 2.5, 30, Math.PI / 2);
    // Blue plaster at CT spawn anchors the central hub visually.
    box(this.mapGroup, 15, 2.1, 0.035, 0, 1.05, -35.69, 0x6f9294);
    box(this.mapGroup, 4.6, 2.7, 0.05, -0.5, 1.35, -35.64, 0x364e4e);
    for (const x of [-2.8, 1.8])
      box(this.mapGroup, 0.18, 2.9, 0.16, x, 1.45, -35.59, 0xb8ac89);
    // Short A stair nosings follow the collision terrain rather than introducing fake steps.
    for (let i = 0; i < 8; i++) {
      const z = 13 - i * 1.2;
      box(
        this.mapGroup,
        7.7,
        0.055,
        0.09,
        14,
        groundHeight(14, z) + 0.015,
        z,
        0xad9f80,
      );
    }
  }
  private buildProps() {
    for (const p of PROPS) {
      const y = groundHeight(p.x, p.z),
        g = new THREE.Group();
      g.position.set(p.x, y, p.z);
      this.mapGroup.add(g);
      if (p.type === "door") {
        box(g, p.w, p.h, p.d, 0, p.h / 2, 0, 0x705539);
        const horizontal = p.w > p.d,
          length = horizontal ? p.w : p.d;
        for (let t = -length / 2 + 0.2; t < length / 2; t += 0.32) {
          if (horizontal)
            box(g, 0.025, p.h - 0.1, p.d + 0.015, t, p.h / 2, 0, 0x493b2a);
          else box(g, p.w + 0.015, p.h - 0.1, 0.025, 0, p.h / 2, t, 0x493b2a);
        }
        for (const h of [0.5, 1.5, 2.8])
          box(g, p.w + 0.035, 0.13, p.d + 0.035, 0, h, 0, 0x373c32);
        if (horizontal)
          box(
            g,
            0.16,
            0.22,
            0.08,
            p.x < 0 ? p.w * 0.3 : -p.w * 0.3,
            1.6,
            p.d / 2 + 0.05,
            0x343a30,
          );
      } else {
        box(g, p.w, p.h, p.d, 0, p.h / 2, 0, 0x9a906a);
        for (const side of [-1, 1]) {
          box(
            g,
            0.14,
            p.h + 0.02,
            p.d + 0.045,
            side * (p.w / 2 - 0.13),
            p.h / 2,
            0,
            0x5f6551,
          );
          box(
            g,
            p.w + 0.045,
            p.h + 0.02,
            0.14,
            0,
            p.h / 2,
            side * (p.d / 2 - 0.13),
            0x5f6551,
          );
        }
        for (const h of [0.15, p.h - 0.15])
          box(g, p.w + 0.06, 0.16, p.d + 0.06, 0, h, 0, 0x6a6c51);
        for (let i = 1; i < 4; i++)
          box(
            g,
            p.w - 0.3,
            0.025,
            0.016,
            0,
            (p.h * i) / 4,
            p.d / 2 + 0.012,
            0x7b785b,
          );
        const diagonal = box(
          g,
          0.13,
          Math.hypot(p.w * 0.75, p.h * 0.75),
          0.04,
          0,
          p.h / 2,
          p.d / 2 + 0.025,
          0x6b7058,
        );
        diagonal.rotation.z = -Math.atan2(p.w, p.h);
        box(
          g,
          0.52,
          0.36,
          0.015,
          p.w * 0.15,
          p.h * 0.6,
          p.d / 2 + 0.03,
          0xc6b78c,
        );
        box(
          g,
          0.3,
          0.045,
          0.02,
          p.w * 0.15,
          p.h * 0.6,
          p.d / 2 + 0.042,
          0x575e4a,
        );
      }
    }
    // Wall-mounted AC units and a striped fabric awning outside long.
    for (const [x, z] of [
      [43.65, 0],
      [43.65, -8],
      [-41.65, -30],
    ]) {
      box(this.mapGroup, 0.65, 0.65, 1.25, x, 4.9, z, 0xb1b7a3);
      for (let j = 0; j < 6; j++)
        box(
          this.mapGroup,
          0.04,
          0.035,
          1.05,
          x - 0.35,
          4.7 + j * 0.07,
          z,
          0x6f8077,
        );
    }
    const awning = new THREE.Group();
    awning.position.set(33.9, 3.7, 15);
    awning.rotation.z = -0.15;
    this.mapGroup.add(awning);
    for (let i = 0; i < 8; i++)
      box(
        awning,
        2.1,
        0.055,
        0.7,
        0,
        0,
        (i - 3.5) * 0.7,
        i % 2 ? 0xbfc1a5 : 0x717f6a,
      );
  }
  private buildSkyline() {
    const random = seeded(42);
    const buildings = [
      [-16, 21, 7, 16],
      [-16, -12, 7, 16],
      [22, 0, 6, 22],
      [-8, -44, 18, 10],
      [16, -44, 10, 10],
      [38, -44, 12, 9],
      [-46, 3, 7, 55],
      [48, -12, 7, 65],
      [6, 48, 60, 6],
      [-20, 26, 5, 8],
    ];
    for (const [x, z, w, d] of buildings) {
      const h = 8 + random() * 5;
      box(this.mapGroup, w, h, d, x, h / 2 - 0.3, z, 0xbdad8d);
      box(this.mapGroup, w + 0.35, 0.35, d + 0.35, x, h - 0.2, z, 0xa89573);
      for (let j = 0; j < 4; j++)
        box(
          this.mapGroup,
          0.7,
          1.2,
          0.04,
          x - w * 0.35 + j * w * 0.22,
          h - 2,
          z + d / 2 + 0.025,
          0x5b695f,
        );
      box(this.mapGroup, 2, 0.7, 2, x, h + 0.2, z, 0xa8ab96);
    }
    const tower = new THREE.Group();
    tower.position.set(-19, 0, -45);
    this.mapGroup.add(tower);
    box(tower, 4.6, 17, 4.6, 0, 8.5, 0, 0xcab995);
    box(tower, 5.3, 0.5, 5.3, 0, 16.2, 0, 0xa49677);
    box(tower, 3, 4, 3, 0, 19, 0, 0xcbbb96);
    box(tower, 3.7, 0.4, 3.7, 0, 20.8, 0, 0xa3977c);
    cylinder(tower, 0, 1.9, 2.2, 0, 22, 0, 0x738477, 12);
    cylinder(tower, 0.055, 0.055, 1.8, 0, 24, 0, 0x8b8b65, 8);
    for (const side of [-1, 1])
      for (let i = -1; i <= 1; i++)
        box(tower, 0.4, 1.5, 0.04, i * 0.8, 18.9, side * 1.51, 0x4b5a4e);
    for (const [x, z] of [
      [45, -36],
      [-44, -38],
      [22, 38],
      [-20, -42],
    ])
      this.palm(x, z, random);
  }
  private palm(x: number, z: number, random: () => number) {
    const height = 7 + random() * 2;
    cylinder(this.mapGroup, 0.17, 0.34, height, x, height / 2, z, 0x7d7050, 9);
    for (let j = 0; j < 9; j++) {
      const angle = (j / 9) * Math.PI * 2,
        points: number[] = [];
      for (let i = 0; i < 6; i++) {
        const t = i / 5,
          r = t * 3.7,
          y = height + Math.sin(t * Math.PI) * 1.1 - t * 0.9,
          ww = Math.sin(t * Math.PI) * 0.55;
        points.push(
          x + Math.cos(angle) * r - Math.sin(angle) * ww,
          y,
          z + Math.sin(angle) * r + Math.cos(angle) * ww,
          x + Math.cos(angle) * r + Math.sin(angle) * ww,
          y,
          z + Math.sin(angle) * r - Math.cos(angle) * ww,
        );
      }
      const indices: number[] = [];
      for (let i = 0; i < 5; i++) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({
        color: j % 2 ? 0x677e4b : 0x7b8a53,
        side: THREE.DoubleSide,
        roughness: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      this.mapGroup.add(mesh);
    }
  }
  private batchStaticGeometry() {
    this.mapGroup.updateMatrixWorld(true);
    const batches = new Map<string, THREE.Mesh[]>();
    this.mapGroup.traverse((object) => {
      if (
        !(object instanceof THREE.Mesh) ||
        object instanceof THREE.InstancedMesh ||
        Array.isArray(object.material)
      )
        return;
      const key = `${object.geometry.uuid}:${object.material.uuid}`;
      const list = batches.get(key) ?? [];
      list.push(object);
      batches.set(key, list);
    });
    for (const meshes of batches.values()) {
      if (meshes.length < 3) continue;
      const batch = new THREE.InstancedMesh(
        meshes[0].geometry,
        meshes[0].material,
        meshes.length,
      );
      batch.castShadow = true;
      batch.receiveShadow = true;
      meshes.forEach((mesh, index) => {
        batch.setMatrixAt(index, mesh.matrixWorld);
        mesh.removeFromParent();
      });
      batch.computeBoundingSphere();
      this.mapGroup.add(batch);
    }
  }
  animate(time: number) {
    this.dust.rotation.y = Math.sin(time * 0.015) * 0.04;
    for (let i = 0; i < this.tunnelLamps.length; i++)
      this.tunnelLamps[i].intensity = 15 + Math.sin(time * 3 + i) * 0.25;
  }
  menuCamera(time: number) {
    this.camera.fov = 65;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(
      39 + Math.sin(time * 0.045) * 1.2,
      4.2,
      15 + Math.cos(time * 0.045) * 1.5,
    );
    this.camera.lookAt(28, 3, -23);
  }
  render(hands = false) {
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    if (hands) {
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.handsScene, this.handsCamera);
      this.renderer.autoClear = true;
    }
  }
  dispose() {
    this.resizeObserver.disconnect();
    for (const scene of [this.scene, this.handsScene])
      scene.traverse((o) => {
        if (
          o instanceof THREE.Mesh ||
          o instanceof THREE.Points ||
          o instanceof THREE.Line
        ) {
          this.geometrySet.add(o.geometry);
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => this.materialSet.add(m));
        }
      });
    this.geometrySet.forEach((g) => g.dispose());
    this.materialSet.forEach((m) => m.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

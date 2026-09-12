import * as THREE from "three";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";

import { glowMat, grainy, hash3, mesh, meteoriteGeometry, mixHex, rng, shade, slab, voxMat } from "../lib/vox";
import { magnifierGeometry, teacupGeometry } from "../art/props";

/**
 * 四合院。
 *
 * 全片唯一一个温暖的地方。它必须让人想留下来 —— 因为章北海正是在这里
 * 意识到，在他们为人类的生存而战时，大部分人仍然执著于自己固有的生活。
 * 所以这个场景的光是琥珀色的，而柜子里的射灯是冷白的：一个人守着一个
 * 小世界，小世界里的东西来自尘世之外。
 */

const BRICK = 0x6a6660;
const BRICK_DARK = 0x4c4944;
const WOOD = 0x4a3526;
const WOOD_DARK = 0x33241a;
const FLOOR = 0x54402d;

function brickWall(
  width: number,
  height: number,
  depth: number,
  voxel = 0.2,
  seed = 5,
  hole?: (x: number, y: number) => boolean,
): THREE.BufferGeometry {
  const w = Math.round(width / voxel);
  const h = Math.round(height / voxel);
  const d = Math.max(1, Math.round(depth / voxel));
  return buildVoxelGeometry(
    {
      size: [w, h, d],
      at(x, y, z) {
        if (hole?.(x, y)) return null;
        const course = Math.floor(y / 2);
        const offset = course % 2 === 0 ? 0 : 2;
        const joint = (x + offset) % 5 === 0 || y % 2 === 0;
        const base = joint ? BRICK_DARK : BRICK;
        const weather = hash3(x, y, z, seed);
        return grainy(mixHex(base, 0x7d7468, weather * 0.35), x, y, z, 0.08, seed);
      },
    },
    { voxel, anchor: "min" },
  );
}

function plankFloor(width: number, depth: number, voxel = 0.2, colour = FLOOR, seed = 9): THREE.BufferGeometry {
  const w = Math.round(width / voxel);
  const d = Math.round(depth / voxel);
  return buildVoxelGeometry(
    {
      size: [w, 1, d],
      at(x, _y, z) {
        const plank = Math.floor(z / 3);
        const seam = z % 3 === 0;
        const tint = hash3(plank, 0, Math.floor(x / 7), seed);
        return grainy(seam ? shade(colour, 0.72) : mixHex(colour, 0x6d5537, tint), x, 0, z, 0.09, seed);
      },
    },
    { voxel, anchor: "min" },
  );
}

/** 灰瓦屋檐：一排一排的瓦垄。 */
function tileRoof(width: number, voxel = 0.2, seed = 13): THREE.BufferGeometry {
  const w = Math.round(width / voxel);
  return buildVoxelGeometry(
    {
      size: [w, 3, 5],
      at(x, y, z) {
        if (y === 2 && z > 2) return null;
        if (y === 0 && z < 1) return null;
        const ridge = x % 3 === 0;
        const colour = ridge ? 0x3b3d41 : 0x55585d;
        return grainy(colour, x, y, z, 0.1, seed);
      },
    },
    { voxel, anchor: "min" },
  );
}

export interface Courtyard {
  exterior: THREE.Group;
  interior: THREE.Group;
  /** 柜子里的冷光，和窗外的暖光。 */
  caseLights: THREE.PointLight[];
  deskLamp: THREE.PointLight;
  key: THREE.DirectionalLight;
  windowGlow: THREE.Mesh;
  /** 工作台面上那三块要卖的铁陨石。 */
  tableStones: THREE.Object3D[];
  /** 保险柜的门，能开。 */
  safeDoor: THREE.Object3D;
  teacups: THREE.Object3D[];
  gateLeft: THREE.Object3D;
  gateRight: THREE.Object3D;
  dispose(): void;
}

export function buildCourtyard(): Courtyard {
  const exterior = new THREE.Group();
  const interior = new THREE.Group();
  const solid = voxMat("earth-solid", { roughness: 1 });
  const woodMat = voxMat("earth-wood", { roughness: 0.95 });
  const stoneMat = voxMat("earth-stone", { roughness: 1 });
  const owned: THREE.BufferGeometry[] = [];
  const keep = <G extends THREE.BufferGeometry>(geometry: G): G => {
    owned.push(geometry);
    return geometry;
  };

  // ── 胡同 ────────────────────────────────────────────────────────────
  mesh(keep(plankFloor(6, 22, 0.25, 0x6c6862, 3)), exterior, {
    position: [-3, -0.25, -14],
    material: stoneMat,
    receiveShadow: true,
  });
  for (const side of [-1, 1] as const) {
    mesh(keep(brickWall(0.4, 3.4, 22, 0.2, side > 0 ? 7 : 8)), exterior, {
      position: [side > 0 ? 2.6 : -3, 0, -14],
      material: solid,
      castShadow: true,
      receiveShadow: true,
    });
    const roof = mesh(keep(tileRoof(22, 0.2, side > 0 ? 15 : 16)), exterior, {
      position: [side > 0 ? 2.4 : -3.4, 3.4, -14],
      rotation: [0, Math.PI / 2, 0],
      material: solid,
      castShadow: true,
    });
    roof.position.z = side > 0 ? 8 : 8;
    roof.position.x = side > 0 ? 3.0 : -2.6;
  }

  // 院门：两扇朱红门扇 + 门墩 + 门簪
  const gate = new THREE.Group();
  gate.position.set(-0.2, 0, -8.6);
  exterior.add(gate);
  // 门洞：17 格宽的墙上掏掉中间 12 格、下面 13 格
  mesh(
    keep(brickWall(3.4, 3.6, 0.5, 0.2, 21, (x, y) => x >= 3 && x <= 13 && y < 13)),
    gate,
    { position: [-1.7, 0, -0.25], material: solid, castShadow: true },
  );
  // 门洞后面的影壁：暖光从院子里透出来
  mesh(keep(slab([16, 14, 2], 0x7a6f61, { voxel: 0.2, anchor: "min", grain: 0.09, seed: 24 })), gate, {
    position: [-1.6, 0, -2.6],
    material: solid,
    receiveShadow: true,
  });
  const courtyardGlow = new THREE.PointLight(0xffb268, 9, 9, 2);
  courtyardGlow.position.set(0, 1.5, -1.9);
  gate.add(courtyardGlow);
  mesh(keep(slab([17, 4, 3], 0x3f4247, { voxel: 0.2, anchor: "min", grain: 0.1, seed: 22 })), gate, {
    position: [-1.7, 3.4, -0.5],
    material: solid,
    castShadow: true,
  });
  const doorLeaf = (sign: number): THREE.Object3D => {
    const pivot = new THREE.Group();
    pivot.position.set(sign * 1.15, 0, -0.2);
    gate.add(pivot);
    mesh(
      keep(
        buildVoxelGeometry(
          {
            size: [6, 14, 1],
            at(x, y, z) {
              const stud = (x === 1 || x === 4) && y % 4 === 2;
              return grainy(stud ? 0xb99a4a : y < 1 ? 0x5c1f18 : 0x8c2f22, x, y, z, 0.07, 25 + sign);
            },
          },
          { voxel: 0.2, anchor: "min" },
        ),
      ),
      pivot,
      { position: [sign > 0 ? 0 : -1.2, 0.2, 0], material: woodMat, castShadow: true },
    );
    return pivot;
  };
  const gateRight = doorLeaf(1);
  const gateLeft = doorLeaf(-1);
  mesh(keep(slab([4, 3, 4], 0x8b8880, { voxel: 0.16, anchor: "min", grain: 0.12, seed: 27 })), gate, {
    position: [1.0, 0, -0.1],
    material: stoneMat,
    castShadow: true,
  });
  mesh(keep(slab([4, 3, 4], 0x8b8880, { voxel: 0.16, anchor: "min", grain: 0.12, seed: 28 })), gate, {
    position: [-1.65, 0, -0.1],
    material: stoneMat,
    castShadow: true,
  });
  // 墙头探出来的一株枣树
  const branchRandom = rng(41);
  for (let i = 0; i < 26; i += 1) {
    const t = i / 26;
    mesh(
      keep(
        slab([1 + Math.floor(branchRandom() * 2), 1, 1], i % 4 === 0 ? 0x3d3226 : 0x46603a, {
          voxel: 0.22,
          anchor: "min",
          grain: 0.2,
          seed: 50 + i,
        }),
      ),
      exterior,
      {
        position: [
          -2.4 + t * 2.1 + (branchRandom() - 0.5) * 0.7,
          3.3 + Math.sin(t * 3.1) * 0.6 + branchRandom() * 0.5,
          -6.2 - t * 3.4 + (branchRandom() - 0.5) * 1.2,
        ],
        material: solid,
        castShadow: true,
      },
    );
  }

  // ── 收藏室 ──────────────────────────────────────────────────────────
  mesh(keep(plankFloor(7.2, 6.4, 0.2, FLOOR, 33)), interior, {
    position: [-3.6, -0.2, -3.4],
    material: woodMat,
    receiveShadow: true,
  });
  mesh(keep(plankFloor(7.2, 6.4, 0.2, 0x2b2119, 34)), interior, {
    position: [-3.6, 3.1, -3.4],
    material: woodMat,
  });
  // 墙
  mesh(keep(brickWall(7.2, 3.3, 0.3, 0.2, 35)), interior, {
    position: [-3.6, 0, -3.6],
    material: solid,
    receiveShadow: true,
  });
  mesh(keep(brickWall(0.3, 3.3, 6.4, 0.2, 36)), interior, {
    position: [-3.6, 0, -3.4],
    material: solid,
    receiveShadow: true,
  });
  mesh(keep(brickWall(0.3, 3.3, 6.4, 0.2, 37)), interior, {
    position: [3.3, 0, -3.4],
    material: solid,
    receiveShadow: true,
  });
  mesh(keep(brickWall(7.2, 3.3, 0.3, 0.2, 38)), interior, {
    position: [-3.6, 0, 3.0],
    material: solid,
  });
  // 房梁
  for (let i = 0; i < 5; i += 1) {
    mesh(keep(slab([36, 1, 2], WOOD_DARK, { voxel: 0.2, anchor: "min", grain: 0.11, seed: 60 + i })), interior, {
      position: [-3.6, 2.9, -3.2 + i * 1.3],
      material: woodMat,
      castShadow: true,
    });
  }

  // 后墙的窗：糊纸的支摘窗，外面是下午四点的太阳
  const windowGlow = mesh(
    keep(
      buildVoxelGeometry(
        {
          size: [11, 8, 1],
          at(x, y) {
            const lattice = x % 3 === 0 || y % 3 === 0;
            return lattice ? 0x6a4c30 : 0xffd9a0;
          },
        },
        { voxel: 0.16, anchor: "min" },
      ),
    ),
    interior,
    { position: [-1.0, 1.15, -3.42], material: glowMat(0xffffff) },
  );
  (windowGlow.material as THREE.MeshBasicMaterial).vertexColors = true;

  // 玻璃柜：木框 + 一块淡青的玻璃 + 里面被冷光照着的石头
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xa8c6cc,
    transparent: true,
    opacity: 0.17,
    roughness: 0.25,
    metalness: 0,
    depthWrite: false,
  });
  const caseLights: THREE.PointLight[] = [];
  const meteorGeometries = [
    keep(meteoriteGeometry(3, 0.032, 71)),
    keep(meteoriteGeometry(4, 0.028, 72)),
    keep(meteoriteGeometry(2, 0.036, 73)),
    keep(meteoriteGeometry(5, 0.024, 74)),
  ];
  const stoneMaterial = voxMat("meteorite", { roughness: 0.72, metalness: 0.28 });

  const buildCase = (x: number, z: number, rotation: number, seed: number): void => {
    const unit = new THREE.Group();
    unit.position.set(x, 0, z);
    unit.rotation.y = rotation;
    interior.add(unit);
    mesh(keep(slab([6, 12, 3], WOOD_DARK, {
      voxel: 0.18,
      anchor: "min",
      grain: 0.09,
      seed,
      carve: (cx, cy, cz) => (cx > 0 && cx < 5 && cy > 0 && cy < 11 && cz > 0 ? null : undefined),
    })), unit, { position: [-0.54, 0, -0.27], material: woodMat, castShadow: true, receiveShadow: true });
    for (let shelf = 0; shelf < 3; shelf += 1) {
      const y = 0.36 + shelf * 0.6;
      mesh(keep(slab([4, 1, 2], 0x6b5a45, { voxel: 0.18, anchor: "min", grain: 0.07, seed: seed + shelf })), unit, {
        position: [-0.36, y, -0.18],
        material: woodMat,
      });
      const random = rng(seed * 31 + shelf);
      const count = 2 + Math.floor(random() * 2);
      for (let i = 0; i < count; i += 1) {
        const stone = new THREE.Mesh(
          meteorGeometries[Math.floor(random() * meteorGeometries.length)]!,
          stoneMaterial,
        );
        stone.position.set(-0.26 + i * (0.5 / count) + random() * 0.12, y + 0.16, -0.02);
        stone.rotation.set(random() * 3, random() * 3, random() * 3);
        stone.castShadow = true;
        unit.add(stone);
      }
    }
    // 一个柜子一盏冷光就够了 —— 前向渲染里点光源是按个数进 shader 的。
    {
      const light = new THREE.PointLight(0xbfd9ff, 2.6, 2.0, 2);
      light.position.set(0, 1.1, 0.04);
      unit.add(light);
      caseLights.push(light);
    }
    const glass = new THREE.Mesh(
      keep(slab([6, 12, 1], 0xa8c6cc, { voxel: 0.18, anchor: "min", grain: 0.02, seed: seed + 9 })),
      glassMat,
    );
    glass.position.set(-0.54, 0, 0.24);
    unit.add(glass);
  };

  buildCase(-3.05, -2.0, Math.PI / 2, 101);
  buildCase(-3.05, -0.6, Math.PI / 2, 102);
  buildCase(-3.05, 0.8, Math.PI / 2, 103);
  buildCase(2.75, -2.0, -Math.PI / 2, 104);
  buildCase(2.75, -0.6, -Math.PI / 2, 105);
  buildCase(-2.2, -3.25, 0, 106);
  buildCase(1.6, -3.25, 0, 107);
  // 门这一侧也是柜子 —— 四壁都立着玻璃柜，反打时人物背后才有东西
  buildCase(-1.9, 2.8, Math.PI, 108);
  buildCase(1.2, 2.8, Math.PI, 109);

  // 工作台
  const bench = new THREE.Group();
  bench.position.set(0.1, 0, -1.15);
  interior.add(bench);
  mesh(keep(slab([12, 1, 6], 0x6a5236, { voxel: 0.16, anchor: "min", grain: 0.1, seed: 121 })), bench, {
    position: [-0.96, 0.78, -0.48],
    material: woodMat,
    castShadow: true,
    receiveShadow: true,
  });
  for (const [dx, dz] of [[-0.88, -0.4], [0.8, -0.4], [-0.88, 0.36], [0.8, 0.36]] as const) {
    mesh(keep(slab([1, 5, 1], WOOD_DARK, { voxel: 0.16, anchor: "min", grain: 0.08, seed: 122 })), bench, {
      position: [dx, 0, dz],
      material: woodMat,
      castShadow: true,
    });
  }
  // 台灯：全片第一盏灯。放在台面左端，不挡两个人之间的视线。
  mesh(keep(slab([3, 1, 3], 0x2f3238, { voxel: 0.1, anchor: "min", grain: 0.06, seed: 131 })), bench, {
    position: [-0.86, 0.94, -0.42],
    material: solid,
  });
  mesh(keep(slab([1, 4, 1], 0x2f3238, { voxel: 0.1, anchor: "min", grain: 0.06, seed: 132 })), bench, {
    position: [-0.76, 1.0, -0.32],
    material: solid,
  });
  mesh(keep(slab([4, 2, 4], 0x3a3e45, { voxel: 0.1, anchor: "min", grain: 0.06, seed: 133 })), bench, {
    position: [-1.0, 1.34, -0.47],
    material: solid,
    castShadow: true,
  });
  mesh(keep(slab([2, 1, 2], 0xffd9a0, { voxel: 0.1, anchor: "min" })), bench, {
    position: [-0.9, 1.33, -0.37],
    material: glowMat(0xffe0ae),
  });
  const deskLamp = new THREE.PointLight(0xffc07a, 5.6, 6.5, 2);
  deskLamp.position.set(-0.8, 1.22, -0.24);
  deskLamp.castShadow = true;
  deskLamp.shadow.mapSize.set(512, 512);
  bench.add(deskLamp);

  const magnifier = new THREE.Mesh(keep(magnifierGeometry(0.02)), voxMat("earth-solid", { roughness: 1 }));
  magnifier.position.set(-0.5, 0.98, 0.1);
  magnifier.rotation.set(-1.15, 0.2, 0);
  magnifier.castShadow = true;
  bench.add(magnifier);

  // 桌上那三块要卖的铁陨石，开场时还在柜子里，靠 visible 控制
  const tableStones: THREE.Object3D[] = [];
  for (let i = 0; i < 3; i += 1) {
    const stone = new THREE.Mesh(keep(meteoriteGeometry(4.4, 0.026, 80 + i)), stoneMaterial);
    stone.position.set(-0.3 + i * 0.44, 1.02, 0.06);
    stone.rotation.set(i * 1.7, i * 2.3, i * 0.9);
    stone.castShadow = true;
    stone.visible = false;
    bench.add(stone);
    tableStones.push(stone);
  }

  // 茶
  const teacups: THREE.Object3D[] = [];
  const porcelain = voxMat("porcelain", { roughness: 0.5 });
  for (const [x, z] of [[-0.72, 0.2], [0.16, 0.26]] as const) {
    const cup = new THREE.Mesh(keep(teacupGeometry(0.018)), porcelain);
    cup.position.set(x, 0.8, z);
    cup.castShadow = true;
    cup.visible = false;
    bench.add(cup);
    teacups.push(cup);
  }

  // 保险柜：镇宅之宝在里面
  const safe = new THREE.Group();
  safe.position.set(2.5, 0, 0.9);
  safe.rotation.y = -Math.PI / 2.2;
  interior.add(safe);
  mesh(keep(slab([6, 8, 5], 0x33383f, {
    voxel: 0.12,
    anchor: "min",
    grain: 0.08,
    seed: 141,
    carve: (x, y, z) => (x > 0 && x < 5 && y > 0 && y < 7 && z > 2 ? null : undefined),
  })), safe, { position: [-0.36, 0, -0.3], material: solid, castShadow: true, receiveShadow: true });
  const safeDoor = new THREE.Group();
  safeDoor.position.set(0.36, 0, 0.3);
  safe.add(safeDoor);
  mesh(keep(slab([6, 8, 1], 0x3d434b, { voxel: 0.12, anchor: "min", grain: 0.08, seed: 142 })), safeDoor, {
    position: [-0.72, 0, 0],
    material: solid,
    castShadow: true,
  });
  mesh(keep(slab([2, 2, 1], 0x9aa3ad, { voxel: 0.1, anchor: "min", grain: 0.05, seed: 143 })), safeDoor, {
    position: [-0.62, 0.4, 0.08],
    material: solid,
  });
  const treasure = new THREE.Mesh(keep(meteoriteGeometry(2, 0.01, 151)), stoneMaterial);
  treasure.position.set(0, 0.62, 0.04);
  safe.add(treasure);
  const treasureLight = new THREE.PointLight(0xcfe4ff, 1.2, 0.8, 2);
  treasureLight.position.set(0, 0.72, 0.16);
  safe.add(treasureLight);
  caseLights.push(treasureLight);

  // 两只方凳
  for (const [x, z] of [[-1.05, 0.55], [0.9, -2.15]] as const) {
    mesh(keep(slab([4, 1, 4], 0x5b4630, { voxel: 0.11, anchor: "min", grain: 0.1, seed: 161 })), interior, {
      position: [x - 0.22, 0.44, z - 0.22],
      material: woodMat,
      castShadow: true,
    });
    for (const [ox, oz] of [[0, 0], [0.33, 0], [0, 0.33], [0.33, 0.33]] as const) {
      mesh(keep(slab([1, 4, 1], WOOD_DARK, { voxel: 0.11, anchor: "min", grain: 0.08, seed: 162 })), interior, {
        position: [x - 0.2 + ox, 0, z - 0.2 + oz],
        material: woodMat,
      });
    }
  }

  // 光
  const key = new THREE.DirectionalLight(0xffb267, 2.2);
  key.position.set(-2.4, 4.2, -7.5);
  key.target.position.set(0, 1.0, -0.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 26;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0016;
  interior.add(key);
  interior.add(key.target);

  const bounce = new THREE.HemisphereLight(0x7a5c3c, 0x1a120b, 0.85);
  interior.add(bounce);
  // 敞着的门在身后落下一片暖光，让前景的人不至于变成一块黑板
  const doorFill = new THREE.PointLight(0xffa96e, 13, 11, 2);
  doorFill.position.set(2.6, 2.15, 3.0);
  interior.add(doorFill);
  exterior.add(new THREE.HemisphereLight(0x8fa9c8, 0x453425, 1.15));

  // 下午四点的太阳顺着胡同照过来，正打在朱红的门上。
  const sun = new THREE.DirectionalLight(0xffb267, 3.4);
  sun.position.set(9, 7, 9);
  sun.target.position.set(-0.2, 1.2, -8.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -4;
  sun.shadow.bias = -0.0018;
  exterior.add(sun);
  exterior.add(sun.target);

  exterior.visible = false;
  interior.visible = false;

  return {
    exterior,
    interior,
    caseLights,
    deskLamp,
    key,
    windowGlow,
    tableStones,
    safeDoor,
    teacups,
    gateLeft,
    gateRight,
    dispose() {
      for (const geometry of owned) geometry.dispose();
      glassMat.dispose();
    },
  };
}

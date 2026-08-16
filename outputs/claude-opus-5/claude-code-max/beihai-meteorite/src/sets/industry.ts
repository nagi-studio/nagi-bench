import * as THREE from "three";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";

import { glowMat, grainy, hash3, mesh, mixHex, rng, shade, slab, voxMat } from "../lib/vox";
import { beefGeometry, gravelGeometry, meteoriteRoundGeometry, meteoriteSlugGeometry } from "../art/props";
import { meteoriteGeometry } from "../lib/vox";

/**
 * 车间与地下室。
 *
 * 这两场是全片的"工序"段落：没有对白，只有一个人和几台机器。视觉上
 * 从四合院的琥珀色一下切到冷白的荧光灯，再切到一只钨丝灯泡 —— 光越来
 * 越少，人越来越孤立，直到地下室里只剩一个光锥。
 */

const CONCRETE = 0x6e706c;
const CONCRETE_DARK = 0x44453f;
const MACHINE = 0x4c5866;
const MACHINE_LIT = 0x687789;

function concreteSlab(width: number, depth: number, voxel = 0.25, seed = 3): THREE.BufferGeometry {
  const w = Math.round(width / voxel);
  const d = Math.round(depth / voxel);
  return buildVoxelGeometry(
    {
      size: [w, 1, d],
      at(x, _y, z) {
        const stain = hash3(Math.floor(x / 4), 0, Math.floor(z / 4), seed);
        return grainy(mixHex(CONCRETE, CONCRETE_DARK, stain * 0.55), x, 0, z, 0.07, seed);
      },
    },
    { voxel, anchor: "min" },
  );
}

export interface Workshop {
  root: THREE.Group;
  /** 卡盘：切削时在转。 */
  chuck: THREE.Object3D;
  /** 刀架：沿着工件走刀。 */
  toolPost: THREE.Object3D;
  /** 夹在卡盘上的那块铁陨石。 */
  billet: THREE.Object3D;
  /** 切屑火花。 */
  sparks: THREE.Points;
  /** 顶灯，可以一盏一盏灭。 */
  ceilingLights: THREE.PointLight[];
  ceilingPanels: THREE.Mesh[];
  screen: THREE.Mesh;
  /** 切完之后摊在台面上的三十六段。 */
  slugs: THREE.Group;
  /** 拆下来的那把石材刀具。 */
  cutter: THREE.Object3D;
  dispose(): void;
}

export function buildWorkshop(): Workshop {
  const root = new THREE.Group();
  const owned: THREE.BufferGeometry[] = [];
  const keep = <G extends THREE.BufferGeometry>(g: G): G => {
    owned.push(g);
    return g;
  };
  const solid = voxMat("shop-solid", { roughness: 0.95 });
  const metal = voxMat("shop-metal", { roughness: 0.55, metalness: 0.35 });

  mesh(keep(concreteSlab(16, 14, 0.25, 11)), root, {
    position: [-8, -0.25, -7],
    material: solid,
    receiveShadow: true,
  });
  mesh(keep(concreteSlab(16, 14, 0.25, 12)), root, { position: [-8, 4.0, -7], material: solid });
  // 地面上的黄色安全线
  mesh(keep(slab([56, 1, 1], 0xb99a2e, { voxel: 0.25, anchor: "min", grain: 0.1, seed: 13 })), root, {
    position: [-7, -0.005, 1.6],
    material: solid,
  });

  const wall = (w: number, h: number, d: number, seed: number): THREE.BufferGeometry =>
    keep(
      buildVoxelGeometry(
        {
          size: [Math.round(w / 0.25), Math.round(h / 0.25), Math.max(1, Math.round(d / 0.25))],
          at(x, y, z) {
            const band = y < 6 ? 0x455049 : CONCRETE;
            return grainy(band, x, y, z, 0.06, seed);
          },
        },
        { voxel: 0.25, anchor: "min" },
      ),
    );
  mesh(wall(16, 4.25, 0.3, 21), root, { position: [-8, 0, -7.2], material: solid, receiveShadow: true });
  mesh(wall(0.3, 4.25, 14, 22), root, { position: [-8.2, 0, -7], material: solid, receiveShadow: true });
  mesh(wall(0.3, 4.25, 14, 23), root, { position: [7.9, 0, -7], material: solid, receiveShadow: true });

  // 顶上的荧光灯带
  const ceilingLights: THREE.PointLight[] = [];
  const ceilingPanels: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i += 1) {
    const z = -5.0 + i * 3.0;
    const panel = mesh(keep(slab([20, 1, 2], 0xffffff, { voxel: 0.25, anchor: "min" })), root, {
      position: [-2.5, 3.85, z],
      material: glowMat(0xdfeaff),
    });
    ceilingPanels.push(panel);
    const light = new THREE.PointLight(0xd6e6ff, 46, 22, 2);
    light.position.set(0, 3.7, z);
    if (i === 1) {
      light.castShadow = true;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.bias = -0.004;
    }
    root.add(light);
    ceilingLights.push(light);
  }
  root.add(new THREE.HemisphereLight(0x8595a8, 0x24262a, 1.0));

  // ── 数控机床 ────────────────────────────────────────────────────────
  const lathe = new THREE.Group();
  lathe.position.set(0, 0, -1.4);
  root.add(lathe);
  mesh(keep(slab([16, 4, 8], MACHINE, { voxel: 0.16, anchor: "min", grain: 0.06, seed: 31 })), lathe, {
    position: [-1.28, 0, -0.64],
    material: metal,
    castShadow: true,
    receiveShadow: true,
  });
  mesh(keep(slab([18, 1, 9], MACHINE_LIT, { voxel: 0.16, anchor: "min", grain: 0.05, seed: 32 })), lathe, {
    position: [-1.44, 0.64, -0.72],
    material: metal,
    castShadow: true,
  });
  // 床头箱
  mesh(keep(slab([6, 7, 8], MACHINE_LIT, { voxel: 0.16, anchor: "min", grain: 0.05, seed: 33 })), lathe, {
    position: [-1.4, 0.8, -0.64],
    material: metal,
    castShadow: true,
  });
  // 尾座
  mesh(keep(slab([4, 5, 6], MACHINE, { voxel: 0.16, anchor: "min", grain: 0.05, seed: 34 })), lathe, {
    position: [0.86, 0.8, -0.48],
    material: metal,
    castShadow: true,
  });

  const chuck = new THREE.Group();
  chuck.position.set(-0.42, 1.36, 0);
  lathe.add(chuck);
  mesh(
    keep(
      buildVoxelGeometry(
        {
          size: [3, 10, 10],
          at(x, y, z) {
            const dy = y + 0.5 - 5;
            const dz = z + 0.5 - 5;
            const d = Math.sqrt(dy * dy + dz * dz);
            if (d > 5) return null;
            const jaw = Math.abs(Math.atan2(dy, dz) % (Math.PI / 1.5)) < 0.28 && d > 2.6;
            return grainy(jaw ? 0x8d949c : 0x5a626c, x, y, z, 0.09, 41);
          },
        },
        { voxel: 0.09, anchor: "center" },
      ),
    ),
    chuck,
    { material: metal, castShadow: true },
  );
  const billet = new THREE.Mesh(keep(meteoriteGeometry(4, 0.026, 77)), voxMat("meteorite", { roughness: 0.72, metalness: 0.28 }));
  billet.position.set(0.24, 0, 0);
  billet.rotation.z = Math.PI / 2;
  billet.castShadow = true;
  chuck.add(billet);

  const toolPost = new THREE.Group();
  toolPost.position.set(0.1, 1.05, -0.42);
  lathe.add(toolPost);
  mesh(keep(slab([4, 4, 4], 0x6a727c, { voxel: 0.09, anchor: "min", grain: 0.06, seed: 43 })), toolPost, {
    position: [-0.18, 0, -0.18],
    material: metal,
    castShadow: true,
  });
  const cutter = mesh(keep(slab([2, 2, 7], 0xb9bfc6, {
    voxel: 0.055,
    anchor: "min",
    grain: 0.05,
    seed: 44,
    carve: (x, y, z) => (z > 5 ? 0x2a2d31 : undefined),
  })), toolPost, { position: [-0.055, 0.28, -0.05], material: metal, castShadow: true });

  // 切屑火花
  const sparkCount = 160;
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkSeeds = rng(97);
  const sparkData: Array<[number, number, number]> = [];
  for (let i = 0; i < sparkCount; i += 1) {
    sparkData.push([sparkSeeds(), sparkSeeds(), sparkSeeds()]);
  }
  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeometry.userData.data = sparkData;
  owned.push(sparkGeometry);
  const sparks = new THREE.Points(
    sparkGeometry,
    new THREE.PointsMaterial({
      color: 0xffc477,
      size: 0.022,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  sparks.frustumCulled = false;
  sparks.visible = false;
  lathe.add(sparks);

  // 控制面板
  const console_ = new THREE.Group();
  console_.position.set(1.62, 0, -1.1);
  console_.rotation.y = -0.5;
  root.add(console_);
  mesh(keep(slab([5, 9, 3], MACHINE, { voxel: 0.16, anchor: "min", grain: 0.05, seed: 51 })), console_, {
    position: [-0.4, 0, -0.24],
    material: metal,
    castShadow: true,
  });
  const screen = mesh(keep(slab([4, 3, 1], 0x2f6a5c, { voxel: 0.14, anchor: "min" })), console_, {
    position: [-0.28, 1.06, 0.26],
    material: glowMat(0x54d7a8, 0.92),
  });
  screen.rotation.x = -0.25;

  // 工具柜和料架
  for (let i = 0; i < 3; i += 1) {
    mesh(keep(slab([5, 12, 4], 0x4a5259, { voxel: 0.16, anchor: "min", grain: 0.07, seed: 61 + i })), root, {
      position: [-6.4 + i * 0.85, 0, -6.6],
      material: metal,
      castShadow: true,
      receiveShadow: true,
    });
  }
  mesh(keep(slab([14, 1, 6], 0x6d7278, { voxel: 0.16, anchor: "min", grain: 0.06, seed: 71 })), root, {
    position: [-4.6, 0.9, 0.4],
    material: metal,
    castShadow: true,
    receiveShadow: true,
  });
  for (const dx of [-4.5, -2.5] as const) {
    mesh(keep(slab([1, 6, 1], 0x4a5259, { voxel: 0.16, anchor: "min", grain: 0.06, seed: 72 })), root, {
      position: [dx, 0, 0.55],
      material: metal,
    });
    mesh(keep(slab([1, 6, 1], 0x4a5259, { voxel: 0.16, anchor: "min", grain: 0.06, seed: 73 })), root, {
      position: [dx, 0, 1.15],
      material: metal,
    });
  }

  // 三十六段陨石圆柱，切完之后摆在料台上
  const slugs = new THREE.Group();
  slugs.position.set(-4.0, 1.06, 0.68);
  slugs.visible = false;
  root.add(slugs);
  const slugGeometry = keep(meteoriteSlugGeometry(0.028));
  const slugMaterial = voxMat("meteorite", { roughness: 0.72, metalness: 0.28 });
  for (let i = 0; i < 36; i += 1) {
    const item = new THREE.Mesh(slugGeometry, slugMaterial);
    item.position.set((i % 12) * 0.075, 0.055, Math.floor(i / 12) * 0.085);
    item.castShadow = true;
    slugs.add(item);
  }

  root.visible = false;
  return {
    root,
    chuck,
    toolPost,
    billet,
    sparks,
    ceilingLights,
    ceilingPanels,
    screen,
    slugs,
    cutter,
    dispose() {
      for (const geometry of owned) geometry.dispose();
    },
  };
}

export interface Basement {
  root: THREE.Group;
  bulb: THREE.Object3D;
  bulbLight: THREE.PointLight;
  /** 桌上排开的三十六发子弹。 */
  rounds: THREE.Group;
  /** 墙角那个布包，里面裹着牛肉。 */
  bundle: THREE.Group;
  bundleOpen: THREE.Group;
  /** 摊开的布 —— 航天服材料，有夹层。 */
  fabric: THREE.Group;
  /** 掌心里的碎石。 */
  gravel: THREE.Object3D;
  /** 枪口闪光的光源和亮块。 */
  flashLight: THREE.PointLight;
  flashQuad: THREE.Mesh;
  smoke: THREE.Points;
  holes: THREE.Group;
  dispose(): void;
}

export function buildBasement(): Basement {
  const root = new THREE.Group();
  const owned: THREE.BufferGeometry[] = [];
  const keep = <G extends THREE.BufferGeometry>(g: G): G => {
    owned.push(g);
    return g;
  };
  const solid = voxMat("cellar-solid", { roughness: 1 });
  const metal = voxMat("cellar-metal", { roughness: 0.6, metalness: 0.3 });

  // 一间低矮的水泥房间，什么也没有
  const roomGeometry = keep(
    buildVoxelGeometry(
      {
        size: [32, 15, 26],
        at(x, y, z) {
          const inside = x > 1 && x < 30 && z > 1 && z < 24 && y > 0 && y < 14;
          if (inside) return null;
          const damp = hash3(Math.floor(x / 3), Math.floor(y / 3), Math.floor(z / 3), 5);
          if (y === 0) return grainy(mixHex(0x4a4b48, 0x33342f, damp), x, y, z, 0.09, 7);
          if (y >= 14) return grainy(0x2c2d2b, x, y, z, 0.08, 8);
          const band = y < 4 ? shade(CONCRETE_DARK, 0.9) : CONCRETE_DARK;
          return grainy(mixHex(band, 0x62615a, damp * 0.6), x, y, z, 0.1, 9);
        },
      },
      { voxel: 0.2, anchor: "min" },
    ),
  );
  mesh(roomGeometry, root, { position: [-3.2, -0.2, -2.6], material: solid, receiveShadow: true, castShadow: true });

  // 墙上的一排旧管子
  for (let i = 0; i < 3; i += 1) {
    mesh(keep(slab([1, 1, 30], 0x5c534a, { voxel: 0.12, anchor: "min", grain: 0.12, seed: 21 + i })), root, {
      position: [-2.85, 2.15 + i * 0.16, -2.2],
      material: metal,
    });
  }

  // 一只吊着的灯泡
  const bulb = new THREE.Group();
  bulb.position.set(0, 2.62, -0.55);
  root.add(bulb);
  mesh(keep(slab([1, 8, 1], 0x2a2622, { voxel: 0.05, anchor: "min" })), bulb, {
    position: [-0.025, -0.4, -0.025],
    material: solid,
  });
  mesh(keep(slab([3, 3, 3], 0xfff0cf, { voxel: 0.045, anchor: "center" })), bulb, {
    position: [0, -0.46, 0],
    material: glowMat(0xfff1d2),
  });
  const bulbLight = new THREE.PointLight(0xffc98c, 9, 7.5, 2);
  bulbLight.position.set(0, -0.48, 0);
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(1024, 1024);
  bulbLight.shadow.bias = -0.005;
  bulb.add(bulbLight);
  // 只有一只灯泡的房间，全靠一点点墙面反射把剪影从纯黑里拉回来。
  root.add(new THREE.HemisphereLight(0x4c4034, 0x17140f, 0.8));

  // 小桌
  const table = new THREE.Group();
  table.position.set(0, 0, -0.9);
  root.add(table);
  mesh(keep(slab([14, 1, 8], 0x5d4a35, { voxel: 0.09, anchor: "min", grain: 0.11, seed: 31 })), table, {
    position: [-0.63, 0.74, -0.36],
    material: voxMat("cellar-wood", { roughness: 0.95 }),
    castShadow: true,
    receiveShadow: true,
  });
  for (const [dx, dz] of [[-0.58, -0.31], [0.53, -0.31], [-0.58, 0.28], [0.53, 0.28]] as const) {
    mesh(keep(slab([1, 8, 1], 0x3d3226, { voxel: 0.09, anchor: "min", grain: 0.09, seed: 32 })), table, {
      position: [dx, 0, dz],
      material: voxMat("cellar-wood", { roughness: 0.95 }),
      castShadow: true,
    });
  }

  // 三十六发子弹，立在桌上排成三排
  const rounds = new THREE.Group();
  rounds.position.set(-0.5, 0.83, -0.2);
  table.add(rounds);
  const roundGeometry = keep(meteoriteRoundGeometry(0.026, true));
  const plainGeometry = keep(meteoriteRoundGeometry(0.026, false));
  const brassMat = voxMat("cellar-round", { roughness: 0.6, metalness: 0.3 });
  for (let i = 0; i < 36; i += 1) {
    const item = new THREE.Mesh(i < 18 ? roundGeometry : plainGeometry, brassMat);
    item.position.set((i % 12) * 0.085, 0.09, Math.floor(i / 12) * 0.1);
    item.castShadow = true;
    item.userData.index = i;
    rounds.add(item);
  }

  // 墙角的布包
  const bundle = new THREE.Group();
  bundle.position.set(-2.3, 0, -2.05);
  root.add(bundle);
  const clothMat = voxMat("cellar-cloth", { roughness: 1 });
  mesh(keep(slab([9, 7, 8], 0xb9b6ac, {
    voxel: 0.075,
    anchor: "min",
    grain: 0.13,
    seed: 41,
    carve: (x, y) => (y === 6 && (x < 2 || x > 6) ? null : undefined),
  })), bundle, { position: [-0.34, 0, -0.3], material: clothMat, castShadow: true, receiveShadow: true });

  const holes = new THREE.Group();
  holes.position.set(0, 0, 0.01);
  bundle.add(holes);
  const holeGeometry = keep(slab([1, 1, 1], 0x14100e, { voxel: 0.05, anchor: "center" }));
  for (const [x, y] of [[-0.06, 0.34], [0.07, 0.28], [-0.01, 0.22], [0.12, 0.38]] as const) {
    const hole = new THREE.Mesh(holeGeometry, voxMat("cellar-hole", { roughness: 1 }));
    hole.position.set(x, y, 0.3);
    hole.visible = false;
    holes.add(hole);
  }

  // 打开之后：牛肉、被剖开的夹层布
  // 割开之后，他把布包搬到桌上打开：牛肉、被剖开的夹层布
  const bundleOpen = new THREE.Group();
  bundleOpen.position.set(-0.28, 0.86, -0.98);
  bundleOpen.visible = false;
  root.add(bundleOpen);
  const beef = new THREE.Mesh(keep(beefGeometry(0.05)), voxMat("cellar-beef", { roughness: 0.85 }));
  beef.position.set(0, 0.07, 0);
  beef.castShadow = true;
  bundleOpen.add(beef);

  // 摊开的航天服布料：外层、保温海绵、塑胶管道
  const fabric = new THREE.Group();
  fabric.position.set(0.42, 0.87, 0.06);
  fabric.visible = false;
  table.add(fabric);
  mesh(keep(buildVoxelGeometry(
    {
      // 一块被剖开的航天服布料：外层掀起一半，露出夹层里的保温海绵和塑胶管道
      size: [22, 4, 16],
      at(x, y, z) {
        if (y === 0) return grainy(0xd6d3c8, x, y, z, 0.07, 51);            // 外层
        if (y === 1) return grainy(0xe4b98d, x, y, z, 0.12, 52);            // 保温海绵
        if (y === 2) return z % 4 === 1 ? grainy(0x4f6f86, x, y, z, 0.08, 53) : null; // 管道
        return z >= 9 ? grainy(0xe2dfd4, x, y, z, 0.06, 54) : null;         // 掀起来的那半
      },
    },
    { voxel: 0.022, anchor: "center" },
  )), fabric, { material: clothMat, castShadow: true, receiveShadow: true });

  // 掌心的碎石
  const gravel = new THREE.Mesh(keep(gravelGeometry(0.011)), voxMat("meteorite", { roughness: 0.72, metalness: 0.28 }));
  gravel.visible = false;
  root.add(gravel);

  // 枪口闪光
  const flashLight = new THREE.PointLight(0xffd9a0, 0, 9, 2);
  flashLight.position.set(0.35, 1.25, 0.1);
  root.add(flashLight);
  const flashQuad = mesh(keep(slab([3, 3, 3], 0xfff2d0, { voxel: 0.035, anchor: "center" })), root, {
    position: [0.35, 1.25, 0.1],
    material: glowMat(0xfff4dc, 1),
  });
  flashQuad.visible = false;

  // 硝烟
  const smokeCount = 90;
  const smokeGeometry = new THREE.BufferGeometry();
  smokeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(smokeCount * 3), 3));
  owned.push(smokeGeometry);
  const smokeSeed = rng(133);
  smokeGeometry.userData.data = Array.from({ length: smokeCount }, () => [smokeSeed(), smokeSeed(), smokeSeed()]);
  const smoke = new THREE.Points(
    smokeGeometry,
    new THREE.PointsMaterial({
      color: 0xb9b2a4,
      size: 0.075,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    }),
  );
  smoke.frustumCulled = false;
  smoke.visible = false;
  root.add(smoke);

  root.visible = false;
  return {
    root,
    bulb,
    bulbLight,
    rounds,
    bundle,
    bundleOpen,
    fabric,
    gravel,
    flashLight,
    flashQuad,
    smoke,
    holes,
    dispose() {
      for (const geometry of owned) geometry.dispose();
    },
  };
}

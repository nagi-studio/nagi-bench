import * as THREE from "three";
import {
  applyPose,
  createFigure,
  createSkin,
  float,
  idle,
  lerpPose,
  voxelMaterial,
  voxelModel,
} from "@agentbench/voxel-kit";

const PARTS = ["head", "torso", "armR", "armL", "legR", "legL"];

function bodySheet({ tone = "#b98262", hair = "#202326", age = 0, closed = false, seed = 0 } = {}) {
  return createSkin((p) => {
    for (const part of PARTS) p.fill(part, "all", tone);
    p.fill("head", "top", hair);
    p.fill("head", "back", hair);
    p.rect("head", "front", 0, 0, 8, 2, hair);
    p.rect("head", "left", 0, 0, 8, 3, hair);
    p.rect("head", "right", 0, 0, 8, 3, hair);
    if (age > 0) {
      p.rect("head", "left", 1, 2, 4, 2, "#88857d");
      p.rect("head", "right", 3, 2, 4, 2, "#88857d");
      p.px("head", "front", 0, 2, "#9b9a91");
      p.px("head", "front", 7, 2, "#9b9a91");
    }
    p.rect("head", "front", 1, 2, 2, 1, "#4a3029");
    p.rect("head", "front", 5, 2, 2, 1, "#4a3029");
    if (closed) {
      p.rect("head", "front", 1, 3, 2, 1, "#382a27");
      p.rect("head", "front", 5, 3, 2, 1, "#382a27");
    } else {
      p.rect("head", "front", 1, 3, 2, 1, "#e5ded2");
      p.rect("head", "front", 5, 3, 2, 1, "#e5ded2");
      p.px("head", "front", 2, 3, "#172127");
      p.px("head", "front", 5, 3, "#172127");
    }
    p.px("head", "front", 4, 4, "#9e674f");
    p.rect("head", "front", 3, 6, 2, 1, age ? "#66483e" : "#58352f");
    if (age) {
      p.px("head", "front", 1, 5, "#9f6d55");
      p.px("head", "front", 6, 5, "#9f6d55");
      p.rect("head", "front", 2, 7, 4, 1, "#a8755c");
    }
    if (seed % 2) p.px("head", "front", 6, 4, "#8f5947");
    p.grain("head", "all", 0.035, 17 + seed);
  });
}

function uniformSheet(colour = "#35483f") {
  return createSkin((p) => {
    p.fill("torso", "all", colour).grain("torso", "all", 0.09, 4);
    p.fill("armR", "all", colour).fill("armL", "all", colour);
    p.fill("legR", "all", "#293832").fill("legL", "all", "#293832");
    p.rect("torso", "front", 3, 0, 1, 12, "#1f302b");
    p.rect("torso", "front", 0, 3, 3, 4, "#405449");
    p.rect("torso", "front", 5, 3, 3, 4, "#405449");
    p.px("torso", "front", 1, 1, "#d5b36a");
    p.px("torso", "front", 6, 1, "#a64738");
    p.rect("torso", "front", 0, 10, 8, 1, "#1c2926");
    p.rect("armR", "front", 1, 2, 2, 2, "#a94a3d");
    p.rect("armL", "front", 1, 2, 2, 2, "#d2b36d");
    p.rect("legR", "front", 0, 9, 4, 3, "#202b29");
    p.rect("legL", "front", 0, 9, 4, 3, "#202b29");
    p.fill("head", "top", colour);
    p.rect("head", "front", 0, 0, 8, 1, colour);
  }, { transparent: true });
}

function collectorSheet() {
  return createSkin((p) => {
    p.fill("torso", "all", "#705142").grain("torso", "all", 0.12, 7);
    p.fill("armR", "all", "#705142").fill("armL", "all", "#705142");
    p.fill("legR", "all", "#4b4a45").fill("legL", "all", "#4b4a45");
    p.rect("torso", "front", 3, 0, 2, 10, "#c1ae8e");
    p.rect("torso", "front", 0, 3, 2, 4, "#624537");
    p.rect("torso", "front", 6, 3, 2, 4, "#624537");
    p.px("torso", "front", 2, 6, "#c9a45f");
    p.px("torso", "front", 6, 6, "#c9a45f");
    p.rect("legR", "front", 0, 10, 4, 2, "#302d2b");
    p.rect("legL", "front", 0, 10, 4, 2, "#302d2b");
  }, { transparent: true });
}

function suitSheet(accent = "#b65b3d", visor = "clear", damaged = false) {
  return createSkin((p) => {
    for (const part of ["torso", "armR", "armL", "legR", "legL"]) {
      p.fill(part, "all", "#b9c1bf").grain(part, "all", 0.055, 12);
    }
    p.fill("head", "all", "#d4d8d3");
    p.fill("head", "top", "#8e999b");
    p.fill("head", "back", "#778487");
    p.rect("head", "left", 1, 1, 6, 6, "#25343b");
    p.rect("head", "right", 1, 1, 6, 6, "#25343b");
    if (visor === "clear" && !damaged) {
      p.erase("head", "front", 1, 1, 6, 6);
      p.rect("head", "front", 1, 1, 6, 1, "rgba(164,196,204,0.38)");
    } else {
      p.rect("head", "front", 1, 1, 6, 6, "#1c303a");
      p.rect("head", "front", 2, 2, 4, 1, "#4d6870");
      p.px("head", "front", 2, 3, "#6f8588");
    }
    p.rect("torso", "front", 1, 2, 6, 5, "#69787b");
    p.rect("torso", "front", 2, 3, 4, 2, "#263b42");
    p.px("torso", "front", 2, 6, "#7bc2bd");
    p.px("torso", "front", 4, 6, accent);
    p.px("torso", "front", 6, 6, "#d9bb6d");
    p.rect("torso", "front", 0, 9, 8, 2, "#7f8b8d");
    p.rect("torso", "back", 2, 2, 4, 7, "#879496");
    p.rect("armR", "front", 0, 3, 4, 2, accent);
    p.rect("armL", "front", 0, 3, 4, 2, accent);
    p.rect("legR", "front", 0, 5, 4, 2, "#7f8d90");
    p.rect("legL", "front", 0, 5, 4, 2, "#7f8d90");
    p.rect("legR", "front", 0, 10, 4, 2, "#49575c");
    p.rect("legL", "front", 0, 10, 4, 2, "#49575c");
    if (damaged) {
      const cracks = [[4, 2], [4, 3], [3, 4], [2, 4], [5, 4], [6, 5], [3, 2], [2, 1], [5, 6]];
      for (const [x, y] of cracks) p.px("head", "front", x, y, "#c2d6d4");
      p.px("head", "front", 3, 5, "#6f3433");
      p.px("head", "front", 5, 3, "#6f3433");
    }
  }, { transparent: true });
}

export function createCharacter(kind = "uniform", options = {}) {
  const body = bodySheet(options);
  const bodyClosed = options.closed === undefined ? bodySheet({ ...options, closed: true }) : null;
  let clothes;
  let suitClear;
  let suitDark;
  let suitDamaged;
  if (kind === "collector") clothes = collectorSheet();
  else if (kind === "suit") {
    suitClear = suitSheet(options.accent, "clear");
    suitDark = suitSheet(options.accent, "dark");
    suitDamaged = suitSheet(options.accent, "dark", true);
    clothes = options.visor === "dark" ? suitDark : suitClear;
  } else clothes = uniformSheet(options.colour);

  const figure = createFigure({
    body: body.texture,
    clothes: clothes.texture,
    heightM: options.heightM ?? 1.8,
    arm: options.arm ?? "classic",
    castShadow: options.castShadow ?? true,
  });
  figure.root.name = options.name ?? `character-${kind}`;
  let visorMode = options.visor === "dark" ? "dark" : "clear";
  let eyesClosed = false;
  return {
    figure,
    body,
    bodyClosed,
    clothes,
    suitClear,
    suitDark,
    suitDamaged,
    setVisor(mode) {
      if (kind !== "suit" || visorMode === mode) return;
      visorMode = mode;
      figure.setClothes((mode === "clear" ? suitClear : mode === "damaged" ? suitDamaged : suitDark).texture);
    },
    setEyesClosed(closed) {
      if (!bodyClosed || eyesClosed === closed) return;
      eyesClosed = closed;
      figure.setBody(closed ? bodyClosed.texture : body.texture);
    },
  };
}

export function attachPack(character, accent = 0x76868a) {
  const geometry = voxelModel({
    palette: { "#": accent, o: 0x35454c, r: 0x9b4f3d },
    layers: [
      ["######", "#oooo#", "#o##o#", "#o##o#", "#oooo#", "###r##"],
      ["######", "#oooo#", "#o##o#", "#o##o#", "#oooo#", "######"],
    ],
    axis: "z",
    voxel: 0.42,
  });
  const pack = new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.72, metalness: 0.35 }));
  pack.position.set(0, 0.2, -0.45);
  character.figure.anchors.back.add(pack);
  return pack;
}

export function createPistol({ scope = true } = {}) {
  const group = new THREE.Group();
  const side = [
    "..............",
    "..#########...",
    ".###########..",
    ".###########..",
    "...###........",
    "...###........",
    "...##.........",
    "...##.........",
  ];
  const geometry = voxelModel({
    palette: { "#": 0x303a40 },
    layers: [side, side, side],
    axis: "x",
    voxel: 0.3,
  });
  const gun = new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.32, metalness: 0.82 }));
  gun.position.set(0, -0.25, 0.25);
  group.add(gun);

  const scopeGeometry = voxelModel({
    palette: { "#": 0x47545a, g: 0x80989d },
    layers: [
      ["g####g"],
      ["######"],
      ["g####g"],
    ],
    axis: "z",
    voxel: 0.26,
  });
  const sight = new THREE.Mesh(scopeGeometry, voxelMaterial({ roughness: 0.25, metalness: 0.8 }));
  sight.rotation.x = Math.PI / 2;
  sight.position.set(0, 0.65, 0.2);
  sight.visible = scope;
  group.add(sight);

  const flashMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 });
  const flash = new THREE.Mesh(voxelModel({
    palette: { "#": 0xffd791, o: 0xff7b32 },
    layers: [[
      "..#..",
      ".ooo.",
      "#ooo#",
      ".ooo.",
      "..#..",
    ]],
    axis: "z",
    voxel: 0.24,
  }), flashMaterial);
  flash.position.set(0, 0.1, 2.15);
  flash.visible = false;
  group.add(flash);
  const light = new THREE.PointLight(0xff9b4a, 0, 4, 2);
  light.position.copy(flash.position);
  group.add(light);
  return { group, flash, light, sight };
}

export function createBriefcase() {
  const mesh = new THREE.Mesh(voxelModel({
    palette: { "#": 0x303735, g: 0xb3985e },
    layers: [
      ["..gg..", "......", "######", "#....#", "#....#", "######"],
      ["..gg..", "......", "######", "#....#", "#....#", "######"],
    ],
    axis: "z",
    voxel: 0.42,
  }), voxelMaterial({ roughness: 0.68, metalness: 0.18 }));
  mesh.position.set(0, -0.8, 0);
  return mesh;
}

export function createCup() {
  const cup = new THREE.Mesh(voxelModel({
    palette: { "#": 0xb7aa8c, t: 0x59432d },
    layers: [
      ["####", "#tt#", "#..#", "####"],
      ["####", "#tt#", "####", "...."],
    ],
    axis: "z",
    voxel: 0.22,
  }), voxelMaterial({ roughness: 0.48 }));
  cup.position.set(0, -0.15, 0.35);
  return cup;
}

export function createPhone() {
  const phone = new THREE.Mesh(voxelModel({
    palette: { "#": 0x222a2c, g: 0x789e9c },
    layers: [["##", "gg", "gg", "gg", "##"], ["##", "gg", "gg", "gg", "##"]],
    axis: "z",
    voxel: 0.2,
  }), voxelMaterial({ roughness: 0.3, metalness: 0.5, emissive: 0x25433f, emissiveIntensity: 0.5 }));
  phone.position.set(0, 0, 0.3);
  return phone;
}

export function groundedPose(time, variant = 0) {
  const base = idle(time + variant);
  return {
    ...base,
    neck: [Math.sin(time * 0.45 + variant) * 0.035, Math.sin(time * 0.31 + variant) * 0.08, 0],
    armR: [-0.08 + Math.sin(time * 0.7) * 0.025, 0, 0.07],
    armL: [0.05, 0, -0.07],
    legR: [0.015, 0, 0.015],
    legL: [-0.015, 0, -0.015],
  };
}

export function weightlessPose(time, aimWeight = 0, variant = 0) {
  const drift = float(time + variant);
  const aiming = {
    hips: [-0.12, 0, 0.03],
    neck: [0.06, 0, 0],
    armR: [-Math.PI / 2, 0, 0.04],
    armL: [-1.32, 0, -0.32],
    legR: [-0.36, 0, 0.1],
    legL: [-0.18, 0, -0.12],
  };
  return lerpPose(drift, aiming, aimWeight);
}

export function pose(character, value) {
  applyPose(character.figure, value);
}

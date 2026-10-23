import * as THREE from "three";
import {
  createSkin,
  createFigure,
  buildVoxelGeometry,
  voxelSphere,
  voxelModel,
  voxelMaterial,
} from "@agentbench/voxel-kit";

const faces = ["front", "back", "left", "right", "top", "bottom"];
const armParts = ["armR", "armL"];

function bareHands(paint) {
  for (const part of armParts) for (const face of faces) paint.erase(part, face, 0, 10, 4, 2);
}

export function makeBody({ tone = "#bd8c6c", hair = "#24282a", older = false, stern = false, variant = 0 } = {}) {
  return createSkin((paint) => {
    for (const part of ["head", "torso", "armR", "armL", "legR", "legL"]) paint.fill(part, "all", tone);
    paint.fill("head", "top", hair).fill("head", "back", hair);
    paint.fill("head", "left", hair).fill("head", "right", hair);
    paint.rect("head", "front", 0, 0, 8, older ? 2 : 2, hair);
    paint.rect("head", "front", 0, 1, 1, 3, hair).rect("head", "front", 7, 1, 1, 3, hair);
    const brow = older ? "#6e6b64" : hair;
    paint.rect("head", "front", 1, 2, 2, 1, brow).rect("head", "front", 5, 2, 2, 1, brow);
    if (stern) { paint.px("head", "front", 2, 2, tone); paint.px("head", "front", 5, 2, tone); }
    paint.rect("head", "front", 1, 3, 2, 1, "#e4ddd0").rect("head", "front", 5, 3, 2, 1, "#e4ddd0");
    paint.px("head", "front", variant % 2 ? 1 : 2, 3, "#20272a").px("head", "front", variant % 2 ? 5 : 6, 3, "#20272a");
    paint.px("head", "front", 4, 4, "#a56f58");
    paint.rect("head", "front", older ? 2 : 3, 6, older ? 4 : 2, 1, older ? "#8a786b" : "#784f46");
    if (older) {
      paint.px("head", "front", 1, 5, "#a87560").px("head", "front", 6, 5, "#a87560");
      paint.px("head", "front", 0, 2, "#b6b2a8").px("head", "front", 7, 2, "#b6b2a8");
    }
    paint.fill("torso", "all", tone).grain("head", "all", .045, 12 + variant);
  });
}

export function uniformSkin() {
  return createSkin((paint) => {
    paint.fill("torso", "all", "#24343b").fill("legR", "all", "#202c32").fill("legL", "all", "#202c32");
    paint.fill("armR", "all", "#293b42").fill("armL", "all", "#293b42");
    paint.rect("torso", "front", 3, 0, 1, 12, "#18262c").rect("torso", "front", 0, 0, 8, 2, "#33474d");
    paint.rect("torso", "front", 1, 1, 2, 1, "#c6b486").rect("torso", "front", 6, 1, 1, 2, "#8e3c32");
    paint.rect("torso", "front", 1, 6, 2, 2, "#2d4047").rect("torso", "front", 5, 6, 2, 2, "#2d4047");
    for (let y = 3; y < 11; y += 2) paint.px("torso", "front", 4, y, "#a59778");
    paint.rect("armL", "front", 0, 3, 4, 2, "#713c35");
    paint.rect("legR", "front", 0, 10, 4, 2, "#151e23").rect("legL", "front", 0, 10, 4, 2, "#151e23");
    bareHands(paint);
    paint.grain("torso", "all", .08, 21).grain("armR", "all", .07, 22).grain("armL", "all", .07, 23);
  }, { transparent: true });
}

export function collectorSkin() {
  return createSkin((paint) => {
    paint.fill("torso", "all", "#74513a").fill("armR", "all", "#806047").fill("armL", "all", "#806047");
    paint.fill("legR", "all", "#3d403a").fill("legL", "all", "#3d403a");
    paint.rect("torso", "front", 3, 0, 2, 12, "#b39a78").rect("torso", "front", 0, 0, 2, 4, "#8b6a4d").rect("torso", "front", 6, 0, 2, 4, "#8b6a4d");
    paint.rect("torso", "front", 0, 7, 2, 3, "#5f4434").rect("torso", "front", 6, 7, 2, 3, "#5f4434");
    paint.rect("legR", "front", 0, 10, 4, 2, "#292c29").rect("legL", "front", 0, 10, 4, 2, "#292c29");
    bareHands(paint); paint.grain("torso", "all", .11, 33).grain("armR", "all", .09, 34).grain("armL", "all", .09, 35);
  }, { transparent: true });
}

export function suitSkin({ clear = true, accent = "#b35d3e", gloveOff = false, cracked = false } = {}) {
  return createSkin((paint) => {
    for (const part of ["head", "torso", "armR", "armL", "legR", "legL"]) paint.fill(part, "all", "#d4d8d2");
    paint.fill("head", "top", "#e5e6dc").fill("head", "back", "#b8c1bd");
    if (cracked) {
      paint.fill("head", "front", "#34444a");
      const cracks = [[3,1],[3,2],[2,3],[4,3],[1,4],[5,4],[3,4],[3,5],[2,6],[4,6],[5,2],[6,1],[1,2]];
      cracks.forEach(([x,y]) => paint.px("head", "front", x, y, "#d9e5df"));
      paint.px("head", "front", 4, 5, "#844e47").px("head", "front", 5, 6, "#844e47");
    } else if (clear) {
      paint.erase("head", "front", 1, 1, 6, 6);
      paint.rect("head", "front", 1, 0, 6, 1, "#eef0e7");
      paint.rect("head", "front", 0, 1, 1, 6, "#a9b7b3").rect("head", "front", 7, 1, 1, 6, "#a9b7b3");
      paint.rect("head", "front", 1, 7, 6, 1, "#879894");
    } else {
      paint.rect("head", "front", 1, 1, 6, 5, "#354c55").rect("head", "front", 2, 1, 3, 1, "#a98d58");
      paint.rect("head", "front", 1, 6, 6, 1, "#1f3037");
    }
    paint.rect("torso", "front", 0, 0, 8, 2, "#b6c2bd").rect("torso", "front", 2, 2, 4, 5, "#e3e4da");
    paint.rect("torso", "front", 3, 3, 2, 2, "#465c5c").px("torso", "front", 3, 3, "#bc7451").px("torso", "front", 5, 4, "#7d9f91");
    paint.rect("torso", "front", 1, 0, 1, 12, accent).rect("torso", "front", 6, 0, 1, 12, accent);
    paint.rect("torso", "front", 0, 9, 8, 2, "#8e9d98").rect("torso", "back", 0, 4, 8, 4, "#a4b0aa");
    paint.rect("armL", "front", 0, 2, 4, 2, accent).rect("armR", "front", 0, 2, 4, 2, "#596e70");
    paint.rect("legR", "front", 0, 8, 4, 2, "#a9b5af").rect("legL", "front", 0, 8, 4, 2, "#a9b5af");
    paint.rect("legR", "front", 0, 10, 4, 2, "#566767").rect("legL", "front", 0, 10, 4, 2, "#566767");
    if (gloveOff) for (const face of faces) paint.rect("armR", face, 0, 9, 4, 3, "#4b5352");
    paint.grain("torso", "all", .045, 44).grain("armL", "all", .04, 45).grain("armR", "all", .04, 46);
  }, { transparent: true });
}

export function createCast() {
  const bodies = {
    zhang: makeBody({ tone: "#b98568", hair: "#202729", stern: true }),
    collector: makeBody({ tone: "#c79675", hair: "#676862", older: true, variant: 1 }),
    people: Array.from({ length: 6 }, (_, i) => makeBody({ tone: ["#c28f6e", "#a9755e", "#d0a080"][i % 3], hair: ["#2d2926", "#3e342c", "#1f282a"][i % 3], variant: i })),
  };
  const clothes = {
    uniform: uniformSkin(),
    collector: collectorSkin(),
    suitClear: suitSkin({ clear: true }),
    suitOpaque: suitSkin({ clear: false }),
    suitGloveOff: suitSkin({ clear: true, gloveOff: true }),
    suitCracked: suitSkin({ clear: true, cracked: true }),
    targets: ["#a84d3c", "#a8843f", "#5a7796"].map((accent) => ({ clear: suitSkin({ clear: true, accent }), opaque: suitSkin({ clear: false, accent }) })),
  };
  const figure = (body, clothing, heightM = 1.8, castShadow = true) => createFigure({ body, clothes: clothing, heightM, castShadow });
  return {
    bodies, clothes,
    zhangEarth: () => figure(bodies.zhang.texture, clothes.uniform.texture, 1.84),
    collector: () => figure(bodies.collector.texture, clothes.collector.texture, 1.73),
    zhangSpace: () => figure(bodies.zhang.texture, clothes.suitClear.texture, 1.84, false),
    attendee: (i, target = -1) => figure(bodies.people[i % bodies.people.length].texture, (target >= 0 ? clothes.targets[target].opaque : clothes.suitOpaque).texture, 1.72 + (i % 4) * .025, false),
  };
}

export function mesh(geometry, options = {}) {
  const { basic = false, castShadow = true, receiveShadow = true, ...parameters } = options;
  const material = basic
    ? new THREE.MeshBasicMaterial({ vertexColors: true, ...parameters })
    : voxelMaterial(parameters);
  const result = new THREE.Mesh(geometry, material);
  result.castShadow = castShadow;
  result.receiveShadow = receiveShadow;
  return result;
}

export function makeMeteor(seed = 1, radius = 3, voxel = .026) {
  const colours = [0x292c2b, 0x383a36, 0x494941, 0x242a2b, 0x575347];
  return mesh(voxelSphere(radius, (x, y, z) => colours[Math.abs((x * 13 + y * 7 + z * 17 + seed * 11)) % colours.length], { voxel }), { roughness: .72, metalness: .56 });
}

export function makeCylinder(colour = 0x444944, radius = 2, length = 7, voxel = .014) {
  const span = radius * 2 + 1;
  return mesh(buildVoxelGeometry({ size: [span, length, span], at(x, y, z) {
    const dx = x - radius, dz = z - radius;
    return dx * dx + dz * dz <= radius * radius + .5 ? ((y === length - 1 || y === 0) ? 0x666a60 : colour) : null;
  } }, { voxel }), { roughness: .58, metalness: .65 });
}

export function makePistol() {
  const side = [
    "..............",
    "..###########.",
    "..###########.",
    "..##..........",
    "..##..........",
    "..###.........",
    "...##.........",
    "...##.........",
  ];
  const middle = side.map((row, i) => i === 4 ? "..  .........." : row);
  const group = new THREE.Group();
  const gun = mesh(voxelModel({ palette: { "#": 0x252d30 }, layers: [side, middle, side], axis: "x", voxel: .3 }), { roughness: .35, metalness: .82 });
  group.add(gun);
  const slide = mesh(voxelModel({ palette: { "#": 0x59605d }, layers: [["..##########.."], ["..##########.."]], axis: "x", voxel: .3 }), { roughness: .3, metalness: .9 });
  slide.position.y = .28; group.add(slide);
  group.name = "2010 pistol";
  return group;
}

export function makeScope() {
  const layer = [".####....", "#########", "#########", ".####...."];
  return mesh(voxelModel({ palette: { "#": 0x303b3d }, layers: [layer, layer, layer], axis: "x", voxel: .2 }), { roughness: .3, metalness: .75 });
}

export function makeMug(colour = 0x879187) {
  return mesh(buildVoxelGeometry({ size: [5, 5, 5], at(x, y, z) {
    return y === 0 || x === 0 || x === 4 || z === 0 || z === 4 ? colour : null;
  } }, { voxel: .5 }), { roughness: .48, metalness: .1 });
}

export function makeMagnifier() {
  const group = new THREE.Group();
  const ring = mesh(buildVoxelGeometry({ size: [7, 7, 1], at(x, y) { const d = Math.hypot(x - 3, y - 3); return d > 1.8 && d < 3.4 ? 0x8b7956 : null; } }, { voxel: .4 }), { metalness: .7, roughness: .35 });
  const handle = mesh(voxelModel({ palette: { "#": 0x493b2d }, layers: [["#"], ["#"], ["#"], ["#"]], axis: "z", voxel: .4 }), { roughness: .8 });
  handle.position.set(0, -2.2, 0); group.add(ring, handle); return group;
}

export function makePhone() {
  const body = mesh(voxelModel({ palette: { "#": 0x202a2d, g: 0x73938c }, layers: [["###"], ["#g#"], ["#g#"], ["#g#"], ["###"]], axis: "z", voxel: .34 }), { roughness: .35, metalness: .35 });
  return body;
}

export function makeBackpack() {
  const layer = [".###.", "#####", "#####", "#####", "#####", ".#.#."];
  return mesh(voxelModel({ palette: { "#": 0x9faeaa }, layers: [layer, layer, layer], axis: "z", voxel: .65 }), { roughness: .75, metalness: .18 });
}

export function makeThrusterPlume() {
  const group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const plume = mesh(voxelModel({ palette: { "#": i < 2 ? 0xd9f3ef : 0x9dc8cc }, layers: [[i < 2 ? "##" : "#"]], axis: "z", voxel: .35 + i * .05 }), { basic: true, transparent: true, opacity: .48 - i * .065, depthWrite: false, castShadow: false, receiveShadow: false });
    plume.position.z = -.6 - i * .65; group.add(plume);
  }
  return group;
}

export function makeMuzzleFlash() {
  const flash = mesh(voxelModel({ palette: { w: 0xfff1b0, o: 0xe5a14e }, layers: [["..w..", ".www.", "wwoww", ".www.", "..w.."]], axis: "z", voxel: .32 }), { basic: true, transparent: true, opacity: .95, depthWrite: false, castShadow: false, receiveShadow: false });
  flash.visible = false; return flash;
}

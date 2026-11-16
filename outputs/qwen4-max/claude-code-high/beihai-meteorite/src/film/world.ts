import * as THREE from "three";
import { applyPose, idle, float, buildVoxelGeometry, type Figure } from "@agentbench/voxel-kit";
import { buildHutong, buildRoom, buildWorkshop, buildBasement, type HutongSet, type RoomSet, type WorkshopSet, type BasementSet } from "./sets";
import { buildSpace, type SpaceSet, PHOTO_CENTER } from "./space";
import { makeZhang, makeCollector, makeAttendee, thrusterPack, locatorProp, pistolProp, scopeProp, teacupProp, magnifierProp, voxelMaterial, type CastMember } from "./cast";

export type SetName = "hutong" | "room" | "workshop" | "basement" | "space";

export interface ColdOpen { group: THREE.Group; meteorite: THREE.Mesh; trail: THREE.Mesh; }

function buildColdOpen(): ColdOpen {
  const group = new THREE.Group();
  group.name = "coldOpen";
  const geo = new THREE.BufferGeometry();
  const n = 900, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    p[i * 3] = (Math.random() - 0.5) * 200;
    p[i * 3 + 1] = (Math.random() - 0.5) * 120;
    p[i * 3 + 2] = -40 - Math.random() * 160;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcfd8e8, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, depthWrite: false })));
  group.add(new THREE.AmbientLight(0x8a90a0, 0.7));
  const meteorite = new THREE.Mesh(
    buildVoxelGeometry({ size: [3, 3, 3], at: (x, y, z) => (x + y + z) % 2 === 0 ? 0x6a6f78 : 0x3a3d42 }, { voxel: 0.5, anchor: "center" }),
    voxelMaterial({ emissive: 0xff8a4a, emissiveIntensity: 0.6, roughness: 0.7 }),
  );
  group.add(meteorite);
  const trail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 16),
    new THREE.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(trail);
  group.visible = false;
  return { group, meteorite, trail };
}

export interface ZhangRig {
  figure: Figure;
  uniform: THREE.Texture;
  suitGold: THREE.Texture;
  suitClear: THREE.Texture;
  pistol: THREE.Mesh;
  scope: THREE.Mesh;
  cup: THREE.Mesh;
  pack: THREE.Mesh;
  flash: THREE.Mesh;
  flashLight: THREE.PointLight;
}

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  sets: Record<SetName, THREE.Group>;
  coldOpen: ColdOpen;
  hutong: HutongSet;
  room: RoomSet;
  workshop: WorkshopSet;
  basement: BasementSet;
  space: SpaceSet;
  zhang: ZhangRig;
  collector: Figure;
  collectorProps: { magnifier: THREE.Mesh; cup: THREE.Mesh };
  attendees: CastMember[];
  photographer: CastMember;
  targetIdx: number[];
  hitIdx: number[];
  locator: THREE.Mesh;
  // scratch
  _v: THREE.Vector3;
}

export function buildWorld(): FilmContext {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05060c);
  const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.05, 4000);
  camera.position.set(0, 1.6, 5);

  const hutong = buildHutong();
  const room = buildRoom();
  const workshop = buildWorkshop();
  const basement = buildBasement();
  const space = buildSpace();
  const coldOpen = buildColdOpen();
  scene.add(coldOpen.group);

  const sets: Record<SetName, THREE.Group> = {
    hutong: hutong.group, room: room.group, workshop: workshop.group, basement: basement.group, space: space.group,
  };
  for (const g of Object.values(sets)) { g.visible = false; scene.add(g); }

  /* ---- Zhang (top-level so he can move between sets) ---- */
  const z = makeZhang();
  const pistol = new THREE.Mesh(pistolProp(), voxelMaterial({ roughness: 0.5, metalness: 0.5 }));
  pistol.visible = false;
  z.figure.anchors.handR.add(pistol);
  const scope = new THREE.Mesh(scopeProp(), voxelMaterial({ roughness: 0.4, metalness: 0.5 }));
  scope.visible = false;
  z.figure.anchors.handR.add(scope);
  const cup = new THREE.Mesh(teacupProp(), voxelMaterial());
  cup.visible = false;
  z.figure.anchors.handR.add(cup);
  const pack = new THREE.Mesh(thrusterPack(), voxelMaterial());
  pack.position.set(-1.5, 0, -1);
  pack.visible = false;
  z.figure.anchors.back.add(pack);
  // muzzle flash at the pistol barrel (+Z), in figure px units
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4),
    new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  flash.position.set(0, 0.9, 3.3);
  flash.visible = false;
  pistol.add(flash);
  const flashLight = new THREE.PointLight(0xffd080, 0, 30, 2);
  flashLight.position.set(0, 0.9, 3.3);
  pistol.add(flashLight);
  scene.add(z.figure.root);
  z.figure.root.visible = false;

  const zhang: ZhangRig = { figure: z.figure, uniform: z.uniform, suitGold: z.suitGold, suitClear: z.suitClear, pistol, scope, cup, pack, flash, flashLight };

  /* ---- Collector (lives in the room) ---- */
  const collector = makeCollector();
  collector.root.position.set(2.4, 0, 1.9);
  collector.root.rotation.y = Math.PI; // face into the room (-Z toward bench front)
  const magnifier = new THREE.Mesh(magnifierProp(), voxelMaterial());
  magnifier.visible = false;
  collector.anchors.handR.add(magnifier);
  const collectorCup = new THREE.Mesh(teacupProp(), voxelMaterial());
  collectorCup.visible = false;
  collector.anchors.handL.add(collectorCup);
  room.group.add(collector.root);
  const collectorProps = { magnifier, cup: collectorCup };

  /* ---- Conference attendees + photographer (live in space) ---- */
  const attendees: CastMember[] = [];
  const targetIdx = [3, 4, 5];
  const hitIdx = [3, 4, 5, 12, 21];
  const cx = PHOTO_CENTER.x, cy = PHOTO_CENTER.y, cz = PHOTO_CENTER.z;
  let idx = 0;
  const rows = [
    { n: 9, z: cz + 4, y: cy },
    { n: 10, z: cz, y: cy + 3.5 },
    { n: 11, z: cz - 4, y: cy + 7 },
  ];
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const isTarget = targetIdx.includes(idx);
      const member = makeAttendee(idx, isTarget);
      const x = cx + (i - (row.n - 1) / 2) * 3.2;
      member.figure.root.position.set(x, row.y, row.z);
      member.figure.root.userData.home = member.figure.root.position.clone();
      member.figure.root.userData.idx = idx;
      member.figure.root.rotation.y = 0; // face +Z toward Zhang
      // thruster pack
      const pk = new THREE.Mesh(thrusterPack(), voxelMaterial());
      pk.position.set(-1.5, 0, -1);
      member.figure.anchors.back.add(pk);
      space.group.add(member.figure.root);
      attendees.push(member);
      idx++;
    }
  }
  const photographer = makeAttendee(99, false);
  photographer.figure.root.position.set(24, cy + 2, cz + 16);
  photographer.figure.root.rotation.y = -Math.PI / 3;
  space.group.add(photographer.figure.root);

  /* ---- locator unit left in the cabin (shown in S16) ---- */
  const locator = new THREE.Mesh(locatorProp(), voxelMaterial());
  locator.visible = false;
  scene.add(locator);

  // initial poses
  applyPose(collector, idle(0));
  for (const a of attendees) applyPose(a.figure, float(0));
  applyPose(photographer.figure, float(0));

  return {
    scene, camera, sets, coldOpen, hutong, room, workshop, basement, space,
    zhang, collector, collectorProps, attendees, photographer, targetIdx, hitIdx, locator,
    _v: new THREE.Vector3(),
  };
}

/** Reveal exactly one set (plus optionally Zhang). */
export function showOnly(ctx: FilmContext, name: SetName | null, zhangVisible = false): void {
  for (const [key, g] of Object.entries(ctx.sets)) g.visible = key === name;
  ctx.coldOpen.group.visible = false;
  ctx.zhang.figure.root.visible = zhangVisible;
  ctx.locator.visible = false;
}

export function dressZhang(ctx: FilmContext, mode: "uniform" | "suitGold" | "suitClear"): void {
  const tex = mode === "uniform" ? ctx.zhang.uniform : mode === "suitGold" ? ctx.zhang.suitGold : ctx.zhang.suitClear;
  ctx.zhang.figure.setClothes(tex);
}
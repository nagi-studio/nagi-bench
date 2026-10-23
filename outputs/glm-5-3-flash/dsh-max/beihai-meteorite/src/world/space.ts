import * as THREE from "three";
import { applyPose, buildVoxelGeometry, float, voxelMaterial, voxelSphere, type Figure, type Pose } from "@agentbench/voxel-kit";
import type { Cast } from "../core/cast";
import { makeBackpack, makeGlove, makePistol, makeScope, mesh } from "../core/props";
import { clamp01, easeInOutCubic, fbm, hash3, lerp, mixHex, segmentProgress, smoothstep } from "../core/util";

export interface SpaceRefs {
  group: THREE.Group;
  update: (t: number) => void;
  sunDir: THREE.Vector3;
}

/** 关键节点（绝对时间）。 */
export const SPACE = {
  bursts: [239.2, 241.4, 243.6],
  shotInterval: 0.14,
  flight: 6.0,
  crack: 248.7,
  returnStart: 257.2,
};

const ZBH_POS = new THREE.Vector3(-160, -420, 620);
const HATCH = new THREE.Vector3(-265, -352, -400);
const FC = new THREE.Vector3(-265, -505, 55);

interface FigState {
  fig: Figure;
  slot: THREE.Vector3;
  emergeAt: number;
  visorAt: number;
  finalHit: number;
  hit: boolean;
  hero: boolean;
  phase: number;
}

export function makeSpace(cast: Cast): SpaceRefs {
  const group = new THREE.Group();
  const sunDir = new THREE.Vector3(0, 0.4, -0.9).normalize();

  /* ---------------- 星空 ---------------- */
  const starCount = 2600;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = hash3(i, 1, 0, 101) * Math.PI * 2;
    const v = Math.acos(hash3(i, 2, 0, 102) * 2 - 1);
    const r = 70000;
    starPos[i * 3] = Math.sin(v) * Math.cos(u) * r;
    starPos[i * 3 + 1] = Math.cos(v) * r;
    starPos[i * 3 + 2] = Math.sin(v) * Math.sin(u) * r;
    const b = 0.35 + hash3(i, 3, 0, 103) * 0.65;
    starCol[i * 3] = b;
    starCol[i * 3 + 1] = b * (0.92 + hash3(i, 4, 0, 104) * 0.08);
    starCol[i * 3 + 2] = b;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
  group.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 1.8, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }),
    ),
  );

  /* ---------------- 地球 ---------------- */
  const EARTH_R = 56;
  const earth = new THREE.Mesh(
    voxelSphere(
      EARTH_R,
      (x, y, z) => {
        const cx = EARTH_R;
        const nx = (x + 0.5 - cx) / EARTH_R;
        const ny = (y + 0.5 - cx) / EARTH_R;
        const nz = (z + 0.5 - cx) / EARTH_R;
        const lat = Math.abs(ny);
        const land = fbm(nx * 3.1 + 5, ny * 3.1, nz * 3.1, 4, 7);
        const detail = fbm(nx * 8, ny * 8, nz * 8, 2, 13);
        let color: number;
        if (lat > 0.82) {
          color = 0xdfe8ee;
        } else if (land > 0.53) {
          color = mixHex(0x3f6b3f, 0x8a7a4a, clamp01((detail - 0.3) * 1.8));
        } else if (land > 0.5) {
          color = 0x2a5570;
        } else {
          color = mixHex(0x16324f, 0x1d4a6b, clamp01(detail));
        }
        if (lat < 0.8 && fbm(nx * 4 + 30, ny * 4, nz * 4, 3, 23) > 0.62) {
          color = mixHex(color, 0xe8edf0, 0.85);
        }
        return color;
      },
      { voxel: 150 },
    ),
    voxelMaterial({ roughness: 0.96, metalness: 0 }),
  );
  earth.position.set(0, -10800, 0);
  group.add(earth);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(makeGlowCanvas("rgba(140,190,240,0.8)", "rgba(70,120,190,0.28)", "rgba(20,40,90,0)")),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  halo.scale.setScalar(26500);
  halo.position.copy(earth.position);
  group.add(halo);

  /* ---------------- 太阳 ---------------- */
  const sunMat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(makeGlowCanvas("rgba(255,250,236,1)", "rgba(255,222,160,0.6)", "rgba(255,180,90,0)")),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const sunSprite = new THREE.Sprite(sunMat);
  sunSprite.scale.setScalar(9500);
  group.add(sunSprite);
  const sunLight = new THREE.DirectionalLight(0xfff2dc, 3.2);
  group.add(sunLight, sunLight.target);
  group.add(new THREE.HemisphereLight(0x28323e, 0x05070a, 0.5));
  const earthShine = new THREE.DirectionalLight(0x4a6a96, 2.4);
  earthShine.position.set(0, -30000, -800);
  earthShine.target.position.set(-200, -450, 0);
  group.add(earthShine, earthShine.target);

  // 那颗不动的亮星：尾声里“父亲从冥冥中投下的目光”
  const fatherStar = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(makeGlowCanvas("rgba(255,244,224,1)", "rgba(255,224,180,0.4)", "rgba(255,200,140,0)")),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  fatherStar.position.set(-21700, -1240, -58256);
  fatherStar.scale.setScalar(3600);
  group.add(fatherStar);

  /* ---------------- 黄河号：轮状空间站 ---------------- */
  const wheel = new THREE.Mesh(buildWheel(47, 20), voxelMaterial({ roughness: 0.8, metalness: 0.15 }));
  wheel.position.set(0, 0, -400);
  group.add(wheel);
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    for (const z of [-40, 40]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 1.5), windowMat);
      w.position.set(Math.cos(a) * 425, Math.sin(a) * 425, z - 400);
      group.add(w);
    }
  }
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff5a4a });
  for (const [bx, by] of [[0, 455], [455, 0], [0, -455], [-455, 0]] as const) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8), beaconMat);
    b.position.set(bx, by, -400);
    group.add(b);
  }
  // 出口舱门
  const hatchGroup = new THREE.Group();
  hatchGroup.position.copy(HATCH);
  const hatchFrame = new THREE.Mesh(new THREE.BoxGeometry(70, 70, 10), voxelMaterial({ color: 0x6b7178, roughness: 0.7, metalness: 0.3 }));
  hatchGroup.add(hatchFrame);
  const hatchDoorMat = new THREE.MeshBasicMaterial({ color: 0x8c2424 });
  const hatchDoor = new THREE.Mesh(new THREE.BoxGeometry(44, 44, 5), hatchDoorMat);
  hatchDoor.position.z = 7;
  hatchGroup.add(hatchDoor);
  const dockLampMat = new THREE.MeshBasicMaterial({ color: 0xffe6c0 });
  for (const [lx, ly] of [[-42, 42], [42, 42], [-42, -42], [42, -42]] as const) {
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 6), dockLampMat);
    lamp.position.set(lx, ly, 8);
    hatchGroup.add(lamp);
  }
  const dockLight = new THREE.PointLight(0xffd9a0, 900, 420, 2);
  dockLight.position.set(0, 0, 160);
  hatchGroup.add(dockLight);
  hatchGroup.lookAt(HATCH.x * 1.4, HATCH.y * 1.4, HATCH.z + 260);
  group.add(hatchGroup);

  // 太空电梯缆绳与爬升器
  const cable = new THREE.Mesh(new THREE.BoxGeometry(7, 52000, 7), new THREE.MeshStandardMaterial({ color: 0x9aa4ac, roughness: 0.6, metalness: 0.4, emissive: 0x232c33 }));
  cable.position.set(0, 6000, -400);
  group.add(cable);
  const climber = new THREE.Mesh(
    new THREE.BoxGeometry(24, 40, 24),
    new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.5, metalness: 0.3, emissive: 0x33404a }),
  );
  climber.position.set(0, -2000, -400);
  group.add(climber);

  /* ---------------- 船坞骨架与零星设施 ---------------- */
  const girderMat = voxelMaterial({ color: 0x4a4438, roughness: 1, metalness: 0.2 });
  const shipyard = new THREE.Group();
  shipyard.position.set(-3600, 500, -5600);
  shipyard.rotation.set(0.3, 0.5, 0.12);
  const girder = (w: number, h: number, d: number, x: number, y: number, z: number): void => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), girderMat);
    m.position.set(x, y, z);
    shipyard.add(m);
  };
  for (const dz of [-300, 300]) {
    girder(1000, 30, 30, 0, 200, dz);
    girder(1000, 30, 30, 0, -200, dz);
    girder(30, 430, 30, -500, 0, dz);
    girder(30, 430, 30, 500, 0, dz);
  }
  for (const dx of [-500, 0, 500]) {
    girder(30, 30, 630, dx, 200, 0);
    girder(30, 30, 630, dx, -200, 0);
  }
  group.add(shipyard);

  const smallStationMat = voxelMaterial({ color: 0x8f979e, roughness: 0.9, metalness: 0.2 });
  for (const [sx, sy, sz, s] of [[1800, 200, -1500, 1], [-2200, -300, -2600, 0.7], [900, -700, -3200, 0.85]] as const) {
    const st = new THREE.Group();
    st.position.set(sx, sy, sz);
    st.add(new THREE.Mesh(new THREE.BoxGeometry(120 * s, 60 * s, 60 * s), smallStationMat));
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x2a3d55, roughness: 0.4, metalness: 0.5 });
    const wing1 = new THREE.Mesh(new THREE.BoxGeometry(30 * s, 4 * s, 260 * s), wingMat);
    wing1.position.x = 90 * s;
    st.add(wing1);
    const wing2 = new THREE.Mesh(new THREE.BoxGeometry(30 * s, 4 * s, 260 * s), wingMat);
    wing2.position.x = -90 * s;
    st.add(wing2);
    group.add(st);
  }

  const debris = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), voxelMaterial({ color: 0x7d7f82, roughness: 1 }), 70);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 70; i++) {
    const a = hash3(i, 1, 0, 111) * Math.PI * 2;
    const r = 120 + hash3(i, 2, 0, 112) * 900;
    dummy.position.set(Math.cos(a) * r - 150, -450 + (hash3(i, 3, 0, 113) - 0.5) * 700, Math.sin(a) * r + 60);
    dummy.rotation.set(hash3(i, 4, 0, 114) * 3, hash3(i, 5, 0, 115) * 3, hash3(i, 6, 0, 116) * 3);
    dummy.scale.set(1 + hash3(i, 7, 0, 117) * 9, 1 + hash3(i, 8, 0, 118) * 4, 1 + hash3(i, 9, 0, 119) * 7);
    dummy.updateMatrix();
    debris.setMatrixAt(i, dummy.matrix);
  }
  group.add(debris);
  const truss = new THREE.Mesh(new THREE.BoxGeometry(180, 10, 10), girderMat);
  truss.position.set(-105, -360, 545);
  truss.rotation.z = 0.35;
  truss.rotation.y = -0.4;
  group.add(truss);

  /* ---------------- 合影人群 ---------------- */
  const rowSlots: Array<{ x: number; z: number }> = [];
  const frontX = [-8.4, -4.2, 0, 4.2, 8.4];
  for (let i = 0; i < 5; i++) rowSlots.push({ x: frontX[i]!, z: 0 });
  for (let i = 0; i < 8; i++) rowSlots.push({ x: -14.7 + i * 4.2, z: -6 });
  for (let i = 0; i < 11; i++) rowSlots.push({ x: -21 + i * 4.2, z: -12 });

  const groupAnchor = new THREE.Group();
  groupAnchor.position.copy(FC);
  groupAnchor.lookAt(ZBH_POS.x, FC.y, ZBH_POS.z);
  group.add(groupAnchor);
  groupAnchor.updateMatrixWorld(true);
  const slotWorld = (idx: number): THREE.Vector3 => groupAnchor.localToWorld(new THREE.Vector3(rowSlots[idx]!.x, 0, rowSlots[idx]!.z));

  const states: FigState[] = [];
  const heroHitTimes = [0, 1, 2].map((b) => {
    const times: number[] = [];
    for (let k = 0; k < 8; k++) times.push(SPACE.bursts[b]! + k * SPACE.shotInterval + SPACE.flight);
    return times;
  });

  // 前排正中：三名目标
  cast.heroes.forEach((fig, i) => {
    groupAnchor.add(fig.root);
    fig.root.position.copy(groupAnchor.worldToLocal(slotWorld(i + 1)));
    fig.root.rotation.y = 0;
    fig.anchors.back.add(packProp());
    states.push({
      fig,
      slot: fig.root.position.clone(),
      emergeAt: 207.6 + hash3(i, 9, 1, 121) * 4.6,
      visorAt: 219.4 + i * 0.55,
      finalHit: SPACE.bursts[i]! + 7 * SPACE.shotInterval + SPACE.flight,
      hit: true,
      hero: true,
      phase: i * 1.7,
    });
  });
  // 群众（crowd[20] 留给摄影师）
  const crowdSlotOf = (i: number): number => (i === 0 ? 0 : i === 1 ? 4 : 5 + (i - 2));
  for (let i = 0; i < 20; i++) {
    const fig = cast.crowd[i]!;
    const slotIdx = crowdSlotOf(i);
    groupAnchor.add(fig.root);
    fig.root.position.copy(groupAnchor.worldToLocal(slotWorld(slotIdx)));
    fig.root.rotation.y = 0;
    fig.anchors.back.add(packProp());
    const isHit = slotIdx === 0 || slotIdx === 4;
    const hitTimes: number[] = [];
    if (isHit) {
      for (let b = 0; b < 3; b++) hitTimes.push(SPACE.bursts[b]! + (slotIdx === 0 ? 8 : 9) * SPACE.shotInterval + SPACE.flight);
    }
    states.push({
      fig,
      slot: fig.root.position.clone(),
      emergeAt: 208.2 + hash3(i, 7, 3, 123) * 4.4,
      visorAt: slotIdx <= 4 ? 219.2 + hash3(i, 5, 5, 124) * 3.2 : Infinity,
      finalHit: isHit ? hitTimes[hitTimes.length - 1]! : Infinity,
      hit: isHit,
      hero: false,
      phase: i * 0.9 + 2,
    });
  }
  // 摄影师
  {
    const fig = cast.crowd[20]!;
    groupAnchor.add(fig.root);
    fig.root.position.copy(groupAnchor.worldToLocal(new THREE.Vector3(17, 2.5, 9)));
    fig.root.rotation.y = Math.PI * 0.92;
    fig.anchors.back.add(packProp());
    states.push({
      fig,
      slot: fig.root.position.clone(),
      emergeAt: 207.4,
      visorAt: 218.8,
      finalHit: Infinity,
      hit: false,
      hero: false,
      phase: 5,
    });
  }

  /* ---------------- 章北海 ---------------- */
  const zb = cast.zbSpace;
  zb.root.position.copy(ZBH_POS);
  zb.anchors.back.add(packProp());
  const pistol = mesh(makePistol());
  pistol.position.set(0.02, 0.04, 0.03);
  zb.anchors.handR.add(pistol);
  const scope = mesh(makeScope());
  scope.position.set(0.02, 0.1, 0.08);
  zb.anchors.handR.add(scope);
  const glove = mesh(makeGlove());
  zb.anchors.handL.add(glove);
  group.add(zb.root);

  const muzzle = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(makeGlowCanvas("rgba(255,240,200,1)", "rgba(255,180,80,0.55)", "rgba(255,120,30,0)")),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  muzzle.scale.setScalar(0.001);
  group.add(muzzle);
  const muzzleLight = new THREE.PointLight(0xffc27a, 0, 260, 2);
  group.add(muzzleLight);

  const bulletGeo = new THREE.BufferGeometry();
  const bulletPos = new Float32Array(30 * 3);
  bulletGeo.setAttribute("position", new THREE.BufferAttribute(bulletPos, 3));
  const bullets = new THREE.Points(
    bulletGeo,
    new THREE.PointsMaterial({ size: 0.7, color: 0xd8c9a8, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  bullets.frustumCulled = false;
  group.add(bullets);

  const impacts: Array<{ pos: THREE.Vector3; time: number }> = [];
  for (let b = 0; b < 3; b++) {
    for (let k = 0; k < 10; k++) {
      const shotTime = SPACE.bursts[b]! + k * SPACE.shotInterval;
      let target: THREE.Vector3;
      if (k < 8) {
        target = slotWorld(b + 1).add(
          new THREE.Vector3((hash3(b, k, 1, 131) - 0.5) * 0.5, 0.9 + hash3(b, k, 2, 132) * 0.6, (hash3(b, k, 3, 133) - 0.5) * 0.5),
        );
      } else {
        const idx = k === 8 ? 0 : 4;
        target = slotWorld(idx).add(
          new THREE.Vector3((hash3(b, k, 4, 134) - 0.5) * 0.6, 1.1 + hash3(b, k, 5, 135) * 0.5, (hash3(b, k, 6, 136) - 0.5) * 0.6),
        );
      }
      impacts.push({ pos: target, time: shotTime + SPACE.flight });
    }
  }

  const jetTex = new THREE.CanvasTexture(makeGlowCanvas("rgba(255,255,255,0.95)", "rgba(230,240,250,0.4)", "rgba(200,220,240,0)"));
  const jets: THREE.Sprite[] = [];
  for (let i = 0; i < 30; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: jetTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    s.scale.setScalar(0.001);
    group.add(s);
    jets.push(s);
  }

  const iceGeo = new THREE.BufferGeometry();
  const icePos = new Float32Array(90 * 3);
  iceGeo.setAttribute("position", new THREE.BufferAttribute(icePos, 3));
  const ice = new THREE.Points(
    iceGeo,
    new THREE.PointsMaterial({ size: 0.4, color: 0xeef4f8, transparent: true, opacity: 0, depthWrite: false }),
  );
  ice.frustumCulled = false;
  group.add(ice);

  const mistGeo = new THREE.BufferGeometry();
  const mistPos = new Float32Array(96 * 3);
  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPos, 3));
  const mist = new THREE.Points(
    mistGeo,
    new THREE.PointsMaterial({ size: 1.6, color: 0xdfe8ee, transparent: true, opacity: 0.34, depthWrite: false }),
  );
  mist.frustumCulled = false;
  group.add(mist);

  const freeGlove = new THREE.Group();
  freeGlove.visible = false;
  group.add(freeGlove);

  const strobeMat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(makeGlowCanvas("rgba(255,120,110,1)", "rgba(255,90,80,0.5)", "rgba(255,60,50,0)")),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const strobe = new THREE.Sprite(strobeMat);
  strobe.scale.setScalar(0.001);
  group.add(strobe);

  /* ---------------- 主更新 ---------------- */

  const update = (t: number): void => {
    // —— 太阳：150→230 秒沉向地球边缘，206 前后正好擦出“戒指” ——
    const sunset = smoothstep(clamp01((t - 150) / 80));
    const sy = lerp(0.25, -0.62, sunset);
    const sz = -Math.sqrt(Math.max(0.02, 1 - sy * sy)) * 0.94;
    sunDir.set(0.08, sy, sz).normalize();
    sunSprite.position.copy(sunDir).multiplyScalar(58000).add(new THREE.Vector3(0, -800, 0));
    sunSprite.material.opacity = sunset > 0.99 ? 0.2 : 1;
    sunLight.position.copy(sunDir).multiplyScalar(30000);
    sunLight.target.position.set(0, -400, 0);
    sunLight.intensity = lerp(3.4, 2.8, sunset);
    earth.rotation.y = t * 0.004;

    // —— 空间站 ——
    beaconMat.color.setHex(0xff5a4a).multiplyScalar(0.25 + (0.5 + 0.5 * Math.sin(t * 2.4)) * 0.75);
    climber.position.set(0, -6000 + ((t * 90) % 24000), -400);
    debris.rotation.y = t * 0.0015;
    const open = t > 206.4 && t < 263.4;
    hatchDoorMat.color.setHex(open ? 0x1f5a2f : 0x771f1f);
    hatchDoor.position.z = open ? 11 : 7;

    // —— 瞄准几何 ——
    const aimDir = FC.clone().add(new THREE.Vector3(0, 1.2, 0)).sub(ZBH_POS).normalize();
    const yawToGroup = Math.atan2(aimDir.x, aimDir.z);
    const pitchToGroup = Math.asin(Math.max(-1, Math.min(1, aimDir.y)));

    // —— 章北海 ——
    const turn = segmentProgress(t, 263.8, 267.4);
    const flightT = Math.max(0, t - 265.6);
    const departDist = flightT > 0 ? 0.5 * 1.5 * flightT * flightT : 0;
    const away = new THREE.Vector3(Math.sin(yawToGroup + Math.PI), 0.12, Math.cos(yawToGroup + Math.PI)).normalize();
    // 举枪前身体渐渐稳住（漂移归零），近景与瞄准才成立
    const steady = Math.max(0, 1 - Math.max(0, t - 224) / 4);
    zb.root.position
      .copy(ZBH_POS)
      .add(
        new THREE.Vector3(
          Math.sin(t * 0.11) * 2.2 * steady,
          Math.sin(t * 0.07 + 2) * 1.6 * steady,
          Math.sin(t * 0.09 + 4) * 2.2 * steady,
        ),
      )
      .addScaledVector(away, departDist);
    zb.root.rotation.set(0, lerp(yawToGroup, yawToGroup + Math.PI * 0.96, easeInOutCubic(turn)), Math.sin(t * 0.13) * 0.08);
    zb.root.updateMatrixWorld(true);

    const kick = firingKick(t);
    if (t >= 230.6 && t < 263.5) {
      const pose = float(t * 0.6 + 1.7);
      applyPose(zb, {
        ...pose,
        armR: [-Math.PI / 2 + pitchToGroup - kick, 0, 0.09],
        armL: [-Math.PI / 2 + pitchToGroup + 0.06, 0, -0.24],
        neck: [pitchToGroup * 0.5, 0, 0],
        legR: [-0.4, 0, 0.1],
        legL: [-0.2, 0, -0.12],
      });
    } else {
      applyPose(zb, float(t * 0.6 + (t >= 263.5 ? 3.1 : 0)));
    }
    // 手套脱手
    if (t > 226 && glove.parent !== freeGlove) {
      glove.removeFromParent();
      freeGlove.add(glove);
      freeGlove.visible = true;
    }
    if (freeGlove.visible) {
      const g = t - 226;
      freeGlove.position
        .copy(ZBH_POS)
        .add(new THREE.Vector3(0.6 + g * 0.22, -0.3 + Math.sin(g * 0.4) * 0.2 - g * g * 0.0006, 0.4 + g * 0.1));
      freeGlove.rotation.set(g * 0.3, g * 0.2, g * 0.15);
    }

    // —— 舱外服信标（每秒一次短闪） ——
    const blink = Math.sin(t * Math.PI * 2 * 0.9) > 0.86 ? 1 : 0;
    strobe.position.copy(zb.root.position).add(new THREE.Vector3(0, 0.9, -0.35));
    strobe.scale.setScalar(blink ? 4.5 : 0.001);
    strobeMat.opacity = blink ? 1 : 0;

    // —— 枪口火光 ——
    const shotIdx = currentShot(t);
    if (shotIdx >= 0) {
      const flash = 1 - clamp01((t - shotTimeOf(shotIdx)) / 0.07);
      const m = zb.root.localToWorld(new THREE.Vector3(0.25, 0.32, 0.55));
      muzzle.position.copy(m);
      muzzle.scale.setScalar(1.4 + flash * 2.8);
      muzzle.material.opacity = flash;
      muzzleLight.position.copy(m);
      muzzleLight.intensity = flash * 300;
    } else {
      muzzle.scale.setScalar(0.001);
      muzzle.material.opacity = 0;
      muzzleLight.intensity = 0;
    }

    // —— 弹道 ——
    const muzzleWorld = zb.root.localToWorld(new THREE.Vector3(0.25, 0.32, 0.55));
    for (let i = 0; i < 30; i++) {
      const b = Math.floor(i / 10);
      const k = i % 10;
      const s0 = SPACE.bursts[b]! + k * SPACE.shotInterval;
      if (t < s0 || t > s0 + SPACE.flight) {
        bulletPos[i * 3 + 1] = 1e9;
        continue;
      }
      const u = (t - s0) / SPACE.flight;
      const imp = impacts[i]!;
      bulletPos[i * 3] = lerp(muzzleWorld.x, imp.pos.x, u);
      bulletPos[i * 3 + 1] = lerp(muzzleWorld.y, imp.pos.y, u);
      bulletPos[i * 3 + 2] = lerp(muzzleWorld.z, imp.pos.z, u);
    }
    bulletGeo.attributes.position.needsUpdate = true;
    bullets.visible = t > SPACE.bursts[0]! - 0.1 && t < SPACE.bursts[2]! + SPACE.flight;

    // —— 命中喷气 ——
    for (let i = 0; i < impacts.length; i++) {
      const imp = impacts[i]!;
      const jet = jets[i]!;
      const age = t - imp.time;
      if (age < 0 || age > 2.8) {
        jet.material.opacity = 0;
        continue;
      }
      const u = age / 2.8;
      jet.position.copy(imp.pos);
      jet.scale.setScalar(0.5 + easeInOutCubic(u) * 8);
      jet.material.opacity = 0.95 * (1 - u);
    }

    // —— 冰晶 ——
    const crackAge = t - SPACE.crack;
    void 0;
    const hero1World = slotWorld(2).add(new THREE.Vector3(0, 1.55, 0));
    for (let i = 0; i < 90; i++) {
      if (crackAge < 0 || crackAge > 7) {
        icePos[i * 3 + 1] = 1e9;
        continue;
      }
      const a = hash3(i, 1, 0, 141) * Math.PI * 2;
      const r = crackAge * (0.3 + hash3(i, 2, 0, 142) * 0.9);
      icePos[i * 3] = hero1World.x + Math.cos(a) * r;
      icePos[i * 3 + 1] = hero1World.y + Math.sin(a * 1.7) * r * 0.6 - crackAge * 0.05;
      icePos[i * 3 + 2] = hero1World.z + Math.sin(a) * r;
    }
    iceGeo.attributes.position.needsUpdate = true;
    ice.material.opacity = crackAge < 0 || crackAge > 7 ? 0 : 0.9 * (1 - crackAge / 7);
    if (crackAge > 0) cast.heroes[1]!.setClothes(cast.suitCrackedTexture);
    else cast.heroes[1]!.setClothes(cast.suitVisorTexture);
    // 前排目标的透明面罩
    cast.heroes[0]!.setClothes(t > 219.4 ? cast.suitVisorTexture : cast.suitTexture);
    cast.heroes[2]!.setClothes(t > 220.5 ? cast.suitVisorTexture : cast.suitTexture);
    // 摄影师与前排群众
    if (t > 218.8) states[states.length - 1]!.fig.setClothes(cast.suitVisorTexture);
    for (let i = 0; i < 2; i++) {
      const at = 220.1 + i * 0.8;
      if (t > at) cast.crowd[i]!.setClothes(cast.suitVisorTexture);
    }

    // —— 人群 ——
    for (let i = 0; i < states.length; i++) {
      const st = states[i]!;
      let pos: THREE.Vector3;
      let yaw = 0;
      let pose: Pose;
      if (t < st.emergeAt) {
        st.fig.root.visible = false;
        pos = HATCH.clone();
        pose = float(t * 0.6 + st.phase);
      } else if (t < st.emergeAt + 4.6) {
        st.fig.root.visible = true;
        const u = easeInOutCubic((t - st.emergeAt) / 4.6);
        pos = quadBezier(HATCH.clone(), midAir(HATCH, st.slot, 14), st.slot.clone(), u);
        yaw = Math.atan2(st.slot.x - HATCH.x, st.slot.z - HATCH.z) + Math.PI;
        pose = float(t * 0.9 + st.phase);
      } else if (t < SPACE.returnStart + (st.hit ? 2.6 : 0)) {
        st.fig.root.visible = true;
        const agitated = t > 251.2;
        const bobA = agitated ? 0.4 : 0.16;
        const bobF = agitated ? 1.6 : 0.5;
        pos = st.slot
          .clone()
          .add(new THREE.Vector3(Math.sin(t * bobF + i) * 0.12, Math.sin(t * bobF * 0.8 + i * 2) * bobA, Math.cos(t * bobF * 0.6 + i) * 0.1));
        yaw = agitated && !st.hero ? Math.sin(t * 0.9 + i) * 0.5 : 0;
        if (st.hit && t > st.finalHit + 0.4) {
          const du = clamp01((t - st.finalHit - 0.4) / 2.5);
          pose = mixPose(limpPose(t, st.phase), float(t * 0.6 + st.phase), 1 - du * 0.8);
          yaw += du * (st.hero ? 0.35 : 0.6);
        } else {
          pose = float(t * 0.6 + st.phase);
        }
      } else {
        st.fig.root.visible = true;
        const start = SPACE.returnStart + (st.hit ? 2.6 : 0);
        const u = easeInOutCubic(clamp01((t - start) / 5.6));
        pos = quadBezier(st.slot.clone(), midAir(st.slot, HATCH, 10), HATCH.clone(), u);
        yaw = Math.atan2(HATCH.x - st.slot.x, HATCH.z - st.slot.z);
        if (st.hit) {
          pose = limpPose(t, st.phase);
          pos.y -= 1.1;
          yaw += Math.PI * 0.5;
        } else {
          pose = float(t * 0.8 + st.phase);
        }
        if (u >= 1) st.fig.root.visible = false;
      }
      st.fig.root.position.copy(pos);
      st.fig.root.rotation.y = yaw;
      applyPose(st.fig, pose);
    }

    // —— 推进器白雾 ——
    for (let j = 0; j < 96; j++) {
      const f = j % states.length;
      const o = Math.floor(j / states.length);
      const st = states[f]!;
      let spawn = -1;
      if (t > st.emergeAt && t < st.emergeAt + 4.6) spawn = st.emergeAt;
      if (t > SPACE.returnStart && t < SPACE.returnStart + 8.4) spawn = SPACE.returnStart + (st.hit ? 2.6 : 0);
      if (spawn < 0) {
        mistPos[j * 3 + 1] = 1e9;
        continue;
      }
      const period = 0.55;
      const local = t - spawn - o * (period / 4);
      const m = Math.floor(local / period);
      const puffTime = spawn + o * (period / 4) + m * period;
      const age = t - puffTime;
      if (age < 0 || age > 1.1 || m < 0) {
        mistPos[j * 3 + 1] = 1e9;
        continue;
      }
      const p = figurePosAt(st, puffTime);
      const dir = figureDirAt(st, puffTime);
      mistPos[j * 3] = p.x - dir.x * (0.6 + age * 2.4) + (hash3(j, 1, 0, 151) - 0.5) * age * 1.6;
      mistPos[j * 3 + 1] = p.y - 0.9 - dir.y * (0.6 + age * 2.4) + (hash3(j, 2, 0, 152) - 0.5) * age * 1.6;
      mistPos[j * 3 + 2] = p.z - dir.z * (0.6 + age * 2.4) + (hash3(j, 3, 0, 153) - 0.5) * age * 1.6;
    }
    mistGeo.attributes.position.needsUpdate = true;
    mist.material.opacity = t > 206 && t < 267 ? 0.34 : 0;
  };

  function figurePosAt(st: FigState, time: number): THREE.Vector3 {
    if (time < st.emergeAt + 4.6) {
      const u = easeInOutCubic(clamp01((time - st.emergeAt) / 4.6));
      return quadBezier(HATCH.clone(), midAir(HATCH, st.slot, 14), st.slot.clone(), u);
    }
    const start = SPACE.returnStart + (st.hit ? 2.6 : 0);
    const u = easeInOutCubic(clamp01((time - start) / 5.6));
    return quadBezier(st.slot.clone(), midAir(st.slot, HATCH, 10), HATCH.clone(), u);
  }

  function figureDirAt(st: FigState, time: number): THREE.Vector3 {
    const a = figurePosAt(st, time);
    const b = figurePosAt(st, time + 0.2);
    return b.sub(a).normalize();
  }

  return { group, update, sunDir };
}

/* ------------------------------------------------------------------ */
/* 工具                                                                */
/* ------------------------------------------------------------------ */

function midAir(a: THREE.Vector3, b: THREE.Vector3, lift: number): THREE.Vector3 {
  return a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, lift, 0));
}

function quadBezier(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number): THREE.Vector3 {
  return a.clone().lerp(b, t).lerp(b.clone().lerp(c, t), t);
}

function mixPose(a: Pose, b: Pose, u: number): Pose {
  const out: Pose = {};
  for (const key of ["hips", "neck", "armR", "armL", "legR", "legL"] as const) {
    const av = a[key] ?? [0, 0, 0];
    const bv = b[key] ?? [0, 0, 0];
    out[key] = [av[0]! + (bv[0]! - av[0]!) * u, av[1]! + (bv[1]! - av[1]!) * u, av[2]! + (bv[2]! - av[2]!) * u];
  }
  out.lift = (a.lift ?? 0) + ((b.lift ?? 0) - (a.lift ?? 0)) * u;
  return out;
}

function limpPose(t: number, phase: number): Pose {
  const sway = Math.sin(t * 0.4 + phase) * 0.1;
  return {
    hips: [sway * 0.6, 0, 0],
    neck: [0.5, sway, 0],
    armR: [-0.2 + sway * 0.3, 0, 0.5],
    armL: [-0.15 - sway * 0.3, 0, -0.5],
    legR: [0.25, 0, 0.1],
    legL: [0.15, 0, -0.1],
  };
}

export function shotTimeOf(index: number): number {
  const b = Math.floor(index / 10);
  const k = index % 10;
  return SPACE.bursts[b]! + k * SPACE.shotInterval;
}

export function currentShot(t: number): number {
  for (let i = 0; i < 30; i++) {
    const s = shotTimeOf(i);
    if (t >= s && t < s + 0.07) return i;
  }
  return -1;
}

function firingKick(t: number): number {
  const idx = currentShot(t);
  if (idx < 0) return 0;
  return Math.sin(clamp01((t - shotTimeOf(idx)) / 0.09) * Math.PI) * 0.16;
}

function makeGlowCanvas(inner: string, mid: string, outer: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.3, mid);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return canvas;
}

function packProp(): THREE.Mesh {
  const pack = mesh(makeBackpack());
  pack.rotation.y = Math.PI;
  pack.position.set(0, 0.3, -0.18);
  return pack;
}

/** 轮状空间站：环 + 四根辐条 + 中央轮毂，一个几何体。 */
function buildWheel(size: number, voxel: number): THREE.BufferGeometry {
  const center = size / 2;
  return buildVoxelGeometry(
    {
      size: [size, size, 7],
      at(x, y, z) {
        const dx = x + 0.5 - center;
        const dy = y + 0.5 - center;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r <= 6.5 && Math.abs(z - 3) < 3.5) {
          return z === 3 ? 0x8f979e : 0x767e85;
        }
        if (r >= 21.5 && r <= 23.5 && z >= 1 && z <= 5) {
          return hash3(x, y, z, 161) > 0.86 ? 0x9aa2a9 : 0xb9c2c9;
        }
        if (r > 6.5 && r < 21.5 && z >= 2 && z <= 4) {
          const ang = Math.atan2(dy, dx);
          if (Math.abs(Math.sin(ang * 2)) < 0.06) return 0x8b939a;
        }
        return null;
      },
    },
    { voxel },
  );
}

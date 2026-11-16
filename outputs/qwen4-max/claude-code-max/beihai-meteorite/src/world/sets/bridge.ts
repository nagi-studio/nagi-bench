import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { mesh, glowSprite, solidMat } from "../props";
import { glowTexture } from "../textures";
import { mulberry32 } from "../../util";
import type { Cast } from "../cast";

export interface BridgeSet {
  group: THREE.Group;
  vista: THREE.Group;
  office: THREE.Group;
  ribbon: THREE.Mesh;
  climber: THREE.Sprite;
  sunGlow: THREE.Sprite;
  sky: THREE.Mesh;
  officeKey: THREE.PointLight;
}

function gradientSky(top: number, mid: number, bot: number): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 4; c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, `#${top.toString(16).padStart(6, "0")}`);
  g.addColorStop(0.55, `#${mid.toString(16).padStart(6, "0")}`);
  g.addColorStop(1, `#${bot.toString(16).padStart(6, "0")}`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function building(w: number, h: number, d: number, seed: number): THREE.Mesh {
  const rng = mulberry32(seed);
  const geo = buildVoxelGeometry({
    size: [Math.round(w), Math.round(h), Math.round(d)],
    at(x, y, z) {
      const shell = x === 0 || z === 0 || x === Math.round(w) - 1 || z === Math.round(d) - 1 || y === Math.round(h) - 1;
      if (!shell) return null;
      // lit windows
      if (y > 1 && (x + z) % 2 === 0 && rng() > 0.62) return 0xffd080;
      return rng() > 0.5 ? 0x2a3038 : 0x232830;
    },
  }, { voxel: 1, anchor: "min" });
  const m = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.9 }));
  m.castShadow = false; m.receiveShadow = false;
  return m;
}

export function buildBridge(cast: Cast): BridgeSet {
  const group = new THREE.Group();
  group.visible = false;

  // ---- Vista: rooftop at dusk, elevator climbing to orbit ----
  const vista = new THREE.Group();
  group.add(vista);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(900, 24, 16),
    new THREE.MeshBasicMaterial({ map: gradientSky(0x1a2440, 0x6a4a5a, 0xd88a4a), side: THREE.BackSide, fog: false }),
  );
  vista.add(sky);

  // city skyline
  const rng = mulberry32(42);
  for (let i = 0; i < 46; i++) {
    const w = 6 + rng() * 12;
    const h = 10 + rng() * 70;
    const d = 6 + rng() * 12;
    const b = building(w, h, d, 100 + i);
    const ang = (i / 46) * Math.PI * 2;
    const rad = 120 + rng() * 260;
    b.position.set(Math.cos(ang) * rad, -8, Math.sin(ang) * rad - 120);
    vista.add(b);
  }
  // ground haze plane
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600),
    new THREE.MeshBasicMaterial({ color: 0x3a2c3a, transparent: true, opacity: 0.6 }));
  haze.rotation.x = -Math.PI / 2; haze.position.y = -8; vista.add(haze);

  // The space elevator ribbon — a thin tapering column to orbit.
  const ribbon = mesh(buildVoxelGeometry({
    size: [3, 220, 3],
    at(x, y, z) {
      const taper = 1 - y / 260;
      return Math.abs(x - 1) < taper * 1.4 && Math.abs(z - 1) < taper * 1.4 ? (y % 8 === 0 ? 0x8a9098 : 0x565c62) : null;
    },
  }, { voxel: 1.4, anchor: "min" }), { metalness: 0.3, roughness: 0.6 });
  ribbon.position.set(40, -8, -360);
  vista.add(ribbon);
  const climber = glowSprite(glowTexture("rgba(160,220,255,1)"), 0x9fd6ff, 6);
  climber.position.set(42, 40, -358);
  vista.add(climber);

  // setting sun glow at the horizon
  const sunGlow = glowSprite(glowTexture("rgba(255,200,130,1)"), 0xffb070, 120);
  sunGlow.position.set(-180, 16, -500);
  vista.add(sunGlow);
  const sunCore = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffd8a0 }));
  sunCore.position.set(-180, 16, -500); vista.add(sunCore);

  // terrace railing foreground
  const rail = mesh(buildVoxelGeometry({
    size: [40, 4, 2],
    at(x, y, z) {
      if (y === 3) return 0x3a4048;
      if (x % 4 === 0 && y < 3) return 0x2e343c;
      return null;
    },
  }, { voxel: 0.22, anchor: "min" }), { metalness: 0.3, roughness: 0.6 });
  rail.position.set(-4.4, 0.1, 3.2);
  vista.add(rail);
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 8), solidMat(0x3a3e44));
  terrace.position.set(0, -0.15, 4); terrace.receiveShadow = true; vista.add(terrace);

  const duskKey = new THREE.DirectionalLight(0xffb070, 1.4);
  duskKey.position.set(-60, 20, -40); vista.add(duskKey);
  const duskAmb = new THREE.AmbientLight(0x4a4a6a, 0.8); vista.add(duskAmb);
  const rim = new THREE.DirectionalLight(0x6a8ac0, 0.6);
  rim.position.set(40, 30, 40); vista.add(rim);

  // ---- Office insert: Zhang + Chang at the window ----
  const office = new THREE.Group();
  office.visible = false;
  group.add(office);
  const ofloor = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 6), solidMat(0x3e443a));
  ofloor.position.y = -0.1; ofloor.receiveShadow = true; office.add(ofloor);
  const oceil = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 6), solidMat(0x2a2e28));
  oceil.position.y = 3.2; office.add(oceil);
  const oback = new THREE.Mesh(new THREE.BoxGeometry(7, 3.2, 0.2), solidMat(0x4a5040));
  oback.position.set(0, 1.6, -3); oback.receiveShadow = true; office.add(oback);
  const oleft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 6), solidMat(0x4a5040));
  oleft.position.set(-3.5, 1.6, 0); office.add(oleft);
  const oright = oleft.clone(); oright.position.x = 3.5; office.add(oright);
  // big window showing the elevator dusk
  const windowPane = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.0, 0.06),
    new THREE.MeshBasicMaterial({ map: gradientSky(0x2a3450, 0x7a5a6a, 0xe09a5a) }));
  windowPane.position.set(0, 1.8, -2.94); office.add(windowPane);
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2.2, 0.1), solidMat(0x2e3228));
  winFrame.position.set(0, 1.8, -2.98); office.add(winFrame);
  // elevator silhouette in the window
  const winRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.02),
    new THREE.MeshBasicMaterial({ color: 0x9aa0a6 }));
  winRibbon.position.set(0.9, 1.8, -2.9); office.add(winRibbon);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.78, 0.9), solidMat(0x4a3c2e));
  desk.position.set(-1.2, 0.39, -1.4); desk.castShadow = true; office.add(desk);
  const officeKey = new THREE.PointLight(0xffd0a0, 12, 10, 2);
  officeKey.position.set(0, 2.8, 0.5); officeKey.castShadow = true; office.add(officeKey);
  const officeAmb = new THREE.AmbientLight(0x3a4038, 0.6); office.add(officeAmb);
  const windowFill = new THREE.DirectionalLight(0xe09a5a, 0.9);
  windowFill.position.set(0, 2, -4); windowFill.target.position.set(0, 1, 1); office.add(windowFill, windowFill.target);

  return { group, vista, office, ribbon, climber, sunGlow, sky, officeKey };
}

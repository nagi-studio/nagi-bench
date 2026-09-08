import * as THREE from "three";
import { box, cyl, group, plane } from "../lib/voxel";
import { PAL, flat, glow, glassMaterial, surface } from "../lib/materials";
import { Rng } from "../lib/rng";
import { meteoriteTexture } from "../lib/textures";
import { FlamePlume } from "../film/fx";
import { chair, desk, motes, type SetHandle } from "./shared";

/**
 * ACT V — the reckoning and the ignition.
 * A dark model workshop, a window full of night, and then the thing itself:
 * a fusion flame that tears the sky open and makes the murders mean something.
 */

export function modelshopSet(): SetHandle {
  const root = group(0, 0, 0, "set:modelshop");
  const rng = new Rng(6100);
  const W = 13, D = 10, H = 3.6;

  root.add(plane(W, D, "floor", 0, 0, 0, { rot: [-Math.PI / 2, 0, 0], scale: 2 }));
  root.add(box(W, H, 0.4, "concreteDark", 0, H / 2, -D / 2 - 0.2, { scale: 1.6, cast: false }));
  root.add(box(0.4, H, D, "concreteDark", -W / 2 - 0.2, H / 2, 0, { scale: 1.6, cast: false }));
  root.add(box(0.4, H, D, "concreteDark", W / 2 + 0.2, H / 2, 0, { scale: 1.6, cast: false }));
  root.add(plane(W, D, "ceilDark", 0, H, 0, { rot: [Math.PI / 2, 0, 0], scale: 1.6, receive: false }));

  // the window wall (+z): a frame with a real opening, mullions, glass
  const winW = 9.2, winH = 3.0, winY = 1.75;
  const frameMat = flat(0x1a1e24, 0.6, 0.4);
  const fw = 0.2;
  root.add(box(winW + fw * 2, fw, 0.2, frameMat, 0, winY + winH / 2 + fw / 2, D / 2 - 0.05, { scale: 0.6, cast: false }));
  root.add(box(winW + fw * 2, fw, 0.2, frameMat, 0, winY - winH / 2 - fw / 2, D / 2 - 0.05, { scale: 0.6, cast: false }));
  root.add(box(fw, winH, 0.2, frameMat, -winW / 2 - fw / 2, winY, D / 2 - 0.05, { scale: 0.6, cast: false }));
  root.add(box(fw, winH, 0.2, frameMat, winW / 2 + fw / 2, winY, D / 2 - 0.05, { scale: 0.6, cast: false }));
  root.add(box(winW, winH, 0.04, glassMaterial(0x0a1420, 0.16), 0, winY, D / 2 - 0.12, { scale: 0.5, cast: false }));
  for (const x of [-winW / 4, winW / 4]) root.add(box(0.1, winH, 0.12, flat(0x1a1e24, 0.6, 0.4), x, winY, D / 2 - 0.1, { scale: 0.4, cast: false }));
  root.add(box(winW, 0.12, 0.14, flat(0x1a1e24, 0.6, 0.4), 0, winY, D / 2 - 0.1, { scale: 0.4, cast: false }));

  // night backdrop behind the glass (matte painting, procedural)
  const night = plane(70, 40, "stars", 0, winY + 2.5, D / 2 + 7, { rot: [0, Math.PI, 0], scale: 60, receive: false });
  (night.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
  root.add(night);
  // a deep-blue horizon glow so silhouettes read against the night
  const skyGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 26),
    new THREE.MeshBasicMaterial({ color: 0x1c3e70, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  skyGlow.position.set(0, 9.5, D / 2 + 6.9);
  skyGlow.rotation.y = Math.PI;
  root.add(skyGlow);
  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 9),
    new THREE.MeshBasicMaterial({ color: 0x2a6aa8, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  horizon.position.set(0, 1.6, D / 2 + 6.95);
  horizon.rotation.y = Math.PI;
  root.add(horizon);
  // distant ground line
  root.add(box(80, 1.2, 0.5, flat(0x0a0f16, 1, 0), 0, 0.3, D / 2 + 6.8, { scale: 4, cast: false }));
  // the distant test stand glow seen through the window
  const distant = group(0, 0, D / 2 + 6.4, "distantFlame");
  const df = new FlamePlume(3.6, 0.45);
  df.position.y = 2.2;
  df.setPower(0);
  distant.add(df);
  root.add(distant);

  // drafting tables + stools
  for (let i = 0; i < 3; i++) {
    const x = -4.2 + i * 3.2;
    const t = desk(x, -1.0, 2.2, 1.2, 0.92, 0x2b3138);
    root.add(t);
    root.add(chair(x, 0.4, Math.PI, 0x2a2e33));
    // drafting board tilted on the desk
    const b = box(1.2, 0.04, 0.9, flat(0x1e242a, 0.8, 0), x, 1.12, -1.0, { scale: 0.4, rot: [0.5, 0, 0], cast: false });
    root.add(b);
  }

  // shelves of model rockets along the back wall
  const shelf = flat(0x2a2f36, 0.8, 0.1);
  for (let s = 0; s < 2; s++) {
    const y = 1.5 + s * 0.85;
    root.add(box(9.0, 0.06, 0.5, shelf, 0, y, -D / 2 + 0.6, { scale: 0.6, cast: false }));
    for (let i = 0; i < 8; i++) {
      const x = -4.0 + i * 1.15;
      const hh = rng.range(0.3, 0.62);
      const mm = flat(rng.pick([0x8a929a, 0xb8c0c8, 0x6a727a]), 0.4, 0.7);
      root.add(cyl(0.05, 0.05, hh, mm, x, y + hh / 2 + 0.03, -D / 2 + 0.6, 8, { scale: 0.2, cast: false }));
      root.add(box(0.16, 0.02, 0.16, flat(0x4a525a, 0.6, 0.5), x, y + hh * 0.25, -D / 2 + 0.6, { scale: 0.1, cast: false }));
    }
  }

  // a low warm task lamp on one desk, everything else cold blue from the window
  const lamp = new THREE.PointLight(0xffb057, 14, 6, 2);
  lamp.position.set(-4.2, 1.4, -0.6);
  root.add(lamp);

  const winLight = new THREE.PointLight(0x4a90e0, 90, 20, 2);
  winLight.position.set(0, 2.4, D / 2 - 0.6);
  root.add(winLight);
  const amb = new THREE.HemisphereLight(0x2a4a70, 0x0a0d12, 0.7);
  root.add(amb);

  root.add(motes(50, new THREE.Vector3(11, 3.2, 8), 0x9fc0e0, 0.015, 99));

  return {
    id: "modelshop",
    root,
    update(time, dt) {
      df.tick(time);
    }
  };
}

/** The test stand at night. The fusion drive lights. */
export function teststandSet(): SetHandle {
  const root = group(0, 0, 0, "set:teststand");
  const rng = new Rng(7777);

  // concrete pad and surrounding ground
  const ground = plane(220, 220, "floor", 0, 0, 0, { rot: [-Math.PI / 2, 0, 0], scale: 14 });
  (ground.material as THREE.MeshStandardMaterial).color.setHex(0x4a4e52);
  root.add(ground);
  root.add(box(60, 0.6, 60, "concreteDark", 0, 0.3, 0, { scale: 4, cast: false }));

  // launch mount, raised so the exhaust column reads against the night
  const mount = group(0, 0, 0, "mount");
  mount.add(box(9, 1.0, 9, flat(0x3a4048, 0.7, 0.3), 0, 0.5, 0, { scale: 1 }));
  mount.add(box(7.5, 1.4, 7.5, flat(0x2e343a, 0.6, 0.4), 0, 13.2, 0, { scale: 1 }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mount.add(box(0.8, 13.0, 0.8, flat(0x4a5158, 0.6, 0.5), sx * 3.0, 6.5, sz * 3.0, { scale: 0.8 }));
  mount.add(cyl(3.4, 3.9, 1.2, flat(0x2e343a, 0.6, 0.4), 0, 14.4, 0, 16, { scale: 1 }));
  root.add(mount);

  // the ship: stacked voxel stages, lifted onto the mount
  const ship = group(0, 13.0, 0, "ship");
  const hull = flat(0xb9c2ca, 0.35, 0.75);
  const hullDark = flat(0x6a747e, 0.45, 0.7);
  const accent = flat(0x2a5f9a, 0.4, 0.5);
  ship.add(cyl(2.4, 2.8, 7.0, hull, 0, 6.5, 0, 14, { scale: 1.2 }));
  ship.add(cyl(2.0, 2.4, 6.0, hullDark, 0, 13.0, 0, 14, { scale: 1.2 }));
  ship.add(cyl(1.5, 2.0, 4.5, hull, 0, 18.2, 0, 12, { scale: 1.2 }));
  ship.add(cyl(0.7, 1.5, 3.0, accent, 0, 21.9, 0, 10, { scale: 1 }));
  ship.add(cyl(0.15, 0.7, 1.8, hull, 0, 24.3, 0, 8, { scale: 0.6 }));
  // fins
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const fin = box(0.5, 6.0, 3.2, accent, Math.cos(a) * 3.2, 6.0, Math.sin(a) * 3.2, { scale: 1 });
    fin.rotation.y = -a;
    ship.add(fin);
  }
  // engine bells
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const r = i === 0 ? 0 : 1.5;
    ship.add(cyl(0.55, 0.85, 1.6, flat(0x3a3f44, 0.5, 0.8), Math.cos(a) * r, 2.1, Math.sin(a) * r, 10, { scale: 0.6 }));
  }
  root.add(ship);

  // gantry tower
  const tower = group(8.5, 0, 0, "gantry");
  const tm = flat(0x5a636c, 0.6, 0.6);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) tower.add(box(0.4, 44, 0.4, tm, sx * 1.6, 22, sz * 1.6, { scale: 1 }));
  for (let y = 2; y < 44; y += 2.2) {
    tower.add(box(3.6, 0.18, 0.18, tm, 0, y, -1.6, { scale: 0.6, cast: false }));
    tower.add(box(3.6, 0.18, 0.18, tm, 0, y, 1.6, { scale: 0.6, cast: false }));
    tower.add(box(0.18, 0.18, 3.6, tm, -1.6, y, 0, { scale: 0.6, cast: false }));
    tower.add(box(0.18, 0.18, 3.6, tm, 1.6, y, 0, { scale: 0.6, cast: false }));
  }
  // service arm reaching to the ship
  tower.add(box(5.5, 0.5, 1.2, tm, -3.2, 28, 0, { scale: 0.8 }));
  root.add(tower);

  // floodlight masts
  for (const [x, z] of [[-14, -10], [14, -10], [-14, 12], [14, 12]] as const) {
    const m = group(x, 0, z, "mast");
    m.add(box(0.3, 9, 0.3, tm, 0, 4.5, 0, { scale: 0.8 }));
    m.add(box(1.6, 0.5, 0.4, flat(0x2a2e33, 0.6, 0.4), 0, 9.0, 0, { scale: 0.5, cast: false }));
    for (let i = 0; i < 3; i++) m.add(box(0.34, 0.34, 0.06, glow(0xfff0d0, 2.2), -0.5 + i * 0.5, 9.0, 0.24, { scale: 0.2, cast: false }));
    const l = new THREE.SpotLight(0xfff0d0, 900, 90, 0.85, 0.35, 1.4);
    l.position.set(0, 9, 0);
    l.target.position.set(-x, 16, -z);
    m.add(l, l.target);
    root.add(m);
  }

  // hazard barriers
  for (let i = -6; i <= 6; i++) {
    if (Math.abs(i) < 3) continue;
    root.add(box(2.0, 0.7, 0.16, "hazard", i * 3.0, 0.6, 13, { scale: 0.6 }));
  }

  // low hills on the horizon
  for (let i = 0; i < 26; i++) {
    const a = rng.range(0, Math.PI * 2);
    const r = rng.range(90, 150);
    const w = rng.range(14, 40);
    root.add(box(w, rng.range(3, 10), rng.range(10, 24), flat(0x0a0e14, 1, 0), Math.cos(a) * r, 1, Math.sin(a) * r, { scale: 8, cast: false }));
  }

  // star dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(400, 24, 16),
    new THREE.MeshBasicMaterial({ map: surface("stars").map, side: THREE.BackSide, color: 0x8899bb })
  );
  (dome.material as THREE.MeshBasicMaterial).map = surface("stars").map;
  root.add(dome);

  // the plume
  const plume = new FlamePlume(30, 4.8);
  plume.position.set(0, 15.4, 0);
  plume.setPower(0);
  root.add(plume);

  // ground blast glow that grows with the plume
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x5aa8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const groundGlow = new THREE.Mesh(new THREE.CircleGeometry(11, 28), glowMat);
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.y = 0.72;
  groundGlow.renderOrder = 9;
  root.add(groundGlow);
  const blast = new THREE.Mesh(new THREE.CircleGeometry(11, 28), glowMat);
  blast.rotation.x = -Math.PI / 2;
  blast.position.y = 0.74;
  blast.renderOrder = 9;
  root.add(blast);

  // ambient night
  root.add(new THREE.HemisphereLight(0x2a3a55, 0x0a0d12, 0.5));

  return {
    id: "teststand",
    root,
    plume,
    update(time) {
      plume.tick(time);
      glowMat.opacity = plume.power * 0.5 * (0.8 + Math.sin(time * 9) * 0.2);
      const s = 1 + plume.power * (0.6 + Math.sin(time * 5) * 0.08);
      blast.scale.set(s, s, s);
    }
  } as SetHandle & { plume: FlamePlume };
}

/** The void: a blocky fleet crawling across the stars, and a falling stone. */
export function spaceSet(): SetHandle {
  const root = group(0, 0, 0, "set:space");
  const rng = new Rng(31415);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 20),
    new THREE.MeshBasicMaterial({ map: surface("stars").map, side: THREE.BackSide, color: 0x9fb0d0 })
  );
  root.add(dome);

  // a distant sun / cold nebula glow
  const neb = new THREE.Mesh(
    new THREE.SphereGeometry(40, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x2a4a80, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  neb.position.set(-260, 120, -420);
  root.add(neb);

  // the fleet: long blocky hulls with engine glows, crawling in a line
  const fleet = group(0, 0, 0, "fleet");
  for (let i = 0; i < 9; i++) {
    const s = 1 - i * 0.02;
    const sh = group(rng.sym(7), rng.sym(4) - 2, -52 - i * 34, `ship${i}`);
    sh.scale.setScalar(s * 1.7);
    const hull = flat(0x7a848e, 0.5, 0.7);
    sh.add(box(2.4, 1.8, 12, hull, 0, 0, 0, { scale: 1, cast: false }));
    sh.add(box(1.5, 1.3, 4, flat(0x8a949e, 0.5, 0.7), 0, 0, 7, { scale: 0.8, cast: false }));
    sh.add(box(4.0, 0.3, 5, flat(0x3a4048, 0.6, 0.6), 0, 0, -2, { scale: 1, cast: false }));
    // lit window strips so the fleet reads at distance
    for (let k = 0; k < 5; k++) {
      sh.add(box(0.14, 0.22, 0.5, glow(0x9fd8ff, 2.2), 1.2, 0.35, -3.6 + k * 2.0, { scale: 0.2, cast: false }));
      sh.add(box(0.14, 0.22, 0.5, glow(0x9fd8ff, 2.2), -1.2, 0.35, -3.6 + k * 2.0, { scale: 0.2, cast: false }));
    }
    const eng = box(1.8, 1.2, 0.5, glow(0x7fd0ff, 3.2), 0, 0, -6.3, { scale: 0.6, cast: false });
    sh.add(eng);
    // long engine trail
    const trail = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 7, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x5ab8ff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    trail.rotation.x = Math.PI / 2;
    trail.position.set(0, 0, -10.2);
    sh.add(trail);
    const el = new THREE.PointLight(0x7fd0ff, 6, 34, 2);
    el.position.set(0, 0, -7);
    sh.add(el);
    fleet.add(sh);
  }
  root.add(fleet);

  // the Altai iron: a big tumbling block of meteoric iron, close to camera
  const rock = group(0, 0, 0, "rock");
  rock.scale.setScalar(1.05);
  const rockMat = new THREE.MeshStandardMaterial({ map: meteoriteTexture({ size: 96, seed: 99 }, 0x5a4a3c), color: 0xffffff, roughness: 0.6, metalness: 0.7 });
  const rng2 = new Rng(99);
  for (let i = 0; i < 14; i++) {
    const s = rng2.range(0.5, 1.6);
    const b = box(s, s * rng2.range(0.6, 1.2), s * rng2.range(0.6, 1.2), rockMat, rng2.sym(1.2), rng2.sym(1.2), rng2.sym(1.2), { scale: 0.5, cast: false });
    b.rotation.set(rng2.sym(1), rng2.sym(1), rng2.sym(1));
    rock.add(b);
  }
  root.add(rock);

  // cold key + blue rim
  const key = new THREE.DirectionalLight(0x9fb8e0, 4.0);
  key.position.set(6, 8, 10);
  root.add(key);
  const rim = new THREE.DirectionalLight(0x4a90e0, 5.0);
  rim.position.set(-8, -4, -10);
  root.add(rim);
  const rockKey = new THREE.PointLight(0x8fb8ff, 130, 24, 2);
  rockKey.position.set(3.5, 3.5, 5.0);
  root.add(rockKey);
  const rockWarm = new THREE.PointLight(0xffb066, 20, 18, 2);
  rockWarm.position.set(-5, -2, -4);
  root.add(rockWarm);
  root.add(new THREE.AmbientLight(0x223044, 1.2));

  return {
    id: "space",
    root,
    update(time, dt) {
      rock.rotation.y = time * 0.18;
      rock.rotation.x = Math.sin(time * 0.23) * 0.4;
      rock.position.y = Math.sin(time * 0.4) * 0.3;
      fleet.position.z += dt * 0.6;
      if (fleet.position.z > 46) fleet.position.z -= 46;
    }
  };
}

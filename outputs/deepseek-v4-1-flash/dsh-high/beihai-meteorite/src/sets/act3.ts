import * as THREE from "three";
import { box, cyl, group, plane } from "../lib/voxel";
import { PAL, flat, glow, surface } from "../lib/materials";
import { Rng } from "../lib/rng";
import { buildRoom, crates, motes, tubeLight, type SetHandle } from "./shared";

/**
 * ACT III — the basement range.
 * A concrete box lined with old blankets. Three old men walk in for their
 * weekly practice. The room is a tomb that does not know it yet.
 */
export function basementSet(): SetHandle {
  const root = group(0, 0, 0, "set:basement");
  const rng = new Rng(3311);
  const W = 13, D = 19, H = 3.25;

  root.add(buildRoom({ w: W, d: D, h: H, floor: "floor", wall: "concreteDark", ceil: "ceilDark", tile: 2.0 }));

  // old blanket sound baffles on the side walls
  const blanketCols = [0x3b3f46, 0x4a3f36, 0x33383e, 0x453c34];
  for (let z = -D / 2 + 2; z < D / 2 - 1.5; z += 2.4) {
    for (const sx of [-1, 1]) {
      const b = box(0.06, 2.2, 2.1, flat(blanketCols[rng.int(0, 3)], 1, 0), sx * (W / 2 - 0.2), 1.5, z, { scale: 0.8, cast: false });
      b.rotation.z = rng.sym(0.02);
      root.add(b);
    }
  }
  // back wall blankets
  for (let i = 0; i < 5; i++) root.add(box(2.3, 2.2, 0.06, flat(blanketCols[rng.int(0, 3)], 1, 0), -W / 2 + 1.6 + i * 2.45, 1.5, -D / 2 + 0.2, { scale: 0.8, cast: false }));

  // shooting bench / lane dividers
  const laneMat = flat(0x2a2f35, 0.8, 0.2);
  for (const x of [-3.4, 0, 3.4]) {
    root.add(box(0.12, 1.0, 2.0, laneMat, x, 0.5, 3.0, { scale: 0.5 }));
    root.add(box(2.6, 0.1, 0.7, laneMat, x, 1.02, 3.6, { scale: 0.6 }));
    // target stand
    const stand = group(x, 0, -6.4, "target");
    stand.add(box(0.12, 1.7, 0.12, flat(0x4a4a4a, 0.7, 0.3), 0, 0.85, 0, { scale: 0.3 }));
    stand.add(box(0.9, 1.1, 0.08, flat(0xcfc9b8, 0.9, 0), 0, 1.45, 0.05, { scale: 0.5, cast: false }));
    stand.add(box(0.42, 0.42, 0.03, flat(0x2a2a2a, 0.9, 0), 0, 1.55, 0.1, { scale: 0.3, cast: false }));
    root.add(stand);
  }

  // gun cases on the bench
  for (const x of [-3.4, 3.4]) {
    root.add(box(0.7, 0.12, 0.34, flat(0x1a1c20, 0.5, 0.4), x, 1.12, 3.6, { scale: 0.4 }));
    root.add(box(0.5, 0.06, 0.2, flat(0x6a6a6a, 0.4, 0.8), x, 1.2, 3.6, { scale: 0.3, cast: false }));
  }
  // a folding table by the entrance
  root.add(crates(rng, 5.0, 7.5, 2, 44));

  // ceiling fluorescents
  const tubes: THREE.Group[] = [];
  for (const z of [-6, -2, 2, 6]) {
    const t = tubeLight(0, z, { y: H - 0.1, length: 2.2, color: 0xd6ecdf, intensity: 28, glowColor: 0xe8f8f0 });
    root.add(t);
    tubes.push(t);
  }

  // caged wall lamps: the only light that reaches vertical faces
  for (const z of [-6.5, -1.5, 3.5]) {
    for (const sx of [-1, 1]) {
      const w = group(sx * (W / 2 - 0.35), 2.35, z, "wallLamp");
      w.add(box(0.22, 0.3, 0.3, flat(0x22262b, 0.6, 0.4), -sx * 0.12, 0, 0, { scale: 0.3, cast: false }));
      w.add(box(0.1, 0.2, 0.2, glow(0xffd9a0, 2.6), -sx * 0.2, 0, 0, { scale: 0.2, cast: false }));
      const l = new THREE.PointLight(0xffcf8a, 22, 9, 2);
      l.position.set(-sx * 0.4, -0.05, 0);
      w.add(l);
      root.add(w);
    }
  }

  // dark alcove near the entrance: a column and a recessed doorway
  const alcove = group(0, 0, D / 2 - 1.2, "alcove");
  alcove.add(box(1.0, H, 1.0, "concreteDark", -4.6, H / 2, 0, { scale: 0.8, cast: false }));
  alcove.add(box(1.0, H, 1.0, "concreteDark", 4.6, H / 2, 0, { scale: 0.8, cast: false }));
  alcove.add(box(1.6, H, 0.3, flat(0x17191c, 0.9, 0), 0, H / 2, -0.4, { scale: 0.8, cast: false })); // dark doorway
  root.add(alcove);
  root.add(new THREE.HemisphereLight(0x6a7888, 0x2a2e34, 2.1));

  // floor drain + stains
  root.add(cyl(0.18, 0.18, 0.02, flat(0x2a2c2e, 0.8, 0.4), 0, 0.012, -1, 8, { scale: 0.2, cast: false }));

  // ---- exterior: a low concrete building in a wet lot, dusk ----
  const ext = group(0, 0, 0, "exterior");
  const lot = plane(80, 60, "floor", 0, 0.005, 16, { rot: [-Math.PI / 2, 0, 0], scale: 8 });
  (lot.material as THREE.MeshStandardMaterial).color.setHex(0x3a3d42);
  ext.add(lot);
  // facade + roof slab so the interior is never seen from outside
  ext.add(box(18, 5.2, 0.6, "concreteDark", 0, 2.6, 12, { scale: 1.6, cast: false }));
  ext.add(box(18, 0.5, 4.0, "concreteDark", 0, 5.0, 10.4, { scale: 1.6, cast: false }));
  // recessed door
  ext.add(box(1.7, 2.5, 0.3, flat(0x101214, 0.9, 0), 0, 1.25, 11.75, { scale: 0.6, cast: false }));
  ext.add(box(0.12, 2.5, 0.12, flat(0x2a2e33, 0.7, 0.2), -0.9, 1.25, 11.7, { scale: 0.3, cast: false }));
  ext.add(box(0.12, 2.5, 0.12, flat(0x2a2e33, 0.7, 0.2), 0.9, 1.25, 11.7, { scale: 0.3, cast: false }));
  // caged lamp over the door
  ext.add(box(0.5, 0.2, 0.4, flat(0x22262b, 0.6, 0.4), 0, 3.05, 11.7, { scale: 0.3, cast: false }));
  ext.add(box(0.34, 0.1, 0.3, glow(0xffd9a0, 2.4), 0, 2.94, 11.66, { scale: 0.2, cast: false }));
  const doorLight = new THREE.PointLight(0xffcf8a, 40, 10, 2);
  doorLight.position.set(0, 2.8, 11.4);
  ext.add(doorLight);
  // small stencilled sign
  ext.add(box(2.2, 0.7, 0.08, flat(0x1a1e22, 0.8, 0), 0, 3.9, 11.7, { scale: 0.5, cast: false }));
  // blocky car, parked at the far side
  const car = group(7.5, 0, 15.5, "car");
  const body = flat(0x2b3138, 0.5, 0.4);
  car.add(box(4.4, 0.9, 1.9, body, 0, 0.75, 0, { scale: 1 }));
  car.add(box(2.4, 0.7, 1.8, body, -0.2, 1.45, 0, { scale: 1 }));
  car.add(box(2.2, 0.55, 0.06, flat(0x11161c, 0.2, 0.2), -0.2, 1.5, 0.93, { scale: 0.4, cast: false }));
  for (const sx of [-1.4, 1.4]) for (const sz of [-0.85, 0.85]) {
    const w = cyl(0.42, 0.42, 0.24, flat(0x111214, 0.8, 0), sx, 0.42, sz, 10, { rot: [Math.PI / 2, 0, 0], scale: 0.4 });
    car.add(w);
  }
  ext.add(car);
  // chain fence posts
  for (let i = 0; i < 8; i++) {
    ext.add(box(0.12, 1.8, 0.12, flat(0x4a4e52, 0.6, 0.4), -14 + i * 4, 0.9, 22, { scale: 0.3, cast: false }));
  }
  // puddle glow
  ext.add(plane(6, 3, "water", 2, 0.012, 16, { rot: [-Math.PI / 2, 0, 0], scale: 3, receive: false }));
  root.add(ext);
  const extAmb = new THREE.HemisphereLight(0x2a3550, 0x0a0c10, 0.55);
  root.add(extAmb);

  root.add(motes(70, new THREE.Vector3(10, 3, 16), 0x9aa8b4, 0.018, 55));

  let flickerState = 1;
  return {
    id: "basement",
    root,
    update(time, dt) {
      // unstable fluorescent: a slow breathing with occasional stutter
      const t = time * 0.5;
      let f = 0.82 + Math.sin(t * 3.1) * 0.06 + Math.sin(t * 11.7) * 0.03;
      const stutter = Math.sin(time * 1.7) > 0.995 || Math.sin(time * 0.31 + 2) > 0.997;
      if (stutter) f *= 0.35;
      flickerState += (f - flickerState) * Math.min(1, dt * 30);
      for (const g of tubes) {
        g.traverse((o) => {
          const l = o as THREE.PointLight;
          if ((l as unknown as { isPointLight?: boolean }).isPointLight) l.intensity = 28 * flickerState;
          const mesh = o as THREE.Mesh;
          if ((mesh as unknown as { isMesh?: boolean }).isMesh) {
            const mm = mesh.material as THREE.MeshStandardMaterial;
            if (mm && mm.emissive && mm.emissiveIntensity > 1) mm.emissiveIntensity = 2.6 * flickerState;
          }
        });
      }
    }
  };
}

import * as THREE from "three";
import { box, rng } from "../voxel";
import type { SceneHandle } from "./collector";

/** Opening: a lone iron meteorite tumbles through the starfield. */
export function buildTitle(): SceneHandle {
  const group = new THREE.Group();
  {
    const r = rng(3);
    const n = 1200;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (r() - 0.5) * 160;
      pos[i * 3 + 1] = (r() - 0.5) * 100;
      pos[i * 3 + 2] = (r() - 0.5) * 160;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xcfd8e8, size: 0.14, transparent: true, opacity: 0.85, depthWrite: false,
    }));
    group.add(stars);
  }
  const rock = new THREE.Group();
  rock.add(box(0.9, 0.7, 0.8, 0x3b3f45));
  rock.add(box(0.5, 0.4, 0.45, 0x454a50, { x: 0.3, y: 0.3 }));
  rock.add(box(0.35, 0.3, 0.3, 0x32363b, { x: -0.35, y: -0.2, z: 0.2 }));
  group.add(rock);
  const rim = new THREE.DirectionalLight(0x8fb8e8, 2.2);
  rim.position.set(-4, 3, -2);
  group.add(rim);
  group.add(new THREE.AmbientLight(0x1c2430, 1.2));

  function frame(t: number): void {
    rock.position.set(2.5 - t * 0.28, 0.6 - t * 0.05, -6 - t * 0.4);
    rock.rotation.set(t * 0.22, t * 0.31, t * 0.13);
  }

  function setCamera(cam: THREE.PerspectiveCamera, _setup: string, t: number): void {
    cam.position.set(0, 0, 6 - t * 0.12);
    cam.lookAt(rock.position.x * 0.4, rock.position.y * 0.4, rock.position.z);
  }

  return { group, frame, setCamera };
}

import * as THREE from "three";
import { clamp01, drift, easeInOutCubic, lerp } from "./util";

export interface CamKey {
  /** 绝对时间。 */
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
  /** 到达这一帧时直接切（硬切）。 */
  cut?: boolean;
  /** 手持晃动幅度。 */
  shake?: number;
  ease?: boolean;
}

/**
 * 摄影机轨道：全部由绝对时间驱动，任意跳转都精确复原。
 * 相邻关键帧之间默认缓动推移；带 cut 的关键帧形成剪辑点。
 */
export class CamRig {
  private readonly keys: CamKey[];
  private readonly posA = new THREE.Vector3();
  private readonly posB = new THREE.Vector3();
  private readonly lookA = new THREE.Vector3();
  private readonly lookB = new THREE.Vector3();

  constructor(keys: CamKey[]) {
    this.keys = [...keys].sort((a, b) => a.t - b.t);
  }

  apply(camera: THREE.PerspectiveCamera, t: number): void {
    const keys = this.keys;
    if (keys.length === 0) return;
    let i = 0;
    for (let k = 0; k < keys.length; k++) {
      if (keys[k]!.t <= t) i = k;
    }
    const cur = keys[i]!;
    const next = keys[i + 1];
    let u = 0;
    if (next && !next.cut) {
      const span = Math.max(1e-4, next.t - cur.t);
      u = clamp01((t - cur.t) / span);
      if (cur.ease !== false) u = easeInOutCubic(u);
    }
    this.posA.set(...cur.pos);
    this.lookA.set(...cur.look);
    let px: number;
    let py: number;
    let pz: number;
    let lx: number;
    let ly: number;
    let lz: number;
    let fov: number;
    if (next && !next.cut) {
      this.posB.set(...next.pos);
      this.lookB.set(...next.look);
      px = lerp(this.posA.x, this.posB.x, u);
      py = lerp(this.posA.y, this.posB.y, u);
      pz = lerp(this.posA.z, this.posB.z, u);
      lx = lerp(this.lookA.x, this.lookB.x, u);
      ly = lerp(this.lookA.y, this.lookB.y, u);
      lz = lerp(this.lookA.z, this.lookB.z, u);
      fov = lerp(cur.fov ?? 40, next.fov ?? 40, u);
    } else {
      px = this.posA.x;
      py = this.posA.y;
      pz = this.posA.z;
      lx = this.lookA.x;
      ly = this.lookA.y;
      lz = this.lookA.z;
      fov = cur.fov ?? 40;
    }
    const shake = cur.shake ?? 0;
    if (shake > 0) {
      px += drift(t, 1.3, shake);
      py += drift(t, 4.1, shake * 0.7);
      lx += drift(t, 7.7, shake * 1.4);
      ly += drift(t, 2.9, shake);
    }
    camera.position.set(px, py, pz);
    camera.lookAt(lx, ly, lz);
    if (Math.abs(camera.fov - fov) > 1e-4) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }
}

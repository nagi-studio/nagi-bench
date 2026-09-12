import * as THREE from "three";
import { rng } from "./voxel";

/**
 * Deterministic particle puff. Every particle's position/color is a pure
 * function of absolute time, so seeking/scrubbing is exact.
 */
export class Puff {
  readonly points: THREE.Points;
  private readonly n: number;
  private readonly dirs: Float32Array;
  private readonly speeds: Float32Array;
  private readonly delays: Float32Array;
  private readonly geo: THREE.BufferGeometry;
  private t0 = -1e9;
  private life = 1;
  private drag = 0.0;
  private origin = new THREE.Vector3();
  private c1 = new THREE.Color(1, 1, 1);
  private c2 = new THREE.Color(1, 1, 1);
  private fadePow = 1.6;

  constructor(n: number, size: number, seed = 1) {
    this.n = n;
    const r = rng(seed);
    this.dirs = new Float32Array(n * 3);
    this.speeds = new Float32Array(n);
    this.delays = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // random point on sphere
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      this.dirs[i * 3] = s * Math.cos(th);
      this.dirs[i * 3 + 1] = s * Math.sin(th);
      this.dirs[i * 3 + 2] = u;
      this.speeds[i] = 0.3 + r() * 0.7;
      this.delays[i] = r();
    }
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    this.geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const material = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(this.geo, material);
    this.points.frustumCulled = false;
  }

  burst(o: {
    at: THREE.Vector3;
    t0: number;
    life: number;
    dir?: THREE.Vector3;     // main direction; particles cone around it
    cone?: number;           // 0..1 blend between sphere and dir
    speed: number;
    drag?: number;
    color1: THREE.ColorRepresentation;
    color2?: THREE.ColorRepresentation;
    delay?: number;          // stagger window fraction
  }): void {
    this.origin.copy(o.at);
    this.t0 = o.t0;
    this.life = o.life;
    this.drag = o.drag ?? 0;
    this.c1.set(o.color1);
    this.c2.set(o.color2 ?? o.color1);
    const dir = o.dir?.clone().normalize();
    const cone = o.cone ?? 1;
    const pos = this.geo.getAttribute("position") as THREE.BufferAttribute;
    const col = this.geo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < this.n; i++) {
      const dx = this.dirs[i * 3], dy = this.dirs[i * 3 + 1], dz = this.dirs[i * 3 + 2];
      let vx = dx, vy = dy, vz = dz;
      if (dir) {
        vx = dir.x * cone + dx * (1 - cone);
        vy = dir.y * cone + dy * (1 - cone);
        vz = dir.z * cone + dz * (1 - cone);
      }
      this.speeds[i] = (0.25 + this.speeds[i] * 0.75) * o.speed;
      this.dirs[i * 3] = vx;
      this.dirs[i * 3 + 1] = vy;
      this.dirs[i * 3 + 2] = vz;
      pos.setXYZ(i, o.at.x, o.at.y, o.at.z);
      col.setXYZ(i, 0, 0, 0);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  /** Call every frame with absolute time. */
  update(t: number, rise = 0): void {
    const pos = this.geo.getAttribute("position") as THREE.BufferAttribute;
    const col = this.geo.getAttribute("color") as THREE.BufferAttribute;
    const rel = t - this.t0;
    for (let i = 0; i < this.n; i++) {
      const local = rel - this.delays[i] * 0.35 * this.life;
      if (local <= 0 || local >= this.life) {
        col.setXYZ(i, 0, 0, 0);
        pos.setXYZ(i, this.origin.x, this.origin.y, this.origin.z);
        continue;
      }
      const k = local / this.life;
      const damp = this.drag > 0 ? (1 - Math.exp(-this.drag * local)) / this.drag : local;
      const sp = this.speeds[i];
      pos.setXYZ(
        i,
        this.origin.x + this.dirs[i * 3] * sp * damp,
        this.origin.y + this.dirs[i * 3 + 1] * sp * damp + rise * local * local,
        this.origin.z + this.dirs[i * 3 + 2] * sp * damp,
      );
      const fade = Math.pow(1 - k, this.fadePow);
      col.setXYZ(
        i,
        (this.c1.r + (this.c2.r - this.c1.r) * k) * fade,
        (this.c1.g + (this.c2.g - this.c1.g) * k) * fade,
        (this.c1.b + (this.c2.b - this.c1.b) * k) * fade,
      );
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  get visible(): boolean { return this.points.visible; }
  set visible(v: boolean) { this.points.visible = v; }
}

/** A glowing tracer bullet: bright head point + short line trail. */
export class Tracer {
  readonly group = new THREE.Group();
  private head: THREE.Mesh;
  private line: THREE.Line;
  private from = new THREE.Vector3();
  private to = new THREE.Vector3();
  private t0 = 0;
  private t1 = 1;

  constructor(color = 0xffe0a8) {
    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true }),
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    this.line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.group.add(this.head, this.line);
    this.group.visible = false;
  }

  launch(from: THREE.Vector3, to: THREE.Vector3, t0: number, t1: number): void {
    this.from.copy(from); this.to.copy(to);
    this.t0 = t0; this.t1 = t1;
  }

  update(t: number): void {
    const k = (t - this.t0) / (this.t1 - this.t0);
    if (k < 0.03 || k > 1) { this.group.visible = false; return; }
    this.group.visible = true;
    const fade = Math.min(1, (k - 0.03) / 0.05, (1 - k) / 0.06);
    (this.head.material as THREE.MeshBasicMaterial).opacity = fade;
    (this.line.material as THREE.LineBasicMaterial).opacity = 0.55 * fade;
    const p = this.from.clone().lerp(this.to, k);
    const tail = this.from.clone().lerp(this.to, Math.max(0, k - 0.03));
    this.head.position.copy(p);
    const attr = this.line.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.setXYZ(0, p.x, p.y, p.z);
    attr.setXYZ(1, tail.x, tail.y, tail.z);
    attr.needsUpdate = true;
  }
}

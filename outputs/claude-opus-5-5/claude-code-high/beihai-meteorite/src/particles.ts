import * as THREE from "three";

/**
 * Instanced cube field. Every frame the owning set rebuilds its contents from
 * absolute time (begin → add… → end), so seeking never accumulates drift.
 */
export class CubeField {
  readonly mesh: THREE.InstancedMesh;
  private n = 0;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor(capacity: number, material: THREE.Material, size = 1) {
    const geo = new THREE.BoxGeometry(size, size, size);
    this.mesh = new THREE.InstancedMesh(geo, material, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.setColorAt(0, new THREE.Color(1, 1, 1));
  }

  begin(): void {
    this.n = 0;
  }

  add(x: number, y: number, z: number, scale: number, color: number, rx = 0, ry = 0, rz = 0): void {
    if (this.n >= this.mesh.instanceMatrix.count || scale <= 0) return;
    this.p.set(x, y, z);
    this.e.set(rx, ry, rz);
    this.q.setFromEuler(this.e);
    this.s.set(scale, scale, scale);
    this.m.compose(this.p, this.q, this.s);
    this.mesh.setMatrixAt(this.n, this.m);
    this.c.setHex(color);
    this.mesh.setColorAt(this.n, this.c);
    this.n++;
  }

  end(): void {
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}

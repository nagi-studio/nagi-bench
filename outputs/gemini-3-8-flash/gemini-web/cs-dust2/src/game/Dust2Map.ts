import * as THREE from 'three';
import { BombSite, ObstacleBox } from '../types';

export const BOMB_SITES: BombSite[] = [
  { name: 'A Site (A包点)', x: 24, z: 26, radius: 7.5 },
  { name: 'B Site (B包点)', x: -25, z: 24, radius: 7.5 }
];

export class Dust2Map {
  public obstacles: ObstacleBox[] = [];
  public wallMeshes: THREE.Mesh[] = [];
  public c4Mesh: THREE.Group;
  public c4Led: THREE.Mesh;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.c4Mesh = new THREE.Group();
    const c4Pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.25, 0.45),
      new THREE.MeshLambertMaterial({ color: 0x78350f })
    );
    this.c4Led = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.c4Led.position.set(0, 0.16, 0);
    this.c4Mesh.add(c4Pack, this.c4Led);
    this.c4Mesh.visible = false;
    this.scene.add(this.c4Mesh);

    this.buildMap();
  }

  private createTexture(baseHex: string, stripeHex: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = stripeHex;
    for (let y = 0; y < 64; y += 16) {
      ctx.fillRect(0, y, 64, 2);
      for (let x = (y % 32 === 0 ? 0 : 16); x < 64; x += 32) {
        ctx.fillRect(x, y, 2, 16);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  private addBlock(
    cx: number,
    cz: number,
    w: number,
    d: number,
    h = 5.5,
    mat: THREE.Material
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(cx, h / 2, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.wallMeshes.push(mesh);
    this.obstacles.push({
      minX: cx - w / 2,
      maxX: cx + w / 2,
      minZ: cz - d / 2,
      maxZ: cz + d / 2,
      maxY: h,
      cx,
      cz,
      w,
      d
    });
    return mesh;
  }

  private buildMap(): void {
    const wallMat = new THREE.MeshLambertMaterial({
      map: this.createTexture('#dec397', '#c2a373')
    });
    const crateMat = new THREE.MeshLambertMaterial({
      map: this.createTexture('#b5834c', '#7c5329')
    });
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const floorMat = new THREE.MeshLambertMaterial({
      map: this.createTexture('#e7d3ad', '#d5bc90')
    });

    // Ground Floor Plane
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Outer Perimeter Sandstone Walls (-44 to +44)
    this.addBlock(0, -44, 88, 2, 7, wallMat);
    this.addBlock(0, 44, 88, 2, 7, wallMat);
    this.addBlock(-44, 0, 2, 88, 7, wallMat);
    this.addBlock(44, 0, 2, 88, 7, wallMat);

    // T-Spawn Area Partition Walls
    this.addBlock(-16, -24, 14, 4, 6, wallMat);
    this.addBlock(14, -24, 14, 4, 6, wallMat);

    // Mid Double Doors & Walls
    this.addBlock(-11, -4, 14, 2.5, 6, wallMat);
    this.addBlock(-2.4, -4, 3.2, 0.6, 5.2, doorMat); // Left wooden door
    this.addBlock(2.4, -4, 3.2, 0.6, 5.2, doorMat);  // Right wooden door
    this.addBlock(11, -4, 14, 2.5, 6, wallMat);

    // Catwalk / Short A Divider Wall & Xbox Crate
    this.addBlock(14, 10, 3, 18, 5.5, wallMat);
    this.addBlock(7, 6, 2.4, 2.4, 2.2, crateMat); // Xbox crate

    // Long A Corridor Walls & Pit Cover
    this.addBlock(32, -6, 3, 34, 6, wallMat);
    this.addBlock(23, -14, 2.6, 2.6, 2.4, crateMat); // Long A Blue/Cover Crate
    this.addBlock(25, 4, 2.5, 2.5, 2.2, crateMat);

    // A Site Tactical Crates & Platform
    this.addBlock(24, 26, 3.2, 3.2, 2.6, crateMat); // Default A Site Crates
    this.addBlock(28, 23, 2.4, 2.4, 2.2, crateMat);
    this.addBlock(19, 29, 2.4, 2.4, 2.2, crateMat); // Goose / Ramp cover

    // B Tunnels & B Site Walls
    this.addBlock(-14, 12, 3, 22, 6, wallMat);
    this.addBlock(-31, 4, 14, 3, 6, wallMat);
    this.addBlock(-25, 24, 3.2, 3.2, 2.6, crateMat); // B Site Double Stack
    this.addBlock(-29, 20, 2.4, 2.4, 2.2, crateMat);
    this.addBlock(-20, 28, 2.4, 2.4, 2.2, crateMat);

    // CT Spawn Cover
    this.addBlock(0, 22, 6, 2.5, 4.5, wallMat);

    // Bomb Site Floor Rings
    BOMB_SITES.forEach((site) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(site.radius - 0.35, site.radius, 36),
        new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(site.x, 0.04, site.z);
      this.scene.add(ring);
    });
  }

  public checkWallCollision(nx: number, nz: number, radius = 0.55): boolean {
    for (let i = 0; i < this.obstacles.length; i++) {
      const b = this.obstacles[i];
      if (
        nx + radius > b.minX &&
        nx - radius < b.maxX &&
        nz + radius > b.minZ &&
        nz - radius < b.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  public hasLineOfSight(p1: THREE.Vector3, p2: THREE.Vector3): boolean {
    const origin = new THREE.Vector3(p1.x, 1.5, p1.z);
    const target = new THREE.Vector3(p2.x, 1.5, p2.z);
    const dir = target.clone().sub(origin);
    const dist = dir.length();
    dir.normalize();
    const rc = new THREE.Raycaster(origin, dir, 0.2, dist);
    const hits = rc.intersectObjects(this.wallMeshes, false);
    return hits.length === 0;
  }

  public getZoneCallout(x: number, z: number): string {
    if (z < -24) return 'T Spawn (匪家)';
    if (x > 15 && z > 16) return 'A Site (A包点)';
    if (x > 15) return 'Long A (A大门/大道)';
    if (x < -15 && z > 14) return 'B Site (B包点)';
    if (x < -15) return 'B Tunnels (B洞)';
    if (x > 4 && z > 2) return 'Catwalk (A小猫道)';
    if (Math.abs(x) < 8 && Math.abs(z) < 12) return 'Mid Doors (中门)';
    if (z > 20) return 'CT Spawn (警家)';
    return 'Mid (中路)';
  }

  public getBombSiteAt(pos: THREE.Vector3): BombSite | null {
    for (const site of BOMB_SITES) {
      const dx = pos.x - site.x;
      const dz = pos.z - site.z;
      if (Math.sqrt(dx * dx + dz * dz) <= site.radius) {
        return site;
      }
    }
    return null;
  }
}

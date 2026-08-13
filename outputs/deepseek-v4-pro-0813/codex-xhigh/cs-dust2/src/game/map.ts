import * as THREE from 'three';
import {
  ColliderSpec,
  SITE_LABELS,
  SITE_ZONES,
  WALL_SPECS,
  GROUND_HEIGHT,
} from './mapData';
import { aabbFromPoint } from './math';

export interface MapCollider {
  id: string;
  min: THREE.Vector3;
  max: THREE.Vector3;
  penetrable: boolean;
  penetration: number;
  mesh: THREE.Object3D;
}

function makeLabelTexture(text: string, background = '#34302a', foreground = '#f1dfad') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background;
  ctx.globalAlpha = 0.78;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.font = 'bold 46px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = foreground;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class Dust2Map {
  readonly colliders: MapCollider[] = [];
  private readonly group = new THREE.Group();

  constructor(private readonly scene: THREE.Scene) {
    this.buildSky();
    this.buildGround();
    this.buildSiteZones();
    this.buildWalls();
    this.buildLabels();
    scene.add(this.group);
  }

  private buildSky() {
    const sky = new THREE.Color(0x82a7bb);
    this.scene.background = sky;
    this.scene.fog = new THREE.Fog(sky, 45, 150);

    const hemi = new THREE.HemisphereLight(0xd8e7f5, 0x9f8864, 1.9);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffe4bb, 3.2);
    sun.position.set(-28, 38, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -75;
    sun.shadow.camera.right = 75;
    sun.shadow.camera.top = 75;
    sun.shadow.camera.bottom = -75;
    sun.shadow.camera.far = 180;
    sun.shadow.bias = -0.0003;
    this.scene.add(sun);
  }

  private buildGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(132, 132),
      new THREE.MeshStandardMaterial({
        color: 0x9c865e,
        roughness: 0.96,
        metalness: 0.02,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_HEIGHT;
    ground.receiveShadow = true;
    this.group.add(ground);

    const grid = new THREE.GridHelper(132, 48, 0x705f40, 0x756345);
    grid.position.y = 0.025;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.24;
    this.group.add(grid);

    const dust = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({ color: 0xd6bd83, size: 0.04, transparent: true, opacity: 0.22 }),
    );
    const positions = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = 0.35 + Math.random() * 1.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    dust.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.group.add(dust);
  }

  private buildSiteZones() {
    for (const zone of SITE_ZONES) {
      const marker = new THREE.Mesh(
        new THREE.CircleGeometry(zone.radius, 48),
        new THREE.MeshBasicMaterial({
          color: zone.color,
          transparent: true,
          opacity: 0.17,
          depthWrite: false,
        }),
      );
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(zone.x, 0.035, zone.z);
      this.group.add(marker);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(zone.radius - 0.12, zone.radius, 64),
        new THREE.MeshBasicMaterial({
          color: zone.color,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zone.x, 0.045, zone.z);
      this.group.add(ring);
    }
  }

  private buildWalls() {
    for (const spec of WALL_SPECS) {
      this.addColliderMesh(spec);
    }
  }

  private addColliderMesh(spec: ColliderSpec) {
    const geometry = new THREE.BoxGeometry(spec.w, spec.h, spec.d);
    const material = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: spec.crate ? 0.82 : 0.88,
      metalness: spec.penetrable ? 0.28 : 0.04,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(spec.x, spec.h / 2, spec.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = spec.id;

    if (spec.penetrable) {
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x2d2a24 }),
      );
      mesh.add(frame);
    }

    this.group.add(mesh);
    this.colliders.push({
      id: spec.id,
      min: aabbFromPoint(spec.x, spec.z, spec.w, spec.d, spec.h).min,
      max: aabbFromPoint(spec.x, spec.z, spec.w, spec.d, spec.h).max,
      penetrable: Boolean(spec.penetrable),
      penetration: spec.penetrable ? 0.52 : 0,
      mesh,
    });
  }

  private buildLabels() {
    for (const label of SITE_LABELS) {
      const texture = makeLabelTexture(label.label);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
      );
      sprite.position.set(label.x, 2.4, label.z);
      sprite.scale.set(5.8, 2.2, 1);
      this.group.add(sprite);
    }
  }
}

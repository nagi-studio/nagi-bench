import * as THREE from 'three';

export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export class C4Bomb {
  readonly group = new THREE.Group();
  state: BombState = 'carried';
  timer = 40;
  position = new THREE.Vector3();
  site: 'A' | 'B' | null = null;
  private led: THREE.Mesh;
  private blink = 0;

  constructor(private readonly scene: THREE.Scene) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.18, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x30383b, roughness: 0.48, metalness: 0.42 }),
    );
    body.position.y = 0.16;
    body.castShadow = true;

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.07, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x15191b, roughness: 0.38, metalness: 0.6 }),
    );
    top.position.y = 0.28;

    this.led = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xff3a2a }),
    );
    this.led.position.set(0.08, 0.24, 0.12);

    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6),
      new THREE.MeshStandardMaterial({ color: 0x555b5e, roughness: 0.35, metalness: 0.8 }),
    );
    antenna.position.set(-0.14, 0.35, -0.09);

    this.group.add(body, top, this.led, antenna);
    this.group.visible = false;
    scene.add(this.group);
  }

  setPosition(x: number, z: number, y = 0) {
    this.position.set(x, y, z);
    this.group.position.set(x, y, z);
  }

  drop(x: number, z: number) {
    this.state = 'dropped';
    this.site = null;
    this.setPosition(x, z, 0.08);
    this.group.visible = true;
  }

  plant(x: number, z: number, site: 'A' | 'B') {
    this.state = 'planted';
    this.site = site;
    this.timer = 40;
    this.setPosition(x, z, 0.12);
    this.group.visible = true;
  }

  defuse() {
    this.state = 'defused';
    this.group.visible = false;
  }

  hide() {
    this.state = 'carried';
    this.site = null;
    this.group.visible = false;
  }

  update(dt: number) {
    if (this.state !== 'planted') return;
    this.timer = Math.max(0, this.timer - dt);
    this.blink += dt;
    this.led.visible = Math.sin(this.blink * 9) > -0.3;
    const urgency = this.timer < 8 ? 1 : 0.45;
    const pulse = 1 + Math.sin(this.blink * 10) * 0.08 * urgency;
    this.led.scale.setScalar(pulse);
  }

  dispose() {
    this.scene.remove(this.group);
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    });
  }
}

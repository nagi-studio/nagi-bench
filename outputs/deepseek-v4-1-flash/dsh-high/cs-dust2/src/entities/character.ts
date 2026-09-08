import * as THREE from 'three';
import type { HitRegion, WeaponDef } from '../weapons/weapons';
import { clamp } from '../core/math';

export interface LocalHitbox {
  region: HitRegion;
  cx: number;
  cy: number;
  cz: number;
  hx: number;
  hy: number;
  hz: number;
}

const SKIN = 0xd8a878;
const BOOT = 0x2a2a2e;

function box(
  w: number,
  h: number,
  d: number,
  color: number,
  rough = 0.8,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
  const m = new THREE.Mesh(geo, mat);
  return m;
}

/** Builds a compact third-person weapon silhouette from the weapon kind. */
function buildTpWeapon(def: WeaponDef): THREE.Group {
  const g = new THREE.Group();
  const bodyColor = def.kind === 'sniper' ? 0x3a4a2f : def.kind === 'pistol' ? 0x26262a : 0x1f1f23;
  if (def.kind === 'knife') {
    const grip = box(0.05, 0.05, 0.16, 0x2a2a2e);
    grip.position.set(0, 0, 0.06);
    const blade = box(0.02, 0.1, 0.3, 0xcfd4dc, 0.3);
    blade.position.set(0, 0.03, -0.18);
    g.add(grip, blade);
    return g;
  }
  const long = def.kind === 'sniper' ? 0.95 : def.kind === 'pistol' ? 0.32 : 0.72;
  const body = box(0.07, 0.1, long, bodyColor);
  body.position.set(0, 0, -long / 2 + 0.1);
  g.add(body);
  const barrel = box(0.035, 0.045, long * 0.4, 0x3a3a40);
  barrel.position.set(0, 0.01, -long - long * 0.16 + 0.1);
  g.add(barrel);
  const mag = box(0.05, 0.18, 0.1, 0x2a2a2e);
  mag.position.set(0, -0.12, -long * 0.42 + 0.1);
  mag.rotation.x = 0.15;
  g.add(mag);
  if (def.kind !== 'pistol') {
    const stock = box(0.06, 0.09, 0.22, bodyColor);
    stock.position.set(0, -0.01, 0.2);
    g.add(stock);
  }
  if (def.kind === 'sniper') {
    const scope = box(0.05, 0.05, 0.26, 0x111114);
    scope.position.set(0, 0.1, -0.32);
    g.add(scope);
  }
  return g;
}

export class CharacterRig {
  readonly group: THREE.Group;
  readonly head: THREE.Mesh;
  readonly torso: THREE.Mesh;
  readonly hips: THREE.Mesh;
  readonly leftArm: THREE.Group;
  readonly rightArm: THREE.Group;
  readonly leftLeg: THREE.Group;
  readonly rightLeg: THREE.Group;
  readonly weaponMount: THREE.Group;

  private leftLegMesh: THREE.Mesh;
  private rightLegMesh: THREE.Mesh;
  private leftArmMesh: THREE.Mesh;
  private rightArmMesh: THREE.Mesh;
  private helmet?: THREE.Mesh;
  private cap?: THREE.Mesh;
  private walkPhase = 0;
  private baseArmPitch = -1.25;
  private team: 'CT' | 'T' = 'T';

  readonly hitboxes: LocalHitbox[] = [
    { region: 'head', cx: 0, cy: 1.62, cz: 0, hx: 0.15, hy: 0.16, hz: 0.15 },
    { region: 'chest', cx: 0, cy: 1.18, cz: 0, hx: 0.27, hy: 0.22, hz: 0.17 },
    { region: 'abdomen', cx: 0, cy: 0.86, cz: 0, hx: 0.25, hy: 0.16, hz: 0.16 },
    { region: 'arm', cx: -0.33, cy: 1.1, cz: 0, hx: 0.1, hy: 0.3, hz: 0.1 },
    { region: 'arm', cx: 0.33, cy: 1.1, cz: 0, hx: 0.1, hy: 0.3, hz: 0.1 },
    { region: 'leg', cx: -0.13, cy: 0.42, cz: 0, hx: 0.11, hy: 0.42, hz: 0.12 },
    { region: 'leg', cx: 0.13, cy: 0.42, cz: 0, hx: 0.11, hy: 0.42, hz: 0.12 },
  ];

  constructor() {
    this.group = new THREE.Group();

    this.torso = box(0.5, 0.62, 0.3, 0x6a6a70);
    this.torso.position.set(0, 1.05, 0);
    this.group.add(this.torso);

    this.hips = box(0.46, 0.18, 0.28, 0x55555b);
    this.hips.position.set(0, 0.8, 0);
    this.group.add(this.hips);

    this.head = box(0.26, 0.3, 0.26, SKIN);
    this.head.position.set(0, 1.62, 0);
    this.group.add(this.head);

    const neck = box(0.12, 0.1, 0.12, SKIN);
    neck.position.set(0, 1.44, 0);
    this.group.add(neck);

    // Arms as pivot groups so they can swing from the shoulder.
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.33, 1.34, 0);
    this.leftArmMesh = box(0.14, 0.56, 0.14, 0x6a6a70);
    this.leftArmMesh.position.set(0, -0.26, 0);
    this.leftArm.add(this.leftArmMesh);
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.33, 1.34, 0);
    this.rightArmMesh = box(0.14, 0.56, 0.14, 0x6a6a70);
    this.rightArmMesh.position.set(0, -0.26, 0);
    this.rightArm.add(this.rightArmMesh);
    this.group.add(this.rightArm);

    // Legs.
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.13, 0.78, 0);
    this.leftLegMesh = box(0.17, 0.78, 0.19, 0x4c4c52);
    this.leftLegMesh.position.set(0, -0.39, 0);
    const lfoot = box(0.18, 0.1, 0.28, BOOT);
    lfoot.position.set(0, -0.76, -0.04);
    this.leftLeg.add(this.leftLegMesh, lfoot);
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.13, 0.78, 0);
    this.rightLegMesh = box(0.17, 0.78, 0.19, 0x4c4c52);
    this.rightLegMesh.position.set(0, -0.39, 0);
    const rfoot = box(0.18, 0.1, 0.28, BOOT);
    rfoot.position.set(0, -0.76, -0.04);
    this.rightLeg.add(this.rightLegMesh, rfoot);
    this.group.add(this.rightLeg);

    // Weapon mount: forward is -Z.
    this.weaponMount = new THREE.Group();
    this.weaponMount.position.set(0.14, 1.16, -0.22);
    this.group.add(this.weaponMount);

    this.setAimPose();
    this.setTeam('T');
  }

  private setAimPose() {
    // Arms brought forward to hold the weapon.
    this.rightArm.rotation.set(this.baseArmPitch, 0.28, 0.35);
    this.leftArm.rotation.set(this.baseArmPitch - 0.15, -0.5, -0.55);
  }

  setTeam(team: 'CT' | 'T') {
    this.team = team;
    const body = team === 'CT' ? 0x3f6fd8 : 0xc9a06a;
    const bodyDark = team === 'CT' ? 0x243f86 : 0x7d5a2e;
    (this.torso.material as THREE.MeshStandardMaterial).color.setHex(body);
    (this.hips.material as THREE.MeshStandardMaterial).color.setHex(bodyDark);
    (this.leftArmMesh.material as THREE.MeshStandardMaterial).color.setHex(body);
    (this.rightArmMesh.material as THREE.MeshStandardMaterial).color.setHex(body);
    (this.leftLegMesh.material as THREE.MeshStandardMaterial).color.setHex(bodyDark);
    (this.rightLegMesh.material as THREE.MeshStandardMaterial).color.setHex(bodyDark);

    if (this.helmet) {
      this.group.remove(this.helmet);
      this.helmet.geometry.dispose();
      (this.helmet.material as THREE.Material).dispose();
      this.helmet = undefined;
    }
    if (this.cap) {
      this.group.remove(this.cap);
      this.cap.geometry.dispose();
      (this.cap.material as THREE.Material).dispose();
      this.cap = undefined;
    }
    if (team === 'CT') {
      this.helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x1f2f66, roughness: 0.5, metalness: 0.2 }),
      );
      this.helmet.position.set(0, 1.72, 0);
      this.group.add(this.helmet);
    } else {
      this.cap = box(0.28, 0.08, 0.28, 0x6b5230);
      this.cap.position.set(0, 1.78, 0);
      const brim = box(0.28, 0.03, 0.12, 0x5a4528);
      brim.position.set(0, 1.75, -0.18);
      this.cap.add(brim);
      this.group.add(this.cap);
    }
  }

  setWeapon(def: WeaponDef | null) {
    // Clear previous weapon children.
    for (const c of [...this.weaponMount.children]) {
      this.weaponMount.remove(c);
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (m.material as THREE.Material).dispose();
        }
      });
    }
    if (!def) return;
    const gun = buildTpWeapon(def);
    // Tilt so it points forward and slightly down from the chest.
    gun.rotation.x = -0.06;
    this.weaponMount.add(gun);
  }

  /** Walk-cycle animation. `speed01` is 0..1 of max speed. */
  animate(speed01: number, dt: number, moving: boolean, crouch = false) {
    const amp = 0.85 * clamp(speed01, 0, 1.2);
    if (moving && speed01 > 0.02) {
      this.walkPhase += dt * (6.5 + speed01 * 4.5);
    } else {
      this.walkPhase += dt * 1.5;
    }
    const s = Math.sin(this.walkPhase);
    const targetLegL = moving ? s * amp : 0;
    const targetLegR = moving ? -s * amp : 0;
    this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, targetLegL, 1 - Math.exp(-14 * dt));
    this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, targetLegR, 1 - Math.exp(-14 * dt));

    // Subtle torso bob / arm sway while keeping the aim pose.
    const bob = moving ? Math.abs(Math.sin(this.walkPhase)) * 0.03 * clamp(speed01, 0, 1.2) : 0;
    this.torso.position.y = 1.05 - bob - (crouch ? 0.3 : 0);
    this.head.position.y = 1.62 - bob - (crouch ? 0.34 : 0);
    this.hips.position.y = 0.8 - bob - (crouch ? 0.18 : 0);
    this.weaponMount.position.y = 1.16 - bob - (crouch ? 0.3 : 0);

    const sway = moving ? s * 0.06 * clamp(speed01, 0, 1.2) : 0;
    this.rightArm.rotation.z = 0.35 + sway;
    this.leftArm.rotation.z = -0.55 - sway;
    this.rightArm.rotation.x = this.baseArmPitch + (moving ? Math.abs(s) * 0.05 : 0);
    this.leftArm.rotation.x = this.baseArmPitch - 0.15;
  }

  /** Point the weapon mount (and thus the gun) toward a world pitch offset. */
  aimPitch(pitch: number) {
    this.weaponMount.rotation.x = clamp(-pitch, -0.7, 0.7) - 0.06;
  }

  dispose() {
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });
  }

  getTeam(): 'CT' | 'T' {
    return this.team;
  }
}

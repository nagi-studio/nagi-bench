import * as THREE from 'three';
import { createWeaponModel } from './weaponModels';
import { HitPart, Team, WeaponId } from './types';

export interface HitSphere {
  part: HitPart;
  center: THREE.Vector3;
  radius: number;
}

interface Pivot {
  group: THREE.Group;
  mesh: THREE.Mesh;
  baseRotation: number;
}

export class HumanoidModel extends THREE.Group {
  readonly team: Team;
  readonly teamMaterial: THREE.MeshStandardMaterial;
  readonly skinMaterial: THREE.MeshStandardMaterial;
  private readonly leftArm: Pivot;
  private readonly rightArm: Pivot;
  private readonly leftLeg: Pivot;
  private readonly rightLeg: Pivot;
  private readonly head: THREE.Mesh;
  private readonly weaponRoot: THREE.Group;
  private weaponModel: THREE.Group | null = null;
  private currentWeapon: WeaponId | null = null;
  private walkPhase = 0;
  private hitSpheres: HitSphere[];
  private dead = false;

  constructor(team: Team) {
    super();
    this.team = team;

    const base = team === 'CT' ? 0x396a9a : 0x8b6937;
    const accent = team === 'CT' ? 0x244e7d : 0xc1a05d;
    this.teamMaterial = new THREE.MeshStandardMaterial({
      color: base,
      roughness: 0.76,
      metalness: 0.05,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: accent,
      roughness: 0.68,
      metalness: 0.08,
    });
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xc89a78,
      roughness: 0.78,
      metalness: 0,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.7, 0.3), this.teamMaterial);
    torso.position.y = 1.12;
    torso.castShadow = true;

    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.34, 0.33), accentMaterial);
    vest.position.y = 1.26;
    vest.castShadow = true;

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), this.skinMaterial);
    this.head.position.y = 1.62;
    this.head.castShadow = true;

    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.205, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45),
      accentMaterial,
    );
    helmet.position.y = 1.68;
    helmet.castShadow = true;

    const makeLimb = (material: THREE.Material, x: number, length: number, width: number, depth: number) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, length, depth), material);
      mesh.position.y = -length / 2;
      mesh.castShadow = true;
      group.add(mesh);
      group.position.set(x, 1.32, 0);
      return { group, mesh, baseRotation: 0 };
    };

    this.leftArm = makeLimb(this.teamMaterial, -0.32, 0.56, 0.12, 0.12);
    this.rightArm = makeLimb(this.teamMaterial, 0.32, 0.56, 0.12, 0.12);
    this.leftLeg = makeLimb(accentMaterial, -0.16, 0.7, 0.18, 0.18);
    this.rightLeg = makeLimb(accentMaterial, 0.16, 0.7, 0.18, 0.18);
    this.leftLeg.group.position.y = 0.72;
    this.rightLeg.group.position.y = 0.72;

    this.weaponRoot = new THREE.Group();
    this.weaponRoot.position.set(0.04, -0.42, 0.11);
    this.weaponRoot.rotation.y = Math.PI;
    this.rightArm.group.add(this.weaponRoot);

    this.add(
      torso,
      vest,
      this.head,
      helmet,
      this.leftArm.group,
      this.rightArm.group,
      this.leftLeg.group,
      this.rightLeg.group,
    );

    this.leftArm.group.rotation.x = -1.12;
    this.rightArm.group.rotation.x = -1.12;

    this.hitSpheres = [
      { part: 'head', center: new THREE.Vector3(0, 1.62, 0), radius: 0.22 },
      { part: 'chest', center: new THREE.Vector3(0, 1.25, 0), radius: 0.24 },
      { part: 'stomach', center: new THREE.Vector3(0, 0.98, 0), radius: 0.21 },
      { part: 'leftArm', center: new THREE.Vector3(-0.3, 1.12, 0), radius: 0.14 },
      { part: 'rightArm', center: new THREE.Vector3(0.3, 1.12, 0), radius: 0.14 },
      { part: 'leftLeg', center: new THREE.Vector3(-0.14, 0.58, 0), radius: 0.16 },
      { part: 'rightLeg', center: new THREE.Vector3(0.14, 0.58, 0), radius: 0.16 },
    ];
  }

  setWeapon(id: WeaponId) {
    if (this.currentWeapon === id) return;
    this.currentWeapon = id;
    if (this.weaponModel) {
      this.weaponRoot.remove(this.weaponModel);
      this.weaponModel.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      });
    }
    this.weaponModel = createWeaponModel(id);
    this.weaponModel.scale.setScalar(0.62);
    this.weaponModel.position.set(0, 0.03, 0.18);
    this.weaponModel.rotation.y = Math.PI;
    this.weaponRoot.add(this.weaponModel);
  }

  updateWalk(dt: number, moving: boolean, speed: number) {
    if (this.dead) return;
    if (moving) {
      this.walkPhase += dt * Math.max(6, speed * 5.3);
      const swing = Math.sin(this.walkPhase) * 0.62;
      this.leftLeg.group.rotation.x = swing;
      this.rightLeg.group.rotation.x = -swing;
      this.leftArm.group.rotation.x = -1.12 + Math.sin(this.walkPhase) * 0.16;
      this.rightArm.group.rotation.x = -1.12 - Math.sin(this.walkPhase) * 0.16;
    } else {
      this.leftLeg.group.rotation.x *= 0.88;
      this.rightLeg.group.rotation.x *= 0.88;
      this.leftArm.group.rotation.x = -1.12;
      this.rightArm.group.rotation.x = -1.12;
    }
  }

  setAimPitch(pitch: number) {
    if (this.dead) return;
    this.leftArm.group.rotation.x = -1.12 + pitch * 0.25;
    this.rightArm.group.rotation.x = -1.12 + pitch * 0.25;
  }

  setDead(dead: boolean) {
    if (this.dead === dead) return;
    this.dead = dead;
    if (dead) {
      this.rotation.z = 0.08;
      this.position.y = 0.08;
      this.weaponRoot.visible = false;
      this.teamMaterial.color.setScalar(0.52);
      this.skinMaterial.color.setScalar(0.6);
    } else {
      this.rotation.z = 0;
      this.position.y = 0;
      this.weaponRoot.visible = true;
    }
  }

  getWorldHitSpheres(): HitSphere[] {
    return this.hitSpheres.map((sphere) => ({
      part: sphere.part,
      center: sphere.center.clone().applyMatrix4(this.matrixWorld),
      radius: sphere.radius * Math.max(this.scale.x, Math.max(this.scale.y, this.scale.z)),
    }));
  }
}

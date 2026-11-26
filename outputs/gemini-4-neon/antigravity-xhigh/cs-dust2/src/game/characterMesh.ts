import * as THREE from 'three';
import { Team, WeaponId } from './types';
import { createWeaponMesh } from './viewmodel';

/**
 * Procedural articulated humanoid character rig (NO single capsule/cylinder shortcut).
 * Hierarchical skeleton: Root -> Pelvis -> Torso/UpperBody (pitch) -> Head, Left/Right Arms, Weapon Anchor;
 * and Pelvis -> Left/Right Thighs -> Knees/Shins -> Boots.
 * Distinct visual silhouettes & color palettes for CT (Navy Tactical + Kevlar Helmet/Visor) vs
 * T (Desert Tan/Olive + Headscarf/Balaclava + Sunglasses).
 */
export class HumanoidCharacterRig {
  public readonly root = new THREE.Group();
  private bodyPivot = new THREE.Group(); // Used for death fall & crouch height
  private upperBody = new THREE.Group(); // Pitches with vertical aim
  private headGroup = new THREE.Group();
  private leftShoulder = new THREE.Group();
  private rightShoulder = new THREE.Group();
  private leftHip = new THREE.Group();
  private rightHip = new THREE.Group();
  private leftKnee = new THREE.Group();
  private rightKnee = new THREE.Group();
  private weaponMount = new THREE.Group();
  private weaponMesh: THREE.Group | null = null;
  private backC4Mesh: THREE.Group;
  private muzzleFlash: THREE.Mesh;
  private allyMarker: THREE.Mesh;

  private currentWeapon: WeaponId | null = null;
  private stridePhase = 0;
  private recoilKick = 0;
  private muzzleTimer = 0;
  private deathFallProgress = 0;
  private deathFallDir = 1;

  constructor(public readonly team: Team) {
    this.root.add(this.bodyPivot);

    const isCT = team === 'CT';

    // Distinct faction materials
    const matUniform = new THREE.MeshStandardMaterial({
      color: isCT ? 0x26394f : 0x9b8259,
      roughness: 0.85,
    });
    const matPants = new THREE.MeshStandardMaterial({
      color: isCT ? 0x1e2c3d : 0x5c4d3b,
      roughness: 0.88,
    });
    const matVest = new THREE.MeshStandardMaterial({
      color: isCT ? 0x1b232b : 0x4a3525,
      roughness: 0.72,
      metalness: 0.15,
    });
    const matAccent = new THREE.MeshStandardMaterial({
      color: isCT ? 0x3b5878 : 0x8f3427, // CT shoulder patch / T crimson headscarf
      roughness: 0.78,
    });
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0xd5a985,
      roughness: 0.76,
    });
    const matBoot = new THREE.MeshStandardMaterial({
      color: isCT ? 0x15171a : 0x453526,
      roughness: 0.85,
    });
    const matHelmet = new THREE.MeshStandardMaterial({
      color: isCT ? 0x252d36 : 0x231e1b,
      roughness: 0.55,
      metalness: 0.2,
    });
    const matVisor = new THREE.MeshStandardMaterial({
      color: isCT ? 0x2f6b99 : 0x121417,
      roughness: 0.15,
      metalness: 0.85,
    });

    const box = (
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent: THREE.Object3D
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };

    // ================= PELVIS / WAIST (y = 0.88) =================
    box(0.36, 0.16, 0.22, matPants, 0, 0.88, 0, this.bodyPivot);
    // Tactical belt & hip pouches
    box(0.38, 0.06, 0.24, matVest, 0, 0.94, 0, this.bodyPivot);
    box(0.08, 0.1, 0.08, matVest, -0.2, 0.9, 0.02, this.bodyPivot);
    box(0.08, 0.1, 0.08, matVest, 0.2, 0.9, 0.02, this.bodyPivot);

    // ================= LEGS (Left & Right Articulated) =================
    const buildLeg = (hipGroup: THREE.Group, kneeGroup: THREE.Group, side: number) => {
      hipGroup.position.set(side * 0.11, 0.84, 0);
      this.bodyPivot.add(hipGroup);
      // Thigh
      box(0.145, 0.4, 0.165, matPants, 0, -0.2, 0, hipGroup);
      // Knee pad
      box(0.12, 0.1, 0.05, matVest, 0, -0.4, -0.085, hipGroup);
      // Knee joint
      kneeGroup.position.set(0, -0.42, 0);
      hipGroup.add(kneeGroup);
      // Shin
      box(0.125, 0.34, 0.14, matPants, 0, -0.17, 0.01, kneeGroup);
      // Combat Boot
      box(0.135, 0.12, 0.24, matBoot, 0, -0.36, -0.04, kneeGroup);
    };
    buildLeg(this.leftHip, this.leftKnee, -1);
    buildLeg(this.rightHip, this.rightKnee, 1);

    // ================= UPPER BODY (Torso + Arms + Head + Weapon) =================
    this.upperBody.position.set(0, 0.96, 0);
    this.bodyPivot.add(this.upperBody);

    // Abdomen + Chest
    box(0.35, 0.22, 0.21, matUniform, 0, 0.11, 0, this.upperBody);
    box(0.42, 0.32, 0.24, matUniform, 0, 0.36, 0, this.upperBody);

    // Tactical Armor Vest / Chest Rig
    box(0.44, 0.34, 0.28, matVest, 0, 0.34, 0, this.upperBody);
    // Front magazine pouches
    box(0.08, 0.12, 0.05, matAccent, -0.11, 0.26, -0.155, this.upperBody);
    box(0.08, 0.12, 0.05, matAccent, 0, 0.26, -0.155, this.upperBody);
    box(0.08, 0.12, 0.05, matAccent, 0.11, 0.26, -0.155, this.upperBody);

    // CT Backpack / Radio Antenna vs T Bandolier
    if (isCT) {
      box(0.28, 0.3, 0.12, matVest, 0, 0.34, 0.18, this.upperBody);
      box(0.02, 0.24, 0.02, matBoot, -0.1, 0.56, 0.18, this.upperBody); // Radio antenna
    } else {
      // Scarf wrap around neck/shoulders
      box(0.32, 0.09, 0.26, matAccent, 0, 0.52, 0, this.upperBody);
    }

    // Back C4 Pack (visible only when carrying C4)
    this.backC4Mesh = createWeaponMesh('c4');
    this.backC4Mesh.position.set(0, 0.33, 0.2);
    this.backC4Mesh.rotation.set(Math.PI / 2, 0, 0);
    this.backC4Mesh.scale.setScalar(1.05);
    this.backC4Mesh.visible = false;
    this.upperBody.add(this.backC4Mesh);

    // ================= NECK & HEAD (y = 0.54 relative to upperBody => 1.50 world) =================
    this.headGroup.position.set(0, 0.54, 0);
    this.upperBody.add(this.headGroup);

    // Neck
    box(0.11, 0.08, 0.11, isCT ? matHelmet : matSkin, 0, 0.03, 0, this.headGroup);
    // Head skull
    box(0.22, 0.24, 0.23, isCT ? matHelmet : matSkin, 0, 0.18, 0, this.headGroup);

    if (isCT) {
      // CT Kevlar Tactical Helmet + Visor Goggles + Balaclava face
      box(0.255, 0.14, 0.27, matHelmet, 0, 0.245, 0.005, this.headGroup);
      box(0.265, 0.05, 0.12, matAccent, 0, 0.22, -0.1, this.headGroup); // Helmet brow rim
      box(0.21, 0.075, 0.05, matVisor, 0, 0.2, -0.12, this.headGroup); // Blue ballistic goggles
      box(0.16, 0.08, 0.04, matBoot, 0, 0.11, -0.11, this.headGroup); // Lower mask/respirator
    } else {
      // T Iconic Dust2 Headscarf / Keffiyeh wrap + Sunglasses + Face
      box(0.245, 0.12, 0.25, matAccent, 0, 0.255, 0.01, this.headGroup); // Crimson/terracotta headscarf
      box(0.24, 0.04, 0.255, matBoot, 0, 0.24, 0.005, this.headGroup); // Dark agal headband
      box(0.2, 0.052, 0.04, matVisor, 0, 0.195, -0.118, this.headGroup); // Tactical sunglasses
      box(0.16, 0.06, 0.03, matBoot, 0, 0.11, -0.112, this.headGroup); // Beard/scarf lower wrap
    }

    // ================= ARTICULATED ARMS (Weapon-Holding Stance) =================
    // Left Arm (supports weapon handguard forward)
    this.leftShoulder.position.set(-0.26, 0.45, 0);
    this.upperBody.add(this.leftShoulder);
    box(0.12, 0.11, 0.13, matAccent, 0, 0, 0, this.leftShoulder); // Shoulder pad
    const lArmGroup = new THREE.Group();
    lArmGroup.rotation.set(1.02, 0.42, 0.12); // Raised & angled inward toward foregrip
    this.leftShoulder.add(lArmGroup);
    box(0.105, 0.28, 0.11, matUniform, 0, -0.14, 0, lArmGroup); // Upper arm
    const lForearm = new THREE.Group();
    lForearm.position.set(0, -0.27, 0);
    lForearm.rotation.set(0.32, 0.25, 0);
    lArmGroup.add(lForearm);
    box(0.092, 0.25, 0.095, matUniform, 0, -0.12, 0, lForearm); // Forearm
    box(0.082, 0.09, 0.09, matBoot, 0, -0.26, 0, lForearm); // Gloved hand

    // Right Arm (grips pistol/rifle trigger & stock)
    this.rightShoulder.position.set(0.26, 0.45, 0);
    this.upperBody.add(this.rightShoulder);
    box(0.12, 0.11, 0.13, matAccent, 0, 0, 0, this.rightShoulder);
    const rArmGroup = new THREE.Group();
    rArmGroup.rotation.set(0.95, -0.18, -0.08);
    this.rightShoulder.add(rArmGroup);
    box(0.105, 0.28, 0.11, matUniform, 0, -0.14, 0, rArmGroup);
    const rForearm = new THREE.Group();
    rForearm.position.set(0, -0.27, 0);
    rForearm.rotation.set(0.45, -0.22, 0);
    rArmGroup.add(rForearm);
    box(0.092, 0.24, 0.095, matUniform, 0, -0.12, 0, rForearm);
    box(0.082, 0.09, 0.09, matBoot, 0, -0.25, 0, rForearm);

    // ================= THIRD-PERSON WEAPON MOUNT =================
    this.weaponMount.position.set(0.14, 0.34, -0.34);
    this.upperBody.add(this.weaponMount);

    // Third-person muzzle flash
    this.muzzleFlash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.MeshBasicMaterial({ color: 0xffd66b })
    );
    this.muzzleFlash.visible = false;
    this.weaponMount.add(this.muzzleFlash);

    // Friendly indicator diamond floating above teammate heads (toggled by engine for allies only)
    this.allyMarker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.09, 0),
      new THREE.MeshBasicMaterial({ color: isCT ? 0x5bc0ff : 0xffbe55 })
    );
    this.allyMarker.position.set(0, 2.15, 0);
    this.allyMarker.visible = false;
    this.root.add(this.allyMarker);
  }

  public setWeapon(weaponId: WeaponId): void {
    if (this.currentWeapon === weaponId) return;
    this.currentWeapon = weaponId;
    if (this.weaponMesh) {
      this.weaponMount.remove(this.weaponMesh);
    }
    this.weaponMesh = createWeaponMesh(weaponId);
    this.weaponMesh.scale.setScalar(1.12);
    this.weaponMount.add(this.weaponMesh);

    const muzzleZ =
      weaponId === 'awp'
        ? -1.1
        : weaponId === 'ak47' || weaponId === 'm4a4'
        ? -0.78
        : -0.36;
    this.muzzleFlash.position.set(0, 0.03, muzzleZ);
  }

  public triggerFire(suppressed = false): void {
    this.recoilKick = 0.12;
    if (!suppressed) {
      this.muzzleTimer = 0.05;
      this.muzzleFlash.rotation.set(Math.random() * 6, Math.random() * 6, 0);
    }
  }

  public resetAlive(): void {
    this.deathFallProgress = 0;
    this.deathFallDir = Math.random() > 0.5 ? 1 : -1;
    this.bodyPivot.rotation.set(0, 0, 0);
    this.bodyPivot.position.set(0, 0, 0);
    this.root.visible = true;
  }

  public update(
    dt: number,
    pos: { x: number; y: number; z: number },
    yaw: number,
    pitch: number,
    speed: number,
    crouching: boolean,
    alive: boolean,
    hasBomb: boolean,
    showAllyMarker: boolean,
    hideForFirstPerson: boolean
  ): void {
    this.root.position.set(pos.x, pos.y, pos.z);
    this.root.rotation.y = yaw;
    this.root.visible = !hideForFirstPerson;
    this.backC4Mesh.visible = hasBomb && alive;
    this.allyMarker.visible = showAllyMarker && alive && !hideForFirstPerson;

    if (this.allyMarker.visible) {
      this.allyMarker.rotation.y += dt * 2.5;
    }

    if (!alive) {
      this.muzzleFlash.visible = false;
      this.deathFallProgress = Math.min(1, this.deathFallProgress + dt * 3.4);
      const ease = 1 - Math.pow(1 - this.deathFallProgress, 3);
      // Clean topple backward/sideways onto ground
      this.bodyPivot.rotation.x = ease * (Math.PI * 0.48);
      this.bodyPivot.rotation.z = ease * 0.25 * this.deathFallDir;
      this.bodyPivot.position.y = ease * 0.14;
      return;
    }

    // Recover firing recoil
    this.recoilKick *= Math.exp(-dt * 15);
    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      this.muzzleFlash.visible = true;
    } else {
      this.muzzleFlash.visible = false;
    }

    // Upper body tracks vertical look pitch
    this.upperBody.rotation.x = Math.max(-0.65, Math.min(0.65, pitch * 0.72)) + this.recoilKick;
    this.weaponMount.position.z = -0.34 + this.recoilKick * 0.45;

    // Crouch vs Walk leg animation
    if (crouching) {
      this.bodyPivot.position.y = -0.36;
      this.leftHip.rotation.x = 0.85;
      this.rightHip.rotation.x = 0.85;
      this.leftKnee.rotation.x = -1.35;
      this.rightKnee.rotation.x = -1.35;
    } else {
      this.bodyPivot.position.y = 0;
      if (speed > 0.35) {
        this.stridePhase += dt * (4.5 + speed * 1.45);
        const swing = Math.sin(this.stridePhase) * Math.min(0.75, speed * 0.13);
        this.leftHip.rotation.x = swing;
        this.rightHip.rotation.x = -swing;
        this.leftKnee.rotation.x = Math.min(0, -Math.cos(this.stridePhase) * 0.55 - 0.15);
        this.rightKnee.rotation.x = Math.min(0, Math.cos(this.stridePhase) * 0.55 - 0.15);
      } else {
        const relax = Math.exp(-dt * 12);
        this.leftHip.rotation.x *= relax;
        this.rightHip.rotation.x *= relax;
        this.leftKnee.rotation.x *= relax;
        this.rightKnee.rotation.x *= relax;
      }
    }
  }
}

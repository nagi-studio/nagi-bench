import * as THREE from 'three';
import { Team, WeaponId, HitboxZone } from '../types/game';
import { WeaponFactory } from './weapons';

export interface HitboxUserData {
  characterId: string;
  zone: HitboxZone;
  multiplier: number;
}

export class ProceduralCharacter {
  public id: string;
  public team: Team;
  public root: THREE.Group;
  
  // Body segments
  public pelvis: THREE.Group;
  public torso: THREE.Group;
  public chest: THREE.Group;
  public headGroup: THREE.Group;
  
  public leftUpperArm: THREE.Group;
  public leftForearm: THREE.Group;
  public rightUpperArm: THREE.Group;
  public rightForearm: THREE.Group;
  
  public leftThigh: THREE.Group;
  public leftCalf: THREE.Group;
  public rightThigh: THREE.Group;
  public rightCalf: THREE.Group;

  public weaponMount: THREE.Group;
  public currentWeaponMesh: THREE.Group | null = null;
  public currentWeaponId: WeaponId = 'glock';

  // Hitbox meshes for raycast collision detection
  public hitboxMeshes: THREE.Mesh[] = [];

  // Animation state
  private animTimer: number = Math.random() * 10;
  private recoilAmount: number = 0;
  public isDead: boolean = false;
  private deathProgress: number = 0;

  constructor(id: string, team: Team, initialWeapon: WeaponId = 'glock') {
    this.id = id;
    this.team = team;
    this.currentWeaponId = initialWeapon;

    this.root = new THREE.Group();
    this.root.name = `character_${id}_${team}`;

    // Color schemes for CT vs T
    const isCT = team === 'CT';
    
    // Materials
    // CT: Navy blue/charcoal uniform, black Kevlar, dark helmet with visor
    // T: Desert tan/khaki trousers, olive vest, red/checkered keffiyeh
    const uniformColor = isCT ? 0x222c3d : 0x7c7052; // Navy vs Desert Tan
    const vestColor = isCT ? 0x181c22 : 0x48523c;    // Black plate carrier vs Olive rig
    const skinColor = 0xd9a679;
    const bootColor = 0x111111;

    const matUniform = new THREE.MeshStandardMaterial({ color: uniformColor, roughness: 0.85 });
    const matVest = new THREE.MeshStandardMaterial({ color: vestColor, roughness: 0.7, metalness: 0.1 });
    const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
    const matBoots = new THREE.MeshStandardMaterial({ color: bootColor, roughness: 0.6 });

    // 1. Pelvis / Hips (Y = 0.95m above ground)
    this.pelvis = new THREE.Group();
    this.pelvis.position.set(0, 0.95, 0);
    this.root.add(this.pelvis);

    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.22), matUniform);
    this.pelvis.add(pelvisMesh);

    // Tactical Belt
    const beltMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.24), matBoots);
    beltMesh.position.set(0, 0.06, 0);
    this.pelvis.add(beltMesh);

    // 2. Torso / Abdomen (Stomach)
    this.torso = new THREE.Group();
    this.torso.position.set(0, 0.1, 0);
    this.pelvis.add(this.torso);

    const stomachMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.2), matUniform);
    stomachMesh.position.set(0, 0.11, 0);
    this.torso.add(stomachMesh);

    // 3. Chest & Tactical Vest
    this.chest = new THREE.Group();
    this.chest.position.set(0, 0.22, 0);
    this.torso.add(this.chest);

    const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.24), matVest);
    chestMesh.position.set(0, 0.14, 0);
    this.chest.add(chestMesh);

    // Ammo Pouches on chest
    const pouch1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), matBoots);
    pouch1.position.set(-0.09, 0.1, 0.14);
    const pouch2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), matBoots);
    pouch2.position.set(0.09, 0.1, 0.14);
    this.chest.add(pouch1, pouch2);

    // 4. Head Group (Y = 1.62m to 1.85m)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.32, 0);
    this.chest.add(this.headGroup);

    // Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.08, 8), matSkin);
    neckMesh.position.set(0, 0.04, 0);
    this.headGroup.add(neckMesh);

    // Head base
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.2), matSkin);
    headMesh.position.set(0, 0.18, 0);
    this.headGroup.add(headMesh);

    if (isCT) {
      // CT SWAT / SAS Kevlar Helmet
      const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1f2733, roughness: 0.5, metalness: 0.3 });
      const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), helmetMat);
      helmetMesh.position.set(0, 0.2, 0);
      this.headGroup.add(helmetMesh);

      // Dark tactical visor / goggles
      const visorMat = new THREE.MeshStandardMaterial({ color: 0x05080c, roughness: 0.2, metalness: 0.9 });
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.08), visorMat);
      visor.position.set(0, 0.18, 0.09);
      this.headGroup.add(visor);

      // Comms headset
      const headsetMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
      const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 8), headsetMat);
      earL.rotation.z = Math.PI / 2;
      earL.position.set(-0.11, 0.18, 0);
      const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 8), headsetMat);
      earR.rotation.z = Math.PI / 2;
      earR.position.set(0.11, 0.18, 0);
      this.headGroup.add(earL, earR);
    } else {
      // Terrorist Keffiyeh / Balaclava & Sunglasses
      const keffiyehMat = new THREE.MeshStandardMaterial({ color: 0x9c3d2e, roughness: 0.9 }); // Red/brown guerrilla scarf
      const scarfMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.7), keffiyehMat);
      scarfMesh.position.set(0, 0.2, 0);
      this.headGroup.add(scarfMesh);

      // Scarf neck wrap
      const neckWrap = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.04, 6, 12), keffiyehMat);
      neckWrap.rotation.x = Math.PI / 2;
      neckWrap.position.set(0, 0.06, 0);
      this.headGroup.add(neckWrap);

      // Aviator sunglasses
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
      const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.04, 0.06), glassMat);
      glasses.position.set(0, 0.19, 0.09);
      this.headGroup.add(glasses);
    }

    // 5. Left Arm (Clavicle -> Upper Arm -> Forearm -> Hand)
    this.leftUpperArm = new THREE.Group();
    this.leftUpperArm.position.set(-0.24, 0.24, 0);
    this.chest.add(this.leftUpperArm);

    const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), matUniform);
    lArmMesh.position.set(0, -0.12, 0);
    this.leftUpperArm.add(lArmMesh);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(0, -0.24, 0);
    this.leftUpperArm.add(this.leftForearm);

    const lForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), matUniform);
    lForearmMesh.position.set(0, -0.11, 0);
    this.leftForearm.add(lForearmMesh);

    const lHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.08), matBoots); // Tactical glove
    lHandMesh.position.set(0, -0.25, 0);
    this.leftForearm.add(lHandMesh);

    // 6. Right Arm (Weapon holding hand)
    this.rightUpperArm = new THREE.Group();
    this.rightUpperArm.position.set(0.24, 0.24, 0);
    this.chest.add(this.rightUpperArm);

    const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), matUniform);
    rArmMesh.position.set(0, -0.12, 0);
    this.rightUpperArm.add(rArmMesh);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.set(0, -0.24, 0);
    this.rightUpperArm.add(this.rightForearm);

    const rForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), matUniform);
    rForearmMesh.position.set(0, -0.11, 0);
    this.rightForearm.add(rForearmMesh);

    const rHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.08), matBoots);
    rHandMesh.position.set(0, -0.25, 0);
    this.rightForearm.add(rHandMesh);

    // Weapon Mount in hands
    this.weaponMount = new THREE.Group();
    this.weaponMount.position.set(0, -0.24, 0.05);
    this.rightForearm.add(this.weaponMount);

    // 7. Left Leg (Thigh -> Calf -> Combat Boot)
    this.leftThigh = new THREE.Group();
    this.leftThigh.position.set(-0.11, -0.06, 0);
    this.pelvis.add(this.leftThigh);

    const lThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.14), matUniform);
    lThighMesh.position.set(0, -0.19, 0);
    this.leftThigh.add(lThighMesh);

    this.leftCalf = new THREE.Group();
    this.leftCalf.position.set(0, -0.38, 0);
    this.leftThigh.add(this.leftCalf);

    const lCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.13), matUniform);
    lCalfMesh.position.set(0, -0.19, 0);
    this.leftCalf.add(lCalfMesh);

    const lBootMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.22), matBoots);
    lBootMesh.position.set(0, -0.42, 0.04);
    this.leftCalf.add(lBootMesh);

    // 8. Right Leg (Thigh -> Calf -> Combat Boot)
    this.rightThigh = new THREE.Group();
    this.rightThigh.position.set(0.11, -0.06, 0);
    this.pelvis.add(this.rightThigh);

    const rThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.14), matUniform);
    rThighMesh.position.set(0, -0.19, 0);
    this.rightThigh.add(rThighMesh);

    this.rightCalf = new THREE.Group();
    this.rightCalf.position.set(0, -0.38, 0);
    this.rightThigh.add(this.rightCalf);

    const rCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.13), matUniform);
    rCalfMesh.position.set(0, -0.19, 0);
    this.rightCalf.add(rCalfMesh);

    const rBootMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.22), matBoots);
    rBootMesh.position.set(0, -0.42, 0.04);
    this.rightCalf.add(rBootMesh);

    // Set Default Weapon Holding Posture
    this.setWeaponHoldingPose();

    // Create Detailed Hitboxes
    this.createHitboxes();

    // Attach Initial Weapon
    this.setWeapon(initialWeapon);
  }

  // Tactical shooting ready pose
  private setWeaponHoldingPose() {
    // Right arm raised forward to hold gun grip
    this.rightUpperArm.rotation.set(-Math.PI / 3.2, 0.2, -0.2);
    this.rightForearm.rotation.set(-Math.PI / 4, 0.3, 0.1);

    // Left arm wrapped across to hold handguard
    this.leftUpperArm.rotation.set(-Math.PI / 3, -0.4, 0.4);
    this.leftForearm.rotation.set(-Math.PI / 3.5, -0.2, -0.2);
  }

  // Create Hitboxes for head, chest, stomach, arms, legs
  private createHitboxes() {
    const hitboxMat = new THREE.MeshBasicMaterial({
      visible: false, // Invisible during normal gameplay
      wireframe: true,
    });

    const addHitbox = (
      parent: THREE.Object3D,
      geo: THREE.BufferGeometry,
      pos: THREE.Vector3,
      zone: HitboxZone,
      multiplier: number
    ) => {
      const mesh = new THREE.Mesh(geo, hitboxMat);
      mesh.position.copy(pos);
      mesh.name = `hitbox_${this.id}_${zone}`;
      mesh.userData = {
        characterId: this.id,
        team: this.team,
        zone,
        multiplier,
      } as HitboxUserData;
      parent.add(mesh);
      this.hitboxMeshes.push(mesh);
    };

    // 1. Head Hitbox (2.5x to 4x damage multiplier)
    addHitbox(this.headGroup, new THREE.BoxGeometry(0.28, 0.3, 0.28), new THREE.Vector3(0, 0.18, 0), 'head', 4.0);

    // 2. Chest Hitbox (1.0x damage)
    addHitbox(this.chest, new THREE.BoxGeometry(0.42, 0.32, 0.3), new THREE.Vector3(0, 0.14, 0), 'chest', 1.0);

    // 3. Stomach Hitbox (1.1x damage)
    addHitbox(this.torso, new THREE.BoxGeometry(0.36, 0.24, 0.26), new THREE.Vector3(0, 0.11, 0), 'stomach', 1.1);

    // 4. Arms Hitboxes (0.8x damage)
    addHitbox(this.leftUpperArm, new THREE.BoxGeometry(0.16, 0.44, 0.16), new THREE.Vector3(0, -0.2, 0), 'arm_left', 0.8);
    addHitbox(this.rightUpperArm, new THREE.BoxGeometry(0.16, 0.44, 0.16), new THREE.Vector3(0, -0.2, 0), 'arm_right', 0.8);

    // 5. Legs Hitboxes (0.75x damage)
    addHitbox(this.leftThigh, new THREE.BoxGeometry(0.18, 0.85, 0.2), new THREE.Vector3(0, -0.4, 0), 'leg_left', 0.75);
    addHitbox(this.rightThigh, new THREE.BoxGeometry(0.18, 0.85, 0.2), new THREE.Vector3(0, -0.4, 0), 'leg_right', 0.75);
  }

  // Switch or update equipped weapon in 3rd person model
  public setWeapon(weaponId: WeaponId) {
    this.currentWeaponId = weaponId;
    if (this.currentWeaponMesh) {
      this.weaponMount.remove(this.currentWeaponMesh);
    }
    const newMesh = WeaponFactory.createWeaponModel(weaponId, false);
    newMesh.rotation.y = Math.PI; // Point forward
    newMesh.position.set(0, -0.04, 0.12);
    this.weaponMount.add(newMesh);
    this.currentWeaponMesh = newMesh;
  }

  // Trigger firing recoil animation
  public triggerRecoil() {
    this.recoilAmount = 0.15;
  }

  // Update Procedural Animations (Idle, Walk, Recoil, Death)
  public update(dt: number, speed: number, isFiring: boolean = false) {
    if (this.isDead) {
      // Death collapse animation
      if (this.deathProgress < 1.0) {
        this.deathProgress = Math.min(1.0, this.deathProgress + dt * 2.8);
        const ease = 1 - Math.pow(1 - this.deathProgress, 3);
        // Fall backward to the ground
        this.root.position.y = 0.95 * (1 - ease) + 0.15 * ease;
        this.root.rotation.x = -Math.PI / 2 * ease;
        this.root.rotation.z = 0.3 * ease;
        this.chest.rotation.x = 0.2 * ease;
        this.leftThigh.rotation.x = 0.4 * ease;
        this.rightThigh.rotation.x = -0.2 * ease;
      }
      return;
    }

    this.animTimer += dt;

    // 1. Recoil recovery
    if (this.recoilAmount > 0) {
      this.recoilAmount = Math.max(0, this.recoilAmount - dt * 1.5);
      this.chest.rotation.x = -this.recoilAmount;
    } else {
      this.chest.rotation.x = 0;
    }

    // 2. Walk / Run Leg and Arm swing
    if (speed > 0.2) {
      const walkFreq = speed * 4.0;
      const walkCycle = Math.sin(this.animTimer * walkFreq);

      // Legs swing back and forth
      this.leftThigh.rotation.x = walkCycle * 0.6;
      this.rightThigh.rotation.x = -walkCycle * 0.6;

      // Calves bend when swinging back
      this.leftCalf.rotation.x = Math.max(0, -walkCycle * 0.8);
      this.rightCalf.rotation.x = Math.max(0, walkCycle * 0.8);

      // Torso slight bobbing
      this.pelvis.position.y = 0.95 + Math.abs(Math.sin(this.animTimer * walkFreq * 2)) * 0.04;
    } else {
      // Idle breathing
      const breath = Math.sin(this.animTimer * 2.0);
      this.chest.position.y = 0.22 + breath * 0.008;
      this.leftThigh.rotation.x = 0;
      this.rightThigh.rotation.x = 0;
      this.leftCalf.rotation.x = 0;
      this.rightCalf.rotation.x = 0;
      this.pelvis.position.y = 0.95;
    }
  }

  public setDead() {
    this.isDead = true;
    this.deathProgress = 0;
  }

  public reset(team: Team, initialWeapon: WeaponId) {
    this.team = team;
    this.isDead = false;
    this.deathProgress = 0;
    this.root.position.y = 0;
    this.root.rotation.set(0, 0, 0);
    this.setWeaponHoldingPose();
    this.setWeapon(initialWeapon);
  }
}

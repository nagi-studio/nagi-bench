import * as THREE from 'three';
import { Team, WeaponId, HitboxZone, HitboxDefinition } from '../types/game';

export class HumanoidModel {
  public root: THREE.Group;
  public team: Team;
  public isPlayer: boolean;

  // Nodes for animation
  public pelvis: THREE.Group;
  public torso: THREE.Group;
  public head: THREE.Group;
  public leftUpperArm: THREE.Group;
  public leftForearm: THREE.Group;
  public rightUpperArm: THREE.Group;
  public rightForearm: THREE.Group;
  public leftThigh: THREE.Group;
  public leftShin: THREE.Group;
  public rightThigh: THREE.Group;
  public rightShin: THREE.Group;
  public weaponHolder: THREE.Group;

  // Weapon meshes
  private weaponMeshes: Map<WeaponId, THREE.Group> = new Map();
  private currentWeaponId: WeaponId = 'ak47';

  // Animation states
  public animTime = 0;
  public isDead = false;
  public deathProgress = 0;
  public isShooting = false;
  public shootTimer = 0;
  public isReloading = false;
  public reloadTimer = 0;

  // Hitbox nodes
  public hitboxes: HitboxDefinition[] = [];

  constructor(team: Team, isPlayer: boolean = false) {
    this.team = team;
    this.isPlayer = isPlayer;
    this.root = new THREE.Group();

    // Joint Groups
    this.pelvis = new THREE.Group();
    this.torso = new THREE.Group();
    this.head = new THREE.Group();
    this.leftUpperArm = new THREE.Group();
    this.leftForearm = new THREE.Group();
    this.rightUpperArm = new THREE.Group();
    this.rightForearm = new THREE.Group();
    this.leftThigh = new THREE.Group();
    this.leftShin = new THREE.Group();
    this.rightThigh = new THREE.Group();
    this.rightShin = new THREE.Group();
    this.weaponHolder = new THREE.Group();

    this.buildCharacterHierarchy();
    this.buildWeaponMeshes();
    this.setupHitboxes();
  }

  private buildCharacterHierarchy() {
    const isCT = this.team === 'CT';

    // Materials
    // Clothes / Uniform
    const uniformColor = isCT ? 0x273746 : 0x5d6d3f; // CT Navy/Slate vs T Olive/Tan
    const vestColor = isCT ? 0x1c2833 : 0x4a3b2c; // CT Dark Kevlar vs T Leather/Camo harness
    const skinColor = 0xd7a176;
    const gearBlack = 0x17202a;
    const helmetColor = isCT ? 0x1b2631 : 0x6e5b4b;
    const visorColor = isCT ? 0x2e86c1 : 0x1a1a1a;

    const uniformMat = new THREE.MeshStandardMaterial({ color: uniformColor, roughness: 0.8 });
    const vestMat = new THREE.MeshStandardMaterial({ color: vestColor, roughness: 0.7, metalness: 0.1 });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.9 });
    const blackMat = new THREE.MeshStandardMaterial({ color: gearBlack, roughness: 0.6 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.5, metalness: 0.2 });
    const visorMat = new THREE.MeshStandardMaterial({ color: visorColor, roughness: 0.2, metalness: 0.8 });

    // 1. Pelvis (Hip area)
    this.pelvis.position.set(0, 0.9, 0);
    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.2, 0.24), uniformMat);
    pelvisMesh.castShadow = true;
    this.pelvis.add(pelvisMesh);
    this.root.add(this.pelvis);

    // Tactical Belt
    const beltMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.26), blackMat);
    beltMesh.position.set(0, 0.06, 0);
    this.pelvis.add(beltMesh);

    // 2. Torso (Spine & Chest)
    this.torso.position.set(0, 0.12, 0);
    this.pelvis.add(this.torso);

    // Main Chest Mesh
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.26), uniformMat);
    torsoMesh.position.set(0, 0.22, 0);
    torsoMesh.castShadow = true;
    this.torso.add(torsoMesh);

    // Tactical Body Armor / Vest
    const vestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 0.29), vestMat);
    vestMesh.position.set(0, 0.22, 0);
    vestMesh.castShadow = true;
    this.torso.add(vestMesh);

    // Chest Pouches / Radio
    const pouchMesh1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.08), blackMat);
    pouchMesh1.position.set(-0.12, 0.18, 0.16);
    this.torso.add(pouchMesh1);

    const pouchMesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.08), blackMat);
    pouchMesh2.position.set(0.12, 0.18, 0.16);
    this.torso.add(pouchMesh2);

    // 3. Head & Neck
    this.head.position.set(0, 0.48, 0);
    this.torso.add(this.head);

    // Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 8), skinMat);
    neckMesh.position.set(0, 0.05, 0);
    this.head.add(neckMesh);

    // Head Base
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), isCT ? uniformMat : skinMat);
    headMesh.position.set(0, 0.18, 0);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    if (isCT) {
      // CT Tactical Assault Helmet
      const helmetGeom = new THREE.BoxGeometry(0.28, 0.18, 0.28);
      const helmetMesh = new THREE.Mesh(helmetGeom, helmetMat);
      helmetMesh.position.set(0, 0.24, 0);
      helmetMesh.castShadow = true;
      this.head.add(helmetMesh);

      // Goggles / Visor
      const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.08), visorMat);
      visorMesh.position.set(0, 0.2, 0.13);
      this.head.add(visorMesh);

      // Ear protection / Comm headset
      const headsetLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.08), blackMat);
      headsetLeft.position.set(-0.15, 0.18, 0);
      this.head.add(headsetLeft);
      const headsetRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.08), blackMat);
      headsetRight.position.set(0.15, 0.18, 0);
      this.head.add(headsetRight);
    } else {
      // T Balaclava Mask / Bandana
      const maskMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.25), helmetMat);
      maskMesh.position.set(0, 0.17, 0.01);
      this.head.add(maskMesh);

      // Aviator Sunglasses
      const shadesMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.06), visorMat);
      shadesMesh.position.set(0, 0.21, 0.13);
      this.head.add(shadesMesh);
    }

    // 4. Arms & Hands
    // Left Arm (Shoulder -> Forearm -> Hand)
    this.leftUpperArm.position.set(-0.28, 0.38, 0);
    this.torso.add(this.leftUpperArm);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, 0.14), uniformMat);
    leftArmMesh.position.set(0, -0.12, 0);
    leftArmMesh.castShadow = true;
    this.leftUpperArm.add(leftArmMesh);

    this.leftForearm.position.set(0, -0.24, 0);
    this.leftUpperArm.add(this.leftForearm);
    const leftForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.12), uniformMat);
    leftForearmMesh.position.set(0, -0.1, 0);
    leftForearmMesh.castShadow = true;
    this.leftForearm.add(leftForearmMesh);

    // Tactical Glove
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), blackMat);
    leftHand.position.set(0, -0.23, 0);
    this.leftForearm.add(leftHand);

    // Right Arm (Aiming arm holding weapon)
    this.rightUpperArm.position.set(0.28, 0.38, 0);
    this.torso.add(this.rightUpperArm);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, 0.14), uniformMat);
    rightArmMesh.position.set(0, -0.12, 0);
    rightArmMesh.castShadow = true;
    this.rightUpperArm.add(rightArmMesh);

    this.rightForearm.position.set(0, -0.24, 0);
    this.rightUpperArm.add(this.rightForearm);
    const rightForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.12), uniformMat);
    rightForearmMesh.position.set(0, -0.1, 0);
    rightForearmMesh.castShadow = true;
    this.rightForearm.add(rightForearmMesh);

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), blackMat);
    rightHand.position.set(0, -0.23, 0);
    this.rightForearm.add(rightHand);

    // Weapon holder attached to right hand
    this.weaponHolder.position.set(0, -0.24, 0.15);
    this.weaponHolder.rotation.x = -Math.PI / 2;
    this.rightForearm.add(this.weaponHolder);

    // 5. Legs & Boots
    // Left Leg
    this.leftThigh.position.set(-0.12, -0.05, 0);
    this.pelvis.add(this.leftThigh);
    const leftThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.16), uniformMat);
    leftThighMesh.position.set(0, -0.18, 0);
    leftThighMesh.castShadow = true;
    this.leftThigh.add(leftThighMesh);

    this.leftShin.position.set(0, -0.38, 0);
    this.leftThigh.add(this.leftShin);
    const leftShinMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.14), uniformMat);
    leftShinMesh.position.set(0, -0.18, 0);
    leftShinMesh.castShadow = true;
    this.leftShin.add(leftShinMesh);

    // Knee pad
    const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.08), blackMat);
    leftKnee.position.set(0, 0.02, 0.08);
    this.leftShin.add(leftKnee);

    // Boot
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.14, 0.22), blackMat);
    leftBoot.position.set(0, -0.38, 0.03);
    leftBoot.castShadow = true;
    this.leftShin.add(leftBoot);

    // Right Leg
    this.rightThigh.position.set(0.12, -0.05, 0);
    this.pelvis.add(this.rightThigh);
    const rightThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.16), uniformMat);
    rightThighMesh.position.set(0, -0.18, 0);
    rightThighMesh.castShadow = true;
    this.rightThigh.add(rightThighMesh);

    this.rightShin.position.set(0, -0.38, 0);
    this.rightThigh.add(this.rightShin);
    const rightShinMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.14), uniformMat);
    rightShinMesh.position.set(0, -0.18, 0);
    rightShinMesh.castShadow = true;
    this.rightShin.add(rightShinMesh);

    // Knee pad
    const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.08), blackMat);
    rightKnee.position.set(0, 0.02, 0.08);
    this.rightShin.add(rightKnee);

    // Boot
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.14, 0.22), blackMat);
    rightBoot.position.set(0, -0.38, 0.03);
    rightBoot.castShadow = true;
    this.rightShin.add(rightBoot);

    // Set standard tactical idle holding pose
    this.setAimPosture(0, 0);
  }

  // Build 3D meshes for third-person held weapons
  private buildWeaponMeshes() {
    const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.4, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x733d1b, roughness: 0.7 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x3d4a36, roughness: 0.6, metalness: 0.3 });
    const c4Mat = new THREE.MeshStandardMaterial({ color: 0x8a6e4b, roughness: 0.9 });
    const c4LcdMat = new THREE.MeshBasicMaterial({ color: 0x22ff22 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x17202a, roughness: 0.6 });

    // 1. AK-47
    const akGroup = new THREE.Group();
    // Receiver
    const akBody = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.4), gunMetalMat);
    akGroup.add(akBody);
    // Barrel
    const akBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), gunMetalMat);
    akBarrel.rotation.x = Math.PI / 2;
    akBarrel.position.set(0, 0.02, 0.35);
    akGroup.add(akBarrel);
    // Wood Stock
    const akStock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.28), woodMat);
    akStock.position.set(0, -0.04, -0.3);
    akGroup.add(akStock);
    // Wood Handguard
    const akGuard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.2), woodMat);
    akGuard.position.set(0, 0.02, 0.2);
    akGroup.add(akGuard);
    // Curved Mag
    const akMag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.08), gunMetalMat);
    akMag.position.set(0, -0.12, 0.06);
    akMag.rotation.x = 0.3;
    akGroup.add(akMag);
    this.weaponMeshes.set('ak47', akGroup);

    // 2. M4A4
    const m4Group = new THREE.Group();
    const m4Body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.42), gunMetalMat);
    m4Group.add(m4Body);
    const m4Barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), gunMetalMat);
    m4Barrel.rotation.x = Math.PI / 2;
    m4Barrel.position.set(0, 0.02, 0.32);
    m4Group.add(m4Barrel);
    const m4Stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.24), gunMetalMat);
    m4Stock.position.set(0, -0.02, -0.28);
    m4Group.add(m4Stock);
    const m4Mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.07), gunMetalMat);
    m4Mag.position.set(0, -0.12, 0.05);
    m4Group.add(m4Mag);
    this.weaponMeshes.set('m4a4', m4Group);

    // 3. AWP
    const awpGroup = new THREE.Group();
    const awpBody = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.6), greenMat);
    awpGroup.add(awpBody);
    const awpBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), gunMetalMat);
    awpBarrel.rotation.x = Math.PI / 2;
    awpBarrel.position.set(0, 0.02, 0.5);
    awpGroup.add(awpBarrel);
    // Scope tube
    const awpScope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), gunMetalMat);
    awpScope.rotation.x = Math.PI / 2;
    awpScope.position.set(0, 0.11, 0.05);
    awpGroup.add(awpScope);
    this.weaponMeshes.set('awp', awpGroup);

    // 4. Deagle
    const deagleGroup = new THREE.Group();
    const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.22), gunMetalMat);
    deagleGroup.add(dBody);
    const dGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.07), gunMetalMat);
    dGrip.position.set(0, -0.09, -0.05);
    dGrip.rotation.x = -0.2;
    deagleGroup.add(dGrip);
    this.weaponMeshes.set('deagle', deagleGroup);

    // 5. Glock
    const glockGroup = new THREE.Group();
    const gBody = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.18), gunMetalMat);
    glockGroup.add(gBody);
    const gGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), gunMetalMat);
    gGrip.position.set(0, -0.08, -0.04);
    gGrip.rotation.x = -0.2;
    glockGroup.add(gGrip);
    this.weaponMeshes.set('glock', glockGroup);

    // 6. USP-S
    const uspGroup = new THREE.Group();
    const uBody = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.18), gunMetalMat);
    uspGroup.add(uBody);
    const uSilencer = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8), gunMetalMat);
    uSilencer.rotation.x = Math.PI / 2;
    uSilencer.position.set(0, 0.01, 0.16);
    uspGroup.add(uSilencer);
    const uGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), gunMetalMat);
    uGrip.position.set(0, -0.08, -0.04);
    uGrip.rotation.x = -0.2;
    uspGroup.add(uGrip);
    this.weaponMeshes.set('usp', uspGroup);

    // 7. Knife
    const knifeGroup = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.22), gunMetalMat);
    blade.position.set(0, 0, 0.1);
    knifeGroup.add(blade);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.12), woodMat);
    handle.position.set(0, 0, -0.06);
    knifeGroup.add(handle);
    this.weaponMeshes.set('knife', knifeGroup);

    // 8. C4
    const c4Group = new THREE.Group();
    const c4Body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.25), c4Mat);
    c4Group.add(c4Body);
    const c4Keypad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.14), blackMat);
    c4Keypad.position.set(0, 0.06, -0.02);
    c4Group.add(c4Keypad);
    const c4Lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.04), c4LcdMat);
    c4Lcd.rotation.x = -Math.PI / 2;
    c4Lcd.position.set(0, 0.075, 0.06);
    c4Group.add(c4Lcd);
    this.weaponMeshes.set('c4', c4Group);

    // Mount initial weapon
    this.setWeapon(this.currentWeaponId);
  }

  // Attach selected weapon
  public setWeapon(weaponId: WeaponId) {
    this.currentWeaponId = weaponId;
    // Clear existing children in weaponHolder
    while (this.weaponHolder.children.length > 0) {
      this.weaponHolder.remove(this.weaponHolder.children[0]);
    }
    const mesh = this.weaponMeshes.get(weaponId);
    if (mesh) {
      this.weaponHolder.add(mesh);
    }
  }

  // Setup Hitbox structure
  private setupHitboxes() {
    this.hitboxes = [
      {
        zone: 'head',
        box: new THREE.Box3(),
        mesh: this.head,
        multiplier: 2.5, // Headshot critical damage
      },
      {
        zone: 'chest',
        box: new THREE.Box3(),
        mesh: this.torso,
        multiplier: 1.0,
      },
      {
        zone: 'stomach',
        box: new THREE.Box3(),
        mesh: this.pelvis,
        multiplier: 1.25,
      },
      {
        zone: 'arms',
        box: new THREE.Box3(),
        mesh: this.rightUpperArm,
        multiplier: 1.0,
      },
      {
        zone: 'legs',
        box: new THREE.Box3(),
        mesh: this.leftThigh,
        multiplier: 0.75,
      },
    ];
  }

  // Update world hitboxes for collision detection
  public updateHitboxes() {
    this.root.updateMatrixWorld(true);

    const charPos = this.root.position;
    const isCrouching = this.pelvis.position.y < 0.7;
    const yOffset = isCrouching ? -0.4 : 0;

    // Head Hitbox
    this.hitboxes[0].box.setFromCenterAndSize(
      new THREE.Vector3(charPos.x, charPos.y + 1.65 + yOffset, charPos.z),
      new THREE.Vector3(0.4, 0.4, 0.4)
    );

    // Chest Hitbox
    this.hitboxes[1].box.setFromCenterAndSize(
      new THREE.Vector3(charPos.x, charPos.y + 1.25 + yOffset, charPos.z),
      new THREE.Vector3(0.55, 0.45, 0.4)
    );

    // Stomach Hitbox
    this.hitboxes[2].box.setFromCenterAndSize(
      new THREE.Vector3(charPos.x, charPos.y + 0.9 + yOffset, charPos.z),
      new THREE.Vector3(0.5, 0.35, 0.4)
    );

    // Arms Hitbox (combined bounds)
    this.hitboxes[3].box.setFromCenterAndSize(
      new THREE.Vector3(charPos.x, charPos.y + 1.2 + yOffset, charPos.z),
      new THREE.Vector3(0.85, 0.45, 0.5)
    );

    // Legs Hitbox
    this.hitboxes[4].box.setFromCenterAndSize(
      new THREE.Vector3(charPos.x, charPos.y + 0.45 + yOffset / 2, charPos.z),
      new THREE.Vector3(0.55, 0.85 + yOffset, 0.5)
    );
  }

  // Aiming pitch and yaw posture
  public setAimPosture(pitch: number, yaw: number) {
    this.root.rotation.y = yaw;

    // Spine and arms angle with pitch
    this.torso.rotation.x = pitch * 0.5;
    this.head.rotation.x = pitch * 0.5;

    // Right Arm aiming forward
    this.rightUpperArm.rotation.x = -Math.PI / 2.3 + pitch * 0.5;
    this.rightUpperArm.rotation.y = -0.25;
    this.rightForearm.rotation.x = -0.3;

    // Left Arm holding foregrip / barrel
    this.leftUpperArm.rotation.x = -Math.PI / 2.5 + pitch * 0.5;
    this.leftUpperArm.rotation.y = 0.45;
    this.leftForearm.rotation.x = -0.5;
  }

  // Update animation frame (movement walk cycle, shooting recoil, reload, death)
  public updateAnimation(dt: number, speed: number, isGrounded: boolean, isCrouching: boolean) {
    if (this.isDead) {
      // Procedural ragdoll death slump
      this.deathProgress = Math.min(1.0, this.deathProgress + dt * 3.0);
      const t = this.deathProgress;
      this.pelvis.position.y = 0.9 * (1 - t) + 0.2 * t;
      this.pelvis.rotation.x = -Math.PI / 2.2 * t;
      this.head.rotation.x = 0.6 * t;
      this.leftThigh.rotation.x = 0.8 * t;
      this.rightThigh.rotation.x = -0.4 * t;
      this.leftUpperArm.rotation.z = -1.2 * t;
      this.rightUpperArm.rotation.z = 1.2 * t;
      return;
    }

    // Crouching
    const targetHipY = isCrouching ? 0.55 : 0.9;
    this.pelvis.position.y += (targetHipY - this.pelvis.position.y) * 15 * dt;

    // Walk / Run leg swinging
    if (speed > 0.5 && isGrounded) {
      this.animTime += dt * speed * 2.8;
      const legSwing = Math.sin(this.animTime) * 0.65;
      this.leftThigh.rotation.x = legSwing;
      this.rightThigh.rotation.x = -legSwing;
      this.leftShin.rotation.x = Math.max(0, -legSwing * 0.8);
      this.rightShin.rotation.x = Math.max(0, legSwing * 0.8);

      // Subtle torso bobbing
      this.pelvis.position.y += Math.abs(Math.sin(this.animTime * 2)) * 0.03;
    } else {
      // Idle return
      this.leftThigh.rotation.x *= 0.8;
      this.rightThigh.rotation.x *= 0.8;
      this.leftShin.rotation.x *= 0.8;
      this.rightShin.rotation.x *= 0.8;
    }

    // Shooting recoil twitch
    if (this.isShooting) {
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.isShooting = false;
      }
      this.rightUpperArm.position.z = -0.05;
      this.weaponHolder.position.z = 0.1;
    } else {
      this.rightUpperArm.position.z *= 0.85;
      this.weaponHolder.position.z = 0.15;
    }

    // Reload animation
    if (this.isReloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
      }
      // Left arm drops to reload mag
      this.leftUpperArm.rotation.x = -0.2;
      this.leftForearm.rotation.x = -0.8;
    }
  }

  // Trigger shoot recoil
  public triggerShootAnim() {
    this.isShooting = true;
    this.shootTimer = 0.12;
  }

  // Trigger reload anim
  public triggerReloadAnim(duration: number) {
    this.isReloading = true;
    this.reloadTimer = duration;
  }

  // Set dead state
  public kill() {
    this.isDead = true;
    this.deathProgress = 0;
  }

  // Reset character for new round
  public reset() {
    this.isDead = false;
    this.deathProgress = 0;
    this.pelvis.position.set(0, 0.9, 0);
    this.pelvis.rotation.set(0, 0, 0);
    this.setAimPosture(0, 0);
  }
}

import * as THREE from 'three';
import { Team, Vec3 } from '../types';

// Procedural humanoid character model
// CT: Blue/dark theme, T: Yellow/tan theme
export class CharacterModel {
  group: THREE.Group;
  private head: THREE.Mesh;
  private torso: THREE.Mesh;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private weapon: THREE.Group;
  private team: Team;
  private walkPhase = 0;
  private isMoving = false;

  constructor(scene: THREE.Scene, team: Team) {
    this.team = team;
    this.group = new THREE.Group();

    // Colors
    const skinColor = 0xd4a574;
    const primaryColor = team === 'CT' ? 0x2c3e6b : 0x8b7335;
    const secondaryColor = team === 'CT' ? 0x1a2744 : 0x6b5a2a;
    const bootColor = 0x2a2a2a;
    const helmetColor = team === 'CT' ? 0x1a3050 : 0x5a4a20;

    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const primaryMat = new THREE.MeshLambertMaterial({ color: primaryColor });
    const secondaryMat = new THREE.MeshLambertMaterial({ color: secondaryColor });
    const bootMat = new THREE.MeshLambertMaterial({ color: bootColor });
    const helmetMat = new THREE.MeshLambertMaterial({ color: helmetColor });

    // HEAD (with helmet)
    const headGroup = new THREE.Group();
    // Skull
    const headGeo = new THREE.BoxGeometry(0.22, 0.25, 0.22);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.62;
    headGroup.add(this.head);
    // Helmet
    const helmetGeo = new THREE.BoxGeometry(0.26, 0.14, 0.26);
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.72;
    headGroup.add(helmet);
    // Face detail (visor area for CT, bandana for T)
    if (team === 'CT') {
      const visorGeo = new THREE.BoxGeometry(0.2, 0.06, 0.05);
      const visorMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.63, -0.12);
      headGroup.add(visor);
    } else {
      const bandanaGeo = new THREE.BoxGeometry(0.24, 0.08, 0.24);
      const bandanaMat = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
      const bandana = new THREE.Mesh(bandanaGeo, bandanaMat);
      bandana.position.y = 1.66;
      headGroup.add(bandana);
    }
    this.group.add(headGroup);

    // TORSO (upper body + lower body)
    const torsoGeo = new THREE.BoxGeometry(0.38, 0.45, 0.22);
    this.torso = new THREE.Mesh(torsoGeo, primaryMat);
    this.torso.position.y = 1.28;
    this.group.add(this.torso);

    // Belt / lower torso
    const beltGeo = new THREE.BoxGeometry(0.34, 0.15, 0.2);
    const belt = new THREE.Mesh(beltGeo, secondaryMat);
    belt.position.y = 0.98;
    this.group.add(belt);

    // Vest detail for CT
    if (team === 'CT') {
      const vestGeo = new THREE.BoxGeometry(0.3, 0.25, 0.05);
      const vestMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
      const vest = new THREE.Mesh(vestGeo, vestMat);
      vest.position.set(0, 1.32, -0.13);
      this.group.add(vest);
    }

    // LEFT ARM (upper + lower + hand)
    this.leftArm = new THREE.Group();
    const lUpperArmGeo = new THREE.BoxGeometry(0.1, 0.28, 0.1);
    const lUpperArm = new THREE.Mesh(lUpperArmGeo, primaryMat);
    lUpperArm.position.y = -0.14;
    this.leftArm.add(lUpperArm);
    const lLowerArmGeo = new THREE.BoxGeometry(0.09, 0.25, 0.09);
    const lLowerArm = new THREE.Mesh(lLowerArmGeo, skinMat);
    lLowerArm.position.y = -0.38;
    this.leftArm.add(lLowerArm);
    // Hand
    const lHandGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const lHand = new THREE.Mesh(lHandGeo, skinMat);
    lHand.position.y = -0.52;
    this.leftArm.add(lHand);
    this.leftArm.position.set(-0.24, 1.45, 0);
    this.group.add(this.leftArm);

    // RIGHT ARM (holding weapon - angled forward)
    this.rightArm = new THREE.Group();
    const rUpperArmGeo = new THREE.BoxGeometry(0.1, 0.28, 0.1);
    const rUpperArm = new THREE.Mesh(rUpperArmGeo, primaryMat);
    rUpperArm.position.y = -0.14;
    this.rightArm.add(rUpperArm);
    const rLowerArmGeo = new THREE.BoxGeometry(0.09, 0.25, 0.09);
    const rLowerArm = new THREE.Mesh(rLowerArmGeo, skinMat);
    rLowerArm.position.y = -0.38;
    this.rightArm.add(rLowerArm);
    const rHandGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const rHand = new THREE.Mesh(rHandGeo, skinMat);
    rHand.position.y = -0.52;
    this.rightArm.add(rHand);
    this.rightArm.position.set(0.24, 1.45, 0);
    // Angle arm forward for gun holding
    this.rightArm.rotation.x = -Math.PI / 3;
    this.group.add(this.rightArm);

    // LEFT LEG (thigh + shin + boot)
    this.leftLeg = new THREE.Group();
    const lThighGeo = new THREE.BoxGeometry(0.13, 0.35, 0.13);
    const lThigh = new THREE.Mesh(lThighGeo, secondaryMat);
    lThigh.position.y = -0.17;
    this.leftLeg.add(lThigh);
    const lShinGeo = new THREE.BoxGeometry(0.11, 0.35, 0.11);
    const lShin = new THREE.Mesh(lShinGeo, secondaryMat);
    lShin.position.y = -0.5;
    this.leftLeg.add(lShin);
    const lBootGeo = new THREE.BoxGeometry(0.12, 0.12, 0.18);
    const lBoot = new THREE.Mesh(lBootGeo, bootMat);
    lBoot.position.set(0, -0.7, -0.02);
    this.leftLeg.add(lBoot);
    this.leftLeg.position.set(-0.1, 0.9, 0);
    this.group.add(this.leftLeg);

    // RIGHT LEG
    this.rightLeg = new THREE.Group();
    const rThighGeo = new THREE.BoxGeometry(0.13, 0.35, 0.13);
    const rThigh = new THREE.Mesh(rThighGeo, secondaryMat);
    rThigh.position.y = -0.17;
    this.rightLeg.add(rThigh);
    const rShinGeo = new THREE.BoxGeometry(0.11, 0.35, 0.11);
    const rShin = new THREE.Mesh(rShinGeo, secondaryMat);
    rShin.position.y = -0.5;
    this.rightLeg.add(rShin);
    const rBootGeo = new THREE.BoxGeometry(0.12, 0.12, 0.18);
    const rBoot = new THREE.Mesh(rBootGeo, bootMat);
    rBoot.position.set(0, -0.7, -0.02);
    this.rightLeg.add(rBoot);
    this.rightLeg.position.set(0.1, 0.9, 0);
    this.group.add(this.rightLeg);

    // WEAPON (rifle shape attached to right arm)
    this.weapon = new THREE.Group();
    const gunBodyGeo = new THREE.BoxGeometry(0.04, 0.06, 0.5);
    const gunMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const gunBody = new THREE.Mesh(gunBodyGeo, gunMat);
    this.weapon.add(gunBody);
    // Barrel
    const barrelGeo = new THREE.BoxGeometry(0.025, 0.025, 0.3);
    const barrel = new THREE.Mesh(barrelGeo, gunMat);
    barrel.position.z = -0.35;
    this.weapon.add(barrel);
    // Magazine
    const magGeo = new THREE.BoxGeometry(0.03, 0.12, 0.06);
    const mag = new THREE.Mesh(magGeo, new THREE.MeshLambertMaterial({ color: 0x333333 }));
    mag.position.set(0, -0.08, 0.05);
    this.weapon.add(mag);
    // Stock
    const stockGeo = new THREE.BoxGeometry(0.035, 0.08, 0.15);
    const stock = new THREE.Mesh(stockGeo, new THREE.MeshLambertMaterial({ color: team === 'CT' ? 0x2a2a2a : 0x4a3520 }));
    stock.position.z = 0.3;
    this.weapon.add(stock);

    this.weapon.position.set(0.15, 1.25, -0.3);
    this.group.add(this.weapon);

    // Enable shadows
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    scene.add(this.group);
  }

  setPosition(pos: Vec3) {
    this.group.position.set(pos.x, pos.y, pos.z);
  }

  setRotation(yaw: number) {
    this.group.rotation.y = yaw;
  }

  setMoving(moving: boolean) {
    this.isMoving = moving;
  }

  setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  update(time: number) {
    if (this.isMoving) {
      this.walkPhase += 0.15;
      const swing = Math.sin(this.walkPhase) * 0.4;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.5;
    } else {
      this.leftLeg.rotation.x *= 0.9;
      this.rightLeg.rotation.x *= 0.9;
      this.leftArm.rotation.x *= 0.9;
    }
    // Subtle idle breathing
    this.torso.position.y = 1.28 + Math.sin(time * 2) * 0.005;
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    });
  }
}

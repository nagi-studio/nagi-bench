import * as THREE from 'three';
import { Team, Hitbox, WeaponType } from '../types/game';
import { WeaponMeshBuilder } from './Weapons';

export class CharacterMeshBuilder {
  /**
   * Constructs a full humanoid character with Head, Torso, Arms, Legs, and Hitboxes.
   */
  public static createHumanoid(team: Team): {
    group: THREE.Group;
    torso: THREE.Group;
    head: THREE.Mesh;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    weaponContainer: THREE.Group;
    hitboxes: Hitbox[];
  } {
    const rootGroup = new THREE.Group();
    const hitboxes: Hitbox[] = [];

    // Color materials based on CT / T faction
    const isCT = team === 'CT';

    // Skin & Clothing materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdcb898, roughness: 0.8 });
    const vestMat = new THREE.MeshStandardMaterial({
      color: isCT ? 0x1f2e45 : 0x6e593d, // Navy Blue for CT, Khaki/Brown for T
      roughness: 0.7
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: isCT ? 0x18202d : 0x3d3527, // Dark trousers
      roughness: 0.8
    });
    const gearMat = new THREE.MeshStandardMaterial({
      color: isCT ? 0x11161d : 0x221c15, // Black/Dark tactical gear
      roughness: 0.5
    });

    // 1. Torso Group (Center at Y = 1.0)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.0, 0);

    const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.26), vestMat);
    chestMesh.castShadow = true;
    torsoGroup.add(chestMesh);

    // Tactical vest straps / pouch details
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.08), gearMat);
    pouch.position.set(0, -0.1, 0.14);
    torsoGroup.add(pouch);

    rootGroup.add(torsoGroup);

    // Hitbox: Chest & Abdomen
    hitboxes.push({
      zone: 'chest',
      mesh: chestMesh,
      multiplier: 1.0
    });

    // 2. Head Group (Positioned above torso at Y = 1.48)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.48, 0);

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    if (isCT) {
      // CT Helmet + Goggles
      const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.26), gearMat);
      helmet.position.set(0, 0.07, 0);
      headGroup.add(helmet);

      const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.06), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 }));
      goggles.position.set(0, 0.02, 0.11);
      headGroup.add(goggles);
    } else {
      // T Head Bandana / Balaclava
      const bandana = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.25), new THREE.MeshStandardMaterial({ color: 0x7c2e2e, roughness: 0.9 })); // Red/dark head wrap
      bandana.position.set(0, 0.06, 0);
      headGroup.add(bandana);
    }

    rootGroup.add(headGroup);

    // Hitbox: Head
    hitboxes.push({
      zone: 'head',
      mesh: headMesh,
      multiplier: 2.0
    });

    // 3. Legs Group
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.12, 0.75, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.75, 0.18), pantsMat);
    leftLegMesh.position.set(0, -0.375, 0);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.12, 0.75, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.75, 0.18), pantsMat);
    rightLegMesh.position.set(0, -0.375, 0);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    rootGroup.add(leftLeg);
    rootGroup.add(rightLeg);

    hitboxes.push({ zone: 'leg', mesh: leftLegMesh, multiplier: 0.75 });
    hitboxes.push({ zone: 'leg', mesh: rightLegMesh, multiplier: 0.75 });

    // 4. Arms & Weapon Holding Posture
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.25, 1.2, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.14), vestMat);
    leftArmMesh.position.set(0, -0.25, 0);
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.25, 1.2, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.14), vestMat);
    rightArmMesh.position.set(0, -0.25, 0);
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);

    // Aim / Holding gun pose angles
    rightArm.rotation.x = -Math.PI / 2.5;
    rightArm.rotation.y = -0.3;
    leftArm.rotation.x = -Math.PI / 2.2;
    leftArm.rotation.y = 0.5;

    rootGroup.add(leftArm);
    rootGroup.add(rightArm);

    hitboxes.push({ zone: 'arm', mesh: leftArmMesh, multiplier: 0.8 });
    hitboxes.push({ zone: 'arm', mesh: rightArmMesh, multiplier: 0.8 });

    // 5. Weapon Container attached to right arm / torso
    const weaponContainer = new THREE.Group();
    weaponContainer.position.set(0.18, 1.05, -0.35);
    rootGroup.add(weaponContainer);

    return {
      group: rootGroup,
      torso: torsoGroup,
      head: headMesh,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      weaponContainer,
      hitboxes
    };
  }

  /**
   * Updates leg swinging walk animation for humanoid models.
   */
  public static animateWalk(
    leftLeg: THREE.Group,
    rightLeg: THREE.Group,
    walkCycle: number,
    isMoving: boolean
  ) {
    if (!isMoving) {
      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 0.15);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 0.15);
      return;
    }

    const angle = Math.sin(walkCycle * 10) * 0.6;
    leftLeg.rotation.x = angle;
    rightLeg.rotation.x = -angle;
  }
}

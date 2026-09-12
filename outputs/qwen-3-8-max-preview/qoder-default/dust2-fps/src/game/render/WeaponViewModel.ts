import * as THREE from 'three';
import { WeaponSlot, WeaponId, CharacterState, WEAPONS } from '../types';

// First-person weapon view model
export class WeaponViewModel {
  private group: THREE.Group;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private currentMesh: THREE.Group | null = null;
  private bobPhase = 0;
  private recoilAnim = 0;
  private currentWeaponId: WeaponId = 'usp';

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new THREE.Group();
    this.group.scale.set(2.5, 2.5, 2.5); // Scale up for visibility
    this.camera.add(this.group);
    if (!scene.children.includes(camera)) {
      scene.add(camera);
    }
    this.buildWeaponModel('usp');
  }

  switchWeapon(slot: WeaponSlot, weaponId: WeaponId) {
    this.currentWeaponId = weaponId;
    this.buildWeaponModel(weaponId);
  }

  private buildWeaponModel(weaponId: WeaponId) {
    // Remove old model
    if (this.currentMesh) {
      this.group.remove(this.currentMesh);
      this.currentMesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    }

    const weaponGroup = new THREE.Group();
    const darkMetal = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const lightMetal = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    const greenMat = new THREE.MeshLambertMaterial({ color: 0x2a4a2a });

    switch (weaponId) {
      case 'ak47': {
        // AK-47: distinctive curved magazine, wood furniture
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.55), darkMetal);
        weaponGroup.add(body);
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.35), darkMetal);
        barrel.position.z = -0.4;
        weaponGroup.add(barrel);
        // Curved magazine
        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.05), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        mag.position.set(0, -0.08, 0.05);
        mag.rotation.x = 0.2;
        weaponGroup.add(mag);
        // Wood stock
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.2), woodMat);
        stock.position.z = 0.35;
        weaponGroup.add(stock);
        // Wood handguard
        const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.15), woodMat);
        handguard.position.z = -0.2;
        weaponGroup.add(handguard);
        // Gas tube
        const gasTube = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.2), darkMetal);
        gasTube.position.set(0, 0.025, -0.25);
        weaponGroup.add(gasTube);
        weaponGroup.position.set(0.22, -0.18, -0.45);
        break;
      }
      case 'm4a4': {
        // M4A4: sleek, tactical rail
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.5), darkMetal);
        weaponGroup.add(body);
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.35), darkMetal);
        barrel.position.z = -0.38;
        weaponGroup.add(barrel);
        // Rail system
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.015, 0.3), lightMetal);
        rail.position.set(0, 0.025, -0.15);
        weaponGroup.add(rail);
        // Magazine (straight)
        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.04), lightMetal);
        mag.position.set(0, -0.07, 0.05);
        weaponGroup.add(mag);
        // Stock (collapsible)
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.04, 0.18), darkMetal);
        stock.position.z = 0.32;
        weaponGroup.add(stock);
        // Suppressor
        const suppressor = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.1), lightMetal);
        suppressor.position.z = -0.5;
        weaponGroup.add(suppressor);
        weaponGroup.position.set(0.22, -0.18, -0.45);
        break;
      }
      case 'awp': {
        // AWP: long barrel, scope, green body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, 0.65), greenMat);
        weaponGroup.add(body);
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.45), darkMetal);
        barrel.position.z = -0.5;
        weaponGroup.add(barrel);
        // Scope
        const scopeBody = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.15), darkMetal);
        scopeBody.position.set(0, 0.04, -0.1);
        weaponGroup.add(scopeBody);
        const scopeLens = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.01), new THREE.MeshLambertMaterial({ color: 0x4488ff }));
        scopeLens.position.set(0, 0.04, -0.18);
        weaponGroup.add(scopeLens);
        // Magazine
        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1, 0.05), greenMat);
        mag.position.set(0, -0.07, 0.1);
        weaponGroup.add(mag);
        // Stock
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.2), greenMat);
        stock.position.z = 0.4;
        weaponGroup.add(stock);
        // Bolt
        const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.06), lightMetal);
        bolt.position.set(0.02, 0.02, 0.15);
        weaponGroup.add(bolt);
        weaponGroup.position.set(0.22, -0.18, -0.45);
        break;
      }
      case 'glock': {
        // Glock: compact pistol
        const slide = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 0.2), darkMetal);
        weaponGroup.add(slide);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.025, 0.16), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        frame.position.y = -0.025;
        weaponGroup.add(frame);
        // Grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.08, 0.03), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        grip.position.set(0, -0.06, 0.06);
        grip.rotation.x = 0.2;
        weaponGroup.add(grip);
        // Magazine base
        const magBase = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.02, 0.025), darkMetal);
        magBase.position.set(0, -0.1, 0.06);
        weaponGroup.add(magBase);
        weaponGroup.position.set(0.18, -0.16, -0.35);
        break;
      }
      case 'usp': {
        // USP-S: with suppressor
        const slide = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 0.2), lightMetal);
        weaponGroup.add(slide);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.025, 0.16), darkMetal);
        frame.position.y = -0.025;
        weaponGroup.add(frame);
        // Suppressor
        const suppressor = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.12), darkMetal);
        suppressor.position.z = -0.15;
        weaponGroup.add(suppressor);
        // Grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.08, 0.03), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
        grip.position.set(0, -0.06, 0.06);
        grip.rotation.x = 0.2;
        weaponGroup.add(grip);
        weaponGroup.position.set(0.18, -0.16, -0.35);
        break;
      }
      case 'deagle': {
        // Desert Eagle: large pistol
        const slide = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.24), lightMetal);
        weaponGroup.add(slide);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.03, 0.2), lightMetal);
        frame.position.y = -0.03;
        weaponGroup.add(frame);
        // Large grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.09, 0.04), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
        grip.position.set(0, -0.07, 0.07);
        grip.rotation.x = 0.25;
        weaponGroup.add(grip);
        // Barrel (thick)
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.06), lightMetal);
        barrel.position.z = -0.14;
        weaponGroup.add(barrel);
        weaponGroup.position.set(0.18, -0.16, -0.35);
        break;
      }
      case 'knife': {
        // Knife
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.02, 0.18), new THREE.MeshLambertMaterial({ color: 0xcccccc }));
        blade.position.z = -0.1;
        weaponGroup.add(blade);
        // Blade tip (angled)
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.015, 0.05), new THREE.MeshLambertMaterial({ color: 0xdddddd }));
        tip.position.set(0, 0.005, -0.2);
        tip.rotation.x = -0.2;
        weaponGroup.add(tip);
        // Handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.1), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
        handle.position.z = 0.05;
        weaponGroup.add(handle);
        // Guard
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.01), darkMetal);
        guard.position.z = -0.01;
        weaponGroup.add(guard);
        weaponGroup.position.set(0.22, -0.16, -0.3);
        weaponGroup.rotation.x = -0.3;
        break;
      }
    }

    this.currentMesh = weaponGroup;
    this.group.add(weaponGroup);
  }

  update(dt: number, char: CharacterState) {
    if (!this.currentMesh) return;

    // Weapon bob when moving
    const isMoving = Math.abs(char.velocity.x) > 0.5 || Math.abs(char.velocity.z) > 0.5;
    if (isMoving && char.isGrounded) {
      this.bobPhase += dt * 8;
    } else {
      this.bobPhase += dt * 1;
    }

    const bobX = Math.sin(this.bobPhase) * (isMoving ? 0.008 : 0.002);
    const bobY = Math.abs(Math.cos(this.bobPhase)) * (isMoving ? 0.006 : 0.001);

    // Recoil animation
    if (char.fireTimer > 0) {
      this.recoilAnim = 0.03;
    }
    this.recoilAnim *= 0.85;

    // Scope position
    const weaponData = WEAPONS[this.currentWeaponId];
    if (char.isScoped && weaponData.scopeZoom > 1) {
      // Move weapon to center for scope
      this.currentMesh.position.x += (0 - this.currentMesh.position.x) * 0.2;
      this.currentMesh.position.y += (-0.16 - this.currentMesh.position.y) * 0.2;
    } else {
      const basePos = this.getBasePosition();
      this.currentMesh.position.x += (basePos.x + bobX - this.currentMesh.position.x) * 0.15;
      this.currentMesh.position.y += (basePos.y + bobY - this.currentMesh.position.y) * 0.15;
      this.currentMesh.position.z += (basePos.z + this.recoilAnim - this.currentMesh.position.z) * 0.15;
    }
  }

  private getBasePosition(): THREE.Vector3 {
    switch (this.currentWeaponId) {
      case 'ak47':
      case 'm4a4':
      case 'awp':
        return new THREE.Vector3(0.22, -0.18, -0.45);
      case 'glock':
      case 'usp':
      case 'deagle':
        return new THREE.Vector3(0.18, -0.16, -0.35);
      case 'knife':
        return new THREE.Vector3(0.22, -0.16, -0.3);
      default:
        return new THREE.Vector3(0.22, -0.18, -0.45);
    }
  }
}

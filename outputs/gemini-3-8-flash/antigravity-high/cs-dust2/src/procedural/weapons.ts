import * as THREE from 'three';
import { WeaponId, WeaponData } from '../types/game';

// Weapon balance & statistical configurations
export const WEAPON_CONFIGS: Record<WeaponId, WeaponData> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    damage: 36,
    headshotMultiplier: 4.0, // 144 dmg -> 1-tap kill
    armorPenetration: 0.775,
    fireRate: 10, // 600 RPM
    magazineSize: 30,
    maxReserveAmmo: 90,
    reloadTime: 2.2,
    recoilVertical: 0.05,
    recoilHorizontal: 0.02,
    spread: 0.016,
    range: 120,
    automatic: true,
    price: 2700,
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    damage: 31,
    headshotMultiplier: 3.2, // ~99.2 vs armor (2-tap)
    armorPenetration: 0.70,
    fireRate: 11.1, // 666 RPM
    magazineSize: 30,
    maxReserveAmmo: 90,
    reloadTime: 2.0,
    recoilVertical: 0.032,
    recoilHorizontal: 0.012,
    spread: 0.011,
    range: 120,
    automatic: true,
    price: 3100,
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    damage: 115,
    headshotMultiplier: 4.0, // 460 dmg
    armorPenetration: 0.975,
    fireRate: 0.69, // ~1.45s cycle time
    magazineSize: 5,
    maxReserveAmmo: 30,
    reloadTime: 3.2,
    recoilVertical: 0.12,
    recoilHorizontal: 0.01,
    spread: 0.002, // very accurate when scoped & stationary
    range: 200,
    automatic: false,
    scoped: true,
    price: 4750,
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    damage: 28,
    headshotMultiplier: 3.5, // 98 dmg (near 1-tap unarmored)
    armorPenetration: 0.47,
    fireRate: 6.6, // 400 RPM
    magazineSize: 20,
    maxReserveAmmo: 120,
    reloadTime: 1.8,
    recoilVertical: 0.02,
    recoilHorizontal: 0.008,
    spread: 0.022,
    range: 60,
    automatic: false,
    price: 200,
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    damage: 35,
    headshotMultiplier: 3.5, // 122 dmg
    armorPenetration: 0.505,
    fireRate: 5.8, // 350 RPM
    magazineSize: 12,
    maxReserveAmmo: 24,
    reloadTime: 1.9,
    recoilVertical: 0.018,
    recoilHorizontal: 0.006,
    spread: 0.014,
    range: 75,
    automatic: false,
    price: 200,
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    damage: 53,
    headshotMultiplier: 4.0, // 212 dmg (1-tap kill)
    armorPenetration: 0.93,
    fireRate: 3.5, // 210 RPM
    magazineSize: 7,
    maxReserveAmmo: 35,
    reloadTime: 2.1,
    recoilVertical: 0.075,
    recoilHorizontal: 0.025,
    spread: 0.02,
    range: 85,
    automatic: false,
    price: 700,
  },
  knife: {
    id: 'knife',
    name: 'Knife',
    slot: 'knife',
    damage: 55,
    headshotMultiplier: 1.0,
    armorPenetration: 0.85,
    fireRate: 1.8,
    magazineSize: 1,
    maxReserveAmmo: 1,
    reloadTime: 0.1,
    recoilVertical: 0.01,
    recoilHorizontal: 0.01,
    spread: 0.0,
    range: 2.2, // Melee range
    automatic: false,
    price: 0,
  },
  c4: {
    id: 'c4',
    name: 'C4 Explosive',
    slot: 'c4',
    damage: 500,
    headshotMultiplier: 1.0,
    armorPenetration: 1.0,
    fireRate: 1,
    magazineSize: 1,
    maxReserveAmmo: 1,
    reloadTime: 0,
    recoilVertical: 0,
    recoilHorizontal: 0,
    spread: 0,
    range: 4,
    automatic: false,
    price: 0,
  },
};

export class WeaponFactory {
  // Shared materials to optimize rendering
  private static matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });
  private static matSteel = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.7 });
  private static matChrome = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.15, metalness: 0.95 });
  private static matWood = new THREE.MeshStandardMaterial({ color: 0x6e3b1f, roughness: 0.7, metalness: 0.1 });
  private static matOlive = new THREE.MeshStandardMaterial({ color: 0x3d4834, roughness: 0.6, metalness: 0.2 });
  private static matBlackPolymer = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.7, metalness: 0.2 });
  private static matGlass = new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.1, metalness: 0.9 });
  private static matC4Plastic = new THREE.MeshStandardMaterial({ color: 0xb59963, roughness: 0.8, metalness: 0.1 });
  private static matRedLED = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  public static createWeaponModel(weaponId: WeaponId, isFirstPerson: boolean = true): THREE.Group {
    const root = new THREE.Group();
    root.name = `weapon_${weaponId}_${isFirstPerson ? 'fp' : 'tp'}`;

    switch (weaponId) {
      case 'ak47':
        this.buildAK47(root);
        break;
      case 'm4a4':
        this.buildM4A4(root);
        break;
      case 'awp':
        this.buildAWP(root);
        break;
      case 'glock':
        this.buildGlock(root);
        break;
      case 'usp':
        this.buildUSP(root);
        break;
      case 'deagle':
        this.buildDeagle(root);
        break;
      case 'knife':
        this.buildKnife(root);
        break;
      case 'c4':
        this.buildC4(root);
        break;
    }

    // Scale and adjust for first person vs third person
    if (isFirstPerson) {
      root.scale.set(1, 1, 1);
    } else {
      root.scale.set(0.65, 0.65, 0.65);
    }

    return root;
  }

  // 1. Procedural AK-47
  private static buildAK47(root: THREE.Group) {
    // Receiver (dark metal box)
    const receiverGeo = new THREE.BoxGeometry(0.06, 0.08, 0.36);
    const receiver = new THREE.Mesh(receiverGeo, this.matDarkMetal);
    root.add(receiver);

    // Dust cover (curved top)
    const coverGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 8, 1, false, 0, Math.PI);
    coverGeo.rotateZ(Math.PI / 2);
    coverGeo.rotateY(Math.PI / 2);
    const cover = new THREE.Mesh(coverGeo, this.matSteel);
    cover.position.set(0, 0.045, 0);
    root.add(cover);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.44, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, this.matSteel);
    barrel.position.set(0, 0.02, -0.38);
    root.add(barrel);

    // Gas tube above barrel
    const gasGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8);
    gasGeo.rotateX(Math.PI / 2);
    const gasTube = new THREE.Mesh(gasGeo, this.matSteel);
    gasTube.position.set(0, 0.045, -0.28);
    root.add(gasTube);

    // Wooden handguard
    const guardGeo = new THREE.BoxGeometry(0.065, 0.075, 0.22);
    const guard = new THREE.Mesh(guardGeo, this.matWood);
    guard.position.set(0, 0.025, -0.26);
    root.add(guard);

    // Wooden Stock
    const stockGeo = new THREE.BoxGeometry(0.05, 0.11, 0.32);
    const stock = new THREE.Mesh(stockGeo, this.matWood);
    stock.position.set(0, -0.02, 0.32);
    stock.rotation.x = -0.08;
    root.add(stock);

    // Pistol grip
    const gripGeo = new THREE.BoxGeometry(0.045, 0.13, 0.06);
    const grip = new THREE.Mesh(gripGeo, this.matWood);
    grip.position.set(0, -0.09, 0.12);
    grip.rotation.x = 0.35;
    root.add(grip);

    // Curved Banana Magazine
    const magGeo = new THREE.BoxGeometry(0.045, 0.22, 0.09);
    const mag = new THREE.Mesh(magGeo, this.matWood); // Orange-brown Bakelite
    mag.position.set(0, -0.12, -0.05);
    mag.rotation.x = -0.35;
    root.add(mag);

    // Front iron sight
    const sightGeo = new THREE.BoxGeometry(0.012, 0.05, 0.02);
    const sight = new THREE.Mesh(sightGeo, this.matSteel);
    sight.position.set(0, 0.055, -0.56);
    root.add(sight);

    // Muzzle flash anchor point at tip
    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.02, -0.62);
    root.add(muzzle);
  }

  // 2. Procedural M4A4
  private static buildM4A4(root: THREE.Group) {
    // Lower & Upper Receiver
    const recGeo = new THREE.BoxGeometry(0.055, 0.09, 0.32);
    const rec = new THREE.Mesh(recGeo, this.matDarkMetal);
    root.add(rec);

    // Handguard / Quad rail
    const handguardGeo = new THREE.BoxGeometry(0.06, 0.07, 0.28);
    const handguard = new THREE.Mesh(handguardGeo, this.matDarkMetal);
    handguard.position.set(0, 0.01, -0.28);
    root.add(handguard);

    // Outer Barrel with Flash Hider
    const barrelGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.36, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, this.matSteel);
    barrel.position.set(0, 0.015, -0.42);
    root.add(barrel);

    // Flash hider
    const flashHiderGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.06, 8);
    flashHiderGeo.rotateX(Math.PI / 2);
    const hider = new THREE.Mesh(flashHiderGeo, this.matSteel);
    hider.position.set(0, 0.015, -0.61);
    root.add(hider);

    // Buffer tube & Crane Stock
    const tubeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.18, 8);
    tubeGeo.rotateX(Math.PI / 2);
    const tube = new THREE.Mesh(tubeGeo, this.matSteel);
    tube.position.set(0, 0.02, 0.22);
    root.add(tube);

    const stockGeo = new THREE.BoxGeometry(0.05, 0.12, 0.22);
    const stock = new THREE.Mesh(stockGeo, this.matBlackPolymer);
    stock.position.set(0, -0.01, 0.3);
    root.add(stock);

    // Pistol Grip
    const gripGeo = new THREE.BoxGeometry(0.045, 0.12, 0.055);
    const grip = new THREE.Mesh(gripGeo, this.matBlackPolymer);
    grip.position.set(0, -0.09, 0.08);
    grip.rotation.x = 0.3;
    root.add(grip);

    // Straight STANAG Magazine
    const magGeo = new THREE.BoxGeometry(0.04, 0.18, 0.08);
    const mag = new THREE.Mesh(magGeo, this.matSteel);
    mag.position.set(0, -0.11, -0.06);
    mag.rotation.x = -0.15;
    root.add(mag);

    // Top Picatinny Rail / Carry Sight
    const railGeo = new THREE.BoxGeometry(0.025, 0.02, 0.24);
    const rail = new THREE.Mesh(railGeo, this.matDarkMetal);
    rail.position.set(0, 0.055, -0.02);
    root.add(rail);

    const sightGeo = new THREE.BoxGeometry(0.025, 0.04, 0.04);
    const sight = new THREE.Mesh(sightGeo, this.matBlackPolymer);
    sight.position.set(0, 0.08, 0.08);
    root.add(sight);

    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.015, -0.65);
    root.add(muzzle);
  }

  // 3. Procedural AWP
  private static buildAWP(root: THREE.Group) {
    // Long Olive Green Stock & Chassis
    const chassisGeo = new THREE.BoxGeometry(0.07, 0.09, 0.7);
    const chassis = new THREE.Mesh(chassisGeo, this.matOlive);
    root.add(chassis);

    // Thumbhole stock cutout
    const stockHoleGeo = new THREE.BoxGeometry(0.065, 0.13, 0.28);
    const stockRear = new THREE.Mesh(stockHoleGeo, this.matOlive);
    stockRear.position.set(0, -0.03, 0.42);
    root.add(stockRear);

    // Rubber buttpad
    const buttPadGeo = new THREE.BoxGeometry(0.07, 0.14, 0.03);
    const buttPad = new THREE.Mesh(buttPadGeo, this.matBlackPolymer);
    buttPad.position.set(0, -0.03, 0.57);
    root.add(buttPad);

    // Bolt-action receiver
    const boltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8);
    boltGeo.rotateX(Math.PI / 2);
    const bolt = new THREE.Mesh(boltGeo, this.matSteel);
    bolt.position.set(0, 0.05, 0.02);
    root.add(bolt);

    // Bolt handle
    const handleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8);
    const handle = new THREE.Mesh(handleGeo, this.matSteel);
    handle.position.set(0.04, 0.05, 0.08);
    handle.rotation.z = Math.PI / 2.5;
    root.add(handle);

    // Long heavy fluted barrel
    const barrelGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.65, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, this.matSteel);
    barrel.position.set(0, 0.05, -0.62);
    root.add(barrel);

    // Massive AWP Muzzle Brake
    const brakeGeo = new THREE.BoxGeometry(0.038, 0.035, 0.09);
    const brake = new THREE.Mesh(brakeGeo, this.matDarkMetal);
    brake.position.set(0, 0.05, -0.96);
    root.add(brake);

    // Massive Telescopic Scope
    const scopeTubeGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.32, 12);
    scopeTubeGeo.rotateX(Math.PI / 2);
    const scopeTube = new THREE.Mesh(scopeTubeGeo, this.matDarkMetal);
    scopeTube.position.set(0, 0.12, -0.05);
    root.add(scopeTube);

    // Scope objective bell (front flare)
    const objGeo = new THREE.CylinderGeometry(0.034, 0.024, 0.09, 12);
    objGeo.rotateX(-Math.PI / 2);
    const objBell = new THREE.Mesh(objGeo, this.matDarkMetal);
    objBell.position.set(0, 0.12, -0.24);
    root.add(objBell);

    // Glass lens
    const lensGeo = new THREE.CircleGeometry(0.03, 12);
    const lens = new THREE.Mesh(lensGeo, this.matGlass);
    lens.position.set(0, 0.12, -0.286);
    lens.rotation.y = Math.PI;
    root.add(lens);

    // Scope mounts
    const mountGeo = new THREE.BoxGeometry(0.035, 0.04, 0.025);
    const mount1 = new THREE.Mesh(mountGeo, this.matSteel);
    mount1.position.set(0, 0.08, 0.05);
    const mount2 = new THREE.Mesh(mountGeo, this.matSteel);
    mount2.position.set(0, 0.08, -0.15);
    root.add(mount1, mount2);

    // 5-Round AWP Box Magazine
    const magGeo = new THREE.BoxGeometry(0.045, 0.09, 0.11);
    const mag = new THREE.Mesh(magGeo, this.matSteel);
    mag.position.set(0, -0.07, -0.04);
    root.add(mag);

    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.05, -1.02);
    root.add(muzzle);
  }

  // 4. Procedural Glock-18
  private static buildGlock(root: THREE.Group) {
    // Grip
    const gripGeo = new THREE.BoxGeometry(0.035, 0.11, 0.05);
    const grip = new THREE.Mesh(gripGeo, this.matBlackPolymer);
    grip.position.set(0, -0.06, 0.03);
    grip.rotation.x = 0.25;
    root.add(grip);

    // Frame & Trigger guard
    const frameGeo = new THREE.BoxGeometry(0.038, 0.04, 0.18);
    const frame = new THREE.Mesh(frameGeo, this.matBlackPolymer);
    frame.position.set(0, 0, -0.02);
    root.add(frame);

    // Slide
    const slideGeo = new THREE.BoxGeometry(0.04, 0.045, 0.2);
    const slide = new THREE.Mesh(slideGeo, this.matDarkMetal);
    slide.position.set(0, 0.032, -0.03);
    root.add(slide);

    // Front and Rear sights
    const fSightGeo = new THREE.BoxGeometry(0.008, 0.015, 0.01);
    const fSight = new THREE.Mesh(fSightGeo, this.matBlackPolymer);
    fSight.position.set(0, 0.06, -0.12);
    root.add(fSight);

    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.032, -0.15);
    root.add(muzzle);
  }

  // 5. Procedural USP-S
  private static buildUSP(root: THREE.Group) {
    // Tactical Grip
    const gripGeo = new THREE.BoxGeometry(0.034, 0.12, 0.05);
    const grip = new THREE.Mesh(gripGeo, this.matBlackPolymer);
    grip.position.set(0, -0.06, 0.03);
    grip.rotation.x = 0.22;
    root.add(grip);

    // Frame
    const frameGeo = new THREE.BoxGeometry(0.036, 0.04, 0.19);
    const frame = new THREE.Mesh(frameGeo, this.matBlackPolymer);
    frame.position.set(0, 0, -0.02);
    root.add(frame);

    // Slide (Silver / Matte Black dual tone)
    const slideGeo = new THREE.BoxGeometry(0.038, 0.045, 0.21);
    const slide = new THREE.Mesh(slideGeo, this.matDarkMetal);
    slide.position.set(0, 0.032, -0.03);
    root.add(slide);

    // Long Screw-on Silencer / Suppressor
    const silencerGeo = new THREE.CylinderGeometry(0.019, 0.019, 0.22, 12);
    silencerGeo.rotateX(Math.PI / 2);
    const silencer = new THREE.Mesh(silencerGeo, this.matDarkMetal);
    silencer.position.set(0, 0.032, -0.24);
    root.add(silencer);

    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.032, -0.36);
    root.add(muzzle);
  }

  // 6. Procedural Desert Eagle
  private static buildDeagle(root: THREE.Group) {
    // Heavy Grip
    const gripGeo = new THREE.BoxGeometry(0.042, 0.13, 0.065);
    const grip = new THREE.Mesh(gripGeo, this.matBlackPolymer);
    grip.position.set(0, -0.07, 0.04);
    grip.rotation.x = 0.25;
    root.add(grip);

    // Massive Chrome Lower Frame
    const frameGeo = new THREE.BoxGeometry(0.048, 0.05, 0.22);
    const frame = new THREE.Mesh(frameGeo, this.matChrome);
    frame.position.set(0, 0, -0.03);
    root.add(frame);

    // Huge Angular Chrome Slide
    const slideGeo = new THREE.BoxGeometry(0.05, 0.06, 0.27);
    const slide = new THREE.Mesh(slideGeo, this.matChrome);
    slide.position.set(0, 0.042, -0.05);
    root.add(slide);

    // Top Barrel Flat Top with Recoil Compensator
    const compGeo = new THREE.BoxGeometry(0.044, 0.05, 0.06);
    const comp = new THREE.Mesh(compGeo, this.matDarkMetal);
    comp.position.set(0, 0.042, -0.2);
    root.add(comp);

    const muzzle = new THREE.Object3D();
    muzzle.name = 'muzzle_point';
    muzzle.position.set(0, 0.042, -0.24);
    root.add(muzzle);
  }

  // 7. Procedural Tactical Knife
  private static buildKnife(root: THREE.Group) {
    // Handle
    const handleGeo = new THREE.BoxGeometry(0.03, 0.045, 0.15);
    const handle = new THREE.Mesh(handleGeo, this.matBlackPolymer);
    handle.position.set(0, 0, 0.05);
    root.add(handle);

    // Crossguard
    const guardGeo = new THREE.BoxGeometry(0.04, 0.06, 0.015);
    const guard = new THREE.Mesh(guardGeo, this.matSteel);
    guard.position.set(0, 0, -0.03);
    root.add(guard);

    // Tanto Blade
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.025);
    bladeShape.lineTo(0.18, -0.025);
    bladeShape.lineTo(0.24, 0.01);
    bladeShape.lineTo(0, 0.015);
    bladeShape.closePath();

    const extrudeSettings = { depth: 0.008, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.002, bevelThickness: 0.002 };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    bladeGeo.rotateY(Math.PI / 2);
    bladeGeo.rotateZ(Math.PI / 2);
    const blade = new THREE.Mesh(bladeGeo, this.matSteel);
    blade.position.set(0.004, 0, -0.04);
    root.add(blade);
  }

  // 8. Procedural C4 Bomb
  private static buildC4(root: THREE.Group) {
    // C4 Explosive compound blocks (yellow-tan)
    const block1Geo = new THREE.BoxGeometry(0.15, 0.08, 0.22);
    const block1 = new THREE.Mesh(block1Geo, this.matC4Plastic);
    root.add(block1);

    // Duct Tape wraps
    const tapeGeo = new THREE.BoxGeometry(0.155, 0.085, 0.04);
    const tape1 = new THREE.Mesh(tapeGeo, this.matDarkMetal);
    tape1.position.set(0, 0, -0.06);
    const tape2 = new THREE.Mesh(tapeGeo, this.matDarkMetal);
    tape2.position.set(0, 0, 0.06);
    root.add(tape1, tape2);

    // Digital Keypad / Timer unit
    const timerGeo = new THREE.BoxGeometry(0.1, 0.03, 0.12);
    const timer = new THREE.Mesh(timerGeo, this.matBlackPolymer);
    timer.position.set(0, 0.05, 0);
    root.add(timer);

    // Red LED Light
    const ledGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const led = new THREE.Mesh(ledGeo, this.matRedLED);
    led.name = 'c4_led';
    led.position.set(0.03, 0.07, 0.03);
    root.add(led);

    // Detonator wires
    const wireGeo = new THREE.TorusGeometry(0.04, 0.004, 6, 12, Math.PI);
    wireGeo.rotateX(Math.PI / 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(-0.04, 0.04, -0.04);
    root.add(wire);
  }
}

import * as THREE from 'three';
import type { CharacterVisual, Team, WeaponId } from './types';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const materialCache = new Map<number, THREE.MeshStandardMaterial>();
const vertexMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .7, metalness: .12 });
function batchParts(parent: THREE.Object3D) {
  const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] = [];
  for (const object of [...parent.children]) {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || object.geometry !== unitBox || Array.isArray(object.material)) continue;
    boxes.push(object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>);
  }
  if (boxes.length < 2) return;
  const positions: number[] = [], normals: number[] = [], colors: number[] = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
  for (const box of boxes) {
    box.updateMatrix(); normalMatrix.getNormalMatrix(box.matrix);
    const attribute = unitBox.getAttribute('position'), normal = unitBox.getAttribute('normal'), index = unitBox.getIndex()!;
    const color = box.material.color;
    for (let i = 0; i < index.count; i++) {
      const id = index.getX(i); p.fromBufferAttribute(attribute, id).applyMatrix4(box.matrix); n.fromBufferAttribute(normal, id).applyMatrix3(normalMatrix).normalize();
      positions.push(p.x, p.y, p.z); normals.push(n.x, n.y, n.z); colors.push(color.r, color.g, color.b);
    }
    parent.remove(box);
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, vertexMaterial); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
}
function material(color: number) {
  if (!materialCache.has(color)) materialCache.set(color, new THREE.MeshStandardMaterial({ color, roughness: .7, metalness: color === 0xbac5c4 ? .75 : .12 }));
  return materialCache.get(color)!;
}
export function part(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, color: number) {
  const mesh = new THREE.Mesh(unitBox, material(color)); mesh.position.set(x, y, z); mesh.scale.set(w, h, d); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function tube(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, length: number, color: number) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material(color)); mesh.rotation.x = Math.PI / 2; mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
}
export function createGun(id: WeaponId) {
  const g = new THREE.Group(); g.name = id;
  const metal = 0x323b3b, dark = 0x202827;
  let muzzleZ = -.7;
  if (id === 'knife') {
    part(g, 0, .01, -.06, .07, .07, .23, 0x373d34);
    part(g, 0, .01, -.19, .17, .035, .04, 0x6c7975);
    const shape = new THREE.Shape(); shape.moveTo(-.045, 0); shape.lineTo(-.045, .28); shape.lineTo(.025, .4); shape.lineTo(.065, .02); shape.closePath();
    const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .012, bevelEnabled: false }), material(0xbac5c4)); blade.rotation.x = -Math.PI / 2; blade.position.set(0, .012, -.2); g.add(blade); muzzleZ = -.59;
  } else if (id === 'glock' || id === 'usp' || id === 'deagle') {
    const isDeagle = id === 'deagle', c = isDeagle ? 0x9aa4a5 : metal;
    part(g, 0, .02, -.15, isDeagle ? .095 : .075, .1, isDeagle ? .35 : .27, c);
    part(g, 0, -.08, -.045, .074, .17, .105, dark).rotation.x = -.15;
    part(g, 0, -.05, -.16, .025, .025, .09, 0x707979);
    part(g, 0, .085, -.22, .025, .028, .04, dark);
    part(g, 0, .085, -.04, .065, .025, .035, dark);
    for (let i = 0; i < 5; i++) part(g, 0, .02, -.07 + i * .013, .079, .065, .004, 0x56615f);
    muzzleZ = isDeagle ? -.35 : -.3;
    if (id === 'usp') { tube(g, 0, .025, -.4, .027, .22, dark); muzzleZ = -.52; }
  } else {
    const ak = id === 'ak47', awp = id === 'awp';
    const stock = ak ? 0x936139 : awp ? 0x63764d : 0x495753;
    part(g, 0, .025, -.21, awp ? .105 : .09, .13, .36, metal);
    part(g, 0, -.07, -.03, .075, .16, .09, dark).rotation.x = -.3;
    part(g, 0, -.055, .08, .09, .12, .3, stock);
    part(g, 0, -.08, .22, .115, .18, .045, dark);
    part(g, 0, .016, -.46, .1, .105, .25, stock);
    tube(g, 0, .027, -.7, awp ? .024 : .017, awp ? .38 : .25, dark);
    tube(g, 0, .027, awp ? -.92 : -.84, awp ? .035 : .024, .07, metal);
    if (!awp) {
      const mag = part(g, 0, -.14, -.24, .065, .25, .12, ak ? 0x3d4140 : 0x56625f); mag.rotation.x = ak ? -.25 : .1;
      part(g, 0, .105, -.51, .035, .075, .03, dark);
      part(g, 0, .105, -.12, .07, .035, .06, dark);
      if (!ak) for (let i = 0; i < 6; i++) part(g, 0, .08, -.36 - i * .025, .11, .025, .009, 0x262f2c);
    } else {
      part(g, 0, -.09, -.25, .075, .1, .14, dark);
      part(g, 0, .13, -.24, .065, .11, .06, dark);
      tube(g, 0, .19, -.3, .045, .3, metal);
      tube(g, 0, .19, -.47, .06, .06, dark);
      const glass = tube(g, 0, .19, -.506, .043, .005, 0x69b4bd); (glass.material as THREE.MeshStandardMaterial).metalness = .5;
      part(g, .08, .055, -.14, .09, .025, .035, 0x81918b);
    }
    muzzleZ = awp ? -.97 : -.89;
  }
  const flash = new THREE.Group(); flash.name = 'muzzle'; flash.position.set(0, .03, muzzleZ); flash.visible = false;
  const fm = new THREE.MeshBasicMaterial({ color: 0xffdb8a, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(.085, .27, 6), fm); cone.rotation.x = -Math.PI / 2; cone.position.z = -.08; flash.add(cone);
  const cross = new THREE.Mesh(new THREE.OctahedronGeometry(.11), fm); cross.scale.set(1, .4, 1.7); flash.add(cross); g.add(flash);
  batchParts(g); return g;
}

export function createCharacter(team: Team, weaponId: WeaponId): CharacterVisual {
  const root = new THREE.Group();
  const ct = team === 'CT', cloth = ct ? 0x344e61 : 0xa8754f, pants = ct ? 0x283a49 : 0x6a6652, vest = ct ? 0x263a42 : 0x6c5740, skin = 0xbc9677;
  part(root, 0, 1.2, 0, .59, .52, .32, cloth);
  part(root, 0, 1.22, -.09, .49, .43, .23, vest);
  part(root, 0, .9, 0, .5, .15, .31, pants);
  part(root, 0, .91, -.18, .51, .065, .04, 0x33392e);
  for (const x of [-.16, 0, .16]) part(root, x, 1.16, -.232, .12, .19, .065, ct ? 0x405854 : 0x887250);
  part(root, 0, 1.55, 0, .16, .14, .17, skin);
  part(root, 0, 1.73, 0, .3, .34, .29, ct ? 0x3e4c4d : skin);
  if (ct) {
    part(root, 0, 1.88, .01, .36, .19, .35, 0x334a50);
    part(root, 0, 1.75, -.157, .29, .085, .025, 0x1a2629);
    part(root, 0, 1.76, -.173, .23, .048, .015, 0x8aada9);
    part(root, .19, 1.77, .02, .07, .15, .12, 0x22352e);
    part(root, 0, 1.39, .195, .22, .08, .03, 0xadc5c0);
  } else {
    part(root, 0, 1.86, .015, .32, .1, .32, 0x5b4840);
    part(root, 0, 1.63, -.13, .31, .16, .09, 0x9d957a);
    part(root, 0, 1.76, -.153, .27, .065, .03, 0x302d29);
    part(root, 0, 1.47, -.08, .34, .12, .32, 0xaa9d7e);
    for (const x of [-.08, .08]) part(root, x, 1.48, -.25, .045, .1, .02, 0x655c4a);
  }
  const leftLeg = new THREE.Group(), rightLeg = new THREE.Group();
  for (const [leg, sign] of [[leftLeg, -1], [rightLeg, 1]] as const) {
    leg.position.set(sign * .155, .89, 0); root.add(leg);
    part(leg, 0, -.2, 0, .23, .39, .25, pants);
    part(leg, 0, -.53, .005, .19, .31, .21, pants);
    part(leg, 0, -.4, -.1, .19, .15, .06, ct ? 0x25383d : 0x5a5949);
    part(leg, 0, -.79, -.07, .23, .18, .37, 0x2d302b);
  }
  const leftArm = new THREE.Group(), rightArm = new THREE.Group();
  for (const [arm, sign] of [[leftArm, -1], [rightArm, 1]] as const) {
    arm.position.set(sign * .35, 1.4, 0); root.add(arm);
    part(arm, 0, -.13, -.025, .2, .3, .22, cloth).rotation.x = .2;
    const fore = part(arm, sign === 1 ? -.025 : .15, -.27, -.24, .16, .17, .4, ct ? cloth : skin); fore.rotation.y = sign === 1 ? 0 : -.5;
    part(arm, sign === 1 ? -.025 : .23, -.24, -.42, .16, .15, .16, 0x3e4536);
  }
  const weapon = createGun(weaponId); weapon.position.set(.24, 1.18, -.43); root.add(weapon);
  root.userData.weaponCache = new Map<WeaponId, THREE.Group>([[weaponId, weapon]]);
  for (const group of [root, leftLeg, rightLeg, leftArm, rightArm]) batchParts(group);
  return { root, leftLeg, rightLeg, leftArm, rightArm, weapon, flash: weapon.getObjectByName('muzzle') as THREE.Group };
}
export function setCharacterWeapon(visual: CharacterVisual, id: WeaponId) {
  if (visual.weapon.name === id) return;
  visual.root.remove(visual.weapon);
  const cache = visual.root.userData.weaponCache as Map<WeaponId, THREE.Group>;
  let gun = cache.get(id); if (!gun) { gun = createGun(id); cache.set(id, gun); }
  visual.weapon = gun; visual.weapon.position.set(.24, 1.18, -.43); visual.root.add(visual.weapon); visual.flash = visual.weapon.getObjectByName('muzzle') as THREE.Group;
}
export function createViewModel(id: WeaponId, team: Team) {
  const root = new THREE.Group(); root.position.set(.24, -.25, -.45);
  const sleeve = team === 'CT' ? 0x344e61 : 0x9c8060;
  part(root, .01, -.18, .15, .13, .15, .39, sleeve).rotation.x = -.2;
  part(root, .005, -.09, -.005, .12, .14, .14, 0x424a39);
  if (id !== 'knife') {
    const left = part(root, -.19, -.12, -.1, .12, .14, .36, sleeve); left.rotation.y = -.58; left.rotation.x = -.15;
    part(root, -.085, -.07, -.31, .12, .13, .14, 0x424a39);
  }
  const gun = createGun(id); root.add(gun);
  batchParts(root);
  return { root, flash: gun.getObjectByName('muzzle') as THREE.Group };
}
export function createBomb() {
  const root = new THREE.Group();
  part(root, 0, .09, 0, .42, .18, .32, 0x565b3b);
  for (let i = 0; i < 3; i++) part(root, -.13 + i * .13, .16, 0, .1, .12, .28, 0x77774d);
  part(root, 0, .24, -.025, .27, .035, .18, 0x303a32);
  part(root, 0, .263, -.065, .17, .007, .055, 0x99dba2);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) part(root, -.07 + c * .07, .264, .015 + r * .04, .035, .009, .023, 0xb8b8a3);
  const led = new THREE.Mesh(new THREE.SphereGeometry(.022, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff4d3b })); led.position.set(.16, .25, -.1); led.name = 'led'; root.add(led);
  batchParts(root); return root;
}

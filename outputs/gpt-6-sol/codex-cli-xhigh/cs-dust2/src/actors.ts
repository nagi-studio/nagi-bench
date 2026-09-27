import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Actor, Team, WeaponId } from './types';
import { WEAPONS } from './weapons';

const mat = (color: number, metalness = 0, roughness = .84) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const glove = mat(0x242b2c);

function part(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  return mesh;
}
function box(parent: THREE.Object3D, w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
  return part(parent, new THREE.BoxGeometry(w, h, d), material, x, y, z);
}

function batchMeshes(group: THREE.Group, keep: (mesh: THREE.Mesh) => boolean = () => false) {
  const groups = new Map<THREE.Material, THREE.Mesh[]>();
  for (const child of group.children) {
    if (!(child instanceof THREE.Mesh) || Array.isArray(child.material) || keep(child)) continue;
    const list = groups.get(child.material) ?? [];
    list.push(child); groups.set(child.material, list);
  }
  for (const [material, meshes] of groups) {
    if (meshes.length < 2) continue;
    const pieces = meshes.map(mesh => { mesh.updateMatrix(); return mesh.geometry.clone().applyMatrix4(mesh.matrix); });
    const merged = mergeGeometries(pieces, false);
    if (merged) {
      for (const mesh of meshes) group.remove(mesh);
      const combined = new THREE.Mesh(merged, material);
      combined.castShadow = true; combined.receiveShadow = true; group.add(combined);
    }
    pieces.forEach(piece => piece.dispose());
  }
}

export function createGun(id: WeaponId, firstPerson = false): THREE.Group {
  const gun = new THREE.Group();
  const w = WEAPONS[id];
  const body = mat(w.color, id === 'deagle' ? .5 : .25, .57);
  const dark = mat(0x202526, .52, .5);
  const accent = mat(id === 'ak' ? 0x6f421f : id === 'awp' ? 0x68735d : 0x485051, .12, .7);
  const steel = mat(0x9ba3a1, .68, .35);
  if (id === 'knife') {
    box(gun, .15, .16, .48, dark, 0, 0, .2);
    const blade = box(gun, .18, .055, .65, steel, 0, .04, -.33);
    blade.rotation.x = -.08;
    const tip = part(gun, new THREE.ConeGeometry(.1, .25, 4), steel, 0, .04, -.77);
    tip.rotation.x = -Math.PI / 2;
    box(gun, .3, .08, .1, dark, 0, .02, -.03);
  } else if (w.slot === 'secondary') {
    box(gun, .22, .16, .43, body, 0, .03, -.15);
    box(gun, .2, .11, .35, dark, 0, -.03, -.17);
    const grip = box(gun, .17, .32, .15, dark, 0, -.21, .02); grip.rotation.x = -.28;
    box(gun, .13, .08, .22, id === 'deagle' ? steel : dark, 0, .04, -.48);
    box(gun, .07, .07, .045, steel, 0, .14, -.22);
    if (id === 'usp') box(gun, .14, .11, .36, dark, 0, .02, -.72);
  } else {
    const long = id === 'awp';
    box(gun, .22, .21, long ? .8 : .66, body, 0, 0, -.34);
    box(gun, .2, .14, .4, accent, 0, -.035, long ? -.85 : -.78);
    const barrel = part(gun, new THREE.CylinderGeometry(.052, .06, long ? 1.3 : .72, 10), dark, 0, .025, long ? -1.72 : -1.3);
    barrel.rotation.x = Math.PI / 2;
    const muzzle = part(gun, new THREE.CylinderGeometry(.075, .075, .13, 12), dark, 0, .025, long ? -2.4 : -1.72);
    muzzle.rotation.x = Math.PI / 2;
    const stock = box(gun, .17, .2, .48, id === 'ak' ? accent : body, 0, -.025, .24);
    if (id === 'ak') stock.rotation.x = .07;
    const grip = box(gun, .15, .38, .17, dark, 0, -.27, -.12); grip.rotation.x = -.15;
    const mag = box(gun, .17, id === 'awp' ? .22 : .43, .21, dark, 0, -.29, -.52);
    if (id === 'ak') mag.rotation.x = -.2;
    box(gun, .09, .08, .08, steel, 0, .17, -.1);
    if (id === 'awp') {
      const scope = part(gun, new THREE.CylinderGeometry(.14, .14, .74, 12), dark, 0, .32, -.38);
      scope.rotation.x = Math.PI / 2;
      for (const z of [-.76, .02]) {
        const rim = part(gun, new THREE.CylinderGeometry(.165, .165, .04, 12), steel, 0, .32, z);
        rim.rotation.x = Math.PI / 2;
      }
      box(gun, .08, .13, .22, dark, 0, .21, -.4);
    }
  }
  if (firstPerson) {
    // Two visible forearms and hands keep the first-person weapon grounded.
    const armMat = mat(0x4d5660);
    const leftArm = box(gun, .22, .23, .65, armMat, -.37, -.31, .36); leftArm.rotation.y = -.31; leftArm.rotation.x = -.17;
    const rightArm = box(gun, .22, .23, .66, armMat, .32, -.31, .39); rightArm.rotation.y = .23; rightArm.rotation.x = -.16;
    box(gun, .21, .18, .22, glove, -.24, -.19, -.03);
    box(gun, .21, .18, .22, glove, .13, -.19, .09);
  }
  batchMeshes(gun);
  return gun;
}

export function createHuman(team: Team, id: number): { mesh: THREE.Group; gunMesh: THREE.Group } {
  const mesh = new THREE.Group();
  const uniform = mat(team === 'CT' ? 0x344651 : 0x9a8162);
  const uniformAlt = mat(team === 'CT' ? 0x273740 : 0x6e5f47);
  const vest = mat(team === 'CT' ? 0x26333a : 0x584b39);
  const pants = mat(team === 'CT' ? 0x253640 : 0x76684d);
  const boots = mat(0x25282a);
  const face = mat(team === 'CT' ? 0xb88e70 : 0x9e795b);
  const head = part(mesh, new THREE.SphereGeometry(.25, 12, 10), face, 0, 1.73, 0);
  head.scale.z = .9;
  box(mesh, .56, .67, .32, uniform, 0, 1.22, 0);
  box(mesh, .62, .52, .38, vest, 0, 1.31, -.015);
  box(mesh, .54, .17, .36, uniformAlt, 0, .82, 0);
  box(mesh, .15, .15, .36, vest, -.35, 1.19, 0);
  box(mesh, .15, .15, .36, vest, .35, 1.19, 0);
  for (const side of [-1, 1]) {
    const shoulder = side * .4;
    const upper = box(mesh, .2, .43, .23, uniform, shoulder, 1.34, -.09); upper.rotation.z = side * .32;
    const forearm = box(mesh, .19, .4, .22, uniformAlt, side * .4, 1.04, -.3); forearm.rotation.x = -.72; forearm.rotation.z = -side * .35;
    box(mesh, .17, .17, .2, glove, side * .31, .98, -.48);
    const leg = box(mesh, .23, .66, .25, pants, side * .17, .51, 0);
    leg.name = side < 0 ? 'legL' : 'legR';
    box(mesh, .25, .21, .38, boots, side * .17, .13, -.085);
  }
  if (team === 'CT') {
    const helmet = part(mesh, new THREE.SphereGeometry(.265, 12, 8, 0, Math.PI * 2, 0, Math.PI * .6), uniformAlt, 0, 1.79, 0);
    helmet.scale.z = 1.04;
    box(mesh, .51, .11, .2, vest, 0, 1.72, -.18);
    box(mesh, .33, .14, .04, mat(0x1b252b, .25), 0, 1.73, -.233);
    box(mesh, .17, .17, .07, vest, 0, 1.52, -.23);
  } else {
    const scarf = box(mesh, .47, .15, .38, uniformAlt, 0, 1.52, .01); scarf.rotation.y = .13;
    box(mesh, .48, .09, .25, vest, 0, 1.88, .02);
    box(mesh, .45, .12, .2, vest, 0, 1.83, -.08);
    if (id % 2 === 0) box(mesh, .5, .14, .09, uniformAlt, 0, 1.56, -.2);
  }
  const gunMesh = createGun(team === 'CT' ? 'm4' : 'ak');
  gunMesh.position.set(0, 1.11, -.49);
  gunMesh.scale.setScalar(.64);
  mesh.add(gunMesh);
  batchMeshes(mesh, child => child.name === 'legL' || child.name === 'legR');
  return { mesh, gunMesh };
}

export function animateHuman(actor: Actor, time: number, speed: number) {
  const amount = Math.min(speed / 4.5, 1) * .34;
  const legL = actor.mesh.getObjectByName('legL');
  const legR = actor.mesh.getObjectByName('legR');
  if (legL) legL.rotation.x = Math.sin(time * 10 + actor.id) * amount;
  if (legR) legR.rotation.x = -Math.sin(time * 10 + actor.id) * amount;
  actor.gunMesh.rotation.x = Math.sin(time * 10 + actor.id) * amount * .16;
}

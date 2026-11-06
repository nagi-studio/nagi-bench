import * as THREE from 'three';
import type { CharacterModel, Team, WeaponId, Zone } from './types';

const materials = {
  steel: new THREE.MeshStandardMaterial({ color: '#303733', metalness: .65, roughness: .38 }),
  black: new THREE.MeshStandardMaterial({ color: '#18201d', roughness: .65 }),
  wood: new THREE.MeshStandardMaterial({ color: '#a3582e', roughness: .65 }),
  olive: new THREE.MeshStandardMaterial({ color: '#707956', roughness: .8 }),
  silver: new THREE.MeshStandardMaterial({ color: '#b6bbb4', metalness: .8, roughness: .23 }),
  glove: new THREE.MeshStandardMaterial({ color: '#373c31', roughness: 1 }),
  skin: new THREE.MeshStandardMaterial({ color: '#bf9674', roughness: 1 }),
  ct: new THREE.MeshStandardMaterial({ color: '#496779', roughness: 1 }),
  t: new THREE.MeshStandardMaterial({ color: '#b89b71', roughness: 1 }),
  vest: new THREE.MeshStandardMaterial({ color: '#263c42', roughness: 1 }),
  scarf: new THREE.MeshStandardMaterial({ color: '#994c39', roughness: 1 }),
  trousers: new THREE.MeshStandardMaterial({ color: '#494d3a', roughness: 1 }),
};
function box(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function tube(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, length: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), mat); m.rotation.x = Math.PI / 2; m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
}
export function weaponModel(id: WeaponId, firstPerson = false): THREE.Group {
  const g = new THREE.Group(); g.name = id;
  const { steel, black, wood, olive, silver, glove, skin } = materials;
  if (id === 'knife') {
    box(g, 0, -.015, -.04, .075, .1, .23, glove);
    const blade = box(g, 0, 0, -.32, .032, .12, .37, silver); blade.rotation.z = .04;
    box(g, 0, 0, -.15, .04, .18, .035, steel);
  } else if (['glock', 'usp', 'deagle'].includes(id)) {
    const deagle = id === 'deagle';
    box(g, 0, .015, -.12, deagle ? .12 : .095, .11, deagle ? .37 : .29, deagle ? silver : steel);
    const grip = box(g, 0, -.12, .005, .086, .23, .115, black); grip.rotation.x = -.16;
    box(g, 0, -.06, -.1, .055, .03, .1, steel);
    box(g, 0, -.115, -.09, .055, .02, .12, steel);
    box(g, 0, .087, -.23, .018, .025, .025, black);
    box(g, 0, .082, .025, .075, .025, .03, steel);
    for (const side of [-1, 1]) for (let i = 0; i < 5; i++) box(g, side * (deagle ? .061 : .049), .022, -.045 + i * .015, .005, .055, .006, black);
    if (id === 'usp') tube(g, 0, .015, -.39, .038, .27, black);
    else tube(g, 0, .014, -.3, .025, .045, black);
  } else {
    const ak = id === 'ak', awp = id === 'awp';
    box(g, 0, 0, -.16, .12, .14, .4, awp ? olive : steel);
    box(g, 0, -.015, .16, .095, .12, .31, ak ? wood : awp ? olive : black);
    box(g, 0, -.03, .3, .12, .2, .045, black);
    const grip = box(g, 0, -.14, -.035, .075, .2, .1, ak ? wood : black); grip.rotation.x = -.25;
    box(g, 0, -.11, -.13, .045, .025, .13, steel);
    box(g, 0, .005, -.44, .12, .12, .28, ak ? wood : awp ? olive : black);
    tube(g, 0, .02, awp ? -.9 : -.72, awp ? .025 : .02, awp ? .65 : .35, steel);
    tube(g, 0, .02, awp ? -1.22 : -.91, .035, .07, black);
    box(g, 0, -.18, -.23, .075, awp ? .14 : .29, .16, black);
    if (ak) { const magazine = box(g, 0, -.33, -.19, .075, .15, .16, steel); magazine.rotation.x = -.3; }
    if (awp) {
      box(g, 0, .13, -.2, .08, .1, .17, black);
      tube(g, 0, .22, -.23, .058, .36, black); tube(g, 0, .22, -.43, .078, .09, black);
      tube(g, 0, .22, -.485, .065, .012, new THREE.MeshStandardMaterial({ color: '#678f9a', metalness: .8, roughness: .1 }));
      box(g, .09, .01, -.03, .12, .025, .035, silver);
    } else {
      box(g, 0, .10, -.14, .065, .04, .28, black);
      box(g, 0, .09, -.78, .018, .12, .025, steel);
      for (let i = 0; i < 5; i++) box(g, 0, .075, -.34 - i * .04, .13, .025, .014, steel);
    }
  }
  if (firstPerson) {
    // Visible, articulated forearms and gloves; no model or animation assets.
    const right = box(g, .025, -.235, .18, .14, .14, .42, skin); right.rotation.x = -.35;
    box(g, .015, -.13, .015, .13, .14, .15, glove);
    if (['glock', 'usp', 'deagle'].includes(id)) {
      const left = box(g, -.15, -.265, .21, .13, .13, .36, skin); left.rotation.y = -.55; left.rotation.x = -.3;
      box(g, -.065, -.135, .025, .11, .125, .14, glove);
      box(g, -.055, -.085, -.055, .075, .035, .10, glove);
    } else if (id !== 'knife') {
      const left = box(g, -.17, -.22, -.15, .14, .14, .48, skin); left.rotation.y = -.55; left.rotation.x = .22;
      box(g, -.035, -.095, -.34, .14, .11, .15, glove);
    }
    g.traverse(o => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = false; o.receiveShadow = false;
        const material = (o.material as THREE.MeshStandardMaterial).clone();
        material.metalness = Math.min(material.metalness, .22);
        if (o.material === steel || o.material === black) material.color.multiplyScalar(1.7);
        o.material = material;
        if (o.geometry instanceof THREE.BoxGeometry) {
          const { width: w, height: h, depth: d } = o.geometry.parameters;
          const r = Math.min(.008, w / 6, h / 6, d / 6), shape = new THREE.Shape();
          shape.moveTo(-w / 2 + r, -h / 2 + r); shape.lineTo(w / 2 - r, -h / 2 + r);
          shape.lineTo(w / 2 - r, h / 2 - r); shape.lineTo(-w / 2 + r, h / 2 - r); shape.closePath();
          const geometry = new THREE.ExtrudeGeometry(shape, { depth: d - r * 2, bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: 1, steps: 1 });
          geometry.translate(0, 0, -(d - r * 2) / 2); o.geometry.dispose(); o.geometry = geometry;
        }
      }
    });
  }
  return g;
}
export function characterModel(team: Team, id: number, weapon: WeaponId): CharacterModel {
  const group = new THREE.Group(), head = new THREE.Group(), legs: THREE.Group[] = [], arms: THREE.Group[] = [], hitboxes: THREE.Mesh[] = [];
  const uniform = team === 'CT' ? materials.ct : materials.t;
  const hit = (mesh: THREE.Mesh, zone: Zone) => { mesh.userData = { actorId: id, zone }; hitboxes.push(mesh); return mesh; };
  hit(box(group, 0, 1.22, 0, .58, .53, .33, uniform), 'chest');
  hit(box(group, 0, .88, 0, .45, .22, .3, uniform), 'abdomen');
  box(group, 0, 1.23, -.19, .47, .44, .09, team === 'CT' ? materials.vest : materials.olive);
  for (const x of [-.16, 0, .16]) box(group, x, 1.12, -.26, .12, .15, .08, materials.olive);
  box(group, 0, .81, -.02, .5, .07, .33, materials.black);
  head.position.y = 1.65; group.add(head);
  hit(box(head, 0, 0, 0, .34, .39, .32, materials.skin), 'head');
  if (team === 'CT') {
    box(head, 0, .13, .015, .39, .18, .37, materials.ct);
    box(head, 0, .04, -.172, .31, .07, .025, materials.black);
    box(head, 0, -.13, -.12, .35, .12, .13, materials.vest);
  } else {
    box(head, 0, -.12, -.08, .36, .15, .25, materials.scarf);
    box(head, 0, .16, 0, .355, .09, .34, materials.black);
    box(head, 0, .025, -.17, .29, .045, .02, materials.black);
  }
  for (const s of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(s * .15, .8, 0); group.add(leg); legs.push(leg);
    hit(box(leg, 0, -.19, 0, .21, .37, .24, team === 'CT' ? uniform : materials.trousers), 'leg');
    hit(box(leg, 0, -.53, -.005, .18, .32, .21, team === 'CT' ? uniform : materials.trousers), 'leg');
    box(leg, 0, -.38, -.13, .18, .16, .045, materials.glove);
    box(leg, 0, -.72, -.065, .23, .15, .36, materials.black);
    const arm = new THREE.Group(); arm.position.set(s * .37, 1.42, -.015); group.add(arm); arms.push(arm);
    const upper = hit(box(arm, 0, -.15, -.04, .19, .34, .21, uniform), 'arm'); upper.rotation.x = -.35;
    const fore = hit(box(arm, s === -1 ? .10 : -.035, -.25, -.26, .17, .18, .35, uniform), 'arm'); fore.rotation.y = s === -1 ? -.55 : .1;
    box(arm, s === -1 ? .18 : -.04, -.22, -.42, .15, .15, .16, materials.glove);
  }
  const gun = weaponModel(weapon); gun.position.set(.18, 1.22, -.42); group.add(gun);
  return { group, head, legs, arms, weapon: gun, hitboxes };
}
export function c4Model() {
  const group = new THREE.Group();
  box(group, 0, .12, 0, .42, .24, .3, materials.olive);
  box(group, 0, .25, -.025, .23, .035, .15, materials.black);
  box(group, -.025, .272, -.05, .14, .006, .06, new THREE.MeshBasicMaterial({ color: '#baff7d' }));
  for (let i = 0; i < 3; i++) box(group, -.065 + i * .06, .275, .02, .025, .01, .025, materials.silver);
  for (const x of [-.14, .14]) box(group, x, .255, .025, .035, .03, .24, materials.black);
  return group;
}
export function disposeObject(object: THREE.Object3D, disposeMaterials = false) {
  object.traverse(o => {
    if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
      o.geometry.dispose();
      if (disposeMaterials) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose();
        m.dispose();
      }
    }
  });
}

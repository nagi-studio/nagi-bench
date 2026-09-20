import * as THREE from 'three';
import type { Team } from './types';
import type { HitZone, WeaponId } from './weapons';

const materials = new Map<string,THREE.MeshStandardMaterial>();
export function material(color:number,metalness=0,roughness=.7) {
  const key=`${color}/${metalness}/${roughness}`;
  if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness}));
  return materials.get(key)!;
}
export function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,color:number,metalness=0) {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color,metalness));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function barrel(parent:THREE.Object3D,r:number,length:number,x:number,y:number,z:number,color=0x262c2d) {
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,10),material(color,.75,.38));mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;
}
export function createGun(id:WeaponId,firstPerson=false) {
  const gun=new THREE.Group();gun.name=id;
  const steel=0x283033,dark=0x171d20,wood=0x905431;
  if(id==='knife') {
    box(gun,.052,.062,.2,0,0,.09,0x293330);
    box(gun,.12,.025,.035,0,.03,-.025,0x4f5758,.7);
    const shape=new THREE.Shape();shape.moveTo(-.035,0);shape.lineTo(.035,0);shape.lineTo(.033,-.25);shape.lineTo(-.02,-.34);shape.closePath();
    const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.009,bevelEnabled:false}),material(0xbfc9c9,.95,.25));blade.rotation.x=Math.PI/2;blade.position.set(0,.045,-.04);gun.add(blade);
  } else if(['glock','usp','deagle'].includes(id)) {
    const eagle=id==='deagle',silenced=id==='usp';
    box(gun,.066,.072,eagle?.27:.21,0,.032,-.04,eagle?0x8e999b:steel,.75);
    box(gun,.055,.043,.18,0,-.019,-.025,dark);
    const grip=box(gun,.058,.13,.077,0,-.082,.032,id==='glock'?0x555746:dark);grip.rotation.x=-.23;
    box(gun,.043,.013,.063,0,-.078,-.06,steel,.6);box(gun,.043,.064,.009,0,-.045,-.09,steel);
    barrel(gun,.013,.08,0,.033,-.19);
    if(silenced)barrel(gun,.023,.2,0,.033,-.3,0x353d3d);
    box(gun,.01,.023,.02,0,.078,-.12,0x080d0f);
    box(gun,.047,.019,.016,0,.078,.05,0x080d0f);
    for(let i=0;i<5;i++)box(gun,.068,.054,.005,0,.037,.014+i*.008,eagle?0x515c60:0x41494a,.6);
  } else {
    const ak=id==='ak47',awp=id==='awp';
    box(gun,.082,.10,.30,0,.006,-.025,awp?0x657052:steel,.5);
    box(gun,.075,.034,.28,0,.07,-.04,dark,.6);
    box(gun,.064,.07,awp?.3:.18,0,.013,-.245,ak?wood:awp?0x657052:dark,.1);
    barrel(gun,awp?.019:.013,awp?.37:.22,0,.034,awp?-.53:-.43);
    barrel(gun,.021,.06,0,.034,awp?-.72:-.56);
    if(ak)barrel(gun,.009,.27,0,.073,-.345);
    const grip=box(gun,.055,.14,.076,0,-.095,.072,ak?wood:dark);grip.rotation.x=-.24;
    box(gun,.055,.012,.095,0,-.088,-.015,steel);box(gun,.045,.055,.008,0,-.063,-.06,steel);
    const mag=box(gun,.06,awp?.085:.195,.086,0,awp?-.072:-.13,-.09,awp?dark:steel,.4);mag.rotation.x=ak?-.23:.07;
    if(ak) {const tip=box(gun,.06,.08,.087,0,-.245,-.068,steel,.4);tip.rotation.x=-.42;}
    box(gun,.055,.06,.22,0,.015,.23,ak?wood:awp?0x657052:dark);
    box(gun,.085,.135,.09,0,-.02,.345,ak?wood:awp?0x657052:dark);
    box(gun,.026,.042,.025,0,.091,-.40,steel);
    if(awp) {
      box(gun,.04,.07,.06,0,.12,.02,dark);box(gun,.04,.07,.06,0,.12,-.19,dark);
      barrel(gun,.041,.3,0,.17,-.07);barrel(gun,.055,.055,0,.17,-.238);
      barrel(gun,.043,.055,0,.17,.104);
      const lens=barrel(gun,.034,.004,0,.17,.133,0x478e9e);lens.material=material(0x326b79,.8,.12);
      box(gun,.07,.036,.05,0,.224,-.06,dark);
      const bolt=box(gun,.1,.015,.02,.075,.02,.087,0x727b7c,.8);bolt.rotation.z=-.4;
    } else {
      for(let i=0;i<8;i++)box(gun,.086,.009,.009,0,.093,-.15+i*.022,0x4b5252,.7);
      if(!ak){box(gun,.065,.066,.016,0,.111,.034,dark);box(gun,.016,.062,.017,0,.11,-.21,dark);}
    }
    for(let i=0;i<4;i++)box(gun,.084,.013,.008,0,.006,-.19-i*.023,ak?0x6f3e26:0x454c4b);
    box(gun,.009,.025,.042,.048,.03,.025,0x818b88,.85);
  }
  if(firstPerson) {
    const handColor=0x5b6052,sleeve=0x344b56;
    const right=new THREE.Group();right.position.set(.015,-.09,.055);right.rotation.x=-.1;
    box(right,.095,.09,.12,0,-.025,0,handColor);box(right,.12,.15,.23,.018,-.09,.12,sleeve);
    for(let i=0;i<4;i++)box(right,.022,.048,.07,-.027+i*.019,.016,-.03,0x3d433a);
    gun.add(right);
    if(!['knife','glock','usp','deagle'].includes(id)) {
      const left=new THREE.Group();left.position.set(-.028,-.049,-.23);left.rotation.z=-.32;
      box(left,.11,.071,.13,0,0,0,handColor);const arm=box(left,.12,.14,.32,-.04,-.08,.12,sleeve);arm.rotation.y=-.35;
      for(let i=0;i<4;i++)box(left,.028,.068,.024,-.02,.013,-.045+i*.027,0x434a3e);gun.add(left);
    }
  }
  return gun;
}
export function createHumanoid(id:number,team:Team,weapon:WeaponId) {
  const group=new THREE.Group(),hitboxes:THREE.Mesh[]=[],limbs:THREE.Group[]=[];
  const cloth=team==='CT'?0x456475:0x9b8668,vest=team==='CT'?0x263d4a:0x6b5140,pants=team==='CT'?0x354b57:0x6e7054,skin=0xb58d70;
  function hit(w:number,h:number,d:number,x:number,y:number,z:number,color:number,zone:HitZone,parent:THREE.Object3D=group) {
    const mesh=box(parent,w,h,d,x,y,z,color);mesh.userData={actorId:id,zone};hitboxes.push(mesh);return mesh;
  }
  hit(.54,.40,.31,0,1.32,0,cloth,'chest');hit(.46,.27,.28,0,.99,0,cloth,'abdomen');
  hit(.28,.31,.28,0,1.71,-.018,skin,'head');
  box(group,.30,.12,.29,0,1.61,-.025,team==='CT'?0x263940:0x756c56);
  if(team==='CT') {
    const helmet=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8,0,Math.PI*2,0,Math.PI*.63),material(0x33464e));helmet.position.set(0,1.79,0);group.add(helmet);
    box(group,.29,.067,.07,0,1.73,-.16,0x182b32,.35);box(group,.11,.048,.016,-.078,1.74,-.20,0x65818b,.4);
  }else{
    box(group,.3,.065,.29,0,1.83,-.015,0x695e4b);box(group,.25,.045,.075,0,1.74,-.162,0x202a29,.4);
    box(group,.29,.16,.04,0,1.61,-.17,0x9c8a6d);
  }
  box(group,.57,.35,.08,0,1.29,-.185,vest);box(group,.46,.35,.075,0,1.29,.186,vest);
  for(let i=-1;i<=1;i++)box(group,.12,.16,.065,i*.16,1.23,-.253,team==='CT'?0x546b70:0x8a7855);
  box(group,.48,.065,.33,0,.875,0,0x303b35);box(group,.09,.07,.045,0,.87,-.185,0x929589,.6);
  box(group,.1,.07,.015,-.14,1.43,-.238,team==='CT'?0x8cbfda:0xe1ba68);
  for(const side of [-1,1]) {
    const leg=new THREE.Group();leg.position.set(side*.14,.84,0);group.add(leg);limbs.push(leg);
    hit(.21,.68,.24,0,-.36,0,pants,'leg',leg);box(leg,.22,.17,.32,0,-.75,-.04,0x242b2b);box(leg,.22,.15,.075,0,-.39,-.14,vest);
    const arm=new THREE.Group();arm.position.set(side*.345,1.46,0);arm.rotation.x=-.83;arm.rotation.z=side*.15;group.add(arm);
    hit(.18,.4,.20,0,-.18,0,cloth,'arm',arm);
    const forearm=hit(.16,.31,.18,0,-.41,-.10,cloth,'arm',arm);forearm.rotation.x=-.55;
    box(arm,.17,.12,.17,0,-.52,-.19,0x424d43);
    box(arm,.19,.085,.21,0,-.105,0,team==='CT'?0x8cb9c8:0xdab56b);
  }
  const gun=createGun(weapon);gun.name='held-weapon';gun.position.set(.14,1.16,-.34);group.add(gun);
  return {group,hitboxes,limbs};
}
export function createBomb() {
  const group=new THREE.Group();
  box(group,.34,.12,.24,0,.08,0,0x3f4839);
  for(let i=-1;i<=1;i++)box(group,.085,.085,.28,i*.1,.16,0,0x8d8868);
  box(group,.17,.04,.15,0,.23,.01,0x222e2b);
  box(group,.115,.007,.052,0,.255,-.023,0x97b779);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)box(group,.02,.012,.013,-.034+i*.033,.257,.028+j*.022,0x9c9d83);
  return group;
}
export function disposeModel(root:THREE.Object3D) {root.traverse(obj=>{if(obj instanceof THREE.Mesh)obj.geometry.dispose();});}
export function disposeMaterials(){materials.forEach(m=>m.dispose());materials.clear();}

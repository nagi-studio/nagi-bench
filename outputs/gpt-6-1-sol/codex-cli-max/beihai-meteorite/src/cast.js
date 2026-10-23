import * as THREE from 'three';
import { createSkin, createFigure, applyPose, idle, float, aim, walk, lerpPose, voxelModel, voxelMaterial } from '@agentbench/voxel-kit';
export { applyPose, idle, float, aim, walk, lerpPose };

const parts=['head','torso','armR','armL','legR','legL'];
const palettes={
  zhang:{skin:'#c89877',hair:'#222828',brow:'#292e2c'},
  collector:{skin:'#d7ab82',hair:'#a2a49a',brow:'#656a60'},
  director:{skin:'#ceaa8a',hair:'#aeb2a8',brow:'#626d68'},
  director2:{skin:'#c09272',hair:'#555d5b',brow:'#4b5351'},
  director3:{skin:'#d9b495',hair:'#c7c4ad',brow:'#6d7065'},
  crew:{skin:'#bd9177',hair:'#283e3e',brow:'#28312e'},
};
const bodies=new Map(), outfits=new Map();
function body(identity, expression='calm'){
  const key=identity+expression;if(bodies.has(key))return bodies.get(key);
  const c=palettes[identity]||palettes.crew;
  const skin=createSkin(p=>{
    for(const n of parts)p.fill(n,'all',c.skin);
    p.fill('head',['top','back'],c.hair).rect('head','front',0,0,8,2,c.hair);
    for(const side of ['left','right'])p.fill('head',side,c.skin).rect('head',side,0,0,8,2,c.hair).rect('head',side,0,2,2,2,c.hair);
    p.rect('head','front',1,3,2,1,c.brow).rect('head','front',5,3,2,1,c.brow);
    p.px('head','front',2,4,'#252d2b').px('head','front',5,4,'#252d2b');
    p.px('head','front',4,5,'#ac7e64').rect('head','front',3,6,2,1,expression==='smile'?'#805c49':'#826653');
    if(identity==='collector'){
      p.rect('head','front',0,3,3,2,'#6a6b5b').rect('head','front',5,3,3,2,'#6a6b5b');
      p.px('head','front',1,4,'#c5b28d').px('head','front',6,4,'#c5b28d').px('head','front',3,4,'#736d5a');
    }
    if(expression==='shock')p.rect('head','front',3,5,2,2,'#4d4841').px('head','front',1,3,c.skin).px('head','front',6,3,c.skin);
    if(expression==='down')p.rect('head','front',1,4,2,1,c.brow).rect('head','front',5,4,2,1,c.brow);
    for(const n of parts)p.grain(n,'all',.055,11);
  });bodies.set(key,skin);return skin;
}
function clothes(type='uniform', open=true, rank=0, damaged=false){
  const key=type+open+rank+damaged;if(outfits.has(key))return outfits.get(key);
  const tex=createSkin(p=>{
    if(type==='suit'){
      for(const n of parts)p.fill(n,'all','#d6ddd4').grain(n,'all',.045,21);
      p.fill('head','front','#dddcd0').rect('head','front',1,1,6,5,'#263c43');
      if(open)p.erase('head','front',1,2,6,4);
      else p.rect('head','front',2,2,3,1,'#46626a').px('head','front',5,3,'#708482');
      p.rect('head','front',2,7,4,1,'#627679').rect('head','back',2,2,4,3,'#8d9b96');
      for(const n of ['armR','armL']){
        p.rect(n,'front',0,3,4,1,rank?'#c3a567':'#597d85');
        p.rect(n,'front',0,9,4,2,'#52686c').rect(n,'back',0,9,4,2,'#52686c');
      }
      p.rect('torso','front',1,1,6,2,'#748e91').rect('torso','front',2,4,4,4,'#35494e');
      p.px('torso','front',3,5,'#e8a35e').px('torso','front',4,5,'#80c3be');
      p.rect('torso','front',0,10,8,2,'#667b7b').rect('torso','back',0,10,8,2,'#667b7b');
      if(rank)p.rect('torso','front',0,2,1,6,'#bda56e').rect('torso','front',7,2,1,6,'#bda56e');
      for(const n of ['legR','legL'])p.rect(n,'front',0,7,4,1,'#a7b6b2').rect(n,'front',0,10,4,2,'#465c60').rect(n,'back',0,10,4,2,'#465c60');
      if(damaged){
        p.rect('head','front',1,2,6,4,'#50686a');
        for(const [x,y] of [[1,2],[2,3],[3,4],[4,3],[5,2],[4,5],[5,6],[2,5],[1,6],[6,4]])p.px('head','front',x,y,'#bacbc3');
        p.px('head','front',3,3,'#283b42');
      }
    }else{
      const col=type==='collector'?'#756f52':type==='director'?'#445d62':'#283e45';
      for(const n of ['torso','armR','armL'])p.fill(n,'all',col).grain(n,'all',.075,19);
      for(const n of ['legR','legL'])p.fill(n,'all',type==='collector'?'#4a4b41':'#25323a').grain(n,'all',.055,17).rect(n,'front',0,10,4,2,'#242d2e');
      p.rect('torso','front',3,0,2,2,'#d0c6a4').rect('torso','front',3,2,1,10,'#202f31');
      p.rect('torso','front',1,4,2,2,'#526563').rect('torso','front',5,4,2,2,'#526563');
      if(type!=='collector')p.rect('torso','front',6,2,2,1,'#bb8861').rect('armR','front',0,1,4,1,'#b29a68').rect('armL','front',0,1,4,1,'#b29a68');
      for(const n of ['armL','armR'])p.clear(n,'bottom').erase(n,'front',0,10,4,2).erase(n,'back',0,10,4,2).erase(n,'left',0,10,4,2).erase(n,'right',0,10,4,2);
    }
  },{transparent:true});outfits.set(key,tex);return tex;
}

export function makeActor(identity='zhang', type='uniform', rank=0){
  const f=createFigure({body:body(identity).texture,clothes:clothes(type,true,rank).texture,heightM:identity==='collector'?1.72:1.8,castShadow:type!=='suit'});
  f.identity=identity;f.costume=type;f.rank=rank;
  f.currentExpression='calm';
  f.expression=(e='calm')=>{if(e===f.currentExpression)return;f.currentExpression=e;f.setBody(body(identity,e).texture);};
  f.visorOpen=true;f.damaged=false;
  f.visor=(open)=>{if(open===f.visorOpen)return;f.visorOpen=open;f.setClothes(clothes(type,open,rank,f.damaged).texture);};
  f.damage=(damaged)=>{if(damaged===f.damaged)return;f.damaged=damaged;f.setClothes(clothes(type,f.visorOpen,rank,damaged).texture);};
  if(type==='suit'){
    const side=['.####.','######','##ss##','######','######','##ss##','######','.####.'];
    const g=voxelModel({palette:{'#':0xa9b9b6,s:0x344e55},layers:[side,side,side,side],axis:'z',voxel:1});
    const pack=new THREE.Mesh(g,voxelMaterial({roughness:.7}));pack.position.set(0,0,-2.5);f.anchors.back.add(pack);
    f.pack=pack;
  }
  return f;
}

const gunSide=['...........ssss.','....tttttttssss.','..ttttttttttttt.','...ddddddd......','...dd...d.......','...gg...........','..ggg...........','..ggg...........'];
export function makeGun(local=false){
  const g=voxelModel({palette:{t:0x3c4b50,d:0x283337,g:0x526363,s:0x7a8985},layers:[gunSide,gunSide,gunSide],axis:'x',voxel:local?.52:.029});
  const m=new THREE.Mesh(g,voxelMaterial({metalness:.72,roughness:.37}));m.name='meteor-pistol';m.position.z=local?2.5:0;return m;
}
export function makeCup(local=false){
  const cup=['#####','#...#','#...#','#####'];
  const g=voxelModel({palette:{'#':0xb9ba9f},layers:[cup,cup,cup,cup],axis:'x',voxel:local?.55:.03});
  const m=new THREE.Mesh(g,voxelMaterial({roughness:.25}));return m;
}
export function makeScope(local=false){
  const row=['..#######.','##########','..#######.'];
  return new THREE.Mesh(voxelModel({palette:{'#':0x42585c},layers:[row,row,row],axis:'x',voxel:local?.55:.031}),voxelMaterial({metalness:.6,roughness:.4}));
}

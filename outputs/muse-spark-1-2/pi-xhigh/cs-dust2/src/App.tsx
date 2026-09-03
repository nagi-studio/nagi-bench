import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WEAPONS, defaultLoadout } from './game/weapons';
import { buildMap, isInsideWall, hasLineOfSight, SPAWNS, WALLS } from './game/map';
import { SFX } from './game/audio';
import type { WeaponId, KillEvent, Team } from './game/types';

// types local
type Bot = {
  id:number; team:Team; pos:THREE.Vector3; yaw:number; hp:number; armor:number; alive:boolean;
  weapon:WeaponId; ammo:number; reserve:number; hasBomb:boolean; isBot:boolean;
  target: THREE.Vector3|null; lastShot:number; mesh?:THREE.Group; hpMesh?:THREE.Sprite;
};

const WEAPON_LIST: WeaponId[] = ['ak47','m4a4','awp','glock','usp','deagle','knife'];

function createHumanoid(team:Team, weaponId:WeaponId){
  const g=new THREE.Group();
  const isCT = team==='CT';
  const baseColor = isCT? 0x2a5a9a : 0x8a5a2a;
  const vestColor = isCT? 0x3a6ab0 : 0x6a3a1a;
  // torso
  const torso=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.62,0.28), new THREE.MeshStandardMaterial({color:baseColor, roughness:0.7}));
  torso.position.y=1.05; torso.castShadow=true; g.add(torso);
  const vest=new THREE.Mesh(new THREE.BoxGeometry(0.52,0.44,0.3), new THREE.MeshStandardMaterial({color:vestColor, roughness:0.6})); vest.position.y=1.1; g.add(vest);
  // head
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.22,16,16), new THREE.MeshStandardMaterial({color:0xe8c8a8, roughness:0.5}));
  head.position.y=1.58; head.castShadow=true; g.add(head);
  const helmet=new THREE.Mesh(new THREE.SphereGeometry(0.24,16,16,0,Math.PI*2,0,Math.PI*0.6), new THREE.MeshStandardMaterial({color:isCT?0x2a4a6a:0x4a3a2a, roughness:0.4})); helmet.position.y=1.62; helmet.rotation.x=Math.PI; g.add(helmet);
  // arms
  const armGeo=new THREE.CylinderGeometry(0.075,0.075,0.42,10);
  const armMat=new THREE.MeshStandardMaterial({color:baseColor});
  const lArm=new THREE.Mesh(armGeo, armMat); lArm.position.set(-0.32,1.05,0.06); lArm.rotation.z=0.2; lArm.rotation.x=0.6; g.add(lArm);
  const rArm=new THREE.Mesh(armGeo, armMat); rArm.position.set(0.32,1.05,0.12); rArm.rotation.z=-0.35; rArm.rotation.x=0.8; g.add(rArm);
  const handGeo=new THREE.SphereGeometry(0.08,10,10);
  const handMat=new THREE.MeshStandardMaterial({color:0xe8c8a8});
  const lHand=new THREE.Mesh(handGeo,handMat); lHand.position.set(-0.32,0.82,0.22); g.add(lHand);
  const rHand=new THREE.Mesh(handGeo,handMat); rHand.position.set(0.30,0.82,0.30); g.add(rHand);
  // legs
  const legGeo=new THREE.CylinderGeometry(0.11,0.11,0.62,10);
  const legMat=new THREE.MeshStandardMaterial({color:isCT?0x1e3a5a:0x3a2a14});
  const lLeg=new THREE.Mesh(legGeo, legMat); lLeg.position.set(-0.15,0.42,0); g.add(lLeg);
  const rLeg=new THREE.Mesh(legGeo, legMat); rLeg.position.set(0.15,0.42,0); g.add(rLeg);
  const footGeo=new THREE.BoxGeometry(0.16,0.08,0.22);
  const footMat=new THREE.MeshStandardMaterial({color:0x111111});
  const lFoot=new THREE.Mesh(footGeo, footMat); lFoot.position.set(-0.15,0.06,0.06); g.add(lFoot);
  const rFoot=new THREE.Mesh(footGeo, footMat); rFoot.position.set(0.15,0.06,0.06); g.add(rFoot);
  // weapon in hands
  const wGroup=new THREE.Group(); wGroup.position.set(0.30,0.82,0.38); wGroup.rotation.y=-0.1;
  const wMesh = createWeaponMesh(weaponId);
  wGroup.add(wMesh); g.add(wGroup);
  (g as unknown as {userData:{wGroup:THREE.Group,wMesh:THREE.Group}}).userData={wGroup,wMesh} as unknown as {wGroup:THREE.Group,wMesh:THREE.Group};
  // team emblem
  const emblem=new THREE.Mesh(new THREE.PlaneGeometry(0.18,0.18), new THREE.MeshBasicMaterial({color:isCT?0x4a8cff:0xff8a2a, side:THREE.DoubleSide, transparent:true, opacity:0.9}));
  emblem.position.set(0,1.22,0.16); emblem.rotation.y=Math.PI; g.add(emblem);
  return g;
}

function createWeaponMesh(id:WeaponId){
  const g=new THREE.Group();
  const matDark=new THREE.MeshStandardMaterial({color:0x1a1a1a, roughness:0.4, metalness:0.6});
  const matBarrel=new THREE.MeshStandardMaterial({color:0x2a2a2a, roughness:0.3, metalness:0.7});
  if(id==='knife'){
    const blade=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.42), new THREE.MeshStandardMaterial({color:0xd0d0d0, metalness:0.9, roughness:0.2})); blade.position.z=0.22; g.add(blade);
    const handle=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.14,8), matDark); handle.rotation.x=Math.PI/2; handle.position.z=-0.02; g.add(handle);
  } else if(id==='awp'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,0.62), new THREE.MeshStandardMaterial({color:0x3a4a2a})); body.position.z=0.12; g.add(body);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.72,12), matBarrel); barrel.rotation.x=Math.PI/2; barrel.position.z=0.42; g.add(barrel);
    const scope=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.28,12), new THREE.MeshStandardMaterial({color:0x111111})); scope.rotation.x=Math.PI/2; scope.position.set(0,0.06,0.08); g.add(scope);
    const mag=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.09,0.12), matDark); mag.position.set(0,-0.06,0.02); g.add(mag);
  } else if(id==='ak47'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.08,0.52), new THREE.MeshStandardMaterial({color:0x5a3a1a})); body.position.z=0.08; g.add(body);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,0.58,10), matBarrel); barrel.rotation.x=Math.PI/2; barrel.position.z=0.38; g.add(barrel);
    const mag=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.12,0.16), matDark); mag.position.set(0,-0.08,-0.02); mag.rotation.x=0.2; g.add(mag);
    const stock=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.08,0.18), new THREE.MeshStandardMaterial({color:0x6a4a2a})); stock.position.z=-0.24; g.add(stock);
  } else if(id==='m4a4'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,0.5), new THREE.MeshStandardMaterial({color:0x2a2a2a})); body.position.z=0.1; g.add(body);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.56,10), matBarrel); barrel.rotation.x=Math.PI/2; barrel.position.z=0.4; g.add(barrel);
    const mag=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.10,0.12), matDark); mag.position.set(0,-0.07,0); g.add(mag);
  } else {
    // pistols
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.05,0.22), matDark); body.position.z=0.06; g.add(body);
    const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.18,8), matBarrel); barrel.rotation.x=Math.PI/2; barrel.position.z=0.18; g.add(barrel);
    const grip=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.09,0.06), matDark); grip.position.set(0,-0.05,-0.04); grip.rotation.x=0.35; g.add(grip);
    if(id==='deagle'){ body.scale.set(1.2,1.2,1.2); barrel.scale.set(1.2,1.2,1.2); }
  }
  return g;
}

export default function App(){
  const mountRef=useRef<HTMLDivElement>(null);
  const [hud,setHud]=useState({hp:100,armor:0,ammo:30,reserve:90,weapon:'ak47' as WeaponId, kills:0, deaths:0});
  const [killfeed,setKillfeed]=useState<KillEvent[]>([]);
  const [phase,setPhase]=useState<'live'|'tWin'|'ctWin'>('live');
  const [pistolRound,setPistolRound]=useState(true);
  const [scoped,setScoped]=useState(false);
  const [c4Msg,setC4Msg]=useState('');
  const [showHelp,setShowHelp]=useState(true);
  const botsRef=useRef<Bot[]>([]);
  const keys=useRef<Record<string,boolean>>({});
  const yaw=useRef(0), pitch=useRef(0);
  const vel=useRef(new THREE.Vector3());
  const onGround=useRef(true);
  const spreadRef=useRef(0);
  const lastShot=useRef(0);
  const playerTeam=useRef<Team>('CT');
  const playerId=useRef(0);
  const bombRef=useRef<{pos:THREE.Vector3|null, carrier:number|null, planted:boolean, plantPos:THREE.Vector3|null, timer:number, defuse:number}>({pos:null, carrier:null, planted:false, plantPos:null, timer:40, defuse:0});
  const playerPos=useRef(new THREE.Vector3());
  const minimapRef=useRef<HTMLCanvasElement>(null);

  // init 3d
  useEffect(()=>{
    if(!mountRef.current) return;
    const mount=mountRef.current;
    const scene=new THREE.Scene(); scene.background=new THREE.Color(0x87b8d0); scene.fog=new THREE.Fog(0xd8c8a0, 28, 88);
    const camera=new THREE.PerspectiveCamera(74, mount.clientWidth/mount.clientHeight, 0.1, 200);
    const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(mount.clientWidth,mount.clientHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; mount.appendChild(renderer.domElement);
    const hemi=new THREE.HemisphereLight(0xfff6e0, 0x223344, 0.9); scene.add(hemi);
    const sun=new THREE.DirectionalLight(0xfff4d0, 1.1); sun.position.set(18,22,10); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.near=0.5; sun.shadow.camera.far=80; sun.shadow.camera.left=-40; sun.shadow.camera.right=40; sun.shadow.camera.top=40; sun.shadow.camera.bottom=-40; scene.add(sun);
    buildMap(scene);
    // player start
    const start = playerTeam.current==='CT'? SPAWNS.CT[0]: SPAWNS.T[4];
    camera.position.set(start.x,1.62,start.z);
    playerPos.current.copy(camera.position);
    yaw.current = playerTeam.current==='CT'? 0.6 : -2.4;
    // bots init
    const bots:Bot[]=[];
    let id=0;
    const makeBot=(team:Team, pos:{x:number,z:number}, isPlayer=false)=>{
      const load = defaultLoadout(team, pistolRound);
      const w = load[0];
      const def=WEAPONS[w];
      const b:Bot={id, team, pos:new THREE.Vector3(pos.x,0,pos.z), yaw: Math.random()*Math.PI*2, hp:100, armor: pistolRound?0:100, alive:true, weapon:w, ammo:def.mag, reserve:def.reserve, hasBomb:false, isBot:!isPlayer,
        target:null, lastShot:0};
      const mesh=createHumanoid(team,w); mesh.position.copy(b.pos); mesh.rotation.y=b.yaw; scene.add(mesh); b.mesh=mesh;
      bots.push(b); id++;
    };
    // CT bots + player
    makeBot('CT', SPAWNS.CT[0], true); playerId.current=0;
    for(let i=1;i<5;i++) makeBot('CT', SPAWNS.CT[i]);
    for(let i=0;i<5;i++) makeBot('T', SPAWNS.T[i]);
    // give bomb to random T
    const tBots=bots.filter(b=>b.team==='T'); const carrier=tBots[Math.floor(Math.random()*tBots.length)]; carrier.hasBomb=true; bombRef.current.carrier=carrier.id; bombRef.current.pos=null;
    botsRef.current=bots;
    // c4 meshes
    const bombMesh=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.14,0.12), new THREE.MeshStandardMaterial({color:0xff3a2a, emissive:0x441111})); bombMesh.visible=false; scene.add(bombMesh);
    const plantRing=new THREE.Mesh(new THREE.RingGeometry(7,7.15,32), new THREE.MeshBasicMaterial({color:0xffcc00, transparent:true, opacity:0.18, side:THREE.DoubleSide})); plantRing.rotation.x=-Math.PI/2; plantRing.position.set(SPAWNS.A.x,0.06,SPAWNS.A.z); scene.add(plantRing);
    const plantRingB=plantRing.clone(); plantRingB.position.set(SPAWNS.B.x,0.06,SPAWNS.B.z); scene.add(plantRingB);

    // viewmodel
    const vmGroup=new THREE.Group(); camera.add(vmGroup); scene.add(camera);
    let vmMesh=createWeaponMesh(WEAPONS[bots[0].weapon].id); vmMesh.position.set(0.32,-0.22,-0.42); vmMesh.rotation.y=0.05; vmGroup.add(vmMesh);
    function setVM(w:WeaponId){ vmGroup.clear(); vmMesh=createWeaponMesh(w); vmMesh.position.set(0.32,-0.22,-0.42); if(w==='awp'&&scoped) vmMesh.visible=false; else vmMesh.visible=true; vmGroup.add(vmMesh); }

    // input
    const onKeyDown=(e:KeyboardEvent)=>{
      keys.current[e.key.toLowerCase()]=true;
      if(e.key==='r' || e.key==='R'){ // reload
        const p=bots[0]; if(p.alive && p.ammo < WEAPONS[p.weapon].mag && p.reserve>0){ SFX.reload(); const need=WEAPONS[p.weapon].mag - p.ammo; const take=Math.min(need,p.reserve); p.reserve-=take; p.ammo+=take; }
      }
      if(e.key>='1' && e.key<='4'){
        const idx=parseInt(e.key)-1; const choice=[WEAPON_LIST[0],WEAPON_LIST[1],WEAPON_LIST[5],WEAPON_LIST[6]][idx]; if(choice){ const p=bots[0]; const def=WEAPONS[choice as WeaponId]; if(def){ p.weapon=choice as WeaponId; p.ammo=def.mag; p.reserve=def.reserve; setVM(p.weapon);} }
      }
      if(e.key==='e' || e.key==='E'){
        // plant/defuse
        const p=bots[0]; const pos2={x:camera.position.x,z:camera.position.z};
        const dA=Math.hypot(pos2.x-SPAWNS.A.x, pos2.z-SPAWNS.A.z), dB=Math.hypot(pos2.x-SPAWNS.B.x, pos2.z-SPAWNS.B.z);
        const near = dA<7? SPAWNS.A : dB<7? SPAWNS.B : null;
        if(p.team==='T' && p.hasBomb && near && !bombRef.current.planted){ bombRef.current.planted=true; bombRef.current.plantPos=new THREE.Vector3(near.x,0,near.z); bombRef.current.timer=40; bombRef.current.carrier=null; p.hasBomb=false; bombMesh.position.copy(bombRef.current.plantPos); bombMesh.position.y=0.08; bombMesh.visible=true; SFX.plant(); setC4Msg('C4 已安放 — 40 秒后爆炸'); }
        if(p.team==='CT' && bombRef.current.planted && bombRef.current.plantPos){
          const d=Math.hypot(pos2.x-bombRef.current.plantPos.x,pos2.z-bombRef.current.plantPos.z); if(d<1.6){ bombRef.current.defuse+=0.016* 0.9; if(bombRef.current.defuse>=5){ bombRef.current.planted=false; bombRef.current.plantPos=null; bombMesh.visible=false; bombRef.current.defuse=0; SFX.defuse(); setPhase('ctWin'); setC4Msg('CT 成功拆包！'); }}
        }
      }
      if(e.key==='o' || e.key==='O'){ setPistolRound((v:boolean)=>!v); }
    };
    const onKeyUp=(e:KeyboardEvent)=>{ keys.current[e.key.toLowerCase()]=false; if((e.key==='e'||e.key==='E') && bombRef.current.planted) bombRef.current.defuse=Math.max(0,bombRef.current.defuse-0.02); };
    window.addEventListener('keydown',onKeyDown); window.addEventListener('keyup',onKeyUp);
    const onMouseMove=(e:MouseEvent)=>{
      if(document.pointerLockElement!==renderer.domElement) return;
      yaw.current -= e.movementX*0.0022; pitch.current -= e.movementY*0.0022; pitch.current=Math.max(-1.45,Math.min(1.45,pitch.current));
    };
    const onMouseDown=(e:MouseEvent)=>{
      if(document.pointerLockElement!==renderer.domElement){ renderer.domElement.requestPointerLock(); return; }
      if(e.button===2){ // right click scope for awp
        const p=bots[0]; if(WEAPONS[p.weapon].ads){ setScoped((s:boolean)=>!s); SFX.scope(); }
        return;
      }
      // fire
      const now=performance.now(); const p=bots[0]; if(!p.alive) return; const def=WEAPONS[p.weapon]; const interval=60000/def.fireRate; if(now-lastShot.current < interval-6) return;
      if(p.ammo<=0 && def.mag>0){ SFX.empty(); return; }
      lastShot.current=now;
      if(def.mag>0) p.ammo--;
      spreadRef.current += def.recoil*0.018; if(def.id==='ak47') spreadRef.current+=0.012;
      // shot sound
      if(def.id==='ak47') SFX.ak(); else if(def.id==='m4a4') SFX.m4(); else if(def.id==='awp') SFX.awp(); else if(def.id==='glock') SFX.glock(); else if(def.id==='usp') SFX.usp(); else if(def.id==='deagle') SFX.deagle();
      // view kick
      pitch.current += def.recoil*0.012; yaw.current += (Math.random()-0.5)*def.recoil*0.008;
      // viewmodel kick
      vmMesh.position.z+=0.04; setTimeout(()=>{ vmMesh.position.z-=0.04; },60);
      // ray trace
      const dir=new THREE.Vector3(0,0,-1); dir.applyEuler(new THREE.Euler(pitch.current,yaw.current,0));
      // spread
      const sp=spreadRef.current + def.spread; dir.x+=(Math.random()-0.5)*sp; dir.y+=(Math.random()-0.5)*sp; dir.z+=(Math.random()-0.5)*sp; dir.normalize();
      const origin=camera.position.clone();
      // wall hit check - march
      let hitWall=false; for(let t=0.6;t<def.range;t+=0.5){ const x=origin.x+dir.x*t, z=origin.z+dir.z*t; if(isInsideWall(x,z,0.1)){ // impact effect
          const imp=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8), new THREE.MeshBasicMaterial({color:0x222222})); imp.position.set(x,1.2,z); scene.add(imp); setTimeout(()=>scene.remove(imp),180); hitWall=true; break; }}
      if(hitWall){ return; }
      // bot hits
      let hit:Bot|null=null; let bestDist=999; let zone: 'head'|'chest'|'stomach'|'arm'|'leg' = 'chest';
      for(const b of bots){ if(b.id===p.id||!b.alive) continue; if(b.team===p.team) continue; const toB=b.pos.clone().sub(origin); const proj=toB.dot(dir); if(proj<0.6||proj>def.range) continue; const closest=origin.clone().add(dir.clone().multiplyScalar(proj)); const d=closest.distanceTo(new THREE.Vector3(b.pos.x,1.1,b.pos.z)); if(d<0.85 && proj<bestDist){ bestDist=proj; hit=b; // zone by height
            const h=closest.y; if(h>1.48) zone='head'; else if(h>1.18) zone='chest'; else if(h>0.78) zone='stomach'; else if(d>0.55) zone='arm'; else zone='leg'; }}
      if(hit){
        let dmg=def.damage; if(zone==='head') dmg*=2; else if(zone==='leg') dmg*=0.75; else if(zone==='arm') dmg*=0.85; else if(zone==='stomach') dmg*=1.1;
        if(hit.armor>0){ const absorb=Math.min(hit.armor, dmg*0.5); hit.armor-=absorb; dmg-=absorb*0.5; }
        hit.hp-=dmg; SFX.hit();
        // hit flash
        const flash=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,8), new THREE.MeshBasicMaterial({color: zone==='head'?0xff3333:0xffaa33, transparent:true, opacity:0.85})); flash.position.set(hit.pos.x,1.4,hit.pos.z); scene.add(flash); setTimeout(()=>scene.remove(flash),120);
        if(hit.hp<=0){ hit.alive=false; hit.hp=0; if(hit.mesh) hit.mesh.visible=false; if(hit.hasBomb){ // drop bomb
            bombRef.current.carrier=null; bombRef.current.pos=hit.pos.clone(); bombMesh.position.copy(hit.pos); bombMesh.position.y=0.08; bombMesh.visible=true; hit.hasBomb=false;
          }
          const ev:KillEvent={t:Date.now(), killer: p.team+':'+p.id, victim: hit.team+':'+hit.id, weapon:p.weapon, headshot:zone==='head'}; setKillfeed((k:KillEvent[])=> [ev,...k].slice(0,5)); SFX.kill();
          // check win
          const aliveCT=bots.filter(b=>b.team==='CT'&&b.alive).length, aliveT=bots.filter(b=>b.team==='T'&&b.alive).length;
          if(aliveCT===0 && !bombRef.current.planted){ setPhase('tWin'); setC4Msg('T 胜 — CT 全灭'); }
          if(aliveT===0 && !bombRef.current.planted){ setPhase('ctWin'); setC4Msg('CT 胜 — T 全灭'); }
        }
      }
    };
    mount.addEventListener('mousedown',onMouseDown);
    window.addEventListener('mousemove',onMouseMove);
    mount.addEventListener('contextmenu',(e:MouseEvent)=>e.preventDefault());
    const onResize=()=>{ camera.aspect=mount.clientWidth/mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth,mount.clientHeight); };
    window.addEventListener('resize',onResize);

    let last=performance.now(); let footTimer=0;
    let raf=0;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(); const dt=Math.min(0.033,(now-last)/1000); last=now;
      spreadRef.current=Math.max(0,spreadRef.current - dt*0.9);
      // physics move
      const speed= keys.current['shift']? 5.2: 3.8;
      const forward=new THREE.Vector3(-Math.sin(yaw.current),0,-Math.cos(yaw.current));
      const right=new THREE.Vector3(Math.cos(yaw.current),0,-Math.sin(yaw.current));
      const mv=new THREE.Vector3(); if(keys.current['w']) mv.add(forward); if(keys.current['s']) mv.sub(forward); if(keys.current['a']) mv.sub(right); if(keys.current['d']) mv.add(right);
      if(mv.length()>0) mv.normalize();
      // simple gravity/jump
      if(onGround.current) vel.current.y=0; else vel.current.y -= 18*dt;
      if(keys.current[' '] && onGround.current){ vel.current.y=6.4; onGround.current=false; }
      const next=camera.position.clone();
      const wish=mv.clone().multiplyScalar(speed*dt);
      next.x+=wish.x; if(isInsideWall(next.x,next.z,0.38)){ next.x=camera.position.x; }
      next.z+=wish.z; if(isInsideWall(next.x,next.z,0.38)){ next.z=camera.position.z; }
      next.y+=vel.current.y*dt;
      if(next.y<1.62){ next.y=1.62; vel.current.y=0; onGround.current=true; }
      if(next.y>1.62+0.01) onGround.current=false;
      if(isInsideWall(next.x,next.z,0.38)) { camera.position.x=next.x; camera.position.z=next.z; } else camera.position.copy(next);
      playerPos.current.copy(camera.position);
      camera.rotation.order='YXZ'; camera.rotation.set(pitch.current, yaw.current, 0);
      // scoped fov
      camera.fov= scoped? 28:74; camera.updateProjectionMatrix();
      vmGroup.visible=!scoped; // hide viewmodel when scoped
      // bomb timer
      if(bombRef.current.planted){
        bombRef.current.timer-=dt; bombMesh.material = bombMesh.material as THREE.MeshStandardMaterial; (bombMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(now*0.012)*0.5;
        if(bombRef.current.timer<=0){ bombRef.current.planted=false; bombMesh.visible=false; setPhase('tWin'); setC4Msg('C4 爆炸 — T 胜'); SFX.explode(); }
        else setC4Msg(`C4 已安放 — ${bombRef.current.timer.toFixed(1)}s 后爆炸 (CT 按 E 拆包)`);
      }
      // bomb pickup
      if(bombRef.current.pos){
        const d=Math.hypot(camera.position.x-bombRef.current.pos.x, camera.position.z-bombRef.current.pos.z);
        if(d<1.4 && bots[0].team==='T' && bots[0].alive){ bots[0].hasBomb=true; bombRef.current.carrier=bots[0].id; bombRef.current.pos=null; bombMesh.visible=false; setC4Msg('已拾取 C4 — 前往 A 或 B 安放 (E)'); }
      }
      // bots AI - simple
      for(const b of bots){
        if(!b.alive || b.id===playerId.current){ if(b.mesh){ b.mesh.position.copy(b.pos); } continue; }
        // find nearest enemy
        let nearest:Bot|null=null; let nd=999;
        for(const o of bots){ if(!o.alive||o.team===b.team) continue; const d=b.pos.distanceTo(o.pos); if(d<nd && hasLineOfSight({x:b.pos.x,z:b.pos.z},{x:o.pos.x,z:o.pos.z}) && d<26){ nd=d; nearest=o; } }
        // C4 behaviors
        const isCarrier=b.hasBomb; const planted=bombRef.current.planted;
        let dest: THREE.Vector3 | null = null;
        if(b.team==='T' && isCarrier && !planted){
          const site = Math.hypot(b.pos.x-SPAWNS.A.x,b.pos.z-SPAWNS.A.z) < Math.hypot(b.pos.x-SPAWNS.B.x,b.pos.z-SPAWNS.B.z)? SPAWNS.A: SPAWNS.B;
          dest=new THREE.Vector3(site.x,0,site.z);
          if(Math.hypot(b.pos.x-site.x,b.pos.z-site.z)<1.2){
            // plant
            bombRef.current.planted=true; bombRef.current.plantPos=new THREE.Vector3(site.x,0,site.z); bombRef.current.timer=40; bombRef.current.carrier=null; b.hasBomb=false; bombMesh.position.copy(bombRef.current.plantPos); bombMesh.position.y=0.08; bombMesh.visible=true; SFX.plant(); setC4Msg(`T 已在 ${site===SPAWNS.A?'A':'B'} 安放 C4`);
          }
        } else if(b.team==='CT' && planted && bombRef.current.plantPos){
          dest=bombRef.current.plantPos.clone();
          if(b.pos.distanceTo(dest)<1.4){ bombRef.current.defuse+=dt*1.1; if(bombRef.current.defuse>=5){ bombRef.current.planted=false; bombRef.current.defuse=0; bombMesh.visible=false; setPhase('ctWin'); setC4Msg('CT 已拆除 C4 — CT 胜'); SFX.defuse(); }}
        } else if(nearest){
          dest=nearest.pos.clone();
          if(nd<18 && performance.now()-b.lastShot > 60000/WEAPONS[b.weapon].fireRate){
            b.lastShot=performance.now();
            // shoot at nearest - simple hit chance
            const def=WEAPONS[b.weapon]; const hitChance = def.id==='awp'?0.62: def.id==='ak47'?0.38:0.48;
            if(Math.random()<hitChance){
              const zone: 'head'|'chest' = Math.random()<0.18?'head':'chest'; let dmg=def.damage*(zone==='head'?2:1);
              const target=bots.find(x=>x.id===nearest.id); if(target){
                if(target.armor>0){ const ab=Math.min(target.armor,dmg*0.5); target.armor-=ab; dmg-=ab*0.5; }
                target.hp-=dmg; if(target.hp<=0){ target.alive=false; if(target.mesh) target.mesh.visible=false; if(target.hasBomb){ bombRef.current.carrier=null; bombRef.current.pos=target.pos.clone(); bombMesh.position.copy(target.pos); bombMesh.position.y=0.08; bombMesh.visible=true; target.hasBomb=false; }
                  const ev:KillEvent={t:Date.now(), killer: b.team+':'+b.id, victim: target.team+':'+target.id, weapon:b.weapon, headshot:zone==='head'}; setKillfeed((k:KillEvent[])=> [ev,...k].slice(0,5));
                  if(target.id===playerId.current){ SFX.hit(); }
                } else if(target.id===playerId.current) SFX.hit();
              }
              // sound
              if(def.id==='ak47') SFX.ak(); else if(def.id==='m4a4') SFX.m4(); else if(def.id==='awp') SFX.awp(); else SFX.glock();
            }
            b.yaw = Math.atan2(nearest.pos.x - b.pos.x, nearest.pos.z - b.pos.z);
          }
        } else {
          // patrol to random nav point
          if(!b.target || b.pos.distanceTo(b.target)<1.2){
            const pts=[SPAWNS.A, SPAWNS.B, {x:0,z:-5},{x:-10,z:-12},{x:10,z:8},{x:-2,z:10}];
            const p=pts[Math.floor(Math.random()*pts.length)];
            b.target=new THREE.Vector3(p.x,0,p.z);
          }
          dest=b.target;
        }
        if(dest){
          const dir=dest.clone().sub(b.pos); dir.y=0; const len=dir.length(); if(len>0.08){ dir.normalize(); const step=dir.multiplyScalar(Math.min(len, 2.6*dt)); const nx=b.pos.x+step.x, nz=b.pos.z+step.z; if(isInsideWall(nx,nz,0.38)){ // try sidestep
              const tryX=b.pos.x+step.z*0.6, tryZ=b.pos.z-step.x*0.6; if(isInsideWall(tryX,tryZ,0.38))b.target=null; else { b.pos.x=tryX; b.pos.z=tryZ; }
            }  else { b.pos.x=nx; b.pos.z=nz; b.yaw=Math.atan2(step.x,step.z); } }
        }
        if(b.mesh){ b.mesh.position.copy(b.pos); b.mesh.position.y=0; b.mesh.rotation.y=b.yaw; // bob
          const moving = dest && b.pos.distanceTo(dest)>0.3; if(moving){ b.mesh.position.y=Math.abs(Math.sin(now*0.012+b.id))*0.04; }
          // update weapon orientation to face enemy if any
          if(nearest){ b.mesh.rotation.y = Math.atan2(nearest.pos.x - b.pos.x, nearest.pos.z - b.pos.z); }
        }
      }
      // footstep
      if(mv.length()>0 && onGround.current){ footTimer+=dt; if(footTimer>0.42){ footTimer=0; SFX.foot(); }}
      // HUD update
      const p0=bots[0]; if(p0){
        setHud((h:typeof hud)=> ({...h, hp:Math.max(0,Math.round(p0.hp)), armor:Math.round(p0.armor), ammo:p0.ammo, reserve:p0.reserve, weapon:p0.weapon}));
        // spectate if dead - switch to teammate
        if(!p0.alive && phase==='live'){
          const aliveCT=bots.filter(b=>b.team==='CT'&&b.alive); if(aliveCT.length>0){ const nxt=aliveCT[0]; camera.position.set(nxt.pos.x,1.62,nxt.pos.z); yaw.current=nxt.yaw; }
        }
      }
      // minimap
      if(minimapRef.current){
        const c=minimapRef.current, g=c.getContext('2d'); if(g){
          const W=c.width, H=c.height; g.clearRect(0,0,W,H);
          g.fillStyle='#1a2333'; g.fillRect(0,0,W,H);
          g.strokeStyle='rgba(255,255,255,0.08)'; g.lineWidth=1; for(let i=0;i<=4;i++){ g.beginPath(); g.moveTo(i*W/4,0); g.lineTo(i*W/4,H); g.stroke(); g.beginPath(); g.moveTo(0,i*H/4); g.lineTo(W,i*H/4); g.stroke();}
          const toMin=(x:number,z:number)=> ({x:(x+44)/88*W, y:(z+44)/88*H});
          // walls
          g.fillStyle='rgba(200,184,154,0.9)'; for(const w of WALLS.slice(0,12)){ const a=toMin(w.min.x,w.min.z), b=toMin(w.max.x,w.max.z); g.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);}
          // sites
          const a=toMin(SPAWNS.A.x,SPAWNS.A.z); g.fillStyle='rgba(74,140,255,0.22)'; g.beginPath(); g.arc(a.x,a.y,7,0,Math.PI*2); g.fill();
          const b2=toMin(SPAWNS.B.x,SPAWNS.B.z); g.fillStyle='rgba(255,138,42,0.22)'; g.beginPath(); g.arc(b2.x,b2.y,6,0,Math.PI*2); g.fill();
          // bomb
          if(bombRef.current.planted && bombRef.current.plantPos){ const p=toMin(bombRef.current.plantPos.x,bombRef.current.plantPos.z); g.fillStyle='#ff3a2a'; g.beginPath(); g.arc(p.x,p.y,4,0,Math.PI*2); g.fill(); g.strokeStyle='#fff'; g.lineWidth=1; g.stroke();}
          else if(bombRef.current.pos){ const p=toMin(bombRef.current.pos.x,bombRef.current.pos.z); g.fillStyle='#ffcc00'; g.fillRect(p.x-3,p.y-3,6,6); }
          else if(bombRef.current.carrier!==null){ const car=bots.find(x=>x.id===bombRef.current.carrier); if(car){ const p=toMin(car.pos.x,car.pos.z); g.fillStyle='#ffcc00'; g.beginPath(); g.arc(p.x,p.y,3,0,Math.PI*2); g.fill(); }}
          // players
          for(const b of bots){ if(!b.alive) continue; const p=toMin(b.pos.x,b.pos.z); const isPlayer=b.id===playerId.current; g.fillStyle= b.team==='CT'? '#4a8cff':'#ff8a2a'; if(isPlayer) g.fillStyle='#ffffff';
            g.beginPath(); g.arc(p.x,p.y, isPlayer?4:3,0,Math.PI*2); g.fill(); g.fillStyle='rgba(255,255,255,0.9)'; g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x+Math.sin(b.yaw)* (isPlayer?7:5), p.y+Math.cos(b.yaw)* (isPlayer?7:5)); g.strokeStyle=g.fillStyle; g.lineWidth=1.2; g.stroke();
          }
          // self
          const self=toMin(camera.position.x,camera.position.z); g.fillStyle='#ffffff'; g.beginPath(); g.arc(self.x,self.y,3.5,0,Math.PI*2); g.fill();
        }
      }
      renderer.render(scene,camera);
    };
    tick();
    const onClick=()=>{ if(document.pointerLockElement!==renderer.domElement) renderer.domElement.requestPointerLock(); };
    renderer.domElement.addEventListener('click',onClick);
    return()=>{
      cancelAnimationFrame(raf); window.removeEventListener('keydown',onKeyDown); window.removeEventListener('keyup',onKeyUp);
      window.removeEventListener('mousemove',onMouseMove); window.removeEventListener('resize',onResize);
      renderer.domElement.removeEventListener('click',onClick); mount.removeChild(renderer.domElement); renderer.dispose();
    };
  },[pistolRound, scoped, phase]);

  const p0def=WEAPONS[hud.weapon as WeaponId];

  return (
    <div ref={mountRef} style={{width:'100%',height:'100%',position:'relative',background:'#0b0e12'}}>
      <div className="hud">
        <div className="panel" style={{left:14,top:14,right:'auto',minWidth:280}}>
          <div style={{fontSize:13,letterSpacing:0.14, fontWeight:700}}>DUST II — 5v5 原型 <span style={{opacity:0.6,fontWeight:400,marginLeft:8}}>{pistolRound?'手枪局':'长枪局'}</span></div>
          <div style={{fontSize:11,opacity:0.72,marginTop:4}}>WASD 移动 · 空格跳跃 · 鼠标环视 · 左键开火 · 右键 AWP 开镜 · R 换弹 · 1-4 切枪 · E 安放/拆除 · Shift 奔跑</div>
          <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
            <button onClick={()=> setPistolRound((v:boolean)=>!v)} style={{pointerEvents:'auto',padding:'6px 10px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(20,26,40,0.9)',color:'#e6eaf0',cursor:'pointer',fontSize:11}}>{pistolRound?'切换长枪局':'切换手枪局'}</button>
            <button onClick={()=> location.reload()} style={{pointerEvents:'auto',padding:'6px 10px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(20,26,40,0.9)',color:'#e6eaf0',cursor:'pointer',fontSize:11}}>重开回合</button>
            <button onClick={()=> setShowHelp((v:boolean)=>!v)} style={{pointerEvents:'auto',padding:'6px 10px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',background:showHelp?'rgba(74,123,255,0.9)':'rgba(20,26,40,0.9)',color:'#fff',cursor:'pointer',fontSize:11}}>{showHelp?'隐藏帮助':'显示帮助'}</button>
          </div>
          {showHelp && <div style={{marginTop:8,fontSize:11,lineHeight:1.6,opacity:0.78,background:'rgba(0,0,0,0.22)',padding:8,borderRadius:8}}>地图：CT 出生点 → A大 → A点 · 中门(可穿过) → 猫道 · B洞 → B点，全部连通且有碰撞。CT 蓝 / T 橙 可一眼区分，角色含头/躯干/双臂/双腿。回合开始 C4 随机给 T，A/B 可安放，CT 可拆除。玩家阵亡后自动切到队友视角。</div>}
          {c4Msg && <div style={{marginTop:8,fontSize:12,background:'rgba(255,60,40,0.14)',border:'1px solid rgba(255,60,40,0.28)',padding:8,borderRadius:8,color:'#ffcfc0'}}>{c4Msg}</div>}
          {phase!=='live' && <div style={{marginTop:8,fontSize:14,fontWeight:800,padding:10,borderRadius:10,background: phase==='tWin'?'rgba(255,120,40,0.18)':'rgba(74,140,255,0.18)',border:'1px solid rgba(255,255,255,0.12)'}}>{phase==='tWin'?'T 胜利':'CT 胜利'} — 点击“重开回合”再战</div>}
        </div>

        <div className="panel" style={{right:14,top:14,left:'auto',minWidth:220}}>
          <div style={{fontSize:11,letterSpacing:0.12,opacity:0.7}}>KILL FEED</div>
          <div style={{marginTop:6,display:'flex',flexDirection:'column',gap:4}}>
            {killfeed.length===0 && <div style={{fontSize:11,opacity:0.5}}>暂无击杀</div>}
            {killfeed.map((k,i)=>(
              <div key={k.t+i} style={{fontSize:11,background:'rgba(0,0,0,0.32)',padding:'6px 8px',borderRadius:8, borderLeft:`3px solid ${k.weapon==='awp'?'#ff3a2a':k.headshot?'#ffaa2a':'rgba(255,255,255,0.18)'}`}}>
                <span style={{color: k.killer.startsWith('CT')?'#4a8cff':'#ff8a2a'}}>{k.killer}</span> <span style={{opacity:0.6}}>→</span> <span style={{color: k.victim.startsWith('CT')?'#4a8cff':'#ff8a2a'}}>{k.victim}</span> <span style={{marginLeft:6,opacity:0.7}}>{k.weapon}</span> {k.headshot&&<span style={{marginLeft:6,background:'#ff3a2a',color:'#fff',padding:'1px 5px',borderRadius:999,fontSize:10}}>爆头</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{left:14,bottom:14,right:'auto',display:'flex',gap:14,alignItems:'center',padding:'12px 14px'}}>
          <div style={{width:64,height:64,borderRadius:10,background:`linear-gradient(135deg, ${hud.hp<30?'#ff3a2a':'#1a3a5a'}, #0e1218)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:22,border:'1px solid rgba(255,255,255,0.1)'}}>{hud.hp}</div>
          <div>
            <div style={{fontSize:11,opacity:0.6,letterSpacing:0.1}}>生命 / 护甲</div>
            <div style={{fontSize:13,marginTop:2}}><span style={{fontWeight:700}}>{hud.hp} HP</span> <span style={{marginLeft:10,opacity:0.8,background:'rgba(74,140,255,0.18)',padding:'2px 6px',borderRadius:999}}>{hud.armor} ARMOR</span></div>
            <div style={{marginTop:6,height:6,background:'rgba(255,255,255,0.08)',borderRadius:999,overflow:'hidden',width:160}}><div style={{width:`${hud.hp}%`,height:'100%',background: hud.hp<30?'#ff3a2a':'#4a8cff'}}/></div>
          </div>
          <div style={{width:1,height:44,background:'rgba(255,255,255,0.08)'}}/>
          <div>
            <div style={{fontSize:11,opacity:0.6,letterSpacing:0.1}}>{p0def.name}</div>
            <div style={{fontSize:18,fontWeight:800,marginTop:2,letterSpacing:0.04}}>{p0def.mag===0? '—': `${hud.ammo} / ${hud.reserve}`}</div>
            <div style={{fontSize:11,opacity:0.7,marginTop:2}}>{p0def.slot==='melee'?'近战':`${p0def.fireRate} RPM · ${p0def.damage} dmg`}</div>
          </div>
        </div>

        <div className="panel" style={{right:14,bottom:14,left:'auto',padding:8,background:'rgba(10,14,22,0.86)'}}>
          <div style={{fontSize:11,letterSpacing:0.12,opacity:0.7,marginBottom:6}}>MINIMAP — DUST II</div>
          <canvas ref={minimapRef} width={176} height={176} style={{width:176,height:176,display:'block',borderRadius:8,background:'#1a2333',border:'1px solid rgba(255,255,255,0.08)'}}/>
          <div style={{fontSize:10,opacity:0.6,marginTop:4,lineHeight:1.4}}>白点 自己 · 蓝 CT 橙 T 带朝向 · 黄 C4</div>
        </div>

        <div className="crosshair" style={{opacity: scoped?0:1, transform:`translate(-50%,-50%) scale(${1 + ( (WEAPONS[hud.weapon].recoil*0.08) )})`}}/>
        <div className={`scope ${scoped?'on':''}`}/>
        {scoped && <div style={{position:'absolute',left:'50%',top:'50%',width:2,height:2,background:'#fff',borderRadius:999,transform:'translate(-50%,-50%)',boxShadow:'0 0 8px rgba(0,0,0,0.8)'}}/>}
      </div>
    </div>
  );
}

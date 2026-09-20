import * as THREE from 'three';
import { DustMap, locationName, ROUTES, SITES, SPAWNS } from './map';
import { createBomb, createGun, createHumanoid, disposeMaterials, disposeModel } from './models';
import { SynthAudio } from './audio';
import { damageFor, makeWeapon, WEAPONS } from './weapons';
import type { HitZone, Slot, WeaponId } from './weapons';
import type { Actor, BombState, GameConfig, GameSnapshot, KillEvent, Team } from './types';

const EYE=1.64;
const DEFAULT_CONFIG:GameConfig={team:'CT',pistolRound:false,primary:'m4a4',secondary:'default'};
const NAMES={CT:['NOMAD','GHOST','ATLAS','VIPER','ECHO'],T:['SABLE','JACKAL','ROOK','KOBRA','HAVOC']};
const vec=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export class GameEngine {
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.PerspectiveCamera(78,1,.06,240);
  readonly viewScene=new THREE.Scene();
  readonly viewCamera=new THREE.PerspectiveCamera(65,1,.01,10);
  readonly renderer:THREE.WebGLRenderer;
  readonly map:DustMap;
  readonly audio=new SynthAudio();
  actors:Actor[]=[];
  config:GameConfig={...DEFAULT_CONFIG};
  bomb:BombState={state:'carried',carrier:null,position:vec(),timer:40,progress:0,actor:null,site:null};
  playerId=0;spectatorId=0;
  phase:GameSnapshot['phase']='freeze';round=1;timer=115;freeze=3;
  score:Record<Team,number>={CT:0,T:0};winner:Team|null=null;result='';
  started=false;paused=true;locked=false;error='';elapsed=0;
  yaw=0;pitch=0;scoped=false;recoil=0;spread=0;hit=0;hurt=0;headshot=false;
  lastHitZone:HitZone|null=null;
  private keys=new Set<string>();private trigger=false;private shotPressed=false;
  private accumulator=0;private lastTime=0;private hudTime=0;private frame=0;private raf=0;private disposed=false;
  private viewGun=new THREE.Group();private viewWeapon:WeaponId|null=null;
  private muzzle:THREE.Mesh;private muzzleTimer=0;private bombMesh=createBomb();private bombLight:THREE.PointLight;
  private subscribers=new Set<()=>void>();private snapshot!:GameSnapshot;
  private feed:KillEvent[]=[];private feedId=0;private interaction='';private interactionProgress=0;
  private lastBeep=0;private aimKick=0;private spectateIndex=0;private frames=0;private fpsTime=0;private fps=60;
  private defuserId:number|null=null;
  private traces:{line:THREE.Line;life:number}[]=[];
  private sparks:{mesh:THREE.Mesh;life:number}[]=[];
  private resizeObserver:ResizeObserver;

  constructor(private container:HTMLDivElement) {
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.65));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
    this.renderer.setClearColor(0xb9cdce);this.renderer.autoClear=false;
    this.renderer.domElement.setAttribute('aria-label','Dust II 3D tactical battlefield');
    container.appendChild(this.renderer.domElement);
    this.scene.background=new THREE.Color(0xb9cdce);this.scene.fog=new THREE.Fog(0xc0cdca,60,175);
    this.scene.add(new THREE.HemisphereLight(0xd6e8f2,0x897455,2.6));
    const sun=new THREE.DirectionalLight(0xffe1ae,3.4);sun.position.set(-36,62,28);sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:160});
    sun.shadow.bias=-.0007;sun.shadow.normalBias=.035;sun.shadow.radius=3;this.scene.add(sun);
    this.map=new DustMap(this.scene);
    this.scene.add(this.bombMesh);this.bombLight=new THREE.PointLight(0xf15f40,0,5);this.scene.add(this.bombLight);
    this.viewScene.add(new THREE.HemisphereLight(0xe1f0f7,0x887960,2.2));
    const key=new THREE.DirectionalLight(0xffedcf,3.2);key.position.set(-2,3,-1);this.viewScene.add(key);
    this.muzzle=new THREE.Mesh(new THREE.ConeGeometry(.07,.24,5),new THREE.MeshBasicMaterial({color:0xffdb82,transparent:true,opacity:.92,depthTest:false}));
    this.muzzle.rotation.x=-Math.PI/2;this.muzzle.visible=false;this.viewScene.add(this.muzzle);
    this.camera.rotation.order='YXZ';
    this.resetRound(true);
    this.updateSnapshot();
    this.resizeObserver=new ResizeObserver(this.resize);this.resizeObserver.observe(container);this.resize();
    document.addEventListener('pointerlockchange',this.onLockChange);
    document.addEventListener('pointerlockerror',this.onLockError);
    window.addEventListener('keydown',this.onKeyDown);window.addEventListener('keyup',this.onKeyUp);
    window.addEventListener('mousemove',this.onMouseMove);window.addEventListener('mousedown',this.onMouseDown);window.addEventListener('mouseup',this.onMouseUp);
    window.addEventListener('contextmenu',this.onContextMenu);window.addEventListener('blur',this.onBlur);
    this.raf=requestAnimationFrame(this.loop);
  }
  subscribe=(listener:()=>void)=>{this.subscribers.add(listener);return()=>this.subscribers.delete(listener);};
  getSnapshot=()=>this.snapshot;
  get player(){return this.actors.find(a=>a.id===this.playerId)!;}
  private get watched(){
    if(this.player.alive)return this.player;
    let watched=this.actors.find(a=>a.id===this.spectatorId&&a.alive);
    if(!watched){watched=this.actors.find(a=>a.team===this.config.team&&a.alive);if(watched)this.spectatorId=watched.id;}
    return watched??this.player;
  }
  private resize=()=>{
    const w=this.container.clientWidth,h=this.container.clientHeight;
    this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.viewCamera.aspect=w/h;this.viewCamera.updateProjectionMatrix();
  };
  start(config:GameConfig) {
    this.config={...config};this.round=1;this.score={CT:0,T:0};this.elapsed=0;this.started=true;this.paused=false;this.error='';
    this.keys.clear();this.trigger=false;this.shotPressed=false;this.accumulator=0;
    this.resetRound(true);void this.audio.unlock();this.lock();this.updateSnapshot();
  }
  resume=()=>{this.error='';this.paused=false;void this.audio.unlock();this.lock();this.updateSnapshot();};
  private lock() {
    try {const request=this.renderer.domElement.requestPointerLock();if(request)void request.catch(()=>this.onLockError());}
    catch{this.onLockError();}
  }
  pause=()=>{this.paused=true;this.keys.clear();this.trigger=false;this.shotPressed=false;this.scoped=false;if(document.pointerLockElement)document.exitPointerLock();this.updateSnapshot();};
  toggleSound=()=>{this.audio.toggle();this.updateSnapshot();};
  private onLockChange=()=>{
    this.locked=document.pointerLockElement===this.renderer.domElement;
    if(!this.locked&&this.started){this.paused=true;this.keys.clear();this.trigger=false;this.shotPressed=false;}
    else if(this.locked)this.paused=false;
    this.updateSnapshot();
  };
  private onLockError=()=>{this.error='Click deploy again to enable mouse capture. If your browser blocks it, open this page in its own tab.';this.paused=true;this.updateSnapshot();};
  private onBlur=()=>{if(this.started&&!this.paused)this.pause();};
  private onContextMenu=(e:MouseEvent)=>{if(this.locked)e.preventDefault();};
  private onKeyDown=(e:KeyboardEvent)=>{
    if(!this.started||this.paused)return;
    if(['Space','Tab','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();
    this.keys.add(e.code);if(e.repeat)return;
    if(e.code==='KeyR')this.reload(this.player);
    if(e.code==='Digit1')this.switchSlot('primary');if(e.code==='Digit2')this.switchSlot('secondary');if(e.code==='Digit3')this.switchSlot('melee');
    if(e.code==='KeyQ'&&!this.player.alive)this.cycleSpectator();
    if(e.code==='KeyE'&&!this.player.alive)this.takeover();
    if(e.code==='KeyM')this.toggleSound();
  };
  private onKeyUp=(e:KeyboardEvent)=>this.keys.delete(e.code);
  private onMouseMove=(e:MouseEvent)=>{if(this.locked&&!this.paused&&this.player.alive){const sensitivity=this.scoped?.00068:.0021;this.yaw-=e.movementX*sensitivity;this.pitch=clamp(this.pitch-e.movementY*sensitivity,-1.48,1.48);}};
  private onMouseDown=(e:MouseEvent)=>{
    if(!this.locked||this.paused)return;
    if(e.button===0){this.trigger=true;this.shotPressed=true;}
    if(e.button===2&&this.player.inventory[this.player.slot]?.id==='awp'&&this.player.alive){this.scoped=!this.scoped;this.audio.scope();}
  };
  private onMouseUp=(e:MouseEvent)=>{if(e.button===0)this.trigger=false;};
  switchSlot(slot:Slot) {
    const p=this.player;if(!p.alive||!p.inventory[slot]||p.slot===slot)return;
    p.slot=slot;p.reloadTime=0;p.cooldown=Math.max(p.cooldown,.24);this.scoped=false;this.spread=0;this.setViewGun(p.inventory[slot]!.id);this.changeBotGun(p);this.updateSnapshot();
  }
  private setViewGun(id:WeaponId) {
    if(id===this.viewWeapon)return;disposeModel(this.viewGun);this.viewScene.remove(this.viewGun);
    this.viewGun=createGun(id,true);this.viewGun.position.set(.29,-.27,-.52);this.viewGun.rotation.set(.035,-.045,0);this.viewScene.add(this.viewGun);this.viewWeapon=id;
  }
  private resetRound(resetStats=false) {
    const stats=this.actors.map(a=>({kills:a.kills,deaths:a.deaths}));
    for(const a of this.actors){this.scene.remove(a.group);disposeModel(a.group);}this.actors=[];
    this.phase='freeze';this.freeze=3;this.timer=115;this.winner=null;this.result='';this.feed=[];this.defuserId=null;
    this.scoped=false;this.hit=0;this.hurt=0;this.spread=0;this.pitch=0;this.recoil=0;
    const pistol=this.config.pistolRound&&this.round===1;
    for(let id=0;id<10;id++) {
      const team:Team=id<5?'CT':'T',index=id%5;
      const primary=id===(this.config.team==='CT'?0:5)?this.config.primary:team==='CT'?(index===4?'awp':'m4a4'):(index===4?'awp':'ak47');
      const secondary=!pistol&&id===(this.config.team==='CT'?0:5)&&this.config.secondary==='deagle'?'deagle':team==='CT'?'usp':'glock';
      const spawn=SPAWNS[team].clone().add(vec((index-2)*1.45,0,index%2?1.3:-1.3));
      const actor:Actor={id,name:NAMES[team][index],team,position:spawn,velocityY:0,yaw:team==='CT'?Math.PI:0,hp:100,armor:pistol?25:100,alive:true,grounded:true,
        inventory:{secondary:makeWeapon(secondary),melee:makeWeapon('knife'),...(!pistol?{primary:makeWeapon(primary)}:{})},slot:pistol?'secondary':'primary',cooldown:0,reloadTime:0,kills:resetStats?0:stats[id]?.kills??0,deaths:resetStats?0:stats[id]?.deaths??0,
        ...createHumanoid(id,team,pistol?secondary:primary),ai:{state:'advance',path:[],think:0,target:null,destination:null,route:index%3,reaction:.3+Math.random()*.4,repath:0},moving:0,step:0,lastSeen:-100};
      actor.group.position.copy(spawn);actor.group.rotation.y=actor.yaw;this.actors.push(actor);this.scene.add(actor.group);
    }
    this.playerId=this.config.team==='CT'?0:5;this.spectatorId=this.playerId;this.yaw=this.player.yaw;
    const carrier=this.config.team==='T'?5:6;
    this.bomb={state:'carried',carrier,position:this.actors[carrier].position.clone(),timer:40,progress:0,actor:null,site:null};
    this.setViewGun(this.player.inventory[this.player.slot]!.id);
    this.audio.round();
  }
  private loop=(now:number)=>{
    if(this.disposed)return;
    const dt=Math.min((now-(this.lastTime||now))/1000,.08);this.lastTime=now;
    this.frames++;this.fpsTime+=dt;if(this.fpsTime>.6){this.fps=Math.round(this.frames/this.fpsTime);this.frames=0;this.fpsTime=0;}
    if(this.started&&!this.paused){this.accumulator+=dt;while(this.accumulator>=1/60){this.fixedUpdate(1/60);this.accumulator-=1/60;}}
    else this.accumulator=0;
    this.render(dt,now/1000);this.hudTime+=dt;
    if(this.hudTime>.075){this.updateSnapshot();this.hudTime=0;}
    this.raf=requestAnimationFrame(this.loop);
  };
  fixedUpdate(dt:number) {
    this.elapsed+=dt;this.frame++;
    this.hit=Math.max(0,this.hit-dt);this.hurt=Math.max(0,this.hurt-dt*1.7);this.spread=Math.max(0,this.spread-dt*.048);
    this.recoil=THREE.MathUtils.damp(this.recoil,0,8,dt);this.aimKick=THREE.MathUtils.damp(this.aimKick,0,12,dt);
    this.muzzleTimer=Math.max(0,this.muzzleTimer-dt);
    if(this.phase==='over'){this.timer-=dt;if(this.timer<=0){this.round++;this.resetRound();}this.updateEffects(dt);return;}
    if(this.phase==='freeze'){this.freeze-=dt;if(this.freeze<=0)this.phase='live';}
    else if(this.bomb.state!=='planted'){this.timer-=dt;if(this.timer<=0)this.endRound('CT','TIME EXPIRED');}
    for(const actor of this.actors) {
      if(!actor.alive)continue;
      actor.cooldown=Math.max(0,actor.cooldown-dt);
      if(actor.reloadTime>0){actor.reloadTime=Math.max(0,actor.reloadTime-dt);if(actor.reloadTime===0){const state=actor.inventory[actor.slot]!;const count=Math.min(WEAPONS[state.id].magazine-state.ammo,state.reserve);state.ammo+=count;state.reserve-=count;}}
      if(actor.id===this.playerId)this.updatePlayer(actor,dt);
      else if(this.phase==='live')this.updateBot(actor,dt);
      const physics=this.map.vertical(actor.position,actor.velocityY-19*dt,dt);actor.velocityY=physics.velocity;actor.grounded=physics.grounded;
      actor.group.position.copy(actor.position);actor.group.rotation.y=actor.yaw;
      const gait=Math.sin(this.elapsed*11+actor.id)*.48*Math.min(1,actor.moving/3);
      actor.limbs[0].rotation.x=gait;actor.limbs[1].rotation.x=-gait;
      if(actor.moving>.8&&actor.grounded){actor.step+=dt*actor.moving/5;if(actor.step>.37){actor.step=0;if(actor.position.distanceTo(this.watched.position)<20)this.audio.step(actor.id===this.playerId?(this.keys.has('ShiftLeft')?12:0):actor.position.distanceTo(this.watched.position));}}
    }
    this.separateActors();this.updateBomb(dt);this.checkRound();this.updateEffects(dt);
    if(this.frame%12===0)this.updateVisibility();
    this.shotPressed=false;
  }
  private updatePlayer(actor:Actor,dt:number) {
    let x=Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA')),z=Number(this.keys.has('KeyS'))-Number(this.keys.has('KeyW'));
    const length=Math.hypot(x,z);if(length){x/=length;z/=length;}
    const weapon=actor.inventory[actor.slot]!;const speed=this.scoped?2.35:this.keys.has('ShiftLeft')?2.4:weapon.id==='knife'?6.1:5.15;
    const dx=(x*Math.cos(this.yaw)+z*Math.sin(this.yaw))*speed*dt,dz=(-x*Math.sin(this.yaw)+z*Math.cos(this.yaw))*speed*dt;
    const before=actor.position.clone();if(this.phase==='live')this.map.move(actor.position,dx,dz);
    actor.moving=before.distanceTo(actor.position)/dt;actor.yaw=this.yaw;
    if(this.keys.has('Space')&&actor.grounded&&this.phase==='live'){actor.velocityY=7;actor.grounded=false;}
    if(this.phase==='live'&&this.trigger&&(WEAPONS[weapon.id].automatic||this.shotPressed)) {
      const direction=vec(0,0,-1).applyEuler(new THREE.Euler(this.pitch+this.recoil,this.yaw,0,'YXZ'));
      this.fire(actor,direction);
    }
  }
  private eye(actor:Actor,height=EYE){return actor.position.clone().add(vec(0,height,0));}
  private updateBot(actor:Actor,dt:number) {
    actor.ai.think-=dt;actor.ai.repath-=dt;
    const eye=this.eye(actor);
    if(actor.ai.think<=0) {
      actor.ai.think=.18+Math.random()*.12;
      let target:Actor|undefined;let nearest=50;
      for(const enemy of this.actors) {
        if(!enemy.alive||enemy.team===actor.team)continue;
        const distance=actor.position.distanceTo(enemy.position);if(distance>=nearest)continue;
        // A forward field of view, with awareness of nearby threats.
        const delta=enemy.position.clone().sub(actor.position).normalize();const forward=vec(-Math.sin(actor.yaw),0,-Math.cos(actor.yaw));
        if(distance>11&&forward.dot(delta)<-.15&&actor.ai.target!==enemy.id)continue;
        if(this.map.canSee(eye,this.eye(enemy,1.32))||this.map.canSee(eye,this.eye(enemy,1.7))){nearest=distance;target=enemy;}
      }
      if(target){if(actor.ai.target!==target.id)actor.ai.reaction=.24+Math.random()*.42;actor.ai.target=target.id;actor.ai.state='engage';}
      else {actor.ai.target=null;this.chooseObjective(actor);}
    }
    const target=this.actors.find(a=>a.id===actor.ai.target&&a.alive);
    if(target) {
      actor.ai.reaction-=dt;const delta=target.position.clone().sub(actor.position);actor.yaw=Math.atan2(-delta.x,-delta.z);
      actor.moving=0;
      if(actor.ai.reaction<=0&&this.map.canSee(eye,this.eye(target,1.35))) {
        let current=actor.inventory[actor.slot]!;
        if(current.ammo<=0&&current.reserve<=0&&actor.inventory.secondary?.ammo){actor.slot='secondary';current=actor.inventory.secondary;this.changeBotGun(actor);}
        if(current.ammo===0)this.reload(actor);
        else {
          const height=Math.random()<.1?1.7:1.15+Math.random()*.35;
          const aim=this.eye(target,height).sub(eye);const error=.018+Math.min(.024,delta.length()*.0005);
          aim.x+=(Math.random()-.5)*delta.length()*error*2;aim.y+=(Math.random()-.5)*delta.length()*error*1.3;
          this.fire(actor,aim.normalize());
        }
      }
      // Brief lateral movement in fights still obeys the same collider.
      if(actor.reloadTime>0||Math.sin(this.elapsed*1.9+actor.id)>.45) {
        const side=Math.sin(this.elapsed*.6+actor.id)>0?1:-1;const before=actor.position.clone();
        this.map.move(actor.position,Math.cos(actor.yaw)*side*1.4*dt,-Math.sin(actor.yaw)*side*1.4*dt);actor.moving=actor.position.distanceTo(before)/dt;
      }
      return;
    }
    const state=actor.inventory[actor.slot]!;
    if(state.ammo<WEAPONS[state.id].magazine*.3&&actor.reloadTime<=0)this.reload(actor);
    if(actor.ai.state==='defuse'&&this.bomb.state==='planted'&&actor.position.distanceTo(this.bomb.position)<1.5){actor.moving=0;actor.ai.path=[];return;}
    const destination=actor.ai.destination;
    if(!destination){actor.moving=0;return;}
    if(actor.ai.repath<=0){actor.ai.path=this.map.nav.path(actor.position,destination);actor.ai.repath=.85+Math.random()*.5;}
    while(actor.ai.path.length&&actor.position.distanceTo(actor.ai.path[0])<.3)actor.ai.path.shift();
    if(actor.ai.path.length) {
      const next=actor.ai.path[0],delta=next.clone().sub(actor.position).setY(0),distance=delta.length();delta.normalize();
      actor.yaw=Math.atan2(-delta.x,-delta.z);const before=actor.position.clone();
      const speed=actor.ai.state==='defuse'?4.8:3.45;this.map.move(actor.position,delta.x*Math.min(distance,speed*dt),delta.z*Math.min(distance,speed*dt));
      actor.moving=before.distanceTo(actor.position)/dt;
      if(actor.moving<.1){actor.ai.repath=0;actor.ai.path=[];}
    } else {actor.moving=0;actor.yaw+=dt*.35;}
  }
  private changeBotGun(actor:Actor) {
    const old=actor.group.getObjectByName('held-weapon');if(old){disposeModel(old);actor.group.remove(old);}
    const gun=createGun(actor.inventory[actor.slot]!.id);gun.name='held-weapon';gun.position.set(.14,1.16,-.34);actor.group.add(gun);
  }
  private chooseObjective(actor:Actor) {
    let destination:THREE.Vector3;
    const bomb=this.bomb;
    if(bomb.state==='planted') {
      if(actor.team==='CT'){
        if(!this.actors.some(a=>a.id===this.defuserId&&a.alive)) {
          const candidates=this.actors.filter(a=>a.alive&&a.team==='CT'&&a.id!==this.playerId);
          candidates.sort((a,b)=>a.position.distanceToSquared(bomb.position)-b.position.distanceToSquared(bomb.position));
          this.defuserId=candidates[0]?.id??null;
        }
        if(actor.id===this.defuserId){actor.ai.state='defuse';destination=bomb.position.clone();}
        else {actor.ai.state='guard';destination=bomb.position.clone().add(vec(Math.cos(actor.id*2.4)*3.5,0,Math.sin(actor.id*2.4)*3.5));}
      }
      else {
        actor.ai.state='guard';const site=SITES[bomb.site!];
        destination=site.clone().add(vec((actor.id%3-1)*4,0,5+actor.id%2*3));
        if(this.map.blocked(destination.x,destination.z))destination=site.clone().add(vec(0,0,5));
      }
    } else if(actor.team==='T') {
      if(bomb.state==='dropped'){actor.ai.state='recover';destination=bomb.position.clone();}
      else {
        actor.ai.state='advance';const route=ROUTES[actor.ai.route];
        const stage=actor.group.userData.routeStage??0;destination=route[Math.min(stage,route.length-1)].clone();
        if(actor.position.distanceTo(destination)<2.6&&stage<route.length-1){actor.group.userData.routeStage=stage+1;destination=route[stage+1].clone();}
        if(bomb.carrier===actor.id&&this.siteAt(actor.position)){actor.ai.state='plant';destination=actor.position.clone();}
      }
    } else {
      actor.ai.state='guard';
      const patrols=[vec(2,0,-16),vec(30,0,-19),vec(-29,0,-9),vec(16,0,-13),vec(-23,0,-25)];
      destination=patrols[actor.id%5];
      if(115-this.timer>42) {
        const advance=[vec(1,0,3),vec(38,0,8),vec(-30,0,13),vec(16,0,9),vec(-18,0,12)];
        destination=advance[actor.id%5];
        if((115-this.timer)%28>20)destination=patrols[actor.id%5];
      }
    }
    if(!actor.ai.destination||actor.ai.destination.distanceTo(destination)>1.5)actor.ai.repath=0;
    actor.ai.destination=destination;
  }
  private separateActors() {
    for(let i=0;i<this.actors.length;i++)for(let j=i+1;j<this.actors.length;j++) {
      const a=this.actors[i],b=this.actors[j];if(!a.alive||!b.alive||Math.abs(a.position.y-b.position.y)>1.5)continue;
      const dx=a.position.x-b.position.x,dz=a.position.z-b.position.z,d=Math.hypot(dx,dz);
      if(d<.66&&d>.001){const push=(.66-d)*.5;this.map.move(a.position,dx/d*push,dz/d*push);this.map.move(b.position,-dx/d*push,-dz/d*push);}
    }
  }
  reload(actor:Actor) {
    if(!actor.alive||actor.reloadTime>0)return;const state=actor.inventory[actor.slot]!;const def=WEAPONS[state.id];
    if(state.id==='knife'||state.ammo>=def.magazine||state.reserve<=0)return;
    actor.reloadTime=def.reload;if(actor.id===this.playerId){this.scoped=false;this.audio.reload();}
  }
  fire(actor:Actor,direction:THREE.Vector3) {
    const state=actor.inventory[actor.slot]!;const weapon=WEAPONS[state.id];
    if(!actor.alive||actor.cooldown>0||actor.reloadTime>0||this.phase!=='live')return;
    if(state.ammo<=0){this.reload(actor);return;}
    if(weapon.id!=='knife')state.ammo--;actor.cooldown=weapon.interval;
    const isPlayer=actor.id===this.playerId;
    let spread=isPlayer?weapon.spread+this.spread+actor.moving*.0015:weapon.spread*.65;
    if(weapon.id==='awp'&&(isPlayer?this.scoped:true))spread=.0007+(actor.moving>.5?.017:0);
    direction.add(vec((Math.random()-.5)*spread*2,(Math.random()-.5)*spread*2,(Math.random()-.5)*spread*2)).normalize();
    const origin=this.eye(actor),wallDistance=this.map.rayDistance(origin,direction,weapon.range);
    this.scene.updateMatrixWorld(true);
    const raycaster=new THREE.Raycaster(origin,direction,0,wallDistance);
    const targets=this.actors.filter(a=>a.alive&&a.id!==actor.id).flatMap(a=>a.hitboxes);
    const hits=raycaster.intersectObjects(targets,false);const hit=hits[0];
    const end=hit?hit.point:origin.clone().addScaledVector(direction,wallDistance);
    if(hit) {
      const victim=this.actors.find(a=>a.id===hit.object.userData.actorId)!;
      if(victim.team!==actor.team)this.damage(victim,actor,weapon.id,hit.object.userData.zone as HitZone);
    } else if(wallDistance<weapon.range)this.impact(end);
    if(weapon.id!=='knife')this.trace(origin.clone().add(vec(.1,-.15,0)),end,isPlayer);
    this.audio.fire(weapon.id,isPlayer?0:actor.position.distanceTo(this.watched.position));
    if(isPlayer){this.recoil+=weapon.recoil;this.pitch=clamp(this.pitch+weapon.recoil*.28,-1.4,1.4);this.spread=Math.min(.052,this.spread+weapon.recoil*.3);this.aimKick=1;this.muzzleTimer=.055;if(weapon.id==='awp'&&this.scoped)this.scoped=false;}
  }
  damage(victim:Actor,attacker:Actor,weaponId:WeaponId,zone:HitZone) {
    if(!victim.alive||victim.team===attacker.team)return;
    const amount=damageFor(WEAPONS[weaponId],zone,victim.armor);victim.hp=Math.max(0,victim.hp-amount.health);victim.armor=Math.max(0,victim.armor-amount.armor);
    if(victim.id===this.playerId)this.hurt=.65;
    if(attacker.id===this.playerId){this.hit=.2;this.headshot=zone==='head';this.lastHitZone=zone;this.audio.hit(this.headshot);}
    victim.ai.target=attacker.id;victim.ai.reaction=.18;victim.ai.think=.3;
    if(victim.hp<=0)this.kill(victim,attacker,weaponId,zone==='head');
  }
  kill(victim:Actor,attacker:Actor,weapon:WeaponId,headshot=false) {
    if(!victim.alive)return;victim.alive=false;victim.hp=0;victim.deaths++;attacker.kills++;
    victim.group.rotation.z=Math.PI/2;victim.group.position.y=.22;victim.moving=0;
    this.feed.unshift({id:++this.feedId,attacker:attacker.id===this.playerId?'YOU':attacker.name,victim:victim.id===this.playerId?'YOU':victim.name,team:attacker.team,weapon,headshot,time:this.elapsed});this.feed=this.feed.slice(0,5);
    if(this.bomb.carrier===victim.id){this.bomb.state='dropped';this.bomb.carrier=null;this.bomb.position.copy(victim.position);this.bomb.progress=0;this.bomb.actor=null;}
    if(attacker.id===this.playerId)this.audio.kill();
    if(victim.id===this.playerId){this.scoped=false;this.trigger=false;this.keys.delete('KeyE');this.cycleSpectator();}
  }
  private siteAt(position:THREE.Vector3):'A'|'B'|null {for(const name of ['A','B'] as const)if(position.distanceTo(SITES[name])<6.5)return name;return null;}
  private updateBomb(dt:number) {
    const bomb=this.bomb;this.interaction='';this.interactionProgress=0;
    if(bomb.state==='carried') {
      const carrier=this.actors.find(a=>a.id===bomb.carrier&&a.alive);
      if(carrier){bomb.position.copy(carrier.position);const site=this.siteAt(carrier.position);
        if(carrier.id===this.playerId)this.interaction=site?'HOLD E TO PLANT C4':'YOU HAVE THE C4 · REACH A OR B';
        const wants=site&&this.phase==='live'&&carrier.moving<.3&&(carrier.id===this.playerId?this.keys.has('KeyE'):carrier.ai.target===null);
        if(wants){if(bomb.actor!==carrier.id){bomb.progress=0;bomb.actor=carrier.id;}bomb.progress+=dt/3.2;if(carrier.id===this.playerId){this.interaction='PLANTING C4';this.interactionProgress=bomb.progress;}
          if(bomb.progress>=1){bomb.state='planted';bomb.position.copy(carrier.position);bomb.carrier=null;bomb.timer=40;bomb.site=site;bomb.progress=0;bomb.actor=null;this.lastBeep=0;this.audio.plant();for(const a of this.actors){a.ai.think=0;a.ai.repath=0;}}
        }else{bomb.progress=0;bomb.actor=null;}
      }
    } else if(bomb.state==='dropped') {
      for(const a of this.actors)if(a.alive&&a.team==='T'&&a.position.distanceTo(bomb.position)<1.25){bomb.state='carried';bomb.carrier=a.id;bomb.progress=0;bomb.actor=null;break;}
    } else if(bomb.state==='planted') {
      bomb.timer-=dt;
      if(this.elapsed-this.lastBeep>Math.max(.13,bomb.timer/40)){this.audio.beep();this.lastBeep=this.elapsed;}
      const nearby=this.actors.filter(a=>a.alive&&a.team==='CT'&&a.position.distanceTo(bomb.position)<2.1);
      if(nearby.some(a=>a.id===this.playerId))this.interaction='HOLD E TO DEFUSE';
      const defuser=nearby.find(a=>a.moving<.35&&(a.id===this.playerId?this.keys.has('KeyE'):a.ai.target===null));
      if(defuser){if(bomb.actor!==defuser.id){bomb.progress=0;bomb.actor=defuser.id;}bomb.progress+=dt/5;
        if(defuser.id===this.playerId){this.interaction='DEFUSING C4';this.interactionProgress=bomb.progress;}
        if(bomb.progress>=1){bomb.state='defused';this.audio.defuse();this.endRound('CT','BOMB DEFUSED');}
      }else{bomb.progress=0;bomb.actor=null;}
      if(bomb.timer<=0&&bomb.state==='planted'){
        bomb.state='exploded';this.audio.explode();this.hurt=1;this.explosion(bomb.position);this.endRound('T','TARGET DESTROYED');
      }
    }
    this.bombMesh.visible=bomb.state==='dropped'||bomb.state==='planted'||bomb.state==='defused';
    this.bombMesh.position.copy(bomb.position).add(vec(0,.03,0));
    this.bombLight.position.copy(bomb.position).add(vec(0,.4,0));this.bombLight.intensity=bomb.state==='planted'?(Math.sin(this.elapsed*12)>0?2:0):0;
  }
  private checkRound() {
    if(this.phase!=='live')return;
    const ct=this.actors.filter(a=>a.team==='CT'&&a.alive).length,t=this.actors.filter(a=>a.team==='T'&&a.alive).length;
    if(ct===0)this.endRound('T','COUNTER-TERRORISTS ELIMINATED');
    else if(t===0&&this.bomb.state!=='planted')this.endRound('CT','TERRORISTS ELIMINATED');
  }
  endRound(team:Team,reason:string) {if(this.phase==='over')return;this.phase='over';this.winner=team;this.result=reason;this.score[team]++;this.timer=6;this.audio.round();}
  cycleSpectator=()=>{
    const allies=this.actors.filter(a=>a.team===this.config.team&&a.alive);
    if(allies.length){this.spectateIndex=(this.spectateIndex+1)%allies.length;this.spectatorId=allies[this.spectateIndex].id;}
    this.updateSnapshot();
  };
  takeover=()=>{
    if(this.player.alive)return;
    const next=this.actors.find(a=>a.id===this.spectatorId&&a.alive&&a.team===this.config.team);
    if(next){this.playerId=next.id;this.yaw=next.yaw;this.pitch=0;this.recoil=0;this.scoped=false;this.keys.clear();this.setViewGun(next.inventory[next.slot]!.id);this.updateSnapshot();}
  };
  private updateVisibility() {
    const allies=this.actors.filter(a=>a.alive&&a.team===this.config.team);
    for(const enemy of this.actors)if(enemy.team!==this.config.team&&enemy.alive) {
      if(allies.some(a=>{
        const direction=enemy.position.clone().sub(a.position),distance=direction.length();
        const inView=distance<11||vec(-Math.sin(a.yaw),0,-Math.cos(a.yaw)).dot(direction.normalize())>-.15;
        return distance<50&&inView&&(this.map.canSee(this.eye(a),this.eye(enemy,1.35))||this.map.canSee(this.eye(a),this.eye(enemy,1.7)));
      }))enemy.lastSeen=this.elapsed;
    }
  }
  private trace(start:THREE.Vector3,end:THREE.Vector3,player:boolean) {
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,end]),new THREE.LineBasicMaterial({color:player?0xffe1a2:0xfec87a,transparent:true,opacity:player?.55:.35}));this.scene.add(line);this.traces.push({line,life:.055});
  }
  private impact(position:THREE.Vector3) {
    if(this.sparks.length>30)return;
    const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.055,0),new THREE.MeshBasicMaterial({color:0xffd690}));mesh.position.copy(position);this.scene.add(mesh);this.sparks.push({mesh,life:.12});
  }
  private explosion(position:THREE.Vector3) {
    const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),new THREE.MeshBasicMaterial({color:0xff9b3e,transparent:true,opacity:.8}));mesh.position.copy(position).add(vec(0,1,0));mesh.userData.explosion=true;this.scene.add(mesh);this.sparks.push({mesh,life:1.6});
  }
  private updateEffects(dt:number) {
    this.traces=this.traces.filter(e=>{e.life-=dt;if(e.life<=0){this.scene.remove(e.line);e.line.geometry.dispose();(e.line.material as THREE.Material).dispose();return false;}return true;});
    this.sparks=this.sparks.filter(e=>{e.life-=dt;if(e.life<=0){this.scene.remove(e.mesh);e.mesh.geometry.dispose();(e.mesh.material as THREE.Material).dispose();return false;}
      if(e.mesh.userData.explosion){e.mesh.scale.addScalar(dt*13);(e.mesh.material as THREE.MeshBasicMaterial).opacity=e.life*.45;}return true;});
  }
  private render(dt:number,time:number) {
    const watched=this.watched;
    for(const actor of this.actors)actor.group.visible=actor.id!==watched.id||!this.started;
    if(!this.started) {
      // The briefing is a live view into long A, using the same playable scene.
      this.camera.position.set(37.8,2.8,13.5);this.camera.lookAt(27.5,2,-26);
      this.camera.fov=71;this.camera.updateProjectionMatrix();this.viewGun.visible=true;
      this.viewGun.position.set(.31,-.29+Math.sin(time*1.2)*.003,-.52);this.viewGun.rotation.set(.035,-.045,0);
    }else {
      const bob=watched.moving>.1&&watched.grounded?Math.sin(this.elapsed*12)*.033:0;
      this.camera.position.copy(watched.position).add(vec(0,EYE+bob,0));
      this.camera.rotation.set(this.player.alive?this.pitch+this.recoil:0,this.player.alive?this.yaw:watched.yaw,0,'YXZ');
      this.camera.fov=THREE.MathUtils.damp(this.camera.fov,this.scoped?24:78,18,dt);this.camera.updateProjectionMatrix();
      this.setViewGun(watched.inventory[watched.slot]!.id);this.viewGun.visible=!this.scoped&&watched.alive;
      const reload=watched.reloadTime>0?Math.sin((1-watched.reloadTime/WEAPONS[this.viewWeapon!].reload)*Math.PI):0;
      this.viewGun.position.set(.29+Math.sin(this.elapsed*6)*watched.moving*.0018,-.27+bob*.7-reload*.22,-.52+this.aimKick*.065);
      this.viewGun.rotation.set(.035+this.aimKick*.10-reload*.45,-.045+reload*.25,-reload*.6);
    }
    this.muzzle.visible=this.muzzleTimer>0&&!this.scoped&&this.started&&this.player.alive&&this.viewWeapon!=='knife';
    this.muzzle.position.set(.29,-.22,this.viewWeapon==='awp'?-1.26:['glock','deagle'].includes(this.viewWeapon??'')?-.76:-1.08);this.muzzle.rotation.z=time*23;
    this.renderer.clear();this.renderer.render(this.scene,this.camera);this.renderer.clearDepth();this.renderer.render(this.viewScene,this.viewCamera);
  }
  private updateSnapshot() {
    const p=this.player;if(!p)return;const watched=this.watched,state=watched.inventory[watched.slot]!;
    this.snapshot={ready:true,started:this.started,paused:this.paused,locked:this.locked,error:this.error,
      phase:this.phase,round:this.round,timer:this.phase==='freeze'?this.freeze:this.timer,score:{...this.score},winner:this.winner,result:this.result,
      playerId:p.id,team:this.config.team,hp:p.hp,armor:p.armor,weapon:state.id,ammo:state.ammo,reserve:state.reserve,reload:watched.reloadTime,
      slots:Object.fromEntries(Object.entries(watched.inventory).map(([slot,w])=>[slot,w.id])),scoped:this.scoped,spread:this.spread+p.moving*.002,hit:this.hit,headshot:this.headshot,hurt:this.hurt,
      kills:this.feed.filter(k=>this.elapsed-k.time<7),
      actors:this.actors.map(a=>({id:a.id,name:a.id===p.id?'YOU':a.name,team:a.team,hp:a.hp,armor:a.armor,alive:a.alive,x:a.position.x,z:a.position.z,yaw:a.yaw,visible:a.team===this.config.team||this.elapsed-a.lastSeen<2,kills:a.kills,deaths:a.deaths,weapon:a.inventory[a.slot]!.id,bomb:this.bomb.carrier===a.id})),
      bomb:{state:this.bomb.state,carrier:this.bomb.carrier,x:this.bomb.position.x,z:this.bomb.position.z,timer:this.bomb.timer,progress:this.bomb.progress,site:this.bomb.site},
      interaction:this.interaction,progress:this.interactionProgress,location:locationName(watched.position.x,watched.position.z),alive:p.alive,spectator:watched.name,
      muted:this.audio.muted,elapsed:this.elapsed,lastHitZone:this.lastHitZone,fps:this.fps};
    this.subscribers.forEach(fn=>fn());
  }
  dispose() {
    this.disposed=true;cancelAnimationFrame(this.raf);this.resizeObserver.disconnect();
    if(document.pointerLockElement===this.renderer.domElement)document.exitPointerLock();
    document.removeEventListener('pointerlockchange',this.onLockChange);document.removeEventListener('pointerlockerror',this.onLockError);
    window.removeEventListener('keydown',this.onKeyDown);window.removeEventListener('keyup',this.onKeyUp);window.removeEventListener('mousemove',this.onMouseMove);window.removeEventListener('mousedown',this.onMouseDown);window.removeEventListener('mouseup',this.onMouseUp);window.removeEventListener('contextmenu',this.onContextMenu);window.removeEventListener('blur',this.onBlur);
    this.audio.dispose();this.map.dispose();disposeModel(this.scene);disposeModel(this.viewScene);disposeMaterials();
    this.scene.traverse(obj=>{if(obj instanceof THREE.Light&&'shadow'in obj)(obj as THREE.DirectionalLight).shadow?.dispose();});
    this.traces.forEach(t=>(t.line.material as THREE.Material).dispose());this.sparks.forEach(s=>(s.mesh.material as THREE.Material).dispose());
    (this.muzzle.material as THREE.Material).dispose();this.renderer.dispose();this.renderer.domElement.remove();this.subscribers.clear();
  }
}

import * as THREE from 'three';

type Team = 'CT' | 'T';
type Hitbox = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';
type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
type Feed = { text: string; team: 'ct' | 't' };
export type Dot = { id: string; x: number; z: number; team: Team; isSelf?: boolean };
export type HUDState = {
  health: number; armor: number; ammo: number; reserve: number; weapon: string; weaponKind: string;
  round: number; roundTime: number; phase: string; team: Team; controlledName: string; alive: boolean;
  bomb: string; bombTimer: number; feed: Feed[]; players: { id: string; name: string; team: Team; hp: number; alive: boolean }[];
  message: string; scope: boolean; minimap: Dot[]; visibleEnemies: Dot[]; bombPoint?: { x: number; z: number }; crosshair: number; objective: string; reload: number;
};

type WeaponSpec = { name: string; slot: 'primary' | 'secondary' | 'knife'; mag: number; reserve: number; damage: number; delay: number; reload: number; recoil: number; automatic: boolean; range: number; sound: 'ak' | 'm4' | 'awp' | 'pistol' | 'knife' };
const WEAPONS: Record<WeaponId, WeaponSpec> = {
  ak: { name: 'AK-47', slot: 'primary', mag: 30, reserve: 90, damage: 39, delay: .105, reload: 2.45, recoil: 1.7, automatic: true, range: 100, sound: 'ak' },
  m4: { name: 'M4A4', slot: 'primary', mag: 30, reserve: 90, damage: 33, delay: .082, reload: 2.35, recoil: .66, automatic: true, range: 100, sound: 'm4' },
  awp: { name: 'AWP', slot: 'primary', mag: 5, reserve: 30, damage: 175, delay: 1.05, reload: 3.4, recoil: 2.5, automatic: false, range: 150, sound: 'awp' },
  glock: { name: 'GLOCK-18', slot: 'secondary', mag: 20, reserve: 120, damage: 21, delay: .17, reload: 2.2, recoil: .42, automatic: false, range: 55, sound: 'pistol' },
  usp: { name: 'USP-S', slot: 'secondary', mag: 12, reserve: 48, damage: 25, delay: .19, reload: 2.15, recoil: .43, automatic: false, range: 58, sound: 'pistol' },
  deagle: { name: 'DESERT EAGLE', slot: 'secondary', mag: 7, reserve: 35, damage: 53, delay: .37, reload: 2.45, recoil: 1.05, automatic: false, range: 70, sound: 'pistol' },
  knife: { name: 'KNIFE', slot: 'knife', mag: 1, reserve: 0, damage: 55, delay: .58, reload: 0, recoil: 0, automatic: false, range: 2.8, sound: 'knife' },
};
const HIT_MULT: Record<Hitbox, number> = { head: 2, chest: 1, abdomen: .9, arm: .65, leg: .7 };
const V3 = THREE.Vector3;

type Wall = { x: number; z: number; w: number; d: number; mesh: THREE.Mesh };
type Node = { x: number; z: number; links: string[] };
type Combatant = {
  id: string; name: string; team: Team; group: THREE.Group; spawn: THREE.Vector3; ai: boolean;
  health: number; armor: number; alive: boolean; velocityY: number; yaw: number; pitch: number;
  primary: WeaponId | null; secondary: WeaponId; selected: WeaponId; ammo: Record<WeaponId, number>; reserve: Record<WeaponId, number>;
  nextShot: number; reloadingUntil: number; reloadWeapon: WeaponId | null; recoil: number; c4: boolean; navPath: THREE.Vector3[]; navIndex: number; navGoal: string;
  patrol: number; lastThink: number; targetId: string | null; lastStep: number; killCount: number;
};
type Bomb = { carrier: string | null; pos: THREE.Vector3; planted: boolean; timer: number; plant: number; defuse: number; defuser: string | null };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const flatDist = (a: THREE.Vector3, b: THREE.Vector3) => Math.hypot(a.x - b.x, a.z - b.z);
const lerpAngle = (a: number, b: number, t: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
const C = { sand: 0xc5a574, darkSand: 0x886b47, wall: 0x9b815e, edge: 0x635038, blue: 0x34799e, tan: 0xb66842, dark: 0x242527 };

class SoundBank {
  ctx: AudioContext | null = null;
  unlock() { if (!this.ctx) this.ctx = new AudioContext(); if (this.ctx.state === 'suspended') void this.ctx.resume(); }
  tone(freq: number, dur: number, type: OscillatorType, volume = .06, slide = 0) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(volume, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
  }
  noise(dur: number, volume: number, cutoff: number) {
    if (!this.ctx) return; const c = this.ctx, len = Math.max(1, Math.floor(c.sampleRate * dur), 1), data = c.createBuffer(1, len, c.sampleRate).getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = c.createBuffer(1, len, c.sampleRate); s.buffer.getChannelData(0).set(data); f.type = 'lowpass'; f.frequency.value = cutoff; g.gain.value = volume; s.connect(f).connect(g).connect(c.destination); s.start();
  }
  play(kind: string) { if (!this.ctx) return; if (kind === 'ak') { this.noise(.09,.15,1100); this.tone(80,.08,'sawtooth',.08,-30); } else if (kind === 'm4') { this.noise(.055,.09,1800); this.tone(130,.045,'square',.04,-20); } else if (kind === 'awp') { this.noise(.24,.22,720); this.tone(55,.2,'sawtooth',.16,-25); } else if (kind === 'pistol') { this.noise(.06,.1,2200); this.tone(210,.06,'square',.05,-80); } else if (kind === 'knife') { this.tone(270,.09,'sawtooth',.07,250); } else if (kind === 'reload') { this.tone(380,.035,'square',.035,-80); setTimeout(() => this.tone(510,.05,'square',.035,-120), 180); } else if (kind === 'step') { this.noise(.025,.025,350); } else if (kind === 'hit') { this.tone(860,.045,'sine',.04,120); } else if (kind === 'kill') { this.tone(620,.08,'square',.06,180); setTimeout(() => this.tone(930,.1,'sine',.04,120), 85); } else if (kind === 'scope') { this.tone(530,.07,'sine',.035,-250); } else if (kind === 'plant') { this.tone(450,.08,'square',.05,-50); } else if (kind === 'defuse') { this.tone(710,.07,'sine',.04,80); } else if (kind === 'boom') { this.noise(.65,.35,250); this.tone(55,.45,'sawtooth',.16,-40); } }
}

export class Game {
  private root: HTMLElement; private emit: (s: HUDState) => void; private renderer: THREE.WebGLRenderer; private scene = new THREE.Scene(); private camera = new THREE.PerspectiveCamera(74, 1, .05, 170);
  private clock = new THREE.Clock(); private sound = new SoundBank(); private walls: Wall[] = []; private fighters: Combatant[] = []; private nodeGraph: Record<string, Node> = {}; private bomb!: Bomb;
  private keys = new Set<string>(); private mouseDown = false; private rightDown = false; private eDown = false; private pointerLocked = false; private yaw = Math.PI; private pitch = -.08; private controlledId = 'ct0'; private playerOrigin = 'ct0';
  private raf = 0; private now = 0; private round = 1; private roundTimer = 115; private phase: 'live' | 'ended' = 'live'; private nextRound = 0; private message = 'PISTOL ROUND // ELIMINATE THE ENEMY'; private messageUntil = 5;
  private feeds: Feed[] = []; private bombMesh: THREE.Group; private viewModel: THREE.Group; private tracerGroup = new THREE.Group(); private lastHUD = 0; private pistolRound = true;
  private tempRay = new THREE.Raycaster(); private tmpA = new V3(); private tmpB = new V3();
  constructor(root: HTMLElement, emit: (s: HUDState) => void) {
    this.root = root; this.emit = emit; this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); this.renderer.setSize(innerWidth, innerHeight); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; root.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0x90a8b1); this.scene.fog = new THREE.Fog(0x90a8b1, 64, 135); this.camera.rotation.order = 'YXZ';
    this.viewModel = this.makeViewModel(); this.camera.add(this.viewModel); this.scene.add(this.camera); this.scene.add(this.tracerGroup);
    this.bombMesh = this.makeBomb(); this.scene.add(this.bombMesh); this.makeLighting(); this.makeMap(); this.makeFighters(); this.resetRound(true); this.installEvents(); this.loop();
  }
  lock() { this.sound.unlock(); void this.renderer.domElement.requestPointerLock(); }
  dispose() { cancelAnimationFrame(this.raf); this.renderer.domElement.remove(); this.renderer.dispose(); window.removeEventListener('resize', this.onResize); document.removeEventListener('keydown', this.onKeyDown); document.removeEventListener('keyup', this.onKeyUp); document.removeEventListener('mousemove', this.onMouseMove); document.removeEventListener('pointerlockchange', this.onLockChange); document.removeEventListener('mousedown', this.onMouseDown); document.removeEventListener('mouseup', this.onMouseUp); }
  private installEvents() { window.addEventListener('resize', this.onResize); document.addEventListener('keydown', this.onKeyDown); document.addEventListener('keyup', this.onKeyUp); document.addEventListener('mousemove', this.onMouseMove); document.addEventListener('pointerlockchange', this.onLockChange); document.addEventListener('mousedown', this.onMouseDown); document.addEventListener('mouseup', this.onMouseUp); }
  private onResize = () => { this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight); };
  private onKeyDown = (ev: KeyboardEvent) => { const k = ev.key.toLowerCase(); this.keys.add(k); if ([' ','w','a','s','d','e','r','1','2','3','4','5','q'].includes(k)) ev.preventDefault(); if (k === 'r') this.reload(this.controlled()); if (k === '1') this.switchSlot('primary'); if (k === '2') this.switchSlot('secondary'); if (k === '3') this.switchSlot('knife'); if (k === '4') this.equipSpecial('awp'); if (k === '5') this.equipSpecial('deagle'); if (k === 'q') this.takeOver(); };
  private onKeyUp = (ev: KeyboardEvent) => { this.keys.delete(ev.key.toLowerCase()); };
  private onMouseMove = (ev: MouseEvent) => { if (!this.pointerLocked) return; this.yaw -= ev.movementX * .0022; this.pitch = clamp(this.pitch - ev.movementY * .002, -1.43, 1.43); };
  private onLockChange = () => { this.pointerLocked = document.pointerLockElement === this.renderer.domElement; };
  private onMouseDown = (ev: MouseEvent) => { if (!this.pointerLocked) return; if (ev.button === 0) this.mouseDown = true; if (ev.button === 2) { this.rightDown = true; ev.preventDefault(); } };
  private onMouseUp = (ev: MouseEvent) => { if (ev.button === 0) this.mouseDown = false; if (ev.button === 2) this.rightDown = false; };
  private makeLighting() { const amb = new THREE.HemisphereLight(0xe2eff5, 0x746047, 2.0); this.scene.add(amb); const sun = new THREE.DirectionalLight(0xffefd0, 2.4); sun.position.set(-30, 55, 20); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left = -80; sun.shadow.camera.right = 80; sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -80; this.scene.add(sun); }
  private mat(color: number, rough = .9) { return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: .03 }); }
  private box(x: number, y: number, z: number, w: number, h: number, d: number, color: number, collider = true, name = '') {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), this.mat(color)); mesh.position.set(x,y,z); mesh.castShadow = mesh.receiveShadow = true; mesh.name = name; this.scene.add(mesh);
    if (collider) { mesh.userData.wall = true; this.walls.push({ x,z,w,d,mesh }); }
    return mesh;
  }
  private makeMap() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(118,118,12,12), this.mat(C.sand)); ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; this.scene.add(ground);
    const grid = new THREE.GridHelper(116, 58, 0x8f7552, 0xa28760); grid.position.y = .015; (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = .16; this.scene.add(grid);
    // Perimeter and chunky architectural silhouettes: every solid below is a collision AABB.
    this.box(0,3,-58,118,6,2,C.wall); this.box(0,3,58,118,6,2,C.wall); this.box(-58,3,0,2,6,118,C.wall); this.box(58,3,0,2,6,118,C.wall);
    // A Long: a broad left lane from T spawn to the A bombsite.
    this.box(-19,3,27,3,6,24,C.wall); this.box(-46,3,31,3,6,50,C.wall); this.box(-32,3,8,28,6,3,C.wall);
    // Catwalk separates A short from the low CT approach but retains wide entrances at either end.
    this.box(-7,2.5,-18,27,5,3,C.wall); this.box(-21,2.5,-31,3,5,21,C.wall);
    // Mid lanes / actual traversable double-door frame (central gap is deliberately 4.2 m).
    this.box(11.5,3,12,3,6,27,C.wall); this.box(22,3,12,3,6,20,C.wall); this.box(16.8,3,1.7,2.2,6,4.5,0x6c6251,true,'MID DOORS LEFT'); this.box(16.8,3,-4.8,2.2,6,4.5,0x6c6251,true,'MID DOORS RIGHT');
    const doorLintel = this.box(16.8,6.4,-1.55,2.2,1.4,2.2,0x544c40,false,'MID DOORS LINTEL'); doorLintel.userData.wall = true;
    // B tunnels and its rear wall. The lane is intentionally open between T and B around x=34.
    this.box(21,3,35,3,6,30,C.wall); this.box(46,3,28,3,6,38,C.wall); this.box(34,3,17,16,6,3,C.wall);
    // CT spawn has two branching exits to A and B so the whole map is connected.
    this.box(9,3,-42,35,6,3,C.wall); this.box(43,3,-38,3,6,25,C.wall); this.box(31,3,-29,3,6,15,C.wall);
    // Site cover/collision crates, arranged with tactical gaps rather than sealed rooms.
    this.crate(-37,-13,4,3.8,4); this.crate(-29,-20,5,4.5,5); this.crate(-42,-26,3,3,3); this.crate(-33,19,4,4,4); this.crate(-31,34,3,3,5);
    this.crate(35,-13,5,4,4); this.crate(42,-20,3,3,3); this.crate(28,-4,4,3,4); this.crate(31,26,4,3,4);
    this.crate(3,13,3,3,3); this.crate(8,-7,3,2.5,5); this.crate(26,-37,4,3,4);
    this.makeSiteMark(-35,-18,'A'); this.makeSiteMark(36,-18,'B'); this.makeSign(-2,49,'T SPAWN'); this.makeSign(28,-47,'CT SPAWN'); this.makeSign(8,10,'MID'); this.makeSign(-30,27,'A LONG'); this.makeSign(34,28,'B TUNNELS'); this.makeSign(-12,-10,'CATWALK'); this.makeSign(16,-2,'MID DOORS');
    // Graph is deliberately authored instead of using a pathfinding package; all named Dust2 routes connect.
    this.nodeGraph = {
      T:{x:0,z:47,links:['long1','mid','tuntop']}, long1:{x:-32,z:42,links:['T','long2']}, long2:{x:-32,z:22,links:['long1','A']},
      mid:{x:0,z:17,links:['T','midtop','cat']}, midtop:{x:0,z:28,links:['mid','upper']}, upper:{x:15,z:28,links:['midtop','doors']}, doors:{x:15,z:0,links:['upper','ctlower']}, ctlower:{x:27,z:-8,links:['doors','ctmid','B']}, ctmid:{x:27,z:5,links:['ctlower','B','CT']},
      cat:{x:-10,z:-7,links:['mid','A','ctramp']}, A:{x:-35,z:-18,links:['long2','cat','ctramp']}, ctramp:{x:2,z:-29,links:['A','cat','CT']},
      tuntop:{x:26,z:47,links:['T','tun1']}, tun1:{x:32,z:31,links:['tuntop','tun2']}, tun2:{x:36,z:12,links:['tun1','B']}, B:{x:36,z:-17,links:['tun2','ctmid','ctlower']}, CT:{x:27,z:-44,links:['ctmid','ctramp']},
    };
  }
  private crate(x: number, z: number, w: number, h: number, d: number) { const m = this.box(x,h/2,z,w,h,d,C.darkSand,true,'wooden tactical crate'); const rim = this.box(x,h+.04,z,w+.12,.12,d+.12,0xc69d5d,false); rim.castShadow = true; return m; }
  private makeSiteMark(x: number,z: number,text: string) { const canvas = document.createElement('canvas'); canvas.width=256;canvas.height=256; const c=canvas.getContext('2d')!; c.fillStyle='#b8452e';c.globalAlpha=.82;c.font='bold 180px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,128,137); const tex=new THREE.CanvasTexture(canvas); const m=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.04,z);this.scene.add(m); }
  private makeSign(x: number,z: number,text: string) { const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const c=canvas.getContext('2d')!;c.fillStyle='#2d2820';c.fillRect(0,0,512,96);c.strokeStyle='#d6bd78';c.lineWidth=5;c.strokeRect(3,3,506,90);c.fillStyle='#f0d68e';c.font='bold 43px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,256,51); const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));sp.position.set(x,5.7,z);sp.scale.set(9,1.7,1);this.scene.add(sp); }
  private makeBomb() { const g = new THREE.Group(); const caseM=this.mat(0x202526,.45), wireM=this.mat(0xd3b449,.3); const body=new THREE.Mesh(new THREE.BoxGeometry(.75,.45,.35),caseM);body.position.y=.28;body.castShadow=true;g.add(body); const panel=new THREE.Mesh(new THREE.BoxGeometry(.45,.2,.02),wireM);panel.position.set(0,.33,.19);g.add(panel); for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.55,6),i===1?wireM:this.mat(0xa93b2f));w.rotation.z=.5+i*.25;w.position.set(-.2+i*.18,.56,.02);g.add(w);} g.visible=false;return g; }
  private makeFighters() {
    const ctSpawns=[[-0.0,-44],[24,-47],[31,-45],[22,-39],[34,-37]], tSpawns=[[0,47],[-4,45],[4,45],[6,50],[-6,50]];
    ctSpawns.forEach((p,i)=>this.fighters.push(this.makeFighter(`ct${i}`,i===0?'YOU':`CT-${i}`, 'CT', new V3(p[0],0,p[1]), i!==0)));
    tSpawns.forEach((p,i)=>this.fighters.push(this.makeFighter(`t${i}`,`T-${i+1}`, 'T', new V3(p[0],0,p[1]), true)));
  }
  private makeFighter(id: string, name: string, team: Team, spawn: THREE.Vector3, ai: boolean): Combatant {
    const g = new THREE.Group(); g.name=name; this.scene.add(g); const skin=this.mat(team==='CT'?0xbaa07a:0xb77a50), uniform=this.mat(team==='CT'?C.blue:C.tan), dark=this.mat(team==='CT'?0x1e3a49:0x5d3024), black=this.mat(0x222222);
    const add=(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,hit?:Hitbox)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(hit){m.userData.combatantId=id;m.userData.hitbox=hit;}g.add(m);return m;};
    // Independent head, torso, abdomen, both arms and both legs are all raycastable hitboxes.
    add(new THREE.SphereGeometry(.26,12,10),skin,0,1.72,0,'head'); add(new THREE.BoxGeometry(.55,.52,.28),uniform,0,1.35,0,'chest'); add(new THREE.BoxGeometry(.48,.28,.26),dark,0,.97,0,'abdomen');
    add(new THREE.BoxGeometry(.16,.56,.16),uniform,-.4,1.28,.02,'arm'); add(new THREE.BoxGeometry(.16,.56,.16),uniform,.4,1.28,.02,'arm'); add(new THREE.BoxGeometry(.2,.62,.2),dark,-.17,.47,0,'leg');add(new THREE.BoxGeometry(.2,.62,.2),dark,.17,.47,0,'leg');
    const gun=this.makeWorldGun(team==='CT'?'m4':'ak'); gun.position.set(.28,1.28,-.32);gun.rotation.set(0,0,-.1);g.add(gun);
    return {id,name,team,group:g,spawn:spawn.clone(),ai,health:100,armor:100,alive:true,velocityY:0,yaw:team==='CT'?Math.PI:0,pitch:0,primary:team==='CT'?'m4':'ak',secondary:team==='CT'?'usp':'glock',selected:team==='CT'?'m4':'ak',ammo:{} as Record<WeaponId,number>,reserve:{} as Record<WeaponId,number>,nextShot:0,reloadingUntil:0,reloadWeapon:null,recoil:0,c4:false,navPath:[],navIndex:0,navGoal:'',patrol:0,lastThink:0,targetId:null,lastStep:0,killCount:0};
  }
  private makeWorldGun(id: WeaponId) { const g=new THREE.Group(); const metal=this.mat(id==='ak'?0x382c22:0x24282a,.42), wood=this.mat(id==='ak'?0x815132:0x323638); const body=new THREE.Mesh(new THREE.BoxGeometry(.12,.11,.65),metal);body.position.z=-.18;body.castShadow=true;g.add(body);const stock=new THREE.Mesh(new THREE.BoxGeometry(.13,.14,.28),wood);stock.position.z=.25;g.add(stock);const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,.35,7),metal);barrel.rotation.x=Math.PI/2;barrel.position.set(0,.03,-.62);g.add(barrel);const grip=new THREE.Mesh(new THREE.BoxGeometry(.09,.2,.1),wood);grip.position.set(0,-.13,.03);grip.rotation.x=-.35;g.add(grip);if(id==='awp'){const scope=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.4,8),metal);scope.rotation.x=Math.PI/2;scope.position.set(0,.12,-.15);g.add(scope);}return g; }
  private makeViewModel() { const g=new THREE.Group();g.position.set(.46,-.42,-.75); const hands=this.mat(0xb98f68), sleeve=this.mat(0x314c60); for(const x of [-.18,.2]){const arm=new THREE.Mesh(new THREE.BoxGeometry(.17,.18,.5),sleeve);arm.position.set(x,-.12,.12);arm.rotation.x=-.55;g.add(arm);const hand=new THREE.Mesh(new THREE.BoxGeometry(.14,.12,.15),hands);hand.position.set(x,-.02,-.14);g.add(hand);} const gun=this.makeWorldGun('m4');gun.name='view-gun';gun.scale.set(1.25,1.25,1.25);gun.position.set(.03,.02,-.24);gun.rotation.set(-.04,.1,0);g.add(gun);return g; }
  private loop = () => { this.raf=requestAnimationFrame(this.loop); const dt=Math.min(.05,this.clock.getDelta()); this.now+=dt; if(this.phase==='live') this.updateLive(dt); else if(this.now>=this.nextRound) this.resetRound(false); this.renderer.render(this.scene,this.camera); if(this.now-this.lastHUD>.1){this.lastHUD=this.now;this.publishHUD();} };
  private updateLive(dt: number) {
    const controlled=this.controlled();
    if (!controlled.alive) this.takeOver();
    this.updatePlayer(dt);
    for(const f of this.fighters) if(f.alive && f.ai && f.id!==this.controlledId) this.updateAI(f,dt);
    this.updateBomb(dt);
    this.updateReloads();
    this.updateTracers(dt);
    this.checkRound(dt);
  }
  private controlled() { return this.fighters.find(f=>f.id===this.controlledId) || this.fighters[0]; }
  private updatePlayer(dt: number) {
    const p=this.controlled(); if(!p.alive) return;
    p.group.visible=false; p.yaw=this.yaw; p.pitch=this.pitch;
    const forward=new V3(Math.sin(this.yaw),0,Math.cos(this.yaw)); const right=new V3(forward.z,0,-forward.x); const move=new V3();
    if(this.keys.has('w'))move.add(forward);if(this.keys.has('s'))move.sub(forward);if(this.keys.has('d'))move.add(right);if(this.keys.has('a'))move.sub(right);
    if(move.lengthSq()) { move.normalize().multiplyScalar(5.45*dt); this.moveWithCollision(p,move.x,move.z); if(this.now-p.lastStep>.36){p.lastStep=this.now;this.sound.play('step');} }
    if(this.keys.has(' ')&&p.group.position.y<=.01)p.velocityY=5.7; p.velocityY-=15*dt; p.group.position.y+=p.velocityY*dt;if(p.group.position.y<0){p.group.position.y=0;p.velocityY=0;}
    this.camera.position.copy(p.group.position).add(new V3(0,1.55,0));this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;
    const scoped=p.selected==='awp'&&this.rightDown; const wantedFov=scoped?28:74;if(Math.abs(this.camera.fov-wantedFov)>.05){this.camera.fov=THREE.MathUtils.lerp(this.camera.fov,wantedFov,.25);this.camera.updateProjectionMatrix();}
    if(scoped!==this.wasScoped){this.wasScoped=scoped;this.sound.play('scope');} this.viewModel.visible=!scoped;
    p.recoil=Math.max(0,p.recoil-dt*5.2); this.viewModel.position.x=.46+Math.sin(this.now*2.2)*.006;this.viewModel.position.y=-.42+Math.sin(this.now*4.4)*.006;
    if(this.mouseDown) this.fireFromPlayer(p); if(this.keys.has('e')) this.tryInteract(p,dt);
  }
  private wasScoped=false;
  private moveWithCollision(f: Combatant, dx: number, dz: number) {
    const radius=.36;let nx=f.group.position.x+dx,nz=f.group.position.z;
    for(const w of this.walls) if(Math.abs(nx-w.x)<w.w/2+radius&&Math.abs(nz-w.z)<w.d/2+radius) nx=f.group.position.x< w.x? w.x-w.w/2-radius:w.x+w.w/2+radius;
    nz=f.group.position.z+dz;
    for(const w of this.walls) if(Math.abs(nx-w.x)<w.w/2+radius&&Math.abs(nz-w.z)<w.d/2+radius) nz=f.group.position.z< w.z? w.z-w.d/2-radius:w.z+w.d/2+radius;
    f.group.position.x=clamp(nx,-56.2,56.2);f.group.position.z=clamp(nz,-56.2,56.2);
  }
  private updateReloads(){for(const f of this.fighters)if(f.reloadingUntil&&this.now>=f.reloadingUntil&&f.reloadWeapon){const id=f.reloadWeapon,s=WEAPONS[id],needed=s.mag-f.ammo[id],take=Math.min(needed,f.reserve[id]);f.ammo[id]+=take;f.reserve[id]-=take;f.reloadingUntil=0;f.reloadWeapon=null;}}
  private reload(f: Combatant) { const id=f.selected,s=WEAPONS[id];if(!f.alive||id==='knife'||f.reloadingUntil||f.ammo[id]>=s.mag||f.reserve[id]<=0)return;f.reloadingUntil=this.now+s.reload;f.reloadWeapon=id;this.sound.play('reload'); }
  private switchSlot(slot: WeaponSpec['slot']) { const p=this.controlled();let id:WeaponId|undefined;if(slot==='primary')id=p.primary||undefined;if(slot==='secondary')id=p.secondary;if(slot==='knife')id='knife';if(!id||p.selected===id)return;p.selected=id;this.refreshViewGun(id);this.sound.play('scope'); }
  private equipSpecial(id:'awp'|'deagle'){const p=this.controlled();if(this.pistolRound&&id==='awp'){this.message='AWP UNAVAILABLE IN PISTOL ROUND';this.messageUntil=this.now+1.5;return;}if(id==='awp')p.primary='awp';else p.secondary='deagle';p.selected=id;this.refreshViewGun(id);this.message=`EQUIPPED ${WEAPONS[id].name}`;this.messageUntil=this.now+1.5;}
  private refreshViewGun(id: WeaponId){const old=this.viewModel.getObjectByName('view-gun');if(old)this.viewModel.remove(old);const gun=this.makeWorldGun(id);gun.name='view-gun';gun.scale.set(1.25,1.25,1.25);gun.position.set(.03,.02,-.24);gun.rotation.set(-.04,.1,0);if(id==='knife'){gun.scale.set(.9,.9,.9);gun.rotation.z=.7;}this.viewModel.add(gun);}
  private fireFromPlayer(f: Combatant) { const dir=new V3();this.camera.getWorldDirection(dir);const spread=(WEAPONS[f.selected].recoil*.004)+(f.recoil*.007);dir.x+=(Math.random()-.5)*spread;dir.y+=(Math.random()-.5)*spread;dir.z+=(Math.random()-.5)*spread;dir.normalize();const origin=this.camera.getWorldPosition(new V3());this.fire(f,origin,dir,true); }
  private fire(shooter: Combatant, origin: THREE.Vector3, direction: THREE.Vector3, playerShot=false, forced?: Combatant) {
    const id=shooter.selected,s=WEAPONS[id];if(!shooter.alive||this.now<shooter.nextShot||shooter.reloadingUntil)return;
    if(id==='knife'){const target=forced||this.closestMelee(shooter,origin,direction);if(target){this.applyDamage(shooter,target,'chest',s.damage);this.makeTracer(origin,target.group.position.clone().add(new V3(0,1.2,0)),0xcddfef);}shooter.nextShot=this.now+s.delay;this.sound.play('knife');return;}
    if(shooter.ammo[id]<=0){this.reload(shooter);return;} shooter.ammo[id]--;shooter.nextShot=this.now+s.delay;shooter.recoil=Math.min(6,shooter.recoil+s.recoil);this.sound.play(s.sound);
    let point=origin.clone().addScaledVector(direction,s.range), hitF:Combatant|undefined, hitBox:Hitbox='chest';
    if(forced){hitF=forced;hitBox=Math.random()<.12?'head':Math.random()<.22?'arm':Math.random()<.18?'leg':'chest';point=forced.group.position.clone().add(new V3(0,hitBox==='head'?1.7:1.2,0));}
    else { this.tempRay.set(origin,direction);this.tempRay.far=s.range;const pick:THREE.Object3D[]=[...this.walls.map(w=>w.mesh),...this.fighters.filter(f=>f.alive&&f.id!==shooter.id).map(f=>f.group)];const hits=this.tempRay.intersectObjects(pick,true);if(hits.length){point=hits[0].point;const data=hits[0].object.userData as {combatantId?:string;hitbox?:Hitbox};if(data.combatantId){hitF=this.fighters.find(f=>f.id===data.combatantId);hitBox=data.hitbox||'chest';}} }
    this.makeTracer(origin,point,s.sound==='awp'?0xf7e8bd:0xffc86a);if(hitF)this.applyDamage(shooter,hitF,hitBox,s.damage);if(playerShot&&s.sound==='awp')this.pitch+=.025;
  }
  private closestMelee(f:Combatant,origin:THREE.Vector3,dir:THREE.Vector3){return this.fighters.filter(x=>x.alive&&x.team!==f.team&&flatDist(x.group.position,origin)<3.2&&dir.dot(x.group.position.clone().add(new V3(0,1,0)).sub(origin).normalize())>.4&&!this.blocked(origin,x.group.position.clone().add(new V3(0,1,0)))).sort((a,b)=>flatDist(a.group.position,origin)-flatDist(b.group.position,origin))[0];}
  private makeTracer(a:THREE.Vector3,b:THREE.Vector3,color:number){const g=new THREE.BufferGeometry().setFromPoints([a,b]);const line=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.9}));line.userData.life=.065;this.tracerGroup.add(line);}
  private updateTracers(dt:number){for(const x of [...this.tracerGroup.children]){const line=x as THREE.Line;line.userData.life-=dt;(line.material as THREE.LineBasicMaterial).opacity=Math.max(0,line.userData.life*14);if(line.userData.life<=0){this.tracerGroup.remove(line);line.geometry.dispose();(line.material as THREE.LineBasicMaterial).dispose();}}}
  private applyDamage(attacker:Combatant,target:Combatant,zone:Hitbox,raw:number){if(!target.alive)return;let dmg=raw*HIT_MULT[zone];if(target.armor>0&&zone!=='leg'){const absorbed=Math.min(target.armor,dmg*.45);target.armor-=Math.round(absorbed);dmg-=absorbed*.62;}target.health-=Math.round(dmg);if(attacker.id===this.controlledId)this.sound.play('hit');if(target.health>0)return;target.health=0;target.alive=false;target.group.visible=false;attacker.killCount++;this.sound.play('kill');this.addFeed(`${attacker.name}  ${zone==='head'?'◉':'✕'}  ${target.name}`,attacker.team);if(target.c4){target.c4=false;this.bomb.carrier=null;this.bomb.pos.copy(target.group.position);this.bomb.pos.y=.04;this.bombMesh.position.copy(this.bomb.pos);this.bombMesh.visible=true;this.message='C4 DROPPED';this.messageUntil=this.now+2;}if(target.id===this.controlledId)this.message='YOU ARE DOWN — PRESS Q TO TAKE OVER';}
  private addFeed(text:string,team:Team){this.feeds.unshift({text,team:team==='CT'?'ct':'t'});this.feeds=this.feeds.slice(0,5);}
  private updateAI(f: Combatant,dt:number) {
    const enemy=this.findVisibleEnemy(f); if(enemy){f.targetId=enemy.id;const toward=enemy.group.position.clone().sub(f.group.position);const wanted=Math.atan2(toward.x,toward.z);f.yaw=lerpAngle(f.yaw,wanted,dt*6);f.group.rotation.y=f.yaw;const range=flatDist(f.group.position,enemy.group.position);if(range>7)this.moveAI(f,enemy.group.position,dt,.72); const eye=f.group.position.clone().add(new V3(0,1.45,0));const dir=enemy.group.position.clone().add(new V3(0,1.3,0)).sub(eye).normalize();if(range<WEAPONS[f.selected].range*.72&&Math.abs(Math.atan2(Math.sin(wanted-f.yaw),Math.cos(wanted-f.yaw)))<.35)this.fire(f,eye,dir,false,enemy);return;}
    f.targetId=null;let target:THREE.Vector3;let goal='';
    if(this.bomb.planted){if(f.team==='CT'){target=this.bomb.pos;goal='DEFUSE';}else{target=this.bomb.pos.clone().add(new V3((Number(f.id.slice(1))%2?4:-4),0,3));goal='HOLD';}}
    else if(f.team==='T'&&this.bomb.carrier===null){target=this.bomb.pos;goal='RECOVER C4';}
    else if(f.team==='T'&&f.c4){const site=f.id==='t0'||f.id==='t2'?new V3(-35,0,-18):new V3(36,0,-18);target=site;goal=site.x<0?'A SITE':'B SITE';}
    else if(f.team==='T'){const carrier=this.fighters.find(x=>x.c4);target=carrier?carrier.group.position.clone():new V3(-35,0,-18);goal='ESCORT';}
    else {const patrol=[new V3(27,0,5),new V3(-10,0,-7),new V3(36,0,-17),new V3(-35,0,-18)][Number(f.id.slice(2))%4];target=patrol;goal='HOLD';}
    this.moveAI(f,target,dt,1); if(this.now-f.lastThink>1){f.lastThink=this.now;f.navGoal=goal;}
  }
  private findVisibleEnemy(f:Combatant){let best:Combatant|undefined,dist=999;for(const x of this.fighters)if(x.alive&&x.team!==f.team){const d=flatDist(f.group.position,x.group.position);if(d<44&&d<dist&&this.canSee(f,x)){best=x;dist=d;}}return best;}
  private canSee(a:Combatant,b:Combatant){const from=a.group.position.clone().add(new V3(0,1.47,0)),to=b.group.position.clone().add(new V3(0,1.3,0));return !this.blocked(from,to);}
  private blocked(from:THREE.Vector3,to:THREE.Vector3){const dir=to.clone().sub(from),len=dir.length();dir.normalize();this.tempRay.set(from,dir);this.tempRay.far=Math.max(0,len-.25);return this.tempRay.intersectObjects(this.walls.map(w=>w.mesh),false).length>0;}
  private moveAI(f:Combatant,target:THREE.Vector3,dt:number,scale:number){const key=`${Math.round(target.x)}:${Math.round(target.z)}`;if(f.navGoal!==key||!f.navPath.length){f.navPath=this.pathBetween(f.group.position,target);f.navIndex=0;f.navGoal=key;}let way=f.navPath[f.navIndex]||target;if(flatDist(f.group.position,way)<1.15&&f.navIndex<f.navPath.length-1){f.navIndex++;way=f.navPath[f.navIndex];}const d=way.clone().sub(f.group.position);d.y=0;if(d.lengthSq()<.08)return;d.normalize();const wanted=Math.atan2(d.x,d.z);f.yaw=lerpAngle(f.yaw,wanted,dt*5);f.group.rotation.y=f.yaw;this.moveWithCollision(f,d.x*3.55*dt*scale,d.z*3.55*dt*scale);if(this.now-f.lastStep>.52){f.lastStep=this.now;this.sound.play('step');}}
  private pathBetween(start:THREE.Vector3,target:THREE.Vector3){const entries=Object.entries(this.nodeGraph);const nearest=(v:THREE.Vector3)=>entries.reduce((best,[id,n])=>flatDist(v,new V3(n.x,0,n.z))<flatDist(v,new V3(this.nodeGraph[best].x,0,this.nodeGraph[best].z))?id:best,entries[0][0]);const s=nearest(start),e=nearest(target);const previous:Record<string,string|undefined>={[s]:undefined},queue=[s];for(let i=0;i<queue.length;i++){const here=queue[i];if(here===e)break;for(const n of this.nodeGraph[here].links)if(!(n in previous)){previous[n]=here;queue.push(n);}}const ids:string[]=[];let cur:string|undefined=e;while(cur){ids.unshift(cur);cur=previous[cur];}return ids.map(id=>new V3(this.nodeGraph[id].x,0,this.nodeGraph[id].z)).concat([target.clone()]);}
  private updateBomb(dt:number){
    if(!this.bomb.planted){
      if(this.bomb.carrier===null){const picker=this.fighters.find(f=>f.alive&&f.team==='T'&&flatDist(f.group.position,this.bomb.pos)<1.5);if(picker){picker.c4=true;this.bomb.carrier=picker.id;this.bombMesh.visible=false;this.message=`${picker.name} RECOVERED C4`;this.messageUntil=this.now+1.5;}}
      const carrier=this.fighters.find(f=>f.id===this.bomb.carrier);if(carrier&&carrier.alive){const inA=flatDist(carrier.group.position,new V3(-35,0,-18))<8;const inB=flatDist(carrier.group.position,new V3(36,0,-18))<8;const active=carrier.ai||(carrier.id===this.controlledId&&this.keys.has('e'));if((inA||inB)&&active){this.bomb.plant+=dt;if(Math.floor((this.bomb.plant-dt)*2)!==Math.floor(this.bomb.plant*2))this.sound.play('plant');if(this.bomb.plant>=2.8)this.plantBomb(carrier);}else this.bomb.plant=Math.max(0,this.bomb.plant-dt*2);}
    } else {
      this.bomb.timer-=dt;this.bombMesh.visible=true;this.bombMesh.position.copy(this.bomb.pos);this.bombMesh.rotation.y+=dt*3;const blink=.3+Math.max(0,1-this.bomb.timer/40)*.4;this.bombMesh.visible=Math.sin(this.now*10)>-0.8||blink>.55;
      let defuser:Combatant|undefined;const controlled=this.controlled();if(controlled.alive&&controlled.team==='CT'&&flatDist(controlled.group.position,this.bomb.pos)<3&&this.keys.has('e'))defuser=controlled;else defuser=this.fighters.filter(f=>f.alive&&f.ai&&f.team==='CT'&&flatDist(f.group.position,this.bomb.pos)<2.6).sort((a,b)=>flatDist(a.group.position,this.bomb.pos)-flatDist(b.group.position,this.bomb.pos))[0];
      if(defuser){this.bomb.defuser=defuser.id;this.bomb.defuse+=dt;if(Math.floor((this.bomb.defuse-dt)*2)!==Math.floor(this.bomb.defuse*2))this.sound.play('defuse');if(this.bomb.defuse>=6){this.bombMesh.visible=false;this.addFeed(`${defuser.name} DEFUSED THE C4`,'CT');this.endRound('CT','C4 DEFUSED');}}else{this.bomb.defuser=null;this.bomb.defuse=Math.max(0,this.bomb.defuse-dt*1.8);}
      if(this.bomb.timer<=0){this.sound.play('boom');this.bombMesh.visible=false;this.addFeed('C4 EXPLODED','T');this.endRound('T','C4 DETONATED');}
    }
  }
  private plantBomb(carrier:Combatant){this.bomb.planted=true;this.bomb.carrier=null;carrier.c4=false;this.bomb.pos.copy(carrier.group.position);this.bomb.pos.y=.04;this.bomb.timer=40;this.bomb.plant=0;this.bombMesh.visible=true;this.bombMesh.position.copy(this.bomb.pos);this.sound.play('plant');this.addFeed(`${carrier.name} PLANTED THE C4`,'T');this.message='BOMB PLANTED — CT MUST DEFUSE';this.messageUntil=this.now+3;}
  private tryInteract(p:Combatant,dt:number){if(p.team==='T'&&p.c4&&!this.bomb.planted)return; if(p.team==='CT'&&this.bomb.planted&&flatDist(p.group.position,this.bomb.pos)<3){this.message='DEFUSING C4…';this.messageUntil=this.now+.3;}}
  private checkRound(dt:number){if(this.phase!=='live')return;const ts=this.fighters.filter(f=>f.alive&&f.team==='T').length,cts=this.fighters.filter(f=>f.alive&&f.team==='CT').length;if(cts===0){this.endRound('T','COUNTER-TERRORISTS ELIMINATED');return;}if(ts===0&&!this.bomb.planted){this.endRound('CT','TERRORISTS ELIMINATED');return;}if(!this.bomb.planted){this.roundTimer-=dt;if(this.roundTimer<=0)this.endRound('CT','TIME EXPIRED');}}
  private endRound(winner:Team,reason:string){if(this.phase==='ended')return;this.phase='ended';this.nextRound=this.now+4.5;this.message=`${winner} WIN — ${reason}`;this.messageUntil=this.nextRound;this.addFeed(`${winner} WIN // ${reason}`,winner);this.mouseDown=false;}
  private resetRound(first:boolean){this.phase='live';if(!first){this.round++;this.pistolRound=this.round===1;}this.roundTimer=115;this.controlledId=this.playerOrigin;this.yaw=Math.PI;this.pitch=-.08;this.feeds=[];for(const f of this.fighters){f.health=100;f.armor=this.pistolRound?0:100;f.alive=true;f.velocityY=0;f.group.position.copy(f.spawn);f.group.rotation.y=f.team==='CT'?Math.PI:0;f.group.visible=f.id!==this.controlledId;f.c4=false;f.primary=this.pistolRound?null:(f.team==='CT'?'m4':'ak');f.secondary=f.team==='CT'?'usp':'glock';f.selected=f.primary||f.secondary;f.nextShot=0;f.reloadingUntil=0;f.reloadWeapon=null;f.recoil=0;f.navPath=[];f.navGoal='';f.ammo={} as Record<WeaponId,number>;f.reserve={} as Record<WeaponId,number>;for(const [id,s] of Object.entries(WEAPONS) as [WeaponId,WeaponSpec][]) {f.ammo[id]=s.mag;f.reserve[id]=s.reserve;} }
    if(!this.pistolRound){const sniper=this.fighters.find(f=>f.id==='t3');if(sniper){sniper.primary='awp';sniper.selected='awp';}const eagle=this.fighters.find(f=>f.id==='ct2');if(eagle)eagle.secondary='deagle';}
    const carrier=this.fighters.find(f=>f.id==='t0')!;carrier.c4=true;this.bomb={carrier:carrier.id,pos:carrier.group.position.clone(),planted:false,timer:0,plant:0,defuse:0,defuser:null};this.bombMesh.visible=false;this.refreshViewGun(this.controlled().selected);this.message=this.pistolRound?'PISTOL ROUND // DEFAULT SIDEARMS ONLY':'BUY COMPLETE // RIFLE ROUND';this.messageUntil=this.now+4;
  }
  private takeOver(){const current=this.controlled();const mates=this.fighters.filter(f=>f.alive&&f.team===current.team);if(!mates.length)return;let idx=mates.findIndex(f=>f.id===current.id);idx=(idx+1)%mates.length;const next=mates[idx];if(next.id===current.id&&current.alive)return;for(const f of this.fighters)if(f.id===this.controlledId)f.group.visible=f.alive;this.controlledId=next.id;next.group.visible=false;this.yaw=next.yaw;this.pitch=0;this.refreshViewGun(next.selected);this.message=`TAKEOVER // ${next.name}`;this.messageUntil=this.now+1.5;}
  private publishHUD(){
    const p=this.controlled(), s=WEAPONS[p.selected], pos=(v:THREE.Vector3)=>({x:clamp((v.x+58)/116*100,1,99),z:clamp((58-v.z)/116*100,1,99)});
    const own=this.fighters.filter(f=>f.alive&&f.team===p.team).map(f=>({id:f.id,...pos(f.group.position),team:f.team,isSelf:f.id===p.id}));
    const visible=this.fighters.filter(f=>f.alive&&f.team!==p.team&&p.alive&&this.canSee(p,f)).map(f=>({id:f.id,...pos(f.group.position),team:f.team}));
    const carrier=this.fighters.find(f=>f.id===this.bomb.carrier);const bombPosition=this.bomb.planted||!carrier?this.bomb.pos:carrier.group.position;
    const bombLabel=this.bomb.planted?'C4 ARMED':this.bomb.carrier?'T 已持包':'C4 DROPPED';
    this.emit({health:p.health,armor:p.armor,ammo:p.ammo[p.selected],reserve:p.reserve[p.selected],weapon:s.name,weaponKind:s.slot,round:this.round,roundTime:this.roundTimer,phase:this.phase==='live'?'LIVE FIRE':'ROUND COMPLETE',team:p.team,controlledName:p.name,alive:p.alive,bomb:bombLabel,bombTimer:this.bomb.planted?this.bomb.timer:0,feed:this.feeds,players:this.fighters.filter(f=>f.team===p.team).map(f=>({id:f.id,name:f.name,team:f.team,hp:f.health,alive:f.alive})),message:this.now<this.messageUntil?this.message:'',scope:p.selected==='awp'&&this.rightDown&&p.alive,minimap:own,visibleEnemies:visible,bombPoint:pos(bombPosition),crosshair:p.recoil*4+(p.selected==='awp'&&this.rightDown?0:1),objective:this.objectiveFor(p),reload:p.reloadingUntil?Math.max(0,p.reloadingUntil-this.now):0});
  }
  private objectiveFor(p:Combatant){if(this.bomb.planted)return p.team==='CT'?'GET TO C4 — HOLD E TO DEFUSE':'DEFEND THE ARMED C4';if(p.team==='T')return p.c4?'ENTER A OR B — HOLD E TO PLANT':this.bomb.carrier?'ESCORT THE C4 CARRIER':'RECOVER THE DROPPED C4';return 'STOP THE T SIDE — PROTECT BOTH SITES';}
}

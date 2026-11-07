import * as THREE from 'three';
import {
  GRID, W, H, CELL, WALL_H, AREAS, walkable, worldToCell, cellToWorld,
  findPath, hasLOS, rayHitsWall, siteAt, inRect
} from './map';
import { WEAPONS, PISTOL_ROUND, RIFLE_ROUND, type Weapon } from './weapons';
import { sfx } from './audio';

type Team = 'CT' | 'T';
type Phase = 'freeze' | 'live' | 'planted' | 'over';

export type Hud = {
  hp: number; armor: number; ammo: number; reserve: number; weapon: string;
  phase: Phase; timer: number; ct: number; t: number; alive: boolean;
  feed: { k: string; v: string; w: string; t: number }[];
  bomb: { x: number; z: number; planted: boolean; timer: number } | null;
  message: string; spots: { x: number; z: number; team: Team; me: boolean; alive: boolean }[];
  scope: boolean; defusing: number;
};

type Bot = {
  id: number; team: Team; pos: THREE.Vector3; yaw: number; hp: number; alive: boolean;
  weapon: Weapon; ammo: number; group: THREE.Group; parts: any; hit: THREE.Mesh[];
  path: { x: number; z: number }[]; pathT: number; nextThink: number; fireCd: number;
  carrier: boolean; state: string; aimErr: number; walk: number;
};

const TEAM_COLOR: Record<Team, number> = { CT: 0x5b86c9, T: 0xc9843f };

function humanoid(team: Team) {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xd8b48a, roughness: 0.8 });
  const cloth = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team], roughness: 0.75 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.7 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.62, 0.3), cloth);
  torso.position.y = 1.16;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skin);
  head.position.y = 1.62;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.56, 0.16), cloth);
  armL.position.set(-0.33, 1.15, 0.02);
  const armR = armL.clone();
  armR.position.x = 0.33;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.84, 0.2), dark);
  legL.position.set(-0.14, 0.42, 0);
  const legR = legL.clone();
  legR.position.x = 0.14;
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.62), dark);
  gun.position.set(0.3, 1.2, -0.32);

  g.add(torso, head, armL, armR, legL, legR, gun);
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
  return { group: g, parts: { torso, head, armL, armR, legL, legR, gun } };
}

export class Game {
  container: HTMLElement;
  onHud: (h: Hud) => void;
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  keys = new Set<string>();
  locked = false;
  raf = 0;
  clock = new THREE.Clock();

  // player
  pos = new THREE.Vector3(31, 0, 8);
  vel = new THREE.Vector3();
  yaw = Math.PI;
  pitch = 0;
  hp = 100; armor = 100; alive = true;
  weapon: Weapon = WEAPONS.usp;
  mag = 12; reserve = 96;
  reloadT = 0; fireCd = 0; stepCd = 0;
  scoped = false;
  defuseT = 0;

  bots: Bot[] = [];
  hitList: THREE.Mesh[] = [];
  wallsMesh?: THREE.InstancedMesh;

  phase: Phase = 'freeze';
  phaseT = 0;
  round = 0;
  ct = 0; t = 0;
  feed: Hud['feed'] = [];
  message = '';
  bombPos: THREE.Vector3 | null = null;
  bombPlanted = false;
  bombTimer = 0;
  bombMesh?: THREE.Mesh;
  carrierId = -1;

  constructor(container: HTMLElement, onHud: (h: Hud) => void) {
    this.container = container;
    this.onHud = onHud;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0xbcd2e6);
    this.scene.fog = new THREE.Fog(0xc7d8e8, 55, 130);

    this.camera = new THREE.PerspectiveCamera(76, container.clientWidth / container.clientHeight, 0.1, 300);
    this.camera.rotation.order = 'YXZ';

    this.scene.add(this.camera);
    this.buildViewmodel();
    this.buildWorld();
    this.spawnRound(true);
    this.bindInput();
    this.loop();
  }

  viewmodel = new THREE.Group();
  vmKick = 0;

  buildViewmodel() {
    this.viewmodel.position.set(0.2, -0.17, -0.5);
    this.viewmodel.scale.setScalar(0.52);
    const vlight = new THREE.PointLight(0xffeedd, 1.6, 2.4, 2);
    vlight.position.set(0.1, 0.2, 0.1);
    this.camera.add(vlight);
    this.camera.add(this.viewmodel);
    this.refreshViewmodel();
  }

  refreshViewmodel() {
    while (this.viewmodel.children.length) {
      const c = this.viewmodel.children.pop() as THREE.Mesh;
      c.geometry?.dispose?.();
    }
    const metal = new THREE.MeshStandardMaterial({ color: 0x555c64, roughness: 0.5, metalness: 0.55 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.7 });
    const w = this.weapon;
    if (w.kind === 'knife') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.34), metal);
      blade.position.set(0, 0.02, -0.2);
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.14), wood);
      grip.position.set(0, -0.02, 0.0);
      this.viewmodel.add(blade, grip);
      return;
    }
    const len = w.kind === 'sniper' ? 0.95 : w.kind === 'pistol' ? 0.34 : 0.72;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.11, len), metal);
    body.position.set(0, 0, -len / 2);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, len * 0.45, 10), metal);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.012, -len - len * 0.16);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.11), metal);
    mag.position.set(0, -0.11, -len * 0.42);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.15, 0.1), wood);
    grip.position.set(0, -0.1, -len * 0.12);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.22), wood);
    stock.position.set(0, -0.02, 0.1);
    this.viewmodel.add(body, barrel, mag, grip, stock);
    if (w.scope) {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.26, 14), metal);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.09, -len * 0.45);
      this.viewmodel.add(scope);
    }
  }

  /* ------------------------------------------------------------------ world */
  buildWorld() {
    const hemi = new THREE.HemisphereLight(0xdfeaff, 0x6d5a3f, 0.95);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe9c8, 2.1);
    sun.position.set(40, 70, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const d = 70;
    sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
    sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
    sun.shadow.camera.far = 200;
    this.scene.add(sun);

    // sand floor with a faint tile grid
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#cbb08a';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(${150 + Math.random() * 60},${125 + Math.random() * 50},${90 + Math.random() * 40},0.5)`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    g.strokeStyle = 'rgba(120,100,74,0.25)';
    g.lineWidth = 2;
    g.strokeRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(W * 0.5, H * 0.5);
    tex.colorSpace = THREE.SRGBColorSpace;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W * CELL, H * CELL),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((W * CELL) / 2, 0, (H * CELL) / 2);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // walls as instanced boxes, only where a wall cell touches open space
    const cells: { x: number; z: number }[] = [];
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        if (GRID[z * W + x] !== 0) {
          let edge = false;
          for (let dz = -1; dz <= 1 && !edge; dz++) {
            for (let dx = -1; dx <= 1 && !edge; dx++) {
              const nx = x + dx, nz = z + dz;
              if (nx >= 0 && nz >= 0 && nx < W && nz < H && GRID[nz * W + nx] === 0) edge = true;
            }
          }
          if (edge) cells.push({ x, z });
        }
      }
    }
    const geo = new THREE.BoxGeometry(CELL, WALL_H, CELL);
    const mat = new THREE.MeshStandardMaterial({ color: 0xb59a72, roughness: 0.9 });
    const inst = new THREE.InstancedMesh(geo, mat, cells.length);
    inst.castShadow = true;
    inst.receiveShadow = true;
    const m = new THREE.Matrix4();
    cells.forEach((c2, i) => {
      m.makeTranslation((c2.x + 0.5) * CELL, WALL_H / 2, (c2.z + 0.5) * CELL);
      inst.setMatrixAt(i, m);
    });
    this.scene.add(inst);
    this.wallsMesh = inst;

    // crates on the sites for cover (purely visual, kept off walkable centres)
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.85 });
    const cratePositions = [
      [36, 40], [38, 40], [44, 34], [44, 36], [9, 14], [11, 14], [16, 20], [30, 20], [28, 40]
    ];
    for (const [gx, gz] of cratePositions) {
      if (!walkable(gx, gz)) continue;
      const box = new THREE.Mesh(new THREE.BoxGeometry(CELL * 0.9, 1.4, CELL * 0.9), crateMat);
      box.position.set((gx + 0.5) * CELL, 0.7, (gz + 0.5) * CELL);
      box.castShadow = true;
      box.receiveShadow = true;
      this.scene.add(box);
    }

    const bombGeo = new THREE.BoxGeometry(0.5, 0.3, 0.36);
    this.bombMesh = new THREE.Mesh(bombGeo, new THREE.MeshStandardMaterial({ color: 0x33383f, roughness: 0.6, emissive: 0x330000 }));
    this.bombMesh.visible = false;
    this.scene.add(this.bombMesh);
  }

  /* ----------------------------------------------------------------- actors */
  makeBot(team: Team, gx: number, gz: number, weaponId: string): Bot {
    const h = humanoid(team);
    const w = cellToWorld(gx, gz);
    h.group.position.set(w.x, 0, w.z);
    this.scene.add(h.group);

    const hits: THREE.Mesh[] = [];
    const addHit = (geo: THREE.BufferGeometry, y: number, zone: string, z = 0) => {
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
      mesh.position.set(0, y, z);
      mesh.userData = { zone, botId: -1 };
      h.group.add(mesh);
      hits.push(mesh);
    };
    addHit(new THREE.SphereGeometry(0.2, 8, 6), 1.62, 'head');
    addHit(new THREE.BoxGeometry(0.5, 0.42, 0.32), 1.32, 'chest');
    addHit(new THREE.BoxGeometry(0.46, 0.32, 0.3), 0.98, 'stomach');
    addHit(new THREE.BoxGeometry(0.62, 0.5, 0.3), 1.15, 'arm');
    addHit(new THREE.BoxGeometry(0.4, 0.86, 0.3), 0.44, 'leg');

    const bot: Bot = {
      id: this.bots.length + 1, team, pos: new THREE.Vector3(w.x, 0, w.z), yaw: 0,
      hp: 100, alive: true, weapon: WEAPONS[weaponId], ammo: WEAPONS[weaponId].mag,
      group: h.group, parts: h.parts, hit: hits, path: [], pathT: 0, nextThink: 0,
      fireCd: 0, carrier: false, state: 'advance', aimErr: 0.09, walk: 0
    };
    hits.forEach((x) => (x.userData.botId = bot.id));
    this.hitList.push(...hits);
    this.bots.push(bot);
    return bot;
  }

  /* ------------------------------------------------------------------ round */
  spawnRound(first = false) {
    for (const b of this.bots) {
      this.scene.remove(b.group);
      b.hit.forEach((m) => {
        const i = this.hitList.indexOf(m);
        if (i >= 0) this.hitList.splice(i, 1);
      });
    }
    this.bots = [];
    this.round++;
    const pistol = this.round === 1;
    const tW = pistol ? PISTOL_ROUND.t : RIFLE_ROUND.t;
    const ctW = pistol ? PISTOL_ROUND.ct : RIFLE_ROUND.ct;
    this.armor = pistol ? 0 : 100;
    this.hp = 100;
    this.alive = true;

    const p = cellToWorld(28, 9);
    this.pos.set(p.x, 0, p.z);
    this.vel.set(0, 0, 0);
    this.yaw = Math.PI;
    this.pitch = 0;
    this.weapon = WEAPONS[ctW];
    if (this.viewmodel) this.refreshViewmodel();
    this.mag = this.weapon.mag;
    this.reserve = this.weapon.reserve;
    this.scoped = false;

    for (let i = 0; i < 4; i++) this.makeBot('CT', 26 + (i % 3) * 2, 6 + Math.floor(i / 3), ctW);
    if (!pistol && this.round % 3 === 0) this.makeBot('CT', 30, 10, 'awp');
    const tSpawn = [[5, 52], [7, 54], [9, 52], [6, 57], [10, 56]];
    for (let i = 0; i < 5; i++) {
      const b = this.makeBot('T', tSpawn[i][0], tSpawn[i][1], tW);
      if (i === 0) { b.carrier = true; this.carrierId = b.id; }
    }

    this.phase = 'freeze';
    this.phaseT = 4;
    this.bombPlanted = false;
    this.bombTimer = 40;
    this.bombPos = null;
    if (this.bombMesh) this.bombMesh.visible = false;
    this.message = pistol ? 'PISTOL ROUND' : `ROUND ${this.round}`;
    this.defuseT = 0;
  }

  /* ------------------------------------------------------------------ input */
  bindInput() {
    this.onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (e.code === 'KeyR') this.startReload();
      if (e.code === 'Digit1') this.switchWeapon('primary');
      if (e.code === 'Digit2') this.switchWeapon('secondary');
      if (e.code === 'Digit3') this.switchWeapon('melee');
      if (['Space', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) e.preventDefault();
    };
    this.onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);
    this.onMouseMove = (e: MouseEvent) => {
      if (!this.locked) return;
      const sens = this.scoped ? 0.0007 : 0.0022;
      this.yaw -= e.movementX * sens;
      this.pitch -= e.movementY * sens;
      this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
    };
    this.onMouseDown = (e: MouseEvent) => {
      if (!this.locked) return;
      if (e.button === 0) { this.keys.add('Mouse0'); this.tryFire(); }
      if (e.button === 2) { this.scoped = !this.scoped; sfx.scope(); }
    };
    this.onMouseUp = (e: MouseEvent) => { if (e.button === 0) this.keys.delete('Mouse0'); };
    this.onCtx = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('contextmenu', this.onCtx);
  }
  onKeyDown!: (e: KeyboardEvent) => void;
  onKeyUp!: (e: KeyboardEvent) => void;
  onMouseMove!: (e: MouseEvent) => void;
  onMouseDown!: (e: MouseEvent) => void;
  onMouseUp!: (e: MouseEvent) => void;
  onCtx!: (e: Event) => void;

  switchWeapon(slot: 'primary' | 'secondary' | 'melee') {
    const bySlot: Record<string, Weapon | null> = {
      primary: this.round === 1 ? null : WEAPONS.ak47,
      secondary: WEAPONS.usp,
      melee: WEAPONS.knife
    };
    const next = bySlot[slot] || WEAPONS.usp;
    if (next.id === this.weapon.id) return;
    this.weapon = next;
    this.refreshViewmodel();
    this.mag = next.mag;
    this.reserve = next.reserve;
    this.reloadT = 0;
    this.scoped = false;
  }

  startReload() {
    if (this.reloadT > 0 || this.weapon.mag < 0) return;
    if (this.mag >= this.weapon.mag || this.reserve <= 0) return;
    this.reloadT = this.weapon.reload;
    sfx.reload();
  }

  /* ------------------------------------------------------------------ combat */
  tryFire() {
    if (!this.alive || this.phase === 'freeze' || this.phase === 'over') return;
    if (this.fireCd > 0 || this.reloadT > 0) return;
    if (this.weapon.mag > 0 && this.mag <= 0) { this.startReload(); return; }
    this.fireCd = 60 / this.weapon.rpm;
    if (this.mag > 0) this.mag--;
    sfx.shoot(this.weapon.kind);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const spread = this.weapon.spread * (this.scoped ? 0.15 : 1);
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.normalize();

    const wallD = rayHitsWall(this.pos.x, this.pos.z, dir.x, dir.z, this.weapon.range);
    const ray = new THREE.Raycaster(this.camera.getWorldPosition(new THREE.Vector3()), dir, 0, wallD);
    const hits = ray.intersectObjects(this.hitList, false);
    if (hits.length) {
      const h = hits[0];
      const bot = this.bots.find((b) => b.id === h.object.userData.botId);
      if (bot && bot.alive && bot.team === 'T') {
        const zone = h.object.userData.zone;
        const mul = zone === 'head' ? 2 : zone === 'leg' ? 0.75 : zone === 'arm' ? 0.8 : 1;
        let dmg = this.weapon.damage * mul * (this.weapon.kind === 'sniper' ? 1 : 1);
        if (zone === 'head') sfx.headshot(); else sfx.hit();
        this.damageBot(bot, dmg, this.weapon.name, true);
      }
    }
    this.pitch = Math.min(1.45, this.pitch + this.weapon.recoil);
    this.vmKick = 1;
    if (this.mag === 0) this.startReload();
  }

  damageBot(bot: Bot, dmg: number, wname: string, byPlayer: boolean) {
    bot.hp -= dmg;
    if (bot.hp <= 0 && bot.alive) {
      bot.alive = false;
      bot.group.rotation.z = Math.PI / 2;
      bot.group.position.y = 0.2;
      this.feed.unshift({ k: byPlayer ? 'YOU' : 'BOT', v: bot.team, w: wname, t: performance.now() });
      if (byPlayer) { sfx.kill(); }
      if (bot.carrier) { this.bombPos = bot.pos.clone(); if (this.bombMesh) { this.bombMesh.position.copy(this.bombPos).setY(0.15); this.bombMesh.visible = true; } }
      this.checkRoundEnd();
    }
  }

  damagePlayer(dmg: number, wname: string) {
    if (!this.alive || this.phase === 'freeze') return;
    let d = dmg;
    if (this.armor > 0) {
      const pen = 0.7;
      d = dmg * (1 - (1 - pen) * (this.armor / 100));
      this.armor = Math.max(0, this.armor - dmg * 0.5);
    }
    this.hp -= d;
    if (this.hp <= 0 && this.alive) {
      this.alive = false;
      this.feed.unshift({ k: 'BOT', v: 'T', w: wname, t: performance.now() });
      this.checkRoundEnd();
    }
  }

  checkRoundEnd() {
    if (this.phase === 'over') return;
    const tAlive = this.bots.filter((b) => b.team === 'T' && b.alive).length;
    const ctAlive = this.bots.filter((b) => b.team === 'CT' && b.alive).length + (this.alive ? 1 : 0);
    if (tAlive === 0 && !this.bombPlanted) this.endRound('CT', 'Terrorists eliminated');
    else if (ctAlive === 0) this.endRound('T', 'Counter-terrorists eliminated');
  }

  endRound(winner: Team, msg: string) {
    this.phase = 'over';
    this.phaseT = 5;
    this.message = msg;
    if (winner === 'CT') { this.ct++; sfx.roundWin(); } else { this.t++; sfx.roundLose(); }
  }

  /* -------------------------------------------------------------------- bots */
  botThink(bot: Bot, now: number, dt: number) {
    if (!bot.alive) return;
    const enemyTeam: Team = bot.team === 'CT' ? 'T' : 'CT';
    const targets: { x: number; z: number; obj?: Bot | null; isPlayer?: boolean }[] = [];
    for (const b of this.bots) if (b.alive && b.team === enemyTeam) targets.push({ x: b.pos.x, z: b.pos.z, obj: b });
    if (this.alive && enemyTeam === 'CT') targets.push({ x: this.pos.x, z: this.pos.z, isPlayer: true });

    let visible: { x: number; z: number; obj?: Bot | null; isPlayer?: boolean } | null = null;
    let bestD = 1e9;
    for (const t of targets) {
      const d = Math.hypot(t.x - bot.pos.x, t.z - bot.pos.z);
      if (d < 42 && d < bestD && hasLOS(bot.pos.x, bot.pos.z, t.x, t.z)) { visible = t; bestD = d; }
    }

    if (visible) {
      bot.state = 'engage';
      bot.yaw = Math.atan2(visible.x - bot.pos.x, visible.z - bot.pos.z);
      bot.fireCd -= dt;
      if (bot.fireCd <= 0) {
        bot.fireCd = (60 / bot.weapon.rpm) * (1 + Math.random() * 0.35);
        if (bot.ammo > 0) bot.ammo--; else bot.ammo = bot.weapon.mag;
        sfx.shoot(bot.weapon.kind);
        const dist = bestD;
        const acc = Math.max(0.1, 0.85 - dist * 0.012) * (bot.team === 'T' ? 1 : 0.9);
        if (Math.random() < acc) {
          const dmg = bot.weapon.damage * (0.55 + Math.random() * 0.45);
          if (visible.isPlayer) this.damagePlayer(dmg, bot.weapon.name);
          else if (visible.obj) this.damageBot(visible.obj, dmg, bot.weapon.name, false);
        }
      }
      return;
    }

    // objective logic
    bot.fireCd = Math.max(0, bot.fireCd - dt);
    const gc = worldToCell(bot.pos.x, bot.pos.z);
    const site = siteAt(gc.gx, gc.gz);

    if (bot.team === 'T') {
      if (this.bombPlanted) { bot.state = 'defend'; }
      else if (bot.carrier && site) {
        this.plantBomb(bot.pos.clone());
        bot.carrier = false;
        return;
      } else if (bot.nextThink < now) {
        bot.nextThink = now + 2500;
        const target = bot.carrier && this.bombPos ? worldToCell(this.bombPos.x, this.bombPos.z) : { gx: 38, gz: 42 };
        const dest = bot.carrier ? { gx: 38, gz: 42 } : target;
        bot.path = findPath(gc.gx, gc.gz, dest.gx, dest.gz);
        bot.pathT = 0;
      }
    } else {
      if (this.bombPlanted && this.bombPos) {
        const d = Math.hypot(this.bombPos.x - bot.pos.x, this.bombPos.z - bot.pos.z);
        if (d < 1.8) {
          bot.state = 'defuse';
          this.defuseT += dt * 0.6;
          if (Math.random() < dt * 3) sfx.beep();
          if (this.defuseT >= 10) { this.endRound('CT', 'Bomb defused'); }
          return;
        }
        if (bot.nextThink < now) {
          bot.nextThink = now + 2000;
          const bc = worldToCell(this.bombPos.x, this.bombPos.z);
          bot.path = findPath(gc.gx, gc.gz, bc.gx, bc.gz);
        }
      } else if (bot.nextThink < now) {
        bot.nextThink = now + 3500;
        const hold = bot.team === 'CT' ? (Math.random() < 0.5 ? { gx: 40, gz: 40 } : { gx: 12, gz: 16 }) : { gx: 30, gz: 20 };
        bot.path = findPath(gc.gx, gc.gz, hold.gx, hold.gz);
      }
    }

    if (bot.path.length) {
      const wp = bot.path[0];
      const dx = wp.x - bot.pos.x, dz = wp.z - bot.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.6) bot.path.shift();
      else {
        const sp = 4.0 * dt;
        bot.pos.x += (dx / d) * sp;
        bot.pos.z += (dz / d) * sp;
        bot.yaw = Math.atan2(dx, dz);
        bot.walk += dt * 9;
      }
    }
  }

  plantBomb(p: THREE.Vector3) {
    this.bombPlanted = true;
    this.phase = 'planted';
    this.bombPos = p.clone();
    this.bombTimer = 40;
    this.message = 'BOMB PLANTED';
    if (this.bombMesh) { this.bombMesh.position.copy(p).setY(0.16); this.bombMesh.visible = true; }
    sfx.plant();
  }

  /* -------------------------------------------------------------------- loop */
  update(dt: number) {
    const now = performance.now();

    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) { this.phase = 'live'; this.message = ''; }
    } else if (this.phase === 'live') {
      this.phaseT += dt;
      if (this.phaseT > 100) this.endRound('CT', 'Time ran out');
    } else if (this.phase === 'planted') {
      this.bombTimer -= dt;
      if (this.bombTimer <= 0) { sfx.explode(); this.endRound('T', 'Target eliminated'); }
      else if (this.bombTimer < 10 && Math.floor(this.bombTimer * 2) !== Math.floor((this.bombTimer + dt) * 2)) sfx.beep();
    } else if (this.phase === 'over') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) this.spawnRound();
    }

    // player movement
    if (this.alive) {
      const speed = (this.keys.has('ShiftLeft') ? 6.4 : 4.4) * (this.scoped ? 0.35 : 1);
      let fx = 0, fz = 0;
      if (this.keys.has('KeyW')) fz -= 1;
      if (this.keys.has('KeyS')) fz += 1;
      if (this.keys.has('KeyA')) fx -= 1;
      if (this.keys.has('KeyD')) fx += 1;
      const len = Math.hypot(fx, fz) || 1;
      fx /= len; fz /= len;
      const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
      const wx = fx * cos - fz * sin;
      const wz = -fx * sin - fz * cos;

      const tryMove = (nx: number, nz: number) => {
        const r = 0.42;
        const c1 = worldToCell(nx + r, nz), c2 = worldToCell(nx - r, nz);
        const c3 = worldToCell(nx, nz + r), c4 = worldToCell(nx, nz - r);
        return walkable(c1.gx, c1.gz) && walkable(c2.gx, c2.gz) && walkable(c3.gx, c3.gz) && walkable(c4.gx, c4.gz);
      };
      const nx = this.pos.x + wx * speed * dt;
      const nz = this.pos.z + wz * speed * dt;
      if (tryMove(nx, this.pos.z)) this.pos.x = nx;
      if (tryMove(this.pos.x, nz)) this.pos.z = nz;

      // gravity + jump (flat map, so this is just a bob)
      const groundY = 0;
      if (this.pos.y > groundY) this.pos.y = Math.max(groundY, this.pos.y - 9 * dt);
      if (this.keys.has('Space') && this.pos.y <= 0.01) this.pos.y = 0.55;

      if (Math.abs(wx) + Math.abs(wz) > 0.01) {
        this.stepCd -= dt;
        if (this.stepCd <= 0) { this.stepCd = 0.42; sfx.step(); }
      }

      // defuse with E when near the bomb
      if (this.bombPlanted && this.bombPos) {
        const d = Math.hypot(this.bombPos.x - this.pos.x, this.bombPos.z - this.pos.z);
        if (d < 1.8 && this.keys.has('KeyE')) {
          this.defuseT += dt;
          if (Math.random() < dt * 4) sfx.beep();
          if (this.defuseT >= 10) this.endRound('CT', 'Bomb defused');
        } else {
          this.defuseT = Math.max(0, this.defuseT - dt * 0.5);
        }
      }
    }

    this.fireCd = Math.max(0, this.fireCd - dt);
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        const need = this.weapon.mag - this.mag;
        const take = Math.min(need, this.reserve);
        this.mag += take;
        this.reserve -= take;
      }
    } else if (this.keys.has('Mouse0') && this.weapon.auto) {
      this.tryFire();
    }

    for (const b of this.bots) this.botThink(b, now, dt);

    // sync meshes
    for (const b of this.bots) {
      b.group.position.set(b.pos.x, b.alive ? 0 : 0.2, b.pos.z);
      b.group.rotation.y = b.yaw;
      const swing = Math.sin(b.walk) * 0.5;
      if (b.parts.legL) {
        b.parts.legL.rotation.x = swing;
        b.parts.legR.rotation.x = -swing;
        b.parts.armL.rotation.x = -swing * 0.4;
        b.parts.armR.rotation.x = swing * 0.4;
      }
    }

    this.camera.position.set(this.pos.x, this.pos.y + 1.62, this.pos.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0);
    this.vmKick = Math.max(0, this.vmKick - dt * 6);
    this.viewmodel.position.set(0.2, -0.17 + this.vmKick * 0.012, -0.5 + this.vmKick * 0.05);
    this.viewmodel.visible = this.alive && !this.scoped;
    this.camera.fov = this.scoped ? 38 : 76;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    this.feed = this.feed.filter((f) => now - f.t < 6000).slice(0, 5);
  }

  snapshot(): Hud {
    return {
      hp: Math.max(0, Math.round(this.hp)),
      armor: Math.max(0, Math.round(this.armor)),
      ammo: this.mag,
      reserve: this.reserve,
      weapon: this.weapon.name,
      phase: this.phase,
      timer: this.phase === 'live' ? Math.max(0, 100 - this.phaseT) : this.phase === 'planted' ? this.bombTimer : this.phase === 'freeze' ? this.phaseT : this.phaseT,
      ct: this.ct, t: this.t, alive: this.alive, feed: this.feed.slice(),
      bomb: this.bombPlanted && this.bombPos ? { x: this.bombPos.x, z: this.bombPos.z, planted: true, timer: this.bombTimer } : null,
      message: this.message,
      spots: [
        { x: this.pos.x, z: this.pos.z, team: 'CT' as Team, me: true, alive: this.alive },
        ...this.bots.map((b) => ({ x: b.pos.x, z: b.pos.z, team: b.team, me: false, alive: b.alive }))
      ],
      scope: this.scoped,
      defusing: Math.min(1, this.defuseT / 10)
    };
  }

  hudAcc = 0;

  loop = () => {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.update(dt);
    this.hudAcc += dt;
    if (this.hudAcc >= 0.1) {
      this.hudAcc = 0;
      this.onHud(this.snapshot());
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('contextmenu', this.onCtx);
    this.renderer.dispose();
    this.container.innerHTML = '';
  }
}

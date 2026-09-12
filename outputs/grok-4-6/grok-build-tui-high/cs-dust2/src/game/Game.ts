import * as THREE from "three";
import type { GamePhase, HudSnapshot, KillEvent, MatchOptions, Team, HitPart, WeaponId } from "./types";
import { WEAPONS, applyArmor, hitMultiplier } from "./weapons";
import { AudioEngine } from "./audio";
import { Input } from "./input";
import {
  buildDust2,
  canOccupy,
  crateBlocks,
  floorAt,
  inPlantZone,
  nearestNav,
  rayHitCrates,
  rayHitsWall,
  type Dust2World,
} from "./map/Dust2";
import {
  animateWalk,
  createCharacter,
  createViewmodel,
  setCharacterWeapon,
  setViewmodelWeapon,
  type Viewmodel,
} from "./render/CharacterMesh";
import { CT_NAMES, T_NAMES, currentWeapon, giveLoadout, type Actor } from "./actor";
import { assignRoles, buildPath, holdPos, nextSteer, pickSite, sitePos } from "./ai";

const TICK = 1 / 60;
const GRAVITY = -24;
const JUMP = 8.2;
const RADIUS = 0.34;
const EYE = 1.58;
const STEP = 0.95;
const PLANT_TIME = 3.4;
const DEFUSE_TIME = 5.2;
const BOMB_TIME = 40;
const FREEZE = 4;
const ROUND_TIME = 115;
const END_TIME = 4.5;
const SENS = 0.0022;

interface Hitbox {
  part: HitPart;
  cx: number;
  cy: number;
  cz: number;
  hx: number;
  hy: number;
  hz: number;
}

const HITBOXES: Hitbox[] = [
  { part: "head", cx: 0, cy: 1.68, cz: 0, hx: 0.14, hy: 0.14, hz: 0.14 },
  { part: "chest", cx: 0, cy: 1.38, cz: 0.02, hx: 0.22, hy: 0.17, hz: 0.14 },
  { part: "stomach", cx: 0, cy: 1.08, cz: 0, hx: 0.2, hy: 0.15, hz: 0.13 },
  { part: "arm", cx: -0.3, cy: 1.28, cz: 0.08, hx: 0.1, hy: 0.28, hz: 0.1 },
  { part: "arm", cx: 0.3, cy: 1.28, cz: 0.08, hx: 0.1, hy: 0.28, hz: 0.1 },
  { part: "leg", cx: -0.11, cy: 0.48, cz: 0, hx: 0.1, hy: 0.5, hz: 0.11 },
  { part: "leg", cx: 0.11, cy: 0.48, cz: 0, hx: 0.1, hy: 0.5, hz: 0.11 },
];

interface Bomb {
  x: number;
  y: number;
  z: number;
  planted: boolean;
  dropped: boolean;
  site: "A" | "B" | null;
  time: number;
  carrier: string | null;
  mesh: THREE.Group;
}

interface Tracer {
  line: THREE.Line;
  t: number;
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private world: Dust2World;
  private input = new Input();
  private audio = new AudioEngine();
  private actors: Actor[] = [];
  private bomb!: Bomb;
  private vm: Viewmodel;
  private options: MatchOptions;
  private phase: GamePhase = "freezetime";
  private phaseT = FREEZE;
  private round = 1;
  private scoreT = 0;
  private scoreCT = 0;
  private execSite: "A" | "B" = "A";
  private killfeed: KillEvent[] = [];
  private killId = 0;
  private message = "";
  private hint = "";
  private specIndex = 0;
  private hitMarker = 0;
  private damageFlash = 0;
  private hudTimer = 0;
  private onHud: (s: HudSnapshot) => void;
  private running = false;
  private last = 0;
  private acc = 0;
  private clock = 0;
  private detachInput: () => void;
  private tracers: Tracer[] = [];
  private muzzleLight: THREE.PointLight;
  private bombLight: THREE.PointLight;
  private explodeMesh: THREE.Mesh;
  private explodeT = 0;
  private lastBeep = 0;
  private camYaw = 0;
  private camPitch = 0;
  private raf = 0;
  private resizeObs: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, options: MatchOptions, onHud: (s: HudSnapshot) => void) {
    this.options = options;
    this.onHud = onHud;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7ec4e8);
    this.scene.fog = new THREE.Fog(0xb8c8c0, 48, 130);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.05, 250);
    this.camera.layers.enable(0);
    this.camera.layers.enable(1);

    this.world = buildDust2();
    this.scene.add(this.world.group);

    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x8a7348, 0.85);
    hemi.layers.enable(0);
    hemi.layers.enable(1);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.15);
    sun.position.set(30, 70, -40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 160;
    sun.shadow.camera.left = -70;
    sun.shadow.camera.right = 70;
    sun.shadow.camera.top = 70;
    sun.shadow.camera.bottom = -70;
    sun.layers.enable(0);
    sun.layers.enable(1);
    this.scene.add(sun);
    const fill = new THREE.AmbientLight(0xffffff, 0.18);
    fill.layers.enable(0);
    fill.layers.enable(1);
    this.scene.add(fill);

    this.muzzleLight = new THREE.PointLight(0xffcc66, 0, 6);
    this.muzzleLight.layers.enable(0);
    this.muzzleLight.layers.enable(1);
    this.scene.add(this.muzzleLight);

    this.bombLight = new THREE.PointLight(0xffaa33, 0, 8);
    this.scene.add(this.bombLight);

    this.explodeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0 })
    );
    this.explodeMesh.visible = false;
    this.scene.add(this.explodeMesh);

    this.vm = createViewmodel();
    this.vm.group.layers.set(1);
    this.vm.group.traverse((o) => o.layers.set(1));
    this.camera.add(this.vm.group);
    this.scene.add(this.camera);

    this.bomb = this.makeBomb();
    this.scene.add(this.bomb.mesh);

    this.spawnRound(true);
    this.detachInput = this.input.attach(canvas);

    this.resizeObs = new ResizeObserver(() => this.resize(canvas));
    this.resizeObs.observe(canvas.parentElement || canvas);
    this.resize(canvas);

    window.addEventListener("keydown", this.onKey);
  }

  private onKey = (e: KeyboardEvent): void => {
    if (e.code === "KeyM") this.audio.resume();
  };

  start(): void {
    this.running = true;
    this.last = performance.now();
    this.audio.resume();
    this.pushHud();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.acc += dt;
      while (this.acc >= TICK) {
        this.fixed(TICK);
        this.acc -= TICK;
      }
      this.clock += dt;
      this.render(dt);
      this.hudTimer += dt;
      if (this.hudTimer > 0.05) {
        this.hudTimer = 0;
        this.pushHud();
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  dispose(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.detachInput();
    this.resizeObs.disconnect();
    window.removeEventListener("keydown", this.onKey);
    this.renderer.dispose();
  }

  private resize(canvas: HTMLCanvasElement): void {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  private makeBomb(): Bomb {
    const mesh = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.16, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xc8a84a, metalness: 0.4, roughness: 0.4 })
    );
    body.castShadow = true;
    mesh.add(body);
    const ant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    ant.position.set(0.1, 0.2, 0);
    mesh.add(ant);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.04), new THREE.MeshBasicMaterial({ color: 0xff2200 }));
    led.position.set(-0.1, 0.09, 0);
    led.name = "led";
    mesh.add(led);
    return {
      x: 0,
      y: 0,
      z: 0,
      planted: false,
      dropped: false,
      site: null,
      time: BOMB_TIME,
      carrier: null,
      mesh,
    };
  }

  private pistolThisRound(): boolean {
    return this.options.pistolRound && this.round === 1;
  }

  private spawnRound(first: boolean): void {
    for (const a of this.actors) this.scene.remove(a.mesh.root);
    this.actors = [];
    this.killfeed = [];
    this.message = first ? "手枪局" : "";
    this.phase = "freezetime";
    this.phaseT = FREEZE;
    this.execSite = pickSite();
    this.bomb.planted = false;
    this.bomb.dropped = false;
    this.bomb.site = null;
    this.bomb.time = BOMB_TIME;
    this.bomb.mesh.visible = false;

    const pistol = this.pistolThisRound();
    const playerTeam = this.options.team;
    const tSp = this.world.tSpawns;
    const ctSp = this.world.ctSpawns;

    const make = (team: Team, i: number, player: boolean, awp: boolean, name: string) => {
      const sp = team === "T" ? tSp[i] : ctSp[i];
      const mesh = createCharacter(team);
      const weapons = giveLoadout(team, pistol, awp && !pistol);
      const a: Actor = {
        id: `${team}-${i}`,
        name: player ? "YOU" : name,
        team,
        bot: !player,
        controlled: player,
        x: sp.x,
        y: 0,
        z: sp.z,
        vx: 0,
        vy: 0,
        vz: 0,
        yaw: sp.yaw,
        pitch: 0,
        hp: 100,
        armor: pistol ? 50 : 100,
        helmet: !pistol,
        alive: true,
        onGround: true,
        crouch: false,
        weapons,
        slot: 0,
        spread: 0,
        recoilP: 0,
        recoilY: 0,
        hasBomb: false,
        plantProg: 0,
        defuseProg: 0,
        lastShot: 0,
        scoped: false,
        lastHurt: 0,
        targetId: null,
        path: [],
        pathI: 0,
        destX: sp.x,
        destZ: sp.z,
        site: "mid",
        strafe: 1,
        strafeT: 0,
        stuckT: 0,
        lastX: sp.x,
        lastZ: sp.z,
        visibleToTeam: true,
        seenByPlayerTeam: team === playerTeam,
        nextPath: 0,
        nextShotCheck: 0,
        walkPhase: Math.random() * 10,
        muzzle: 0,
        mesh,
        weaponId: weapons[0].id,
      };
      setCharacterWeapon(mesh, a.weaponId);
      mesh.root.position.set(a.x, a.y, a.z);
      this.scene.add(mesh.root);
      this.actors.push(a);
      return a;
    };

    let tName = 0;
    let ctName = 0;
    for (let i = 0; i < 5; i++) {
      const isP = playerTeam === "T" && i === 0;
      make("T", i, isP, i === 3, T_NAMES[tName++]);
    }
    for (let i = 0; i < 5; i++) {
      const isP = playerTeam === "CT" && i === 0;
      make("CT", i, isP, i === 4, CT_NAMES[ctName++]);
    }

    const terrorists = this.actors.filter((a) => a.team === "T");
    const carrier = terrorists[Math.floor(Math.random() * terrorists.length)];
    carrier.hasBomb = true;
    carrier.site = this.execSite;
    this.bomb.carrier = carrier.id;

    assignRoles(this.actors, playerTeam, this.execSite);
    this.specIndex = 0;
    const p = this.player();
    this.camYaw = p.yaw;
    this.camPitch = 0;
    setViewmodelWeapon(this.vm, currentWeapon(p).id);
    this.vm.group.traverse((o) => o.layers.set(1));
    this.audio.round();
    this.message = `${this.pistolThisRound() ? "手枪局 · " : ""}准备中 · T 进攻 ${this.execSite} 点`;
    this.hint = "点击画面锁定鼠标 · WASD 移动 · 左键开火 · E 下包/拆包";
  }

  private player(): Actor {
    return this.actors.find((a) => a.controlled && a.alive) ?? this.actors.find((a) => a.controlled) ?? this.actors[0];
  }

  private camActor(): Actor {
    const p = this.player();
    if (p.alive && p.controlled) return p;
    const mates = this.actors.filter((a) => a.team === p.team && a.alive);
    if (!mates.length) return p;
    this.specIndex = ((this.specIndex % mates.length) + mates.length) % mates.length;
    return mates[this.specIndex];
  }

  private lookDir(yaw: number, pitch: number): THREE.Vector3 {
    const cp = Math.cos(pitch);
    return new THREE.Vector3(Math.sin(yaw) * cp, -Math.sin(pitch), Math.cos(yaw) * cp);
  }

  private eyeOf(a: Actor): { x: number; y: number; z: number } {
    return { x: a.x, y: a.y + (a.crouch ? EYE * 0.72 : EYE), z: a.z };
  }

  private moveActor(a: Actor, wishX: number, wishZ: number, speed: number, jump: boolean, dt: number): void {
    if (!a.alive) {
      a.vx = 0;
      a.vz = 0;
      return;
    }
    const onGround = a.onGround;
    const accel = onGround ? 38 : 8;
    const maxSp = speed;
    a.vx += wishX * accel * dt;
    a.vz += wishZ * accel * dt;
    const sp = Math.hypot(a.vx, a.vz);
    const limit = onGround ? maxSp : Math.max(maxSp, sp);
    if (sp > limit) {
      a.vx = (a.vx / sp) * limit;
      a.vz = (a.vz / sp) * limit;
    }
    if (onGround) {
      const fr = Math.exp(-8 * dt);
      a.vx *= fr;
      a.vz *= fr;
      if (jump) {
        a.vy = JUMP;
        a.onGround = false;
      }
    }
    a.vy += GRAVITY * dt;

    const nx = a.x + a.vx * dt;
    const nz = a.z + a.vz * dt;
    this.tryMove(a, nx, nz);
    a.y += a.vy * dt;
    const fl = this.standFloor(a.x, a.z, a.y);
    const fromY = a.y - a.vy * dt;
    const canStep = fl - fromY <= STEP + 0.05;
    if (a.vy <= 0 && a.y <= fl && (canStep || a.onGround && Math.abs(fl - fromY) < 1.2)) {
      if (a.vy < -12) {
        const dmg = Math.min(40, Math.floor((-a.vy - 12) * 4));
        if (dmg > 0) {
          a.hp = Math.max(0, a.hp - dmg);
          if (a.controlled) {
            this.damageFlash = 0.22;
            this.audio.hurt();
          }
          if (a.hp <= 0) {
            a.alive = false;
            if (a.hasBomb) this.dropBomb(a);
          }
        }
      }
      a.y = fl;
      a.vy = 0;
      a.onGround = true;
    } else {
      a.onGround = false;
    }
  }

  private standFloor(x: number, z: number, y: number): number {
    let fl = floorAt(this.world, x, z, RADIUS);
    for (const c of this.world.crates) {
      if (x > c.minX - RADIUS && x < c.maxX + RADIUS && z > c.minZ - RADIUS && z < c.maxZ + RADIUS) {
        if (y + 0.35 >= c.maxY) fl = Math.max(fl, c.maxY);
      }
    }
    return fl;
  }

  private blocked(x: number, z: number, y: number): boolean {
    if (!canOccupy(this.world, x, z, RADIUS)) return true;
    const fl = floorAt(this.world, x, z, RADIUS);
    if (fl - y > STEP) return true;
    const c = crateBlocks(this.world.crates, x, z, RADIUS, y + 0.4);
    return !!c;
  }

  private tryMove(a: Actor, nx: number, nz: number): void {
    if (!this.blocked(nx, nz, a.y)) {
      a.x = nx;
      a.z = nz;
      return;
    }
    if (!this.blocked(nx, a.z, a.y)) {
      a.x = nx;
      a.vx *= 0.3;
      return;
    }
    if (!this.blocked(a.x, nz, a.y)) {
      a.z = nz;
      a.vz *= 0.3;
      return;
    }
    a.vx = 0;
    a.vz = 0;
  }

  private fixed(dt: number): void {
    if (this.input.locked) this.audio.resume();
    this.phaseT -= dt;
    if (this.phase === "freezetime" && this.phaseT <= 0) {
      this.phase = "live";
      this.phaseT = ROUND_TIME;
      this.message = "回合开始";
    }
    if (this.phase === "live" && this.phaseT <= 0) {
      this.endRound("CT", "时间耗尽");
    }
    if (this.phase === "planted") {
      this.bomb.time -= dt;
      const interval = this.bomb.time < 8 ? 0.35 : this.bomb.time < 16 ? 0.7 : 1.15;
      if (this.clock - this.lastBeep > interval) {
        this.lastBeep = this.clock;
        this.audio.beep(this.bomb.time < 8);
      }
      if (this.bomb.time <= 0) {
        this.explode();
        this.endRound("T", "C4 爆炸");
      }
    }
    if (this.phase === "roundend" && this.phaseT <= 0) {
      this.round++;
      this.spawnRound(false);
    }

    this.updatePlayer(dt);
    for (const a of this.actors) {
      if (a.bot && !a.controlled) this.updateBot(a, dt);
      this.updateCommon(a, dt);
    }
    this.updateBomb(dt);
    this.checkRound();
    this.input.endFrame();
    this.hitMarker = Math.max(0, this.hitMarker - dt);
    this.damageFlash = Math.max(0, this.damageFlash - dt);
  }

  private updatePlayer(dt: number): void {
    const p = this.player();
    const cam = this.camActor();

    this.camYaw += this.input.mx * SENS * (cam.scoped ? 0.28 : 1);
    this.camPitch += this.input.my * SENS * (cam.scoped ? 0.28 : 1);
    this.camPitch = Math.max(-1.45, Math.min(1.45, this.camPitch));

    if (!p.alive) {
      const snapSpec = () => {
        const t = this.camActor();
        this.camYaw = t.yaw;
        this.camPitch = t.pitch;
      };
      if (this.input.cycleSpec) {
        const mates = this.actors.filter((a) => a.team === p.team && a.alive);
        if (mates.length) this.specIndex = (this.specIndex + (this.input.cycleSpec > 0 ? 1 : -1) + mates.length) % mates.length;
        snapSpec();
      }
      if (this.input.firePressed) {
        const mates = this.actors.filter((a) => a.team === p.team && a.alive);
        if (mates.length) this.specIndex = (this.specIndex + 1) % mates.length;
        snapSpec();
      }
      if (this.input.takeoverPressed) {
        const t = this.camActor();
        if (t.alive && t !== p) {
          p.controlled = false;
          t.controlled = true;
          t.bot = false;
          this.camYaw = t.yaw;
          this.camPitch = t.pitch;
          setViewmodelWeapon(this.vm, currentWeapon(t).id);
          this.vm.group.traverse((o) => o.layers.set(1));
          this.message = `接管 ${t.name}`;
        }
      }
      return;
    }

    p.yaw = this.camYaw;
    p.pitch = this.camPitch + p.recoilP;

    if (this.input.slot != null && p.weapons[this.input.slot]) {
      p.slot = this.input.slot;
      p.scoped = false;
      this.equip(p);
    }

    const w = currentWeapon(p);
    const def = WEAPONS[w.id];
    if (this.input.altPressed && def.isSniper) {
      p.scoped = !p.scoped;
      this.audio.scope();
    }
    if (!def.isSniper) p.scoped = false;

    if (this.input.reloadPressed) this.startReload(p);
    if (this.input.dropPressed && p.hasBomb) this.dropBomb(p);

    const frozen = this.phase === "freezetime" || this.phase === "roundend";
    const ax = this.input.axis();
    const cy = Math.cos(p.yaw);
    const sy = Math.sin(p.yaw);
    const wishX = ax.x * cy + ax.z * sy;
    const wishZ = -ax.x * sy + ax.z * cy;
    const speed = this.input.walk ? 2.6 : p.scoped ? 3.2 : 5.7;
    if (!frozen) this.moveActor(p, wishX, wishZ, speed, this.input.jumpPressed, dt);
    else {
      p.vx = 0;
      p.vz = 0;
    }

    const moving = Math.hypot(p.vx, p.vz);
    if (moving > 1.2 && p.onGround) this.audio.footstep(moving);

    this.handleUse(p, dt);

    const canShoot = !frozen && !w.reloading && p.plantProg <= 0 && p.defuseProg <= 0;
    if (canShoot) {
      if (def.isAuto && this.input.fireDown) this.tryFire(p, true);
      else if (!def.isAuto && this.input.firePressed) this.tryFire(p, true);
    }
  }

  private handleUse(p: Actor, dt: number): void {
    if (this.phase === "freezetime" || this.phase === "roundend") return;
    const holding = this.input.interact;
    if (p.team === "T" && p.hasBomb && !this.bomb.planted) {
      const zone = inPlantZone(this.world, p.x, p.z);
      if (zone && holding && Math.hypot(p.vx, p.vz) < 0.4) {
        p.plantProg += dt;
        if (p.plantProg >= PLANT_TIME) this.plant(p, zone);
      } else p.plantProg = 0;
    } else p.plantProg = 0;

    if (p.team === "CT" && this.bomb.planted) {
      const d = Math.hypot(p.x - this.bomb.x, p.z - this.bomb.z);
      if (d < 1.4 && holding && Math.hypot(p.vx, p.vz) < 0.4) {
        p.defuseProg += dt;
        if (p.defuseProg >= DEFUSE_TIME) this.defuse(p);
      } else p.defuseProg = 0;
    } else p.defuseProg = 0;

    if (p.team === "T" && this.bomb.dropped && holding) {
      const d = Math.hypot(p.x - this.bomb.x, p.z - this.bomb.z);
      if (d < 1.5) this.pickupBomb(p);
    }
  }

  private updateBot(a: Actor, dt: number): void {
    if (!a.alive) return;
    const frozen = this.phase === "freezetime" || this.phase === "roundend";
    if (frozen) return;

    const vis = this.visibleEnemies(a);
    if (vis.length) {
      const tgt = vis.reduce((b, c) => (this.dist(a, c) < this.dist(a, b) ? c : b));
      a.targetId = tgt.id;
      this.aimAt(a, tgt, dt);
      a.strafeT -= dt;
      if (a.strafeT <= 0) {
        a.strafe = Math.random() < 0.5 ? -1 : 1;
        a.strafeT = 0.35 + Math.random() * 0.5;
      }
      const sy = Math.sin(a.yaw);
      const cy = Math.cos(a.yaw);
      const sidex = a.strafe * cy;
      const sidez = -a.strafe * sy;
      const back = this.dist(a, tgt) < 6 ? 0.4 : -0.15;
      this.moveActor(a, sidex + Math.sin(a.yaw) * back, sidez + Math.cos(a.yaw) * back, 4.2, false, dt);
      if (WEAPONS[currentWeapon(a).id].melee && this.dist(a, tgt) > 2.4) {
        a.slot = 0;
        this.equip(a);
      }
      const tyaw = Math.atan2(tgt.x - a.x, tgt.z - a.z);
      let ad = tyaw - a.yaw;
      while (ad > Math.PI) ad -= Math.PI * 2;
      while (ad < -Math.PI) ad += Math.PI * 2;
      if (Math.abs(ad) < 0.22) this.tryFire(a, false);
      a.plantProg = 0;
      return;
    }
    a.targetId = null;

    // Pickup bomb
    if (a.team === "T" && this.bomb.dropped && !this.bomb.planted) {
      const d = Math.hypot(a.x - this.bomb.x, a.z - this.bomb.z);
      if (d < 1.4) this.pickupBomb(a);
    }

    let goal = holdPos(a.team, a.site, (a.id.charCodeAt(a.id.length - 1) - 48) * 0.8);
    if (a.team === "T") {
      if (this.bomb.planted) {
        const s = this.bomb.site ?? this.execSite;
        goal = { x: sitePos(s).x + Math.sin(this.clock + a.walkPhase) * 4, z: sitePos(s).z + Math.cos(this.clock) * 3 };
      } else if (a.hasBomb) {
        goal = sitePos(this.execSite);
      } else if (this.bomb.dropped) {
        const closest = this.actors
          .filter((b) => b.team === "T" && b.alive)
          .sort((b, c) => Math.hypot(b.x - this.bomb.x, b.z - this.bomb.z) - Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z))[0];
        if (closest === a) goal = { x: this.bomb.x, z: this.bomb.z };
        else goal = sitePos(this.execSite);
      } else {
        goal = a.site === "mid" ? sitePos("mid") : sitePos(a.site === "A" || a.site === "B" ? a.site : this.execSite);
      }
    } else {
      if (this.bomb.planted) {
        goal = { x: this.bomb.x, z: this.bomb.z };
      }
    }

    a.nextPath -= dt;
    if (a.nextPath <= 0 || a.path.length === 0) {
      buildPath(this.world, a, goal.x, goal.z);
      a.nextPath = 0.7 + Math.random() * 0.4;
    }
    const steer = nextSteer(this.world, a);
    if (steer) {
      const dx = steer.x - a.x;
      const dz = steer.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const tyaw = Math.atan2(dx, dz);
      a.yaw = this.lerpAngle(a.yaw, tyaw, 1 - Math.exp(-6 * dt));
      a.pitch *= Math.exp(-4 * dt);
      this.moveActor(a, dx / len, dz / len, 5.3, false, dt);
    }

    if (a.team === "T" && a.hasBomb && !this.bomb.planted) {
      const zone = inPlantZone(this.world, a.x, a.z);
      if (zone) {
        a.vx *= 0.2;
        a.vz *= 0.2;
        a.plantProg += dt;
        if (a.plantProg >= PLANT_TIME) this.plant(a, zone);
      } else a.plantProg = 0;
    }

    if (a.team === "CT" && this.bomb.planted && Math.hypot(a.x - this.bomb.x, a.z - this.bomb.z) < 1.3) {
      const busy = this.actors.some((b) => b !== a && b.team === "CT" && b.alive && b.defuseProg > 0.2);
      if (!busy) {
        a.vx *= 0.15;
        a.vz *= 0.15;
        a.defuseProg += dt;
        if (a.defuseProg >= DEFUSE_TIME) this.defuse(a);
      }
    } else a.defuseProg = 0;

    const moved = Math.hypot(a.x - a.lastX, a.z - a.lastZ);
    a.stuckT += dt;
    if (a.stuckT > 1.2) {
      if (moved < 0.25) {
        const n = nearestNav(this.world, a.x, a.z);
        const node = this.world.nav[n];
        if (node && node.neighbors.length) {
          const nb = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
          a.path = [n, nb];
          a.pathI = 0;
        }
      }
      a.lastX = a.x;
      a.lastZ = a.z;
      a.stuckT = 0;
    }

    const w = currentWeapon(a);
    if (w.mag === 0 && w.reserve > 0) this.startReload(a);
  }

  private updateCommon(a: Actor, dt: number): void {
    a.spread = Math.max(0, a.spread - dt * 1.8);
    a.recoilP *= Math.exp(-6 * dt);
    a.recoilY *= Math.exp(-6 * dt);
    a.muzzle = Math.max(0, a.muzzle - dt);
    a.walkPhase += dt * Math.hypot(a.vx, a.vz);
    const w = currentWeapon(a);
    if (w.reloading && this.clock >= w.reloadEnd) {
      const def = WEAPONS[w.id];
      const need = def.magSize - w.mag;
      const take = Math.min(need, w.reserve);
      w.mag += take;
      w.reserve -= take;
      w.reloading = false;
    }
    a.mesh.root.position.set(a.x, a.y, a.z);
    a.mesh.root.rotation.y = a.yaw;
    a.mesh.root.visible = a.alive || true;
    animateWalk(a.mesh, a.walkPhase, Math.hypot(a.vx, a.vz), a.alive);
    if (a.weaponId !== currentWeapon(a).id) {
      a.weaponId = currentWeapon(a).id;
      setCharacterWeapon(a.mesh, a.weaponId);
    }
    a.mesh.root.visible = a !== this.camActor();
  }

  private visibleEnemies(a: Actor): Actor[] {
    const out: Actor[] = [];
    const eye = this.eyeOf(a);
    const fwd = this.lookDir(a.yaw, a.pitch);
    for (const e of this.actors) {
      if (!e.alive || e.team === a.team) continue;
      const dx = e.x - a.x;
      const dy = e.y + 1.3 - eye.y;
      const dz = e.z - a.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > 78) continue;
      const ndx = dx / dist;
      const ndz = dz / dist;
      const ndy = dy / dist;
      const dot = fwd.x * ndx + fwd.y * ndy + fwd.z * ndz;
      if (dot < 0.25) continue;
      if (rayHitsWall(this.world, eye.x, eye.y, eye.z, e.x, e.y + 1.3, e.z)) continue;
      if (rayHitCrates(this.world.crates, eye.x, eye.y, eye.z, e.x, e.y + 1.3, e.z) != null) continue;
      out.push(e);
      if (a.team === this.options.team || a.controlled) e.seenByPlayerTeam = true;
    }
    return out;
  }

  private aimAt(a: Actor, t: Actor, dt: number): void {
    const eye = this.eyeOf(a);
    const tx = t.x - eye.x;
    const ty = t.y + 1.35 - eye.y;
    const tz = t.z - eye.z;
    const yaw = Math.atan2(tx, tz);
    const pitch = -Math.atan2(ty, Math.hypot(tx, tz));
    const jitter = 0.018 + Math.hypot(a.vx, a.vz) * 0.008;
    a.yaw = this.lerpAngle(a.yaw, yaw + (Math.random() - 0.5) * jitter, 1 - Math.exp(-7 * dt));
    a.pitch = a.pitch + (pitch - a.pitch) * (1 - Math.exp(-6 * dt));
  }

  private lerpAngle(a: number, b: number, t: number): number {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * t;
  }

  private dist(a: Actor, b: Actor): number {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  private equip(a: Actor): void {
    const id = currentWeapon(a).id;
    setCharacterWeapon(a.mesh, id);
    a.weaponId = id;
    if (a.controlled) {
      setViewmodelWeapon(this.vm, id);
      this.vm.group.traverse((o) => o.layers.set(1));
    }
    a.scoped = false;
  }

  private startReload(a: Actor): void {
    const w = currentWeapon(a);
    const def = WEAPONS[w.id];
    if (def.melee || w.reloading || w.mag >= def.magSize || w.reserve <= 0) return;
    w.reloading = true;
    w.reloadEnd = this.clock + def.reloadTime;
    if (a.controlled) this.audio.reload();
  }

  private tryFire(a: Actor, isPlayer: boolean): void {
    const w = currentWeapon(a);
    const def = WEAPONS[w.id];
    if (w.reloading) return;
    if (this.clock < w.nextFire) return;
    if (def.isSniper && !isPlayer) a.scoped = true;
    if (!def.melee && w.mag <= 0) {
      if (isPlayer) this.audio.empty();
      w.nextFire = this.clock + 0.18;
      this.startReload(a);
      return;
    }
    w.nextFire = this.clock + 60 / def.rpm;
    if (!def.melee) w.mag--;
    a.muzzle = 0.05;
    a.spread = Math.min(0.12, a.spread + def.recoilKick * 0.02);
    a.recoilP += def.recoilPitch;
    a.recoilY += (Math.random() - 0.5) * def.recoilYaw * 2;
    if (isPlayer) {
      this.camPitch -= def.recoilPitch * 0.85;
      this.camYaw += a.recoilY * 0.4;
      this.vm.punch = def.recoilKick;
    }
    this.audio.gun(def.id);

    const eye = this.eyeOf(a);
    const move = Math.hypot(a.vx, a.vz);
    const spread = def.spread + a.spread + (a.onGround ? 0 : 0.03) + move * def.moveSpread * 0.15;
    const scopedMul = a.scoped ? 0.15 : def.isSniper ? 3.2 : 1;
    const yaw = a.yaw + (Math.random() - 0.5) * spread * scopedMul + a.recoilY * 0.15;
    const pitch = a.pitch + (Math.random() - 0.5) * spread * scopedMul;
    const dir = this.lookDir(yaw, pitch);
    const range = def.melee ? def.meleeRange : def.range;
    const hx = eye.x + dir.x * range;
    const hy = eye.y + dir.y * range;
    const hz = eye.z + dir.z * range;

    const wall = this.wallHitT(eye.x, eye.y, eye.z, hx, hy, hz);
    const crateT = rayHitCrates(this.world.crates, eye.x, eye.y, eye.z, hx, hy, hz);
    let maxT = 1;
    if (wall != null) maxT = Math.min(maxT, wall);
    if (crateT != null) maxT = Math.min(maxT, crateT);

    const hit = this.traceActors(a, eye.x, eye.y, eye.z, dir.x * range, dir.y * range, dir.z * range, maxT);
    const endT = hit ? hit.t : maxT;
    this.spawnTracer(eye.x, eye.y, eye.z, eye.x + dir.x * range * endT, eye.y + dir.y * range * endT, eye.z + dir.z * range * endT);

    if (hit) {
      this.applyHit(a, hit.actor, hit.part, def.id);
    }
  }

  private wallHitT(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number | null {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dz = z1 - z0;
    const dist = Math.hypot(dx, dy, dz);
    const steps = Math.max(2, Math.ceil(dist / 0.3));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      if (rayHitsWall(this.world, x0, y0, z0, x0 + dx * t, y0 + dy * t, z0 + dz * t)) return t;
    }
    return null;
  }

  private traceActors(
    src: Actor,
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxT: number
  ): { actor: Actor; part: HitPart; t: number } | null {
    let best: { actor: Actor; part: HitPart; t: number } | null = null;
    for (const e of this.actors) {
      if (!e.alive || e === src || e.team === src.team) continue;
      const c = Math.cos(e.yaw);
      const s = Math.sin(e.yaw);
      const wx = ox - e.x;
      const wz = oz - e.z;
      const lx0 = wx * c - wz * s;
      const lz0 = wx * s + wz * c;
      const ly0 = oy - e.y;
      const ldx = dx * c - dz * s;
      const ldz = dx * s + dz * c;
      for (const hb of HITBOXES) {
        const b = {
          minX: hb.cx - hb.hx,
          maxX: hb.cx + hb.hx,
          minY: hb.cy - hb.hy,
          maxY: hb.cy + hb.hy,
          minZ: hb.cz - hb.hz,
          maxZ: hb.cz + hb.hz,
        };
        const t = rayBox(lx0, ly0, lz0, ldx, dy, ldz, b);
        if (t != null && t >= 0 && t <= maxT && (!best || t < best.t)) {
          best = { actor: e, part: hb.part, t };
        }
      }
    }
    return best;
  }

  private applyHit(src: Actor, dst: Actor, part: HitPart, weapon: WeaponId): void {
    const def = WEAPONS[weapon];
    const raw = def.damage * hitMultiplier(def, part);
    const { hp, armorLost } = applyArmor(raw, part, dst.armor, dst.helmet, def.armorPen);
    dst.armor = Math.max(0, dst.armor - armorLost);
    if (dst.armor <= 0) dst.helmet = false;
    dst.hp -= hp;
    dst.lastHurt = this.clock;
    if (src.controlled) {
      this.hitMarker = part === "head" ? 0.28 : 0.16;
      this.audio.hit(part === "head");
    }
    if (dst.controlled) {
      this.damageFlash = 0.25;
      this.audio.hurt();
    }
    if (dst.hp <= 0) {
      dst.hp = 0;
      this.kill(src, dst, weapon, part === "head");
    }
  }

  private kill(src: Actor, dst: Actor, weapon: WeaponId, headshot: boolean): void {
    dst.alive = false;
    dst.hp = 0;
    dst.scoped = false;
    dst.vx = 0;
    dst.vz = 0;
    if (dst.hasBomb) this.dropBomb(dst);
    this.killfeed.unshift({
      id: ++this.killId,
      t: this.clock,
      attacker: src.name,
      victim: dst.name,
      weapon,
      headshot,
      attackerTeam: src.team,
    });
    this.killfeed = this.killfeed.slice(0, 6);
    if (src.controlled) this.audio.kill();
  }

  private dropBomb(a: Actor): void {
    a.hasBomb = false;
    this.bomb.dropped = true;
    this.bomb.planted = false;
    this.bomb.carrier = null;
    this.bomb.x = a.x;
    this.bomb.y = a.y + 0.2;
    this.bomb.z = a.z;
    this.bomb.mesh.visible = true;
    this.bomb.mesh.position.set(this.bomb.x, this.bomb.y, this.bomb.z);
  }

  private pickupBomb(a: Actor): void {
    if (a.team !== "T" || !a.alive) return;
    for (const o of this.actors) o.hasBomb = false;
    a.hasBomb = true;
    this.bomb.dropped = false;
    this.bomb.carrier = a.id;
    this.bomb.mesh.visible = false;
    if (a.controlled) this.audio.pickup();
  }

  private plant(a: Actor, site: "A" | "B"): void {
    a.hasBomb = false;
    a.plantProg = 0;
    this.bomb.planted = true;
    this.bomb.dropped = false;
    this.bomb.carrier = null;
    this.bomb.site = site;
    this.bomb.time = BOMB_TIME;
    this.bomb.x = a.x;
    this.bomb.y = a.y + 0.12;
    this.bomb.z = a.z;
    this.bomb.mesh.visible = true;
    this.bomb.mesh.position.set(this.bomb.x, this.bomb.y, this.bomb.z);
    this.phase = "planted";
    this.phaseT = BOMB_TIME;
    this.message = `C4 已安放于 ${site} 点`;
    this.audio.plant();
  }

  private defuse(a: Actor): void {
    a.defuseProg = 0;
    this.bomb.planted = false;
    this.bomb.mesh.visible = false;
    this.audio.defuse();
    this.endRound("CT", `${a.name} 拆除了 C4`);
  }

  private explode(): void {
    this.audio.explode();
    this.explodeMesh.position.set(this.bomb.x, this.bomb.y + 1, this.bomb.z);
    this.explodeMesh.visible = true;
    this.explodeT = 0.8;
    (this.explodeMesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
    this.explodeMesh.scale.setScalar(1);
    this.bomb.mesh.visible = false;
    for (const a of this.actors) {
      if (!a.alive) continue;
      const d = Math.hypot(a.x - this.bomb.x, a.z - this.bomb.z);
      if (d < 18) {
        a.hp = 0;
        a.alive = false;
      }
    }
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === "roundend") return;
    this.phase = "roundend";
    this.phaseT = END_TIME;
    if (winner === "T") this.scoreT++;
    else this.scoreCT++;
    this.message = `${winner === "T" ? "恐怖分子" : "反恐精英"} 胜利 · ${reason}`;
    this.audio.round();
  }

  private checkRound(): void {
    if (this.phase === "roundend" || this.phase === "freezetime") return;
    const tAlive = this.actors.some((a) => a.team === "T" && a.alive);
    const ctAlive = this.actors.some((a) => a.team === "CT" && a.alive);
    if (!ctAlive) this.endRound("T", "歼灭 CT");
    else if (!tAlive && !this.bomb.planted) this.endRound("CT", "歼灭 T");
  }

  private updateBomb(dt: number): void {
    if (this.bomb.carrier) {
      const c = this.actors.find((a) => a.id === this.bomb.carrier);
      if (c && c.hasBomb) {
        this.bomb.x = c.x;
        this.bomb.y = c.y + 0.2;
        this.bomb.z = c.z;
      }
    }
    if (this.bomb.dropped && !this.bomb.planted) {
      this.bomb.mesh.rotation.y += dt;
    }
    if (this.bomb.planted) {
      const led = this.bomb.mesh.getObjectByName("led") as THREE.Mesh | undefined;
      if (led) {
        const mat = led.material as THREE.MeshBasicMaterial;
        mat.color.set(this.clock % 0.5 < 0.25 ? 0xff2200 : 0x330000);
      }
      this.bombLight.position.set(this.bomb.x, this.bomb.y + 0.4, this.bomb.z);
      this.bombLight.intensity = this.clock % 0.5 < 0.12 ? 2.5 : 0.2;
    } else this.bombLight.intensity = 0;

    for (const a of this.actors) a.seenByPlayerTeam = a.team === this.options.team || (a.controlled && a.alive);
    const observers = this.actors.filter((a) => a.alive && (a.team === this.options.team || a.controlled));
    for (const o of observers) this.visibleEnemies(o);

    // auto pickup proximity for T
    if (this.bomb.dropped && !this.bomb.planted) {
      for (const a of this.actors) {
        if (a.team === "T" && a.alive && Math.hypot(a.x - this.bomb.x, a.z - this.bomb.z) < 1.15) {
          this.pickupBomb(a);
          break;
        }
      }
    }
  }

  private spawnTracer(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): void {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe8a0, transparent: true, opacity: 0.7 }));
    this.scene.add(line);
    this.tracers.push({ line, t: 0.08 });
  }

  private render(dt: number): void {
    const camA = this.camActor();
    const eye = this.eyeOf(camA);
    const yaw = this.camYaw;
    const pitch = this.camPitch + (camA.controlled && camA.alive ? camA.recoilP : 0);
    const dir = this.lookDir(yaw, pitch);
    this.camera.position.set(eye.x, eye.y, eye.z);
    this.camera.lookAt(eye.x + dir.x, eye.y + dir.y, eye.z + dir.z);
    this.camera.fov = camA.scoped ? 18 : 75;
    this.camera.updateProjectionMatrix();

    this.vm.punch = Math.max(0, this.vm.punch - dt * 8);
    const bob = camA.alive && camA.onGround ? Math.sin(camA.walkPhase * 1.6) * Math.min(0.03, Math.hypot(camA.vx, camA.vz) * 0.006) : 0;
    this.vm.group.position.set(bob * 0.4, -this.vm.punch * 0.02 + bob, this.vm.punch * 0.04);
    this.vm.group.rotation.x = -this.vm.punch * 0.03;
    this.vm.group.visible = camA.alive && camA.controlled && !camA.scoped;

    const p = this.player();
    if (p.muzzle > 0) {
      this.muzzleLight.position.set(eye.x + dir.x, eye.y + dir.y, eye.z + dir.z);
      this.muzzleLight.intensity = 3.5;
    } else this.muzzleLight.intensity = 0;

    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.t -= dt;
      const mat = tr.line.material as THREE.LineBasicMaterial;
      mat.opacity = Math.max(0, tr.t / 0.08);
      if (tr.t <= 0) {
        this.scene.remove(tr.line);
        tr.line.geometry.dispose();
        mat.dispose();
        this.tracers.splice(i, 1);
      }
    }

    if (this.explodeT > 0) {
      this.explodeT -= dt;
      this.explodeMesh.scale.setScalar(1 + (0.8 - this.explodeT) * 18);
      (this.explodeMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, this.explodeT);
      if (this.explodeT <= 0) this.explodeMesh.visible = false;
    }

    this.renderer.clear();
    this.camera.layers.set(0);
    this.renderer.render(this.scene, this.camera);
    if (this.vm.group.visible) {
      this.renderer.clearDepth();
      this.camera.layers.set(1);
      this.renderer.render(this.scene, this.camera);
    }
    this.camera.layers.enable(0);
    this.camera.layers.enable(1);
  }

  private pushHud(): void {
    const p = this.player();
    const cam = this.camActor();
    const w = currentWeapon(p.alive && p.controlled ? p : cam);
    const def = WEAPONS[w.id];
    const frozen = this.phase === "freezetime";
    const mates = this.actors.filter((a) => a.team === p.team && a.alive && a !== p);
    const walls = this.world.wallLines.filter((_, i) => i % 2 === 0).slice(0, 400);
    const blips = this.actors
      .filter((a) => a.alive && (a.team === p.team || a.seenByPlayerTeam || a.controlled))
      .map((a) => ({
        id: a.id,
        x: a.x,
        z: a.z,
        yaw: a.yaw,
        team: a.team,
        self: a === cam,
        bomb: a.hasBomb,
        seen: a.team !== p.team,
      }));
    let bomb: HudSnapshot["minimap"]["bomb"] = null;
    if (this.bomb.planted || this.bomb.dropped) bomb = { x: this.bomb.x, z: this.bomb.z, carried: false };
    else {
      const c = this.actors.find((a) => a.hasBomb);
      if (c && (c.team === p.team || p.team === "T")) bomb = { x: c.x, z: c.z, carried: true };
    }

    const snapshot: HudSnapshot = {
      hp: p.alive && p.controlled ? p.hp : cam.hp,
      armor: p.alive && p.controlled ? p.armor : cam.armor,
      helmet: p.alive && p.controlled ? p.helmet : cam.helmet,
      alive: p.alive && p.controlled,
      team: p.team,
      weapon: w.id,
      weaponName: def.name,
      mag: def.melee ? 0 : w.mag,
      reserve: def.melee ? 0 : w.reserve,
      reloading: w.reloading,
      scoped: cam.scoped,
      holdingBomb: p.hasBomb,
      bombDropped: this.bomb.dropped,
      bombPlanted: this.bomb.planted,
      bombTime: this.bomb.time,
      plantProgress: (p.alive && p.controlled ? p.plantProg : cam.plantProg) / PLANT_TIME,
      defuseProgress: (p.alive && p.controlled ? p.defuseProg : cam.defuseProg) / DEFUSE_TIME,
      roundTime: this.phase === "planted" ? this.bomb.time : this.phase === "freezetime" ? this.phaseT : this.phaseT,
      phase: this.phase,
      freezeLeft: frozen ? this.phaseT : 0,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      round: this.round,
      pistolRound: this.pistolThisRound(),
      killfeed: this.killfeed.filter((k) => this.clock - k.t < 6),
      message: this.message,
      hint: this.hint,
      spectating: p.alive && p.controlled ? null : cam.name,
      canTakeover: !(p.alive && p.controlled) && cam.alive && cam !== p,
      aliveTeammates: mates.map((m) => ({ id: m.id, name: m.name })),
      minimap: {
        walls,
        floors: this.world.floorRects,
        sites: [
          { name: "A", x: this.world.plantA.x, z: this.world.plantA.z, r: this.world.plantA.r },
          { name: "B", x: this.world.plantB.x, z: this.world.plantB.z, r: this.world.plantB.r },
        ],
        blips,
        bomb,
        yaw: cam.yaw,
      },
      hitMarker: this.hitMarker,
      damageFlash: this.damageFlash,
      names: this.actors.map((a) => ({
        id: a.id,
        name: a.name,
        team: a.team,
        hp: Math.max(0, a.hp),
        alive: a.alive,
        weapon: currentWeapon(a).id,
      })),
    };

    if (p.alive && p.controlled) {
      const zone = inPlantZone(this.world, p.x, p.z);
      if (p.hasBomb && zone && this.phase !== "freezetime") this.hint = `按住 E 在 ${zone} 点安放 C4`;
      else if (p.team === "CT" && this.bomb.planted && Math.hypot(p.x - this.bomb.x, p.z - this.bomb.z) < 1.6)
        this.hint = "按住 E 拆除 C4";
      else if (p.team === "T" && this.bomb.dropped && Math.hypot(p.x - this.bomb.x, p.z - this.bomb.z) < 2)
        this.hint = "按 E 捡起 C4";
      else this.hint = "1/2/3 切枪 · R 换弹 · 右键 AWP 开镜 · G 丢包";
    } else if (snapshot.canTakeover) this.hint = "左键切换视角 · F 接管该队友";
    else this.hint = "等待回合结束";
    snapshot.hint = this.hint;
    this.onHud(snapshot);
  }
}

function rayBox(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  b: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number }
): number | null {
  const invX = 1 / (dx || 1e-12);
  const invY = 1 / (dy || 1e-12);
  const invZ = 1 / (dz || 1e-12);
  let t1 = (b.minX - ox) * invX;
  let t2 = (b.maxX - ox) * invX;
  if (t1 > t2) [t1, t2] = [t2, t1];
  let tmin = t1;
  let tmax = t2;
  t1 = (b.minY - oy) * invY;
  t2 = (b.maxY - oy) * invY;
  if (t1 > t2) [t1, t2] = [t2, t1];
  tmin = Math.max(tmin, t1);
  tmax = Math.min(tmax, t2);
  t1 = (b.minZ - oz) * invZ;
  t2 = (b.maxZ - oz) * invZ;
  if (t1 > t2) [t1, t2] = [t2, t1];
  tmin = Math.max(tmin, t1);
  tmax = Math.min(tmax, t2);
  if (tmax >= tmin && tmax >= 0 && tmin <= 1) return tmin < 0 ? tmax : tmin;
  return null;
}


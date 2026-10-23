import * as THREE from "three";
import { SynthAudio } from "./audio";
import {
  ACTOR_RADIUS,
  MapData,
  Navigator,
  SITES,
  SPAWNS,
  groundHeight,
} from "./map";
import {
  createBomb,
  createCharacter,
  createViewWeapon,
  createWeapon,
  releaseModel,
} from "./models";
import { WorldView, seeded } from "./world";
import { WEAPONS, damageFor, weaponOf } from "./weapons";
import type {
  Actor,
  BombState,
  GameSnapshot,
  HitZone,
  KillEvent,
  MatchConfig,
  Slot,
  Team,
  Vec2,
  WeaponId,
} from "./types";

const EYE = 1.65,
  ROUND_TIME = 115,
  FREEZE_TIME = 4,
  PLANT_TIME = 3.2,
  DEFUSE_TIME = 5,
  BOMB_TIME = 40;
const UP = new THREE.Vector3(0, 1, 0);
const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.z - b.z);
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const angleLerp = (a: number, b: number, t: number) =>
  a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
interface Effect {
  object: THREE.Object3D;
  life: number;
  total: number;
  velocity?: THREE.Vector3;
  grow?: boolean;
}

/** Owns simulation and rendering. React consumes immutable, throttled snapshots only. */
export class GameEngine {
  readonly map = new MapData();
  readonly navigation = new Navigator(this.map);
  readonly audio = new SynthAudio();
  readonly world: WorldView;
  readonly actors: Actor[] = [];
  readonly intel = new Map<number, { x: number; z: number; until: number }>();
  config: MatchConfig = {
    team: "CT",
    primary: "m4a4",
    secondary: "usp",
    pistolStart: false,
  };
  screen: "menu" | "game" = "menu";
  phase: "freeze" | "live" | "ended" = "freeze";
  locked = false;
  round = 1;
  timer = FREEZE_TIME;
  time = 0;
  scoreT = 0;
  scoreCT = 0;
  controlledId = 5;
  spectatorId = 5;
  winner: Team | null = null;
  winReason = "";
  bomb: BombState = {
    state: "carried",
    carrierId: 0,
    position: new THREE.Vector3(),
    site: null,
    timer: BOMB_TIME,
    beepIn: 1,
    defuserId: null,
  };
  scoped = false;
  armory = false;
  scoreboard = false;
  private bombModel = createBomb();
  private viewWeapon: ReturnType<typeof createViewWeapon> | null = null;
  private viewId: WeaponId | null = null;
  private effects: Effect[] = [];
  private raycaster = new THREE.Raycaster();
  private keys = new Set<string>();
  private mouseHeld = false;
  private firePressed = false;
  private random = seeded(8547);
  private listeners = new Set<() => void>();
  private snapshot!: GameSnapshot;
  private abort = new AbortController();
  private animationId = 0;
  private lastFrame = 0;
  private accumulator = 0;
  private snapshotIn = 0;
  private frames = 0;
  private fpsElapsed = 0;
  private fps = 60;
  private visualTime = 0;
  private hitAt = -100;
  private killAt = -100;
  private damageAt = -100;
  private viewShotAt = -100;
  private notice = "";
  private noticeUntil = 0;
  private action = "";
  private endIn = 5;
  private killfeed: KillEvent[] = [];
  private killId = 0;
  private playerVisionIn = 0;
  private lastSlot: Slot = "secondary";
  private disposed = false;
  private droppedBy = -1;
  private pickupAfter = 0;
  private errorCallback: ((message: string) => void) | null = null;

  constructor(container: HTMLElement) {
    this.world = new WorldView(container, this.map);
    this.world.scene.add(this.bombModel.group);
    this.createActors();
    this.resetRound();
    this.previewActors();
    this.bindInput();
    this.publish();
    this.animationId = requestAnimationFrame(this.frame);
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getSnapshot = () => this.snapshot;
  onError(callback: (message: string) => void) {
    this.errorCallback = callback;
  }
  get player() {
    return this.actors[this.controlledId];
  }
  get viewed() {
    return this.player.alive ? this.player : this.actors[this.spectatorId];
  }
  get pistolRound() {
    return this.config.pistolStart && this.round === 1;
  }
  get canBuy() {
    return (
      this.screen === "game" &&
      !this.pistolRound &&
      (this.phase === "freeze" ||
        (this.phase === "live" &&
          this.timer > 95 &&
          this.bomb.state !== "planted"))
    );
  }

  private createActors() {
    const namesT = ["NOMAD", "VIPER", "SABLE", "RAZE", "ECHO"],
      namesCT = ["SPECTRE", "ATLAS", "KITE", "GHOST", "RECON"];
    for (let id = 0; id < 10; id++) {
      const team: Team = id < 5 ? "T" : "CT",
        weapon = team === "T" ? "ak47" : "m4a4";
      const model = createCharacter(team, id, weapon);
      this.world.scene.add(model.group);
      this.actors.push({
        id,
        name: (team === "T" ? namesT : namesCT)[id % 5],
        team,
        position: new THREE.Vector3(),
        yaw: 0,
        pitch: 0,
        velocityY: 0,
        grounded: true,
        health: 100,
        armor: 100,
        alive: true,
        controlled: false,
        loadout: {},
        slot: "primary",
        magazines: {},
        cooldown: 0,
        reloadTime: 0,
        reloadTotal: 0,
        heat: 0,
        recoil: 0,
        kills: 0,
        deaths: 0,
        model,
        moving: false,
        walkCycle: 0,
        stepDistance: 0,
        seenUntil: 0,
        hasBomb: false,
        actionProgress: 0,
        brain: {
          state: "advance",
          targetId: null,
          thinkIn: 0,
          reaction: 0,
          path: [],
          pathIndex: 0,
          repathIn: 0,
          goal: null,
          route: [],
          routeIndex: 0,
          lastSeen: null,
          stuckTime: 0,
          previous: { x: 0, z: 0 },
          burst: 4,
          pause: 0,
        },
      });
    }
  }
  private previewActors() {
    for (const a of this.actors) a.model.group.visible = false;
    const previews = [
      { id: 5, x: 36, z: -4, yaw: 0 },
      { id: 7, x: 40, z: -13, yaw: 0.2 },
      { id: 0, x: 28, z: -23, yaw: Math.PI },
    ];
    for (const p of previews) {
      const a = this.actors[p.id];
      a.position.set(p.x, groundHeight(p.x, p.z), p.z);
      a.yaw = p.yaw;
      a.model.group.visible = true;
      this.syncActor(a);
    }
    this.bombModel.group.visible = false;
  }
  start(config: MatchConfig) {
    this.config = {
      ...config,
      secondary: config.pistolStart
        ? config.team === "T"
          ? "glock"
          : "usp"
        : config.secondary,
    };
    this.screen = "game";
    this.round = 1;
    this.scoreT = 0;
    this.scoreCT = 0;
    this.killfeed = [];
    this.controlledId = config.team === "T" ? 0 : 5;
    this.spectatorId = this.controlledId;
    for (const a of this.actors) {
      a.kills = 0;
      a.deaths = 0;
    }
    this.resetRound();
    this.requestLock();
    this.publish();
  }
  requestLock = () => {
    if (this.disposed) return;
    this.armory = false;
    void this.audio.resume();
    const result = this.world.renderer.domElement.requestPointerLock();
    if (result && typeof result.catch === "function")
      void result.catch(() => {
        this.showNotice("点击「继续行动」进入战场");
        this.publish();
      });
  };
  returnToMenu = () => {
    document.exitPointerLock();
    this.screen = "menu";
    this.armory = false;
    this.scoreboard = false;
    this.scoped = false;
    this.keys.clear();
    this.previewActors();
    this.publish();
  };
  toggleAudio = () => {
    this.audio.toggle();
    this.publish();
  };
  openArmory = () => {
    this.armory = true;
    if (this.locked) document.exitPointerLock();
    this.publish();
  };
  equip = (id: WeaponId) => {
    if (!this.canBuy || !this.player.alive) {
      this.showNotice(
        this.pistolRound
          ? "手枪局：仅配备阵营默认手枪"
          : "装备调整仅限每回合前 20 秒",
      );
      this.publish();
      return;
    }
    const a = this.player,
      w = WEAPONS[id];
    a.loadout[w.slot] = id;
    a.magazines[id] = { ammo: w.magazine, reserve: w.reserve };
    a.slot = w.slot;
    a.reloadTime = 0;
    if (w.slot === "primary") this.config.primary = id;
    if (w.slot === "secondary") this.config.secondary = id;
    this.scoped = false;
    this.updateActorGun(a);
    this.updateViewWeapon();
    this.audio.equip();
    this.showNotice(`已装备 ${w.name}`);
    this.publish();
  };
  restartRound = () => {
    if (this.screen === "game") {
      this.resetRound();
      this.requestLock();
    }
  };
  private resetRound() {
    this.phase = "freeze";
    this.timer = FREEZE_TIME;
    this.winner = null;
    this.winReason = "";
    this.endIn = 5;
    this.scoped = false;
    this.action = "";
    this.armory = false;
    this.intel.clear();
    this.droppedBy = -1;
    this.controlledId = this.config.team === "T" ? 0 : 5;
    this.spectatorId = this.controlledId;
    this.keys.clear();
    this.mouseHeld = false;
    this.firePressed = false;
    for (const e of this.effects) this.removeEffect(e);
    this.effects = [];
    const targetSite = this.round % 2 === 1 ? "A" : "B";
    for (const a of this.actors) {
      const spawn = SPAWNS[a.team][a.id % 5];
      a.position.set(spawn.x, groundHeight(spawn.x, spawn.z), spawn.z);
      a.health = 100;
      a.armor = this.pistolRound ? 25 : 100;
      a.alive = true;
      a.controlled = a.id === this.controlledId;
      a.yaw = a.team === "T" ? 0 : Math.PI;
      a.pitch = 0;
      a.velocityY = 0;
      a.grounded = true;
      a.cooldown = 0;
      a.reloadTime = 0;
      a.heat = 0;
      a.recoil = 0;
      a.hasBomb = false;
      a.actionProgress = 0;
      a.moving = false;
      a.model.group.visible = true;
      a.model.group.rotation.set(0, a.yaw, 0);
      a.model.group.scale.setScalar(1);
      a.model.flash.visible = false;
      const primary: WeaponId = a.controlled
        ? this.config.primary
        : a.id % 5 === 2
          ? "awp"
          : a.team === "T"
            ? "ak47"
            : "m4a4";
      const secondary: WeaponId = this.pistolRound
        ? a.team === "T"
          ? "glock"
          : "usp"
        : a.controlled
          ? this.config.secondary
          : a.id % 5 === 4
            ? "deagle"
            : a.team === "T"
              ? "glock"
              : "usp";
      a.loadout = {
        secondary,
        melee: "knife",
        ...(!this.pistolRound ? { primary } : {}),
      };
      a.slot = this.pistolRound ? "secondary" : "primary";
      a.magazines = {};
      for (const id of Object.values(a.loadout)) {
        const w = WEAPONS[id];
        a.magazines[id] = { ammo: w.magazine, reserve: w.reserve };
      }
      a.brain = {
        state: a.team === "T" ? "advance" : "patrol",
        targetId: null,
        thinkIn: this.random() * 0.2,
        reaction: 0,
        path: [],
        pathIndex: 0,
        repathIn: 0,
        goal: null,
        route: this.makeRoute(a, targetSite),
        routeIndex: 0,
        lastSeen: null,
        stuckTime: 0,
        previous: { x: spawn.x, z: spawn.z },
        burst: 4,
        pause: 0,
      };
      this.updateActorGun(a);
      this.syncActor(a);
    }
    const carrier = this.config.team === "T" ? 0 : (this.round - 1) % 5;
    this.actors[carrier].hasBomb = true;
    this.bomb = {
      state: "carried",
      carrierId: carrier,
      position: this.actors[carrier].position.clone(),
      site: null,
      timer: BOMB_TIME,
      beepIn: 1,
      defuserId: null,
    };
    this.viewId = null;
    this.updateViewWeapon();
    this.showNotice(
      this.pistolRound
        ? "手枪局 · 默认手枪 / 25 护甲"
        : "行动即将开始 · B 键调整装备",
      5,
    );
    this.publish();
  }
  private makeRoute(a: Actor, site: "A" | "B"): Vec2[] {
    const i = a.id % 5;
    if (a.team === "CT") {
      const patrols: Vec2[][] = [
        [
          { x: 21, z: -30 },
          { x: 32, z: -24 },
          { x: 38, z: -12 },
        ],
        [
          { x: -14, z: -28 },
          { x: -28, z: -30 },
          { x: -31, z: -22 },
        ],
        [
          { x: 14, z: -29 },
          { x: 20, z: -22 },
          { x: 14, z: -8 },
        ],
        [
          { x: 0, z: -22 },
          { x: 0, z: -12 },
          { x: 1, z: -2 },
        ],
        [
          { x: -15, z: -28 },
          { x: -23, z: -25 },
          { x: -31, z: -28 },
        ],
      ];
      return patrols[i];
    }
    const long = [
      { x: 21, z: 33 },
      { x: 23, z: 26 },
      { x: 37, z: 25 },
      { x: 38, z: 8 },
      { x: 38, z: -17 },
      { x: 33, z: -24 },
    ];
    const short = [
      { x: 0, z: 19 },
      { x: 13, z: 11 },
      { x: 14, z: -17 },
      { x: 21, z: -22 },
      { x: 30, z: -24 },
    ];
    const midA = [
      { x: 0, z: 15 },
      { x: -1, z: -20 },
      { x: 8, z: -29 },
      { x: 24, z: -30 },
      { x: 32, z: -24 },
    ];
    const tunnel = [
      { x: -18, z: 36 },
      { x: -30, z: 31 },
      { x: -30, z: 12 },
      { x: -30, z: -16 },
      { x: -30, z: -27 },
    ];
    const midB = [
      { x: 0, z: 15 },
      { x: -1, z: -21 },
      { x: -12, z: -28 },
      { x: -27, z: -28 },
    ];
    if (site === "A") return i === 1 || i === 2 ? short : i === 4 ? midA : long;
    return i === 3 || i === 4 ? midB : tunnel;
  }
  private updateActorGun(a: Actor) {
    const old = a.model.gun,
      id = weaponOf(a);
    a.model.group.remove(old);
    const gun = createWeapon(id);
    gun.position.copy(old.position);
    gun.scale.copy(old.scale);
    a.model.group.add(gun);
    a.model.gun = gun;
    releaseModel(old);
  }
  private updateViewWeapon() {
    const id = weaponOf(this.viewed ?? this.player);
    if (this.viewId === id && this.viewWeapon) return;
    if (this.viewWeapon) {
      this.world.handsScene.remove(this.viewWeapon.group);
      releaseModel(this.viewWeapon.group);
    }
    this.viewId = id;
    this.viewWeapon = createViewWeapon(id, this.config.team);
    this.world.handsScene.add(this.viewWeapon.group);
  }
  private bindInput() {
    const options = { signal: this.abort.signal };
    document.addEventListener(
      "pointerlockchange",
      () => {
        this.locked =
          document.pointerLockElement === this.world.renderer.domElement;
        if (!this.locked) {
          this.keys.clear();
          this.mouseHeld = false;
          this.firePressed = false;
          this.scoreboard = false;
          this.audio.pause();
        }
        this.publish();
      },
      options,
    );
    document.addEventListener(
      "mousemove",
      (event) => {
        if (!this.locked || this.screen !== "game" || !this.player.alive)
          return;
        const sensitivity = this.scoped ? 0.00085 : 0.0021;
        this.player.yaw -= event.movementX * sensitivity;
        this.player.pitch = clamp(
          this.player.pitch - event.movementY * sensitivity,
          -1.4,
          1.4,
        );
      },
      options,
    );
    document.addEventListener(
      "mousedown",
      (event) => {
        if (!this.locked || this.screen !== "game") return;
        if (event.button === 0) {
          this.mouseHeld = true;
          this.firePressed = true;
        }
        if (
          event.button === 2 &&
          weaponOf(this.player) === "awp" &&
          this.player.alive
        ) {
          this.scoped = !this.scoped;
          this.audio.scope();
          this.publish();
        }
      },
      options,
    );
    document.addEventListener(
      "mouseup",
      (event) => {
        if (event.button === 0) this.mouseHeld = false;
      },
      options,
    );
    this.world.renderer.domElement.addEventListener(
      "contextmenu",
      (e) => e.preventDefault(),
      options,
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (this.screen !== "game") return;
        if (
          ["Tab", "Space", "ArrowLeft", "ArrowRight"].includes(event.code) &&
          this.locked
        )
          event.preventDefault();
        if (!this.locked) return;
        this.keys.add(event.code);
        if (event.repeat) return;
        if (event.code === "Tab") {
          this.scoreboard = true;
          this.publish();
        }
        if (!this.player.alive) {
          if (event.code === "KeyE") this.takeOver();
          if (event.code === "ArrowRight" || event.code === "Space")
            this.cycleSpectator(1);
          if (event.code === "ArrowLeft") this.cycleSpectator(-1);
          return;
        }
        if (event.code === "KeyR") this.reload(this.player);
        if (event.code === "Digit1") this.switchSlot("primary");
        if (event.code === "Digit2") this.switchSlot("secondary");
        if (event.code === "Digit3") this.switchSlot("melee");
        if (event.code === "KeyQ") this.switchSlot(this.lastSlot);
        if (event.code === "KeyG") this.dropBomb(this.player);
        if (event.code === "KeyB") this.openArmory();
        if (event.code === "KeyM") this.toggleAudio();
      },
      options,
    );
    document.addEventListener(
      "keyup",
      (event) => {
        this.keys.delete(event.code);
        if (event.code === "Tab") {
          this.scoreboard = false;
          this.publish();
        }
      },
      options,
    );
    window.addEventListener(
      "blur",
      () => {
        this.keys.clear();
        this.mouseHeld = false;
        if (this.locked) document.exitPointerLock();
      },
      options,
    );
    this.world.renderer.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        this.errorCallback?.("图形上下文已中断，请刷新页面重新进入战场。");
      },
      options,
    );
  }
  private switchSlot(slot: Slot) {
    const a = this.player;
    if (!a.loadout[slot] || a.slot === slot) return;
    this.lastSlot = a.slot;
    a.slot = slot;
    a.reloadTime = 0;
    a.cooldown = Math.max(0.2, a.cooldown);
    this.scoped = false;
    this.audio.equip();
    this.updateActorGun(a);
    this.updateViewWeapon();
    this.publish();
  }
  reload(a: Actor) {
    const id = weaponOf(a),
      w = WEAPONS[id],
      mag = a.magazines[id];
    if (
      !mag ||
      id === "knife" ||
      a.reloadTime > 0 ||
      mag.ammo === w.magazine ||
      mag.reserve <= 0
    )
      return;
    a.reloadTime = w.reload;
    a.reloadTotal = w.reload;
    if (a.controlled) {
      this.scoped = false;
      this.audio.reload(w.reload);
      this.publish();
    }
  }
  private frame = (timestamp: number) => {
    if (this.disposed) return;
    const elapsed = this.lastFrame
      ? Math.max(0.001, (timestamp - this.lastFrame) / 1000)
      : 1 / 60;
    const dt = Math.min(elapsed, 0.1);
    this.lastFrame = timestamp;
    this.visualTime += dt;
    this.frames++;
    this.fpsElapsed += elapsed;
    if (this.fpsElapsed >= 0.5) {
      this.fps = Math.round(this.frames / this.fpsElapsed);
      this.frames = 0;
      this.fpsElapsed = 0;
    }
    if (this.screen === "game" && this.locked) {
      this.accumulator += dt;
      let steps = 0;
      while (this.accumulator >= 1 / 60 && steps < 6) {
        this.step(1 / 60);
        this.accumulator -= 1 / 60;
        steps++;
      }
    } else this.accumulator = 0;
    this.world.animate(this.visualTime);
    if (this.screen === "menu") this.world.menuCamera(this.visualTime);
    else this.updateCamera(dt);
    this.world.render(
      this.screen === "game" && this.viewed?.alive && !this.scoped,
    );
    this.snapshotIn -= dt;
    if (this.snapshotIn <= 0) {
      this.publish();
      this.snapshotIn = 1 / 12;
    }
    this.animationId = requestAnimationFrame(this.frame);
  };
  /** Fixed 60Hz simulation, independent of React updates and display refresh rate. */
  step(dt: number) {
    this.time += dt;
    this.action = "";
    this.updateEffects(dt);
    for (const a of this.actors)
      if (!a.alive)
        a.model.group.rotation.z = angleLerp(
          a.model.group.rotation.z,
          Math.PI * 0.47,
          dt * 7,
        );
    if (this.phase === "ended") {
      this.endIn -= dt;
      if (this.endIn <= 0) {
        this.round++;
        this.resetRound();
      }
      this.updateBombModel();
      return;
    }
    if (this.phase === "freeze") {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.timer = ROUND_TIME;
        this.phase = "live";
        this.showNotice(
          this.config.team === "T"
            ? "进攻开始 · 护送 C4 前往 A / B 点"
            : "防守开始 · 阻止 C4 安放",
          4,
        );
      }
      this.firePressed = false;
      for (const a of this.actors) this.syncActor(a);
      this.updateBombModel();
      return;
    }
    this.timer = Math.max(0, this.timer - dt);
    for (const a of this.actors) {
      if (!a.alive) continue;
      a.cooldown = Math.max(0, a.cooldown - dt);
      a.heat = Math.max(0, a.heat - dt * 0.7);
      a.recoil *= Math.exp(-dt * 6);
      a.brain.pause = Math.max(0, a.brain.pause - dt);
      a.actionProgress = Math.max(0, a.actionProgress);
      if (a.reloadTime > 0) {
        a.reloadTime -= dt;
        if (a.reloadTime <= 0) {
          a.reloadTime = 0;
          const id = weaponOf(a),
            mag = a.magazines[id];
          if (mag) {
            const amount = Math.min(
              WEAPONS[id].magazine - mag.ammo,
              mag.reserve,
            );
            mag.ammo += amount;
            mag.reserve -= amount;
          }
        }
      }
      a.moving = false;
      if (a.controlled) this.updatePlayer(a, dt);
      else this.updateBot(a, dt);
      const floor = this.map.support(a.position.x, a.position.z, a.position.y);
      a.velocityY -= 16 * dt;
      a.position.y += a.velocityY * dt;
      if (a.position.y <= floor) {
        a.position.y = floor;
        a.velocityY = 0;
        a.grounded = true;
      } else a.grounded = false;
      // Roof collision also applies when jumping in tunnels or through the door frame.
      for (const c of this.map.colliders)
        if (
          c.kind === "roof" &&
          a.position.y + 1.84 > c.minY &&
          a.position.y < c.minY &&
          a.position.x > c.minX &&
          a.position.x < c.maxX &&
          a.position.z > c.minZ &&
          a.position.z < c.maxZ &&
          a.velocityY > 0
        ) {
          a.position.y = c.minY - 1.84;
          a.velocityY = 0;
        }
      if (a.moving) {
        a.walkCycle += dt * 10;
        a.stepDistance += dt * WEAPONS[weaponOf(a)].speed;
        if (a.stepDistance > 2.1 && a.grounded) {
          a.stepDistance = 0;
          const d = distance(a.position, this.viewed.position);
          if (d < 18) this.audio.step(a.controlled ? 0 : d);
        }
      }
      this.syncActor(a);
    }
    this.updateBomb(dt);
    this.updateVision(dt);
    this.checkWinner();
    this.updateBombModel();
    this.firePressed = false;
    this.killfeed = this.killfeed.filter((k) => this.time - k.at < 8);
  }
  private updatePlayer(a: Actor, dt: number) {
    let x = 0,
      z = 0;
    if (this.keys.has("KeyW")) z -= 1;
    if (this.keys.has("KeyS")) z += 1;
    if (this.keys.has("KeyA")) x -= 1;
    if (this.keys.has("KeyD")) x += 1;
    if (x || z) {
      const len = Math.hypot(x, z),
        w = WEAPONS[weaponOf(a)],
        speed =
          w.speed *
          (this.scoped ? 0.48 : 1) *
          (this.keys.has("ShiftLeft") ? 0.53 : 1);
      x = (x / len) * speed * dt;
      z = (z / len) * speed * dt;
      this.map.move(
        a.position,
        x * Math.cos(a.yaw) + z * Math.sin(a.yaw),
        z * Math.cos(a.yaw) - x * Math.sin(a.yaw),
      );
      a.moving = true;
    }
    if (this.keys.has("Space") && a.grounded) {
      a.velocityY = 5.4;
      a.grounded = false;
    }
    const w = WEAPONS[weaponOf(a)];
    if (
      (w.automatic ? this.mouseHeld : this.firePressed) &&
      !this.keys.has("KeyE")
    )
      this.shoot(a);
    this.interact(a, this.keys.has("KeyE") && !a.moving, dt);
  }
  private updateBot(a: Actor, dt: number) {
    const b = a.brain;
    b.thinkIn -= dt;
    b.repathIn -= dt;
    b.reaction = Math.max(0, b.reaction - dt);
    if (b.thinkIn <= 0) {
      b.thinkIn = 0.12 + this.random() * 0.08;
      this.think(a);
    }
    const target = b.targetId !== null ? this.actors[b.targetId] : null;
    if (target?.alive && b.state === "engage") {
      const dx = target.position.x - a.position.x,
        dz = target.position.z - a.position.z;
      a.yaw = angleLerp(a.yaw, Math.atan2(-dx, -dz), Math.min(1, dt * 10));
      if (b.reaction <= 0 && b.pause <= 0) {
        if (this.shoot(a, target)) {
          b.burst--;
          if (b.burst <= 0) {
            b.burst = 3 + Math.floor(this.random() * 4);
            b.pause = 0.16 + this.random() * 0.28;
          }
        }
      }
      const mag = a.magazines[weaponOf(a)];
      if (mag && mag.ammo === 0) this.reload(a);
      const strafe = Math.sin(this.time * 1.1 + a.id * 1.7) * 1.05;
      const before = a.position.clone();
      this.map.move(
        a.position,
        Math.cos(a.yaw) * strafe * dt,
        -Math.sin(a.yaw) * strafe * dt,
      );
      a.moving = distance(before, a.position) > 0.003;
      a.actionProgress = 0;
      if (this.bomb.defuserId === a.id) this.bomb.defuserId = null;
      return;
    }
    if (a.hasBomb && this.map.siteAt(a.position.x, a.position.z)) {
      b.state = "plant";
      this.interact(a, true, dt);
      return;
    }
    if (
      a.team === "CT" &&
      this.bomb.state === "planted" &&
      distance(a.position, this.bomb.position) < 2.35 &&
      (this.bomb.defuserId === null || this.bomb.defuserId === a.id)
    ) {
      b.state = "defuse";
      this.interact(a, true, dt);
      return;
    }
    this.interact(a, false, dt);
    const goal = this.botGoal(a);
    if (!goal) return;
    if (
      !b.goal ||
      distance(b.goal, goal) > 2 ||
      b.repathIn <= 0 ||
      (b.pathIndex >= b.path.length && distance(a.position, goal) > 1.3)
    ) {
      b.goal = { ...goal };
      b.path = this.navigation.findPath(a.position, goal);
      b.pathIndex = 0;
      b.repathIn = 2.5 + this.random();
    }
    while (
      b.pathIndex < b.path.length &&
      distance(a.position, b.path[b.pathIndex]) < 0.52
    )
      b.pathIndex++;
    const waypoint = b.path[b.pathIndex];
    if (!waypoint) return;
    const dx = waypoint.x - a.position.x,
      dz = waypoint.z - a.position.z,
      len = Math.hypot(dx, dz);
    a.yaw = angleLerp(a.yaw, Math.atan2(-dx, -dz), Math.min(1, dt * 8));
    const speed =
        WEAPONS[weaponOf(a)].speed * 0.77 * (a.reloadTime > 0 ? 0.65 : 1),
      step = Math.min(len, speed * dt),
      before = { x: a.position.x, z: a.position.z };
    this.map.move(
      a.position,
      (dx / Math.max(0.001, len)) * step,
      (dz / Math.max(0.001, len)) * step,
      ACTOR_RADIUS,
    );
    a.moving = distance(before, a.position) > 0.003;
    if (!a.moving && len > 0.6) b.stuckTime += dt;
    else b.stuckTime = 0;
    if (b.stuckTime > 0.5) {
      b.repathIn = 0;
      b.path = [];
      b.stuckTime = 0;
    }
  }
  private think(a: Actor) {
    const b = a.brain,
      eye = { x: a.position.x, y: a.position.y + EYE, z: a.position.z };
    let best: Actor | null = null,
      bestDistance = Infinity;
    for (const enemy of this.actors) {
      if (!enemy.alive || enemy.team === a.team) continue;
      const d = distance(a.position, enemy.position);
      if (d > 58) continue;
      const facing =
        (-Math.sin(a.yaw) * (enemy.position.x - a.position.x) -
          Math.cos(a.yaw) * (enemy.position.z - a.position.z)) /
        Math.max(0.01, d);
      if (d > 9 && facing < -0.18 && b.targetId !== enemy.id) continue;
      const target = {
        x: enemy.position.x,
        y: enemy.position.y + 1.3,
        z: enemy.position.z,
      };
      if (!this.map.visible(eye, target)) continue;
      if (a.team === this.config.team) this.markSpotted(enemy);
      if (d < bestDistance) {
        best = enemy;
        bestDistance = d;
      }
    }
    if (best) {
      if (b.targetId !== best.id) b.reaction = 0.22 + this.random() * 0.38;
      b.targetId = best.id;
      b.state = "engage";
      b.lastSeen = { x: best.position.x, z: best.position.z };
    } else {
      b.targetId = null;
      b.state =
        this.bomb.state === "dropped" && a.team === "T"
          ? "recover"
          : this.bomb.state === "planted"
            ? a.team === "T"
              ? "guard"
              : "defuse"
            : a.team === "T"
              ? "advance"
              : "patrol";
    }
  }
  private botGoal(a: Actor): Vec2 | null {
    const b = a.brain;
    if (this.bomb.state === "dropped" && a.team === "T") {
      const nearest = this.actors
        .filter((t) => t.alive && t.team === "T")
        .sort(
          (u, v) =>
            distance(u.position, this.bomb.position) -
            distance(v.position, this.bomb.position),
        )[0];
      if (nearest === a) return this.bomb.position;
    }
    if (this.bomb.state === "planted") {
      if (a.team === "CT") return this.bomb.position;
      const angle = ((a.id % 5) * Math.PI * 2) / 5;
      return {
        x: this.bomb.position.x + Math.cos(angle) * 4.5,
        z: this.bomb.position.z + Math.sin(angle) * 4.5,
      };
    }
    const route = b.route;
    if (
      b.routeIndex < route.length &&
      distance(a.position, route[b.routeIndex]) < 1.25
    ) {
      b.routeIndex++;
      b.repathIn = 0;
    }
    if (b.routeIndex < route.length) return route[b.routeIndex];
    if (a.team === "CT") {
      b.routeIndex = route.length > 1 ? 1 : 0;
      return route[b.routeIndex];
    }
    if (a.hasBomb) return SITES[this.round % 2 === 1 ? "A" : "B"];
    const site = SITES[this.round % 2 === 1 ? "A" : "B"];
    return {
      x: site.x + Math.sin(a.id * 2.3 + this.round) * 4,
      z: site.z + Math.cos(a.id * 2.3 + this.round) * 4,
    };
  }
  private shoot(a: Actor, target?: Actor): boolean {
    const id = weaponOf(a),
      w = WEAPONS[id],
      mag = a.magazines[id];
    if (
      this.phase !== "live" ||
      !a.alive ||
      a.cooldown > 0 ||
      a.reloadTime > 0 ||
      a.actionProgress > 0
    )
      return false;
    if (id !== "knife" && (!mag || mag.ammo <= 0)) {
      if (a.controlled) {
        this.audio.empty();
        a.cooldown = 0.18;
      }
      this.reload(a);
      return false;
    }
    if (mag && id !== "knife") mag.ammo--;
    a.cooldown = w.interval;
    const origin = a.position.clone().addScaledVector(UP, EYE),
      direction = new THREE.Vector3();
    if (target) {
      const head = this.random() < 0.07;
      direction
        .copy(target.position)
        .addScaledVector(UP, head ? 1.68 : 1.22)
        .sub(origin)
        .normalize();
      const spread = 0.007 + distance(a.position, target.position) * 0.0002;
      direction.x += (this.random() - 0.5) * spread * 2;
      direction.y += (this.random() - 0.5) * spread * 1.4;
      direction.z += (this.random() - 0.5) * spread * 2;
      direction.normalize();
    } else {
      const pitch = a.pitch + a.recoil;
      direction.set(
        -Math.sin(a.yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(a.yaw) * Math.cos(pitch),
      );
      const spread =
        (id === "awp" && this.scoped ? 0.0005 : w.spread) +
        (a.moving ? 0.01 : 0) +
        a.heat * (id === "awp" ? 0.002 : 0.006);
      direction.x += (this.random() - 0.5) * spread * 2;
      direction.y += (this.random() - 0.5) * spread * 2;
      direction.z += (this.random() - 0.5) * spread * 2;
      direction.normalize();
      a.recoil = Math.min(0.23, a.recoil + w.recoil);
      a.yaw += (this.random() - 0.5) * w.recoil * 0.22;
      this.viewShotAt = this.time;
    }
    a.heat = Math.min(2, a.heat + 0.24);
    a.model.flash.visible = id !== "knife";
    a.model.flash.userData.until = this.time + 0.055;
    const d = distance(a.position, this.viewed.position),
      relative = a.position.clone().sub(this.viewed.position),
      right = new THREE.Vector3(
        Math.cos(this.viewed.yaw),
        0,
        -Math.sin(this.viewed.yaw),
      );
    if (d < 90)
      this.audio.fire(
        id,
        a.controlled ? 0 : d,
        clamp(relative.normalize().dot(right) * 0.75, -1, 1),
      );
    const wallDistance = this.map.rayDistance(origin, direction, w.range);
    this.raycaster.set(origin, direction);
    this.raycaster.far = wallDistance;
    const hitMeshes = this.actors
      .filter((other) => other.alive && other.team !== a.team)
      .flatMap((other) => other.model.hitMeshes);
    for (const other of this.actors)
      if (other.alive) other.model.group.updateMatrixWorld(true);
    const hits = this.raycaster.intersectObjects(hitMeshes, false);
    let end = origin.clone().addScaledVector(direction, wallDistance);
    if (hits.length) {
      const hit = hits[0],
        victim = this.actors[hit.object.userData.actorId as number],
        zone = hit.object.userData.zone as HitZone;
      end = hit.point;
      const damage = damageFor(id, zone, victim.armor, hit.distance);
      victim.health = Math.max(0, victim.health - damage.health);
      victim.armor = Math.max(0, victim.armor - damage.armor);
      if (a.team === this.config.team) this.markSpotted(victim);
      if (victim.controlled) this.damageAt = this.time;
      if (a.controlled) {
        this.hitAt = this.time;
        this.audio.hit(zone === "head");
      }
      // Receiving fire turns a bot toward its attacker, subject to an unobstructed sight line.
      if (!victim.controlled) {
        victim.yaw =
          Math.atan2(
            a.position.x - victim.position.x,
            a.position.z - victim.position.z,
          ) + Math.PI;
        victim.brain.thinkIn = 0;
      }
      this.impact(end, true);
      if (victim.health <= 0) this.kill(a, victim, id, zone === "head");
    } else if (wallDistance < w.range) this.impact(end, false);
    if (id !== "knife") {
      const from = origin
        .clone()
        .add(new THREE.Vector3(0.18, -0.15, -0.4).applyAxisAngle(UP, a.yaw));
      const geometry = new THREE.BufferGeometry().setFromPoints([from, end]),
        line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: id === "awp" ? 0xffe8aa : 0xf3c879,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
          }),
        );
      this.addEffect(line, 0.065);
    }
    return true;
  }
  private kill(
    killer: Actor,
    victim: Actor,
    weapon: WeaponId,
    headshot: boolean,
  ) {
    victim.alive = false;
    victim.health = 0;
    victim.deaths++;
    victim.actionProgress = 0;
    killer.kills++;
    victim.model.flash.visible = false;
    if (victim.hasBomb) this.dropBomb(victim);
    if (this.bomb.defuserId === victim.id) this.bomb.defuserId = null;
    this.killfeed.unshift({
      id: ++this.killId,
      killer: killer.controlled ? "你" : killer.name,
      victim: victim.controlled ? "你" : victim.name,
      team: killer.team,
      weapon,
      headshot,
      at: this.time,
      player: killer.controlled,
    });
    this.killfeed = this.killfeed.slice(0, 5);
    if (killer.controlled) {
      this.killAt = this.time;
      this.audio.kill();
    }
    if (victim.controlled) {
      this.scoped = false;
      this.mouseHeld = false;
      this.showNotice("你已阵亡 · E 接管队友 / ← → 切换视角", 6);
    }
    this.ensureLivingSpectator();
    this.publish();
  }
  private interact(a: Actor, held: boolean, dt: number) {
    const site = this.map.siteAt(a.position.x, a.position.z);
    const canPlant =
      a.hasBomb && site && this.bomb.state === "carried" && a.grounded;
    const canDefuse =
      a.team === "CT" &&
      this.bomb.state === "planted" &&
      distance(a.position, this.bomb.position) < 2.6 &&
      a.grounded &&
      Math.abs(a.position.y - this.bomb.position.y) < 2.1;
    if (a.controlled) {
      if (canPlant) this.action = held ? "正在安放 C4" : "按住 E 安放 C4";
      else if (canDefuse) this.action = held ? "正在拆除 C4" : "按住 E 拆除 C4";
      else if (a.hasBomb) this.action = "携带 C4 · 前往 A / B 点";
    }
    if (!held || (!canPlant && !canDefuse)) {
      a.actionProgress = 0;
      if (this.bomb.defuserId === a.id) this.bomb.defuserId = null;
      return;
    }
    if (
      canDefuse &&
      this.bomb.defuserId !== null &&
      this.bomb.defuserId !== a.id
    ) {
      a.actionProgress = 0;
      return;
    }
    const duration = canPlant ? PLANT_TIME : DEFUSE_TIME;
    if (canDefuse) this.bomb.defuserId = a.id;
    a.actionProgress += dt / duration;
    if (a.actionProgress < 1) return;
    a.actionProgress = 0;
    if (canPlant) {
      a.hasBomb = false;
      this.bomb.state = "planted";
      this.bomb.position.copy(a.position);
      this.bomb.carrierId = null;
      this.bomb.site = site;
      this.bomb.timer = BOMB_TIME;
      this.bomb.beepIn = 0.2;
      this.audio.plant();
      this.showNotice(`C4 已安放在 ${site} 点 · 40 秒后引爆`, 5);
      for (const bot of this.actors) bot.brain.repathIn = 0;
    } else {
      this.bomb.state = "defused";
      this.bomb.defuserId = null;
      this.audio.defuse();
      this.endRound("CT", "C4 已成功拆除");
    }
    this.publish();
  }
  private dropBomb(a: Actor) {
    if (!a.hasBomb) return;
    a.hasBomb = false;
    a.actionProgress = 0;
    this.bomb.state = "dropped";
    this.bomb.carrierId = null;
    this.bomb.position.copy(a.position);
    this.bomb.position.y = this.map.support(
      a.position.x,
      a.position.z,
      a.position.y,
    );
    this.droppedBy = a.id;
    this.pickupAfter = this.time + (a.alive ? 1.8 : 0);
    if (a.controlled) this.showNotice("C4 已丢弃 · T 队员靠近即可拾取");
    for (const bot of this.actors) bot.brain.repathIn = 0;
  }
  private updateBomb(dt: number) {
    if (this.bomb.state === "carried") {
      const a = this.actors[this.bomb.carrierId!];
      this.bomb.position.copy(a.position);
      if (!a.alive) this.dropBomb(a);
    }
    if (this.bomb.state === "dropped") {
      const pickup = this.actors.find(
        (a) =>
          a.alive &&
          a.team === "T" &&
          (a.id !== this.droppedBy || this.time >= this.pickupAfter) &&
          distance(a.position, this.bomb.position) < 1.25,
      );
      if (pickup) {
        pickup.hasBomb = true;
        this.bomb.state = "carried";
        this.bomb.carrierId = pickup.id;
        if (pickup.controlled)
          this.showNotice("已拾取 C4 · 在 A / B 点按住 E 安放");
      }
    }
    if (this.bomb.state !== "planted") return;
    this.bomb.timer = Math.max(0, this.bomb.timer - dt);
    this.bomb.beepIn -= dt;
    if (this.bomb.beepIn <= 0) {
      this.bomb.beepIn = Math.max(0.12, (this.bomb.timer / 40) * 0.95);
      this.audio.beep(distance(this.bomb.position, this.viewed.position));
    }
    if (this.bomb.timer <= 0) {
      this.bomb.state = "exploded";
      this.audio.explode(distance(this.bomb.position, this.viewed.position));
      const boom = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 12),
        new THREE.MeshBasicMaterial({
          color: 0xffc46c,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        }),
      );
      boom.position.copy(this.bomb.position).addScaledVector(UP, 0.6);
      this.addEffect(boom, 1.3, undefined, true);
      for (const a of this.actors)
        if (a.alive && distance(a.position, this.bomb.position) < 19) {
          a.alive = false;
          a.health = 0;
          a.deaths++;
        }
      this.endRound("T", "C4 已引爆");
    }
  }
  private checkWinner() {
    if (this.phase !== "live") return;
    const t = this.actors.some((a) => a.team === "T" && a.alive),
      ct = this.actors.some((a) => a.team === "CT" && a.alive);
    if (!ct) this.endRound("T", "反恐精英已被全数消灭");
    else if (!t && this.bomb.state !== "planted")
      this.endRound("CT", "进攻方已被全数消灭");
    else if (this.timer <= 0 && this.bomb.state !== "planted")
      this.endRound("CT", "回合时间结束 · 成功守住目标");
  }
  private endRound(team: Team, reason: string) {
    if (this.phase === "ended") return;
    this.phase = "ended";
    this.winner = team;
    this.winReason = reason;
    this.endIn = 5;
    if (team === "T") this.scoreT++;
    else this.scoreCT++;
    this.audio.round(team === this.config.team);
    this.action = "";
    this.publish();
  }
  private markSpotted(a: Actor) {
    this.intel.set(a.id, {
      x: a.position.x,
      z: a.position.z,
      until: this.time + 2,
    });
    a.seenUntil = this.time + 2;
  }
  private updateVision(dt: number) {
    this.playerVisionIn -= dt;
    if (this.playerVisionIn > 0) return;
    this.playerVisionIn = 0.12;
    const viewer = this.viewed;
    if (!viewer?.alive) return;
    const origin = viewer.position.clone().addScaledVector(UP, EYE);
    for (const a of this.actors) {
      if (!a.alive || a.team === this.config.team) continue;
      const delta = a.position.clone().sub(viewer.position),
        d = delta.length();
      const facing =
        (-Math.sin(viewer.yaw) * delta.x - Math.cos(viewer.yaw) * delta.z) /
        Math.max(0.01, d);
      if (
        d < 60 &&
        facing > 0.5 &&
        this.map.visible(origin, a.position.clone().addScaledVector(UP, 1.3))
      )
        this.markSpotted(a);
    }
  }
  private syncActor(a: Actor) {
    a.model.group.position.copy(a.position);
    if (a.alive) {
      a.model.group.rotation.set(0, a.yaw, 0);
      for (let i = 0; i < 2; i++)
        a.model.legs[i].rotation.x = a.moving
          ? Math.sin(a.walkCycle + i * Math.PI) * 0.48
          : 0;
    }
    a.model.flash.visible =
      a.alive && this.time < (a.model.flash.userData.until ?? 0);
    a.model.group.updateMatrixWorld(true);
  }
  private updateCamera(dt: number) {
    this.ensureLivingSpectator();
    const a = this.viewed;
    if (!a) return;
    const bob =
      a.moving && a.grounded ? Math.sin(a.walkCycle * 1.9) * 0.025 : 0;
    this.world.camera.position
      .copy(a.position)
      .add(new THREE.Vector3(0, a.alive ? EYE + bob : 0.5, 0));
    this.world.camera.rotation.order = "YXZ";
    this.world.camera.rotation.set(
      a.pitch + (a.controlled ? a.recoil : 0),
      a.yaw,
      0,
    );
    const fov = this.scoped ? 26 : 80;
    this.world.camera.fov +=
      (fov - this.world.camera.fov) * Math.min(1, dt * 14);
    this.world.camera.updateProjectionMatrix();
    for (const actor of this.actors)
      actor.model.group.visible = actor.id !== a.id;
    this.updateViewWeapon();
    if (this.viewWeapon) {
      this.viewWeapon.group.scale.setScalar(0.82);
      const kick = Math.max(0, 1 - (this.time - this.viewShotAt) / 0.15),
        reload =
          a.reloadTime > 0
            ? Math.sin((1 - a.reloadTime / a.reloadTotal) * Math.PI)
            : 0;
      this.viewWeapon.group.position.set(
        0.27 + (a.moving ? Math.sin(a.walkCycle) * 0.009 : 0),
        -0.27 -
          reload * 0.22 +
          (a.moving ? Math.abs(Math.cos(a.walkCycle)) * 0.008 : 0),
        -0.78 + kick * 0.045,
      );
      this.viewWeapon.group.rotation.set(
        kick * 0.07 - reload * 0.38,
        reload * 0.3,
        -reload * 0.38,
      );
      if (weaponOf(a) === "knife")
        this.viewWeapon.group.rotation.y = -0.2 + kick * 0.65;
      this.viewWeapon.flash.visible =
        weaponOf(a) !== "knife" && this.time - this.viewShotAt < 0.048;
    }
  }
  private updateBombModel() {
    const b = this.bomb;
    this.bombModel.group.visible =
      b.state === "dropped" || b.state === "planted" || b.state === "defused";
    this.bombModel.group.position.copy(b.position);
    this.bombModel.led.visible =
      b.state === "planted" &&
      Math.sin(this.time * (4 + (40 - b.timer) * 0.25)) > 0.1;
  }
  private impact(point: THREE.Vector3, hit: boolean) {
    for (let i = 0; i < 3; i++) {
      const spark = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.035, 0.035),
        new THREE.MeshBasicMaterial({
          color: hit ? 0xc88b6a : 0xe9d7aa,
          transparent: true,
        }),
      );
      spark.position.copy(point);
      this.addEffect(
        spark,
        0.22,
        new THREE.Vector3(
          (this.random() - 0.5) * 2,
          this.random() * 1.8,
          (this.random() - 0.5) * 2,
        ),
      );
    }
  }
  private addEffect(
    object: THREE.Object3D,
    life: number,
    velocity?: THREE.Vector3,
    grow = false,
  ) {
    if (this.effects.length > 130) {
      const old = this.effects.shift();
      if (old) this.removeEffect(old);
    }
    this.world.scene.add(object);
    this.effects.push({ object, life, total: life, velocity, grow });
  }
  private updateEffects(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      e.life -= dt;
      if (e.life <= 0) {
        this.removeEffect(e);
        this.effects.splice(i, 1);
        continue;
      }
      if (e.velocity) {
        e.object.position.addScaledVector(e.velocity, dt);
        e.velocity.y -= dt * 4;
      }
      if (e.grow) e.object.scale.setScalar(1 + (1 - e.life / e.total) * 34);
      if (e.object instanceof THREE.Mesh || e.object instanceof THREE.Line) {
        const mat = e.object.material as THREE.Material & { opacity: number };
        mat.opacity = e.life / e.total;
      }
    }
  }
  private removeEffect(e: Effect) {
    this.world.scene.remove(e.object);
    if (e.object instanceof THREE.Mesh || e.object instanceof THREE.Line) {
      e.object.geometry.dispose();
      (e.object.material as THREE.Material).dispose();
    }
  }
  private ensureLivingSpectator() {
    if (this.player.alive || this.actors[this.spectatorId]?.alive) return;
    const next = this.actors.find(
      (a) => a.alive && a.team === this.config.team,
    );
    if (next) {
      this.spectatorId = next.id;
      this.updateViewWeapon();
    }
  }
  cycleSpectator = (direction: number) => {
    if (this.player.alive) return;
    const candidates = this.actors.filter(
      (a) => a.alive && a.team === this.config.team,
    );
    if (!candidates.length) return;
    const index = candidates.findIndex((a) => a.id === this.spectatorId);
    this.spectatorId =
      candidates[
        (index + direction + candidates.length) % candidates.length
      ].id;
    this.updateViewWeapon();
    this.publish();
  };
  takeOver = () => {
    if (this.player.alive || !this.actors[this.spectatorId]?.alive) return;
    this.player.controlled = false;
    this.controlledId = this.spectatorId;
    this.player.controlled = true;
    this.player.actionProgress = 0;
    this.scoped = false;
    this.keys.clear();
    this.firePressed = false;
    this.mouseHeld = false;
    this.showNotice(`已接管 ${this.player.name} · 继续战斗`);
    this.updateViewWeapon();
    this.publish();
  };
  private showNotice(message: string, duration = 3) {
    this.notice = message;
    this.noticeUntil = this.time + duration;
  }
  private publish() {
    if (!this.actors.length) return;
    const a = this.player,
      v = this.viewed ?? a,
      id = weaponOf(v),
      mag = v.magazines[id];
    this.snapshot = {
      screen: this.screen,
      locked: this.locked,
      phase: this.phase,
      round: this.round,
      timer: this.phase === "ended" ? this.endIn : this.timer,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      aliveT: this.actors.filter((a) => a.alive && a.team === "T").length,
      aliveCT: this.actors.filter((a) => a.alive && a.team === "CT").length,
      team: this.config.team,
      name: a.name,
      health: v.health,
      armor: v.armor,
      alive: a.alive,
      spectating: v.name,
      weapon: id,
      slot: v.slot,
      ammo: mag?.ammo ?? 0,
      reserve: mag?.reserve ?? 0,
      reloading: v.reloadTime > 0 ? v.reloadTime / v.reloadTotal : 0,
      loadout: { ...v.loadout },
      scoped: this.scoped,
      heat: a.heat,
      hitAt: this.hitAt,
      killAt: this.killAt,
      damageAt: this.damageAt,
      action: this.action,
      actionProgress: a.actionProgress,
      notice: this.notice,
      noticeUntil: this.noticeUntil,
      bombState: this.bomb.state,
      bombTimer: this.bomb.timer,
      hasBomb: a.hasBomb,
      location: this.map.location(v.position.x, v.position.z),
      killfeed: [...this.killfeed],
      roster: this.actors.map((a) => ({
        id: a.id,
        name: a.name,
        team: a.team,
        health: a.health,
        armor: a.armor,
        alive: a.alive,
        kills: a.kills,
        deaths: a.deaths,
        weapon: weaponOf(a),
        bomb: a.hasBomb,
        controlled: a.controlled,
      })),
      winner: this.winner,
      winReason: this.winReason,
      time: this.time,
      fps: this.fps,
      muted: this.audio.muted,
      pistolRound: this.pistolRound,
      armory: this.armory,
      scoreboard: this.scoreboard,
    };
    for (const listener of this.listeners) listener();
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationId);
    this.abort.abort();
    if (document.pointerLockElement === this.world.renderer.domElement)
      document.exitPointerLock();
    for (const e of this.effects) this.removeEffect(e);
    this.audio.dispose();
    this.world.dispose();
    this.listeners.clear();
  }
}

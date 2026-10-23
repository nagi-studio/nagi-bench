import * as THREE from "three";
import { createWorld, createActor, createGun, type World } from "./scene";
import { SynthAudio } from "./audio";
import { Navigation, SITES, moveCircle, location, canStand } from "./map";
import { WEAPONS, gun, damageFor } from "./weapons";
import type {
  Actor,
  Bomb,
  HitZone,
  Kill,
  Settings,
  Snapshot,
  Team,
  WeaponId,
} from "./types";

const CT_NAMES = ["Atlas", "Nomad", "Ghost", "Viper", "Echo"];
const T_NAMES = ["Sable", "Havoc", "Rook", "Mirage", "Flint"];
const distance = (a: { x: number; z: number }, b: { x: number; z: number }) =>
  Math.hypot(a.x - b.x, a.z - b.z);
const angleDiff = (a: number, b: number) =>
  Math.atan2(Math.sin(a - b), Math.cos(a - b));
export class GameEngine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(76, 1, 0.045, 250);
  viewScene = new THREE.Scene();
  viewCamera = new THREE.PerspectiveCamera(68, 1, 0.02, 5);
  viewGun = new THREE.Group();
  flash: THREE.Mesh;
  world: World;
  nav = new Navigation();
  audio = new SynthAudio();
  actors: Actor[] = [];
  playerId = 5;
  phase: Snapshot["phase"] = "menu";
  locked = false;
  settings: Settings = {
    team: "T",
    pistol: false,
    primary: "ak47",
    secondary: "glock",
  };
  bomb: Bomb = {
    state: "carried",
    carrier: 5,
    x: 0,
    z: 0,
    time: 40,
    progress: 0,
    actor: null,
    site: "",
  };
  score = { T: 0, CT: 0 };
  round = 1;
  clock = 115;
  elapsed = 0;
  winner: Team | null = null;
  reason = "";
  endTime = 0;
  keys = new Set<string>();
  mouseDown = false;
  trigger = false;
  pitch = 0;
  yaw = 0;
  recoil = 0;
  spread = 0;
  scoped = false;
  hit = 0;
  headshot = false;
  hurt = 0;
  actionLabel = "";
  notice = "";
  noticeEnd = 0;
  kills: Kill[] = [];
  raf = 0;
  last = 0;
  accumulator = 0;
  snapshotAt = 0;
  beepAt = 0;
  fps = 60;
  frameCount = 0;
  fpsAt = 0;
  ray = new THREE.Raycaster();
  effects: {
    mesh: THREE.Object3D;
    life: number;
    max: number;
    grow?: boolean;
  }[] = [];
  private disposed = false;
  private currentViewWeapon: WeaponId | null = null;
  private listeners: (() => void)[] = [];
  onSnapshot: (snapshot: Snapshot) => void;
  constructor(
    public host: HTMLDivElement,
    onSnapshot: (snapshot: Snapshot) => void,
  ) {
    this.onSnapshot = onSnapshot;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    const gl = this.renderer.getContext(),
      debug = gl.getExtension("WEBGL_debug_renderer_info");
    const software =
      debug &&
      /swiftshader|llvmpipe|software/i.test(
        String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)),
      );
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, software ? 0.75 : 1.6),
    );
    this.renderer.shadowMap.enabled = !software;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    host.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color("#b9cbd0");
    this.scene.fog = new THREE.Fog("#c5c8bb", 55, 155);
    this.scene.add(new THREE.HemisphereLight("#e6f1f4", "#85735a", 2.3));
    const sun = new THREE.DirectionalLight("#fff0ce", 3.4);
    sun.position.set(-23, 48, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -58;
    sun.shadow.camera.right = 58;
    sun.shadow.camera.top = 58;
    sun.shadow.camera.bottom = -58;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 120;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    this.scene.add(sun);
    this.scene.add(sun.target);
    this.world = createWorld(this.scene);
    this.viewScene.add(new THREE.HemisphereLight("#f3f0de", "#5d6555", 2.8));
    const light = new THREE.DirectionalLight("#fff0d0", 3);
    light.position.set(-2, 3, 1);
    this.viewScene.add(light);
    this.viewScene.add(this.viewGun);
    this.flash = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.065, 0),
      new THREE.MeshBasicMaterial({
        color: "#ffe7a0",
        transparent: true,
        opacity: 0.9,
      }),
    );
    this.flash.visible = false;
    this.viewScene.add(this.flash);
    this.setupActors();
    this.bind();
    this.resize();
    this.emit();
    this.raf = requestAnimationFrame(this.frame);
  }
  get player() {
    return this.actors[this.playerId];
  }
  get activeGun() {
    return (
      this.player.guns.find((g) => WEAPONS[g.id].slot === this.player.slot) ||
      this.player.guns[0]
    );
  }
  private listen(target: EventTarget, event: string, handler: EventListener) {
    target.addEventListener(event, handler);
    this.listeners.push(() => target.removeEventListener(event, handler));
  }
  bind() {
    this.listen(window, "resize", () => this.resize());
    this.listen(document, "pointerlockchange", () => {
      this.locked = document.pointerLockElement === this.renderer.domElement;
      if (!this.locked) {
        this.keys.clear();
        this.mouseDown = false;
        this.trigger = false;
      }
      this.emit();
    });
    this.listen(document, "mousemove", (e) => {
      if (!this.locked || !this.player.alive) return;
      const m = e as MouseEvent;
      const s = this.scoped ? 0.00075 : 0.002;
      this.yaw -= m.movementX * s;
      this.pitch = THREE.MathUtils.clamp(
        this.pitch - m.movementY * s,
        -1.42,
        1.42,
      );
    });
    this.listen(window, "keydown", (e) => {
      const k = e as KeyboardEvent;
      if (k.code === "Escape" && this.locked) {
        document.exitPointerLock();
        return;
      }
      if (
        [
          "Space",
          "Tab",
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "Digit1",
          "Digit2",
          "Digit3",
        ].includes(k.code) &&
        this.phase !== "menu"
      )
        k.preventDefault();
      this.keys.add(k.code);
      if (k.repeat || this.phase !== "playing") return;
      if (k.code === "KeyR") this.reload(this.player);
      if (k.code === "KeyF" && !this.player.alive) this.takeover();
      if (["Digit1", "Digit2", "Digit3"].includes(k.code))
        this.switchWeapon(Number(k.code.slice(-1)) as 1 | 2 | 3);
      if (k.code === "KeyG") this.dropBomb();
    });
    this.listen(window, "keyup", (e) =>
      this.keys.delete((e as KeyboardEvent).code),
    );
    this.listen(this.renderer.domElement, "mousedown", (e) => {
      const m = e as MouseEvent;
      if (!this.locked || this.phase !== "playing") return;
      if (m.button === 0) {
        this.mouseDown = true;
        this.trigger = true;
      }
      if (m.button === 2 && this.activeGun.id === "awp") {
        this.scoped = !this.scoped;
        this.audio.scope();
        this.emit();
      }
    });
    this.listen(window, "mouseup", (e) => {
      if ((e as MouseEvent).button === 0) this.mouseDown = false;
    });
    this.listen(this.renderer.domElement, "contextmenu", (e) =>
      e.preventDefault(),
    );
    this.listen(this.renderer.domElement, "wheel", (e) => {
      if (!this.locked) return;
      const slots = this.player.guns.map((g) => WEAPONS[g.id].slot);
      const i = slots.indexOf(this.player.slot);
      this.switchWeapon(
        slots[
          (i + ((e as WheelEvent).deltaY > 0 ? 1 : slots.length - 1)) %
            slots.length
        ],
      );
    });
    this.listen(window, "blur", () => {
      this.keys.clear();
      this.mouseDown = false;
    });
  }
  resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.viewCamera.aspect = w / h;
    this.viewCamera.updateProjectionMatrix();
  }
  setupActors() {
    for (const a of this.actors) {
      this.scene.remove(a.model);
      a.model.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    }
    this.actors = [];
    for (let i = 0; i < 10; i++) {
      const team: Team = i < 5 ? "CT" : "T",
        index = i % 5;
      const primary: WeaponId =
        index === 3 ? "awp" : team === "CT" ? "m4a4" : "ak47";
      const guns = this.settings.pistol
        ? [gun(team === "CT" ? "usp" : "glock"), gun("knife")]
        : [gun(primary), gun(team === "CT" ? "usp" : "glock"), gun("knife")];
      const model = createActor(team, guns[0].id);
      const pos =
        team === "T"
          ? new THREE.Vector3(-5 + index * 3.8, 0, 29 + (index % 2) * 2)
          : new THREE.Vector3(-10 + index * 5, 0, -20 + (index % 2) * 3);
      const bSite = index % 3 === 0;
      const route =
        team === "T"
          ? bSite
            ? [
                { x: -26, z: 25 },
                { x: -27, z: 1 },
                { x: -28, z: -17 },
              ]
            : index % 3 === 1
              ? [
                  { x: 34, z: 24 },
                  { x: 35, z: 3 },
                  { x: 35, z: -18 },
                  { x: 28, z: -20 },
                ]
              : [
                  { x: 1, z: 15 },
                  { x: 15, z: 11 },
                  { x: 15, z: -9 },
                  { x: 27, z: -20 },
                ]
          : bSite
            ? [
                { x: -18, z: -20 },
                { x: -28, z: -17 },
              ]
            : index % 3 === 1
              ? [
                  { x: 25, z: -20 },
                  { x: 35, z: -9 },
                ]
              : [
                  { x: 1, z: -17 },
                  { x: 0, z: -5 },
                ];
      const a: Actor = {
        id: i,
        name: (team === "CT" ? CT_NAMES : T_NAMES)[index],
        team,
        pos,
        yaw: team === "T" ? 0 : Math.PI,
        hp: 100,
        armor: this.settings.pistol ? 0 : 100,
        alive: true,
        velY: 0,
        guns,
        slot: this.settings.pistol ? 2 : 1,
        shotAt: -10,
        reloadEnd: 0,
        kills: 0,
        deaths: 0,
        ...model,
        state: "advance",
        path: [],
        target: null,
        thinkAt: 0,
        pathAt: 0,
        stepAt: 0,
        lastSeen: 0,
        reactionAt: 0,
        objective: route[0],
        route,
        routeIndex: 0,
        action: 0,
        moving: false,
      };
      for (const h of a.hitboxes) h.userData.actorId = i;
      a.model.position.copy(pos);
      a.model.rotation.y = a.yaw;
      this.scene.add(a.model);
      this.actors.push(a);
    }
  }
  start(settings: Settings) {
    this.audio.unlock();
    this.settings = { ...settings };
    this.score = { T: 0, CT: 0 };
    this.round = 1;
    for (const a of this.actors) {
      a.kills = 0;
      a.deaths = 0;
    }
    this.startRound();
    this.lock();
  }
  startRound() {
    const stats = this.actors.map((a) => ({
      kills: a.kills,
      deaths: a.deaths,
    }));
    this.setupActors();
    for (const a of this.actors) {
      a.kills = stats[a.id]?.kills || 0;
      a.deaths = stats[a.id]?.deaths || 0;
    }
    this.playerId = this.settings.team === "T" ? 5 : 0;
    const p = this.player;
    if (!this.settings.pistol) {
      p.guns = [
        gun(this.settings.primary),
        gun(this.settings.secondary),
        gun("knife"),
      ];
      this.replaceActorGun(p);
    }
    this.phase = "playing";
    this.clock = 115;
    this.elapsed = 0;
    this.winner = null;
    this.reason = "";
    this.endTime = 0;
    this.kills = [];
    this.yaw = p.team === "T" ? 0 : Math.PI;
    this.pitch = 0;
    this.recoil = 0;
    this.spread = 0;
    this.trigger = false;
    this.actionLabel = "";
    this.scoped = false;
    this.hurt = 0;
    this.hit = 0;
    this.keys.clear();
    this.mouseDown = false;
    const carrier = 5 + ((this.round - 1) % 5);
    this.bomb = {
      state: "carried",
      carrier,
      x: this.actors[carrier].pos.x,
      z: this.actors[carrier].pos.z,
      time: 40,
      progress: 0,
      actor: null,
      site: "",
    };
    this.audio.round();
    this.notice = this.settings.pistol
      ? "PISTOL ROUND · No armor. Make every shot count."
      : "Bomb carrier marked. Hold E at a site to plant.";
    this.noticeEnd = 5;
    this.emit();
  }
  lock() {
    this.audio.unlock();
    const result = this.renderer.domElement.requestPointerLock();
    if (result && typeof result.catch === "function")
      void result.catch(() => {
        this.notice = "Click Resume to capture your mouse.";
        this.emit();
      });
  }
  menu() {
    this.phase = "menu";
    this.locked = false;
    document.exitPointerLock();
    this.world.bombModel.visible = false;
    this.emit();
  }
  switchWeapon(slot: 1 | 2 | 3) {
    if (
      !this.player.alive ||
      !this.player.guns.some((g) => WEAPONS[g.id].slot === slot)
    )
      return;
    this.player.slot = slot;
    this.player.reloadEnd = 0;
    this.scoped = false;
    this.replaceActorGun(this.player);
    this.emit();
  }
  replaceActorGun(a: Actor) {
    a.model.remove(a.weapon);
    a.weapon.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    a.weapon = createGun(a.guns.find((g) => WEAPONS[g.id].slot === a.slot)!.id);
    a.weapon.position.set(0.12, 1.16, -0.44);
    a.model.add(a.weapon);
  }
  dropBomb() {
    if (this.bomb.state === "carried" && this.bomb.carrier === this.playerId) {
      const x = this.player.pos.x - Math.sin(this.yaw) * 1.1,
        z = this.player.pos.z - Math.cos(this.yaw) * 1.1;
      this.bomb.state = "dropped";
      this.bomb.carrier = null;
      this.bomb.x = canStand(x, z, 0.1) ? x : this.player.pos.x;
      this.bomb.z = canStand(x, z, 0.1) ? z : this.player.pos.z;
      this.notice = "C4 dropped. Teammates can recover it.";
      this.noticeEnd = this.elapsed + 3;
    }
  }
  reload(a: Actor) {
    const g = a.guns.find((g) => WEAPONS[g.id].slot === a.slot)!;
    const w = WEAPONS[g.id];
    if (
      a.reloadEnd ||
      g.id === "knife" ||
      g.ammo >= w.magazine ||
      g.reserve <= 0 ||
      !a.alive
    )
      return;
    a.reloadEnd = this.elapsed + w.reload;
    if (a.id === this.playerId) {
      this.audio.reload();
      this.scoped = false;
    }
  }
  takeover() {
    const candidates = this.actors.filter(
      (a) => a.team === this.settings.team && a.alive && a.id !== this.playerId,
    );
    if (!candidates.length) return;
    const a = candidates.sort((a, b) => a.id - b.id)[0];
    this.playerId = a.id;
    this.yaw = a.yaw;
    this.pitch = 0;
    this.recoil = 0;
    this.scoped = false;
    a.path = [];
    a.action = 0;
    this.notice = `Controlling ${a.name}`;
    this.noticeEnd = this.elapsed + 3;
    this.emit();
  }
  private frame = (time: number) => {
    if (this.disposed) return;
    const dt = Math.min((time - (this.last || time)) / 1000, 0.1);
    this.last = time;
    this.frameCount++;
    if (time - this.fpsAt > 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (time - this.fpsAt));
      this.fpsAt = time;
      this.frameCount = 0;
    }
    if (this.phase !== "menu" && this.locked) {
      this.accumulator += dt;
      while (this.accumulator >= 1 / 60) {
        this.step(1 / 60);
        this.accumulator -= 1 / 60;
      }
    }
    this.render(dt, time / 1000);
    if (time - this.snapshotAt > 75) {
      this.emit();
      this.snapshotAt = time;
    }
    this.raf = requestAnimationFrame(this.frame);
  };
  step(dt: number) {
    this.elapsed += dt;
    this.hit = Math.max(0, this.hit - dt);
    this.hurt = Math.max(0, this.hurt - dt);
    this.recoil *= Math.exp(-dt * 7);
    this.spread *= Math.exp(-dt * 3.7);
    if (this.phase === "ended") {
      this.endTime -= dt;
      if (this.endTime <= 0) {
        this.round++;
        this.startRound();
      }
      this.updateEffects(dt);
      return;
    }
    this.clock = Math.max(0, this.clock - dt);
    for (const a of this.actors)
      if (a.alive) {
        if (a.reloadEnd && this.elapsed >= a.reloadEnd) {
          const g = a.guns.find((g) => WEAPONS[g.id].slot === a.slot)!;
          const count = Math.min(WEAPONS[g.id].magazine - g.ammo, g.reserve);
          g.ammo += count;
          g.reserve -= count;
          a.reloadEnd = 0;
        }
        if (a.id === this.playerId) this.updatePlayer(dt);
        else this.updateBot(a, dt);
        a.model.position.copy(a.pos);
        a.model.rotation.y = a.yaw;
        a.limbs.forEach(
          (l, i) =>
            (l.rotation.x = a.moving
              ? Math.sin(this.elapsed * 11 + i * Math.PI) * 0.45
              : 0),
        );
      }
    this.updateBomb(dt);
    this.checkVictory();
    this.updateEffects(dt);
  }
  updatePlayer(dt: number) {
    const p = this.player;
    p.yaw = this.yaw;
    let dx = 0,
      dz = 0;
    if (this.keys.has("KeyW")) {
      dx -= Math.sin(this.yaw);
      dz -= Math.cos(this.yaw);
    }
    if (this.keys.has("KeyS")) {
      dx += Math.sin(this.yaw);
      dz += Math.cos(this.yaw);
    }
    if (this.keys.has("KeyD")) {
      dx += Math.cos(this.yaw);
      dz -= Math.sin(this.yaw);
    }
    if (this.keys.has("KeyA")) {
      dx -= Math.cos(this.yaw);
      dz += Math.sin(this.yaw);
    }
    const len = Math.hypot(dx, dz),
      crouch = this.keys.has("ShiftLeft");
    p.moving = len > 0;
    const speed =
      (this.activeGun.id === "knife" ? 6.8 : 5.2) *
      (this.scoped ? 0.48 : 1) *
      (crouch ? 0.5 : 1);
    if (len) {
      moveCircle(p.pos, (dx / len) * speed * dt, (dz / len) * speed * dt);
      if (this.elapsed > p.stepAt && p.pos.y < 0.05) {
        this.audio.step(crouch ? 0.08 : 0.22);
        p.stepAt = this.elapsed + 0.37;
      }
    }
    if (this.keys.has("Space") && p.pos.y <= 0.001) {
      p.velY = 5.9;
      this.keys.delete("Space");
    }
    p.velY -= 17 * dt;
    p.pos.y = Math.max(0, p.pos.y + p.velY * dt);
    if (p.pos.y === 0) p.velY = 0;
    if (
      this.mouseDown &&
      (WEAPONS[this.activeGun.id].automatic || this.trigger) &&
      !this.keys.has("KeyE")
    )
      this.shoot(p);
    this.trigger = false;
  }
  visible(a: Actor, b: Actor) {
    const delta = b.pos.clone().sub(a.pos),
      d = delta.length();
    if (d > 48) return false;
    const facing = new THREE.Vector3(-Math.sin(a.yaw), 0, -Math.cos(a.yaw));
    if (d > 7 && facing.dot(delta.clone().normalize()) < -0.15) return false;
    return this.lineOfSight(
      a.pos.clone().add(new THREE.Vector3(0, 1.58, 0)),
      b.pos.clone().add(new THREE.Vector3(0, 1.2, 0)),
    );
  }
  lineOfSight(from: THREE.Vector3, to: THREE.Vector3) {
    const delta = to.clone().sub(from);
    this.ray.set(from, delta.clone().normalize());
    this.ray.far = delta.length();
    return this.ray.intersectObjects(this.world.occluders, false).length === 0;
  }
  updateBot(a: Actor, dt: number) {
    if (this.elapsed >= a.thinkAt) {
      const targets = this.actors
        .filter((b) => b.alive && b.team !== a.team && this.visible(a, b))
        .sort((b, c) => distance(a.pos, b.pos) - distance(a.pos, c.pos));
      const id = targets[0]?.id ?? null;
      if (a.target !== id && id !== null)
        a.reactionAt = this.elapsed + 0.28 + Math.random() * 0.45;
      a.target = id;
      a.thinkAt = this.elapsed + 0.16 + Math.random() * 0.12;
    }
    const target = a.target !== null ? this.actors[a.target] : null;
    if (target?.alive && this.visible(a, target)) {
      a.state = "engage";
      a.action = 0;
      a.moving = false;
      a.yaw = Math.atan2(-(target.pos.x - a.pos.x), -(target.pos.z - a.pos.z));
      if (
        this.elapsed > a.reactionAt &&
        Math.sin(this.elapsed * 2.5 + a.id) > 0.0
      ) {
        const g = a.guns.find((g) => WEAPONS[g.id].slot === a.slot)!;
        if (!g.ammo) this.reload(a);
        else this.shoot(a, target);
      }
      // Small, collision-constrained lateral steps make firefights less static.
      if (distance(a.pos, target.pos) > 7) {
        const side = Math.sin(this.elapsed * 1.6 + a.id) > 0 ? 1 : -1;
        moveCircle(
          a.pos,
          Math.cos(a.yaw) * side * dt * 0.8,
          -Math.sin(a.yaw) * side * dt * 0.8,
        );
      }
      return;
    }
    a.target = null;
    const bomb = this.bomb;
    if (a.team === "T" && bomb.state === "dropped") {
      a.state = "recover";
      a.objective = { x: bomb.x, z: bomb.z };
    } else if (
      a.team === "T" &&
      bomb.state === "carried" &&
      bomb.carrier === a.id
    ) {
      a.state = "advance";
      const site = SITES[a.route[a.route.length - 1].x < 0 ? 1 : 0];
      if (distance(a.pos, site) < site.r) {
        a.state = "plant";
        a.moving = false;
        this.interact(a, dt);
        return;
      }
      this.advanceRoute(a, site);
    } else if (bomb.state === "planted") {
      if (a.team === "CT") {
        a.state = "defuse";
        a.objective = { x: bomb.x, z: bomb.z };
        if (distance(a.pos, bomb) < 2) {
          a.moving = false;
          this.interact(a, dt);
          return;
        }
      } else {
        a.state = "guard";
        const p = {
          x: bomb.x + Math.sin(a.id * 2.3) * 4,
          z: bomb.z + Math.cos(a.id * 2.3) * 4,
        };
        a.objective = canStand(p.x, p.z) ? p : { x: bomb.x, z: bomb.z };
      }
    } else {
      a.state = "advance";
      if (
        a.team === "CT" &&
        this.elapsed > 23 &&
        a.routeIndex >= a.route.length
      ) {
        a.objective = a.id % 2 ? { x: 0, z: 10 } : { x: -27, z: 6 };
      } else this.advanceRoute(a, a.route[a.route.length - 1]);
    }
    a.action = 0;
    if (
      this.elapsed > a.pathAt ||
      (!a.path.length && distance(a.pos, a.objective) > 1.5)
    ) {
      a.path = this.nav.find(a.pos.x, a.pos.z, a.objective.x, a.objective.z);
      a.pathAt = this.elapsed + 1.5 + Math.random() * 0.5;
      if (a.path.length && distance(a.pos, a.path[0]) < 0.6) a.path.shift();
    }
    while (a.path.length && distance(a.pos, a.path[0]) < 0.28) a.path.shift();
    const waypoint = a.path[0];
    a.moving = !!waypoint;
    if (waypoint) {
      const dx = waypoint.x - a.pos.x,
        dz = waypoint.z - a.pos.z,
        l = Math.hypot(dx, dz);
      a.yaw += angleDiff(Math.atan2(-dx, -dz), a.yaw) * Math.min(1, dt * 12);
      const speed = 3.4;
      moveCircle(
        a.pos,
        (dx / l) * Math.min(speed * dt, l),
        (dz / l) * Math.min(speed * dt, l),
        0.34,
      );
      if (distance(a.pos, this.player.pos) < 12 && this.elapsed > a.stepAt) {
        this.audio.step(0.08 / (1 + distance(a.pos, this.player.pos) * 0.2));
        a.stepAt = this.elapsed + 0.44;
      }
    } else if (a.state === "guard") {
      a.yaw += dt * 0.35;
    }
  }
  advanceRoute(a: Actor, fallback: { x: number; z: number }) {
    while (
      a.routeIndex < a.route.length &&
      distance(a.pos, a.route[a.routeIndex]) < 2
    )
      a.routeIndex++;
    a.objective = a.route[a.routeIndex] || fallback;
  }
  shoot(a: Actor, target?: Actor) {
    const g = a.guns.find((g) => WEAPONS[g.id].slot === a.slot)!;
    const w = WEAPONS[g.id];
    if (
      a.reloadEnd ||
      this.elapsed - a.shotAt < w.interval ||
      !a.alive ||
      a.action > 0
    )
      return;
    if (w.id !== "knife" && g.ammo <= 0) {
      this.reload(a);
      return;
    }
    if (w.id !== "knife") g.ammo--;
    a.shotAt = this.elapsed;
    const mine = a.id === this.playerId;
    const origin = a.pos.clone().add(new THREE.Vector3(0, 1.58, 0));
    let dir: THREE.Vector3;
    if (mine) {
      this.camera.rotation.set(this.pitch + this.recoil, this.yaw, 0, "YXZ");
      dir = new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation);
      const spread =
        w.id === "awp" && this.scoped
          ? 0.0009
          : w.spread + this.spread + (a.moving ? 0.018 : 0);
      dir
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread,
          ),
        )
        .normalize();
      this.recoil = Math.min(0.25, this.recoil + w.recoil);
      this.spread = Math.min(0.09, this.spread + w.recoil * 0.7);
      if (w.id === "awp") this.scoped = false;
    } else {
      if (!target) return;
      const aim = target.pos
        .clone()
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.48,
            1.08 + (Math.random() - 0.4) * 0.7,
            (Math.random() - 0.5) * 0.4,
          ),
        );
      dir = aim.sub(origin).normalize();
      dir
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.018,
            (Math.random() - 0.5) * 0.018,
            0,
          ),
        )
        .normalize();
    }
    this.audio.fire(g.id, mine ? 0 : distance(a.pos, this.player.pos));
    this.scene.updateMatrixWorld(true);
    this.ray.set(origin, dir);
    this.ray.far = w.range;
    const wall = this.ray.intersectObjects(this.world.occluders, false)[0];
    const wallDist = wall?.distance ?? w.range;
    const hits = this.ray.intersectObjects(
      this.actors
        .filter((b) => b.alive && b.id !== a.id)
        .flatMap((b) => b.hitboxes),
      false,
    );
    const hit = hits.find((h) => h.distance < wallDist);
    let end = origin.clone().addScaledVector(dir, Math.min(wallDist, 55));
    if (hit) {
      end = hit.point;
      const victim = this.actors[hit.object.userData.actorId as number];
      if (victim.team !== a.team) {
        const zone = hit.object.userData.zone as HitZone;
        const dmg = damageFor(g.id, zone, victim.armor);
        victim.hp = Math.max(0, victim.hp - dmg.health);
        victim.armor = Math.max(0, victim.armor - dmg.armor);
        if (mine) {
          this.hit = 0.18;
          this.headshot = zone === "head";
          this.audio.hit(this.headshot);
        }
        if (victim.id === this.playerId) this.hurt = 0.35;
        if (victim.hp <= 0) this.kill(a, victim, g.id, zone === "head");
      }
    }
    if (w.id !== "knife") {
      const start = mine
        ? origin.clone().add(new THREE.Vector3(0.2, -0.13, 0))
        : a.pos
            .clone()
            .add(new THREE.Vector3(0, 1.24, 0))
            .addScaledVector(dir, 0.5);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([start, end]),
        new THREE.LineBasicMaterial({
          color: mine ? "#fbe5a2" : "#ffd793",
          transparent: true,
          opacity: 0.55,
        }),
      );
      this.scene.add(line);
      this.effects.push({ mesh: line, life: 0.055, max: 0.055 });
      if (!hit && wall) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 5, 5),
          new THREE.MeshBasicMaterial({
            color: "#b5a184",
            transparent: true,
            opacity: 0.5,
          }),
        );
        puff.position.copy(end);
        this.scene.add(puff);
        this.effects.push({ mesh: puff, life: 0.25, max: 0.25, grow: true });
      }
    }
  }
  kill(killer: Actor, victim: Actor, weapon: WeaponId, head: boolean) {
    victim.alive = false;
    victim.deaths++;
    victim.action = 0;
    killer.kills++;
    victim.model.rotation.z = Math.PI * 0.48;
    victim.model.position.y = 0.28;
    this.kills.unshift({
      id: Math.random(),
      killer: killer.id === this.playerId ? "You" : killer.name,
      victim: victim.id === this.playerId ? "You" : victim.name,
      team: killer.team,
      weapon,
      head,
      time: this.elapsed,
    });
    this.kills = this.kills.slice(0, 5);
    if (this.bomb.carrier === victim.id && this.bomb.state === "carried") {
      this.bomb.state = "dropped";
      this.bomb.carrier = null;
      this.bomb.x = victim.pos.x;
      this.bomb.z = victim.pos.z;
    }
    if (killer.id === this.playerId) this.audio.kill();
    if (victim.id === this.playerId) {
      this.mouseDown = false;
      this.scoped = false;
      this.notice = "Operator down. Press F to take over a teammate.";
      this.noticeEnd = this.elapsed + 12;
    }
  }
  interact(a: Actor, dt: number) {
    if (
      a.team === "T" &&
      this.bomb.state === "carried" &&
      this.bomb.carrier === a.id
    ) {
      const site = SITES.find((s) => distance(a.pos, s) < s.r);
      if (!site || a.moving || a.pos.y > 0.1) {
        a.action = 0;
        return;
      }
      a.action += dt;
      this.bomb.actor = a.id;
      this.bomb.progress = a.action / 3.2;
      if (a.id === this.playerId)
        this.actionLabel = `PLANTING AT SITE ${site.name}`;
      if (a.action >= 3.2) {
        this.bomb = {
          state: "planted",
          carrier: null,
          x: a.pos.x,
          z: a.pos.z,
          time: 40,
          progress: 0,
          actor: null,
          site: site.name,
        };
        a.action = 0;
        this.audio.plant();
        this.notice = `C4 planted at ${site.name}. 40 seconds to detonation.`;
        this.noticeEnd = this.elapsed + 5;
        this.beepAt = this.elapsed;
        for (const b of this.actors) b.pathAt = 0;
      }
    } else if (
      a.team === "CT" &&
      this.bomb.state === "planted" &&
      distance(a.pos, this.bomb) < 2
    ) {
      if (a.moving || a.pos.y > 0.1) {
        a.action = 0;
        return;
      }
      if (
        this.bomb.actor !== null &&
        this.bomb.actor !== a.id &&
        this.actors[this.bomb.actor].alive &&
        this.actors[this.bomb.actor].action > 0
      )
        return;
      a.action += dt;
      this.bomb.actor = a.id;
      this.bomb.progress = a.action / 8;
      if (a.id === this.playerId) this.actionLabel = "DEFUSING C4";
      if (a.action >= 8) {
        this.bomb.state = "defused";
        this.bomb.progress = 1;
        this.audio.defuse();
        this.finish("CT", "Bomb successfully defused");
      }
    } else a.action = 0;
  }
  updateBomb(dt: number) {
    const b = this.bomb;
    this.actionLabel = "";
    const p = this.player;
    if (p.alive) {
      if (this.keys.has("KeyE")) this.interact(p, dt);
      else p.action = 0;
    }
    if (
      b.actor !== null &&
      (!this.actors[b.actor].alive || this.actors[b.actor].action === 0)
    ) {
      b.actor = null;
      b.progress = 0;
    }
    if (b.state === "carried" && b.carrier !== null) {
      b.x = this.actors[b.carrier].pos.x;
      b.z = this.actors[b.carrier].pos.z;
    }
    if (b.state === "dropped") {
      const a = this.actors.find(
        (a) => a.alive && a.team === "T" && distance(a.pos, b) < 1.3,
      );
      if (a) {
        b.state = "carried";
        b.carrier = a.id;
        this.notice = `${a.id === this.playerId ? "You" : a.name} recovered C4`;
        this.noticeEnd = this.elapsed + 3;
      }
    }
    if (b.state === "planted") {
      b.time = Math.max(0, b.time - dt);
      if (this.elapsed > this.beepAt) {
        this.audio.beep();
        this.beepAt = this.elapsed + Math.max(0.15, b.time / 40);
      }
      if (b.time <= 0) {
        b.state = "exploded";
        this.audio.explosion();
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(1, 16, 16),
          new THREE.MeshBasicMaterial({
            color: "#ffae57",
            transparent: true,
            opacity: 0.8,
          }),
        );
        m.position.set(b.x, 0.5, b.z);
        this.scene.add(m);
        this.effects.push({ mesh: m, life: 1.3, max: 1.3, grow: true });
        this.hurt = 1;
        this.finish("T", "C4 detonated");
      }
    }
    this.world.bombModel.visible = ["dropped", "planted", "defused"].includes(
      b.state,
    );
    this.world.bombModel.position.set(b.x, 0.05, b.z);
    this.world.bombLight.visible =
      b.state === "planted" && Math.sin(this.elapsed * 10) > 0;
  }
  checkVictory() {
    if (this.phase !== "playing") return;
    const ct = this.actors.filter((a) => a.alive && a.team === "CT").length,
      t = this.actors.filter((a) => a.alive && a.team === "T").length;
    if (!ct) this.finish("T", "All counter-terrorists eliminated");
    else if (!t && this.bomb.state !== "planted")
      this.finish("CT", "All terrorists eliminated");
    else if (this.clock <= 0 && this.bomb.state !== "planted")
      this.finish("CT", "Time expired · Bomb sites secured");
  }
  finish(team: Team, reason: string) {
    if (this.phase !== "playing") return;
    this.phase = "ended";
    this.winner = team;
    this.reason = reason;
    this.score[team]++;
    this.endTime = 7;
    this.audio.round();
    this.mouseDown = false;
    this.emit();
  }
  updateEffects(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      e.life -= dt;
      const mat = (e.mesh as THREE.Mesh).material as THREE.Material & {
        opacity: number;
      };
      if (mat) mat.opacity = Math.max(0, e.life / e.max) * 0.65;
      if (e.grow) e.mesh.scale.multiplyScalar(1 + dt * (e.max > 1 ? 5 : 3));
      if (e.life <= 0) {
        this.scene.remove(e.mesh);
        (e.mesh as THREE.Mesh).geometry.dispose();
        mat?.dispose();
        this.effects.splice(i, 1);
      }
    }
  }
  render(dt: number, time: number) {
    if (this.phase === "menu") {
      this.camera.position.set(35.1 + Math.sin(time * 0.07) * 0.35, 2.05, 2.5);
      this.camera.lookAt(25.5, 3, -23);
      this.camera.fov = 72;
      this.camera.updateProjectionMatrix();
      for (const a of this.actors) a.model.visible = true;
    } else {
      const p = this.player,
        bob =
          p.moving && p.pos.y < 0.05 ? Math.sin(this.elapsed * 11) * 0.025 : 0;
      this.camera.position.copy(p.pos).add(new THREE.Vector3(0, 1.62 + bob, 0));
      this.camera.rotation.set(this.pitch + this.recoil, this.yaw, 0, "YXZ");
      const target = this.scoped ? 25 : 76;
      this.camera.fov = THREE.MathUtils.lerp(
        this.camera.fov,
        target,
        Math.min(1, dt * 16),
      );
      this.camera.updateProjectionMatrix();
      for (const a of this.actors)
        a.model.visible = a.id !== this.playerId || !a.alive;
      if (!p.alive) this.camera.position.y = 1.1;
    }
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    if (this.phase !== "menu" && this.player.alive && !this.scoped) {
      const id = this.activeGun.id;
      if (id !== this.currentViewWeapon) {
        for (const c of [...this.viewGun.children]) {
          this.viewGun.remove(c);
          c.traverse((o) => {
            if (o instanceof THREE.Mesh) o.geometry.dispose();
          });
        }
        this.viewGun.add(createGun(id, true));
        this.currentViewWeapon = id;
      }
      const p = this.player,
        reload = p.reloadEnd
          ? Math.sin(
              (1 - (p.reloadEnd - this.elapsed) / WEAPONS[id].reload) * Math.PI,
            )
          : 0;
      const bob = p.moving
        ? Math.sin(this.elapsed * 9) * 0.009
        : Math.sin(time * 1.8) * 0.003;
      this.viewGun.position.set(
        0.23 + bob,
        -0.265 - reload * 0.18,
        -0.68 + this.recoil * 0.35,
      );
      this.viewGun.rotation.set(
        this.recoil * 2 - reload * 0.5,
        -reload * 0.5,
        Math.sin(time * 1.8) * 0.003 + reload * 0.25,
      );
      this.flash.visible = id !== "knife" && this.elapsed - p.shotAt < 0.045;
      this.flash.position.set(
        0.23,
        -0.225,
        id === "awp" ? -1.58 : id === "usp" ? -1.04 : -1.46,
      );
      this.flash.scale.set(1 + Math.random(), 0.65 + Math.random(), 1.4);
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.viewScene, this.viewCamera);
    }
  }
  emit() {
    if (!this.actors.length) return;
    const p = this.player,
      g = this.activeGun;
    this.onSnapshot({
      phase: this.phase,
      locked: this.locked,
      team: this.settings.team,
      round: this.round,
      clock: this.clock,
      score: { ...this.score },
      hp: p.hp,
      armor: p.armor,
      ammo: g.ammo,
      reserve: g.reserve,
      weapon: g.id,
      guns: p.guns.map((g) => g.id),
      slot: p.slot,
      reload: p.reloadEnd
        ? Math.max(0, 1 - (p.reloadEnd - this.elapsed) / WEAPONS[g.id].reload)
        : 0,
      alive: p.alive,
      ctAlive: this.actors.filter((a) => a.team === "CT" && a.alive).length,
      tAlive: this.actors.filter((a) => a.team === "T" && a.alive).length,
      kills: this.kills.filter((k) => this.elapsed - k.time < 8),
      bomb: { ...this.bomb },
      action: p.action,
      actionLabel: this.actionLabel,
      location: location(p.pos.x, p.pos.z),
      spread: this.spread,
      scoped: this.scoped,
      hit: this.hit,
      headshot: this.headshot,
      hurt: this.hurt,
      winner: this.winner,
      reason: this.reason,
      endTime: this.endTime,
      carrier: this.bomb.carrier === p.id && this.bomb.state === "carried",
      actors: this.actors.map((a) => ({
        id: a.id,
        name: a.id === this.playerId ? "You" : a.name,
        team: a.team,
        x: a.pos.x,
        z: a.pos.z,
        yaw: a.yaw,
        alive: a.alive,
        seen:
          a.team === p.team ||
          (a.alive &&
            this.actors.some(
              (t) => t.team === p.team && t.alive && this.visible(t, a),
            )),
        kills: a.kills,
        deaths: a.deaths,
        hp: a.hp,
      })),
      playerId: this.playerId,
      fps: this.fps,
      notice: this.elapsed < this.noticeEnd ? this.notice : "",
      elapsed: this.elapsed,
    });
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const remove of this.listeners) remove();
    if (document.pointerLockElement === this.renderer.domElement)
      document.exitPointerLock();
    this.audio.dispose();
    const materials = new Set<THREE.Material>();
    for (const scene of [this.scene, this.viewScene])
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material])
            materials.add(m);
        }
      });
    for (const collider of this.world.occluders)
      if (collider instanceof THREE.Mesh) collider.geometry.dispose();
    for (const m of materials) {
      for (const v of Object.values(m))
        if (v instanceof THREE.Texture) v.dispose();
      m.dispose();
    }
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

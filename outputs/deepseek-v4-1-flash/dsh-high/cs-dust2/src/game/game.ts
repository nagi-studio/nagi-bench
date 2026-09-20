import * as THREE from 'three';
import {
  AI_FOV,
  AI_VIEW_DIST,
  BOMB_INTERACT_RANGE,
  BOMB_TIMER,
  DEFUSE_TIME,
  FREEZE_TIME,
  PLANT_TIME,
  ROUND_TIME,
  TICK_DT,
  KNIFE_RANGE,
} from '../engine/constants';
import { clamp, pick } from '../core/math';
import { InputManager } from '../engine/input';
import { sound } from '../audio/audio';
import { lineOfSight, rayAABB, rayWorld } from '../physics/collision';
import { NavGrid, type NavPoint } from '../ai/navigation';
import { buildMapData, siteAt, type AABB, type MapData } from '../world/mapLayout';
import { buildMapVisuals, type MapVisuals } from '../world/mapMesh';
import { Actor } from './actor';
import { BotBrain } from './bot';
import { ViewModel } from '../weapons/viewModel';
import { damageAtRange, fireInterval, REGION_MULT, type HitRegion, type WeaponDef } from '../weapons/weapons';
import {
  emptyInput,
  initialHud,
  type ActorInput,
  type BombHud,
  type HudState,
  type KillFeedEntry,
  type MinimapEntity,
  type RoundPhase,
  type Team,
} from './types';

const T_NAMES = ['ZywOo', 's1mple', 'NiKo', 'device', 'dupreeh'];
const CT_NAMES = ['ropz', 'sh1ro', 'Ax1Le', 'huNter', 'broky'];

interface BombState extends Omit<BombHud, 'carrier'> {
  carrier: Actor | null;
  planting: Actor | null;
  defusing: Actor | null;
  plantedAt: number;
  beepAt: number;
  dropX: number;
  dropZ: number;
}

interface Tracer {
  mesh: THREE.Mesh;
  until: number;
}

export type HudListener = (hud: HudState) => void;

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly map: MapData;
  readonly nav: NavGrid;
  readonly colliders: AABB[];
  readonly actors: Actor[] = [];
  readonly input = new InputManager();
  readonly viewModel = new ViewModel();

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mapVisuals: MapVisuals;

  private raf = 0;
  private lastFrame = 0;
  private accumulator = 0;
  time = 0;
  private running = false;
  private started = false;
  paused = false;

  playerActor: Actor | null = null;
  private homeActor: Actor;

  phase: RoundPhase = 'freeze';
  private phaseEndTime = 0;
  private roundTime = ROUND_TIME;
  scoreCT = 0;
  scoreT = 0;
  roundNumber = 0;
  private roundSite: 'A' | 'B' = 'A';

  private bomb: BombState = this.freshBomb();
  private killfeed: KillFeedEntry[] = [];
  private killfeedId = 1;

  private spottedAt = new Map<number, number>();
  private visionCache = new Map<number, { t: number; target: Actor | null }>();

  private possessionPending = false;
  private possessionAt = 0;

  private tracerPool: THREE.Mesh[] = [];
  private tracers: Tracer[] = [];
  private muzzleFlash: THREE.Mesh;
  private muzzleUntil = 0;

  private hud: HudState = initialHud();
  private onHud: HudListener;
  private hudPublishAt = 0;

  private banner = '';
  private damageFlash = 0;
  private hitMarker = 0;
  private fpsSmooth = 60;

  // Reusable scratch vectors (avoid per-frame allocations).
  private tmpA = new THREE.Vector3();
  private tmpB = new THREE.Vector3();
  private tmpC = new THREE.Vector3();
  private tmpD = new THREE.Vector3();
  private tmpRight = new THREE.Vector3();
  private tmpUp = new THREE.Vector3();

  private headless: boolean;

  constructor(canvas: HTMLCanvasElement, onHud: HudListener, options?: { headless?: boolean }) {
    this.canvas = canvas;
    this.onHud = onHud;
    this.headless = !!options?.headless;
    this.map = buildMapData();
    this.nav = new NavGrid(this.map);
    this.colliders = this.map.colliders;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720;

    if (this.headless) {
      const stub = {
        setPixelRatio() {},
        setSize() {},
        render() {},
        dispose() {},
        outputColorSpace: '',
        domElement: canvas,
      };
      this.renderer = stub as unknown as THREE.WebGLRenderer;
    } else {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(vw, vh, false);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xa8c6e0, 70, 175);

    this.camera = new THREE.PerspectiveCamera(75, vw / vh, 0.05, 400);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);
    this.camera.add(this.viewModel.group);

    if (this.headless) {
      this.mapVisuals = { group: new THREE.Group(), dispose: () => undefined };
    } else {
      this.mapVisuals = buildMapVisuals(this.map);
      this.scene.add(this.mapVisuals.group);
    }

    // Muzzle flash billboard attached to the view model.
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffdd88,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.muzzleFlash = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), flashMat);
    this.muzzleFlash.visible = false;
    this.viewModel.muzzle.add(this.muzzleFlash);

    // Tracer pool.
    const tracerGeo = new THREE.BoxGeometry(0.025, 0.025, 1);
    const tracerMat = new THREE.MeshBasicMaterial({
      color: 0xffe6a0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    for (let i = 0; i < 48; i++) {
      const m = new THREE.Mesh(tracerGeo, tracerMat);
      m.visible = false;
      m.frustumCulled = false;
      this.scene.add(m);
      this.tracerPool.push(m);
    }

    this.createActors();
    this.homeActor = this.actors[0];
    this.possess(this.homeActor);

    if (!this.headless && typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      this.input.attach(canvas, (locked) => {
        if (!locked && this.started) {
          this.paused = true;
          this.publishHud(true);
        }
      });
    }

    this.lastFrame = typeof performance !== 'undefined' ? performance.now() : 0;
    this.publishHud(true);
  }

  /** Headless single simulation step (used by automated tests). */
  advance(dt: number) {
    this.fixedUpdate(dt);
  }

  /** Test hook: hand the player's character over to its AI brain. */
  debugMakePlayerBot() {
    if (this.playerActor) this.playerActor.isPlayerControlled = false;
  }

  private freshBomb(): BombState {
    return {
      planted: false,
      timer: 0,
      defuseProgress: 0,
      plantProgress: 0,
      carrier: null,
      site: null,
      x: 0,
      z: 0,
      dropped: false,
      planting: null,
      defusing: null,
      plantedAt: 0,
      beepAt: 0,
      dropX: 0,
      dropZ: 0,
    };
  }

  private createActors() {
    let id = 0;
    for (let i = 0; i < 5; i++) {
      const a = new Actor(id++, T_NAMES[i], 'T');
      a.brain = new BotBrain(a, this);
      this.actors.push(a);
      this.scene.add(a.rig.group);
    }
    for (let i = 0; i < 5; i++) {
      const a = new Actor(id++, CT_NAMES[i], 'CT');
      a.brain = new BotBrain(a, this);
      this.actors.push(a);
      this.scene.add(a.rig.group);
    }
  }

  // ---------------------------------------------------------------- lifecycle

  start() {
    if (this.started) return;
    this.started = true;
    this.running = true;
    this.paused = false;
    this.roundNumber = 0;
    this.scoreCT = 0;
    this.scoreT = 0;
    this.startRound();
    if (this.headless) return;
    this.lastFrame = performance.now();
    this.loop(this.lastFrame);
  }

  setPaused(p: boolean) {
    this.paused = p;
    if (!p) {
      this.lastFrame = performance.now();
      this.input.requestLock();
    }
  }

  private handleResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private loop = (t: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const rawDt = (t - this.lastFrame) / 1000;
    this.lastFrame = t;
    const dt = clamp(rawDt, 0, 0.1);
    this.fpsSmooth += (1 / Math.max(dt, 1e-3) - this.fpsSmooth) * 0.08;

    if (this.running && !this.paused) {
      this.accumulator += dt;
      let steps = 0;
      while (this.accumulator >= TICK_DT && steps < 6) {
        this.fixedUpdate(TICK_DT);
        this.accumulator -= TICK_DT;
        steps++;
      }
      if (steps >= 6) this.accumulator = 0;
    }

    this.render(dt);
    if (this.time >= this.hudPublishAt) {
      this.publishHud();
      this.hudPublishAt = this.time + 1 / 15;
    }
  };

  // ------------------------------------------------------------- round logic

  private startRound() {
    this.roundNumber++;
    this.phase = 'freeze';
    this.phaseEndTime = this.time + FREEZE_TIME;
    this.roundTime = ROUND_TIME;
    this.roundSite = Math.random() < 0.5 ? 'A' : 'B';
    this.bomb = this.freshBomb();
    this.killfeed = [];
    this.spottedAt.clear();
    this.possessionPending = false;
    const pistol = this.roundNumber === 1;

    const tSpawns = [...this.map.tSpawns];
    const ctSpawns = [...this.map.ctSpawns];
    this.shuffle(tSpawns);
    this.shuffle(ctSpawns);
    let ti = 0;
    let ci = 0;

    for (const actor of this.actors) {
      const spawn = actor.team === 'T' ? tSpawns[ti++ % tSpawns.length] : ctSpawns[ci++ % ctSpawns.length];
      actor.resetForRound(spawn);
      this.giveLoadout(actor, pistol);
      actor.rig.setTeam(actor.team);
    }

    const ts = this.actors.filter((a) => a.team === 'T');
    const carrier = pick(ts);
    carrier.hasBomb = true;
    this.bomb.carrier = carrier;

    this.possess(this.homeActor);
    this.banner = pistol ? '手枪局 — 第 1 回合' : `第 ${this.roundNumber} 回合`;
    this.publishHud(true);
  }

  private shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  private giveLoadout(actor: Actor, pistol: boolean) {
    if (pistol) {
      actor.armor = 0;
      actor.helmet = false;
      actor.giveWeapon(actor.team === 'T' ? 'glock' : 'usp', 'secondary');
    } else {
      actor.armor = 100;
      actor.helmet = true;
      const roll = Math.random();
      if (actor.team === 'T') {
        actor.giveWeapon(roll < 0.2 ? 'awp' : 'ak47', 'primary');
        actor.giveWeapon(Math.random() < 0.25 ? 'deagle' : 'glock', 'secondary');
      } else {
        actor.giveWeapon(roll < 0.2 ? 'awp' : 'm4a4', 'primary');
        actor.giveWeapon(Math.random() < 0.25 ? 'deagle' : 'usp', 'secondary');
      }
    }
    actor.equipBest(this.time);
    actor.rig.setWeapon(actor.currentDef());
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.phaseEndTime = this.time + 4.5;
    if (winner === 'CT') this.scoreCT++;
    else this.scoreT++;
    this.banner = `${winner === 'CT' ? 'CT' : 'T'} 获胜 — ${reason}`;
    sound.win(winner === 'CT');
    this.publishHud(true);
  }

  private checkRoundEnd() {
    if (this.phase !== 'live') return;
    const aliveCT = this.actors.filter((a) => a.team === 'CT' && a.alive).length;
    const aliveT = this.actors.filter((a) => a.team === 'T' && a.alive).length;
    if (this.bomb.planted) {
      if (aliveCT === 0) this.endRound('T', 'CT 被全部消灭');
      return;
    }
    if (aliveT === 0 && aliveCT > 0) {
      this.endRound('CT', 'T 被全部消灭');
      return;
    }
    if (aliveCT === 0 && aliveT > 0) {
      this.endRound('T', 'CT 被全部消灭');
      return;
    }
    if (this.roundTime <= 0) {
      this.endRound('CT', '时间耗尽');
    }
  }

  // -------------------------------------------------------------- fixed step

  private fixedUpdate(dt: number) {
    this.time += dt;

    // Mouse look (player).
    const look = this.input.consumeLook();
    if (this.playerActor && this.playerActor.alive) {
      const sens = this.input.sensitivity * (this.playerActor.scoped ? 0.4 : 1);
      this.playerActor.yaw -= look.dx * sens;
      this.playerActor.pitch = clamp(this.playerActor.pitch - look.dy * sens, -1.5, 1.5);
      this.viewModel.addLookDelta(look.dx, look.dy);
    }

    // Phase timers.
    if (this.phase === 'freeze' && this.time >= this.phaseEndTime) {
      this.phase = 'live';
      this.banner = '';
    } else if (this.phase === 'over' && this.time >= this.phaseEndTime) {
      this.startRound();
    }
    if (this.phase === 'live') this.roundTime = Math.max(0, this.roundTime - dt);

    if (this.bomb.planted && this.phase !== 'over') {
      this.bomb.timer -= dt;
      if (this.bomb.timer <= 0) {
        this.explodeBomb();
      } else if (this.time >= this.bomb.beepAt) {
        sound.plantTick();
        this.bomb.beepAt = this.time + clamp(this.bomb.timer / 40, 0.12, 1.0);
      }
    }

    const frozen = this.phase !== 'live';
    const raw = this.input.buildInput();
    const playerInput: ActorInput = frozen ? emptyInput() : raw;

    for (const actor of this.actors) {
      if (!actor.alive) continue;

      let ai: ActorInput;
      if (actor.isPlayerControlled) {
        ai = playerInput;
      } else if (!frozen && actor.brain) {
        (actor.brain as BotBrain).think(dt);
        ai = (actor.brain as BotBrain).getInput();
      } else {
        ai = emptyInput();
      }

      if (actor.isPlayerControlled && !frozen) {
        if (this.input.wasPressed('Digit1')) this.equipPlayer(actor, 'primary');
        if (this.input.wasPressed('Digit2')) this.equipPlayer(actor, 'secondary');
        if (this.input.wasPressed('Digit3')) this.equipPlayer(actor, 'knife');
      }

      // Objective override: a bot holding the bomb inside a site, or a CT
      // standing on a planted bomb, commits to plant / defuse above all else.
      if (!actor.isPlayerControlled && !frozen) this.botObjectiveOverride(actor, ai);

      this.updateScope(actor);
      this.updateReload(actor);

      const res = actor.updateMovement(dt, ai, this.colliders);
      this.handleFootsteps(actor, res.moved, res.landed);
      this.handleFiring(actor, ai);
      this.handleBombInteraction(actor, ai, dt);

      const def = actor.currentDef();
      if (def) {
        actor.recoverRecoil(dt, def.recoilRecover);
        const floor = actor.scoped && def.scopedSpread !== undefined ? def.scopedSpread : def.spreadBase;
        actor.spread = Math.max(floor, actor.spread - def.spreadRecover * dt);
      }

      const speed = actor.horizontalSpeed();
      actor.syncRig(dt, clamp(speed / 6, 0, 1.2), speed > 0.5);
    }

    // Bomb pickup / timers.
    this.updateDroppedBomb();
    this.updatePlayerVision();

    // Player death handling.
    if (this.playerActor && !this.playerActor.alive && !this.possessionPending) {
      this.possessionPending = true;
      this.possessionAt = this.time + 0.7;
    }
    if (this.possessionPending && this.time >= this.possessionAt) {
      this.possessionPending = false;
      const mate = this.actors.find((a) => a.alive && a.team === (this.playerActor?.team ?? 'T') && a !== this.playerActor);
      if (mate) this.possess(mate);
    }

    this.checkRoundEnd();
    this.updateTracers();
    this.damageFlash = Math.max(0, this.damageFlash - dt * 2.2);
    this.hitMarker = Math.max(0, this.hitMarker - dt * 4);
    this.input.endFrame();
  }

  private handleFootsteps(actor: Actor, moved: number, landed: boolean) {
    const speed = actor.horizontalSpeed();
    if (landed) {
      if (this.nearPlayer(actor, 22)) sound.jump();
      return;
    }
    if (!actor.onGround || speed < 1.2) {
      actor.stepAccum = 0;
      return;
    }
    actor.stepAccum += moved;
    const stride = actor.crouching ? 3.0 : 2.1;
    if (actor.stepAccum >= stride) {
      actor.stepAccum = 0;
      if (this.nearPlayer(actor, 18)) sound.footstep();
    }
  }

  private nearPlayer(actor: Actor, dist: number): boolean {
    if (!this.playerActor) return true;
    if (actor.isPlayerControlled) return true;
    return actor.pos.distanceToSquared(this.playerActor.pos) < dist * dist;
  }

  private updateScope(actor: Actor) {
    const def = actor.currentDef();
    if (!def?.scoped) {
      actor.scoped = false;
      return;
    }
    if (actor.isPlayerControlled) {
      if (this.input.scopePressed && this.time >= actor.equipEndTime && !actor.reloading) {
        actor.scoped = !actor.scoped;
        if (actor.scoped) {
          actor.spread = def.scopedSpread ?? def.spreadBase;
          sound.zoom();
        }
      }
    }
  }

  private updateReload(actor: Actor) {
    if (actor.reloading && this.time >= actor.reloadEndTime) {
      const w = actor.currentWeapon();
      if (w) {
        const need = w.def.magSize - w.ammo;
        const take = Math.min(need, w.reserve);
        w.ammo += take;
        w.reserve -= take;
      }
      actor.reloading = false;
    }
  }

  private startReload(actor: Actor) {
    const w = actor.currentWeapon();
    if (!w || actor.reloading || w.def.magSize === 0) return;
    if (w.ammo >= w.def.magSize || w.reserve <= 0) return;
    if (this.time < actor.equipEndTime) return;
    actor.reloading = true;
    actor.reloadEndTime = this.time + w.def.reloadTime;
    if (actor.isPlayerControlled) {
      sound.reload();
      this.viewModel.onReload(w.def.reloadTime);
    }
  }

  private handleFiring(actor: Actor, input: ActorInput) {
    const def = actor.currentDef();
    if (!def) return;
    if (input.reload) this.startReload(actor);

    const pressed = actor.isPlayerControlled ? this.input.firePressed : input.fire;
    const wantFire = def.auto ? input.fire : pressed;
    if (!wantFire) return;

    if (!actor.canFire(this.time)) return;
    const w = actor.currentWeapon();
    if (!w) return;

    if (def.kind === 'knife') {
      this.melee(actor);
      return;
    }
    if (w.ammo <= 0) {
      if (actor.isPlayerControlled) sound.emptyClick();
      this.startReload(actor);
      return;
    }
    this.shoot(actor, def);
  }

  private computeSpread(actor: Actor, def: WeaponDef): number {
    const moveFactor = clamp(actor.horizontalSpeed() / Math.max(1, def.moveSpeed), 0, 1.6);
    const air = actor.onGround ? 0 : 0.05;
    const crouch = actor.crouching ? 0.55 : 1;
    return actor.spread * crouch + moveFactor * 0.03 + air;
  }

  private shoot(actor: Actor, def: WeaponDef) {
    const w = actor.currentWeapon();
    if (!w) return;
    const eye = actor.getEyePos(this.tmpA).clone();
    const baseDir = actor.aimDir(this.tmpB).clone();
    const spread = this.computeSpread(actor, def);
    const pellets = def.pellets ?? 1;
    const maxDist = def.kind === 'sniper' ? 220 : def.range * 2.2;

    for (let p = 0; p < pellets; p++) {
      const dir = this.perturbDir(baseDir, spread);
      this.castBullet(actor, def, eye, dir, maxDist);
    }

    w.ammo--;
    actor.nextFireTime = this.time + fireInterval(def);
    actor.spread = Math.min(def.spreadMax, actor.spread + def.spreadPerShot);
    actor.pitch = clamp(actor.pitch + def.recoilKick, -1.5, 1.5);
    actor.recoilDebt += def.recoilKick;
    actor.lastShotAt = this.time;

    if (actor.isPlayerControlled) {
      this.viewModel.onFire(def.kind === 'sniper' ? 1.8 : def.kind === 'pistol' ? 0.7 : 1);
      this.muzzleUntil = this.time + 0.045;
    }
    this.playShotSound(actor, def);
  }

  private playShotSound(actor: Actor, def: WeaponDef) {
    if (!this.nearPlayer(actor, 55)) return;
    const kind = def.kind === 'sniper' ? 'sniper' : def.kind === 'rifle' ? 'rifle' : def.id === 'deagle' ? 'deagle' : 'pistol';
    sound.shot(kind);
  }

  private perturbDir(base: THREE.Vector3, spread: number): THREE.Vector3 {
    if (spread <= 1e-5) return base.clone();
    const up = Math.abs(base.y) > 0.92 ? this.tmpC.set(1, 0, 0) : this.tmpC.set(0, 1, 0);
    this.tmpRight.crossVectors(base, up).normalize();
    this.tmpUp.crossVectors(this.tmpRight, base).normalize();
    const r = spread * Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    return base
      .clone()
      .addScaledVector(this.tmpRight, Math.cos(a) * r)
      .addScaledVector(this.tmpUp, Math.sin(a) * r)
      .normalize();
  }

  private castBullet(actor: Actor, def: WeaponDef, origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number) {
    const worldHit = rayWorld(this.colliders, origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, maxDist);
    let bestT = worldHit ? worldHit.t : maxDist;
    let hitActor: Actor | null = null;
    let hitRegion: HitRegion = 'chest';

    for (const other of this.actors) {
      if (other === actor || !other.alive || other.team === actor.team) continue;
      const hit = this.rayActor(other, origin, dir, bestT);
      if (hit && hit.t < bestT) {
        bestT = hit.t;
        hitActor = other;
        hitRegion = hit.region;
      }
    }

    const end = this.tmpD.copy(origin).addScaledVector(dir, Math.min(bestT, maxDist));
    this.spawnTracer(origin, end);

    if (hitActor) {
      const raw = damageAtRange(def, bestT);
      const regionMult = hitRegion === 'head' ? def.headshotMult : REGION_MULT[hitRegion];
      this.damageActor(hitActor, raw * regionMult, hitRegion, actor, def, hitRegion === 'head');
    }
  }

  private rayActor(
    target: Actor,
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxT: number,
  ): { t: number; region: HitRegion } | null {
    const c = Math.cos(target.yaw);
    const s = Math.sin(target.yaw);
    const dx = origin.x - target.pos.x;
    const dy = origin.y - target.pos.y;
    const dz = origin.z - target.pos.z;
    // world -> local (rotate by -yaw)
    const lox = c * dx - s * dz;
    const loy = dy;
    const loz = s * dx + c * dz;
    const ldx = c * dir.x - s * dir.z;
    const ldy = dir.y;
    const ldz = s * dir.x + c * dir.z;

    let best: { t: number; region: HitRegion } | null = null;
    for (const hb of target.rig.hitboxes) {
      const t = this.rayLocalBox(lox, loy, loz, ldx, ldy, ldz, hb);
      if (t <= maxT && (best === null || t < best.t)) best = { t, region: hb.region };
    }
    return best;
  }

  private rayLocalBox(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    hb: { cx: number; cy: number; cz: number; hx: number; hy: number; hz: number },
  ): number {
    return rayAABB(ox, oy, oz, dx, dy, dz, {
      minX: hb.cx - hb.hx,
      maxX: hb.cx + hb.hx,
      minY: hb.cy - hb.hy,
      maxY: hb.cy + hb.hy,
      minZ: hb.cz - hb.hz,
      maxZ: hb.cz + hb.hz,
    });
  }

  private damageActor(target: Actor, rawDmg: number, region: HitRegion, attacker: Actor, def: WeaponDef, headshot: boolean) {
    if (!target.alive) return;
    let dmg = rawDmg;
    const armored = target.armor > 0 && (region !== 'head' || target.helmet);
    if (armored) {
      target.armor = Math.max(0, target.armor - dmg * 0.5);
      dmg *= 0.5;
    }
    target.applyDamage(dmg);

    if (attacker.isPlayerControlled) {
      this.hitMarker = 1;
      sound.hit(region, armored);
      if (!target.alive) sound.kill();
    }
    if (target.isPlayerControlled) {
      this.damageFlash = Math.min(1, this.damageFlash + dmg / 55);
    }

    if (!target.alive) {
      this.onDeath(target, attacker, def, headshot);
    }
  }

  private melee(actor: Actor) {
    const def = actor.currentDef();
    if (!def) return;
    actor.nextFireTime = this.time + fireInterval(def);
    if (actor.isPlayerControlled) {
      sound.knife();
      this.viewModel.onFire(0.8);
    }
    const origin = actor.getEyePos(this.tmpA).clone();
    const dir = actor.aimDir(this.tmpB).clone();
    const worldHit = rayWorld(this.colliders, origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, KNIFE_RANGE);
    let bestT = worldHit ? worldHit.t : KNIFE_RANGE;
    let victim: Actor | null = null;
    for (const other of this.actors) {
      if (other === actor || !other.alive || other.team === actor.team) continue;
      const hit = this.rayActor(other, origin, dir, bestT);
      if (hit && hit.t < bestT) {
        bestT = hit.t;
        victim = other;
      }
    }
    if (victim) {
      const back = this.isBehind(victim, actor);
      this.damageActor(victim, def.damage * (back ? 2 : 1), 'chest', actor, def, false);
    }
  }

  private isBehind(target: Actor, attacker: Actor): boolean {
    const fx = -Math.sin(target.yaw);
    const fz = -Math.cos(target.yaw);
    const dx = attacker.pos.x - target.pos.x;
    const dz = attacker.pos.z - target.pos.z;
    return fx * dx + fz * dz < 0;
  }

  private onDeath(target: Actor, attacker: Actor, def: WeaponDef, headshot: boolean) {
    target.alive = false;
    target.vel.set(0, 0, 0);
    target.deaths++;
    if (attacker && attacker !== target) attacker.kills++;

    if (target.hasBomb) {
      target.hasBomb = false;
      this.bomb.dropped = true;
      this.bomb.dropX = target.pos.x;
      this.bomb.dropZ = target.pos.z;
      this.bomb.carrier = null;
      this.bomb.planting = null;
      this.bomb.plantProgress = 0;
    }
    if (this.bomb.planting === target) {
      this.bomb.planting = null;
      this.bomb.plantProgress = 0;
    }
    if (this.bomb.defusing === target) {
      this.bomb.defusing = null;
      this.bomb.defuseProgress = 0;
    }

    this.killfeed.unshift({
      id: this.killfeedId++,
      killer: attacker ? attacker.name : '世界',
      victim: target.name,
      weapon: def.name,
      headshot,
      killerTeam: attacker ? attacker.team : target.team,
      victimTeam: target.team,
      time: this.time,
    });
    if (this.killfeed.length > 6) this.killfeed.pop();
  }

  // ------------------------------------------------------------ bomb mechanics

  private botObjectiveOverride(actor: Actor, ai: ActorInput) {
    if (actor.team === 'T' && actor.hasBomb && !this.bomb.planted && siteAt(this.map, actor.pos.x, actor.pos.z)) {
      ai.moveX = 0;
      ai.moveZ = 0;
      ai.fire = false;
      ai.use = true;
      return;
    }
    if (
      actor.team === 'CT' &&
      this.bomb.planted &&
      Math.hypot(actor.pos.x - this.bomb.x, actor.pos.z - this.bomb.z) < BOMB_INTERACT_RANGE
    ) {
      ai.moveX = 0;
      ai.moveZ = 0;
      ai.fire = false;
      ai.use = true;
    }
  }

  private updatePlayerVision() {
    const p = this.playerActor;
    if (!p || !p.alive) return;
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    for (const a of this.actors) {
      if (!a.alive || a.team === p.team) continue;
      const dx = a.pos.x - p.pos.x;
      const dz = a.pos.z - p.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > AI_VIEW_DIST) continue;
      if (d > 1.2) {
        const dot = (dx * fx + dz * fz) / d;
        if (dot < Math.cos(AI_FOV / 2)) continue;
      }
      if (!lineOfSight(this.colliders, p.pos.x, p.pos.y + p.eyeHeight, p.pos.z, a.pos.x, a.pos.y + 1.2, a.pos.z)) continue;
      this.spottedAt.set(a.id, this.time);
    }
  }

  private handleBombInteraction(actor: Actor, input: ActorInput, dt: number) {
    const site = siteAt(this.map, actor.pos.x, actor.pos.z);

    // Pick up a dropped bomb (T only).
    if (
      !this.bomb.planted &&
      this.bomb.dropped &&
      actor.team === 'T' &&
      !actor.hasBomb &&
      Math.hypot(actor.pos.x - this.bomb.dropX, actor.pos.z - this.bomb.dropZ) < 1.7
    ) {
      actor.hasBomb = true;
      this.bomb.dropped = false;
      this.bomb.carrier = actor;
    }

    // Planting.
    if (actor.team === 'T' && actor.hasBomb && !this.bomb.planted && site) {
      if (input.use) {
        if (this.bomb.planting !== actor) {
          this.bomb.planting = actor;
          this.bomb.plantProgress = 0;
        }
        const before = this.bomb.plantProgress;
        this.bomb.plantProgress += dt;
        if (Math.floor(before * 3) !== Math.floor(this.bomb.plantProgress * 3)) sound.plantTick();
        if (this.bomb.plantProgress >= PLANT_TIME) {
          this.bomb.planted = true;
          this.bomb.x = actor.pos.x;
          this.bomb.z = actor.pos.z;
          this.bomb.timer = BOMB_TIMER;
          this.bomb.beepAt = this.time + 0.6;
          this.bomb.site = site;
          this.bomb.carrier = null;
          this.bomb.planting = null;
          this.bomb.plantProgress = 0;
          actor.hasBomb = false;
          this.banner = '炸弹已安放！';
          sound.planted();
        }
      } else if (this.bomb.planting === actor) {
        this.bomb.planting = null;
        this.bomb.plantProgress = 0;
      }
      return;
    }

    // Defusing.
    if (actor.team === 'CT' && this.bomb.planted) {
      const near = Math.hypot(actor.pos.x - this.bomb.x, actor.pos.z - this.bomb.z) < BOMB_INTERACT_RANGE;
      if (input.use && near) {
        if (this.bomb.defusing !== actor) {
          this.bomb.defusing = actor;
          this.bomb.defuseProgress = 0;
        }
        const before = this.bomb.defuseProgress;
        this.bomb.defuseProgress += dt;
        if (Math.floor(before * 4) !== Math.floor(this.bomb.defuseProgress * 4)) sound.defuseTick();
        if (this.bomb.defuseProgress >= DEFUSE_TIME) {
          this.bomb.planted = false;
          this.bomb.defusing = null;
          this.bomb.defuseProgress = 0;
          sound.defused();
          this.endRound('CT', '成功拆除炸弹');
        }
      } else if (this.bomb.defusing === actor) {
        this.bomb.defusing = null;
        this.bomb.defuseProgress = 0;
      }
    }
  }

  private updateDroppedBomb() {
    if (this.bomb.planting && !this.bomb.planting.alive) {
      this.bomb.planting = null;
      this.bomb.plantProgress = 0;
    }
    if (this.bomb.defusing && !this.bomb.defusing.alive) {
      this.bomb.defusing = null;
      this.bomb.defuseProgress = 0;
    }
    if (this.bomb.planted && this.bomb.carrier) {
      this.bomb.carrier = null;
    }
  }

  private explodeBomb() {
    if (this.phase === 'over') return;
    sound.explosion();
    this.damageFlash = 1;
    for (const actor of this.actors) {
      if (!actor.alive) continue;
      const d = Math.hypot(actor.pos.x - this.bomb.x, actor.pos.z - this.bomb.z);
      if (d < 13) {
        const dmg = 200 * (1 - d / 13);
        if (actor.isPlayerControlled) this.damageFlash = 1;
        actor.applyDamage(dmg);
        if (!actor.alive) {
          this.killfeed.unshift({
            id: this.killfeedId++,
            killer: 'C4',
            victim: actor.name,
            weapon: 'C4',
            headshot: false,
            killerTeam: 'T',
            victimTeam: actor.team,
            time: this.time,
          });
        }
      }
    }
    this.bomb.planted = false;
    this.endRound('T', '炸弹爆炸');
  }

  // ---------------------------------------------------------------- helpers

  private possess(actor: Actor) {
    if (this.playerActor !== actor) {
      if (this.playerActor) this.playerActor.isPlayerControlled = false;
      this.playerActor = actor;
      actor.isPlayerControlled = true;
    }
    actor.scoped = false;
    this.viewModel.setWeapon(actor.currentDef());
    this.viewModel.setScoped(false);
  }

  /** Equip a slot on the player and keep the first-person model in sync. */
  private equipPlayer(actor: Actor, slot: 'primary' | 'secondary' | 'knife') {
    if (!actor.equip(slot, this.time)) return;
    this.viewModel.setWeapon(actor.currentDef());
    this.viewModel.setScoped(false);
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3) {
    const mesh = this.tracerPool.pop();
    if (!mesh) return;
    const len = from.distanceTo(to);
    if (len < 0.05) {
      this.tracerPool.push(mesh);
      return;
    }
    mesh.position.copy(from).addScaledVector(this.tmpA.copy(to).sub(from).normalize(), len / 2);
    mesh.lookAt(to);
    mesh.scale.set(1, 1, len);
    mesh.visible = true;
    (mesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
    this.tracers.push({ mesh, until: this.time + 0.055 });
  }

  private updateTracers() {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      const remain = tr.until - this.time;
      if (remain <= 0) {
        tr.mesh.visible = false;
        this.tracerPool.push(tr.mesh);
        this.tracers.splice(i, 1);
      } else {
        (tr.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.85, remain / 0.055) * 0.85;
      }
    }
  }

  // ----------------------------------------------------------- BotGame API

  get bombPlanted(): boolean {
    return this.bomb.planted;
  }

  get bombPos(): { x: number; z: number } | null {
    if (this.bomb.planted) return { x: this.bomb.x, z: this.bomb.z };
    if (this.bomb.dropped) return { x: this.bomb.dropX, z: this.bomb.dropZ };
    if (this.bomb.carrier) return { x: this.bomb.carrier.pos.x, z: this.bomb.carrier.pos.z };
    return null;
  }

  teamSite(_team: Team): { x: number; z: number } {
    const rect = this.roundSite === 'A' ? this.map.sites.A : this.map.sites.B;
    return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
  }

  randomPatrol(team: Team, self: Actor): NavPoint {
    const anchors: NavPoint[] =
      team === 'CT'
        ? [
            { x: -46, z: -44 },
            { x: 46, z: -44 },
            { x: 0, z: -40 },
            { x: -20, z: -10 },
            { x: 22, z: -12 },
          ]
        : [
            { x: -40, z: 40 },
            { x: 40, z: 40 },
            { x: 0, z: 20 },
          ];
    // Prefer a point that is not right next to the bot.
    let best = pick(anchors);
    for (let i = 0; i < 6; i++) {
      const cand = pick(anchors);
      if (Math.hypot(cand.x - self.pos.x, cand.z - self.pos.z) > 8) {
        best = cand;
        break;
      }
    }
    return this.nav.randomNear(best.x, best.z, 6);
  }

  hasLOS(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    return lineOfSight(this.colliders, ax, ay, az, bx, by, bz);
  }

  findVisibleEnemy(self: Actor): Actor | null {
    const cached = this.visionCache.get(self.id);
    if (cached && this.time - cached.t < 0.12) {
      if (!cached.target || cached.target.alive) return cached.target;
    }
    let best: Actor | null = null;
    let bestD = Infinity;
    const fx = -Math.sin(self.yaw);
    const fz = -Math.cos(self.yaw);
    for (const other of this.actors) {
      if (!other.alive || other.team === self.team) continue;
      const dx = other.pos.x - self.pos.x;
      const dz = other.pos.z - self.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > AI_VIEW_DIST) continue;
      if (d > 1.2) {
        const dot = (dx * fx + dz * fz) / d;
        if (dot < Math.cos(AI_FOV / 2)) continue;
      }
      if (!lineOfSight(this.colliders, self.pos.x, self.pos.y + self.eyeHeight, self.pos.z, other.pos.x, other.pos.y + 1.2, other.pos.z)) {
        continue;
      }
      if (d < bestD) {
        bestD = d;
        best = other;
      }
    }
    this.visionCache.set(self.id, { t: this.time, target: best });
    if (best) this.spottedAt.set(best.id, this.time);
    return best;
  }

  // ---------------------------------------------------------------- render

  private render(dt: number) {
    const p = this.playerActor;
    if (p) {
      const bobAmp = p.onGround ? clamp(p.horizontalSpeed() / 6, 0, 1) * 0.035 : 0;
      const bob = Math.sin(this.time * 9) * bobAmp;
      this.camera.position.set(p.pos.x, p.pos.y + p.eyeHeight + bob, p.pos.z);
      this.camera.rotation.y = p.yaw;
      this.camera.rotation.x = p.pitch;
      const targetFov = p.scoped && p.currentDef()?.scopeFov ? p.currentDef()!.scopeFov! : 75;
      if (Math.abs(this.camera.fov - targetFov) > 0.05) {
        this.camera.fov += (targetFov - this.camera.fov) * (1 - Math.exp(-14 * dt));
        this.camera.updateProjectionMatrix();
      }
      this.viewModel.setVisible(p.alive && this.started && !p.scoped);
      this.viewModel.setScoped(p.scoped);
      this.viewModel.update(dt, p.horizontalSpeed() > 0.6, clamp(p.horizontalSpeed() / 6, 0, 1));
    }

    if (this.muzzleUntil > this.time) {
      this.muzzleFlash.visible = true;
      this.muzzleFlash.rotation.z = Math.random() * Math.PI;
      const s = 0.8 + Math.random() * 0.5;
      this.muzzleFlash.scale.set(s, s, s);
    } else {
      this.muzzleFlash.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // ------------------------------------------------------------------- HUD

  /** Compact state dump used by automated smoke tests. */
  debugSnapshot() {
    return {
      time: +this.time.toFixed(2),
      phase: this.phase,
      round: this.roundNumber,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      roundTime: +this.roundTime.toFixed(1),
      bombPlanted: this.bomb.planted,
      bombTimer: +this.bomb.timer.toFixed(1),
      bombDropped: this.bomb.dropped,
      playerAlive: this.playerActor?.alive ?? false,
      playerWeapon: this.playerActor?.currentDef()?.id ?? null,
      actors: this.actors.map((a) => ({
        id: a.id,
        team: a.team,
        alive: a.alive,
        hp: Math.round(a.health),
        x: +a.pos.x.toFixed(1),
        z: +a.pos.z.toFixed(1),
        weapon: a.currentDef()?.id ?? null,
        hasBomb: a.hasBomb,
      })),
    };
  }

  private publishHud(force = false) {
    const p = this.playerActor;
    const hud = this.hud;
    hud.started = this.started;
    hud.paused = this.paused;
    hud.playerAlive = !!p && p.alive;
    hud.health = p ? Math.max(0, Math.round(p.health)) : 0;
    hud.armor = p ? Math.round(p.armor) : 0;
    hud.helmet = p ? p.helmet : false;
    const w = p?.currentWeapon();
    hud.weaponName = w?.def.name ?? '—';
    hud.slot = p?.slot ?? 'knife';
    hud.ammo = w?.ammo ?? 0;
    hud.reserve = w?.reserve ?? 0;
    hud.reloading = p?.reloading ?? false;
    hud.scoped = p?.scoped ?? false;
    hud.canScope = !!w?.def.scoped;
    hud.spread = p ? this.computeSpread(p, w!.def) : 0;
    hud.team = p?.team ?? 'T';
    hud.scoreCT = this.scoreCT;
    hud.scoreT = this.scoreT;
    hud.roundNumber = this.roundNumber;
    hud.roundTime = this.roundTime;
    hud.phase = this.phase;
    hud.bomb = {
      planted: this.bomb.planted,
      timer: Math.max(0, this.bomb.timer),
      defuseProgress: this.bomb.defuseProgress / DEFUSE_TIME,
      plantProgress: this.bomb.plantProgress / PLANT_TIME,
      carrier: this.bomb.carrier?.name ?? null,
      site: this.bomb.site,
      x: this.bomb.planted ? this.bomb.x : this.bomb.dropX,
      z: this.bomb.planted ? this.bomb.z : this.bomb.dropZ,
      dropped: this.bomb.dropped,
    };
    hud.killfeed = this.killfeed.slice();
    hud.banner = this.banner;
    hud.aliveCT = this.actors.filter((a) => a.team === 'CT' && a.alive).length;
    hud.aliveT = this.actors.filter((a) => a.team === 'T' && a.alive).length;
    hud.fps = Math.round(this.fpsSmooth);
    hud.playerName = p?.name ?? '—';
    hud.playerYaw = p?.yaw ?? 0;
    hud.hitMarker = this.hitMarker;
    hud.damageFlash = this.damageFlash;
    hud.entities = this.buildEntities();
    hud.interact = this.interactHint();
    if (force) this.hudPublishAt = 0;
    this.onHud({ ...hud, entities: hud.entities, killfeed: hud.killfeed, bomb: { ...hud.bomb } });
  }

  private interactHint(): string | null {
    const p = this.playerActor;
    if (!p || !p.alive) return null;
    const site = siteAt(this.map, p.pos.x, p.pos.z);
    if (p.team === 'T' && p.hasBomb && site && !this.bomb.planted) {
      if (this.bomb.planting === p) return `安放中… ${Math.round((this.bomb.plantProgress / PLANT_TIME) * 100)}%`;
      return `按 E 在 ${site} 点安放炸弹`;
    }
    if (p.team === 'T' && this.bomb.dropped && !p.hasBomb) {
      if (Math.hypot(p.pos.x - this.bomb.dropX, p.pos.z - this.bomb.dropZ) < 2.5) return '靠近以拾取炸弹';
    }
    if (p.team === 'CT' && this.bomb.planted) {
      const near = Math.hypot(p.pos.x - this.bomb.x, p.pos.z - this.bomb.z) < BOMB_INTERACT_RANGE;
      if (near) {
        if (this.bomb.defusing === p) return `拆除中… ${Math.round((this.bomb.defuseProgress / DEFUSE_TIME) * 100)}%`;
        return '按 E 拆除炸弹';
      }
    }
    return null;
  }

  private buildEntities(): MinimapEntity[] {
    const p = this.playerActor;
    const out: MinimapEntity[] = [];
    for (const a of this.actors) {
      if (!a.alive) continue;
      const self = a === p;
      let visible = self;
      if (a.team === (p?.team ?? 'T')) visible = true;
      else {
        const seen = this.spottedAt.get(a.id);
        visible = seen !== undefined && this.time - seen < 3;
      }
      out.push({ x: a.pos.x, z: a.pos.z, team: a.team, self, visible, bomb: a.hasBomb });
    }
    if (this.bomb.planted) {
      out.push({ x: this.bomb.x, z: this.bomb.z, team: 'T', self: false, visible: true, bomb: true });
    } else if (this.bomb.dropped) {
      out.push({ x: this.bomb.dropX, z: this.bomb.dropZ, team: 'T', self: false, visible: true, bomb: true });
    } else if (this.bomb.carrier) {
      out.push({ x: this.bomb.carrier.pos.x, z: this.bomb.carrier.pos.z, team: 'T', self: false, visible: true, bomb: true });
    }
    return out;
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
    this.input.detach();
    for (const a of this.actors) a.dispose();
    this.mapVisuals.dispose();
    this.viewModel.dispose();
    this.muzzleFlash.geometry.dispose();
    (this.muzzleFlash.material as THREE.Material).dispose();
    const tracer = this.tracerPool[0];
    if (tracer) {
      tracer.geometry.dispose();
      (tracer.material as THREE.Material).dispose();
    }
    this.renderer.dispose();
  }
}

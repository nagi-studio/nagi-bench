// GameWorld: the simulation + rendering orchestrator. Owns the scene, camera,
// first-person viewmodel, all 10 actors (1 player + 9 bots), the round/bomb
// state machine, hitscan combat, effects, minimap and HUD sync. The React layer
// only mounts this and reads the HUD store.

import * as THREE from 'three';
import { AudioEngine } from './audio';
import {
  collideCrates, collideWalls, groundHeightAt, rayCrateDistance,
} from './collision';
import { CHAR_HEIGHT, raycastCharacter } from './combat';
import { AI, COLORS, FIXED_DT, GRAVITY, MAX_FRAME_DT, PLAYER, ROUND } from './constants';
import { buildDust2, Crate, Dust2 } from './dust2';
import { Effects } from './effects';
import { Region } from './grid';
import { Input } from './input';
import { buildScene } from './scene';
import { hud } from './store';
import { BombState, HitZone, KillEvent, RoundPhase, Team, WeaponId } from './types';
import { WEAPONS } from './weapons';
import { animateCharacter, buildCharacter, CharacterRig } from './entities/characterModel';
import { buildWeaponMesh } from './entities/weaponModels';
import { clamp } from './mathUtils';
import { initBotState, updateBot, type BotState } from './ai';
import { updatePlayer } from './player';

export interface Ammo {
  mag: number;
  reserve: number;
}

export type Action = 'none' | 'plant' | 'defuse' | 'pickup';

export interface Actor {
  id: number;
  name: string;
  team: Team;
  isPlayer: boolean;
  alive: boolean;
  deadAt: number;

  x: number; y: number; z: number;
  yaw: number; pitch: number;
  vx: number; vy: number; vz: number;
  grounded: boolean;
  eyeH: number;

  // per-frame intents set by the controller
  moveX: number; moveZ: number;
  wantJump: boolean;
  wantRun: boolean;
  action: Action;

  health: number; armor: number; helmet: boolean;
  weapons: WeaponId[];
  current: WeaponId;
  ammo: Record<string, Ammo>;
  nextFire: number;
  reloadEnd: number;
  spread: number;
  kickPitch: number;
  kickYaw: number;
  scoped: boolean;

  hasBomb: boolean;

  rig: CharacterRig | null;
  worldWeapon: THREE.Group | null;
  worldMuzzle: THREE.Object3D | null;
  blob: THREE.Mesh | null;
  footDist: number;
  animTime: number;

  bs: BotState;
  kills: number;
  deaths: number;
}

interface Bomb {
  state: BombState;
  x: number; y: number; z: number;
  site: 'A' | 'B' | null;
  timer: number;
  plantProgress: number;
  defuseProgress: number;
  beepTimer: number;
  mesh: THREE.Group;
  light: THREE.Mesh;
}

const SENS = 0.0022;
const PITCH_LIMIT = 1.45;

export class GameWorld {
  readonly dust2: Dust2;
  readonly grid;
  readonly crates: Crate[];
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly effects: Effects;
  readonly audio = new AudioEngine();
  readonly input: Input;
  readonly actors: Actor[] = [];
  player!: Actor;
  playerTeam: Team;

  private container: HTMLElement;
  private viewmodel: THREE.Group;
  private vmMuzzle: THREE.Object3D | null = null;
  private vmRecoil = 0;
  private sun: THREE.DirectionalLight;
  private bomb: Bomb;
  private baseFov = 78;

  time = 0;
  phase: RoundPhase = RoundPhase.Warmup;
  roundNum = 0;
  scoreT = 0;
  scoreCT = 0;
  private freezeTimer = 0;
  private roundTimer = 0;
  private overTimer = 0;
  private banner = '';
  private hint = '';
  private killfeed: KillEvent[] = [];
  private killId = 0;
  private tSite: 'A' | 'B' = 'A';
  private hudAccum = 0;
  private visibleEnemyIds = new Set<number>();

  private minimapCanvas: HTMLCanvasElement | null = null;
  private minimapStatic: HTMLCanvasElement | null = null;
  private started = false;
  private everLocked = false;
  private spectateTarget: Actor | null = null;

  constructor(container: HTMLElement, playerTeam: Team) {
    this.container = container;
    this.playerTeam = playerTeam;
    this.dust2 = buildDust2();
    this.grid = this.dust2.grid;
    this.crates = this.dust2.crates;

    const refs = buildScene(this.dust2);
    this.scene = refs.scene;
    this.sun = refs.sun;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    this.input = new Input(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(this.baseFov, container.clientWidth / container.clientHeight, 0.04, 220);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.viewmodel = new THREE.Group();
    this.camera.add(this.viewmodel);

    this.effects = new Effects(this.scene);

    // bomb entity
    const bg = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.28, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3 }),
    );
    body.position.y = 0.14;
    bg.add(body);
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff3020 }),
    );
    light.position.set(0, 0.32, 0);
    bg.add(light);
    bg.visible = false;
    this.scene.add(bg);
    this.bomb = {
      state: BombState.Carried, x: 0, y: 0, z: 0, site: null, timer: ROUND.bombTimer,
      plantProgress: 0, defuseProgress: 0, beepTimer: 0, mesh: bg, light,
    };

    this.createActors();
    this.startRound(); // place everyone for the pre-start view
    hud.set({ playerTeam });
  }

  // ---- setup ----

  setMinimapCanvas(c: HTMLCanvasElement): void {
    this.minimapCanvas = c;
    this.buildMinimapStatic();
  }

  private createActors(): void {
    const mkAmmoEmpty = (): Record<string, Ammo> => ({});
    for (let i = 0; i < 10; i++) {
      const team: Team = i < 5 ? this.playerTeam : (this.playerTeam === Team.T ? Team.CT : Team.T);
      const isPlayer = i === 0;
      const teamLetter = team === Team.T ? 'T' : 'CT';
      const a: Actor = {
        id: i,
        // Every actor has a fixed callsign; the human is shown by the minimap
        // arrow + first-person view, and control can move between callsigns.
        name: `${teamLetter}-${(i % 5) + 1}`,
        team,
        isPlayer,
        alive: true,
        deadAt: 0,
        x: 0, y: 0, z: 0,
        yaw: 0, pitch: 0,
        vx: 0, vy: 0, vz: 0,
        grounded: true,
        eyeH: isPlayer ? PLAYER.eyeHeight : 1.55,
        moveX: 0, moveZ: 0, wantJump: false, wantRun: true, action: 'none',
        health: 100, armor: 0, helmet: false,
        weapons: [], current: 'knife', ammo: mkAmmoEmpty(),
        nextFire: 0, reloadEnd: 0, spread: 0, kickPitch: 0, kickYaw: 0, scoped: false,
        hasBomb: false,
        rig: null, worldWeapon: null, worldMuzzle: null, blob: null,
        footDist: 0, animTime: Math.random() * 10,
        bs: initBotState(),
        kills: 0, deaths: 0,
      };
      // Every actor gets a body so control can be handed to any of them; the
      // actor currently being viewed has its rig hidden for the first person.
      const rig = buildCharacter(team);
      this.scene.add(rig.root);
      a.rig = rig;
      // blob shadow
      const blob = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }),
      );
      blob.rotation.x = -Math.PI / 2;
      this.scene.add(blob);
      a.blob = blob;
      this.actors.push(a);
      if (isPlayer) this.player = a;
    }
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.audio.init();
    // give a fresh freeze once the player actually starts
    this.phase = RoundPhase.Freeze;
    this.freezeTimer = ROUND.freezeTime;
  }

  private loadoutFor(team: Team, pistol: boolean, index: number): { weapons: WeaponId[]; current: WeaponId; armor: number; helmet: boolean } {
    if (pistol) {
      const sec: WeaponId = team === Team.T ? 'glock' : 'usp';
      return { weapons: [sec, 'knife'], current: sec, armor: 100, helmet: false };
    }
    const rifle: WeaponId = team === Team.T ? 'ak47' : 'm4a4';
    const sec: WeaponId = team === Team.T ? 'glock' : 'usp';
    // one designated AWPer per team
    const primary: WeaponId = index === 1 ? 'awp' : rifle;
    return { weapons: [primary, sec, 'knife'], current: primary, armor: 100, helmet: true };
  }

  private startRound(): void {
    this.roundNum++;
    const pistol = this.roundNum === 1;
    this.phase = RoundPhase.Freeze;
    this.freezeTimer = ROUND.freezeTime;
    this.roundTimer = ROUND.roundTime;
    this.banner = pistol ? 'Pistol Round' : `Round ${this.roundNum}`;
    this.hint = '';
    this.visibleEnemyIds.clear();

    // bomb reset
    this.bomb.state = BombState.Carried;
    this.bomb.site = null;
    this.bomb.timer = ROUND.bombTimer;
    this.bomb.plantProgress = 0;
    this.bomb.defuseProgress = 0;
    this.bomb.mesh.visible = false;

    // T target site + CT defense split for this round
    this.tSite = Math.random() < 0.5 ? 'A' : 'B';

    const tSpawns = this.dust2.tSpawns;
    const ctSpawns = this.dust2.ctSpawns;
    let ti = 0;
    let ci = 0;
    const ts: Actor[] = [];
    for (const a of this.actors) {
      const spawn = a.team === Team.T ? tSpawns[ti++ % tSpawns.length] : ctSpawns[ci++ % ctSpawns.length];
      const teamIndex = a.team === Team.T ? ti - 1 : ci - 1;
      this.resetActor(a, spawn.x, spawn.z, pistol, teamIndex);
      if (a.team === Team.T) ts.push(a);
    }

    // assign bomb carrier: player if T, else first T bot
    const carrier = this.playerTeam === Team.T ? this.player : ts.find((a) => !a.isPlayer) ?? ts[0];
    if (carrier) {
      carrier.hasBomb = true;
    }

    // CT defense assignment: split across sites
    let dc = 0;
    for (const a of this.actors) {
      if (a.team === Team.CT && !a.isPlayer) {
        a.bs.defendSite = dc++ % 2 === 0 ? 'A' : 'B';
      }
      if (a.team === Team.T && !a.isPlayer) {
        a.bs.targetSite = this.tSite;
      }
    }

    this.syncHudFull();
  }

  private resetActor(a: Actor, x: number, z: number, pistol: boolean, teamIndex: number): void {
    a.alive = true;
    a.health = PLAYER.maxHealth;
    const lo = this.loadoutFor(a.team, pistol, teamIndex);
    a.armor = lo.armor;
    a.helmet = lo.helmet;
    a.weapons = lo.weapons.slice();
    a.ammo = {};
    for (const w of a.weapons) {
      const def = WEAPONS[w];
      a.ammo[w] = { mag: def.magSize === Infinity ? Infinity : def.magSize, reserve: def.reserve === Infinity ? Infinity : def.reserve };
    }
    a.x = x;
    a.y = 0;
    a.z = z;
    a.vx = a.vy = a.vz = 0;
    a.grounded = true;
    a.yaw = a.team === Team.T ? 0 : Math.PI;
    a.pitch = 0;
    a.kickPitch = a.kickYaw = 0;
    a.spread = 0;
    a.scoped = false;
    a.hasBomb = false;
    a.nextFire = 0;
    a.reloadEnd = 0;
    a.action = 'none';
    a.moveX = a.moveZ = 0;
    a.footDist = 0;
    initBotState(a.bs);
    if (a.rig) {
      a.rig.root.visible = true;
      a.rig.root.position.set(a.x, a.y, a.z);
      a.rig.root.rotation.set(0, a.yaw, 0);
    }
    this.equip(a, lo.current);
  }

  // ---- weapon equip / viewmodel ----

  equip(a: Actor, id: WeaponId): void {
    if (!a.weapons.includes(id)) return;
    a.current = id;
    a.scoped = false;
    if (a.isPlayer) {
      this.rebuildViewmodel(id);
    } else if (a.rig) {
      if (a.worldWeapon) a.rig.weaponHolder.remove(a.worldWeapon);
      const wm = buildWeaponMesh(id);
      a.rig.weaponHolder.add(wm.group);
      a.worldWeapon = wm.group;
      a.worldMuzzle = wm.muzzle;
    }
  }

  private rebuildViewmodel(id: WeaponId): void {
    this.viewmodel.clear();
    const wm = buildWeaponMesh(id);
    // hands
    const skin = 0xc99a76;
    const handGeo = new THREE.BoxGeometry(0.09, 0.09, 0.12);
    const handMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
    const h1 = new THREE.Mesh(handGeo, handMat);
    h1.position.set(0.0, -0.09, 0.06);
    const h2 = new THREE.Mesh(handGeo, handMat);
    h2.position.set(0.0, -0.06, -0.18);
    wm.group.add(h1, h2);
    wm.group.position.set(0.22, -0.2, -0.48);
    wm.group.rotation.y = 0.05;
    wm.group.scale.setScalar(0.7);
    this.viewmodel.add(wm.group);
    this.vmMuzzle = wm.muzzle;
  }

  // ---- main loop ----

  update(rawDt: number): void {
    const dt = clamp(rawDt, 0, MAX_FRAME_DT);
    this.time += dt;

    // Pause the simulation when the pointer is unlocked (Esc), but only once the
    // player has actually locked at least once — so if pointer lock is blocked
    // (e.g. a restrictive iframe) the game degrades to keyboard control instead
    // of freezing forever.
    if (this.input.locked) this.everLocked = true;
    const active = this.started && (this.input.locked || !this.everLocked);
    if (!active) {
      this.updateActorsVisual(0);
      this.updateCamera(dt);
      this.drawMinimap();
      this.syncHud();
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // phase transitions
    if (this.phase === RoundPhase.Freeze) {
      this.freezeTimer -= dt;
      if (this.freezeTimer <= 0) {
        this.phase = RoundPhase.Live;
        this.banner = '';
      }
    } else if (this.phase === RoundPhase.Over) {
      this.overTimer -= dt;
      if (this.overTimer <= 0) this.startRound();
    }

    const live = this.phase === RoundPhase.Live;
    const canMove = live;

    // compute team vision (for minimap + AI shortcuts)
    this.computeVisibility();

    // controllers
    this.hint = '';
    updatePlayer(this, this.player, dt, canMove);
    for (const a of this.actors) {
      if (a.isPlayer || !a.alive) continue;
      updateBot(this, a, dt, canMove);
    }

    // reloads finishing
    for (const a of this.actors) {
      if (a.alive && a.reloadEnd > 0 && this.time >= a.reloadEnd) this.finishReload(a);
    }

    // physics
    for (const a of this.actors) {
      if (!a.alive) continue;
      this.integrateActor(a, canMove ? dt : 0, dt);
    }
    if (canMove) this.separateActors();

    // decay recoil/spread
    for (const a of this.actors) {
      const rec = Math.max(0, 1 - dt * 9);
      a.kickPitch *= rec;
      a.kickYaw *= rec;
      const w = WEAPONS[a.current];
      a.spread = Math.max(0, a.spread - w.recoverRate * dt);
    }

    if (live) {
      if (this.bomb.state !== BombState.Planted) this.roundTimer -= dt;
      this.updateBomb(dt);
      this.checkRoundEnd();
    }

    // presentation
    this.updateActorsVisual(dt);
    this.updateCamera(dt);
    this.effects.update(dt);
    const listener = this.viewActor();
    this.audio.setListener(listener.x, listener.z, listener.yaw);

    this.drawMinimap();

    this.hudAccum += dt;
    if (this.hudAccum >= 0.06) {
      this.hudAccum = 0;
      this.syncHud();
    }

    this.renderer.render(this.scene, this.camera);
  }

  // ---- physics ----

  private integrateActor(a: Actor, moveDt: number, physDt: number): void {
    const w = WEAPONS[a.current];
    // vertical
    if (a.wantJump && a.grounded && moveDt > 0) {
      a.vy = PLAYER.jumpSpeed;
      a.grounded = false;
    }
    a.wantJump = false;
    a.vy -= GRAVITY * physDt;
    a.y += a.vy * physDt;
    const ground = groundHeightAt(this.crates, a.x, a.z, PLAYER.radius);
    if (a.y <= ground) {
      a.y = ground;
      a.vy = 0;
      a.grounded = true;
    } else {
      a.grounded = false;
    }

    // horizontal
    if (moveDt > 0) {
      const scopedMul = a.scoped ? 0.5 : 1;
      let wishLen = Math.hypot(a.moveX, a.moveZ);
      let wx = 0, wz = 0;
      if (wishLen > 1e-4) {
        wx = a.moveX / wishLen;
        wz = a.moveZ / wishLen;
      }
      const maxSpeed = (a.wantRun ? PLAYER.runSpeed : PLAYER.walkSpeed) * w.moveSpeedMul * scopedMul;
      const speed = Math.hypot(a.vx, a.vz);
      if (a.grounded) {
        // friction
        if (speed > 0) {
          const drop = speed * PLAYER.friction * moveDt;
          const ns = Math.max(0, speed - drop) / speed;
          a.vx *= ns;
          a.vz *= ns;
        }
      }
      const accel = a.grounded ? PLAYER.groundAccel : PLAYER.airAccel;
      if (wishLen > 1e-4) {
        const curSpeedInWish = a.vx * wx + a.vz * wz;
        const add = clamp(maxSpeed - curSpeedInWish, 0, accel * moveDt);
        a.vx += wx * add;
        a.vz += wz * add;
      }
      const oldX = a.x, oldZ = a.z;
      let nx = a.x + a.vx * moveDt;
      let nz = a.z + a.vz * moveDt;
      let r = collideWalls(this.grid, nx, nz, PLAYER.radius);
      r = collideCrates(this.crates, r.x, r.z, PLAYER.radius, a.y);
      a.x = r.x;
      a.z = r.z;
      // rebuild velocity from actual movement to avoid wall sticking
      a.vx = (a.x - oldX) / moveDt;
      a.vz = (a.z - oldZ) / moveDt;
    }
  }

  private separateActors(): void {
    const minD = PLAYER.radius * 2;
    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < this.actors.length; j++) {
        const b = this.actors[j];
        if (!b.alive) continue;
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < minD * minD && d2 > 1e-5) {
          const d = Math.sqrt(d2);
          const push = (minD - d) / 2;
          const nx = dx / d, nz = dz / d;
          if (!a.isPlayer) { a.x -= nx * push; a.z -= nz * push; }
          if (!b.isPlayer) { b.x += nx * push; b.z += nz * push; }
          // if one is player, push the bot fully
          if (a.isPlayer) { b.x += nx * push * 2; b.z += nz * push * 2; }
          if (b.isPlayer) { a.x -= nx * push * 2; a.z -= nz * push * 2; }
        }
      }
    }
  }

  // ---- combat ----

  eyePos(a: Actor): { x: number; y: number; z: number } {
    return { x: a.x, y: a.y + a.eyeH, z: a.z };
  }

  aimDir(a: Actor): { x: number; y: number; z: number } {
    const yaw = a.yaw + a.kickYaw;
    const pitch = clamp(a.pitch + a.kickPitch, -PITCH_LIMIT, PITCH_LIMIT);
    const cp = Math.cos(pitch);
    return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
  }

  private coneDir(dx: number, dy: number, dz: number, spread: number): { x: number; y: number; z: number } {
    if (spread <= 1e-5) return { x: dx, y: dy, z: dz };
    const a = spread * Math.sqrt(Math.random());
    const th = Math.random() * Math.PI * 2;
    // tangent basis
    let ux = 0, uy = 1, uz = 0;
    if (Math.abs(dy) > 0.9) { ux = 1; uy = 0; }
    let t1x = uy * dz - uz * dy;
    let t1y = uz * dx - ux * dz;
    let t1z = ux * dy - uy * dx;
    const t1l = Math.hypot(t1x, t1y, t1z) || 1;
    t1x /= t1l; t1y /= t1l; t1z /= t1l;
    const t2x = dy * t1z - dz * t1y;
    const t2y = dz * t1x - dx * t1z;
    const t2z = dx * t1y - dy * t1x;
    const sa = Math.sin(a), ca = Math.cos(a);
    const ox = Math.cos(th) * sa, oy = Math.sin(th) * sa;
    return {
      x: dx * ca + (t1x * ox + t2x * oy),
      y: dy * ca + (t1y * ox + t2y * oy),
      z: dz * ca + (t1z * ox + t2z * oy),
    };
  }

  // movement/air inaccuracy contribution
  private moveInaccuracy(a: Actor): number {
    const w = WEAPONS[a.current];
    const speed = Math.hypot(a.vx, a.vz);
    let inacc = (speed / PLAYER.runSpeed) * 0.03;
    if (!a.grounded) inacc += 0.08;
    if (a.scoped) inacc *= 3;
    return inacc * (w.scoped && !a.scoped ? 1.5 : 1);
  }

  fireWeapon(a: Actor): boolean {
    const w = WEAPONS[a.current];
    if (this.time < a.nextFire || a.reloadEnd > 0) return false;
    if (w.isKnife) return this.melee(a);
    const ammo = a.ammo[a.current];
    if (ammo.mag <= 0) {
      // auto reload attempt
      if (a.isPlayer) this.startReload(a);
      return false;
    }
    a.nextFire = this.time + w.fireInterval;
    ammo.mag = ammo.mag === Infinity ? Infinity : ammo.mag - 1;

    const eye = this.eyePos(a);
    const base = this.aimDir(a);
    const spread = w.baseSpread + a.spread + this.moveInaccuracy(a);
    const dir = this.coneDir(base.x, base.y, base.z, a.scoped ? spread * 0.15 : spread);
    const dl = Math.hypot(dir.x, dir.y, dir.z) || 1;
    const ndx = dir.x / dl, ndy = dir.y / dl, ndz = dir.z / dl;

    const range = w.range;
    // geometry distances. rayWallDistance parametrizes the XZ ray by the same
    // t as the (unit) 3D ray, so its return value is already the 3D distance.
    let wall3d = this.grid.rayWallDistance(eye.x, eye.z, ndx, ndz, range);
    // floor
    if (ndy < -1e-4) {
      const tf = -eye.y / ndy;
      if (tf < wall3d) wall3d = tf;
    }
    const crate3d = rayCrateDistance(this.crates, eye.x, eye.y, eye.z, ndx, ndy, ndz, wall3d);
    let nearest = Math.min(wall3d, crate3d);
    let hitActor: Actor | null = null;
    let hitZone: HitZone = HitZone.Chest;

    for (const t of this.actors) {
      if (!t.alive || t.team === a.team || t.id === a.id) continue;
      const r = raycastCharacter(t.x, t.y, t.z, t.yaw, eye.x, eye.y, eye.z, ndx, ndy, ndz, nearest);
      if (r && r.t < nearest) {
        nearest = r.t;
        hitActor = t;
        hitZone = r.zone;
      }
    }

    // muzzle world position for tracer/flash
    const muzzle = a.isPlayer ? this.vmMuzzle : a.worldMuzzle;
    const mp = new THREE.Vector3();
    if (muzzle) muzzle.getWorldPosition(mp);
    else mp.set(eye.x + ndx * 0.4, eye.y - 0.1, eye.z + ndz * 0.4);
    const hx = eye.x + ndx * nearest;
    const hy = eye.y + ndy * nearest;
    const hz = eye.z + ndz * nearest;
    this.effects.tracer(mp.x, mp.y, mp.z, hx, hy, hz);
    this.effects.flash(mp.x, mp.y, mp.z);
    this.audio.gunshot(a.current, a.isPlayer ? undefined : a.x, a.isPlayer ? undefined : a.z);

    if (hitActor) {
      this.effects.impact(hx, hy, hz, true);
      this.damageActor(hitActor, a, a.current, hitZone, hx, hy, hz);
    } else if (nearest < range) {
      this.effects.impact(hx, hy, hz, false);
    }

    // recoil
    a.spread = Math.min(w.maxSpread, a.spread + w.spreadPerShot);
    if (a.isPlayer) {
      a.kickPitch += w.recoilPitch;
      a.kickYaw += (Math.random() * 2 - 1) * w.recoilYaw;
      this.vmRecoil = Math.min(0.16, this.vmRecoil + (w.scoped ? 0.14 : 0.05));
    }
    return true;
  }

  private melee(a: Actor): boolean {
    const w = WEAPONS.knife;
    a.nextFire = this.time + w.fireInterval;
    const eye = this.eyePos(a);
    const d = this.aimDir(a);
    this.audio.gunshot('knife', a.isPlayer ? undefined : a.x, a.isPlayer ? undefined : a.z);
    let nearest = w.range;
    let hitActor: Actor | null = null;
    let zone: HitZone = HitZone.Chest;
    for (const t of this.actors) {
      if (!t.alive || t.team === a.team || t.id === a.id) continue;
      const r = raycastCharacter(t.x, t.y, t.z, t.yaw, eye.x, eye.y, eye.z, d.x, d.y, d.z, nearest);
      if (r && r.t < nearest) { nearest = r.t; hitActor = t; zone = r.zone; }
    }
    if (hitActor) {
      const hx = eye.x + d.x * nearest, hy = eye.y + d.y * nearest, hz = eye.z + d.z * nearest;
      this.effects.impact(hx, hy, hz, true);
      this.damageActor(hitActor, a, 'knife', zone, hx, hy, hz);
      return true;
    }
    return false;
  }

  startReload(a: Actor): void {
    const w = WEAPONS[a.current];
    if (w.isKnife || a.reloadEnd > 0) return;
    const ammo = a.ammo[a.current];
    if (ammo.mag >= w.magSize || ammo.reserve <= 0) return;
    a.reloadEnd = this.time + w.reloadTime;
    a.scoped = false;
    if (a.isPlayer) this.audio.reload();
  }

  private finishReload(a: Actor): void {
    const w = WEAPONS[a.current];
    const ammo = a.ammo[a.current];
    const need = w.magSize - ammo.mag;
    const take = Math.min(need, ammo.reserve);
    ammo.mag += take;
    ammo.reserve -= take;
    a.reloadEnd = 0;
  }

  private damageActor(t: Actor, from: Actor, weapon: WeaponId, zone: HitZone, hx: number, hy: number, hz: number): void {
    if (!t.alive) return;
    const w = WEAPONS[weapon];
    let dmg = w.damage * ({ [HitZone.Head]: 2, [HitZone.Chest]: 1, [HitZone.Stomach]: 1.25, [HitZone.Arm]: 0.75, [HitZone.Leg]: 0.75 }[zone]);
    const protectable = zone !== HitZone.Leg && (zone !== HitZone.Head || t.helmet);
    if (t.armor > 0 && protectable) {
      const pre = dmg;
      dmg *= w.armorPen;
      t.armor = Math.max(0, t.armor - Math.round((pre - dmg) * 0.5 + dmg * 0.5));
    }
    t.health -= dmg;
    if (from.isPlayer) this.audio.hitmarker();
    if (t.health <= 0) {
      this.onDeath(t, from, weapon, zone === HitZone.Head);
    }
  }

  private onDeath(t: Actor, from: Actor, weapon: WeaponId, headshot: boolean): void {
    t.alive = false;
    t.health = 0;
    t.deadAt = this.time;
    t.deaths++;
    if (from.id !== t.id) from.kills++;
    if (t.hasBomb) this.dropBomb(t);
    t.hasBomb = false;
    t.scoped = false;
    if (t.rig) {
      // fallen pose
      t.rig.root.rotation.z = Math.PI / 2;
      t.rig.root.position.y = 0.35;
    }
    this.killId++;
    this.killfeed.unshift({
      id: this.killId,
      attacker: from.name,
      victim: t.name,
      attackerTeam: from.team,
      victimTeam: t.team,
      weapon,
      headshot,
      time: this.time,
    });
    if (this.killfeed.length > 6) this.killfeed.pop();
    if (from.isPlayer) this.audio.kill();
    if (t.isPlayer) this.banner = 'You were eliminated';
  }

  // ---- bomb ----

  private inSite(a: Actor): 'A' | 'B' | null {
    const c = this.grid.cellOf(a.x, a.z);
    const reg = this.grid.regionAt(c.cx, c.cz);
    if (reg === Region.ASite) return 'A';
    if (reg === Region.BSite) return 'B';
    return null;
  }

  isInSite(a: Actor): 'A' | 'B' | null {
    return this.inSite(a);
  }

  private dropBomb(carrier: Actor): void {
    this.bomb.state = BombState.Dropped;
    this.bomb.x = carrier.x;
    this.bomb.y = 0;
    this.bomb.z = carrier.z;
    this.bomb.mesh.position.set(carrier.x, 0, carrier.z);
    this.bomb.mesh.visible = true;
  }

  pickupBomb(a: Actor): void {
    if (this.bomb.state !== BombState.Dropped || a.team !== Team.T) return;
    const dx = a.x - this.bomb.x, dz = a.z - this.bomb.z;
    if (dx * dx + dz * dz > 2.2 * 2.2) return;
    this.bomb.state = BombState.Carried;
    a.hasBomb = true;
    this.bomb.mesh.visible = false;
  }

  bombInfo() {
    return this.bomb;
  }

  private updateBomb(dt: number): void {
    const b = this.bomb;
    if (b.state === BombState.Carried) {
      const carrier = this.actors.find((a) => a.hasBomb && a.alive);
      // planting
      const planter = this.actors.find((a) => a.alive && a.hasBomb && a.action === 'plant' && a.grounded && this.inSite(a) !== null);
      if (planter) {
        b.plantProgress += dt;
        if (planter.isPlayer) this.audio.plantTick();
        if (b.plantProgress >= ROUND.plantTime) {
          b.state = BombState.Planted;
          b.site = this.inSite(planter);
          b.x = planter.x; b.y = 0; b.z = planter.z;
          b.timer = ROUND.bombTimer;
          b.mesh.position.set(b.x, 0, b.z);
          b.mesh.visible = true;
          planter.hasBomb = false;
          this.banner = `Bomb planted at ${b.site}`;
          this.audio.plantTick();
        }
      } else {
        b.plantProgress = Math.max(0, b.plantProgress - dt * 2);
      }
      if (carrier) { b.x = carrier.x; b.z = carrier.z; }
    } else if (b.state === BombState.Planted) {
      b.timer -= dt;
      // beeping accelerates near the end
      b.beepTimer -= dt;
      const interval = clamp(b.timer / ROUND.bombTimer, 0.08, 1) * 1.1;
      if (b.beepTimer <= 0) {
        b.beepTimer = interval;
        this.audio.bombBeep(b.x, b.z);
      }
      const pulse = 0.5 + 0.5 * Math.sin(this.time * (12 - 10 * (1 - b.timer / ROUND.bombTimer)));
      (this.bomb.light.material as THREE.MeshBasicMaterial).color.setRGB(0.6 + pulse * 0.4, 0.1, 0.05);
      // defusing
      const defuser = this.actors.find((a) => {
        if (!a.alive || a.team !== Team.CT || a.action !== 'defuse' || !a.grounded) return false;
        const dx = a.x - b.x, dz = a.z - b.z;
        return dx * dx + dz * dz < 2.4 * 2.4;
      });
      if (defuser) {
        b.defuseProgress += dt;
        if (defuser.isPlayer && Math.floor(b.defuseProgress * 4) !== Math.floor((b.defuseProgress - dt) * 4)) {
          this.audio.defuseTick();
        }
        if (b.defuseProgress >= ROUND.defuseTime) {
          b.state = BombState.Defused;
          this.endRound(Team.CT, 'Bomb defused');
        }
      } else {
        b.defuseProgress = Math.max(0, b.defuseProgress - dt * 1.5);
      }
      if (b.timer <= 0) {
        this.explodeBomb();
      }
    }
  }

  private explodeBomb(): void {
    const b = this.bomb;
    b.state = BombState.Exploded;
    this.audio.explode(b.x, b.z);
    this.effects.impact(b.x, 0.5, b.z, false);
    // radius damage
    for (const a of this.actors) {
      if (!a.alive) continue;
      const dx = a.x - b.x, dz = a.z - b.z;
      const d = Math.hypot(dx, dz);
      if (d < ROUND.bombDamageRadius) {
        const dmg = 200 * (1 - d / ROUND.bombDamageRadius);
        a.health -= dmg;
        if (a.health <= 0) {
          a.alive = false;
          a.deadAt = this.time;
          if (a.rig) { a.rig.root.rotation.z = Math.PI / 2; a.rig.root.position.y = 0.35; }
        }
      }
    }
    this.endRound(Team.T, 'Bomb detonated');
  }

  // ---- round resolution ----

  private countAlive(team: Team): number {
    let n = 0;
    for (const a of this.actors) if (a.team === team && a.alive) n++;
    return n;
  }

  private checkRoundEnd(): void {
    const tAlive = this.countAlive(Team.T);
    const ctAlive = this.countAlive(Team.CT);
    const planted = this.bomb.state === BombState.Planted;

    if (planted) {
      if (ctAlive === 0) {
        this.endRound(Team.T, 'Terrorists win');
      }
      // if all T dead but planted, CTs must still defuse (handled by timer/defuse)
    } else {
      if (tAlive === 0) {
        this.endRound(Team.CT, 'Counter-Terrorists win');
      } else if (ctAlive === 0) {
        this.endRound(Team.T, 'Terrorists win');
      } else if (this.roundTimer <= 0) {
        this.endRound(Team.CT, 'Time — Counter-Terrorists win');
      }
    }
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === RoundPhase.Over) return;
    this.phase = RoundPhase.Over;
    this.overTimer = ROUND.overTime;
    if (winner === Team.T) this.scoreT++;
    else this.scoreCT++;
    this.banner = reason;
    this.syncHudFull();
  }

  // ---- visibility ----

  canSee(from: Actor, to: Actor, fovDeg = 360): boolean {
    if (!to.alive) return false;
    const ex = from.x, ez = from.z;
    const ey = from.y + from.eyeH;
    const tx = to.x, tz = to.z;
    const ty = to.y + 1.2;
    const dx = tx - ex, dz = tz - ez;
    const dist = Math.hypot(dx, dz);
    if (dist > AI.viewRange) return false;
    if (fovDeg < 360) {
      const fwd = this.aimDir(from);
      const fl = Math.hypot(fwd.x, fwd.z) || 1;
      const dot = (dx * fwd.x + dz * fwd.z) / (dist * fl + 1e-4);
      const cosHalf = Math.cos((fovDeg * Math.PI) / 180 / 2);
      if (dot < cosHalf) return false;
    }
    if (this.grid.segmentBlocked(ex, ez, tx, tz)) return false;
    // crate occlusion (3D)
    const dy = ty - ey;
    const len = Math.hypot(dx, dy, dz) || 1;
    const cd = rayCrateDistance(this.crates, ex, ey, ez, dx / len, dy / len, dz / len, len);
    if (cd < len - 0.2) return false;
    return true;
  }

  nearestVisibleEnemy(a: Actor, fovDeg = 360): Actor | null {
    let best: Actor | null = null;
    let bestD = Infinity;
    for (const t of this.actors) {
      if (!t.alive || t.team === a.team) continue;
      if (!this.canSee(a, t, fovDeg)) continue;
      const d = (t.x - a.x) ** 2 + (t.z - a.z) ** 2;
      if (d < bestD) { bestD = d; best = t; }
    }
    return best;
  }

  private computeVisibility(): void {
    this.visibleEnemyIds.clear();
    const myTeam = this.playerTeam;
    for (const viewer of this.actors) {
      if (!viewer.alive || viewer.team !== myTeam) continue;
      for (const e of this.actors) {
        if (!e.alive || e.team === myTeam) continue;
        if (this.visibleEnemyIds.has(e.id)) continue;
        const fov = viewer.isPlayer ? 110 : AI.fovDeg;
        if (this.canSee(viewer, e, fov)) this.visibleEnemyIds.add(e.id);
      }
    }
  }

  enemiesVisibleToTeam(): Set<number> {
    return this.visibleEnemyIds;
  }

  // ---- hints (from player controller) ----
  setHint(h: string): void {
    this.hint = h;
  }

  // ---- spectate / take over (after death) ----

  // The actor whose eyes the camera looks through: the controlled player while
  // alive, otherwise the spectated teammate.
  private viewActor(): Actor {
    if (this.player.alive) return this.player;
    if (this.spectateTarget && this.spectateTarget.alive && this.spectateTarget.team === this.player.team) {
      return this.spectateTarget;
    }
    return this.player;
  }

  private aliveTeammates(): Actor[] {
    return this.actors.filter((a) => a.alive && a.team === this.player.team && a !== this.player);
  }

  // Keep a valid spectate target (called each dead frame).
  ensureSpectate(): void {
    if (this.spectateTarget && this.spectateTarget.alive && this.spectateTarget.team === this.player.team) return;
    this.spectateTarget = this.aliveTeammates()[0] ?? null;
  }

  spectateCycle(dir: number): void {
    const mates = this.aliveTeammates();
    if (!mates.length) {
      this.spectateTarget = null;
      return;
    }
    const cur = this.spectateTarget ? mates.indexOf(this.spectateTarget) : -1;
    const next = (((cur + (dir >= 0 ? 1 : -1)) % mates.length) + mates.length) % mates.length;
    this.spectateTarget = mates[next];
  }

  // Assume control of the spectated teammate: it stops being AI-driven and
  // becomes the player-controlled actor.
  takeOver(): boolean {
    const t = this.spectateTarget;
    if (!t || !t.alive || t.team !== this.player.team) return false;
    this.player.isPlayer = false;
    t.isPlayer = true;
    t.eyeH = PLAYER.eyeHeight;
    t.moveX = t.moveZ = 0;
    t.wantJump = false;
    t.scoped = false;
    t.kickPitch = t.kickYaw = 0;
    this.player = t;
    this.spectateTarget = null;
    this.equip(t, t.current); // build the first-person viewmodel for the new actor
    return true;
  }

  // ---- visuals ----

  private updateActorsVisual(dt: number): void {
    const view = this.viewActor();
    for (const a of this.actors) {
      if (a.blob) {
        a.blob.visible = a.alive && a !== view;
        a.blob.position.set(a.x, a.y + 0.02, a.z);
      }
      if (!a.rig) continue;
      if (!a.alive) {
        // corpse in its fallen pose (hidden only if we are looking from it)
        a.rig.root.visible = a !== view;
        a.rig.root.position.set(a.x, a.rig.root.position.y, a.z);
        continue;
      }
      // hide the body we are looking through (first person)
      a.rig.root.visible = a !== view;
      a.rig.root.position.set(a.x, a.y, a.z);
      a.rig.root.rotation.set(0, a.yaw, 0);
      const speed = Math.hypot(a.vx, a.vz);
      a.animTime += dt;
      animateCharacter(a.rig, speed, a.animTime, false);
      a.rig.root.position.y = a.y + a.rig.root.position.y; // add bob (animateCharacter set root.y to bob)
    }
    // footsteps
    for (const a of this.actors) {
      if (!a.alive || !a.grounded) continue;
      const speed = Math.hypot(a.vx, a.vz);
      if (speed > 1.5) {
        a.footDist += speed * dt;
        if (a.footDist > 2.4) {
          a.footDist = 0;
          if (a.isPlayer) this.audio.footstep();
          else this.audio.footstep(a.x, a.z);
        }
      }
    }
  }

  private updateCamera(dt: number): void {
    const p = this.viewActor(); // player while alive, spectated teammate while dead
    const controlling = this.player.alive;
    const eye = p.eyeH;
    // slight view bob
    const speed = Math.hypot(p.vx, p.vz);
    const bob = p.grounded && speed > 1 ? Math.sin(this.time * 10) * 0.03 * (speed / PLAYER.runSpeed) : 0;
    this.camera.position.set(p.x, p.y + eye + bob, p.z);
    this.camera.rotation.set(
      clamp(p.pitch + p.kickPitch, -PITCH_LIMIT, PITCH_LIMIT),
      p.yaw + p.kickYaw,
      0,
    );

    // fov for scope (only the controlled player scopes)
    const wantFov = controlling && this.player.scoped ? (WEAPONS[this.player.current].scopedFov ?? 30) : this.baseFov;
    this.camera.fov += (wantFov - this.camera.fov) * Math.min(1, dt * 12);
    this.camera.updateProjectionMatrix();

    // viewmodel recoil + reload pose (hidden while spectating)
    this.vmRecoil = Math.max(0, this.vmRecoil - dt * 0.9);
    const rl = this.player.reloadEnd > 0 ? 1 : 0;
    this.viewmodel.visible = controlling && !this.player.scoped;
    const child = this.viewmodel.children[0] as THREE.Group | undefined;
    if (child && controlling) {
      const bobX = Math.sin(this.time * 10) * 0.006 * (speed / PLAYER.runSpeed);
      const bobY = Math.abs(Math.cos(this.time * 10)) * 0.006 * (speed / PLAYER.runSpeed);
      child.position.set(0.22 + bobX, -0.2 + bobY - rl * 0.12, -0.48 + this.vmRecoil);
      child.rotation.set(this.vmRecoil * 1.4 - rl * 0.5, 0.05, 0);
    }
  }

  // ---- minimap ----

  private buildMinimapStatic(): void {
    const g = this.grid;
    const c = document.createElement('canvas');
    c.width = g.cols;
    c.height = g.rows;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(10,12,16,0)';
    ctx.clearRect(0, 0, g.cols, g.rows);
    for (let cz = 0; cz < g.rows; cz++) {
      for (let cx = 0; cx < g.cols; cx++) {
        if (g.isFloor(cx, cz)) {
          const reg = g.regionAt(cx, cz);
          ctx.fillStyle = reg === Region.ASite ? '#5c3330' : reg === Region.BSite ? '#2d4757' : '#3b3730';
          ctx.fillRect(cx, cz, 1, 1);
        }
      }
    }
    this.minimapStatic = c;
  }

  private drawMinimap(): void {
    const canvas = this.minimapCanvas;
    if (!canvas || !this.minimapStatic) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.minimapStatic, 0, 0, W, H);

    const { minX, maxX, minZ, maxZ } = this.dust2.bounds;
    const toPx = (x: number, z: number): [number, number] => [
      ((x - minX) / (maxX - minX)) * W,
      ((z - minZ) / (maxZ - minZ)) * H,
    ];

    // bomb
    const b = this.bomb;
    if (b.state === BombState.Planted || b.state === BombState.Dropped) {
      const [bx, by] = toPx(b.x, b.z);
      ctx.fillStyle = b.state === BombState.Planted ? '#ff3b30' : '#ffcc00';
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const vis = this.visibleEnemyIds;
    for (const a of this.actors) {
      if (!a.alive) continue;
      const [px, py] = toPx(a.x, a.z);
      if (a.isPlayer) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-a.yaw);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(3.5, 4);
        ctx.lineTo(-3.5, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (a.team === this.playerTeam) {
        ctx.fillStyle = '#39d353';
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (vis.has(a.id)) {
        ctx.fillStyle = '#ff453a';
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ---- HUD ----

  private syncHud(): void {
    // When dead and spectating a teammate, mirror their vitals/weapon.
    const view = this.viewActor();
    const controlling = this.player.alive;
    const spectating = !controlling && view.alive && view !== this.player;
    const p = spectating ? view : this.player;
    const w = WEAPONS[p.current];
    const ammo = p.ammo[p.current];
    const b = this.bomb;
    hud.set({
      phase: this.phase,
      roundNum: this.roundNum,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      roundTime: Math.max(0, this.roundTimer),
      aliveT: this.countAlive(Team.T),
      aliveCT: this.countAlive(Team.CT),
      alive: this.player.alive,
      spectating,
      spectateName: spectating ? view.name : '',
      health: Math.max(0, Math.ceil(p.health)),
      armor: Math.max(0, Math.ceil(p.armor)),
      helmet: p.helmet,
      weaponName: w.name,
      weaponId: p.current,
      mag: ammo ? ammo.mag : 0,
      reserve: ammo ? ammo.reserve : 0,
      infiniteAmmo: w.isKnife,
      reloading: p.reloadEnd > 0,
      scoped: p.scoped,
      spread: w.baseSpread + p.spread + this.moveInaccuracy(p),
      hasBomb: p.hasBomb,
      bombPlanted: b.state === BombState.Planted,
      bombTimer: Math.max(0, b.timer),
      defusing: b.defuseProgress > 0.05 && b.state === BombState.Planted,
      defuseProgress: b.defuseProgress / ROUND.defuseTime,
      planting: b.plantProgress > 0.05 && b.state === BombState.Carried,
      plantProgress: b.plantProgress / ROUND.plantTime,
      hint: this.hint,
      banner: this.banner || (this.phase === RoundPhase.Freeze ? `Round ${this.roundNum}` : ''),
      killfeed: this.killfeed.slice(),
      loadout: p.weapons.map((id) => ({
        id,
        name: WEAPONS[id].name,
        slot: WEAPONS[id].slot,
        mag: p.ammo[id]?.mag ?? 0,
        reserve: p.ammo[id]?.reserve ?? 0,
        current: id === p.current,
      })),
    });
  }

  private syncHudFull(): void {
    this.syncHud();
  }

  // ---- lifecycle ----

  resize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.input.dispose();
    this.renderer.dispose();
    this.audio.muted = true;
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

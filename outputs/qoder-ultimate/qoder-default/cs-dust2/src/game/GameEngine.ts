import * as THREE from 'three';
import { GameMap } from './map/dust2';
import { Navigation } from './ai/navigation';
import { AudioEngine } from './audio/AudioEngine';
import { Input } from './input';
import { Actor, EYE_HEIGHT, PLAYER_RADIUS } from './entities/actor';
import { AIController, AICtx } from './ai/aiController';
import { buildViewModel } from './weapons/viewmodel';
import { animateHumanoid } from './characters/humanoid';
import { hitscan, applyDamage } from './combat';
import {
  Loadout,
  pistolRoundLoadout,
  rifleLoadout,
  WEAPONS,
} from './weapons/weapons';
import { RoundState, Team, WeaponSlot, V, clamp } from './types';
import { gameStore, KillEvent, MinimapDot } from '../store';

const GRAVITY = 22;
const JUMP_VEL = 7.2;
const MOVE_SPEED = 5.4;
const SCOPE_SPEED = 1.7;
const SENS = 0.0022;
const PLANT_TIME = 3.2;
const DEFUSE_TIME = 5.0;
const BOMB_TIME = 40;
const FREEZE_TIME = 2.5;
const ROUND_TIME = 115;
const END_TIME = 4.5;

const T_NAMES = ['Vitaliy', 'Marco', 'Deniz', 'Igor', 'Sasha'];
const CT_NAMES = ['Falcon', 'Reaper', 'Ghost', 'Viper', 'Nomad'];

export class GameEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private container: HTMLElement;

  map: GameMap;
  nav: Navigation;
  audio: AudioEngine;
  input: Input;
  ai = new AIController();

  actors: Actor[] = [];
  controlled!: Actor;
  private viewModel: THREE.Group | null = null;
  private viewModelSlot: WeaponSlot | null = null;

  round: RoundState = {
    phase: 'freezetime',
    roundNumber: 1,
    isPistolRound: true,
    scoreCT: 0,
    scoreT: 0,
    timeLeft: FREEZE_TIME,
    bombPlanted: false,
    bombTimer: BOMB_TIME,
    winner: null,
    winReason: '',
  };

  // bomb
  private bombCarrier: Actor | null = null;
  private bombDropped: THREE.Vector3 | null = null;
  private bombPlanted: THREE.Vector3 | null = null;
  private bombSite: 'A' | 'B' | null = null;
  private bombMesh: THREE.Mesh;
  private lastBeep = 0;
  private endTimer = 0;

  private kills: KillEvent[] = [];
  private killId = 0;
  private tracers: { line: THREE.Line; until: number }[] = [];
  private prevFire = false;
  private prevScope = false;
  private time = 0;
  private raf = 0;
  private message = '';
  private messageUntil = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fb8d0);
    this.scene.fog = new THREE.Fog(0x9fb8d0, 60, 150);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.05,
      500
    );

    this.setupLights();

    this.map = new GameMap();
    this.map.build(this.scene);
    this.nav = new Navigation(this.map);
    this.audio = new AudioEngine();
    this.input = new Input(this.renderer.domElement);
    this.input.onKeyPress = (c) => this.onKey(c);

    // bomb mesh
    this.bombMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.24, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x330000 })
    );
    this.bombMesh.visible = false;
    this.scene.add(this.bombMesh);

    this.createActors();
    window.addEventListener('resize', this.onResize);
  }

  private setupLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8a7a5a, 0.9);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d0, 1.1);
    sun.position.set(40, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = 90;
    sun.shadow.camera.left = -s;
    sun.shadow.camera.right = s;
    sun.shadow.camera.top = s;
    sun.shadow.camera.bottom = -s;
    sun.shadow.camera.far = 220;
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  }

  private createActors() {
    let id = 0;
    for (let i = 0; i < 5; i++) {
      const t = new Actor(id++, T_NAMES[i], 'T', pistolRoundLoadout('T'));
      this.actors.push(t);
      this.scene.add(t.model);
    }
    for (let i = 0; i < 5; i++) {
      const ct = new Actor(id++, CT_NAMES[i], 'CT', pistolRoundLoadout('CT'));
      this.actors.push(ct);
      this.scene.add(ct.model);
    }
    // player controls first T
    this.controlled = this.actors[0];
    this.controlled.name = 'You';
    this.setControlled(this.controlled);
  }

  start() {
    this.audio.init();
    this.audio.resume();
    this.input.requestLock();
    this.startRound(true);
    gameStore.set({ started: true });
    this.clock.start();
    this.loop();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    let dt = this.clock.getDelta();
    dt = Math.min(dt, 0.05);
    this.time += dt;
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  // ---------------- Round lifecycle ----------------
  private startRound(first = false) {
    const isPistol = this.round.roundNumber === 1;
    this.round.phase = 'freezetime';
    this.round.timeLeft = FREEZE_TIME;
    this.round.isPistolRound = isPistol;
    this.round.bombPlanted = false;
    this.round.bombTimer = BOMB_TIME;
    this.round.winner = null;
    this.round.winReason = '';
    this.bombDropped = null;
    this.bombPlanted = null;
    this.bombSite = null;
    this.bombMesh.visible = false;

    const tSpawns = this.map.spawnPoints('T');
    const ctSpawns = this.map.spawnPoints('CT');
    let ti = 0;
    let ci = 0;
    for (const a of this.actors) {
      const loadout: Loadout = isPistol
        ? pistolRoundLoadout(a.team)
        : rifleLoadout(a.team);
      const spawn = a.team === 'T' ? tSpawns[ti++] : ctSpawns[ci++];
      a.reset(spawn, loadout);
      a.armor = isPistol ? 0 : 100;
      a.helmet = !isPistol;
      a.hasBomb = false;
    }
    // assign bomb to a random T
    const ts = this.actors.filter((a) => a.team === 'T');
    this.bombCarrier = ts[Math.floor(Math.random() * ts.length)];
    this.bombCarrier.hasBomb = true;

    this.setMessage(isPistol ? 'PISTOL ROUND' : `ROUND ${this.round.roundNumber}`, 2.5);
  }

  private endRound(winner: Team, reason: string) {
    if (this.round.phase === 'ended') return;
    this.round.phase = 'ended';
    this.round.winner = winner;
    this.round.winReason = reason;
    if (winner === 'CT') this.round.scoreCT++;
    else this.round.scoreT++;
    this.endTimer = END_TIME;
    this.audio.roundWin(winner === this.controlled.team);
    this.setMessage(`${winner} WIN — ${reason}`, END_TIME);
  }

  private setMessage(m: string, dur: number) {
    this.message = m;
    this.messageUntil = this.time + dur;
  }

  // ---------------- Control / spectate ----------------
  setControlled(actor: Actor) {
    for (const a of this.actors) a.isPlayer = false;
    actor.isPlayer = true;
    this.controlled = actor;
    actor.model.visible = false;
    for (const a of this.actors) if (a !== actor && a.alive) a.model.visible = true;
    this.buildViewModelFor(actor);
  }

  private cycleControl() {
    const mates = this.actors.filter(
      (a) => a.team === this.controlled.team && a.alive && a !== this.controlled
    );
    if (mates.length) {
      this.controlled.model.visible = this.controlled.alive;
      this.setControlled(mates[0]);
      this.setMessage(`CONTROLLING ${this.controlled.name}`, 1.5);
    }
  }

  private handleControlledDeath() {
    const mates = this.actors.filter(
      (a) => a.team === this.controlled.team && a.alive
    );
    if (mates.length) {
      this.setControlled(mates[0]);
      this.setMessage(`TAKING OVER ${this.controlled.name}`, 2);
    }
  }

  private buildViewModelFor(actor: Actor) {
    if (this.viewModel) {
      this.camera.remove(this.viewModel);
      this.viewModel = null;
    }
    const vm = buildViewModel(actor.currentWeaponId());
    vm.position.set(0.22, -0.2, -0.35);
    this.camera.add(vm);
    this.viewModel = vm;
    this.viewModelSlot = actor.currentSlot;
  }

  // ---------------- Input events ----------------
  private onKey(code: string) {
    if (!this.controlled) return;
    const p = this.controlled;
    if (code === 'Digit1' && p.canSwitchTo('primary')) this.switchSlot('primary');
    if (code === 'Digit2' && p.canSwitchTo('secondary')) this.switchSlot('secondary');
    if (code === 'Digit3') this.switchSlot('melee');
    if (code === 'KeyR') this.startReload(p);
    if (code === 'KeyV') this.cycleControl();
    if (code === 'KeyQ') {
      // quick knife/pistol swap
      this.switchSlot(p.currentSlot === 'melee' ? 'secondary' : 'melee');
    }
  }

  private switchSlot(slot: WeaponSlot) {
    const p = this.controlled;
    if (!p.canSwitchTo(slot)) return;
    if (p.currentSlot === slot) return;
    p.currentSlot = slot;
    p.reloading = false;
    p.scoped = false;
    this.buildViewModelFor(p);
  }

  // ---------------- Main update ----------------
  private update(dt: number) {
    this.updateRoundTimers(dt);

    if (!this.input.locked) {
      // still render, but pause control
    }

    // player control
    if (this.controlled.alive && this.round.phase !== 'ended') {
      this.updatePlayer(dt);
    } else {
      this.updateSpectatorCamera(dt);
    }

    // AI + physics for everyone else
    const ctx: AICtx = {
      actors: this.actors,
      map: this.map,
      nav: this.nav,
      round: this.round,
      bombPos: this.bombPlanted,
      bombSite: this.bombSite,
      time: this.time,
      dt,
      tryFire: (bot) => this.tryFire(bot),
      move: (a, wish, run, d) => this.moveActor(a, wish, run, d),
    };

    for (const a of this.actors) {
      if (!a.alive) continue;
      this.updateReload(a);
      const def = a.currentWeapon();
      a.spread = Math.max(0, a.spread - def.recovery * dt);
      if (a !== this.controlled && this.round.phase === 'live') {
        this.ai.update(a, ctx);
      }
      // plant/defuse progress for anyone
      this.updatePlantDefuse(a, dt);
      this.updateModel(a, dt);
    }

    this.updateBomb(dt);
    this.updateTracers();
    this.checkWinConditions();
    this.syncStore(dt);
  }

  private updateRoundTimers(dt: number) {
    const r = this.round;
    if (r.phase === 'freezetime') {
      r.timeLeft -= dt;
      if (r.timeLeft <= 0) {
        r.phase = 'live';
        r.timeLeft = ROUND_TIME;
      }
    } else if (r.phase === 'live') {
      if (!r.bombPlanted) {
        r.timeLeft -= dt;
        if (r.timeLeft <= 0) {
          this.endRound('CT', 'Time ran out');
        }
      }
    } else if (r.phase === 'ended') {
      this.endTimer -= dt;
      if (this.endTimer <= 0) {
        r.roundNumber++;
        // ensure someone controllable next round: keep same controlled slot index
        this.startRound();
      }
    }
  }

  private updatePlayer(dt: number) {
    const p = this.controlled;
    const { dx, dy } = this.input.consumeMouse();
    const sens = p.scoped ? SENS * 0.4 : SENS;
    p.yaw -= dx * sens;
    p.pitch -= dy * sens;
    p.pitch = clamp(p.pitch, -1.4, 1.4);

    // movement
    const k = this.input.keys;
    const fwd = V(Math.sin(p.yaw), 0, Math.cos(p.yaw));
    const right = V(Math.cos(p.yaw), 0, -Math.sin(p.yaw));
    const wish = V();
    if (this.round.phase !== 'freezetime') {
      if (k['KeyW']) wish.add(fwd);
      if (k['KeyS']) wish.sub(fwd);
      if (k['KeyD']) wish.add(right);
      if (k['KeyA']) wish.sub(right);
    }
    if (wish.lengthSq() > 0) wish.normalize();
    // jump
    if (k['Space'] && p.onGround && this.round.phase !== 'freezetime') {
      p.vel.y = JUMP_VEL;
      p.onGround = false;
    }
    this.moveActor(p, wish, false, dt);

    // scope (AWP)
    const def = p.currentWeapon();
    const wantScope = this.input.rightDown && !!def.canScope;
    if (wantScope !== p.scoped) {
      p.scoped = wantScope;
      this.audio.scope();
    }

    // firing
    if (this.round.phase === 'live' || this.round.phase === 'freezetime') {
      const canFireNow = this.round.phase === 'live';
      const firing = this.input.mouseDown && canFireNow;
      if (firing) {
        if (def.automatic) {
          this.tryFire(p);
        } else if (!this.prevFire) {
          this.tryFire(p);
        }
      }
      this.prevFire = this.input.mouseDown;
    }

    // plant / defuse (hold E)
    p.wantPlant = false;
    p.wantDefuse = false;
    if (k['KeyE'] && this.round.phase === 'live') {
      if (p.team === 'T' && p.hasBomb && !this.round.bombPlanted) {
        const site = this.map.nearestSite(p.pos.x, p.pos.z);
        if (this.map.siteContains(site, p.pos.x, p.pos.z)) p.wantPlant = true;
      } else if (
        p.team === 'CT' &&
        this.round.bombPlanted &&
        this.bombPlanted &&
        p.pos.distanceTo(this.bombPlanted) < 2.2
      ) {
        p.wantDefuse = true;
      }
    }

    // camera
    this.updateCamera(p, dt);
  }

  private updateCamera(p: Actor, dt: number) {
    const eye = p.eyePos();
    this.camera.position.copy(eye);
    const dir = p.aimDir();
    this.camera.lookAt(eye.x + dir.x, eye.y + dir.y, eye.z + dir.z);
    // scope fov
    const targetFov = p.scoped ? 24 : 75;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 14);
    this.camera.updateProjectionMatrix();
    // viewmodel recoil recover + bob
    if (this.viewModel) {
      this.viewModel.visible = !p.scoped;
      const bob = Math.sin(this.time * 10) * (p.vel.lengthSq() > 1 ? 0.006 : 0.001);
      this.viewModel.position.y += ((-0.2 + bob) - this.viewModel.position.y) * 0.3;
      this.viewModel.position.z += (-0.35 - this.viewModel.position.z) * 0.3;
      this.viewModel.rotation.x += (0 - this.viewModel.rotation.x) * 0.25;
    }
  }

  private updateSpectatorCamera(dt: number) {
    // follow a living teammate or last controlled
    const follow =
      this.actors.find((a) => a.team === this.controlled.team && a.alive) ||
      this.controlled;
    const eye = follow.eyePos();
    const behind = V(-Math.sin(follow.yaw), 0, -Math.cos(follow.yaw)).multiplyScalar(3.5);
    this.camera.position.set(eye.x + behind.x, eye.y + 2, eye.z + behind.z);
    this.camera.lookAt(eye.x, eye.y, eye.z);
    this.camera.fov += (75 - this.camera.fov) * Math.min(1, dt * 10);
    this.camera.updateProjectionMatrix();
  }

  // ---------------- Movement / physics ----------------
  private moveActor(a: Actor, wish: THREE.Vector3, run: boolean, dt: number) {
    let speed = MOVE_SPEED;
    if (a === this.controlled && a.scoped) speed = SCOPE_SPEED;
    if (a.isBot && a.mode === 'engage') speed = MOVE_SPEED * 0.75;
    const vx = wish.x * speed;
    const vz = wish.z * speed;
    let nx = a.pos.x + vx * dt;
    let nz = a.pos.z + vz * dt;
    [nx, nz] = this.map.resolveCircle(nx, nz, PLAYER_RADIUS);
    a.pos.x = nx;
    a.pos.z = nz;
    // vertical
    if (!a.onGround || a.vel.y !== 0) {
      a.vel.y -= GRAVITY * dt;
      a.pos.y += a.vel.y * dt;
      if (a.pos.y <= 0) {
        a.pos.y = 0;
        a.vel.y = 0;
        a.onGround = true;
      }
    }
    // walk animation phase
    const moving = vx * vx + vz * vz > 0.5;
    if (moving) {
      a.walkPhase += dt;
      // footsteps
      if (a.onGround && Math.floor(a.walkPhase * 3) !== Math.floor((a.walkPhase - dt) * 3)) {
        const d = this.controlled ? a.pos.distanceTo(this.controlled.pos) : 0;
        if (a === this.controlled || d < 30) this.audio.footstep(d);
      }
    }
    a.vel.x = vx;
    a.vel.z = vz;
  }

  private updateModel(a: Actor, dt: number) {
    a.model.position.set(a.pos.x, a.pos.y, a.pos.z);
    a.model.rotation.y = a.yaw;
    // tilt head/torso by pitch a little
    a.parts.head.rotation.x = -a.pitch * 0.6;
    const moving = a.vel.x * a.vel.x + a.vel.z * a.vel.z > 0.5;
    animateHumanoid(a.parts, moving, a.walkPhase);
    a.model.visible = a.alive && a !== this.controlled;
  }

  // ---------------- Weapons / firing ----------------
  private startReload(a: Actor) {
    const def = a.currentWeapon();
    if (def.slot === 'melee') return;
    const ammo = a.currentAmmo();
    if (a.reloading || ammo.mag >= def.magSize || ammo.reserve <= 0) return;
    a.reloading = true;
    a.reloadEnd = this.time + def.reloadTime;
    if (a === this.controlled || a.pos.distanceTo(this.controlled.pos) < 20)
      this.audio.reload();
  }

  private updateReload(a: Actor) {
    if (!a.reloading) return;
    if (this.time >= a.reloadEnd) {
      const def = a.currentWeapon();
      const ammo = a.currentAmmo();
      const need = def.magSize - ammo.mag;
      const take = Math.min(need, ammo.reserve);
      ammo.mag += take;
      ammo.reserve -= take;
      a.reloading = false;
    }
  }

  private tryFire(a: Actor) {
    if (!a.alive || this.round.phase === 'ended') return;
    const def = a.currentWeapon();
    const ammo = a.currentAmmo();
    const rate = 60 / def.rpm;
    if (this.time - a.lastShot < rate) return;
    if (a.reloading) {
      if (a === this.controlled) return;
      return;
    }
    if (def.slot !== 'melee' && ammo.mag <= 0) {
      this.startReload(a);
      return;
    }
    a.lastShot = this.time;
    if (isFinite(ammo.mag)) ammo.mag--;

    // aim direction with spread
    const baseDir = a.aimDir();
    const spread = def.maxSpread === 0 ? 0 : Math.min(def.maxSpread, a.spread) +
      (a.scoped ? 0 : def.bloomPerShot * 0.5);
    const dir = this.applySpread(baseDir, spread);
    const eye = a.eyePos();

    // audio (spatial-ish by distance to controlled)
    const listenDist = a.pos.distanceTo(this.controlled.pos);
    this.audio.gunshot(def.id, a === this.controlled ? 0 : listenDist);

    // recoil
    a.pitch += def.recoilVertical;
    a.yaw += (Math.random() - 0.5) * def.recoilHorizontal * 2;
    a.spread = Math.min(def.maxSpread, a.spread + def.bloomPerShot);
    if (a === this.controlled && this.viewModel) {
      this.viewModel.position.z += 0.06;
      this.viewModel.rotation.x += def.recoilVertical * 1.5;
    }

    // hitscan
    const result = hitscan(eye, dir, a, this.actors, this.map, def.range);
    let hitPoint = eye.clone().add(dir.clone().multiplyScalar(def.range));
    if (result) {
      hitPoint = result.point;
      const dmg = applyDamage(
        result.actor,
        def.damage,
        result.zone,
        result.dist,
        def.falloff,
        def.armorPen
      );
      if (a === this.controlled) {
        gameStore.set({ hitMarker: performance.now() });
        this.audio.hit(dmg.headshot);
      }
      if (result.actor === this.controlled) {
        this.audio.hurt();
        gameStore.set({ damageFlash: performance.now() });
      }
      if (dmg.killed) {
        this.onActorKilled(result.actor, a, def.id, dmg.headshot);
      }
    }

    // tracer
    if (def.slot !== 'melee') this.spawnTracer(eye, hitPoint);
  }

  private applySpread(dir: THREE.Vector3, spread: number): THREE.Vector3 {
    if (spread <= 0) return dir.clone();
    const yaw = (Math.random() - 0.5) * spread * 2;
    const pitch = (Math.random() - 0.5) * spread * 2;
    // build basis
    const d = dir.clone();
    const right = V(d.z, 0, -d.x).normalize();
    const up = new THREE.Vector3().crossVectors(right, d).normalize();
    return d
      .add(right.multiplyScalar(yaw))
      .add(up.multiplyScalar(pitch))
      .normalize();
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffee88,
      transparent: true,
      opacity: 0.6,
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, until: this.time + 0.05 });
  }

  private updateTracers() {
    this.tracers = this.tracers.filter((t) => {
      if (this.time > t.until) {
        this.scene.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });
  }

  // ---------------- Death / kills ----------------
  private onActorKilled(victim: Actor, killer: Actor, weapon: any, headshot: boolean) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.model.visible = false;
    this.audio.kill();
    const ev: KillEvent = {
      id: this.killId++,
      killer: killer.name,
      victim: victim.name,
      weapon,
      headshot,
      killerTeam: killer.team,
      victimTeam: victim.team,
    };
    this.kills.unshift(ev);
    if (this.kills.length > 6) this.kills.pop();

    // drop bomb
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bombDropped = victim.pos.clone();
      this.bombCarrier = null;
    }

    if (victim === this.controlled) {
      gameStore.set({ damageFlash: performance.now() });
      this.handleControlledDeath();
    }
  }

  // ---------------- Bomb ----------------
  private updateBomb(dt: number) {
    // pick up dropped bomb
    if (this.bombDropped && !this.round.bombPlanted) {
      for (const a of this.actors) {
        if (a.team === 'T' && a.alive && a.pos.distanceTo(this.bombDropped) < 1.5) {
          a.hasBomb = true;
          this.bombCarrier = a;
          this.bombDropped = null;
          break;
        }
      }
    }

    // bomb visual
    if (this.round.bombPlanted && this.bombPlanted) {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(this.bombPlanted.x, 0.2, this.bombPlanted.z);
      // countdown
      this.round.bombTimer -= dt;
      const interval = clamp(this.round.bombTimer / 20, 0.12, 1.0);
      if (this.time - this.lastBeep > interval) {
        this.audio.bombBeep();
        this.lastBeep = this.time;
        const m = this.bombMesh.material as THREE.MeshStandardMaterial;
        m.emissive.setHex(0xff0000);
        setTimeout(() => m.emissive.setHex(0x330000), 80);
      }
      if (this.round.bombTimer <= 0) {
        this.audio.bombExplode(this.controlled.pos.distanceTo(this.bombPlanted));
        this.endRound('T', 'Bomb detonated');
      }
    } else if (this.bombDropped) {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(this.bombDropped.x, 0.15, this.bombDropped.z);
      (this.bombMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x333300);
    } else if (this.bombCarrier) {
      this.bombMesh.visible = false;
    }
  }

  private updatePlantDefuse(a: Actor, dt: number) {
    if (this.round.phase !== 'live') return;
    // PLANT
    if (a.team === 'T' && a.hasBomb && !this.round.bombPlanted) {
      if (a.wantPlant) {
        a.planting += dt;
        if (a === this.controlled && Math.floor(a.planting * 4) !== Math.floor((a.planting - dt) * 4))
          this.audio.bombPlant();
        if (a.planting >= PLANT_TIME) {
          this.round.bombPlanted = true;
          this.bombPlanted = a.pos.clone();
          this.bombSite = this.map.nearestSite(a.pos.x, a.pos.z);
          this.round.bombTimer = BOMB_TIME;
          a.hasBomb = false;
          a.planting = 0;
          this.bombCarrier = null;
          this.audio.bombPlant();
          this.setMessage(`BOMB PLANTED AT ${this.bombSite}`, 2.5);
        }
      } else {
        a.planting = Math.max(0, a.planting - dt * 2);
      }
    }
    // DEFUSE
    if (a.team === 'CT' && this.round.bombPlanted && this.bombPlanted) {
      if (a.wantDefuse && a.pos.distanceTo(this.bombPlanted) < 2.2) {
        a.defusing += dt;
        if (a === this.controlled && Math.floor(a.defusing * 3) !== Math.floor((a.defusing - dt) * 3))
          this.audio.bombDefuseTick();
        if (a.defusing >= DEFUSE_TIME) {
          a.defusing = 0;
          this.endRound('CT', 'Bomb defused');
        }
      } else {
        a.defusing = Math.max(0, a.defusing - dt * 2);
      }
    }
  }

  // ---------------- Win conditions ----------------
  private checkWinConditions() {
    if (this.round.phase !== 'live') return;
    const tAlive = this.actors.filter((a) => a.team === 'T' && a.alive).length;
    const ctAlive = this.actors.filter((a) => a.team === 'CT' && a.alive).length;
    if (ctAlive === 0) {
      this.endRound('T', 'Enemies eliminated');
    } else if (tAlive === 0 && !this.round.bombPlanted) {
      this.endRound('CT', 'Terrorists eliminated');
    }
  }

  // ---------------- Store sync ----------------
  private visibleEnemies(): Set<Actor> {
    const set = new Set<Actor>();
    const myTeam = this.controlled.team;
    const friends = this.actors.filter((a) => a.team === myTeam && a.alive);
    for (const e of this.actors) {
      if (e.team === myTeam || !e.alive) continue;
      for (const f of friends) {
        if (
          f.pos.distanceTo(e.pos) < 70 &&
          this.map.lineOfSight(f.pos.x, f.pos.z, e.pos.x, e.pos.z)
        ) {
          set.add(e);
          break;
        }
      }
    }
    return set;
  }

  private syncStore(dt: number) {
    const p = this.controlled;
    const def = p.currentWeapon();
    const ammo = p.currentAmmo();
    const visible = this.visibleEnemies();

    const minimap: MinimapDot[] = this.actors.map((a) => ({
      x: a.pos.x,
      z: a.pos.z,
      team: a.team,
      isPlayer: a === p,
      alive: a.alive,
      visible: a.team === p.team || visible.has(a),
    }));

    const bombPos = this.round.bombPlanted
      ? this.bombPlanted
      : this.bombDropped;

    const spreadPx =
      12 + (Math.min(def.maxSpread, p.spread) + (p.scoped ? 0 : 0)) * 700;

    gameStore.set({
      health: Math.max(0, Math.round(p.health)),
      armor: Math.round(p.armor),
      helmet: p.helmet,
      weaponName: def.name,
      weaponId: def.id,
      ammo: isFinite(ammo.mag) ? ammo.mag : Infinity as any,
      reserve: ammo.reserve,
      reloading: p.reloading,
      scoped: p.scoped,
      spread: spreadPx,
      team: p.team,
      alive: p.alive,
      spectating: p.alive ? null : p.name,
      kills: this.kills.slice(),
      scoreCT: this.round.scoreCT,
      scoreT: this.round.scoreT,
      roundNumber: this.round.roundNumber,
      isPistolRound: this.round.isPistolRound,
      phase: this.round.phase,
      roundTime: Math.max(0, Math.ceil(this.round.timeLeft)),
      bombPlanted: this.round.bombPlanted,
      bombTimer: Math.max(0, Math.ceil(this.round.bombTimer)),
      hasBomb: p.hasBomb,
      planting: p.planting / PLANT_TIME,
      defusing: p.defusing / DEFUSE_TIME,
      winner: this.round.winner,
      winReason: this.round.winReason,
      alivesCT: this.actors.filter((a) => a.team === 'CT' && a.alive).length,
      alivesT: this.actors.filter((a) => a.team === 'T' && a.alive).length,
      minimap,
      bombPos: bombPos ? { x: bombPos.x, z: bombPos.z } : null,
      message: this.time < this.messageUntil ? this.message : '',
    });

    // rebuild viewmodel if weapon changed
    if (this.viewModelSlot !== p.currentSlot) this.buildViewModelFor(p);
  }

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.input.dispose();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

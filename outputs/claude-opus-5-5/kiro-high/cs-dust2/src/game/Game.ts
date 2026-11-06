// Game orchestrator.
//
// Data flow per animation frame:
//   1. mouse look applied to the controlled soldier (per-frame, lowest latency)
//   2. fixed-timestep simulation (60 Hz): intents (human input / bot brains) -> movement
//      -> weapons -> round & C4 rules -> perception
//   3. render: sync THREE objects from simulation state, world pass + viewmodel pass
//   4. HUD: primitive fields patched into an external store consumed by React
//      (useSyncExternalStore selectors => only changed widgets re-render)

import * as THREE from 'three';
import { buildDust2 } from './world/dust2';
import type { MapData } from './world/MapData';
import { World } from './world/World';
import { NavGrid } from './nav/NavGrid';
import { AudioEngine } from './audio/AudioEngine';
import { Combat } from './core/Combat';
import { RoundManager } from './core/Round';
import { applyMovement } from './core/Movement';
import { TeamPlanner } from './ai/TeamPlanner';
import { BotBrain } from './ai/BotBrain';
import { Soldier } from './entities/Soldier';
import { SoldierModel } from './entities/SoldierModel';
import { ViewModel } from './render/ViewModel';
import { Effects } from './render/Effects';
import { buildMapMeshes, type MapVisuals } from './render/MapMesh';
import { buildC4 } from './render/GunModels';
import { flashTexture } from './render/textures';
import { Input } from './input/Input';
import { Store, initialHud, type HudState, type KillEntry, type ScoreRow } from './store';
import { clearIntent, otherTeam, TEAM_LABEL, type SiteId, type Team } from './types';
import { BASE_FOV, MAX_SUBSTEPS, SIM_DT, PLANT_TIME, BOMB_TIMER } from './config';
import { DEG, clamp, damp, dirFromAngles, rand, wrapAngle, yawToward } from './math';
import { WEAPONS, type WeaponId } from './weapons/WeaponDefs';
import { rectContains } from './world/MapData';

export interface GameOptions {
  team: Team;
  pistolStart: boolean;
  sensitivity: number; // multiplier
  volume: number;
  demo: boolean;
}

const BOT_NAMES: Record<Team, string[]> = {
  T: ['Phoenix', 'Leet', 'Rex', 'Grim', 'Kurt', 'Moe'],
  CT: ['Hawk', 'Shark', 'Tex', 'Wolf', 'Ace', 'Viper'],
};

export type BuyItem = 'rifle' | 'awp' | 'deagle' | 'pistol' | 'armor' | 'kit';

const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpFwd = new THREE.Vector3();

export class Game {
  readonly store = new Store<HudState>(initialHud());
  readonly map: MapData;
  readonly world: World;
  readonly nav: NavGrid;
  readonly audio = new AudioEngine();
  readonly combat: Combat;
  readonly round: RoundManager;
  readonly planner: TeamPlanner;
  readonly soldiers: Soldier[] = [];
  playerSoldier!: Soldier;
  controlled: Soldier | null = null;
  spectateTarget: Soldier | null = null;
  time = 0;
  /** Debug/automation only: simulation speed multiplier (demo fast-forward). */
  timeScale = 1;

  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly viewModel: ViewModel;
  readonly effects: Effects;
  private mapVisuals: MapVisuals;
  private bombMesh: THREE.Group;
  private bombLed: THREE.Mesh;
  private ledUntil = 0;
  private flashMat: THREE.MeshBasicMaterial;

  private input: Input;
  private container: HTMLElement;
  private opts: GameOptions = { team: 'CT', pistolStart: true, sensitivity: 1, volume: 0.7, demo: false };
  private started = false;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private resizeObs: ResizeObserver;

  private killfeed: KillEntry[] = [];
  private killId = 0;
  private msg = { text: '', sub: '', color: '#fff', time: -10 };
  private hitTime = -10;
  private hitHead = false;
  private killTime = -10;
  private damageTime = -10;
  private damageAngle = 0;
  private eyeY = 0;
  private fov = BASE_FOV;
  private buyOpen = false;
  private deathAt = -100;
  private lookDX = 0;
  private lookDY = 0;
  private spotAt = 0;
  private demoSwitchAt = 0;
  private fpsFrames = 0;
  private fpsTime = 0;
  private fps = 0;
  private hudScoreKey = '';
  private hudScore: ScoreRow[] = [];
  private lastViewSoldier: Soldier | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.map = buildDust2();
    this.world = new World(this.map);
    this.nav = new NavGrid(this.world);
    this.combat = new Combat(this);
    this.round = new RoundManager(this);
    this.planner = new TeamPlanner(this);

    // --- renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.domElement.className = 'game-canvas';
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.05, 900);
    this.camera.rotation.order = 'YXZ';

    // --- scene
    this.scene.fog = new THREE.Fog(0xe4d6b8, 80, 300);
    this.scene.background = new THREE.Color(0xe4d6b8);
    this.scene.add(new THREE.HemisphereLight(0xe8efff, 0xb0875a, 1.25));
    const sun = new THREE.DirectionalLight(0xfff0d6, 2.7);
    const cx = this.map.W / 2, cz = this.map.D / 2;
    sun.position.set(cx - 45, 95, cz + 35);
    sun.target.position.set(cx, 0, cz);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    const sc = sun.shadow.camera;
    sc.left = -80;
    sc.right = 80;
    sc.top = 80;
    sc.bottom = -80;
    sc.near = 10;
    sc.far = 260;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    this.scene.add(sun, sun.target);

    this.mapVisuals = buildMapMeshes(this.map);
    this.scene.add(this.mapVisuals.group);

    this.flashMat = new THREE.MeshBasicMaterial({
      map: flashTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.effects = new Effects();
    this.scene.add(this.effects.group);
    this.viewModel = new ViewModel(this.flashMat);

    this.bombMesh = buildC4();
    this.bombMesh.scale.setScalar(1.5);
    this.bombMesh.visible = false;
    this.bombLed = this.bombMesh.userData.led as THREE.Mesh;
    this.scene.add(this.bombMesh);

    this.input = new Input(this.renderer.domElement);
    this.input.onLockChange = (locked) => {
      if (locked) this.audio.unlock();
      this.store.patch({ locked, paused: this.started && !locked && !this.opts.demo && this.round.phase !== 'over' });
    };
    this.input.onKey = (code) => this.onKey(code);

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);
    this.resize();

    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  // ------------------------------------------------------------------ lifecycle
  start(opts: GameOptions) {
    this.opts = opts;
    this.audio.unlock();
    this.audio.setVolume(opts.volume);
    // build rosters
    for (const s of this.soldiers) if (s.model) this.scene.remove(s.model.root);
    this.soldiers.length = 0;
    for (const team of ['T', 'CT'] as Team[]) {
      for (let i = 0; i < 5; i++) {
        const isPlayer = team === opts.team && i === 0 && !opts.demo;
        const s = new Soldier(isPlayer ? '你' : BOT_NAMES[team][i], team, i);
        s.model = new SoldierModel(team, this.flashMat);
        this.scene.add(s.model.root);
        s.brain = new BotBrain(s, this, isPlayer ? 0.7 : rand(0.35, 0.8));
        this.soldiers.push(s);
        if (isPlayer || (opts.demo && team === opts.team && i === 0)) this.playerSoldier = s;
      }
    }
    this.started = true;
    this.round.startMatch(opts.pistolStart);
    this.store.patch({ started: true, playerTeam: opts.team, paused: !opts.demo && !this.input.locked });
    if (!opts.demo) this.input.requestLock();
  }

  requestLock() {
    if (!this.started || this.opts.demo) return;
    this.audio.unlock();
    this.input.requestLock();
  }

  restartMatch() {
    this.killfeed = [];
    this.round.startMatch(this.opts.pistolStart);
    this.store.patch({ paused: !this.opts.demo && !this.input.locked });
  }

  setSensitivity(v: number) {
    this.opts.sensitivity = v;
  }

  setVolume(v: number) {
    this.opts.volume = v;
    this.audio.setVolume(v);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.input.dispose();
    this.audio.dispose();
    this.mapVisuals.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.viewModel.setAspect(w / h);
  }

  // ------------------------------------------------------------------ helpers used by subsystems
  isControlled(s: Soldier): boolean {
    return s === this.controlled && s.human;
  }

  get playerTeam(): Team {
    return this.playerSoldier?.team ?? this.opts.team;
  }

  /** Is there a clear line between the listener and a sound source (for occlusion muffling)? */
  audibleLine(p: THREE.Vector3): boolean {
    const c = this.camera.position;
    return this.world.segmentClear(c.x, c.y, c.z, p.x, p.y, p.z);
  }

  viewMuzzle(out: THREE.Vector3): THREE.Vector3 {
    this.viewModel.muzzleCameraSpace(out);
    // viewmodel camera sits at origin looking -Z: its space == main camera local space
    this.camera.updateMatrixWorld();
    return out.applyMatrix4(this.camera.matrixWorld);
  }

  emitNoise(src: Soldier, pos: THREE.Vector3, radius: number) {
    for (const s of this.soldiers) {
      if (!s.alive || s.team === src.team || !s.brain || s.human) continue;
      if (s.pos.distanceTo(pos) < radius) s.brain.hear(pos);
    }
  }

  message(text: string, sub = '', color = '#fff') {
    this.msg = { text, sub, color, time: this.time };
  }

  // ------------------------------------------------------------------ event hooks
  onRoundStart() {
    for (const s of this.soldiers) s.human = false;
    if (!this.opts.demo) {
      this.playerSoldier.human = true;
      this.controlled = this.playerSoldier;
    } else {
      this.controlled = null;
    }
    this.spectateTarget = this.opts.demo ? this.playerSoldier : null;
    this.deathAt = -100;
    this.buyOpen = false;
    this.viewModel.setTeam(this.playerTeam);
    this.viewModel.reset();
    this.planner.planRound();
    this.effects.clearDecals();
    this.killfeed = this.killfeed.filter((k) => this.time - k.time < 3);
    if (this.controlled) this.eyeY = this.controlled.pos.y + this.controlled.eyeHeight;
  }

  onRoundEnd(winner: Team, _reason: string) {
    this.audio.roundEnd(winner === this.playerTeam);
    if (this.round.phase === 'over' && !this.opts.demo) {
      // free the cursor so the "play again" button can be clicked
      setTimeout(() => {
        if (document.pointerLockElement) document.exitPointerLock();
      }, 2500);
    }
  }

  onPlayerHit(head: boolean, armored: boolean) {
    this.hitTime = this.time;
    this.hitHead = head;
    this.audio.hit(head, armored);
  }

  onPlayerHurt(attacker: Soldier | null) {
    this.damageTime = this.time;
    const v = this.controlled;
    if (attacker && v) {
      const a = yawToward(attacker.pos.x - v.pos.x, attacker.pos.z - v.pos.z);
      this.damageAngle = wrapAngle(a - v.yaw);
    } else this.damageAngle = 999;
    this.audio.hurt();
  }

  killSoldier(victim: Soldier, attacker: Soldier | null, weaponName: string, headshot: boolean, dir: THREE.Vector3 | null) {
    victim.alive = false;
    victim.deathTime = this.time;
    victim.deaths++;
    victim.plantProgress = 0;
    victim.defuseProgress = 0;
    const w = victim.weapons[victim.current];
    if (w) {
      w.zoom = 0;
      w.reloadEnd = 0;
    }
    if (dir && victim.model) {
      const fx = -Math.sin(victim.yaw), fz = -Math.cos(victim.yaw);
      victim.model.setDeathDirection(dir.x * fx + dir.z * fz > 0 ? -1 : 1);
    }
    if (attacker && attacker !== victim) {
      attacker.kills++;
      attacker.roundKills++;
      if (headshot) attacker.headshots++;
    }
    if (victim.hasBomb) this.round.dropBomb(victim, null);
    const mine = !!attacker && (attacker === this.controlled || victim === this.controlled);
    this.killfeed = [
      ...this.killfeed.slice(-5),
      {
        id: ++this.killId,
        killer: attacker ? attacker.name : null,
        killerTeam: attacker ? attacker.team : null,
        victim: victim.name,
        victimTeam: victim.team,
        weapon: weaponName,
        headshot,
        time: this.time,
        mine,
      },
    ];
    if (attacker && this.isControlled(attacker)) {
      this.killTime = this.time;
      this.audio.kill(headshot);
    }
    if (victim === this.controlled) {
      this.deathAt = this.time;
      this.spectateTarget = null;
    }
    this.round.checkElimination();
  }

  onBombDropped(_s: Soldier) {
    if (this.playerTeam === 'T') this.message('C4 已掉落', '', '#ffb347');
  }

  onBombPickup(s: Soldier) {
    if (this.isControlled(s)) this.message('你拾取了 C4', '前往 A 点或 B 点安放', '#ffb347');
  }

  onBombPlanted(_s: Soldier, site: SiteId) {
    this.audio.c4Planted();
    this.message('炸弹已安放', `${site} 点 · ${BOMB_TIMER} 秒后爆炸`, '#ff6b5a');
  }

  onBombBeep() {
    this.ledUntil = this.time + 0.08;
  }

  onDefuseStart(s: Soldier) {
    if (s.team !== this.playerTeam && this.playerTeam === 'T') this.message('有人正在拆除炸弹', '', '#ff6b5a');
  }

  onBombDefused(_s: Soldier) {
    this.audio.defused();
  }

  onBombExploded() {
    const p = this.round.bomb.pos;
    this.effects.explode(p);
    this.audio.explosion(this.camera.position.distanceTo(p) < 8 ? null : p);
  }

  // ------------------------------------------------------------------ buy menu
  buy(item: BuyItem) {
    const s = this.controlled;
    if (!s || !s.alive) return;
    const st = this.round.buyStatus();
    if (!st.allowed) return;
    const give = (id: WeaponId) => {
      const slot = WEAPONS[id].slot;
      s.give(id);
      if (s.current !== slot) s.lastSlot = s.current;
      s.current = slot;
      s.drawStart = this.time;
      s.drawEnd = this.time + WEAPONS[id].drawTime;
      s.punchPitch = s.punchYaw = 0;
      this.audio.draw();
    };
    switch (item) {
      case 'rifle':
        give(s.team === 'T' ? 'ak47' : 'm4a4');
        break;
      case 'awp':
        give('awp');
        break;
      case 'deagle':
        give('deagle');
        break;
      case 'pistol':
        give(s.team === 'T' ? 'glock' : 'usp');
        break;
      case 'armor':
        s.armor = 100;
        s.helmet = true;
        break;
      case 'kit':
        if (s.team === 'CT') s.kit = true;
        break;
    }
    this.audio.uiClick();
  }

  private onKey(code: string) {
    if (!this.started) return;
    if (code === 'KeyB' && this.controlled?.alive) {
      this.buyOpen = !this.buyOpen;
      this.audio.uiClick();
    }
    if (this.buyOpen) {
      const map: Record<string, BuyItem> = {
        Digit1: 'rifle',
        Digit2: 'awp',
        Digit3: 'deagle',
        Digit4: 'pistol',
        Digit5: 'armor',
        Digit6: 'kit',
      };
      const item = map[code];
      if (item) {
        this.buy(item);
        // swallow the digit so it doesn't also switch weapons
        this.input.take(code);
      }
      if (code === 'Escape') this.buyOpen = false;
    }
    if (code === 'F8' && this.round.phase === 'over') this.restartMatch();
  }

  // ------------------------------------------------------------------ main loop
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;

    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsTime);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }

    const simulate = this.started && (this.input.locked || this.opts.demo);
    if (simulate) {
      this.applyLook();
      this.acc += dt * this.timeScale;
      let steps = 0;
      while (this.acc >= SIM_DT && steps < MAX_SUBSTEPS * this.timeScale) {
        this.step(SIM_DT);
        this.acc -= SIM_DT;
        steps++;
      }
      if (steps >= MAX_SUBSTEPS * this.timeScale) this.acc = 0;
    } else {
      this.input.takeLook();
      this.acc = 0;
    }
    this.render(dt);
    this.publishHud();
  };

  private applyLook() {
    const [dx, dy] = this.input.takeLook();
    this.lookDX = dx;
    this.lookDY = dy;
    const s = this.controlled;
    if (!s || !s.alive) return;
    const w = s.weapons[s.current];
    const zoomMul = w && w.def.scope && w.zoom > 0 ? w.def.scope.fovs[w.zoom - 1] / BASE_FOV : 1;
    const k = 0.0022 * this.opts.sensitivity * zoomMul;
    s.yaw = wrapAngle(s.yaw - dx * k);
    s.pitch = clamp(s.pitch - dy * k, -1.5, 1.5);
  }

  private buildHumanIntent(s: Soldier) {
    const i = clearIntent(s.intent);
    const inp = this.input;
    i.forward = (inp.isDown('KeyW') ? 1 : 0) - (inp.isDown('KeyS') ? 1 : 0);
    i.right = (inp.isDown('KeyD') ? 1 : 0) - (inp.isDown('KeyA') ? 1 : 0);
    i.jump = inp.isDown('Space');
    i.crouch = inp.isDown('KeyC') || inp.isDown('ControlLeft');
    i.walk = inp.isDown('ShiftLeft') || inp.isDown('ShiftRight');
    i.fire = inp.mouseDown0();
    i.firePressed = inp.takeMouse(0);
    i.altPressed = inp.takeMouse(2);
    i.reload = inp.take('KeyR');
    i.use = inp.isDown('KeyE');
    i.dropBomb = inp.take('KeyG');
    if (!this.buyOpen) {
      if (inp.take('Digit1')) i.switchSlot = 'primary';
      else if (inp.take('Digit2')) i.switchSlot = 'secondary';
      else if (inp.take('Digit3')) i.switchSlot = 'melee';
      else if (inp.take('KeyQ')) i.switchSlot = 'last';
    }
    const wheel = inp.takeWheel();
    if (wheel > 0) i.switchSlot = 'next';
    else if (wheel < 0) i.switchSlot = 'prev';
    if (this.buyOpen) {
      i.fire = false;
      i.firePressed = false;
    }
  }

  private spectatorInput() {
    const inp = this.input;
    if (this.opts.demo) {
      if (!this.spectateTarget?.alive || this.time > this.demoSwitchAt) {
        const alive = this.soldiers.filter((s) => s.alive);
        if (alive.length) this.spectateTarget = alive[Math.floor(Math.random() * alive.length)];
        this.demoSwitchAt = this.time + 10;
      }
      return;
    }
    inp.take('KeyE');
    if (this.time - this.deathAt < 1.8) {
      inp.takeMouse(0);
      inp.takeMouse(2);
      return;
    }
    const team = this.playerTeam;
    let pool = this.soldiers.filter((s) => s.alive && s.team === team);
    if (!pool.length) pool = this.soldiers.filter((s) => s.alive);
    if (!pool.length) return;
    if (!this.spectateTarget || !this.spectateTarget.alive || !pool.includes(this.spectateTarget)) this.spectateTarget = pool[0];
    let idx = pool.indexOf(this.spectateTarget);
    if (inp.takeMouse(0)) idx = (idx + 1) % pool.length;
    if (inp.takeMouse(2)) idx = (idx - 1 + pool.length) % pool.length;
    this.spectateTarget = pool[idx];
    if (inp.isDown('KeyE')) {
      const t = this.spectateTarget;
      if (t.team === team && !t.human && this.round.phase !== 'over') this.takeOver(t);
    }
  }

  private takeOver(t: Soldier) {
    t.human = true;
    clearIntent(t.intent);
    this.controlled = t;
    this.spectateTarget = null;
    this.deathAt = -100;
    this.viewModel.reset();
    this.eyeY = t.pos.y + t.eyeHeight;
    this.message(`你接管了 ${t.name}`, '', '#9fe39f');
  }

  private step(dt: number) {
    this.time += dt;
    const t = this.time;
    const round = this.round;
    const c = this.controlled;
    if (c && c.alive && c.human) this.buildHumanIntent(c);
    else this.spectatorInput();

    for (const s of this.soldiers) {
      if (s.alive && !s.human && s.brain) s.brain.think(dt);
      if (!s.alive) clearIntent(s.intent);
    }
    this.planner.update();

    const frozen = round.phase === 'freeze';
    const canAct = !frozen;
    for (const s of this.soldiers) {
      if (!s.alive) continue;
      const planting = s.hasBomb && s.intent.use && !!round.siteAt(s.pos.x, s.pos.z) && round.phase === 'live';
      const defusing = round.bomb.defuser === s;
      const prevGround = s.onGround;
      const mv = applyMovement(s, s.intent, this.world, dt, frozen || planting || defusing, t);
      if (mv.landed > 4) {
        if (this.isControlled(s)) {
          this.audio.land(null);
          this.viewModel.onLand(Math.min(1, mv.landed / 10));
        } else this.audio.land(s.pos);
      }
      // footsteps (silent when walking / crouching)
      const sp = s.horizontalSpeed;
      if (s.onGround && prevGround && sp > 3.4 && !s.intent.walk && s.crouch < 0.5) {
        s.footstepDist += sp * dt;
        if (s.footstepDist > 2.3) {
          s.footstepDist = 0;
          if (this.isControlled(s)) this.audio.footstep(null, 1);
          else this.audio.footstep(s.pos, 1, !this.audibleLine(tmpV.copy(s.pos).setY(s.pos.y + 1)));
          this.emitNoise(s, s.pos, 16);
        }
      }
      this.combat.update(s, s.intent, dt, canAct && !planting && !defusing);
      if (s.intent.dropBomb && s.hasBomb) {
        dirFromAngles(s.yaw, 0, tmpFwd);
        tmpV.copy(s.pos).addScaledVector(tmpFwd, 1.3);
        if (this.nav.isWalkable(tmpV.x, tmpV.z)) round.dropBomb(s, tmpV);
        else round.dropBomb(s, null);
        s.pickupBlockedUntil = t + 1.2; // don't instantly re-pick a tossed bomb
      }
    }

    // soft body separation
    for (let a = 0; a < this.soldiers.length; a++) {
      const A = this.soldiers[a];
      if (!A.alive) continue;
      for (let b = a + 1; b < this.soldiers.length; b++) {
        const B = this.soldiers[b];
        if (!B.alive || Math.abs(A.pos.y - B.pos.y) > 1.5) continue;
        const dx = B.pos.x - A.pos.x, dz = B.pos.z - A.pos.z;
        const d = Math.hypot(dx, dz);
        const min = A.radius + B.radius;
        if (d < min && d > 1e-4) {
          const push = (min - d) * 0.5;
          const nx = dx / d, nz = dz / d;
          A.pos.x -= nx * push;
          A.pos.z -= nz * push;
          B.pos.x += nx * push;
          B.pos.z += nz * push;
          this.world.depenetrate(A);
          this.world.depenetrate(B);
        }
      }
    }

    round.update(dt);
    this.updateSpotting();
  }

  /** Mark enemies visible to the player's team (for the minimap). */
  private updateSpotting() {
    if (this.time < this.spotAt) return;
    this.spotAt = this.time + 0.15;
    const c = this.controlled;
    if (!c || !c.alive || !c.human) return;
    c.eye(tmpV);
    dirFromAngles(c.yaw, c.pitch, tmpFwd);
    for (const o of this.soldiers) {
      if (!o.alive || o.team === c.team) continue;
      o.chest(tmpV2);
      const dx = tmpV2.x - tmpV.x, dy = tmpV2.y - tmpV.y, dz = tmpV2.z - tmpV.z;
      const d = Math.hypot(dx, dy, dz);
      if (d > 120) continue;
      const cos = (dx * tmpFwd.x + dy * tmpFwd.y + dz * tmpFwd.z) / d;
      if (cos < Math.cos(55 * DEG)) continue;
      if (this.world.segmentClear(tmpV.x, tmpV.y, tmpV.z, tmpV2.x, tmpV2.y, tmpV2.z)) o.lastSeenByEnemy = this.time;
    }
  }

  // ------------------------------------------------------------------ rendering
  /** The soldier whose eyes the camera uses (controlled, spectated, or null). */
  get viewSoldier(): Soldier | null {
    const c = this.controlled;
    if (c && c.alive && c.human) return c;
    if (this.spectateTarget && this.spectateTarget.alive) return this.spectateTarget;
    return null;
  }

  private render(dt: number) {
    const v = this.viewSoldier;
    const cam = this.camera;
    if (v !== this.lastViewSoldier) {
      this.lastViewSoldier = v;
      if (v) this.eyeY = v.pos.y + v.eyeHeight;
      this.viewModel.reset();
      if (v) this.viewModel.setTeam(v.team);
    }
    let targetFov = BASE_FOV;
    if (v) {
      const targetEye = v.pos.y + v.eyeHeight;
      // smooth step-ups, follow drops instantly-ish
      this.eyeY = targetEye > this.eyeY ? damp(this.eyeY, targetEye, 16, dt) : damp(this.eyeY, targetEye, 30, dt);
      if (Math.abs(this.eyeY - targetEye) > 1.2) this.eyeY = targetEye;
      cam.position.set(v.pos.x, this.eyeY, v.pos.z);
      const w = v.weapon;
      const vf = w.def.recoil.viewFactor;
      cam.rotation.set(v.pitch + v.punchPitch * DEG * vf, v.yaw + v.punchYaw * DEG * vf, 0);
      if (w.def.scope && w.zoom > 0) targetFov = w.def.scope.fovs[w.zoom - 1];
    } else if (this.started) {
      // death / overview cam: orbit above own corpse or the map center
      const base = this.controlled ?? this.playerSoldier;
      const since = this.time - this.deathAt;
      if (base && since < 3) {
        const h = 1.2 + Math.min(1, since) * 2.8;
        cam.position.set(base.pos.x + 1.5, base.pos.y + h, base.pos.z + 1.5);
        const killer = this.soldiers.find((s) => s.id === base.lastAttackerId && s.alive);
        cam.lookAt(killer ? tmpV.copy(killer.pos).setY(killer.pos.y + 1.2) : base.pos);
      } else {
        const a = this.time * 0.05;
        cam.position.set(this.map.W / 2 + Math.cos(a) * 60, 70, this.map.D / 2 + Math.sin(a) * 60);
        cam.lookAt(this.map.W / 2, 0, this.map.D / 2);
      }
    } else {
      // menu backdrop: slow flyover
      const a = performance.now() * 0.00004;
      cam.position.set(this.map.W / 2 + Math.cos(a) * 70, 55, this.map.D / 2 + Math.sin(a) * 70);
      cam.lookAt(this.map.W / 2, 0, this.map.D / 2);
    }
    // explosion / damage shake
    const shake = this.effects.shake * 0.08 + (this.time - this.damageTime < 0.12 ? 0.004 : 0);
    if (shake > 0) {
      cam.rotation.x += (Math.random() - 0.5) * shake;
      cam.rotation.y += (Math.random() - 0.5) * shake;
    }
    this.fov = damp(this.fov, targetFov, 22, dt);
    if (Math.abs(cam.fov - this.fov) > 0.01) {
      cam.fov = this.fov;
      cam.updateProjectionMatrix();
    }
    cam.updateMatrixWorld();
    dirFromAngles(cam.rotation.y, cam.rotation.x, tmpFwd);
    this.audio.setListener(cam.position, tmpFwd);

    const team = this.playerTeam;
    for (const s of this.soldiers) {
      if (!s.model) continue;
      const firstPerson = s === v;
      s.model.root.visible = !firstPerson;
      if (!firstPerson) s.model.update(s, dt, this.time, s.team === team && this.started, cam.position);
    }

    // C4 prop
    const b = this.round.bomb;
    const showBomb = this.started && (b.state === 'dropped' || b.state === 'planted' || b.state === 'defused');
    this.bombMesh.visible = showBomb;
    if (showBomb) {
      this.bombMesh.position.copy(b.pos).setY(b.pos.y + 0.01);
      this.bombLed.visible = b.state === 'planted' ? this.time < this.ledUntil : b.state === 'dropped';
    }

    this.effects.update(dt, this.time);

    this.renderer.clear();
    this.renderer.render(this.scene, cam);
    if (v) {
      this.viewModel.update(
        {
          weapon: v.weapon,
          time: this.time,
          speed: v.horizontalSpeed,
          onGround: v.onGround,
          crouch: v.crouch,
          scoped: v.scoped,
          drawStart: v.drawStart,
          drawEnd: v.drawEnd,
          lookDX: v === this.controlled ? this.lookDX : 0,
          lookDY: v === this.controlled ? this.lookDY : 0,
        },
        dt,
      );
      if (!v.scoped) {
        this.renderer.clearDepth();
        this.renderer.render(this.viewModel.scene, this.viewModel.camera);
      }
    }
  }

  // ------------------------------------------------------------------ HUD sync
  private publishHud() {
    const v = this.viewSoldier;
    const r = this.round;
    const b = r.bomb;
    const c = this.controlled;
    const controlling = !!c && c.alive && c.human;
    const patch: Partial<HudState> = {
      phase: r.phase,
      round: r.round,
      roundType: r.roundType,
      scoreT: r.score.T,
      scoreCT: r.score.CT,
      timeLeft: Math.ceil(r.phase === 'freeze' ? r.phaseTimer : r.roundTime),
      bombPlanted: b.state === 'planted',
      bombTimeLeft: Math.max(0, Math.ceil(b.timer)),
      aliveT: r.alive('T'),
      aliveCT: r.alive('CT'),
      playerTeam: this.playerTeam,
      fps: this.fps,
      matchWinner: r.matchWinner,
      now: Math.round(this.time * 20) / 20,
    };
    if (v) {
      const w = v.weapon;
      const def = w.def;
      patch.hp = v.health;
      patch.armor = v.armor;
      patch.helmet = v.helmet;
      patch.kit = v.kit;
      patch.hasBomb = v.hasBomb;
      patch.weaponName = def.name;
      patch.weaponId = def.id;
      patch.ammo = w.ammo;
      patch.reserve = w.reserve;
      patch.magSize = def.magSize;
      patch.reloading = w.reloading;
      patch.reloadProgress = w.reloading ? Math.round(clamp((this.time - w.reloadStart) / (w.reloadEnd - w.reloadStart), 0, 1) * 50) / 50 : 0;
      patch.isMelee = def.slot === 'melee';
      patch.activeSlot = v.current;
      patch.slotKey = (['primary', 'secondary', 'melee'] as const).map((sl) => v.weapons[sl]?.def.name ?? '').join('|');
      patch.scoped = v.scoped;
      const spread = this.combat.spreadOf(v, w) * DEG;
      const h = this.container.clientHeight || 800;
      patch.crosshairGap = Math.round(3 + (Math.tan(spread) / Math.tan((this.camera.fov * DEG) / 2)) * (h / 2));
      patch.callout = this.calloutAt(v.pos.x, v.pos.z);
    }
    // spectate state
    if (!controlling && this.spectateTarget?.alive && this.started) {
      patch.spectating = this.spectateTarget.name;
      patch.spectateTeam = this.spectateTarget.team;
      patch.canTakeOver = !this.opts.demo && this.spectateTarget.team === this.playerTeam && !this.spectateTarget.human && r.phase !== 'over';
    } else {
      patch.spectating = '';
      patch.spectateTeam = null;
      patch.canTakeOver = false;
    }
    // progress + hints
    let progressLabel = '';
    let progress = 0;
    let hint = '';
    if (controlling && c) {
      if (c.plantProgress > 0) {
        progressLabel = '正在安放 C4…';
        progress = c.plantProgress / PLANT_TIME;
      } else if (b.defuser === c) {
        progressLabel = c.kit ? '正在拆除 C4（拆弹器）…' : '正在拆除 C4…';
        progress = c.defuseProgress / r.defuseTime(c);
      }
      if (r.phase === 'freeze') hint = r.roundType === 'pistol' ? '手枪局 · 冻结时间' : '冻结时间 · 按 B 打开购买菜单';
      else if (c.hasBomb && r.siteAt(c.pos.x, c.pos.z) && !c.plantProgress) hint = '按住 E 安放 C4';
      else if (c.hasBomb) hint = '你携带着 C4 · 前往 A 点或 B 点（G 丢弃）';
      else if (c.team === 'CT' && b.state === 'planted' && b.defuser !== c && c.pos.distanceTo(b.pos) < 2) hint = '按住 E 拆除 C4';
      else if (c.team === 'T' && b.state === 'dropped' && c.pos.distanceTo(b.pos) < 6) hint = '走到 C4 上拾取';
    } else if (this.started && !this.opts.demo) {
      if (this.time - this.deathAt < 1.8 && this.deathAt > 0) hint = '你已阵亡';
      else if (patch.canTakeOver) hint = '鼠标左/右键切换观察 · 按 E 接管该队友';
      else if (this.spectateTarget) hint = '鼠标左/右键切换观察对象';
    } else if (this.opts.demo) hint = '观战模式 · AI 对战';
    patch.progressLabel = progressLabel;
    patch.progress = Math.round(clamp(progress, 0, 1) * 100) / 100;
    patch.hint = hint;

    // feedback timers
    patch.hitTime = this.hitTime;
    patch.hitHead = this.hitHead;
    patch.killTime = this.killTime;
    patch.damageTime = this.damageTime;
    patch.damageAngle = this.damageAngle;
    patch.centerMsg = this.msg.text;
    patch.centerSub = this.msg.sub;
    patch.centerColor = this.msg.color;
    patch.centerTime = this.msg.time;

    // killfeed (identity preserved unless changed)
    const fresh = this.killfeed.filter((k) => this.time - k.time < 7);
    if (fresh.length !== this.killfeed.length) this.killfeed = fresh;
    patch.killfeed = this.killfeed;

    // buy
    const bs = r.buyStatus();
    if (this.buyOpen && (!c || !c.alive || (!bs.allowed && r.phase !== 'freeze' && r.roundType !== 'pistol'))) {
      if (!bs.allowed && r.roundType !== 'pistol') this.buyOpen = false;
    }
    patch.buyOpen = this.buyOpen && controlling;
    patch.buyAllowed = bs.allowed;
    patch.buyReason = bs.reason;

    // scoreboard (only rebuilt when open and changed)
    const sbOpen = this.started && this.input.isDown('Tab');
    patch.scoreboardOpen = sbOpen;
    if (sbOpen) {
      const key = this.soldiers.map((s) => `${s.kills},${s.deaths},${s.headshots},${s.alive ? 1 : 0},${s.hasBomb ? 1 : 0}`).join(';');
      if (key !== this.hudScoreKey) {
        this.hudScoreKey = key;
        this.hudScore = this.soldiers.map((s) => ({
          name: s.name,
          team: s.team,
          kills: s.kills,
          deaths: s.deaths,
          hs: s.headshots,
          alive: s.alive,
          isPlayer: s === this.playerSoldier,
          bomb: s.hasBomb && s.team === this.playerTeam,
        }));
      }
      patch.scoreboard = this.hudScore;
    }
    this.store.patch(patch);
  }

  calloutAt(x: number, z: number): string {
    for (const c of this.map.callouts) if (rectContains(c.rect, x, z)) return c.name;
    return '';
  }

  // ------------------------------------------------------------------ minimap data access
  /** Whether an enemy (of the player's team) is currently revealed on the radar. */
  isSpotted(s: Soldier): boolean {
    return this.time - s.lastSeenByEnemy < 0.6;
  }

  bombVisibleOnRadar(): boolean {
    const b = this.round.bomb;
    if (b.state === 'planted' || b.state === 'defused') return true;
    if (this.playerTeam === 'T') return b.state === 'dropped' || b.state === 'carried';
    // CT only sees a carried/dropped bomb if the carrier is spotted
    if (b.state === 'carried' && b.carrier) return this.isSpotted(b.carrier);
    return false;
  }

  teamLabel(t: Team): string {
    return TEAM_LABEL[t];
  }

  enemyOf(t: Team): Team {
    return otherTeam(t);
  }
}

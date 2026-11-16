import * as THREE from 'three';
import { GameSim } from './simulation';
import type { Combatant, HudState, KillfeedEntry, PlayerInput, SimEvent, Slot, WeaponId } from './types';
import { emptyInput } from './types';
import { WEAPONS, currentWeaponId, weaponOf } from './weapons';
import { EYE_HEIGHT } from './physics';
import { clamp } from './math';
import type { Vec3 } from './math';
import { GameAudio } from './audio';
import { createRig } from './character';
import type { CharacterRig } from './character';
import { buildGun, disposeGroup } from './viewmodel';
import { sandWallTexture, sandFloorTexture, woodTexture, crateTexture, doorTexture } from './textures';

const STEP = 1 / 60;
const SENS = 0.0022;

interface Tracer { line: THREE.Line; life: number; }
interface Sprite { spr: THREE.Sprite; life: number; maxLife: number; grow: number; }

export interface UiState {
  started: boolean;
  paused: boolean;
}

export class GameEngine {
  sim: GameSim;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private onHud: (h: HudState) => void;
  private onUi: (u: UiState) => void;
  private audio = new GameAudio();
  private rigs: CharacterRig[] = [];
  private rigTeams: ('CT' | 'T')[] = [];
  private clock = new THREE.Clock();
  private acc = 0;
  private keys = new Set<string>();
  private fireHeld = false;
  private firePressed = false;
  private altPressed = false;
  private switchQueue: Slot | null = null;
  private dropQueued = false;
  private locked = false;
  started = false;
  paused = false;
  buyOpen = false;
  scoreboardOpen = false;
  private spectating = false;
  private spectateId = -1;
  private killfeed: KillfeedEntry[] = [];
  private feedSeq = 0;
  private hitmarkerT = 0;
  private hitmarkerHead = false;
  private damageT = 0;
  private shakeT = 0;
  private hudT = 0;
  private vm: THREE.Group | null = null;
  private vmWeapon: WeaponId | null = null;
  private vmKick = 0;
  private vmFlash: THREE.Mesh;
  private vmLight: THREE.PointLight;
  private flashT = 0;
  private tracers: Tracer[] = [];
  private sprites: Sprite[] = [];
  private bombMesh: THREE.Group;
  private bombLight: THREE.Mesh;
  private explosionMesh: THREE.Mesh;
  private explosionLight: THREE.PointLight;
  private explosionT = -1;
  private defuseTickT = 0;
  private minimapBase: HTMLCanvasElement | null = null;
  private minimapCanvas: HTMLCanvasElement | null = null;
  private disposed = false;

  constructor(container: HTMLElement, onHud: (h: HudState) => void, onUi: (u: UiState) => void) {
    this.container = container;
    this.onHud = onHud;
    this.onUi = onUi;
    this.sim = new GameSim({ seed: (Math.random() * 1e9) | 0, playerTeam: 'CT' });

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fc0dd);
    this.scene.fog = new THREE.FogExp2(0xc7c2a8, 0.0038);

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.05, 400);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.buildLights();
    this.buildMapMeshes();
    for (const c of this.sim.combatants) {
      const rig = createRig(c.team);
      this.rigs.push(rig);
      this.rigTeams.push(c.team);
      this.scene.add(rig.group);
    }

    // viewmodel muzzle flash
    this.vmFlash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xffd890, transparent: true, opacity: 0.95, depthWrite: false }),
    );
    this.vmFlash.visible = false;
    this.vmLight = new THREE.PointLight(0xffc060, 0, 8);
    this.camera.add(this.vmLight);

    // effect pools
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0 }));
      line.frustumCulled = false;
      this.scene.add(line);
      this.tracers.push({ line, life: 0 });
    }
    for (let i = 0; i < 30; i++) {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xcbb98a, transparent: true, opacity: 0, depthWrite: false }));
      spr.scale.setScalar(0.15);
      this.scene.add(spr);
      this.sprites.push({ spr, life: 0, maxLife: 0.2, grow: 1 });
    }

    // bomb
    this.bombMesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), new THREE.MeshLambertMaterial({ color: 0x4a5d3a }));
    body.castShadow = true;
    this.bombLight = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    this.bombLight.position.set(0.08, 0.09, 0);
    this.bombMesh.add(body, this.bombLight);
    this.bombMesh.visible = false;
    this.scene.add(this.bombMesh);

    // explosion
    this.explosionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xff8830, transparent: true, opacity: 0, depthWrite: false }),
    );
    this.explosionMesh.visible = false;
    this.scene.add(this.explosionMesh);
    this.explosionLight = new THREE.PointLight(0xff9040, 0, 60);
    this.scene.add(this.explosionLight);

    this.bindInput();
    this.renderer.setAnimationLoop(() => this.frame());
    this.publishHud();
  }

  // ------------------------------------------------------------ scene build

  private buildLights(): void {
    const hemi = new THREE.HemisphereLight(0xbdd6ff, 0x8a7a55, 1.05);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1d6, 2.3);
    sun.position.set(70, 100, 45);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -85;
    sun.shadow.camera.right = 85;
    sun.shadow.camera.top = 85;
    sun.shadow.camera.bottom = -85;
    sun.shadow.camera.near = 20;
    sun.shadow.camera.far = 260;
    sun.shadow.bias = -0.0006;
    this.scene.add(sun);
    this.scene.add(sun.target);
  }

  private buildMapMeshes(): void {
    const map = this.sim.map;
    const wallTex = sandWallTexture();
    const floorTex = sandFloorTexture();
    const woodTex = woodTexture();
    const crateTex = crateTexture();
    const doorTex = doorTexture();

    const texFor = (base: THREE.Texture, w: number, h: number): THREE.Texture => {
      const t = base.clone();
      t.needsUpdate = true;
      t.repeat.set(Math.max(1, w / 3), Math.max(1, h / 3));
      return t;
    };

    // floors
    for (const f of map.floors) {
      const w = f.x2 - f.x1;
      const d = f.z2 - f.z1;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshLambertMaterial({ map: texFor(floorTex, w, d) }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set((f.x1 + f.x2) / 2, f.y + 0.01, (f.z1 + f.z2) / 2);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    // surrounding desert
    const desert = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshLambertMaterial({ color: 0xbfae80 }),
    );
    desert.rotation.x = -Math.PI / 2;
    desert.position.y = -0.05;
    desert.receiveShadow = true;
    this.scene.add(desert);

    // colliders -> boxes
    for (const c of map.colliders) {
      const w = c.max.x - c.min.x;
      const h = c.max.y - c.min.y;
      const d = c.max.z - c.min.z;
      let material: THREE.MeshLambertMaterial;
      switch (c.kind) {
        case 'wall':
          material = new THREE.MeshLambertMaterial({ map: texFor(wallTex, Math.max(w, d), h) });
          break;
        case 'crate':
          material = new THREE.MeshLambertMaterial({ map: texFor(crateTex, w, h) });
          break;
        case 'door':
          material = new THREE.MeshLambertMaterial({ map: texFor(doorTex, Math.max(w, d), h) });
          break;
        case 'ceiling':
          material = new THREE.MeshLambertMaterial({ map: texFor(woodTex, w, d), color: 0x9a8a6a });
          break;
        case 'step':
          material = new THREE.MeshLambertMaterial({ map: texFor(floorTex, w, d) });
          break;
        default:
          material = new THREE.MeshLambertMaterial({ color: 0x888888 });
          break;
      }
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set((c.min.x + c.max.x) / 2, (c.min.y + c.max.y) / 2, (c.min.z + c.max.z) / 2);
      mesh.castShadow = c.kind !== 'ceiling';
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }

    // site markers
    const siteLabel = (letter: string, x: number, z: number, w: number, d: number): void => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = 'rgba(230,200,90,0.16)';
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = 'rgba(230,200,90,0.7)';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 120, 120);
      ctx.fillStyle = 'rgba(230,200,90,0.85)';
      ctx.font = 'bold 90px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 64, 70);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.03, z);
      this.scene.add(mesh);
    };
    const sa = map.sites.A;
    const sb = map.sites.B;
    siteLabel('A', (sa.x1 + sa.x2) / 2, (sa.z1 + sa.z2) / 2, sa.x2 - sa.x1, sa.z2 - sa.z1);
    siteLabel('B', (sb.x1 + sb.x2) / 2, (sb.z1 + sb.z2) / 2, sb.x2 - sb.x1, sb.z2 - sb.z1);

    this.buildMinimapBase();
  }

  // ------------------------------------------------------------ input

  private bindInput(): void {
    const canvas = this.renderer.domElement;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', this.onLockChange);
    document.addEventListener('pointerlockerror', this.onLockError);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Tab') {
      e.preventDefault();
      this.scoreboardOpen = true;
      this.publishHud();
      return;
    }
    if (!this.started || this.paused) return;
    this.keys.add(e.code);
    if (e.code === 'Space') e.preventDefault();
    if (this.spectating) {
      if (e.code === 'Space') this.cycleSpectate();
      if (e.code === 'KeyF') this.takeover();
      return;
    }
    if (e.code === 'Digit1') this.switchQueue = 'primary';
    if (e.code === 'Digit2') this.switchQueue = 'secondary';
    if (e.code === 'Digit3') this.switchQueue = 'knife';
    if (e.code === 'KeyG') this.dropQueued = true;
    if (e.code === 'KeyB' && this.sim.phase === 'freeze' && !this.sim.pistol) {
      this.buyOpen = !this.buyOpen;
      this.publishHud();
    }
    if (e.code.startsWith('Digit') && this.buyOpen) {
      const picks: WeaponId[] = ['ak47', 'm4a4', 'awp', 'deagle'];
      const idx = Number(e.code.slice(5)) - 1;
      if (idx >= 0 && idx < picks.length) this.buy(picks[idx]);
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
    if (e.code === 'Tab') {
      this.scoreboardOpen = false;
      this.publishHud();
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked || !this.started || this.paused) return;
    const c = this.controlled();
    if (!c || !c.alive) return;
    const sens = SENS * (c.scoped ? 0.35 : 1);
    c.yaw -= e.movementX * sens;
    c.pitch = clamp(c.pitch - e.movementY * sens, -1.5, 1.5);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.started) return;
    if (!this.locked) {
      if (!this.paused) this.requestLock();
      return;
    }
    if (this.paused) return;
    if (this.spectating) {
      if (e.button === 0) this.cycleSpectate();
      return;
    }
    if (e.button === 0) {
      this.fireHeld = true;
      this.firePressed = true;
    } else if (e.button === 2) {
      this.altPressed = true;
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.fireHeld = false;
  };

  private onResize = (): void => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private onLockChange = (): void => {
    this.locked = document.pointerLockElement === this.renderer.domElement;
    if (this.started) {
      this.paused = !this.locked && this.sim.phase !== 'matchend';
      if (this.paused) {
        this.keys.clear();
        this.fireHeld = false;
      }
      this.onUi({ started: this.started, paused: this.paused });
      this.publishHud();
    }
  };

  private onLockError = (): void => {
    this.paused = true;
    this.onUi({ started: this.started, paused: true });
  };

  private requestLock(): void {
    try {
      const p = this.renderer.domElement.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') {
        p.catch(() => this.onLockError());
      }
    } catch {
      this.onLockError();
    }
  }

  // ------------------------------------------------------------ public API

  enterGame(): void {
    this.audio.resume();
    this.started = true;
    this.paused = false;
    this.requestLock();
    this.onUi({ started: true, paused: false });
    this.publishHud();
  }

  resume(): void {
    this.audio.resume();
    this.requestLock();
  }

  restart(): void {
    this.sim.restartMatch();
    this.killfeed = [];
    this.spectating = false;
    this.enterGame();
  }

  buy(id: WeaponId): void {
    if (this.sim.buy(id)) {
      this.buyOpen = false;
      this.syncViewmodel(true);
      this.publishHud();
    }
  }

  attachMinimap(canvas: HTMLCanvasElement | null): void {
    this.minimapCanvas = canvas;
  }

  private controlled(): Combatant | null {
    if (this.spectating) {
      const t = this.sim.byId(this.spectateId);
      if (t) return t;
    }
    return this.sim.player;
  }

  private cycleSpectate(): void {
    const mates = this.sim.alive(this.sim.player.team).filter((c) => !c.isPlayer);
    if (mates.length === 0) return;
    const idx = mates.findIndex((c) => c.id === this.spectateId);
    this.spectateId = mates[(idx + 1) % mates.length].id;
    this.syncViewmodel(true);
    this.publishHud();
  }

  private takeover(): void {
    if (this.sim.takeover(this.spectateId)) {
      this.spectating = false;
      this.syncViewmodel(true);
      this.publishHud();
    }
  }

  // ------------------------------------------------------------ frame

  private frame(): void {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.started && !this.paused && this.sim.phase !== 'matchend') {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= STEP && steps < 5) {
        const input = this.buildInput(steps === 0);
        this.sim.update(STEP, input);
        this.acc -= STEP;
        steps++;
      }
      this.processEvents(this.sim.drainEvents());
    } else if (!this.started) {
      // idle orbit behind the menu
      const t = this.clock.elapsedTime * 0.05;
      this.camera.position.set(Math.cos(t) * 70, 55, Math.sin(t) * 70);
      this.camera.lookAt(0, 0, 0);
    }

    this.updateRigs();
    this.updateCamera(dt);
    this.updateViewmodel(dt);
    this.updateEffects(dt);
    this.updateBombMesh();
    this.audio.setListener(this.camera.position, this.camera.rotation.y);
    this.renderer.render(this.scene, this.camera);

    this.hudT -= dt;
    if (this.hudT <= 0) {
      this.hudT = 0.1;
      this.publishHud();
    }
    if (this.minimapCanvas) this.drawMinimap(this.minimapCanvas);
  }

  private buildInput(firstStep: boolean): PlayerInput {
    const input = emptyInput();
    if (this.spectating || this.buyOpen) {
      this.firePressed = false;
      this.altPressed = false;
      this.switchQueue = null;
      this.dropQueued = false;
      return input;
    }
    input.forward = this.keys.has('KeyW');
    input.back = this.keys.has('KeyS');
    input.left = this.keys.has('KeyA');
    input.right = this.keys.has('KeyD');
    input.jump = this.keys.has('Space');
    input.walk = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    input.fire = this.fireHeld;
    input.firePressed = firstStep && this.firePressed;
    input.altFirePressed = firstStep && this.altPressed;
    input.reload = this.keys.has('KeyR');
    input.use = this.keys.has('KeyE');
    input.switchSlot = firstStep ? this.switchQueue : null;
    input.dropBomb = firstStep && this.dropQueued;
    this.firePressed = false;
    this.altPressed = false;
    this.switchQueue = null;
    this.dropQueued = false;
    return input;
  }

  // ------------------------------------------------------------ events

  private processEvents(events: SimEvent[]): void {
    const me = this.controlled();
    const meId = me?.id ?? -1;
    for (const ev of events) {
      switch (ev.type) {
        case 'shot': {
          const own = ev.by === meId;
          this.audio.shot(ev.weapon, own ? undefined : ev.origin);
          if (ev.weapon !== 'knife') {
            this.spawnTracer(ev.origin, ev.end);
            this.spawnSprite(ev.end, 0xcbb98a, 0.14, 0.18, 2.2);
            this.spawnSprite(ev.origin, 0xffd070, 0.3, 0.05, 1.4);
          }
          if (own) {
            this.vmKick = Math.min(1.6, this.vmKick + (ev.weapon === 'awp' ? 1.4 : ev.weapon === 'knife' ? 0.5 : 0.7));
            if (ev.weapon !== 'knife') this.flashT = 0.045;
          }
          break;
        }
        case 'hit':
          if (ev.attacker === meId) {
            this.hitmarkerT = 0.18;
            this.hitmarkerHead = ev.part === 'head';
            this.audio.hit(ev.part === 'head');
          }
          this.spawnSprite(ev.pos, 0x8a1f1f, 0.2, 0.25, 1.6);
          break;
        case 'kill': {
          const killer = this.sim.byId(ev.killer);
          const victim = this.sim.byId(ev.victim);
          if (killer && victim) {
            this.killfeed.push({
              id: this.feedSeq++,
              killer: killer.name, killerTeam: killer.team,
              victim: victim.name, victimTeam: victim.team,
              weapon: ev.weapon, headshot: ev.headshot, t: performance.now(),
            });
            if (this.killfeed.length > 6) this.killfeed.shift();
          }
          if (ev.killer === meId) this.audio.kill();
          if (ev.victim === this.sim.playerId && !this.spectating) {
            this.spectating = true;
            const mates = this.sim.alive(this.sim.player.team).filter((c) => !c.isPlayer);
            this.spectateId = mates[0]?.id ?? -1;
            this.syncViewmodel(true);
          }
          break;
        }
        case 'damage':
          if (ev.victim === meId) {
            this.damageT = 0.35;
            this.shakeT = Math.max(this.shakeT, 0.12);
            this.audio.damage();
          }
          break;
        case 'reload': {
          const own = ev.by === meId;
          const c = this.sim.byId(ev.by);
          this.audio.reload(own ? undefined : c?.pos, WEAPONS[ev.weapon].reloadTime);
          break;
        }
        case 'switch':
          if (ev.by === meId) {
            this.audio.switchWeapon();
            this.syncViewmodel(true);
          }
          break;
        case 'step': {
          const own = ev.by === meId;
          this.audio.step(own ? undefined : ev.pos);
          break;
        }
        case 'scope':
          if (ev.by === meId) this.audio.scope(ev.on);
          break;
        case 'bombPickup':
          if (ev.by === meId) this.audio.pickup();
          break;
        case 'planted':
          this.audio.plantedWorld(ev.pos);
          if (ev.by === meId) this.audio.plant();
          break;
        case 'defused':
          this.audio.defused();
          break;
        case 'beep':
          this.audio.beep(ev.pos, ev.urgency);
          break;
        case 'explosion':
          this.audio.explosion(ev.pos);
          this.explosionT = 0;
          this.explosionMesh.position.set(ev.pos.x, ev.pos.y + 1, ev.pos.z);
          this.explosionMesh.visible = true;
          this.explosionLight.position.copy(this.explosionMesh.position);
          this.shakeT = 0.9;
          break;
        case 'roundStart':
          this.audio.roundStart();
          this.buyOpen = false;
          // rebuild rigs whose team changed (half-time side swap)
          for (const c of this.sim.combatants) {
            if (this.rigTeams[c.id] !== c.team) {
              const old = this.rigs[c.id];
              this.scene.remove(old.group);
              old.dispose();
              const rig = createRig(c.team);
              this.rigs[c.id] = rig;
              this.rigTeams[c.id] = c.team;
              this.scene.add(rig.group);
            }
          }
          if (this.sim.player.alive) {
            this.spectating = false;
            this.syncViewmodel(true);
          }
          break;
        case 'matchEnd':
          if (document.pointerLockElement) document.exitPointerLock();
          this.paused = false;
          this.onUi({ started: this.started, paused: false });
          break;
        default:
          break;
      }
    }
    // defuse ratchet
    if (this.sim.bomb.defuser >= 0 && this.sim.bomb.state === 'planted') {
      this.defuseTickT -= STEP;
      if (this.defuseTickT <= 0) {
        this.defuseTickT = 0.45;
        this.audio.defuseTick(this.sim.bomb.pos);
      }
    }
  }

  // ------------------------------------------------------------ visuals

  private updateRigs(): void {
    const me = this.controlled();
    for (const c of this.sim.combatants) {
      const rig = this.rigs[c.id];
      rig.update(c);
      rig.group.visible = !(me && c.id === me.id && c.alive);
    }
  }

  private updateCamera(dt: number): void {
    if (!this.started) return;
    if (this.spectating) {
      const t = this.sim.byId(this.spectateId);
      if (!t || !t.alive) {
        const mates = this.sim.alive(this.sim.player.team).filter((c) => !c.isPlayer);
        if (mates.length > 0) {
          this.spectateId = mates[0].id;
          this.syncViewmodel(true);
        } else {
          return; // whole team dead: freeze camera until round end
        }
      }
    }
    const c = this.controlled();
    if (!c) return;
    const eye = c.pos.y + EYE_HEIGHT;
    this.camera.position.set(c.pos.x, eye, c.pos.z);
    this.camera.rotation.y = c.yaw;
    this.camera.rotation.x = c.pitch + c.recoilPitch * 0.6;
    this.camera.rotation.z = 0;
    if (this.shakeT > 0) {
      this.shakeT = Math.max(0, this.shakeT - dt);
      const s = this.shakeT * 0.06;
      this.camera.position.x += (Math.random() - 0.5) * s;
      this.camera.position.y += (Math.random() - 0.5) * s;
      this.camera.rotation.z += (Math.random() - 0.5) * s * 0.5;
    }
    const w = weaponOf(currentWeaponId(c));
    const targetFov = c.scoped ? w.scopedFov : 75;
    const fov = this.camera.fov + (targetFov - this.camera.fov) * Math.min(1, dt * 14);
    if (Math.abs(fov - this.camera.fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
  }

  private syncViewmodel(force = false): void {
    const c = this.controlled();
    if (!c) return;
    const id = currentWeaponId(c);
    if (!force && id === this.vmWeapon) return;
    this.vmWeapon = id;
    if (this.vm) {
      this.camera.remove(this.vm);
      disposeGroup(this.vm);
    }
    this.vm = buildGun(id, true);
    this.vm.position.set(0.3, -0.28, -0.55);
    this.camera.add(this.vm);
    const muzzle = this.vm.getObjectByName('muzzle');
    if (muzzle) {
      muzzle.add(this.vmFlash);
      this.vmLight.position.set(0, 0, 0);
      muzzle.add(this.vmLight);
    }
  }

  private updateViewmodel(dt: number): void {
    const c = this.controlled();
    if (!c || !this.vm) {
      if (this.vm) this.vm.visible = false;
      return;
    }
    this.syncViewmodel();
    const scoped = c.scoped;
    this.vm.visible = !scoped && c.alive;
    this.vmFlash.visible = this.flashT > 0 && this.vm.visible;
    this.flashT = Math.max(0, this.flashT - dt);
    this.vmLight.intensity = this.flashT > 0 ? 6 : 0;
    this.vmKick = Math.max(0, this.vmKick - dt * 7);
    const speed = Math.sqrt(c.vel.x * c.vel.x + c.vel.z * c.vel.z);
    const bob = Math.sin(c.walkPhase) * 0.012 * clamp(speed / 5, 0, 1);
    const bobY = Math.abs(Math.cos(c.walkPhase)) * 0.01 * clamp(speed / 5, 0, 1);
    const w = weaponOf(currentWeaponId(c));
    let reloadDip = 0;
    if (c.reloadT > 0) {
      const prog = 1 - c.reloadT / w.reloadTime;
      reloadDip = Math.sin(prog * Math.PI) * 0.55;
    }
    this.vm.position.set(0.3 + bob, -0.28 + bobY - reloadDip * 0.12, -0.55 + this.vmKick * 0.07);
    this.vm.rotation.set(this.vmKick * 0.14 - reloadDip * 0.7, 0, bob * 0.6);
    if (this.vmFlash.visible) {
      this.vmFlash.rotation.z = Math.random() * Math.PI;
      this.vmFlash.scale.setScalar(0.8 + Math.random() * 0.6);
    }
  }

  private spawnTracer(a: Vec3, b: Vec3): void {
    const t = this.tracers.find((x) => x.life <= 0);
    if (!t) return;
    const pos = t.line.geometry.getAttribute('position') as THREE.BufferAttribute;
    pos.setXYZ(0, a.x, a.y, a.z);
    pos.setXYZ(1, b.x, b.y, b.z);
    pos.needsUpdate = true;
    t.life = 0.07;
    (t.line.material as THREE.LineBasicMaterial).opacity = 0.75;
  }

  private spawnSprite(p: Vec3, color: number, size: number, life: number, grow: number): void {
    const s = this.sprites.find((x) => x.life <= 0);
    if (!s) return;
    s.spr.position.set(p.x, p.y, p.z);
    s.spr.scale.setScalar(size);
    (s.spr.material as THREE.SpriteMaterial).color.setHex(color);
    (s.spr.material as THREE.SpriteMaterial).opacity = 0.9;
    s.life = life;
    s.maxLife = life;
    s.grow = grow;
  }

  private updateEffects(dt: number): void {
    for (const t of this.tracers) {
      if (t.life > 0) {
        t.life -= dt;
        (t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life / 0.07) * 0.75;
      }
    }
    for (const s of this.sprites) {
      if (s.life > 0) {
        s.life -= dt;
        const k = Math.max(0, s.life / s.maxLife);
        (s.spr.material as THREE.SpriteMaterial).opacity = k * 0.9;
        s.spr.scale.setScalar(s.spr.scale.x + dt * s.grow * 0.3);
      }
    }
    if (this.explosionT >= 0) {
      this.explosionT += dt;
      const k = this.explosionT / 0.7;
      if (k >= 1) {
        this.explosionT = -1;
        this.explosionMesh.visible = false;
        this.explosionLight.intensity = 0;
      } else {
        this.explosionMesh.scale.setScalar(1 + k * 26);
        (this.explosionMesh.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.85;
        this.explosionLight.intensity = (1 - k) * 300;
      }
    }
    this.hitmarkerT = Math.max(0, this.hitmarkerT - dt);
    this.damageT = Math.max(0, this.damageT - dt);
  }

  private updateBombMesh(): void {
    const b = this.sim.bomb;
    if (b.state === 'dropped' || b.state === 'planted') {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(b.pos.x, b.pos.y + 0.08, b.pos.z);
      const blink = b.state === 'planted' ? (Math.sin(this.sim.time * (4 + (1 - b.timer / 40) * 14)) > 0 ? 1 : 0.15) : 0.6;
      (this.bombLight.material as THREE.MeshBasicMaterial).color.setRGB(blink, 0.05, 0.05);
    } else {
      this.bombMesh.visible = false;
    }
  }

  // ------------------------------------------------------------ minimap

  private buildMinimapBase(): void {
    const map = this.sim.map;
    const cv = document.createElement('canvas');
    const W = 220;
    const H = 250;
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d')!;
    const sx = W / (map.bounds.x2 - map.bounds.x1);
    const sz = H / (map.bounds.z2 - map.bounds.z1);
    const s = Math.min(sx, sz);
    const ox = (W - (map.bounds.x2 - map.bounds.x1) * s) / 2;
    const oz = (H - (map.bounds.z2 - map.bounds.z1) * s) / 2;
    const X = (x: number): number => ox + (x - map.bounds.x1) * s;
    const Z = (z: number): number => oz + (z - map.bounds.z1) * s;
    ctx.fillStyle = 'rgba(12,16,22,0.82)';
    ctx.fillRect(0, 0, W, H);
    for (const f of map.floors) {
      ctx.fillStyle = f.y > 0 ? '#7d7250' : '#6e6549';
      ctx.fillRect(X(f.x1), Z(f.z1), (f.x2 - f.x1) * s, (f.z2 - f.z1) * s);
    }
    for (const c of map.colliders) {
      if (c.kind === 'wall') ctx.fillStyle = '#2c3340';
      else if (c.kind === 'door') ctx.fillStyle = '#7a5230';
      else if (c.kind === 'crate') ctx.fillStyle = '#54432c';
      else continue;
      ctx.fillRect(X(c.min.x), Z(c.min.z), (c.max.x - c.min.x) * s, (c.max.z - c.min.z) * s);
    }
    // site letters
    ctx.fillStyle = 'rgba(235,205,100,0.95)';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', X(40), Z(-31));
    ctx.fillText('B', X(-40), Z(-35));
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(200,210,225,0.6)';
    ctx.fillText('中路', X(2), Z(14));
    ctx.fillText('A大', X(49), Z(14));
    ctx.fillText('B洞', X(-43), Z(8));
    this.minimapBase = cv;
    this.minimapTransform = { s, ox, oz };
  }

  private minimapTransform = { s: 1, ox: 0, oz: 0 };

  private drawMinimap(canvas: HTMLCanvasElement): void {
    const base = this.minimapBase;
    if (!base) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base, 0, 0, W, H);
    const { s, ox, oz } = this.minimapTransform;
    const map = this.sim.map;
    const k = W / base.width;
    const X = (x: number): number => (ox + (x - map.bounds.x1) * s) * k;
    const Z = (z: number): number => (oz + (z - map.bounds.z1) * s) * k;
    const me = this.controlled();
    const myTeam = this.sim.player.team;
    // bomb
    const b = this.sim.bomb;
    if (b.state === 'dropped' || b.state === 'planted') {
      const blink = b.state !== 'planted' || Math.sin(this.sim.time * 8) > -0.3;
      if (blink) {
        ctx.fillStyle = '#ffd23e';
        ctx.fillRect(X(b.pos.x) - 3.5, Z(b.pos.z) - 3.5, 7, 7);
        ctx.strokeStyle = '#8a6d00';
        ctx.strokeRect(X(b.pos.x) - 3.5, Z(b.pos.z) - 3.5, 7, 7);
      }
    } else if (b.state === 'carried') {
      const carrier = this.sim.byId(b.carrier);
      if (carrier && carrier.team === myTeam && carrier.alive) {
        ctx.fillStyle = '#ffd23e';
        ctx.fillRect(X(carrier.pos.x) - 2.5, Z(carrier.pos.z) - 2.5, 5, 5);
      }
    }
    // teammates
    for (const c of this.sim.combatants) {
      if (!c.alive || c.id === me?.id) continue;
      if (c.team === myTeam) {
        ctx.fillStyle = myTeam === 'CT' ? '#5db2ff' : '#7ce07c';
        ctx.beginPath();
        ctx.arc(X(c.pos.x), Z(c.pos.z), 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.sim.spotted[myTeam].has(c.id)) {
        ctx.fillStyle = '#ff4d4d';
        ctx.beginPath();
        ctx.arc(X(c.pos.x), Z(c.pos.z), 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // self arrow
    if (me && me.alive) {
      ctx.save();
      ctx.translate(X(me.pos.x), Z(me.pos.z));
      ctx.rotate(-me.yaw);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.4, 5);
      ctx.lineTo(0, 2.6);
      ctx.lineTo(-4.4, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------ HUD

  private publishHud(): void {
    const sim = this.sim;
    const p = sim.player;
    const me = this.controlled() ?? p;
    const wid = currentWeaponId(me);
    const w = weaponOf(wid);
    const ammo = me.ammo[wid];
    const now = performance.now();
    this.killfeed = this.killfeed.filter((k) => now - k.t < 6000);
    const spread = w.spreadBase + me.bloom + Math.sqrt(me.vel.x ** 2 + me.vel.z ** 2) * 0.0045 + (me.onGround ? 0 : 0.035);
    let hint = '';
    if (this.spectating) hint = '观战中 · 空格/点击 切换队友 · F 接管该队友';
    else if (sim.phase === 'freeze') hint = this.buyOpen ? '按 1-4 选择武器' : '冻结时间 · 按 B 购买武器';
    else if (sim.canPlant(p)) hint = '按住 E 安放 C4';
    else if (sim.canDefuse(p)) hint = '按住 E 拆除 C4';
    else if (p.hasBomb) hint = '你携带 C4 · 前往 A 点或 B 点安放';
    const hud: HudState = {
      phase: sim.phase,
      round: sim.round,
      pistol: sim.pistol,
      scores: { ...sim.scores },
      timer: sim.phase === 'freeze' ? sim.phaseT : sim.phase === 'live' ? sim.liveT : sim.phaseT,
      bombState: sim.bomb.state,
      bombTimer: sim.bomb.timer,
      aliveCT: sim.alive('CT').length,
      aliveT: sim.alive('T').length,
      playerAlive: p.alive,
      hp: Math.max(0, Math.ceil(me.hp)),
      armor: Math.ceil(me.armor),
      weapon: wid,
      weaponName: w.name,
      mag: ammo?.mag ?? 0,
      reserve: ammo?.reserve ?? 0,
      reloading: me.reloadT > 0,
      scoped: me.scoped,
      hasBomb: p.hasBomb,
      canPlant: sim.canPlant(p),
      canDefuse: sim.canDefuse(p),
      plantProgress: clamp(p.plantT / 3.2, 0, 1),
      defuseProgress: sim.bomb.defuseProgress,
      spreadPx: clamp(spread * 1400, 3, 60),
      killfeed: [...this.killfeed],
      scoreboard: sim.combatants.map((c) => ({
        id: c.id, name: c.name, team: c.team, kills: c.kills, deaths: c.deaths,
        alive: c.alive, isPlayer: c.isPlayer, hasBomb: c.hasBomb,
      })),
      spectating: this.spectating,
      spectateName: this.spectating ? this.sim.byId(this.spectateId)?.name ?? '' : '',
      roundEndWinner: sim.roundEndWinner,
      roundEndReason: sim.roundEndReason,
      matchWinner: sim.matchWinner,
      playerTeam: sim.playerTeam,
      hitmarkerT: this.hitmarkerT,
      hitmarkerHead: this.hitmarkerHead,
      damageT: this.damageT,
      buyOpen: this.buyOpen,
      hint,
    };
    this.onHud(hud);
  }

  // ------------------------------------------------------------ teardown

  dispose(): void {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    document.removeEventListener('pointerlockerror', this.onLockError);
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) mat.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.audio.dispose();
  }
}

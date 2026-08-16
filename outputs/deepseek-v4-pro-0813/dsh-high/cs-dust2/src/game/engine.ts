import * as THREE from 'three';
import {
  A_SITE_CENTER, B_SITE_CENTER, C4_TIMER, DEFUSE_TIME, GRAVITY,
  JUMP_SPEED, LOSS_MONEY, KILL_MONEY, PICKUP_RANGE, PLANT_TIME, PLAYER_HALF,
  PLAYER_HEIGHT, ROUND_FREEZE_TIME, ROUND_TIME, START_MONEY,
  WEAPONS, WIN_MONEY, ARMOR_PRICE, defaultPrimary, defaultSecondary,
} from './config';
import type { HitboxZone, Team, WeaponDef } from './types';
import {
  allSolids, bulletBlockers, minimapWalls, moveBlockers, sightBlockers,
  spawnFor, siteAt, type SolidBox,
} from './map';
import { Player } from './entities';
import { BotBrain } from './ai';
import { buildViewModel } from './models';
import { getState, setState } from './store';
import {
  initAudio, playC4Beep, playC4Defused, playC4Planted, playExplosion, playFootstep,
  playHit, playKill, playKnifeSwing, playReload, playRoundStart, playShot, playWin, playZoom,
} from './audio';

const ZONE_MULT: Record<HitboxZone, number> = {
  head: 2.0, chest: 1.0, stomach: 1.0, arm: 0.7, leg: 0.6,
};

interface TraceResult {
  hit: 'player' | 'world';
  t: number;
  player?: Player;
  zone?: HitboxZone;
  throughDoor: boolean;
}

export class Engine {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  players: Player[] = [];
  humanIndex = 0;
  spectateIndex = 0;
  private canvas: HTMLCanvasElement;
  private clock = new THREE.Clock();
  private raf = 0;
  private keys = new Set<string>();
  private locked = false;
  private firing = false;
  private started = false;
  private viewModel = new THREE.Group();
  private time = 0;
  private hudAccum = 0;
  private killfeedId = 1;
  private freezeTimer = 0;
  private roundTimer = ROUND_TIME;
  private phase: 'freeze' | 'live' | 'planted' | 'over' = 'freeze';
  private round = 1;
  private score = { ct: 0, t: 0 };
  c4State: 'carried' | 'dropped' | 'planted' | 'none' = 'none';
  c4Position: THREE.Vector3 | null = null;
  private c4Timer = 0;
  private c4BeepAccum = 0;
  private roundOverTimer = 0;
  private messageUntil = 0;
  private visibleEnemies = new Set<number>();
  private prevKeys = new Set<string>();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9db8d2);
    this.scene.fog = new THREE.Fog(0x9db8d2, 60, 220);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 300);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    // lights
    const hemi = new THREE.HemisphereLight(0xd8e6f2, 0xb09a74, 0.9);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d0, 1.4);
    sun.position.set(40, 70, 20);
    this.scene.add(sun);

    this.buildMap();
    this.createPlayers();

    this.viewModel = new THREE.Group();
    this.viewModel.position.set(0.3, -0.27, -0.5);
    this.camera.add(this.viewModel);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('contextmenu', this.onContext);
    document.addEventListener('pointerlockchange', this.onLockChange);

    setState({ minimapWalls: minimapWalls.map((w) => ({ x0: w.x0, z0: w.z0, x1: w.x1, z1: w.z1 })) });
    this.loop();
  }

  // ---------------------------------------------------------------- setup --

  private buildMap(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshStandardMaterial({ color: 0xc9b489, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    for (const s of allSolids) {
      const w = s.max.x - s.min.x;
      const h = s.max.y - s.min.y;
      const d = s.max.z - s.min.z;
      const geo = new THREE.BoxGeometry(w, h, d);
      const color = s.kind === 'crate' ? s.color : s.kind === 'door' ? 0x7a5630 : s.color;
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: s.kind === 'crate' ? 0.9 : 0.95,
        metalness: 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((s.min.x + s.max.x) / 2, (s.min.y + s.max.y) / 2, (s.min.z + s.max.z) / 2);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      this.scene.add(mesh);
    }
  }

  private createPlayers(): void {
    // player 0 = human on T; 4 more T bots; 5 CT bots
    const names = ['你', 'T-2', 'T-3', 'T-4', 'T-5', 'CT-1', 'CT-2', 'CT-3', 'CT-4', 'CT-5'];
    for (let i = 0; i < 10; i++) {
      const team: Team = i < 5 ? 'T' : 'CT';
      const isBot = i !== 0;
      const weapon = defaultSecondary(team);
      const p = new Player(team, names[i], isBot, weapon);
      p.humanControlled = i === 0;
      p.money = START_MONEY;
      if (isBot) {
        p.ai = new BotBrain(p, this);
      }
      this.players.push(p);
      this.scene.add(p.model);
    }
  }

  // ---------------------------------------------------------------- public --

  requestStart(): void {
    initAudio();
    if (!this.started) {
      this.started = true;
      this.startRound(1);
      setState({ started: true, score: { ...this.score } });
    }
    this.canvas.requestPointerLock();
  }

  toggleBuy(): void {
    if (this.phase !== 'freeze') return;
    setState({ buyOpen: !getState().buyOpen });
  }

  buyItem(id: string): void {
    const p = this.human();
    if (!p || this.phase !== 'freeze') return;
    const def = WEAPONS[id];
    if (!def) return;
    const price = id === 'awp' ? 4750 : id === 'deagle' ? 700 : id === 'm4a4' ? 3100 : id === 'ak47' ? 2700 : 200;
    if (def.slot === 'primary' && def.id !== 'ak47' && def.id !== 'm4a4' && def.id !== 'awp') return;
    if ((id === 'ak47' && p.team !== 'T') || (id === 'm4a4' && p.team !== 'CT') || (id === 'glock' && p.team !== 'T') || (id === 'usp' && p.team !== 'CT')) return;
    if (p.money < price) return;
    p.money -= price;
    p.giveWeapon(id);
    this.refreshViewModel(p);
    setState({ money: p.money });
  }

  buyArmor(): void {
    const p = this.human();
    if (!p || this.phase !== 'freeze') return;
    if (p.money < ARMOR_PRICE || p.armor >= 100) return;
    p.money -= ARMOR_PRICE;
    p.armor = 100;
    setState({ money: p.money, armor: p.armor });
  }

  closeBuy(): void {
    setState({ buyOpen: false });
  }

  cycleSpectate(): void {
    if (this.human().alive) return;
    const teammates = this.players.filter((p) => p.team === this.human().team && p.alive);
    if (teammates.length === 0) return;
    const order = teammates.map((t) => this.players.indexOf(t));
    const cur = order.indexOf(this.spectateIndex);
    const next = (cur + 1) % order.length;
    this.spectateIndex = order[next];
  }

  takeOver(): void {
    const human = this.human();
    if (human.alive) return;
    const target = this.players[this.spectateIndex];
    if (!target || !target.alive || target.team !== human.team) return;
    // hand control to the spectated bot
    human.humanControlled = false;
    target.humanControlled = true;
    this.humanIndex = this.players.indexOf(target);
    this.spectateIndex = this.humanIndex;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('contextmenu', this.onContext);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.renderer.dispose();
  }

  // ------------------------------------------------------------ round flow --

  private startRound(n: number): void {
    this.round = n;
    this.phase = 'freeze';
    this.freezeTimer = ROUND_FREEZE_TIME;
    this.roundTimer = ROUND_TIME;
    this.c4State = 'none';
    this.c4Position = null;
    this.c4Timer = 0;
    this.roundOverTimer = 0;
    this.visibleEnemies.clear();

    const pistolRound = n === 1;

    // reset human control
    this.humanIndex = 0;
    this.spectateIndex = 0;

    // spawn + reset
    const tIdx = [0, 1, 2, 3, 4];
    const ctIdx = [0, 1, 2, 3, 4];
    this.shuffle(tIdx);
    this.shuffle(ctIdx);

    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      const team = p.team;
      const slotIndex = team === 'T' ? tIdx.indexOf(i) : ctIdx.indexOf(i);
      const spawn = spawnFor(team, slotIndex < 0 ? 0 : slotIndex);
      p.pos.set(spawn.x, 0, spawn.z);
      p.vel.set(0, 0, 0);
      p.hp = 100;
      p.armor = pistolRound ? 0 : 100;
      p.alive = true;
      p.carriesBomb = false;
      p.action = null;
      p.actionProgress = 0;
      p.reloading = false;
      p.cooldown = 0;
      p.spread = 0;
      p.recoilPitchKick = 0;
      p.recoilYawKick = 0;
      p.scoped = false;
      p.primary = null;
      p.secondary = defaultSecondary(team);
      p.ammo = {};
      p.giveWeapon(p.secondary);
      if (!pistolRound) {
        const primary = defaultPrimary(team);
        p.giveWeapon(primary);
        p.currentSlot = 'primary';
      } else {
        p.currentSlot = 'secondary';
      }
      p.humanControlled = i === 0;
      if (p.ai) p.ai.targetEnemy = null;
    }

    // assign C4 to a random T (prefer a bot so the human can also plant via pickup, but allow human)
    const tPlayers = this.players.filter((p) => p.team === 'T');
    const carrier = tPlayers[Math.floor(Math.random() * tPlayers.length)];
    carrier.carriesBomb = true;
    this.c4State = 'carried';

    // AI roles
    this.assignRoles();

    this.refreshViewModel(this.human());
    this.messageUntil = this.time + 3;

    setState({
      round: n,
      phase: 'freeze',
      roundTime: Math.ceil(this.freezeTimer),
      c4State: this.c4State,
      c4Timer: 0,
      winner: null,
      roundOver: false,
      message: `第 ${n} 回合`,
      buyOpen: false,
      spectating: null,
      killfeed: [],
    });
    playRoundStart();
  }

  private assignRoles(): void {
    const siteA = new THREE.Vector3(A_SITE_CENTER.x, 0, A_SITE_CENTER.z);
    const siteB = new THREE.Vector3(B_SITE_CENTER.x, 0, B_SITE_CENTER.z);
    let tCount = 0;
    for (const p of this.players) {
      if (!p.ai) continue;
      if (p.team === 'T') {
        const isCarrier = p.carriesBomb;
        const home = isCarrier ? (tCount % 2 === 0 ? siteA : siteB) : (tCount % 2 === 0 ? siteA : siteB);
        p.ai.setRole('A', home);
        tCount++;
      } else {
        const idx = this.players.indexOf(p);
        if (idx % 3 === 0) p.ai.setRole('A', new THREE.Vector3(-22, 0, -27));
        else if (idx % 3 === 1) p.ai.setRole('B', new THREE.Vector3(22, 0, -27));
        else p.ai.setRole('MID', new THREE.Vector3(0, 0, -8));
      }
    }
    // ensure carrier keeps a stable site: pick A or B once
    const carrier = this.players.find((p) => p.carriesBomb);
    if (carrier?.ai) {
      carrier.ai.setRole('A', Math.random() < 0.5 ? siteA : siteB);
    }
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.roundOverTimer = 4.5;
    this.score[winner === 'T' ? 't' : 'ct'] += 1;
    for (const p of this.players) {
      p.money += p.team === winner ? WIN_MONEY : LOSS_MONEY;
      p.money += p.kills * KILL_MONEY;
    }
    const text = winner === 'T' ? 'T 阵营获胜' : 'CT 阵营获胜';
    this.addKillfeed(`🏆 ${text} (${reason})`);
    this.messageUntil = this.time + 4;
    setState({
      phase: 'over',
      winner,
      roundOver: true,
      message: `${text} —— ${reason}`,
      score: { ...this.score },
    });
    playWin();
  }

  // -------------------------------------------------------------- game loop --

  private loop = (): void => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.time += dt;

    if (this.started) {
      this.update(dt);
    }
    this.render();
  };

  private update(dt: number): void {
    const human = this.human();

    if (this.phase === 'freeze') {
      this.freezeTimer -= dt;
      for (const p of this.players) {
        p.moveF = 0;
        p.moveS = 0;
        p.vel.x = 0;
        p.vel.z = 0;
        p.moving = false;
      }
      if (this.freezeTimer <= 0) {
        this.phase = 'live';
        setState({ phase: 'live', message: '行动！' });
        playRoundStart();
      }
    } else if (this.phase === 'live' || this.phase === 'planted') {
      this.roundTimer -= dt;

      // human input
      this.updateHuman(human);

      // bots
      for (const p of this.players) {
        if (p.ai && !p.humanControlled && p.alive) p.ai.update(dt);
      }

      // movement for everyone
      for (const p of this.players) {
        if (p.alive) this.applyMovement(p, dt);
      }

      this.updateActions(dt);
      this.updateC4(dt);

      if (this.roundTimer <= 0 && this.c4State !== 'planted') {
        this.endRound('CT', '时间耗尽');
      }
    } else if (this.phase === 'over') {
      this.roundOverTimer -= dt;
      for (const p of this.players) p.moving = false;
      if (this.roundOverTimer <= 0) this.startRound(this.round + 1);
    }

    // weapon timers (always, so reloads finish during round transitions)
    for (const p of this.players) this.updateWeaponTimers(p, dt);

    this.updateAnimations(dt);
    this.updateCamera(dt);

    this.hudAccum += dt;
    if (this.hudAccum >= 1 / 30) {
      this.hudAccum = 0;
      this.publishHud();
    }
    this.prevKeys = new Set(this.keys);
  }

  private updateHuman(human: Player): void {
    if (!human.alive) {
      human.moveF = 0;
      human.moveS = 0;
      return;
    }
    const f = (this.keys.has('KeyW') ? 1 : 0) + (this.keys.has('KeyS') ? -1 : 0);
    const s = (this.keys.has('KeyD') ? 1 : 0) + (this.keys.has('KeyA') ? -1 : 0);
    human.moveF = f;
    human.moveS = s;
    human.walkRequest = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    if (this.keys.has('Space') && !this.prevKeys.has('Space')) human.jumpRequest = true;

    if (this.firing && human.currentWeapon().automatic) {
      this.fireWeapon(human, this.cameraForward());
    }
  }

  private updateActions(dt: number): void {
    for (const p of this.players) {
      if (!p.alive || !p.action) continue;
      if (p.moveF !== 0 || p.moveS !== 0) {
        p.action = null;
        p.actionProgress = 0;
        continue;
      }
      const total = p.action === 'plant' ? PLANT_TIME : DEFUSE_TIME;
      p.actionProgress += dt / total;
      p.beepAccum += dt;
      if (p.beepAccum >= 0.3) {
        p.beepAccum = 0;
        playC4Beep(p.action === 'plant');
      }
      if (p.actionProgress >= 1) {
        if (p.action === 'plant') {
          this.c4State = 'planted';
          this.c4Position = p.pos.clone();
          this.c4Timer = C4_TIMER;
          p.carriesBomb = false;
          this.message('炸弹已安放！');
          playC4Planted();
          setState({ c4State: 'planted', c4Team: 'T' });
        } else {
          this.c4State = 'none';
          this.c4Position = null;
          this.message('炸弹已拆除！');
          playC4Defused();
          this.endRound('CT', '拆弹成功');
        }
        p.action = null;
        p.actionProgress = 0;
      }
    }
  }

  private updateC4(dt: number): void {
    if (this.c4State === 'planted') {
      this.c4Timer -= dt;
      this.c4BeepAccum += dt;
      if (this.c4BeepAccum > 0.5) {
        this.c4BeepAccum = 0;
        playC4Beep(false);
      }
      if (this.c4Timer <= 0) {
        // explode: kill everyone nearby
        if (this.c4Position) {
          for (const p of this.players) {
            if (!p.alive) continue;
            const d = p.pos.distanceTo(this.c4Position);
            if (d < 20) {
              p.hp = 0;
              p.alive = false;
              p.carriesBomb = false;
              p.action = null;
              p.actionProgress = 0;
            }
          }
        }
        this.c4State = 'none';
        playExplosion();
        this.endRound('T', '炸弹爆炸');
      }
    }
  }

  private updateWeaponTimers(p: Player, dt: number): void {
    if (p.cooldown > 0) p.cooldown -= dt;
    if (p.switchTimer > 0) p.switchTimer -= dt;
    // spread / recoil decay
    p.spread = THREE.MathUtils.lerp(p.spread, 0, 1 - Math.exp(-6 * dt));
    p.recoilPitchKick = THREE.MathUtils.lerp(p.recoilPitchKick, 0, 1 - Math.exp(-9 * dt));
    p.recoilYawKick = THREE.MathUtils.lerp(p.recoilYawKick, 0, 1 - Math.exp(-9 * dt));
    if (p.reloading && this.time >= p.reloadEnd) {
      p.reloading = false;
      const ammo = p.currentAmmo();
      const def = p.currentWeapon();
      const need = def.magSize - ammo.mag;
      const take = Math.min(need, ammo.reserve);
      ammo.mag += take;
      ammo.reserve -= take;
    }
  }

  private updateAnimations(dt: number): void {
    for (const p of this.players) {
      if (!p.alive) {
        p.model.rotation.x = 0;
        continue;
      }
      if (p.moving && p.grounded) {
        p.walkTime += dt * 9;
        p.footstepAccum += dt;
        if (p.footstepAccum > 0.42) {
          p.footstepAccum = 0;
          if (p.humanControlled) playFootstep();
        }
      }
      const swing = Math.sin(p.walkTime) * 0.6;
      p.limbs.leftLeg.rotation.x = swing;
      p.limbs.rightLeg.rotation.x = -swing;
      p.limbs.leftArm.rotation.x = 1.15 + swing * 0.15;
      p.limbs.rightArm.rotation.x = 1.15 - swing * 0.15;
    }
  }

  private updateCamera(dt: number): void {
    const view = this.currentViewPlayer();
    const human = this.human();
    // camera follows the viewed player's eyes
    const eye = view.eyePosition();
    this.camera.position.copy(eye);
    const pitch = view.pitch + view.recoilPitchKick;
    const yaw = view.yaw + view.recoilYawKick;
    this.camera.rotation.x = THREE.MathUtils.clamp(pitch, -1.45, 1.45);
    this.camera.rotation.y = yaw;
    this.camera.rotation.z = 0;

    // FOV / scope
    const scoped = view.scoped && view.currentWeapon().scoped;
    const targetFov = scoped ? view.currentWeapon().zoomFov : 75;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 1 - Math.exp(-12 * dt));
    this.camera.updateProjectionMatrix();

    // hide the viewed player's body and dead bodies, show everyone else
    for (const p of this.players) p.model.visible = p.alive && p !== view;

    // viewmodel only for the human (first person)
    this.viewModel.visible = view === human && view.alive;
    if (this.viewModel.visible) {
      const kick = view.recoilPitchKick * 0.5;
      const bob = view.moving ? Math.sin(view.walkTime * 0.5) * 0.012 : 0;
      this.viewModel.position.set(0.3 + bob * 0.3, -0.27 - kick * 0.6 + Math.abs(bob), -0.5 + kick * 0.25);
      this.viewModel.rotation.x = -kick;
      this.viewModel.rotation.y = view.recoilYawKick * 0.5;
    }
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  // ------------------------------------------------------------ physics -----

  private applyMovement(p: Player, dt: number): void {
    const def = p.currentWeapon();
    let speed = def.moveSpeed;
    if (p.walkRequest) speed *= 0.55;
    if (p.scoped && def.scoped) speed *= 0.7;

    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    let wx = fx * p.moveF + rx * p.moveS;
    let wz = fz * p.moveF + rz * p.moveS;
    const len = Math.hypot(wx, wz);
    if (len > 1) {
      wx /= len;
      wz /= len;
    }
    const accel = p.grounded ? 14 : 3;
    p.vel.x = THREE.MathUtils.lerp(p.vel.x, wx * speed, 1 - Math.exp(-accel * dt));
    p.vel.z = THREE.MathUtils.lerp(p.vel.z, wz * speed, 1 - Math.exp(-accel * dt));
    p.moving = (Math.abs(p.moveF) > 0.05 || Math.abs(p.moveS) > 0.05) && p.grounded;

    if (p.jumpRequest && p.grounded) {
      p.vel.y = JUMP_SPEED;
      p.grounded = false;
    }
    p.jumpRequest = false;

    this.collide(p, dt);
  }

  private collide(p: Player, dt: number): void {
    const half = PLAYER_HALF;
    const solids = moveBlockers;

    for (let iter = 0; iter < 2; iter++) {
      p.pos.x += p.vel.x * dt;
      p.pos.z += p.vel.z * dt;
      for (const s of solids) {
        if (this.aabbOverlap(p, s)) {
          const pmin = p.pos.x - half;
          const pmax = p.pos.x + half;
          const pzmin = p.pos.z - half;
          const pzmax = p.pos.z + half;
          const oxMin = pmax - s.min.x;
          const oxMax = s.max.x - pmin;
          const ozMin = pzmax - s.min.z;
          const ozMax = s.max.z - pzmin;
          const overlapX = Math.min(oxMin, oxMax);
          const overlapZ = Math.min(ozMin, ozMax);
          if (overlapX < overlapZ) {
            p.pos.x += oxMin < oxMax ? -overlapX : overlapX;
            p.vel.x = 0;
          } else {
            p.pos.z += ozMin < ozMax ? -overlapZ : overlapZ;
            p.vel.z = 0;
          }
        }
      }
    }

    p.vel.y -= GRAVITY * dt;
    const prevY = p.pos.y;
    p.pos.y += p.vel.y * dt;
    p.grounded = false;
    if (p.pos.y <= 0) {
      p.pos.y = 0;
      p.vel.y = 0;
      p.grounded = true;
    } else {
      for (const s of solids) {
        if (p.pos.y <= s.max.y && prevY >= s.max.y - 0.02 && this.xzOverlap(p, s)) {
          p.pos.y = s.max.y;
          p.vel.y = 0;
          p.grounded = true;
          break;
        }
      }
    }
  }

  private aabbOverlap(p: Player, s: SolidBox): boolean {
    return (
      p.pos.x + PLAYER_HALF > s.min.x &&
      p.pos.x - PLAYER_HALF < s.max.x &&
      p.pos.z + PLAYER_HALF > s.min.z &&
      p.pos.z - PLAYER_HALF < s.max.z &&
      p.pos.y + PLAYER_HEIGHT > s.min.y &&
      p.pos.y < s.max.y
    );
  }

  private xzOverlap(p: Player, s: SolidBox): boolean {
    return (
      p.pos.x + PLAYER_HALF > s.min.x &&
      p.pos.x - PLAYER_HALF < s.max.x &&
      p.pos.z + PLAYER_HALF > s.min.z &&
      p.pos.z - PLAYER_HALF < s.max.z
    );
  }

  // -------------------------------------------------------------- combat ----

  private cameraForward(): THREE.Vector3 {
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(this.camera.quaternion);
    return dir.normalize();
  }

  private forward(yaw: number, pitch: number): THREE.Vector3 {
    return new THREE.Vector3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );
  }

  private applySpread(dir: THREE.Vector3, spread: number): THREE.Vector3 {
    const d = dir.clone().normalize();
    if (spread <= 0) return d;
    const up = Math.abs(d.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const right = new THREE.Vector3().crossVectors(d, up).normalize();
    const upv = new THREE.Vector3().crossVectors(right, d).normalize();
    const ox = (Math.random() * 2 - 1) * spread;
    const oy = (Math.random() * 2 - 1) * spread;
    return d.add(right.multiplyScalar(ox)).add(upv.multiplyScalar(oy)).normalize();
  }

  private fireWeapon(shooter: Player, baseDir: THREE.Vector3): void {
    const weapon = shooter.currentWeapon();
    if (shooter.reloading || shooter.cooldown > 0 || shooter.switchTimer > 0) return;
    if (weapon.slot === 'knife') {
      this.knifeAttack(shooter);
      return;
    }
    const ammo = shooter.currentAmmo();
    if (ammo.mag <= 0) {
      if (ammo.reserve > 0) this.startReload(shooter);
      return;
    }
    ammo.mag--;
    shooter.cooldown = weapon.fireInterval;
    shooter.recoilPitchKick += weapon.recoilPitch;
    shooter.recoilYawKick += (Math.random() * 2 - 1) * weapon.recoilYaw;
    shooter.spread = Math.min(weapon.spreadMax, shooter.spread + weapon.spreadPerShot);

    const totalSpread = weapon.spreadBase + shooter.spread + (shooter.moving ? weapon.spreadMove : 0);
    const dir = this.applySpread(baseDir, totalSpread);
    const trace = this.trace(shooter.eyePosition(), dir, shooter);
    if (trace.hit === 'player' && trace.player && trace.zone) {
      const mult = trace.throughDoor ? 0.5 : 1;
      this.applyDamage(trace.player, trace.zone, weapon, shooter, mult);
    }
    playShot(weapon.soundGroup);
    if (ammo.mag <= 0 && ammo.reserve > 0) this.startReload(shooter);
  }

  private knifeAttack(shooter: Player): void {
    const weapon = shooter.currentWeapon();
    shooter.cooldown = weapon.fireInterval;
    const eye = shooter.eyePosition();
    const fwd = this.forward(shooter.yaw, shooter.pitch);
    let best: Player | null = null;
    let bestD = Infinity;
    for (const p of this.players) {
      if (p === shooter || !p.alive || p.team === shooter.team) continue;
      const d = p.pos.distanceTo(shooter.pos);
      if (d > 2.6) continue;
      const to = p.eyePosition().sub(eye).normalize();
      if (to.dot(fwd) < 0.4) continue;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    if (best) {
      this.applyDamage(best, 'chest', weapon, shooter, 1);
      this.hitmarker();
    }
    playKnifeSwing();
  }

  private startReload(shooter: Player): void {
    const ammo = shooter.currentAmmo();
    const def = shooter.currentWeapon();
    if (shooter.reloading || ammo.mag >= def.magSize || ammo.reserve <= 0) return;
    shooter.reloading = true;
    shooter.reloadEnd = this.time + def.reloadTime;
    shooter.scoped = false;
    playReload();
  }

  fireBot(bot: Player, target: THREE.Vector3): void {
    const dir = target.clone().sub(bot.eyePosition()).normalize();
    this.fireWeapon(bot, dir);
  }

  requestPlant(bot: Player): void {
    if (this.phase !== 'live') return;
    if (!bot.carriesBomb || bot.team !== 'T') return;
    if (!siteAt(bot.pos.x, bot.pos.z)) return;
    bot.action = 'plant';
  }

  requestDefuse(bot: Player): void {
    if (this.phase !== 'planted') return;
    if (bot.team !== 'CT' || !this.c4Position) return;
    if (bot.pos.distanceTo(this.c4Position) > 3.2) return;
    bot.action = 'defuse';
  }

  requestPickup(bot: Player): void {
    if (this.c4State !== 'dropped' || !this.c4Position) return;
    if (bot.team !== 'T') return;
    if (bot.pos.distanceTo(this.c4Position) > 2) return;
    bot.carriesBomb = true;
    this.c4State = 'carried';
    this.c4Position = null;
  }

  private trace(origin: THREE.Vector3, dir: THREE.Vector3, shooter: Player): TraceResult {
    let blockerT = Infinity;
    for (const b of bulletBlockers) {
      const t = this.rayBox(origin, dir, b);
      if (t !== null && t < blockerT) blockerT = t;
    }
    let doorT = Infinity;
    for (const d of allSolids) {
      if (d.kind !== 'door') continue;
      const t = this.rayBox(origin, dir, d);
      if (t !== null && t < doorT) doorT = t;
    }

    let best: { player: Player; zone: HitboxZone; t: number } | null = null;
    for (const p of this.players) {
      if (p === shooter || !p.alive || p.team === shooter.team) continue;
      for (const hb of p.hitboxes()) {
        const t = this.rayBox(origin, dir, hb);
        if (t !== null && t >= 0 && (best === null || t < best.t)) {
          best = { player: p, zone: hb.zone, t };
        }
      }
    }
    if (best && best.t < blockerT) {
      return { hit: 'player', t: best.t, player: best.player, zone: best.zone, throughDoor: doorT < best.t };
    }
    return { hit: 'world', t: blockerT, throughDoor: false };
  }

  private rayBox(origin: THREE.Vector3, dir: THREE.Vector3, box: { min: THREE.Vector3; max: THREE.Vector3 }): number | null {
    let tmin = -Infinity;
    let tmax = Infinity;
    for (let i = 0; i < 3; i++) {
      const o = origin.getComponent(i);
      const d = dir.getComponent(i);
      const bmin = box.min.getComponent(i);
      const bmax = box.max.getComponent(i);
      if (Math.abs(d) < 1e-8) {
        if (o < bmin || o > bmax) return null;
      } else {
        let t1 = (bmin - o) / d;
        let t2 = (bmax - o) / d;
        if (t1 > t2) {
          const tmp = t1;
          t1 = t2;
          t2 = tmp;
        }
        tmin = Math.max(tmin, t1);
        tmax = Math.min(tmax, t2);
        if (tmin > tmax) return null;
      }
    }
    if (tmax < 0) return null;
    return tmin >= 0 ? tmin : 0;
  }

  private applyDamage(target: Player, zone: HitboxZone, weapon: WeaponDef, shooter: Player, mult: number, killCheck = true): void {
    if (!target.alive) return;
    let dmg = weapon.damage * ZONE_MULT[zone] * mult;
    const dist = shooter.pos.distanceTo(target.pos);
    if (dist > weapon.range) {
      dmg *= Math.max(0.5, 1 - (dist - weapon.range) / weapon.range);
    }
    const pierce = weapon.armorPierce ?? 0;
    let hpDmg = dmg;
    if (target.armor > 0) {
      const absorb = Math.min(target.armor, dmg * 0.5 * (1 - pierce));
      target.armor -= absorb;
      hpDmg = dmg - absorb;
    }
    target.hp -= hpDmg;
    target.lastDamageTime = this.time;
    if (target.humanControlled) setState({ damageFlash: performance.now() });
    // any hit interrupts planting / defusing
    if (target.action) {
      target.action = null;
      target.actionProgress = 0;
    }

    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      if (target.carriesBomb) {
        target.carriesBomb = false;
        this.c4State = 'dropped';
        this.c4Position = target.pos.clone();
      }
      shooter.kills += 1;
      shooter.money += KILL_MONEY;
      this.addKillfeed(`${shooter.name} [${weapon.name}] ${target.name}`);
      playKill();
      if (target.humanControlled) {
        const mate = this.players.find((q) => q.team === target.team && q.alive);
        this.spectateIndex = mate ? this.players.indexOf(mate) : 0;
      }
      if (killCheck) this.checkRoundEnd();
    }
  }

  private checkRoundEnd(): void {
    const tAlive = this.players.filter((p) => p.team === 'T' && p.alive).length;
    const ctAlive = this.players.filter((p) => p.team === 'CT' && p.alive).length;
    if (ctAlive === 0) this.endRound('T', 'CT 全灭');
    else if (tAlive === 0) {
      if (this.c4State !== 'planted') this.endRound('CT', 'T 全灭');
      // else: bomb still active, CT must defuse or it explodes
    }
  }

  private hitmarker(): void {
    playHit();
    setState({ hitmarker: performance.now() });
  }

  // ------------------------------------------------------------- AI host ----

  hasLOS(a: THREE.Vector3, b: THREE.Vector3): boolean {
    const dir = b.clone().sub(a);
    const dist = dir.length();
    if (dist < 0.001) return true;
    dir.normalize();
    for (const s of sightBlockers) {
      const t = this.rayBox(a, dir, s);
      if (t !== null && t >= 0 && t < dist - 0.05) return false;
    }
    return true;
  }

  c4Carrier(): Player | null {
    return this.players.find((p) => p.carriesBomb) ?? null;
  }

  get allPlayers(): Player[] {
    return this.players;
  }

  // ---------------------------------------------------------------- input ---

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    const human = this.human();
    if (!this.started) return;

    if (e.code === 'KeyR') {
      if (human.alive) this.startReload(human);
    }
    if (e.code === 'Digit1') {
      human.equipPrimary();
      this.refreshViewModel(human);
    }
    if (e.code === 'Digit2') {
      human.equipSecondary();
      this.refreshViewModel(human);
    }
    if (e.code === 'Digit3') {
      human.equipKnife();
      this.refreshViewModel(human);
    }
    if (e.code === 'KeyQ') {
      if (human.currentSlot === 'primary') human.equipSecondary();
      else if (human.primary) human.equipPrimary();
      this.refreshViewModel(human);
    }
    if (e.code === 'KeyB') {
      if (this.phase === 'freeze') this.toggleBuy();
    }
    if (e.code === 'KeyE' && !e.repeat) {
      this.interact(human);
    }
    if (e.code === 'KeyG' && !e.repeat) {
      if (!human.alive) this.takeOver();
    }
    if (e.code === 'Space' && !human.alive && !e.repeat) {
      this.cycleSpectate();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.started || !this.locked) return;
    const human = this.human();
    if (!human.alive) return;
    if (e.button === 0) {
      this.firing = true;
      if (!human.currentWeapon().automatic) this.fireWeapon(human, this.cameraForward());
    } else if (e.button === 2) {
      this.toggleScope(human);
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.firing = false;
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked || !this.started) return;
    const human = this.human();
    if (!human.alive) return;
    const sens = 0.0021;
    human.yaw -= e.movementX * sens;
    human.pitch -= e.movementY * sens;
    human.pitch = THREE.MathUtils.clamp(human.pitch, -1.45, 1.45);
  };

  private onContext = (e: Event): void => e.preventDefault();

  private onLockChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
    if (!this.locked && this.started) setState({ paused: true });
    else setState({ paused: false });
  };

  private toggleScope(human: Player): void {
    if (!human.currentWeapon().scoped) return;
    human.scoped = !human.scoped;
    playZoom();
    setState({ scoped: human.scoped });
  }

  private interact(human: Player): void {
    if (!human.alive) return;
    // plant
    if (human.team === 'T' && human.carriesBomb && siteAt(human.pos.x, human.pos.z) && this.phase === 'live') {
      human.action = 'plant';
      return;
    }
    // defuse
    if (human.team === 'CT' && this.c4State === 'planted' && this.c4Position && human.pos.distanceTo(this.c4Position) < 3) {
      human.action = 'defuse';
      return;
    }
    // pickup
    if (human.team === 'T' && this.c4State === 'dropped' && this.c4Position && human.pos.distanceTo(this.c4Position) < PICKUP_RANGE) {
      human.carriesBomb = true;
      this.c4State = 'carried';
      this.c4Position = null;
      this.message('你捡起了 C4');
    }
  }

  // ------------------------------------------------------------- helpers ----

  private human(): Player {
    return this.players[this.humanIndex];
  }

  private currentViewPlayer(): Player {
    const human = this.human();
    if (human.alive) return human;
    const target = this.players[this.spectateIndex];
    if (target && target.alive) return target;
    // find any alive teammate
    const alive = this.players.find((p) => p.team === human.team && p.alive);
    return alive ?? human;
  }

  private refreshViewModel(p: Player): void {
    while (this.viewModel.children.length > 0) {
      const c = this.viewModel.children[0];
      this.viewModel.remove(c);
      (c as THREE.Mesh).geometry?.dispose?.();
    }
    this.viewModel.add(buildViewModel(p.currentWeaponId()));
  }

  private message(text: string): void {
    this.messageUntil = this.time + 2.5;
    setState({ message: text });
  }

  private addKillfeed(text: string): void {
    const state = getState();
    const feed = [{ id: this.killfeedId++, text, time: performance.now() }, ...state.killfeed].slice(0, 6);
    setState({ killfeed: feed });
  }

  private publishHud(): void {
    const human = this.human();
    const view = this.currentViewPlayer();
    const weapon = view.currentWeapon();
    const ammo = view.currentAmmo();

    // minimap players: teammates always, enemies only if seen
    this.computeVisibleEnemies();
    const minimapPlayers = this.players
      .filter((p) => p.alive)
      .filter((p) => p.team === human.team || this.visibleEnemies.has(p.id))
      .map((p) => ({
        x: p.pos.x,
        z: p.pos.z,
        team: p.team,
        alive: p.alive,
        isSelf: p === view,
      }));

    setState({
      phase: this.phase,
      round: this.round,
      roundTime: Math.max(0, this.phase === 'planted' ? this.c4Timer : this.phase === 'freeze' ? this.freezeTimer : this.roundTimer),
      c4State: this.c4State,
      c4Timer: Math.max(0, this.c4Timer),
      c4Team: this.c4State === 'none' ? null : 'T',
      score: { ...this.score },
      team: human.team,
      alive: view.alive,
      hp: Math.max(0, Math.ceil(view.hp)),
      armor: Math.max(0, Math.ceil(view.armor)),
      money: human.money,
      weaponName: weapon.name,
      weaponSlot: view.currentSlot,
      mag: ammo.mag,
      reserve: ammo.reserve,
      reloading: view.reloading,
      scoped: view.scoped && weapon.scoped,
      minimapPlayers,
      c4Pos: this.c4Position ? { x: this.c4Position.x, z: this.c4Position.z } : null,
      spectating: view.alive && view !== human ? view.name : null,
    });

    if (this.time > this.messageUntil && getState().message) {
      setState({ message: '' });
    }
  }

  private computeVisibleEnemies(): void {
    this.visibleEnemies.clear();
    const human = this.human();
    for (const enemy of this.players) {
      if (!enemy.alive || enemy.team === human.team) continue;
      const eyeE = enemy.eyePosition();
      for (const friend of this.players) {
        if (!friend.alive || friend.team !== human.team) continue;
        const d = friend.pos.distanceTo(enemy.pos);
        if (d > 46) continue;
        const to = eyeE.sub(friend.eyePosition());
        const yawTo = Math.atan2(-to.x, -to.z);
        const diff = Math.abs(((yawTo - friend.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (diff > 1.05) continue;
        if (this.hasLOS(friend.eyePosition(), eyeE)) {
          this.visibleEnemies.add(enemy.id);
          break;
        }
      }
    }
  }

  private shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}

// singleton access for React components
let engineInstance: Engine | null = null;
export function setEngine(e: Engine | null): void {
  engineInstance = e;
}
export function getEngine(): Engine | null {
  return engineInstance;
}

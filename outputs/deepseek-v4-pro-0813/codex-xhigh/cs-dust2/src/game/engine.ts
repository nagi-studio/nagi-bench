import * as THREE from 'three';
import { AudioSynth } from './audio';
import { C4Bomb } from './bomb';
import { Combatant } from './combatant';
import { Dust2Map, MapCollider } from './map';
import { AGENT_RADIUS, MAP_EXTENT, NAV_NODES, SITE_ZONES, TEAM_SPAWNS } from './mapData';
import { angleDelta, clamp, damp, distance2d, rayIntersectsBox, segmentIntersectsBox, segmentIntersectsSphere } from './math';
import { Navigation } from './navigation';
import { DEFAULT_HUD_STATE, HudState, KillfeedItem, MinimapEntity, PlayerPhase, Team, WeaponId } from './types';
import { FirstPersonViewModel } from './viewModel';
import { WEAPON_DEFS, createLoadout, freshAmmo } from './weapons';

interface ShotResult {
  target: Combatant | null;
  part: string;
  damage: number;
  headshot: boolean;
  killed: boolean;
  wallHit: boolean;
}

export class Dust2Game {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();
  private readonly map: Dust2Map;
  private readonly nav = new Navigation();
  private readonly audio = new AudioSynth();
  private readonly viewModel: FirstPersonViewModel;
  private combatants: Combatant[] = [];
  private controlledId = 'ct-0';
  private bomb: C4Bomb;
  private bombCarrierId: string | null = null;
  private bombPlanted = false;
  private bombPos: [number, number] | null = null;
  private bombTimer = 40;

  private keys = new Set<string>();
  private mouseButtons = new Set<number>();
  private mouseYaw = Math.PI;
  private mousePitch = 0;
  private locked = false;
  private phase: PlayerPhase = 'loading';
  private started = false;
  private roundNumber = 1;
  private scoreCT = 0;
  private scoreT = 0;
  private roundTime = 115;
  private roundWinner: Team | null = null;
  private roundEndAt = 0;
  private message = DEFAULT_HUD_STATE.message;
  private lastHudTime = 0;
  private hudCallback: ((state: HudState) => void) | null = null;
  private disposeRequested = false;
  private elapsed = 0;
  private fireHeld = false;
  private semiTriggerPulled = false;
  private scopeLevel = 0;
  private targetFov = 75;
  private hitMarker = 0;
  private deathSwitchAt = 0;
  private bombTargetSite: 'A' | 'B' = 'A';
  private buyMenu = false;
  private killfeed: KillfeedItem[] = [];
  private killfeedId = 0;
  private disposed = false;

  private readonly disposers: Array<() => void> = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight), 0.08, 220);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(-50, 1.62, -6);
    this.scene.add(this.camera);

    this.map = new Dust2Map(this.scene);
    this.bomb = new C4Bomb(this.scene);
    this.viewModel = new FirstPersonViewModel(this.camera);
    this.viewModel.setWeapon('usp');

    this.bindEvents();
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.setupRound(true);
    this.phase = 'menu';
    this.message = '点击画面进入战斗 · WASD 移动 / 鼠标射击 / R 换弹';
    this.emitHud(true);
  }

  onHudState(callback: (state: HudState) => void) {
    this.hudCallback = callback;
    callback(this.buildHud());
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.clock.start();
    this.renderer.setAnimationLoop(() => this.tick());
  }

  resumeFromMenu() {
    if (!this.renderer.domElement) return;
    this.renderer.domElement.requestPointerLock();
  }

  dispose() {
    this.disposeRequested = true;
    if (this.started) this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.resize);
    for (const dispose of this.disposers) dispose();
    this.disposers.length = 0;
    this.bomb.dispose();
    this.viewModel.dispose();
    this.map.colliders.forEach((collider) => collider.mesh.traverse((child) => child instanceof THREE.Mesh && child.geometry.dispose()));
    this.combatants.forEach((combatant) => {
      this.scene.remove(combatant.model);
      combatant.model.traverse((child) => child instanceof THREE.Mesh && child.geometry.dispose());
    });
    this.audio.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.disposed = true;
  }

  private get controlled(): Combatant {
    return this.combatants.find((c) => c.id === this.controlledId) ?? this.combatants[0];
  }

  private get playerTeam(): Team {
    return this.controlled.team;
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;
    const onClick = () => {
      this.audio.ensureContext();
      if (!this.locked) canvas.requestPointerLock();
    };
    canvas.addEventListener('click', onClick);
    this.disposers.push(() => canvas.removeEventListener('click', onClick));

    const onPointerLockChange = () => {
      this.locked = document.pointerLockElement === canvas;
      if (this.locked) {
        this.audio.ensureContext();
        if (this.phase === 'menu' || this.phase === 'roundEnd') {
          if (this.phase === 'roundEnd') this.setupRound(this.roundNumber + 1);
          this.phase = 'playing';
          this.message = this.roundNumber === 1 ? '手枪局：全员默认手枪，无护甲' : '回合开始';
        }
      } else if (this.phase !== 'roundEnd') {
        this.phase = 'menu';
        this.message = '已暂停 · 点击画面继续';
        this.keys.clear();
        this.mouseButtons.clear();
        this.fireHeld = false;
      }
      this.emitHud(true);
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);
    this.disposers.push(() => document.removeEventListener('pointerlockchange', onPointerLockChange));

    const onMouseMove = (event: MouseEvent) => {
      if (!this.locked || this.phase !== 'playing' || !this.controlled.alive) return;
      const sensitivity = this.scopeLevel > 0 ? 0.0009 : 0.0021;
      this.mouseYaw -= event.movementX * sensitivity;
      this.mousePitch = clamp(this.mousePitch - event.movementY * sensitivity, -1.38, 1.38);
    };
    document.addEventListener('mousemove', onMouseMove);
    this.disposers.push(() => document.removeEventListener('mousemove', onMouseMove));

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        this.fireHeld = true;
        this.semiTriggerPulled = true;
      }
      this.mouseButtons.add(event.button);
      if (event.button === 2) this.toggleScope();
    };
    const onMouseUp = (event: MouseEvent) => {
      this.mouseButtons.delete(event.button);
      if (event.button === 0) {
        this.fireHeld = false;
        this.semiTriggerPulled = false;
      }
    };
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    this.disposers.push(() => canvas.removeEventListener('mousedown', onMouseDown));
    this.disposers.push(() => window.removeEventListener('mouseup', onMouseUp));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        this.buyMenu = false;
        this.emitHud(true);
        return;
      }
      this.keys.add(event.code);
      this.handleKey(event.code, event);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      this.keys.delete(event.code);
      if (event.code === 'KeyE') {
        this.cancelInteraction();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    this.disposers.push(() => window.removeEventListener('keydown', onKeyDown));
    this.disposers.push(() => window.removeEventListener('keyup', onKeyUp));

    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    canvas.addEventListener('contextmenu', onContextMenu);
    this.disposers.push(() => canvas.removeEventListener('contextmenu', onContextMenu));
  }

  private handleKey(code: string, event: KeyboardEvent) {
    if (this.phase !== 'playing') return;
    const c = this.controlled;
    if (!c.alive) {
      if (code === 'Space') this.switchControlToAliveTeammate();
      return;
    }
    if (code === 'KeyR') {
      c.startReload();
      if (c.reloading) this.audio.reload('start');
    }
    if (code === 'Digit1') {
      c.equip('primary');
      if (c.currentWeaponId !== 'awp') this.scopeLevel = 0;
    }
    if (code === 'Digit2') {
      c.equip('secondary');
      this.scopeLevel = 0;
    }
    if (code === 'Digit3') {
      c.equip('melee');
      this.scopeLevel = 0;
    }
    if (code === 'KeyE') this.interact(c);
    if (code === 'KeyQ') this.switchControlToAliveTeammate();
    if (code === 'KeyB') {
      this.buyMenu = !this.buyMenu;
      this.emitHud(true);
    }
    if (this.buyMenu) {
      this.handleBuyMenu(code, event);
    }
  }

  private handleBuyMenu(code: string, event: KeyboardEvent) {
    const c = this.controlled;
    if (!c.alive) return;
    const weapon: WeaponId | undefined = code === 'Digit1' ? (c.team === 'CT' ? 'm4a4' : 'ak47') : code === 'Digit2' ? 'awp' : code === 'Digit3' ? 'deagle' : code === 'Digit4' ? 'usp' : undefined;
    if (!weapon) return;
    c.giveWeapon(weapon);
    this.audio.ui();
    this.buyMenu = false;
    event.preventDefault();
    this.addKillfeed(`${c.team === 'CT' ? 'CT' : 'T'} 购买 ${WEAPON_DEFS[weapon].name}`, c.team);
    this.emitHud(true);
  }

  private toggleScope() {
    if (this.phase !== 'playing' || !this.controlled.alive || this.controlled.currentWeaponId !== 'awp') return;
    this.scopeLevel = this.scopeLevel === 0 ? 1 : 0;
    this.targetFov = this.scopeLevel > 0 ? 19 : 75;
    this.audio.zoom(this.scopeLevel > 0);
  }

  private interact(c: Combatant) {
    if (!c.alive || c.team !== 'CT') {
      if (c.team === 'T' && this.bomb.state === 'dropped' && distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) < 1.25) {
        this.pickupBomb(c);
    } else if (c.team === 'T' && this.isInSite(c, this.bombTargetSite)) {
        c.planting = true;
        c.interactionProgress = 0;
      }
      return;
    }
    if (this.bomb.state === 'planted' && distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) < 1.35) {
      c.defusing = true;
      c.interactionProgress = 0;
    }
  }

  private cancelInteraction() {
    const c = this.controlled;
    c.planting = false;
    c.defusing = false;
    c.interactionProgress = 0;
  }

  private setupRound(firstOrRoundNumber: boolean | number = false) {
    if (typeof firstOrRoundNumber === 'number') {
      this.roundNumber = firstOrRoundNumber;
    }
    for (const old of this.combatants) {
      this.scene.remove(old.model);
      old.model.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      });
    }
    this.combatants = [];
    this.controlledId = 'ct-0';
    this.bombCarrierId = null;
    this.bombPlanted = false;
    this.bombPos = null;
    this.bomb.hide();
    this.bombTimer = 40;
    this.roundTime = 115;
    this.roundWinner = null;
    this.scopeLevel = 0;
    this.targetFov = 75;
    this.buyMenu = false;
    this.fireHeld = false;
    this.semiTriggerPulled = false;
    this.hitMarker = 0;
    this.deathSwitchAt = 0;
    this.bombTargetSite = Math.random() > 0.5 ? 'A' : 'B';

    this.spawnCombatants();
    this.assignBombToRandomT();
    this.positionControlledCamera(true);
    this.updateVisibility();

    if (this.roundNumber === 1) {
      this.message = '手枪局：全员默认手枪，无护甲 · 点击进入';
    } else {
      this.message = '点击画面进入下一回合';
    }
    if (typeof firstOrRoundNumber !== 'boolean' || !firstOrRoundNumber) this.phase = 'menu';
    this.emitHud(true);
  }

  private spawnCombatants() {
    const pistolRound = this.roundNumber === 1;
    const teams: Team[] = ['CT', 'T'];
    for (const team of teams) {
      const count = 5;
      for (let i = 0; i < count; i += 1) {
        const id = `${team.toLowerCase()}-${i}`;
        const isPlayer = team === 'CT' && i === 0;
        const loadout = createLoadout(team, pistolRound);
        if (!pistolRound && i === (team === 'CT' ? 2 : 3)) {
          loadout.primary = 'awp';
          loadout.ammo.awp = freshAmmo('awp');
        }
        const combatant = new Combatant({
          id,
          team,
          isPlayer,
          pistolRound,
          loadoutOverride: loadout,
        });
        const [x, z] = TEAM_SPAWNS[team][i];
        const yaw = team === 'CT' ? 0.75 : -2.2;
        combatant.setPosition(x, z, yaw);
        combatant.model.setWeapon(combatant.currentWeaponId);
        this.scene.add(combatant.model);
        this.combatants.push(combatant);
      }
    }
  }

  private assignBombToRandomT() {
    const tPlayers = this.combatants.filter((c) => c.team === 'T' && c.alive);
    if (tPlayers.length === 0) return;
    const carrier = tPlayers[Math.floor(Math.random() * tPlayers.length)];
    this.bombCarrierId = carrier.id;
    carrier.hasBomb = true;
    this.bomb.hide();
  }

  private positionControlledCamera(snap = false) {
    const c = this.controlled;
    if (snap) {
      this.mouseYaw = c.yaw;
      this.mousePitch = 0;
    }
    this.camera.position.set(c.x, c.model.position.y + 1.62, c.z);
    this.camera.rotation.set(this.mousePitch, this.mouseYaw, 0, 'YXZ');
  }

  private resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private tick() {
    if (this.disposeRequested || this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;

    if (this.phase === 'playing') {
      this.updateGame(dt);
    } else if (this.phase === 'roundEnd') {
      this.bomb.update(dt);
      if (this.elapsed > this.roundEndAt) this.setupRound(this.roundNumber + 1);
      this.updateModelsOnly(dt);
    } else {
      this.updateModelsOnly(dt);
    }

    this.updateCamera(dt);
    this.viewModel.update(
      dt,
      this.getControlledMovementInput().lengthSq() > 0.01 && this.controlled.alive,
      this.getControlledSpeed(),
      this.controlled.reloading,
      this.scopeLevel > 0 && this.controlled.currentWeaponId === 'awp',
    );
    this.renderer.render(this.scene, this.camera);

    if (this.elapsed - this.lastHudTime > 0.05) {
      this.lastHudTime = this.elapsed;
      this.emitHud();
    }
  }

  private updateModelsOnly(dt: number) {
    for (const c of this.combatants) {
      c.updateModel(dt, false, 0);
    }
    this.bomb.update(dt);
  }

  private updateGame(dt: number) {
    if (!this.roundWinner) this.roundTime = Math.max(0, this.roundTime - dt);
    this.updatePlayer(dt);
    this.updateCombatantTimers(dt);
    this.updateAI(dt);
    this.updateBombAndInteractions(dt);
    this.moveAllCombatants(dt);
    this.updateVisibility();
    this.checkRoundEnd();

    if (!this.controlled.alive && this.deathSwitchAt > 0 && this.elapsed >= this.deathSwitchAt) {
      this.switchControlToAliveTeammate();
    }
  }

  private updatePlayer(dt: number) {
    const c = this.controlled;
    if (!c.alive || this.phase !== 'playing') {
      c.velocity.x = 0;
      c.velocity.z = 0;
      return;
    }

    const input = this.getControlledMovementInput();
    const speed = this.getControlledSpeed();
    c.velocity.x = input.x * speed;
    c.velocity.z = input.y * speed;

    if (this.keys.has('Space') && c.onGround) {
      c.verticalVelocity = 6.5;
      c.onGround = false;
    }

    c.yaw = this.mouseYaw;
    c.pitch = this.mousePitch;

    if (this.fireHeld) {
      const semiReady = c.currentWeaponDef.auto || this.semiTriggerPulled;
      if (semiReady) this.tryFire(c, true);
    }

    if (c.planting || c.defusing) {
      if (input.lengthSq() > 0.01) this.cancelInteraction();
      const required = c.planting ? 3.2 : 5;
      c.interactionProgress += dt;
      if (c.interactionProgress >= required) {
        if (c.planting) this.plantBomb(c);
        else if (c.defusing) this.defuseBomb(c);
      }
    }
  }

  private getControlledMovementInput(): THREE.Vector2 {
    const c = this.controlled;
    if (!c.alive || this.phase !== 'playing') return new THREE.Vector2();
    let forward = 0;
    let right = 0;
    if (this.keys.has('KeyW')) forward += 1;
    if (this.keys.has('KeyS')) forward -= 1;
    if (this.keys.has('KeyD')) right += 1;
    if (this.keys.has('KeyA')) right -= 1;
    if (forward !== 0 && right !== 0) {
      const inv = 1 / Math.SQRT2;
      forward *= inv;
      right *= inv;
    }
    const sin = Math.sin(c.yaw);
    const cos = Math.cos(c.yaw);
    return new THREE.Vector2(sin * forward + cos * right, cos * forward - sin * right);
  }

  private getControlledSpeed(): number {
    return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 2.6 : 5.4;
  }

  private updateCombatantTimers(dt: number) {
    for (const c of this.combatants) {
      c.fireCooldown = Math.max(0, c.fireCooldown - dt);
      c.recoilPitch *= Math.max(0, 1 - dt * 7.5);
      c.recoilYaw *= Math.max(0, 1 - dt * 7.5);
      c.spread = Math.max(c.currentWeaponDef.spreadBase, c.spread - dt * (0.06 + c.spread * 2));
      if (c.reloading) {
        c.updateReload(dt, (stage) => {
          if (stage === 'start' && c.isPlayer) this.audio.reload('start');
          if (stage === 'end' && c.isPlayer) this.audio.reload('end');
        });
      }
    }
    this.hitMarker = Math.max(0, this.hitMarker - dt);
  }

  private moveAllCombatants(dt: number) {
    for (const c of this.combatants) {
      this.moveCombatant(c, dt);
    }
  }

  private moveCombatant(c: Combatant, dt: number) {
    if (!c.alive) {
      c.velocity.x = 0;
      c.velocity.z = 0;
      c.updateModel(dt, false, 0);
      return;
    }

    c.verticalVelocity -= 18 * dt;
    let y = c.model.position.y + c.verticalVelocity * dt;
    if (y <= 0) {
      y = 0;
      c.verticalVelocity = 0;
      c.onGround = true;
    } else {
      c.onGround = false;
    }

    let x = c.x + c.velocity.x * dt;
    let z = c.z + c.velocity.z * dt;
    [x, z] = this.resolveCircleCollisions(x, z);
    x = clamp(x, -MAP_EXTENT + AGENT_RADIUS, MAP_EXTENT - AGENT_RADIUS);
    z = clamp(z, -MAP_EXTENT + AGENT_RADIUS, MAP_EXTENT - AGENT_RADIUS);
    c.x = x;
    c.z = z;
    c.model.position.y = y;

    const moving = Math.hypot(c.velocity.x, c.velocity.z) > 0.12;
    const speed = Math.hypot(c.velocity.x, c.velocity.z);
    if (moving && c.onGround && this.elapsed - c.lastFootstepAt > (speed > 3.4 ? 0.31 : 0.43)) {
      c.lastFootstepAt = this.elapsed;
      if (c.isPlayer) this.audio.footstep(speed > 3.4);
    }
    c.updateModel(dt, moving, speed);
  }

  private resolveCircleCollisions(x: number, z: number): [number, number] {
    for (let pass = 0; pass < 2; pass += 1) {
      for (const collider of this.map.colliders) {
        const minX = collider.min.x - AGENT_RADIUS;
        const maxX = collider.max.x + AGENT_RADIUS;
        const minZ = collider.min.z - AGENT_RADIUS;
        const maxZ = collider.max.z + AGENT_RADIUS;
        if (x <= minX || x >= maxX || z <= minZ || z >= maxZ) continue;

        const pushes = [
          { value: x - minX, nx: minX, nz: z },
          { value: maxX - x, nx: maxX, nz: z },
          { value: z - minZ, nx: x, nz: minZ },
          { value: maxZ - z, nx: x, nz: maxZ },
        ].sort((a, b) => a.value - b.value);
        const push = pushes[0];
        x = push.nx;
        z = push.nz;
      }
    }
    return [x, z];
  }

  private updateCamera(dt: number) {
    const c = this.controlled;
    const desiredFov = this.scopeLevel > 0 && c.alive && c.currentWeaponId === 'awp' ? 19 : 75;
    this.targetFov = desiredFov;
    this.camera.fov = damp(this.camera.fov, this.targetFov, 10, dt);
    this.camera.updateProjectionMatrix();
    this.camera.position.set(c.x, c.model.position.y + 1.62, c.z);
    this.camera.rotation.set(this.mousePitch, this.mouseYaw, 0, 'YXZ');
  }

  private updateAI(dt: number) {
    for (const c of this.combatants) {
      if (c.isPlayer || !c.alive) continue;
      this.chooseAIObjective(c);
      this.executeAI(c, dt);
    }
  }

  private chooseAIObjective(c: Combatant) {
    const enemy = this.findVisibleEnemy(c);
    if (enemy) {
      c.ai.mode = 'combat';
      c.ai.targetId = enemy.id;
      c.ai.path = [];
      return;
    }

    c.ai.targetId = null;
    if (c.team === 'T') {
      if (this.bomb.state === 'planted') {
        this.goToPoint(c, 'hold', this.bomb.position.x, this.bomb.position.z);
        return;
      }
      const site = this.getSiteZone(this.bombTargetSite);
      if (c.hasBomb && this.isInSite(c, this.bombTargetSite)) {
        c.ai.mode = 'plant';
        c.ai.path = [];
        return;
      }
      this.goToPoint(c, 'goto', site.x + (c.hasBomb ? 0 : Math.cos(c.id.charCodeAt(4)) * 2.2), site.z + (c.hasBomb ? 0 : Math.sin(c.id.charCodeAt(4)) * 2.2));
      return;
    }

    if (this.bomb.state === 'planted') {
      const dist = distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z);
      const nearest = this.combatants
        .filter((other) => other.team === 'CT' && other.alive)
        .sort((a, b) => distance2d(a.x, a.z, this.bomb.position.x, this.bomb.position.z) - distance2d(b.x, b.z, this.bomb.position.x, this.bomb.position.z))[0];
      if (nearest?.id === c.id && dist < 2.5) {
        c.ai.mode = 'defuse';
        c.ai.path = [];
      } else {
        this.goToPoint(c, 'goto', this.bomb.position.x, this.bomb.position.z);
      }
      return;
    }

    if (c.ai.mode === 'idle' || c.ai.mode === 'patrol') {
      const node = this.nav.nearestNode(c.x, c.z);
      c.ai.patrolNode = node;
      const next = this.pickPatrolNode(c);
      this.goToPoint(c, 'patrol', next.x, next.z);
    }
  }

  private executeAI(c: Combatant, dt: number) {
    if (!c.alive) return;

    if (c.ai.mode === 'combat') {
      const target = this.combatants.find((other) => other.id === c.ai.targetId && other.alive);
      if (target && this.hasLineOfSight(c.eyePosition, target.headPosition)) {
        const dx = target.x - c.x;
        const dz = target.z - c.z;
        const dist = Math.hypot(dx, dz);
        c.yaw = Math.atan2(dx, dz);
        c.pitch = clamp(Math.atan2(1.55 - c.eyePosition.y, dist) + (Math.random() - 0.5) * 0.012, -0.7, 0.7);
        c.ai.lookX = dx;
        c.ai.lookZ = dz;

        const desired = dist > 16 ? 0.8 : 0;
        const forwardX = Math.sin(c.yaw);
        const forwardZ = Math.cos(c.yaw);
        const rightX = Math.cos(c.yaw);
        const rightZ = -Math.sin(c.yaw);
        c.ai.strafeTimer -= dt;
        if (c.ai.strafeTimer <= 0) {
          c.ai.strafeTimer = 0.5 + Math.random() * 0.8;
          c.ai.strafeDir = Math.random() > 0.5 ? 1 : -1;
        }
        const speed = c.currentWeaponId === 'awp' ? 1.9 : 3.2;
        c.velocity.x = forwardX * desired * speed + rightX * c.ai.strafeDir * speed * 0.65;
        c.velocity.z = forwardZ * desired * speed + rightZ * c.ai.strafeDir * speed * 0.65;

        if (c.canFire(this.elapsed)) {
          c.pitch += (Math.random() - 0.5) * 0.018;
          this.tryFire(c, false);
        }
        return;
      }
      c.ai.targetId = null;
      c.ai.mode = 'idle';
    }

    if (c.ai.mode === 'plant' && c.team === 'T' && c.hasBomb) {
      const site = this.getSiteZone(this.bombTargetSite);
      if (!this.isInSite(c, this.bombTargetSite)) {
        this.goToPoint(c, 'goto', site.x, site.z);
        return;
      }
      c.velocity.x = 0;
      c.velocity.z = 0;
      c.yaw = Math.atan2(-c.x, -c.z);
      c.planting = true;
      c.interactionProgress += dt;
      if (c.interactionProgress >= 3.2) this.plantBomb(c);
      return;
    }

    if (c.ai.mode === 'defuse' && c.team === 'CT' && this.bomb.state === 'planted') {
      const dist = distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z);
      if (dist > 1.35) {
        this.goToPoint(c, 'goto', this.bomb.position.x, this.bomb.position.z);
        return;
      }
      c.velocity.x = 0;
      c.velocity.z = 0;
      c.yaw = Math.atan2(-c.x, -c.z);
      c.defusing = true;
      c.interactionProgress += dt;
      if (c.interactionProgress >= 5) this.defuseBomb(c);
      return;
    }

    if (c.ai.mode === 'hold') {
      const dx = c.ai.holdX - c.x;
      const dz = c.ai.holdZ - c.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 1.2) {
        c.velocity.x = (dx / Math.max(dist, 0.01)) * 3.1;
        c.velocity.z = (dz / Math.max(dist, 0.01)) * 3.1;
      } else {
        c.velocity.x = Math.sin(this.elapsed * 0.9 + c.id.charCodeAt(2)) * 0.3;
        c.velocity.z = Math.cos(this.elapsed * 0.8 + c.id.charCodeAt(2)) * 0.3;
      }
      return;
    }

    this.followPath(c, c.ai.mode === 'patrol' ? 2.5 : 3.4);
  }

  private goToPoint(c: Combatant, mode: 'goto' | 'patrol' | 'hold', x: number, z: number) {
    const oldMode = c.ai.mode;
    const oldX = c.ai.holdX;
    const oldZ = c.ai.holdZ;
    if (oldMode === mode && oldX === x && oldZ === z && c.ai.path.length > 0) return;
    c.ai.mode = mode;
    c.ai.holdX = x;
    c.ai.holdZ = z;
    c.ai.path = this.nav.findPath(c.x, c.z, x, z);
    c.ai.pathIndex = 0;
    c.planting = false;
    c.defusing = false;
  }

  private followPath(c: Combatant, speed: number) {
    if (c.ai.path.length === 0) {
      c.velocity.x = 0;
      c.velocity.z = 0;
      return;
    }
    while (c.ai.pathIndex < c.ai.path.length - 1) {
      const point = c.ai.path[c.ai.pathIndex];
      if (distance2d(c.x, c.z, point.x, point.z) < 1.25) c.ai.pathIndex += 1;
      else break;
    }
    const point = c.ai.path[c.ai.pathIndex] ?? c.ai.path[c.ai.path.length - 1];
    const dx = point.x - c.x;
    const dz = point.z - c.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.18) {
      c.velocity.x = 0;
      c.velocity.z = 0;
      if (c.ai.mode === 'goto') {
        c.ai.mode = 'idle';
        c.ai.path = [];
      }
      if (c.ai.mode === 'patrol') {
        c.ai.patrolNode = this.nav.nearestNode(c.x, c.z);
      }
      return;
    }
    const moveX = (dx / dist) * speed;
    const moveZ = (dz / dist) * speed;
    c.velocity.x = moveX;
    c.velocity.z = moveZ;
    c.yaw += angleDelta(c.yaw, Math.atan2(dx, dz)) * Math.min(1, 8 / 60);
  }

  private pickPatrolNode(c: Combatant): { x: number; z: number } {
    const teamNodeIds = c.team === 'CT'
      ? ['ctSpawn', 'aSite', 'mid', 'cat', 'bSite']
      : ['tSpawn', 'aLong', 'bTunnelMid', 'bSite', 'aSite'];
    const current = c.ai.patrolNode;
    const candidates = NAV_NODES.filter((node) => teamNodeIds.includes(node.id) && node.id !== current);
    const selected = candidates[Math.floor(Math.random() * candidates.length)] ?? NAV_NODES[0];
    return { x: selected.x, z: selected.z };
  }

  private findVisibleEnemy(c: Combatant): Combatant | null {
    let best: Combatant | null = null;
    let bestDistance = 46;
    for (const other of this.combatants) {
      if (other.team === c.team || !other.alive) continue;
      const dist = distance2d(c.x, c.z, other.x, other.z);
      if (dist > bestDistance) continue;
      const angle = Math.abs(angleDelta(c.yaw, Math.atan2(other.x - c.x, other.z - c.z)));
      if (angle > 1.45) continue;
      if (!this.hasLineOfSight(c.eyePosition, other.headPosition)) continue;
      best = other;
      bestDistance = dist;
    }
    return best;
  }

  private hasLineOfSight(from: THREE.Vector3, to: THREE.Vector3): boolean {
    if (distance2d(from.x, from.z, to.x, to.z) > 50) return false;
    for (const collider of this.map.colliders) {
      if (segmentIntersectsBox(from, to, collider.min, collider.max)) return false;
    }
    return true;
  }

  private updateVisibility() {
    const player = this.controlled;
    if (!player.alive) {
      for (const c of this.combatants) c.visibleToPlayer = c.team === player.team;
      return;
    }
    const playerEye = player.eyePosition;
    for (const c of this.combatants) {
      if (c.team === player.team) {
        c.visibleToPlayer = true;
      } else {
        c.visibleToPlayer = c.alive && this.hasLineOfSight(playerEye, c.headPosition);
      }
    }
  }

  private updateBombAndInteractions(dt: number) {
    this.bomb.update(dt);
    if (this.bomb.state === 'planted') {
      this.bombTimer = this.bomb.timer;
      this.bombPos = [this.bomb.position.x, this.bomb.position.z];
      if (this.bomb.timer <= 0) this.explodeBomb();
    }

    if (this.bomb.state === 'dropped') {
      this.bombPos = [this.bomb.position.x, this.bomb.position.z];
      for (const c of this.combatants) {
        if (c.team === 'T' && c.alive && !c.hasBomb && distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) < 1.25) {
          this.pickupBomb(c);
        }
      }
    }

    for (const c of this.combatants) {
      if (c.planting && !this.isInSite(c, this.bombTargetSite)) {
        c.planting = false;
        c.interactionProgress = 0;
      }
      if (c.defusing && (this.bomb.state !== 'planted' || distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) > 1.35)) {
        c.defusing = false;
        c.interactionProgress = 0;
      }
    }
  }

  private getSiteZone(site: 'A' | 'B') {
    return SITE_ZONES.find((zone) => zone.id === site)!;
  }

  private isInSite(c: Combatant, site: 'A' | 'B'): boolean {
    const zone = this.getSiteZone(site);
    return distance2d(c.x, c.z, zone.x, zone.z) <= zone.radius;
  }

  private tryFire(c: Combatant, playerSemiTrigger: boolean) {
    if (!c.canFire(this.elapsed)) return;
    const def = c.currentWeaponDef;
    if (c.isPlayer && !def.auto && !playerSemiTrigger) return;
    if (c.isPlayer && !def.auto) this.semiTriggerPulled = false;

    c.consumeShot();
    c.fireCooldown = 60 / def.rpm;
    c.spread = Math.min(0.14, c.spread + def.spreadFire);
    c.recoilPitch = Math.min(0.24, c.recoilPitch + def.recoilPitch);
    c.recoilYaw += (Math.random() - 0.5) * def.recoilYaw * 2;
    this.audio.shoot(def.sound);
    if (c.isPlayer) this.viewModel.fire(c.currentWeaponId);

    const result = this.performShot(c);
    if (result.target) {
      this.audio.hit(result.headshot);
      if (c.isPlayer) this.hitMarker = 0.13;
      if (result.killed) this.audio.kill();
    }

    const ammo = c.currentAmmo;
    if (ammo && ammo.mag === 0 && ammo.reserve > 0 && c.currentWeaponId !== 'knife') {
      c.startReload();
      if (c.isPlayer) this.audio.reload('start');
    } else if (ammo && ammo.mag === 0 && ammo.reserve === 0) {
      c.equipBest();
    }
  }

  private performShot(c: Combatant): ShotResult {
    const def = c.currentWeaponDef;
    const origin = c.eyePosition;
    const maxRange = c.currentWeaponId === 'knife' ? 2.5 : 110;
    let direction = c.aimDirection;
    if (c.currentWeaponId !== 'knife') {
      const spread = c.isPlayer && this.scopeLevel > 0 && c.currentWeaponId === 'awp' ? c.spread * 0.16 : c.spread;
      direction = this.applySpread(direction, spread);
    }

    let best:
      | { target: Combatant; distance: number; part: string; center: THREE.Vector3; penetration: number }
      | undefined;

    for (const target of this.combatants) {
      if (target.team === c.team || !target.alive || target.id === c.id) continue;
      target.model.updateMatrixWorld(true);
      const spheres = target.model.getWorldHitSpheres();
      for (const sphere of spheres) {
        const hitDistance = segmentIntersectsSphere(origin, origin.clone().addScaledVector(direction, maxRange), sphere.center, sphere.radius);
        if (hitDistance === null) continue;
        if (best && hitDistance >= best.distance) continue;

        const hitPoint = origin.clone().addScaledVector(direction, hitDistance);
        let penetration = 1;
        let blocked = false;
        for (const collider of this.map.colliders) {
          if (!segmentIntersectsBox(origin, hitPoint, collider.min, collider.max)) continue;
          if (!collider.penetrable) {
            blocked = true;
            break;
          }
          penetration *= collider.penetration;
        }
        if (blocked) continue;
        best = { target, distance: hitDistance, part: sphere.part, center: sphere.center, penetration };
      }
    }

    if (!best) {
      let wallDistance = Number.POSITIVE_INFINITY;
      for (const collider of this.map.colliders) {
        const hit = rayIntersectsBox(origin, direction, collider.min, collider.max);
        if (hit && hit.distance < wallDistance) wallDistance = hit.distance;
      }
      return { target: null, part: 'none', damage: 0, headshot: false, killed: false, wallHit: wallDistance < maxRange };
    }

    const rawDamage = def.damage * best.penetration;
    const { damage, dead } = best.target.hurt(rawDamage, best.part);
    if (dead) {
      if (best.target.hasBomb) this.dropBomb(best.target);
      if (best.target.isPlayer) this.deathSwitchAt = this.elapsed + 1.4;
      this.addKillfeed(`${c.team === 'CT' ? 'CT' : 'T'} ${c.id.slice(0, 2).toUpperCase()} 击杀 ${best.target.team === 'CT' ? 'CT' : 'T'} ${best.target.id.slice(0, 2).toUpperCase()}${best.part === 'head' ? ' · 爆头' : ''}`, c.team);
    }
    return {
      target: best.target,
      part: best.part,
      damage,
      headshot: best.part === 'head',
      killed: dead,
      wallHit: false,
    };
  }

  private applySpread(direction: THREE.Vector3, spread: number): THREE.Vector3 {
    if (spread <= 0) return direction.normalize();
    const dir = direction.normalize();
    const up = Math.abs(dir.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const right = dir.clone().cross(up).normalize();
    const realUp = right.clone().cross(dir).normalize();
    const x = this.gaussianRandom() * spread;
    const y = this.gaussianRandom() * spread;
    return dir.addScaledVector(right, x).addScaledVector(realUp, y).normalize();
  }

  private gaussianRandom(): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  private dropBomb(c: Combatant) {
    if (!c.hasBomb) return;
    c.hasBomb = false;
    this.bombCarrierId = null;
    this.bomb.drop(c.x, c.z);
    this.addKillfeed('C4 已掉落', 'T');
  }

  private pickupBomb(c: Combatant) {
    if (c.team !== 'T' || !c.alive || this.bomb.state !== 'dropped') return;
    this.bombCarrierId = c.id;
    c.hasBomb = true;
    this.bomb.hide();
    this.bombPos = null;
    this.addKillfeed(`${c.id.slice(0, 2).toUpperCase()} 拾取 C4`, 'T');
  }

  private plantBomb(c: Combatant) {
    if (!c.hasBomb || !c.alive || c.team !== 'T' || this.bomb.state === 'planted') return;
    const site = this.bombTargetSite;
    if (!this.isInSite(c, site)) return;
    c.hasBomb = false;
    c.planting = false;
    c.interactionProgress = 0;
    this.bombCarrierId = null;
    this.bomb.plant(c.x, c.z, site);
    this.bombPlanted = true;
    this.bombPos = [c.x, c.z];
    this.bombTimer = this.bomb.timer;
    this.audio.plant(false);
    this.addKillfeed(`T 已在 ${site}点 安放 C4`, 'T');
    this.message = `C4 已安放于 ${site}点`;
    this.emitHud(true);
  }

  private defuseBomb(c: Combatant) {
    if (this.bomb.state !== 'planted') return;
    c.defusing = false;
    c.interactionProgress = 0;
    this.bomb.defuse();
    this.bombPlanted = false;
    this.bombPos = null;
    this.audio.plant(true);
    this.addKillfeed('CT 成功拆除 C4', 'CT');
    this.message = 'C4 已拆除';
    this.endRound('CT', 'CT 成功拆除 C4');
  }

  private explodeBomb() {
    if (this.bomb.state !== 'planted') return;
    this.bomb.state = 'exploded';
    this.bomb.group.visible = false;
    this.audio.explode();
    for (const c of this.combatants) {
      if (c.alive && distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) < 22) {
        c.hurt(999, 'chest');
        if (c.hasBomb) c.hasBomb = false;
      }
    }
    this.addKillfeed('C4 爆炸', 'T');
    this.endRound('T', 'C4 爆炸，T 获胜');
  }

  private checkRoundEnd() {
    if (this.roundWinner || this.phase !== 'playing') return;
    const ctAlive = this.combatants.filter((c) => c.team === 'CT' && c.alive).length;
    const tAlive = this.combatants.filter((c) => c.team === 'T' && c.alive).length;
    if (ctAlive === 0) {
      this.endRound('T', 'CT 全灭，T 获胜');
    } else if (tAlive === 0 && !this.bombPlanted) {
      this.endRound('CT', 'T 全灭，CT 获胜');
    } else if (this.roundTime <= 0 && !this.bombPlanted) {
      this.endRound('CT', '时间耗尽，CT 获胜');
    }
  }

  private endRound(winner: Team, message: string) {
    if (this.roundWinner) return;
    this.roundWinner = winner;
    this.phase = 'roundEnd';
    if (winner === 'CT') this.scoreCT += 1;
    else this.scoreT += 1;
    this.message = message;
    this.roundEndAt = this.elapsed + 4.2;
    this.fireHeld = false;
    this.semiTriggerPulled = false;
    this.keys.clear();
    if (document.pointerLockElement) document.exitPointerLock();
    for (const c of this.combatants) {
      c.planting = false;
      c.defusing = false;
      c.interactionProgress = 0;
    }
    this.addKillfeed(message, winner);
    this.emitHud(true);
  }

  private switchControlToAliveTeammate() {
    const old = this.controlled;
    const candidates = this.combatants.filter((c) => c.team === old.team && c.alive && c.id !== old.id);
    if (candidates.length === 0) return;
    const next = candidates[0];
    old.isPlayer = false;
    next.isPlayer = true;
    this.controlledId = next.id;
    this.mouseYaw = next.yaw;
    this.mousePitch = 0;
    this.viewModel.setWeapon(next.currentWeaponId);
    this.scopeLevel = 0;
    this.message = `已接管 ${next.id.slice(0, 2).toUpperCase()}`;
    this.deathSwitchAt = 0;
    this.emitHud(true);
  }

  private addKillfeed(text: string, team: Team | 'system') {
    this.killfeedId += 1;
    this.killfeed.push({ id: this.killfeedId, text, team, time: this.elapsed });
    if (this.killfeed.length > 6) this.killfeed.shift();
    this.emitHud(true);
  }

  private buildHud(): HudState {
    const c = this.controlled;
    const ammo = c.currentAmmo;
    const weapon = c.currentWeaponDef;
    const moving = this.getControlledMovementInput().lengthSq() > 0.01;
    const crosshairSpread = clamp(
      weapon.spreadBase + (moving ? weapon.spreadMove : 0) + c.spread * 1.4,
      0.001,
      0.12,
    );
    const site = c.team === 'T' ? this.bombTargetSite : null;
    const canPlant = Boolean(
      c.team === 'T' && c.hasBomb && site && this.isInSite(c, site),
    );
    const canDefuse = Boolean(
      c.team === 'CT' && this.bomb.state === 'planted' && distance2d(c.x, c.z, this.bomb.position.x, this.bomb.position.z) < 1.35,
    );
    const required = c.planting ? 3.2 : c.defusing ? 5 : 1;
    const bombProgress = c.planting || c.defusing ? clamp(c.interactionProgress / required, 0, 1) : 0;
    const minimap: MinimapEntity[] = this.combatants
      .filter((entity) => entity.alive || entity.id === c.id)
      .map((entity) => ({
        id: entity.id,
        team: entity.team,
        x: entity.x,
        z: entity.z,
        visible: entity.team === c.team || entity.visibleToPlayer || entity.id === c.id,
        hasBomb: entity.hasBomb,
      }));
    if (this.bomb.state === 'dropped' || this.bomb.state === 'planted') {
      minimap.push({
        id: 'c4',
        team: 'c4',
        x: this.bomb.position.x,
        z: this.bomb.position.z,
        visible: true,
      });
    }

    let health = c.hp;
    if (!c.alive) health = 0;

    return {
      ready: true,
      locked: this.locked,
      started: this.started,
      phase: this.phase,
      roundNumber: this.roundNumber,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      playerTeam: c.team,
      playerId: c.id,
      health,
      armor: c.armor,
      weaponId: c.currentWeaponId,
      weaponName: weapon.name,
      slot: c.currentSlot,
      mag: ammo?.mag ?? 0,
      reserve: ammo?.reserve ?? 0,
      reloading: c.reloading,
      fireCooldown: c.fireCooldown,
      crosshairSpread,
      scopeLevel: c.currentWeaponId === 'awp' ? this.scopeLevel : 0,
      bombPlanted: this.bombPlanted,
      bombProgress,
      bombCarrier: this.bombCarrierId,
      roundTime: Math.ceil(this.roundTime),
      message: !c.alive && this.phase === 'playing' ? `你已阵亡 · 空格切换到存活队友` : this.message,
      canPlant,
      canDefuse,
      buyMenu: this.buyMenu,
      roundWinner: this.roundWinner,
      killfeed: [...this.killfeed],
      minimap,
      bombPos: this.bombPos,
    };
  }

  private emitHud(force = false) {
    if (!this.hudCallback) return;
    if (!force && this.elapsed - this.lastHudTime < 0.04) return;
    this.hudCallback(this.buildHud());
  }
}

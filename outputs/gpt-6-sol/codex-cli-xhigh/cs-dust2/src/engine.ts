import * as THREE from 'three';
import { createGun, createHuman, animateHuman } from './actors';
import { GameAudio } from './audio';
import { A_SITE, B_SITE, CT_SPAWNS, DustMap, siteAt, regionAt, T_SPAWNS } from './map';
import type { Actor, BombState, FeedItem, HitZone, Phase, Slot, Snapshot, Team, Vec2, WeaponId } from './types';
import { WEAPONS } from './weapons';

const EYE = 1.63;
const roundTime = 130;
const tempVec = new THREE.Vector3();
const ZONES: Array<{ zone: HitZone; min: [number, number, number]; max: [number, number, number] }> = [
  { zone: 'head', min: [-.24, 1.50, -.24], max: [.24, 1.99, .24] },
  { zone: 'chest', min: [-.32, 1.08, -.26], max: [.32, 1.52, .22] },
  { zone: 'stomach', min: [-.28, .75, -.23], max: [.28, 1.08, .22] },
  { zone: 'arm', min: [-.56, .89, -.51], max: [-.29, 1.48, .17] },
  { zone: 'arm', min: [.29, .89, -.51], max: [.56, 1.48, .17] },
  { zone: 'leg', min: [-.29, .08, -.25], max: [-.045, .76, .2] },
  { zone: 'leg', min: [.045, .08, -.25], max: [.29, .76, .2] },
];

function rayAabb(origin: THREE.Vector3, dir: THREE.Vector3, min: [number, number, number], max: [number, number, number]): number {
  let tMin = 0, tMax = Infinity;
  for (let axis = 0; axis < 3; axis++) {
    const o = origin.getComponent(axis), d = dir.getComponent(axis);
    if (Math.abs(d) < 1e-8) { if (o < min[axis] || o > max[axis]) return Infinity; continue; }
    let a = (min[axis] - o) / d, b = (max[axis] - o) / d;
    if (a > b) [a, b] = [b, a];
    tMin = Math.max(tMin, a); tMax = Math.min(tMax, b);
    if (tMin > tMax) return Infinity;
  }
  return tMin;
}
const flatDistance = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.z - b.z);
const angleTo = (a: Vec2, b: Vec2) => Math.atan2(-(b.x - a.x), -(b.z - a.z));
const angleDelta = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
const random = (min: number, max: number) => min + Math.random() * (max - min);

export class GameEngine {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(75, 1, .05, 180);
  readonly renderer: THREE.WebGLRenderer;
  readonly map = new DustMap();
  readonly audio = new GameAudio();
  private container: HTMLElement;
  private onSnapshot: (s: Snapshot) => void;
  private frame = 0;
  private lastFrame = 0;
  private hudTimer = 0;
  private time = 0;
  private phase: Phase = 'menu';
  private mode: 'pistol' | 'full' = 'pistol';
  private playerTeam: Team = 'T';
  private round = 1;
  private scoreT = 0;
  private scoreCT = 0;
  private actors: Actor[] = [];
  private controlledId = 0;
  private originalId = 0;
  private spectateId: number | null = null;
  private bomb: BombState = { mode: 'none', pos: { x: 0, z: 0 }, carrierId: null, site: null, timer: 40, mesh: null, beepTimer: 0 };
  private feed: Array<FeedItem & { life: number }> = [];
  private feedId = 0;
  private message = '';
  private endTimer = 0;
  private keys = new Set<string>();
  private mouseDown = false;
  private scoped = false;
  private buyOpen = false;
  private pointerLocked = false;
  private viewGun: THREE.Group | null = null;
  private viewGunId: WeaponId | null = null;
  private viewBob = 0;
  private stepPhase = 0;
  private effects: Array<{ object: THREE.Object3D; life: number }> = [];
  private resizeObserver: ResizeObserver;
  private previousViewId = -1;

  constructor(container: HTMLElement, onSnapshot: (s: Snapshot) => void) {
    this.container = container; this.onSnapshot = onSnapshot;
    this.scene.background = new THREE.Color(0xb9d1d2);
    this.scene.fog = new THREE.Fog(0xb9d1d2, 75, 160);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.62;
    container.appendChild(this.renderer.domElement);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);
    this.scene.add(this.map.group);
    this.scene.add(new THREE.HemisphereLight(0xe5eff3, 0x9b7851, 2.2));
    const sun = new THREE.DirectionalLight(0xffe5ae, 3.2);
    sun.position.set(-32, 62, -25); this.scene.add(sun);
    this.camera.position.set(-39, EYE, 31); this.camera.rotation.y = 2.6;
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('pointerlockchange', this.onLockChange);
    this.renderer.domElement.addEventListener('contextmenu', this.onContextMenu);
    this.renderer.domElement.addEventListener('click', this.onCanvasClick);
    this.resize(); this.publish();
    if (import.meta.env.DEV) (window as Window & { __dustDebug?: GameEngine }).__dustDebug = this;
    this.frame = requestAnimationFrame(this.loop);
  }

  private resize = () => {
    const w = this.container.clientWidth || window.innerWidth, h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h);
  };
  private onContextMenu = (e: MouseEvent) => e.preventDefault();
  private onCanvasClick = () => { if (this.phase !== 'menu' && !this.pointerLocked && !this.buyOpen) this.lockPointer(); };
  private onLockChange = () => { this.pointerLocked = document.pointerLockElement === this.renderer.domElement; this.mouseDown = false; this.publish(); };
  private onBlur = () => { this.keys.clear(); this.mouseDown = false; };
  private onKeyDown = (e: KeyboardEvent) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    this.keys.add(e.code);
    if (this.phase === 'menu') return;
    const actor = this.actors[this.controlledId];
    if (e.repeat && ['KeyR', 'Digit1', 'Digit2', 'Digit3', 'KeyB', 'KeyF', 'Space'].includes(e.code)) return;
    if (e.code === 'KeyB' && this.mode === 'full' && actor?.alive) {
      this.buyOpen = !this.buyOpen;
      if (this.buyOpen) document.exitPointerLock?.(); else this.lockPointer();
      window.dispatchEvent(new CustomEvent('dust-buy', { detail: this.buyOpen }));
    }
    if (e.code === 'KeyR' && actor?.alive) this.reload(actor);
    if (e.code === 'Digit1') this.switchWeapon(actor, 'primary');
    if (e.code === 'Digit2') this.switchWeapon(actor, 'secondary');
    if (e.code === 'Digit3') this.switchWeapon(actor, 'melee');
    if (e.code === 'Space' && actor && !actor.alive) this.cycleSpectator();
    if (e.code === 'KeyF' && actor && !actor.alive) this.takeOver();
    this.publish();
  };
  private onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.code); };
  private onMouseMove = (e: MouseEvent) => {
    if (!this.pointerLocked || this.phase !== 'live') return;
    const actor = this.actors[this.controlledId]; if (!actor?.alive) return;
    const sensitivity = this.scoped ? .0009 : .0022;
    actor.yaw -= e.movementX * sensitivity;
    actor.pitch = THREE.MathUtils.clamp(actor.pitch - e.movementY * sensitivity, -1.48, 1.48);
  };
  private onMouseDown = (e: MouseEvent) => {
    if (this.phase !== 'live' || this.buyOpen || !this.pointerLocked) return;
    const actor = this.actors[this.controlledId]; if (!actor?.alive) return;
    if (e.button === 0) { this.mouseDown = true; this.fire(actor); }
    if (e.button === 2 && actor.weapons[actor.equipped] === 'awp') {
      this.scoped = !this.scoped; this.audio.scope(); this.publish();
    }
  };
  private onMouseUp = (e: MouseEvent) => { if (e.button === 0) this.mouseDown = false; };

  private lockPointer() { this.audio.resume(); void this.renderer.domElement.requestPointerLock?.(); }
  start(mode: 'pistol' | 'full', team: Team) {
    this.mode = mode; this.playerTeam = team; this.round = 1; this.scoreT = this.scoreCT = 0;
    this.startRound(); this.lockPointer();
  }
  private startRound() {
    for (const actor of this.actors) this.scene.remove(actor.mesh);
    this.actors = [];
    if (this.bomb.mesh) this.scene.remove(this.bomb.mesh);
    this.feed = []; this.phase = 'live'; this.time = roundTime; this.message = '';
    this.endTimer = 0; this.scoped = false; this.buyOpen = false;
    this.keys.clear(); this.mouseDown = false;
    const namesT = ['RAZE', 'RAVEN', 'SPECTRE', 'VIPER', 'DUST'], namesCT = ['WARDEN', 'ECHO', 'GHOST', 'FROST', 'NOVA'];
    this.originalId = this.playerTeam === 'T' ? 0 : 5;
    this.controlledId = this.originalId; this.spectateId = null;
    for (let id = 0; id < 10; id++) {
      const team: Team = id < 5 ? 'T' : 'CT';
      const index = id % 5, spawn = (team === 'T' ? T_SPAWNS : CT_SPAWNS)[index];
      const { mesh, gunMesh } = createHuman(team, id);
      mesh.position.set(spawn.x, 0, spawn.z); this.scene.add(mesh);
      const primary: WeaponId = team === 'T' ? (index === 2 ? 'awp' : 'ak') : (index === 2 ? 'awp' : 'm4');
      const secondary: WeaponId = team === 'T' ? 'glock' : 'usp';
      const weapons: Actor['weapons'] = { secondary, melee: 'knife' };
      if (this.mode === 'full') weapons.primary = primary;
      const ammo: Actor['ammo'] = {}, reserve: Actor['reserve'] = {};
      for (const w of Object.values(weapons)) if (w) { ammo[w] = WEAPONS[w].magazine; reserve[w] = WEAPONS[w].reserve; }
      const actor: Actor = {
        id, name: id === this.originalId ? 'YOU' : (team === 'T' ? namesT : namesCT)[index], team,
        pos: new THREE.Vector3(spawn.x, 0, spawn.z), yaw: team === 'T' ? -Math.PI / 2 : Math.PI / 2,
        pitch: 0, hp: 100, armor: this.mode === 'pistol' ? 0 : 100,
        alive: true, velocityY: 0, grounded: true, weapons, equipped: this.mode === 'pistol' ? 'secondary' : 'primary',
        ammo, reserve, nextShot: roundTime, reloadEnd: 0, shotHeat: 0, recoilKick: 0, hasBomb: false,
        kills: 0, deaths: 0, mesh, gunMesh, botMode: 'patrol', goal: { x: spawn.x, z: spawn.z },
        path: [], pathIndex: 0, pathTimer: 0, targetId: null, lastSeen: 0,
        strafeSign: Math.random() < .5 ? -1 : 1, strafeTimer: 0, actionProgress: 0,
        footstepTimer: 0, spawn,
      };
      this.actors.push(actor);
      this.updateActorGun(actor);
    }
    const carrier = this.actors[this.playerTeam === 'T' ? 0 : 1];
    carrier.hasBomb = true;
    this.bomb = { mode: 'carried', pos: { x: carrier.pos.x, z: carrier.pos.z }, carrierId: carrier.id,
      site: null, timer: 40, mesh: this.createBombMesh(), beepTimer: 0 };
    this.scene.add(this.bomb.mesh!); this.bomb.mesh!.visible = false;
    this.previousViewId = -1; this.updateViewGun(); this.publish();
  }

  private createBombMesh() {
    const group = new THREE.Group();
    const black = new THREE.MeshStandardMaterial({ color: 0x272f2e, metalness: .3 });
    const screen = new THREE.MeshBasicMaterial({ color: 0x77e54a });
    const wire = new THREE.MeshStandardMaterial({ color: 0xc65635 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(.65, .22, .4), black); body.position.y = .13; group.add(body);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(.27, .045, .2), screen); pad.position.set(-.11, .255, -.045); group.add(pad);
    for (let i = 0; i < 3; i++) {
      const cable = new THREE.Mesh(new THREE.TorusGeometry(.11, .018, 5, 12, Math.PI), wire);
      cable.position.set(.15 + i * .045, .24 + i * .02, .02); cable.rotation.x = Math.PI / 2; group.add(cable);
    }
    return group;
  }

  private updateActorGun(actor: Actor) {
    actor.mesh.remove(actor.gunMesh);
    const id = actor.weapons[actor.equipped] ?? 'knife';
    actor.gunMesh = createGun(id);
    actor.gunMesh.position.set(0, 1.11, -.49); actor.gunMesh.scale.setScalar(.64);
    actor.mesh.add(actor.gunMesh);
  }
  private updateViewGun() {
    const viewed = this.viewActor();
    if (!viewed) return;
    const id = viewed.weapons[viewed.equipped] ?? 'knife';
    if (this.viewGunId === id && this.previousViewId === viewed.id) return;
    if (this.viewGun) this.camera.remove(this.viewGun);
    this.viewGun = createGun(id, true);
    this.viewGun.position.set(.29, -.36, -.72);
    this.viewGun.scale.setScalar(.78);
    this.camera.add(this.viewGun);
    this.viewGunId = id; this.previousViewId = viewed.id;
  }
  private switchWeapon(actor: Actor | undefined, slot: Slot) {
    if (!actor?.alive || !actor.weapons[slot]) return;
    actor.equipped = slot; actor.reloadEnd = 0; this.scoped = false;
    this.updateActorGun(actor); this.updateViewGun(); this.publish();
  }
  buyWeapon(id: WeaponId) {
    const actor = this.actors[this.controlledId]; if (this.mode !== 'full' || !actor?.alive) return;
    const w = WEAPONS[id]; if (w.slot === 'melee') return;
    actor.weapons[w.slot] = id; actor.ammo[id] = w.magazine; actor.reserve[id] = w.reserve;
    actor.equipped = w.slot; actor.reloadEnd = 0; this.scoped = false;
    this.updateActorGun(actor); this.updateViewGun(); this.publish();
  }
  closeBuy() { this.buyOpen = false; window.dispatchEvent(new CustomEvent('dust-buy', { detail: false })); this.lockPointer(); }
  private reload(actor: Actor) {
    const id = actor.weapons[actor.equipped]; if (!id || id === 'knife') return;
    const w = WEAPONS[id];
    if (actor.reloadEnd > 0 || (actor.ammo[id] ?? 0) >= w.magazine || (actor.reserve[id] ?? 0) <= 0) return;
    actor.reloadEnd = this.time - w.reload;
    if (actor.id === this.controlledId) this.audio.reload();
  }

  private loop = (stamp: number) => {
    const dt = Math.min((stamp - (this.lastFrame || stamp)) / 1000, .18);
    this.lastFrame = stamp;
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.loop);
  };
  private update(dt: number) {
    if (this.phase === 'live') {
      this.time -= dt;
      for (const actor of this.actors) {
        if (!actor.alive) continue;
        actor.shotHeat = Math.max(0, actor.shotHeat - dt * 1.3);
        if (actor.reloadEnd > 0 && this.time <= actor.reloadEnd) {
          const id = actor.weapons[actor.equipped];
          if (id && id !== 'knife') {
            const needed = WEAPONS[id].magazine - (actor.ammo[id] ?? 0);
            const taken = Math.min(needed, actor.reserve[id] ?? 0);
            actor.ammo[id] = (actor.ammo[id] ?? 0) + taken;
            actor.reserve[id] = (actor.reserve[id] ?? 0) - taken;
          }
          actor.reloadEnd = 0;
        }
      }
      const controlled = this.actors[this.controlledId];
      if (controlled?.alive) {
        this.updatePlayer(controlled, dt);
        if (this.mouseDown && this.pointerLocked && !this.buyOpen && WEAPONS[controlled.weapons[controlled.equipped] ?? 'knife'].automatic) this.fire(controlled);
        this.updateAction(controlled, dt);
      }
      for (const actor of this.actors) if (actor.alive && actor.id !== this.controlledId) this.updateBot(actor, dt);
      this.updateBomb(dt);
      if (this.phase === 'live') {
        const t = this.actors.filter(a => a.team === 'T' && a.alive).length;
        const ct = this.actors.filter(a => a.team === 'CT' && a.alive).length;
        if (ct === 0) this.endRound('T', 'T 方全歼 CT');
        else if (t === 0 && this.bomb.mode !== 'planted') this.endRound('CT', 'CT 方全歼 T');
        else if (this.time <= 0 && this.bomb.mode !== 'planted') this.endRound('CT', '时间耗尽');
      }
    } else if (this.phase === 'ended') {
      this.endTimer -= dt;
      if (this.endTimer <= 0) { this.round++; this.startRound(); }
    }
    for (const f of this.feed) f.life -= dt;
    this.feed = this.feed.filter(f => f.life > 0);
    for (const effect of this.effects) { effect.life -= dt; if (effect.life <= 0) this.scene.remove(effect.object); }
    this.effects = this.effects.filter(e => e.life > 0);
    this.updateCamera(dt);
    this.hudTimer -= dt;
    if (this.hudTimer <= 0) { this.hudTimer = .09; this.publish(); }
  }

  private updatePlayer(actor: Actor, dt: number) {
    const forward = new THREE.Vector2(-Math.sin(actor.yaw), -Math.cos(actor.yaw));
    const right = new THREE.Vector2(Math.cos(actor.yaw), -Math.sin(actor.yaw));
    let dx = 0, dz = 0;
    if (this.keys.has('KeyW')) { dx += forward.x; dz += forward.y; }
    if (this.keys.has('KeyS')) { dx -= forward.x; dz -= forward.y; }
    if (this.keys.has('KeyD')) { dx += right.x; dz += right.y; }
    if (this.keys.has('KeyA')) { dx -= right.x; dz -= right.y; }
    const length = Math.hypot(dx, dz);
    let speed = this.keys.has('ShiftLeft') ? 3.2 : 5.35;
    if (this.scoped) speed *= .55;
    if (length) { dx = dx / length * speed * dt; dz = dz / length * speed * dt; this.map.move(actor.pos, dx, dz); }
    if (this.keys.has('Space') && actor.grounded) { actor.velocityY = 6.1; actor.grounded = false; }
    actor.velocityY -= 17 * dt; actor.pos.y += actor.velocityY * dt;
    if (actor.pos.y <= 0) { actor.pos.y = 0; actor.velocityY = 0; actor.grounded = true; }
    actor.mesh.position.copy(actor.pos); actor.mesh.rotation.y = actor.yaw;
    animateHuman(actor, 130 - this.time, length ? speed : 0);
    this.viewBob += length ? dt * speed * 1.7 : dt * 2;
    if (length && actor.grounded) {
      this.stepPhase += speed * dt;
      if (this.stepPhase > 2.35) { this.stepPhase = 0; this.audio.footstep(); }
    }
  }

  private viewActor(): Actor | null {
    const controlled = this.actors[this.controlledId];
    if (controlled?.alive) return controlled;
    if (this.spectateId !== null) return this.actors[this.spectateId] ?? null;
    return this.actors.find(a => a.team === this.playerTeam && a.alive) ?? controlled ?? null;
  }
  private updateCamera(dt: number) {
    const actor = this.viewActor(); if (!actor) return;
    this.updateViewGun();
    const bob = actor.id === this.controlledId && actor.grounded && this.phase === 'live' ? Math.sin(this.viewBob * 1.8) * .018 : 0;
    this.camera.position.set(actor.pos.x, actor.pos.y + EYE + bob, actor.pos.z);
    this.camera.rotation.y = actor.yaw; this.camera.rotation.x = actor.pitch;
    const desiredFov = this.scoped && actor.id === this.controlledId ? 22 : 75;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, desiredFov, 15, dt);
    this.camera.updateProjectionMatrix();
    if (this.viewGun) {
      this.viewGun.visible = !this.scoped;
      const idle = Math.sin(this.viewBob) * .008;
      this.viewGun.position.set(.29, -.36 + idle, -.72 + Math.min(actor.shotHeat, .5) * .14);
      this.viewGun.rotation.x = -Math.min(actor.shotHeat, 1) * .13;
    }
    actor.mesh.visible = false;
    for (const other of this.actors) if (other.id !== actor.id && other.alive) other.mesh.visible = true;
  }

  private nearestWall(origin: THREE.Vector3, dir: THREE.Vector3, max: number) {
    let nearest = max;
    for (const b of this.map.colliders) {
      const t = rayAabb(origin, dir, [b.x - b.w / 2, 0, b.z - b.d / 2], [b.x + b.w / 2, b.h, b.z + b.d / 2]);
      if (t < nearest) nearest = t;
    }
    return nearest;
  }
  private lineClear(from: THREE.Vector3, to: THREE.Vector3) {
    const d = to.clone().sub(from), range = d.length(); d.divideScalar(range);
    return this.nearestWall(from, d, range) >= range - .08;
  }
  private rayActor(origin: THREE.Vector3, dir: THREE.Vector3, actor: Actor): { t: number; zone: HitZone } | null {
    const c = Math.cos(actor.yaw), s = Math.sin(actor.yaw);
    const ox = origin.x - actor.pos.x, oz = origin.z - actor.pos.z;
    const localOrigin = new THREE.Vector3(c * ox - s * oz, origin.y - actor.pos.y, s * ox + c * oz);
    const localDir = new THREE.Vector3(c * dir.x - s * dir.z, dir.y, s * dir.x + c * dir.z);
    let best: { t: number; zone: HitZone } | null = null;
    for (const hitbox of ZONES) {
      const t = rayAabb(localOrigin, localDir, hitbox.min, hitbox.max);
      if (t < (best?.t ?? Infinity)) best = { t, zone: hitbox.zone };
    }
    return best;
  }
  private fire(actor: Actor) {
    if (!actor.alive || this.phase !== 'live' || actor.reloadEnd > 0 || this.time > actor.nextShot) return;
    const id = actor.weapons[actor.equipped] ?? 'knife', w = WEAPONS[id];
    if (id !== 'knife' && (actor.ammo[id] ?? 0) <= 0) { this.reload(actor); return; }
    actor.nextShot = this.time - 60 / w.rpm;
    if (id !== 'knife') actor.ammo[id] = (actor.ammo[id] ?? 0) - 1;
    const player = actor.id === this.controlledId;
    actor.shotHeat = Math.min(1.8, actor.shotHeat + (id === 'ak' ? .24 : id === 'm4' ? .14 : .18));
    if (player) {
      actor.pitch = THREE.MathUtils.clamp(actor.pitch + w.recoil * random(.84, 1.16), -1.48, 1.48);
      actor.yaw += random(-w.recoil * .45, w.recoil * .45);
    }
    this.audio.shot(id, player ? 1 : Math.max(.18, 1 - flatDistance(actor.pos, this.viewActor()?.pos ?? actor.pos) / 50) * .4);
    const origin = actor.pos.clone().add(new THREE.Vector3(0, player ? EYE : 1.55, 0));
    let dir: THREE.Vector3;
    if (player) {
      this.camera.rotation.set(actor.pitch, actor.yaw, 0, 'YXZ');
      dir = this.camera.getWorldDirection(new THREE.Vector3());
    } else {
      const target = this.actors[actor.targetId ?? -1];
      if (target?.alive) dir = target.pos.clone().add(new THREE.Vector3(0, random(1.1, 1.67), 0)).sub(origin).normalize();
      else dir = new THREE.Vector3(-Math.sin(actor.yaw), 0, -Math.cos(actor.yaw));
    }
    const spread = (w.spread + actor.shotHeat * (player ? .017 : .008)) * (this.scoped && player && id === 'awp' ? .13 : 1) * (actor.grounded ? 1 : 2.7);
    if (id !== 'knife') { dir.x += random(-spread, spread); dir.y += random(-spread, spread); dir.z += random(-spread, spread); dir.normalize(); }
    const wall = this.nearestWall(origin, dir, w.range);
    let bestT = wall, victim: Actor | null = null, zone: HitZone = 'chest';
    for (const other of this.actors) {
      if (!other.alive || other.team === actor.team || other.id === actor.id) continue;
      const hit = this.rayActor(origin, dir, other);
      if (hit && hit.t < bestT) { bestT = hit.t; victim = other; zone = hit.zone; }
    }
    if (victim) this.damage(victim, actor, zone, w.damage, id);
    if (id !== 'knife') this.tracer(origin, dir, bestT, actor.team, player);
    if (player) this.publish();
  }
  private damage(victim: Actor, attacker: Actor, zone: HitZone, base: number, weapon: WeaponId) {
    const multiplier = zone === 'head' ? 2 : zone === 'chest' ? 1 : zone === 'stomach' ? .9 : zone === 'arm' ? .65 : .75;
    let amount = base * multiplier;
    if (victim.armor > 0 && ['head', 'chest', 'stomach'].includes(zone)) {
      const saved = amount * .36;
      amount -= saved; victim.armor = Math.max(0, victim.armor - Math.ceil(saved * .5));
    }
    victim.hp = Math.max(0, victim.hp - Math.round(amount));
    if (attacker.id === this.controlledId) this.audio.hit();
    if (victim.hp <= 0) {
      victim.alive = false; victim.deaths++; attacker.kills++;
      victim.mesh.visible = false;
      if (victim.hasBomb) this.dropBomb(victim);
      this.feed.unshift({ id: ++this.feedId, killer: attacker.name, victim: victim.name, weapon: WEAPONS[weapon].name,
        team: attacker.team, headshot: zone === 'head', life: 5 });
      this.feed = this.feed.slice(0, 5);
      if (attacker.id === this.controlledId) this.audio.kill();
      if (victim.id === this.controlledId) {
        this.mouseDown = false; this.scoped = false;
        this.spectateId = this.actors.find(a => a.team === this.playerTeam && a.alive)?.id ?? null;
      }
      this.publish();
    }
  }
  private tracer(origin: THREE.Vector3, dir: THREE.Vector3, distance: number, team: Team, player: boolean) {
    const start = origin.clone();
    if (player) start.add(new THREE.Vector3(.15, -.09, 0).applyQuaternion(this.camera.quaternion));
    const end = origin.clone().addScaledVector(dir, Math.min(distance, 80));
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: team === 'T' ? 0xffc279 : 0xb7e4ff, transparent: true, opacity: .7 }));
    this.scene.add(line); this.effects.push({ object: line, life: .07 });
  }

  private chooseGoal(actor: Actor): { goal: Vec2; mode: Actor['botMode'] } {
    const p = actor.pos;
    if (this.bomb.mode === 'dropped' && actor.team === 'T') return { goal: this.bomb.pos, mode: 'chase' };
    if (this.bomb.mode === 'planted') {
      if (actor.team === 'CT') return { goal: this.bomb.pos, mode: 'defuse' };
      const offsets: Vec2[] = [{ x: 5, z: 2 }, { x: -4, z: 3 }, { x: 3, z: -5 }, { x: -5, z: -4 }, { x: 0, z: 6 }];
      const o = offsets[actor.id % 5];
      return { goal: { x: this.bomb.pos.x + o.x, z: this.bomb.pos.z + o.z }, mode: 'defend' };
    }
    if (actor.team === 'T') {
      const target = this.round % 2 ? A_SITE : B_SITE;
      const offset: Vec2[] = [{ x: 0, z: 0 }, { x: 5, z: 2 }, { x: -4, z: -1 }, { x: 2, z: -5 }, { x: -5, z: 5 }];
      const o = offset[actor.id % 5];
      return { goal: { x: target.x + o.x, z: target.z + o.z }, mode: actor.hasBomb ? 'plant' : 'attack' };
    }
    const ctGoals: Vec2[][] = this.round % 2
      ? [[A_SITE, { x: 28, z: -19 }], [{ x: 28, z: -19 }, { x: 36, z: -27 }], [B_SITE, { x: -5, z: -28 }], [{ x: 18, z: 11 }, { x: 10, z: 11 }], [{ x: 5, z: -17 }, { x: 23, z: -18 }]]
      : [[B_SITE, { x: -5, z: -28 }], [{ x: -6, z: -29 }, { x: -12, z: -39 }], [A_SITE, { x: 29, z: -19 }], [{ x: 16, z: 11 }, { x: 5, z: 14 }], [{ x: 30, z: -16 }, { x: 34, z: -30 }]];
    const patrolStep = Math.floor((roundTime - this.time) / 10) % 2;
    const g = ctGoals[actor.id % 5][patrolStep];
    return { goal: g, mode: flatDistance(p, g) < 3 ? 'defend' : 'patrol' };
  }
  private visibleEnemy(actor: Actor) {
    let nearest: Actor | null = null, best = 49;
    const eye = actor.pos.clone().add(new THREE.Vector3(0, 1.55, 0));
    for (const other of this.actors) {
      if (!other.alive || other.team === actor.team) continue;
      const distance = flatDistance(actor.pos, other.pos);
      if (distance >= best) continue;
      const bearing = angleTo(actor.pos, other.pos);
      if (distance > 8 && Math.abs(angleDelta(actor.yaw, bearing)) > 1.65) continue;
      const target = other.pos.clone().add(new THREE.Vector3(0, 1.25, 0));
      if (this.lineClear(eye, target)) { nearest = other; best = distance; }
    }
    return nearest;
  }
  private updateBot(actor: Actor, dt: number) {
    const enemy = this.visibleEnemy(actor);
    if (enemy) { actor.targetId = enemy.id; actor.lastSeen = this.time; }
    else if (this.time < actor.lastSeen - 1.7) actor.targetId = null;
    let goal: Vec2, mode: Actor['botMode'];
    if (enemy) {
      goal = { x: enemy.pos.x, z: enemy.pos.z }; mode = 'attack';
      const aim = angleTo(actor.pos, enemy.pos);
      actor.yaw += angleDelta(actor.yaw, aim) * Math.min(1, dt * 5);
      actor.pitch = THREE.MathUtils.damp(actor.pitch, Math.atan2(enemy.pos.y + 1.3 - (actor.pos.y + 1.55), flatDistance(actor.pos, enemy.pos)), 6, dt);
      if (Math.abs(angleDelta(actor.yaw, aim)) < .19) this.fire(actor);
    } else {
      const plan = this.chooseGoal(actor); goal = plan.goal; mode = plan.mode;
    }
    actor.botMode = mode;
    const distance = flatDistance(actor.pos, goal);
    let moved = 0;
    if (enemy && distance < 19 && distance > 6) {
      actor.strafeTimer -= dt;
      if (actor.strafeTimer <= 0) { actor.strafeTimer = random(1.1, 2.8); actor.strafeSign *= -1; }
      const dir = angleTo(actor.pos, enemy.pos);
      const speed = 2.5 * dt;
      const beforeX = actor.pos.x, beforeZ = actor.pos.z;
      this.map.move(actor.pos, -Math.cos(dir) * actor.strafeSign * speed, Math.sin(dir) * actor.strafeSign * speed);
      moved = Math.hypot(actor.pos.x - beforeX, actor.pos.z - beforeZ);
    } else if (distance > (mode === 'defuse' || mode === 'plant' ? 1.45 : 1.8)) {
      actor.pathTimer -= dt;
      if (actor.pathTimer <= 0 || flatDistance(actor.goal, goal) > 3 || actor.pathIndex >= actor.path.length) {
        actor.path = this.map.path(actor.pos, goal); actor.pathIndex = 0;
        actor.pathTimer = enemy ? .55 : random(.9, 1.5); actor.goal = { ...goal };
      }
      let point = actor.path[actor.pathIndex];
      while (point && flatDistance(actor.pos, point) < .78) { actor.pathIndex++; point = actor.path[actor.pathIndex]; }
      if (point) {
        const dirX = point.x - actor.pos.x, dirZ = point.z - actor.pos.z;
        const d = Math.hypot(dirX, dirZ);
        const speed = (mode === 'defuse' ? 4.6 : 3.65) * dt;
        const bx = actor.pos.x, bz = actor.pos.z;
        this.map.move(actor.pos, dirX / d * speed, dirZ / d * speed);
        moved = Math.hypot(actor.pos.x - bx, actor.pos.z - bz);
        if (!enemy && moved > 0) actor.yaw += angleDelta(actor.yaw, Math.atan2(-dirX, -dirZ)) * Math.min(1, dt * 8);
        if (moved < speed * .15) actor.pathTimer = 0;
      }
    }
    actor.mesh.position.copy(actor.pos); actor.mesh.rotation.y = actor.yaw;
    animateHuman(actor, 130 - this.time, moved / Math.max(dt, .001));
    if (this.bomb.mode === 'dropped' && actor.team === 'T' && flatDistance(actor.pos, this.bomb.pos) < 1.5) this.pickBomb(actor);
    if (actor.hasBomb && siteAt(actor.pos) && !enemy) {
      actor.actionProgress += dt;
      if (actor.actionProgress >= 3) this.plantBomb(actor);
    } else if (this.bomb.mode === 'planted' && actor.team === 'CT' && flatDistance(actor.pos, this.bomb.pos) < 1.8 && !enemy) {
      actor.actionProgress += dt;
      if (actor.actionProgress >= 5) this.defuseBomb(actor);
    } else actor.actionProgress = 0;
  }

  private updateAction(actor: Actor, dt: number) {
    if (this.keys.has('KeyE')) {
      if (this.bomb.mode === 'dropped' && actor.team === 'T' && flatDistance(actor.pos, this.bomb.pos) < 2) {
        this.pickBomb(actor); return;
      }
      if (actor.hasBomb && siteAt(actor.pos)) {
        actor.actionProgress += dt; if (actor.actionProgress >= 3) this.plantBomb(actor);
      } else if (this.bomb.mode === 'planted' && actor.team === 'CT' && flatDistance(actor.pos, this.bomb.pos) < 2.2) {
        actor.actionProgress += dt; if (actor.actionProgress >= 5) this.defuseBomb(actor);
      } else actor.actionProgress = 0;
    } else actor.actionProgress = 0;
  }
  private dropBomb(actor: Actor) {
    actor.hasBomb = false;
    this.bomb.mode = 'dropped'; this.bomb.carrierId = null;
    this.bomb.pos = { x: actor.pos.x, z: actor.pos.z };
    this.bomb.mesh!.visible = true;
    this.bomb.mesh!.position.set(actor.pos.x, .04, actor.pos.z);
  }
  private pickBomb(actor: Actor) {
    actor.hasBomb = true; this.bomb.mode = 'carried'; this.bomb.carrierId = actor.id;
    this.bomb.mesh!.visible = false;
    this.audio.beep(); actor.actionProgress = 0; this.publish();
  }
  private plantBomb(actor: Actor) {
    const site = siteAt(actor.pos); if (!site || !actor.hasBomb) return;
    actor.hasBomb = false; actor.actionProgress = 0;
    this.bomb.mode = 'planted'; this.bomb.carrierId = null; this.bomb.site = site;
    this.bomb.pos = { x: actor.pos.x, z: actor.pos.z }; this.bomb.timer = 40; this.bomb.beepTimer = 0;
    this.bomb.mesh!.visible = true; this.bomb.mesh!.position.set(actor.pos.x, .04, actor.pos.z);
    this.audio.plant(); this.message = `C4 已安放 · ${site} 点`;
    this.publish();
  }
  private defuseBomb(actor: Actor) {
    if (this.bomb.mode !== 'planted') return;
    actor.actionProgress = 0; this.bomb.mode = 'none';
    this.bomb.mesh!.visible = false; this.audio.defuse();
    this.endRound('CT', `${actor.name} 拆除了 C4`);
  }
  private updateBomb(dt: number) {
    if (this.bomb.mode === 'carried' && this.bomb.carrierId !== null) {
      const carrier = this.actors[this.bomb.carrierId];
      this.bomb.pos = { x: carrier.pos.x, z: carrier.pos.z };
    }
    if (this.bomb.mode !== 'planted') return;
    this.bomb.timer -= dt; this.bomb.beepTimer -= dt;
    if (this.bomb.beepTimer <= 0) { this.bomb.beepTimer = Math.max(.18, this.bomb.timer / 35); this.audio.beep(); }
    if (this.bomb.timer <= 0) {
      const p = this.bomb.pos;
      const flash = new THREE.PointLight(0xffa74b, 20, 35); flash.position.set(p.x, 2, p.z);
      this.scene.add(flash); this.effects.push({ object: flash, life: .33 });
      this.audio.explosion(); this.bomb.mesh!.visible = false;
      this.endRound('T', `C4 在 ${this.bomb.site} 点爆炸`);
    }
  }
  private endRound(winner: Team, reason: string) {
    if (this.phase !== 'live') return;
    this.phase = 'ended'; this.endTimer = 4.5; this.message = `${winner === 'T' ? 'T 方' : 'CT 方'}获胜 · ${reason}`;
    if (winner === 'T') this.scoreT++; else this.scoreCT++;
    this.mouseDown = false; this.scoped = false; this.publish();
  }
  private cycleSpectator() {
    const mates = this.actors.filter(a => a.team === this.playerTeam && a.alive);
    if (!mates.length) return;
    const idx = mates.findIndex(a => a.id === this.spectateId);
    this.spectateId = mates[(idx + 1) % mates.length].id;
    this.previousViewId = -1; this.updateViewGun(); this.publish();
  }
  private takeOver() {
    const actor = this.actors[this.spectateId ?? -1]; if (!actor?.alive) return;
    this.controlledId = actor.id; this.spectateId = null; this.previousViewId = -1;
    this.updateViewGun(); this.publish();
  }

  private publish() {
    const viewed = this.viewActor(), controlled = this.actors[this.controlledId];
    const actor = viewed ?? controlled;
    const id = actor?.weapons[actor.equipped] ?? 'glock';
    const visibleEnemies = new Set<number>();
    const allies = this.actors.filter(a => a.team === this.playerTeam && a.alive);
    for (const enemy of this.actors) if (enemy.team !== this.playerTeam && enemy.alive) {
      if (allies.some(ally => flatDistance(ally.pos, enemy.pos) < 42 &&
        (flatDistance(ally.pos, enemy.pos) < 7 || Math.abs(angleDelta(ally.yaw, angleTo(ally.pos, enemy.pos))) < 1.65) && this.lineClear(
        tempVec.set(ally.pos.x, ally.pos.y + 1.55, ally.pos.z).clone(),
        new THREE.Vector3(enemy.pos.x, enemy.pos.y + 1.2, enemy.pos.z)))) visibleEnemies.add(enemy.id);
    }
    const action = actor?.alive && actor.id === this.controlledId
      ? actor.hasBomb && siteAt(actor.pos) ? '按住 E 安放 C4'
        : this.bomb.mode === 'planted' && actor.team === 'CT' && flatDistance(actor.pos, this.bomb.pos) < 2.2 ? '按住 E 拆除 C4'
          : this.bomb.mode === 'dropped' && actor.team === 'T' && flatDistance(actor.pos, this.bomb.pos) < 2 ? '按 E 拾取 C4' : ''
      : '';
    const snapshot: Snapshot = {
      phase: this.phase, team: this.playerTeam, mode: this.mode, round: this.round,
      time: Math.max(0, this.time), scoreT: this.scoreT, scoreCT: this.scoreCT,
      region: actor ? regionAt(actor.pos.x, actor.pos.z) : 'T 出生点',
      hp: actor?.hp ?? 0, armor: actor?.armor ?? 0, alive: controlled?.alive ?? false,
      spectating: !!controlled && !controlled.alive, name: actor?.name ?? 'YOU',
      weapon: id, weaponName: WEAPONS[id].name, ammo: actor?.ammo[id] ?? 0, reserve: actor?.reserve[id] ?? 0,
      reloading: (actor?.reloadEnd ?? 0) > 0, scoped: this.scoped && (controlled?.alive ?? false),
      spread: actor ? WEAPONS[id].spread + actor.shotHeat * .017 : 0,
      kills: actor?.kills ?? 0, deaths: actor?.deaths ?? 0,
      tAlive: this.actors.filter(a => a.team === 'T' && a.alive).length,
      ctAlive: this.actors.filter(a => a.team === 'CT' && a.alive).length,
      bomb: { mode: this.bomb.mode, x: this.bomb.pos.x, z: this.bomb.pos.z, timer: Math.max(0, this.bomb.timer), site: this.bomb.site, carrierId: this.bomb.carrierId },
      actors: this.actors.map(a => ({ id: a.id, x: a.pos.x, z: a.pos.z, team: a.team, alive: a.alive,
        visible: a.team === this.playerTeam || visibleEnemies.has(a.id), controlled: a.id === this.controlledId })),
      feed: this.feed.map(({ life: _life, ...rest }) => rest), message: this.message,
      action, actionProgress: actor?.actionProgress ?? 0, pointerLocked: this.pointerLocked,
    };
    this.onSnapshot(snapshot);
  }
  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.renderer.domElement.removeEventListener('contextmenu', this.onContextMenu);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    this.renderer.dispose(); this.renderer.domElement.remove();
  }
}

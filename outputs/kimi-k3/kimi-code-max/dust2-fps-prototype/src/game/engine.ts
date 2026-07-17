import * as THREE from 'three';
import type { AABB, Bomb, Entity, HitPart, RoundPhase, Slot, Team, WeaponId, WeaponState } from './types';
import {
  ARMOR_MULT,
  BODY_HEIGHT,
  BODY_RADIUS,
  BOMB_TIMER,
  BOT_NAMES_CT,
  BOT_NAMES_T,
  DEFUSE_TIME,
  EYE_HEIGHT,
  FREEZE_TIME,
  JUMP_VEL,
  PART_MULT,
  PLANT_TIME,
  ROUND_END_TIME,
  ROUND_TIME,
  WEAPONS,
} from './config';
import { buildMap, zoneAt, type MapData } from './map';
import { moveBody, rayAABB, raycastBoxes } from './physics';
import { createCharacter, createViewModel, poseRig, setGun } from './character';
import { botFrame, botThink, createBot, normAngle } from './ai';
import { audio } from './audio';
import { UIStore } from '../ui/store';

const DEG = Math.PI / 180;

interface Tracer {
  line: THREE.Line;
  mat: THREE.LineBasicMaterial;
  t: number;
}

interface Impact {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  t: number;
}

export class Engine {
  store: UIStore;
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  map: MapData;
  entities: Entity[] = [];
  bomb: Bomb;
  attackSite: 'A' | 'B' = 'A';

  private phase: RoundPhase = 'freeze';
  private phaseT = 0;
  private roundT = ROUND_TIME;
  private roundNum = 0;
  private scoreT = 0;
  private scoreCT = 0;
  private time = 0;
  private lastFrame = 0;
  private started = false;

  playerId = 0;
  private spectateId = -1;
  private deathCamAt = 0;
  myTeam: Team = 'T';

  private keys = new Set<string>();
  private firing = false;
  scoped = false;
  private pRecoil = 0;
  private pRecoilYaw = 0;
  private prefPrimary: 'rifle' | 'awp' = 'rifle';
  private prefSecondary: 'default' | 'deagle' = 'default';

  private solids: AABB[] = [];
  private viewmodel: { group: THREE.Group; muzzle: THREE.Object3D } | null = null;
  private vmWeapon: WeaponId | null = null;
  private vmKick = 0;
  private vmBob = 0;
  private flashT = 0;
  private flashMesh: THREE.Mesh;
  private shotLight: THREE.PointLight;
  private tracers: Tracer[] = [];
  private impacts: Impact[] = [];
  private tracerI = 0;
  private impactI = 0;
  private baseFov = 75;
  private uiAcc = 0;
  private lastKillfeedClear = 0;

  constructor(container: HTMLElement, store: UIStore) {
    this.container = container;
    this.store = store;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fbfdf);
    this.scene.fog = new THREE.Fog(0xd6c6a4, 55, 150);

    this.camera = new THREE.PerspectiveCamera(
      this.baseFov,
      container.clientWidth / container.clientHeight,
      0.05,
      300,
    );
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    const hemi = new THREE.HemisphereLight(0xcfe0f0, 0x8a7a5a, 0.95);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1d8, 1.7);
    sun.position.set(45, 70, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -85;
    sun.shadow.camera.right = 85;
    sun.shadow.camera.top = 85;
    sun.shadow.camera.bottom = -85;
    sun.shadow.camera.far = 220;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    this.map = buildMap();
    this.scene.add(this.map.group);

    // solids = static + door panel boxes (boxes are mutated in place)
    this.solids = [...this.map.solids];
    for (const d of this.map.doors) for (const p of d.panels) this.solids.push(p.box);

    // muzzle flash quad (view model)
    this.flashMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.14),
      new THREE.MeshBasicMaterial({
        color: 0xffd080,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.flashMesh.visible = false;

    this.shotLight = new THREE.PointLight(0xffc060, 0, 12);
    this.scene.add(this.shotLight);

    // tracer pool
    for (let i = 0; i < 24; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const mat = new THREE.LineBasicMaterial({
        color: 0xffd080,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      line.visible = false;
      this.scene.add(line);
      this.tracers.push({ line, mat, t: 0 });
    }

    // impact sprite pool
    const impactTex = makePuffTexture();
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.SpriteMaterial({
        map: impactTex,
        color: 0xffcc88,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.25, 0.25, 0.25);
      sprite.visible = false;
      this.scene.add(sprite);
      this.impacts.push({ sprite, mat, t: 0 });
    }

    this.bomb = this.freshBomb();

    this.bindInput();
    this.renderer.setAnimationLoop(this.loop);
  }

  // ---------------- lifecycle ----------------

  startMatch(side: Team): void {
    this.myTeam = side;
    // dispose previous entities if any
    for (const e of this.entities) this.scene.remove(e.rig.group);
    this.entities = [];

    const mk = (id: number, team: Team, name: string, isPlayer: boolean): Entity => {
      const rig = createCharacter(team);
      this.scene.add(rig.group);
      return {
        id,
        team,
        name,
        isPlayer,
        alive: true,
        hp: 100,
        armor: 0,
        helmet: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        yaw: 0,
        pitch: 0,
        onGround: true,
        weapons: { primary: null, secondary: null, melee: null },
        slot: 'secondary',
        switchUntil: 0,
        nextFireAt: 0,
        bloom: 0,
        recoil: 0,
        hasBomb: false,
        channel: null,
        kills: 0,
        deaths: 0,
        deathAt: 0,
        deathDir: 1,
        stepAcc: 0,
        lastSeenByT: -100,
        lastSeenByCT: -100,
        rig,
        bot: isPlayer ? null : createBot('A'),
      };
    };

    const namesT = [...BOT_NAMES_T];
    const namesCT = [...BOT_NAMES_CT];
    for (let i = 0; i < 5; i++) {
      const isPlayer = side === 'T' && i === 0;
      this.entities.push(mk(this.entities.length, 'T', isPlayer ? 'YOU' : namesT[i % namesT.length], isPlayer));
    }
    for (let i = 0; i < 5; i++) {
      const isPlayer = side === 'CT' && i === 0;
      this.entities.push(mk(this.entities.length, 'CT', isPlayer ? 'YOU' : namesCT[i % namesCT.length], isPlayer));
    }
    this.playerId = side === 'T' ? 0 : 5;

    // CT bot site assignments: 2A 2B 1mid (player excluded if CT)
    const ctAssign: ('A' | 'B' | 'mid')[] = ['A', 'B', 'A', 'B', 'mid'];
    let ai = 0;
    for (const e of this.entities) {
      if (e.team === 'CT' && e.bot) e.bot.assignment = ctAssign[ai++ % ctAssign.length];
    }

    // bomb mesh
    if (!this.bomb.mesh) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.14, 0.22),
        new THREE.MeshLambertMaterial({ color: 0x2c2c30 }),
      );
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.05),
        new THREE.MeshBasicMaterial({ color: 0xff3020 }),
      );
      led.position.set(0.1, 0.09, 0);
      led.name = 'led';
      g.add(body, led);
      this.bomb.mesh = g;
      this.scene.add(g);
    }

    this.roundNum = 0;
    this.scoreT = 0;
    this.scoreCT = 0;
    this.started = true;
    this.startRound();
  }

  private startRound(): void {
    this.roundNum++;
    this.phase = 'freeze';
    this.phaseT = FREEZE_TIME;
    this.roundT = ROUND_TIME;
    this.attackSite = Math.random() < 0.5 ? 'A' : 'B';
    this.scoped = false;
    this.firing = false;
    this.pRecoil = 0;
    this.pRecoilYaw = 0;
    this.bomb.state = 'idle';
    this.bomb.carrierId = -1;
    this.bomb.site = null;
    this.spectateId = -1;

    const pistolRound = this.roundNum === 1;
    let awpGivenT = false;
    let awpGivenCT = false;

    const spawnIdx: Record<Team, number> = { T: 0, CT: 0 };
    for (const e of this.entities) {
      const sp = this.map.spawns[e.team][spawnIdx[e.team]++ % 5];
      e.pos.set(sp.x, 0, sp.z);
      e.vel.set(0, 0, 0);
      e.yaw = sp.yaw;
      e.pitch = 0;
      e.alive = true;
      e.hp = 100;
      e.armor = pistolRound ? 0 : 100;
      e.helmet = !pistolRound;
      e.bloom = 0;
      e.channel = null;
      e.hasBomb = false;
      e.nextFireAt = 0;
      e.switchUntil = 0;
      e.stepAcc = 0;
      // weapons
      e.weapons.melee = this.mkWeapon('knife');
      if (pistolRound) {
        e.weapons.primary = null;
        e.weapons.secondary = this.mkWeapon(e.team === 'T' ? 'glock' : 'usp');
      } else {
        if (e.isPlayer) {
          e.weapons.primary = this.mkWeapon(
            this.prefPrimary === 'awp' ? 'awp' : e.team === 'T' ? 'ak47' : 'm4a4',
          );
          const sec = this.prefSecondary === 'deagle' ? 'deagle' : e.team === 'T' ? 'glock' : 'usp';
          e.weapons.secondary = this.mkWeapon(sec);
        } else {
          let primary: WeaponId = e.team === 'T' ? 'ak47' : 'm4a4';
          if (Math.random() < 0.18) {
            if (e.team === 'T' && !awpGivenT) {
              primary = 'awp';
              awpGivenT = true;
            } else if (e.team === 'CT' && !awpGivenCT) {
              primary = 'awp';
              awpGivenCT = true;
            }
          }
          e.weapons.primary = this.mkWeapon(primary);
          const secRoll = Math.random();
          const sec: WeaponId =
            secRoll < 0.2 ? 'deagle' : e.team === 'T' ? 'glock' : 'usp';
          e.weapons.secondary = this.mkWeapon(sec);
        }
      }
      e.slot = e.weapons.primary ? 'primary' : 'secondary';
      setGun(e.rig, e.weapons[e.slot]!.def.id);
      if (e.bot) {
        const a = e.bot.assignment;
        e.bot = createBot(a);
        e.bot.thinkAt = this.time + Math.random() * 0.3;
        e.bot.lastPos.copy(e.pos);
      }
      e.rig.group.visible = true;
      e.rig.group.position.copy(e.pos);
      e.rig.group.rotation.set(0, e.yaw, 0);
      e.rig.body.rotation.set(0, 0, 0);
    }

    // hand the bomb to a random T
    const ts = this.entities.filter((e) => e.team === 'T');
    const carrier = ts[(Math.random() * ts.length) | 0];
    carrier.hasBomb = true;
    this.bomb.state = 'carried';
    this.bomb.carrierId = carrier.id;
    this.bomb.pos.copy(carrier.pos);

    this.store.set({
      banner: pistolRound ? '手枪局' : `第 ${this.roundNum} 回合`,
      subBanner: this.myTeam === 'T' ? '进攻方 — 安放 C4 或歼灭敌人' : '防守方 — 阻止安放或歼灭敌人',
      phase: 'freeze',
      killfeed: [],
      roundNum: this.roundNum,
      dead: false,
      canPossess: false,
      spectating: '',
    });
    audio.roundStart();
  }

  // ---------------- input ----------------

  private bindInput(): void {
    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', (ev) => {
      if (!this.started) return;
      if (document.pointerLockElement !== dom) {
        dom.requestPointerLock();
        return;
      }
      const p = this.player;
      if (ev.button === 0) {
        if (!p.alive) {
          this.cycleSpectate(1);
          return;
        }
        this.firing = true;
        const w = p.weapons[p.slot];
        if (w && !w.def.auto) this.fireWeapon(p);
      } else if (ev.button === 2) {
        const w = p.weapons[p.slot];
        if (p.alive && w && w.def.scope) this.toggleScope();
      }
    });
    window.addEventListener('mouseup', (ev) => {
      if (ev.button === 0) this.firing = false;
    });
    dom.addEventListener('contextmenu', (ev) => ev.preventDefault());
    window.addEventListener('mousemove', (ev) => {
      if (document.pointerLockElement !== dom) return;
      const p = this.player;
      if (!p || !p.alive) return;
      const sens = 0.0023 * (this.scoped ? 0.45 : 1);
      p.yaw = normAngle(p.yaw - ev.movementX * sens);
      p.pitch = Math.max(-1.55, Math.min(1.55, p.pitch - ev.movementY * sens));
    });
    document.addEventListener('pointerlockchange', () => {
      this.store.set({ locked: document.pointerLockElement === dom });
      if (document.pointerLockElement !== dom) this.firing = false;
    });
    window.addEventListener('keydown', (ev) => {
      if (ev.repeat) return;
      this.keys.add(ev.code);
      if (!this.started) return;
      const p = this.player;
      if (ev.code === 'Digit1') this.switchSlot(p, 'primary');
      if (ev.code === 'Digit2') this.switchSlot(p, 'secondary');
      if (ev.code === 'Digit3') this.switchSlot(p, 'melee');
      if (ev.code === 'KeyR' && p.alive) this.startReload(p);
      if (ev.code === 'KeyF' && !p.alive) this.possess();
      if (ev.code === 'KeyB' && this.phase === 'freeze' && p.alive && this.roundNum > 1) {
        this.prefPrimary = this.prefPrimary === 'rifle' ? 'awp' : 'rifle';
        p.weapons.primary = this.mkWeapon(
          this.prefPrimary === 'awp' ? 'awp' : p.team === 'T' ? 'ak47' : 'm4a4',
        );
        if (p.slot === 'primary') setGun(p.rig, p.weapons.primary.def.id);
        this.vmWeapon = null;
      }
      if (ev.code === 'KeyV' && this.phase === 'freeze' && p.alive && this.roundNum > 1) {
        this.prefSecondary = this.prefSecondary === 'default' ? 'deagle' : 'default';
        p.weapons.secondary = this.mkWeapon(
          this.prefSecondary === 'deagle' ? 'deagle' : p.team === 'T' ? 'glock' : 'usp',
        );
        if (p.slot === 'secondary') setGun(p.rig, p.weapons.secondary.def.id);
        this.vmWeapon = null;
      }
    });
    window.addEventListener('keyup', (ev) => this.keys.delete(ev.code));
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  private get player(): Entity {
    return this.entities[this.playerId];
  }

  // ---------------- helpers used by AI ----------------

  losClear(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax;
    const dy = by - ay;
    const dz = bz - az;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 0.001) return true;
    const hit = raycastBoxes(ax, ay, az, dx / dist, dy / dist, dz / dist, dist, this.solids);
    return hit === null;
  }

  moveEntity(e: Entity, dirX: number, dirZ: number, speed: number, dt: number): void {
    const accel = e.onGround ? 40 : 8;
    e.vel.x += (dirX * speed - e.vel.x) * Math.min(1, accel * dt);
    e.vel.z += (dirZ * speed - e.vel.z) * Math.min(1, accel * dt);
    e.onGround = moveBody(e.pos, e.vel, BODY_RADIUS, BODY_HEIGHT, dt, this.solids, this.map.floors);
    const hSpeed = Math.hypot(e.vel.x, e.vel.z);
    if (e.onGround && hSpeed > 1) {
      e.stepAcc += hSpeed * dt;
      if (e.stepAcc > 2.4) {
        e.stepAcc = 0;
        if (!e.isPlayer) {
          const r = this.rel(e.pos);
          if (r.dist < 22) audio.footstep(r.dist, r.pan);
        } else {
          audio.footstep(0, 0);
        }
      }
    }
  }

  fireWeapon(e: Entity): void {
    const w = e.weapons[e.slot];
    if (!w || !e.alive) return;
    const now = this.time;
    if (this.phase !== 'live') return;
    if (now < e.nextFireAt || now < e.switchUntil || w.reloadUntil > now) return;
    const def = w.def;

    if (def.melee) {
      e.nextFireAt = now + 60 / def.rpm;
      this.meleeAttack(e, w);
      return;
    }

    if (w.mag <= 0) {
      e.nextFireAt = now + 0.3;
      if (e.isPlayer) audio.dry();
      this.startReload(e);
      return;
    }

    e.nextFireAt = now + 60 / def.rpm;
    w.mag--;

    // spread in degrees
    let spread: number;
    if (def.scope) {
      spread = e.isPlayer ? (this.scoped ? 0.05 : def.spreadBase) : 0.1;
      if (e.isPlayer && this.scoped) {
        const hs = Math.hypot(e.vel.x, e.vel.z);
        spread += hs * 2.0;
      }
    } else {
      spread = def.spreadBase + e.bloom + Math.hypot(e.vel.x, e.vel.z) * 0.35;
      if (!e.onGround) spread += 2.5;
    }
    e.bloom = Math.min(def.spreadMax, e.bloom + def.bloomPerShot);

    // direction with recoil for the player
    const yaw = e.yaw + (e.isPlayer ? this.pRecoilYaw * DEG : 0);
    const pitch = e.pitch + (e.isPlayer ? this.pRecoil * DEG : 0);
    const cp = Math.cos(pitch);
    const fx = -Math.sin(yaw) * cp;
    const fy = Math.sin(pitch);
    const fz = -Math.cos(yaw) * cp;
    // apply spread
    const sRad = spread * DEG;
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    const a = (Math.random() + Math.random() - 1) * sRad;
    const b = (Math.random() + Math.random() - 1) * sRad;
    let dx = fx + rx * a;
    let dy = fy + b;
    let dz = fz + rz * a;
    const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
    dx /= dl;
    dy /= dl;
    dz /= dl;

    // recoil kick
    if (e.isPlayer) {
      this.pRecoil += def.recoilPitch * (0.8 + Math.random() * 0.4);
      this.pRecoilYaw += (Math.random() - 0.5) * def.recoilYaw;
      this.vmKick = 1;
    }

    const ox = e.pos.x;
    const oy = e.pos.y + EYE_HEIGHT;
    const oz = e.pos.z;

    const wallHit = raycastBoxes(ox, oy, oz, dx, dy, dz, 200, this.solids);
    const maxT = wallHit ? wallHit.t : 200;
    const entHit = this.rayEntities(e, ox, oy, oz, dx, dy, dz, maxT);

    let endX = ox + dx * maxT;
    let endY = oy + dy * maxT;
    let endZ = oz + dz * maxT;

    if (entHit) {
      endX = ox + dx * entHit.t;
      endY = oy + dy * entHit.t;
      endZ = oz + dz * entHit.t;
      this.applyDamage(entHit.e, e, def.damage, entHit.part, entHit.t, def.falloff, def.name);
      this.spawnImpact(endX, endY, endZ, 0xbb2222);
    } else if (wallHit) {
      this.spawnImpact(endX, endY, endZ, 0xffcc88);
    }

    // tracer from muzzle
    const from = this.muzzleWorld(e);
    this.spawnTracer(from.x, from.y, from.z, endX, endY, endZ, def.tracer);

    // sound + flash
    const r = this.rel(e.pos);
    audio.shot(def.id, e.isPlayer ? 0 : r.dist, e.isPlayer ? 0 : r.pan);
    if (e.isPlayer) {
      this.flashT = 0.05;
    }
    if (r.dist < 15) {
      this.shotLight.position.set(ox, oy, oz);
      this.shotLight.intensity = 2.5;
    }
  }

  startReload(e: Entity): void {
    const w = e.weapons[e.slot];
    if (!w || w.def.melee || w.reloadUntil > this.time) return;
    if (w.mag >= w.def.magSize || w.reserve <= 0) return;
    w.reloadUntil = this.time + w.def.reloadTime;
    if (e.isPlayer) {
      this.scoped = false;
      audio.reload(0, 0);
    } else {
      const r = this.rel(e.pos);
      if (r.dist < 18) audio.reload(r.dist, r.pan);
    }
  }

  startChannel(e: Entity, kind: 'plant' | 'defuse'): void {
    if (e.channel || !e.alive) return;
    e.channel = { kind, t: 0, need: kind === 'plant' ? PLANT_TIME : DEFUSE_TIME };
  }

  nearestFetcherId(): number {
    let best = -1;
    let bestD = Infinity;
    for (const e of this.entities) {
      if (e.team !== 'T' || !e.alive || e.hasBomb) continue;
      const d = e.pos.distanceToSquared(this.bomb.pos);
      if (d < bestD) {
        bestD = d;
        best = e.id;
      }
    }
    return best;
  }

  // ---------------- combat internals ----------------

  private mkWeapon(id: WeaponId): WeaponState {
    const def = WEAPONS[id];
    return { def, mag: def.magSize, reserve: def.reserve, reloadUntil: 0 };
  }

  private switchSlot(e: Entity, slot: Slot): void {
    if (!e.alive || e.slot === slot || !e.weapons[slot]) return;
    e.slot = slot;
    e.switchUntil = this.time + 0.5;
    const w = e.weapons[slot]!;
    w.reloadUntil = 0;
    setGun(e.rig, w.def.id);
    if (e.isPlayer) {
      this.scoped = false;
      this.vmWeapon = null;
    }
  }

  private toggleScope(): void {
    this.scoped = !this.scoped;
    if (this.scoped) audio.scopeIn();
    else audio.scopeOut();
  }

  private rayEntities(
    shooter: Entity,
    ox: number, oy: number, oz: number,
    dx: number, dy: number, dz: number,
    maxT: number,
  ): { e: Entity; part: HitPart; t: number } | null {
    let best: { e: Entity; part: HitPart; t: number } | null = null;
    let bestT = maxT;
    for (const en of this.entities) {
      if (en === shooter || !en.alive || en.team === shooter.team) continue;
      // broad phase: distance from ray to body center
      const cx = en.pos.x - ox;
      const cy = en.pos.y + 1.0 - oy;
      const cz = en.pos.z - oz;
      const proj = cx * dx + cy * dy + cz * dz;
      if (proj < -2 || proj > bestT + 2) continue;
      const px = cx - proj * dx;
      const py = cy - proj * dy;
      const pz = cz - proj * dz;
      if (px * px + py * py + pz * pz > 7) continue;

      const cos = Math.cos(en.yaw);
      const sin = Math.sin(en.yaw);
      for (const hb of en.rig.hitboxes) {
        const wx = en.pos.x + hb.cx * cos + hb.cz * sin;
        const wz = en.pos.z - hb.cx * sin + hb.cz * cos;
        const hx = Math.abs(cos) * hb.hx + Math.abs(sin) * hb.hz;
        const hz = Math.abs(sin) * hb.hx + Math.abs(cos) * hb.hz;
        const box: AABB = {
          minX: wx - hx,
          maxX: wx + hx,
          minY: en.pos.y + hb.cy - hb.hy,
          maxY: en.pos.y + hb.cy + hb.hy,
          minZ: wz - hz,
          maxZ: wz + hz,
        };
        const t = rayAABB(ox, oy, oz, dx, dy, dz, box, bestT);
        if (t >= 0 && t < bestT) {
          bestT = t;
          best = { e: en, part: hb.part, t };
        }
      }
    }
    return best;
  }

  private applyDamage(
    target: Entity,
    attacker: Entity,
    baseDmg: number,
    part: HitPart,
    dist: number,
    falloff: number,
    weaponName: string,
  ): void {
    let dmg = baseDmg * PART_MULT[part] * Math.max(0.55, 1 - dist * falloff);
    const armored =
      part === 'chest' || part === 'stomach' || part === 'arm' || (part === 'head' && target.helmet);
    if (armored && target.armor > 0) {
      dmg *= ARMOR_MULT;
      target.armor = Math.max(0, target.armor - dmg * 0.4);
    }
    dmg = Math.max(1, Math.round(dmg));
    target.hp -= dmg;

    if (attacker.isPlayer) {
      this.store.set({ hitTick: this.store.data.hitTick + 1, hitHead: part === 'head' });
      audio.hit(part === 'head');
    }
    if (target.isPlayer) audio.hurt();

    if (target.hp <= 0) {
      this.killEntity(target, attacker, weaponName, part === 'head');
    } else if (target.bot && target.bot.targetId < 0) {
      target.bot.targetId = attacker.id;
      target.bot.reactAt = this.time + 0.2 + Math.random() * 0.2;
      target.bot.lastSeenPos.copy(attacker.pos);
      target.bot.lastSeenAt = this.time;
      target.bot.state = 'engage';
    }
  }

  private killEntity(victim: Entity, attacker: Entity, weaponName: string, headshot: boolean): void {
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.deathAt = this.time;
    victim.deathDir = Math.random() < 0.5 ? -1 : 1;
    victim.channel = null;
    victim.vel.set(0, 0, 0);
    if (attacker.team !== victim.team) attacker.kills++;

    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.carrierId = -1;
      this.bomb.pos.copy(victim.pos);
    }

    this.store.pushKill({
      killer: attacker.name,
      killerTeam: attacker.team,
      victim: victim.name,
      victimTeam: victim.team,
      weapon: weaponName,
      headshot,
    });
    if (attacker.isPlayer) audio.kill();

    if (victim.isPlayer) {
      this.scoped = false;
      this.firing = false;
      this.deathCamAt = this.time + 1.2;
    }
    this.checkWin();
  }

  private meleeAttack(e: Entity, w: WeaponState): void {
    const yaw = e.yaw;
    const cp = Math.cos(e.pitch);
    const dx = -Math.sin(yaw) * cp;
    const dy = Math.sin(e.pitch);
    const dz = -Math.cos(yaw) * cp;
    const ox = e.pos.x;
    const oy = e.pos.y + EYE_HEIGHT;
    const oz = e.pos.z;
    const range = w.def.meleeRange ?? 1.9;
    const r = this.rel(e.pos);
    audio.knifeSwing();
    const entHit = this.rayEntities(e, ox, oy, oz, dx, dy, dz, range);
    if (entHit) {
      this.applyDamage(entHit.e, e, w.def.damage, 'chest', entHit.t, 0, w.def.name);
      audio.knifeHit();
      this.spawnImpact(ox + dx * entHit.t, oy + dy * entHit.t, oz + dz * entHit.t, 0xbb2222);
      return;
    }
    const wallHit = raycastBoxes(ox, oy, oz, dx, dy, dz, range, this.solids);
    if (wallHit) {
      audio.knifeHit();
      this.spawnImpact(ox + dx * wallHit.t, oy + dy * wallHit.t, oz + dz * wallHit.t, 0xaaaaaa);
    }
    void r;
  }

  // ---------------- round / bomb ----------------

  private checkWin(): void {
    if (this.phase !== 'live') return;
    const aliveT = this.entities.filter((e) => e.team === 'T' && e.alive).length;
    const aliveCT = this.entities.filter((e) => e.team === 'CT' && e.alive).length;
    if (aliveCT === 0) this.endRound('T', '敌方全员被歼灭');
    else if (aliveT === 0 && this.bomb.state !== 'planted') this.endRound('CT', '敌方全员被歼灭');
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === 'end') return;
    this.phase = 'end';
    this.phaseT = ROUND_END_TIME;
    if (winner === 'T') this.scoreT++;
    else this.scoreCT++;
    this.scoped = false;
    const label = winner === 'T' ? 'T 方获胜' : 'CT 方获胜';
    this.store.set({
      banner: label,
      subBanner: reason,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
    });
    audio.roundWin();
  }

  private completePlant(e: Entity): void {
    e.hasBomb = false;
    e.channel = null;
    this.bomb.state = 'planted';
    this.bomb.carrierId = -1;
    this.bomb.pos.copy(e.pos);
    this.bomb.site = zoneAt(this.map.zones, e.pos.x, e.pos.z) ?? this.attackSite;
    this.bomb.plantedAt = this.time;
    this.bomb.explodeAt = this.time + BOMB_TIMER;
    this.bomb.nextBeepAt = this.time;
    this.store.set({ banner: 'C4 已安放', subBanner: `${this.bomb.site} 点` });
    audio.plantDone();
  }

  private explodeBomb(): void {
    this.bomb.state = 'exploded';
    audio.explosion(this.rel(this.bomb.pos).dist);
    // area damage
    const planter = this.entities.find((e) => e.team === 'T');
    for (const en of this.entities) {
      if (!en.alive) continue;
      const d = en.pos.distanceTo(this.bomb.pos);
      if (d < 18) {
        const dmg = Math.round(240 * (1 - d / 18));
        en.hp -= dmg;
        if (en.hp <= 0 && planter) {
          this.killEntity(en, planter, 'C4', false);
        } else if (en.isPlayer) {
          audio.hurt();
        }
      }
    }
    this.store.set({ flash: this.store.data.flash + 1 });
    this.endRound('T', 'C4 引爆成功');
  }

  private updateBomb(dt: number): void {
    const b = this.bomb;
    if (b.state === 'planted') {
      if (this.time >= b.nextBeepAt) {
        const urgency = Math.min(1, Math.max(0, 1 - (b.explodeAt - this.time) / BOMB_TIMER));
        const r = this.rel(b.pos);
        audio.bombBeep(urgency, r.dist, r.pan);
        b.nextBeepAt = this.time + (1.0 - urgency * 0.85);
      }
      if (this.time >= b.explodeAt) this.explodeBomb();
    }
    // pickup by T
    if (b.state === 'dropped') {
      for (const e of this.entities) {
        if (e.team !== 'T' || !e.alive) continue;
        if (e.pos.distanceTo(b.pos) < 1.3) {
          e.hasBomb = true;
          b.state = 'carried';
          b.carrierId = e.id;
          if (e.isPlayer) audio.plantDone();
          break;
        }
      }
    }
    // mesh position
    if (b.mesh) {
      if (b.state === 'idle' || b.state === 'exploded' || b.state === 'defused') {
        b.mesh.visible = false;
      } else {
        b.mesh.visible = true;
        if (b.state === 'carried') {
          const c = this.entities[b.carrierId];
          if (c) b.mesh.position.set(c.pos.x, c.pos.y + 1.05, c.pos.z);
        } else {
          b.mesh.position.set(b.pos.x, b.pos.y + 0.1, b.pos.z);
        }
        const led = b.mesh.getObjectByName('led') as THREE.Mesh | null;
        if (led && b.state === 'planted') {
          (led.material as THREE.MeshBasicMaterial).color.setHex(
            Math.sin(this.time * 10) > 0 ? 0xff3020 : 0x551008,
          );
        }
      }
    }
    void dt;
  }

  private updateChannels(dt: number): void {
    for (const e of this.entities) {
      const ch = e.channel;
      if (!ch || !e.alive) {
        if (ch) e.channel = null;
        continue;
      }
      const moving = Math.hypot(e.vel.x, e.vel.z) > 0.6;
      if (ch.kind === 'plant') {
        const inZone = zoneAt(this.map.zones, e.pos.x, e.pos.z) !== null;
        if (!e.hasBomb || !inZone || moving) {
          e.channel = null;
          continue;
        }
      } else {
        const near =
          this.bomb.state === 'planted' &&
          Math.hypot(e.pos.x - this.bomb.pos.x, e.pos.z - this.bomb.pos.z) < 2.4;
        if (!near || moving) {
          e.channel = null;
          continue;
        }
      }
      ch.t += dt;
      if (e.isPlayer && Math.floor(ch.t * 4) !== Math.floor((ch.t - dt) * 4)) audio.plantBeep();
      if (ch.t >= ch.need) {
        if (ch.kind === 'plant') {
          this.completePlant(e);
        } else {
          e.channel = null;
          this.bomb.state = 'defused';
          audio.defuseDone();
          this.endRound('CT', 'C4 被成功拆除');
        }
      }
    }
  }

  // ---------------- player ----------------

  private updatePlayer(dt: number): void {
    const p = this.player;
    if (!p.alive) {
      // spectate handling
      if (this.spectateId < 0 && this.deathCamAt > 0 && this.time >= this.deathCamAt) {
        this.cycleSpectate(1);
      }
      return;
    }
    const w = p.weapons[p.slot];
    const speed = (w ? w.def.moveSpeed : 4.5) * (this.keys.has('ShiftLeft') ? 0.52 : 1) * (this.scoped ? 0.45 : 1);
    let ix = 0;
    let iz = 0;
    if (this.keys.has('KeyW')) iz -= 1;
    if (this.keys.has('KeyS')) iz += 1;
    if (this.keys.has('KeyA')) ix -= 1;
    if (this.keys.has('KeyD')) ix += 1;
    const l = Math.hypot(ix, iz);
    let dirX = 0;
    let dirZ = 0;
    if (l > 0) {
      ix /= l;
      iz /= l;
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      // camera-relative: forward = (-sin, -cos), right = (cos, -sin)
      dirX = ix * cos + iz * sin;
      dirZ = -ix * sin + iz * cos;
      // cancel plant/defuse channel when moving (handled in updateChannels via speed)
    }
    if (this.keys.has('Space') && p.onGround) {
      p.vel.y = JUMP_VEL;
      p.onGround = false;
    }
    this.moveEntity(p, dirX, dirZ, speed, dt);

    // auto fire
    if (this.firing && w && w.def.auto) this.fireWeapon(p);

    // E channel
    if (this.keys.has('KeyE')) {
      if (p.hasBomb && zoneAt(this.map.zones, p.pos.x, p.pos.z) !== null && !p.channel) {
        this.startChannel(p, 'plant');
      } else if (
        p.team === 'CT' &&
        this.bomb.state === 'planted' &&
        Math.hypot(p.pos.x - this.bomb.pos.x, p.pos.z - this.bomb.pos.z) < 2.4 &&
        !p.channel
      ) {
        this.startChannel(p, 'defuse');
      }
    } else if (p.channel) {
      p.channel = null;
    }

    // weapon reload completion
    for (const slot of ['primary', 'secondary', 'melee'] as Slot[]) {
      const ws = p.weapons[slot];
      if (ws && ws.reloadUntil > 0 && this.time >= ws.reloadUntil) {
        const need = ws.def.magSize - ws.mag;
        const take = Math.min(need, ws.reserve);
        ws.mag += take;
        ws.reserve -= take;
        ws.reloadUntil = 0;
      }
    }
  }

  private cycleSpectate(dir: number): void {
    const mates = this.entities.filter((e) => e.team === this.myTeam && e.alive && e.id !== this.playerId);
    if (mates.length === 0) {
      this.spectateId = -1;
      return;
    }
    const cur = mates.findIndex((e) => e.id === this.spectateId);
    const next = mates[(cur + dir + mates.length) % mates.length];
    this.spectateId = next.id;
  }

  private possess(): void {
    if (this.spectateId < 0) return;
    const target = this.entities[this.spectateId];
    if (!target || !target.alive) return;
    const old = this.player;
    old.isPlayer = false;
    target.isPlayer = true;
    target.bot = null;
    this.playerId = target.id;
    this.spectateId = -1;
    this.vmWeapon = null;
    this.pRecoil = 0;
    this.pRecoilYaw = 0;
  }

  // ---------------- fx ----------------

  private muzzleWorld(e: Entity): THREE.Vector3 {
    const v = new THREE.Vector3();
    if (e.isPlayer && this.viewmodel) {
      this.viewmodel.muzzle.getWorldPosition(v);
      return v;
    }
    e.rig.muzzle.getWorldPosition(v);
    return v;
  }

  private spawnTracer(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: number): void {
    const t = this.tracers[this.tracerI++ % this.tracers.length];
    const pos = t.line.geometry.getAttribute('position') as THREE.BufferAttribute;
    pos.setXYZ(0, x1, y1, z1);
    pos.setXYZ(1, x2, y2, z2);
    pos.needsUpdate = true;
    t.mat.color.setHex(color);
    t.mat.opacity = 0.85;
    t.line.visible = true;
    t.t = 0.1;
  }

  private spawnImpact(x: number, y: number, z: number, color: number): void {
    const im = this.impacts[this.impactI++ % this.impacts.length];
    im.sprite.position.set(x, y, z);
    im.mat.color.setHex(color);
    im.mat.opacity = 0.9;
    im.sprite.visible = true;
    im.t = 0.22;
  }

  rel(pos: THREE.Vector3): { dist: number; pan: number } {
    const cx = this.camera.position.x;
    const cy = this.camera.position.y;
    const cz = this.camera.position.z;
    const dx = pos.x - cx;
    const dy = pos.y + 1.2 - cy;
    const dz = pos.z - cz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const yaw = this.camera.rotation.y;
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    const pan = dist > 0.5 ? Math.max(-1, Math.min(1, (dx * rx + dz * rz) / dist)) : 0;
    return { dist, pan };
  }

  // ---------------- main loop ----------------

  private loop = (t: number): void => {
    const dt = Math.min(0.05, this.lastFrame ? (t - this.lastFrame) / 1000 : 0.016);
    this.lastFrame = t;
    this.time += dt;

    if (this.started) {
      this.update(dt);
    }
    this.renderer.render(this.scene, this.camera);
  };

  private update(dt: number): void {
    // doors
    for (const door of this.map.doors) {
      let want = 0;
      for (const e of this.entities) {
        if (!e.alive) continue;
        const d = Math.hypot(e.pos.x - door.x, e.pos.z - door.z);
        if (d < 3.6) {
          want = 1;
          break;
        }
      }
      door.open += Math.max(-dt * 3, Math.min(dt * 3, want - door.open));
      for (const p of door.panels) {
        p.mesh.position.lerpVectors(p.closedPos, p.openPos, door.open);
        p.box.minX = p.mesh.position.x - p.half.x;
        p.box.maxX = p.mesh.position.x + p.half.x;
        p.box.minZ = p.mesh.position.z - p.half.z;
        p.box.maxZ = p.mesh.position.z + p.half.z;
      }
    }

    // phases
    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      this.updatePlayer(dt);
      if (this.phaseT <= 0) {
        this.phase = 'live';
        this.store.set({ banner: '', subBanner: '', phase: 'live' });
      }
    } else if (this.phase === 'live') {
      this.roundT -= dt;
      this.updatePlayer(dt);
      // bots
      for (const e of this.entities) {
        if (!e.bot || !e.alive) continue;
        if (this.time >= e.bot.thinkAt) {
          e.bot.thinkAt = this.time + 0.12 + Math.random() * 0.05;
          botThink(this, e, this.time);
        }
        botFrame(this, e, dt, this.time);
      }
      this.updateBomb(dt);
      this.updateChannels(dt);
      if (this.roundT <= 0 && this.bomb.state !== 'planted') {
        this.endRound('CT', '时间耗尽');
      }
    } else {
      // end phase
      this.phaseT -= dt;
      this.updatePlayer(dt);
      if (this.phaseT <= 0) this.startRound();
    }

    // reload completion for bots
    for (const e of this.entities) {
      if (!e.bot) continue;
      for (const slot of ['primary', 'secondary', 'melee'] as Slot[]) {
        const ws = e.weapons[slot];
        if (ws && ws.reloadUntil > 0 && this.time >= ws.reloadUntil) {
          const need = ws.def.magSize - ws.mag;
          const take = Math.min(need, ws.reserve);
          ws.mag += take;
          ws.reserve -= take;
          ws.reloadUntil = 0;
        }
      }
      // bloom decay
      e.bloom = Math.max(0, e.bloom - dt * 3.5);
    }

    // player recoil recovery
    this.pRecoil *= Math.max(0, 1 - dt * 6);
    this.pRecoilYaw *= Math.max(0, 1 - dt * 6);

    // killfeed cleanup
    if (this.time - this.lastKillfeedClear > 5) {
      this.lastKillfeedClear = this.time;
      if (this.store.data.killfeed.length > 0) {
        const cutoff = Date.now() - 5000;
        const kf = this.store.data.killfeed.filter((k) => k.time > cutoff);
        if (kf.length !== this.store.data.killfeed.length) this.store.set({ killfeed: kf });
      }
    }

    this.syncRigs(dt);
    this.updateCamera(dt);
    this.updateFx(dt);
    this.syncUI(dt);
  }

  private syncRigs(dt: number): void {
    for (const e of this.entities) {
      const rig = e.rig;
      rig.group.position.copy(e.pos);
      rig.group.rotation.y = e.yaw;
      const deathT = e.alive ? 0 : Math.min(1, (this.time - e.deathAt) / 0.35);
      poseRig(rig, {
        dt,
        speed: Math.hypot(e.vel.x, e.vel.z),
        pitch: e.pitch,
        alive: e.alive,
        deathT,
        deathDir: e.deathDir,
      });
      // hide own body in first person
      rig.group.visible = !(e.isPlayer && e.alive && this.spectateId < 0);
    }
  }

  private updateCamera(dt: number): void {
    const p = this.player;
    let camEntity: Entity = p;
    if (!p.alive && this.spectateId >= 0) {
      camEntity = this.entities[this.spectateId];
    }
    this.camera.position.set(
      camEntity.pos.x,
      camEntity.pos.y + EYE_HEIGHT,
      camEntity.pos.z,
    );
    if (camEntity.isPlayer) {
      this.camera.rotation.y = camEntity.yaw + this.pRecoilYaw * DEG;
      this.camera.rotation.x = camEntity.pitch + this.pRecoil * DEG;
    } else {
      this.camera.rotation.y = camEntity.yaw;
      this.camera.rotation.x = camEntity.pitch;
    }
    this.camera.rotation.z = 0;

    // scope fov
    const targetFov = this.scoped ? 18 : this.baseFov;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 12);
      this.camera.updateProjectionMatrix();
    }

    // viewmodel
    const w = p.weapons[p.slot];
    if (p.alive && w && this.spectateId < 0) {
      if (this.vmWeapon !== w.def.id) {
        if (this.viewmodel) this.camera.remove(this.viewmodel.group);
        this.viewmodel = createViewModel(w.def.id);
        this.viewmodel.group.add(this.flashMesh);
        this.flashMesh.position.set(0, 0.02, -0.72);
        this.vmWeapon = w.def.id;
      }
      if (this.viewmodel) {
        const vis = !this.scoped;
        this.viewmodel.group.visible = vis;
        const g = this.viewmodel.group;
        const speed = Math.hypot(p.vel.x, p.vel.z);
        this.vmBob += dt * speed * 1.6;
        const bobA = Math.min(1, speed / 4) * 0.012;
        let y = -0.24 + Math.sin(this.vmBob * 2) * bobA;
        let z = -0.5;
        let rx = 0;
        this.vmKick = Math.max(0, this.vmKick - dt * 7);
        z += this.vmKick * 0.06;
        rx += this.vmKick * 0.14;
        if (w.reloadUntil > this.time) {
          const frac = 1 - (w.reloadUntil - this.time) / w.def.reloadTime;
          rx -= Math.sin(frac * Math.PI) * 0.7;
          y -= Math.sin(frac * Math.PI) * 0.1;
        }
        const sw = this.time < p.switchUntil ? (p.switchUntil - this.time) / 0.5 : 0;
        y -= sw * 0.25;
        g.position.set(0.25, y, z);
        g.rotation.set(rx, 0, 0);
      }
    } else if (this.viewmodel) {
      this.viewmodel.group.visible = false;
    }
  }

  private updateFx(dt: number): void {
    for (const t of this.tracers) {
      if (t.t > 0) {
        t.t -= dt;
        t.mat.opacity = Math.max(0, (t.t / 0.1) * 0.85);
        if (t.t <= 0) t.line.visible = false;
      }
    }
    for (const im of this.impacts) {
      if (im.t > 0) {
        im.t -= dt;
        im.mat.opacity = Math.max(0, (im.t / 0.22) * 0.9);
        if (im.t <= 0) im.sprite.visible = false;
      }
    }
    this.flashT -= dt;
    if (this.flashMesh) {
      const on = this.flashT > 0 && !this.scoped;
      this.flashMesh.visible = on;
      (this.flashMesh.material as THREE.MeshBasicMaterial).opacity = on ? 0.9 : 0;
      if (on) this.flashMesh.rotation.z = Math.random() * Math.PI;
    }
    this.shotLight.intensity = Math.max(0, this.shotLight.intensity - dt * 30);
  }

  // ---------------- UI sync ----------------

  private syncUI(dt: number): void {
    this.uiAcc += dt;
    if (this.uiAcc < 0.08) return;
    this.uiAcc = 0;
    const p = this.player;
    const w = p.weapons[p.slot];
    const aliveT = this.entities.filter((e) => e.team === 'T' && e.alive).length;
    const aliveCT = this.entities.filter((e) => e.team === 'CT' && e.alive).length;

    let spreadDeg = 0;
    if (w && !w.def.melee) {
      if (w.def.scope) {
        spreadDeg = this.scoped ? 0.05 + Math.hypot(p.vel.x, p.vel.z) * 2 : w.def.spreadBase;
      } else {
        spreadDeg = w.def.spreadBase + p.bloom + Math.hypot(p.vel.x, p.vel.z) * 0.35;
      }
    }
    const h = this.container.clientHeight;
    const gap = Math.max(4, Math.tan(spreadDeg * DEG) * (h / 2) / Math.tan((this.camera.fov / 2) * DEG));

    let hint = '';
    if (p.alive && this.phase === 'freeze' && this.roundNum > 1) {
      hint = 'B 切换主武器 (步枪/AWP) · V 切换手枪 (默认/沙鹰)';
    } else if (p.alive && p.hasBomb && zoneAt(this.map.zones, p.pos.x, p.pos.z)) {
      hint = '长按 E 安放 C4';
    } else if (
      p.alive &&
      p.team === 'CT' &&
      this.bomb.state === 'planted' &&
      Math.hypot(p.pos.x - this.bomb.pos.x, p.pos.z - this.bomb.pos.z) < 2.4
    ) {
      hint = '长按 E 拆除 C4';
    }

    const spec = this.spectateId >= 0 ? this.entities[this.spectateId] : null;
    this.store.set({
      hp: Math.max(0, Math.round(p.hp)),
      armor: Math.round(p.armor),
      weaponName: w ? w.def.name : '',
      mag: w ? (w.def.melee ? '—' : w.mag) : 0,
      reserve: w && !w.def.melee ? w.reserve : 0,
      slot: p.slot,
      hasPrimary: !!p.weapons.primary,
      hasSecondary: !!p.weapons.secondary,
      reloading: w ? w.reloadUntil > this.time : false,
      crossGap: gap,
      scoped: this.scoped,
      showCrosshair: p.alive && !this.scoped && this.phase === 'live',
      timeLeft: this.bomb.state === 'planted' ? Math.max(0, this.bomb.explodeAt - this.time) : Math.max(0, this.roundT),
      phase: this.phase,
      bomb: this.bomb.state,
      bombSite: this.bomb.site ?? '',
      hasBomb: p.hasBomb,
      aliveT,
      aliveCT,
      dead: !p.alive,
      spectating: spec ? spec.name : '',
      canPossess: !p.alive && !!spec,
      channel: p.channel
        ? {
            label: p.channel.kind === 'plant' ? '安放 C4 中...' : '拆除 C4 中...',
            frac: p.channel.t / p.channel.need,
          }
        : null,
      hint,
    });
  }

  // ---------------- minimap data ----------------

  getMinimapState(): {
    player: { x: number; z: number; yaw: number };
    mates: { x: number; z: number }[];
    enemies: { x: number; z: number }[];
    bomb: { x: number; z: number; state: string } | null;
  } {
    const p = this.player;
    const camEntity = !p.alive && this.spectateId >= 0 ? this.entities[this.spectateId] : p;
    const mates: { x: number; z: number }[] = [];
    const enemies: { x: number; z: number }[] = [];
    for (const e of this.entities) {
      if (!e.alive || e.id === camEntity.id) continue;
      if (e.team === this.myTeam) {
        mates.push({ x: e.pos.x, z: e.pos.z });
      } else {
        const seen = this.myTeam === 'T' ? e.lastSeenByT : e.lastSeenByCT;
        if (this.time - seen < 3) enemies.push({ x: e.pos.x, z: e.pos.z });
      }
    }
    let bomb: { x: number; z: number; state: string } | null = null;
    if (this.bomb.state === 'dropped' || this.bomb.state === 'planted') {
      bomb = { x: this.bomb.pos.x, z: this.bomb.pos.z, state: this.bomb.state };
    } else if (this.bomb.state === 'carried') {
      const c = this.entities[this.bomb.carrierId];
      if (c && (c.team === this.myTeam || this.time - (this.myTeam === 'T' ? c.lastSeenByT : c.lastSeenByCT) < 3)) {
        bomb = { x: c.pos.x, z: c.pos.z, state: 'carried' };
      }
    }
    return { player: { x: camEntity.pos.x, z: camEntity.pos.z, yaw: camEntity.yaw }, mates, enemies, bomb };
  }

  private freshBomb(): Bomb {
    return {
      state: 'idle',
      pos: new THREE.Vector3(),
      carrierId: -1,
      site: null,
      plantedAt: 0,
      explodeAt: 0,
      nextBeepAt: 0,
      mesh: this.bomb ? this.bomb.mesh : null,
    };
  }
}

function makePuffTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

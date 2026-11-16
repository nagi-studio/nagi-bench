import * as THREE from 'three';
import { WEAPONS, ZONE_MULT, MATCH, TEAM, type HitZone, type PlayerState, type TeamId, type WeaponId } from './types';
import { Sfx } from './audio';
import { WALLS, AREAS, resolveCollision, los, findPath } from './map';

export interface KillEvent { killer: string; victim: string; weapon: string; headshot: boolean }
export interface HudModel {
  hp: number; armor: number; helmet: boolean;
  weapon: string; ammo: number; mag: number;
  alive: boolean; scoped: boolean; spread: number;
  phase: string; roundTime: number;
  scoreCT: number; scoreT: number;
  kills: KillEvent[];
  c4: { planted: boolean; carrier: string | null; timer: number };
  defusing: number; planting: number;
  minimap: Array<{ x: number; z: number; team: number; alive: boolean; human: boolean }>;
  spectator: string;
}

interface Bot {
  st: PlayerState;
  path: Array<{ x: number; z: number }>;
  pathIdx: number;
  repathAt: number;
  targetId: number;
  aimErr: number;
  fireAt: number;
  burst: number;
  objective: { x: number; z: number };
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sfx: Sfx;
  private cb: (h: HudModel) => void;
  private players: PlayerState[] = [];
  private bots: Bot[] = [];
  private figures = new Map<number, THREE.Group>();
  private keys = new Set<string>();
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  private phase: 'freeze' | 'live' | 'planted' | 'over' = 'freeze';
  private phaseT = 0;
  private roundNo = 1;
  private scoreCT = 0;
  private scoreT = 0;
  private kills: KillEvent[] = [];
  private spectatorIdx = 0;

  private c4 = { carrier: -1, x: 0, z: 0, dropped: false, planted: false, plantT: 0, fuseT: 0, defuseT: 0, defuser: -1 };
  private recoil = 0;
  private spread = 0;
  private scoped = false;
  private humanFireAt = 0;
  private humanReloadUntil = 0;
  private stepAcc = 0;
  private hudAcc = 0;
  private vy = 0;

  constructor(container: HTMLElement, sfx: Sfx, cb: (h: HudModel) => void) {
    this.sfx = sfx;
    this.cb = cb;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    this.renderer.setSize(container.clientWidth || 1280, container.clientHeight || 720);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(75, (container.clientWidth || 1280) / (container.clientHeight || 720), 0.08, 220);
    this.buildWorld();
    this.setupInput(container);
    this.startRound(true);
  }

  /* ---------------- world ---------------- */
  private buildWorld(): void {
    this.scene.background = new THREE.Color(0x9db8d2);
    this.scene.fog = new THREE.Fog(0x9db8d2, 70, 190);
    const hemi = new THREE.HemisphereLight(0xcfe4ff, 0x8a7a5c, 1.05);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2dc, 1.5);
    sun.position.set(50, 90, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -80;
    this.scene.add(sun);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ color: 0xc8b284, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xd8c49a, roughness: 0.88 });
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x9a7a4c, roughness: 0.82 });
    for (const w of WALLS) {
      const h = w.h ?? 5;
      const m = new THREE.Mesh(new THREE.BoxGeometry(w.w, h, w.d), w.w <= 7 && w.d <= 7 ? crateMat : wallMat);
      m.position.set(w.x, h / 2, w.z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }
    // mid doors (passable leaves as thin visuals)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6e5232, roughness: 0.8 });
    for (const [dx, rot] of [[52.5, 0.22], [67.5, -0.22]] as const) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 0.35), doorMat);
      leaf.position.set(dx, 2.5, 56);
      leaf.rotation.y = rot;
      this.scene.add(leaf);
    }
    // site markers
    const siteMat = new THREE.MeshStandardMaterial({ color: 0xc96a3c, roughness: 0.85 });
    for (const key of ['asite', 'bsite'] as const) {
      const a = AREAS[key];
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(a.r * 0.62, a.r * 0.62, 0.25, 22), siteMat);
      pad.position.set(a.x, 0.13, a.z);
      this.scene.add(pad);
    }
  }

  private makeFigure(team: TeamId): THREE.Group {
    const g = new THREE.Group();
    const body = team === TEAM.CT ? 0x4a5d78 : 0xb08846;
    const trim = team === TEAM.CT ? 0x2c3a4e : 0x6e5226;
    const mat = (c: number) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.72 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.82, 0.38), mat(body));
    torso.position.y = 1.16;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), mat(0xd8b08c));
    head.position.y = 1.86;
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.46), mat(trim));
    helmet.position.y = 2.1;
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), mat(body));
    armR.position.set(0.42, 1.24, 0.12);
    armR.rotation.x = -0.9;
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), mat(body));
    armL.position.set(-0.42, 1.24, 0.12);
    armL.rotation.x = -0.75;
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.24), mat(trim));
    legR.position.set(0.17, 0.31, 0);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.24), mat(trim));
    legL.position.set(-0.17, 0.31, 0);
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.9), mat(0x2c3138));
    gun.position.set(0.18, 1.28, 0.62);
    g.add(torso, head, helmet, armR, armL, legR, legL, gun);
    g.traverse((o) => { if (o instanceof THREE.Mesh) { o.castShadow = true; } });
    return g;
  }

  /* ---------------- players / rounds ---------------- */
  private makePlayer(id: number, team: TeamId, isHuman: boolean): PlayerState {
    const spawnKey = team === TEAM.CT ? 'ctspawn' : 'tspawn';
    const a = AREAS[spawnKey];
    const jitter = () => (Math.random() - 0.5) * 8;
    return {
      id, team, isHuman,
      x: a.x + jitter(), y: 0, z: a.z + jitter(),
      yaw: team === TEAM.CT ? -2.35 : 0.75, pitch: 0,
      hp: 100, armor: 0, helmet: false,
      alive: true,
      weapon: 'glock',
      ammo: {}, hasC4: false,
      respawnAt: 0, killCount: 0, deathCount: 0
    };
  }

  private grantWeapons(p: PlayerState): void {
    const pistol = p.team === TEAM.CT ? 'usp' : 'glock';
    if (this.roundNo === 1) {
      p.weapon = pistol;
      p.armor = 0; p.helmet = false;
    } else {
      p.weapon = p.team === TEAM.CT ? 'm4a4' : 'ak47';
      p.armor = 100; p.helmet = true;
    }
    for (const id of Object.keys(WEAPONS) as WeaponId[]) {
      p.ammo[id] = WEAPONS[id].mag * (id === p.weapon ? 4 : 1);
    }
  }

  private startRound(first: boolean): void {
    this.phase = 'freeze';
    this.phaseT = MATCH.freezeTime;
    this.c4 = { carrier: -1, x: 0, z: 0, dropped: false, planted: false, plantT: 0, fuseT: 0, defuseT: 0, defuser: -1 };
    this.kills = [];
    if (first) {
      this.players = [];
      this.bots = [];
      for (const g of this.figures.values()) this.scene.remove(g);
      this.figures.clear();
      for (let i = 0; i < 10; i++) {
        const team: TeamId = i < 5 ? TEAM.CT : TEAM.T;
        const isHuman = i === 0;
        const st = this.makePlayer(i, team, isHuman);
        this.players.push(st);
        const fig = this.makeFigure(team);
        this.figures.set(i, fig);
        this.scene.add(fig);
        if (!isHuman) {
          this.bots.push({
            st, path: [], pathIdx: 0, repathAt: 0, targetId: -1,
            aimErr: 0.06 + Math.random() * 0.05, fireAt: 0, burst: 0,
            objective: { x: 0, z: 0 }
          });
        }
      }
    } else {
      for (const p of this.players) {
        const a = AREAS[p.team === TEAM.CT ? 'ctspawn' : 'tspawn'];
        p.x = a.x + (Math.random() - 0.5) * 8;
        p.z = a.z + (Math.random() - 0.5) * 8;
        p.hp = 100; p.alive = true; p.pitch = 0;
      }
    }
    for (const p of this.players) this.grantWeapons(p);
    // C4 to a random T
    const ts = this.players.filter((p) => p.team === TEAM.T);
    const carrier = ts[Math.floor(Math.random() * ts.length)];
    carrier.hasC4 = true;
    this.c4.carrier = carrier.id;
    this.sfx.roundStart();
    if (!first) this.roundNo++;
  }

  /* ---------------- input ---------------- */
  private setupInput(container: HTMLElement): void {
    const el = this.renderer.domElement;
    el.addEventListener('click', () => {
      if (document.pointerLockElement !== el) el.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => { /* lock state implicit */ });
    addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      const human = this.players[0];
      if (!human || !human.alive) return;
      if (e.code === 'Digit1') this.switchWeapon('primary');
      if (e.code === 'Digit2') this.switchWeapon('secondary');
      if (e.code === 'Digit3') this.switchWeapon('melee');
      if (e.code === 'KeyR') this.tryReload();
      if (e.code === 'KeyE') this.tryInteract();
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== el) return;
      const human = this.players[0];
      if (!human || !human.alive) return;
      const sens = this.scoped ? 0.0009 : 0.0022;
      human.yaw -= e.movementX * sens;
      human.pitch = Math.max(-1.45, Math.min(1.45, human.pitch - e.movementY * sens));
    });
    addEventListener('mousedown', (e) => {
      const human = this.players[0];
      if (!human || !human.alive || document.pointerLockElement !== el) return;
      if (e.button === 0) this.tryFire(true);
      if (e.button === 2) {
        const def = WEAPONS[human.weapon];
        if (def.zoom) { this.scoped = !this.scoped; this.sfx.scope(); this.camera.fov = this.scoped ? 24 : 75; this.camera.updateProjectionMatrix(); }
      }
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.humanFireAt = 0; });
    addEventListener('resize', () => {
      this.camera.aspect = (container.clientWidth || 1280) / (container.clientHeight || 720);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth || 1280, container.clientHeight || 720);
    });
  }

  private switchWeapon(kind: 'primary' | 'secondary' | 'melee'): void {
    const human = this.players[0];
    const ids = (Object.keys(WEAPONS) as WeaponId[]).filter((w) => WEAPONS[w].kind === kind);
    const owned = ids.find((w) => (human.ammo[w] ?? 0) > 0);
    if (owned) { human.weapon = owned; this.scoped = false; this.camera.fov = 75; this.camera.updateProjectionMatrix(); }
  }

  private tryReload(): void {
    const p = this.players[0];
    const def = WEAPONS[p.weapon];
    if (this.humanReloadUntil > performance.now() / 1000) return;
    if ((p.ammo[p.weapon] ?? 0) >= def.mag) return;
    this.humanReloadUntil = performance.now() / 1000 + def.reload;
    this.sfx.reload();
    window.setTimeout(() => {
      const cur = this.players[0];
      const d = WEAPONS[cur.weapon];
      const reserve = cur.ammo[cur.weapon] ?? 0;
      const need = d.mag;
      const take = Math.min(need, reserve);
      cur.ammo[cur.weapon] = take;
    }, def.reload * 1000);
  }

  private tryInteract(): void {
    // plant / defuse handled continuously; E gives a small progress boost tick
  }

  /* ---------------- combat ---------------- */
  private fire(shooter: PlayerState, dir: THREE.Vector3): void {
    const def = WEAPONS[shooter.weapon];
    const spread = shooter.isHuman ? this.spread + def.spread : def.spread * (1 + Math.random());
    const d = dir.clone();
    d.x += (Math.random() - 0.5) * spread * 2;
    d.y += (Math.random() - 0.5) * spread * 2;
    d.z += (Math.random() - 0.5) * spread * 2;
    d.normalize();
    const org = new THREE.Vector3(shooter.x, shooter.y + 1.62, shooter.z);
    this.sfx.fire(shooter.weapon);

    let bestT = def.range;
    let victim: PlayerState | null = null;
    let zone: HitZone = 'chest';
    for (const p of this.players) {
      if (!p.alive || p.team === shooter.team || p.id === shooter.id) continue;
      // zone test: vertical bands around the body axis
      const cx = p.x - org.x, cy = p.y - org.y, cz = p.z - org.z;
      const proj = cx * d.x + cy * d.y + cz * d.z;
      if (proj < 0 || proj > bestT) continue;
      const px = org.x + d.x * proj, py = org.y + d.y * proj, pz = org.z + d.z * proj;
      const horiz = Math.hypot(px - p.x, pz - p.z);
      if (horiz > 0.55) continue;
      const relY = py - p.y;
      let z: HitZone = 'chest';
      if (relY > 1.62) z = 'head';
      else if (relY > 1.0) z = 'chest';
      else if (relY > 0.68) z = 'stomach';
      else if (relY > 0.32) z = 'leg';
      else z = 'leg';
      if (horiz > 0.42 && relY > 0.9 && relY < 1.5) z = 'arm';
      bestT = proj;
      victim = p;
      zone = z;
    }
    if (!victim) return;
    let dmg = def.damage * ZONE_MULT[zone];
    if (victim.armor > 0) {
      dmg *= 0.5 + def.armorPen * 0.5;
      victim.armor = Math.max(0, victim.armor - def.damage * 0.12);
    }
    victim.hp -= dmg;
    if (shooter.isHuman || victim.isHuman) this.sfx.hit();
    if (victim.hp <= 0) {
      victim.hp = 0;
      victim.alive = false;
      victim.deathCount++;
      shooter.killCount++;
      this.kills.unshift({
        killer: `#${shooter.id}`, victim: `#${victim.id}`,
        weapon: WEAPONS[shooter.weapon].name, headshot: zone === 'head'
      });
      this.kills = this.kills.slice(0, 5);
      if (shooter.isHuman || victim.isHuman) this.sfx.kill();
      // C4 drop
      if (victim.hasC4) {
        victim.hasC4 = false;
        this.c4.carrier = -1;
        this.c4.dropped = true;
        this.c4.x = victim.x;
        this.c4.z = victim.z;
      }
    }
  }

  private tryFire(fromHuman: boolean): void {
    const now = performance.now() / 1000;
    const p = fromHuman ? this.players[0] : null;
    if (!p || !p.alive) return;
    const def = WEAPONS[p.weapon];
    if (now < this.humanReloadUntil) return;
    if (!def.auto && this.humanFireAt && now - this.humanFireAt < def.fireDelay * 1.4) return;
    if (now - this.humanFireAt < def.fireDelay) return;
    const magKey = p.weapon;
    if ((p.ammo[magKey] ?? 0) <= 0) {
      if (magKey !== 'knife') this.tryReload();
      return;
    }
    if (magKey !== 'knife') p.ammo[magKey]--;
    this.humanFireAt = now;
    this.recoil = def.recoil * (this.scoped ? 0.6 : 1);
    this.spread = Math.min(0.09, this.spread + def.recoil * 0.012);
    p.pitch = Math.min(1.45, p.pitch + def.recoil * 0.012);
    const dir = new THREE.Vector3();
    dir.x = -Math.sin(p.yaw) * Math.cos(p.pitch);
    dir.y = Math.sin(p.pitch);
    dir.z = -Math.cos(p.yaw) * Math.cos(p.pitch);
    this.fire(p, dir);
    if (def.auto) {
      // holding handled by repeated mousedown+interval via fireAt comparison above
    }
  }

  /* ---------------- AI ---------------- */
  private botThink(b: Bot, t: number): void {
    const st = b.st;
    if (!st.alive) return;
    const def = WEAPONS[st.weapon];

    // objective: T pushes the target site (A on even rounds, B on odd), CT holds sites
    if (t > b.repathAt || !b.path.length) {
      b.repathAt = t + 0.45 + Math.random() * 0.35;
      const targetSite = st.team === TEAM.T
        ? (this.roundNo % 2 ? AREAS.asite : AREAS.bsite)
        : (this.roundNo % 2 ? AREAS.asite : AREAS.bsite);
      if (st.team === TEAM.T && this.c4.dropped && !this.c4.planted) {
        b.objective = { x: this.c4.x, z: this.c4.z };
      } else if (this.c4.planted && st.team === TEAM.CT) {
        b.objective = { x: this.c4.x, z: this.c4.z };
      } else if (this.c4.planted && st.team === TEAM.T) {
        const a = AREAS[this.roundNo % 2 ? 'asite' : 'bsite'];
        b.objective = { x: a.x + (Math.random() - 0.5) * 10, z: a.z + (Math.random() - 0.5) * 10 };
      } else {
        b.objective = {
          x: targetSite.x + (Math.random() - 0.5) * 12,
          z: targetSite.z + (Math.random() - 0.5) * 12
        };
      }
      b.path = findPath(st.x, st.z, b.objective.x, b.objective.z);
      b.pathIdx = 0;
    }

    // movement along path
    if (b.pathIdx < b.path.length) {
      const wp = b.path[b.pathIdx];
      const dx = wp.x - st.x, dz = wp.z - st.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 1.6) b.pathIdx++;
      else {
        const speed = 6.2 * (this.phase === 'freeze' ? 0 : 1);
        const nx = st.x + (dx / dist) * speed * 0.016;
        const nz = st.z + (dz / dist) * speed * 0.016;
        const res = resolveCollision(st.x, st.z, 0.5, nx, nz);
        st.x = res.x; st.z = res.z;
        st.yaw = Math.atan2(-dx, -dz);
      }
    }

    // engage visible enemies
    let enemy: PlayerState | null = null;
    let best = 64;
    for (const p of this.players) {
      if (!p.alive || p.team === st.team) continue;
      const dist = Math.hypot(p.x - st.x, p.z - st.z);
      if (dist < best && los(st.x, st.z, p.x, p.z)) { best = dist; enemy = p; }
    }
    if (enemy) {
      const dx = enemy.x - st.x, dz = enemy.z - st.z;
      st.yaw = Math.atan2(-dx, -dz) + (Math.random() - 0.5) * b.aimErr;
      st.pitch = (Math.random() - 0.5) * b.aimErr;
      if (t > b.fireAt) {
        b.fireAt = t + def.fireDelay * (1.15 + Math.random() * 0.5);
        const dir = new THREE.Vector3(
          -Math.sin(st.yaw) * Math.cos(st.pitch),
          Math.sin(st.pitch),
          -Math.cos(st.yaw) * Math.cos(st.pitch)
        );
        if ((st.ammo[st.weapon] ?? 0) > 0) st.ammo[st.weapon]--;
        else st.ammo[st.weapon] = def.mag;
        this.fire(st, dir);
      }
    } else if (t > b.fireAt + 2) {
      st.pitch *= 0.9;
    }
  }

  /* ---------------- C4 & round flow ---------------- */
  private updateC4(dt: number): void {
    // planting: T carrying C4 inside the target site
    if (!this.c4.planted && this.phase === 'live') {
      const carrier = this.players.find((p) => p.hasC4 && p.alive);
      if (carrier) {
        const a = AREAS[this.roundNo % 2 ? 'asite' : 'bsite'];
        const inside = Math.hypot(carrier.x - a.x, carrier.z - a.z) < a.r * 0.8;
        const still = inside && (carrier.isHuman ? true : true);
        if (inside && still) {
          this.c4.plantT += dt;
          if (this.c4.plantT >= MATCH.plantTime) {
            this.c4.planted = true;
            this.c4.carrier = carrier.id;
            this.c4.x = carrier.x;
            this.c4.z = carrier.z;
            this.c4.fuseT = MATCH.fuseTime;
            carrier.hasC4 = false;
            this.phase = 'planted';
            this.sfx.plant();
          }
        } else this.c4.plantT = Math.max(0, this.c4.plantT - dt * 0.6);
      } else if (this.c4.dropped) {
        // pickup
        for (const p of this.players) {
          if (p.team === TEAM.T && p.alive && Math.hypot(p.x - this.c4.x, p.z - this.c4.z) < 1.6) {
            p.hasC4 = true;
            this.c4.carrier = p.id;
            this.c4.dropped = false;
            break;
          }
        }
      }
    }
    if (this.c4.planted) {
      this.c4.fuseT -= dt;
      if (Math.floor(this.c4.fuseT * (this.c4.fuseT < 10 ? 4 : 1)) % 2 === 0 && this.c4.fuseT < 12 && Math.random() < 0.08) this.sfx.beep();
      // defuse
      let defuser: PlayerState | null = null;
      for (const p of this.players) {
        if (p.team === TEAM.CT && p.alive && Math.hypot(p.x - this.c4.x, p.z - this.c4.z) < 2.2) { defuser = p; break; }
      }
      if (defuser) {
        this.c4.defuseT += dt;
        this.c4.defuser = defuser.id;
        if (Math.random() < dt * 6) this.sfx.defuseTick();
        const need = defuser.helmet ? MATCH.defuseHelmetTime : MATCH.defuseTime;
        if (this.c4.defuseT >= need) {
          this.scoreCT++;
          this.endRound('CT 拆包成功');
          return;
        }
      } else {
        this.c4.defuseT = Math.max(0, this.c4.defuseT - dt * 0.5);
        this.c4.defuser = -1;
      }
      if (this.c4.fuseT <= 0) {
        this.sfx.explode();
        this.scoreT++;
        this.endRound('C4 爆炸');
      }
    }
  }

  private endRound(reason: string): void {
    this.phase = 'over';
    this.phaseT = 4;
    this.lastRoundReason = reason;
  }
  private lastRoundReason = '';

  private checkElimination(): void {
    if (this.phase !== 'live' && this.phase !== 'planted') return;
    const ctAlive = this.players.some((p) => p.team === TEAM.CT && p.alive);
    const tAlive = this.players.some((p) => p.team === TEAM.T && p.alive);
    if (!ctAlive && !this.c4.planted) {
      this.scoreT++;
      this.endRound('CT 全员阵亡');
    } else if (!tAlive && !this.c4.planted) {
      this.scoreCT++;
      this.endRound('T 全员阵亡');
    } else if (!ctAlive && this.c4.planted) {
      // after plant a wiped CT side still loses only if fuse runs or they fail to defuse
    }
  }

  /* ---------------- main loop ---------------- */
  start(): void {
    const loop = () => {
      if (this.disposed) return;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private update(dt: number): void {
    const t = performance.now() / 1000;

    // phases
    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) { this.phase = 'live'; this.phaseT = MATCH.roundTime; }
    } else if (this.phase === 'live') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) {
        this.scoreCT++;
        this.endRound('时间耗尽');
      }
    } else if (this.phase === 'over') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) this.startRound(false);
    }

    // human movement
    const human = this.players[0];
    if (human && human.alive && this.phase !== 'freeze') {
      const speed = this.scoped ? 3.2 : 6.4;
      let fx = 0, fz = 0;
      if (this.keys.has('KeyW')) fz += 1;
      if (this.keys.has('KeyS')) fz -= 1;
      if (this.keys.has('KeyD')) fx += 1;
      if (this.keys.has('KeyA')) fx -= 1;
      const len = Math.hypot(fx, fz);
      if (len > 0) {
        fx /= len; fz /= len;
        const sin = Math.sin(human.yaw), cos = Math.cos(human.yaw);
        const wx = (fx * cos - fz * sin) * speed * dt;
        const wz = (fx * sin + fz * cos) * speed * dt;
        const res = resolveCollision(human.x, human.z, 0.5, human.x + wx, human.z + wz);
        const moved = Math.hypot(res.x - human.x, res.z - human.z);
        human.x = res.x; human.z = res.z;
        this.stepAcc += moved;
        if (this.stepAcc > 2.4) { this.stepAcc = 0; this.sfx.footstep(); }
      }
      if (this.keys.has('Space') && human.y <= 0.001) {
        human.y = 0.002;
        this.vy = 7.6;
      }
      // vertical integration (jump / gravity)
      if (human.y > 0 || this.vy > 0) {
        this.vy -= 22 * dt;
        human.y += this.vy * dt;
        if (human.y <= 0) { human.y = 0; this.vy = 0; }
      }
      this.spread = Math.max(0, this.spread - dt * 0.14);
      this.recoil *= Math.exp(-6 * dt);
      // auto fire while held (m4/ak)
      if (this.keys.has('KeyF')) this.tryFire(true);
    }

    // bots
    for (const b of this.bots) this.botThink(b, t);
    this.updateC4(dt);
    this.checkElimination();

    // figures sync
    for (const p of this.players) {
      const g = this.figures.get(p.id);
      if (!g) continue;
      g.visible = p.alive;
      g.position.set(p.x, p.y, p.z);
      g.rotation.y = p.yaw;
    }

    // camera: human first person or spectate teammate
    if (human && human.alive) {
      this.camera.position.set(human.x, human.y + 1.62, human.z);
      this.camera.rotation.set(human.pitch, human.yaw, 0, 'YXZ');
    } else {
      const mates = this.players.filter((p) => p.team === human.team && p.alive);
      const tgt = mates[this.spectatorIdx % Math.max(1, mates.length)];
      if (tgt) {
        this.camera.position.set(tgt.x + Math.sin(tgt.yaw) * 3.2, tgt.y + 2.6, tgt.z + Math.cos(tgt.yaw) * 3.2);
        this.camera.lookAt(tgt.x, tgt.y + 1.5, tgt.z);
      }
    }

    // HUD push
    this.hudAcc += dt;
    if (this.hudAcc > 0.1) {
      this.hudAcc = 0;
      const def = WEAPONS[human.weapon];
      const mates = this.players.filter((p) => p.team === human.team && p.alive);
      this.cb({
        hp: Math.round(human.hp), armor: Math.round(human.armor), helmet: human.helmet,
        weapon: def.name, ammo: human.ammo[human.weapon] ?? 0, mag: def.mag,
        alive: human.alive, scoped: this.scoped, spread: this.spread + def.spread,
        phase: this.phase === 'freeze' ? '冻结期' : this.phase === 'live' ? '回合进行' : this.phase === 'planted' ? 'C4 已安放' : this.lastRoundReason,
        roundTime: Math.max(0, Math.round(this.phase === 'planted' ? this.c4.fuseT : this.phaseT)),
        scoreCT: this.scoreCT, scoreT: this.scoreT,
        kills: this.kills,
        c4: { planted: this.c4.planted, carrier: this.c4.carrier >= 0 ? `#${this.c4.carrier}` : null, timer: Math.max(0, this.c4.fuseT) },
        defusing: this.c4.defuseT, planting: this.c4.plantT,
        minimap: this.players.map((p) => ({ x: p.x, z: p.z, team: p.team, alive: p.alive, human: p.isHuman })),
        spectator: mates.length ? `#${(mates[this.spectatorIdx % mates.length]?.id ?? human.id)}` : '—'
      });
    }
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
  }
}

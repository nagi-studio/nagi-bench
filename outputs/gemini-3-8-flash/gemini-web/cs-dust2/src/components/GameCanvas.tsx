import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Soldier, KillfeedItem, GameSnapshot, WeaponId, HitboxZone } from '../types';
import { Dust2Map } from '../game/Dust2Map';
import { PlayerController } from '../game/PlayerController';
import { BotAIManager } from '../game/BotAI';
import { WeaponFXManager, SoundManager, WEAPON_SPECS } from '../game/WeaponSystem';
import { HUD } from './HUD';

const T_SPAWNS: [number, number][] = [[-8, -36], [-4, -36], [0, -36], [4, -36], [8, -36]];
const CT_SPAWNS: [number, number][] = [[-8, 34], [-4, 34], [0, 34], [4, 34], [8, 34]];

const T_ROUTES: [number, number][][] = [
  [[22, -28], [24, -6], [24, 24]],
  [[0, -18], [8, 6], [22, 24]],
  [[-22, -26], [-24, 10], [-25, 24]],
  [[20, -24], [24, 8], [24, 26]],
  [[-20, -20], [-24, 14], [-25, 24]]
];

const CT_ROUTES: [number, number][][] = [
  [[24, 24], [24, 4], [24, -10]],
  [[10, 18], [8, 4], [0, -12]],
  [[-24, 24], [-24, 12], [-22, -10]],
  [[0, 14], [0, -2], [0, -18]],
  [[20, 26], [-20, 24], [0, 20]]
];

export const GameCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // References to core game instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mapRef = useRef<Dust2Map | null>(null);
  const controllerRef = useRef<PlayerController | null>(null);
  const botAiRef = useRef<BotAIManager | null>(null);
  const fxManagerRef = useRef<WeaponFXManager | null>(null);

  // Game state
  const soldiersRef = useRef<Soldier[]>([]);
  const [killfeed, setKillfeed] = useState<KillfeedItem[]>([]);
  const ctScoreRef = useRef(0);
  const tScoreRef = useRef(0);
  const isPistolRoundRef = useRef(false);
  const roundTimeRef = useRef(115.0);
  const roundOverCooldownRef = useRef(0);
  const c4StatusRef = useRef<'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'>('carried');
  const c4CountdownRef = useRef(40.0);
  const c4BeepTimerRef = useRef(0);
  const c4ActionProgressRef = useRef(0);
  const bannerRef = useRef('ROUND START — DUST2 5v5');
  const isActionKeyHeldRef = useRef(false);

  const [snapshot, setSnapshot] = useState<GameSnapshot>({
    hp: 100,
    armor: 100,
    playerName: 'T-Alpha (You)',
    playerTeam: 'T',
    weaponId: 'ak47',
    weaponName: 'AK-47',
    weaponSub: '高伤害 · 强垂直后坐力 · 爆头必杀',
    mag: 30,
    reserve: 90,
    isScoped: false,
    ctScore: 0,
    tScore: 0,
    ctAlive: 5,
    tAlive: 5,
    roundTime: 115,
    c4Status: 'carried',
    c4Countdown: 40,
    c4Progress: 0,
    isActionHolding: false,
    actionText: '',
    banner: 'ROUND START — DUST2 5v5',
    zone: 'T Spawn (匪家)',
    soldiers: [],
    c4Position: null,
    isPistolRound: false,
    crosshairSpread: 12
  });

  const addKillfeedItem = useCallback((
    killerName: string,
    killerTeam: 'CT' | 'T',
    victimName: string,
    victimTeam: 'CT' | 'T',
    weaponName: string,
    isHeadshot: boolean
  ) => {
    const item: KillfeedItem = {
      id: Math.random().toString(36).substring(2, 9),
      killerName,
      killerTeam,
      victimName,
      victimTeam,
      weaponName,
      isHeadshot
    };
    setKillfeed((prev) => [item, ...prev.slice(0, 5)]);
  }, []);

  const checkVictory = useCallback(() => {
    if (roundOverCooldownRef.current > 0) return;
    const aliveCT = soldiersRef.current.filter((s) => s.team === 'CT' && s.alive).length;
    const aliveT = soldiersRef.current.filter((s) => s.team === 'T' && s.alive).length;

    if (c4StatusRef.current === 'defused') {
      ctScoreRef.current++;
      roundOverCooldownRef.current = 4.0;
      bannerRef.current = 'COUNTER-TERRORISTS WIN — C4 成功拆除！';
    } else if (c4StatusRef.current === 'exploded') {
      tScoreRef.current++;
      roundOverCooldownRef.current = 4.0;
      bannerRef.current = 'TERRORISTS WIN — C4 成功引爆目标！';
    } else if (aliveCT === 0) {
      tScoreRef.current++;
      roundOverCooldownRef.current = 4.0;
      bannerRef.current = 'TERRORISTS WIN — 全歼警队！';
    } else if (aliveT === 0 && c4StatusRef.current !== 'planted') {
      ctScoreRef.current++;
      roundOverCooldownRef.current = 4.0;
      bannerRef.current = 'COUNTER-TERRORISTS WIN — 全歼匪队！';
    }
  }, []);

  const startNewRound = useCallback(() => {
    if (!sceneRef.current || !botAiRef.current || !controllerRef.current || !mapRef.current) return;

    // Clean old soldier models
    soldiersRef.current.forEach((s) => sceneRef.current?.remove(s.root));
    soldiersRef.current = [];

    const isPistol = isPistolRoundRef.current;

    // Spawn 5 Terrorists
    for (let i = 0; i < 5; i++) {
      const isPlayer = i === 0;
      const wepId: WeaponId = isPistol ? (isPlayer ? 'deagle' : 'usp') : (i === 2 ? 'awp' : 'ak47');
      const t = botAiRef.current.createSoldier(
        'T',
        isPlayer ? 'T-Alpha (You)' : `T-Bot-${i + 1}`,
        T_SPAWNS[i][0],
        T_SPAWNS[i][1],
        isPlayer,
        wepId
      );
      t.route = T_ROUTES[i];
      if (i === 0) t.hasC4 = true;
      soldiersRef.current.push(t);
      if (isPlayer) {
        controllerRef.current.setHumanSoldier(t);
      }
    }

    // Spawn 5 Counter-Terrorists
    for (let i = 0; i < 5; i++) {
      const wepId: WeaponId = isPistol ? 'usp' : (i === 3 ? 'awp' : 'm4a4');
      const ct = botAiRef.current.createSoldier(
        'CT',
        `CT-Bot-${i + 1}`,
        CT_SPAWNS[i][0],
        CT_SPAWNS[i][1],
        false,
        wepId
      );
      ct.route = CT_ROUTES[i];
      soldiersRef.current.push(ct);
    }

    roundTimeRef.current = 115.0;
    c4StatusRef.current = 'carried';
    c4CountdownRef.current = 40.0;
    c4ActionProgressRef.current = 0;
    roundOverCooldownRef.current = 0;
    mapRef.current.c4Mesh.visible = false;
    controllerRef.current.setScope(false);
    bannerRef.current = isPistol ? 'PISTOL ROUND START — 手枪局开始' : 'ROUND START — DUST2 5v5 全枪局';
  }, []);

  const handleTakeover = useCallback(() => {
    if (!controllerRef.current) return;
    const currentHuman = controllerRef.current.getHumanSoldier();
    const aliveBots = soldiersRef.current.filter((s) => s.alive && s !== currentHuman);
    if (aliveBots.length === 0) return;

    // Prefer same team first
    const sameTeam = aliveBots.filter((s) => s.team === (currentHuman ? currentHuman.team : 'T'));
    const nextBot = sameTeam.length > 0 ? sameTeam[0] : aliveBots[0];

    controllerRef.current.setHumanSoldier(nextBot);
    controllerRef.current.setScope(false);
    bannerRef.current = `已接管角色: ${nextBot.name} (${nextBot.team})`;
  }, []);

  // Player shooting execution
  const handlePlayerFire = useCallback(() => {
    const controller = controllerRef.current;
    const map = mapRef.current;
    const fxManager = fxManagerRef.current;
    const botAi = botAiRef.current;
    if (!controller || !map || !fxManager || !botAi) return;

    const human = controller.getHumanSoldier();
    if (!human || !human.alive || human.fireCooldown > 0 || human.reloadTimer > 0) return;

    const spec = WEAPON_SPECS[human.weaponId];
    if (!spec || spec.isC4) return;

    if (!spec.isMelee) {
      if (human.mag <= 0) {
        controller.reload();
        return;
      }
      human.mag--;
    }

    human.fireCooldown = spec.fireInterval;
    SoundManager.play(spec.isMelee ? 'hit' : spec.id);
    controller.triggerRecoil(spec.recoilKick);

    // Compute raycast with camera yaw/pitch and spread
    const origin = new THREE.Vector3(human.pos.x, human.pos.y + 1.68, human.pos.z);
    const spreadAmt = controller.isScoped && spec.isSniper ? 0.0005 : spec.spread;
    const yawSpread = human.yaw + (Math.random() - 0.5) * spreadAmt;
    const pitchSpread = human.pitch + (Math.random() - 0.5) * spreadAmt;

    const dir = new THREE.Vector3(
      -Math.sin(yawSpread) * Math.cos(pitchSpread),
      Math.sin(pitchSpread),
      -Math.cos(yawSpread) * Math.cos(pitchSpread)
    ).normalize();

    const maxDist = spec.isMelee ? 3.5 : 150;
    const rc = new THREE.Raycaster(origin, dir, 0.1, maxDist);

    // Gather enemy hitboxes
    const enemyHitboxes: THREE.Mesh[] = [];
    soldiersRef.current.forEach((s) => {
      if (s.alive && s.team !== human.team) {
        enemyHitboxes.push(...s.hitboxes);
      }
    });

    const wallHits = rc.intersectObjects(map.wallMeshes, false);
    const wallDist = wallHits.length > 0 ? wallHits[0].distance : Infinity;
    const bodyHits = rc.intersectObjects(enemyHitboxes, false);

    let endPoint = origin.clone().addScaledVector(dir, Math.min(wallDist, maxDist));

    if (bodyHits.length > 0 && bodyHits[0].distance < wallDist) {
      const hit = bodyHits[0];
      endPoint = hit.point;
      const mesh = hit.object as THREE.Mesh;
      const owner = mesh.userData.owner as Soldier;
      const zone = mesh.userData.zone as HitboxZone;
      const mult = mesh.userData.mult as number;

      if (owner) {
        botAi.damageSoldier(
          human,
          owner,
          spec.damage,
          spec.armorPen,
          zone,
          mult,
          spec.name,
          (attacker, victim, wName, isHeadshot) => {
            addKillfeedItem(attacker.name, attacker.team, victim.name, victim.team, wName, isHeadshot);
            if (victim.hasC4 && c4StatusRef.current === 'carried') {
              victim.hasC4 = false;
              c4StatusRef.current = 'dropped';
              map.c4Mesh.position.set(victim.pos.x, 0.15, victim.pos.z);
              map.c4Mesh.visible = true;
              bannerRef.current = 'C4 炸弹已掉落！';
            }
            checkVictory();
          }
        );
      }
    } else if (wallHits.length > 0) {
      fxManager.createImpactSparks(wallHits[0].point, false);
    }

    if (!spec.isMelee) {
      const muzzleStart = origin.clone().add(new THREE.Vector3(0.2, -0.2, -0.4).applyEuler(new THREE.Euler(human.pitch, human.yaw, 0, 'YXZ')));
      fxManager.createTracer(muzzleStart, endPoint, spec.isSniper);
    }
  }, [addKillfeedItem, checkVictory]);

  // Main setup effect
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xd6ecff);
    scene.fog = new THREE.FogExp2(0xe2d5b5, 0.009);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    cameraRef.current = camera;
    scene.add(camera);

    // Lights
    scene.add(new THREE.HemisphereLight(0xfffbeb, 0x927c5a, 0.85));
    const sun = new THREE.DirectionalLight(0xfff7ed, 0.95);
    sun.position.set(45, 75, 30);
    sun.castShadow = true;
    scene.add(sun);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Subsystems
    const map = new Dust2Map(scene);
    mapRef.current = map;

    const fxManager = new WeaponFXManager(scene);
    fxManagerRef.current = fxManager;

    const botAi = new BotAIManager(scene, map, fxManager);
    botAiRef.current = botAi;

    const controller = new PlayerController(camera, renderer.domElement, map);
    controllerRef.current = controller;

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Mouse fire listener
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        SoundManager.ensureAudio();
        handlePlayerFire();
      }
    };
    renderer.domElement.addEventListener('mousedown', onMouseDown);

    // Key shortcut listeners for Tab and N
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        handleTakeover();
      } else if (e.code === 'KeyN') {
        startNewRound();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // Initialize round
    startNewRound();

    // Game loop
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Round cooldown
      if (roundOverCooldownRef.current > 0) {
        roundOverCooldownRef.current -= dt;
        if (roundOverCooldownRef.current <= 0) {
          startNewRound();
        }
      }

      // C4 and round timer
      if (c4StatusRef.current === 'planted') {
        c4CountdownRef.current = Math.max(0, c4CountdownRef.current - dt);
        c4BeepTimerRef.current -= dt;
        if (c4BeepTimerRef.current <= 0) {
          SoundManager.play('c4beep');
          c4BeepTimerRef.current = Math.max(0.12, (c4CountdownRef.current / 40) * 0.85);
        }
        if (c4CountdownRef.current <= 0 && c4StatusRef.current === 'planted') {
          c4StatusRef.current = 'exploded';
          SoundManager.play('explode');
          checkVictory();
        }
      } else if (roundOverCooldownRef.current <= 0) {
        roundTimeRef.current = Math.max(0, roundTimeRef.current - dt);
        if (roundTimeRef.current <= 0) {
          ctScoreRef.current++;
          roundOverCooldownRef.current = 4.0;
          bannerRef.current = 'COUNTER-TERRORISTS WIN — 时间耗尽！';
        }
      }

      // Update Player Controller
      controller.update(dt);
      fxManager.update(dt);

      const human = controller.getHumanSoldier();

      // C4 Plant and Defuse interaction
      const isAction = controller.isActionKeyPressed() || isActionKeyHeldRef.current;
      if (human && human.alive && isAction) {
        if (human.team === 'T' && human.hasC4 && c4StatusRef.current === 'carried') {
          const site = map.getBombSiteAt(human.pos);
          if (site) {
            c4ActionProgressRef.current = Math.min(1.0, c4ActionProgressRef.current + dt / 3.2);
            if (c4ActionProgressRef.current >= 1.0) {
              human.hasC4 = false;
              c4StatusRef.current = 'planted';
              map.c4Mesh.position.set(human.pos.x, 0.15, human.pos.z);
              map.c4Mesh.visible = true;
              c4ActionProgressRef.current = 0;
              bannerRef.current = `C4 已在 ${site.name} 安放！40秒倒计时`;
            }
          }
        } else if (human.team === 'CT' && c4StatusRef.current === 'planted') {
          const distToC4 = human.pos.distanceTo(map.c4Mesh.position);
          if (distToC4 < 3.0) {
            c4ActionProgressRef.current = Math.min(1.0, c4ActionProgressRef.current + dt / 5.0);
            if (c4ActionProgressRef.current >= 1.0) {
              c4StatusRef.current = 'defused';
              c4ActionProgressRef.current = 0;
              checkVictory();
            }
          }
        }
      } else {
        c4ActionProgressRef.current = Math.max(0, c4ActionProgressRef.current - dt * 2);
      }

      // Update Bot AI
      const c4Pos = c4StatusRef.current === 'planted' ? map.c4Mesh.position : null;
      soldiersRef.current.forEach((bot) => {
        if (!bot.isHuman) {
          botAi.updateBot(bot, dt, soldiersRef.current, c4StatusRef.current, c4Pos, (shooter, targetPos) => {
            const spec = WEAPON_SPECS[shooter.weaponId];
            SoundManager.play(spec.isMelee ? 'hit' : spec.id);

            // Raycast from bot to target
            const origin = shooter.pos.clone().add(new THREE.Vector3(0, 1.4, 0));
            const dir = targetPos.clone().sub(origin).normalize();
            const rc = new THREE.Raycaster(origin, dir, 0.1, 120);

            const victimHitboxes: THREE.Mesh[] = [];
            soldiersRef.current.forEach((s) => {
              if (s.alive && s.team !== shooter.team) {
                victimHitboxes.push(...s.hitboxes);
              }
            });

            const wallHits = rc.intersectObjects(map.wallMeshes, false);
            const wallDist = wallHits.length > 0 ? wallHits[0].distance : Infinity;
            const bodyHits = rc.intersectObjects(victimHitboxes, false);

            let endPoint = targetPos;
            if (bodyHits.length > 0 && bodyHits[0].distance < wallDist) {
              const hit = bodyHits[0];
              endPoint = hit.point;
              const mesh = hit.object as THREE.Mesh;
              const victim = mesh.userData.owner as Soldier;
              const zone = mesh.userData.zone as HitboxZone;
              const mult = mesh.userData.mult as number;

              if (victim) {
                botAi.damageSoldier(
                  shooter,
                  victim,
                  spec.damage,
                  spec.armorPen,
                  zone,
                  mult,
                  spec.name,
                  (att, vic, wName, isHeadshot) => {
                    addKillfeedItem(att.name, att.team, vic.name, vic.team, wName, isHeadshot);
                    if (vic.hasC4 && c4StatusRef.current === 'carried') {
                      vic.hasC4 = false;
                      c4StatusRef.current = 'dropped';
                      map.c4Mesh.position.set(vic.pos.x, 0.15, vic.pos.z);
                      map.c4Mesh.visible = true;
                      bannerRef.current = 'C4 炸弹已掉落！';
                    }
                    checkVictory();
                  }
                );
              }
            }

            fxManager.createTracer(origin, endPoint, spec.isSniper);
          });
        }
      });

      // Render Three.js frame
      renderer.render(scene, camera);

      // Snapshot for React HUD
      const activeHuman = controller.getHumanSoldier();
      const spec = activeHuman ? WEAPON_SPECS[activeHuman.weaponId] : WEAPON_SPECS.ak47;
      const aliveCT = soldiersRef.current.filter((s) => s.team === 'CT' && s.alive).length;
      const aliveT = soldiersRef.current.filter((s) => s.team === 'T' && s.alive).length;

      let c4WorldPos: { x: number; z: number } | null = null;
      if (c4StatusRef.current === 'carried') {
        const carrier = soldiersRef.current.find((s) => s.alive && s.hasC4);
        if (carrier) c4WorldPos = { x: carrier.pos.x, z: carrier.pos.z };
      } else if (map.c4Mesh.visible) {
        c4WorldPos = { x: map.c4Mesh.position.x, z: map.c4Mesh.position.z };
      }

      setSnapshot({
        hp: activeHuman ? activeHuman.hp : 0,
        armor: activeHuman ? activeHuman.armor : 0,
        playerName: activeHuman ? `${activeHuman.name}${activeHuman.hasC4 ? ' [C4]' : ''}` : '已阵亡',
        playerTeam: activeHuman ? activeHuman.team : 'T',
        weaponId: activeHuman ? activeHuman.weaponId : 'ak47',
        weaponName: spec.name,
        weaponSub: spec.sub,
        mag: activeHuman ? activeHuman.mag : 0,
        reserve: activeHuman ? activeHuman.reserve : 0,
        isScoped: controller.isScoped,
        ctScore: ctScoreRef.current,
        tScore: tScoreRef.current,
        ctAlive: aliveCT,
        tAlive: aliveT,
        roundTime: roundTimeRef.current,
        c4Status: c4StatusRef.current,
        c4Countdown: c4CountdownRef.current,
        c4Progress: c4ActionProgressRef.current,
        isActionHolding: isAction,
        actionText: '',
        banner: bannerRef.current,
        zone: activeHuman ? map.getZoneCallout(activeHuman.pos.x, activeHuman.pos.z) : 'DE_DUST2',
        soldiers: soldiersRef.current.map((s) => ({
          id: s.id,
          team: s.team,
          x: s.pos.x,
          z: s.pos.z,
          yaw: s.yaw,
          isHuman: s.isHuman,
          alive: s.alive
        })),
        c4Position: c4WorldPos,
        isPistolRound: isPistolRoundRef.current,
        crosshairSpread: controller.crosshairSpread
      });
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      controller.dispose();
      fxManager.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handlePlayerFire, handleTakeover, startNewRound, addKillfeedItem, checkVictory]);

  const handleSelectWeapon = useCallback((wepId: WeaponId) => {
    controllerRef.current?.switchWeapon(wepId);
  }, []);

  const handleTogglePistolRound = useCallback(() => {
    isPistolRoundRef.current = !isPistolRoundRef.current;
    startNewRound();
  }, [startNewRound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
      <HUD
        snapshot={snapshot}
        killfeed={killfeed}
        onSelectWeapon={handleSelectWeapon}
        onTakeoverBot={handleTakeover}
        onTogglePistolRound={handleTogglePistolRound}
        onResetRound={startNewRound}
        onActionPress={() => { isActionKeyHeldRef.current = true; }}
        onActionRelease={() => { isActionKeyHeldRef.current = false; }}
      />
    </div>
  );
};

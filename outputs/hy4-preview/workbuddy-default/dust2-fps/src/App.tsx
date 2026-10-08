/**
 * React shell: owns the engine + renderer lifecycles, runs the fixed-step
 * simulation loop and pushes throttled snapshots into the HUD.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameEngine, makeInput, type Snapshot } from './game/game';
import { InputController } from './game/input';
import { audio } from './game/audio';
import { SceneManager } from './render/renderer';
import { HUD } from './ui/HUD';
import { StartScreen, type LoadoutPrefs } from './ui/StartScreen';
import type { Team } from './game/types';
import type { WeaponId } from './game/weapons';

const FIXED_STEP = 1 / 60;
const MAX_STEPS = 5;
const SNAPSHOT_MS = 55;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const sceneRef = useRef<SceneManager | null>(null);
  const inputRef = useRef<InputController | null>(null);
  const rafRef = useRef(0);

  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [paused, setPausedState] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [scoreboard, setScoreboard] = useState(false);
  const [team, setTeam] = useState<Team>('CT');
  const [prefs, setPrefs] = useState<LoadoutPrefs>({ primary: 'ak47', secondary: 'deagle' });
  const [lockHint, setLockHint] = useState(false);

  const pausedRef = useRef(false);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const screenRef = useRef(screen);
  screenRef.current = screen;

  const setPaused = useCallback((p: boolean) => {
    pausedRef.current = p;
    setPausedState(p);
  }, []);

  // ------------------------------------------------------------------ loop
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const lastSnapRef = useRef(0);
  const lastRoundRef = useRef(0);

  const frame = useCallback(() => {
    rafRef.current = requestAnimationFrame(frame);
    const engine = engineRef.current;
    const scene = sceneRef.current;
    const controller = inputRef.current;
    if (!engine || !scene || !controller) return;

    const now = performance.now();
    let dt = (now - lastRef.current) / 1000;
    lastRef.current = now;
    if (!isFinite(dt) || dt < 0) dt = 0;
    if (dt > 0.25) dt = 0.25;

    controller.poll();

    if (!pausedRef.current) {
      accRef.current += dt;
      let steps = 0;
      while (accRef.current >= FIXED_STEP && steps < MAX_STEPS) {
        engine.step(FIXED_STEP, controller.state);
        accRef.current -= FIXED_STEP;
        steps++;
      }
      if (steps >= MAX_STEPS) accRef.current = 0;
    } else {
      accRef.current = 0;
    }

    scene.update(engine, dt, !engine.spectating);
    scene.render();

    // new round? re-apply the player's chosen long-round loadout
    if (engine.round.number !== lastRoundRef.current) {
      lastRoundRef.current = engine.round.number;
      const p = prefsRef.current;
      if (!engine.round.isPistol) engine.setPlayerWeapons(p.primary, p.secondary);
    }

    if (now - lastSnapRef.current >= SNAPSHOT_MS) {
      lastSnapRef.current = now;
      const s = engine.snapshot();
      // mark which enemies the camera owner currently sees (radar fog of war)
      const cam = engine.cameraCombatant();
      if (cam) {
        for (const c of engine.combatants) {
          const p = s.players.find((x) => x.id === c.id);
          c.__spotted = c.alive && c.team !== cam.team && !!p?.screen?.visible;
        }
      }
      setSnap(s);
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  // ------------------------------------------------------------- lifecycle
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audio.ensure();
    stopLoop();

    const engine = new GameEngine(team);
    const state = makeInput();
    const controller = new InputController(state, {
      onLockChange: (locked) => {
        if (!locked && screenRef.current === 'game') {
          setPaused(true);
          setLockHint(true);
        } else if (locked) {
          setPaused(false);
          setLockHint(false);
        }
      },
    });
    controller.attach(canvas);
    const scene = new SceneManager(canvas, engine);

    engineRef.current = engine;
    inputRef.current = controller;
    sceneRef.current = scene;
    if (import.meta.env.DEV) {
      (window as unknown as {
        __game?: { engine: GameEngine; scene: SceneManager; input: InputController };
      }).__game = { engine, scene, input: controller };
    }
    lastRoundRef.current = engine.round.number;
    accRef.current = 0;
    lastRef.current = performance.now();
    lastSnapRef.current = 0;

    if (!engine.round.isPistol) engine.setPlayerWeapons(prefsRef.current.primary, prefsRef.current.secondary);

    setScreen('game');
    setPaused(false);
    setSnap(engine.snapshot());
    controller.requestLock();
    rafRef.current = requestAnimationFrame(frame);
  }, [frame, setPaused, stopLoop, team]);

  const quitToMenu = useCallback(() => {
    stopLoop();
    inputRef.current?.releaseLock();
    inputRef.current?.detach();
    sceneRef.current?.dispose();
    sceneRef.current = null;
    engineRef.current = null;
    inputRef.current = null;
    setScreen('menu');
    setSnap(null);
    setPaused(true);
  }, [setPaused, stopLoop]);

  useEffect(() => () => {
    stopLoop();
    inputRef.current?.detach();
    sceneRef.current?.dispose();
  }, [stopLoop]);

  // ------------------------------------------------------------- shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (screenRef.current !== 'game') return;
      if (e.code === 'Tab') {
        e.preventDefault();
        setScoreboard((s) => !s);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Tab') setScoreboard(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // ---------------------------------------------------------------- render
  const engine = engineRef.current;

  return (
    <div className="game-root">
      <canvas ref={canvasRef} />

      {screen === 'game' && snap && engine && (
        <HUD
          snap={snap}
          grid={engine.grid}
          combatants={engine.combatants}
          bomb={engine.bomb}
          cameraId={engine.cameraCombatant()?.id ?? null}
          cameraYaw={engine.cameraCombatant()?.yaw ?? 0}
          scoreboardOpen={scoreboard}
        />
      )}

      {screen === 'menu' && (
        <StartScreen
          team={team}
          prefs={prefs}
          onTeam={setTeam}
          onPrefs={setPrefs}
          onStart={startGame}
        />
      )}

      {screen === 'game' && paused && engine && (
        <div className="pause">
          <div className="start-card" style={{ width: 'min(560px, 92vw)' }}>
            <h1 style={{ fontSize: 24 }}>已暂停</h1>
            <div className="sub">
              {lockHint ? '指针锁定已释放，点击下方按钮回到战场。' : '喘口气。'}
            </div>
            <div className="section">
              <div className="label">长枪局武器偏好（下一回合生效）</div>
              <div className="choice-row">
                {(['ak47', 'm4a4', 'awp'] as WeaponId[]).map((w) => (
                  <button
                    key={w}
                    className={`choice${prefs.primary === w ? ' active' : ''}`}
                    onClick={() => {
                      const next = { ...prefs, primary: w };
                      setPrefs(next);
                      prefsRef.current = next;
                      if (!engine.round.isPistol) engine.setPlayerWeapons(w, next.secondary);
                    }}
                  >
                    <span className="n">{w.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="start-btn"
              onClick={() => {
                inputRef.current?.requestLock();
                setPaused(false);
              }}
            >
              继续战斗
            </button>
            <button
              className="choice"
              style={{ width: '100%', marginTop: 10, textAlign: 'center' }}
              onClick={quitToMenu}
            >
              <span className="n">返回主菜单</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

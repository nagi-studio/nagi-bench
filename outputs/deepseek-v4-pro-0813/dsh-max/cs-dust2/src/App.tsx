// 应用外壳：菜单、输入、主循环、音效事件、HUD 挂载
import { useCallback, useEffect, useRef, useState } from 'react';
import { SoundManager } from './game/audio';
import { Team } from './game/config';
import { EffectEvent, Game, HudState } from './game/engine';
import { Renderer } from './game/render';
import { Hud } from './ui/Hud';
import { Menu } from './ui/Menu';

const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyR', 'Digit1', 'Digit2', 'Digit3', 'Digit4']);

function playEvent(a: SoundManager | null, ev: EffectEvent): void {
  if (!a) return;
  switch (ev.type) {
    case 'shot': a.shot(ev.weapon ?? 'usp', ev.x ?? 0, ev.y ?? 0, ev.z ?? 0); break;
    case 'reload': if (ev.reload && ev.reload !== 'none') a.reload(ev.reload); break;
    case 'footstep': a.footstep(ev.x ?? 0, ev.y ?? 0, ev.z ?? 0, !!ev.run); break;
    case 'scope': a.scope(!!ev.on); break;
    case 'hitmarker': a.hit(!!ev.headshot); break;
    case 'kill': a.kill(); break;
    case 'plantTick': a.plantTick(); break;
    case 'plantDone': a.plantDone(); break;
    case 'defuseTick': a.defuseTick(); break;
    case 'defused': a.defused(); break;
    case 'explosion': a.explode(ev.x ?? 0, ev.y ?? 0, ev.z ?? 0); break;
    case 'roundStart': a.roundStart(); break;
    case 'roundEnd': a.roundEnd(!!ev.win); break;
    case 'pickup': a.pickup(); break;
    case 'switch': a.switchW(); break;
    case 'door': a.door(); break;
    case 'hurt': a.hurt(); break;
    case 'bombBeep': a.beep(); break;
    default: break;
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const audioRef = useRef<SoundManager | null>(null);
  const hudRef = useRef<HudState | null>(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [hud, setHud] = useState<HudState | null>(null);
  const [paused, setPaused] = useState(false);

  const start = useCallback((team: Team, primary: 'rifle' | 'awp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new Game({ team, primary });
    const audio = audioRef.current ?? new SoundManager();
    audio.init();
    game.audio = audio;
    audioRef.current = audio;
    const renderer = rendererRef.current;
    if (renderer) renderer.reset(game);
    else rendererRef.current = new Renderer(canvas, game);
    gameRef.current = game;
    game.startMatch();
    hudRef.current = game.hud;
    setHud(game.hud);
    setStarted(true);
    startedRef.current = true;
    setPaused(false);
    canvas.requestPointerLock();
  }, []);

  // 主循环
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const game = gameRef.current;
      const dt = Math.min(0.05, (t - last) / 1000) || 1 / 60;
      last = t;
      if (game) {
        game.update(dt);
        const events = game.drainEvents();
        const a = audioRef.current;
        const view = game.viewCombatant();
        if (a && view) a.setListener(view.pos.x, view.pos.y + 1.62, view.pos.z, view.yaw, view.pitch);
        for (const ev of events) playEvent(a, ev);
        rendererRef.current?.frame(dt, game.hud, events);
        hudRef.current = game.hud;
        setHud(game.hud);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  // 输入
  useEffect(() => {
    if (!started) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (MOVE_KEYS.has(e.code)) {
        game.input.keys.add(e.code);
        if (e.code === 'Space') e.preventDefault();
      }
      if (e.code === 'KeyE') {
        game.input.interact = true;
        game.input.interactPressed = true;
      }
      if (e.code === 'KeyF') game.input.takePressed = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      game.input.keys.delete(e.code);
      if (e.code === 'KeyE') game.input.interact = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      const game = gameRef.current;
      if (!game) return;
      game.input.mx += e.movementX;
      game.input.my += e.movementY;
    };
    const onMouseDown = (e: MouseEvent) => {
      const game = gameRef.current;
      if (!game || document.pointerLockElement !== canvasRef.current) return;
      if (e.button === 0) {
        if (hudRef.current?.dead) game.cycleSpectate();
        else {
          game.input.lmb = true;
          game.input.lmbPressed = true;
        }
      } else if (e.button === 2) {
        game.input.rmb = true;
        game.input.rmbPressed = true;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (e.button === 0) game.input.lmb = false;
      if (e.button === 2) game.input.rmb = false;
    };
    const onWheel = (e: WheelEvent) => {
      const game = gameRef.current;
      if (!game) return;
      game.input.wheel += e.deltaY > 0 ? 1 : -1;
    };
    const onCtx = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel);
    window.addEventListener('contextmenu', onCtx);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('contextmenu', onCtx);
    };
  }, [started]);

  // 指针锁定变化
  useEffect(() => {
    const onLock = () => {
      const game = gameRef.current;
      const locked = document.pointerLockElement === canvasRef.current;
      if (!locked && game && game.phase !== 'matchEnd' && game.phase !== 'menu') setPaused(true);
      else setPaused(false);
    };
    const onResize = () => {
      rendererRef.current?.resize(window.innerWidth, window.innerHeight);
    };
    document.addEventListener('pointerlockchange', onLock);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerlockchange', onLock);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const matchEnd = hud?.matchEnd ?? null;
  const showMenu = !started || matchEnd !== null;

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', background: '#9fc4de' }}
        onClick={() => {
          if (startedRef.current && paused && !matchEnd) canvasRef.current?.requestPointerLock();
        }}
      />
      {started && hud && !showMenu && <Hud hud={hud} onCycleSpec={() => gameRef.current?.cycleSpectate()} onTakeover={() => { if (gameRef.current) gameRef.current.input.takePressed = true; }} />}
      {showMenu && <Menu onStart={start} matchEnd={matchEnd} />}
      {started && paused && !showMenu && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 25, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          fontFamily: 'system-ui, sans-serif', cursor: 'pointer',
        }} onClick={() => canvasRef.current?.requestPointerLock()}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>游戏已暂停</div>
            <div style={{ opacity: 0.8 }}>点击继续（重新锁定鼠标）</div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { GameWorld } from '../engine/world';
import { Team } from '../engine/types';
import { Hud } from './Hud';
import { Minimap } from './Minimap';

export function GameCanvas({ team }: { team: Team }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<GameWorld | null>(null);
  const [locked, setLocked] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const container = mountRef.current!;
    const world = new GameWorld(container, team);
    worldRef.current = world;
    if (miniRef.current) world.setMinimapCanvas(miniRef.current);

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      world.update(dt);
      world.input.endFrame();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => world.resize();
    window.addEventListener('resize', onResize);

    const onLockChange = () => setLocked(document.pointerLockElement === world.renderer.domElement);
    document.addEventListener('pointerlockchange', onLockChange);

    const onClick = () => {
      world.start();
      setStarted(true);
      world.input.requestLock();
    };
    container.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointerlockchange', onLockChange);
      container.removeEventListener('click', onClick);
      world.dispose();
      worldRef.current = null;
    };
  }, [team]);

  return (
    <div className="game-root" ref={mountRef}>
      <Hud />
      <Minimap canvasRef={miniRef} />
      {!locked && (
        <div className="click-overlay">
          <div className="click-inner">
            <div className="click-title">{started ? 'Paused' : 'Ready'}</div>
            <div className="click-hint">Click to {started ? 'resume' : 'lock mouse and start'}</div>
            <div className="click-sub">Esc releases the mouse</div>
          </div>
        </div>
      )}
    </div>
  );
}

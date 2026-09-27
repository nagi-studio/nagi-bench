import { useEffect, useRef, useState } from 'react';
import { GameClient } from '../client/gameClient.ts';
import type { ClientOptions } from '../client/gameClient.ts';
import { Hud } from './Hud.tsx';

interface Props {
  opts: ClientOptions;
  onExit: () => void;
}

/** Mounts the imperative GameClient (three.js + simulation) and layers the React HUD on top. */
export function GameView({ opts, onExit }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<GameClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!host.current) return;
    let c: GameClient | null = null;
    try {
      c = new GameClient(host.current, { ...opts });
      setClient(c);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    }
    return () => {
      c?.dispose();
      setClient(null);
    };
    // the options are fixed for the lifetime of a session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="game-root">
      <div ref={host} className="canvas-host" onMouseDown={() => client?.requestLock()} />
      {client && <Hud client={client} onExit={onExit} />}
      {error && (
        <div className="overlay">
          <div className="panel">
            <h2>无法启动 WebGL</h2>
            <p>{error}</p>
            <button onClick={onExit}>返回</button>
          </div>
        </div>
      )}
    </div>
  );
}

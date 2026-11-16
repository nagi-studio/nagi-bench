import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { GameEngine } from '../game/engine';

export default function Minimap({ engine }: { engine: GameEngine | null }): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    engine?.attachMinimap(ref.current);
    return () => engine?.attachMinimap(null);
  }, [engine]);
  return <canvas ref={ref} width={220} height={250} className="minimap" />;
}

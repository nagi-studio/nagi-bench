import { RefObject } from 'react';

export function Minimap({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  return (
    <div className="minimap">
      <canvas ref={canvasRef as RefObject<HTMLCanvasElement>} width={200} height={200} />
      <div className="minimap-label">DUST II</div>
    </div>
  );
}

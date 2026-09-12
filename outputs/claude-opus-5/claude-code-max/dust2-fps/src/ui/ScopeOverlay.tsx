import type { ReactNode } from 'react';
import type { HudSnapshot } from './store.ts';

/**
 * 2D sniper scope mask drawn over the (already zoomed) 3D view: black shoulders, a circular
 * lens, a fine cross reticle and mil ticks. Only shown while an AWP is scoped.
 */
export function ScopeOverlay({ snap }: { snap: HudSnapshot }) {
  if (snap.scopeLevel <= 0) return null;

  const ticks: ReactNode[] = [];
  for (let i = 1; i <= 6; i++) {
    const offset = i * 3.2;
    ticks.push(
      <div key={`v${i}`} className="scope-tick scope-tick-v" style={{ top: `${50 + offset}%` }} />,
      <div key={`v-${i}`} className="scope-tick scope-tick-v" style={{ top: `${50 - offset}%` }} />,
      <div key={`h${i}`} className="scope-tick scope-tick-h" style={{ left: `${50 + offset}%` }} />,
      <div key={`h-${i}`} className="scope-tick scope-tick-h" style={{ left: `${50 - offset}%` }} />,
    );
  }

  return (
    <div className="scope" aria-hidden="true">
      <div className="scope-mask" />
      <div className="scope-lens" />
      <div className="scope-line scope-line-h" />
      <div className="scope-line scope-line-v" />
      {ticks}
      <div className="scope-zoom">{snap.scopeLevel === 1 ? '2×' : '4×'}</div>
    </div>
  );
}

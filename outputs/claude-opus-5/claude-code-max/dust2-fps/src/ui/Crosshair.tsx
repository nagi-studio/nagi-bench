import type { HudSnapshot } from './store.ts';

/**
 * Dynamic crosshair. The gap tracks the weapon's real inaccuracy cone, so it visibly
 * blooms while spraying, running or jumping and tightens again when you stop.
 */
export function Crosshair({ snap }: { snap: HudSnapshot }) {
  if (snap.scopeLevel > 0) {
    return <div className="crosshair-dot" />;
  }

  const gap = 3 + snap.spread * 34;
  const length = snap.weaponId === 'knife' ? 5 : 8;
  const thickness = 2;
  const color = snap.hitMarker > 0 ? '#ff5a5a' : '#39ff7a';

  const arm = (transform: string) => ({
    transform,
    width: `${thickness}px`,
    height: `${length}px`,
    background: color,
    boxShadow: '0 0 2px rgba(0,0,0,0.9)',
  });

  return (
    <div className="crosshair" aria-hidden="true">
      <div className="crosshair-arm" style={arm(`translate(-50%, -50%) translateY(${-gap - length / 2}px)`)} />
      <div className="crosshair-arm" style={arm(`translate(-50%, -50%) translateY(${gap + length / 2}px)`)} />
      <div
        className="crosshair-arm"
        style={{
          ...arm(`translate(-50%, -50%) translateX(${-gap - length / 2}px) rotate(90deg)`),
        }}
      />
      <div
        className="crosshair-arm"
        style={{
          ...arm(`translate(-50%, -50%) translateX(${gap + length / 2}px) rotate(90deg)`),
        }}
      />
      {snap.hitMarker > 0 && (
        <div
          className={`hitmarker ${snap.hitMarkerHead ? 'hitmarker-head' : ''}`}
          style={{ opacity: snap.hitMarker }}
        >
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}

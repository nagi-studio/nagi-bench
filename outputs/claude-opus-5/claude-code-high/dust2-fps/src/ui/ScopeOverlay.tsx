/**
 * 2D AWP scope: black vignette with a clear circle, cross hairs and range
 * ticks. Drawn on top of the zoomed 3D view (the camera FOV drops to 26°).
 */
export function ScopeOverlay(): JSX.Element {
  const ticks = [-3, -2, -1, 1, 2, 3];
  return (
    <div className="scope">
      <div className="mask" />
      <div className="ring" />
      <div className="lineh" />
      <div className="linev" />
      {ticks.map((t) => (
        <div
          key={`h${t}`}
          className="tick"
          style={{ transform: `translateX(${t * 34}px)`, top: 'calc(50% - 0.75px)' }}
        />
      ))}
      {ticks.map((t) => (
        <div
          key={`v${t}`}
          className="tick"
          style={{
            transform: `translateY(${t * 34}px) rotate(90deg)`,
            left: 'calc(50% - 5px)',
          }}
        />
      ))}
    </div>
  );
}

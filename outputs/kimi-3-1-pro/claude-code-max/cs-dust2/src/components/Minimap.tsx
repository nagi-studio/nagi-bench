import { memo } from 'react';
import type { EngineSnapshot, MapLayout } from '../game/types';

interface MinimapProps {
  layout: MapLayout;
  snapshot: EngineSnapshot;
}

export const Minimap = memo(function Minimap({ layout, snapshot }: MinimapProps) {
  const { bounds } = layout;
  return (
    <section className="minimap-panel" aria-label="Dust2 tactical minimap">
      <div className="minimap-heading">
        <span><i className="status-dot" /> DUST2</span>
        <span>TACTICAL</span>
      </div>
      <svg
        className="minimap"
        viewBox={`${bounds.minX} ${bounds.minZ} ${bounds.maxX - bounds.minX} ${bounds.maxZ - bounds.minZ}`}
        role="img"
        aria-label="自己、队友、可见敌人和 C4 的实时位置"
      >
        <rect x={bounds.minX} y={bounds.minZ} width={bounds.maxX - bounds.minX} height={bounds.maxZ - bounds.minZ} className="map-ground" />
        {layout.zones.filter((zone) => zone.id === 'A' || zone.id === 'B').map((zone) => (
          <rect
            key={zone.id} x={zone.minX} y={zone.minZ} width={zone.maxX - zone.minX} height={zone.maxZ - zone.minZ}
            className={`site-zone site-${zone.id.toLowerCase()}`}
          />
        ))}
        {layout.boxes.map((box, index) => (
          <rect
            key={`${index}-${box.x}-${box.z}`}
            x={box.x - box.w / 2} y={box.z - box.d / 2} width={box.w} height={box.d}
            className={`map-box map-${box.kind}`}
          />
        ))}
        <line x1="-2" y1="-4" x2="2" y2="-4" className="map-door" />
        <g className="map-labels">
          <text x="27" y="-25">A</text>
          <text x="-27" y="-25">B</text>
          <text x="0" y="41">T SPAWN</text>
          <text x="0" y="-40">CT SPAWN</text>
          <text x="30" y="12" transform="rotate(90 30 12)">A LONG</text>
          <text x="-28" y="11" transform="rotate(90 -28 11)">B TUNNELS</text>
          <text x="0" y="13" transform="rotate(90 0 13)">MID</text>
          <text x="16" y="-11">CATWALK</text>
        </g>
        {snapshot.actors.filter((actor) => actor.visible && (actor.alive || actor.team === snapshot.player.team)).map((actor) => {
          const isEnemy = actor.team !== snapshot.player.team;
          const angle = -actor.yaw * 180 / Math.PI;
          return (
            <g
              key={actor.id}
              transform={`translate(${actor.x} ${actor.z}) rotate(${angle})`}
              className={`map-actor ${actor.controlled ? 'map-self' : ''} ${isEnemy ? 'map-enemy' : actor.team === 'CT' ? 'map-ct' : 'map-t'} ${!actor.alive ? 'map-dead' : ''}`}
            >
              {actor.alive && <path d="M 0 -3.4 L -1.4 -0.5 L 1.4 -0.5 Z" className="view-cone" />}
              {actor.alive ? (
                <>
                  <circle r={actor.controlled ? 1.35 : 1.05} className="actor-ring" />
                  <circle r={actor.controlled ? 0.75 : 0.58} className="actor-core" />
                </>
              ) : <path d="M-0.8-0.8L0.8 0.8M0.8-0.8L-0.8 0.8" className="dead-cross" />}
            </g>
          );
        })}
        {snapshot.bomb.visible && snapshot.bomb.status !== 'exploded' && snapshot.bomb.status !== 'defused' && (
          <g transform={`translate(${snapshot.bomb.x} ${snapshot.bomb.z})`} className={`map-bomb ${snapshot.bomb.status === 'planted' ? 'is-planted' : ''}`}>
            <rect x="-1.25" y="-1.25" width="2.5" height="2.5" transform="rotate(45)" />
            <circle r="0.45" />
          </g>
        )}
      </svg>
      <div className="minimap-footer">
        <span><i className="legend-self" /> YOU</span>
        <span><i className="legend-enemy" /> CONTACT</span>
        <span><i className="legend-bomb" /> C4</span>
      </div>
    </section>
  );
});

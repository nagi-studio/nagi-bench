import React from 'react';

export const SniperScope: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {/* Dark Vignette Mask (Black outside circular lens) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id="scopeMask">
            {/* White covers everywhere */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black circle in center punches transparent hole */}
            <circle cx="50%" cy="50%" r="38vmin" fill="black" />
          </mask>
        </defs>
        {/* Pitch black mask rectangle */}
        <rect
          width="100%"
          height="100%"
          fill="#05070a"
          mask="url(#scopeMask)"
        />
      </svg>

      {/* Scope Inner Optical Border */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '76vmin',
          height: '76vmin',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '4px solid rgba(15, 20, 25, 0.95)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
        }}
      />

      {/* Crosshair Horizontal Line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 'calc(50% - 38vmin)',
          width: '76vmin',
          height: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Crosshair Vertical Line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% - 38vmin)',
          height: '76vmin',
          width: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Mil-dot markings */}
      {[-120, -80, -40, 40, 80, 120].map((offset) => (
        <React.Fragment key={offset}>
          {/* Horizontal ticks */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(50% - 3px)',
              left: `calc(50% + ${offset}px)`,
              width: '1px',
              height: '7px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }}
          />
          {/* Vertical ticks */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% - 3px)',
              top: `calc(50% + ${offset}px)`,
              width: '7px',
              height: '1px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }}
          />
        </React.Fragment>
      ))}

      {/* Center Precision Dot */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '4px',
          backgroundColor: '#ef4444',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

import React from 'react';

interface ScopeOverlayProps {
  isScoped: boolean;
}

export const ScopeOverlay: React.FC<ScopeOverlayProps> = ({ isScoped }) => {
  if (!isScoped) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none flex items-center justify-center">
      {/* Outer Black Mask with Circular Opening */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 38vmin, black 40vmin)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 38vmin, black 40vmin)',
        }}
      />

      {/* Scope Inner Lens Circle */}
      <div className="relative w-[76vmin] h-[76vmin] rounded-full border border-black/80 flex items-center justify-center overflow-hidden">
        {/* Scope Vignette / Dirt effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] rounded-full" />

        {/* Reticle Lines */}
        {/* Full Horizontal Line */}
        <div className="absolute w-full h-[1px] bg-black/90 shadow-[0_0_1px_black]" />
        {/* Full Vertical Line */}
        <div className="absolute h-full w-[1px] bg-black/90 shadow-[0_0_1px_black]" />

        {/* Center Green Target Dot */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />

        {/* Range Hash Marks (Horizontal) */}
        {[-80, -50, -25, 25, 50, 80].map((offset) => (
          <div
            key={offset}
            className="absolute h-3 w-[1px] bg-black/80"
            style={{ transform: `translateX(${offset}px)` }}
          />
        ))}

        {/* Range Hash Marks (Vertical) */}
        {[-80, -50, -25, 25, 50, 80].map((offset) => (
          <div
            key={offset}
            className="absolute w-3 h-[1px] bg-black/80"
            style={{ transform: `translateY(${offset}px)` }}
          />
        ))}
      </div>
    </div>
  );
};

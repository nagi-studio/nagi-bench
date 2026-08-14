import React from 'react';
import { WeaponId } from '../types/game';

interface CrosshairProps {
  weaponId: WeaponId;
  isScoped: boolean;
  isCrouching: boolean;
  speed: number;
}

export const Crosshair: React.FC<CrosshairProps> = ({
  weaponId,
  isScoped,
  isCrouching,
  speed,
}) => {
  // If scoped with AWP, standard crosshair is hidden (ScopeOverlay will render)
  if (isScoped && weaponId === 'awp') return null;

  // Dynamic spread gap calculation
  const baseGap = 5;
  const moveSpread = Math.min(18, speed * 2.5);
  const crouchReduction = isCrouching ? -2 : 0;
  const gap = Math.max(3, baseGap + moveSpread + crouchReduction);

  const length = 9;
  const thickness = 2;
  const color = '#22c55e'; // classic CS bright green

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center select-none">
      <div className="relative w-0 h-0 flex items-center justify-center">
        {/* Center tiny dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            backgroundColor: color,
            boxShadow: '0 0 1px black',
          }}
        />

        {/* Top bar */}
        <div
          className="absolute"
          style={{
            width: thickness,
            height: length,
            backgroundColor: color,
            top: -(gap + length),
            left: -thickness / 2,
            boxShadow: '0 0 1px black',
          }}
        />

        {/* Bottom bar */}
        <div
          className="absolute"
          style={{
            width: thickness,
            height: length,
            backgroundColor: color,
            top: gap,
            left: -thickness / 2,
            boxShadow: '0 0 1px black',
          }}
        />

        {/* Left bar */}
        <div
          className="absolute"
          style={{
            width: length,
            height: thickness,
            backgroundColor: color,
            left: -(gap + length),
            top: -thickness / 2,
            boxShadow: '0 0 1px black',
          }}
        />

        {/* Right bar */}
        <div
          className="absolute"
          style={{
            width: length,
            height: thickness,
            backgroundColor: color,
            left: gap,
            top: -thickness / 2,
            boxShadow: '0 0 1px black',
          }}
        />
      </div>
    </div>
  );
};

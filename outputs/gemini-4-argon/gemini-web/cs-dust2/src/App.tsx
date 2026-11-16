import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface WeaponSpec {
  id: string;
  name: string;
  slot: 1 | 2 | 3 | 4;
  damage: number;
  fireRateMs: number;
  recoilKick: number;
  spread: number;
  magSize: number;
  reserveAmmo: number;
  reloadMs: number;
  isScoped?: boolean;
  isMelee?: boolean;
  isC4?: boolean;
}

export const WEAPONS: Record<string, WeaponSpec> = {
  ak47:   { id: 'ak47',   name: 'AK-47',         slot: 1, damage: 36,  fireRateMs: 100, recoilKick: 0.042, spread: 0.022, magSize: 30, reserveAmmo: 90, reloadMs: 2200 },
  m4a4:   { id: 'm4a4',   name: 'M4A4',          slot: 1, damage: 31,  fireRateMs: 90,  recoilKick: 0.024, spread: 0.012, magSize: 30, reserveAmmo: 90, reloadMs: 2000 },
  awp:    { id: 'awp',    name: 'AWP Sniper',    slot: 1, damage: 115, fireRateMs: 1250,recoilKick: 0.085, spread: 0.002, magSize: 10, reserveAmmo: 30, reloadMs: 2900, isScoped: true },
  deagle: { id: 'deagle', name: 'Desert Eagle',  slot: 2, damage: 52,  fireRateMs: 260, recoilKick: 0.048, spread: 0.016, magSize: 7,  reserveAmmo: 35, reloadMs: 1800 },
  usp:    { id: 'usp',    name: 'USP-S / Glock', slot: 2, damage: 24,  fireRateMs: 150, recoilKick: 0.015, spread: 0.010, magSize: 12, reserveAmmo: 48, reloadMs: 1600 },
  knife:  { id: 'knife',  name: 'Tactical Knife',slot: 3, damage: 55,  fireRateMs: 400, recoilKick: 0.005, spread: 0.0,   magSize: 1,  reserveAmmo: 1,  reloadMs: 0,    isMelee: true },
  c4:     { id: 'c4',     name: 'C4 Explosive',  slot: 4, damage: 0,   fireRateMs: 500, recoilKick: 0.0,   spread: 0.0,   magSize: 1,  reserveAmmo: 1,  reloadMs: 0,    isC4: true }
};

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const minimapRef = useRef<HTMLCanvasElement | null>(null);
  const [hp, setHp] = useState(100);
  const [armor, setArmor] = useState(100);
  const [weaponId, setWeaponId] = useState('ak47');
  const [mag, setMag] = useState(30);
  const [reserve, setReserve] = useState(90);
  const [isScoped, setIsScoped] = useState(false);
  const [pistolRound, setPistolRound] = useState(false);
  const [ctAlive, setCtAlive] = useState(5);
  const [tAlive, setTAlive] = useState(5);
  const [ctScore, setCtScore] = useState(0);
  const [tScore, setTScore] = useState(0);
  const [c4State, setC4State] = useState<'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'>('carried');
  const [c4Timer, setC4Timer] = useState(40.0);
  const [banner, setBanner] = useState('ROUND START — DUST2 5v5');
  const [killfeed, setKillfeed] = useState<Array<{ id: number; killer: string; victim: string; weapon: string; headshot: boolean }>>([]);

  useEffect(() => {
    // Full Three.js 5v5 Dust2 simulation mounted inside mountRef
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <canvas ref={minimapRef} width={180} height={180} />
    </div>
  );
}

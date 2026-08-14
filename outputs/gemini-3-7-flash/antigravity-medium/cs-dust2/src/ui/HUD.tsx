import React from 'react';
import { CharacterState, RoundState, KillFeedEntry } from '../types/game';
import { Minimap } from './Minimap';
import { Killfeed } from './Killfeed';
import { Crosshair } from './Crosshair';
import { ScopeOverlay } from './ScopeOverlay';
import { WEAPON_CONFIGS } from '../weapons/WeaponConfig';

interface HUDProps {
  player: CharacterState;
  round: RoundState;
  allEntities: CharacterState[];
  spectatingEntity: CharacterState | null;
  isSpectating: boolean;
  killfeed: KillFeedEntry[];
  damageFlash: boolean;
  plantProgress: number;
  defuseProgress: number;
  onOpenBuyMenu: () => void;
  onOpenControls: () => void;
  onTakeOverBot: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  round,
  allEntities,
  spectatingEntity,
  isSpectating,
  killfeed,
  damageFlash,
  plantProgress,
  defuseProgress,
  onOpenBuyMenu,
  onOpenControls,
  onTakeOverBot,
}) => {
  const currentWeapon = WEAPON_CONFIGS[player.currentWeapon];
  const ammo = player.inventory.ammo[player.currentWeapon];

  const ctEntities = allEntities.filter((e) => e.team === 'CT');
  const tEntities = allEntities.filter((e) => e.team === 'T');

  const ctAliveCount = ctEntities.filter((e) => e.isAlive).length;
  const tAliveCount = tEntities.filter((e) => e.isAlive).length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 select-none flex flex-col justify-between p-6">
      {/* Scope Overlay */}
      <ScopeOverlay isScoped={player.isScoped} />

      {/* Crosshair */}
      <Crosshair
        weaponId={player.currentWeapon}
        isScoped={player.isScoped}
        isCrouching={player.isCrouching}
        speed={THREE_Vector2Length(player.velocity.x, player.velocity.z)}
      />

      {/* Damage Flash Red Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-150 ${
          damageFlash ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          boxShadow: 'inset 0 0 100px rgba(220, 38, 38, 0.65)',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
        }}
      />

      {/* Killfeed (Top Right) */}
      <Killfeed entries={killfeed} />

      {/* Top Header: Team Avatars, Score, Round Timer */}
      <div className="flex items-start justify-between">
        {/* Top Left: Minimap */}
        <Minimap player={player} allEntities={allEntities} round={round} />

        {/* Center: Match Status Bar */}
        <div className="flex items-center gap-4 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
          {/* CT Avatars */}
          <div className="flex items-center gap-1.5">
            {ctEntities.map((e) => (
              <div
                key={e.id}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-bold ${
                  e.isAlive
                    ? 'bg-sky-950 border-sky-400/60 text-sky-200'
                    : 'bg-black/60 border-white/5 text-slate-600 opacity-40'
                }`}
                title={`${e.name} (${e.isAlive ? `${e.health} HP` : 'Dead'})`}
              >
                {e.isPlayer ? '★' : 'CT'}
              </div>
            ))}
          </div>

          {/* Score & Timer Display */}
          <div className="flex items-center gap-4 px-4 border-x border-white/10">
            <span className="text-2xl font-black text-sky-400 font-['Chakra_Petch']">
              {round.scoreCT}
            </span>

            <div className="flex flex-col items-center min-w-[70px]">
              {round.status === 'bomb_planted' ? (
                <div className="flex items-center gap-1 text-red-500 font-mono font-black animate-pulse">
                  <span className="text-sm">💣</span>
                  <span className="text-lg">{round.bombState.timer.toFixed(1)}s</span>
                </div>
              ) : (
                <span className="text-lg font-mono font-bold text-slate-100">
                  {formatTime(round.timer)}
                </span>
              )}
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                {round.status === 'freezetime'
                  ? 'FREEZETIME'
                  : round.status === 'bomb_planted'
                  ? 'PLANTED'
                  : `ROUND ${round.roundNumber}`}
              </span>
            </div>

            <span className="text-2xl font-black text-amber-400 font-['Chakra_Petch']">
              {round.scoreT}
            </span>
          </div>

          {/* T Avatars */}
          <div className="flex items-center gap-1.5">
            {tEntities.map((e) => (
              <div
                key={e.id}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-bold ${
                  e.isAlive
                    ? 'bg-amber-950 border-amber-400/60 text-amber-200'
                    : 'bg-black/60 border-white/5 text-slate-600 opacity-40'
                }`}
                title={`${e.name} (${e.isAlive ? `${e.health} HP` : 'Dead'})`}
              >
                {e.inventory.c4 ? '💣' : 'T'}
              </div>
            ))}
          </div>
        </div>

        {/* Top Right: Buttons for Buy & Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onOpenBuyMenu}
            className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md"
          >
            ARSENAL [B]
          </button>
          <button
            onClick={onOpenControls}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md"
          >
            CONTROLS [?]
          </button>
        </div>
      </div>

      {/* Middle Alerts & Progress Bars */}
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Plant Progress */}
        {plantProgress > 0 && (
          <div className="flex flex-col items-center gap-1 bg-black/80 px-6 py-3 rounded-2xl border border-red-500/40 backdrop-blur-md">
            <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
              PLANTING C4 EXPLOSIVE...
            </span>
            <div className="w-48 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-75"
                style={{ width: `${plantProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Defuse Progress */}
        {defuseProgress > 0 && (
          <div className="flex flex-col items-center gap-1 bg-black/80 px-6 py-3 rounded-2xl border border-sky-500/40 backdrop-blur-md">
            <span className="text-xs font-mono font-bold text-sky-400 tracking-wider">
              DEFUSING C4 BOMB...
            </span>
            <div className="w-48 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-75"
                style={{ width: `${defuseProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Round End Announcement */}
        {round.status === 'round_end' && (
          <div className="bg-black/90 px-10 py-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-1.5 animate-bounce-short backdrop-blur-lg">
            <h2
              className={`text-3xl font-black font-['Chakra_Petch'] uppercase tracking-widest ${
                round.winner === 'CT' ? 'text-sky-400' : 'text-amber-400'
              }`}
            >
              {round.winner === 'CT' ? 'COUNTER-TERRORISTS WIN' : 'TERRORISTS WIN'}
            </h2>
            <p className="text-sm font-mono text-slate-300">{round.winReason}</p>
          </div>
        )}

        {/* Spectator / Takeover Bot Banner */}
        {isSpectating && (
          <div className="flex flex-col items-center gap-2 bg-[#0b1329]/95 px-8 py-4 rounded-2xl border border-sky-400/40 shadow-2xl backdrop-blur-lg pointer-events-auto">
            <div className="text-xs font-mono text-slate-400">
              SPECTATING TEAMMATE:{' '}
              <span className="text-sky-300 font-bold">{spectatingEntity?.name || 'Teammate'}</span>
            </div>
            <button
              onClick={onTakeOverBot}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-mono font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              PRESS [E] OR CLICK TO TAKE OVER BOT
            </button>
            <div className="text-[10px] text-slate-400">Left click to switch between surviving teammates</div>
          </div>
        )}
      </div>

      {/* Bottom HUD: Health, Armor, Weapon & Ammo */}
      <div className="flex items-end justify-between">
        {/* Bottom Left: Health & Armor */}
        <div className="flex items-center gap-3 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
          {/* Health */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 font-black text-lg">
              +
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white font-['Chakra_Petch'] leading-none">
                {player.isAlive ? player.health : 0}
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">HEALTH</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          {/* Armor */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 font-black text-lg">
              🛡️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-3xl font-black text-white font-['Chakra_Petch'] leading-none">
                  {player.armor}
                </span>
                {player.hasHelmet && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-300 font-mono font-bold">
                    HELMET
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">ARMOR</span>
            </div>
          </div>
        </div>

        {/* Bottom Center: Weapon Slots (1, 2, 3, 4) */}
        <div className="flex items-center gap-2 bg-[#0a0f1d]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <div
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
              player.inventory.currentSlot === 'primary'
                ? 'bg-sky-500 text-black shadow-md'
                : 'text-slate-400'
            }`}
          >
            [1] {player.inventory.primary ? player.inventory.primary.toUpperCase() : '---'}
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
              player.inventory.currentSlot === 'secondary'
                ? 'bg-sky-500 text-black shadow-md'
                : 'text-slate-400'
            }`}
          >
            [2] {player.inventory.secondary.toUpperCase()}
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
              player.inventory.currentSlot === 'knife'
                ? 'bg-sky-500 text-black shadow-md'
                : 'text-slate-400'
            }`}
          >
            [3] KNIFE
          </div>
          {player.inventory.c4 && (
            <div
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                player.inventory.currentSlot === 'c4'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-red-400'
              }`}
            >
              [4] C4
            </div>
          )}
        </div>

        {/* Bottom Right: Active Weapon & Ammo */}
        <div className="flex items-center gap-4 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold font-['Chakra_Petch'] text-sky-400 uppercase">
              {currentWeapon.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {player.isReloading ? 'RELOADING...' : player.isScoped ? 'SCOPED' : 'READY'}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Ammo Numbers */}
          <div className="flex items-baseline gap-1.5 font-['Chakra_Petch']">
            {player.currentWeapon !== 'knife' && player.currentWeapon !== 'c4' ? (
              <>
                <span className="text-4xl font-black text-white">{ammo.current}</span>
                <span className="text-xl font-bold text-slate-500">/ {ammo.reserve}</span>
              </>
            ) : (
              <span className="text-3xl font-black text-slate-400">∞</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for crosshair speed calculation
function THREE_Vector2Length(x: number, z: number): number {
  return Math.sqrt(x * x + z * z);
}

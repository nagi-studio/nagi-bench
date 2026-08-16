import React from 'react';
import { GameStateData } from '../../engine/game/GameManager';
import { BotEntity } from '../../engine/ai/BotAI';
import { WEAPON_REGISTRY } from '../../engine/weapon/WeaponTypes';
import { Minimap } from './Minimap';
import { KillFeed } from './KillFeed';
import { Scoreboard } from './Scoreboard';
import { BuyMenu } from './BuyMenu';
import { SpectatorOverlay } from './SpectatorOverlay';

interface HUDProps {
  gameState: GameStateData;
  allPlayers: BotEntity[];
  showScoreboard: boolean;
  showBuyMenu: boolean;
  isScoped: boolean;
  recoilSpread: number;
  onBuyWeapon: (id: any) => void;
  onBuyEquipment: (item: any) => void;
  onCloseBuyMenu: () => void;
  onTakeOverBot: (id: string) => void;
  onCycleSpectator: (dir: number) => void;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  allPlayers,
  showScoreboard,
  showBuyMenu,
  isScoped,
  recoilSpread,
  onBuyWeapon,
  onBuyEquipment,
  onCloseBuyMenu,
  onTakeOverBot,
  onCycleSpectator
}) => {
  const {
    round,
    scoreCT,
    scoreT,
    roundPhase,
    roundTimeLeft,
    winner,
    winReason,
    playerEntity,
    c4,
    spectatingBot,
    killFeed
  } = gameState;

  const currentEntity = (playerEntity && playerEntity.health > 0) ? playerEntity : spectatingBot;
  const currentWeaponDef = currentEntity ? WEAPON_REGISTRY[currentEntity.currentWeapon] : null;
  const currentAmmo = currentEntity && currentWeaponDef ? currentEntity.ammo[currentEntity.currentWeapon] : null;

  const ctPlayers = allPlayers.filter(p => p.team === 'CT');
  const tPlayers = allPlayers.filter(p => p.team === 'T');
  const isPlayerDead = !playerEntity || playerEntity.health <= 0;

  // Format timer mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden font-sans text-white z-20">
      {/* 1. TOP-LEFT MINIMAP RADAR */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <Minimap players={allPlayers} playerEntity={playerEntity} c4={c4} />
      </div>

      {/* 2. TOP-RIGHT KILLFEED */}
      <KillFeed entries={killFeed} />

      {/* 3. TOP-CENTER 5v5 TEAM STATUS BAR */}
      <div className="absolute top-4 inset-x-0 flex justify-center items-center pointer-events-none">
        <div className="flex items-center gap-3 px-6 py-2 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          {/* CT Avatars (5 Icons) */}
          <div className="flex items-center gap-1.5">
            {ctPlayers.map(p => (
              <div
                key={p.id}
                className={`w-6 h-8 rounded flex flex-col items-center justify-between p-0.5 border ${
                  p.health > 0
                    ? 'bg-sky-950/90 border-sky-500 text-sky-400'
                    : 'bg-black/80 border-slate-800 text-slate-600 opacity-40'
                }`}
                title={`${p.name} (${p.health} HP)`}
              >
                <div className="text-[9px] font-bold">CT</div>
                {p.health > 0 ? (
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full" style={{ width: `${p.health}%` }} />
                  </div>
                ) : (
                  <span className="text-[9px]">💀</span>
                )}
              </div>
            ))}
          </div>

          {/* Score & Timer Center */}
          <div className="flex items-center gap-4 px-3 py-1 bg-black/60 rounded-lg border border-slate-800/80">
            <span className="text-xl font-black font-mono text-sky-400">{scoreCT}</span>
            <div className="flex flex-col items-center">
              {c4.isPlanted ? (
                <div className="flex items-center gap-1 text-red-500 font-mono font-black text-base animate-pulse">
                  <span>💣</span>
                  <span>{Math.ceil(c4.fuseTimeLeft)}s</span>
                </div>
              ) : roundPhase === 'FREEZE' ? (
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  FREEZE
                </div>
              ) : (
                <div className="text-base font-mono font-bold text-slate-200">
                  {formatTimer(roundTimeLeft)}
                </div>
              )}
              <span className="text-[9px] font-mono text-slate-500">ROUND {round}</span>
            </div>
            <span className="text-xl font-black font-mono text-amber-400">{scoreT}</span>
          </div>

          {/* T Avatars (5 Icons) */}
          <div className="flex items-center gap-1.5">
            {tPlayers.map(p => (
              <div
                key={p.id}
                className={`w-6 h-8 rounded flex flex-col items-center justify-between p-0.5 border ${
                  p.health > 0
                    ? 'bg-amber-950/90 border-amber-500 text-amber-400'
                    : 'bg-black/80 border-slate-800 text-slate-600 opacity-40'
                }`}
                title={`${p.name} (${p.health} HP)`}
              >
                <div className="text-[9px] font-bold">T</div>
                {p.health > 0 ? (
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${p.health}%` }} />
                  </div>
                ) : (
                  <span className="text-[9px]">💀</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC CROSSHAIR (Hidden when AWP scoped) */}
      {!isScoped && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Center Dot */}
            <div className="w-1 h-1 bg-emerald-400 rounded-full shadow-sm shadow-black" />

            {/* Crosshair Bars with Dynamic Spread */}
            <div
              className="absolute w-0.5 bg-emerald-400 shadow-sm shadow-black"
              style={{ height: '9px', transform: `translateY(-${7 + recoilSpread * 14}px)` }}
            />
            <div
              className="absolute w-0.5 bg-emerald-400 shadow-sm shadow-black"
              style={{ height: '9px', transform: `translateY(${7 + recoilSpread * 14}px)` }}
            />
            <div
              className="absolute h-0.5 bg-emerald-400 shadow-sm shadow-black"
              style={{ width: '9px', transform: `translateX(-${7 + recoilSpread * 14}px)` }}
            />
            <div
              className="absolute h-0.5 bg-emerald-400 shadow-sm shadow-black"
              style={{ width: '9px', transform: `translateX(${7 + recoilSpread * 14}px)` }}
            />
          </div>
        </div>
      )}

      {/* 5. AWP SNIPER SCOPE 2D OVERLAY */}
      {isScoped && (
        <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20">
          {/* Circular Scope Aperture with Black Outer Mask */}
          <div
            className="w-[85vmin] h-[85vmin] rounded-full border-[100vmin] border-black relative overflow-hidden shadow-2xl flex items-center justify-center"
          >
            {/* Hairlines */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/90 shadow-sm" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/90 shadow-sm" />

            {/* Scope Milliradian marks */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full border border-red-500/80 bg-red-500/30" />
            </div>

            {/* Scope Lens Vignette */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />
          </div>
        </div>
      )}

      {/* 6. C4 PLANT / DEFUSE PROGRESS RING */}
      {(c4.plantProgress > 0 || c4.defuseProgress > 0) && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/80 border border-slate-700 shadow-2xl backdrop-blur-md">
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
              {c4.plantProgress > 0 ? 'PLANTING C4...' : 'DEFUSING C4...'}
            </div>
            <div className="w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-600">
              <div
                className={`h-full transition-all duration-75 ${
                  c4.plantProgress > 0 ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${(c4.plantProgress > 0 ? c4.plantProgress : c4.defuseProgress) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. ROUND END BANNER */}
      {roundPhase === 'ENDED' && winner && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none animate-fadeIn">
          <div className="px-12 py-6 rounded-2xl bg-black/90 border-2 border-slate-700 shadow-2xl backdrop-blur-lg text-center flex flex-col gap-2">
            <h1 className={`text-4xl font-black tracking-widest font-sans uppercase ${
              winner === 'CT' ? 'text-sky-400' : 'text-amber-400'
            }`}>
              {winner === 'CT' ? 'COUNTER-TERRORISTS WIN' : 'TERRORISTS WIN'}
            </h1>
            <p className="text-sm font-mono text-slate-300 uppercase tracking-wider">
              {winReason}
            </p>
          </div>
        </div>
      )}

      {/* 8. BOTTOM HUD: HEALTH, ARMOR, WEAPON, AMMO */}
      {currentEntity && (
        <div className="absolute inset-x-8 bottom-6 flex justify-between items-end pointer-events-none">
          {/* Health & Armor Panels */}
          <div className="flex items-center gap-4">
            {/* Health */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <span className="text-emerald-400 font-bold text-lg font-mono">➕</span>
              <div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">HEALTH</div>
                <div className={`text-3xl font-black font-mono ${
                  currentEntity.health > 25 ? 'text-white' : 'text-red-500 animate-pulse'
                }`}>
                  {currentEntity.health}
                </div>
              </div>
            </div>

            {/* Armor */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              <span className="text-sky-400 font-bold text-lg font-mono">🛡️</span>
              <div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">ARMOR</div>
                <div className="text-3xl font-black font-mono text-white">
                  {currentEntity.armor}
                  {currentEntity.hasHelmet && <span className="text-xs text-sky-400 ml-1">HELMET</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Weapon & Ammo Panels */}
          {currentWeaponDef && currentAmmo && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md text-right">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    {currentWeaponDef.name}
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    {currentWeaponDef.slot === 'melee' || currentWeaponDef.slot === 'bomb' ? (
                      <span className="text-lg text-slate-400">READY</span>
                    ) : (
                      <>
                        <span className={currentAmmo.clip <= 5 ? 'text-red-400' : 'text-white'}>
                          {currentAmmo.clip}
                        </span>
                        <span className="text-slate-500 text-xl font-normal mx-1">/</span>
                        <span className="text-slate-400 text-xl">{currentAmmo.reserve}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. SPECTATOR OVERLAY (If player is dead) */}
      {isPlayerDead && (
        <SpectatorOverlay
          spectatingBot={spectatingBot}
          aliveTeammates={allPlayers.filter(p => p.team === gameState.playerEntity?.team && p.health > 0)}
          onTakeOver={onTakeOverBot}
          onCycleTeammate={onCycleSpectator}
        />
      )}

      {/* 10. BUY MENU MODAL (B Key) */}
      {showBuyMenu && (
        <BuyMenu
          playerEntity={playerEntity}
          onBuyWeapon={onBuyWeapon}
          onBuyEquipment={onBuyEquipment}
          onClose={onCloseBuyMenu}
        />
      )}

      {/* 11. SCOREBOARD MODAL (TAB Key) */}
      {showScoreboard && (
        <Scoreboard
          players={allPlayers}
          playerEntity={playerEntity}
          scoreCT={scoreCT}
          scoreT={scoreT}
          round={round}
        />
      )}
    </div>
  );
};

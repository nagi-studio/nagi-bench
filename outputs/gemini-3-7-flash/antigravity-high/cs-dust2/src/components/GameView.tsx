import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GameManager, GameStateData } from '../engine/game/GameManager';
import { HUD } from './HUD/HUD';
import { soundManager } from '../engine/audio/SoundSynthesizer';
import { WeaponId, WEAPON_REGISTRY } from '../engine/weapon/WeaponTypes';

interface GameViewProps {
  playerTeam: 'CT' | 'T';
  isPistolOnly: boolean;
  mouseSensitivity: number;
  onExitToMenu: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  playerTeam,
  isPistolOnly,
  mouseSensitivity,
  onExitToMenu
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);

  // UI state
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [showBuyMenu, setShowBuyMenu] = useState<boolean>(false);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);

  // Initialize Three.js and Game Engine
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc8ddf0);
    scene.fog = new THREE.FogExp2(0xc8ddf0, 0.008);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.05,
      250
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // 2. Initialize Game Engine
    const gm = new GameManager(scene, camera, playerTeam);
    gm.isPistolRound = isPistolOnly;
    gameManagerRef.current = gm;

    // 3. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 4. Pointer Lock Change
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsPointerLocked(locked);
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // 5. Game Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let uiUpdateTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(0.05, clock.getDelta());

      // Update Game Engine
      gm.update(delta);

      // Adjust camera FOV for AWP Scope
      const targetFov = gm.isScoped ? 25 : 75;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 20);
        camera.updateProjectionMatrix();
      }

      // Render Scene
      renderer.render(scene, camera);

      // Sync React state for HUD (60fps)
      uiUpdateTimer += delta;
      if (uiUpdateTimer >= 0.016) {
        uiUpdateTimer = 0;
        setGameState(gm.getGameState());
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [playerTeam, isPistolOnly]);

  // Request Pointer Lock on Canvas Click
  const handleCanvasClick = useCallback(() => {
    if (containerRef.current) {
      soundManager.init();
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas && document.pointerLockElement !== canvas && !showBuyMenu) {
        canvas.requestPointerLock();
      }
    }
  }, [showBuyMenu]);

  // Input Listeners
  useEffect(() => {
    const gm = gameManagerRef.current;
    if (!gm) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== containerRef.current?.querySelector('canvas')) return;

      const sens = mouseSensitivity * 0.002;
      gm.playerYaw -= e.movementX * sens;
      gm.playerPitch -= e.movementY * sens;
      gm.viewmodel.addMouseSway(e.movementX, e.movementY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      soundManager.init();
      if (document.pointerLockElement !== containerRef.current?.querySelector('canvas')) return;

      gm.mouseButtons[e.button] = true;

      if (e.button === 0) {
        // Left Click: Shoot
        gm.handlePlayerFire();
      } else if (e.button === 2) {
        // Right Click: Scope zoom (AWP)
        if (gm.playerEntity && gm.playerEntity.currentWeapon === 'awp') {
          gm.isScoped = !gm.isScoped;
          soundManager.playScopeZoom();
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      gm.mouseButtons[e.button] = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      soundManager.init();
      gm.keys[e.code] = true;

      if (e.code === 'KeyB') {
        if (gm.roundPhase === 'FREEZE') {
          setShowBuyMenu(prev => {
            if (!prev) document.exitPointerLock();
            return !prev;
          });
        }
      } else if (e.code === 'Tab') {
        e.preventDefault();
        setShowScoreboard(true);
      } else if (e.code === 'KeyR') {
        gm.reloadPlayer();
      } else if (e.code === 'Digit1') {
        gm.switchWeaponSlot('primary');
      } else if (e.code === 'Digit2') {
        gm.switchWeaponSlot('secondary');
      } else if (e.code === 'Digit3') {
        gm.switchWeaponSlot('melee');
      } else if (e.code === 'Digit5') {
        gm.switchWeaponSlot('bomb');
      } else if (e.code === 'KeyE') {
        // Bot Takeover if dead
        if (gm.playerEntity && gm.playerEntity.health <= 0 && gm.spectatingBot) {
          gm.takeOverBot(gm.spectatingBot.id);
        }
      } else if (e.code === 'Escape') {
        if (showBuyMenu) {
          setShowBuyMenu(false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gm.keys[e.code] = false;
      if (e.code === 'Tab') {
        setShowScoreboard(false);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleWheel = (e: WheelEvent) => {
      if (!gm.playerEntity) return;
      if (e.deltaY > 0) {
        // Scroll down
        if (gm.playerEntity.currentWeapon === gm.playerEntity.primaryWeapon) {
          gm.switchWeaponSlot('secondary');
        } else if (gm.playerEntity.currentWeapon === gm.playerEntity.secondaryWeapon) {
          gm.switchWeaponSlot('melee');
        } else {
          gm.switchWeaponSlot('primary');
        }
      } else {
        // Scroll up
        if (gm.playerEntity.currentWeapon === 'knife') {
          gm.switchWeaponSlot('secondary');
        } else if (gm.playerEntity.currentWeapon === gm.playerEntity.secondaryWeapon) {
          gm.switchWeaponSlot('primary');
        } else {
          gm.switchWeaponSlot('melee');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [mouseSensitivity, showBuyMenu]);

  // Buy actions
  const handleBuyWeapon = (weaponId: WeaponId) => {
    if (gameManagerRef.current) {
      gameManagerRef.current.buyWeapon(weaponId);
    }
  };

  const handleBuyEquipment = (item: 'armor' | 'helmet' | 'kit') => {
    if (gameManagerRef.current) {
      gameManagerRef.current.buyEquipment(item);
    }
  };

  const handleTakeOverBot = (botId: string) => {
    if (gameManagerRef.current) {
      gameManagerRef.current.takeOverBot(botId);
    }
  };

  const handleCycleSpectator = (dir: number) => {
    const gm = gameManagerRef.current;
    if (!gm) return;
    const aliveTeammates = gm.players.filter(p => p.team === gm.playerTeam && p.health > 0);
    if (aliveTeammates.length === 0) return;

    let currentIndex = gm.spectatingBot ? aliveTeammates.findIndex(p => p.id === gm.spectatingBot?.id) : 0;
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = (currentIndex + dir + aliveTeammates.length) % aliveTeammates.length;
    gm.spectatingBot = aliveTeammates[nextIndex];
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} onClick={handleCanvasClick} className="w-full h-full cursor-crosshair" />

      {/* Click to Play / Resume Pointer Lock Prompt */}
      {!isPointerLocked && !showBuyMenu && (
        <div
          onClick={handleCanvasClick}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
        >
          <div className="px-8 py-5 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl text-center flex flex-col items-center gap-3">
            <div className="text-3xl">🎯</div>
            <div className="text-xl font-black text-slate-100 font-sans tracking-wider uppercase">
              CLICK TO RESUME CONTROLS
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Locks mouse cursor for first-person FPS aiming
            </p>
            <button
              onClick={onExitToMenu}
              className="mt-2 px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold"
            >
              EXIT TO MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* Main Tactical HUD */}
      {gameState && (
        <HUD
          gameState={gameState}
          allPlayers={gameManagerRef.current?.players || []}
          showScoreboard={showScoreboard}
          showBuyMenu={showBuyMenu}
          isScoped={gameManagerRef.current?.isScoped || false}
          recoilSpread={gameManagerRef.current?.recoilOffsetPitch || 0}
          onBuyWeapon={handleBuyWeapon}
          onBuyEquipment={handleBuyEquipment}
          onCloseBuyMenu={() => setShowBuyMenu(false)}
          onTakeOverBot={handleTakeOverBot}
          onCycleSpectator={handleCycleSpectator}
        />
      )}
    </div>
  );
};

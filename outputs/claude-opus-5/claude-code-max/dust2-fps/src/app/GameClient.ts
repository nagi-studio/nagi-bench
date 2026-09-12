/**
 * GameClient — the composition root.
 *
 * Owns the four subsystems and the single requestAnimationFrame loop that keeps them in
 * step:
 *
 *   input -> world.update (fixed 64 Hz ticks) -> renderer.sync -> audio.consume ->
 *   hud store (30 Hz) -> renderer.render
 *
 * The event queue produced by the world during `update()` is drained by the renderer, the
 * audio engine and the HUD store within the same frame, then discarded.
 */

import { AudioEngine } from '../audio/audio.ts';
import type { Team } from '../game/constants.ts';
import { GameWorld, type WorldConfig } from '../game/world.ts';
import { GameRenderer } from '../render/Renderer.ts';
import { HudStore } from '../ui/store.ts';
import { InputController } from './InputController.ts';

export interface ClientSettings {
  playerTeam: Team;
  botSkill: number;
  pistolRoundsOnly: boolean;
  sensitivity: number;
  volume: number;
  shadows: boolean;
  seed: number;
}

export const DEFAULT_SETTINGS: ClientSettings = {
  playerTeam: 'CT',
  botSkill: 0.5,
  pistolRoundsOnly: false,
  sensitivity: 0.0022,
  volume: 0.6,
  shadows: true,
  seed: Date.now() % 100000,
};

export class GameClient {
  readonly world: GameWorld;
  readonly renderer: GameRenderer;
  readonly audio = new AudioEngine();
  readonly store = new HudStore();
  readonly input: InputController;

  private canvas: HTMLCanvasElement;
  private rafId = 0;
  private lastTime = 0;
  private running = false;
  private disposed = false;
  private resizeObserver: ResizeObserver | null = null;

  /** Latest measured frame rate, surfaced in the HUD's debug corner. */
  fps = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;

  onPause: (() => void) | null = null;
  onScoreboard: ((shown: boolean) => void) | null = null;
  onPointerLockChange: ((locked: boolean) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, settings: ClientSettings) {
    this.canvas = canvas;

    const worldConfig: Partial<WorldConfig> = {
      seed: settings.seed,
      playerTeam: settings.playerTeam,
      pistolRoundsOnly: settings.pistolRoundsOnly,
      botSkill: settings.botSkill,
    };
    this.world = new GameWorld(worldConfig);
    this.renderer = new GameRenderer(canvas, this.world, { shadows: settings.shadows });

    this.input = new InputController(canvas, {
      onPause: () => this.onPause?.(),
      onScoreboard: (shown) => this.onScoreboard?.(shown),
      onPointerLockChange: (locked) => this.onPointerLockChange?.(locked),
    });
    this.input.setSensitivity(settings.sensitivity);
    this.audio.setVolume(settings.volume);

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(canvas);
    }
  }

  async enableAudio(): Promise<void> {
    await this.audio.start();
  }

  start(): void {
    if (this.running || this.disposed) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  applySettings(settings: ClientSettings): void {
    this.input.setSensitivity(settings.sensitivity);
    this.audio.setVolume(settings.volume);
    this.renderer.setShadows(settings.shadows);
  }

  private frame = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.frame);

    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // 1) gather input
    const input = this.input.beginFrame();
    const mouseDx = input.mouseDx;
    const mouseDy = input.mouseDy;
    // Without pointer lock the player is in a menu: freeze their intent completely but
    // keep the world (and the bots) running behind it.
    if (!this.input.pointerLocked) {
      input.forward = 0;
      input.right = 0;
      input.jump = false;
      input.crouch = false;
      input.walk = false;
      input.use = false;
      input.fire = false;
      input.firePressed = false;
      input.reloadPressed = false;
      input.scopePressed = false;
      input.switchSlot = 0;
      input.takeoverPressed = false;
      input.spectateNextPressed = false;
      input.mouseDx = 0;
      input.mouseDy = 0;
    }

    // 2) simulate
    this.world.update(dt, input);

    // 3) present
    this.renderer.sync(this.world, dt, mouseDx, mouseDy);

    const cam = this.renderer.cameraState();
    this.audio.setListener(cam.pos, cam.yaw);
    this.audio.consume(this.world.events, this.world);

    this.store.consumeEvents(this.world.events, this.world);
    this.store.update(this.world, dt, this.renderer.damageFlash, this.renderer.damageDirection);

    this.renderer.render();
    this.input.endFrame();

    // 4) fps counter
    this.fpsAccum += dt;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsAccum);
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }
  };

  private handleResize = (): void => {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.resize(width, height);
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.resizeObserver?.disconnect();
    this.input.dispose();
    this.renderer.dispose();
    this.audio.dispose();
  }
}

/**
 * The per-frame intent of the human player. Deliberately a plain data object: the DOM
 * listeners that fill it in live in `src/app/InputController.ts`, and the headless tests
 * can drive the exact same struct.
 */

export interface PlayerInput {
  forward: number;
  right: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
  /** Trigger held down this frame. */
  fire: boolean;
  /** Trigger pressed this frame (edge). */
  firePressed: boolean;
  reloadPressed: boolean;
  /** Use key held (plant / defuse / pick up the bomb). */
  use: boolean;
  scopePressed: boolean;
  /** 1 = primary, 2 = secondary, 3 = melee, 0 = no change. */
  switchSlot: number;
  /** Take over a living teammate while spectating. */
  takeoverPressed: boolean;
  /** Cycle the spectated teammate. */
  spectateNextPressed: boolean;
  /** Accumulated mouse movement since the last frame, in pixels. */
  mouseDx: number;
  mouseDy: number;
  sensitivity: number;
}

export function emptyInput(): PlayerInput {
  return {
    forward: 0,
    right: 0,
    jump: false,
    crouch: false,
    walk: false,
    fire: false,
    firePressed: false,
    reloadPressed: false,
    use: false,
    scopePressed: false,
    switchSlot: 0,
    takeoverPressed: false,
    spectateNextPressed: false,
    mouseDx: 0,
    mouseDy: 0,
    sensitivity: 0.0022,
  };
}

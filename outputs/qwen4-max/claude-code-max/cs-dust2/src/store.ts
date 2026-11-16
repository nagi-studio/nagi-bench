import type { Snapshot } from './game/core/types.ts';

// Bridges the imperative game engine to React. The render loop publishes an
// immutable snapshot at a fixed HUD rate; components subscribe via
// useSyncExternalStore so React re-renders stay decoupled from the 60Hz sim.
export class HudStore {
  private snap: Snapshot | null = null;
  private listeners = new Set<() => void>();

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };

  getSnapshot = (): Snapshot | null => this.snap;

  publish(s: Snapshot): void {
    this.snap = s;
    for (const l of this.listeners) l();
  }
}

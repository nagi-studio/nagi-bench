import { useRef, useSyncExternalStore } from 'react';

/**
 * Minimal external store bridging the imperative game loop and React. The engine publishes
 * immutable snapshots at a throttled rate; components subscribe to slices through `useStore`
 * (useSyncExternalStore + selector memoisation), so only slices that change re-render.
 */
export class Store<T extends object> {
  private state: T;
  private readonly listeners = new Set<() => void>();

  constructor(initial: T) {
    this.state = initial;
  }

  getSnapshot = (): T => this.state;

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  /** Shallow-merge a patch; notifies only if some top-level field actually changed. */
  set(patch: Partial<T>): void {
    let changed = false;
    for (const k in patch) {
      if (!Object.is(patch[k], this.state[k])) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    this.state = { ...this.state, ...patch };
    for (const fn of this.listeners) fn();
  }
}

export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  }
  return true;
}

/** Subscribe to a derived slice of a store. */
export function useStore<T extends object, S>(store: Store<T>, selector: (s: T) => S, equal: (a: S, b: S) => boolean = shallowEqual): S {
  const memo = useRef<{ snap: T; sel: S } | null>(null);
  const get = (): S => {
    const snap = store.getSnapshot();
    const m = memo.current;
    if (m && m.snap === snap) return m.sel;
    const sel = selector(snap);
    if (m && equal(m.sel, sel)) {
      memo.current = { snap, sel: m.sel };
      return m.sel;
    }
    memo.current = { snap, sel };
    return sel;
  };
  return useSyncExternalStore(store.subscribe, get, get);
}

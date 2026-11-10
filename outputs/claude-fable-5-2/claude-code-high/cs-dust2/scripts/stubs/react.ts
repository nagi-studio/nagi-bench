// Minimal stand-in so src/state/store.ts can be imported outside a browser bundle.
export function useSyncExternalStore<T>(_subscribe: unknown, getSnapshot: () => T): T {
  return getSnapshot();
}

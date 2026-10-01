type Handler<T> = (payload: T) => void;

/**
 * Strongly typed synchronous event bus. The simulation emits gameplay events; audio, effects,
 * HUD and AI subscribe without the simulation knowing about any of them.
 */
export class EventBus<Events extends object> {
  private handlers = new Map<keyof Events, Set<Handler<never>>>();

  on<K extends keyof Events>(type: K, fn: Handler<Events[K]>): () => void {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(fn as Handler<never>);
    return () => set!.delete(fn as Handler<never>);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    const set = this.handlers.get(type);
    if (!set) return;
    for (const fn of set) (fn as Handler<Events[K]>)(payload);
  }

  clear(): void {
    this.handlers.clear();
  }
}

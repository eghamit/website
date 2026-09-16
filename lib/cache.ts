/**
 * Tiny in-process TTL cache with a bounded size (LRU-ish eviction on insert).
 * Adequate for a single-node deployment; swap for Redis behind this interface
 * when you scale horizontally.
 */
interface Entry<V> {
  value: V;
  expiresAt: number;
}

export class TtlCache<V> {
  private store = new Map<string, Entry<V>>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries = 500,
  ) {}

  get(key: string): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    // Refresh recency: re-insert to move to the end of the Map's order.
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: V): void {
    if (this.ttlMs <= 0) return;
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

import { ThreatReport, CacheStats } from '../types';

/**
 * In-Memory JavaScript Cache for LinkSentinel
 * Satisfies zero-latency local caching requirement.
 */
class InMemoryThreatCache {
  private cache: Map<string, { report: ThreatReport; timestamp: number; hitCount: number }>;
  private hits: number = 0;
  private misses: number = 0;
  private lastHitUrl?: string;

  constructor() {
    this.cache = new Map();
  }

  // Normalize key for resilient cache lookups (strip trailing slashes, lower-case)
  private normalizeKey(url: string): string {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }

  public get(url: string): ThreatReport | null {
    const key = this.normalizeKey(url);
    const entry = this.cache.get(key);

    if (entry) {
      this.hits++;
      entry.hitCount++;
      this.lastHitUrl = key;
      // Return a copy tagged as fromCache: true
      return {
        ...entry.report,
        fromCache: true,
        scanDurationMs: 0 // Instant from memory
      };
    }

    this.misses++;
    return null;
  }

  public set(url: string, report: ThreatReport): void {
    const key = this.normalizeKey(url);
    this.cache.set(key, {
      report: { ...report },
      timestamp: Date.now(),
      hitCount: 0
    });
  }

  public has(url: string): boolean {
    const key = this.normalizeKey(url);
    return this.cache.has(key);
  }

  public getAll(): Array<{ key: string; report: ThreatReport; timestamp: number; hitCount: number }> {
    const list: Array<{ key: string; report: ThreatReport; timestamp: number; hitCount: number }> = [];
    this.cache.forEach((value, key) => {
      list.push({ key, ...value });
    });
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }

  public delete(url: string): boolean {
    const key = this.normalizeKey(url);
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.lastHitUrl = undefined;
  }

  public getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRatioPercentage = totalRequests > 0 ? Math.round((this.hits / totalRequests) * 100) : 0;
    return {
      totalEntries: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      lastHitUrl: this.lastHitUrl,
      hitRatioPercentage
    };
  }
}

export const threatCache = new InMemoryThreatCache();

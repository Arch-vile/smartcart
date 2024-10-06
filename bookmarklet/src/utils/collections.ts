
export function mapMap<K,V,T>(map: Map<K,V>, fn: (k:K, v:V) => T) {
  return new Map(Array.from(map, ([key, value]) => [key, fn(key, value)]));
}

export function mapToEntries<K,V>(map: Map<K,V>): [K,V][] {
  return Array.from(map.entries());
}

export function entriesToMap<K,V>(entries: [K, V][]): Map<K,V> {
  return entries.reduce((acc,next) => acc.set(next[0], next[1]), new Map())
}

export function windowed<T>(size: number, from: T[]): T[][] {
  return from.flatMap((_, i) => i <= from.length - size
      ? [from.slice(i, i + size)]
      : []);
}

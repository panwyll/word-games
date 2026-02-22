/** Start date for computing daily puzzle indices. */
const EPOCH = new Date('2024-01-01').getTime();

/** Number of days since EPOCH, used as a seed for daily puzzles. */
export function getDailySeed(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - EPOCH) / (1000 * 60 * 60 * 24));
}

/** @deprecated Use getDailySeed() + seeded engines instead */
export function getDailyIndex(listLength: number): number {
  return ((getDailySeed() % listLength) + listLength) % listLength;
}

/**
 * Mulberry32 — fast, deterministic seeded PRNG.
 * Returns a function that yields floats in [0, 1).
 */
export function seededRng(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministically shuffle an array using a seeded RNG (Fisher-Yates). */
export function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

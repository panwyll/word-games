/** Returns today's date as a YYYY-MM-DD string, used to key daily puzzle cache entries. */
function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Read a daily-keyed value from localStorage. Returns null if not found or date has changed. */
export function readDailyCache<T>(game: string): T | null {
  try {
    const raw = localStorage.getItem(`${game}-${todayKey()}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Write a daily-keyed value to localStorage. */
export function writeDailyCache<T>(game: string, value: T): void {
  try {
    localStorage.setItem(`${game}-${todayKey()}`, JSON.stringify(value));
  } catch {
    // Ignore storage errors (private browsing, quota exceeded, etc.)
  }
}

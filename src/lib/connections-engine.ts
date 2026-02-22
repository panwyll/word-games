import { CATEGORY_POOL, type CategoryGroup } from './connections-categories';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { ConnectionsPuzzle } from '@/types/games';

const DIFFICULTIES = ['yellow', 'green', 'blue', 'purple'] as const;

export function generateConnectionsPuzzle(seed: number): ConnectionsPuzzle {
  // Try up to 1000 seeds until we find 4 non-overlapping categories
  for (let attempt = 0; attempt < 1000; attempt++) {
    const chosen: CategoryGroup[] = [];
    const usedWords = new Set<string>();
    let valid = true;

    for (const diff of DIFFICULTIES) {
      const pool = seededShuffle(
        CATEGORY_POOL.filter(c => c.difficulty === diff),
        seededRng(seed + attempt * 13 + DIFFICULTIES.indexOf(diff) + 1)
      );

      // Pick the first group from this difficulty that doesn't share any words
      const pick = pool.find(group =>
        group.words.slice(0, 4).every(w => !usedWords.has(w))
      );

      if (!pick) { valid = false; break; }

      pick.words.slice(0, 4).forEach(w => usedWords.add(w));
      chosen.push(pick);
    }

    if (valid && chosen.length === 4) {
      return {
        categories: chosen.map(g => ({
          title: g.title,
          color: g.difficulty,
          words: g.words.slice(0, 4),
        })),
      };
    }
  }

  // Fallback: just pick first group of each difficulty
  return {
    categories: DIFFICULTIES.map(diff => {
      const g = CATEGORY_POOL.find(c => c.difficulty === diff)!;
      return { title: g.title, color: diff, words: g.words.slice(0, 4) };
    }),
  };
}

export function getDailyConnectionsPuzzle(): ConnectionsPuzzle {
  return generateConnectionsPuzzle(getDailySeed());
}

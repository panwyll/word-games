import { DICTIONARY } from './dictionary';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { SpellingBeePuzzle } from '@/types/games';

/**
 * Pangram-first approach: start from words in the dictionary that have exactly
 * 7 unique letters. Each such word guarantees at least one pangram exists for
 * that letter set, and the algorithm tries every possible center letter to find
 * the configuration with the most valid words (≥15 required).
 */

// Pre-compute all words with exactly 7 distinct letters (pangram seed candidates).
const PANGRAM_SEEDS = DICTIONARY.filter(word => new Set(word.split('')).size === 7);

export function generateSpellingBeePuzzle(seed: number): SpellingBeePuzzle {
  // Deterministically shuffle the pangram seed words using the daily seed.
  const shuffledSeeds = seededShuffle(PANGRAM_SEEDS, seededRng(seed));

  for (const pangramSeed of shuffledSeeds) {
    const letters = Array.from(new Set(pangramSeed.split('')));

    // Try each of the 7 letters as the center (in a seeded random order).
    const centers = seededShuffle(letters, seededRng(seed + pangramSeed.charCodeAt(0)));

    for (const center of centers) {
      const allLetters = new Set(letters);

      const validWords = DICTIONARY.filter(word => {
        if (word.length < 4 || !word.includes(center)) return false;
        return word.split('').every(ch => allLetters.has(ch));
      });

      // Quality check: at least 15 valid words (pangram guaranteed by construction).
      if (validWords.length >= 15) {
        const pangrams = validWords.filter(word => {
          const ws = new Set(word.split(''));
          return letters.every(l => ws.has(l));
        });
        return {
          centerLetter: center,
          outerLetters: letters.filter(l => l !== center),
          validWords,
          pangrams,
        };
      }
    }
  }

  // Absolute fallback — only reached if the entire dictionary yields no valid puzzle.
  return buildFallback();
}

/** Build puzzle from letters A,E,I,L,M,N,T — a very productive letter set. */
function buildFallback(): SpellingBeePuzzle {
  const center = 'E';
  const outer = ['A', 'I', 'L', 'M', 'N', 'T'];
  const allLetters = new Set([center, ...outer]);
  const validWords = DICTIONARY.filter(word => {
    if (word.length < 4 || !word.includes(center)) return false;
    return word.split('').every(ch => allLetters.has(ch));
  });
  const pangrams = validWords.filter(word => {
    const ws = new Set(word.split(''));
    return Array.from(allLetters).every(l => ws.has(l));
  });
  return { centerLetter: center, outerLetters: outer, validWords, pangrams };
}

export function getDailySpellingBeePuzzle(): SpellingBeePuzzle {
  return generateSpellingBeePuzzle(getDailySeed());
}

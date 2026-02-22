import { DICTIONARY } from './dictionary';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { SpellingBeePuzzle } from '@/types/games';

// Letters that make for good Spelling Bee puzzles (avoid J, K, Q, V, X, Z for center)
const GOOD_CENTER = 'ABCDEGHILMNOPRSTUW'.split('');
const GOOD_OUTER = 'ABCDEGHILMNOPRSTUW'.split('');

export function generateSpellingBeePuzzle(seed: number): SpellingBeePuzzle {
  // Try many seeds until we find a puzzle meeting quality thresholds
  for (let attempt = 0; attempt < 500; attempt++) {
    // Pick 7 distinct letters
    const centerPool = seededShuffle(GOOD_CENTER, seededRng(seed + attempt * 37 + 1));
    const center = centerPool[0];

    const outerPool = seededShuffle(
      GOOD_OUTER.filter(l => l !== center),
      seededRng(seed + attempt * 37 + 2)
    );
    const outer = outerPool.slice(0, 6);
    const allLetters = new Set([center, ...outer]);

    // Find valid words: ≥4 letters, only uses the 7 letters, includes center
    const validWords = DICTIONARY.filter(word => {
      if (word.length < 4) return false;
      if (!word.includes(center)) return false;
      return word.split('').every(ch => allLetters.has(ch));
    });

    // Find pangrams: words that use all 7 letters at least once
    const pangrams = validWords.filter(word => {
      const wordSet = new Set(word.split(''));
      return Array.from(allLetters).every(l => wordSet.has(l));
    });

    // Quality check: at least 15 valid words, at least 1 pangram
    if (validWords.length >= 15 && pangrams.length >= 1) {
      return {
        centerLetter: center,
        outerLetters: outer,
        validWords,
        pangrams,
      };
    }
  }

  // Absolute fallback (should rarely/never be reached with a large enough dictionary)
  return hardcodedFallback();
}

/** Used only if the algorithm cannot find a valid puzzle after 500 attempts. */
function hardcodedFallback(): SpellingBeePuzzle {
  // T is center, using letters T,R,A,I,N,E,S — a very well-known valid set
  const center = 'T';
  const outer = ['R', 'A', 'I', 'N', 'E', 'S'];
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

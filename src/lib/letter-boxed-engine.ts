import { DICTIONARY } from './dictionary';
import { seededRng, getDailySeed } from './daily';
import type { LetterBoxedPuzzle } from '@/types/games';

/**
 * Check if a word is valid for Letter Boxed:
 * - Cannot use consecutive letters from the same side
 */
function isValidLetterBoxedWord(
  word: string,
  sides: [string[], string[], string[], string[]]
): boolean {
  if (word.length < 3) return false;

  // Build a map of letter to side index
  const letterToSide = new Map<string, number>();
  sides.forEach((side, sideIdx) => {
    side.forEach(letter => {
      letterToSide.set(letter.toUpperCase(), sideIdx);
    });
  });

  // Check each consecutive pair
  for (let i = 0; i < word.length - 1; i++) {
    const currentSide = letterToSide.get(word[i]);
    const nextSide = letterToSide.get(word[i + 1]);
    
    // Letter not in puzzle or consecutive letters from same side
    if (currentSide === undefined || nextSide === undefined) return false;
    if (currentSide === nextSide) return false;
  }

  return true;
}

/**
 * Generate a Letter Boxed puzzle with 12 unique letters arranged on 4 sides.
 */
export function generateLetterBoxedPuzzle(seed: number): LetterBoxedPuzzle {
  const rng = seededRng(seed);
  
  // Common letters to ensure playability
  const commonLetters = 'AEIOURSTLNDHCMPBGFYWKVXJQZ'.split('');
  
  // Try multiple attempts to generate a good puzzle
  for (let attempt = 0; attempt < 100; attempt++) {
    // Shuffle and pick 12 unique letters
    const shuffled = [...commonLetters];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const letters = shuffled.slice(0, 12);
    const sides: [string[], string[], string[], string[]] = [
      letters.slice(0, 3),
      letters.slice(3, 6),
      letters.slice(6, 9),
      letters.slice(9, 12),
    ];
    
    const allLettersSet = new Set(letters.map(l => l.toUpperCase()));
    
    // Find all valid words that:
    // 1. Use only these 12 letters
    // 2. Follow Letter Boxed rules (no consecutive letters from same side)
    // 3. Are in the dictionary
    const validWords = DICTIONARY.filter(word => {
      // Only use letters from the puzzle
      const wordLetters = word.split('');
      if (!wordLetters.every(l => allLettersSet.has(l))) return false;
      
      // Check Letter Boxed rules
      return isValidLetterBoxedWord(word, sides);
    });
    
    // Need at least 50 valid words for a playable puzzle
    if (validWords.length >= 50) {
      return { sides, validWords };
    }
  }
  
  // Fallback: use a handcrafted puzzle
  const sides: [string[], string[], string[], string[]] = [
    ['T', 'A', 'E'],
    ['R', 'N', 'I'],
    ['S', 'O', 'L'],
    ['D', 'C', 'H'],
  ];
  
  const allLettersSet = new Set(['T', 'A', 'E', 'R', 'N', 'I', 'S', 'O', 'L', 'D', 'C', 'H']);
  const validWords = DICTIONARY.filter(word => {
    const wordLetters = word.split('');
    if (!wordLetters.every(l => allLettersSet.has(l))) return false;
    return isValidLetterBoxedWord(word, sides);
  });
  
  return { sides, validWords };
}

/**
 * Get the daily Letter Boxed puzzle.
 */
export function getDailyLetterBoxedPuzzle(): LetterBoxedPuzzle {
  return generateLetterBoxedPuzzle(getDailySeed());
}

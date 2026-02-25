import { DICTIONARY } from './dictionary';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { LetterBoxedPuzzle } from '@/types/games';

/**
 * Letter Boxed puzzle generator.
 * Creates a box with 12 letters (3 per side, 4 sides).
 * Rules:
 * - Words must be at least 3 letters
 * - Cannot use two consecutive letters from the same side
 * - The goal is to use all 12 letters
 */

// Common letters that work well together
const COMMON_LETTERS = 'AEILNORSTU'.split('');
const LESS_COMMON = 'BCDFGHJKMPVWYZ'.split('');

export function generateLetterBoxedPuzzle(seed: number): LetterBoxedPuzzle {
  const rng = seededRng(seed);
  
  // Select 12 unique letters: mix of common and less common
  const allLetters = seededShuffle([...COMMON_LETTERS, ...LESS_COMMON], rng);
  const selectedLetters = allLetters.slice(0, 12);
  
  // Arrange letters into 4 sides of 3 letters each
  const sides: [string[], string[], string[], string[]] = [
    selectedLetters.slice(0, 3),
    selectedLetters.slice(3, 6),
    selectedLetters.slice(6, 9),
    selectedLetters.slice(9, 12),
  ];
  
  // Create a map of which side each letter belongs to
  const letterToSide = new Map<string, number>();
  sides.forEach((side, sideIndex) => {
    side.forEach(letter => {
      letterToSide.set(letter, sideIndex);
    });
  });
  
  // Find all valid words
  const letterSet = new Set(selectedLetters);
  const validWords = DICTIONARY.filter(word => {
    if (word.length < 3) return false;
    
    const upperWord = word.toUpperCase();
    // Check if word only uses available letters
    if (!upperWord.split('').every(ch => letterSet.has(ch))) return false;
    
    // Check that no two consecutive letters are from the same side
    const letters = upperWord.split('');
    for (let i = 0; i < letters.length - 1; i++) {
      const side1 = letterToSide.get(letters[i]);
      const side2 = letterToSide.get(letters[i + 1]);
      if (side1 === side2) return false;
    }
    
    return true;
  });
  
  // Find potential solutions (word chains that use all letters)
  // For simplicity, we'll find some good solutions but won't guarantee optimal
  const solutions = findSolutions(validWords, letterSet, 5); // Find up to 5 solutions
  
  return {
    sides,
    validWords,
    solutions,
  };
}

function findSolutions(
  validWords: string[],
  allLetters: Set<string>,
  maxSolutions: number
): string[][] {
  const solutions: string[][] = [];
  
  // Try to find word chains that use all letters
  // Start with longer words as they're more likely to cover more letters
  const sortedWords = [...validWords].sort((a, b) => b.length - a.length);
  
  // Simple greedy approach: try starting with each long word
  for (const startWord of sortedWords.slice(0, 30)) {
    const chain = [startWord.toUpperCase()];
    const usedLetters = new Set(startWord.toUpperCase().split(''));
    
    if (usedLetters.size === allLetters.size) {
      solutions.push(chain);
      if (solutions.length >= maxSolutions) break;
      continue;
    }
    
    // Try to extend the chain
    let currentWord = startWord.toUpperCase();
    let attempts = 0;
    const maxAttempts = 20;
    
    while (usedLetters.size < allLetters.size && attempts < maxAttempts) {
      attempts++;
      const lastLetter = currentWord[currentWord.length - 1];
      
      // Find words that start with the last letter
      const candidates = sortedWords
        .map(w => w.toUpperCase())
        .filter(w => w[0] === lastLetter && !chain.includes(w));
      
      if (candidates.length === 0) break;
      
      // Pick the word that adds the most new letters
      let bestWord = '';
      let bestNewLetters = 0;
      
      for (const candidate of candidates) {
        const newLetters = candidate.split('').filter(ch => !usedLetters.has(ch)).length;
        if (newLetters > bestNewLetters) {
          bestNewLetters = newLetters;
          bestWord = candidate;
        }
      }
      
      if (bestWord && bestNewLetters > 0) {
        chain.push(bestWord);
        bestWord.split('').forEach(ch => usedLetters.add(ch));
        currentWord = bestWord;
        
        if (usedLetters.size === allLetters.size) {
          solutions.push([...chain]);
          if (solutions.length >= maxSolutions) return solutions;
          break;
        }
      } else {
        break;
      }
    }
  }
  
  return solutions;
}

export function getDailyLetterBoxedPuzzle(): LetterBoxedPuzzle {
  return generateLetterBoxedPuzzle(getDailySeed());
}

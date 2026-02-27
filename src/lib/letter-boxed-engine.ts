import { DICTIONARY } from './dictionary';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { LetterBoxedPuzzle } from '@/types/games';

/**
 * Letter Boxed puzzle generator.
 * 
 * Rules:
 * - 12 letters arranged in a box (3 per side, 4 sides)
 * - Form words by connecting letters
 * - Cannot use consecutive letters from the same side
 * - Words must be at least 3 letters long
 * - Goal: Use all 12 letters (typically in 2-5 words)
 * - Each word after the first must start with the last letter of the previous word
 */

const VOWELS = 'aeiou'.split('');
const COMMON_CONSONANTS = 'rstlndcmphbgfywkvxzjq'.split('');

function getSideIndex(sides: string[][], letter: string): number {
  for (let i = 0; i < sides.length; i++) {
    if (sides[i].includes(letter)) return i;
  }
  return -1;
}

function isValidLetterBoxedWord(word: string, sides: string[][]): boolean {
  if (word.length < 3) return false;
  
  const letters = word.split('');
  const allLetters = sides.flat();
  
  // Check all letters are in the puzzle
  if (!letters.every(l => allLetters.includes(l))) return false;
  
  // Check consecutive letters aren't from the same side
  for (let i = 0; i < letters.length - 1; i++) {
    const side1 = getSideIndex(sides, letters[i]);
    const side2 = getSideIndex(sides, letters[i + 1]);
    if (side1 === side2) return false;
  }
  
  return true;
}

export function generateLetterBoxedPuzzle(seed: number): LetterBoxedPuzzle {
  const rng = seededRng(seed);
  
  // Shuffle letters
  const shuffledVowels = seededShuffle(VOWELS, seededRng(seed));
  const shuffledConsonants = seededShuffle(COMMON_CONSONANTS, seededRng(seed + 1));
  
  // Try to create a good mix: 3-4 vowels, 8-9 consonants
  const letters = [
    ...shuffledVowels.slice(0, 3),
    ...shuffledConsonants.slice(0, 9)
  ];
  
  // Shuffle all letters
  const allShuffled = seededShuffle(letters, seededRng(seed + 2));
  
  // Distribute into 4 sides of 3 letters each
  const sides: [string[], string[], string[], string[]] = [
    allShuffled.slice(0, 3),
    allShuffled.slice(3, 6),
    allShuffled.slice(6, 9),
    allShuffled.slice(9, 12)
  ];
  
  // Find valid words
  const validWords = DICTIONARY.filter(word => 
    isValidLetterBoxedWord(word.toLowerCase(), sides)
  );
  
  // Try to find a solution (words that use all letters, with chaining)
  const solution = findSolution(sides, validWords, seed);
  
  return {
    sides,
    validWords,
    solution
  };
}

function findSolution(sides: string[][], validWords: string[], seed: number): string[] {
  const allLetters = new Set(sides.flat());
  const maxAttempts = 1000;
  const rng = seededRng(seed + 999); // Use seeded RNG
  
  // Try to find a 2-3 word solution
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Start with a random long word
    const longWords = validWords.filter(w => w.length >= 6);
    if (longWords.length === 0) break;
    
    const startWord = longWords[Math.floor(rng() * longWords.length)];
    const used = new Set(startWord.split(''));
    const chain = [startWord];
    
    // Try to chain more words
    for (let i = 0; i < 5; i++) {
      const lastLetter = chain[chain.length - 1].slice(-1);
      const candidates = validWords.filter(w => 
        w[0] === lastLetter && 
        !chain.includes(w) &&
        w.split('').some(l => !used.has(l))
      );
      
      if (candidates.length === 0) break;
      
      // Pick the word that adds the most new letters
      const bestWord = candidates.reduce((best, word) => {
        const newLetters = word.split('').filter(l => !used.has(l)).length;
        const bestNew = best.split('').filter(l => !used.has(l)).length;
        return newLetters > bestNew ? word : best;
      });
      
      chain.push(bestWord);
      bestWord.split('').forEach(l => used.add(l));
      
      if (used.size === allLetters.size) {
        return chain;
      }
    }
    
    if (used.size === allLetters.size) {
      return chain;
    }
  }
  
  // Fallback: just return some valid words
  return validWords.slice(0, 3);
}

export function getDailyLetterBoxedPuzzle(): LetterBoxedPuzzle {
  return generateLetterBoxedPuzzle(getDailySeed());
}

export function getLetterBoxedPuzzleByDate(date: Date): LetterBoxedPuzzle {
  const EPOCH = new Date('2024-01-01').getTime();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const seed = Math.floor((targetDate.getTime() - EPOCH) / (1000 * 60 * 60 * 24));
  return generateLetterBoxedPuzzle(seed);
}

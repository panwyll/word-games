import { DICTIONARY } from './dictionary';
import { seededRng, seededShuffle, getDailySeed } from './daily';
import type { LetterBoxedPuzzle } from '@/types/games';

/**
 * Letter Boxed puzzle generator.
 * 
 * Rules:
 * - 12 letters arranged on 4 sides of a square (3 letters per side)
 * - Words must be ≥3 letters
 * - Cannot use consecutive letters from the same side
 * - Chain words: last letter of word N = first letter of word N+1
 * - Goal: Use all 12 letters in as few words as possible
 */

// Get the side index (0-3) for a given letter in the puzzle
function getSideIndex(letter: string, sides: string[][]): number {
  for (let i = 0; i < 4; i++) {
    if (sides[i].includes(letter)) return i;
  }
  return -1;
}

// Check if a word can be formed following the side-switching rule
function isValidWordForPuzzle(word: string, sides: string[][]): boolean {
  if (word.length < 3) return false;

  const allLetters = new Set(sides.flat());
  const letters = word.split('');

  // All letters must be in the puzzle
  if (!letters.every(l => allLetters.has(l))) return false;

  // Check side-switching rule: no consecutive letters from same side
  for (let i = 0; i < letters.length - 1; i++) {
    const side1 = getSideIndex(letters[i], sides);
    const side2 = getSideIndex(letters[i + 1], sides);
    if (side1 === side2) return false;
  }

  return true;
}

// Find all valid words for this puzzle
function findValidWords(sides: string[][], dictionary: string[]): string[] {
  return dictionary.filter(word => isValidWordForPuzzle(word, sides));
}

// Check if all letters are used in a word chain
function usesAllLetters(chain: string[], sides: string[][]): boolean {
  const allLetters = new Set(sides.flat());
  const usedLetters = new Set(chain.join('').split(''));
  return allLetters.size === usedLetters.size && 
         Array.from(allLetters).every(l => usedLetters.has(l));
}

// Find solution chains (BFS to find shortest solutions)
function findSolutions(validWords: string[], sides: string[][]): string[][] {
  const solutions: string[][] = [];
  const maxChainLength = 5; // NYT usually expects 2-5 words

  // Build adjacency map: word -> words that can follow it
  const canFollow = new Map<string, string[]>();
  for (const word of validWords) {
    canFollow.set(word, []);
    const lastLetter = word[word.length - 1];
    for (const nextWord of validWords) {
      if (nextWord[0] === lastLetter && nextWord !== word) {
        canFollow.get(word)!.push(nextWord);
      }
    }
  }

  // BFS to find solutions
  const queue: { chain: string[]; used: Set<string> }[] = [];
  
  // Start with each word
  for (const word of validWords) {
    queue.push({ chain: [word], used: new Set(word.split('')) });
  }

  while (queue.length > 0 && solutions.length < 10) {
    const { chain, used } = queue.shift()!;
    
    // Check if this chain uses all letters
    if (used.size === 12) {
      solutions.push(chain);
      if (solutions.length >= 10) break; // Found enough solutions
      continue;
    }

    // Don't go beyond max chain length
    if (chain.length >= maxChainLength) continue;

    // Try extending the chain
    const lastWord = chain[chain.length - 1];
    const followers = canFollow.get(lastWord) || [];
    
    for (const nextWord of followers) {
      const newUsed = new Set([...used, ...nextWord.split('')]);
      queue.push({ chain: [...chain, nextWord], used: newUsed });
    }
  }

  // Sort by chain length (prefer shorter solutions)
  return solutions.sort((a, b) => a.length - b.length);
}

// Generate a puzzle with good characteristics
function tryGeneratePuzzle(seed: number, attempt: number): LetterBoxedPuzzle | null {
  const rng = seededRng(seed + attempt * 1000);
  
  // Pick 12 distinct letters with good distribution
  // Prefer common letters for more word possibilities
  const commonLetters = 'EARIOTNSLCUDPMHGBFYWKVXZJQ'.split('');
  const shuffled = seededShuffle(commonLetters, rng);
  const selectedLetters = shuffled.slice(0, 12);
  
  // Arrange into 4 sides of 3 letters each
  const sides: [string[], string[], string[], string[]] = [
    selectedLetters.slice(0, 3),
    selectedLetters.slice(3, 6),
    selectedLetters.slice(6, 9),
    selectedLetters.slice(9, 12),
  ];

  // Find valid words
  const validWords = findValidWords(sides, DICTIONARY);
  
  // Need at least 30 valid words for a good puzzle
  if (validWords.length < 30) return null;

  // Try to find solutions
  const solutions = findSolutions(validWords, sides);
  
  // Need at least one solution
  if (solutions.length === 0) return null;

  return {
    sides,
    validWords,
    solutions,
  };
}

export function generateLetterBoxedPuzzle(seed: number): LetterBoxedPuzzle {
  // Try multiple times to generate a good puzzle
  for (let attempt = 0; attempt < 100; attempt++) {
    const puzzle = tryGeneratePuzzle(seed, attempt);
    if (puzzle) return puzzle;
  }

  // Fallback puzzle if generation fails
  return buildFallbackPuzzle();
}

// Fallback puzzle with known good letters
function buildFallbackPuzzle(): LetterBoxedPuzzle {
  const sides: [string[], string[], string[], string[]] = [
    ['R', 'O', 'T'],
    ['E', 'A', 'N'],
    ['S', 'I', 'L'],
    ['C', 'D', 'M'],
  ];

  const validWords = findValidWords(sides, DICTIONARY);
  const solutions = findSolutions(validWords, sides);

  return {
    sides,
    validWords,
    solutions,
  };
}

export function getDailyLetterBoxedPuzzle(): LetterBoxedPuzzle {
  return generateLetterBoxedPuzzle(getDailySeed());
}

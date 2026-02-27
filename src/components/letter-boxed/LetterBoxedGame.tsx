'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import LetterBoxedBox from './LetterBoxedBox';
import type { LetterBoxedPuzzle } from '@/types/games';
import { getDailyLetterBoxedPuzzle } from '@/lib/letter-boxed-engine';

// Get the side index (0-3) for a given letter in the puzzle
function getSideIndex(letter: string, sides: string[][]): number {
  for (let i = 0; i < 4; i++) {
    if (sides[i].includes(letter)) return i;
  }
  return -1;
}

// Check if a word follows the side-switching rule
function isValidSideSwitching(word: string, sides: string[][]): boolean {
  if (word.length < 2) return true;

  const letters = word.split('');
  for (let i = 0; i < letters.length - 1; i++) {
    const side1 = getSideIndex(letters[i], sides);
    const side2 = getSideIndex(letters[i + 1], sides);
    if (side1 === side2) return false;
  }
  return true;
}

export default function LetterBoxedGame({ overridePuzzle }: { overridePuzzle?: LetterBoxedPuzzle } = {}) {
  const puzzle: LetterBoxedPuzzle = overridePuzzle ?? getDailyLetterBoxedPuzzle();
  
  const allLetters = useMemo(
    () => new Set(puzzle.sides.flat()),
    [puzzle.sides]
  );

  const [currentWord, setCurrentWord] = useState('');
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);

  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  // Check if all letters have been used
  useEffect(() => {
    if (usedLetters.size === 12 && !gameComplete) {
      setGameComplete(true);
      showMessage(`🎉 Puzzle solved in ${submittedWords.length} words!`, 5000);
    }
  }, [usedLetters, submittedWords.length, gameComplete]);

  const submitWord = useCallback(() => {
    const word = currentWord.toUpperCase();

    if (word.length < 3) {
      showMessage('Word must be at least 3 letters');
      return;
    }

    // Check if word uses only puzzle letters
    if (word.split('').some(l => !allLetters.has(l))) {
      showMessage('Word contains letters not in puzzle');
      return;
    }

    // Check side-switching rule
    if (!isValidSideSwitching(word, puzzle.sides)) {
      showMessage('Cannot use consecutive letters from same side');
      return;
    }

    // Check if word is in valid word list
    const validWordsUpper = puzzle.validWords.map(w => w.toUpperCase());
    if (!validWordsUpper.includes(word)) {
      showMessage('Not in word list');
      return;
    }

    // Check if this is not the first word - must chain with previous
    if (submittedWords.length > 0) {
      const lastWord = submittedWords[submittedWords.length - 1];
      const lastLetter = lastWord[lastWord.length - 1];
      if (word[0] !== lastLetter) {
        showMessage(`Word must start with "${lastLetter}"`);
        return;
      }
    }

    // Check if word already used
    if (submittedWords.includes(word)) {
      showMessage('Word already used');
      return;
    }

    // Valid word!
    setSubmittedWords(prev => [...prev, word]);
    setUsedLetters(prev => new Set([...prev, ...word.split('')]));
    setCurrentWord('');
    
    const newUsedCount = new Set([...usedLetters, ...word.split('')]).size;
    showMessage(`✓ ${word} (+${word.split('').filter(l => !usedLetters.has(l)).length} new letters)`);
  }, [currentWord, puzzle, allLetters, submittedWords, usedLetters]);

  const handleLetterClick = useCallback((letter: string) => {
    setCurrentWord(prev => prev + letter);
  }, []);

  const handleBackspace = useCallback(() => {
    setCurrentWord(prev => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setCurrentWord('');
  }, []);

  const handleUndo = useCallback(() => {
    if (submittedWords.length === 0) return;
    
    const lastWord = submittedWords[submittedWords.length - 1];
    setSubmittedWords(prev => prev.slice(0, -1));
    
    // Recalculate used letters from remaining words
    const remainingWords = submittedWords.slice(0, -1);
    const newUsed = new Set(remainingWords.join('').split(''));
    setUsedLetters(newUsed);
    setGameComplete(false);
    showMessage('Undid last word');
  }, [submittedWords]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (key === 'ENTER') {
        e.preventDefault();
        submitWord();
      } else if (key === 'BACKSPACE') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'ESCAPE') {
        e.preventDefault();
        handleClear();
      } else if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        if (allLetters.has(key)) {
          handleLetterClick(key);
        }
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [submitWord, handleBackspace, handleClear, handleLetterClick, allLetters]);

  const remainingLetters = Array.from(allLetters).filter(l => !usedLetters.has(l));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-500">
            {usedLetters.size} / 12 letters
          </span>
          <span className="text-sm font-bold">
            {submittedWords.length} word{submittedWords.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(usedLetters.size / 12) * 100}%` }}
          />
        </div>
        {remainingLetters.length > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Remaining: {remainingLetters.join(', ')}
          </div>
        )}
      </div>

      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium" role="alert">
          {message}
        </div>
      )}

      {/* Current word input */}
      <div className="relative text-3xl font-bold tracking-widest uppercase min-h-[2.5rem] text-center border-b-2 border-gray-400 w-full max-w-xs pb-1">
        {currentWord || <span className="text-gray-400">Type or click letters</span>}
        {currentWord && <span className="animate-pulse">|</span>}
      </div>

      {/* Letter box */}
      <LetterBoxedBox
        sides={puzzle.sides}
        currentWord={currentWord}
        onLetterClick={handleLetterClick}
      />

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleBackspace}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete"
        >
          ⌫ Delete
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={submitWord}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
          data-testid="submit-word"
        >
          Submit Word
        </button>
        {submittedWords.length > 0 && !gameComplete && (
          <button
            onClick={handleUndo}
            className="px-4 py-2 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-full font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            ↶ Undo
          </button>
        )}
      </div>

      {/* Submitted words */}
      {submittedWords.length > 0 && (
        <div className="w-full max-w-sm">
          <div className="text-sm font-medium text-gray-500 mb-2">Your words:</div>
          <div className="flex flex-col gap-1">
            {submittedWords.map((word, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-gray-400 font-mono">{i + 1}.</span>
                <span className="font-medium">{word}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {word.split('').filter((l, idx) => {
                    const prevWords = submittedWords.slice(0, i).join('');
                    return !prevWords.includes(l);
                  }).length} new
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameComplete && (
        <div className="w-full max-w-sm p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-bold mb-1">Puzzle Complete!</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              You solved it in {submittedWords.length} word{submittedWords.length !== 1 ? 's' : ''}!
            </div>
            {puzzle.solutions.length > 0 && (
              <details className="mt-3 text-left">
                <summary className="text-sm cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                  Show example solutions
                </summary>
                <div className="mt-2 space-y-1 text-sm">
                  {puzzle.solutions.slice(0, 3).map((solution, i) => (
                    <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
                      {solution.length} words: {solution.join(' → ')}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

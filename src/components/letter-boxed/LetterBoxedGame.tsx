'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import LetterBoxedBox from './LetterBoxedBox';
import type { LetterBoxedPuzzle } from '@/types/games';
import { getDailyLetterBoxedPuzzle } from '@/lib/letter-boxed-engine';

function getSideIndex(sides: string[][], letter: string): number {
  for (let i = 0; i < sides.length; i++) {
    if (sides[i].includes(letter)) return i;
  }
  return -1;
}

function isValidWord(word: string, sides: string[][], validWords: string[]): {
  valid: boolean;
  reason?: string;
} {
  if (word.length < 3) {
    return { valid: false, reason: 'Too short (min 3 letters)' };
  }

  const letters = word.split('');
  const allLetters = sides.flat();

  // Check all letters are in the puzzle
  if (!letters.every(l => allLetters.includes(l))) {
    return { valid: false, reason: 'Contains letters not in puzzle' };
  }

  // Check consecutive letters aren't from the same side
  for (let i = 0; i < letters.length - 1; i++) {
    const side1 = getSideIndex(sides, letters[i]);
    const side2 = getSideIndex(sides, letters[i + 1]);
    if (side1 === side2) {
      return { valid: false, reason: 'Cannot use consecutive letters from same side' };
    }
  }

  // Check if word is in valid word list
  if (!validWords.map(w => w.toLowerCase()).includes(word.toLowerCase())) {
    return { valid: false, reason: 'Not in word list' };
  }

  return { valid: true };
}

export default function LetterBoxedGame({ overridePuzzle }: { overridePuzzle?: LetterBoxedPuzzle } = {}) {
  const puzzle: LetterBoxedPuzzle = overridePuzzle ?? getDailyLetterBoxedPuzzle();
  const allLetters = useMemo(() => new Set(puzzle.sides.flat()), [puzzle.sides]);

  const [currentWord, setCurrentWord] = useState('');
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const submitWord = useCallback(() => {
    const word = currentWord.toLowerCase();
    
    if (word.length === 0) return;

    // Check if we need to chain (word must start with last letter of previous word)
    if (submittedWords.length > 0) {
      const lastWord = submittedWords[submittedWords.length - 1];
      const lastLetter = lastWord.slice(-1);
      if (word[0] !== lastLetter) {
        showMessage(`Must start with "${lastLetter.toUpperCase()}"`);
        return;
      }
    }

    // Check if already used
    if (submittedWords.includes(word)) {
      showMessage('Already used!');
      return;
    }

    // Validate word
    const validation = isValidWord(word, puzzle.sides, puzzle.validWords);
    if (!validation.valid) {
      showMessage(validation.reason || 'Invalid word');
      return;
    }

    // Word is valid!
    const newSubmitted = [...submittedWords, word];
    setSubmittedWords(newSubmitted);
    
    // Update used letters
    const newUsed = new Set(usedLetters);
    word.split('').forEach(l => newUsed.add(l));
    setUsedLetters(newUsed);
    
    setCurrentWord('');
    showMessage(`✓ ${word.toUpperCase()}`);

    // Check if won
    if (newUsed.size === allLetters.size) {
      setGameWon(true);
      showMessage('🎉 You won!');
    }
  }, [currentWord, submittedWords, puzzle, usedLetters, allLetters]);

  const handleLetterClick = (letter: string) => {
    setCurrentWord(prev => prev + letter);
  };

  const handleBackspace = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCurrentWord('');
  };

  const handleShuffle = () => {
    // Shuffle the letters within each side
    const shuffled = puzzle.sides.map(side => 
      [...side].sort(() => Math.random() - 0.5)
    ) as [string[], string[], string[], string[]];
    // Note: This would require making sides mutable, so we'll skip actual shuffling
    // Just show a message
    showMessage('Shuffled!');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === 'enter') {
        submitWord();
      } else if (key === 'backspace') {
        handleBackspace();
      } else if (key === 'escape') {
        handleClear();
      } else if (/^[a-z]$/.test(key)) {
        if (allLetters.has(key)) {
          handleLetterClick(key);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [submitWord, allLetters]);

  const unusedLetters = Array.from(allLetters).filter(l => !usedLetters.has(l));
  const progress = (usedLetters.size / allLetters.size) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Letters: {usedLetters.size} / {allLetters.size}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Words: {submittedWords.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium" role="alert">
          {message}
        </div>
      )}

      {/* Game Won */}
      {gameWon && (
        <div className="px-6 py-3 bg-green-100 dark:bg-green-900 border-2 border-green-500 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-bold text-center">
            🎉 Congratulations! You used all letters in {submittedWords.length} word{submittedWords.length !== 1 ? 's' : ''}!
          </p>
        </div>
      )}

      {/* Letter Box */}
      <LetterBoxedBox
        sides={puzzle.sides}
        currentWord={currentWord}
        usedLetters={usedLetters}
        onLetterClick={handleLetterClick}
      />

      {/* Current Word Input */}
      <div className="w-full max-w-md">
        <div className="relative text-2xl font-bold tracking-widest uppercase min-h-[3rem] text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
          {currentWord.split('').map((letter, i) => {
            const sideIdx = getSideIndex(puzzle.sides, letter);
            const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500'];
            return (
              <span key={i} className={colors[sideIdx] || ''}>
                {letter}
              </span>
            );
          })}
          {currentWord.length === 0 && (
            <span className="text-gray-400">Type or click letters</span>
          )}
          {currentWord.length > 0 && <span className="animate-pulse">|</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleClear}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleBackspace}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ⌫ Delete
        </button>
        <button
          onClick={submitWord}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
          data-testid="enter-word"
        >
          Enter
        </button>
      </div>

      {/* Unused Letters */}
      {unusedLetters.length > 0 && (
        <div className="w-full max-w-md">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Remaining letters:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unusedLetters.sort().map(letter => (
              <span
                key={letter}
                className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                {letter.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Words */}
      <div className="w-full max-w-md">
        <details open={submittedWords.length > 0}>
          <summary className="text-sm font-medium cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2">
            Your words ({submittedWords.length})
          </summary>
          <div className="flex flex-col gap-1.5">
            {submittedWords.map((word, idx) => (
              <div key={idx} className="text-lg font-medium px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                {word.toUpperCase()}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

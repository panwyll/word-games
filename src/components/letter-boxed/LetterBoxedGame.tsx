'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import LetterBoxedBox from './LetterBoxedBox';
import type { LetterBoxedPuzzle } from '@/types/games';
import { getDailyLetterBoxedPuzzle } from '@/lib/letter-boxed-engine';

export default function LetterBoxedGame({ overridePuzzle }: { overridePuzzle?: LetterBoxedPuzzle } = {}) {
  const puzzle: LetterBoxedPuzzle = overridePuzzle ?? getDailyLetterBoxedPuzzle();
  
  // Create a map of which side each letter belongs to
  const letterToSide = useMemo(() => {
    const map = new Map<string, number>();
    puzzle.sides.forEach((side, sideIndex) => {
      side.forEach(letter => {
        map.set(letter, sideIndex);
      });
    });
    return map;
  }, [puzzle.sides]);
  
  const allLetters = useMemo(
    () => new Set(puzzle.sides.flat()),
    [puzzle.sides]
  );
  
  const [input, setInput] = useState('');
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };
  
  const validateWord = useCallback((word: string): string | null => {
    if (word.length < 3) return 'Too short (min 3 letters)';
    
    // Check if word only uses available letters
    const wordLetters = word.split('');
    if (!wordLetters.every(ch => allLetters.has(ch))) {
      return 'Word contains invalid letters';
    }
    
    // Check that no two consecutive letters are from the same side
    for (let i = 0; i < wordLetters.length - 1; i++) {
      const side1 = letterToSide.get(wordLetters[i]);
      const side2 = letterToSide.get(wordLetters[i + 1]);
      if (side1 === side2) {
        return 'Cannot use consecutive letters from same side';
      }
    }
    
    // Check if word is in the valid word list
    if (!puzzle.validWords.map(w => w.toUpperCase()).includes(word)) {
      return 'Not in word list';
    }
    
    // Check if word has already been used
    if (submittedWords.includes(word)) {
      return 'Already used this word';
    }
    
    // If we have previous words, check if this word starts with the last letter of the previous word
    if (submittedWords.length > 0) {
      const lastWord = submittedWords[submittedWords.length - 1];
      const lastLetter = lastWord[lastWord.length - 1];
      if (word[0] !== lastLetter) {
        return `Word must start with '${lastLetter}'`;
      }
    }
    
    return null; // Valid
  }, [allLetters, letterToSide, puzzle.validWords, submittedWords]);
  
  const submitWord = useCallback(() => {
    const word = input.toUpperCase();
    const error = validateWord(word);
    
    if (error) {
      showMessage(error);
      return;
    }
    
    // Word is valid, add it
    const newUsedLetters = new Set(usedLetters);
    word.split('').forEach(ch => newUsedLetters.add(ch));
    
    setSubmittedWords(prev => [...prev, word]);
    setUsedLetters(newUsedLetters);
    setInput('');
    
    // Check if all letters are used
    if (newUsedLetters.size === allLetters.size) {
      setGameWon(true);
      showMessage(`🎉 You won in ${submittedWords.length + 1} word${submittedWords.length === 0 ? '' : 's'}!`);
    } else {
      showMessage(`Great! ${newUsedLetters.size}/${allLetters.size} letters used`);
    }
  }, [input, validateWord, usedLetters, allLetters.size, submittedWords.length]);
  
  const handleLetterClick = useCallback((letter: string) => {
    if (gameWon) return;
    setInput(prev => prev + letter);
  }, [gameWon]);
  
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameWon) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
      submitWord();
    } else if (key === 'BACKSPACE') {
      setInput(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && allLetters.has(key)) {
      setInput(prev => prev + key);
    }
  }, [gameWon, submitWord, allLetters]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Letters used: {usedLetters.size} / {allLetters.size}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Words: {submittedWords.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(usedLetters.size / allLetters.size) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Message display */}
      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium" role="alert">
          {message}
        </div>
      )}
      
      {/* Input display */}
      <div className="relative text-3xl font-bold tracking-widest uppercase min-h-[2.5rem] text-center border-b-2 border-gray-400 w-full max-w-md pb-1">
        {input || (
          <span className="text-gray-400">
            {submittedWords.length > 0
              ? `Start with '${submittedWords[submittedWords.length - 1].slice(-1)}'`
              : 'Type a word'}
          </span>
        )}
        {input && <span className="animate-pulse">|</span>}
      </div>
      
      {/* Letter box */}
      <LetterBoxedBox
        sides={puzzle.sides}
        usedLetters={usedLetters}
        onLetterClick={handleLetterClick}
      />
      
      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => setInput(prev => prev.slice(0, -1))}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete"
        >
          ⌫ Delete
        </button>
        <button
          onClick={() => setInput('')}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Clear"
        >
          Clear
        </button>
        <button
          onClick={submitWord}
          className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="enter-word"
        >
          Enter
        </button>
      </div>
      
      {/* Submitted words */}
      {submittedWords.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Your words:
          </h3>
          <div className="flex flex-wrap gap-2">
            {submittedWords.map((word, i) => (
              <span
                key={i}
                className="text-lg px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full font-medium"
              >
                {word.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Show solution hint after winning */}
      {gameWon && puzzle.solutions.length > 0 && (
        <div className="w-full max-w-md mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-bold text-green-800 dark:text-green-200 mb-2">
            ✨ Possible {puzzle.solutions[0].length}-word solution:
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            {puzzle.solutions[0].map(w => w.toLowerCase()).join(' → ')}
          </p>
        </div>
      )}
    </div>
  );
}

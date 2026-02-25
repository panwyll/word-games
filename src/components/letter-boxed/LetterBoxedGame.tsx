'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import LetterBoxedBox from './LetterBoxedBox';
import type { LetterBoxedPuzzle } from '@/types/games';
import { getDailyLetterBoxedPuzzle } from '@/lib/letter-boxed-engine';

export default function LetterBoxedGame({ overridePuzzle }: { overridePuzzle?: LetterBoxedPuzzle } = {}) {
  const puzzle = overridePuzzle ?? getDailyLetterBoxedPuzzle();
  
  const [currentWord, setCurrentWord] = useState('');
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  
  const allLetters = useMemo(() => {
    return new Set(puzzle.sides.flat().map(l => l.toUpperCase()));
  }, [puzzle.sides]);
  
  const remainingLetters = useMemo(() => {
    return Array.from(allLetters).filter(l => !usedLetters.has(l));
  }, [allLetters, usedLetters]);
  
  const showMessage = (msg: string, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };
  
  const handleLetterClick = useCallback((letter: string) => {
    if (gameWon) return;
    setCurrentWord(prev => prev + letter);
  }, [gameWon]);
  
  const handleBackspace = useCallback(() => {
    setCurrentWord(prev => prev.slice(0, -1));
  }, []);
  
  const submitWord = useCallback(() => {
    const word = currentWord.toUpperCase();
    
    if (word.length < 3) {
      showMessage('Word must be at least 3 letters');
      return;
    }
    
    // Check if word is in valid word list
    const validUpper = puzzle.validWords.map(w => w.toUpperCase());
    if (!validUpper.includes(word)) {
      showMessage('Not in word list');
      return;
    }
    
    // Check if word was already used
    if (submittedWords.map(w => w.toUpperCase()).includes(word)) {
      showMessage('Already used!');
      return;
    }
    
    // If there are previous words, check if this word starts with the last letter of previous word
    if (submittedWords.length > 0) {
      const lastWord = submittedWords[submittedWords.length - 1];
      const lastLetter = lastWord[lastWord.length - 1].toUpperCase();
      if (word[0] !== lastLetter) {
        showMessage(`Must start with "${lastLetter}"`);
        return;
      }
    }
    
    // Word is valid! Add it to submitted words
    const newSubmittedWords = [...submittedWords, word];
    setSubmittedWords(newSubmittedWords);
    
    // Update used letters
    const newUsedLetters = new Set(usedLetters);
    word.split('').forEach(letter => newUsedLetters.add(letter));
    setUsedLetters(newUsedLetters);
    
    setCurrentWord('');
    
    // Check if all letters have been used
    if (newUsedLetters.size === allLetters.size) {
      setGameWon(true);
      showMessage(`🎉 You won in ${newSubmittedWords.length} word${newSubmittedWords.length > 1 ? 's' : ''}!`, 3000);
    } else {
      showMessage('✓ Word added!');
    }
  }, [currentWord, puzzle.validWords, submittedWords, usedLetters, allLetters]);
  
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameWon) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
      submitWord();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (/^[A-Z]$/.test(key)) {
      if (allLetters.has(key)) {
        handleLetterClick(key);
      }
    }
  }, [gameWon, submitWord, handleBackspace, handleLetterClick, allLetters]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  
  const handleShare = () => {
    const text = `Letter Boxed - ${submittedWords.length} word${submittedWords.length > 1 ? 's' : ''}\n\n${submittedWords.join(' → ')}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    showMessage('Copied to clipboard!');
  };
  
  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Message */}
      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium animate-bounce" role="alert">
          {message}
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Letters used: {usedLetters.size} / {allLetters.size}
        </div>
        <div className="flex gap-1 justify-center mt-1 flex-wrap max-w-xs">
          {Array.from(allLetters).sort().map(letter => (
            <span
              key={letter}
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
                usedLetters.has(letter)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      
      {/* The box */}
      <LetterBoxedBox
        sides={puzzle.sides}
        currentWord={currentWord}
        onLetterClick={handleLetterClick}
        disabled={gameWon}
      />
      
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleBackspace}
          disabled={currentWord.length === 0 || gameWon}
          className="px-6 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ⌫ Delete
        </button>
        <button
          onClick={submitWord}
          disabled={currentWord.length < 3 || gameWon}
          className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Enter ↵
        </button>
      </div>
      
      {/* Submitted words list */}
      {submittedWords.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Your words ({submittedWords.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {submittedWords.map((word, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Remaining letters hint */}
      {!gameWon && remainingLetters.length > 0 && remainingLetters.length <= 4 && (
        <div className="text-sm text-amber-600 dark:text-amber-400">
          💡 Still need: {remainingLetters.sort().join(', ')}
        </div>
      )}
      
      {/* Win state */}
      {gameWon && (
        <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You used all letters in {submittedWords.length} word{submittedWords.length > 1 ? 's' : ''}!
          </p>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Share Result
          </button>
        </div>
      )}
    </div>
  );
}

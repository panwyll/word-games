'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SpellingBeeHive from './SpellingBeeHive';
import type { SpellingBeePuzzle } from '@/types/games';
import { getDailySpellingBeePuzzle } from '@/lib/spelling-bee-engine';

function getScore(word: string, isPangram: boolean): number {
  if (word.length === 4) return 1;
  let score = word.length;
  if (isPangram) score += 7;
  return score;
}

function getRank(score: number, maxScore: number): string {
  const pct = maxScore > 0 ? score / maxScore : 0;
  if (pct >= 1) return 'Queen Bee 👑';
  if (pct >= 0.7) return 'Amazing';
  if (pct >= 0.5) return 'Great';
  if (pct >= 0.35) return 'Nice';
  if (pct >= 0.2) return 'Solid';
  if (pct >= 0.1) return 'Good';
  if (pct >= 0.05) return 'Moving Up';
  return 'Beginner';
}

export default function SpellingBeeGame({ overridePuzzle }: { overridePuzzle?: SpellingBeePuzzle } = {}) {
  const puzzle: SpellingBeePuzzle = overridePuzzle ?? getDailySpellingBeePuzzle();
  const allLetters = useMemo(
    () => new Set([puzzle.centerLetter.toUpperCase(), ...puzzle.outerLetters.map(l => l.toUpperCase())]),
    [puzzle.centerLetter, puzzle.outerLetters]
  );

  const [input, setInput] = useState('');
  const [found, setFound] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const maxScore = puzzle.validWords.reduce((acc, word) => {
    const isPangram = puzzle.pangrams.map(p => p.toUpperCase()).includes(word.toUpperCase());
    return acc + getScore(word, isPangram);
  }, 0);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 1500);
  };

  const submitWord = useCallback(() => {
    const word = input.toUpperCase();

    if (word.length < 4) { showMessage('Too short'); setInput(''); return; }
    if (!word.includes(puzzle.centerLetter.toUpperCase())) { showMessage('Missing center letter'); setInput(''); return; }
    if (word.split('').some(l => !allLetters.has(l))) { showMessage('Bad letters'); setInput(''); return; }
    if (found.includes(word)) { showMessage('Already found!'); setInput(''); return; }

    const validUpper = puzzle.validWords.map(w => w.toUpperCase());
    if (!validUpper.includes(word)) { showMessage('Not in word list'); setInput(''); return; }

    const isPangram = puzzle.pangrams.map(p => p.toUpperCase()).includes(word);
    const pts = getScore(word, isPangram);
    setFound(prev => [...prev, word]);
    setScore(prev => prev + pts);
    setInput('');

    if (isPangram) showMessage(`Pangram! +${pts} pts ✨`);
    else if (pts >= 5) showMessage(`Excellent! +${pts} pts`);
    else showMessage(`+${pts} pt${pts > 1 ? 's' : ''}`);
  }, [input, found, puzzle, allLetters]);

  const handleKey = useCallback((key: string) => {
    if (key === 'ENTER') {
      submitWord();
    } else if (key === 'BACKSPACE' || key === '⌫') {
      setInput(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (allLetters.has(key)) {
        setInput(prev => prev + key);
      } else {
        showMessage('Not in puzzle letters');
      }
    }
  }, [submitWord, allLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const rank = getRank(score, maxScore);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-500">{rank}</span>
          <span className="text-sm font-bold">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0}%` }}
          />
        </div>
      </div>

      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium" role="alert">
          {message}
        </div>
      )}

      <div className="relative text-3xl font-bold tracking-widest uppercase min-h-[2.5rem] text-center border-b-2 border-gray-400 w-full max-w-xs pb-1">
        {input.split('').map((letter, i) => (
          <span
            key={i}
            className={letter === puzzle.centerLetter.toUpperCase() ? 'text-yellow-500' : ''}
          >
            {letter}
          </span>
        ))}
        <span className="animate-pulse">|</span>
      </div>

      <SpellingBeeHive
        centerLetter={puzzle.centerLetter.toUpperCase()}
        outerLetters={puzzle.outerLetters.map(l => l.toUpperCase())}
        onLetter={(l) => setInput(prev => prev + l)}
      />

      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => setInput(prev => prev.slice(0, -1))}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Delete"
        >
          ⌫ Delete
        </button>
        <button
          onClick={submitWord}
          className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="enter-word"
        >
          Enter
        </button>
      </div>

      <div className="w-full max-w-sm">
        <details>
          <summary className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-2">
            Found words ({found.length})
          </summary>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
            {[...found].sort().map(word => (
              <span
                key={word}
                className={`text-sm px-2 py-0.5 rounded-full ${puzzle.pangrams.map(p => p.toUpperCase()).includes(word) ? 'bg-yellow-200 dark:bg-yellow-800 font-bold' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                {word.toLowerCase()}
              </span>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

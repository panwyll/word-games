'use client';

import { useState, useEffect, useCallback } from 'react';
import WordleBoard from './WordleBoard';
import WordleKeyboard from './WordleKeyboard';
import WordleResult from './WordleResult';
import type { WordleGuess, LetterState } from '@/types/games';
import { VALID_ANSWERS, VALID_GUESSES } from '@/lib/wordle-words';
import { getDailyIndex } from '@/lib/daily';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function WordleGame() {
  const answer = VALID_ANSWERS[getDailyIndex(VALID_ANSWERS.length)].toUpperCase();
  const [guesses, setGuesses] = useState<WordleGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem('wordle-streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  const letterStates = useCallback((): Record<string, LetterState> => {
    const states: Record<string, LetterState> = {};
    for (const guess of guesses) {
      guess.word.split('').forEach((letter, i) => {
        const current = states[letter];
        const newState = guess.states[i];
        if (current === 'correct') return;
        if (newState === 'correct') { states[letter] = 'correct'; return; }
        if (current === 'present') return;
        states[letter] = newState;
      });
    }
    return states;
  }, [guesses]);

  const evaluateGuess = useCallback((word: string): WordleGuess => {
    const states: LetterState[] = Array(WORD_LENGTH).fill('absent');
    const answerArr = answer.split('');
    const wordArr = word.split('');
    const used = Array(WORD_LENGTH).fill(false);

    // First pass: correct
    wordArr.forEach((letter, i) => {
      if (letter === answerArr[i]) {
        states[i] = 'correct';
        used[i] = true;
      }
    });

    // Second pass: present
    wordArr.forEach((letter, i) => {
      if (states[i] === 'correct') return;
      const idx = answerArr.findIndex((a, j) => a === letter && !used[j]);
      if (idx !== -1) {
        states[i] = 'present';
        used[idx] = true;
      }
    });

    return { word, states };
  }, [answer]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 1500);
  };

  const submitGuess = useCallback((currentGuessValue: string, currentGuesses: WordleGuess[], currentStreak: number) => {
    if (currentGuessValue.length !== WORD_LENGTH) {
      showMessage('Not enough letters');
      return;
    }

    const allValid = [...VALID_ANSWERS, ...VALID_GUESSES].map(w => w.toUpperCase());
    if (!allValid.includes(currentGuessValue)) {
      showMessage('Not in word list');
      return;
    }

    const guess = evaluateGuess(currentGuessValue);
    const newGuesses = [...currentGuesses, guess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuessValue === answer) {
      const newStreak = currentStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('wordle-streak', String(newStreak));
      setWon(true);
      setGameOver(true);
      setTimeout(() => setShowResult(true), 1600);
    } else if (newGuesses.length >= MAX_GUESSES) {
      localStorage.setItem('wordle-streak', '0');
      setStreak(0);
      setGameOver(true);
      setTimeout(() => setShowResult(true), 1600);
    }
  }, [answer, evaluateGuess]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') {
      submitGuess(currentGuess, guesses, streak);
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameOver, submitGuess, currentGuess, guesses, streak]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      handleKey(key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const handleShare = () => {
    const emojiGrid = guesses.map(g =>
      g.states.map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
    ).join('\n');
    const text = `Wordle ${guesses.length}/${MAX_GUESSES}\n\n${emojiGrid}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    showMessage('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {streak > 0 && (
        <div className="text-sm text-gray-500">🔥 Streak: {streak}</div>
      )}
      {message && (
        <div className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium animate-bounce" role="alert">
          {message}
        </div>
      )}
      <WordleBoard guesses={guesses} currentGuess={currentGuess} maxGuesses={MAX_GUESSES} />
      <WordleKeyboard letterStates={letterStates()} onKey={handleKey} />
      {showResult && (
        <WordleResult
          won={won}
          answer={answer}
          guessCount={guesses.length}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

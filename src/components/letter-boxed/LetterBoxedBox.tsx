'use client';

import type { LetterBoxedPuzzle } from '@/types/games';

interface LetterBoxedBoxProps {
  sides: [string[], string[], string[], string[]];
  currentWord: string;
  onLetterClick: (letter: string) => void;
}

export default function LetterBoxedBox({ sides, currentWord, onLetterClick }: LetterBoxedBoxProps) {
  const [top, right, bottom, left] = sides;

  // Determine which letters are used in current word
  const usedLetters = new Set(currentWord.split(''));

  const renderLetter = (letter: string, index: number) => {
    const isUsed = usedLetters.has(letter);
    return (
      <button
        key={`${letter}-${index}`}
        onClick={() => onLetterClick(letter)}
        className={`w-12 h-12 text-xl font-bold rounded-lg transition-all duration-200 ${
          isUsed
            ? 'bg-blue-500 text-white scale-95'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
        }`}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="relative w-80 h-80">
      {/* Square border */}
      <div className="absolute inset-0 border-4 border-gray-400 dark:border-gray-600 rounded-lg" />

      {/* Top side */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
        {top.map((letter, i) => renderLetter(letter, i))}
      </div>

      {/* Right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {right.map((letter, i) => renderLetter(letter, i))}
      </div>

      {/* Bottom side */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bottom.map((letter, i) => renderLetter(letter, i))}
      </div>

      {/* Left side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {left.map((letter, i) => renderLetter(letter, i))}
      </div>
    </div>
  );
}

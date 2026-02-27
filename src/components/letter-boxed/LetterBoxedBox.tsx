'use client';

interface LetterBoxedBoxProps {
  sides: [string[], string[], string[], string[]];
  currentWord: string;
  usedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
}

export default function LetterBoxedBox({ sides, currentWord, usedLetters, onLetterClick }: LetterBoxedBoxProps) {
  const colors = [
    'bg-red-500 hover:bg-red-600',
    'bg-blue-500 hover:bg-blue-600',
    'bg-green-500 hover:bg-green-600',
    'bg-yellow-500 hover:bg-yellow-600'
  ];

  return (
    <div className="relative w-full max-w-md aspect-square">
      {/* The Box */}
      <div className="absolute inset-8 border-4 border-gray-300 dark:border-gray-600 rounded-lg" />

      {/* Top Side */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
        {sides[0].map((letter, idx) => (
          <button
            key={`top-${idx}`}
            onClick={() => onLetterClick(letter)}
            className={`w-16 h-16 ${colors[0]} text-white text-2xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              usedLetters.has(letter) ? 'opacity-50' : ''
            } ${currentWord.slice(-1) === letter ? 'ring-4 ring-white' : ''}`}
            aria-label={`Letter ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {sides[1].map((letter, idx) => (
          <button
            key={`right-${idx}`}
            onClick={() => onLetterClick(letter)}
            className={`w-16 h-16 ${colors[1]} text-white text-2xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              usedLetters.has(letter) ? 'opacity-50' : ''
            } ${currentWord.slice(-1) === letter ? 'ring-4 ring-white' : ''}`}
            aria-label={`Letter ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bottom Side */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {sides[2].map((letter, idx) => (
          <button
            key={`bottom-${idx}`}
            onClick={() => onLetterClick(letter)}
            className={`w-16 h-16 ${colors[2]} text-white text-2xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              usedLetters.has(letter) ? 'opacity-50' : ''
            } ${currentWord.slice(-1) === letter ? 'ring-4 ring-white' : ''}`}
            aria-label={`Letter ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {sides[3].map((letter, idx) => (
          <button
            key={`left-${idx}`}
            onClick={() => onLetterClick(letter)}
            className={`w-16 h-16 ${colors[3]} text-white text-2xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              usedLetters.has(letter) ? 'opacity-50' : ''
            } ${currentWord.slice(-1) === letter ? 'ring-4 ring-white' : ''}`}
            aria-label={`Letter ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

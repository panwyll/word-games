interface LetterBoxedBoxProps {
  sides: [string[], string[], string[], string[]];
  usedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
}

export default function LetterBoxedBox({ sides, usedLetters, onLetterClick }: LetterBoxedBoxProps) {
  const [top, right, bottom, left] = sides;

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Top side */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
        {top.map((letter, i) => (
          <button
            key={`top-${i}`}
            onClick={() => onLetterClick(letter)}
            className={`w-14 h-14 rounded-lg font-bold text-xl transition-all ${
              usedLetters.has(letter)
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {right.map((letter, i) => (
          <button
            key={`right-${i}`}
            onClick={() => onLetterClick(letter)}
            className={`w-14 h-14 rounded-lg font-bold text-xl transition-all ${
              usedLetters.has(letter)
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Bottom side */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {bottom.map((letter, i) => (
          <button
            key={`bottom-${i}`}
            onClick={() => onLetterClick(letter)}
            className={`w-14 h-14 rounded-lg font-bold text-xl transition-all ${
              usedLetters.has(letter)
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Left side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {left.map((letter, i) => (
          <button
            key={`left-${i}`}
            onClick={() => onLetterClick(letter)}
            className={`w-14 h-14 rounded-lg font-bold text-xl transition-all ${
              usedLetters.has(letter)
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Center box - just visual */}
      <div className="absolute inset-0 m-auto w-32 h-32 border-2 border-gray-300 dark:border-gray-600 rounded-lg pointer-events-none" />
    </div>
  );
}

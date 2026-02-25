'use client';

interface LetterBoxedBoxProps {
  sides: [string[], string[], string[], string[]];
  currentWord: string;
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

export default function LetterBoxedBox({ sides, currentWord, onLetterClick, disabled }: LetterBoxedBoxProps) {
  const [top, right, bottom, left] = sides;
  
  // Find which side the last letter came from (to prevent consecutive same-side)
  const lastLetter = currentWord.length > 0 ? currentWord[currentWord.length - 1] : null;
  let lastSide = -1;
  if (lastLetter) {
    sides.forEach((side, idx) => {
      if (side.includes(lastLetter)) lastSide = idx;
    });
  }
  
  const getLetterClass = (letter: string, sideIdx: number) => {
    const isDisabled = disabled || (lastSide === sideIdx && currentWord.length > 0);
    const baseClass = 'w-12 h-12 flex items-center justify-center text-xl font-bold rounded transition-all cursor-pointer select-none';
    
    if (isDisabled) {
      return `${baseClass} bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }
    
    return `${baseClass} bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 active:scale-95`;
  };
  
  const handleClick = (letter: string, sideIdx: number) => {
    if (disabled) return;
    if (lastSide === sideIdx && currentWord.length > 0) return;
    onLetterClick(letter);
  };
  
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Top side */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
        {top.map((letter, i) => (
          <button
            key={`top-${i}`}
            className={getLetterClass(letter, 0)}
            onClick={() => handleClick(letter, 0)}
            disabled={disabled || (lastSide === 0 && currentWord.length > 0)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Right side */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col gap-2">
        {right.map((letter, i) => (
          <button
            key={`right-${i}`}
            className={getLetterClass(letter, 1)}
            onClick={() => handleClick(letter, 1)}
            disabled={disabled || (lastSide === 1 && currentWord.length > 0)}
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
            className={getLetterClass(letter, 2)}
            onClick={() => handleClick(letter, 2)}
            disabled={disabled || (lastSide === 2 && currentWord.length > 0)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Left side */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col gap-2">
        {left.map((letter, i) => (
          <button
            key={`left-${i}`}
            className={getLetterClass(letter, 3)}
            onClick={() => handleClick(letter, 3)}
            disabled={disabled || (lastSide === 3 && currentWord.length > 0)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Center area showing current word */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold tracking-wider min-h-[2rem]">
            {currentWord || '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  );
}

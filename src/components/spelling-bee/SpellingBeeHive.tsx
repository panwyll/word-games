'use client';

import React from 'react';

interface SpellingBeeHiveProps {
  centerLetter: string;
  outerLetters: string[];
  onLetter: (letter: string) => void;
}

function HexCell({ letter, isCenter, onClick }: { letter: string; isCenter: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-16 h-16 flex items-center justify-center
        text-xl font-bold uppercase select-none
        transition-all duration-150 hover:opacity-80 active:scale-95
        ${isCenter ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'}
      `}
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
      aria-label={letter}
    >
      {letter}
    </button>
  );
}

export default function SpellingBeeHive({ centerLetter, outerLetters, onLetter }: SpellingBeeHiveProps) {
  const positions: React.CSSProperties[] = [
    { position: 'absolute', top: '0%', left: '50%', transform: 'translate(-50%, 0)' },
    { position: 'absolute', top: '25%', left: '88%', transform: 'translate(-50%, 0)' },
    { position: 'absolute', top: '75%', left: '88%', transform: 'translate(-50%, 0)' },
    { position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -100%)' },
    { position: 'absolute', top: '75%', left: '12%', transform: 'translate(-50%, 0)' },
    { position: 'absolute', top: '25%', left: '12%', transform: 'translate(-50%, 0)' },
  ];

  return (
    <div className="relative w-52 h-52 mx-auto my-4">
      {outerLetters.slice(0, 6).map((letter, i) => (
        <div key={letter + i} style={positions[i]}>
          <HexCell letter={letter} isCenter={false} onClick={() => onLetter(letter)} />
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <HexCell letter={centerLetter} isCenter onClick={() => onLetter(centerLetter)} />
      </div>
    </div>
  );
}

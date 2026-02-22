import type { WordleGuess } from '@/types/games';

interface WordleBoardProps {
  guesses: WordleGuess[];
  currentGuess: string;
  maxGuesses: number;
}

const stateColors: Record<string, string> = {
  correct: 'bg-green-600 text-white border-green-600',
  present: 'bg-yellow-500 text-white border-yellow-500',
  absent: 'bg-gray-600 text-white border-gray-600',
  unused: 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600',
};

export default function WordleBoard({ guesses, currentGuess, maxGuesses }: WordleBoardProps) {
  const rows = Array.from({ length: maxGuesses }, (_, i) => {
    if (i < guesses.length) return { type: 'guess' as const, data: guesses[i] };
    if (i === guesses.length) return { type: 'current' as const, data: currentGuess };
    return { type: 'empty' as const, data: '' };
  });

  return (
    <div className="grid gap-1.5" style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {Array.from({ length: 5 }, (_, colIndex) => {
            let letter = '';
            let colorClass = stateColors.unused;

            if (row.type === 'guess' && row.data) {
              const guessData = row.data as WordleGuess;
              letter = guessData.word[colIndex] || '';
              colorClass = stateColors[guessData.states[colIndex]] || stateColors.unused;
            } else if (row.type === 'current') {
              letter = (row.data as string)[colIndex] || '';
              if (letter) colorClass = 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-600 dark:border-gray-400';
            }

            const filled = !!letter;

            return (
              <div
                key={colIndex}
                className={`w-14 h-14 flex items-center justify-center text-2xl font-bold uppercase border-2 transition-all duration-200 ${colorClass} ${filled && row.type !== 'guess' ? 'scale-105' : ''}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

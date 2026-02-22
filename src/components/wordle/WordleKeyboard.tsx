import type { LetterState } from '@/types/games';

interface WordleKeyboardProps {
  letterStates: Record<string, LetterState>;
  onKey: (key: string) => void;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

const stateColors: Record<string, string> = {
  correct: 'bg-green-600 text-white',
  present: 'bg-yellow-500 text-white',
  absent: 'bg-gray-600 text-white',
  unused: 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white',
};

export default function WordleKeyboard({ letterStates, onKey }: WordleKeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const state = letterStates[key] || 'unused';
            const isWide = key === 'ENTER' || key === '⌫';
            return (
              <button
                key={key}
                data-key={key}
                onClick={() => onKey(key)}
                className={`${stateColors[state]} ${isWide ? 'px-3 text-xs' : 'w-9'} h-14 rounded font-bold uppercase transition-colors duration-200 hover:opacity-90 active:scale-95`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

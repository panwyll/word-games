'use client';

interface ConnectionsGridProps {
  words: string[];
  selected: string[];
  solved: Array<{ title: string; color: string; words: string[] }>;
  onSelect: (word: string) => void;
}

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-400 text-gray-900',
  green: 'bg-green-600 text-white',
  blue: 'bg-blue-600 text-white',
  purple: 'bg-purple-700 text-white',
};

export default function ConnectionsGrid({ words, selected, solved, onSelect }: ConnectionsGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {solved.map((cat) => (
        <div key={cat.title} className={`rounded-xl p-4 text-center ${colorMap[cat.color]}`}>
          <div className="font-bold text-sm uppercase tracking-wider mb-1">{cat.title}</div>
          <div className="text-sm">{cat.words.join(', ')}</div>
        </div>
      ))}
      <div className="grid grid-cols-4 gap-2">
        {words.map((word) => {
          const isSelected = selected.includes(word);
          return (
            <button
              key={word}
              onClick={() => onSelect(word)}
              className={`rounded-xl py-4 px-2 text-sm font-bold uppercase tracking-wide transition-all duration-150 
                ${isSelected
                  ? 'bg-gray-700 text-white scale-95'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}

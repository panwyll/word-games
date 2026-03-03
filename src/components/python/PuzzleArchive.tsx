'use client';

import Link from 'next/link';
import type { Puzzle } from '@/lib/python-puzzles';

interface PuzzleArchiveProps {
  archive: Array<{ date: Date; puzzle: Puzzle; dayNumber: number }>;
}

export default function PuzzleArchive({ archive }: PuzzleArchiveProps) {
  const groupByDifficulty = (puzzles: typeof archive) => {
    const groups: Record<string, typeof archive> = {
      Easy: [],
      Medium: [],
      Hard: []
    };
    
    puzzles.forEach(item => {
      if (groups[item.puzzle.difficulty]) {
        groups[item.puzzle.difficulty].push(item);
      }
    });
    
    return groups;
  };

  const grouped = groupByDifficulty(archive);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Python Puzzle Archive</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse all {archive.length} coding challenges
        </p>
      </div>

      {(['Easy', 'Medium', 'Hard'] as const).map(difficulty => {
        const items = grouped[difficulty];
        if (items.length === 0) return null;

        return (
          <div key={difficulty}>
            <h2 className={`text-xl font-bold mb-4 ${
              difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' :
              difficulty === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {difficulty} ({items.length})
            </h2>
            
            <div className="grid gap-3">
              {items.map(({ date, puzzle, dayNumber }) => (
                <Link
                  key={puzzle.id}
                  href={`/python/${puzzle.id}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {puzzle.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                          {puzzle.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {puzzle.description.split('\n')[0]}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Day #{dayNumber}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import LetterBoxedGame from './LetterBoxedGame';
import { getLetterBoxedPuzzleByDate } from '@/lib/letter-boxed-engine';

export default function LetterBoxedArchive() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const puzzle = getLetterBoxedPuzzleByDate(new Date(selectedDate));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select a date:
        </label>
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
      <LetterBoxedGame overridePuzzle={puzzle} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { VALID_ANSWERS } from '@/lib/wordle-words';
import { getDailySeed } from '@/lib/daily';
import WordleGame from './WordleGame';

const ARCHIVE_DAYS = 7;

export default function WordleArchive() {
  const seed = getDailySeed();
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null);

  if (selectedOffset !== null) {
    const targetSeed = seed - selectedOffset;
    const answer = VALID_ANSWERS[((targetSeed % VALID_ANSWERS.length) + VALID_ANSWERS.length) % VALID_ANSWERS.length];
    const date = new Date();
    date.setDate(date.getDate() - selectedOffset);
    return (
      <div>
        <button
          onClick={() => setSelectedOffset(null)}
          className="mb-6 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          ← Back to archive
        </button>
        <p className="text-center text-sm text-gray-500 mb-4">
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <WordleGame overrideAnswer={answer.toUpperCase()} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: ARCHIVE_DAYS }, (_, i) => {
        const offset = i + 1;
        const targetSeed = seed - offset;
        const answer = VALID_ANSWERS[((targetSeed % VALID_ANSWERS.length) + VALID_ANSWERS.length) % VALID_ANSWERS.length];
        const date = new Date();
        date.setDate(date.getDate() - offset);
        return (
          <button
            key={offset}
            onClick={() => setSelectedOffset(offset)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <span className="text-sm font-medium">
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-xs text-gray-400">{answer.length} letters →</span>
          </button>
        );
      })}
    </div>
  );
}

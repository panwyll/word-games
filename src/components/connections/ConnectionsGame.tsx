'use client';

import { useState } from 'react';
import ConnectionsGrid from './ConnectionsGrid';
import type { ConnectionsPuzzle } from '@/types/games';
import { getDailyConnectionsPuzzle } from '@/lib/connections-engine';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ConnectionsGame({ overridePuzzle }: { overridePuzzle?: ConnectionsPuzzle } = {}) {
  const puzzle: ConnectionsPuzzle = overridePuzzle ?? getDailyConnectionsPuzzle();
  const allWords = puzzle.categories.flatMap(c => c.words);

  const [words, setWords] = useState(() => shuffle(allWords));
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<typeof puzzle.categories>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const solvedWords = solved.flatMap(s => s.words);
  const remaining = words.filter(w => !solvedWords.includes(w));

  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const handleSelect = (word: string) => {
    if (gameOver) return;
    if (selected.includes(word)) {
      setSelected(prev => prev.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected(prev => [...prev, word]);
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 4) {
      showMessage('Select exactly 4 words');
      return;
    }

    const match = puzzle.categories.find(
      cat => !solved.includes(cat) && cat.words.every(w => selected.includes(w))
    );

    if (match) {
      const newSolved = [...solved, match];
      setSolved(newSolved);
      setSelected([]);
      if (newSolved.length === puzzle.categories.length) {
        setWon(true);
        setGameOver(true);
        showMessage('🎉 Brilliant! You found all the connections!', 5000);
      } else {
        showMessage('✅ Correct!');
      }
    } else {
      const oneAway = puzzle.categories.some(
        cat => !solved.includes(cat) && cat.words.filter(w => selected.includes(w)).length === 3
      );
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      showMessage(oneAway ? 'One away...' : 'Not quite!');
      if (newMistakes >= 4) {
        setGameOver(true);
        showMessage('Game over! Better luck next time.', 5000);
      }
      setSelected([]);
    }
  };

  const handleShuffle = () => {
    setWords(shuffle(allWords));
  };

  const mistakeDots = Array.from({ length: 4 }, (_, i) => i < mistakes);

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <div className="text-center px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium" role="alert">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <span>Mistakes:</span>
          {mistakeDots.map((used, i) => (
            <span key={i} className={`w-3 h-3 rounded-full inline-block ${used ? 'bg-gray-700 dark:bg-gray-300' : 'bg-gray-300 dark:bg-gray-600'}`} />
          ))}
        </div>
        <button onClick={handleShuffle} className="text-xs font-medium border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Shuffle
        </button>
      </div>

      <ConnectionsGrid
        words={remaining}
        selected={selected}
        solved={solved}
        onSelect={handleSelect}
      />

      {!gameOver && (
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
            className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Deselect all
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.length !== 4}
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
            data-testid="submit-guess"
          >
            Submit
          </button>
        </div>
      )}

      {gameOver && !won && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <h3 className="font-bold mb-3 text-center">The answers were:</h3>
          {puzzle.categories.map(cat => (
            <div key={cat.title} className="mb-2">
              <span className="font-semibold">{cat.title}:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{cat.words.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import PythonGame from '@/components/python/PythonGame';
import { getDailyPuzzle } from '@/lib/python-engine';
import Link from 'next/link';

export const metadata = { title: 'Python Puzzle – Word Games' };

export default function PythonPuzzlePage() {
  const puzzle = getDailyPuzzle();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Daily Python Challenge</h1>
        <p className="text-gray-500 text-sm mb-2">Solve today&apos;s coding puzzle</p>
        <Link 
          href="/python/archive" 
          className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium"
        >
          🔒 Archive — Premium
        </Link>
      </div>
      <PythonGame puzzle={puzzle} />
    </div>
  );
}

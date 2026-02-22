import WordleGame from '@/components/wordle/WordleGame';
import Link from 'next/link';

export const metadata = { title: 'Wordle – Word Games' };

export default function WordlePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Wordle</h1>
        <p className="text-gray-500 text-sm">Guess the 5-letter word in 6 tries</p>
        <Link href="/wordle/archive" className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
          🔒 Archive — Premium
        </Link>
      </div>
      <WordleGame />
    </div>
  );
}

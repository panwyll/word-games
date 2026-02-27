import LetterBoxedGame from '@/components/letter-boxed/LetterBoxedGame';
import Link from 'next/link';

export const metadata = { title: 'Letter Boxed – Word Games' };

export default function LetterBoxedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Letter Boxed 📦</h1>
        <p className="text-gray-500 text-sm">
          Form a word chain using all 12 letters. Last letter of each word starts the next.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          No consecutive letters from the same side!
        </p>
        <Link
          href="/letter-boxed/archive"
          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          🔒 Archive — Premium
        </Link>
      </div>
      <LetterBoxedGame />
    </div>
  );
}

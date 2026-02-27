import LetterBoxedGame from '@/components/letter-boxed/LetterBoxedGame';
import Link from 'next/link';

export const metadata = { title: 'Letter Boxed – Word Games' };

export default function LetterBoxedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Letter Boxed 📦</h1>
        <p className="text-gray-500 text-sm">Connect letters to make words. Use all 12 letters!</p>
        <p className="text-xs text-gray-400 mt-1">Letters on the same side cannot be used consecutively.</p>
        <Link href="/letter-boxed/archive" className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
          🔒 Archive — Premium
        </Link>
      </div>
      <LetterBoxedGame />
    </div>
  );
}

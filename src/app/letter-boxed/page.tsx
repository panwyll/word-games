import LetterBoxedGame from '@/components/letter-boxed/LetterBoxedGame';
import Link from 'next/link';

export const metadata = { title: 'Letter Boxed – Word Games' };

export default function LetterBoxedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Letter Boxed</h1>
        <p className="text-gray-500 text-sm">Connect letters to form words. Use all 12 letters!</p>
        <Link href="/letter-boxed/archive" className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
          🔒 Archive — Premium
        </Link>
      </div>
      <LetterBoxedGame />
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>📝 Words must be at least 3 letters</p>
        <p>🔄 Each word must start with the last letter of the previous word</p>
        <p>🚫 Cannot use consecutive letters from the same side</p>
      </div>
    </div>
  );
}

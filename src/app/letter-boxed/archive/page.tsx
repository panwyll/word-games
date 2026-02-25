import PremiumGate from '@/components/PremiumGate';
import LetterBoxedArchive from '@/components/letter-boxed/LetterBoxedArchive';

export const metadata = { title: 'Letter Boxed Archive – Word Games' };

export default function LetterBoxedArchivePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Letter Boxed Archive</h1>
        <p className="text-gray-500 text-sm">Play previous Letter Boxed puzzles</p>
      </div>
      <PremiumGate>
        <LetterBoxedArchive />
      </PremiumGate>
    </div>
  );
}

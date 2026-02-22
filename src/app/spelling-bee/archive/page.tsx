import PremiumGate from '@/components/PremiumGate';
import SpellingBeeArchive from '@/components/spelling-bee/SpellingBeeArchive';

export const metadata = { title: 'Spelling Bee Archive – Word Games' };

export default function SpellingBeeArchivePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Spelling Bee Archive 🐝</h1>
        <p className="text-gray-500 text-sm">Play previous Spelling Bee puzzles</p>
      </div>
      <PremiumGate>
        <SpellingBeeArchive />
      </PremiumGate>
    </div>
  );
}

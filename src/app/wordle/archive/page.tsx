import PremiumGate from '@/components/PremiumGate';
import WordleArchive from '@/components/wordle/WordleArchive';

export const metadata = { title: 'Wordle Archive – Word Games' };

export default function WordleArchivePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Wordle Archive</h1>
        <p className="text-gray-500 text-sm">Catch up on past puzzles</p>
      </div>
      <PremiumGate>
        <WordleArchive />
      </PremiumGate>
    </div>
  );
}

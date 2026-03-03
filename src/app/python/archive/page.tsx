import PuzzleArchive from '@/components/python/PuzzleArchive';
import { getPuzzleArchive } from '@/lib/python-engine';
import PremiumGate from '@/components/PremiumGate';

export const metadata = { title: 'Python Archive – Word Games' };

export default function PythonArchivePage() {
  const archive = getPuzzleArchive();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PremiumGate>
        <PuzzleArchive archive={archive} />
      </PremiumGate>
    </div>
  );
}

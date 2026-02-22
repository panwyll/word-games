import PremiumGate from '@/components/PremiumGate';
import ConnectionsArchive from '@/components/connections/ConnectionsArchive';

export const metadata = { title: 'Connections Archive – Word Games' };

export default function ConnectionsArchivePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Connections Archive</h1>
        <p className="text-gray-500 text-sm">Revisit past puzzles</p>
      </div>
      <PremiumGate>
        <ConnectionsArchive />
      </PremiumGate>
    </div>
  );
}

import ConnectionsGame from '@/components/connections/ConnectionsGame';
import Link from 'next/link';

export const metadata = { title: 'Connections – Word Games' };

export default function ConnectionsPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Connections</h1>
        <p className="text-gray-500 text-sm">Group 16 words into 4 categories. You have 4 attempts.</p>
        <Link href="/connections/archive" className="inline-flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
          🔒 Archive — Premium
        </Link>
      </div>
      <ConnectionsGame />
    </div>
  );
}

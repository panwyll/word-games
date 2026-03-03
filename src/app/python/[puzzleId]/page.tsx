import PythonGame from '@/components/python/PythonGame';
import { getPuzzleById } from '@/lib/python-puzzles';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Python Puzzle – Word Games' };

interface PageProps {
  params: Promise<{
    puzzleId: string;
  }>;
}

export default async function SpecificPuzzlePage({ params }: PageProps) {
  const { puzzleId } = await params;
  const puzzle = getPuzzleById(puzzleId);

  if (!puzzle) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/python" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Today&apos;s Challenge
        </Link>
      </div>
      <PythonGame puzzle={puzzle} />
    </div>
  );
}

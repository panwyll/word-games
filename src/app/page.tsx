import GameCard from '@/components/GameCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Word Games</h1>
        <p className="text-gray-500 text-lg">Daily word puzzles. A new challenge every day.</p>
        <p className="text-sm text-gray-400 mt-2">
          Free daily puzzles ·{' '}
          <Link href="/pricing" className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
            Unlock the full archive with Premium →
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GameCard
          href="/wordle"
          title="Wordle"
          description="Guess the 5-letter word in 6 tries."
          emoji="🟩"
          color="green"
        />
        <GameCard
          href="/connections"
          title="Connections"
          description="Group 16 words into 4 categories."
          emoji="🟨"
          color="yellow"
        />
        <GameCard
          href="/spelling-bee"
          title="Spelling Bee"
          description="Make words from 7 letters. Must use center letter."
          emoji="🐝"
          color="amber"
        />
      </div>
    </div>
  );
}

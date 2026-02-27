import GameCard from '@/components/GameCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Word Games
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl mb-4">
            Daily puzzles. A new challenge every day.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Free daily puzzles ·{' '}
            <Link href="/pricing" className="text-yellow-600 dark:text-yellow-400 hover:underline font-semibold">
              Unlock the full archive with Premium →
            </Link>
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
          <GameCard
            href="/letter-boxed"
            title="Letter Boxed"
            description="Connect letters to form words. Use all 12 letters!"
            emoji="🔷"
            color="blue"
          />
          <GameCard
            href="/sudoku"
            title="Sudoku"
            description="Fill the 9×9 grid with numbers 1-9."
            emoji="🔢"
            color="indigo"
          />
          <GameCard
            href="/crossword"
            title="Crossword"
            description="Solve clues to fill in the crossword puzzle."
            emoji="📝"
            color="purple"
          />
        </div>

        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold mb-3">Premium Features</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get unlimited access to our entire puzzle archive with a premium subscription
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

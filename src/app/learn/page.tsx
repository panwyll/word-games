import Link from 'next/link';
import { LEARNING_CONCEPTS } from '@/lib/learning-resources';

export const metadata = { title: 'Learn – Word Games' };

export default function LearnPage() {
  const byCategory = {
    'data-structure': LEARNING_CONCEPTS.filter(c => c.category === 'data-structure'),
    'algorithm': LEARNING_CONCEPTS.filter(c => c.category === 'algorithm'),
    'technique': LEARNING_CONCEPTS.filter(c => c.category === 'technique'),
  };

  const categoryNames = {
    'data-structure': 'Data Structures',
    'algorithm': 'Algorithms',
    'technique': 'Techniques',
  };

  const categoryEmojis = {
    'data-structure': '📦',
    'algorithm': '⚡',
    'technique': '🎯',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Master algorithms and data structures through interactive examples
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(byCategory).map(([category, concepts]) => (
          concepts.length > 0 && (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                <span>{categoryNames[category as keyof typeof categoryNames]}</span>
                <span className="text-sm font-normal text-gray-500">({concepts.length})</span>
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {concepts.map(concept => (
                  <Link
                    key={concept.id}
                    href={`/learn/${concept.id}`}
                    className="block p-5 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-105"
                  >
                    <div className="mb-3">
                      <h3 className="font-bold text-lg mb-1">{concept.name}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          concept.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          concept.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {concept.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {concept.description.split('\n\n')[0]}
                    </p>
                    {concept.relatedPuzzles.length > 0 && (
                      <div className="mt-3 text-xs text-gray-500">
                        {concept.relatedPuzzles.length} related puzzle{concept.relatedPuzzles.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Practice?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Apply what you&apos;ve learned with our daily coding challenges
        </p>
        <Link
          href="/python"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Start Today&apos;s Challenge →
        </Link>
      </div>
    </div>
  );
}

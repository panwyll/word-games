import { getConceptById } from '@/lib/learning-resources';
import { getPuzzleById } from '@/lib/python-puzzles';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Learn – Word Games' };

interface PageProps {
  params: Promise<{
    conceptId: string;
  }>;
}

export default async function ConceptPage({ params }: PageProps) {
  const { conceptId } = await params;
  const concept = getConceptById(conceptId);

  if (!concept) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link 
          href="/learn" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Learning Resources
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h1 className="text-3xl font-bold mb-4">{concept.name}</h1>
        <div className="flex gap-2 mb-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded ${
            concept.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            concept.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {concept.difficulty}
          </span>
          <span className="px-3 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {concept.category.replace('-', ' ')}
          </span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {concept.description}
          </p>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-300">Key Points</h2>
        <ul className="space-y-2">
          {concept.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Complexity */}
      {(concept.timeComplexity || concept.spaceComplexity) && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800 mb-8">
          <h2 className="text-xl font-bold mb-4 text-purple-900 dark:text-purple-300">Complexity</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {concept.timeComplexity && (
              <div>
                <span className="font-semibold">Time Complexity:</span> {concept.timeComplexity}
              </div>
            )}
            {concept.spaceComplexity && (
              <div>
                <span className="font-semibold">Space Complexity:</span> {concept.spaceComplexity}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Use Cases */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-8">
        <h2 className="text-xl font-bold mb-4 text-green-900 dark:text-green-300">Common Use Cases</h2>
        <ul className="space-y-2">
          {concept.useCases.map((useCase, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Example */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-4">Code Examples</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{concept.codeExample}</code>
        </pre>
      </div>

      {/* Related Puzzles */}
      {concept.relatedPuzzles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Practice Problems</h2>
          <div className="grid gap-3">
            {concept.relatedPuzzles.map(puzzleId => {
              const puzzle = getPuzzleById(puzzleId);
              if (!puzzle) return null;
              
              return (
                <Link
                  key={puzzleId}
                  href={`/python/${puzzleId}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{puzzle.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{puzzle.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      puzzle.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      puzzle.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Further Reading */}
      {concept.furtherReading.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Further Reading</h2>
          <ul className="space-y-2">
            {concept.furtherReading.map((resource, idx) => (
              <li key={idx}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {resource.title} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

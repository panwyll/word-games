interface WordleResultProps {
  won: boolean;
  answer: string;
  guessCount: number;
  onShare: () => void;
  onReset?: () => void;
}

export default function WordleResult({ won, answer, guessCount, onShare, onReset }: WordleResultProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
        <div className="text-5xl mb-4">{won ? '🎉' : '😞'}</div>
        <h2 className="text-2xl font-bold mb-2">{won ? 'Brilliant!' : 'Better luck tomorrow!'}</h2>
        {won && <p className="text-gray-500 mb-1">You solved it in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!</p>}
        {!won && <p className="text-lg font-semibold mb-2">The word was <span className="text-green-600">{answer}</span></p>}
        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={onShare}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors"
          >
            Share
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-6 py-2 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

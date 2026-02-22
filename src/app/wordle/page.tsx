import WordleGame from '@/components/wordle/WordleGame';

export const metadata = { title: 'Wordle – Word Games' };

export default function WordlePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Wordle</h1>
        <p className="text-gray-500 text-sm">Guess the 5-letter word in 6 tries</p>
      </div>
      <WordleGame />
    </div>
  );
}

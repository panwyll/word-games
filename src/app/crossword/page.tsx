import CrosswordGame from '@/components/crossword/CrosswordGame';

export const metadata = { title: 'Crossword – Word Games' };

export default function CrosswordPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Crossword</h1>
        <p className="text-gray-500 text-sm">Solve the daily crossword puzzle</p>
      </div>
      <CrosswordGame />
    </div>
  );
}

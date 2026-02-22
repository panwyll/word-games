import SpellingBeeGame from '@/components/spelling-bee/SpellingBeeGame';

export const metadata = { title: 'Spelling Bee – Word Games' };

export default function SpellingBeePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Spelling Bee 🐝</h1>
        <p className="text-gray-500 text-sm">Make words using the 7 letters. Must include the center letter.</p>
      </div>
      <SpellingBeeGame />
    </div>
  );
}
